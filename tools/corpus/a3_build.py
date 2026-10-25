"""Task A, step 3: write content/items/lp-*.json from out/verdicts.jsonl (only puzzles whose every claim was re-verified).

Per theme: up to 45 cue-3 items (primary-sample passes first; reserve passes only if fewer than 40 primary passes),
plus a cue-1 sibling (same position, prompt names the theme) for 10 of them, spread over the rating range.
Files hold <= 120 items (two themes per file).
"""
import sys as _s, os as _o; _s.path.insert(0, _o.path.dirname(_o.path.abspath(__file__)))
import json
import chess
from common import *

HINTS = {
    "fork": ("Look for enemy pieces that are undefended or only lightly defended, and note where your pieces can jump to.",
             "Is there a square from which one of your pieces would attack two targets at once?"),
    "pin": ("Look along files, ranks and diagonals for an enemy piece standing in front of something more valuable, such as the king or the queen.",
            "Can you add pressure to the piece that is stuck on that line, or use the fact that it cannot move freely?"),
    "skewer": ("Look for a long line where a valuable enemy piece stands in front of a less valuable one.",
               "If the front piece has to move away, what is left behind it on the same line?"),
    "discoveredAttack": ("Look at your own pieces that stand in front of your bishop, rook or queen.",
                         "If the front piece moves, what does the piece behind it start to attack, and can the front piece make a threat of its own?"),
    "doubleCheck": ("Look at the enemy king and ask which of your pieces could give check, and which of your pieces block a long-range piece.",
                    "Could one move give check with two different pieces at the same time?"),
    "backRankMate": ("Look at the enemy king's back rank: which squares in front of the king are blocked by its own pieces?",
                     "Can a rook or queen reach the back rank with check, and does the king have any square to run to?"),
    "hangingPiece": ("Count attackers and defenders for pieces on both sides; look for any piece that is attacked and not defended.",
                     "Is there an enemy piece you can capture for free, or one you can attack so that it cannot be defended in time?"),
    "trappedPiece": ("Look for an enemy piece that has very few safe squares to move to.",
                     "Which of its escape squares do your pieces control, and can you attack it so that it cannot get away?"),
    "deflection": ("Find an enemy piece that has an important job, such as guarding a piece, a square or the king.",
                   "Can you force that piece to leave its job, for example by capturing it or attacking it?"),
    "attraction": ("Look at the enemy king and at squares where it would be exposed.",
                   "Can you force an enemy piece, perhaps the king itself, onto a square where it can be attacked decisively?"),
    "clearance": ("Look for one of your own pieces that blocks a square or a line which another of your pieces would like to use.",
                  "Can the blocking piece move away with a threat, so that the line or square opens up at the same moment?"),
    "intermezzo": ("Notice whether the opponent has just made a capture or a threat that you would normally answer directly.",
                   "Is there a stronger forcing move you can play first, before making the obvious reply?"),
    "xRayAttack": ("Look along files, ranks and diagonals where one of your pieces lines up behind another piece.",
                   "If pieces are exchanged on a key square, which piece behind them still attacks or defends it?"),
    "interference": ("Look at where enemy pieces protect each other, or protect a square, along a line.",
                     "Can you place a piece between two enemy pieces so that their connection or protection is cut?"),
    "capturingDefender": ("Find which enemy piece protects an important piece or square.",
                          "What becomes unprotected if you capture or remove that defender?"),
    "sacrifice": ("Check the enemy king and the weak squares around it, and count how many of your pieces can join in.",
                  "Would giving up material open lines or squares so that your remaining pieces win back more than it costs?"),
    "quietMove": ("List the checks and captures first; then ask whether a calm move creates a threat that cannot be met.",
                  "Which calm move creates a threat that the opponent cannot parry with a single reply?"),
    "defensiveMove": ("Before attacking, ask what the opponent threatens right now.",
                      "Which move answers the main threat and still keeps your own pieces safe?"),
    "mateIn2": ("Look at the enemy king's escape squares and at the checks you have.",
                "Which first move leaves the king without a defence against a mating move on your next turn?"),
    "mateIn3": ("Look at the enemy king's escape squares and at the checks you have.",
                "Which forcing first move keeps the king boxed in so that mate follows in three moves?"),
}
PAIRS = [("fork", "pin"), ("skewer", "discoveredAttack"), ("doubleCheck", "backRankMate"), ("hangingPiece", "trappedPiece"),
         ("deflection", "attraction"), ("clearance", "intermezzo"), ("xRayAttack", "interference"),
         ("capturingDefender", "sacrifice"), ("quietMove", "defensiveMove"), ("mateIn2", "mateIn3")]
