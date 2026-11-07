# Review packet: L-FND-QUEENKING-1

**How the queen moves**

- Skill: FND.PIECE.QUEEN (D1); stage: S0; stated length: 9 minutes
- Steps: 13 (9 are tasks); revision: `c385a0b5`
- Review status now: needs-human

## What the lesson says the learner will be able to do

- Taps every square a queen can reach, stopping in front of its own pieces and on the first enemy piece
- Rejects a knight-shaped jump for the queen
- Tells whether a blocker on one line affects the queen's other lines

## Sources the author names (check that they are used fairly, in our own words)

- docs/first-hours.md session 1
- docs/council-synthesis.md CD-1, CD-4

## How to read this packet

Boards are drawn with capitals for White and lower case for Black, rank 8 at the top unless the board is shown from Black's side. Moves in a line are in standard notation. Statements marked [V] were machine-checked, [I] inference, [H] hypothesis, [S] secondary source, [R] recalled. Please judge the explanations, not only the moves: does each sentence tell the learner why?

---

### Step 1: card

The **queen** is the strongest piece. She moves like a rook and a bishop combined: any distance along a rank, a file or a diagonal. She cannot jump, and she captures the same way: by landing on an enemy piece. That gives her eight lines out of her square.

### Step 2: board

Caption: Eight directions. Two white pawns and two black pawns decide where each line stops.

```
  8  . . . . . . k .
  7  . . . . . . . .
  6  . . . . . p . .
  5  . . p . . . . .
  4  . P . Q . . . .
  3  . . . . . . . .
  2  . . . P . . . .
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 6k1/8/5p2/2p5/1P1Q4/8/3P4/6K1 w - - 0 1
```

Drawn on the board: arrows d4-d8, d4-g4; highlighted squares a1, b2, c3, c4, c5, d3, d5, d6, d7, d8, e3, e4, e5, f2, f4, f6, g4, h4.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_destinations] (no sentence; a rules check)

### Step 3: item

**Task `IA0-22`** (select_squares, difficulty cue 1)

Tap every square the white queen can move to.

```
  8  . . . . . . k .
  7  . . . . . . . .
  6  . . . . . p . .
  5  . . p . . . . .
  4  . P . Q . . . .
  3  . . . . . . . .
  2  . . . P . . . .
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 6k1/8/5p2/2p5/1P1Q4/8/3P4/6K1 w - - 0 1
```

**Accepted answer:** squares a1, b2, c3, c4, c5, d3, d5, d6, d7, d8, e3, e4, e5, f2, f4, f6, g4, h4 (from d4)

**Explanation shown:** The queen can reach 18 squares. It can capture the black pawn on f6 and the black pawn on c5, and each of those lines ends there. It stops before its own pawn on b4, pawn on d2 and king on g1.

Hints (in order):
1. The queen moves like a rook and a bishop together: straight lines and diagonals.
2. Go in all eight directions, one at a time, and stop at the first piece.
3. Two white pawns shorten two of the lines. Two black pawns can be captured, and the lines stop there.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_destinations] These are exactly the squares the queen on d4 can move to.

### Step 4: card

**When it holds:** the queen slides along any of her eight lines until something stops her. A friendly piece stops her one square early; an enemy piece can be captured, and she stops there. **When it fails:** she never moves like a knight, and she cannot jump over anything. Each line is blocked separately, so a blocker on one line leaves the other seven alone.

### Step 5: contrast

Title: Same queen, one change

Prompt: Predict first: can the queen still reach h8 each time?

**The working board:**

**Task `ISsp3-1`** (predict_outcome, difficulty cue 2)

Can the white queen on d4 go to h8 in one move? Predict, then check.

```
  8  k . . . . . . .
  7  . . . . . . . .
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . Q . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  . . . . K . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: k7/8/8/8/3Q4/8/8/4K3 w - - 0 1
```

**Accepted answer:** {"outcome": "yes"}

**Explanation shown:** The diagonal from d4 to h8 has nothing on it (e5, f6 and g7 are empty), so the queen slides all the way.

Hints (in order):
1. Which line from d4 leads toward h8: a rank, a file or a diagonal?
2. Trace the diagonal square by square: e5, f6, g7, h8. Is anything on it?

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] The diagonal d4-h8 is empty, so the queen can go to h8.

**The failing board:**

**Task `ISsp3-2`** (predict_outcome, difficulty cue 2)

A white pawn now stands on f6. Can the white queen on d4 go to h8 in one move? Predict, then check.

```
  8  k . . . . . . .
  7  . . . . . . . .
  6  . . . . . P . .
  5  . . . . . . . .
  4  . . . Q . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  . . . . K . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: k7/8/5P2/8/3Q4/8/8/4K3 w - - 0 1
```

**Accepted answer:** {"outcome": "no"}

**Explanation shown:** The pawn on f6 stands on the diagonal. The queen cannot jump over it or land on it, so h8 is out of reach; she can only go as far as e5 on that line.

