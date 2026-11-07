# Review packet: L-OD-DRAGON-9

**Plan building, the final test, and teaching the Dragon to someone else**

- Skill: OPN.STRUCT (D2); stage: exemplar; stated length: 40 minutes
- Steps: 58 (12 are tasks); revision: `065e1a30`
- Review status now: needs-human

## What the lesson says the learner will be able to do

- Given an unfamiliar Dragon position, names the kings' wings, the open and half-open files and the break, and chooses a plan among three or four with a reason
- Tells a position where no Dragon plan applies (a recapture, a same-wing quiet line, a missing f-pawn) from one where it does
- Finds the move that spoils a line, and the tactic that punishes it, in positions from the Dragon
- States in one phrase the single feature that makes a plan work or fail in a pair of positions
- Explains the Dragon to a beginner in four parts (idea, when it works, an example, a warning) and checks the explanation against a four-question list

## Sources the author names (check that they are used fairly, in our own words)

- app/public/masters/stats.json (329,379 games, both players 2500+, first 24 plies, moves with fewer than 3 games dropped; counts quoted from the tree rows for the positions after 12.Kb1, 9.O-O-O, 12.Bd4 and after 6...Bg7 and 8...Ng4; the average ratings in the 12.Kb1 rows are about 3,000 and above, so those rows are engine games [V])
- content/items/lesson-od-l-od-dragon-9.json (positions replayed from SAN with python-chess, three contrast positions are one-feature edits; engine claims at depth 16)
- content/items/lesson-od-dragon.json (IODdragon-5, 6, 10 and the d5 contrast IODdragon-7, 8, 9 re-used by id)
- docs/citable-views.md 6.7 (Emanuel Lasker, list each side's plans and count the moves) [V-sheet], 6.12 (Jeremy Silman, imbalances) [S], 6.3 (Znosko-Borovsky, the difference method) [V-sheet], 11.6 (Emanuel Lasker, Common Sense in Chess, lectures 2-4, showed the refuted alternative beside the correct line) [V-sheet], 11.7 (Botvinnik, analyse games for errors) [S]; paraphrased, no quotations
- docs/competition-chess-steps.md (labelled practice then an unlabelled mix; the workbook-and-review pattern) [S]; the claim that it helps retention here is [H]
- docs/lesson-depth-standard.md sections 4 and 6 (teach-it-back with a self-check list); the claim that writing for a beginner tests understanding better than multiple choice is [H]
- [R] The neighbouring openings in the last card are from memory and are not engine- or data-checked

## How to read this packet

Boards are drawn with capitals for White and lower case for Black, rank 8 at the top unless the board is shown from Black's side. Moves in a line are in standard notation. Statements marked [V] were machine-checked, [I] inference, [H] hypothesis, [S] secondary source, [R] recalled. Please judge the explanations, not only the moves: does each sentence tell the learner why?

---

## Chapter: Cold start

### Step 1: card

**The last Dragon lesson is a workout.** Earlier lessons gave you the structure, the move orders, the main lines and the tactics. Here nothing is labelled. You will choose plans, find the move that spoils a line, and finally teach the opening back to a beginner. Start cold: look at the next board for a full minute, write your plan, and only then read on.

### Step 2: board

Caption: Black to move on move 12, in a position taken from our game file. The kings stand on opposite wings and White's king has just stepped to b1. Look at the files, the kings and the knight on e5 before you choose.

```
  8  . . r q . r k .
  7  p p . b p p b p
  6  . . . p . n p .
  5  . . . . n . . .
  4  . . . N P . . .
  3  . B N . B P . .
  2  P P P Q . . P P
  1  . K . R . . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: 2rq1rk1/pp1bppbp/3p1np1/4n3/3NP3/1BN1BP2/PPPQ2PP/1K1R3R b - - 10 12
```

Drawn on the board: highlighted squares b1, c8, e5, g7.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [open_files] The d-file is half-open for White and the c-file is half-open for Black; no file is fully open.
- [king_wing] White's king is on the queenside.
- [king_wing] Black's king is on the kingside.
- [best_move_in] Re8, Nc4 and a6 are each within 45 cp of the engine's top move (depth 16), and the engine's top move is among them.

### Step 3: reflect

Kind: expect

Prompt: Before anything is explained: what is your plan for Black, in one sentence, and what is its first move? Write it down even if you are unsure. Scaffold: name the files, the kings, one break.

- Field "My plan:" (free text)

- Field "My first move:" (free text)

## Chapter: Find the plan

### Step 4: card

**What the games say** (counts, not verdicts). Our file holds 329,379 games between players rated 2500 or more. Thirty reached this position, and their average ratings are about 3,000 or higher [V]: engine games, so the counts show what engines chose, not what a club player should expect. Black chose the rook step in 13 (3 White wins, 10 draws, no Black win), the knight jump in 9 (8, 1, 0) and the quiet pawn move in 8 (3, 4, 1).

### Step 5: board

Caption: **Plan 1: the quiet rook.** The most common choice in the 30 engine games. The engine's line (depth 16) shows the whole plan: stop the h-pawn, meet the bishop trade, and use the half-open c-file.

```
  8  . . r q . r k .
  7  p p . b p p b p
  6  . . . p . n p .
  5  . . . . n . . .
  4  . . . N P . . .
  3  . B N . B P . .
  2  P P P Q . . P P
  1  . K . R . . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: 2rq1rk1/pp1bppbp/3p1np1/4n3/3NP3/1BN1BP2/PPPQ2PP/1K1R3R b - - 10 12
```

The line, with the sentence the learner sees at each move:
1. **12... Re8**: The rook from f8 steps to e8, where it backs the pawn on e7.
2. **13. h4**: White starts the pawn storm: the h-pawn heads for h5.
3. **13... h5**: Black plants a pawn on h5, so White's h-pawn cannot advance further without an exchange on g4.
4. **14. Bh6**: White offers to trade the Dragon bishop, the main guard of the dark squares around the king.
5. **14... Nc4**: The knight jumps with tempo and attacks the queen on d2.
6. **15. Bxc4**: White removes the knight with the bishop from b3.
7. **15... Rxc4**: The rook recaptures on the half-open c-file and attacks the knight on d4.

```
  8  . . . q r . k .
  7  p p . b p p b .
  6  . . . p . n p B
  5  . . . . . . . p
  4  . . r N P . . P
  3  . . N . . P . .
  2  P P P Q . . P .
  1  . K . R . . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 3qr1k1/pp1bppb1/3p1npB/7p/2rNP2P/2N2P2/PPPQ2P1/1K1R3R w - - 0 16
```

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [attackers] After Nc4 the black knight attacks the queen on d2 (1 black attacker).
- [attackers] After Rxc4 the rook attacks the knight on d4 (1 black attacker).

### Step 6: board

Caption: **Plan 2: the knight jump at once.** Nine games. Black trades the knight for the bishop that eyed f7 and keeps the rook active on the c-file.

```
  8  . . r q . r k .
  7  p p . b p p b p
  6  . . . p . n p .
  5  . . . . n . . .
  4  . . . N P . . .
  3  . B N . B P . .
  2  P P P Q . . P P
  1  . K . R . . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: 2rq1rk1/pp1bppbp/3p1np1/4n3/3NP3/1BN1BP2/PPPQ2PP/1K1R3R b - - 10 12
```

The line, with the sentence the learner sees at each move:
1. **12... Nc4**: Black jumps at once, attacking the queen on d2 and offering a knight for the bishop.
2. **13. Bxc4**: White accepts: the bishop that eyed the pawn on f7 is traded.
3. **13... Rxc4**: The rook takes the bishop on c4 and attacks the knight on d4.
4. **14. g4**: White presses on with the pawn storm: g4 prepares h4 and h5 with more force.
5. **14... b5**: Black replies on the other wing: the pawn gains space and supports the rook on c4.
6. **15. h4**: The h-pawn marches on: the race continues.
7. **15... h5**: Black blocks it once more.

```
  8  . . . q . r k .
  7  p . . b p p b .
  6  . . . p . n p .
  5  . p . . . . . p
  4  . . r N P . P P
  3  . . N . B P . .
  2  P P P Q . . . .
  1  . K . R . . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 3q1rk1/p2bppb1/3p1np1/1p5p/2rNP1PP/2N1BP2/PPPQ4/1K1R3R w - - 0 16
```

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [attackers] After Nc4 the black knight attacks the queen on d2 (1 black attacker).
- [pawn_attackers] After b5 the black pawn on b5 supports the rook on c4.

### Step 7: board

Caption: **Plan 3: the waiting pawn.** Eight games. The same plan, a different first move: a6 prepares the pawn push b5 and takes b5 away from White's pieces. [I] The plans differ less than they look; the structure does the work.

```
  8  . . r q . r k .
  7  p p . b p p b p
  6  . . . p . n p .
  5  . . . . n . . .
  4  . . . N P . . .
  3  . B N . B P . .
  2  P P P Q . . P P
  1  . K . R . . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: 2rq1rk1/pp1bppbp/3p1np1/4n3/3NP3/1BN1BP2/PPPQ2PP/1K1R3R b - - 10 12
```

The line, with the sentence the learner sees at each move:
1. **12... a6**: A quiet move that prepares the pawn push b5.
2. **13. h4**: White starts the h-pawn storm.
3. **13... h5**: Black stops it on the spot.
4. **14. Bh6**: White offers the bishop trade.
5. **14... Nc4**: The knight jumps with tempo and attacks the queen.

```
  8  . . r q . r k .
  7  . p . b p p b .
  6  p . . p . n p B
  5  . . . . . . . p
  4  . . n N P . . P
  3  . B N . . P . .
  2  P P P Q . . P .
  1  . K . R . . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 2rq1rk1/1p1bppb1/p2p1npB/7p/2nNP2P/1BN2P2/PPPQ2P1/1K1R3R w - - 2 15
```

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [attackers] After Nc4 the black knight attacks the queen on d2 (1 black attacker).

### Step 8: card

**A plan-finder in three questions.** Where are the kings, and what does that allow? Which file or square is open to me and closed to him? Which break or piece route reaches it, and how many moves does it take? Emanuel Lasker advised listing each side's plans and counting the moves they need; Jeremy Silman starts from the differences between the two armies. [H] Writing the answers down makes you steadier; we cannot test that yet.

### Step 9: board

Caption: Questions 1 and 2 on a real position, just after White castles long. The kings stand on opposite wings; the c-file is half-open for Black and the d-file for White. Question 3 is the rest of this lesson.

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

Drawn on the board: highlighted squares c1, g8, c8, d6.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [open_files] The c-file is half-open for Black and the d-file is half-open for White.
- [king_wing] White's king is on the queenside.
- [king_wing] Black's king is on the kingside.

### Step 10: board

Caption: Move order is part of the plan. Our file keeps only moves seen at least three times: at this position f3 appears in 455 games (174 White wins, 199 draws, 82 Black wins) and Be2 in 27 (8, 11, 8); every other seventh move was played fewer than three times. You test the move order in question 7.

```
  8  r n b q k . . r
  7  p p . . p p b p
  6  . . . p . n p .
  5  . . . . . . . .
  4  . . . N P . . .
  3  . . N . B . . .
  2  P P P . . P P P
  1  R . . Q K B . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: rnbqk2r/pp2ppbp/3p1np1/8/3NP3/2N1B3/PPP2PPP/R2QKB1R w KQkq - 2 7
```

Drawn on the board: highlighted squares e3, f2, g4.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [piece_on] A white bishop stands on e3.
- [legal_move] f3 is legal here.

### Step 11: board

Caption: When the d-pawn is exchanged the structure changes. This position was reached in 133 games of our master file (38 White wins, 69 draws, 26 Black wins); Black then chose a bishop trade on d4 in 75 and the pawn push e5 in 47. A plan has to be rebuilt from what is on the board, not from the opening's name.

```
  8  r . b q . r k .
  7  p . . . p p b p
  6  . . p . . . p .
  5  . . . n . . . .
  4  . . . B . . . .
  3  . . N . . P . .
  2  P P P Q . . P P
  1  . . K R . B . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: r1bq1rk1/p3ppbp/2p3p1/3n4/3B4/2N2P2/PPPQ2PP/2KR1B1R b - - 1 12
```

Drawn on the board: highlighted squares d4, g7, d5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [open_files] After the exchange of both d-pawns the d-file is open.
- [king_wing] White's king is on the queenside.

### Step 12: card

**Eight plan questions.** Each describes three or four plans in words; you play the first move of the one you choose. Some have two good answers, and one asks for no plan at all. Ask first: are the kings on the same wing or on opposite wings, and is anything simply hanging? After each set of four you see the plans in motion, including the tempting one that fails.

### Step 13: practice

A drill of 4 tasks drawn from the bank by tag ['theme.dragon', 'od.l9a'] (4 tasks carry those tags). Not reproduced here; ask for a sample if you want one checked.

### Step 14: board

Caption: **Question 1 in motion.** The central break (engine line, depth 16). Black strikes at e4 before White's attack is ready.

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
1. **9... d5**: The pawn attacks e4 at once and opens lines for the pieces.
2. **10. exd5**: White takes, which opens the e-file and the diagonal for the bishop on f1.
3. **10... Nxd5**: The knight recaptures in the centre and attacks the bishop on e3.
4. **11. Nxc6**: White takes the knight on c6 before Black can use it.
5. **11... bxc6**: Black recaptures with the b-pawn, which opens the b-file and supports the knight on d5.
6. **12. Bd4**: The bishop offers a trade on the long diagonal.
7. **12... Bxd4**: Black takes the bishop.
8. **13. Qxd4**: White recaptures with the queen, now in the centre.

```
  8  r . b q . r k .
  7  p . . . p p . p
  6  . . p . . . p .
  5  . . . n . . . .
  4  . . . Q . . . .
  3  . . N . . P . .
  2  P P P . . . P P
  1  . . K R . B . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r1bq1rk1/p3pp1p/2p3p1/3n4/3Q4/2N2P2/PPP3PP/2KR1B1R b - - 0 13
```

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [pawn_attackers] After d5 the black pawn attacks the pawn on e4.
- [attackers] After Nxd5 the knight attacks the bishop on e3 (1 black attacker).

### Step 15: board

Caption: **The tempting slow plan.** Queen to a5 (engine line, depth 16). Count the moves the queen makes.

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
1. **9... Qa5**: The queen attacks the knight on c3.
2. **10. Kb1**: White steps the king to safety. The knight on c3 stays guarded by the b-pawn and the queen.
3. **10... Bd7**: Black develops the bishop.
4. **11. Nb3**: The knight attacks the queen on a5.
5. **11... Qd8**: The queen goes back to where it started.
6. **12. Be2**: White develops the last minor piece.

```
  8  r . . q . r k .
  7  p p . b p p b p
  6  . . n p . n p .
  5  . . . . . . . .
  4  . . . . P . . .
  3  . N N . B P . .
  2  P P P Q B . P P
  1  . K . R . . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r2q1rk1/pp1bppbp/2np1np1/8/4P3/1NN1BP2/PPPQB1PP/1K1R3R b - - 10 12
```

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [attackers] After Qa5 Kb1 the knight on c3 has 2 white defenders.
- [attackers] After Nb3 the white knight attacks the queen on a5 (1 white attacker).

### Step 16: board

Caption: **Question 2 in motion.** Safety first (engine line, depth 16). The h4 plan is close (within about 50 cp) and keeps the king where it is; the king step keeps both options.

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
1. **12. Kb1**: The king steps off the c-file, where Black's rook is aimed.
2. **12... Nc4**: The knight jumps with tempo and attacks the queen.
3. **13. Bxc4**: White takes the knight with the bishop.
4. **13... Rxc4**: The rook recaptures and attacks the knight on d4.
5. **14. Qd3**: The queen steps out of attack and hits the rook on c4.
6. **14... Rc8**: The rook retreats along the c-file.
7. **15. g4**: Now the pawn storm starts, with the king safe on b1.

```
  8  . . r q . r k .
  7  p p . b p p b p
  6  . . . p . n p .
  5  . . . . . . . .
  4  . . . N P . P .
  3  . . N Q B P . .
  2  P P P . . . . P
  1  . K . R . . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 2rq1rk1/pp1bppbp/3p1np1/8/3NP1P1/2NQBP2/PPP4P/1K1R3R b - - 0 15
```

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [attackers] After Qd3 the queen attacks the rook on c4 (1 white attacker).

### Step 17: board

Caption: **The tempting plan that fails.** Bishop to g5 (engine line, depth 16). Bg5 leaves the queen on d2 without bishop cover, so the knight jump gains a tempo; it scores about 50 cp below Kb1.

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
1. **12. Bg5**: The bishop leaves e3 and attacks the knight on f6.
2. **12... Nc4**: The knight jumps at once and attacks the queen on d2.
3. **13. Bxc4**: White takes the knight.
4. **13... Rxc4**: The rook recaptures.
5. **14. Qd3**: The queen attacks the rook.
6. **14... Rc5**: The rook steps to c5 and attacks the bishop on g5.
7. **15. h4**: White guards the bishop with the h-pawn.

```
  8  . . . q . r k .
  7  p p . b p p b p
  6  . . . p . n p .
  5  . . r . . . B .
  4  . . . N P . . P
  3  . . N Q . P . .
  2  P P P . . . P .
  1  . . K R . . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 3q1rk1/pp1bppbp/3p1np1/2r3B1/3NP2P/2NQ1P2/PPP3P1/2KR3R b - - 0 15
```

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [attackers] After Rc5 the rook attacks the bishop on g5 (1 black attacker).

### Step 18: board

Caption: **Question 3 in motion.** Stop the h-pawn (engine line, depth 16).

```
  8  . . r q . r k .
  7  . p . b p p b p
  6  p . . p . n p .
  5  . . . . n . . .
  4  . . . N P . . P
  3  . B N . B P . .
  2  P P P Q . . P .
  1  . K . R . . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: 2rq1rk1/1p1bppbp/p2p1np1/4n3/3NP2P/1BN1BP2/PPPQ2P1/1K1R3R b - - 0 13
```

The line, with the sentence the learner sees at each move:
1. **13... h5**: Black stops the h-pawn on its fourth rank: it cannot go past h4 without an exchange.
2. **14. Bh6**: White offers to trade the Dragon bishop.
3. **14... Nc4**: The knight jumps with tempo and attacks the queen.
4. **15. Qc1**: The queen steps aside and keeps guard of the bishop on h6.
5. **15... Kh7**: The king attacks the bishop on h6.
6. **16. Bxg7**: White takes the Dragon bishop first.
7. **16... Kxg7**: The king recaptures; the h-file stays shut by the pawn on h5.

```
  8  . . r q . r . .
  7  . p . b p p k .
  6  p . . p . n p .
  5  . . . . . . . p
  4  . . n N P . . P
  3  . B N . . P . .
  2  P P P . . . P .
  1  . K Q R . . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 2rq1r2/1p1bppk1/p2p1np1/7p/2nNP2P/1BN2P2/PPP3P1/1KQR3R w - - 0 17
```

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [pawn_attackers] After h5 the black pawn on h5 attacks g4.
- [attackers] After Kh7 the bishop on h6 is attacked 2 times by Black.

### Step 19: board

Caption: **The tempting plan that fails.** The queenside push (engine line, depth 16): Black starts a race and ends clearly worse than after h5. [I] The race is not shown to be lost; the engine gap is the evidence.

```
  8  . . r q . r k .
  7  . p . b p p b p
  6  p . . p . n p .
  5  . . . . n . . .
  4  . . . N P . . P
  3  . B N . B P . .
  2  P P P Q . . P .
  1  . K . R . . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: 2rq1rk1/1p1bppbp/p2p1np1/4n3/3NP2P/1BN1BP2/PPPQ2P1/1K1R3R b - - 0 13
```

The line, with the sentence the learner sees at each move:
1. **13... b5**: Black starts the queenside push.
2. **14. h5**: The h-pawn is not stopped: it now attacks the pawn on g6.
3. **14... Nc4**: The knight jumps at once.
4. **15. Bxc4**: White takes it.
5. **15... Rxc4**: Black recaptures.
6. **16. g4**: The g-pawn joins the storm.
7. **16... Qc7**: The queen steps to c7 to defend.

```
  8  . . . . . r k .
  7  . . q b p p b p
  6  p . . p . n p .
  5  . p . . . . . P
  4  . . r N P . P .
  3  . . N . B P . .
  2  P P P Q . . . .
  1  . K . R . . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 5rk1/2qbppbp/p2p1np1/1p5P/2rNP1P1/2N1BP2/PPPQ4/1K1R3R w - - 1 17
```

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [pawn_attackers] After h5 the white pawn on h5 attacks the pawn on g6.
- [move_loses] b5 scores at least 60 cp worse than the engine's best move (depth 16).

### Step 20: board

Caption: **Question 4 in motion.** Trade the strong bishop (engine line, depth 16). Pawn push e5 was also within 30 cp.

```
  8  r . b q . r k .
  7  p . . . p p b p
  6  . . p . . . p .
  5  . . . n . . . .
  4  . . . B . . . .
  3  . . N . . P . .
  2  P P P Q . . P P
  1  . . K R . B . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: r1bq1rk1/p3ppbp/2p3p1/3n4/3B4/2N2P2/PPPQ2PP/2KR1B1R b - - 1 12
```

The line, with the sentence the learner sees at each move:
1. **12... Bxd4**: Black trades the Dragon bishop for White's strong bishop.
2. **13. Qxd4**: White recaptures with the queen, now in the centre.
3. **13... Qb6**: Black offers a queen trade and attacks the queen on d4.
4. **14. Na4**: The knight attacks the queen on b6.
5. **14... Qa5**: The queen leaves b6 and attacks the knight on a4.
6. **15. b3**: The pawn guards the knight.

```
  8  r . b . . r k .
  7  p . . . p p . p
  6  . . p . . . p .
  5  q . . n . . . .
  4  N . . Q . . . .
  3  . P . . . P . .
  2  P . P . . . P P
  1  . . K R . B . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r1b2rk1/p3pp1p/2p3p1/q2n4/N2Q4/1P3P2/P1P3PP/2KR1B1R b - - 0 15
```

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [attackers] After Qb6 the black queen attacks the queen on d4 (1 black attacker).

### Step 21: card

**What the first four show** [I]. In the Black-to-move questions the best plan hit something White needed soon: the pawn on e4, the h-pawn, the bishop trade. In the White question the best plan removed a danger first, the king step. Slower plans lost time, and with kings on opposite wings time is the currency. [H] On the same wing the currency changes to squares and piece placement. Next: the same-wing case, a move-order point and a plain recapture.

### Step 22: practice

A drill of 4 tasks drawn from the bank by tag ['theme.dragon', 'od.l9b'] (4 tasks carry those tags). Not reproduced here; ask for a sample if you want one checked.

### Step 23: board

Caption: **Question 5 in motion.** Same-wing kings (engine line, depth 16): the quiet plan on the queenside and the c-file.

```
  8  r . b q . r k .
  7  p p . . p p b p
  6  . . n p . n p .
  5  . . . . . . . .
  4  . . . . P . . .
  3  . N N . B . . .
  2  P P P . B P P P
  1  R . . Q . R K .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: r1bq1rk1/pp2ppbp/2np1np1/8/4P3/1NN1B3/PPP1BPPP/R2Q1RK1 b - - 7 9
```

The line, with the sentence the learner sees at each move:
1. **9... Be6**: The bishop develops and eyes the knight on b3.
2. **10. f4**: White begins kingside expansion.
3. **10... Rc8**: The rook takes the half-open c-file.
4. **11. f5**: The pawn attacks the bishop on e6.
5. **11... Bd7**: The bishop steps back; nothing is lost.
6. **12. a4**: White starts queenside play too.

```
  8  . . r q . r k .
  7  p p . b p p b p
  6  . . n p . n p .
  5  . . . . . P . .
  4  P . . . P . . .
  3  . N N . B . . .
  2  . P P . B . P P
  1  R . . Q . R K .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 2rq1rk1/pp1bppbp/2np1np1/5P2/P3P3/1NN1B3/1PP1B1PP/R2Q1RK1 b - - 0 12
```

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [attackers] After Be6 the black bishop attacks the knight on b3 (1 black attacker).
- [pawn_attackers] After f5 the white pawn on f5 attacks e6.

### Step 24: board

Caption: **The tempting plan that fails.** The pawn goes to g5 and the bishop on e3 simply takes it, because nothing defends the pawn. [H] With the kings on the same wing, a storm also has no target.

```
  8  r . b q . r k .
  7  p p . . p p b p
  6  . . n p . n p .
  5  . . . . . . . .
  4  . . . . P . . .
  3  . N N . B . . .
  2  P P P . B P P P
  1  R . . Q . R K .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: r1bq1rk1/pp2ppbp/2np1np1/8/4P3/1NN1B3/PPP1BPPP/R2Q1RK1 b - - 7 9
```

The line, with the sentence the learner sees at each move:
1. **9... g5**: Black starts a storm against a king that is on the same wing as its own.
2. **10. Bxg5**: The pawn on g5 is attacked by the bishop on e3 and is taken.

```
  8  r . b q . r k .
  7  p p . . p p b p
  6  . . n p . n . .
  5  . . . . . . B .
  4  . . . . P . . .
  3  . N N . . . . .
  2  P P P . B P P P
  1  R . . Q . R K .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r1bq1rk1/pp2ppbp/2np1n2/6B1/4P3/1NN5/PPP1BPPP/R2Q1RK1 b - - 0 10
```

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [attackers] After g5 the white bishop attacks the pawn on g5 (1 white attacker).

### Step 25: board

Caption: **Question 6 in motion.** Ignore the offer and hit c3 (engine line, depth 16). Bxh6 and Qc7 were within 30 cp, so Black has a choice.

```
  8  r . b q . r k .
  7  p . . . p p b p
  6  . . p . . n p B
  5  . . . p . . . .
  4  . . . . P . . .
  3  . . N . . P . .
  2  P P P Q . . P P
  1  . . K R . B . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: r1bq1rk1/p3ppbp/2p2npB/3p4/4P3/2N2P2/PPPQ2PP/2KR1B1R b - - 1 11
```

The line, with the sentence the learner sees at each move:
1. **11... Qa5**: The queen ignores the offer and attacks the knight on c3.
2. **12. Bxg7**: White takes the Dragon bishop.
3. **12... Kxg7**: The king recaptures.
4. **13. exd5**: White removes the pawn from d5.
5. **13... cxd5**: Black recaptures, and the pawn on d5 now faces the knight on c3.
6. **14. g4**: White starts the pawn storm.

```
  8  r . b . . r . .
  7  p . . . p p k p
  6  . . . . . n p .
  5  q . . p . . . .
  4  . . . . . . P .
  3  . . N . . P . .
  2  P P P Q . . . P
  1  . . K R . B . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r1b2r2/p3ppkp/5np1/q2p4/6P1/2N2P2/PPPQ3P/2KR1B1R b - - 0 14
```

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [attackers] After Qa5 the black queen attacks the knight on c3 (1 black attacker).

### Step 26: board

Caption: **Question 7 in motion.** The move-order point (engine line, depth 16): without f3 the knight has g4.

```
  8  r n b q k . . r
  7  p p . . p p b p
  6  . . . p . n p .
  5  . . . . . . . .
  4  . . . N P . . .
  3  . . N . B . . .
  2  P P P Q . P P P
  1  R . . . K B . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: rnbqk2r/pp2ppbp/3p1np1/8/3NP3/2N1B3/PPPQ1PPP/R3KB1R b KQkq - 3 7
```

The line, with the sentence the learner sees at each move:
1. **7... Ng4**: The knight attacks the bishop on e3.
2. **8. Bg5**: The bishop steps away and eyes the pawn on e7.
3. **8... h6**: Black asks the bishop to decide.
4. **9. Bh4**: The bishop stays on the diagonal.
5. **9... Nc6**: Black develops the queen's knight.
6. **10. Nb3**: White retreats the knight from d4.

```
  8  r . b q k . . r
  7  p p . . p p b .
  6  . . n p . . p p
  5  . . . . . . . .
  4  . . . . P . n B
  3  . N N . . . . .
  2  P P P Q . P P P
  1  R . . . K B . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r1bqk2r/pp2ppb1/2np2pp/8/4P1nB/1NN5/PPPQ1PPP/R3KB1R b KQkq - 3 10
```

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [attackers] After Ng4 the knight attacks the bishop on e3 (1 black attacker).

### Step 27: board

Caption: **The natural move that allows the main line.** Normal development (engine line, depth 16): fine after f3, but here White plays f3 next and the knight loses the g4 square. The engine prefers the knight jump by about 40 cp: a small edge, not a refutation [I].

```
  8  r n b q k . . r
  7  p p . . p p b p
  6  . . . p . n p .
  5  . . . . . . . .
  4  . . . N P . . .
  3  . . N . B . . .
  2  P P P Q . P P P
  1  R . . . K B . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: rnbqk2r/pp2ppbp/3p1np1/8/3NP3/2N1B3/PPPQ1PPP/R3KB1R b KQkq - 3 7
```

The line, with the sentence the learner sees at each move:
1. **7... Nc6**: Black develops the knight as usual.
2. **8. f3**: White plays the move it wanted; the knight can no longer use g4.
3. **8... O-O**: Black castles.
4. **9. g4**: The pawn storm begins, with the Yugoslav set-up in place.
5. **9... Be6**: Black challenges the knight on d4.
6. **10. O-O-O**: White castles long.

```
  8  r . . q . r k .
  7  p p . . p p b p
  6  . . n p b n p .
  5  . . . . . . . .
  4  . . . N P . P .
  3  . . N . B P . .
  2  P P P Q . . . P
  1  . . K R . B . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r2q1rk1/pp2ppbp/2npbnp1/8/3NP1P1/2N1BP2/PPPQ3P/2KR1B1R b - - 2 10
```

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [pawn_attackers] After f3 the white pawn on f3 attacks g4.

### Step 28: board

Caption: **Question 8 in motion.** No plan needed (engine line, depth 16): the recapture comes first. Eight games in our master file reached the position after Black's knight jump (5 White wins, 3 draws, no Black win).

```
  8  r . b q k . . r
  7  p p . . p p b p
  6  . . n p . . p .
  5  . . . . . . . .
  4  . . . N P . B .
  3  . . N . B . . .
  2  P P P Q . P P P
  1  R . . . K . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: r1bqk2r/pp2ppbp/2np2p1/8/3NP1B1/2N1B3/PPPQ1PPP/R3K2R b KQkq - 0 9
```

The line, with the sentence the learner sees at each move:
1. **9... Bxg4**: The bishop recaptures the knight on g4.
2. **10. f3**: White guards e4 and attacks the bishop on g4
3. **10... Be6**: The bishop retreats to e6.
4. **11. O-O-O**: White castles long.
5. **11... Qa5**: Black's queen attacks the knight on c3.
6. **12. Kb1**: The king steps off the c-file.
7. **12... Rc8**: The rook takes the c-file.

```
  8  . . r . k . . r
  7  p p . . p p b p
  6  . . n p b . p .
  5  q . . . . . . .
  4  . . . N P . . .
  3  . . N . B P . .
  2  P P P Q . . P P
  1  . K . R . . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 2r1k2r/pp2ppbp/2npb1p1/q7/3NP3/2N1BP2/PPPQ2PP/1K1R3R w k - 5 13
```

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [piece_on] After the recapture a black bishop stands on g4.
- [pawn_attackers] After f3 the white pawn on f3 attacks g4.

## Chapter: Spot the error

### Step 29: card

**Spot the error.** In each question three moves keep the position and one spoils it. Mikhail Botvinnik advised analysing games, your own included, to find errors; Emanuel Lasker (Common Sense in Chess) argued for placing the weaker alternative beside the right one so the contrast teaches. [H] The spoiler is usually the move that breaks a guard the position quietly relied on. You will see each one punished.

### Step 30: practice

A drill of 3 tasks drawn from the bank by tag ['theme.dragon', 'od.l9err'] (3 tasks carry those tags). Not reproduced here; ask for a sample if you want one checked.

### Step 31: board

Caption: **Error 1 punished** (engine line, depth 16). The bishop on e3 used to cover the queen on d2. Once it leaves, the capture on e4 attacks the queen, and the knight on d4 is loose behind it.

```
  8  r . b q . r k .
  7  p p . . p p b p
  6  . . n p . n p .
  5  . . . . . . B .
  4  . . . N P . . .
  3  . . N . . P . .
  2  P P P Q . . P P
  1  R . . . K B . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: r1bq1rk1/pp2ppbp/2np1np1/6B1/3NP3/2N2P2/PPPQ2PP/R3KB1R b KQ - 4 9
```

The line, with the sentence the learner sees at each move:
1. **9... Nxe4**: The knight takes the pawn and attacks the queen on d2.
2. **10. Nxc6**: White takes first: the knight on c6 attacks the queen on d8.
3. **10... Nxd2**: Black takes the queen.
4. **11. Nxd8**: White takes the queen on d8.
5. **11... Nxf1**: Black takes the rook on f1.

```
  8  r . b N . r k .
  7  p p . . p p b p
  6  . . . p . . p .
  5  . . . . . . B .
  4  . . . . . . . .
  3  . . N . . P . .
  2  P P P . . . P P
  1  R . . . K n . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r1bN1rk1/pp2ppbp/3p2p1/6B1/8/2N2P2/PPP3PP/R3Kn1R w KQ - 0 12
```

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [attackers] After Nxe4 the knight attacks the queen on d2 (1 black attacker).
- [eval_range] White's evaluation after Bg5 stays below zero (Black is ahead) at depth 16.

### Step 32: board

Caption: **Error 2 punished** (engine line, depth 16). The pawn move h6 removes a shelter pawn and gives the bishop on e3 a target.

```
  8  . . r q . r k .
  7  p p . b p p b .
  6  . . . p . n p p
  5  . . . . n . . .
  4  . . . N P . . .
  3  . B N . B P . .
  2  P P P Q . . P P
  1  . K . R . . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 2rq1rk1/pp1bppb1/3p1npp/4n3/3NP3/1BN1BP2/PPPQ2PP/1K1R3R w - - 0 13
```

The line, with the sentence the learner sees at each move:
1. **13. Bxh6**: The bishop takes the pawn and offers a bishop trade.
2. **13... Bxh6**: Black takes the bishop.
3. **14. Qxh6**: The queen recaptures: the Dragon bishop is gone and the dark squares around the king have no guard.

```
  8  . . r q . r k .
  7  p p . b p p . .
  6  . . . p . n p Q
  5  . . . . n . . .
  4  . . . N P . . .
  3  . B N . . P . .
  2  P P P . . . P P
  1  . K . R . . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 2rq1rk1/pp1bpp2/3p1npQ/4n3/3NP3/1BN2P2/PPP3PP/1K1R3R b - - 0 14
```

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [material_after_move] Bxh6 wins at least a pawn for White along the engine's line.

### Step 33: board

Caption: **Error 3 punished** (engine line, depth 16). Black's queen steps onto the diagonal of the bishop on d4, with the knight on d5 loose to the knight on c3.

```
  8  r . b . . r k .
  7  p . . . p p b p
  6  . q p . . . p .
  5  . . . n . . . .
  4  . . . B . . . .
  3  . . N . . P . .
  2  P P P Q . . P P
  1  . . K R . B . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: r1b2rk1/p3ppbp/1qp3p1/3n4/3B4/2N2P2/PPPQ2PP/2KR1B1R w - - 2 13
```

The line, with the sentence the learner sees at each move:
1. **13. Nxd5**: The knight takes the knight on d5; the queen on b6 is still attacked by the bishop.
2. **13... cxd5**: Black recaptures.
3. **14. Bxb6**: The bishop takes the queen.
4. **14... axb6**: Black recaptures the bishop.

```
  8  r . b . . r k .
  7  . . . . p p b p
  6  . p . . . . p .
  5  . . . p . . . .
  4  . . . . . . . .
  3  . . . . . P . .
  2  P P P Q . . P P
  1  . . K R . B . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r1b2rk1/4ppbp/1p4p1/3p4/8/5P2/PPPQ2PP/2KR1B1R w - - 0 15
```

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [attackers] The white bishop on d4 attacks the queen on b6 (1 white attacker).
- [material_after_move] Nxd5 nets White at least 4 points of material along the engine's line.

### Step 34: card

**One feature at a time.** Znosko-Borovsky's difference method lists what separates two rival positions, and each difference suggests a possibility. Use it now. In the next group the same capture, Nxe4, is tested in three positions that differ in one thing. Predict first. Then do the same for d5, the break from an earlier lesson. Here 'works' means within 40 cp of the engine's best move; in the d5 pair 'loses ground' means at least 80 cp worse.

### Step 35: contrast

Title: When does Nxe4 work?

Prompt: Predict for each position, then check. One difference matters; one does not.

**The working board:**

**Task `IOD-LODDRAGON9-12`** (predict_outcome, difficulty cue 2)

Is the capture Nxe4 a good move here, meaning it is within 40 cp of the engine's top move (depth 16)?

```
  1  R . B K . . . R
  2  P P . . Q P P P
  3  . . P . . N . .
  4  . . . P N . . .
  5  . B . . . . . .
  6  . p n . p n . .
  7  p b p p . . p p
  8  . k r . q b . r
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: r1bq1rk1/pp2ppbp/2np1np1/6B1/3NP3/2N2P2/PPPQ2PP/R3KB1R b KQ - 4 9
```

**Accepted answer:** {"outcome": "yes, it is within 40 cp"}

**Explanation shown:** With the bishop on g5 the queen on d2 has lost its cover, so Nxe4 attacks the queen and is within 40 cp of the engine's top move at depth 16.

Hints (in order):
1. Look at where White's dark-squared bishop stands.
2. Compare with the next position, where the bishop is still on e3.
3. Yes: with the bishop on g5, Nxe4 is within 40 cp of the top move.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] d5 and Nxe4 are each within 40 cp of the engine's top move (depth 16), and the engine's top move is among them.
- [piece_on] A white bishop stands on g5.

