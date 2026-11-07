# Review packet: L-TAC-BACKRANK-1

**Back-rank mate, and luft as the cure**

- Skill: TAC.BACKRANK (D1); stage: exemplar; stated length: 40 minutes
- Steps: 63 (18 are tasks); revision: `34facf40`
- Review status now: needs-human

## What the lesson says the learner will be able to do

- Finds a back-rank mate with a rook or a queen, for either side, in positions where nothing names the idea
- Names which of the three conditions (flight square, capture, block) fails in a check that is not mate
- Counts the defenders of the back rank and says whether an exchange removes the last one
- Decides whether his own king needs luft now, and picks between h3, g3 and a guard on the rank, saying what each loosens
- Explains the idea to a beginner in four parts: the idea, when it works, an example, one warning

## Sources the author names (check that they are used fairly, in our own words)

- sources/sheets/nimzowitsch_my-system.md (idea 21: a short series of exchanges can win a back-rank mate) [V-sheet]
- docs/citable-views.md 4.4 (Emanuel Lasker, Common Sense in Chess: count the king's squares, keep the checker safe) [V-sheet]
- docs/citable-views.md 4.12 and sources/sheets/edlasker_chess-strategy.md K17 and K6 (d): every pawn move leaves something behind; a luft is right once a mate threat shows it is needed [V-sheet]
- docs/citable-views.md 5.8 and sheet K3: a defender can be an illusion, for instance when a mate threat ties it down (Edward Lasker) [V-sheet]
- docs/citable-views.md 5.9 (Znosko-Borovsky: real and fictitious threats) [V-sheet]
- docs/citable-views.md 10.4 and 10.6 (Heisman: list the opponent's forcing replies; Looking for Trouble) [S, not re-read]
- docs/citable-views.md 12.13 (naming failures as a self-diagnosis aid) [H]
- Lichess puzzle database (CC0), positions from real games: 3PuVM (hook), TRIMp (decoy), 33pRu (deflection), 2Vsf7 (exchange), 2f6Ew and 6ANXe (drift into the mate), eSn5l (real example, master game); each position is the position after the opponent's first recorded move, replayed with python-chess [V]
- Shipped items re-used: IA1-054 to IA1-059, IG-MATE1-132, IL-tEHF0. Positions typed by hand and checked by the engine: see content/items/lesson-tac-l-tac-backrank-1.json [V]
- Position olP4N (early luft costs a move) is from the Lichess puzzle database (CC0) [V]
- competition docs docs/competition-chesscom.md and docs/competition-chess-steps.md (structure: short theory, worksheet, mixed review) [S]
- No statistics from our own data are used in this lesson. Hypotheses labelled [H] in the text are the author's own and untested. The engine claim for every board is under the recorded settings (Stockfish 19 lite, depth 16): evidence, not proof.

## How to read this packet

Boards are drawn with capitals for White and lower case for Black, rank 8 at the top unless the board is shown from Black's side. Moves in a line are in standard notation. Statements marked [V] were machine-checked, [I] inference, [H] hypothesis, [S] secondary source, [R] recalled. Please judge the explanations, not only the moves: does each sentence tell the learner why?

---

### Step 1: board

Caption: Black to move. Look at the white king on h1: two pawns in front of it, and the white queen far away on h5. Black's rook can give check on the first rank. White's last move captured the black queen on b1. Guess before you read on: mate, or only a check?

```
  8  . . . . r . k .
  7  p p . . . p p .
  6  . b p . . . . p
  5  . . . . . . . Q
  4  . P n . . P . .
  3  P . . . . . . .
  2  . . . . . . P P
  1  B N . . . . . K
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: 4r1k1/pp3pp1/1bp4p/7Q/1Pn2P2/P7/6PP/BN5K b - - 0 25
```

Drawn on the board: highlighted squares h1, e8, e1.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] The rook can go to e1.
- [game_state] Black is not in check and can move.

### Step 2: reflect

Kind: expect

Prompt: Black's rook goes to the first rank with check. Pick a guess and give one reason. The lesson comes back to this position, so write what you actually think.

- Field "My guess:" with options: checkmate / only a check / I cannot tell; no single correct answer (a guess or a self-report)

- Field "Because:" (free text)

### Step 3: card

**What you will be able to do.** Look at any position and decide, with nobody naming the idea, whether a back-rank mate exists, for either side. Refute a mate that is not there. Make your own king safe in the cheapest way. And say plainly when there is no back-rank mate at all. The test near the end mixes positions with and without mates, and nothing in it is labelled.

### Step 4: board

Caption: White to move. Black's rook is on the other side of the board, but the d-file is open. Count the squares the white king could step to.

```
  8  . . . r . . k .
  7  . . . . . p p p
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . . P P P
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 3r2k1/5ppp/8/8/8/8/5PPP/6K1 w - - 0 1
```

Drawn on the board: highlighted squares f1, h1, f2, g2, h2.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_destinations] The king can go to f1 and h1 only.

### Step 5: card

**Shield and cage.** The three pawns shield the king from checks coming from the front, yet they also fill three of its squares. An edge king has at most six squares (its own and five neighbours), and here the pawns take three. Emanuel Lasker's reminder for any attack is to count the squares you must control and to make sure the checking piece cannot be taken.

### Step 6: board

Caption: The same position, Black to move. Step through and count which squares one rook covers. [H] Counting the squares before hunting for checks may find mates faster; untested.

```
  8  . . . r . . k .
  7  . . . . . p p p
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . . P P P
  1  . . . . . . K .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: 3r2k1/5ppp/8/8/8/8/5PPP/6K1 b - - 0 1
```

The line, with the sentence the learner sees at each move:
1. **1... Rd1#**: One rook check covers e1, f1 and g1. The king cannot step to h1 either: that square lies on the same line.

```
  8  . . . . . . k .
  7  . . . . . p p p
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . . P P P
  1  . . . r . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 6k1/5ppp/8/8/8/8/5PPP/3r2K1 w - - 1 2
```

Drawn on the board: highlighted squares d1, f1, g1, h1.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [mate_in] Rd1 is checkmate.
- [attackers] The rook on d1 covers f1.
- [attackers] The rook on d1 gives check on g1.

### Step 7: item

**Task `ITAC-LTACBACKRANK1-1`** (select_squares, difficulty cue 1)

White to move. The king stands on h1. Tap every square it could step to.

```
  8  . . . r . . k .
  7  . . . . . p p p
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . . P P P
  1  . . . . . . . K
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 3r2k1/5ppp/8/8/8/8/5PPP/7K w - - 0 1
```

**Accepted answer:** squares g1 (from h1)

**Explanation shown:** A king in the corner behind two pawns has a single free square. A rook check along the first rank covers it at once.

Hints (in order):
1. Count the squares next to the king: how many are empty?
2. The pawns on g2 and h2 are the king's own pieces.
3. Only the square beside the king on the first rank is free.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_destinations] The king on h1 can go to g1 only.

### Step 8: board

Caption: An uncastled king is shut in the same way. White to move: which squares are free for the king?

```
  8  . . . . . . . r
  7  . . . . . . k .
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . P P P . .
  1  . . . . K . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 7r/6k1/8/8/8/8/3PPP2/4K3 w - - 0 1
```

Drawn on the board: highlighted squares d1, f1, d2, e2, f2.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_destinations] The king can go to d1 and f1 only.

### Step 9: board

Caption: Black to move. Black's rook stands on the e-file, which has no pawns on it.

