# Review packet: L-FND-PIECE-ROOK-2

**The rook in a busy position**

- Skill: FND.PIECE.ROOK (D2); stage: S2; stated length: 9 minutes
- Steps: 11 (7 are tasks); revision: `cc418e5b`
- Review status now: needs-human

## What the lesson says the learner will be able to do

- Decides what kind of piece stands on a named square before drawing its lines
- Taps every square the rook can reach when other pieces fill the board
- Says whether a rook can reach a far square, and spots the one piece that stops it

## Sources the author names (check that they are used fairly, in our own words)

- content/skills/FND.PIECE.ROOK.json (D2 outcome, conditions, contrasts)
- docs/first-hours.md
- items IBds13-1..6 (authored, content/items/lesson-ds13.json, rules-checked); IG-MOVE-28, IG-MOVE-31 (generated, reused)

## How to read this packet

Boards are drawn with capitals for White and lower case for Black, rank 8 at the top unless the board is shown from Black's side. Moves in a line are in standard notation. Statements marked [V] were machine-checked, [I] inference, [H] hypothesis, [S] secondary source, [R] recalled. Please judge the explanations, not only the moves: does each sentence tell the learner why?

---

### Step 1: card

You already know how a rook slides, from **How the rook moves**. Now the board is crowded and nobody tells you which piece to think about. Work in order: first **what piece is it**, then **which lines** does it travel on, then **what stands on each line**: empty, your own piece, or an enemy piece.

### Step 2: board

Caption: White rook on d1. Its own knight on d5 and its own king on g1 shorten two of its lines. The black pieces on f8, f7, g7 and h7 are off its lines.

```
  8  . . . . . r k .
  7  . . . . . p p p
  6  . . . . . . . .
  5  . . . N . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . . P P P
  1  . . . R . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 5rk1/5ppp/8/3N4/8/8/5PPP/3R2K1 w - - 0 1
```

Drawn on the board: arrows d1-d4; highlighted squares a1, b1, c1, d2, d3, d4, e1, f1.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_destinations] The white rook on d1 can legally move to exactly the highlighted squares.

### Step 3: item

**Task `IBds13-1`** (select_squares, difficulty cue 2)

White to move. The piece on d4 is a rook. Tap every square it can move to.

```
  8  . . . . . . k .
  7  . . p . . . . .
  6  . . . . . . . .
  5  . . . n B . . .
  4  . . P R . P . .
  3  . . . . . . . .
  2  . P . . . . . .
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 6k1/2p5/8/3nB3/2PR1P2/8/1P6/6K1 w - - 0 1
```

**Accepted answer:** squares d1, d2, d3, d5, e4 (from d4)

**Explanation shown:** The rook slides until something is in the way. It stops short of its own pawns (c4 and f4) and may take the knight on d5, but not go past it. Pieces off its rank and file (the bishop on e5, the pawns on b2 and c7) change nothing.

Hints (in order):
1. Look along the file and the rank from d4, one direction at a time.
2. Your own pawn on c4 and your own pawn on f4 shorten the rank. The black knight on d5 is an enemy piece.
3. Up the file the rook may take the knight on d5 and must stop there. Down the file it has three free squares.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_destinations] The white rook on d4 can legally move to exactly these squares.

### Step 4: card

Two checks stop most mistakes. **A piece blocks only if it stands on the rook's own rank or file**, between the rook and the target. And **the first piece on a line ends it**: your own piece means you stop one square short, an enemy piece means you may take it and stop there. If the piece is not a rook at all, none of this applies.

### Step 5: contrast

Title: Same rook, one change

Prompt: A white knight now stands on e3. Predict first: can the rook still reach g3?

**The working board:**

**Task `IBds13-2`** (predict_outcome, difficulty cue 3)

White to move. Can the piece on b3 reach g3 in one move? Predict, then check.

```
  8  . . . . . . k .
  7  . . . . . . . .
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . R . . . . . .
  2  . . . . . . . .
  1  K . . . . . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 6k1/8/8/8/8/1R6/8/K7 w - - 0 1
```

**Accepted answer:** {"outcome": "yes"}

