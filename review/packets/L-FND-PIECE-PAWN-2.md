# Review packet: L-FND-PIECE-PAWN-2

**The pawn in a busy position**

- Skill: FND.PIECE.PAWN (D2); stage: S2; stated length: 12 minutes
- Steps: 10 (6 are tasks); revision: `cbc26d6a`
- Review status now: needs-human

## What the lesson says the learner will be able to do

- Names the piece on a given square, and which way it moves, before using its rule
- Taps every square a pawn can move to, including a pawn on its starting rank
- Says that a pawn with a piece directly in front of it cannot move forward but may still capture diagonally
- Says that an attacked square is still a legal destination for a pawn

## Sources the author names (check that they are used fairly, in our own words)

- content/skills/FND.PIECE.PAWN.json (D2 outcome)
- content/lessons/L-FND-PAWN-1.json
- content/items/lesson-ds12.json
- rules of chess (python-chess legal move generation, via tools/validate.py)

## How to read this packet

Boards are drawn with capitals for White and lower case for Black, rank 8 at the top unless the board is shown from Black's side. Moves in a line are in standard notation. Statements marked [V] were machine-checked, [I] inference, [H] hypothesis, [S] secondary source, [R] recalled. Please judge the explanations, not only the moves: does each sentence tell the learner why?

---

### Step 1: card

In **The pawn: moves and captures are different** you were told "pawn". Now nobody says it. Name the piece first and check its colour: white pawns move up the board, black pawns down. Then ask two separate questions. Forward: is the square empty? Diagonal: does an enemy piece stand there? On the starting rank, check the second square too.

### Step 2: board

Caption: The piece on e2 is a pawn on its starting rank. Forward squares e3 and e4 are empty, and the bishop on d3 can be taken.

```
  8  . . . . k . . .
  7  . . . . . . . .
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . n . .
  3  . . . b . . . .
  2  . . . . P . . .
  1  . . . . K . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 4k3/8/8/8/5n2/3b4/4P3/4K3 w - - 0 1
```

The line, with the sentence the learner sees at each move:
1. **1. e4**: The pawn advances two squares: both e3 and e4 were empty.
2. **1... Kd7**: Black moves the king.

```
  8  . . . . . . . .
  7  . . . k . . . .
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . P n . .
  3  . . . b . . . .
  2  . . . . . . . .
  1  . . . . K . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 8/3k4/8/8/4Pn2/3b4/8/4K3 w - - 1 2
```

Drawn on the board: arrows e2-e3, e2-e4, e2-d3; highlighted squares d3, e3, e4.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_destinations] (no sentence; a rules check)

### Step 3: item

**Task `IG-MOVE-211`** (select_squares, difficulty cue 3)

White to move. Tap every square the piece on h3 can move to.

```
  8  . . . . . . . .
  7  . . . . . . . .
  6  . . . . . . . .
  5  . . . . k . . .
  4  K . . . . . p P
  3  . . . . . . . P
  2  . . . . . . . .
  1  . . . . . . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 8/8/8/4k3/K5pP/7P/8/8 w - - 0 1
```

**Accepted answer:** squares g4 (from h3)

**Explanation shown:** The pawn on h3 can move to 1 square: g4. It can capture the pawn on g4.

Hints (in order):
1. First decide what kind of piece stands on h3. Then recall how that piece moves.
2. Straight ahead only onto an empty square (two squares from its starting rank if both are empty). A diagonal step is allowed only to capture an enemy piece.
3. Check the square in front first, then the two diagonal squares, then whether a two-square step is possible.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_destinations] The white pawn on h3 can legally move to exactly these squares.

### Step 4: card

Forward moves need empty squares; a piece directly ahead blocks the pawn and cannot be taken. Diagonal moves are only captures, onto an enemy piece. The two-square step needs both squares empty and the pawn on its starting rank. A pawn may move to a square an enemy piece attacks. *Rule of thumb:* answer the forward question and the diagonal question separately.

### Step 5: contrast

Title: Blocked, free, distant

