"""Family 8: K+Q v K and K+R v K technique (END.MATE-KQ, END.MATE-KR).

find_move   'Find checkmate in one' / 'Checkmate in two: find the first move' on K+Q v K and K+R v K.
            Accepted set = EVERY first move that mates in one (python-chess) or forces mate within two (exhaustive search:
            every Black reply is answered by some mate in one). One `mate_in` claim per accepted move (n=1 or n=2,
            engine depth 16 for n=2).
stalemate traps
            The same format, but the position also contains a tempting move that STALEMATES Black. That wrong move is
            recorded in feedback_by_move with a `tablebase` claim (result for the mover after that move = draw).
            Because a claim is checked against its own item's position only, the word 'stalemate' in the feedback is
            verified by a COMPANION item whose position is the position after the wrong move (classify_position,
            claim game_state = stalemate); the companion shares the trap's family.
Each base has a colour-flipped twin (Black to move, White's lone king). Defender's king starts in the top half of the board.

    python tools/generators/gen_endmate.py        # writes content/items/gen-t0-endmate.json
"""
from __future__ import annotations

import sys as _s, pathlib as _p
_s.path.insert(0, str(_p.Path(__file__).resolve().parent))
import chess

from common import *  # noqa: F401,F403

AREA, MODULE, SEED, FILE = "ENDMATE", "endmate", 20261031, "gen-t0-endmate.json"
P, N, B, R, Q, K = chess.PAWN, chess.KNIGHT, chess.BISHOP, chess.ROOK, chess.QUEEN, chess.KING


def mates_in_1(b):
    out = []
    for m in b.legal_moves:
        b.push(m)
        if b.is_checkmate():
            out.append(m)
        b.pop()
    return sorted(out, key=lambda m: m.uci())


def stalemating_moves(b):
    out = []
    for m in b.legal_moves:
        b.push(m)
        if b.is_stalemate():
            out.append(m)
        b.pop()
    return sorted(out, key=lambda m: m.uci())


def mates_in_2(b):
    """First moves after which every Black reply allows a mate in one (and which are not themselves mate/stalemate)."""
    res = []
    for m in list(b.legal_moves):
        b.push(m)
        if b.is_checkmate() or b.is_stalemate() or b.is_insufficient_material():
            b.pop()
            continue
        ok = True
        for r in list(b.legal_moves):
            b.push(r)
            found = False
            if not b.is_insufficient_material():
                for w in list(b.legal_moves):
                    b.push(w)
                    mate = b.is_checkmate()
                    b.pop()
                    if mate:
                        found = True
                        break
            b.pop()
            if not found:
                ok = False
                break
        b.pop()
        if ok:
            res.append(m)
    return sorted(res, key=lambda m: m.uci())


def sample(rng, piece, bk_rank_min=5):
    b = new_board()
    # defender's king: on the edge or one step from it, top half
    bk = None
    for _ in range(40):
        s = chess.square(rng.randrange(8), rng.randrange(bk_rank_min, 8))
        f, r = chess.square_file(s), chess.square_rank(s)
        if f in (0, 7) or r == 7 or rng.random() < 0.25:
            bk = s
            break
    if bk is None:
        return None
    put(b, bk, K, chess.BLACK)
    wk = random_empty(b, rng)
    if chess.square_distance(wk, bk) <= 1:
        return None
    put(b, wk, K, chess.WHITE)
    put(b, random_empty(b, rng), piece, chess.WHITE)
    b.turn = chess.WHITE
    if not b.is_valid() or b.is_check():
        return None
    return b


def variant_board(base, kind):
    return base.copy(stack=False) if kind == "orig" else colour_flip(base)


NODE = {Q: "END.MATE-KQ", R: "END.MATE-KR"}
PN = {Q: "queen", R: "rook"}

HINT_M1 = ["Look at where the enemy king stands. Which squares can it reach, and which are covered by your pieces?",
           "A checkmate needs a check that leaves the king no square to go to. Your own king helps by covering squares.",
           "Try each check in turn: can the king step away, or capture the checking piece?"]
HINT_M2 = ["There is no mate in one. You need a first move that takes away squares or confines the king.",
           "After your move the enemy king must move. Ask: whatever it does, can you mate next move?",
           "Prefer quiet moves that keep the king boxed in; checks are not always the best first step."]
HINT_TRAP = ["Before you move, ask what the enemy king will be able to do afterwards.",
             "A king that is not attacked and has no legal move is stalemate: the game is drawn. Leave the king a move, or mate it.",
             "Count the squares next to the enemy king after your move: is at least one free, or is the king mated?"]


def emit_m(b, base, kind, fam, piece, depth):
    vb = variant_board(base, kind)
    mates = mates_in_1(vb) if depth == 1 else mates_in_2(vb)
    if not mates or len(mates) > 4:
        b.stats["variant-lost-shape"] += 1
        return None
    if depth == 2 and mates_in_1(vb):
        return None
    sans = [vb.san(m) for m in mates]
    claims = [claim(f"C{i + 1}", "mate_in", f"{vb.san(m)} forces checkmate in {depth}.", move=m.uci(), n=depth) for i, m in enumerate(mates)]
    if depth == 1:
        expl = f"{sans[0]} is checkmate: it gives check and the enemy king has no legal reply." if len(mates) == 1 else f"{join_squares(sans)} are all checkmate: each gives check and leaves the enemy king no legal reply."
        prompt = f"{CTITLE[vb.turn]} to move. Find checkmate in one."
        hints = HINT_M1
        skill = f"{NODE[piece]}.D1"
    else:
        expl = (f"{sans[0]} forces checkmate on the next move whatever the enemy king does." if len(mates) == 1
                else f"{join_squares(sans)} each force checkmate on the next move whatever the enemy king does.")
        prompt = f"{CTITLE[vb.turn]} to move. Checkmate in two: find the first move."
        hints = HINT_M2
        skill = f"{NODE[piece]}.D2"
    item = {"skill": skill, "cue": 1, "task": "find_move", "prompt": prompt, "answer": {"moves": [m.uci() for m in mates]},
            "claims": claims, "hints": hints, "explain": expl,
            "tags": tags_for([NODE[piece]], 1, 1, fam, [f"theme.mateIn{depth}", "theme.endgame", "task.find_move"])}
    return b.add(vb, fam, item, f"{PN[piece]} mate in {depth}", label=f"endmate-{PN[piece]}-m{depth}")