```
  8  . . b . r . k .
  7  p p . . . p p p
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . B . .
  3  . P N . . . . .
  2  P B . . . P P P
  1  . . . . . . K .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: 2b1r1k1/pp3ppp/8/8/5B2/1PN5/PB3PPP/6K1 b - - 0 1
```

The line, with the sentence the learner sees at each move:
1. **1... Re1#**: The rook checks along the first rank. The pawns hold the king in, and nothing white covers e1.

```
  8  . . b . . . k .
  7  p p . . . p p p
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . B . .
  3  . P N . . . . .
  2  P B . . . P P P
  1  . . . . r . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 2b3k1/pp3ppp/8/8/5B2/1PN5/PB3PPP/4r1K1 w - - 1 2
```

Drawn on the board: arrows e8-e1; highlighted squares e1, g1.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [mate_in] ...Re1 is checkmate.
- [attackers] No white piece covers e1.

### Step 10: item

**Task `IA1-054`** (find_move, difficulty cue 1)

White to move. Find the back-rank mate.

```
  8  . . . . . . k .
  7  p b . . . p p p
  6  . p n . . . . .
  5  . . . . . b . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  P P . . . P P P
  1  . . B . R . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 6k1/pb3ppp/1pn5/5b2/8/8/PP3PPP/2B1R1K1 w - - 0 1
```

**Accepted answer(s):** Re8#

**Explanation shown:** Re8 checks along the back rank. The pawns on f7, g7 and h7 take away the king's escape squares, nothing can capture the rook on e8, and nothing can block on f8. That is checkmate.

Hints (in order):
1. The black king stands on the back rank behind its own pawns.
2. A rook check along the back rank needs an open file to reach it.
3. Look at e8.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [mate_in] Re8 is checkmate.
- [best_move_in] Re8# is the engine's first choice.
- [attackers] No black piece covers e8.

### Step 11: item

**Task `IA1-055`** (threat_detection, difficulty cue 1)

Black to move. What does White threaten? Move a White piece to show it.

```
  1  . K . R . B . .
  2  P P P . . . P P
  3  . . . . . . . .
  4  . . . . . . . .
  5  . . b . . . . .
  6  . . . . . n p .
  7  p p p . . . b p
  8  . k . . . . . .
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: 6k1/pb3ppp/1pn5/5b2/8/8/PP3PPP/2B1R1K1 b - - 0 1
```

**Accepted answer:** the threatened move is Re8# (e1e8)

**Explanation shown:** The white rook has the open e-file. Re8 would be mate: the king is shut in by its own pawns and nothing covers e8. Your own back rank is the weakness.

Hints (in order):
1. Your king has no escape squares. Which line leads to your back rank?
2. A rook on the open e-file reaches e8.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [mate_in] If Black passes, Re8 is checkmate.
- [attackers] No black piece covers e8.

### Step 12: card

**Three conditions.** A check along the first rank is mate only if all three hold. **One:** the king has no flight square. **Two:** nothing can capture the checking piece. **Three:** nothing can step between the checker and the king. Look at them in that order. Remove any one and it is only a check.

### Step 13: board

Caption: Back to the opening position. Compare with your guess at the start: what did you miss or get right? Then check the three conditions one by one.

```
  8  . . . . r . k .
  7  p p . . . p p .
  6  . b p . . . . p
  5  . . . . . . . Q
  4  . P n . . P . .
  3  P . . . . . . .
  2  . . . . . . P P
  1  B N . . . . . K
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: 4r1k1/pp3pp1/1bp4p/7Q/1Pn2P2/P7/6PP/BN5K b - - 0 25
```

The line, with the sentence the learner sees at each move:
1. **25... Re1#**: The rook checks. g2 and h2 fill the king's squares, nothing covers e1, and nothing can step in.

```
  8  . . . . . . k .
  7  p p . . . p p .
  6  . b p . . . . p
  5  . . . . . . . Q
  4  . P n . . P . .
  3  P . . . . . . .
  2  . . . . . . P P
  1  B N . . r . . K
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 6k1/pp3pp1/1bp4p/7Q/1Pn2P2/P7/6PP/BN2r2K w - - 1 26
```

Drawn on the board: highlighted squares e1, g1, h1.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [mate_in] Re1 is checkmate.
- [attackers] No white piece covers e1.

### Step 14: card

**Only a rook?** No. Any piece that gives check along the rank can mate there: a queen as well as a rook, or two pieces working together. The three conditions never change. What changes is how you meet the second one: when a defender can take the checking piece, you may need a second piece behind it. The next three boards show each case.

### Step 15: board

Caption: White to move. A queen can do the rook's job. Look for the check on the eighth rank.

```
  8  . . . . . . k .
  7  p p . . . p p p
  6  n . . . b . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . Q . . . .
  2  P P . . . P P P
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 6k1/pp3ppp/n3b3/8/8/3Q4/PP3PPP/6K1 w - - 0 1
```

The line, with the sentence the learner sees at each move:
1. **1. Qd8#**: The queen checks along the eighth rank. Nothing can take it or step in, and the pawns hold the king.

```
  8  . . . Q . . k .
  7  p p . . . p p p
  6  n . . . b . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  P P . . . P P P
  1  . . . . . . K .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 3Q2k1/pp3ppp/n3b3/8/8/8/PP3PPP/6K1 b - - 1 1
```

Drawn on the board: highlighted squares d8, g8.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [mate_in] Qd8 is checkmate.
- [attackers] No black piece covers d8.

### Step 16: board

Caption: White to move. Black has two rooks guarding the eighth rank; White has two rooks aimed at it.

```
  8  . . . r r . k .
  7  . . . . . p p p
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . R P P P
  1  . . . . R . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 3rr1k1/5ppp/8/8/8/8/4RPPP/4R1K1 w - - 0 1
```

The line, with the sentence the learner sees at each move:
1. **1. Rxe8+**: The first rook takes the guard on e8 with check.
2. **1... Rxe8**: The other black rook has to recapture; nothing else can.
3. **2. Rxe8#**: The second rook takes again, and now nothing is left to take it.

```
  8  . . . . R . k .
  7  . . . . . p p p
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . . P P P
  1  . . . . . . K .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 4R1k1/5ppp/8/8/8/8/5PPP/6K1 b - - 0 2
```

Drawn on the board: highlighted squares e8, d8.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [mate_in] White mates in two moves, starting with the capture on e8.
- [attackers] The rook on e2 attacks e8.

### Step 17: board

Caption: White to move. A knight guards e8, so a lone rook check would simply be taken. The queen stands behind the rook.

```
  8  . . . . . . k .
  7  . . . . . p p p
  6  . . . . . n . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . R P P P
  1  . . . . Q . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 6k1/5ppp/5n2/8/8/8/4RPPP/4Q1K1 w - - 0 1
```

The line, with the sentence the learner sees at each move:
1. **1. Re8+**: The rook goes to e8 with check, backed by the queen behind it.
2. **1... Nxe8**: The knight must take it; there is no other reply.
3. **2. Qxe8#**: The queen takes the knight with check, and the guard is gone.

```
  8  . . . . Q . k .
  7  . . . . . p p p
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . . P P P
  1  . . . . . . K .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 4Q1k1/5ppp/8/8/8/8/5PPP/6K1 b - - 0 2
```

Drawn on the board: highlighted squares e8, f6.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [mate_in] White mates in two moves.
- [attackers] The knight on f6 covers e8.

### Step 18: board

Caption: Position A. White to move. Predict before you step: mate, or only a check?

