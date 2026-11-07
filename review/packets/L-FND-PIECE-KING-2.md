# Review packet: L-FND-PIECE-KING-2

**The king in a busy position**

- Skill: FND.PIECE.KING (D2); stage: S2; stated length: 12 minutes
- Steps: 10 (6 are tasks); revision: `56b72033`
- Review status now: needs-human

## What the lesson says the learner will be able to do

- Names the piece on a given square before using its rule, with no hint in the prompt
- Taps every square the king can step to, removing squares next to the enemy king and squares attacked by enemy pieces
- Decides whether an enemy piece next to the king can be taken, by checking whether it is defended
- Ignores distant enemy pieces that attack none of the king's neighbouring squares

## Sources the author names (check that they are used fairly, in our own words)

- content/skills/FND.PIECE.KING.json (D2 outcome)
- content/lessons/L-FND-QUEENKING-1.json
- content/items/lesson-ds12.json
- rules of chess (python-chess legal move generation, via tools/validate.py)

## How to read this packet

Boards are drawn with capitals for White and lower case for Black, rank 8 at the top unless the board is shown from Black's side. Moves in a line are in standard notation. Statements marked [V] were machine-checked, [I] inference, [H] hypothesis, [S] secondary source, [R] recalled. Please judge the explanations, not only the moves: does each sentence tell the learner why?

---

### Step 1: card

In **How the king moves** you were told "king". Now nobody says it. Name the piece first, then list its up to eight neighbouring squares and cross out the unsafe ones: squares next to the enemy king, squares an enemy piece attacks, and enemy pieces that are defended. What remains is the answer.

### Step 2: board

Caption: The piece on d3 is a king. The rook on e1 attacks the e-file, and the black king covers c4 and d4.

```
  8  . . . . . . . .
  7  . . . . . . . .
  6  . . . . . . . .
  5  . . k . . . . .
  4  . . . . . . . .
  3  . . . K . . . .
  2  . . . . . . . .
  1  . . . . r . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 8/8/8/2k5/8/3K4/8/4r3 w - - 0 1
```

The line, with the sentence the learner sees at each move:
1. **1. Kc3**: The king steps to c3, one of three safe squares.
2. **1... Re8**: Black moves the rook.

```
  8  . . . . r . . .
  7  . . . . . . . .
  6  . . . . . . . .
  5  . . k . . . . .
  4  . . . . . . . .
  3  . . K . . . . .
  2  . . . . . . . .
  1  . . . . . . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 4r3/8/8/2k5/8/2K5/8/8 w - - 2 2
```

Drawn on the board: arrows d3-c2, d3-d2, d3-c3; highlighted squares c2, c3, d2.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_destinations] (no sentence; a rules check)

### Step 3: item

**Task `IG-MOVE-141`** (select_squares, difficulty cue 3)

Black to move. Tap every square the piece on e8 can move to.

```
  1  . . . . . . . .
  2  . . . . . . . .
  3  . . . . . . . .
  4  . . . . . . . .
  5  . . . . N . . .
  6  . . . . . . . .
  7  . . . . . K . .
  8  . . . k N . . .
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: 3Nk3/2K5/8/3N4/8/8/8/8 b - - 0 1
```

**Accepted answer:** squares f8 (from e8)

**Explanation shown:** The king on e8 can move to 1 square: f8. It cannot go to d7, d8, e7 and f7: the enemy covers those squares.

Hints (in order):
1. First decide what kind of piece stands on e8. Then recall how that piece moves.
2. The king may not land on a square the enemy attacks, nor next to the enemy king, nor on its own pieces.
3. For each touching square ask: is it free or enemy-held, and could an enemy piece capture the king there?

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_destinations] The black king on e8 can legally move to exactly these squares.

### Step 4: card

List the king's neighbours, then ask three questions of each: is it my own piece, is it next to the enemy king, is it attacked? An enemy piece on a neighbouring square can be taken only if nothing defends it. A far-away enemy piece matters only if it attacks one of those squares. *Rule of thumb:* check the defenders of a piece before taking it.

### Step 5: contrast

Title: Defended or not

Prompt: Predict first. In the first position the knight next to the king has no defender. In the second, a pawn has been added. In the third, a rook has moved far away. What does each change do to the king's squares?

**The working board:**

**Task `IBds12-4`** (select_squares, difficulty cue 2)

