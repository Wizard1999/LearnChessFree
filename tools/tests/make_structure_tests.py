"""Builds tools/tests/structure-claims.json: hand-derived expected values (NOT produced by tools/structure.py) for the structure
claims, plus planted wrong claims (ids starting BAD-) that the validator must reject.
Rerun: ./tools/.venv/Scripts/python.exe -I tools/tests/make_structure_tests.py"""
import json
from pathlib import Path

POS = {
    "ISO": "4k3/8/8/3p4/4P3/8/8/4K3 w - - 0 1",             # white e4, black d5: both isolated, neither passed
    "PASS": "4k3/8/8/3P4/4P3/8/8/4K3 w - - 0 1",            # d5 protected passed, e4 passed; e4 supports d5
    "BACK": "4k3/8/8/4p3/2P1P3/3P4/8/4K3 w - - 0 1",        # d3 backward (stop square d4 hit by e5); c4 protected passed
    "DBL": "4k3/8/8/8/8/P7/P6P/4K3 w - - 0 1",              # doubled a-pawns, isolated h2
    "ISL": "4k3/8/8/8/3P4/8/PP3PP1/4K3 w - - 0 1",          # islands ab / d / fg
    "HANG": "4k3/p4ppp/8/8/2PP4/8/P4PPP/4K3 w - - 0 1",     # c4+d4 hanging pair
    "HANG2": "4k3/p4ppp/8/8/8/8/P1PP1PPP/4K3 w - - 0 1",     # c2+d2 side by side but on the 2nd rank: not hanging pawns
    "MAJ": "4k3/pp3ppp/8/8/8/8/PPP3PP/4K3 w - - 0 1",       # white 3v2 queenside, black 3v2 kingside
    "BLOCK": "4k3/8/3n4/3P4/8/8/8/4K3 w - - 0 1",           # passed d5 blockaded by a knight
    "BP": "r3k2r/pppq1ppp/2n1bn2/3p4/3P4/2NBBN2/PPP2PPP/R2QK2R w KQkq - 0 1",
    "MOB1": "4k3/8/8/8/3N4/8/4K3/8 w - - 0 1",
    "MOB2": "4k3/4r3/8/8/8/8/4N3/4K3 w - - 0 1",            # pinned knight, rook with a free file
    "RC": "4k3/8/8/8/8/8/8/R3K2R w - - 0 1",
    "RCK": "4k3/8/8/8/8/8/8/R3K2R w KQ - 0 1",
    "SHD": "6k1/8/8/8/8/5P1P/5PP1/6K1 w - - 0 1",
    "OUT": "4k3/8/8/3N4/2P1P3/3P4/8/4K3 w - - 0 1",
    "THR": "1r2k3/8/8/8/8/1N6/8/6K1 w - - 0 1",              # the b3 knight is loose to the b8 rook: if White passes, Black wins it
    "BLK2": "4k3/8/8/8/3p4/8/1N6/4K3 w - - 0 1",              # black passed pawn d4; the b2 knight can reach the stop square d3
    "MP1": "4k3/8/8/8/2P1P3/2NP4/8/4K3 w - - 0 1",           # Nc3 can reach the outposts b5 and d5
    "MP2": "4k3/8/8/8/8/8/P6P/R3K2R w - - 0 1",               # rooks to the open b-, c-, d-, f-, g-files
    "MP3": "4k3/1p6/8/8/8/8/P6P/R3K2R w - - 0 1",             # the b-file is half-open for White
    "MP4": "4k3/8/8/8/8/8/8/R3K2R w - - 0 1",                 # rooks to the seventh rank
    "EXCH": "4k3/8/3p4/4p3/3P4/8/5P2/4K3 w - - 0 1",         # 1.dxe5 dxe5 opens the d-file
    "PROMO2": "r1b1k3/1P6/8/8/8/8/8/4K3 w - - 0 1",         # b7xa8, b7xc8, b7-b8: 3 destination squares, 12 moves
}


