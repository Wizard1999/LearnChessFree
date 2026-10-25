"""Family 5: mate in one (FND.MATE1).

find_move   "Find checkmate in one." answer.moves = EVERY mating move in the position (python-chess enumerates them),
            one `mate_in` (n=1) claim per accepted move. Patterns (each base = one family, 3 positions: original,
            mirror, colour-flip): back-rank, queen+king, rook+king, smothered, knight, discovered, promotion, other.
classify    "Is there a mate in one?"  options [mate in one, no mate in one].
            'yes' = a fresh base with a mate (claim mate_in); 'no' = the SAME base after one spoiling change
            (a luft, a defender, a displaced attacker); claim eval_range proves the engine finds no forced mate at all
            (so there is certainly no mate in one). yes/no pairs share a family.
Patterns are classified by a rules-only classifier (pattern_of); pattern names appear only in tags (theme.*), never in
the learner-facing explanation, which says only what `mate_in` verifies.

    python tools/generators/gen_mate1.py          # writes content/items/gen-t0-mate1.json
"""
from __future__ import annotations

import sys as _s, pathlib as _p
_s.path.insert(0, str(_p.Path(__file__).resolve().parent))
import chess

from common import *  # noqa: F401,F403

AREA, MODULE, SEED, FILE = "MATE1", "mate1", 20261028, "gen-t0-mate1.json"
P, N, B, R, Q, K = chess.PAWN, chess.KNIGHT, chess.BISHOP, chess.ROOK, chess.QUEEN, chess.KING

THEME = {"back-rank": "theme.backRankMate", "queen-king": "theme.mate", "rook-king": "theme.mate",
         "smothered": "theme.smotheredMate", "knight": "theme.mate", "discovered": "theme.discoveredAttack",
         "promotion": "theme.promotion", "other": "theme.mate"}


def find_mates(board):
    out = []
    for m in board.legal_moves:
        board.push(m)
        if board.is_checkmate():
            out.append(m)
        board.pop()
    return sorted(out, key=lambda m: m.uci())


def pattern_of(board, mv):
    mover = board.turn
    piece = board.piece_at(mv.from_square)
    after = board.copy(stack=False)
    after.push(mv)
    ksq = after.king(after.turn)
    checkers = list(after.checkers())
    if mv.promotion:
        return "promotion"
    if checkers and any(c != mv.to_square for c in checkers):
        return "discovered"
    pt = piece.piece_type
    if pt == N:
        neigh = chess.SquareSet(chess.BB_KING_ATTACKS[ksq])
        if all(after.piece_at(s) is not None and after.piece_at(s).color == after.turn for s in neigh):
            return "smothered"
        return "knight"
    if pt in (R, Q):
        back = 7 if after.turn == chess.BLACK else 0
        if chess.square_rank(ksq) == back and chess.square_rank(mv.to_square) == back:
            return "back-rank"
        if pt == Q and chess.square_distance(mv.to_square, ksq) == 1 and chess.square_distance(mv.to_square, after.king(mover)) == 1:
            return "queen-king"
        if pt == R and len(pieces_of(after, after.turn, include_king=False)) == 0:
            return "rook-king"
    return "other"


def edge_square(rng):
    side = rng.randrange(4)
    k = rng.randrange(8)
    return [chess.square(0, k), chess.square(7, k), chess.square(k, 0), chess.square(k, 7)][side]


def ok_place(sq, pt):
    return not (pt == P and chess.square_rank(sq) in (0, 7))


def finish(b, rng, wk_far=True):
    if b.king(chess.WHITE) is None:
        for _ in range(80):
            s = random_empty(b, rng)
            if b.king(chess.BLACK) is not None and chess.square_distance(s, b.king(chess.BLACK)) <= 2:
                continue
            put(b, s, K, chess.WHITE)
            if b.attackers_mask(chess.BLACK, s):
                b.remove_piece_at(s)
                continue
            break
        else:
            return None
    b.turn = chess.WHITE
    if not b.is_valid() or b.is_check():
        return None
    return b


