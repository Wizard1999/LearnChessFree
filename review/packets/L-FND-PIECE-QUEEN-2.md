# Review packet: L-FND-PIECE-QUEEN-2

**The queen in a busy position**

- Skill: FND.PIECE.QUEEN (D2); stage: S2; stated length: 10 minutes
- Steps: 10 (6 are tasks); revision: `90385b23`
- Review status now: needs-human

## What the lesson says the learner will be able to do

- Names the piece on a given square before using its rule, with no hint in the prompt
- Taps every square a queen can reach by tracing its eight lines separately
- Says that the queen does not jump like a knight
- Says that a blocker on one line does not stop the queen on the other lines

## Sources the author names (check that they are used fairly, in our own words)

- content/skills/FND.PIECE.QUEEN.json (D2 outcome)
- content/lessons/L-FND-QUEENKING-1.json
- content/items/lesson-ds12.json
- rules of chess (python-chess legal move generation, via tools/validate.py)

## How to read this packet

Boards are drawn with capitals for White and lower case for Black, rank 8 at the top unless the board is shown from Black's side. Moves in a line are in standard notation. Statements marked [V] were machine-checked, [I] inference, [H] hypothesis, [S] secondary source, [R] recalled. Please judge the explanations, not only the moves: does each sentence tell the learner why?

---

### Step 1: card

In **How the queen moves** you were told "queen". Now nobody says it. Name the piece first. Then trace its **eight lines** one by one: four along ranks and files, four along diagonals. Each line stops before an own piece, or on the first enemy piece, which can be taken.

### Step 2: board

Caption: The piece on c3 is a queen. Its pawn on e3 and king on e1 stop two lines one square early. The knight on d5 is on none of its lines.

```
  8  . . . . k . . .
  7  . . . . . . . .
  6  . . . . . . . .
  5  . . . n . . . .
  4  . . . . . . . .
  3  . . Q . P . . .
  2  . . . . . . . .
  1  . . . . K . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 4k3/8/8/3n4/8/2Q1P3/8/4K3 w - - 0 1
```

The line, with the sentence the learner sees at each move:
1. **1. Qa5**: The queen slides up-left along the diagonal to a5.
2. **1... Kd7**: Black moves the king.

```
  8  . . . . . . . .
  7  . . . k . . . .
  6  . . . . . . . .
  5  Q . . n . . . .
  4  . . . . . . . .
  3  . . . . P . . .
  2  . . . . . . . .
  1  . . . . K . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 8/3k4/8/Q2n4/8/4P3/8/4K3 w - - 2 2
```

Drawn on the board: arrows c3-c8, c3-h8, c3-a1; highlighted squares a1, a3, a5, b2, b3, b4, c1, c2, c4, c5, c6, c7, c8, d2, d3, d4, e5, f6, g7, h8.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_destinations] (no sentence; a rules check)

### Step 3: item

**Task `IG-MOVE-101`** (select_squares, difficulty cue 3)

Black to move. Tap every square the piece on a2 can move to.

```
  1  . . . . . . . .
  2  . . . p . . . q
  3  . . k . . . . .
  4  . . . . P . . .
  5  . . . . P . . p
  6  . . . . . . . .
  7  . . . . . . P .
  8  . . K . . . . .
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: 5K2/1P6/8/p2P4/3P4/5k2/q3p3/8 b - - 0 1
```

**Accepted answer:** squares a1, a3, a4, b1, b2, b3, c2, c4, d2, d5 (from a2)

**Explanation shown:** The queen on a2 can move to 10 squares: a1, a3, a4, b1, b2, b3, c2, c4, d2, d5. It can capture the pawn on d5. It cannot land on its own pieces on a5 and e2.

Hints (in order):
1. First decide what kind of piece stands on a2. Then recall how that piece moves.
2. On each line it slides until something is in the way: it cannot jump and cannot land on its own pieces.
3. An enemy piece in the way can be captured, and the queen stops there. Check the eight directions one at a time.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_destinations] The black queen on a2 can legally move to exactly these squares.

### Step 4: card

The queen moves as a rook and a bishop together. Each of the eight lines is blocked on its own: an own piece ends it one square early, and an enemy piece is the last square. A blocker on one line leaves the other seven untouched. *Rule of thumb:* count the lines you traced; eight, even if some are empty.

