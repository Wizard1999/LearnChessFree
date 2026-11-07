# Review packet: L-FND-ROOKBISHOP-1

**How the rook moves**

- Skill: FND.PIECE.ROOK (D1); stage: S0; stated length: 9 minutes
- Steps: 12 (8 are tasks); revision: `c62eab9c`
- Review status now: needs-human

## What the lesson says the learner will be able to do

- Taps every square a rook can reach, including captures and blocked lines
- Predicts whether a line is blocked before moving
- Says why a rook cannot reach a square that is off its rank and file

## Sources the author names (check that they are used fairly, in our own words)

- docs/first-hours.md session 1
- docs/council-synthesis.md CD-1, CD-4
- content/skills/FND.PIECE.ROOK.json

## How to read this packet

Boards are drawn with capitals for White and lower case for Black, rank 8 at the top unless the board is shown from Black's side. Moves in a line are in standard notation. Statements marked [V] were machine-checked, [I] inference, [H] hypothesis, [S] secondary source, [R] recalled. Please judge the explanations, not only the moves: does each sentence tell the learner why?

---

### Step 1: card

The **rook** moves in straight lines: along a rank (sideways) or a file (up and down), as far as it likes. It cannot jump over pieces. To **capture**, it lands on an enemy piece and takes it off the board. It can never land on a square holding its own piece.

### Step 2: board

Caption: The rook slides until something is in the way. It can take the black pawn on d7, but not go past it.

```
  8  . . . . . . k .
  7  . . . p . . . .
  6  . . . . . . . .
  5  . . . . . . . .
  4  . P . R . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 6k1/3p4/8/8/1P1R4/8/8/6K1 w - - 0 1
```

Drawn on the board: arrows d4-d7; highlighted squares c4, d1, d2, d3, d5, d6, d7, e4, f4, g4, h4.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_destinations] (no sentence; a rules check)

### Step 3: item

**Task `IA0-10`** (select_squares, difficulty cue 1)

Tap every square the white rook can move to.

```
  8  . . . . . . k .
  7  . . . p . . . .
  6  . . . . . . . .
  5  . . . . . . . .
  4  . P . R . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 6k1/3p4/8/8/1P1R4/8/8/6K1 w - - 0 1
```

**Accepted answer:** squares c4, d1, d2, d3, d5, d6, d7, e4, f4, g4, h4 (from d4)

**Explanation shown:** The rook can reach 11 squares. It can capture the black pawn on d7, and its line ends there. It stops before its own pawn on b4.

Hints (in order):
1. A rook moves in straight lines: along its rank and along its file.
2. Go one direction at a time and stop when you meet a piece.
3. You may land on an enemy piece (that is a capture) but never on your own, and you cannot jump past anything.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_destinations] These are exactly the squares the rook on d4 can move to.

### Step 4: item

**Task `IA0-16`** (find_move, difficulty cue 1)

The rook can capture one of the black pawns on its lines. Capture one.

```
  8  . . . . . . . k
  7  . . . p . . . .
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  p N . R . . p .
  2  . . . . . . . .
  1  . . . . . . . K
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 7k/3p4/8/8/8/pN1R2p1/8/7K w - - 0 1
```

**Accepted answer(s):** Rxg3, Rxd7

**Explanation shown:** The rook can take the pawn on g3 or on d7 along open lines. It cannot take a3, because its own knight on b3 blocks the way.

Hints (in order):
1. Look at each black pawn. Is it on the rook's rank or file?
2. Is anything standing in between the rook and the pawn?
3. Check the pawn on a3: what stands on b3?

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] The rook can capture the pawn on g3.
- [legal_move] The rook can capture the pawn on d7.
- [illegal_move] The rook cannot reach a3: its own knight is in the way.

### Step 5: card

Before you move a rook, ask three questions. Is the square on its rank or its file? Is anything standing between? Whose piece, if any, is on the square? Empty or enemy: allowed, and a captured piece ends the slide. Your own piece: not allowed. These are rules of the game, not rules of thumb, so they hold in every position.

### Step 6: contrast

Title: Same rook, one change

Prompt: A black pawn appears on d6. Predict first: can the rook still reach d8? Then see what a pawn on e6 does instead.

**The working board:**

**Task `IA0-12`** (predict_outcome, difficulty cue 2)

Can the white rook go to d8 in one move? Predict, then check.

```
  8  . . . . . . k .
  7  . . . . . . . .
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . R . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 6k1/8/8/8/3R4/8/8/6K1 w - - 0 1
```

**Accepted answer:** {"outcome": "yes"}

**Explanation shown:** The squares d5, d6 and d7 are empty, so the rook slides straight to d8.

Hints (in order):
1. Look at every square between the rook and d8.
2. A rook needs a clear line to slide along.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] The rook can slide from d4 to d8: d5, d6 and d7 are empty.

**The failing board:**

**Task `IA0-13`** (predict_outcome, difficulty cue 3)

Now a black pawn stands on d6. Can the white rook go to d8 in one move? Predict, then check.

```
  8  . . . . . . k .
  7  . . . . . . . .
  6  . . . p . . . .
  5  . . . . . . . .
  4  . . . R . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 6k1/8/3p4/8/3R4/8/8/6K1 w - - 0 1
```

**Accepted answer:** {"outcome": "no"}

**Explanation shown:** The pawn on d6 is in the way. A rook cannot jump, so it can capture the pawn on d6 but cannot reach d8.

Hints (in order):
1. Look at every square between the rook and d8.
2. Can a rook jump over a piece?

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [illegal_move] The rook cannot get from d4 to d8.
- [legal_move] It can capture the pawn on d6.

**The irrelevant board:**

**Task `ISsp2-1`** (predict_outcome, difficulty cue 3)

