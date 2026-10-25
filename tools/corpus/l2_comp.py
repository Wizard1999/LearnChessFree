"""lp2 (INI.COMPENSATION): "is the side to move at least level although it is down material?" from real games.

Source: tools/corpus/out/game_candidates.jsonl (Lichess 2013-01 CC0 sample, rated 1600+, last move neither a capture nor a check),
positions that are NOT used by the quiet/threat items of the first corpus. Rules-only screen: the side to move is down at least
2 points of material (pawn 1, minor 3, rook 5, queen 9), is not in check, has no loose piece. Engine screen (depth 14), then the
exact claims are checked at depth 16 with the validator's own code:
  COMPENSATION  eval_range: not worse than -0.3 pawns for the side to move   + quiet_position (max 1): the best line does not win
                more than a pawn back, so the compensation is not just a hidden recapture
  NONE          eval_range: at least 2.5 pawns worse for the side to move    + quiet_position (max 1)
Both classes are matched on the material deficit (2-3, 4-5, 6+) and on game phase, so the deficit alone does not answer the question.
Items are `classify_position`, 15 + 15 per run of 30, review machine-only: every shown statement is an engine claim.

    python l2_comp.py screen 6     (engine screen, resumable)   |   python l2_comp.py build
"""
import sys as _s, os as _o; _s.path.insert(0, _o.path.dirname(_o.path.abspath(__file__)))
import json, random, time
from l2_common import *

CAND = OUT / "game_candidates.jsonl"
SCREEN = L2_OUT / "comp_screen.jsonl"
SIDE = {chess.WHITE: "White", chess.BLACK: "Black"}


def material(b, c):
    return sum(VAL[p.piece_type] for p in b.piece_map().values() if p.color == c)


def used_gids():
    """Games already used by the quiet / threat items of the first corpus (their positions carry the game id in provenance)."""
    used = set()
    for f in ITEMS_DIR.glob("*.json"):
        if f.name.startswith(PREFIX):
            continue
        try:
            d = json.loads(f.read_text(encoding="utf-8"))
        except Exception:
            continue
        for p in d.get("positions", []):
            ref = (p.get("provenance") or {}).get("ref", "")
            if "lichess.org/" in ref and p["provenance"].get("kind") == "lichess_game":
                used.add(ref.split("lichess.org/")[1].split(" ")[0])
    return used


