# Review packet: L-FND-NOTATION-1

**Reading and writing a move**

- Skill: FND.NOTATION (D1); stage: S2; stated length: 12 minutes
- Steps: 15 (11 are tasks); revision: `40ed85f5`
- Review status now: needs-human

## What the lesson says the learner will be able to do

- Names the piece, the squares and any capture, check or castling in a written move
- Plays an eight-move score on the board, from either colour and on a turned board
- Adds a file letter (or a rank number when both pieces share a file) when two pieces of the same kind can make the move
- Knows that marks such as ! and ? do not change the move

## Sources the author names (check that they are used fairly, in our own words)

- content/skills/FND.NOTATION.json (conditions and contrasts)
- standard algebraic notation (FIDE Laws of Chess, Appendix C) [R]
- docs/lessons-t0.md (lesson order: after L-FND-CASTLE-1)

## How to read this packet

Boards are drawn with capitals for White and lower case for Black, rank 8 at the top unless the board is shown from Black's side. Moves in a line are in standard notation. Statements marked [V] were machine-checked, [I] inference, [H] hypothesis, [S] secondary source, [R] recalled. Please judge the explanations, not only the moves: does each sentence tell the learner why?

---

### Step 1: card

A move record says **which piece** and **where it lands**. K king, Q queen, R rook, B bishop, N knight; a pawn move has no letter. **x** capture, **+** check, **#** checkmate, **O-O** castling kingside (**O-O-O** queenside), **=Q** a pawn becomes a queen. A number counts one White move and Black's reply: 1.e4 d5. Dots (1...d5) mark Black's move when a score starts with it.

### Step 2: board

Caption: A short score, played from the start. Read each record, then watch the move.

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
1. **1. e4**: 1.e4: no letter, so a pawn moves, to e4.
2. **1... d5**: 1...d5: three dots mark a Black move shown alone. In a row it is written 1.e4 d5.
3. **2. exd5**: 2.exd5: the e-pawn captures on d5. The x marks a capture.
4. **2... Qxd5**: 2...Qxd5: the queen (Q) captures the pawn on d5.
5. **3. Nc3**: 3.Nc3: N is the knight; it lands on c3.
6. **3... Qa5**: 3...Qa5: no x, because nothing is captured on a5.
7. **4. d4**: 4.d4: a pawn move again, so there is no letter.
8. **4... Nf6**: 4...Nf6: Black's knight goes to f6.

```
  8  r n b . k b . r
  7  p p p . p p p p
  6  . . . . . n . .
  5  q . . . . . . .
  4  . . . P . . . .
  3  . . N . . . . .
  2  P P P . . P P P
  1  R . B Q K B N R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: rnb1kb1r/ppp1pppp/5n2/q7/3P4/2N5/PPP2PPP/R1BQKBNR w KQkq - 1 5
```

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] 1.e4 is legal from the start.
- [piece_on] A white pawn stands on e2 at the start.

### Step 3: item

**Task `IB3-103`** (find_move, difficulty cue 1)

White to move. The score says exd5. The e is the file the pawn starts from and x marks a capture. Play that move.

```
  8  r n b q k b n r
  7  p p p . p p p p
  6  . . . . . . . .
  5  . . . p . . . .
  4  . . . . P . . .
  3  . . . . . . . .
  2  P P P P . P P P
  1  R N B Q K B N R
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2
```

**Accepted answer(s):** exd5

**Explanation shown:** A pawn move has no piece letter, so a pawn capture names the file the pawn starts from: e. The x marks the capture on d5.

Hints (in order):
1. A pawn capture starts with the file the pawn leaves from. Which file is that?
2. The x says that something is captured. What stands on d5?
3. The pawn on e4 takes the pawn on d5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] The pawn on e4 can capture on d5.
- [piece_on] A black pawn stands on d5, so the move is a capture.

### Step 4: item

**Task `IB3-105`** (find_move, difficulty cue 1)

White to move. The score says O-O. That is the record for castling on the kingside. Play it by moving the king.

```
  8  r . b q k . . r
  7  p p p p . p p p
  6  . . n . . n . .
  5  . . b . p . . .
  4  . . B . P . . .
  3  . . . P . N . .
  2  P P P . . P P P
  1  R N B Q K . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 1 5
```

**Accepted answer(s):** O-O

**Explanation shown:** O-O is castling on the kingside: the king goes to g1 and the rook jumps to f1. (Castling on the queenside is written O-O-O.)

Hints (in order):
1. This record has no piece letter and no square. It is a special sign.
2. O-O means castling on the kingside, the side of the h-file rook.
3. Move the king two squares to g1; the rook follows.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] White can castle on the kingside.
- [piece_on] The king goes to g1.
- [piece_on] The rook goes to f1.