A black pawn stands on e6. Can the white rook go to d8 in one move? Predict, then check.

```
  8  . . . . . . k .
  7  . . . . . . . .
  6  . . . . p . . .
  5  . . . . . . . .
  4  . . . R . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 6k1/8/4p3/8/3R4/8/8/6K1 w - - 0 1
```

**Accepted answer:** {"outcome": "yes"}

**Explanation shown:** The pawn on e6 is not on the d-file, so it blocks nothing. d5, d6 and d7 are empty and the rook reaches d8.

Hints (in order):
1. Which squares lie between the rook and d8?
2. Is the pawn on e6 on the rook's file?

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] The rook slides from d4 to d8: d5, d6 and d7 are empty.

### Step 7: item  (shown without telling the learner the topic: unlabeled test)

**Task `ISsp2-3`** (predict_outcome, difficulty cue 2)

The white rook is on a4 and a black pawn stands on e4. Can the rook go to e4 in one move? Predict, then check.

```
  8  . . . . . . k .
  7  . . . . . . . .
  6  . . . . . . . .
  5  . . . . . . . .
  4  R . . . p . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 6k1/8/8/8/R3p3/8/8/6K1 w - - 0 1
```

**Accepted answer:** {"outcome": "yes"}

**Explanation shown:** b4, c4 and d4 are empty and the pawn on e4 is an enemy piece, so the rook takes it and stops there.

Hints (in order):
1. Count the squares between a4 and e4.
2. An enemy piece at the end of the line can be taken.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] The rook can capture the pawn on e4: b4, c4 and d4 are empty.

### Step 8: item

**Task `ISsp2-4`** (predict_outcome, difficulty cue 3)

The white rook is on a4 and a black pawn stands on e4. Can the rook go to h4 in one move? Predict, then check.

```
  8  . . . . . . k .
  7  . . . . . . . .
  6  . . . . . . . .
  5  . . . . . . . .
  4  R . . . p . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 6k1/8/8/8/R3p3/8/8/6K1 w - - 0 1
```

**Accepted answer:** {"outcome": "no"}

**Explanation shown:** The pawn on e4 stops the rook. It can take the pawn but cannot pass it, so f4, g4 and h4 are out of reach in one move.

Hints (in order):
1. Is anything on the rank between a4 and h4?
2. What happens to squares behind a piece the rook captures?

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [illegal_move] The rook cannot get from a4 to h4: the pawn on e4 is in the way.
- [legal_move] It can capture the pawn on e4.

### Step 9: item  (shown without telling the learner the topic: unlabeled test)

**Task `ISsp2-2`** (predict_outcome, difficulty cue 3)

A white pawn stands on d6. Can the white rook go to d6 in one move? Predict, then check.

```
  8  . . . . . . k .
  7  . . . . . . . .
  6  . . . P . . . .
  5  . . . . . . . .
  4  . . . R . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 6k1/8/3P4/8/3R4/8/8/6K1 w - - 0 1
```

**Accepted answer:** {"outcome": "no"}

**Explanation shown:** A piece can never land on a square held by its own piece. The rook can slide as far as d5 and stops there.

Hints (in order):
1. Whose piece stands on d6?
2. Can a piece land on a square holding its own piece?

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [illegal_move] The rook cannot land on d6: its own pawn stands there.
- [legal_move] The rook can still reach d5.

### Step 10: item  (shown without telling the learner the topic: unlabeled test)

**Task `ISsp2-5`** (predict_outcome, difficulty cue 3)

Can the white rook go to f6 in one move? Predict, then check.

```
  8  . . . . . . k .
  7  p . . . . . . .
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . R . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 6k1/p7/8/8/3R4/8/8/6K1 w - - 0 1
```

**Accepted answer:** {"outcome": "no"}

**Explanation shown:** f6 is not on the d-file or on the fourth rank. A rook never moves diagonally, so it would need two moves.

Hints (in order):
1. Is f6 on the rank or the file of d4?
2. A rook moves only straight.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [illegal_move] The rook cannot get from d4 to f6: f6 is on neither its rank nor its file.

### Step 11: practice

A drill of 5 tasks drawn from the bank by tag ['node.FND.PIECE.ROOK', 'kind.generated'] (36 tasks carry those tags). Not reproduced here; ask for a sample if you want one checked.

### Step 12: reflect

Kind: confidence

Prompt: In the silent round, name one answer that was a guess. Which line did you not trace to its end: a rank, a file or a diagonal? Rate how sure you were overall. (low / medium / high)

---

## Reviewer scorecard

Fill in the file `content/review/L-FND-ROOKBISHOP-1.json` (a template is below). Scale 1 to 5 for each dimension: 1 = wrong or unusable, 3 = acceptable with edits, 5 = I would put my name to it as it stands.
Revision to review: `c62eab9c`. If the lesson text changes after your review, your sign-off no longer applies and the lesson goes back to needs-human.

| Dimension | What to judge | Score |
|---|---|---|
| chess | every statement, line and explanation is correct; near-misses are really near-misses | |
| clarity | the explanation actually explains (mechanism, conditions), in plain words | |
| prerequisites | the lesson assumes only what the learner has met | |
| tasks | each task has one defensible answer and a fair explanation | |

```json
{
  "lesson": "L-FND-ROOKBISHOP-1",
  "revision": "c62eab9c",
  "reviewer": "<your name>",
  "reviewer_role": "strong-player",
  "date": "YYYY-MM-DD",
  "scores": {"chess": 0, "clarity": 0, "prerequisites": 0, "tasks": 0},
  "comments": "<what to change, by step number>",
  "verdict": "approved"
}
```

`reviewer_role` is `strong-player` or `teacher`. `verdict` is `approved` or `changes-requested`. See docs/review-slice.md.
