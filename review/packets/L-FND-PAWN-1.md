# Review packet: L-FND-PAWN-1

**The pawn: moves and captures are different**

- Skill: FND.PIECE.PAWN (D1); stage: S0; stated length: 9 minutes
- Steps: 14 (9 are tasks); revision: `5cd6077c`
- Review status now: needs-human

## What the lesson says the learner will be able to do

- Taps every square a pawn can move to, including the two-square start and diagonal captures
- Knows a pawn cannot capture straight ahead and is blocked by any piece in front of it
- Knows what happens when a pawn reaches the last rank

## Sources the author names (check that they are used fairly, in our own words)

- docs/first-hours.md session 1
- docs/council-synthesis.md CD-1, CD-4

## How to read this packet

Boards are drawn with capitals for White and lower case for Black, rank 8 at the top unless the board is shown from Black's side. Moves in a line are in standard notation. Statements marked [V] were machine-checked, [I] inference, [H] hypothesis, [S] secondary source, [R] recalled. Please judge the explanations, not only the moves: does each sentence tell the learner why?

---

### Step 1: card

**Pawns** move straight forward, one square at a time, and never backward. From their starting square they may move two squares if both are empty. But pawns **capture** differently: one square diagonally forward. A pawn cannot capture straight ahead, and any piece directly in front of it blocks it.

### Step 2: board

Caption: Forward to e3 or e4, or a capture on d3. The pawn goes diagonally only to capture.

```
  8  . . . . k . . .
  7  . . . . . . . .
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . n . . . .
  2  . . . . P . . .
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 4k3/8/8/8/8/3n4/4P3/6K1 w - - 0 1
```

Drawn on the board: arrows e2-e4, e2-d3; highlighted squares d3, e3, e4.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_destinations] (no sentence; a rules check)

### Step 3: item

**Task `IA0-38`** (select_squares, difficulty cue 1)

Tap every square the white pawn on e2 can move to.

```
  8  . . . . k . . .
  7  . . . . . . . .
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . n . . . .
  2  . . . . P . . .
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 4k3/8/8/8/8/3n4/4P3/6K1 w - - 0 1
```

**Accepted answer:** squares d3, e3, e4 (from e2)

**Explanation shown:** The pawn can step to e3, jump two squares to e4 (it is still on its starting square), or capture the black knight diagonally on d3.

Hints (in order):
1. A pawn moves forward, never backward. White's pawns move up the board.
2. From its starting square a pawn may move one or two squares forward, if the squares are empty.
3. Pawns capture diagonally forward. Is there an enemy piece diagonally ahead?

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_destinations] These are exactly the squares the pawn on e2 can move to.

### Step 4: item

**Task `IA0-39`** (select_squares, difficulty cue 1)

Tap every square the white pawn on e4 can move to.

```
  8  . . . . k . . .
  7  . . . . . . . .
  6  . . . . . . . .
  5  . . . . n r . .
  4  . . . . P . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 4k3/8/8/4nr2/4P3/8/8/6K1 w - - 0 1
```

**Accepted answer:** squares f5 (from e4)

**Explanation shown:** The knight on e5 blocks the pawn, because pawns cannot capture straight ahead. The only legal move is the diagonal capture of the rook on f5. The empty square d5 does not count: a pawn goes diagonally only to capture.

Hints (in order):
1. Look at the square straight ahead of the pawn.
2. Pawns cannot capture straight ahead, and cannot move diagonally onto an empty square.
3. Check d5 and f5: is there an enemy piece on each?

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_destinations] These are exactly the squares the pawn on e4 can move to.

### Step 5: item

**Task `IA0-40`** (select_squares, difficulty cue 1)

Black to move. Tap every square the black pawn on d7 can move to.

```
  1  . K . . . . . .
  2  . . . . . . . .
  3  . . . . . . . .
  4  . . . . . . . .
  5  . . . . . . . .
  6  . . . B . N . .
  7  . . . . p . . .
  8  . . . k . . . .
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: 4k3/3p4/2N1B3/8/8/8/8/6K1 b - - 0 1
```

**Accepted answer:** squares c6, d5, d6, e6 (from d7)

**Explanation shown:** The pawn moves down: one step to d6, two steps to d5 (it is on its starting square), or it captures diagonally on c6 (knight) or e6 (bishop).

