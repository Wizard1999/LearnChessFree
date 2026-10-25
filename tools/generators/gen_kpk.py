"""Family 9: king-and-pawn endings (END.PAWN-RACE, END.OPPOSITION). Every claim is a Lichess tablebase claim (<= 4 pieces).

K1  'Can the king catch the pawn?'   predict_outcome yes/no; claim tablebase result for the mover (white to move: draw = caught,
    win = not caught; black to move: draw = caught, loss = not caught). The white king is far away and the outcome must agree with
    the rule of the square (so the item teaches what it claims). cue 1, END.PAWN-RACE.D1.
K2  'Both sides have a pawn: win, draw or loss for the mover?'   predict_outcome; claim tablebase result. cue 3, END.PAWN-RACE.D2.
K3  'The side with the pawn wins, but only one move keeps the win: find it.'   find_move; claims: tablebase win for the position, win
    for the accepted move, DRAW for each wrong move (>= 2 plausible wrong moves are recorded in feedback_by_move, each with its own
    tablebase claim). cue 1, END.OPPOSITION.D1.
K4  'Black to move: only one move holds the draw.'  same structure, accepted move = draw, wrong moves = loss. cue 1, END.OPPOSITION.D1.
K5  'Win or draw?' contrast pairs: the same position with one king moved one step (win <-> draw). cue 3, END.OPPOSITION.D2.
Candidate positions are searched with the exact local solver (kpk_solver.py); the tablebase claims in each item are the
verification (the pre-check queries the Lichess service, whose answers the validator caches). Each base has a mirror and a
colour-flipped twin.

    python tools/generators/gen_kpk.py            # writes content/items/gen-t0-kpk.json
"""
from __future__ import annotations

import sys as _s, pathlib as _p
_s.path.insert(0, str(_p.Path(__file__).resolve().parent))
import chess

from common import *  # noqa: F401,F403
import kpk_solver as ks

AREA, MODULE, SEED, FILE = "KPK", "kpk", 20261101, "gen-t0-kpk.json"
P, K = chess.PAWN, chess.KING


def kpk_board(wk, bk, p, white_to_move):
    b = new_board()
    put(b, wk, K, chess.WHITE)
    put(b, bk, K, chess.BLACK)
    put(b, p, P, chess.WHITE)
    b.turn = chess.WHITE if white_to_move else chess.BLACK
    return b


def tmap(s, kind):
    return {"orig": s, "mirror": s ^ 7, "flip": s ^ 56, "mirrorflip": s ^ 63}[kind]


def tmove(uci, kind):
    m = chess.Move.from_uci(uci)
    return chess.Move(tmap(m.from_square, kind), tmap(m.to_square, kind)).uci()


def vboard(base, kind):
    return {"orig": base.copy(stack=False), "mirror": mirror_files(base), "flip": colour_flip(base)}[kind]


def rule_catch(bk, p, white_to_move):
    f, r = chess.square_file(p), chess.square_rank(p)
    n = 7 - max(r, 2)
    d = chess.square_distance(bk, chess.square(f, 7))
    return d <= n if white_to_move else d <= n + 1


# ------------------------------------------------------------------------------------------------------------
# K1
# ------------------------------------------------------------------------------------------------------------
def sample_k1(rng, want_catch, white_to_move):
    rw, rb = ks.solve()
    for _ in range(200000):
        p = chess.square(rng.randrange(8), rng.randrange(1, 6))
        f = chess.square_file(p)
        bk = rng.randrange(64)
        wk = rng.randrange(64)
        if chess.square_distance(wk, p) < 4 or chess.square_distance(wk, chess.square(f, 7)) < 4 or chess.square_distance(bk, p) > 6:
            continue
        r = ks.result(wk, bk, p, white_to_move)
        if r == ks.INVALID:
            continue
        caught = (r == ks.DRAW)
        if caught != want_catch or caught != rule_catch(bk, p, white_to_move):
            continue
        # the black king must not be trivially next to the pawn
        if chess.square_distance(bk, p) <= 1:
            continue
        b = kpk_board(wk, bk, p, white_to_move)
        if b.is_valid():
            return b, p
    return None