Hints (in order):
1. Which line from d4 leads toward h8: a rank, a file or a diagonal?
2. Trace the diagonal square by square: e5, f6, g7, h8. Is anything on it?
3. Look at what changed: a white pawn on f6 sits on that diagonal.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [illegal_move] The queen's own pawn on f6 blocks the diagonal.
- [legal_move] The queen can still stop on e5, in front of the pawn.

**The irrelevant board:**

**Task `ISsp3-3`** (predict_outcome, difficulty cue 2)

A black pawn now stands on b3. Can the white queen on d4 go to h8 in one move? Predict, then check.

```
  8  k . . . . . . .
  7  . . . . . . . .
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . Q . . . .
  3  . p . . . . . .
  2  . . . . . . . .
  1  . . . . K . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: k7/8/8/8/3Q4/1p6/8/4K3 w - - 0 1
```

**Accepted answer:** {"outcome": "yes"}

**Explanation shown:** The pawn on b3 is not on the diagonal from d4 to h8, and it blocks no other line toward h8, so nothing changes: the queen can still go to h8. The pawn on b3 is a knight's jump away from d4, but the queen does not move like a knight, so it is no obstacle and no target on the way to h8.

Hints (in order):
1. Which line from d4 leads toward h8: a rank, a file or a diagonal?
2. Trace the diagonal square by square: e5, f6, g7, h8. Is anything on it?
3. Is the pawn on b3 on the line from d4 to h8?

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] The diagonal d4-h8 is still empty.

### Step 6: item

**Task `IG-MOVE-77`** (select_squares, difficulty cue 1)

Black to move. Tap every square the black queen on e3 can move to.

```
  1  . . . . . . . .
  2  . . . . . . . .
  3  . . . q . . . .
  4  . . . . . . K .
  5  . . . k . . . .
  6  . . . . . . . .
  7  . . . n . . . .
  8  . . . . . . . .
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: 8/4n3/8/4k3/1K6/4q3/8/8 b - - 0 1
```

**Accepted answer:** squares a3, a7, b3, b6, c1, c3, c5, d2, d3, d4, e1, e2, e4, f2, f3, f4, g1, g3, g5, h3, h6 (from e3)

**Explanation shown:** The queen on e3 can move to 21 squares: a3, a7, b3, b6, c1, c3, c5, d2, d3, d4, e1, e2, e4, f2, f3, f4, g1, g3, g5, h3, h6. It cannot land on its own piece on e5.

Hints (in order):
1. A queen moves like a rook and a bishop together. Which lines pass through e3: the rank, the file and two diagonals?
2. On each line it slides until something is in the way: it cannot jump and cannot land on its own pieces.
3. An enemy piece in the way can be captured, and the queen stops there. Check the eight directions one at a time.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_destinations] The black queen on e3 can legally move to exactly these squares.

### Step 7: item  (shown without telling the learner the topic: unlabeled test)

**Task `IG-MOVE-100`** (select_squares, difficulty cue 3)

Black to move. Tap every square the piece on h2 can move to.

```
  1  . . . . . . . .
  2  q . . . p . . .
  3  . . . . . k . .
  4  . . . P . . . .
  5  p . . P . . . .
  6  . . . . . . . .
  7  . P . . . . . .
  8  . . . . . K . .
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: 2K5/6P1/8/4P2p/4P3/2k5/3p3q/8 b - - 0 1
```

**Accepted answer:** squares e2, e5, f2, f4, g1, g2, g3, h1, h3, h4 (from h2)

**Explanation shown:** The queen on h2 can move to 10 squares: e2, e5, f2, f4, g1, g2, g3, h1, h3, h4. It can capture the pawn on e5. It cannot land on its own pieces on d2 and h5.

Hints (in order):
1. First decide what kind of piece stands on h2. Then recall how that piece moves.
2. On each line it slides until something is in the way: it cannot jump and cannot land on its own pieces.
3. An enemy piece in the way can be captured, and the queen stops there. Check the eight directions one at a time.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_destinations] The black queen on h2 can legally move to exactly these squares.

### Step 8: item  (shown without telling the learner the topic: unlabeled test)

**Task `IG-MOVE-102`** (select_squares, difficulty cue 3)

White to move. Tap every square the piece on h7 can move to.

```
  8  . . . . . . . .
  7  . . . P . . . Q
  6  . . K . . . . .
  5  . . . . p . . .
  4  . . . . p . . P
  3  . . . . . . . .
  2  . . . . . . p .
  1  . . k . . . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 8/3P3Q/2K5/4p3/4p2P/8/6p1/2k5 w - - 0 1
```

**Accepted answer:** squares e4, e7, f5, f7, g6, g7, g8, h5, h6, h8 (from h7)

**Explanation shown:** The queen on h7 can move to 10 squares: e4, e7, f5, f7, g6, g7, g8, h5, h6, h8. It can capture the pawn on e4. It cannot land on its own pieces on d7 and h4.

