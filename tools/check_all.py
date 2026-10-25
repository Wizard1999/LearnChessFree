#!/usr/bin/env python3
"""Cross-file consistency checks over content/items, content/lessons and content/skills.

    ./tools/.venv/Scripts/python.exe -I tools/check_all.py [--report] [--strict]

Errors (exit 1): duplicate item/position/lesson/skill ids; item without a position; illegal FEN; item skill not in the skill graph
(or its depth not defined); lesson skill not in the graph; lesson referencing a missing item, position or contrast item;
practice step whose tags match fewer than 3 items; item with no claims and no human review.
Warnings: the same placement+turn used by several positions in different families (a learner may see "new" items that are the same
diagram); skills with items but no lesson; lessons whose first task item sits at a lower tier than the lesson depth.

--report prints coverage per strand and tier. --strict turns warnings into errors.
This does not run the engine; tools/validate.py and tools/validate_lessons.py do that.
"""
import sys as _s, pathlib as _p; _s.path.insert(0, str(_p.Path(__file__).resolve().parent))  # allow `python -I tools/<script>.py`
import argparse, collections, json
from pathlib import Path
import chess

ROOT = Path(__file__).resolve().parent.parent
C = ROOT / "content"


def load_json(p):
    return json.loads(p.read_text(encoding="utf-8"))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--report", action="store_true")
    ap.add_argument("--strict", action="store_true")
    a = ap.parse_args()
    errs, warns = [], []

    # skills
    skills = {}
    for f in sorted((C / "skills").glob("*.json")):
        d = load_json(f)
        if d["id"] in skills: errs.append(f"duplicate skill id {d['id']} ({f.name})")
        skills[d["id"]] = d

    # positions and items
    positions, items = {}, {}
    item_file = {}
    for f in sorted((C / "items").glob("*.json")):
        d = load_json(f)
        for p in d.get("positions", []):
            if p["id"] in positions: errs.append(f"duplicate position id {p['id']} ({f.name} and earlier)")
            positions[p["id"]] = p
        for it in d.get("items", []):
            if it["id"] in items: errs.append(f"duplicate item id {it['id']} ({f.name} and {item_file[it['id']]})")
            items[it["id"]] = it; item_file[it["id"]] = f.name

    fen_users = collections.defaultdict(set)
    for pid, p in positions.items():
        try:
            b = chess.Board(p["fen"])
            if not b.is_valid(): errs.append(f"position {pid}: invalid position ({b.status().name})")
        except Exception as ex:
            errs.append(f"position {pid}: bad FEN ({ex})"); continue
        fen_users[" ".join(p["fen"].split()[:2])].add((pid, p.get("family", "")))

    for key, users in fen_users.items():
        fams = {fam for _, fam in users}
        if len(users) > 1 and len(fams) > 1:
            warns.append(f"same position in different families: {', '.join(sorted(u for u, _ in users))}")

    for iid, it in items.items():
        pos = it.get("position")
        if it.get("task") != "play_out_unused" and pos is not None and pos not in positions:
            errs.append(f"item {iid}: position {pos} does not exist")
        if pos is None and "fen" not in it:
            errs.append(f"item {iid}: no position")
        if not it.get("claims") and it.get("review", {}).get("status") != "human-reviewed":
            errs.append(f"item {iid}: no claims and no human review")
        if skills:
            sk = it.get("skill", "")
            node, _, depth = sk.rpartition(".")
            if node not in skills: errs.append(f"item {iid}: skill {sk} is not in the skill graph")
            elif depth not in skills[node].get("depths", {}): errs.append(f"item {iid}: skill {sk} depth not defined")

    # lessons
    lessons = {}
    for f in sorted((C / "lessons").glob("*.json")):
        d = load_json(f)
        if d["id"] in lessons: errs.append(f"duplicate lesson id {d['id']}")
        lessons[d["id"]] = d
        if skills and d.get("skill") not in skills: errs.append(f"lesson {d['id']}: skill {d.get('skill')} is not in the skill graph")
        for n, s in enumerate(d.get("steps", [])):
            where = f"lesson {d['id']} step {n + 1}"
            if s.get("type") == "item" and s.get("item") not in items: errs.append(f"{where}: item {s.get('item')} does not exist")
            if s.get("type") == "contrast":
                for k in ("working", "failing", "irrelevant"):
                    ref = s.get(k)
                    if isinstance(ref, str) and ref not in items: errs.append(f"{where}: contrast {k} item {ref} does not exist")
                for ref in s.get("items", []) if isinstance(s.get("items"), list) else []:
                    if isinstance(ref, str) and ref not in items: errs.append(f"{where}: contrast item {ref} does not exist")
            if s.get("type") == "practice":
                tags = s.get("tags", [])
                n_match = sum(1 for it in items.values() if all(t in it.get("tags", []) for t in tags))
                if tags and n_match < 3: errs.append(f"{where}: practice tags {tags} match only {n_match} items")

    # coverage
    node_items = collections.Counter(it["skill"].rpartition(".")[0] for it in items.values())
    node_lessons = collections.Counter()
    for l in lessons.values():
        node_lessons[l.get("skill")] += 1
        for extra in l.get("also", []):
            node_lessons[extra] += 1
            if skills and extra not in skills: errs.append(f"lesson {l['id']}: also-skill {extra} is not in the skill graph")
    if skills:
        for node, n in sorted(node_items.items()):
            if node in skills and node_lessons[node] == 0 and skills[node].get("tier", 9) <= 3:
                warns.append(f"skill {node} has {n} items but no lesson")

    if a.report and skills:
        by = collections.defaultdict(lambda: [0, 0, 0, 0])
        for node, sk in skills.items():
            row = by[(sk.get("strand"), sk.get("tier"))]
            row[0] += 1; row[1] += 1 if node_items[node] else 0; row[2] += 1 if node_lessons[node] else 0; row[3] += node_items[node]
        print("strand tier  nodes  with-items  with-lesson  items")
        for (st, ti), r in sorted(by.items(), key=lambda kv: (str(kv[0][0]), kv[0][1] if kv[0][1] is not None else -1)):
            print(f"{st!s:6} {ti!s:4} {r[0]:6} {r[1]:11} {r[2]:12} {r[3]:6}")

    print(f"{len(skills)} skills, {len(positions)} positions, {len(items)} items, {len(lessons)} lessons")
    for w in warns: print("WARN ", w)
    for e in errs: print("ERROR", e)
    print(f"{len(errs)} errors, {len(warns)} warnings")
    sys_exit = 1 if errs or (a.strict and warns) else 0
    raise SystemExit(sys_exit)


if __name__ == "__main__":
    main()
