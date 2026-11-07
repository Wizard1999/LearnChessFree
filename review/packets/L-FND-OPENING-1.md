# Review packet: L-FND-OPENING-1

**Your first moves: three habits**

- Skill: OPN.PRINCIPLES (D1); stage: S2; stated length: 9 minutes
- Steps: 13 (6 are tasks); revision: `dc0410c9`
- Review status now: needs-human

## What the lesson says the learner will be able to do

- Takes space in the centre with a pawn on move one
- Brings knights out toward the centre, and castles when the squares are clear
- Knows these are habits with conditions: a threat or a concrete tactic can override them

## Sources the author names (check that they are used fairly, in our own words)

- docs/first-hours.md session 4
- docs/council-synthesis.md CD-3, CD-4
- sources/sheets/capablanca_chess-fundamentals.md (CI-45, CI-46, CI-47, held as conditioned defaults)
- sources/sheets/edlasker_chess-strategy.md (K13: pawn moves and the opening aim)

## How to read this packet

Boards are drawn with capitals for White and lower case for Black, rank 8 at the top unless the board is shown from Black's side. Moves in a line are in standard notation. Statements marked [V] were machine-checked, [I] inference, [H] hypothesis, [S] secondary source, [R] recalled. Please judge the explanations, not only the moves: does each sentence tell the learner why?

---

### Step 1: card

Early in a game your pieces start behind pawns. Three habits help: **1.** Put a pawn in the centre (e4 or d4) to give pieces room. **2.** Bring your knights and bishops out toward the middle (this is called **developing** them), each piece once. **3.** Castle early to tuck your king away. They are habits, not laws: a threat from your opponent comes first.

### Step 2: board

Caption: A pawn to e4 takes space in the centre. Black does the same.

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

White to move. Capitals = White, lower case = Black. Starting position.
FEN: rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
```

The line, with the sentence the learner sees at each move:
1. **1. e4**: The pawn takes space in the centre.
2. **1... e5**: Black answers in the same way.

```
  8  r n b q k b n r
  7  p p p p . p p p
  6  . . . . . . . .
  5  . . . . p . . .
  4  . . . . P . . .
  3  . . . . . . . .
  2  P P P P . P P P
  1  R N B Q K B N R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2
```

Drawn on the board: arrows e2-e4; highlighted squares e4, e5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] (no sentence; a rules check)

### Step 3: contrast

Title: Centre pawn, edge pawn

Prompt: In the second case White opened with the edge pawn a4 instead of e4. Predict first: can the bishop on f1 move?

**The working board:**

**Task `IA0-95`** (predict_outcome, difficulty cue 2)

White opened with the pawn move e4 and Black answered e5. Can White's bishop on f1 move now? Predict, then check.

```
  8  r n b q k b n r
  7  p p p p . p p p
  6  . . . . . . . .
  5  . . . . p . . .
  4  . . . . P . . .
  3  . . . . . . . .
  2  P P P P . P P P
  1  R N B Q K B N R
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2
```

**Accepted answer:** {"outcome": "yes"}

**Explanation shown:** With the e-pawn gone from e2, the bishop on f1 has a long diagonal (five squares) and the queen on d1 can move too. One pawn move gave two pieces room.

Hints (in order):
1. Look at the diagonals leaving f1. Which pawn used to block the nearest one?
2. The e-pawn moved from e2 to e4.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_destinations] The bishop on f1 can go to these five squares.
- [legal_destinations] The queen on d1 can go to these four squares.

**The failing board:**

**Task `IA0-96`** (predict_outcome, difficulty cue 3)

This time White opened with the edge pawn a4, and Black answered e5. Can White's bishop on f1 move now? Predict, then check.

```
  8  r n b q k b n r
  7  p p p p . p p p
  6  . . . . . . . .
  5  . . . . p . . .
  4  P . . . . . . .
  3  . . . . . . . .
  2  . P P P P P P P
  1  R N B Q K B N R
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: rnbqkbnr/pppp1ppp/8/4p3/P7/8/1PPPPPPP/RNBQKBNR w KQkq - 0 2
```

**Accepted answer:** {"outcome": "no"}

**Explanation shown:** The pawn on e2 and the pawn on g2 still block the bishop, and the queen is boxed in too. The a4 pawn move did not give any piece more room.

Hints (in order):
1. Which pawn blocks the bishop's diagonals now?
2. Did the a-pawn's move free any piece?

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_destinations] The bishop on f1 has no moves.
- [legal_destinations] The queen on d1 has no moves.

### Step 4: card

Pieces work best where they reach many squares. A knight in the middle of the board reaches up to eight squares; on the edge, at most four, and in a corner only two. So bring pieces toward the centre, and bring each new piece out rather than moving the same one again and again.

### Step 5: board

Caption: The knight on d4 reaches eight squares, the one on the h-file four, and the one in the corner two.

```
  8  k . . . . . . .
  7  . . . . . . . .
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . N . . . N
  3  . . . . . . . .
  2  . . . . . . . .
  1  N . . . K . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: k7/8/8/8/3N3N/8/8/N3K3 w - - 0 1
