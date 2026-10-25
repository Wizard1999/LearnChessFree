"""Independent audit of the generated positional items (content/items/pos-*.json).

    ./tools/.venv/Scripts/python.exe -I tools/positional/audit.py

For every item whose tag `tpl.<name>` has a rule below, the ANSWER is recomputed from the FEN with a second, naive implementation
(tools/tests/test_structure_naive.py for pawn facts, plain python-chess for moves and attacks) and compared with the stored answer.
This catches plumbing errors the claims cannot (claims prove sets; they do not prove that the answer was copied from the right set).
Also checks the contract: three hints, answer inside the options, accepted moves legal, ids unique, prefix IP-/PP-, family present.
Exit code 1 on any mismatch.
"""
import glob
import json
import re
import sys
from collections import Counter
from pathlib import Path

HERE = Path(__file__).resolve().parent
TOOLS = HERE.parent
sys.path.insert(0, str(TOOLS))
sys.path.insert(0, str(TOOLS / "tests"))
sys.path.insert(0, str(HERE))
import chess
import test_structure_naive as N

ROOT = TOOLS.parent
W, Bk = chess.WHITE, chess.BLACK
COL = {"white": W, "black": Bk}
LIGHT = chess.BB_LIGHT_SQUARES
errors = []


def err(item, msg):
    errors.append(f"{item['id']} [{tpl(item)}]: {msg}")


def tpl(item):
    return next((t[4:] for t in item.get("tags", []) if t.startswith("tpl.")), item["task"])


def claim_color(item):
    return COL[item["claims"][0]["params"]["color"]]


def sqs(x):
    return sorted(x)


def stop(c, s):
    r = chess.square_rank(s) + (1 if c == W else -1)
    return chess.square(chess.square_file(s), r) if 0 <= r <= 7 else None


def ans(item):
    a = item["answer"]
    return a.get("squares") if "squares" in a else a.get("moves") if "moves" in a else a.get("outcome") or a.get("class")


def prompt_sq(item, word):
    m = re.search(rf"{word} (?:pawn|bishop|knight|rook|queen|piece) on ([a-h][1-8])", item["prompt"])
    return m.group(1) if m else None


def piece_rank_ok(board, c, s):
    return True


def mob_squares(board, sq):
    pc = board.piece_at(sq)
    return sum(1 for t in board.attacks(sq) if not (board.piece_at(t) and board.piece_at(t).color == pc.color))


def mob_legal(board, sq):
    return len({m.to_square for m in board.legal_moves if m.from_square == sq})


def rooks_connected_naive(board, c):
    rooks = [s for s, p in board.piece_map().items() if p.color == c and p.piece_type == chess.ROOK]
    for i in range(len(rooks)):
        for j in range(i + 1, len(rooks)):
            a, b = rooks[i], rooks[j]
            if chess.square_rank(a) == chess.square_rank(b):
                lo, hi = sorted((chess.square_file(a), chess.square_file(b)))
                if all(board.piece_at(chess.square(f, chess.square_rank(a))) is None for f in range(lo + 1, hi)):
                    return True
            if chess.square_file(a) == chess.square_file(b):
                lo, hi = sorted((chess.square_rank(a), chess.square_rank(b)))
                if all(board.piece_at(chess.square(chess.square_file(a), r)) is None for r in range(lo + 1, hi)):
                    return True
    return False


def file_status(board):
    wf = {chess.square_file(s) for s in board.pieces(chess.PAWN, W)}
    bf = {chess.square_file(s) for s in board.pieces(chess.PAWN, Bk)}
    return {f: ("open" if f not in wf and f not in bf else "half-open for White" if f not in wf else "half-open for Black" if f not in bf else "closed (both sides have a pawn on it)") for f in range(8)}