Prompt: Predict first. In the first position the pawn is on its starting rank. In the second, a black piece stands directly in front of it. In the third, a black rook has been added on g4. Does the pawn lose a square?

**The working board:**

**Task `IBds12-11`** (select_squares, difficulty cue 2)

White to move. Tap every square the piece on e2 can move to.

```
  8  . . . . k . . .
  7  . . . . . . . .
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . b . . . .
  2  . . . . P . . .
  1  . . . . K . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 4k3/8/8/8/8/3b4/4P3/4K3 w - - 0 1
```

**Accepted answer:** squares d3, e3, e4 (from e2)

**Explanation shown:** The piece on e2 is a pawn still on its starting rank. It can go forward to e3 or e4, because both are empty. It can capture the bishop on d3. There is nothing to capture on f3.

Hints (in order):
1. First find out which piece stands on e2 and which way it moves.
2. Forward squares must be empty. Diagonal squares need an enemy piece.
3. The pawn has not moved yet, so it has a longer first step.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_destinations] The white piece on e2 can legally move to exactly these squares.
- [legal_move] From its starting rank the pawn may advance two squares.
- [illegal_move] A pawn cannot move diagonally onto an empty square.

**The failing board:**

**Task `IBds12-12`** (select_squares, difficulty cue 2)

White to move. Tap every square the piece on e2 can move to.

```
  8  . . . . k . . .
  7  . . . . . . . .
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . b n . . .
  2  . . . . P . . .
  1  . . . . K . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 4k3/8/8/8/8/3bn3/4P3/4K3 w - - 0 1
```

**Accepted answer:** squares d3 (from e2)

**Explanation shown:** A black knight on e3 now stands directly in front of the pawn. It blocks the step to e3 and the double step to e4, and the pawn cannot take it. The only move is the capture on d3.

Hints (in order):
1. Only one black piece has been added.
2. Is the square straight ahead of the pawn empty now?
3. A pawn cannot capture straight ahead, and a piece in front blocks both forward steps. Only the diagonal capture is left.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_destinations] The white piece on e2 can legally move to exactly these squares.
- [illegal_move] A pawn cannot move onto an occupied square.
- [illegal_move] The pawn cannot jump over the knight on e3.

**The irrelevant board:**

**Task `IBds12-13`** (select_squares, difficulty cue 2)

White to move. Tap every square the piece on e2 can move to.

```
  8  . . . . k . . .
  7  . . . . . . . .
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . r .
  3  . . . b . . . .
  2  . . . . P . . .
  1  . . . . K . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 4k3/8/8/8/6r1/3b4/4P3/4K3 w - - 0 1
```

**Accepted answer:** squares d3, e3, e4 (from e2)

**Explanation shown:** The rook on g4 attacks e4, but an attacked square is still a legal destination for a pawn. The pawn keeps its 3 moves: d3, e3 and e4.

Hints (in order):
1. Only a black rook has been added, on g4. Which square of the pawn's does it attack?
2. A pawn may move to a square an enemy piece attacks.
3. Only empty squares ahead and enemy pieces on the diagonals matter.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_destinations] The white piece on e2 can legally move to exactly these squares.
- [legal_move] The pawn may still advance to e4.

### Step 6: item  (shown without telling the learner the topic: unlabeled test)

**Task `IG-MOVE-208`** (select_squares, difficulty cue 3)

Black to move. Tap every square the piece on c7 can move to.

```
  1  . . . . . K . .
  2  . . . . . . . .
  3  k . . . . . . .
  4  . . . . . . . .
  5  . . . . . . . .
  6  . . . . R . r .
  7  . . . . . p Q .
  8  . . . q . . . .
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: 4q3/1Qp5/1r1R4/8/8/7k/8/2K5 b - - 0 1
```

**Accepted answer:** squares c5, c6, d6 (from c7)

**Explanation shown:** The pawn on c7 can move to 3 squares: c5, c6, d6. It can capture the rook on d6.

