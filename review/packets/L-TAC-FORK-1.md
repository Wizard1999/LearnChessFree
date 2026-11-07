# Review packet: L-TAC-FORK-1

**Forks: how to see them, set them up and stop them**

- Skill: TAC.FORK (D1); stage: exemplar; stated length: 42 minutes
- Steps: 65 (15 are tasks); revision: `52f253e8`
- Review status now: needs-human

## What the lesson says the learner will be able to do

- Finds a fork for each kind of piece (knight, pawn, queen, bishop, rook, king) and names the two targets
- Checks a fork against the four answers (capture the forker, check first, defend both, move one and defend the other) before relying on it
- Sets up a fork with a forcing move that puts the targets on the forking lines
- Runs a safety scan on their own move and avoids a move that allows a knight fork
- Explains forks to a beginner with the idea, when it works, an example and a warning

## Sources the author names (check that they are used fairly, in our own words)

- docs/lesson-depth-standard.md (sections 3, 4, 7: class B, anatomy of a deep lesson, conjecture and views)
- docs/first-hours.md and sources/sheets/znosko-borovsky_middle-game.md (baseline ideas, one-feature-change minimal pairs; Znosko-Borovsky on real versus fictitious threats, docs/citable-views.md 5.9 [V-sheet])
- Dan Heisman on Hope Chess and Looking for Trouble (docs/citable-views.md 10.4 to 10.6) [S], paraphrased
- Jacob Aagaard, Excelling at Chess Calculation, on overlooked candidates (docs/citable-views.md 10.7) [S, a reviewer's account], paraphrased
- Edward Lasker, Chess Strategy, on defenders that are illusions and on counting attackers and defenders (docs/citable-views.md 5.8, 10.9) [V-sheet], paraphrased
- docs/competition-chess-steps.md (a named search routine per tactic, labelled then unlabelled mixes, a closing reminder page) [S]; docs/competition-chesscom.md (thin beginner lessons, a coach that names moves without reasons) [S]
- Games: Byrne v Fischer, New York 1956, and Anderssen v Dufresne, Berlin 1852 (moves are facts; sources as cited in L-FG-GAME-CENTURY-1 and L-FG-EVERGREEN-1)
- Positions: engine statements from Stockfish 19 lite single-thread at depth 16 via tools/validate_lessons.py and tools/validate.py; puzzle positions from the Lichess puzzle database (CC0); counts of fork puzzles from app/public/content/items.json (39 items with a single forking first move)

## How to read this packet

Boards are drawn with capitals for White and lower case for Black, rank 8 at the top unless the board is shown from Black's side. Moves in a line are in standard notation. Statements marked [V] were machine-checked, [I] inference, [H] hypothesis, [S] secondary source, [R] recalled. Please judge the explanations, not only the moves: does each sentence tell the learner why?

---

### Step 1: item  (shown without telling the learner the topic: unlabeled test)

**Task `IL-47UWV`** (find_move, difficulty cue 3)

Black to move. Find the best move.

```
  1  . K . . R . . .
  2  P B P . . . . .
  3  . P N B . . . .
  4  . . . P . P P .
  5  n . . p Q . . .
  6  . p . n p . p R
  7  p . p b . . . .
  8  . k r . q . r .
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: 1r1q1rk1/4bp1p/Rp1pn1p1/3Qp2n/1PP1P3/4BNP1/5PBP/3R2K1 b - - 0 23
```

**Accepted answer(s):** Nc7

Feedback shown for wrong moves:
- Nxg3: Not best: the engine rates this move at least 4 pawns worse than the best move.

**Explanation shown:** Along the engine's best line this move nets Black at least 3 points of material (pawn 1, minor piece 3, rook 5, queen 9).

Hints (in order):
1. Look for enemy pieces that are undefended or only lightly defended, and note where your pieces can jump to.
2. Is there a square from which one of your pieces would attack two targets at once?
3. A good first move is made by the piece on e6.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] The engine's best move is among the accepted moves, and every accepted move is within 40 centipawns of it (depth 16).
- [material_after_move] Along the engine's best-defence line, Nc7 nets Black at least 3 points of material (pawn 1, minor piece 3, rook 5, queen 9).
- [move_loses] Nxg3 is at least 4 pawns worse than the best move (depth 16).

### Step 2: reflect

Kind: expect

Prompt: Write the move you chose. Then name one reply by the other side that you did NOT test before you moved. Nothing is explained yet.

- Field "My move:" (free text)

- Field "A reply I did not test:" (free text)

### Step 3: card

**This lesson, as four tests you can take yourself.**
1. **See** a fork, for every kind of piece.
2. **Check** it against the four answers an opponent can give.
3. **Set one up** with forcing moves.
4. **Stop** one against you, and teach it to a beginner.
A **fork** is one move that makes two threats. It wins only when no single reply meets both.

### Step 4: contrast

Title: Same jump, one change

Prompt: Black's king now stands on d8. Does the knight jump to the same square still win the queen? Predict first, then check.

**The working board:**

**Task `I-FORK-001`** (find_move, difficulty cue 1)

Find the fork.

```
  8  . . . . k . . .
  7  . . . . . p p p
  6  q . . . . . . .
  5  . . . N . . . .
  4  . . . . . . . .
  3  . . . . . . . P
  2  . . . . . P P .
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 4k3/5ppp/q7/3N4/8/7P/5PP1/6K1 w - - 0 1
```

**Accepted answer(s):** Nc7+

**Explanation shown:** Nc7+ attacks the king and the queen at once. The king must move, and the knight then takes the queen. The engine line nets White +9 and keeps the knight.

Hints (in order):
1. Look for a move that gives check.
2. Can one piece attack the king and something valuable at the same time?
3. A knight's jump can reach a square that attacks both.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] (no sentence; a rules check)
- [material_after_move] Nc7+ wins the queen and keeps the knight.

**The failing board:**

**Task `I-FORK-003`** (predict_outcome, difficulty cue 3)

Does Nc7 still win the queen? Predict, then check.

```
  8  . . . k . . . .
  7  . . . . . p p p
  6  q . . . . . . .
  5  . . . N . . . .
  4  . . . . . . . .
  3  . . . . . . . P
  2  . . . . . P P .
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 3k4/5ppp/q7/3N4/8/7P/5PP1/6K1 w - - 0 1
```

**Accepted answer:** {"outcome": "no"}

**Explanation shown:** With the king on d8, a knight landing on c7 is next to it and simply gets captured. In the engine line White loses the knight for nothing (net -3).

Hints (in order):
1. Where is Black's king compared with the square c7?
2. Can the king capture the knight after it lands?

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [material_after_move] Nc7 loses the knight: the king on d8 captures it, so the idea fails.

### Step 5: reflect

Kind: expect

Prompt: What changed between the two positions, and why did it matter?

- Field "What changed:" with options: the queen is better protected / nothing important / the knight is pinned / the king now covers the landing square; correct: the king now covers the landing square

### Step 6: item

**Task `ITAC-LTACFORK1-1`** (predict_outcome, difficulty cue 2)

White to move. Black has one more piece than in the position before. Does the knight jump to c7 still win the queen? Predict, then check.

```
  8  . . r . k . . .
  7  . . . . . p p p
  6  q . . . . . . .
  5  . . . N . . . .
  4  . . . . . . . .
  3  . . . . . . . P
  2  . . . . . P P .
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 2r1k3/5ppp/q7/3N4/8/7P/5PP1/6K1 w - - 0 1
```

**Accepted answer:** {"outcome": "no"}

**Explanation shown:** The knight attacks the king and the queen, but the rook on c8 can capture it on c7. The forker is not safe.

Hints (in order):
1. Which black pieces can reach c7?
2. Count the attackers of the landing square.
3. The rook on c8 reaches c7.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] (no sentence; a rules check)
- [material_after_move] Along the engine line the knight jump nets no material.

### Step 7: board

Caption: A third version: one more black piece. Step through the jump.

