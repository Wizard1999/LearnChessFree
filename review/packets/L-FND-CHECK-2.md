# Review packet: L-FND-CHECK-2

**Check, checkmate or neither?**

- Skill: FND.CHECK (D2); stage: S2; stated length: 11 minutes
- Steps: 14 (10 are tasks); revision: `48ac3b86`
- Review status now: needs-human

## What the lesson says the learner will be able to do

- Says for each position whether the side to move is in check, checkmate or neither
- Closes the three ways out in order before calling checkmate
- Does not call a blocked line a check

## Sources the author names (check that they are used fairly, in our own words)

- content/skills/FND.CHECK.json (D2 outcome)
- content/lessons/L-FND-CHECK-1.json (taught there, not repeated)
- items IBds11-22..31, 34, 35 (claims checked by tools/validate.py)

## How to read this packet

Boards are drawn with capitals for White and lower case for Black, rank 8 at the top unless the board is shown from Black's side. Moves in a line are in standard notation. Statements marked [V] were machine-checked, [I] inference, [H] hypothesis, [S] secondary source, [R] recalled. Please judge the explanations, not only the moves: does each sentence tell the learner why?

---

### Step 1: card

In **Check and checkmate: the three ways out** you found the way out of check. Now classify any position fast. First ask: is the king attacked right now? If not, it is **neither**. If it is, look for the three ways out: capture the checking piece, block the line, move the king. A knight check cannot be blocked. No way out at all is **checkmate**; any way out means only check.

### Step 2: board

Caption: The queen checks along h5-e8. Black has exactly one legal move: a pawn blocks on g6.

```
  8  r n b q k b n r
  7  p p p p p . p p
  6  . . . . . . . .
  5  . . . . . p . Q
  4  . . . . P . . .
  3  . . . . . . . .
  2  P P P P . P P P
  1  R N B . K B N R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: rnbqkbnr/ppppp1pp/8/5p1Q/4P3/8/PPPP1PPP/RNB1KBNR b KQkq - 1 2
```

The line, with the sentence the learner sees at each move:
1. **2... g6**: The pawn blocks the queen's line. Blocking is one of the three ways out.

```
  8  r n b q k b n r
  7  p p p p p . . p
  6  . . . . . . p .
  5  . . . . . p . Q
  4  . . . . P . . .
  3  . . . . . . . .
  2  P P P P . P P P
  1  R N B . K B N R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: rnbqkbnr/ppppp2p/6p1/5p1Q/4P3/8/PPPP1PPP/RNB1KBNR w KQkq - 0 3
```

Drawn on the board: arrows h5-e8; highlighted squares e8, g6.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [game_state] (no sentence; a rules check)
- [legal_moves_set] (no sentence; a rules check)

### Step 3: item

**Task `IBds11-22`** (classify_position, difficulty cue 1)

Black to move. Is it check, checkmate or neither?

```
  1  . . . K . . . .
  2  . . . R . . . .
  3  . . . . . . . .
  4  . . . . . . . .
  5  . . . . . . . .
  6  . . . . . . . .
  7  . . . . . . . .
  8  . . . k . . . .
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: 4k3/8/8/8/8/8/4R3/4K3 b - - 0 1
```

**Accepted answer:** {"class": "check"}

**Explanation shown:** The rook attacks the king along the e-file, and the king has squares to step to (d8, f8, d7, f7), so it is check, not checkmate.

Hints (in order):
1. Is the king attacked right now? If not, the answer is neither.
2. If it is attacked: can the king move, can the checker be captured, can the line be blocked (a knight cannot be blocked)?
3. If none of the three works it is checkmate; if one works it is only check.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [game_state] Black is in check, not checkmate.
- [attackers] One white piece attacks the king.

### Step 4: card

The order matters. First find the checker: a line with a piece in the way is not an attack, so an enemy rook behind a pawn gives no check. Pawn and knight checks cannot be blocked. Then ask: can it be captured? can it be blocked? Last, count the king's free squares. Checkmate needs all three closed at once: one free capture, block or square makes it only check. This is a rule of thumb for speed.

