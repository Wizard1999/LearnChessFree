# Review packet: L-FND-KNIGHT-1

**The knight: the piece that jumps**

- Skill: FND.PIECE.KNIGHT (D1); stage: S0; stated length: 8 minutes
- Steps: 12 (7 are tasks); revision: `94651aec`
- Review status now: needs-human

## What the lesson says the learner will be able to do

- Taps every square a knight can jump to, including captures
- Knows the knight is not blocked by pieces in between, unlike rooks and bishops
- Tells which pieces can reach a square when nobody names the piece

## Sources the author names (check that they are used fairly, in our own words)

- docs/first-hours.md session 1
- docs/council-synthesis.md CD-1, CD-4

## How to read this packet

Boards are drawn with capitals for White and lower case for Black, rank 8 at the top unless the board is shown from Black's side. Moves in a line are in standard notation. Statements marked [V] were machine-checked, [I] inference, [H] hypothesis, [S] secondary source, [R] recalled. Please judge the explanations, not only the moves: does each sentence tell the learner why?

---

### Step 1: card

The **knight** moves in an L: two squares along a rank or a file, then one square to the side. It is the only piece that **jumps over** other pieces. It lands on an empty square or captures an enemy piece, but never lands on its own piece. Every jump ends on a square of the opposite colour.

### Step 2: board

Caption: The knight jumps over the ring of pawns. Seven landing squares are open.

```
  8  . . . . . . . k
  7  . . . . . . . .
  6  . . . . . . . .
  5  . p p p p . . .
  4  . . P N P . . .
  3  . . P P P B . .
  2  . . . . . . . .
  1  . . . . . . . K
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 7k/8/8/1pppp3/2PNP3/2PPPB2/8/7K w - - 0 1
```

Drawn on the board: arrows d4-b5, d4-e6; highlighted squares b3, b5, c2, c6, e2, e6, f5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_destinations] (no sentence; a rules check)

### Step 3: item

**Task `IA0-31`** (select_squares, difficulty cue 1)

Tap every square the white knight on d4 can move to.

```
  8  . . . . . . . k
  7  . . . . . . . .
  6  . . . . . . . .
  5  . p p p p . . .
  4  . . P N P . . .
  3  . . P P P B . .
  2  . . . . . . . .
  1  . . . . . . . K
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 7k/8/8/1pppp3/2PNP3/2PPPB2/8/7K w - - 0 1
```

**Accepted answer:** squares b3, b5, c2, c6, e2, e6, f5 (from d4)

**Explanation shown:** The knight jumps over the ring of pawns. Of its eight landing squares, f3 holds White's own bishop, so seven remain, and one of them (b5) captures a black pawn.

Hints (in order):
1. A knight jumps in an L: two squares along a rank or file, then one square sideways. Count the eight possible landing squares.
2. Knights jump over other pieces, so the crowd around the knight does not matter. Only the landing squares matter.
3. A landing square is out if it holds one of your own pieces. An enemy piece there can be captured.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_destinations] These are exactly the squares the knight on d4 can move to.

### Step 4: item

**Task `IG-MOVE-145`** (select_squares, difficulty cue 1)

White to move. Tap every square the white knight on c6 can move to.

```
  8  . . . . . . . .
  7  . . . . . . . .
  6  . . N . . . . .
  5  . . . . . . . .
  4  . . . . . K . .
  3  . . . . . . . .
  2  . . k . . . . .
  1  . . . . . . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 8/8/2N5/8/5K2/8/2k5/8 w - - 0 1
```

**Accepted answer:** squares a5, a7, b4, b8, d4, d8, e5, e7 (from c6)

**Explanation shown:** The knight on c6 can move to 8 squares: a5, a7, b4, b8, d4, d8, e5, e7.

Hints (in order):
1. A knight jumps in an L: two squares one way and one square at a right angle. Start from c6.
2. It jumps over other pieces, so nothing blocks it. It only cannot land on its own pieces; an enemy piece on a landing square can be captured.
3. There are at most eight landing squares. Check them in order: two up, two down, two left, two right, each with one step to the side.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_destinations] The white knight on c6 can legally move to exactly these squares.

### Step 5: card

Rooks, bishops and queens need a clear path. A knight does not: it only needs a landing square that is not held by its own piece. That is why, at the start of a game, a knight can move while most other pieces cannot.

### Step 6: contrast

Title: A crowd does not stop a knight

Prompt: Every piece on the back row (where the pieces start) is boxed in by pawns. Predict first: which of these can move at the start, the knight on b1 or the bishop on c1?

**The working board:**

**Task `IA0-33`** (predict_outcome, difficulty cue 2)

At the start of the game, can White's knight on b1 move? Predict, then check.

```
  8  r n b q k b n r
  7  p p p p p p p p
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  P P P P P P P P
  1  R N B Q K B N R
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
```

**Accepted answer:** {"outcome": "yes"}

**Explanation shown:** The knight on b1 jumps over the pawns and lands on a3 or c3. Both landing squares are empty.

Hints (in order):
1. Look at the squares around b1. Are they all occupied?
2. A knight does not need an empty path. It only needs an empty landing square.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_destinations] The knight on b1 can go to exactly these squares.

**The failing board:**

**Task `IA0-34`** (predict_outcome, difficulty cue 3)

At the start of the game, can White's bishop on c1 move? Predict, then check.

```
  8  r n b q k b n r
  7  p p p p p p p p
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  P P P P P P P P
  1  R N B Q K B N R
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
```

**Accepted answer:** {"outcome": "no"}

**Explanation shown:** The pawns on b2 and d2 block both of the bishop's diagonals, and a bishop cannot jump. A knight only needs an empty landing square, so it can move.

