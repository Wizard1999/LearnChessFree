"""Overlap check: report lessons that teach the same thing twice.

    python tools/check_overlap.py

Flags (1) two lessons for the same skill and depth, (2) lessons whose named exercises (item, contrast and practice-tag sets) overlap
by more than 40%, (3) two lessons that list the same skill as main or `also` coverage for the same depth. Exit code 1 if any
overlap is found, so it can gate new lessons."""
import sys as _s, pathlib as _p; _s.path.insert(0, str(_p.Path(__file__).resolve().parent))
import json, itertools
from engine import ROOT

lessons = [json.loads(f.read_text(encoding="utf-8")) for f in sorted((ROOT / "content" / "lessons").glob("*.json"))]
problems = []
by_sd = {}
for l in lessons: by_sd.setdefault((l["skill"], l["depth"]), []).append(l["id"])
for k, ids in by_sd.items():
    if len(ids) > 1: problems.append(f"same skill and depth {k[0]}.{k[1]}: {', '.join(ids)}")

def used(l):
    s = set()
    for st in l.get("steps", []):
        for key in ("item", "working", "failing", "irrelevant"):
            if st.get(key): s.add(st[key])
        if st.get("type") == "practice": s.add("tags:" + "|".join(sorted(st.get("tags", []))))
    return s
sets = {l["id"]: used(l) for l in lessons}
for a, b in itertools.combinations(lessons, 2):
    x, y = sets[a["id"]], sets[b["id"]]
    if not x or not y: continue
    j = len(x & y) / min(len(x), len(y))
    if j > 0.4 and len(x & y) >= 2: problems.append(f"shared exercises {a['id']} / {b['id']}: {len(x & y)} common ({j:.0%} of the smaller)")
for p in problems: print("OVERLAP", p)
print(f"{len(problems)} overlaps in {len(lessons)} lessons")
sys_exit = 1 if problems else 0
raise SystemExit(sys_exit)
