"""Shared helpers for the positional-play generators (tools/positional/*).

Run any script with:  ./tools/.venv/Scripts/python.exe -I tools/positional/<script>.py

Design (same discipline as tools/generators/common.py):
  * Everything is a pure function of fixed seeds and of the committed pool (tools/corpus/out/game_candidates.jsonl: Lichess
    standard rated games, January 2013 sample, CC0). A clean rerun reproduces the same files.
  * Claim parameters are computed from the FINAL board of the item, then every claim is checked once more with
    tools/validate.check_claim (pre-check) before the item is kept; rejections are counted, never loosened.
  * A family is shared by every position that comes from one game (or from one edited pair), so near-duplicates never straddle
    practice and test.
  * Ids: positions PP-<area>-<n>, items IP-<area>-<n>.
"""
from __future__ import annotations

import json
import os
import random
import sys
from collections import Counter
from pathlib import Path

HERE = Path(__file__).resolve().parent
TOOLS = HERE.parent
ROOT = TOOLS.parent
if str(TOOLS) not in sys.path:
    sys.path.insert(0, str(TOOLS))

import chess
import structure as S
from generators.common import PreCheck, Registry, all_content_fens, fen_key, claim, see_gain, VAL  # noqa: F401

OUT = HERE / "out"
OUT.mkdir(exist_ok=True)
ITEMS_DIR = ROOT / "content" / "items"
SKILLS_DIR = ROOT / "content" / "skills"
POOL = ROOT / "tools" / "corpus" / "out" / "game_candidates.jsonl"
INDEX = OUT / "index.jsonl"
PREFIX = "pos-"                         # our item files: content/items/pos-*.json

CN = {chess.WHITE: "white", chess.BLACK: "black"}
CT = {chess.WHITE: "White", chess.BLACK: "Black"}
PN = {chess.PAWN: "pawn", chess.KNIGHT: "knight", chess.BISHOP: "bishop", chess.ROOK: "rook", chess.QUEEN: "queen", chess.KING: "king"}
FILES = "abcdefgh"


# ----------------------------------------------------------------------------------------------------------------
# small text helpers
# ----------------------------------------------------------------------------------------------------------------
def join_and(names, empty="none"):
    names = list(names)
    if not names:
        return empty
    if len(names) == 1:
        return names[0]
    return ", ".join(names[:-1]) + " and " + names[-1]


def files_phrase(files):
    files = list(files)
    if not files:
        return "no file"
    if len(files) == 1:
        return f"the {files[0]}-file"
    return "the " + join_and([f"{f}-file" for f in files])


def plural(n, word, plural_form=None):
    return f"{n} {word}" if n == 1 else f"{n} {plural_form or word + 's'}"


def other(c):
    return not c


# ----------------------------------------------------------------------------------------------------------------
# the pool of real positions
# ----------------------------------------------------------------------------------------------------------------
def pool_records():
    with open(POOL, encoding="utf-8") as f:
        for ln in f:
            yield json.loads(ln)


def pool_provenance(gid, ply):
    return {"kind": "lichess_game", "ref": f"lichess.org/{gid} ply {ply} (Lichess standard rated games, January 2013 sample)", "licence": "CC0"}


def calm(board):
    """A position with no free material for EITHER side and no check: no capture that wins material (static exchange on legal moves)
    for the side to move, and none for the opponent either (tested by letting the side to move pass). Keeps the learner's eye on the
    structure question instead of a hanging piece."""
    if not board.is_valid() or board.is_check():
        return False
    for m in board.legal_moves:
        if board.is_capture(m) and see_gain(board, m) > 0:
            return False
    nb = board.copy(stack=False)
    nb.push(chess.Move.null())
    for m in nb.legal_moves:
        if nb.is_capture(m) and see_gain(nb, m) > 0:
            return False
    return True


# ----------------------------------------------------------------------------------------------------------------
# feature vector of a position (used by the index and by the selectors)
# ----------------------------------------------------------------------------------------------------------------
def features(board):
    f = {}
    for c in (chess.WHITE, chess.BLACK):
        k = "w" if c == chess.WHITE else "b"
        for kind in S.PAWN_KINDS:
            f[f"{k}.{kind}"] = S.pawn_set(board, kind, c)
        f[f"{k}.holes"] = S.hole_squares(board, c)
        f[f"{k}.out_any"] = S.outpost_squares(board, c, "any")
        f[f"{k}.out_own"] = S.outpost_squares(board, c, "own")
        f[f"{k}.out_empty"] = S.outpost_squares(board, c, "empty")
        f[f"{k}.shield"] = S.king_pawn_shield(board, c)
        f[f"{k}.space_att"] = len(S.space_squares(board, c, "pawn_attacks"))
        f[f"{k}.space_ctl"] = len(S.space_squares(board, c, "pawn_controlled"))
        f[f"{k}.islands"] = S.pawn_islands(board, c)
        f[f"{k}.pcol"] = S.pawn_colours(board, c)
        f[f"{k}.rc"] = S.rooks_connected(board, c)
        f[f"{k}.kwing"] = S.king_wing(board, c) if board.king(c) is not None else None
    f["files"] = S.open_files(board)
    f["bpair"] = S.bishop_pair_holders(board)
    return f


