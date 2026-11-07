# Review packet: L-FND-PIECE-BISHOP-2

**The bishop in a busy position**

- Skill: FND.PIECE.BISHOP (D2); stage: S2; stated length: 10 minutes
- Steps: 10 (6 are tasks); revision: `9fb66a12`
- Review status now: needs-human

## What the lesson says the learner will be able to do

- Names the piece on a given square before using its rule, with no hint in the prompt
- Taps every square that bishop can reach in a crowded position
- Stops each diagonal at the first piece in the way: before an own piece, on an enemy piece
- Says that a piece on the bishop's own rank or file does not change its moves

## Sources the author names (check that they are used fairly, in our own words)

- content/skills/FND.PIECE.BISHOP.json (D2 outcome)
- content/lessons/L-FND-ROOKBISHOP-1.json
- content/items/lesson-ds12.json
- rules of chess (python-chess legal move generation, via tools/validate.py)

## How to read this packet

Boards are drawn with capitals for White and lower case for Black, rank 8 at the top unless the board is shown from Black's side. Moves in a line are in standard notation. Statements marked [V] were machine-checked, [I] inference, [H] hypothesis, [S] secondary source, [R] recalled. Please judge the explanations, not only the moves: does each sentence tell the learner why?

---

### Step 1: card

In **How the bishop moves** you were told "bishop". In a game nobody tells you. The new step comes first: **name the piece on the square**, then trace its lines. For a bishop that means four diagonals, one at a time, each stopped by the first piece in the way. Try it on the board.

### Step 2: board

Caption: The piece on e3 is a bishop. Eight squares, and the diagonal towards c5 ends on a black pawn.

```
  8  . . . . . . k .
  7  . . . . . p . .
  6  . . . . . . . .
  5  . . p . . . . .
  4  . . . . . . . .
  3  . . . . B . . .
  2  . P . . . . . .
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 6k1/5p2/8/2p5/8/4B3/1P6/6K1 w - - 0 1
```

The line, with the sentence the learner sees at each move:
1. **1. Bxc5**: The bishop takes the pawn on c5 and stops there; it cannot go on to b6.
2. **1... Kh7**: Black moves the king.

```
  8  . . . . . . . .
  7  . . . . . p . k
  6  . . . . . . . .
  5  . . B . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . P . . . . . .
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 8/5p1k/8/2B5/8/8/1P6/6K1 w - - 1 2
```

Drawn on the board: arrows e3-c5, e3-h6; highlighted squares c1, c5, d2, d4, f2, f4, g5, h6.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_destinations] (no sentence; a rules check)

### Step 3: item

**Task `IG-MOVE-66`** (select_squares, difficulty cue 3)

White to move. Tap every square the piece on c1 can move to.

```
  8  . . . . . . . .
  7  . . . . . . . .
  6  . . . . . . . N
  5  . p . . . . . K
  4  . . . . . . . .
  3  . . . k n . . .
  2  . R . . . . . .
  1  q . B . . . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 8/8/7N/1p5K/8/3kn3/1R6/q1B5 w - - 0 1
```

**Accepted answer:** squares d2, e3 (from c1)

**Explanation shown:** The bishop on c1 can move to 2 squares: d2, e3. It can capture the knight on e3. It cannot land on its own piece on b2.

Hints (in order):
1. First decide what kind of piece stands on c1. Then recall how that piece moves.
2. On each diagonal it slides until something is in the way. It cannot jump and cannot land on its own pieces.
3. An enemy piece in the way can be captured, and the bishop stops there. Check the four diagonal directions one at a time.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_destinations] The white bishop on c1 can legally move to exactly these squares.

### Step 4: card

Trace each diagonal until something is in the way. An **own** piece stops the bishop one square before it. An **enemy** piece can be taken, and then the bishop stops. A rook or pawn on the bishop's own rank or file is on none of its diagonals. *Rule of thumb:* if you marked a square past a piece, recheck that line.

### Step 5: contrast

Title: One change at a time

Prompt: Predict the squares first. The first position is the reference. In the second, one black pawn has been added. In the third, a rook has moved. Which answer changes, and which does not?

