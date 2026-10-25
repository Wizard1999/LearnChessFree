"""Pawn endings with more pawns, tablebase-backed: END.OUTSIDE-PASSER, END.REMOTE, END.BREAKTHROUGH, END.PAWN-FLANK, END.TEMPO,
END.PAWN-TEMPO.

Sources of candidates: the exact local solver for locked pawns (mutual zugzwang placements, used as the base of the spare-move families) and
template sampling screened with the local engine (screening only). The tablebase decides what ships: every result and every 'only move' is a
tablebase claim (<= 7 pieces). Run repeatedly (see gen_pawn.py).

    ./tools/.venv/Scripts/python.exe -I tools/endgames/gen_pawn3.py [outside] [remote] [breakthrough] [flank] [tempo] [ptempo]
"""
from __future__ import annotations

import random
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import chess

import egcommon as E
import engscreen as ES
import lockedkp as L
import pawnlib as pl
import pawnlib2 as pl2
import tb
from egcommon import Gen, Quota, only_move_item, predict_item, play_out_item, classify_item, claim
import structure as ST
from gen_pawn import moves_budget
from gen_rook import put
from gen_minor import sym

SEED = 20261801
SCRIPT = "gen_pawn3.py"
sqr = chess.square
KING, PAWN = chess.KING, chess.PAWN
SD = 12


def crng(tag, i):
    return random.Random(f"{SEED}-{tag}-{i}")


HINTS_OUT = [
    "Find the passed pawns. Which one is far from the other pawns and from the kings?",
    "Ask what happens if the enemy king has to run to stop the far pawn: where does that leave the pawns near the kings?",
    "Compare with the version where the passed pawn stands closer to the centre: can the defending king stop it and still reach the other pawns in time?",
]
HINTS_OUT_MOVE = [
    "Look at the passed pawn and at both kings. Which king is closer to the pawns on the other wing?",
    "Count the king moves to the pawns on the other wing and compare them with the enemy king's moves.",
    "Think about timing: if the passed pawn advances too early the enemy king may stay near the other pawns. Test pushing it against moving the king first.",
]
HINTS_REMOTE = [
    "The passed pawn stands alone on its wing. Is it in danger right now? What is the king's job before the pawn moves?",
    "Count the king moves to the pawns on the other wing and compare them with the enemy king's moves.",
    "Think about timing: if the passed pawn advances too early the enemy king may stay near the other pawns. Test pushing it against moving the king first.",
]
HINTS_BREAK = [
    "Look at the pawn skeleton: who is closer to queening, and who is to move? The kings are far away.",
    "Ask whether a pawn can be given up to open a path for another pawn that the enemy pawns cannot stop.",
    "Try the pushes that offer a pawn: after the capture, count whether the remaining pawn is a passed pawn that queens first.",
]
HINTS_FLANK = [
    "Count the pawns on each wing. On which wing does one side have more?",
    "Compare three first moves: pushing the free pawn, stepping in front of the enemy pawn with the king, and marching the king to the centre.",
    "Count moves exactly: how many does each side need to queen a pawn, and who is to move?",
]
HINTS_TEMPO = [
    "The kings are placed so that whoever must move a king loses ground. Does either side have a spare move with a pawn?",
    "Count the squares between the two flank pawns. Each pawn step uses one.",
    "Work out who runs out of pawn moves first, given who is to move; then that side must move a king.",
]
HINTS_PTEMPO = [
    "A pawn on its starting rank can move one or two squares. Which choice changes who runs out of spare moves?",
    "Count the squares between the flank pawns and decide whether you want an odd or an even number to remain.",
    "Compare the single step with the double step: which one changes who runs out of spare moves first?",
]


# ----------------------------------------------------------------------------------------------------------------
# END.OUTSIDE-PASSER and END.REMOTE
# ----------------------------------------------------------------------------------------------------------------
def outside_board(pf_file, pf_rank, wk, bk, wpawn, bpawn, stm=True):
    """White passer on (pf_file, pf_rank); locked kingside pair wpawn/bpawn (squares); kings as given."""
    return put([(wk, KING, True), (sqr(pf_file, pf_rank), PAWN, True), (wpawn, PAWN, True), (bk, KING, False), (bpawn, PAWN, False)], stm)