```
  8  . . r . k . . .
  7  . . . . . p p p
  6  q . . . . . . .
  5  . . . N . . . .
  4  . . . . . . . .
  3  . . . . . . . P
  2  . . . . . P P .
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 2r1k3/5ppp/q7/3N4/8/7P/5PP1/6K1 w - - 0 1
```

The line, with the sentence the learner sees at each move:
1. **1. Nc7+**: The knight lands on c7 and again attacks the king and the queen.
2. **1... Rxc7**: But the rook on c8 guards c7 and takes the knight. A fork needs a landing square that is safe.

```
  8  . . . . k . . .
  7  . . r . . p p p
  6  q . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . P
  2  . . . . . P P .
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 4k3/2r2ppp/q7/8/8/7P/5PP1/6K1 w - - 0 2
```

Drawn on the board: arrows c8-c7, c7-e8, c7-a6; highlighted squares c7.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] (no sentence; a rules check)
- [attackers] One black piece, the rook on c8, attacks the landing square c7.
- [material_after_move] Along the engine line the knight jump nets no material.

### Step 8: card

**The idea, with its conditions.** A fork is one move that attacks two targets at once. It usually wins material when the opponent has no single reply that deals with both; you will test four kinds of reply later. Check the landing square first, because a forker that is simply captured for nothing is a classic failure. [I] Znosko-Borovsky separated real from fictitious threats [V-sheet]; treating a fork as two threats and asking about each is my own use of that idea.

### Step 9: card

**[H] Which forks get missed?** Hypothesis, not finding: the knight fork is the one people miss most, because its jump leaves no line between it and its targets, and eyes look for lines. Our own puzzle bank cannot test this. [V, reviewer's recount] Among the 81 single-move fork puzzles in the bank (filter: fork theme, find the move), 30 start with a knight move and 24 with a queen move. That shows what the bank contains, not what players miss.

### Step 10: board

Caption: Knight map: from c7 the knight touches six squares, and two of them hold the black king and the rook.

```
  8  . . . . k . . .
  7  . . . . . p p p
  6  r . . . . . . .
  5  . . . N . . . .
  4  . . . . . . . .
  3  . . . . . . . P
  2  . . . . . P P .
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 4k3/5ppp/r7/3N4/8/7P/5PP1/6K1 w - - 0 1
```

The line, with the sentence the learner sees at each move:
1. **1. Nc7+**: The knight lands on c7, where its jumps reach both the king and the rook.
2. **1... Kd7**: The king has to move, because it is in check.
3. **2. Nxa6**: Now the knight takes the rook. The check bought the time.

```
  8  . . . . . . . .
  7  . . . k . p p p
  6  N . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . P
  2  . . . . . P P .
  1  . . . . . . K .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 8/3k1ppp/N7/8/8/7P/5PP1/6K1 b - - 0 2
```

Drawn on the board: arrows c7-e8, c7-a6, c7-a8, c7-b5, c7-d5, c7-e6; highlighted squares c7.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] (no sentence; a rules check)
- [piece_attacks] A knight on c7 attacks exactly these six squares.
- [attackers] The knight attacks the rook on a6.
- [attackers] The knight attacks the king on e8.
- [material_after_move] Along the engine line the jump wins at least a rook.

### Step 11: board

Caption: An endgame fork. White's pawn on b6 wants to run, and Black's rook stands on b3.

```
  8  . . . . . . . .
  7  . . . . . . . .
  6  . P N . . . . .
  5  . . . K . k . .
  4  . . . . . . . .
  3  . r . . . . . .
  2  . . . . . . . .
  1  . . . . . . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 8/8/1PN5/3K1k2/8/1r6/8/8 w - - 1 50
```

The line, with the sentence the learner sees at each move:
1. **50. Nd4+**: The knight checks the king on f5 and attacks the rook on b3 at once.
2. **50... Kg4**: The king steps aside. Nothing defends the rook.
3. **51. Nxb3**: The knight takes the rook, and the b-pawn is free to advance.

```
  8  . . . . . . . .
  7  . . . . . . . .
  6  . P . . . . . .
  5  . . . K . . . .
  4  . . . . . . k .
  3  . N . . . . . .
  2  . . . . . . . .
  1  . . . . . . . .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 8/8/1P6/3K4/6k1/1N6/8/8 b - - 0 51
```

Drawn on the board: arrows d4-f5, d4-b3; highlighted squares d4.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] (no sentence; a rules check)
- [best_move_in] (no sentence; a rules check)
- [attackers] The knight attacks the rook on b3.
- [attackers] The knight attacks the king on f5.
- [attackers] No black piece defends the rook on b3.
- [material_after_move] Along the engine line the jump wins the rook.

### Step 12: board

Caption: No check this time: a quiet knight jump. Black to move.

```
  8  r . . . q r . .
  7  . . . . . p . k
  6  . p . . . P p .
  5  . . n . N . . p
  4  . . . R P Q . P
  3  P . . . . . . .
  2  . P . . . P . .
  1  . K . . . . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: r3qr2/5p1k/1p3Pp1/2n1N2p/3RPQ1P/P7/1P3P2/1K5R b - - 2 27
```

The line, with the sentence the learner sees at each move:
1. **27... Ne6**: The knight lands where it attacks both the rook on d4 and the queen on f4.
2. **28. Qd2**: The queen has to move.
3. **28... Nxd4**: The knight takes the rook.
4. **29. Qxd4**: The queen takes the knight. Black has won the exchange, not the queen.

```
  8  r . . . q r . .
  7  . . . . . p . k
  6  . p . . . P p .
  5  . . . . N . . p
  4  . . . Q P . . P
  3  P . . . . . . .
  2  . P . . . P . .
  1  . K . . . . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r3qr2/5p1k/1p3Pp1/4N2p/3QP2P/P7/1P3P2/1K5R b - - 0 29
```

Drawn on the board: arrows e6-d4, e6-f4; highlighted squares e6.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] (no sentence; a rules check)
- [best_move_in] (no sentence; a rules check)
- [piece_attacks] A knight on e6 attacks exactly these squares.
- [material_after_move] Along the engine line the jump nets material.

### Step 13: board

Caption: Pawn map: a pawn attacks the two squares diagonally ahead of it. A pawn on d5 hits c6 and e6.

```
  8  . . . . k . . .
  7  . . . . . p p p
  6  . . n . n . . .
  5  . . . . . . . .
  4  . . . P . . . .
  3  . . . . . . . P
  2  . . . . . P P .
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 4k3/5ppp/2n1n3/8/3P4/7P/5PP1/6K1 w - - 0 1
```

The line, with the sentence the learner sees at each move:
1. **1. d5**: The pawn steps forward and attacks both knights.
2. **1... Ncd4**: One knight escapes.
3. **2. dxe6**: The pawn takes the other one.
4. **2... fxe6**: Black recaptures the pawn, but White has won a knight for a pawn.

```
  8  . . . . k . . .
  7  . . . . . . p p
  6  . . . . p . . .
  5  . . . . . . . .
  4  . . . n . . . .
  3  . . . . . . . P
  2  . . . . . P P .
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 4k3/6pp/4p3/8/3n4/7P/5PP1/6K1 w - - 0 3
```

Drawn on the board: arrows d5-c6, d5-e6; highlighted squares d5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] (no sentence; a rules check)
- [piece_attacks] A pawn on d5 attacks exactly c6 and e6.
- [material_after_move] Along the engine line the pawn move nets material.

### Step 14: board

Caption: A pawn fork, and what it sets up next. Black to move.

```
  8  . . r r . . k .
  7  p . . . b p p p
  6  . . . . q . . .
  5  . . p . . . . .
  4  . . . p . . . .
  3  . P . . P . P .
  2  P B R . Q P K P
  1  . . . R . . . .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: 2rr2k1/p3bppp/4q3/2p5/3p4/1P2P1P1/PBR1QPKP/3R4 b - - 1 25
```

The line, with the sentence the learner sees at each move:
1. **25... d3**: The pawn attacks the queen on e2 and the rook on c2.
2. **26. Rxd3**: White takes the pawn with the other rook.
3. **26... Qe4+**: The black queen now checks the king and attacks the rook on d3: a second fork.
4. **27. Qf3**: White blocks with the queen.
5. **27... Qxd3**: Black takes the rook.

