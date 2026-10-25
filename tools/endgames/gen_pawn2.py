"""Pawn-ending exercises, part 2 (locked-pawn family): END.ZUGZWANG, END.OPPOSITION.DISTANT, END.TRIANGULATION, END.KING-ACTIVE.

Candidates come from the exact local solvers (lockedkp.py for K+P v K+P with the pawns locked head to head; kpk_solver.py for K+P v K);
the tablebase is the authority for what ships (every result and every 'only move' is a tablebase claim). Run repeatedly, see gen_pawn.py.

    ./tools/.venv/Scripts/python.exe -I tools/endgames/gen_pawn2.py [zugzwang] [distant] [triang] [kact]
"""
from __future__ import annotations

import random
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import chess

import egcommon as E
import lockedkp as L
import pawnlib as pl
import pawnlib2 as pl2
import tb
from egcommon import Gen, Quota, only_move_item, predict_item, play_out_item
from gen_pawn import crng, moves_budget, HINTS_ONLY, HINTS_PLAY_WIN, HINTS_PLAY_HOLD

SEED = 20261301
SCRIPT = "gen_pawn2.py"

HINTS_ZZ_PREDICT = [
    "Look at the pawns: which are locked head to head? What does each king attack, and what does it defend?",
    "Count the safe king moves each side has without giving up a pawn or letting the enemy king in.",
    "Ask what would happen if the side to move could pass. The answer tells you whether this is zugzwang and for whom.",
]
HINTS_ZZ_PUT = [
    "You cannot win at once; you need the enemy king to run out of safe moves.",
    "Find a square for your king from which it attacks a pawn that Black cannot defend once it is Black's move.",
    "Look for the king move after which every Black king step gives up a pawn or lets your king in.",
]
HINTS_ZZ_HOLD = [
    "Which king moves keep your pawn defended or keep the enemy king out?",
    "Test each king step: after the best reply, can the enemy king or the enemy pawn make progress?",
    "Only one move keeps the draw. Check the steps that lose the opposition or let the enemy king in.",
]
HINTS_DIST = [
    "Look at where the two kings stand. Are they on the same file or rank, with squares between them?",
    "Count the squares between the kings. The side that does NOT have to move holds the opposition when an odd number of squares separates them.",
    "Which king move leaves an odd number of squares between the kings with the opponent to move?",
]
HINTS_TRI = [
    "Check whether a direct approach with the king helps; compare it with a move that does not come closer.",
    "A king can lose a move by walking a small triangle and coming back to where it started with the other side to move.",
    "Find the first step of a three-move king detour that ends on the starting square.",
]
HINTS_KACT = [
    "The pawn is not in danger. Ask where your king is needed first.",
    "Count king moves: where must the king stand for the pawn to advance safely?",
    "Compare a pawn push with a king step: after the push, what can the enemy king do?",
]
HINTS_TRI_PAIR = [
    "Compare the two kings' squares and who is to move.",
    "Ask whether the stronger side can lose a move with the king and whether the defender can do the same.",
    "Check whether the defender has a spare move of their own: a spare move can cancel the detour.",
]


def _lboard(wp, wk, bk, wtm):
    return L.board_locked(wp, wk, bk, wtm)


