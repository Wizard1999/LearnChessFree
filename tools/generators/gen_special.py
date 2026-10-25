"""Family 7: special rules - castling, en passant, promotion (FND.CASTLE, FND.ENPASSANT, FND.PROMOTE).

Three output files from one module (areas CASTLE, EP, PROMO). Every item is a rules question whose claim is legal_move /
illegal_move / legal_destinations / mate_in / tablebase, so it is verified exactly.

CASTLE  find_move 'castle kingside/queenside' (legal), find_move 'only one side is possible', and predict_outcome
        'Can X castle?' for: king passes through an attacked square, king in check, king lands on an attacked square,
        right lost (the FEN carries no right although king and rook stand on their squares), a piece in the way, and the
        surprising LEGAL cases (rook attacked; b1 attacked on the queen side). The key square of each lesson is also
        pinned down with an `attackers` or `game_state` claim so that the explanation is verified, not merely asserted.
EP      find_move 'capture en passant', select_squares (the pawn's destinations include the en passant square),
        predict_outcome for 'yes' and for 'no' (the pawn has been standing next to ours; no double step just happened).
PROMO   queen promotion, capture-promotion (straight push blocked), knight under-promotion that is the only mate,
        stalemate trap (promoting to a queen stalemates, a rook still wins: tablebase claims), 'can it promote now?'.
Each base position is a family: original + colour-flip (castling) or original + mirror + colour-flip (the rest).

    python tools/generators/gen_special.py        # writes gen-t0-castle.json, gen-t0-ep.json, gen-t0-promo.json
"""
from __future__ import annotations

import sys as _s, pathlib as _p
_s.path.insert(0, str(_p.Path(__file__).resolve().parent))
import chess

from common import *  # noqa: F401,F403

MODULE, SEED = "special", 20261030
P, N, B, R, Q, K = chess.PAWN, chess.KNIGHT, chess.BISHOP, chess.ROOK, chess.QUEEN, chess.KING
E1, F1, G1, H1, D1, C1, B1, A1 = chess.E1, chess.F1, chess.G1, chess.H1, chess.D1, chess.C1, chess.B1, chess.A1


# ================================================================================================================
# CASTLING
# ================================================================================================================
def c_path(side):
    return [F1, G1] if side == "K" else [D1, C1]


def c_between(side):
    return [F1, G1] if side == "K" else [B1, C1, D1]


def c_rook(side):
    return H1 if side == "K" else A1


def c_target(side):
    return G1 if side == "K" else C1


def attacked_by_black(b, s):
    return bool(b.attackers_mask(chess.BLACK, s))


def base_white(rng, rights="KQ", rooks="KQ"):
    b = new_board()
    put(b, E1, K, chess.WHITE)
    cr = 0
    if "K" in rooks:
        put(b, H1, R, chess.WHITE)
    if "Q" in rooks:
        put(b, A1, R, chess.WHITE)
    if "K" in rights:
        cr |= chess.BB_H1
    if "Q" in rights:
        cr |= chess.BB_A1
    b.castling_rights = cr
    for f in rng.sample(range(8), rng.randrange(2, 6)):
        if b.piece_at(chess.square(f, 1)) is None:
            put(b, chess.square(f, 1), P, chess.WHITE)
    bk = chess.square(rng.randrange(8), rng.randrange(5, 8))
    put(b, bk, K, chess.BLACK)
    b.turn = chess.WHITE
    return b


def place_attacker(rng, b, target, forbid, pts=(R, B, Q, N)):
    """Black piece attacking `target` and none of `forbid`."""
    for _ in range(60):
        pt = rng.choice(pts)
        opts = [s for s in squares_from_which(b, chess.BLACK, pt, target)
                if chess.square_rank(s) >= 2 and chess.square_distance(s, b.king(chess.BLACK)) >= 1]
        rng.shuffle(opts)
        for s in opts:
            put(b, s, pt, chess.BLACK)
            if not any(attacked_by_black(b, f) for f in forbid) and attacked_by_black(b, target):
                return s
            b.remove_piece_at(s)
    return None