White to move. Tap every square the piece on d4 can move to.

```
  8  . . . . . . . .
  7  . . . . . . . .
  6  . . k . . . . .
  5  . . . . . p . .
  4  . . . K . . . .
  3  . . n . . . . .
  2  . . . . . . . .
  1  . . . . . . . r
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 8/8/2k5/5p2/3K4/2n5/8/7r w - - 0 1
```

**Accepted answer:** squares c3, c4, d3, e3, e5 (from d4)

**Explanation shown:** The piece on d4 is a king. It can step to c3, c4, d3, e3 and e5. It can take the knight on c3 because no black piece defends it. It cannot go next to the black king or onto e4, which the pawn attacks.

Hints (in order):
1. First find out which piece stands on d4. Then ask which neighbouring squares are unsafe.
2. Two squares touch the black king. One more square is attacked by a pawn.
3. The knight on c3 is next to the king. Does any black piece defend it?

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_destinations] The white piece on d4 can legally move to exactly these squares.
- [illegal_move] The king cannot step next to the enemy king (c5).
- [illegal_move] The king cannot step next to the enemy king (d5).
- [illegal_move] The pawn on f5 attacks e4, so the king may not go there.
- [attackers] No black piece defends the knight on c3.

**The failing board:**

**Task `IBds12-21`** (select_squares, difficulty cue 2)

White to move. Tap every square the piece on d4 can move to.

```
  8  . . . . . . . .
  7  . . . . . . . .
  6  . . k . . . . .
  5  . . . . . p . .
  4  . p . K . . . .
  3  . . n . . . . .
  2  P . . . . . . .
  1  . . . . . . . r
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 8/8/2k5/5p2/1p1K4/2n5/P7/7r w - - 0 1
```

**Accepted answer:** squares c4, d3, e3, e5 (from d4)

**Explanation shown:** A black pawn on b4 defends the knight on c3, so the king may not take it. The white pawn on a2 is far away and changes nothing. The king can step to c4, d3, e3 and e5.

Hints (in order):
1. Compare with the first position: a black pawn appeared on b4.
2. Look again at the knight on c3. Does anything defend it now?
3. A pawn on b4 attacks c3, so the knight is defended.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_destinations] The white piece on d4 can legally move to exactly these squares.
- [illegal_move] The king cannot step next to the enemy king (c5).
- [illegal_move] The king cannot step next to the enemy king (d5).
- [illegal_move] The pawn on f5 attacks e4, so the king may not go there.
- [attackers] One black piece (the pawn on b4) defends the knight on c3.
- [illegal_move] The king cannot take a defended knight.

**The irrelevant board:**

**Task `IBds12-6`** (select_squares, difficulty cue 2)

White to move. Tap every square the piece on d4 can move to.

```
  8  . . . . . . . r
  7  . . . . . . . .
  6  . . k . . . . .
  5  . . . . . p . .
  4  . . . K . . . .
  3  . . n . . . . .
  2  . . . . . . . .
  1  . . . . . . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 7r/8/2k5/5p2/3K4/2n5/8/8 w - - 0 1
```

**Accepted answer:** squares c3, c4, d3, e3, e5 (from d4)

**Explanation shown:** The black rook moved from h1 to h8, far from the king. It attacks none of the king's neighbouring squares, so the king still has the same 5 squares: c3, c4, d3, e3 and e5.

Hints (in order):
1. Only the black rook has moved. Which squares next to the king does it touch now?
2. It stands on the far edge of the board.
3. It attacks none of the five squares the king could use, so the answer is unchanged.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_destinations] The white piece on d4 can legally move to exactly these squares.
- [illegal_move] The king cannot step next to the enemy king (c5).
- [illegal_move] The king cannot step next to the enemy king (d5).
- [illegal_move] The pawn on f5 attacks e4, so the king may not go there.
- [attackers] No black piece defends the knight on c3.

### Step 6: item  (shown without telling the learner the topic: unlabeled test)

**Task `IG-MOVE-142`** (select_squares, difficulty cue 3)

Black to move. Tap every square the piece on c3 can move to.

```
  1  . . . . . . . .
  2  . . . . . . . R
  3  . . . . . k . .
  4  . . . . N . . .
  5  . . . . . . . K
  6  . . . . . . . .
  7  . B . . . . . .
  8  . . . . . . . b
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: b7/6B1/8/K7/3N4/2k5/R7/8 b - - 0 1
```

