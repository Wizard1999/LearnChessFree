"""lp2 step 3: write content/items/lp2-*.json from out/l2/verdicts.jsonl (only puzzles whose every claim was re-verified).

Item kinds
  find     cue-3 `find_move` (prompt names no theme) + cue-1 siblings that name the theme (same position, needs-human)
  predict  `predict_outcome`: "is this the best move?" yes/no, the proposed move is drawn as an arrow by the app; the NO items use
           a tempting capture/check that a move_loses claim shows to be at least 1.5 pawns worse than the best move
  compare  `classify_position`: "which of two moves is better" (no arrow); the wrong one is a verified move_loses move
  line     `find_move` with answer.line / answer.plies (tag mode.variation); CAL.BLIND hides every piece after a study time
  viz      `select_squares` with display.hide (rules only, claim legal_destinations)
Files hold at most ~115 items; a node is never split across files.
    python l2_build.py
"""
import sys as _s, os as _o; _s.path.insert(0, _o.path.dirname(_o.path.abspath(__file__)))
import json, random, tempfile, os
from pathlib import Path
from collections import defaultdict, Counter
from l2_common import *

ITEMS_OUT = Path(os.environ.get("L2_ITEMS_DIR", str(ITEMS_DIR)))     # a dry run can write elsewhere
ITEMS_OUT.mkdir(parents=True, exist_ok=True)
SIDE = {chess.WHITE: "White", chess.BLACK: "Black"}
PN = {chess.PAWN: "pawn", chess.KNIGHT: "knight", chess.BISHOP: "bishop", chess.ROOK: "rook", chess.QUEEN: "queen", chess.KING: "king"}

NODE_ORDER = ["ATK.CASTLED", "ATK.CENTER", "ATK.COMMIT", "ATK.PACE", "ATK.PAWNSTORM", "ATK.GREEKGIFT", "ATK.SUPERIORITY",
              "TAC.UNDERPROMOTE", "TAC.STALEMATE-TRICK", "TAC.PERPETUAL", "TAC.DESPERADO", "TAC.OVERLOAD", "TAC.COMBO",
              "TAC.MATE-PATTERNS", "SAC.TYPES", "END.ZUGZWANG", "END.BREAKTHROUGH", "END.QUEEN-PAWN", "END.THEORY.QvR", "END.MINOR",
              "END.ROOK-ACTIVE", "END.LUCENA", "END.PHILIDOR", "END.KING-ACTIVE", "DEF.RESOURCES", "DEF.COUNTER", "DEF.TRADES",
              "DEF.FORTRESS", "INI.INITIATIVE", "CAL.VISUALIZE", "CAL.DEPTH", "CAL.CANDIDATES", "CAL.TREE", "CAL.BLIND", "CAL.ENDURANCE",
              "CAL.DEFENSE", "CAL.COMPARE", "FND.SPECIAL"]
FILE_GROUP = {"ATK": "atk", "TAC": "tac", "SAC": "tac", "END": "end", "DEF": "def", "INI": "def", "CAL": "cal", "FND": "tac"}

