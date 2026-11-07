# Review packet: L-FND-PROMOTE-1

**Promotion: a pawn on the last rank**

- Skill: FND.PROMOTE (D1); stage: S1; stated length: 9 minutes
- Steps: 15 (10 are tasks); revision: `754d8171`
- Review status now: needs-human

## What the lesson says the learner will be able to do

- Promotes a pawn to a queen when told, for both colours
- Promotes by capturing when the square ahead is blocked
- Says when a pawn cannot promote on this move
- Notices that a queen is not always the best choice (preview only)

## Sources the author names (check that they are used fairly, in our own words)

- docs/first-hours.md session 3
- docs/council-synthesis.md CD-1, CD-4
- content/skills/FND.PROMOTE.json (conditions, contrasts)
- items IG-PROMO-1, IG-PROMO-3, IA0-88, IG-PROMO-23 and ISsp1-1..4 (content/items/lesson-split-sp1.json; promotion legality and the mating promotion verified by rules and engine claims)
- split from the former combined lesson 'Promotion: a pawn on the last rank' (D24, one building block per lesson)
- IG-PROMO-7 (capture promotion when the square ahead is blocked)

## How to read this packet

Boards are drawn with capitals for White and lower case for Black, rank 8 at the top unless the board is shown from Black's side. Moves in a line are in standard notation. Statements marked [V] were machine-checked, [I] inference, [H] hypothesis, [S] secondary source, [R] recalled. Please judge the explanations, not only the moves: does each sentence tell the learner why?

---

### Step 1: card

A pawn that reaches the last rank is **promoted** as part of the same move: you choose a queen, rook, bishop or knight of your own colour, never a king or a pawn. You may have several queens. The pieces you already have do not limit the choice.

### Step 2: board

Caption: The pawn steps to g8 and becomes a queen.

```
  8  k . . . . . . .
  7  . . . . . . P .
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  . . . . K . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: k7/6P1/8/8/8/8/8/4K3 w - - 0 1
```

The line, with the sentence the learner sees at each move:
1. **1. g8=Q+**: The pawn reaches the last rank and becomes a queen.

```
  8  k . . . . . Q .
  7  . . . . . . . .
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  . . . . K . . .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: k5Q1/8/8/8/8/8/8/4K3 b - - 0 1
```

Drawn on the board: arrows g7-g8; highlighted squares g8.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] (no sentence; a rules check)

### Step 3: item

**Task `IG-PROMO-1`** (find_move, difficulty cue 1)

White to move. Push the pawn to the last rank and promote it to a queen.

```
  8  . . . . . . . .
  7  . . . P . . . .
  6  . . . . k . . .
  5  . . . . . . r .
  4  . . . . . . . .
  3  K . . . . . . .
  2  . . . . . . . .
  1  . . . . . . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 8/3P4/4k3/6r1/8/K7/8/8 w - - 0 1
```

**Accepted answer(s):** d8=Q

**Explanation shown:** The pawn moves to d8 and becomes a queen, the strongest piece.

Hints (in order):
1. A pawn that reaches the far rank must change into another piece.
2. It may become a queen, rook, bishop or knight. It moves straight ahead onto an empty square.
3. Move the pawn one square forward to the last rank, then choose the piece.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] Promoting to a queen is legal.

### Step 4: item

**Task `IG-PROMO-3`** (find_move, difficulty cue 1)

Black to move. Push the pawn to the last rank and promote it to a queen.

```
  1  . . . . . . . .
  2  . . . . p . . .
  3  . . . K . . . .
  4  . R . . . . . .
  5  . . . . . . . .
  6  . . . . . . . k
  7  . . . . . . . .
  8  . . . . . . . .
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: 8/8/k7/8/6R1/4K3/3p4/8 b - - 0 1
```

**Accepted answer(s):** d1=Q

**Explanation shown:** The pawn moves to d1 and becomes a queen, the strongest piece.

Hints (in order):
1. A pawn that reaches the far rank must change into another piece.
2. It may become a queen, rook, bishop or knight. It moves straight ahead onto an empty square.
3. Move the pawn one square forward to the last rank, then choose the piece.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] Promoting to a queen is legal.

### Step 5: card

A pawn promotes by moving straight ahead onto an empty last-rank square, or by capturing an enemy piece one step diagonally ahead. If a piece blocks the square ahead, look at both diagonals. A pawn cannot capture its own piece, and it must be on the seventh rank (the second, for Black) to promote on this move.

### Step 6: item

**Task `IA0-88`** (find_move, difficulty cue 2)

White wants to promote the pawn on e7. Find the best way to do it.

```
  8  . . . r . . k .
  7  . . . . P . . .
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 3r2k1/4P3/8/8/8/8/8/6K1 w - - 0 1
```

**Accepted answer(s):** exd8=Q+

Feedback shown for wrong moves:
- e8=Q+: The black rook on d8 captures the new queen.

**Explanation shown:** The rook on d8 covers e8, so a queen made there would be captured. Capturing the rook on d8 promotes and wins a rook at the same time.

