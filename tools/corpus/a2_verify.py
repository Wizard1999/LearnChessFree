"""Task A step 2: re-verify every sampled Lichess puzzle with the project validator's own claim code.

For each puzzle (position = FEN after the opponent's first move, solver = side to move):
  1. MultiPV 6 at depth 16 (the validator's depth) -> engine best move and the moves within 40 cp of it.
  2. The Lichess solution move must be inside that 40 cp window (else the puzzle is dropped as 'engine disagrees').
  3. The accepted set = all window moves (max 3; for mates: all moves that mate within n, max 4); more -> 'ambiguous'.
  4. A win claim is derived, in this order, from the validator's claim types:
        mate puzzle  -> mate_in(move, n)
        otherwise    -> material_after_move(min = measured net material, must be >= 2)
        else         -> eval_range (|eval| >= 250 cp for the mover)
        defensiveMove only: 'only-move' defence = eval_range (not worse than -100 for the mover) + move_loses of the
                           engine's best alternative (>= 150 cp worse). This is reported separately from the strict rule.
  5. Every claim is run through validate.check_claim (the very function tools/validate.py uses) before it is accepted,
     so a verdict 'ok' means the validator will pass it (engine search at fixed depth is deterministic).
  6. Optional feedback: the highest-ranked non-accepted capture/check that loses >= 150 cp (move_loses claim).

Usage: python a2_verify.py primary|reserve [workers=6]
Output: out/verdicts.jsonl (one JSON per puzzle; resumable).
"""
import sys as _s, os as _o; _s.path.insert(0, _o.path.dirname(_o.path.abspath(__file__)))
import json, time, multiprocessing as mp
import chess
from common import *

ENG = None
DEPTH = 16


def sc(r):
    return (100000 - abs(r["value"])) * (1 if r["value"] > 0 else -1) if r["kind"] == "mate" else r["value"]


def init_worker():
    global ENG, V
    import validate as V_
    from engine import Engine
    V = V_
    ENG = Engine()


def claim(cid, typ, **params):
    return dict(id=cid, type=typ, params=params)


def run_claim(pos, c):
    r = V.check_claim(ENG, pos, c)
    return r