```
  8  . . r r . . k .
  7  p . . . b p p p
  6  . . . . . . . .
  5  . . p . . . . .
  4  . . . . . . . .
  3  . P . q P Q P .
  2  P B R . . P K P
  1  . . . . . . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 2rr2k1/p3bppp/8/2p5/8/1P1qPQP1/PBR2PKP/8 w - - 0 28
```

Drawn on the board: arrows d3-e2, d3-c2; highlighted squares d3.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] (no sentence; a rules check)
- [best_move_in] (no sentence; a rules check)
- [attackers] The pawn attacks the queen on e2.
- [attackers] The pawn attacks the rook on c2.
- [attackers] The queen on e4 attacks the king on g2.
- [attackers] The queen on e4 attacks the rook on d3.
- [material_after_move] Along the engine line the pawn move nets material.

### Step 15: board

Caption: A pawn check that forks the king and the queen. White to move.

```
  8  r n . . . r . .
  7  p p p . . p . .
  6  . . . b k . q .
  5  . . . p . . . .
  4  . . . P . P . Q
  3  . . P . . . . P
  2  P P . . . . P .
  1  R N . . . R K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: rn3r2/ppp2p2/3bk1q1/3p4/3P1P1Q/2P4P/PP4P1/RN3RK1 w - - 4 19
```

The line, with the sentence the learner sees at each move:
1. **19. f5+**: The pawn checks the king on e6 and attacks the queen on g6.
2. **19... Qxf5**: If the queen takes the pawn, that also answers the check.
3. **20. Rxf5**: The rook takes the queen.
4. **20... Kxf5**: The king takes the rook. White gave a pawn and a rook for the queen.

```
  8  r n . . . r . .
  7  p p p . . p . .
  6  . . . b . . . .
  5  . . . p . k . .
  4  . . . P . . . Q
  3  . . P . . . . P
  2  P P . . . . P .
  1  R N . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: rn3r2/ppp2p2/3b4/3p1k2/3P3Q/2P4P/PP4P1/RN4K1 w - - 0 21
```

Drawn on the board: arrows f5-e6, f5-g6; highlighted squares f5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] (no sentence; a rules check)
- [best_move_in] (no sentence; a rules check)
- [attackers] The pawn attacks the queen on g6.
- [attackers] The pawn attacks the king on e6.
- [eval_range] (no sentence; a rules check)

### Step 16: board

Caption: The queen forks from a distance. Black to move.

```
  8  r . . . . r k .
  7  . p q b b p p p
  6  P . . p p n . .
  5  . . . . . . . .
  4  . . B . P P . .
  3  . . N P . Q . .
  2  . B P . . . P P
  1  R . . . . R K .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: r4rk1/1pqbbppp/P2ppn2/8/2B1PP2/2NP1Q2/1BP3PP/R4RK1 b - - 0 14
```

The line, with the sentence the learner sees at each move:
1. **14... Qb6+**: The queen checks the king along the diagonal and attacks the bishop on b2.
2. **15. Qf2**: White interposes with the queen.
3. **15... Qxb2**: The queen takes the bishop.

```
  8  r . . . . r k .
  7  . p . b b p p p
  6  P . . p p n . .
  5  . . . . . . . .
  4  . . B . P P . .
  3  . . N P . . . .
  2  . q P . . Q P P
  1  R . . . . R K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r4rk1/1p1bbppp/P2ppn2/8/2B1PP2/2NP4/1qP2QPP/R4RK1 w - - 0 16
```

Drawn on the board: arrows b6-g1, b6-b2; highlighted squares b6.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] (no sentence; a rules check)
- [best_move_in] (no sentence; a rules check)
- [attackers] The queen attacks the king on g1.
- [attackers] The queen attacks the bishop on b2.
- [material_after_move] Along the engine line the queen move nets material.

### Step 17: board

Caption: The queen forks along a diagonal and a file. White to move.

```
  8  . r r . . . k .
  7  p . . . . . p p
  6  . . . p . p . .
  5  Q . . . . . . .
  4  . . . . . . . .
  3  P . . n . N P .
  2  . q . . . P . P
  1  . . . . R . K R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 1rr3k1/p5pp/3p1p2/Q7/8/P2n1NP1/1q3P1P/4R1KR w - - 1 24
```

The line, with the sentence the learner sees at each move:
1. **24. Qd5+**: The queen checks along the diagonal and attacks the knight on d3 along the file.
2. **24... Kh8**: The king steps aside.
3. **25. Qxd3**: The queen takes the knight.

```
  8  . r r . . . . k
  7  p . . . . . p p
  6  . . . p . p . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  P . . Q . N P .
  2  . q . . . P . P
  1  . . . . R . K R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 1rr4k/p5pp/3p1p2/8/8/P2Q1NP1/1q3P1P/4R1KR b - - 0 25
```

Drawn on the board: arrows d5-g8, d5-d3; highlighted squares d5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] (no sentence; a rules check)
- [best_move_in] (no sentence; a rules check)
- [attackers] The queen attacks the king on g8.
- [attackers] The queen attacks the knight on d3.
- [material_after_move] Along the engine line the queen move nets material.

### Step 18: board

Caption: A check from a distance, with a loose rook on the same diagonal. White to move.

```
  8  . . . . . . . .
  7  . . . . . p . p
  6  . . . . q Q p k
  5  . . . . . . . .
  4  . . . . B . . .
  3  . . . N . P . .
  2  . . . K . P . r
  1  . . . . . . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 8/5p1p/4qQpk/8/4B3/3N1P2/3K1P1r/8 w - - 10 39
```

The line, with the sentence the learner sees at each move:
1. **39. Qf4+**: The queen checks the king on h6 and attacks the rook on h2.
2. **39... Kg7**: The king steps aside.
3. **40. Qxh2**: The queen takes the rook.

```
  8  . . . . . . . .
  7  . . . . . p k p
  6  . . . . q . p .
  5  . . . . . . . .
  4  . . . . B . . .
  3  . . . N . P . .
  2  . . . K . P . Q
  1  . . . . . . . .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 8/5pkp/4q1p1/8/4B3/3N1P2/3K1P1Q/8 b - - 0 40
```

Drawn on the board: arrows f4-h6, f4-h2; highlighted squares f4.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] (no sentence; a rules check)
- [best_move_in] (no sentence; a rules check)
- [attackers] The queen attacks the king on h6.
- [attackers] The queen attacks the rook on h2.
- [material_after_move] Along the engine line the queen move nets material.

### Step 19: board

Caption: The bishop forks along its two diagonals: one to the king, one to a rook.

```
  8  . . . . . . k .
  7  . b . . . . . .
  6  . p . p . . . .
  5  p . . . p . . .
  4  P . . n . . . .
  3  . r . B B . K P
  2  . . . . . P . .
  1  . . . R . . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 6k1/1b6/1p1p4/p3p3/P2n4/1r1BB1KP/5P2/3R4 w - - 2 36
```

The line, with the sentence the learner sees at each move:
1. **36. Bc4+**: The bishop checks the king along one diagonal and attacks the rook on b3 along the other.
2. **36... d5**: Black blocks the check with a pawn.
3. **37. Bxb3**: The bishop takes the rook.
4. **37... Nxb3**: The knight takes the bishop back.

```
  8  . . . . . . k .
  7  . b . . . . . .
  6  . p . . . . . .
  5  p . . p p . . .
  4  P . . . . . . .
  3  . n . . B . K P
  2  . . . . . P . .
  1  . . . R . . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 6k1/1b6/1p6/p2pp3/P7/1n2B1KP/5P2/3R4 w - - 0 38
```

Drawn on the board: arrows c4-g8, c4-b3; highlighted squares c4.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] (no sentence; a rules check)
- [best_move_in] (no sentence; a rules check)
- [attackers] The bishop attacks the king on g8.
- [attackers] The bishop attacks the rook on b3.
- [material_after_move] Along the engine line the bishop move nets material.