### Step 5: card

A record must name exactly one move. If two pieces of the same kind can reach the square, add the file the mover leaves from (**Nbd2**); if both stand on the same file, add the rank instead (**R1a3**). The marks **!** and **?** are a writer's opinion; they change nothing. The same record works for either colour and for a board turned around: square names do not change.

### Step 6: contrast

Title: Is the record enough?

Prompt: Two knights, one square, one change. Predict, then check.

**The working board:**

**Task `IB3-111`** (predict_outcome, difficulty cue 2)

White knights stand on b1 and h3. A score says Nd2. Is that enough to tell exactly which move was played? Predict, then check.

```
  8  r n b q k b . r
  7  p p p . . p p p
  6  . . . . p n . .
  5  . . . p . . . .
  4  . . . P . . . .
  3  . . . . P . . N
  2  P P P . . P P P
  1  R N B Q K B . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: rnbqkb1r/ppp2ppp/4pn2/3p4/3P4/4P2N/PPP2PPP/RNBQKB1R w KQkq - 0 4
```

**Accepted answer:** {"outcome": "yes"}

**Explanation shown:** Only the knight on b1 can reach d2, so Nd2 can mean only one move.

Hints (in order):
1. Which white knights can reach d2?
2. Check each knight in turn: b1 and h3.
3. Only one of them can get to d2.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] The knight on b1 can go to d2.
- [illegal_move] The knight on h3 cannot reach d2.

**The failing board:**

**Task `IB3-112`** (predict_outcome, difficulty cue 2)

White knights stand on b1 and f3. A score says Nd2. Is that enough to tell exactly which move was played? Predict, then check.

```
  8  r n b q k b . r
  7  p p p . . p p p
  6  . . . . p n . .
  5  . . . p . . . .
  4  . . . P . . . .
  3  . . . . P N . .
  2  P P P . . P P P
  1  R N B Q K B . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: rnbqkb1r/ppp2ppp/4pn2/3p4/3P4/4PN2/PPP2PPP/RNBQKB1R w KQkq - 0 4
```

**Accepted answer:** {"outcome": "no"}

**Explanation shown:** Both knights can reach d2, so Nd2 could mean two different moves. The record needs the file: Nbd2 or Nfd2.

Hints (in order):
1. Which white knights can reach d2?
2. Check each knight in turn: b1 and f3.
3. Both of them can get to d2.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [piece_attacks] The knight on b1 can reach d2.
- [piece_attacks] The knight on f3 can also reach d2.
- [legal_destinations] The knight on b1 can legally go to a3, c3 and d2.
- [legal_destinations] The knight on f3 can legally go to d2, e5, g1, g5 and h4.

**The irrelevant board:**

**Task `IB3-113`** (predict_outcome, difficulty cue 2)

White knights stand on b1 and h3. A score says Nd2! (the ! is a commentator's mark). Is that enough to tell exactly which move was played? Predict, then check.

```
  8  r n b q k b . r
  7  p p p . . p p p
  6  . . . . p n . .
  5  . . . p . . . .
  4  . . . P . . . .
  3  . . . . P . . N
  2  P P P . . P P P
  1  R N B Q K B . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: rnbqkb1r/ppp2ppp/4pn2/3p4/3P4/4P2N/PPP2PPP/RNBQKB1R w KQkq - 0 4
```

**Accepted answer:** {"outcome": "yes"}

**Explanation shown:** Marks such as ! and ? are opinions added by the writer. They do not change which piece moved or where. Only the knight on b1 can reach d2, so Nd2! is one move.

Hints (in order):
1. Which white knights can reach d2?
2. A mark like ! or ? is the writer's opinion about the move. Does it change which move was played?
3. Only the knight on b1 can reach d2.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [piece_attacks] The knight on b1 can reach d2.
- [piece_attacks] The knight on h3 cannot reach d2.
- [legal_destinations] The knight on b1 can legally go to a3, c3 and d2.

### Step 7: item

**Task `IB3-106`** (find_move, difficulty cue 1)

White to move. Both white knights can reach d2. The score says Nbd2: the b says which knight. Play that move.

```
  8  r n b q k b . r
  7  p p p . . p p p
  6  . . . . p n . .
  5  . . . p . . . .
  4  . . . P . . . .
  3  . . . . P N . .
  2  P P P . . P P P
  1  R N B Q K B . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: rnbqkb1r/ppp2ppp/4pn2/3p4/3P4/4PN2/PPP2PPP/RNBQKB1R w KQkq - 0 4
```

**Accepted answer(s):** Nbd2

Feedback shown for wrong moves:
- Nfd2: That is the other knight, from f3. It would be written Nfd2.

**Explanation shown:** Both knights reach d2, so Nd2 alone would not say which one moves. The file letter fixes it: Nbd2 is the knight from b1, Nfd2 would be the knight from f3.

Hints (in order):
1. Two knights could go to d2. The record must tell them apart.
2. The letter after N is the file the knight starts from.
3. The knight on the b-file, on b1, goes to d2.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] The knight on b1 can go to d2.
- [legal_move] The knight on f3 can also go to d2.