### Step 5: contrast

Title: Lines, jumps, blockers

Prompt: Predict first. The first position asks for every square. The second asks one yes/no question about a square a knight could reach from the same square. In the third, a pawn moved next to the queen: which of the queen's other lines are still open?

**The working board:**

**Task `IBds12-14`** (select_squares, difficulty cue 2)

White to move. Tap every square the piece on d4 can move to.

```
  8  . . . . k . . .
  7  . . . . . . . .
  6  . . . . . . . .
  5  . . . p . . . .
  4  . P . Q . P . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  . . . . K . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 4k3/8/8/3p4/1P1Q1P2/8/8/4K3 w - - 0 1
```

**Accepted answer:** squares a1, a7, b2, b6, c3, c4, c5, d1, d2, d3, d5, e3, e4, e5, f2, f6, g1, g7, h8 (from d4)

**Explanation shown:** The piece on d4 is a queen. It can move to 19 squares: a1, a7, b2, b6, c3, c4, c5, d1, d2, d3, d5, e3, e4, e5, f2, f6, g1, g7 and h8. It takes the pawn on d5 and stops. Its own pawns stop it on the rank at c4 and e4.

Hints (in order):
1. First find out which piece stands on d4.
2. The queen has eight lines. Trace them one at a time, each until something is in the way.
3. On the rank, your own pawns stop the queen one square early. On the file, an enemy pawn can be taken.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_destinations] The white piece on d4 can legally move to exactly these squares.
- [illegal_move] The queen cannot land on its own pawn on b4.
- [illegal_move] The queen cannot land on its own pawn on f4.

**The failing board:**

**Task `IBds12-15`** (predict_outcome, difficulty cue 3)

Can the white queen on d4 go to e6 in one move? Predict, then check.

```
  8  . . . . k . . .
  7  . . . . . . . .
  6  . . . . . . . .
  5  . . . p . . . .
  4  . P . Q . P . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  . . . . K . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 4k3/8/8/3p4/1P1Q1P2/8/8/4K3 w - - 0 1
```

**Accepted answer:** {"outcome": "no"}

**Explanation shown:** e6 is a knight's jump from d4, on none of the queen's eight lines. The queen cannot go there in one move.

Hints (in order):
1. Is e6 on the queen's rank, file or a diagonal from d4?
2. e6 is one file across and two ranks up.
3. That is a knight's jump. The queen does not jump.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [illegal_move] e6 is a knight's jump away, not on any line of the queen.
- [legal_move] The queen can still take the pawn on d5.

**The irrelevant board:**

**Task `IBds12-16`** (predict_outcome, difficulty cue 3)

White to move. Can the white queen on d4 go to d1 in one move? Predict, then check.

```
  8  . . . . k . . .
  7  . . . . . . . .
  6  . . . . . . . .
  5  . . . p . . . .
  4  . . P Q . P . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  . . . . K . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 4k3/8/8/3p4/2PQ1P2/8/8/4K3 w - - 0 1
```

**Accepted answer:** {"outcome": "yes"}

**Explanation shown:** The pawn on c4 blocks the line to the left only. The file down to d1 is still open, so the queen can go there.

Hints (in order):
1. The pawn blocks one line. Is d1 on that line?
2. d1 is on the d-file, below the queen.
3. Each of the queen's eight lines is blocked on its own.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] The queen can still slide down the file to d1.
- [illegal_move] The pawn on c4 blocks the way along the rank to b4.

### Step 6: item  (shown without telling the learner the topic: unlabeled test)

**Task `IG-MOVE-104`** (select_squares, difficulty cue 3)

White to move. Tap every square the piece on f6 can move to.

```
  8  . . . . . . . .
  7  . . . . . . . .
  6  . . . . P Q . .
  5  . . . . . . . q
  4  . . . n . . . .
  3  . . . . k . . .
  2  . K . . . . . .
  1  . . . . . b . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 8/8/4PQ2/7q/3n4/4k3/1K6/5b2 w - - 0 1
```

**Accepted answer:** squares d4, d8, e5, e7, f1, f2, f3, f4, f5, f7, f8, g5, g6, g7, h4, h6, h8 (from f6)

**Explanation shown:** The queen on f6 can move to 17 squares: d4, d8, e5, e7, f1, f2, f3, f4, f5, f7, f8, g5, g6, g7, h4, h6, h8. It can capture the bishop on f1 and the knight on d4. It cannot land on its own piece on e6.