```
  8  . . . . . . k .
  7  . b . . . p p p
  6  p . . . . . . .
  5  q . . . . . . .
  4  . . . . . . . .
  3  . . N . . . . .
  2  P P . . . P P P
  1  . . . . R . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 6k1/1b3ppp/p7/q7/8/2N5/PP3PPP/4R1K1 w - - 0 1
```

The line, with the sentence the learner sees at each move:
1. **1. Re8#**: The rook checks along the eighth rank. Look at each of the three questions.

```
  8  . . . . R . k .
  7  . b . . . p p p
  6  p . . . . . . .
  5  q . . . . . . .
  4  . . . . . . . .
  3  . . N . . . . .
  2  P P . . . P P P
  1  . . . . . . K .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 4R1k1/1b3ppp/p7/q7/8/2N5/PP3PPP/6K1 b - - 1 1
```

Drawn on the board: highlighted squares e8, g8.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [mate_in] Re8 is checkmate.
- [attackers] No black piece covers e8.

### Step 19: board

Caption: Position B: one black pawn has moved from h7 to h6. Same question: mate, or only a check?

```
  8  . . . . . . k .
  7  . b . . . p p .
  6  p . . . . . . p
  5  q . . . . . . .
  4  . . . . . . . .
  3  . . N . . . . .
  2  P P . . . P P P
  1  . . . . R . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 6k1/1b3pp1/p6p/q7/8/2N5/PP3PPP/4R1K1 w - - 0 1
```

The line, with the sentence the learner sees at each move:
1. **1. Re8+**: The rook checks. The pawn move gave the king a square.
2. **1... Kh7**: The king steps to h7 and the check is over.

```
  8  . . . . R . . .
  7  . b . . . p p k
  6  p . . . . . . p
  5  q . . . . . . .
  4  . . . . . . . .
  3  . . N . . . . .
  2  P P . . . P P P
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 4R3/1b3ppk/p6p/q7/8/2N5/PP3PPP/6K1 w - - 2 2
```

Drawn on the board: highlighted squares h7, h6.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [move_is_not_mate] Re8 is not checkmate.
- [attackers] No white piece covers h7.

### Step 20: board

Caption: Position C: the black bishop has moved from b7 to d7. Mate, or only a check?

```
  8  . . . . . . k .
  7  . . . b . p p p
  6  p . . . . . . .
  5  q . . . . . . .
  4  . . . . . . . .
  3  . . N . . . . .
  2  P P . . . P P P
  1  . . . . R . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 6k1/3b1ppp/p7/q7/8/2N5/PP3PPP/4R1K1 w - - 0 1
```

The line, with the sentence the learner sees at each move:
1. **1. Re8+**: The rook checks, but the bishop covers e8.
2. **1... Bxe8**: The bishop takes the rook, so the check does not mate.

```
  8  . . . . b . k .
  7  . . . . . p p p
  6  p . . . . . . .
  5  q . . . . . . .
  4  . . . . . . . .
  3  . . N . . . . .
  2  P P . . . P P P
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 4b1k1/5ppp/p7/q7/8/2N5/PP3PPP/6K1 w - - 0 2
```

Drawn on the board: highlighted squares d7, e8.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [move_is_not_mate] Re8 is not checkmate.
- [attackers] A black piece covers e8.
- [material_after_move] The rook is lost along the engine line.

### Step 21: board

Caption: Position D: the black bishop stands on d6 and the h-pawn is back on h7. Mate, or only a check?

```
  8  . . . . . . k .
  7  . . . . . p p p
  6  p . . b . . . .
  5  q . . . . . . .
  4  . . . . . . . .
  3  . . N . . . . .
  2  P P . . . P P P
  1  . . . . R . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 6k1/5ppp/p2b4/q7/8/2N5/PP3PPP/4R1K1 w - - 0 1
```

The line, with the sentence the learner sees at each move:
1. **1. Re8+**: The rook checks. This time a piece can step in.
2. **1... Bf8**: The bishop interposes on f8, and the check is parried.

```
  8  . . . . R b k .
  7  . . . . . p p p
  6  p . . . . . . .
  5  q . . . . . . .
  4  . . . . . . . .
  3  . . N . . . . .
  2  P P . . . P P P
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 4Rbk1/5ppp/p7/q7/8/2N5/PP3PPP/6K1 w - - 2 2
```

Drawn on the board: highlighted squares d6, f8.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [move_is_not_mate] Re8 is not checkmate.
- [attackers] Two black pieces cover f8: the bishop and the king.

### Step 22: contrast

Title: What turns a mate into a check?

Prompt: Predict for each position: mate, or only a check? Then say what changed.

**The working board:**

**Task `IA1-054`** (find_move, difficulty cue 1)

White to move. Find the back-rank mate.

```
  8  . . . . . . k .
  7  p b . . . p p p
  6  . p n . . . . .
  5  . . . . . b . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  P P . . . P P P
  1  . . B . R . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 6k1/pb3ppp/1pn5/5b2/8/8/PP3PPP/2B1R1K1 w - - 0 1
```

**Accepted answer(s):** Re8#

**Explanation shown:** Re8 checks along the back rank. The pawns on f7, g7 and h7 take away the king's escape squares, nothing can capture the rook on e8, and nothing can block on f8. That is checkmate.

Hints (in order):
1. The black king stands on the back rank behind its own pawns.
2. A rook check along the back rank needs an open file to reach it.
3. Look at e8.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [mate_in] Re8 is checkmate.
- [best_move_in] Re8# is the engine's first choice.
- [attackers] No black piece covers e8.

**The failing board:**

**Task `IA1-057`** (classify_position, difficulty cue 2)

White has just played Re8+. Black's h-pawn stands on h6. Is this checkmate?

```
  1  . K . . . B . .
  2  P P P . . . P P
  3  . . . . . . . .
  4  . . . . . . . .
  5  . . b . . . . .
  6  p . . . . n p .
  7  . p p . . . b p
  8  . k . R . . . .
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: 4R1k1/pb3pp1/1pn4p/5b2/8/8/PP3PPP/2B3K1 b - - 1 1
```

Options shown: Checkmate / Check, but not mate

**Accepted answer:** {"class": "Check, but not mate"}

**Explanation shown:** The rook attacks the whole back rank, but h7 is empty and not attacked. The king steps there and the check is over. One pawn move turned a mating threat into a mere check.

Hints (in order):
1. List the squares next to the king. Which are free?
2. Which of them is attacked by the rook?

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [game_state] Black is in check.
- [legal_destinations] The king can step to h7.
- [attackers] Nothing black can capture the rook on e8, but the king has an escape square.

### Step 23: card

**The checklist.** Before you call a check on the first rank mate, ask three questions in order. Where can the king go? Who can take the checker? Who can step in between? If the answers are 'nowhere', 'nobody' and 'nobody', it is mate. If not, say aloud which question failed: flight, capture or block. [H] Naming the failure may help you diagnose your own mistakes faster; this is untested.

### Step 24: reflect

Kind: unsure

Prompt: In positions B, C and D, which condition failed? Which of the three questions do you usually forget to ask?

- Field "B failed because:" with options: capture / flight square / block; no single correct answer (a guess or a self-report)

- Field "C failed because:" with options: block / capture / flight square; no single correct answer (a guess or a self-report)

- Field "D failed because:" with options: capture / block / flight square; no single correct answer (a guess or a self-report)

- Field "The question I forget most:" (free text)

### Step 25: card