### Step 8: item

**Task `IB3-113`** (predict_outcome, difficulty cue 2)

White knights stand on b1 and h3. A score says Nd2! (the ! is a commentator's mark). Is that enough to tell exactly which move was played? Predict, then check.

```
  8  r n b q k b . r
  7  p p p . . p p p
  6  . . . . p n . .
  5  . . . p . . . .
  4  . . . P . . . .
  3  . . . . P . . N
  2  P P P . . P P P
  1  R N B Q K B . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: rnbqkb1r/ppp2ppp/4pn2/3p4/3P4/4P2N/PPP2PPP/RNBQKB1R w KQkq - 0 4
```

**Accepted answer:** {"outcome": "yes"}

**Explanation shown:** Marks such as ! and ? are opinions added by the writer. They do not change which piece moved or where. Only the knight on b1 can reach d2, so Nd2! is one move.

Hints (in order):
1. Which white knights can reach d2?
2. A mark like ! or ? is the writer's opinion about the move. Does it change which move was played?
3. Only the knight on b1 can reach d2.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [piece_attacks] The knight on b1 can reach d2.
- [piece_attacks] The knight on h3 cannot reach d2.
- [legal_destinations] The knight on b1 can legally go to a3, c3 and d2.

### Step 9: item

**Task `IB3-107`** (select_squares, difficulty cue 2)

White to move. The score says Bxf6. Tap two squares: where the bishop starts and where it lands.

```
  8  r . b q . r k .
  7  p p p n b p p p
  6  . . . . p n . .
  5  . . . p . . B .
  4  . . P P . . . .
  3  . . N . P N . .
  2  P P . . . P P P
  1  R . . Q K B . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: r1bq1rk1/pppnbppp/4pn2/3p2B1/2PP4/2N1PN2/PP3PPP/R2QKB1R w KQ - 3 7
```

**Accepted answer:** squares f6, g5

**Explanation shown:** B is a bishop and x a capture. The bishop on g5 takes the knight on f6, so the two squares are g5 and f6.

Hints (in order):
1. B is the bishop. Which white bishop could capture something on f6?
2. The bishop lands on f6. Where does it come from?
3. The only white bishop that can reach f6 is the one on g5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] The bishop on g5 can capture on f6.
- [piece_on] A white bishop stands on g5.
- [piece_on] A black knight stands on f6.

### Step 10: item  (shown without telling the learner the topic: unlabeled test)

**Task `IB3-114`** (classify_position, difficulty cue 3)

White's rook on f1 goes to e1. Which record says exactly this move, in the fewest characters?

```
  8  . . . . . . k .
  7  p p . . . p p p
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  P P . . . P P P
  1  R . . . . R K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 6k1/pp3ppp/8/8/8/8/PP3PPP/R4RK1 w - - 0 1
```

**Accepted answer:** {"class": "Rfe1"}

**Explanation shown:** Both rooks can reach e1, so Re1 would be ambiguous. The moving rook starts on the f-file, so the record is Rfe1.

Hints (in order):
1. Which rooks can reach e1?
2. If more than one can, the record must say which one moves.
3. The moving rook starts on the f-file.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] The rook on f1 can go to e1.
- [legal_move] The rook on a1 can also go to e1, so Re1 is ambiguous.

### Step 11: item  (shown without telling the learner the topic: unlabeled test)

**Task `IB3-115`** (classify_position, difficulty cue 3)

White's rook on f1 goes to e1. Which record says exactly this move, in the fewest characters?

```
  8  . . . . . . k .
  7  p p . . . p p p
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  R . . . . P P P
  1  . . . . . R K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 6k1/pp3ppp/8/8/8/8/R4PPP/5RK1 w - - 0 1
```

**Accepted answer:** {"class": "Re1"}

**Explanation shown:** Only one rook can reach e1, so nothing needs to be added: Re1 is enough. Rfe1 is not wrong, but it says more than it has to.

Hints (in order):
1. Which rooks can reach e1?
2. Add a file or rank letter only when two pieces could make the move.
3. Only the rook on f1 can reach e1.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] The rook on f1 can go to e1.
- [illegal_move] The rook on a2 cannot reach e1, so Re1 is not ambiguous.

