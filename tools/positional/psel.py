"""Streaming selection from tools/positional/out/index.jsonl: one pass, seeded reservoirs per selector."""
import json, random
from pathlib import Path
import pcommon as C


def collect(selectors, seed, cap=400):
    """selectors: {name: predicate(rec) -> bool}. Returns {name: [rec, ...]} (at most `cap` per name, uniform random sample of the
    matches, in a seeded random order)."""
    rng = random.Random(seed)
    seen = {k: 0 for k in selectors}
    res = {k: [] for k in selectors}
    with open(C.INDEX, encoding="utf-8") as f:
        for ln in f:
            rec = json.loads(ln)
            for k, pred in selectors.items():
                try:
                    ok = pred(rec)
                except Exception:
                    ok = False
                if not ok:
                    continue
                seen[k] += 1
                if len(res[k]) < cap:
                    res[k].append(rec)
                else:
                    j = rng.randrange(seen[k])
                    if j < cap:
                        res[k][j] = rec
    for k in res:
        rng.shuffle(res[k])
    return res, seen
