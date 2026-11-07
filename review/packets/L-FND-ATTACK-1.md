# Review packet: L-FND-ATTACK-1

**Which squares does a piece attack?**

- Skill: FND.ATTACK (D1); stage: S1; stated length: 11 minutes
- Steps: 17 (13 are tasks); revision: `0b2c25e6`
- Review status now: needs-human

## What the lesson says the learner will be able to do

- Taps every square a rook, bishop, knight or pawn attacks when other pieces stand in the way
- Stops a line at the first piece it meets and keeps the squares behind it out
- Knows a pawn attacks diagonally ahead, even when blocked, and not straight ahead
- Says a defended piece is still attacked

## Sources the author names (check that they are used fairly, in our own words)

- content/skills/FND.ATTACK.json (conditions and contrasts)
- docs/first-hours.md sessions 1-2 (rook, pawn and capture items)
- docs/lessons-t0.md (lesson order: after L-FND-CAPTURE-1)

## How to read this packet

Boards are drawn with capitals for White and lower case for Black, rank 8 at the top unless the board is shown from Black's side. Moves in a line are in standard notation. Statements marked [V] were machine-checked, [I] inference, [H] hypothesis, [S] secondary source, [R] recalled. Please judge the explanations, not only the moves: does each sentence tell the learner why?

---

### Step 1: card

A piece **attacks** a square when it could capture an enemy piece standing there (pinned pieces are explained in the last card below). If the square holds a piece of its own side, we say the piece **defends** it.
An attacked square need not hold anything yet. And the squares a piece attacks are not always the squares it moves to.

### Step 2: board

Caption: White to move. The lit squares are the squares the rook on e3 attacks.

```
  8  . . . . . . k .
  7  . . . . p . . .
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . P . . R . . .
  2  . . . . . . . .
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 6k1/4p3/8/8/8/1P2R3/8/6K1 w - - 0 1
```

The line, with the sentence the learner sees at each move:
1. **1. Rxe7**: The rook can take the pawn on e7. It is the first piece on the file; e8 behind it was never attacked.

```
  8  . . . . . . k .
  7  . . . . R . . .
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . P . . . . . .
  2  . . . . . . . .
  1  . . . . . . K .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 6k1/4R3/8/8/8/1P6/8/6K1 b - - 0 1
```

Drawn on the board: arrows e3-e7; highlighted squares b3, c3, d3, e1, e2, e4, e5, e6, e7, f3, g3, h3.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [piece_attacks] These twelve squares are exactly the rook's attacked squares.
- [piece_on] A black pawn stands on e7.
- [legal_move] The rook can capture the pawn on e7.

### Step 3: item

**Task `IB3-1`** (select_squares, difficulty cue 1)

Tap every square the white rook on d4 attacks. A square holding the rook's own piece counts too: the rook defends that piece.

```
  8  . . . . k . . .
  7  . . . p . . . .
  6  . . . . . . . .
  5  . . . . . . . .
  4  . P . R . . n .
  3  . . . . . . . .
  2  . . . . . . . .
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 4k3/3p4/8/8/1P1R2n1/8/8/6K1 w - - 0 1
```

**Accepted answer:** squares b4, c4, d1, d2, d3, d5, d6, d7, e4, f4, g4 (from d4)

**Explanation shown:** The rook attacks up to and including the first piece on each line: the black pawn on d7, the black knight on g4, and its own pawn on b4 (which it defends). The squares behind them, d8, h4 and a4, are not attacked.

Hints (in order):
1. Go one direction at a time: up, down, left, right.
2. On each line the rook reaches every square up to and including the first piece it meets. Nothing behind that piece is attacked.
3. Up the d-file it stops at the black pawn on d7. To the left it stops at its own pawn on b4. To the right it stops at the black knight.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [piece_attacks] The piece on d4 attacks exactly these squares.
- [piece_on] A black pawn stands on d7.
- [piece_on] A black knight stands on g4.
- [piece_on] A white pawn stands on b4.

### Step 4: item

**Task `IB3-2`** (select_squares, difficulty cue 1)

