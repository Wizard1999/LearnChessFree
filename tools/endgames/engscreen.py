"""Engine pre-screening for candidate positions (NOT learner-facing evidence: the tablebase decides what ships).

The local Stockfish (tools/engine.py) is used only to rank candidates cheaply so that scarce tablebase queries are not wasted on positions
that obviously do not show the idea. Scores are cached on disk (cache/eng.jsonl), keyed by FEN + depth, so reruns are fast and
deterministic.

    import engscreen as ES
    ES.score(fen, depth=14)          # centipawns, WHITE's point of view (mate = +-10000)
    ES.cls(fen)                      # 'win_w' | 'win_b' | 'draw' | 'unclear'   (White's point of view, depth 14)
    ES.multipv(fen, depth, k)        # [(uci, score from the MOVER's point of view)] best first
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent))

import chess  # noqa: E402

CACHE = HERE / "cache" / "eng.jsonl"
_mem = {}
_eng = None


def _load():
    if _mem:
        return
    if CACHE.exists():
        for line in CACHE.read_text(encoding="utf-8").splitlines():
            try:
                k, v = json.loads(line)
                _mem[k] = v
            except Exception:
                pass


def _engine():
    global _eng
    if _eng is None:
        from engine import Engine
        _eng = Engine(hash_mb=64)
    return _eng


def close():
    global _eng
    if _eng is not None:
        _eng.close()
        _eng = None


def _put(k, v):
    _mem[k] = v
    CACHE.parent.mkdir(parents=True, exist_ok=True)
    with open(CACHE, "a", encoding="utf-8") as fh:
        fh.write(json.dumps([k, v]) + "\n")


def _sc(r):
    return (10000 - abs(r["value"])) * (1 if r["value"] > 0 else -1) if r["kind"] == "mate" else r["value"]


def multipv(fen, depth=14, k=1):
    """[(uci, mover-POV score)] best first (cached)."""
    _load()
    key = f"{' '.join(fen.split()[:4])}|{depth}|{k}"
    if key in _mem:
        return [tuple(x) for x in _mem[key]]
    b = chess.Board(fen)
    n = max(1, min(k, b.legal_moves.count()))
    if n == 0:
        return []
    res = _engine().search(b.fen(), depth=depth, multipv=n)
    out = [(res[i]["pv"][0], _sc(res[i])) for i in sorted(res)]
    _put(key, out)
    return out


def score(fen, depth=14):
    """White-POV centipawns of the best move."""
    mv = multipv(fen, depth, 1)
    if not mv:
        b = chess.Board(fen)
        if b.is_checkmate():
            return -10000 if b.turn == chess.WHITE else 10000
        return 0
    s = mv[0][1]
    return s if chess.Board(fen).turn == chess.WHITE else -s


def cls(fen, depth=14, win=300, draw=45):
    s = score(fen, depth)
    if s >= win:
        return "win_w"
    if s <= -win:
        return "win_b"
    if abs(s) <= draw:
        return "draw"
    return "unclear"


def mover_cls(fen, depth=14, win=300, draw=45):
    """'win' | 'draw' | 'loss' | 'unclear' for the side to move."""
    c = cls(fen, depth, win, draw)
    if c == "draw" or c == "unclear":
        return c
    white = chess.Board(fen).turn == chess.WHITE
    return "win" if (c == "win_w") == white else "loss"
