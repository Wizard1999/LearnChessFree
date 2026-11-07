# Review packet: L-SAF-LOOSE-1

**Loose pieces: what can be taken for free?**

- Skill: SAF.LOOSE (D1); stage: S2; stated length: 9 minutes
- Steps: 12 (8 are tasks); revision: `f9bc3478`
- Review status now: needs-human

## What the lesson says the learner will be able to do

- Names the loose pieces of either side
- Takes a loose piece, the one with the higher counting value first
- Checks for a far-away defender before calling a piece free
- Says when there is nothing to take

## Sources the author names (check that they are used fairly, in our own words)

- sources/sheets/edlasker_chess-strategy.md (K2, K3: count and its spoilers)
- sources/sheets/znosko-borovsky_middle-game.md (C14: real and fictitious threats)
- docs/curriculum-map-v1.md S2 SAF.LOOSE

## How to read this packet

Boards are drawn with capitals for White and lower case for Black, rank 8 at the top unless the board is shown from Black's side. Moves in a line are in standard notation. Statements marked [V] were machine-checked, [I] inference, [H] hypothesis, [S] secondary source, [R] recalled. Please judge the explanations, not only the moves: does each sentence tell the learner why?

---

### Step 1: card

A piece is **loose** when an enemy piece attacks it and none of its own side defends it: the enemy can take it for free. Related words: **undefended** means no friendly piece guards it, even if nobody attacks it yet; **hanging** (*en prise*) means attacked without enough defence; **tactically vulnerable** means defended but still losable to a trick or exchange. Two habits stop most beginner losses. Look at their pieces for loose ones. Then look at your own, after every move your opponent makes.

### Step 2: board

Caption: White to move. Which black piece is loose?

```
  8  . . r . . b k .
  7  p p p . . p p p
  6  . . . . . . . .
  5  . . . n . . . .
  4  . . . . . . . .
  3  . . . . . N . .
  2  P P P . B P P P
  1  . . . R . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 2r2bk1/ppp2ppp/8/3n4/8/5N2/PPP1BPPP/3R2K1 w - - 0 1
```

The line, with the sentence the learner sees at each move:
1. **1. Rxd5**: The rook takes the knight. No black piece defends d5, so nothing recaptures.
2. **1... Re8**: Black has lost a whole knight for nothing.

```
  8  . . . . r b k .
  7  p p p . . p p p
  6  . . . . . . . .
  5  . . . R . . . .
  4  . . . . . . . .
  3  . . . . . N . .
  2  P P P . B P P P
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 4rbk1/ppp2ppp/8/3R4/8/5N2/PPP1BPPP/6K1 w - - 1 2
```

Drawn on the board: arrows d1-d5; highlighted squares d5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [loose_pieces] Only the knight on d5 is loose.
- [material_after_move] Rxd5 wins the knight.

### Step 3: item

**Task `IA1-001`** (select_squares, difficulty cue 1)

Tap every loose Black piece (attacked and not defended).

```
  8  . . r . . . k .
  7  p p p . . p p .
  6  . . . . . . . p
  5  . . . n . . b .
  4  . . . . . . . .
  3  . . . . . N . B
  2  P P P . . P P P
  1  . . . R . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 2r3k1/ppp2pp1/7p/3n2b1/8/5N1B/PPP2PPP/3R2K1 w - - 0 1
```

**Accepted answer:** squares c8, d5

**Explanation shown:** The bishop on h3 attacks the rook on c8 and the rook on d1 attacks the knight on d5; no black piece defends either. The bishop on g5 is attacked by the knight but the h6 pawn defends it.

Hints (in order):
1. Follow each white piece along its lines and note which black pieces it attacks.
2. For each attacked black piece, ask: does any black piece protect it?
3. Two pieces qualify. One stands on the back rank and one in the centre.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [loose_pieces] The rook on c8 and the knight on d5 are loose.
- [attackers] The bishop on h3 attacks the rook on c8.
- [attackers] The rook on d1 attacks the knight on d5.
- [attackers] The knight on f3 attacks the bishop on g5.
- [attackers] The pawn on h6 defends the bishop on g5.

### Step 4: item

**Task `IA1-002`** (find_move, difficulty cue 1)

White to move. Win the most material with one capture.

```
  8  . . r . . . k .
  7  p p p . . p p .
  6  . . . . . . . p
  5  . . . n . . b .
  4  . . . . . . . .
  3  . . . . . N . B
  2  P P P . . P P P
  1  . . . R . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 2r3k1/ppp2pp1/7p/3n2b1/8/5N1B/PPP2PPP/3R2K1 w - - 0 1
```

**Accepted answer(s):** Bxc8

