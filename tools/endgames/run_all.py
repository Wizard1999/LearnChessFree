"""Rebuild the whole endgame bank (content/items/end-*.json) from scratch, politely, until nothing is pending.

    ./tools/.venv/Scripts/python.exe -I tools/endgames/run_all.py [--passes 6] [--no-fetch]

One pass = run every generator once. A generator never touches the network: it queues the tablebase positions it needs (cache/queue.jsonl)
and builds items only from positions already cached. The fetcher daemon (fetcher.py, started here unless --no-fetch) drains the queue into
cache/tb.jsonl. Passes repeat until no generator reports positions still needed (or --passes is reached). At the end the answers are copied
into the validator's shared cache (warm_cache.py) so tools/validate.py does not call the public service again, and stats.py prints counts.

Everything is seeded: the same cache gives the same files. A pass with a bigger cache can renumber ids (ids are assigned in generation
order), so do not rerun after lessons have started to reference item ids by name.
"""
from __future__ import annotations

import re
import subprocess
import sys
import time
from pathlib import Path

HERE = Path(__file__).resolve().parent
PY = sys.executable
GENS = [("gen_pawn.py", []), ("gen_pawn2.py", []), ("gen_pawn3.py", []), ("gen_rook.py", []), ("gen_minor.py", []), ("gen_queen.py", []),
        ("gen_mates.py", []), ("gen_meta.py", [])]


def one_pass():
    pending = 0
    for script, args in GENS:
        out = subprocess.run([PY, "-I", str(HERE / script)] + args, capture_output=True, text=True, cwd=str(HERE.parent.parent))
        if out.returncode != 0:
            print(f"!! {script} failed:\n{out.stderr[-800:]}")
            continue
        n = sum(int(m) for m in re.findall(r"positions still needed from the tablebase: (\d+)", out.stdout))
        items = sum(int(m) for m in re.findall(r"\.json (\d+) items", out.stdout))
        print(f"   {script:14s} items {items:4d}  positions still needed {n}")
        pending += n
    return pending


def main():
    passes = 6
    if "--passes" in sys.argv:
        passes = int(sys.argv[sys.argv.index("--passes") + 1])
    daemon = None
    if "--no-fetch" not in sys.argv:
        daemon = subprocess.Popen([PY, "-I", str(HERE / "fetcher.py")], cwd=str(HERE.parent.parent))
    try:
        for p in range(1, passes + 1):
            print(f"pass {p}")
            pending = one_pass()
            if pending == 0:
                print("nothing pending")
                break
            print(f"   {pending} positions queued; waiting for the fetcher ...")
            time.sleep(min(600, 20 + 2 * pending))
    finally:
        if daemon is not None:
            daemon.terminate()
    subprocess.run([PY, "-I", str(HERE / "warm_cache.py")], cwd=str(HERE.parent.parent))
    subprocess.run([PY, "-I", str(HERE / "stats.py")], cwd=str(HERE.parent.parent))


if __name__ == "__main__":
    main()