def outside_candidates(rng, n, tries=800):
    """Pairs (passer on the a/b-file -> engine win, passer on the c/d-file -> engine draw), everything else equal."""
    out, t = [], 0
    while len(out) < n and t < tries:
        t += 1
        fw = rng.choice([4, 5, 6])
        rw = rng.choice([2, 3])
        wpawn = sqr(fw, rw)
        bpawn = sqr(fw, rw + 1)          # locked pair on the kingside
        wk = sqr(rng.randrange(2, 7), rng.randrange(2, 6))
        bk = sqr(rng.randrange(2, 7), rng.randrange(2, 7))
        far_f, near_f = rng.choice([0, 1]), rng.choice([2, 3])
        pr = rng.choice([2, 3])
        a = outside_board(far_f, pr, wk, bk, wpawn, bpawn)
        b = outside_board(near_f, pr, wk, bk, wpawn, bpawn)
        if a is None or b is None:
            continue
        sa, sb = ES.score(a.fen(), SD), ES.score(b.fen(), SD)
        if sa >= 300 and abs(sb) <= 60:
            out.append((a, b))
    return out


def build_outside(foreign):
    g = Gen("OUT", "end-outside-passer.json", SCRIPT, SEED + 1, foreign)
    node = "END.OUTSIDE-PASSER"
    qs = []
    idea = ["idea.outside-passed-pawn", "theme.pawnEndgame"]
    q = Quota("far passer vs near passer", 10)
    qs.append(q)
    for i, (a, b) in enumerate(outside_candidates(random.Random(SEED + 11), 40, tries=4000)):
        if not q.open():
            break
        x, y = sym([a, b], crng("out", i))
        if not all([g.have(x), g.have(y)]):
            q.wait()
            continue
        fam, cg = g.new_family(), g.new_cg()
        r1 = predict_item(g, x, fam, node, 2, 3, HINTS_OUT, idea, cg=cg, role="working", ref="far passed pawn")
        r2 = predict_item(g, y, fam, node, 3, 3, HINTS_OUT, idea + ["idea.passer-too-close"], cg=cg, role="failing", ref="same position, passer nearer the centre")
        if r1 and r2:
            q.ok()
            mm = moves_budget(x.fen(), floor=30, cap=60)
            if tb.result(x.fen()) == "win" and mm:
                play_out_item(g, x, fam, node, 3, "win", mm, HINTS_OUT, idea, ref="outside passer: convert")
            only_move_item(g, x, fam, node, 2, 2, HINTS_OUT_MOVE, idea, mode="win", min_wrong=3, max_accepted=3, ref="outside passer: only winning move")
    return g, qs


def remote_king_candidates(rng, n, tries=3000):
    """Skeleton of the outside-passer family where the engine prefers a KING move and the push of the far pawn is clearly worse."""
    out, t = [], 0
    while len(out) < n and t < tries:
        t += 1
        fw, rw = rng.choice([4, 5, 6]), rng.choice([2, 3])
        wpawn, bpawn = sqr(fw, rw), sqr(fw, rw + 1)
        wk = sqr(rng.randrange(2, 7), rng.randrange(2, 6))
        bk = sqr(rng.randrange(2, 7), rng.randrange(2, 7))
        pf, pr = rng.choice([0, 1]), rng.choice([1, 2, 3])
        b = outside_board(pf, pr, wk, bk, wpawn, bpawn)
        if b is None or b.is_check():
            continue
        mv = ES.multipv(b.fen(), SD, 10)
        if len(mv) < 4 or mv[0][1] < 300:
            continue
        m0 = chess.Move.from_uci(mv[0][0])
        if b.piece_type_at(m0.from_square) != KING:
            continue
        far = sqr(pf, pr)
        push_best = max((s for u, s in mv if chess.Move.from_uci(u).from_square == far), default=-9999)
        if push_best > 60:
            continue
        out.append(b)
    return out