# two generic nudges per node (hint 3 is added per item). They are questions or instructions, not claims about the board.
HINTS = {
    "ATK.CASTLED": ("Look at the squares around the enemy king and at which of your pieces can reach them.",
                    "Which of your pieces can join the attack, and which defender could you remove or distract?"),
    "ATK.CENTER": ("Where is the enemy king, and which files and diagonals point at it?",
                   "Which move opens a line to the king, or keeps it from finding safety?"),
    "ATK.COMMIT": ("Count the pieces you can bring to the attack and ask what you still have in reserve.",
                   "Which forcing move keeps the opponent from regrouping?"),
    "ATK.PACE": ("Is there a forcing move, or would a calm move make the attack stronger?",
                 "Which of your pieces is not yet taking part, and where would it help most?"),
    "ATK.PAWNSTORM": ("Look at where the two kings stand. Which pawn could open a file or a diagonal toward the enemy king?",
                      "If the enemy takes the pawn, which line opens for your pieces?"),
    "ATK.GREEKGIFT": ("Check your bishop's diagonal toward the enemy king's side and which of your pieces could join in.",
                      "After the bishop captures with check, where can the king go, and what do you play next?"),
    "ATK.SUPERIORITY": ("Count your pieces near the enemy king and the defenders near it. Is the attack ready?",
                        "What does the opponent do if you play this move and nothing follows?"),
    "TAC.UNDERPROMOTE": ("Look at the promotion square and at what each kind of piece would attack from there.",
                         "Compare a queen with the other pieces: does another piece give check, fork something or avoid stalemate?"),
    "TAC.STALEMATE-TRICK": ("Count the legal moves the opponent would have after each of your candidate moves.",
                            "Could you give up material so that the opponent has no legal move and is not in check?"),
    "TAC.PERPETUAL": ("Count the checks you have and the squares the enemy king can run to.",
                      "Is there a series of checks the king cannot escape?"),
    "TAC.DESPERADO": ("Look for a piece of yours that is attacked and cannot get away.",
                      "What can that piece capture on its way out, and what do you gain after the recapture?"),
    "TAC.OVERLOAD": ("Pick an enemy piece that protects two things at once.",
                     "What happens to the second thing it protects if you take or attack the first?"),
    "TAC.COMBO": ("List your checks and captures first.",
                  "The first move is only the start: what does each forcing move make possible next?"),
    "TAC.MATE-PATTERNS": ("Look at the enemy king: which of its squares are covered, and which are blocked by its own pieces?",
                          "Which check leaves the king no square and no way to capture or block?"),
    "SAC.TYPES": ("Check the enemy king and the weak squares around it, and count how many of your pieces can join in.",
                  "Would giving up material open lines or squares so that your remaining pieces win back more than it costs?"),
    "END.ZUGZWANG": ("Count the safe moves each side has, king moves included.",
                     "Which move leaves the opponent only moves that make things worse?"),
    "END.BREAKTHROUGH": ("Count how many moves each pawn needs to reach the last rank.",
                         "Can you give up a pawn to open a path for another one?"),
    "END.QUEEN-PAWN": ("Where is the pawn, and how far is each king from it?",
                       "Can you force the pawn's side to block it or give it up, and watch for stalemate?"),
    "END.THEORY.QvR": ("Look for a check that also attacks the rook.",
                       "Which check separates the rook from its king?"),
    "END.MINOR": ("Where should your king go, and which enemy pawns can it attack?",
                  "Count the moves each side needs for its plan."),
    "END.ROOK-ACTIVE": ("Where is your rook most active: behind a passed pawn, on an open file or on the seventh rank?",
                        "Compare winning a pawn with keeping the rook active."),
    "END.LUCENA": ("Look at where the enemy rook and king stand compared with the pawn on the seventh.",
                   "Which move stops the stronger side from building a safe path for the pawn?"),
    "END.PHILIDOR": ("Where must your rook stand to keep the enemy king from advancing?",
                     "Which move keeps the enemy king cut off and avoids a quick loss?"),
    "END.KING-ACTIVE": ("Count the moves your king needs to reach each target.",
                        "Which square does the king have to reach first?"),
    "DEF.RESOURCES": ("Before attacking, ask what the opponent threatens right now.",
                      "Which move answers the main threat and still keeps your own pieces safe?"),
    "DEF.COUNTER": ("Ask what the opponent would play if it were their move.",
                    "Do you have a check, or a capture with check, that comes first?"),
    "DEF.TRADES": ("Which enemy piece is the most dangerous right now?",
                   "Which exchange removes it without costing you a defender?"),
    "DEF.FORTRESS": ("Count the material. Which squares must your king and pieces keep?",
                     "Look for a way to make progress impossible rather than to win material back."),
    "INI.INITIATIVE": ("Can you keep making threats that must be answered?",
                       "Which check keeps the opponent busy and improves your position?"),
    "CAL.DEPTH": ("Count how many replies each check or forcing move leaves the opponent.",
                  "Follow the forcing moves to the end of the line before you commit to the first one."),
    "CAL.DEFENSE": ("Play the move in your head, then ask what the opponent's best reply is.",
                    "Is there a check, a capture or a quiet move that changes the result?"),
    "CAL.COMPARE": ("Play each move in your head and look at the position you reach.",
                    "What does the opponent do best after each of them?"),
    "CAL.CANDIDATES": ("List the checks, captures and threats first.",
                       "After your move, what is the opponent's best reply, and what do you play then?"),
    "CAL.TREE": ("List your forcing moves first, then the opponent's replies to each.",
                 "Follow the main line move by move and keep track of what each side has left."),
    "CAL.BLIND": ("Keep the position in your head: where are the kings and the pieces that matter?",
                  "Follow the checks and captures one move at a time."),
    "CAL.ENDURANCE": ("Take the line move by move; do not skip the opponent's replies.",
                      "Keep track of the pieces that have moved or been taken."),
    "FND.SPECIAL": ("Look at the king and the rooks: are they on their starting squares with nothing in between?",
                    "Is there a move you can only make because of a special rule?"),
}


def sq_phrase(piece_sq, b):
    pc = b.piece_at(chess.parse_square(piece_sq))
    return f"{PN[pc.piece_type]} on {piece_sq}"


def pawns(cp):
    return f"{cp / 100:g}"


def san(b, u):
    return b.san(chess.Move.from_uci(u))