**Accepted answer:** squares c4, d3 (from c3)

**Explanation shown:** The king on c3 can move to 2 squares: c4, d3. It cannot go to b2, b3, b4, c2, d2 and d4: the enemy covers those squares.

Hints (in order):
1. First decide what kind of piece stands on c3. Then recall how that piece moves.
2. The king may not land on a square the enemy attacks, nor next to the enemy king, nor on its own pieces.
3. For each touching square ask: is it free or enemy-held, and could an enemy piece capture the king there?

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_destinations] The black king on c3 can legally move to exactly these squares.

### Step 7: item  (shown without telling the learner the topic: unlabeled test)

**Task `IG-MOVE-144`** (select_squares, difficulty cue 3)

White to move. Tap every square the piece on c6 can move to.

```
  8  . . . . . . . .
  7  r . . . . . . .
  6  . . K . . . . .
  5  . . . n . . . .
  4  k . . . . . . .
  3  . . . . . . . .
  2  . . . . . . b .
  1  B . . . . . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 8/r7/2K5/3n4/k7/8/6b1/B7 w - - 0 1
```

**Accepted answer:** squares c5, d6 (from c6)

**Explanation shown:** The king on c6 can move to 2 squares: c5, d6. It cannot go to b5, b6, b7, c7, d5 and d7: the enemy covers those squares.

Hints (in order):
1. First decide what kind of piece stands on c6. Then recall how that piece moves.
2. The king may not land on a square the enemy attacks, nor next to the enemy king, nor on its own pieces.
3. For each touching square ask: is it free or enemy-held, and could an enemy piece capture the king there?

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_destinations] The white king on c6 can legally move to exactly these squares.

### Step 8: item  (shown without telling the learner the topic: unlabeled test)

**Task `IBds12-19`** (predict_outcome, difficulty cue 3)

Can the white king on d4 take the knight on c5? Predict, then check.

```
  8  . . . . k . . .
  7  . . . . . . . .
  6  . p . . . . . .
  5  . . n . . . . .
  4  . . . K . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  . . . . . . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 4k3/8/1p6/2n5/3K4/8/8/8 w - - 0 1
```

**Accepted answer:** {"outcome": "no"}

**Explanation shown:** The knight stands next to the king, but the pawn on b6 defends it. The king may not step onto a square an enemy piece attacks, so it cannot take.

Hints (in order):
1. Is the knight next to the king?
2. Look for a black piece that attacks c5.
3. A pawn on b6 attacks c5, so the knight is defended.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [illegal_move] The king cannot take a defended knight.
- [attackers] One black piece (the pawn on b6) defends the knight on c5.

### Step 9: practice

A drill of 6 tasks drawn from the bank by tag ['node.FND.PIECE.KING', 'cue.3'] (12 tasks carry those tags). Not reproduced here; ask for a sample if you want one checked.

### Step 10: reflect

Kind: expect

Prompt: In the silent items, which squares did you cross out first: the ones next to the enemy king or the ones attacked by a piece? Did you ever forget a defender?

---

## Reviewer scorecard

Fill in the file `content/review/L-FND-PIECE-KING-2.json` (a template is below). Scale 1 to 5 for each dimension: 1 = wrong or unusable, 3 = acceptable with edits, 5 = I would put my name to it as it stands.
Revision to review: `56b72033`. If the lesson text changes after your review, your sign-off no longer applies and the lesson goes back to needs-human.

| Dimension | What to judge | Score |
|---|---|---|
| chess | every statement, line and explanation is correct; near-misses are really near-misses | |
| clarity | the explanation actually explains (mechanism, conditions), in plain words | |
| prerequisites | the lesson assumes only what the learner has met | |
| tasks | each task has one defensible answer and a fair explanation | |

```json
{
  "lesson": "L-FND-PIECE-KING-2",
  "revision": "56b72033",
  "reviewer": "<your name>",
  "reviewer_role": "strong-player",
  "date": "YYYY-MM-DD",
  "scores": {"chess": 0, "clarity": 0, "prerequisites": 0, "tasks": 0},
  "comments": "<what to change, by step number>",
  "verdict": "approved"
}
```

`reviewer_role` is `strong-player` or `teacher`. `verdict` is `approved` or `changes-requested`. See docs/review-slice.md.