### Step 20: board

Caption: Count what can recapture before you rely on the check. Black to move.

```
  8  . r . . . . k .
  7  Q . . . . . . p
  6  . . . . p p . .
  5  . . . . r n . N
  4  . b . . . . . .
  3  . . . . . P . P
  2  . . . . . . P .
  1  . . . . . R K .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: 1r4k1/Q6p/4pp2/4rn1N/1b6/5P1P/6P1/5RK1 b - - 1 38
```

The line, with the sentence the learner sees at each move:
1. **38... Bc5+**: The bishop checks the king and attacks the queen on a7.
2. **39. Qxc5**: White's queen may take the bishop.
3. **39... Rxc5**: But the rook on e5 takes the queen back. Black gave a bishop for a queen.

```
  8  . r . . . . k .
  7  . . . . . . . p
  6  . . . . p p . .
  5  . . r . . n . N
  4  . . . . . . . .
  3  . . . . . P . P
  2  . . . . . . P .
  1  . . . . . R K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 1r4k1/7p/4pp2/2r2n1N/8/5P1P/6P1/5RK1 w - - 0 40
```

Drawn on the board: arrows c5-g1, c5-a7, e5-c5; highlighted squares c5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] (no sentence; a rules check)
- [best_move_in] (no sentence; a rules check)
- [attackers] The bishop attacks the queen on a7.
- [attackers] One black piece guards the bishop on c5.
- [material_after_move] Along the engine line the bishop move nets material.

### Step 21: board

Caption: A rook forks along a rank by climbing to it. White to move.

```
  8  r . . . . . . r
  7  . . p k . p p p
  6  p . . . . . . .
  5  . p . b . . b .
  4  . . . . . . . .
  3  . . P P . p . P
  2  P P . . . P . .
  1  R . . B R N K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: r6r/2pk1ppp/p7/1p1b2b1/8/2PP1p1P/PP3P2/R2BRNK1 w - - 0 21
```

The line, with the sentence the learner sees at each move:
1. **21. Re5**: The rook climbs the e-file and attacks both bishops along the fifth rank.
2. **21... Bb7**: One bishop escapes.
3. **22. Rxg5**: The rook takes the other bishop.

```
  8  r . . . . . . r
  7  . b p k . p p p
  6  p . . . . . . .
  5  . p . . . . R .
  4  . . . . . . . .
  3  . . P P . p . P
  2  P P . . . P . .
  1  R . . B . N K .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r6r/1bpk1ppp/p7/1p4R1/8/2PP1p1P/PP3P2/R2B1NK1 b - - 0 22
```

Drawn on the board: arrows e5-d5, e5-g5; highlighted squares e5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] (no sentence; a rules check)
- [best_move_in] (no sentence; a rules check)
- [attackers] The rook attacks the bishop on d5.
- [attackers] The rook attacks the bishop on g5.
- [material_after_move] Along the engine line the rook move nets material.

### Step 22: board

Caption: A rook check with a second target on the same rank, on the other side of the king.

```
  8  . . . . . . . .
  7  . b . . . . . k
  6  . . . . . p p .
  5  p . . . . . . p
  4  . . . . . . . .
  3  . . . . . . . .
  2  P P . . . P P P
  1  . . . . R . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 8/1b5k/5pp1/p6p/8/8/PP3PPP/4R1K1 w - - 0 1
```

The line, with the sentence the learner sees at each move:
1. **1. Re7+**: The rook checks the king along the seventh rank and attacks the bishop on the other side.
2. **1... Kg8**: The king steps out of check.
3. **2. Rxb7**: The rook takes the bishop.

```
  8  . . . . . . k .
  7  . R . . . . . .
  6  . . . . . p p .
  5  p . . . . . . p
  4  . . . . . . . .
  3  . . . . . . . .
  2  P P . . . P P P
  1  . . . . . . K .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 6k1/1R6/5pp1/p6p/8/8/PP3PPP/6K1 b - - 0 2
```

Drawn on the board: arrows e7-h7, e7-b7; highlighted squares e7.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] (no sentence; a rules check)
- [attackers] The rook attacks the king on h7.
- [attackers] The rook attacks the bishop on b7.
- [material_after_move] Along the engine line the rook move nets material.

### Step 23: board

Caption: A king can fork too, when both pieces are loose and he does not step into a check.

```
  8  . . . . . . . .
  7  . . . . . . p p
  6  . . . k . p . .
  5  . p . . p . . .
  4  p P . . P . . .
  3  P . . r . P . .
  2  . . R . . . P P
  1  . N . n . K . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 8/6pp/3k1p2/1p2p3/pP2P3/P2r1P2/2R3PP/1N1n1K2 w - - 7 32
```

The line, with the sentence the learner sees at each move:
1. **32. Ke2**: The king steps up and attacks both the rook on d3 and the knight on d1.
2. **32... Rd4**: The rook runs, but it still guards the knight along the file.
3. **33. Nd2**: The white knight blocks that file, so the black knight loses its guard.
4. **33... h5**: Black cannot save the knight.
5. **34. Kxd1**: The king takes it.

```
  8  . . . . . . . .
  7  . . . . . . p .
  6  . . . k . p . .
  5  . p . . p . . p
  4  p P . r P . . .
  3  P . . . . P . .
  2  . . R N . . P P
  1  . . . K . . . .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 8/6p1/3k1p2/1p2p2p/pP1rP3/P4P2/2RN2PP/3K4 b - - 0 34
```

Drawn on the board: arrows e2-d3, e2-d1; highlighted squares e2.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] (no sentence; a rules check)
- [attackers] The king attacks the rook on d3.
- [attackers] The king attacks the knight on d1.
- [attackers] After the rook move, the rook on d4 still guards the knight on d1.
- [attackers] After the white knight blocks the file, nothing guards the knight on d1.
- [material_after_move] Along the engine line the king move nets material.

### Step 24: practice

A drill of 5 tasks drawn from the bank by tag ['set.fork1.ladder'] (5 tasks carry those tags). Not reproduced here; ask for a sample if you want one checked.

### Step 25: card

**A seeing routine.** Search in a fixed order. The Steps method is reported to teach a search routine for each tactic [S, secondary description; manuals not seen]:
1. List enemy pieces that are loose or worth more than yours.
2. Find one square that touches two of them.
3. Can your piece reach it, ideally with check?
4. Run the four answers.
[H] I suspect starting from targets beats starting from your own checks. Test both orders later.

### Step 26: board

Caption: Board A. capture the forker. The knight jump looks like a fork of the king and the queen. Which of the four answers does Black have? Predict, then step through.

```
  8  . . . . k . . .
  7  . . . q . p p p
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . N . . .
  3  . . . . . . . P
  2  . . . . . P P .
  1  . . . . . R K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 4k3/3q1ppp/8/8/4N3/7P/5PP1/5RK1 w - - 0 1
```

The line, with the sentence the learner sees at each move:
1. **1. Nf6+**: The knight checks the king and attacks the queen on d7.
2. **1... gxf6**: The pawn on g7 simply takes the knight. A cheap piece answers an expensive threat. This board showed the answer: capture the forker.

```
  8  . . . . k . . .
  7  . . . q . p . p
  6  . . . . . p . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . P
  2  . . . . . P P .
  1  . . . . . R K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 4k3/3q1p1p/5p2/8/8/7P/5PP1/5RK1 w - - 0 2
```

Drawn on the board: arrows g7-f6, f6-d7, f6-e8; highlighted squares f6.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] (no sentence; a rules check)
- [attackers] The knight attacks the queen on d7.
- [attackers] The pawn on g7 attacks the knight on f6.
- [material_after_move] Along the engine line the jump loses material.

### Step 27: board

Caption: Board B. check first. The knight jump attacks the queen and the rook. Which of the four answers does Black have? Predict, then step through.

```
  8  . . . . . . k .
  7  . . . r . p p p
  6  q . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . N . . . . P .
  2  . . . . . P K P
  1  . . . . . R . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 6k1/3r1ppp/q7/8/8/1N4P1/5PKP/5R2 w - - 0 1
```

