"""lp2: fill the generated parts of docs/exercises-themes.md (tables, per-node notes, gaps, gates) from the files on disk.

Run after l2_report.py. The document keeps its hand-written method text; the blocks between <!--NAME--> and <!--/NAME--> are replaced on every run
(the first run replaces the @@NAME@@ placeholders).

    python l2_doc.py
"""
import sys as _s, os as _o; _s.path.insert(0, _o.path.dirname(_o.path.abspath(__file__)))
import json, re
from collections import Counter, defaultdict
from l2_common import *

DOC = ROOT / "docs" / "exercises-themes.md"

# what each node's items are, in words (the selection rule is a predicate in l2_common.py; the claim mode is what the validator checks)
RULE = {
    "ATK.CASTLED": "Lichess kingsideAttack / queensideAttack, not mate in one, without exposedKing / attackingF2F7 (those go to ATK.CENTER)",
    "ATK.CENTER": "exposedKing or attackingF2F7, opening or middlegame, the enemy king on the d, e or f file on its back two ranks, a queen on the board",
    "ATK.COMMIT": "an attack theme plus a sacrifice and a line of at least four plies: the attack has to be carried through",
    "ATK.PACE": "an attack theme where the first move is quiet (no capture, check, king move or promotion): strengthen before striking",
    "ATK.PAWNSTORM": "kings on opposite wings, the first move a non-capturing pawn move on the 4th rank or higher within two files of the enemy king",
    "ATK.GREEKGIFT": "the first move is a bishop capture with check on h7 / h2 (works) or such a capture exists but loses (fails); yes / no items, plus cue-1 find items",
    "ATK.SUPERIORITY": "attack-theme puzzles with a tempting capture or check; the learner judges 'is this the best move?'",
    "TAC.UNDERPROMOTE": "the first move promotes to a rook, bishop or knight; promoting to a queen is shown to be worse",
    "TAC.STALEMATE-TRICK": "equality endgames from the puzzle data whose engine line reaches a stalemate, plus constructed positions (tablebase draw, solver at least 3 points behind)",
    "TAC.PERPETUAL": "equality puzzles in which at least two of the solver's moves in the line are checks",
    "TAC.DESPERADO": "a piece with no safe square captures, is recaptured, and the line continues with a further capture",
    "TAC.OVERLOAD": "the defender recaptures and thereby leaves a piece worth at least three points without its only protector",
    "TAC.COMBO": "two or more tactical motif tags, a line of at least five plies, a winning or mating result",
    "TAC.MATE-PATTERNS": "Lichess tags for twelve named mating patterns (Anastasia, Arabian, Boden, double bishop, hook, smothered, dovetail, opera, Pillsbury, epaulette, corner, Morphy)",
    "SAC.TYPES": "sacrifice puzzles that are not attack-theme puzzles, plus 'does the sacrifice work?' yes / no items",
    "FND.SPECIAL": "castling puzzles in which castling itself is the first move",
    "END.ZUGZWANG": "zugzwang-tagged endgames, at most 14 pieces (exact tablebase for 7 or fewer)",
    "END.BREAKTHROUGH": "pawn endings in which a pawn is pushed and taken by a pawn and the line goes on (a sacrifice that opens the road)",
    "END.QUEEN-PAWN": "queen against one or two advanced pawns (sixth rank or further)",
    "END.THEORY.QvR": "queen against rook, pawns at most two in all",
    "END.MINOR": "bishop or knight endings without queens or rooks",
    "END.ROOK-ACTIVE": "rook endings with rooks and pawns only",
    "END.KING-ACTIVE": "endings without queens or rooks where the first move is a king move",
    "DEF.RESOURCES": "defensiveMove puzzles, and equality puzzles that are not endgames; the claim is an 'only move' hold",
    "DEF.COUNTER": "the opponent would mate in one if the mover passed, and the best move is a check or capture with check",
    "DEF.TRADES": "a defensive exchange: an equal-value capture of a minor piece or more that is recaptured",
    "DEF.FORTRESS": "endings with at most seven pieces, tagged equality, the solver at least two points behind; the tablebase says draw",
    "INI.INITIATIVE": "winning lines of at least five plies where at least half of the solver's moves are checks and every opponent reply is clearly forced",
    "INI.COMPENSATION": "real games (Lichess 2013-01 sample): is the side to move, down at least two points of material, at least level or clearly worse? Classes matched by deficit and phase",
    "CAL.VISUALIZE": "a middlegame position; one or two pieces vanish; tap every legal destination of one piece (rules only)",
    "CAL.DEPTH": "forced mates in four and in five moves (find the first move)",
    "CAL.CANDIDATES": "three-ply lines (your move, the reply, your move) entered whole",
    "CAL.TREE": "five-ply lines entered whole",
    "CAL.BLIND": "five- and seven-ply lines entered after every piece has vanished",
    "CAL.ENDURANCE": "seven- and nine-ply lines entered whole",
    "CAL.DEFENSE": "yes / no: does a tempting capture or check survive the best reply?",
    "CAL.COMPARE": "which of two moves is better (one best move, one verified-worse tempting move)",
}
NODE_ORDER = ["ATK.CASTLED", "ATK.CENTER", "ATK.COMMIT", "ATK.PACE", "ATK.PAWNSTORM", "ATK.GREEKGIFT", "ATK.SUPERIORITY",
              "TAC.UNDERPROMOTE", "TAC.STALEMATE-TRICK", "TAC.PERPETUAL", "TAC.DESPERADO", "TAC.OVERLOAD", "TAC.COMBO", "TAC.MATE-PATTERNS",
              "SAC.TYPES", "FND.SPECIAL", "END.ZUGZWANG", "END.BREAKTHROUGH", "END.QUEEN-PAWN", "END.THEORY.QvR", "END.MINOR", "END.ROOK-ACTIVE",
              "END.KING-ACTIVE", "DEF.RESOURCES", "DEF.COUNTER", "DEF.TRADES", "DEF.FORTRESS", "INI.INITIATIVE", "INI.COMPENSATION",
              "CAL.VISUALIZE", "CAL.DEPTH", "CAL.CANDIDATES", "CAL.TREE", "CAL.BLIND", "CAL.ENDURANCE", "CAL.DEFENSE", "CAL.COMPARE"]


