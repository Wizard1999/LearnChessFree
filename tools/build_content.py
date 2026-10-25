"""Flatten authored content into app/public/content/ for the web app.

    python tools/build_content.py [--allow-unverified]

Only items whose EVERY claim has a passing evidence record with the current content hash are shipped (strict by default).
Outputs: manifest.json, skills.json, items.json (positions embedded), lessons.json, verified.json (item id -> evidence summary).
"""
import sys as _s, pathlib as _p; _s.path.insert(0, str(_p.Path(__file__).resolve().parent))  # allow `python -I tools/<script>.py`
import hashlib, json, sys, datetime
from pathlib import Path
from engine import ROOT

OUT = ROOT / "app" / "public" / "content"
ALLOW = "--allow-unverified" in sys.argv


def jload(p): return json.loads(Path(p).read_text(encoding="utf-8"))


FIRST_LESSONS = 12      # lessons a brand-new learner can reach first (same order as lessonSort in app/src/lib/progress.ts)
FIRST_PRACTICE_CAP = 30  # items kept per practice step, so the first visit does not need the whole exercise bank


def first_visit_items(skills, lessons, items):
    """The exercises the first lessons need, so the app can start teaching before the whole bank (items.json, ~10 MB) has arrived.
    The app loads this file first and swaps in items.json when it finishes (app/src/lib/content.tsx). `ready` lists the practice tag sets
    whose exercises are all here, so those lessons can start at once."""
    tier = {s["id"]: s.get("tier", 9) for s in skills}
    order = sorted(lessons, key=lambda l: (tier.get(l["skill"], 9), l["skill"], l["depth"], l["id"]))[:FIRST_LESSONS]
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
    verified = {}
    for it in items:
        recs = ev_by_item.get(it["id"], [])
        verified[it["id"]] = dict(claims=len(recs), checked_at=max((r["checked_at"] for r in recs), default=None),
                                  engine=next((r["settings"]["engine"] for r in recs if (r.get("settings") or {}).get("engine")), None),
                                  depth=next((r["settings"]["depth"] for r in recs if (r.get("settings") or {}).get("depth")), None))
    def w(name, obj): (OUT / name).write_text(json.dumps(obj, separators=(",", ":")), encoding="utf-8")
    w("skills.json", skills); w("items.json", items); w("lessons.json", lessons); w("verified.json", verified)
    w("items-first.json", first_visit_items(skills, lessons, items))
    blob = json.dumps([skills, items, lessons], sort_keys=True).encode()
    # Skill-depths that have exercises but none at cue 3 or above: the app counts their cued evidence in full (app/src/lib/mastery.ts)
    best_cue = {}
    for it in items: best_cue[it["skill"]] = max(best_cue.get(it["skill"], 0), it.get("cue", 0))
    cued_only = sorted(k for k, c in best_cue.items() if c < 3)
    manifest = dict(version=1, cued_only=cued_only, depths_with_items=sorted(best_cue), built=datetime.datetime.now(datetime.timezone.utc).isoformat(timespec="seconds"),
                    hash=hashlib.sha256(blob).hexdigest()[:16], skills=len(skills), items=len(items), lessons=len(lessons),
                    skipped=len(skipped), by_review={s: sum(1 for i in items if i.get("review", {}).get("status") == s) for s in ("machine-only", "needs-human", "human-reviewed")})
    w("manifest.json", manifest)
    print(json.dumps(manifest, indent=1))
    for i, why in skipped[:20]: print("  skipped", i, why)
    if len(skipped) > 20: print(f"  ... {len(skipped) - 20} more skipped")


if __name__ == "__main__":
    main()
