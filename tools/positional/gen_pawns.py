"""Family A, pawn structure recognition (exact): isolated / doubled / backward / weak-pawn census, passed pawns, majorities,
isolated queen's pawn, chains, hanging pawns, targets, with near-miss contrast pairs (one pawn moved or shifted, answer flips).

    ./tools/.venv/Scripts/python.exe -I tools/positional/gen_pawns.py

Output: content/items/pos-pawns-<k>.json (claims: pawn_set, pawn_islands, open_files, piece_on, moves_where ... all exact, no engine).
Every answer is derived from the same sets the claims assert. Positions are real calm Lichess positions (CC0) or one-pawn edits of them.
"""
import sys
from collections import Counter
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import chess
import pcommon as C
import psel
from pgen import Driver, random_for, pair_make
import structure as S
from pcommon import Cl, mk, CN, CT, join_and, files_phrase, FILES

SEED = 20261101
QP = {'iso': 3, 'back': 3, 'passed': 4, 'hang': 4}      # pairs per feature (each pair = 2 items)
W, Bk = chess.WHITE, chess.BLACK
CK = {W: "w", Bk: "b"}


def F(rec, c, key):
    return rec["f"][f"{CK[c]}.{key}"]


def sqs(lst):
    return join_and(sorted(lst), "none")


def pc_(c):
    return CN[c]


def weak_union(rec, c):
    return sorted(set(F(rec, c, "isolated")) | set(F(rec, c, "doubled")) | set(F(rec, c, "backward")))


def d_file(sq):
    return sq[0] == "d"


# ----------------------------------------------------------------------------------------------------------------
# selectors
# ----------------------------------------------------------------------------------------------------------------
def build_selectors():
    sel = {}
    for c in (W, Bk):
        k = CK[c]
        sel[f"iso_{k}"] = lambda r, c=c: 1 <= len(F(r, c, "isolated")) <= 3
        sel[f"dbl_{k}"] = lambda r, c=c: 2 <= len(F(r, c, "doubled")) <= 4
        sel[f"back_{k}"] = lambda r, c=c: 1 <= len(F(r, c, "backward")) <= 2
        sel[f"wu_{k}"] = lambda r, c=c: 1 <= len(weak_union(r, c)) <= 5
        for n in (0, 1, 2, 3):
            sel[f"wc{n}_{k}"] = (lambda r, c=c, n=n: (len(weak_union(r, c)) == n) if n < 3 else (len(weak_union(r, c)) >= 3))
        sel[f"pp_{k}"] = lambda r, c=c: 1 <= len(F(r, c, "protected_passed")) <= 2
        sel[f"cp_{k}"] = lambda r, c=c: len(F(r, c, "connected_passed")) == 2
        sel[f"maj_{k}"] = lambda r, c=c: 3 <= len(F(r, c, "majority_side")) <= 5 and len({"q" if s[0] < "e" else "k" for s in F(r, c, "majority_side")}) == 1
        sel[f"hang_{k}"] = lambda r, c=c: len(F(r, c, "hanging_pair")) == 2
        sel[f"chain_{k}"] = lambda r, c=c: len(F(r, c, "chain_base")) == 1 and len(F(r, c, "protected")) >= 2
        sel[f"tgt_{k}"] = lambda r, c=c: any(sq[0] in r["f"]["files"]["half_open_" + CN[not c]] for sq in F(r, c, "backward"))
        sel[f"iqp_{k}"] = lambda r, c=c: sum(1 for s in F(r, c, "isolated") if d_file(s)) == 1
    sel["any"] = lambda r: True
    sel["pass_any"] = lambda r: 1 <= len(r["f"]["w.passed"]) + len(r["f"]["b.passed"]) <= 4
    sel["pass_w_only"] = lambda r: r["f"]["w.passed"] and not r["f"]["b.passed"]
    sel["pass_b_only"] = lambda r: r["f"]["b.passed"] and not r["f"]["w.passed"]
    sel["pass_both"] = lambda r: r["f"]["w.passed"] and r["f"]["b.passed"]
    sel["pass_none"] = lambda r: not r["f"]["w.passed"] and not r["f"]["b.passed"]
    sel["maj_none"] = lambda r: not r["f"]["w.majority_side"]
    sel["maj_both"] = lambda r: len({"q" if s[0] < "e" else "k" for s in r["f"]["w.majority_side"]}) == 2
    sel["maj_q"] = lambda r: r["f"]["w.majority_side"] and all(s[0] < "e" for s in r["f"]["w.majority_side"])
    sel["maj_k"] = lambda r: r["f"]["w.majority_side"] and all(s[0] >= "e" for s in r["f"]["w.majority_side"])
    sel["iqp_w"] = lambda r: sum(1 for s in r["f"]["w.isolated"] if d_file(s)) == 1 and not any(d_file(s) for s in r["f"]["b.isolated"])
    sel["iqp_b"] = lambda r: sum(1 for s in r["f"]["b.isolated"] if d_file(s)) == 1 and not any(d_file(s) for s in r["f"]["w.isolated"])
    sel["iqp_both"] = lambda r: any(d_file(s) for s in r["f"]["w.isolated"]) and any(d_file(s) for s in r["f"]["b.isolated"])
    sel["iqp_none"] = lambda r: not any(d_file(s) for s in r["f"]["w.isolated"]) and not any(d_file(s) for s in r["f"]["b.isolated"]) \
        and (r["f"]["w.isolated"] or r["f"]["b.isolated"])
    return sel


# ----------------------------------------------------------------------------------------------------------------
# generic driver
# ----------------------------------------------------------------------------------------------------------------
# ----------------------------------------------------------------------------------------------------------------
# templates
# ----------------------------------------------------------------------------------------------------------------
H_SCAN = "Take the pawns one at a time and look at the files beside each one."


def count_hint(n, what):
    return f"There {'is' if n == 1 else 'are'} {n} {what}."