### Step 12: item  (shown without telling the learner the topic: unlabeled test)

**Task `IB3-116`** (classify_position, difficulty cue 3)

Black to move. The score says ...Nbd7. Which knight moved?

```
  8  r n b q . r k .
  7  p p p . b p p p
  6  . . . . p n . .
  5  . . . p . . B .
  4  . . P P . . . .
  3  . . N . P N . .
  2  P P . . . P P P
  1  R . . Q K B . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black.
FEN: rnbq1rk1/ppp1bppp/4pn2/3p2B1/2PP4/2N1PN2/PP3PPP/R2QKB1R b KQ - 2 6
```

**Accepted answer:** {"class": "the knight on b8"}

**Explanation shown:** The b after N is the file the knight leaves from, so it is the knight on b8. The knight on f6 would be Nfd7.

Hints (in order):
1. Two black knights can reach d7. What does the letter after N tell you?
2. It is the file the knight starts on.
3. Which knight stands on the b-file?

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] The knight on b8 can go to d7.
- [legal_move] The knight on f6 can also go to d7.

### Step 13: item  (shown without telling the learner the topic: unlabeled test)

**Task `IB3-119`** (classify_position, difficulty cue 3)

Both white rooks can reach a3. The rook on a1 goes to a3. Which record says exactly this move?

```
  8  . . . . k . . .
  7  . . . . . . . .
  6  . . . . . . . .
  5  R . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  R . . . K . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 4k3/8/8/R7/8/8/8/R3K3 w - - 0 1
```

**Accepted answer:** {"class": "R1a3"}

**Explanation shown:** Both rooks can reach a3 and both stand on the a-file, so neither Ra3 nor Raa3 says which one moves. The rank number does: the rook from a1 is R1a3, and the rook from a5 would be R5a3.

Hints (in order):
1. Which rooks can reach a3? Look at the files they stand on.
2. Both rooks stand on the a-file, so a file letter cannot tell them apart. Use the rank number the mover leaves from.
3. The rook on a1 leaves from rank 1.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] The rook on a1 can go to a3.
- [legal_move] The rook on a5 can also go to a3, so Ra3 is ambiguous.

### Step 14: item  (shown without telling the learner the topic: unlabeled test)

**Task `IB3-117`** (select_squares, difficulty cue 3)

White to move. The score says Rde1. Tap two squares: where the rook starts and where it lands.

```
  8  r . . . . r k .
  7  p p . . . p p p
  6  . . n . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . N . . . . .
  2  P P . . . P P P
  1  . . . R . R K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: r4rk1/pp3ppp/2n5/8/8/2N5/PP3PPP/3R1RK1 w - - 0 1
```

**Accepted answer:** squares d1, e1

**Explanation shown:** The letter after R is the file the rook leaves from: d. So the rook on d1 goes to e1; the rook on f1 would be Rfe1.

Hints (in order):
1. There are two white rooks. What does the second letter tell you?
2. The d is the file the rook starts from.
3. The rook on the d-file, on d1, goes to e1.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] The rook on d1 can go to e1.
- [legal_move] The rook on f1 can also go to e1, which is why the d is needed.
- [piece_on] A white rook stands on d1.

### Step 15: reflect

Kind: unsure

Prompt: Which part of a record made you stop and think: the piece letter, the x, the file letter for two pieces, or the dots for Black? Say what you will check first next time.

---

## Reviewer scorecard

Fill in the file `content/review/L-FND-NOTATION-1.json` (a template is below). Scale 1 to 5 for each dimension: 1 = wrong or unusable, 3 = acceptable with edits, 5 = I would put my name to it as it stands.
Revision to review: `40ed85f5`. If the lesson text changes after your review, your sign-off no longer applies and the lesson goes back to needs-human.

| Dimension | What to judge | Score |
|---|---|---|
| chess | every statement, line and explanation is correct; near-misses are really near-misses | |
| clarity | the explanation actually explains (mechanism, conditions), in plain words | |
| prerequisites | the lesson assumes only what the learner has met | |
| tasks | each task has one defensible answer and a fair explanation | |

```json
{
  "lesson": "L-FND-NOTATION-1",
  "revision": "40ed85f5",
  "reviewer": "<your name>",
  "reviewer_role": "strong-player",
  "date": "YYYY-MM-DD",
  "scores": {"chess": 0, "clarity": 0, "prerequisites": 0, "tasks": 0},
  "comments": "<what to change, by step number>",
  "verdict": "approved"
}
```

`reviewer_role` is `strong-player` or `teacher`. `verdict` is `approved` or `changes-requested`. See docs/review-slice.md.