def s_backrank(rng):
    b = new_board()
    f = rng.randrange(8)
    put(b, chess.square(f, 7), K, chess.BLACK)
    for df in (-1, 0, 1):
        ff = f + df
        if 0 <= ff <= 7 and rng.random() < 0.92:
            put(b, chess.square(ff, 6), rng.choice([P, P, P, P, N, B]) if rng.random() < 0.3 else P, chess.BLACK)
    heavy = rng.choice([R, R, Q])
    s = random_empty(b, rng, ranks=range(0, 7))
    put(b, s, heavy, chess.WHITE)
    for _ in range(rng.randrange(0, 3)):
        t = random_empty(b, rng, ranks=range(1, 6))
        pt = rng.choice([P, P, N, B])
        if ok_place(t, pt):
            put(b, t, pt, rng.choice([chess.WHITE, chess.BLACK]))
    return finish(b, rng)


def s_kq(rng, piece=Q):
    b = new_board()
    put(b, edge_square(rng), K, chess.BLACK)
    bk = b.king(chess.BLACK)
    for _ in range(60):
        wk = random_empty(b, rng)
        if chess.square_distance(wk, bk) >= 2:
            put(b, wk, K, chess.WHITE)
            break
    else:
        return None
    s = random_empty(b, rng)
    put(b, s, piece, chess.WHITE)
    if rng.random() < 0.3:
        t = random_empty(b, rng, ranks=range(1, 6))
        put(b, t, P, rng.choice([chess.WHITE, chess.BLACK]))
    return finish(b, rng)


def s_smothered(rng):
    corners = [(chess.H8, [chess.G8, chess.G7, chess.H7], [chess.F7, chess.G6]), (chess.A8, [chess.B8, chess.B7, chess.A7], [chess.C7, chess.B6]),
               (chess.H1, [chess.G1, chess.G2, chess.H2], [chess.F2, chess.G3]), (chess.A1, [chess.B1, chess.B2, chess.A2], [chess.C2, chess.B3])]
    kc, neigh, nsq = rng.choice(corners)
    b = new_board()
    put(b, kc, K, chess.BLACK)
    for s in neigh:
        pt = rng.choice([R, P, P, B, N, Q])
        if not ok_place(s, pt):
            pt = R
        put(b, s, pt, chess.BLACK)
    target = rng.choice(nsq)
    starts = [s for s in chess.SquareSet(chess.BB_KNIGHT_ATTACKS[target]) if b.piece_at(s) is None and s != kc]
    if not starts:
        return None
    put(b, rng.choice(starts), N, chess.WHITE)
    return finish(b, rng)


def s_knight(rng):
    b = new_board()
    bk = edge_square(rng)
    put(b, bk, K, chess.BLACK)
    neigh = [s for s in chess.SquareSet(chess.BB_KING_ATTACKS[bk])]
    rng.shuffle(neigh)
    for s in neigh[: rng.randrange(1, 4)]:
        pt = rng.choice([P, P, R, B, N])
        if ok_place(s, pt):
            put(b, s, pt, chess.BLACK)
    put(b, random_empty(b, rng), N, chess.WHITE)
    for pt in rng.sample([R, B, Q, P, P], rng.randrange(1, 3)):
        s = random_empty(b, rng)
        if ok_place(s, pt):
            put(b, s, pt, chess.WHITE)
    return finish(b, rng)


