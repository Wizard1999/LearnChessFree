# Review packet: L-HI-ENGINES-HUMANS-5

**Engines and humans 5: top players, centaurs and your own habits**

- Skill: GAME.HISTORY (D1); stage: exemplar; stated length: 30 minutes
- Steps: 57 (9 are tasks); revision: `a4956368`
- Review status now: needs-human

## What the lesson says the learner will be able to do

- Explains how preparation, advanced chess, freestyle and correspondence chess use engines, naming the source for each fact
- Reads a Berlin endgame structure and says why the position limits attacks
- Chooses between equal engine moves by asking what plan each starts, and says what to do when the opponent leaves the prepared line
- Shows a fortress where material misleads, using a tablebase result
- Writes a plan for their own engine habits with five specific choices

## Sources the author names (check that they are used fairly, in our own words)

- app/public/masters/stats.json: 329,379 top-level games (both players 2500+), built 2026-10-29; counts of the Berlin Defence line quoted exactly from the tree [V]
- Wikipedia 'Advanced chess' (first Advanced Chess match, Kasparov v Topalov, Leon, June 1998, 3-3; the 2004 freestyle origin is recalled from the page and marked to confirm) [S/R]
- Wikipedia 'Correspondence chess' (the ICCF allows engines and tablebases, including in the World Championship; high draw rates) [S]
- Wikipedia 'Berlin Defence' (Kramnik played it four times against Kasparov in 2000, all drawn; recalled and not rechecked this session, so labelled [R]; the claim that Kasparov cited Kramnik's preparation was removed) [R]
- Kasparov, 'The Chess Master and the Computer', New York Review of Books, 11 Feb 2010: known only through a page summary, not the full essay; the lesson labels its use [R] and quotes nothing
- docs/citable-views.md entries 10.13 (Silman, via Wikipedia and a chess.com article) and 10.7 (Aagaard, via a chess.com blog review): the books were not read here [S]
- docs/council-synthesis.md CD-15 and docs/running-and-deploying.md (Maia: human-like network trained on Lichess games; optional opponent in the Play page) [V]
- content/items/lesson-hi-l-hi-engines-humans-5.json: positions replayed with python-chess; engine claims Stockfish 19 lite, depth 16 (evidence under recorded limits, not proof); tablebase claims from the Lichess tablebase
- The Opera Game moves are recalled [R] and legality-checked; venue and date are recalled, not checked against a PGN [R]
- Conjecture is labelled [H] or [I] in the text and is not a claim about what any named person believed
- Closed King's Indian plan split (White queenside, Black kingside) is widely taught; recalled, no named book checked [R]

## How to read this packet

Boards are drawn with capitals for White and lower case for Black, rank 8 at the top unless the board is shown from Black's side. Moves in a line are in standard notation. Statements marked [V] were machine-checked, [I] inference, [H] hypothesis, [S] secondary source, [R] recalled. Please judge the explanations, not only the moves: does each sentence tell the learner why?

---

### Step 1: board

Caption: Ten more plies of a line that appears in our top-level games [V]. Whether the players recalled it or worked it out over the board is not in the data [I: at this frequency most were probably prepared]. Step through and watch the moment the queens leave.

```
  8  r . b q k b . r
  7  p p p p . p p p
  6  . . n . . n . .
  5  . B . . p . . .
  4  . . . . P . . .
  3  . . . . . N . .
  2  P P P P . P P P
  1  R N B Q K . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: r1bqkb1r/pppp1ppp/2n2n2/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4
```

The line, with the sentence the learner sees at each move:
1. **4. O-O**: White castles: the king is safe and the rook is ready for the e-file.
2. **4... Nxe4**: Black takes the e-pawn and accepts an open game.
3. **5. d4**: White strikes at the centre and opens lines.
4. **5... Nd6**: The knight retreats to d6, from where it attacks the bishop.
5. **6. Bxc6**: The bishop takes the knight so that Black's pawns will be doubled.
6. **6... dxc6**: Black recaptures with the d-pawn; the c-pawns are now doubled.
7. **7. dxe5**: The pawn takes on e5 and attacks the knight on d6.
8. **7... Nf5**: The knight steps away to f5 and eyes the squares d4 and e3.
9. **8. Qxd8+**: The queens face each other on the open d-file, so White trades them with check.
10. **8... Kxd8**: Only the king can recapture: Black's king stays in the middle, but the queens are gone.

```
  8  r . b k . b . r
  7  p p p . . p p p
  6  . . p . . . . .
  5  . . . . P n . .
  4  . . . . . . . .
  3  . . . . . N . .
  2  P P P . . P P P
  1  R N B . . R K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r1bk1b1r/ppp2ppp/2p5/4Pn2/8/5N2/PPP2PPP/RNB2RK1 w - - 0 9
```

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [eval_range] At depth 16 the starting position is between -0.1 and +0.6 pawns of level (measured about +0.4).
- [best_move_in] At depth 16 the engine's best move is castling or the quiet pawn move d3, within 40 centipawns.

### Step 2: reflect

Kind: expect

Prompt: Before the numbers: in our database of top-level games (329,379 games, both players rated 2500 or more), take the position after Black's third move, the knight to f6, in this Ruy Lopez. What share of the games that reached it went all the way to the queenless position at the end of the line? Guess, and say how sure you are.

- Field "My guess (such as one in ten) and my confidence:" (free text)

### Step 3: card

**What the data says [V].** Of 4,911 games in which White castled on move four, 4,874 saw Black take the e-pawn. Then 2,263 pushed the d-pawn, 2,240 reached the knight retreat, 1,270 took on c6, and 1,243 reached the queenless position: about one in four of the castling games. Several later moves are forced recaptures, so repeating a line does not prove preparation [I]; that strong players chose it so often suggests it [H]. What is left for a human to decide?

### Step 4: board

Caption: The end of the line. Read the structure: doubled pawns, bishops, and who has more pawns on which wing.

```
  8  r . b k . b . r
  7  p p p . . p p p
  6  . . p . . . . .
  5  . . . . P n . .
  4  . . . . . . . .
  3  . . . . . N . .
  2  P P P . . P P P
  1  R N B . . R K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: r1bk1b1r/ppp2ppp/2p5/4Pn2/8/5N2/PPP2PPP/RNB2RK1 w - - 0 9
```

Drawn on the board: arrows f8-e7; highlighted squares e5, f2, g2, h2.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [pawn_set] Black's c-pawns are doubled.
- [bishop_pair] Only Black has the bishop pair.
- [pawn_set] White has four pawns against three on the kingside.
- [eval_range] At depth 16 the position is within a quarter of a pawn of level (measured about +0.1).

### Step 5: item

**Task `IHI-LHIENGINESHUMANS5-1`** (select_squares, difficulty cue 1)

Tap every doubled black pawn.

```
  8  r . b k . b . r
  7  p p p . . p p p
  6  . . p . . . . .
  5  . . . . P n . .
  4  . . . . . . . .
  3  . . . . . N . .
  2  P P P . . P P P
  1  R N B . . R K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: r1bk1b1r/ppp2ppp/2p5/4Pn2/8/5N2/PPP2PPP/RNB2RK1 w - - 0 9
```

**Accepted answer:** squares c6, c7

**Explanation shown:** Black's c-pawns stand on c6 and c7, two pawns on one file. That is the price Black pays for the open lines and the bishop pair.

Hints (in order):
1. Look at the files, not the ranks.
2. Two pawns of one colour stand on the same file.
3. It is the c-file.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [pawn_set] The black pawns on c6 and c7 are doubled.

### Step 6: item

**Task `IHI-LHIENGINESHUMANS5-2`** (classify_position, difficulty cue 1)

Which side owns the bishop pair here?

```
  8  r . b k . b . r
  7  p p p . . p p p
  6  . . p . . . . .
  5  . . . . P n . .
  4  . . . . . . . .
  3  . . . . . N . .
  2  P P P . . P P P
  1  R N B . . R K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: r1bk1b1r/ppp2ppp/2p5/4Pn2/8/5N2/PPP2PPP/RNB2RK1 w - - 0 9
```

**Accepted answer:** {"class": "Black"}

**Explanation shown:** White exchanged a bishop for a knight earlier in the line, so only Black keeps two bishops.

Hints (in order):
1. Count the bishops each side still has.
2. White gave up a bishop earlier in the line.
3. Black still has both.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [bishop_pair] Only Black owns a light-squared and a dark-squared bishop.

### Step 7: card

**The wall.** With the queens off, nobody has a direct mating attack on Black's king, and White's four-against-three kingside majority needs many moves to create a passed pawn [I]. Black's bishop pair is a lasting asset [I], and the engine rates the position as level [V]. The setup is nicknamed the Berlin Wall [R]. Wikipedia's page on the Berlin Defence says Kramnik played it in four games of his 2000 match with Kasparov, all drawn [R: recalled, not rechecked here].

### Step 8: board

Caption: White tries to build an attack. These eight plies are the engine's choice at depth 16 [V]; the score stays within about 0.1 of level. Step through.

```
  8  r . b k . b . r
  7  p p p . . p p p
  6  . . p . . . . .
  5  . . . . P n . .
  4  . . . . . . . .
  3  . . . . . N . .
  2  P P P . . P P P
  1  R N B . . R K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: r1bk1b1r/ppp2ppp/2p5/4Pn2/8/5N2/PPP2PPP/RNB2RK1 w - - 0 9
```

The line, with the sentence the learner sees at each move:
1. **9. Nc3**: The knight develops towards the centre and heads for the d-file squares.
2. **9... Ke8**: Black's king steps off the d-file before a rook arrives.
3. **10. h3**: White gives its own king a flight square before starting the kingside plan.
4. **10... a5**: Black gains queenside space; the pawn also stops a white pawn reaching b4 [I].
5. **11. Rd1**: The rook takes the open d-file.
6. **11... h6**: Black gives its king a flight square and stops a knight jump to g5.
7. **12. a4**: White fixes the pawn on a5 and keeps the queenside closed.
8. **12... Be7**: The bishop steps out: Black's pieces are coordinated and the king is safe.

```
  8  r . b . k . . r
  7  . p p . b p p .
  6  . . p . . . . p
  5  p . . . P n . .
  4  P . . . . . . .
  3  . . N . . N . P
  2  . P P . . P P .
  1  R . B R . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r1b1k2r/1pp1bpp1/2p4p/p3Pn2/P7/2N2N1P/1PP2PP1/R1BR2K1 w - - 1 13
```

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] At depth 16 the engine's best move is one of Nc3, Rd1, a4, h3, all within 40 centipawns.
- [eval_range] At depth 16 the position is within 0.4 pawns of level.

