# Review packet: L-FND-MATE1-1

**Checkmate in one: four patterns**

- Skill: FND.MATE1 (D1); stage: S2; stated length: 11 minutes
- Steps: 15 (9 are tasks); revision: `0f543666`
- Review status now: needs-human

## What the lesson says the learner will be able to do

- Finds a checkmate in one in the common patterns: back rank, queen next to the king, two rooks, queen with a bishop, knight
- Checks every exit before calling a check checkmate
- Says 'no mate' when there is none

## Sources the author names (check that they are used fairly, in our own words)

- docs/first-hours.md session 2
- docs/council-synthesis.md CD-1
- sources/sheets/capablanca_chess-fundamentals.md (CI-27 mating types around the castled king; held as pattern families)

## How to read this packet

Boards are drawn with capitals for White and lower case for Black, rank 8 at the top unless the board is shown from Black's side. Moves in a line are in standard notation. Statements marked [V] were machine-checked, [I] inference, [H] hypothesis, [S] secondary source, [R] recalled. Please judge the explanations, not only the moves: does each sentence tell the learner why?

---

### Step 1: card

**Checkmate** means the king is attacked and cannot escape: there is no safe square, nothing that can capture the attacker, and no way to block it. A **mate in one** does all of that with one move. A few shapes appear again and again. The first is the **back-rank mate**.

### Step 2: board

Caption: The rook checks along the back rank. The king's own pawns block its escape.

```
  8  . . . . . . k .
  7  . . . . . p p p
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  R . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 6k1/5ppp/8/8/8/8/8/R5K1 w - - 0 1
```

The line, with the sentence the learner sees at each move:
1. **1. Ra8#**: The rook slides to the eighth rank. It is checkmate.

```
  8  R . . . . . k .
  7  . . . . . p p p
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  . . . . . . K .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: R5k1/5ppp/8/8/8/8/8/6K1 b - - 1 1
```

Drawn on the board: arrows a1-a8, a8-g8; highlighted squares f7, g7, h7.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [mate_in] (no sentence; a rules check)

### Step 3: item

**Task `IA0-114`** (find_move, difficulty cue 1)

White to move. Find checkmate in one.

```
  8  . . . . . . k .
  7  . . . . . p p p
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  R . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 6k1/5ppp/8/8/8/8/8/R5K1 w - - 0 1
```

**Accepted answer(s):** Ra8#

**Explanation shown:** The rook checks along the eighth rank. The king's own pawns block f7, g7 and h7, and the rook already covers f8 and h8. Checkmate.

Hints (in order):
1. The black king is on the back rank. What stands in front of it?
2. Which square on the back rank can your rook reach?
3. Slide the rook to the eighth rank.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [mate_in] Ra8 is checkmate.

### Step 4: card

Before you call a check mate, check every exit: can the king step anywhere, can the checking piece be captured, can the check be blocked? A back-rank mate needs the king's own pawns to stand in front of it, with no square for the king to run to.

### Step 5: contrast

Title: Same rook, one pawn moved

Prompt: Black's h-pawn stands on h6 instead of h7. Predict first: is there still a mate in one?

**The working board:**

**Task `IA0-115`** (find_move, difficulty cue 1)

White to move. Find checkmate in one.

```
  8  . k . . . . . .
  7  p p p . . . . .
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  K . . . . . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 1k6/ppp5/8/8/8/8/8/K6R w - - 0 1
```

**Accepted answer(s):** Rh8#

**Explanation shown:** The same pattern on the other side: the king's three pawns block its escape, and the rook checks along the eighth rank. Checkmate.

Hints (in order):
1. Where is Black's king? Which pieces box it in?
2. Which square on the back rank can your rook reach?

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [mate_in] Rh8 is checkmate.

**The failing board:**

**Task `IA0-116`** (predict_outcome, difficulty cue 3)

The h-pawn has moved to h6. Is there a checkmate in one for White? Predict, then check.

