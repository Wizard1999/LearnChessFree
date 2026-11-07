# Review packet: L-FND-CHECK-1

**Check and checkmate: the three ways out**

- Skill: FND.CHECK (D1); stage: S1; stated length: 10 minutes
- Steps: 14 (8 are tasks); revision: `cdbf072c`
- Review status now: needs-human

## What the lesson says the learner will be able to do

- Gets out of check by moving the king, blocking, or capturing the checking piece
- Says 'checkmate' when none of the three ways exists
- Knows a knight's check cannot be blocked

## Sources the author names (check that they are used fairly, in our own words)

- docs/first-hours.md session 2
- docs/council-synthesis.md CD-1
- content/skills/FND.CHECK.json (D1 outcome, conditions, contrasts)

## How to read this packet

Boards are drawn with capitals for White and lower case for Black, rank 8 at the top unless the board is shown from Black's side. Moves in a line are in standard notation. Statements marked [V] were machine-checked, [I] inference, [H] hypothesis, [S] secondary source, [R] recalled. Please judge the explanations, not only the moves: does each sentence tell the learner why?

---

### Step 1: card

When your king is attacked it is in **check**. You must fix it at once, in one of three ways: **move** the king, **block** the attack with a piece, or **capture** the piece that gives check. You may never make a move that leaves your own king in check.

### Step 2: board

Caption: White is in check. The king can step away, the bishop can block, or the rook can capture.

```
  8  R . . . r . . .
  7  . . . . . . . k
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . B . . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  . . . . K . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: R3r3/7k/8/8/2B5/8/8/4K3 w - - 0 1
```

Drawn on the board: arrows e8-e1, a8-e8, c4-e2; highlighted squares e8.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [game_state] (no sentence; a rules check)
- [legal_moves_set] (no sentence; a rules check)

### Step 3: item

**Task `IA0-66`** (select_squares, difficulty cue 1)

White is in check from the black rook. Tap every square the white king can step to, to get out of check.

```
  8  R . . . r . . .
  7  . . . . . . . k
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . B . . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  . . . . K . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: R3r3/7k/8/8/2B5/8/8/4K3 w - - 0 1
```

**Accepted answer:** squares d1, d2, f1, f2 (from e1)

**Explanation shown:** The rook attacks the whole e-file, so the king cannot go to e2. It can step off the file to d1, d2, f1 or f2, where no black piece attacks it.

Hints (in order):
1. The rook attacks every square on its file, all the way down to the king.
2. A king cannot step onto a square the enemy attacks, and moving along the file stays in line with the rook.
3. Step sideways, off the e-file. Check each of the four sideways squares.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [game_state] White is in check.
- [legal_destinations] These are exactly the squares the king can move to.
- [attackers] The rook attacks e2 along the file.

### Step 4: item

**Task `IA0-67`** (find_move, difficulty cue 2)

White is in check. Get out of check without moving the king: block the rook's line or capture it.

```
  8  R . . . r . . .
  7  . . . . . . . k
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . B . . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  . . . . K . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: R3r3/7k/8/8/2B5/8/8/4K3 w - - 0 1
```

**Accepted answer(s):** Rxe8, Be2, Be6

**Explanation shown:** The white rook on a8 can capture the black rook, or the bishop can step in front of the king, on e2 or e6. Any other move leaves the king in check, so it is not allowed.

Hints (in order):
1. There are three ways out of check: move the king, block, or capture the checking piece. You are asked for the other two.
2. Which white piece can reach the e-file between the rooks? Which can take the black rook?
3. The white rook on a8 sees the black rook along the eighth rank, and the bishop can reach e2 or e6.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] The white rook can capture the checking rook.
- [legal_move] The bishop can block on e2.
- [legal_move] The bishop can block on e6.
- [illegal_move] A bishop move that does not stop the check is not allowed.

### Step 5: item

**Task `IA0-68`** (predict_outcome, difficulty cue 3)

A black knight gives check. Can White get out of check by putting a piece between the knight and the king? Predict, then check.

```
  8  . . . . . . . k
  7  . . . . . . . .
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . n . .
  2  . . . . . . P .
  1  . . . Q K . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 7k/8/8/8/8/5n2/6P1/3QK3 w - - 0 1
```

