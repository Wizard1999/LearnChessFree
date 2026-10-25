"""Task B, step 2: engine screening.

  python b2_screen.py quiet   [workers]   screen game positions (task-B games) for 'no tactic' with the validator's claims
  python b2_screen.py tactic  [workers]   verify reservoir puzzles (quiet last move, plies 16-60) as 'tactic exists' items

QUIET rule (all must hold):
  * validate.check_claim quiet_position(max=1) passes   (best engine line nets the mover <= +1 pawn, depth 16)
  * validate.check_claim eval_range(-80..+80) passes     (engine eval within +-0.8 pawns of equal, depth 16)
  * robustness: an independent depth-22 search also gives |eval| <= 100 cp, no mate score, and best-line net <= +1
    (guards against a tactic just beyond depth 16; the 22-ply result is not a claim, only a filter)
TACTIC rule: a2_verify.verify() logic (best_move_in + mate_in or material_after_move >= 2; no eval-only wins),
  Moves[0] (opponent's move) neither a capture nor a check, plies 16-60.
Output: out/quiet_screen.jsonl, out/tactic_screen.jsonl
"""
import sys as _s, os as _o; _s.path.insert(0, _o.path.dirname(_o.path.abspath(__file__)))
import json, random, time
import chess
from common import *
from pool import run_pool, sc

N_PER_BUCKET = 300
BUCKETS = [(16, 26), (27, 37), (38, 48), (49, 60)]


def screen_quiet(rec, eng, V):
    pos = dict(id="PQ-" + rec["gid"] + "-" + str(rec["ply"]), fen=rec["fen"], family="FAM-LQ-" + rec["gid"] + "-" + str(rec["ply"]),
               provenance=dict(kind="lichess_game", ref=f"lichess.org/{rec['gid']} ply {rec['ply']}", licence="CC0"))
    out = dict(rec, ok=False, pid=pos["id"])
    c1 = dict(id="C1", type="quiet_position", params=dict(max=1))
    r1 = V.check_claim(eng, pos, c1)
    out["quiet_measured"] = r1.get("measured"); out["quiet_score"] = r1.get("score"); out["quiet_pv"] = r1.get("pv")
    if r1["result"] != "pass":
        out["reason"] = "forcing material gain > 1 pawn in the best line"; return out
    c2 = dict(id="C2", type="eval_range", params=dict(min=-80, max=80))
    r2 = V.check_claim(eng, pos, c2)
    out["eval_measured"] = r2.get("measured")
    if r2["result"] != "pass":
        out["reason"] = "eval outside +-80 cp"; return out
    board = chess.Board(rec["fen"])
    res = eng.search(rec["fen"], depth=22)[1]
    delta, _ = V.quiet_end_delta(board, res["pv"], board.turn)
    out["d22"] = dict(kind=res["kind"], value=res["value"], delta=delta, pv=res["pv"][:6])
    if res["kind"] == "mate" or abs(res["value"]) > 100 or delta is None or delta > 1:
        out["reason"] = "not robust at depth 22"; return out
    out["claims"] = [c1, c2]
    out["ok"] = True
    return out


def verify_tactic(rec, eng, V):
    import a2_verify
    a2_verify.ENG = eng; a2_verify.V = V
    return a2_verify.verify(rec)


def main():
    mode = sys.argv[1]
    workers = int(sys.argv[2]) if len(sys.argv) > 2 else 6
    if mode == "quiet":
        rng = random.Random(f"{SEED}-quiet-screen")
        seen = set(); by_b = {i: [] for i in range(len(BUCKETS))}
        for line in open(OUT / "game_candidates.jsonl", encoding="utf-8"):
            r = json.loads(line)
            if r["task"] != "B" or r["pieces"] < 8: continue
            key = " ".join(r["fen"].split()[:4])
            if key in seen: continue
            seen.add(key)
            for i, (lo, hi) in enumerate(BUCKETS):
                if lo <= r["ply"] <= hi: by_b[i].append(r)
        jobs = []
        for i in by_b:
            rng.shuffle(by_b[i])
            # one position per game
            used_g = set(); pick = []
            for r in by_b[i]:
                if r["gid"] in used_g: continue
                used_g.add(r["gid"]); pick.append(r)
                if len(pick) >= N_PER_BUCKET: break
            jobs += pick
        # a game may appear in two buckets: keep the first
        g_seen = set(); jobs2 = []
        for r in jobs:
            if r["gid"] in g_seen: continue
            g_seen.add(r["gid"]); jobs2.append(r)
        print(f"screening {len(jobs2)} quiet candidates", flush=True)
        res = run_pool(screen_quiet, jobs2, workers=workers, log=print)
        with open(OUT / "quiet_screen.jsonl", "w", encoding="utf-8") as fh:
            for r in res: fh.write(json.dumps(r) + "\n")
        print("quiet ok:", sum(1 for r in res if r.get("ok")), "of", len(res))
    elif mode == "tactic":
        res_all = read_json(OUT / "reservoir.json")
        rng = random.Random(f"{SEED}-tactic-classify")
        cand = []
        for r in res_all:
            try:
                b = chess.Board(r["fen"]); m0 = chess.Move.from_uci(r["moves"][0])
                cap = b.is_capture(m0); chk = b.gives_check(m0)
                b.push(m0)
            except Exception:
                continue
            if cap or chk or b.is_check() or not (16 <= b.ply() <= 60): continue
            if len(b.piece_map()) < 8: continue
            cand.append(dict(r, theme="classify", tranche="classify", bin=rating_bin(r["rating"]), ply=b.ply(), pieces=len(b.piece_map())))
        rng.shuffle(cand)
        n = int(sys.argv[3]) if len(sys.argv) > 3 else 450
        cand = cand[:n]
        print(f"verifying {len(cand)} tactic candidates of {len(res_all)} reservoir puzzles", flush=True)
        res = run_pool(verify_tactic, cand, workers=workers, log=print)
        # carry ply/pieces through
        meta = {c["id"]: c for c in cand}
        with open(OUT / "tactic_screen.jsonl", "w", encoding="utf-8") as fh:
            for r in res:
                if "id" in r and r["id"] in meta:
                    r["ply"] = meta[r["id"]]["ply"]; r["pieces"] = meta[r["id"]]["pieces"]
                fh.write(json.dumps(r) + "\n")
        print("tactic ok:", sum(1 for r in res if r.get("ok")), "of", len(res))


if __name__ == "__main__":
    main()
