"""lp2 step 2b: exact tablebase stage for verdicts with 7 pieces or fewer (sequential; own cache out/l2/tb_cache.json).

For every verdict with ok and tb_needed:
  * the mover's category in the tablebase must fit the bucket (win for win-type claims, draw or win for holds);
  * the accepted set becomes the set W of ALL moves that keep that category (at most 4, else the item is ambiguous and dropped);
    each gets a `tablebase` claim; the engine's best_move_in claim is kept only if it still passes for W (re-run here);
  * 'under' items need the queen promotion to be strictly worse in the tablebase (a tablebase claim on it is added);
  * feedback: the engine's best-ranked move outside W that the tablebase shows to be worse (tablebase claim).
Reruns are idempotent (the engine-stage claims are kept in claims_engine / accepted_engine).

    python l2_tb.py
"""
import sys as _s, os as _o; _s.path.insert(0, _o.path.dirname(_o.path.abspath(__file__)))
import json, time, urllib.parse, urllib.request
from l2_common import *

CACHE = L2_OUT / "tb_cache.json"
_C = json.loads(CACHE.read_text(encoding="utf-8")) if CACHE.exists() else {}
MAP = {"win": "win", "cursed-win": "draw", "draw": "draw", "blessed-loss": "draw", "loss": "loss", "maybe-win": "win",
       "syzygy-win": "win", "maybe-loss": "loss", "syzygy-loss": "loss"}


