"""First library inference: how hard are tactical themes, empirically, on Lichess's puzzle scale?

Input : library/data/lichess_db_puzzle.csv.zst  (CC0; Glicko-2 puzzle ratings; each solve is a rated 'game')
Output: library/inferences/puzzle_themes.json  and a printed table.

Caveats baked into the analysis (see docs/inference-01-puzzle-theme-difficulty.md):
 * These are PUZZLE difficulty ratings on Lichess's puzzle scale, not playing strength and not a concept's 'Elo'.
 * We keep only well-measured puzzles (RatingDeviation <= 90, NbPlays >= 100) to reduce noise.
 * Themes are Lichess's auto/community tags; a puzzle usually has several.
"""
import csv, io, json, sys, statistics
from collections import defaultdict
from pathlib import Path
import zstandard

ROOT = Path(__file__).resolve().parent.parent.parent
SRC = ROOT / "library" / "data" / "lichess_db_puzzle.csv.zst"
OUT = ROOT / "library" / "inferences" / "puzzle_themes.json"
OUT.parent.mkdir(parents=True, exist_ok=True)

def q(sorted_vals, p):
    if not sorted_vals: return None
    k = (len(sorted_vals) - 1) * p
    f = int(k); c = min(f + 1, len(sorted_vals) - 1)
    return sorted_vals[f] + (sorted_vals[c] - sorted_vals[f]) * (k - f)

def main():
    by_theme = defaultdict(list)
    all_ratings, total, kept = [], 0, 0
    pop_by_theme = defaultdict(list)
    with open(SRC, "rb") as fh:
        reader = io.TextIOWrapper(zstandard.ZstdDecompressor().stream_reader(fh), encoding="utf-8", newline="")
        rd = csv.DictReader(reader)
        for row in rd:
            total += 1
            try:
                rating = int(row["Rating"]); dev = int(row["RatingDeviation"]); plays = int(row["NbPlays"]); pop = int(row["Popularity"])
            except ValueError:
                continue
            if dev > 90 or plays < 100:
                continue
            kept += 1
            all_ratings.append(rating)
            for t in row["Themes"].split():
                by_theme[t].append(rating); pop_by_theme[t].append(pop)
    all_ratings.sort()
    summary = dict(total_puzzles=total, well_measured=kept,
                   overall=dict(p10=q(all_ratings, .1), p25=q(all_ratings, .25), median=q(all_ratings, .5), p75=q(all_ratings, .75), p90=q(all_ratings, .9)))
    themes = {}
    for t, vals in by_theme.items():
        vals.sort()
        themes[t] = dict(n=len(vals), p10=q(vals, .1), p25=q(vals, .25), median=q(vals, .5), p75=q(vals, .75), p90=q(vals, .9),
                         mean_popularity=round(statistics.fmean(pop_by_theme[t]), 1))
    OUT.write_text(json.dumps(dict(summary=summary, themes=themes), indent=1), encoding="utf-8")
    print(json.dumps(summary, indent=1))
    print(f"{'theme':24s} {'n':>9s} {'p10':>6s} {'p25':>6s} {'med':>6s} {'p75':>6s} {'p90':>6s}")
    for t, d in sorted(themes.items(), key=lambda kv: kv[1]["median"]):
        if d["n"] >= 3000:
            print(f"{t:24s} {d['n']:9d} {d['p10']:6.0f} {d['p25']:6.0f} {d['median']:6.0f} {d['p75']:6.0f} {d['p90']:6.0f}")

if __name__ == "__main__":
    main()