K1_HINTS = ["Count how many moves the pawn needs to reach the last rank. (From its starting rank it may move two squares at once on its first move.)",
            "Count how many king moves the chasing king needs to get to the pawn's last-rank square. A king moves one square in any direction.",
            "Compare the two counts, and remember who is to move: if the chasing king arrives in time, it captures the pawn or the new queen."]


def mover_result(vb):
    """Local-solver result for the side to move ('win'/'draw'/'loss'), for a K+P v K board with either colour owning the pawn."""
    pcs = vb.piece_map()
    pawn_sq = next(s for s, x in pcs.items() if x.piece_type == P)
    pawn_color = pcs[pawn_sq].color
    bb = vb if pawn_color == chess.WHITE else colour_flip(vb)
    p = next(s for s, x in bb.piece_map().items() if x.piece_type == P)
    r = ks.result(bb.king(chess.WHITE), bb.king(chess.BLACK), p, bb.turn == chess.WHITE)
    if r == ks.INVALID:
        return None
    if r != ks.WIN:
        return "draw"
    return "win" if vb.turn == pawn_color else "loss"


def emit_k1(b, base, kind, fam, p0):
    vb = vboard(base, kind)
    mover = vb.turn
    pawn_sq = next(s for s, x in vb.piece_map().items() if x.piece_type == P)
    pawn_color = vb.piece_at(pawn_sq).color
    chaser = not pawn_color
    want = mover_result(vb)
    if want is None:
        return None
    caught = want == "draw"
    pf = chess.square_name(pawn_sq)
    prompt = (f"{CTITLE[mover]} to move. Can the {CNAME[chaser]} king stop the {CNAME[pawn_color]} pawn on {pf} from becoming a queen? Predict, then check.")
    outcome = "yes" if caught else "no"
    expl = (f"Yes. With best play the tablebase result is a draw, so the {CNAME[chaser]} king stops the {CNAME[pawn_color]} pawn from winning." if caught
            else f"No. With best play the tablebase result is a win for {CNAME[pawn_color]}, so the pawn cannot be stopped.")
    item = {"skill": "END.PAWN-RACE.D1", "cue": 1, "task": "predict_outcome", "prompt": prompt,
            "answer": {"outcome": outcome, "options": ["yes", "no"]},
            "claims": [claim("C1", "tablebase", f"With best play the result for the side to move is a {want}.", result=want)],
            "hints": K1_HINTS, "explain": expl,
            "tags": tags_for(["END.PAWN-RACE"], 1, 1, fam, ["task.predict_outcome", "theme.pawnEndgame", "theme.square-rule"])}
    return b.add(vb, fam, item, f"king catches pawn? {kind}", label="kpk-k1")


# ------------------------------------------------------------------------------------------------------------
# K2
# ------------------------------------------------------------------------------------------------------------
def sample_k2(rng, pre, want_class, tries=400):
    import validate
    for _ in range(tries):
        f1 = rng.randrange(8)
        f2 = rng.randrange(8)
        if abs(f1 - f2) < 2:
            continue
        r1 = rng.randrange(2, 6)
        r2 = rng.randrange(2, 6)
        wp, bp = chess.square(f1, r1), chess.square(f2, r2)
        wk, bk = rng.randrange(64), rng.randrange(64)
        if any(chess.square_distance(k, q) < 3 for k in (wk, bk) for q in (wp, bp, chess.square(f1, 7), chess.square(f2, 0))):
            continue
        if chess.square_distance(wk, bk) < 3:
            continue
        b = new_board()
        put(b, wk, K, chess.WHITE); put(b, bk, K, chess.BLACK); put(b, wp, P, chess.WHITE); put(b, bp, P, chess.BLACK)
        b.turn = chess.WHITE
        if not b.is_valid():
            continue
        d = validate.tb_query(b.fen())
        if d is None:
            continue
        cat = d["category"]
        res = {"win": "win", "loss": "loss", "draw": "draw"}.get(cat)
        if res != want_class:
            continue
        return b
    return None


K2_HINTS = ["Count how many moves each pawn needs to reach the last rank. (From its starting rank a pawn may move two squares at once.)",
            "Who moves first matters: with equal counts the side to move gets its queen one move earlier.",
            "If both sides queen, ask whether the first new queen can win something at once, for example by giving check to a king or attacking the other queen."]