Hints (in order):
1. Black's pawns move down the board, toward rank 1.
2. Black's pawn on d7 is on its starting square. How many squares may it go forward?
3. Pawns capture diagonally forward: for Black, that means down and to the side.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_destinations] These are exactly the squares the pawn on d7 can move to.

### Step 6: card

Two details cause most pawn mistakes. The two-square jump is only for a pawn's first move, and only if both squares are empty. And a pawn captures diagonally, never straight ahead. Before moving a pawn ask: has it moved yet? And is the square ahead empty?

### Step 7: contrast

Title: Same pawn, one change

Prompt: The pawn moves up one square to e3. Predict first: can it still jump two squares?

**The working board:**

**Task `IA0-41`** (predict_outcome, difficulty cue 2)

Can the white pawn go straight to e4 in one move? Predict, then check.

```
  8  . . . . k . . .
  7  . . . . . . . .
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . P . . .
  1  . . . . K . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 4k3/8/8/8/8/8/4P3/4K3 w - - 0 1
```

**Accepted answer:** {"outcome": "yes"}

**Explanation shown:** The pawn is on its starting square and e3 and e4 are empty, so the two-square jump is allowed.

Hints (in order):
1. Where is the pawn now? Is it on its starting square?
2. Pawns may move two squares forward on their first move.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] The pawn can move from e2 to e4.

**The failing board:**

**Task `IA0-42`** (predict_outcome, difficulty cue 3)

Now the pawn is on e3. Can it go straight to e5 in one move? Predict, then check.

```
  8  . . . . k . . .
  7  . . . . . . . .
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . P . . .
  2  . . . . . . . .
  1  . . . . K . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 4k3/8/8/8/8/4P3/8/4K3 w - - 0 1
```

**Accepted answer:** {"outcome": "no"}

**Explanation shown:** The pawn has left its starting square. Now it can move only one square at a time: e4, then e5.

Hints (in order):
1. Has this pawn already moved?
2. The two-square jump is only for a pawn's first move.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [illegal_move] The pawn cannot jump to e5.
- [legal_move] It can step one square to e4.

### Step 8: contrast

Title: Same pawn, a different target

Prompt: The knight steps from the diagonal to straight ahead. Predict first: can the pawn still capture it?

**The working board:**

**Task `IA0-43`** (predict_outcome, difficulty cue 2)

The black knight stands diagonally in front of the pawn. Can the pawn capture it? Predict, then check.

```
  8  . . . . k . . .
  7  . . . . . . . .
  6  . . . . . . . .
  5  . . . n . . . .
  4  . . . . P . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  . . . . K . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 4k3/8/8/3n4/4P3/8/8/4K3 w - - 0 1
```

**Accepted answer:** {"outcome": "yes"}

**Explanation shown:** The knight is on d5, one square diagonally forward from the pawn on e4, so the pawn can capture it.

Hints (in order):
1. Pawns capture one square diagonally forward.
2. Where is the knight compared with the pawn?

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] The pawn can capture on d5.

**The failing board:**

**Task `IA0-44`** (predict_outcome, difficulty cue 3)

Now the black knight stands straight in front of the pawn. Can the pawn capture it? Predict, then check.

```
  8  . . . . k . . .
  7  . . . . . . . .
  6  . . . . . . . .
  5  . . . . n . . .
  4  . . . . P . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  . . . . K . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 4k3/8/8/4n3/4P3/8/8/4K3 w - - 0 1
```

**Accepted answer:** {"outcome": "no"}

**Explanation shown:** A pawn cannot capture straight ahead. The knight on e5 simply blocks the pawn, which has no legal move.

Hints (in order):
1. Pawns capture diagonally, not straight ahead.
2. A piece directly in front of a pawn blocks it.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [illegal_move] The pawn cannot move to e5.
- [legal_destinations] The pawn has no legal moves at all.

### Step 9: item

**Task `IA0-45`** (select_squares, difficulty cue 3)

Tap every square the white pawn on e2 can move to. Careful: it is still on its starting square.

```
  8  . . . . k . . .
  7  . . . . . . . .
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . b n . . .
  2  . . . . P . . .
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 4k3/8/8/8/8/3bn3/4P3/6K1 w - - 0 1
```

**Accepted answer:** squares d3 (from e2)

**Explanation shown:** The knight on e3 blocks the pawn, so neither e3 nor e4 is available: a pawn cannot jump over a piece. The only move is the diagonal capture of the bishop on d3.

