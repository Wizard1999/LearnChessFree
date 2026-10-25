"""Prints the counts used in docs/exercises-positional.md (per node, depth, cue, task, review status, claim types).

    ./tools/.venv/Scripts/python.exe -I tools/positional/report.py
"""
import glob, json, sys
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent
items, positions = [], {}
for f in sorted(glob.glob(str(ROOT / "content" / "items" / "pos-*.json"))):
    d = json.load(open(f, encoding="utf-8"))
    for p in d["positions"]:
        positions[p["id"]] = p
    items += d["items"]
node = Counter(); by_node_cue = defaultdict(Counter); by_depth = defaultdict(Counter)
for it in items:
    n, _, dep = it["skill"].rpartition(".")
    node[n] += 1; by_node_cue[n][it["cue"]] += 1; by_depth[n][dep] += 1
print(f"items {len(items)}, positions {len(positions)}, claims {sum(len(i['claims']) for i in items)}")
print("| node | items | cue 1 | cue 2 | cue 3 | depths |")
print("|---|---|---|---|---|---|")
for n, c in sorted(node.items()):
    print(f"| {n} | {c} | {by_node_cue[n][1]} | {by_node_cue[n][2]} | {by_node_cue[n][3]} | {', '.join(f'{k}:{v}' for k, v in sorted(by_depth[n].items()))} |")
print("cue", dict(sorted(Counter(i["cue"] for i in items).items())))
print("task", dict(Counter(i["task"] for i in items)))
print("review", dict(Counter(i["review"]["status"] for i in items)))
print("claim types", dict(Counter(c["type"] for i in items for c in i["claims"]).most_common()))
print("kinds", dict(Counter(positions[i["position"]]["provenance"]["kind"] for i in items)))
print("games", len({positions[i["position"]]["family"] for i in items}), "families")
tpl = Counter(next((t[4:] for t in i["tags"] if t.startswith("tpl.")), i["task"]) for i in items)
print("templates", len(tpl))