def candidates():
    used = used_gids()
    rng = random.Random(f"{L2_SEED}-comp")
    rows = []
    with open(CAND, encoding="utf-8") as fh:
        for line in fh:
            d = json.loads(line)
            if d["gid"] in used:
                continue
            b = chess.Board(d["fen"])
            if b.is_check() or d.get("loose"):
                continue
            deficit = material(b, not b.turn) - material(b, b.turn)
            if deficit < 2:
                continue
            rows.append(dict(gid=d["gid"], ply=d["ply"], fen=b.fen(), deficit=deficit, pieces=len(b.piece_map()), elo=(d["white_elo"] + d["black_elo"]) // 2))
    rng.shuffle(rows)
    return rows


def screen_one(row, eng, V):
    b = chess.Board(row["fen"])
    res = eng.search(b.fen(), depth=14)
    r = res[1]
    mover_cp = r["value"] if r["kind"] == "cp" else (100000 if r["value"] > 0 else -100000)
    row = dict(row, cp14=mover_cp, pv=r["pv"][:6])
    return row


def pawns(cp):
    return f"{cp / 100:g}"


def verify_job(job, eng, V):
    b = chess.Board(job["fen"]); mover = b.turn
    pos = dict(id="PG-X", fen=b.fen(), family="F", provenance=dict(kind="lichess_game", ref="x", licence="CC0"))
    ev = {"min": -30} if mover else {"max": 30}
    if job["kind"] == "none":
        ev = {"max": -250} if mover else {"min": 250}
    claims = [dict(id="C1", type="eval_range", params=ev), dict(id="C2", type="quiet_position", params=dict(max=1))]
    for c in claims:
        r = V.check_claim(eng, pos, c)
        if r["result"] != "pass":
            return dict(job, ok=False, why=c["type"])
    return dict(job, ok=True, claims=claims)


def build():
    """Verify the promising screened positions at depth 16 with the validator's code, balance the classes and write lp2-comp-1.json."""
    import multiprocessing as mp
    from pool import run_pool
    screened = [json.loads(l) for l in SCREEN.read_text(encoding="utf-8").splitlines() if l.strip()]
    _, _, _, fen_keys = existing_content()
    comp = [r for r in screened if r["cp14"] >= -40 and r["cp14"] < 100000]
    none = [r for r in screened if r["cp14"] <= -250 and r["cp14"] > -100000]
    print(len(screened), "screened;", len(comp), "compensation candidates;", len(none), "clearly-worse candidates", flush=True)

    def dbucket(r):
        return 0 if r["deficit"] <= 3 else 1 if r["deficit"] <= 5 else 2

    def phase(r):
        return 0 if r["pieces"] <= 16 else 1
    rng = random.Random(f"{L2_SEED}-comp-build")
    rng.shuffle(comp); rng.shuffle(none)
    # take candidates alternately by (deficit bucket, phase) cell so that the two classes are matched cell by cell
    by_c = {}; by_n = {}
    for r in comp: by_c.setdefault((dbucket(r), phase(r)), []).append(r)
    for r in none: by_n.setdefault((dbucket(r), phase(r)), []).append(r)
    take = []
    for cell in sorted(set(by_c) & set(by_n)):
        k = min(len(by_c[cell]), len(by_n[cell]), 100)
        take += [("comp", r) for r in by_c[cell][:k]] + [("none", r) for r in by_n[cell][:k]]
    jobs = [dict(kind=k, **r) for k, r in take]
    print(len(jobs), "jobs", flush=True)

    results = run_pool(verify_job, jobs, workers=int(sys.argv[2]) if len(sys.argv) > 2 else 6, log=None)
    good = [r for r in results if r.get("ok")]
    print(len(good), "verified of", len(jobs), flush=True)
    # balance 1:1 per cell
    final = []
    for cell in sorted({(dbucket(r), phase(r)) for r in good}):
        c = [r for r in good if r["kind"] == "comp" and (dbucket(r), phase(r)) == cell]
        n = [r for r in good if r["kind"] == "none" and (dbucket(r), phase(r)) == cell]
        k = min(len(c), len(n))
        final += c[:k] + n[:k]
    rng.shuffle(final)
    final = final[:30] if len(final) >= 30 else final
    positions, items = [], []
    seen = set()
    for r in final:
        b = chess.Board(r["fen"])
        key = " ".join(b.fen().split()[:4])
        if key in fen_keys or key in seen:
            continue
        seen.add(key)
        side = SIDE[b.turn]
        pid = f"PL2-G-{r['gid']}-{r['ply']}"
        positions.append({"id": pid, "fen": b.fen(), "family": f"FAM-LP2-G-{r['gid']}-{r['ply']}",
                          "provenance": {"kind": "lichess_game", "ref": f"lichess.org/{r['gid']} (Lichess 2013-01 sample), position after ply {r['ply']}", "licence": "CC0"}})
        claims = [dict(c) for c in r["claims"]]
        if r["kind"] == "comp":
            claims[0]["statement"] = f"The engine does not rate this position worse than 0.3 pawns for {side} (depth 16)."
            outcome = "At least level"
        else:
            claims[0]["statement"] = f"The engine rates this position at least 2.5 pawns worse for {side} (depth 16)."
            outcome = "Clearly worse"
        claims[1]["statement"] = f"The best line does not win more than 1 point of material back for {side} (depth 16): the verdict is not a hidden recapture."
        items.append({
            "id": f"IL2-G-{r['gid']}-{r['ply']}", "skill": "INI.COMPENSATION.D2", "cue": 3, "task": "classify_position", "position": pid,
            "prompt": f"{side} to move. Count the material first, then judge the position: is {side} at least level, or clearly worse?",
            "options": ["At least level", "Clearly worse"], "answer": {"class": outcome},
            "claims": claims, "tags": ["theme.compensation", "node.INI.COMPENSATION", "kind.game", f"tier.{tier_l2(r['elo'])}", "cue.3", "lang.en", "kind.decision"],
            "hints": ["Count the material for both sides before anything else.",
                      "Which side has the more active pieces, the safer king, the open lines? Is there anything that wins the material back by force?",
                      "Material is only the first count: ask what the side that is down can do next move, and what the other side can do about it."],
            "explain": claims[0]["statement"] + " " + claims[1]["statement"] + " The answer is the engine's verdict at a fixed depth, not a proof.",
            "orientation": "white" if b.turn else "black",
            "review": {"status": "machine-only", "reviewer": None},
        })
    tmp = ITEMS_DIR / (PREFIX + "ini-1.json.tmp")
    tmp.write_text(json.dumps({"positions": positions, "items": items}, indent=1, ensure_ascii=False), encoding="utf-8")
    tmp.replace(ITEMS_DIR / (PREFIX + "ini-1.json"))
    print("wrote", PREFIX + "ini-1.json", len(items), "items;", sum(1 for i in items if i["answer"]["class"] == "At least level"), "level /", sum(1 for i in items if i["answer"]["class"] == "Clearly worse"), "worse")


def main():
    cmd = sys.argv[1] if len(sys.argv) > 1 else "screen"
    if cmd == "screen":
        from pool import run_pool
        workers = int(sys.argv[2]) if len(sys.argv) > 2 else 6
        rows = candidates()
        print(len(rows), "rules-screened candidates", flush=True)
        # screen a seeded subset in the order of the shuffle until enough of both classes are found
        done = [json.loads(l) for l in SCREEN.read_text(encoding="utf-8").splitlines()] if SCREEN.exists() else []
        seen = {(d["gid"], d["ply"]) for d in done}
        todo = [r for r in rows if (r["gid"], r["ply"]) not in seen][:3000]
        t0 = time.time()
        with open(SCREEN, "a", encoding="utf-8") as fh:
            for i in range(0, len(todo), 200):
                for res in run_pool(screen_one, todo[i:i + 200], workers=workers, log=None):
                    if "error" in res:
                        continue
                    fh.write(json.dumps(res) + "\n"); fh.flush()
                print(f"  {i + 200}/{len(todo)} screened, {time.time() - t0:.0f}s", flush=True)
    else:
        build()


if __name__ == "__main__":
    main()