def check_item(item, board):
    t = tpl(item)
    a = ans(item)
    n = N
    c = None
    if t in ("iso-select", "dbl-select", "back-select", "prot-passed", "conn-passed", "maj-select", "hang-select"):
        kind = {"iso-select": "isolated", "dbl-select": "doubled", "back-select": "backward", "prot-passed": "protected_passed", "conn-passed": "connected_passed",
                "maj-select": "majority_side", "hang-select": "hanging_pair"}[t]
        c = claim_color(item) if t != "prot-passed" and t != "conn-passed" else COL[item["claims"][0]["params"]["color"]]
        exp = n.naive_pawns(board, kind, c)
        if sqs(a) != exp:
            err(item, f"answer {a} != naive {exp}")
    elif t == "weak-union":
        c = claim_color(item)
        exp = sorted(set(n.naive_pawns(board, "isolated", c)) | set(n.naive_pawns(board, "doubled", c)) | set(n.naive_pawns(board, "backward", c)))
        if sqs(a) != exp:
            err(item, f"answer {a} != naive {exp}")
    elif t == "weak-count":
        c = claim_color(item)
        k = len(set(n.naive_pawns(board, "isolated", c)) | set(n.naive_pawns(board, "doubled", c)) | set(n.naive_pawns(board, "backward", c)))
        if a != ["0", "1", "2", "3 or more"][min(k, 3)]:
            err(item, f"count class {a} != {k}")
    elif t == "pawn-kind":
        c = claim_color(item)
        sq = re.search(r"pawn on ([a-h][1-8])", item["prompt"]).group(1)
        mem = [k for k in ("isolated", "doubled", "backward") if sq in n.naive_pawns(board, k, c)]
        exp = mem[0] if len(mem) == 1 else "none of these" if not mem else None
        if exp != a:
            err(item, f"kind {a} != {exp} ({mem})")
    elif t == "islands-n":
        c = claim_color(item)
        isl = n.naive_islands(board, c)
        o = ["1", "2", "3", "4", "5 or more"]
        if a != o[min(len(isl), 5) - 1]:
            err(item, f"islands-n {a} != {len(isl)}")
    elif t == "passed-select":
        exp = sorted(n.naive_pawns(board, "passed", W) + n.naive_pawns(board, "passed", Bk))
        if sqs(a) != exp:
            err(item, f"answer {a} != naive {exp}")
    elif t == "passed-cat":
        wp, bp = n.naive_pawns(board, "passed", W), n.naive_pawns(board, "passed", Bk)
        o = item["options"]
        exp = o[0] if wp and not bp else o[1] if bp and not wp else o[2] if wp and bp else o[3]
        if a != exp:
            err(item, f"passed-cat {a} != {exp}")
    elif t == "maj-wing":
        ms = n.naive_pawns(board, "majority_side", W)
        wings = {"q" if s[0] < "e" else "k" for s in ms}
        o = item["options"]
        exp = o[2] if len(wings) == 2 else o[0] if wings == {"q"} else o[1] if wings == {"k"} else o[3]
        if a != exp:
            err(item, f"maj-wing {a} != {exp}")
    elif t == "iqp-recog":
        wq = [s for s in n.naive_pawns(board, "isolated", W) if s[0] == "d"]
        bq = [s for s in n.naive_pawns(board, "isolated", Bk) if s[0] == "d"]
        exp = "Both sides" if wq and bq else "White" if wq else "Black" if bq else "Neither side"
        if a != exp:
            err(item, f"iqp-recog {a} != {exp}")
    elif t == "iqp-block":
        c = claim_color(item)
        q = [s for s in n.naive_pawns(board, "isolated", c) if s[0] == "d"]
        if len(q) != 1 or sqs(a) != [chess.square_name(stop(c, chess.parse_square(q[0])))] or board.piece_at(chess.parse_square(a[0])) is not None:
            err(item, f"iqp-block {a} vs {q}")
    elif t == "chain-base":
        c = claim_color(item)
        if sqs(a) != n.naive_pawns(board, "chain_base", c) or len(a) != 1:
            err(item, f"chain base {a} != {n.naive_pawns(board, 'chain_base', c)}")
    elif t == "chain-lever":
        c = claim_color(item)
        base = chess.parse_square(n.naive_pawns(board, "chain_base", c)[0])
        exp = []
        for m in board.legal_moves:
            if board.piece_type_at(m.from_square) == chess.PAWN:
                col = board.color_at(m.from_square)
                tgt = chess.square(chess.square_file(m.to_square) - 1, chess.square_rank(m.to_square) + (1 if col == W else -1)) if chess.square_file(m.to_square) > 0 else None
                tgt2 = chess.square(chess.square_file(m.to_square) + 1, chess.square_rank(m.to_square) + (1 if col == W else -1)) if chess.square_file(m.to_square) < 7 else None
                if base in (tgt, tgt2):
                    exp.append(m.uci())
        if sorted(a) != sorted(exp):
            err(item, f"chain-lever {a} != {exp}")
    elif t == "target":
        c = claim_color(item)
        half = set(N_half(board, not c))
        exp = sorted(s for s in n.naive_pawns(board, "backward", c) if s[0] in half)
        if sqs(a) != exp:
            err(item, f"target {a} != {exp}")
    elif t.startswith("pair-") and t.split("-")[1] in ("iso", "back", "passed", "hang"):
        kind = {"iso": "isolated", "back": "backward", "passed": "passed", "hang": "hanging_pair"}[t.split("-")[1]]
        m = re.search(r"(white|black) pawn on ([a-h][1-8])", item["prompt"])
        c, sq = COL[m.group(1)], m.group(2)
        exp = "yes" if sq in n.naive_pawns(board, kind, c) else "no"
        if a != exp:
            err(item, f"pair {a} != {exp}")
    elif t == "out-select":
        c = claim_color(item)
        if sqs(a) != n.naive_outposts(board, c, "any"):
            err(item, f"outposts {a} != {n.naive_outposts(board, c, 'any')}")
    elif t == "out-move":
        c = board.turn
        exp = []
        for m in board.legal_moves:
            if board.piece_type_at(m.from_square) in (chess.KNIGHT, chess.BISHOP):
                nb = board.copy(stack=False)
                nb.push(m)
                if chess.square_name(m.to_square) in n.naive_outposts(nb, c, "any"):
                    exp.append(m.uci())
        if sorted(a) != sorted(exp):
            err(item, f"out-move {a} != {exp}")
    elif t == "out-yn":
        m = re.search(r"(white|black) (knight|bishop) on ([a-h][1-8])", item["prompt"])
        c, sq = COL[m.group(1)], m.group(3)
        exp = "yes" if sq in n.naive_outposts(board, c, "own") else "no"
        if a != exp:
            err(item, f"out-yn {a} != {exp}")
    elif t == "out-pick":
        c = claim_color(item)
        emp = n.naive_outposts(board, c, "empty")
        anyo = n.naive_outposts(board, c, "any")
        if a not in emp or any(o in anyo for o in item["options"] if o != a) or a not in item["options"]:
            err(item, f"out-pick {a}")
    elif t == "pair-out":
        m = re.search(r"Is ([a-h][1-8]) an outpost square for (White|Black)", item["prompt"])
        sq, c = m.group(1), COL[m.group(2).lower()]
        exp = "yes" if sq in n.naive_outposts(board, c, "any") else "no"
        if a != exp:
            err(item, f"pair-out {a} != {exp}")
    elif t == "hole-select":
        c = claim_color(item)
        if sqs(a) != n.naive_holes(board, c):
            err(item, f"holes {a} != {n.naive_holes(board, c)}")
    elif t in ("hole-yn", "pair-hole"):
        m = re.search(r"Is ([a-h][1-8]) a hole in (White|Black)", item["prompt"])
        sq, c = m.group(1), COL[m.group(2).lower()]
        exp = "yes" if sq in n.naive_holes(board, c) else "no"
        if a != exp:
            err(item, f"{t} {a} != {exp}")
    elif t == "hole-pick":
        c = claim_color(item)
        holes = n.naive_holes(board, c)
        if a not in holes or any(o in holes for o in item["options"] if o != a):
            err(item, f"hole-pick {a}")
    elif t in ("space-n", "space-ctl"):
        c = claim_color(item)
        mode = "pawn_attacks" if t == "space-n" else "pawn_controlled"
        if int(a) != len(n.naive_space(board, c, mode)):
            err(item, f"{t} {a} != {len(n.naive_space(board, c, mode))}")
    elif t == "space-who":
        w, b = len(n.naive_space(board, W, "pawn_attacks")), len(n.naive_space(board, Bk, "pawn_attacks"))
        exp = "White" if w > b else "Black" if b > w else "Neither (equal)"
        if a != exp:
            err(item, f"space-who {a} != {exp}")
    elif t == "pair-space":
        w, b = len(n.naive_space(board, W, "pawn_attacks")), len(n.naive_space(board, Bk, "pawn_attacks"))
        if a != ("yes" if w > b else "no"):
            err(item, f"pair-space {a} vs {w},{b}")
    elif t == "centre-n":
        c = claim_color(item)
        cnt = 0
        for x in ("d4", "e4", "d5", "e5"):
            sq = chess.parse_square(x)
            f, r = chess.square_file(sq), chess.square_rank(sq)
            pr = r - 1 if c == W else r + 1
            if 0 <= pr <= 7 and any(0 <= f + d <= 7 and board.piece_at(chess.square(f + d, pr)) == chess.Piece(chess.PAWN, c) for d in (-1, 1)):
                cnt += 1
        if int(a) != cnt:
            err(item, f"centre-n {a} != {cnt}")
    elif t == "centre-who":
        wp = sum(1 for x in ("d4", "e4", "d5", "e5") if board.piece_at(chess.parse_square(x)) == chess.Piece(chess.PAWN, W))
        bp = sum(1 for x in ("d4", "e4", "d5", "e5") if board.piece_at(chess.parse_square(x)) == chess.Piece(chess.PAWN, Bk))
        exp = "White" if wp > bp else "Black" if bp > wp else "Neither (equal)"
        if a != exp:
            err(item, f"centre-who {a} != {exp}")
    elif t in ("pm-holes", "pm-class"):
        c = board.turn
        mv = [x["params"]["after_move"] for x in item["claims"] if "after_move" in x["params"]][0]
        nb = board.copy(stack=False)
        nb.push(chess.Move.from_uci(mv))
        newh = sorted(set(n.naive_holes(nb, c)) - set(n.naive_holes(board, c)))
        if t == "pm-holes":
            if sqs(a) != newh:
                err(item, f"pm-holes {a} != {newh}")
        else:
            newi = set(n.naive_pawns(nb, "isolated", c)) - set(n.naive_pawns(board, "isolated", c))
            newb = set(n.naive_pawns(nb, "backward", c)) - set(n.naive_pawns(board, "backward", c))
            kinds = [k for k, v in (("holes", newh), ("isolated", newi), ("backward", newb)) if v]
            o = item["options"]
            exp = o[3] if not kinds else {"holes": o[0], "isolated": o[1], "backward": o[2]}[kinds[0]] if len(kinds) == 1 else None
            if a != exp:
                err(item, f"pm-class {a} != {exp} ({kinds})")
    elif t == "blk-square":
        c = claim_color(item)
        ps = n.naive_pawns(board, "passed", c)
        if len(ps) != 1 or sqs(a) != [chess.square_name(stop(c, chess.parse_square(ps[0])))]:
            err(item, f"blk-square {a} vs {ps}")
    elif t == "blk-move":
        c = board.turn
        exp_after = []
        for m in board.legal_moves:
            if board.piece_type_at(m.from_square) in (chess.KNIGHT, chess.BISHOP, chess.ROOK, chess.QUEEN):
                nb = board.copy(stack=False)
                nb.push(m)
                if m.to_square in {stop(not c, chess.parse_square(p)) for p in n.naive_pawns(nb, "passed", not c)}:
                    exp_after.append(m.uci())
        if sorted(a) != sorted(exp_after):
            err(item, f"blk-move {a} != {exp_after}")
    elif t == "blk-yn":
        m = re.search(r"The (white|black) pawn on ([a-h][1-8])", item["prompt"])
        c, sq = COL[m.group(1)], m.group(2)
        exp = "yes" if sq in n.naive_pawns(board, "blockaded_passed", c) else "no"
        if sq not in n.naive_pawns(board, "passed", c) or a != exp:
            err(item, f"blk-yn {a} != {exp}")
    elif t == "bpair-cls":
        holders = []
        for c in (W, Bk):
            bs = [s for s, p in board.piece_map().items() if p.color == c and p.piece_type == chess.BISHOP]
            if any((chess.square_file(s) + chess.square_rank(s)) % 2 == 1 for s in bs) and any((chess.square_file(s) + chess.square_rank(s)) % 2 == 0 for s in bs):
                holders.append(c)
        o = item["options"]
        exp = o[2] if len(holders) == 2 else o[0] if holders == [W] else o[1] if holders == [Bk] else o[3]
        if a != exp:
            err(item, f"bpair-cls {a} != {exp}")
    elif t == "bpair-sel":
        c = W if "White has" in item["prompt"] else Bk
        bs = sorted(chess.square_name(s) for s, p in board.piece_map().items() if p.color == c and p.piece_type == chess.BISHOP)
        if sqs(a) != bs:
            err(item, f"bpair-sel {a} != {bs}")
    elif t == "pair-bpair":
        m = re.search(r"Does (White|Black) have the bishop pair", item["prompt"])
        c = COL[m.group(1).lower()]
        bs = [s for s, p in board.piece_map().items() if p.color == c and p.piece_type == chess.BISHOP]
        has = any((chess.square_file(s) + chess.square_rank(s)) % 2 == 1 for s in bs) and any((chess.square_file(s) + chess.square_rank(s)) % 2 == 0 for s in bs)
        if a != ("yes" if has else "no"):
            err(item, f"pair-bpair {a} vs {has}")
    elif t in ("gb-cls", "pair-gb"):
        m = re.search(r"(white|black)'s bishop on ([a-h][1-8])", item["prompt"])
        c, sq = COL[m.group(1)], chess.parse_square(m.group(2))
        pawns = [s for s, p in board.piece_map().items() if p.color == c and p.piece_type == chess.PAWN]
        bcol = (chess.square_file(sq) + chess.square_rank(sq)) % 2
        on = sum(1 for s in pawns if (chess.square_file(s) + chess.square_rank(s)) % 2 == bcol)
        cls = "bad" if 2 * on > len(pawns) else "good" if 2 * on < len(pawns) else "neutral"
        exp = cls if t == "gb-cls" else ("yes" if cls == "bad" else "no")
        if a != exp or len(pawns) < 5:
            err(item, f"{t} {a} != {exp} ({on}/{len(pawns)})")
    elif t == "act-cmp":
        mvs = [(x["params"]["after_move"], x["params"]["count"]) for x in item["claims"]]
        vals = {}
        for mv, cnt in mvs:
            nb = board.copy(stack=False)
            move = chess.Move.from_uci(mv)
            san = board.san(move)
            nb.push(move)
            vals[san] = mob_squares(nb, move.to_square)
            if vals[san] != cnt:
                err(item, f"act-cmp count {san} {vals[san]} != claim {cnt}")
        best = max(vals, key=vals.get)
        if a != best or sorted(item["options"]) != sorted(vals):
            err(item, f"act-cmp {a} vs {vals}")
    elif t == "act-min":
        labels = {}
        for x in item["claims"]:
            sq = chess.parse_square(x["params"]["square"])
            p = board.piece_at(sq)
            labels[f"the {chess.piece_name(p.piece_type)} on {x['params']['square']}"] = mob_legal(board, sq)
        mn = min(labels, key=labels.get)
        if a != mn or list(labels.values()).count(labels[mn]) != 1:
            err(item, f"act-min {a} vs {labels}")
    elif t == "oop":
        c = board.turn
        cnt = {s: mob_legal(board, s) for s, p in board.piece_map().items() if p.color == c and p.piece_type not in (chess.PAWN, chess.KING)}
        mn = min(cnt, key=cnt.get)
        srt = sorted(cnt.values())
        if sqs(a) != [chess.square_name(mn)] or srt[0] > 2 or srt[1] - srt[0] < 2:
            err(item, f"oop {a} vs {cnt}")
    elif t == "con-move":
        c = board.turn
        exp = []
        for m in board.legal_moves:
            nb = board.copy(stack=False)
            nb.push(m)
            if not rooks_connected_naive(board, c) and rooks_connected_naive(nb, c):
                exp.append(m.uci())
        if sorted(a) != sorted(exp):
            err(item, f"con-move {a} != {exp}")
    elif t == "con-yn":
        m = re.search(r"Are (white|black)'s rooks connected", item["prompt"])
        c = COL[m.group(1)]
        if a != ("yes" if rooks_connected_naive(board, c) else "no"):
            err(item, f"con-yn {a}")
    elif t == "con-between":
        m = re.search(r"\(([a-h]1|[a-h]8) and ([a-h]1|[a-h]8)\)", item["prompt"])
        r1, r2 = chess.parse_square(m.group(1)), chess.parse_square(m.group(2))
        lo, hi = sorted((chess.square_file(r1), chess.square_file(r2)))
        rk = chess.square_rank(r1)
        exp = sorted(chess.square_name(chess.square(f, rk)) for f in range(lo + 1, hi) if board.piece_at(chess.square(f, rk)) is not None)
        if sqs(a) != exp:
            err(item, f"con-between {a} != {exp}")
    elif t == "of-set":
        st = file_status(board)
        op = [chess.FILE_NAMES[f] for f in range(8) if st[f] == "open"]
        txt = "no file" if not op else "the " + (op[0] + "-file" if len(op) == 1 else ", ".join(f"{x}-file" for x in op[:-1]) + " and " + f"{op[-1]}-file")
        if a != txt:
            err(item, f"of-set {a} != {txt}")
    elif t == "of-status":
        f = chess.FILE_NAMES.index(re.search(r"status of the ([a-h])-file", item["prompt"]).group(1))
        if a != file_status(board)[f]:
            err(item, f"of-status {a} != {file_status(board)[f]}")
    elif t in ("of-move", "of-half"):
        c = board.turn
        exp = []
        for m in board.legal_moves:
            if board.piece_type_at(m.from_square) != chess.ROOK:
                continue
            nb = board.copy(stack=False)
            nb.push(m)
            st = file_status(nb)[chess.square_file(m.to_square)]
            if (t == "of-move" and st == "open") or (t == "of-half" and st == ("half-open for White" if c == W else "half-open for Black")):
                exp.append(m.uci())
        if sorted(a) != sorted(exp):
            err(item, f"{t} {a} != {exp}")
    elif t == "sev-move":
        c = board.turn
        exp = sorted(m.uci() for m in board.legal_moves if board.piece_type_at(m.from_square) == chess.ROOK and (chess.square_rank(m.to_square) == (6 if c == W else 1))
                     and chess.square_rank(m.from_square) != (6 if c == W else 1))
        if sorted(a) != exp:
            err(item, f"sev-move {a} != {exp}")
    elif t == "sev-sel":
        c = board.turn
        mv = [x["params"]["after_move"] for x in item["claims"] if "after_move" in x["params"]][0]
        nb = board.copy(stack=False)
        move = chess.Move.from_uci(mv)
        nb.push(move)
        exp = sorted(chess.square_name(s) for s in nb.attacks(move.to_square) if nb.piece_at(s) == chess.Piece(chess.PAWN, not c) and chess.square_rank(s) == (6 if c == W else 1))
        if sqs(a) != exp:
            err(item, f"sev-sel {a} != {exp}")
    elif t in ("sh-select", "sh-n"):
        c = claim_color(item) if item["claims"][0]["type"] != "piece_on" else (W if item["claims"][0]["params"]["piece"] == "K" else Bk)
        k = board.king(c)
        d = 1 if c == W else -1
        shield = []
        for df in (-1, 0, 1):
            for dr in (1, 2):
                f2, r2 = chess.square_file(k) + df, chess.square_rank(k) + d * dr
                if 0 <= f2 <= 7 and 0 <= r2 <= 7 and board.piece_at(chess.square(f2, r2)) == chess.Piece(chess.PAWN, c):
                    shield.append(chess.square_name(chess.square(f2, r2)))
        if t == "sh-select" and sqs(a) != sorted(shield):
            err(item, f"sh-select {a} != {shield}")
        if t == "sh-n" and int(a) != len(shield):
            err(item, f"sh-n {a} != {len(shield)}")
    elif t == "sh-new":
        c = board.turn
        mv = [x["params"]["after_move"] for x in item["claims"] if "after_move" in x["params"]][0]
        nb = board.copy(stack=False)
        nb.push(chess.Move.from_uci(mv))
        newh = sorted(set(n.naive_holes(nb, c)) - set(n.naive_holes(board, c)))
        if sqs(a) != newh:
            err(item, f"sh-new {a} != {newh}")
    elif t == "sh-pick":
        c = board.turn
        res = {}
        for x in item["claims"]:
            if "after_move" in x["params"]:
                nb = board.copy(stack=False)
                mv = chess.Move.from_uci(x["params"]["after_move"])
                san = board.san(mv)
                nb.push(mv)
                res[san] = sorted(set(n.naive_holes(nb, c)) - set(n.naive_holes(board, c)))
        with_new = [k for k, v in res.items() if v]
        if with_new != [a] or sorted(res) != sorted(item["options"]):
            err(item, f"sh-pick {a} vs {res}")
    elif t == "cas-cmp":
        m = re.search(r"Count the (white|black) pieces that attack ([a-h][1-8])", item["prompt"])
        att, sq = COL[m.group(1)], chess.parse_square(m.group(2))
        na, nd = len(board.attackers(att, sq)), len(board.attackers(not att, sq))
        o = item["options"]
        exp = o[0] if na > nd else o[1] if na == nd else o[2]
        if a != exp:
            err(item, f"cas-cmp {a} != {exp} ({na},{nd})")
    elif t == "storm":
        def wing(c):
            f = chess.square_file(board.king(c))
            return "queenside" if f <= 2 else "centre" if f <= 4 else "kingside"
        w_, b_ = wing(W), wing(Bk)
        o = item["options"]
        exp = o[2] if "centre" in (w_, b_) else o[0] if w_ != b_ else o[1]
        if a != exp:
            err(item, f"storm {a} != {exp}")
    elif t == "lever":
        c = board.turn
        e = not c
        k = board.king(e)
        d = 1 if e == W else -1
        shield = []
        for df in (-1, 0, 1):
            for dr in (1, 2):
                f2, r2 = chess.square_file(k) + df, chess.square_rank(k) + d * dr
                if 0 <= f2 <= 7 and 0 <= r2 <= 7 and board.piece_at(chess.square(f2, r2)) == chess.Piece(chess.PAWN, e):
                    shield.append(chess.square(f2, r2))
        exp = set()
        for m in board.legal_moves:
            if board.piece_type_at(m.from_square) == chess.PAWN:
                nb = board.copy(stack=False)
                nb.push(m)
                if any(s in nb.attacks(m.to_square) for s in shield):
                    exp.add(m.uci())
        if sorted(a) != sorted(exp):
            err(item, f"lever {a} != {sorted(exp)}")
    elif t == "exchange":
        seq = [x["params"]["after_moves"] for x in item["claims"] if "after_moves" in x["params"]][0]
        nb = board.copy(stack=False)
        for u in seq:
            nb.push(chess.Move.from_uci(u))
        def feats(b):
            st = file_status(b)
            return dict(open={f for f in range(8) if st[f] == "open"}, bp=N_bp(b), dbl={c: set(n.naive_pawns(b, "doubled", c)) for c in (W, Bk)},
                        iso={c: set(n.naive_pawns(b, "isolated", c)) for c in (W, Bk)}, pas={c: set(n.naive_pawns(b, "passed", c)) for c in (W, Bk)})
        fb, fa = feats(board), feats(nb)
        def truth(text):
            if text.startswith("A file becomes open"):
                return bool(fa["open"] - fb["open"])
            m = re.match(r"(White|Black) loses the bishop pair", text)
            if m:
                c = COL[m.group(1).lower()]
                return c in fb["bp"] and c not in fa["bp"]
            m = re.match(r"(White|Black) ends up with (doubled pawns|an isolated pawn|a passed pawn)", text)
            c = COL[m.group(1).lower()]
            key = {"doubled pawns": "dbl", "an isolated pawn": "iso", "a passed pawn": "pas"}[m.group(2)]
            return bool(fa[key][c] - fb[key][c])
        opts = [o for o in item["options"] if o != "None of these"]
        tv = [truth(o) for o in opts]
        if a == "None of these":
            if any(tv):
                err(item, f"exchange: answer none but truths {tv}")
        elif tv.count(True) != 1 or not truth(a):
            err(item, f"exchange: truths {tv} answer {a}")
    elif t == "struct":
        import gen_struct as G
        ms = G.matches(board)
        exp = ms[0][0] if len(ms) == 1 else G.NONE if not ms else None
        if a != exp:
            err(item, f"struct {a} != {exp} ({ms})")
    elif t in ("imbalances", "doubled-ctx"):
        import gen_mixed as M
        import random
        rec = {"f": __import__("pcommon").features(board), "fen": board.fen()}
        sts = {s.text: s.truth for s in M.statements(rec, board, random.Random(0))}
        opts = [o for o in item["options"] if o != M.NONE_OPT]
        truths = [sts.get(o) for o in opts]
        if None in truths:
            err(item, f"mixed: unknown statement in {opts}")
        elif a == M.NONE_OPT:
            if any(truths):
                err(item, f"mixed: answer is 'none' but truths {truths}")
        elif truths.count(True) != 1 or sts.get(a) is not True:
            err(item, f"mixed: truths {truths} answer {a}")


