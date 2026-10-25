"""Family 1: piece movement (FND.PIECE.ROOK/BISHOP/QUEEN/KING/KNIGHT/PAWN).

Item: select_squares, answer {"from": sq, "squares": [...]}, claim legal_destinations (exact set).
Each piece type has 12 base scenarios (9 'named' = cue 1 / depth D1, 3 'unlabeled' = cue 3 / depth D2, where the
prompt does not name the piece). Each base scenario is a family and is expanded to 3 positions: the original, its
left-right mirror, and its colour-flip (so half of the mover positions are Black to move, board shown from Black's side).
Rules for every position: both kings present, mover's side not in check, no pinned piece anywhere ("pins NOT yet"),
at least one destination, no promotion squares (the validator's legal_destinations counts a promotion square once per
promotion piece, so pawns on the 7th rank are not used).

    python tools/generators/gen_move.py          # writes content/items/gen-t0-move.json
"""
from __future__ import annotations

import sys as _s, pathlib as _p
_s.path.insert(0, str(_p.Path(__file__).resolve().parent))  # allow `python -I tools/generators/gen_move.py`
import chess

from common import *  # noqa: F401,F403

AREA, MODULE, SEED, FILE = "MOVE", "move", 20261024, "gen-t0-move.json"

PIECES = [
    (chess.ROOK, "ROOK", "FND.PIECE.ROOK"),
    (chess.BISHOP, "BISHOP", "FND.PIECE.BISHOP"),
    (chess.QUEEN, "QUEEN", "FND.PIECE.QUEEN"),
    (chess.KING, "KING", "FND.PIECE.KING"),
    (chess.KNIGHT, "KNIGHT", "FND.PIECE.KNIGHT"),
    (chess.PAWN, "PAWN", "FND.PIECE.PAWN"),
]

HINTS = {
    chess.ROOK: ["A rook moves along a rank or a file. Which rank and which file does the rook on {sq} use?",
                 "In each direction it keeps going until something is in the way. It cannot jump over pieces and cannot land on its own pieces.",
                 "An enemy piece in the way can be captured, and the rook stops on that square. Check up, down, left and right, one at a time."],
    chess.BISHOP: ["A bishop moves along diagonals only. Which two diagonals pass through {sq}?",
                   "On each diagonal it slides until something is in the way. It cannot jump and cannot land on its own pieces.",
                   "An enemy piece in the way can be captured, and the bishop stops there. Check the four diagonal directions one at a time."],
    chess.QUEEN: ["A queen moves like a rook and a bishop together. Which lines pass through {sq}: the rank, the file and two diagonals?",
                  "On each line it slides until something is in the way: it cannot jump and cannot land on its own pieces.",
                  "An enemy piece in the way can be captured, and the queen stops there. Check the eight directions one at a time."],
    chess.KING: ["A king moves one square in any direction. Which squares touch {sq}?",
                 "The king may not land on a square the enemy attacks, nor next to the enemy king, nor on its own pieces.",
                 "For each touching square ask: is it free or enemy-held, and could an enemy piece capture the king there?"],
    chess.KNIGHT: ["A knight jumps in an L: two squares one way and one square at a right angle. Start from {sq}.",
                   "It jumps over other pieces, so nothing blocks it. It only cannot land on its own pieces; an enemy piece on a landing square can be captured.",
                   "There are at most eight landing squares. Check them in order: two up, two down, two left, two right, each with one step to the side."],
    chess.PAWN: ["A pawn moves straight ahead and captures diagonally ahead. Which squares are straight ahead of {sq}, and which are diagonal?",
                 "Straight ahead only onto an empty square (two squares from its starting rank if both are empty). A diagonal step is allowed only to capture an enemy piece.",
                 "Check the square in front first, then the two diagonal squares, then whether a two-square step is possible."],
}
UNLABELED_FIRST_HINT = "First decide what kind of piece stands on {sq}. Then recall how that piece moves."

