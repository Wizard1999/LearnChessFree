#!/usr/bin/env python3
"""Readiness view: six areas, each with a state, the evidence behind it and the next unresolved condition.

    ./tools/.venv/Scripts/python.exe -I tools/readiness.py        # print the view (update_roadmap.py writes it to ROADMAP.md and the app)

Feedback from real people (pilots, trials, human review) is reported under afterRelease and never gates an area. Replaces the single overall percentage (roadmap 2h 'Roadmap truth'). Every number is read from the real files when this runs; nothing is typed here:
  content/lessons, content/path.json     depth standard (the same rules as tools/check_depth.py), beginner path, human review of lessons
  app/public/content/items.json          shipped exercises, their review status
  content/_evidence/*.json               machine evidence records (tablebase, engine, rules) per item and per lesson step
  ROADMAP.md checklist                   task boxes of the phases that belong to an area
  tools/readiness-register.json          things only people can do (pilots, accessibility journeys): counted, never assumed
  tools/_tmp_scratch/test-results.json   written by tools/check.py after the test stages (ignored by git); absent means 'not recorded'

States: 'not started' (no evidence yet), 'in progress', 'ready for a first audience' (every listed condition met).
"""
import sys as _s, pathlib as _p; _s.path.insert(0, str(_p.Path(__file__).resolve().parent))  # allow `python -I tools/<script>.py`
import json, re
from pathlib import Path
from check_depth import TARGET, classify, target, stage_map, lessonMinutes, BOARD_STEPS, shape_misses
from check_text_notation import card_moves, MOVES_LIMIT

ROOT = Path(__file__).resolve().parent.parent
REGISTER = ROOT / "tools" / "readiness-register.json"
TEST_RESULTS = ROOT / "tools" / "_tmp_scratch" / "test-results.json"
NOT_STARTED, IN_PROGRESS, READY = "not started", "in progress", "ready for a first audience"
# Which roadmap phases (by id in 'Phase <id>: ...') speak for which area. A phase counts by its done tasks over all its tasks.
PHASES = {"beginner": ["2e"], "game": ["5f", "5g"], "reliability": ["2g"]}


def _load(p):
    return json.loads(Path(p).read_text(encoding="utf-8"))


def meets_depth(lesson, early, stage=None):
    """(class, meets every depth target?, notation-in-prose cards). Same rules as tools/check_depth.py."""
    steps = lesson.get("steps", [])
    cls = classify(lesson["id"], early)
    lo, hi, share, mx = target(cls, stage)
    boards = sum(s.get("type") in BOARD_STEPS for s in steps)
    heavy = sum(card_moves(s.get("text", "")) >= MOVES_LIMIT for s in steps if s.get("type") == "card")
    ok = lo <= len(steps) <= hi and (mx is None or lessonMinutes(steps) <= mx) and (boards / len(steps) if steps else 0) >= share and not heavy and not shape_misses(cls, steps)
    return cls, ok, heavy


def phase_tasks(phases, ids):
    """(done, total) task boxes over the roadmap phases whose title starts 'Phase <id>:' for any id."""
    done = total = 0
    for p in phases:
        m = re.match(r"Phase (\w+):", p["title"])
        if m and m.group(1) in ids:
            done += p["done"]; total += p["total"]
    return done, total


def gather(phases):
    """Read the real files into a plain dict of facts (all numbers come from here)."""
    path = _load(ROOT / "content" / "path.json")
    early = {l for s in path["stages"] if s["id"] in ("S0", "S1") for l in s["lessons"]}
    stages = stage_map(path)
    lessons = [_load(f) for f in sorted((ROOT / "content" / "lessons").glob("*.json"))]
    by_class, heavy_cards, human_lessons, early_human, early_n = {}, 0, 0, 0, 0
    series = {}   # D92: split part lessons (B, C, D) are one lesson in the count; the series meets the standard only if every part does
    for l in lessons:
        cls, ok, heavy = meets_depth(l, early, stages.get(l['id']))
        heavy_cards += heavy
        key = (l.get("part") or {}).get("of") or l["id"]
        s = series.setdefault(key, [cls, True]); s[1] = s[1] and bool(ok)
    for cls, ok in series.values():
        c = by_class.setdefault(cls, [0, 0]); c[1] += 1; c[0] += ok
    for l in lessons:
        reviewed = (l.get("review") or {}).get("status") == "human-reviewed"
        human_lessons += reviewed
        if l["id"] in early:
            early_n += 1; early_human += reviewed
    items_p = ROOT / "app" / "public" / "content" / "items.json"
    items = _load(items_p) if items_p.exists() else []
    ev_pass, ev_bad, ev_lessons_pass, ev_lessons_bad = set(), set(), set(), set()
    for f in sorted((ROOT / "content" / "_evidence").glob("*.json")):
        for r in _load(f):
            if "item" in r:
                (ev_pass if r.get("result") == "pass" else ev_bad).add(r["item"])
            elif "lesson" in r:
                (ev_lessons_pass if r.get("result") == "pass" else ev_lessons_bad).add(r["lesson"])
    ids = {i["id"] for i in items if "id" in i}
    reg = _load(REGISTER) if REGISTER.exists() else {}
    journeys = reg.get("accessibility_journeys", [])
    tests = _load(TEST_RESULTS) if TEST_RESULTS.exists() else None
    return {
        "lessons": len(lessons), "depthByClass": by_class, "heavyCards": heavy_cards,
        "earlyLessons": early_n, "earlyHuman": early_human, "humanLessons": human_lessons,
        "items": len(items), "itemsHuman": sum((i.get("review") or {}).get("status") == "human-reviewed" for i in items),
        "itemsWithEvidence": len((ev_pass - ev_bad) & ids), "itemsEvidenceFailing": len(ev_bad & ids),
        "lessonsWithEvidence": len(ev_lessons_pass - ev_lessons_bad), "lessonsEvidenceFailing": len(ev_lessons_bad),
        "pilots": len(reg.get("beginner_pilot_sessions", [])), "trials": len(reg.get("independent_assessment_trials", [])),
        "journeys": len(journeys), "journeysTested": sum(bool(j.get("tested")) for j in journeys),
        "tests": tests,
        "phases": {k: phase_tasks(phases, v) for k, v in PHASES.items()},
    }