**The working board:**

**Task `IBds12-1`** (select_squares, difficulty cue 2)

White to move. Tap every square the piece on d4 can move to.

```
  8  r . . . k . . .
  7  p . . . . p . .
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . B . . . .
  3  . . P . . . . .
  2  P . . . . P P .
  1  R . . . K . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: r3k3/p4p2/8/8/3B4/2P5/P4PP1/R3K3 w - - 0 1
```

**Accepted answer:** squares a7, b6, c5, e3, e5, f6, g7, h8 (from d4)

**Explanation shown:** The piece on d4 is a bishop. It can move to 8 squares: a7, b6, c5, e3, e5, f6, g7 and h8. It takes the pawn on a7. It stops in front of its own pawns on c3 and f2.

Hints (in order):
1. First find out which piece stands on d4.
2. Follow each of the four diagonals from d4 until something stands in the way.
3. An enemy piece ends a diagonal but can be taken. Your own piece ends it one square earlier.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_destinations] The white piece on d4 can legally move to exactly these squares.
- [illegal_move] The bishop cannot land on its own pawn on c3.
- [illegal_move] The bishop cannot land on its own pawn on f2.

**The failing board:**

**Task `IBds12-2`** (select_squares, difficulty cue 2)

White to move. Tap every square the piece on d4 can move to.

```
  8  r . . . k . . .
  7  p . . . . p . .
  6  . . . . . . . .
  5  . . . . p . . .
  4  . . . B . . . .
  3  . . P . . . . .
  2  P . . . . P P .
  1  R . . . K . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: r3k3/p4p2/8/4p3/3B4/2P5/P4PP1/R3K3 w - - 0 1
```

**Accepted answer:** squares a7, b6, c5, e3, e5 (from d4)

**Explanation shown:** A black pawn on e5 now stands on the bishop's diagonal. The bishop can take it and then stops, so f6, g7 and h8 are out of reach. It has 5 squares: a7, b6, c5, e3 and e5.

Hints (in order):
1. The position is the same except for one black pawn.
2. Trace the up-right diagonal again: where does it end now?
3. The pawn on e5 can be taken, but nothing behind it can be reached.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_destinations] The white piece on d4 can legally move to exactly these squares.
- [illegal_move] The bishop cannot jump over the pawn on e5 to reach f6.

**The irrelevant board:**

**Task `IBds12-3`** (select_squares, difficulty cue 2)

White to move. Tap every square the piece on d4 can move to.

```
  8  r . . . k . . .
  7  p . . . . p . .
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . B . . . .
  3  . . P . . . . .
  2  P . . . . P P .
  1  . . . R K . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: r3k3/p4p2/8/8/3B4/2P5/P4PP1/3RK3 w - - 0 1
```

**Accepted answer:** squares a7, b6, c5, e3, e5, f6, g7, h8 (from d4)

**Explanation shown:** The white rook moved from a1 to d1, onto the bishop's file. It is on none of the four diagonals, so the bishop keeps the same 8 squares: a7, b6, c5, e3, e5, f6, g7 and h8.

Hints (in order):
1. Only a rook has moved. Is it on any of the bishop's diagonals?
2. The rook went to the same file as the bishop.
3. A piece on the bishop's own file or rank is not on a diagonal, so it changes nothing.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_destinations] The white piece on d4 can legally move to exactly these squares.

### Step 6: item  (shown without telling the learner the topic: unlabeled test)

**Task `IG-MOVE-68`** (select_squares, difficulty cue 3)

White to move. Tap every square the piece on e4 can move to.

```
  8  . . . k . . . .
  7  . . . . . . . p
  6  . . r . . . . .
  5  . q . . . . . .
  4  . . . . B K . .
  3  . . . . . N . .
  2  . . . . . . . .
  1  . . . . . . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 3k4/7p/2r5/1q6/4BK2/5N2/8/8 w - - 0 1
```

**Accepted answer:** squares b1, c2, c6, d3, d5, f5, g6, h7 (from e4)

**Explanation shown:** The bishop on e4 can move to 8 squares: b1, c2, c6, d3, d5, f5, g6, h7. It can capture the rook on c6 and the pawn on h7. It cannot land on its own piece on f3.

