"""lp2 step 2: re-verify every selected puzzle with the validator's own claim code (depth 16, Stockfish 19 lite, 1 thread).

For a bucket of kind 'find' (the solver's first move is the answer):
  * MultiPV 6; the Lichess move must be within 40 cp of the engine's best; accepted set = the moves within 40 cp (<= 3; for
    mates all moves that mate within n, <= 4), else the puzzle is dropped as ambiguous.
  * The win/hold claim depends on the bucket mode:
      win/mate/under/tb  mate_in, else material_after_move (min = measured net >= 2), else eval_range >= 250 cp
      hold               the above, else 'only move': eval_range not worse than -100 plus move_loses of the best alternative >= 150
      draw               eval_range within +-60 (a drawn position) plus move_loses of the best alternative >= 150
      tbhold/tbdraw      tablebase only (<= 7 pieces), decided in l2_tb.py
  * 'under' additionally requires move_loses of the queen promotion >= 150 (so the underpromotion is needed).
  * Optional feedback_by_move: the best-ranked wrong capture/check that loses >= 150 (move_loses passes).
  * Positions with 7 pieces or fewer are marked tb_needed: l2_tb.py replaces/adds exact tablebase claims.
For a bucket of kind 'foil' (a tempting move that does NOT work, e.g. Bxh7+ in a position where it fails):
  * move_loses >= 150 for the tempting move and its measured net material <= -1 (material_after_move max).
Every claim is run through validate.check_claim before it is accepted, so a verdict with ok=true will pass validate.py.

    python l2_verify.py [workers=10] [limit]      resumable; writes out/l2/verdicts.jsonl
"""
import sys as _s, os as _o; _s.path.insert(0, _o.path.dirname(_o.path.abspath(__file__)))
import json, time, multiprocessing as mp
from l2_common import *

ENG = None
V = None
DEPTH = 16


def sc(r):
    return (100000 - abs(r["value"])) * (1 if r["value"] > 0 else -1) if r["kind"] == "mate" else r["value"]


def claim(cid, typ, **params):
    return dict(id=cid, type=typ, params=params)


def init_worker():
    global ENG, V
    import validate as V_
    from engine import Engine
    V = V_
    ENG = Engine()


def run_claim(pos, c):
    return V.check_claim(ENG, pos, c)


def eval_claim(mover, kind):
    """Claim params for 'the mover is at least +250' / 'not worse than -100' / 'drawn' from White's point of view."""
    if kind == "win":
        return {"min": 250} if mover else {"max": -250}
    if kind == "hold":
        return {"min": -100} if mover else {"max": 100}
    return {"min": -60, "max": 60}