**How the mate gets there.** [I] From the examples below, three things often come before the mate: pieces developed away from the back rank; a rook that was the only piece able to reach the rank goes elsewhere; and a pawn move that opens a file for the enemy rook. Dan Heisman's remedy [S] is to list the opponent's forcing replies (checks, captures, threats) before each move. A check on your first rank is one of them.

### Step 26: board

Caption: White to move. Black threatens Rd1+. Even the rook's return to e1 would only be taken with mate. White needs air. Predict what happens if the rook grabs the pawn on c7, then step through.

```
  8  . . . . . . k .
  7  p p p . R . p p
  6  . . . . . p . .
  5  . . . r . . . .
  4  . P . . . . . .
  3  P . . . . . . .
  2  . . P . . P P P
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 6k1/ppp1R1pp/5p2/3r4/1P6/P7/2P2PPP/6K1 w - - 0 23
```

The line, with the sentence the learner sees at each move:
1. **23. Rxc7**: The grab ignores the threat.
2. **23... Rd1#**: Black's rook checks along the first rank. The pawns hold the king in and nothing can step in: mate.

```
  8  . . . . . . k .
  7  p p R . . . p p
  6  . . . . . p . .
  5  . . . . . . . .
  4  . P . . . . . .
  3  P . . . . . . .
  2  . . P . . P P P
  1  . . . r . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 6k1/ppR3pp/5p2/8/1P6/P7/2P2PPP/3r2K1 w - - 1 24
```

Drawn on the board: highlighted squares c7, e7, d1.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [move_loses] The pawn grab loses to a forced mate.
- [mate_in] If White passes, Black already wins by force: Rd1+, and the rook's return to e1 is taken with mate.
- [best_move_in] The engine prefers a king step to the pawn grab.

### Step 27: board

Caption: White to move. The pawn on d4 blocks the d-file for now. What might a natural pawn capture do?

```
  8  . . . . . . . .
  7  . p . . k . p .
  6  . . p . . . . p
  5  P p . r p p . .
  4  . P . P . . . R
  3  . . P . . . . .
  2  . . . . . P P P
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 8/1p2k1p1/2p4p/Pp1rpp2/1P1P3R/2P5/5PPP/6K1 w - - 0 28
```

The line, with the sentence the learner sees at each move:
1. **28. dxe5**: The pawn takes on e5 and leaves the d-file.
2. **28... Rd1#**: The file is open, Black's rook reaches the first rank, and the white king has nowhere to go: mate.

```
  8  . . . . . . . .
  7  . p . . k . p .
  6  . . p . . . . p
  5  P p . . P p . .
  4  . P . . . . . R
  3  . . P . . . . .
  2  . . . . . P P P
  1  . . . r . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 8/1p2k1p1/2p4p/Pp2Pp2/1P5R/2P5/5PPP/3r2K1 w - - 1 29
```

Drawn on the board: highlighted squares d4, d5, d1.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [move_loses] The capture loses to a forced mate.
- [attackers] While the pawn stands on d4, Black's rook does not attack d1.

### Step 28: item

**Task `ITAC-LTACBACKRANK1-2`** (find_move, difficulty cue 2)

White to move. Black threatens to give mate on the first rank. Play a move that holds.

```
  8  . . . r . . k .
  7  p p . . . p p p
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  R . . . . . . .
  2  P P . . . P P P
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 3r2k1/pp3ppp/8/8/8/R7/PP3PPP/6K1 w - - 0 1
```

**Accepted answer(s):** g3, g4, h3, f3, h4, Kf1, f4

Feedback shown for wrong moves:
- Rxa7: The rook takes a pawn and Black plays Rd1, which is mate: nothing guards the first rank.
- Rd3: Black simply takes the rook: Rxd3 wins a whole rook.
- b3: A quiet move does not answer the threat: Rd1 is mate.

**Explanation shown:** Black threatens Rd1 mate. A pawn move gives the king air, and a king step to f1 also works here. Grabbing the pawn on a7 leaves the rank unguarded.

Hints (in order):
1. Which Black piece is aimed at your first rank?
2. Your rook is far from the first rank. Can you give the king a square?
3. A pawn move in front of the king, or a king step, answers the threat.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] Seven moves hold: pawn moves that give the king a square, or a king step.
- [move_loses] Taking the pawn on a7 loses to a forced mate.
- [move_loses] Offering a trade on the d-file loses a rook.

### Step 29: board

Caption: White to move. Black threatens a rook check on d1 that would be mate. First try: the h-pawn.

```
  8  . . . r . . k .
  7  p p . . . p p p
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  R . . . . . . .
  2  P P . . . P P P
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 3r2k1/pp3ppp/8/8/8/R7/PP3PPP/6K1 w - - 0 1
```

The line, with the sentence the learner sees at each move:
1. **1. h3**: Luft with the h-pawn: the king gets the square h2. The price is that g3 loses one pawn guard.
2. **1... Rd1+**: Black checks anyway, but now the check is only a check.
3. **2. Kh2**: The king steps to h2. The threat is gone. A king step to f1 also holds here, but it needs a free, safe square and is not always available.

```
  8  . . . . . . k .
  7  p p . . . p p p
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  R . . . . . . P
  2  P P . . . P P K
  1  . . . r . . . .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 6k1/pp3ppp/8/8/8/R6P/PP3PPK/3r4 b - - 2 2
```

Drawn on the board: highlighted squares h2, h3, g3.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] The h-pawn move holds, like the g-pawn move and a king step.
- [pawn_attackers] Before the move, two white pawns guard g3.
- [pawn_attackers] After h3, only the f-pawn guards g3.

### Step 30: board

Caption: The same position. Second try: the g-pawn. Ask what it leaves behind.

```
  8  . . . r . . k .
  7  p p . . . p p p
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  R . . . . . . .
  2  P P . . . P P P
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 3r2k1/pp3ppp/8/8/8/R7/PP3PPP/6K1 w - - 0 1
```

The line, with the sentence the learner sees at each move:
1. **1. g3**: Luft with the g-pawn: the king gets g2, and the pawn leaves the long diagonal. The price is f3 and h3.
2. **1... Rd1+**: Black checks, but the king has a square.
3. **2. Kg2**: The king steps to g2.

```
  8  . . . . . . k .
  7  p p . . . p p p
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  R . . . . . P .
  2  P P . . . P K P
  1  . . . r . . . .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 6k1/pp3ppp/8/8/8/R5P1/PP3PKP/3r4 b - - 2 2
```

Drawn on the board: highlighted squares g2, g3, f3, h3.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [pawn_attackers] Before the move, a white pawn guards f3.
- [pawn_attackers] After g3, no white pawn guards f3.
- [pawn_attackers] After g3, no white pawn guards h3.

### Step 31: board

Caption: A different setup: the pawn stands on c2 instead of a2, so the rook can return to a1. Third try: guard the first rank instead of making luft. [I] I guessed the guard would be best; Stockfish 19 at depth 16 rates it about 0.1 pawn below the best move here. One position proves nothing.

```
  8  . . . r . . k .
  7  p p . . . p p p
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  R . . . . . . .
  2  . P P . . P P P
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 3r2k1/pp3ppp/8/8/8/R7/1PP2PPP/6K1 w - - 0 1
```

The line, with the sentence the learner sees at each move:
1. **1. Ra1**: The rook returns to guard the rank. Now a check on d1 would simply lose a rook.
2. **1... a6**: Black makes a waiting move. [I] The rook is now tied to the first rank.