def claim_statements(v, b, side, accepted_sans):
    """Add a plain-language `statement` to every claim, saying exactly what the claim checks."""
    out = []
    L = v["lichess_move"]
    sanL = san(b, L)
    for c in v["claims"]:
        c = json.loads(json.dumps(c))
        t = c["type"]; p = c["params"]
        if t == "best_move_in":
            c["statement"] = "The engine's best move is among the accepted moves, and every accepted move is within 40 centipawns of it (depth 16)."
        elif t == "mate_in":
            n = p["n"]; m = san(b, p["move"])
            if p.get("null_move_first"):
                nb = b.copy(stack=False); nb.push(chess.Move.null())
                c["statement"] = f"If it were {SIDE[not b.turn]}'s turn, {nb.san(chess.Move.from_uci(p['move']))} would be checkmate."
            else:
                c["statement"] = f"{m} forces checkmate in {n} or fewer against the engine's best defence." if n > 1 else f"{m} is checkmate."
        elif t == "material_after_move" and "min" in p:
            c["statement"] = f"Along the engine's best-defence line, {san(b, p['move'])} nets {side} at least {p['min']} points of material (pawn 1, minor piece 3, rook 5, queen 9)."
        elif t == "material_after_move" and "max" in p:
            c["statement"] = f"Along the engine's best-defence line, {san(b, p['move'])} nets {side} at most {p['max']} points of material (a negative number means a loss)."
        elif t == "eval_range" and "min" in p and "max" in p:
            c["statement"] = "The engine rates this position within 0.6 pawns of level (depth 16)."
        elif t == "eval_range" and v["win_type"] == "eval":
            c["statement"] = f"The engine rates this position at least 2.5 pawns better for {side} (depth 16)."
        elif t == "eval_range":
            c["statement"] = f"The engine does not rate this position worse than 1 pawn for {side} (depth 16)."
        elif t == "tablebase":
            m = san(b, p["move"]); r = p["result"]
            if p["move"] in v.get("accepted", []):
                c["statement"] = f"The Lichess tablebase (exact for 7 pieces or fewer) confirms that {m} {'wins' if r == 'win' else 'draws' if r == 'draw' else 'loses'} for {side}."
            elif v.get("queen_alt", {}).get("move") == p["move"]:
                c["statement"] = f"The tablebase shows that promoting to a queen ({m}) {'still wins' if r == 'win' else 'only draws' if r == 'draw' else 'loses'} for {side}."
            else:
                c["statement"] = f"The tablebase shows that {m} {'wins' if r == 'win' else 'only draws' if r == 'draw' else 'loses'} for {side}."
        elif t == "move_loses":
            cp = min(p["cp"], 600); c["params"]["cp"] = cp
            mv = san(b, p["move"])
            if v.get("queen_alt", {}).get("move") == p["move"]:
                c["statement"] = f"Promoting to a queen ({mv}) is at least {pawns(cp)} pawns worse than the best move (depth 16)."
            elif v.get("foil_move") == p["move"]:
                c["statement"] = f"{mv} is at least {pawns(cp)} pawns worse than the engine's best move (depth 16)."
            else:
                c["statement"] = f"The best alternative, {mv}, is at least {pawns(cp)} pawns worse than the best move (depth 16)."
        out.append(c)
    return out


def explain_text(v, b, side, accepted_sans):
    wt = v["win_type"]
    if wt == "foil":
        return (f"The engine rates {san(b, v['foil_move'])} at least {pawns(min(v['claims'][0]['params']['cp'], 600))} pawns worse than its best move, "
                f"and along its best-defence line the move nets {side} at most {v['foil_net']} points of material (depth 16).")
    ac = " or ".join(accepted_sans)
    if wt == "mate":
        n = v["mate_n"]
        s = f"{ac} forces checkmate in {n} or fewer against the engine's best defence (depth 16)." if n > 1 else f"{ac} is checkmate."
    elif wt == "material":
        mn = next(c for c in v["claims"] if c["type"] == "material_after_move")["params"]["min"]
        s = f"Along the engine's best line this move nets {side} at least {mn} points of material (pawn 1, minor piece 3, rook 5, queen 9)."
    elif wt == "eval":
        s = f"The engine rates this position at least 2.5 pawns better for {side}, and the accepted move is within 0.4 pawns of its best (depth 16)."
    elif wt == "only_move":
        alt = next(c for c in v["claims"] if c["type"] == "move_loses")
        s = (f"The engine does not rate the position worse than 1 pawn for {side} after the best move, "
             f"while the best alternative is at least {pawns(min(alt['params']['cp'], 600))} pawns worse (depth 16).")
    elif wt == "draw":
        alt = next(c for c in v["claims"] if c["type"] == "move_loses")
        s = (f"The engine rates the position as level (within 0.6 pawns) with best play, and the best alternative is at least "
             f"{pawns(min(alt['params']['cp'], 600))} pawns worse (depth 16).")
    else:   # tablebase only
        res = v.get("tb_cat") or v.get("tb_result")
        s = f"The tablebase confirms that {ac} {'keeps the win' if res == 'win' else 'holds the draw'} (exact result, 7 pieces or fewer)."
        q = v.get("queen_alt")
        if q:
            s += " Promoting to a queen does worse."
        return s
    if any(c["type"] == "tablebase" for c in v["claims"] if c["params"].get("move") in v.get("accepted", [])):
        s += " The tablebase confirms the result."
    q = v.get("queen_alt")
    if q:
        s += f" Promoting to a queen is at least {pawns(min(q['cp'], 600))} pawns worse (depth 16)."
    if v.get("threat_claim"):
        nb = b.copy(stack=False); nb.push(chess.Move.null())
        s = f"If {SIDE[not b.turn]} had the move, {nb.san(chess.Move.from_uci(v['threat_mate_moves'][0]))} would be checkmate, so the reply has to come with tempo. " + s
    return s