```

Drawn on the board: arrows d4-b5, h4-g6, a1-b3; highlighted squares b3, b5, c2, c6, e2, e6, f3, f5, f3, f5, g2, g6, b3, c2.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_destinations] (no sentence; a rules check)
- [legal_destinations] (no sentence; a rules check)
- [legal_destinations] (no sentence; a rules check)

### Step 6: contrast

Title: Same knight, other square

Prompt: Both Nf3 and Nh3 bring the knight out. Predict first: do they work equally well?

**The working board:**

**Task `IA0-99`** (find_move, difficulty cue 2)

White to move. Bring a knight into play on a good square.

```
  8  r n b q k b n r
  7  p p p p . p p p
  6  . . . . . . . .
  5  . . . . p . . .
  4  . . . . P . . .
  3  . . . . . . . .
  2  P P P P . P P P
  1  R N B Q K B N R
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2
```

**Accepted answer(s):** Nf3, Nc3

**Explanation shown:** A knight jumps to a square in the centre and sees many more squares than from the edge. Nf3 and Nc3 are the engine's favourites in this position.

Hints (in order):
1. Which pieces have not moved yet? The knights are the quickest to bring out.
2. A knight is happiest where it can reach many squares. That is near the middle of the board.
3. Each knight has a central square: f3 for one, c3 for the other.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] Nf3 and Nc3 are among the engine's best moves here.
- [legal_move] Nf3 is legal.
- [legal_move] Nc3 is legal.

**The failing board:**

**Task `IA0-100`** (predict_outcome, difficulty cue 3)

The knight could also go to the edge, Nh3. Is that as good as Nf3? Predict, then check.

```
  8  r n b q k b n r
  7  p p p p . p p p
  6  . . . . . . . .
  5  . . . . p . . .
  4  . . . . P . . .
  3  . . . . . . . .
  2  P P P P . P P P
  1  R N B Q K B N R
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2
```

**Accepted answer:** {"outcome": "no"}

**Explanation shown:** A knight on the edge reaches fewer squares than one nearer the centre (see the board above). The engine rates Nh3 more than a pawn worse than Nf3.

Hints (in order):
1. How many squares does a knight on the edge reach? Think of the lone knights in the last two boards.
2. Compare f3 with h3.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [move_loses] Nh3 is rated at least a pawn worse than the best move.

### Step 7: card

Your king is safest tucked behind its pawns in the corner, and castling also brings a rook toward the middle. Be careful with pawns in front of your king: every pawn move changes the shelter and leaves weak squares that enemy pieces can use. Here is how quickly that can go wrong.

### Step 8: board

Caption: After 1.f3 e5 2.g4, Black plays Qh4 and it is checkmate.

```
  8  r n b q k b n r
  7  p p p p . p p p
  6  . . . . . . . .
  5  . . . . p . . .
  4  . . . . . . P .
  3  . . . . . P . .
  2  P P P P P . . P
  1  R N B Q K B N R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: rnbqkbnr/pppp1ppp/8/4p3/6P1/5P2/PPPPP2P/RNBQKBNR b KQkq - 0 2
```

The line, with the sentence the learner sees at each move:
1. **2... Qh4#**: The queen gives check along the diagonal. White has no answer.

```
  8  r n b . k b n r
  7  p p p p . p p p
  6  . . . . . . . .
  5  . . . . p . . .
  4  . . . . . . P q
  3  . . . . . P . .
  2  P P P P P . . P
  1  R N B Q K B N R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: rnb1kbnr/pppp1ppp/8/4p3/6Pq/5P2/PPPPP2P/RNBQKBNR w KQkq - 1 3
