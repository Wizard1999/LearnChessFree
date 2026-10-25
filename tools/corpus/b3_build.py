"""Task B, step 3: write content/items/quiet-001..003.json (classify_position, 1:1 'no tactic' : 'tactic exists' per file).

quiet items   from out/quiet_screen.jsonl   (ok = validator claims + depth-22 robustness filter passed)
tactic items  from out/tactic_screen.jsonl  (Lichess puzzles with a quiet last move, same verification as Task A, win by
              mate or material only), matched to the quiet items on ply bucket and piece-count bucket so that neither the
              game phase nor the amount of material gives the class away.
"""
import sys as _s, os as _o; _s.path.insert(0, _o.path.dirname(_o.path.abspath(__file__)))
import json, random
import chess
from common import *

N_QUIET = 150
N_FILES = 3
OPTIONS = ["There is a tactic", "No tactic: make a good quiet move"]
HINTS = ["Scan for loose pieces on both sides and for exposed kings.",
         "List every check and capture for the side to move, then ask whether any of them changes the material count by more than a pawn.",
         "If every forcing move fails after one or two replies, call the position quiet."]
BUCKETS = [(16, 26), (27, 37), (38, 48), (49, 60)]


def pb(ply):
    for i, (lo, hi) in enumerate(BUCKETS):
        if lo <= ply <= hi: return i


def mb(pieces):
    return 0 if pieces <= 14 else 1 if pieces <= 22 else 2


def load(path):
    return [json.loads(l) for l in open(path, encoding="utf-8") if l.strip()]


def quiet_item(r):
    fen = r["fen"]; b = chess.Board(fen)
    side = "White" if b.turn else "Black"
    pos = {"id": r["pid"], "fen": fen, "family": f"FAM-LQ-{r['gid']}-{r['ply']}",
           "provenance": {"kind": "lichess_game", "ref": f"lichess.org/{r['gid']} ply {r['ply']} (Lichess standard rated games, January 2013 sample)", "licence": "CC0"}}
    c1 = dict(r["claims"][0]); c1["statement"] = f"No line wins more than a pawn for {side} (engine best line, depth 16)."
    c2 = dict(r["claims"][1]); c2["statement"] = "The engine's evaluation is within 0.8 pawns of equal (depth 16)."
    item = {
        "id": f"IQ-{r['gid']}-{r['ply']}", "skill": "TAC.NONE.D2", "cue": 3, "task": "classify_position", "position": pos["id"],
        "prompt": f"{side} to move. Is there a tactic here (a move that wins material or forces mate), or is this a quiet position?",
        "answer": {"class": OPTIONS[1], "options": OPTIONS},
        "claims": [c1, c2],
        "tags": ["kind.quiet", "kind.game", "node.TAC.NONE", "tier.3", "cue.3", "lang.en"],
        "hints": HINTS,
        "explain": f"No line wins more than a pawn for {side} against the engine's best defence, and the evaluation is within 0.8 pawns of equal (depth 16, claims-checked). That is what 'no tactic' means in this item.",
        "orientation": "white" if b.turn else "black",
        "source": {"kind": "lichess_game", "id": f"{r['gid']}#{r['ply']}"},
        "review": {"status": "needs-human", "reviewer": None},
    }
    return pos, item


def tactic_item(v):
    fen = v["fen"]; b = chess.Board(fen)
    side = "White" if b.turn else "Black"
    pos = {"id": f"PL-{v['id']}", "fen": fen, "family": f"FAM-LP-{v['id']}",
           "provenance": {"kind": "lichess_puzzle", "ref": f"lichess.org/training/{v['id']} (FEN after the opponent's first move)", "licence": "CC0"}}
    L = v["lichess_move"]; san = b.san(chess.Move.from_uci(L))
    claims = []
    for c in v["claims"]:
        c = json.loads(json.dumps(c))
        if c["id"] == "C1":
            c["statement"] = "The engine's best move is among the accepted moves, and every accepted move is within 40 centipawns of it (depth 16)."
        elif c["type"] == "mate_in":
            c["statement"] = f"{san} forces checkmate in {c['params']['n']} or fewer against the engine's best defence." if c["params"]["n"] > 1 else f"{san} is checkmate."
        else:
            c["statement"] = f"Along the engine's best-defence line, {san} nets {side} at least {c['params']['min']} points of material (pawn 1, minor piece 3, rook 5, queen 9)."
        claims.append(c)
    if v["win_type"] == "mate":
        n = v["mate_n"]
        explain = f"{side} has a forced checkmate in {n} or fewer against the engine's best defence (depth 16), so there is a tactic." if n > 1 else f"{side} can give checkmate at once, so there is a tactic."
    else:
        explain = f"{side} has a move that nets at least {v['claims'][1]['params']['min']} points of material against the engine's best defence (depth 16), so there is a tactic."
    item = {
        "id": f"IL-{v['id']}-cls", "skill": "TAC.NONE.D2", "cue": 3, "task": "classify_position", "position": pos["id"],
        "prompt": f"{side} to move. Is there a tactic here (a move that wins material or forces mate), or is this a quiet position?",
        "answer": {"class": OPTIONS[0], "options": OPTIONS},
        "claims": claims,
        "tags": ["kind.puzzle", "node.TAC.NONE", "tier.3", "cue.3", "lang.en"],
        "hints": HINTS,
        "explain": explain,
        "orientation": "white" if b.turn else "black",
        "source": {"kind": "lichess_puzzle", "id": v["id"]},
        "review": {"status": "machine-only", "reviewer": None},
    }
    return pos, item


