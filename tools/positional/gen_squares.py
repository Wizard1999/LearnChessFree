"""Family A, squares: outposts, holes (weak squares), pawn space, pawn centre control, what a pawn move leaves behind,
blockading a passed pawn. All answers exact (tools/structure.py claims); real calm Lichess positions (CC0) or one-pawn edits.

    ./tools/.venv/Scripts/python.exe -I tools/positional/gen_squares.py
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import chess
import pcommon as C
import psel
import structure as S
from pcommon import Cl, mk, CN, CT, join_and, files_phrase, FILES
from pgen import Driver, random_for, pair_make, number_options, YN
from generators.common import see_gain

SEED = 20261102
W, Bk = chess.WHITE, chess.BLACK
CK = {W: "w", Bk: "b"}
QUOTA = dict(out_sel=3, out_move=3, out_yn=4, out_pick=2, out_pair=4, hole_sel=3, hole_yn=4, hole_pick=2, hole_pair=3, space_n=3, space_who=2,
             space_ctl=1, space_pair=3, centre_n=4, centre_who=3, pm_holes=4, pm_class=2, blk_sq=4, blk_move=3, blk_yn=4)


def F(rec, c, key):
    return rec["f"][f"{CK[c]}.{key}"]


def rank_words(c):
    return "3rd, 4th or 5th rank" if True else ""


def sqn(s):
    return chess.square_name(s)


def sans(board, moves):
    return [board.san(chess.Move.from_uci(m)) for m in moves]


def supporter(board, c, s):
    sq = chess.parse_square(s)
    return sorted(chess.square_name(q) for q in board.pieces(chess.PAWN, c) if (chess.BB_PAWN_ATTACKS[c][q] >> sq) & 1)


def attacker_pawns(board, c, s):
    """enemy pawns (of colour not c) on a neighbouring file that are still at or beyond the attacking rank"""
    sq = chess.parse_square(s)
    f = chess.square_file(sq)
    return sorted(chess.square_name(e) for e in board.pieces(chess.PAWN, not c) if abs(chess.square_file(e) - f) == 1 and S.rr(c, e) >= S.rr(c, sq) + 1)


OUT_DEF = ("An outpost square is on the 4th, 5th or 6th rank counted from your own side, has no pawn on it, is defended by one of your pawns, "
           "and no enemy pawn can attack it now or by advancing (this item ignores pawn captures that would move a pawn to another file).")


# ----------------------------------------------------------------------------------------------------------------
# outposts
# ----------------------------------------------------------------------------------------------------------------
def out_claims(board, c, squares):
    cl = Cl().add("outposts", f"The outpost squares for {CT[c]} (any occupant) are exactly {join_and(sorted(squares), 'none')}.", color=CN[c], occupied="any", squares=sorted(squares))
    return cl


def t_out_select(c):
    def make(rec, board):
        ans = F(rec, c, "out_any")
        if not 1 <= len(ans) <= 3:
            return None
        for s in ans:
            pc = board.piece_at(chess.parse_square(s))
            if pc is not None and pc.color != c:
                return None
        cl = out_claims(board, c, ans)
        parts = []
        for s in sorted(ans):
            sp = supporter(board, c, s)
            cl.add("piece_attacks", f"The {CN[c]} pawn on {sp[0]} defends {s}.", square=sp[0], includes=[s])
            parts.append(f"{s} (defended by the {sp[0]} pawn)")
        item = mk("POS.OUTPOST.D1", 1, "select_squares",
                  f"Tap every outpost square for {CT[c]}. {OUT_DEF}", {"squares": sorted(ans)}, cl, ["POS.OUTPOST", "POS.WEAKSQ"],
                  [f"Start from {CN[c]}'s pawns and look at the squares they defend on the 4th to 6th rank.",
                   f"For each such square ask: can a {CN[not c]} pawn on a neighbouring file still reach a square from which it attacks it?",
                   f"{len(ans)} square{'s' if len(ans) != 1 else ''} qualif{'y' if len(ans) != 1 else 'ies'}; one is on the {sorted(ans)[0][0]}-file."],
                  f"Outpost squares for {CT[c]}: {'; '.join(parts)}. No {CN[not c]} pawn can attack them now or by advancing (pawn captures that change file are not considered).",
                  C.fam(rec), tpl="out-select")
        return [(board, item, C.prov(rec), "out-select")]
    return make


def safe_after(board, move):
    """the moved piece is not capturable with profit (static exchange) on its destination"""
    b = board.copy(stack=False)
    b.push(move)
    for m in b.legal_moves:
        if m.to_square == move.to_square and b.is_capture(m) and see_gain(b, m) > 0:
            return False
    return True


def t_out_move(rec, board):
    c = board.turn
    mv = S.moves_where(board, "to_outpost")
    if not 1 <= len(mv) <= 3:
        return None
    if not all(safe_after(board, chess.Move.from_uci(m)) for m in mv):
        return None
    sn = sans(board, mv)
    cl = Cl().add("moves_where", f"The legal knight and bishop moves that land on an outpost square are exactly {join_and(sn)}.", property="to_outpost", moves=mv)
    item = mk("POS.OUTPOST.D1", 1, "find_move",
              f"{CT[c]} to move. Put a knight or a bishop on an outpost square. {OUT_DEF}", {"moves": mv}, cl, ["POS.OUTPOST"],
              ["Look for squares on your 4th to 6th rank that one of your pawns defends.", "Then check that no enemy pawn can ever come to attack the square.",
               f"There {'is' if len(mv) == 1 else 'are'} {len(mv)} such move{'s' if len(mv) != 1 else ''}."],
              f"After {join_and(sn)} the piece stands on a square defended by a {CN[c]} pawn that no {CN[not c]} pawn can attack now or by advancing. "
              f"The item asks only for the outpost; it does not claim that this is the best move in the position.",
              C.fam(rec), tpl="out-move")
    return [(board, item, C.prov(rec), "out-move")]


def t_out_yn(want):
    def make(rec, board):
        c = W if rec["_c"] else Bk
        rng = random_for(rec, "outyn")
        own = F(rec, c, "out_own")
        pieces = [chess.square_name(s) for s, p in board.piece_map().items() if p.color == c and p.piece_type in (chess.KNIGHT, chess.BISHOP) and S.rr(c, s) in (3, 4, 5)]
        if want == "yes":
            cands = [x for x in own if board.piece_type_at(chess.parse_square(x)) in (chess.KNIGHT, chess.BISHOP)]
            if not cands:
                return None
            s = rng.choice(cands)
        else:
            cand = [x for x in pieces if x not in own]
            if not cand:
                return None
            s = rng.choice(cand)
        pc = board.piece_at(chess.parse_square(s))
        name = f"{CN[c]} {C.PN[pc.piece_type]}"
        cl = Cl().add("outposts", f"The outpost squares for {CT[c]} that hold one of its pieces are exactly {join_and(sorted(own), 'none')}.", color=CN[c], occupied="own", squares=sorted(own))
        if want == "yes":
            sp = supporter(board, c, s)
            why = f"The {name} on {s} is defended by the {CN[c]} pawn on {sp[0]}, no pawn stands on {s}, and no {CN[not c]} pawn can attack it now or by advancing: it is on an outpost square."
            cl.add("piece_attacks", f"The {CN[c]} pawn on {sp[0]} defends {s}.", square=sp[0], includes=[s])
        else:
            if not supporter(board, c, s):
                cl.add("pawn_attackers", f"No {CN[c]} pawn defends {s}.", square=s, color=CN[c], count=0)
                why = f"No {CN[c]} pawn defends {s}, so the {name} there is not on an outpost square."
            else:
                att = attacker_pawns(board, c, s)
                if not att:
                    return None
                cl.add("holes", f"{s} is not a hole in {CT[not c]}'s camp: a {CN[not c]} pawn can still attack it.", color=CN[not c], excludes=[s])
                why = (f"The {CN[not c]} pawn on {att[0]} is on a neighbouring file and has not yet passed the rank from which it attacks {s}, so it could still come to attack the {name} "
                       f"by advancing (blockers are ignored): {s} is not an outpost square.")
        item = mk("POS.OUTPOST.D2", 2, "predict_outcome",
                  f"Is the {name} on {s} standing on an outpost square? {OUT_DEF}", {"outcome": want}, cl, ["POS.OUTPOST"],
                  [f"Check whether a {CN[c]} pawn defends {s}.", f"Then check the {CN[not c]} pawns on the neighbouring files: could one of them still advance to attack {s}?",
                   "Both conditions must hold for an outpost."], why, C.fam(rec), options=YN, tpl="out-yn")
        return [(board, item, C.prov(rec), "out-yn")]
    return make


def t_out_pick(c):
    def make(rec, board):
        rng = random_for(rec, "outpick")
        emp = F(rec, c, "out_empty")
        if not emp:
            return None
        ans = rng.choice(emp)
        outs = set(F(rec, c, "out_any"))
        cand = []
        for s in chess.SQUARES:
            if S.rr(c, s) in (3, 4, 5) and board.piece_at(s) is None and chess.square_name(s) not in outs and chess.square_file(s) in range(1, 7):
                cand.append(chess.square_name(s))
        if len(cand) < 3:
            return None
        rng.shuffle(cand)
        # prefer distractors with a plausible reason (defended by a pawn but attackable, or unsupported but central)
        dis = cand[:3]
        opts = sorted(dis + [ans])
        cl = Cl().add("outposts", f"{ans} is an outpost square for {CT[c]} and {join_and(sorted(dis))} are not (all five are empty).", color=CN[c], occupied="empty", includes=[ans], excludes=sorted(dis))
        sp = supporter(board, c, ans)
        item = mk("POS.OUTPOST.D1", 1, "classify_position",
                  f"Which of these empty squares is an outpost square for {CT[c]}? {OUT_DEF}", {"class": ans}, cl, ["POS.OUTPOST"],
                  ["Test the squares one at a time against the two conditions.", "Condition 1: one of your pawns defends the square. Condition 2: no enemy pawn can ever attack it.",
                   f"The right square is on the {ans[0]}-file."],
                  f"{ans} is defended by the {CN[c]} pawn on {sp[0]} and no {CN[not c]} pawn can attack it now or by advancing. Each other square fails at least one condition.",
                  C.fam(rec), options=opts, tpl="out-pick")
        return [(board, item, C.prov(rec), "out-pick")]
    return make


def q_out(c, s):
    return f"Is {s} an outpost square for {CT[c]}? {OUT_DEF}"


def cl_out(board, c, s):
    return out_claims(board, c, S.outpost_squares(board, c, "any"))


def why_out(board, c, s, yes):
    if yes:
        sp = supporter(board, c, s)
        return f"{s} is defended by the {CN[c]} pawn on {sp[0]}, has no pawn on it, and no {CN[not c]} pawn can attack it now or by advancing: it is an outpost square."
    if not supporter(board, c, s):
        return f"No {CN[c]} pawn defends {s} any more, so it is not an outpost square."
    att = attacker_pawns(board, c, s)
    if att:
        return f"The {CN[not c]} pawn on {att[0]} could still come to attack {s} by advancing (blockers ignored), so {s} is not an outpost square."
    return f"{s} fails the outpost conditions in this position."


def hints_out(c, s):
    return [f"Two things matter: who defends {s} and who could attack it.", f"Is {s} defended by a {CN[c]} pawn? Can any {CN[not c]} pawn on a neighbouring file still come to attack it?",
            "An outpost needs the first and must fail the second."]


# ----------------------------------------------------------------------------------------------------------------
# holes
# ----------------------------------------------------------------------------------------------------------------
def hole_def(c):
    return f"A hole is a square on {CT[c]}'s 3rd, 4th or 5th rank with no {CN[c]} pawn on it that none of {CT[c]}'s pawns attacks now or can attack by advancing (pawn captures that change a pawn's file are ignored)."


def hole_claim(board, c, holes):
    return Cl().add("holes", f"The holes in {CT[c]}'s camp are exactly {join_and(sorted(holes), 'none')}.", color=CN[c], squares=sorted(holes))


def guard_pawn(board, c, s):
    """an own pawn that attacks s now or could by advancing (neighbouring file, at or behind the square's rank minus one)"""
    sq = chess.parse_square(s)
    f = chess.square_file(sq)
    return sorted(chess.square_name(q) for q in board.pieces(chess.PAWN, c) if abs(chess.square_file(q) - f) == 1 and S.rr(c, q) <= S.rr(c, sq) - 1)


def t_hole_select(c):
    def make(rec, board):
        ans = F(rec, c, "holes")
        if not 1 <= len(ans) <= 4:
            return None
        cl = hole_claim(board, c, ans)
        item = mk("POS.WEAKSQ.D1", 1, "select_squares",
                  f"Tap every hole in {CT[c]}'s camp. {hole_def(c)}",
                  {"squares": sorted(ans)}, cl, ["POS.WEAKSQ"],
                  [f"Look at {CN[c]}'s 3rd, 4th and 5th ranks, square by square.", f"A square is safe from being a hole if a {CN[c]} pawn on a neighbouring file stands lower down or level with the square's rank below it (so it can still attack the square).",
                   f"{len(ans)} square{'s' if len(ans) != 1 else ''} qualif{'y' if len(ans) != 1 else 'ies'}; the first is on the {sorted(ans)[0][0]}-file."],
                  f"Holes in {CT[c]}'s camp: {join_and(sorted(ans))}. No {CN[c]} pawn attacks these squares or can ever attack them by advancing. Whether an enemy piece can reach and keep a hole is a separate question; this item does not claim that.",
                  C.fam(rec), tpl="hole-select")
        return [(board, item, C.prov(rec), "hole-select")]
    return make


def t_hole_yn(want):
    def make(rec, board):
        c = W if rec["_c"] else Bk
        rng = random_for(rec, "holeyn")
        holes = F(rec, c, "holes")
        if want == "yes":
            if not holes:
                return None
            s = rng.choice(holes)
        else:
            cand = [chess.square_name(x) for x in chess.SQUARES if S.rr(c, x) in (2, 3, 4) and chess.square_name(x) not in holes
                    and not (board.piece_type_at(x) == chess.PAWN and board.color_at(x) == c) and guard_pawn(board, c, chess.square_name(x))]
            if not cand:
                return None
            s = rng.choice(cand)
        cl = hole_claim(board, c, holes)
        if want == "yes":
            why = f"No {CN[c]} pawn attacks {s} or can reach a square from which it would attack {s}, so {s} is a hole in {CT[c]}'s camp."
        else:
            g = guard_pawn(board, c, s)
            why = f"The {CN[c]} pawn on {g[0]} is on a neighbouring file and is level with or behind the rank below {s}, so it attacks {s} now or can come to attack it by advancing: {s} is not a hole."
        item = mk("POS.WEAKSQ.D2", 2, "predict_outcome",
                  f"Is {s} a hole in {CT[c]}'s camp? {hole_def(c)}",
                  {"outcome": want}, cl, ["POS.WEAKSQ"],
                  [f"Look at the {CN[c]} pawns on the files beside {s[0]}.", "Is any of them low enough to attack the square now, or to attack it after a few steps forward?",
                   "If one is, the square is not a hole. If none is, it is a hole."], why, C.fam(rec), options=YN, tpl="hole-yn")
        return [(board, item, C.prov(rec), "hole-yn")]
    return make


def t_hole_pick(c):
    def make(rec, board):
        rng = random_for(rec, "holepick")
        holes = F(rec, c, "holes")
        if not holes:
            return None
        ans = rng.choice(holes)
        cand = [chess.square_name(x) for x in chess.SQUARES if S.rr(c, x) in (2, 3, 4) and chess.square_name(x) not in holes
                and not (board.piece_type_at(x) == chess.PAWN and board.color_at(x) == c) and chess.square_file(x) in range(1, 7)]
        if len(cand) < 3:
            return None
        rng.shuffle(cand)
        dis = cand[:3]
        cl = Cl().add("holes", f"{ans} is a hole in {CT[c]}'s camp and {join_and(sorted(dis))} are not.", color=CN[c], includes=[ans], excludes=sorted(dis))
        item = mk("POS.WEAKSQ.D1", 1, "classify_position",
                  f"Which of these squares is a hole in {CT[c]}'s camp? {hole_def(c)}",
                  {"class": ans}, cl, ["POS.WEAKSQ"],
                  ["Test the squares one by one against the definition.", f"For each square, look for a {CN[c]} pawn on a neighbouring file that could still attack it.",
                   f"The hole is on the {ans[0]}-file."],
                  f"No {CN[c]} pawn attacks {ans} or can come to attack it by advancing. Each other square can still be attacked by a {CN[c]} pawn (or has a {CN[c]} pawn on it).",
                  C.fam(rec), options=sorted(dis + [ans]), tpl="hole-pick")
        return [(board, item, C.prov(rec), "hole-pick")]
    return make


def q_hole(c, s):
    return f"Is {s} a hole in {CT[c]}'s camp? {hole_def(c)}"


def cl_hole(board, c, s):
    return hole_claim(board, c, S.hole_squares(board, c))


def why_hole(board, c, s, yes):
    if yes:
        return f"No {CN[c]} pawn attacks {s} or can come to attack it by advancing: {s} is a hole."
    g = guard_pawn(board, c, s)
    if g:
        return f"The {CN[c]} pawn on {g[0]} can attack {s} now or by advancing, so {s} is not a hole."
    return f"{s} is not a hole in this position."


def hints_hole(c, s):
    return [f"Look for {CN[c]} pawns on the files next to {s[0]}.", "Is one of them low enough on the board to attack the square now or after advancing?", "No such pawn means a hole."]


# ----------------------------------------------------------------------------------------------------------------
# space and the centre (pawn counts)
# ----------------------------------------------------------------------------------------------------------------
def half_words(c):
    return "ranks 5 to 8" if c == W else "ranks 4 to 1"


def t_space_n(c, mode="pawn_attacks"):
    def make(rec, board):
        sq = S.space_squares(board, c, mode)
        n = len(sq)
        if n == 0:
            return None
        rng = random_for(rec, "spn")
        opts = number_options(rng, n, 0, 14)
        if mode == "pawn_attacks":
            what = f"at least one {CN[c]} pawn attacks"
            cue, tpl = 1, "space-n"
        else:
            what = f"at least one {CN[c]} pawn attacks and no {CN[not c]} pawn attacks"
            cue, tpl = 1, "space-ctl"
        cl = Cl().add("space", f"{CT[c]}'s pawns {'attack' if mode == 'pawn_attacks' else 'control'} exactly these {n} squares in {CT[not c]}'s half: {join_and(sq)}.", color=CN[c], mode=mode, count=n, squares=sq)
        item = mk("POS.SPACE.D1", cue, "classify_position",
                  f"Count the squares in {CT[not c]}'s half of the board ({half_words(c)}) that {what}. How many are there?",
                  {"class": str(n)}, cl, ["POS.SPACE"],
                  [f"List each {CN[c]} pawn and the two squares it attacks diagonally forward.", f"Keep only the squares in {half_words(c)}, and count each square once even if two pawns attack it." + (f" Remove squares that a {CN[not c]} pawn also attacks." if mode == "pawn_controlled" else ""),
                   f"The answer is between {max(0, n - 1)} and {n + 1}."],
                  f"{CT[c]}'s pawns {'attack' if mode == 'pawn_attacks' else 'control'} {n} squares in that half: {join_and(sq)}. This counts squares only; it does not say how useful the space is.",
                  C.fam(rec), options=opts, tpl=tpl)
        return [(board, item, C.prov(rec), tpl)]
    return make


def t_space_who(rec, board):
    w, b = S.space_squares(board, W, "pawn_attacks"), S.space_squares(board, Bk, "pawn_attacks")
    opts = ["White", "Black", "Neither (equal)"]
    ans = opts[0] if len(w) > len(b) else opts[1] if len(b) > len(w) else opts[2]
    cl = (Cl().add("space", f"White's pawns attack {len(w)} squares in Black's half: {join_and(w, 'none')}.", color="white", mode="pawn_attacks", count=len(w), squares=w)
          .add("space", f"Black's pawns attack {len(b)} squares in White's half: {join_and(b, 'none')}.", color="black", mode="pawn_attacks", count=len(b), squares=b))
    item = mk("POS.SPACE.D1", 1, "classify_position",
              "Compare the pawns only. Which side's pawns attack more squares in the opponent's half of the board (White's pawns in ranks 5 to 8, Black's in ranks 4 to 1)?",
              {"class": ans}, cl, ["POS.SPACE"],
              ["Count for White first, then for Black.", "Each pawn attacks the two squares diagonally in front of it; count a square once.",
               f"The two counts are {min(len(w), len(b))} and {max(len(w), len(b))} or equal."],
              f"White's pawns attack {len(w)} squares in Black's half; Black's pawns attack {len(b)} squares in White's half. By this count: {ans.lower() if ans.startswith('Neither') else ans + ' has more'}. This is a pawn count, not a verdict on the position.",
              C.fam(rec), options=opts, tpl="space-who")
    return [(board, item, C.prov(rec), "space-who")]


def space_feat(board, c, s):
    return len(S.space_squares(board, W, "pawn_attacks")) > len(S.space_squares(board, Bk, "pawn_attacks"))


def cl_space(board, c, s):
    w, b = S.space_squares(board, W, "pawn_attacks"), S.space_squares(board, Bk, "pawn_attacks")
    return (Cl().add("space", f"White's pawns attack {len(w)} squares in Black's half.", color="white", mode="pawn_attacks", count=len(w), squares=w)
            .add("space", f"Black's pawns attack {len(b)} squares in White's half.", color="black", mode="pawn_attacks", count=len(b), squares=b))


def why_space(board, c, s, yes):
    w, b = len(S.space_squares(board, W, "pawn_attacks")), len(S.space_squares(board, Bk, "pawn_attacks"))
    return f"White's pawns attack {w} squares in Black's half and Black's pawns attack {b} in White's half, so White's pawns attack {'more' if yes else 'no more'} squares."


CENTRE = ["d4", "e4", "d5", "e5"]


def t_centre_n(c):
    def make(rec, board):
        att = [x for x in CENTRE if S.pawn_attackers(board, chess.parse_square(x), c) > 0]
        n = len(att)
        rng = random_for(rec, "cn")
        opts = ["0", "1", "2", "3", "4"]
        cl = Cl().add("space", f"{CT[c]}'s pawns attack {n} of the four central squares ({join_and(att, 'none')}).", color=CN[c], mode="pawn_attacks", region=CENTRE, count=n, squares=sorted(att))
        item = mk("POS.CENTER.CONTROL.D1", 1, "classify_position",
                  f"How many of the four central squares (d4, e4, d5, e5) does at least one {CN[c]} pawn attack?",
                  {"class": str(n)}, cl, ["POS.CENTER.CONTROL"],
                  [f"Check each central square for a {CN[c]} pawn diagonally behind it.", "A pawn attacks the two squares diagonally in front of it (a pawn standing on the square itself does not attack it).",
                   f"The answer is {max(0, n - 1)}, {n} or {min(4, n + 1)}."],
                  f"{CT[c]}'s pawns attack {join_and(att, 'none of the central squares')}. This counts pawn attacks only; pieces can control the centre too.",
                  C.fam(rec), options=opts, tpl="centre-n")
        return [(board, item, C.prov(rec), "centre-n")]
    return make


def t_centre_who(rec, board):
    def pawns_on(c):
        return [x for x in CENTRE if board.piece_at(chess.parse_square(x)) == chess.Piece(chess.PAWN, c)]
    wp, bp = pawns_on(W), pawns_on(Bk)
    opts = ["White", "Black", "Neither (equal)"]
    ans = opts[0] if len(wp) > len(bp) else opts[1] if len(bp) > len(wp) else opts[2]
    cl = Cl()
    for x in CENTRE:
        pc = board.piece_at(chess.parse_square(x))
        cl.add("piece_on", f"{x} holds {('the ' + CN[pc.color] + ' ' + C.PN[pc.piece_type]) if pc else 'no piece'}.", square=x, piece=pc.symbol() if pc else "empty")
    item = mk("POS.CENTER.CONTROL.D1", 2, "classify_position",
              "Look at the four central squares d4, e4, d5, e5. Which side has more PAWNS standing on them?",
              {"class": ans}, cl, ["POS.CENTER.CONTROL"],
              ["Look at the four squares one at a time.", "Count only pawns, not pieces.", "Count White's pawns on them, then Black's."],
              f"White pawns on the central squares: {join_and(wp, 'none')}. Black pawns: {join_and(bp, 'none')}.", C.fam(rec), options=opts, tpl="centre-who")
    return [(board, item, C.prov(rec), "centre-who")]


# ----------------------------------------------------------------------------------------------------------------
# what a pawn move leaves behind
# ----------------------------------------------------------------------------------------------------------------
def stm_pushes(board):
    for m in board.legal_moves:
        if board.piece_type_at(m.from_square) == chess.PAWN and not board.is_capture(m) and not m.promotion:
            yield m


def diff_sets(board, move, c):
    nb = board.copy(stack=False)
    nb.push(move)
    d = {}
    for key, fn in (("holes", lambda b: S.hole_squares(b, c)), ("isolated", lambda b: S.pawn_set(b, "isolated", c)), ("backward", lambda b: S.pawn_set(b, "backward", c))):
        before, after = fn(board), fn(nb)
        d[key] = (before, after, sorted(set(after) - set(before)))
    return d


def pm_claims(board, move, c, d, keys):
    cl = Cl()
    for key in keys:
        before, after, _ = d[key]
        if key == "holes":
            cl.add("holes", f"Before the move, the holes in {CT[c]}'s camp are {join_and(before, 'none')}.", color=CN[c], squares=before)
            cl.add("holes", f"After the move, the holes in {CT[c]}'s camp are {join_and(after, 'none')}.", color=CN[c], squares=after, after_move=move.uci())
        else:
            cl.add("pawn_set", f"Before the move, {CT[c]}'s {key} pawns are {join_and(before, 'none')}.", kind=key, color=CN[c], squares=before)
            cl.add("pawn_set", f"After the move, {CT[c]}'s {key} pawns are {join_and(after, 'none')}.", kind=key, color=CN[c], squares=after, after_move=move.uci())
    return cl


def t_pm_holes(rec, board):
    c = board.turn
    rng = random_for(rec, "pmh")
    moves = list(stm_pushes(board))
    rng.shuffle(moves)
    for m in moves:
        d = diff_sets(board, m, c)
        new = d["holes"][2]
        if not 1 <= len(new) <= 3:
            continue
        san = board.san(m)
        cl = pm_claims(board, m, c, d, ["holes"])
        item = mk("POS.PAWNMOVE.D1", 1, "select_squares",
                  f"{CT[c]} is thinking of {san}. Pawns cannot go back, so this move changes which squares {CN[c]}'s pawns can guard. Tap the squares in {CT[c]}'s camp that become HOLES because of this move (squares no {CN[c]} pawn can attack now or by advancing, which were not holes before).",
                  {"squares": new}, cl, ["POS.PAWNMOVE", "POS.WEAKSQ"],
                  [f"Think about what the pawn on {chess.square_name(m.from_square)} used to guard, and which of those squares no other {CN[c]} pawn can guard.",
                   "A square becomes a hole when the only pawns that could ever attack it have all moved past it.",
                   f"{len(new)} square{'s' if len(new) != 1 else ''}; the first is on the {new[0][0]}-file."],
                  f"Before {san} the holes in {CT[c]}'s camp were {join_and(d['holes'][0], 'none')}; after it they are {join_and(d['holes'][1], 'none')}. New: {join_and(new)}. Whether an enemy piece can use them is a separate question this item does not answer.",
                  C.fam(rec), tpl="pm-holes", extra=("move.pawn",))
        return [(board, item, C.prov(rec), "pm-holes")]
    return None


def hole_phrase(new):
    if not new:
        return "no square is a new hole"
    return f"the squares {join_and(new)} are holes" if len(new) > 1 else f"the square {new[0]} is a hole"


PM_OPTS = ["It creates a new hole", "It makes a pawn isolated", "It makes a pawn backward", "It creates none of these"]


def t_pm_class(want):
    def make(rec, board):
        c = board.turn
        rng = random_for(rec, "pmc")
        moves = list(stm_pushes(board))
        rng.shuffle(moves)
        for m in moves:
            d = diff_sets(board, m, c)
            kinds = [k for k in ("holes", "isolated", "backward") if d[k][2]]
            if want == "none" and kinds:
                continue
            if want != "none" and kinds != [want]:
                continue
            ans = PM_OPTS[0] if want == "holes" else PM_OPTS[1] if want == "isolated" else PM_OPTS[2] if want == "backward" else PM_OPTS[3]
            san = board.san(m)
            cl = pm_claims(board, m, c, d, ["holes", "isolated", "backward"])
            new = d[want][2] if want != "none" else []
            expl = {"holes": f"After {san} {hole_phrase(new)} in {CT[c]}'s camp (not before); no pawn becomes isolated or backward.",
                    "isolated": f"After {san} the pawn{'s' if len(new) > 1 else ''} on {join_and(new)} {'are' if len(new) > 1 else 'is'} isolated (not before); no new hole appears.",
                    "backward": f"After {san} the pawn{'s' if len(new) > 1 else ''} on {join_and(new)} {'are' if len(new) > 1 else 'is'} backward (not before); no new hole appears and no pawn becomes isolated.",
                    "none": f"After {san} {CT[c]}'s holes, isolated pawns and backward pawns are exactly the same sets as before."}[want]
            item = mk("POS.PAWNMOVE.D2", 2, "classify_position",
                      f"{CT[c]} is thinking of {san}. Compare {CN[c]}'s pawn structure before and after the move. Which describes the change best? (Hole: a square on {CN[c]}'s 3rd-5th rank that no {CN[c]} pawn can ever attack. Isolated and backward as usual.)",
                      {"class": ans}, cl, ["POS.PAWNMOVE"],
                      ["List what the moving pawn guarded before, and what it guards afterwards.", "Check the neighbouring files: does a pawn lose its last neighbour, or fall behind its neighbours?",
                       "Check whether any square it used to guard can now never be guarded again."],
                      expl + " The item compares structure only; it does not say whether the move is good.", C.fam(rec), options=PM_OPTS, tpl="pm-class", extra=("move.pawn",))
            return [(board, item, C.prov(rec), "pm-class")]
        return None
    return make


# ----------------------------------------------------------------------------------------------------------------
# blockade
# ----------------------------------------------------------------------------------------------------------------
def t_blk_square(c):
    """c = owner of the passed pawn"""
    def make(rec, board):
        ps = F(rec, c, "passed")
        if len(ps) != 1:
            return None
        pawn = chess.parse_square(ps[0])
        st = S.stop_square(c, pawn)
        if st is None or board.piece_at(st) is not None:
            return None
        s = chess.square_name(st)
        cl = (Cl().add("pawn_set", f"{CT[c]}'s only passed pawn is {ps[0]}.", kind="passed", color=CN[c], squares=ps)
              .add("piece_on", f"{s}, the square in front of it, is empty.", square=s, piece="empty"))
        item = mk("POS.BLOCKADE.D1", 1, "select_squares",
                  f"{CT[c]} has a passed pawn on {ps[0]}. Tap the square where {CT[not c]} would place a blockading piece: the square directly in front of the pawn.",
                  {"squares": [s]}, cl, ["POS.BLOCKADE", "POS.PASSED"],
                  ["A blockader stands on the square the pawn wants to move to next.", "It is on the pawn's own file.", f"It is on rank {s[1]}."],
                  f"The only passed {CN[c]} pawn is on {ps[0]}; the square in front of it, {s}, is empty. A piece of {CT[not c]}'s on {s} would blockade the pawn.",
                  C.fam(rec), tpl="blk-square")
        return [(board, item, C.prov(rec), "blk-square")]
    return make


def t_blk_move(rec, board):
    c = board.turn
    mv = S.moves_where(board, "blockades_passed")
    if not 1 <= len(mv) <= 3:
        return None
    if not all(safe_after(board, chess.Move.from_uci(m)) for m in mv):
        return None
    sn = sans(board, mv)
    cl = Cl().add("moves_where", f"The legal moves that put a knight, bishop, rook or queen on the square in front of an enemy passed pawn are exactly {join_and(sn)}.", property="blockades_passed", moves=mv)
    item = mk("POS.BLOCKADE.D1", 1, "find_move",
              f"{CT[c]} to move. {CT[not c]} has a passed pawn. Blockade it: move a piece onto the square directly in front of the pawn.",
              {"moves": mv}, cl, ["POS.BLOCKADE", "POS.PASSED"],
              ["First find the passed pawn: no enemy pawn in front of it on its own or a neighbouring file.", "The blockading square is the one right in front of it.",
               f"The piece that moves starts on the {mv[0][0]}-file."],
              f"After {join_and(sn)} the piece stands directly in front of the passed pawn. The item asks for the blockade only; it does not claim this is the best move.",
              C.fam(rec), tpl="blk-move")
    return [(board, item, C.prov(rec), "blk-move")]


def t_blk_yn(want):
    def make(rec, board):
        c = W if rec["_c"] else Bk
        rng = random_for(rec, "blkyn")
        ps = F(rec, c, "passed")
        bl = F(rec, c, "blockaded_passed")
        if want == "yes":
            if not bl:
                return None
            s = rng.choice(bl)
        else:
            cand = [x for x in ps if x not in bl]
            if not cand:
                return None
            s = rng.choice(cand)
        st = chess.square_name(S.stop_square(c, chess.parse_square(s)))
        pc = board.piece_at(chess.parse_square(st))
        cl = (Cl().add("pawn_set", f"{CT[c]}'s passed pawns are {join_and(ps, 'none')}.", kind="passed", color=CN[c], squares=sorted(ps))
              .add("pawn_set", f"{CT[c]}'s blockaded passed pawns are {join_and(bl, 'none')}.", kind="blockaded_passed", color=CN[c], squares=sorted(bl)))
        if want == "yes":
            why = f"The passed pawn on {s} has the {CN[not c]} {C.PN[pc.piece_type]} directly in front of it on {st}: it is blockaded."
        else:
            why = f"The square in front of the passed pawn on {s}, {st}, " + ("is empty" if pc is None else f"holds {('a ' + CN[pc.color] + ' ' + C.PN[pc.piece_type])}, which is not an enemy piece") + f", so the pawn is not blockaded."
        item = mk("POS.BLOCKADE.D1", 2, "predict_outcome",
                  f"The {CN[c]} pawn on {s} is passed. Is it blockaded, that is, does an enemy piece (not a pawn) stand on the square directly in front of it?",
                  {"outcome": want}, cl, ["POS.BLOCKADE", "POS.PASSED"],
                  [f"Find the square directly in front of the pawn on {s}.", "Look at what stands on it.", "A blockade needs an enemy piece there, not an empty square and not your own piece."],
                  why, C.fam(rec), options=YN, tpl="blk-yn")
        return [(board, item, C.prov(rec), "blk-yn")]
    return make


# ----------------------------------------------------------------------------------------------------------------
def main():
    reg = C.make_registry("squares")
    pre = C.PreCheck()
    B = C.PBuilder("SQ", "squares", SEED, reg, pre)
    D = Driver(B)
    sel = {}
    for c in (W, Bk):
        k = CK[c]
        sel[f"out_{k}"] = lambda r, c=c: 1 <= len(F(r, c, "out_any")) <= 3 and bool(F(r, c, "out_empty") or F(r, c, "out_own"))
        sel[f"outown_{k}"] = lambda r, c=c: bool(F(r, c, "out_own"))
        sel[f"hole_{k}"] = lambda r, c=c: 1 <= len(F(r, c, "holes")) <= 4
        sel[f"hole0_{k}"] = lambda r, c=c: len(F(r, c, "holes")) >= 1
        sel[f"space_{k}"] = lambda r, c=c: 1 <= F(r, c, "space_att") <= 9
        sel[f"pass1_{k}"] = lambda r, c=c: len(F(r, c, "passed")) == 1
        sel[f"blk_{k}"] = lambda r, c=c: bool(F(r, c, "blockaded_passed"))
        sel[f"unblk_{k}"] = lambda r, c=c: bool(set(F(r, c, "passed")) - set(F(r, c, "blockaded_passed")))
    sel["outmove"] = lambda r: 1 <= len(r["m"].get("to_outpost", [])) <= 3
    sel["blkmove"] = lambda r: 1 <= len(r["m"].get("blockades_passed", [])) <= 3
    sel["space_w_more"] = lambda r: r["f"]["w.space_att"] > r["f"]["b.space_att"]
    sel["space_b_more"] = lambda r: r["f"]["b.space_att"] > r["f"]["w.space_att"]
    sel["space_eq"] = lambda r: r["f"]["w.space_att"] == r["f"]["b.space_att"] and r["f"]["w.space_att"] > 0
    sel["space_ctl"] = lambda r: r["f"]["w.space_ctl"] > 0 and r["f"]["b.space_ctl"] > 0
    sel["any"] = lambda r: True
    recs, seen = psel.collect(sel, SEED, cap=600)
    print("selector matches:", {k: seen[k] for k in sorted(seen)})
    Q = QUOTA
    # outposts
    for c in (W, Bk):
        k = CK[c]
        D.run(f"out_sel_{k}", recs[f"out_{k}"], Q["out_sel"], t_out_select(c))
        D.run(f"out_pick_{k}", recs[f"out_{k}"][80:], Q["out_pick"], t_out_pick(c))
    D.run("out_move", recs["outmove"], Q["out_move"] * 2, t_out_move)
    for want in ("yes", "no"):
        for k, flag in (("w", True), ("b", False)):
            sub = []
            for r in recs[f"outown_{k}" if want == "yes" else f"out_{k}"]:
                r = dict(r); r["_c"] = flag; sub.append(r)
            D.run(f"out_yn_{want}_{k}", sub, Q["out_yn"] // 2 + 1 if False else 2, t_out_yn(want))
    pool = recs["out_w"][120:] + recs["out_b"][120:]
    D.run("out_pair", pool, Q["out_pair"],
          pair_make("out", lambda rec, board: [(c, s) for c in (W, Bk) for s in F(rec, c, "out_any") if board.piece_at(chess.parse_square(s)) is None or board.color_at(chess.parse_square(s)) == c],
                    lambda board, c, s: s in S.outpost_squares(board, c, "any"), ("push", "shift"), q_out, "POS.OUTPOST.D3", cl_out, why_out, ["POS.OUTPOST"], hints_out))
    # holes
    for c in (W, Bk):
        k = CK[c]
        D.run(f"hole_sel_{k}", recs[f"hole_{k}"], Q["hole_sel"], t_hole_select(c))
        D.run(f"hole_pick_{k}", recs[f"hole_{k}"][100:], Q["hole_pick"], t_hole_pick(c))
    for want in ("yes", "no"):
        for k, flag in (("w", True), ("b", False)):
            sub = []
            for r in recs[f"hole_{k}"][200:]:
                r = dict(r); r["_c"] = flag; sub.append(r)
            D.run(f"hole_yn_{want}_{k}", sub, 2, t_hole_yn(want))
    D.run("hole_pair", recs["hole_w"][300:] + recs["hole_b"][300:], Q["hole_pair"],
          pair_make("hole", lambda rec, board: [(c, s) for c in (W, Bk) for s in F(rec, c, "holes")], lambda board, c, s: s in S.hole_squares(board, c),
                    ("push", "shift"), q_hole, "POS.WEAKSQ.D3", cl_hole, why_hole, ["POS.WEAKSQ"], hints_hole))
    # space + centre
    for c in (W, Bk):
        k = CK[c]
        D.run(f"space_n_{k}", recs[f"space_{k}"], Q["space_n"], t_space_n(c))
        D.run(f"centre_n_{k}", recs["any"][:], Q["centre_n"], t_centre_n(c))
    D.run("space_ctl_w", recs["space_ctl"], Q["space_ctl"], t_space_n(W, "pawn_controlled"))
    D.run("space_ctl_b", recs["space_ctl"][100:], Q["space_ctl"], t_space_n(Bk, "pawn_controlled"))
    for nm in ("space_w_more", "space_b_more", "space_eq"):
        D.run(nm, recs[nm], Q["space_who"], t_space_who)
    D.run("space_pair", recs["space_w_more"][200:], Q["space_pair"],
          pair_make("space", lambda rec, board: [(W, None)], space_feat, ("push", "shift"),
                    lambda c, s: "Compare the pawns only. Do White's pawns attack MORE squares in Black's half (ranks 5 to 8) than Black's pawns attack in White's half (ranks 4 to 1)?",
                    "POS.SPACE.D3", cl_space, why_space, ["POS.SPACE"],
                    lambda c, s: ["Count the squares White's pawns attack in ranks 5 to 8.", "Then count the squares Black's pawns attack in ranks 4 to 1.", "Compare the two numbers."]))
    D.run("centre_who", recs["any"][50:], Q["centre_who"] + 4, t_centre_who)
    # pawn moves
    D.run("pm_holes", recs["any"][100:], Q["pm_holes"] + 6, t_pm_holes)
    for want in ("holes", "isolated", "backward", "none"):
        D.run(f"pm_class_{want}", recs["any"][200:], Q["pm_class"], t_pm_class(want))
    # blockade
    for c in (W, Bk):
        k = CK[c]
        D.run(f"blk_sq_{k}", recs[f"pass1_{k}"], Q["blk_sq"] // 2, t_blk_square(c))
    D.run("blk_move", recs["blkmove"], Q["blk_move"], t_blk_move)
    for want in ("yes", "no"):
        for k, flag in (("w", True), ("b", False)):
            sub = []
            for r in recs[f"blk_{k}" if want == "yes" else f"unblk_{k}"]:
                r = dict(r); r["_c"] = flag; sub.append(r)
            D.run(f"blk_yn_{want}_{k}", sub, 2, t_blk_yn(want))

    names = C.split_write(B, "squares", chunk=120)
    print("items", len(B.items), "per node", dict(B.by_node))
    print("made", dict(D.made))
    print("builder stats", dict(B.stats))
    print("precheck rejects", dict(pre.rejects))
    print("files", names)
    pre.close()


if __name__ == "__main__":
    main()
