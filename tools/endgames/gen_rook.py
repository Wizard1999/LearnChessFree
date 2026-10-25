"""Rook-ending exercises, tablebase-backed: END.LUCENA, END.PHILIDOR, END.ROOK-ACTIVE.

Candidates are sampled from templates (standard setups of each idea), screened with the local engine (engscreen.py; screening only), and
the tablebase decides what ships: every result and every 'only move' is a tablebase claim. Run repeatedly (see gen_pawn.py): pass 1 queues
the positions, the daemon tools/endgames/fetcher.py fetches them, later passes assemble the items.

    ./tools/.venv/Scripts/python.exe -I tools/endgames/gen_rook.py [lucena] [philidor] [active]
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
from egcommon import Gen, Quota, only_move_item, predict_item, play_out_item, claim
from gen_pawn import moves_budget

SEED = 20261401
SCRIPT = "gen_rook.py"
sqr = chess.square
KING, PAWN, ROOK = chess.KING, chess.PAWN, chess.ROOK


def crng(tag, i):
    return random.Random(f"{SEED}-{tag}-{i}")


def put(pieces, turn=True):
    b = chess.Board(None)
    b.castling_rights = 0
    for s, p, c in pieces:
        if s is None or not (0 <= s < 64) or b.piece_at(s):
            return None
        b.set_piece_at(s, chess.Piece(p, c))
    b.turn = turn
    if not b.is_valid() or chess.square_distance(b.king(True), b.king(False)) <= 1:
        return None
    return b


def sym(boards, rng):
    """One random mirror/colour-flip applied to every board of a family (same transform for all members)."""
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


def maybe_flip(b, rng):
    """Random colour flip / mirror so that the bank is not all 'White to move, pawn up the board'."""
    x = b
    if rng.random() < 0.5:
        x = E.mirror(x)
    if rng.random() < 0.5:
        x = E.flip(x)
    x.castling_rights = 0
    x.ep_square = None
    return x


HINTS_LUC_PREDICT = [
    "Find the pawn on the seventh rank and the two kings. Which king is in front of the pawn? Where is the enemy king, and what cuts it off?",
    "Ask whether the enemy king can reach the pawn or the checking squares in front of it, and whether the enemy rook has checks from a distance.",
    "Compare with the standard picture: the defending king cut off from the pawn by at least one full file, the attacking king in front of the pawn, a rook that can build a shelter.",
]
HINTS_LUC_MOVE = [
    "The pawn cannot move forward yet: your king stands in front of it. What is your king's problem?",
    "The enemy rook can check your king from the side. Which rank would stop those checks if your rook stood on it?",
    "Put the rook on the rank from which it can later block a check. Test the candidates against the enemy rook's checks.",
]
HINTS_LUC_PLAY = [
    "First put the rook where it shelters your king from sideways checks, then walk the king out of the pawn's way.",
    "When the king steps out, the pawn can advance and the rook can block checks: keep the rook on the same rank as the checking line.",
    "Count the moves: if the enemy king cannot come back, the pawn will queen. Avoid giving checks that only drive your king back.",
]
HINTS_PHI_PREDICT = [
    "Find the pawn and the defending king. Where is the defending rook, and what does it stop?",
    "Ask which rank the defending rook guards and whether the attacking king can get past it to the pawn's far side.",
    "Compare with the passive set-up: the defending king in front of the pawn, the defending rook on the rank the attacking king needs for shelter.",
]
HINTS_PHI_MOVE = [
    "Whose move is it? Which of your pieces is badly placed?",
    "The enemy king wants to step forward and shelter from rook checks. Which rank must your rook guard to stop that?",
    "Test the rook moves against the enemy king's best step; only one rank keeps the enemy king from sheltering.",
]
HINTS_PHI_BACK = [
    "The pawn has reached the sixth rank, so the passive rook no longer helps. Where do the rook's checks now bite?",
    "Think about checks from behind: the enemy king has no shelter on that side.",
    "Move the rook off the rank and keep it far from the enemy king, on the long side of the board.",
]
HINTS_ACT_PREDICT = [
    "Find the passed pawn and both rooks. Is either rook behind the pawn?",
    "Ask which rook is tied to defending or pushing the pawn, and which rook can check or attack.",
    "Compare with the version of this position where the rook stands elsewhere: what does the rook gain or lose by its square?",
]
HINTS_ACT_MOVE = [
    "Look at the passed pawn. Which of your pieces is badly placed relative to it?",
    "A rook is strongest where it supports the pawn without blocking it, and where it cannot be attacked by the enemy king.",
    "Test the rook moves: put the rook behind the pawn, far away from the enemy king, and check that it still guards your pawn.",
]
HINTS_PHI_PLAY = [
    "Which rank must your rook guard, and where should your king stand compared with the pawn?",
    "If the pawn advances to the sixth rank, ask whether it is time to switch to checks from behind.",
    "Ask what the attacking king and rook need for the standard winning set-up, a shelter on the rank behind the pawn, and how your rook can stop it.",
]


# ----------------------------------------------------------------------------------------------------------------
# candidates
# ----------------------------------------------------------------------------------------------------------------
def lucena_board(f, dirn, bko, bkr, wrr, brf, brr, wr_file=None, pawn_file_shift=0):
    wk, wp = sqr(f, 7), sqr(f, 6)
    bkf = f + bko * dirn
    wrf = f + dirn if wr_file is None else wr_file
    brff = f - dirn * brf
    if not (0 <= bkf <= 7 and 0 <= wrf <= 7 and 0 <= brff <= 7):
        return None
    return put([(wk, KING, True), (wp, PAWN, True), (sqr(wrf, wrr), ROOK, True), (sqr(bkf, bkr), KING, False), (sqr(brff, brr), ROOK, False)])


def _rooks_ok(b):
    """Neither rook can simply take the other, the side to move is not in check."""
    wr = [s for s, p in b.piece_map().items() if p.piece_type == ROOK and p.color]
    br = [s for s, p in b.piece_map().items() if p.piece_type == ROOK and not p.color]
    if not wr or not br:
        return False
    return br[0] not in b.attacks(wr[0]) and wr[0] not in b.attacks(br[0]) and not b.is_check()


def lucena_candidates(rng, n):
    out, tries = [], 0
    while len(out) < n and tries < 2500:
        tries += 1
        f = rng.randrange(1, 7)
        dirn = rng.choice([-1, 1])
        if not (0 <= f + 2 * dirn <= 7):
            continue
        prm = dict(f=f, dirn=dirn, bko=rng.choice([2, 3]), bkr=rng.choice([6, 7]), wrr=rng.randrange(0, 4), brf=rng.choice([1, 2, 3]), brr=rng.randrange(0, 4))
        b = lucena_board(**prm)
        if not b or not _rooks_ok(b):
            continue
        mv = ES.multipv(b.fen(), 14, 12)
        if not mv or not (380 <= mv[0][1] <= 1500):
            continue
        if sum(1 for _u, sc in mv if sc >= 300) > 16:
            continue
        vs = [(lab, vb) for lab, vb in lucena_variants(prm) if _rooks_ok(vb) and abs(ES.score(vb.fen(), 14)) <= 70]
        if not vs:
            continue
        if any(f == o["f"] and prm["wrr"] == o["wrr"] and prm["bko"] == o["bko"] for o in [x[0] for x in out]):
            continue
        out.append((prm, b))
    return out


def lucena_variants(prm):
    """one-feature edits that may spoil the standard win: (label, board). The engine decides which of them are drawn."""
    v = []
    f, dirn = prm["f"], prm["dirn"]
    base = lucena_board(**prm)
    # rook on another file: the enemy king may no longer be cut off
    for wf in range(8):
        if wf in (f, f + dirn):
            continue
        b = lucena_board(**{**prm, "wr_file": wf})
        if b:
            v.append(("rook not cutting the king off", b))
    # the enemy king one step nearer the pawn
    bk = base.king(False) if base else None
    if bk is not None:
        for t in range(64):
            if chess.square_distance(t, bk) == 1 and abs(chess.square_file(t) - f) < abs(chess.square_file(bk) - f) and not base.piece_at(t):
                c = base.copy()
                c.remove_piece_at(bk)
                c.set_piece_at(t, chess.Piece(KING, False))
                if c.is_valid() and chess.square_distance(t, c.king(True)) > 1:
                    v.append(("enemy king one step nearer", c))
    # rook pawn: slide the whole picture to the edge file
    shift = (0 - f) if dirn == 1 else (7 - f)
    nf = f + shift
    bkf = nf + prm["bko"] * dirn
    brf = nf - dirn * prm["brf"]
    if 0 <= nf <= 7 and 0 <= bkf <= 7 and 0 <= brf <= 7 and nf in (0, 7):
        b = lucena_board(**{**prm, "f": nf})
        if b:
            v.append(("rook pawn", b))
    return v


def lucena_std_bases():
    """The standard Lucena picture on a central file (c-f): attacking king on the queening square, pawn on the seventh rank, the defending
    king cut off by the attacker's rook, the attacker's rook on the first rank, the defender's rook on the first or second rank. White to move.
    Every placement is a win in the tablebase (surveyed); which squares are drawn is decided by the tablebase, not here."""
    out = []
    for f in (2, 3, 4, 5):
        for dirn in (1, -1):
            for bko in (2, 3):
                for brf in (1, 2, 3):
                    for brr in (1, 0):
                        prm = dict(f=f, dirn=dirn, bko=bko, bkr=6, wrr=0, brf=brf, brr=brr)
                        b = lucena_board(**prm)
                        if b and _rooks_ok(b):
                            out.append((prm, b))
    return out


def lucena_rp_pairs():
    """Rook-pawn arrangements (a/h file) and the same arrangement translated 2 or 3 files towards the centre. The first 60 of the 96 shuffled
    arrangements are the ones whose tablebase answers were fetched (survey, see docs/exercises-endgames.md)."""
    allp = []
    for nf, dirn in ((0, 1), (7, -1)):
        for bko in (2, 3):
            for bkr in (6, 7):
                for brdx in (3, 4, 5):
                    for brr in (0, 1, 2):
                        for wrr in (0, 1):
                            allp.append((nf, dirn, bko, bkr, brdx, brr, wrr))
    def mk(f, dirn, bko, bkr, brdx, brr, wrr):
        bkf, brf = f + bko * dirn, f + brdx * dirn
        if not (0 <= bkf <= 7 and 0 <= brf <= 7 and 0 <= f + dirn <= 7):
            return None
        b = put([(sqr(f, 7), KING, True), (sqr(f, 6), PAWN, True), (sqr(f + dirn, wrr), ROOK, True), (sqr(bkf, bkr), KING, False),
                 (sqr(brf, brr), ROOK, False)])
        return b if b and _rooks_ok(b) else None
    valid = []
    for a in allp:
        rp = mk(a[0], *a[1:])
        if rp is not None:
            valid.append((a, rp))
    order = list(range(len(valid)))
    random.Random(3).shuffle(order)
    out = []
    for i in order[:60]:                     # the 60 rook-pawn arrangements whose answers were fetched
        (nf, dirn, bko, bkr, brdx, brr, wrr), rp = valid[i]
        for s in (2, 3):
            cen = mk(nf + s * dirn, dirn, bko, bkr, brdx, brr, wrr)
            if cen is not None:
                out.append((rp, cen, s))
                break
    return out


def build_lucena(foreign):
    g = Gen("LUC", "end-lucena.json", SCRIPT, SEED + 1, foreign)
    node = "END.LUCENA"
    qs = []
    idea = ["idea.lucena", "theme.rookEndgame", "theme.bridge"]
    # ---- A: the rook pawn is the failing look-alike (same arrangement, translated towards the centre) ----
    qp = Quota("lucena pair: central pawn wins, rook pawn only draws", 10)
    qs.append(qp)
    rng = random.Random(SEED + 12)
    pairs = lucena_rp_pairs()
    rng.shuffle(pairs)
    for i, (rp, cen, s) in enumerate(pairs):
        if not qp.open():
            break
        if not tb.have(rp.fen()):
            continue
        if tb.result(rp.fen()) != "draw":
            continue
        x, y = sym([cen, rp], crng("lucp", i))
        if not g.have(x):
            qp.wait()
            continue
        fam, cg = g.new_family(), g.new_cg()
        a = predict_item(g, x, fam, node, 2, 3, HINTS_LUC_PREDICT, idea, cg=cg, role="working", ref="lucena: pawn on a central file")
        c = predict_item(g, y, fam, node, 2, 3, HINTS_LUC_PREDICT, idea + ["idea.rook-pawn-exception"], cg=cg, role="failing",
                         ref="same arrangement translated to the edge file: rook pawn")
        if a and c:
            qp.ok()
    # ---- B: standard bases: predict, play out, and the find-the-move where the tablebase is selective ----
    qb = Quota("lucena standard bases", 8)
    qs.append(qb)
    bases = lucena_std_bases()
    random.Random(SEED + 13).shuffle(bases)
    for i, (prm, base) in enumerate(bases):
        if not qb.open():
            break
        (x,) = sym([base], crng("lucb", i))
        if not g.have(x):
            qb.wait()
            continue
        fam = g.new_family()
        a = predict_item(g, x, fam, node, 2, 3, HINTS_LUC_PREDICT, idea, ref="lucena standard base")
        if not a:
            continue
        qb.ok()
        only_move_item(g, x, fam, node, 1, 2, HINTS_LUC_MOVE, idea, mode="win", min_wrong=6, max_accepted=6, ref="lucena find the bridge move")
        mm = moves_budget(x.fen(), floor=20)
        if mm:
            play_out_item(g, x, fam, node, 3, "win", mm, HINTS_LUC_PLAY, idea, ref="lucena play out")
    return g, qs


def philidor_board(f, kdx, wkr, bkf_off, brf, brr, wrr, wrf, pr=4, stm=True, bkr=7):
    """Defender = Black. Pawn (f, pr); white king on the pawn's side; black king in front; black rook on the sixth rank (brr)."""
    wp = sqr(f, pr)
    wk = sqr(f + kdx, wkr)
    bk = sqr(f + bkf_off, bkr)
    return put([(wk, KING, True), (wp, PAWN, True), (sqr(wrf, wrr), ROOK, True), (bk, KING, False), (sqr(brf, brr), ROOK, False)], stm)


