# Review packet: L-FND-VALUE-1

**Piece values: counting what you win and lose**

- Skill: FND.VALUE (D1); stage: S2; stated length: 10 minutes
- Steps: 17 (12 are tasks); revision: `787b420b`
- Review status now: needs-human

## What the lesson says the learner will be able to do

- Says the counting value of each piece and which of two pieces is worth more
- Adds up a capture and recapture to say whether a trade gains, loses or is even
- Knows the values are a rule of thumb and that checkmate beats the count

## Sources the author names (check that they are used fairly, in our own words)

- docs/first-hours.md session 2
- docs/council-synthesis.md CD-1, CD-4
- sources/sheets/edlasker_chess-strategy.md (values are conditional)
- sources/sheets/capablanca_chess-fundamentals.md
- content/items/lesson-split-sp4.json (claims check the counting in every trade)

## How to read this packet

Boards are drawn with capitals for White and lower case for Black, rank 8 at the top unless the board is shown from Black's side. Moves in a line are in standard notation. Statements marked [V] were machine-checked, [I] inference, [H] hypothesis, [S] secondary source, [R] recalled. Please judge the explanations, not only the moves: does each sentence tell the learner why?

---

### Step 1: card

To compare trades, players give each piece a **counting value**: pawn 1, knight 3, bishop 3, rook 5, queen 9. The king has no value because it is never traded; it is checkmated. The value belongs to the kind of piece. It does not depend on its colour, on the square it stands on, or on which piece takes it. These numbers are a *rule of thumb*, a first guide and not a law.

### Step 2: item

**Task `ISsp4-1`** (predict_outcome, difficulty cue 2)

White to move. The knight takes the undefended rook on d5. By the counting values, how many points does White win?

```
  8  . . . . . . k .
  7  . . . . . p p p
  6  . . . . . . . .
  5  . . . r . . . .
  4  . . . . . . . .
  3  . . . . N . . .
  2  . . . . . P P P
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 6k1/5ppp/8/3r4/8/4N3/5PPP/6K1 w - - 0 1
```

**Accepted answer:** {"outcome": "5"}

**Explanation shown:** Nothing defends the rook, so White wins a whole rook: 5 points by the counting values.

Hints (in order):
1. Which piece is being taken?
2. Is anything given up in return?
3. A rook has a counting value of five.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [material_after_move] Nxd5 wins a rook and nothing is lost back.
- [attackers] No black piece defends the rook.

### Step 3: item

**Task `ISsp4-2`** (predict_outcome, difficulty cue 2)

White to move. The knight takes the undefended queen on d4. By the counting values, how many points does White win?

```
  8  . . . . . . k .
  7  . . . . . p p p
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . q . . . .
  3  . . . . . N . .
  2  . . . . . P P P
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 6k1/5ppp/8/8/3q4/5N2/5PPP/6K1 w - - 0 1
```

**Accepted answer:** {"outcome": "9"}

**Explanation shown:** Nothing defends the queen, so White wins a whole queen: 9 points by the counting values.

Hints (in order):
1. Which piece is being taken?
2. Is anything given up in return?
3. A queen has a counting value of nine.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [material_after_move] Nxd4 wins a queen and nothing is lost back.
- [attackers] No black piece defends the queen.

### Step 4: item

**Task `ISsp4-3`** (predict_outcome, difficulty cue 2)

White to move. The rook takes the undefended knight on d5. By the counting values, how many points does White win?

```
  8  . . . . . . k .
  7  . . . . . p p p
  6  . . . . . . . .
  5  . . . n . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . . P P P
  1  . . . R . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 6k1/5ppp/8/3n4/8/8/5PPP/3R2K1 w - - 0 1
```

**Accepted answer:** {"outcome": "3"}

**Explanation shown:** Nothing defends the knight, so White wins a whole knight: 3 points.

Hints (in order):
1. Which piece is being taken?
2. Is anything given up in return?
3. A knight has a counting value of three.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [material_after_move] Rxd5 wins a knight and nothing is lost back.
- [attackers] No black piece defends the knight.

### Step 5: card

To judge a trade, **add what you take and subtract what you lose**. Taking a piece that is then taken back is a trade. A good trade gives you more points than it costs, even when you lose a piece. Pieces are not counted by number: if you win a knight and a bishop (6) and give up a rook (5), you gain one point although two pieces change hands for one. The side that gives up the two minor pieces for the rook loses one point.

### Step 6: board