def build_remote(foreign):
    """Remote passed pawn: is the right first move to push the far passer (it decoys the enemy king) or to bring the king first (the push
    comes later)? Both kinds occur in the family; the tablebase decides, move by move."""
    g = Gen("REM", "end-remote.json", SCRIPT, SEED + 2, foreign)
    node = "END.REMOTE"
    qs = []
    idea = ["idea.remote-passed-pawn", "idea.decoy", "theme.pawnEndgame"]
    qk = Quota("remote passer: king first", 10)
    qp = Quota("remote passer: push now", 6)
    qs += [qk, qp]
    got = {"push": 0, "king": 0}
    sources = [(b, "king") for b in remote_king_candidates(random.Random(SEED + 22), 60)] + \
              [(a, "push") for a, _b in outside_candidates(random.Random(SEED + 21), 40, tries=3000)]
    for i, (a, want) in enumerate(sources):
        if not (qk.open() or qp.open()):
            break
        (x,) = sym([a], crng("rem", i))
        if not g.have(x):
            (qk if want == "king" else qp).wait()
            continue
        mv = tb.moves(x.fen())
        res = tb.result(x.fen())
        if mv is None or res != "win":
            continue
        ps = [s for s, p in x.piece_map().items() if p.piece_type == PAWN and p.color == x.turn]
        far = min(ps, key=lambda s: min(chess.square_file(s), 7 - chess.square_file(s)))
        acc = [u for u, r in mv.items() if r == "win"]
        kinds = {("push" if chess.Move.from_uci(u).from_square == far else "king" if x.piece_type_at(chess.Move.from_uci(u).from_square) == KING else "other") for u in acc}
        if len(kinds) != 1 or kinds == {"other"}:
            g.stats["mixed-or-other"] += 1
            continue
        kind = kinds.pop()
        q = qk if kind == "king" else qp
        if not q.open():
            g.stats["quota-full"] += 1
            continue
        fam = g.new_family()
        cp = g.checkpoint()
        r1 = only_move_item(g, x, fam, node, 1, 2, HINTS_REMOTE, idea + [f"idea.first-move-{kind}"], mode="win", min_wrong=3, max_accepted=3,
                            ref="remote passer: the only winning move")
        if not r1:
            g.rollback(cp)
            continue
        item = g.items[-1]
        # structure claims so that the words 'passed pawn alone on its wing' are machine-checked (exact sets, tools/structure.py)
        fsq = chess.square_name(far)
        wing = "queenside" if chess.square_file(far) <= 3 else "kingside"
        mover, foe = E.CNAME[x.turn], E.CNAME[not x.turn]
        if ST.pawn_set(x, "passed", x.turn) != [fsq] or ST.wing_pawn_count(x, x.turn, wing) != 1 or ST.wing_pawn_count(x, not x.turn, wing) != 0:
            g.stats["not-a-lone-passer"] += 1
            g.rollback(cp)
            continue
        item["claims"] += [
            claim(f"C{len(item['claims']) + 1}", "pawn_set", f"The pawn on {fsq} is the only passed pawn of {mover}.", kind="passed", color=mover, squares=[fsq]),
            claim(f"C{len(item['claims']) + 2}", "wing_pawns", f"It is the only {mover} pawn on the {wing}.", color=mover, wing=wing, count=1),
            claim(f"C{len(item['claims']) + 3}", "wing_pawns", f"{foe.capitalize()} has no pawn on the {wing}.", color=foe, wing=wing, count=0)]
        what = ("pushing the passed pawn now" if kind == "push" else "moving the king first")
        sans = " and ".join(x.san(chess.Move.from_uci(u)) for u in acc)
        expl = (f"The tablebase shows that {what} is the way to keep the win here: the winning move is {sans}, and every other legal move gives the win away."
                if len(acc) == 1 else
                f"The tablebase shows that {what} is the way to keep the win here: the winning moves are {sans}, and every other legal move gives the win away.")
        classify_item(g, x, fam, node, 2, 3,
                      f"{E.CTITLE[x.turn]} to move and wins. Which kind of first move keeps the win: pushing the passed pawn that stands alone on its wing, or moving the king first?",
                      ["push the passed pawn now", "move the king first"],
                      "push the passed pawn now" if kind == "push" else "move the king first",
                      [dict(c) for c in item["claims"]], HINTS_REMOTE, expl, idea + [f"idea.first-move-{kind}"], review="machine-only",
                      ref="remote passer: push or king first")
        got[kind] += 1
        q.ok()
    g.stats.update({f"first-move-{k}": v for k, v in got.items()})
    return g, qs


