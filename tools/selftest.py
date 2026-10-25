"""The validator must REJECT known-bad content and ACCEPT known-good content.   Run: ./tools/.venv/Scripts/python.exe -I tools/selftest.py

Parts
  1. tests/bad-items.json: four planted defects (invalid position, no claims, false claims) must each be reported.
  2. tests/structure-claims.json (built by tests/make_structure_tests.py from hand-derived values): every OK-* claim must pass,
     every BAD-* claim (planted wrong expectation, illegal move, unknown kind, missing expectation) must be rejected.
  3. tests/test_structure_naive.py: tools/structure.py against an independent naive implementation on real and random positions.
  4. Tablebase cache: parallel writers must lose no entry and leave a parseable file (atomic, locked, merged writes).
"""
import sys, json, os, subprocess, tempfile, shutil
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
sys.path.insert(0, str(HERE / "tests"))
import validate
from engine import Engine

failures = []


def part1_and_2():
    e = Engine()
    try:
        errs = validate.validate_file(HERE / "tests" / "bad-items.json", e)
        print("\nerrors reported (bad-items):"); [print("  -", x) for x in errs]
        expected = ["P-BAD-KINGS: invalid position", "I-BAD-2: no claims", "I-BAD-1/C1: claim failed", "I-BAD-3/C1: claim failed"]
        missing = [x for x in expected if not any(x in err for err in errs)]
        print("PART 1", "PASSED (all four defects caught)" if not missing else f"FAILED, not caught: {missing}")
        if missing: failures.append(f"part 1: {missing}")

        data = json.loads((HERE / "tests" / "structure-claims.json").read_text(encoding="utf-8"))
        errs2 = validate.validate_file(HERE / "tests" / "structure-claims.json", e)
        good = bad = 0; wrong = []
        for it in data["items"]:
            for c in it["claims"]:
                hit = [x for x in errs2 if f"{it['id']}/{c['id']}:" in x]
                if c["id"].startswith("OK-"):
                    good += 1
                    if hit: wrong.append(f"good claim rejected: {it['id']} {c['type']} {c['params']} -> {hit[0]}")
                else:
                    bad += 1
                    if not hit: wrong.append(f"BAD claim accepted: {it['id']} {c['type']} {c['params']}")
        other = [x for x in errs2 if "claim failed" not in x]
        wrong += [f"structural error: {x}" for x in other]
        print(f"PART 2 structure claims: {good} good accepted, {bad} planted defects rejected:", "PASSED" if not wrong else "FAILED")
        for w in wrong: print("   ", w)
        if wrong: failures.append(f"part 2: {len(wrong)} problems")
    finally:
        e.close()
        for stem in ("bad-items", "structure-claims"):
            (Path(validate.ROOT) / "content" / "_evidence" / f"{stem}.evidence.json").unlink(missing_ok=True)


def part3():
    import test_structure_naive as T
    import random, chess
    rng = random.Random(7)
    boards = [T.random_structure(rng) for _ in range(300)]
    cand = HERE / "corpus" / "out" / "game_candidates.jsonl"
    if cand.exists():
        lines = cand.read_text(encoding="utf-8").splitlines()
        boards += [chess.Board(json.loads(l)["fen"]) for l in rng.sample(lines, 300)]
    bad = [b.fen() for b in boards if T.check_board(b)]
    print(f"PART 3 differential test on {len(boards)} boards:", "PASSED" if not bad else f"FAILED on {len(bad)}: {bad[:3]}")
    if bad: failures.append("part 3: structure.py differs from the naive implementation")


def part4():
    tmp = Path(tempfile.mkdtemp(prefix="tbtest-"))
    cache = tmp / "tablebase.json"
    cache.write_text(json.dumps({f"pre-{i}": {"v": i} for i in range(50)}), encoding="utf-8")
    worker = HERE / "tests" / "tb_cache_worker.py"
    procs = [subprocess.Popen([sys.executable, "-I", str(worker), str(cache), f"w{k}", "35"]) for k in range(4)]
    codes = [p.wait() for p in procs]
    try:
        d = json.loads(cache.read_text(encoding="utf-8"))
        want = 50 + 4 * 35
        ok = len(d) == want and all(c == 0 for c in codes)
        print(f"PART 4 tablebase cache with 4 parallel writers: {len(d)}/{want} entries, exit codes {codes}:", "PASSED" if ok else "FAILED")
        if not ok: failures.append("part 4: cache lost entries or a worker failed")
    except Exception as ex:
        print("PART 4 FAILED: cache unreadable:", ex); failures.append("part 4: cache unreadable")
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


part1_and_2()
part3()
part4()
print("\nSELFTEST", "PASSED" if not failures else f"FAILED: {failures}")
sys.exit(1 if failures else 0)