### Step 5: contrast

Title: One pawn changes the answer

Prompt: The rook checks along the back rank. Predict first: checkmate, check or neither with the pawns as shown, with one pawn moved, and with a far-away bishop added?

**The working board:**

**Task `IBds11-23`** (classify_position, difficulty cue 2)

Black to move. Is it check, checkmate or neither?

```
  1  . . . K . . . .
  2  . . . . . . . .
  3  . . . . . . . .
  4  . . . . . . . .
  5  . . . . . . . .
  6  . . . . . . . .
  7  p p p . . . . .
  8  . k . . . . . R
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: R5k1/5ppp/8/8/8/8/8/4K3 b - - 0 1
```

**Accepted answer:** {"class": "checkmate"}

**Explanation shown:** The rook checks along the eighth rank; the king's own pawns cover its escape squares, nothing can capture the rook, and nothing can block. Checkmate.

Hints (in order):
1. Is the king attacked right now? If not, the answer is neither.
2. If it is attacked: can the king move, can the checker be captured, can the line be blocked (a knight cannot be blocked)?
3. If none of the three works it is checkmate; if one works it is only check.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [game_state] Black is checkmated.
- [attackers] One white piece attacks the king.

**The failing board:**

**Task `IBds11-24`** (classify_position, difficulty cue 2)

Black to move. Is it check, checkmate or neither?

```
  1  . . . K . . . .
  2  . . . . . . . .
  3  . . . . . . . .
  4  . . . . . . . .
  5  . . . . . . . .
  6  p . . . . . . .
  7  . p p . . . . .
  8  . k . . . . . R
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: R5k1/5pp1/7p/8/8/8/8/4K3 b - - 0 1
```

**Accepted answer:** {"class": "check"}

**Explanation shown:** Moving one pawn from h7 to h6 gives the king the square h7. The rook still checks, but there is a way out, so it is only check.

Hints (in order):
1. Is the king attacked right now? If not, the answer is neither.
2. If it is attacked: can the king move, can the checker be captured, can the line be blocked (a knight cannot be blocked)?
3. If none of the three works it is checkmate; if one works it is only check.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [game_state] Black is in check, not checkmate.
- [attackers] One white piece attacks the king.

**The irrelevant board:**

**Task `IBds11-25`** (classify_position, difficulty cue 2)

Black to move. Is it check, checkmate or neither?

```
  1  . . . K . . . .
  2  . B . . . . . .
  3  . . . . . . . .
  4  . . . . . . . .
  5  . . . . . . . .
  6  . . . . . . . .
  7  p p p . . . . .
  8  . k . . . . . R
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: R5k1/5ppp/8/8/8/8/6B1/4K3 b - - 0 1
```

**Accepted answer:** {"class": "checkmate"}

**Explanation shown:** A white bishop on g2 attacks none of the escape squares or the rook's line, so it changes nothing: still checkmate.

Hints (in order):
1. Is the king attacked right now? If not, the answer is neither.
2. If it is attacked: can the king move, can the checker be captured, can the line be blocked (a knight cannot be blocked)?
3. If none of the three works it is checkmate; if one works it is only check.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [game_state] Black is checkmated.
- [attackers] One white piece attacks the king.

### Step 6: item  (shown without telling the learner the topic: unlabeled test)

**Task `IBds11-26`** (classify_position, difficulty cue 3)

Black to move. Is it check, checkmate or neither?

```
  1  . . . K . . . .
  2  . . . R . . . .
  3  . . . . . . . .
  4  . . . . . . . .
  5  . . . . . . . .
  6  . . . . . . . .
  7  . . . p . . . .
  8  . . . k . . . .
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: 4k3/4p3/8/8/8/8/4R3/4K3 b - - 0 1
```

**Accepted answer:** {"class": "neither"}

**Explanation shown:** The black pawn on e7 stands between the rook and the king, so the rook does not attack the king. Not in check, and Black has legal moves.

