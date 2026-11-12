#!/usr/bin/env python3
"""Joins Andrew's skill-to-icon map to the icon images and writes what the app shows (D89).

    ./tools/.venv/Scripts/python.exe -I tools/build_icons.py

Reads docs/icons/scholarmate-core-icon-map.csv, docs/icons/gallery-art-index.csv and assets/icons/icons.json. A skill gets an icon only when its row is
"Approved" and the gallery tile it points at is "Approved" (draft and provisional art shows nothing: an icon that may change is worse than none).
Writes app/public/icons/skill-icons.json ({skill: {icon, label, file, shared}}) and copies only the used 256 px WebP files next to it.
`shared` is how many skills use the same picture: a shared icon stands for a section's idea, not for one skill, and the app draws it smaller.
"""
import sys as _s, pathlib as _p; _s.path.insert(0, str(_p.Path(__file__).resolve().parent))
import csv, json, shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "app" / "public" / "icons"


def main():
    rows = list(csv.DictReader((ROOT / "docs/icons/scholarmate-core-icon-map.csv").open(encoding="utf-8")))
    tiles = json.loads((ROOT / "assets/icons/icons.json").read_text(encoding="utf-8"))
    by_name = {}
    for t in tiles:
        if t["file"] and t["status"] == "Approved": by_name.setdefault(t["name"].casefold().strip(), t)
    out, skipped = {}, []
    for r in rows:
        t = by_name.get(r["Proposed existing icon"].casefold().strip())
        if r["Gallery status"] != "Approved" or not t: skipped.append((r["Skill ID"], r["Proposed existing icon"], r["Gallery status"])); continue
        out[r["Skill ID"]] = {"icon": t["name"], "label": t["description"] or t["name"], "file": t["file"]}
    uses = {}
    for v in out.values(): uses[v["file"]] = uses.get(v["file"], 0) + 1
    for v in out.values(): v["shared"] = uses[v["file"]]
    OUT.mkdir(parents=True, exist_ok=True)
    for old in OUT.glob("*.webp"): old.unlink()
    for f in uses: shutil.copy(ROOT / "assets/icons" / f, OUT / f)
    (OUT / "skill-icons.json").write_text(json.dumps(out, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"{len(out)} of {len(rows)} skills have an approved icon ({len(uses)} pictures, {sum(1 for v in out.values() if v['shared'] > 1)} skills share one); {len(skipped)} left without")
    for s in skipped[:12]: print("  none:", *s)


if __name__ == "__main__":
    main()
