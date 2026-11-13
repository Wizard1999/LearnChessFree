#!/usr/bin/env python3
"""Pacing pass (D91): trim the practice volume inside long first-teach lessons and split what is still too long into short parts.

    ./tools/.venv/Scripts/python.exe -I tools/pace_lessons.py [--apply] [--stage S2] [--only ID]

Why: Stage 3 ran 10.8 hours with a 30-minute lesson for "reading and writing a move" (docs/pacing-assessment.md). The checker ceilings of D55
(`tools/check_depth.py` STAGE_STEPS) were never enforced past Stage 2. Rules, in order:
1. Teaching steps (card, board, contrast, guided, reach, finale) are never dropped. Only `item` steps are thinned: at most ITEMS_PER_CHAPTER per chapter
   (spread through the chapter, first and last kept), more in the closing check chapters. A dropped item is not deleted: it stays in the item bank and is served by Practice.
2. If the lesson is still over its part target, it is cut at chapter boundaries into the fewest parts that each fit. Part 1 keeps the lesson id (progress is kept);
   later parts take the suffix B, C, D and the same skill and depth. Each later part opens with one short bridge card that says where it is in the series.
3. Titles gain "(part n of m)". Outcomes stay on the series' last part; earlier parts state what they cover in the bridge.
Class C (opening deep dives), D and E and anything in S0-S1 are left alone: deep dives are bonus depth and the first two stages already fit.
"""
import sys as _s, pathlib as _p; _s.path.insert(0, str(_p.Path(__file__).resolve().parent))
import json, math, re, copy
from pathlib import Path
from check_depth import lessonMinutes, classify

ROOT = Path(__file__).resolve().parent.parent
CEILING = {"S2": 15, "S3": 20, "S4": 25, "S5": 30, "S6": 35, "S7": 40}        # D55 ceilings: a lesson at or under its ceiling is left alone
GOAL = {"S2": 10, "S3": 13, "S4": 20, "S5": 25, "S6": 30, "S7": 35}           # thin the practice until a lesson is about this long
PART_TARGET = {k: v + 1 for k, v in GOAL.items()}                              # a lesson still longer than this after thinning is cut into parts
MAX_ITEMS = 4
CLOSING = re.compile(r"check yourself|mixed test|say it back|teach it|test", re.I)
TEACH = ("card", "board", "contrast", "guided", "reach", "finale", "practice", "reflect")


def chapters(steps):
    """Index ranges [a, b) of each chapter; steps before the first named chapter join it."""
    marks = [i for i, s in enumerate(steps) if s.get("chapter")]
    if not marks:   # an unchaptered lesson: cut where a new card follows an answered exercise, at least 8 steps apart
        marks = [0]
        for i in range(1, len(steps)):
            if steps[i].get("type") == "card" and steps[i - 1].get("type") in ("item", "practice", "reflect") and i - marks[-1] >= 8: marks.append(i)
    if marks[0] != 0: marks = [0] + [m for m in marks if m != 0]
    return [(a, b) for a, b in zip(marks, marks[1:] + [len(steps)])]


TASK = ("item", "practice", "contrast", "reflect", "finale", "guided", "reach")


def thin(steps, per):
    """Keep every teaching step; keep at most `per` items (and two practice rounds) per chapter, then put back the nearest dropped task wherever a card would be left with no task in the next two steps (the validator rule)."""
    keep = [True] * len(steps)
    for a, b in chapters(steps):
        name = next((s.get("chapter") for s in steps[a:b] if s.get("chapter")), "")
        cap = per + (2 if CLOSING.search(name or "") else 0)
        for kind, n in (("item", cap), ("practice", 2)):
            idx = [i for i in range(a, b) if steps[i].get("type") == kind]
            if len(idx) > n:
                chosen = {idx[round(k * (len(idx) - 1) / (n - 1))] for k in range(n)} if n > 1 else {idx[0]}
                for i in idx:
                    if i not in chosen: keep[i] = False
    changed = True
    while changed:
        changed = False
        kept = [i for i, k in enumerate(keep) if k]
        for pos, i in enumerate(kept):
            if steps[i].get("type") != "card": continue
            if any(steps[k].get("type") in TASK for k in kept[pos + 1:pos + 3]): continue
            back = next((k for k in range(i + 1, len(steps)) if not keep[k] and steps[k].get("type") in TASK), None)
            if back is not None: keep[back] = True; changed = True; break
    out, carry = [], None
    for s, k in zip(steps, keep):
        if s.get("chapter") and not k: carry = s["chapter"]   # a dropped step carried the chapter name: the next kept step takes it
        if s.get("chapter") and k: carry = None
        if k:
            if carry and not s.get("chapter"): s = dict(s, chapter=carry); carry = None
            out.append(s)
    return out


