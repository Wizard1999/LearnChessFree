"""Counts of the endgame bank (content/items/end-*.json): per node, per depth, per task, per cue, per review status, contrast pairs.

    ./tools/.venv/Scripts/python.exe -I tools/endgames/stats.py [--md]       # --md prints a Markdown table for docs/exercises-endgames.md
"""
import json
import sys
from collections import Counter, defaultdict
from pathlib import Path

ITEMS = Path(__file__).resolve().parent.parent.parent / "content" / "items"


def main():
    md = "--md" in sys.argv
    by_node = defaultdict(Counter)
    tasks = Counter()
    cues = Counter()
    review = Counter()
    fams = defaultdict(set)
    pos_total = set()
    cgs = defaultdict(set)
    files = {}
    for f in sorted(ITEMS.glob("end-*.json")):
        d = json.loads(f.read_text(encoding="utf-8"))
        files[f.name] = len(d["items"])
        for p in d["positions"]:
            pos_total.add(p["id"])
        for it in d["items"]:
            node, _, depth = it["skill"].rpartition(".")
            by_node[node][depth] += 1
            tasks[it["task"]] += 1
            cues[it["cue"]] += 1
            review[it.get("review", {}).get("status")] += 1
            fams[node].add(next(t for t in it["tags"] if t.startswith("family.")))
            if it.get("contrast_group"):
                cgs[node].add(it["contrast_group"])
    total = sum(sum(c.values()) for c in by_node.values())
    if md:
        print("| Node | Items | D1 | D2 | D3 | Families | Contrast groups |")
        print("|---|---|---|---|---|---|---|")
        for node in sorted(by_node):
            c = by_node[node]
            print(f"| `{node}` | {sum(c.values())} | {c.get('D1', 0)} | {c.get('D2', 0)} | {c.get('D3', 0)} | {len(fams[node])} | {len(cgs[node])} |")
        print(f"| **Total** | **{total}** | | | | | |")
    else:
        for node in sorted(by_node):
            c = by_node[node]
            print(f"{node:34s} {sum(c.values()):4d}  D1={c.get('D1', 0)} D2={c.get('D2', 0)} D3={c.get('D3', 0)}  families={len(fams[node])} cg={len(cgs[node])}")
        print("TOTAL items", total, "positions", len(pos_total))
    print("files:", files)
    print("tasks:", dict(tasks))
    print("cues:", dict(sorted(cues.items())))
    print("review:", dict(review))


if __name__ == "__main__":
    main()
