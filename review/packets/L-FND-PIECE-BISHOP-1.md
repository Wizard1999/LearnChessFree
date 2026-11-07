# Review packet: L-FND-PIECE-BISHOP-1

**How the bishop moves**

- Skill: FND.PIECE.BISHOP (D1); stage: S0; stated length: 10 minutes
- Steps: 10 (6 are tasks); revision: `56965076`
- Review status now: needs-human

## What the lesson says the learner will be able to do

- Taps every square a bishop can reach, including captures and blocked diagonals
- Says why a bishop can never reach a square of the other colour or a square straight ahead

## Sources the author names (check that they are used fairly, in our own words)

- docs/first-hours.md session 1
- docs/council-synthesis.md CD-1, CD-4
- content/skills/FND.PIECE.BISHOP.json

## How to read this packet

Boards are drawn with capitals for White and lower case for Black, rank 8 at the top unless the board is shown from Black's side. Moves in a line are in standard notation. Statements marked [V] were machine-checked, [I] inference, [H] hypothesis, [S] secondary source, [R] recalled. Please judge the explanations, not only the moves: does each sentence tell the learner why?

---

### Step 1: card

The **bishop** moves in diagonals, as far as it likes, and cannot jump. A bishop stays on one colour of square for the whole game: one bishop travels on light squares, the other on dark squares. A capture means landing on an enemy piece: that piece is removed, and the bishop stops on its square.

### Step 2: board

Caption: Four diagonals, but the white pawn on b2 shortens one of them.

```
  8  . . . . k . . .
  7  . . . . . . . .
  6  . . . . . p . .
  5  . . . . . . . .
  4  . . . B . . . .
  3  . . . . . . . .
  2  . P . . . . . .
  1  . . . . K . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 4k3/8/5p2/8/3B4/8/1P6/4K3 w - - 0 1
```

Drawn on the board: arrows d4-f6; highlighted squares a7, b6, c3, c5, e3, e5, f2, f6, g1.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_destinations] (no sentence; a rules check)

### Step 3: item

**Task `IA0-11`** (select_squares, difficulty cue 1)

Tap every square the white bishop can move to.

```
  8  . . . . k . . .
  7  . . . . . . . .
  6  . . . . . p . .
  5  . . . . . . . .
  4  . . . B . . . .
  3  . . . . . . . .
  2  . P . . . . . .
  1  . . . . K . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 4k3/8/5p2/8/3B4/8/1P6/4K3 w - - 0 1
```

**Accepted answer:** squares a7, b6, c3, c5, e3, e5, f2, f6, g1 (from d4)

**Explanation shown:** The bishop can reach 9 squares. It can capture the black pawn on f6, and its line ends there. It stops before its own pawn on b2.

Hints (in order):
1. A bishop moves only along diagonals, in four directions.
2. Go one diagonal at a time and stop when you meet a piece.
3. Your own pawn on b2 stops one direction early, and the black pawn on f6 can be captured but not passed.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_destinations] These are exactly the squares the bishop on d4 can move to.

### Step 4: item

**Task `IA0-17`** (find_move, difficulty cue 2)

The bishop can capture one of the black pawns. Which move does it?

```
  8  . . . . k . . .
  7  . . . . . . . .
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . p p .
  3  . . . . . . . .
  2  . . . . . . . .
  1  . . B . K . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 4k3/8/8/8/5pp1/8/8/2B1K3 w - - 0 1
```

**Accepted answer(s):** Bxf4

**Explanation shown:** f4 is on the bishop's diagonal c1-d2-e3-f4. The pawn on g4 is on no diagonal of c1. A bishop stays on one colour of square for the whole game, and c1 and g4 are different colours.

Hints (in order):
1. A bishop only moves on diagonals. Which pawn stands on a diagonal of c1?
2. From c1 the long diagonal goes d2, e3, f4, g5, h6.
3. f4 is on that diagonal and nothing stands between.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] The bishop can capture on f4.
- [illegal_move] It cannot capture on g4.
- [legal_destinations] These are all the squares the bishop can go to.

### Step 5: card

Before you move a bishop, ask three questions. Is the square on one of its diagonals? Is anything standing between? Whose piece, if any, is on the square? Empty or enemy: allowed, and a captured piece ends the slide. Your own piece: not allowed. A bishop also never changes colour, so a square of the other colour is out of reach for good.

### Step 6: contrast

Title: Same bishop, one change

Prompt: A black pawn stands on f6. Then it becomes White's own pawn. Predict first: can the bishop still go to f6? Then see what a pawn off the diagonal does.

**The working board:**

**Task `IA0-14`** (predict_outcome, difficulty cue 2)

A black pawn stands on f6. Can the white bishop go to f6? Predict, then check.

```
  8  . . . . k . . .
  7  . . . . . . . .
  6  . . . . . p . .
  5  . . . . . . . .
  4  . . . B . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  . . . . K . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 4k3/8/5p2/8/3B4/8/8/4K3 w - - 0 1
```

**Accepted answer:** {"outcome": "yes"}

**Explanation shown:** f6 is on the bishop's diagonal and holds an enemy pawn, so the bishop can capture it.

Hints (in order):
1. Is f6 on one of the bishop's diagonals?
2. Whose piece stands on f6?

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] The bishop can capture on f6.

