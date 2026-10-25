"""Queen endings, tablebase-backed: END.QUEEN-PAWN, END.THEORY.QvR, END.FORTRESS.

Templates (standard pictures of each idea) are screened with the local engine (screening only); the tablebase decides what ships. The
queen-versus-rook 'fork' items use engine claims (material_after_move) for the 'wins the rook' wording, plus a tablebase win claim.
Run repeatedly (see gen_pawn.py).

    ./tools/.venv/Scripts/python.exe -I tools/endgames/gen_queen.py [queenpawn] [qvr] [fortress]
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
from gen_rook import put
from gen_minor import sym

SEED = 20261601
SCRIPT = "gen_queen.py"
sqr = chess.square
KING, PAWN, QUEEN, ROOK, BISHOP, KNIGHT = chess.KING, chess.PAWN, chess.QUEEN, chess.ROOK, chess.BISHOP, chess.KNIGHT
SD = 12


def crng(tag, i):
    return random.Random(f"{SEED}-{tag}-{i}")


HINTS_QP_PREDICT = [
    "Find the pawn on the seventh rank, its king, and the enemy queen and king. On which file is the pawn?",
    "Ask how far the queen's king is from the pawn, and whether the pawn's king can run into the corner and force a stalemate.",
    "Does the pawn's file give the defender stalemate tricks? Compare what a rook, bishop, knight or central pawn allows.",
]
HINTS_QP_MOVE = [
    "Check which of your pieces is in check or can be taken, and what the enemy king would have if you gave up a piece.",
    "Look for a move after which the enemy has no legal move but is not in check.",
    "Test the sacrifices: after the capture, count the legal moves the pawn's king has.",
]
HINTS_QP_WIN = [
    "Bring the king nearer while the queen keeps the pawn's king boxed in, and avoid stalemate.",
    "Use checks to drive the pawn's king away from the pawn or into a corner, then bring your king up.",
    "Before every queen move, check that the pawn's king keeps at least one legal move unless you give mate.",
]
HINTS_QP_HOLD = [
    "You have a pawn on the seventh rank and the enemy king is far away. Which squares make a stalemate possible?",
    "Keep your king next to the pawn and near the corner, and look for moves that offer the queen only a stalemating capture.",
    "Before pushing the pawn, ask whether the queen can take it with check; if so, consider waiting with the king and look for the stalemate net.",
]
HINTS_QVR_FORK = [
    "Look for a queen check that also attacks the rook.",
    "The enemy king must answer the check; ask whether it can take the queen or protect the rook at the same time.",
    "Test the checking moves: which one forks the king and the rook with the rook not protected by its king?",
]
HINTS_QVR_PREDICT = [
    "Count the material and see which side owns the queen.",
    "Ask whether the rook can be separated from its king, and whether the queen's king is needed.",
    "Where are the rook and its king compared with each other? Which checks would attack both?",
]
HINTS_QVR_PLAY = [
    "Keep the queen safe from the rook and look for a check that forks the king and the rook.",
    "Which checks push the enemy king towards the edge, and what happens to the rook's protection then?",
    "Before each queen move ask: can the rook attack or pin the queen there, and does the enemy king still have a legal move?",
]
HINTS_FORT_PREDICT = [
    "Count the material, then look at how the weaker side's pieces protect each other and the squares around the king.",
    "Ask whether the queen has any entry square or any piece to attack that the defence cannot cover.",
    "Check whether each defender is needed where it stands: could the stronger side force one of them to move?",
]
HINTS_FORT_PLAY = [
    "Keep the pieces where they are protected and shuffle with the one that has a spare, harmless move.",
    "Before capturing or advancing, ask whether the change of structure opens a way in for the queen.",
    "Before each move check which squares the queen can reach with check and make sure each one is covered.",
]


# ----------------------------------------------------------------------------------------------------------------
# END.QUEEN-PAWN
# ----------------------------------------------------------------------------------------------------------------
def qp_board(f, wk, bk, q, stm):
    """White pawn on the seventh rank (file f); White king, Black king and queen as given."""
    return put([(sqr(f, 6), PAWN, True), (wk, KING, True), (bk, KING, False), (q, QUEEN, False)], stm)


def qp_pairs(rng, n):
    """Same arrangement, pawn on a drawing file versus the neighbouring winning file. Returns [(draw_board, win_board)]."""
    out, tries = [], 0
    while len(out) < n and tries < 800:
        tries += 1
        f0 = rng.choice([0, 1, 2, 5, 6, 7])
        dk = rng.choice([-1, 1]) if f0 not in (0, 7) else (1 if f0 == 0 else -1)
        wk = sqr(f0 + dk, rng.choice([6, 7]))
        bk = sqr(min(7, max(0, f0 + rng.choice([-3, -2, 2, 3]))), rng.choice([2, 3, 4]))
        q = sqr(rng.randrange(0, 8), rng.randrange(0, 4))
        stm = rng.random() < 0.5
        a = qp_board(f0, wk, bk, q, stm)
        if a is None:
            continue
        # neighbour file picture: shift everything one file toward the centre
        sh = 1 if f0 < 4 else -1
        if not all(0 <= chess.square_file(x) + sh <= 7 for x in (wk, bk, q)):
            continue
        b = qp_board(f0 + sh, wk + sh, bk + sh, q + sh, stm)
        if b is None:
            continue
        sa, sb = ES.score(a.fen(), SD), ES.score(b.fen(), SD)
        # pawn side is White: eval from White's POV
        if abs(sa) <= 45 and sb <= -300:
            out.append((a, b))
    return out


def build_queenpawn(foreign):
    g = Gen("QP", "end-queen-pawn.json", SCRIPT, SEED + 1, foreign)
    node = "END.QUEEN-PAWN"
    qs = []
    idea = ["idea.queen-v-pawn", "theme.queenEndgame", "theme.stalemate-resource"]
    q = Quota("drawing file vs winning file", 7)
    qs.append(q)
    for i, (a, b) in enumerate(qp_pairs(random.Random(SEED + 11), 16)):
        if not q.open():
            break
        x, y = sym([a, b], crng("qp", i))
        if not all([g.have(x), g.have(y)]):
            q.wait()
            continue
        fam, cg = g.new_family(), g.new_cg()
        r1 = predict_item(g, x, fam, node, 1, 3, HINTS_QP_PREDICT, idea, cg=cg, role="failing", ref="queen v pawn on a drawing file")
        r2 = predict_item(g, y, fam, node, 3, 3, HINTS_QP_PREDICT, idea, cg=cg, role="working", ref="same arrangement, neighbouring file")
        if r1 and r2:
            q.ok()
            mm = moves_budget(y.fen(), floor=20)
            if tb.result(y.fen()) == "win" and mm:
                play_out_item(g, y, fam, node, 3, "win", mm, HINTS_QP_WIN, idea, ref="queen v pawn: win")

    q = Quota("defender's only drawing move", 4)
    qs.append(q)
    rng0 = random.Random(SEED + 12)
    cand, tries = [], 0
    while len(cand) < 24 and tries < 800:
        tries += 1
        f0 = rng0.choice([0, 2, 5, 7])
        dk = 1 if f0 in (0, 2) else -1
        wk = sqr(f0 + dk, rng0.choice([6, 7]))
        bk = sqr(min(7, max(0, f0 + rng0.choice([-3, -2, 2, 3]))), rng0.choice([2, 3, 4]))
        qq = sqr(rng0.randrange(0, 8), rng0.randrange(0, 5))
        b = qp_board(f0, wk, bk, qq, True)
        if b is None:
            continue
        mv = ES.multipv(b.fen(), SD, 6)
        if len(mv) < 3 or abs(mv[0][1]) > 45 or mv[1][1] > -250:
            continue
        cand.append(b)
    for i, b in enumerate(cand):
        if not q.open():
            break
        (x,) = sym([b], crng("qpd", i))
        if not g.have(x):
            q.wait()
            continue
        fam = g.new_family()
        if only_move_item(g, x, fam, node, 2, 2, HINTS_QP_MOVE, idea, mode="hold", min_wrong=3, max_accepted=2, ref="queen v pawn: only drawing move"):
            q.ok()
            play_out_item(g, x, fam, node, 2, "hold", 30, HINTS_QP_HOLD, idea, ref="queen v pawn: hold with the stalemate resource")
    return g, qs


# ----------------------------------------------------------------------------------------------------------------
# END.THEORY.QvR
# ----------------------------------------------------------------------------------------------------------------
def qvr_board(wk, q, bk, r, stm=True):
    return put([(wk, KING, True), (q, QUEEN, True), (bk, KING, False), (r, ROOK, False)], stm)


def _checks_and_attacks(b):
    """Legal queen moves that give check and attack an unprotected rook (python-chess screen only)."""
    res = []
    rook = next(s for s, p in b.piece_map().items() if p.piece_type == ROOK)
    bk = b.king(False)
    for m in b.legal_moves:
        if b.piece_type_at(m.from_square) != QUEEN:
            continue
        b.push(m)
        ok = b.is_check() and (rook in b.attacks(m.to_square)) and chess.square_distance(rook, bk) > 1
        b.pop()
        if ok:
            res.append(m)
    return res


def fork_candidates(rng, n):
    out, tries = [], 0
    while len(out) < n and tries < 20000:
        tries += 1
        wk, q, bk, r = (rng.randrange(64) for _ in range(4))
        b = qvr_board(wk, q, bk, r, True)
        if b is None or b.is_check():
            continue
        forks = _checks_and_attacks(b)
        if 1 <= len(forks) <= 3 and chess.square_distance(r, bk) > 1:
            out.append(b)
    return out


def build_qvr(foreign):
    g = Gen("QVR", "end-qvr.json", SCRIPT, SEED + 2, foreign)
    node = "END.THEORY.QvR"
    qs = []
    idea = ["idea.queen-v-rook", "theme.queenEndgame", "theme.fork"]
    # D1: find the queen move that wins the rook (engine claims on EVERY legal move; tablebase win for the position)
    q = Quota("queen fork wins the rook", 8)
    qs.append(q)
    for i, b in enumerate(fork_candidates(random.Random(SEED + 21), 24)):
        if not q.open():
            break
        (x,) = sym([b], crng("fork", i))
        if not g.have(x) or tb.result(x.fen()) != "win":
            if not tb.have(x.fen()):
                q.wait()
            continue
        # classify every legal move by the engine claim
        fam = g.new_family()
        legal = [m.uci() for m in x.legal_moves]
        acc, rej = [], []
        for u in legal:
            c = claim("T", "material_after_move", move=u, min=5)
            if E.precheck(x.fen(), [c]):
                acc.append(u)
            else:
                c2 = claim("T", "material_after_move", move=u, max=4)
                if E.precheck(x.fen(), [c2]):
                    rej.append(u)
                else:
                    g.stats["ambiguous-move"] += 1
        if not acc or len(acc) + len(rej) != len(legal) or len(acc) > 3:
            g.stats["fork-not-clean"] += 1
            continue
        san = {u: x.san(chess.Move.from_uci(u)) for u in legal}
        claims = [claim("C1", "tablebase", "The side to move wins.", result="win")]
        for u in acc:
            claims.append(claim(f"C{len(claims) + 1}", "material_after_move", f"{san[u]} wins the rook by force.", move=u, min=5))
        for u in rej:
            claims.append(claim(f"C{len(claims) + 1}", "material_after_move", f"{san[u]} does not win the rook.", move=u, max=4))
        wrong_show = sorted(rej, key=lambda u: (x.piece_type_at(chess.Move.from_uci(u).from_square) != QUEEN, u))[:3]
        item = {"skill": f"{node}.D1", "cue": 2, "task": "find_move",
                "prompt": f"{E.CTITLE[x.turn]} to move. Find the move that wins the rook by force.",
                "answer": {"moves": acc}, "claims": claims,
                "feedback_by_move": {u: f"{san[u]} does not win the rook." for u in wrong_show},
                "hints": HINTS_QVR_FORK,
                "explain": f"{' and '.join(san[u] for u in acc)} wins the rook: the engine confirms that every other legal move fails to win it, and the tablebase confirms the position is a win.",
                "tags": E.tags_for(node, 2, fam, "find_move", idea + ["kind.few-moves"]), "review": {"status": "machine-only"}}
        if g.add(x, fam, item, "queen fork wins the rook"):
            q.ok()

    # D2: win or draw? (predict) -- random standard positions with the queen's king not too close
    q = Quota("queen v rook predict", 6)
    qs.append(q)
    rng0 = random.Random(SEED + 22)
    cand, tries = [], 0
    while len(cand) < 30 and tries < 4000:
        tries += 1
        wk, qq, bk, r = (rng0.randrange(64) for _ in range(4))
        b = qvr_board(wk, qq, bk, r, rng0.random() < 0.5)
        if b is None or b.is_check() or chess.square_distance(r, bk) > 2 or chess.square_distance(wk, bk) < 3:
            continue
        cand.append(b)
    for i, b in enumerate(cand):
        if not q.open():
            break
        (x,) = sym([b], crng("qvrp", i))
        if not g.have(x):
            q.wait()
            continue
        fam = g.new_family()
        if predict_item(g, x, fam, node, 2, 3, HINTS_QVR_PREDICT, idea, ref="queen v rook"):
            q.ok()

    # D3: play out (win), move budget from the tablebase distance to mate
    q = Quota("queen v rook play out", 4)
    qs.append(q)
    rng1 = random.Random(SEED + 23)
    cand, tries = [], 0
    while len(cand) < 24 and tries < 800:
        tries += 1
        wk, qq, bk, r = (rng1.randrange(64) for _ in range(4))
        b = qvr_board(wk, qq, bk, r, True)
        if b is None or b.is_check() or chess.square_distance(r, bk) > 2 or chess.square_distance(wk, bk) < 3:
            continue
        cand.append(b)
    for i, b in enumerate(cand):
        if not q.open():
            break
        (x,) = sym([b], crng("qvrpl", i))
        if not g.have(x):
            q.wait()
            continue
        mm = moves_budget(x.fen(), floor=20, cap=60)
        if mm is None or tb.result(x.fen()) != "win":
            g.stats["qvr-no-budget"] += 1
            continue
        fam = g.new_family()
        if play_out_item(g, x, fam, node, 3, "win", mm, HINTS_QVR_PLAY, idea, ref="queen v rook play out"):
            q.ok()
    return g, qs


# ----------------------------------------------------------------------------------------------------------------
# END.FORTRESS
# ----------------------------------------------------------------------------------------------------------------
def fort_board(rng, extra_pawns=1):
    zone_d = [sqr(f, r) for f in range(5, 8) for r in range(5, 8)]
    zone_a = [s for s in range(64) if s not in zone_d]
    b = chess.Board(None)
    b.castling_rights = 0
    used = set()

    def place(pt, col, zone):
        for _ in range(30):
            s = rng.choice(zone)
            if s not in used:
                used.add(s)
                b.set_piece_at(s, chess.Piece(pt, col))
                return s
        return None
    if place(KING, False, zone_d) is None or place(ROOK, False, zone_d) is None:
        return None
    for _ in range(extra_pawns):
        if place(PAWN, False, [sqr(f, r) for f in range(5, 8) for r in range(5, 7)]) is None:
            return None
    if place(KING, True, zone_a) is None or place(QUEEN, True, zone_a) is None:
        return None
    b.turn = rng.random() < 0.5
    if not b.is_valid() or b.is_check() or chess.square_distance(b.king(True), b.king(False)) <= 1:
        return None
    return b


def fort_candidates(rng, n):
    out, tries = [], 0
    while len(out) < n and tries < 1000:
        tries += 1
        b = fort_board(rng, rng.choice([1, 1, 2]))
        if b is None:
            continue
        if abs(ES.score(b.fen(), SD)) <= 45 and abs(ES.score(b.fen(), 16)) <= 60:
            out.append(b)
    return out


def fort_breaks(b, rng):
    """One-square edits of a fortress position that the engine calls lost for the defender; returns boards."""
    out = []
    for s, p in list(b.piece_map().items()):
        if p.color or p.piece_type == chess.KING and False:
            continue
        for t in range(64):
            if chess.square_distance(s, t) != 1 or b.piece_at(t):
                continue
            if p.piece_type == PAWN and chess.square_rank(t) in (0, 7):
                continue
            c = b.copy()
            c.remove_piece_at(s)
            c.set_piece_at(t, p)
            if c.is_valid() and not c.is_check() and chess.square_distance(c.king(True), c.king(False)) > 1:
                out.append(c)
    rng.shuffle(out)
    return out


def build_fortress(foreign):
    g = Gen("FORT", "end-fortress.json", SCRIPT, SEED + 3, foreign)
    node = "END.FORTRESS"
    qs = []
    idea = ["idea.fortress", "theme.queenEndgame", "theme.drawing-setup"]
    q = Quota("fortress holds / one step breaks it", 8)
    qs.append(q)
    for i, b in enumerate(fort_candidates(random.Random(SEED + 31), 30)):
        if not q.open():
            break
        rng = crng("fort", i)
        brk = None
        for c in fort_breaks(b, rng)[:40]:
            if ES.score(c.fen(), SD) * (1 if c.turn else 1) is not None:
                s = ES.score(c.fen(), SD)
                # defender is Black here (pieces in the h8 zone): White (queen side) wins when the score is high
                if s >= 300:
                    brk = c
                    break
        boards = [b] + ([brk] if brk is not None else [])
        boards = sym(boards, rng)
        if not all([g.have(x) for x in boards]):
            q.wait()
            continue
        fam, cg = g.new_family(), g.new_cg()
        a = predict_item(g, boards[0], fam, node, 2, 3, HINTS_FORT_PREDICT, idea, cg=cg, role="working", ref="fortress: material down, drawn")
        if not a:
            continue
        q.ok()
        if brk is not None:
            predict_item(g, boards[1], fam, node, 3, 3, HINTS_FORT_PREDICT, idea, cg=cg, role="failing", ref="fortress broken by one step of one defender")
        rook_color = next(p.color for p in boards[0].piece_map().values() if p.piece_type == ROOK)
        if tb.result(boards[0].fen()) == "draw" and boards[0].turn == rook_color:
            play_out_item(g, boards[0], fam, node, 2, "hold", 30, HINTS_FORT_PLAY, idea, ref="hold the fortress")
            only_move_item(g, boards[0], fam, node, 3, 2, HINTS_FORT_PLAY, idea, mode="hold", min_wrong=2, max_accepted=3, ref="fortress: moves that keep it")
    return g, qs


BUILDERS = {"queenpawn": build_queenpawn, "qvr": build_qvr, "fortress": build_fortress}
FILES = {"queenpawn": "end-queen-pawn.json", "qvr": "end-qvr.json", "fortress": "end-fortress.json"}


def main(names):
    names = names or list(BUILDERS)
    foreign = E.foreign_fens(regen={FILES[n] for n in names})
    try:
        for name in names:
            g, qs = BUILDERS[name](foreign)
            n = g.flush_need("queen-" + name)
            g.write()
            foreign |= {E.fen_key(pp["fen"]) for pp in g.positions}
            E.report(g, qs)
            print(f"   queued {n} new positions for the daemon")
    finally:
        ES.close()
        E.close_engine()


if __name__ == "__main__":
    main(sys.argv[1:])
