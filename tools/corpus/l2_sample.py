"""lp2 step 1: one pass over the Lichess puzzle database, bucket predicates, seeded stratified selection.

    python l2_sample.py survey      -> prints how many puzzles qualify per bucket (and writes out/l2/survey.json)
    python l2_sample.py select      -> also writes out/l2/selection.json (oversampled, ready for l2_verify.py)

The pass is parallel (python-chess features are cheap but the file has 6 M rows). Hits are cached in out/l2/hits.pkl,
so `select` can be rerun with other quotas without rereading the CSV (use `survey --fresh` to redo the pass).
Selection: rare buckets pick first; inside a bucket, rating bins are filled evenly (the same 7-bin stratification as the
first corpus), cleaner puzzles first (fewer tags, then the bucket's own priority).
"""
import sys as _s, os as _o; _s.path.insert(0, _o.path.dirname(_o.path.abspath(__file__)))
import csv, pickle, random, time, multiprocessing as mp
from collections import defaultdict, Counter
from l2_common import *

import os
HITS = L2_OUT / "hits.pkl"
HITS_EXTRA = L2_OUT / "hits_extra.pkl"
OVERSAMPLE = {"default": 1.6}
ONLY = {k for k in os.environ.get("L2_ONLY", "").split(",") if k}     # set by `extra` so that a pass can cover just some buckets


def process(batch):
    hits = []
    for row in batch:
        try:
            rating = int(row["Rating"]); rd = int(row["RatingDeviation"]); plays = int(row["NbPlays"]); pop = int(row["Popularity"])
        except ValueError:
            continue
        q = quality(rating, rd, plays, pop)
        if q == 0:
            continue
        themes = set(row["Themes"].split())
        moves = row["Moves"].split()
        if len(moves) < 2:
            continue
        r = dict(id=row["PuzzleId"], fen=row["FEN"], moves=moves, themes=themes, rating=rating, rd=rd, plays=plays, pop=pop)
        todo = [b for k, b in BUCKETS.items() if b["q"] <= q and (not ONLY or k in ONLY) and not b.get("off") and PRE[k](r)]
        if not todo:
            continue
        try:
            F = Feat(r)
            if not F.b.is_valid() or F.b.is_game_over():
                continue
        except Exception:
            continue
        for b in todo:
            try:
                p = b["fn"](F)
            except Exception:
                p = None
            if p is not None:
                hits.append((b["key"], r["id"], row["FEN"], row["Moves"], " ".join(sorted(themes)), rating, rd, plays, pop, q, p, F.b.fen()))
    return hits


def read_batches(n=4000):
    from common import open_zst_text
    with open_zst_text(PUZZLE_CSV) as fh:
        batch = []
        for row in csv.DictReader(fh):
            batch.append(row)
            if len(batch) >= n:
                yield batch; batch = []
        if batch:
            yield batch


def run_pass(workers=8):
    t0 = time.time(); allhits = []; nb = 0
    with mp.Pool(workers) as pool:
        for h in pool.imap_unordered(process, read_batches(), chunksize=1):
            allhits += h; nb += 1
            if nb % 100 == 0:
                print(f"  {nb * 4000} rows, {len(allhits)} hits, {time.time() - t0:.0f}s", flush=True)
    print(f"pass finished: {len(allhits)} hits in {time.time() - t0:.0f}s", flush=True)
    HITS.write_bytes(pickle.dumps(allhits))
    return allhits


def run_extra(keys, workers=10):
    """A pass over the database for the given bucket keys only (new or changed buckets); the hits are added to hits_extra.pkl."""
    os.environ["L2_ONLY"] = ",".join(keys)
    t0 = time.time(); new = []; nb = 0
    with mp.Pool(workers) as pool:
        for h in pool.imap_unordered(process, read_batches(), chunksize=1):
            new += h; nb += 1
            if nb % 200 == 0:
                print(f"  {nb * 4000} rows, {len(new)} hits, {time.time() - t0:.0f}s", flush=True)
    old = pickle.loads(HITS_EXTRA.read_bytes()) if HITS_EXTRA.exists() else []
    old = [h for h in old if h[0] not in set(keys)]
    HITS_EXTRA.write_bytes(pickle.dumps(old + new))
    print(f"extra pass finished: {len(new)} hits for {keys} in {time.time() - t0:.0f}s", flush=True)


