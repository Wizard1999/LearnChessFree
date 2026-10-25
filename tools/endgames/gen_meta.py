"""Strategy-level endgame exercises, tablebase-backed: END.TRANSITION (which ending to enter) and END.TABLEBASE-LAB (testing a conjecture).

TRANSITION: a position in which one side can trade the pieces off into a king-and-pawn ending. The claim is a tablebase claim on the TRADE
MOVE ('after this capture the side that made it wins / draws with best play'), so the verdict covers the recapture and everything after it.
Pairs differ by one king step: the same trade wins in one and only draws in the other.

TABLEBASE-LAB: classify_position items 'does this conjecture hold in this position?'. Every conjecture is of the form 'X is a draw'; the
tablebase claim gives the result, and the answer (holds / fails) follows from it. A conjecture that fails in one position is refuted; a
conjecture that holds in the positions shown is NOT thereby proved (the explanation says so).

    ./tools/.venv/Scripts/python.exe -I tools/endgames/gen_meta.py [transition] [lab]
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
from egcommon import Gen, Quota, claim, classify_item, tags_for
from gen_rook import put
from gen_minor import sym, light, wb_board, bb_board
from gen_queen import qp_board
from gen_mates import twon_candidates
import pawnlib as pl

SEED = 20261901
SCRIPT = "gen_meta.py"
sqr = chess.square
KING, PAWN, QUEEN, ROOK, BISHOP, KNIGHT = chess.KING, chess.PAWN, chess.QUEEN, chess.ROOK, chess.BISHOP, chess.KNIGHT
SD = 12


def crng(tag, i):
    return random.Random(f"{SEED}-{tag}-{i}")


HINTS_TRANS = [
    "Name the ending you would reach after the trade and the recapture: which pieces are left?",
    "Ask where the two kings and the pawn stand in that ending, and who would be to move.",
    "Check whether the pawn's king can get in front of the pawn, or the defending king reaches the squares that stop it.",
]
HINTS_LAB = [
    "A conjecture is refuted by one position in which it fails. Read it carefully, then decide whether this position agrees with it.",
    "Find the material and the key features named in the conjecture (the file of the pawn, the bishop's colour, who is to move, where the kings are).",
    "Predict the result with best play first; then compare with what the conjecture says.",
]


# ----------------------------------------------------------------------------------------------------------------
# END.TRANSITION
# ----------------------------------------------------------------------------------------------------------------
def trade_board(rng, xt, yt):
    """White: K, X, P ; Black: K, Y, with X attacking Y, Y defended only by the black king. Returns (board, trade_move_uci) or None."""
    for _ in range(80):
        s = rng.sample(range(64), 6)
        wk, wx, wp, bk, by = s[0], s[1], s[2], s[3], s[4]
        if chess.square_rank(wp) in (0, 7):
            continue
        b = put([(wk, KING, True), (wx, xt, True), (wp, PAWN, True), (bk, KING, False), (by, yt, False)], True)
        if b is None or b.is_check():
            continue
        m = chess.Move(wx, by)
        if m not in b.legal_moves:
            continue
        if chess.square_distance(bk, by) != 1 or b.attackers(True, by).__len__() != 1:
            continue
        if b.attackers(False, wx):
            continue
        return b, m.uci()
    return None


def trade_pairs(rng, n, xt, yt):
    out, tries = [], 0
    while len(out) < n and tries < 150:
        tries += 1
        r = trade_board(rng, xt, yt)
        if r is None:
            continue
        b, u = r
        after = b.copy()
        after.push(chess.Move.from_uci(u))
        sa = ES.score(after.fen(), SD)
        # a partner: the white king (or pawn) one step away; the trade stays legal and its value should differ
        wk = b.king(True)
        _nb = [x for x in range(64) if chess.square_distance(x, wk) == 1]
        for t in rng.sample(_nb, min(8, len(_nb))):
            c = b.copy()
            if c.piece_at(t):
                continue
            c.remove_piece_at(wk)
            c.set_piece_at(t, chess.Piece(KING, True))
            if not c.is_valid() or c.is_check() or chess.square_distance(t, c.king(False)) <= 1:
                continue
            m = chess.Move.from_uci(u)
            if m not in c.legal_moves:
                continue
            cafter = c.copy()
            cafter.push(m)
            sc = ES.score(cafter.fen(), SD)
            if (sa >= 300 and abs(sc) <= 45) or (sc >= 300 and abs(sa) <= 45):
                win, drw = (b, c) if sa >= 300 else (c, b)
                out.append((win, drw, u))
                break
    return out


def trade_item(g, board, fam, uci, cg, role, cue=3, depth=1):
    node = "END.TRANSITION"
    mv = tb.moves(board.fen())
    if mv is None or uci not in mv:
        return None
    res = mv[uci]
    if res not in ("win", "draw"):
        g.stats["trade-result-" + res] += 1
        return None
    san = board.san(chess.Move.from_uci(uci))
    stm = E.CNAME[board.turn]
    pt = board.piece_type_at(chess.Move.from_uci(uci).from_square)
    prompt = (f"{E.CTITLE[board.turn]} to move and can trade with {san}. After the trade and the recapture, is the ending a win for {stm} "
              f"or a draw, with best play? Predict, then check.")
    expl = (f"After {san} the tablebase confirms {stm} wins with best play: the trade leads to a won ending." if res == "win"
            else f"After {san} the tablebase confirms the game is a draw with best play: the trade throws the win away or does not win.")
    item = {"skill": f"{node}.D{depth}", "cue": cue, "task": "predict_outcome", "prompt": prompt, "options": ["win", "draw"],
            "answer": {"outcome": res, "options": ["win", "draw"]},
            "claims": [claim("C1", "tablebase", f"After {san} the result for the player who made the move is a {res}.", move=uci, result=res)],
            "hints": HINTS_TRANS, "explain": expl,
            "tags": tags_for(node, cue, fam, "predict_outcome", ["idea.which-ending", f"role.{role}", f"contrast.{cg}", "theme.pawnEndgame"]),
            "contrast_group": cg, "review": {"status": "machine-only"}}
    return g.add(board, fam, item, f"trade {san} -> {res}")


def build_transition(foreign):
    g = Gen("TRN", "end-transition.json", SCRIPT, SEED + 1, foreign)
    qs = []
    kinds = [(ROOK, ROOK), (QUEEN, QUEEN), (BISHOP, KNIGHT), (KNIGHT, BISHOP), (ROOK, ROOK), (BISHOP, BISHOP)]
    q = Quota("trade into a pawn ending: wins / only draws", 14)
    qs.append(q)
    rng0 = random.Random(SEED + 11)
    cands = []
    for xt, yt in kinds:
        cands += trade_pairs(rng0, 6, xt, yt)
    random.Random(SEED + 12).shuffle(cands)
    for i, (win, drw, u) in enumerate(cands):
        if not q.open():
            break
        x, y = sym([win, drw], crng("trn", i))
        # the trade move must be transformed with the board: recompute it by the squares of the capture
        # (sym applies mirror/flip; find the capture of the unique attacker->victim pair)
        ux = _find_trade(x)
        uy = _find_trade(y)
        if ux is None or uy is None:
            continue
        if not all([g.have(x), g.have(y)]):
            q.wait()
            continue
        fam, cg = g.new_family(), g.new_cg()
        a = trade_item(g, x, fam, ux, cg, "working")
        c = trade_item(g, y, fam, uy, cg, "failing")
        if a and c:
            q.ok()
    return g, qs


def _find_trade(b):
    """The one capture of an enemy non-pawn piece defended only by the enemy king, by a non-king piece of the side to move."""
    found = []
    for m in b.legal_moves:
        if b.piece_type_at(m.from_square) in (KING, PAWN):
            continue
        t = b.piece_at(m.to_square)
        if t is not None and t.piece_type != PAWN:
            found.append(m.uci())
    return found[0] if len(found) == 1 else None


# ----------------------------------------------------------------------------------------------------------------
# END.TABLEBASE-LAB
# ----------------------------------------------------------------------------------------------------------------
def conj_wb(rng, n):
    """Rook pawn + bishop v lone king: engine-screened, half 'draw' (wrong bishop, king near the corner), half 'win'."""
    out, tries = [], 0
    while len(out) < n and tries < 400:
        tries += 1
        r = rng.choice([3, 4, 5])
        wk = sqr(rng.choice([0, 1, 2]), min(7, r + rng.choice([1, 2])))
        bk = sqr(rng.choice([0, 1, 2, 3, 4]), rng.choice([4, 5, 6, 7]))
        bs = rng.randrange(64)
        if chess.square_distance(wk, bk) <= 1 or chess.square_distance(bs, bk) <= 1 or bs in (wk, bk, sqr(0, r)):
            continue
        b = wb_board(0, r, wk, bk, bs)
        if b is None:
            continue
        s = ES.score(b.fen(), SD)
        out.append((b, "draw" if abs(s) <= 45 else "win" if s >= 300 else "?"))
    return [x for x in out if x[1] != "?"]


def conj_kpk_front(rng, n):
    """K+P v K with the attacking king directly in front of its pawn: solver finds both outcomes."""
    out, seen = [], set()
    for _ in range(20000):
        p = sqr(rng.randrange(1, 7), rng.randrange(2, 5))
        wk = p + 8                      # directly in front of the pawn (the conjecture's condition)
        bk = rng.randrange(64)
        if wk > 63 or pl.D(bk, p) > 4 or not pl.kp_valid(wk, bk, p, rng.random() < 0.5):
            continue
        wtm = rng.random() < 0.5
        if not pl.kp_valid(wk, bk, p, wtm):
            continue
        r = pl.ks.result(wk, bk, p, wtm)
        mover_result = ("draw" if r == pl.ks.DRAW else "win" if wtm else "loss")
        key = (p, mover_result)
        if key in seen:
            continue
        seen.add(key)
        out.append((pl.kp_board(wk, bk, p, wtm), "draw" if r == pl.ks.DRAW else "win"))
        if len(out) >= n:
            break
    return out


def conj_ocb(rng, n):
    out, tries = [], 0
    while len(out) < n and tries < 300:
        tries += 1
        pf, pr = rng.choice([0, 1, 6, 7, 3, 4]), rng.choice([3, 4])
        wk = sqr(rng.randrange(2, 6), rng.choice([3, 4, 5]))
        bk = sqr(rng.randrange(2, 6), rng.choice([5, 6]))
        wbs, bbs = rng.randrange(64), rng.randrange(64)
        if light(wbs) == light(bbs):
            continue
        extra = [(rng.choice([f for f in range(8) if abs(f - pf) >= 4] or [7 - pf]), rng.choice([3, 4]))] if rng.random() < 0.5 else []
        b = bb_board(pf, pr, wk, bk, wbs, bbs, extra=extra)
        if b is None:
            continue
        s = ES.score(b.fen(), SD)
        out.append((b, "draw" if abs(s) <= 45 else "win" if s >= 300 else "?"))
    return [x for x in out if x[1] != "?"]


def conj_2n(rng, n):
    out = []
    for b in twon_candidates(rng, 60):
        s = ES.score(b.fen(), SD)
        out.append((b, "draw" if abs(s) <= 45 else "win" if abs(s) >= 300 else "?"))
    return [x for x in out if x[1] != "?"]


def conj_qp(rng, n):
    out, tries = [], 0
    while len(out) < n and tries < 400:
        tries += 1
        f0 = rng.randrange(8)
        dk = rng.choice([-1, 1]) if f0 not in (0, 7) else (1 if f0 == 0 else -1)
        wk = sqr(f0 + dk, rng.choice([6, 7]))
        bk = sqr(min(7, max(0, f0 + rng.choice([-3, -2, 2, 3]))), rng.choice([2, 3, 4]))
        q = sqr(rng.randrange(0, 8), rng.randrange(0, 4))
        b = qp_board(f0, wk, bk, q, rng.random() < 0.5)
        if b is None:
            continue
        s = ES.score(b.fen(), SD)
        out.append((b, "draw" if abs(s) <= 45 else "win" if abs(s) >= 300 else "?"))
    return [x for x in out if x[1] != "?"]


def conj_rp(rng, n):
    """R+P v R: the drawish-endings conjecture."""
    out, tries = [], 0
    while len(out) < n and tries < 500:
        tries += 1
        f, r = rng.randrange(1, 7), rng.choice([3, 4, 5])
        s = rng.sample(range(64), 4)
        b = put([(s[0], KING, True), (sqr(f, r), PAWN, True), (s[1], ROOK, True), (s[2], KING, False), (s[3], ROOK, False)], rng.random() < 0.5)
        if b is None or b.is_check() or chess.square_distance(s[0], sqr(f, r)) > 3:
            continue
        sc = ES.score(b.fen(), SD)
        out.append((b, "draw" if abs(sc) <= 45 else "win" if abs(sc) >= 300 else "?"))
    return [x for x in out if x[1] != "?"]


CONJECTURES = [
    ("wb", "A rook pawn with a bishop is only a draw against a lone king.", conj_wb, "END.WRONG-BISHOP"),
    ("kpk", "If the attacking king stands directly in front of its pawn, the game is a draw.", conj_kpk_front, "END.KPK"),
    ("ocb", "Opposite-coloured bishops always draw.", conj_ocb, "END.MINOR"),
    ("2n", "Two knights against a king and a pawn is a draw.", conj_2n, "END.THEORY.2N"),
    ("qp", "A queen against a pawn on the seventh rank is a draw if the pawn's king is next to it.", conj_qp, "END.QUEEN-PAWN"),
    ("rp", "A rook and a pawn against a rook is a draw.", conj_rp, "END.ROOK-ACTIVE"),
]


def build_lab(foreign):
    g = Gen("LAB", "end-tablebase-lab.json", SCRIPT, SEED + 2, foreign)
    node = "END.TABLEBASE-LAB"
    qs = []
    for ci, (cid, text, fn, also) in enumerate(CONJECTURES):
        q = Quota(f"conjecture {cid}", 5)
        qs.append(q)
        cands = fn(random.Random(SEED + 20 + ci), 40)
        # balance: take the engine's 'draw' and 'win' guesses alternately
        draws = [c for c in cands if c[1] == "draw"]
        wins = [c for c in cands if c[1] == "win"]
        order = []
        for k in range(max(len(draws), len(wins))):
            if k < len(draws):
                order.append(draws[k])
            if k < len(wins):
                order.append(wins[k])
        fam = None
        for i, (b, _guess) in enumerate(order):
            if not q.open():
                break
            (x,) = sym([b], crng("lab" + cid, i))
            if not g.have(x):
                q.wait()
                continue
            res = tb.result(x.fen())
            if res is None:
                continue
            if fam is None:
                fam = g.new_family()
            holds = (res == "draw")
            stm = E.CNAME[x.turn]
            prompt = (f"Conjecture: \"{text}\" Is this position consistent with it? Decide whether the conjecture holds here or fails here, "
                      f"then check with the tablebase.")
            if holds:
                expl = ("The tablebase confirms this position is a draw with best play, so the conjecture holds here. One position that agrees "
                        "does not prove the conjecture: a single counterexample is enough to refute it, however many agree.")
            else:
                expl = (f"The tablebase confirms the side to move ({stm}) {'wins' if res == 'win' else 'loses'} with best play, so this position is not a "
                        f"draw and the conjecture fails here. One counterexample refutes a conjecture of this kind.")
            r = classify_item(g, x, fam, node, 1, 3, prompt, ["holds", "fails"], "holds" if holds else "fails",
                              [claim("C1", "tablebase", f"With best play the result for the side to move is a {res}.", result=res)],
                              HINTS_LAB, expl, ["idea.test-a-conjecture", f"conjecture.{cid}", "theme.endgame"], review="machine-only", also_nodes=(also,),
                              ref=f"lab conjecture {cid}: {res}")
            if r:
                q.ok()
    return g, qs


BUILDERS = {"transition": build_transition, "lab": build_lab}
FILES = {"transition": "end-transition.json", "lab": "end-tablebase-lab.json"}


def main(names):
    names = names or list(BUILDERS)
    foreign = E.foreign_fens(regen={FILES[n] for n in names})
    try:
        for name in names:
            g, qs = BUILDERS[name](foreign)
            n = g.flush_need("meta-" + name)
            g.write()
            foreign |= {E.fen_key(pp["fen"]) for pp in g.positions}
            E.report(g, qs)
            print(f"   queued {n} new positions for the daemon")
    finally:
        ES.close()
        E.close_engine()


if __name__ == "__main__":
    main(sys.argv[1:])