Hints (in order):
1. A bishop slides along diagonals. What stands on the first square of each diagonal?
2. Bishops and rooks cannot jump.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_destinations] The bishop on c1 has no moves.

### Step 7: board

Caption: To reach e5 from g1 the knight needs two jumps: first f3, then e5.

```
  8  . . . . . . . k
  7  . . . . . . . .
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  K . . . . . N .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 7k/8/8/8/8/8/8/K5N1 w - - 0 1
```

The line, with the sentence the learner sees at each move:
1. **1. Nf3**: First jump: from g1 to f3.
2. **1... Kg8**: Black's king makes a move.
3. **2. Ne5**: Second jump: from f3 to e5.

```
  8  . . . . . . k .
  7  . . . . . . . .
  6  . . . . . . . .
  5  . . . . N . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  K . . . . . . .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 6k1/8/8/4N3/8/8/8/K7 b - - 3 2
```

Drawn on the board: arrows g1-f3, f3-e5; highlighted squares f3, e5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_destinations] (no sentence; a rules check)

### Step 8: item

**Task `IA0-35`** (select_squares, difficulty cue 1)

Tap every black piece the white knight can capture.

```
  8  . . . . . . . k
  7  . . . . . . . .
  6  . . . . b . . .
  5  . p . p r . . .
  4  . . . N . . . .
  3  . . . . . p . .
  2  . . . . . . . .
  1  . . . . . . . K
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 7k/8/4b3/1p1pr3/3N4/5p2/8/7K w - - 0 1
```

**Accepted answer:** squares b5, e6, f3

**Explanation shown:** The knight captures only on its landing squares: b5, e6 and f3. The pawn on d5 and the rook on e5 are right next to it, and one step away is not an L-jump.

Hints (in order):
1. List the knight's eight landing squares from d4. Which hold a black piece?
2. A black piece next to the knight is not necessarily on a landing square.
3. The pawn on d5 and the rook on e5 are close, but they are not an L-jump away.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] The knight can capture the pawn on b5.
- [legal_move] The knight can capture the bishop on e6.
- [legal_move] The knight can capture the pawn on f3.
- [illegal_move] The knight cannot capture the pawn on d5.
- [illegal_move] The knight cannot capture the rook on e5.

### Step 9: item

**Task `IA0-36`** (select_squares, difficulty cue 3)

Tap every white piece that can move to d5.

```
  8  . . . . . . k .
  7  . . . . . . . .
  6  . . . . . . . .
  5  . . . . . . . .
  4  . N . . . . . .
  3  . . . . . . . .
  2  . . . . . . B .
  1  R . . . . . . K
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 6k1/8/8/8/1N6/8/6B1/R6K w - - 0 1
```

**Accepted answer:** squares b4, g2

**Explanation shown:** The knight jumps from b4 to d5. The bishop slides along the long diagonal g2-f3-e4-d5. The rook on a1 only uses the a-file and the first rank.

Hints (in order):
1. Check each white piece in turn: rook, knight, bishop, king.
2. Knights jump in an L, bishops slide along diagonals, rooks along ranks and files.
3. Two pieces can go there; the rook on a1 is not one of them.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] The knight can jump to d5.
- [legal_move] The bishop can slide to d5.
- [illegal_move] The rook cannot reach d5.
- [attackers] Exactly two white pieces reach d5.

### Step 10: item

**Task `IA0-37`** (select_squares, difficulty cue 3)

Tap every white piece that can capture the black pawn on f7.

```
  8  . . . . . . . k
  7  . . . . . p . .
  6  . . . N . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  . . B . . R . K
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 7k/5p2/3N4/8/8/8/8/2B2R1K w - - 0 1
```

**Accepted answer:** squares d6, f1

**Explanation shown:** The knight on d6 jumps to f7, and the rook on f1 slides up the open f-file. The bishop on c1 is on the diagonal c1-h6, which does not include f7.

Hints (in order):
1. Check each white piece in turn.
2. The rook needs an open file. The bishop needs a diagonal.
3. One of the two is a knight jump. The other uses the f-file.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] The knight can capture on f7.
- [legal_move] The rook can capture on f7.
- [illegal_move] The bishop cannot reach f7.
- [attackers] Exactly two white pieces attack f7.

### Step 11: practice

A drill of 6 tasks drawn from the bank by tag ['node.FND.PIECE.KNIGHT', 'kind.generated'] (36 tasks carry those tags). Not reproduced here; ask for a sample if you want one checked.

### Step 12: reflect

Kind: expect

Prompt: Before the 'which pieces can reach' questions: did you picture the knight's L-shape or a path of squares? Which worked better?

---

## Reviewer scorecard

Fill in the file `content/review/L-FND-KNIGHT-1.json` (a template is below). Scale 1 to 5 for each dimension: 1 = wrong or unusable, 3 = acceptable with edits, 5 = I would put my name to it as it stands.
Revision to review: `94651aec`. If the lesson text changes after your review, your sign-off no longer applies and the lesson goes back to needs-human.

| Dimension | What to judge | Score |
|---|---|---|
| chess | every statement, line and explanation is correct; near-misses are really near-misses | |
| clarity | the explanation actually explains (mechanism, conditions), in plain words | |
| prerequisites | the lesson assumes only what the learner has met | |
| tasks | each task has one defensible answer and a fair explanation | |

```json
{
  "lesson": "L-FND-KNIGHT-1",
  "revision": "94651aec",
  "reviewer": "<your name>",
  "reviewer_role": "strong-player",
  "date": "YYYY-MM-DD",
  "scores": {"chess": 0, "clarity": 0, "prerequisites": 0, "tasks": 0},
  "comments": "<what to change, by step number>",
  "verdict": "approved"
}
```

`reviewer_role` is `strong-player` or `teacher`. `verdict` is `approved` or `changes-requested`. See docs/review-slice.md.