# ----------------------------------------------------------------------------------------------------------------
# END.ZUGZWANG
# ----------------------------------------------------------------------------------------------------------------
def build_zugzwang(foreign):
    g = Gen("ZZ", "end-zugzwang.json", SCRIPT, SEED + 1, foreign)
    node = "END.ZUGZWANG"
    qs = []
    idea = ["idea.zugzwang", "theme.pawnEndgame", "theme.locked-pawns"]

    # A: mutual zugzwang, both halves (predict, D2, cue 2) ----------------------------------------------------------------
    q = Quota("mutual-zugzwang pairs", 6)
    qs.append(q)
    for i, (wp, wk, bk) in enumerate(pl2.find_mutual_pairs(random.Random(SEED + 11), 14)):
        if not q.open():
            break
        (b1, b2), kind = pl.orient([_lboard(wp, wk, bk, True), _lboard(wp, wk, bk, False)], crng("mz", i))
        ok1, ok2 = g.have(b1), g.have(b2)
        if not (ok1 and ok2):
            q.wait()
            continue
        fam, cg = g.new_family(), g.new_cg()
        a = predict_item(g, b1, fam, node, 2, 2, HINTS_ZZ_PREDICT, idea + ["idea.mutual-zugzwang"], cg=cg, role="working", ref=f"mutual zugzwang, side 1 {kind}")
        c = predict_item(g, b2, fam, node, 2, 2, HINTS_ZZ_PREDICT, idea + ["idea.mutual-zugzwang"], cg=cg, role="working", ref=f"mutual zugzwang, side 2 {kind}")
        if a and c:
            q.ok()

    # B: same placement, the side to move decides (predict, D2, cue 3) -------------------------------------------------------
    q = Quota("who-moves pairs", 5)
    qs.append(q)
    for i, (wp, wk, bk, ra, rb) in enumerate(pl2.find_locked_who_moves(random.Random(SEED + 12), 14)):
        if not q.open():
            break
        (b1, b2), kind = pl.orient([_lboard(wp, wk, bk, True), _lboard(wp, wk, bk, False)], crng("zwho", i))
        ok1, ok2 = g.have(b1), g.have(b2)
        if not (ok1 and ok2):
            q.wait()
            continue
        fam, cg = g.new_family(), g.new_cg()
        a = predict_item(g, b1, fam, node, 2, 3, HINTS_ZZ_PREDICT, idea, cg=cg, ref=f"same placement, first side to move {kind}")
        c = predict_item(g, b2, fam, node, 2, 3, HINTS_ZZ_PREDICT, idea, cg=cg, ref=f"same placement, other side to move {kind}")
        if a and c:
            q.ok()

    # C: put the opponent in zugzwang (find_move, D1, cue 1) -----------------------------------------------------------------
    q = Quota("put in zugzwang", 6)
    qs.append(q)
    for i, (wp, wk, bk, uci) in enumerate(pl2.find_locked_put_in_zugzwang(random.Random(SEED + 13), 16)):
        if not q.open():
            break
        (b,), kind = pl.orient([_lboard(wp, wk, bk, True)], crng("zput", i))
        if not g.have(b):
            q.wait()
            continue
        fam = g.new_family()
        prompt = (f"{E.CTITLE[b.turn]} to move and wins. Idea: zugzwang, a position in which the side to move is worse off whatever it plays. "
                  f"Only one move wins. Find it.")
        if only_move_item(g, b, fam, node, 1, 1, HINTS_ZZ_PUT, idea, prompt=prompt, review="needs-human", min_wrong=3, require_unique=True,
                          ref=f"put in zugzwang {kind}"):
            q.ok()

    # D: the only move that holds (find_move, D2, cue 2) ---------------------------------------------------------------------
    q = Quota("only drawing move", 4)
    qs.append(q)
    cands = pl2.find_locked_only_hold(random.Random(SEED + 14), 8, stm_white=False) + pl2.find_locked_only_hold(random.Random(SEED + 15), 8, stm_white=True)
    random.Random(SEED + 16).shuffle(cands)
    for i, (wp, wk, bk, uci) in enumerate(cands):
        if not q.open():
            break
        stm_white = chess.Move.from_uci(uci).from_square == wk
        (b,), kind = pl.orient([_lboard(wp, wk, bk, stm_white)], crng("zhold", i))
        if not g.have(b):
            q.wait()
            continue
        fam = g.new_family()
        if only_move_item(g, b, fam, node, 2, 2, HINTS_ZZ_HOLD, idea, mode="hold", min_wrong=3, require_unique=True, ref=f"zugzwang only drawing move {kind}"):
            q.ok()
    return g, qs


