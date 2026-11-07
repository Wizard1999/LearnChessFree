# Review packet: L-OD-DRAGON-4

**The main line 9.Bc4: move by move to the critical position**

- Skill: OPN.STRUCT (D2); stage: exemplar; stated length: 42 minutes
- Steps: 65 (10 are tasks); revision: `aeedbee5`
- Review status now: needs-human

## What the lesson says the learner will be able to do

- Plays the thematic line 9.Bc4 Bd7 10.O-O-O Rc8 11.Bb3 Ne5 12.h4 h5 13.Bg5 Rc5 and states the purpose of each move; knows 12.Kb1 is played more often than 12.h4
- Explains why 9.Bc4 stops ...d5 and why 10...Rc8 makes the bishop leave the c-file
- Names the alternatives at moves 9, 10 and 11 and says, with engine evidence at depth 16, which ones cost something
- Recaptures on d4 with the bishop, not the queen, and says why (the discovered attack from g7)
- Reads game counts with their sample size and rating caveat and does not treat them as a verdict

## Sources the author names (check that they are used fairly, in our own words)

- app/public/masters/stats.json (329,379 games, both players 2500+, 2012-2026; counts after 8...Nc6, 9.Bc4, 9...Bd7, 10.O-O-O, 10...Rc8, 11.Bb3, 12.Kb1 and 12.h4 quoted from the tree rows) [V]
- Engine analysis: Stockfish 19 lite single-thread at depth 16 via tools/validate_lessons.py; every engine statement is a claim in this file [V]
- docs/citable-views.md 6.8 and 4.3 (E. Lasker, Lectures 7-8: name the purpose of every move) [V-sheet]
- docs/citable-views.md 6.7 (analyse by plans, not trees; [I] caveat: engines often find extra plans) [V-sheet]
- docs/lesson-depth-standard.md section 6 row 4 [V]
- Positions replayed with python-chess from 1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 g6 6.Be3 Bg7 7.f3 O-O 8.Qd2 Nc6; edited positions are marked in item provenance
- Average-rating column of stats.json is NOT used: values above 3000 are impossible for human players, so the column is suspect pending an audit of tools/build_master_stats.py [V]

## How to read this packet

Boards are drawn with capitals for White and lower case for Black, rank 8 at the top unless the board is shown from Black's side. Moves in a line are in standard notation. Statements marked [V] were machine-checked, [I] inference, [H] hypothesis, [S] secondary source, [R] recalled. Please judge the explanations, not only the moves: does each sentence tell the learner why?

---

## Chapter: Where each side attacks

### Step 1: board

Caption: White to move after 10...Rc8, a position from the main line (58 master games, both players rated 2500+) [V]. The kings stand on opposite wings. Look at where each side's pieces point.

```
  8  . . r q . r k .
  7  p p . b p p b p
  6  . . n p . n p .
  5  . . . . . . . .
  4  . . B N P . . .
  3  . . N . B P . .
  2  P P P Q . . P P
  1  . . K R . . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 2rq1rk1/pp1bppbp/2np1np1/8/2BNP3/2N1BP2/PPPQ2PP/2KR3R w - - 7 11
```

Drawn on the board: arrows c8-c1, g7-b2, c4-f7, h2-h6; highlighted squares c1, g8, c8, g7.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [king_wing] White's king is on the queenside.
- [king_wing] Black's king is on the kingside.
- [open_files] The c-file is half-open for Black and the d-file half-open for White.

### Step 2: reflect

Kind: expect

Prompt: Before any explanation: where will each side attack, and who is faster? Write one sentence for White and one for Black.

- Field "White will attack:" (free text)

- Field "Black will attack:" (free text)

### Step 3: card

**What you will be able to do.** By the end you can play the line from move 9 to move 14 and say what each move is for and why the next one follows. You can name the alternatives at moves 9, 10 and 11 and tell, with engine evidence, which ones cost something. Boards carry the moves; cards carry the ideas. Engine scores are in centipawns: a pawn is about 100. Where the evidence stops you will see [I] (inference) or [H] (hypothesis).

### Step 4: board

Caption: Where we start: the first moves of the Yugoslav set-up (lessons 1 to 3 explain them). White to move after 5...g6; step through the six moves.

```
  8  r n b q k b . r
  7  p p . . p p . p
  6  . . . p . n p .
  5  . . . . . . . .
  4  . . . N P . . .
  3  . . N . . . . .
  2  P P P . . P P P
  1  R . B Q K B . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: rnbqkb1r/pp2pp1p/3p1np1/8/3NP3/2N5/PPP2PPP/R1BQKB1R w KQkq - 0 6
```

The line, with the sentence the learner sees at each move:
1. **6. Be3**: The bishop supports the knight on d4 and prepares the queen move to d2.
2. **6... Bg7**: The Dragon bishop: it takes the long diagonal towards b2.
3. **7. f3**: The pawn supports e4, so the knight on c3 may move, and it clears a path for a pawn storm on the kingside.
4. **7... O-O**: Black castles into the shelter of the bishop and the g6 pawn.
5. **8. Qd2**: The queen supports the bishop's trip to h6 and prepares castling long.
6. **8... Nc6**: Black develops the knight against d4. This is the position from which the main line starts.

```
  8  r . b q . r k .
  7  p p . . p p b p
  6  . . n p . n p .
  5  . . . . . . . .
  4  . . . N P . . .
  3  . . N . B P . .
  2  P P P Q . . P P
  1  R . . . K B . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r1bq1rk1/pp2ppbp/2np1np1/8/3NP3/2N1BP2/PPPQ2PP/R3KB1R w KQ - 3 9
```

Drawn on the board: arrows e3-h6, g7-b2; highlighted squares e3, d2, f3, g7.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [attackers] After f3 the pawn e4 is defended twice: by the knight and the f-pawn.
- [piece_on] Black's bishop stands on g7.
- [piece_on] White's queen stands on d2.
- [king_wing] Black's king is on the kingside.

### Step 5: board

Caption: Black to move after 9.O-O-O. White's bishop is still on f1. Step through the break ...d5.

```
  8  r . b q . r k .
  7  p p . . p p b p
  6  . . n p . n p .
  5  . . . . . . . .
  4  . . . N P . . .
  3  . . N . B P . .
  2  P P P Q . . P P
  1  . . K R . B . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: r1bq1rk1/pp2ppbp/2np1np1/8/3NP3/2N1BP2/PPPQ2PP/2KR1B1R b - - 4 9
```

The line, with the sentence the learner sees at each move:
1. **9... d5**: The thematic break: Black strikes at the centre before White has brought the bishop to c4.
2. **10. exd5**: White takes. The e-file opens and the d-file now has a black pawn on it no longer.
3. **10... Nxd5**: Black recaptures and the knight stands in the centre, with the bishop on g7 looking down the long diagonal.

```
  8  r . b q . r k .
  7  p p . . p p b p
  6  . . n . . . p .
  5  . . . n . . . .
  4  . . . N . . . .
  3  . . N . B P . .
  2  P P P Q . . P P
  1  . . K R . B . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r1bq1rk1/pp2ppbp/2n3p1/3n4/3N4/2N1BP2/PPPQ2PP/2KR1B1R w - - 0 11
```

Drawn on the board: arrows d6-d5, g7-b2; highlighted squares d6, d5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] 9...d5 is the engine's top move here (depth 16).
- [pawn_attackers] After the break the pawn on d5 attacks the pawn on e4.

### Step 6: board

Caption: Black to move after 9.Bc4 (White has not castled yet). The same break ...d5, with the white bishop on c4 instead of f1. Compare it with the first board.

```
  8  r . b q . r k .
  7  p p . . p p b p
  6  . . n p . n p .
  5  . . . . . . . .
  4  . . B N P . . .
  3  . . N . B P . .
  2  P P P Q . . P P
  1  R . . . K . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: r1bq1rk1/pp2ppbp/2np1np1/8/2BNP3/2N1BP2/PPPQ2PP/R3K2R b KQ - 4 9
```

The line, with the sentence the learner sees at each move:
1. **9... d5**: The same break, now with White's bishop on c4.
2. **10. exd5**: White takes and counts: e4 is gone, but the knight on c3 and the bishop on c4 now both look at d5, and Black's recapture is awkward.
3. **10... Na5**: Black hits the bishop. It wins a tempo, but not the pawn back.
4. **11. Bb3**: The bishop steps away and keeps its diagonal. Black cannot take on d5.
5. **11... Nxb3**: Black trades the knight for the bishop.
6. **12. Nxb3**: White recaptures with the knight and keeps the extra pawn on d5.

```
  8  r . b q . r k .
  7  p p . . p p b p
  6  . . . . . n p .
  5  . . . P . . . .
  4  . . . . . . . .
  3  . N N . B P . .
  2  P P P Q . . P P
  1  R . . . K . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r1bq1rk1/pp2ppbp/5np1/3P4/8/1NN1BP2/PPPQ2PP/R3K2R b KQ - 0 12
```

Drawn on the board: arrows c4-d5, c3-d5, d6-d5; highlighted squares c4, d5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [move_loses] 9...d5 is worse than Black's best move by at least 60 centipawns (depth 16).
- [attackers] After 9...d5 three white pieces attack d5.
- [attackers] After 9...d5 two black pieces defend d5.
- [piece_on] The pawn on d5 stays White's after the trade of bishop and knight.

### Step 7: contrast

Title: Does ...d5 lose ground?

Prompt: Predict for each position, then check. One difference matters; one does not.

**The working board:**

**Task `IOD-LODDRAGON4-1`** (predict_outcome, difficulty cue 2)

Black to move; White's bishop is on f1 and neither king has castled. Black is considering ...d5. Does it lose ground, meaning it scores at least 60 centipawns worse than the engine's best move (depth 16)?

```
  8  r . b q . r k .
  7  p p . . p p b p
  6  . . n p . n p .
  5  . . . . . . . .
  4  . . . N P . . .
  3  . . N . B P . .
  2  P P P Q . . P P
  1  R . . . K B . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black.
FEN: r1bq1rk1/pp2ppbp/2np1np1/8/3NP3/2N1BP2/PPPQ2PP/R3KB1R b KQ - 4 9
```