def derive_win(pos, mover, L, accepted, top, best, is_mate, n_mate, mode, out):
    """Returns (win_type, claims) or (None, None) after writing out['reason']."""
    claims = []
    if is_mate:
        c = claim("C2", "mate_in", move=L, n=n_mate)
        r = run_claim(pos, c)
        if r["result"] == "pass":
            out["measured_win"] = r["measured"]
            return "mate", [c]
        out["reason"] = "mate_in failed on re-check"; out["detail"] = r.get("measured")
        return None, None
    if mode == "draw":
        c = claim("C2", "eval_range", **eval_claim(mover, "draw"))
        r = run_claim(pos, c)
        alts = [(m, s) for m, s, _ in top if m not in accepted]
        if r["result"] != "pass":
            out["reason"] = "draw: position not within +-60 cp"; out["detail"] = r.get("measured"); return None, None
        if not alts or best - alts[0][1] < 150:
            out["reason"] = "draw: no alternative loses by >= 150 cp (not an only-move draw)"; return None, None
        am, asc = alts[0]
        cp = int(min(best - asc, 1000) // 50 * 50)
        c3 = claim("C3", "move_loses", move=am, cp=cp)
        r3 = run_claim(pos, c3)
        if r3["result"] != "pass":
            out["reason"] = "draw: move_loses failed"; return None, None
        out["measured_win"] = r["measured"]; out["only_move_alt"] = am
        return "draw", [c, c3]
    rm = run_claim(pos, claim("X", "material_after_move", move=L, min=-999))
    delta = (rm.get("measured") or {}).get("net_material")
    out["material_probe"] = delta; out["pv_after"] = rm.get("pv")
    if delta is not None and delta >= 2:
        c = claim("C2", "material_after_move", move=L, min=int(delta))
        # the probe uses min=-999, so the validator's dead-draw safeguard (min > 0) has not run: replay the engine line and apply it here
        dead = False
        mt = rm.get("measured") or {}
        try:
            if mt.get("game_over"):
                bb = chess.Board(pos["fen"]); bb.push(chess.Move.from_uci(L)); dead = not bb.is_checkmate()
            else:
                bb = chess.Board(pos["fen"])
                for u in (rm.get("pv") or [])[:12]:
                    bb.push_uci(u)
                dead = bb.is_insufficient_material()
        except Exception:
            dead = True
        if not dead:
            out["measured_win"] = rm["measured"]; out["win_probe_only"] = True
            return "material", [c]
        out["material_fail"] = "material is won but the result is a dead draw"
    if best >= 250:
        c = claim("C2", "eval_range", **eval_claim(mover, "win"))
        r = run_claim(pos, c)
        if r["result"] == "pass":
            out["measured_win"] = r["measured"]
            return "eval", [c]
    if mode == "hold":
        alts = [(m, s) for m, s, _ in top if m not in accepted]
        if best >= -100 and alts:
            am, asc = alts[0]
            loss = best - asc
            if loss >= 150:
                cp = int(min(loss, 1000) // 50 * 50)
                c2 = claim("C2", "eval_range", **eval_claim(mover, "hold"))
                c3 = claim("C3", "move_loses", move=am, cp=cp)
                r2 = run_claim(pos, c2); r3 = run_claim(pos, c3)
                if r2["result"] == "pass" and r3["result"] == "pass":
                    out["measured_win"] = dict(eval=r2["measured"], loses=r3["measured"]); out["only_move_alt"] = am
                    return "only_move", [c2, c3]
    out["reason"] = "no win claim: neither mate, material >= 2, eval >= 250" + (", nor an only-move hold" if mode == "hold" else "") + " for the mover"
    out["detail"] = dict(material_probe=delta, best_cp=best, material_fail=out.get("material_fail"))
    return None, None


def feedback_move(b, pos, top, accepted, skip):
    for m, s, _ in top:
        if m in accepted or m == skip:
            continue
        mv = chess.Move.from_uci(m)
        if b.is_capture(mv) or b.gives_check(mv) or mv.promotion:
            cm = claim("F1", "move_loses", move=m, cp=0)
            rr = run_claim(pos, cm)
            loss = (rr.get("measured") or {}).get("loss_cp")
            if loss is not None and loss >= 150:
                cp = int(min(loss, 1000) // 50 * 50)
                cm = claim("F1", "move_loses", move=m, cp=cp)
                return dict(move=m, cp=cp, loss_measured=loss, is_capture=b.is_capture(mv), gives_check=b.gives_check(mv), claim=cm)
        break
    return None


def line_forcedness(b, sol, depth=14):
    """For every opponent reply in the Lichess line: (is_best, gap_to_second_cp or None if the only legal move)."""
    out = []
    bb = b.copy(stack=False)
    for i, u in enumerate(sol):
        mv = chess.Move.from_uci(u)
        if i % 2 == 1:
            nl = bb.legal_moves.count()
            if nl == 1:
                out.append(dict(ply=i, best=True, gap=None, legal=1))
            else:
                res = ENG.search(bb.fen(), depth=depth, multipv=min(3, nl))
                best = sc(res[1])
                m1 = res[1]["pv"][0]
                gap = best - sc(res[2]) if 2 in res else 99999
                out.append(dict(ply=i, best=(m1 == u), gap=gap, legal=nl))
        bb.push(mv)
    return out


def line_check(b, sol, depth=DEPTH, gap_min=40):
    """Every ply of the Lichess line must be the engine's best move at depth 16, with a gap of at least `gap_min` cp to the second
    best (or be the only legal move). Returns (ok, info)."""
    bb = b.copy(stack=False); info = []
    for i, u in enumerate(sol):
        nl = bb.legal_moves.count()
        if nl == 1:
            info.append(dict(ply=i, only=True))
        else:
            res = ENG.search(bb.fen(), depth=depth, multipv=min(3, nl))
            best = sc(res[1]); gap = best - sc(res[2]) if 2 in res else 99999
            if res[1]["pv"][0] != u:
                return False, dict(ply=i, why="not the engine's best move", engine=res[1]["pv"][0])
            if gap < gap_min:
                return False, dict(ply=i, why=f"second best within {gap} cp")
            info.append(dict(ply=i, gap=gap))
        bb.push(chess.Move.from_uci(u))
    return True, info


def verify(rec):
    t0 = time.time()
    bk = BUCKETS[rec["bucket"]]
    out = dict(id=rec["id"], bucket=rec["bucket"], node=bk["node"], kind=bk["kind"], mode=bk["mode"], rating=rec["rating"], rd=rec["rd"],
               plays=rec["plays"], pop=rec["pop"], q=rec["q"], themes=rec["themes"], bin=rec["bin"], ok=False)
    try:
        b = chess.Board(rec["fen"])
        m0 = chess.Move.from_uci(rec["moves"][0])
        if m0 not in b.legal_moves:
            out["reason"] = "invalid: first move illegal"; return out
        b.push(m0)
        sol = rec["moves"][1:]
        if not b.is_valid() or b.is_game_over() or not sol:
            out["reason"] = "invalid: position"; return out
        bb = b.copy()
        for u in sol:
            mv = chess.Move.from_uci(u)
            if mv not in bb.legal_moves:
                out["reason"] = "invalid: solution illegal"; return out
            bb.push(mv)
        fen = b.fen()
        pos = dict(id="PL-" + rec["id"], fen=fen, family="FAM-LP2-" + rec["id"], provenance=dict(kind="lichess_puzzle", ref=rec["id"], licence="CC0"))
        mover = b.turn
        L = sol[0]
        npieces = len(b.piece_map())
        out.update(fen=fen, solver="white" if mover else "black", lichess_move=L, solution=sol, npieces=npieces)

        if bk["kind"] == "foil":
            return verify_foil(rec, bk, b, pos, out, t0)

        mode = bk["mode"]
        is_mate = mode == "mate" or any(t == "mate" or t.startswith("mateIn") for t in rec["themes"])
        n_mate = (len(sol) + 1) // 2
        out.update(is_mate_puzzle=is_mate, mate_n=n_mate if is_mate else None)
        res = ENG.search(fen, depth=DEPTH, multipv=min(6, b.legal_moves.count()))
        best = sc(res[1]); top = [(r["pv"][0], sc(r), r) for _, r in sorted(res.items())]
        out["engine_best"] = res[1]["pv"][0]; out["engine_best_cp"] = best
        lscore = next((s for m, s, _ in top if m == L), None)
        if lscore is None or best - lscore > 40:
            out["reason"] = "engine disagrees: Lichess move not within 40 cp of engine best"
            out["detail"] = dict(engine_best=res[1]["pv"][0], best_cp=best, lichess_cp=lscore); return out
        window = [m for m, s, _ in top if best - s <= 40]
        if is_mate:
            def md(r): return r["value"] if r["kind"] == "mate" and r["value"] > 0 else None
            accepted = [m for m, s, r in top if md(r) is not None and md(r) <= n_mate]
            if L not in accepted:
                out["reason"] = "mate not confirmed: Lichess move does not mate within n at depth 16"; out["detail"] = dict(n=n_mate); return out
            cap = 4
        else:
            accepted = window; cap = 3 if mode not in ("tbhold", "tbdraw") else 4
        if len(accepted) > cap:
            out["reason"] = f"ambiguous: {len(accepted)} moves within 40 cp / mate distance"; out["detail"] = dict(accepted=accepted); return out
        out["accepted"] = accepted
        out["top"] = [(m, s) for m, s, _ in top]

        claims = []
        c1 = claim("C1", "best_move_in", moves=accepted, within_cp=40)
        r1 = run_claim(pos, c1)
        if r1["result"] != "pass":
            out["reason"] = "best_move_in failed on re-check"; out["detail"] = r1.get("measured"); return out
        claims.append(c1)

        tb_only = mode in ("tbhold", "tbdraw")
        if tb_only and npieces > 7:
            out["reason"] = "tablebase-only bucket but more than 7 pieces"; return out
        if tb_only:
            out["win_type"] = "tablebase"; out["tb_needed"] = True
            win_type = "tablebase"
        else:
            use_mode = mode
            if mode == "tb" and ("equality" in rec["themes"] or "defensiveMove" in rec["themes"]):
                use_mode = "hold"
            win_type, wc = derive_win(pos, mover, L, accepted, top, best, is_mate, n_mate, use_mode if use_mode in ("draw", "hold") else "win", out)
            if win_type is None:
                if npieces <= 7 and mode in ("tb", "under"):
                    win_type = "tablebase"; wc = []; out["win_type_note"] = "engine claim absent; tablebase decides"
                else:
                    return out
            claims += wc
            out["win_type"] = win_type
            out["tb_needed"] = npieces <= 7

        if mode == "under":
            queen = chess.Move.from_uci(L[:4] + "q")
            if queen not in b.legal_moves or not chess.Move.from_uci(L).promotion or chess.Move.from_uci(L).promotion == chess.QUEEN:
                out["reason"] = "under: first move is not an underpromotion"; return out
            cq = claim("C%d" % (len(claims) + 1), "move_loses", move=queen.uci(), cp=0)
            rq = run_claim(pos, cq)
            loss = (rq.get("measured") or {}).get("loss_cp")
            if loss is None or loss < 150:
                out["reason"] = "under: promoting to a queen is not at least 150 cp worse"; out["detail"] = dict(loss=loss); return out
            cq["params"]["cp"] = int(min(loss, 1000) // 50 * 50)
            claims.append(cq); out["queen_alt"] = dict(move=queen.uci(), cp=cq["params"]["cp"], loss_measured=loss)

        if bk["use"] == "line":
            if accepted != [L]:
                out["reason"] = "line: more than one accepted first move"; return out
            ok_l, info = line_check(b, sol)
            out["line_info"] = info
            if not ok_l:
                out["reason"] = "line: " + info["why"] + f" at ply {info['ply']}"; return out

        if rec["bucket"] == "INI.INITIATIVE":
            lf = line_forcedness(b, sol)
            out["line_forced"] = lf
            if any((not x["best"]) or (x["gap"] is not None and x["gap"] < 100) for x in lf):
                out["reason"] = "initiative: an opponent reply is not clearly forced"; return out

        if rec["bucket"] == "DEF.COUNTER":
            nb = b.copy(stack=False); nb.push(chess.Move.null())
            mates = []
            for m in nb.legal_moves:
                nb.push(m)
                if nb.is_checkmate(): mates.append(m.uci())
                nb.pop()
            if not mates:
                out["reason"] = "counter: no opponent mate in one after a null move"; return out
            cm = claim("C%d" % (len(claims) + 1), "mate_in", move=sorted(mates)[0], n=1, null_move_first=True)
            if run_claim(pos, cm)["result"] != "pass":
                out["reason"] = "counter: threat claim failed"; return out
            claims.append(cm)
            out["threat_mate_moves"] = sorted(mates); out["threat_claim"] = cm

        fb = feedback_move(b, pos, top, accepted, out.get("only_move_alt")) if not tb_only else None
        out["feedback"] = fb
        out["claims"] = claims
        out["ok"] = True
        out["secs"] = round(time.time() - t0, 1)
        return out
    except Exception as ex:
        out["reason"] = f"error: {type(ex).__name__}: {ex}"
        return out


def verify_foil(rec, bk, b, pos, out, t0):
    """A tempting move that does not work (Greek-gift look-alike)."""
    T = next((m for m in b.legal_moves if bk["fn"].__name__ == "b_greek_fails" and _greek(b, m)), None)
    if T is None:
        out["reason"] = "foil: no candidate move"; return out
    ucit = T.uci()
    res = ENG.search(b.fen(), depth=DEPTH, multipv=min(4, b.legal_moves.count()))
    best = sc(res[1]); out["engine_best"] = res[1]["pv"][0]; out["engine_best_cp"] = best
    if res[1]["pv"][0] == ucit:
        out["reason"] = "foil: the tempting move is the engine's best"; return out
    cm = claim("C1", "move_loses", move=ucit, cp=0)
    rr = run_claim(pos, cm)
    loss = (rr.get("measured") or {}).get("loss_cp")
    if loss is None or loss < 200:
        out["reason"] = "foil: the tempting move does not lose >= 200 cp"; out["detail"] = dict(loss=loss); return out
    cm["params"]["cp"] = int(min(loss, 1000) // 50 * 50)
    if run_claim(pos, cm)["result"] != "pass":
        out["reason"] = "foil: move_loses recheck failed"; return out
    rm = run_claim(pos, claim("X", "material_after_move", move=ucit, min=-999))
    delta = (rm.get("measured") or {}).get("net_material")
    if delta is None or delta > -1:
        out["reason"] = "foil: the tempting move does not lose material along the engine line"; out["detail"] = dict(delta=delta); return out
    cmat = claim("C2", "material_after_move", move=ucit, max=int(delta))
    if run_claim(pos, cmat)["result"] != "pass":
        out["reason"] = "foil: material recheck failed"; return out
    out.update(foil_move=ucit, foil_loss=loss, foil_net=int(delta), claims=[cm, cmat], win_type="foil", ok=True, accepted=[],
               tb_needed=False, feedback=None, secs=round(time.time() - t0, 1))
    return out


def _greek(b, m):
    if b.piece_type_at(m.from_square) != chess.BISHOP or not b.is_capture(m):
        return False
    return m.to_square == (chess.H7 if b.turn == chess.WHITE else chess.H2) and b.gives_check(m)


def main():
    workers = int(sys.argv[1]) if len(sys.argv) > 1 else 10
    limit = int(sys.argv[2]) if len(sys.argv) > 2 else None
    sel = read_json(L2_OUT / "selection.json")["puzzles"]
    vf = L2_OUT / "verdicts.jsonl"
    done = set()
    if vf.exists():
        for line in vf.read_text(encoding="utf-8").splitlines():
            if line.strip():
                done.add(json.loads(line)["id"])
    todo = [r for r in sel if r["id"] not in done and BUCKETS[r["bucket"]]["use"] != "viz" and not BUCKETS[r["bucket"]].get("off")]
    if limit:
        todo = todo[:limit]
    print(f"{len(todo)} puzzles to verify, {len(done)} already done, workers={workers}", flush=True)
    t0 = time.time(); ok = 0
    with mp.Pool(workers, initializer=init_worker) as pool, open(vf, "a", encoding="utf-8") as fh:
        for i, res in enumerate(pool.imap_unordered(verify, todo, chunksize=1), 1):
            fh.write(json.dumps(res, ensure_ascii=False, default=str) + "\n"); fh.flush()
            ok += res["ok"]
            if i % 50 == 0:
                print(f"  {i}/{len(todo)} done, ok so far {ok}, {time.time() - t0:.0f}s", flush=True)
    print(f"finished {len(todo)} in {time.time() - t0:.0f}s, ok {ok}")


if __name__ == "__main__":
    main()