SLIDER_SPECS = [
    dict(loc="center", own=0, enemy=0, extra=0), dict(loc="center", own=1, enemy=0, extra=0),
    dict(loc="center", own=0, enemy=1, extra=0), dict(loc="center", own=1, enemy=1, extra=1),
    dict(loc="edge", own=1, enemy=1, extra=0), dict(loc="corner", own=1, enemy=0, extra=0),
    dict(loc="corner", own=0, enemy=1, extra=1), dict(loc="any", own=2, enemy=1, extra=1),
    dict(loc="any", own=2, enemy=2, extra=1),
    dict(loc="any", own=2, enemy=1, extra=2), dict(loc="center", own=1, enemy=2, extra=1),
    dict(loc="edge", own=2, enemy=2, extra=0),
]
PAWN_SPECS = [  # rank index of white pawn (1 = rank 2), fwd/dbl/dl/dr contents: None, 'own', 'enemy'; file None = random
    dict(r=1, fwd=None, dbl=None, dl=None, dr=None), dict(r=1, fwd=None, dbl="own", dl=None, dr=None),
    dict(r=1, fwd="enemy", dbl=None, dl="enemy", dr=None), dict(r=3, fwd=None, dbl=None, dl="enemy", dr="enemy"),
    dict(r=3, fwd="enemy", dbl=None, dl="enemy", dr="own"), dict(r=2, fwd=None, dbl=None, dl=None, dr="enemy", file=0),
    dict(r=4, fwd="own", dbl=None, dl="enemy", dr="enemy"), dict(r=1, fwd=None, dbl=None, dl="enemy", dr=None),
    dict(r=5, fwd=None, dbl=None, dl="enemy", dr=None),
    dict(r=1, fwd=None, dbl=None, dl="own", dr="enemy"), dict(r=2, fwd="own", dbl=None, dl="enemy", dr=None, file=7),
    dict(r=4, fwd=None, dbl=None, dl="enemy", dr="enemy", file=3),
]
KING_SPECS = [  # attackers: enemy piece types placed so that they attack some square next to the king
    dict(loc="center", att=[], adj="none", ek2=False), dict(loc="corner", att=[], adj="own", ek2=False),
    dict(loc="edge", att=[], adj="free", ek2=False), dict(loc="center", att=[chess.ROOK], adj="none", ek2=False),
    dict(loc="center", att=[chess.BISHOP], adj="own", ek2=False), dict(loc="any", att=[chess.KNIGHT], adj="none", ek2=False),
    dict(loc="edge", att=[], adj="none", ek2=True), dict(loc="any", att=[chess.PAWN], adj="free", ek2=False),
    dict(loc="center", att=[chess.QUEEN], adj="none", ek2=False),
    dict(loc="any", att=[chess.ROOK, chess.BISHOP], adj="defended", ek2=False), dict(loc="edge", att=[chess.KNIGHT], adj="free", ek2=False),
    dict(loc="center", att=[chess.ROOK], adj="defended", ek2=True),
]
FILLER_OWN = [chess.PAWN, chess.PAWN, chess.KNIGHT, chess.BISHOP, chess.ROOK]
FILLER_ENEMY = [chess.PAWN, chess.PAWN, chess.KNIGHT, chess.BISHOP, chess.ROOK, chess.QUEEN]


def pick_square(rng, board, loc):
    for _ in range(100):
        if loc == "center":
            s = chess.square(rng.randrange(2, 6), rng.randrange(2, 6))
        elif loc == "edge":
            side = rng.randrange(4)
            k = rng.randrange(1, 7)
            s = [chess.square(0, k), chess.square(7, k), chess.square(k, 0), chess.square(k, 7)][side]
        elif loc == "corner":
            s = rng.choice([chess.A1, chess.H1, chess.A8, chess.H8])
        else:
            s = chess.square(rng.randrange(8), rng.randrange(8))
        if board.piece_at(s) is None:
            return s
    return None


def rand_piece_on(board, rng, sq, color, kinds):
    for _ in range(10):
        pt = rng.choice(kinds)
        if pt == chess.PAWN and chess.square_rank(sq) in (0, 7):
            continue
        put(board, sq, pt, color)
        return True
    return False


def build_slider_like(rng, ptype, spec):
    b = new_board()
    s = pick_square(rng, b, spec["loc"])
    if s is None:
        return None
    put(b, s, ptype, chess.WHITE)
    rays = [t for t in chess.SquareSet(b.attacks_mask(s)) if t != s]
    rng.shuffle(rays)
    for _ in range(spec["own"]):
        for t in rays:
            if b.piece_at(t) is None and rand_piece_on(b, rng, t, chess.WHITE, FILLER_OWN):
                break
    for _ in range(spec["enemy"]):
        for t in rays:
            if b.piece_at(t) is None and rand_piece_on(b, rng, t, chess.BLACK, FILLER_ENEMY):
                break
    for _ in range(spec["extra"]):
        t = random_empty(b, rng)
        rand_piece_on(b, rng, t, rng.choice([chess.WHITE, chess.BLACK]), FILLER_ENEMY)
    return finish(b, rng, s)