def philidor_candidates(rng, n):
    out, tries = [], 0
    while len(out) < n and tries < 2500:
        tries += 1
        f = rng.randrange(2, 6)
        prm = dict(f=f, kdx=rng.choice([-1, 0, 1]), wkr=rng.choice([3, 4]), bkf_off=rng.choice([-1, 0, 1]), brf=rng.choice([0, 7, 1, 6]),
                   brr=5, wrr=rng.randrange(0, 3), wrf=rng.randrange(0, 8))
        b = philidor_board(**prm)
        if not b or abs(prm["wrf"] - f) < 1:
            continue
        s = ES.score(b.fen(), 14)
        if abs(s) > 40:
            continue
        out.append((prm, b))
    return out


def build_philidor(foreign):
    g = Gen("PHI", "end-philidor.json", SCRIPT, SEED + 2, foreign)
    node = "END.PHILIDOR"
    qs = []
    idea = ["idea.philidor", "theme.rookEndgame", "theme.passive-defence"]

    # A: standard drawn set-up + the same set-up with the defending rook on the wrong rank (predict pairs, D2/D3) ----------------
    q = Quota("philidor vs wrong rook", 10)
    qs.append(q)
    for i, (prm, base) in enumerate(philidor_candidates(random.Random(SEED + 21), 60)):
        if not q.open():
            break
        rng = crng("phi", i)
        bad = None
        for brr in (6, 4, 2, 7, 1):
            vb = philidor_board(**{**prm, "brr": brr})
            if vb and ES.score(vb.fen(), 14) >= 300:
                bad = vb
                break
        if bad is None:
            continue
        k = rng.random()
        boards = []
        for b in (base, bad):
            x = b
            if k < 0.5:
                x = E.mirror(x)
            if 0.25 < k < 0.75:
                x = E.flip(x)
            x.castling_rights = 0
            boards.append(x)
        if not all([g.have(boards[0]), g.have(boards[1])]):
            q.wait()
            continue
        fam, cg = g.new_family(), g.new_cg()
        a = predict_item(g, boards[0], fam, node, 2, 3, HINTS_PHI_PREDICT, idea, cg=cg, role="working", ref="philidor standard set-up")
        c = predict_item(g, boards[1], fam, node, 3, 3, HINTS_PHI_PREDICT, idea + ["idea.wrong-rook"], cg=cg, role="failing", ref="defending rook on the wrong rank")
        if a and c:
            q.ok()

    # B: set up the defence (find_move hold, D1, cue 2): Black to move, rook not yet on the sixth rank ----------------------------
    q = Quota("set up the defence", 10)
    qs.append(q)
    rng0 = random.Random(SEED + 22)
    cand = []
    tries = 0
    while len(cand) < 60 and tries < 3000:
        tries += 1
        f = rng0.randrange(2, 6)
        prm = dict(f=f, kdx=rng0.choice([-1, 0, 1]), wkr=rng0.choice([3, 4]), bkf_off=rng0.choice([-1, 0, 1]), brf=rng0.choice([0, 7, 1, 6]),
                   brr=rng0.choice([6, 7, 4, 3, 2, 1, 0]), wrr=rng0.randrange(0, 3), wrf=rng0.randrange(0, 8))
        b = philidor_board(**prm, stm=False)
        if not b or abs(prm["wrf"] - f) < 1:
            continue
        mv = ES.multipv(b.fen(), 14, 6)
        if not mv or abs(mv[0][1]) > 40:
            continue
        # best move is a rook move to the sixth rank; the next best is clearly worse
        m0 = chess.Move.from_uci(mv[0][0])
        if b.piece_type_at(m0.from_square) != ROOK or chess.square_rank(m0.to_square) != 5:
            continue
        if len(mv) >= 2 and mv[1][1] > -90:
            continue
        cand.append(b)
    for i, base in enumerate(cand):
        if not q.open():
            break
        rng = crng("phib", i)
        x = base
        if rng.random() < 0.5:
            x = E.mirror(x)
        if rng.random() < 0.5:
            x = E.flip(x)
        x.castling_rights = 0
        if not g.have(x):
            q.wait()
            continue
        fam = g.new_family()
        prompt = f"{E.CTITLE[x.turn]} to move. With best play the position is a draw, but only one move holds it. Idea: the passive defence. Find the move."
        if only_move_item(g, x, fam, node, 1, 1, HINTS_PHI_MOVE, idea, mode="hold", prompt=prompt, review="needs-human", min_wrong=3, max_accepted=2, ref="philidor set-up move"):
            q.ok()
            play_out_item(g, x, fam, node, 3, "hold", 30, HINTS_PHI_PLAY, idea, ref="philidor hold from the set-up position")

    # C: the pawn has reached the sixth rank, Black (the defender) to move: the rook has to go far behind the pawn (find_move hold, D1).
    # Candidates come from the surveyed template list (tablebase first, no engine screen); the idea label is checked structurally:
    # every accepted move must be a rook move to one of the three ranks farthest from the pawn's goal.
    q = Quota("switch to checks from behind", 10)
    qs.append(q)
    for i, base in enumerate(philidor_c_templates()):
        if not q.open():
            break
        if not tb.have(base.fen()):
            continue
        res = tb.result(base.fen())
        mvs = tb.moves(base.fen())
        if res != "draw" or not mvs:
            continue
        acc = [u for u, r in mvs.items() if r == "draw"]
        if not (1 <= len(acc) <= 3) or len(mvs) - len(acc) < 3:
            continue

        def far_rook_move(u):
            m = chess.Move.from_uci(u)
            return base.piece_type_at(m.from_square) == ROOK and chess.square_rank(m.to_square) <= 2
        if not all(far_rook_move(u) for u in acc):
            g.stats["not-a-far-rook-move"] += 1
            continue
        (x,) = sym([base], crng("phic", i))
        if not g.have(x):
            q.wait()
            continue
        fam = g.new_family()
        cp = g.checkpoint()
        pawn_sq = next(s for s, p in x.piece_map().items() if p.piece_type == PAWN)
        pawn_sym = x.piece_at(pawn_sq).symbol()
        prompt = (f"{E.CTITLE[x.turn]} to move. With best play the position is a draw, but some moves lose. "
                  f"The enemy pawn stands on the sixth rank counted from its own side. Find a move that holds the draw.")
        r = only_move_item(g, x, fam, node, 1, 2, HINTS_PHI_BACK, idea + ["idea.checks-from-behind"], mode="hold", prompt=prompt, review="needs-human",
                           min_wrong=3, max_accepted=3, ref="philidor: the pawn is on the sixth rank, rook far behind it")
        if not r:
            g.rollback(cp)
            continue
        item = g.items[-1]
        item["claims"].append(claim(f"C{len(item['claims']) + 1}", "piece_on", f"The pawn stands on {chess.square_name(pawn_sq)}.",
                                    square=chess.square_name(pawn_sq), piece=pawn_sym))
        q.ok()
    return g, qs