def s_discovered(rng):
    b = new_board()
    bk = edge_square(rng) if rng.random() < 0.8 else random_empty(b, rng)
    put(b, bk, K, chess.BLACK)
    # a white slider aimed at the king through one white blocker
    slider = rng.choice([R, B, Q])
    dirs = [d for d in range(8) if True]
    kf, kr = chess.square_file(bk), chess.square_rank(bk)
    rays = []
    for df, dr in ((1, 0), (-1, 0), (0, 1), (0, -1), (1, 1), (1, -1), (-1, 1), (-1, -1)):
        if (df == 0 or dr == 0) and slider == B:
            continue
        if df != 0 and dr != 0 and slider == R:
            continue
        sqs, f, r = [], kf + df, kr + dr
        while 0 <= f <= 7 and 0 <= r <= 7:
            sqs.append(chess.square(f, r))
            f += df
            r += dr
        if len(sqs) >= 3:
            rays.append(sqs)
    if not rays:
        return None
    ray = rng.choice(rays)
    i = rng.randrange(2, len(ray))
    put(b, ray[i], slider, chess.WHITE)
    j = rng.randrange(1, i)
    blocker = rng.choice([N, B, R, P, Q])
    if not ok_place(ray[j], blocker):
        blocker = N
    put(b, ray[j], blocker, chess.WHITE)
    neigh = list(chess.SquareSet(chess.BB_KING_ATTACKS[bk]))
    rng.shuffle(neigh)
    for s in neigh[: rng.randrange(0, 5)]:
        if b.piece_at(s) is None:
            pt = rng.choice([P, P, R, B, N])
            if ok_place(s, pt):
                put(b, s, pt, chess.BLACK)
    return finish(b, rng)


def s_promotion(rng):
    b = new_board()
    f = rng.randrange(8)
    put(b, chess.square(f, 7), K, chess.BLACK) if rng.random() < 0.8 else put(b, chess.square(f, 6), K, chess.BLACK)
    bk = b.king(chess.BLACK)
    for s in rng.sample(list(chess.SquareSet(chess.BB_KING_ATTACKS[bk])), rng.randrange(1, 4)):
        pt = rng.choice([P, P, R, B, N])
        if ok_place(s, pt) and b.piece_at(s) is None:
            put(b, s, pt, chess.BLACK)
    pf = rng.randrange(8)
    ps = chess.square(pf, 6)
    if b.piece_at(ps) is not None:
        return None
    put(b, ps, P, chess.WHITE)
    if rng.random() < 0.5:
        put(b, random_empty(b, rng), rng.choice([R, B, N, Q]), chess.WHITE)
    return finish(b, rng)


def s_other(rng):
    b = new_board()
    bk = edge_square(rng) if rng.random() < 0.7 else random_empty(b, rng)
    put(b, bk, K, chess.BLACK)
    for s in rng.sample(list(chess.SquareSet(chess.BB_KING_ATTACKS[bk])), rng.randrange(0, 4)):
        pt = rng.choice([P, P, R, B])
        if ok_place(s, pt) and b.piece_at(s) is None:
            put(b, s, pt, chess.BLACK)
    for pt in rng.sample([Q, B, B, P, P, N, R], rng.randrange(2, 4)):
        s = random_empty(b, rng)
        if ok_place(s, pt):
            put(b, s, pt, chess.WHITE)
    return finish(b, rng)


SAMPLERS = {
    "back-rank": s_backrank, "queen-king": lambda r: s_kq(r, Q), "rook-king": lambda r: s_kq(r, R), "smothered": s_smothered,
    "knight": s_knight, "discovered": s_discovered, "promotion": s_promotion, "other": s_other,
}


def draw_base(rng, pattern, max_mates=3, tries=300000):
    sampler = SAMPLERS[pattern]
    for _ in range(tries):
        b = sampler(rng)
        if b is None or any_pinned(b) or chess.square_rank(b.king(chess.BLACK)) < 4:  # defender's king in the top half, so the colour-flip is natural too
            continue
        mates = find_mates(b)
        if not mates or len(mates) > max_mates:
            continue
        if pattern_of(b, mates[0]) != pattern or any(pattern_of(b, m) != pattern for m in mates):
            continue
        return b
    return None


HINTS = ["Look at the enemy king. Which squares could it flee to, and which of them are already blocked or covered?",
         "You need a check that leaves the king with no square, no capture of the checking piece, and no block.",
         "Try each check in turn. For each one ask: can the king step away, can the checker be taken, can anything block?"]


