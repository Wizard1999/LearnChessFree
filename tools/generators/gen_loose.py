"""Family 3: loose pieces (SAF.LOOSE).

Definition used everywhere (and by the validator's `loose_pieces` claim): a non-king piece that is attacked by the
enemy and defended by none of its own pieces. Direct attacks only; positions with a pinned piece are not used.

  select_squares  "Tap every <colour> piece that is attacked and not defended"   answer.squares, claim loose_pieces (cue 1, D1)
  predict_outcome "How many <colour> pieces are loose? none / one / two or more"  claim loose_pieces (cue 3, D2); the
                  'none' answers are the 'is anything hanging?' items with attacked-but-defended distractors.

Random 'cluster' positions (3-6 pieces a side inside a 5x5 window) are drawn until each quota (loose-set size) is filled.
Base scenario = family; select items get 3 positions (original, mirror, colour-flip), count items get 2 (original, flip).

    python tools/generators/gen_loose.py          # writes content/items/gen-t0-loose.json
"""
from __future__ import annotations

import sys as _s, pathlib as _p
_s.path.insert(0, str(_p.Path(__file__).resolve().parent))
import chess

from common import *  # noqa: F401,F403

AREA, MODULE, SEED, FILE = "LOOSE", "loose", 20261026, "gen-t0-loose.json"
POOL = [chess.PAWN, chess.PAWN, chess.PAWN, chess.KNIGHT, chess.KNIGHT, chess.BISHOP, chess.BISHOP, chess.ROOK, chess.QUEEN]
MAX_PER_SIDE = {chess.QUEEN: 1, chess.ROOK: 2, chess.BISHOP: 2, chess.KNIGHT: 2, chess.PAWN: 8}


def loose_set(board, color):
    return sorted(s for s, p in board.piece_map().items()
                  if p.color == color and p.piece_type != chess.KING and board.attackers(not color, s) and not board.attackers(color, s))


def classify_white_nonloose(board, color):
    """(attacked_but_defended, unattacked_undefended) lists of squares for `color`'s non-king pieces."""
    ad, uu = [], []
    for s, p in board.piece_map().items():
        if p.color != color or p.piece_type == chess.KING:
            continue
        att, dfn = bool(board.attackers(not color, s)), bool(board.attackers(color, s))
        if att and dfn:
            ad.append(s)
        elif not att and not dfn:
            uu.append(s)
    return ad, uu


def random_cluster(rng):
    b = new_board()
    cx, cy = rng.randrange(2, 6), rng.randrange(2, 6)
    window = [chess.square(f, r) for f in range(8) for r in range(8) if abs(f - cx) <= 2 and abs(r - cy) <= 2]
    for color in (chess.WHITE, chess.BLACK):
        for _ in range(rng.randrange(3, 6)):
            pt = rng.choice(POOL)
            opts = [s for s in window if b.piece_at(s) is None and not (pt == chess.PAWN and chess.square_rank(s) in (0, 7))]
            if pt == chess.PAWN:
                opts = [s for s in opts if (chess.square_rank(s) >= 1 and chess.square_rank(s) <= 5 if color == chess.WHITE else 2 <= chess.square_rank(s) <= 6)]
            if opts:
                put(b, rng.choice(opts), pt, color)
    for color in (chess.WHITE, chess.BLACK):
        for _ in range(60):
            s = random_empty(b, rng)
            if b.king(not color) is not None and chess.square_distance(s, b.king(not color)) <= 2:
                continue
            put(b, s, chess.KING, color)
            if b.attackers_mask(not color, s):
                b.remove_piece_at(s)
                continue
            break
        else:
            return None
    b.turn = chess.WHITE
    if not b.is_valid() or b.is_check() or any_pinned(b):
        return None
    for color in (chess.WHITE, chess.BLACK):
        for pt, mx in MAX_PER_SIDE.items():
            if len(b.pieces(pt, color)) > mx:
                return None
    return b


def draw_base(rng, want):
    """want: ('size', k) or ('size>=', k) or ('none',). Returns a White-to-move board whose WHITE loose set matches."""
    for _ in range(200000):
        b = random_cluster(rng)
        if b is None:
            continue
        ls = loose_set(b, chess.WHITE)
        ad, uu = classify_white_nonloose(b, chess.WHITE)
        if want[0] == "size":
            ok = len(ls) == want[1] and (ad or uu)
        elif want[0] == "size>=":
            ok = len(ls) >= want[1] and (ad or uu)
        else:
            ok = len(ls) == 0 and ad  # nothing loose, and at least one attacked-but-defended piece
        if ok and len([1 for p in b.piece_map().values() if p.color == chess.WHITE]) >= 3:
            return b
    return None


def transform_square(s, kind):
    return {"orig": s, "mirror": s ^ 7, "flip": s ^ 56, "mirrorflip": s ^ 63}[kind]


