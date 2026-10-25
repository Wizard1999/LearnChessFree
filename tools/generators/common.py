"""Shared helpers for the deterministic Tier 0-1 item generators.

Design rules (see docs/content-schema.md, the contract):
  * Every generator is a pure function of a fixed random seed plus the set of FENs already present in content/
    (so a clean re-run reproduces the same files).
  * Every claim parameter is computed from the FINAL board of the item (never carried over from a transformed
    sibling), then the claims are checked once more with tools/validate.check_claim before the item is kept
    ("pre-check"). Rejections are counted per family and reason so that generator defects are visible.
  * Positions come in families (an original, its mirror, its colour-flip ...). A family is never split between
    training and test, so every base scenario gets one family name shared by its variants.
  * No pinned pieces, no x-ray batteries, no check on the side to move in the "clean" counting families
    (the claims only check direct attacks; the lessons must not teach something the claims do not verify).
"""
from __future__ import annotations

import json
import random
import sys
from collections import Counter
from pathlib import Path

import chess

TOOLS = Path(__file__).resolve().parent.parent
ROOT = TOOLS.parent
if str(TOOLS) not in sys.path:
    sys.path.insert(0, str(TOOLS))

ITEMS_DIR = ROOT / "content" / "items"
SKILLS_DIR = ROOT / "content" / "skills"
GEN_PREFIX = "gen-t0-"

VAL = {chess.PAWN: 1, chess.KNIGHT: 3, chess.BISHOP: 3, chess.ROOK: 5, chess.QUEEN: 9, chess.KING: 0}
SEE_VAL = dict(VAL)
SEE_VAL[chess.KING] = 100
PNAME = {chess.PAWN: "pawn", chess.KNIGHT: "knight", chess.BISHOP: "bishop", chess.ROOK: "rook",
         chess.QUEEN: "queen", chess.KING: "king"}
CNAME = {chess.WHITE: "white", chess.BLACK: "black"}
CTITLE = {chess.WHITE: "White", chess.BLACK: "Black"}
SYMBOL_FOR = {"pawn": chess.PAWN, "knight": chess.KNIGHT, "bishop": chess.BISHOP, "rook": chess.ROOK,
              "queen": chess.QUEEN, "king": chess.KING}

# build order of the generator modules (also the order in which the duplicate-FEN registry grows)
ORDER = ["move", "count", "loose", "state", "mate1", "contrast", "special", "endmate", "kpk", "board"]


# ----------------------------------------------------------------------------------------------------------------
# duplicate-FEN registry
# ----------------------------------------------------------------------------------------------------------------
def fen_key(fen: str) -> str:
    """Board, side to move, castling rights, en passant: the clocks never make a position 'different'."""
    return " ".join(fen.split()[:4])


def _collect_fens(obj, out):
    if isinstance(obj, dict):
        for k, v in obj.items():
            if k == "fen" and isinstance(v, str):
                out.add(fen_key(v))
            else:
                _collect_fens(v, out)
    elif isinstance(obj, list):
        for v in obj:
            _collect_fens(v, out)


def all_content_fens(skip_names=(), skip_prefix=None):
    """FEN keys of every JSON file under content/ (items, lessons ...), minus skipped file names."""
    out = set()
    for p in sorted((ROOT / "content").rglob("*.json")):
        if "_evidence" in p.parts:
            continue
        if p.name in skip_names or (skip_prefix and p.name.startswith(skip_prefix)):
            continue
        try:
            _collect_fens(json.loads(p.read_text(encoding="utf-8")), out)
        except Exception:
            pass
    return out


class Registry:
    """Set of FEN keys that are taken. `for_module` seeds it with everything outside our own gen-t0 files plus the
    gen-t0 files of modules that come EARLIER in ORDER (so a full run is reproducible and order-consistent)."""

    def __init__(self, keys=()):
        self.keys = set(keys)

    @classmethod
    def for_module(cls, module):
        keys = all_content_fens(skip_prefix=GEN_PREFIX)
        idx = ORDER.index(module)
        earlier = ORDER[:idx]
        for p in sorted(ITEMS_DIR.glob(GEN_PREFIX + "*.json")):
            area = p.stem[len(GEN_PREFIX):]
            if _area_module(area) in earlier:
                _collect_fens(json.loads(p.read_text(encoding="utf-8")), keys)
        return cls(keys)

    def has(self, fen):
        return fen_key(fen) in self.keys

    def add(self, fen):
        k = fen_key(fen)
        if k in self.keys:
            return False
        self.keys.add(k)
        return True


AREA_TO_MODULE = {"move": "move", "count": "count", "loose": "loose", "state": "state", "mate1": "mate1",
                  "contrast": "contrast", "castle": "special", "ep": "special", "promo": "special",
                  "endmate": "endmate", "kpk": "kpk", "board": "board"}


def _area_module(area):
    return AREA_TO_MODULE.get(area, area)