### Step 9: board

Caption: A second plausible start: a4 is within 40 centipawns of the best move at depth 16 [V], but the continuation is ours, not the engine's. The score stays near level and no weakness appears [I].

```
  8  r . b k . b . r
  7  p p p . . p p p
  6  . . p . . . . .
  5  . . . . P n . .
  4  . . . . . . . .
  3  . . . . . N . .
  2  P P P . . P P P
  1  R N B . . R K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: r1bk1b1r/ppp2ppp/2p5/4Pn2/8/5N2/PPP2PPP/RNB2RK1 w - - 0 9
```

The line, with the sentence the learner sees at each move:
1. **9. a4**: The pawn stops Black's queenside pawns from advancing freely.
2. **9... a5**: Black fixes the pawn and keeps it from being attacked.
3. **10. Rd1+**: The rook checks along the open file.
4. **10... Ke8**: The king steps aside.
5. **11. Nc3**: The knight develops.
6. **11... Be6**: Black develops the bishop to a square where it also watches c4.
7. **12. Ng5**: The knight jumps at the bishop and threatens a trade.
8. **12... Bc8**: The bishop retreats and stays safe.
9. **13. Nge4**: The knight lands on a central square.
10. **13... h6**: Black makes a flight square for the king.

```
  8  r . b . k b . r
  7  . p p . . p p .
  6  . . p . . . . p
  5  p . . . P n . .
  4  P . . . N . . .
  3  . . N . . . . .
  2  . P P . . P P P
  1  R . B R . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r1b1kb1r/1pp2pp1/2p4p/p3Pn2/P3N3/2N5/1PP2PPP/R1BR2K1 w - - 0 14
```

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] At depth 16 the engine's best move is one of Nc3, Rd1, a4, h3, all within 40 centipawns.

### Step 10: reflect

Kind: expect

Prompt: [I] A player memorises this whole line because an engine says it is level. Name one thing that can still go wrong for them in the game, even though the line is fine.

- Field "What can still go wrong:" (free text)

- Field "What knowledge would help me then:" (free text)

### Step 11: item

**Task `IHI-LHIENGINESHUMANS5-10`** (find_move, difficulty cue 1)

Black to move; the knight on d6 is attacked. Which retreat stays in the prepared line?

```
  1  . K R . Q B N R
  2  P P P . . P P P
  3  . . N . . . . .
  4  . . . . . . . .
  5  . . . P . . . .
  6  . . . . n p . .
  7  p p p . . p p p
  8  r . b k q b . r
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: r1bqkb1r/ppp2ppp/2pn4/4P3/8/5N2/PPP2PPP/RNBQ1RK1 b kq - 0 7
```

**Accepted answer(s):** Nf5

Feedback shown for wrong moves:
- Ne4: The rare move: memory has nothing to say here and the engine rates it at least 30 centipawns lower at depth 16.

**Explanation shown:** Black's knight steps to f5; 1,258 of 1,269 top-level games chose it [V]. The other retreat, to e4, was played only 11 times, and the engine rates it worse by roughly half a pawn at depth 16.

