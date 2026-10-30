"""What is stale? Compares data with the things that should follow it, and says what to re-run. Read-only.
    ./tools/.venv/Scripts/python.exe -I tools/status.py
"""
import json, os, re, sys, time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
def mt(p: Path) -> float: return p.stat().st_mtime if p.exists() else 0
def newest(paths) -> float: return max([mt(p) for p in paths] or [0])
def day(t: float) -> str: return time.strftime("%Y-%m-%d %H:%M", time.localtime(t)) if t else "missing"
issues = []

def check(name: str, older: float, newer: float, fix: str):
    if newer > older + 60: issues.append(f"STALE  {name}: source changed {day(newer)}, output is from {day(older)}. Run: {fix}")

content_src = list((ROOT / "content").rglob("*.json"))
check("shipped content", mt(ROOT / "app/public/content/manifest.json"), newest(content_src), "tools/build_content.py")
check("roadmap data", mt(ROOT / "app/public/roadmap.json"), mt(ROOT / "ROADMAP.md"), "tools/update_roadmap.py")
check("library (app copy)", mt(ROOT / "app/public/library/catalog.json"), max(mt(ROOT / "library/catalog.json"), mt(ROOT / "library/tags.json")), "tools/build_library.py")
games = list((ROOT / "library/data/games").rglob("*.zip")) + list((ROOT / "library/data/games").rglob("*.zst"))
check("master statistics (cache)", mt(ROOT / "library/cache/master_stats.json"), newest(games), "tools/build_master_stats.py then tools/ship_master_stats.py")
check("master statistics (shipped)", mt(ROOT / "app/public/masters/stats.json"), mt(ROOT / "library/cache/master_stats.json"), "tools/ship_master_stats.py")
# the numbers the docs quote
try:
    man = json.loads((ROOT / "app/public/content/manifest.json").read_text(encoding="utf8"))
    rm = (ROOT / "ROADMAP.md").read_text(encoding="utf8")
    m = re.search(r"(\d[\d,]*) items? ship|(\d[\d,]*) exercises ship", rm)
    if m and int((m.group(1) or m.group(2)).replace(",", "")) != man["items"]:
        issues.append(f"STALE  ROADMAP.md quotes {m.group(0)}, the build has {man['items']} items. Run: tools/update_roadmap.py")
except Exception as e:
    issues.append(f"could not compare the roadmap numbers ({e})")
age = (time.time() - mt(ROOT / "app/public/masters/stats.json")) / 86400
if age > 45: issues.append(f"REFRESH  master statistics are {age:.0f} days old; new games are published weekly. Run: tools/refresh_data.py")
print("\n".join(issues) if issues else "Nothing is stale.")
sys.exit(0)