**The failing board:**

**Task `IOD-LODDRAGON9-13`** (predict_outcome, difficulty cue 2)

Is the capture Nxe4 a good move here, meaning it is within 40 cp of the engine's top move (depth 16)?

```
  1  R . B K . . . R
  2  P P . . Q P P P
  3  . . P B . N . .
  4  . . . P N . . .
  5  . . . . . . . .
  6  . p n . p n . .
  7  p b p p . . p p
  8  . k r . q b . r
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: r1bq1rk1/pp2ppbp/2np1np1/8/3NP3/2N1BP2/PPPQ2PP/R3KB1R b KQ - 3 9
```

**Accepted answer:** {"outcome": "no, it loses ground"}

**Explanation shown:** With the bishop on e3 the queen on d2 stays covered, so the capture on e4 just loses material: it scores at least 90 cp worse than the engine's best move at depth 16. The one change from the previous position is the bishop square.

Hints (in order):
1. Compare with the previous position. What is different about White's bishop?
2. The bishop is on e3, not g5.
3. No: with the bishop on e3, Nxe4 scores at least 90 cp worse than the best move.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [move_loses] Nxe4 scores at least 90 cp worse than the engine's best move (depth 16).
- [piece_on] A white bishop stands on e3.

**The irrelevant board:**

