"""Extract ordinary rated games (SAN move lists) from the CC0 Lichess monthly dump for the false-positive audit.

Usage: tools/.venv/Scripts/python.exe -I tools/analysis/detector_eval/games.py [N_GAMES] [MIN_PLIES]
Output: tools/analysis/detector_eval/games.jsonl   {"id","white_elo","black_elo","sans":[...]}
Takes the first N games with at least MIN_PLIES plies and both ratings present, from
library/data/lichess_db_standard_rated_2013-01.pgn.zst (the games are ordinary human games, not puzzles).
"""
import io, json, re, sys
from pathlib import Path
import zstandard

ROOT = Path(__file__).resolve().parents[3]
SRC = ROOT / "library" / "data" / "lichess_db_standard_rated_2013-01.pgn.zst"
OUT = Path(__file__).resolve().parent / "games.jsonl"

def main():
    n = int(sys.argv[1]) if len(sys.argv) > 1 else 400
    min_plies = int(sys.argv[2]) if len(sys.argv) > 2 else 30
    kept = 0
    with open(SRC, "rb") as fh, open(OUT, "w", encoding="utf-8") as out:
        text = io.TextIOWrapper(zstandard.ZstdDecompressor().stream_reader(fh), encoding="utf-8", errors="replace")
        tags, move_lines = {}, []
        def flush():
            nonlocal kept
            if not move_lines:
                return False
            mt = re.sub(r"\{[^}]*\}", " ", " ".join(move_lines))
            mt = re.sub(r"\d+\.(\.\.)?", " ", mt)
            toks = [t for t in mt.split() if t not in ("1-0", "0-1", "1/2-1/2", "*") and not t.startswith("$")]
            if len(toks) >= min_plies and "WhiteElo" in tags and "BlackElo" in tags:
                out.write(json.dumps({"id": tags.get("Site", "")[-8:], "white_elo": tags["WhiteElo"], "black_elo": tags["BlackElo"], "sans": toks}) + "\n")
                kept += 1
            return kept >= n
        for line in text:
            line = line.strip()
            if line.startswith("[") and line.endswith("]"):
                if move_lines:
                    if flush():
                        break
                    tags, move_lines = {}, []
                m = re.match(r'\[(\w+) "(.*)"\]', line)
                if m:
                    tags[m.group(1)] = m.group(2)
            elif line:
                move_lines.append(line)
    print(f"wrote {kept} games to {OUT}")

if __name__ == "__main__":
    main()