def N_bp(board):
    out = []
    for c in (W, Bk):
        bs = [s for s, p in board.piece_map().items() if p.color == c and p.piece_type == chess.BISHOP]
        if any((chess.square_file(s) + chess.square_rank(s)) % 2 == 1 for s in bs) and any((chess.square_file(s) + chess.square_rank(s)) % 2 == 0 for s in bs):
            out.append(c)
    return out


def N_half(board, c):
    """files with no pawn of colour c and at least one enemy pawn (half-open for c)"""
    own = {chess.square_file(s) for s in board.pieces(chess.PAWN, c)}
    opp = {chess.square_file(s) for s in board.pieces(chess.PAWN, not c)}
    return [chess.FILE_NAMES[f] for f in range(8) if f not in own and f in opp]


def check_contract(item, pos, board):
    if not item["id"].startswith("IP-") or not pos["id"].startswith("PP-"):
        err(item, "id prefix")
    if len(item.get("hints", [])) != 3:
        err(item, "needs three hints")
    if not item.get("explain") or not pos.get("family"):
        err(item, "explain/family missing")
    if item["task"] in ("predict_outcome", "classify_position"):
        opts = item.get("options") or item["answer"].get("options")
        want = item["answer"].get("outcome") or item["answer"].get("class")
        if not opts or want not in opts or len(set(opts)) != len(opts):
            err(item, f"answer {want!r} not among unique options {opts}")
        if item.get("options") != item["answer"].get("options") and item["task"] == "classify_position" and item["answer"].get("options"):
            err(item, "options differ between top level and answer")
    if item["task"] == "find_move":
        for m in item["answer"]["moves"]:
            if chess.Move.from_uci(m) not in board.legal_moves:
                err(item, f"accepted move {m} is illegal")
    if item["task"] == "select_squares":
        for s in item["answer"]["squares"]:
            chess.parse_square(s)
        if not item["answer"]["squares"]:
            err(item, "select_squares with an empty answer")
    if item["review"]["status"] not in ("machine-only", "needs-human"):
        err(item, "review status")
    # cue-3 items must not name the theme in the prompt of unlabeled families: only a light check (the node ids never appear)
    if item["cue"] == 3 and re.search(r"POS\.|node\.", item["prompt"]):
        err(item, "prompt leaks a node id")


