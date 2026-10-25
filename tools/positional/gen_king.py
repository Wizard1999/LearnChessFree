"""Family A, the king's neighbourhood: pawn shield, holes next to the king after a pawn move, attackers against defenders around a
castled king, opposite-side castling and pawn levers against the shield. Exact claims; real calm Lichess positions (CC0).

    ./tools/.venv/Scripts/python.exe -I tools/positional/gen_king.py
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import chess
import pcommon as C
import psel
import structure as S
from pcommon import Cl, mk, CN, CT, PN, join_and, FILES
from pgen import Driver, random_for, number_options, YN
from generators.common import is_clean_for_counting

SEED = 20261104
W, Bk = chess.WHITE, chess.BLACK
CK = {W: "w", Bk: "b"}
Q = dict(sh_sel=3, sh_n=3, sh_new=5, sh_pick=4, cas_cmp=6, storm=3, lever=3)


def F(rec, c, key):
    return rec["f"][f"{CK[c]}.{key}"]


def kname(board, c):
    return chess.square_name(board.king(c))


def shield_words(board, c):
    k = board.king(c)
    return (f"the pawns on the three files centred on the {FILES[chess.square_file(k)]}-file, on the two ranks directly in front of the {CN[c]} king "
            f"(towards the enemy)")


def king_claims(board, c):
    k = kname(board, c)
    return Cl().add("piece_on", f"The {CN[c]} king stands on {k}.", square=k, piece="K" if c == W else "k")


def castled_like(board, c):
    k = board.king(c)
    return k is not None and S.rr(c, k) == 0 and chess.square_file(k) in (0, 1, 2, 5, 6, 7)


def t_sh_select(c):
    def make(rec, board):
        if not castled_like(board, c):
            return None
        ans = F(rec, c, "shield")
        if not 2 <= len(ans) <= 5:
            return None
        k = kname(board, c)
        cl = king_claims(board, c).add("king_pawn_shield", f"The pawns shielding the {CN[c]} king are exactly {join_and(ans)}.", color=CN[c], squares=sorted(ans))
        item = mk("DEF.SHELTER.D1", 1, "select_squares",
                  f"{CT[c]}'s king stands on {k}. Tap every pawn that shelters it: {shield_words(board, c)}.",
                  {"squares": sorted(ans)}, cl, ["DEF.SHELTER"],
                  [f"Look at the squares directly in front of the king on {k}: the same file and the two files beside it.", "Two ranks count: the rank right in front of the king and the one after.",
                   f"{len(ans)} pawns shelter the king."],
                  f"The pawns on {join_and(sorted(ans))} shelter the {CN[c]} king. The other squares of the shield area hold no {CN[c]} pawn.", C.fam(rec), tpl="sh-select")
        return [(board, item, C.prov(rec), "sh-select")]
    return make


def t_sh_n(c):
    def make(rec, board):
        if not castled_like(board, c):
            return None
        ans = F(rec, c, "shield")
        area = sorted(chess.square_name(s) for s in S.king_shield_squares(board, c))
        rng = random_for(rec, "shn")
        opts = number_options(rng, len(ans), 0, len(area))
        k = kname(board, c)
        cl = king_claims(board, c).add("king_pawn_shield", f"The pawns shielding the {CN[c]} king are exactly {join_and(ans, 'none')}.", color=CN[c], squares=sorted(ans))
        item = mk("DEF.SHELTER.D1", 1, "classify_position",
                  f"{CT[c]}'s king stands on {k}. Its shield area is {len(area)} squares ({join_and(area)}). How many of them hold a {CN[c]} pawn?",
                  {"class": str(len(ans))}, cl, ["DEF.SHELTER"],
                  ["Check the squares of the shield area one by one.", "Only pawns of the king's own colour count.", f"The answer is {max(0, len(ans) - 1)}, {len(ans)} or {min(len(area), len(ans) + 1)}."],
                  f"{CT[c]} pawns stand on {join_and(ans, 'none of the shield squares')}: {len(ans)} of the {len(area)} squares.", C.fam(rec), options=opts, tpl="sh-n")
        return [(board, item, C.prov(rec), "sh-n")]
    return make


def push_diff(board, move, c):
    nb = board.copy(stack=False)
    nb.push(move)
    before, after = S.hole_squares(board, c), S.hole_squares(nb, c)
    return before, after, sorted(set(after) - set(before))


def near_king(board, c, squares):
    kf = chess.square_file(board.king(c))
    return all(abs(chess.square_file(chess.parse_square(s)) - kf) <= 2 for s in squares)


def t_sh_new(rec, board):
    c = board.turn
    if not castled_like(board, c):
        return None
    k = board.king(c)
    rng = random_for(rec, "shnew")
    shield_sq = set(S.king_shield_squares(board, c))
    moves = [m for m in board.legal_moves if board.piece_type_at(m.from_square) == chess.PAWN and not board.is_capture(m) and not m.promotion and m.from_square in shield_sq]
    rng.shuffle(moves)
    for m in moves:
        before, after, new = push_diff(board, m, c)
        if not 1 <= len(new) <= 3 or not near_king(board, c, new):
            continue
        san = board.san(m)
        cl = (king_claims(board, c)
              .add("holes", f"Before {san} the holes in {CT[c]}'s camp are {join_and(before, 'none')}.", color=CN[c], squares=before)
              .add("holes", f"After {san} the holes in {CT[c]}'s camp are {join_and(after, 'none')}.", color=CN[c], squares=after, after_move=m.uci()))
        item = mk("DEF.SHELTER.D1", 1, "select_squares",
                  f"{CT[c]}'s king stands on {kname(board, c)}. {CT[c]} is thinking of {san}. Tap the squares in {CT[c]}'s camp that become holes because of this move "
                  f"(squares no {CN[c]} pawn can attack now or by advancing, which were not holes before).",
                  {"squares": new}, cl, ["DEF.SHELTER", "POS.PAWNMOVE"],
                  [f"Which squares did the pawn on {chess.square_name(m.from_square)} guard?", "Which of those can no other pawn of yours ever guard?",
                   f"{len(new)} square{'s' if len(new) != 1 else ''}, near the {new[0][0]}-file."],
                  f"After {san} the new holes are {join_and(new)}. Whether an enemy piece can use a hole near the king is a separate question; this item does not claim that any can.",
                  C.fam(rec), tpl="sh-new", extra=("move.pawn",))
        return [(board, item, C.prov(rec), "sh-new")]
    return None


def t_sh_pick(rec, board):
    c = board.turn
    if not castled_like(board, c):
        return None
    rng = random_for(rec, "shpick")
    shield_sq = set(S.king_shield_squares(board, c))
    moves = [m for m in board.legal_moves if board.piece_type_at(m.from_square) == chess.PAWN and not board.is_capture(m) and not m.promotion and m.from_square in shield_sq]
    good, bad = [], []
    for m in moves:
        before, after, new = push_diff(board, m, c)
        (good if new and near_king(board, c, new) else bad if not new else []).append(m)
    if not good or len(bad) < 3:
        return None
    gm = rng.choice(good)
    others = rng.sample(bad, 3)
    opts = [board.san(m) for m in others + [gm]]
    if len(set(opts)) < 4:
        return None
    rng.shuffle(opts)
    before, after, new = push_diff(board, gm, c)
    cl = king_claims(board, c).add("holes", f"Before any move the holes in {CT[c]}'s camp are {join_and(before, 'none')}.", color=CN[c], squares=before)
    for m in others + [gm]:
        _, a, nw = push_diff(board, m, c)
        cl.add("holes", f"After {board.san(m)} the holes in {CT[c]}'s camp are {join_and(a, 'none')}.", color=CN[c], squares=a, after_move=m.uci())
    item = mk("DEF.SHELTER.D1", 1, "classify_position",
              f"{CT[c]} to move, king on {kname(board, c)}. Exactly one of these pawn moves in front of the king leaves a NEW hole in {CT[c]}'s camp (a square no {CN[c]} pawn can ever attack, not a hole before). Which one?",
              {"class": board.san(gm)}, cl, ["DEF.SHELTER", "POS.PAWNMOVE"],
              ["For each move ask: which squares did this pawn guard, and can another pawn still guard them?", "Check the squares the moving pawn leaves behind, in front of the king.",
               f"The move is made by the pawn on the {chess.square_name(gm.from_square)[0]}-file."],
              f"After {board.san(gm)} the new hole{'s' if len(new) != 1 else ''}: {join_and(new)}. The other three moves create no new hole in {CT[c]}'s camp. "
              f"Whether an enemy piece can use a hole is not part of this item.", C.fam(rec), options=opts, tpl="sh-pick", extra=("move.pawn",))
    return [(board, item, C.prov(rec), "sh-pick")]


def t_cas_cmp(want):
    """king owner = e, attacker = a (the side NOT owning the king). Compare attackers and defenders of a square next to the castled king."""
    def make(rec, board):
        rng = random_for(rec, "casc")
        cs = [W, Bk]
        rng.shuffle(cs)
        for e in cs:
            if not castled_like(board, e):
                continue
            a = not e
            k = board.king(e)
            d = 1 if e == W else -1
            kf, kr = chess.square_file(k), chess.square_rank(k)
            cand = []
            for df in (-1, 0, 1):
                f2, r2 = kf + df, kr + d
                if 0 <= f2 <= 7 and 0 <= r2 <= 7:
                    cand.append(chess.square(f2, r2))
            rng.shuffle(cand)
            for sq in cand:
                if not is_clean_for_counting(board, [sq], allow_king_attackers=True):
                    continue
                na, nd = len(board.attackers(a, sq)), len(board.attackers(e, sq))
                if na == 0 and nd == 0:
                    continue
                rel = "attackers" if na > nd else "equal" if na == nd else "defenders"
                if rel != want:
                    continue
                s = chess.square_name(sq)
                opts = ["More attackers than defenders", "Equal numbers", "More defenders than attackers"]
                ans = {"attackers": opts[0], "equal": opts[1], "defenders": opts[2]}[rel]
                cl = (Cl().add("piece_on", f"The {CN[e]} king stands on {kname(board, e)}.", square=kname(board, e), piece="K" if e == W else "k")
                      .add("attackers", f"{CT[a]} pieces attacking {s}: {na}.", square=s, color=CN[a], count=na)
                      .add("attackers", f"{CT[e]} pieces defending {s}: {nd}.", square=s, color=CN[e], count=nd))
                item = mk("ATK.CASTLED.D1", 1, "classify_position",
                          f"{CT[e]}'s king stands on {kname(board, e)}. Count the {CN[a]} pieces that attack {s}, the square in front of the king, and the {CN[e]} pieces that defend it (attack it from {CT[e]}'s side, the king included). Which is true?",
                          {"class": ans}, cl, ["ATK.CASTLED"],
                          [f"List every {CN[a]} piece that attacks {s}.", f"Then list every {CN[e]} piece that also attacks {s}, the king too.", f"The counts are {na} against {nd}."][:2] + ["Compare the two lists."],
                          f"{CT[a]} attacks {s} {na} time{'s' if na != 1 else ''}; {CT[e]} defends it {nd} time{'s' if nd != 1 else ''}. This counts direct attacks only (pins and batteries are not considered); it does not decide whether an attack works.",
                          C.fam(rec), options=opts, tpl="cas-cmp")
                return [(board, item, C.prov(rec), "cas-cmp")]
        return None
    return make


STORM_OPTS = ["Yes: the kings are on opposite wings", "No: both kings are on the same wing", "At least one king has not gone to a wing"]


def t_storm(rec, board):
    wk, bk = F(rec, W, "kwing"), F(rec, Bk, "kwing")
    if wk is None or bk is None:
        return None
    if "centre" in (wk, bk):
        ans = STORM_OPTS[2]
    elif wk != bk:
        ans = STORM_OPTS[0]
    else:
        ans = STORM_OPTS[1]
    cl = Cl().add("king_wing", f"The white king is on the {wk} wing (files a-c queenside, d-e centre, f-h kingside).", color="white", wing=wk).add("king_wing", f"The black king is on the {bk} wing.", color="black", wing=bk)
    item = mk("ATK.PAWNSTORM.D1", 1, "classify_position",
              "Opposite-side castling means the kings stand on opposite wings (files a-c queenside, f-h kingside). Is that the case here?",
              {"class": ans}, cl, ["ATK.PAWNSTORM"],
              ["Find each king.", "Files a to c are the queenside, files f to h the kingside; the d and e files are the centre.", "Compare the two sides."],
              f"The white king stands {('in the centre' if wk == 'centre' else 'on the ' + wk)} ({kname(board, W)}) and the black king {('in the centre' if bk == 'centre' else 'on the ' + bk)} ({kname(board, Bk)}). Opposite wings is the starting point for a pawn storm; it does not say a storm is good.",
              C.fam(rec), options=STORM_OPTS, tpl="storm")
    return [(board, item, C.prov(rec), "storm")]


def t_lever(rec, board):
    c = board.turn
    e = not c
    if not castled_like(board, e):
        return None
    shield = S.king_pawn_shield(board, e)
    if len(shield) < 2:
        return None
    per = {s: S.moves_where(board, "pawn_move_attacks", s) for s in shield}
    allm = sorted({m for v in per.values() for m in v})
    if not 1 <= len(allm) <= 3:
        return None
    sn = [board.san(chess.Move.from_uci(m)) for m in allm]
    cl = king_claims(board, e).add("king_pawn_shield", f"The pawns shielding the {CN[e]} king are exactly {join_and(shield)}.", color=CN[e], squares=shield)
    for s, mv in per.items():
        cl.add("moves_where", f"The pawn moves after which the moved pawn attacks {s} are exactly {join_and([board.san(chess.Move.from_uci(m)) for m in mv], 'none')}.", property="pawn_move_attacks", square=s, moves=mv)
    item = mk("ATK.PAWNSTORM.D1", 1, "find_move",
              f"{CT[c]} to move. {CT[e]}'s king is on {kname(board, e)}, sheltered by pawns on {join_and(shield)}. Play a pawn move after which the moved pawn attacks one of those shield pawns (a pawn lever).",
              {"moves": allm}, cl, ["ATK.PAWNSTORM", "POS.BREAKS"],
              ["Name the shield pawns first.", "A pawn attacks the two squares diagonally in front of it: which of your pawns can step to a square that hits a shield pawn?", f"There {'is' if len(allm) == 1 else 'are'} {len(allm)} such move{'s' if len(allm) != 1 else ''}."],
              f"After {join_and(sn)} the moved pawn attacks a pawn that shelters the {CN[e]} king. The item asks only for the lever; it does not claim a storm is sound here.",
              C.fam(rec), tpl="lever", extra=("lever.attacks-shield",))
    return [(board, item, C.prov(rec), "lever")]


def main():
    reg = C.make_registry("king")
    pre = C.PreCheck()
    B = C.PBuilder("KING", "king", SEED, reg, pre)
    D = Driver(B)
    sel = {"any": lambda r: True,
           "opp": lambda r: r["f"]["w.kwing"] in ("queenside", "kingside") and r["f"]["b.kwing"] in ("queenside", "kingside") and r["f"]["w.kwing"] != r["f"]["b.kwing"],
           "same": lambda r: r["f"]["w.kwing"] in ("queenside", "kingside") and r["f"]["w.kwing"] == r["f"]["b.kwing"],
           "centre": lambda r: "centre" in (r["f"]["w.kwing"], r["f"]["b.kwing"])}
    recs, seen = psel.collect(sel, SEED, cap=1200)
    print("selector matches:", {k: seen[k] for k in sorted(seen)})
    anyr = recs["any"]
    D.run("sh_sel_w", anyr[:400], Q["sh_sel"], t_sh_select(W))
    D.run("sh_sel_b", anyr[400:800], Q["sh_sel"], t_sh_select(Bk))
    D.run("sh_n_w", anyr[800:], Q["sh_n"], t_sh_n(W))
    D.run("sh_n_b", anyr[1000:], Q["sh_n"], t_sh_n(Bk))
    D.run("sh_new", anyr[200:], Q["sh_new"], t_sh_new)
    D.run("sh_pick", anyr[300:], Q["sh_pick"], t_sh_pick)
    for want in ("attackers", "equal", "defenders"):
        D.run("cas_" + want, anyr[500:], Q["cas_cmp"], t_cas_cmp(want))
    D.run("storm_opp", recs["opp"], Q["storm"], t_storm)
    D.run("storm_same", recs["same"], Q["storm"] - 1, t_storm)
    D.run("storm_centre", recs["centre"], Q["storm"] - 1, t_storm)
    D.run("lever", anyr[600:], Q["lever"] * 2, t_lever)
    names = C.split_write(B, "king", chunk=120)
    print("items", len(B.items), "per node", dict(B.by_node))
    print("made", dict(D.made))
    print("builder stats", dict(B.stats))
    print("precheck rejects", dict(pre.rejects))
    print("files", names)
    pre.close()


if __name__ == "__main__":
    main()
