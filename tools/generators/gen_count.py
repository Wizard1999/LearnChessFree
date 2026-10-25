"""Family 2: counting attackers and defenders (SAF.COUNT) and 'take it or not?' decisions.

A  "How many <colour> pieces attack / defend the <piece> on <sq>?"   predict_outcome, options 0-3,
   claim `attackers` (direct attackers of that colour on that square; no batteries, no pins, so the claim and the
   lesson say the same thing). cue 1 (named question), skill SAF.COUNT.D1.
B1 "Should the <piece> take the <target> on <sq>? yes/no"            predict_outcome, claims `attackers` x2 +
   `material_after_move` (min = swap-off gain for 'yes', max = swap-off gain for 'no'). cue 3, SAF.COUNT.D2.
B2 "Which capture on <sq> wins material?" (cheapest attacker first)   find_move, accepted = every capture with a
   positive swap-off gain; every clearly losing capture is listed in feedback_by_move WITH its own claim.
   No zero-gain (equal-trade) captures are allowed in B2, so the accepted set is unambiguous.
The swap-off gain is computed on real legal moves (common.see_gain); the engine pre-check then confirms that the
validator's own measurement (net material along the engine's best-defence line) agrees. Disagreements are rejected and
counted. Each base scenario is a family with 3 positions (original, mirror, colour-flip).

    python tools/generators/gen_count.py          # writes content/items/gen-t0-count.json
"""
from __future__ import annotations

import sys as _s, pathlib as _p
_s.path.insert(0, str(_p.Path(__file__).resolve().parent))
import chess

from common import *  # noqa: F401,F403

AREA, MODULE, SEED, FILE = "COUNT", "count", 20261025, "gen-t0-count.json"

TARGET_TYPES = [chess.PAWN, chess.PAWN, chess.KNIGHT, chess.KNIGHT, chess.BISHOP, chess.ROOK]
ATT_TYPES = [chess.PAWN, chess.PAWN, chess.KNIGHT, chess.KNIGHT, chess.KNIGHT, chess.BISHOP, chess.BISHOP, chess.BISHOP,
             chess.ROOK, chess.ROOK, chess.ROOK, chess.QUEEN, chess.QUEEN]
NUM_WEIGHTS_ATT = [1, 1, 1, 2, 2, 2, 2, 3, 3]
NUM_WEIGHTS_DEF = [0, 1, 1, 1, 1, 2, 2, 2, 3]
MAX_PER_SIDE = {chess.QUEEN: 1, chess.ROOK: 2, chess.BISHOP: 2, chess.KNIGHT: 2, chess.PAWN: 8}

# (n_attackers, n_defenders, question) rotation for part A; question 'attack' asks about n_att, 'defend' about n_def
A_SPECS = [(1, 0, "attack"), (2, 1, "defend"), (0, 2, "attack"), (2, 2, "attack"), (1, 3, "defend"), (3, 1, "attack"),
           (1, 1, "defend"), (3, 0, "attack"), (2, 0, "defend"), (0, 1, "defend"), (2, 3, "defend"), (1, 2, "attack"),
           (3, 2, "defend"), (0, 3, "attack"), (2, 1, "attack")]


def sane(b):
    for color in (chess.WHITE, chess.BLACK):
        for pt, mx in MAX_PER_SIDE.items():
            if len(b.pieces(pt, color)) > mx:
                return False
    return True


def count_hints(question, tsq, tcolor):
    if question == "attack":
        return [f"Look at the {tsq} square. Which enemy pieces could capture on it next move?",
                "Check each enemy piece: a pawn attacks the two squares diagonally ahead, a knight jumps, bishops and rooks slide until something blocks them.",
                "Go piece by piece and ask 'can this one reach that square along its own path?' Count the yes answers."]
    return [f"Look at the piece on {tsq}. Which of its own side's pieces could capture back on {tsq} if an enemy took it?",
            "Check each friendly piece: a pawn covers the two squares diagonally ahead, a knight jumps, bishops and rooks slide until something blocks them.",
            "Go piece by piece and ask 'if the enemy captured on that square, could this piece recapture?' Count the yes answers."]