Tap every square the white bishop on c3 attacks. Count the square of a piece of its own side too (the bishop defends it).

```
  8  . . . . k . . .
  7  . . . . . . . .
  6  . . . . . . . .
  5  n . . . P . . .
  4  . . . . . . . .
  3  . . B . . . . .
  2  . . . . . . . .
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 4k3/8/8/n3P3/8/2B5/8/6K1 w - - 0 1
```

**Accepted answer:** squares a1, a5, b2, b4, d2, d4, e1, e5 (from c3)

**Explanation shown:** Up and to the right the bishop reaches d4, then its own pawn on e5 (defended), and stops. Up and to the left it reaches b4, then the black knight on a5. Down it runs to a1 and e1.

Hints (in order):
1. Take the four diagonals one at a time.
2. On each diagonal the bishop reaches every square up to and including the first piece it meets.
3. Toward the e-file it stops at its own pawn on e5. Toward the a-file it stops at the black knight.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [piece_attacks] The piece on c3 attacks exactly these squares.
- [piece_on] A white pawn stands on e5.
- [piece_on] A black knight stands on a5.

### Step 5: item

**Task `IB3-3`** (select_squares, difficulty cue 1)

The white pawn on e4 is blocked by the black pawn on e5. Tap every square the e4 pawn attacks.

```
  8  . . . . k . . .
  7  . . . . . . . .
  6  . . . . . . . .
  5  . . . n p . . .
  4  . . . . P . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 4k3/8/8/3np3/4P3/8/8/6K1 w - - 0 1
```

**Accepted answer:** squares d5, f5 (from e4)

**Explanation shown:** A pawn attacks the two squares diagonally ahead, here d5 and f5, whether or not it is blocked. The black knight on d5 is attacked. The pawn's only legal move is to capture on d5; the square straight ahead, e5, is not attacked.

Hints (in order):
1. A pawn moves straight ahead but captures in a different direction.
2. Think of the two squares diagonally in front of the pawn.
3. They are the squares on the d-file and the f-file one rank up. The block on e5 does not change them.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [piece_attacks] The piece on e4 attacks exactly these squares.
- [piece_on] A black knight stands on d5.
- [legal_destinations] The pawn's only legal move is the capture on d5.

### Step 6: item

**Task `IB3-4`** (select_squares, difficulty cue 1)

Tap every square the white knight on d4 attacks. Pieces stand next to it; does that matter?

```
  8  . . . . k . . .
  7  . . . . . . . .
  6  . . . . p . . .
  5  . . . p . . . .
  4  . . . N . . . .
  3  . . . P . . . .
  2  . . P . . . . .
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 4k3/8/4p3/3p4/3N4/3P4/2P5/6K1 w - - 0 1
```

**Accepted answer:** squares b3, b5, c2, c6, e2, e6, f3, f5 (from d4)

**Explanation shown:** A knight jumps, so the pawns on d3 and d5 beside it do not block it. It attacks eight squares: b3, b5, c2, c6, e2, e6, f3 and f5. Its own pawn on c2 is defended by it, and the black pawn on e6 is attacked.

Hints (in order):
1. A knight attacks the eight squares that are an L-shape away.
2. A knight jumps, so the pieces beside it are not in its way.
3. Two of the eight squares hold a pawn of its own side or an enemy pawn; they still count.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [piece_attacks] The piece on d4 attacks exactly these squares.
- [piece_on] A white pawn stands on c2.
- [piece_on] A black pawn stands on e6.

### Step 7: card

Check before you trust 'attacks'.
**Lines:** a rook, bishop or queen attacks up to and including the first piece it meets; squares behind it are not attacked.
**Pawns:** the squares diagonally ahead (one square on an edge file), even when blocked; never straight ahead.
**Pinned pieces** (a piece is pinned when moving it would leave its own king attacked) still attack their squares (an enemy king may not step there), though they may be unable to capture. A defended piece is still attacked.

### Step 8: contrast

Title: Same pawn, one change

Prompt: White's d4 pawn and a black knight. Predict, then check.

**The working board:**

**Task `IB3-7`** (predict_outcome, difficulty cue 2)

