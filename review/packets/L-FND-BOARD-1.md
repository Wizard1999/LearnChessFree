# Review packet: L-FND-BOARD-1

**The board and its square names**

- Skill: FND.BOARD (D1); stage: S0; stated length: 7 minutes
- Steps: 13 (9 are tasks); revision: `98080222`
- Review status now: needs-human

## What the lesson says the learner will be able to do

- Names any square from its file and rank
- Finds a named square on the board, from White's side or Black's
- Reads a simple written move such as Nf3 or Bc4 and plays it

## Sources the author names (check that they are used fairly, in our own words)

- docs/first-hours.md session 1
- docs/council-synthesis.md CD-1
- sources/sheets/capablanca_chess-fundamentals.md (explanation economy only)

## How to read this packet

Boards are drawn with capitals for White and lower case for Black, rank 8 at the top unless the board is shown from Black's side. Moves in a line are in standard notation. Statements marked [V] were machine-checked, [I] inference, [H] hypothesis, [S] secondary source, [R] recalled. Please judge the explanations, not only the moves: does each sentence tell the learner why?

---

### Step 1: card

A chessboard has 64 squares. The columns are called **files** and are named with the letters **a** to **h**, left to right as White sees the board. The rows are called **ranks** and are numbered **1** to **8**, starting at White's side. Every square has a name: its file letter, then its rank number. The white king starts on **e1**.

### Step 2: board

Caption: Watch the white pawn travel from e2 to e4. Every square keeps its name.

```
  8  r n b q k b n r
  7  p p p p p p p p
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  P P P P P P P P
  1  R N B Q K B N R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
```

The line, with the sentence the learner sees at each move:
1. **1. e4**: The pawn on e2 moves to e4.
2. **1... e5**: Black's pawn on e7 moves to e5.

```
  8  r n b q k b n r
  7  p p p p . p p p
  6  . . . . . . . .
  5  . . . . p . . .
  4  . . . . P . . .
  3  . . . . . . . .
  2  P P P P . P P P
  1  R N B Q K B N R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2
```

Drawn on the board: arrows e2-e4; highlighted squares e2, e4.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] (no sentence; a rules check)

### Step 3: item

**Task `IA0-1`** (classify_position, difficulty cue 1)

Look at the white rook. What is the name of the square it stands on?

```
  8  . . . . k . . .
  7  . . . . . . . .
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  . . . . K . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 4k3/8/8/8/8/8/8/4K2R w - - 0 1
```

**Accepted answer:** {"class": "h1"}

**Explanation shown:** The rook is in the corner on the far right of White's side: file h, rank 1, so the square is h1.

Hints (in order):
1. Files are the letters, a to h from left to right as White sees the board. Which file is the rook on?
2. Ranks are the numbers, 1 at White's side. Which rank is the rook on?
3. The rook is on the last file and the first rank: letter first, then number.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_destinations] A white rook stands on h1 and can move to exactly these squares.

### Step 4: item

**Task `IG-BOARD-1`** (find_move, difficulty cue 1)

White to move. Play a6 to b5: move the piece on a6 to b5.

```
  8  . b N k r . . .
  7  . R . . q . . .
  6  B . . . Q . . .
  5  P . . p . . . .
  4  . . . . p . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  . . . . . K . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 1bNkr3/1R2q3/B3Q3/P2p4/4p3/8/8/5K2 w - - 0 1
```

**Accepted answer(s):** Bb5

**Explanation shown:** The piece on a6 can legally move to b5: a6 is file a, rank 6; b5 is file b, rank 5.

Hints (in order):
1. Find the first square by its file letter (a-h) and its rank number (1-8). Remember the board may be turned.
2. Files are the columns, ranks are the rows. Count columns for the letter and rows for the number from the side where that colour starts.
3. Check that you picked the piece on the first square and the empty square (or enemy piece) on the second.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] a6 to b5 is a legal move.

### Step 5: card

To write a move down, use the piece's letter and the square it goes to: **K** king, **Q** queen, **R** rook, **B** bishop, **N** knight. Pawns have no letter, so a pawn move is just the square: **e4**. A capture adds an **x**: **Nxe5** means the knight captures on e5.