Caption: A defended rook can still be worth taking with a knight. Add up the swap: what you take, minus what you lose.

```
  8  . . . . . . k .
  7  p . . . . p p .
  6  . . . . r . . p
  5  . . . . . . . .
  4  . . . N . . . .
  3  . . . . . . . .
  2  P . . . . P P P
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 6k1/p4pp1/4r2p/8/3N4/8/P4PPP/6K1 w - - 0 1
```

The line, with the sentence the learner sees at each move:
1. **1. Nxe6**: The knight takes the rook: White gains 5.
2. **1... fxe6**: The pawn takes the knight: White loses 3.

```
  8  . . . . . . k .
  7  p . . . . . p .
  6  . . . . p . . p
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  P . . . . P P P
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 6k1/p5p1/4p2p/8/8/8/P4PPP/6K1 w - - 0 2
```

Drawn on the board: arrows d4-e6; highlighted squares e6.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [material_after_move] (no sentence; a rules check)
- [attackers] (no sentence; a rules check)

### Step 7: item

**Task `IA0-52`** (classify_position, difficulty cue 3)

White thinks about taking the knight on e5 with the bishop. Black will recapture if it can. After the captures, what has happened to White's points?

```
  8  . . . . . . k .
  7  p . . . . p p .
  6  . . . p . . . p
  5  . . . . n . . .
  4  . . . . . . . .
  3  . . B . . . . .
  2  P . . . . . P P
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 6k1/p4pp1/3p3p/4n3/8/2B5/P5PP/6K1 w - - 0 1
```

**Accepted answer:** {"class": "Even trade"}

**Explanation shown:** The pawn on d6 takes the bishop back. White gives 3 points and gets 3: an even trade.

Hints (in order):
1. Is the knight guarded?
2. Add up what White gives up and what White takes.
3. A bishop and a knight are each worth 3 points.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [material_after_move] Bxe5 dxe5 is an even swap.
- [attackers] The pawn on d6 guards e5.

### Step 8: item

**Task `IA0-51`** (classify_position, difficulty cue 3)

White thinks about taking the pawn on d5 with the queen. Black will recapture if it can. After the captures, what has happened to White's points?

```
  8  . . . . . . k .
  7  p . . . . p p p
  6  . . p . . . . .
  5  . . . p . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  P . . . . P P P
  1  . . . Q . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 6k1/p4ppp/2p5/3p4/8/8/P4PPP/3Q2K1 w - - 0 1
```

**Accepted answer:** {"class": "White loses material"}

**Explanation shown:** The pawn on c6 takes the queen back. White gives up 9 points for 1.

Hints (in order):
1. Is the pawn on d5 guarded?
2. Add up what White gives up and what White takes.
3. The queen is worth 9 points, the pawn 1.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [material_after_move] Qxd5 cxd5 loses the queen for a pawn.
- [attackers] The pawn on c6 guards d5.

### Step 9: contrast

Title: Same trade, one change

Prompt: A rook on d5 is defended by a pawn. Predict first what the capture does to White's points. Then see what changes when the capturing piece changes, and when only the colours change.

**The working board:**

**Task `ISsp4-5`** (classify_position, difficulty cue 3)

White thinks about taking the rook on d5 with the bishop. The pawn on e6 will recapture. After the captures, what has happened to White's points?

```
  8  . . . . . . k .
  7  . . . . . p p .
  6  . . . . p . . p
  5  . . . r . . . .
  4  . . . . . . . .
  3  . B . . . . . .
  2  . . . . . P P P
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 6k1/5pp1/4p2p/3r4/8/1B6/5PPP/6K1 w - - 0 1
```

**Accepted answer:** {"class": "White gains points"}

**Explanation shown:** White takes a rook (5) and the pawn takes the bishop (3): White is 2 points up. The trade is good even though a piece is lost.

Hints (in order):
1. Is the piece defended? Then you lose the capturing piece next move.
2. Add what you take. Subtract what you lose.
3. A rook is worth more than a bishop by the counting values.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [material_after_move] The capture and the recapture leave this net result.
- [attackers] Exactly one piece defends the captured piece.

**The failing board:**

**Task `ISsp4-6`** (classify_position, difficulty cue 3)

Same position, but now White takes the rook on d5 with the queen. The pawn on e6 will recapture. After the captures, what has happened to White's points?