**Accepted answer:** {"outcome": "no, it does not lose ground"}

**Explanation shown:** In this position ...d5 is the engine's top choice at depth 16, so it does not lose ground.

Hints (in order):
1. Where is White's bishop?
2. Count the white pieces that would attack d5 after the pawn arrives.
3. Only two white pieces would attack d5, and the move is the engine's first choice.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] 9...d5 is the engine's top move (depth 16).

**The failing board:**

**Task `IOD-LODDRAGON4-2`** (predict_outcome, difficulty cue 2)

Black to move; White's bishop is on c4 and neither king has castled. Black is considering ...d5. Does it lose ground, meaning it scores at least 60 centipawns worse than the engine's best move (depth 16)?

```
  8  r . b q . r k .
  7  p p . . p p b p
  6  . . n p . n p .
  5  . . . . . . . .
  4  . . B N P . . .
  3  . . N . B P . .
  2  P P P Q . . P P
  1  R . . . K . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black.
FEN: r1bq1rk1/pp2ppbp/2np1np1/8/2BNP3/2N1BP2/PPPQ2PP/R3K2R b KQ - 4 9
```

**Accepted answer:** {"outcome": "yes, it loses ground"}

**Explanation shown:** With the bishop on c4 the break ...d5 scores at least 60 centipawns worse than Black's best move (depth 16): White's bishop is the difference.

Hints (in order):
1. Where is White's bishop?
2. Count the white pieces that would attack d5 after the pawn arrives: pawn, knight and bishop.
3. The bishop on c4 turns the break into a pawn loss.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [move_loses] 9...d5 is at least 60 centipawns worse than the best move (depth 16).

**The irrelevant board:**

**Task `IOD-LODDRAGON4-3`** (predict_outcome, difficulty cue 2)

Black to move; White's bishop is on f1, neither king has castled and Black's a-pawn is on a6. Black is considering ...d5. Does it lose ground, meaning it scores at least 60 centipawns worse than the engine's best move (depth 16)?

```
  8  r . b q . r k .
  7  . p . . p p b p
  6  p . n p . n p .
  5  . . . . . . . .
  4  . . . N P . . .
  3  . . N . B P . .
  2  P P P Q . . P P
  1  R . . . K B . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black.
FEN: r1bq1rk1/1p2ppbp/p1np1np1/8/3NP3/2N1BP2/PPPQ2PP/R3KB1R b KQ - 4 9
```

**Accepted answer:** {"outcome": "no, it does not lose ground"}

**Explanation shown:** The a-pawn on a6 does not touch d5, and the engine still prefers ...d5 at depth 16.

Hints (in order):
1. Compare with the first position: what changed?
2. The a-pawn moved. Does the pawn on a6 attack or defend anything on d5?
3. Where the bishop stands matters; the a-pawn does not.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] 9...d5 is within 40 centipawns of the engine's best move (depth 16), so it does not lose ground.

## Chapter: The bishop on c4 and the trade on d4

### Step 8: card

**What 9.Bc4 takes away.** The Dragon player's freeing move is ...d5. With the bishop on f1 it works. With the bishop on c4 it does not: after the break the pawn on d5 is attacked by the e-pawn, the knight on c3 and the bishop, and defended by the knight and the queen only, three against two. The bishop also looks at f7. [I] A good developing move often works by taking something away from the opponent. The price: the bishop on c4 can become a target. Count first.

### Step 9: board

Caption: Count the pieces after 9.Bc4. Before any break only the knight on f6 watches d5; after ...d5 the queen joins it. Arrows show who looks at d5 and f7. Black to move: which black move has to be careful about these counts?

```
  8  r . b q . r k .
  7  p p . . p p b p
  6  . . n p . n p .
  5  . . . . . . . .
  4  . . B N P . . .
  3  . . N . B P . .
  2  P P P Q . . P P
  1  R . . . K . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: r1bq1rk1/pp2ppbp/2np1np1/8/2BNP3/2N1BP2/PPPQ2PP/R3K2R b KQ - 4 9
```

Drawn on the board: arrows c4-d5, c3-d5, e4-d5, c4-f7, f6-d5; highlighted squares d5, f7.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [attackers] Three white pieces attack d5: pawn, knight and bishop.
- [attackers] Only one black piece attacks d5 now (the queen is blocked by its own pawn on d6).
- [attackers] The bishop on c4 attacks f7.
- [attackers] f7 is defended twice, by the rook and the king.

### Step 10: board

Caption: Black to move after 9.Bc4. This is the main line to the position of the first board. Ask of each move: what does it add?

```
  8  r . b q . r k .
  7  p p . . p p b p
  6  . . n p . n p .
  5  . . . . . . . .
  4  . . B N P . . .
  3  . . N . B P . .
  2  P P P Q . . P P
  1  R . . . K . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: r1bq1rk1/pp2ppbp/2np1np1/8/2BNP3/2N1BP2/PPPQ2PP/R3K2R b KQ - 4 9
```

The line, with the sentence the learner sees at each move:
1. **9... Bd7**: The bishop clears c8 for the rook and guards the knight on c6, so the knight may trade or move later.
2. **10. O-O-O**: White castles long. The kings are on opposite wings, so both sides will attack with pawns.
3. **10... Rc8**: The rook takes the half-open c-file, behind its own knight on c6.

```
  8  . . r q . r k .
  7  p p . b p p b p
  6  . . n p . n p .
  5  . . . . . . . .
  4  . . B N P . . .
  3  . . N . B P . .
  2  P P P Q . . P P
  1  . . K R . . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 2rq1rk1/pp1bppbp/2np1np1/8/2BNP3/2N1BP2/PPPQ2PP/2KR3R w - - 7 11
```

Drawn on the board: arrows d7-c6, c8-c4; highlighted squares d7, c8.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [attackers] After ...Bd7 the knight on c6 is defended twice.
- [king_wing] After O-O-O White's king is on the queenside.
- [open_files] After O-O-O the c-file is half-open for Black.
- [piece_on] The rook stands on c8.

### Step 11: card

**Why ...Bd7 and the trade on d4.** The bishop leaves c8, so the rook can use the c-file, and it guards the knight on c6. That knight is Black's key piece. When it trades on d4 or steps away, the rook looks straight at White's bishop on c4. White therefore needs a plan for that bishop, and he recaptures on d4 with a piece, never carelessly with the queen. The next boards show both.

### Step 12: board

Caption: Suppose White passes (this is a thought experiment, not a position from play). What does Black threaten?

```
  8  . . r q . r k .
  7  p p . b p p b p
  6  . . n p . n p .
  5  . . . . . . . .
  4  . . B N P . . .
  3  . . N . B P . .
  2  P P P Q . . P P
  1  . . K R . . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: 2rq1rk1/pp1bppbp/2np1np1/8/2BNP3/2N1BP2/PPPQ2PP/2KR3R b - - 7 11
```

The line, with the sentence the learner sees at each move:
1. **11... Nxd4**: The knight trades itself off and clears the c-file.
2. **12. Bxd4**: White recaptures with the bishop.
3. **12... Rxc4**: Now the rook takes the bishop on c4, and nothing recaptures. White must not leave the bishop there.

```
  8  . . . q . r k .
  7  p p . b p p b p
  6  . . . p . n p .
  5  . . . . . . . .
  4  . . r B P . . .
  3  . . N . . P . .
  2  P P P Q . . P P
  1  . . K R . . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 3q1rk1/pp1bppbp/3p1np1/8/2rBP3/2N2P2/PPPQ2PP/2KR3R w - - 0 13
```

Drawn on the board: arrows c6-d4, c8-c4; highlighted squares c4, c8, c6.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [material_after_move] If White does nothing, ...Nxd4 followed by ...Rxc4 wins material for Black along the engine line.
- [attackers] Right now the knight on c6 blocks the rook: nothing attacks c4.

### Step 13: board

Caption: White to move after 10...Rc8. White has to deal with the bishop, and Black has to choose what to do with the knight.

```
  8  . . r q . r k .
  7  p p . b p p b p
  6  . . n p . n p .
  5  . . . . . . . .
  4  . . B N P . . .
  3  . . N . B P . .
  2  P P P Q . . P P
  1  . . K R . . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 2rq1rk1/pp1bppbp/2np1np1/8/2BNP3/2N1BP2/PPPQ2PP/2KR3R w - - 7 11
```

The line, with the sentence the learner sees at each move:
1. **11. Bb3**: The bishop leaves the c-file, so a knight trade on d4 no longer drops it. It keeps the diagonal to f7.
2. **11... Ne5**: The knight leaves c6: the rook now looks at c3, and the knight eyes c4, d3 and f3.

```
  8  . . r q . r k .
  7  p p . b p p b p
  6  . . . p . n p .
  5  . . . . n . . .
  4  . . . N P . . .
  3  . B N . B P . .
  2  P P P Q . . P P
  1  . . K R . . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 2rq1rk1/pp1bppbp/3p1np1/4n3/3NP3/1BN1BP2/PPPQ2PP/2KR3R w - - 9 12
```

Drawn on the board: arrows b3-f7, e5-c4, c8-c3; highlighted squares b3, e5, c3.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [eval_range] At depth 16 the engine keeps a small edge for White here.
- [attackers] After ...Ne5 the rook on c8 attacks the knight on c3.
- [attackers] The knight on c3 is defended twice, by the b-pawn and the queen.

### Step 14: card

**What strong players chose** (master counts, both players 2500+; results, not verdicts). After the rook went to c8, White moved the bishop to b3 in 52 of 58 games. Black then put the knight on e5 in 40 games and traded on d4 in 23 (counts are by position, so other move orders are included). Masters played ...Rc8 in 58 games and ...Rb8 in 15. [I] Counts show popularity, not strength.

### Step 15: reflect

Kind: expect

Prompt: Masters played ...Rc8 far more often than ...Rb8. Write one reason why that might be, and one thing the counts cannot tell you.

