# Review packet: L-FND-STALEMATE-1

**Stalemate: no move, but no check**

- Skill: FND.STALEMATE (D1); stage: S1; stated length: 9 minutes
- Steps: 12 (8 are tasks); revision: `6ca2aba6`
- Review status now: needs-human

## What the lesson says the learner will be able to do

- Says stalemate when the side to move has no legal move and is not in check
- Tells checkmate from stalemate
- Notices before moving when a move would stalemate the enemy king

## Sources the author names (check that they are used fairly, in our own words)

- docs/first-hours.md session 2
- sources/sheets/capablanca_chess-fundamentals.md (stalemate care in the elementary mates)
- content/skills/FND.STALEMATE.json (D1 outcome, conditions, contrasts)

## How to read this packet

Boards are drawn with capitals for White and lower case for Black, rank 8 at the top unless the board is shown from Black's side. Moves in a line are in standard notation. Statements marked [V] were machine-checked, [I] inference, [H] hypothesis, [S] secondary source, [R] recalled. Please judge the explanations, not only the moves: does each sentence tell the learner why?

---

### Step 1: card

You know checkmate: the king is in check and has no way out. **Stalemate** is the lookalike: the player to move is **not** in check but has **no legal move at all**. The game is a **draw**, not a win for the side that moved last. One question separates them: is the king attacked right now?

### Step 2: board

Caption: Black to move. The king is not attacked, but every square it could use is covered by the queen or the white king. No legal move: stalemate, a draw.

```
  8  k . . . . . . .
  7  . . Q . . . . .
  6  . K . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  . . . . . . . .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: k7/2Q5/1K6/8/8/8/8/8 b - - 0 1
```

Drawn on the board: arrows c7-b8, c7-a7; highlighted squares a7, b7, b8.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [game_state] (no sentence; a rules check)

### Step 3: item

**Task `IB1-027`** (classify_position, difficulty cue 1)

Black to move. What is the result of this position?

```
  1  . . . . . . . .
  2  . . . . . . . .
  3  . . . . . . . .
  4  . . . . . . . .
  5  . . . . . . . .
  6  . . . Q . . . .
  7  K . . . . . . .
  8  . . k . . . . .
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: 5k2/7K/4Q3/8/8/8/8/8 b - - 0 2
```

**Accepted answer:** {"class": "Stalemate"}

**Explanation shown:** The player to move is not in check and has no legal move, so the game is a draw by stalemate.

Hints (in order):
1. Is the king in check?
2. List the squares the king could go to. Which of them are attacked?

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [game_state] The side to move is not in check and has no legal move: stalemate.
- [legal_moves_set] The side to move has no legal move.
- [tablebase] The tablebase gives a draw.

### Step 4: card

**When it holds.** Stalemate needs both facts: no check, and no legal move, for any piece. A king boxed in may still be free if another of its side's pieces can move. A big material lead does not prevent it: the stronger side is the one who must avoid it. *Rule of thumb:* before a quiet move near the enemy king, count its legal moves, and count the legal moves of its other pieces too.

### Step 5: item

**Task `ISsp5-1`** (classify_position, difficulty cue 1)

Black to move. What is the result of this position?

```
  1  . . . . . . . .
  2  . . . . . . . .
  3  . . . . . . . .
  4  . . . . . . . .
  5  p . . . . . . .
  6  . . . . . . K .
  7  . . . . . Q . .
  8  . . . . . . . k
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: k7/2Q5/1K6/7p/8/8/8/8 b - - 0 1
```

**Accepted answer:** {"class": "The game goes on"}

**Explanation shown:** The king has no safe square and is not in check, but the pawn on h5 can still move to h4. A side is stalemated only when no piece of it can move, so the game goes on.

Hints (in order):
1. Is the king attacked right now?
2. The king may have no safe square. Does any other black piece have a legal move?

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [game_state] Black is not in check and has a legal move.
- [legal_moves_set] These are all of Black's legal moves.