**Explanation shown:** Yes. The rook is on the same rank as g3 and c3 to f3 are empty.

Hints (in order):
1. Find the piece on b3 and decide what kind it is. Then look at the squares between b3 and g3.
2. A piece that moves along ranks and files needs every square between b3 and g3 to be empty.
3. Check c3, d3, e3 and f3 one by one, and the target g3 itself.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] The rook can legally move from b3 to g3.

**The failing board:**

**Task `IBds13-3`** (predict_outcome, difficulty cue 3)

White to move. Can the piece on b3 reach g3 in one move? Predict, then check.

```
  8  . . . . . . k .
  7  . . . . . . . .
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . R . . N . . .
  2  . . . . . . . .
  1  K . . . . . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 6k1/8/8/8/8/1R2N3/8/K7 w - - 0 1
```

**Accepted answer:** {"outcome": "no"}

**Explanation shown:** No. The white knight on e3 stands on the rank between b3 and g3, and a rook cannot jump over it.

Hints (in order):
1. Find the piece on b3 and decide what kind it is. Then look at the squares between b3 and g3.
2. A piece that moves along ranks and files needs every square between b3 and g3 to be empty.
3. Check c3, d3, e3 and f3 one by one, and the target g3 itself.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [illegal_move] The rook cannot move from b3 to g3.

**The irrelevant board:**

**Task `IBds13-4`** (predict_outcome, difficulty cue 3)

White to move. Can the piece on b3 reach g3 in one move? Predict, then check.

```
  8  . . . . . . k .
  7  . . . . . . . .
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . N . . .
  3  . R . . . . . .
  2  . . . . . . . .
  1  K . . . . . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 6k1/8/8/8/4N3/1R6/8/K7 w - - 0 1
```

**Accepted answer:** {"outcome": "yes"}

**Explanation shown:** Yes. The knight moved to e4, off the rank, so it blocks nothing. A piece only matters if it stands on the line.

Hints (in order):
1. Find the piece on b3 and decide what kind it is. Then look at the squares between b3 and g3.
2. A piece that moves along ranks and files needs every square between b3 and g3 to be empty.
3. Check c3, d3, e3 and f3 one by one, and the target g3 itself.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] The rook can legally move from b3 to g3.

### Step 6: item  (shown without telling the learner the topic: unlabeled test)

**Task `IBds13-5`** (predict_outcome, difficulty cue 3)

White to move. Can the piece on c5 reach c1 in one move? Predict, then check.

```
  8  . . . . . . k .
  7  . . . . . . . .
  6  . . . . . . . .
  5  . . B . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  K . . . . . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 6k1/8/8/2B5/8/8/8/K7 w - - 0 1
```

**Accepted answer:** {"outcome": "no"}

**Explanation shown:** No. The piece on c5 is a bishop, and a bishop moves on diagonals only. The file down to c1 is empty, but the rook idea does not apply to a bishop.

Hints (in order):
1. Decide what kind of piece stands on c5 before you look at the squares.
2. Is c1 on a line that this piece travels along?
3. The piece moves on diagonals, and c1 is straight down the file.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [illegal_move] The piece cannot move from c5 to c1.

### Step 7: item  (shown without telling the learner the topic: unlabeled test)

**Task `IBds13-6`** (predict_outcome, difficulty cue 3)

White to move. Can the piece on h2 reach h7 in one move? Predict, then check.

```
  8  . . . . . . k .
  7  . . . . . . . .
  6  . . . . . . . .
  5  . . . . . . . p
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . . . . R
  1  K . . . . . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 6k1/8/8/7p/8/8/7R/K7 w - - 0 1
```

**Accepted answer:** {"outcome": "no"}

**Explanation shown:** No. The rook can go as far as h5 and take the pawn there, but it stops on h5 and cannot reach h7 behind it.

Hints (in order):
1. Find the piece on h2, then walk up the h-file square by square.
2. Is every square between h2 and h7 empty?
3. A black pawn stands on h5, in the way.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [illegal_move] The rook cannot move from h2 to h7.
- [legal_move] The rook can take the pawn on h5.