def P(k):
    return {"id": f"P-ST-{k}", "fen": POS[k], "family": f"FAM-ST-{k}",
            "provenance": {"kind": "authored", "ref": "validator selftest position, expected values derived by hand", "licence": "project"}}


items = []
n = 0


def add(pos, ctype, params, good=True):
    global n
    n += 1
    items.append({"id": f"I-ST-{n}", "skill": "X.Y.D1", "cue": 1, "task": "classify_position", "position": f"P-ST-{pos}",
                  "answer": {}, "claims": [{"id": ("OK-" if good else "BAD-") + str(n), "type": ctype, "params": params}],
                  "review": {"status": "machine-only"}})


def ps(kind, color, sq):
    return dict(kind=kind, color=color, squares=sq)


# pawn kinds
add("ISO", "pawn_set", ps("isolated", "white", ["e4"])); add("ISO", "pawn_set", ps("isolated", "black", ["d5"]))
add("ISO", "pawn_set", ps("passed", "white", [])); add("ISO", "pawn_set", ps("passed", "black", []))
add("ISO", "open_files", dict(open=["a", "b", "c", "f", "g", "h"], half_open_white=["d"], half_open_black=["e"]))
add("PASS", "pawn_set", ps("passed", "white", ["d5", "e4"])); add("PASS", "pawn_set", ps("protected", "white", ["d5"]))
add("PASS", "pawn_set", ps("protected_passed", "white", ["d5"])); add("PASS", "pawn_set", ps("connected", "white", ["d5", "e4"]))
add("PASS", "pawn_set", ps("chain_base", "white", ["e4"])); add("PASS", "pawn_set", ps("connected_passed", "white", ["d5", "e4"]))
add("PASS", "pawn_set", ps("isolated", "white", [])); add("PASS", "pawn_set", ps("doubled", "white", []))
add("BACK", "pawn_set", ps("backward", "white", ["d3"])); add("BACK", "pawn_set", ps("passed", "white", ["c4"]))
add("BACK", "pawn_set", ps("protected_passed", "white", ["c4"])); add("BACK", "pawn_set", ps("protected", "white", ["c4", "e4"]))
add("BACK", "pawn_set", ps("chain_base", "white", ["d3"])); add("BACK", "pawn_set", ps("isolated", "black", ["e5"]))
add("BACK", "pawn_set", ps("passed", "black", [])); add("BACK", "pawn_set", ps("backward", "black", []))
add("BACK", "open_files", dict(open=["a", "b", "f", "g", "h"], half_open_black=["c", "d"], half_open_white=[]))
add("BACK", "holes", dict(color="white", squares=sorted("a3 b3 c3 e3 f3 g3 h3 a4 b4 d4 f4 g4 h4 a5 g5 h5".split())))
add("BACK", "holes", dict(color="black", squares=sorted("a6 b6 c6 d6 e6 f6 g6 h6 a5 b5 c5 d5 f5 g5 h5 a4 b4 c4 e4 g4 h4".split())))
add("BACK", "outposts", dict(color="white", occupied="any", squares=["b5", "d5", "f5"]))
add("BACK", "outposts", dict(color="black", occupied="any", squares=["d4", "f4"]))
add("BACK", "space", dict(color="white", mode="pawn_attacks", count=3)); add("BACK", "space", dict(color="black", mode="pawn_attacks", count=2))
add("BACK", "space", dict(color="white", mode="pawn_controlled", count=3, squares=["b5", "d5", "f5"]))
add("DBL", "pawn_set", ps("doubled", "white", ["a2", "a3"])); add("DBL", "pawn_set", ps("isolated", "white", ["a2", "a3", "h2"]))
add("DBL", "pawn_set", ps("backward", "white", []))
add("ISL", "pawn_islands", dict(color="white", count=3, islands=["ab", "d", "fg"])); add("ISL", "pawn_colours", dict(color="white", light=2, dark=3))
add("ISL", "pawn_set", ps("isolated", "white", ["d4"]))
add("HANG", "pawn_set", ps("hanging_pair", "white", ["c4", "d4"]))
add("HANG2", "pawn_set", ps("hanging_pair", "white", []))
add("MAJ", "pawn_set", ps("majority_side", "white", ["a2", "b2", "c2"])); add("MAJ", "pawn_set", ps("majority_side", "black", ["f7", "g7", "h7"]))
add("BLOCK", "pawn_set", ps("blockaded_passed", "white", ["d5"])); add("BLOCK", "pawn_set", ps("passed", "white", ["d5"]))
# bishops, colours, rooks, shield, space in the opening-like position
add("BP", "bishop_pair", dict(holders=["white"])); add("BP", "pawn_colours", dict(color="white", light=3, dark=4))
add("BP", "rooks_connected", dict(color="white", value=False)); add("BP", "rooks_connected", dict(color="black", value=False))
add("BP", "king_pawn_shield", dict(color="white", squares=["f2"])); add("BP", "king_pawn_shield", dict(color="black", squares=["f7"]))
add("BP", "mobility", dict(square="c3", mode="legal", count=6)); add("BP", "mobility", dict(square="c3", mode="squares", count=6))
add("BP", "piece_on", dict(square="d3", piece="B")); add("BP", "piece_on", dict(square="e6", piece="b")); add("BP", "piece_on", dict(square="e2", piece="empty"))
add("BP", "king_wing", dict(color="white", wing="centre")); add("BP", "king_wing", dict(color="black", wing="centre"))
add("BP", "space", dict(color="white", mode="pawn_attacks", count=2)); add("BP", "space", dict(color="black", mode="pawn_controlled", count=2))
add("BP", "outposts", dict(color="white", occupied="any", squares=[])); add("BP", "outposts", dict(color="black", occupied="any", squares=[]))
add("MAJ", "wing_pawns", dict(color="white", wing="queenside", count=3)); add("MAJ", "wing_pawns", dict(color="black", wing="queenside", count=2))
add("MAJ", "wing_pawns", dict(color="white", wing="kingside", count=2)); add("MAJ", "wing_pawns", dict(color="black", wing="kingside", count=3))
add("BP", "attackers", dict(square="c5", color="white", count=1))
add("BP", "attackers", dict(square="c4", color="black", count=1, after_move="b2b3"))   # after_move works for attackers (d5 pawn attacks c4)
add("MOB1", "mobility", dict(square="d4", mode="legal", count=7)); add("MOB1", "mobility", dict(square="d4", mode="squares", count=7))
add("MOB2", "mobility", dict(square="e2", mode="legal", count=0)); add("MOB2", "mobility", dict(square="e2", mode="squares", count=6))
add("MOB2", "mobility", dict(square="e7", mode="legal", count=12))
add("RC", "moves_where", dict(property="connects_rooks", moves=["e1d2", "e1e2", "e1f2"]))
add("RCK", "moves_where", dict(property="connects_rooks", moves=["e1c1", "e1d2", "e1e2", "e1f2", "e1g1"]))
add("SHD", "king_pawn_shield", dict(color="white", squares=["f2", "f3", "g2", "h3"])); add("SHD", "king_pawn_shield", dict(color="black", squares=[]))
add("SHD", "king_wing", dict(color="white", wing="kingside"))
add("OUT", "outposts", dict(color="white", occupied="any", squares=["b5", "d5", "f5"])); add("OUT", "outposts", dict(color="white", occupied="empty", squares=["b5", "f5"]))
add("OUT", "outposts", dict(color="white", occupied="own", squares=["d5"])); add("OUT", "outposts", dict(color="white", occupied="not_own", squares=["b5", "f5"]))
add("BP", "piece_attacks", dict(square="c3", squares=sorted("a2 a4 b1 b5 d1 d5 e2 e4".split())))
add("BACK", "space", dict(color="white", mode="pawn_attacks", count=2, squares=["d5", "e4"], region=["d4", "e4", "d5", "e5"]))   # d3 attacks e4, c4/e4 attack d5
add("BACK", "space", dict(color="black", mode="pawn_attacks", count=1, squares=["d4"], region=["d4", "e4", "d5", "e5"]))
add("BLK2", "moves_where", dict(property="blockades_passed", moves=["b2d3"]))
add("BLK2", "pawn_set", ps("passed", "black", ["d4"]))
add("BACK", "moves_where", dict(property="pawn_move_attacks", square="e5", moves=["d3d4"]))
add("BACK", "moves_where", dict(property="pawn_move_attacks", square="d6", moves=["c4c5"]))
add("BACK", "pawn_attackers", dict(square="d5", color="white", count=2)); add("BACK", "pawn_attackers", dict(square="d4", color="black", count=1))
add("BACK", "pawn_attackers", dict(square="e4", color="white", count=1)); add("BACK", "pawn_attackers", dict(square="e4", color="black", count=0))
add("MP1", "moves_where", dict(property="to_outpost", moves=["c3b5", "c3d5"]))
add("MP2", "moves_where", dict(property="rook_to_open_file", moves=["a1b1", "a1c1", "a1d1", "h1f1", "h1g1"]))
add("MP3", "moves_where", dict(property="rook_to_half_open_file", moves=["a1b1"]))
add("MP4", "moves_where", dict(property="rook_to_seventh", moves=["a1a7", "h1h7"]))
add("EXCH", "open_files", dict(open=["a", "b", "c", "g", "h"]))
add("EXCH", "open_files", dict(open=["a", "b", "c", "d", "g", "h"], half_open_white=["e"], half_open_black=["f"], after_moves=["d4e5", "d6e5"]))
add("EXCH", "pawn_set", dict(kind="doubled", color="black", squares=[], after_moves=["d4e5", "d6e5"]))
# promotion destinations are unique squares (and the old duplicated spelling of an expected list still passes)
add("PROMO2", "legal_destinations", {"from": "b7", "to": ["a8", "b8", "c8"]})
add("PROMO2", "legal_destinations", {"from": "b7", "to": ["a8"] * 4 + ["b8"] * 4 + ["c8"] * 4})
# null_move_first / move_is_not_mate
add("ISO", "quiet_position", dict(max=1, null_move_first=True))
add("THR", "material_after_move", dict(move="b8b3", min=3, null_move_first=True))   # if White passed, Black wins the knight
add("ISO", "move_is_not_mate", dict(move="e1e2"))
add("ISO", "move_is_not_mate", dict(move="e8e7", null_move_first=True))

