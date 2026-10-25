"""Family A, exchanges and what they change: an equal trade (a capture and its recapture on the same square) from a real calm position,
and the exact structural difference between the position before and after (a file opens, a side loses the bishop pair, doubled pawns,
a new isolated pawn, a new passed pawn, or nothing). Nodes: POS.EXCHANGE (D1: which purpose/effect the trade has) and
POS.TRANSFORM (D3: predict the resulting structure). Claims use `after_moves`; the effect is proved by exact before/after sets.
These items do not say the trade is good or bad.

    ./tools/.venv/Scripts/python.exe -I tools/positional/gen_exchange.py
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import chess
import pcommon as C
import psel
import structure as S
from pcommon import Cl, mk, CN, CT, VAL, join_and
from pgen import Driver, random_for

SEED = 20261109
W, Bk = chess.WHITE, chess.BLACK
NONE_OPT = "None of these"

DEF = {"open": "Open file: no pawn of either colour.", "doubled": "Doubled: shares its file with a friendly pawn.", "isolated": "Isolated: no friendly pawn on a neighbouring file.",
       "passed": "Passed: no enemy pawn ahead of it on its own or a neighbouring file.", "bpair": "Bishop pair: one light-squared and one dark-squared bishop."}


def exchanges(board):
    """(m1, m2) equal trades: m1 captures a piece or pawn, m2 recaptures on the same square with the cheapest legal recapturer"""
    out = []
    for m1 in board.legal_moves:
        if not board.is_capture(m1) or board.is_en_passant(m1) or m1.promotion:
            continue
        v1 = VAL[board.piece_type_at(m1.to_square)]
        b1 = board.copy(stack=False)
        b1.push(m1)
        recs = [m for m in b1.legal_moves if m.to_square == m1.to_square and b1.is_capture(m)]
        if not recs:
            continue
        m2 = min(recs, key=lambda m: (VAL[b1.piece_type_at(m.from_square)], m.uci()))
        if VAL[b1.piece_type_at(m2.to_square)] == v1 and v1 > 0:
            out.append((m1, m2))
    return out


def feat_sets(board):
    return dict(open=S.open_files(board)["open"], bpair=S.bishop_pair_holders(board),
                doubled={c: S.pawn_set(board, "doubled", c) for c in (W, Bk)},
                isolated={c: S.pawn_set(board, "isolated", c) for c in (W, Bk)},
                passed={c: S.pawn_set(board, "passed", c) for c in (W, Bk)})


def statements(fb, fa):
    """all candidate statements with truth values: (key, text, truth, claim builder data)"""
    sts = [("open", "A file becomes open (it had a pawn on it before, now it has none).", bool(set(fa["open"]) - set(fb["open"])))]
    for c in (W, Bk):
        sts.append((f"bpair-{CN[c]}", f"{CT[c]} loses the bishop pair.", CN[c] in fb["bpair"] and CN[c] not in fa["bpair"]))
        for kind, word in (("doubled", "doubled pawns"), ("isolated", "an isolated pawn"), ("passed", "a passed pawn")):
            sts.append((f"{kind}-{CN[c]}", f"{CT[c]} ends up with {word} that it did not have before.", bool(set(fa[kind][c]) - set(fb[kind][c]))))
    return sts


def claims_for(options, fb, fa, seq):
    """exact before/after claims for every statement in `options`; returns (Cl, facts) with facts[key] = [before text, after text]"""
    items, facts, seen = [], {}, set()

    def add(ctype, stmt, **params):
        import json as _j
        k = _j.dumps([ctype, params], sort_keys=True)
        if k not in seen:
            seen.add(k)
            items.append({"id": "", "type": ctype, "params": params, "statement": stmt})
        return stmt

    for key, _text, _t in options:
        base = key.split("-")[0]
        if base == "open":
            b_ = add("open_files", f"Before the exchange the open files are {join_and(fb['open'], 'none')}.", open=fb["open"])
            a_ = add("open_files", f"After the exchange the open files are {join_and(fa['open'], 'none')}.", open=fa["open"], after_moves=seq)
        elif base == "bpair":
            b_ = add("bishop_pair", f"Before the exchange the bishop pair belongs to: {join_and(fb['bpair'], 'neither side')}.", holders=fb["bpair"])
            a_ = add("bishop_pair", f"After the exchange the bishop pair belongs to: {join_and(fa['bpair'], 'neither side')}.", holders=fa["bpair"], after_moves=seq)
        else:
            c = W if key.endswith("white") else Bk
            b_ = add("pawn_set", f"Before the exchange {CT[c]}'s {base} pawns: {join_and(fb[base][c], 'none')}.", kind=base, color=CN[c], squares=fb[base][c])
            a_ = add("pawn_set", f"After the exchange {CT[c]}'s {base} pawns: {join_and(fa[base][c], 'none')}.", kind=base, color=CN[c], squares=fa[base][c], after_moves=seq)
        facts[key] = [b_, a_]
    for i, x in enumerate(items):
        x["id"] = f"C{i + 1}"
    cl = Cl()
    cl.items = items
    return cl, facts


def make(want):
    """want: a statement key prefix to be the TRUE one ('open', 'bpair', 'doubled', 'isolated', 'passed') or None (no change at all)"""
    def mk_item(rec, board):
        rng = random_for(rec, "exch" + str(want))
        exs = exchanges(board)
        rng.shuffle(exs)
        c = board.turn
        for m1, m2 in exs[:12]:
            b1 = board.copy(stack=False)
            san1 = board.san(m1)
            b1.push(m1)
            san2 = b1.san(m2)
            b2 = b1.copy(stack=False)
            b2.push(m2)
            if not b2.is_valid():
                continue
            fb, fa = feat_sets(board), feat_sets(b2)
            sts = statements(fb, fa)
            trues = [s for s in sts if s[2]]
            if want is None:
                if trues:
                    continue
                chosen = rng.sample(sts, 4)
                ans = NONE_OPT
            else:
                if len(trues) != 1 or not trues[0][0].startswith(want):
                    continue
                falses = [s for s in sts if not s[2]]
                rng.shuffle(falses)
                chosen = [trues[0]] + falses[:3]
                ans = trues[0][1]
            seq = [m1.uci(), m2.uci()]
            texts = [s[1] for s in chosen]
            rng.shuffle(texts)
            texts.append(NONE_OPT)
            cl, facts = claims_for(chosen, fb, fa, seq)
            kinds = {s[0].split("-")[0] for s in chosen}
            defs = " ".join(DEF[k] for k in sorted(kinds))
            transform = want in ("doubled", "isolated", "passed")
            skill = "POS.TRANSFORM.D3" if transform else "POS.EXCHANGE.D1"
            nodes = (["POS.TRANSFORM", "POS.EXCHANGE"] if transform else ["POS.EXCHANGE"]) + (["POS.STRUCTURE.DOUBLED"] if want == "doubled" else []) + (["POS.BISHOPS"] if want == "bpair" else []) \
                + (["POS.OPENFILE"] if want == "open" else []) + (["POS.PASSED"] if want == "passed" else []) + (["POS.PAWNWEAK"] if want == "isolated" else [])
            if want is None:
                expl = f"After {san1} {san2} none of the five checked changes occurs. " + " ".join(dict.fromkeys(f for k_, _t_, _x in chosen for f in facts[k_])) + " The item does not say the trade is good or bad."
            else:
                expl = f"After {san1} {san2}: {ans} " + " ".join(facts[trues[0][0]]) + " The item does not say the trade is good or bad."
            item = mk(skill, 2, "classify_position",
                      f"{CT[c]} plays {san1} and {CT[not c]} recaptures {san2}: a capture and its recapture on the same square. Compare the position before and after it. Exactly one of these statements is true unless you choose the last option. Which is it?",
                      {"class": ans}, cl, nodes, ["Write down what changed on the board: which pawns, which pieces, which files?", defs, "Check each statement against the position after the two moves."],
                      expl, C.fam(rec), options=texts, tpl="exchange", extra=("move.exchange",))
            return [(board, item, C.prov(rec), "exchange")]
        return None
    return mk_item


def main():
    reg = C.make_registry("exchange")
    pre = C.PreCheck()
    B = C.PBuilder("EXCH", "exchange", SEED, reg, pre)
    D = Driver(B)
    recs, seen = psel.collect({"any": lambda r: r["n"] >= 14}, SEED, cap=4000)
    anyr = recs["any"]
    for i, (w, q) in enumerate((("open", 4), ("bpair", 4), ("doubled", 5), ("isolated", 5), ("passed", 5), (None, 4))):
        D.run(f"exch-{w}", anyr[i * 600:], q, make(w))
    names = C.split_write(B, "exchange", chunk=60)
    print("items", len(B.items), "per node", dict(B.by_node), "made", dict(D.made), "stats", dict(B.stats), "rejects", dict(pre.rejects))
    print("files", names)
    pre.close()


if __name__ == "__main__":
    main()
