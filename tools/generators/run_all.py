"""Regenerate every Tier 0-1 generated item file, deterministically, then (optionally) validate and audit.

    python -I tools/generators/run_all.py                  # regenerate all gen-t0-*.json (about 5 min, mostly engine/tablebase pre-checks)
    python -I tools/generators/run_all.py --only count     # one module (earlier modules' files must already exist; see common.ORDER)
    python -I tools/generators/run_all.py --validate       # after generating, run tools/validate.py on the files (<= 4 in parallel)
    python -I tools/generators/run_all.py --validate-only  # just run the validator on the existing files

Modules, in build order (a later module avoids every FEN used by an earlier one and by everything else under content/):
    move     piece movement                          gen-t0-move.json
    count    attackers/defenders, take it or not     gen-t0-count.json
    loose    loose pieces                            gen-t0-loose.json
    state    check / mate / stalemate / ongoing      gen-t0-state.json
    mate1    mate in one + 'is there a mate?'        gen-t0-mate1.json
    contrast free vs defended triples                gen-t0-contrast.json
    special  castling / en passant / promotion       gen-t0-castle.json, gen-t0-ep.json, gen-t0-promo.json
    endmate  K+Q v K, K+R v K technique              gen-t0-endmate.json
    kpk      K+P v K races, opposition               gen-t0-kpk.json
    board    square names tied to a legal move       gen-t0-board.json
Seeds are fixed in each module (SEED constants); the only external input is the set of FENs already in content/.
A full run does not read the old gen-t0-* files at all (one registry grows module by module), so earlier runs cannot influence the result.
"""
from __future__ import annotations

import subprocess
import sys as _s
import pathlib as _p
import time

HERE = _p.Path(__file__).resolve().parent
_s.path.insert(0, str(HERE))
from common import ORDER, ITEMS_DIR, GEN_PREFIX, ROOT, Registry, PreCheck, all_content_fens  # noqa: E402

import importlib


def generate(only=None):
    """A full run uses ONE registry that grows module by module (the external content FENs first, then each module's accepted
    FENs), and replaces each output file atomically when its module is done; nothing is deleted up front. `--only X` rebuilds one
    module against the external content plus the files of the modules that precede it in ORDER."""
    mods = [only] if only else ORDER
    shared = None if only else Registry(all_content_fens(skip_prefix=GEN_PREFIX))
    summary = {}
    pre = PreCheck()
    try:
        for name in mods:
            t0 = time.time()
            mod = importlib.import_module(f"gen_{name}")
            reg = shared if shared is not None else Registry.for_module(name)
            builders = mod.build(reg, pre)
            for fname, bl in builders.items():
                bl.write(fname)
                summary[fname] = (len(bl.items), dict(bl.stats))
                print(f"{name:9s} {fname:22s} {len(bl.items):4d} items  {dict(bl.stats)}  ({time.time() - t0:.0f}s)", flush=True)
    finally:
        print("\npre-check rejections (engine/tablebase disagreed with the generator's own prediction):")
        for (fam, ctype), n in sorted(pre.rejects.items()):
            print(f"  {fam:24s} {ctype:20s} {n:4d}   e.g. {pre.reject_examples[(fam, ctype)][2]}")
        pre.close()
    return summary


def validate(files=None, parallel=4):
    """Run tools/validate.py on each file, at most `parallel` at a time. Output goes to temp files (a pipe that nobody reads
    fills up after ~64 KB and stalls the validator), and is read back when the process ends."""
    import tempfile
    py = str(ROOT / "tools" / ".venv" / "Scripts" / "python.exe")
    files = files or sorted(ITEMS_DIR.glob(GEN_PREFIX + "*.json"))
    results = {}
    queue = list(files)
    running = []
    tmp = _p.Path(tempfile.gettempdir())
    while queue or running:
        while queue and len(running) < parallel:
            f = queue.pop(0)
            log = tmp / f"validate-{f.stem}.log"
            fh = open(log, "w", encoding="utf-8")
            p = subprocess.Popen([py, "-I", str(ROOT / "tools" / "validate.py"), str(f)], stdout=fh, stderr=subprocess.STDOUT, text=True, cwd=str(ROOT))
            running.append((f, p, fh, log))
        time.sleep(0.5)
        for item in list(running):
            f, p, fh, log = item
            if p.poll() is not None:
                fh.close()
                out = log.read_text(encoding="utf-8", errors="replace")
                results[f.name] = (p.returncode, out)
                running.remove(item)
                tail = [l for l in out.splitlines() if l.strip()][-1] if out.strip() else ""
                print(f"validate {f.name}: exit {p.returncode}  {tail}", flush=True)
    return results


def main():
    args = _s.argv[1:]
    only = None
    if "--only" in args:
        only = args[args.index("--only") + 1]
    if "--validate-only" not in args:
        generate(only)
    if "--validate" in args or "--validate-only" in args:
        res = validate()
        bad = {k: v for k, v in res.items() if v[0] != 0}
        for k, (rc, out) in bad.items():
            print(f"\n=== {k} FAILED ===")
            print("\n".join(l for l in out.splitlines() if "FAIL" in l or "PROBLEM" in l)[:4000])
        _s.exit(1 if bad else 0)


if __name__ == "__main__":
    main()