# ----------------------------------------------------------------------------------------------------------------
# END.OPPOSITION.DISTANT
# ----------------------------------------------------------------------------------------------------------------
def build_distant(foreign):
    g = Gen("DIST", "end-distant.json", SCRIPT, SEED + 2, foreign)
    node = "END.OPPOSITION.DISTANT"
    qs = []
    idea = ["idea.distant-opposition", "theme.pawnEndgame", "theme.opposition"]

    # A: take the distant opposition, attacker (find_move, D1, cue 1) -------------------------------------------------------
    q = Quota("take distant opposition (attacker)", 8)
    qs.append(q)
    wl, tot_w = pl2.find_distant(random.Random(SEED + 21), 16, True)
    for i, (wp, wk, bk, uci, kind0) in enumerate(wl):
        if not q.open():
            break
        (b,), kind = pl.orient([_lboard(wp, wk, bk, True)], crng("dw", i))
        if not g.have(b):
            q.wait()
            continue
        fam = g.new_family()
        prompt = (f"{E.CTITLE[b.turn]} to move and wins. Idea: distant opposition, the kings facing each other on a file or rank "
                  f"with an odd number of squares between them. Only one move wins. Find it.")
        if only_move_item(g, b, fam, node, 1, 1, HINTS_DIST, idea, prompt=prompt, review="needs-human", min_wrong=3, require_unique=True,
                          ref=f"take the distant opposition ({kind0}) {kind}"):
            q.ok()

    # B: take it as the defender (find_move hold, D1/D2, cue 1) -------------------------------------------------------------
    q = Quota("take distant opposition (defender)", 7)
    qs.append(q)
    bl, tot_b = pl2.find_distant(random.Random(SEED + 22), 14, False)
    for i, (wp, wk, bk, uci, kind0) in enumerate(bl):
        if not q.open():
            break
        (b,), kind = pl.orient([_lboard(wp, wk, bk, False)], crng("db", i))
        if not g.have(b):
            q.wait()
            continue
        fam = g.new_family()
        prompt = (f"{E.CTITLE[b.turn]} to move. With best play the position is a draw, but only one move holds it. "
                  f"Idea: distant opposition. Find the move.")
        if only_move_item(g, b, fam, node, 1, 1, HINTS_DIST, idea, mode="hold", prompt=prompt, review="needs-human", min_wrong=3, require_unique=True,
                          ref=f"defender takes the distant opposition ({kind0}) {kind}"):
            q.ok()

    # C: who has it? same placement, the other side to move (predict pairs, D2/D3, cue 3) ----------------------------------
    q = Quota("distant opposition pairs", 4)
    qs.append(q)
    pairs = []
    for wp in pl.locked_cells(ranks=(2, 3, 4)):
        res, _ = L.solve_locked(wp)
        for wk in range(64):
            for bk in range(64):
                if not pl2._natural(wp, wk, bk, 4) or chess.square_distance(wk, bk) <= 1:
                    continue
                f_same = chess.square_file(wk) == chess.square_file(bk) and abs(chess.square_rank(wk) - chess.square_rank(bk)) in (4, 6)
                r_same = chess.square_rank(wk) == chess.square_rank(bk) and abs(chess.square_file(wk) - chess.square_file(bk)) in (4, 6)
                if not (f_same or r_same):
                    continue
                a, b2 = res[L.idx(wk, bk, True)], res[L.idx(wk, bk, False)]
                if a in (L.LINVALID,) or b2 in (L.LINVALID,) or a == b2:
                    continue
                if pl2.locked_ok(wp, wk, bk, True) and pl2.locked_ok(wp, wk, bk, False):
                    pairs.append((wp, wk, bk, a, b2))
    random.Random(SEED + 23).shuffle(pairs)
    seen = set()
    sel = []
    for c in pairs:
        if c[0] in seen:
            continue
        seen.add(c[0])
        sel.append(c)
        if len(sel) >= 12:
            break
    for i, (wp, wk, bk, ra, rb) in enumerate(sel):
        if not q.open():
            break
        (b1, b2), kind = pl.orient([_lboard(wp, wk, bk, True), _lboard(wp, wk, bk, False)], crng("dpair", i))
        ok1, ok2 = g.have(b1), g.have(b2)
        if not (ok1 and ok2):
            q.wait()
            continue
        fam, cg = g.new_family(), g.new_cg()
        a = predict_item(g, b1, fam, node, 2, 3, HINTS_DIST, idea, cg=cg, ref=f"kings in distant opposition, first side to move {kind}")
        c = predict_item(g, b2, fam, node, 2, 3, HINTS_DIST, idea, cg=cg, ref=f"kings in distant opposition, other side to move {kind}")
        if a and c:
            q.ok()
    g.stats["distant-found-W"] = tot_w
    g.stats["distant-found-B"] = tot_b
    return g, qs