Feedback shown for wrong moves:
- Rxd5: This also wins a piece, but the rook on c8 has the higher counting value and could escape afterwards.
- Nxg5: The h6 pawn recaptures: the bishop on g5 was defended.

**Explanation shown:** Bxc8 takes a rook with nothing to recapture. Rxd5 would win a knight, but the rook on c8 could then step away. Take the loose piece with the higher counting value first.

Hints (in order):
1. Two Black pieces are loose. Which one has the higher counting value?
2. A rook counts 5, a knight 3.
3. Look at your bishop on h3: which black piece does it attack?

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [material_after_move] Bxc8 wins the rook for nothing.
- [best_move_in] Bxc8 is the engine's first choice.
- [move_loses] Rxd5 also wins a piece, but it is clearly worse than taking the rook.

### Step 5: item

**Task `IA1-003`** (select_squares, difficulty cue 2)

Black's bishop has just moved to b4. Tap every loose White piece.

```
  8  . . . r . . k .
  7  p p . . q p p p
  6  . . p . . . . .
  5  . . . . . . . .
  4  . b . . . . . .
  3  . P N . . . . .
  2  P . P . Q P P P
  1  . . . R . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 3r2k1/pp2qppp/2p5/8/1b6/1PN5/P1P1QPPP/3R2K1 w - - 0 1
```

**Accepted answer:** squares c3

**Explanation shown:** The bishop on b4 attacks the knight on c3, and the b-pawn has already left b2, so nothing defends the knight. Your rooks and queen are covered by each other.

Hints (in order):
1. Check your own pieces too, after every opponent move.
2. The new black bishop attacks something. What?
3. A pawn on b2 would defend c3. Where is the b-pawn?

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [loose_pieces] Only the knight on c3 is loose.
- [attackers] The bishop on b4 attacks the knight.
- [attackers] No white piece defends c3: the b-pawn stands on b3.

### Step 6: card

A loose piece is free only on conditions.
**Count every defender**, including pieces that guard from far away along a file or diagonal.
**Ask what the capture costs.** A piece that has a defender is not free: if the defender can recapture, you may lose more than you win.

### Step 7: contrast

Title: Same attack, one change

Prompt: Only the position of White's rook changes.

**The working board:**

**Task `IA1-004`** (find_move, difficulty cue 1)

Black to move. Take the loose piece.

```
  1  . K . . . R . .
  2  P P P B . P P P
  3  . . . . . . . .
  4  . . . . N . . .
  5  . . . . . . . .
  6  . . n . . . p .
  7  p p p b . p . p
  8  . k . . r . . .
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: 3r2k1/p1p1bppp/1p3n2/8/3N4/8/PPP1BPPP/2R3K1 b - - 0 1
```

**Accepted answer(s):** Rxd4

**Explanation shown:** The rook on d8 attacks the knight on d4, and no white piece defends it. ...Rxd4 wins a whole knight.

Hints (in order):
1. Which white piece does your rook on d8 attack?
2. Does any white piece defend that square?
3. The knight on d4 has no defender: the rook on c1 and the bishop on e2 do not cover d4.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [material_after_move] ...Rxd4 wins the knight for nothing.
- [loose_pieces] The knight on d4 is attacked by the rook and has no defender.
- [best_move_in] ...Rxd4 is the engine's first choice.

**The failing board:**

**Task `IA1-005`** (predict_outcome, difficulty cue 2)

Black to move. The white rook on d1 defends the knight on d4. Does ...Rxd4 still win a knight? Predict, then check.

```
  1  . K . . R . . .
  2  P P P B . P P P
  3  . . . . . . . .
  4  . . . . N . . .
  5  . . . . . . . .
  6  . . n . . . p .
  7  p p p b . p . p
  8  . k . . r . . .
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: 3r2k1/p1p1bppp/1p3n2/8/3N4/8/PPP1BPPP/3R2K1 b - - 0 1
```

**Accepted answer:** {"outcome": "no"}

**Explanation shown:** The rook on d1 defends the knight, so after ...Rxd4 Rxd4 Black has given up a rook (5) for a knight (3). A defended piece is only free if the capture costs the capturer nothing.

Hints (in order):
1. Count the defenders of d4 before you capture.
2. Which white piece guards d4 along the d-file?

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [material_after_move] ...Rxd4 Rxd4 gives up a rook for a knight.
- [attackers] One white piece, the rook on d1, defends the knight.
- [loose_pieces] No white piece is loose.

**The irrelevant board:**

**Task `IA1-006`** (predict_outcome, difficulty cue 2)

Black to move. The white knight is on b3 and nothing is attacked. Can Black win a piece for free? Predict, then check.