def build_part_a(b, registry):
    rng = b.rng
    for i, (na, nd, q) in enumerate(A_SPECS):
        fam = f"FAM-GEN-COUNT-A{i + 1:02d}"
        allow_king = (i % 5 == 4) and (na + nd) > 0
        res = None
        for _ in range(4000):
            tt = rng.choice(TARGET_TYPES)
            slot = None
            na_o, nd_o = na, nd
            if allow_king:  # one of the counted pieces is a king standing next to the target
                slot = rng.choice(["att", "def"]) if (na > 0 and nd > 0) else ("att" if na > 0 else "def")
                if slot == "att":
                    na_o = na - 1
                else:
                    nd_o = nd - 1
            att = [rng.choice(ATT_TYPES) for _ in range(na_o)]
            dfn = [rng.choice(ATT_TYPES) for _ in range(nd_o)]
            res = build_exchange_forced(rng, tt, att, dfn, slot)
            if res:
                break
        if not res:
            b.stats["no-base"] += 1
            continue
        board, t = res
        tpiece = board.piece_at(t)
        for kind, vb in variants(board, kinds=("mirror", "flip")):
            vt = transform_square(t, kind)
            vp = vb.piece_at(vt)
            tcol = vp.color
            acol = not tcol
            asked = acol if q == "attack" else tcol
            n = len(vb.attackers(asked, vt))
            tsq = sqn(vt)
            who = CTITLE[asked]
            verb = "attack" if q == "attack" else "defend"
            prompt = (f"{CTITLE[vb.turn]} to move. How many {who} pieces {verb} the {CNAME[tcol]} {PNAME[vp.piece_type]} on {tsq}? Kings count too.")
            noun = "piece" if n <= 1 else "pieces"
            sing = n <= 1  # 'No Black piece attacks', '1 Black piece attacks', '2 Black pieces attack'
            if q == "attack":
                expl = f"{n if n else 'No'} {who} {noun} {verb + 's' if sing else verb} the {PNAME[vp.piece_type]} on {tsq}" + (" (direct attacks only)." if n else ".")
            else:
                expl = (f"{n if n else 'No'} {who} {noun} {verb + 's' if sing else verb} the {PNAME[vp.piece_type]} on {tsq}: "
                        + ("it could recapture there." if n == 1 else "each of them could recapture there." if n else "nothing could recapture there."))
            item = {
                "skill": "SAF.COUNT.D1", "cue": 1, "task": "predict_outcome", "prompt": prompt,
                "answer": {"outcome": str(n), "options": ["0", "1", "2", "3"]},
                "claims": [claim("C1", "attackers", f"{who} pieces attacking {tsq}: {n}.", square=tsq, color=CNAME[asked], count=n)],
                "tags": tags_for(["SAF.COUNT"], 1, 1, fam, ["task.count"]),
                "hints": count_hints(q, tsq, tcol),
                "explain": expl,
            }
            b.add(vb, fam, item, f"count {q}, {kind}", label="count-A")


def build_exchange_forced(rng, tt, att, dfn, king_slot):
    """build_exchange with the king slot decided by the caller."""
    b = new_board()
    t = chess.square(rng.randrange(1, 7), rng.randrange(2, 6))
    put(b, t, tt, chess.BLACK)
    placed = [t]
    att_sqs = []
    for color, types in ((chess.WHITE, att), (chess.BLACK, dfn)):
        for typ in types:
            opts = squares_from_which(b, color, typ, t)
            if not opts:
                return None
            s = rng.choice(opts)
            put(b, s, typ, color)
            placed.append(s)
            if color == chess.WHITE:
                att_sqs.append(s)
    if king_slot:
        color = chess.WHITE if king_slot == "att" else chess.BLACK
        opts = [s for s in chess.SquareSet(chess.BB_KING_ATTACKS[t]) if b.piece_at(s) is None]
        if not opts:
            return None
        s = rng.choice(opts)
        put(b, s, chess.KING, color)
        placed.append(s)
        if color == chess.WHITE:
            att_sqs.append(s)
    for color in (chess.WHITE, chess.BLACK):
        if b.king(color) is not None:
            continue
        for _ in range(200):
            s = random_empty(b, rng)
            if any(chess.square_distance(s, p) < 3 for p in placed):
                continue
            if b.king(not color) is not None and chess.square_distance(s, b.king(not color)) < 3:
                continue
            put(b, s, chess.KING, color)
            placed.append(s)
            break
        else:
            return None
    for color in (chess.WHITE, chess.BLACK):  # reserve pawns beside each king: winning a piece is then never a dead draw
        k = b.king(color)
        cands = [s for s in chess.SquareSet(chess.BB_KING_ATTACKS[k]) if b.piece_at(s) is None and (1 <= chess.square_rank(s) <= 3 if color == chess.WHITE else 4 <= chess.square_rank(s) <= 6)]
        rng.shuffle(cands)
        for s in cands[:rng.choice([1, 1, 2])]:
            put(b, s, chess.PAWN, color)
            placed.append(s)
    b.turn = chess.WHITE
    if not b.is_valid() or not sane(b):
        return None
    if any(b.is_capture(m) and m.to_square != t for m in b.legal_moves):
        return None
    b.turn = chess.BLACK
    bad = any(b.is_capture(m) and m.to_square not in att_sqs for m in b.legal_moves)
    b.turn = chess.WHITE
    if bad:
        return None
    if not is_clean_for_counting(b, [t], allow_king_attackers=bool(king_slot)):
        return None
    na = len(att) + (1 if king_slot == "att" else 0)
    nd = len(dfn) + (1 if king_slot == "def" else 0)
    if len(b.attackers(chess.WHITE, t)) != na or len(b.attackers(chess.BLACK, t)) != nd:
        return None
    return b, t