def plan_parts(steps, target):
    """Cut points at chapter starts so every part is at most `target` minutes where the chapters allow; fewest parts."""
    ch = chapters(steps)
    parts, cur = [], []
    for a, b in ch:
        seg = steps[a:b]
        if cur and lessonMinutes(cur + seg) > target: parts.append(cur); cur = []
        cur = cur + seg
    if cur: parts.append(cur)
    # a tiny last part (a lone closing chapter under 4 minutes) joins the one before it
    while len(parts) > 1 and lessonMinutes(parts[-1]) < 4: parts[-2] = parts[-2] + parts.pop()
    return parts


def repair(body, spare=None):
    """A card must be followed by a task within two steps (validator rule). One left-to-right pass pulls the next task up behind any card that lacks one (this never breaks an
    earlier card); a spare exercise dropped by the thinning is put behind any card still without one (a closing card after the last task)."""
    T = ("item", "practice", "contrast", "reflect")
    body = list(body)
    def lacks(k): return body[k].get("type") == "card" and not any(x.get("type") in T for x in body[k + 1:k + 3])
    i = 0
    while i < len(body):
        if lacks(i):
            later = [j for j in range(i + 3, len(body)) if body[j].get("type") in T]
            if later: body.insert(i + 1, body.pop(later[0]))
            else: break
        i += 1
    k = 0
    while k < len(body):
        if lacks(k):
            if spare: body.insert(k + 1, spare.pop(0))
            elif k and body[k - 1].get("type") == "card" and len((body[k - 1]["text"] + " " + body[k]["text"]).split()) <= 88:
                body[k - 1]["text"] += " " + body[k]["text"]; body.pop(k); continue
        k += 1
    return body


def bridge(i, n, title, names):
    cover = "; ".join(names[:3])
    cover = f"This part covers {cover}. " if cover else ""
    return {"type": "card", "text": f"Part {i} of {n}: {title}. {cover}Each part is short on purpose: finish one, play a game or take a break, and come back."}


def main():
    apply = "--apply" in _s.argv
    only = _s.argv[_s.argv.index("--only") + 1] if "--only" in _s.argv else None
    stages_arg = _s.argv[_s.argv.index("--stage") + 1].split(",") if "--stage" in _s.argv else list(PART_TARGET)
    path = json.loads((ROOT / "content" / "path.json").read_text(encoding="utf-8"))
    early = {l for s in path["stages"] if s["id"] in ("S0", "S1") for l in s["lessons"]}
    stage_of = {l: s["id"] for s in path["stages"] for l in s["lessons"]}
    tot_before = tot_after = 0; made = 0; touched = 0
    for f in sorted((ROOT / "content" / "lessons").glob("*.json")):
        d = json.loads(f.read_text(encoding="utf-8")); lid = d["id"]
        sid = stage_of.get(lid)
        if only and lid != only: continue
        if sid not in stages_arg or sid not in CEILING or classify(lid, early) != "B" or d.get("course"): continue
        if d.get("part"): continue
        steps = d["steps"]; m0 = lessonMinutes(steps)
        if m0 <= CEILING[sid]: continue
        thinned = steps
        for per in range(MAX_ITEMS, 0, -1):
            thinned = thin(steps, per)
            if lessonMinutes(thinned) <= GOAL[sid]: break
        parts = plan_parts(thinned, PART_TARGET[sid])
        ms = [lessonMinutes(p) for p in parts]
        tot_before += m0; tot_after += sum(ms); touched += 1; made += len(parts) - 1
        print(f"{sid} {lid:34s} {m0:3d} min {len(steps):3d} steps -> {len(parts)} part(s) {ms}")
        if not apply: continue
        kept = {json.dumps(x, sort_keys=True) for p in parts for x in p}
        spare = [x for x in steps if x.get("type") in ("item", "practice", "contrast", "reflect") and json.dumps(x, sort_keys=True) not in kept]
        n = len(parts); base = {k: v for k, v in d.items() if k != "steps"}
        for i, p in enumerate(parts, 1):
            names = [s["chapter"] for s in p if s.get("chapter")]
            lesson = copy.deepcopy(base)
            lesson["id"] = lid if i == 1 else f"{lid}{chr(ord('A') + i - 1)}"
            if n > 1:
                lesson["title"] = f"{d['title']} (part {i} of {n})"; lesson["part"] = {"of": lid, "n": i, "total": n}
                if i < n: lesson["outcomes"] = []
                body = ([bridge(i, n, d["title"], names)] if i > 1 else []) + p
            else: body = p
            body = repair(body, spare)
            lesson["steps"] = body; lesson["minutes"] = lessonMinutes(body)
            (ROOT / "content" / "lessons" / f"{lesson['id']}.json").write_text(json.dumps(lesson, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"\nlessons touched {touched}, new part lessons {made}, estimated minutes {tot_before} -> {tot_after} ({(tot_before - tot_after) / 60:.1f} h saved from the path, before the parts are rebuilt into it)")


if __name__ == "__main__":
    main()
