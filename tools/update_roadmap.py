#!/usr/bin/env python3
"""Recompute ROADMAP.md's progress block and app/public/roadmap.json.

    ./tools/.venv/Scripts/python.exe -I tools/update_roadmap.py

Checklist rules: '- [x]' done (1), '- [~]' in progress (0.5), '- [ ]' not started (0). Phases are '## ' headings.
Metrics are read from the real files (skills, lessons with their 'also' coverage, the shipped bundle), so they cannot drift
from the checklist by hand. Run it whenever a task finishes (rule in CLAUDE.md).
"""
import sys as _s, pathlib as _p; _s.path.insert(0, str(_p.Path(__file__).resolve().parent))  # allow `python -I tools/<script>.py`
import collections, datetime, json, re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MD = ROOT / "ROADMAP.md"
OUT = ROOT / "app" / "public" / "roadmap.json"
STRANDS = {1: "Rules and board vision", 2: "Safety and the thinking loop", 3: "Tactics", 4: "Calculation", 5: "Positional play and planning",
           6: "Attack, sacrifice and defense", 7: "Endgames", 8: "Openings and structures", 9: "Game study", 10: "Practical performance", 11: "Self-direction"}
START, END = "<!-- PROGRESS:START -->", "<!-- PROGRESS:END -->"


def load(p):
    return json.loads(Path(p).read_text(encoding="utf-8"))


def parse(text):
    phases, cur = [], None
    for line in text.splitlines():
        if line.startswith("## "):
            cur = {"title": line[3:].strip(), "tasks": []}; phases.append(cur)
        m = re.match(r"- \[( |x|~)\] (.+)", line)
        if m and cur is not None:
            cur["tasks"].append({"state": {" ": "todo", "x": "done", "~": "doing"}[m.group(1)], "text": m.group(2).strip()})
    for ph in phases:
        score = sum(1 if t["state"] == "done" else 0.5 if t["state"] == "doing" else 0 for t in ph["tasks"])
        ph["done"] = sum(t["state"] == "done" for t in ph["tasks"]); ph["total"] = len(ph["tasks"])
        ph["percent"] = round(100 * score / ph["total"]) if ph["total"] else 0
    return [p for p in phases if p["tasks"]]


def metrics():
    skills = {f.stem: load(f) for f in sorted((ROOT / "content" / "skills").glob("*.json"))}
    lessons = [load(f) for f in sorted((ROOT / "content" / "lessons").glob("*.json"))]
    covered = set()
    for l in lessons:
        covered.add(l["skill"]); covered.update(l.get("also", []))
    bundle = ROOT / "app" / "public" / "content"
    items, manifest = [], {}
    if (bundle / "items.json").exists():
        items = load(bundle / "items.json"); manifest = load(bundle / "manifest.json")
    per_node = collections.Counter(i["skill"].rsplit(".", 1)[0] for i in items)
    strand_rows = []
    for n in range(1, 12):
        nodes = [k for k, v in skills.items() if v["strand"] == f"S{n}"]
        strand_rows.append({"id": f"S{n}", "name": STRANDS[n], "nodes": len(nodes),
                            "withLesson": sum(1 for k in nodes if k in covered), "withItems": sum(1 for k in nodes if per_node[k] >= 10)})
    openings = {}
    if (ROOT / "app" / "public" / "openings" / "manifest.json").exists():
        om = load(ROOT / "app" / "public" / "openings" / "manifest.json"); openings = {"games": om["source"]["games_used"], "month": om["source"]["month"]}
    return {
        "skills": len(skills), "lessons": len(lessons), "nodesWithLesson": sum(1 for k in skills if k in covered),
        "nodesWithItems": sum(1 for k in skills if per_node[k] >= 10), "itemsShipped": len(items), "itemsWaiting": manifest.get("skipped", 0),
        "itemsNeedHuman": (manifest.get("by_review") or {}).get("needs-human", 0), "itemsHumanReviewed": (manifest.get("by_review") or {}).get("human-reviewed", 0),
        "openings": openings, "strands": strand_rows,
    }


def main():
    text = MD.read_text(encoding="utf-8")
    phases = parse(text)
    total = sum(p["total"] for p in phases)
    score = sum(sum(1 if t["state"] == "done" else 0.5 if t["state"] == "doing" else 0 for t in p["tasks"]) for p in phases)
    overall = round(100 * score / total) if total else 0
    m = metrics()
    now = datetime.datetime.now(datetime.timezone.utc).isoformat(timespec="minutes")
    doing = [{"phase": p["title"], "text": t["text"]} for p in phases for t in p["tasks"] if t["state"] == "doing"]
    is_user = lambda t: bool(re.search(r"\((?:gate|question)s?|\(gate\)|gate G|\(Q\d", t["text"]))
    todo = [{"phase": p["title"], "text": t["text"]} for p in phases for t in p["tasks"] if t["state"] == "todo" and not is_user(t)]
    waiting = [{"phase": p["title"], "text": t["text"]} for p in phases for t in p["tasks"] if t["state"] == "todo" and is_user(t)]
    data = {"updated": now, "overall": overall, "tasksDone": sum(p["done"] for p in phases), "tasksTotal": total,
            "building": doing, "next": todo[:8], "waiting": waiting, "phases": phases, "metrics": m}
    OUT.write_text(json.dumps(data, indent=1), encoding="utf-8")

    lines = [f"**Overall: {overall}%** ({data['tasksDone']} of {total} tasks done, in-progress tasks count half). Updated {now} UTC.", ""]
    lines += ["| Phase | Done | % |", "|---|---|---|"] + [f"| {p['title']} | {p['done']}/{p['total']} | {p['percent']}% |" for p in phases]
    lines += ["", f"**Coverage (computed from the files):** {m['nodesWithLesson']} of {m['skills']} skill nodes have a lesson ({round(100 * m['nodesWithLesson'] / max(1, m['skills']))}%); {m['nodesWithItems']} nodes have 10 or more shipped exercises; "
              f"{m['itemsShipped']} exercises ship, {m['itemsWaiting']} wait for validation; {m['itemsHumanReviewed']} items reviewed by a person, {m['itemsNeedHuman']} flagged for human review.", ""]
    lines += ["| Strand | Nodes | With a lesson | With 10+ exercises |", "|---|---|---|---|"] + [f"| {r['id']} {r['name']} | {r['nodes']} | {r['withLesson']} | {r['withItems']} |" for r in m["strands"]]
    lines += ["", "**Building now:** " + ("; ".join(d["text"] for d in doing) or "nothing marked in progress"), "", "**Next up:** " + ("; ".join(d["text"] for d in todo[:5]) or "nothing left"), "", "**Waiting on you (gates and questions):** " + ("; ".join(d["text"] for d in waiting) or "nothing"), ""]
    new = text[: text.index(START) + len(START)] + "\n" + "\n".join(lines) + "\n" + text[text.index(END):]
    MD.write_text(new, encoding="utf-8")
    print(f"roadmap: {overall}% overall; lessons cover {m['nodesWithLesson']}/{m['skills']} nodes; {m['itemsShipped']} items ship")


if __name__ == "__main__":
    main()