def t_iso_select(c):
    def make(rec, board):
        ans = F(rec, c, "isolated")
        cl = Cl().add("pawn_set", f"The isolated {CN[c]} pawns are exactly {sqs(ans)}.", kind="isolated", color=CN[c], squares=sorted(ans))
        parts = [f"{s} (no {CT[c]} pawn on the {' or '.join(f + '-file' for f in C.neighbour_files(s))})" for s in sorted(ans)]
        item = mk("POS.PAWNWEAK.D1", 1, "select_squares",
                  f"Tap every isolated {CN[c]} pawn. A pawn is isolated when no pawn of its own colour stands on either neighbouring file (on any rank).",
                  {"squares": sorted(ans)}, cl, ["POS.PAWNWEAK"],
                  [H_SCAN, "For each pawn ask: is there a friendly pawn on the file to its left or to its right, anywhere on the board?",
                   count_hint(len(ans), f"isolated {CN[c]} pawn" + ("" if len(ans) == 1 else "s")) + f" One is on the {sorted(ans)[0][0]}-file."],
                  f"Isolated {CN[c]} pawn{'s' if len(ans) > 1 else ''}: {'; '.join(parts)}. Every other {CN[c]} pawn has a friendly pawn on a neighbouring file.",
                  C.fam(rec), tpl="iso-select")
        return [(board, item, C.prov(rec), "iso-select")]
    return make


def t_dbl_select(c):
    def make(rec, board):
        ans = F(rec, c, "doubled")
        cl = Cl().add("pawn_set", f"The doubled {CN[c]} pawns are exactly {sqs(ans)}.", kind="doubled", color=CN[c], squares=sorted(ans))
        byf = {}
        for s in ans:
            byf.setdefault(s[0], []).append(s)
        parts = [f"the {f}-file holds {join_and(sorted(v))}" for f, v in sorted(byf.items())]
        item = mk("POS.PAWNWEAK.D1", 1, "select_squares",
                  f"Tap every doubled {CN[c]} pawn: a pawn that shares its file with another pawn of its own colour.",
                  {"squares": sorted(ans)}, cl, ["POS.PAWNWEAK", "POS.STRUCTURE.DOUBLED"],
                  ["Look for two pawns of the same colour on one file.", "Count the pawns of that colour on each file: any file with two or more has doubled pawns.",
                   f"{len(ans)} pawns are doubled; they stand on {files_phrase(sorted(byf))}."],
                  f"Doubled {CN[c]} pawns: {'; '.join(parts)}.", C.fam(rec), tpl="dbl-select")
        return [(board, item, C.prov(rec), "dbl-select")]
    return make


def backward_text(board, c, sq):
    s = chess.parse_square(sq)
    nb = sorted(chess.square_name(q) for q in board.pieces(chess.PAWN, c) if abs(chess.square_file(q) - chess.square_file(s)) == 1)
    st = chess.square_name(S.stop_square(c, s))
    return f"{sq} is backward: its neighbouring {CN[c]} pawn{'s' if len(nb) > 1 else ''} ({join_and(nb)}) {'have' if len(nb) > 1 else 'has'} advanced further, and the square in front of it, {st}, is attacked by a {CN[not c]} pawn"


def t_back_select(c):
    def make(rec, board):
        ans = F(rec, c, "backward")
        cl = Cl().add("pawn_set", f"The backward {CN[c]} pawns are exactly {sqs(ans)}.", kind="backward", color=CN[c], squares=sorted(ans))
        item = mk("POS.PAWNWEAK.D2", 1, "select_squares",
                  f"Tap every backward {CN[c]} pawn. A pawn is backward when it has a friendly pawn on a neighbouring file but every such pawn has advanced further (closer to the enemy side), "
                  f"and an enemy pawn attacks the square directly in front of it.",
                  {"squares": sorted(ans)}, cl, ["POS.PAWNWEAK", "POS.TARGET"],
                  ["Start with pawns that have a neighbour on a side file but whose neighbours are all more advanced.",
                   "For those pawns, look at the square directly in front: does an enemy pawn attack it?",
                   count_hint(len(ans), f"backward {CN[c]} pawn" + ("" if len(ans) == 1 else "s")) + f" One is on the {sorted(ans)[0][0]}-file."],
                  "; ".join(backward_text(board, c, s) for s in sorted(ans)) + ".", C.fam(rec), tpl="back-select")
        return [(board, item, C.prov(rec), "back-select")]
    return make


def t_weak_union(c):
    def make(rec, board):
        iso, dbl, bk = F(rec, c, "isolated"), F(rec, c, "doubled"), F(rec, c, "backward")
        ans = weak_union(rec, c)
        cl = (Cl().add("pawn_set", f"Isolated {CN[c]} pawns: {sqs(iso)}.", kind="isolated", color=CN[c], squares=sorted(iso))
              .add("pawn_set", f"Doubled {CN[c]} pawns: {sqs(dbl)}.", kind="doubled", color=CN[c], squares=sorted(dbl))
              .add("pawn_set", f"Backward {CN[c]} pawns: {sqs(bk)}.", kind="backward", color=CN[c], squares=sorted(bk)))
        item = mk("POS.PAWNWEAK.D1", 2, "select_squares",
                  f"Tap every weak {CN[c]} pawn. Count a pawn as weak if it is isolated, doubled or backward.",
                  {"squares": ans}, cl, ["POS.PAWNWEAK"],
                  ["Check each pawn against three tests: isolated, doubled, backward.",
                   "Isolated: no friendly pawn on a neighbouring file. Doubled: another friendly pawn on the same file. Backward: neighbours only further advanced and an enemy pawn attacks the square in front.",
                   count_hint(len(ans), "weak pawn" + ("" if len(ans) == 1 else "s")) + " Check the " + FILES[min(chess.square_file(chess.parse_square(s)) for s in ans)] + "-file first."],
                  f"Isolated: {sqs(iso)}. Doubled: {sqs(dbl)}. Backward: {sqs(bk)}. Together {len(ans)} weak {CN[c]} pawn{'s' if len(ans) != 1 else ''}.",
                  C.fam(rec), tpl="weak-union")
        return [(board, item, C.prov(rec), "weak-union")]
    return make