def load():
    items, pos = [], {}
    ev_pass = Counter(); ev_all = Counter(); item_ok = {}
    for f in sorted(ITEMS_DIR.glob(PREFIX + "*.json")):
        d = json.loads(f.read_text(encoding="utf-8"))
        evf = ROOT / "content" / "_evidence" / (f.stem + ".evidence.json")
        ev = json.loads(evf.read_text(encoding="utf-8")) if evf.exists() else []
        byi = defaultdict(list)
        for r in ev:
            byi[r["item"]].append(r["result"] == "pass")
        for it in d["items"]:
            it["_file"] = f.name
            r = byi.get(it["id"], [])
            it["_validated"] = bool(r) and all(r) and len(r) == len(it["claims"])
            items.append(it)
        for p in d["positions"]:
            pos[p["id"]] = p
    return items, pos


def node_of(it):
    return it["skill"].rpartition(".")[0]


def build_tables(items):
    n = len(items)
    ok = sum(1 for i in items if i["_validated"])
    cue = Counter(i["cue"] for i in items); task = Counter(i["task"] for i in items); rev = Counter(i["review"]["status"] for i in items)
    ctypes = Counter(c["type"] for i in items for c in i["claims"])
    nclaims = sum(ctypes.values())
    fams = {p for p in set(i["position"] for i in items)}
    L = [f"**{n} items on {len(fams)} positions in {len(set(i['_file'] for i in items))} files** (`content/items/lp2-*.json`), {len(set(node_of(i) for i in items))} nodes, "
         f"{nclaims} claims, of which the validator passes **{ok} items / {sum(1 for i in items for _ in i['claims'] if i['_validated'])} claims** at the time of writing "
         "(an item counts only when every claim of it has a passing record in `content/_evidence/`).", ""]
    L += ["| measure | counts |", "|---|---|",
          "| cue level | " + ", ".join(f"cue {k}: {v}" for k, v in sorted(cue.items())) + " |",
          "| task | " + ", ".join(f"{k}: {v}" for k, v in task.most_common()) + " |",
          "| review status | " + ", ".join(f"{k}: {v}" for k, v in rev.most_common()) + " |",
          "| claim types | " + ", ".join(f"`{k}`: {v}" for k, v in ctypes.most_common()) + " |", ""]
    # funnel per bucket
    verdicts = [json.loads(l) for l in (L2_OUT / "verdicts.jsonl").read_text(encoding="utf-8").splitlines() if l.strip()]
    by = defaultdict(list)
    for v in verdicts:
        by[v["bucket"]].append(v)
    sel = Counter(r["bucket"] for r in json.loads((L2_OUT / "selection.json").read_text(encoding="utf-8"))["puzzles"])
    rep = json.loads((L2_OUT / "build_report.json").read_text(encoding="utf-8"))["by_bucket"] if (L2_OUT / "build_report.json").exists() else {}
    L += ["### Funnel per bucket [V]", "",
          "`selected` = drawn from the database by the seeded rule; `verified` = passed every engine and tablebase check; `delivered` = items written (cue-1 siblings and yes / no pairs included). "
          "The difference selected minus verified is the drop; the commonest reasons are in the last column.", "",
          "| bucket | node | selected | verified | delivered | commonest drop reasons |", "|---|---|---|---|---|---|"]
    for k, b in sorted(BUCKETS.items(), key=lambda kv: (kv[1]["node"], kv[0])):
        vs = by.get(k, [])
        if not vs and k not in sel and not b.get("off"):
            if b["use"] != "viz":
                continue
        okn = sum(1 for v in vs if v.get("ok"))
        rs = Counter(re.sub(r"[0-9]+ cp", "N cp", (v.get("reason") or "?"))[:70] for v in vs if not v.get("ok"))
        d = rep.get(k, {})
        name = k + (" (switched off)" if b.get("off") else "")
        L.append(f"| {name} | {b['node']} | {sel.get(k, len(vs))} | {okn} | {d.get('delivered', 0)} | " +
                 ("; ".join(f"{r} ({c})" for r, c in rs.most_common(2)) or "-") + " |")
    L += ["",
          "**Constructed stalemate positions [V]** (`l2_stalemate_gen2.py`, outside the table). 47,600 seeded probes in seven material sets gave 118 positions whose depth-12 engine line reaches a stalemate; "
          "109 of those are tablebase draws, 100 have one to three drawing moves; the first 36 that also passed the depth-16 line and the material rule were kept (generation stopped at its target of 36), "
          "and 26 remain after balancing the material sets (none more than 13) = 26 cue-3 items and 7 cue-1 siblings. K+N v K+Q gave nothing, K+P(7th) v K+R almost nothing (sets in which the weaker side cannot hold).",
          "",
          "**Compensation positions [V]** (`l2_comp.py`, outside the table). 3,000 game positions screened at depth 14: 304 looked level for the side that is down material, 2,366 clearly worse. "
          "272 matched jobs were verified at depth 16 (`eval_range` + `quiet_position`), 170 passed, and 30 items remain (13 'at least level', 17 'clearly worse')."]
    return "\n".join(L)