def make_castle_case(rng, case, side):
    """Returns (board, meta) with White to move, or None."""
    other = "Q" if side == "K" else "K"
    rights, rooks = "KQ", "KQ"
    if case == "rook_moved":
        rights = other  # the right on `side` is gone although the rook stands on its square
    b = base_white(rng, rights, rooks)
    path, btw, tgt = c_path(side), c_between(side), c_target(side)
    if case == "through":
        if place_attacker(rng, b, path[0], [path[1], E1]) is None:
            return None
    elif case == "into":
        if place_attacker(rng, b, path[1], [path[0], E1]) is None:
            return None
    elif case == "out_of_check":
        if place_attacker(rng, b, E1, [], pts=(R, B, Q)) is None:
            return None
    elif case == "blocked":
        s = rng.choice(btw)
        put(b, s, rng.choice([N, B] if s != D1 else [Q, N, B]), chess.WHITE)
    elif case == "rook_attacked":
        if place_attacker(rng, b, c_rook(side), btw + [E1], pts=(R, B, Q)) is None:
            return None
    elif case == "b1_attacked":
        if side != "Q" or place_attacker(rng, b, B1, [C1, D1, E1, A1], pts=(R, B, Q)) is None:
            return None
    elif case in ("legal_both", "rook_moved"):
        pass
    elif case.startswith("one_side"):
        # castling on `side` is legal, on `other` it is not (blocked or through)
        o_btw = c_between(other)
        o_path = c_path(other)
        if case == "one_side_blocked":
            s = rng.choice(o_btw)
            put(b, s, rng.choice([N, B] if s != D1 else [Q, N, B]), chess.WHITE)
        else:
            if place_attacker(rng, b, o_path[0], [o_path[1], E1] + c_path(side) + [c_rook(side)]) is None:
                return None
    else:
        raise ValueError(case)
    b.turn = chess.WHITE
    if not b.is_valid() or any_pinned(b):
        return None
    ck = chess.Move(E1, tgt)
    in_check = b.is_check()
    legal = ck in b.legal_moves
    # does the board show exactly the intended reason?
    if case in ("legal_both", "rook_attacked", "b1_attacked"):
        if in_check or not legal:
            return None
    elif case == "through":
        if in_check or legal or not attacked_by_black(b, path[0]) or attacked_by_black(b, path[1]):
            return None
    elif case == "into":
        if in_check or legal or not attacked_by_black(b, path[1]) or attacked_by_black(b, path[0]):
            return None
    elif case == "out_of_check":
        if not in_check or legal or any(b.piece_at(s) for s in btw):
            return None
    elif case == "blocked":
        if in_check or legal or all(b.piece_at(s) is None for s in btw):
            return None
    elif case == "rook_moved":
        if in_check or legal or any(b.piece_at(s) for s in btw) or any(attacked_by_black(b, s) for s in path + [E1]):
            return None
    elif case.startswith("one_side"):
        if in_check or not legal or chess.Move(E1, c_target(other)) in b.legal_moves:
            return None
    return b, dict(case=case, side=side)


def castle_hints(case):
    if case in ("legal_both", "one_side_blocked", "one_side_through"):
        return ["Castling moves the king two squares towards a rook, and the rook jumps to the other side of the king.",
                "The king and that rook must not have moved, and no piece may stand between them.",
                "The king may not be in check, pass over an attacked square, or land on one."]
    return ["Check the conditions one at a time: have the king and the rook moved (the castling rights), is anything between them?",
            "Is the king in check now? Is the square it passes over attacked? Is the square it lands on attacked?",
            "Only the squares the KING uses matter for attacks. The rook and, on the queen side, the square next to the rook can be attacked."]