Hints (in order):
1. The knight must keep an eye on d4 and e3.
2. Which square is on the edge of the white pawn's reach?
3. It goes to f5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] At depth 16 the knight retreat to f5 is the engine's best move.
- [move_loses] The other knight retreat, to e4, is rated at least 30 centipawns lower at depth 16.

### Step 12: board

Caption: The opponent leaves the path: a rare knight move (11 of 1,269 replies in our data [V]). Now memory has nothing to say. At depth 16 the engine prefers the queen move by about a third of a pawn (about half a pawn at depth 20) [V]; the first three plies of this line are its choice, the rest are ours. [H] With the queens on, the side ahead in development seems to profit.

```
  8  r . b q k b . r
  7  p p p . . p p p
  6  . . p . . . . .
  5  . . . . P . . .
  4  . . . . n . . .
  3  . . . . . N . .
  2  P P P . . P P P
  1  R N B Q . R K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: r1bqkb1r/ppp2ppp/2p5/4P3/4n3/5N2/PPP2PPP/RNBQ1RK1 w kq - 1 8
```

The line, with the sentence the learner sees at each move:
1. **8. Qe2**: The queen steps aside and keeps the queens on: Black's king has not castled.
2. **8... Bf5**: Black develops and protects the knight on e4.
3. **9. Rd1**: The rook takes the open d-file and attacks the queen on d8.
4. **9... Qe7**: The queen leaves the file and eyes the pawn on e5.
5. **10. h3**: White makes room for its king and prepares to push a pawn at the bishop.
6. **10... Rd8**: The rook takes the d-file for Black.

```
  8  . . . r k b . r
  7  p p p . q p p p
  6  . . p . . . . .
  5  . . . . P b . .
  4  . . . . n . . .
  3  . . . . . N . P
  2  P P P . Q P P .
  1  R N B R . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 3rkb1r/ppp1qppp/2p5/4Pb2/4n3/5N1P/PPP1QPP1/RNBR2K1 w k - 1 11
```

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] At depth 16 the engine's best move is the queen move to e2.
- [move_loses] The queen trade is rated at least 30 centipawns lower (measured 37 at depth 16).
- [eval_range] At depth 16 White stands better by between 0.2 and 1.2 pawns.

### Step 13: item

**Task `IHI-LHIENGINESHUMANS5-3`** (find_move, difficulty cue 1)

White to move. Black left the usual path with a rare knight move. Find the best reply.

```
  8  r . b q k b . r
  7  p p p . . p p p
  6  . . p . . . . .
  5  . . . . P . . .
  4  . . . . n . . .
  3  . . . . . N . .
  2  P P P . . P P P
  1  R N B Q . R K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: r1bqkb1r/ppp2ppp/2p5/4P3/4n3/5N2/PPP2PPP/RNBQ1RK1 w kq - 1 8
```

**Accepted answer(s):** Qe2

Feedback shown for wrong moves:
- Qxd8+: The familiar trade, but the engine rates it at least 30 centipawns lower at depth 16 in this position.

**Explanation shown:** At depth 16 the queen move to e2 scores about 0.37 above the queen trade; one engine at one depth, so a hint about the plan, not a law.

Hints (in order):
1. Black's king has not castled and cannot do so quickly.
2. Count what each queen move attacks.
3. The queen goes to the e-file.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] At depth 16 the engine's best move is the queen move to e2.
- [move_loses] Trading queens on d8 is rated at least 30 centipawns lower.

### Step 14: card

**Preparation is memory plus a reason.** Players keep files of engine-checked lines, and a *novelty* is the first move that leaves the files [R]. Engines check lines deeper than a person can calculate, so the first twenty moves can be learned like a poem. [I] The danger is the first move after the poem ends. If you only remember moves, you have nothing to ask; if you know what each side wants, you can still make a plan.

### Step 15: board

Caption: The other main road at this point: the rook move. In our data it was played 2,553 times against 2,263 for the pawn push [V]. Another way to reach a level game: White attacks the knight at once and, after Black's knight retreat, regains the e-pawn. The move order differs from the main line.

```
  8  r . b q k b . r
  7  p p p p . p p p
  6  . . n . . . . .
  5  . B . . p . . .
  4  . . . . n . . .
  3  . . . . . N . .
  2  P P P P . P P P
  1  R N B Q . R K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: r1bqkb1r/pppp1ppp/2n5/1B2p3/4n3/5N2/PPPP1PPP/RNBQ1RK1 w kq - 0 5
```

The line, with the sentence the learner sees at each move:
1. **5. Re1**: The rook attacks the knight on e4, which must move.
2. **5... Nd6**: The knight retreats and attacks the bishop.
3. **6. Bf1**: The bishop retreats out of the knight's attack and keeps the e-file under watch.
4. **6... Be7**: Black develops and prepares to castle.
5. **7. Nxe5**: White wins the pawn, for now, with the knight; note the bishop went back first.
6. **7... Nxe5**: Black takes the knight.
7. **8. Rxe5**: The rook takes back, and the e5 pawn is gone.
8. **8... O-O**: Black castles; the engine sees the position as close to level.

```
  8  r . b q . r k .
  7  p p p p b p p p
  6  . . . n . . . .
  5  . . . . R . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  P P P P . P P P
  1  R N B Q . B K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r1bq1rk1/ppppbppp/3n4/4R3/8/8/PPPP1PPP/RNBQ1BK1 w - - 1 9
```

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] At depth 16 the engine's best move is Re1 or d4, within 40 centipawns.
- [eval_range] At depth 16 the position is within 0.7 pawns of level.

### Step 16: board

Caption: A repertoire choice. Engine scores are about level for four quiet moves. First candidate: h3. Step through the engine's line.

```
  8  r . b q . r k .
  7  . . p . b p . p
  6  p . n p . n p .
  5  . p . . p . . .
  4  . . . . P . . .
  3  . B P . . N . .
  2  P P . P . P P P
  1  R N B Q R . . K
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: r1bq1rk1/2p1bp1p/p1np1np1/1p2p3/4P3/1BP2N2/PP1P1PPP/RNBQR2K w - - 0 10
```

The line, with the sentence the learner sees at each move:
1. **10. h3**: A quiet move: it takes g4 from Black's bishop, so d4 will not be met by a pin.
2. **10... Be6**: Black offers a bishop trade.
3. **11. d4**: White strikes in the centre now that the pin is off.
4. **11... Bxb3**: Black takes the bishop on b3.
5. **12. axb3**: White recaptures and opens the a-file for a rook.
6. **12... exd4**: Black takes the centre pawn.

```
  8  r . . q . r k .
  7  . . p . b p . p
  6  p . n p . n p .
  5  . p . . . . . .
  4  . . . p P . . .
  3  . P P . . N . P
  2  . P . . . P P .
  1  R N B Q R . . K
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r2q1rk1/2p1bp1p/p1np1np1/1p6/3pP3/1PP2N1P/1P3PP1/RNBQR2K w - - 0 13
```

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] At depth 16 the engine's best move is one of h3, a4, d4, d3, all within 40 centipawns.
- [eval_range] At depth 16 White stands slightly better.