**Accepted answer:** {"outcome": "no"}

**Explanation shown:** A knight jumps straight to its target, so there is no line to block. White's only legal replies are to capture the knight (queen or pawn) or move the king.

Hints (in order):
1. Think about how a knight attacks: does it travel along a line?
2. Look at the list of replies the game allows. Are there any that put a piece between?

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [game_state] White is in check.
- [legal_moves_set] White's only legal moves are two captures of the knight and three king moves.

### Step 6: card

Not every way is always open. A **knight** attacks by jumping, so there is no line to block. If the king has no safe square, nothing can capture the checker and nothing can block, it is **checkmate**: the game ends and the player in check loses. Test all three ways before you say mate.

### Step 7: board

Caption: The rook checks along the back rank (the row where the pieces start). The king's own pawns take away three squares, the rook covers the other two, and nothing can block or capture. Checkmate.

```
  8  . . . R . . k .
  7  . . . . . p p p
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . . P P P
  1  . . . . . . K .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: 3R2k1/5ppp/8/8/8/8/5PPP/6K1 b - - 0 1
```

Drawn on the board: arrows d8-g8; highlighted squares g8, f7, g7, h7.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [game_state] (no sentence; a rules check)

### Step 8: card

**When it holds.** Check is answered by a king move, a block or a capture, never by ignoring it. Blocking works only against a line (rook, bishop, queen) with a square between; a knight check or a pawn check cannot be blocked. A double check (two pieces giving check at once) cannot be fixed by one block or one capture, but you meet that later. *Rule of thumb:* list all three ways before you move; do not assume the king can step away, and do not assume a block exists.

### Step 9: contrast

Title: One pawn, opposite results

Prompt: Same rook check on the back rank. In one position the black pawn stands on f7; in the other it is missing. Predict first: which is checkmate? (The answer list also offers "stalemate", which a later lesson explains; neither position is one.)

**The working board:**

**Task `IA0-70`** (classify_position, difficulty cue 1)

Black to move. Is this check, checkmate, stalemate, or none of these?

```
  1  . K . . . . . .
  2  . . . . . . . .
  3  . . . . . . . .
  4  . . . . . . . .
  5  . . . . . . . .
  6  . . . . . . . .
  7  p p . . . . . .
  8  . k . . . . . R
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: R5k1/6pp/8/8/8/8/8/6K1 b - - 0 1
```

**Accepted answer:** {"class": "check"}

**Explanation shown:** The king is in check, but the pawn that used to stand on f7 is gone, so the king can step to f7. It is check, not checkmate.

Hints (in order):
1. Is Black's king attacked right now?
2. If it is, does the king have any way out?
3. A pawn that is missing from the king's shelter can leave a square free.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [game_state] Black is in check but not checkmated.
- [legal_moves_set] Black has exactly one legal move: Kf7.

**The failing board:**

**Task `IA0-69`** (classify_position, difficulty cue 1)

Black to move. Is this check, checkmate, stalemate, or none of these?

```
  1  . K . . . . . .
  2  . . . . . . . .
  3  . . . . . . . .
  4  . . . . . . . .
  5  . . . . . . . .
  6  . . . . . . . .
  7  p p p . . . . .
  8  . k . . . . . R
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: R5k1/5ppp/8/8/8/8/8/6K1 b - - 0 1
```

**Accepted answer:** {"class": "checkmate"}

**Explanation shown:** The rook attacks the king along the back rank. The king has no safe square (its own pawns block three squares and the rook covers the others), and Black has nothing to block or capture with. That is checkmate.

Hints (in order):
1. Is Black's king attacked right now?
2. If it is, look for a way out: a king move, a block, or a capture.
3. The king's own pawns stand on the three squares in front of it.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [game_state] Black is checkmated.

### Step 10: item  (shown without telling the learner the topic: unlabeled test)

**Task `IBds11-33`** (classify_position, difficulty cue 3)

Black to move. Is it check, checkmate or neither?

```
  1  . . . . . . . .
  2  . . . . . . . .
  3  . . . . . . . .
  4  . . . . . . . .
  5  . . . . . . . .
  6  . K . . . . . .
  7  . Q . . . . . .
  8  k . . . . . . .
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: 7k/6Q1/6K1/8/8/8/8/8 b - - 0 1
```

