"""Task A report: counts, drop rates and reasons per theme, difficulty distribution, win types, engine agreement.
Prints Markdown tables (pasted into docs/corpus-tactics.md) and writes out/tactics_report.json."""
import sys as _s, os as _o; _s.path.insert(0, _o.path.dirname(_o.path.abspath(__file__)))
import json, statistics
from collections import Counter, defaultdict
from common import *


def short(reason):
    r = reason or ""
    for k in ("engine disagrees", "ambiguous", "no win claim", "mate not confirmed", "invalid", "error", "best_move_in failed", "mate_in failed"):
        if r.startswith(k): return k
    return r[:40]


def main():
    vs = [json.loads(l) for l in open(OUT / "verdicts.jsonl", encoding="utf-8") if l.strip()]
    prim = [v for v in vs if v["tranche"] == "primary"]
    allv = vs
    rows = []
    rep = {}
    print("| theme | sampled | passed | dropped | drop % | disagree | ambiguous | no win claim | other | mate | material | eval-only | only-move |")
    print("|---|---|---|---|---|---|---|---|---|---|---|---|---|")
    tot = Counter()
    for theme in THEMES:
        p = [v for v in prim if v["theme"] == theme]
        ok = [v for v in p if v["ok"]]
        drops = Counter(short(v.get("reason")) for v in p if not v["ok"])
        wt = Counter(v["win_type"] for v in ok)
        other = sum(drops.values()) - drops["engine disagrees"] - drops["ambiguous"] - drops["no win claim"]
        print(f"| {theme} | {len(p)} | {len(ok)} | {len(p) - len(ok)} | {100 * (len(p) - len(ok)) / max(1, len(p)):.0f}% | {drops['engine disagrees']} | {drops['ambiguous']} | {drops['no win claim']} | {other} | {wt['mate']} | {wt['material']} | {wt['eval']} | {wt['only_move']} |")
        rep[theme] = dict(sampled=len(p), passed=len(ok), drops=dict(drops), win_types=dict(wt))
        for k, v in (("sampled", len(p)), ("passed", len(ok)), ("disagree", drops["engine disagrees"]), ("ambiguous", drops["ambiguous"]), ("nowin", drops["no win claim"]), ("other", other),
                     ("mate", wt["mate"]), ("material", wt["material"]), ("eval", wt["eval"]), ("only", wt["only_move"])):
            tot[k] += v
    print(f"| **all** | {tot['sampled']} | {tot['passed']} | {tot['sampled'] - tot['passed']} | {100 * (tot['sampled'] - tot['passed']) / tot['sampled']:.1f}% | {tot['disagree']} | {tot['ambiguous']} | {tot['nowin']} | {tot['other']} | {tot['mate']} | {tot['material']} | {tot['eval']} | {tot['only']} |")
    # engine-vs-Lichess agreement and multi-move accepted sets among passes
    ok = [v for v in prim if v["ok"]]
    print()
    print("engine best == Lichess move among passes:", sum(1 for v in ok if v.get("agrees")), "of", len(ok))
    print("accepted-set size among passes:", dict(Counter(len(v["accepted"]) for v in ok)))
    print("with feedback_by_move:", sum(1 for v in ok if v.get("feedback")), "of", len(ok))
    print()
    print("| theme | passed | accepted set > 1 move | engine best != Lichess move | eval-only win | with feedback move |")
    print("|---|---|---|---|---|---|")
    for theme in THEMES:
        o = [v for v in ok if v["theme"] == theme]
        print(f"| {theme} | {len(o)} | {sum(1 for v in o if len(v['accepted']) > 1)} | {sum(1 for v in o if not v.get('agrees'))} | {sum(1 for v in o if v['win_type'] == 'eval')} | {sum(1 for v in o if v.get('feedback'))} |")
    # difficulty distribution of passes per theme
    print()
    print("| theme | n | min | p25 | median | p75 | max | per 200-pt bin (800..2200) |")
    print("|---|---|---|---|---|---|---|---|")
    for theme in THEMES:
        r = sorted(v["rating"] for v in ok if v["theme"] == theme)
        if not r: continue
        q = statistics.quantiles(r, n=4) if len(r) >= 2 else [r[0]] * 3
        bins = Counter(rating_bin(x) for x in r)
        print(f"| {theme} | {len(r)} | {r[0]} | {q[0]:.0f} | {q[1]:.0f} | {q[2]:.0f} | {r[-1]} | {' '.join(str(bins[i]) for i in range(7))} |")
    # drops by rating bin (all themes)
    print()
    byb = defaultdict(lambda: [0, 0])
    for v in prim:
        byb[v["bin"]][0] += 1; byb[v["bin"]][1] += (not v["ok"])
    print("drop rate by rating bin:", {BIN_EDGES[b]: f"{byb[b][1]}/{byb[b][0]}" for b in sorted(byb)})
    # reserve
    res = [v for v in vs if v["tranche"] == "reserve"]
    if res: print("reserve verified:", len(res), "passed", sum(v["ok"] for v in res))
    write_json(OUT / "tactics_report.json", rep)


if __name__ == "__main__":
    main()