# ---- planted defects: every one of these must be REJECTED
add("ISO", "pawn_set", ps("isolated", "white", ["e4", "d5"]), False)
add("ISO", "pawn_set", ps("passed", "white", ["e4"]), False)
add("ISO", "open_files", dict(open=["a", "b", "c", "d", "f", "g", "h"]), False)
add("ISO", "open_files", dict(half_open_white=["e"]), False)
add("PASS", "pawn_set", ps("protected_passed", "white", ["d5", "e4"]), False)
add("PASS", "pawn_set", ps("chain_base", "white", ["d5"]), False)
add("BACK", "pawn_set", ps("backward", "white", ["c4"]), False)
add("BACK", "pawn_set", ps("backward", "white", ["d3", "c4"]), False)
add("BACK", "holes", dict(color="white", squares=["a3"]), False)
add("BACK", "outposts", dict(color="white", occupied="any", squares=["b5", "d5"]), False)
add("BACK", "outposts", dict(color="white", occupied="any", includes=["c5"]), False)
add("BACK", "outposts", dict(color="black", occupied="any", excludes=["d4"]), False)
add("BACK", "space", dict(color="white", mode="pawn_attacks", count=4), False)
add("DBL", "pawn_set", ps("doubled", "white", ["a3"]), False)
add("ISL", "pawn_islands", dict(color="white", count=2), False)
add("ISL", "pawn_colours", dict(color="white", light=3, dark=2), False)
add("HANG", "pawn_set", ps("hanging_pair", "white", ["c4"]), False)
add("HANG2", "pawn_set", ps("hanging_pair", "white", ["c2", "d2"]), False)
add("MAJ", "pawn_set", ps("majority_side", "white", ["a2", "b2", "c2", "g2", "h2"]), False)
add("BLOCK", "pawn_set", ps("blockaded_passed", "white", []), False)
add("BP", "bishop_pair", dict(holders=["white", "black"]), False)
add("BP", "rooks_connected", dict(color="white", value=True), False)
add("BP", "king_pawn_shield", dict(color="white", squares=["f2", "g2"]), False)
add("BP", "mobility", dict(square="c3", mode="legal", count=8), False)
add("BP", "piece_on", dict(square="d3", piece="N"), False)
add("BP", "king_wing", dict(color="white", wing="kingside"), False)
add("MOB2", "mobility", dict(square="e2", mode="legal", count=6), False)
add("RC", "moves_where", dict(property="connects_rooks", moves=["e1d2", "e1e2"]), False)
add("RC", "moves_where", dict(property="connects_rooks", moves=["e1d2", "e1e2", "e1f2", "e1d1"]), False)
add("OUT", "outposts", dict(color="white", occupied="own", squares=["b5"]), False)
add("OUT", "outposts", dict(color="white", occupied="not_own", squares=["b5", "d5", "f5"]), False)
add("PROMO2", "legal_destinations", {"from": "b7", "to": ["a8", "b8"]}, False)
add("THR", "material_after_move", dict(move="b8b3", min=5, null_move_first=True), False)
add("THR", "material_after_move", dict(move="b8b3", min=3), False)   # without the pass, Rb3 is illegal for White: must fail
add("ISO", "move_is_not_mate", dict(move="e1e5"), False)                           # illegal move: must fail, not pass
add("ISO", "quiet_position", dict(max=-1, null_move_first=True), False)             # the opponent's best line gains 0, which is not <= -1
add("BP", "piece_attacks", dict(square="c3", squares=sorted("a4 b1 b5 d5 e2 e4".split())), False)       # omits the two squares it defends
add("BACK", "space", dict(color="white", mode="pawn_attacks", count=1, region=["d4", "e4", "d5", "e5"]), False)
add("BLK2", "moves_where", dict(property="blockades_passed", moves=[]), False)
add("BACK", "moves_where", dict(property="pawn_move_attacks", square="e5", moves=["d3d4", "c4c5"]), False)
add("BACK", "moves_where", dict(property="pawn_move_attacks", moves=["d3d4"]), False)      # missing `square`: error, rejected
add("BACK", "pawn_attackers", dict(square="d5", color="white", count=1), False)
add("MAJ", "wing_pawns", dict(color="white", wing="queenside", count=2), False)
add("EXCH", "open_files", dict(open=["a", "b", "c", "g", "h"], after_moves=["d4e5", "d6e5"]), False)        # the d-file is open after the exchange
add("EXCH", "open_files", dict(open=["a", "b", "c", "d", "g", "h"], after_moves=["d4e5", "e5e4"]), False)  # second move is illegal (no black pawn can do that)
add("MP1", "moves_where", dict(property="to_outpost", moves=["c3d5"]), False)
add("MP2", "moves_where", dict(property="rook_to_open_file", moves=["a1b1", "a1c1", "a1d1", "h1f1", "h1g1", "e1e2"]), False)
add("MP3", "moves_where", dict(property="rook_to_half_open_file", moves=["a1b1", "a1c1"]), False)
add("MP4", "moves_where", dict(property="rook_to_seventh", moves=["a1a7"]), False)
add("ISO", "pawn_set", dict(kind="isolated", color="white"), False)                  # no expectation given: error, rejected
add("ISO", "pawn_set", dict(kind="nonsense", color="white", squares=[]), False)      # unknown kind: error, rejected

used = sorted({i["position"][5:] for i in items})
out = {"positions": [P(k) for k in used], "items": items}
Path(__file__).with_name("structure-claims.json").write_text(json.dumps(out, indent=1), encoding="utf-8")
print(len(items), "items", sum(1 for i in items if i["claims"][0]["id"].startswith("OK")), "good",
      sum(1 for i in items if i["claims"][0]["id"].startswith("BAD")), "bad")