### Step 6: item

**Task `IG-BOARD-2`** (find_move, difficulty cue 1)

White to move. Play h6 to g5: move the piece on h6 to g5.

```
  8  . . . r k N b .
  7  . . . q . . R .
  6  . . . Q . . . B
  5  . . . . p . . P
  4  . . . p . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  . . K . . . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 3rkNb1/3q2R1/3Q3B/4p2P/3p4/8/8/2K5 w - - 0 1
```

**Accepted answer(s):** Bg5

**Explanation shown:** The piece on h6 can legally move to g5: h6 is file h, rank 6; g5 is file g, rank 5.

Hints (in order):
1. Find the first square by its file letter (a-h) and its rank number (1-8). Remember the board may be turned.
2. Files are the columns, ranks are the rows. Count columns for the letter and rows for the number from the side where that colour starts.
3. Check that you picked the piece on the first square and the empty square (or enemy piece) on the second.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] h6 to g5 is a legal move.

### Step 7: item

**Task `IG-BOARD-3`** (find_move, difficulty cue 1)

Black to move. Play a3 to b4: move the piece on a3 to b4.

```
  1  . . . R K n B .
  2  . . . Q . . r .
  3  . . . q . . . b
  4  . . . . P . . p
  5  . . . P . . . .
  6  . . . . . . . .
  7  . . . . . . . .
  8  . . k . . . . .
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: 5k2/8/8/4P3/p2P4/b3q3/1r2Q3/1BnKR3 b - - 0 1
```

**Accepted answer(s):** Bb4

**Explanation shown:** The piece on a3 can legally move to b4: a3 is file a, rank 3; b4 is file b, rank 4.

Hints (in order):
1. Find the first square by its file letter (a-h) and its rank number (1-8). Remember the board may be turned.
2. Files are the columns, ranks are the rows. Count columns for the letter and rows for the number from the side where that colour starts.
3. Check that you picked the piece on the first square and the empty square (or enemy piece) on the second.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] a3 to b4 is a legal move.

### Step 8: contrast

Title: Same board, other side

Prompt: Predict first: we turn the board around so you see it from Black's side. Does the name of the rook's square change?

**The working board:**

**Task `IA0-5`** (classify_position, difficulty cue 1)

What is the name of the square the white rook stands on?

```
  8  . . . . k . . .
  7  . . . . . . . .
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  R . . . K . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 4k3/8/8/8/8/8/8/R3K3 w - - 0 1
```

**Accepted answer:** {"class": "a1"}

**Explanation shown:** The rook is on file a and rank 1, so the square is a1.

Hints (in order):
1. The file is a letter. The rank is a number.
2. This board is shown from White's side, with rank 1 at the bottom.
3. The rook is on the left-hand corner at White's side.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_destinations] A white rook stands on a1 and can move to exactly these squares.

**The failing board:**

**Task `IA0-6`** (classify_position, difficulty cue 3)

The same position, but the board is turned around so you see it from Black's side. What is the name of the square the white rook stands on?

```
  1  . . . K . . . R
  2  . . . . . . . .
  3  . . . . . . . .
  4  . . . . . . . .
  5  . . . . . . . .
  6  . . . . . . . .
  7  . . . . . . . .
  8  . . . k . . . .
     h g f e d c b a

White to move. Capitals = White, lower case = Black.
FEN: 4k3/8/8/8/8/8/8/R3K3 w - - 0 1
```

**Accepted answer:** {"class": "a1"}

**Explanation shown:** Turning the board around changes how it looks, not the names. The rook has not moved, so it is still on a1, which now appears in the top-right corner.

Hints (in order):
1. Do not go by where the rook looks like it is. Square names belong to the board.
2. The rook has not moved. Only your view of the board changed.
3. Ranks still count from White's side, so the rook is on rank 1 whichever way you look.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_destinations] The same white rook still stands on a1.

### Step 9: item

**Task `IG-BOARD-16`** (find_move, difficulty cue 3)

