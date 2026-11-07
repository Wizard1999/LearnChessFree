# Review packet: L-FND-PIECE-KING-1

**How the king moves**

- Skill: FND.PIECE.KING (D1); stage: S0; stated length: 10 minutes
- Steps: 14 (9 are tasks); revision: `4d983a58`
- Review status now: needs-human

## What the lesson says the learner will be able to do

- Taps the squares a king can step to, never onto an attacked square or next to the enemy king
- Decides whether the king can take a neighbouring piece by checking whether it is guarded
- Ignores a distant enemy piece that attacks none of the squares around the king

## Sources the author names (check that they are used fairly, in our own words)

- docs/first-hours.md session 1
- docs/council-synthesis.md CD-1, CD-4

## How to read this packet

Boards are drawn with capitals for White and lower case for Black, rank 8 at the top unless the board is shown from Black's side. Moves in a line are in standard notation. Statements marked [V] were machine-checked, [I] inference, [H] hypothesis, [S] secondary source, [R] recalled. Please judge the explanations, not only the moves: does each sentence tell the learner why?

---

### Step 1: card

The **king** moves one square in any direction. He is the piece you must never lose, so there is one extra rule: **a king may never move onto a square the enemy attacks** (a square where an enemy piece could capture). 

### Step 2: board

Caption: The black rook attacks the whole fifth rank. The king cannot step onto it.

```
  8  k . . . . . . .
  7  . . . . . . . .
  6  . . . . . . . .
  5  . . . . . . . r
  4  . . . . K . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  . . . . . . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: k7/8/8/7r/4K3/8/8/8 w - - 0 1
```

Drawn on the board: arrows h5-e5; highlighted squares d3, d4, e3, f3, f4.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_destinations] (no sentence; a rules check)
- [attackers] (no sentence; a rules check)

### Step 3: item

**Task `IA0-23`** (select_squares, difficulty cue 1)

Tap every square the white king can move to. Watch out for the black rook.

```
  8  k . . . . . . .
  7  . . . . . . . .
  6  . . . . . . . .
  5  . . . . . . . r
  4  . . . . K . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  . . . . . . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: k7/8/8/7r/4K3/8/8/8 w - - 0 1
```

**Accepted answer:** squares d3, d4, e3, f3, f4 (from e4)

**Explanation shown:** The king has eight neighbouring squares, but the black rook covers the whole fifth rank, so d5, e5 and f5 are off limits. Five squares remain.

Hints (in order):
1. The king moves one square in any direction.
2. But a king may never move onto a square the enemy attacks. Which squares does the rook attack?
3. The rook attacks the whole fifth rank, so d5, e5 and f5 are forbidden.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_destinations] These are exactly the squares the king on e4 can move to.
- [attackers] The black rook attacks e5.
- [attackers] Nothing black attacks d4.

### Step 4: card

Two kings can never stand on neighbouring squares either: each would attack the other's square. So the squares around the enemy king are off limits, even if no other piece attacks them.

### Step 5: item

**Task `IA0-24`** (select_squares, difficulty cue 3)

Tap every square the white king can move to.

```
  8  . . . . . . . .
  7  . . . . . . . .
  6  . . . . . k . .
  5  . . . . . . . .
  4  . . . . K . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  . . . . . . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 8/8/5k2/8/4K3/8/8/8 w - - 0 1
```

**Accepted answer:** squares d3, d4, d5, e3, f3, f4 (from e4)

**Explanation shown:** The black king on f6 touches e5 and f5, so the white king cannot step there. Two kings can never stand on neighbouring squares. Six squares remain.

Hints (in order):
1. A king may not move onto a square the enemy attacks. Does the black king attack anything?
2. Kings attack all the squares next to them. Which of white's neighbouring squares are next to the black king?
3. e5 and f5 touch the king on f6. Kings can never stand next to each other.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_destinations] These are exactly the squares the king on e4 can move to.
- [attackers] The black king attacks e5.
- [attackers] The black king attacks f5.

### Step 6: card

The king can capture too, but only if the piece is not guarded. A piece is **guarded** (or defended) when a friendly piece could recapture on its square. **When it holds:** step to free or safely capturable squares. **When it fails:** an attacked square, a square next to the enemy king, or a guarded piece. Ask before you capture: which enemy pieces attack the square I am about to land on?

### Step 7: contrast

Title: Same capture, one change

Prompt: Predict first: can the king take the knight each time?

**The working board:**

**Task `IA0-25`** (predict_outcome, difficulty cue 2)