**Task `IOD-LODDRAGON9-14`** (predict_outcome, difficulty cue 2)

Is the capture Nxe4 a good move here, meaning it is within 40 cp of the engine's top move (depth 16)?

```
  1  R . B K . . . R
  2  P P . . Q P P P
  3  . . P . . N . .
  4  . . . P N . . .
  5  . B . . . . . .
  6  . p n . p n . p
  7  p b p p . . p .
  8  . k r . q b . r
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: r1bq1rk1/1p2ppbp/p1np1np1/6B1/3NP3/2N2P2/PPPQ2PP/R3KB1R b KQ - 4 9
```

**Accepted answer:** {"outcome": "yes, it is within 40 cp"}

**Explanation shown:** The a-pawn moved to a6 and the white bishop is still on g5. Nxe4 stays within 40 cp of the engine's top move at depth 16 (Nxd4 is the top move here), so this change is irrelevant. The bishop still stands on g5, so the same mechanism works.

Hints (in order):
1. Compare with the first position. What changed?
2. Only the a-pawn moved, one square.
3. Yes: with the bishop on g5 the pawn on a6 does not matter.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] Nxe4 and Nxd4 are each within 40 cp of the engine's top move (depth 16), and the engine's top move is among them.
- [piece_on] A black pawn stands on a6.
- [piece_on] A white bishop stands on g5.