### Step 17: board

Caption: Second candidate from the same position: a4, hitting the b5 pawn from the side. Different plan, similar score.

```
  8  r . b q . r k .
  7  . . p . b p . p
  6  p . n p . n p .
  5  . p . . p . . .
  4  . . . . P . . .
  3  . B P . . N . .
  2  P P . P . P P P
  1  R N B Q R . . K
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: r1bq1rk1/2p1bp1p/p1np1np1/1p2p3/4P3/1BP2N2/PP1P1PPP/RNBQR2K w - - 0 10
```

The line, with the sentence the learner sees at each move:
1. **10. a4**: The pawn attacks b5 and asks Black to decide what to do with its queenside.
2. **10... b4**: Black pushes past and gains space.
3. **11. h3**: White makes luft and keeps g4 away from Black's bishop.
4. **11... Rb8**: The rook supports the advanced pawn.
5. **12. d4**: White opens the centre.
6. **12... bxc3**: Black captures, and the b-file becomes a battleground.

```
  8  . r b q . r k .
  7  . . p . b p . p
  6  p . n p . n p .
  5  . . . . p . . .
  4  P . . P P . . .
  3  . B p . . N . P
  2  . P . . . P P .
  1  R N B Q R . . K
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 1rbq1rk1/2p1bp1p/p1np1np1/4p3/P2PP3/1Bp2N1P/1P3PP1/RNBQR2K w - - 0 13
```

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] At depth 16 a4 is one of four moves within 40 centipawns of the best.
- [eval_range] At depth 16 White stands slightly better.

### Step 18: board

Caption: Third candidate: the direct d4. Again a different story.

```
  8  r . b q . r k .
  7  . . p . b p . p
  6  p . n p . n p .
  5  . p . . p . . .
  4  . . . . P . . .
  3  . B P . . N . .
  2  P P . P . P P P
  1  R N B Q R . . K
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: r1bq1rk1/2p1bp1p/p1np1np1/1p2p3/4P3/1BP2N2/PP1P1PPP/RNBQR2K w - - 0 10
```

The line, with the sentence the learner sees at each move:
1. **10. d4**: White challenges e5 at once.
2. **10... Bg4**: Black pins the knight on f3 and adds pressure on d4.
3. **11. Be3**: The bishop develops and guards d4, so the pin has less bite.
4. **11... exd4**: Black trades pawns.
5. **12. cxd4**: White recaptures and keeps a pawn in the centre.
6. **12... Na5**: The knight attacks the bishop on b3.

```
  8  r . . q . r k .
  7  . . p . b p . p
  6  p . . p . n p .
  5  n p . . . . . .
  4  . . . P P . b .
  3  . B . . B N . .
  2  P P . . . P P P
  1  R N . Q R . . K
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r2q1rk1/2p1bp1p/p2p1np1/np6/3PP1b1/1B2BN2/PP3PPP/RN1QR2K w - - 1 13
```

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] At depth 16 d4 is one of four moves within 40 centipawns of the best.
- [eval_range] At depth 16 White stands slightly better.

### Step 19: card

**What each move is for [I].** h3 takes g4 from Black's bishop, so d4 can follow without a pin; the risk is a slow start. a4 hits b5; the risk is that b4 then gains Black space. d4 fights for the centre at once; the risk is opening lines before the pieces are ready. d3 keeps things solid; the risk is passivity. Black's usual plans: knight to a5 to challenge the bishop, c5 for space, a bishop move such as g4 or b7, rook to e8.

### Step 20: item

**Task `IHI-LHIENGINESHUMANS5-11`** (select_squares, difficulty cue 1)

White has just played h3. Tap the square from which Black's c8 bishop could have pinned the knight on f3, and which the h-pawn now covers.

```
  1  K . . R Q B N R
  2  . P P . P . P P
  3  P . N . . P B .
  4  . . . P . . . .
  5  . . . p . . p .
  6  . p n . p n . p
  7  p . p b . p . .
  8  . k r . q b . r
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: r1bq1rk1/2p1bp1p/p1np1np1/1p2p3/4P3/1BP2N1P/PP1P1PP1/RNBQR2K b - - 0 10
```

**Accepted answer:** squares g4

**Explanation shown:** A bishop on g4 would pin the knight on f3 to the queen on d1. The pawn on h3 covers g4, so a later d4 will not meet a pin. That is the purpose of h3 in this structure [I].

Hints (in order):
1. The bishop on c8 travels on the light-squared diagonal.
2. The pin needs the bishop in front of the knight.
3. It is a square on the g-file.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [pawn_attackers] The white pawn on h3 attacks g4.

### Step 21: reflect

Kind: expect

Prompt: Copying the engine means playing the top-listed move. Asking about plans means choosing the one whose plan you understand. For one of the three candidates, fill in the questions you would ask.

- Field "The candidate I would pick and why:" (free text)

- Field "The plan it starts for me:" (free text)

- Field "Their best plan against it:" (free text)

- Field "What I do if they leave my preparation:" (free text)

### Step 22: board

Caption: Engine-last in practice: before you ask the machine, write your own candidates. Mark them here (arrows show three of them), then check the list.

```
  8  r . b q . r k .
  7  . . p . b p . p
  6  p . n p . n p .
  5  . p . . p . . .
  4  . . . . P . . .
  3  . B P . . N . .
  2  P P . P . P P P
  1  R N B Q R . . K
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: r1bq1rk1/2p1bp1p/p1np1np1/1p2p3/4P3/1BP2N2/PP1P1PPP/RNBQR2K w - - 0 10
```

Drawn on the board: arrows h2-h3, a2-a4, d2-d4.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] At depth 16 the four quiet moves are all within 40 centipawns of the best.

### Step 23: item

**Task `IHI-LHIENGINESHUMANS5-4`** (find_move, difficulty cue 3)

White to move in this Closed Ruy Lopez. Choose a move and write the plan it starts.

```
  8  r . b q . r k .
  7  . . p . b p . p
  6  p . n p . n p .
  5  . p . . p . . .
  4  . . . . P . . .
  3  . B P . . N . .
  2  P P . P . P P P
  1  R N B Q R . . K
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: r1bq1rk1/2p1bp1p/p1np1np1/1p2p3/4P3/1BP2N2/PP1P1PPP/RNBQR2K w - - 0 10
```

**Accepted answer(s):** h3, a4, d4, d3

Feedback shown for wrong moves:
- g4: A loosening lunge near your own king; the engine rates it at least 100 centipawns lower at depth 16.

**Explanation shown:** Four plans are within 40 centipawns at depth 16, so the score alone cannot choose. The choice is a human one: which plan do you understand best?

Hints (in order):
1. Several sensible moves are about equal: look for one with a purpose.
2. Ask what each move prepares, not only what it is.
3. Ask which side of the board and which piece each move prepares for.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] At depth 16 the engine's best move is one of h3, a4, d4, d3, and all four are within 40 centipawns of it.
- [move_loses] The pawn lunge g4 is rated at least 100 centipawns lower.

