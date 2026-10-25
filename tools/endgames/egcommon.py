"""Shared helpers for the tablebase-backed endgame generators (tools/endgames/gen_*.py).

Design rules
  * Every learner-facing result is a Lichess-tablebase claim (<= 7 pieces) checked by tools/validate.py. The generators pre-check every claim
    with the SAME semantics (tb.py) before an item is kept, so the validator should pass 100 percent; a failure there means a bug here.
  * Positions are built programmatically from templates ("standard instances" of an idea), never typed in by hand.
  * 'Only' means only: a find_move item carries one claim for EVERY legal move (accepted moves keep the result, all others lose it).
  * Contrast pairs share ONE family, so the two halves can never be split between practice and test.
  * Cursed wins / blessed losses (50-move-rule categories) and 'maybe' categories are never used.
  * Files are written atomically (temp file, then rename). Ids: positions PE-<AREA>-n, items IE-<AREA>-n, families FAM-IE-<AREA>-n.
"""
from __future__ import annotations

import json
import os
import random
import re
import sys
from collections import Counter
from pathlib import Path

HERE = Path(__file__).resolve().parent
TOOLS = HERE.parent
ROOT = TOOLS.parent
for _p in (str(TOOLS), str(HERE)):
    if _p not in sys.path:
        sys.path.insert(0, _p)

import chess  # noqa: E402

import tb  # noqa: E402

ITEMS_DIR = ROOT / "content" / "items"
SKILLS_DIR = ROOT / "content" / "skills"
MY_PREFIX = "end-"          # all my output files start with this
IDMAP_DIR = HERE / "idmap"   # sticky id maps (one per output file): an id, once given to a (position, task), is never reused or renumbered

P, N, B, R, Q, K = chess.PAWN, chess.KNIGHT, chess.BISHOP, chess.ROOK, chess.QUEEN, chess.KING
WHITE, BLACK = chess.WHITE, chess.BLACK
CNAME = {WHITE: "white", BLACK: "black"}
CTITLE = {WHITE: "White", BLACK: "Black"}
PNAME = {P: "pawn", N: "knight", B: "bishop", R: "rook", Q: "queen", K: "king"}

_TIER = {}


def tier_of(node: str) -> int:
    if not _TIER:
        for f in SKILLS_DIR.glob("END.*.json"):
            d = json.loads(f.read_text(encoding="utf-8"))
            _TIER[d["id"]] = d["tier"]
    return _TIER[node]


# ----------------------------------------------------------------------------------------------------------------
# boards
# ----------------------------------------------------------------------------------------------------------------
def sq(name: str) -> int:
    return chess.parse_square(name)


def make(pieces: str, turn: bool = WHITE) -> chess.Board:
    """pieces: 'Ke1 Pe2 ke8 rf8'  (capital = white, small = black; K,Q,R,B,N,P)."""
    b = chess.Board(None)
    b.castling_rights = 0
    for tok in pieces.split():
        sym, name = tok[0], tok[1:]
        b.set_piece_at(sq(name), chess.Piece.from_symbol(sym))
    b.turn = turn
    return b


def fen_key(fen: str) -> str:
    return " ".join(fen.split()[:4])


def mirror(board):      # a <-> h
    return board.transform(chess.flip_horizontal)


def flip(board):        # colours swapped, board turned over, turn flipped
    return board.mirror()


def tmap(s, kind):
    return {"orig": s, "mirror": s ^ 7, "flip": s ^ 56, "mirrorflip": s ^ 63}[kind]


def tmove(uci, kind):
    m = chess.Move.from_uci(uci)
    return chess.Move(tmap(m.from_square, kind), tmap(m.to_square, kind), m.promotion).uci()


def vboard(base, kind):
    if kind == "orig":
        b = base.copy(stack=False)
    elif kind == "mirror":
        b = mirror(base)
    elif kind == "flip":
        b = flip(base)
    else:
        b = flip(mirror(base))
    b.castling_rights = 0
    b.ep_square = None
    return b


def piece_count(b):
    return len(b.piece_map())


def square_name(s):
    return chess.square_name(s)


def orient(board):
    return "white" if board.turn == WHITE else "black"


def kings_ok(b):
    return b.is_valid() and chess.square_distance(b.king(WHITE), b.king(BLACK)) > 1


