"""Final summary of the whole corpus (A tactics, B quiet, C threat): delivered counts, screening yields, validator evidence.
Writes out/corpus_summary.json and prints a few Markdown tables used in docs/corpus-tactics.md."""
import sys as _s, os as _o; _s.path.insert(0, _o.path.dirname(_o.path.abspath(__file__)))
import json
from collections import Counter
from common import *


def jl(p):
    return [json.loads(l) for l in open(p, encoding="utf-8") if l.strip()]


def main():
    S = {}
    # delivered
    files = sorted(ITEMS_DIR.glob("lp-*.json")) + sorted(ITEMS_DIR.glob("quiet-*.json")) + sorted(ITEMS_DIR.glob("threat-*.json"))
    delivered = Counter(); per_theme = Counter(); per_theme_c1 = Counter(); fileinfo = {}
    ev_items = ev_pass_items = ev_claims = ev_claims_pass = 0
    for f in files:
        d = json.loads(f.read_text(encoding="utf-8"))
        ev = json.loads((ROOT / "content" / "_evidence" / (f.stem + ".evidence.json")).read_text(encoding="utf-8"))
        res = {}
        for r in ev: res.setdefault(r["item"], []).append(r["result"] == "pass")
        ok_items = sum(1 for i in d["items"] if res.get(i["id"]) and all(res[i["id"]]))
        fileinfo[f.name] = dict(items=len(d["items"]), positions=len(d["positions"]), items_passing=ok_items, claims=len(ev), claims_passing=sum(1 for r in ev if r["result"] == "pass"))
        ev_items += len(d["items"]); ev_pass_items += ok_items; ev_claims += len(ev); ev_claims_pass += fileinfo[f.name]["claims_passing"]
        for i in d["items"]:
            kind = f.name.split("-")[0]
            delivered[kind] += 1
            if kind == "lp":
                th = next(t[6:] for t in i["tags"] if t.startswith("theme."))
                (per_theme_c1 if i["cue"] == 1 else per_theme)[th] += 1
    S["files"] = fileinfo
    S["items_total"] = ev_items; S["items_passing"] = ev_pass_items; S["claims_total"] = ev_claims; S["claims_passing"] = ev_claims_pass
    S["delivered_by_family"] = dict(delivered)
    S["tactics_per_theme_cue3"] = dict(per_theme); S["tactics_per_theme_cue1"] = dict(per_theme_c1)
    # screening yields
    q = jl(OUT / "quiet_screen.jsonl")
    S["quiet_screen"] = dict(screened=len(q), passed=sum(1 for r in q if r.get("ok")), reasons=dict(Counter(r.get("reason", "ok") for r in q)))
    B = [(16, 26), (27, 37), (38, 48), (49, 60)]
    pbk = lambda p: next(i for i, (a, b) in enumerate(B) if a <= p <= b)
    S["quiet_screen"]["pass_by_ply_bucket"] = {f"{B[i][0]}-{B[i][1]}": [sum(1 for r in q if pbk(r["ply"]) == i and r.get("ok")), sum(1 for r in q if pbk(r["ply"]) == i)] for i in range(4)}
    t = jl(OUT / "tactic_screen.jsonl")
    S["tactic_classify_screen"] = dict(verified=len(t), passed=sum(1 for r in t if r.get("ok")), mate_or_material=sum(1 for r in t if r.get("ok") and r.get("win_type") in ("mate", "material")),
                                      reasons=dict(Counter((r.get("reason") or "ok")[:50] for r in t)))
    th = jl(OUT / "threat_screen.jsonl")
    S["threat_screen"] = {k: dict(screened=sum(1 for r in th if r["kind"] == k), passed=sum(1 for r in th if r["kind"] == k and r.get("ok")),
                                  reasons=dict(Counter(r.get("reason", "ok") for r in th if r["kind"] == k))) for k in ("mate", "loose", "none")}
    write_json(OUT / "corpus_summary.json", S)
    print(json.dumps({k: v for k, v in S.items() if k not in ("files",)}, indent=1)[:4000])
    for k, v in fileinfo.items(): print(k, v)


if __name__ == "__main__":
    main()