```
  8  . . . . . . k .
  7  . . . . . p p .
  6  . . . . p . . p
  5  . . . r . . . .
  4  . . . . . . . .
  3  . Q . . . . . .
  2  . . . . . P P P
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 6k1/5pp1/4p2p/3r4/8/1Q6/5PPP/6K1 w - - 0 1
```

**Accepted answer:** {"class": "White loses points"}

**Explanation shown:** White takes a rook (5) and the pawn takes the queen (9): White is 4 points down. Only the capturing piece changed.

Hints (in order):
1. Is the piece defended? Then you lose the capturing piece next move.
2. Add what you take. Subtract what you lose.
3. Compare what you take with what you can lose.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [material_after_move] The capture and the recapture leave this net result.
- [attackers] Exactly one piece defends the captured piece.

**The irrelevant board:**

**Task `ISsp4-7`** (classify_position, difficulty cue 3)

Colours are reversed: Black thinks about taking the rook on d4 with the bishop. The pawn on e3 will recapture. After the captures, what has happened to Black's points?

```
  8  . . . . . . k .
  7  . . . . . p p p
  6  . b . . . . . .
  5  . . . . . . . .
  4  . . . R . . . .
  3  . . . . P . . P
  2  . . . . . P P .
  1  . . . . . . K .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black.
FEN: 6k1/5ppp/1b6/8/3R4/4P2P/5PP1/6K1 b - - 0 1
```

**Accepted answer:** {"class": "Black gains points"}

**Explanation shown:** Black takes a rook (5) and the pawn takes the bishop (3): Black is 2 points up. The colour of the pieces changes nothing.

Hints (in order):
1. Is the piece defended? Then you lose the capturing piece next move.
2. Add what you take. Subtract what you lose.
3. The values belong to the piece type, not to the colour.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [material_after_move] The capture and the recapture leave this net result.
- [attackers] Exactly one piece defends the captured piece.

### Step 10: card

**When it holds.** The counting values compare trades when nothing else is happening. Take more than you give and you gain; equal values give an even trade. **When it fails.** The values do not see everything. Checkmate ends the game whatever the count says, and later you will meet pieces worth more or less than their usual points. Treat the count as a guide, not as proof.

### Step 11: item  (shown without telling the learner the topic: unlabeled test)

**Task `IA0-55`** (find_move, difficulty cue 3)

Black has a queen and White has only a rook, with the same pawns. White to move: find White's best move.

```
  8  . . . . . . k .
  7  . . . . . p p p
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . q . . . . .
  2  . . . . . P P P
  1  . . . R . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 6k1/5ppp/8/8/8/2q5/5PPP/3R2K1 w - - 0 1
```

**Accepted answer(s):** Rd8#

**Explanation shown:** Rd8 is checkmate: the rook attacks the king, the pawns block its escape, and nothing can capture the rook or block. Black has more points, but checkmate ends the game.

Hints (in order):
1. Forget the points for a moment. Where is Black's king, and what stands next to it?
2. Black's king has pawns on f7, g7 and h7 in front of it. Which rank is it on?
3. A rook on the back rank would attack the king along the rank.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [mate_in] Rd8 is checkmate.

### Step 12: item  (shown without telling the learner the topic: unlabeled test)

**Task `ISsp4-4`** (classify_position, difficulty cue 3)

White thinks about taking the rook on d5 with the queen. The pawn on c6 will recapture. After the captures, what has happened to White's points?

```
  8  . . . . . . k .
  7  . . . . . p p p
  6  . . p . . . . .
  5  . . . r . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . . P P P
  1  . . . Q . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 6k1/5ppp/2p5/3r4/8/8/5PPP/3Q2K1 w - - 0 1
```

**Accepted answer:** {"class": "White loses points"}

**Explanation shown:** White takes a rook (5) and the pawn takes the queen (9): White is 4 points down.

Hints (in order):
1. Is the piece defended? Then you lose the capturing piece next move.
2. Add what you take. Subtract what you lose.
3. A queen is worth far more than a rook by the counting values.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [material_after_move] The capture and the recapture leave this net result.
- [attackers] Exactly one piece defends the captured piece.

### Step 13: item  (shown without telling the learner the topic: unlabeled test)

**Task `ISsp4-8`** (classify_position, difficulty cue 3)

White thinks about taking the pawn on e5 with the knight. The pawn on d6 will recapture. After the captures, what has happened to White's points?

