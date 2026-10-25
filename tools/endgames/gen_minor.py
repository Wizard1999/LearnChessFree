"""Minor-piece endings, tablebase-backed: END.WRONG-BISHOP, END.MINOR.

Templates (the standard picture of each idea) are screened with the local engine (screening only); the tablebase decides what ships.
Run repeatedly (see gen_pawn.py).

    ./tools/.venv/Scripts/python.exe -I tools/endgames/gen_minor.py [wrongbishop] [minor]
"""
from __future__ import annotations

import random
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import chess

import egcommon as E
import engscreen as ES
import tb
from egcommon import Gen, Quota, only_move_item, predict_item, play_out_item
from gen_pawn import moves_budget
from gen_rook import put

SEED = 20261501
SCRIPT = "gen_minor.py"
sqr = chess.square
KING, PAWN, BISHOP = chess.KING, chess.PAWN, chess.BISHOP
SD = 12          # screening depth


def crng(tag, i):
    return random.Random(f"{SEED}-{tag}-{i}")


def sym(boards, rng):
    k = rng.random()
    out = []
    for b in boards:
        x = b
        if k < 0.5:
            x = E.mirror(x)
        if 0.25 < k < 0.75:
            x = E.flip(x)
        x.castling_rights = 0
        x.ep_square = None
        out.append(x)
    return out


def light(s):
    return (chess.square_file(s) + chess.square_rank(s)) % 2 == 1


HINTS_WB_PREDICT = [
    "Find the pawn and the bishop. On which file is the pawn, and on which colour of square will it queen?",
    "Does the bishop travel on the same colour as the pawn's queening square? Where is the defending king?",
    "Ask whether the defending king can reach the corner in front of the pawn and stay there: a bishop that cannot attack the corner cannot drive it out.",
]
HINTS_WB_HOLD = [
    "You are the defender. Which square is the key to the whole position?",
    "Count the moves the defending king needs to reach the corner in front of the pawn.",
    "Once the king is in the corner, shuffle between the corner squares that the bishop cannot attack. If you have no legal move and are not in check, the game is a draw by stalemate.",
]
HINTS_WB_WIN = [
    "Which colour of square does the bishop travel on, and which colour is the queening square?",
    "Drive the defending king out of the corner with the bishop and the king together, then push the pawn.",
    "Watch for stalemate when the defending king has no move: keep a bishop or king move in hand.",
]
HINTS_MIN_PREDICT = [
    "Compare the two bishops: do they travel on the same colour of squares?",
    "Ask which side can use its king and bishop together against the pawn, and whether the defender can set up on the colour the pawn needs.",
    "Check where the pawn will have to queen and whether the defender's bishop can control or block that square.",
]


# ----------------------------------------------------------------------------------------------------------------
# END.WRONG-BISHOP
# ----------------------------------------------------------------------------------------------------------------
def wb_board(f_pawn, r, wk, bk, bishop, stm=True):
    return put([(wk, KING, True), (sqr(f_pawn, r), PAWN, True), (bishop, BISHOP, True), (bk, KING, False)], stm)


def wb_candidates(rng, n):
    """a-file pawn; returns [(label, boards)] sets of related boards (wrong, right, far-king, b-file)."""
    out = []
    tries = 0
    while len(out) < n and tries < 600:
        tries += 1
        r = rng.choice([3, 4, 5])
        wk = sqr(rng.choice([0, 1, 2]), min(7, r + rng.choice([1, 2])))
        bk = sqr(rng.choice([0, 1, 2]), rng.choice([6, 7]))
        if chess.square_distance(wk, bk) <= 1:
            continue
        bs = rng.randrange(64)
        if chess.square_distance(bs, bk) <= 1 or bs in (wk, bk, sqr(0, r)):
            continue
        wrong = bs if not light(bs) else None
        if wrong is None:
            continue
        # right bishop: an adjacent light square
        opts = [t for t in range(64) if chess.square_distance(t, bs) == 1 and light(t) and t not in (wk, bk, sqr(0, r)) and chess.square_distance(t, bk) > 1]
        if not opts:
            continue
        bs2 = rng.choice(opts)
        b_wrong = wb_board(0, r, wk, bk, bs)
        b_right = wb_board(0, r, wk, bk, bs2)
        if not b_wrong or not b_right:
            continue
        sw, sr = ES.score(b_wrong.fen(), SD), ES.score(b_right.fen(), SD)
        if not (abs(sw) <= 45 and sr >= 300):
            continue
        # far king: the same wrong bishop but the defending king far from the corner
        far = None
        for _ in range(12):
            fk = sqr(rng.randrange(2, 8), rng.randrange(2, 6))
            if chess.square_distance(fk, wk) > 1 and fk != bs:
                fb = wb_board(0, r, wk, fk, bs)
                if fb and ES.score(fb.fen(), SD) >= 300:
                    far = fb
                    break
        # b-file picture: slide everything one file right (the bishop stays a wrong-coloured bishop for the new queening square)
        sh = None
        if all(chess.square_file(x) <= 6 for x in (wk, bk, bs)):
            sh = wb_board(1, r, wk + 1, bk + 1, bs + 1)
            if sh and ES.score(sh.fen(), SD) < 300:
                sh = None
        out.append(dict(r=r, wrong=b_wrong, right=b_right, far=far, bfile=sh))
    return out