N_C3 = 45
N_C1 = 10


def pawns(cp):
    v = cp / 100
    return f"{v:g}"


def build_item(v, cue, label):
    theme = v["theme"]; node = THEMES[theme][0]
    b = chess.Board(v["fen"])
    side = "White" if b.turn else "Black"
    L = v["lichess_move"]
    san = b.san(chess.Move.from_uci(L))
    claims = []
    for c in v["claims"]:
        c = json.loads(json.dumps(c))
        t = c["type"]
        if c["id"] == "C1":
            c["statement"] = "The engine's best move is among the accepted moves, and every accepted move is within 40 centipawns of it (depth 16)."
        elif t == "mate_in":
            c["statement"] = f"{san} forces checkmate in {c['params']['n']} or fewer against the engine's best defence." if c["params"]["n"] > 1 else f"{san} is checkmate."
        elif t == "material_after_move":
            c["statement"] = f"Along the engine's best-defence line, {san} nets {side} at least {c['params']['min']} points of material (pawn 1, minor piece 3, rook 5, queen 9)."
        elif t == "eval_range" and v["win_type"] == "eval":
            c["statement"] = f"The engine rates this position at least 2.5 pawns better for {side} (depth 16)."
        elif t == "eval_range":
            c["statement"] = f"The engine does not rate this position worse than 1 pawn for {side} (depth 16)."
        elif t == "tablebase":
            c["statement"] = f"The Lichess tablebase (exact for 7 pieces or fewer) confirms that {san} wins for {side}."
        elif t == "move_loses":
            c["params"]["cp"] = min(c["params"]["cp"], 600)      # lowering the threshold keeps a verified claim verified
            alt = chess.Move.from_uci(c["params"]["move"])
            c["statement"] = f"The best alternative, {b.san(alt)}, is at least {pawns(c['params']['cp'])} pawns worse than the best move (depth 16)."
        claims.append(c)
    fb = v.get("feedback")
    feedback = {}
    if fb:
        c = json.loads(json.dumps(fb["claim"])); c["id"] = "C%d" % (len(claims) + 1)
        c["params"]["cp"] = min(c["params"]["cp"], 600); fb = dict(fb, cp=c["params"]["cp"])
        mv = chess.Move.from_uci(fb["move"])
        c["statement"] = f"{b.san(mv)} is at least {pawns(fb['cp'])} pawns worse than the best move (depth 16)."
        claims.append(c)
        feedback[fb["move"]] = f"Not best: the engine rates this move at least {pawns(fb['cp'])} pawns worse than the best move."
    wt = v["win_type"]
    if wt == "mate":
        n = v["mate_n"]
        explain = f"The first move forces checkmate in {n} or fewer against the engine's best defence (depth 16)." if n > 1 else "The first move is checkmate."
    elif wt == "material":
        explain = f"Along the engine's best line this move nets {side} at least {v['claims'][1]['params']['min']} points of material (pawn 1, minor piece 3, rook 5, queen 9)."
    elif wt == "eval":
        explain = f"The engine rates this position at least 2.5 pawns better for {side}, and the accepted move is within 0.4 pawns of its best (depth 16)."
    else:
        alt = next(c for c in v["claims"] if c["type"] == "move_loses")
        explain = (f"The engine does not rate the position worse than 1 pawn for {side} after the best move, "
                   f"while the best alternative is at least {pawns(min(alt['params']['cp'], 600))} pawns worse (depth 16).")
    if any(c["type"] == "tablebase" for c in v["claims"]):
        explain += " The tablebase confirms that the move wins."
    frm = L[:2]
    h1, h2 = HINTS[theme]
    hints = [h1, h2, f"A good first move is made by the piece on {frm}."]
    prompt = f"{side} to move. Find the best move." if cue == 3 else f"Theme: {label}. {side} to move. Find the best move."
    tags = [f"theme.{theme}", f"node.{node}", "kind.puzzle", f"tier.{tier_of(v['rating'])}", f"cue.{cue}", "lang.en"]
    item = {
        "id": f"IL-{v['id']}" + ("" if cue == 3 else "-c1"),
        "skill": f"{node}.D{2 if cue == 3 else 1}",
        "cue": cue,
        "task": "find_move",
        "position": f"PL-{v['id']}",
        "prompt": prompt,
        "answer": {"moves": v["accepted"]},
        "claims": claims,
        "tags": tags,
        "hints": hints,
        "explain": explain,
    }
    if feedback: item["feedback_by_move"] = feedback
    item["orientation"] = "white" if b.turn else "black"
    item["difficulty_prior"] = {"scale": "lichess_puzzle", "rating": v["rating"], "rd": v["rd"], "plays": v["plays"], "grade": "G1"}
    item["source"] = {"kind": "lichess_puzzle", "id": v["id"]}
    item["review"] = {"status": "machine-only" if cue == 3 else "needs-human", "reviewer": None}
    return item