### Step 6: contrast

Title: One square, opposite results

Prompt: The white queen moves from f8 to f7, one square down. Predict first: is the result still checkmate?

**The working board:**

**Task `IA0-71`** (classify_position, difficulty cue 1)

Black to move. Is this check, checkmate, stalemate, or none of these?

```
  1  . . . . . . . .
  2  . . . . . . . .
  3  . . . . . . . .
  4  . . . . . . . .
  5  . . . . . . . .
  6  . K . . . . . .
  7  . . . . . . . .
  8  k . Q . . . . .
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: 5Q1k/8/6K1/8/8/8/8/8 b - - 0 1
```

**Accepted answer:** {"class": "checkmate"}

**Explanation shown:** The queen attacks the king along the eighth rank. The white king covers g7 and h7, and the queen covers g8, so there is nowhere to go and nothing to capture or block. Checkmate.

Hints (in order):
1. Is Black's king attacked right now?
2. The white queen is on the eighth rank, the same rank as the king.
3. Which squares could the king step to? Check the white king as well as the queen.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [game_state] Black is checkmated.
- [legal_moves_set] Black has no legal moves.

**The failing board:**

**Task `IA0-72`** (classify_position, difficulty cue 3)

Black to move. The queen is one square lower than before. Is this check, checkmate, stalemate, or none of these?

```
  1  . . . . . . . .
  2  . . . . . . . .
  3  . . . . . . . .
  4  . . . . . . . .
  5  . . . . . . . .
  6  . K . . . . . .
  7  . . Q . . . . .
  8  k . . . . . . .
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: 7k/5Q2/6K1/8/8/8/8/8 b - - 0 1
```

**Accepted answer:** {"class": "stalemate"}

**Explanation shown:** Black is not in check, because the queen on f7 does not attack h8, but every square the king could go to is covered. A player with no legal move who is not in check is stalemated: the game is a draw.

Hints (in order):
1. Is Black's king attacked right now?
2. Count the squares the king could move to. Are any safe?
3. Black's king has no safe square, and it is not attacked.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [game_state] Black is stalemated.
- [legal_moves_set] Black has no legal moves.

### Step 7: item

**Task `IA0-73`** (find_move, difficulty cue 3)

White to move. Find checkmate. Be careful: some queen moves leave Black with no move at all.

```
  8  . . . . . . . k
  7  . . . . . . . .
  6  . . . . . . K .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  . . . . . Q . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 7k/8/6K1/8/8/8/8/5Q2 w - - 0 1
```

**Accepted answer(s):** Qf8#

Feedback shown for wrong moves:
- Qf7: Stalemate: Black has no legal move and is not in check, so the game is a draw (see the previous pair of positions).

**Explanation shown:** Qf8 gives check along the eighth rank, and the king has no square: checkmate. Qf7 (and Qc4) take away the king's last squares without giving check, and that is stalemate: a draw instead of a win.

Hints (in order):
1. Where is Black's king? Which squares around it does White's king already cover?
2. You want to give check, and leave the king no square. Beware of quiet moves that take away its last square without giving check.
3. The queen belongs on the eighth rank.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [mate_in] Qf8 is checkmate.
- [move_loses] Qf7 throws away the win.
- [move_loses] Qc4 throws away the win.

### Step 8: item  (shown without telling the learner the topic: unlabeled test)

**Task `IB1-031`** (classify_position, difficulty cue 1)

Black to move. What is the result of this position?

```
  1  . . k . . . . .
  2  K . . . . . . .
  3  . . . Q . . . .
  4  . . . . . . . .
  5  . . . . . . . .
  6  . . . . . . . .
  7  . . . . . . . .
  8  . . . . . . . .
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: 8/8/8/8/8/4Q3/7K/5k2 b - - 0 2
```

**Accepted answer:** {"class": "Stalemate"}

