"""Own Lichess-tablebase client for the endgame generators.

WHY A QUEUE: the public service rate-limits one IP hard (HTTP 429 after a couple of requests), and several agents share this IP. So:
  * generators never block on the network. `tb.get(fen)` reads the caches only; `tb.enqueue(fens, tag)` adds positions to a persistent
    queue (cache/queue.jsonl); the background daemon `fetcher.py` drains the queue slowly and politely into cache/tb.jsonl.
  * a generator is run more than once: pass 1 builds candidates and enqueues the positions it needs; later passes assemble items from
    whatever the cache holds (positions not fetched yet are skipped and counted as 'pending').
  * caches: cache/tb.jsonl (append-only, written by the daemon only, key = first 4 FEN fields) and, read-only, the project-wide
    library/cache/tablebase.json (full-FEN keys; never written from here).
The category mapping is EXACTLY the validator's (tools/validate.py, claim type `tablebase`):
  win/maybe-win/syzygy-win -> win ; draw/cursed-win/blessed-loss -> draw ; loss/maybe-loss/syzygy-loss -> loss,
and for a move the row category (for the side to move AFTER the move) is inverted. `pure=True` helpers refuse cursed/blessed/maybe
categories, so no generated item rests on a fifty-move-rule subtlety.
"""
from __future__ import annotations

import json
import os
import threading
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent
CACHE_DIR = Path(__file__).resolve().parent / "cache"
CACHE_FILE = CACHE_DIR / "tb.jsonl"
QUEUE_FILE = CACHE_DIR / "queue.jsonl"
SHARED_CACHE = ROOT / "library" / "cache" / "tablebase.json"

_lock = threading.Lock()
_mem: dict = {}
_shared = None
_loaded_size = -1

PURE = {"win": "win", "draw": "draw", "loss": "loss"}
LOOSE = {"win": "win", "cursed-win": "draw", "draw": "draw", "blessed-loss": "draw", "loss": "loss",
         "maybe-win": "win", "syzygy-win": "win", "maybe-loss": "loss", "syzygy-loss": "loss"}
INV = {"win": "loss", "loss": "win", "draw": "draw"}


def key(fen: str) -> str:
    return " ".join(fen.split()[:4])


def reload(force: bool = False):
    """(Re)read cache/tb.jsonl if it grew."""
    global _loaded_size
    CACHE_DIR.mkdir(parents=True, exist_ok=True)
    if not CACHE_FILE.exists():
        return
    size = CACHE_FILE.stat().st_size
    if size == _loaded_size and not force:
        return
    with _lock:
        with open(CACHE_FILE, encoding="utf-8") as fh:
            for line in fh:
                line = line.strip()
                if not line:
                    continue
                try:
                    k, d = json.loads(line)
                except Exception:
                    continue
                _mem[k] = d
        _loaded_size = size


def _load_shared():
    global _shared
    if _shared is None:
        _shared = {}
        try:
            raw = json.loads(SHARED_CACHE.read_text(encoding="utf-8"))
            for f, d in raw.items():
                _shared[key(f)] = d
        except Exception:
            pass
    return _shared


def get(fen: str):
    """Cached tablebase JSON or None. Never touches the network."""
    reload()
    k = key(fen)
    d = _mem.get(k)
    if d is not None:
        return d
    return _load_shared().get(k)


def have(fen: str) -> bool:
    return get(fen) is not None


# ----------------------------------------------------------------------------------------------------------------
# queue
# ----------------------------------------------------------------------------------------------------------------
def enqueue(fens, tag: str = "misc", prio: int = 5):
    """Append positions that are not cached and not yet queued. Returns the number newly queued."""
    CACHE_DIR.mkdir(parents=True, exist_ok=True)
    queued = set()
    if QUEUE_FILE.exists():
        for line in QUEUE_FILE.read_text(encoding="utf-8").splitlines():
            try:
                queued.add(key(json.loads(line)["fen"]))
            except Exception:
                pass
    n = 0
    lines = []
    for f in fens:
        k = key(f)
        if k in queued or get(f) is not None:
            continue
        queued.add(k)
        lines.append(json.dumps({"fen": f, "tag": tag, "prio": prio}))
        n += 1
    if lines:
        with open(QUEUE_FILE, "a", encoding="utf-8") as fh:
            fh.write("\n".join(lines) + "\n")
    return n


def pending(fens):
    return [f for f in fens if get(f) is None]


# ----------------------------------------------------------------------------------------------------------------
# network (used by fetcher.py only)
# ----------------------------------------------------------------------------------------------------------------
def fetch_once(fen: str):
    """One HTTP attempt. Returns (status, json|None). status: 200, 429, 400, or 0 for network errors."""
    url = "https://tablebase.lichess.ovh/standard?fen=" + urllib.parse.quote(fen.replace(" ", "_"), safe="/_-")
    try:
        with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": "chess-school-endgame-generator"}), timeout=40) as r:
            return 200, json.load(r)
    except urllib.error.HTTPError as ex:
        return ex.code, None
    except Exception:
        return 0, None


def store(fen: str, d: dict):
    CACHE_DIR.mkdir(parents=True, exist_ok=True)
    k = key(fen)
    with _lock:
        _mem[k] = d
        with open(CACHE_FILE, "a", encoding="utf-8") as fh:
            fh.write(json.dumps([k, d]) + "\n")


# ----------------------------------------------------------------------------------------------------------------
# interpretation (mover's point of view); all cache-only
# ----------------------------------------------------------------------------------------------------------------
def result(fen: str, pure: bool = True):
    """'win' | 'draw' | 'loss' for the side to move; None if not cached (or, when pure, a cursed/blessed category)."""
    d = get(fen)
    if d is None:
        return None
    return (PURE if pure else LOOSE).get(d["category"])


def moves(fen: str, pure: bool = True):
    """{uci: result for the MOVER after playing it} (validator semantics); None if not cached or (pure) any category impure."""
    d = get(fen)
    if d is None:
        return None
    out = {}
    for r in d["moves"]:
        c = r["category"]
        if pure and c not in PURE:
            return None
        out[r["uci"]] = INV[LOOSE[c]]
    return out


def move_rows(fen: str):
    d = get(fen)
    return {r["uci"]: r for r in d["moves"]} if d else None


def dtm(fen: str):
    """Depth to mate in PLIES for the side to move, or None (only available for small endings)."""
    d = get(fen)
    if not d:
        return None
    v = d.get("dtm")
    return v if v else None


def dtz(fen: str):
    d = get(fen)
    return d.get("dtz") if d else None
