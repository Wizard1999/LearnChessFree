#!/usr/bin/env python3
"""Plain assert tests for the readiness builder (tools/readiness.py). Run:
    ./tools/.venv/Scripts/python.exe -I tools/test_readiness.py
Prints ALL READINESS TESTS PASSED. Reads files only; writes nothing."""
import sys as _s, pathlib as _p; _s.path.insert(0, str(_p.Path(__file__).resolve().parent))
import copy, json
import readiness as rd

FULL = {
    "lessons": 10, "depthByClass": {"A": [4, 4], "B": [5, 5], "C": [1, 1]}, "heavyCards": 0, "earlyLessons": 4, "earlyHuman": 4, "humanLessons": 4,
    "items": 20, "itemsHuman": 3, "itemsWithEvidence": 20, "itemsEvidenceFailing": 0, "lessonsWithEvidence": 10, "lessonsEvidenceFailing": 0,
    "pilots": 5, "trials": 1, "journeys": 6, "journeysTested": 6, "tests": {"passed": 100, "failed": 0, "at": "2026-11-07T00:00+00:00"},
    "phases": {"beginner": (4, 4), "game": (5, 5), "reliability": (7, 7)},
}
EMPTY = {
    "lessons": 10, "depthByClass": {"A": [0, 4], "B": [0, 5]}, "heavyCards": 3, "earlyLessons": 4, "earlyHuman": 0, "humanLessons": 0,
    "items": 20, "itemsHuman": 0, "itemsWithEvidence": 0, "itemsEvidenceFailing": 0, "lessonsWithEvidence": 0, "lessonsEvidenceFailing": 0,
    "pilots": 0, "trials": 0, "journeys": 6, "journeysTested": 0, "tests": None,
    "phases": {"beginner": (0, 4), "game": (0, 5), "reliability": (0, 7)},
}
NAMES = ["Beginner journey", "Core lesson quality", "Independent assessment", "Game integration", "Accessibility", "Reliability", "Human review"]

# 1. seven areas, in the named order, every one with the four parts
r = rd.build_readiness(FULL)
assert [a["name"] for a in r["areas"]] == NAMES
for a in r["areas"]:
    assert {"id", "name", "state", "evidence", "conditions", "next"} <= set(a) and a["evidence"]

# 2. everything met -> every area ready, no next condition, nothing experimental
assert all(a["state"] == rd.READY and a["next"] is None for a in r["areas"]) and r["summary"] == {"ready": 7, "total": 7} and r["experimental"] == []

# 3. nothing done -> nothing ready; areas with no evidence at all are 'not started'; each names a next condition
e = rd.build_readiness(EMPTY)
assert all(a["state"] != rd.READY and a["next"] for a in e["areas"]) and e["summary"]["ready"] == 0
by = {a["id"]: a for a in e["areas"]}
assert by["beginner"]["state"] == rd.NOT_STARTED and by["accessibility"]["state"] == rd.NOT_STARTED and by["reliability"]["state"] == rd.NOT_STARTED
assert by["review"]["state"] == rd.NOT_STARTED and by["assessment"]["state"] == rd.NOT_STARTED
assert len(e["experimental"]) == 7 and e["rely"] == []

# 4. one unmet condition keeps an otherwise complete area 'in progress', and the next condition is that one
f = copy.deepcopy(FULL); f["pilots"] = 4
a = {x["id"]: x for x in rd.build_readiness(f)["areas"]}["beginner"]
assert a["state"] == rd.IN_PROGRESS and "real beginners" in a["next"] and "4 sessions" in a["next"]

# 5. a failing test or a failing evidence record blocks readiness; counts quoted come from the facts
f = copy.deepcopy(FULL); f["tests"]["failed"] = 2
a = {x["id"]: x for x in rd.build_readiness(f)["areas"]}["reliability"]
assert a["state"] == rd.IN_PROGRESS and "2 failing" in a["next"]
f = copy.deepcopy(FULL); f["itemsEvidenceFailing"] = 1
assert {x["id"]: x for x in rd.build_readiness(f)["areas"]}["assessment"]["state"] == rd.IN_PROGRESS
f = copy.deepcopy(FULL); f["itemsWithEvidence"] = 15
a = {x["id"]: x for x in rd.build_readiness(f)["areas"]}["assessment"]
assert "5 of 20" in a["next"] and "75%" in " ".join(a["evidence"])

# 6. the plain summary is derived: rely lines quote the evidence, experimental lines name the area and its next condition
f = copy.deepcopy(EMPTY); f["itemsWithEvidence"] = 12; f["depthByClass"]["B"] = [2, 5]
s = rd.build_readiness(f)
assert any("12 of 20" in x for x in s["rely"]) and any("2 of 10" in x for x in s["rely"])
assert any(x.startswith("Core lesson quality: in progress. Next:") for x in s["experimental"])

# 7. depth rule agrees with tools/check_depth.py: a class-A lesson needs 15+ steps and no long move chain in prose
early = {"L-X-1"}
card = {"type": "card", "text": "A plain sentence."}
ok_l = {"id": "L-X-1", "steps": [card] * 15}
assert rd.meets_depth(ok_l, early) == ("A", True, 0)
assert rd.meets_depth({"id": "L-X-1", "steps": [card] * 14}, early)[1] is False
heavy = {"id": "L-X-1", "steps": [card] * 14 + [{"type": "card", "text": "1.e4 e5 2.Nf3 Nc6 3.Bb5"}]}
assert rd.meets_depth(heavy, early) == ("A", False, 1)
assert rd.meets_depth({"id": "L-Y-1", "steps": [card] * 60}, early)[:2] == ("B", False)  # B needs boards in half of the steps
assert rd.meets_depth({"id": "L-Y-1", "steps": [{"type": "board"}] * 30}, early)[:2] == ("B", True)

# 8. phase tasks are summed by id, not by prefix
ph = [{"title": "Phase 2e: x", "done": 1, "total": 4}, {"title": "Phase 2eb: y", "done": 3, "total": 3}, {"title": "Phase 5g: z", "done": 2, "total": 5}, {"title": "Phase 5f: w", "done": 1, "total": 2}]
assert rd.phase_tasks(ph, ["2e"]) == (1, 4) and rd.phase_tasks(ph, ["5f", "5g"]) == (3, 7)

# 9. the markdown rendering lists every area and both summary lists
md = "\n".join(rd.render_markdown(e))
assert all(n in md for n in NAMES) and "What you can rely on today" in md and "What is experimental" in md

# 10. the real files: gather works, the result serialises, and every state follows from its own conditions
import update_roadmap
phases = update_roadmap.parse(update_roadmap.MD.read_text(encoding="utf-8"))
live = rd.build_readiness(rd.gather(phases))
json.dumps(live)
assert len(live["areas"]) == 7
for a in live["areas"]:
    assert (a["state"] == rd.READY) == all(c["met"] for c in a["conditions"]) and (a["next"] is None) == (a["state"] == rd.READY)
print(f"live: {live['summary']['ready']}/7 ready; " + ", ".join(f"{a['id']}={a['state']}" for a in live["areas"]))
print("ALL READINESS TESTS PASSED")