Black to move. Move your king to b1.

```
  1  . . . . . . . .
  2  . . . . . k . .
  3  K . . p b . . .
  4  . . R p . . . .
  5  . . . Q . . . .
  6  . . . . . r P .
  7  . . . . . B . .
  8  . . . . . . . .
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: 8/2B5/1Pr5/4Q3/4pR2/3bp2K/2k5/8 b - - 0 1
```

**Accepted answer(s):** Kb1

**Explanation shown:** The king on c2 can move to b1: file b, rank 1.

Hints (in order):
1. Say the target square to yourself: letter for the column, number for the row.
2. Look along the file and the rank of that square for a piece of the right kind that can get there.
3. Check the piece can really reach the square: nothing in the way, and the move follows the piece's own rule.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] c2b1 is a legal move.

### Step 10: item

**Task `IG-BOARD-17`** (find_move, difficulty cue 3)

Black to move. Move your king to g1.

```
  1  . . . . . . . .
  2  . . k . . . . .
  3  . . . b p . . K
  4  . . . . p R . .
  5  . . . . Q . . .
  6  . P r . . . . .
  7  . . B . . . . .
  8  . . . . . . . .
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: 8/5B2/5rP1/3Q4/2Rp4/K2pb3/5k2/8 b - - 0 1
```

**Accepted answer(s):** Kg1

**Explanation shown:** The king on f2 can move to g1: file g, rank 1.

Hints (in order):
1. Say the target square to yourself: letter for the column, number for the row.
2. Look along the file and the rank of that square for a piece of the right kind that can get there.
3. Check the piece can really reach the square: nothing in the way, and the move follows the piece's own rule.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] f2g1 is a legal move.

### Step 11: item

**Task `IA0-9`** (classify_position, difficulty cue 3)

What is the name of the square the white knight stands on?

```
  8  . . . . k . . .
  7  . . . . . . . .
  6  . . N . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  K . . . . . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 4k3/8/2N5/8/8/8/8/K7 w - - 0 1
```

**Accepted answer:** {"class": "c6"}

**Explanation shown:** The knight is on the third file (c) and the sixth rank, so it stands on c6.

Hints (in order):
1. Find the file first: count the columns from the left, a-b-c.
2. Then count the rows up from White's side.
3. Third file, sixth rank.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_destinations] A white knight stands on c6 and can move to exactly these squares.

### Step 12: practice

A drill of 8 tasks drawn from the bank by tag ['node.FND.BOARD', 'kind.generated'] (36 tasks carry those tags). Not reproduced here; ask for a sample if you want one checked.

### Step 13: reflect

Kind: confidence

Prompt: Pick the one square you named slowest in this lesson. Did you count along the file or the rank to reach it? Rate how sure you are of naming any square without counting. (low / medium / high)

---

## Reviewer scorecard

Fill in the file `content/review/L-FND-BOARD-1.json` (a template is below). Scale 1 to 5 for each dimension: 1 = wrong or unusable, 3 = acceptable with edits, 5 = I would put my name to it as it stands.
Revision to review: `98080222`. If the lesson text changes after your review, your sign-off no longer applies and the lesson goes back to needs-human.

| Dimension | What to judge | Score |
|---|---|---|
| chess | every statement, line and explanation is correct; near-misses are really near-misses | |
| clarity | the explanation actually explains (mechanism, conditions), in plain words | |
| prerequisites | the lesson assumes only what the learner has met | |
| tasks | each task has one defensible answer and a fair explanation | |

```json
{
  "lesson": "L-FND-BOARD-1",
  "revision": "98080222",
  "reviewer": "<your name>",
  "reviewer_role": "strong-player",
  "date": "YYYY-MM-DD",
  "scores": {"chess": 0, "clarity": 0, "prerequisites": 0, "tasks": 0},
  "comments": "<what to change, by step number>",
  "verdict": "approved"
}
```

`reviewer_role` is `strong-player` or `teacher`. `verdict` is `approved` or `changes-requested`. See docs/review-slice.md.
