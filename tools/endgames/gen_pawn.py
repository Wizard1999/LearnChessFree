"""Pawn-ending exercises, tablebase-backed (END.KEYSQ, END.KPK, END.OPPOSITION.DISTANT, END.ZUGZWANG, END.TRIANGULATION, END.KING-ACTIVE,
END.TEMPO and END.PAWN-TEMPO are in gen_pawn2.py).

Method: candidate positions come from two LOCAL exact solvers (K+P v K, and K+P v K+P with locked pawns); the tablebase is the authority
for what ships. Run it repeatedly: pass 1 queues the positions it needs (cache/queue.jsonl), the daemon tools/endgames/fetcher.py fetches
them politely, later passes assemble items from the cache. See docs/exercises-endgames.md.

    ./tools/.venv/Scripts/python.exe -I tools/endgames/gen_pawn.py [keysq] [kpk] ...
"""
from __future__ import annotations

import random
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import chess

import egcommon as E
import pawnlib as pl
import tb
from egcommon import Gen, Quota, only_move_item, predict_item, play_out_item

SEED = 20261201
SCRIPT = "gen_pawn.py"


def crng(tag, i):
    return random.Random(f"{SEED}-{tag}-{i}")


def moves_budget(fen, floor=14, slack=1.6, extra=6, cap=60):
    """Move budget for a 'win' play_out from the tablebase distance to mate (plies, mover's win), or None if unknown/too long."""
    d = tb.dtm(fen)
    if d is None or d <= 0:
        return None
    full = (d + 1) // 2
    m = int(full * slack) + extra
    if m > cap:
        return None
    return max(floor, m)


HINTS_REACH = [
    "Look two or three ranks in front of the pawn. Which squares there would let your king walk in front of the pawn whatever the enemy king does?",
    "Which king step takes you onto such a square, or closer to one than the enemy king can get? Count the steps for both kings.",
    "After a pawn push, can the enemy king get back in front of it? Test each king step against the enemy king's best reply; only one of them keeps the pawn safe on its way.",
]
HINTS_PAIR = [
    "Find the pawn and see which king stands in front of it. Who is to move?",
    "Ask whether the attacking king can reach a square two ranks ahead of the pawn before the defending king can stop it.",
    "Check the file of the pawn: on the edge file the defending king has an extra resource. Then compare with the other half of the pair, which differs by one feature.",
]
HINTS_ONLY = [
    "Whose move is it, and which king is closer to the pawn's path? Compare the two kings.",
    "Try each king move and each pawn push. For each, ask where the enemy king can go next and whether it can then stop the pawn.",
    "More than one move may look natural. Only the move that keeps the result survives the enemy king's best reply: test each candidate against it.",
]
HINTS_PLAY_WIN = [
    "Where should your king stand before the pawn moves? Is it ready to support a push?",
    "Where should your king stand compared with the pawn and the enemy king? Does the opposition matter when the kings face each other?",
    "When the pawn reaches the seventh rank check that promoting does not stalemate the enemy king; then finish with the new queen and king.",
]
HINTS_PLAY_HOLD = [
    "Where is your king best placed compared with the pawn and the queening square?",
    "If the attacking king takes the opposition, which squares let you come back in front of the pawn?",
    "Which squares in front of the pawn can your king reach? If the pawn is on an edge file, think about the corner and stalemate.",
]