def verify(rec):
    t0 = time.time()
    out = dict(id=rec["id"], theme=rec["theme"], tranche=rec["tranche"], rating=rec["rating"], rd=rec["rd"], plays=rec["plays"],
               pop=rec["pop"], themes=rec["themes"], bin=rec["bin"], ok=False)
    try:
        b = chess.Board(rec["fen"])
        m0 = chess.Move.from_uci(rec["moves"][0])
        if m0 not in b.legal_moves:
            out["reason"] = "invalid: first move illegal"; return out
        b.push(m0)
        sol = rec["moves"][1:]
        if not b.is_valid() or b.is_game_over() or not sol:
            out["reason"] = "invalid: position"; return out
        # solution legality along the line
        bb = b.copy()
        for u in sol:
            mv = chess.Move.from_uci(u)
            if mv not in bb.legal_moves:
                out["reason"] = "invalid: solution illegal"; return out
            bb.push(mv)
        fen = b.fen()
        pos = dict(id="PL-" + rec["id"], fen=fen, family="FAM-LP-" + rec["id"], provenance=dict(kind="lichess_puzzle", ref=rec["id"], licence="CC0"))
        mover = b.turn
        L = sol[0]
        is_mate = any(t == "mate" or t.startswith("mateIn") for t in rec["themes"])
        n_mate = (len(sol) + 1) // 2
        out.update(fen=fen, solver="white" if mover else "black", lichess_move=L, solution=sol, is_mate_puzzle=is_mate, mate_n=n_mate if is_mate else None)

        res = ENG.search(fen, depth=DEPTH, multipv=min(6, b.legal_moves.count()))
        best = sc(res[1]); top = [(r["pv"][0], sc(r), r) for _, r in sorted(res.items())]
        out["engine_best"] = res[1]["pv"][0]; out["engine_best_cp"] = best
        out["agrees"] = res[1]["pv"][0] == L
        lscore = next((s for m, s, _ in top if m == L), None)
        if lscore is None or best - lscore > 40:
            out["reason"] = "engine disagrees: Lichess move not within 40 cp of engine best"
            out["detail"] = dict(engine_best=res[1]["pv"][0], best_cp=best, lichess_cp=lscore)
            return out
        window = [m for m, s, _ in top if best - s <= 40]
        if is_mate:
            def mate_dist(r): return r["value"] if r["kind"] == "mate" and r["value"] > 0 else None
            accepted = [m for m, s, r in top if mate_dist(r) is not None and mate_dist(r) <= n_mate]
            if L not in accepted:
                out["reason"] = "mate not confirmed: Lichess move does not mate within n at depth 16"
                out["detail"] = dict(n=n_mate, lichess_cp=lscore); return out
            cap = 4
        else:
            accepted = window; cap = 3
        if len(accepted) > cap:
            out["reason"] = f"ambiguous: {len(accepted)} moves within 40 cp / mate distance"
            out["detail"] = dict(accepted=accepted); return out
        out["accepted"] = accepted

        claims = []
        c1 = claim("C1", "best_move_in", moves=accepted, within_cp=40)
        r1 = run_claim(pos, c1)
        if r1["result"] != "pass":
            out["reason"] = "best_move_in failed on re-check"; out["detail"] = r1.get("measured"); return out
        claims.append(c1)
        win_type = None
        if is_mate:
            c2 = claim("C2", "mate_in", move=L, n=n_mate)
            r2 = run_claim(pos, c2)
            if r2["result"] == "pass":
                win_type = "mate"; claims.append(c2); out["measured_win"] = r2["measured"]
            else:
                out["reason"] = "mate_in failed on re-check"; out["detail"] = r2.get("measured"); return out
        else:
            rm = run_claim(pos, claim("X", "material_after_move", move=L, min=-999))
            delta = (rm.get("measured") or {}).get("net_material")
            out["material_probe"] = delta
            out["pv_after"] = rm.get("pv")
            if delta is not None and delta >= 2:
                c2 = claim("C2", "material_after_move", move=L, min=int(delta))
                r2 = run_claim(pos, c2)
                if r2["result"] == "pass":
                    win_type = "material"; claims.append(c2); out["measured_win"] = r2["measured"]
                else:
                    out["material_fail"] = r2.get("reason") or r2.get("measured")
            if win_type is None:
                # eval-based win from the mover's point of view
                if best >= 250:
                    c2 = claim("C2", "eval_range", **({"min": 250} if mover else {"max": -250}))
                    r2 = run_claim(pos, c2)
                    if r2["result"] == "pass":
                        win_type = "eval"; claims.append(c2); out["measured_win"] = r2["measured"]
            if win_type is None and rec["theme"] == "defensiveMove":
                # only-move defence: not worse than -100 for the mover, and the best alternative is >= 150 cp worse
                alts = [(m, s, r) for m, s, r in top if m not in accepted]
                if best >= -100 and alts:
                    am, asc, _ = alts[0]
                    loss = best - asc
                    if loss >= 150:
                        cp = int(min(loss, 1000) // 50 * 50)
                        c2 = claim("C2", "eval_range", **({"min": -100} if mover else {"max": 100}))
                        c3 = claim("C3", "move_loses", move=am, cp=cp)
                        r2 = run_claim(pos, c2); r3 = run_claim(pos, c3)
                        if r2["result"] == "pass" and r3["result"] == "pass":
                            win_type = "only_move"; claims += [c2, c3]; out["measured_win"] = dict(eval=r2["measured"], loses=r3["measured"])
                            out["only_move_alt"] = am
            if win_type is None:
                out["reason"] = "no win claim: neither mate, material >= 2 nor eval >= 250 for the mover"
                out["detail"] = dict(material_probe=delta, best_cp=best, material_fail=out.get("material_fail")); return out
        out["win_type"] = win_type

        # optional feedback: tempting wrong move = best-ranked non-accepted capture or check that loses >= 150 cp
        fb = None
        for m, s, _ in top:
            if m in accepted or m == out.get("only_move_alt"):
                continue
            mv = chess.Move.from_uci(m)
            if b.is_capture(mv) or b.gives_check(mv):
                cm = claim("F1", "move_loses", move=m, cp=0)
                rr = run_claim(pos, cm)
                loss = (rr.get("measured") or {}).get("loss_cp")
                if loss is not None and loss >= 150:
                    cp = int(min(loss, 1000) // 50 * 50)
                    cm = claim("F1", "move_loses", move=m, cp=cp)
                    if run_claim(pos, cm)["result"] == "pass":
                        fb = dict(move=m, cp=cp, loss_measured=loss, is_capture=b.is_capture(mv), gives_check=b.gives_check(mv), claim=cm)
                break    # only the first non-accepted capture/check is considered
        out["feedback"] = fb
        out["claims"] = claims
        out["ok"] = True
        out["secs"] = round(time.time() - t0, 1)
        return out
    except Exception as ex:
        out["reason"] = f"error: {type(ex).__name__}: {ex}"
        return out


def main():
    tranche = sys.argv[1] if len(sys.argv) > 1 else "primary"
    workers = int(sys.argv[2]) if len(sys.argv) > 2 else 6
    sel = read_json(OUT / "selection.json")["puzzles"]
    vf = OUT / "verdicts.jsonl"
    done = set()
    if vf.exists():
        for line in vf.read_text(encoding="utf-8").splitlines():
            if line.strip(): done.add(json.loads(line)["id"])
    todo = [r for r in sel if r["tranche"] == tranche and r["id"] not in done]
    if len(sys.argv) > 3: todo = todo[:: max(1, len(todo) // int(sys.argv[3]))][: int(sys.argv[3])]
    print(f"{len(todo)} puzzles to verify ({tranche}), {len(done)} already done, workers={workers}", flush=True)
    t0 = time.time(); ok = 0
    with mp.Pool(workers, initializer=init_worker) as pool, open(vf, "a", encoding="utf-8") as fh:
        for i, res in enumerate(pool.imap_unordered(verify, todo, chunksize=1), 1):
            fh.write(json.dumps(res, ensure_ascii=False) + "\n"); fh.flush()
            ok += res["ok"]
            if i % 25 == 0:
                print(f"  {i}/{len(todo)} done, ok so far {ok}, {time.time() - t0:.0f}s", flush=True)
    print(f"finished {len(todo)} in {time.time() - t0:.0f}s, ok {ok}")


if __name__ == "__main__":
    main()