def feedback_for(v, b):
    fb = v.get("feedback"); ftb = v.get("feedback_tb")
    out = {}
    if ftb:
        r = ftb["result"]
        out[ftb["move"]] = f"Not best: the tablebase shows that this move {'only draws' if r == 'draw' else 'loses' if r == 'loss' else 'wins slower'}."
    elif fb:
        cp = min(fb["cp"], 600)
        out[fb["move"]] = f"Not best: the engine rates this move at least {pawns(cp)} pawns worse than the best move."
    return out


def feedback_claim(v, b, side, n_existing):
    fb = v.get("feedback"); ftb = v.get("feedback_tb")
    if ftb and ftb.get("claim"):
        return None  # tablebase feedback claim already inside v['claims']
    if fb:
        c = json.loads(json.dumps(fb["claim"])); c["id"] = "C%d" % (n_existing + 1)
        c["params"]["cp"] = min(c["params"]["cp"], 600)
        c["statement"] = f"{san(b, fb['move'])} is at least {pawns(c['params']['cp'])} pawns worse than the best move (depth 16)."
        return c
    return None


def hints_for(node, v, b):
    h1, h2 = HINTS[node]
    acc = v["accepted"]
    frms = []
    for m in acc:
        if m[:2] not in frms:
            frms.append(m[:2])
    pr = "A good first move is made by the piece on " + frms[0] + "." if len(frms) == 1 else "A good first move is made by the piece on " + " or ".join(frms) + "."
    return [h1, h2, pr]


def tags_for(v, node, cue, extra=()):
    theme = BUCKETS[v["bucket"]]["theme"]
    t = [f"theme.{theme}", f"node.{node}", "kind.puzzle", f"tier.{tier_l2(v['rating'])}", f"cue.{cue}", "lang.en"]
    for x in extra:
        if x not in t:
            t.append(x)
    return t


def position_of(v):
    return {"id": f"PL-{v['id']}", "fen": v["fen"], "family": f"FAM-LP2-{v['id']}",
            "provenance": {"kind": "lichess_puzzle", "ref": f"lichess.org/training/{v['id']} (FEN after the opponent's first move)", "licence": "CC0"}}


def build_find(v, cue, node, label, label_kind="Theme"):
    b = chess.Board(v["fen"]); side = SIDE[b.turn]
    acc_sans = [san(b, m) for m in v["accepted"]]
    claims = claim_statements(v, b, side, acc_sans)
    fc = feedback_claim(v, b, side, len(claims))
    if fc: claims.append(fc)
    prompt = f"{side} to move. Find the best move." if cue == 3 else f"{label_kind}: {label}. {side} to move. Find the best move."
    extra = []
    item = {
        "id": f"IL-{v['id']}" + ("" if cue == 3 else "-c1"),
        "skill": f"{node}.D{2 if cue == 3 else 1}", "cue": cue, "task": "find_move",
        "position": f"PL-{v['id']}", "prompt": prompt, "answer": {"moves": v["accepted"]},
        "claims": claims, "tags": tags_for(v, node, cue, extra), "hints": hints_for(node, v, b),
        "explain": explain_text(v, b, side, acc_sans),
    }
    fbm = feedback_for(v, b)
    if fbm: item["feedback_by_move"] = fbm
    item["orientation"] = "white" if b.turn else "black"
    item["difficulty_prior"] = {"scale": "lichess_puzzle", "rating": v["rating"], "rd": v["rd"], "plays": v["plays"], "grade": grade_of(v["rd"], v["plays"])}
    item["source"] = {"kind": "lichess_puzzle", "id": v["id"]}
    item["review"] = {"status": "machine-only" if cue == 3 else "needs-human", "reviewer": None}
    return item