```
  8  . . . r . . k .
  7  . p . . . p p p
  6  p . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . P P . . P P P
  1  R . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 3r2k1/1p3ppp/p7/8/8/8/1PP2PPP/R5K1 w - - 0 2
```

Drawn on the board: highlighted squares a1, d1.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] The rook retreat holds, like the luft moves.
- [move_loses] The engine rates the retreat at least a tenth of a pawn below the best move here.
- [attackers] After the retreat, the rook covers d1.

### Step 32: item

**Task `ITAC-LTACBACKRANK1-3`** (find_move, difficulty cue 2)

White to move. Black threatens a mate on the first rank. Play a move that holds; several do.

```
  8  . . . r . . k .
  7  p p . . . p p p
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  R . . . . . . .
  2  . P P . . P P P
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 3r2k1/pp3ppp/8/8/8/R7/1PP2PPP/6K1 w - - 0 1
```

**Accepted answer(s):** Kf1, h4, f4, g4, g3, f3, h3, Ra1

Feedback shown for wrong moves:
- b3: A move on the queenside does not touch the threat: Rd1 is mate.
- Rxa7: The rook takes a pawn but leaves the first rank to Black: Rd1 is mate.

**Explanation shown:** The holding moves answer the threat by air for the king or a guard on the rank. A quiet move elsewhere does not.

Hints (in order):
1. Which black piece can reach your first rank next move?
2. You can give the king a square or put a piece on the rank.
3. Pawn moves that give the king a square, a king step and the rook retreat all work.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] These eight moves all hold.
- [move_loses] A quiet pawn move loses to mate.
- [move_loses] Taking the pawn on a7 loses to mate.

### Step 33: board

Caption: White to move. Black has no rook and no queen, so nothing can use White's back rank. Would a quiet luft help, or does it only cost a move?

```
  8  . . . . . . . .
  7  . . . . k . . p
  6  . . . n . . . .
  5  b . . . . p . .
  4  . . . N . . . .
  3  . . . . . . . .
  2  P . . . . P P P
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 8/4k2p/3n4/b4p2/3N4/8/P4PPP/6K1 w - - 2 38
```

The line, with the sentence the learner sees at each move:
1. **38. Nc6+**: The knight checks the king and also attacks the bishop on a5.
2. **38... Ke6**: The king steps aside.
3. **39. Nxa5**: The knight takes the bishop. White has won a piece.

```
  8  . . . . . . . .
  7  . . . . . . . p
  6  . . . n k . . .
  5  N . . . . p . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  P . . . . P P P
  1  . . . . . . K .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 8/7p/3nk3/N4p2/8/8/P4PPP/6K1 b - - 0 39
```

Drawn on the board: highlighted squares c6, a5, e7.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [material_after_move] The fork wins a piece for White.
- [move_loses] Playing h3 first throws the win away.
- [attackers] The knight on c6 would attack the bishop on a5.

### Step 34: card

**When to give luft.** Edward Lasker notes that every pawn move leaves something behind, and advises against a luft made as a precaution before a mate threat shows it is needed. [I] His advice is stated more strongly than modern practice follows: many strong players make h3 or a3 early for other reasons. The practical test is one question: can an enemy rook or queen reach my back rank soon? [H] Beginners may still gain from an early, cheap luft.

### Step 35: contrast

Title: Does White need luft now?

Prompt: Predict for each position: does White need to spend a move on luft now? Then name the one thing that differs.

**The working board:**

**Task `ITAC-LTACBACKRANK1-4`** (predict_outcome, difficulty cue 2)

White to move. Does White need to make luft right now?

```
  8  . . . r . . k .
  7  . . . . . p p p
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . B . . .
  2  . . . . . P P P
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 3r2k1/5ppp/8/8/8/4B3/5PPP/6K1 w - - 0 1
```

**Accepted answer:** {"outcome": "yes"}

**Explanation shown:** The rook can reach d1 and nothing guards it, so White has to act now.

Hints (in order):
1. Which black piece can reach your first rank?
2. Is anything of yours covering the square the rook would use?
3. Rd1 would be mate if you pass.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [mate_in] If White passes, Black has Rd1 mate.
- [attackers] No white piece covers d1.

**The failing board:**

**Task `ITAC-LTACBACKRANK1-5`** (predict_outcome, difficulty cue 2)

White to move. Does White need to make luft right now?

```
  8  . . . r . . k .
  7  . . . . . p p p
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . B . .
  2  . . . . . P P P
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 3r2k1/5ppp/8/8/8/5B2/5PPP/6K1 w - - 0 1
```

**Accepted answer:** {"outcome": "no"}

**Explanation shown:** The bishop covers d1, so Rd1 would just lose a rook. There is no need to spend a move.

Hints (in order):
1. Which black piece can reach your first rank?
2. Is anything of yours covering the square the rook would use?
3. The bishop covers d1.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [move_is_not_mate] If White passes, Rd1 is not mate.
- [attackers] The bishop covers d1.

### Step 36: reflect

Kind: expect

Prompt: Do you agree with the rule of thumb that luft waits until a threat shows? Think of your own games: did you lose more by giving luft too early, or by giving it too late? [H] I suspect beginners lose far more by waiting; I have not tested this.

- Field "I:" with options: agree / disagree / depends; no single correct answer (a guess or a self-report)

- Field "Because:" (free text)

### Step 37: board

Caption: Decoy: the king is pulled to g1. Black to move. White's only protection against a second black rook is the king itself. Predict how Black can use that.

```
  8  . . . . r . k .
  7  . . Q P . p p p
  6  . p n . . . . .
  5  . . . p . . . .
  4  P P . . . . . .
  3  . . . . . . . .
  2  . . . . . P P P
  1  . . r . . . N K
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: 4r1k1/2QP1ppp/1pn5/3p4/PP6/8/5PPP/2r3NK b - - 0 32
```

The line, with the sentence the learner sees at each move:
1. **32... Rxg1+**: The rook takes the knight with check and forces the king to take it.
2. **33. Kxg1**: The king recaptures. It now stands on the first rank.
3. **33... Re1#**: The second rook checks along the rank. The king is shut in by its own pawns: mate.

```
  8  . . . . . . k .
  7  . . Q P . p p p
  6  . p n . . . . .
  5  . . . p . . . .
  4  P P . . . . . .
  3  . . . . . . . .
  2  . . . . . P P P
  1  . . . . r . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 6k1/2QP1ppp/1pn5/3p4/PP6/8/5PPP/4r1K1 w - - 1 34
```

Drawn on the board: highlighted squares c1, g1, e8.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [mate_in] Black mates in two moves.
- [attackers] The rook on c1 attacks g1.

### Step 38: board

Caption: Deflection: the knight is pulled off c7. White to move. Two black pieces guard e8: the rook and the knight on c7. What happens if the knight is made to move?

```
  8  r . . . . . k .
  7  p . n . . p p p
  6  . p . . . . . .
  5  . . p . . . . .
  4  . . . . Q . . .
  3  q . . . . . . .
  2  . . . . . P P P
  1  . . . . R . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: r5k1/p1n2ppp/1p6/2p5/4Q3/q7/5PPP/4R1K1 w - - 2 24
```

The line, with the sentence the learner sees at each move:
1. **24. Qxa8+**: The queen takes the rook with check and offers herself.
2. **24... Nxa8**: The knight takes the queen. It had to, and it has left c7.
3. **25. Re8#**: The knight no longer guards e8, so the rook checks and nothing can answer.