# ----------------------------------------------------------------------------------------------------------------
# registry of taken FENs (existing content + everything we have generated so far in this run)
# ----------------------------------------------------------------------------------------------------------------
ORDER = ["pawns", "squares", "pieces", "king", "mixed", "struct", "exchange", "quiet", "quietx", "endings"]


def make_registry(module=None):
    """FENs already taken: all content except our own pos-* files, plus the pos-* files of the modules that run BEFORE `module`
    (so a rerun of one module reproduces its output and modules never duplicate each other's positions)."""
    from generators.common import _collect_fens
    keys = all_content_fens(skip_prefix=PREFIX)
    frozen = ["quiet", "quietx", "endings"]                  # slow or network-bound outputs are never regenerated casually: later runs of the other modules avoid their FENs
    if module in ORDER:
        bases = ORDER[:ORDER.index(module)] + [b for b in frozen if b != module and b not in ORDER[:ORDER.index(module)]]
    else:
        bases = []
    for base in bases:
        for p in sorted(ITEMS_DIR.glob(f"{PREFIX}{base}-*.json")):
            _collect_fens(json.loads(p.read_text(encoding="utf-8")), keys)
    return Registry(keys)


# ----------------------------------------------------------------------------------------------------------------
# builder
# ----------------------------------------------------------------------------------------------------------------
class PBuilder:
    """Collects positions and items for ONE output file (id numbers are per area, so file splits keep unique ids)."""

    def __init__(self, area, module, seed, registry, precheck):
        self.area, self.module, self.seed = area, module, seed
        self.rng = random.Random(seed)
        self.reg, self.pre = registry, precheck
        self.positions, self.items = [], []
        self.n = 0
        self.stats = Counter()
        self.by_node = Counter()

    def add(self, board, family, item, provenance, label=None, precheck=True):
        """item: every item field except id/position. Returns the item id or None (duplicate FEN / invalid / pre-check reject)."""
        fen = board.fen()
        label = label or family
        if not board.is_valid():
            self.stats["invalid"] += 1
            return None
        if self.reg.has(fen):
            self.stats["duplicate-fen"] += 1
            return None
        n = self.n + 1
        pos = {"id": f"PP-{self.area}-{n}", "fen": fen, "family": family, "provenance": provenance}
        it = dict(item)
        it["id"] = f"IP-{self.area}-{n}"
        it["position"] = pos["id"]
        it.setdefault("orientation", "white" if board.turn == chess.WHITE else "black")
        it.setdefault("review", {"status": "machine-only"})
        if precheck and not self.pre.check(label, pos, it["claims"]):
            self.stats["precheck-reject"] += 1
            return None
        self.reg.add(fen)
        self.n = n
        self.positions.append(pos)
        self.items.append(it)
        self.by_node[it["skill"].rpartition(".")[0]] += 1
        return it["id"]

    def write(self, filename):
        path = ITEMS_DIR / filename
        tmp = path.with_name(path.name + ".tmp")
        tmp.write_text(json.dumps({"positions": self.positions, "items": self.items}, indent=1, ensure_ascii=False) + "\n", encoding="utf-8")
        os.replace(tmp, path)
        return path


def tags(nodes, tier, cue, family, kind="generated", extra=()):
    t = [f"node.{n}" for n in nodes] + [f"tier.{tier}", f"cue.{cue}", f"kind.{kind}", f"family.{family}", "lang.en"]
    t.extend(extra)
    return t


def split_write(builder, base, chunk=120):
    """Write the builder's content as pos-<base>-<k>.json files of at most `chunk` items (positions follow their items).
    Returns the list of file names written. Old files of the same base that are no longer produced are removed."""
    names = []
    items, positions = builder.items, {p["id"]: p for p in builder.positions}
    k = 0
    for i in range(0, len(items), chunk):
        k += 1
        part = items[i:i + chunk]
        pos = [positions[it["position"]] for it in part]
        name = f"{PREFIX}{base}-{k}.json"
        path = ITEMS_DIR / name
        tmp = path.with_name(path.name + ".tmp")
        tmp.write_text(json.dumps({"positions": pos, "items": part}, indent=1, ensure_ascii=False) + "\n", encoding="utf-8")
        os.replace(tmp, path)
        names.append(name)
    for old in sorted(ITEMS_DIR.glob(f"{PREFIX}{base}-*.json")):
        if old.name not in names:
            old.unlink()
    return names


def skill_ok(skill_id):
    node, _, depth = skill_id.rpartition(".")
    p = SKILLS_DIR / f"{node}.json"
    if not p.exists():
        return False
    return depth in json.loads(p.read_text(encoding="utf-8"))["depths"]


# ----------------------------------------------------------------------------------------------------------------
# option shuffling: answer position balanced and reproducible
# ----------------------------------------------------------------------------------------------------------------
def shuffled(rng, options):
    o = list(options)
    rng.shuffle(o)
    return o