def philidor_c_templates():
    """The 140 surveyed templates (pawn on its sixth rank, defender to move). Deterministic: same seed, same list as the survey enqueue."""
    rng = random.Random(41)
    out, seen, tries = [], set(), 0
    while len(out) < 140 and tries < 20000:
        tries += 1
        f = rng.randrange(2, 6)
        prm = dict(f=f, kdx=rng.choice([-1, 1]), wkr=rng.choice([4, 5]), bkf_off=rng.choice([-1, 0, 1]), brf=rng.choice([0, 7]), brr=5,
                   wrr=rng.randrange(0, 5), wrf=rng.randrange(0, 8), pr=5)
        b = philidor_board(**prm, stm=False, bkr=7)
        if not b or abs(prm["wrf"] - f) < 1 or b.is_check():
            continue
        k = b.fen()
        if k in seen:
            continue
        seen.add(k)
        out.append(b)
    return out


# ----------------------------------------------------------------------------------------------------------------
# ROOK-ACTIVE
# ----------------------------------------------------------------------------------------------------------------
def active_board(f, pr, wr, wk, bk, br, stm=True):
    wp = sqr(f, pr)
    return put([(wk, KING, True), (wp, PAWN, True), (wr, ROOK, True), (bk, KING, False), (br, ROOK, False)], stm)