### Step 36: contrast

Title: Does d5 lose ground?

Prompt: Predict for each position, then check. One difference matters; one does not.

**The working board:**

**Task `IODdragon-7`** (predict_outcome, difficulty cue 2)

Black is considering ...d5. Does it lose ground, meaning it scores at least 80 centipawns worse than the engine's best move?

```
  1  R . B . R K . .
  2  P P . . Q P P P
  3  . . P B . N . .
  4  . . . P N . . .
  5  . . . . . . . .
  6  . p n . p n . .
  7  p b p p . . p p
  8  . k r . q b . r
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: r1bq1rk1/pp2ppbp/2np1np1/8/3NP3/2N1BP2/PPPQ2PP/2KR1B1R b - - 4 9
```

**Accepted answer:** {"outcome": "no, it does not lose ground"}

**Explanation shown:** With the bishop on c8, ...d5 is the engine's top move at depth 16, so it does not lose ground.

Hints (in order):
1. Look at where the black bishop stands.
2. Compare with the next position, where the bishop has moved.
3. No: here d5 is the engine's top move.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] d5 is the engine's top move (depth 16).
- [piece_on] A black bishop stands on c8.

**The failing board:**

**Task `IODdragon-8`** (predict_outcome, difficulty cue 2)

Black is considering ...d5. Does it lose ground, meaning it scores at least 80 centipawns worse than the engine's best move?