def main():
    verdicts = {}
    for line in open(OUT / "verdicts.jsonl", encoding="utf-8"):
        if line.strip():
            d = json.loads(line); verdicts[d["id"]] = d
    sel = read_json(OUT / "selection.json")["puzzles"]
    by_theme = {t: [] for t in THEMES}
    for s in sel:
        v = verdicts.get(s["id"])
        if v: by_theme[s["theme"]].append(v)
    manifest = {}
    chosen = {}
    for theme, vs in by_theme.items():
        prim = [v for v in vs if v["tranche"] == "primary" and v["ok"]]
        res = [v for v in vs if v["tranche"] == "reserve" and v["ok"]]
        use = list(prim)
        if len(use) < 40:
            use += res[: 40 - len(use)]
        use = sorted(use[:N_C3], key=lambda v: v["rating"])
        # cue-1 siblings: evenly spaced over the rating-sorted list
        k = min(N_C1, len(use))
        sib_idx = {round(i * (len(use) - 1) / max(1, k - 1)) for i in range(k)} if use else set()
        chosen[theme] = (use, sib_idx)
        manifest[theme] = dict(sampled_primary=sum(1 for v in vs if v["tranche"] == "primary"),
                               passed_primary=len(prim), sampled_reserve=sum(1 for v in vs if v["tranche"] == "reserve"),
                               passed_reserve=len(res), delivered_c3=len(use), delivered_c1=len(sib_idx))
    written = []
    for a, bth in PAIRS:
        positions, items = [], []
        for theme in (a, bth):
            use, sib = chosen[theme]
            label = THEMES[theme][1]
            for i, v in enumerate(use):
                positions.append({"id": f"PL-{v['id']}", "fen": v["fen"], "family": f"FAM-LP-{v['id']}",
                                  "provenance": {"kind": "lichess_puzzle", "ref": f"lichess.org/training/{v['id']} (FEN after the opponent's first move)", "licence": "CC0"}})
                items.append(build_item(v, 3, label))
                if i in sib:
                    items.append(build_item(v, 1, label))
        name = f"lp-{a.lower()}-{bth.lower()}.json"
        assert len(items) <= 120, (name, len(items))
        (ITEMS_DIR / name).write_text(json.dumps({"positions": positions, "items": items}, indent=1, ensure_ascii=False), encoding="utf-8")
        written.append((name, len(positions), len(items)))
    for w in written: print(w)
    write_json(OUT / "tactics_manifest.json", manifest)
    print(json.dumps(manifest, indent=0)[:3000])


if __name__ == "__main__":
    main()