def build(registry, pre):
    b = Builder(AREA, MODULE, SEED, registry, pre)
    rng = b.rng
    sel_quota = [1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 3, 3, 3]
    rng.shuffle(sel_quota)
    cnt_quota = [("none",), ("none",), ("none",), ("none",), ("size", 1), ("size", 1), ("size>=", 2), ("size>=", 2)]
    bi = 0
    for k in sel_quota:
        bi += 1
        fam = f"FAM-GEN-LOOSE-S{bi:02d}"
        for attempt in range(40):
            base = draw_base(rng, ("size", k))
            if base is None:
                break
            ok_orig = emit_select(b, base, "orig", fam)
            if ok_orig:
                emit_select(b, base, "mirror", fam)
                emit_select(b, base, "flip", fam)
                break
        else:
            b.stats["no-base"] += 1
    for want in cnt_quota:
        bi += 1
        fam = f"FAM-GEN-LOOSE-C{bi:02d}"
        for attempt in range(40):
            base = draw_base(rng, want)
            if base is None:
                break
            if emit_count(b, base, "orig", fam):
                emit_count(b, base, "flip", fam)
                break
        else:
            b.stats["no-base"] += 1
    return {FILE: b}


def variant_board(base, kind):
    return {"orig": base.copy(stack=False), "mirror": mirror_files(base), "flip": colour_flip(base)}[kind]


HINTS_SELECT = ["A piece is loose when an enemy piece attacks it and none of its own side's pieces defends it. Check your pieces one at a time.",
                "For each of your pieces ask two questions: is it attacked? If yes, could one of your own pieces recapture on that square?",
                "Kings do not count. A piece that is attacked but defended is not loose, and a piece nobody attacks is not in danger."]


def emit_select(b, base, kind, fam):
    vb = variant_board(base, kind)
    color = vb.turn
    ls = loose_set(vb, color)
    if not ls:
        return None
    names = [sqn(s) for s in ls]
    word = f"{len(ls)} loose piece{'s' if len(ls) != 1 else ''}"
    item = {
        "skill": "SAF.LOOSE.D1", "cue": 1, "task": "select_squares",
        "prompt": f"{CTITLE[color]} to move. Tap every {CNAME[color]} piece that is attacked and not defended (kings do not count).",
        "answer": {"squares": names},
        "claims": [claim("C1", "loose_pieces", f"The {CNAME[color]} pieces that are attacked and undefended are exactly {', '.join(names)}.", color=CNAME[color], squares=names)],
        "tags": tags_for(["SAF.LOOSE"], 1, 1, fam, ["task.select_squares", "theme.hangingPiece"]),
        "hints": HINTS_SELECT,
        "explain": f"{CTITLE[color]} has {word}: {join_squares(names)}. Each is attacked by an enemy piece and has no defender.",
    }
    return b.add(vb, fam, item, f"loose select, {kind}", label="loose-select")


def emit_count(b, base, kind, fam):
    vb = variant_board(base, kind)
    color = vb.turn
    ls = loose_set(vb, color)
    names = [sqn(s) for s in ls]
    out = "none" if len(ls) == 0 else "one" if len(ls) == 1 else "two or more"
    if out == "none":
        expl = f"No {CNAME[color]} piece is both attacked and undefended, so nothing is loose."
    elif out == "one":
        expl = f"Exactly one {CNAME[color]} piece is loose: the piece on {names[0]} is attacked and has no defender."
    else:
        expl = f"{len(ls)} {CNAME[color]} pieces are loose ({join_squares(names)}): each is attacked and has no defender."
    item = {
        "skill": "SAF.LOOSE.D2", "cue": 3, "task": "predict_outcome",
        "prompt": f"{CTITLE[color]} to move. How many {CNAME[color]} pieces are loose (attacked and not defended; kings do not count)?",
        "answer": {"outcome": out, "options": ["none", "one", "two or more"]},
        "claims": [claim("C1", "loose_pieces", f"The {CNAME[color]} loose pieces are exactly: {', '.join(names) if names else 'none'}.", color=CNAME[color], squares=names)],
        "tags": tags_for(["SAF.LOOSE"], 1, 3, fam, ["task.loose-count", "theme.hangingPiece"]),
        "hints": HINTS_SELECT, "explain": expl,
    }
    return b.add(vb, fam, item, f"loose count ({out}), {kind}", label="loose-count")


def main():
    reg = Registry.for_module(MODULE)
    pre = PreCheck()
    try:
        builders = build(reg, pre)
        for fname, bl in builders.items():
            bl.write(fname)
            print(fname, len(bl.items), "items", dict(bl.stats))
        for k, v in pre.rejects.items():
            print("reject", k, v, pre.reject_examples[k])
    finally:
        pre.close()


if __name__ == "__main__":
    main()