def active_candidates(rng, n):
    """Pairs: the white rook behind the passed pawn versus the same rook placed beside the pawn. Keep pairs where the engine sees a clear
    difference (win versus draw)."""
    out, tries = [], 0
    while len(out) < n and tries < 3000:
        tries += 1
        f = rng.randrange(1, 7)
        pr = rng.choice([3, 4, 5])
        dk = rng.choice([-1, 1])
        wk = sqr(f + dk, pr) if 0 <= f + dk <= 7 else None
        bkf = f + rng.choice([-1, 0, 1])
        bk = sqr(bkf, min(7, pr + rng.choice([2, 3]))) if 0 <= bkf <= 7 else None
        brf = rng.choice([0, 7, f - 3, f + 3])
        br = sqr(brf, rng.randrange(0, 4)) if 0 <= brf <= 7 else None
        wr_behind = sqr(f, rng.randrange(0, pr - 1))
        side_f = f - 2 * dk if 0 <= f - 2 * dk <= 7 else None
        if None in (wk, bk, br) or side_f is None:
            continue
        wr_side = sqr(side_f, rng.randrange(0, pr))
        b1 = active_board(f, pr, wr_behind, wk, bk, br)
        b2 = active_board(f, pr, wr_side, wk, bk, br)
        if not b1 or not b2:
            continue
        s1, s2 = ES.score(b1.fen(), 14), ES.score(b2.fen(), 14)
        if s1 >= 300 and abs(s2) <= 60:
            out.append((b1, b2))
    return out


