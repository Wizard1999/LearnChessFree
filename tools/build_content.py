"""Flatten authored content into app/public/content/ for the web app.

    python tools/build_content.py [--allow-unverified]

Only items whose EVERY claim has a passing evidence record with the current content hash are shipped (strict by default).
Outputs (see docs/performance.md for what the app loads when):
  - for tools and tests: skills.json, items.json (positions embedded), lessons.json (whole lessons), verified.json (item id -> evidence summary), courses.json
  - for the app, each named by the hash of its bytes so an old manifest can never meet new files: skills.<h>.json, items.<h>.json, items-first.<h>.json,
    verified.<h>.json, courses.<h>.json, lessons-catalog.<h>.json (every lesson's metadata, no step bodies) and lessons/<id>.<revision>.json (one body per lesson)
  - manifest.json, the only file fetched without a hash; it names the others in `files`.
"""
import sys as _s, pathlib as _p; _s.path.insert(0, str(_p.Path(__file__).resolve().parent))  # allow `python -I tools/<script>.py`
import hashlib, json, sys, datetime
from pathlib import Path
from engine import ROOT

OUT = ROOT / "app" / "public" / "content"
ALLOW = "--allow-unverified" in sys.argv


def jload(p): return json.loads(Path(p).read_text(encoding="utf-8"))


# Keys of a lesson that go into the catalog (everything the lists, the map and the daily plan need); the rest travels with the steps in the lesson's body file.
CATALOG_KEYS = ("id", "role", "revision", "title", "skill", "depth", "order", "stage", "review", "course", "series", "uses", "also")
HASHED = ("skills", "items", "items-first", "verified", "courses", "lessons-catalog")


def lesson_minutes(steps):
    """Same formula as lessonMinutes in app/src/lib/lessonTime.ts (a vitest compares the two on every lesson). JS `split(/\s+/)` keeps empty edges, so re.split is used."""
    import math, re
    words = lambda t: len(re.split(r"\s+", t))
    t = 0.0
    for s in steps:
        k = s.get("type")
        if k == "card": t += words(s["text"]) / 200
        elif k == "board": t += 0.4 + words(s.get("caption") or "") / 200
        elif k == "item": t += 0.8
        elif k == "contrast": t += 1.5
        elif k == "reflect": t += 1
        elif k == "practice": t += min(s.get("n") if s.get("n") is not None else 3, 3) * 0.7
        elif k == "guided": t += 0.4 + 0.15 * len(s.get("moves") or [])
    return max(3, math.floor(t + 0.5))


def split_lesson(l):
    """(catalog entry, body) of one lesson. The catalog entry says where the body is: lessons/<id>.<revision>.json."""
    steps = l.get("steps", [])
    entry = {k: l[k] for k in CATALOG_KEYS if k in l}
    entry["minutes"] = lesson_minutes(steps)
    entry["stepCount"] = len(steps)
    entry["stepRefs"] = [{"sid": st["sid"], **({"chapter": st["chapter"]} if st.get("chapter") else {})} for st in steps]
    entry["file"] = f"lessons/{l['id']}.{l['revision']}.json"
    body = {k: v for k, v in l.items() if k not in CATALOG_KEYS and k not in ("steps", "minutes")}
    body = {"id": l["id"], "revision": l["revision"], **body, "steps": steps}
    return entry, body


FIRST_LESSONS = 12      # lessons a brand-new learner can reach first (same order as lessonSort in app/src/lib/progress.ts)
FIRST_PRACTICE_CAP = 30  # items kept per practice step, so the first visit does not need the whole exercise bank