# ----------------------------------------------------------------------------------------------------------------
# END.BREAKTHROUGH (3 pawns against 2, kings far away)
# ----------------------------------------------------------------------------------------------------------------
def break_board(f0, wr, gap, bfiles, stm=True, wk=None, bk=None):
    wp = [(sqr(f0 + d, wr), PAWN, True) for d in range(3)]
    bp = [(sqr(f0 + d, wr + gap), PAWN, False) for d in bfiles]
    wk = wk if wk is not None else (sqr(7, 0) if f0 < 4 else sqr(0, 0))
    bk = bk if bk is not None else (sqr(7, 7) if f0 < 4 else sqr(0, 7))
    return put([(wk, KING, True), (bk, KING, False)] + wp + bp, stm)


def break_candidates(rng, n):
    """Skeleton: three white pawns on adjacent files, two black pawns on two of those files, kings far away.
    Returns [(white_to_move_board, black_to_move_board)] where White to move wins by the engine and the same position with Black to move is
    not won (the extra tempo for the defender)."""
    out, tries = [], 0
    while len(out) < n and tries < 400:
        tries += 1
        f0 = rng.randrange(0, 6)
        wr = rng.choice([3, 4])
        gap = rng.choice([1, 2]) if wr == 3 else 2
        bfiles = rng.choice([(0, 1), (1, 2), (0, 2)])
        a = break_board(f0, wr, gap, bfiles, True)
        b = break_board(f0, wr, gap, bfiles, False)
        if a is None or b is None or wr + gap > 6:
            continue
        sa, sb = ES.score(a.fen(), SD), ES.score(b.fen(), SD)
        if sa >= 300 and sb < 300:
            out.append((a, b))
    return out


def build_breakthrough(foreign):
    g = Gen("BRK", "end-breakthrough.json", SCRIPT, SEED + 3, foreign)
    node = "END.BREAKTHROUGH"
    qs = []
    idea = ["idea.breakthrough", "theme.pawnEndgame", "theme.pawn-sacrifice"]
    q = Quota("breakthrough, then the extra tempo", 8)
    qs.append(q)
    cand = break_candidates(random.Random(SEED + 31), 30)
    for i, (a, b) in enumerate(cand):
        if not q.open():
            break
        x, y = sym([a, b], crng("brk", i))
        if not all([g.have(x), g.have(y)]):
            q.wait()
            continue
        fam, cg = g.new_family(), g.new_cg()
        r1 = predict_item(g, x, fam, node, 2, 3, HINTS_BREAK, idea, cg=cg, role="working", ref="breakthrough: side to move")
        r2 = predict_item(g, y, fam, node, 3, 3, HINTS_BREAK, idea + ["idea.extra-tempo"], cg=cg, role="failing", ref="same skeleton, the defender to move")
        if r1 and r2:
            q.ok()
            prompt = f"{E.CTITLE[x.turn]} to move and wins, but some moves throw the win away. Idea: a pawn sacrifice opens the way. Find the move."
            only_move_item(g, x, fam, node, 1, 1, HINTS_BREAK, idea, mode="win", prompt=prompt, review="needs-human", min_wrong=3, max_accepted=3,
                           ref="breakthrough: the sacrifice")
    return g, qs