Can the white king capture the black knight on d5? Predict, then check.

```
  8  k . . . . . . .
  7  p . . . . . . .
  6  . . . . . . . .
  5  . . . n . . . .
  4  . . . . K . . .
  3  . . . . . . . .
  2  P . . . . . . P
  1  . . . . . . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: k7/p7/8/3n4/4K3/8/P6P/8 w - - 0 1
```

**Accepted answer:** {"outcome": "yes"}

**Explanation shown:** No black piece attacks d5, so the king may take the knight.

Hints (in order):
1. The king can capture an enemy piece on a neighbouring square. Is the knight on a neighbouring square?
2. But the king may not move onto an attacked square. Does any black piece attack d5?

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] The king can capture on d5.
- [attackers] No black piece guards d5.

**The failing board:**

**Task `IA0-26`** (predict_outcome, difficulty cue 3)

A black pawn now stands on c6. Can the white king capture the black knight on d5? Predict, then check.

```
  8  k . . . . . . .
  7  p . . . . . . .
  6  . . p . . . . .
  5  . . . n . . . .
  4  . . . . K . . .
  3  . . . . . . . .
  2  P . . . . . . P
  1  . . . . . . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: k7/p7/2p5/3n4/4K3/8/P6P/8 w - - 0 1
```

**Accepted answer:** {"outcome": "no"}

**Explanation shown:** The black pawn on c6 guards d5. If the king took the knight it would land on an attacked square, and that is never allowed.

Hints (in order):
1. Is the knight on a neighbouring square? Yes, so look at what else changed.
2. Which black piece attacks d5 now?
3. Pawns attack the squares diagonally in front of them. The pawn on c6 attacks d5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [illegal_move] The king cannot capture on d5.
- [attackers] The pawn on c6 guards d5.

**The irrelevant board:**

**Task `ISsp3-4`** (predict_outcome, difficulty cue 2)

A black pawn appears on h5, far from the knight. Can the white king capture the black knight on d5? Predict, then check.

```
  8  k . . . . . . .
  7  p . . . . . . .
  6  . . . . . . . .
  5  . . . n . . . p
  4  . . . . K . . .
  3  . . . . . . . .
  2  P . . . . . . P
  1  . . . . . . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: k7/p7/8/3n3p/4K3/8/P6P/8 w - - 0 1
```

**Accepted answer:** {"outcome": "yes"}

**Explanation shown:** The pawn on h5 attacks only g4. No black piece attacks d5, so the king may still take the knight.

Hints (in order):
1. Is the knight on a neighbouring square? Yes. So the question is whether d5 is guarded.
2. Does the pawn on h5 attack d5 or any square near it?

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] The king can capture on d5.
- [attackers] No black piece guards d5.

### Step 8: item  (shown without telling the learner the topic: unlabeled test)

**Task `IG-MOVE-130`** (select_squares, difficulty cue 1)

Black to move. Tap every square the black king on f1 can move to.

```
  1  . . k . . . . .
  2  . . . N . . . .
  3  . . . . . . . .
  4  . . . . . . . .
  5  . . . . . . . .
  6  . . . . . . . .
  7  . . . . . . . K
  8  . . r . . . . .
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: 5r2/K7/8/8/8/8/4N3/5k2 b - - 0 1
```

**Accepted answer:** squares e1, e2, f2, g2 (from f1)

**Explanation shown:** The king on f1 can move to 4 squares: e1, e2, f2, g2. It can capture the knight on e2. It cannot go to g1: the enemy covers that square.

Hints (in order):
1. A king moves one square in any direction. Which squares touch f1?
2. The king may not land on a square the enemy attacks, nor next to the enemy king, nor on its own pieces.
3. For each touching square ask: is it free or enemy-held, and could an enemy piece capture the king there?

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_destinations] The black king on f1 can legally move to exactly these squares.

### Step 9: item  (shown without telling the learner the topic: unlabeled test)

**Task `IBds12-5`** (select_squares, difficulty cue 2)

White to move. Tap every square the piece on d4 can move to.

```
  8  . . . . . . . .
  7  . . . . . . . .
  6  . . k . . . . .
  5  . . . . . p . .
  4  . p . K . . . .
  3  . . n . . . . .
  2  . . . . . . . .
  1  . . . . . . . r
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 8/8/2k5/5p2/1p1K4/2n5/8/7r w - - 0 1
```

**Accepted answer:** squares c4, d3, e3, e5 (from d4)

**Explanation shown:** A black pawn on b4 now defends the knight on c3, so the king may not take it. The king can step to c4, d3, e3 and e5.