- Field "A possible reason:" (free text)

- Field "One thing the counts cannot tell me:" (free text)

## Chapter: The h-pawn and the g-pawn storm

### Step 16: board

Caption: White to move after 11...Ne5. White has two usual plans: 12.Kb1 (30 master games) and 12.h4 (11 games). This board follows the sharper h4; a later board compares them.

```
  8  . . r q . r k .
  7  p p . b p p b p
  6  . . . p . n p .
  5  . . . . n . . .
  4  . . . N P . . .
  3  . B N . B P . .
  2  P P P Q . . P P
  1  . . K R . . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 2rq1rk1/pp1bppbp/3p1np1/4n3/3NP3/1BN1BP2/PPPQ2PP/2KR3R w - - 9 12
```

The line, with the sentence the learner sees at each move:
1. **12. h4**: The h-pawn starts the storm. It threatens h5, which would open lines against Black's king.
2. **12... h5**: Black blocks the file at once. The pawn on h5 also attacks g4, so White's pawn storm cannot go through g4 for free.

```
  8  . . r q . r k .
  7  p p . b p p b .
  6  . . . p . n p .
  5  . . . . n . . p
  4  . . . N P . . P
  3  . B N . B P . .
  2  P P P Q . . P .
  1  . . K R . . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 2rq1rk1/pp1bppb1/3p1np1/4n2p/3NP2P/1BN1BP2/PPPQ2P1/2KR3R w - - 0 13
```

Drawn on the board: arrows h2-h4, h7-h5; highlighted squares h4, h5, g6.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [eval_range] At depth 16 the engine keeps a small edge for White here.
- [pawn_attackers] After 12...h5 the pawn on h5 attacks g4.
- [pawn_attackers] The pawn on h4 attacks g5, so a bishop there is supported.

### Step 17: card

**Why ...h5 is needed.** If Black ignores 12.h4, the pawn goes to h5 and attacks g6. After the pawns trade there, the h-file is open towards Black's king, and White's dark-squared bishop can come to h6 to trade off the bishop that guards the king. Black's pawn on h5 stops that sequence. [I] The price: the pawn on h5 can become a target, and it needs the knight on f6 to defend it.

### Step 18: board

Caption: Black to move after 12.h4. What if Black ignores the pawn? This is the engine's line against 12...a6: the threat is the bishop trade on h6.

```
  8  . . r q . r k .
  7  p p . b p p b p
  6  . . . p . n p .
  5  . . . . n . . .
  4  . . . N P . . P
  3  . B N . B P . .
  2  P P P Q . . P .
  1  . . K R . . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: 2rq1rk1/pp1bppbp/3p1np1/4n3/3NP2P/1BN1BP2/PPPQ2P1/2KR3R b - - 0 12
```

The line, with the sentence the learner sees at each move:
1. **12... a6**: A natural-looking waiting move: it prepares ...b5, but it ignores the h-pawn.
2. **13. h5**: The pawn arrives and attacks g6.
3. **13... Nxh5**: Black takes the pawn with the knight, the piece that guards the king's shelter.
4. **14. g4**: The pawn kicks the knight.
5. **14... Nf6**: The knight goes home.
6. **15. Bh6**: Now the bishop offers to trade Black's king guard.
7. **15... Bxh6**: Black takes.
8. **16. Qxh6**: The queen lands on h6, where the Dragon bishop used to stand. [I] The h-file and the dark squares are open.

```
  8  . . r q . r k .
  7  . p . b p p . p
  6  p . . p . n p Q
  5  . . . . n . . .
  4  . . . N P . P .
  3  . B N . . P . .
  2  P P P . . . . .
  1  . . K R . . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 2rq1rk1/1p1bpp1p/p2p1npQ/4n3/3NP1P1/1BN2P2/PPP5/2KR3R b - - 0 16
```

Drawn on the board: arrows h4-h5, e3-h6; highlighted squares h4, h6, g6.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] 12...h5 is the engine's top move (depth 16).
- [move_loses] 12...a6 is at least 100 centipawns worse than the best move (depth 16).
- [piece_on] In this line White's queen reaches h6 and Black's bishop is gone.

### Step 19: item

**Task `IOD-LODDRAGON4-4`** (find_move, difficulty cue 2)

Black to move after 12.h4. Find the best move (engine, depth 16).

```
  1  R . . . R K . .
  2  . P . . Q P P P
  3  . . P B . N B .
  4  P . . P N . . .
  5  . . . n . . . .
  6  . p n . p . . .
  7  p b p p b . p p
  8  . k r . q r . .
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: 2rq1rk1/pp1bppbp/3p1np1/4n3/3NP2P/1BN1BP2/PPPQ2P1/2KR3R b - - 0 12
```

**Accepted answer(s):** h5

Feedback shown for wrong moves:
- a6: A waiting move: White plays h5 and the attack arrives first (the engine rates it at least 100 centipawns worse).
- Nc4: Trading White's bishop is a good idea, but too early here: the engine rates it at least 40 centipawns worse than ...h5.

**Explanation shown:** 12...h5 is the engine's top move at depth 16. It blocks the h-file and the pawn attacks g4.

Hints (in order):
1. Which file does the white pawn want to open?
2. Put a pawn on the same file, one square from the white pawn's destination.
3. h5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] 12...h5 is the engine's top move (depth 16).
- [move_loses] 12...a6 is at least 100 centipawns worse than the best move (depth 16).
- [move_loses] 12...Nc4 is at least 40 centipawns worse than the best move (depth 16).

### Step 20: board

Caption: Branch: 12.Kb1 instead of 12.h4. It is played more often (30 games to 11). White first tucks the king away, then pushes the pawn. Compare the two move orders.

```
  8  . . r q . r k .
  7  p p . b p p b p
  6  . . . p . n p .
  5  . . . . n . . .
  4  . . . N P . . .
  3  . B N . B P . .
  2  P P P Q . . P P
  1  . . K R . . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 2rq1rk1/pp1bppbp/3p1np1/4n3/3NP3/1BN1BP2/PPPQ2PP/2KR3R w - - 9 12
```

The line, with the sentence the learner sees at each move:
1. **12. Kb1**: The king steps off the c-file and the long diagonal. It also makes room for the rook on d1 or h1.
2. **12... a6**: Black prepares ...b5 and stops a knight jump to b5.
3. **13. h4**: Now the pawn storm starts, with the king safe.
4. **13... h5**: Black stops the pawn.
5. **14. Bh6**: White offers to trade the bishop that guards Black's king.
6. **14... Nc4**: Black counters at once: the knight trades the bishop on b3.
7. **15. Bxc4**: White takes the knight.
8. **15... Rxc4**: The rook recaptures and sits actively on the fourth rank.

```
  8  . . . q . r k .
  7  . p . b p p b .
  6  p . . p . n p B
  5  . . . . . . . p
  4  . . r N P . . P
  3  . . N . . P . .
  2  P P P Q . . P .
  1  . K . R . . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 3q1rk1/1p1bppb1/p2p1npB/7p/2rNP2P/2N2P2/PPPQ2P1/1K1R3R w - - 0 16
```

Drawn on the board: arrows b1-c1, e5-c4, h2-h4; highlighted squares b1, c4, h5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] Kb1 is the engine's top move here (depth 16).
- [king_wing] White's king stays on the queenside, off the c-file.
- [attackers] The rook attacks the knight on c3.
- [best_move_in] Kb1 and h4 are within 70 centipawns of each other, Kb1 first (depth 16).

### Step 21: card

**Kb1 or h4 first?** In our master file the king move was played in 30 games (White won 14, drew 15, lost 1) and the pawn push in 11 (1, 7, 3) [V]. So Kb1 is the usual move and h4 the sharper try. The engine at depth 16 keeps the two close (claim on the board). [H] The king move is a safer way to wait: it removes the c-file target before the storm, so Black's counterplay comes a tempo later. The samples are small.

### Step 22: board

Caption: White to move after 12...h5. White develops the last minor piece with a threat; Black answers with a rook lift.

```
  8  . . r q . r k .
  7  p p . b p p b .
  6  . . . p . n p .
  5  . . . . n . . p
  4  . . . N P . . P
  3  . B N . B P . .
  2  P P P Q . . P .
  1  . . K R . . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 2rq1rk1/pp1bppb1/3p1np1/4n2p/3NP2P/1BN1BP2/PPPQ2P1/2KR3R w - - 0 13
```

The line, with the sentence the learner sees at each move:
1. **13. Bg5**: The bishop attacks the knight on f6, which defends the pawn on h5. Trading it would weaken Black's king.
2. **13... Rc5**: The rook swings to the fifth rank. It defends the knight on e5, and the bishop on g5 stands on the same rank behind it.

```
  8  . . . q . r k .
  7  p p . b p p b .
  6  . . . p . n p .
  5  . . r . n . B p
  4  . . . N P . . P
  3  . B N . . P . .
  2  P P P Q . . P .
  1  . . K R . . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 3q1rk1/pp1bppb1/3p1np1/2r1n1Bp/3NP2P/1BN2P2/PPPQ2P1/2KR3R w - - 2 14
```

Drawn on the board: arrows g5-f6, c8-c5, c5-g5; highlighted squares g5, c5, e5, f6.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [eval_range] At depth 16 the engine keeps a small edge for White here.
- [attackers] The bishop on g5 attacks the knight on f6.
- [attackers] After ...Rc5 the knight on e5 is defended twice: by the pawn on d6 and the rook.
- [attackers] Black's rook does not yet attack the bishop: the knight on e5 stands in the way.

### Step 23: card

**A pattern to name.** [I] In many Dragons the black rook and the white bishop meet on the fifth rank, with a black knight between them. When the knight moves with a threat, the rook suddenly attacks the bishop, a discovered attack. The bishop is supported by the h-pawn and the queen, so this is a nuisance rather than a win, and each side must count it before choosing a move.

### Step 24: board

Caption: Black to move after 14.Kb1. This is the pattern in action. Look at what the knight move attacks, and what White can do about it.

