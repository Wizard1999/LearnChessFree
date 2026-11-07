#!/usr/bin/env python3
"""Applies human sign-offs (content/review/<lesson-id>.json) to the lesson files, honestly.

    ./tools/.venv/Scripts/python.exe -I tools/apply_review.py            # apply
    ./tools/.venv/Scripts/python.exe -I tools/apply_review.py --dry-run  # report only, write nothing

Sign-off file: one object, or a list of objects when a strong player and a teacher both review:
  {"lesson": id, "revision": 8 hex, "reviewer": name, "reviewer_role": "strong-player"|"teacher", "date": "YYYY-MM-DD",
   "scores": {"chess": 1-5, "clarity": 1-5, "prerequisites": 1-5, "tasks": 1-5}, "comments": text, "verdict": "approved"|"changes-requested"}

Rules (docs/review-slice.md):
- A lesson becomes review.status "human-reviewed" only when a sign-off is approved, names a person, and its revision equals the lesson's CURRENT
  revision (tools/review_packet.revision, the same hash tools/build_content.py computes). An approval needs every score at least 3 and chess at least 4.
- The chess claim needs a strong player. A teacher's approval is recorded under review.teacher_reviews and never makes the lesson human-reviewed by itself.
- A sign-off for an older revision changes nothing except a note (review.note); the lesson stays needs-human. A lesson already human-reviewed whose text
  changed since its review goes back to needs-human with a note.
- changes-requested is recorded as a note and leaves the lesson needs-human.
- Nothing is ever invented: no file, no change.
"""
import sys as _s, pathlib as _p; _s.path.insert(0, str(_p.Path(__file__).resolve().parent))  # allow `python -I tools/<script>.py`
import datetime, json, re
from pathlib import Path
import review_packet as rp

ROOT = rp.ROOT
LESSONS = rp.C / "lessons"
ROLES = ("strong-player", "teacher")
VERDICTS = ("approved", "changes-requested")
DIMS = ("chess", "clarity", "prerequisites", "tasks")


def check_signoff(d, lid):
    """Returns a list of problems with one sign-off object (empty if well formed)."""
    errs = []
    if not isinstance(d, dict): return ["sign-off is not an object"]
    if d.get("lesson") != lid: errs.append(f"lesson is {d.get('lesson')!r}, file is for {lid}")
    if not re.fullmatch(r"[0-9a-f]{8}", str(d.get("revision", ""))): errs.append("revision must be 8 hex characters (see the packet)")
    if not str(d.get("reviewer", "")).strip(): errs.append("reviewer name is empty")
    if d.get("reviewer_role") not in ROLES: errs.append(f"reviewer_role must be one of {ROLES}")
    try: datetime.date.fromisoformat(str(d.get("date", "")))
    except ValueError: errs.append("date must be YYYY-MM-DD")
    sc = d.get("scores")
    if not isinstance(sc, dict) or set(sc) != set(DIMS): errs.append(f"scores must have exactly {DIMS}")
    else:
        for k, v in sc.items():
            if not isinstance(v, int) or isinstance(v, bool) or not 1 <= v <= 5: errs.append(f"score {k} must be an integer 1 to 5")
    if d.get("verdict") not in VERDICTS: errs.append(f"verdict must be one of {VERDICTS}")
    if not isinstance(d.get("comments", ""), str): errs.append("comments must be text")
    if not errs and d["verdict"] == "approved":
        if min(sc.values()) < 3: errs.append("approved with a score below 3: change the verdict or the score")
        if sc["chess"] < 4: errs.append("approved with chess below 4: change the verdict or the score")
    if not errs and d["verdict"] == "changes-requested" and not str(d.get("comments", "")).strip():
        errs.append("changes-requested needs comments saying what to change")
    return errs