```

Drawn on the board: arrows d8-h4, h4-e1; highlighted squares h4, e1.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [mate_in] (no sentence; a rules check)

### Step 9: item

**Task `IA0-102`** (find_move, difficulty cue 2)

Black to move. White has played f3 and g4. Find checkmate.

```
  1  R N B K Q B N R
  2  P . . P P P P P
  3  . . P . . . . .
  4  . P . . . . . .
  5  . . . p . . . .
  6  . . . . . . . .
  7  p p p . p p p p
  8  r n b k q b n r
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: rnbqkbnr/pppp1ppp/8/4p3/6P1/5P2/PPPPP2P/RNBQKBNR b KQkq - 0 2
```

**Accepted answer(s):** Qh4#

**Explanation shown:** The queen slides along d8-e7-f6-g5-h4 and gives check. White's king has no square to go to and nothing can block or capture: checkmate in two moves of the game.

Hints (in order):
1. Which diagonal leads to White's king?
2. The queen on d8 can slide a long way. Where does the diagonal end?

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [mate_in] Qh4 is checkmate.

### Step 10: item

**Task `IA0-101`** (find_move, difficulty cue 1)

White to move. Get the king to safety and bring a rook toward the centre.

```
  8  r . b q k . . r
  7  p p p p . p p p
  6  . . n . . n . .
  5  . B . . p . . .
  4  . b . . P . . .
  3  . . N . . N . .
  2  P P P P . P P P
  1  R . B Q K . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: r1bqk2r/pppp1ppp/2n2n2/1B2p3/1b2P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 6 5
```

**Accepted answer(s):** O-O

**Explanation shown:** The king and the rook are both unmoved and the squares between are empty, so White can castle. The engine rates castling as the best move here.

Hints (in order):
1. Which single move moves the king and a rook?
2. Kingside castling is available: check that the squares between king and rook are empty.
3. Move the king two squares toward the h-file.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] Castling is the engine's best move here.
- [legal_move] White can castle kingside.

### Step 11: item

**Task `IA0-103`** (classify_position, difficulty cue 3)

White to move, early in the game. Which kind of move is the most useful here?

```
  8  r n b q k b n r
  7  p p p p . p p p
  6  . . . . . . . .
  5  . . . . p . . .
  4  . . . . P . . .
  3  . . . . . . . .
  2  P P P P . P P P
  1  R N B Q K B N R
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2
```

**Accepted answer:** {"class": "develop a piece"}

**Explanation shown:** Nothing is threatened and castling is not possible yet (the bishop and knight are still in the way), so the useful move is to bring a piece out.

Hints (in order):
1. Is there a threat against you? Can you castle yet?
2. Which pieces are still at home?

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] Developing a knight is the engine's top choice.

### Step 12: item

**Task `IA0-104`** (classify_position, difficulty cue 3)

White to move, early in the game. Which kind of move is the most useful here?

```
  8  r . b q k . . r
  7  p p p p . p p p
  6  . . n . . n . .
  5  . B . . p . . .
  4  . b . . P . . .
  3  . . N . . N . .
  2  P P P P . P P P
  1  R . B Q K . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: r1bqk2r/pppp1ppp/2n2n2/1B2p3/1b2P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 6 5
```

**Accepted answer:** {"class": "castle"}

**Explanation shown:** Most pieces are developed, nothing is threatened, and castling is available. The king and rook are ready, so castling is the most useful move.

Hints (in order):
1. Is there a threat against you? Can you castle?
2. How many pieces are still at home?

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] Castling is the engine's top choice.

### Step 13: reflect

Kind: expect

Prompt: Before you answered the last three questions: what did you check first, a threat against you, a piece to develop, or castling? Why that order?

---

## Reviewer scorecard

Fill in the file `content/review/L-FND-OPENING-1.json` (a template is below). Scale 1 to 5 for each dimension: 1 = wrong or unusable, 3 = acceptable with edits, 5 = I would put my name to it as it stands.
Revision to review: `dc0410c9`. If the lesson text changes after your review, your sign-off no longer applies and the lesson goes back to needs-human.

| Dimension | What to judge | Score |
|---|---|---|
| chess | every statement, line and explanation is correct; near-misses are really near-misses | |
| clarity | the explanation actually explains (mechanism, conditions), in plain words | |
| prerequisites | the lesson assumes only what the learner has met | |
| tasks | each task has one defensible answer and a fair explanation | |

```json
{
  "lesson": "L-FND-OPENING-1",
  "revision": "dc0410c9",
  "reviewer": "<your name>",
  "reviewer_role": "strong-player",
  "date": "YYYY-MM-DD",
  "scores": {"chess": 0, "clarity": 0, "prerequisites": 0, "tasks": 0},
  "comments": "<what to change, by step number>",
  "verdict": "approved"
}
```

`reviewer_role` is `strong-player` or `teacher`. `verdict` is `approved` or `changes-requested`. See docs/review-slice.md.