```
  8  . . . . . . k .
  7  . . . . . p p .
  6  . . . . . . . p
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  R . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 6k1/5pp1/7p/8/8/8/8/R5K1 w - - 0 1
```

**Accepted answer:** {"outcome": "no"}

**Explanation shown:** Ra8 gives check, but the pawn on h6 left the king a square to run to, h7. A mate needs the king to have no way out, and here the engine finds no forced mate at all.

Hints (in order):
1. Does the black king have a square to run to now?
2. Try Ra8+ in your head: where does the king go?

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [eval_range] The engine finds no forced mate here.
- [legal_move] Ra8 is check, but not mate.

### Step 6: board

Caption: After Ra8+ the king simply steps to h7. A pawn move gave it a square to run to.

```
  8  R . . . . . k .
  7  . . . . . p p .
  6  . . . . . . . p
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  . . . . . . K .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: R5k1/5pp1/7p/8/8/8/8/6K1 b - - 0 1
```

The line, with the sentence the learner sees at each move:
1. **1... Kh7**: The king escapes to h7. It was check, not checkmate.

```
  8  R . . . . . . .
  7  . . . . . p p k
  6  . . . . . . . p
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: R7/5ppk/7p/8/8/8/8/6K1 w - - 1 2
```

Drawn on the board: arrows g8-h7; highlighted squares h7.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [game_state] (no sentence; a rules check)
- [legal_destinations] (no sentence; a rules check)

### Step 7: card

Three more shapes. A **queen next to the king** is safe when your own king or another piece protects her. **Two rooks** can take turns: one holds a rank, the other gives check. A **knight's check** cannot be blocked, so it mates a king that has no square.

### Step 8: item

**Task `IA0-117`** (find_move, difficulty cue 1)

White to move. Find checkmate in one.

```
  8  . . . . . . . k
  7  Q . . . . . . .
  6  . . . . . . K .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  . . . . . . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 7k/Q7/6K1/8/8/8/8/8 w - - 0 1
```

**Accepted answer(s):** Qg7#, Qh7#, Qa8#, Qb8#

**Explanation shown:** Qg7 and Qh7 stand right next to the king but the white king protects both squares, so Black cannot capture. Qa8 and Qb8 check along the back rank while the white king covers g7 and h7. All four are checkmate.

Hints (in order):
1. Which squares around Black's king does your king already cover?
2. A queen next to the king is only safe if your own piece protects her. Which squares are protected by your king?
3. Four queen moves give mate. Two of them land next to the king.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [mate_in] Qg7 is checkmate.
- [mate_in] Qh7 is checkmate.
- [mate_in] Qa8 is checkmate.
- [mate_in] Qb8 is checkmate.

### Step 9: item

**Task `IA0-118`** (find_move, difficulty cue 2)

White to move. Find checkmate in one.

```
  8  . . . . . . . k
  7  . R . . . . . .
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  R . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 7k/1R6/8/8/8/8/8/R5K1 w - - 0 1
```

**Accepted answer(s):** Ra8#

**Explanation shown:** The rook on b7 keeps the king off the seventh rank. The second rook gives check on the eighth. The king has no square: checkmate.

Hints (in order):
1. One rook already holds a whole rank. Which one?
2. Use the other rook to give check on the back rank.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [mate_in] Ra8 is checkmate.

### Step 10: item

**Task `IG-MATE1-1`** (find_move, difficulty cue 1)

White to move. Find checkmate in one.

```
  8  k . . . . . . .
  7  p p . . . . . .
  6  . . . . . . . .
  5  . . . . . . . K
  4  . . . . . R . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  . . . . . . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: k7/pp6/8/7K/5R2/8/8/8 w - - 0 1
```

**Accepted answer(s):** Rf8#

**Explanation shown:** Rf8# is checkmate: it gives check and the king has no legal reply.

Hints (in order):
1. Look at the enemy king. Which squares could it flee to, and which of them are already blocked or covered?
2. You need a check that leaves the king with no square, no capture of the checking piece, and no block.
3. Try each check in turn. For each one ask: can the king step away, can the checker be taken, can anything block?

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [mate_in] Rf8# is checkmate.