def transform_square(s, kind):
    return {"orig": s, "mirror": s ^ 7, "flip": s ^ 56, "mirrorflip": s ^ 63}[kind]


def captures_on(board, t):
    return [m for m in board.legal_moves if m.to_square == t and board.is_capture(m)]


def decision_hints(tsq):
    return [f"Before capturing on {tsq}, count: how many of your pieces attack it, and how many enemy pieces defend it?",
            "A defended piece can be taken back. Compare what you win with what you may lose, one capture at a time.",
            "Work out the whole sequence of captures on that square, then ask whether you end up ahead."]


def gen_exchange_case(rng, kind):
    for _ in range(8000):
        tt = rng.choice(TARGET_TYPES)
        na = rng.choice(NUM_WEIGHTS_ATT) if kind != "first" else rng.choice([2, 2, 3])
        nd = rng.choice(NUM_WEIGHTS_DEF) if kind != "first" else rng.choice([1, 1, 2])
        att = [rng.choice(ATT_TYPES) for _ in range(na)]
        dfn = [rng.choice(ATT_TYPES) for _ in range(nd)]
        r = build_exchange_forced(rng, tt, att, dfn, None)
        if not r:
            continue
        board, t = r
        caps = captures_on(board, t)
        gains = {m.uci(): see_gain(board, m) for m in caps}
        if kind == "first":
            if len(caps) >= 2 and all(g != 0 for g in gains.values()) and any(g > 0 for g in gains.values()) and any(g < 0 for g in gains.values()):
                return board, t, None
        else:
            want_yes = kind == "yes"
            cand = [m for m in caps if (gains[m.uci()] >= 1 if want_yes else gains[m.uci()] <= -1)]
            if cand:
                return board, t, rng.choice(cand)
    return None