def build_wrongbishop(foreign):
    g = Gen("WB", "end-wrong-bishop.json", SCRIPT, SEED + 1, foreign)
    node = "END.WRONG-BISHOP"
    qs = []
    idea = ["idea.wrong-bishop", "theme.bishopEndgame", "theme.rook-pawn"]
    q = Quota("wrong bishop families", 8)
    qs.append(q)
    for i, c in enumerate(wb_candidates(random.Random(SEED + 11), 14)):
        if not q.open():
            break
        rng = crng("wb", i)
        keys = ["wrong", "right", "far", "bfile"]
        boards = [c[k] for k in keys if c[k] is not None]
        labels = [k for k in keys if c[k] is not None]
        boards = sym(boards, rng)
        if not all([g.have(b) for b in boards]):
            q.wait()
            continue
        fam, cg = g.new_family(), g.new_cg()
        got = 0
        for lab, b in zip(labels, boards):
            if lab == "wrong":
                r = predict_item(g, b, fam, node, 2, 3, HINTS_WB_PREDICT, idea, cg=cg, role="failing", ref="wrong-coloured bishop, rook pawn")
                got += 1 if r else 0
            elif lab == "right":
                r = predict_item(g, b, fam, node, 1, 3, HINTS_WB_PREDICT, idea, cg=cg, role="working", ref="right bishop, rook pawn")
                got += 1 if r else 0
                if r:
                    mm = moves_budget(b.fen(), floor=20)
                    if mm:
                        play_out_item(g, b, fam, node, 3, "win", mm, HINTS_WB_WIN, idea, ref="win with the right bishop")
            elif lab == "far":
                r = predict_item(g, b, fam, node, 2, 3, HINTS_WB_PREDICT, idea + ["idea.defender-king-far"], cg=cg, role="irrelevant", ref="wrong bishop but defending king far from the corner")
                got += 1 if r else 0
            else:
                r = predict_item(g, b, fam, node, 3, 3, HINTS_WB_PREDICT, idea + ["idea.other-file"], cg=cg, role="irrelevant", ref="same picture on the b-file")
                got += 1 if r else 0
        if got:
            q.ok()
        # defender to move: find the drawing move in the wrong-bishop position
    q = Quota("defender: the only drawing move", 4)
    qs.append(q)
    rng0 = random.Random(SEED + 12)
    cand = []
    tries = 0
    while len(cand) < 20 and tries < 600:
        tries += 1
        r = rng0.choice([3, 4, 5])
        wk = sqr(rng0.choice([0, 1, 2]), min(7, r + rng0.choice([1, 2])))
        bk = sqr(rng0.choice([0, 1, 2, 3]), rng0.choice([5, 6, 7]))
        bs = rng0.randrange(64)
        if light(bs) or chess.square_distance(bs, bk) <= 1 or bs in (wk, bk, sqr(0, r)):
            continue
        b = wb_board(0, r, wk, bk, bs, stm=False)
        if not b:
            continue
        mv = ES.multipv(b.fen(), SD, 6)
        if len(mv) < 3 or abs(mv[0][1]) > 45:
            continue
        if mv[1][1] > -250:
            continue
        cand.append(b)
    for i, b in enumerate(cand):
        if not q.open():
            break
        (x,) = sym([b], crng("wbd", i))
        if not g.have(x):
            q.wait()
            continue
        fam = g.new_family()
        if only_move_item(g, x, fam, node, 2, 2, HINTS_WB_HOLD, idea, mode="hold", min_wrong=3, max_accepted=2, ref="wrong bishop: only drawing move"):
            q.ok()
            play_out_item(g, x, fam, node, 3, "hold", 30, HINTS_WB_HOLD, idea, ref="defend against the wrong bishop")
    return g, qs


# ----------------------------------------------------------------------------------------------------------------
# END.MINOR
# ----------------------------------------------------------------------------------------------------------------
def bb_board(pf, pr, wk, bk, wb, bb, stm=True, extra=()):
    pcs = [(wk, KING, True), (sqr(pf, pr), PAWN, True), (wb, BISHOP, True), (bk, KING, False), (bb, BISHOP, False)]
    pcs += [(sqr(f, r), PAWN, True) for f, r in extra]
    return put(pcs, stm)