```
  1  R . B . R K . .
  2  P P . . Q P P P
  3  . . P B . N . .
  4  . . . P N . . .
  5  . . . . . . . .
  6  . p n . p n . .
  7  p b p p b . p p
  8  . k r . q . . r
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: r2q1rk1/pp1bppbp/2np1np1/8/3NP3/2N1BP2/PPPQ2PP/2KR1B1R b - - 4 9
```

**Accepted answer:** {"outcome": "yes, it loses ground"}

**Explanation shown:** With the bishop on d7, ...d5 scores at least 80 centipawns below the engine's best move at depth 16. The one change from the previous position is the bishop square.

Hints (in order):
1. Compare with the previous position. What is different on the c8 and d7 squares?
2. The bishop has moved from c8 to d7.
3. Yes: with the bishop on d7, d5 scores at least 80 cp worse.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [move_loses] d5 is at least 80 cp worse than the engine's best move (depth 16).
- [piece_on] A black bishop stands on d7.

**The irrelevant board:**

**Task `IODdragon-9`** (predict_outcome, difficulty cue 2)

Black is considering ...d5. Does it lose ground, meaning it scores at least 80 centipawns worse than the engine's best move?

```
  1  R . B . R K . .
  2  P P . . Q P P P
  3  . . P B . N . .
  4  . . . P N . . .
  5  . . . . . . . .
  6  . p n . p n . p
  7  p b p p . . p .
  8  . k r . q b . r
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: r1bq1rk1/1p2ppbp/p1np1np1/8/3NP3/2N1BP2/PPPQ2PP/2KR1B1R b - - 4 9
```

