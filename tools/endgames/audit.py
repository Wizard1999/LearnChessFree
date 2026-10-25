"""Independent audit of the endgame bank (content/items/end-*.json). It does not replace tools/validate.py (which checks the claims); it checks
the contract around them: ids, structure, 'only means only', hints that must not give the answer away, contrast pairs that must share a family,
duplicate positions across the whole content folder, and wording rules from docs/authoring-guide.md.

    ./tools/.venv/Scripts/python.exe -I tools/endgames/audit.py          # prints problems (exit code 1 if any) and a one-line summary
"""
from __future__ import annotations

import json
import re
import sys
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(ROOT / "tools"))
import chess  # noqa: E402

ITEMS = ROOT / "content" / "items"
SKILLS = ROOT / "content" / "skills"
TASKS = {"find_move", "select_squares", "predict_outcome", "classify_position", "threat_detection", "play_out"}
BAD_WORDS = re.compile(r"\b(always|never|obviously|clearly|must win|guaranteed)\b", re.I)


def fen_key(f):
    return " ".join(f.split()[:4])


_PIECES = {"two bishops": "bb", "two knights": "nn", "bishop and knight": "bn", "rook": "r", "queen": "q", "knight": "n", "bishop": "b"}


def material_in_prompt(prompt):
    """'X to move: two bishops against a lone king.' -> ['bb', ''] (sorted letters of each side's non-king pieces); None if no such phrase."""
    m = re.search(r": (two bishops|two knights|bishop and knight|rook|queen|knight|bishop) against (a lone king|a (?:bishop|knight|rook|queen))\b", prompt)
    if not m:
        return None
    left = "".join(sorted(_PIECES[m.group(1)]))
    right = "" if m.group(2) == "a lone king" else _PIECES[m.group(2)[2:]]
    return [left, right]