# ----------------------------------------------------------------------------------------------------------------
# registry of taken positions
# ----------------------------------------------------------------------------------------------------------------
def _collect(obj, out):
    if isinstance(obj, dict):
        for k, v in obj.items():
            if k == "fen" and isinstance(v, str):
                out.add(fen_key(v))
            else:
                _collect(v, out)
    elif isinstance(obj, list):
        for v in obj:
            _collect(v, out)


def foreign_fens(regen=()):
    """FEN keys in every content file except the files named in `regen` (the ones this run is about to rewrite). Other agents may be
    writing concurrently; reads are tolerant. My own other end-*.json files ARE included, so my files never share a position."""
    out = set()
    for p in sorted((ROOT / "content").rglob("*.json")):
        if "_evidence" in p.parts or p.name in regen:
            continue
        try:
            _collect(json.loads(p.read_text(encoding="utf-8")), out)
        except Exception:
            pass
    return out


# ----------------------------------------------------------------------------------------------------------------
# claim helpers and the pre-check (same semantics as tools/validate.py for the tablebase claim)
# ----------------------------------------------------------------------------------------------------------------
def claim(cid, ctype, statement=None, **params):
    c = {"id": cid, "type": ctype, "params": params}
    if statement:
        c["statement"] = statement
    return c


def tb_claim_value(fen, move=None):
    """What the validator will measure for a tablebase claim on this fen (loose mapping, exactly as in validate.py)."""
    d = tb.get(fen)
    if d is None:
        return None
    if move is None:
        return tb.LOOSE.get(d["category"], d["category"])
    row = next((x for x in d["moves"] if x["uci"] == move), None)
    if row is None:
        return None
    m = tb.LOOSE.get(row["category"], row["category"])
    return {"win": "loss", "loss": "win", "draw": "draw"}.get(m, m)


_engine = None
_validate = None


def _engine_check(fen, c):
    global _engine, _validate
    if _validate is None:
        import validate as v
        _validate = v
        from engine import Engine
        _engine = Engine()
    r = _validate.check_claim(_engine, {"fen": fen}, c)
    return r["result"] == "pass"


def close_engine():
    global _engine
    if _engine is not None:
        _engine.close()
        _engine = None


def precheck(fen, claims):
    for c in claims:
        if c["type"] == "tablebase":
            p = c["params"]
            if tb_claim_value(fen, p.get("move")) != p["result"]:
                return False
        else:
            if not _engine_check(fen, c):
                return False
    return True


