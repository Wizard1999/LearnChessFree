"""Family A, mixed cue-3 recognition: "which statement about this position is true?" (exactly one of four), over pawn weaknesses, passed
pawns, files, bishops, outposts, space, majorities and king placement; plus "doubled pawns in context" (what else is true?).
Every statement carries its own exact claim, so the truth of all four statements is machine-checked.

    ./tools/.venv/Scripts/python.exe -I tools/positional/gen_mixed.py
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import chess
import pcommon as C
import psel
import structure as S
from pcommon import Cl, mk, CN, CT, join_and, FILES
from pgen import Driver, random_for

SEED = 20261105
W, Bk = chess.WHITE, chess.BLACK
CK = {W: "w", Bk: "b"}

GROUP = {"POS.PAWNWEAK": "pawn weaknesses", "POS.PASSED": "passed pawns", "POS.OPENFILE": "files", "POS.BISHOPS": "the bishops", "POS.OUTPOST": "outpost squares",
         "POS.SPACE": "space (pawn attacks)", "POS.MAJORITY": "pawn majorities", "ATK.PAWNSTORM": "where the kings stand", "POS.STRUCTURE.DOUBLED": "doubled pawns"}
DEFN = {"POS.PAWNWEAK": "Isolated: no friendly pawn on a neighbouring file. Doubled: shares its file with a friendly pawn. Backward: neighbours only further advanced and an enemy pawn attacks the square in front.",
        "POS.PASSED": "Passed: no enemy pawn ahead of it on its own or a neighbouring file. Protected: defended by a friendly pawn.",
        "POS.OPENFILE": "Open file: no pawn of either colour. Half-open for a side: none of its own pawns but at least one enemy pawn.",
        "POS.BISHOPS": "Bishop pair: one light-squared and one dark-squared bishop.",
        "POS.OUTPOST": "Outpost square: 4th to 6th rank from the owner's side, defended by its pawn, no pawn on it, and no enemy pawn can attack it now or by advancing (pawn captures that change file are ignored).",
        "POS.SPACE": "Space here means squares in the opponent's half (White: ranks 5-8, Black: ranks 4-1) that your pawns attack.",
        "POS.MAJORITY": "Majority: strictly more pawns than the opponent on the queenside (files a-d) or the kingside (files e-h).",
        "ATK.PAWNSTORM": "Wings: queenside = king on files a-c, kingside = king on files f-h.",
        "POS.STRUCTURE.DOUBLED": "Doubled: shares its file with a friendly pawn."}


class St:
    def __init__(self, key, node, text, truth, ctype, params, fact):
        self.key, self.node, self.text, self.truth, self.ctype, self.params, self.fact = key, node, text, truth, ctype, params, fact


def sqs(l):
    return join_and(sorted(l), "none")


def statements(rec, board, rng, include=None):
    f = rec["f"]
    out = []
    for c in (W, Bk):
        k, nm, op = CK[c], CT[c], CT[not c]
        g = lambda key: f[f"{k}.{key}"]
        for kind, node, label in (("isolated", "POS.PAWNWEAK", "an isolated pawn"), ("doubled", "POS.PAWNWEAK", "doubled pawns"), ("backward", "POS.PAWNWEAK", "a backward pawn"),
                                  ("passed", "POS.PASSED", "a passed pawn"), ("protected_passed", "POS.PASSED", "a protected passed pawn")):
            st = g(kind)
            out.append(St(f"{kind}-{k}", node, f"{nm} has {label}.", bool(st), "pawn_set", dict(kind=kind, color=CN[c], squares=sorted(st)), f"{nm}'s {kind.replace('_', ' ')} pawns: {sqs(st)}."))
        hf = f["files"]["half_open_" + CN[c]]
        out.append(St(f"half-{k}", "POS.OPENFILE", f"{nm} has a half-open file.", bool(hf), "open_files", dict(half_open_white=f["files"]["half_open_white"]) if c == W else dict(half_open_black=f["files"]["half_open_black"]),
                      f"Files half-open for {nm}: {sqs(hf)}."))
        oe = g("out_empty")
        out.append(St(f"outpost-{k}", "POS.OUTPOST", f"{nm} has an empty outpost square.", bool(oe), "outposts", dict(color=CN[c], occupied="empty", squares=sorted(oe)), f"Empty outpost squares for {nm}: {sqs(oe)}."))
        bp = CN[c] in f["bpair"]
        out.append(St(f"bpair-{k}", "POS.BISHOPS", f"{nm} has the bishop pair.", bp, "bishop_pair", dict(holders=sorted(f["bpair"])), f"Bishop pair: {join_and(f['bpair'], 'neither side')}."))
        isl_c, isl_o = g("islands"), f[f"{CK[not c]}.islands"]
        out.append(St(f"islands-{k}", "POS.PAWNWEAK", f"{nm} has more pawn islands than {op}.", len(isl_c) > len(isl_o), "pawn_islands", dict(color=CN[c], count=len(isl_c)),
                      f"Pawn islands: {nm} {len(isl_c)}, {op} {len(isl_o)}."))
        maj = g("majority_side")
        for wing, rng_ in (("queenside", lambda s: s[0] < "e"), ("kingside", lambda s: s[0] >= "e")):
            out.append(St(f"maj-{wing}-{k}", "POS.MAJORITY", f"{nm} has a pawn majority on the {wing}.", any(rng_(s) for s in maj), "pawn_set", dict(kind="majority_side", color=CN[c], squares=sorted(maj)),
                          f"{nm}'s majority pawns: {sqs(maj)}."))
    ow = f["files"]["open"]
    out.append(St("open-any", "POS.OPENFILE", "There is an open file.", bool(ow), "open_files", dict(open=ow), f"Open files: {sqs(ow)}."))
    for fl in FILES:
        if fl in ("a", "h"):
            continue
        out.append(St(f"open-{fl}", "POS.OPENFILE", f"The {fl}-file is open.", fl in ow, "open_files", dict(open=ow), f"Open files: {sqs(ow)}."))
    sw, sb = f["w.space_att"], f["b.space_att"]
    for c in (W, Bk):
        mine, theirs = (sw, sb) if c == W else (sb, sw)
        sqm = S.space_squares(board, c, "pawn_attacks")
        sqt = S.space_squares(board, not c, "pawn_attacks")
        out.append(St(f"space-{CK[c]}", "POS.SPACE", f"{CT[c]}'s pawns attack more squares in {CT[not c]}'s half than {CT[not c]}'s pawns attack in {CT[c]}'s half.", mine > theirs, "space",
                      dict(color=CN[c], mode="pawn_attacks", count=mine, squares=sqm), f"Pawn-attacked squares in the other half: {CT[c]} {mine}, {CT[not c]} {theirs}."))
    wk, bk = f["w.kwing"], f["b.kwing"]
    if wk and bk:
        out.append(St("opp-wings", "ATK.PAWNSTORM", "The two kings stand on opposite wings (one on files a-c, the other on files f-h).", {wk, bk} == {"queenside", "kingside"}, "king_wing", dict(color="white", wing=wk),
                      f"White king: {wk}; Black king: {bk}."))
    return out


def second_claim(st, rec):
    """the 'space' and 'king_wing' statements need a partner claim so the truth value is fully determined"""
    f = rec["f"]
    if st.key.startswith("space-"):
        c = W if st.key.endswith("-w") else Bk
        o = not c
        sq = S.space_squares(chess.Board(rec["fen"]), o, "pawn_attacks")
        return ("space", dict(color=CN[o], mode="pawn_attacks", count=len(sq), squares=sq))
    if st.key == "opp-wings":
        return ("king_wing", dict(color="black", wing=f["b.kwing"]))
    if st.key.startswith("islands-"):
        c = W if st.key.endswith("-w") else Bk
        return ("pawn_islands", dict(color=CN[not c], count=len(f[f"{CK[not c]}.islands"])))
    return None


def build_claims(chosen, rec):
    cl = Cl()
    seen = set()
    import json as _j
    for st in chosen:
        for ctype, params in [(st.ctype, st.params)] + ([second_claim(st, rec)] if second_claim(st, rec) else []):
            key = _j.dumps([ctype, params], sort_keys=True)
            if key in seen:
                continue
            seen.add(key)
            cl.add(ctype, st.fact if ctype == st.ctype else f"Supporting fact for: {st.text}", **params)
    return cl


def pick_four(rec, board, rng, want_true_nodes=None, pool_filter=None):
    sts = statements(rec, board, rng)
    if pool_filter:
        sts = [s for s in sts if pool_filter(s)]
    trues = [s for s in sts if s.truth]
    falses = [s for s in sts if not s.truth]
    if want_true_nodes:
        trues = [s for s in trues if s.node in want_true_nodes]
    if not trues or len(falses) < 3:
        return None
    t = rng.choice(trues)
    rng.shuffle(falses)
    chosen = [t]
    nodes = {t.node}
    for s in falses:
        if len(chosen) == 4:
            break
        # avoid asking the same feature for the same colour twice (e.g. two file statements about open-d and open-e)
        if s.key.split("-")[0] == t.key.split("-")[0] and s.key.split("-")[-1] == t.key.split("-")[-1]:
            continue
        if any(s.key == x.key for x in chosen):
            continue
        if s.key.startswith("open-") and any(x.key.startswith("open-") for x in chosen):
            continue
        if s.key.startswith("maj-") and any(x.key.startswith("maj-") for x in chosen):
            continue
        chosen.append(s)
        nodes.add(s.node)
    if len(chosen) < 4:
        return None
    return t, chosen, nodes


NONE_OPT = "None of these statements is true"
FOCUS = ["POS.PAWNWEAK", "POS.PASSED", "POS.OPENFILE", "POS.BISHOPS", "POS.OUTPOST", "POS.SPACE", "POS.MAJORITY"]


def pick_none(rec, board, rng, focus=None):
    """four false statements (at least two from the focus node when it has that many)"""
    sts = [s for s in statements(rec, board, rng) if not s.truth]
    rng.shuffle(sts)
    foc = [s for s in sts if focus and s.node == focus]
    rest = [s for s in sts if not (focus and s.node == focus)]
    chosen = []
    for s in foc[:2] + rest + foc[2:]:
        if any(s.key == x.key for x in chosen):
            continue
        if s.key.startswith("open-") and any(x.key.startswith("open-") for x in chosen):
            continue
        if s.key.startswith("maj-") and any(x.key.startswith("maj-") for x in chosen):
            continue
        chosen.append(s)
        if len(chosen) == 4:
            break
    if len(chosen) < 4 or (focus and not any(x.node == focus for x in chosen)):
        return None
    return chosen


def t_mixed(focus, none_true):
    """cue 3: nothing in the prompt names a feature. focus = node of the true statement (None: any), none_true: all four statements are false"""
    def make(rec, board):
        rng = random_for(rec, f"mix-{focus}-{none_true}")
        if none_true:
            chosen = pick_none(rec, board, rng, focus)
            if not chosen:
                return None
            t, nodes = None, {s.node for s in chosen}
        else:
            r = pick_four(rec, board, rng, want_true_nodes=[focus] if focus else None)
            if not r:
                return None
            t, chosen, nodes = r
        texts = [s.text for s in chosen]
        rng.shuffle(texts)
        texts.append(NONE_OPT)
        ans = NONE_OPT if t is None else t.text
        cl = build_claims(chosen, rec)
        defs = " ".join(DEFN[n] for n in sorted(nodes))
        skill = f"{focus}.D2" if focus else ("POS.IMBALANCES.D2" if none_true else "POS.IMBALANCES.D1")
        node_tags = ([focus] if focus else []) + ["POS.IMBALANCES"] + sorted(n for n in nodes if n not in (focus, "POS.IMBALANCES"))
        if t is None:
            hint3 = "All four statements can be tested with the board; check each one carefully before choosing the last option."
            expl = "None of the four statements is true. " + " ".join(dict.fromkeys(s.fact for s in chosen if s.fact))
        else:
            hint3 = f"If one statement is true, it is about {GROUP[t.node]}."
            expl = "True: " + t.text + " " + " ".join(dict.fromkeys(s.fact for s in chosen if s.fact)) + " The other statements are false by these facts."
        item = mk(skill, 3, "classify_position", "At most one of these statements about the position is true. Which one? Choose the last option if none of them is.", {"class": ans}, cl, node_tags,
                  ["Test the statements one at a time against the board.", defs, hint3], expl, C.fam(rec), options=texts, tpl="imbalances",
                  extra=((f"focus.{focus}",) if focus else ()) + (("answer.none",) if t is None else ()))
        return [(board, item, C.prov(rec), "imbalances")]
    return make


def t_doubled_ctx(rec, board):
    rng = random_for(rec, "dblctx")
    f = rec["f"]
    cs = [c for c in (W, Bk) if f[f"{CK[c]}.doubled"]]
    if not cs:
        return None
    c = rng.choice(cs)
    nm = CT[c]
    dbl = f[f"{CK[c]}.doubled"]
    keys = {f"half-{CK[c]}", f"bpair-{CK[c]}", f"bpair-{CK[not c]}", f"outpost-{CK[c]}", f"passed-{CK[c]}", f"maj-queenside-{CK[c]}", f"maj-kingside-{CK[c]}", f"half-{CK[not c]}"}
    r = pick_four(rec, board, rng, pool_filter=lambda s: s.key in keys)
    if not r:
        return None
    t, chosen, nodes = r
    texts = [s.text for s in chosen]
    rng.shuffle(texts)
    cl = Cl().add("pawn_set", f"{nm}'s doubled pawns: {sqs(dbl)}.", kind="doubled", color=CN[c], squares=sorted(dbl))
    cl.items += build_claims(chosen, rec).items
    for i, x in enumerate(cl.items):
        x["id"] = f"C{i + 1}"
    files = sorted({s[0] for s in dbl})
    item = mk("POS.STRUCTURE.DOUBLED.D1", 2, "classify_position",
              f"{nm} has doubled pawns on the {join_and([x + '-file' for x in files])} ({join_and(sorted(dbl))}). Doubled pawns can come with compensation. Exactly one of these statements is true in the position. Which?",
              {"class": t.text}, cl, ["POS.STRUCTURE.DOUBLED", "POS.IMBALANCES"] + sorted(n for n in nodes if n not in ("POS.STRUCTURE.DOUBLED",)),
              ["Test each statement against the board; three are false.", " ".join(DEFN[n] for n in sorted(nodes)), f"The true statement is about {GROUP[t.node]}."],
              "True: " + t.text + " " + " ".join(dict.fromkeys(s.fact for s in chosen if s.fact)) + " Whether the compensation is enough is not claimed here.", C.fam(rec), options=texts, tpl="doubled-ctx")
    return [(board, item, C.prov(rec), "doubled-ctx")]


def main():
    reg = C.make_registry("mixed")
    pre = C.PreCheck()
    B = C.PBuilder("MIX", "mixed", SEED, reg, pre)
    D = Driver(B)
    sel = {"any": lambda r: True, "dbl": lambda r: bool(r["f"]["w.doubled"] or r["f"]["b.doubled"])}
    recs, seen = psel.collect(sel, SEED, cap=2500)
    print("selector matches:", {k: seen[k] for k in sorted(seen)})
    anyr = recs["any"]
    for i, node in enumerate(FOCUS):
        D.run(f"mix-{node}", anyr[i * 300:], 10, t_mixed(node, False))
        D.run(f"mix-{node}-none", anyr[i * 300 + 150:], 3, t_mixed(node, True))
    D.run("imb", anyr[2200:], 20, t_mixed(None, False))
    D.run("imb-none", anyr[2300:], 8, t_mixed(None, True))
    D.run("dblctx", recs["dbl"], 14, t_doubled_ctx)
    names = C.split_write(B, "mixed", chunk=120)
    print("items", len(B.items), "per node", dict(B.by_node))
    print("made", dict(D.made))
    print("builder stats", dict(B.stats))
    print("precheck rejects", dict(pre.rejects))
    print("files", names)
    pre.close()


if __name__ == "__main__":
    main()
