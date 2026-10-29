"""Opening statistics from top-level over-the-board games (TWIC weekly zips and Lichess broadcasts in library/data/games/).

Keeps games where both players are rated at least MIN_ELO, counts the first MAX_PLY plies of each game into a position tree keyed by
the position (EPD), and writes one compact JSON file the app can load: for each position, the moves played with games, White wins,
draws, Black wins, the average rating and the years seen. Duplicates (the same game in TWIC and a broadcast) are dropped by a
hash of players, date and first moves. Moves and results are facts; the source files are not redistributed.

Usage: python -I tools/build_master_stats.py [--min-elo 2500] [--max-ply 24] [--limit-files N]
Output: library/cache/master_stats.json (then tools/ship_master_stats.py picks what ships, if anything).
"""
import hashlib, io, json, re, sys, time, zipfile
from collections import defaultdict
from pathlib import Path

import chess
import chess.pgn
import zstandard

ROOT = Path(__file__).resolve().parent.parent
GAMES = ROOT / "library" / "data" / "games"
OUT = ROOT / "library" / "cache" / "master_stats.json"


def arg(name: str, default: int) -> int:
    return int(sys.argv[sys.argv.index(name) + 1]) if name in sys.argv else default


MIN_ELO = arg("--min-elo", 2500)
MAX_PLY = arg("--max-ply", 24)
LIMIT = arg("--limit-files", 10**9)
MIN_GAMES_KEEP = 3  # a position seen fewer times than this is dropped from the output

RESULT = {"1-0": 0, "1/2-1/2": 1, "0-1": 2}


def pgn_streams():
    n = 0
    for z in sorted((GAMES / "twic").glob("twic*g.zip"), key=lambda p: -int(re.findall(r"\d+", p.name)[0])):
        if n >= LIMIT: return
        try:
            with zipfile.ZipFile(z) as zf:
                for name in zf.namelist():
                    if name.lower().endswith(".pgn"):
                        yield z.name, io.TextIOWrapper(io.BytesIO(zf.read(name)), encoding="utf-8", errors="replace")
        except Exception as e:
            print(f"skip {z.name}: {e}", flush=True)
        n += 1
    for f in sorted((GAMES / "lichess-broadcast").glob("*.pgn.zst"), reverse=True):
        if n >= LIMIT: return
        with open(f, "rb") as fh:
            yield f.name, io.TextIOWrapper(zstandard.ZstdDecompressor().stream_reader(fh), encoding="utf-8", errors="replace")
        n += 1


def main() -> None:
    sys.stdout.reconfigure(encoding="utf-8")
    # tree[epd] -> {uci: [games, w, d, b, elo_sum, year_min, year_max, san]}
    tree: dict[str, dict[str, list]] = defaultdict(dict)
    seen: set[str] = set()
    kept = total = dup = 0
    t0 = time.time()
    for name, stream in pgn_streams():
        text = stream.read()
        # cheap pre-filter on the header text: only games where both ratings reach the floor are parsed move by move
        blocks = re.split(r"\n(?=\[Event )", text)
        for blk in blocks:
            mw, mb = re.search(r'\[WhiteElo "(\d+)"\]', blk), re.search(r'\[BlackElo "(\d+)"\]', blk)
            total += 1
            if not mw or not mb or int(mw.group(1)) < MIN_ELO or int(mb.group(1)) < MIN_ELO: continue
            try: game = chess.pgn.read_game(io.StringIO(blk))
            except Exception: continue
            if game is None: continue
            h = game.headers
            try: we, be = int(h.get("WhiteElo", "0")), int(h.get("BlackElo", "0"))
            except ValueError: continue
            res = RESULT.get(h.get("Result", "*"))
            if res is None or we < MIN_ELO or be < MIN_ELO: continue
            if h.get("Variant", "Standard") != "Standard": continue
            moves = []
            node = game
            for _ in range(MAX_PLY):
                node = node.next()
                if node is None: break
                moves.append(node)
            if len(moves) < 4: continue
            year = int((h.get("Date", "????")[:4]) or 0) if h.get("Date", "????")[:4].isdigit() else 0
            key = hashlib.md5(f"{h.get('White')}|{h.get('Black')}|{h.get('Date')}|{''.join(m.uci() for m in moves[:12])}".encode()).hexdigest()
            if key in seen: dup += 1; continue
            seen.add(key)
            kept += 1
            board = chess.Board()
            for m in moves:
                epd = board.epd()
                san = board.san(m.move)
                e = tree[epd].setdefault(m.uci(), [0, 0, 0, 0, 0, 9999, 0, san])
                e[0] += 1; e[1 + res] += 1; e[4] += (we + be) // 2
                if year: e[5] = min(e[5], year); e[6] = max(e[6], year)
                board.push(m.move)
        print(f"{name}: games read {total}, kept {kept}, duplicates {dup}, {time.time() - t0:.0f}s", flush=True)
    out = {}
    for epd, mv in tree.items():
        rows = [[u, e[7], e[0], e[1], e[2], e[3], round(e[4] / e[0]), e[5] if e[5] != 9999 else 0, e[6]] for u, e in mv.items() if e[0] >= MIN_GAMES_KEEP]
        if rows: out[epd] = sorted(rows, key=lambda r: -r[2])
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps({"min_elo": MIN_ELO, "max_ply": MAX_PLY, "games": kept, "positions": len(out), "cols": ["uci", "san", "games", "white", "draw", "black", "avg_elo", "first_year", "last_year"], "tree": out}, separators=(",", ":")), encoding="utf8")
    print(f"done: {kept} games kept of {total}; {len(out)} positions; {OUT.stat().st_size // 1024} KB", flush=True)


if __name__ == "__main__":
    main()