# ----------------------------------------------------------------------------------------------------------------
# the generator object
# ----------------------------------------------------------------------------------------------------------------
class Gen:
    """Collects positions and items for ONE output file `end-<name>.json`.

    gen = Gen(area='KEYSQ', filename='end-keysq.json', script='gen_pawn.py', seed=...)
    `need` collects FENs whose tablebase data is not cached yet (the caller enqueues them with tb.enqueue).
    """

    def __init__(self, area, filename, script, seed, foreign):
        self.area, self.filename, self.script, self.seed = area, filename, script, seed
        self.rng = random.Random(seed)
        self.foreign = foreign           # FEN keys of content that is not mine (never reused)
        self.positions, self.items = [], []
        self.pos_by_key = {}
        self.tasks_by_key = {}
        self.fam_n = 0
        self.stats = Counter()
        self.cg_n = 0
        self.need = []
        self.fam_by_pos = {}
        self.idmap = self._load_idmap()

    # ids -------------------------------------------------------------------
    def _load_idmap(self):
        p = IDMAP_DIR / (self.filename + ".json")
        try:
            d = json.loads(p.read_text(encoding="utf-8"))
        except Exception:
            d = {}
        d.setdefault("pos", {})
        d.setdefault("item", {})
        d.setdefault("fam", {})
        d.setdefault("cg", {})
        d.setdefault("next_pos", 1)
        d.setdefault("next_item", 1)
        d.setdefault("next_fam", 1)
        d.setdefault("next_cg", 1)
        return d

    def _num(self, kind, key):
        m = self.idmap[kind]
        if key not in m:
            m[key] = self.idmap["next_" + kind]
            self.idmap["next_" + kind] += 1
        return m[key]

    def new_family(self):
        self.fam_n += 1
        return f"FAM-IE-{self.area}-{self.fam_n:02d}"

    def new_cg(self):
        self.cg_n += 1
        return f"CG-IE-{self.area}-{self.cg_n:02d}"

    # positions --------------------------------------------------------------
    def fresh(self, board):
        """True if this placement is not in other content and not already used by me."""
        k = fen_key(board.fen())
        return k not in self.foreign and k not in self.pos_by_key

    def have(self, board_or_fen):
        """True if the tablebase data is cached; otherwise remember the FEN as needed and return False."""
        fen = board_or_fen if isinstance(board_or_fen, str) else board_or_fen.fen()
        if tb.have(fen):
            return True
        self.need.append(fen)
        return False

    def _position(self, board, family, ref):
        k = fen_key(board.fen())
        if k in self.pos_by_key:
            return self.pos_by_key[k]
        pid = f"PE-{self.area}-{self._num('pos', k)}"
        self.positions.append({"id": pid, "fen": board.fen(), "family": family,
                               "provenance": {"kind": "generated", "ref": f"tools/endgames/{self.script} seed={self.seed}: {ref}", "licence": "project"}})
        self.pos_by_key[k] = pid
        self.fam_by_pos[pid] = family
        return pid

    # items ------------------------------------------------------------------
    def add(self, board, family, item, ref, allow_shared_position=True):
        """item: every item field except id/position. Returns the item id, or None if rejected. A position may carry several items of
        DIFFERENT tasks (predict, then find the move, then play it out); they share one family by construction."""
        fen = board.fen()
        k = fen_key(fen)
        if not board.is_valid():
            self.stats["invalid"] += 1
            return None
        if k in self.foreign:
            self.stats["duplicate-fen-foreign"] += 1
            return None
        if k in self.pos_by_key:
            if not allow_shared_position or item["task"] in self.tasks_by_key[k] or self.fam_by_pos[self.pos_by_key[k]] != family:
                self.stats["duplicate-fen"] += 1
                return None
        if piece_count(board) > 7:
            self.stats["over-7-pieces"] += 1
            return None
        if not precheck(fen, item["claims"]):
            self.stats["precheck-reject"] += 1
            return None
        pid = self._position(board, family, ref)
        it = dict(item)
        it["id"] = f"IE-{self.area}-{self._num('item', k + '|' + item['task'])}"
        it["position"] = pid
        it.setdefault("orientation", orient(board))
        it.setdefault("review", {"status": "machine-only"})
        self.items.append(it)
        self.tasks_by_key.setdefault(k, set()).add(item["task"])
        self.stats["items"] += 1
        return it["id"]

    def checkpoint(self):
        """Remember how much has been added; `rollback(cp)` removes everything added since (used when a group of items is only valid as a
        whole, e.g. companion items that exist only to prove a statement in a main item that then failed)."""
        return (len(self.items), len(self.positions))

    def rollback(self, cp):
        ni, np_ = cp
        del self.items[ni:]
        del self.positions[np_:]
        self.pos_by_key = {}
        self.fam_by_pos = {}
        for p in self.positions:
            self.pos_by_key[fen_key(p["fen"])] = p["id"]
            self.fam_by_pos[p["id"]] = p["family"]
        self.tasks_by_key = {}
        by_id = {p["id"]: fen_key(p["fen"]) for p in self.positions}
        for it in self.items:
            self.tasks_by_key.setdefault(by_id[it["position"]], set()).add(it["task"])

    def _stable_aliases(self):
        """Family and contrast-group labels are handed out in generation order while building; before writing they are replaced by
        labels that stay the same across reruns (keyed by the first (position, task) that uses them)."""
        key_of_pos = {p["id"]: fen_key(p["fen"]) for p in self.positions}
        fam_first, cg_first = {}, {}
        fam_of_pos = {p["id"]: p["family"] for p in self.positions}
        for it in self.items:
            key = key_of_pos[it["position"]] + "|" + it["task"]
            fam_first.setdefault(fam_of_pos[it["position"]], key)
            if it.get("contrast_group"):
                cg_first.setdefault(it["contrast_group"], key)
        alias = {}
        for f, key in fam_first.items():
            alias[f] = f"FAM-IE-{self.area}-{self._num('fam', key):02d}"
        for c, key in cg_first.items():
            alias[c] = f"CG-IE-{self.area}-{self._num('cg', key):02d}"
        return alias

    def _prune_orphans(self):
        """A contrast group needs at least two items. When one half of a pair was rejected (for example a cursed-win position), the other half
        is dropped too, together with positions that no item uses any more."""
        count = Counter(it.get("contrast_group") for it in self.items if it.get("contrast_group"))
        keep = [it for it in self.items if not it.get("contrast_group") or count[it["contrast_group"]] >= 2]
        dropped = len(self.items) - len(keep)
        if dropped:
            self.stats["orphan-pair-half-dropped"] += dropped
            self.items = keep
            used = {it["position"] for it in self.items}
            self.positions = [p for p in self.positions if p["id"] in used]
            self.items = list(self.items)

    def write(self):
        self._prune_orphans()
        out = {"positions": self.positions, "items": self.items}
        path = ITEMS_DIR / self.filename
        tmp = path.with_name(path.name + ".tmp")
        alias = self._stable_aliases()
        text = json.dumps(out, indent=1, ensure_ascii=False) + "\n"
        text = re.sub(r"(?:FAM|CG)-IE-[A-Z0-9]+-\d+", lambda m: alias.get(m.group(0), m.group(0)), text)
        tmp.write_text(text, encoding="utf-8")
        os.replace(tmp, path)
        IDMAP_DIR.mkdir(parents=True, exist_ok=True)
        mp = IDMAP_DIR / (self.filename + ".json")
        mtmp = mp.with_name(mp.name + ".tmp")
        mtmp.write_text(json.dumps(self.idmap, indent=0, sort_keys=True) + "\n", encoding="utf-8")
        os.replace(mtmp, mp)
        return path

    def flush_need(self, tag, prio=5):
        n = tb.enqueue(self.need, tag, prio) if self.need else 0
        return n