```
  8  . . . q . r k .
  7  p p . b p p b .
  6  . . . p . n p .
  5  . . r . n . B p
  4  . . . N P . . P
  3  . B N . . P . .
  2  P P P Q . . P .
  1  . K . R . . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: 3q1rk1/pp1bppb1/3p1np1/2r1n1Bp/3NP2P/1BN2P2/PPPQ2P1/1K1R3R b - - 3 14
```

The line, with the sentence the learner sees at each move:
1. **14... Nc4**: The knight attacks the queen and unmasks the rook on the bishop: a double attack.
2. **15. Bxc4**: White simply takes the knight. The bishop on b3 was waiting for this trade.
3. **15... Rxc4**: The rook takes back and is active on the fourth rank; the bishop on g5 is no longer attacked.

```
  8  . . . q . r k .
  7  p p . b p p b .
  6  . . . p . n p .
  5  . . . . . . B p
  4  . . r N P . . P
  3  . . N . . P . .
  2  P P P Q . . P .
  1  . K . R . . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 3q1rk1/pp1bppb1/3p1np1/6Bp/2rNP2P/2N2P2/PPPQ2P1/1K1R3R w - - 0 16
```

Drawn on the board: arrows c4-d2, c5-g5, b3-c4; highlighted squares c4, d2, g5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] ...Nc4 and ...a6 are the engine's two best moves, within 40 centipawns of each other (depth 16).
- [attackers] After the knight leaves e5, the rook attacks the bishop on g5.
- [attackers] The knight on c4 attacks the queen.

### Step 25: board

Caption: Black to move after 13.Bg5. Tempting is the exchange sacrifice on c3, the Dragon's best-known resource. Does it work here?

```
  8  . . r q . r k .
  7  p p . b p p b .
  6  . . . p . n p .
  5  . . . . n . B p
  4  . . . N P . . P
  3  . B N . . P . .
  2  P P P Q . . P .
  1  . . K R . . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: 2rq1rk1/pp1bppb1/3p1np1/4n1Bp/3NP2P/1BN2P2/PPPQ2P1/2KR3R b - - 1 13
```

The line, with the sentence the learner sees at each move:
1. **13... Rxc3**: The classic Dragon exchange sacrifice: the rook takes the knight to tear apart White's king.
2. **14. Qxc3**: White takes with the queen and keeps the extra rook for a knight.
3. **14... b5**: Black has some pawn play, but White is the exchange up and has the better structure around the king.

```
  8  . . . q . r k .
  7  p . . b p p b .
  6  . . . p . n p .
  5  . p . . n . B p
  4  . . . N P . . P
  3  . B Q . . P . .
  2  P P P . . . P .
  1  . . K R . . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 3q1rk1/p2bppb1/3p1np1/1p2n1Bp/3NP2P/1BQ2P2/PPP3P1/2KR3R w - - 0 15
```

Drawn on the board: arrows c8-c3, c3-b2; highlighted squares c3, b2.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [move_loses] 13...Rxc3 is at least 80 centipawns worse than the best move (depth 16).
- [pawn_attackers] After the exchange sacrifice the pawn on b2 attacks c3, so White can recapture.
- [move_loses] 13...Qc7 is at least 90 centipawns worse than the best move (depth 16).

### Step 26: board

Caption: Branch: 13.Bh6 Bxh6 14.Qxh6. White traded the dark-squared bishops, and now the exchange sacrifice is on. Black to move.

```
  8  . . r q . r k .
  7  p p . b p p . .
  6  . . . p . n p Q
  5  . . . . n . . p
  4  . . . N P . . P
  3  . B N . . P . .
  2  P P P . . . P .
  1  . . K R . . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: 2rq1rk1/pp1bpp2/3p1npQ/4n2p/3NP2P/1BN2P2/PPP3P1/2KR3R b - - 0 14
```

The line, with the sentence the learner sees at each move:
1. **14... Rxc3**: Now the exchange sacrifice works: the rook takes the knight on c3.
2. **15. bxc3**: White must take with the b-pawn: the queen on h6 cannot reach c3. The king loses cover.
3. **15... Qc7**: Black's queen aims at c3 and a2, and the knight on e5 is ready to join.
4. **16. Kb1**: The king takes cover, and the pawn on c3 hangs.
5. **16... Qxc3**: Black has recovered a pawn for the exchange and the white king is under fire.

```
  8  . . . . . r k .
  7  p p . b p p . .
  6  . . . p . n p Q
  5  . . . . n . . p
  4  . . . N P . . P
  3  . B q . . P . .
  2  P . P . . . P .
  1  . K . R . . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 5rk1/pp1bpp2/3p1npQ/4n2p/3NP2P/1Bq2P2/P1P3P1/1K1R3R w - - 0 17
```

Drawn on the board: arrows c8-c3, h6-g7; highlighted squares c3, h6.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] ...Rxc3 is the engine's top move here (depth 16).
- [attackers] The white queen stands on h6 and no black piece attacks it.
- [king_wing] Black's king is on the kingside, without its bishop.

### Step 27: card

**The same sacrifice, a different verdict.** In the Bg5 line the queen on d2 recaptures on c3 and the sacrifice has no follow-up. After the bishops trade on h6 the queen has left d2, so White must take with the b-pawn and the king loses cover [I]. Ask each time: who recaptures, and what does the recapture leave behind?

### Step 28: board

Caption: Branch: 13.g4, the sharpest plan after 12...h5. White offers pawns to open the h-file. The engine rates it within 40 centipawns of the top move, Kb1 (depth 16).

```
  8  . . r q . r k .
  7  p p . b p p b .
  6  . . . p . n p .
  5  . . . . n . . p
  4  . . . N P . . P
  3  . B N . B P . .
  2  P P P Q . . P .
  1  . . K R . . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 2rq1rk1/pp1bppb1/3p1np1/4n2p/3NP2P/1BN1BP2/PPPQ2P1/2KR3R w - - 0 13
```

The line, with the sentence the learner sees at each move:
1. **13. g4**: The sharp try: the g-pawn goes at the h5 pawn at once.
2. **13... hxg4**: Black takes.
3. **14. h5**: White gives the pawn back to open the h-file: the pawn attacks g6.
4. **14... Nxh5**: Black takes the pawn.
5. **15. Bh6**: The bishop offers the trade of Black's king guard; the rook on h1 and the open h-file are the point.
6. **15... Rc5**: Black keeps the rook active.

```
  8  . . . q . r k .
  7  p p . b p p b .
  6  . . . p . . p B
  5  . . r . n . . n
  4  . . . N P . p .
  3  . B N . . P . .
  2  P P P Q . . . .
  1  . . K R . . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 3q1rk1/pp1bppb1/3p2pB/2r1n2n/3NP1p1/1BN2P2/PPPQ4/2KR3R w - - 2 16
```

Drawn on the board: arrows g2-g4, h4-h5, d2-h6; highlighted squares g4, h5, h6.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] g4 and Kb1 are the engine's top two moves, within 40 centipawns of each other (depth 16).
- [pawn_attackers] The pawn on h5 attacks g4, so the push is a pawn sacrifice or trade.

### Step 29: card

**Why g4?** The pawn on h5 shields Black's king from the rook on h1. Pushing g4 forces the issue: if Black takes, White plays h5 and the h-file opens at the price of pawns [I]. Then the bishop goes to h6 to trade off the dark-squared defender. The pawn sacrifice is only worth it because the rook already stands on h1.

### Step 30: item

**Task `IOD-LODDRAGON4-5`** (find_move, difficulty cue 3)

White to move. Find one of the two moves within 70 centipawns of the engine's top move (depth 16).

```
  8  . . r q . r k .
  7  p p . b p p b p
  6  . . . p . n p .
  5  . . . . n . . .
  4  . . . N P . . .
  3  . B N . B P . .
  2  P P P Q . . P P
  1  . . K R . . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 2rq1rk1/pp1bppbp/3p1np1/4n3/3NP3/1BN1BP2/PPPQ2PP/2KR3R w - - 9 12
```

**Accepted answer(s):** Kb1, h4

**Explanation shown:** Kb1 is the engine's top move at depth 16 and h4 is within 70 centipawns of it.

Hints (in order):
1. Which White piece stands on a file where the black rook and knight are aiming?
2. One good move tucks the king away; the other starts the pawn storm.
3. Kb1 or h4.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] Kb1 is the engine's top move and h4 is within 70 centipawns of it (depth 16).

### Step 31: item  (shown without telling the learner the topic: unlabeled test)

**Task `IOD-LODDRAGON4-6`** (find_move, difficulty cue 3)

Black to move. Find one of the two best moves (within 40 centipawns, depth 16). One natural-looking move is a mistake.

```
  1  R . . . R . K .
  2  . P . . Q P P P
  3  . . P . . N B .
  4  P . . P N . . .
  5  p B . n . r . .
  6  . p n . p . . .
  7  . b p p b . p p
  8  . k r . q . . .
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: 3q1rk1/pp1bppb1/3p1np1/2r1n1Bp/3NP2P/1BN2P2/PPPQ2P1/1K1R3R b - - 3 14
```

**Accepted answer(s):** Nc4, a6

Feedback shown for wrong moves:
- Rc8: The rook went c8-c5-c8: two moves, same square, and White gained the time (at least 40 centipawns worse, depth 16).

**Explanation shown:** Nc4 and a6 are the engine's best two moves at depth 16. Going back with the rook costs the tempo it took to get to c5.

Hints (in order):
1. Do not undo the last move you made with the rook.
2. One of the two moves hits the queen; the other makes room on the queenside.
3. Nc4 or a6.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] ...Nc4 and ...a6 are the engine's best (depth 16).
- [move_loses] ...Rc8 (going back) is at least 40 centipawns worse than the best move (depth 16).

## Chapter: Alternatives and the engine's view

### Step 32: card

**Move 9 alternatives.** Black's main choices at move nine are the bishop move (116 master games) and the knight trade on d4 (25), with rarer tries behind them. Small samples show what was played, not that a move loses. Predict first: in the next task, which three moves are in the engine's top group? The boards after it show them.

