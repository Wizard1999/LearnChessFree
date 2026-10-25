"""lp2 step 5: counts per bucket and per node, drop reasons, claim types, and the validator result for content/items/lp2-*.json.

    python l2_report.py        -> prints and writes out/l2/report.md and out/l2/report.json
"""
import sys as _s, os as _o; _s.path.insert(0, _o.path.dirname(_o.path.abspath(__file__)))
import json
from collections import Counter, defaultdict
from l2_common import *


def main():
    sel = read_json(L2_OUT / "selection.json")["puzzles"] if (L2_OUT / "selection.json").exists() else []
    sel_n = Counter(r["bucket"] for r in sel)
    verdicts = [json.loads(l) for l in (L2_OUT / "verdicts.jsonl").read_text(encoding="utf-8").splitlines() if l.strip()]
    by = defaultdict(list)
    for v in verdicts:
        by[v["bucket"]].append(v)
    rep = read_json(L2_OUT / "build_report.json") if (L2_OUT / "build_report.json").exists() else {}
    deliv = rep.get("by_bucket", {})
    lines = ["| bucket | node | selected | verified ok | dropped | delivered |", "|---|---|---|---|---|---|"]
    reasons_all = Counter()
    rows = []
    for k, b in sorted(BUCKETS.items(), key=lambda kv: (kv[1]["node"], kv[0])):
        vs = by.get(k, [])
        ok = sum(1 for v in vs if v.get("ok"))
        reasons = Counter((v.get("reason") or "?").split(":")[0] + (": " + (v.get("reason") or "").split(":", 1)[1].strip()[:60] if ":" in (v.get("reason") or "") else "")
                          for v in vs if not v.get("ok"))
        reasons_all.update(reasons)
        d = deliv.get(k, {})
        rows.append(dict(bucket=k, node=b["node"], selected=sel_n.get(k, len(vs)), verified=len(vs), ok=ok, delivered=d.get("delivered", 0), c1=d.get("c1", 0),
                         top_reasons=reasons.most_common(4)))
        lines.append(f"| {k} | {b['node']} | {sel_n.get(k, len(vs))} | {ok} | {len(vs) - ok} | {d.get('delivered', 0)} |")
    # items and claims in the written files
    ctypes = Counter(); per_node = Counter(); per_cue = Counter(); per_task = Counter(); review = Counter(); n_items = 0
    files = sorted(ITEMS_DIR.glob(PREFIX + "*.json"))
    ev_tot = ev_pass = 0
    item_pass = 0
    for f in files:
        d = read_json(f)
        evf = ROOT / "content" / "_evidence" / (f.stem + ".evidence.json")
        ev = read_json(evf) if evf.exists() else []
        ok_by_item = defaultdict(list)
        for r in ev:
            ok_by_item[r["item"]].append(r["result"] == "pass")
        ev_tot += len(ev); ev_pass += sum(1 for r in ev if r["result"] == "pass")
        for it in d["items"]:
            n_items += 1
            per_node[it["skill"].rpartition(".")[0]] += 1
            per_cue[it["cue"]] += 1; per_task[it["task"]] += 1; review[it["review"]["status"]] += 1
            for c in it["claims"]:
                ctypes[c["type"]] += 1
            if ok_by_item.get(it["id"]) and all(ok_by_item[it["id"]]) and len(ok_by_item[it["id"]]) == len(it["claims"]):
                item_pass += 1
    out = dict(items=n_items, items_validator_pass=item_pass, claims_checked=ev_tot, claims_pass=ev_pass, claim_types=dict(ctypes),
               per_node=dict(sorted(per_node.items())), per_cue=dict(per_cue), per_task=dict(per_task), review=dict(review), buckets=rows,
               drop_reasons=reasons_all.most_common(25), files=[f.name for f in files])
    write_json(L2_OUT / "report.json", out)
    md = ["# lp2 report (generated)", "", f"items {n_items}, validator-passing items {item_pass}, claims {ev_pass}/{ev_tot}", ""] + lines
    md += ["", "per node: " + ", ".join(f"{k} {v}" for k, v in sorted(per_node.items())), "", "claim types: " + ", ".join(f"{k} {v}" for k, v in ctypes.most_common())]
    (L2_OUT / "report.md").write_text("\n".join(md), encoding="utf-8")
    print("\n".join(md))
    print("\ndrop reasons (top):")
    for r, n in reasons_all.most_common(25):
        print(f"  {n:4d}  {r}")


if __name__ == "__main__":
    main()