def build_nodes(items):
    per = defaultdict(list)
    for i in items:
        per[node_of(i)].append(i)
    L = ["| node | items | by cue | tasks | what is in it | claims (most common) | validator |", "|---|---|---|---|---|---|---|"]
    for node in NODE_ORDER:
        its = per.get(node, [])
        if not its:
            continue
        cue = Counter(i["cue"] for i in its); task = Counter(i["task"] for i in its)
        ct = Counter(c["type"] for i in its for c in i["claims"])
        okn = sum(1 for i in its if i["_validated"])
        L.append(f"| `{node}` | {len(its)} | " + ", ".join(f"c{k}:{v}" for k, v in sorted(cue.items())) + " | " +
                 ", ".join(f"{k}:{v}" for k, v in task.most_common()) + f" | {RULE.get(node, '')} | " +
                 ", ".join(f"{k}:{v}" for k, v in ct.most_common(3)) + f" | {okn}/{len(its)} |")
    return "\n".join(L)


def build_gaps(items):
    have = Counter()
    for f in ITEMS_DIR.glob("*.json"):
        try:
            d = json.loads(f.read_text(encoding="utf-8"))
        except Exception:
            continue
        for it in d.get("items", []):
            have[it["skill"].rpartition(".")[0] if re.search(r"\.D\d$", it["skill"]) else it["skill"]] += 1
    ids = sorted(json.loads(p.read_text(encoding="utf-8")).get("id", p.stem) for p in (ROOT / "content" / "skills").glob("*.json"))
    fam = ("ATK", "DEF", "INI", "SAC", "CAL", "TAC", "END", "FND")
    empty = [i for i in ids if i.split(".")[0] in fam and have[i] == 0]
    L = ["## What this tranche does not cover", ""]
    L += ["- **Nodes of the families this tranche targets that have no item anywhere in `content/items` (snapshot when this page was generated; other authors were writing items at the same time):** " +
          (", ".join(f"`{e}`" for e in empty) if empty else "none") + ".",
          "- **Why `END.LUCENA` and `END.PHILIDOR` got no items from this tranche [V].** The first version selected K+R against K+R+P puzzles. The tablebase stage showed that 95 of the 96 puzzles it picked were *wins* for the side to move: in the puzzle data the solver always wins by a tactic (a skewer or a fork that takes the rook), never by Lucena or Philidor technique. Both buckets are switched off (`off=True` in `l2_common.py`, their old verdicts stay in `verdicts.jsonl`). Those two nodes need constructed positions with a tablebase check, built the way the constructed stalemate positions are.",
          "- **Why the first `DEF.FORTRESS` bucket was replaced [V].** It took 'equality or defensiveMove' endings; all 48 picked were tablebase *wins* for the side to move (strict-quality puzzles tagged crushing). The replacement requires the Lichess tag `equality` and a tablebase draw.",
          "- **Nodes that are about judgement, not a position:** `INI.THREAT` (the held threat) and `DEF.DIAGNOSE` (diagnosing a worse position) have no item anywhere; `DEF.WAIT` and `DEF.SHELTER` have only the few items other authors wrote. The puzzle data has no tag for them and a machine claim for them would be a claim about a plan, not a position; they need lessons and human-reviewed items.",
          "- **`CAL.DEPTH` ('how deep, and when to stop')** has only its checkable half here: forced mates in four and five moves (the claim is a forced mate at depth 16). The metacognitive half (stopping rules) is lesson material.",
          "- **Tag noise [S].** Lichess themes are assigned by its own scripts; a label can be wrong. Labels appear only in cue-1 siblings (marked needs-human), in the first two hints and in tags, never as a claim.",
          "- **Depth.** Every engine claim is at depth 16 with one thread and Stockfish 19 lite. A position that needs deeper search was dropped when the engine did not agree with the Lichess solution, but a shared blind spot of engines at this depth cannot be excluded.",
          "- **Strong players have not read any of these items.** `machine-only` means every sentence shown is claim-checked, not that a human looked.",
          "- **Whole-line items check the first move and the result, not each reply** (see section 3). The generator additionally checked every ply (best move and a gap of at least 40 cp to the second best) but that is not a validator claim.",
          "- **The `INI.COMPENSATION` verdict is an engine verdict at fixed depth, not a proof;** the class labels say so in `explain`.",
          "- **Generated stalemate positions are constructions,** not game positions, in a handful of material sets; they teach the idea, not how often it arises.",
          "- **Age and rating.** Puzzle ratings are Lichess's (G1 for strict-quality puzzles, G0 for the relaxed rare-theme classes); they are priors, not measurements on our learners."]
    return "\n".join(L)