def _pct(a, b):
    return round(100 * a / b) if b else 0


def _area(id_, name, started, conditions, evidence):
    unmet = [c["label"] for c in conditions if not c["met"]]
    state = READY if not unmet else IN_PROGRESS if started else NOT_STARTED
    return {"id": id_, "name": name, "state": state, "evidence": evidence, "conditions": conditions, "next": unmet[0] if unmet else None}


def _reliability(f, t2g, t2g_n):
    t = f["tests"]
    conds = [
        {"label": "Run tools/check.py so the passing tests are recorded" if not t else f"Fix the failing tests ({t['failed']} failing)",
         "met": bool(t) and t["failed"] == 0 and t["passed"] > 0},
        {"label": f"Fix the live-build review findings ({t2g_n - t2g} of {t2g_n} roadmap tasks open)", "met": t2g_n > 0 and t2g == t2g_n},
    ]
    ev = [f"{t['passed']} app tests passing, {t['failed']} failing (recorded {t['at']})" if t else "No test run recorded yet (tools/check.py records it)",
          f"{t2g} of {t2g_n} tasks done on the live-build review fixes"]
    return _area("reliability", "Reliability", bool(t) or t2g > 0, conds, ev)


def build_readiness(f):
    """Pure: facts -> the seven areas, a summary and the lists 'rely on' / 'experimental'. No file access."""
    dc = f["depthByClass"]; a_ok, a_n = dc.get("A", [0, 0]); b_ok, b_n = dc.get("B", [0, 0])
    all_ok = sum(v[0] for v in dc.values()); all_n = sum(v[1] for v in dc.values())
    t2e, t2e_n = f["phases"]["beginner"]; tg, tg_n = f["phases"]["game"]; t2g, t2g_n = f["phases"]["reliability"]
    areas = [
        _area("beginner", "Beginner journey", a_ok > 0 or t2e > 0 or f["pilots"] > 0, [
            {"label": f"Rebuild the beginner path to the depth standard ({a_n - a_ok} of {a_n} beginner lessons still short)", "met": a_n > 0 and a_ok == a_n},
            {"label": f"Finish the road to the first complete game ({t2e_n - t2e} of {t2e_n} roadmap tasks open)", "met": t2e_n > 0 and t2e == t2e_n},
        ], [f"{a_ok} of {a_n} beginner-path lessons meet the depth standard ({_pct(a_ok, a_n)}% rebuilt)",
            f"{t2e} of {t2e_n} tasks done on the road to the first game"]),
        _area("lessons", "Core lesson quality", b_ok > 0, [
            {"label": f"Rebuild the core skill lessons to the depth standard ({b_n - b_ok} of {b_n} still short)", "met": b_n > 0 and b_ok == b_n},
            {"label": f"Show every move line on a board instead of in prose ({f['heavyCards']} cards still carry long move chains)", "met": f["heavyCards"] == 0},
        ], [f"{b_ok} of {b_n} core lessons meet the depth standard ({_pct(b_ok, b_n)}%)",
            f"{all_ok} of {all_n} lessons of every class meet it ({_pct(all_ok, all_n)}%)",
            f"{f['heavyCards']} cards carry long move chains in prose"]),
        _area("assessment", "Independent assessment", f["itemsWithEvidence"] > 0, [
            {"label": f"Attach a passing machine record to every shipped exercise ({f['items'] - f['itemsWithEvidence']} of {f['items']} have none)",
             "met": f["items"] > 0 and f["itemsWithEvidence"] == f["items"] and f["itemsEvidenceFailing"] == 0},
        ], [f"{f['itemsWithEvidence']} of {f['items']} shipped exercises carry a passing engine, tablebase or rules record ({_pct(f['itemsWithEvidence'], f['items'])}%); {f['itemsEvidenceFailing']} have a failing one",
            "Lesson claims are carried by their exercises' records above; separate lesson-level records are not required"]),
        _area("games", "Game integration", tg > 0, [
            {"label": f"Finish games as part of the curriculum: Maia finales, prescriptions, game review ({tg_n - tg} of {tg_n} roadmap tasks open)", "met": tg_n > 0 and tg == tg_n},
        ], [f"{tg} of {tg_n} tasks done in the game-playing phases"]),
        _area("accessibility", "Accessibility", f["journeysTested"] > 0, [
            {"label": f"Test the planned journeys with keyboard, screen reader, narrow screen and enlarged text ({f['journeys'] - f['journeysTested']} of {f['journeys']} untested)",
             "met": f["journeys"] > 0 and f["journeysTested"] == f["journeys"]},
        ], [f"{f['journeysTested']} of {f['journeys']} accessibility journeys tested"]),
        _reliability(f, t2g, t2g_n),
    ]
    ready = [a for a in areas if a["state"] == READY]
    rely = []
    if f["itemsWithEvidence"]:
        rely.append(f"Positions and results in {f['itemsWithEvidence']:,} of {f['items']:,} exercises were checked by software (engine, tablebase or rules): the positions and results are sound. The written explanations are not yet reviewed by a person.")
    if f["lessonsWithEvidence"]:
        rely.append(f"{f['lessonsWithEvidence']} {'lesson carries' if f['lessonsWithEvidence'] == 1 else 'lessons carry'} machine-checked claims in the evidence files.")
    if all_ok:
        rely.append(f"{all_ok} of {all_n} lessons meet the written depth standard.")
    rely += [f"{a['name']} is ready for a first audience." for a in ready]
    experimental = [f"{a['name']}: {a['state']}. Next: {a['next']}." for a in areas if a["state"] != READY]
    after = [f"{f['humanLessons']} of {f['lessons']} lessons and {f['itemsHuman']} of {f['items']} exercises reviewed by a person so far",
             f"{f['pilots']} sessions with real beginners and {f['trials']} assessment trials recorded so far"]
    return {"areas": areas, "summary": {"ready": len(ready), "total": len(areas)}, "rely": rely, "experimental": experimental, "afterRelease": after}


