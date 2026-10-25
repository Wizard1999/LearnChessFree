"""Task C, step 2: engine screening of threat / no-threat candidates (task-C games only).

  python c2_screen.py [workers]

Kinds
  mate   the side NOT to move (the opponent) would mate in one if the side to move passed; the mating move is unique.
         validator claim: mate_in(move, n=1, null_move_first=true)  [fully machine-checked, rules-only]
  loose  the side to move has exactly one loose piece (attacked once, undefended, value >= 3); if it passed, the opponent
         captures it. validator claims: loose_pieces (exact set) + attackers (count 1). The *material win* of the capture
         is checked HERE by a null-move search (validate.check_claim on the null-moved FEN: net material >= 2 and the capture
         is the engine's best move) because the validator has no null_move_first support for material claims.
  none   no loose piece on either side, no mate-in-1 for the opponent, and a null-move search shows the opponent cannot
         win material (best line net <= 0 at depth 16, score <= +100 cp, no mate) and the position is within +-150 cp.
         validator claims: loose_pieces (both colours, empty) + eval_range(-150..150).
In all kinds the side to move must be able to survive: engine eval for the side to move >= -300 (mate/loose) and <= +300.
Output: out/threat_screen.jsonl
"""
import sys as _s, os as _o; _s.path.insert(0, _o.path.dirname(_o.path.abspath(__file__)))
import json, random
import chess
from common import *
from pool import run_pool, sc

BUCKETS = [(16, 26), (27, 37), (38, 48), (49, 60)]


def screen(rec, eng, V):
    kind = rec["kind"]
    gid, ply = rec["gid"], rec["ply"]
    pid = f"PT-{gid}-{ply}"
    pos = dict(id=pid, fen=rec["fen"], family=f"FAM-LT-{gid}-{ply}", provenance=dict(kind="lichess_game", ref=f"lichess.org/{gid} ply {ply}", licence="CC0"))
    out = dict(rec, pid=pid, ok=False)
    b = chess.Board(rec["fen"])
    stm = b.turn
    nb = b.copy(); nb.push(chess.Move.null())
    res = eng.search(rec["fen"], depth=16)[1]
    ev = sc(res)                                   # side-to-move POV
    out["eval_stm"] = ev; out["eval_kind"] = res["kind"]
    if res["kind"] == "mate":
        out["reason"] = "mate on the board for one side"; return out
    if kind == "mate" and not (-300 <= ev <= 600):
        out["reason"] = "side to move is lost or hugely ahead already"; return out
    if kind == "loose" and not (-300 <= ev <= 300):
        out["reason"] = "side to move is lost/winning already"; return out
    if kind == "none" and not (-150 <= ev <= 150):
        out["reason"] = "eval outside +-150"; return out
    if kind == "mate":
        mv = rec["mate1"][0]
        c = dict(id="C1", type="mate_in", params=dict(move=mv, n=1, null_move_first=True))
        r = V.check_claim(eng, pos, c)
        if r["result"] != "pass":
            out["reason"] = "mate_in claim failed"; return out
        out["claims"] = [c]; out["threat_move"] = mv; out["ok"] = True
        return out
    if kind == "loose":
        sq = rec["loose"][0]; cap = rec["loose_capture"][0]
        att_color = "black" if stm else "white"; def_color = "white" if stm else "black"
        c1 = dict(id="C1", type="loose_pieces", params=dict(color=def_color, squares=[sq]))
        c2 = dict(id="C2", type="attackers", params=dict(square=sq, color=att_color, count=1))
        for c in (c1, c2):
            if V.check_claim(eng, pos, c)["result"] != "pass":
                out["reason"] = f"{c['type']} claim failed"; return out
        # null-move check of the material win (script-checked, not validator-checked)
        npos = dict(pos, fen=nb.fen())
        rm = V.check_claim(eng, npos, dict(id="X", type="material_after_move", params=dict(move=cap, min=-999)))
        delta = (rm.get("measured") or {}).get("net_material")
        out["null_material"] = delta; out["null_pv"] = rm.get("pv")
        top = eng.search(nb.fen(), depth=16, multipv=2)
        out["null_best"] = top[1]["pv"][0]
        if delta is None or delta < 2:
            out["reason"] = "capture does not net >= 2 material in the null-move search"; return out
        if top[1]["pv"][0] != cap:
            out["reason"] = "capture is not the opponent's best move after a null move (another threat is bigger)"; return out
        out["claims"] = [c1, c2]; out["threat_move"] = cap; out["ok"] = True
        return out
    if kind == "none":
        att_color = "black" if stm else "white"; def_color = "white" if stm else "black"
        c1 = dict(id="C1", type="loose_pieces", params=dict(color=def_color, squares=[]))
        c2 = dict(id="C2", type="loose_pieces", params=dict(color=att_color, squares=[]))
        c3 = dict(id="C3", type="eval_range", params=dict(min=-150, max=150))
        for c in (c1, c2, c3):
            if V.check_claim(eng, pos, c)["result"] != "pass":
                out["reason"] = f"{c['type']} claim failed"; return out
        nres = eng.search(nb.fen(), depth=20)[1]       # opponent to move (null): can they win anything?
        delta, _ = V.quiet_end_delta(nb, nres["pv"], nb.turn)
        out["null_eval_opp"] = nres["value"] if nres["kind"] == "cp" else None; out["null_delta"] = delta
        if nres["kind"] == "mate" or nres["value"] > 100 or delta is None or delta > 0:
            out["reason"] = "null-move search finds a threat"; return out
        out["claims"] = [c1, c2, c3]; out["threat_move"] = "none"; out["ok"] = True
        return out
    out["reason"] = "unknown kind"
    return out


def main():
    workers = int(sys.argv[1]) if len(sys.argv) > 1 else 6
    rng = random.Random(f"{SEED}-threat-screen")
    rows = [json.loads(l) for l in open(OUT / "game_candidates.jsonl", encoding="utf-8")]
    rows = [r for r in rows if r["task"] == "C" and r["pieces"] >= 10]
    used_g = set(); jobs = []

    def take(pool, n, kind):
        rng.shuffle(pool); k = 0
        for r in pool:
            if r["gid"] in used_g: continue
            used_g.add(r["gid"]); jobs.append(dict(r, kind=kind)); k += 1
            if k >= n: break
    take([r for r in rows if len(r["mate1"]) == 1], 330, "mate")
    take([r for r in rows if r["mate1"] == [] and r["loose"] and len(r["loose"]) == 1 and r.get("loose_attackers") == 1
          and len(r.get("loose_capture", [])) == 1 and r.get("loose_value", 0) >= 3], 240, "loose")
    take([r for r in rows if not r["loose"] and not r["mate1"]], 150, "none")
    print(f"screening {len(jobs)} threat candidates", flush=True)
    res = run_pool(screen, jobs, workers=workers, log=print)
    with open(OUT / "threat_screen.jsonl", "w", encoding="utf-8") as fh:
        for r in res: fh.write(json.dumps(r) + "\n")
    from collections import Counter
    c = Counter((r.get("kind"), r.get("ok")) for r in res)
    print(dict(c))


if __name__ == "__main__":
    main()
