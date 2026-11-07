#!/usr/bin/env python3
"""Plain assert tests for the review machinery (tools/review_packet.py, tools/apply_review.py). Run:
    ./tools/.venv/Scripts/python.exe -I tools/test_review.py
Prints ALL REVIEW TESTS PASSED. Writes only to a temporary directory."""
import sys as _s, pathlib as _p; _s.path.insert(0, str(_p.Path(__file__).resolve().parent))
import copy, json, os, tempfile
from pathlib import Path
import review_packet as rp, apply_review as ar

ROOT = rp.ROOT
LESSONS = rp.load_lessons(); ITEMS, POS = rp.load_items()

# 1. the slice is what the docs say it is
rows = rp.slice_ids(LESSONS)
ids = [l for _, l in rows]
assert len(ids) == len(set(ids)), "slice has duplicates"
assert {"L-TAC-FORK-1", "L-TAC-BACKRANK-1", "L-OD-DRAGON-1", "L-OD-DRAGON-9", "L-HI-ENGINES-HUMANS-1", "L-HI-ENGINES-HUMANS-5"} <= set(ids)
assert {st for st, _ in rows} <= {"S0", "S1", "S2", "exemplar"} and any(st == "S0" for st, _ in rows)

# 2. the revision hash equals the one build_content.py shipped, for every lesson not edited since the last build
shipped_p = ROOT / "app" / "public" / "content" / "lessons.json"
if shipped_p.exists():
    shipped = json.loads(shipped_p.read_text(encoding="utf-8")); shipped = shipped if isinstance(shipped, list) else shipped.get("lessons", [])
    t = shipped_p.stat().st_mtime; checked = 0
    for s in shipped:
        f = ROOT / "content" / "lessons" / f"{s['id']}.json"
        if "revision" in s and f.exists() and f.stat().st_mtime < t:
            assert rp.revision(LESSONS[s["id"]]) == s["revision"], f"revision differs from build_content for {s['id']}"; checked += 1
    assert checked == 0 or checked > 10
    print(f"revision matches build_content for {checked} lessons")

# 3. revision changes with the text and not with the review block
l = copy.deepcopy(LESSONS["L-TAC-FORK-1"]); r0 = rp.revision(l)
assert len(r0) == 8
l2 = copy.deepcopy(l); l2["review"] = {"status": "human-reviewed", "reviewer": "x"}; assert rp.revision(l2) == r0
l3 = copy.deepcopy(l); l3["steps"][1]["prompt"] = l3["steps"][1].get("prompt", "") + " changed"; l3["steps"][0] = dict(l3["steps"][0], zz=1)
assert rp.revision(l3) != r0

# 4. packets render: every step present, boards drawn with FEN, no unreadable placeholders
for lid in ("L-TAC-FORK-1", "L-OD-DRAGON-1", "L-HI-ENGINES-HUMANS-1"):
    L = LESSONS[lid]; md = rp.render_lesson(L, ITEMS, POS, "exemplar")
    assert md.count("### Step ") == len(L["steps"]), lid
    assert "FEN: " in md and "Reviewer scorecard" in md and rp.revision(L) in md
    for bad in ("NOT FOUND", "ILLEGAL OR UNREADABLE", "bad FEN"): assert bad not in md, (lid, bad)
b = rp.ascii_board("4k3/8/8/8/8/8/8/R3K3 w - - 0 1")
assert b.splitlines()[0].strip() == "8  . . . . k . . ." and b.splitlines()[-2].strip() == "1  R . . . K . . ." and b.splitlines()[-1].strip().startswith("a b c")
fin = rp.render_step(1, {"type": "finale", "fen": "4k3/8/8/8/8/8/8/R3K3 w - - 0 1", "color": "white", "prompt": "Mate."}, ITEMS, POS)
assert "FEN:" in fin and "Mate." in fin
ch = rp.render_step(1, {"type": "card", "text": "hi", "chapter": "Why"}, ITEMS, POS); assert "Chapter: Why" in ch

# 5. sign-off validation
good = {"lesson": "L-X", "revision": "abcd1234", "reviewer": "A. Person", "reviewer_role": "strong-player", "date": "2026-11-20",
        "scores": {"chess": 5, "clarity": 4, "prerequisites": 4, "tasks": 4}, "comments": "", "verdict": "approved"}
