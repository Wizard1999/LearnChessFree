"""Informational check: misconception coverage per skill node.

A node PASSES when the number of its shipped items (any depth, tag node.<ID> or skill
<ID>.Dn) that carry a 'misconception' tag OR a non-empty feedback_by_move is at least
the number of its listed misconceptions. 'explain' text is deliberately NOT counted:
almost every item has one, so it would make the check vacuous. Matching is by count,
not by meaning (a conservative proxy; a human still decides if the wrong move shown
is the listed misconception). Always exits 0.
"""
import glob, json, os, sys, collections

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def load(pattern):
    for f in sorted(glob.glob(os.path.join(ROOT, pattern))):
        with open(f, encoding="utf8") as fh:
            yield f, json.load(fh)


def main():
    cover = collections.Counter()   # node -> qualifying items
    tagged = collections.Counter()  # node -> items with explicit misconception tag
    for _, d in load("content/items/*.json"):
        items = d["items"] if isinstance(d, dict) else d
        for it in items:
            node = it.get("skill", "").rsplit(".D", 1)[0]
            tags = it.get("tags", [])
            nodes = {node} | {t[5:] for t in tags if t.startswith("node.")}
            tag = any(t == "misconception" or t.startswith("misconception.") for t in tags)
            if tag or it.get("feedback_by_move"):
                for n in nodes:
                    cover[n] += 1
            if tag:
                for n in nodes:
                    tagged[n] += 1
    rows, strands = [], collections.defaultdict(lambda: [0, 0, 0])
    for _, s in load("content/skills/*.json"):
        m = s.get("misconceptions") or []
        if not m:
            continue
        gap = max(0, len(m) - cover[s["id"]])
        rows.append((gap, s["id"], len(m), cover[s["id"]], tagged[s["id"]]))
        st = strands[s.get("strand", "?")]
        st[0] += 1
        st[1] += gap > 0
        st[2] += gap
    print("strand  nodes  gap_nodes  missing_items")
    for k in sorted(strands):
        print(f"{k:6} {strands[k][0]:6} {strands[k][1]:10} {strands[k][2]:13}")
    tot = sum(r[0] > 0 for r in rows)
    print(f"\nTOTAL nodes with misconceptions: {len(rows)}; gap nodes: {tot}; missing items: {sum(r[0] for r in rows)}")
    print("\n25 largest gaps (gap, node, misconceptions, covering items, tagged):")
    for r in sorted(rows, key=lambda r: (-r[0], r[1]))[:(10**6 if "--all" in __import__("sys").argv else 25)]:
        print("  ", *r)
    return 0


if __name__ == "__main__":
    sys.exit(main())