def build_predict(v, node, want_yes, rng):
    b = chess.Board(v["fen"]); side = SIDE[b.turn]
    acc_sans = [san(b, m) for m in v["accepted"]]
    L = v["lichess_move"]
    if want_yes:
        shown = L
        claims = claim_statements(v, b, side, acc_sans)
        wc = [c for c in claims if c["type"] in ("mate_in", "material_after_move")]
        claims = wc + [c for c in claims if c not in wc and c["type"] != "move_loses" or (c["type"] == "move_loses" and False)]
        # drop any move_loses (only-move alternative) from the yes item; keep it simple and strictly about the shown move
        outcome = "Yes, it is the best move"
        ex = "The engine's best move here (depth 16). " + explain_text(v, b, side, acc_sans)
    else:
        fb = v["feedback"]
        shown = fb["move"]
        c1 = json.loads(json.dumps(fb["claim"])); c1["id"] = "C1"; c1["params"]["cp"] = min(c1["params"]["cp"], 600)
        c1["statement"] = f"{san(b, shown)} is at least {pawns(c1['params']['cp'])} pawns worse than the best move (depth 16)."
        best_c = json.loads(json.dumps(next(c for c in v["claims"] if c["type"] == "best_move_in"))); best_c["id"] = "C2"
        best_c["statement"] = "The engine's best move is among the accepted moves, and every accepted move is within 40 centipawns of it (depth 16)."
        claims = [c1, best_c]
        outcome = "No, a clearly better move exists"
        ex = (f"The engine rates {san(b, shown)} at least {pawns(c1['params']['cp'])} pawns worse than the best move, {' or '.join(acc_sans)} (depth 16).")
    for i, c in enumerate(claims, 1):
        c["id"] = f"C{i}"
    shown_san = san(b, shown)
    item = {
        "id": f"IL-{v['id']}-p", "skill": f"{node}.D2", "cue": 3, "task": "predict_outcome",
        "position": f"PL-{v['id']}",
        "prompt": f"{side} to move and is thinking about {shown_san}. Is it the best move here?",
        "options": ["Yes, it is the best move", "No, a clearly better move exists"],
        "answer": {"outcome": outcome},
        "claims": claims, "tags": tags_for(v, node, 3, ["kind.decision"]),
        "hints": ["Play the move in your head, then ask what the opponent can do about it.",
                  "Look for the opponent's best reply: a capture, a check or a quiet defensive move.",
                  "Compare it with the other forcing moves you have (checks and captures)."],
        "explain": ex,
        "orientation": "white" if b.turn else "black",
        "difficulty_prior": {"scale": "lichess_puzzle", "rating": v["rating"], "rd": v["rd"], "plays": v["plays"], "grade": grade_of(v["rd"], v["plays"])},
        "source": {"kind": "lichess_puzzle", "id": v["id"]},
        "review": {"status": "machine-only", "reviewer": None},
    }
    return item


def build_greek(v, works, rng):
    b = chess.Board(v["fen"]); side = SIDE[b.turn]
    T = v["lichess_move"] if works else v["foil_move"]
    shown = san(b, T)
    acc_sans = [san(b, m) for m in v.get("accepted", [])]
    if works:
        claims = claim_statements(v, b, side, acc_sans)
        wc = [c for c in claims if c["type"] in ("mate_in", "material_after_move")]
        claims = wc + [c for c in claims if c not in wc and c["type"] != "move_loses"]
        outcome = "Yes, it works"
        ex = explain_text(v, b, side, acc_sans)
        extra = "The accepted move is the engine's best move. "
    else:
        claims = claim_statements(v, b, side, acc_sans)
        outcome = "No, it fails"
        ex = explain_text(v, b, side, acc_sans)
        extra = ""
    for i, c in enumerate(claims, 1):
        c["id"] = f"C{i}"
    return {
        "id": f"IL-{v['id']}-g", "skill": "ATK.GREEKGIFT.D2", "cue": 3, "task": "predict_outcome", "position": f"PL-{v['id']}",
        "prompt": f"{side} is thinking about {shown}, a bishop capture on the h-pawn with check. Does the sacrifice work, that is, does it win material or mate against the best defence?",
        "options": ["Yes, it works", "No, it fails"], "answer": {"outcome": outcome},
        "claims": claims, "tags": tags_for(v, "ATK.GREEKGIFT", 3, ["kind.decision"]),
        "hints": ["Which of your pieces can join the bishop (a knight to g5, the queen to h5), and which enemy piece covers h7 or h2?",
                  "After the bishop takes with check, where can the king go? Check every square.",
                  "Count what you win back and what you have given up."],
        "explain": ex, "orientation": "white" if b.turn else "black",
        "difficulty_prior": {"scale": "lichess_puzzle", "rating": v["rating"], "rd": v["rd"], "plays": v["plays"], "grade": grade_of(v["rd"], v["plays"])},
        "source": {"kind": "lichess_puzzle", "id": v["id"]},
        "review": {"status": "machine-only", "reviewer": None},
    }