def emit_k2(b, base, kind, fam, res):
    vb = vboard(base, kind)
    mover = vb.turn
    expl = {"win": f"With best play {CNAME[mover]} wins: the tablebase confirms it.",
            "draw": "With best play the game is a draw: the tablebase confirms it.",
            "loss": f"With best play {CNAME[mover]} loses: the tablebase confirms it."}[res]
    item = {"skill": "END.PAWN-RACE.D2", "cue": 3, "task": "predict_outcome",
            "prompt": f"{CTITLE[mover]} to move. Each side has a pawn that can run to the last rank. With best play, is the result a win, a draw or a loss for {CNAME[mover]}? Predict, then check.",
            "answer": {"outcome": res, "options": ["win", "draw", "loss"]},
            "claims": [claim("C1", "tablebase", f"With best play the result for the side to move is a {res}.", result=res)],
            "hints": K2_HINTS, "explain": expl,
            "tags": tags_for(["END.PAWN-RACE"], 1, 3, fam, ["task.predict_outcome", "theme.pawnEndgame", "theme.pawn-race"])}
    return b.add(vb, fam, item, f"pawn race {res}, {kind}", label="kpk-k2")


# ------------------------------------------------------------------------------------------------------------
# K3 / K4
# ------------------------------------------------------------------------------------------------------------
def sample_k3(rng, used):
    rw, rb = ks.solve()
    for _ in range(300000):
        p = chess.square(rng.randrange(8), rng.randrange(2, 6))
        wk = rng.randrange(64)
        bk = rng.randrange(64)
        if chess.square_distance(wk, p) > 3 or chess.square_distance(bk, p) > 3:
            continue
        if ks.result(wk, bk, p, True) != ks.WIN:
            continue
        mv = ks.white_moves(wk, bk, p)
        win = [m for m, r in mv if r == ks.WIN]
        draw = [m for m, r in mv if r == ks.DRAW]
        if len(win) != 1 or len(draw) < 2:
            continue
        key = (chess.square_file(p), chess.square_rank(p))
        if key in used or (min(key[0], 7 - key[0]), key[1]) in used:
            continue
        b = kpk_board(wk, bk, p, True)
        if b.is_valid():
            return b, win, draw, key
    return None


def sample_k4(rng, used):
    rw, rb = ks.solve()
    for _ in range(300000):
        p = chess.square(rng.randrange(8), rng.randrange(2, 6))
        wk = rng.randrange(64)
        bk = rng.randrange(64)
        if chess.square_distance(wk, p) > 3 or chess.square_distance(bk, p) > 3:
            continue
        r = ks.result(wk, bk, p, False)
        if r != ks.DRAW:
            continue
        mv = ks.black_moves(wk, bk, p)
        hold = [m for m, rr in mv if rr == ks.DRAW]
        lose = [m for m, rr in mv if rr == ks.WIN]
        if len(hold) != 1 or len(lose) < 2 or chess.Move.from_uci(hold[0]).to_square == p:
            continue
        key = (chess.square_file(p), chess.square_rank(p))
        if key in used or (min(key[0], 7 - key[0]), key[1]) in used:
            continue
        b = kpk_board(wk, bk, p, False)
        if b.is_valid():
            return b, hold, lose, key
    return None


K3_HINTS = ["Whose move is it, and which king is closer to the pawn's path? Compare the two kings.",
            "Try each king move and each pawn push. For each, ask where the enemy king can go next and whether it can then stop the pawn.",
            "More than one move may look natural. Only one of them keeps the win: test each candidate against the enemy king's best reply."]
K4_HINTS = ["You are the defending side. Which of your king's moves keep it close to the pawn and in front of it?",
            "Try each king move and ask: after the pawn side's best reply, can the pawn still be stopped?",
            "Only one move keeps the draw. Test each candidate against the best reply."]


