# The reach step: grab the stars (design, 8 Nov 2026)

**Why:** the hook (D55, D56) wants the learner's hands on a piece within seconds. Lichess's "grab the stars" practice proves that a piece's movement is learned faster by moving it than by reading about it; this step does the same and adds what that practice lacks here: every position and par machine-checked, a keyboard and screen-reader path, rounds inside a lesson, and a rating that never blocks or penalises. [I: the learning claim is a design bet, not measured here.]

## What the learner sees
- A board with a star on each target square, a sentence of at most about 15 words under it (`say`), a list of the stars in words ("Star on h8"), a move counter and the best number of moves ("Moves: 1 · best: 2").
- The learner moves their piece (drag, tap-tap, or the board's keyboard grid). Each time a piece lands on a star, the star is collected (a short pop; none when the system or the app asks for reduced motion) and a polite announcement says which star and how many are left.
- When every star is collected: "Done in N moves (best P)." and a 1-3 star rating (3 at par or better, 2 at one over, 1 otherwise). The rating is a small reward only: Continue is always there, nothing is recorded as a mistake, and nothing counts against the learner.
- **Retry** starts the round again. **Show me** plays the shortest way to collect the stars still left (from the start if the current position can no longer finish, for example a pawn that went past a star); a shown round says "Shown in N moves" and has no rating.
- With `rounds`, the rounds follow one after another ("round 2 of 3", "Next round").

## The rules (the same in `app/src/lib/reach.ts` and `tools/validate_lessons.py`)
1. The side to move in the FEN is the learner. Castling and en passant are dropped; the turn goes straight back to the learner after every move (the other side never moves).
2. The learner's pieces other than the king move; the king moves only when it is the learner's only piece. Kings are on the board because the rules engine needs a legal position.
3. Only legal moves, and never a move that gives check: the other side could never answer it. Authors place the other king where the lesson piece does not see it.
4. A star is collected when a moving piece lands on it (passing over does not count). `order: "in-order"` counts only the next star in the list (the stars are numbered on the board and the later ones dimmed); `any` counts every star left.
5. Capturing an enemy piece is allowed when legal, including on a star. A pawn that reaches the last rank promotes (a queen unless the learner chose another piece).
6. `par` is the fewest moves that collect every star (breadth-first search over positions and stars collected).

## Schema
```
{"type":"reach","fen":"7k/8/8/8/8/8/8/R3K3 w - - 0 1","title?":"Grab the stars","stars":["a5","d5"],"order":"any","par":2,
 "say?":"The rook slides along straight lines.",
 "rounds?":[{"stars":["c3"],"par":2},{"fen":"<another position>","stars":["d5"],"order?":"in-order","par":2,"say?":"..."}]}
```
The step's own `fen`, `stars`, `order` (default `any`), `par` and `say` are round 1; each entry of `rounds` is a further round and takes the step's `fen` and `order` when it leaves them out.

## Validation (`tools/validate_lessons.py`, `check_reach`)
Errors: missing or bad FEN, an invalid position, the learner's king in check at the start, `order` not `any`/`in-order`, empty or bad star squares, a square starred twice, a star on the learner's own piece, no piece with a move on offer, a star no piece can legally land on (named), stars that cannot all be collected (or not in the given order), a search over 100,000 positions, and `par` different from the computed best. Warnings: no `par` (the message gives the right value), `say` over 15 words, unknown keys.

## Time, depth and review
- Planned time: 0.25 min per star, every round counted (`lib/lessonTime.ts`, `tools/build_content.py`, `tools/check_depth.py`; `lessonTime.test.ts`, `tools/test_reach.py` and the shipped-content vitest compare them).
- A reach step counts as a board (`BOARD_STEPS` in `tools/check_depth.py`, used by `tools/readiness.py`) and as a task after a card (`TASK_STEPS`).
- Review packets show each round as a diagram with `*` on empty starred squares, the order and the par. Stable step id: `fen|stars` (the same recipe in `build_content.py` and `review_packet.py`).

## Not done here
- The piece lessons themselves (another agent writes them).
- Measuring whether learners really pick up the moves faster this way (G1 baseline).
- Recording reach results as evidence of skill: by design nothing is recorded (it is learning by doing, not a test).
