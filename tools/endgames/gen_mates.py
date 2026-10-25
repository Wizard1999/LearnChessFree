"""Mating-material exercises, tablebase-backed: END.MATE-MATERIAL, END.MATE-2B, END.MATE-BN, END.THEORY.2N, END.MATE-STALEMATE-AVOID.

Candidates are sampled from templates, pre-screened with python-chess / the local engine (screening only); the tablebase decides what
ships. Stalemate wording in feedback is verified by a COMPANION item in the same family whose position is the position after the
stalemating move (claim game_state = stalemate), as in tools/generators/gen_endmate.py. Run repeatedly (see gen_pawn.py).

    ./tools/.venv/Scripts/python.exe -I tools/endgames/gen_mates.py [material] [twob] [bn] [twon] [stalemate]
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
from egcommon import Gen, Quota, only_move_item, predict_item, play_out_item, claim, classify_item
from gen_pawn import moves_budget
from gen_rook import put
from gen_minor import sym

SEED = 20261701
SCRIPT = "gen_mates.py"
sqr = chess.square
KING, PAWN, QUEEN, ROOK, BISHOP, KNIGHT = chess.KING, chess.PAWN, chess.QUEEN, chess.ROOK, chess.BISHOP, chess.KNIGHT
SD = 12


def crng(tag, i):
    return random.Random(f"{SEED}-{tag}-{i}")


HINTS_MAT = [
    "Count the pieces on each side. Which side has mating material?",
    "Ask whether the stronger side can force the lone king into a corner and finish with check, whatever the king does.",
    "Ask what the pieces cover: can they together attack squares of both colours near a corner, and can the lone king capture one of them or run out of moves without being checked?",
]
HINTS_2B = [
    "Look at which of your pieces is attacked and which is safe.",
    "Keep both bishops protected, either by each other or by the king, and keep the enemy king's squares covered.",
    "Test each candidate: after the move, can the enemy king capture a bishop or reach a square that lets it escape?",
]
HINTS_BN = [
    "Check which of your pieces is attacked or could be won by the enemy king.",
    "The knight and the bishop must stay protected; the king keeps them together.",
    "Test each candidate against the enemy king's replies: which moves leave a piece to be captured or let the king slip away?",
]
HINTS_2N = [
    "Count the pieces. Two knights cannot force mate on a bare king; what changes when the other side has a pawn?",
    "Ask whether the pawn can still advance, and whether the defending king and the pawn could block each other.",
    "Look at the stalemate geometry: a blocked pawn and a king in front of it can leave the defender short of safe moves.",
]
HINTS_SA = [
    "Count the squares the enemy king still has after each candidate move.",
    "Look for a move that takes the last square away without giving check: that is stalemate, not mate.",
    "Check each candidate: can the enemy king move afterwards, or is it in check? A king with no move and no check is stalemated.",
]


def light(s):
    return (chess.square_file(s) + chess.square_rank(s)) % 2 == 1


def safe_sample(rng, white, black, zone_bk=None, stm=True, min_kd=3, max_tries=60):
    """Random legal position; white/black = lists of piece types (no kings); no piece of the stronger side en prise at the start, side to
    move not in check, kings at least min_kd apart. zone_bk: allowed squares for the black king."""
    for _ in range(max_tries):
        b = chess.Board(None)
        b.castling_rights = 0
        used = set()

        def place(pt, col, zone=None, pawn=False):
            zone = zone or [s for s in range(64) if (not pawn) or 0 < chess.square_rank(s) < 7]
            for _ in range(40):
                s = rng.choice(zone)
                if s not in used:
                    used.add(s)
                    b.set_piece_at(s, chess.Piece(pt, col))
                    return s
            return None
        bk = place(KING, False, zone_bk)
        wk = place(KING, True)
        if bk is None or wk is None or chess.square_distance(bk, wk) < min_kd:
            continue
        ok = True
        for pt in white:
            ok &= place(pt, True, pawn=(pt == PAWN)) is not None
        for pt in black:
            ok &= place(pt, False, pawn=(pt == PAWN)) is not None
        if not ok:
            continue
        b.turn = stm
        if not b.is_valid() or b.is_check():
            continue
        # no white piece hanging to the black king at the start
        bad = False
        for s, p in b.piece_map().items():
            if p.color and p.piece_type != KING and b.attackers(False, s) and not b.attackers(True, s):
                bad = True
        if bad:
            continue
        return b
    return None


# ----------------------------------------------------------------------------------------------------------------
# END.MATE-MATERIAL
# ----------------------------------------------------------------------------------------------------------------
def material_pairs(rng):
    """(label_win, pieces_win, label_draw, pieces_draw, extra_black) : the same squares, one piece type changed."""
    return [
        ("two bishops", [BISHOP, BISHOP], "two knights", [KNIGHT, KNIGHT], []),
        ("bishop and knight", [BISHOP, KNIGHT], "two knights", [KNIGHT, KNIGHT], []),
        ("bishop and knight", [BISHOP, KNIGHT], "two knights", [KNIGHT, KNIGHT], []),
        ("two bishops", [BISHOP, BISHOP], "two knights", [KNIGHT, KNIGHT], []),
        ("rook", [ROOK], "knight", [KNIGHT], []),
        ("queen against a bishop", [QUEEN], "rook against a bishop", [ROOK], [BISHOP]),
        ("queen against a knight", [QUEEN], "rook against a knight", [ROOK], [KNIGHT]),
        ("queen against a rook", [QUEEN], "rook against a rook", [ROOK], [ROOK]),
    ]


def build_material(foreign):
    g = Gen("MAT", "end-mate-material.json", SCRIPT, SEED + 1, foreign)
    node = "END.MATE-MATERIAL"
    qs = []
    idea = ["idea.mating-material", "theme.mate"]
    q = Quota("material pairs", 12)
    qs.append(q)
    rng0 = random.Random(SEED + 11)
    pairs = material_pairs(rng0)
    n = 0
    for rep in range(6):
        for (lw, pw, ld, pd, extra) in pairs:
            n += 1
            if not q.open():
                break
            rng = crng("mat", n)
            central = [sqr(f, r) for f in range(2, 6) for r in range(2, 6)]
            # same squares for the two members: sample the 'win' one, then swap the piece types
            if rep % 2:
                zone = [s for s in range(64) if chess.square_file(s) in (0, 7) or chess.square_rank(s) in (0, 7)]
            else:
                zone = central
            base = safe_sample(rng, pw, extra, zone_bk=zone, stm=True, min_kd=3)
            if base is None:
                continue
            # swap piece types on the same squares
            alt = chess.Board(None)
            alt.castling_rights = 0
            wpieces = [s for s, p in base.piece_map().items() if p.color and p.piece_type != KING]
            for s, p in base.piece_map().items():
                if p.color and p.piece_type != KING:
                    continue
                alt.set_piece_at(s, p)
            for s, newt in zip(sorted(wpieces), sorted(pd, reverse=False)):
                alt.set_piece_at(s, chess.Piece(newt, True))
            alt.turn = True
            if not alt.is_valid() or alt.is_check():
                continue
            if any(p.color and p.piece_type != KING and alt.attackers(False, s) and not alt.attackers(True, s) for s, p in alt.piece_map().items()):
                continue
            # a pair only if the engine sees the piece change matter (or both are drawn for rook v ...)
            sa, sb = ES.score(base.fen(), SD), ES.score(alt.fen(), SD)
            if not (sa >= 300 and abs(sb) <= 60):
                continue
            x, y = sym([base, alt], rng)
            if not all([g.have(x), g.have(y)]):
                q.wait()
                continue
            fam, cg = g.new_family(), g.new_cg()
            opt = ("win", "draw")

            def mp(b_, label):
                tail = " Is this a win or a draw for the side to move, with best play?"
                return f"{E.CTITLE[b_.turn]} to move: {label}" + (" against a lone king." if not extra else ".") + tail
            lab_w = lw if extra else f"{lw}"
            a = predict_item(g, x, fam, node, 1, 2, HINTS_MAT, idea, cg=cg, role="working", options=opt, prompt=mp(x, lab_w), ref=f"material: {lw}")
            c = predict_item(g, y, fam, node, 1, 2, HINTS_MAT, idea, cg=cg, role="failing", options=opt, prompt=mp(y, ld), ref=f"material: {ld}")
            if a and c:
                q.ok()
    return g, qs


# ----------------------------------------------------------------------------------------------------------------
# END.MATE-2B and END.MATE-BN : keep the win (traps), play it out
# ----------------------------------------------------------------------------------------------------------------
def trap_candidates(rng, white, n, edge=True, tries=1200):
    """Positions with the lone king next to one of our pieces or on the edge, where most moves throw the win away (engine screen)."""
    out = []
    zone = [s for s in range(64) if (not edge) or chess.square_file(s) in (0, 7) or chess.square_rank(s) in (0, 7)]
    t = 0
    while len(out) < n and t < tries:
        t += 1
        b = safe_sample(rng, white, [], zone_bk=zone, stm=True, min_kd=2)
        if b is None:
            continue
        mv = ES.multipv(b.fen(), SD, 30)
        if len(mv) < 8 or mv[0][1] < 300:
            continue
        good = sum(1 for _u, s in mv if s >= 300)
        if good > 0.4 * len(mv) or good > 6:
            continue
        out.append(b)
    return out


def _bishops_opposite(b):
    bs = [s for s, p in b.piece_map().items() if p.piece_type == BISHOP and p.color]
    return len(bs) == 2 and light(bs[0]) != light(bs[1])


def build_mate_pieces(foreign, name, area, fname, node, white, hints, idea, play_cap):
    g = Gen(area, fname, SCRIPT, SEED + (2 if area == "M2B" else 3), foreign)
    qs = []
    two_b = (area == "M2B")

    def good(b):
        return b is not None and (not two_b or _bishops_opposite(b))
    q = Quota(f"{name}: keep the win", 10)
    qs.append(q)
    rng0 = random.Random(SEED + (21 if area == "M2B" else 31))
    cand = [b for b in trap_candidates(rng0, white, 40, edge=True, tries=1500) if good(b)]
    for i, b in enumerate(cand):
        if not q.open():
            break
        (x,) = sym([b], crng(area, i))
        if not g.have(x):
            q.wait()
            continue
        fam = g.new_family()
        r = only_move_item(g, x, fam, node, 2, 2, hints, idea, mode="win", min_wrong=3, max_accepted=12, ref=f"{name}: moves that keep the win")
        if r:
            q.ok()
            mm = moves_budget(x.fen(), floor=25, cap=play_cap)
            if mm:
                play_out_item(g, x, fam, node, 3, "win", mm, hints, idea, ref=f"{name}: play it out")
    # plain play-out positions (no trap): the lone king in the middle, then on the edge
    q2 = Quota(f"{name}: play out", 10)
    qs.append(q2)
    rng1 = random.Random(SEED + (22 if area == "M2B" else 32))
    for i in range(80):
        if not q2.open():
            break
        zone = ([sqr(f, r) for f in range(1, 7) for r in range(1, 7)] if i % 2 == 0
                else [s for s in range(64) if chess.square_file(s) in (0, 7) or chess.square_rank(s) in (0, 7)])
        b = safe_sample(rng1, white, [], zone_bk=zone, stm=True, min_kd=3)
        if not good(b):
            continue
        (x,) = sym([b], crng(area + "p", i))
        if not g.have(x):
            q2.wait()
            continue
        mm = moves_budget(x.fen(), floor=25, cap=play_cap)
        if mm is None:
            g.stats["no-dtm-budget"] += 1
            continue
        fam = g.new_family()
        if play_out_item(g, x, fam, node, 3, "win", mm, hints, idea, ref=f"{name}: play out from {'the middle' if i % 2 == 0 else 'the edge'}"):
            q2.ok()
    if two_b:
        # contrast: the bishops on squares of opposite colours win; move one bishop one step so that both stand on the same colour: draw
        q3 = Quota("two bishops: opposite vs same colour", 10)
        qs.append(q3)
        rng2 = random.Random(SEED + 23)
        for i in range(120):
            if not q3.open():
                break
            b = safe_sample(rng2, white, [], zone_bk=None, stm=True, min_kd=3)
            if not good(b):
                continue
            bs = [s for s, p in b.piece_map().items() if p.piece_type == BISHOP and p.color]
            # one-step edit of the first bishop to a square of the other colour (a king step away keeps it near)
            alt = None
            for t in sorted(range(64), key=lambda t: (chess.square_distance(t, bs[0]), t)):
                if chess.square_distance(t, bs[0]) != 1 or b.piece_at(t) or light(t) == light(bs[0]):
                    continue
                c = b.copy(stack=False)
                c.remove_piece_at(bs[0])
                c.set_piece_at(t, chess.Piece(BISHOP, True))
                if c.is_valid() and not c.is_check() and not any(p.color and p.piece_type != KING and c.attackers(False, s) and not c.attackers(True, s)
                                                                  for s, p in c.piece_map().items()):
                    alt = c
                    break
            if alt is None or _bishops_opposite(alt):
                continue
            x, y = sym([b, alt], crng("2bc", i))
            if not all([g.have(x), g.have(y)]):
                q3.wait()
                continue
            fam, cg = g.new_family(), g.new_cg()
            opt = ("win", "draw")
            pr = lambda bd: f"{E.CTITLE[bd.turn]} to move: two bishops against a lone king. Is this a win or a draw for the side to move, with best play?"
            a = predict_item(g, x, fam, node, 1, 2, HINTS_MAT, idea + ["idea.opposite-coloured-bishops"], cg=cg, role="working", options=opt, prompt=pr(x),
                             ref="two bishops on opposite colours")
            c = predict_item(g, y, fam, node, 1, 2, HINTS_MAT, idea + ["idea.same-coloured-bishops"], cg=cg, role="failing", options=opt, prompt=pr(y),
                             ref="same position, one bishop one step away: both on the same colour")
            if a and c:
                q3.ok()
    return g, qs


def build_twob(foreign):
    return build_mate_pieces(foreign, "two bishops", "M2B", "end-mate-2b.json", "END.MATE-2B", [BISHOP, BISHOP], HINTS_2B,
                             ["idea.two-bishops", "theme.mate"], 60)


def build_bn(foreign):
    return build_mate_pieces(foreign, "bishop and knight", "MBN", "end-mate-bn.json", "END.MATE-BN", [BISHOP, KNIGHT], HINTS_BN,
                             ["idea.bishop-and-knight", "theme.mate"], 60)


# ----------------------------------------------------------------------------------------------------------------
# END.THEORY.2N
# ----------------------------------------------------------------------------------------------------------------
def twon_candidates(rng, n):
    out, tries = [], 0
    while len(out) < n and tries < 6000:
        tries += 1
        pf = rng.randrange(0, 8)
        pr = rng.choice([1, 2, 3, 4])           # Black pawn on rank idx 1..4 (it queens on rank 0)
        bpawn = sqr(pf, pr)
        bk = sqr(min(7, max(0, pf + rng.choice([-1, 0, 1]))), max(0, pr - rng.choice([0, 1])))
        wk = sqr(rng.randrange(8), rng.randrange(8))
        n1, n2 = rng.randrange(64), rng.randrange(64)
        b = put([(wk, KING, True), (n1, KNIGHT, True), (n2, KNIGHT, True), (bk, KING, False), (bpawn, PAWN, False)], rng.random() < 0.5)
        if b is None or b.is_check() or chess.square_distance(wk, bk) < 2:
            continue
        if any(p.color and p.piece_type == KNIGHT and b.attackers(False, s) and not b.attackers(True, s) for s, p in b.piece_map().items()):
            continue
        out.append(b)
    return out


HINTS_2N_PLAY = HINTS_2N


def build_twon(foreign):
    g = Gen("T2N", "end-two-knights.json", SCRIPT, SEED + 4, foreign)
    node = "END.THEORY.2N"
    qs = []
    idea = ["idea.two-knights", "theme.knightEndgame", "theme.stalemate-geometry"]
    q = Quota("two knights v pawn", 22)
    qs.append(q)
    cand = twon_candidates(random.Random(SEED + 41), 140)
    # screening by the engine to enrich both outcomes
    for i, b in enumerate(cand):
        if not q.open():
            break
        (x,) = sym([b], crng("twon", i))
        if not g.have(x):
            q.wait()
            continue
        fam = g.new_family()
        r = predict_item(g, x, fam, node, 1, 3, HINTS_2N, idea, ref="two knights against king and pawn")
        if r:
            q.ok()
            res = tb.result(x.fen())
            knights_color = True if any(p.piece_type == KNIGHT and p.color for p in x.piece_map().values()) else False
            if res == "win":
                mm = moves_budget(x.fen(), floor=25, cap=60)
                nc = next(p.color for p in x.piece_map().values() if p.piece_type == KNIGHT)
                if mm and x.turn == nc:
                    play_out_item(g, x, fam, node, 2, "win", mm, HINTS_2N_PLAY, idea, ref="two knights: convert")
                    only_move_item(g, x, fam, node, 2, 3, HINTS_2N, idea, mode="win", min_wrong=3, max_accepted=3, ref="two knights: moves that keep the win")
    return g, qs


# ----------------------------------------------------------------------------------------------------------------
# END.MATE-STALEMATE-AVOID
# ----------------------------------------------------------------------------------------------------------------
def stalemating_moves(b):
    out = []
    for m in b.legal_moves:
        b.push(m)
        if b.is_stalemate():
            out.append(m.uci())
        b.pop()
    return out


def sa_candidates(rng, white, n, tries=1500):
    out, t = [], 0
    corner_zone = [s for s in range(64) if chess.square_file(s) in (0, 1, 6, 7) and chess.square_rank(s) in (0, 1, 6, 7)]
    while len(out) < n and t < tries:
        t += 1
        b = safe_sample(rng, white, [], zone_bk=corner_zone, stm=True, min_kd=2)
        if b is None:
            continue
        sm = stalemating_moves(b)
        if not sm or b.legal_moves.count() < 12:
            continue
        mv = ES.multipv(b.fen(), SD, 40)
        if not mv or mv[0][1] < 300:
            continue
        out.append((b, sm))
    return out


def mate1_candidates(rng, white, n, tries=6000):
    """Rules-only candidates: lone king near the edge, one to three mating moves AND at least one stalemating move."""
    out, t = [], 0
    edge_zone = [s for s in range(64) if chess.square_file(s) in (0, 7) or chess.square_rank(s) in (0, 7)]
    while len(out) < n and t < tries:
        t += 1
        b = safe_sample(rng, white, [], zone_bk=edge_zone, stm=True, min_kd=2)
        if b is None:
            continue
        mates, stales = _mate_stale(b)
        if 1 <= len(mates) <= 3 and stales:
            out.append(b)
    return out


def _mate_stale(b):
    mates, stales = [], []
    for m in list(b.legal_moves):
        b.push(m)
        if b.is_checkmate():
            mates.append(m.uci())
        elif b.is_stalemate():
            stales.append(m.uci())
        b.pop()
    return mates, stales


def mate1_group(g, x, node, cue, depth, prompt, idea, label):
    """Main find_move item (all mating moves accepted, every other legal move claimed not to be mate) plus two companion classification
    items: the position after a mating move (checkmate) and after a stalemating move (stalemate). All or nothing."""
    cp = g.checkpoint()
    mates, stales = _mate_stale(x)
    if not (1 <= len(mates) <= 3 and stales):
        return False
    fam, cg = g.new_family(), g.new_cg()
    legal = [m.uci() for m in x.legal_moves]
    san = {u: x.san(chess.Move.from_uci(u)) for u in mates + stales}
    claims = []
    for u in mates:
        claims.append(claim(f"C{len(claims) + 1}", "mate_in", f"{san[u]} is checkmate.", move=u, n=1))
    for u in legal:
        if u not in mates:
            claims.append(claim(f"C{len(claims) + 1}", "move_is_not_mate", "This move does not give checkmate.", move=u))
    dec = stales[0]
    after_mate, after_stale = x.copy(stack=False), x.copy(stack=False)
    after_mate.push(chess.Move.from_uci(mates[0]))
    after_stale.push(chess.Move.from_uci(dec))
    for y in (after_mate, after_stale):
        y.castling_rights = 0
        y.ep_square = None
    foe = "Black" if x.turn else "White"
    fb = {dec: f"{san[dec]} is stalemate: {foe} has no legal move and is not in check, so the game is a draw (see the companion position)."}
    mate_txt = " and ".join(san[u] for u in mates)
    expl = (f"{mate_txt} {'is' if len(mates) == 1 else 'are'} checkmate. {san[dec]} takes away the last square but gives no check: "
            f"{foe} would have no legal move and no check, which is stalemate and a draw (see the companion position).")
    item = {"skill": f"{node}.D{depth}", "cue": cue, "task": "find_move", "prompt": prompt, "answer": {"moves": mates}, "claims": claims,
            "feedback_by_move": fb, "hints": HINTS_SA, "explain": expl,
            "tags": E.tags_for(node, cue, fam, "find_move", idea + ["kind.mate-in-1", "role.working", f"contrast.{cg}"]),
            "contrast_group": cg, "review": {"status": "machine-only"}}
    mid = g.add(x, fam, item, f"{label}: mate in one with a stalemate decoy")
    if not mid:
        g.rollback(cp)
        return False
    ids = []
    for y, state, role in ((after_mate, "checkmate", "working"), (after_stale, "stalemate", "failing")):
        stm = "White" if y.turn else "Black"
        st_txt = ("checkmate: the side to move is in check and has no legal move" if state == "checkmate"
                  else "stalemate: the side to move has no legal move and its king is not in check, so the game is drawn")
        cid = classify_item(g, y, fam, node, 1, 2, f"{stm} to move. Is this position checkmate, stalemate or neither?",
                            ["checkmate", "stalemate", "neither"], state,
                            [claim("C1", "game_state", f"The side to move is in {state}.", state=state)],
                            ["Is the king of the side to move in check?", "Does the side to move have any legal move?",
                             "No legal move and in check is checkmate; no legal move and not in check is stalemate."],
                            "This is " + st_txt + ".", idea + ["kind.companion"], review="machine-only", cg=cg, role=role,
                            ref=f"companion: after {'the mating move' if state == 'checkmate' else 'the stalemating move'}")
        ids.append(cid)
    if not all(ids):
        g.rollback(cp)
        return False
    return True


def build_stalemate(foreign):
    g = Gen("MSA", "end-mate-stalemate.json", SCRIPT, SEED + 5, foreign)
    node = "END.MATE-STALEMATE-AVOID"
    qs = []
    idea = ["idea.stalemate-trap", "theme.mate"]
    # ---- A: mate in one with a stalemate decoy (rules-only claims) ----
    qa = Quota("mate in one, stalemate decoy (named)", 5)
    qb = Quota("mate in one, stalemate decoy (unlabeled)", 6)
    qs += [qa, qb]
    rng0 = random.Random(SEED + 53)
    cands = []
    for white in ([QUEEN], [ROOK], [QUEEN], [ROOK], [QUEEN, BISHOP]):
        cands += mate1_candidates(rng0, white, 14)
    random.Random(SEED + 54).shuffle(cands)
    for i, b in enumerate(cands):
        if not (qa.open() or qb.open()):
            break
        x = sym([b], crng("msa1", i))[0]
        who = "White" if x.turn else "Black"
        if qa.open() and i % 2 == 0:
            if mate1_group(g, x, node, 2, 1, f"{who} to move. There is a checkmate in one, but a tempting move is stalemate. Find the checkmate.", idea, "named"):
                qa.ok()
        elif qb.open():
            if mate1_group(g, x, node, 3, 2, f"{who} to move. Find the checkmate in one.", idea, "unlabeled"):
                qb.ok()
    # ---- B: the winning side must avoid a stalemating move (tablebase), few accepted moves ----
    q = Quota("stalemate traps: keep the win (tablebase)", 8)
    qs.append(q)
    rng0 = random.Random(SEED + 51)
    cand = []
    for white in ([QUEEN], [ROOK], [BISHOP, BISHOP], [QUEEN], [ROOK]):
        cand += sa_candidates(rng0, white, 8)
    random.Random(SEED + 52).shuffle(cand)
    for i, (b, sm) in enumerate(cand):
        if not q.open():
            break
        x = sym([b], crng("msa", i))[0]
        sm_x = stalemating_moves(x)
        if not sm_x or not g.have(x):
            if sm_x:
                q.wait()
            continue
        mv = tb.moves(x.fen())
        if mv is None or sum(1 for r in mv.values() if r == "win") > 8:
            g.stats["too-many-safe-moves"] += 1
            continue
        cp = g.checkpoint()
        fam = g.new_family()
        shown = sm_x[:2]
        ok_all = True
        for u in shown:
            y = x.copy(stack=False)
            y.push(chess.Move.from_uci(u))
            y.castling_rights = 0
            cid = classify_item(g, y, fam, node, 1, 2,
                                f"{E.CTITLE[y.turn]} to move. Is this position checkmate, stalemate or neither?",
                                ["checkmate", "stalemate", "neither"], "stalemate",
                                [claim("C1", "game_state", "The side to move has no legal move and is not in check.", state="stalemate")],
                                ["Is the king of the side to move in check?", "Does the side to move have any legal move?", "No legal move and no check is stalemate."],
                                "This is stalemate: the side to move has no legal move and its king is not in check, so the game is drawn.",
                                idea + ["kind.companion"], review="machine-only", ref="companion: the stalemating move")
            if cid is None:
                ok_all = False
        san = {u: x.san(chess.Move.from_uci(u)) for u in shown}
        tail = " and ".join(san[u] for u in shown)
        prompt = f"{E.CTITLE[x.turn]} to move and wins. Some moves throw the win away; find a move that keeps it."
        r = only_move_item(g, x, fam, node, 2, 2, HINTS_SA, idea, mode="win", prompt=prompt, min_wrong=1, max_accepted=8,
                           wrong_pref=lambda bd, m: 0 if m.uci() in sm_x else 1,
                           explain_tail=f"{tail} would be stalemate (see the companion position).", ref="stalemate trap: keep the win")
        if ok_all and r:
            q.ok()
        else:
            g.rollback(cp)
    return g, qs


BUILDERS = {"material": build_material, "twob": build_twob, "bn": build_bn, "twon": build_twon, "stalemate": build_stalemate}
FILES = {"material": "end-mate-material.json", "twob": "end-mate-2b.json", "bn": "end-mate-bn.json", "twon": "end-two-knights.json",
         "stalemate": "end-mate-stalemate.json"}


def main(names):
    names = names or list(BUILDERS)
    foreign = E.foreign_fens(regen={FILES[n] for n in names})
    try:
        for name in names:
            g, qs = BUILDERS[name](foreign)
            n = g.flush_need("mates-" + name)
            g.write()
            foreign |= {E.fen_key(pp["fen"]) for pp in g.positions}
            E.report(g, qs)
            print(f"   queued {n} new positions for the daemon")
    finally:
        ES.close()
        E.close_engine()


if __name__ == "__main__":
    main(sys.argv[1:])
