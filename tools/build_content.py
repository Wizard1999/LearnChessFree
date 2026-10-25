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
    blob = json.dumps([skills, items, lessons], sort_keys=True).encode()
    manifest = dict(version=1, built=datetime.datetime.now(datetime.timezone.utc).isoformat(timespec="seconds"),
                    hash=hashlib.sha256(blob).hexdigest()[:16], skills=len(skills), items=len(items), lessons=len(lessons),
                    skipped=len(skipped), by_review={s: sum(1 for i in items if i.get("review", {}).get("status") == s) for s in ("machine-only", "needs-human", "human-reviewed")})
    w("manifest.json", manifest)
    print(json.dumps(manifest, indent=1))
    for i, why in skipped[:20]: print("  skipped", i, why)
    if len(skipped) > 20: print(f"  ... {len(skipped) - 20} more skipped")


if __name__ == "__main__":
    main()