Hints (in order):
1. The pawn is on its starting square, so a two-square jump is normally allowed. What has to be true for it?
2. Both squares in front of the pawn must be empty. Is e3 empty?
3. Pawns cannot jump over pieces and cannot capture straight ahead. Look diagonally.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_destinations] These are exactly the squares the pawn on e2 can move to.
- [illegal_move] The pawn cannot jump to e4.

### Step 10: item

**Task `IA0-46`** (select_squares, difficulty cue 3)

Tap every square the white pawn on c3 can move to.

```
  8  . . . . k . . .
  7  . . . . . . . .
  6  . . . . . . . .
  5  . . . . . . . .
  4  . n . n . . . .
  3  . . P . . . . .
  2  . . . . . . . .
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 4k3/8/8/8/1n1n4/2P5/8/6K1 w - - 0 1
```

**Accepted answer:** squares b4, c4, d4 (from c3)

**Explanation shown:** The pawn is not on its starting square, so it moves one square: c4. It can also capture the knights on b4 and d4, one on each diagonal.

Hints (in order):
1. Is this pawn on its starting square?
2. Check the square straight ahead, and then each diagonal.
3. Both diagonal squares hold black pieces.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_destinations] These are exactly the squares the pawn on c3 can move to.

### Step 11: board

Caption: When a pawn reaches the last rank, it turns into a new piece. Here it becomes a queen.

```
  8  . . . . . . k .
  7  . . . . P . . .
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 6k1/4P3/8/8/8/8/8/6K1 w - - 0 1
```

The line, with the sentence the learner sees at each move:
1. **1. e8=Q+**: The pawn reaches e8 and becomes a queen.
2. **1... Kh7**: Black's king moves.

```
  8  . . . . Q . . .
  7  . . . . . . . k
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 4Q3/7k/8/8/8/8/8/6K1 w - - 1 2
```

Drawn on the board: arrows e7-e8; highlighted squares e8.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] (no sentence; a rules check)
- [legal_move] (no sentence; a rules check)

### Step 12: item

**Task `IA0-47`** (find_move, difficulty cue 1)

The pawn has reached the seventh rank. Move it forward, and choose a queen when the game asks.

```
  8  . . . . . . k .
  7  . . . . P . . .
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 6k1/4P3/8/8/8/8/8/6K1 w - - 0 1
```

**Accepted answer(s):** e8=Q+

Feedback shown for wrong moves:
- e8=N: A knight is allowed, but the queen is stronger here.

**Explanation shown:** A pawn that reaches the far rank becomes a queen, rook, bishop or knight of its own colour. Here the queen is the engine's top choice.

Hints (in order):
1. The pawn is one step from the last rank.
2. When a pawn reaches the last rank it must change into another piece.
3. Move it to e8 and pick the strongest piece.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] The pawn can move to e8 and become a queen.
- [best_move_in] The engine's best move is to promote to a queen.

### Step 13: practice

A drill of 6 tasks drawn from the bank by tag ['node.FND.PIECE.PAWN', 'kind.generated'] (50 tasks carry those tags). Not reproduced here; ask for a sample if you want one checked.

### Step 14: reflect

Kind: unsure

Prompt: Which pawn rule felt least clear: the two-square start, the diagonal capture, or the last rank? Write it down so the app can bring it back.

---

## Reviewer scorecard

Fill in the file `content/review/L-FND-PAWN-1.json` (a template is below). Scale 1 to 5 for each dimension: 1 = wrong or unusable, 3 = acceptable with edits, 5 = I would put my name to it as it stands.
Revision to review: `5cd6077c`. If the lesson text changes after your review, your sign-off no longer applies and the lesson goes back to needs-human.

| Dimension | What to judge | Score |
|---|---|---|
| chess | every statement, line and explanation is correct; near-misses are really near-misses | |
| clarity | the explanation actually explains (mechanism, conditions), in plain words | |
| prerequisites | the lesson assumes only what the learner has met | |
| tasks | each task has one defensible answer and a fair explanation | |

```json
{
  "lesson": "L-FND-PAWN-1",
  "revision": "5cd6077c",
  "reviewer": "<your name>",
  "reviewer_role": "strong-player",
  "date": "YYYY-MM-DD",
  "scores": {"chess": 0, "clarity": 0, "prerequisites": 0, "tasks": 0},
  "comments": "<what to change, by step number>",
  "verdict": "approved"
}
```

`reviewer_role` is `strong-player` or `teacher`. `verdict` is `approved` or `changes-requested`. See docs/review-slice.md.
