"""Family A, pieces: bishop pair, good and bad bishops by pawn colour, piece mobility (activity), pieces cut off, connecting rooks,
open and half-open files, rooks on the seventh. Exact claims (tools/structure.py); real calm Lichess positions (CC0) or piece/pawn edits.

    ./tools/.venv/Scripts/python.exe -I tools/positional/gen_pieces.py
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import chess
import pcommon as C
import psel
import structure as S
from pcommon import Cl, mk, CN, CT, PN, join_and, files_phrase, FILES
from pgen import Driver, random_for, pair_make, YN
from generators.common import see_gain

SEED = 20261103
W, Bk = chess.WHITE, chess.BLACK
CK = {W: "w", Bk: "b"}
LIGHT = chess.BB_LIGHT_SQUARES
Q = dict(bp_cls=2, bp_sel=4, bp_pair=2, gb_cls=3, gb_pair=3, act_cmp=6, act_min=6, oop=12, con_move=5, con_yn=3, con_between=4, of_set=6, of_status=2,
         of_move=4, of_half=3, sev_move=5, sev_sel=4)


def F(rec, c, key):
    return rec["f"][f"{CK[c]}.{key}"]


def safe_after(board, move):
    b = board.copy(stack=False)
    b.push(move)
    for m in b.legal_moves:
        if m.to_square == move.to_square and b.is_capture(m) and see_gain(b, m) > 0:
            return False
    return True


def sqcolour(sq):
    return "light" if (LIGHT >> sq) & 1 else "dark"


def piece_claims(cl, board, squares):
    for s in squares:
        pc = board.piece_at(s)
        cl.add("piece_on", f"{chess.square_name(s)} holds the {CN[pc.color]} {PN[pc.piece_type]}.", square=chess.square_name(s), piece=pc.symbol())
    return cl


# ----------------------------------------------------------------------------------------------------------------
# bishop pair
# ----------------------------------------------------------------------------------------------------------------
BP_OPTS = ["White", "Black", "Both sides", "Neither side"]


def t_bishop_pair_cls(rec, board):
    holders = S.bishop_pair_holders(board)
    ans = BP_OPTS[2] if len(holders) == 2 else BP_OPTS[0] if holders == ["white"] else BP_OPTS[1] if holders == ["black"] else BP_OPTS[3]
    bishops = sorted(board.pieces(chess.BISHOP, W) | board.pieces(chess.BISHOP, Bk))
    cl = Cl().add("bishop_pair", f"The colours that own the bishop pair: {join_and(holders, 'neither')}.", holders=holders)
    piece_claims(cl, board, bishops)
    desc = "; ".join(f"{CN[board.color_at(s)]} has a {sqcolour(s)}-squared bishop on {chess.square_name(s)}" for s in bishops) or "no bishops are on the board"
    item = mk("POS.BISHOPS.D1", 1, "classify_position",
              "Which side has the bishop pair? A side has it when it owns one bishop on light squares and one on dark squares.",
              {"class": ans}, cl, ["POS.BISHOPS"],
              ["List each side's bishops.", "For every bishop, ask: does it move on light or dark squares? (A1 is dark, so a bishop on a square with the same colour as a1 is dark-squared.)",
               "A side needs both a light-squared and a dark-squared bishop."],
              f"{desc[0].upper() + desc[1:]}. Bishop pair: {join_and(holders, 'neither side')}.", C.fam(rec), options=BP_OPTS, tpl="bpair-cls")
    return [(board, item, C.prov(rec), "bpair-cls")]


def t_bishop_pair_sel(c):
    def make(rec, board):
        if S.bishop_pair_holders(board) != [CN[c]]:
            return None
        bs = sorted(board.pieces(chess.BISHOP, c))
        if len(bs) != 2:
            return None
        names = [chess.square_name(s) for s in bs]
        cl = Cl().add("bishop_pair", f"{CT[c]} has the bishop pair.", holders=[h for h in S.bishop_pair_holders(board)])
        piece_claims(cl, board, bs)
        item = mk("POS.BISHOPS.D1", 1, "select_squares",
                  f"{CT[c]} has the bishop pair. Tap the two bishops that make it up.", {"squares": sorted(names)}, cl, ["POS.BISHOPS"],
                  ["Find all of that side's bishops.", "The pair is a light-squared bishop together with a dark-squared bishop.", f"One of them is on the {names[0][0]}-file."],
                  f"{CT[c]}'s bishops: {names[0]} ({sqcolour(bs[0])}-squared) and {names[1]} ({sqcolour(bs[1])}-squared), so together they cover both colours of squares.",
                  C.fam(rec), tpl="bpair-sel")
        return [(board, item, C.prov(rec), "bpair-sel")]
    return make


def bpair_edits(board, c, s):
    for desc, nb in C.swap_edits(board, c, chess.BISHOP, chess.KNIGHT):
        yield desc, nb


# ----------------------------------------------------------------------------------------------------------------
# good and bad bishops (pawn colour rule)
# ----------------------------------------------------------------------------------------------------------------
GB_RULE = ("Rule used here: count the bishop's side's pawns that stand on squares of the bishop's own colour. If more than half of that side's pawns are on its colour the bishop is 'bad'; "
           "if fewer than half, 'good'; if exactly half, 'neutral'.")
GB_OPTS = ["good", "bad", "neutral"]


def gb_class(board, c, bsq):
    pc = S.pawn_colours(board, c)
    n = pc["light"] + pc["dark"]
    on = pc["light"] if (LIGHT >> bsq) & 1 else pc["dark"]
    return "bad" if 2 * on > n else "good" if 2 * on < n else "neutral", on, n


def gb_claims(board, c, bsq):
    pc = S.pawn_colours(board, c)
    b = chess.square_name(bsq)
    return (Cl().add("piece_on", f"{b} holds the {CN[c]} bishop.", square=b, piece="B" if c == W else "b")
            .add("pawn_colours", f"{CT[c]} has {pc['light']} pawn(s) on light squares and {pc['dark']} on dark squares.", color=CN[c], light=pc["light"], dark=pc["dark"]))


def gb_expl(board, c, bsq):
    cls, on, n = gb_class(board, c, bsq)
    pc = S.pawn_colours(board, c)
    b = chess.square_name(bsq)
    cmp_ = "more than half" if cls == "bad" else "fewer than half" if cls == "good" else "exactly half"
    return (f"The bishop on {b} moves on {sqcolour(bsq)} squares. {CT[c]} has {n} pawns: {pc['light']} on light squares and {pc['dark']} on dark squares, so {on} of {n} are on the bishop's colour, "
            f"{cmp_}: by this rule the bishop is {cls}. The rule is a rule of thumb; it does not say how the bishop is really doing.")


def t_gb_cls(rec, board):
    want = rec["_want"]
    rng = random_for(rec, "gb")
    cands = []
    for c in (W, Bk):
        pc = S.pawn_colours(board, c)
        if pc["light"] + pc["dark"] < 5:
            continue
        for bsq in sorted(board.pieces(chess.BISHOP, c)):
            if gb_class(board, c, bsq)[0] == want:
                cands.append((c, bsq))
    if not cands:
        return None
    c, bsq = rng.choice(cands)
    b = chess.square_name(bsq)
    item = mk("POS.GOODBAD.D1", 1, "classify_position", f"Classify {CN[c]}'s bishop on {b}. {GB_RULE}", {"class": want}, gb_claims(board, c, bsq), ["POS.GOODBAD"],
              [f"First find out whether the bishop on {b} moves on light or dark squares.", f"Count {CN[c]}'s pawns on light squares and on dark squares.",
               "Compare the number on the bishop's colour with half of the pawns."], gb_expl(board, c, bsq), C.fam(rec), options=GB_OPTS, tpl="gb-cls")
    return [(board, item, C.prov(rec), "gb-cls")]


def gb_feat(board, c, s):
    return gb_class(board, c, chess.parse_square(s))[0] == "bad"


def gb_pair_make():
    def cands(rec, board):
        out = []
        for c in (W, Bk):
            pc = S.pawn_colours(board, c)
            if pc["light"] + pc["dark"] < 5:
                continue
            out += [(c, chess.square_name(b)) for b in board.pieces(chess.BISHOP, c)]
        return out

    def q(c, s):
        return f"Is {CN[c]}'s bishop on {s} a 'bad' bishop? {GB_RULE}"

    def cl(board, c, s):
        return gb_claims(board, c, chess.parse_square(s))

    def why(board, c, s, yes):
        return gb_expl(board, c, chess.parse_square(s))

    def hints(c, s):
        return [f"Find the colour of the squares the bishop on {s} moves on.", f"Count {CN[c]}'s pawns on that colour of square and compare with half of all {CN[c]} pawns.", "More than half means bad."]

    return pair_make("gb", cands, gb_feat, ("push", "shift"), q, "POS.GOODBAD.D3", cl, why, ["POS.GOODBAD"], hints)


# ----------------------------------------------------------------------------------------------------------------
# activity: legal moves and attacked free squares
# ----------------------------------------------------------------------------------------------------------------
def t_act_cmp(rec, board):
    c = board.turn
    rng = random_for(rec, "actcmp")
    pieces = [s for s, p in board.piece_map().items() if p.color == c and p.piece_type in (chess.KNIGHT, chess.BISHOP, chess.ROOK)]
    rng.shuffle(pieces)
    for s in pieces:
        moves = [m for m in board.legal_moves if m.from_square == s and not board.is_capture(m) and not board.gives_check(m)]
        scored = []
        for m in moves:
            if not safe_after(board, m):
                continue
            after = board.copy(stack=False)
            after.push(m)
            scored.append((S.mobility(after, m.to_square, "squares"), m))
        rng.shuffle(scored)
        for i in range(len(scored)):
            for j in range(i + 1, len(scored)):
                (a, ma), (b, mb) = scored[i], scored[j]
                if abs(a - b) >= 3 and ma.to_square != mb.to_square:
                    hi, lo = (ma, mb) if a > b else (mb, ma)
                    sa, sb = board.san(ma), board.san(mb)
                    pt = PN[board.piece_type_at(s)]
                    cl = (Cl().add("mobility", f"After {sa} the {pt} attacks {a} squares that none of {CT[c]}'s pieces occupy.", square=chess.square_name(ma.to_square), mode="squares", count=a, after_move=ma.uci())
                          .add("mobility", f"After {sb} the {pt} attacks {b} squares that none of {CT[c]}'s pieces occupy.", square=chess.square_name(mb.to_square), mode="squares", count=b, after_move=mb.uci()))
                    opts = [sa, sb]
                    rng.shuffle(opts)
                    ans = board.san(hi)
                    item = mk("POS.ACTIVITY.D1", 1, "classify_position",
                              f"{CT[c]} to move. Compare {sa} and {sb} with the same {pt}. After which move can the {pt} reach more squares next time? Count the squares it attacks that none of {CN[c]}'s own pieces occupy.",
                              {"class": ans}, cl, ["POS.ACTIVITY"],
                              ["Imagine the piece on each square in turn.", "Count the squares it attacks, ignoring squares occupied by its own pieces. Squares holding enemy pieces count.",
                               f"The two counts are {min(a, b)} and {max(a, b)}; decide which move gives the larger one."],
                              f"After {board.san(hi)} the {pt} attacks {max(a, b)} free-or-capturable squares; after {board.san(lo)} only {min(a, b)}. This compares square counts only. "
                              f"It does not say which move is better: safety, threats and structure also matter.", C.fam(rec), options=opts, tpl="act-cmp")
                    return [(board, item, C.prov(rec), "act-cmp")]
    return None


def piece_label(board, s):
    p = board.piece_at(s)
    return f"the {PN[p.piece_type]} on {chess.square_name(s)}"


def legal_counts(board, c):
    return {s: S.mobility(board, s, "legal") for s, p in board.piece_map().items() if p.color == c and p.piece_type not in (chess.PAWN, chess.KING)}


def t_act_min(rec, board):
    c = board.turn
    rng = random_for(rec, "actmin")
    cnt = legal_counts(board, c)
    if len(cnt) < 4:
        return None
    order = sorted(cnt.items(), key=lambda kv: kv[1])
    if order[1][1] - order[0][1] < 2:
        return None
    mn = order[0][0]
    others = [s for s, _ in order[1:]]
    rng.shuffle(others)
    chosen = [mn] + others[:3]
    labels = {s: piece_label(board, s) for s in chosen}
    if len(set(labels.values())) < 4:
        return None
    opts = list(labels.values())
    rng.shuffle(opts)
    cl = Cl()
    for s in chosen:
        cl.add("mobility", f"{labels[s].capitalize()} has {cnt[s]} legal move destination{'s' if cnt[s] != 1 else ''}.", square=chess.square_name(s), mode="legal", count=cnt[s])
    item = mk("POS.ACTIVITY.D2", 2, "classify_position",
              f"{CT[c]} to move. Which of these four pieces has the fewest legal moves (count the different squares each can move to)?",
              {"class": labels[mn]}, cl, ["POS.ACTIVITY", "POS.OUTOFPLAY"],
              ["For each of the four pieces, count the squares it can legally move to.", "Remember pins and blocked lines: a legal move must not leave your own king in check.",
               f"The smallest count is {cnt[mn]}."],
              "Legal destination counts: " + "; ".join(f"{labels[s]} {cnt[s]}" for s in chosen) + f". The fewest is {labels[mn]}. The count says how restricted the piece is right now; it does not say how to improve it.",
              C.fam(rec), options=opts, tpl="act-min")
    return [(board, item, C.prov(rec), "act-min")]


def t_oop(rec, board):
    c = board.turn
    cnt = legal_counts(board, c)
    if len(cnt) < 3:
        return None
    order = sorted(cnt.items(), key=lambda kv: kv[1])
    if order[0][1] > 2 or order[1][1] - order[0][1] < 2:
        return None
    mn = order[0][0]
    cl = Cl()
    for s, n in sorted(cnt.items()):
        cl.add("mobility", f"{piece_label(board, s).capitalize()} has {n} legal move destination{'s' if n != 1 else ''}.", square=chess.square_name(s), mode="legal", count=n)
    name = chess.square_name(mn)
    item = mk("POS.OUTOFPLAY.D1", 1, "select_squares",
              f"{CT[c]} to move. One of {CN[c]}'s pieces (not a pawn or the king) is far more restricted than the others. Tap the piece with the fewest legal moves.",
              {"squares": [name]}, cl, ["POS.OUTOFPLAY", "POS.ACTIVITY"],
              ["Count the legal destinations of each knight, bishop, rook and queen.", "A piece that is hemmed in by its own pawns or pieces has very few.",
               f"It can move to {order[0][1]} square{'s' if order[0][1] != 1 else ''}."],
              f"Legal destinations: " + "; ".join(f"{piece_label(board, s)} {n}" for s, n in sorted(cnt.items(), key=lambda kv: kv[1])) + f". {piece_label(board, mn).capitalize()} has the fewest. "
              f"The count is only about legal moves; whether the piece is really out of play is not claimed here.",
              C.fam(rec), tpl="oop")
    return [(board, item, C.prov(rec), "oop")]


# ----------------------------------------------------------------------------------------------------------------
# rooks
# ----------------------------------------------------------------------------------------------------------------
def t_con_move(rec, board):
    c = board.turn
    mv = rec["m"].get("connects_rooks", [])
    if not 1 <= len(mv) <= 3 or S.rooks_connected(board, c):
        return None
    if not all(safe_after(board, chess.Move.from_uci(m)) for m in mv):
        return None
    sn = [board.san(chess.Move.from_uci(m)) for m in mv]
    cl = (Cl().add("rooks_connected", f"{CT[c]}'s rooks are not connected now.", color=CN[c], value=False)
          .add("moves_where", f"The legal moves that connect the rooks are exactly {join_and(sn)}.", property="connects_rooks", moves=sorted(mv)))
    item = mk("POS.CONNECT.D1", 1, "find_move",
              f"{CT[c]} to move. The rooks are not connected. Find a move after which they are: on one rank or file with nothing between them.",
              {"moves": sorted(mv)}, cl, ["POS.CONNECT"],
              ["Find the two rooks and look at the squares between them.", "Which piece (or pieces) stands between them, and where can it go?", f"There {'is' if len(mv) == 1 else 'are'} {len(mv)} such move{'s' if len(mv) != 1 else ''}."],
              f"After {join_and(sn)} nothing stands between the rooks. The item asks only for the connection; it does not claim this is the best move.", C.fam(rec), tpl="con-move")
    return [(board, item, C.prov(rec), "con-move")]


def t_con_yn(want):
    def make(rec, board):
        rng = random_for(rec, "conyn")
        cs = [c for c in (W, Bk) if len(board.pieces(chess.ROOK, c)) == 2]
        rng.shuffle(cs)
        for c in cs:
            conn = S.rooks_connected(board, c)
            if (want == "yes") != conn:
                continue
            r1, r2 = sorted(board.pieces(chess.ROOK, c))
            n1, n2 = chess.square_name(r1), chess.square_name(r2)
            cl = Cl().add("rooks_connected", f"{CT[c]}'s rooks are {'connected' if conn else 'not connected'}.", color=CN[c], value=conn)
            cl.add("piece_on", f"{n1} holds a {CN[c]} rook.", square=n1, piece="R" if c == W else "r").add("piece_on", f"{n2} holds a {CN[c]} rook.", square=n2, piece="R" if c == W else "r")
            same = chess.square_rank(r1) == chess.square_rank(r2) or chess.square_file(r1) == chess.square_file(r2)
            if conn:
                why = f"The rooks on {n1} and {n2} stand on one {'rank' if chess.square_rank(r1) == chess.square_rank(r2) else 'file'} with nothing between them: they are connected."
            elif not same:
                why = f"The rooks on {n1} and {n2} are not on one rank or file, so they are not connected."
            else:
                btw = sorted(chess.square_name(x) for x in chess.SquareSet(chess.between(r1, r2) & board.occupied))
                for x in btw:
                    pc = board.piece_at(chess.parse_square(x))
                    cl.add("piece_on", f"{x} holds the {CN[pc.color]} {PN[pc.piece_type]}.", square=x, piece=pc.symbol())
                why = f"The rooks on {n1} and {n2} share a {'rank' if chess.square_rank(r1) == chess.square_rank(r2) else 'file'}, but {join_and(btw)} stand{'s' if len(btw) == 1 else ''} between them."
            item = mk("POS.CONNECT.D1", 1, "predict_outcome", f"Are {CN[c]}'s rooks connected? (On one rank or file with no piece, of either colour, between them.)",
                      {"outcome": want}, cl, ["POS.CONNECT"],
                      ["Find the two rooks.", "Are they on the same rank or the same file?", "If so, look at every square between them."], why, C.fam(rec), options=YN, tpl="con-yn")
            return [(board, item, C.prov(rec), "con-yn")]
        return None
    return make


def t_con_between(rec, board):
    rng = random_for(rec, "conbtw")
    cs = [c for c in (W, Bk) if len(board.pieces(chess.ROOK, c)) == 2]
    rng.shuffle(cs)
    for c in cs:
        r1, r2 = sorted(board.pieces(chess.ROOK, c))
        if chess.square_rank(r1) != chess.square_rank(r2) or S.rr(c, r1) != 0:
            continue
        btw_sq = list(chess.SquareSet(chess.between(r1, r2)))
        blockers = [x for x in btw_sq if board.piece_at(x) is not None]
        if not 1 <= len(blockers) <= 3:
            continue
        n1, n2 = chess.square_name(r1), chess.square_name(r2)
        cl = Cl().add("piece_on", f"{n1} holds a {CN[c]} rook.", square=n1, piece="R" if c == W else "r").add("piece_on", f"{n2} holds a {CN[c]} rook.", square=n2, piece="R" if c == W else "r")
        for x in sorted(btw_sq):
            pc = board.piece_at(x)
            cl.add("piece_on", f"{chess.square_name(x)} holds {('the ' + CN[pc.color] + ' ' + PN[pc.piece_type]) if pc else 'nothing'}.", square=chess.square_name(x), piece=pc.symbol() if pc else "empty")
        names = sorted(chess.square_name(x) for x in blockers)
        item = mk("POS.CONNECT.D1", 1, "select_squares",
                  f"{CT[c]}'s rooks stand on the first rank ({n1} and {n2}) but are not connected. Tap every piece that stands between them.",
                  {"squares": names}, cl, ["POS.CONNECT"],
                  ["Look along the rank from one rook to the other.", "Every occupied square between the two rooks blocks the connection.", f"{len(names)} piece{'s' if len(names) != 1 else ''} stand{'s' if len(names) == 1 else ''} between them."],
                  f"Between {n1} and {n2} stand {join_and([piece_label(board, x)[4:] for x in sorted(blockers)])}.", C.fam(rec), tpl="con-between")
        return [(board, item, C.prov(rec), "con-between")]
    return None


def file_phrase(fs):
    return "no file" if not fs else "the " + join_and([f"{f}-file" for f in fs])


def t_of_set(rec, board):
    rng = random_for(rec, "ofset")
    fl = S.open_files(board)
    op = fl["open"]
    allf = list(FILES)
    others = [f for f in allf if f not in op]
    variants = []
    if fl["half_open_white"] or fl["half_open_black"]:
        variants.append(sorted(op + [rng.choice(fl["half_open_white"] + fl["half_open_black"])]))
    if op:
        variants.append(sorted(op[:-1]) if len(op) > 1 else [])
        variants.append(sorted([f for f in op[1:]] + [rng.choice(others)]) if len(op) > 1 else sorted([rng.choice(others)]))
    else:
        variants.append([rng.choice(allf)])
        variants.append(sorted(rng.sample(allf, 2)))
    variants.append(sorted(op + [rng.choice(others)]) if others else [])
    variants += [sorted(rng.sample(allf, max(1, len(op)))), sorted(rng.sample(allf, 2))]
    opts = [op]
    for v in variants:
        if v not in opts:
            opts.append(v)
        if len(opts) == 4:
            break
    if len(opts) < 4:
        return None
    texts = [file_phrase(o) for o in opts]
    ans = file_phrase(op)
    rng.shuffle(texts)
    cl = Cl().add("open_files", f"Open files: {join_and(op, 'none')}. Half-open for White: {join_and(fl['half_open_white'], 'none')}. Half-open for Black: {join_and(fl['half_open_black'], 'none')}.",
                  open=op, half_open_white=fl["half_open_white"], half_open_black=fl["half_open_black"])
    item = mk("POS.OPENFILE.D1", 1, "classify_position", "Which file or files are OPEN? A file is open when no pawn of either colour stands on it.", {"class": ans}, cl, ["POS.OPENFILE"],
              ["Look file by file, from a to h.", "A single pawn of either colour on a file keeps it from being open.", "A file with pawns of only one colour is half-open, which is not the same."],
              f"Open: {file_phrase(op)}. Half-open for White (no white pawn, at least one black pawn): {file_phrase(fl['half_open_white'])}. Half-open for Black: {file_phrase(fl['half_open_black'])}.",
              C.fam(rec), options=texts, tpl="of-set")
    return [(board, item, C.prov(rec), "of-set")]


STAT = ["open", "half-open for White", "half-open for Black", "closed (both sides have a pawn on it)"]


def t_of_status(rec, board):
    want = rec["_want"]
    rng = random_for(rec, "ofstat")
    fl = S.open_files(board)
    idx = STAT.index(want)
    if idx == 0:
        pool = fl["open"]
    elif idx == 1:
        pool = fl["half_open_white"]
    elif idx == 2:
        pool = fl["half_open_black"]
    else:
        pool = [f for f in FILES if f not in fl["open"] + fl["half_open_white"] + fl["half_open_black"]]
    if not pool:
        return None
    f = rng.choice(pool)
    cl = Cl().add("open_files", f"Open: {join_and(fl['open'], 'none')}. Half-open for White: {join_and(fl['half_open_white'], 'none')}. Half-open for Black: {join_and(fl['half_open_black'], 'none')}.",
                  open=fl["open"], half_open_white=fl["half_open_white"], half_open_black=fl["half_open_black"])
    why = {STAT[0]: f"No pawn of either colour stands on the {f}-file: it is open.", STAT[1]: f"White has no pawn on the {f}-file but Black has at least one: it is half-open for White.",
           STAT[2]: f"Black has no pawn on the {f}-file but White has at least one: it is half-open for Black.", STAT[3]: f"Both White and Black have a pawn on the {f}-file: it is closed."}[want]
    item = mk("POS.OPENFILE.D1", 2, "classify_position",
              f"What is the status of the {f}-file? (Open: no pawns. Half-open for a side: none of its own pawns but at least one enemy pawn. Closed: both sides have a pawn on it.)",
              {"class": want}, cl, ["POS.OPENFILE"],
              [f"Look down the {f}-file from rank 1 to rank 8 and note which colours of pawn stand on it.", "No pawns: open. Pawns of one colour only: half-open for the OTHER side.", "Pawns of both colours: closed."],
              why, C.fam(rec), options=STAT, tpl="of-status")
    return [(board, item, C.prov(rec), "of-status")]


def t_of_move(prop, tpl, rank_text):
    def make(rec, board):
        c = board.turn
        mv = rec["m"].get(prop, [])
        if not 1 <= len(mv) <= 3 or not all(safe_after(board, chess.Move.from_uci(m)) for m in mv):
            return None
        sn = [board.san(chess.Move.from_uci(m)) for m in mv]
        cl = Cl().add("moves_where", f"The legal rook moves {rank_text[1]} are exactly {join_and(sn)}.", property=prop, moves=sorted(mv))
        item = mk("POS.OPENFILE.D1", 1, "find_move", f"{CT[c]} to move. {rank_text[0]}", {"moves": sorted(mv)}, cl, ["POS.OPENFILE"],
                  ["Find the files without pawns (open) or without your own pawns (half-open).", "Which of your rooks can reach such a file in one move?", f"There {'is' if len(mv) == 1 else 'are'} {len(mv)} such move{'s' if len(mv) != 1 else ''}."],
                  f"After {join_and(sn)} the rook stands on a file that {rank_text[2]}. The item asks only for the file; it does not claim this is the best move or that the file is useful.", C.fam(rec), tpl=tpl)
        return [(board, item, C.prov(rec), tpl)]
    return make


def t_sev_move(rec, board):
    c = board.turn
    mv = rec["m"].get("rook_to_seventh", [])
    if len(mv) != 1 or not safe_after(board, chess.Move.from_uci(mv[0])):
        return None
    m = chess.Move.from_uci(mv[0])
    after = board.copy(stack=False)
    after.push(m)
    seventh = [s for s in chess.SQUARES if S.rr(c, s) == 6]
    att = S.attacked_squares(after, m.to_square)
    pawns = sorted(chess.square_name(s) for s in seventh if after.piece_at(s) == chess.Piece(chess.PAWN, not c) and chess.square_name(s) in att)
    if not pawns:
        return None
    san = board.san(m)
    sym = "p" if c == W else "P"
    cl = (Cl().add("moves_where", f"The only legal move that brings a rook to the seventh rank is {san}.", property="rook_to_seventh", moves=[mv[0]])
          .add("piece_attacks", f"After {san} the rook attacks {join_and(pawns)}.", square=chess.square_name(m.to_square), includes=pawns, after_move=mv[0]))
    for p in pawns:
        cl.add("piece_on", f"{p} holds an enemy pawn.", square=p, piece=sym)
    item = mk("POS.SEVENTH.D1", 1, "find_move", f"{CT[c]} to move. Invade the seventh rank (the 7th rank counted from your side): bring a rook onto it.", {"moves": [mv[0]]}, cl, ["POS.SEVENTH"],
              ["Look at the 7th rank from your side: what stands there?", "A rook there attacks pawns from behind and can cut the enemy king off.", "Only one rook move reaches that rank."],
              f"{san} is the only rook move that reaches the seventh rank. From there the rook attacks {join_and(pawns)}. The item does not claim the invasion is the best move.", C.fam(rec), tpl="sev-move")
    return [(board, item, C.prov(rec), "sev-move")]


def t_sev_sel(rec, board):
    c = board.turn
    mv = rec["m"].get("rook_to_seventh", [])
    if not mv:
        return None
    m = chess.Move.from_uci(mv[0])
    if not safe_after(board, m):
        return None
    after = board.copy(stack=False)
    after.push(m)
    seventh = [s for s in chess.SQUARES if S.rr(c, s) == 6]
    att = S.attacked_squares(after, m.to_square)
    on7 = [s for s in seventh if chess.square_name(s) in att and after.piece_at(s) is not None]
    pawns = sorted(chess.square_name(s) for s in on7 if after.piece_at(s) == chess.Piece(chess.PAWN, not c))
    if not pawns:
        return None
    san = board.san(m)
    cl = Cl().add("piece_attacks", f"After {san} the rook attacks exactly {join_and(att)}.", square=chess.square_name(m.to_square), squares=att, after_move=mv[0])
    for s in sorted(on7):
        pc = after.piece_at(s)
        cl.add("piece_on", f"{chess.square_name(s)} holds the {CN[pc.color]} {PN[pc.piece_type]}.", square=chess.square_name(s), piece=pc.symbol())
    item = mk("POS.SEVENTH.D1", 1, "select_squares", f"{CT[c]} plays {san}, putting a rook on the seventh rank. Tap every {CN[not c]} PAWN on that rank that the rook then attacks.",
              {"squares": pawns}, cl, ["POS.SEVENTH"],
              ["Imagine the rook on its new square and follow its rank in both directions.", "The rook attacks along the rank until it meets a piece. Which pawns does it reach?", f"{len(pawns)} pawn{'s' if len(pawns) != 1 else ''}."],
              f"After {san} the rook attacks {join_and(pawns)} on the seventh rank. Attacking a pawn is not the same as winning it: the pawn may be defended.", C.fam(rec), tpl="sev-sel")
    return [(board, item, C.prov(rec), "sev-sel")]


# ----------------------------------------------------------------------------------------------------------------
def main():
    reg = C.make_registry("pieces")
    pre = C.PreCheck()
    B = C.PBuilder("PIECES", "pieces", SEED, reg, pre)
    D = Driver(B)
    sel = {"any": lambda r: True,
           "bp_w": lambda r: r["f"]["bpair"] == ["white"], "bp_b": lambda r: r["f"]["bpair"] == ["black"],
           "bp_both": lambda r: len(r["f"]["bpair"]) == 2, "bp_none": lambda r: not r["f"]["bpair"] and r["n"] >= 14,
           "bp_sel_w": lambda r: r["f"]["bpair"] == ["white"], "bp_sel_b": lambda r: r["f"]["bpair"] == ["black"],
           "connmove": lambda r: 1 <= len(r["m"].get("connects_rooks", [])) <= 3,
           "ofopen": lambda r: 1 <= len(r["m"].get("rook_to_open_file", [])) <= 3,
           "ofhalf": lambda r: 1 <= len(r["m"].get("rook_to_half_open_file", [])) <= 3 and not r["m"].get("rook_to_open_file"),
           "sev": lambda r: bool(r["m"].get("rook_to_seventh")),
           "files_any": lambda r: bool(r["f"]["files"]["open"]) or bool(r["f"]["files"]["half_open_white"]),
           "files_none_open": lambda r: not r["f"]["files"]["open"]}
    recs, seen = psel.collect(sel, SEED, cap=900)
    print("selector matches:", {k: seen[k] for k in sorted(seen)})
    # bishop pair
    for nm, q in (("bp_w", Q["bp_cls"]), ("bp_b", Q["bp_cls"]), ("bp_both", Q["bp_cls"]), ("bp_none", Q["bp_cls"])):
        D.run("bpcls_" + nm, recs[nm], q, t_bishop_pair_cls)
    D.run("bpsel_w", recs["bp_sel_w"][100:], Q["bp_sel"] // 2, t_bishop_pair_sel(W))
    D.run("bpsel_b", recs["bp_sel_b"][100:], Q["bp_sel"] // 2, t_bishop_pair_sel(Bk))
    D.run("bp_pair", recs["bp_w"][200:] + recs["bp_b"][200:], Q["bp_pair"],
          pair_make("bpair", lambda rec, board: [(c, None) for c in (W, Bk) if CN[c] in rec["f"]["bpair"]], lambda board, c, s: S.has_bishop_pair(board, c), (),
                    lambda c, s: f"Does {CT[c]} have the bishop pair? (One bishop on light squares and one on dark squares.)", "POS.BISHOPS.D3",
                    lambda board, c, s: Cl().add("bishop_pair", f"The colours that own the bishop pair: {join_and(S.bishop_pair_holders(board), 'neither')}.", holders=S.bishop_pair_holders(board)),
                    lambda board, c, s, yes: (f"{CT[c]} has a light-squared and a dark-squared bishop: the bishop pair." if yes else f"{CT[c]} no longer has both a light-squared and a dark-squared bishop, so it does not have the pair."),
                    ["POS.BISHOPS"], lambda c, s: [f"Find {CN[c]}'s bishops.", "Which colour of squares does each one move on?", "The pair needs one of each."],
                    edit_fn=lambda board, c, s: bpair_edits(board, c, s)))
    # good / bad bishops
    anyr = recs["any"]
    cyc = ["good", "bad", "neutral"]
    sub = []
    for i, r in enumerate(anyr):
        r = dict(r); r["_want"] = cyc[i % 3]; sub.append(r)
    for w_ in cyc:
        D.run("gb_" + w_, [r for r in sub if r["_want"] == w_], Q["gb_cls"], t_gb_cls)
    D.run("gb_pair", anyr[300:], Q["gb_pair"], gb_pair_make())
    # activity
    D.run("act_cmp", anyr[100:], Q["act_cmp"], t_act_cmp)
    D.run("act_min", anyr[200:], Q["act_min"], t_act_min)
    D.run("oop", anyr[300:], Q["oop"], t_oop)
    # rooks
    D.run("con_move", recs["connmove"], Q["con_move"], t_con_move)
    for want in ("yes", "no"):
        D.run("con_yn_" + want, anyr[400:], Q["con_yn"], t_con_yn(want))
    D.run("con_between", anyr[500:], Q["con_between"], t_con_between)
    D.run("of_set", recs["files_any"], Q["of_set"], t_of_set)
    D.run("of_set0", recs["files_none_open"], 2, t_of_set)
    cyc4 = list(range(4))
    sub = []
    for i, r in enumerate(anyr[600:]):
        r = dict(r); r["_want"] = STAT[i % 4]; sub.append(r)
    for w_ in STAT:
        D.run("of_status_" + str(STAT.index(w_)), [r for r in sub if r["_want"] == w_], Q["of_status"], t_of_status)
    D.run("of_move", recs["ofopen"], Q["of_move"], t_of_move("rook_to_open_file", "of-move", (
        "Put a rook on an open file: a file with no pawn of either colour.", "that land on an open file", "has no pawn of either colour on it")))
    D.run("of_half", recs["ofhalf"], Q["of_half"], t_of_move("rook_to_half_open_file", "of-half", (
        "Put a rook on a half-open file: a file with no pawn of your own colour but at least one enemy pawn.", "that land on a half-open file", "has no pawn of its own colour but an enemy pawn")))
    D.run("sev_move", recs["sev"], Q["sev_move"], t_sev_move)
    D.run("sev_sel", recs["sev"][100:], Q["sev_sel"], t_sev_sel)

    names = C.split_write(B, "pieces", chunk=120)
    print("items", len(B.items), "per node", dict(B.by_node))
    print("made", dict(D.made))
    print("builder stats", dict(B.stats))
    print("precheck rejects", dict(pre.rejects))
    print("files", names)
    pre.close()


if __name__ == "__main__":
    main()