Hints (in order):
1. Only one thing has changed: a black pawn appeared.
2. Look again at the knight on c3. Does anything defend it now?
3. A pawn on b4 attacks c3, so the knight is defended.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_destinations] The white piece on d4 can legally move to exactly these squares.
- [illegal_move] The king cannot step next to the enemy king (c5).
- [illegal_move] The king cannot step next to the enemy king (d5).
- [illegal_move] The pawn on f5 attacks e4, so the king may not go there.
- [attackers] One black piece (the pawn on b4) defends the knight on c3.
- [illegal_move] The king cannot take a defended knight.

### Step 10: item  (shown without telling the learner the topic: unlabeled test)

**Task `IG-MOVE-138`** (select_squares, difficulty cue 3)

White to move. Tap every square the piece on a8 can move to.

```
  8  K . B . . . . .
  7  . n . . r . . .
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . b . .
  3  . . . . . k . .
  2  . . . . . . . .
  1  . . . . . . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: K1B5/1n2r3/8/8/5b2/5k2/8/8 w - - 0 1
```

**Accepted answer:** squares a7 (from a8)

**Explanation shown:** The king on a8 can move to 1 square: a7. It cannot go to b7 and b8: the enemy covers those squares.

Hints (in order):
1. First decide what kind of piece stands on a8. Then recall how that piece moves.
2. The king may not land on a square the enemy attacks, nor next to the enemy king, nor on its own pieces.
3. For each touching square ask: is it free or enemy-held, and could an enemy piece capture the king there?

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_destinations] The white king on a8 can legally move to exactly these squares.

### Step 11: item  (shown without telling the learner the topic: unlabeled test)

**Task `IG-MOVE-139`** (select_squares, difficulty cue 3)

White to move. Tap every square the piece on e1 can move to.

```
  8  . . . . . . . .
  7  . . . . . . . .
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . n . . . .
  3  . . . . . . . .
  2  . . k . . . . .
  1  . . . n K . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 8/8/8/8/3n4/8/2k5/3nK3 w - - 0 1
```

**Accepted answer:** squares f1 (from e1)

**Explanation shown:** The king on e1 can move to 1 square: f1. It cannot go to d1, d2, e2 and f2: the enemy covers those squares.

Hints (in order):
1. First decide what kind of piece stands on e1. Then recall how that piece moves.
2. The king may not land on a square the enemy attacks, nor next to the enemy king, nor on its own pieces.
3. For each touching square ask: is it free or enemy-held, and could an enemy piece capture the king there?

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_destinations] The white king on e1 can legally move to exactly these squares.

### Step 12: practice

A drill of 5 tasks drawn from the bank by tag ['node.FND.PIECE.KING', 'kind.generated'] (36 tasks carry those tags). Not reproduced here; ask for a sample if you want one checked.

### Step 13: practice

A drill of 5 tasks drawn from the bank by tag ['node.FND.PIECE.KING', 'cue.3', 'kind.generated'] (9 tasks carry those tags). Not reproduced here; ask for a sample if you want one checked.

### Step 14: reflect

Kind: confidence

Prompt: In the mixed round, which square did you forget to cross out because an enemy piece attacked it? Rate how sure you were of your answers overall. (low / medium / high)

---

## Reviewer scorecard

Fill in the file `content/review/L-FND-PIECE-KING-1.json` (a template is below). Scale 1 to 5 for each dimension: 1 = wrong or unusable, 3 = acceptable with edits, 5 = I would put my name to it as it stands.
Revision to review: `4d983a58`. If the lesson text changes after your review, your sign-off no longer applies and the lesson goes back to needs-human.

| Dimension | What to judge | Score |
|---|---|---|
| chess | every statement, line and explanation is correct; near-misses are really near-misses | |
| clarity | the explanation actually explains (mechanism, conditions), in plain words | |
| prerequisites | the lesson assumes only what the learner has met | |
| tasks | each task has one defensible answer and a fair explanation | |

```json
{
  "lesson": "L-FND-PIECE-KING-1",
  "revision": "4d983a58",
  "reviewer": "<your name>",
  "reviewer_role": "strong-player",
  "date": "YYYY-MM-DD",
  "scores": {"chess": 0, "clarity": 0, "prerequisites": 0, "tasks": 0},
  "comments": "<what to change, by step number>",
  "verdict": "approved"
}
```

`reviewer_role` is `strong-player` or `teacher`. `verdict` is `approved` or `changes-requested`. See docs/review-slice.md.