# ----------------------------------------------------------------------------------------------------------------
# END.PAWN-FLANK
# ----------------------------------------------------------------------------------------------------------------
def flank_candidates(rng, n):
    """Pawns on both wings, kings central. White to move; the engine sees a clear best move with the others clearly worse."""
    out, tries = [], 0
    while len(out) < n and tries < 600:
        tries += 1
        wf = [(rng.choice([0, 1]), rng.choice([2, 3, 4])), (rng.choice([5, 6, 7]), rng.choice([2, 3]))]
        bf = [(rng.choice([0, 1, 2]), rng.choice([4, 5, 6])), (rng.choice([5, 6, 7]), rng.choice([3, 4, 5]))]
        wk = sqr(rng.randrange(2, 6), rng.randrange(2, 5))
        bk = sqr(rng.randrange(2, 6), rng.randrange(3, 7))
        pcs = [(wk, KING, True), (bk, KING, False)] + [(sqr(f, r), PAWN, True) for f, r in wf] + [(sqr(f, r), PAWN, False) for f, r in bf]
        b = put(pcs, True)
        if b is None or b.is_check():
            continue
        mv = ES.multipv(b.fen(), SD, 8)
        if len(mv) < 4 or mv[0][1] < 300 or mv[1][1] > 120:
            continue
        out.append(b)
    return out


def build_flank(foreign):
    g = Gen("FLK", "end-pawn-flank.json", SCRIPT, SEED + 4, foreign)
    node = "END.PAWN-FLANK"
    qs = []
    idea = ["idea.stronger-flank", "theme.pawnEndgame"]
    q = Quota("two wings: first move", 12)
    qs.append(q)
    for i, b in enumerate(flank_candidates(random.Random(SEED + 41), 40)):
        if not q.open():
            break
        (x,) = sym([b], crng("flk", i))
        if not g.have(x):
            q.wait()
            continue
        fam = g.new_family()
        r = only_move_item(g, x, fam, node, 1, 2, HINTS_FLANK, idea, mode="win", min_wrong=3, max_accepted=2, ref="two wings: the first move")
        if r:
            q.ok()
            predict_item(g, x, fam, node, 2, 3, HINTS_FLANK, idea, ref="two wings: result")
    return g, qs


# ----------------------------------------------------------------------------------------------------------------
# END.TEMPO / END.PAWN-TEMPO: mutual-zugzwang kings plus two flank pawns facing each other
# ----------------------------------------------------------------------------------------------------------------
def tempo_board(wp, wk, bk, flank_file, wr, br, stm):
    """Locked centre pair (wp, wp+8) with the kings on a mutual-zugzwang placement, plus a white and a black pawn facing each other on
    the flank file (white on rank index wr, black on rank index br > wr)."""
    return put([(wk, KING, True), (bk, KING, False), (wp, PAWN, True), (wp + 8, PAWN, False), (sqr(flank_file, wr), PAWN, True), (sqr(flank_file, br), PAWN, False)], stm)


def build_tempo(foreign):
    g = Gen("TMP", "end-tempo.json", SCRIPT, SEED + 5, foreign)
    node = "END.TEMPO"
    qs = []
    idea = ["idea.spare-moves", "idea.mutual-zugzwang", "theme.pawnEndgame"]
    q = Quota("spare-move families", 4)
    qs.append(q)
    mz = pl2.find_mutual_pairs(random.Random(SEED + 51), 12)
    for i, (wp, wk, bk) in enumerate(mz):
        if not q.open():
            break
        rng = crng("tmp", i)
        ff = rng.choice([0, 7])
        # the flank pawns must be far from both kings
        if min(chess.square_distance(chess.square(ff, 3), k) for k in (wk, bk)) < 3:
            ff = 7 - ff
            if min(chess.square_distance(chess.square(ff, 3), k) for k in (wk, bk)) < 3:
                continue
        members = []
        for (wr, br) in ((2, 3), (2, 4), (2, 5)):          # k = 0, 1, 2 free squares between the pawns (no double steps possible)
            for stm in (True, False):
                members.append(((wr, br), stm, tempo_board(wp, wk, bk, ff, wr, br, stm)))
        members = [m for m in members if m[2] is not None]
        boards = sym([m[2] for m in members], rng)
        if not all([g.have(b) for b in boards]):
            q.wait()
            continue
        fam, cg = g.new_family(), g.new_cg()
        got = 0
        for ((wr, br), stm, _b0), b in zip(members, boards):
            k = br - wr - 1
            r = predict_item(g, b, fam, node, 3, 3, HINTS_TEMPO, idea + [f"idea.free-squares-{k}"], cg=cg, ref=f"spare moves: {k} free squares between the flank pawns")
            got += 1 if r else 0
            if r and k == 1 and tb.result(b.fen()) == "win":
                only_move_item(g, b, fam, node, 1, 2, HINTS_TEMPO, idea, mode="win", min_wrong=3, max_accepted=2, ref="spare moves: keep the spare move")
        if got:
            q.ok()
    return g, qs