def emit_castle(b, board, meta, fam, flipped):
    case, side = meta["case"], meta["side"]
    col = board.turn
    shift = 56 if flipped else 0
    rank1 = 7 if col == chess.BLACK else 0
    def sq(s):
        return s ^ shift
    ks = "kingside" if side == "K" else "queenside"
    mv = chess.Move(sq(E1), sq(c_target(side)))
    legal = mv in board.legal_moves
    claims, tags_extra = [], []
    node = "FND.CASTLE"
    key_sq = None
    if case in ("legal_both",):
        item = {"skill": "FND.CASTLE.D1", "cue": 1, "task": "find_move",
                "prompt": f"{CTITLE[col]} to move. Castle {ks}.", "answer": {"moves": [mv.uci()]},
                "claims": [claim("C1", "legal_move", f"{CTITLE[col]} may castle {ks}.", move=mv.uci())],
                "explain": f"The king moves two squares towards the {'h' if side == 'K' else 'a'}-file rook and the rook goes to the other side of it. Nothing is in the way and no square the king uses is attacked, so castling {ks} is legal."}
    elif case.startswith("one_side"):
        oth = "Q" if side == "K" else "K"
        omv = chess.Move(sq(E1), sq(c_target(oth)))
        item = {"skill": "FND.CASTLE.D1", "cue": 1, "task": "find_move",
                "prompt": f"{CTITLE[col]} to move. Castle. Only one side is possible here: find it.", "answer": {"moves": [mv.uci()]},
                "claims": [claim("C1", "legal_move", f"{CTITLE[col]} may castle {ks}.", move=mv.uci()),
                           claim("C2", "illegal_move", f"{CTITLE[col]} may not castle on the other side.", move=omv.uci())],
                "explain": f"Castling {ks} is legal. On the other side something stops it (a piece in the way or an attacked square the king would cross)."}
    else:
        yes = legal
        extra = ""
        if case == "rook_moved":
            rs = "h" if side == "K" else "a"
            extra = f" {CTITLE[col]}'s {rs}-file rook moved earlier in the game and has come back."
        item = {"skill": "FND.CASTLE.D2", "cue": 3, "task": "predict_outcome",
                "prompt": f"{CTITLE[col]} to move.{extra} Can {CNAME[col]} castle {ks} now? Predict, then check.",
                "answer": {"outcome": "yes" if yes else "no", "options": ["yes", "no"]},
                "claims": [claim("C1", "legal_move" if yes else "illegal_move", f"Castling {ks} is {'legal' if yes else 'illegal'}.", move=mv.uci())]}
        path = [sq(x) for x in c_path(side)]
        if case == "through":
            sqn1 = sqn(path[0])
            item["claims"].append(claim("C2", "attackers", f"{sqn1} is attacked by one {CNAME[not col]} piece.", square=sqn1, color=CNAME[not col], count=len(board.attackers(not col, path[0]))))
            item["explain"] = f"No. The king would pass over {sqn1}, and {CNAME[not col]} attacks that square, so castling {ks} is illegal."
        elif case == "into":
            sqn1 = sqn(path[1])
            item["claims"].append(claim("C2", "attackers", f"{sqn1} is attacked by {CNAME[not col]}.", square=sqn1, color=CNAME[not col], count=len(board.attackers(not col, path[1]))))
            item["explain"] = f"No. The king would land on {sqn1}, and {CNAME[not col]} attacks that square, so castling {ks} is illegal."
        elif case == "out_of_check":
            item["claims"].append(claim("C2", "game_state", "The king to move is in check.", state="check"))
            item["explain"] = "No. The king is in check, and a king in check may not castle."
        elif case == "blocked":
            item["explain"] = f"No. A piece stands between the king and the rook, so castling {ks} is illegal."
        elif case == "rook_moved":
            item["explain"] = f"No. A rook that has moved loses the right to castle on its side for good, even if it returns. The position has no castling right {ks} for {CNAME[col]}."
        elif case == "rook_attacked":
            rs = sq(c_rook(side))
            item["claims"].append(claim("C2", "attackers", f"The rook on {sqn(rs)} is attacked.", square=sqn(rs), color=CNAME[not col], count=len(board.attackers(not col, rs))))
            item["explain"] = f"Yes. The rook on {sqn(rs)} is attacked, but only the squares the KING uses matter, and none of them is attacked. Castling {ks} is legal."
        elif case == "b1_attacked":
            bs = sq(B1)
            item["claims"].append(claim("C2", "attackers", f"{sqn(bs)} is attacked.", square=sqn(bs), color=CNAME[not col], count=len(board.attackers(not col, bs))))
            item["explain"] = f"Yes. {sqn(bs)} is attacked, but the king does not cross it (it only needs to be empty). Castling {ks} is legal."
    item["hints"] = castle_hints(case)
    cue = item["cue"]
    item["tags"] = tags_for(["FND.CASTLE"], 0, cue, fam, [f"castle.{case}", "task." + item["task"]])
    return b.add(board, fam, item, f"castling {case} {side}", label=f"castle-{case}")


def build_castle(registry, pre):
    b = Builder("CASTLE", MODULE, SEED, registry, pre)
    rng = b.rng
    plan = [("legal_both", "K"), ("legal_both", "Q"), ("one_side_blocked", "K"), ("one_side_through", "Q"), ("through", "K"), ("through", "Q"),
            ("out_of_check", "K"), ("out_of_check", "Q"), ("into", "K"), ("rook_moved", "K"), ("rook_moved", "Q"), ("blocked", "Q"),
            ("rook_attacked", "K"), ("b1_attacked", "Q"), ("rook_attacked", "Q"), ("blocked", "K")]
    for i, (case, side) in enumerate(plan):
        fam = f"FAM-GEN-CASTLE-{i + 1:02d}"
        for _ in range(500):
            res = make_castle_case(rng, case, side)
            if res is None:
                continue
            bd, meta = res
            if emit_castle(b, bd, meta, fam, False):
                fl = colour_flip(bd)
                emit_castle(b, fl, meta, fam, True)
                break
        else:
            b.stats["no-base"] += 1
    return {"gen-t0-castle.json": b}