def build_active(foreign):
    g = Gen("RA", "end-rook-active.json", SCRIPT, SEED + 3, foreign)
    node = "END.ROOK-ACTIVE"
    qs = []
    idea = ["idea.rook-behind-the-pawn", "theme.rookEndgame", "theme.passed-pawn"]

    q = Quota("rook behind the pawn vs beside it", 12)
    qs.append(q)
    for i, (b1, b2) in enumerate(active_candidates(random.Random(SEED + 31), 30)):
        if not q.open():
            break
        rng = crng("act", i)
        k = rng.random()
        boards = []
        for b in (b1, b2):
            x = b
            if k < 0.5:
                x = E.mirror(x)
            if 0.25 < k < 0.75:
                x = E.flip(x)
            x.castling_rights = 0
            boards.append(x)
        if not all([g.have(boards[0]), g.have(boards[1])]):
            q.wait()
            continue
        fam, cg = g.new_family(), g.new_cg()
        a = predict_item(g, boards[0], fam, node, 2, 3, HINTS_ACT_PREDICT, idea, cg=cg, role="working", ref="rook behind the passed pawn")
        c = predict_item(g, boards[1], fam, node, 2, 3, HINTS_ACT_PREDICT, idea, cg=cg, role="failing", ref="same position, rook beside the pawn")
        if a and c:
            q.ok()
            # the misplaced version as a find-the-move item: the winning move puts the rook behind the pawn
            mv2 = tb.moves(boards[1].fen())
            if mv2:
                pass
    # find_move: White to move with the rook beside the pawn. Tablebase first: the template list below was surveyed in full; an item needs one to
    # three winning moves, at least three losing-the-win moves, and EVERY accepted move must be a white rook move onto the pawn's file below the pawn
    # (so the idea label 'behind the pawn' is true of the accepted set).
    q = Quota("put the rook behind the pawn", 10)
    qs.append(q)
    for i, base in enumerate(active_templates()):
        if not q.open():
            break
        if not tb.have(base.fen()):
            continue
        res = tb.result(base.fen())
        mvs = tb.moves(base.fen())
        if res != "win" or not mvs:
            continue
        acc = [u for u, r in mvs.items() if r == "win"]
        if not (1 <= len(acc) <= 3) or len(mvs) - len(acc) < 3:
            continue
        pawn_sq = next(s for s, p in base.piece_map().items() if p.piece_type == PAWN)

        def behind(u):
            m = chess.Move.from_uci(u)
            return (base.piece_type_at(m.from_square) == ROOK and chess.square_file(m.to_square) == chess.square_file(pawn_sq)
                    and chess.square_rank(m.to_square) < chess.square_rank(pawn_sq))
        if not all(behind(u) for u in acc):
            g.stats["accepted-not-behind"] += 1
            continue
        rng = crng("actb", i)
        x = base
        if rng.random() < 0.5:
            x = E.mirror(x)
        if rng.random() < 0.5:
            x = E.flip(x)
        x.castling_rights = 0
        x.ep_square = None
        if not g.have(x):
            q.wait()
            continue
        fam = g.new_family()
        prompt = f"{E.CTITLE[x.turn]} to move and wins, but some moves throw the win away. Idea: where does the rook belong? Find a winning move."
        if only_move_item(g, x, fam, node, 1, 2, HINTS_ACT_MOVE, idea, mode="win", prompt=prompt, review="needs-human", min_wrong=3, max_accepted=3,
                          ref="rook to the right square"):
            q.ok()
    return g, qs