def tb(fen):
    if fen in _C:
        return _C[fen]
    url = "https://tablebase.lichess.ovh/standard?fen=" + urllib.parse.quote(fen.replace(" ", "_"), safe="/_-")
    for attempt in range(5):
        try:
            d = json.load(urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": "chess-school-corpus-l2"}), timeout=40))
            _C[fen] = d
            time.sleep(0.2)
            return d
        except Exception as ex:
            if "400" in str(ex) or "404" in str(ex):
                _C[fen] = None
                return None
            time.sleep(1.5 * (attempt + 1))
    return None


def mover_view(cat_after):
    """category is for the side to move AFTER the move."""
    return {"win": "loss", "loss": "win", "draw": "draw"}[MAP.get(cat_after, cat_after)]


def process(v, eng, V):
    if "claims_engine" not in v:
        v["claims_engine"] = v["claims"]; v["accepted_engine"] = v.get("accepted", [])
    claims = [dict(c) for c in v["claims_engine"]]
    acc_engine = v["accepted_engine"]
    fen = v["fen"]
    b = chess.Board(fen)
    d = tb(fen)
    v["tb_checked"] = True
    if d is None:
        v["tb_result"] = "unavailable"
        if v["win_type"] == "tablebase":
            v["ok"] = False; v["reason"] = "tablebase unavailable for a tablebase-only bucket"
        else:
            v["claims"] = claims; v["accepted"] = acc_engine
        return v
    cat = MAP.get(d["category"], d["category"])
    v["tb_result"] = cat
    wt = v["win_type"]; mode = v["mode"]; L = v["lichess_move"]
    need_win = wt in ("mate", "material", "eval") or (wt == "tablebase" and mode == "tb" and "equality" not in v["themes"] and "defensiveMove" not in v["themes"])
    if mode in ("tbhold", "tbdraw"):
        need = ("draw",)
    elif need_win:
        need = ("win",)
    elif wt == "draw":
        need = ("draw",)
    else:
        need = ("draw", "win")
    if cat not in need:
        v["ok"] = False; v["reason"] = f"tablebase says {cat} for the mover (needed {'/'.join(need)})"
        return v
    rows = {x["uci"]: mover_view(x["category"]) for x in d["moves"]}
    W = [m for m, r in rows.items() if r == cat]
    if L not in W:
        v["ok"] = False; v["reason"] = "tablebase: the Lichess move does not keep the result"
        return v
    if len(W) > 4:
        v["ok"] = False; v["reason"] = f"tablebase: {len(W)} moves keep the result (ambiguous)"
        return v
    if BUCKETS[v["bucket"]]["use"] == "line" and len(W) != 1:
        v["ok"] = False; v["reason"] = "tablebase: a whole-line item needs a unique first move"
        return v
    rank = {m: i for i, (m, _s) in enumerate(v.get("top", []))}
    W.sort(key=lambda m: rank.get(m, 99))
    pos = dict(id="PL-" + v["id"], fen=fen, family="FAM-LP2-" + v["id"], provenance=dict(kind="lichess_puzzle", ref=v["id"], licence="CC0"))
    new_claims = []
    for c in claims:
        if c["type"] == "best_move_in":
            c2 = dict(c); c2["params"] = dict(c["params"], moves=W)
            r = V.check_claim(eng, pos, c2)
            if r["result"] == "pass":
                new_claims.append(c2)
            # else: dropped; the tablebase claims below carry the item
        elif c["type"] in ("mate_in", "material_after_move", "eval_range", "move_loses") or c["id"].startswith(("C",)):
            new_claims.append(c)
        else:
            new_claims.append(c)
    n = len(new_claims)
    for m in W:
        n += 1
        new_claims.append(dict(id="C%d" % n, type="tablebase", params=dict(move=m, result=cat)))
    # feedback: a move outside W that the tablebase shows to be worse
    fbk = None
    for m, _s in v.get("top", []):
        if m in W:
            continue
        r = rows.get(m)
        if r is None or r == cat or (cat == "draw" and r == "win"):
            continue
        mv = chess.Move.from_uci(m)
        if b.is_capture(mv) or b.gives_check(mv) or mv.promotion or True:
            fbk = dict(move=m, result=r, is_capture=b.is_capture(mv), gives_check=b.gives_check(mv))
            break
    if wt == "tablebase" and fbk is None:
        # an only-move position needs at least one wrong move to learn from; legal moves outside W always exist if |W| < all
        pass
    if fbk:
        n += 1
        fbk["claim"] = dict(id="C%d" % n, type="tablebase", params=dict(move=fbk["move"], result=fbk["result"]))
        new_claims.append(fbk["claim"])
    v["feedback_tb"] = fbk
    if v["mode"] == "under":
        q = v.get("queen_alt", {}).get("move")
        qr = rows.get(q)
        order = {"loss": 0, "draw": 1, "win": 2}
        if q is None or qr is None or order[qr] >= order[cat]:
            v["ok"] = False; v["reason"] = "under: the tablebase does not show the queen promotion to be worse"
            return v
        n += 1
        new_claims.append(dict(id="C%d" % n, type="tablebase", params=dict(move=q, result=qr)))
        v["queen_tb"] = qr
    v["accepted"] = W
    v["claims"] = new_claims
    if wt == "tablebase":
        v["win_type"] = "tablebase"
    v["tb_cat"] = cat
    v["feedback"] = None      # engine feedback no longer applies once the accepted set changed; the tablebase feedback is used
    return v


def main():
    from engine import Engine
    import validate as V
    eng = Engine()
    vf = L2_OUT / "verdicts.jsonl"
    vs = [json.loads(l) for l in vf.read_text(encoding="utf-8").splitlines() if l.strip()]
    n = 0; t0 = time.time()
    for i, v in enumerate(vs):
        if v.get("ok") and v.get("tb_needed") and not BUCKETS[v["bucket"]].get("off"):
            was = v["ok"]
            vs[i] = process(v, eng, V); n += 1
            if n % 25 == 0:
                CACHE.write_text(json.dumps(_C), encoding="utf-8")
                print(f"  {n} tablebase positions, {time.time() - t0:.0f}s", flush=True)
    CACHE.write_text(json.dumps(_C), encoding="utf-8")
    tmp = vf.with_suffix(".tmp")
    tmp.write_text("".join(json.dumps(v, ensure_ascii=False, default=str) + "\n" for v in vs), encoding="utf-8")
    tmp.replace(vf)
    kept = sum(1 for v in vs if v.get("ok") and v.get("tb_needed"))
    print(f"tablebase stage: {n} positions processed, {kept} kept")
    eng.close()


if __name__ == "__main__":
    main()