**Accepted answer:** {"outcome": "no, it does not lose ground"}

**Explanation shown:** The a-pawn moved to a6 and the bishop is still on c8. ...d5 stays within 40 centipawns of the engine's top move at depth 16, so this change is irrelevant to the question.

Hints (in order):
1. Compare with the first position. What changed?
2. Only the a-pawn moved, one square.
3. No: d5 stays within 40 cp of the best move.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] d5 and Bd7 are within 40 cp of the engine's top move (depth 16).
- [piece_on] A black pawn stands on a6.
- [piece_on] A black bishop stands on c8.

### Step 37: reflect

Kind: expect

Prompt: In one phrase each: which single feature decided the Nxe4 question, and which single feature decided the d5 question?

- Field "For Nxe4:" (free text)

- Field "For d5:" (free text)

### Step 38: board

Caption: A first tour for a beginner: the first ten moves, one idea per move. It models how to say what each move is for. The plans come later, in your teach-back.

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
1. **1. e4**: White takes space in the centre and opens lines for the bishop and the queen.
2. **1... c5**: Black does not copy: the pawn fights for the centre from the side.
3. **2. Nf3**: White develops a knight and prepares d4.
4. **2... d6**: Black guards e5 and frees the bishop on c8.
5. **3. d4**: White opens the centre.
6. **3... cxd4**: Black trades a wing pawn for White's central pawn.
7. **4. Nxd4**: The knight recaptures and stands in the centre.
8. **4... Nf6**: Black attacks the pawn on e4.
9. **5. Nc3**: White defends e4 and develops.
10. **5... g6**: The Dragon move: it prepares the bishop on g7, which will look down the long diagonal.

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

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: rnbqkb1r/pp2pp1p/3p1np1/8/3NP3/2N5/PPP2PPP/R1BQKB1R w KQkq - 0 6
```

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [piece_on] A black pawn stands on g6 after ten moves.
- [piece_on] A white knight stands on d4 after ten moves.

## Chapter: The final test

### Step 39: card

**Mixed final test.** Twelve unlabelled positions follow: three from the opening lesson, then nine new ones. Some ask for a plan, some for a tactic, some for a fact about the structure; in some, several moves are fine. Work without hints and say why before you check. [S] Labelled practice followed by an unlabelled mix is the pattern of the Steps method; [H] it helps here too.

### Step 40: item  (shown without telling the learner the topic: unlabeled test)

**Task `IODdragon-5`** (find_move, difficulty cue 3)

White to move. Find one of the moves within 25 centipawns of the engine's top move (depth 16).

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

White to move. Capitals = White, lower case = Black.
FEN: 2rq1rk1/pp1bppb1/3p1np1/4n2p/3NP2P/1BN1BP2/PPPQ2P1/2KR3R w - - 0 13
```

