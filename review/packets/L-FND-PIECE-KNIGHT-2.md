# Review packet: L-FND-PIECE-KNIGHT-2

**The knight in a busy position, on the edge and in the corner**

- Skill: FND.PIECE.KNIGHT (D2); stage: S2; stated length: 10 minutes
- Steps: 10 (6 are tasks); revision: `62ec7fb4`
- Review status now: needs-human

## What the lesson says the learner will be able to do

- Names the piece on a given square before using its rule, with no hint in the prompt
- Taps every square a knight can jump to in a crowded position, leaving out squares held by its own pieces
- Counts fewer than eight jumps for a knight on the edge or in the corner
- Says that pieces beside the knight do not block it

## Sources the author names (check that they are used fairly, in our own words)

- content/skills/FND.PIECE.KNIGHT.json (D2 outcome)
- content/lessons/L-FND-KNIGHT-1.json
- content/items/lesson-ds12.json
- rules of chess (python-chess legal move generation, via tools/validate.py)

## How to read this packet

Boards are drawn with capitals for White and lower case for Black, rank 8 at the top unless the board is shown from Black's side. Moves in a line are in standard notation. Statements marked [V] were machine-checked, [I] inference, [H] hypothesis, [S] secondary source, [R] recalled. Please judge the explanations, not only the moves: does each sentence tell the learner why?

---

### Step 1: card

In **The knight: the piece that jumps** you were told "knight". Now nobody says it. Name the piece first, then write down its eight possible jumps from the square. Cross out a jump that would leave the board and a jump onto your own piece. Pieces in between never matter. Try it on the edge.

### Step 2: board

Caption: The piece on h4 is a knight on the edge. Four jumps would be possible, but two land on its own pawns.

```
  8  . . . . . . k .
  7  . . . . . . . .
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . N
  3  . . . . . P . .
  2  . . . . . . P .
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 6k1/8/8/8/7N/5P2/6P1/6K1 w - - 0 1
```

The line, with the sentence the learner sees at each move:
1. **1. Ng6**: The knight jumps to g6.
2. **1... Kh7**: Black's king steps next to it, so the knight is attacked.

```
  8  . . . . . . . .
  7  . . . . . . . k
  6  . . . . . . N .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . P . .
  2  . . . . . . P .
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 8/7k/6N1/8/8/5P2/6P1/6K1 w - - 2 2
```

Drawn on the board: arrows h4-f5, h4-g6; highlighted squares f5, g6.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_destinations] (no sentence; a rules check)

### Step 3: item

**Task `IG-MOVE-178`** (select_squares, difficulty cue 3)

Black to move. Tap every square the piece on h7 can move to.

```
  1  . . . . . . . .
  2  . . . . K . . .
  3  . . . . . . . .
  4  . . . . k . . .
  5  . B . . . . . .
  6  . . p . . . . .
  7  n . . . . . . .
  8  . . r . . . . .
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: 5r2/7n/5p2/6B1/3k4/8/3K4/8 b - - 0 1
```

**Accepted answer:** squares g5 (from h7)

**Explanation shown:** The knight on h7 can move to 1 square: g5. It can capture the bishop on g5. It cannot land on its own pieces on f6 and f8.

Hints (in order):
1. First decide what kind of piece stands on h7. Then recall how that piece moves.
2. It jumps over other pieces, so nothing blocks it. It only cannot land on its own pieces; an enemy piece on a landing square can be captured.
3. There are at most eight landing squares. Check them in order: two up, two down, two left, two right, each with one step to the side.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_destinations] The black knight on h7 can legally move to exactly these squares.

### Step 4: card

A knight has up to eight jumps. On the edge it has fewer, in the corner at most two, because the other landing squares are off the board. Your own pieces take away only the squares they stand on. Pieces next to the knight, or on the squares between, change nothing. *Rule of thumb:* list the eight jumps, then cross out; do not guess the shape.

### Step 5: contrast

Title: Centre, edge, neighbours

Prompt: Predict first. In the first position the knight is in the middle of a crowd. In the second, it stands on the edge. In the third, a pawn beside it has moved. What changes?

**The working board:**