### Step 33: item

**Task `IOD-LODDRAGON4-7`** (find_move, difficulty cue 3)

Black to move. Find one of the three moves within 40 centipawns of the engine's best (depth 16).

```
  1  R . . K . . . R
  2  P P . . Q P P P
  3  . . P B . N . .
  4  . . . P N B . .
  5  . . . . . . . .
  6  . p n . p n . .
  7  p b p p . . p p
  8  . k r . q b . r
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: r1bq1rk1/pp2ppbp/2np1np1/8/2BNP3/2N1BP2/PPPQ2PP/R3K2R b KQ - 4 9
```

**Accepted answer(s):** Bd7, Nxd4, Qa5

Feedback shown for wrong moves:
- d5: The bishop on c4 makes the break lose ground: three white pieces attack d5 (at least 40 centipawns worse, depth 16).
- Nd7: The knight retreat scores lower: at least 20 centipawns worse than the best move (depth 16).

**Explanation shown:** Bd7, Nxd4 and Qa5 are all within 40 centipawns of the engine's best at depth 16. ...d5 and the knight retreat fall behind.

Hints (in order):
1. Check each candidate against what White's pieces can reach.
2. The good moves either trade the knight on d4 or develop with a plan; the bad ones put the knight on an awkward square.
3. Bd7, Nxd4 or Qa5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] Bd7, Nxd4 and Qa5 are all within 40 centipawns of the engine's best (depth 16).
- [move_loses] 9...d5 is at least 40 centipawns worse than the best move.
- [move_loses] 9...Nd7 (the knight retreat) is at least 20 centipawns worse than the best move.

### Step 34: board

Caption: Move 9, alternative A: 9...Nxd4 (25 master games: White won 13, drew 9, lost 3 [V]). Black trades immediately and avoids the Rc8 plan altogether.

```
  8  r . b q . r k .
  7  p p . . p p b p
  6  . . n p . n p .
  5  . . . . . . . .
  4  . . B N P . . .
  3  . . N . B P . .
  2  P P P Q . . P P
  1  R . . . K . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: r1bq1rk1/pp2ppbp/2np1np1/8/2BNP3/2N1BP2/PPPQ2PP/R3K2R b KQ - 4 9
```

The line, with the sentence the learner sees at each move:
1. **9... Nxd4**: Black trades at once: no knight on c6 means White's bishop is not hit by the rook later.
2. **10. Bxd4**: White recaptures with the bishop, which now eyes the bishop on g7 and the a7 pawn.
3. **10... Be6**: Black challenges the bishop on c4 so that the diagonal to f7 closes.
4. **11. Bxe6**: White trades the strong bishop.
5. **11... fxe6**: Black recaptures towards the centre; the f-file opens for the rook, but the pawns on e7 and e6 are doubled.

```
  8  r . . q . r k .
  7  p p . . p . b p
  6  . . . p p n p .
  5  . . . . . . . .
  4  . . . B P . . .
  3  . . N . . P . .
  2  P P P Q . . P P
  1  R . . . K . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r2q1rk1/pp2p1bp/3ppnp1/8/3BP3/2N2P2/PPPQ2PP/R3K2R w KQ - 0 12
```

Drawn on the board: arrows d4-g7, c4-e6; highlighted squares d4, e6, e7.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [eval_range] At depth 16 the engine gives White a small edge after 9.Bc4.
- [pawn_set] After ...fxe6 Black has doubled e-pawns.
- [open_files] After the trades the c-file and the f-file are half-open for Black.
- [best_move_in] ...Qa5, ...Nxd4 and ...Bd7 are all within 40 centipawns of the best (depth 16).

### Step 35: card

**Is the trade a mistake?** No. At depth 16 the engine puts the trade, the bishop move and ...Qa5 within 40 centipawns of one another. The difference is the plan: after the trade there is no knight on c6 to shield the rook, and White's bishop on d4 sits on the long diagonal. Masters chose the bishop move in 116 games and the trade in 25 [V]. [I] The bishop move keeps more pieces on, which suits the side with the faster attack. A guess.

### Step 36: board

Caption: Move 9, alternative B: 9...Qa5, the engine's first choice at depth 16. The queen eyes c3 and a2. [I] It makes White decide about the knight on d4 at once.

```
  8  r . b q . r k .
  7  p p . . p p b p
  6  . . n p . n p .
  5  . . . . . . . .
  4  . . B N P . . .
  3  . . N . B P . .
  2  P P P Q . . P P
  1  R . . . K . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: r1bq1rk1/pp2ppbp/2np1np1/8/2BNP3/2N1BP2/PPPQ2PP/R3K2R b KQ - 4 9
```

The line, with the sentence the learner sees at each move:
1. **9... Qa5**: The queen looks at the knight on c3 and the a2 pawn.
2. **10. Nb3**: The knight attacks the queen and leaves the c-file.
3. **10... Qc7**: The queen goes to c7, where it will back a rook on the c-file.
4. **11. O-O-O**: White castles long.
5. **11... Ne5**: The knight jumps to e5 and hits the bishop on c4.

```
  8  r . b . . r k .
  7  p p q . p p b p
  6  . . . p . n p .
  5  . . . . n . . .
  4  . . B . P . . .
  3  . N N . B P . .
  2  P P P Q . . P P
  1  . . K R . . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r1b2rk1/ppq1ppbp/3p1np1/4n3/2B1P3/1NN1BP2/PPPQ2PP/2KR3R w - - 9 12
```

Drawn on the board: arrows a5-c3, e5-c4; highlighted squares a5, c3, e5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] ...Qa5 and ...Nxd4 are the two best moves, within 40 centipawns of each other (depth 16).
- [piece_on] The knight stands on e5.

### Step 37: board

Caption: Move 9, alternative C: 9...a6 (10 master games: White 5, draws 5, Black 0 [V]). The engine rates it clearly below the best move. [I] It spends a move before the rook has a file to use.

```
  8  r . b q . r k .
  7  p p . . p p b p
  6  . . n p . n p .
  5  . . . . . . . .
  4  . . B N P . . .
  3  . . N . B P . .
  2  P P P Q . . P P
  1  R . . . K . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: r1bq1rk1/pp2ppbp/2np1np1/8/2BNP3/2N1BP2/PPPQ2PP/R3K2R b KQ - 4 9
```

The line, with the sentence the learner sees at each move:
1. **9... a6**: A waiting move: it prepares ...b5 and stops a knight jump to b5.
2. **10. O-O-O**: White castles long.
3. **10... Na5**: The knight attacks the bishop on c4.
4. **11. Be2**: The bishop retreats, losing the diagonal to f7, but keeping the king safe.
5. **11... b5**: Black gains space; the pawn storm on the queenside is coming.

```
  8  r . b q . r k .
  7  . . . . p p b p
  6  p . . p . n p .
  5  n p . . . . . .
  4  . . . N P . . .
  3  . . N . B P . .
  2  P P P Q B . P P
  1  . . K R . . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r1bq1rk1/4ppbp/p2p1np1/np6/3NP3/2N1BP2/PPPQB1PP/2KR3R w - - 0 12
```

Drawn on the board: arrows c6-a5, a7-a6; highlighted squares a5, b5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [move_loses] 9...a6 is at least 30 centipawns worse than the best move (depth 16).
- [piece_on] The knight stands on a5, attacking the bishop on c4.

### Step 38: board

Caption: Move 9, alternative D: 9...Nd7, the f6 knight retreating (8 master games: White won 5, drew 3, lost 0 [V]). The engine rates it lower than the moves above. Small samples show what was played, not that a move loses.

```
  8  r . b q . r k .
  7  p p . . p p b p
  6  . . n p . n p .
  5  . . . . . . . .
  4  . . B N P . . .
  3  . . N . B P . .
  2  P P P Q . . P P
  1  R . . . K . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: r1bq1rk1/pp2ppbp/2np1np1/8/2BNP3/2N1BP2/PPPQ2PP/R3K2R b KQ - 4 9
```

The line, with the sentence the learner sees at each move:
1. **9... Nd7**: The knight retreats; it opens the diagonal for the bishop on g7 and heads for b6.
2. **10. Bb3**: White keeps the bishop safe and on its diagonal.
3. **10... Nb6**: The knight reaches b6 and looks at c4 and d5.
4. **11. h4**: White starts the pawn storm at once.
5. **11... Na5**: Black challenges the bishop: the knight on a5 attacks b3.

```
  8  r . b q . r k .
  7  p p . . p p b p
  6  . n . p . . p .
  5  n . . . . . . .
  4  . . . N P . . P
  3  . B N . B P . .
  2  P P P Q . . P .
  1  R . . . K . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r1bq1rk1/pp2ppbp/1n1p2p1/n7/3NP2P/1BN1BP2/PPPQ2P1/R3K2R w KQ - 1 12
```

Drawn on the board: arrows f6-d7, d7-b6; highlighted squares d7, b6.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [move_loses] 9...Nd7 is at least 20 centipawns worse than the best move (depth 16).
- [piece_on] Black's knight stands on a5.

### Step 39: reflect

Kind: expect

Prompt: At move 10 White has three tries: castle long, push the h-pawn, or play the bishop to b3. Which keeps the biggest edge, and why? Write your guess before you look at the boards.

- Field "My guess and reason:" (free text)

### Step 40: board

Caption: Move 10, alternative A: 10.h4 (22 master games: White won 9, drew 9, lost 4 [V]). White delays castling and starts the storm first.

```
  8  r . . q . r k .
  7  p p . b p p b p
  6  . . n p . n p .
  5  . . . . . . . .
  4  . . B N P . . .
  3  . . N . B P . .
  2  P P P Q . . P P
  1  R . . . K . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: r2q1rk1/pp1bppbp/2np1np1/8/2BNP3/2N1BP2/PPPQ2PP/R3K2R w KQ - 5 10
```