```
  8  . . . . . . k .
  7  . . . . . p p .
  6  . . . p . . . p
  5  . . . . p . . .
  4  . . . . . . . .
  3  . . . . . N . .
  2  . . . . . P P P
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 6k1/5pp1/3p3p/4p3/8/5N2/5PPP/6K1 w - - 0 1
```

**Accepted answer:** {"class": "White loses points"}

**Explanation shown:** White takes a pawn (1) and loses a knight (3): White is 2 points down.

Hints (in order):
1. Is the piece defended? Then you lose the capturing piece next move.
2. Add what you take. Subtract what you lose.
3. A knight is worth more than a pawn by the counting values.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [material_after_move] The capture and the recapture leave this net result.
- [attackers] Exactly one piece defends the captured piece.

### Step 14: item  (shown without telling the learner the topic: unlabeled test)

**Task `ISsp4-9`** (classify_position, difficulty cue 3)

White thinks about taking the rook on d5 with the rook. The pawn on c6 will recapture. After the captures, what has happened to White's points?

```
  8  . . . . . . k .
  7  . . . . . p p p
  6  . . p . . . . .
  5  . . . r . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . . P P P
  1  . . . R . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 6k1/5ppp/2p5/3r4/8/8/5PPP/3R2K1 w - - 0 1
```

**Accepted answer:** {"class": "Even trade"}

**Explanation shown:** White takes a rook (5) and the pawn takes a rook (5): an even trade.

Hints (in order):
1. Is the piece defended? Then you lose the capturing piece next move.
2. Add what you take. Subtract what you lose.
3. Equal counting values mean an even swap.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [material_after_move] The capture and the recapture leave this net result.
- [attackers] Exactly one piece defends the captured piece.

### Step 15: item  (shown without telling the learner the topic: unlabeled test)

**Task `IA0-54`** (classify_position, difficulty cue 3)

White thinks about taking the rook on e6 with the knight. The pawn on f7 guards e6 and will recapture. After the captures, what has happened to White's points?

```
  8  . . . . . . k .
  7  p . . . . p p .
  6  . . . . r . . p
  5  . . . . . . . .
  4  . . . N . . . .
  3  . . . . . . . .
  2  P . . . . P P P
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 6k1/p4pp1/4r2p/8/3N4/8/P4PPP/6K1 w - - 0 1
```

**Accepted answer:** {"class": "White gains material"}

**Explanation shown:** Black recaptures the knight, but White took a rook: White gives 3 points and gets 5. A guarded piece can still be worth taking when it is worth more than the piece you give up.

Hints (in order):
1. The rook is guarded. Does that mean White should not take it?
2. Add up what White gives up and what White takes.
3. A knight is worth 3 points and a rook 5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [material_after_move] Nxe6 fxe6 wins 2 points for White.
- [attackers] The pawn on f7 guards e6.

### Step 16: practice  (shown without telling the learner the topic: unlabeled test)

A drill of 6 tasks drawn from the bank by tag ['node.FND.VALUE', 'cue.3'] (10 tasks carry those tags). Not reproduced here; ask for a sample if you want one checked.

### Step 17: reflect

Kind: expect

Prompt: A rook for a bishop and a pawn: how many points does it cost you, and how many do you get? Write the net result, then say what you did in a trade you judged by eye.

- Field "Net points for the side giving the rook:" (free text)

---

## Reviewer scorecard

Fill in the file `content/review/L-FND-VALUE-1.json` (a template is below). Scale 1 to 5 for each dimension: 1 = wrong or unusable, 3 = acceptable with edits, 5 = I would put my name to it as it stands.
Revision to review: `787b420b`. If the lesson text changes after your review, your sign-off no longer applies and the lesson goes back to needs-human.

| Dimension | What to judge | Score |
|---|---|---|
| chess | every statement, line and explanation is correct; near-misses are really near-misses | |
| clarity | the explanation actually explains (mechanism, conditions), in plain words | |
| prerequisites | the lesson assumes only what the learner has met | |
| tasks | each task has one defensible answer and a fair explanation | |

```json
{
  "lesson": "L-FND-VALUE-1",
  "revision": "787b420b",
  "reviewer": "<your name>",
  "reviewer_role": "strong-player",
  "date": "YYYY-MM-DD",
  "scores": {"chess": 0, "clarity": 0, "prerequisites": 0, "tasks": 0},
  "comments": "<what to change, by step number>",
  "verdict": "approved"
}
```

`reviewer_role` is `strong-player` or `teacher`. `verdict` is `approved` or `changes-requested`. See docs/review-slice.md.