Hints (in order):
1. A pawn can promote straight ahead or by capturing diagonally. Which promotion squares are there?
2. Check each promotion square: does an enemy piece attack it?
3. The rook on d8 attacks e8 but can be captured.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] Capturing on d8 and promoting to a queen is the engine's best move.
- [move_loses] Promoting on e8 loses the new queen.
- [attackers] The black rook attacks e8.

### Step 7: item

**Task `IG-PROMO-7`** (find_move, difficulty cue 1)

White to move. The pawn is blocked straight ahead. Capture a piece and promote to a queen.

```
  8  . . n r . . . .
  7  . . . P . . . .
  6  . . . . . . . .
  5  . . . . . . . .
  4  n . . . . . . .
  3  K . . N k . . .
  2  . . . . . . . .
  1  . . . . . . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 2nr4/3P4/8/8/n7/K2Nk3/8/8 w - - 0 1
```

**Accepted answer(s):** dxc8=Q

**Explanation shown:** The pawn cannot push forward because a piece blocks it, but it can capture diagonally onto the last rank, and then it promotes. The capture is legal; the straight push is not.

Hints (in order):
1. A pawn cannot move forward onto an occupied square. But it can capture diagonally.
2. A capture on the last rank also promotes the pawn.
3. Look at the two squares diagonally ahead of the pawn: is an enemy piece standing on one?

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] d7c8q is legal.
- [illegal_move] The pawn cannot move straight ahead: the square is occupied.

### Step 8: contrast

Title: Same pawn, one change

Prompt: The pawn stands on d7. Predict first: can it promote on this move?

**The working board:**

**Task `ISsp1-1`** (predict_outcome, difficulty cue 3)

White to move. Can the pawn on d7 promote on this move, by moving ahead or by capturing? Predict, then check.

```
  8  . . . . . . . k
  7  . . . P . . . .
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  K . . . . . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 7k/3P4/8/8/8/8/8/K7 w - - 0 1
```

**Accepted answer:** {"outcome": "yes"}

**Explanation shown:** Yes. The pawn stands one step from the last rank and d8 is empty.

Hints (in order):
1. Find the pawn and its last rank. Is it one step from that rank?
2. A pawn moves straight ahead only onto an empty square, and captures one square diagonally forward only onto an enemy piece.
3. Check the square straight ahead and then each of the two diagonal squares in front of the pawn.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] The pawn can legally move from d7 to d8 and promote.

**The failing board:**

**Task `ISsp1-2`** (predict_outcome, difficulty cue 3)

White to move. Can the pawn on d7 promote on this move, by moving ahead or by capturing? Predict, then check.

```
  8  . . . n . . . k
  7  . . . P . . . .
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  K . . . . . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 3n3k/3P4/8/8/8/8/8/K7 w - - 0 1
```

**Accepted answer:** {"outcome": "no"}

**Explanation shown:** No. The knight on d8 blocks the square ahead, and the diagonal squares c8 and e8 are empty, so there is nothing to capture.

Hints (in order):
1. Find the pawn and its last rank. Is it one step from that rank?
2. A pawn moves straight ahead only onto an empty square, and captures one square diagonally forward only onto an enemy piece.
3. Check the square straight ahead and then each of the two diagonal squares in front of the pawn.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [illegal_move] The pawn cannot advance to d8.
- [illegal_move] The pawn has nothing to capture on c8.
- [illegal_move] The pawn has nothing to capture on e8.

**The irrelevant board:**

**Task `ISsp1-3`** (predict_outcome, difficulty cue 3)

White to move. Can the pawn on d7 promote on this move, by moving ahead or by capturing? Predict, then check.

```
  8  . . . . . . . k
  7  . . . P . . . .
  6  . . . . . . . .
  5  n . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  K . . . . . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 7k/3P4/8/n7/8/8/8/K7 w - - 0 1
```

**Accepted answer:** {"outcome": "yes"}

**Explanation shown:** Yes. The black knight on a5 is far from the pawn and from the squares it needs. Only the squares ahead and diagonally ahead matter.

Hints (in order):
1. Find the pawn and its last rank. Is it one step from that rank?
2. A pawn moves straight ahead only onto an empty square, and captures one square diagonally forward only onto an enemy piece.
3. Check the square straight ahead and then each of the two diagonal squares in front of the pawn.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] The pawn can legally move from d7 to d8 and promote.

### Step 9: card

The queen is usually the best choice, as a rule of thumb. Before you promote, check two things: whether the new piece lands on a square the enemy attacks, and whether a queen would leave the enemy king with no legal move and no check, which is stalemate. In rare positions another piece is better, and you will practise that later. The next item is a preview.

### Step 10: item

**Task `IG-PROMO-23`** (find_move, difficulty cue 3)

White to move. Promote the pawn so that it gives checkmate. Which piece should it become?

```
  8  r b . . . . . .
  7  k p P P . . . .
  6  b . . . . . . .
  5  . . . . . . . .
  4  . K . . . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  . . . . . R . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: rb6/kpPP4/b7/8/1K6/8/8/5R2 w - - 0 1
```

**Accepted answer(s):** c8=N#