# ----------------------------------------------------------------------------------------------------------------
# engine pre-check (re-uses the validator's own claim checker)
# ----------------------------------------------------------------------------------------------------------------
class LazyEngine:
    def __init__(self):
        self._e = None

    def _eng(self):
        if self._e is None:
            from engine import Engine
            self._e = Engine()
        return self._e

    def search(self, *a, **k):
        return self._eng().search(*a, **k)

    def settings(self, *a, **k):
        return self._eng().settings(*a, **k)

    def close(self):
        if self._e is not None:
            self._e.close()
            self._e = None


class PreCheck:
    def __init__(self):
        import validate  # tools/validate.py
        self.v = validate
        self.eng = LazyEngine()
        self.rejects = Counter()
        self.reject_examples = {}
        self.passed = Counter()

    def check(self, fam_label, pos, claims):
        for c in claims:
            try:
                r = self.v.check_claim(self.eng, pos, c)
            except Exception as ex:  # pragma: no cover
                r = dict(result="fail", reason=f"error: {ex}")
            if r["result"] != "pass":
                key = (fam_label, c["type"])
                self.rejects[key] += 1
                self.reject_examples.setdefault(key, (pos["fen"], c, r.get("reason") or r.get("measured")))
                return False
        self.passed[fam_label] += 1
        return True

    def close(self):
        self.eng.close()


# ----------------------------------------------------------------------------------------------------------------
# board helpers
# ----------------------------------------------------------------------------------------------------------------
def new_board():
    b = chess.Board(None)
    b.castling_rights = 0
    return b


def put(board, sq, ptype, color):
    board.set_piece_at(sq, chess.Piece(ptype, color))


def sqn(s):
    return chess.square_name(s)


def mirror_files(board):
    """Left-right mirror (a<->h). Only for positions without castling rights."""
    return board.transform(chess.flip_horizontal)


def colour_flip(board):
    """Colours swapped, board flipped top-bottom, turn flipped (python-chess Board.mirror())."""
    return board.mirror()


def variants(board, kinds=("mirror", "flip")):
    out = [("orig", board.copy(stack=False))]
    if "mirror" in kinds:
        out.append(("mirror", mirror_files(board)))
    if "flip" in kinds:
        out.append(("flip", colour_flip(board)))
    if "mirrorflip" in kinds:
        out.append(("mirrorflip", colour_flip(mirror_files(board))))
    return out


def orient(board):
    return "white" if board.turn == chess.WHITE else "black"


def pieces_of(board, color, include_king=True):
    return [(s, p) for s, p in sorted(board.piece_map().items()) if p.color == color and (include_king or p.piece_type != chess.KING)]


def any_pinned(board):
    for color in (chess.WHITE, chess.BLACK):
        for s, _p in pieces_of(board, color, include_king=False):
            if board.is_pinned(color, s):
                return True
    return False


def king_adjacent(board):
    wk, bk = board.king(chess.WHITE), board.king(chess.BLACK)
    return chess.square_distance(wk, bk) <= 1


def attackers_list(board, color, sq):
    return sorted(board.attackers(color, sq))


def xray_count(board, sq, color):
    """Number of attackers of `sq` by `color` when attackers are peeled off one by one (least valuable first), i.e. the
    count including batteries (a rook behind a queen on the same line). Equal to the direct count iff no battery."""
    b = board.copy(stack=False)
    n = 0
    while True:
        mask = b.attackers_mask(color, sq)
        if not mask:
            return n
        cands = [s for s in chess.scan_forward(mask)]
        cands.sort(key=lambda s: (SEE_VAL[b.piece_type_at(s)], s))
        b.remove_piece_at(cands[0])
        n += 1


def clean_attack_counts(board, sq):
    """True if for both colours the direct attacker count of `sq` equals the battery-aware count."""
    for color in (chess.WHITE, chess.BLACK):
        if xray_count(board, sq, color) != len(board.attackers(color, sq)):
            return False
    return True


def squares_from_which(board, color, ptype, target):
    """Empty squares where a `color` piece of type ptype would attack `target` (given current occupancy)."""
    out = []
    for s in chess.SQUARES:
        if board.piece_at(s) is not None or s == target:
            continue
        if ptype == chess.PAWN and chess.square_rank(s) in (0, 7):
            continue
        board.set_piece_at(s, chess.Piece(ptype, color))
        if target in board.attacks(s):
            out.append(s)
        board.remove_piece_at(s)
    return out


def see_gain(board, move):
    """Net material change for the mover of capture `move`, both sides recapturing with the least valuable legal
    piece and free to stop (classic swap-off, on real legal moves so pins and x-rays are handled)."""
    b = board.copy(stack=False)
    cap = b.piece_at(move.to_square)
    gain0 = VAL[cap.piece_type] if cap else 0
    b.push(move)
    return gain0 - _see_rec(b, move.to_square)