The line, with the sentence the learner sees at each move:
1. **1. Nc5**: The knight attacks the queen on a6 and the rook on d7.
2. **1... Qc6+**: The queen escapes with check along the long diagonal.
3. **2. Kg1**: The king must answer the check.
4. **2... Qxc5**: Now the queen takes the knight. The check bought the tempo. This board showed the answer: check first.

```
  8  . . . . . . k .
  7  . . . r . p p p
  6  . . . . . . . .
  5  . . q . . . . .
  4  . . . . . . . .
  3  . . . . . . P .
  2  . . . . . P . P
  1  . . . . . R K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 6k1/3r1ppp/8/2q5/8/6P1/5P1P/5RK1 w - - 0 3
```

Drawn on the board: arrows c5-a6, c5-d7, c6-g2; highlighted squares c5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] (no sentence; a rules check)
- [attackers] The knight attacks the queen on a6.
- [attackers] The knight attacks the rook on d7.
- [attackers] After the queen move, the queen attacks the king on g2.
- [material_after_move] Along the engine line the jump loses material.

### Step 28: board

Caption: Board C. defend both. Here the two targets already guard each other. Which of the four answers does Black have? Predict, then step through.

```
  8  . . . . . . k .
  7  . . . . . . p p
  6  . . . N . b . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . b . . . . P
  2  . . . . . P P .
  1  . . . . . R K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 6k1/6pp/3N1b2/8/8/2b4P/5PP1/5RK1 w - - 0 1
```

The line, with the sentence the learner sees at each move:
1. **1. Ne4**: The knight attacks both bishops, which guard each other along the diagonal.
2. **1... Kf7**: Black can even ignore the fork.
3. **2. Nxc3**: The knight takes one bishop.
4. **2... Bxc3**: The other bishop takes the knight. A trade, nothing won. This board showed the answer: defend both.

```
  8  . . . . . . . .
  7  . . . . . k p p
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . b . . . . P
  2  . . . . . P P .
  1  . . . . . R K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 8/5kpp/8/8/8/2b4P/5PP1/5RK1 w - - 0 3
```

Drawn on the board: arrows e4-c3, e4-f6, f6-c3, c3-f6; highlighted squares c3, f6.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] (no sentence; a rules check)
- [attackers] The knight attacks the bishop on c3.
- [attackers] The knight attacks the bishop on f6.
- [attackers] A black piece guards the bishop on c3.
- [material_after_move] Along the engine line the jump nets no material.

### Step 29: board

Caption: Board D. move one piece and defend the other. Which of the four answers does Black have? Predict, then step through.

```
  8  . . . . . . k .
  7  . q . . . p p p
  6  . . . . . . . .
  5  . . . . . . . .
  4  b . . . N . . .
  3  . . . . . . . P
  2  . . . . . P P .
  1  . . . . . R K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 6k1/1q3ppp/8/8/b3N3/7P/5PP1/5RK1 w - - 0 1
```

The line, with the sentence the learner sees at each move:
1. **1. Nc5**: The knight attacks the queen on b7 and the bishop on a4.
2. **1... Qb4**: The queen moves and now guards the bishop, and eyes the knight too.
3. **2. Nxa4**: The knight takes the bishop.
4. **2... Qxa4**: The queen takes the knight back. Another even trade. This board showed the answer: move one and defend the other.

```
  8  . . . . . . k .
  7  . . . . . p p p
  6  . . . . . . . .
  5  . . . . . . . .
  4  q . . . . . . .
  3  . . . . . . . P
  2  . . . . . P P .
  1  . . . . . R K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 6k1/5ppp/8/8/q7/7P/5PP1/5RK1 w - - 0 3
```

Drawn on the board: arrows c5-b7, c5-a4, b4-a4; highlighted squares b4.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] (no sentence; a rules check)
- [attackers] The knight attacks the queen on b7.
- [attackers] The knight attacks the bishop on a4.
- [attackers] After the queen move, the queen guards the bishop on a4.
- [attackers] After the queen move, the queen attacks the knight on c5.
- [material_after_move] Along the engine line the jump nets no material.

### Step 30: item

**Task `ITAC-LTACFORK1-12`** (classify_position, difficulty cue 2)

White's knight jump lands on d3 and attacks the rook on c5 and the knight on e5. Which of the four answers does Black have?

```
  8  . . . . . . k .
  7  . . . . . p p p
  6  . . . . . . . .
  5  . . r . n . . .
  4  . . . . . N . .
  3  . . . . . . . P
  2  . . . . . P P .
  1  . . . . . R K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 6k1/5ppp/8/2r1n3/5N2/7P/5PP1/5RK1 w - - 0 1
```

**Accepted answer:** {"class": "capture the forker"}

**Explanation shown:** The knight on e5 is one of the targets, and it also attacks the landing square d3, so it simply takes the forker.

Hints (in order):
1. Which black pieces attack the landing square?
2. Can one of the two targets capture the forker?
3. The knight on e5 attacks d3.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] (no sentence; a rules check)
- [material_after_move] Along the engine line the jump nets no material.
- [attackers] After the jump, one black piece attacks the knight on d3.

### Step 31: card

**A fork usually wins when none of the four answers works:** capture the forker, check first, defend both, or move one and defend the other. [I] These four cover the usual replies, not every reply: a bigger counter-threat, such as a mate threat, is a fifth thing to look for. If you find one, write it down; it is a new answer.

### Step 32: practice

A drill of 5 tasks drawn from the bank by tag ['set.fork1.predict'] (5 tasks carry those tags). Not reproduced here; ask for a sample if you want one checked.

### Step 33: card

**Is the guard real?** Edward Lasker warned that a defender can be an illusion: it may be capturable by a cheaper piece, pulled away or pinned [V-sheet]. The same goes for the pieces a fork attacks. Before you rely on a fork, ask who can capture the forker and whether the target is worth more than your piece. Count what can arrive, not only what is there.

### Step 34: contrast

Title: Is the target worth taking?

Prompt: Both knight jumps check the king and attack a piece on a6. Look at both boards, name the one thing that differs, and predict which jump wins material.

**The working board:**

**Task `ITAC-LTACFORK1-13`** (predict_outcome, difficulty cue 2)

White to move. Does Nc7+ win material? Predict, then check.

```
  8  . . . . k . . .
  7  . p . . . p p p
  6  r . . . . . . .
  5  . . . N . . . .
  4  . . . . . . . .
  3  . . . . . . . P
  2  . . . . . P P .
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 4k3/1p3ppp/r7/3N4/8/7P/5PP1/6K1 w - - 0 1
```

**Accepted answer:** {"outcome": "yes"}

**Explanation shown:** The knight checks the king and attacks the rook, which the b-pawn defends: the knight is worth less than the rook, so taking it still gains material.

Hints (in order):
1. Name the two targets.
2. Ask who can capture the piece you move, and what the opponent can do first.
3. Compare with the position before.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] (no sentence; a rules check)
- [material_after_move] Along the engine line this move nets material.

**The failing board:**

**Task `ITAC-LTACFORK1-14`** (predict_outcome, difficulty cue 2)

White to move. Does Nc7+ win material? Predict, then check.

```
  8  . . . . k . . .
  7  . p . . . p p p
  6  p . . . . . . .
  5  . . . N . . . .
  4  . . . . . . . .
  3  . . . . . . . P
  2  . . . . . P P .
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 4k3/1p3ppp/p7/3N4/8/7P/5PP1/6K1 w - - 0 1
```

**Accepted answer:** {"outcome": "no"}

**Explanation shown:** The same jump now attacks a pawn that the b-pawn defends. Taking it would lose the knight for a pawn, so the fork wins nothing.

Hints (in order):
1. Name the two targets.
2. Ask who can capture the piece you move, and what the opponent can do first.
3. Compare with the position before.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] (no sentence; a rules check)
- [material_after_move] Along the engine line this move nets no material.

### Step 35: contrast

