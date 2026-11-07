# Review packet: L-HI-ENGINES-HUMANS-4

**Engines and humans 4: how people actually play and lose**

- Skill: GAME.HISTORY (D1); stage: exemplar; stated length: 35 minutes
- Steps: 57 (9 are tasks); revision: `30a806be`
- Review status now: needs-human

## What the lesson says the learner will be able to do

- Explains why a model trained on human games can predict human moves, and names one limit of the claim
- Tells the best move, the popular wrong move and the practical move apart in a position, with an engine check
- Counts the good replies a move leaves the opponent and says why that is not the same as the evaluation
- Names the kinds of error in his own games (piece left capturable, missed capture, quiet slip) and the phase where he makes most
- States what the January 2013 sample can show and cannot show (no clocks, depth 8, online play)

## Sources the author names (check that they are used fairly, in our own words)

- McIlroy-Young, Sen, Kleinberg, Anderson, 'Aligning Superhuman AI with Human Behavior: Chess as a Model System', KDD 2020, arXiv 2006.01855; abstract read on 30 Oct 2026 (no accuracy figures stated in the abstract) [S]
- Maia Chess project (CSSLab, University of Toronto) as described on the app's Play page; the Maia opponent option exists in this app [V]
- Own data: library/data/lichess_db_standard_rated_2013-01.pgn.zst (a month of online games, not master chess); counts and engine study by tools/analysis/hi_engines4/*.py; Stockfish 19 lite, depth 8 for the study, depth 16 for the shown positions; depth-limited numbers are evidence under recorded settings, not proofs [V]
- Positions: opening lines replayed with python-chess; other positions copied from the January 2013 games; all claims in this lesson are checked by tools/validate_lessons.py [V]
- Jacob Aagaard, Excelling at Chess Calculation (2004): serious errors often start when a key candidate is overlooked (paraphrase), docs/citable-views.md 10.7, via a reviewer's account [S]
- Capablanca on the leader who stops thinking (paraphrase), docs/citable-views.md 12.2 [V-sheet]; Kotov on time trouble (paraphrase), docs/citable-views.md 12.12 [S]
- Conjecture marked [H] or [I] in the text is ours; not tested [H]
- Not available: clock times per move (the 2013 file has none); app/public/masters/stats.json (top-level games 2500+) was not used for any number on these cards [V]
- Opening names (Polerio Defence, Fried Liver Attack) recalled, not checked in a source [R]; counts use one exact move order and exclude time forfeits and games under 20 moves [V]

## How to read this packet

Boards are drawn with capitals for White and lower case for Black, rank 8 at the top unless the board is shown from Black's side. Moves in a line are in standard notation. Statements marked [V] were machine-checked, [I] inference, [H] hypothesis, [S] secondary source, [R] recalled. Please judge the explanations, not only the moves: does each sentence tell the learner why?

---

### Step 1: board

Caption: Black to move after five moves of a well-known opening. Black can take the pawn back with the knight on f6, or send the other knight to a5. Which do most players choose, and which does the engine prefer? Decide first.

```
  8  r . b q k b . r
  7  p p p . . p p p
  6  . . n . . n . .
  5  . . . P p . N .
  4  . . B . . . . .
  3  . . . . . . . .
  2  P P P P . P P P
  1  R N B Q K . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: r1bqkb1r/ppp2ppp/2n2n2/3Pp1N1/2B5/8/PPPP1PPP/RNBQK2R b KQkq - 0 5
```

Drawn on the board: highlighted squares f6, c6, d5, a5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] The engine (depth 16) prefers the knight to a5.
- [move_loses] Taking the pawn back is at least 70 centipawns worse than the best move.

### Step 2: reflect

Kind: expect

Prompt: Before the numbers: out of every 100 Black players rated under 1500, how many took the pawn back on d5?

- Field "My guess (0 to 100):" (free text)

### Step 3: card

**Same position, three rating groups** [V]. In our January 2013 Lichess file (online games, not master chess), Black took the pawn back in 69 of 107 games under 1500, and in 71 of 128 between 1500 and 1899. At 1900 and up, 23 of 28 played the knight to a5; one took the pawn. The top group is small. [I] The capture looks like a free recapture: the choice of someone who looks one move ahead.

### Step 4: board

Caption: The popular move, and what it allows. White does not need the pawn; White offers a piece to pull Black's king out.

```
  8  r . b q k b . r
  7  p p p . . p p p
  6  . . n . . n . .
  5  . . . P p . N .
  4  . . B . . . . .
  3  . . . . . . . .
  2  P P P P . P P P
  1  R N B Q K . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: r1bqkb1r/ppp2ppp/2n2n2/3Pp1N1/2B5/8/PPPP1PPP/RNBQK2R b KQkq - 0 5
```

The line, with the sentence the learner sees at each move:
1. **5... Nxd5**: Black wins the pawn back: the choice of 69 of 107 players under 1500.
2. **6. Nxf7**: White offers the knight: if the king takes, it leaves its shelter.
3. **6... Kxf7**: The king takes. Later boards show that declining the knight is worse.
4. **7. Qf3+**: The queen checks and joins the attack at once.
5. **7... Ke6**: The king steps forward: the engine's choice.
6. **8. Nc3**: White adds another piece to the attack.

```
  8  r . b q . b . r
  7  p p p . . . p p
  6  . . n . k . . .
  5  . . . n p . . .
  4  . . B . . . . .
  3  . . N . . Q . .
  2  P P P P . P P P
  1  R . B . K . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r1bq1b1r/ppp3pp/2n1k3/3np3/2B5/2N2Q2/PPPP1PPP/R1B1K2R b KQ - 3 8
```

Drawn on the board: arrows f6-d5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [move_loses] Taking the pawn back is at least 70 centipawns worse than the best move.

### Step 5: board

Caption: The engine's move. Black does not take the pawn back at once; first the knight attacks the bishop.

```
  8  r . b q k b . r
  7  p p p . . p p p
  6  . . n . . n . .
  5  . . . P p . N .
  4  . . B . . . . .
  3  . . . . . . . .
  2  P P P P . P P P
  1  R N B Q K . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: r1bqkb1r/ppp2ppp/2n2n2/3Pp1N1/2B5/8/PPPP1PPP/RNBQK2R b KQkq - 0 5
```

The line, with the sentence the learner sees at each move:
1. **5... Na5**: The knight attacks the bishop on c4. It does not retake the pawn on d5, so Black will be a pawn down for a while.
2. **6. Bb5+**: White checks.
3. **6... c6**: Black blocks the check with a pawn.
4. **7. dxc6**: White takes.
5. **7... bxc6**: Black recaptures, opening the b-file.
6. **8. Be2**: The bishop retreats.
7. **8... h6**: The pawn asks the knight on g5 to leave.
8. **9. Nf3**: The knight goes back, and Black can push the central pawn.

```
  8  r . b q k b . r
  7  p . . . . p p .
  6  . . p . . n . p
  5  n . . . p . . .
  4  . . . . . . . .
  3  . . . . . N . .
  2  P P P P B P P P
  1  R N B Q K . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r1bqkb1r/p4pp1/2p2n1p/n3p3/8/5N2/PPPPBPPP/RNBQK2R b KQkq - 1 9
```

Drawn on the board: arrows c6-a5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] The engine (depth 16) prefers Na5.

### Step 6: card

**Count the material** [V]. After the check, the pawn trade on c6 and the recapture, Black has not retaken on d5, so Black is one pawn down. [R] The move 5...Na5 is the Polerio Defence. The line 5...Nxd5 6.Nxf7 is the Fried Liver Attack. Search either name to find the theory.

### Step 7: card

**What Black gets for the pawn** [I]. Quick development of the remaining pieces, an open b-file after the recapture on c6, and a later push of the central pawn that hits the white knight. The engine rates the result about level, which is why it prefers this to the quick recapture. Material alone does not decide a position.

### Step 8: board

Caption: After the knight move and the check, Black has two good replies. A position with several good moves is forgiving: a small slip costs little here.

```
  8  r . b q k b . r
  7  p p p . . p p p
  6  . . . . . n . .
  5  n B . P p . N .
  4  . . . . . . . .
  3  . . . . . . . .
  2  P P P P . P P P
  1  R N B Q K . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: r1bqkb1r/ppp2ppp/5n2/nB1Pp1N1/8/8/PPPP1PPP/RNBQK2R b KQkq - 2 6
```

Drawn on the board: highlighted squares b5, e8, c7, c8.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] Both c6 and Bd7 are within 40 centipawns of the best move.
- [move_loses] Nd7 is at least 100 centipawns worse than the best move.

### Step 9: card

**The question.** Engines show the best move. People choose by habit, by what looks safe, by what they saw last week. This lesson asks three things: what does a *human-like* player look like, how does practical play differ from perfect play, and where do club players actually lose games? At the end you name your own two most common kinds of error.

### Step 10: card

**Perfect versus practical.** *Objective* play asks what happens if both sides play perfectly. *Practical* play asks how hard the next move is to find and how likely an error is. [H] A move that is slightly worse on the engine scale but leaves the opponent exactly one good reply can be the better choice against a person. The engine does not count how hard a move is.

### Step 11: board

Caption: Black to move after the knight sacrifice. The engine says White is only about one pawn better, not winning. Count how many accurate moves Black needs in a row.

```
  8  r . b q k b . r
  7  p p p . . N p p
  6  . . n . . . . .
  5  . . . n p . . .
  4  . . B . . . . .
  3  . . . . . . . .
  2  P P P P . P P P
  1  R N B Q K . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: r1bqkb1r/ppp2Npp/2n5/3np3/2B5/8/PPPP1PPP/RNBQK2R b KQkq - 0 6
```

The line, with the sentence the learner sees at each move:
1. **6... Kxf7**: The engine's choice; other tries, such as the queen to h4, lose far more.
2. **7. Qf3+**: White's queen checks.
3. **7... Ke6**: The king must walk forward again.
4. **8. Nc3**: White brings another piece.
5. **8... Nb4**: Black attacks c2 and keeps the knight on d5 defended.
6. **9. Bb3**: The bishop retreats to b3 and still eyes d5.

```
  8  r . b q . b . r
  7  p p p . . . p p
  6  . . . . k . . .
  5  . . . n p . . .
  4  . n . . . . . .
  3  . B N . . Q . .
  2  P P P P . P P P
  1  R . B . K . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r1bq1b1r/ppp3pp/4k3/3np3/1n6/1BN2Q2/PPPP1PPP/R1B1K2R b KQ - 5 9
```

Drawn on the board: arrows f7-e6.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] Taking the knight is the engine's choice.
- [move_loses] Moving the queen to h4 instead is at least 250 centipawns worse.
- [eval_range] White's edge is modest: between +0.6 and +1.8 at depth 16.

### Step 12: board

Caption: Black in check. The engine prefers Ke6 by a wide margin: every other legal reply costs at least 1.6 pawns more. [I] The king on e6 defends the knight on d5, which the queen and bishop attack.

```
  8  r . b q . b . r
  7  p p p . . k p p
  6  . . n . . . . .
  5  . . . n p . . .
  4  . . B . . . . .
  3  . . . . . Q . .
  2  P P P P . P P P
  1  R N B . K . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: r1bq1b1r/ppp2kpp/2n5/3np3/2B5/5Q2/PPPP1PPP/RNB1K2R b KQ - 1 7
```

Drawn on the board: highlighted squares f7, e6, e8, f6.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] Ke6 is the engine's choice.
- [move_loses] Ke8 is at least 100 centipawns worse.
- [move_loses] Qf6 is at least 100 centipawns worse.

### Step 13: board

Caption: Black to move, the third accurate move in a row: king capture, king walk, and now this. The natural knight move to d4 is about a pawn worse. Ncb4 threatens a knight check on c2 that forks the king and the rook on a1 [V by line].

```
  8  r . b q . b . r
  7  p p p . . . p p
  6  . . n . k . . .
  5  . . . n p . . .
  4  . . B . . . . .
  3  . . N . . Q . .
  2  P P P P . P P P
  1  R . B . K . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: r1bq1b1r/ppp3pp/2n1k3/3np3/2B5/2N2Q2/PPPP1PPP/R1B1K2R b KQ - 3 8
```

Drawn on the board: highlighted squares c6, b4, d4.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] Ncb4 is the engine's choice.
- [move_loses] Nd4 is at least 80 centipawns worse.

### Step 14: reflect

Kind: expect

Prompt: [H] The sacrifice is worth about one pawn on the engine scale, yet it asks three exact moves of the defender. Our file does not show how often defenders found them, so this is a guess about people. Would you play it as White against a 1200 player? Against a 2200 player? Give a reason that is not the engine number.

- Field "Against 1200:" (free text)

- Field "Against 2200:" (free text)

### Step 15: board

Caption: White to move. Several moves are within 0.4 pawn of the best on the engine scale, among them a calm developing move and a pawn push that attacks the bishop on h5. Which one asks Black the harder question?

```
  8  r n . . k b . r
  7  p p . . . p p p
  6  . . p . p n . .
  5  q . . . . . . b
  4  . . B P . . . .
  3  . . N . . N . P
  2  P P P . . P P .
  1  R . B Q . R K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: rn2kb1r/pp3ppp/2p1pn2/q6b/2BP4/2N2N1P/PPP2PP1/R1BQ1RK1 w kq - 1 9
```

Drawn on the board: highlighted squares g2, g4, c1, d2, h5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] The pawn push and the developing move are both within 40 centipawns of the best move.
- [piece_on] Black's bishop stands on h5.

### Step 16: board

Caption: After the calm move, Black has many reasonable replies. At least four keep the balance, so a casual choice is fine.

```
  8  r n . . k b . r
  7  p p . . . p p p
  6  . . p . p n . .
  5  q . . . . . . b
  4  . . B P . . . .
  3  . . N . . N . P
  2  P P P B . P P .
  1  R . . Q . R K .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: rn2kb1r/pp3ppp/2p1pn2/q6b/2BP4/2N2N1P/PPPB1PP1/R2Q1RK1 b kq - 2 9
```

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] Four different replies are within 40 centipawns of the best.

### Step 17: board

Caption: After the pawn push, Black must find one reply. The two natural tries lose at least 1.0 and 1.5 pawns more. The bishop has to step back.

```
  8  r n . . k b . r
  7  p p . . . p p p
  6  . . p . p n . .
  5  q . . . . . . b
  4  . . B P . . P .
  3  . . N . . N . P
  2  P P P . . P . .
  1  R . B Q . R K .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: rn2kb1r/pp3ppp/2p1pn2/q6b/2BP2P1/2N2N1P/PPP2P2/R1BQ1RK1 b kq - 0 9
```

The line, with the sentence the learner sees at each move:
1. **9... Bg6**: The engine's move: the bishop keeps its diagonal and the balance.
2. **10. Re1**: White develops a rook.

```
  8  r n . . k b . r
  7  p p . . . p p p
  6  . . p . p n b .
  5  q . . . . . . .
  4  . . B P . . P .
  3  . . N . . N . P
  2  P P P . . P . .
  1  R . B Q R . K .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: rn2kb1r/pp3ppp/2p1pnb1/q7/2BP2P1/2N2N1P/PPP2P2/R1BQR1K1 b kq - 2 10
```

Drawn on the board: highlighted squares h5, g6.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] Bg6 is the engine's choice.
- [move_loses] b5 is at least 100 centipawns worse.
- [move_loses] Nxg4 is at least 150 centipawns worse.

### Step 18: contrast

Title: Two different questions, one structure

Prompt: These two positions differ in White's last move (bishop to d2, or the pawn push), so this is not a one-feature test. Predict first: in which can Black afford a careless move? Then check.

**The working board:**

**Task `IHI-LHIENGINESHUMANS4-3`** (find_move, difficulty cue 2)

Black to move. The bishop on h5 is attacked by a pawn. Find a safe reply.

```
  1  . K R . Q B . R
  2  . . P . . P P P
  3  P . N . . N . .
  4  . P . . P B . .
  5  b . . . . . . q
  6  . . n p . p . .
  7  p p p . . . p p
  8  r . b k . . n r
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: rn2kb1r/pp3ppp/2p1pn2/q6b/2BP2P1/2N2N1P/PPP2P2/R1BQ1RK1 b kq - 0 9
```

**Accepted answer(s):** Bg6

**Explanation shown:** Bg6 is the only reply within 100 centipawns of the best; b5 and Nxg4 cost much more.

Hints (in order):
1. List the squares the bishop can reach, then check what each allows.
2. Capturing on g4 loses material to a recapture.
3. The bishop retreats along its diagonal.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] Bg6 is the engine's choice at depth 16.
- [move_loses] b5 is at least 100 centipawns worse.
- [move_loses] Nxg4 is at least 150 centipawns worse.

**The failing board:**

**Task `IHI-LHIENGINESHUMANS4-4`** (find_move, difficulty cue 2)

Black to move. Name any one reply that keeps the position balanced.

```
  1  . K R . Q . . R
  2  . P P . B P P P
  3  P . N . . N . .
  4  . . . . P B . .
  5  b . . . . . . q
  6  . . n p . p . .
  7  p p p . . . p p
  8  r . b k . . n r
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: rn2kb1r/pp3ppp/2p1pn2/q6b/2BP4/2N2N1P/PPPB1PP1/R2Q1RK1 b kq - 2 9
```

**Accepted answer(s):** Qc7, Qd8, Nbd7, Bb4

**Explanation shown:** Four different replies are all within 40 centipawns of the best, so Black can afford a loose move here.

Hints (in order):
1. There is not just one answer.
2. Think about developing or moving the queen.
3. The knight on b8 or the queen can move.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] Four replies are within 40 centipawns of the best.

### Step 19: card

**Choosing a practical move** [H]. When two moves are within 0.4 pawn of each other on the engine scale (our threshold, not a law), count the replies that keep the balance after each. One reply means a real question. *Conditions:* both moves must be sound by the engine, the pawn push must not weaken your own king, and you must be able to meet the best defence. [H] Against a strong opponent the extra difficulty buys little.

### Step 20: card

**The Maia idea** [S]. McIlroy-Young, Sen, Kleinberg and Anderson (KDD 2020, arXiv 2006.01855) trained a network on online human games to predict the move a person would choose, not the best move. Their abstract says it predicts human moves much better than standard engines. As I recall, "human-like" means the model's top move matches the move played [R, not in the abstract]. The app's Maia covers 1100 to 1900 only [V: maia.ts].

### Step 21: board

Caption: A position from our data. Under 1500, 40 of 70 Black players played a knight to d4. The engine says this loses at least 3.5 pawns. Step the line.

```
  8  r . b q k b n r
  7  p p p p . p p p
  6  . . n . . . . .
  5  . . . P p . . .
  4  . . . . P . . .
  3  . . . . . . . .
  2  P P P . . P P P
  1  R N B Q K B N R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: r1bqkbnr/pppp1ppp/2n5/3Pp3/4P3/8/PPP2PPP/RNBQKBNR b KQkq - 0 3
```

The line, with the sentence the learner sees at each move:
1. **3... Nd4**: The knight lands on a central square: the choice of 40 of 70 players under 1500.
2. **4. c3**: A pawn attacks the knight.
3. **4... Qh4**: Black counterattacks with the queen.
4. **5. cxd4**: White takes the knight.
5. **5... Qxe4+**: Black takes a pawn with check, but has lost a knight for a pawn.
6. **6. Ne2**: White blocks the check with the knight.

```
  8  r . b . k b n r
  7  p p p p . p p p
  6  . . . . . . . .
  5  . . . P p . . .
  4  . . . P q . . .
  3  . . . . . . . .
  2  P P . . N P P P
  1  R N B Q K B . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r1b1kbnr/pppp1ppp/8/3Pp3/3Pq3/8/PP2NPPP/RNBQKB1R b KQkq - 1 6
```

Drawn on the board: arrows c6-d4; highlighted squares c6, d4, e7.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] Nce7 is the engine's choice.
- [move_loses] Nd4 is at least 350 centipawns worse than the best move.

### Step 22: board

Caption: The repair: the knight retreats to e7, a square no white pawn attacks, and the position stays playable.

```
  8  r . b q k b n r
  7  p p p p . p p p
  6  . . n . . . . .
  5  . . . P p . . .
  4  . . . . P . . .
  3  . . . . . . . .
  2  P P P . . P P P
  1  R N B Q K B N R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: r1bqkbnr/pppp1ppp/2n5/3Pp3/4P3/8/PPP2PPP/RNBQKBNR b KQkq - 0 3
```

The line, with the sentence the learner sees at each move:
1. **3... Nce7**: The knight goes to a square White's pawns do not attack.
2. **4. Nf3**: White develops.
3. **4... Ng6**: The knight comes back into play on the other side.

```
  8  r . b q k b n r
  7  p p p p . p p p
  6  . . . . . . n .
  5  . . . P p . . .
  4  . . . . P . . .
  3  . . . . . N . .
  2  P P P . . P P P
  1  R N B Q K B . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r1bqkbnr/pppp1ppp/6n1/3Pp3/4P3/5N2/PPP2PPP/RNBQKB1R w KQkq - 3 5
```

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] Nce7 is the engine's choice.

### Step 23: board

Caption: Another popular choice from our data: after an early queen move, 20 of 43 players under 1500 and 47 of 54 between 1500 and 1899 played the pawn to c6. [H] 87 percent in the stronger group looks like a few players repeating a habit; our file cannot tell. Step through what it allows.

```
  8  r n b . k b n r
  7  p p p p . p p p
  6  . . . . . q . .
  5  . . . . p . . .
  4  . . . . P . . .
  3  . . N . . N . .
  2  P P P P . P P P
  1  R . B Q K B . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: rnb1kbnr/pppp1ppp/5q2/4p3/4P3/2N2N2/PPPP1PPP/R1BQKB1R b KQkq - 3 3
```

The line, with the sentence the learner sees at each move:
1. **3... c6**: The pawn takes a square from the knight on b8.
2. **4. d4**: White strikes at the centre.
3. **4... exd4**: Black takes a pawn.
4. **5. Bg5**: The bishop attacks the queen and develops at once.
5. **5... Qd6**: The queen retreats.
6. **6. Nxd4**: White recaptures with a lead in development.

```
  8  r n b . k b n r
  7  p p . p . p p p
  6  . . p q . . . .
  5  . . . . . . B .
  4  . . . N P . . .
  3  . . N . . . . .
  2  P P P . . P P P
  1  R . . Q K B . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: rnb1kbnr/pp1p1ppp/2pq4/6B1/3NP3/2N5/PPP2PPP/R2QKB1R b KQkq - 0 6
```

Drawn on the board: highlighted squares b8, c6, c7.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] Nc6 is the engine's choice.
- [move_loses] c6 is at least 100 centipawns worse than the best move.

### Step 24: board

Caption: The engine's way: develop the knight first and let the queen move later.

```
  8  r n b . k b n r
  7  p p p p . p p p
  6  . . . . . q . .
  5  . . . . p . . .
  4  . . . . P . . .
  3  . . N . . N . .
  2  P P P P . P P P
  1  R . B Q K B . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: rnb1kbnr/pppp1ppp/5q2/4p3/4P3/2N2N2/PPPP1PPP/R1BQKB1R b KQkq - 3 3
```

The line, with the sentence the learner sees at each move:
1. **3... Nc6**: The knight takes its natural square.
2. **4. Nd5**: White attacks the queen with a knight.
3. **4... Qd8**: The queen steps back.
4. **5. d4**: White takes the centre.
5. **5... d6**: Black supports the e5 pawn.

```
  8  r . b q k b n r
  7  p p p . . p p p
  6  . . n p . . . .
  5  . . . N p . . .
  4  . . . P P . . .
  3  . . . . . N . .
  2  P P P . . P P P
  1  R . B Q K B . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r1bqkbnr/ppp2ppp/2np4/3Np3/3PP3/5N2/PPP2PPP/R1BQKB1R w KQkq - 0 6
```

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] Nc6 is the engine's choice.

### Step 25: card

**Why a human-like model can work** [I]. In the positions you stepped, a large share of players chose the same move: 69 of 107, 40 of 70, 47 of 54 [V]. If one move gets 60 percent, a model that only guesses that move is right 60 percent of the time. That is the pattern Maia learns. [H] Test it yourself: play the Maia opponent and see whether its mistakes match the popular ones.

### Step 26: card

**What a human-like opponent offers.** This app has one: on the Play page, choose the Maia opponent and a rating from 1100 to 1900. It picks a move from what players near that rating would choose (it can also be set to take the most likely move) [V: Play page]. The first use downloads about 18 MB [V: maia.ts]. [H] That may be better practice than a weakened engine, whose moves no person would pick.

### Step 27: reflect

Kind: expect

Prompt: [H] Play one game against the Maia opponent at your own level. Afterwards write one mistake it made that you recognise from human games.

- Field "A mistake that looked human:" (free text)

### Step 28: card

**How club players lose: the method** [V for the counts]. I took 600 games from the January 2013 Lichess file with both players rated 1000 to 1499, and 142 with both at 2000 or more. An engine rated each position at depth 8, a rough setting. An error is a drop of 200 centipawns or more. Only the first 50 moves; games under 20 moves and time forfeits left out; opening = first 10 moves; endgame = 30 points of pieces or fewer; lost positions (below -5) not counted.

### Step 29: reflect

Kind: expect

Prompt: Predict: in which phase do 1000 to 1499 players make the most errors per move: the opening, the middlegame or the endgame?

- Field "My prediction:" (free text)

### Step 30: card

**Errors per 1,000 moves, by phase** [V at depth 8, noisy]
Opening ▇▇▇ 60
Middlegame ▇▇▇▇▇▇▇▇ 156
Endgame ▇▇▇▇ 77
All phases: 104 for the 1000 to 1499 group (3,853 errors in 36,871 moves). The 2000-plus group: 46 (459 in 9,925): opening 7, middlegame 70, endgame 43. Only 142 games, so these swing more. Whether the middlegame lead holds at greater depth is untested.

### Step 31: card

**Kinds of error, 1000 to 1499** [V] (depth 8; rule-based labels, not hand-checked; they overlap)
Reply captures a piece ▇▇▇▇▇▇▇▇ 1,202
Quiet slip: all the rest ▇▇▇▇▇▇▇ 1,068
Best move was a capture or check ▇▇▇▇▇▇ 915
Reply captures a pawn ▇▇▇ 530
Allows mate ▇ 138
(3,853 errors, so 31, 28, 24, 14 and 4 percent, rounded.) Predict which fits your games best.

### Step 32: board

Caption: Pattern one, from a real game in our sample (both players under 1500): moving a piece that blocks a line. White to move. The two queens are on one diagonal with White's knight between them. Predict what happens if the knight moves.

```
  8  r . b . r . k .
  7  . p p . . p p .
  6  p . n . p . . p
  5  . . b . . q . .
  4  P . B . N . . .
  3  . . . . P N . .
  2  . . Q . . P P P
  1  . R . R . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: r1b1r1k1/1pp2pp1/p1n1p2p/2b2q2/P1B1N3/4PN2/2Q2PPP/1R1R2K1 w - - 2 21
```

The line, with the sentence the learner sees at each move:
1. **21. Ng3**: The knight attacks the queen, but it was blocking the line between the two queens.
2. **21... Qxc2**: Black takes the white queen: nothing defended it.

```
  8  r . b . r . k .
  7  . p p . . p p .
  6  p . n . p . . p
  5  . . b . . . . .
  4  P . B . . . . .
  3  . . . . P N N .
  2  . . q . . P P P
  1  . R . R . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r1b1r1k1/1pp2pp1/p1n1p2p/2b5/P1B5/4PNN1/2q2PPP/1R1R2K1 w - - 0 22
```

Drawn on the board: arrows f5-c2; highlighted squares e4, c2, f5, g3.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] Bd3 is the engine's choice.
- [move_loses] Ng3 is at least 700 centipawns worse than the best move.
- [loose_pieces] After Ng3 the queen on c2 is loose and White has no other loose piece.

### Step 33: board

Caption: The repair: Bd3 is the only move that keeps the balance (about +1.3 at depth 16; every other move is about 2 pawns worse). The bishop defends the knight and stands between the queens.

```
  8  r . b . r . k .
  7  . p p . . p p .
  6  p . n . p . . p
  5  . . b . . q . .
  4  P . B . N . . .
  3  . . . . P N . .
  2  . . Q . . P P P
  1  . R . R . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: r1b1r1k1/1pp2pp1/p1n1p2p/2b2q2/P1B1N3/4PN2/2Q2PPP/1R1R2K1 w - - 2 21
```

The line, with the sentence the learner sees at each move:
1. **21. Bd3**: The bishop defends the knight and stands between the queens.
2. **21... Be7**: Black retreats the bishop, the engine's main reply.
3. **22. Nd6**: The knight leaves the diagonal and opens the bishop's line to the black queen.
4. **22... Bxd6**: Black takes the knight.
5. **23. Bxf5**: The bishop takes the queen.
6. **23... exf5**: Black recaptures the bishop.

```
  8  r . b . r . k .
  7  . p p . . p p .
  6  p . n b . . . p
  5  . . . . . p . .
  4  P . . . . . . .
  3  . . . . P N . .
  2  . . Q . . P P P
  1  . R . R . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r1b1r1k1/1pp2pp1/p1nb3p/5p2/P7/4PN2/2Q2PPP/1R1R2K1 w - - 0 24
```

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] Bd3 is the engine's choice.
- [move_loses] Nh4, the next-best move, is at least 150 centipawns worse than Bd3.

### Step 34: card

**Why it happens** [I]. A piece that blocks a line is easy to forget. Before moving any piece, ask what it stands in front of. [S] Jacob Aagaard, as summarised by a reviewer of *Excelling at Chess Calculation* (2004), says serious errors often start when a key candidate move is overlooked. His point is the overlooked candidate; ours is the forgotten blocker, a related slip.

### Step 35: board

Caption: Pattern two, also from our sample: capturing with the wrong piece. White's queen has just checked on d7, and Black can take it two ways. The rook on d8 is defending the rook on f8. Predict which capture is wrong.

```
  8  . . k r . r . .
  7  p p p Q . . p p
  6  . . . . . . . .
  5  . . . . p . . .
  4  . P P . P . . .
  3  P . . P . . . P
  2  . N . . . . P .
  1  . . . . . R . K
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: 2kr1r2/pppQ2pp/8/4p3/1PP1P3/P2P3P/1N4P1/5R1K b - - 0 22
```

The line, with the sentence the learner sees at each move:
1. **22... Rxd7**: The rook takes, and the rook on f8 loses its defender.
2. **23. Rxf8+**: White takes the rook with check.
3. **23... Rd8**: Black blocks.
4. **24. Rxd8+**: White takes the second rook.
5. **24... Kxd8**: Black recaptures: both of Black's rooks are gone, for a queen and a rook.

```
  8  . . . k . . . .
  7  p p p . . . p p
  6  . . . . . . . .
  5  . . . . p . . .
  4  . P P . P . . .
  3  P . . P . . . P
  2  . N . . . . P .
  1  . . . . . . . K
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 3k4/ppp3pp/8/4p3/1PP1P3/P2P3P/1N4P1/7K w - - 0 25
```

Drawn on the board: arrows d8-d7, c8-d7; highlighted squares d7, d8, f8, c8.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] Kxd7 is the engine's choice.
- [move_loses] Rxd7 is at least 700 centipawns worse than the best move.
- [attackers] One black piece (the rook on d8) defends the rook on f8.
- [attackers] One white piece (the rook on f1) attacks the rook on f8.

### Step 36: board

Caption: The right capture. Same queen, same file, different piece. Before taking, ask what the capturing piece is doing now.

```
  8  . . k r . r . .
  7  p p p Q . . p p
  6  . . . . . . . .
  5  . . . . p . . .
  4  . P P . P . . .
  3  P . . P . . . P
  2  . N . . . . P .
  1  . . . . . R . K
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: 2kr1r2/pppQ2pp/8/4p3/1PP1P3/P2P3P/1N4P1/5R1K b - - 0 22
```

The line, with the sentence the learner sees at each move:
1. **22... Kxd7**: The king takes the queen, and the rook on d8 still defends the rook on f8.
2. **23. Rxf8**: White takes the rook on f8 anyway.
3. **23... Rxf8**: Black recaptures: Black has taken a queen and a rook for one rook.

```
  8  . . . . . r . .
  7  p p p k . . p p
  6  . . . . . . . .
  5  . . . . p . . .
  4  . P P . P . . .
  3  P . . P . . . P
  2  . N . . . . P .
  1  . . . . . . . K
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 5r2/pppk2pp/8/4p3/1PP1P3/P2P3P/1N4P1/7K w - - 0 24
```

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] Kxd7 is the engine's choice.

### Step 37: board

Caption: Pattern three, also from our sample: a won position, then one careless move. Black is far ahead and the engine agrees. The knight on b8 is attacked. Predict the natural move, then step what it allows. Qb7 looks natural: it defends the knight and attacks the rook.

```
  8  r n R . . . . .
  7  . . . . . k . p
  6  p . . . p . p .
  5  . . . . p . . .
  4  . . N p . . . .
  3  . . . P . . . .
  2  . . P K N P . .
  1  . . . . . . . q
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: rnR5/5k1p/p3p1p1/4p3/2Np4/3P4/2PKNP2/7q b - - 7 28
```

The line, with the sentence the learner sees at each move:
1. **28... Qb7**: The queen defends the attacked knight and attacks the rook.
2. **29. Nd6+**: A knight fork of the king and the queen.
3. **29... Kg7**: The king steps aside.
4. **30. Nxb7**: The knight takes the queen.

```
  8  r n R . . . . .
  7  . N . . . . k p
  6  p . . . p . p .
  5  . . . . p . . .
  4  . . . p . . . .
  3  . . . P . . . .
  2  . . P K N P . .
  1  . . . . . . . .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: rnR5/1N4kp/p3p1p1/4p3/3p4/3P4/2PKNP2/8 b - - 0 30
```

Drawn on the board: arrows h1-b7; highlighted squares b8, c8, b7, d6.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] Nd7, Ke7 and Qh2 are all within 110 centipawns of the best move.
- [move_loses] Qb7 is at least 900 centipawns worse than the best move.
- [eval_range] Before Qb7, Black stands at least +4 on the engine scale (White's view -4 or lower).

### Step 38: board

Caption: After the careless move: White to move. The knight check is the engine's move, and the evaluation has swung from Black far ahead to White far ahead.

```
  8  r n R . . . . .
  7  . q . . . k . p
  6  p . . . p . p .
  5  . . . . p . . .
  4  . . N p . . . .
  3  . . . P . . . .
  2  . . P K N P . .
  1  . . . . . . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: rnR5/1q3k1p/p3p1p1/4p3/2Np4/3P4/2PKNP2/8 w - - 8 29
```

Drawn on the board: highlighted squares c4, d6, b7, f7.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] Nd6+ is the engine's choice.
- [eval_range] After Qb7 White stands at least +2 on the engine scale.

### Step 39: board

Caption: The repair. Before you move, list every check and capture White has: the knight on c4 can check on d6. That makes a queen on b7 unsafe, and the knight on b8 must still be saved. Step the safe move.

```
  8  r n R . . . . .
  7  . . . . . k . p
  6  p . . . p . p .
  5  . . . . p . . .
  4  . . N p . . . .
  3  . . . P . . . .
  2  . . P K N P . .
  1  . . . . . . . q
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: rnR5/5k1p/p3p1p1/4p3/2Np4/3P4/2PKNP2/7q b - - 7 28
```

The line, with the sentence the learner sees at each move:
1. **28... Nd7**: The knight leaves the attack and no white check wins anything.

```
  8  r . R . . . . .
  7  . . . n . k . p
  6  p . . . p . p .
  5  . . . . p . . .
  4  . . N p . . . .
  3  . . . P . . . .
  2  . . P K N P . .
  1  . . . . . . . q
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r1R5/3n1k1p/p3p1p1/4p3/2Np4/3P4/2PKNP2/7q w - - 8 29
```

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] Nd7 is within 110 centipawns of the best move.

### Step 40: card

**Winning positions lose too** [V]. After one of its own moves, a side stood at +3 or better 849 times (counted per side per game) in the 1000 to 1499 sample: it won 575 (68 percent), drew 36, lost 238. At 2000 and up the same figure is 129 of 163 (79 percent). Depth 8 is noisy, so some of these +3 scores are false. In 567 of the 600 games one side made a 300-centipawn error first; that side lost 360 times (63 percent).

### Step 41: card

**The leader drifts** [S]. Capablanca's Havana example in his book (sections 27 and 28) shows a side ahead drifting into inaccurate moves [V-sheet]. The habit that helps: when ahead, keep asking what the opponent threatens, as you did when behind.

### Step 42: item  (shown without telling the learner the topic: unlabeled test)

**Task `IHI-LHIENGINESHUMANS4-5`** (classify_position, difficulty cue 3)

Black just chose Nc6 here. What kind of mistake is it?

```
  1  . K . . . R . .
  2  P P P Q B . . q
  3  . . N . . . . .
  4  . . . . P . . .
  5  . . . p . . . .
  6  . . . b p . . .
  7  p p p . . . . p
  8  r . . k . . n .
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: 1n2k2r/p4ppp/3pb3/4p3/3P4/5N2/q2BQPPP/2R3K1 b k - 0 17
```

**Accepted answer:** {"class": "left a piece loose"}

**Explanation shown:** After Nc6, a piece is left attacked and undefended, and the move loses at least 250 centipawns.

Hints (in order):
1. Look at the knight you just moved: who attacks it, and who defends it?
2. Count attackers and defenders of the piece on c6.
3. The moved piece is attacked and has no defender.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [loose_pieces] After Nc6 the black loose pieces are exactly these.
- [move_loses] Nc6 is at least 250 centipawns worse than the best move.

### Step 43: item  (shown without telling the learner the topic: unlabeled test)

**Task `IHI-LHIENGINESHUMANS4-6`** (classify_position, difficulty cue 3)

White just chose b3 here. What kind of mistake is it?

```
  8  r . . . k b . r
  7  p p p . . p p .
  6  . . n . . n . p
  5  . . . . . . . .
  4  . . . q . . . .
  3  . . . . . . P B
  2  P P . P . P . P
  1  R N B Q . R K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: r3kb1r/ppp2pp1/2n2n1p/8/3q4/6PB/PP1P1P1P/RNBQ1RK1 w kq - 0 10
```

**Accepted answer:** {"class": "left a piece loose"}

**Explanation shown:** After b3, the rook on a1 is attacked and undefended, and the move loses at least 250 centipawns.

Hints (in order):
1. Look at what is attacked after the move.
2. Which piece lost its protection when the pawn left b2?
3. The rook on a1 is attacked and undefended.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [loose_pieces] After b3 the white loose pieces are exactly these.
- [move_loses] b3 is at least 250 centipawns worse than the best move.

### Step 44: item  (shown without telling the learner the topic: unlabeled test)

**Task `IHI-LHIENGINESHUMANS4-7`** (classify_position, difficulty cue 3)

Black just chose Qe7 here. What kind of mistake is it?

```
  1  . . . . R K . .
  2  . P P . . . P P
  3  . . Q . P P . N
  4  . . . P . . . .
  5  R r . p . . p .
  6  . . . p p n . p
  7  . . . . . p . .
  8  . . . k q . . r
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: r2qk3/2p5/p1npp3/1p2p1rR/4P3/N1PP1Q2/PP3PP1/2KR4 b q - 0 19
```

**Accepted answer:** {"class": "missed a better capture or check"}

**Explanation shown:** After Qe7 nothing is left loose, but the engine's best move is a capture on h5 (the best of a bad set), and Qe7 loses at least 250 centipawns.

Hints (in order):
1. Is any enemy piece capturable right now?
2. Look at what the piece on g5 can take.
3. The best move is a capture on h5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [loose_pieces] After Qe7 the black loose pieces are exactly these.
- [move_loses] Qe7 is at least 250 centipawns worse than the best move.
- [best_move_in] The engine's choice is a capture.
- [piece_on] The best move's target square holds an enemy piece (a capture).

### Step 45: item  (shown without telling the learner the topic: unlabeled test)

**Task `IHI-LHIENGINESHUMANS4-8`** (classify_position, difficulty cue 3)

Black just chose Nc6 here. What kind of mistake is it?

```
  1  R . B K R . . .
  2  P P P . . . P P
  3  . . N . . . . .
  4  . . . . . P . .
  5  . . p . p . . .
  6  . . . b . . . .
  7  p p . . . . p p
  8  r . . . k . n r
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: rn1k3r/pp4pp/4b3/3p1p2/2P5/5N2/PP3PPP/3RKB1R b - - 0 14
```

**Accepted answer:** {"class": "quiet slip"}

**Explanation shown:** After Nc6 nothing is left loose and the engine's best move is quiet, but the move still loses at least 250 centipawns.

Hints (in order):
1. Nothing is left loose after the move. Look for a better move.
2. What could the rook on h8 do instead?
3. The best move is quiet: a rook move to e8.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [loose_pieces] After Nc6 the black loose pieces are exactly these.
- [move_loses] Nc6 is at least 250 centipawns worse than the best move.
- [best_move_in] The engine's choice is a quiet move.
- [piece_on] The best move's target square holds nothing (a quiet move).

### Step 46: card

**Time pressure: what the data cannot say.** The 2013 file records the time control, not the clock on each move [V]. Fast games (3 minutes or less per side, estimated as the clock plus 40 moves of increment) against slow ones (8 minutes or more): 102 against 106 errors per 1,000 moves. Time forfeits are not in the sample. [H] Time pressure probably matters, but a game-level label cannot show it. [S via Wikipedia, original unread] Kotov described a calculation trap: too many lines, then too little time.

### Step 47: reflect

Kind: unsure

Prompt: [H] Open Games review on your last five games. For each, write the clock at the first big error, the moves left, and the phase. Which pattern do you see? If you do not know the clock, record it from now on.

- Field "Clock at first big error (five games):" (free text)

- Field "Phase and moves left:" (free text)

### Step 48: item  (shown without telling the learner the topic: unlabeled test)

**Task `IHI-LHIENGINESHUMANS4-1`** (find_move, difficulty cue 3)

Black to move. In our data 14 of 27 players under 1500 jumped the knight to b4 here, and 13 chose another square. Find a good square for the attacked knight.

```
  1  R N B K Q B . R
  2  P P P P . . P P
  3  . . . . . N . .
  4  . . . . . p . .
  5  . . . . P . . .
  6  . . . . . n . .
  7  p p p p . p p p
  8  r n b k q b . r
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: r1bqkbnr/ppp1pppp/2n5/3P4/2p5/2N5/PP2PPPP/R1BQKBNR b KQkq - 0 4
```

**Accepted answer(s):** Nb8, Ne5

Feedback shown for wrong moves:
- Nb4: The knight steps to a square where a queen check wins time and material. Chosen by 14 of 27 players under 1500 in our data [V].

**Explanation shown:** Nb4 meets a queen check and loses material; the retreat or the jump to e5 keeps the balance.

Hints (in order):
1. The knight on c6 is attacked by a pawn.
2. After Nb4, White has a queen check that attacks the knight too.
3. Retreat to b8 or jump to e5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] Nb8 and Ne5 are within 40 centipawns of the best move.
- [move_loses] Nb4 is at least 250 centipawns worse.

### Step 49: item  (shown without telling the learner the topic: unlabeled test)

**Task `IHI-LHIENGINESHUMANS4-2`** (find_move, difficulty cue 3)

Black to move. Queen on e6, White's pieces developing. In our data 18 of 44 players under 1500 moved the queen to g6. Find a good move (several work).

```
  1  R . . K Q B . R
  2  P P P B P P P P
  3  . . N . . N . .
  4  . . . . . . . .
  5  . . . . . . . .
  6  . . . q . n . .
  7  p p p p . p p p
  8  r n b k . b . r
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: r1b1kbnr/ppp1pppp/2n1q3/8/8/2N2N2/PPPPBPPP/R1BQK2R b KQkq - 5 5
```

**Accepted answer(s):** Qd7, Nf6, Qd6

Feedback shown for wrong moves:
- Qg6: The queen goes to a square where a knight jump to b5 creates threats. Chosen by 18 of 44 players under 1500 in our data [V].

**Explanation shown:** Qd7, Nf6 and Qd6 are close in value. Qg6 loses at least 100 centipawns, because a knight jump to b5 makes threats.

Hints (in order):
1. Which squares can White's knight and pawns attack next?
2. Think about what White's knight can do from b5.
3. Retreat the queen to d7, or develop the knight.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] Qd7, Nf6 and Qd6 are within 40 centipawns of the best move.
- [move_loses] Qg6 is at least 100 centipawns worse.

### Step 50: item  (shown without telling the learner the topic: unlabeled test)

**Task `IHI-LHIENGINESHUMANS4-12`** (find_move, difficulty cue 3)

Black to move after 1.e4 e5 2.Nf3 f6 (a pawn move) 3.Nc3. In our data the pawn to c6 was the most common choice under 1500 (14 of 42). Find the engine's choice.

```
  1  R . B K Q B . R
  2  P P P . P P P P
  3  . . N . . N . .
  4  . . . P . . . .
  5  . . . p . . . .
  6  . . p . . . . .
  7  p p . . p p p p
  8  r n b k q b n r
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: rnbqkbnr/pppp2pp/5p2/4p3/4P3/2N2N2/PPPP1PPP/R1BQKB1R b KQkq - 1 3
```

**Accepted answer(s):** Nc6

Feedback shown for wrong moves:
- c6: The pawn takes the knight's natural square and leaves e5 weak. Chosen by 14 of 42 players under 1500 in our data [V].

**Explanation shown:** c6 loses at least 60 centipawns and allows a strong knight capture on e5; Nc6 defends the pawn.

Hints (in order):
1. Which piece can defend the e5 pawn?
2. The pawn on c7 blocks the knight's best square.
3. Develop the knight to c6.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] Nc6 is the engine's choice.
- [move_loses] c6 is at least 60 centipawns worse.

### Step 51: practice  (shown without telling the learner the topic: unlabeled test)

A drill of 6 tasks drawn from the bank by tag ['node.SAF.THREAT', 'cue.3', 'kind.game'] (142 tasks carry those tags). Not reproduced here; ask for a sample if you want one checked.

### Step 52: card

**Common mistakes about engines and your errors.** First: believing every red mark means you are bad at chess. [I] Most players have two or three recurring error types, and a long list of flagged moves hides them. Second: ignoring the errors that repeat and studying the one-off blunders. [H] Fixing the top two repeating types probably gains more than learning a new opening. Test it: after ten games, count the kinds again in Games review.

### Step 53: reflect

Kind: expect

Prompt: Teach it back. Open Games review on your last five games, count the errors by the kinds on the cards, and write your top two. For each: where it happens, what you looked at, what you missed.

- Field "Error type 1 and a position where it happens:" (free text)

- Field "Error type 2 and a position where it happens:" (free text)

- Field "One question I will ask before each move:" (free text)

### Step 54: reflect

Kind: expect

Prompt: Teach it back, second part. In three sentences, explain to a friend why the most popular move is sometimes not the best move. Then compare with the model answer on the next card.

- Field "My three sentences:" (free text)

### Step 55: card

**Model answer** [I]. The popular move is what many people see first, often a quick recapture or a natural developing move. The best move comes from looking deeper, where the natural move can hide a sacrifice or a fork. So popular tells you what people see; best tells you what holds up.

### Step 56: card

**Self-check, then recap.** Did you name the phase where you lose most, separate a piece left capturable from a quiet slip, give a position for each, and write one question for every move?
**Remember:** players of different strength choose differently [V]; difficulty matters [H]; errors repeat by kind [I]; the middlegame holds most errors [V at depth 8, noisy]; winning positions get lost [V]; review the first big error.

### Step 57: reflect

Kind: confidence

Prompt: Which line of the recap changes what you will do in your next game? Write the one change.

- Field "My one change:" (free text)

---

## Reviewer scorecard

Fill in the file `content/review/L-HI-ENGINES-HUMANS-4.json` (a template is below). Scale 1 to 5 for each dimension: 1 = wrong or unusable, 3 = acceptable with edits, 5 = I would put my name to it as it stands.
Revision to review: `30a806be`. If the lesson text changes after your review, your sign-off no longer applies and the lesson goes back to needs-human.

| Dimension | What to judge | Score |
|---|---|---|
| chess | every statement, line and explanation is correct; near-misses are really near-misses | |
| clarity | the explanation actually explains (mechanism, conditions), in plain words | |
| prerequisites | the lesson assumes only what the learner has met | |
| tasks | each task has one defensible answer and a fair explanation | |

```json
{
  "lesson": "L-HI-ENGINES-HUMANS-4",
  "revision": "30a806be",
  "reviewer": "<your name>",
  "reviewer_role": "strong-player",
  "date": "YYYY-MM-DD",
  "scores": {"chess": 0, "clarity": 0, "prerequisites": 0, "tasks": 0},
  "comments": "<what to change, by step number>",
  "verdict": "approved"
}
```

`reviewer_role` is `strong-player` or `teacher`. `verdict` is `approved` or `changes-requested`. See docs/review-slice.md.