def build_pawn(rng, spec):
    b = new_board()
    f = spec.get("file", rng.randrange(8))
    r = spec["r"]
    s = chess.square(f, r)
    put(b, s, chess.PAWN, chess.WHITE)
    def fill(sq, what):
        if what is None or sq is None or not (0 <= chess.square_file(sq) <= 7) or b.piece_at(sq):
            return
        if what == "own":
            rand_piece_on(b, rng, sq, chess.WHITE, [chess.PAWN, chess.KNIGHT, chess.BISHOP, chess.ROOK])
        else:
            rand_piece_on(b, rng, sq, chess.BLACK, [chess.PAWN, chess.KNIGHT, chess.BISHOP, chess.ROOK, chess.QUEEN])
    fwd = chess.square(f, r + 1)
    fill(fwd, spec["fwd"])
    if r == 1 and spec["fwd"] is None:
        fill(chess.square(f, r + 2), spec["dbl"])
    if f > 0:
        fill(chess.square(f - 1, r + 1), spec["dl"])
    if f < 7:
        fill(chess.square(f + 1, r + 1), spec["dr"])
    for _ in range(rng.randrange(0, 3)):
        t = random_empty(b, rng)
        rand_piece_on(b, rng, t, rng.choice([chess.WHITE, chess.BLACK]), FILLER_ENEMY)
    return finish(b, rng, s)


def build_king(rng, spec):
    b = new_board()
    s = pick_square(rng, b, spec["loc"])
    if s is None:
        return None
    put(b, s, chess.KING, chess.WHITE)
    neigh = [t for t in chess.SquareSet(chess.BB_KING_ATTACKS[s])]
    rng.shuffle(neigh)
    if spec["ek2"]:  # enemy king two steps away: its squares next to ours are taken away
        cands = [t for t in chess.SQUARES if chess.square_distance(t, s) == 2 and b.piece_at(t) is None]
        t = rng.choice(cands)
        put(b, t, chess.KING, chess.BLACK)
    adj = spec["adj"]
    if adj == "own":
        t = next((t for t in neigh if b.piece_at(t) is None), None)
        if t is not None:
            rand_piece_on(b, rng, t, chess.WHITE, [chess.PAWN, chess.KNIGHT, chess.BISHOP, chess.ROOK])
    elif adj in ("free", "defended"):
        t = next((t for t in neigh if b.piece_at(t) is None), None)
        if t is not None:
            rand_piece_on(b, rng, t, chess.BLACK, [chess.PAWN, chess.KNIGHT, chess.BISHOP, chess.ROOK])
            if adj == "defended":  # give it a defender somewhere that is not on a king-touching square
                bp = b.piece_at(t)
                pt = rng.choice([chess.ROOK, chess.BISHOP, chess.KNIGHT, chess.PAWN])
                opts = [u for u in squares_from_which(b, chess.BLACK, pt, t) if chess.square_distance(u, s) > 1]
                if opts:
                    put(b, rng.choice(opts), pt, chess.BLACK)
    for pt in spec["att"]:
        opts = []
        for u in chess.SQUARES:
            if b.piece_at(u) is not None or chess.square_distance(u, s) <= 1:
                continue
            if pt == chess.PAWN and chess.square_rank(u) in (0, 7):
                continue
            b.set_piece_at(u, chess.Piece(pt, chess.BLACK))
            att = chess.SquareSet(b.attacks_mask(u))
            hits = [t for t in neigh if t in att and b.piece_at(t) is None]
            gives_check = s in att
            b.remove_piece_at(u)
            if hits and not gives_check:
                opts.append(u)
        if opts:
            put(b, rng.choice(opts), pt, chess.BLACK)
    for _ in range(rng.randrange(0, 2)):
        t = random_empty(b, rng)
        rand_piece_on(b, rng, t, chess.WHITE, FILLER_OWN)
    return finish(b, rng, s)


def finish(b, rng, mover_sq):
    """Add missing kings, set White to move, validate."""
    for color in (chess.WHITE, chess.BLACK):
        if b.king(color) is None:
            for _ in range(80):
                t = random_empty(b, rng)
                if t is None:
                    return None
                if b.king(not color) is not None and chess.square_distance(t, b.king(not color)) <= 1:
                    continue
                put(b, t, chess.KING, color)
                if color == chess.BLACK and b.attackers_mask(chess.WHITE, t):
                    b.remove_piece_at(t)
                    continue
                if color == chess.WHITE and b.attackers_mask(chess.BLACK, t):
                    b.remove_piece_at(t)
                    continue
                break
            else:
                return None
    b.turn = chess.WHITE
    if not b.is_valid() or b.is_check() or any_pinned(b) or not sane_material(b):
        return None
    dests = [m for m in b.legal_moves if m.from_square == mover_sq]
    if not dests:
        return None
    return b, mover_sq


MAX_PER_SIDE = {chess.QUEEN: 1, chess.ROOK: 2, chess.BISHOP: 2, chess.KNIGHT: 2, chess.PAWN: 8}


def sane_material(b):
    for color in (chess.WHITE, chess.BLACK):
        for pt, mx in MAX_PER_SIDE.items():
            if len(b.pieces(pt, color)) > mx:
                return False
    return True