Does the white pawn on d4 attack the black knight? Predict, then check.

```
  8  . . . . k . . .
  7  . . . . . . . .
  6  . . . . . . . .
  5  . . . . n . . .
  4  . . . P . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 4k3/8/8/4n3/3P4/8/8/6K1 w - - 0 1
```

**Accepted answer:** {"outcome": "yes"}

**Explanation shown:** A pawn attacks the squares diagonally ahead. From d4 those are c5 and e5, and the knight stands on e5.

Hints (in order):
1. Where does a white pawn on d4 attack?
2. Look at the two squares diagonally ahead of the pawn.
3. e5 is one of them.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [pawn_attackers] One white pawn attacks e5.
- [attackers] Only that pawn attacks e5.
- [piece_attacks] The d4 pawn attacks c5 and e5.

**The failing board:**

**Task `IB3-8`** (predict_outcome, difficulty cue 2)

Does the white pawn on d4 attack the black knight? Predict, then check.

```
  8  . . . . k . . .
  7  . . . . . . . .
  6  . . . . . . . .
  5  . . . n . . . .
  4  . . . P . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 4k3/8/8/3n4/3P4/8/8/6K1 w - - 0 1
```

**Accepted answer:** {"outcome": "no"}

**Explanation shown:** The knight stands straight in front of the pawn. A pawn attacks only the diagonal squares, so the knight on d5 is not attacked by it.

Hints (in order):
1. Where does a white pawn on d4 attack?
2. Look at the two squares diagonally ahead of the pawn.
3. The knight stands straight ahead, on d5. Is d5 diagonal?

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [pawn_attackers] No white pawn attacks d5.
- [attackers] No white piece attacks d5.
- [piece_attacks] The d4 pawn attacks c5 and e5, not d5.

**The irrelevant board:**

**Task `IB3-9`** (predict_outcome, difficulty cue 2)

Does the white pawn on d4 attack the black knight? Predict, then check.

```
  8  . . . . k . . .
  7  . . . . . . . .
  6  . . . . . . . .
  5  . . . p n . . .
  4  . . . P . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 4k3/8/8/3pn3/3P4/8/8/6K1 w - - 0 1
```

**Accepted answer:** {"outcome": "yes"}

**Explanation shown:** A black pawn blocks the d4 pawn, so it cannot advance. Its attack squares are still c5 and e5, so it can still capture the knight on e5. Being blocked does not switch an attack off.

Hints (in order):
1. Where does a white pawn on d4 attack?
2. A black pawn now stands in front of it. Does that change the diagonals?
3. The pawn is blocked and cannot move, but its attack squares are the same.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [pawn_attackers] One white pawn attacks e5.
- [legal_destinations] The blocked pawn cannot advance; its only legal move is the capture on e5.
- [piece_attacks] The d4 pawn attacks c5 and e5.

### Step 9: item

**Task `IB3-9`** (predict_outcome, difficulty cue 2)

Does the white pawn on d4 attack the black knight? Predict, then check.

```
  8  . . . . k . . .
  7  . . . . . . . .
  6  . . . . . . . .
  5  . . . p n . . .
  4  . . . P . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 4k3/8/8/3pn3/3P4/8/8/6K1 w - - 0 1
```

**Accepted answer:** {"outcome": "yes"}

**Explanation shown:** A black pawn blocks the d4 pawn, so it cannot advance. Its attack squares are still c5 and e5, so it can still capture the knight on e5. Being blocked does not switch an attack off.

Hints (in order):
1. Where does a white pawn on d4 attack?
2. A black pawn now stands in front of it. Does that change the diagonals?
3. The pawn is blocked and cannot move, but its attack squares are the same.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [pawn_attackers] One white pawn attacks e5.
- [legal_destinations] The blocked pawn cannot advance; its only legal move is the capture on e5.
- [piece_attacks] The d4 pawn attacks c5 and e5.

### Step 10: item

**Task `IB3-5`** (predict_outcome, difficulty cue 2)

The black bishop on d5 is defended by the pawn on e6. Is it attacked by the white rook on d1? Predict, then check.