**Accepted answer(s):** Bh6, Kb1, Bg5

**Explanation shown:** Bh6, Bg5 and Kb1 each score within 25 centipawns of the engine's top move at depth 16.

Hints (in order):
1. Which white pieces can still improve their squares?
2. The dark-squared bishop and the king both have moves.
3. Bh6, Bg5 or Kb1.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] Bh6, Kb1 and Bg5 are within 25 cp of the engine's top move (depth 16).

### Step 41: item  (shown without telling the learner the topic: unlabeled test)

**Task `IODdragon-6`** (find_move, difficulty cue 3)

Black to move. Find one of the moves within 25 centipawns of the engine's top move (depth 16).

```
  1  R . . . R K . .
  2  . P . . Q P P P
  3  . . P . . N B .
  4  P . . P N . . .
  5  p B . n . . . .
  6  . p n . p . . .
  7  . b p p b . p p
  8  . k r . q r . .
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: 2rq1rk1/pp1bppb1/3p1np1/4n1Bp/3NP2P/1BN2P2/PPPQ2P1/2KR3R b - - 1 13
```

**Accepted answer(s):** Nc4, Re8, Rc5

**Explanation shown:** Nc4, Re8 and Rc5 each score within 25 centipawns of the engine's top move at depth 16.

Hints (in order):
1. Which black pieces can still change squares?
2. A knight, a rook on c8 and a rook on f8 each have a move.
3. Nc4, Re8 or Rc5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] Nc4, Re8 and Rc5 are within 25 cp of the engine's top move (depth 16).

### Step 42: item  (shown without telling the learner the topic: unlabeled test)

**Task `IODdragon-10`** (find_move, difficulty cue 3)

White to move. Find one of the moves within 40 centipawns of the engine's top move (depth 16).

```
  8  . . r q . r k .
  7  p p . b p p b p
  6  . . . p . n p .
  5  . . . . n . B .
  4  . . . N P . . .
  3  . . N . B P . .
  2  P P P Q . . P P
  1  . . . R . R K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 2rq1rk1/pp1bppbp/3p1np1/4n1B1/3NP3/2N1BP2/PPPQ2PP/3R1RK1 w - - 9 12
```

**Accepted answer(s):** b3, Qf2, Qe1, Bf2, Qc1

Feedback shown for wrong moves:
- g4: g4 is rated at least 100 centipawns worse than the best move here (depth 16).
- h4: h4 is rated at least 70 centipawns worse than the best move here (depth 16).

**Explanation shown:** Both kings are on the kingside, so this is not an opposite-wing position. b3, Qf2, Qe1, Bf2 and Qc1 each score within 40 centipawns of the engine's top move at depth 16. The plan moves g4 and h4 score at least 100 and at least 70 centipawns below the best move.

Hints (in order):
1. Where is each king?
2. Both kings are on the kingside, so the lesson's h-pawn plan is not the move here.
3. b3, Qf2, Qe1, Bf2 or Qc1.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] b3, Qf2, Qe1, Bf2 and Qc1 are within 40 cp of the engine's top move (depth 16).
- [king_wing] White's king is on the kingside.
- [king_wing] Black's king is on the kingside.
- [move_loses] g4 is at least 100 cp worse than the engine's best move (depth 16).
- [move_loses] h4 is at least 70 cp worse than the engine's best move (depth 16).

### Step 43: practice  (shown without telling the learner the topic: unlabeled test)