# ----------------------------------------------------------------------------------------------------------------
# END.KEYSQ
# ----------------------------------------------------------------------------------------------------------------
def build_keysq(foreign):
    g = Gen("KEYSQ", "end-keysq.json", SCRIPT, SEED + 1, foreign)
    node = "END.KEYSQ"
    qs = []

    # T1: reach the key square (find_move, D1, cue 1)
    q = Quota("reach-key-square", 12)
    qs.append(q)
    cands = pl.find_reach_key(random.Random(SEED + 11), 40)
    for i, (wk, bk, p, uci) in enumerate(cands):
        if not q.open():
            break
        rng = crng("reach", i)
        (b,), kind = pl.orient([pl.kp_board(wk, bk, p, True)], rng)
        if not g.have(b):
            q.wait()
            continue
        fam = g.new_family()
        who = E.CTITLE[b.turn]
        prompt = (f"{who} to move. Idea: key squares, the squares from which the king wins whoever moves. "
                  f"Only one move wins; it brings the king to such a square. Find it.")
        r = only_move_item(g, b, fam, node, 1, 1, HINTS_REACH, ["idea.key-squares", "theme.pawnEndgame", "theme.kpk"],
                           prompt=prompt, review="needs-human", min_wrong=3, require_unique=True, ref=f"key-square reach {kind}")
        if r:
            q.ok()

    # T2: key square reached or one step short (predict pairs, D2, cue 2/3)
    q = Quota("key-vs-short", 3)
    qs.append(q)
    for i, (p, bk, s1, s0) in enumerate(pl.find_key_vs_short(random.Random(SEED + 12), 14)):
        if not q.open():
            break
        rng = crng("short", i)
        (b1, b0), kind = pl.orient([pl.kp_board(s1, bk, p, False), pl.kp_board(s0, bk, p, False)], rng)
        ok1, ok0 = g.have(b1), g.have(b0)
        if not (ok1 and ok0):
            q.wait()
            continue
        fam, cg = g.new_family(), g.new_cg()
        a = predict_item(g, b1, fam, node, 2, 2, HINTS_PAIR, ["idea.key-squares", "theme.pawnEndgame", "theme.kpk"], cg=cg, role="working",
                         ref=f"king on a key square, {kind}")
        c = predict_item(g, b0, fam, node, 2, 2, HINTS_PAIR, ["idea.key-squares", "theme.pawnEndgame", "theme.kpk"], cg=cg, role="failing",
                         ref=f"king one step short of the key squares, {kind}")
        if a and c:
            q.ok()
        else:
            g.stats["pair-half-rejected"] += 1

    # T3: rook pawn versus central pawn, same arrangement (predict pairs, D2)
    q = Quota("rook-vs-central", 3)
    qs.append(q)
    for i, (pa, wk, bk, s) in enumerate(pl.find_rook_vs_central(random.Random(SEED + 13), 8)):
        if not q.open():
            break
        rng = crng("rook", i)
        (b1, b2), kind = pl.orient([pl.kp_board(wk, bk, pa, True), pl.kp_board(wk + s, bk + s, pa + s, True)], rng)
        ok1, ok2 = g.have(b1), g.have(b2)
        if not (ok1 and ok2):
            q.wait()
            continue
        fam, cg = g.new_family(), g.new_cg()
        a = predict_item(g, b1, fam, node, 2, 3, HINTS_PAIR, ["idea.rook-pawn", "theme.pawnEndgame", "theme.kpk"], cg=cg, role="failing",
                         ref=f"rook pawn {kind}")
        c = predict_item(g, b2, fam, node, 2, 3, HINTS_PAIR, ["idea.rook-pawn", "theme.pawnEndgame", "theme.kpk"], cg=cg, role="working",
                         ref=f"same arrangement, central pawn {kind}")
        if a and c:
            q.ok()

    # T4: who is to move (predict pairs, D2)
    q = Quota("who-moves", 3)
    qs.append(q)
    for i, (p, wk, bk, wwins) in enumerate(pl.find_who_moves(random.Random(SEED + 14), 10)):
        if not q.open():
            break
        rng = crng("who", i)
        (b1, b2), kind = pl.orient([pl.kp_board(wk, bk, p, True), pl.kp_board(wk, bk, p, False)], rng)
        ok1, ok2 = g.have(b1), g.have(b2)
        if not (ok1 and ok2):
            q.wait()
            continue
        fam, cg = g.new_family(), g.new_cg()
        roles = ("working", "failing") if wwins else ("failing", "working")
        a = predict_item(g, b1, fam, node, 2, 3, HINTS_PAIR, ["idea.move-order", "theme.pawnEndgame", "theme.kpk"], cg=cg, role=roles[0],
                         ref=f"same placement, White to move {kind}")
        c = predict_item(g, b2, fam, node, 2, 3, HINTS_PAIR, ["idea.move-order", "theme.pawnEndgame", "theme.kpk"], cg=cg, role=roles[1],
                         ref=f"same placement, Black to move {kind}")
        if a and c:
            q.ok()
    return g, qs