The line, with the sentence the learner sees at each move:
1. **10. h4**: White starts the pawn storm before castling: the h-pawn is already on the march.
2. **10... Rc8**: Black's rook takes the c-file at once.
3. **11. Bb3**: The bishop leaves the file before ...Nxd4 can win it.
4. **11... h5**: Black stops the pawn on h5, as in the main line.

```
  8  . . r q . r k .
  7  p p . b p p b .
  6  . . n p . n p .
  5  . . . . . . . p
  4  . . . N P . . P
  3  . B N . B P . .
  2  P P P Q . . P .
  1  R . . . K . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 2rq1rk1/pp1bppb1/2np1np1/7p/3NP2P/1BN1BP2/PPPQ2P1/R3K2R w KQ - 0 12
```

Drawn on the board: arrows h2-h4, h7-h5; highlighted squares h4, h5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [eval_range] At depth 16 the engine gives White a small edge here.
- [pawn_attackers] The pawn on h4 attacks g5.
- [pawn_attackers] After ...h5 the pawn on h5 attacks g4.
- [best_move_in] 10.h4 and 10.O-O-O are within 40 centipawns of each other, one of them first (depth 16).

### Step 41: card

**Why 10.O-O-O is the main move.** At depth 16 the engine rates the pawn push and castling within 40 centipawns of each other, and the lines can lead to similar positions. [H] Castling first fixes the king's address, so the storm can follow with no loose ends, while the pawn push leaves the king in the centre where Black keeps extra options. That may be why masters castled in 83 games and pushed the pawn in 22 [V].

### Step 42: board

Caption: Move 10, alternative B: 10.Bb3 instead of 10.O-O-O. White moves the bishop before Black's rook arrives. Black to move; engine depth 16 below.

```
  8  r . . q . r k .
  7  p p . b p p b p
  6  . . n p . n p .
  5  . . . . . . . .
  4  . . . N P . . .
  3  . B N . B P . .
  2  P P P Q . . P P
  1  R . . . K . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: r2q1rk1/pp1bppbp/2np1np1/8/3NP3/1BN1BP2/PPPQ2PP/R3K2R b KQ - 6 10
```

The line, with the sentence the learner sees at each move:
1. **10... Nxd4**: With the bishop already on b3 the trade costs Black nothing: the rook is not needed on c8 yet.
2. **11. Bxd4**: White recaptures; the bishop eyes g7.
3. **11... b5**: Black gains space on the queenside at once, before White has castled.

```
  8  r . . q . r k .
  7  p . . b p p b p
  6  . . . p . n p .
  5  . p . . . . . .
  4  . . . B P . . .
  3  . B N . . P . .
  2  P P P Q . . P P
  1  R . . . K . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r2q1rk1/p2bppbp/3p1np1/1p6/3BP3/1BN2P2/PPPQ2PP/R3K2R w KQ - 0 12
```

Drawn on the board: arrows b3-f7, b7-b5; highlighted squares b3, d4.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] After 10.Bb3 the engine's best reply is ...Nxd4 (depth 16).
- [eval_range] White's edge is small or gone (engine, depth 16).

### Step 43: card

**Why order matters.** After the early bishop move Black trades first, and the rook on c8 is no threat because the bishop is already off the c-file [I]. The main line castles first, so White must decide about the bishop after the rook has arrived. The engine's edge after 10.Bb3 is small or gone (checked on the board). [I] Castling first scored a little higher in my runs, but gaps this small are within engine noise.

### Step 44: board

Caption: Move 10, alternative C: 10...Rb8 (15 master games: White 4 wins, 7 draws, 4 losses [V]). The engine at depth 16 sees little between ...Rc8 and ...Rb8.

```
  8  r . . q . r k .
  7  p p . b p p b p
  6  . . n p . n p .
  5  . . . . . . . .
  4  . . B N P . . .
  3  . . N . B P . .
  2  P P P Q . . P P
  1  . . K R . . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: r2q1rk1/pp1bppbp/2np1np1/8/2BNP3/2N1BP2/PPPQ2PP/2KR3R b - - 6 10
```

The line, with the sentence the learner sees at each move:
1. **10... Rb8**: The rook goes to b8 instead of c8: it supports a later ...b5, away from the bishop's diagonal.
2. **11. Bb3**: White removes the bishop from the c-file anyway.
3. **11... Na5**: Black hits the bishop at once.
4. **12. g4**: White starts the storm: g4 first, h4 later.

```
  8  . r . q . r k .
  7  p p . b p p b p
  6  . . . p . n p .
  5  n . . . . . . .
  4  . . . N P . P .
  3  . B N . B P . .
  2  P P P Q . . . P
  1  . . K R . . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 1r1q1rk1/pp1bppbp/3p1np1/n7/3NP1P1/1BN1BP2/PPPQ3P/2KR3R b - - 0 12
```

Drawn on the board: arrows a8-b8, c6-a5; highlighted squares b8, a5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] ...Rc8 and ...Rb8 are within 40 centipawns of each other (depth 16).
- [eval_range] After 10.O-O-O the engine gives White a small edge (depth 16).

### Step 45: card

**Why the c-file more often?** The engine keeps the two rook moves close at depth 16 (claim on the board), so the counts, 58 games against 15, show popularity, not strength [I]. [H] One idea: on c8 the rook at once makes ...Nxd4 a threat to the bishop on c4, so White must answer now. On b8 the rook does not look at c4, so that threat is gone, although White may still move the bishop, as the board shows. Disagree if you see another reason.

### Step 46: board

Caption: Move 10, alternative D: 10...Qa5 instead of 10...Rc8. The queen adds pressure on c3, but the engine rates it lower (depth 16).

```
  8  r . . q . r k .
  7  p p . b p p b p
  6  . . n p . n p .
  5  . . . . . . . .
  4  . . B N P . . .
  3  . . N . B P . .
  2  P P P Q . . P P
  1  . . K R . . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: r2q1rk1/pp1bppbp/2np1np1/8/2BNP3/2N1BP2/PPPQ2PP/2KR3R b - - 6 10
```

The line, with the sentence the learner sees at each move:
1. **10... Qa5**: The queen attacks the knight on c3 with the queen on d2 behind it, so the knight cannot move without a queen trade [I].
2. **11. Bb3**: White clears the c-file of the bishop before ...Nxd4 can win something.
3. **11... Ne5**: The knight leaves c6 for e5 and eyes c4 and f3.
4. **12. g4**: White starts the pawn storm with the g-pawn.
5. **12... Rfc8**: The second rook joins the c-file.
6. **13. Kb1**: The king steps off the c-file.
7. **13... b5**: Black's own pawn storm begins.

```
  8  r . r . . . k .
  7  p . . b p p b p
  6  . . . p . n p .
  5  q p . . n . . .
  4  . . . N P . P .
  3  . B N . B P . .
  2  P P P Q . . . P
  1  . K . R . . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r1r3k1/p2bppbp/3p1np1/qp2n3/3NP1P1/1BN1BP2/PPPQ3P/1K1R3R w - - 0 14
```

Drawn on the board: arrows a5-c3, d2-c3; highlighted squares a5, c3.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [move_loses] 10...Qa5 is at least 30 centipawns worse than the best move (depth 16).
- [attackers] After ...Qa5 the queen attacks the knight on c3.

### Step 47: board

Caption: Move 11, alternative A: 11.Nxc6 (instead of 11.Bb3). White trades the knight before it can jump to e5, removing the e5 route. White to move.

```
  8  . . r q . r k .
  7  p p . b p p b p
  6  . . n p . n p .
  5  . . . . . . . .
  4  . . B N P . . .
  3  . . N . B P . .
  2  P P P Q . . P P
  1  . . K R . . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 2rq1rk1/pp1bppbp/2np1np1/8/2BNP3/2N1BP2/PPPQ2PP/2KR3R w - - 7 11
```

The line, with the sentence the learner sees at each move:
1. **11. Nxc6**: White trades the knight that stands on the rook's file and takes away the knight's route to e5.
2. **11... Bxc6**: Black recaptures with the bishop, which now hits e4.
3. **12. Bb3**: The bishop leaves the c-file. The bishop on c6 hits e4, which the f3 pawn defends.
4. **12... b5**: Black gains queenside space; the pawn may go on to b4.

```
  8  . . r q . r k .
  7  p . . . p p b p
  6  . . b p . n p .
  5  . p . . . . . .
  4  . . . . P . . .
  3  . B N . B P . .
  2  P P P Q . . P P
  1  . . K R . . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 2rq1rk1/p3ppbp/2bp1np1/1p6/4P3/1BN1BP2/PPPQ2PP/2KR3R w - - 0 13
```

Drawn on the board: arrows d4-c6, c6-e4; highlighted squares c6, e4.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] Nxc6 and Bb3 are both within 40 centipawns of the best (depth 16).
- [piece_on] After the trade Black's bishop stands on c6.

### Step 48: board

Caption: Move 11, alternative B: 11.Be2 (instead of 11.Bb3). White steps off the c-file to a safe square and keeps the knight on d4. White to move.

```
  8  . . r q . r k .
  7  p p . b p p b p
  6  . . n p . n p .
  5  . . . . . . . .
  4  . . B N P . . .
  3  . . N . B P . .
  2  P P P Q . . P P
  1  . . K R . . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 2rq1rk1/pp1bppbp/2np1np1/8/2BNP3/2N1BP2/PPPQ2PP/2KR3R w - - 7 11
```

The line, with the sentence the learner sees at each move:
1. **11. Be2**: The bishop leaves the c-file for a safe square.
2. **11... a6**: Black prepares ...b5.
3. **12. Kb1**: White tucks the king away.
4. **12... Qc7**: The queen joins the c-file.
5. **13. h4**: The storm starts.
6. **13... b5**: Black pushes on the queenside.

```
  8  . . r . . r k .
  7  . . q b p p b p
  6  p . n p . n p .
  5  . p . . . . . .
  4  . . . N P . . P
  3  . . N . B P . .
  2  P P P Q B . P .
  1  . K . R . . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 2r2rk1/2qbppbp/p1np1np1/1p6/3NP2P/2N1BP2/PPPQB1P1/1K1R3R w - - 0 14
```