# ----------------------------------------------------------------------------------------------------------------
# END.TRIANGULATION  (king triangles that lose a move; certificate from the exact local solvers)
# ----------------------------------------------------------------------------------------------------------------
def build_triang(foreign):
    g = Gen("TRI", "end-triangulation.json", SCRIPT, SEED + 3, foreign)
    node = "END.TRIANGULATION"
    qs = []
    idea = ["idea.triangulation", "theme.pawnEndgame"]
    rng0 = random.Random(SEED + 31)
    lk, tot_l = list(pl2.all_triangulations(True)), len(pl2.all_triangulations(True))      # every certified position, not one per pawn cell
    kp, tot_k = pl2.find_kpk_triangulations(rng0, None)
    g.stats["certified-locked"], g.stats["certified-kpk"] = tot_l, tot_k
    cands = [("locked", c) for c in lk] + [("kpk", c) for c in kp]
    random.Random(SEED + 32).shuffle(cands)
    seen_mirror = set()

    q = Quota("king triangle (find the first step)", 20)
    qs.append(q)
    for i, (fam_kind, c) in enumerate(cands):
        if not q.open():
            break
        if fam_kind == "locked":
            wp, wk, bk, b_, c_, uci = c
            base = _lboard(wp, wk, bk, True)
        else:
            p, wk, bk, b_, c_, uci = c
            base = pl.kp_board(wk, bk, p, True)
        mk = min(E.fen_key(base.fen()), E.fen_key(E.mirror(base).fen()))
        if mk in seen_mirror:
            continue
        seen_mirror.add(mk)
        (b,), kind = pl.orient([base], crng("tri", i))
        if not g.have(b):
            q.wait()
            continue
        fam = g.new_family()
        prompt = (f"{E.CTITLE[b.turn]} to move and wins, but only one move keeps the win. Idea: lose a move with the king by walking a "
                  f"small triangle. Find the first step.")
        if only_move_item(g, b, fam, node, 1, 1, HINTS_TRI, idea, prompt=prompt, review="needs-human", min_wrong=3, max_accepted=3,
                          ref=f"king triangle, forced line a-b-c ({fam_kind}) {kind}"):
            q.ok()
            # contrast pair: the winning position, and the position after the most natural king step (closest to the enemy king), which only draws
            mvt = tb.moves(b.fen()) or {}
            wr = [u for u, rr in mvt.items() if rr == "draw" and b.piece_type_at(chess.Move.from_uci(u).from_square) == chess.KING]
            if wr:
                ek = b.king(not b.turn)
                wr.sort(key=lambda u: (chess.square_distance(chess.Move.from_uci(u).to_square, ek), u))
                child = b.copy(stack=False)
                child.push(chess.Move.from_uci(wr[0]))
                child.castling_rights = 0
                child.ep_square = None
                if g.have(child):
                    cg = g.new_cg()
                    predict_item(g, b, fam, node, 2, 3, HINTS_TRI_PAIR, idea, cg=cg, role="working", ref="triangulation: the winning position")
                    predict_item(g, child, fam, node, 2, 3, HINTS_TRI_PAIR, idea + ["idea.natural-move-draws"], cg=cg, role="failing",
                                 ref="after the natural king step the win is gone")

    # D2 pairs: the same family with one feature changed so that the defender has an answer (draw) -------------------------------
    q = Quota("triangulation works / defender answers", 8)
    qs.append(q)
    pair_cands = []
    for wp, wk, bk, b_, c_, uci in pl2.all_triangulations(True):
        for t in range(64):
            if t in (wp, wp + 8):
                continue
            if chess.square_distance(t, bk) == 1 and chess.square_distance(t, wk) > 1 and pl2.locked_ok(wp, wk, t, True) and L.result_locked(wp, wk, t, True) == L.LD:
                pair_cands.append((wp, wk, bk, wk, t))
            if chess.square_distance(t, wk) == 1 and chess.square_distance(t, bk) > 1 and pl2.locked_ok(wp, t, bk, True) and L.result_locked(wp, t, bk, True) == L.LD:
                pair_cands.append((wp, wk, bk, t, bk))
    random.Random(SEED + 33).shuffle(pair_cands)
    used = set()
    for i, (wp, wk, bk, wk2, bk2) in enumerate(pair_cands):
        if not q.open():
            break
        if (wp, wk, bk) in used:
            continue
        used.add((wp, wk, bk))
        (b1, b2), kind = pl.orient([_lboard(wp, wk, bk, True), _lboard(wp, wk2, bk2, True)], crng("tripair", i))
        ok1, ok2 = g.have(b1), g.have(b2)
        if not (ok1 and ok2):
            q.wait()
            continue
        fam, cg = g.new_family(), g.new_cg()
        a = predict_item(g, b1, fam, node, 2, 3, HINTS_TRI_PAIR, idea, cg=cg, role="working", ref=f"triangulation wins {kind}")
        c = predict_item(g, b2, fam, node, 2, 3, HINTS_TRI_PAIR, idea, cg=cg, role="failing", ref=f"one king one step away, the defender holds {kind}")
        if a and c:
            q.ok()
    return g, qs