def emit_k34(b, base, kind, fam, win, wrong, mode, tag_extra):
    """win = the accepted move(s); wrong = EVERY other legal move (the claims cover all of them, so 'the only move' is verified).
    feedback_by_move records the three most plausible wrong moves (pawn push first, then king moves towards the action)."""
    vb = vboard(base, kind)
    mover = vb.turn
    acc = [tmove(u, kind) for u in win]
    bad = [tmove(u, kind) for u in wrong]
    legal = {m.uci() for m in vb.legal_moves}
    if any(u not in legal for u in acc + bad) or legal != set(acc + bad):
        b.stats["move-list-mismatch"] += 1
        return None
    if len(bad) < 2:
        return None
    sans = {u: vb.san(chess.Move.from_uci(u)) for u in acc + bad}
    enemy_k = vb.king(not mover)

    def plausibility(u):
        m = chess.Move.from_uci(u)
        is_pawn = vb.piece_type_at(m.from_square) == P
        return (0 if is_pawn else 1, chess.square_distance(m.to_square, enemy_k), u)
    bad_sorted = sorted(bad, key=plausibility)
    shown = bad_sorted[:3]
    if mode == "win":
        claims = [claim("C1", "tablebase", "The side to move wins.", result="win")]
        for i, u in enumerate(acc):
            claims.append(claim(f"C{2 + i}", "tablebase", f"{sans[u]} keeps the win.", move=u, result="win"))
        fb = {}
        for j, u in enumerate(bad_sorted):
            claims.append(claim(f"C{2 + len(acc) + j}", "tablebase", f"{sans[u]} only draws.", move=u, result="draw"))
            if u in shown:
                fb[u] = f"{sans[u]} lets the defender draw (tablebase: draw)."
        prompt = f"{CTITLE[mover]} to move and wins, but only one move keeps the win. Find it."
        expl = (f"{sans[acc[0]]} is the only move that keeps the win: the tablebase shows every other legal move lets the defender draw, "
                f"for example {join_squares([sans[u] for u in shown])}.")
        hints = K3_HINTS
    else:
        claims = [claim("C1", "tablebase", "The side to move can hold the draw.", result="draw")]
        for i, u in enumerate(acc):
            claims.append(claim(f"C{2 + i}", "tablebase", f"{sans[u]} holds the draw.", move=u, result="draw"))
        fb = {}
        for j, u in enumerate(bad_sorted):
            claims.append(claim(f"C{2 + len(acc) + j}", "tablebase", f"{sans[u]} loses.", move=u, result="loss"))
            if u in shown:
                fb[u] = f"{sans[u]} loses (tablebase: loss)."
        prompt = f"{CTITLE[mover]} to move. The position is a draw with best play, but only one move holds it. Find it."
        expl = (f"{sans[acc[0]]} is the only move that holds the draw: the tablebase shows every other legal move loses, "
                f"for example {join_squares([sans[u] for u in shown])}.")
        hints = K4_HINTS
    item = {"skill": "END.OPPOSITION.D1", "cue": 1, "task": "find_move", "prompt": prompt, "answer": {"moves": acc}, "claims": claims,
            "feedback_by_move": fb, "hints": hints, "explain": expl,
            "tags": tags_for(["END.OPPOSITION"], 1, 1, fam, ["task.find_move", "theme.pawnEndgame", tag_extra])}
    return b.add(vb, fam, item, f"{mode} only-move, {kind}", label=f"kpk-{tag_extra}")


# ------------------------------------------------------------------------------------------------------------
# K5 contrast pairs: win <-> draw by moving a king one step
# ------------------------------------------------------------------------------------------------------------
def sample_k5(rng, used):
    rw, rb = ks.solve()
    for _ in range(300000):
        p = chess.square(rng.randrange(8), rng.randrange(3, 6))
        wk = rng.randrange(64)
        bk = rng.randrange(64)
        if chess.square_distance(wk, p) > 2 or chess.square_distance(bk, p) > 3:
            continue
        if ks.result(wk, bk, p, True) != ks.WIN:
            continue
        key = (min(chess.square_file(p), 7 - chess.square_file(p)), chess.square_rank(p))
        if key in used:
            continue
        for t in ks.KN[bk]:
            if t != p and ks.result(wk, t, p, True) == ks.DRAW:
                a = kpk_board(wk, bk, p, True)
                d = kpk_board(wk, t, p, True)
                if a.is_valid() and d.is_valid():
                    return a, d, key
    return None


K5_HINTS = ["Look at where the pawn is and where each king stands. Which king is in front of the pawn?",
            "Think about what happens if the attacker's king tries to make progress: can the defending king always answer it?",
            "Test the most natural attacking moves for the side to move. Does each one keep the defender out?"]