Hints (in order):
1. First decide what kind of piece stands on h7. Then recall how that piece moves.
2. On each line it slides until something is in the way: it cannot jump and cannot land on its own pieces.
3. An enemy piece in the way can be captured, and the queen stops there. Check the eight directions one at a time.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_destinations] The white queen on h7 can legally move to exactly these squares.

### Step 9: item  (shown without telling the learner the topic: unlabeled test)

**Task `IG-MOVE-103`** (select_squares, difficulty cue 3)

White to move. Tap every square the piece on c6 can move to.

```
  8  . . . . . . . .
  7  . . . . . . . .
  6  . . Q P . . . .
  5  q . . . . . . .
  4  . . . . n . . .
  3  . . . k . . . .
  2  . . . . . . K .
  1  . . b . . . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 8/8/2QP4/q7/4n3/3k4/6K1/2b5 w - - 0 1
```

**Accepted answer:** squares a4, a6, a8, b5, b6, b7, c1, c2, c3, c4, c5, c7, c8, d5, d7, e4, e8 (from c6)

**Explanation shown:** The queen on c6 can move to 17 squares: a4, a6, a8, b5, b6, b7, c1, c2, c3, c4, c5, c7, c8, d5, d7, e4, e8. It can capture the bishop on c1 and the knight on e4. It cannot land on its own piece on d6.

Hints (in order):
1. First decide what kind of piece stands on c6. Then recall how that piece moves.
2. On each line it slides until something is in the way: it cannot jump and cannot land on its own pieces.
3. An enemy piece in the way can be captured, and the queen stops there. Check the eight directions one at a time.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_destinations] The white queen on c6 can legally move to exactly these squares.

### Step 10: item  (shown without telling the learner the topic: unlabeled test)

**Task `IG-MOVE-105`** (select_squares, difficulty cue 3)

Black to move. Tap every square the piece on c3 can move to.

```
  1  . . . . . . . .
  2  . . . . . . . .
  3  . . . . p q . .
  4  . . . . . . . Q
  5  . . . N . . . .
  6  . . . . K . . .
  7  . k . . . . . .
  8  . . . . . B . .
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: 2B5/6k1/3K4/4N3/Q7/2qp4/8/8 b - - 0 1
```

**Accepted answer:** squares a1, a3, a5, b2, b3, b4, c1, c2, c4, c5, c6, c7, c8, d2, d4, e1, e5 (from c3)

**Explanation shown:** The queen on c3 can move to 17 squares: a1, a3, a5, b2, b3, b4, c1, c2, c4, c5, c6, c7, c8, d2, d4, e1, e5. It can capture the knight on e5 and the bishop on c8. It cannot land on its own piece on d3.

Hints (in order):
1. First decide what kind of piece stands on c3. Then recall how that piece moves.
2. On each line it slides until something is in the way: it cannot jump and cannot land on its own pieces.
3. An enemy piece in the way can be captured, and the queen stops there. Check the eight directions one at a time.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_destinations] The black queen on c3 can legally move to exactly these squares.

### Step 11: practice

A drill of 5 tasks drawn from the bank by tag ['node.FND.PIECE.QUEEN', 'kind.generated'] (36 tasks carry those tags). Not reproduced here; ask for a sample if you want one checked.

### Step 12: practice

A drill of 5 tasks drawn from the bank by tag ['node.FND.PIECE.QUEEN', 'cue.3', 'kind.generated'] (9 tasks carry those tags). Not reproduced here; ask for a sample if you want one checked.

### Step 13: reflect

Kind: confidence

Prompt: In the mixed round, which piece did you identify last, and how did you decide how it moves? Name one answer you would change. Rate how sure you were overall. (low / medium / high)

---

## Reviewer scorecard

Fill in the file `content/review/L-FND-QUEENKING-1.json` (a template is below). Scale 1 to 5 for each dimension: 1 = wrong or unusable, 3 = acceptable with edits, 5 = I would put my name to it as it stands.
Revision to review: `c385a0b5`. If the lesson text changes after your review, your sign-off no longer applies and the lesson goes back to needs-human.

| Dimension | What to judge | Score |
|---|---|---|
| chess | every statement, line and explanation is correct; near-misses are really near-misses | |
| clarity | the explanation actually explains (mechanism, conditions), in plain words | |
| prerequisites | the lesson assumes only what the learner has met | |
| tasks | each task has one defensible answer and a fair explanation | |

```json
{
  "lesson": "L-FND-QUEENKING-1",
  "revision": "c385a0b5",
  "reviewer": "<your name>",
  "reviewer_role": "strong-player",
  "date": "YYYY-MM-DD",
  "scores": {"chess": 0, "clarity": 0, "prerequisites": 0, "tasks": 0},
  "comments": "<what to change, by step number>",
  "verdict": "approved"
}
```

`reviewer_role` is `strong-player` or `teacher`. `verdict` is `approved` or `changes-requested`. See docs/review-slice.md.