def apply_one(lesson, signoffs):
    """Pure function. Returns (new lesson dict, list of log lines). Does not touch disk."""
    lid = lesson["id"]; rev = rp.revision(lesson)
    rv = dict(lesson.get("review") or {}); log = []
    notes = []
    promoted = None
    teacher = []
    for d in signoffs:
        who = f"{d['reviewer']} ({d['reviewer_role']}, {d['date']})"
        if d["revision"] != rev:
            notes.append(f"Sign-off by {who} was for revision {d['revision']}; the lesson is now {rev}. Not applied.")
            log.append(f"{lid}: STALE sign-off by {who} (revision {d['revision']} vs {rev})"); continue
        if d["verdict"] == "changes-requested":
            notes.append(f"Changes requested by {who}: {d.get('comments', '').strip()}")
            log.append(f"{lid}: changes requested by {who}"); continue
        if d["reviewer_role"] == "teacher":
            teacher.append({"reviewer": d["reviewer"], "date": d["date"], "revision": rev, "scores": d["scores"]})
            log.append(f"{lid}: teacher approval recorded ({who}); chess still needs a strong player"); continue
        promoted = d
    if promoted:
        d = promoted
        rv.update(status="human-reviewed", reviewer=d["reviewer"], reviewer_role=d["reviewer_role"], date=d["date"], revision=rev, scores=d["scores"])
        if d.get("comments", "").strip(): rv["comments"] = d["comments"].strip()
        rv.pop("note", None)
        log.append(f"{lid}: HUMAN-REVIEWED by {d['reviewer']} on {d['date']} (revision {rev})")
    else:
        if rv.get("status") == "human-reviewed" and rv.get("revision") != rev:
            rv.update(status="needs-human")
            for k in ("reviewer", "reviewer_role", "date", "scores", "comments"): rv.pop(k, None)
            rv["reviewer"] = None
            notes.append(f"Reviewed at revision {rv.get('revision')}; the text has changed (now {rev}), so the review no longer applies.")
            log.append(f"{lid}: review is stale, back to needs-human")
        elif rv.get("status") == "human-reviewed":
            log.append(f"{lid}: unchanged (human-reviewed at the current revision)")
    if teacher: rv["teacher_reviews"] = teacher
    if notes: rv["note"] = " ".join(notes)
    out = dict(lesson); out["review"] = rv
    return out, log


def run(dry=False, lessons_dir=LESSONS, signoff_dir=None):
    signoff_dir = signoff_dir or rp.SIGNOFF_DIR
    log, problems = [], []
    lessons = {}
    for f in sorted(lessons_dir.glob("*.json")):
        d = json.loads(f.read_text(encoding="utf-8")); lessons[d["id"]] = (f, d)
    seen = set()
    files = sorted(signoff_dir.glob("*.json")) if signoff_dir.exists() else []
    for f in files:
        lid = f.stem; seen.add(lid)
        if lid not in lessons: problems.append(f"{f.name}: no lesson {lid}"); continue
        try: raw = json.loads(f.read_text(encoding="utf-8"))
        except Exception as ex: problems.append(f"{f.name}: not valid JSON ({ex})"); continue
        rows = raw if isinstance(raw, list) else [raw]
        bad = [f"{f.name}: {e}" for d in rows for e in check_signoff(d, lid)]
        if bad: problems += bad; continue
        new, lg = apply_one(lessons[lid][1], rows); log += lg
        if new != lessons[lid][1] and not dry:
            f_ = lessons[lid][0]
            f_.write_text(json.dumps(new, indent=2, ensure_ascii=False), encoding="utf-8")   # same format as the other lesson files
    # lessons already marked human-reviewed that have no sign-off file at all: the claim has no evidence
    for lid, (f, d) in lessons.items():
        if d.get("review", {}).get("status") == "human-reviewed" and lid not in seen:
            problems.append(f"{lid}: marked human-reviewed but there is no content/review/{lid}.json")
    return log, problems


def main(argv):
    log, problems = run(dry="--dry-run" in argv)
    for l in log: print(l)
    for p in problems: print("PROBLEM", p)
    n = sum(1 for l in log if "HUMAN-REVIEWED" in l)
    print(f"{n} lessons marked human-reviewed, {len(problems)} problems" + (" (dry run, nothing written)" if "--dry-run" in argv else ""))
    return 1 if problems else 0


if __name__ == "__main__":
    _s.exit(main(_s.argv[1:]))