def t_weak_count(c):
    def make(rec, board):
        iso, dbl, bk = F(rec, c, "isolated"), F(rec, c, "doubled"), F(rec, c, "backward")
        n = len(weak_union(rec, c))
        opts = ["0", "1", "2", "3 or more"]
        ans = opts[min(n, 3)]
        cl = (Cl().add("pawn_set", f"Isolated {CN[c]} pawns: {sqs(iso)}.", kind="isolated", color=CN[c], squares=sorted(iso))
              .add("pawn_set", f"Doubled {CN[c]} pawns: {sqs(dbl)}.", kind="doubled", color=CN[c], squares=sorted(dbl))
              .add("pawn_set", f"Backward {CN[c]} pawns: {sqs(bk)}.", kind="backward", color=CN[c], squares=sorted(bk)))
        item = mk("POS.PAWNWEAK.D2", 2, "classify_position",
                  f"How many of {CT[c]}'s pawns are weak? Count a pawn once if it is isolated, doubled or backward (or several of these).",
                  {"class": ans}, cl, ["POS.PAWNWEAK"],
                  ["Test each pawn of that colour: neighbours on the side files, partners on the same file, the square in front.",
                   "Weak here means isolated (no friendly pawn on a side file), doubled (shares a file) or backward (neighbours only ahead, front square attacked by an enemy pawn).",
                   "Do not count a pawn twice if it fits two tests."],
                  f"Isolated: {sqs(iso)}. Doubled: {sqs(dbl)}. Backward: {sqs(bk)}. That makes {n} weak {CN[c]} pawn{'s' if n != 1 else ''} by this definition.",
                  C.fam(rec), options=opts, tpl="weak-count")
        return [(board, item, C.prov(rec), "weak-count")]
    return make


def t_kind(c):
    def make(rec, board):
        iso, dbl, bk = set(F(rec, c, "isolated")), set(F(rec, c, "doubled")), set(F(rec, c, "backward"))
        allp = sorted(chess.square_name(s) for s in board.pieces(chess.PAWN, c))
        rng = random_for(rec)
        cands = []
        for s in allp:
            n = (s in iso) + (s in dbl) + (s in bk)
            if n == 1:
                cands.append((s, "isolated" if s in iso else "doubled" if s in dbl else "backward"))
            elif n == 0:
                cands.append((s, "none of these"))
        want = rec.get("_want")
        pool = [x for x in cands if want is None or x[1] == want]
        if not pool:
            return None
        sq, ans = rng.choice(pool)
        opts = ["isolated", "doubled", "backward", "none of these"]
        cl = (Cl().add("pawn_set", f"Isolated {CN[c]} pawns: {sqs(iso)}.", kind="isolated", color=CN[c], squares=sorted(iso))
              .add("pawn_set", f"Doubled {CN[c]} pawns: {sqs(dbl)}.", kind="doubled", color=CN[c], squares=sorted(dbl))
              .add("pawn_set", f"Backward {CN[c]} pawns: {sqs(bk)}.", kind="backward", color=CN[c], squares=sorted(bk)))
        if ans == "isolated":
            why = f"No {CT[c]} pawn stands on the {' or '.join(f + '-file' for f in C.neighbour_files(sq))}, so the pawn on {sq} is isolated."
        elif ans == "doubled":
            why = f"Another {CT[c]} pawn shares the {sq[0]}-file with the pawn on {sq}, so it is doubled."
        elif ans == "backward":
            why = backward_text(board, c, sq) + "."
        else:
            why = f"The pawn on {sq} is not in the isolated, doubled or backward sets of {CT[c]}'s pawns."
        item = mk("POS.PAWNWEAK.D1", 2, "classify_position",
                  f"Look at the {CN[c]} pawn on {sq}. Which description fits it? (Isolated: no friendly pawn on a side file. Doubled: shares its file with a friendly pawn. Backward: neighbours only further advanced and an enemy pawn attacks the square in front.)",
                  {"class": ans}, cl, ["POS.PAWNWEAK"],
                  ["Check the files on either side of the pawn first.", "Then check whether another friendly pawn stands on its own file.",
                   "If it has side-file neighbours that are all further advanced, look at the square directly in front of it."],
                  why, C.fam(rec), options=opts, tpl="pawn-kind")
        return [(board, item, C.prov(rec), "pawn-kind")]
    return make


# ---- passed pawns
def passed_why(board, c, sq):
    f = chess.square_file(chess.parse_square(sq))
    files = [FILES[x] for x in (f - 1, f, f + 1) if 0 <= x <= 7]
    return f"No {CN[not c]} pawn stands ahead of {sq} on the {', '.join(files[:-1])} or {files[-1]} file" if len(files) > 1 else sq


def t_passed_select():
    def make(rec, board):
        wp, bp = rec["f"]["w.passed"], rec["f"]["b.passed"]
        ans = sorted(wp + bp)
        cl = (Cl().add("pawn_set", f"White's passed pawns: {sqs(wp)}.", kind="passed", color="white", squares=sorted(wp))
              .add("pawn_set", f"Black's passed pawns: {sqs(bp)}.", kind="passed", color="black", squares=sorted(bp)))
        parts = [passed_why(board, W, s) for s in sorted(wp)] + [passed_why(board, Bk, s) for s in sorted(bp)]
        item = mk("POS.PASSED.D1", 1, "select_squares",
                  "Tap every passed pawn, White's and Black's. A pawn is passed when no enemy pawn stands ahead of it on its own file or on either neighbouring file.",
                  {"squares": ans}, cl, ["POS.PASSED"],
                  ["Take each pawn and look forward, towards the side it is marching to.", "Check three files: its own and the two beside it. Is there an enemy pawn in front of your pawn, between it and the promotion square, on any of them?",
                   count_hint(len(ans), "passed pawn" + ("" if len(ans) == 1 else "s")) + " (both colours together)."],
                  "; ".join(parts) + ".", C.fam(rec), tpl="passed-select")
        return [(board, item, C.prov(rec), "passed-select")]
    return make


