"""lp2: run the whole second-tranche pipeline, step by step (each step is resumable and can also be run alone).

    python l2_all.py [steps...]      steps: scan sample extra verify tb topup feedback stalemate comp build validate prune report doc
                                     (default: sample extra verify tb topup verify tb topup verify tb feedback build validate report doc)

  scan      l2_stale_scan.py   engine search for stalemate tricks (about 10 min)
  sample    l2_sample.py select   one pass over the puzzle database (3 min) + seeded stratified selection
  verify    l2_verify.py 10       depth-16 engine re-verification of every selected puzzle (resumable; about an hour at 10 workers)
  tb        l2_tb.py              exact tablebase stage (<= 7 pieces)
  build     l2_build.py           writes content/items/lp2-*.json
  validate  validate_all.py 3 lp2-*.json   the project validator, three files at a time
  extra     l2_sample.py extra    a database pass for the buckets added after the first selection (DEF.FORTRESS:eq, CAL.DEPTH:4, CAL.DEPTH:5)
  topup     l2_sample.py topup    append-only second round: puzzles for every bucket that is still short, sized by the bucket's observed yield
  feedback  l2_feedback.py        a verified tempting wrong move for predict / compare items
  stalemate l2_stalemate_gen2.py  constructed stalemate positions (engine first, tablebase second) -> lp2-stalemate-1.json
  comp      l2_comp.py screen     engine screen of real-game positions; then `python l2_comp.py build 10` writes lp2-ini-1.json
  prune     l2_prune.py           drop items whose claim failed in validate.py (never loosen a claim)
  report    l2_report.py          counts per node and per claim type -> out/l2/report.md
  doc       l2_doc.py             fills the generated tables of docs/exercises-themes.md
"""
import sys as _s, os as _o; _s.path.insert(0, _o.path.dirname(_o.path.abspath(__file__)))
import subprocess, time
from l2_common import *

PY = str(ROOT / "tools" / ".venv" / "Scripts" / "python.exe")
STEPS = {
    "scan": ["l2_stale_scan.py"],
    "sample": ["l2_sample.py", "select"],
    "verify": ["l2_verify.py", "10"],
    "tb": ["l2_tb.py"],
    "extra": ["l2_sample.py", "extra", "DEF.FORTRESS:eq", "CAL.DEPTH:4", "CAL.DEPTH:5"],
    "topup": ["l2_sample.py", "topup"],
    "feedback": ["l2_feedback.py", "8"],
    "stalemate": ["l2_stalemate_gen2.py", "36", "100"],
    "comp": ["l2_comp.py", "screen", "8"],
    "prune": ["l2_prune.py"],
    "doc": ["l2_doc.py"],
    "build": ["l2_build.py"],
    "validate": ["validate_all.py", "3", "lp2-*.json"],
    "report": ["l2_report.py"],
}


def main():
    steps = sys.argv[1:] or ["sample", "extra", "verify", "tb", "topup", "verify", "tb", "topup", "verify", "tb", "feedback", "build", "validate", "report", "doc"]
    for st in steps:
        t0 = time.time()
        print(f"== {st}", flush=True)
        r = subprocess.run([PY, "-I", str(Path(__file__).resolve().parent / STEPS[st][0])] + STEPS[st][1:], cwd=str(ROOT))
        print(f"== {st} exit {r.returncode} in {time.time() - t0:.0f}s", flush=True)
        if r.returncode != 0:
            break


if __name__ == "__main__":
    main()