**Explanation shown:** Promoting to a knight gives check from a square the king cannot escape or capture on. A queen would not give check from that square, so the strongest piece is not the right choice here.

Hints (in order):
1. The pawn may become a queen, a rook, a bishop or a knight. Think about which piece gives check here.
2. Check the king's escape squares. Which piece attacks the king without giving it a way out?
3. A queen is the strongest piece, but it is not always the one that gives check from the promotion square.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [mate_in] c7c8n is checkmate.

### Step 11: item  (shown without telling the learner the topic: unlabeled test)

**Task `IG-PROMO-15`** (predict_outcome, difficulty cue 3)

White to move. Can the pawn on e7 promote by moving straight ahead? Predict, then check.

```
  8  . . . . n . . .
  7  . k . . P . . .
  6  . . . . . . . .
  5  . p . . . . . B
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . . . K .
  1  . . . . . . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 4n3/1k2P3/8/1p5B/8/8/6K1/8 w - - 0 1
```

**Accepted answer:** {"outcome": "no"}

**Explanation shown:** No. A pawn cannot move straight ahead onto an occupied square, so it cannot promote that way.

Hints (in order):
1. A pawn promotes only when it reaches the far rank.
2. Count the squares to the far rank and check whether the square ahead is free.
3. A pawn moves one square at a time (two only from its starting rank), and never onto an occupied square.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [illegal_move] The straight promotion move is illegal.

### Step 12: item  (shown without telling the learner the topic: unlabeled test)

**Task `ISsp1-4`** (predict_outcome, difficulty cue 3)

White to move. Can the pawn on d7 promote on this move, by moving ahead or by capturing? Predict, then check.

```
  8  . . r n . . . k
  7  . . . P . . . .
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  K . . . . . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 2rn3k/3P4/8/8/8/8/8/K7 w - - 0 1
```

**Accepted answer:** {"outcome": "yes"}

**Explanation shown:** Yes, by capture. The knight blocks d8, but the rook on c8 stands diagonally in front of the pawn, so the pawn can take it and promote on c8.

Hints (in order):
1. Find the pawn and its last rank. Is it one step from that rank?
2. A pawn moves straight ahead only onto an empty square, and captures one square diagonally forward only onto an enemy piece.
3. Check the square straight ahead and then each of the two diagonal squares in front of the pawn.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [illegal_move] The pawn cannot advance to d8.
- [legal_move] The pawn can capture the rook on c8 and promote.

### Step 13: item  (shown without telling the learner the topic: unlabeled test)

**Task `IG-PROMO-19`** (predict_outcome, difficulty cue 3)

White to move. Can the pawn on c6 reach the last rank and promote on this move? Predict, then check.

```
  8  . . . . . . . .
  7  . . . . . k . .
  6  . . P . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . K . . .
  1  . . . . . . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 8/5k2/2P5/8/8/8/4K3/8 w - - 0 1
```

**Accepted answer:** {"outcome": "no"}

**Explanation shown:** No. The pawn is still two squares from the last rank, and a pawn moves one square at a time (two only from its starting rank). It needs two moves.

Hints (in order):
1. A pawn promotes only when it reaches the far rank.
2. Count the squares to the far rank and check whether the square ahead is free.
3. A pawn moves one square at a time (two only from its starting rank), and never onto an occupied square.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [illegal_move] Reaching the last rank in one move is illegal.

### Step 14: practice

A drill of 4 tasks drawn from the bank by tag ['node.FND.PROMOTE', 'kind.generated'] (30 tasks carry those tags). Not reproduced here; ask for a sample if you want one checked.

### Step 15: reflect

Kind: unsure

Prompt: Before you push a pawn to the last rank, which of the two checks would you be most likely to skip: the square ahead and the diagonals, or whether the new piece can be taken or causes stalemate? Write how you will remember it.

---

## Reviewer scorecard

Fill in the file `content/review/L-FND-PROMOTE-1.json` (a template is below). Scale 1 to 5 for each dimension: 1 = wrong or unusable, 3 = acceptable with edits, 5 = I would put my name to it as it stands.
Revision to review: `754d8171`. If the lesson text changes after your review, your sign-off no longer applies and the lesson goes back to needs-human.

| Dimension | What to judge | Score |
|---|---|---|
| chess | every statement, line and explanation is correct; near-misses are really near-misses | |
| clarity | the explanation actually explains (mechanism, conditions), in plain words | |
| prerequisites | the lesson assumes only what the learner has met | |
| tasks | each task has one defensible answer and a fair explanation | |

```json
{
  "lesson": "L-FND-PROMOTE-1",
  "revision": "754d8171",
  "reviewer": "<your name>",
  "reviewer_role": "strong-player",
  "date": "YYYY-MM-DD",
  "scores": {"chess": 0, "clarity": 0, "prerequisites": 0, "tasks": 0},
  "comments": "<what to change, by step number>",
  "verdict": "approved"
}
```

`reviewer_role` is `strong-player` or `teacher`. `verdict` is `approved` or `changes-requested`. See docs/review-slice.md.