Title: Can the opponent check first?

Prompt: Both knight jumps attack a rook and a bishop. Look at both boards, name the one thing that differs, and predict which jump wins material.

**The working board:**

**Task `ITAC-LTACFORK1-15`** (predict_outcome, difficulty cue 2)

White to move. Does Nd6 win material? Predict, then check.

```
  8  . . . . . . k .
  7  . r . . . p p p
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . b . N . . .
  3  . . . . . . . P
  2  . . . . . P P K
  1  . . . . . . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 6k1/1r3ppp/8/8/2b1N3/7P/5PPK/8 w - - 0 1
```

**Accepted answer:** {"outcome": "yes"}

**Explanation shown:** With the white king off the back rank, Black has no check to play first, and the knight keeps both targets in view.

Hints (in order):
1. Name the two targets.
2. Ask who can capture the piece you move, and what the opponent can do first.
3. Compare with the position before.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] (no sentence; a rules check)
- [material_after_move] Along the engine line this move nets material.

**The failing board:**

**Task `ITAC-LTACFORK1-16`** (predict_outcome, difficulty cue 2)

White to move. Does Nd6 win material? Predict, then check.

```
  8  . . . . . . k .
  7  . r . . . p p p
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . b . N . . .
  3  . . . . . . . P
  2  . . . . . P P .
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 6k1/1r3ppp/8/8/2b1N3/7P/5PP1/6K1 w - - 0 1
```

**Accepted answer:** {"outcome": "no"}

**Explanation shown:** Black plays a rook check first, and the bishop escapes with the extra move.

Hints (in order):
1. Name the two targets.
2. Ask who can capture the piece you move, and what the opponent can do first.
3. Compare with the position before.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] (no sentence; a rules check)
- [material_after_move] Along the engine line this move nets no material.

### Step 36: contrast

Title: Is the landing square guarded?

Prompt: Both knight jumps check the king and attack the rook. Look at both boards, name the one thing that differs, and predict which jump wins material.

**The working board:**

**Task `ITAC-LTACFORK1-17`** (predict_outcome, difficulty cue 2)

White to move. Does Nc7+ win material? Predict, then check.

```
  8  . . . . k . . .
  7  . . . . b p p p
  6  r . . . . . . .
  5  . . . N . . . .
  4  . . . . . . . .
  3  . . . . . . . P
  2  . . . . . P P .
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 4k3/4bppp/r7/3N4/8/7P/5PP1/6K1 w - - 0 1
```

**Accepted answer:** {"outcome": "yes"}

**Explanation shown:** No black piece guards c7, so the knight cannot be taken and the check forces the king to move.

Hints (in order):
1. Name the two targets.
2. Ask who can capture the piece you move, and what the opponent can do first.
3. Compare with the position before.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] (no sentence; a rules check)
- [material_after_move] Along the engine line this move nets material.

**The failing board:**

**Task `ITAC-LTACFORK1-18`** (predict_outcome, difficulty cue 2)

White to move. Does Nc7+ win material? Predict, then check.

```
  8  . . . b k . . .
  7  . . . . . p p p
  6  r . . . . . . .
  5  . . . N . . . .
  4  . . . . . . . .
  3  . . . . . . . P
  2  . . . . . P P .
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 3bk3/5ppp/r7/3N4/8/7P/5PP1/6K1 w - - 0 1
```

**Accepted answer:** {"outcome": "no"}

**Explanation shown:** The bishop on d8 guards c7 and takes the knight.

Hints (in order):
1. Name the two targets.
2. Ask who can capture the piece you move, and what the opponent can do first.
3. Compare with the position before.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] (no sentence; a rules check)
- [material_after_move] Along the engine line this move nets no material.

### Step 37: card

**Setting one up.** Often the fork is not on the board yet. Forcing moves, such as a check, a capture or a threat, leave the opponent no time to choose, so they can drag a king, a queen or a rook onto the forking lines. Ask of each forcing move: where must the reply land, and does that square touch a fork?

### Step 38: board

Caption: A check can drag the king to the fork square. Black to move.

```
  8  . . . . . . . .
  7  p . . r . p k .
  6  . . . . . . . .
  5  . . . . . p N .
  4  . . . . . . n P
  3  . P . . . . P .
  2  P . R . . . . .
  1  . . . . . . . K
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: 8/p2r1pk1/8/5pN1/6nP/1P4P1/P1R5/7K b - - 4 33
```

The line, with the sentence the learner sees at each move:
1. **33... Rd1+**: The rook checks, and the white king has to go somewhere.
2. **34. Kg2**: The king steps to g2, a square the black knight can fork from.
3. **34... Ne3+**: The knight checks the king and attacks the rook on c2.
4. **35. Kf2**: The king moves again.
5. **35... Nxc2**: The knight takes the rook.

```
  8  . . . . . . . .
  7  p . . . . p k .
  6  . . . . . . . .
  5  . . . . . p N .
  4  . . . . . . . P
  3  . P . . . . P .
  2  P . n . . K . .
  1  . . . r . . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 8/p4pk1/8/5pN1/7P/1P4P1/P1n2K2/3r4 w - - 0 36
```

Drawn on the board: arrows d7-d1, e3-g2, e3-c2; highlighted squares e3.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] (no sentence; a rules check)
- [attackers] The knight attacks the king on g2.
- [attackers] The knight attacks the rook on c2.
- [material_after_move] Along the engine line the check wins material.

### Step 39: board

Caption: A capture can drag a piece to the fork square. White to move.

```
  8  . . . . . . . .
  7  . . . . . r k .
  6  p . p . . . . .
  5  . . . . . . . .
  4  P Q . . . q . .
  3  . . . . . . N P
  2  . . . . . . P K
  1  . . . . . . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 8/5rk1/p1p5/8/PQ3q2/6NP/6PK/8 w - - 1 48
```

The line, with the sentence the learner sees at each move:
1. **48. Qxf4**: The queens trade: a capture forces a recapture.
2. **48... Rxf4**: The rook recaptures and lands on f4.
3. **49. Nh5+**: The knight checks the king on g7 and attacks the rook on f4.
4. **49... Kg6**: The king steps aside.
5. **50. Nxf4+**: The knight takes the rook.

```
  8  . . . . . . . .
  7  . . . . . . . .
  6  p . p . . . k .
  5  . . . . . . . .
  4  P . . . . N . .
  3  . . . . . . . P
  2  . . . . . . P K
  1  . . . . . . . .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 8/8/p1p3k1/8/P4N2/7P/6PK/8 b - - 0 50
```

Drawn on the board: arrows b4-f4, h5-g7, h5-f4; highlighted squares h5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] (no sentence; a rules check)
- [attackers] The knight attacks the king on g7.
- [attackers] The knight attacks the rook on f4.
- [material_after_move] Along the engine line the queen trade wins material.

### Step 40: board

Caption: A quiet threat can set it up. White to move.

```
  8  . . . r . . k .
  7  p . . . . p p .
  6  . p . P . . . .
  5  . . . . . b . p
  4  . N . . . . . .
  3  . . . . . . . .
  2  P . . . . K P .
  1  . . . R . . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 3r2k1/p4pp1/1p1P4/5b1p/1N6/8/P4KP1/3R4 w - - 3 38
```

The line, with the sentence the learner sees at each move:
1. **38. Nc6**: The knight attacks the rook on d8 and the pawn on a7.
2. **38... Rd7**: The rook moves.
3. **39. Ne7+**: The knight jumps again, checking the king and attacking the bishop on f5.
4. **39... Kh7**: The king steps aside.
5. **40. Nxf5**: The knight takes the bishop.

```
  8  . . . . . . . .
  7  p . . r . p p k
  6  . p . P . . . .
  5  . . . . . N . p
  4  . . . . . . . .
  3  . . . . . . . .
  2  P . . . . K P .
  1  . . . R . . . .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 8/p2r1ppk/1p1P4/5N1p/8/8/P4KP1/3R4 b - - 0 40
```