```
  8  n . . . R . k .
  7  p . . . . p p p
  6  . p . . . . . .
  5  . . p . . . . .
  4  . . . . . . . .
  3  q . . . . . . .
  2  . . . . . P P P
  1  . . . . . . K .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: n3R1k1/p4ppp/1p6/2p5/8/q7/5PPP/6K1 b - - 1 25
```

Drawn on the board: highlighted squares c7, e8, a8.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [mate_in] White mates in two moves.
- [attackers] Two black pieces cover e8.

### Step 39: board

Caption: Exchange: rooks trade until none is left. White to move. Black's queen stands between White's two rooks, and Black's rook guards the eighth rank. Predict how many captures White needs.

```
  8  . . . r . . k .
  7  r . . . . p p p
  6  . . . . p . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . R . . . P
  2  . . . q . . P .
  1  . . . R . . . K
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 3r2k1/r4ppp/4p3/8/8/3R3P/3q2P1/3R3K w - - 0 31
```

The line, with the sentence the learner sees at each move:
1. **31. Rxd8+**: The first rook takes the guard on d8 with check.
2. **31... Qxd8**: The queen must recapture. That clears the d-file for the second rook.
3. **32. Rxd8#**: The second rook takes the queen with check, and nothing can answer.

```
  8  . . . R . . k .
  7  r . . . . p p p
  6  . . . . p . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . P
  2  . . . . . . P .
  1  . . . . . . . K
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 3R2k1/r4ppp/4p3/8/8/7P/6P1/7K b - - 0 32
```

Drawn on the board: highlighted squares d8, d3, d1.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [mate_in] White mates in two moves.

### Step 40: card

**Three ways to remove the last guard.** You have just seen a decoy (a sacrifice drags a piece onto a square), a deflection (a forcing move pulls a guard away) and an exchange (a trade removes it). Each has its own lesson: L-TAC-DECOY-1, L-TAC-DEFLECT-1, L-TAC-REMOVE-DEFENDER-1 and L-TAC-OVERLOAD-1. Here, learn one habit: count the defenders of the key square first.

### Step 41: contrast

Title: Does the exchange work?

Prompt: Count the defenders of d8 before you decide. In the second position a black bishop has been added.

**The working board:**

**Task `ITAC-LTACBACKRANK1-6`** (predict_outcome, difficulty cue 2)

White to move. Does Rxd8+ lead to checkmate?

```
  8  r . . r . . k .
  7  . . . . . p p p
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . R . P P P
  1  . . . R . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: r2r2k1/5ppp/8/8/8/8/3R1PPP/3R2K1 w - - 0 1
```

**Accepted answer:** {"outcome": "yes"}

**Explanation shown:** Black has one defender and White has two rooks. After the first rook is taken, the second takes and nothing is left.

Hints (in order):
1. How many black pieces guard d8?
2. How many white rooks can take on d8, one after another?
3. Two attackers against one defender.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [mate_in] White mates in two moves.
- [attackers] Black has one defender of d8: the rook on a8.

**The failing board:**

**Task `ITAC-LTACBACKRANK1-7`** (predict_outcome, difficulty cue 2)

White to move. Does Rxd8+ lead to checkmate?

```
  8  r . . r . . k .
  7  . . . . b p p p
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . R . P P P
  1  . . . R . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: r2r2k1/4bppp/8/8/8/8/3R1PPP/3R2K1 w - - 0 1
```

**Accepted answer:** {"outcome": "no"}

**Explanation shown:** Black has a second defender, the bishop. White runs out of rooks first, so the exchange only trades pieces.

Hints (in order):
1. How many black pieces guard d8?
2. How many white rooks can take on d8, one after another?
3. Two attackers against two defenders: who captures last?

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [move_is_not_mate] Rxd8 is not mate.
- [attackers] Black has two defenders of d8: the rook on a8 and the bishop.

### Step 42: card

**A mate threat wins material too.** A piece tied to guarding the first rank has less freedom, so it is often a worse defender elsewhere. [I] Edward Lasker lists a mate threat that ties a piece down among the ways a defender can be an illusion. Znosko-Borovsky's point about threats applies as well: a threat can pay off even if you never carry it out. The next boards show a poisoned piece and a forced loss.

### Step 43: board

Caption: Black to move. White's bishop on d3 is attacked by the black queen and nothing defends it. Is it free?

```
  8  . . . . . . k .
  7  p p . . . p p p
  6  . . . q . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . B . . . .
  2  P P . . . P P P
  1  . . . . R . K .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: 6k1/pp3ppp/3q4/8/8/3B4/PP3PPP/4R1K1 b - - 0 1
```

The line, with the sentence the learner sees at each move:
1. **1... Qxd3**: The queen takes the free bishop, leaving the job of guarding the eighth rank.
2. **2. Re8#**: The rook checks and the king has nowhere to go: mate.

```
  8  . . . . R . k .
  7  p p . . . p p p
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . q . . . .
  2  P P . . . P P P
  1  . . . . . . K .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 4R1k1/pp3ppp/8/8/8/3q4/PP3PPP/6K1 b - - 1 2
```

Drawn on the board: highlighted squares d3, d6, e1.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [loose_pieces] The bishop on d3 is attacked and undefended.
- [move_loses] Taking the bishop loses to a forced mate.

### Step 44: board

Caption: The same position with White to move. Black's queen is the only piece that can answer a check on e8.

```
  8  . . . . . . k .
  7  p p . . . p p p
  6  . . . q . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . B . . . .
  2  P P . . . P P P
  1  . . . . R . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 6k1/pp3ppp/3q4/8/8/3B4/PP3PPP/4R1K1 w - - 0 1
```

The line, with the sentence the learner sees at each move:
1. **1. Re8+**: Check along the eighth rank. Only the queen can step in, on f8.
2. **1... Qf8**: The queen interposes. It has no other choice.
3. **2. Rxf8+**: The rook takes the queen with check.
4. **2... Kxf8**: The king takes the rook. White gave a rook for a queen.

```
  8  . . . . . k . .
  7  p p . . . p p p
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . B . . . .
  2  P P . . . P P P
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 5k2/pp3ppp/8/8/8/3B4/PP3PPP/6K1 w - - 0 3
```

Drawn on the board: highlighted squares e8, f8, d6.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [material_after_move] The rook check wins material for White.
- [attackers] Nothing can take the rook on e8.

### Step 45: item  (shown without telling the learner the topic: unlabeled test)

**Task `ITAC-LTACBACKRANK1-8`** (find_move, difficulty cue 3)

Black to move. Find the best move.

```
  1  . K . . . . . .
  2  P P P . . . . .
  3  . . . . Q . . .
  4  . . . . . . . .
  5  . . . . . . . .
  6  . . . . b . . .
  7  p p p . . . . .
  8  . k . r . . . .
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: 4r1k1/5ppp/3b4/8/8/3Q4/5PPP/6K1 b - - 0 1
```

**Accepted answer(s):** Re1+

**Explanation shown:** The rook check can only be answered by the queen, which then falls for the rook. The back-rank threat wins material without mate.

Hints (in order):
1. Which of your pieces can reach the first rank?
2. Which white pieces can answer a check on e1?
3. Check, and see what is forced.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [material_after_move] The rook check wins material.
- [best_move_in] The rook check is the best move.

### Step 46: board

Caption: White to move. Both kings are shut in by their pawns and the rooks face each other. Who benefits from having the move?