### Step 8: item  (shown without telling the learner the topic: unlabeled test)

**Task `IG-MOVE-28`** (select_squares, difficulty cue 3)

Black to move. Tap every square the piece on e5 can move to.

```
  1  . K . . . . . .
  2  . . . . . . . .
  3  k . p . . . . .
  4  . . . . . . . .
  5  . . n r . . . R
  6  . . Q . . . . .
  7  . . . p . . . .
  8  . . . . . . . .
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: 8/4p3/5Q2/R3rn2/8/5p1k/8/6K1 b - - 0 1
```

**Accepted answer:** squares a5, b5, c5, d5, e1, e2, e3, e4, e6 (from e5)

**Explanation shown:** The rook on e5 can move to 9 squares: a5, b5, c5, d5, e1, e2, e3, e4, e6. It can capture the rook on a5. It cannot land on its own pieces on e7 and f5.

Hints (in order):
1. First decide what kind of piece stands on e5. Then recall how that piece moves.
2. In each direction it keeps going until something is in the way. It cannot jump over pieces and cannot land on its own pieces.
3. An enemy piece in the way can be captured, and the rook stops on that square. Check up, down, left and right, one at a time.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_destinations] The black rook on e5 can legally move to exactly these squares.

### Step 9: item  (shown without telling the learner the topic: unlabeled test)

**Task `IG-MOVE-31`** (select_squares, difficulty cue 3)

White to move. Tap every square the piece on f6 can move to.

```
  8  . . . . . . . .
  7  . . . . . . . R
  6  p N . . . R K .
  5  . . k . . . . .
  4  . . . . . p . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  . . . . . . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 8/7R/pN3RK1/2k5/5p2/8/8/8 w - - 0 1
```

**Accepted answer:** squares c6, d6, e6, f4, f5, f7, f8 (from f6)

**Explanation shown:** The rook on f6 can move to 7 squares: c6, d6, e6, f4, f5, f7, f8. It can capture the pawn on f4. It cannot land on its own pieces on b6 and g6.

Hints (in order):
1. First decide what kind of piece stands on f6. Then recall how that piece moves.
2. In each direction it keeps going until something is in the way. It cannot jump over pieces and cannot land on its own pieces.
3. An enemy piece in the way can be captured, and the rook stops on that square. Check up, down, left and right, one at a time.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_destinations] The white rook on f6 can legally move to exactly these squares.

### Step 10: practice

A drill of 4 tasks drawn from the bank by tag ['node.FND.PIECE.ROOK', 'cue.3'] (22 tasks carry those tags). Not reproduced here; ask for a sample if you want one checked.

### Step 11: reflect

Kind: confidence

Prompt: In the silent round, which squares did you decide by looking at the whole board, and which by walking along each line? Rate how sure you were overall. (low / medium / high)

---

## Reviewer scorecard

Fill in the file `content/review/L-FND-PIECE-ROOK-2.json` (a template is below). Scale 1 to 5 for each dimension: 1 = wrong or unusable, 3 = acceptable with edits, 5 = I would put my name to it as it stands.
Revision to review: `cc418e5b`. If the lesson text changes after your review, your sign-off no longer applies and the lesson goes back to needs-human.

| Dimension | What to judge | Score |
|---|---|---|
| chess | every statement, line and explanation is correct; near-misses are really near-misses | |
| clarity | the explanation actually explains (mechanism, conditions), in plain words | |
| prerequisites | the lesson assumes only what the learner has met | |
| tasks | each task has one defensible answer and a fair explanation | |

```json
{
  "lesson": "L-FND-PIECE-ROOK-2",
  "revision": "cc418e5b",
  "reviewer": "<your name>",
  "reviewer_role": "strong-player",
  "date": "YYYY-MM-DD",
  "scores": {"chess": 0, "clarity": 0, "prerequisites": 0, "tasks": 0},
  "comments": "<what to change, by step number>",
  "verdict": "approved"
}
```

`reviewer_role` is `strong-player` or `teacher`. `verdict` is `approved` or `changes-requested`. See docs/review-slice.md.