assert ar.check_signoff(good, "L-X") == []
def broke(**kw): d = copy.deepcopy(good); d.update(kw); return ar.check_signoff(d, "L-X")
assert broke(reviewer="  "); assert broke(reviewer_role="friend"); assert broke(date="20 Nov"); assert broke(verdict="ok")
assert broke(revision="xyz"); assert broke(scores={"chess": 5}); assert broke(scores={"chess": 6, "clarity": 4, "prerequisites": 4, "tasks": 4})
assert broke(scores={"chess": 3, "clarity": 4, "prerequisites": 4, "tasks": 4}), "approval with chess 3 must be refused"
assert broke(scores={"chess": 5, "clarity": 2, "prerequisites": 4, "tasks": 4}), "approval with a score of 2 must be refused"
assert broke(verdict="changes-requested", comments=""), "changes-requested needs comments"
assert ar.check_signoff(good, "L-Y")

# 6. applying: match promotes, stale does not, teacher alone does not, changes-requested does not, edit demotes
lesson = copy.deepcopy(LESSONS["L-TAC-FORK-1"]); rev = rp.revision(lesson); lesson["review"] = {"status": "needs-human", "reviewer": None}
so = dict(good, lesson=lesson["id"], revision=rev)
new, log = ar.apply_one(lesson, [so])
assert new["review"]["status"] == "human-reviewed" and new["review"]["reviewer"] == "A. Person" and new["review"]["date"] == "2026-11-20", new["review"]
assert new["steps"] == lesson["steps"] and rp.revision(new) == rev, "applying must not change the teaching text"
new2, _ = ar.apply_one(lesson, [dict(so, revision="00000000")])
assert new2["review"]["status"] == "needs-human" and "Not applied" in new2["review"]["note"]
new3, _ = ar.apply_one(lesson, [dict(so, reviewer_role="teacher")])
assert new3["review"]["status"] == "needs-human" and new3["review"]["teacher_reviews"][0]["reviewer"] == "A. Person"
new4, _ = ar.apply_one(lesson, [dict(so, verdict="changes-requested", comments="Step 5 is wrong.")])
assert new4["review"]["status"] == "needs-human" and "Step 5 is wrong." in new4["review"]["note"]
edited = copy.deepcopy(new); edited["steps"][0] = dict(edited["steps"][0], text="Changed after review. " + str(edited["steps"][0].get("text", "")))
new5, _ = ar.apply_one(edited, [so])
assert new5["review"]["status"] == "needs-human" and new5["review"]["reviewer"] is None and "Not applied" in new5["review"]["note"]
both, _ = ar.apply_one(lesson, [dict(so, reviewer_role="teacher", reviewer="T"), so])
assert both["review"]["status"] == "human-reviewed" and both["review"]["teacher_reviews"]

# 7. end to end on a temporary copy: files are read, written once, and a human-reviewed lesson without a sign-off file is reported
with tempfile.TemporaryDirectory() as td:
    td = Path(td); (td / "lessons").mkdir(); (td / "review").mkdir()
    (td / "lessons" / f"{lesson['id']}.json").write_text(json.dumps(lesson, indent=2, ensure_ascii=False), encoding="utf-8")
    (td / "review" / f"{lesson['id']}.json").write_text(json.dumps(so), encoding="utf-8")
    lg, pr = ar.run(lessons_dir=td / "lessons", signoff_dir=td / "review")
    assert not pr and any("HUMAN-REVIEWED" in x for x in lg), (lg, pr)
    back = json.loads((td / "lessons" / f"{lesson['id']}.json").read_text(encoding="utf-8")); assert back["review"]["status"] == "human-reviewed"
    lg, pr = ar.run(lessons_dir=td / "lessons", signoff_dir=td / "review"); assert not pr          # idempotent
    (td / "review" / f"{lesson['id']}.json").unlink()
    lg, pr = ar.run(lessons_dir=td / "lessons", signoff_dir=td / "review"); assert pr and "no content/review" in pr[0] or "there is no" in pr[0]
    (td / "review" / "L-NOPE.json").write_text(json.dumps(so)); lg, pr = ar.run(lessons_dir=td / "lessons", signoff_dir=td / "review"); assert any("no lesson L-NOPE" in p for p in pr)

# 8. the real repository: no lesson claims a review that has no sign-off (and nobody has been invented)
lg, pr = ar.run(dry=True)
assert not pr, pr
print("ALL REVIEW TESTS PASSED")