**The failing board:**

**Task `IA0-15`** (predict_outcome, difficulty cue 3)

Now the pawn on f6 is White's own pawn. Can the white bishop go to f6? Predict, then check.

```
  8  . . . . k . . .
  7  . . . . . . . .
  6  . . . . . P . .
  5  . . . . . . . .
  4  . . . B . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  . . . . K . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 4k3/8/5P2/8/3B4/8/8/4K3 w - - 0 1
```

**Accepted answer:** {"outcome": "no"}

**Explanation shown:** A piece may never land on a square holding its own side's piece. The bishop can reach e5 but not f6.

Hints (in order):
1. Is f6 on one of the bishop's diagonals?
2. Whose piece stands on f6 now?

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [illegal_move] The bishop cannot land on f6.
- [legal_move] It can still go to e5, just before the pawn.

**The irrelevant board:**

**Task `ISsp2-9`** (predict_outcome, difficulty cue 3)

Black pawns stand on f6 and d6. Can the white bishop go to f6 in one move? Predict, then check.

```
  8  . . . . k . . .
  7  . . . . . . . .
  6  . . . p . p . .
  5  . . . . . . . .
  4  . . . B . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  . . . . K . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 4k3/8/3p1p2/8/3B4/8/8/4K3 w - - 0 1
```

**Accepted answer:** {"outcome": "yes"}

**Explanation shown:** The pawn on d6 is not on the diagonal d4-f6, so nothing changes; the bishop still takes on f6.

Hints (in order):
1. Is the pawn on d6 on the diagonal from d4 to f6?
2. What happens to a pawn that stands off the bishop's diagonal?

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] The bishop can capture the pawn on f6.

### Step 7: item  (shown without telling the learner the topic: unlabeled test)

**Task `ISsp2-6`** (predict_outcome, difficulty cue 3)

Can the white bishop go to d5 in one move? Predict, then check.

```
  8  . . . . k . . .
  7  . . . . . . . .
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . B . . . .
  3  . . . . . . . .
  2  . . . . . . . p
  1  . . . . K . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 4k3/8/8/8/3B4/8/7p/4K3 w - - 0 1
```

**Accepted answer:** {"outcome": "no"}

**Explanation shown:** d5 is straight ahead, not on a diagonal. It is also a square of the other colour than d4, which a bishop can never reach.

Hints (in order):
1. Is d5 on a diagonal of d4?
2. Which colour is d4, and which is d5?

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [illegal_move] The bishop cannot move straight forward to d5.
- [legal_move] It can go diagonally to e5.

### Step 8: item  (shown without telling the learner the topic: unlabeled test)

**Task `ISsp2-8`** (predict_outcome, difficulty cue 3)

A black pawn stands on f6. Can the white bishop go to g7 in one move? Predict, then check.

```
  8  . . . . . . k .
  7  . . . . . . . .
  6  . . . . . p . .
  5  . . . . . . . .
  4  . . . B . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 6k1/8/5p2/8/3B4/8/8/6K1 w - - 0 1
```

**Accepted answer:** {"outcome": "no"}

**Explanation shown:** The pawn on f6 is on the diagonal. The bishop can take it, but cannot pass it to reach g7.

Hints (in order):
1. Is anything on the diagonal between d4 and g7?
2. What can the bishop do with an enemy piece in its way?

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [illegal_move] The bishop cannot get from d4 to g7: the pawn on f6 is in the way.
- [legal_move] It can capture the pawn on f6.

### Step 9: practice

A drill of 5 tasks drawn from the bank by tag ['node.FND.PIECE.BISHOP', 'kind.generated'] (36 tasks carry those tags). Not reproduced here; ask for a sample if you want one checked.

### Step 10: reflect

Kind: confidence

Prompt: In the silent round, name one answer that was a guess. Which diagonal did you not follow to the edge or to the first piece in the way? Rate how sure you were overall. (low / medium / high)

---

## Reviewer scorecard

Fill in the file `content/review/L-FND-PIECE-BISHOP-1.json` (a template is below). Scale 1 to 5 for each dimension: 1 = wrong or unusable, 3 = acceptable with edits, 5 = I would put my name to it as it stands.
Revision to review: `56965076`. If the lesson text changes after your review, your sign-off no longer applies and the lesson goes back to needs-human.

| Dimension | What to judge | Score |
|---|---|---|
| chess | every statement, line and explanation is correct; near-misses are really near-misses | |
| clarity | the explanation actually explains (mechanism, conditions), in plain words | |
| prerequisites | the lesson assumes only what the learner has met | |
| tasks | each task has one defensible answer and a fair explanation | |

```json
{
  "lesson": "L-FND-PIECE-BISHOP-1",
  "revision": "56965076",
  "reviewer": "<your name>",
  "reviewer_role": "strong-player",
  "date": "YYYY-MM-DD",
  "scores": {"chess": 0, "clarity": 0, "prerequisites": 0, "tasks": 0},
  "comments": "<what to change, by step number>",
  "verdict": "approved"
}
```

`reviewer_role` is `strong-player` or `teacher`. `verdict` is `approved` or `changes-requested`. See docs/review-slice.md.