A drill of 9 tasks drawn from the bank by tag ['theme.dragon', 'od.l9final'] (9 tasks carry those tags). Not reproduced here; ask for a sample if you want one checked.

### Step 44: board

Caption: The summary board: every lever on one position (arrows only, no moves). White's levers start from white pieces: the h-pawn, the g-pawn and the bishop trade. Black's start from black pieces: the c-file, the knight jump, the central break and the stop on h5.

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

Drawn on the board: arrows h2-h4, g2-g4, e3-h6, c8-c3, e5-c4, d6-d5, h7-h5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [open_files] The c-file is half-open for Black and the d-file is half-open for White.
- [king_wing] White's king is on the queenside.
- [king_wing] Black's king is on the kingside.

## Chapter: Teach it back

### Step 45: card

**Teach it back.** Imagine a friend who knows how the pieces move and nothing else. You have five minutes and one board. Say four things: the idea of the opening in a sentence, when its plan works, an example position they could set up, and one warning about a typical mistake. [H] Writing for a beginner exposes gaps that a multiple-choice question hides; we cannot test that until Andrew's baseline exists.

### Step 46: reflect

Kind: expect

Prompt: Write your five-minute explanation in four short parts. No move lists: ideas and pieces.

- Field "The idea of the Dragon, in a sentence:" (free text)

- Field "When the plan works (and when it does not):" (free text)

- Field "An example a beginner could set up on a board:" (free text)

- Field "One warning, a typical mistake and who makes it:" (free text)

### Step 47: card

**One possible answer, not the only one.** 'Black puts a bishop on the long diagonal and castles short, then attacks on the queenside while White attacks the king. It works when the kings sit on opposite wings, so each side races; on the same wing the game is calmer [H]. Set up both kings on opposite wings, a black rook on a half-open file and the bishop on the long diagonal. Warning: if Black pushes pawns in front of its king, White trades the bishop and the dark squares fall.'

### Step 48: reflect

Kind: expect

Prompt: Now explain it to a friend who wants to play the black side, in two minutes.

- Field "My two-minute talk:" (free text)

### Step 49: card

**Self-check, no grading.** Read what you wrote. Did you say when the plan works and when it fails? Did you give an example a beginner could set up on a board, naming the pieces? Did you name one mistake and say who makes it? Did you keep to ideas rather than move lists? The app grades nothing: you are the judge, and the next step records your honest answer. Essentials: what the Dragon bishop does, why opposite-side castling makes a race, why stopping the h-pawn and striking with d5 matter.

### Step 50: reflect

Kind: confidence

Prompt: Tick your honest answer for each question.

- Field "I said when it works and when it fails:" with options: yes / not yet; no single correct answer (a guess or a self-report)

- Field "My example could be set up on a board:" with options: yes / not yet; no single correct answer (a guess or a self-report)

- Field "I named a mistake and who makes it:" with options: yes / not yet; no single correct answer (a guess or a self-report)

- Field "I used ideas, not move lists:" with options: yes / not yet; no single correct answer (a guess or a self-report)

### Step 51: card

**Recap.**
1. The Dragon trades a slow centre for a fianchetto and the c-file.
2. In the Yugoslav the kings usually sit on opposite wings: a race.
3. White's levers: the h-pawn, the g-pawn, the trade on the dark squares.
4. Black's counters: the c-file, a central break, knight jumps.
5. Ask: kings, files, break, speed.
6. Move order: the pawn that guards e4 comes before the queen move.
7. Same-wing kings: the fight shifts to squares and the c-file [H].
8. A plan fails by one feature.

### Step 52: practice

A drill of 6 tasks drawn from the bank by tag ['theme.dragon'] (171 tasks carry those tags). Not reproduced here; ask for a sample if you want one checked.

### Step 53: card

**Where next.** Open L-OD-NAJDORF-1 (Najdorf Sicilian: why a6, two structures, two plans) and L-POS-STRUCTURE-MAROCZY-1 and -2 (the Maroczy bind). [R] The Scheveningen and the Accelerated Dragon have no lesson yet.

## Chapter: Play it out

### Step 54: finale

Prompt: Optional: play on from the main Yugoslav position as the Dragon player against Maia or the engine, and look for the c-file, the knight jump and the central break.

The learner plays black from this position, using what the lesson taught.

```
  1  R . . . R . K .
  2  P P . . Q P P P
  3  . . P B . N B .
  4  . . . P N . . .
  5  . . . n . . . .
  6  . p n . p . . .
  7  p b p p b . p p
  8  . k r . q r . .
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: 2rq1rk1/pp1bppbp/3p1np1/4n3/3NP3/1BN1BP2/PPPQ2PP/1K1R3R b - - 10 12
```

### Step 55: card

**After your game as Black.** Look back for three things. Did the c-file, the knight jump or the central break appear, and did you have a reason before you played it? Did you count the race, kings and files, when White pushed the h-pawn? And when the opponent left the expected route, what did they change, and what did that take away from your plan? Write the answer in the reflection that follows.

### Step 56: finale

Prompt: Optional: now try the other side. Play White against the Dragon from the Yugoslav set-up, and see which plan you reach for.

The learner plays white from this position, using what the lesson taught.

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

White to move. Capitals = White, lower case = Black.
FEN: r1bq1rk1/pp2ppbp/2np1np1/8/3NP3/2N1BP2/PPPQ2PP/R3KB1R w KQ - 3 9
```

### Step 57: card

**After your game as White.** Ask what you were trying to do and whether the opening let you do it. Did you castle long and start the h-pawn, or hold back? Did you stop the central break, or allow it? When Black left the expected route, which piece did you check first? Compare this with your Black game: which side found its plan more easily? Note that the answer is yours, not a verdict on the opening.

### Step 58: reflect

Kind: confidence

Prompt: How confident are you that you could now teach the Dragon in five minutes, and which of the eight plan questions would you drill again?

- Field "Confidence:" with options: not yet / with notes / yes; no single correct answer (a guess or a self-report)

- Field "The plan question I would drill again (a number):" (free text)

---

## Reviewer scorecard

Fill in the file `content/review/L-OD-DRAGON-9.json` (a template is below). Scale 1 to 5 for each dimension: 1 = wrong or unusable, 3 = acceptable with edits, 5 = I would put my name to it as it stands.
Revision to review: `065e1a30`. If the lesson text changes after your review, your sign-off no longer applies and the lesson goes back to needs-human.

| Dimension | What to judge | Score |
|---|---|---|
| chess | every statement, line and explanation is correct; near-misses are really near-misses | |
| clarity | the explanation actually explains (mechanism, conditions), in plain words | |
| prerequisites | the lesson assumes only what the learner has met | |
| tasks | each task has one defensible answer and a fair explanation | |

```json
{
  "lesson": "L-OD-DRAGON-9",
  "revision": "065e1a30",
  "reviewer": "<your name>",
  "reviewer_role": "strong-player",
  "date": "YYYY-MM-DD",
  "scores": {"chess": 0, "clarity": 0, "prerequisites": 0, "tasks": 0},
  "comments": "<what to change, by step number>",
  "verdict": "approved"
}
```

`reviewer_role` is `strong-player` or `teacher`. `verdict` is `approved` or `changes-requested`. See docs/review-slice.md.
