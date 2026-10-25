"""lp2: remove the items whose claim failed in tools/validate.py (never loosen a claim), then revalidate those files.

    python l2_prune.py            reads content/_evidence/lp2-*.evidence.json, rewrites the item files without failing items,
                                  writes out/l2/pruned.json, and lists the files that must be revalidated (their evidence is regenerated)
"""
import sys as _s, os as _o; _s.path.insert(0, _o.path.dirname(_o.path.abspath(__file__)))
import json
from collections import defaultdict
from l2_common import *


def main():
    pruned = []
    touched = []
    for f in sorted(ITEMS_DIR.glob(PREFIX + "*.json")):
        evf = ROOT / "content" / "_evidence" / (f.stem + ".evidence.json")
        if not evf.exists():
            print(f.name, "has no evidence; skipped")
            continue
        ev = json.loads(evf.read_text(encoding="utf-8"))
        bad = {r["item"]: (r["claim"], r["type"], r.get("reason") or r.get("measured")) for r in ev if r["result"] != "pass"}
        d = json.loads(f.read_text(encoding="utf-8"))
        have = defaultdict(int)
        for r in ev:
            have[r["item"]] += 1
        missing = [it["id"] for it in d["items"] if have[it["id"]] != len(it["claims"])]
        drop = set(bad) | set(missing)
        if not drop:
            continue
        keep = [it for it in d["items"] if it["id"] not in drop]
        used = {it["position"] for it in keep}
        positions = [p for p in d["positions"] if p["id"] in used]
        for it in d["items"]:
            if it["id"] in drop:
                pruned.append(dict(file=f.name, item=it["id"], reason=bad.get(it["id"], "no evidence")))
        tmp = f.with_suffix(".json.tmp")
        tmp.write_text(json.dumps({"positions": positions, "items": keep}, indent=1, ensure_ascii=False), encoding="utf-8")
        tmp.replace(f)
        touched.append(f.name)
        print(f.name, "dropped", len(drop), "kept", len(keep))
    old = json.loads((L2_OUT / "pruned.json").read_text(encoding="utf-8")) if (L2_OUT / "pruned.json").exists() else []
    write_json(L2_OUT / "pruned.json", old + pruned)
    print("pruned", len(pruned), "items; revalidate:", " ".join(touched) if touched else "nothing")


if __name__ == "__main__":
    main()