# ================================================================================================================
# EN PASSANT
# ================================================================================================================
def make_ep_case(rng, set_ep):
    b = new_board()
    f = rng.randrange(8)
    g = f + rng.choice([-1, 1])
    if not 0 <= g <= 7:
        return None
    put(b, chess.square(f, 4), P, chess.WHITE)
    put(b, chess.square(g, 4), P, chess.BLACK)
    if set_ep:
        b.ep_square = chess.square(g, 5)
    for color in (chess.WHITE, chess.BLACK):
        for _ in range(60):
            s = random_empty(b, rng)
            if b.king(not color) is not None and chess.square_distance(s, b.king(not color)) <= 2:
                continue
            if set_ep and s in (chess.square(g, 5), chess.square(g, 6)):
                continue
            put(b, s, K, color)
            if b.attackers_mask(not color, s):
                b.remove_piece_at(s)
                continue
            break
        else:
            return None
    for _ in range(rng.randrange(1, 4)):
        pt = rng.choice([P, P, N, B, R])
        s = random_empty(b, rng, ranks=range(1, 7) if pt == P else range(8))
        if set_ep and s in (chess.square(g, 5), chess.square(g, 6)):
            continue
        put(b, s, pt, rng.choice([chess.WHITE, chess.BLACK]))
    b.turn = chess.WHITE
    if not b.is_valid() or b.is_check() or any_pinned(b):
        return None
    ep_move = chess.Move(chess.square(f, 4), chess.square(g, 5))
    has = ep_move in b.legal_moves
    if set_ep and not (b.has_legal_en_passant() and has):
        return None
    if not set_ep and has:
        return None
    return b, f, g


def ep_last_move_text(board):
    """'Black has just played d7-d5' derived from the en passant square in the FEN."""
    e = board.ep_square
    f = chess.square_file(e)
    mover_col = not board.turn  # the side that just moved
    if mover_col == chess.BLACK:
        return f"Black has just played {chess.FILE_NAMES[f]}7-{chess.FILE_NAMES[f]}5."
    return f"White has just played {chess.FILE_NAMES[f]}2-{chess.FILE_NAMES[f]}4."


EP_HINTS_CAPTURE = ["En passant is a pawn capture that is only available on the very next move after an enemy pawn moved two squares forward.",
                    "The capturing pawn must stand on the same rank as the pawn that just moved, directly beside it.",
                    "The capturing pawn moves diagonally to the square the enemy pawn skipped over, and the enemy pawn is removed."]
EP_HINTS_NO = ["En passant is only possible right after an enemy pawn has just moved two squares forward past your pawn.",
               "Ask yourself: did the pawn beside yours arrive there with a two-square move on the previous turn?",
               "If it has been standing there, or got there in any other way, the chance is gone."]


def emit_ep(b, board, kind, fam, wp_sq, ep_to):
    col = board.turn
    f_from = sqn(wp_sq)
    ep_name = sqn(ep_to)
    mv = chess.Move(wp_sq, ep_to)
    node = "FND.ENPASSANT"
    if kind == "capture":
        text = ep_last_move_text(board)
        item = {"skill": "FND.ENPASSANT.D1", "cue": 1, "task": "find_move",
                "prompt": f"{CTITLE[col]} to move. {text} Capture en passant.", "answer": {"moves": [mv.uci()]},
                "claims": [claim("C1", "legal_move", f"The en passant capture {f_from}-{ep_name} is legal.", move=mv.uci())],
                "hints": EP_HINTS_CAPTURE,
                "explain": f"The pawn on {f_from} captures en passant by moving to {ep_name}, the square the enemy pawn passed over; the enemy pawn is removed from the board."}
        cue = 1
    elif kind == "select":
        dests = sorted(m.to_square for m in board.legal_moves if m.from_square == wp_sq)
        names = [sqn(d) for d in dests]
        text = ep_last_move_text(board)
        item = {"skill": "FND.ENPASSANT.D2", "cue": 3, "task": "select_squares",
                "prompt": f"{CTITLE[col]} to move. {text} Tap every square the pawn on {f_from} can move to.",
                "answer": {"from": f_from, "squares": names},
                "claims": [claim("C1", "legal_destinations", f"The pawn on {f_from} can legally move to exactly these squares.", **{"from": f_from, "to": names})],
                "hints": ["List the pawn's usual moves first: straight ahead, and diagonal captures of pieces that are there.",
                          "Then ask whether the last move gives it one more capture.",
                          "A capture en passant lands on the empty square the enemy pawn passed over."],
                "explain": f"The pawn on {f_from} can reach {join_squares(sorted(names))}. {ep_name} is the en passant square: it is reachable because of the enemy pawn's two-square move just now."}
        cue = 3
    elif kind == "yes":
        text = ep_last_move_text(board)
        item = {"skill": "FND.ENPASSANT.D2", "cue": 3, "task": "predict_outcome",
                "prompt": f"{CTITLE[col]} to move. {text} Can {CNAME[col]} capture the pawn en passant? Predict, then check.",
                "answer": {"outcome": "yes", "options": ["yes", "no"]},
                "claims": [claim("C1", "legal_move", "The en passant capture is legal.", move=mv.uci())],
                "hints": EP_HINTS_NO,
                "explain": f"Yes. The enemy pawn has just moved two squares past the pawn on {f_from}, so {f_from}x{ep_name} en passant is legal."}
        cue = 3
    else:  # no
        opp = "Black" if col == chess.WHITE else "White"
        fl = chess.FILE_NAMES[chess.square_file(ep_to)]
        item = {"skill": "FND.ENPASSANT.D2", "cue": 3, "task": "predict_outcome",
                "prompt": f"{CTITLE[col]} to move. {opp}'s pawn on {fl}{'5' if col == chess.WHITE else '4'} has been standing beside {CNAME[col]}'s pawn for several moves; {opp}'s last move was elsewhere. Can {CNAME[col]} capture it en passant? Predict, then check.",
                "answer": {"outcome": "no", "options": ["yes", "no"]},
                "claims": [claim("C1", "illegal_move", "The en passant capture is not available.", move=mv.uci())],
                "hints": EP_HINTS_NO,
                "explain": "No. En passant is only possible on the move right after the enemy pawn made its two-square move. That chance has passed."}
        cue = 3
    item["tags"] = tags_for([node], 0, cue, fam, [f"ep.{kind}", "task." + item["task"]])
    return b.add(board, fam, item, f"en passant {kind}", label=f"ep-{kind}")