**Accepted answer:** {"class": "checkmate"}

**Explanation shown:** The queen checks and the white king defends it, so the black king cannot capture; every escape square is covered. Checkmate.

Hints (in order):
1. Is the king attacked right now? If not, the answer is neither.
2. If it is attacked: can the king move, can the checker be captured, can the line be blocked (a knight cannot be blocked)?
3. If none of the three works it is checkmate; if one works it is only check.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [game_state] Black is checkmated.
- [attackers] One white piece attacks the king.

### Step 11: item  (shown without telling the learner the topic: unlabeled test)

**Task `IBds11-32`** (classify_position, difficulty cue 3)

Black to move. Is it check, checkmate or neither?

```
  1  . K . . . . . .
  2  . . . . . . . .
  3  . . . . . . . .
  4  . . . . . . . .
  5  . . . . . . . .
  6  . . . . . . . .
  7  p p N . . . . .
  8  k r . . . . . .
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: 6rk/5Npp/8/8/8/8/8/6K1 b - - 0 1
```

**Accepted answer:** {"class": "checkmate"}

**Explanation shown:** The knight on f7 checks and cannot be blocked; the king's own rook and pawns fill its escape squares, and nothing can capture the knight. Checkmate.

Hints (in order):
1. Is the king attacked right now? If not, the answer is neither.
2. If it is attacked: can the king move, can the checker be captured, can the line be blocked (a knight cannot be blocked)?
3. If none of the three works it is checkmate; if one works it is only check.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [game_state] Black is checkmated.
- [attackers] One white piece attacks the king.

### Step 12: item  (shown without telling the learner the topic: unlabeled test)

**Task `IBds11-30`** (classify_position, difficulty cue 3)

White to move. Is it check, checkmate or neither?

```
  8  . . . . k . . .
  7  . . . . . . . .
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . n . .
  2  . . . . . . . .
  1  . . . . K . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 4k3/8/8/8/8/5n2/8/4K3 w - - 0 1
```

**Accepted answer:** {"class": "check"}

**Explanation shown:** A knight on f3 attacks e1: it is check, and the king can step away, so not checkmate.

Hints (in order):
1. Is the king attacked right now? If not, the answer is neither.
2. If it is attacked: can the king move, can the checker be captured, can the line be blocked (a knight cannot be blocked)?
3. If none of the three works it is checkmate; if one works it is only check.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [game_state] White is in check, not checkmate.
- [attackers] One black piece attacks the king.

### Step 13: practice  (shown without telling the learner the topic: unlabeled test)

A drill of 4 tasks drawn from the bank by tag ['node.FND.CHECK', 'kind.generated', 'family.FAM-GEN-STATE-03'] (4 tasks carry those tags). Not reproduced here; ask for a sample if you want one checked.

### Step 14: reflect

Kind: confidence

Prompt: In the last questions, which one did you answer by looking for the attacker first, and which by looking at the king's squares first? Rate how sure you were. (low / medium / high)

---

## Reviewer scorecard

Fill in the file `content/review/L-FND-CHECK-1.json` (a template is below). Scale 1 to 5 for each dimension: 1 = wrong or unusable, 3 = acceptable with edits, 5 = I would put my name to it as it stands.
Revision to review: `cdbf072c`. If the lesson text changes after your review, your sign-off no longer applies and the lesson goes back to needs-human.

| Dimension | What to judge | Score |
|---|---|---|
| chess | every statement, line and explanation is correct; near-misses are really near-misses | |
| clarity | the explanation actually explains (mechanism, conditions), in plain words | |
| prerequisites | the lesson assumes only what the learner has met | |
| tasks | each task has one defensible answer and a fair explanation | |

```json
{
  "lesson": "L-FND-CHECK-1",
  "revision": "cdbf072c",
  "reviewer": "<your name>",
  "reviewer_role": "strong-player",
  "date": "YYYY-MM-DD",
  "scores": {"chess": 0, "clarity": 0, "prerequisites": 0, "tasks": 0},
  "comments": "<what to change, by step number>",
  "verdict": "approved"
}
```

`reviewer_role` is `strong-player` or `teacher`. `verdict` is `approved` or `changes-requested`. See docs/review-slice.md.