```
  8  . . . . r . k .
  7  . . . . . p p p
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . . P P P
  1  . . . . R . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 4r1k1/5ppp/8/8/8/8/5PPP/4R1K1 w - - 0 1
```

The line, with the sentence the learner sees at each move:
1. **1. Rxe8#**: White takes first, with check. Nothing can retake and the king has no square: mate.

```
  8  . . . . R . k .
  7  . . . . . p p p
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . . P P P
  1  . . . . . . K .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 4R1k1/5ppp/8/8/8/8/5PPP/6K1 b - - 0 1
```

Drawn on the board: highlighted squares e1, e8.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [mate_in] White mates in one.

### Step 47: board

Caption: The same position with Black to move. Predict the result.

```
  8  . . . . r . k .
  7  . . . . . p p p
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . . P P P
  1  . . . . R . K .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: 4r1k1/5ppp/8/8/8/8/5PPP/4R1K1 b - - 0 1
```

The line, with the sentence the learner sees at each move:
1. **1... Rxe1#**: Black takes first, with check. The same pattern gives mate to the other side.

```
  8  . . . . . . k .
  7  . . . . . p p p
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . . P P P
  1  . . . . r . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 6k1/5ppp/8/8/8/8/5PPP/4r1K1 w - - 0 2
```

Drawn on the board: highlighted squares e1, e8.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [mate_in] Black mates in one.

### Step 48: card

**Two questions, every move.** Can I check on his first rank, and is it mate? Could he do it to me? [I] Looking at both kings every move is cheap and may catch these mates on both sides. This mirrors Heisman's looking-for-trouble routine [S]: find his threat, then the prevention. Asking 'what rook could check there?' before a quiet move is its practical form. More mixed practice: L-TAC-BACKRANK-2.

### Step 49: item

**Task `ITAC-LTACBACKRANK1-9`** (threat_detection, difficulty cue 2)

White to move. What does Black threaten? Move a black piece to show it.

```
  8  . . . . r . k .
  7  . . . . . p p p
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . . P P P
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 4r1k1/5ppp/8/8/8/8/5PPP/6K1 w - - 0 1
```

**Accepted answer:** the threatened move is Re1# (e8e1)

**Explanation shown:** The rook has the open file and nothing guards e1, so Black threatens Re1 mate. This is the same pattern seen from the defender's side.

Hints (in order):
1. Which black pieces can reach a square near your king?
2. Count your king's escape squares.
3. The rook on the open file reaches e1.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [mate_in] If White passes, Re1 is checkmate.
- [attackers] No white piece covers e1.

### Step 50: item  (shown without telling the learner the topic: unlabeled test)

**Task `IA1-059`** (classify_position, difficulty cue 3)

Black to move. Is there a mate in one?

```
  1  . K . . . . . .
  2  P P P . B . B P
  3  . . . . . N P .
  4  . . . . . . . .
  5  . . . . . . . .
  6  . . . . . . . .
  7  p p p . . . p p
  8  . k . r . b . .
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: 2b1r1k1/pp3ppp/8/8/8/1PN5/PB1B1PPP/6K1 b - - 0 1
```

Options shown: Yes / No

**Accepted answer:** {"class": "No"}

**Explanation shown:** The rook can check along the back rank, but a white bishop covers e1 and takes it. A check on the back rank is not mate if something can capture the checking piece.

Hints (in order):
1. Which squares on White's back rank does the rook reach?
2. Can White capture a piece that lands on e1?

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [material_after_move] ...Re1+ is met by a capture and loses the rook.
- [attackers] A white bishop covers e1.

### Step 51: item  (shown without telling the learner the topic: unlabeled test)

**Task `ITAC-LTACBACKRANK1-10`** (classify_position, difficulty cue 3)

Black to move. Is there a mate in one?

```
  1  . K . . . . . .
  2  P P P . . . . .
  3  . . . . N . . .
  4  . . . . . . . .
  5  . . . . . . . .
  6  . . . . . . . .
  7  p p p . . . . .
  8  . k . r . . . .
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: 4r1k1/5ppp/8/8/8/3N4/5PPP/6K1 b - - 0 1
```

**Accepted answer:** {"class": "No"}

**Explanation shown:** The rook can check on e1, but the knight takes it. A back-rank check is not mate if the checking piece can be taken.

Hints (in order):
1. Which square would the rook check on?
2. Can White take a piece that lands there?
3. The knight covers e1.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [material_after_move] The rook check is answered by a capture and the rook is lost.
- [attackers] A white piece covers e1.

### Step 52: item  (shown without telling the learner the topic: unlabeled test)

**Task `IG-MATE1-132`** (classify_position, difficulty cue 3)

Black to move. Is there a mate in one?

```
  1  . . K . . . . .
  2  . P P P . . . .
  3  . . . . . . . .
  4  k . . . . . . .
  5  . . . b . . p .
  6  . . . . r . . .
  7  . . . . . . . .
  8  . . . . . . . .
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: 8/8/3r4/1p2b3/7k/8/4PPP1/5K2 b - - 0 1
```

**Accepted answer:** {"class": "mate in one"}

**Explanation shown:** Yes: Rd1# is checkmate, because it gives check and the king has no legal reply.

Hints (in order):
1. First list the checks you have. A mate in one must be a check.
2. For each check, look at the king's escape squares, whether the checking piece can be captured, and whether the line can be blocked.
3. If every check can be answered, there is no mate in one. If one check cannot be answered, that is the mate.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [mate_in] Rd1# is checkmate.

### Step 53: item  (shown without telling the learner the topic: unlabeled test)

**Task `ITAC-LTACBACKRANK1-11`** (classify_position, difficulty cue 3)

White to move. Is there a mate in one?

```
  8  . . . . . . k .
  7  . . . . . p p p
  6  . . . b . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . . P P P
  1  . . . . R . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 6k1/5ppp/3b4/8/8/8/5PPP/4R1K1 w - - 0 1
```

**Accepted answer:** {"class": "No"}

**Explanation shown:** The rook can check on e8, but the bishop interposes on f8. The check is parried, so it is not mate.

Hints (in order):
1. Which square would the rook check on?
2. Can Black step in between?
3. The bishop covers f8.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [move_is_not_mate] Re8 is not mate.
- [attackers] Two black pieces cover f8: the bishop and the king.

### Step 54: item  (shown without telling the learner the topic: unlabeled test)

**Task `IL-tEHF0`** (find_move, difficulty cue 3)

White to move. Find the best move.

```
  8  . . . . . . k .
  7  . . p . . p p p
  6  r . p . . . . .
  5  p . P . . . . .
  4  P . . . . p . .
  3  . . P . . . . .
  2  . . . . . K P P
  1  . R . . r . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 6k1/2p2ppp/r1p5/p1P5/P4p2/2P5/5KPP/1R2r3 w - - 0 23
```

**Accepted answer(s):** Rb8+

Feedback shown for wrong moves:
- Kxe1: Not best: the engine rates this move at least 6 pawns worse than the best move.

**Explanation shown:** The first move forces checkmate in 2 or fewer against the engine's best defence (depth 16).

Hints (in order):
1. Look at the enemy king's back rank: which squares in front of the king are blocked by its own pieces?
2. Can a rook or queen reach the back rank with check, and does the king have any square to run to?
3. A good first move is made by the piece on b1.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] The engine's best move is among the accepted moves, and every accepted move is within 40 centipawns of it (depth 16).
- [mate_in] Rb8+ forces checkmate in 2 or fewer against the engine's best defence.
- [move_loses] Kxe1 is at least 6 pawns worse than the best move (depth 16).

