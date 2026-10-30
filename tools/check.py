"""One command for everything that must stay true. Run after ANY change (content, tools or app):

    ./tools/.venv/Scripts/python.exe -I tools/check.py            # the full check (several minutes: validates every lesson with the engine)
    ./tools/.venv/Scripts/python.exe -I tools/check.py --quick    # skips the engine-heavy lesson validation (about a minute)
    ./tools/.venv/Scripts/python.exe -I tools/check.py --status   # also prints what is stale (see tools/status.py)

Stages, in order: content (validate_lessons, check_all, check_graph --strict, build_content, check_overlap), app (tsc, vitest including the
route smoke test and the data cross-checks, vite build). Prints one line per stage and exits non-zero if any fails.
"""
import subprocess, sys, time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PY = [sys.executable, "-I"]
NPX = "npx.cmd" if sys.platform == "win32" else "npx"
quick = "--quick" in sys.argv
STAGES = []
if not quick: STAGES.append(("lessons validate", PY + ["tools/validate_lessons.py"], ROOT, "ALL LESSONS PASSED"))
STAGES += [
    ("check_all", PY + ["tools/check_all.py"], ROOT, "0 errors"),
    ("skill graph", PY + ["tools/check_graph.py", "--strict"], ROOT, "0 errors"),
    ("build content", PY + ["tools/build_content.py"], ROOT, None),
    ("overlap (at most 1 known)", PY + ["tools/check_overlap.py"], ROOT, "1 overlaps"),
    ("typescript", [NPX, "tsc", "--noEmit"], ROOT / "app", None),
    ("tests + route smoke + cross-checks", [NPX, "vitest", "run"], ROOT / "app", "failed" and None),
    ("app build", [NPX, "vite", "build"], ROOT / "app", None),
]
failed = []
for name, cmd, cwd, must in STAGES:
    t0 = time.time()
    r = subprocess.run(cmd, cwd=cwd, capture_output=True, text=True, encoding="utf-8", errors="replace")
    out = (r.stdout or "") + (r.stderr or "")
    ok = r.returncode == 0 and (must is None or must in out)
    if name.startswith("overlap"): ok = "overlaps in" in out and ("1 overlaps" in out or "0 overlaps" in out)
    print(f"{'PASS' if ok else 'FAIL'}  {name}  ({time.time() - t0:.0f}s)", flush=True)
    if not ok:
        failed.append(name); print("\n".join(out.strip().splitlines()[-12:]), flush=True)
if "--status" in sys.argv:
    subprocess.run(PY + ["tools/status.py"], cwd=ROOT)
print("\nALL CHECKS PASSED" if not failed else f"\nFAILED: {', '.join(failed)}")
sys.exit(1 if failed else 0)
