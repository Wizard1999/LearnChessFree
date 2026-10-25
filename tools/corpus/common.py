"""Shared helpers for the tactics / quiet / threat corpus builders (tools/corpus/*).

Run every script with:  tools/.venv/Scripts/python.exe -I tools/corpus/<script>.py
All sampling is seeded (SEED) so a rerun reproduces the same selection.
"""
import sys, json, io, csv, random, hashlib
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(ROOT / "tools"))
sys.path.insert(0, str(Path(__file__).resolve().parent))
OUT = Path(__file__).resolve().parent / "out"
OUT.mkdir(exist_ok=True)
ITEMS_DIR = ROOT / "content" / "items"
PUZZLE_CSV = ROOT / "library" / "data" / "lichess_db_puzzle.csv.zst"
GAMES_PGN = ROOT / "library" / "data" / "lichess_db_standard_rated_2013-01.pgn.zst"

SEED = 20261024

# Lichess theme -> (our skill node, human label used only in cue-1 prompts)
THEMES = {
    "fork":              ("TAC.FORK",            "fork"),
    "pin":               ("TAC.PIN",             "pin"),
    "skewer":            ("TAC.SKEWER",          "skewer"),
    "discoveredAttack":  ("TAC.DISCOVER",        "discovered attack"),
    "doubleCheck":       ("TAC.DOUBLE-CHECK",    "double check"),
    "backRankMate":      ("TAC.BACKRANK",        "back-rank mate"),
    "hangingPiece":      ("SAF.LOOSE",           "hanging piece"),
    "trappedPiece":      ("TAC.TRAPPED",         "trapped piece"),
    "deflection":        ("TAC.DEFLECT",         "deflection"),
    "attraction":        ("TAC.DECOY",           "attraction (decoy)"),
    "clearance":         ("TAC.CLEARANCE",       "clearance"),
    "intermezzo":        ("TAC.ZWISCHENZUG",     "intermezzo (zwischenzug)"),
    "xRayAttack":        ("TAC.XRAY",            "x-ray attack"),
    "interference":      ("TAC.INTERFERE",       "interference"),
    "capturingDefender": ("TAC.REMOVE-DEFENDER", "capturing the defender"),
    "sacrifice":         ("SAC.TYPES",           "sacrifice"),
    "quietMove":         ("TAC.QUIET-MOVE",      "quiet move"),
    "defensiveMove":     ("DEF.RESOURCES",       "defensive move"),
    "mateIn2":           ("TAC.MATE-PATTERNS",   "mate in 2"),
    "mateIn3":           ("TAC.MATE-PATTERNS",   "mate in 3"),
}
LENGTH_PHASE = {"oneMove", "short", "long", "veryLong", "opening", "middlegame", "endgame"}
BIN_EDGES = [800, 1000, 1200, 1400, 1600, 1800, 2000, 2200]   # 7 bins of 200


def rating_bin(r):
    for i in range(len(BIN_EDGES) - 1):
        if BIN_EDGES[i] <= r < BIN_EDGES[i + 1]:
            return i
    return None


def tier_of(r):
    return 2 if r < 1200 else 3 if r < 1500 else 4 if r < 1800 else 5


def open_zst_text(path):
    import zstandard
    fh = open(path, "rb")
    return io.TextIOWrapper(zstandard.ZstdDecompressor().stream_reader(fh), encoding="utf-8", newline="")


def write_json(path, obj, indent=1):
    Path(path).write_text(json.dumps(obj, indent=indent, ensure_ascii=False), encoding="utf-8")


def read_json(path):
    return json.loads(Path(path).read_text(encoding="utf-8"))
