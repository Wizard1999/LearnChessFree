"""Draw a reproducible sample of Lichess puzzles for the detector benchmark.

Input : library/data/lichess_db_puzzle.csv.zst   (CC0)
Output: tools/analysis/detector_eval/sample.jsonl  (one puzzle per line, de-duplicated)

Buckets (each is a uniform reservoir sample, so rates inside a bucket are unbiased for that bucket):
  theme:<name>  up to N puzzles carrying that Lichess theme   (fork, pin, skewer, discoveredAttack,
                backRankMate, hangingPiece, trappedPiece, doubleCheck)
  none          up to N puzzles carrying NONE of those eight themes
  random        up to N puzzles drawn uniformly from the whole database (no filter)

Each output line: {id, fen, moves, rating, themes, buckets}. `fen` is the position BEFORE the opponent's
first move; moves[0] is the opponent's move, moves[1] the solver's first move (Lichess puzzle CSV convention).

Usage: tools/.venv/Scripts/python.exe -I tools/analysis/detector_eval/sample.py [N] [seed]
"""
import csv, io, json, random, sys
from pathlib import Path
import zstandard

ROOT = Path(__file__).resolve().parents[3]
SRC = ROOT / "library" / "data" / "lichess_db_puzzle.csv.zst"
OUT = Path(__file__).resolve().parent / "sample.jsonl"

THEMES = ["fork", "pin", "skewer", "discoveredAttack", "backRankMate", "hangingPiece", "trappedPiece", "doubleCheck"]

def main():
    n = int(sys.argv[1]) if len(sys.argv) > 1 else 4000
    seed = int(sys.argv[2]) if len(sys.argv) > 2 else 20261024
    rng = random.Random(seed)
    buckets = [f"theme:{t}" for t in THEMES] + ["none", "random"]
    res = {b: [] for b in buckets}      # reservoirs of row dicts (shared references)
    seen = {b: 0 for b in buckets}

    def offer(b, row):
        seen[b] += 1
        r = res[b]
        if len(r) < n:
            r.append(row)
        else:
            j = rng.randrange(seen[b])
            if j < n:
                r[j] = row

    total = 0
    with open(SRC, "rb") as fh:
        reader = io.TextIOWrapper(zstandard.ZstdDecompressor().stream_reader(fh), encoding="utf-8", newline="")
        for row in csv.DictReader(reader):
            total += 1
            themes = row["Themes"].split()
            slim = {"id": row["PuzzleId"], "fen": row["FEN"], "moves": row["Moves"].split(),
                    "rating": int(row["Rating"]), "themes": themes}
            offer("random", slim)
            hit = False
            for t in THEMES:
                if t in themes:
                    offer(f"theme:{t}", slim)
                    hit = True
            if not hit:
                offer("none", slim)

    merged = {}
    for b in buckets:
        for row in res[b]:
            merged.setdefault(row["id"], {**row, "buckets": []})["buckets"].append(b)
    with open(OUT, "w", encoding="utf-8") as f:
        for row in merged.values():
            f.write(json.dumps(row) + "\n")
    print(f"scanned {total} puzzles; wrote {len(merged)} unique puzzles to {OUT}")
    for b in buckets:
        print(f"  {b:24s} sampled {len(res[b]):5d} of {seen[b]}")

if __name__ == "__main__":
    main()