### Step 24: reflect

Kind: unsure

Prompt: Pick the plan that your chosen move starts.

- Field "My move started this plan:" with options: take g4 from Black's bishop so d4 can come / attack Black's queenside pawns / claim the centre at once / keep everything solid and wait; no single correct answer (a guess or a self-report)

- Field "The risk of that plan:" (free text)

### Step 25: card

**Advanced chess.** Kasparov and Topalov played a 3-3 advanced-chess match, each with a computer beside them, in León in 1998 [S: Wikipedia]. Kasparov later argued, in a 2010 essay, that a person plus a machine plus a good process can beat either alone [R, not checked against the full text]. People who combine human and machine this way are called *centaurs* [R].

### Step 26: board

Caption: A tactic from Morphy's Opera Game (Paris, 1858) [R]. A machine finds mates like this at once [I], so in centaur play the human's time goes to plans. The mate in two, on a board.

```
  8  . . . . k b . r
  7  . . . n . p p p
  6  p . . . q . . .
  5  . . . . p . B .
  4  . . . . P . . .
  3  . Q . . . . . .
  2  P P P . . P P P
  1  . . K R . . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 4kb1r/3n1ppp/p3q3/4p1B1/4P3/1Q6/PPP2PPP/2KR4 w k - 0 16
```

The line, with the sentence the learner sees at each move:
1. **16. Qb8+**: The queen gives check and offers itself; the knight is the only piece that can take it.
2. **16... Nxb8**: The knight takes the queen, and in doing so leaves the d-file.
3. **17. Rd8#**: The rook mates: the bishop on g5 guards d8, and the king has no flight square.

```
  8  . n . R k b . r
  7  . . . . . p p p
  6  p . . . q . . .
  5  . . . . p . B .
  4  . . . . P . . .
  3  . . . . . . . .
  2  P P P . . P P P
  1  . . K . . . . .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 1n1Rkb1r/5ppp/p3q3/4p1B1/4P3/8/PPP2PPP/2K5 b k - 1 17
```

Drawn on the board: arrows b3-b8, d1-d8.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [mate_in] The queen move to b8 leads to a forced mate in two.

### Step 27: item

**Task `IHI-LHIENGINESHUMANS5-8`** (find_move, difficulty cue 1)

White to move. A machine finds this in a blink. Find the mate in two.

```
  8  . . . . k b . r
  7  . . . n . p p p
  6  p . . . q . . .
  5  . . . . p . B .
  4  . . . . P . . .
  3  . Q . . . . . .
  2  P P P . . P P P
  1  . . K R . . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 4kb1r/3n1ppp/p3q3/4p1B1/4P3/1Q6/PPP2PPP/2KR4 w k - 0 16
```

**Accepted answer(s):** Qb8+

**Explanation shown:** The queen gives check, the knight must capture it, and the rook on d1 then mates on d8. The engine confirms the mate in two.

Hints (in order):
1. Look at the d-file and the black king.
2. A queen sacrifice removes the only defender.
3. Queen to b8 with check.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [mate_in] The queen move to b8 leads to a forced mate in two.

### Step 28: card

**Freestyle.** In this lesson freestyle means human-plus-engine teams, not the shuffled-start Chess960 format also sold under that name [S]. Wikipedia dates the idea to a 2004 blitz event [S, to confirm]. Kasparov's 2010 essay, known to me only from a summary [R], describes a 2005 online tournament won by two amateurs with several computers, ahead of grandmaster teams. His reading: a better *process* won. [H] One tournament shows what is possible, not what usually happens.

### Step 29: reflect

Kind: unsure

Prompt: Classify each practice: preparation, centaur or advanced chess, correspondence chess, or cheating. Choose one label for each.

- Field "Studying an engine-checked opening file before a game:" with options: preparation / centaur / correspondence / cheating; no single correct answer (a guess or a self-report)

- Field "A player and a program choose moves together in a game whose rules allow it:" with options: preparation / centaur / correspondence / cheating; no single correct answer (a guess or a self-report)

- Field "Asking an engine for the move during an over-the-board game that bans engines:" with options: preparation / centaur / correspondence / cheating; no single correct answer (a guess or a self-report)

- Field "A game by post or server where the federation allows engines:" with options: preparation / centaur / correspondence / cheating; no single correct answer (a guess or a self-report)

### Step 30: card

**Check yourself.** Studying a file is preparation. Playing with a program under the rules is centaur or advanced chess. Correspondence chess is run by a federation: the ICCF allows engines and tablebases, even in its World Championship, and Wikipedia says draw rates are very high [S]. An engine in a game that bans it is cheating. The event's rules decide.

### Step 31: board

Caption: Correspondence thinking [H]: the main line is level, but there is a quieter option that keeps more pieces on. Step through the d3 line; the engine rates it about as well.

```
  8  r . b q k b . r
  7  p p p p . p p p
  6  . . n . . n . .
  5  . B . . p . . .
  4  . . . . P . . .
  3  . . . . . N . .
  2  P P P P . P P P
  1  R N B Q K . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: r1bqkb1r/pppp1ppp/2n2n2/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4
```

The line, with the sentence the learner sees at each move:
1. **4. d3**: A quiet reply: the centre stays closed and no queen trade is on offer.
2. **4... Bc5**: Black develops to the active diagonal.
3. **5. O-O**: White castles; both kings are safe.
4. **5... d6**: The pawn supports e5 and shuts the bishop's diagonal.
5. **6. c3**: White prepares d4 to build a centre.
6. **6... O-O**: Black castles too; the middlegame begins with all the pieces on.

```
  8  r . b q . r k .
  7  p p p . . p p p
  6  . . n p . n . .
  5  . B b . p . . .
  4  . . . . P . . .
  3  . . P P . N . .
  2  P P . . . P P P
  1  R N B Q . R K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r1bq1rk1/ppp2ppp/2np1n2/1Bb1p3/4P3/2PP1N2/PP3PPP/RNBQ1RK1 w - - 1 7
```

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] At depth 16 castling and d3 are both within 40 centipawns of the best move.

### Step 32: board

Caption: The same line a few moves on. The engine sees a small plus for White, and many pieces for both sides to misplace. [H] A player who wants to win without risk may choose this kind of line over the queenless one.

```
  8  r . b q . r k .
  7  p p p . . p p p
  6  . . n p . n . .
  5  . B b . p . . .
  4  . . . . P . . .
  3  . . P P . N . .
  2  P P . . . P P P
  1  R N B Q . R K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: r1bq1rk1/ppp2ppp/2np1n2/1Bb1p3/4P3/2PP1N2/PP3PPP/RNBQ1RK1 w - - 1 7
```