def transform_square(s, kind):
    return {"orig": s, "mirror": s ^ 7, "flip": s ^ 56, "mirrorflip": s ^ 63}[kind]


def describe(board, sq, dests):
    piece = board.piece_at(sq)
    color = piece.color
    names = sorted(sqn(d) for d in dests)
    txt = f"The {PNAME[piece.piece_type]} on {sqn(sq)} can move to {len(names)} square{'s' if len(names) != 1 else ''}: {', '.join(names)}."
    caps = sorted((d for d in dests if board.piece_at(d) is not None))
    if caps:
        cp = [f"the {PNAME[board.piece_at(d).piece_type]} on {sqn(d)}" for d in caps]
        txt += f" It can capture {join_squares(cp)}."
    if piece.piece_type == chess.KING:
        reach = [t for t in chess.SquareSet(chess.BB_KING_ATTACKS[sq])
                 if not (board.piece_at(t) is not None and board.piece_at(t).color == color) and t not in dests]
        if reach:
            txt += f" It cannot go to {join_squares(sorted(sqn(t) for t in reach))}: the enemy covers {'that square' if len(reach) == 1 else 'those squares'}."
    elif piece.piece_type != chess.PAWN:
        blocked = sorted(sqn(t) for t in chess.SquareSet(board.attacks_mask(sq))
                         if board.piece_at(t) is not None and board.piece_at(t).color == color)
        if blocked:
            txt += f" It cannot land on its own piece{'s' if len(blocked) > 1 else ''} on {join_squares(blocked)}."
    return txt


def build(registry, pre):
    b = Builder(AREA, MODULE, SEED, registry, pre)
    rng = b.rng
    for ptype, pname, node in PIECES:
        specs = PAWN_SPECS if ptype == chess.PAWN else KING_SPECS if ptype == chess.KING else SLIDER_SPECS
        for base_i, spec in enumerate(specs):
            fam = f"FAM-GEN-MOVE-{pname}-{base_i + 1:02d}"
            res = None
            for _ in range(300):
                if ptype == chess.PAWN:
                    res = build_pawn(rng, spec)
                elif ptype == chess.KING:
                    res = build_king(rng, spec)
                else:
                    res = build_slider_like(rng, ptype, spec)
                if res is not None:
                    break
            if res is None:
                b.stats["no-base"] += 1
                continue
            board, mover0 = res
            if base_i % 2 == 1:  # odd bases start from the colour-flipped version, so the sets are half Black to move
                board, mover0 = colour_flip(board), mover0 ^ 56
            unlabeled = base_i >= 9
            for kind, vb in variants(board, kinds=("mirror", "flip")):
                ms = transform_square(mover0, kind)
                if vb.piece_at(ms) is None or vb.piece_at(ms).piece_type != ptype:
                    b.stats["transform-mismatch"] += 1
                    continue
                dests = sorted(m.to_square for m in vb.legal_moves if m.from_square == ms)
                if not dests or len(dests) != len(set(dests)):
                    b.stats["no-dests"] += 1
                    continue
                col = vb.piece_at(ms).color
                sq = sqn(ms)
                names = [sqn(d) for d in dests]
                hints = [h.format(sq=sq) for h in HINTS[ptype]]
                if unlabeled:
                    hints = [UNLABELED_FIRST_HINT.format(sq=sq)] + hints[1:]
                prompt = (f"{CTITLE[col]} to move. Tap every square the piece on {sq} can move to." if unlabeled
                          else f"{CTITLE[col]} to move. Tap every square the {CNAME[col]} {PNAME[ptype]} on {sq} can move to.")
                item = {
                    "skill": f"{node}.{'D2' if unlabeled else 'D1'}", "cue": 3 if unlabeled else 1,
                    "task": "select_squares", "prompt": prompt,
                    "answer": {"from": sq, "squares": sorted(names)},
                    "claims": [claim("C1", "legal_destinations", f"The {CNAME[col]} {PNAME[ptype]} on {sq} can legally move to exactly these squares.", **{"from": sq, "to": sorted(names)})],
                    "tags": tags_for([node], 0, 3 if unlabeled else 1, fam, ["task.select_squares"]),
                    "hints": hints,
                    "explain": describe(vb, ms, dests),
                }
                b.add(vb, fam, item, f"{pname.lower()} movement, {kind} of base {base_i + 1}", label=f"move-{pname.lower()}")
    return {FILE: b}


def main():
    from common import PreCheck, Registry
    reg = Registry.for_module(MODULE)
    pre = PreCheck()
    try:
        builders = build(reg, pre)
        for fname, b in builders.items():
            b.write(fname)
            print(fname, len(b.items), "items", dict(b.stats))
        for k, v in pre.rejects.items():
            print("reject", k, v, pre.reject_examples[k])
    finally:
        pre.close()


if __name__ == "__main__":
    main()