def active_templates():
    """The 150 surveyed templates: White rook beside the passed pawn, White to move. Deterministic: same seed and loop as the survey enqueue."""
    rng0 = random.Random(43)
    out, seen, tries = [], set(), 0
    while len(out) < 150 and tries < 30000:
        tries += 1
        f = rng0.randrange(1, 7)
        pr = rng0.choice([3, 4, 5])
        dk = rng0.choice([-1, 1])
        if not (0 <= f + dk <= 7):
            continue
        wk = sqr(f + dk, pr)
        bkf = f + rng0.choice([-1, 0, 1])
        if not 0 <= bkf <= 7:
            continue
        bk = sqr(bkf, min(7, pr + rng0.choice([2, 3])))
        brf = rng0.choice([0, 7, f - 3, f + 3])
        if not 0 <= brf <= 7:
            continue
        br = sqr(brf, rng0.randrange(0, 4))
        sf = f - 2 * dk
        if not 0 <= sf <= 7:
            continue
        wr = sqr(sf, rng0.randrange(0, pr))
        b = active_board(f, pr, wr, wk, bk, br)
        if not b or b.is_check():
            continue
        k = b.fen()
        if k in seen:
            continue
        seen.add(k)
        out.append(b)
    return out


BUILDERS = {"lucena": build_lucena, "philidor": build_philidor, "active": build_active}
FILES = {"lucena": "end-lucena.json", "philidor": "end-philidor.json", "active": "end-rook-active.json"}


def main(names):
    names = names or list(BUILDERS)
    foreign = E.foreign_fens(regen={FILES[n] for n in names})
    try:
        for name in names:
            g, qs = BUILDERS[name](foreign)
            n = g.flush_need("rook-" + name)
            g.write()
            foreign |= {E.fen_key(pp["fen"]) for pp in g.positions}
            E.report(g, qs)
            print(f"   queued {n} new positions for the daemon")
    finally:
        ES.close()
        E.close_engine()


if __name__ == "__main__":
    main(sys.argv[1:])