def main():
    skills = {json.loads(p.read_text(encoding="utf-8"))["id"] for p in SKILLS.glob("*.json")}
    problems = []

    def bad(where, msg):
        problems.append(f"{where}: {msg}")

    mine = sorted(ITEMS.glob("end-*.json"))
    # FEN keys of everything that is not mine
    foreign = defaultdict(list)
    for p in sorted((ROOT / "content").rglob("*.json")):
        if "_evidence" in p.parts or p in mine:
            continue
        try:
            d = json.loads(p.read_text(encoding="utf-8"))
        except Exception:
            continue

        def walk(o):
            if isinstance(o, dict):
                for k, v in o.items():
                    if k == "fen" and isinstance(v, str):
                        foreign[fen_key(v)].append(p.name)
                    else:
                        walk(v)
            elif isinstance(o, list):
                for v in o:
                    walk(v)
        walk(d)

    ids_item, ids_pos = Counter(), Counter()
    own_fens = defaultdict(list)
    n_items = 0
    for path in mine:
        d = json.loads(path.read_text(encoding="utf-8"))
        pos = {}
        for p in d["positions"]:
            ids_pos[p["id"]] += 1
            b = chess.Board(p["fen"])
            if not b.is_valid():
                bad(path.name, f"{p['id']} illegal position")
            if len(b.piece_map()) > 7:
                bad(path.name, f"{p['id']} more than 7 pieces")
            if not p.get("family"):
                bad(path.name, f"{p['id']} has no family")
            if not p["id"].startswith("PE-"):
                bad(path.name, f"{p['id']} wrong prefix")
            pos[p["id"]] = p
            own_fens[fen_key(p["fen"])].append(path.name)
            if fen_key(p["fen"]) in foreign:
                bad(path.name, f"{p['id']} FEN also in {sorted(set(foreign[fen_key(p['fen'])]))[:3]}")
        cg_fams = defaultdict(set)
        cg_roles = defaultdict(list)
        for it in d["items"]:
            n_items += 1
            ids_item[it["id"]] += 1
            w = f"{path.name}:{it['id']}"
            if not it["id"].startswith("IE-"):
                bad(w, "wrong prefix")
            if it["task"] not in TASKS:
                bad(w, f"unknown task {it['task']}")
            node, _, depth = it["skill"].rpartition(".")
            if node not in skills:
                bad(w, f"unknown skill {node}")
            if it["position"] not in pos:
                bad(w, "position missing")
                continue
            p = pos[it["position"]]
            b = chess.Board(p["fen"])
            tags = it.get("tags", [])
            for need in ("node.", "tier.", "cue.", "kind.", "family."):
                if not any(t.startswith(need) for t in tags):
                    bad(w, f"no {need} tag")
            if f"family.{p['family']}" not in tags:
                bad(w, "family tag differs from the position's family")
            if it["cue"] not in (1, 2, 3, 4):
                bad(w, "cue")
            hints = it.get("hints", [])
            if len(hints) != 3:
                bad(w, f"{len(hints)} hints")
            if not it.get("claims"):
                bad(w, "no claims")
            review = it.get("review", {}).get("status")
            if review not in ("machine-only", "needs-human"):
                bad(w, f"review status {review}")
            text = " ".join([it["prompt"], it["explain"]] + hints + list(it.get("feedback_by_move", {}).values()))
            unquoted = re.sub(r'"[^"]*"', "", text)          # a conjecture quoted in a lab item is under test, not asserted
            if BAD_WORDS.search(unquoted):
                bad(w, f"unconditioned wording: {BAD_WORDS.search(unquoted).group(0)}")
            nsent = len(re.findall(r"[.!?](?:\s|$)", it["explain"]))
            if nsent > 3:
                bad(w, f"explain has {nsent} sentences")
            if it["cue"] >= 3 and re.search(r"\bidea\b", it["prompt"], re.I):
                bad(w, "a cue-3/4 prompt names the idea")
            mm = material_in_prompt(it["prompt"])
            if mm is not None:
                sides = sorted(["".join(sorted(chess.piece_symbol(p.piece_type) for p in b.piece_map().values() if p.piece_type != chess.KING and p.color == c))
                                for c in (chess.WHITE, chess.BLACK)])
                if sides != sorted(mm):
                    bad(w, f"prompt material {mm} differs from the position {sides}")
            # task-specific
            if it["task"] in ("predict_outcome", "classify_position"):
                opts = it.get("options")
                if not opts or it["answer"].get("options") != opts:
                    bad(w, "options missing or differ from answer.options")
                else:
                    a = it["answer"].get("outcome", it["answer"].get("class"))
                    if a not in opts:
                        bad(w, "answer not among options")
            if it["task"] == "find_move":
                acc = it["answer"]["moves"]
                legal = {m.uci() for m in b.legal_moves}
                if not acc or any(m not in legal for m in acc):
                    bad(w, "accepted move illegal or empty")
                for m in acc:
                    san = b.san(chess.Move.from_uci(m))
                    for h in hints:
                        if m in h or re.search(r"(?<![A-Za-z0-9])" + re.escape(san.rstrip("+#")) + r"(?![A-Za-z0-9])", h):
                            bad(w, f"a hint names the answer move {san}")
                if any(t in ("kind.only-move", "kind.few-moves") for t in tags):
                    covered = {c["params"]["move"] for c in it["claims"] if "move" in c["params"]}
                    if covered != legal:
                        bad(w, f"'only' item: claims cover {len(covered)} of {len(legal)} legal moves")
                    tbm = {c["params"]["move"]: c["params"]["result"] for c in it["claims"] if c["type"] == "tablebase" and "move" in c["params"]}
                    if tbm:
                        keep = next((c["params"]["result"] for c in it["claims"] if c["type"] == "tablebase" and "move" not in c["params"]), None)
                        if keep and any(tbm.get(m) != keep for m in acc):
                            bad(w, "an accepted move does not keep the result")
                        if keep and any(tbm.get(m) == keep for m in legal - set(acc)):
                            bad(w, "a rejected move keeps the result")
                for u in it.get("feedback_by_move", {}):
                    if u not in legal:
                        bad(w, f"feedback for illegal move {u}")
            if it["task"] == "play_out":
                a = it["answer"]
                if a.get("goal") not in ("win", "draw", "hold") or not isinstance(a.get("max_moves"), int):
                    bad(w, "play_out answer")
            cg = it.get("contrast_group")
            if cg:
                cg_fams[cg].add(p["family"])
                cg_roles[cg].append(next((t for t in tags if t.startswith("role.")), None))
        for cg, fams in cg_fams.items():
            if len(fams) != 1:
                bad(path.name, f"contrast group {cg} spans families {sorted(fams)}")
    for k, v in ids_item.items():
        if v > 1:
            bad("ids", f"item id {k} used {v} times")
    for k, v in ids_pos.items():
        if v > 1:
            bad("ids", f"position id {k} used {v} times")
    # ids unique against the rest of the content folder
    other_ids = set()
    for p in (ROOT / "content").rglob("*.json"):
        if "_evidence" in p.parts or p in mine:
            continue
        try:
            txt = p.read_text(encoding="utf-8")
        except Exception:
            continue
        other_ids.update(re.findall(r'"id":\s*"((?:IE|PE)-[A-Za-z0-9-]+)"', txt))
    clash = (set(ids_item) | set(ids_pos)) & other_ids
    if clash:
        bad("ids", f"ids also used in other files: {sorted(clash)[:5]}")
    for k, files in own_fens.items():
        if len(files) > 1:
            bad("fens", f"{k} used in {sorted(set(files))}")
    print(f"audited {n_items} items in {len(mine)} files; {len(problems)} problems")
    for pr in problems[:80]:
        print("  ", pr)
    if len(problems) > 80:
        print(f"   ... and {len(problems) - 80} more")
    sys.exit(1 if problems else 0)


if __name__ == "__main__":
    main()