class Quota:
    """Counts accepted + pending candidates for one template; `open()` is False once accepted + pending >= quota."""

    def __init__(self, name, quota):
        self.name, self.quota, self.accepted, self.pending = name, quota, 0, 0

    def open(self):
        return self.accepted + self.pending < self.quota

    def ok(self, n=1):
        self.accepted += n

    def wait(self, n=1):
        self.pending += n

    def __repr__(self):
        return f"{self.name}: {self.accepted}/{self.quota} (+{self.pending} pending)"


# ----------------------------------------------------------------------------------------------------------------
# tags
# ----------------------------------------------------------------------------------------------------------------
def tags_for(node, cue, family, task, extra=(), also_nodes=()):
    t = [f"node.{node}"] + [f"node.{n}" for n in also_nodes] + [f"tier.{tier_of(node)}", f"cue.{cue}", "kind.generated",
                                                                f"family.{family}", "lang.en", f"task.{task}", "theme.endgame"]
    t.extend(extra)
    return t


# ----------------------------------------------------------------------------------------------------------------
# item builders
# ----------------------------------------------------------------------------------------------------------------
RES_WORD = {"win": "wins", "draw": "draws", "loss": "loses"}


def result_for(board):
    """Pure mover result from the tablebase, or None."""
    return tb.result(board.fen(), pure=True)


def predict_prompt(board, options, what=None):
    stm = CTITLE[board.turn]
    if what:
        return what
    if set(options) == {"win", "draw"}:
        return f"{stm} to move. With best play from both sides, is this a win for {CNAME[board.turn]} or a draw? Predict, then check."
    return f"{stm} to move. With best play from both sides, is the result a win, a draw or a loss for {CNAME[board.turn]}? Predict, then check."


def predict_item(g, board, fam, node, depth, cue, hints, idea_tags=(), cg=None, role=None, options=("win", "draw", "loss"),
                 prompt=None, review="machine-only", also_nodes=(), note=None, explain_extra="", ref=None, family_tag=True):
    """predict_outcome: win/draw/loss for the side to move (or win/draw when the options say so)."""
    res = result_for(board)
    if res is None or res not in options:
        g.stats["no-clean-result"] += 1
        return None
    stm = CNAME[board.turn]
    expl = {"win": f"{stm.capitalize()} wins with best play: the tablebase confirms it.",
            "draw": "With best play the game is drawn: the tablebase confirms it.",
            "loss": f"{stm.capitalize()} loses with best play: the tablebase confirms it."}[res]
    if explain_extra:
        expl += " " + explain_extra
    ex = list(idea_tags)
    if role:
        ex.append(f"role.{role}")
    if cg:
        ex.append(f"contrast.{cg}")
    item = {"skill": f"{node}.D{depth}", "cue": cue, "task": "predict_outcome", "prompt": predict_prompt(board, options, prompt),
            "options": list(options),
            "answer": {"outcome": res, "options": list(options)},
            "claims": [claim("C1", "tablebase", f"With best play the result for the side to move is a {res}.", result=res)],
            "hints": list(hints), "explain": expl,
            "tags": tags_for(node, cue, fam, "predict_outcome", ex, also_nodes),
            "review": {"status": review}}
    if cg:
        item["contrast_group"] = cg
    if note:
        item["note"] = note
    return g.add(board, fam, item, ref or f"{node} predict {res}")