def first_visit_items(skills, lessons, items):
    """The exercises the first lessons need, so the app can start teaching before the whole bank (items.json, ~10 MB) has arrived.
    The app loads this file first and swaps in items.json when it finishes (app/src/lib/content.tsx). `ready` lists the practice tag sets
    whose exercises are all here, so those lessons can start at once."""
    tier = {s["id"]: s.get("tier", 9) for s in skills}
    order = sorted(lessons, key=lambda l: l.get("order", 9999))[:FIRST_LESSONS]   # the recommended path (tools/build_path.py)
    by_id = {i["id"]: i for i in items}
    keep, ready = {}, set()
    for l in order:
        for st in l.get("steps", []):
            for k in ("item", "working", "failing", "irrelevant"):
                if st.get(k) in by_id: keep[st[k]] = by_id[st[k]]
            if st.get("type") == "practice":
                tags = st.get("tags", [])
                ready.add("|".join(sorted(tags)))   # this tag set has its practice exercises in the first-visit file (all of them, or FIRST_PRACTICE_CAP)
                for it in [i for i in items if all(t in i.get("tags", []) for t in tags)][:FIRST_PRACTICE_CAP]: keep[it["id"]] = it
    return {"items": list(keep.values()), "ready": sorted(ready)}


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    skills = [jload(f) for f in sorted((ROOT / "content" / "skills").glob("*.json"))]
    pos, items = {}, []
    ev_by_item = {}
    for ef in sorted((ROOT / "content" / "_evidence").glob("*.evidence.json")):
        if ef.name == "lessons.evidence.json": continue
        for r in jload(ef):
            ev_by_item.setdefault(r["item"], []).append(r)
    skipped, dup = [], set()
    for f in sorted((ROOT / "content" / "items").glob("*.json")):
        d = jload(f)
        for p in d.get("positions", []): pos[p["id"]] = p
        for it in d.get("items", []):
            if it["id"] in dup: skipped.append((it["id"], "duplicate id")); continue
            dup.add(it["id"])
            recs = ev_by_item.get(it["id"], [])
            want = {c["id"] for c in it.get("claims", [])}
            h = hashlib.sha256(json.dumps([it, pos[it["position"]]], sort_keys=True).encode()).hexdigest()[:16]   # same recipe as validate.py
            fresh = [r for r in recs if r.get("content_hash") == h]                                            # evidence must match the CURRENT content
            ok = want and want <= {r["claim"] for r in fresh if r["result"] == "pass"} and not any(r["result"] != "pass" for r in fresh if r["claim"] in want)
            if not ok and not ALLOW: skipped.append((it["id"], "not fully verified")); continue
            p = pos[it["position"]]
            row = dict(it); row["fen"] = p["fen"]; row["family"] = p["family"]; row["provenance"] = p["provenance"]
            row["verified"] = bool(ok)
            pvs = [r["pv"] for r in fresh if r.get("pv") and len(r["pv"]) > 1]
            if pvs: row["reveal_pv"] = max(pvs, key=len)[:8]   # the engine's checked line, shown AFTER the learner answers
            items.append(row)
    lessons = [jload(f) for f in sorted((ROOT / "content" / "lessons").glob("*.json"))]
    import build_path   # the recommended learning path: every lesson gets its place (order) and stage; the app sorts by it
    path_doc = build_path.build()
    where = {lid: (n + 1, st["id"]) for n, (st, lid) in enumerate((st, lid) for st in path_doc["stages"] for lid in st["lessons"])}
    for l in lessons: l["order"], l["stage"] = where[l["id"]]
    (OUT / "path.json").write_text(json.dumps(path_doc, separators=(",", ":")), encoding="utf-8"); (ROOT / "content" / "path.json").write_text(json.dumps(path_doc, indent=1, ensure_ascii=False), encoding="utf-8")
    # stable step ids and a revision per lesson (D43): saved places follow the step id, so a rewrite can map where the learner was
    def step_key(st):
        t = st.get("type")
        if t == "card": raw = " ".join(st.get("text", "").split()[:12])
        elif t == "board": raw = st.get("fen", "") + "|" + (st.get("line") or [{}])[0].get("move", "")
        elif t == "item": raw = st.get("item", "")
        elif t == "practice": raw = ",".join(st.get("tags", []))
        elif t == "contrast": raw = str(st.get("working", ""))
        elif t == "reflect": raw = st.get("prompt", "")[:40]
        elif t == "finale": raw = st.get("fen", "") + "|" + str(st.get("color", ""))
        elif t == "guided": raw = (st.get("fen") or "start") + "|" + "|".join(m.get("move", "") for m in (st.get("moves") or [])[:4])
        else: raw = json.dumps(st, sort_keys=True)[:60]
        return t[0] + hashlib.sha1((t + "|" + raw).encode("utf-8")).hexdigest()[:7]
    for l in lessons:
        seen = {}
        for st in l.get("steps", []):
            k = step_key(st); seen[k] = seen.get(k, 0) + 1
            st["sid"] = k if seen[k] == 1 else f"{k}-{seen[k]}"
        l["revision"] = hashlib.sha1(json.dumps(l.get("steps", []), sort_keys=True, ensure_ascii=False).encode("utf-8")).hexdigest()[:8]
    # lesson roles: the introduction of a skill, a continuation, a course application or an assessment (explicit "role" in the source wins)
    first_of = {}
    for l in sorted(lessons, key=lambda x: (x["skill"], x["depth"], x.get("order", 9999))):
        if not l.get("course") and l["skill"] not in first_of: first_of[l["skill"]] = l["id"]
    for l in lessons:
        if l.get("role"): continue
        l["role"] = ("assessment" if l.get("course") == "stage-checks" else "application") if l.get("course") else ("intro" if first_of.get(l["skill"]) == l["id"] else "continuation")
    verified = {}
    for it in items:
        recs = ev_by_item.get(it["id"], [])
        verified[it["id"]] = dict(claims=len(recs), checked_at=max((r["checked_at"] for r in recs), default=None),
                                  engine=next((r["settings"]["engine"] for r in recs if (r.get("settings") or {}).get("engine")), None),
                                  depth=next((r["settings"]["depth"] for r in recs if (r.get("settings") or {}).get("depth")), None))
    def dump(obj): return json.dumps(obj, separators=(",", ":")).encode("utf-8")
    def w(name, obj): (OUT / name).write_bytes(dump(obj))
    def wh(stem, obj):
        """Write stem.<hash of the bytes>.json and return its name."""
        b = dump(obj); name = f"{stem}.{hashlib.sha256(b).hexdigest()[:12]}.json"; (OUT / name).write_bytes(b); return name
    courses = [jload(f) for f in sorted((ROOT / "content" / "courses").glob("*.json"))] if (ROOT / "content" / "courses").exists() else []
    # remove the hashed files and lesson bodies of earlier builds, so the folder holds exactly one build
    import re
    for f in OUT.glob("*.json"):
        if re.fullmatch(r"(%s)\.[0-9a-f]{12}\.json" % "|".join(map(re.escape, HASHED)), f.name): f.unlink()
    (OUT / "lessons").mkdir(exist_ok=True)
    for f in (OUT / "lessons").glob("*.json"): f.unlink()
    w("skills.json", skills); w("items.json", items); w("lessons.json", lessons); w("verified.json", verified); w("courses.json", courses)
    first = first_visit_items(skills, lessons, items)
    catalog = []
    for l in sorted(lessons, key=lambda x: x["id"]):
        entry, body = split_lesson(l)
        w(entry["file"], body); catalog.append(entry)
    files = {"skills": wh("skills", skills), "items": wh("items", items), "itemsFirst": wh("items-first", first), "verified": wh("verified", verified),
             "courses": wh("courses", courses), "catalog": wh("lessons-catalog", catalog)}
    (OUT / "items-first.json").unlink(missing_ok=True)   # only the hashed copy exists now
    blob = json.dumps([skills, items, lessons, verified, courses], sort_keys=True).encode()   # the build hash shown in the footer (BuildStamp)
    # Skill-depths that have exercises but none at cue 3 or above: the app counts their cued evidence in full (app/src/lib/mastery.ts)
    best_cue = {}
    for it in items: best_cue[it["skill"]] = max(best_cue.get(it["skill"], 0), it.get("cue", 0))
    cued_only = sorted(k for k, c in best_cue.items() if c < 3)
    manifest = dict(version=1, cued_only=cued_only, depths_with_items=sorted(best_cue), built=datetime.datetime.now(datetime.timezone.utc).isoformat(timespec="seconds"),
                    hash=hashlib.sha256(blob).hexdigest()[:16], skills=len(skills), items=len(items), lessons=len(lessons),
                    files=files, skipped=len(skipped), by_review={s: sum(1 for i in items if i.get("review", {}).get("status") == s) for s in ("machine-only", "needs-human", "human-reviewed")})
    w("manifest.json", manifest)
    print(json.dumps(manifest, indent=1))
    for i, why in skipped[:20]: print("  skipped", i, why)
    if len(skipped) > 20: print(f"  ... {len(skipped) - 20} more skipped")


if __name__ == "__main__":
    main()