def t_prot_passed(c):
    def make(rec, board):
        pp = F(rec, c, "protected_passed")
        ps = F(rec, c, "passed")
        cl = (Cl().add("pawn_set", f"{CT[c]}'s passed pawns: {sqs(ps)}.", kind="passed", color=CN[c], squares=sorted(ps))
              .add("pawn_set", f"{CT[c]}'s protected passed pawns: {sqs(pp)}.", kind="protected_passed", color=CN[c], squares=sorted(pp)))
        item = mk("POS.PASSED.D1", 1, "select_squares",
                  f"Tap every protected passed {CN[c]} pawn: a passed pawn that is defended by another pawn of its own colour.",
                  {"squares": sorted(pp)}, cl, ["POS.PASSED"],
                  ["First find the passed pawns of that colour.", "Then ask which of them is defended by a friendly pawn standing diagonally behind it.",
                   count_hint(len(pp), "protected passed pawn" + ("" if len(pp) == 1 else "s")) + f" There {'is' if len(ps) == 1 else 'are'} {len(ps)} passed pawn{'s' if len(ps) != 1 else ''} in all."],
                  f"{CT[c]}'s passed pawns are {sqs(ps)}; of these {sqs(pp)} {'is' if len(pp) == 1 else 'are'} defended by a {CN[c]} pawn.",
                  C.fam(rec), tpl="prot-passed")
        return [(board, item, C.prov(rec), "prot-passed")]
    return make


def t_conn_passed(c):
    def make(rec, board):
        cp = F(rec, c, "connected_passed")
        ps = F(rec, c, "passed")
        cl = (Cl().add("pawn_set", f"{CT[c]}'s passed pawns: {sqs(ps)}.", kind="passed", color=CN[c], squares=sorted(ps))
              .add("pawn_set", f"{CT[c]}'s connected passed pawns: {sqs(cp)}.", kind="connected_passed", color=CN[c], squares=sorted(cp)))
        item = mk("POS.PASSED.D1", 1, "select_squares",
                  f"Tap the connected passed {CN[c]} pawns: passed pawns on neighbouring files that stand on the same rank or one rank apart.",
                  {"squares": sorted(cp)}, cl, ["POS.PASSED"],
                  ["Find all the passed pawns of that colour first.", "Connected passed pawns need to be on adjacent files, no more than one rank apart.",
                   f"Two pawns, one on the {sorted(cp)[0][0]}-file."],
                  f"Passed {CN[c]} pawns: {sqs(ps)}. {sorted(cp)[0]} and {sorted(cp)[1]} are on neighbouring files and no more than a rank apart.",
                  C.fam(rec), tpl="conn-passed")
        return [(board, item, C.prov(rec), "conn-passed")]
    return make


def t_passed_cat():
    def make(rec, board):
        wp, bp = rec["f"]["w.passed"], rec["f"]["b.passed"]
        opts = ["White has a passed pawn and Black has none", "Black has a passed pawn and White has none", "Both sides have a passed pawn", "Neither side has a passed pawn"]
        ans = opts[0] if wp and not bp else opts[1] if bp and not wp else opts[2] if wp and bp else opts[3]
        cl = (Cl().add("pawn_set", f"White's passed pawns: {sqs(wp)}.", kind="passed", color="white", squares=sorted(wp))
              .add("pawn_set", f"Black's passed pawns: {sqs(bp)}.", kind="passed", color="black", squares=sorted(bp)))
        item = mk("POS.PASSED.D1", 1, "classify_position", "Which statement about passed pawns is correct for this position?", {"class": ans}, cl, ["POS.PASSED"],
                  ["Check each side separately.", "A pawn is passed when no enemy pawn is ahead of it on its own or a neighbouring file.",
                   "Look at the pawns that have the fewest enemy pawns in front of them."],
                  f"White's passed pawns: {sqs(wp)}. Black's passed pawns: {sqs(bp)}.", C.fam(rec), options=opts, tpl="passed-cat")
        return [(board, item, C.prov(rec), "passed-cat")]
    return make


# ---- majorities
def wing_name(sq):
    return "queenside" if sq[0] < "e" else "kingside"


def t_maj_select(c):
    def make(rec, board):
        ans = F(rec, c, "majority_side")
        wing = wing_name(ans[0])
        wc = S.wing_counts(board, c)[wing]
        cl = (Cl().add("pawn_set", f"{CT[c]}'s majority pawns: {sqs(ans)}.", kind="majority_side", color=CN[c], squares=sorted(ans))
              .add("wing_pawns", f"{CT[c]} has {wc[0]} pawn(s) on the {wing}.", color=CN[c], wing=wing, count=wc[0])
              .add("wing_pawns", f"{CT[not c]} has {wc[1]} pawn(s) on the {wing}.", color=CN[not c], wing=wing, count=wc[1]))
        item = mk("POS.MAJORITY.D1", 1, "select_squares",
                  f"Tap the pawns that form {CT[c]}'s pawn majority. Split the board into the queenside (files a to d) and the kingside (files e to h): a side has a majority on a wing when it has more pawns there than the opponent.",
                  {"squares": sorted(ans)}, cl, ["POS.MAJORITY"],
                  ["Count the pawns of each colour on the queenside, then on the kingside.", "The majority is on the wing where one side has strictly more pawns than the other.",
                   f"It is on the {wing}."],
                  f"On the {wing}, {CT[c]} has {wc[0]} pawn{'s' if wc[0] != 1 else ''} against {wc[1]}: {sqs(ans)}.", C.fam(rec), tpl="maj-select")
        return [(board, item, C.prov(rec), "maj-select")]
    return make