def emit_part_b(b, res, kind, fam, which):
    board, t, mv = res
    added = []
    for vkind, vb in variants(board, kinds=("mirror", "flip")):
        if vkind not in which:
            continue
        vt = transform_square(t, vkind)
        tp = vb.piece_at(vt)
        mover = not tp.color
        assert vb.turn == mover
        vcaps = captures_on(vb, vt)
        vgains = {m.uci(): see_gain(vb, m) for m in vcaps}
        tsq = sqn(vt)
        na = len(vb.attackers(mover, vt))
        nd = len(vb.attackers(tp.color, vt))
        base_claims = [claim("C1", "attackers", f"{CTITLE[mover]} pieces attacking {tsq}: {na}.", square=tsq, color=CNAME[mover], count=na),
                       claim("C2", "attackers", f"{CTITLE[tp.color]} pieces defending {tsq}: {nd}.", square=tsq, color=CNAME[tp.color], count=nd)]
        facts = f"The {PNAME[tp.piece_type]} on {tsq} is attacked by {na} {CNAME[mover]} piece{'s' if na != 1 else ''} and defended by {nd} {CNAME[tp.color]} piece{'s' if nd != 1 else ''}."
        if kind == "first":
            good = sorted((m for m in vcaps if vgains[m.uci()] > 0), key=lambda x: x.uci())
            bad = sorted((m for m in vcaps if vgains[m.uci()] < 0), key=lambda x: x.uci())
            if not good or not bad or any(vgains[m.uci()] == 0 for m in vcaps):
                b.stats["variant-lost-shape"] += 1
                continue
            claims = list(base_claims)
            for k, m in enumerate(good):
                claims.append(claim(f"C{3 + k}", "material_after_move", f"{vb.san(m)} wins at least {vgains[m.uci()]} point(s) of material.", move=m.uci(), min=vgains[m.uci()]))
            fb = {}
            for k, m in enumerate(bad):
                cid = f"C{3 + len(good) + k}"
                claims.append(claim(cid, "material_after_move", f"{vb.san(m)} loses at least {-vgains[m.uci()]} point(s) of material.", move=m.uci(), max=vgains[m.uci()]))
                fb[m.uci()] = f"Taking with the {PNAME[vb.piece_type_at(m.from_square)]} loses at least {-vgains[m.uci()]} point{'s' if vgains[m.uci()] < -1 else ''}: the enemy takes back on {tsq}."
            gm = good[0]
            expl = (facts + f" Taking with the {PNAME[vb.piece_type_at(gm.from_square)]} comes out at least {vgains[gm.uci()]} point{'s' if vgains[gm.uci()] > 1 else ''} ahead along the best defence;"
                    f" the other capture{'s' if len(bad) > 1 else ''} lose{'' if len(bad) > 1 else 's'} material.")
            item = {
                "skill": "SAF.COUNT.D2", "cue": 3, "task": "find_move",
                "prompt": f"{CTITLE[mover]} to move. Several pieces can capture on {tsq}. Which capture wins material?",
                "answer": {"moves": [m.uci() for m in good]},
                "claims": claims, "feedback_by_move": fb,
                "tags": tags_for(["SAF.COUNT", "FND.CAPTURE"], 1, 3, fam, ["task.capture-choice"]),
                "hints": ["Several of your pieces can capture on the same square. Count what the enemy can take back each time.",
                          "Compare the pieces that can capture: which one risks the least if it is taken back?",
                          "Try each capture in your head: what do you win, what can be recaptured, and what do you lose?"],
                "explain": expl,
            }
            rid = b.add(vb, fam, item, f"capture choice, {vkind}", label="count-B2")
        else:
            m = next((x for x in vcaps if x.from_square == transform_square(mv.from_square, vkind)), None)
            if m is None:
                b.stats["variant-lost-shape"] += 1
                continue
            g = vgains[m.uci()]
            if (kind == "yes" and g < 1) or (kind == "no" and g > -1):
                b.stats["variant-lost-shape"] += 1
                continue
            pn = PNAME[vb.piece_type_at(m.from_square)]
            if kind == "yes":
                cl = claim("C3", "material_after_move", f"{vb.san(m)} wins at least {g} point(s) of material.", move=m.uci(), min=g)
                expl = facts + f" Taking with the {pn} comes out at least {g} point{'s' if g > 1 else ''} ahead along the best defence."
            else:
                cl = claim("C3", "material_after_move", f"{vb.san(m)} loses at least {-g} point(s) of material.", move=m.uci(), max=g)
                expl = facts + f" Taking with the {pn} loses at least {-g} point{'s' if g < -1 else ''} along the best defence."
            item = {
                "skill": "SAF.COUNT.D2", "cue": 3, "task": "predict_outcome",
                "prompt": f"{CTITLE[mover]} to move. Should the {pn} on {sqn(m.from_square)} take the {PNAME[tp.piece_type]} on {tsq}? Predict, then check.",
                "answer": {"outcome": kind, "options": ["yes", "no"]},
                "claims": base_claims + [cl],
                "tags": tags_for(["SAF.COUNT", "FND.CAPTURE"], 1, 3, fam, ["task.take-or-not"]),
                "hints": decision_hints(tsq), "explain": expl,
            }
            rid = b.add(vb, fam, item, f"take-or-not {kind}, {vkind}", label=f"count-B1-{kind}")
        if rid:
            added.append(rid)
    return added


def build_part_b(b, registry):
    rng = b.rng
    specs = ["yes"] * 4 + ["no"] * 4 + ["first"] * 7
    rng.shuffle(specs)
    for bi, kind in enumerate(specs):
        fam = f"FAM-GEN-COUNT-B{bi + 1:02d}"
        done = False
        for attempt in range(60):
            res = gen_exchange_case(rng, kind)
            if not res:
                break
            if emit_part_b(b, res, kind, fam, ("orig",)):  # the original must survive the engine pre-check
                emit_part_b(b, res, kind, fam, ("mirror", "flip"))
                done = True
                break
            b.stats["base-retry"] += 1
        if not done:
            b.stats["no-base"] += 1


def build(registry, pre):
    b = Builder(AREA, MODULE, SEED, registry, pre)
    build_part_a(b, registry)
    build_part_b(b, registry)
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