def build_ep(registry, pre):
    b = Builder("EP", MODULE, SEED + 1, registry, pre)
    rng = b.rng
    plan = ["capture", "capture", "select", "select", "yes", "no", "no"]
    for i, kind in enumerate(plan):
        fam = f"FAM-GEN-EP-{i + 1:02d}"
        for _ in range(500):
            res = make_ep_case(rng, set_ep=(kind != "no"))
            if res is None:
                continue
            bd, f, g = res
            wp, to = chess.square(f, 4), chess.square(g, 5)
            if kind == "select" and not [m for m in bd.legal_moves if m.from_square == wp and m.to_square != to]:
                pass
            if emit_ep(b, bd, kind, fam, wp, to):
                emit_ep(b, mirror_files(bd), kind, fam, chess.square(7 - f, 4), chess.square(7 - g, 5))
                fb = colour_flip(bd)
                emit_ep(b, fb, kind, fam, wp ^ 56, to ^ 56)
                break
        else:
            b.stats["no-base"] += 1
    return {"gen-t0-ep.json": b}


# ================================================================================================================
# PROMOTION
# ================================================================================================================
PNAMES = {Q: "queen", R: "rook", B: "bishop", N: "knight"}


def promo_base(rng, kind):
    b = new_board()
    f = rng.randrange(8)
    ps = chess.square(f, 6)
    put(b, ps, P, chess.WHITE)
    ahead = chess.square(f, 7)
    if kind == "queen":
        pass
    elif kind == "capture":
        put(b, ahead, rng.choice([R, N, B]), chess.BLACK)
        caps = [chess.square(f + d, 7) for d in (-1, 1) if 0 <= f + d <= 7]
        rng.shuffle(caps)
        for c in caps[: rng.choice([1, 1, 2])]:
            put(b, c, rng.choice([R, N, B, Q]), chess.BLACK)
    elif kind == "blocked_no":
        put(b, ahead, rng.choice([R, N, B, P if False else N]), chess.BLACK)
    elif kind == "six":
        b.remove_piece_at(ps)
        put(b, chess.square(f, 5), P, chess.WHITE)
    for color in (chess.WHITE, chess.BLACK):
        for _ in range(80):
            s = random_empty(b, rng)
            if b.king(not color) is not None and chess.square_distance(s, b.king(not color)) <= 2:
                continue
            if color == chess.BLACK and s == ahead:
                continue
            put(b, s, K, color)
            if b.attackers_mask(not color, s):
                b.remove_piece_at(s)
                continue
            break
        else:
            return None
    for _ in range(rng.randrange(0, 3)):
        pt = rng.choice([P, N, B, R])
        s = random_empty(b, rng, ranks=range(1, 6) if pt == P else range(1, 7))
        put(b, s, pt, rng.choice([chess.WHITE, chess.BLACK]))
    b.turn = chess.WHITE
    if not b.is_valid() or b.is_check() or any_pinned(b):
        return None
    return b, f


def promo_moves(board, from_sq):
    return [m for m in board.legal_moves if m.from_square == from_sq and m.promotion]


def after_state(board, mv):
    c = board.copy(stack=False)
    c.push(mv)
    return game_state(c)