Drawn on the board: arrows c6-d8, e7-g8, e7-f5; highlighted squares c6.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] (no sentence; a rules check)
- [attackers] The knight attacks the rook on d8.
- [attackers] The knight attacks the king on g8.
- [attackers] The knight attacks the bishop on f5.
- [material_after_move] Along the engine line the knight move wins material.

### Step 41: practice

A drill of 2 tasks drawn from the bank by tag ['set.fork1.setup'] (3 tasks carry those tags). Not reproduced here; ask for a sample if you want one checked.

### Step 42: card

**Royal and discovered forks.** When the king is a target, the check must be answered first, so the other target cannot simply move away. [I] That makes a check fork the cleanest kind; each board below is checked, the generalisation is my inference. A discovered attack adds a free second threat: a piece moves with a threat of its own and uncovers a line behind it.

### Step 43: board

Caption: A royal fork: the king is one target. White to move.

```
  8  r . b . . . . .
  7  p p k p . N p p
  6  . . . . . . . .
  5  . . b . . P . n
  4  . . . . . . . q
  3  . . N . r Q . .
  2  P P . . . . P P
  1  R . . . . R . K
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: r1b5/ppkp1Npp/8/2b2P1n/7q/2N1rQ2/PP4PP/R4R1K w - - 10 21
```

The line, with the sentence the learner sees at each move:
1. **21. Nd5+**: The knight checks the king on c7 and attacks the rook on e3.
2. **21... Kb8**: The king must move; the rook cannot.
3. **22. Nxe3**: The knight takes the rook.
4. **22... Bxe3**: The bishop retakes: the rook was guarded.
5. **23. Qxe3**: The queen retakes the bishop. The rook was guarded, but the trade still wins a rook and a bishop for a knight.

```
  8  r k b . . . . .
  7  p p . p . N p p
  6  . . . . . . . .
  5  . . . . . P . n
  4  . . . . . . . q
  3  . . . . Q . . .
  2  P P . . . . P P
  1  R . . . . R . K
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: rkb5/pp1p1Npp/8/5P1n/7q/4Q3/PP4PP/R4R1K b - - 0 23
```

Drawn on the board: arrows d5-c7, d5-e3; highlighted squares d5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] (no sentence; a rules check)
- [best_move_in] (no sentence; a rules check)
- [attackers] The knight attacks the king on c7.
- [attackers] The knight attacks the rook on e3.
- [material_after_move] Along the engine line the knight move nets material.

### Step 44: board

Caption: A discovered fork: a bishop move that uncovers a rook. White to move.

```
  8  . . . . . . k .
  7  . . . . . . p p
  6  . . . . . . . .
  5  . P . . . p . .
  4  . . . P p . . .
  3  . . . . . . . .
  2  r . . . . . P K
  1  . . . . q B . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 6k1/6pp/8/1P3p2/3Pp3/8/r5PK/4qB1R w - - 0 33
```

The line, with the sentence the learner sees at each move:
1. **33. Bc4+**: The bishop checks the king and attacks the rook on a2, and it uncovers the rook on h1.
2. **33... Kf8**: The king steps aside.
3. **34. Rxe1**: The rook takes the queen.

```
  8  . . . . . k . .
  7  . . . . . . p p
  6  . . . . . . . .
  5  . P . . . p . .
  4  . . B P p . . .
  3  . . . . . . . .
  2  r . . . . . P K
  1  . . . . R . . .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 5k2/6pp/8/1P3p2/2BPp3/8/r5PK/4R3 b - - 0 34
```

Drawn on the board: arrows c4-g8, c4-a2, h1-e1; highlighted squares c4.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] (no sentence; a rules check)
- [attackers] After the bishop moves, the rook on h1 attacks the queen on e1.
- [attackers] The bishop attacks the king on g8.
- [attackers] The bishop attacks the rook on a2.
- [material_after_move] Along the engine line the bishop move wins material.

### Step 45: practice

A drill of 2 tasks drawn from the bank by tag ['set.fork1.royal'] (3 tasks carry those tags). Not reproduced here; ask for a sample if you want one checked.

### Step 46: card

**Stopping a fork against you.** Before you move, list the opponent's checks, captures and threats that your move allows. Heisman calls skipping this *Hope Chess* [S]; he also pairs it with finding the threat, then preventing it [S]. For forks, look for squares an enemy knight can reach that touch two of your pieces. Aagaard (as a reviewer of his book reports it) says serious errors often begin when a key candidate is overlooked [S].

### Step 47: board

Caption: White's rook is not attacked, but White considers retreating it to e1. Which squares give a black knight check, and what else does f3 hit?

```
  8  . . . . . . . .
  7  . . . . . . . .
  6  . . . . . n . .
  5  . p . k . . . .
  4  . . . . . . P n
  3  . P . . R . . .
  2  P . . . . . . K
  1  . . . . . . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 8/8/5n2/1p1k4/6Pn/1P2R3/P6K/8 w - - 0 50
```

The line, with the sentence the learner sees at each move:
1. **50. Re1**: The rook retreats to the back rank.
2. **50... Nf3+**: The knight jumps to f3: a check on the king that also attacks the rook.
3. **51. Kh3**: The king steps aside.
4. **51... Nxe1**: The knight takes the rook.

```
  8  . . . . . . . .
  7  . . . . . . . .
  6  . . . . . n . .
  5  . p . k . . . .
  4  . . . . . . P .
  3  . P . . . . . K
  2  P . . . . . . .
  1  . . . . n . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 8/8/5n2/1p1k4/6P1/1P5K/P7/4n3 w - - 0 52
```

Drawn on the board: arrows h4-f3, f3-h2, f3-e1; highlighted squares f3.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] (no sentence; a rules check)
- [attackers] The knight attacks the king on h2.
- [attackers] The knight attacks the rook on e1.
- [material_after_move] Along the engine line the retreat loses material.

### Step 48: card

Kg3 keeps the balance (about +0.6 at depth 18 [V]); the rook retreat is far worse. Before any quiet move, list the squares from which an enemy knight gives check, and ask what else each one touches.

### Step 49: practice

A drill of 2 tasks drawn from the bank by tag ['set.fork1.safety'] (3 tasks carry those tags). Not reproduced here; ask for a sample if you want one checked.

### Step 50: card

**Mixed test.** Eight unlabelled positions: some forks, some other tactics, some where no fork works. Aim for 6 of 8; that threshold is our choice, not a research finding. Two of the eight are yes/no, so guessing alone scores about one. If you miss a pin or a skewer, that is another lesson, not a fork failure. Note which search order you used.

### Step 51: practice

A drill of 8 tasks drawn from the bank by tag ['set.fork1.mixed'] (8 tasks carry those tags). Not reproduced here; ask for a sample if you want one checked.

### Step 52: reflect

Kind: expect

Prompt: Which kind of piece did you miss most often in the mixed test? Eight positions are too few to test the knight idea, so treat this as a note, not a result. Did the order you searched in make a difference?

- Field "The piece I missed most:" with options: knight / pawn / queen / bishop / rook / king / it was a pin or skewer, not a fork / none; no single correct answer (a guess or a self-report)

- Field "Which order felt faster:" with options: targets first / my checks first / no difference; no single correct answer (a guess or a self-report)

### Step 53: card