The line, with the sentence the learner sees at each move:
1. **7. Nbd2**: The knight develops and prepares d4 with a piece supporting it.
2. **7... a6**: Black asks the bishop what it wants to do.
3. **8. Ba4**: The bishop retreats and keeps its place on the diagonal.
4. **8... Ba7**: The black bishop retreats to a safe square behind its pawns.
5. **9. h3**: White makes room for its king and keeps options open.
6. **9... Ne7**: Black heads the knight for g6, towards the kingside.

```
  8  r . b q . r k .
  7  b p p . n p p p
  6  p . . p . n . .
  5  . . . . p . . .
  4  B . . . P . . .
  3  . . P P . N . P
  2  P P . N . P P .
  1  R . B Q . R K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r1bq1rk1/bpp1nppp/p2p1n2/4p3/B3P3/2PP1N1P/PP1N1PP1/R1BQ1RK1 w - - 1 10
```

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [eval_range] At depth 16 White stands slightly better.
- [best_move_in] At depth 16 the engine's best move is Nbd2, h3 or Re1.

### Step 33: card

**Rules and the human part.** ICCF rules on engine use differ by event; check the current rules [S, not confirmed here]. What a human adds in such games is, I suggest, choosing which line to enter and when to deviate [H], and managing time over a long game [H].

### Step 34: board

Caption: Rook and pawn against rook, Black to move. The tablebase says draw, but only some rook moves hold it: ...Rd3 holds, ...Rd1 loses [V]. Why only some? That is beyond this lesson [I]: a tablebase never errs here, a human must know the technique. [H] A correspondence player who sees a drawn line tries to avoid it earlier.

```
  8  . . . . . . . .
  7  . . . . . . . .
  6  . . . . . . . .
  5  . . . . k . . .
  4  . . . r . . . .
  3  . . . . P K . .
  2  . . . . . . . .
  1  R . . . . . . .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: 8/8/8/4k3/3r4/4PK2/8/R7 b - - 0 1
```

Drawn on the board: arrows d4-d3.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [tablebase] The tablebase says Black, to move, holds the draw.
- [tablebase] The rook move to d3 keeps the draw.
- [tablebase] The rook move to d1 loses.

### Step 35: reflect

Kind: expect

Prompt: [H] When engine help is universal, the edge shifts from knowing moves to choosing plans and managing what your opponent finds hard. Do you agree? Give one reason for and one against.

- Field "One reason for:" (free text)

- Field "One reason against:" (free text)

### Step 36: card

**Where numbers mislead.** An engine score is one number. [I] Without a tablebase, it can look winning on a fortress that cannot be won; here the tablebase solves each position for us, and the lesson is that counting material is not a verdict. [H] People may still add the most in long plans where the score hardly changes; our boards are tablebase positions, not human wins. Predict the three positions below.

### Step 37: contrast

Title: Does the wrong-coloured bishop save the lone king?

Prompt: Predict first. The first position is a bishop and h-pawn against a bare king, the bishop on a light square. In the second the bishop stands on a dark square, the colour of h8. In the third the white king stands one rank further back, on f5. Which change matters?

**The working board:**

**Task `IHI-LHIENGINESHUMANS5-5`** (predict_outcome, difficulty cue 1)

Black to move. White has a bishop and a pawn against a lone king. Can White win by force?

```
  1  . . . . . . . .
  2  . . . . . . . .
  3  . . . . . . . .
  4  . . . B . . . .
  5  P . . . . . . .
  6  . . K . . . . .
  7  . . . . . . . .
  8  k . . . . . . .
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: 7k/8/5K2/7P/4B3/8/8/8 b - - 0 1
```

**Accepted answer:** {"outcome": "no"}

**Explanation shown:** A wrong-coloured bishop plus a rook pawn cannot force the win: the lone king reaches the corner. The tablebase confirms a draw.

Hints (in order):
1. Count material, then ask where the pawn will promote.
2. The pawn promotes on h8. Which colour is that square?
3. The bishop does not control the promotion square.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [tablebase] The tablebase says the position is a draw with Black to move.

**The failing board:**

**Task `IHI-LHIENGINESHUMANS5-6`** (predict_outcome, difficulty cue 1)

Black to move. The same position, but the bishop stands on a dark square. Can White win by force?

```
  1  . . . . . . . .
  2  . . . . . . . .
  3  . . . . . . . .
  4  . . . . B . . .
  5  P . . . . . . .
  6  . . K . . . . .
  7  . . . . . . . .
  8  k . . . . . . .
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: 7k/8/5K2/7P/3B4/8/8/8 b - - 0 1
```

**Accepted answer:** {"outcome": "yes"}

**Explanation shown:** With the bishop on the colour of the promotion square, the corner is no refuge and White wins; the tablebase confirms it.

Hints (in order):
1. Compare with the first position: what moved?
2. Which colour is the promotion square h8?
3. This bishop covers h8.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [tablebase] The tablebase says Black, to move, loses.

**The irrelevant board:**

**Task `IHI-LHIENGINESHUMANS5-7`** (predict_outcome, difficulty cue 1)

Black to move. The bishop is still on the wrong colour, but the white king stands on f5 instead of f6, one rank further back. Can White win by force?

```
  1  . . . . . . . .
  2  . . . . . . . .
  3  . . . . . . . .
  4  . . . B . . . .
  5  P . K . . . . .
  6  . . . . . . . .
  7  . . . . . . . .
  8  k . . . . . . .
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: 7k/8/8/5K1P/4B3/8/8/8 b - - 0 1
```

**Accepted answer:** {"outcome": "no"}

**Explanation shown:** The king's square is irrelevant here: with the wrong-coloured bishop the draw remains.

Hints (in order):
1. Which feature decided the first position?
2. Is it the king's square or the bishop's colour?
3. The bishop is still the wrong colour.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [tablebase] The tablebase says the position is a draw with Black to move.

### Step 38: board

Caption: Now the explanation for the first position: step through how the lone king holds. The draw is confirmed by the tablebase [V].

```
  8  . . . . . . . k
  7  . . . . . . . .
  6  . . . . . K . .
  5  . . . . . . . P
  4  . . . . B . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  . . . . . . . .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: 7k/8/5K2/7P/4B3/8/8/8 b - - 0 1
```

The line, with the sentence the learner sees at each move:
1. **1... Kg8**: The king steps along the edge.
2. **2. h6**: The pawn advances.
3. **2... Kh8**: The king returns to the corner, where it has a safe square.
4. **3. Kg6**: White's king approaches.
5. **3... Kg8**: The king steps out again while it can.
6. **4. h7+**: The pawn gives check, and the only legal reply is the king back to h8.
7. **4... Kh8**: Stalemate: White cannot make progress, because the bishop can never cover the corner h8. White's mistake is lack of progress, not a blunder [I].

```
  8  . . . . . . . k
  7  . . . . . . . P
  6  . . . . . . K .
  5  . . . . . . . .
  4  . . . . B . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  . . . . . . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 7k/7P/6K1/8/4B3/8/8/8 w - - 1 5
```

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [tablebase] The tablebase says the position is a draw with Black to move.

### Step 39: board