```
  8  . . . . k . . .
  7  . . . . . . . .
  6  . . . . p . . .
  5  . . . b . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  . . . R . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 4k3/8/4p3/3b4/8/8/8/3R2K1 w - - 0 1
```

**Accepted answer:** {"outcome": "yes"}

**Explanation shown:** The rook attacks the bishop along the open d-file, and the pawn on e6 defends the bishop. Attacked and defended are separate facts; a piece can be both.

Hints (in order):
1. Ask only whether the rook attacks the bishop. Do not think about the pawn yet.
2. Look along the d-file from d1.
3. Nothing stands between the rook and the bishop. The pawn on e6 only makes the bishop defended.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [attackers] One white piece, the rook, attacks d5.
- [attackers] One black piece, the pawn on e6, defends d5.
- [piece_attacks] The rook attacks d5 along the open d-file.

### Step 11: item

**Task `IB3-6`** (predict_outcome, difficulty cue 2)

Black to move. The white knight on c4 is pinned to its king, so White cannot move it. Can the black king still step to e5? Predict, then check.

```
  8  . . . . . . . .
  7  . . . . . . . .
  6  . . . . b k . .
  5  . . . . . . . .
  4  . . N . . . . .
  3  . . . . . . . .
  2  K . . . . . . .
  1  . . . . . . . .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black.
FEN: 8/8/4bk2/8/2N5/8/K7/8 b - - 0 1
```

**Accepted answer:** {"outcome": "no"}

**Explanation shown:** The knight on c4 is pinned by the bishop on e6, so it has no legal move, yet it still attacks e5. The black king may not step onto an attacked square, so e5 is not available to it.

Hints (in order):
1. Which white pieces attack e5?
2. The knight cannot move. Does that stop it from attacking?
3. A piece that is pinned to its own king still attacks squares; a king may not step onto a square an enemy piece attacks.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [mobility] The pinned knight has no legal move.
- [piece_attacks] The knight on c4 attacks e5.
- [legal_destinations] The king may go to six squares, and e5 is not one of them.

### Step 12: item  (shown without telling the learner the topic: unlabeled test)

**Task `IB3-10`** (select_squares, difficulty cue 3)

Tap every square the black bishop on f6 attacks. A square holding the bishop's own piece counts too: the bishop defends that piece.

```
  8  r . b q k . . r
  7  p p p p . p p p
  6  . . n . . b . .
  5  . . . P . . . .
  4  . . B . n . . .
  3  . . . . . N . .
  2  P P . . . P P P
  1  R . B Q . R K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: r1bqk2r/pppp1ppp/2n2b2/3P4/2B1n3/5N2/PP3PPP/R1BQ1RK1 w kq - 1 10
```

**Accepted answer:** squares b2, c3, d4, d8, e5, e7, g5, g7, h4 (from f6)

**Explanation shown:** Down the long diagonal the bishop runs through e5, d4 and c3 and stops at the white pawn on b2. It also reaches g5 and h4, and e7. It defends its own queen on d8 and its own pawn on g7.

Hints (in order):
1. Take the four diagonals through f6 one at a time.
2. On each diagonal stop at the first piece, and count that piece's square.
3. Two diagonals run toward White's side of the board, two toward Black's own pieces.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [piece_attacks] The piece on f6 attacks exactly these squares.
- [piece_on] A white pawn stands on b2.

### Step 13: item  (shown without telling the learner the topic: unlabeled test)

**Task `IA0-27`** (select_squares, difficulty cue 3)

Tap every white piece that can capture the black bishop on g4.

```
  8  . . . . . . k .
  7  p p p . . p p p
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . R . . . b .
  3  . . . . N . . .
  2  P P P . . P P P
  1  . . . Q . . . K
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 6k1/ppp2ppp/8/8/2R3b1/4N3/PPP2PPP/3Q3K w - - 0 1
```

**Accepted answer:** squares c4, d1, e3

**Explanation shown:** The rook slides along the fourth rank, the queen uses the diagonal d1-e2-f3-g4, and the knight jumps from e3 to g4. The king and the pawns cannot reach g4.