### Step 11: item

**Task `IA0-120`** (find_move, difficulty cue 3)

White to move. Is there a checkmate in one? If so, play it.

```
  8  . . . . . . r k
  7  . . . . . . p p
  6  . . . . . . . .
  5  . . . . N . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 6rk/6pp/8/4N3/8/8/8/6K1 w - - 0 1
```

**Accepted answer(s):** Nf7#

**Explanation shown:** The knight on f7 attacks the king on h8. The king's own rook and pawns fill every square around it, so the king has no move, and nothing can capture the knight. Checkmate.

Hints (in order):
1. Look at the black king's squares. Who occupies them?
2. A knight's check cannot be blocked. Could the king capture the knight on f7?

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [mate_in] Nf7 is checkmate.

### Step 12: item

**Task `IA0-121`** (find_move, difficulty cue 3)

White to move. Is there a checkmate in one? If so, play it.

```
  8  . . . . . . k .
  7  . . . . . p p p
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  . . . Q . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 6k1/5ppp/8/8/8/8/8/3Q2K1 w - - 0 1
```

**Accepted answer(s):** Qd8#

**Explanation shown:** The queen slides up the open d-file to d8 and checks along the back rank. The pawns in front of the king block its escape: checkmate.

Hints (in order):
1. Where is Black's king and what protects it?
2. Can your queen reach the back rank?

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [mate_in] Qd8 is checkmate.

### Step 13: item

**Task `IA0-122`** (predict_outcome, difficulty cue 3)

White to move. Is there a checkmate in one? Predict, then check.

```
  8  r . b q k . . r
  7  p p p p . p p p
  6  . . n . . n . .
  5  . . b . p . . .
  4  . . B . P . . .
  3  . . N . . N . .
  2  P P P P . P P P
  1  R . B Q K . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 6 5
```

**Accepted answer:** {"outcome": "no"}

**Explanation shown:** Most pieces are still at home and Black's king has plenty of cover. The engine sees the game as roughly level, so there is no forced mate.

Hints (in order):
1. Are any of Black's pieces missing from near its king?
2. Which of your pieces can even give check?

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [eval_range] The engine sees the position as roughly level, so there is no forced mate.

### Step 14: practice

A drill of 8 tasks drawn from the bank by tag ['node.FND.MATE1', 'kind.generated'] (140 tasks carry those tags). Not reproduced here; ask for a sample if you want one checked.

### Step 15: reflect

Kind: confidence

Prompt: In the last three questions, which escape square did you check last: a king move, a capture or a block? Name one answer where you did not check it. Rate how sure you were. (low / medium / high)

---

## Reviewer scorecard

Fill in the file `content/review/L-FND-MATE1-1.json` (a template is below). Scale 1 to 5 for each dimension: 1 = wrong or unusable, 3 = acceptable with edits, 5 = I would put my name to it as it stands.
Revision to review: `0f543666`. If the lesson text changes after your review, your sign-off no longer applies and the lesson goes back to needs-human.

| Dimension | What to judge | Score |
|---|---|---|
| chess | every statement, line and explanation is correct; near-misses are really near-misses | |
| clarity | the explanation actually explains (mechanism, conditions), in plain words | |
| prerequisites | the lesson assumes only what the learner has met | |
| tasks | each task has one defensible answer and a fair explanation | |

```json
{
  "lesson": "L-FND-MATE1-1",
  "revision": "0f543666",
  "reviewer": "<your name>",
  "reviewer_role": "strong-player",
  "date": "YYYY-MM-DD",
  "scores": {"chess": 0, "clarity": 0, "prerequisites": 0, "tasks": 0},
  "comments": "<what to change, by step number>",
  "verdict": "approved"
}
```

`reviewer_role` is `strong-player` or `teacher`. `verdict` is `approved` or `changes-requested`. See docs/review-slice.md.