def emit_promo_queen(b, board, fam, pawn_sq, kind):
    col = board.turn
    pm = [m for m in promo_moves(board, pawn_sq) if m.promotion == Q]
    if not pm or len(pm) != 1:
        return None
    mv = pm[0]
    if after_state(board, mv) == "stalemate":
        return None
    item = {"skill": "FND.PROMOTE.D1", "cue": 1, "task": "find_move",
            "prompt": f"{CTITLE[col]} to move. Push the pawn to the last rank and promote it to a queen.", "answer": {"moves": [mv.uci()]},
            "claims": [claim("C1", "legal_move", "Promoting to a queen is legal.", move=mv.uci())],
            "hints": ["A pawn that reaches the far rank must change into another piece.",
                      "It may become a queen, rook, bishop or knight. It moves straight ahead onto an empty square.",
                      "Move the pawn one square forward to the last rank, then choose the piece."],
            "explain": f"The pawn moves to {sqn(mv.to_square)} and becomes a queen, the strongest piece.",
            "tags": tags_for(["FND.PROMOTE"], 0, 1, fam, ["promo.queen", "task.find_move"])}
    return b.add(board, fam, item, "promotion to queen", label="promo-queen")


def emit_promo_capture(b, board, fam, pawn_sq):
    col = board.turn
    qs = [m for m in promo_moves(board, pawn_sq) if m.promotion == Q and board.is_capture(m)]
    straight = chess.Move(pawn_sq, pawn_sq + 8, promotion=Q)
    if not qs or straight in board.legal_moves:
        return None
    if any(after_state(board, m) == "stalemate" for m in qs):
        return None
    qs.sort(key=lambda m: m.uci())
    item = {"skill": "FND.PROMOTE.D1", "cue": 1, "task": "find_move",
            "prompt": f"{CTITLE[col]} to move. The pawn is blocked straight ahead. Capture a piece and promote to a queen.",
            "answer": {"moves": [m.uci() for m in qs]},
            "claims": [claim(f"C{i + 1}", "legal_move", f"{m.uci()} is legal.", move=m.uci()) for i, m in enumerate(qs)]
                      + [claim(f"C{len(qs) + 1}", "illegal_move", "The pawn cannot move straight ahead: the square is occupied.", move=straight.uci())],
            "hints": ["A pawn cannot move forward onto an occupied square. But it can capture diagonally.",
                      "A capture on the last rank also promotes the pawn.",
                      "Look at the two squares diagonally ahead of the pawn: is an enemy piece standing on one?"],
            "explain": "The pawn cannot push forward because a piece blocks it, but it can capture diagonally onto the last rank, and then it promotes. The capture is legal; the straight push is not.",
            "tags": tags_for(["FND.PROMOTE", "FND.PIECE.PAWN"], 0, 1, fam, ["promo.capture", "task.find_move"])}
    return b.add(board, fam, item, "capture-promotion", label="promo-capture")


def emit_promo_predict(b, board, fam, pawn_sq, kind):
    col = board.turn
    if kind == "blocked_no":
        mv = chess.Move(pawn_sq, pawn_sq + 8, promotion=Q)
        if mv in board.legal_moves:
            return None
        prompt = f"{CTITLE[col]} to move. Can the pawn on {sqn(pawn_sq)} promote by moving straight ahead? Predict, then check."
        expl = "No. A pawn cannot move straight ahead onto an occupied square, so it cannot promote that way."
        outcome, claims = "no", [claim("C1", "illegal_move", "The straight promotion move is illegal.", move=mv.uci())]
    else:  # six: pawn on the 6th rank cannot promote this move
        mv = chess.Move(pawn_sq, pawn_sq + 16, promotion=Q)
        prompt = f"{CTITLE[col]} to move. Can the pawn on {sqn(pawn_sq)} reach the last rank and promote on this move? Predict, then check."
        expl = "No. The pawn is still two squares from the last rank, and a pawn moves one square at a time (two only from its starting rank). It needs two moves."
        outcome, claims = "no", [claim("C1", "illegal_move", "Reaching the last rank in one move is illegal.", move=mv.uci())]
    item = {"skill": "FND.PROMOTE.D2", "cue": 3, "task": "predict_outcome", "prompt": prompt,
            "answer": {"outcome": outcome, "options": ["yes", "no"]}, "claims": claims,
            "hints": ["A pawn promotes only when it reaches the far rank.",
                      "Count the squares to the far rank and check whether the square ahead is free.",
                      "A pawn moves one square at a time (two only from its starting rank), and never onto an occupied square."],
            "explain": expl, "tags": tags_for(["FND.PROMOTE", "FND.PIECE.PAWN"], 0, 3, fam, [f"promo.{kind}", "task.predict_outcome"])}
    return b.add(board, fam, item, f"promotion predict {kind}", label=f"promo-{kind}")


