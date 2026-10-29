"""Summarise returned review files so a person can act on them.

    python tools/ingest_reviews.py [folder]        (default: feedback/inbox)

Copy the files your feedback address collected (or files testers sent) into feedback/inbox/, then run this. For every lesson and
exercise that got feedback it lists how many reviewers answered each checklist box, the difficulty votes, and every free-text
comment with the reviewer's role. It writes feedback/report.md. It NEVER marks anything human-reviewed: that is Andrew's decision
(gate G3), taken after reading the report. Reviewer names appear in the report; the feedback/ folder is gitignored."""
import sys as _s, pathlib as _p; _s.path.insert(0, str(_p.Path(__file__).resolve().parent))
import json, collections
from engine import ROOT

folder = _p.Path(_s.argv[1]) if len(_s.argv) > 1 else ROOT / "feedback" / "inbox"
by = collections.defaultdict(lambda: {"n": 0, "checks": collections.defaultdict(collections.Counter), "texts": []})
files = 0
for f in sorted(folder.glob("*.json")):
    try: d = json.loads(f.read_text(encoding="utf-8"))
    except Exception: print("skipped (not JSON):", f.name); continue
    if d.get("format") != "chess-school-review": print("skipped (wrong format):", f.name); continue
    files += 1
    who = d.get("reviewer", {})
    for it in d.get("items", []):
        k = f'{it.get("targetType")}:{it.get("targetId")}'
        r = by[k]; r["n"] += 1
        for ck, v in (it.get("checks") or {}).items(): r["checks"][ck][v] += 1
        if it.get("text") or it.get("kind"):
            tag = (who.get("role") or "unspecified") + (", " + who["name"] if who.get("name") else "")
            r["texts"].append(f'[{tag}; build {it.get("build")}; step {it.get("step") or "-"}] {it.get("kind") or ""} {it.get("text") or ""}'.strip())

def flags(r): return sum(c.get("no", 0) + c.get("unsure", 0) for c in r["checks"].values()) + len(r["texts"])
out = ["# Review report", "", f"{files} review files, {len(by)} lessons and exercises with feedback. Nothing here changes any content or review status.", ""]
for k, r in sorted(by.items(), key=lambda kv: -flags(kv[1])):
    out.append(f"## {k}  ({r['n']} entries)")
    for ck, c in r["checks"].items(): out.append(f"- {ck}: " + ", ".join(f"{v} x{n}" for v, n in c.most_common()))
    for t in r["texts"]: out.append(f"- {t}")
    out.append("")
(ROOT / "feedback").mkdir(exist_ok=True)
(ROOT / "feedback" / "report.md").write_text("\n".join(out), encoding="utf-8")
print("\n".join(out[:60]))
print(f"wrote feedback/report.md ({files} files)")