def t_maj_wing():
    def make(rec, board):
        c = W
        ms = F(rec, c, "majority_side")
        wings = {wing_name(s) for s in ms}
        opts = ["on the queenside (files a to d)", "on the kingside (files e to h)", "on both wings", "on neither wing"]
        ans = opts[2] if len(wings) == 2 else opts[0] if wings == {"queenside"} else opts[1] if wings == {"kingside"} else opts[3]
        q, k = S.wing_counts(board, W)["queenside"], S.wing_counts(board, W)["kingside"]
        cl = (Cl().add("pawn_set", f"White's majority pawns: {sqs(ms)}.", kind="majority_side", color="white", squares=sorted(ms))
              .add("wing_pawns", f"White has {q[0]} pawn(s) on the queenside.", color="white", wing="queenside", count=q[0])
              .add("wing_pawns", f"Black has {q[1]} pawn(s) on the queenside.", color="black", wing="queenside", count=q[1])
              .add("wing_pawns", f"White has {k[0]} pawn(s) on the kingside.", color="white", wing="kingside", count=k[0])
              .add("wing_pawns", f"Black has {k[1]} pawn(s) on the kingside.", color="black", wing="kingside", count=k[1]))
        item = mk("POS.MAJORITY.D1", 1, "classify_position",
                  "Where does White have a pawn majority? (Queenside = files a to d, kingside = files e to h; a majority means more pawns on that wing than the opponent has.)",
                  {"class": ans}, cl, ["POS.MAJORITY"],
                  ["Count the pawns of both colours on files a to d, then on files e to h.", "A wing counts only if White has strictly more pawns there than Black.", "Equal numbers on a wing are not a majority."],
                  f"Queenside: White {q[0]}, Black {q[1]}. Kingside: White {k[0]}, Black {k[1]}.", C.fam(rec), options=opts, tpl="maj-wing")
        return [(board, item, C.prov(rec), "maj-wing")]
    return make


# ---- pawn islands
def t_islands(c):
    def make(rec, board):
        isl = F(rec, c, "islands")
        n = len(isl)
        opts = ["1", "2", "3", "4", "5 or more"]
        ans = opts[min(n, 5) - 1]
        cl = Cl().add("pawn_islands", f"{CT[c]}'s pawn islands: {join_and(isl, 'none')}.", color=CN[c], count=n, islands=isl)
        item = mk("POS.PAWNWEAK.D1", 1, "classify_position",
                  f"How many pawn islands does {CT[c]} have? An island is a group of {CN[c]} pawns on neighbouring files; an empty file (no pawn of that colour on it) separates two islands.",
                  {"class": ans}, cl, ["POS.PAWNWEAK"],
                  [f"List the files that hold a {CN[c]} pawn.", "Start a new island each time a file in that list is not next to the previous one.", ("The answer is " + join_and([str(v) for v in sorted({max(1, n - 1), n, n + 1})], "") + ".") if n < 5 else "There are many."],
                  f"{CT[c]}'s pawns form {n} island{'s' if n != 1 else ''}, on the files {join_and([(x if len(x) == 1 else x[0] + ' to ' + x[-1]) for x in isl])}. This item only counts the islands; it does not say how many are good or bad.",
                  C.fam(rec), options=opts, tpl="islands-n")
        return [(board, item, C.prov(rec), "islands-n")]
    return make


# ---- IQP, chains, hanging pawns, targets
def t_iqp_recog():
    def make(rec, board):
        wi, bi = rec["f"]["w.isolated"], rec["f"]["b.isolated"]
        wq, bq = [s for s in wi if d_file(s)], [s for s in bi if d_file(s)]
        opts = ["White", "Black", "Both sides", "Neither side"]
        ans = opts[2] if wq and bq else opts[0] if wq else opts[1] if bq else opts[3]
        cl = (Cl().add("pawn_set", f"White's isolated pawns: {sqs(wi)}.", kind="isolated", color="white", squares=sorted(wi))
              .add("pawn_set", f"Black's isolated pawns: {sqs(bi)}.", kind="isolated", color="black", squares=sorted(bi)))
        item = mk("POS.STRUCTURE.IQP.D1", 1, "classify_position",
                  "Which side has an isolated queen's pawn? That means an isolated pawn (no friendly pawn on a neighbouring file) standing on the d-file.",
                  {"class": ans}, cl, ["POS.STRUCTURE.IQP", "POS.PAWNWEAK"],
                  ["Look at the d-file for each colour.", "Is there a pawn on the d-file? If so, is there a friendly pawn on the c-file or the e-file?",
                   "An isolated pawn on any other file does not count here."],
                  f"White's isolated pawns: {sqs(wi)}. Black's isolated pawns: {sqs(bi)}. Isolated pawns on the d-file: White {sqs(wq)}, Black {sqs(bq)}.",
                  C.fam(rec), options=opts, tpl="iqp-recog")
        return [(board, item, C.prov(rec), "iqp-recog")]
    return make


def t_iqp_block(c):
    def make(rec, board):
        iso = F(rec, c, "isolated")
        q = [s for s in iso if d_file(s)]
        if len(q) != 1:
            return None
        pawn = chess.parse_square(q[0])
        stop = S.stop_square(c, pawn)
        if stop is None or board.piece_at(stop) is not None:
            return None
        st = chess.square_name(stop)
        cl = (Cl().add("pawn_set", f"{CT[c]}'s isolated pawns: {sqs(iso)}.", kind="isolated", color=CN[c], squares=sorted(iso))
              .add("piece_on", f"{st} is empty.", square=st, piece="empty"))
        item = mk("POS.STRUCTURE.IQP.D2", 1, "select_squares",
                  f"{CT[c]} has an isolated queen's pawn on {q[0]}. Tap the square directly in front of it, where the opponent would like to place a blockading piece.",
                  {"squares": [st]}, cl, ["POS.STRUCTURE.IQP", "POS.BLOCKADE"],
                  ["The blockading square lies on the same file as the pawn.", "It is the square the pawn would move to next.",
                   f"It is on rank {st[1]}."],
                  f"The pawn on {q[0]} is isolated, and the square in front of it, {st}, is empty. It is the blockade square.", C.fam(rec), tpl="iqp-block")
        return [(board, item, C.prov(rec), "iqp-block")]
    return make