Hints (in order):
1. First decide what kind of piece stands on c7. Then recall how that piece moves.
2. Straight ahead only onto an empty square (two squares from its starting rank if both are empty). A diagonal step is allowed only to capture an enemy piece.
3. Check the square in front first, then the two diagonal squares, then whether a two-square step is possible.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_destinations] The black pawn on c7 can legally move to exactly these squares.

### Step 7: item  (shown without telling the learner the topic: unlabeled test)

**Task `IG-MOVE-214`** (select_squares, difficulty cue 3)

Black to move. Tap every square the piece on d4 can move to.

```
  1  . . . . . . . .
  2  . . k . . K . .
  3  . . . P . N . .
  4  q . . . p . . .
  5  . . . . . . . .
  6  . . . . . . . .
  7  . . . . . . . .
  8  . . . B . . . .
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: 4B3/8/8/8/3p3q/2N1P3/2K2k2/8 b - - 0 1
```

**Accepted answer:** squares c3, d3, e3 (from d4)

**Explanation shown:** The pawn on d4 can move to 3 squares: c3, d3, e3. It can capture the knight on c3 and the pawn on e3.

Hints (in order):
1. First decide what kind of piece stands on d4. Then recall how that piece moves.
2. Straight ahead only onto an empty square (two squares from its starting rank if both are empty). A diagonal step is allowed only to capture an enemy piece.
3. Check the square in front first, then the two diagonal squares, then whether a two-square step is possible.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_destinations] The black pawn on d4 can legally move to exactly these squares.

### Step 8: item  (shown without telling the learner the topic: unlabeled test)

**Task `IBds12-20`** (predict_outcome, difficulty cue 3)

Can the white pawn on d4 take the rook on e5? Predict, then check.

```
  8  . . . . k . . .
  7  . . . . . . . .
  6  . . . . . . . .
  5  . . . . r . . .
  4  . . . P . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  . . . . . K . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 4k3/8/8/4r3/3P4/8/8/5K2 w - - 0 1
```

**Accepted answer:** {"outcome": "yes"}

**Explanation shown:** The rook stands one square diagonally forward from the pawn, so the pawn can take it.

Hints (in order):
1. Which way does a pawn capture?
2. Where is the rook compared with the pawn: straight ahead or diagonal?
3. A pawn captures only one square diagonally forward.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] The pawn can take the rook one square diagonally forward on e5.

### Step 9: practice

A drill of 6 tasks drawn from the bank by tag ['node.FND.PIECE.PAWN', 'cue.3'] (32 tasks carry those tags). Not reproduced here; ask for a sample if you want one checked.

### Step 10: reflect

Kind: expect

Prompt: With a black pawn in the silent items, did you remember which way it moves before you looked for squares? What did you check first, forward or diagonal?

---

## Reviewer scorecard

Fill in the file `content/review/L-FND-PIECE-PAWN-2.json` (a template is below). Scale 1 to 5 for each dimension: 1 = wrong or unusable, 3 = acceptable with edits, 5 = I would put my name to it as it stands.
Revision to review: `cbc26d6a`. If the lesson text changes after your review, your sign-off no longer applies and the lesson goes back to needs-human.

| Dimension | What to judge | Score |
|---|---|---|
| chess | every statement, line and explanation is correct; near-misses are really near-misses | |
| clarity | the explanation actually explains (mechanism, conditions), in plain words | |
| prerequisites | the lesson assumes only what the learner has met | |
| tasks | each task has one defensible answer and a fair explanation | |

```json
{
  "lesson": "L-FND-PIECE-PAWN-2",
  "revision": "cbc26d6a",
  "reviewer": "<your name>",
  "reviewer_role": "strong-player",
  "date": "YYYY-MM-DD",
  "scores": {"chess": 0, "clarity": 0, "prerequisites": 0, "tasks": 0},
  "comments": "<what to change, by step number>",
  "verdict": "approved"
}
```

`reviewer_role` is `strong-player` or `teacher`. `verdict` is `approved` or `changes-requested`. See docs/review-slice.md.