def mate_item_claims(vb, mates):
    return [claim(f"C{i + 1}", "mate_in", f"{vb.san(m)} is checkmate.", move=m.uci(), n=1) for i, m in enumerate(mates)]


def emit_find(b, base, kind, fam, pattern):
    vb = variant_board(base, kind)
    mates = find_mates(vb)
    if not mates or len(mates) > 3:
        b.stats["variant-lost-shape"] += 1
        return None
    sans = [vb.san(m) for m in mates]
    if len(mates) == 1:
        expl = f"{sans[0]} is checkmate: it gives check and the king has no legal reply."
    else:
        expl = f"{join_squares(sans)} are all checkmate: each gives check and leaves the king no legal reply."
    item = {
        "skill": "FND.MATE1.D1", "cue": 1, "task": "find_move",
        "prompt": f"{CTITLE[vb.turn]} to move. Find checkmate in one.",
        "answer": {"moves": [m.uci() for m in mates]},
        "claims": mate_item_claims(vb, mates),
        "tags": tags_for(["FND.MATE1"], 1, 1, fam, ["theme.mateIn1", THEME[pattern], f"pattern.{pattern}", "task.find_move"]),
        "hints": HINTS, "explain": expl,
    }
    return b.add(vb, fam, item, f"mate in one ({pattern}), {kind}", label=f"mate1-{pattern}")


def variant_board(base, kind):
    return {"orig": base.copy(stack=False), "mirror": mirror_files(base), "flip": colour_flip(base)}[kind]


CLS_HINTS = ["First list the checks you have. A mate in one must be a check.",
             "For each check, look at the king's escape squares, whether the checking piece can be captured, and whether the line can be blocked.",
             "If every check can be answered, there is no mate in one. If one check cannot be answered, that is the mate."]


def emit_class_yes(b, base, kind, fam, pattern):
    vb = variant_board(base, kind)
    mates = find_mates(vb)
    if not mates:
        return None
    m = mates[0]
    item = {
        "skill": "FND.MATE1.D2", "cue": 3, "task": "classify_position",
        "prompt": f"{CTITLE[vb.turn]} to move. Is there a mate in one?",
        "answer": {"class": "mate in one", "options": ["mate in one", "no mate in one"]},
        "claims": [claim("C1", "mate_in", f"{vb.san(m)} is checkmate.", move=m.uci(), n=1)],
        "tags": tags_for(["FND.MATE1"], 1, 3, fam, ["theme.mateIn1", THEME[pattern], f"pattern.{pattern}", "task.classify"]),
        "hints": CLS_HINTS, "explain": f"Yes: {vb.san(m)} is checkmate, because it gives check and the king has no legal reply.",
    }
    return b.add(vb, fam, item, f"is-there-mate yes ({pattern}), {kind}", label="mate1-class-yes")


def emit_class_no(b, spoiled, kind, fam):
    vb = variant_board(spoiled, kind)
    if find_mates(vb):
        b.stats["variant-lost-shape"] += 1
        return None
    if vb.turn == chess.WHITE:
        cl = claim("C1", "eval_range", "The engine sees no forced mate for the side to move (so there is no mate in one).", max=20000)
    else:
        cl = claim("C1", "eval_range", "The engine sees no forced mate for the side to move (so there is no mate in one).", min=-20000)
    item = {
        "skill": "FND.MATE1.D2", "cue": 3, "task": "classify_position",
        "prompt": f"{CTITLE[vb.turn]} to move. Is there a mate in one?",
        "answer": {"class": "no mate in one", "options": ["mate in one", "no mate in one"]},
        "claims": [cl],
        "tags": tags_for(["FND.MATE1"], 1, 3, fam, ["task.classify", "theme.quiet-near-miss"]),
        "hints": CLS_HINTS,
        "explain": "No. Every check the side to move has can be answered, so nothing is checkmate in one move. The engine (depth 16) finds no forced mate here at all.",
    }
    return b.add(vb, fam, item, f"is-there-mate no, {kind}", label="mate1-class-no")