def build_compare(v, node, rng):
    b = chess.Board(v["fen"]); side = SIDE[b.turn]
    fb = v["feedback"]
    L, T = v["lichess_move"], fb["move"]
    sL, sT = san(b, L), san(b, T)
    opts = [sL, sT]; rng.shuffle(opts)
    claims = []
    c1 = json.loads(json.dumps(next(c for c in v["claims"] if c["type"] == "best_move_in")))
    c1["statement"] = "The engine's best move is among the accepted moves, and every accepted move is within 40 centipawns of it (depth 16)."
    c2 = json.loads(json.dumps(fb["claim"])); c2["params"]["cp"] = min(c2["params"]["cp"], 600)
    c2["statement"] = f"{sT} is at least {pawns(c2['params']['cp'])} pawns worse than the best move (depth 16)."
    claims = [c1, c2]
    for i, c in enumerate(claims, 1):
        c["id"] = f"C{i}"
    return {
        "id": f"IL-{v['id']}-k", "skill": f"{node}.D1", "cue": 2, "task": "classify_position", "position": f"PL-{v['id']}",
        "prompt": f"{side} to move. Which move is better, {opts[0]} or {opts[1]}?",
        "options": opts, "answer": {"class": sL},
        "claims": claims, "tags": tags_for(v, node, 2, ["kind.decision"]),
        "hints": ["Play each move in your head and look at the position you reach.",
                  "What is the opponent's best reply to each of them?",
                  "One of the two moves loses ground to a capture or a check; find out which."],
        "explain": f"{sL} is the engine's best move; {sT} is at least {pawns(c2['params']['cp'])} pawns worse (depth 16).",
        "orientation": "white" if b.turn else "black",
        "difficulty_prior": {"scale": "lichess_puzzle", "rating": v["rating"], "rd": v["rd"], "plays": v["plays"], "grade": grade_of(v["rd"], v["plays"])},
        "source": {"kind": "lichess_puzzle", "id": v["id"]},
        "review": {"status": "machine-only", "reviewer": None},
    }


def build_line(v, node, cue, rng, blind=False):
    b = chess.Board(v["fen"]); side = SIDE[b.turn]; opp = SIDE[not b.turn]
    acc_sans = [san(b, m) for m in v["accepted"]]
    claims = claim_statements(v, b, side, acc_sans)
    fc = feedback_claim(v, b, side, len(claims))
    if fc: claims.append(fc)
    line = [v["lichess_move"]] + v["solution"][1:]
    n = len(line)
    if n == 3:
        what = f"your move, {opp}'s best reply and your next move"
    elif n == 5:
        what = f"your move, {opp}'s reply, your move, {opp}'s reply and your move"
    else:
        what = f"{n} plies in all, starting with your move ({opp} replies in between)"
    if blind:
        prompt = f"Study the position. Then every piece vanishes. Enter the line without seeing the pieces ({what}); you may type the moves."
    elif cue == 1:
        prompt = f"{side} to move. Find the best line and enter all of it: {what}."
    else:
        prompt = f"{side} to move. Enter the best line for both sides: {what}."
    expl = explain_text(v, b, side, acc_sans)
    expl = expl + " The line you enter is the engine's main line from this position (depth 16); the opponent's replies in it are the engine's choice, not a claim about every possible reply."
    item = {
        "id": f"IL-{v['id']}-L" + ("b" if blind else ""), "skill": f"{node}.D{1 if cue == 1 else 2}", "cue": cue, "task": "find_move",
        "position": f"PL-{v['id']}", "prompt": prompt,
        "answer": {"moves": v["accepted"], "line": line, "plies": n},
        "claims": claims, "tags": tags_for(v, node, cue, ["mode.variation"] + (["mode.blind"] if blind else [])),
        "hints": hints_for(node, v, b), "explain": expl,
    }
    if blind:
        item["display"] = {"study_seconds": 20, "hide": [chess.square_name(s) for s in sorted(b.piece_map())], "reveal": "after_answer"}
    fbm = feedback_for(v, b)
    if fbm: item["feedback_by_move"] = fbm
    item["orientation"] = "white" if b.turn else "black"
    item["difficulty_prior"] = {"scale": "lichess_puzzle", "rating": v["rating"], "rd": v["rd"], "plays": v["plays"], "grade": grade_of(v["rd"], v["plays"])}
    item["source"] = {"kind": "lichess_puzzle", "id": v["id"]}
    item["review"] = {"status": "needs-human", "reviewer": None}
    return item


def build_viz(rec, level, rng):
    """rec: selection record. Returns (position, item) or None."""
    b = chess.Board(rec["fen_after"])
    cands = viz_candidates(b, min_relevant=1 if level == 1 else 2)
    if not cands:
        return None
    frm, dests, rel = cands[rng.randrange(len(cands))]
    k = 1 if level == 1 else 2
    hide = sorted(rng.sample(rel, k))
    pc = b.piece_at(chess.parse_square(frm))
    side = SIDE[b.turn]
    pos = {"id": f"PL-{rec['id']}", "fen": rec["fen_after"], "family": f"FAM-LP2-{rec['id']}",
           "provenance": {"kind": "lichess_puzzle", "ref": f"lichess.org/training/{rec['id']} (FEN after the opponent's first move)", "licence": "CC0"}}
    word = "piece vanishes" if k == 1 else "pieces vanish"
    item = {
        "id": f"IL-{rec['id']}-viz", "skill": f"CAL.VISUALIZE.D{level}", "cue": level, "task": "select_squares", "position": pos["id"],
        "prompt": f"Study the position. Then {k} {word}. Tap every square the {side} {PN[pc.piece_type]} on {frm} can legally move to.",
        "answer": {"from": frm, "squares": dests},
        "claims": [{"id": "C1", "type": "legal_destinations", "params": {"from": frm, "to": dests},
                    "statement": f"These are all of the {PN[pc.piece_type]}'s legal moves in the full position."}],
        "tags": ["theme.visualise", "node.CAL.VISUALIZE", "kind.puzzle", "tier.3", f"cue.{level}", "lang.en", "mode.visualise"],
        "hints": ["Follow each line from the piece one square at a time and stop at the first piece you remember.",
                  "A piece of your own stops you before its square. An enemy piece can be captured, and it stops you there.",
                  f"Something stood on {hide[0]}."],
        "explain": "The answer is the full set of legal moves in the real position: a hidden piece of your own blocks a line, and a hidden enemy piece can be captured but also blocks the line behind it. Holding the blockers in mind is what calculation needs.",
        "display": {"study_seconds": 12 + 4 * k, "hide": hide, "reveal": "after_answer"},
        "orientation": "white" if b.turn else "black",
        "source": {"kind": "lichess_puzzle", "id": rec["id"]},
        "review": {"status": "machine-only", "reviewer": None},
    }
    return pos, item


