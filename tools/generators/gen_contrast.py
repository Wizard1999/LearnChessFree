"""Family 6: free piece vs defended piece, in contrast triples (FND.CAPTURE / SAF.COUNT).

Each triple is one teaching situation shown three ways (one contrast_group, one family, three positions):
  working     the enemy piece is undefended: taking it wins material
  failing     ONE defender is added: taking it now loses material (the attacker is worth more than the target)
  irrelevant  a nearby enemy piece is added that does NOT defend the target: taking still wins material
All three are predict_outcome ('Should X take Y? yes/no', cue 2 = themed set, the contrast lab) with claims
  `attackers` (how many defenders there are: 0 / 1 / 0), `attackers` (our attackers: 1) and `material_after_move`
  (min = swap-off gain for yes, max = swap-off gain for no).
A triple is kept only if all three items pass the engine pre-check. Half of the triples are colour-flipped.

    python tools/generators/gen_contrast.py       # writes content/items/gen-t0-contrast.json
"""
from __future__ import annotations

import sys as _s, pathlib as _p
_s.path.insert(0, str(_p.Path(__file__).resolve().parent))
import chess

from common import *  # noqa: F401,F403
from gen_count import build_exchange_forced

AREA, MODULE, SEED, FILE = "CTRST", "contrast", 20261029, "gen-t0-contrast.json"
P, N, B, R, Q, K = chess.PAWN, chess.KNIGHT, chess.BISHOP, chess.ROOK, chess.QUEEN, chess.KING


def black_has_capture(b):
    c = b.copy(stack=False)
    c.turn = chess.BLACK
    return any(c.is_capture(m) for m in c.legal_moves)


def add_defender(rng, board, t, D):
    opts = squares_from_which(board, chess.BLACK, D, t)
    rng.shuffle(opts)
    for s in opts:
        n = board.copy(stack=False)
        put(n, s, D, chess.BLACK)
        n.turn = chess.WHITE
        if not n.is_valid() or not is_clean_for_counting(n, [t]):
            continue
        if black_has_capture(n) or len(n.attackers(chess.BLACK, t)) != 1:
            continue
        if any(n.is_capture(m) and m.to_square != t for m in n.legal_moves):
            continue
        return n
    return None


def add_decoy(rng, board, t, D, from_sq):
    cands = [s for s in chess.SQUARES if board.piece_at(s) is None and 1 <= chess.square_distance(s, t) <= 2 and not (D == P and chess.square_rank(s) in (0, 7))]
    rng.shuffle(cands)
    for s in cands:
        n = board.copy(stack=False)
        put(n, s, D, chess.BLACK)
        n.turn = chess.WHITE
        if not n.is_valid() or not is_clean_for_counting(n, [t]):
            continue
        if n.attackers(chess.BLACK, t) or black_has_capture(n):
            continue
        if chess.Move(from_sq, t) not in n.legal_moves:
            continue
        if any(n.is_capture(m) and m.to_square != t for m in n.legal_moves):
            continue
        return n
    return None


def to_variant(board, flip):
    return colour_flip(board) if flip else board