Hints (in order):
1. First decide what kind of piece stands on e4. Then recall how that piece moves.
2. On each diagonal it slides until something is in the way. It cannot jump and cannot land on its own pieces.
3. An enemy piece in the way can be captured, and the bishop stops there. Check the four diagonal directions one at a time.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_destinations] The white bishop on e4 can legally move to exactly these squares.

### Step 7: item  (shown without telling the learner the topic: unlabeled test)

**Task `IG-MOVE-69`** (select_squares, difficulty cue 3)

Black to move. Tap every square the piece on d5 can move to.

```
  1  . . . K . . . .
  2  . . . . . . . P
  3  . . R . . . . .
  4  . Q . . . . . .
  5  . . . . b k . .
  6  . . . . . n . .
  7  . . . . . . . .
  8  . . . . . . . .
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: 8/8/2n5/2kb4/6Q1/5R2/P7/4K3 b - - 0 1
```

**Accepted answer:** squares a2, b3, c4, e4, e6, f3, f7, g8 (from d5)

**Explanation shown:** The bishop on d5 can move to 8 squares: a2, b3, c4, e4, e6, f3, f7, g8. It can capture the pawn on a2 and the rook on f3. It cannot land on its own piece on c6.

Hints (in order):
1. First decide what kind of piece stands on d5. Then recall how that piece moves.
2. On each diagonal it slides until something is in the way. It cannot jump and cannot land on its own pieces.
3. An enemy piece in the way can be captured, and the bishop stops there. Check the four diagonal directions one at a time.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_destinations] The black bishop on d5 can legally move to exactly these squares.

### Step 8: item  (shown without telling the learner the topic: unlabeled test)

**Task `IBds12-18`** (predict_outcome, difficulty cue 3)

Can the white bishop on d4 move to g7? Predict, then check.

```
  8  . . . . k . . .
  7  . . . . . . . .
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . B . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  . . . . K . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 4k3/8/8/8/3B4/8/8/4K3 w - - 0 1
```

**Accepted answer:** {"outcome": "yes"}

**Explanation shown:** g7 is on the long diagonal d4-e5-f6-g7, and every square in between is empty.

Hints (in order):
1. Is g7 on a diagonal from d4?
2. Count three files across and three ranks up.
3. Check that every square between d4 and g7 is empty.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] g7 is on the long diagonal d4-e5-f6-g7 and every square in between is empty.

### Step 9: practice

A drill of 6 tasks drawn from the bank by tag ['node.FND.PIECE.BISHOP', 'cue.3'] (22 tasks carry those tags). Not reproduced here; ask for a sample if you want one checked.

### Step 10: reflect

Kind: expect

Prompt: Before you tapped squares in the silent items, did you first say which piece it was? Which diagonal did you check last, and did you skip it?

---

## Reviewer scorecard

Fill in the file `content/review/L-FND-PIECE-BISHOP-2.json` (a template is below). Scale 1 to 5 for each dimension: 1 = wrong or unusable, 3 = acceptable with edits, 5 = I would put my name to it as it stands.
Revision to review: `9fb66a12`. If the lesson text changes after your review, your sign-off no longer applies and the lesson goes back to needs-human.

| Dimension | What to judge | Score |
|---|---|---|
| chess | every statement, line and explanation is correct; near-misses are really near-misses | |
| clarity | the explanation actually explains (mechanism, conditions), in plain words | |
| prerequisites | the lesson assumes only what the learner has met | |
| tasks | each task has one defensible answer and a fair explanation | |

```json
{
  "lesson": "L-FND-PIECE-BISHOP-2",
  "revision": "9fb66a12",
  "reviewer": "<your name>",
  "reviewer_role": "strong-player",
  "date": "YYYY-MM-DD",
  "scores": {"chess": 0, "clarity": 0, "prerequisites": 0, "tasks": 0},
  "comments": "<what to change, by step number>",
  "verdict": "approved"
}
```

`reviewer_role` is `strong-player` or `teacher`. `verdict` is `approved` or `changes-requested`. See docs/review-slice.md.
