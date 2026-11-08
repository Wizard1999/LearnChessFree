#!/usr/bin/env python3
"""Plain assert tests for the guided-game step (docs/first-game-design.md): the validator's checks and the minutes formula. Run:
    ./tools/.venv/Scripts/python.exe -I tools/test_guided.py
Prints ALL GUIDED TESTS PASSED. Writes nothing."""
import sys as _s, pathlib as _p; _s.path.insert(0, str(_p.Path(__file__).resolve().parent))
import validate_lessons as VL
import build_content as BC
import check_depth as CD

W = "L-X step 1 (guided)"
GOOD = {"type": "guided", "title": "First moves", "moves": [
    {"move": "e4", "by": "learner", "say": "The pawn claims the centre."},
    {"move": "e5", "by": "opponent", "say": "Black does the same."},
    {"move": "Nf3", "by": "learner", "say": "The knight attacks the pawn on e5.", "hint": "The knight beside your king."},
    {"move": "Nc6", "by": "opponent", "say": "The knight defends it."}], "end": "That was a real opening."}

e, w = VL.check_guided(GOOD, W)
assert e == [] and w == [], (e, w)

# an illegal move is an error and stops the replay
bad = {**GOOD, "moves": [GOOD["moves"][0], {"move": "Ke3", "by": "opponent", "say": "x"}]}
e, _ = VL.check_guided(bad, W)
assert any("not a legal move" in x for x in e), e

# the learner must play one colour
mixed = {**GOOD, "moves": [{"move": "e4", "by": "learner", "say": "a"}, {"move": "e5", "by": "learner", "say": "b"}]}
e, _ = VL.check_guided(mixed, W)
assert any("same colour" in x for x in e), e

# no learner move, empty moves, bad 'by', bad fen
assert any("no learner move" in x for x in VL.check_guided({"type": "guided", "moves": [{"move": "e4", "by": "opponent", "say": "a"}]}, W)[0])
assert any("non-empty" in x for x in VL.check_guided({"type": "guided", "moves": []}, W)[0])
assert any("learner or opponent" in x for x in VL.check_guided({"type": "guided", "moves": [{"move": "e4", "by": "me"}]}, W)[0])
assert any("bad fen" in x for x in VL.check_guided({"type": "guided", "fen": "nonsense", "moves": [{"move": "e4", "by": "learner"}]}, W)[0])

# a custom start position; Black as the learner with the opponent first
e, _ = VL.check_guided({"type": "guided", "fen": "4k3/8/8/8/8/8/4P3/4K3 w - - 0 1", "moves": [{"move": "e4", "by": "learner", "say": "Two squares."}]}, W)
assert e == [], e
e, _ = VL.check_guided({"type": "guided", "moves": [{"move": "d4", "by": "opponent", "say": "a"}, {"move": "d5", "by": "learner", "say": "b"}]}, W)
assert e == [], e

# warnings: a missing say and non-canonical SAN (a check without '+')
_, w = VL.check_guided({"type": "guided", "moves": [{"move": "e4", "by": "learner"}]}, W)
assert any("no 'say'" in x for x in w), w
_, w = VL.check_guided({"type": "guided", "fen": "4k3/8/8/8/8/8/8/R3K3 w - - 0 1", "moves": [{"move": "Ra8", "by": "learner", "say": "Mate."}]}, W)
assert any("canonical" in x for x in w), w

# a guided step is a task (a card may be followed by it) and its minutes agree in both formulas: 0.4 + 0.15 per move
assert "guided" in VL.TASK_STEPS and "guided" in VL.STEP_TYPES
steps = [GOOD] * 4   # 4 * (0.4 + 0.6) = 4.0
assert BC.lesson_minutes(steps) == 4 == CD.lessonMinutes(steps), (BC.lesson_minutes(steps), CD.lessonMinutes(steps))
twenty = [{"type": "guided", "moves": [{"move": "e4", "by": "learner"}] * 20}] * 2   # 2 * 3.4 = 6.8 -> 7
assert BC.lesson_minutes(twenty) == 7 == CD.lessonMinutes(twenty)

print("ALL GUIDED TESTS PASSED")