def _san(board, uci):
    return board.san(chess.Move.from_uci(uci))


def only_move_item(g, board, fam, node, depth, cue, hints, idea_tags=(), mode=None, cg=None, role=None, prompt=None,
                   review="machine-only", also_nodes=(), max_wrong_shown=3, wrong_pref=None, ref=None, require_unique=False,
                   min_wrong=1, max_accepted=3, explain_tail="", accept_filter=None):
    """find_move. mode 'win': the position is a tablebase win; accepted = every move that keeps the win; every other legal move is
    claimed to throw it away (draw or loss). mode 'hold': the position is a tablebase draw; accepted = every move that keeps the draw
    (all others claimed to lose). Returns the id or None. Claims cover EVERY legal move, so 'only' is proven."""
    fen = board.fen()
    res = tb.result(fen, pure=True)
    mv = tb.moves(fen, pure=True)
    if res is None or mv is None:
        g.stats["unclean-moves"] += 1
        return None
    if mode is None:
        mode = "win" if res == "win" else "hold"
    keep = "win" if mode == "win" else "draw"
    if res != keep:
        g.stats["wrong-result-for-mode"] += 1
        return None
    legal = {m.uci() for m in board.legal_moves}
    if set(mv) != legal:
        g.stats["move-list-mismatch"] += 1
        return None
    acc = sorted(u for u, r in mv.items() if r == keep)
    bad = sorted(u for u, r in mv.items() if r != keep)
    if not acc or len(bad) < min_wrong or len(acc) > max_accepted or (require_unique and len(acc) != 1):
        g.stats["not-selective"] += 1
        return None
    if accept_filter is not None and not accept_filter(board, acc, bad):
        g.stats["filtered"] += 1
        return None
    sans = {u: _san(board, u) for u in acc + bad}
    claims = [claim("C1", "tablebase", "The side to move " + ("wins." if keep == "win" else "can hold the draw."), result=keep)]
    for i, u in enumerate(acc):
        claims.append(claim(f"C{len(claims) + 1}", "tablebase", f"{sans[u]} keeps the {keep}.", move=u, result=keep))
    for u in bad:
        claims.append(claim(f"C{len(claims) + 1}", "tablebase", f"{sans[u]} gives up the {keep}: result {mv[u]}.", move=u, result=mv[u]))
    # plausible wrong moves for feedback: caller preference, else pawn moves, then moves of the piece that matters least
    enemy_k = board.king(not board.turn)

    def plaus(u):
        m = chess.Move.from_uci(u)
        pt = board.piece_type_at(m.from_square)
        pref = wrong_pref(board, m) if wrong_pref else 0
        return (pref, 0 if pt == P else 1, chess.square_distance(m.to_square, enemy_k), u)
    shown = sorted(bad, key=plaus)[:max_wrong_shown]
    fb = {}
    for u in shown:
        fb[u] = (f"{sans[u]} lets the opponent draw (tablebase: the result drops to a draw)." if mv[u] == "draw" and keep == "win"
                 else f"{sans[u]} loses (tablebase)." if mv[u] == "loss" else f"{sans[u]} gives up the {keep} (tablebase: {mv[u]}).")
    who = CTITLE[board.turn]
    if prompt is None:
        if keep == "win":
            prompt = (f"{who} to move and wins, but only one move keeps the win. Find it." if len(acc) == 1
                      else f"{who} to move and wins, but some moves throw the win away. Find a move that keeps it.")
        else:
            prompt = (f"{who} to move. With best play the position is a draw, but only one move holds it. Find it." if len(acc) == 1
                      else f"{who} to move. With best play the position is a draw, but some moves lose. Find a move that holds it.")
    tail = ", ".join(sans[u] for u in shown)
    if keep == "win":
        expl = (f"{sans[acc[0]]} is the only move that keeps the win: the tablebase shows that every other legal move lets the opponent off, for example {tail}."
                if len(acc) == 1 else
                f"Only {' and '.join(sans[u] for u in acc)} keep the win: the tablebase shows that every other legal move lets the opponent off, for example {tail}.")
    else:
        expl = (f"{sans[acc[0]]} is the only move that holds the draw: the tablebase shows that every other legal move loses, for example {tail}."
                if len(acc) == 1 else
                f"Only {' and '.join(sans[u] for u in acc)} hold the draw: the tablebase shows that every other legal move loses, for example {tail}.")
    if explain_tail:
        expl += " " + explain_tail
    ex = list(idea_tags)
    if role:
        ex.append(f"role.{role}")
    if cg:
        ex.append(f"contrast.{cg}")
    item = {"skill": f"{node}.D{depth}", "cue": cue, "task": "find_move", "prompt": prompt, "answer": {"moves": acc},
            "claims": claims, "feedback_by_move": fb, "hints": list(hints), "explain": expl,
            "tags": tags_for(node, cue, fam, "find_move", ex + [("kind.only-move" if len(acc) == 1 else "kind.few-moves")], also_nodes),
            "review": {"status": review}}
    if cg:
        item["contrast_group"] = cg
    return g.add(board, fam, item, ref or f"{node} find_move {mode}")


