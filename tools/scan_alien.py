"""Find Alien Gambit games (1.e4 c6 2.d4 d5 3.Nc3/Nd2 dxe4 4.Nxe4 Nf6 5.Ng5 h6 6.Nxf7) in the local game archives.

Reads library/data/games (TWIC zips, Lichess broadcast zst files; gitignored) and writes content/_work/alien-games.json:
players, ratings, event, result, the full move list. Moves are facts; the PGN files themselves are never shipped.
Usage: python -I tools/scan_alien.py [martian]
"""
import io, json, re, sys, zipfile
from pathlib import Path
import zstandard

ROOT = Path(__file__).resolve().parent.parent
GAMES = ROOT / "library" / "data" / "games"
MARTIAN = len(sys.argv) > 1 and sys.argv[1] == "martian"
OUT = ROOT / "content" / "_work" / ("martian-games.json" if MARTIAN else "alien-games.json")
LINE_ALIEN = re.compile(r"1\.\s*e4\s+c6\s+2\.\s*d4\s+d5\s+3\.\s*N[cd][32]\s+dxe4\s+4\.\s*Nxe4\s+Nf6\s+5\.\s*Ng5\s+h6\s+6\.\s*Nxf7")
LINE_MARTIAN = re.compile(r"1\.\s*e4\s+c6\s+2\.\s*d4\s+d5\s+3\.\s*N[cd][32]\s+dxe4\s+4\.\s*Nxe4\s+Bf5\s+5\.\s*Ng5\s+Bg6\s+6\.\s*N1?f3\s+h6\s+7\.\s*Ne6")
LINE = LINE_MARTIAN if MARTIAN else LINE_ALIEN
CLEAN = re.compile(r"\{[^}]*\}|\([^)]*\)|\$\d+")
TAG = re.compile(r'\[(\w+) "([^"]*)"\]')


def games(text):
    for block in re.split(r"\n\n(?=\[Event )", text):
        if ("Ne6" if MARTIAN else "Nxf7") not in block: continue
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