def chain_info(board, c):
    own = set(board.pieces(chess.PAWN, c))
    bases = S.chain_bases(board, c)
    if len(bases) != 1:
        return None
    b = bases[0]
    prot = [q for q in own if (chess.BB_PAWN_ATTACKS[c][b] >> q) & 1]
    for p2 in prot:
        p3 = [q for q in own if (chess.BB_PAWN_ATTACKS[c][p2] >> q) & 1]
        if p3:
            return b, p2, p3[0]
    return None


def t_chain_base(c):
    def make(rec, board):
        info = chain_info(board, c)
        if not info:
            return None
        b, p2, p3 = (chess.square_name(x) for x in info)
        cl = (Cl().add("pawn_set", f"{CT[c]}'s only chain base is {b}.", kind="chain_base", color=CN[c], squares=[b])
              .add("piece_attacks", f"The {CN[c]} pawn on {b} defends {p2}.", square=b, includes=[p2])
              .add("piece_attacks", f"The {CN[c]} pawn on {p2} defends {p3}.", square=p2, includes=[p3]))
        item = mk("POS.STRUCTURE.CHAIN.D1", 1, "select_squares",
                  f"{CT[c]} has a pawn chain: pawns that defend one another diagonally. Tap the base of the chain, the pawn at the back that no pawn defends.",
                  {"squares": [b]}, cl, ["POS.STRUCTURE.CHAIN"],
                  ["Find the pawns that are defended by a pawn behind them and to the side.", "Follow the defence backwards, pawn by pawn, until you reach one that nothing defends.",
                   f"The base is on the {b[0]}-file."],
                  f"{p3} is defended by {p2}, and {p2} is defended by {b}; nothing defends {b}, so {b} is the base.",
                  C.fam(rec), tpl="chain-base")
        return [(board, item, C.prov(rec), "chain-base")]
    return make


def t_chain_lever(c):
    """c = chain owner; the OTHER side is to move and must find the pawn move that attacks the base."""
    def make(rec, board):
        info = chain_info(board, c)
        if not info or board.turn == c:
            return None
        b = chess.square_name(info[0])
        mv = S.moves_where(board, "pawn_move_attacks", b)
        if not (1 <= len(mv) <= 2):
            return None
        sans = [board.san(chess.Move.from_uci(m)) for m in mv]
        cl = (Cl().add("pawn_set", f"{CT[c]}'s only chain base is {b}.", kind="chain_base", color=CN[c], squares=[b])
              .add("moves_where", f"The legal pawn moves after which the moved pawn attacks {b} are exactly {join_and(sans)}.", property="pawn_move_attacks", square=b, moves=mv))
        item = mk("POS.STRUCTURE.CHAIN.D1", 1, "find_move",
                  f"{CT[c]}'s pawn chain has its base on {b}. {CT[not c]} to move: play a pawn move that attacks the base.",
                  {"moves": mv}, cl, ["POS.STRUCTURE.CHAIN", "POS.BREAKS"],
                  ["The base is the pawn at the back of the chain.", "A pawn attacks diagonally forward: which of your pawns can step to a square from which it hits the base?",
                   f"The pawn that moves starts on the {mv[0][0]}-file."],
                  f"After {join_and(sans)} the moved pawn attacks {b}, the base of the chain. This item only asks for the lever; it does not say the lever is good.",
                  C.fam(rec), tpl="chain-lever", extra=("lever.attacks-base",))
        return [(board, item, C.prov(rec), "chain-lever")]
    return make


def t_hang_select(c):
    def make(rec, board):
        hp = F(rec, c, "hanging_pair")
        cl = Cl().add("pawn_set", f"{CT[c]}'s hanging pawns are exactly {sqs(hp)}.", kind="hanging_pair", color=CN[c], squares=sorted(hp))
        item = mk("POS.STRUCTURE.HANGING.D1", 1, "select_squares",
                  f"Tap {CN[c]}'s hanging pawns: two pawns side by side on neighbouring files that are the only pawns of their colour on those two files, with no friendly pawn on the file beyond either of them and no enemy pawn on either of their two files.",
                  {"squares": sorted(hp)}, cl, ["POS.STRUCTURE.HANGING"],
                  ["Look for two friendly pawns standing next to each other on the same rank.", "Check the files beside them: no friendly pawns there. Check their own files: no enemy pawns.",
                   f"They are on the {sorted(hp)[0][0]}- and {sorted(hp)[1][0]}-files."],
                  f"{hp[0]} and {hp[1]} stand side by side on the same rank, alone on their files, with no {CN[c]} pawn beside them and no {CN[not c]} pawn on their files.",
                  C.fam(rec), tpl="hang-select")
        return [(board, item, C.prov(rec), "hang-select")]
    return make