def minor_pairs(rng, n):
    """Same-coloured versus opposite-coloured bishops, everything else the same (a bishop step apart)."""
    out, tries = [], 0
    while len(out) < n and tries < 800:
        tries += 1
        pf, pr = rng.randrange(1, 7), rng.choice([3, 4])
        wk = sqr(min(7, max(0, pf + rng.choice([-1, 0, 1]))), min(7, pr + rng.choice([0, 1, 2])))
        bk = sqr(min(7, max(0, pf + rng.choice([-1, 0, 1]))), min(7, pr + rng.choice([2, 3])))
        wbs, bbs = rng.randrange(64), rng.randrange(64)
        if chess.square_distance(wbs, bk) <= 1 or chess.square_distance(bbs, wk) <= 1:
            continue
        same = (light(wbs) == light(bbs))
        alt = [t for t in range(64) if chess.square_distance(t, bbs) == 1 and (light(t) == light(wbs)) != same and t not in (wk, bk, wbs, sqr(pf, pr))]
        if not alt:
            continue
        b1 = bb_board(pf, pr, wk, bk, wbs, bbs)
        b2 = bb_board(pf, pr, wk, bk, wbs, rng.choice(alt))
        if not b1 or not b2:
            continue
        s1, s2 = ES.score(b1.fen(), SD), ES.score(b2.fen(), SD)
        if same:
            sm, op, bsame, bopp = s1, s2, b1, b2
        else:
            sm, op, bsame, bopp = s2, s1, b2, b1
        if sm >= 300 and abs(op) <= 45:
            out.append((bsame, bopp))
    return out


def two_passers(rng, n):
    """Opposite-coloured bishops: two far-apart passed pawns versus one passed pawn (the same position minus a pawn)."""
    out, tries = [], 0
    while len(out) < n and tries < 800:
        tries += 1
        f1, f2 = rng.choice([(0, 6), (0, 5), (1, 6), (0, 7), (1, 7)])
        r1, r2 = rng.choice([3, 4]), rng.choice([3, 4])
        wk = sqr(rng.randrange(2, 6), rng.choice([3, 4, 5]))
        bk = sqr(rng.randrange(2, 6), rng.choice([5, 6]))
        wbs, bbs = rng.randrange(64), rng.randrange(64)
        if light(wbs) == light(bbs):
            continue
        two = bb_board(f1, r1, wk, bk, wbs, bbs, extra=[(f2, r2)])
        one = bb_board(f1, r1, wk, bk, wbs, bbs)
        if not two or not one:
            continue
        s2, s1 = ES.score(two.fen(), SD), ES.score(one.fen(), SD)
        if s2 >= 300 and abs(s1) <= 45:
            out.append((two, one))
    return out


def build_minor(foreign):
    g = Gen("MIN", "end-minor.json", SCRIPT, SEED + 2, foreign)
    node = "END.MINOR"
    qs = []
    idea = ["idea.opposite-bishops", "theme.bishopEndgame"]
    q = Quota("same vs opposite coloured bishops", 6)
    qs.append(q)
    for i, (bs, bo) in enumerate(minor_pairs(random.Random(SEED + 21), 14)):
        if not q.open():
            break
        x, y = sym([bs, bo], crng("min", i))
        if not all([g.have(x), g.have(y)]):
            q.wait()
            continue
        fam, cg = g.new_family(), g.new_cg()
        a = predict_item(g, x, fam, node, 1, 3, HINTS_MIN_PREDICT, idea + ["idea.same-coloured-bishops"], cg=cg, role="working", ref="same-coloured bishops, extra pawn")
        c = predict_item(g, y, fam, node, 1, 3, HINTS_MIN_PREDICT, idea, cg=cg, role="failing", ref="opposite-coloured bishops, extra pawn")
        if a and c:
            q.ok()
    q = Quota("two distant passers vs one", 4)
    qs.append(q)
    for i, (two, one) in enumerate(two_passers(random.Random(SEED + 22), 12)):
        if not q.open():
            break
        x, y = sym([two, one], crng("min2", i))
        if not all([g.have(x), g.have(y)]):
            q.wait()
            continue
        fam, cg = g.new_family(), g.new_cg()
        a = predict_item(g, x, fam, node, 3, 3, HINTS_MIN_PREDICT, idea + ["idea.two-passers"], cg=cg, role="working", ref="opposite bishops, two distant passed pawns")
        c = predict_item(g, y, fam, node, 3, 3, HINTS_MIN_PREDICT, idea, cg=cg, role="failing", ref="opposite bishops, one passed pawn")
        if a and c:
            q.ok()
    return g, qs


BUILDERS = {"wrongbishop": build_wrongbishop, "minor": build_minor}
FILES = {"wrongbishop": "end-wrong-bishop.json", "minor": "end-minor.json"}


def main(names):
    names = names or list(BUILDERS)
    foreign = E.foreign_fens(regen={FILES[n] for n in names})
    try:
        for name in names:
            g, qs = BUILDERS[name](foreign)
            n = g.flush_need("minor-" + name)
            g.write()
            foreign |= {E.fen_key(pp["fen"]) for pp in g.positions}
            E.report(g, qs)
            print(f"   queued {n} new positions for the daemon")
    finally:
        ES.close()
        E.close_engine()


if __name__ == "__main__":
    main(sys.argv[1:])