Hints (in order):
1. Is the king attacked right now? If not, the answer is neither.
2. If it is attacked: can the king move, can the checker be captured, can the line be blocked (a knight cannot be blocked)?
3. If none of the three works it is checkmate; if one works it is only check.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [game_state] Black is not in check and has a legal move.
- [attackers] No white piece attacks the king.

### Step 7: item  (shown without telling the learner the topic: unlabeled test)

**Task `IBds11-27`** (classify_position, difficulty cue 3)

Black to move. Is it check, checkmate or neither?

```
  1  R N . K . B N R
  2  P P P . P P P P
  3  . . . . . . . .
  4  . . . P . B . .
  5  . . . p . . . .
  6  . . n . . n . .
  7  p p Q . p p p p
  8  r . b k q b . r
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: r1bqkb1r/pppp1Qpp/2n2n2/4p3/2B1P3/8/PPPP1PPP/RNB1K1NR b KQkq - 0 4
```

**Accepted answer:** {"class": "checkmate"}

**Explanation shown:** The queen on f7 checks and is defended by the bishop on c4, so the king cannot take it; every other escape is covered or occupied. Checkmate.

Hints (in order):
1. Is the king attacked right now? If not, the answer is neither.
2. If it is attacked: can the king move, can the checker be captured, can the line be blocked (a knight cannot be blocked)?
3. If none of the three works it is checkmate; if one works it is only check.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [game_state] Black is checkmated.
- [attackers] One white piece attacks the king.

### Step 8: item  (shown without telling the learner the topic: unlabeled test)

**Task `IBds11-28`** (classify_position, difficulty cue 3)

Black to move. Is it check, checkmate or neither?

```
  1  . . . K . . . .
  2  . . . . . . . .
  3  . . . . . . . .
  4  . . . . . . . .
  5  . . . . . . . .
  6  . . . . N . . .
  7  . . . . . . . .
  8  . . . k . . . .
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: 4k3/8/3N4/8/8/8/8/4K3 b - - 0 1
```

**Accepted answer:** {"class": "check"}

**Explanation shown:** The knight on d6 attacks e8. A knight check cannot be blocked, but here the king can step away, so it is check, not checkmate.

Hints (in order):
1. Is the king attacked right now? If not, the answer is neither.
2. If it is attacked: can the king move, can the checker be captured, can the line be blocked (a knight cannot be blocked)?
3. If none of the three works it is checkmate; if one works it is only check.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [game_state] Black is in check, not checkmate.
- [attackers] One white piece attacks the king.

### Step 9: item  (shown without telling the learner the topic: unlabeled test)

**Task `IBds11-29`** (classify_position, difficulty cue 3)

White to move. Is it check, checkmate or neither?

```
  8  . . . . k . . .
  7  . . . . . . . .
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . p . . . .
  1  . . . . K . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 4k3/8/8/8/8/8/3p4/4K3 w - - 0 1
```

**Accepted answer:** {"class": "check"}

**Explanation shown:** The black pawn on d2 attacks e1 diagonally. The king can capture it or step away, so it is check.

Hints (in order):
1. Is the king attacked right now? If not, the answer is neither.
2. If it is attacked: can the king move, can the checker be captured, can the line be blocked (a knight cannot be blocked)?
3. If none of the three works it is checkmate; if one works it is only check.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [game_state] White is in check, not checkmate.
- [attackers] One black piece attacks the king.

### Step 10: item  (shown without telling the learner the topic: unlabeled test)

**Task `IBds11-31`** (classify_position, difficulty cue 3)

White to move. Is it check, checkmate or neither?

```
  8  . . . . k . . .
  7  . . . . . . . .
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . . n . .
  1  . . . . K . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 4k3/8/8/8/8/8/5n2/4K3 w - - 0 1
```

**Accepted answer:** {"class": "neither"}

**Explanation shown:** The knight on f2 stands next to the king but does not attack e1. Not in check.