def sample_knight_mate(rng, tries=400000):
    for _ in range(tries):
        b = new_board()
        pf = rng.randrange(8)
        ps = chess.square(pf, 6)
        tgt = chess.square(pf, 7)
        put(b, ps, P, chess.WHITE)
        ks = [s for s in chess.SquareSet(chess.BB_KNIGHT_ATTACKS[tgt]) if b.piece_at(s) is None]
        if not ks:
            continue
        bk = rng.choice(ks)
        put(b, bk, K, chess.BLACK)
        neigh = list(chess.SquareSet(chess.BB_KING_ATTACKS[bk]))
        rng.shuffle(neigh)
        for s in neigh[: rng.randrange(1, 6)]:
            if b.piece_at(s) is None and s != tgt:
                pt = rng.choice([P, P, R, B, N, Q])
                if not (pt == P and chess.square_rank(s) in (0, 7)):
                    put(b, s, pt, chess.BLACK)
        for pt in rng.sample([R, B, N, P], rng.randrange(0, 3)):
            s = random_empty(b, rng)
            if not (pt == P and chess.square_rank(s) in (0, 7)):
                put(b, s, pt, chess.WHITE)
        for _k in range(60):
            s = random_empty(b, rng)
            if chess.square_distance(s, bk) <= 1:
                continue
            put(b, s, K, chess.WHITE)
            break
        b.turn = chess.WHITE
        if not b.is_valid() or b.is_check() or any_pinned(b):
            continue
        pm = promo_moves(b, ps)
        if not pm:
            continue
        mates = [m for m in pm if after_state(b, m) == "checkmate"]
        if not mates or any(m.promotion != N for m in mates):
            continue
        # promoting to a queen must NOT be mate (that is the point), and must not be an illegal-state trick
        qs = [m for m in pm if m.promotion == Q]
        if qs and after_state(b, qs[0]) == "checkmate":
            continue
        return b, ps
    return None


def emit_promo_mate(b, board, fam, pawn_sq):
    col = board.turn
    pm = promo_moves(board, pawn_sq)
    mates = sorted((m for m in pm if after_state(board, m) == "checkmate"), key=lambda m: m.uci())
    if not mates:
        return None
    qm = next((m for m in pm if m.promotion == Q), None)
    item = {"skill": "FND.PROMOTE.D3", "cue": 3, "task": "find_move",
            "prompt": f"{CTITLE[col]} to move. Promote the pawn so that it gives checkmate. Which piece should it become?",
            "answer": {"moves": [m.uci() for m in mates]},
            "claims": [claim(f"C{i + 1}", "mate_in", f"{m.uci()} is checkmate.", move=m.uci(), n=1) for i, m in enumerate(mates)],
            "hints": ["The pawn may become a queen, a rook, a bishop or a knight. Think about which piece gives check here.",
                      "Check the king's escape squares. Which piece attacks the king without giving it a way out?",
                      "A queen is the strongest piece, but it is not always the one that gives check from the promotion square."],
            "explain": "Promoting to a knight gives check from a square the king cannot escape or capture on. A queen would not give check from that square, so the strongest piece is not the right choice here.",
            "tags": tags_for(["FND.PROMOTE", "FND.MATE1"], 0, 3, fam, ["promo.underpromotion", "task.find_move", "theme.underPromotion", "theme.mateIn1"])}
    return b.add(board, fam, item, "knight promotion mate", label="promo-mate")


def find_stalemate_trap(rng, used):
    """K+P v K, pawn on the 7th rank, White to move: promoting to a queen stalemates; a rook promotion wins (tablebase)."""
    import validate
    cands = []
    for f in range(8):
        ps = chess.square(f, 6)
        for wk in chess.SQUARES:
            for bk in chess.SQUARES:
                if len({ps, wk, bk}) < 3 or chess.square_distance(wk, bk) <= 1 or wk == chess.square(f, 7) or bk == chess.square(f, 7):
                    pass
                if len({ps, wk, bk}) < 3 or chess.square_distance(wk, bk) <= 1:
                    continue
                if chess.square_rank(wk) in (7,) and False:
                    continue
                b = new_board()
                put(b, ps, P, chess.WHITE); put(b, wk, K, chess.WHITE); put(b, bk, K, chess.BLACK)
                b.turn = chess.WHITE
                if not b.is_valid():
                    continue
                q = chess.Move(ps, chess.square(f, 7), promotion=Q)
                r = chess.Move(ps, chess.square(f, 7), promotion=R)
                if q not in b.legal_moves:
                    continue
                if after_state(b, q) != "stalemate":
                    continue
                if after_state(b, r) in ("stalemate", "ongoing", "check", "checkmate"):
                    # rook must not be capturable for free: black king not adjacent to the promotion square unless defended
                    after = b.copy(stack=False); after.push(r)
                    if after_state(b, r) == "stalemate":
                        continue
                    cands.append((b.fen(), ps, f))
    rng.shuffle(cands)
    return cands