Drawn on the board: arrows c4-e2; highlighted squares c4, e2.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] Nxc6, Bb3 and Be2 are all within 30 centipawns of the best (depth 16).
- [piece_on] White's bishop stands on e2.

### Step 49: card

**Engine top and book differ.** At depth 16 Nxc6 scores a little above Bb3 and Be2, yet masters chose Bb3 in 52 of 58 games [V]. [I] Differences of a few centipawns sit inside the engine's noise, and a move that is easy to play against many replies can be worth more to a human. Treat the engine's order as a hint, not a ranking.

### Step 50: board

Caption: Move 11, alternative C (for Black): 11...Nxd4 instead of ...Ne5 (23 master games: White won 9, drew 10, lost 4 [V]). The engine rates both within 40 centipawns (depth 16).

```
  8  . . r q . r k .
  7  p p . b p p b p
  6  . . n p . n p .
  5  . . . . . . . .
  4  . . . N P . . .
  3  . B N . B P . .
  2  P P P Q . . P P
  1  . . K R . . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: 2rq1rk1/pp1bppbp/2np1np1/8/3NP3/1BN1BP2/PPPQ2PP/2KR3R b - - 8 11
```

The line, with the sentence the learner sees at each move:
1. **11... Nxd4**: Black trades first: the knight on d4 is gone, and the bishop on b3 has no c-file target any more.
2. **12. Bxd4**: White recaptures with the bishop, which now eyes the bishop on g7.
3. **12... b5**: Black gains queenside space at once and prepares ...a5 and ...b4.
4. **13. h4**: White starts the storm.
5. **13... a5**: Black keeps the pawns rolling.

```
  8  . . r q . r k .
  7  . . . b p p b p
  6  . . . p . n p .
  5  p p . . . . . .
  4  . . . B P . . P
  3  . B N . . P . .
  2  P P P Q . . P .
  1  . . K R . . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 2rq1rk1/3bppbp/3p1np1/pp6/3BP2P/1BN2P2/PPPQ2P1/2KR3R w - - 0 14
```

Drawn on the board: arrows c6-d4, b7-b5; highlighted squares d4, b5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] ...Nxd4 and ...Ne5 are both within 40 centipawns of the best (depth 16).
- [piece_on] Black's pawn stands on b5.

### Step 51: card

**One purpose per move.** Emanuel Lasker (lectures 7 and 8, as our citable-views sheet records them) sorted useful moves into three kinds: bring new force into play, give a piece a job, or undo what the opponent just did [V-sheet]. Try it on the next board: before you read each note, say which kind the move is.

### Step 52: board

Caption: Put it together: the whole line, one purpose per move. (12.Kb1 is played more often than 12.h4; this board follows the sharper h4.) Step through and say the purpose before you read it.

```
  8  r . b q . r k .
  7  p p . . p p b p
  6  . . n p . n p .
  5  . . . . . . . .
  4  . . . N P . . .
  3  . . N . B P . .
  2  P P P Q . . P P
  1  R . . . K B . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: r1bq1rk1/pp2ppbp/2np1np1/8/3NP3/2N1BP2/PPPQ2PP/R3KB1R w KQ - 3 9
```

The line, with the sentence the learner sees at each move:
1. **9. Bc4**: Stops ...d5 and eyes f7.
2. **9... Bd7**: Clears c8 and guards the knight.
3. **10. O-O-O**: The king goes where Black's rook will aim, so White needs the attack to be faster.
4. **10... Rc8**: The rook takes the half-open file.
5. **11. Bb3**: The bishop leaves the c-file so that a knight trade no longer wins it.
6. **11... Ne5**: The knight leaves the file, unmasking the rook against c3.
7. **12. h4**: The pawn storm starts.
8. **12... h5**: Black blocks the file.
9. **13. Bg5**: The bishop attacks the knight on f6, the defender of h5.
10. **13... Rc5**: The rook defends the knight on e5 and prepares the knight's tricks.

```
  8  . . . q . r k .
  7  p p . b p p b .
  6  . . . p . n p .
  5  . . r . n . B p
  4  . . . N P . . P
  3  . B N . . P . .
  2  P P P Q . . P .
  1  . . K R . . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 3q1rk1/pp1bppb1/3p1np1/2r1n1Bp/3NP2P/1BN2P2/PPPQ2P1/2KR3R w - - 2 14
```

Drawn on the board: arrows c4-f7, c8-c1, h4-h5, g5-f6; highlighted squares c4, c8, e5, g5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [piece_on] White's bishop stands on g5.
- [piece_on] Black's rook stands on c5.
- [attackers] The knight on e5 is defended twice.

### Step 53: board

Caption: White to move after 9...Nxd4. Which recapture? This board shows the wrong one first: the engine rates it at least 100 centipawns worse.

```
  8  r . b q . r k .
  7  p p . . p p b p
  6  . . . p . n p .
  5  . . . . . . . .
  4  . . B n P . . .
  3  . . N . B P . .
  2  P P P Q . . P P
  1  R . . . K . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: r1bq1rk1/pp2ppbp/3p1np1/8/2BnP3/2N1BP2/PPPQ2PP/R3K2R w KQ - 0 10
```

The line, with the sentence the learner sees at each move:
1. **10. Qxd4**: The natural-looking recapture with the queen.
2. **10... Ng4**: The knight moves with a threat on Be3 and unmasks the bishop on g7 onto the queen.
3. **11. Qd2**: The queen has to leave the diagonal.
4. **11... Nxe3**: Black takes the bishop.
5. **12. Qxe3**: White retakes the knight, but the bishop on g7 now eyes the knight on c3 and White still has not castled.

```
  8  r . b q . r k .
  7  p p . . p p b p
  6  . . . p . . p .
  5  . . . . . . . .
  4  . . B . P . . .
  3  . . N . Q P . .
  2  P P P . . . P P
  1  R . . . K . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r1bq1rk1/pp2ppbp/3p2p1/8/2B1P3/2N1QP2/PPP3PP/R3K2R b KQ - 0 12
```

Drawn on the board: arrows f6-g4, g7-d4, g4-e3; highlighted squares d4, g7, f6.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] Bxd4 is the engine's top recapture (depth 16).
- [move_loses] Qxd4 is at least 100 centipawns worse than Bxd4 (depth 16).
- [attackers] After Qxd4 the bishop on g7 does not yet attack the queen: the knight on f6 masks it.

## Chapter: A tactical pattern and tests

### Step 54: card

**The discovered attack on the diagonal.** In the Dragon the knight on f6 stands in front of the bishop on g7. Any time that knight moves with a threat, the bishop attacks whatever stands on the long diagonal, here the queen on d4. ...Ng4 is the engine's top reply at depth 16. That is why White recaptures with a piece, not the queen. Remember it from both sides.

### Step 55: item

**Task `IOD-LODDRAGON4-8`** (find_move, difficulty cue 2)

White to move; Black has just traded on d4. Find the recapture that keeps the balance.

```
  8  r . b q . r k .
  7  p p . . p p b p
  6  . . . p . n p .
  5  . . . . . . . .
  4  . . B n P . . .
  3  . . N . B P . .
  2  P P P Q . . P P
  1  R . . . K . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: r1bq1rk1/pp2ppbp/3p1np1/8/2BnP3/2N1BP2/PPPQ2PP/R3K2R w KQ - 0 10
```

**Accepted answer(s):** Bxd4

Feedback shown for wrong moves:
- Qxd4: Ng4! The knight moves with a threat and the bishop on g7 attacks the queen (at least 100 centipawns worse, depth 16).

**Explanation shown:** Bxd4 is the engine's top recapture at depth 16. Qxd4 allows ...Ng4 with a discovered attack on the queen.

Hints (in order):
1. Which piece of yours can recapture without being exposed to the bishop on g7?
2. Look at what the black knight on f6 can do with tempo.
3. Bxd4.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] Bxd4 is the engine's top recapture (depth 16).
- [move_loses] Qxd4 is at least 100 centipawns worse (depth 16).

### Step 56: contrast

Title: Does the recapture hold?

Prompt: Predict for each position, then check. One difference matters; one does not.

**The working board:**

**Task `IOD-LODDRAGON4-9`** (predict_outcome, difficulty cue 2)

Black to move after 9...Nxd4 10.Bxd4. Can Black gain at least a pawn (engine evaluation at least 100 centipawns better for Black, depth 16)?

```
  8  r . b q . r k .
  7  p p . . p p b p
  6  . . . p . n p .
  5  . . . . . . . .
  4  . . B B P . . .
  3  . . N . . P . .
  2  P P P Q . . P P
  1  R . . . K . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black.
FEN: r1bq1rk1/pp2ppbp/3p1np1/8/2BBP3/2N2P2/PPPQ2PP/R3K2R b KQ - 0 10
```

**Accepted answer:** {"outcome": "no"}

**Explanation shown:** After Bxd4 White stays slightly ahead at depth 16: Black has no move that gains a pawn.

Hints (in order):
1. Look at the diagonal from g7.
2. The bishop on d4 is protected by the queen and faces the bishop on g7.
3. No: Black's best moves are small.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [eval_range] After Bxd4 the engine keeps White slightly ahead (depth 16): Black has no gain.

**The failing board:**

**Task `IOD-LODDRAGON4-10`** (predict_outcome, difficulty cue 2)

Black to move after 9...Nxd4 10.Qxd4. Can Black gain at least a pawn (engine evaluation at least 100 centipawns better for Black, depth 16)?

```
  8  r . b q . r k .
  7  p p . . p p b p
  6  . . . p . n p .
  5  . . . . . . . .
  4  . . B Q P . . .
  3  . . N . B P . .
  2  P P P . . . P P
  1  R . . . K . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black.
FEN: r1bq1rk1/pp2ppbp/3p1np1/8/2BQP3/2N1BP2/PPP3PP/R3K2R b KQ - 0 10
```

**Accepted answer:** {"outcome": "yes"}

**Explanation shown:** After Qxd4 Black has ...Ng4 at depth 16: the knight moves with a threat and unmasks the bishop on the queen.

