"""Runs the positional generators in dependency order (each reads the FENs of the modules before it and of the frozen quiet/endings
files, so a full run is reproducible).

    ./tools/.venv/Scripts/python.exe -I tools/positional/run_all.py [--index] [--quiet]

--index  first rebuild tools/positional/out/index.jsonl (about 3 minutes with 12 workers).
--quiet  also run the engine-checked quiet-move generator, both batches (10 to 60 minutes each on a busy machine; the output is frozen
         otherwise, because the other modules avoid its positions).
Order: gen_pawns, gen_squares, gen_pieces, gen_king, gen_mixed, gen_struct, gen_exchange, [gen_quiet, gen_quiet --extra], gen_endings, audit.
Validation is a separate step (tools/validate.py, a few files at a time; the engine files are slow).
"""
import subprocess, sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent.parent
PY = sys.executable


def run(script, *args):
    print(f"=== {script} {' '.join(args)}", flush=True)
    r = subprocess.run([PY, "-I", str(HERE / f"{script}.py"), *args], cwd=str(ROOT))
    if r.returncode:
        print(f"{script} FAILED with {r.returncode}")
        sys.exit(r.returncode)


def main():
    if "--index" in sys.argv:
        run("build_index", "12")
    for s in ["gen_pawns", "gen_squares", "gen_pieces", "gen_king", "gen_mixed", "gen_struct", "gen_exchange"]:
        run(s)
    if "--quiet" in sys.argv:
        run("gen_quiet")
        run("gen_quiet", "--extra")
    run("gen_endings")
    run("audit")


if __name__ == "__main__":
    main()