def build_ptempo(foreign):
    g = Gen("PTM", "end-pawn-tempo.json", SCRIPT, SEED + 6, foreign)
    node = "END.PAWN-TEMPO"
    qs = []
    idea = ["idea.pawn-step-timing", "idea.mutual-zugzwang", "theme.pawnEndgame"]
    q = Quota("starting-rank flank pawns", 3)
    qs.append(q)
    mz = pl2.find_mutual_pairs(random.Random(SEED + 61), 12)
    for i, (wp, wk, bk) in enumerate(mz):
        if not q.open():
            break
        rng = crng("ptm", i)
        ff = rng.choice([0, 7])
        if min(chess.square_distance(chess.square(ff, 3), k) for k in (wk, bk)) < 3:
            ff = 7 - ff
            if min(chess.square_distance(chess.square(ff, 3), k) for k in (wk, bk)) < 3:
                continue
        members = [(stm, tempo_board(wp, wk, bk, ff, 1, 6, stm)) for stm in (True, False)]       # a2 against a7: single or double steps
        members.append((True, tempo_board(wp, wk, bk, ff, 1, 5, True)))                         # black pawn already on a6
        members = [m for m in members if m[1] is not None]
        boards = sym([m[1] for m in members], rng)
        if not all([g.have(b) for b in boards]):
            q.wait()
            continue
        fam, cg = g.new_family(), g.new_cg()
        got = 0
        for (stm, _b0), b in zip(members, boards):
            r = predict_item(g, b, fam, node, 1, 3, HINTS_PTEMPO, idea, cg=cg, ref="pawn-step timing: flank pawns on their starting ranks")
            got += 1 if r else 0
            if r and tb.result(b.fen()) == "win":
                only_move_item(g, b, fam, node, 1, 2, HINTS_PTEMPO, idea, mode="win", min_wrong=3, max_accepted=3, review="needs-human", ref="pawn-step timing: single or double step")
        if got:
            q.ok()
    return g, qs


BUILDERS = {"outside": build_outside, "remote": build_remote, "breakthrough": build_breakthrough, "flank": build_flank, "tempo": build_tempo,
            "ptempo": build_ptempo}
FILES = {"outside": "end-outside-passer.json", "remote": "end-remote.json", "breakthrough": "end-breakthrough.json", "flank": "end-pawn-flank.json",
         "tempo": "end-tempo.json", "ptempo": "end-pawn-tempo.json"}


def main(names):
    names = names or list(BUILDERS)
    foreign = E.foreign_fens(regen={FILES[n] for n in names})
    try:
        for name in names:
            g, qs = BUILDERS[name](foreign)
            n = g.flush_need("pawn3-" + name)
            g.write()
            foreign |= {E.fen_key(pp["fen"]) for pp in g.positions}
            E.report(g, qs)
            print(f"   queued {n} new positions for the daemon")
    finally:
        ES.close()
        E.close_engine()


if __name__ == "__main__":
    main(sys.argv[1:])