**Task `IBds12-7`** (select_squares, difficulty cue 2)

White to move. Tap every square the piece on d4 can move to.

```
  8  . . . . k . . .
  7  . . . . . . . .
  6  . . . . . . . .
  5  . . p . p B . .
  4  . . . N . . . .
  3  . . P P P . . .
  2  . . . . . . . .
  1  . . . . K . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 4k3/8/8/2p1pB2/3N4/2PPP3/8/4K3 w - - 0 1
```

**Accepted answer:** squares b3, b5, c2, c6, e2, e6, f3 (from d4)

**Explanation shown:** The piece on d4 is a knight. It can jump to 7 squares: b3, b5, c2, c6, e2, e6 and f3. The jump to f5 lands on its own bishop. The pawns beside it do not block it.

Hints (in order):
1. First find out which piece stands on d4.
2. Count the eight L-shaped jumps from d4, then cross out any that land on your own piece.
3. One jump lands on a white piece.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_destinations] The white piece on d4 can legally move to exactly these squares.
- [illegal_move] The knight cannot land on its own bishop on f5.

**The failing board:**

**Task `IBds12-8`** (select_squares, difficulty cue 2)

White to move. Tap every square the piece on h4 can move to.

```
  8  . . . . k . . .
  7  . . . . . . . .
  6  . . . . . . . .
  5  . . p . p B . .
  4  . . . . . . . N
  3  . . P P P . . .
  2  . . . . . . . .
  1  . . . . K . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 4k3/8/8/2p1pB2/7N/2PPP3/8/4K3 w - - 0 1
```

**Accepted answer:** squares f3, g2, g6 (from h4)

**Explanation shown:** On the edge the knight has fewer jumps. From h4 it can reach f3, g2 and g6. The jump to f5 is still blocked by its own bishop.

Hints (in order):
1. The knight now stands on the h-file.
2. Some of the eight jumps would land beyond the edge of the board.
3. One of the remaining jumps lands on your own bishop.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_destinations] The white piece on h4 can legally move to exactly these squares.
- [illegal_move] The knight cannot land on its own bishop on f5.

**The irrelevant board:**

**Task `IBds12-9`** (select_squares, difficulty cue 2)

White to move. Tap every square the piece on d4 can move to.

```
  8  . . . . k . . .
  7  . . . . . . . .
  6  . . . . . . . .
  5  . . p . p B . .
  4  . . . N . . . .
  3  . . P . P . . .
  2  . . . P . . . .
  1  . . . . K . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 4k3/8/8/2p1pB2/3N4/2P1P3/3P4/4K3 w - - 0 1
```

**Accepted answer:** squares b3, b5, c2, c6, e2, e6, f3 (from d4)

**Explanation shown:** The pawn moved from d3 to d2, away from the knight. A neighbour never blocks a jump, so the knight still has the same 7 squares: b3, b5, c2, c6, e2, e6 and f3.

Hints (in order):
1. Only a white pawn next to the knight has moved.
2. Does any piece next to a knight take away one of its jumps?
3. Only the landing square matters, so nothing changes.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_destinations] The white piece on d4 can legally move to exactly these squares.
- [illegal_move] The knight cannot land on its own bishop on f5.

### Step 6: item  (shown without telling the learner the topic: unlabeled test)

**Task `IG-MOVE-176`** (select_squares, difficulty cue 3)

White to move. Tap every square the piece on d3 can move to.

```
  8  . . . . b . . .
  7  . . . . . . . .
  6  k . . . . . . .
  5  . . . . . . . .
  4  . p . . . r . .
  3  . . . N . . . .
  2  . . . . . . . .
  1  . . . K B . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 4b3/8/k7/8/1p3r2/3N4/8/3KB3 w - - 0 1
```

**Accepted answer:** squares b2, b4, c1, c5, e5, f2, f4 (from d3)

**Explanation shown:** The knight on d3 can move to 7 squares: b2, b4, c1, c5, e5, f2, f4. It can capture the pawn on b4 and the rook on f4. It cannot land on its own piece on e1.