def main():
    rng = random.Random(f"{SEED}-quiet-build")
    q = [r for r in load(OUT / "quiet_screen.jsonl") if r.get("ok")]
    t = [r for r in load(OUT / "tactic_screen.jsonl") if r.get("ok") and r.get("win_type") in ("mate", "material")]
    print("quiet ok", len(q), "tactic ok", len(t))
    # Matching: the audit (b4_audit.py) showed that puzzle positions differ from quiet game positions in material imbalance and in the
    # number of checks available (puzzles follow a blunder). To stop those surface features giving the class away we match the two
    # classes on (|material difference| bucket) x (checks-available bucket) and only then balance over ply buckets.
    from b4_audit import feats
    def cell(f):
        return (0 if f["material_diff_abs"] == 0 else 1 if f["material_diff_abs"] <= 2 else 2, 0 if f["checks_available"] == 0 else 1 if f["checks_available"] == 1 else 2)
    qc, tc = {}, {}
    for r in q: r["_f"] = feats(r["fen"]); qc.setdefault(cell(r["_f"]), []).append(r)
    for r in t: r["_f"] = feats(r["fen"]); tc.setdefault(cell(r["_f"]), []).append(r)
    cap = {c: min(len(qc.get(c, [])), len(tc.get(c, []))) for c in set(qc) | set(tc)}
    total = sum(cap.values())
    print("matchable per cell:", cap, "total", total)
    scale = min(1.0, N_QUIET / total)
    quota = {c: int(v * scale) for c, v in cap.items()}
    # hand out the rounding remainder to the cells with spare capacity
    rem = N_QUIET - sum(quota.values())
    for c in sorted(cap, key=lambda c: cap[c] - quota[c], reverse=True):
        if rem <= 0: break
        if quota[c] < cap[c]: quota[c] += 1; rem -= 1
    matched = []
    for c, n in quota.items():
        if n <= 0: continue
        a, b = qc.get(c, []), tc.get(c, [])
        # within a cell pair by ply bucket first so the ply distributions stay similar
        rng.shuffle(a); rng.shuffle(b)
        a.sort(key=lambda r: pb(r["ply"])); b.sort(key=lambda r: pb(r["ply"]))
        # take n evenly spaced from each (both sorted by ply bucket -> similar ply distribution)
        ia = [round(i * (len(a) - 1) / max(1, n - 1)) for i in range(n)] if n > 1 else [0]
        ib = [round(i * (len(b) - 1) / max(1, n - 1)) for i in range(n)] if n > 1 else [0]
        for i, j in zip(ia, ib): matched.append((a[i], b[j]))
    print("matched pairs", len(matched), "quota", quota)
    matched.sort(key=lambda rt: (pb(rt[0]["ply"]), rng.random()))
    files = [[] for _ in range(N_FILES)]
    for i, pair in enumerate(matched): files[i % N_FILES].append(pair)
    for fi, pairs in enumerate(files, 1):
        positions, items = [], []
        for rq, vt in pairs:
            p1, i1 = quiet_item(rq); p2, i2 = tactic_item(vt)
            positions += [p1, p2]; items += [i1, i2]
        rng.shuffle(items)
        name = f"quiet-{fi:03d}.json"
        assert len(items) <= 120
        (ITEMS_DIR / name).write_text(json.dumps({"positions": positions, "items": items}, indent=1, ensure_ascii=False), encoding="utf-8")
        print(name, len(positions), "positions", len(items), "items;", sum(1 for x in items if x["answer"]["class"] == OPTIONS[1]), "quiet /", sum(1 for x in items if x["answer"]["class"] == OPTIONS[0]), "tactic")


if __name__ == "__main__":
    main()