**Two real games.** Byrne v Fischer, New York 1956, and Anderssen v Dufresne, Berlin, usually dated 1852 (the date and status of that game are disputed [S, reviewer's note; not checked here]). Each has a fork-shaped move at a decision point. Predict first: does it win material, and what does the other side hold in reserve? The full games have their own lessons.

### Step 54: item

**Task `ITAC-LTACFORK1-36`** (predict_outcome, difficulty cue 3)

White to move (Byrne v Fischer, New York 1956). The bishop jump to e7 attacks the queen and the rook. Does it win material? Predict, then check.

```
  8  r . . q . r k .
  7  p p . . p p b p
  6  . . p . . . p .
  5  . . . . . . B .
  4  . . . P n . b .
  3  Q . P . . N . .
  2  P . . . . P P P
  1  . . . R K B . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: r2q1rk1/pp2ppbp/2p3p1/6B1/3Pn1b1/Q1P2N2/P4PPP/3RKB1R w K - 0 14
```

**Accepted answer:** {"outcome": "no"}

**Explanation shown:** Both black pieces are attacked, but the queen can step away with threats and the bishop on e7 can be taken, so nothing is won along the engine line.

Hints (in order):
1. Name the two targets.
2. Look at what Black's pieces attack once the queen moves.
3. The queen can leave with a threat of its own.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] (no sentence; a rules check)
- [material_after_move] Along the engine line the bishop jump nets no material.

### Step 55: board

Caption: Byrne v Fischer, New York 1956: White to move at move 14. Black has just taken a pawn on e4. Predict first, then step through.

```
  8  r . . q . r k .
  7  p p . . p p b p
  6  . . p . . . p .
  5  . . . . . . B .
  4  . . . P n . b .
  3  Q . P . . N . .
  2  P . . . . P P P
  1  . . . R K B . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: r2q1rk1/pp2ppbp/2p3p1/6B1/3Pn1b1/Q1P2N2/P4PPP/3RKB1R w K - 0 14
```

The line, with the sentence the learner sees at each move:
1. **14. Bxe7**: The bishop forks the queen and the rook. But the rook is guarded twice, by the bishop on g7 and the king, so taking it wins only the exchange.
2. **14... Qb6**: The queen moves and attacks with it, so White has no time to take the rook for free.
3. **15. Bc4**: White develops and eyes f7, though that pawn is defended.
4. **15... Nxc3**: The knight takes a pawn and attacks the rook on d1: Black's own fork.
5. **16. Bc5**: White attacks the queen again with the bishop.

```
  8  r . . . . r k .
  7  p p . . . p b p
  6  . q p . . . p .
  5  . . B . . . . .
  4  . . B P . . b .
  3  Q . n . . N . .
  2  P . . . . P P P
  1  . . . R K . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r4rk1/pp3pbp/1qp3p1/2B5/2BP2b1/Q1n2N2/P4PPP/3RK2R b K - 1 16
```

Drawn on the board: arrows e7-d8, e7-f8; highlighted squares e7.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] (no sentence; a rules check)
- [attackers] The bishop on e7 attacks the queen on d8.
- [attackers] The bishop on e7 attacks the rook on f8.
- [attackers] The queen on b6 and the bishop on g7 both attack the pawn on d4.
- [attackers] The bishop on c4 attacks the pawn on f7.
- [attackers] The knight on c3 attacks the rook on d1.
- [attackers] The bishop on c5 attacks the queen on b6.
- [material_after_move] Along the engine line the bishop move nets no material.

### Step 56: card

**A fork that wins the exchange can lose the game if the other side gets there first.** After the bishop fork the engine rates the position about 2.9 pawns better for Black at depth 16 [V]. Fischer won this game [R].

### Step 57: reflect

Kind: expect

Prompt: Black can take the knight with the g-pawn. Does White still have something? Decide, then step through the line.

- Field "My decision:" (free text)

### Step 58: board

Caption: Anderssen v Dufresne, Berlin, usually dated 1852: the fork that can be captured. White to move.

```
  8  . r . . k . . r
  7  p b p p n p p p
  6  . b n . . . . .
  5  . . . . P . . q
  4  Q . . . N . . .
  3  B . P B . N . .
  2  P . . . . P P P
  1  R . . . R . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 1r2k2r/pbppnppp/1bn5/4P2q/Q3N3/B1PB1N2/P4PPP/R3R1K1 w k - 1 17
```

The line, with the sentence the learner sees at each move:
1. **17. Nf6+**: The knight checks the king on e8 and attacks the queen on h5.
2. **17... gxf6**: The pawn on g7 takes the knight. White has given up a piece.
3. **18. exf6**: White recaptures with the pawn.
4. **18... Rg8**: Black attacks along the g-file.

```
  8  . r . . k . r .
  7  p b p p n p . p
  6  . b n . . P . .
  5  . . . . . . . q
  4  Q . . . . . . .
  3  B . P B . N . .
  2  P . . . . P P P
  1  R . . . R . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 1r2k1r1/pbppnp1p/1bn2P2/7q/Q7/B1PB1N2/P4PPP/R3R1K1 w - - 1 19
```

Drawn on the board: arrows f6-e8, f6-h5, g7-f6; highlighted squares f6.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] (no sentence; a rules check)
- [attackers] The knight attacks the queen on h5.
- [attackers] The pawn on g7 attacks the knight on f6.
- [material_after_move] Along the engine line the knight jump nets no material.
- [move_loses] The knight jump is worse than the engine's best move at depth 16, so it is a sacrifice, not a plain fork.

### Step 59: card

**The engine's view.** At depth 16 the engine prefers a quieter move (about +5.6) but still rates the sacrifice about +1.0 for White [V]. The move is sound but not the best: a different kind of move, not a mistake.

### Step 60: reflect

Kind: expect

Prompt: [H] A guess, not a finding: Anderssen may have judged that the open lines were worth more than the knight he gave up. A fork that loses the forker can still be right if something more is behind it. What would you want to see on the board before sacrificing the forker?

- Field "What I would want to see:" (free text)

### Step 61: card

**Three typical mistakes.** Grabbing a fork without testing the replies: the fork square can hide a bigger counter-threat. Forking a target that is defended and cheap. Forgetting that the forker can be taken. Each is a way a fork fails. How common each is in real games is [H]: we have not counted. For each position, find the move that avoids the trap.

### Step 62: practice

A drill of 3 tasks drawn from the bank by tag ['set.fork1.mistakes'] (3 tasks carry those tags). Not reproduced here; ask for a sample if you want one checked.

### Step 63: card

**What to remember**
1. A fork is two threats from one move.
2. Any piece can fork; the knight is easiest to miss [H].
3. Find one square that touches two targets.
4. Check the four answers first.
5. Forcing moves can set one up.
6. [I] A king among the targets cannot be saved by moving the other.
7. Scan the opponent's checks, captures and threats first.
8. Test yourself unlabelled; retest.

### Step 64: reflect

Kind: expect

Prompt: Teach a beginner. Write four things: the idea in one sentence, when it works, an example they could set up on a board (pieces and squares), and one warning. Self-check, nothing is graded: did you say what a fork is, when it works (name at least one of the four answers), an example, and one typical mistake?

- Field "The idea:" (free text)

- Field "When it works:" (free text)

- Field "An example to set up:" (free text)

- Field "One warning:" (free text)

### Step 65: reflect

Kind: expect

Prompt: Optional. [H] Practising the safety scan after you have felt a fork land makes it stick better than learning defence first. Do you agree?

- Field "Practise the safety scan after a fork has landed:" with options: agree / disagree / unsure; no single correct answer (a guess or a self-report)

---

## Reviewer scorecard

Fill in the file `content/review/L-TAC-FORK-1.json` (a template is below). Scale 1 to 5 for each dimension: 1 = wrong or unusable, 3 = acceptable with edits, 5 = I would put my name to it as it stands.
Revision to review: `52f253e8`. If the lesson text changes after your review, your sign-off no longer applies and the lesson goes back to needs-human.

| Dimension | What to judge | Score |
|---|---|---|
| chess | every statement, line and explanation is correct; near-misses are really near-misses | |
| clarity | the explanation actually explains (mechanism, conditions), in plain words | |
| prerequisites | the lesson assumes only what the learner has met | |
| tasks | each task has one defensible answer and a fair explanation | |

```json
{
  "lesson": "L-TAC-FORK-1",
  "revision": "52f253e8",
  "reviewer": "<your name>",
  "reviewer_role": "strong-player",
  "date": "YYYY-MM-DD",
  "scores": {"chess": 0, "clarity": 0, "prerequisites": 0, "tasks": 0},
  "comments": "<what to change, by step number>",
  "verdict": "approved"
}
```

`reviewer_role` is `strong-player` or `teacher`. `verdict` is `approved` or `changes-requested`. See docs/review-slice.md.
