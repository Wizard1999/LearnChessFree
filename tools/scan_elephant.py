"""Find Elephant Gambit games (1.e4 e5 2.Nf3 d5) in the local game archives.

Reads library/data/games (TWIC zips, Lichess broadcast zst files; gitignored) and writes content/_work/elephant-games.json:
players, ratings, event, result, the full move list. Moves are facts; the PGN files themselves are never shipped.
Usage: python -I tools/scan_elephant.py
"""
import io, json, re, zipfile
from pathlib import Path
import zstandard

ROOT = Path(__file__).resolve().parent.parent
GAMES = ROOT / "library" / "data" / "games"
OUT = ROOT / "content" / "_work" / "elephant-games.json"
LINE = re.compile(r"^1\.\s*e4\s+(?:1\.\.\.\s*)?e5\s+2\.\s*Nf3\s+(?:2\.\.\.\s*)?d5\s+3\.")
CLEAN = re.compile(r"\{[^}]*\}|\([^)]*\)|\$\d+")
TAG = re.compile(r'\[(\w+) "([^"]*)"\]')


def games(text):
    for block in re.split(r"\n\n(?=\[Event )", text):
        if "d5" not in block: continue
        tags = dict(TAG.findall(block))
        moves = CLEAN.sub(" ", block.split("\n\n", 1)[-1] if "\n\n" in block else block)
        moves = re.sub(r"\s+", " ", moves).strip()
        if LINE.search(moves): yield tags, moves


def sources():
    for p in sorted((GAMES / "twic").glob("*.zip")):
        with zipfile.ZipFile(p) as z:
            for n in z.namelist():
                if n.lower().endswith(".pgn"): yield p.name, z.read(n).decode("latin-1")
    for p in sorted((GAMES / "lichess-broadcast").glob("*.pgn.zst")):
        with open(p, "rb") as f, zstandard.ZstdDecompressor().stream_reader(f) as r:
            yield p.name, io.TextIOWrapper(r, encoding="utf-8", errors="replace").read()


found = []
for name, text in sources():
    for tags, moves in games(text):
        found.append({"src": name, "white": tags.get("White"), "black": tags.get("Black"), "welo": tags.get("WhiteElo"), "belo": tags.get("BlackElo"),
                      "event": tags.get("Event"), "date": tags.get("Date"), "result": tags.get("Result"), "moves": moves})
OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text(json.dumps(found, indent=1, ensure_ascii=False), encoding="utf8")
print(len(found), "games ->", OUT)
