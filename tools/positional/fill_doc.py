"""Rewrites the counts block of docs/exercises-positional.md from the current content/items/pos-*.json (run after validation).

    ./tools/.venv/Scripts/python.exe -I tools/positional/fill_doc.py
"""
import glob, json, subprocess, sys
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent
items, positions = [], {}
for f in sorted(glob.glob(str(ROOT / "content" / "items" / "pos-*.json"))):
    d = json.load(open(f, encoding="utf-8"))
    for p in d["positions"]:
        positions[p["id"]] = p
    items += d["items"]
ev_pass = ev_total = 0
for f in glob.glob(str(ROOT / "content" / "_evidence" / "pos-*.evidence.json")):
    for r in json.load(open(f, encoding="utf-8")):
        ev_total += 1
        ev_pass += r["result"] == "pass"
node = Counter(); cue = defaultdict(Counter); dep = defaultdict(Counter)
for it in items:
    n, _, d_ = it["skill"].rpartition(".")
    node[n] += 1; cue[n][it["cue"]] += 1; dep[n][d_] += 1
lines = [f"**{len(items)} items on {len(positions)} positions** ({len({p['family'] for p in positions.values()})} families), {sum(len(i['claims']) for i in items)} claims; evidence records {ev_pass}/{ev_total} pass. "
         f"Cue 1: {sum(1 for i in items if i['cue'] == 1)}, cue 2: {sum(1 for i in items if i['cue'] == 2)}, cue 3: {sum(1 for i in items if i['cue'] == 3)}. "
         f"Tasks: {dict(Counter(i['task'] for i in items))}. Review: {dict(Counter(i['review']['status'] for i in items))}. "
         f"Positions: {dict(Counter(positions[i['position']]['provenance']['kind'] for i in items))} (the 'generated' ones are the near-miss edits and the random tablebase endings).",
         "", "Items per node (by the item's own skill node; tags add related nodes, so practice sets by `node.<ID>` are larger):", "",
         "| node | items | cue 1 | cue 2 | cue 3 | depths |", "|---|---|---|---|---|---|"]
for n, c in sorted(node.items()):
    lines.append(f"| {n} | {c} | {cue[n][1]} | {cue[n][2]} | {cue[n][3]} | {', '.join(f'{k}:{v}' for k, v in sorted(dep[n].items()))} |")
tagcount = Counter(t[5:] for i in items for t in i["tags"] if t.startswith("node."))
lines += ["", "Items reachable by a `node.<ID>` tag (including secondary nodes): " + ", ".join(f"{k} {v}" for k, v in sorted(tagcount.items())) + "."]
p = ROOT / "docs" / "exercises-positional.md"
s = p.read_text(encoding="utf-8")
a, b = s.index("<!-- COUNTS START -->"), s.index("<!-- COUNTS END -->")
p.write_text(s[:a] + "<!-- COUNTS START -->\n" + "\n".join(lines) + "\n" + s[b:], encoding="utf-8")
print("\n".join(lines[:3]))