def mk_item(vb, t_sq, from_sq, role, k, fam, cg):
    """Build the item dict for one role on board vb (already flipped if needed)."""
    tp = vb.piece_at(t_sq)
    mover = vb.turn
    foe = tp.color
    mv = chess.Move(from_sq, t_sq)
    g = see_gain(vb, mv)
    tsq = sqn(t_sq)
    attacker = PNAME[vb.piece_type_at(from_sq)]
    target = PNAME[tp.piece_type]
    nd = len(vb.attackers(foe, t_sq))
    claims = [claim("C1", "attackers", f"{CTITLE[foe]} pieces defending {tsq}: {nd}.", square=tsq, color=CNAME[foe], count=nd),
              claim("C2", "attackers", f"{CTITLE[mover]} pieces attacking {tsq}: 1.", square=tsq, color=CNAME[mover], count=1)]
    if role == "failing":
        claims.append(claim("C3", "material_after_move", f"{vb.san(mv)} loses at least {-g} point(s) of material.", move=mv.uci(), max=g))
        outcome = "no"
        expl = (f"The {target} on {tsq} is defended once, and the {attacker} is worth more than the {target}: after the {attacker} takes, it is taken back, "
                f"and {CNAME[mover]} ends at least {-g} points down along the best defence.")
        skill = "FND.CAPTURE.D2"
    else:
        claims.append(claim("C3", "material_after_move", f"{vb.san(mv)} wins at least {g} point(s) of material.", move=mv.uci(), min=g))
        outcome = "yes"
        if role == "working":
            expl = f"No {CNAME[foe]} piece defends the {target} on {tsq}, so taking it with the {attacker} wins at least {g} point{'s' if g > 1 else ''}."
            skill = "FND.CAPTURE.D1"
        else:
            expl = (f"The nearby {CNAME[foe]} piece does not defend the {target} on {tsq}: no {CNAME[foe]} piece does. "
                    f"Taking with the {attacker} still wins at least {g} point{'s' if g > 1 else ''}.")
            skill = "FND.CAPTURE.D2"
    return {
        "skill": skill, "cue": 2, "task": "predict_outcome",
        "prompt": f"{CTITLE[mover]} to move. Should the {attacker} on {sqn(from_sq)} take the {target} on {tsq}? Predict, then check.",
        "answer": {"outcome": outcome, "options": ["yes", "no"]},
        "claims": claims, "contrast_group": cg,
        "tags": tags_for(["FND.CAPTURE", "SAF.COUNT"], 1, 2, fam, ["task.take-or-not", f"contrast.{role}", "theme.free-vs-defended"]),
        "hints": [f"Count first: how many enemy pieces defend the piece on {tsq}?",
                  f"A nearby piece only defends {tsq} if it could capture on {tsq} with its own kind of move. Check each one.",
                  "If the piece is defended, compare the value of what you take with the value of the piece you might lose."],
        "explain": expl,
    }, g


def build(registry, pre):
    b = Builder(AREA, MODULE, SEED, registry, pre)
    rng = b.rng
    used = {}
    tri = 0
    attempts = 0
    while tri < 20 and attempts < 30000:
        attempts += 1
        X = rng.choice([N, B, R, R, Q, Q])
        Y = rng.choice([P, P, N, B, R])
        D = rng.choice([P, P, N, B, R])
        if SEE_VAL[X] <= SEE_VAL[Y] + 1:     # the attacker must be clearly worth more than the target
            continue
        if used.get((X, Y), 0) >= 3:
            continue
        r = build_exchange_forced(rng, Y, [X], [], None)
        if not r:
            continue
        w_board, t = r
        from_sq = next(iter(w_board.attackers(chess.WHITE, t)))
        f_board = add_defender(rng, w_board, t, D)
        if f_board is None:
            continue
        i_board = add_decoy(rng, w_board, t, D, from_sq)
        if i_board is None:
            continue
        flip = tri % 2 == 1
        fam = f"FAM-GEN-CTRST-{tri + 1:02d}"
        cg = f"CG-GEN-FD-{tri + 1:02d}"
        parts = []
        okay = True
        for role, bd in (("working", w_board), ("failing", f_board), ("irrelevant", i_board)):
            vb = to_variant(bd, flip)
            ts = t ^ 56 if flip else t
            fs = from_sq ^ 56 if flip else from_sq
            item, g = mk_item(vb, ts, fs, role, tri, fam, cg)
            if (role == "failing" and g > -2) or (role != "failing" and g < 1):
                okay = False
                break
            if registry.has(vb.fen()) or not vb.is_valid():
                okay = False
                break
            parts.append((vb, item, role))
        if not okay:
            continue
        # transactional: all three must pass the engine pre-check
        if not all(pre.check("contrast-" + role, {"fen": vb.fen()}, it["claims"]) for vb, it, role in parts):
            b.stats["triple-rejected"] += 1
            continue
        for vb, it, role in parts:
            b.add(vb, fam, it, f"contrast triple {tri + 1} ({role})", precheck=False)
        used[(X, Y)] = used.get((X, Y), 0) + 1
        tri += 1
    b.stats["triples"] = tri
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