Hints (in order):
1. First decide what kind of piece stands on f6. Then recall how that piece moves.
2. On each line it slides until something is in the way: it cannot jump and cannot land on its own pieces.
3. An enemy piece in the way can be captured, and the queen stops there. Check the eight directions one at a time.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_destinations] The white queen on f6 can legally move to exactly these squares.

### Step 7: item  (shown without telling the learner the topic: unlabeled test)

**Task `IG-MOVE-107`** (select_squares, difficulty cue 3)

Black to move. Tap every square the piece on h7 can move to.

```
  1  . . . . . . R .
  2  . . . . . . . .
  3  P . K . . . . .
  4  . . . . . . . k
  5  . . p . . . . .
  6  . . . . . . . .
  7  q . . . . . . n
  8  . . . . . . . .
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: 8/n6q/8/5p2/k7/5K1P/8/1R6 b - - 0 1
```

**Accepted answer:** squares b7, c7, d7, e7, f7, g6, g7, g8, h3, h4, h5, h6, h8 (from h7)

**Explanation shown:** The queen on h7 can move to 13 squares: b7, c7, d7, e7, f7, g6, g7, g8, h3, h4, h5, h6, h8. It can capture the pawn on h3. It cannot land on its own pieces on a7 and f5.

Hints (in order):
1. First decide what kind of piece stands on h7. Then recall how that piece moves.
2. On each line it slides until something is in the way: it cannot jump and cannot land on its own pieces.
3. An enemy piece in the way can be captured, and the queen stops there. Check the eight directions one at a time.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_destinations] The black queen on h7 can legally move to exactly these squares.

### Step 8: item  (shown without telling the learner the topic: unlabeled test)

**Task `IBds12-17`** (predict_outcome, difficulty cue 3)

Can the white queen on a1 go to c3 in one move? Predict, then check.

```
  8  . . . . k . . .
  7  . . . . . . . .
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . B . . . . . .
  1  Q . . . K . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 4k3/8/8/8/8/8/1B6/Q3K3 w - - 0 1
```

**Accepted answer:** {"outcome": "no"}

**Explanation shown:** The diagonal a1-c3 passes b2, where the queen's own bishop stands. The queen cannot jump, so c3 is out of reach.

Hints (in order):
1. Which line from a1 leads to c3?
2. Look at what stands on the squares of that diagonal.
3. Your own bishop on b2 blocks the diagonal. The queen cannot jump over it.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [illegal_move] The bishop on b2 stands on the diagonal between a1 and c3.
- [legal_move] The queen can slide up the open a-file to a8.

### Step 9: practice

A drill of 6 tasks drawn from the bank by tag ['node.FND.PIECE.QUEEN', 'cue.3'] (14 tasks carry those tags). Not reproduced here; ask for a sample if you want one checked.

### Step 10: reflect

Kind: expect

Prompt: In the silent items, did you trace all eight lines, or did you stop once you had a long list? Which line did you check last?

---

## Reviewer scorecard

Fill in the file `content/review/L-FND-PIECE-QUEEN-2.json` (a template is below). Scale 1 to 5 for each dimension: 1 = wrong or unusable, 3 = acceptable with edits, 5 = I would put my name to it as it stands.
Revision to review: `90385b23`. If the lesson text changes after your review, your sign-off no longer applies and the lesson goes back to needs-human.

| Dimension | What to judge | Score |
|---|---|---|
| chess | every statement, line and explanation is correct; near-misses are really near-misses | |
| clarity | the explanation actually explains (mechanism, conditions), in plain words | |
| prerequisites | the lesson assumes only what the learner has met | |
| tasks | each task has one defensible answer and a fair explanation | |

```json
{
  "lesson": "L-FND-PIECE-QUEEN-2",
  "revision": "90385b23",
  "reviewer": "<your name>",
  "reviewer_role": "strong-player",
  "date": "YYYY-MM-DD",
  "scores": {"chess": 0, "clarity": 0, "prerequisites": 0, "tasks": 0},
  "comments": "<what to change, by step number>",
  "verdict": "approved"
}
```

`reviewer_role` is `strong-player` or `teacher`. `verdict` is `approved` or `changes-requested`. See docs/review-slice.md.