Hints (in order):
1. Look at the diagonal from g7.
2. The knight on f6 stands in front of the bishop and the queen stands on the diagonal.
3. Yes: a knight move with tempo.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [eval_range] After Qxd4 Black gains at least a pawn (depth 16).
- [best_move_in] After Qxd4 the engine's top reply is ...Ng4 (depth 16).

**The irrelevant board:**

**Task `IOD-LODDRAGON4-11`** (predict_outcome, difficulty cue 2)

Black to move; White recaptured with the bishop and White's a-pawn stands on a3. Can Black gain at least a pawn (engine evaluation at least 100 centipawns better for Black, depth 16)?

```
  8  r . b q . r k .
  7  p p . . p p b p
  6  . . . p . n p .
  5  . . . . . . . .
  4  . . B B P . . .
  3  P . N . . P . .
  2  . P P Q . . P P
  1  R . . . K . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black.
FEN: r1bq1rk1/pp2ppbp/3p1np1/8/2BBP3/P1N2P2/1PPQ2PP/R3K2R b KQ - 0 10
```

**Accepted answer:** {"outcome": "no"}

**Explanation shown:** The a-pawn on a3 does not matter. The recapture with the bishop still holds at depth 16.

Hints (in order):
1. Compare with the first position: what changed?
2. The a-pawn is far from the diagonal and the knight.
3. No: the recapture still holds.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [eval_range] With the a-pawn on a3 the engine still keeps White slightly ahead (depth 16).

### Step 57: board

Caption: A tempting mistake, shown from White's side (a constructed position [I]): Black has played 13...Qc7 and left d8. White to move: look for a bishop capture.

```
  8  . . r . . r k .
  7  p p q b p p b .
  6  . . . p . n p .
  5  . . . . n . B p
  4  . . . N P . . P
  3  . B N . . P . .
  2  P P P Q . . P .
  1  . . K R . . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 2r2rk1/ppqbppb1/3p1np1/4n1Bp/3NP2P/1BN2P2/PPPQ2P1/2KR3R w - - 2 14
```

The line, with the sentence the learner sees at each move:
1. **14. Bxf6**: The queen has left d8, so f6 is defended only by the bishop and the pawn. White trades the knight.
2. **14... Bxf6**: Black recaptures with the bishop, the piece that guards the king.
3. **15. Nd5**: The knight forks the queen and the bishop at once.
4. **15... Qc5**: The queen steps away; the bishop on f6 is still attacked.
5. **16. Nxf6+**: White takes the bishop with check.
6. **16... exf6**: The bishop on g7 is gone. Black's king has lost its guardian and the dark squares around it are weak.
7. **17. Qh6**: The queen goes to h6 where the bishop used to stand guard. [I] This is the idea behind trading the Dragon bishop.

```
  8  . . r . . r k .
  7  p p . b . p . .
  6  . . . p . p p Q
  5  . . q . n . . p
  4  . . . N P . . P
  3  . B . . . P . .
  2  P P P . . . P .
  1  . . K R . . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 2r2rk1/pp1b1p2/3p1ppQ/2q1n2p/3NP2P/1B3P2/PPP3P1/2KR3R b - - 1 17
```

Drawn on the board: arrows g5-f6, d5-c7, d5-f6, d2-h6; highlighted squares f6, c7, d5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] Bxf6 is the engine's top move (depth 16).
- [move_loses] g4 is at least 60 centipawns worse than Bxf6 (depth 16).
- [attackers] After Bxf6 Bxf6 the knight on d5 attacks the bishop on f6.
- [attackers] The knight on d5 also attacks the queen on c7.
- [eval_range] White is clearly better in the engine's eyes (depth 16).

### Step 58: item  (shown without telling the learner the topic: unlabeled test)

**Task `IOD-LODDRAGON4-12`** (find_move, difficulty cue 3)

White to move. Find the strongest move (engine, depth 16).

```
  8  . . r . . r k .
  7  p p q b p p b .
  6  . . . p . n p .
  5  . . . . n . B p
  4  . . . N P . . P
  3  . B N . . P . .
  2  P P P Q . . P .
  1  . . K R . . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 2r2rk1/ppqbppb1/3p1np1/4n1Bp/3NP2P/1BN2P2/PPPQ2P1/2KR3R w - - 2 14
```

**Accepted answer(s):** Bxf6

Feedback shown for wrong moves:
- g4: A thematic pawn move, but it lets Black consolidate: at least 60 centipawns worse than Bxf6 (depth 16).
- Kb1: A useful king move in other positions, but here the tactic is faster: at least 60 centipawns worse (depth 16).

**Explanation shown:** Bxf6 Bxf6 Nd5 forks the queen and the bishop. It is the engine's top move at depth 16 and the engine rates the other candidates at least 60 centipawns lower.

Hints (in order):
1. Which black piece used to defend f6 together with the bishop and the pawn?
2. A trade on f6 followed by a knight move creates a double attack.
3. Bxf6.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] Bxf6 is the engine's top move (depth 16).
- [move_loses] g4 is at least 60 centipawns worse than Bxf6 (depth 16).
- [move_loses] Kb1 is at least 60 centipawns worse than Bxf6 (depth 16).

### Step 59: item  (shown without telling the learner the topic: unlabeled test)

**Task `IOD-LODDRAGON4-13`** (find_move, difficulty cue 3)

White to move. Find one of the three moves within 30 centipawns of the engine's best (depth 16).

```
  8  . . r q . r k .
  7  p p . b p p b p
  6  . . n p . n p .
  5  . . . . . . . .
  4  . . B N P . . .
  3  . . N . B P . .
  2  P P P Q . . P P
  1  . . K R . . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 2rq1rk1/pp1bppbp/2np1np1/8/2BNP3/2N1BP2/PPPQ2PP/2KR3R w - - 7 11
```

**Accepted answer(s):** Nxc6, Bb3, Be2

Feedback shown for wrong moves:
- Qe2: The queen is badly placed on e2: the engine rates it at least 60 centipawns worse (depth 16).
- Bd3: The bishop gives up its diagonal toward f7 and lets Black break with ...d5 (at least 50 centipawns worse, depth 16).

**Explanation shown:** Nxc6, Bb3 and Be2 are all within 30 centipawns of the best at depth 16.

Hints (in order):
1. Look at the c-file: what stands in front of the black rook?
2. Either trade the knight yourself or move the bishop off the c-file.
3. Nxc6, Bb3 or Be2.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] Nxc6, Bb3 and Be2 are all within 30 centipawns of the best (depth 16).
- [move_loses] Qe2 is at least 60 centipawns worse than the best move (depth 16).
- [move_loses] Bd3 is at least 50 centipawns worse than the best move (depth 16).

### Step 60: card

**What the counts say** (our master file: 329,379 games, both players 2500+; results of games, not verdicts). After 8...Nc6, White castled long in 217 games (White won 32%, drew 47%, lost 21%) and played the bishop to c4 in 139 (43%, 45%, 12%). So Black won 12% of the bishop games and 21% of the castling games. [I] That does not show the bishop move is better: players, move orders and sample size all differ, and the counts cannot separate them.

### Step 61: reflect

Kind: expect

Prompt: Black scored worse against 9.Bc4 than against 9.O-O-O in our sample. Does that show 9.Bc4 is the better move? Give your verdict and one thing the numbers cannot tell you.

- Field "My verdict and why:" (free text)

- Field "One thing the counts cannot tell me:" (free text)

### Step 62: practice

A drill of 4 tasks drawn from the bank by tag ['theme.dragon'] (171 tasks carry those tags). Not reproduced here; ask for a sample if you want one checked.

## Chapter: Recap and teach it back

### Step 63: card

**Recap.** The bishop on c4 stops the central break and eyes f7. Black's bishop clears c8 for the rook; once the rook arrives, the white bishop leaves the c-file and the black knight jumps to e5. White's pawn storm meets Black's block on h5. Bishop on g5 and rook on c5 make a discovered-attack pattern. Recapture on d4 with a piece, not the queen. A queen that leaves d8 weakens f6. Counts show what was played, not what is best.

### Step 64: card

**Who is faster?** [I] White's attack runs on the h-file and the dark squares around Black's king; Black's counter runs on the c-file towards the white king. Black's equaliser is the knight-and-rook trick: the knight moves with a threat, then the rook hits the bishop on g5. White's edge grows when the bishops are traded on h6 first. So the race is decided by tempo: who gets the file open one move earlier.

### Step 65: reflect

Kind: confidence

Prompt: Step back through the board of the whole line. Explain the purpose of any three of the moves you saw, in your own words, as if to a beginner. Then check yourself: did you say when each idea works, when it fails, give an example a beginner could set up, and name one mistake? Compare your answer to the card above.

- Field "My explanation for a beginner:" (free text)

---

## Reviewer scorecard

Fill in the file `content/review/L-OD-DRAGON-4.json` (a template is below). Scale 1 to 5 for each dimension: 1 = wrong or unusable, 3 = acceptable with edits, 5 = I would put my name to it as it stands.
Revision to review: `aeedbee5`. If the lesson text changes after your review, your sign-off no longer applies and the lesson goes back to needs-human.

| Dimension | What to judge | Score |
|---|---|---|
| chess | every statement, line and explanation is correct; near-misses are really near-misses | |
| clarity | the explanation actually explains (mechanism, conditions), in plain words | |
| prerequisites | the lesson assumes only what the learner has met | |
| tasks | each task has one defensible answer and a fair explanation | |

```json
{
  "lesson": "L-OD-DRAGON-4",
  "revision": "aeedbee5",
  "reviewer": "<your name>",
  "reviewer_role": "strong-player",
  "date": "YYYY-MM-DD",
  "scores": {"chess": 0, "clarity": 0, "prerequisites": 0, "tasks": 0},
  "comments": "<what to change, by step number>",
  "verdict": "approved"
}
```

`reviewer_role` is `strong-player` or `teacher`. `verdict` is `approved` or `changes-requested`. See docs/review-slice.md.
