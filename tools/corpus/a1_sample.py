"""Task A step 1: stratified, seeded sample of Lichess puzzles per theme.

Filters (well-measured, clean): RatingDeviation <= 80, NbPlays >= 500, Popularity >= 85, rating in [800, 2200),
theme list (excluding length/phase tags) preferably <= 4 tags (relaxed to 5-6, then any, only if a bin is short).
Each puzzle is used at most once across themes (rarer themes pick first). Per theme: 45 'primary' picks spread over
the seven 200-point bins, plus a seeded 'reserve' list used only for back-filling if too many drop.
Also keeps a seeded reservoir of well-measured tactic puzzles (any theme) for Task B's 'tactic exists' items.

Output: out/selection.json, out/reservoir.json
"""
import csv, random, json, sys
from collections import defaultdict
import sys as _s, os as _o; _s.path.insert(0, _o.path.dirname(_o.path.abspath(__file__)))
from common import *

N_PRIMARY = 45
N_RESERVE = 25
RD_MAX, PLAYS_MIN, POP_MIN = 80, 500, 85
RESERVOIR_N = 40000


def main():
    pools = defaultdict(list)       # theme -> [row]
    rng_res = random.Random(f"{SEED}-reservoir")
    reservoir = []; seen_res = 0
    total = kept = 0
    with open_zst_text(PUZZLE_CSV) as fh:
        for row in csv.DictReader(fh):
            total += 1
            try:
                rating = int(row["Rating"]); rd = int(row["RatingDeviation"]); plays = int(row["NbPlays"]); pop = int(row["Popularity"])
            except ValueError:
                continue
            if rd > RD_MAX or plays < PLAYS_MIN or pop < POP_MIN or not (800 <= rating < 2200):
                continue
            kept += 1
            themes = row["Themes"].split()
            core = [t for t in themes if t not in LENGTH_PHASE]
            rec = dict(id=row["PuzzleId"], fen=row["FEN"], moves=row["Moves"].split(), rating=rating, rd=rd, plays=plays,
                       pop=pop, themes=themes, ncore=len(core))
            hit = [t for t in themes if t in THEMES]
            motifs = [t for t in hit if t not in ("mateIn2", "mateIn3")]     # mateInN is an outcome tag, not a motif
            for t in hit:
                pools[t].append(dict(rec, other_motifs=len([x for x in motifs if x != t])))
            if any(t in ("crushing", "advantage", "mate") for t in themes) and "defensiveMove" not in themes and "equality" not in themes:
                seen_res += 1
                if len(reservoir) < RESERVOIR_N:
                    reservoir.append(rec)
                else:
                    j = rng_res.randrange(seen_res)
                    if j < RESERVOIR_N: reservoir[j] = rec
    print(f"rows {total}, well-measured in range {kept}, reservoir seen {seen_res}")
    for t in THEMES:
        print(f"  pool {t:18s} {len(pools[t]):7d}")

    used = set()
    selection = []
    stats = {}
    for theme in sorted(THEMES, key=lambda t: len(pools[t])):
        rng = random.Random(f"{SEED}-{theme}")
        pool = [r for r in pools[theme] if r["id"] not in used]
        # clean-first ordering inside each bin: ncore<=4 first (shuffled), then 5-6, then the rest
        bins = defaultdict(lambda: [[], [], [], []])
        for r in pool:
            b = rating_bin(r["rating"])
            # tier 0: <= 4 core tags and no OTHER target motif theme (cleanest teaching); 1: <= 4 core tags; 2: <= 6; 3: rest
            tier = 0 if (r["ncore"] <= 4 and r["other_motifs"] == 0) else 1 if r["ncore"] <= 4 else 2 if r["ncore"] <= 6 else 3
            bins[b][tier].append(r)
        ordered = {}
        for b in range(7):
            lst = []
            for tier_list in bins[b]:
                rng.shuffle(tier_list)
                lst += tier_list
            ordered[b] = lst
        order_extra = [3, 2, 4, 1, 5, 0, 6]    # leftover units go to the middle bins first

        def allocate(total):
            cap = {b: len(ordered[b]) for b in range(7)}
            base, extra = divmod(total, 7)
            want = {b: base + (1 if order_extra.index(b) < extra else 0) for b in range(7)}
            quota = {b: min(want[b], cap[b]) for b in range(7)}
            rem = sum(want[b] - quota[b] for b in range(7))
            while rem > 0:
                progressed = False
                for b in order_extra:
                    if rem > 0 and quota[b] < cap[b]:
                        quota[b] += 1; rem -= 1; progressed = True
                if not progressed: break
            return quota
        quota = allocate(N_PRIMARY)
        primary = []
        for b in range(7):
            primary += ordered[b][:quota[b]]
        rq = allocate(N_RESERVE + 0)
        reserve = []
        for b in range(7):
            reserve += ordered[b][quota[b]: quota[b] + rq[b]]
        for tranche, lst in (("primary", primary), ("reserve", reserve)):
            for r in lst:
                used.add(r["id"])
                selection.append(dict(r, theme=theme, tranche=tranche, bin=rating_bin(r["rating"])))
        stats[theme] = dict(pool=len(pool), primary=len(primary), reserve=len(reserve), quota=quota,
                            clean_primary=sum(1 for r in primary if r["ncore"] <= 4 and r["other_motifs"] == 0),
                            le4_primary=sum(1 for r in primary if r["ncore"] <= 4))
        print(theme, stats[theme])
    write_json(OUT / "selection.json", dict(seed=SEED, filters=dict(rd_max=RD_MAX, plays_min=PLAYS_MIN, pop_min=POP_MIN, rating="800-2199"),
                                            stats=stats, puzzles=selection))
    used_ids = {s["id"] for s in selection}
    reservoir = [r for r in reservoir if r["id"] not in used_ids]
    write_json(OUT / "reservoir.json", reservoir, indent=None)
    print("selection", len(selection), "reservoir", len(reservoir))


if __name__ == "__main__":
    main()
