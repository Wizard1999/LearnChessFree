#!/usr/bin/env python3
"""How long is the road to a first game? Cumulative lesson minutes along the recommended path (Andrew, 8 Nov 2026, decision D55).

    ./tools/.venv/Scripts/python.exe -I tools/check_path_time.py [--strict]

Promises: (1) the learner plays guided moves in a real game within about 10 minutes of starting; (2) about an hour later they can play a legal (bad) game.
Measured as: minutes before the first lesson with a 'guided' step is finished, and minutes to the end of the last lesson in READY (the pieces, capture and check/mate).
Informational until the Foundation rebuild lands; --strict exits 1 when a promise is broken (tools/check.py will switch to --strict then).
"""
import json, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
GUIDED_BY, READY_BY = 12, 75   # minutes: a little slack over the two promises (10 and about 70)
READY = ["L-FND-BOARD-1", "L-FND-ROOKBISHOP-1", "L-FND-PIECE-BISHOP-1", "L-FND-QUEENKING-1", "L-FND-KNIGHT-1", "L-FND-PAWN-1", "L-FND-PIECE-KING-1", "L-FND-CAPTURE-1", "L-FND-CHECK-1"]


def main():
    path = json.loads((ROOT / "content" / "path.json").read_text(encoding="utf-8"))
    sys.path.insert(0, str(ROOT / "tools"))
    from check_depth import lessonMinutes
    order = [l for s in path["stages"] for l in s["lessons"]]
    mins, guided = {}, {}
    for l in order:
        d = json.loads((ROOT / "content" / "lessons" / f"{l}.json").read_text(encoding="utf-8"))
        mins[l] = lessonMinutes(d.get("steps", [])); guided[l] = any(s.get("type") == "guided" for s in d.get("steps", []))
    t, first_guided = 0, None
    for l in order:
        t += mins[l]
        if guided[l] and first_guided is None: first_guided = t
    ready = sum(mins.get(l, 0) for l in READY)
    # the guided lesson counts only if it comes before the rest of the pieces; anything on the path before it adds to the wait
    bad = []
    print(f"minutes to the end of the first guided-game lesson: {first_guided if first_guided is not None else 'none exists yet'} (promise: about 10; limit {GUIDED_BY})")
    print(f"minutes of lessons to be ready for a legal game ({len(READY)} lessons): {ready} (promise: about 70; limit {READY_BY + GUIDED_BY})")
    if first_guided is None or first_guided > GUIDED_BY: bad.append("guided game not within about 10 minutes")
    if ready + (first_guided or 0) > READY_BY + GUIDED_BY: bad.append("legal-game readiness later than about 70 minutes")
    for b in bad: print("BROKEN PROMISE:", b)
    if not bad: print("PATH TIME OK")
    return 1 if (bad and "--strict" in sys.argv) else 0


if __name__ == "__main__":
    raise SystemExit(main())