def load_hits(fresh=False):
    hits = pickle.loads(HITS.read_bytes()) if (HITS.exists() and not fresh) else run_pass()
    for extra in (L2_OUT / "hits_stale.pkl", HITS_EXTRA):
        if extra.exists():
            hits = hits + pickle.loads(extra.read_bytes())
    return [h for h in hits if h[0] in BUCKETS and not BUCKETS[h[0]].get("off")]


def rec_of(h):
    key, pid, fen, moves, themes, rating, rd, plays, pop, q, prio, fen_after = h
    th = themes.split()
    return dict(bucket=key, id=pid, fen=fen, moves=moves.split(), themes=th, rating=rating, rd=rd, plays=plays, pop=pop, q=q,
                prio=prio, ncore=ncore(th), fen_after=fen_after)


def topup():
    """Append-only second round: for every bucket whose verified (ok) puzzles fall short of n_c3, add puzzles from the same pool
    (never ones already selected / verified / in content), ordered by a hash of the puzzle id so the choice does not depend on how
    many puzzles were excluded before it. selection.json is only extended; verdicts of the first round stay valid."""
    hits = load_hits(False)
    by = defaultdict(list)
    for h in hits:
        by[h[0]].append(h)
    sel_doc = read_json(L2_OUT / "selection.json")
    sel = sel_doc["puzzles"]
    chosen = {r["id"] for r in sel}
    used_ids, _, _, fen_keys = existing_content()
    claimed = set(fen_keys) | {" ".join(r["fen_after"].split()[:4]) for r in sel}
    ok_n = Counter(); ver_n = Counter(); seen_v = set()
    vf = L2_OUT / "verdicts.jsonl"
    for line in vf.read_text(encoding="utf-8").splitlines():
        if line.strip():
            v = json.loads(line); seen_v.add(v["id"]); ver_n[v["bucket"]] += 1
            if v.get("ok"):
                ok_n[v["bucket"]] += 1
    added = Counter()
    for k, b in sorted(BUCKETS.items(), key=lambda kv: (kv[1]["order"], kv[0])):
        if b["use"] == "viz" or b.get("off"):
            continue
        need = b["n_c3"] - ok_n.get(k, 0)
        # puzzles selected for this bucket but not verified yet count as likely successes at the bucket's observed yield
        # (verified-ok / verified, smoothed; 60 % before anything was verified)
        yld = (ok_n.get(k, 0) + 3) / (ver_n.get(k, 0) + 5) if ver_n.get(k, 0) else 0.6
        yld = max(0.08, min(0.95, yld))
        pending = sum(1 for r in sel if r["bucket"] == k and r["id"] not in seen_v)
        need = int(round(need - yld * pending))
        if need <= 0:
            continue
        pool = []
        for h in by.get(k, []):
            if h[1] in used_ids or h[1] in chosen:
                continue
            fk = " ".join(h[11].split()[:4])
            if fk in claimed:
                continue
            pool.append(rec_of(h))
        bins = defaultdict(list)
        for r in pool:
            tier = 0 if r["ncore"] <= 4 else 1 if r["ncore"] <= 6 else 2
            bins[bin7(r["rating"])].append((-r["q"], r["prio"], tier, hash_frac(r["id"] + k), r))
        ordered = {i: [x[-1] for x in sorted(bins[i], key=lambda x: x[:4])] for i in range(7)}
        want = int(need / yld * 1.15) + 2
        order_extra = [3, 2, 4, 1, 5, 0, 6]
        cap = {i: len(ordered[i]) for i in range(7)}
        base, extra = divmod(want, 7)
        w = {i: base + (1 if order_extra.index(i) < extra else 0) for i in range(7)}
        quota = {i: min(w[i], cap[i]) for i in range(7)}
        rem = sum(w[i] - quota[i] for i in range(7))
        while rem > 0:
            prog = False
            for i in order_extra:
                if rem > 0 and quota[i] < cap[i]:
                    quota[i] += 1; rem -= 1; prog = True
            if not prog:
                break
        for i in range(7):
            for r in ordered[i][:quota[i]]:
                sel.append(dict(r, bin=i)); chosen.add(r["id"]); claimed.add(" ".join(r["fen_after"].split()[:4])); added[k] += 1
    sel_doc["puzzles"] = sel
    sel_doc.setdefault("topups", []).append(dict(added=dict(added)))
    write_json(L2_OUT / "selection.json", sel_doc)
    print("topup added", sum(added.values()), dict(added))