Caption: Why the dark bishop wins: step through the tablebase's fastest line (Black resists as long as it can). The bishop can cover squares near the corner, so White can wait a move; the wrong-coloured bishop cannot [I].

```
  8  . . . . . . . k
  7  . . . . . . . .
  6  . . . . . K . .
  5  . . . . . . . P
  4  . . . B . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  . . . . . . . .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: 7k/8/5K2/7P/3B4/8/8/8 b - - 0 1
```

The line, with the sentence the learner sees at each move:
1. **1... Kh7**: Black's king steps out of the corner.
2. **2. Be3**: The bishop goes to a dark square where it can protect the pawn on h6 later [I].
3. **2... Kg8**: The king goes back towards the corner.
4. **3. h6**: The pawn advances, protected by the bishop.
5. **3... Kh7**: Black attacks the pawn.
6. **4. Kf7**: White's king steps up; the pawn is still protected.
7. **4... Kh8**: Black returns to the corner.
8. **5. Kg6**: White's king takes g6, covering h7 and g7.
9. **5... Kg8**: The black king steps out.
10. **6. Bc5**: The bishop swings to c5, covering f8, so the black king loses a square.
11. **6... Kh8**: Black returns to the corner.
12. **7. Ba3**: A waiting move that keeps f8 covered: Black must step out and the pawn advances with check [I].

```
  8  . . . . . . . k
  7  . . . . . . . .
  6  . . . . . . K P
  5  . . . . . . . .
  4  . . . . . . . .
  3  B . . . . . . .
  2  . . . . . . . .
  1  . . . . . . . .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 7k/8/6KP/8/8/B7/8/8 b - - 8 7
```

Drawn on the board: arrows d4-h8.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [tablebase] The tablebase says Black, to move, loses.

### Step 40: board

Caption: A closed King's Indian: the centre is locked and four moves score almost the same. First plan: White plays on the queenside. The first seven plies are the engine's choice at depth 16 after Rb1 [V]; the last is ours.

```
  8  r . b q . r k .
  7  p p p . n p b p
  6  . . . p . n p .
  5  . . . P p . . .
  4  . . P . P . . .
  3  . . N . . N . .
  2  P P . . B P P P
  1  R . B Q . R K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: r1bq1rk1/ppp1npbp/3p1np1/3Pp3/2P1P3/2N2N2/PP2BPPP/R1BQ1RK1 w - - 1 9
```

The line, with the sentence the learner sees at each move:
1. **9. Rb1**: The rook prepares the pawn push on the queenside, where White has space [I].
2. **9... a5**: Black slows the push by challenging b4.
3. **10. a3**: White prepares b4 anyway, so a pawn there will be supported.
4. **10... Ne8**: The knight clears the f-pawn's path and defends the squares around it [I].
5. **11. b4**: White starts the plan.
6. **11... f5**: Black starts its own plan on the other wing.
7. **12. Nd2**: The knight re-routes towards the queenside and keeps e4 defended.
8. **12... Nf6**: Black's knight returns to attack e4.

```
  8  r . b q . r k .
  7  . p p . n . b p
  6  . . . p . n p .
  5  p . . P p p . .
  4  . P P . P . . .
  3  P . N . . . . .
  2  . . . N B P P P
  1  . R B Q . R K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r1bq1rk1/1pp1n1bp/3p1np1/p2Ppp2/1PP1P3/P1N5/3NBPPP/1RBQ1RK1 w - - 2 13
```

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] At depth 16 the engine's best move is one of Ne1, Rb1, a3, Be3, all within 40 centipawns.
- [eval_range] At depth 16 White stands slightly better.

### Step 41: board

Caption: Second plan from the same position: develop the bishop and meet Black's pawn break first. The first two plies are the engine's at depth 16 [V]; the rest are ours [I]. The engine gives no verdict between the plans; it only says both are fine.

```
  8  r . b q . r k .
  7  p p p . n p b p
  6  . . . p . n p .
  5  . . . P p . . .
  4  . . P . P . . .
  3  . . N . . N . .
  2  P P . . B P P P
  1  R . B Q . R K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: r1bq1rk1/ppp1npbp/3p1np1/3Pp3/2P1P3/2N2N2/PP2BPPP/R1BQ1RK1 w - - 1 9
```

The line, with the sentence the learner sees at each move:
1. **9. Be3**: The bishop develops and watches the dark squares.
2. **9... Ng4**: Black's knight jumps at the bishop.
3. **10. Bc1**: The bishop retreats to its original square and keeps the pawn structure together [I].
4. **10... f5**: Black pushes the kingside pawn.
5. **11. a4**: White gains space on the queenside.
6. **11... c5**: Black prepares a break on the other side.
7. **12. h3**: White drives the knight back.
8. **12... Nf6**: Black's knight returns.

```
  8  r . b q . r k .
  7  p p . . n . b p
  6  . . . p . n p .
  5  . . p P p p . .
  4  P . P . P . . .
  3  . . N . . N . P
  2  . P . . B P P .
  1  R . B Q . R K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r1bq1rk1/pp2n1bp/3p1np1/2pPpp2/P1P1P3/2N2N1P/1P2BPP1/R1BQ1RK1 w - - 1 13
```

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] At depth 16 Be3 is one of four moves within 40 centipawns of the best.
- [eval_range] At depth 16 White stands slightly better.

### Step 42: card

**The usual plan split [R].** In closed King's Indian positions like this, White typically plays on the queenside with pawn pushes such as b4 and c5, while Black plays on the kingside with f5 and later g5. This is widely taught; I have not checked it against a named book here. [I] That is why Rb1 and a3 serve one wing, while Be3 and Ne1 prepare for Black's f-pawn push.

### Step 43: item

**Task `IHI-LHIENGINESHUMANS5-9`** (find_move, difficulty cue 3)

White to move in a closed King's Indian. Four moves, all within 40 centipawns. Choose one and say what plan it prepares.

```
  8  r . b q . r k .
  7  p p p . n p b p
  6  . . . p . n p .
  5  . . . P p . . .
  4  . . P . P . . .
  3  . . N . . N . .
  2  P P . . B P P P
  1  R . B Q . R K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: r1bq1rk1/ppp1npbp/3p1np1/3Pp3/2P1P3/2N2N2/PP2BPPP/R1BQ1RK1 w - - 1 9
```

**Accepted answer(s):** Ne1, Rb1, a3, Be3

**Explanation shown:** Four moves are within 40 centipawns, so the engine cannot name one plan. Rb1 and a3 prepare the b4 push on the queenside; Be3 and Ne1 meet Black's f-pawn break first, so they do not yet pick a wing [I]. Your reasons decide.

Hints (in order):
1. Several moves are equal: what does each one prepare?
2. Which of the four prepares a queenside advance, and which meets Black's kingside pawn push first?
3. Prepare b4, or prepare to answer f5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] At depth 16 the engine's best move is one of Ne1, Rb1, a3, Be3, all within 40 centipawns.

### Step 44: reflect

Kind: expect