### Step 55: item  (shown without telling the learner the topic: unlabeled test)

**Task `ITAC-LTACBACKRANK1-12`** (classify_position, difficulty cue 3)

White to move. Is there a mate in one?

```
  8  . . . . . . k .
  7  . . . . . p . p
  6  . . . . . . p .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . . P P P
  1  . . . . R . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 6k1/5p1p/6p1/8/8/8/5PPP/4R1K1 w - - 0 1
```

**Accepted answer:** {"class": "No"}

**Explanation shown:** The rook can check on e8, but the king steps to g7. A flight square is enough to rule the mate out.

Hints (in order):
1. Which square would the rook check on?
2. Count the king's escape squares.
3. The pawn moved from g7 to g6.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [move_is_not_mate] Re8 is not mate.
- [attackers] The king can step to g7: no white piece attacks it.

### Step 56: item  (shown without telling the learner the topic: unlabeled test)

**Task `ITAC-LTACBACKRANK1-13`** (classify_position, difficulty cue 3)

Black to move. Is there a mate in one?

```
  1  . K . . . . . .
  2  P P P . . . . .
  3  . . . . . . . .
  4  . . . P . . . .
  5  . . . . . . . .
  6  . . . . . . . .
  7  p p p . . . . .
  8  . k . r . . . .
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: 4r1k1/5ppp/8/8/4P3/8/5PPP/6K1 b - - 0 1
```

**Accepted answer:** {"class": "No"}

**Explanation shown:** A back-rank mate needs a checking piece that can actually reach the rank. Here the pawn on e4 blocks the file, so there is no check at all.

Hints (in order):
1. Which square would the rook check on?
2. Can the rook get there?
3. Look at the e-file.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [illegal_move] The rook cannot reach e1: the pawn on e4 blocks the file.

### Step 57: practice

A drill of 6 tasks drawn from the bank by tag ['theme.backRankMate', 'cue.3'] (57 tasks carry those tags). Not reproduced here; ask for a sample if you want one checked.

### Step 58: board

Caption: From a Lichess puzzle record (eSn5l, CC0), tagged as a master game in that database. White to move. Black's rook on e1 attacks the white rook on g1. In the game White took the pawn on a6 with the queen. What could go wrong with that?

```
  8  . . . . r . . k
  7  . Q . . . . b p
  6  p . . . . . p .
  5  . p . . . . . .
  4  . . . . . . . .
  3  . . . . . B . .
  2  . . . . . N P P
  1  . . . . r . R K
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 4r2k/1Q4bp/p5p1/1p6/8/5B2/5NPP/4r1RK w - - 1 46
```

Drawn on the board: highlighted squares a6, e1, g1, h1.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [attackers] Black's rook on e1 attacks White's rook on g1.
- [move_loses] The queen capture on a6 loses to a forced mate.
- [best_move_in] A knight move is best.
- [eval_range] White stands clearly better (engine, depth 16).

### Step 59: board

Caption: In the game the queen took on a6. Black to move. Predict Black's forcing move before you step: the white king has only its own pawns for cover.

```
  8  . . . . r . . k
  7  . . . . . . b p
  6  Q . . . . . p .
  5  . p . . . . . .
  4  . . . . . . . .
  3  . . . . . B . .
  2  . . . . . N P P
  1  . . . . r . R K
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: 4r2k/6bp/Q5p1/1p6/8/5B2/5NPP/4r1RK b - - 0 46
```

The line, with the sentence the learner sees at each move:
1. **46... Rxg1+**: A rook sacrifice: the capture on g1 forces the king to recapture.
2. **47. Kxg1**: The king takes the rook. Its shelter is now the first rank, with no air.

```
  8  . . . . r . . k
  7  . . . . . . b p
  6  Q . . . . . p .
  5  . p . . . . . .
  4  . . . . . . . .
  3  . . . . . B . .
  2  . . . . . N P P
  1  . . . . . . K .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 4r2k/6bp/Q5p1/1p6/8/5B2/5NPP/6K1 b - - 0 47
```

Drawn on the board: highlighted squares e1, g1, h1.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [mate_in] Black mates in two moves.
- [attackers] The rook on e1 attacks g1.

### Step 60: board

Caption: Black to move again. The second rook is still on e8. Predict the finish.

```
  8  . . . . r . . k
  7  . . . . . . b p
  6  Q . . . . . p .
  5  . p . . . . . .
  4  . . . . . . . .
  3  . . . . . B . .
  2  . . . . . N P P
  1  . . . . . . K .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: 4r2k/6bp/Q5p1/1p6/8/5B2/5NPP/6K1 b - - 0 47
```

The line, with the sentence the learner sees at each move:
1. **47... Re1#**: The second rook checks along the rank. The pawns hold the king in: mate. One sacrifice dragged the king where the other rook could reach it.

```
  8  . . . . . . . k
  7  . . . . . . b p
  6  Q . . . . . p .
  5  . p . . . . . .
  4  . . . . . . . .
  3  . . . . . B . .
  2  . . . . . N P P
  1  . . . . r . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 7k/6bp/Q5p1/1p6/8/5B2/5NPP/4r1K1 w - - 1 48
```

Drawn on the board: highlighted squares e1, g1.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [mate_in] Black mates in one.

### Step 61: card

**Recap.** A back-rank mate needs three things together: no flight square, nothing to capture the checker, nothing to block. Any piece that can check along the rank will do. The cure is cheap: a luft, a guard, or noticing that no heavy piece can arrive. Count defenders before an exchange. Look at both kings on every move. Positions with no mate are common, so ask the three questions every time.

### Step 62: card

**Self-check.** Before you write, test yourself. Did I say when it works (all three conditions)? Did I say when it fails (flight, capture, block)? Did I give an example a beginner could set up with a few pieces? Did I name one mistake, such as grabbing a pawn with the only guard? Nothing here is graded; the list is only for you.

### Step 63: reflect

Kind: unsure

Prompt: Teach it back. Explain back-rank mate and luft to a beginner who knows how the pieces move. Use your own words.

- Field "The idea:" (free text)

- Field "When it works:" (free text)

- Field "An example a beginner could set up:" (free text)

- Field "One warning:" (free text)

---

## Reviewer scorecard

Fill in the file `content/review/L-TAC-BACKRANK-1.json` (a template is below). Scale 1 to 5 for each dimension: 1 = wrong or unusable, 3 = acceptable with edits, 5 = I would put my name to it as it stands.
Revision to review: `34facf40`. If the lesson text changes after your review, your sign-off no longer applies and the lesson goes back to needs-human.

| Dimension | What to judge | Score |
|---|---|---|
| chess | every statement, line and explanation is correct; near-misses are really near-misses | |
| clarity | the explanation actually explains (mechanism, conditions), in plain words | |
| prerequisites | the lesson assumes only what the learner has met | |
| tasks | each task has one defensible answer and a fair explanation | |

```json
{
  "lesson": "L-TAC-BACKRANK-1",
  "revision": "34facf40",
  "reviewer": "<your name>",
  "reviewer_role": "strong-player",
  "date": "YYYY-MM-DD",
  "scores": {"chess": 0, "clarity": 0, "prerequisites": 0, "tasks": 0},
  "comments": "<what to change, by step number>",
  "verdict": "approved"
}
```

`reviewer_role` is `strong-player` or `teacher`. `verdict` is `approved` or `changes-requested`. See docs/review-slice.md.
