"""Run tools/validate.py on our item files, at most N in parallel (one engine process each), then summarise.

    python validate_all.py [N=6] [glob patterns relative to content/items, default: lp-*.json quiet-*.json threat-*.json]
Logs: out/validate_logs/<file>.log ; the validator itself writes content/_evidence/<file>.evidence.json.
"""
import sys as _s, os as _o; _s.path.insert(0, _o.path.dirname(_o.path.abspath(__file__)))
import subprocess, time, json
from common import *

PY = ROOT / "tools" / ".venv" / "Scripts" / "python.exe"


def main():
    n = int(sys.argv[1]) if len(sys.argv) > 1 else 6
    pats = sys.argv[2:] or ["lp-*.json", "quiet-*.json", "threat-*.json"]
    files = sorted({p for pat in pats for p in ITEMS_DIR.glob(pat)})
    logdir = OUT / "validate_logs"; logdir.mkdir(exist_ok=True)
    running, queue, t0 = [], list(files), time.time()
    results = {}
    while queue or running:
        while queue and len(running) < n:
            f = queue.pop(0)
            fh = open(logdir / (f.stem + ".log"), "w", encoding="utf-8")
            p = subprocess.Popen([str(PY), "-I", str(ROOT / "tools" / "validate.py"), str(f)], stdout=fh, stderr=subprocess.STDOUT, cwd=str(ROOT))
            running.append((f, p, fh, time.time()))
            print(f"started {f.name}", flush=True)
        for r in list(running):
            f, p, fh, ts = r
            if p.poll() is not None:
                fh.close(); running.remove(r)
                results[f.name] = p.returncode
                print(f"finished {f.name} exit={p.returncode} in {time.time() - ts:.0f}s", flush=True)
        time.sleep(2)
    print(f"all done in {time.time() - t0:.0f}s")
    tot_c = tot_p = 0
    for f in files:
        ev = ROOT / "content" / "_evidence" / (f.stem + ".evidence.json")
        if not ev.exists(): print(f.name, "NO EVIDENCE"); continue
        recs = json.loads(ev.read_text(encoding="utf-8"))
        data = json.loads(f.read_text(encoding="utf-8"))
        items = {x["id"]: [] for x in data["items"]}
        for r in recs: items.setdefault(r["item"], []).append(r["result"] == "pass")
        passed_items = sum(1 for k, v in items.items() if v and all(v))
        npass = sum(1 for r in recs if r["result"] == "pass")
        tot_c += len(recs); tot_p += npass
        print(f"{f.name}: exit={results.get(f.name)} items passing {passed_items}/{len(items)}; claims passing {npass}/{len(recs)}")
        for r in recs:
            if r["result"] != "pass": print("   FAIL", r["item"], r["claim"], r["type"], r.get("reason"), r.get("measured"))
    print(f"TOTAL claims passing {tot_p}/{tot_c}")


if __name__ == "__main__":
    main()