# ----------------------------------------------------------------------------------------------------------------
# END.KPK extras
# ----------------------------------------------------------------------------------------------------------------
def kpk_sweeps(rng, n):
    """Families that vary ONE feature at a time around a base placement: side to move, pawn one rank on, pawn on the rook file.
    Keep bases whose members do not all have the same result. Returns [[(label, wk, bk, p, wtm)], ...]."""
    out = []
    tries = 0
    while len(out) < n and tries < 4000:
        tries += 1
        f = rng.randrange(1, 7)
        r = rng.randrange(2, 5)
        p = chess.square(f, r)
        wk = rng.randrange(64)
        bk = rng.randrange(64)
        if pl.D(wk, p) > 2 or pl.D(bk, p) > 3 or wk == p or bk == p or pl.D(wk, bk) <= 1:
            continue
        members = [("base", wk, bk, p, True), ("other side to move", wk, bk, p, False), ("pawn one rank on", wk, bk, p + 8, True)]
        pa = chess.square(0, r)
        # rook-pawn partner: shift the whole picture so that the pawn stands on the a-file
        dx = -f
        if 0 <= pl.F(wk) + dx <= 7 and 0 <= pl.F(bk) + dx <= 7:
            members.append(("rook pawn", wk + dx, bk + dx, p + dx, True))
        if len(members) < 4 or any(not pl.kp_valid(*m[1:]) for m in members):
            continue
        res = {pl.ks.result(*m[1:]) for m in members}
        if len(res) < 2:
            continue
        out.append(members)
    return out