Prompt: [H] When four plans score the same, the engine is not the teacher. What would you use instead? Write one question you would ask of the position, and say whether you disagree with this hypothesis.

- Field "My question for the position:" (free text)

- Field "I agree or disagree because:" (free text)

### Step 45: card

**Human-like play.** Maia networks are trained on Lichess games to play the move a human of a given rating would choose, not the best move [V: our research notes]; our Play page offers one as an optional opponent [V: project docs]. [H] A model of human error could help in two ways: training against the mistakes you will really meet, and fair-play checks that ask whether a move looks like what a player of that rating would do. No evidence here that it works; it is a hypothesis.

### Step 46: card

**What coaches say [S, not checked against the books].** Per Wikipedia and a chess.com article, Jeremy Silman puts a tactical check first and holds that engine analysis shows what to play but not why. Per a chess.com blog review of Aagaard's *Excelling at Chess Calculation* (2004), he argues that the worst errors often come when a key candidate move is overlooked. [I] Both fit *engine-last*. Neither is a top player describing his own engine use; that part is [H] here.

### Step 47: reflect

Kind: expect

Prompt: From what you have read, name one thing an engine cannot tell you and one it tells you better than you can.

- Field "An engine cannot tell me:" (free text)

- Field "An engine does better than me at:" (free text)

### Step 48: card

**Risks.** [I] If the engine always names the move, you stop practising the search for candidates. [H] A second risk is trusting a number: a score does not say which plan your opponent will find hard. The third is fair play: using an engine where it is banned breaks the rules and the point of playing. Rules differ by event, since some allow engines, so check before you use one.

### Step 49: card

**Your engine habits.** A habit is a rule you decide in advance. Fill in the form: when you check, what you write first, what you look for, how often, and what you never do. Make each answer short enough to follow when you are tired. [H] A plan you will keep beats a perfect plan you will not.

### Step 50: reflect

Kind: confidence

Prompt: Your engine-habits plan: five choices.

- Field "I check the engine:" with options: after the game / only on moves I marked / during a game where it is allowed / never; no single correct answer (a guess or a self-report)

- Field "Before I look I write down:" (free text)

- Field "When I look I ask:" with options: what is the best move / what is my opponent's threat / what pattern did I miss / what plan does the line show; no single correct answer (a guess or a self-report)

- Field "How often I do this (per week):" (free text)

- Field "What I never do with an engine:" (free text)

### Step 51: reflect

Kind: unsure

Prompt: Scenarios. For each, would you use an engine, and when? Choose and give a reason.

- Field "You blundered a piece in last night's rapid game and want to know why:" with options: use it now / use it after writing my own view / do not use it; no single correct answer (a guess or a self-report)

- Field "You are 20 moves into a live over-the-board game and unsure:" with options: use it now / use it after writing my own view / do not use it; no single correct answer (a guess or a self-report)

- Field "You are building a repertoire move for next week's tournament:" with options: use it now / use it after writing my own view / do not use it; no single correct answer (a guess or a self-report)

- Field "My reasons, in one line each:" (free text)

### Step 52: reflect

Kind: unsure

Prompt: True or not supported? For each statement choose one label: supported by a source named in this course, contradicted, or not supported.

- Field "Kasparov and Topalov drew an advanced chess match 3-3 in 1998." with options: supported / contradicted / not supported; no single correct answer (a guess or a self-report)

- Field "Kasparov won the 1997 match against Deep Blue." with options: supported / contradicted / not supported; no single correct answer (a guess or a self-report)

- Field "Freestyle chess began with Kasparov's 1998 match." with options: supported / contradicted / not supported; no single correct answer (a guess or a self-report)

- Field "Kramnik's four Berlin games against Kasparov in 2000 were all drawn." with options: supported / contradicted / not supported; no single correct answer (a guess or a self-report)

- Field "Maia networks are widely used by federations to catch cheats." with options: supported / contradicted / not supported; no single correct answer (a guess or a self-report)

### Step 53: card

**Answers.** The first is supported (Wikipedia). The second is contradicted: according to the sources in lesson 1, Deep Blue won in 1997. The third is contradicted: Wikipedia places the start of freestyle in a 2004 blitz event by Ingo Althoefer and Timo Klaustermeyer. The fourth is supported by Wikipedia as I recall it [R]. The fifth is not supported: we have no source, and our own note calls the idea a hypothesis.

### Step 54: reflect

Kind: expect

Prompt: Teach it back. Imagine a beginner asks: should I use an engine to learn chess? Write the answer you would give.

- Field "The idea in one sentence:" (free text)

- Field "When an engine helps:" (free text)

- Field "When an engine hurts:" (free text)

- Field "One example from this lesson that a beginner could set up on a board:" (free text)

### Step 55: card

**Self-check.** Did you say when an engine helps and when it hurts? Did you give an example a beginner could set up on a board, such as the bishop and h-pawn against a bare king? Did you name one risk and one rule of your own? Did you mark what you know and what you only suspect? A sample strong answer: 'Write your own view first, then check [I]; an engine finds tactics well but cannot say what you understand.' The app does not grade this.

### Step 56: card

**Recap.**
- Engines changed preparation: lines are memorised deep, so know *why* each side plays them.
- Level scores hide different plans; you choose.
- Centaur and correspondence chess show process can matter.
- Some positions, like fortresses, fool the count.
- Think first, engine last (this series: lesson 1 on history, lesson 2 on what engines see and miss, and this one).
- [H] People may still add most in long plans.
- Write your habits down.

### Step 57: reflect

Kind: confidence

Prompt: Pick the weakest point from the self-check and one habit you will try in your next ten games.

- Field "My weakest point:" (free text)

- Field "The habit I will try, and when I will review it:" (free text)

---

## Reviewer scorecard

Fill in the file `content/review/L-HI-ENGINES-HUMANS-5.json` (a template is below). Scale 1 to 5 for each dimension: 1 = wrong or unusable, 3 = acceptable with edits, 5 = I would put my name to it as it stands.
Revision to review: `a4956368`. If the lesson text changes after your review, your sign-off no longer applies and the lesson goes back to needs-human.

| Dimension | What to judge | Score |
|---|---|---|
| chess | every statement, line and explanation is correct; near-misses are really near-misses | |
| clarity | the explanation actually explains (mechanism, conditions), in plain words | |
| prerequisites | the lesson assumes only what the learner has met | |
| tasks | each task has one defensible answer and a fair explanation | |

```json
{
  "lesson": "L-HI-ENGINES-HUMANS-5",
  "revision": "a4956368",
  "reviewer": "<your name>",
  "reviewer_role": "strong-player",
  "date": "YYYY-MM-DD",
  "scores": {"chess": 0, "clarity": 0, "prerequisites": 0, "tasks": 0},
  "comments": "<what to change, by step number>",
  "verdict": "approved"
}
```

`reviewer_role` is `strong-player` or `teacher`. `verdict` is `approved` or `changes-requested`. See docs/review-slice.md.