def build_promo(registry, pre):
    b = Builder("PROMO", MODULE, SEED + 2, registry, pre)
    rng = b.rng
    fam_n = 0

    def nf():
        nonlocal fam_n
        fam_n += 1
        return f"FAM-GEN-PROMO-{fam_n:02d}"

    def three(board, ps, emit):
        """emit orig, mirror, flip"""
        out = []
        for kind, vb in variants(board, kinds=("mirror", "flip")):
            sh = {"orig": ps, "mirror": ps ^ 7, "flip": ps ^ 56}[kind]
            out.append(emit(vb, sh))
        return out

    for kind in ("queen", "queen"):
        fam = nf()
        for _ in range(500):
            res = promo_base(rng, "queen")
            if res is None:
                continue
            bd, f = res
            ps = chess.square(f, 6)
            if emit_promo_queen(b, bd, fam, ps, "queen"):
                emit_promo_queen(b, mirror_files(bd), fam, ps ^ 7, "queen")
                emit_promo_queen(b, colour_flip(bd), fam, ps ^ 56, "queen")
                break
        else:
            b.stats["no-base"] += 1
    for kind in ("capture", "capture"):
        fam = nf()
        for _ in range(800):
            res = promo_base(rng, "capture")
            if res is None:
                continue
            bd, f = res
            ps = chess.square(f, 6)
            if emit_promo_capture(b, bd, fam, ps):
                emit_promo_capture(b, mirror_files(bd), fam, ps ^ 7)
                emit_promo_capture(b, colour_flip(bd), fam, ps ^ 56)
                break
        else:
            b.stats["no-base"] += 1
    for kind in ("blocked_no", "blocked_no", "six", "six"):
        fam = nf()
        for _ in range(800):
            res = promo_base(rng, kind)
            if res is None:
                continue
            bd, f = res
            ps = chess.square(f, 6) if kind != "six" else chess.square(f, 5)
            if emit_promo_predict(b, bd, fam, ps, kind):
                emit_promo_predict(b, colour_flip(bd), fam, ps ^ 56, kind)
                break
        else:
            b.stats["no-base"] += 1
    for _ in range(3):
        fam = nf()
        res = sample_knight_mate(rng)
        if res is None:
            b.stats["no-base"] += 1
            continue
        bd, ps = res
        if emit_promo_mate(b, bd, fam, ps):
            emit_promo_mate(b, colour_flip(bd), fam, ps ^ 56)
    # stalemate trap (tablebase-backed)
    cands = find_stalemate_trap(rng, set())
    b.stats["trap-candidates"] = len(cands)
    traps = 0
    used_files = set()
    for fen, ps, f in cands:
        if traps >= 4:
            break
        if f in used_files or min(f, 7 - f) in {min(u, 7 - u) for u in used_files}:  # one trap per (mirror-class of) pawn file
            continue
        bd = chess.Board(fen)
        fam = nf()
        made = 0
        for kindname, vb in (("orig", bd), ("flip", colour_flip(bd))):
            sh = ps if kindname == "orig" else ps ^ 56
            col = vb.turn
            pm = promo_moves(vb, sh)
            qm = next(m for m in pm if m.promotion == Q)
            good = []
            for m in pm:
                if m.promotion == Q:
                    continue
                if pre.v.check_claim(pre.eng, {"fen": vb.fen()}, claim("X", "tablebase", None, move=m.uci(), result="win"))["result"] == "pass":
                    good.append(m)
            if not good:
                continue
            good.sort(key=lambda m: m.uci())
            claims = [claim(f"C{i + 1}", "tablebase", f"{m.uci()} still wins (tablebase).", move=m.uci(), result="win") for i, m in enumerate(good)]
            claims.append(claim(f"C{len(good) + 1}", "tablebase", "Promoting to a queen only draws (tablebase).", move=qm.uci(), result="draw"))
            item = {"skill": "FND.PROMOTE.D3", "cue": 3, "task": "find_move",
                    "prompt": f"{CTITLE[col]} to move. The pawn is about to promote. Choose the promotion that keeps the win.",
                    "answer": {"moves": [m.uci() for m in good]},
                    "claims": claims, "feedback_by_move": {qm.uci(): "Promoting to a queen leaves the enemy king with no legal move while it is not in check: stalemate, a draw (tablebase: draw)."},
                    "hints": ["A queen is usually best, but check what the enemy king can do after the promotion.",
                              "Count the squares the enemy king could move to after each promotion. Is the king also attacked?",
                              "If the king has no move and is not attacked, the game is drawn at once."],
                    "explain": "A queen would cover every square around the enemy king without attacking it, so the king has no legal move and is not in check: stalemate, a draw. Another promotion keeps the win.",
                    "tags": tags_for(["FND.PROMOTE", "FND.STALEMATE"], 0, 3, fam, ["promo.stalemate-trap", "task.find_move", "theme.underPromotion"])}
            if b.add(vb, fam, item, "stalemate-by-promotion trap", label="promo-trap"):
                made += 1
        if made:
            traps += 1
            used_files.add(f)
    return {"gen-t0-promo.json": b}


def build(registry, pre):
    out = {}
    out.update(build_castle(registry, pre))
    out.update(build_ep(registry, pre))
    out.update(build_promo(registry, pre))
    return out


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