Hints (in order):
1. First decide what kind of piece stands on d3. Then recall how that piece moves.
2. It jumps over other pieces, so nothing blocks it. It only cannot land on its own pieces; an enemy piece on a landing square can be captured.
3. There are at most eight landing squares. Check them in order: two up, two down, two left, two right, each with one step to the side.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_destinations] The white knight on d3 can legally move to exactly these squares.

### Step 7: item  (shown without telling the learner the topic: unlabeled test)

**Task `IG-MOVE-177`** (select_squares, difficulty cue 3)

Black to move. Tap every square the piece on e6 can move to.

```
  1  . . . . B . . .
  2  . . . . . . . .
  3  K . . . . . . .
  4  . . . . . . . .
  5  . P . . . R . .
  6  . . . n . . . .
  7  . . . . . . . .
  8  . . . k b . . .
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: 3bk3/8/4n3/2R3P1/8/7K/8/3B4 b - - 0 1
```

**Accepted answer:** squares c5, c7, d4, f4, f8, g5, g7 (from e6)

**Explanation shown:** The knight on e6 can move to 7 squares: c5, c7, d4, f4, f8, g5, g7. It can capture the rook on c5 and the pawn on g5. It cannot land on its own piece on d8.

Hints (in order):
1. First decide what kind of piece stands on e6. Then recall how that piece moves.
2. It jumps over other pieces, so nothing blocks it. It only cannot land on its own pieces; an enemy piece on a landing square can be captured.
3. There are at most eight landing squares. Check them in order: two up, two down, two left, two right, each with one step to the side.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_destinations] The black knight on e6 can legally move to exactly these squares.

### Step 8: item  (shown without telling the learner the topic: unlabeled test)

**Task `IBds12-10`** (predict_outcome, difficulty cue 3)

Can the white knight on a1 move to c2? Predict, then check.

```
  8  . . . . k . . .
  7  . . . . . . . .
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . P . . . . . .
  2  . . P . . . . .
  1  N . . . K . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 4k3/8/8/8/8/1P6/2P5/N3K3 w - - 0 1
```

**Accepted answer:** {"outcome": "no"}

**Explanation shown:** From a1 the knight has only two jumps, b3 and c2, and both squares hold its own pawns. This knight has no move.

Hints (in order):
1. Which two squares can a knight on a1 reach at all?
2. Who stands on those two squares?
3. A knight cannot land on its own piece.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [illegal_move] The knight cannot land on its own pawn on c2.
- [illegal_move] The knight cannot land on its own pawn on b3.

### Step 9: practice

A drill of 6 tasks drawn from the bank by tag ['node.FND.PIECE.KNIGHT', 'cue.3'] (13 tasks carry those tags). Not reproduced here; ask for a sample if you want one checked.

### Step 10: reflect

Kind: expect

Prompt: When the knight stood on the edge, did you start from eight jumps and cross out, or did you only look for squares that were free?

---

## Reviewer scorecard

Fill in the file `content/review/L-FND-PIECE-KNIGHT-2.json` (a template is below). Scale 1 to 5 for each dimension: 1 = wrong or unusable, 3 = acceptable with edits, 5 = I would put my name to it as it stands.
Revision to review: `62ec7fb4`. If the lesson text changes after your review, your sign-off no longer applies and the lesson goes back to needs-human.

| Dimension | What to judge | Score |
|---|---|---|
| chess | every statement, line and explanation is correct; near-misses are really near-misses | |
| clarity | the explanation actually explains (mechanism, conditions), in plain words | |
| prerequisites | the lesson assumes only what the learner has met | |
| tasks | each task has one defensible answer and a fair explanation | |

```json
{
  "lesson": "L-FND-PIECE-KNIGHT-2",
  "revision": "62ec7fb4",
  "reviewer": "<your name>",
  "reviewer_role": "strong-player",
  "date": "YYYY-MM-DD",
  "scores": {"chess": 0, "clarity": 0, "prerequisites": 0, "tasks": 0},
  "comments": "<what to change, by step number>",
  "verdict": "approved"
}
```

`reviewer_role` is `strong-player` or `teacher`. `verdict` is `approved` or `changes-requested`. See docs/review-slice.md.