# ----------------------------------------------------------------------------------------------------------------
# item factory
# ----------------------------------------------------------------------------------------------------------------
_TIER = {}


def tier_of(node):
    if node not in _TIER:
        _TIER[node] = json.loads((SKILLS_DIR / f"{node}.json").read_text(encoding="utf-8"))["tier"]
    return _TIER[node]


class Cl:
    """Claim list builder: Cl().add(type, statement, **params).add(...) ; ids C1, C2 ..."""

    def __init__(self):
        self.items = []

    def add(self, ctype, statement, **params):
        self.items.append({"id": f"C{len(self.items) + 1}", "type": ctype, "params": params, "statement": statement})
        return self


def mk(skill, cue, task, prompt, answer, cl, nodes, hints, explain, family, options=None, extra=(), status="machine-only", tpl=None,
       feedback=None, contrast_group=None, kind="generated", source=None):
    """Assemble an item dict (no id/position yet). `nodes` are node ids WITHOUT depth; the first is the primary node."""
    assert len(hints) == 3, "three escalating hints"
    assert skill_ok(skill), f"unknown skill {skill}"
    ans = dict(answer)
    d = {"skill": skill, "cue": cue, "task": task, "prompt": prompt, "answer": ans, "claims": cl.items if isinstance(cl, Cl) else cl,
         "tags": tags(nodes, tier_of(nodes[0]), cue, family, kind=kind, extra=list(extra) + ([f"tpl.{tpl}"] if tpl else [])),
         "hints": list(hints), "explain": explain, "review": {"status": status, "reviewer": None}}
    if options is not None:
        d["options"] = list(options)
        ans["options"] = list(options)
    if feedback:
        d["feedback_by_move"] = feedback
    if contrast_group:
        d["contrast_group"] = contrast_group
    if source:
        d["source"] = source
    return d


# ----------------------------------------------------------------------------------------------------------------
# positions from the pool, and one-pawn edits (contrast pairs)
# ----------------------------------------------------------------------------------------------------------------
def fam(rec):
    return f"FAM-PS-{rec['g']}"


def prov(rec):
    return pool_provenance(rec["g"], rec["p"])


def edit_prov(rec, desc):
    return {"kind": "generated", "ref": f"edit of lichess.org/{rec['g']} ply {rec['p']} (Lichess January 2013 sample, CC0): {desc}", "licence": "CC0"}


def pawn_edits(board, avoid=(), kinds=("push", "shift")):
    """Single-pawn edits of `board` (stm unchanged): a forward push (one square, or two from the start rank) or a sideways shift
    by one file, of any pawn not on a square in `avoid`. Yields (desc, from_sq, to_sq, new_board) for valid, calm results."""
    avoid = {chess.parse_square(a) if isinstance(a, str) else a for a in avoid}
    for colour in (chess.WHITE, chess.BLACK):
        step = 1 if colour == chess.WHITE else -1
        for s in sorted(board.pieces(chess.PAWN, colour)):
            if s in avoid:
                continue
            f, r = chess.square_file(s), chess.square_rank(s)
            dests = []
            if "push" in kinds:
                nr = r + step
                if 1 <= nr <= 6 and board.piece_at(chess.square(f, nr)) is None:
                    dests.append(("push", chess.square(f, nr)))
                    start = 1 if colour == chess.WHITE else 6
                    nr2 = r + 2 * step
                    if r == start and board.piece_at(chess.square(f, nr2)) is None:
                        dests.append(("push", chess.square(f, nr2)))
            if "shift" in kinds:
                for df in (-1, 1):
                    if 0 <= f + df <= 7 and board.piece_at(chess.square(f + df, r)) is None:
                        dests.append(("shift", chess.square(f + df, r)))
            for kind, d in dests:
                if d in avoid:
                    continue
                nb = board.copy(stack=False)
                nb.remove_piece_at(s)
                nb.set_piece_at(d, chess.Piece(chess.PAWN, colour))
                nb.ep_square = None
                if not nb.is_valid() or not calm(nb):
                    continue
                verb = "pushed" if kind == "push" else "moved one file sideways"
                yield (f"the {CN[colour]} pawn on {chess.square_name(s)} {verb} to {chess.square_name(d)}", s, d, nb)


def sq_list(squares):
    return sorted(squares)


def neighbour_files(sq):
    f = chess.square_file(chess.parse_square(sq))
    return [FILES[x] for x in (f - 1, f + 1) if 0 <= x <= 7]


def swap_edits(board, colour, from_type, to_type):
    """Yield (description, new_board) replacing one piece of `colour` of type from_type by to_type on the same square
    (valid and calm results only). Used for near-miss pairs such as bishop -> knight."""
    for s in sorted(board.pieces(from_type, colour)):
        nb = board.copy(stack=False)
        nb.set_piece_at(s, chess.Piece(to_type, colour))
        nb.ep_square = None
        if nb.is_valid() and calm(nb):
            yield (f"the {CN[colour]} {PN[from_type]} on {chess.square_name(s)} replaced by a {PN[to_type]}", nb)