def t_target(c):
    def make(rec, board):
        bw = F(rec, c, "backward")
        half = rec["f"]["files"]["half_open_" + CN[not c]]
        ans = [s for s in bw if s[0] in half]
        if not ans:
            return None
        cl = (Cl().add("pawn_set", f"{CT[c]}'s backward pawns: {sqs(bw)}.", kind="backward", color=CN[c], squares=sorted(bw))
              .add("open_files", f"Files half-open for {CT[not c]}: {', '.join(half) or 'none'}.", **{"half_open_" + CN[not c]: sorted(half)}))
        item = mk("POS.TARGET.D1", 1, "select_squares",
                  f"A weak pawn is an easier target when it cannot easily move and an enemy rook can reach it along a file. Tap each {CN[c]} pawn that is backward AND stands on a file with no {CN[not c]} pawn on it (a file half-open for {CT[not c]}).",
                  {"squares": sorted(ans)}, cl, ["POS.TARGET", "POS.PAWNWEAK", "POS.OPENFILE"],
                  [f"First list {CN[c]}'s backward pawns.", f"Then check each pawn's file: does {CN[not c]} have a pawn on it?",
                   f"{len(ans)} pawn{'s' if len(ans) != 1 else ''} fit{'s' if len(ans) == 1 else ''}; the file is {files_phrase([sorted(ans)[0][0]])}."],
                  f"{CT[c]}'s backward pawns are {sqs(bw)}; {sqs(ans)} stand{'s' if len(ans) == 1 else ''} on a file with no {CN[not c]} pawn on it (half-open for {CT[not c]}). "
                  f"This item only finds such pawns; it does not say that any of them can be won.",
                  C.fam(rec), tpl="target")
        return [(board, item, C.prov(rec), "target")]
    return make


# ----------------------------------------------------------------------------------------------------------------
# contrast pairs (one pawn pushed or shifted; the answer to the same question flips)
# ----------------------------------------------------------------------------------------------------------------
def feat_cands(key):
    return lambda rec, board: [(c, sq) for c in (W, Bk) for sq in F(rec, c, key)]


def feat_fn(key):
    return lambda board, c, s: s in S.pawn_set(board, key, c)


def cl_iso(board, c, s):
    st = S.pawn_set(board, "isolated", c)
    return Cl().add("pawn_set", f"{CT[c]}'s isolated pawns are exactly {sqs(st)}.", kind="isolated", color=CN[c], squares=st)


def why_iso(board, c, s, yes):
    if yes:
        return f"No {CT[c]} pawn stands on the {' or '.join(f + '-file' for f in C.neighbour_files(s))}, so the pawn on {s} is isolated."
    nb = sorted(chess.square_name(q) for q in board.pieces(chess.PAWN, c) if abs(chess.square_file(q) - chess.square_file(chess.parse_square(s))) == 1)
    return f"The {CN[c]} pawn on {nb[0]} stands on a neighbouring file of {s}, so the pawn on {s} is not isolated."


def cl_back(board, c, s):
    st = S.pawn_set(board, "backward", c)
    return Cl().add("pawn_set", f"{CT[c]}'s backward pawns are exactly {sqs(st)}.", kind="backward", color=CN[c], squares=st)


def why_back(board, c, s, yes):
    if yes:
        return backward_text(board, c, s) + "."
    sq = chess.parse_square(s)
    nbs = [q for q in board.pieces(chess.PAWN, c) if abs(chess.square_file(q) - chess.square_file(sq)) == 1]
    if not nbs:
        return f"The pawn on {s} has no friendly pawn on a neighbouring file, so it is isolated, not backward."
    lowest = [chess.square_name(q) for q in nbs if S.rr(c, q) <= S.rr(c, sq)]
    if lowest:
        return f"The {CN[c]} pawn on {lowest[0]} is level with or behind {s} on a neighbouring file, so the pawn on {s} is not backward."
    st = chess.square_name(S.stop_square(c, sq))
    return f"No {CN[not c]} pawn attacks {st}, the square in front of {s}, so the pawn on {s} is not backward."


def cl_passed(board, c, s):
    st = S.pawn_set(board, "passed", c)
    return Cl().add("pawn_set", f"{CT[c]}'s passed pawns are exactly {sqs(st)}.", kind="passed", color=CN[c], squares=st)


def why_passed(board, c, s, yes):
    if yes:
        return passed_why(board, c, s) + ", so it is passed."
    sq = chess.parse_square(s)
    f = chess.square_file(sq)
    blockers = sorted(chess.square_name(q) for q in board.pieces(chess.PAWN, not c) if abs(chess.square_file(q) - f) <= 1 and S.rr(c, q) > S.rr(c, sq))
    return f"The {CN[not c]} pawn on {blockers[0]} stands ahead of {s} on the same or a neighbouring file, so the pawn on {s} is not passed."


def cl_hang(board, c, s):
    st = S.pawn_set(board, "hanging_pair", c)
    return Cl().add("pawn_set", f"{CT[c]}'s hanging pawns are exactly {sqs(st)}.", kind="hanging_pair", color=CN[c], squares=st)


def why_hang(board, c, s, yes):
    if yes:
        hp = S.pawn_set(board, "hanging_pair", c)
        return f"{join_and(hp)} stand side by side on the same rank, alone on their files, with no {CN[c]} pawn beside them and no {CN[not c]} pawn on their files: hanging pawns."
    return f"The pawn on {s} no longer forms a hanging pair: the pair is not side by side, or a friendly pawn stands beside it, or an enemy pawn stands on one of the two files."


def hints_iso(c, s):
    return ["Look at the two files beside the pawn.", "Isolated means no friendly pawn on either neighbouring file, on any rank.", f"Check the {' and '.join(f + '-file' for f in C.neighbour_files(s))}."]


def hints_back(c, s):
    return ["Compare the pawn with its neighbours on the side files.", "Backward needs: neighbours only further advanced, and an enemy pawn attacking the square in front.", "Check the square directly in front of the pawn for an enemy pawn's attack."]


def hints_passed(c, s):
    f = chess.square_file(chess.parse_square(s))
    files = [FILES[x] + "-file" for x in (f - 1, f, f + 1) if 0 <= x <= 7]
    return ["Look ahead of the pawn.", "Check its own file and both neighbouring files: any enemy pawn in front of it, on the way to its promotion square, means it is not passed.", "Check the " + join_and(files) + "."]


def hints_hang(c, s):
    return ["Find the pawn's partner on the next file, on the same rank.", "Then look at the files beside the pair and at the pair's own two files.", "Both must be free of friendly pawns beside them and of enemy pawns on them."]