def emit_trap(b, base, kind, fam, piece, depth):
    vb = variant_board(base, kind)
    good = mates_in_1(vb) if depth == 1 else mates_in_2(vb)
    if depth == 2 and mates_in_1(vb):
        return None
    bad = stalemating_moves(vb)
    if not good or len(good) > 3 or not bad:
        b.stats["variant-lost-shape"] += 1
        return None
    bad = bad[:2]
    wrong_sans = [vb.san(m) for m in bad]
    claims = [claim(f"C{i + 1}", "mate_in", f"{vb.san(m)} forces checkmate in {depth}.", move=m.uci(), n=depth) for i, m in enumerate(good)]
    fb = {}
    for j, m in enumerate(bad):
        claims.append(claim(f"C{len(good) + 1 + j}", "tablebase", f"{vb.san(m)} only draws (tablebase).", move=m.uci(), result="draw"))
        fb[m.uci()] = f"{vb.san(m)} leaves the enemy king with no legal move and no check: stalemate, a draw (tablebase: draw)."
    sans = [vb.san(m) for m in good]
    prompt = (f"{CTITLE[vb.turn]} to move. Find checkmate in one." if depth == 1 else f"{CTITLE[vb.turn]} to move. Checkmate in two: find the first move.")
    expl = ((f"{sans[0]} is checkmate. " if depth == 1 else f"{sans[0]} forces checkmate next move. ")
            + f"Careful: {join_squares(wrong_sans)} would stalemate the enemy king and only draw (tablebase: draw).")
    item = {"skill": f"{NODE[piece]}.D2", "cue": 3, "task": "find_move", "prompt": prompt, "answer": {"moves": [m.uci() for m in good]},
            "claims": claims, "feedback_by_move": fb, "hints": HINT_TRAP, "explain": expl,
            "tags": tags_for([NODE[piece], "FND.STALEMATE"], 1, 3, fam, ["theme.stalemate-trap", f"theme.mateIn{depth}", "theme.endgame", "task.find_move"])}
    rid = b.add(vb, fam, item, f"{PN[piece]} stalemate trap (mate in {depth}), {kind}", label=f"endmate-{PN[piece]}-trap{depth}")
    if not rid:
        return None
    # companion: the position after the first listed wrong move, classified as stalemate
    for m in bad[:1]:
        after = vb.copy(stack=False)
        after.push(m)
        item2 = {"skill": "FND.STALEMATE.D1", "cue": 1, "task": "classify_position",
                 "prompt": f"{CTITLE[after.turn]} to move and has no legal move. Is this checkmate or stalemate?",
                 "answer": {"class": "stalemate", "options": ["checkmate", "stalemate"]},
                 "claims": [claim("C1", "game_state", "The side to move is stalemated.", state="stalemate")],
                 "hints": ["Is the king attacked right now?",
                           "A king that is attacked with no escape is checkmated. A king that is not attacked but cannot move (and nothing else can move) is stalemated.",
                           "Look at every square next to the king and at the lines of the enemy pieces."],
                 "explain": "The king is not attacked but the side to move has no legal move: stalemate, which is a draw.",
                 "tags": tags_for(["FND.STALEMATE", NODE[piece]], 0, 1, fam, ["state.stalemate", "task.classify", "theme.stalemate-trap", "companion.trap"])}
        b.add(after, fam, item2, f"companion: after {m.uci()} in the trap {rid}", label="endmate-companion")
    return rid


def draw_base(rng, piece, want, tries=200000):
    for _ in range(tries):
        b = sample(rng, piece)
        if b is None:
            continue
        m1 = mates_in_1(b)
        if want == "m1":
            if 1 <= len(m1) <= 3:
                return b
        elif want == "m2":
            if not m1:
                m2 = mates_in_2(b)
                if 1 <= len(m2) <= 4:
                    return b
        elif want == "trap1":
            if 1 <= len(m1) <= 3 and stalemating_moves(b):
                return b
        elif want == "trap2":
            if not m1 and stalemating_moves(b):
                m2 = mates_in_2(b)
                if 1 <= len(m2) <= 3:
                    return b
    return None


def build(registry, pre):
    b = Builder(AREA, MODULE, SEED, registry, pre)
    rng = b.rng
    plan = [(Q, "m1", 5), (Q, "m2", 5), (Q, "trap1", 3), (Q, "trap2", 3), (R, "m1", 4), (R, "m2", 4), (R, "trap1", 2), (R, "trap2", 3)]
    n = 0
    for piece, want, count in plan:
        for _ in range(count):
            n += 1
            fam = f"FAM-GEN-ENDMATE-{n:02d}"
            for attempt in range(30):
                base = draw_base(rng, piece, want)
                if base is None:
                    break
                depth = 1 if want in ("m1", "trap1") else 2
                emit = emit_m if want in ("m1", "m2") else emit_trap
                if emit(b, base, "orig", fam, piece, depth):
                    emit(b, base, "flip", fam, piece, depth)
                    break
            else:
                b.stats[f"no-base-{PN[piece]}-{want}"] += 1
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