**Explanation shown:** The player to move is not in check and has no legal move, so the game is a draw by stalemate.

Hints (in order):
1. Is the king in check?
2. List the squares the king could go to. Which of them are attacked?

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [game_state] The side to move is not in check and has no legal move: stalemate.
- [legal_moves_set] The side to move has no legal move.
- [tablebase] The tablebase gives a draw.

### Step 9: item  (shown without telling the learner the topic: unlabeled test)

**Task `IA0-75`** (classify_position, difficulty cue 3)

Black to move. Is this check, checkmate, stalemate, or none of these?

```
  1  . . . . . . . .
  2  . . . . . . . .
  3  . . . . . . . .
  4  . . . . . . . .
  5  . . . . . . . .
  6  . . . . . . K .
  7  . . . . . . Q .
  8  . . . . . . . k
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: k7/1Q6/1K6/8/8/8/8/8 b - - 0 1
```

**Accepted answer:** {"class": "checkmate"}

**Explanation shown:** The queen attacks the king and the white king protects the queen, so the black king cannot capture her. It has no other square: checkmate.

Hints (in order):
1. Is the black king attacked?
2. Could the king take the queen? Look at what protects her.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [game_state] Black is checkmated.

### Step 10: item  (shown without telling the learner the topic: unlabeled test)

**Task `ISsp5-2`** (classify_position, difficulty cue 3)

Black to move. What is the result of this position?

```
  1  . . . . . . . n
  2  . . . . . . . .
  3  . . . . . . . .
  4  . . . . . . . .
  5  . . . . . . . .
  6  . K . . . . . .
  7  . . Q . . . . .
  8  k . . . . . . .
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: 7k/5Q2/6K1/8/8/8/8/n7 b - - 0 1
```

**Accepted answer:** {"class": "The game goes on"}

**Explanation shown:** The king on h8 has no safe square and is not attacked, but the knight on a1 can move to b3 or c2. Black has a legal move, so the game goes on.

Hints (in order):
1. Is the king attacked right now?
2. The king may have no safe square. Does any other black piece have a legal move?

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [game_state] Black is not in check and has a legal move.
- [legal_moves_set] These are all of Black's legal moves.

### Step 11: practice  (shown without telling the learner the topic: unlabeled test)

A drill of 6 tasks drawn from the bank by tag ['node.FND.STALEMATE', 'kind.generated'] (104 tasks carry those tags). Not reproduced here; ask for a sample if you want one checked.

### Step 12: reflect

Kind: confidence

Prompt: In the last questions, which position made you stop and count the king's moves? Which one did you answer without counting? Rate how sure you were. (low / medium / high)

---

## Reviewer scorecard

Fill in the file `content/review/L-FND-STALEMATE-1.json` (a template is below). Scale 1 to 5 for each dimension: 1 = wrong or unusable, 3 = acceptable with edits, 5 = I would put my name to it as it stands.
Revision to review: `6ca2aba6`. If the lesson text changes after your review, your sign-off no longer applies and the lesson goes back to needs-human.

| Dimension | What to judge | Score |
|---|---|---|
| chess | every statement, line and explanation is correct; near-misses are really near-misses | |
| clarity | the explanation actually explains (mechanism, conditions), in plain words | |
| prerequisites | the lesson assumes only what the learner has met | |
| tasks | each task has one defensible answer and a fair explanation | |

```json
{
  "lesson": "L-FND-STALEMATE-1",
  "revision": "6ca2aba6",
  "reviewer": "<your name>",
  "reviewer_role": "strong-player",
  "date": "YYYY-MM-DD",
  "scores": {"chess": 0, "clarity": 0, "prerequisites": 0, "tasks": 0},
  "comments": "<what to change, by step number>",
  "verdict": "approved"
}
```

`reviewer_role` is `strong-player` or `teacher`. `verdict` is `approved` or `changes-requested`. See docs/review-slice.md.