```
  1  . K . . . R . .
  2  P P P B . P P P
  3  . . . . . . N .
  4  . . . . . . . .
  5  . . . . . . . .
  6  . . n . . . p .
  7  p p p b . p . p
  8  . k . . r . . .
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: 3r2k1/p1p1bppp/1p3n2/8/8/1N6/PPP1BPPP/2R3K1 b - - 0 1
```

**Accepted answer:** {"outcome": "no"}

**Explanation shown:** No white piece is attacked, so there is nothing to take. Looking for a free piece only helps when a piece is loose.

Hints (in order):
1. Which white pieces does Black attack at all?
2. A piece nobody attacks cannot be won, whether defended or not.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [loose_pieces] No white piece is loose.
- [eval_range] The engine rates the position as roughly equal.
- [quiet_position] No line wins more than a pawn for Black.

### Step 8: item  (shown without telling the learner the topic: unlabeled test)

**Task `IA1-007`** (find_move, difficulty cue 3)

White to move. Is anything free to take? If so, play it.

```
  8  . . . . . r k .
  7  p p p . q p p p
  6  . . . . . . . .
  5  . . . . . . . b
  4  . . . . . . . .
  3  . . N . . . . .
  2  P P P . . P P P
  1  . . . Q . R K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 5rk1/ppp1qppp/8/7b/8/2N5/PPP2PPP/3Q1RK1 w - - 0 1
```

**Accepted answer(s):** Qxh5

Feedback shown for wrong moves:
- Qd5: This leaves the bishop free to take your queen on d1.
- Qe1: This avoids the attack but wins nothing.

**Explanation shown:** The black bishop attacks your queen, but it has no defender, so the queen can take it first.

Hints (in order):
1. Black's last move attacked something of yours. Is it safe to simply take?
2. Check whether any black piece defends the bishop.
3. The queen can capture along the long diagonal.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [material_after_move] Qxh5 wins the bishop for nothing.
- [loose_pieces] The bishop on h5 is loose.
- [best_move_in] Qxh5 is the engine's first choice.

### Step 9: item  (shown without telling the learner the topic: unlabeled test)

**Task `IA1-008`** (classify_position, difficulty cue 3)

White to move. Is anything free to take?

```
  8  . . r . . . k .
  7  p b p . . p p p
  6  . p . . . . . .
  5  . . . n . . . .
  4  . . . . . . . .
  3  . . . . . N . .
  2  P P P . B P P P
  1  . . . R . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 2r3k1/pbp2ppp/1p6/3n4/8/5N2/PPP1BPPP/3R2K1 w - - 0 1
```

Options shown: Yes, a piece is free / No, nothing is free

**Accepted answer:** {"class": "No, nothing is free"}

**Explanation shown:** The rook attacks the knight on d5, but the bishop on b7 defends it from across the board. Taking it would cost a rook for a knight.

Hints (in order):
1. Which black pieces are attacked?
2. Check the long diagonals and files for a defender far away.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [material_after_move] Rxd5 Bxd5 gives up a rook for a knight.
- [attackers] The bishop on b7 defends the knight on d5.
- [loose_pieces] No black piece is loose.

### Step 10: practice

A drill of 4 tasks drawn from the bank by tag ['theme.hangingPiece', 'cue.3'] (78 tasks carry those tags). Not reproduced here; ask for a sample if you want one checked.

### Step 11: practice

A drill of 4 tasks drawn from the bank by tag ['node.SAF.LOOSE'] (128 tasks carry those tags). Not reproduced here; ask for a sample if you want one checked.

### Step 12: reflect

Kind: unsure

Prompt: When you decided a piece was free, what did you check first? Did you ever miss a defender that stood far away?

---

## Reviewer scorecard

Fill in the file `content/review/L-SAF-LOOSE-1.json` (a template is below). Scale 1 to 5 for each dimension: 1 = wrong or unusable, 3 = acceptable with edits, 5 = I would put my name to it as it stands.
Revision to review: `f9bc3478`. If the lesson text changes after your review, your sign-off no longer applies and the lesson goes back to needs-human.

| Dimension | What to judge | Score |
|---|---|---|
| chess | every statement, line and explanation is correct; near-misses are really near-misses | |
| clarity | the explanation actually explains (mechanism, conditions), in plain words | |
| prerequisites | the lesson assumes only what the learner has met | |
| tasks | each task has one defensible answer and a fair explanation | |

```json
{
  "lesson": "L-SAF-LOOSE-1",
  "revision": "f9bc3478",
  "reviewer": "<your name>",
  "reviewer_role": "strong-player",
  "date": "YYYY-MM-DD",
  "scores": {"chess": 0, "clarity": 0, "prerequisites": 0, "tasks": 0},
  "comments": "<what to change, by step number>",
  "verdict": "approved"
}
```

`reviewer_role` is `strong-player` or `teacher`. `verdict` is `approved` or `changes-requested`. See docs/review-slice.md.
