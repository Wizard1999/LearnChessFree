"""Task C, step 3: write content/items/threat-001..002.json (threat_detection; mate threats, loose-piece threats, no-threat balance).

Selection is seeded and balanced over four ply buckets; each file gets the same mix of kinds.
"""
import sys as _s, os as _o; _s.path.insert(0, _o.path.dirname(_o.path.abspath(__file__)))
import json, random
import chess
from common import *

N = dict(mate=46, loose=56, none=40)
N_FILES = 2
BUCKETS = [(16, 26), (27, 37), (38, 48), (49, 60)]
PIECE = {chess.PAWN: "pawn", chess.KNIGHT: "knight", chess.BISHOP: "bishop", chess.ROOK: "rook", chess.QUEEN: "queen", chess.KING: "king"}


def pb(ply):
    for i, (lo, hi) in enumerate(BUCKETS):
        if lo <= ply <= hi: return i


def build(r):
    b = chess.Board(r["fen"])
    stm_white = b.turn
    me = "White" if stm_white else "Black"; opp = "Black" if stm_white else "White"
    pos = {"id": r["pid"], "fen": r["fen"], "family": f"FAM-LT-{r['gid']}-{r['ply']}",
           "provenance": {"kind": "lichess_game", "ref": f"lichess.org/{r['gid']} ply {r['ply']} (Lichess standard rated games, January 2013 sample)", "licence": "CC0"}}
    kind = r["kind"]
    nb = b.copy(); nb.push(chess.Move.null())
    claims = json.loads(json.dumps(r["claims"]))
    h1 = "Imagine it is the opponent's turn again. Which of their pieces could give check or capture something?"
    h2 = "For each of their checks and captures, ask whether something of yours is left without a defender or without a flight square."
    if kind == "mate":
        mv = chess.Move.from_uci(r["threat_move"])
        san = nb.san(mv)
        claims[0]["statement"] = f"If {opp} were to move now, {san} would be checkmate."
        h3 = f"The piece that gives the threat stands on {r['threat_move'][:2]}."
        explain = f"If {me} did nothing about it, {opp} could play {san} and give checkmate (a rules check, no engine needed)."
        status, tier, tag = "machine-only", 2, "threat.mate"
    elif kind == "loose":
        mv = chess.Move.from_uci(r["threat_move"])
        san = nb.san(mv)
        sq = r["loose"][0]; pc = PIECE[b.piece_at(chess.parse_square(sq)).piece_type]
        att = PIECE[b.piece_at(mv.from_square).piece_type]
        claims[0]["statement"] = f"The {pc} on {sq} is the only {me} piece that is attacked and undefended."
        claims[1]["statement"] = f"Exactly one {opp} piece attacks {sq}."
        h3 = f"The piece on {sq} is attacked and has no defender."
        explain = (f"The {pc} on {sq} is attacked once and defended by nothing, so {opp} could capture it with {san}. "
                   f"A null-move engine search run when the item was built found that this capture nets {opp} at least 2 points of material; the validator does not re-run that part.")
        status, tier, tag = "needs-human", 1, "threat.loose"
    else:
        claims[0]["statement"] = f"{me} has no piece that is attacked and undefended."
        claims[1]["statement"] = f"{opp} has no piece that is attacked and undefended."
        claims[2]["statement"] = "The engine's evaluation is within 1.5 pawns of equal (depth 16)."
        h3 = "Check every piece of yours: is any of them attacked and undefended?"
        explain = (f"Neither side has a piece that is attacked and undefended, and the engine rates the position within 1.5 pawns of equal (depth 16). "
                   f"A null-move engine search run when the item was built found no mating or material-winning move for {opp}; the validator does not re-run that part.")
        status, tier, tag = "needs-human", 2, "threat.none"
    item = {
        "id": f"IT-{r['gid']}-{r['ply']}", "skill": "SAF.THREAT.D2", "cue": 3, "task": "threat_detection", "position": pos["id"],
        "prompt": f"{me} to move. If {me} did nothing useful and {opp} moved next, what would {opp} play to win material or checkmate? Name that move, or choose 'No threat'.",
        "answer": {"threat_move": r["threat_move"]},
        "claims": claims,
        "tags": ["node.SAF.THREAT", "kind.game", tag, f"tier.{tier}", "cue.3", "lang.en"],
        "hints": [h1, h2, h3],
        "explain": explain,
        "orientation": "white" if stm_white else "black",
        "source": {"kind": "lichess_game", "id": f"{r['gid']}#{r['ply']}"},
        "review": {"status": status, "reviewer": None},
    }
    return pos, item


def main():
    rng = random.Random(f"{SEED}-threat-build")
    rows = [json.loads(l) for l in open(OUT / "threat_screen.jsonl", encoding="utf-8") if l.strip()]
    ok = {k: [r for r in rows if r.get("ok") and r["kind"] == k] for k in N}
    print({k: len(v) for k, v in ok.items()})
    files = [[] for _ in range(N_FILES)]
    for kind, n in N.items():
        byb = {i: [] for i in range(4)}
        for r in ok[kind]: byb[pb(r["ply"])].append(r)
        for i in byb: rng.shuffle(byb[i])
        sel = []
        per = n // 4
        for i in range(4): sel += byb[i][:per]
        rest = [r for i in range(4) for r in byb[i][per:]]
        rng.shuffle(rest)
        sel += rest[: n - len(sel)]
        rng.shuffle(sel)
        for j, r in enumerate(sel): files[j % N_FILES].append(r)
    for fi, rs in enumerate(files, 1):
        rng.shuffle(rs)
        positions, items = [], []
        for r in rs:
            p, it = build(r); positions.append(p); items.append(it)
        assert len(items) <= 120
        name = f"threat-{fi:03d}.json"
        (ITEMS_DIR / name).write_text(json.dumps({"positions": positions, "items": items}, indent=1, ensure_ascii=False), encoding="utf-8")
        from collections import Counter
        print(name, len(items), dict(Counter(r["kind"] for r in rs)))


if __name__ == "__main__":
    main()