def build_kpk(foreign):
    g = Gen("KPK", "end-kpk.json", SCRIPT, SEED + 2, foreign)
    node = "END.KPK"
    qs = []

    # D2 sweeps (cue 3): one feature changes between members of a family
    q = Quota("sweeps", 5)
    qs.append(q)
    rng0 = random.Random(SEED + 21)
    sweeps = kpk_sweeps(rng0, 14)
    for i, members in enumerate(sweeps):
        if not q.open():
            break
        rng = crng("sweep", i)
        boards = [pl.kp_board(wk, bk, p, wtm) for (_l, wk, bk, p, wtm) in members]
        boards, kind = pl.orient(boards, rng, allow_flip=True)
        have = [g.have(b) for b in boards]
        if not all(have):
            q.wait()
            continue
        fam = g.new_family()
        cg = g.new_cg()
        got = 0
        for (label, *_), b in zip(members, boards):
            r = predict_item(g, b, fam, node, 2, 3, HINTS_PAIR, ["idea.kpk-family", "theme.pawnEndgame", "theme.kpk"], cg=cg,
                             ref=f"sweep member: {label} {kind}")
            got += 1 if r else 0
        if got:
            q.ok()

    # D1/D2 only-winning-move and only-drawing-move (cue 2)
    q = Quota("only-win", 4)
    qs.append(q)
    rw, rb = pl.ks.solve()
    cand = []
    rng1 = random.Random(SEED + 22)
    for _ in range(300000):
        p = chess.square(rng1.randrange(1, 7), rng1.randrange(1, 5))
        wk, bk = rng1.randrange(64), rng1.randrange(64)
        if pl.D(wk, p) > 3 or pl.D(bk, p) > 3 or not pl.kp_valid(wk, bk, p, True):
            continue
        if pl.ks.result(wk, bk, p, True) != pl.ks.WIN:
            continue
        win, bad, mv = pl.white_winning_moves(wk, bk, p)
        if len(win) == 1 and len(bad) >= 3:
            cand.append((wk, bk, p))
        if len(cand) >= 40:
            break
    for i, (wk, bk, p) in enumerate(cand):
        if not q.open():
            break
        (b,), kind = pl.orient([pl.kp_board(wk, bk, p, True)], crng("onlywin", i))
        if not g.have(b):
            q.wait()
            continue
        fam = g.new_family()
        if only_move_item(g, b, fam, node, 2, 2, HINTS_ONLY, ["theme.pawnEndgame", "theme.kpk"], mode="win", min_wrong=3, require_unique=True,
                          ref=f"kpk only winning move {kind}"):
            q.ok()

    q = Quota("only-hold", 4)
    qs.append(q)
    cand = []
    for _ in range(300000):
        p = chess.square(rng1.randrange(1, 7), rng1.randrange(1, 5))
        wk, bk = rng1.randrange(64), rng1.randrange(64)
        if pl.D(wk, p) > 3 or pl.D(bk, p) > 3 or not pl.kp_valid(wk, bk, p, False):
            continue
        if pl.ks.result(wk, bk, p, False) != pl.ks.DRAW:
            continue
        mv = pl.ks.black_moves(wk, bk, p)
        hold = [m for m, r in mv if r == pl.ks.DRAW]
        lose = [m for m, r in mv if r == pl.ks.WIN]
        if len(hold) == 1 and len(lose) >= 3 and chess.Move.from_uci(hold[0]).to_square != p:
            cand.append((wk, bk, p))
        if len(cand) >= 40:
            break
    for i, (wk, bk, p) in enumerate(cand):
        if not q.open():
            break
        (b,), kind = pl.orient([pl.kp_board(wk, bk, p, False)], crng("onlyhold", i))
        if not g.have(b):
            q.wait()
            continue
        fam = g.new_family()
        if only_move_item(g, b, fam, node, 2, 2, HINTS_ONLY, ["theme.pawnEndgame", "theme.kpk"], mode="hold", min_wrong=3, require_unique=True,
                          ref=f"kpk only drawing move {kind}"):
            q.ok()

    # D1/D3 play_out: win as the attacker (cue 4), hold as the defender (cue 4)
    q = Quota("play-win", 3)
    qs.append(q)
    cand = []
    for _ in range(300000):
        p = chess.square(rng1.randrange(1, 7), rng1.randrange(2, 5))
        wk, bk = rng1.randrange(64), rng1.randrange(64)
        if pl.D(wk, p) > 2 or pl.D(bk, p) > 3 or pl.R(wk) < pl.R(p) or not pl.kp_valid(wk, bk, p, True):
            continue
        if pl.ks.result(wk, bk, p, True) == pl.ks.WIN:
            cand.append((wk, bk, p))
        if len(cand) >= 30:
            break
    for i, (wk, bk, p) in enumerate(cand):
        if not q.open():
            break
        (b,), kind = pl.orient([pl.kp_board(wk, bk, p, True)], crng("playwin", i))
        if not g.have(b):
            q.wait()
            continue
        mm = moves_budget(b.fen())
        if mm is None:
            g.stats["no-dtm-budget"] += 1
            continue
        fam = g.new_family()
        if play_out_item(g, b, fam, node, 1, "win", mm, HINTS_PLAY_WIN, ["theme.pawnEndgame", "theme.kpk"], ref=f"kpk convert {kind}"):
            q.ok()

    q = Quota("play-hold", 3)
    qs.append(q)
    cand = []
    for _ in range(300000):
        p = chess.square(rng1.randrange(1, 7), rng1.randrange(2, 5))
        wk, bk = rng1.randrange(64), rng1.randrange(64)
        if pl.D(wk, p) > 3 or pl.D(bk, p) > 2 or not pl.kp_valid(wk, bk, p, False):
            continue
        if pl.ks.result(wk, bk, p, False) == pl.ks.DRAW and pl.R(bk) > pl.R(p):
            cand.append((wk, bk, p))
        if len(cand) >= 30:
            break
    for i, (wk, bk, p) in enumerate(cand):
        if not q.open():
            break
        (b,), kind = pl.orient([pl.kp_board(wk, bk, p, False)], crng("playhold", i))
        if not g.have(b):
            q.wait()
            continue
        fam = g.new_family()
        if play_out_item(g, b, fam, node, 3, "hold", 30, HINTS_PLAY_HOLD, ["theme.pawnEndgame", "theme.kpk"], ref=f"kpk hold {kind}"):
            q.ok()
    return g, qs


BUILDERS = {"keysq": build_keysq, "kpk": build_kpk}
FILES = {"keysq": "end-keysq.json", "kpk": "end-kpk.json"}


def main(names):
    names = names or list(BUILDERS)
    foreign = E.foreign_fens(regen={FILES[n] for n in names})
    for name in names:
        g, qs = BUILDERS[name](foreign)
        n = g.flush_need("pawn-" + name)
        g.write()
        foreign |= {E.fen_key(pp["fen"]) for pp in g.positions}
        E.report(g, qs)
        print(f"   queued {n} new positions for the daemon")


if __name__ == "__main__":
    try:
        main(sys.argv[1:])
    finally:
        E.close_engine()
