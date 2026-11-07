# Review packet: L-FND-SPECIAL-1

**En passant: capture a pawn in passing**

- Skill: FND.ENPASSANT (D1); stage: S1; stated length: 9 minutes
- Steps: 11 (7 are tasks); revision: `d37ee09c`
- Review status now: needs-human

## What the lesson says the learner will be able to do

- Captures en passant when told to, for White and for Black
- Knows the capture must be made on the very next move
- Says when en passant is not available

## Sources the author names (check that they are used fairly, in our own words)

- docs/first-hours.md session 3
- docs/council-synthesis.md CD-1, CD-4
- content/skills/FND.ENPASSANT.json (conditions, contrasts)
- items IA0-85..87 and IG-EP-2, 13, 15, 16 (en passant legality verified by the rules claims)
- split from the former combined lesson 'En passant: capture a pawn in passing' (D24, one building block per lesson)

## How to read this packet

Boards are drawn with capitals for White and lower case for Black, rank 8 at the top unless the board is shown from Black's side. Moves in a line are in standard notation. Statements marked [V] were machine-checked, [I] inference, [H] hypothesis, [S] secondary source, [R] recalled. Please judge the explanations, not only the moves: does each sentence tell the learner why?

---

### Step 1: card

**En passant** means 'in passing'. When an enemy pawn jumps two squares and lands right beside your pawn, you may capture it as if it had moved only one square. Your pawn goes to the square the enemy pawn passed over, and the enemy pawn is removed. You must do it on the very next move, or the chance is gone.

### Step 2: board

Caption: Black's pawn jumped from d7 to d5. White captures it as if it had stopped on d6.

```
  8  . . . . k . . .
  7  . . . . . . . .
  6  . . . . . . . .
  5  . . . p P . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  . . . . K . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 4k3/8/8/3pP3/8/8/8/4K3 w - d6 0 1
```

The line, with the sentence the learner sees at each move:
1. **1. exd6**: The pawn captures en passant: it lands on d6 and the pawn on d5 is removed.

```
  8  . . . . k . . .
  7  . . . . . . . .
  6  . . . P . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  . . . . K . . .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 4k3/8/3P4/8/8/8/8/4K3 b - - 0 1
```

Drawn on the board: arrows e5-d6; highlighted squares d5, d6.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] (no sentence; a rules check)

### Step 3: item

**Task `IA0-85`** (find_move, difficulty cue 1)

Black has just played the pawn from d7 to d5, next to your pawn. Capture it en passant.

```
  8  . . . . k . . .
  7  . . . . . . . .
  6  . . . . . . . .
  5  . . . p P . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  . . . . K . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 4k3/8/8/3pP3/8/8/8/4K3 w - d6 0 1
```

**Accepted answer(s):** exd6

Feedback shown for wrong moves:
- e6: That is an ordinary pawn move. The en passant capture goes to d6.

**Explanation shown:** The black pawn jumped from d7 to d5 and now stands beside the pawn on e5. White may capture it as if it had stopped on d6: the pawn moves e5 to d6 and the pawn on d5 is removed.

Hints (in order):
1. The black pawn jumped two squares and landed right beside your pawn.
2. You capture it as if it had moved only one square. Which square is that?
3. Your pawn goes diagonally to d6, and the black pawn on d5 disappears.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] White can capture en passant on d6.
- [legal_move] White can also simply push the pawn.

### Step 4: item

**Task `IG-EP-3`** (find_move, difficulty cue 1)

Black to move. White has just played d2-d4. Capture en passant.

```
  1  . . . . . . . .
  2  . . . . . k . .
  3  . . . . . . . .
  4  . . . p P . . .
  5  . . . . . . . K
  6  . . . . . . . .
  7  . . . . . . . .
  8  . . . . . r . .
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: 2r5/8/8/K7/3Pp3/8/2k5/8 b - d3 0 1
```

**Accepted answer(s):** exd3

**Explanation shown:** The pawn on e4 captures en passant by moving to d3, the square the enemy pawn passed over; the enemy pawn is removed from the board.

Hints (in order):
1. En passant is a pawn capture that is only available on the very next move after an enemy pawn moved two squares forward.
2. The capturing pawn must stand on the same rank as the pawn that just moved, directly beside it.
3. The capturing pawn moves diagonally to the square the enemy pawn skipped over, and the enemy pawn is removed.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] The en passant capture e4-d3 is legal.

### Step 5: contrast

Title: Same pawns, one change

Prompt: Black has just jumped a pawn from d7 to d5, or it was standing on d5 already. Predict first: can White capture en passant?

**The working board:**

**Task `IA0-86`** (predict_outcome, difficulty cue 2)

Black has just played d7-d5. Can White capture that pawn en passant? Predict, then check.

```
  8  . . . . k . . .
  7  . . . . . . . .
  6  . . . . . . . .
  5  . . . p P . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  . . . . K . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 4k3/8/8/3pP3/8/8/8/4K3 w - d6 0 1
```

**Accepted answer:** {"outcome": "yes"}

**Explanation shown:** The pawn has just jumped two squares and landed beside White's pawn, so en passant is available now.

Hints (in order):
1. Did the black pawn just jump two squares?
2. Is it right beside White's pawn?

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] The capture on d6 is legal.

**The failing board:**

**Task `IA0-87`** (predict_outcome, difficulty cue 3)

The same pawns, but Black's pawn reached d5 two moves ago and White played something else since. Can White capture it en passant now? Predict, then check.