Hints (in order):
1. Check each white piece in turn: rook, queen, knight, king, pawns.
2. Rooks use straight lines, queens use both, and knights jump in an L shape.
3. Three pieces can capture: the rook along the fourth rank, the queen on a diagonal, and one jump.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] The rook can capture on g4.
- [legal_move] The queen can capture on g4.
- [legal_move] The knight can capture on g4.
- [attackers] Exactly three white pieces attack g4.

### Step 14: item  (shown without telling the learner the topic: unlabeled test)

**Task `IB3-11`** (predict_outcome, difficulty cue 3)

Is the black queen on d8 attacked by the white rook on d1? Predict, then check.

```
  8  . . . q . . k .
  7  . . . . . p p p
  6  . . . . . . . .
  5  . . . p . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . . P P P
  1  . . . R . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 3q2k1/5ppp/8/3p4/8/8/5PPP/3R2K1 w - - 0 1
```

**Accepted answer:** {"outcome": "no"}

**Explanation shown:** The rook attacks the black pawn on d5, the first piece on the d-file, and nothing behind it. The queen on d8 is not attacked until the pawn leaves the file.

Hints (in order):
1. Look along the d-file from d1 toward d8.
2. Is there a piece between the rook and the queen?
3. The rook meets the pawn on d5 first. That pawn is attacked; the queen behind it is not.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [attackers] No white piece attacks d8.
- [piece_attacks] The rook reaches the pawn on d5 and nothing beyond it.
- [piece_on] A black pawn stands on d5.

### Step 15: item  (shown without telling the learner the topic: unlabeled test)

**Task `IA0-30`** (predict_outcome, difficulty cue 3)

Can any white piece capture the black rook on a8 right now? Predict, then check.

```
  8  r . . . . . k .
  7  . . . . . p p p
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . N . . . . .
  2  . B . . . P P P
  1  . . . . R . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: r5k1/5ppp/8/8/8/2N5/1B3PPP/4R1K1 w - - 0 1
```

**Accepted answer:** {"outcome": "no"}

**Explanation shown:** No white piece has a line to a8: the rook on e1 uses the e-file and the first rank, the bishop on b2 is not on a diagonal that reaches a8, and the knight on c3 jumps elsewhere.

Hints (in order):
1. Check the white rook, the bishop, the knight, and so on, one at a time.
2. The bishop on b2 is on a diagonal. Where does it go?
3. The white rook on e1 uses the e-file and the first rank.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [attackers] No white piece attacks a8.
- [illegal_move] The white rook cannot capture on a8.

### Step 16: practice

A drill of 3 tasks drawn from the bank by tag ['node.FND.ATTACK', 'cue.3'] (12 tasks carry those tags). Not reproduced here; ask for a sample if you want one checked.

### Step 17: reflect

Kind: unsure

Prompt: Which rule did you reach for last: the line stops at the first piece, or the pawn attacks diagonally? Which one would you check first next time?

---

## Reviewer scorecard

Fill in the file `content/review/L-FND-ATTACK-1.json` (a template is below). Scale 1 to 5 for each dimension: 1 = wrong or unusable, 3 = acceptable with edits, 5 = I would put my name to it as it stands.
Revision to review: `0b2c25e6`. If the lesson text changes after your review, your sign-off no longer applies and the lesson goes back to needs-human.

| Dimension | What to judge | Score |
|---|---|---|
| chess | every statement, line and explanation is correct; near-misses are really near-misses | |
| clarity | the explanation actually explains (mechanism, conditions), in plain words | |
| prerequisites | the lesson assumes only what the learner has met | |
| tasks | each task has one defensible answer and a fair explanation | |

```json
{
  "lesson": "L-FND-ATTACK-1",
  "revision": "0b2c25e6",
  "reviewer": "<your name>",
  "reviewer_role": "strong-player",
  "date": "YYYY-MM-DD",
  "scores": {"chess": 0, "clarity": 0, "prerequisites": 0, "tasks": 0},
  "comments": "<what to change, by step number>",
  "verdict": "approved"
}
```

`reviewer_role` is `strong-player` or `teacher`. `verdict` is `approved` or `changes-requested`. See docs/review-slice.md.