def play_out_item(g, board, fam, node, depth, goal, max_moves, hints, idea_tags=(), prompt=None, review="machine-only",
                  also_nodes=(), cue=4, ref=None, role=None, cg=None, explain=None):
    """play_out against the engine opponent. goal 'win' needs a tablebase win; 'hold'/'draw' needs a tablebase draw. The claim proves the
    goal is achievable; the move budget comes from the tablebase DTM (see docs/exercises-endgames.md) and is NOT claim-checked."""
    res = tb.result(board.fen(), pure=True)
    want = "win" if goal == "win" else "draw"
    if res != want:
        g.stats["play-wrong-result"] += 1
        return None
    stm = CTITLE[board.turn]
    if prompt is None:
        prompt = (f"{stm} to move. This position is won with best play. Convert it: checkmate the opponent within {max_moves} moves." if goal == "win"
                  else f"{stm} to move. With best play this position is a draw, but the opponent plays at full strength. Hold the draw.")
    expl = explain or ("The tablebase confirms the position is a win for the side to move; the move budget is more than the tablebase's own distance to mate."
                       if goal == "win" else
                       "The tablebase confirms the position is a draw with best play, so the defender can hold it.")
    ex = list(idea_tags)
    if role:
        ex.append(f"role.{role}")
    if cg:
        ex.append(f"contrast.{cg}")
    item = {"skill": f"{node}.D{depth}", "cue": cue, "task": "play_out", "prompt": prompt,
            "answer": {"goal": goal, "max_moves": max_moves},
            "claims": [claim("C1", "tablebase", "The goal is achievable: the tablebase result for the side to move is a " + want + ".", result=want)],
            "hints": list(hints), "explain": expl,
            "tags": tags_for(node, cue, fam, "play_out", ex, also_nodes),
            "review": {"status": review}}
    if cg:
        item["contrast_group"] = cg
    return g.add(board, fam, item, ref or f"{node} play_out {goal}")


def classify_item(g, board, fam, node, depth, cue, prompt, options, cls, claims, hints, explain, idea_tags=(), review="needs-human",
                  also_nodes=(), cg=None, role=None, ref=None):
    ex = list(idea_tags)
    if role:
        ex.append(f"role.{role}")
    if cg:
        ex.append(f"contrast.{cg}")
    item = {"skill": f"{node}.D{depth}", "cue": cue, "task": "classify_position", "prompt": prompt, "options": list(options),
            "answer": {"class": cls, "options": list(options)}, "claims": claims, "hints": list(hints), "explain": explain,
            "tags": tags_for(node, cue, fam, "classify_position", ex, also_nodes), "review": {"status": review}}
    if cg:
        item["contrast_group"] = cg
    return g.add(board, fam, item, ref or f"{node} classify {cls}")


# ----------------------------------------------------------------------------------------------------------------
# driver helpers
# ----------------------------------------------------------------------------------------------------------------
def report(g, quotas=()):
    print(g.filename, len(g.items), "items,", len(g.positions), "positions", dict(g.stats))
    by = Counter(i["skill"].rpartition(".")[0] for i in g.items)
    print("   per node:", dict(sorted(by.items())))
    by = Counter(i["task"] for i in g.items)
    print("   per task:", dict(sorted(by.items())))
    for q in quotas:
        print("   quota", q)
    print("   positions still needed from the tablebase:", len(set(g.need)))
