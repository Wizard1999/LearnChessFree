#!/usr/bin/env python3
"""Builds the recommended learning path: content/path.json (and a copy in app/public/content/path.json).

    ./tools/.venv/Scripts/python.exe -I tools/build_path.py [--check]

The skill graph and the strands are the REFERENCE library (everything is reachable from the map and from the section list).
The path is a separate thing: the order a new player should take the lessons, mixing the strands by stage so that nobody meets
rook technique, sacrifices or long calculation before they can start, play and finish a game (review of 30 Oct 2026, docs/path-design.md).

How the order is made (so it can be maintained by rule, not by hand-editing 400 ids):
1. every lesson gets a stage from its skill tier and depth (STAGE_BY_TIER), with a few strand rules and a few named overrides;
2. inside a stage, lessons run in an explicit hand-made order where one is given (the first stages), else by tier, prerequisite rank, skill, depth;
3. a topological pass then moves any lesson behind the lessons of its own prerequisites, so the published order can never contradict the graph.
--check validates an existing file instead of writing: every lesson exactly once, no lesson before a prerequisite lesson, stages in order.
"""
import sys as _s, pathlib as _p; _s.path.insert(0, str(_p.Path(__file__).resolve().parent))  # allow `python -I tools/<script>.py`
import heapq, json, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
C = ROOT / "content"

STAGES = [
    ("S0", "Moves and the board", "You can name the squares and move every piece."),
    ("S1", "Legal play", "You can tell check, checkmate and stalemate apart and play only legal moves."),
    ("S2", "First complete games", "You can start, play and finish a game with simple opening habits, and look back at one unsure moment."),
    ("S3", "First wins", "You find mate in one, simple forks and pins, and finish a game with king and queen against king."),
    ("S4", "Becoming independent", "You test your move against the reply, finish with rook mate, and explain why you moved."),
    ("S5", "Developing strength", "You use tactics, plans and pawn structure without being told the theme."),
    ("S6", "Advanced craft", "You calculate longer lines, choose between plans, and convert advantages."),
    ("S7", "Specialization", "You direct training at your own demonstrated needs."),
]
# stage for (tier) by depth index D1 / D2 / D3 and beyond
STAGE_BY_TIER = {0: (1, 1, 1), 1: (2, 3, 3), 2: (3, 4, 4), 3: (4, 5, 5), 4: (5, 6, 6), 5: (6, 6, 7), 6: (7, 7, 7), 7: (7, 7, 7)}

# the first stages are hand-ordered: movement first (rook before bishop, because a bishop capture is explained by the rook), check before castling,
# the king before the games, and the opening habits before the first full game
EXPLICIT = [
    # stage 0: moves and the board
    ("L-FND-BOARD-1", 0), ("L-FND-ROOKBISHOP-1", 0), ("L-FND-PIECE-BISHOP-1", 0), ("L-FND-QUEENKING-1", 0), ("L-FND-KNIGHT-1", 0), ("L-FND-PAWN-1", 0),
    ("L-FND-PIECE-KING-1", 0),
    # stage 1: legal play (attacked squares, check, mate, stalemate), then the special moves
    ("L-FND-CAPTURE-1", 1), ("L-FND-ATTACK-1", 1), ("L-FND-CHECK-1", 1), ("L-FND-CHECK-2", 1), ("L-FND-PIECE-KING-2", 1), ("L-FND-STALEMATE-1", 1),
    ("L-FND-PIECE-ROOK-2", 1), ("L-FND-PIECE-BISHOP-2", 1), ("L-FND-PIECE-QUEEN-2", 1), ("L-FND-PIECE-KNIGHT-2", 1), ("L-FND-PIECE-PAWN-2", 1),
    ("L-FND-CASTLE-1", 1), ("L-FND-CASTLE-2", 1), ("L-FND-PROMOTE-1", 1), ("L-FND-PROMOTE-2", 1), ("L-FND-SPECIAL-1", 1), ("L-FND-ENPASSANT-2", 1),
    ("L-FND-STALEMATE-2", 1), ("L-FND-PROMOTE-3", 1),
    # stage 2: first complete games
    ("L-FND-NOTATION-1", 2), ("L-FND-VALUE-1", 2), ("L-FND-CAPTURE-2", 2), ("L-FND-OPENING-1", 2), ("L-SELF-1-1", 2),
]
OVERRIDE = {
    "L-FND-BOARD-2": 5,        # fast naming from either side: recurring optional practice, never an entrance requirement
    "L-OPN-PRINCIPLES-1": 3,   # when the opening habits fail
    "L-GAME-OWN-1": 3,         # annotating your own game starts soon after the first games
}


def load(p):
    return json.loads(p.read_text(encoding="utf-8"))


