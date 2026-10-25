"""lp2 (TAC.STALEMATE-TRICK), generator v2: engine first, tablebase second.

v1 (l2_stalemate_gen.py) queried the tablebase for random positions and found no hit in 47 minutes. v2 reverses the order, because the
engine is local and parallel and the tablebase service is the bottleneck:

  1. Sample constructed positions (seeded) with the weaker side to move: the weaker king near a corner or near its own piece, the
     stronger king far away, in material sets where stalemate resources exist (K+P on the 6th/7th v K+Q, K+R v K+Q, K+N v K+Q,
     K+B v K+Q, K+B+P v K+Q, K+P v K+R).  The weaker side is at least 3 points behind.
  2. Engine (depth 12, 14 workers): keep a position only if the principal variation (14 plies) reaches a stalemate.
  3. Tablebase (Lichess, <= 7 pieces, sequential): the weaker side's result is a DRAW with 1 to 3 drawing moves (not all moves), and the
     engine (depth 16) principal variation starts with a drawing move and again reaches a stalemate within 14 plies.
  4. Claims: one `tablebase` claim per accepted move (draw) and one on a wrong move that loses (feedback).  Items are written by
     l2_stalemate_gen.build (provenance 'generated', licence 'project').

What is NOT claimed: that the draw is "by stalemate" (the tablebase proves the result; the engine line only shows a stalemate on the
way), so the cue-1 siblings that name the theme are needs-human.

    python l2_stalemate_gen2.py [target=36] [max_minutes=90]      writes content/items/lp2-stalemate-1.json
"""
import sys as _s, os as _o; _s.path.insert(0, _o.path.dirname(_o.path.abspath(__file__)))
import json, random, time
from l2_common import *
import l2_tb as T
import l2_stalemate_gen as G
from pool import run_pool

CONFIGS = G.CONFIGS
CORNERS = [chess.A1, chess.H1, chess.A8, chess.H8]


def material(b, c):
    return sum(VAL[p.piece_type] for p in b.piece_map().values() if p.color == c)


def rand_pos_biased(cfg, rng):
    name, mine, theirs = cfg
    for _ in range(300):
        mover = rng.choice([chess.WHITE, chess.BLACK])
        b = chess.Board(None); b.turn = mover
        used = set()

        def free(sqs):
            sqs = [s for s in sqs if s not in used]
            return rng.choice(sqs) if sqs else None

        # weaker king: near a corner (60 %) or anywhere
        if rng.random() < 0.6:
            c = rng.choice(CORNERS)
            wk = free([s for s in chess.SQUARES if chess.square_distance(s, c) <= 1])
        else:
            wk = free(list(chess.SQUARES))
        if wk is None:
            continue
        used.add(wk); b.set_piece_at(wk, chess.Piece(chess.KING, mover))
        ok = True
        for pt, rel in mine:
            near = [s for s in chess.SQUARES if chess.square_distance(s, wk) <= 2]
            if pt == chess.PAWN:
                near = [s for s in near if (chess.square_rank(s) if mover == chess.WHITE else 7 - chess.square_rank(s)) == rel
                        and chess.square_file(s) not in (3, 4)]
            s = free(near)
            if s is None:
                ok = False; break
            used.add(s); b.set_piece_at(s, chess.Piece(pt, mover))
        if not ok:
            continue
        sk = free([s for s in chess.SQUARES if chess.square_distance(s, wk) >= 3])
        if sk is None:
            continue
        used.add(sk); b.set_piece_at(sk, chess.Piece(chess.KING, not mover))
        for pt, rel in theirs:
            s = free(list(chess.SQUARES))
            if s is None or (pt == chess.PAWN and chess.square_rank(s) in (0, 7)):
                ok = False; break
            used.add(s); b.set_piece_at(s, chess.Piece(pt, not mover))
        if not ok or not b.is_valid() or b.is_check() or b.is_game_over():
            continue
        if material(b, mover) > material(b, not mover) - 3:
            continue
        return b
    return None


def stalemate_in_pv(fen, pv, plies=14):
    bb = chess.Board(fen)
    for i, u in enumerate(pv[:plies]):
        try:
            bb.push_uci(u)
        except Exception:
            return None
        if bb.is_stalemate():
            return i + 1
    return None


def still_behind(b, pv):
    """The draw must come from the stalemate, not from equal material: at the stalemate position (end of `pv`) the weaker side (the
    side that moves first) is still at least 3 points behind."""
    weak = b.turn
    bb = b.copy()
    for u in pv:
        bb.push_uci(u)
    return material(bb, not weak) - material(bb, weak) >= 3