def _see_rec(board, sq):
    caps = [m for m in board.legal_moves if m.to_square == sq and board.is_capture(m)]
    if not caps:
        return 0
    m = min(caps, key=lambda mv: (SEE_VAL[board.piece_type_at(mv.from_square)], mv.uci()))
    target = board.piece_at(sq)
    got = VAL[target.piece_type] if target else 0
    board.push(m)
    v = got - _see_rec(board, sq)
    board.pop()
    return max(0, v)


def game_state(board):
    return ("checkmate" if board.is_checkmate() else "stalemate" if board.is_stalemate()
            else "check" if board.is_check() else "ongoing")


def random_empty(board, rng, ranks=range(8), files=range(8), avoid=()):
    cands = [chess.square(f, r) for r in ranks for f in files if board.piece_at(chess.square(f, r)) is None and chess.square(f, r) not in avoid]
    return rng.choice(cands) if cands else None


def piece_phrase(piece):
    return f"{CNAME[piece.color]} {PNAME[piece.piece_type]}"


def join_squares(names):
    names = list(names)
    if not names:
        return ""
    if len(names) == 1:
        return names[0]
    return ", ".join(names[:-1]) + " and " + names[-1]


def san_of(board, move):
    return board.san(move)


# ----------------------------------------------------------------------------------------------------------------
# item / position construction
# ----------------------------------------------------------------------------------------------------------------
class Builder:
    """Collects positions and items for one output file. Position and item share the running number n."""

    def __init__(self, area, module, seed, registry, precheck):
        self.area = area
        self.module = module
        self.seed = seed
        self.rng = random.Random(seed)
        self.registry = registry
        self.pre = precheck
        self.positions = []
        self.items = []
        self.n = 0
        self.stats = Counter()

    def pid(self, k=None):
        return f"PG-{self.area}-{k or self.n + 1}"

    def add(self, board, family, item, ref, label=None, precheck=True, extra_positions=None):
        """item: dict with every item field except id/position (skill, cue, task, prompt, answer, claims, tags,
        hints, explain, ...). Returns the item id, or None if the position is a duplicate/invalid/rejected."""
        fen = board.fen()
        label = label or family
        if not board.is_valid():
            self.stats["invalid-position"] += 1
            return None
        if self.registry.has(fen):
            self.stats["duplicate-fen"] += 1
            return None
        n = self.n + 1
        pos = {"id": f"PG-{self.area}-{n}", "fen": fen, "family": family,
               "provenance": {"kind": "generated", "ref": f"tools/generators/gen_{self.module}.py seed={self.seed}: {ref}", "licence": "project"}}
        it = dict(item)
        it["id"] = f"IG-{self.area}-{n}"
        it["position"] = pos["id"]
        it.setdefault("orientation", orient(board))
        it.setdefault("review", {"status": "machine-only"})
        if precheck and not self.pre.check(label, pos, it["claims"]):
            self.stats["precheck-reject"] += 1
            return None
        self.registry.add(fen)
        self.n = n
        self.positions.append(pos)
        self.items.append(it)
        return it["id"]

    def write(self, filename):
        """Atomic replace, so that a reader (another worker running check_all/build) never sees a half-written file."""
        import os
        out = {"positions": self.positions, "items": self.items}
        path = ITEMS_DIR / filename
        tmp = path.with_name(path.name + ".tmp")
        tmp.write_text(json.dumps(out, indent=1, ensure_ascii=False) + "\n", encoding="utf-8")
        os.replace(tmp, path)
        return path


def tags_for(node_ids, tier, cue, family, extra=()):
    tags = [f"node.{n}" for n in node_ids] + [f"tier.{tier}", f"cue.{cue}", "kind.generated", f"family.{family}", "lang.en"]
    tags.extend(extra)
    return tags


def claim(cid, ctype, statement=None, **params):
    c = {"id": cid, "type": ctype, "params": params}
    if statement:
        c["statement"] = statement
    return c


def is_clean_for_counting(board, targets=(), allow_king_attackers=False):
    """No pins, side to move not in check, no batteries on the squares in `targets`, optionally no king among the
    direct attackers/defenders."""
    if board.is_check() or any_pinned(board):
        return False
    for t in targets:
        if not clean_attack_counts(board, t):
            return False
        if not allow_king_attackers:
            for color in (chess.WHITE, chess.BLACK):
                for s in board.attackers(color, t):
                    if board.piece_type_at(s) == chess.KING:
                        return False
    return True


def place_kings_far(board, rng, avoid_sqs, min_dist=3, tries=200):
    """Put both kings on empty squares at least `min_dist` (Chebyshev) from every square in avoid_sqs and from each
    other, not attacked by anything. Returns True on success."""
    for color in (chess.WHITE, chess.BLACK):
        for _ in range(tries):
            s = random_empty(board, rng)
            if s is None:
                return False
            if any(chess.square_distance(s, a) < min_dist for a in avoid_sqs):
                continue
            other = board.king(not color)
            if other is not None and chess.square_distance(s, other) < 3:
                continue
            put(board, s, chess.KING, color)
            if board.attackers_mask(not color, s):
                board.remove_piece_at(s)
                continue
            break
        else:
            return False
    return True
