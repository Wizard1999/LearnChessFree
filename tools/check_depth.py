#!/usr/bin/env python3
"""Depth report for lessons against docs/lesson-depth-standard.md. Informational (exit 0).

    ./tools/.venv/Scripts/python.exe -I tools/check_depth.py [--list N] [--class X]

Per lesson: steps, boards, board share (boards + items/contrasts with a position, over steps), words in cards,
cards with 4 or more moves in prose, and the class target it misses. Class is inferred from the id prefix:
L-OD- = C (opening deep dive), L-FG- = E (famous game), L-HI-/L-PS- = D (culture), lessons in stages S0-S1
of content/path.json = A, everything else = B. Boards counted: board, contrast and guided-game steps.
"""
import sys as _s, pathlib as _p; _s.path.insert(0, str(_p.Path(__file__).resolve().parent))
import json, statistics, collections
from pathlib import Path
from check_text_notation import card_moves, MOVES_LIMIT

ROOT = Path(__file__).resolve().parent.parent
TARGET = {"A": (6, 16, 0.0), "B": (10, 56, 0.5), "C": (40, 70, 0.5), "D": (15, 36, 0.4), "E": (30, 55, 0.5)}  # B and A are narrowed per stage by STAGE_STEPS
# Length follows difficulty (Andrew, 8 Nov 2026): the earlier and simpler the idea, the shorter the lesson. (min steps, max steps, max minutes) per stage.
STAGE_STEPS = {"S0": (6, 14, 8), "S1": (8, 16, 10), "S2": (10, 22, 15), "S3": (14, 28, 20), "S4": (18, 34, 25), "S5": (22, 42, 30), "S6": (26, 50, 35), "S7": (28, 56, 40)}


def stage_map(path):
    return {l: s["id"] for s in path["stages"] for l in s["lessons"]}


def target(cls, stage):
    """(min steps, max steps, min share of boards, max minutes or None) for a lesson of this class in this stage. Only classes A and B scale with the stage."""
    lo, hi, share = TARGET[cls]
    if cls in ("A", "B") and stage in STAGE_STEPS:
        lo, hi, mx = STAGE_STEPS[stage]
        return lo, hi, share, mx
    return lo, hi, share, None
NAME = {"A": "beginner block", "B": "core skill", "C": "opening deep dive", "D": "culture/history", "E": "famous game"}


def lessonMinutes(steps):
    """Same formula as app/src/lib/lessonTime.ts and tools/build_content.py."""
    import math, re
    words = lambda t: len(re.split(r"\s+", t))
    t = 0.0
    for x in steps:
        k = x.get("type")
        if k == "card": t += words(x["text"]) / 200
        elif k == "board": t += 0.4 + words(x.get("caption") or "") / 200
        elif k == "item": t += 0.8
        elif k == "contrast": t += 1.5
        elif k == "reflect": t += 1
        elif k == "practice": t += min(x.get("n") if x.get("n") is not None else 3, 3) * 0.7
        elif k == "guided": t += 0.4 + 0.15 * len(x.get("moves") or [])
    return max(3, math.floor(t + 0.5))


def classify(lid, early):
    if lid.startswith("L-OD-"): return "C"
    if lid.startswith("L-FG-"): return "E"
    if lid.startswith(("L-HI-", "L-PS-")): return "D"
    return "A" if lid in early else "B"


def main():
    path = json.loads((ROOT / "content" / "path.json").read_text(encoding="utf-8"))
    early = {l for s in path["stages"] if s["id"] in ("S0", "S1") for l in s["lessons"]}
    stages = stage_map(path)
    rows = []
    for f in sorted((ROOT / "content" / "lessons").glob("*.json")):
        d = json.loads(f.read_text(encoding="utf-8"))
        st = d.get("steps", [])
        boards = sum(s.get("type") in ("board", "contrast", "guided") for s in st)
        cards = [s.get("text", "") for s in st if s.get("type") == "card"]
        words = sum(len(t.split()) for t in cards)
        heavy = sum(card_moves(t) >= MOVES_LIMIT for t in cards)
        cls = classify(d["id"], early)
        lo, hi, share, mx = target(cls, stages.get(d["id"]))
        share_v = boards / len(st) if st else 0
        miss = []
        if len(st) < lo: miss.append(f"steps<{lo}")
        if len(st) > hi: miss.append(f"steps>{hi} (too long for its stage)")
        if mx and lessonMinutes(st) > mx: miss.append(f"minutes>{mx}")
        if share_v < share: miss.append(f"boards<{int(share*100)}%")
        if heavy: miss.append("notation-in-prose")
        rows.append(dict(id=d["id"], cls=cls, steps=len(st), boards=boards, share=share_v, words=words, heavy=heavy, miss=miss))
    lim = int(_s.argv[_s.argv.index("--list") + 1]) if "--list" in _s.argv else 25
    only = _s.argv[_s.argv.index("--class") + 1] if "--class" in _s.argv else None
    print(f"{'lesson':34s} cl steps boards share words heavy  misses")
    for r in [r for r in sorted(rows, key=lambda r: (r["steps"], r["boards"])) if not only or r["cls"] == only][:lim]:
        print(f"{r['id']:34s} {r['cls']}  {r['steps']:4d} {r['boards']:6d} {r['share']*100:4.0f}% {r['words']:5d} {r['heavy']:5d}  {', '.join(r['miss'])}")
    print("\nSummary by class (median steps / boards / card words; lessons meeting every target)")
    for c in "ABCDE":
        rs = [r for r in rows if r["cls"] == c]
        if not rs: continue
        ok = sum(not r["miss"] for r in rs)
        lo, hi, share = TARGET[c]
        print(f"  {c} {NAME[c]:18s} n={len(rs):3d}  steps {statistics.median(r['steps'] for r in rs):5.1f}  boards {statistics.median(r['boards'] for r in rs):5.1f}  words {statistics.median(r['words'] for r in rs):6.0f}  meet target {ok}/{len(rs)}  (target {lo}-{hi} steps, boards >= {int(share*100)}%)")
    print(f"  all: n={len(rows)} median steps {statistics.median(r['steps'] for r in rows)}, card words {statistics.median(r['words'] for r in rows):.0f}, boards {statistics.median(r['boards'] for r in rows)}, cards with {MOVES_LIMIT}+ moves {sum(r['heavy'] for r in rows)}")
    raise SystemExit(0)


if __name__ == "__main__":
    main()