def probe(job, eng, V):
    cfg = CONFIGS[job["cfg"]]
    rng = random.Random(job["seed"])
    b = rand_pos_biased(cfg, rng)
    if b is None:
        return dict(ok=False, why="no position")
    res = eng.search(b.fen(), depth=12)
    pv = res[1]["pv"]
    hit = stalemate_in_pv(b.fen(), pv)
    if hit is None:
        return dict(ok=False, why="no stalemate in pv")
    return dict(ok=True, cfg=cfg[0], fen=b.fen(), pv12=pv[:hit])


def main():
    target = int(sys.argv[1]) if len(sys.argv) > 1 else 36
    max_min = float(sys.argv[2]) if len(sys.argv) > 2 else 90
    offset = int(sys.argv[3]) if len(sys.argv) > 3 else 0          # a rerun with another offset draws other positions
    t0 = time.time()
    from engine import Engine
    eng = Engine()
    found = []; seen = set(); stats = {c[0]: dict(probed=0, pv=0, draw=0, few=0, final=0) for c in CONFIGS}
    _, _, _, fen_keys = existing_content()
    batch_no = 0
    while len(found) < target and time.time() - t0 < max_min * 60:
        batch_no += 1
        jobs = [dict(cfg=i % len(CONFIGS), seed=f"{L2_SEED}-st2-{batch_no + offset}-{i}") for i in range(2800)]
        res = run_pool(probe, jobs, workers=14, log=None)
        for r in res:
            if r.get("ok"):
                stats[r["cfg"]]["pv"] += 1
        cands = [r for r in res if r.get("ok")]
        for cfg in CONFIGS:
            stats[cfg[0]]["probed"] += len(jobs) // len(CONFIGS)
        print(f"batch {batch_no}: {len(cands)} engine candidates, found {len(found)}, {time.time() - t0:.0f}s", flush=True)
        for r in cands:
            if len(found) >= target:
                break
            b = chess.Board(r["fen"])
            key = " ".join(b.fen().split()[:4])
            if key in seen or key in fen_keys:
                continue
            seen.add(key)
            d = T.tb(b.fen())
            if d is None or T.MAP.get(d["category"], d["category"]) != "draw":
                continue
            st = stats[r["cfg"]]; st["draw"] += 1
            rows = {x["uci"]: T.mover_view(x["category"]) for x in d["moves"]}
            W = [m for m, v in rows.items() if v == "draw"]
            if not (1 <= len(W) <= 3) or len(W) == len(rows):
                continue
            st["few"] += 1
            res16 = eng.search(b.fen(), depth=16)
            pv = res16[1]["pv"]
            if not pv or pv[0] not in W:
                continue
            hit = stalemate_in_pv(b.fen(), pv)
            if hit is None or not still_behind(b, pv[:hit]):
                continue
            st["final"] += 1
            wrong = None
            for m in b.legal_moves:
                if rows.get(m.uci()) == "loss" and (b.is_capture(m) or b.gives_check(m)):
                    wrong = m.uci(); break
            found.append(dict(cfg=r["cfg"], fen=b.fen(), W=sorted(W), pv=pv[:hit], wrong=wrong, deficit=material(b, not b.turn) - material(b, b.turn)))
            print(f"  found {len(found)} ({r['cfg']}) {b.fen()} draws {W}", flush=True)
        T.CACHE.write_text(json.dumps(T._C), encoding="utf-8")
    eng.close()
    print("found", len(found), "in", f"{time.time() - t0:.0f}s", stats)
    write_json(L2_OUT / (f"stalemate_found_{offset}.json" if offset else "stalemate_found.json"), found)
    merge_and_build()


def merge_and_build(cap=40):
    """Union of every stalemate_found*.json (all runs), de-duplicated by position, re-checked with still_behind (the material rule was
    added after the first run), capped at `cap`; the items are written by l2_stalemate_gen.build (seeded order)."""
    allf, seen = [], set()
    for p in sorted(L2_OUT.glob("stalemate_found*.json")):
        for f in json.loads(p.read_text(encoding="utf-8")):
            key = " ".join(f["fen"].split()[:4])
            if key in seen:
                continue
            seen.add(key)
            b = chess.Board(f["fen"])
            if still_behind(b, f["pv"]):
                allf.append(f)
    random.Random(f"{L2_SEED}-st-merge").shuffle(allf)
    # keep the material sets balanced: at most 1/3 of the items from one set
    per, out = {}, []
    for f in allf:
        if per.get(f["cfg"], 0) < max(4, cap // 3):
            out.append(f); per[f["cfg"]] = per.get(f["cfg"], 0) + 1
    out = out[:cap]
    print("merged", len(allf), "candidates ->", len(out), "items; per set:", per)
    if out:
        G.build(out)


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "merge":
        merge_and_build()
    else:
        main()