```
  8  . . . . k . . .
  7  . . . . . . . .
  6  . . . . . . . .
  5  . . . p P . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  . . . . K . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 4k3/8/8/3pP3/8/8/8/4K3 w - - 0 1
```

**Accepted answer:** {"outcome": "no"}

**Explanation shown:** En passant must be played at once. If White waits a move, the chance is gone for good.

Hints (in order):
1. En passant is only possible straight after the two-square jump.
2. Was the jump the last move?

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [illegal_move] The capture on d6 is not legal now.
- [legal_move] White's pawn can still move forward.

### Step 6: card

It works only on the move right after the two-square jump, and only for a pawn beside the jumper. If the enemy pawn arrived earlier, or by single steps, the right is gone; only the last move counts. Other pieces do not change the timing rule. (Like any move, the capture is not allowed if it would leave your own king in check; you meet that later.)

### Step 7: item  (shown without telling the learner the topic: unlabeled test)

**Task `IG-EP-13`** (predict_outcome, difficulty cue 3)

White to move. Black has just played c7-c5. Can white capture the pawn en passant? Predict, then check.

```
  8  . . . R . . . .
  7  . . . . . . . .
  6  . . . . . . . .
  5  . . p P . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  K . P . . . P .
  1  . . . . . . . k
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 3R4/8/8/2pP4/8/8/K1P3P1/7k w - c6 0 1
```

**Accepted answer:** {"outcome": "yes"}

**Explanation shown:** Yes. The enemy pawn has just moved two squares past the pawn on d5, so d5xc6 en passant is legal.

Hints (in order):
1. En passant is only possible right after an enemy pawn has just moved two squares forward past your pawn.
2. Ask yourself: did the pawn beside yours arrive there with a two-square move on the previous turn?
3. If it has been standing there, or got there in any other way, the chance is gone.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] The en passant capture is legal.

### Step 8: item  (shown without telling the learner the topic: unlabeled test)

**Task `IG-EP-15`** (predict_outcome, difficulty cue 3)

Black to move. White has just played c2-c4. Can black capture the pawn en passant? Predict, then check.

```
  1  . . . . r . . .
  2  . . . . . . . .
  3  . . . . . . . .
  4  . . . . p P . .
  5  . . . . . . . .
  6  . . . . . . . .
  7  . p . . . p . k
  8  K . . . . . . .
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: 7K/k1p3p1/8/8/2Pp4/8/8/3r4 b - c3 0 1
```

**Accepted answer:** {"outcome": "yes"}

**Explanation shown:** Yes. The enemy pawn has just moved two squares past the pawn on d4, so d4xc3 en passant is legal.

Hints (in order):
1. En passant is only possible right after an enemy pawn has just moved two squares forward past your pawn.
2. Ask yourself: did the pawn beside yours arrive there with a two-square move on the previous turn?
3. If it has been standing there, or got there in any other way, the chance is gone.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] The en passant capture is legal.

### Step 9: item  (shown without telling the learner the topic: unlabeled test)

**Task `IG-EP-16`** (predict_outcome, difficulty cue 3)

White to move. Black's pawn on e5 has been standing beside white's pawn for several moves; Black's last move was elsewhere. Can white capture it en passant? Predict, then check.

```
  8  . . . . . . . .
  7  . B . . . . . .
  6  . R . . . . . .
  5  . . . P p . . .
  4  . P . . K . . .
  3  . . . . . . . .
  2  k . . . . . . .
  1  . . . . . . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 8/1B6/1R6/3Pp3/1P2K3/8/k7/8 w - - 0 1
```

**Accepted answer:** {"outcome": "no"}

**Explanation shown:** No. En passant is only possible on the move right after the enemy pawn made its two-square move. That chance has passed.

Hints (in order):
1. En passant is only possible right after an enemy pawn has just moved two squares forward past your pawn.
2. Ask yourself: did the pawn beside yours arrive there with a two-square move on the previous turn?
3. If it has been standing there, or got there in any other way, the chance is gone.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [illegal_move] The en passant capture is not available.

### Step 10: practice

A drill of 4 tasks drawn from the bank by tag ['node.FND.ENPASSANT', 'kind.generated'] (21 tasks carry those tags). Not reproduced here; ask for a sample if you want one checked.

### Step 11: reflect

Kind: unsure

Prompt: Think of a game where a pawn of yours stood beside an enemy pawn. How would you check, before moving, that the enemy pawn had just jumped? Write the check as one question.

---

## Reviewer scorecard

Fill in the file `content/review/L-FND-SPECIAL-1.json` (a template is below). Scale 1 to 5 for each dimension: 1 = wrong or unusable, 3 = acceptable with edits, 5 = I would put my name to it as it stands.
Revision to review: `d37ee09c`. If the lesson text changes after your review, your sign-off no longer applies and the lesson goes back to needs-human.

| Dimension | What to judge | Score |
|---|---|---|
| chess | every statement, line and explanation is correct; near-misses are really near-misses | |
| clarity | the explanation actually explains (mechanism, conditions), in plain words | |
| prerequisites | the lesson assumes only what the learner has met | |
| tasks | each task has one defensible answer and a fair explanation | |

```json
{
  "lesson": "L-FND-SPECIAL-1",
  "revision": "d37ee09c",
  "reviewer": "<your name>",
  "reviewer_role": "strong-player",
  "date": "YYYY-MM-DD",
  "scores": {"chess": 0, "clarity": 0, "prerequisites": 0, "tasks": 0},
  "comments": "<what to change, by step number>",
  "verdict": "approved"
}
```

`reviewer_role` is `strong-player` or `teacher`. `verdict` is `approved` or `changes-requested`. See docs/review-slice.md.