Hints (in order):
1. Is the king attacked right now? If not, the answer is neither.
2. If it is attacked: can the king move, can the checker be captured, can the line be blocked (a knight cannot be blocked)?
3. If none of the three works it is checkmate; if one works it is only check.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [game_state] White is not in check and has a legal move.
- [attackers] No black piece attacks the king.

### Step 11: item  (shown without telling the learner the topic: unlabeled test)

**Task `IBds11-34`** (classify_position, difficulty cue 3)

Black to move. Is it check, checkmate or neither?

```
  1  . K . . . . . .
  2  . . . . . . . P
  3  . . . . . . . .
  4  . . . . . . . .
  5  . . . . . . . .
  6  . . . . . . . .
  7  p p N . . . . .
  8  k r . . . . . .
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: 6rk/5Npp/8/8/8/8/P7/6K1 b - - 0 1
```

**Accepted answer:** {"class": "checkmate"}

**Explanation shown:** The knight on f7 checks and cannot be blocked; the king's own rook and pawns fill its escape squares, and nothing can capture the knight. The white pawn on a2 is far away and changes nothing. Checkmate.

Hints (in order):
1. Is the king attacked right now? If not, the answer is neither.
2. If it is attacked: can the king move, can the checker be captured, can the line be blocked (a knight cannot be blocked)?
3. If none of the three works it is checkmate; if one works it is only check.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [game_state] Black is checkmated.
- [attackers] One white piece attacks the king.

### Step 12: item  (shown without telling the learner the topic: unlabeled test)

**Task `IBds11-35`** (classify_position, difficulty cue 3)

Black to move. Is it check, checkmate or neither?

```
  1  . . . . . . . .
  2  . . . . . . . .
  3  . . . . . . . .
  4  . . . . . . . .
  5  . . . . . . . .
  6  . . K . . . . .
  7  . Q . . . . . .
  8  k . . . . . . .
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: 7k/6Q1/5K2/8/8/8/8/8 b - - 0 1
```

**Accepted answer:** {"class": "checkmate"}

**Explanation shown:** The queen checks and the white king on f6 defends it, so the black king cannot capture; every escape square is covered. Checkmate.

Hints (in order):
1. Is the king attacked right now? If not, the answer is neither.
2. If it is attacked: can the king move, can the checker be captured, can the line be blocked (a knight cannot be blocked)?
3. If none of the three works it is checkmate; if one works it is only check.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [game_state] Black is checkmated.
- [attackers] One white piece attacks the king.

### Step 13: practice  (shown without telling the learner the topic: unlabeled test)

A drill of 6 tasks drawn from the bank by tag ['node.FND.CHECK', 'cue.3'] (67 tasks carry those tags). Not reproduced here; ask for a sample if you want one checked.

### Step 14: reflect

Kind: expect

Prompt: Which answer surprised you most: a position that looked like check but was neither, or one that looked like check but was mate? What did you check first?

---

## Reviewer scorecard

Fill in the file `content/review/L-FND-CHECK-2.json` (a template is below). Scale 1 to 5 for each dimension: 1 = wrong or unusable, 3 = acceptable with edits, 5 = I would put my name to it as it stands.
Revision to review: `48ac3b86`. If the lesson text changes after your review, your sign-off no longer applies and the lesson goes back to needs-human.

| Dimension | What to judge | Score |
|---|---|---|
| chess | every statement, line and explanation is correct; near-misses are really near-misses | |
| clarity | the explanation actually explains (mechanism, conditions), in plain words | |
| prerequisites | the lesson assumes only what the learner has met | |
| tasks | each task has one defensible answer and a fair explanation | |

```json
{
  "lesson": "L-FND-CHECK-2",
  "revision": "48ac3b86",
  "reviewer": "<your name>",
  "reviewer_role": "strong-player",
  "date": "YYYY-MM-DD",
  "scores": {"chess": 0, "clarity": 0, "prerequisites": 0, "tasks": 0},
  "comments": "<what to change, by step number>",
  "verdict": "approved"
}
```

`reviewer_role` is `strong-player` or `teacher`. `verdict` is `approved` or `changes-requested`. See docs/review-slice.md.