def emit_k5(b, board, kind, fam, cg, result):
    vb = vboard(board, kind)
    mover = vb.turn
    pawn_color = vb.piece_at(next(s for s, x in vb.piece_map().items() if x.piece_type == P)).color
    expl = (f"A win for the side with the pawn: the tablebase confirms it." if result == "win"
            else "A draw: the defending king holds. The tablebase confirms it.")
    # the result is for the side to move; the mover is the pawn side only in the unflipped/flipped boards where the pawn color matches
    if mover != pawn_color:
        return None
    item = {"skill": "END.OPPOSITION.D2", "cue": 3, "task": "predict_outcome",
            "prompt": f"{CTITLE[mover]} to move. Is this a win for {CNAME[mover]} or a draw, with best play? Predict, then check.",
            "answer": {"outcome": result, "options": ["win", "draw"]},
            "claims": [claim("C1", "tablebase", f"With best play the result for the side to move is a {result}.", result=result)],
            "contrast_group": cg, "hints": K5_HINTS, "explain": expl,
            "tags": tags_for(["END.OPPOSITION"], 1, 3, fam, ["task.predict_outcome", "theme.pawnEndgame", "theme.opposition-contrast"])}
    return b.add(vb, fam, item, f"win-or-draw contrast {result}, {kind}", label="kpk-k5")


def build(registry, pre):
    b = Builder(AREA, MODULE, SEED, registry, pre)
    rng = b.rng
    n = 0

    def nf():
        nonlocal n
        n += 1
        return f"FAM-GEN-KPK-{n:02d}"

    # K1: 5 bases (3 'no', 2 'yes'; mixed side to move)
    for want_catch, wtm in [(False, True), (True, False), (False, False), (True, True), (False, True)]:
        fam = nf()
        for _ in range(20):
            r = sample_k1(rng, want_catch, wtm)
            if r is None:
                break
            base, p = r
            if emit_k1(b, base, "orig", fam, p):
                emit_k1(b, base, "mirror", fam, p)
                emit_k1(b, base, "flip", fam, p)
                break
        else:
            b.stats["no-base-k1"] += 1
    # K2: pawn races
    for want in ["win", "win", "draw", "loss", "loss"]:
        fam = nf()
        base = sample_k2(rng, pre, want)
        if base is None:
            b.stats["no-base-k2"] += 1
            continue
        if emit_k2(b, base, "orig", fam, want):
            emit_k2(b, base, "mirror", fam, want)
            emit_k2(b, base, "flip", fam, want)
    # K3: only winning move
    used = set()
    for _ in range(7):
        fam = nf()
        for attempt in range(25):
            r = sample_k3(rng, used)
            if r is None:
                break
            base, win, draw, key = r
            rng.shuffle(draw)
            if emit_k34(b, base, "orig", fam, win, draw, "win", "k3-only-winning-move"):
                used.add(key); used.add((min(key[0], 7 - key[0]), key[1]))
                emit_k34(b, base, "mirror", fam, win, draw, "win", "k3-only-winning-move")
                emit_k34(b, base, "flip", fam, win, draw, "win", "k3-only-winning-move")
                break
        else:
            b.stats["no-base-k3"] += 1
    # K4: only drawing move
    used4 = set()
    for _ in range(3):
        fam = nf()
        for attempt in range(25):
            r = sample_k4(rng, used4)
            if r is None:
                break
            base, hold, lose, key = r
            rng.shuffle(lose)
            if emit_k34(b, base, "orig", fam, hold, lose, "draw", "k4-only-drawing-move"):
                used4.add(key); used4.add((min(key[0], 7 - key[0]), key[1]))
                emit_k34(b, base, "mirror", fam, hold, lose, "draw", "k4-only-drawing-move")
                emit_k34(b, base, "flip", fam, hold, lose, "draw", "k4-only-drawing-move")
                break
        else:
            b.stats["no-base-k4"] += 1
    # K5: win/draw contrast pairs
    used5 = set()
    for k in range(2):
        r = sample_k5(rng, used5)
        if r is None:
            b.stats["no-base-k5"] += 1
            continue
        a, d, key = r
        used5.add(key)
        fam = nf()
        for kind in ("orig", "mirror", "flip"):
            cg = f"CG-GEN-KPK-{k + 1}-{kind}"
            emit_k5(b, a, kind, fam, cg, "win")
            emit_k5(b, d, kind, fam, cg, "draw")
    return {FILE: b}


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