def spoil(rng, base):
    """One change that removes every mate in one but keeps the position similar. Returns a White-to-move board or None."""
    cands = []
    kb = base.king(chess.BLACK)
    # (1) displace a white non-king piece one pseudo-legal step away
    w = base.copy(stack=False)
    for m in list(w.pseudo_legal_moves):
        if w.piece_at(m.to_square) is not None:
            continue
        pc = w.piece_at(m.from_square)
        if pc.piece_type == K:
            continue
        n = base.copy(stack=False)
        n.set_piece_at(m.from_square, None)
        n.set_piece_at(m.to_square, pc)
        cands.append(n)
    # (2) add one black defender next to the black king region
    for s in chess.SQUARES:
        if base.piece_at(s) is None and chess.square_distance(s, kb) <= 3:
            for pt in (P, N, B, R):
                if not ok_place(s, pt):
                    continue
                n = base.copy(stack=False)
                put(n, s, pt, chess.BLACK)
                cands.append(n)
    # (3) delete one black non-king piece, or push a black pawn
    for s, pc in pieces_of(base, chess.BLACK, include_king=False):
        n = base.copy(stack=False)
        n.remove_piece_at(s)
        cands.append(n)
    rng.shuffle(cands)
    good = []
    for n in cands:
        n.turn = chess.WHITE
        if not n.is_valid() or n.is_check() or any_pinned(n):
            continue
        if find_mates(n):
            continue
        checks = [m for m in n.legal_moves if n.gives_check(m)]
        if not checks:
            continue
        good.append(n)
        if len(good) >= 12:
            break
    return rng.choice(good) if good else None


def build(registry, pre):
    b = Builder(AREA, MODULE, SEED, registry, pre)
    rng = b.rng
    quota = [("back-rank", 8), ("queen-king", 5), ("rook-king", 5), ("smothered", 3), ("knight", 4), ("discovered", 4), ("promotion", 4), ("other", 3)]
    bi = 0
    for pattern, nb in quota:
        for _ in range(nb):
            bi += 1
            fam = f"FAM-GEN-MATE1-{bi:02d}"
            base = draw_base(rng, pattern)
            if base is None:
                b.stats[f"no-base-{pattern}"] += 1
                continue
            if not emit_find(b, base, "orig", fam, pattern):
                b.stats["orig-rejected"] += 1
                continue
            emit_find(b, base, "mirror", fam, pattern)
            emit_find(b, base, "flip", fam, pattern)
    # 'is there a mate in one?': 14 yes/no pairs
    cls_patterns = ["back-rank", "back-rank", "queen-king", "queen-king", "rook-king", "smothered", "knight", "knight", "discovered",
                    "promotion", "other", "back-rank", "queen-king", "rook-king"]
    for i, pattern in enumerate(cls_patterns):
        bi += 1
        fam = f"FAM-GEN-MATE1-{bi:02d}"
        for attempt in range(40):
            base = draw_base(rng, pattern)
            if base is None:
                break
            sp = spoil(rng, base)
            if sp is None:
                continue
            kind = "orig" if i % 2 == 0 else "flip"
            if not emit_class_no(b, sp, kind, fam):  # the 'no' position carries the engine claim: place it first
                b.stats["no-rejected"] += 1
                continue
            emit_class_yes(b, base, kind, fam, pattern)
            break
        else:
            b.stats[f"no-pair-{pattern}"] += 1
    return {FILE: b}


def main():
    reg = Registry.for_module(MODULE)
    pre = PreCheck()
    try:
        builders = build(reg, pre)
        import collections
        for fname, bl in builders.items():
            bl.write(fname)
            print(fname, len(bl.items), "items", dict(bl.stats))
            print(collections.Counter([t for t in i["tags"] if t.startswith("pattern.")][0] if any(t.startswith("pattern.") for t in i["tags"]) else "none" for i in bl.items))
        for k, v in pre.rejects.items():
            print("reject", k, v, pre.reject_examples[k])
    finally:
        pre.close()


if __name__ == "__main__":
    main()