def build_gates(items):
    rev = Counter(i["review"]["status"] for i in items)
    L = ["## Gates before these items are used with a learner", "",
         f"1. `tools/validate.py` passes every claim of every item (`python l2_report.py` counts; failures are pruned by `l2_prune.py`, never loosened). Items needing a human: {rev.get('needs-human', 0)}; machine-only: {rev.get('machine-only', 0)}.",
         "2. A strong player should read a sample of the `needs-human` items (all cue-1 siblings, all whole-line items) and the tablebase endings; the labels and the sentence 'the engine's main line' are the points to check.",
         "3. Cue-1 siblings share their position (and family) with the cue-3 item: the scheduler must never put the two on both sides of a practice / test split. Families are `FAM-LP2-<puzzle id>`; the generated stalemate positions share a family per material set and pawn file.",
         "4. The app ships an item only when its evidence hash matches: after any edit of an item file the validator must be run again (`tools/build_content.py` reports the shipped counts).",
         "5. Nothing here is a rating. `difficulty_prior` is the Lichess puzzle rating with a grade (G1 or G0); learner and item ratings come from use.",
         "6. **Open integration defect [V].** The app's `src/content.smoke.test.ts` over the shipped items passes 7 of 8 tests with these items (legal answers, options for predict / classify items, hidden squares and study times of the memory drills are fine). The one failure is its skill-id pattern `^[A-Z]{2,5}(\\.[A-Z0-9-]+)+\\.D[0-5]$`, which rejects the lowercase `v` of the node `END.THEORY.QvR` (37 lp2 items, ids `END.THEORY.QvR.D1/D2`, which are the ids defined in `content/skills`). This tranche did not touch `app/` or `content/skills/`; the owner should either allow lower case in the pattern or rename the node."]
    return "\n".join(L)


def fill(text, name, body):
    block = f"<!--{name}-->\n{body}\n<!--/{name}-->"
    if f"@@{name}@@" in text:
        return text.replace(f"@@{name}@@", block)
    pat = re.compile(rf"<!--{name}-->.*?<!--/{name}-->", re.S)
    if pat.search(text):
        return pat.sub(lambda m: block, text)
    return text + "\n\n" + block


def main():
    items, pos = load()
    text = DOC.read_text(encoding="utf-8")
    text = fill(text, "TABLES", "## Results\n\n" + build_tables(items))
    text = fill(text, "NODES", "## Items per node\n\n" + build_nodes(items))
    text = fill(text, "GAPS", build_gaps(items))
    text = fill(text, "GATES", build_gates(items))
    tmp = DOC.with_suffix(".md.tmp")
    tmp.write_text(text, encoding="utf-8")
    tmp.replace(DOC)
    print("doc updated:", len(items), "items")


if __name__ == "__main__":
    main()