def build():
    skills = {}
    for f in (C / "skills").glob("*.json"):
        d = load(f); skills[d["id"]] = d
    lessons = [load(f) for f in sorted((C / "lessons").glob("*.json"))]
    by_key = {}
    for l in lessons: by_key.setdefault(f"{l['skill']}.{l['depth']}", []).append(l["id"])

    rank_cache = {}

    def rank(key, seen=()):
        if key in rank_cache: return rank_cache[key]
        if key in seen: return 0
        node, _, depth = key.rpartition(".")
        sk = skills.get(node, {})
        pre = list(sk.get("depths", {}).get(depth, {}).get("prereqs", [])) + (list(sk.get("soft_prereqs", [])) if depth == "D1" else [])
        r = 1 + max(rank(p, seen + (key,)) for p in pre) if pre else 0
        rank_cache[key] = r
        return r

    explicit = {lid: (st, i) for i, (lid, st) in enumerate(EXPLICIT)}

    def stage_of(l):
        if l["id"] in explicit: return explicit[l["id"]][0]
        if l["id"] in OVERRIDE: return OVERRIDE[l["id"]]
        sk = skills[l["skill"]]; t = min(sk.get("tier", 7), 7)
        di = {"D1": 0, "D2": 1}.get(l["depth"], 2)
        st = STAGE_BY_TIER[t][di]
        if sk["strand"] == "S7" and sk.get("tier") == 1: st += 1   # endgame technique starts once the game is playable
        return min(st, len(STAGES) - 1)

    info = {}
    for l in lessons:
        sk = skills[l["skill"]]
        info[l["id"]] = {"stage": stage_of(l),
                         "key": (stage_of(l), explicit[l["id"]][1] if l["id"] in explicit else 999, sk.get("tier", 9), rank(f"{l['skill']}.{l['depth']}"), l["skill"], l["depth"], l["id"])}
    order0 = sorted(lessons, key=lambda l: info[l["id"]]["key"])

    # prerequisite lessons of each lesson: lessons that teach exactly a prerequisite skill depth
    pre_of = {}
    for l in lessons:
        sk = skills[l["skill"]]
        keys = list(sk.get("depths", {}).get(l["depth"], {}).get("prereqs", []))   # hard prerequisites only; soft ones are a teaching hint, not a rule
        pre_of[l["id"]] = {x for k in keys for x in by_key.get(k, []) if x != l["id"]}
    # topological pass that keeps the intended order wherever it is already valid
    idx = {l["id"]: i for i, l in enumerate(order0)}
    emitted, out, waiting = set(), [], {}
    heap = [(idx[l["id"]], l["id"]) for l in order0]
    heapq.heapify(heap)
    pending = {l["id"] for l in lessons}
    while heap:
        i, lid = heapq.heappop(heap)
        if lid in emitted: continue
        missing = pre_of[lid] - emitted
        if missing:
            # try again after the missing prerequisites; pull the first missing one forward so progress is guaranteed
            nxt = min(missing, key=lambda x: idx[x])
            if nxt not in emitted: heapq.heappush(heap, (-1, nxt))
            heapq.heappush(heap, (i, lid)); continue
        emitted.add(lid); out.append(lid)
    # stages must run in order: a lesson that a prerequisite pulled behind a later-stage lesson takes that later stage
    stages = [[] for _ in STAGES]
    top = 0
    for lid in out:
        top = max(top, info[lid]["stage"]); stages[top].append(lid)
    return {"version": 1, "built_from": "tools/build_path.py",
            "stages": [{"id": sid, "title": title, "milestone": ms, "lessons": stages[i]} for i, (sid, title, ms) in enumerate(STAGES)]}


def check(doc):
    errs = []
    ids = [f.stem for f in (C / "lessons").glob("*.json")]
    placed = [x for s in doc["stages"] for x in s["lessons"]]
    if sorted(placed) != sorted(ids):
        errs.append(f"path covers {len(set(placed))} lessons, expected {len(ids)}: missing {sorted(set(ids) - set(placed))[:5]}, unknown {sorted(set(placed) - set(ids))[:5]}, duplicates {len(placed) - len(set(placed))}")
    pos = {lid: i for i, lid in enumerate(placed)}
    skills = {load(f)["id"]: load(f) for f in (C / "skills").glob("*.json")}
    by_key = {}
    lessons = {f.stem: load(f) for f in (C / "lessons").glob("*.json")}
    for l in lessons.values(): by_key.setdefault(f"{l['skill']}.{l['depth']}", []).append(l["id"])
    for lid, l in lessons.items():
        sk = skills[l["skill"]]
        keys = list(sk.get("depths", {}).get(l["depth"], {}).get("prereqs", []))
        for k in keys:
            for p in by_key.get(k, []):
                if p != lid and lid in pos and p in pos and pos[p] > pos[lid]:
                    errs.append(f"{lid} (#{pos[lid] + 1}) is placed before {p} (#{pos[p] + 1}), which teaches its prerequisite {k}")
    return errs


def main():
    if "--check" in sys.argv:
        p = C / "path.json"
        errs = check(load(p)) if p.exists() else ["content/path.json does not exist; run tools/build_path.py"]
        for e in errs[:30]: print("ERROR", e)
        print(f"path: {len(errs)} errors")
        raise SystemExit(1 if errs else 0)
    doc = build()
    errs = check(doc)
    for e in errs[:30]: print("ERROR", e)
    text = json.dumps(doc, indent=1, ensure_ascii=False)
    (C / "path.json").write_text(text, encoding="utf-8")
    pub = ROOT / "app" / "public" / "content"
    if pub.exists(): (pub / "path.json").write_text(text, encoding="utf-8")
    print("path:", " | ".join(f"{s['id']} {len(s['lessons'])}" for s in doc["stages"]), f"| {len(errs)} errors")
    raise SystemExit(1 if errs else 0)


if __name__ == "__main__":
    main()
