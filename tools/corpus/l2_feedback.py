"""lp2: a "tempting wrong move" for the decision items (predict: "is it the best move?", compare: "which of two moves?").

l2_verify.py looks only at the engine's second-ranked move when it searches for a feedback move, so most predict / compare puzzles
ended up without one. Here every non-accepted move of the engine's top 6 (from the verdict) that is a capture, a check or a
promotion is tried, best-scoring first; the first one that `move_loses` (validator code, depth 16) shows to be at least 150 cp
worse becomes the verdict's `feedback`. A claim is only written after the validator's own check passed.

    python l2_feedback.py [workers=12]         (resumable: verdicts that already have feedback are skipped)
"""
import sys as _s, os as _o; _s.path.insert(0, _o.path.dirname(_o.path.abspath(__file__)))
import json, time
from l2_common import *
from pool import run_pool


def job_fn(v, eng, V):
    b = chess.Board(v["fen"])
    pos = dict(id="PL-" + v["id"], fen=v["fen"], family="FAM-LP2-" + v["id"], provenance=dict(kind="lichess_puzzle", ref=v["id"], licence="CC0"))
    acc = set(v.get("accepted", []))
    best = max(s for _, s in v["top"])
    for m, s in v["top"]:
        if m in acc:
            continue
        mv = chess.Move.from_uci(m)
        if not (b.is_capture(mv) or b.gives_check(mv) or mv.promotion):
            continue
        if best - s < 150:
            continue
        cm = dict(id="F1", type="move_loses", params=dict(move=m, cp=0))
        rr = V.check_claim(eng, pos, cm)
        loss = (rr.get("measured") or {}).get("loss_cp")
        if loss is None or loss < 150:
            continue
        cp = int(min(loss, 1000) // 50 * 50)
        cm = dict(id="F1", type="move_loses", params=dict(move=m, cp=cp))
        if V.check_claim(eng, pos, cm)["result"] != "pass":
            continue
        return dict(id=v["id"], feedback=dict(move=m, cp=cp, loss_measured=loss, is_capture=b.is_capture(mv), gives_check=b.gives_check(mv), claim=cm))
    return dict(id=v["id"], feedback=None, tried=True)


def main():
    workers = int(sys.argv[1]) if len(sys.argv) > 1 else 12
    vf = L2_OUT / "verdicts.jsonl"
    vs = [json.loads(l) for l in vf.read_text(encoding="utf-8").splitlines() if l.strip()]
    todo = [v for v in vs if v.get("ok") and not v.get("feedback") and not v.get("fb_tried") and not v.get("tb_needed")
            and BUCKETS[v["bucket"]]["use"] in ("predict", "compare") and v.get("top")]
    print(len(todo), "verdicts need a feedback move", flush=True)
    t0 = time.time()
    res = run_pool(job_fn, todo, workers=workers, log=print, every=50)
    by = {r["id"]: r for r in res if "id" in r}
    n = 0
    for v in vs:
        r = by.get(v["id"])
        if r is None:
            continue
        v["fb_tried"] = True
        if r.get("feedback"):
            v["feedback"] = r["feedback"]; n += 1
    tmp = vf.with_suffix(".tmp")
    tmp.write_text("".join(json.dumps(v, ensure_ascii=False, default=str) + "\n" for v in vs), encoding="utf-8")
    tmp.replace(vf)
    print(f"feedback found for {n} of {len(todo)} in {time.time() - t0:.0f}s")


if __name__ == "__main__":
    main()