def core_complete(f, checklist_percent):
    """One headline figure for 'how far is the complete core': half the written lessons that meet the depth standard, half the build checklist
    (feedback tasks excluded). Both parts are shown so nobody has to trust the blend. Pure."""
    dc = f["depthByClass"]; ok = sum(dc.get(c, [0, 0])[0] for c in "AB"); n = sum(dc.get(c, [0, 0])[1] for c in "AB")   # core only: bonus classes C, D, E are reported apart
    bonus_ok = sum(dc.get(c, [0, 0])[0] for c in "CDE"); bonus_n = sum(dc.get(c, [0, 0])[1] for c in "CDE")
    lessons_pct = _pct(ok, n)
    percent = round((lessons_pct + checklist_percent) / 2)
    return {"percent": percent, "parts": [
        {"label": "Lessons that meet the depth standard", "percent": lessons_pct, "detail": f"{ok} of {n} core lessons (split parts count as one); bonus lessons not counted: {bonus_ok} of {bonus_n} meet their own standard"},
        {"label": "Build checklist (feedback tasks excluded)", "percent": checklist_percent, "detail": "tasks done, in-progress counting half"}],
        "note": "An even blend of the two parts. The lesson standard (D92) is a length ceiling per stage plus a shape check (at least two tasks, and a board in core skill lessons). Lessons still to be written are not in the denominator, so this number can fall when the plan grows."}


def render_core(c):
    return [f"**Complete core: about {c['percent']}%.**", ""] + [f"- {p['label']}: {p['percent']}% ({p['detail']})" for p in c["parts"]] + ["", c["note"]]


def render_markdown(r):
    L = [f"**{r['summary']['ready']} of {r['summary']['total']} areas are ready for a first audience.**", "",
         "| Area | State | Evidence | Next unresolved condition |", "|---|---|---|---|"]
    for a in r["areas"]:
        L.append(f"| {a['name']} | {a['state']} | {'; '.join(a['evidence'])} | {a['next'] or 'none'} |")
    L += ["", "**After release (does not gate readiness)**", ""] + [f"- {x}" for x in r.get("afterRelease", [])]
    L += ["", "**What you can rely on today**", ""] + [f"- {x}" for x in r["rely"] or ["Nothing yet."]]
    L += ["", "**What is experimental**", ""] + [f"- {x}" for x in r["experimental"] or ["Nothing."]]
    return L


if __name__ == "__main__":
    import update_roadmap
    print("\n".join(render_markdown(build_readiness(gather(update_roadmap.parse(update_roadmap.MD.read_text(encoding="utf-8")))))))
