#!/usr/bin/env python3
"""Plain assert tests for the reach step, "grab the stars" (docs/reach-step.md): the validator's solver and checks, the minutes formula,
the depth and readiness counting and the review packet. Run:
    ./tools/.venv/Scripts/python.exe -I tools/test_reach.py
Prints ALL REACH TESTS PASSED. Writes nothing. The same positions and pars are in app/src/lib/reach.test.ts, so the two solvers agree."""
import sys as _s, pathlib as _p; _s.path.insert(0, str(_p.Path(__file__).resolve().parent))
import validate_lessons as VL
import build_content as BC
import check_depth as CD
import readiness as RD
import review_packet as RP

W = "L-X step 1 (reach)"
ROOK = "7k/8/8/8/8/8/8/R3K3 w - - 0 1"   # white rook a1, kings e1 and h8
GOOD = {"type": "reach", "title": "Grab the stars", "fen": ROOK, "stars": ["a5", "d5"], "order": "any", "par": 2, "say": "The rook slides along straight lines."}

e, w = VL.check_reach(GOOD, W)
assert e == [] and w == [], (e, w)

# the solver: par in any order and in a fixed order
assert VL.reach_solve(ROOK, ["a5", "d5"], "any") == (2, None)
assert VL.reach_solve(ROOK, ["d5", "a5"], "in-order") == (3, None)
# a capture on a star is allowed when legal
assert VL.reach_solve("7k/8/8/3p4/8/8/8/R3K3 w - - 0 1", ["d5"]) == (2, None)
# knight, pawn (double step), Black as the learner
assert VL.reach_solve("7k/8/8/8/8/8/8/1N2K3 w - - 0 1", ["d5"]) == (2, None)
assert VL.reach_solve("7k/8/8/8/8/8/4P3/K7 w - - 0 1", ["e4"]) == (1, None)
assert VL.reach_solve("7k/8/8/8/8/8/4P3/K7 w - - 0 1", ["e3", "e4"]) == (2, None)
assert VL.reach_solve("r3k3/8/8/8/8/8/8/7K b - - 0 1", ["a4"]) == (1, None)
# a pawn cannot go back: in this order the stars cannot all be collected
par, why = VL.reach_solve("7k/8/4p3/8/8/8/4P3/K7 w - - 0 1", ["e4", "e3"], "in-order")   # a black pawn on e6 stops a promotion
assert par is None and "in this order" in why, why

# errors: unreachable star (a dark-squared bishop and a light square), a square only reachable by giving check, star on an own piece,
# bad fen, par mismatch, no piece to move, the learner in check, bad order, empty stars, a bad square
def errs(step): return VL.check_reach({"type": "reach", **step}, W)[0]
assert any("no legal way to reach c2" in x for x in errs({"fen": "7k/8/8/8/8/8/8/2B1K3 w - - 0 1", "stars": ["c2"], "par": 1})), errs({"fen": "7k/8/8/8/8/8/8/2B1K3 w - - 0 1", "stars": ["c2"]})
assert any("no legal way to reach a8" in x for x in errs({"fen": "4k3/8/8/8/8/8/8/R5K1 w - - 0 1", "stars": ["a8"], "par": 1}))   # a8 would check the king on e8
assert any("own piece" in x for x in errs({"fen": ROOK, "stars": ["e1"], "par": 1}))
assert any("bad fen" in x for x in errs({"fen": "nonsense", "stars": ["a5"], "par": 1}))
assert any("par is 3 but the best is 2" in x for x in errs({**GOOD, "par": 3}))
assert any("no learner piece to move" in x for x in errs({"fen": "7k/8/8/8/8/p7/P7/7K w - - 0 1", "stars": ["b5"], "par": 1}))
assert any("starts in check" in x for x in errs({"fen": "4r2k/8/8/8/8/8/8/R3K3 w - - 0 1", "stars": ["a5"], "par": 1}))
assert any("'order'" in x for x in errs({**GOOD, "order": "random"}))
assert any("non-empty list" in x for x in errs({"fen": ROOK, "stars": [], "par": 1}))
assert any("not squares" in x for x in errs({"fen": ROOK, "stars": ["z9"], "par": 1}))
assert any("needs a 'fen'" in x for x in errs({"stars": ["a5"], "par": 1}))

# warnings: no par (says what it is), say over 15 words
_, w = VL.check_reach({k: v for k, v in GOOD.items() if k != "par"}, W)
assert any("no 'par' (the best is 2)" in x for x in w), w
_, w = VL.check_reach({**GOOD, "say": " ".join(["word"] * 16)}, W)
assert any("16 words" in x for x in w), w

# rounds: the step's own fields are round 1; a later round takes the step's fen unless it names one, and its errors name the round
two = {**GOOD, "rounds": [{"stars": ["c3"], "par": 2}, {"fen": "7k/8/8/8/8/8/8/1N2K3 w - - 0 1", "stars": ["d5"], "par": 2}]}
e, w = VL.check_reach(two, W)
assert e == [] and w == [], (e, w)
e, _ = VL.check_reach({**GOOD, "rounds": [{"stars": ["c3"], "par": 5}]}, W)
assert any("round 2" in x and "par is 5" in x for x in e), e
assert any("non-empty list" in x for x in VL.check_reach({**GOOD, "rounds": []}, W)[0])

# a reach step is a task (a card may be followed by it) and a board for the depth report and readiness
assert "reach" in VL.TASK_STEPS and "reach" in VL.STEP_TYPES and "reach" in CD.BOARD_STEPS
lesson = {"id": "L-X", "steps": [{"type": "card", "text": "Move the rook."}, GOOD]}
cls, ok, heavy = RD.meets_depth(lesson, early={"L-X"})
assert cls == "A" and heavy == 0

# minutes: 0.25 per star, every round counted, the same in both Python formulas (and in app/src/lib/lessonTime.ts, see its test)
steps = [two] * 4        # 4 * 0.25 * (2 + 1 + 1) = 4.0
assert BC.lesson_minutes(steps) == 4 == CD.lessonMinutes(steps), (BC.lesson_minutes(steps), CD.lessonMinutes(steps))
many = [{"type": "reach", "fen": ROOK, "stars": ["a5"] * 10}] * 3   # 3 * 2.5 = 7.5 -> 8
assert BC.lesson_minutes(many) == 8 == CD.lessonMinutes(many)

# review packet: the step is rendered with its stars and par on a diagram, and its stable id is the same recipe as build_content's
txt = RP.render_step(1, two, {}, {})
assert "Grab the stars" in txt and "stars on a5, d5 (in any order); best 2 moves" in txt and "Round 3 of 3" in txt and "*" in txt, txt
assert RP._step_key(GOOD).startswith("r") and RP._step_key(GOOD) != RP._step_key({**GOOD, "stars": ["a5"]})

print("ALL REACH TESTS PASSED")