def stratified(vs, n, key=lambda v: v["bin"]):
    """Pick n items spread over rating bins (the same allocation rule as the first corpus), keeping the incoming preference order."""
    bins = defaultdict(list)
    for v in vs:
        bins[key(v)].append(v)
    order_extra = [3, 2, 4, 1, 5, 0, 6]
    cap = {i: len(bins[i]) for i in range(7)}
    base, extra = divmod(n, 7)
    w = {i: base + (1 if order_extra.index(i) < extra else 0) for i in range(7)}
    quota = {i: min(w[i], cap[i]) for i in range(7)}
    rem = sum(w[i] - quota[i] for i in range(7))
    while rem > 0:
        prog = False
        for i in order_extra:
            if rem > 0 and quota[i] < cap[i]:
                quota[i] += 1; rem -= 1; prog = True
        if not prog:
            break
    pick = []
    for i in range(7):
        pick += bins[i][:quota[i]]
    return pick


def main():
    rng = random.Random(f"{L2_SEED}-build")
    sel = read_json(L2_OUT / "selection.json")["puzzles"]
    sel_by_id = {r["id"]: r for r in sel}
    order = {r["id"]: i for i, r in enumerate(sel)}
    verdicts = [json.loads(l) for l in (L2_OUT / "verdicts.jsonl").read_text(encoding="utf-8").splitlines() if l.strip()]
    ok_by_bucket = defaultdict(list)
    for v in verdicts:
        if v.get("ok") and v["id"] in order and sel_by_id[v["id"]]["bucket"] == v["bucket"]:
            ok_by_bucket[v["bucket"]].append(v)
    for k in ok_by_bucket:
        ok_by_bucket[k].sort(key=lambda v: order[v["id"]])

    per_node = defaultdict(lambda: dict(positions=[], items=[]))
    report = {}

    def add(node, pos, item):
        pn = per_node[node]
        if not any(p["id"] == pos["id"] for p in pn["positions"]):
            pn["positions"].append(pos)
        pn["items"].append(item)

    def cue1_set(use, n1, bk=None):
        """Indices (into `use`, sorted by rating) of the items that also get a theme-naming cue-1 sibling. Items that carry another
        tactical motif tag are avoided, because the sibling's prompt names ONE theme."""
        k = min(n1, len(use))
        if not use or k <= 0:
            return set()
        def conflicts(v):
            th = set(v["themes"])
            own = bk["theme"] if bk else None
            other = (th & (MOTIFS - {"sacrifice", "quietMove"})) - {own}
            pats = (th & set(MATE_PATTERNS)) - {own}
            return len(other) + len(pats)
        clean = [i for i, v in enumerate(use) if conflicts(v) == 0]
        if len(clean) < k:
            clean = sorted(range(len(use)), key=lambda i: (conflicts(use[i]), i))[:max(k, len(clean))]
            clean.sort()
        k = min(k, len(clean))
        return {clean[round(i * (len(clean) - 1) / max(1, k - 1))] for i in range(k)}

    for key, bk in sorted(BUCKETS.items(), key=lambda kv: (kv[1]["order"], kv[0])):
        if bk.get("off"):
            continue
        vs = ok_by_bucket.get(key, [])
        node = bk["node"]
        rep = dict(verified=len(vs), delivered=0, c1=0, extra=0)
        if bk["use"] == "viz":
            n = bk["n_c3"]
            recs = [r for r in sel if r["bucket"] == key]
            made = 0
            for r in recs:
                level = 1 if made < n // 2 else 2
                out = build_viz(r, level, random.Random(f"{L2_SEED}-viz-{r['id']}"))
                if out is None:
                    continue
                add(node, *out); made += 1
                if made >= n:
                    break
            rep["delivered"] = made
            report[key] = rep
            continue
        if key == "ATK.GREEKGIFT:works":
            # the first part of the verified pool becomes cue-1 find_move items (the learner is told "Greek gift"); the rest feed the yes/no items
            # the cue-1 find items name ONE theme, so only puzzles that carry no other tactical-motif tag may be used for them
            clean_all = [v for v in vs if not ((set(v["themes"]) & (MOTIFS - {"sacrifice", "quietMove"})) - {bk["theme"]})]
            finds = stratified(clean_all, min(14, len(clean_all)))
            rest = stratified([v for v in vs if v not in finds], max(0, min(len(vs) - len(finds), bk["n_c3"] - len(finds))))
            for v in sorted(finds, key=lambda v: v["rating"]):
                it = build_find(v, 1, node, "bishop sacrifice on h7 (Greek gift)", "Theme")
                it["review"]["status"] = "needs-human"
                add(node, position_of(v), it)
            for v in rest:
                add(node, position_of(v), build_greek(v, True, rng))
            rep["delivered"] = len(finds) + len(rest); rep["c1"] = len(finds)
            report[key] = rep
            continue
        if key == "ATK.GREEKGIFT:fails":
            for v in stratified(vs, min(len(vs), bk["n_c3"])):
                add(node, position_of(v), build_greek(v, False, rng))
                rep["delivered"] += 1
            report[key] = rep
            continue
        if bk["use"] == "compare":
            vs = [v for v in vs if v.get("feedback")]      # a compare item needs a verified wrong alternative
        use = stratified(vs, bk["n_c3"])
        use.sort(key=lambda v: v["rating"])
        if bk["use"] == "predict":
            yes = no = 0
            pool = list(use); rng.shuffle(pool)
            for v in pool:
                want_no = bool(v.get("feedback")) and no <= yes
                add(node, position_of(v), build_predict(v, node, not want_no, rng))
                if want_no: no += 1
                else: yes += 1
            rep["delivered"] = len(pool); rep["yes"] = yes; rep["no"] = no
        elif bk["use"] == "compare":
            pool = [v for v in use if v.get("feedback")]
            for v in pool:
                add(node, position_of(v), build_compare(v, node, rng))
            rep["delivered"] = len(pool)
        elif bk["use"] == "line":
            blind = key == "CAL.BLIND"
            c1l = cue1_set(use, bk["n_c1"], bk) if not blind else set()
            for i, v in enumerate(use):
                cue = 1 if (not blind and i in c1l) else 3
                add(node, position_of(v), build_line(v, node, cue, rng, blind=blind))
            rep["delivered"] = len(use)
        else:
            c1 = cue1_set(use, bk["n_c1"], bk)
            label = bk["label"]
            kind = "Theme"
            if key.startswith("TAC.MATE-PATTERNS"):
                kind = "Mating pattern"; label = bk["label"]
            if key == "FND.SPECIAL":
                kind = "Special move"; label = "castling"
            for i, v in enumerate(use):
                pos = position_of(v)
                add(node, pos, build_find(v, 3, node, label, kind))
                if i in c1:
                    add(node, pos, build_find(v, 1, node, label, kind))
            rep["delivered"] = len(use); rep["c1"] = len(c1)
        report[key] = rep

    # --- pack nodes into files (<= 115 items, never splitting a node) -------------------------------------------------------
    groups = defaultdict(list)
    for node in NODE_ORDER:
        if node in per_node:
            groups[FILE_GROUP[node.split(".")[0]]].append(node)
    written = []
    for g, nodes in groups.items():
        files, cur, cur_n = [], [], 0
        for node in nodes:
            n = len(per_node[node]["items"])
            if cur and cur_n + n > 115:
                files.append(cur); cur, cur_n = [], 0
            cur.append(node); cur_n += n
        if cur:
            files.append(cur)
        for i, ns in enumerate(files, 1):
            positions, items = [], []
            for node in ns:
                positions += per_node[node]["positions"]; items += per_node[node]["items"]
            name = f"{PREFIX}{g}-{i}.json"
            tmp = ITEMS_OUT / (name + ".tmp")
            tmp.write_text(json.dumps({"positions": positions, "items": items}, indent=1, ensure_ascii=False), encoding="utf-8")
            tmp.replace(ITEMS_OUT / name)
            written.append((name, len(positions), len(items), ns))
    # remove stale lp2 files from earlier runs
    keep = {w[0] for w in written} | set(EXTRA_FILES)
    for p in ITEMS_OUT.glob(PREFIX + "*.json"):
        if p.name not in keep:
            p.unlink()
    for w in written:
        print(w[0], "positions", w[1], "items", w[2], w[3])
    write_json(L2_OUT / "build_report.json", dict(by_bucket=report, files=[(w[0], w[1], w[2], w[3]) for w in written],
                                                 per_node={n: len(d["items"]) for n, d in per_node.items()}))
    print({n: len(d["items"]) for n, d in per_node.items()})
    print("total items", sum(len(d["items"]) for d in per_node.values()))


if __name__ == "__main__":
    main()