def main():
    cmd = sys.argv[1] if len(sys.argv) > 1 else "survey"
    if cmd == "topup":
        topup()
        return
    if cmd == "extra":
        run_extra([k for k in sys.argv[2:] if not k.startswith("--")])
        return
    fresh = "--fresh" in sys.argv
    hits = load_hits(fresh)
    by = defaultdict(list)
    for h in hits:
        by[h[0]].append(h)
    used_ids, item_ids, pos_ids, fen_keys = existing_content()
    print(f"existing content: {len(used_ids)} puzzle ids, {len(fen_keys)} position keys")
    summary = {}
    for k, b in sorted(BUCKETS.items(), key=lambda kv: (kv[1]["order"], kv[0])):
        if b.get("off"):
            continue
        lst = by.get(k, [])
        free = [h for h in lst if h[1] not in used_ids and " ".join(h[11].split()[:4]) not in fen_keys]
        strict = sum(1 for h in free if h[9] == 2)
        bins = Counter(bin7(h[5]) for h in free)
        summary[k] = dict(total=len(lst), free=len(free), strict=strict, bins=[bins.get(i, 0) for i in range(7)])
        print(f"{k:34s} total {len(lst):7d} free {len(free):7d} strict {strict:7d}  want {b['n_c3']:3d}  bins {[bins.get(i, 0) for i in range(7)]}")
    write_json(L2_OUT / "survey.json", summary)
    if cmd != "select":
        return
    used = set(used_ids)
    claimed_fens = set(fen_keys)
    selection = []
    stats = {}
    for k, b in sorted(BUCKETS.items(), key=lambda kv: (kv[1]["order"], kv[0])):
        if b.get("off"):
            continue
        ov = L2_OUT / "over.json"
        over_map = json.loads(ov.read_text(encoding="utf-8")) if ov.exists() else {}
        want = int(round(b["n_c3"] * (over_map.get(k) or b.get("over") or OVERSAMPLE.get(k, OVERSAMPLE["default"]))))
        rng = random.Random(f"{L2_SEED}-{k}")
        pool = []
        for h in by.get(k, []):
            if h[1] in used:
                continue
            fk = " ".join(h[11].split()[:4])
            if fk in claimed_fens:
                continue
            pool.append(rec_of(h))
        # cleanest first inside every bin: (bucket priority, core-tag tier), shuffled inside equal keys
        bins = defaultdict(list)
        for r in pool:
            tier = 0 if r["ncore"] <= 4 else 1 if r["ncore"] <= 6 else 2
            bins[bin7(r["rating"])].append((r["q"] * -1, r["prio"], tier, rng.random(), r))
        ordered = {}
        for i in range(7):
            ordered[i] = [x[-1] for x in sorted(bins[i], key=lambda x: x[:4])]
        order_extra = [3, 2, 4, 1, 5, 0, 6]
        cap = {i: len(ordered[i]) for i in range(7)}
        base, extra = divmod(want, 7)
        w = {i: base + (1 if order_extra.index(i) < extra else 0) for i in range(7)}
        quota = {i: min(w[i], cap[i]) for i in range(7)}
        rem = sum(w[i] - quota[i] for i in range(7))
        while rem > 0:
            prog = False
            for i in order_extra:
                if rem > 0 and quota[i] < cap[i]:
                    quota[i] += 1; rem -= 1; prog = True
            if not prog:
                break
        pick = []
        for i in range(7):
            pick += ordered[i][:quota[i]]
        for r in pick:
            used.add(r["id"]); claimed_fens.add(" ".join(r["fen_after"].split()[:4]))
            selection.append(dict(r, bin=bin7(r["rating"])))
        stats[k] = dict(pool=len(pool), picked=len(pick), want=want, quota=quota)
        print(f"{k:34s} pool {len(pool):7d} picked {len(pick):4d}/{want}")
    write_json(L2_OUT / "selection.json", dict(seed=L2_SEED, stats=stats, puzzles=selection))
    print("selection", len(selection))


if __name__ == "__main__":
    main()
