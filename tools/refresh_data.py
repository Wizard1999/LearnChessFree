"""The routine data refresh (about monthly): new game archives, rebuilt statistics, rebuilt library, then what is still stale.

    ./tools/.venv/Scripts/python.exe -I tools/refresh_data.py            # games + master statistics + library
    ./tools/.venv/Scripts/python.exe -I tools/refresh_data.py --no-games # skip the download, rebuild from what is on disk

New Week in Chess issues and new Lichess broadcast months are fetched (resumable; existing files are skipped). The statistics build takes
about an hour for the full archive. Nothing is committed: review the diff, run tools/check.py, then commit and push.
"""
import subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PY = [sys.executable, "-I"]
steps = []
if "--no-games" not in sys.argv: steps.append(("fetch new games", ["tools/fetch_games.py"]))
steps += [("build master statistics", ["tools/build_master_stats.py"]), ("ship master statistics", ["tools/ship_master_stats.py"]), ("rebuild library", ["tools/build_library.py"]), ("what is stale", ["tools/status.py"])]
for name, cmd in steps:
    print(f"== {name}", flush=True)
    if subprocess.run(PY + cmd, cwd=ROOT).returncode != 0:
        print(f"{name} failed; stopping."); sys.exit(1)
print("\nDone. Next: tools/check.py, review `git status`, commit and push.")
