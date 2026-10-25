"""OPN.STRUCT: recognising five named pawn structures from exact pawn squares (defined HERE, for either colour), and "none of these".
Each item proves its answer with claims: the defining pawns (piece_on), the file conditions (open_files) and, for every other
structure and orientation, one failing condition, so exactly one structure applies.

    ./tools/.venv/Scripts/python.exe -I tools/positional/gen_struct.py

These are working definitions for recognition practice, not a claim about which opening move order produced the structure.
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

SEED = 20261108

# white-orientation conditions: ("P"|"p", square) = that piece must stand there; ("nopawn", colour, file) = that colour has no pawn on the file
STRUCTS = {
    "Carlsbad structure": [("P", "d4"), ("P", "e3"), ("nopawn", "white", "c"), ("p", "c6"), ("p", "d5"), ("p", "e6")],
    "Isolated queen's pawn": [("P", "d4"), ("nopawn", "white", "c"), ("nopawn", "white", "e")],
    "Maroczy bind": [("P", "c4"), ("P", "e4"), ("nopawn", "white", "d"), ("p", "d6"), ("p", "g6"), ("nopawn", "black", "c")],
    "Hedgehog": [("p", "b6"), ("p", "d6"), ("p", "e6"), ("nopawn", "black", "c"), ("P", "c4"), ("P", "e4"), ("nopawn", "white", "d")],
    "Advance French chain": [("P", "d4"), ("P", "e5"), ("p", "d5"), ("p", "e6")],
}
NAMES = list(STRUCTS)
# Added for POS.STRUCTURE.KID (lesson L-POS-STRUCTURE-KID-1). Deliberately NOT part of STRUCTS/NAMES, so the five-structure
# OPN.STRUCT recognition items and a rerun of this generator are unchanged. Working definition (ours, white orientation):
# pawns on c4, d5 and e4 against pawns on d6, e5 and g6; the colours may be reversed. Use extra_matches(board).
EXTRA_STRUCTS = {
    "King's Indian chain": [("P", "c4"), ("P", "d5"), ("P", "e4"), ("p", "d6"), ("p", "e5"), ("p", "g6")],
}
NODES ={"Carlsbad structure": ["OPN.STRUCT"], "Isolated queen's pawn": ["OPN.STRUCT", "POS.STRUCTURE.IQP"], "Maroczy bind": ["OPN.STRUCT"], "Hedgehog": ["OPN.STRUCT"],
         "Advance French chain": ["OPN.STRUCT", "POS.STRUCTURE.CHAIN"]}
NONE = "None of these five"
DEFS = {
    "Carlsbad structure": "Carlsbad: a pawn on d4 and one on e3 with no pawn on the c-file for that side, against pawns on c6, d5 and e6 (colours may be reversed).",
    "Isolated queen's pawn": "Isolated queen's pawn: a pawn on d4 with no pawn of its colour on the c- or e-file (for Black: on d5; colours may be reversed).",
    "Maroczy bind": "Maroczy bind: pawns on c4 and e4 and none on the d-file, against pawns on d6 and g6 and none on the c-file (colours may be reversed).",
    "Hedgehog": "Hedgehog: pawns on b6, d6 and e6 and none on the c-file, against pawns on c4 and e4 and none on the d-file (colours may be reversed).",
    "Advance French chain": "Advance French chain: pawns on d4 and e5 against pawns on d5 and e6 (colours may be reversed).",
}


def mirror_cond(cond):
    if cond[0] in ("P", "p"):
        return (cond[0].swapcase(), chess.square_name(chess.square_mirror(chess.parse_square(cond[1]))))
    return ("nopawn", "black" if cond[1] == "white" else "white", cond[2])


def conds(name, orient):
    base = STRUCTS[name]
    return base if orient == "white" else [mirror_cond(c) for c in base]


def holds(board, cond):
    if cond[0] in ("P", "p"):
        pc = board.piece_at(chess.parse_square(cond[1]))
        return pc is not None and pc.symbol() == cond[0]
    col = chess.WHITE if cond[1] == "white" else chess.BLACK
    return not any(chess.square_file(s) == FILES.index(cond[2]) for s in board.pieces(chess.PAWN, col))


def matches(board):
    out = []
    for n in NAMES:
        for o in ("white", "black"):
            if all(holds(board, c) for c in conds(n, o)):
                out.append((n, o))
    return out


def extra_matches(board):
    """(name, orientation) pairs of the EXTRA_STRUCTS definitions that hold on the board (either colour)."""
    out = []
    for n, base in EXTRA_STRUCTS.items():
        for o in ("white", "black"):
            cs = base if o == "white" else [mirror_cond(c) for c in base]
            if all(holds(board, c) for c in cs):
                out.append((n, o))
    return out


def first_failing(board, cs):
    for c in cs:
        if not holds(board, c):
            return c
    return None


def cond_text(board, c):
    if c[0] in ("P", "p"):
        pc = board.piece_at(chess.parse_square(c[1]))
        return f"{c[1]} holds {('the ' + CN[pc.color] + ' ' + C.PN[pc.piece_type]) if pc else 'no piece'}."
    return f"{c[1].capitalize()} {'has' if not holds(board, c) else 'has no'} pawn on the {c[2]}-file."


def claims_for(board, name, orient):
    """claims: all defining conditions of the matched structure (or none if name is None) + one failing condition for every other structure/orientation"""
    cl = Cl()
    need_files = False
    seen = set()

    def add_cond(c):
        nonlocal need_files
        if c[0] in ("P", "p"):
            pc = board.piece_at(chess.parse_square(c[1]))
            key = ("piece_on", c[1])
            if key in seen:
                return
            seen.add(key)
            cl.add("piece_on", cond_text(board, c), square=c[1], piece=pc.symbol() if pc else "empty")
        else:
            need_files = True

    if name is not None:
        for c in conds(name, orient):
            add_cond(c)
    for n in NAMES:
        for o in ("white", "black"):
            if (n, o) == (name, orient):
                continue
            f = first_failing(board, conds(n, o))
            assert f is not None
            add_cond(f)
    if need_files:
        fl = S.open_files(board)
        cl.add("open_files", f"Open files: {join_and(fl['open'], 'none')}. Half-open for White: {join_and(fl['half_open_white'], 'none')}. Half-open for Black: {join_and(fl['half_open_black'], 'none')}.",
               open=fl["open"], half_open_white=fl["half_open_white"], half_open_black=fl["half_open_black"])
    return cl


def explain_for(board, name, orient):
    if name is None:
        return "None of the five definitions is satisfied by either colour: in each case at least one defining pawn is missing or a file condition fails."
    cs = conds(name, orient)
    sq = [c[1] for c in cs if c[0] in ("P", "p")]
    nof = [f"{c[1]} has no pawn on the {c[2]}-file" for c in cs if c[0] == "nopawn"]
    owner = CT[chess.WHITE if orient == "white" else chess.BLACK]
    return (f"{name}: pawns on {join_and(sq)}" + (f", and {join_and(nof)}" if nof else "") + f" (orientation: the structure is written from {owner}'s side). "
            f"Every other structure fails at least one defining condition. These are working definitions for recognition practice.")


def make(cue, want):
    def mk_item(rec, board):
        ms = matches(board)
        if want is None:
            if ms:
                return None
            name, orient = None, None
        else:
            if len(ms) != 1 or ms[0][0] != want:
                return None
            name, orient = ms[0]
        cl = claims_for(board, name, orient)
        opts = NAMES + [NONE]
        rng = random_for(rec, "struct")
        if cue == 1:
            prompt = "Which of these pawn structures is on the board? " + " ".join(DEFS[n] for n in NAMES) + f" If none applies, answer '{NONE}'."
            hints = ["Check the structures one at a time against the pawns on the board.", "For each structure, test its defining pawn squares first, then its file conditions.", "Both colours count: a structure can be written from either side."]
        else:
            prompt = f"Which of these named pawn structures does the position have? If none applies, answer '{NONE}'."
            hints = ["Find the pawns on the c-, d- and e-files for both colours first.", " ".join(DEFS[n] for n in NAMES), "Check the file conditions (no pawn on a file) as carefully as the squares."]
        item = mk("OPN.STRUCT.D1" if cue == 1 else "OPN.STRUCT.D2", cue, "classify_position", prompt, {"class": name or NONE}, cl,
                  NODES[name] if name else ["OPN.STRUCT"], hints, explain_for(board, name, orient), C.fam(rec), options=opts, tpl="struct", status="needs-human")
        return [(board, item, C.prov(rec), "struct")]
    return mk_item


def main():
    reg = C.make_registry("struct")
    pre = C.PreCheck()
    B = C.PBuilder("STRUCT", "struct", SEED, reg, pre)
    D = Driver(B)
    sel = {}
    for n in NAMES:
        sel[n] = (lambda r, n=n: _unique(r, n))
    sel[NONE] = lambda r: _none(r)
    recs, seen = psel.collect(sel, SEED, cap=300)
    print("selector matches:", seen)
    for n in NAMES:
        pool = recs[n]
        D.run(f"c1-{n}", pool, 2, make(1, n))
        D.run(f"c3-{n}", pool[40:], 2, make(3, n))
    D.run("c1-none", recs[NONE], 2, make(1, None))
    D.run("c3-none", recs[NONE][40:], 2, make(3, None))
    names = C.split_write(B, "struct", chunk=60)
    print("items", len(B.items), "per node", dict(B.by_node), "made", dict(D.made), "stats", dict(B.stats), "rejects", dict(pre.rejects))
    print("files", names)
    pre.close()


_MEMO = {}


def _ms(rec):
    k = rec["fen"]
    if k not in _MEMO:
        if len(_MEMO) > 4:
            _MEMO.clear()
        _MEMO[k] = matches(chess.Board(k))
    return _MEMO[k]


def _unique(rec, n):
    ms = _ms(rec)
    return len(ms) == 1 and ms[0][0] == n


def _none(rec):
    return not _ms(rec) and rec["n"] >= 16


if __name__ == "__main__":
    main()