# ----------------------------------------------------------------------------------------------------------------
# END.KING-ACTIVE  (pawn endings; the piece endings are in gen_pieces.py)
# ----------------------------------------------------------------------------------------------------------------
def build_kact(foreign):
    g = Gen("KACT", "end-king-active.json", SCRIPT, SEED + 4, foreign)
    node = "END.KING-ACTIVE"
    qs = []
    idea = ["idea.active-king", "theme.pawnEndgame", "theme.kpk"]

    # D1: "the king first": the only winning move is a king step and the pawn push throws the win away
    q = Quota("king before pawn (win)", 12)
    qs.append(q)
    rng1 = random.Random(SEED + 41)
    cand = []
    seen = set()
    for _ in range(400000):
        p = chess.square(rng1.randrange(1, 7), rng1.randrange(1, 4))
        wk, bk = rng1.randrange(64), rng1.randrange(64)
        if pl.D(wk, p) > 3 or pl.D(bk, p) > 3 or not pl.kp_valid(wk, bk, p, True):
            continue
        if pl.ks.result(wk, bk, p, True) != pl.ks.WIN:
            continue
        win, bad, mv = pl.white_winning_moves(wk, bk, p)
        if len(win) != 1 or len(bad) < 3:
            continue
        m = chess.Move.from_uci(win[0])
        pawn_moves = [u for u, _r in mv if chess.Move.from_uci(u).from_square == p]
        if m.from_square != wk or not pawn_moves or any(u in win for u in pawn_moves):
            continue
        if (p, ) in seen:
            continue
        seen.add((p,))
        cand.append((wk, bk, p))
        if len(cand) >= 30:
            break
    for i, (wk, bk, p) in enumerate(cand):
        if not q.open():
            break
        (b,), kind = pl.orient([pl.kp_board(wk, bk, p, True)], crng("kactw", i))
        if not g.have(b):
            q.wait()
            continue
        fam = g.new_family()
        prompt = f"{E.CTITLE[b.turn]} to move and wins, but pushing the pawn is not the way. Idea: bring the king. Find the only winning move."
        if only_move_item(g, b, fam, node, 1, 1, HINTS_KACT, idea, prompt=prompt, review="needs-human", min_wrong=3, require_unique=True,
                          ref=f"king first {kind}"):
            q.ok()

    # defender: the king goes to meet the pawn
    q = Quota("defender king to the pawn", 7)
    qs.append(q)
    cand = []
    seen = set()
    for _ in range(400000):
        p = chess.square(rng1.randrange(1, 7), rng1.randrange(1, 5))
        wk, bk = rng1.randrange(64), rng1.randrange(64)
        if pl.D(wk, p) > 3 or pl.D(bk, p) > 4 or not pl.kp_valid(wk, bk, p, False):
            continue
        if pl.ks.result(wk, bk, p, False) != pl.ks.DRAW:
            continue
        mv = pl.ks.black_moves(wk, bk, p)
        hold = [m for m, r in mv if r == pl.ks.DRAW]
        lose = [m for m, r in mv if r == pl.ks.WIN]
        if len(hold) != 1 or len(lose) < 3:
            continue
        m = chess.Move.from_uci(hold[0])
        # the drawing move brings the king nearer to the pawn's path
        if pl.D(m.to_square, p) >= pl.D(bk, p) and pl.D(m.to_square, p + 8) >= pl.D(bk, p + 8):
            continue
        if (p,) in seen:
            continue
        seen.add((p,))
        cand.append((wk, bk, p))
        if len(cand) >= 20:
            break
    for i, (wk, bk, p) in enumerate(cand):
        if not q.open():
            break
        (b,), kind = pl.orient([pl.kp_board(wk, bk, p, False)], crng("kactd", i))
        if not g.have(b):
            q.wait()
            continue
        fam = g.new_family()
        prompt = (f"{E.CTITLE[b.turn]} to move. With best play the position is a draw, but only one move holds it. "
                  f"Idea: the king is a fighting piece. Find the move.")
        if only_move_item(g, b, fam, node, 1, 1, HINTS_KACT, idea, mode="hold", prompt=prompt, review="needs-human", min_wrong=3, require_unique=True,
                          ref=f"defender king to the pawn {kind}"):
            q.ok()
    return g, qs


BUILDERS = {"zugzwang": build_zugzwang, "distant": build_distant, "triang": build_triang, "kact": build_kact}
FILES = {"zugzwang": "end-zugzwang.json", "distant": "end-distant.json", "triang": "end-triangulation.json", "kact": "end-king-active.json"}


def main(names):
    names = names or list(BUILDERS)
    foreign = E.foreign_fens(regen={FILES[n] for n in names})
    for name in names:
        g, qs = BUILDERS[name](foreign)
        n = g.flush_need("pawn2-" + name)
        g.write()
        foreign |= {E.fen_key(pp["fen"]) for pp in g.positions}
        E.report(g, qs)
        print(f"   queued {n} new positions for the daemon")


if __name__ == "__main__":
    try:
        main(sys.argv[1:])
    finally:
        E.close_engine()