def q_iso(c, s):
    return f"Is the {CN[c]} pawn on {s} isolated? (No friendly pawn on either neighbouring file.)"


def q_back(c, s):
    return f"Is the {CN[c]} pawn on {s} backward? (Neighbours only further advanced, and an enemy pawn attacks the square in front.)"


def q_passed(c, s):
    return f"Is the {CN[c]} pawn on {s} passed? (No enemy pawn ahead of it on its own or a neighbouring file.)"


def q_hang(c, s):
    return f"Is the {CN[c]} pawn on {s} one of a pair of hanging pawns? (Two side by side, alone on their files, no friendly pawn on the files beside them, no enemy pawn on their files.)"


# ----------------------------------------------------------------------------------------------------------------
def main():
    reg = C.make_registry("pawns")
    pre = C.PreCheck()
    B = C.PBuilder("PAWNS", "pawns", SEED, reg, pre)
    D = Driver(B)
    sel = build_selectors()
    recs, seen = psel.collect(sel, SEED, cap=500)
    print("selector matches:", {k: seen[k] for k in sorted(seen)})

    for c in (W, Bk):
        k = CK[c]
        D.run(f"iso_{k}", recs[f"iso_{k}"], 3, t_iso_select(c))
        D.run(f"dbl_{k}", recs[f"dbl_{k}"], 2, t_dbl_select(c))
        D.run(f"back_{k}", recs[f"back_{k}"], 3, t_back_select(c))
        D.run(f"wu_{k}", recs[f"wu_{k}"], 2, t_weak_union(c))
        for n in range(4):
            D.run(f"wc{n}_{k}", recs[f"wc{n}_{k}"], 1, t_weak_count(c))
        D.run(f"pp_{k}", recs[f"pp_{k}"], 3, t_prot_passed(c))
        D.run(f"cp_{k}", recs[f"cp_{k}"], 2, t_conn_passed(c))
        D.run(f"maj_{k}", recs[f"maj_{k}"], 3, t_maj_select(c))
        D.run(f"hang_{k}", recs[f"hang_{k}"], 4, t_hang_select(c))
        D.run(f"chain_{k}", recs[f"chain_{k}"], 4, t_chain_base(c))
        D.run(f"chainlever_{k}", recs[f"chain_{k}"], 3, t_chain_lever(c))
        D.run(f"tgt_{k}", recs[f"tgt_{k}"], 4, t_target(c))
        D.run(f"iqpblock_{k}", recs[f"iqp_{k}"], 3, t_iqp_block(c))
    # pawn-kind: balanced answers
    for want, pool_names, q in (("isolated", ["iso_w", "iso_b"], 2), ("doubled", ["dbl_w", "dbl_b"], 2), ("backward", ["back_w", "back_b"], 2), ("none of these", ["wc0_w", "wc0_b", "wc1_w", "wc1_b"], 2)):
        got = 0
        for nm in pool_names:
            for rec in recs[nm][100:]:
                if got >= q:
                    break
                rec = dict(rec); rec["_want"] = want
                c = W if nm.endswith("_w") else Bk
                before = D.made["kind"]
                D.run("kind", [rec], 10 ** 6, t_kind(c))
                got += D.made["kind"] - before
    D.run("passed_sel", recs["pass_any"], 6, t_passed_select())
    for nm, q in (("pass_w_only", 2), ("pass_b_only", 2), ("pass_both", 2), ("pass_none", 3)):
        D.run("passedcat_" + nm, recs[nm][50:], q, t_passed_cat())
    for nm, q in (("maj_q", 2), ("maj_k", 2), ("maj_both", 1), ("maj_none", 3)):
        D.run("majwing_" + nm, recs[nm], q, t_maj_wing())
    for nm, q in (("iqp_w", 2), ("iqp_b", 2), ("iqp_both", 1), ("iqp_none", 2)):
        D.run("iqp_" + nm, recs[nm], q, t_iqp_recog())

    # contrast pairs
    D.run("pair_iso", recs["iso_w"][150:] + recs["iso_b"][150:], QP["iso"],
          pair_make("iso", feat_cands("isolated"), feat_fn("isolated"), ("shift",), q_iso, "POS.PAWNWEAK.D3", cl_iso, why_iso, ["POS.PAWNWEAK"], hints_iso))
    D.run("pair_back", recs["back_w"][150:] + recs["back_b"][150:], QP["back"],
          pair_make("back", feat_cands("backward"), feat_fn("backward"), ("push", "shift"), q_back, "POS.PAWNWEAK.D3", cl_back, why_back, ["POS.PAWNWEAK"], hints_back))
    D.run("pair_passed", recs["pass_any"][150:], QP["passed"],
          pair_make("passed", feat_cands("passed"), feat_fn("passed"), ("push", "shift"), q_passed, "POS.PASSED.D3", cl_passed, why_passed, ["POS.PASSED"], hints_passed))
    D.run("pair_hang", recs["hang_w"][100:] + recs["hang_b"][100:], QP["hang"],
          pair_make("hang", feat_cands("hanging_pair"), feat_fn("hanging_pair"), ("push", "shift"), q_hang, "POS.STRUCTURE.HANGING.D3", cl_hang, why_hang, ["POS.STRUCTURE.HANGING"], hints_hang))

    for n_ in (1, 2, 3, 4):
        for c, k in ((W, "w"), (Bk, "b")):
            D.run(f"islands{n_}_{k}", [r for r in recs["any"] if len(F(r, c, "islands")) == n_][:300], 1, t_islands(c))
    D.run("islands5", [r for r in recs["any"] if len(F(r, W, "islands")) >= 5][:300], 1, t_islands(W))
    names = C.split_write(B, "pawns", chunk=120)
    print("items", len(B.items), "per node", dict(B.by_node))
    print("made", dict(D.made))
    print("builder stats", dict(B.stats))
    print("precheck rejects", dict(pre.rejects))
    print("files", names)
    pre.close()


if __name__ == "__main__":
    main()