def main():
    files = sorted(glob.glob(str(ROOT / "content" / "items" / "pos-*.json")))
    ids, pids = set(), set()
    fens = Counter()
    total = 0
    by_tpl = Counter()
    for f in files:
        d = json.load(open(f, encoding="utf-8"))
        pos = {p["id"]: p for p in d["positions"]}
        for p in d["positions"]:
            if p["id"] in pids:
                errors.append(f"duplicate position id {p['id']}")
            pids.add(p["id"])
        for it in d["items"]:
            total += 1
            if it["id"] in ids:
                errors.append(f"duplicate item id {it['id']}")
            ids.add(it["id"])
            p = pos[it["position"]]
            board = chess.Board(p["fen"])
            fens[" ".join(p["fen"].split()[:4])] += 1
            check_contract(it, p, board)
            try:
                check_item(it, board)
            except Exception as ex:
                err(it, f"audit error {type(ex).__name__}: {ex}")
            by_tpl[tpl(it)] += 1
    for k, v in fens.items():
        if v > 1:
            errors.append(f"duplicate position (board, turn, castling, ep) used {v} times: {k}")
    print(f"audited {total} items in {len(files)} files; templates: {len(by_tpl)}")
    unaudited = [t for t in by_tpl if t.startswith(("quiet-",)) or t in ("find_move", "classify_position", "predict_outcome")]
    print("not re-derived (claims only):", sorted(unaudited))
    if errors:
        print(f"{len(errors)} PROBLEM(S):")
        for e in errors[:60]:
            print("  ", e)
        sys.exit(1)
    print("AUDIT PASSED")


if __name__ == "__main__":
    main()
