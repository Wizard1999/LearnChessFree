# Review packet: L-HI-ENGINES-HUMANS-1

**Engines and humans 1: how machines took over chess**

- Skill: GAME.HISTORY (D1); stage: exemplar; stated length: 30 minutes
- Steps: 65 (4 are tasks); revision: `e76b9651`
- Review status now: needs-human

## What the lesson says the learner will be able to do

- Gives the dates and results of the 1996 and 1997 Deep Blue matches and the 2006 Bonn match, with a source for each
- Says what the 1997 match shows and what it does not show (sample size, special hardware, a party to the match)
- Reads a stepped game with a purpose for each move and separates a verified fact from a conjecture
- Explains with a fortress position why a depth-limited engine score is not an outcome
- Tests a source's claim against an engine and says what is unresolved

## Sources the author names (check that they are used fairly, in our own words)

- [S] Wikipedia, 'Deep Blue versus Garry Kasparov', https://en.wikipedia.org/wiki/Deep_Blue_versus_Garry_Kasparov, read 2026-10-30 through a page-summarising tool (match dates and scores; game results, openings and the complete move lists of games 1, 2 and 6 of 1997; the statement that post-game analysis showed a draw in game 2). The move lists were replayed with python-chess: every move legal, final moves match the page (45.g7, 45.Ra6, 19.c4). Moves are facts; all comment on the moves is ours. Also read 2026-10-30 for this pass: the page calls 8.Nxe6 a well-known refutation and says Kasparov expected a machine not to sacrifice without concrete gain; the film Game Over (Greengard, Seirawan) on the end of game 2; 1996 game 1 (Sicilian, Alapin, 37 moves, first classical-time-control win by a computer over a reigning champion); the opening book and extended book of 700,000 grandmaster games. It gives no figures for Deep Blue's speed.
- [S] Wikipedia, 'Deep Fritz', https://en.wikipedia.org/wiki/Deep_Fritz, read 2026-10-30 (Bonn, 25 November to 5 December 2006; Deep Fritz won 4-2)
- [S] Wikipedia, 'Leela Chess Zero', https://en.wikipedia.org/wiki/Leela_Chess_Zero, read 2026-10-30 (announced 9 January 2018; based on AlphaZero's idea; adapted from Leela Zero; TCEC season 15, May 2019). First 100000 characters read.
- [S] Stockfish project blog, 'Stockfish 12', https://stockfishchess.org/blog/2020/stockfish-12/, read 2026-10-30 (released 2 September 2020; NNUE default; wins many more game pairs than it loses against version 11)
- [S] IBM history page 'Deep Blue' and arXiv 1712.01815 abstract page (5 December 2017), as recorded in the earlier version of this lesson, accessed 2026-10-29; the AlphaZero match score is deliberately not used (single source)
- [V] Engine claims: Stockfish 19 lite, single thread, depth 16 unless a claim states another depth; one-off depth 26 run for the game 2 resignation position (not re-run by the validator); tablebase claims from the Lichess 7-man service
- [I]/[H] The cultural-turning-point idea, the search-or-preparation question, and the shallow search as a stand-in for old engines are conjecture, labelled as such in the text
- [V] Engine recounts, 30 Oct 2026, Stockfish 19 lite single thread: game 2 position after 45.Ra6 about +0.9 to +1.1 for White at depths 16, 22 and 26 (runs differ slightly with hash size); 44.Kh1 first at depths 16 and 18, 1.1 to 1.9 pawns above 44.Kf1; 34...Qxf1+ 1.1 to 1.7 below 34...h5; fortress position, Black to move, about +0.7 at depth 16 and +9.6 at depth 2. The draw-rate comparison used in an earlier version was removed: it compared different populations.

## How to read this packet

Boards are drawn with capitals for White and lower case for Black, rank 8 at the top unless the board is shown from Black's side. Moves in a line are in standard notation. Statements marked [V] were machine-checked, [I] inference, [H] hypothesis, [S] secondary source, [R] recalled. Please judge the explanations, not only the moves: does each sentence tell the learner why?

---

### Step 1: board

Caption: New York, May 1997, game 6. White to move. The knight on g5 can take the pawn on e6. Someone chose to do that: a person or a machine. Which? Decide before reading on.

```
  8  r . b q k b . r
  7  p p . n . p p .
  6  . . p . p n . p
  5  . . . . . . N .
  4  . . . P . . . .
  3  . . . B . N . .
  2  P P P . . P P P
  1  R . B Q K . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: r1bqkb1r/pp1n1pp1/2p1pn1p/6N1/3P4/3B1N2/PPP2PPP/R1BQK2R w KQkq - 0 8
```

Drawn on the board: arrows g5-e6; highlighted squares e6.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [piece_on] A white knight stands on g5.
- [attackers] 1 white piece attacks the pawn on e6 (the knight on g5).
- [attackers] 1 black piece defends the pawn on e6 (the pawn on f7).
- [legal_move] The knight can capture on e6.

### Step 2: reflect

Kind: expect

Prompt: Human or machine, and why do you think so?

- Field "I think it was a:" (free text)

- Field "because:" (free text)

### Step 3: card

**Answer: a machine, Deep Blue, with White.** Wikipedia calls the sacrifice a well-known refutation of the line Kasparov chose, so the idea was known human theory [S]. The same page says Kasparov expected a machine not to sacrifice without concrete gain [S]. So 'human or machine' was half a question: a machine played it, with a human idea behind it. We return to this with the engine's view.

### Step 4: reflect

Kind: expect

Prompt: Were you right? What made you guess human or machine, and would you guess the same way now?

- Field "my guess was right or wrong because:" (free text)

### Step 5: card

**What you will be able to do.** Tell the story of engines in dated steps, each with a source. Say what the Deep Blue games show and what they do not. Read a game with a reviewer's eye. Scores here come from one engine at depth 16 (it searched about 16 half-moves ahead) unless stated: evidence at that depth, not proof.

### Step 6: card

**Timeline [S].** February 1996, Philadelphia: Kasparov beat Deep Blue 4-2. May 1997, New York: Deep Blue won 3.5-2.5. IBM built the machine, so its history page is a party's account; Wikipedia's match article gives the same numbers. November to December 2006, Bonn: the program Deep Fritz beat Vladimir Kramnik 4-2 (Wikipedia). Sources are listed at the end.

### Step 7: reflect

Kind: expect

Prompt: From memory: which match did the human win, and which did the machine win? Give city, month and score.

- Field "1996:" (free text)

- Field "1997:" (free text)

### Step 8: card

**1996, game 1.** Deep Blue had White against Kasparov's Sicilian Defence, Alapin Variation, and won in 37 moves. Wikipedia calls it the first game a chess computer won against a reigning world champion at normal classical time controls [S]. Kasparov still won that match 4-2: one game won does not make a match.

### Step 9: card

**What was inside Deep Blue [S, I].** Wikipedia mentions an opening book, with an extended book built from a data set of 700,000 grandmaster games. That is stored human knowledge, not search. The rest, our reading [I]: the machine searched many moves ahead and scored each end position with an evaluation tuned by people. We did not read figures for its speed or hardware, so we give none.

### Step 10: reflect

Kind: expect

Prompt: Deep Blue won game 1 in 1996 and still lost the match. What does that tell you about judging a machine, or a person, from one game? One sentence.

- Field "one game shows:" (free text)

### Step 11: card

**Game 1, 3 May 1997.** Kasparov had White and won in 45 moves [S, Wikipedia]. It began as a Reti-type opening that Wikipedia calls a King's Indian Attack. Watch what White does not do: no early central pawn break, both bishops aimed down long diagonals. The sentences describe what each move does, never what Kasparov was thinking. A board cannot tell us that.

### Step 12: board

Caption: Game 1, moves 1 to 7. Every move develops or prepares; nothing is forced.

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
1. **1. Nf3**: White develops a knight and commits no pawn yet.
2. **1... d5**: Black stakes a claim in the centre.
3. **2. g3**: The pawn opens the diagonal for the bishop on f1.
4. **2... Bg4**: Black's bishop attacks the knight on f3.
5. **3. b3**: The pawn on b3 prepares the other bishop's long diagonal.
6. **3... Nd7**: The knight develops behind the d-pawn.
7. **4. Bb2**: The bishop looks down the long diagonal toward g7.
8. **4... e6**: Black frees the bishop on f8 and supports d5.
9. **5. Bg2**: The second bishop settles on the long diagonal, behind its own knight.
10. **5... Ngf6**: Black develops the last knight toward the centre.
11. **6. O-O**: White castles: king safe, rook free.
12. **6... c6**: A second pawn now supports d5.
13. **7. d3**: The pawn on d3 controls e4 and prepares a later push there.
14. **7... Bd6**: Black develops the bishop and can castle next.

```
  8  r . . q k . . r
  7  p p . n . p p p
  6  . . p b p n . .
  5  . . . p . . . .
  4  . . . . . . b .
  3  . P . P . N P .
  2  P B P . P P B P
  1  R N . Q . R K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r2qk2r/pp1n1ppp/2pbpn2/3p4/6b1/1P1P1NP1/PBP1PPBP/RN1Q1RK1 w kq - 1 8
```

Drawn on the board: arrows b2-g7.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [attackers] After Bg4, 1 black piece attacks the knight on f3.
- [piece_attacks] After Bb2 the bishop attacks exactly these squares: a1, a3, c1, c3, d4, e5, f6, g7.
- [attackers] After d3, 1 white piece attacks e4: the pawn on d3.
- [attackers] After ...c6, 3 black pieces defend the pawn on d5.

### Step 13: card

**Quiet openings are hard to judge.** With nothing forced, a machine score says little: on the next board the engine calls the position level, within a fraction of a pawn [V]. The useful reading is structural. Both sides have set up a centre of pawns, and the plan is to find the right moment to open lines. Watch how that moment arrives.

### Step 14: board

Caption: Game 1, moves 8 to 14. Each side improves small things; look for who is gaining space.

```
  8  r . . q k . . r
  7  p p . n . p p p
  6  . . p b p n . .
  5  . . . p . . . .
  4  . . . . . . b .
  3  . P . P . N P .
  2  P B P . P P B P
  1  R N . Q . R K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: r2qk2r/pp1n1ppp/2pbpn2/3p4/6b1/1P1P1NP1/PBP1PPBP/RN1Q1RK1 w kq - 1 8
```

The line, with the sentence the learner sees at each move:
1. **8. Nbd2**: The knight develops and, with the d-pawn, controls e4.
2. **8... O-O**: Black castles.
3. **9. h3**: The pawn asks the bishop on g4 a question: trade, or retreat?
4. **9... Bh5**: The bishop retreats but keeps an eye on f3.
5. **10. e3**: The pawn on e3 covers d4 and f4.
6. **10... h6**: The pawn on h6 prepares ...g5 and gives the bishop a retreat.
7. **11. Qe1**: The queen steps off the d-file.
8. **11... Qa5**: Black's queen attacks the knight on d2.
9. **12. a3**: The pawn on a3 keeps the black queen off b4.
10. **12... Bc7**: The bishop on c7 aims at the pawn on g3.
11. **13. Nh4**: The knight goes to h4, eyeing f5 and g6.
12. **13... g5**: Black attacks the knight with a pawn.
13. **14. Nhf3**: The knight retreats to f3 and keeps the structure intact.
14. **14... e5**: Black plants a second centre pawn beside d5.

```
  8  r . . . . r k .
  7  p p b n . p . .
  6  . . p . . n . p
  5  q . . p p . p b
  4  . . . . . . . .
  3  P P . P P N P P
  2  . B P N . P B .
  1  R . . . Q R K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r4rk1/ppbn1p2/2p2n1p/q2pp1pb/8/PP1PPNPP/1BPN1PB1/R3QRK1 w - - 0 15
```

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [eval_range] At depth 16 the engine rates the position (before Nbd2) between about -0.5 and +0.8 pawns: roughly level.
- [attackers] After Nbd2, 2 white pieces attack e4: the knight and the d3 pawn.
- [attackers] After h3, 1 white piece attacks g4: the pawn on h3.
- [attackers] After ...Qa5, 1 black piece attacks the knight on d2.
- [attackers] After ...Bc7, 1 black piece attacks the pawn on g3.
- [attackers] After ...g5, 1 black pawn attacks the knight on h4.

### Step 15: board

Caption: Game 1, moves 15 to 23. White fixes the centre; Black opens the kingside.

```
  8  r . . . . r k .
  7  p p b n . p . .
  6  . . p . . n . p
  5  q . . p p . p b
  4  . . . . . . . .
  3  P P . P P N P P
  2  . B P N . P B .
  1  R . . . Q R K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: r4rk1/ppbn1p2/2p2n1p/q2pp1pb/8/PP1PPNPP/1BPN1PB1/R3QRK1 w - - 0 15
```

The line, with the sentence the learner sees at each move:
1. **15. e4**: The pawn on e4 attacks d5: the centre tension begins.
2. **15... Rfe8**: Black's rook supports the e5 pawn.
3. **16. Nh2**: The knight reroutes toward g4 or f1.
4. **16... Qb6**: Black's queen goes to b6, eyeing the pawn on b3.
5. **17. Qc1**: The queen steps back to c1 to cover the bishop on b2.
6. **17... a5**: Black prepares ...a4 against the pawn on b3.
7. **18. Re1**: The rook comes to the e-file to support the pawn on e4.
8. **18... Bd6**: Black's bishop returns to d6.
9. **19. Ndf1**: The knight goes to f1 to reach e3.
10. **19... dxe4**: Black releases the tension: the d-pawn takes on e4.
11. **20. dxe4**: The d-pawn recaptures, and the d-file is now open.
12. **20... Bc5**: Black's bishop eyes f2.
13. **21. Ne3**: The knight takes e3, a square no black pawn attacks.
14. **21... Rad8**: Black's rook takes the open d-file.
15. **22. Nhf1**: Another knight comes to f1 to cover e3 and g3.
16. **22... g4**: Black pushes a pawn at the h3 pawn.
17. **23. hxg4**: White takes the pawn.
18. **23... Nxg4**: Black's knight takes back and eyes e3 and f2.

```
  8  . . . r r . k .
  7  . p . n . p . .
  6  . q p . . . . p
  5  p . b . p . . b
  4  . . . . P . n .
  3  P P . . N . P .
  2  . B P . . P B .
  1  R . Q . R N K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 3rr1k1/1p1n1p2/1qp4p/p1b1p2b/4P1n1/PP2N1P1/1BP2PB1/R1Q1RNK1 w - - 0 24
```

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [eval_range] At depth 16 the engine rates the position before White's e4 push between about -0.5 and +1.0 pawns: still roughly level.
- [attackers] After e4, 1 white pawn attacks d5.
- [attackers] After ...Qb6, 1 black piece attacks the pawn on b3.
- [pawn_attackers] After Ne3, no black pawn attacks e3.
- [open_files] After ...dxe4 and 20.dxe4 the d-file is open (no pawn of either side stands on it).
- [piece_attacks] After Ne3 the knight attacks exactly these squares: c2, c4, d1, d5, f1, f5, g2, g4.
- [piece_attacks] After ...Nxg4 the black knight attacks exactly these squares: e3, e5, f2, f6, h2, h6.

### Step 16: reflect

Kind: expect

Prompt: Before the next board: it is move 34 of game 1 and queens may come off. Which side has the more active pieces? Do you expect trading queens to help that side, or the other?

- Field "my guess:" (free text)

### Step 17: board

Caption: Game 1, moves 34 to 36. Black to move: should the queens come off? The line is what was played.

```
  1  K . Q . . . . R
  2  . B . . . P . .
  3  . P b N . B . P
  4  . . . p . . P p
  5  . . P n . . q .
  6  p P . . . p . .
  7  . . . . . . p .
  8  . k . r r . . .
     h g f e d c b a

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: 3rr1k1/1p6/2p3Pp/1q2nP2/pP2p3/P1B1NbP1/2P3B1/R4Q1K b - - 4 34
```

The line, with the sentence the learner sees at each move:
1. **34... Qxf1+**: Black takes the queen with check.
2. **35. Rxf1**: White recaptures; queens are off.
3. **35... h5**: Black makes a pawn move on the kingside.
4. **36. Kg1**: White tucks the king in.
5. **36... Kf8**: Black's king heads for the centre.

```
  1  . K R . . . . .
  2  . B . . . P . .
  3  . P b N . B . P
  4  . . . p . . P p
  5  p . P n . . . .
  6  . P . . . p . .
  7  . . . . . . p .
  8  . . k r r . . .
     h g f e d c b a

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 3rrk2/1p6/2p3P1/4nP1p/pP2p3/P1B1NbP1/2P3B1/5RK1 w - - 2 37
```

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [move_loses] At depth 16 the queen trade 34...Qxf1+ is at least 0.9 pawns below the engine's best move for Black.
- [legal_move] The trade 34...Qxf1+ is legal.
- [best_move_in] At depth 16 the engine's first choice for Black is 34...h5, not the queen trade.

### Step 18: card

**What game 1 shows.** At depth 16 the engine ranks the queen trade about 1.1 to 1.7 pawns below Black's first choice, 34...h5 (the size varied between runs) [V]. So the machine gave away part of a balanced position. Why it chose the trade, we have no source. Our reading [I]: the trade removed the black queen's pressure near White's king, and White's pawns on f5 and g6 then became the trumps.

### Step 19: board

Caption: Game 1, the finish. Black's rook is active but the g-pawn runs.

```
  8  . . . r r . . .
  7  . . . . . . . .
  6  . . p . . . P k
  5  . p . . . P . .
  4  p P . . p . n .
  3  P . B . . . . .
  2  . . P . . K . .
  1  . . . . . . R .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 3rr3/8/2p3Pk/1p3P2/pP2p1n1/P1B5/2P2K2/6R1 w - - 0 43
```

The line, with the sentence the learner sees at each move:
1. **43. Rxg4**: White takes the knight; the rook is active again.
2. **43... Rd5**: Black's rook takes the d-file.
3. **44. f6**: The pawn on f6 supports a push to g7.
4. **44... Rd1**: Black's rook invades the first rank.
5. **45. g7**: The pawn on g7 cannot be stopped: Black resigns.

```
  8  . . . . r . . .
  7  . . . . . . P .
  6  . . p . . P . k
  5  . p . . . . . .
  4  p P . . p . R .
  3  P . B . . . . .
  2  . . P . . K . .
  1  . . . r . . . .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 4r3/6P1/2p2P1k/1p6/pP2p1R1/P1B5/2P2K2/3r4 b - - 0 45
```

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [eval_range] At depth 16 the engine rates the position before 43.Rxg4 as clearly better for White.

### Step 20: card

**Game 2, 4 May 1997.** Deep Blue had White and won in 45 moves; Wikipedia lists a Ruy Lopez, Smyslov Variation [S]. Kasparov resigned. The early moves are standard theory that a human master would also play. The story is what follows, in a closed middlegame where the plan must be found without a forcing line.

### Step 21: board

Caption: Game 2, moves 1 to 13: the Ruy Lopez set-up. White builds the centre; Black waits.

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
1. **1. e4**: White takes the centre.
2. **1... e5**: Black matches it.
3. **2. Nf3**: The knight attacks the pawn on e5.
4. **2... Nc6**: The knight defends e5.
5. **3. Bb5**: The bishop attacks the knight that defends e5.
6. **3... a6**: Black asks the bishop what it intends.
7. **4. Ba4**: The bishop keeps its diagonal and avoids a trade.
8. **4... Nf6**: Black attacks the pawn on e4.
9. **5. O-O**: White castles. Black could now take on e4 (the Open Variation) but here develops instead; White's e4 pawn is not simply lost.
10. **5... Be7**: Black develops, ready to castle.
11. **6. Re1**: The rook defends e4 and puts the e-file to work.
12. **6... b5**: The pawn attacks the bishop and gains queenside space.
13. **7. Bb3**: The bishop retreats and keeps its aim at f7.
14. **7... d6**: Black supports e5 and frees the bishop on c8.
15. **8. c3**: The pawn on c3 prepares d4.
16. **8... O-O**: Black castles.
17. **9. h3**: The pawn takes g4 away from Black's bishop.
18. **9... h6**: Black gives the king room.
19. **10. d4**: The pawn challenges e5.
20. **10... Re8**: The rook goes to the e-file, behind the pawn on e5.
21. **11. Nbd2**: The knight develops and heads toward the kingside.
22. **11... Bf8**: The bishop steps back, leaving e7 and d7 free for other pieces; a common waiting set-up in this opening.
23. **12. Nf1**: The knight heads for g3.
24. **12... Bd7**: Black develops the last minor piece.
25. **13. Ng3**: The knight reaches g3.
26. **13... Na5**: The knight attacks the bishop on b3.

```
  8  r . . q r b k .
  7  . . p b . p p .
  6  p . . p . n . p
  5  n p . . p . . .
  4  . . . P P . . .
  3  . B P . . N N P
  2  P P . . . P P .
  1  R . B Q R . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r2qrbk1/2pb1pp1/p2p1n1p/np2p3/3PP3/1BP2NNP/PP3PP1/R1BQR1K1 w - - 7 14
```

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [attackers] After Bb5, 1 white piece attacks the knight on c6.
- [attackers] After 2...Nc6, 1 black piece defends the pawn on e5.
- [attackers] After 6...b5, 1 black pawn attacks the bishop on a4.
- [attackers] After 9.h3, 1 white pawn controls g4, so ...Bg4 is not available.
- [attackers] After 10.d4, 2 white pawn attacks e5.
- [attackers] After 4...Nf6, 1 black piece attacks the pawn on e4.
- [attackers] After 6.Re1, 1 white piece defends the pawn on e4.
- [attackers] After 13...Na5, 1 black piece attacks the bishop on b3.

### Step 22: board

Caption: Game 2, moves 14 to 20. The centre is closed; both sides manoeuvre on the wings.

```
  8  r . . q r b k .
  7  . . p b . p p .
  6  p . . p . n . p
  5  n p . . p . . .
  4  . . . P P . . .
  3  . B P . . N N P
  2  P P . . . P P .
  1  R . B Q R . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: r2qrbk1/2pb1pp1/p2p1n1p/np2p3/3PP3/1BP2NNP/PP3PP1/R1BQR1K1 w - - 7 14
```

The line, with the sentence the learner sees at each move:
1. **14. Bc2**: The bishop leaves the knight's attack and frees b3 for the pawn.
2. **14... c5**: Black grabs queenside space and contests d4.
3. **15. b3**: The pawn on b3 attacks c4, a square the knight on a5 could use.
4. **15... Nc6**: The knight returns toward the centre.
5. **16. d5**: The pawn locks the centre and attacks the knight.
6. **16... Ne7**: The knight retreats toward g6.
7. **17. Be3**: The bishop aims at the pawn on c5.
8. **17... Ng6**: Black's knight heads for f4 or h4.
9. **18. Qd2**: The queen develops to d2, next to the bishop on e3.
10. **18... Nh7**: The other knight goes to h7 and heads for g5.
11. **19. a4**: The pawn strikes at the pawn on b5.
12. **19... Nh4**: The knight on g6 jumps to h4.
13. **20. Nxh4**: White trades the knight.
14. **20... Qxh4**: Black recaptures with the queen.

```
  8  r . . . r b k .
  7  . . . b . p p n
  6  p . . p . . . p
  5  . p p P p . . .
  4  P . . . P . . q
  3  . P P . B . N P
  2  . . B Q . P P .
  1  R . . . R . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r3rbk1/3b1ppn/p2p3p/1ppPp3/P3P2q/1PP1B1NP/2BQ1PP1/R3R1K1 w - - 0 21
```

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [eval_range] At depth 16 the engine rates the position before 14.Bc2 as modestly better for White (see range).
- [attackers] After 15.b3, 1 white pawn attacks c4, covering the jump of the knight.
- [attackers] After 16.d5, 1 white pawn attacks c6: the knight must move.
- [attackers] After 17.Be3, 1 white piece attacks the pawn on c5.
- [attackers] After 19.a4, 1 white pawn attacks the pawn on b5.

### Step 23: card

**The part we skip.** Moves 21 to 35 are not shown here; Wikipedia lists them [S]. Our engine's depth-16 score moves from about +0.8 before 14.Bc2 to about +1.8 before 36.axb5 [V]: Black drifted from slightly worse to clearly worse while the centre stayed closed. Our reading [I]: in closed positions the side with more space and a plan on the wing can improve slowly, while the other side has fewer useful squares.

### Step 24: reflect

Kind: unsure

Prompt: In a closed position like this, what plan would you try for White? Write it as one sentence. Then name one thing a score alone could not tell you.

- Field "my plan for White:" (free text)

- Field "a score cannot tell me:" (free text)

### Step 25: board

Caption: Game 2, moves 36 to 43. White's rook and queen take the open file; Black defends.

```
  8  r . r . q . k .
  7  . . . . . . p .
  6  p . . b . p . p
  5  . p . P p P . .
  4  P P p . . . . .
  3  . . P . . . . P
  2  R . B . . Q P .
  1  R . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: r1r1q1k1/6p1/p2b1p1p/1p1PpP2/PPp5/2P4P/R1B2QP1/R5K1 w - - 0 36
```

The line, with the sentence the learner sees at each move:
1. **36. axb5**: White opens the a-file.
2. **36... axb5**: Black recaptures.
3. **37. Be4**: The bishop defends the pawn on d5.
4. **37... Rxa2**: Black trades a pair of rooks.
5. **38. Qxa2**: White takes with the queen on the open a-file.
6. **38... Qd7**: Black's queen steps to d7.
7. **39. Qa7**: The queen invades on the seventh rank.
8. **39... Rc7**: Black's rook defends along the rank.
9. **40. Qb6**: The queen attacks the pawn on b5.
10. **40... Rb7**: Black's rook comes to b7, facing the queen.
11. **41. Ra8+**: The rook reaches the eighth rank with check.
12. **41... Kf7**: The king steps aside.
13. **42. Qa6**: The queen goes to a6.
14. **42... Qc7**: Black's queen defends.
15. **43. Qc6**: The queen takes c6.
16. **43... Qb6+**: Black's queen checks.

```
  8  R . . . . . . .
  7  . r . . . k p .
  6  . q Q b . p . p
  5  . p . P p P . .
  4  . P p . B . . .
  3  . . P . . . . P
  2  . . . . . . P .
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: R7/1r3kp1/1qQb1p1p/1p1PpP2/1Pp1B3/2P4P/6P1/6K1 w - - 11 44
```

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [eval_range] At depth 16 the engine rates the position before 36.axb5 as clearly better for White.
- [attackers] After 37.Be4, 1 white bishop defends the pawn on d5.

### Step 26: board

Caption: Game 2, moves 44 and 45. Wikipedia reports that, in the film Game Over, the journalist Mig Greengard called Deep Blue's final king move a serious error [S]; we take that to mean 44.Kf1 [I]. In our runs at depths 16 and 18 the engine always ranked Kf1 below the best king move, by about 0.4 to 1.9 pawns, but the order of the other two changed between runs [V]. White stays clearly better.

```
  8  R . . . . . . .
  7  . r . . . k p .
  6  . q Q b . p . p
  5  . p . P p P . .
  4  . P p . B . . .
  3  . . P . . . . P
  2  . . . . . . P .
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: R7/1r3kp1/1qQb1p1p/1p1PpP2/1Pp1B3/2P4P/6P1/6K1 w - - 11 44
```

The line, with the sentence the learner sees at each move:
1. **44. Kf1**: White steps to f1, one of three legal king moves.
2. **44... Rb8**: Black's rook comes to b8.
3. **45. Ra6**: White's rook attacks the queen on b6.

```
  8  . r . . . . . .
  7  . . . . . k p .
  6  R q Q b . p . p
  5  . p . P p P . .
  4  . P p . B . . .
  3  . . P . . . . P
  2  . . . . . . P .
  1  . . . . . K . .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 1r6/5kp1/RqQb1p1p/1p1PpP2/1Pp1B3/2P4P/6P1/5K2 b - - 14 45
```

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_destinations] White's king, in check, has exactly these squares: f1, h1, h2.
- [eval_range] At depth 16 the engine rates the position (White in check) as clearly better for White.
- [attackers] After 45.Ra6, 2 white pieces attack the black queen on b6.
- [best_move_in] At depth 16 the engine's first choice is a king move to h1 or h2, not f1.
- [move_loses] At depth 16 the move 44.Kf1 is below the engine's first choice by at least 0.3 pawns.

### Step 27: board

Caption: Position after 45.Ra6, Black to move. Wikipedia says Kasparov could have held a draw by perpetual check, starting 45...Qe3 46.Qxd6 Re8 [S]. Our engine still rates White ahead. The moves shown are the line the source names; we stop there.

```
  1  . . K . . . . .
  2  . P . . . . . .
  3  P . . . . P . .
  4  . . . B . p P .
  5  . . P p P . p .
  6  p . p . b Q q R
  7  . p k . . . . .
  8  . . . . . . r .
     h g f e d c b a

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: 1r6/5kp1/RqQb1p1p/1p1PpP2/1Pp1B3/2P4P/6P1/5K2 b - - 14 45
```

The line, with the sentence the learner sees at each move:
1. **45... Qe3**: Black's queen goes to e3, near the white king.
2. **46. Qxd6**: White takes the bishop on d6.
3. **46... Re8**: Black's rook comes to e8.

```
  1  . . K . . . . .
  2  . P . . . . . .
  3  P . . q . P . .
  4  . . . B . p P .
  5  . . P p P . p .
  6  p . p . Q . . R
  7  . p k . . . . .
  8  . . . r . . . .
     h g f e d c b a

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 4r3/5kp1/R2Q1p1p/1p1PpP2/1Pp1B3/2P1q2P/6P1/5K2 w - - 1 47
```

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] At depth 16 the engine's first choice for Black is 45...Qe3.
- [eval_range] At depth 22 the engine still rates the position (Black to move) as better for White: between 0.6 and 3.0 pawns.
- [eval_range] At depth 16 the engine rates the position (Black to move) as better for White: between 0.6 and 2.5 pawns.

### Step 28: card

**Sources against an engine.** Wikipedia says post-game analysis showed Kasparov could have drawn by perpetual check [S]. Our engine rates White ahead by about 1.0 to 1.1 pawns at depths 16 and 22 [V]; at depth 26 about 0.9 to 1.05 in one-off runs, not re-run by the validator. Possible reasons: our engine is too shallow, the source names another line, or engines misjudged it. We cannot tell which. [H] The draw claim needs a deeper check than we ran.

### Step 29: reflect

Kind: unsure

Prompt: Which of the three reasons would you test first, and how? Your answer is a plan, not a verdict.

- Field "first I would:" (free text)

### Step 30: item

**Task `IHI-LHIENGINESHUMANS1-3`** (find_move, difficulty cue 3)

Black to move (game 2). Find the move the engine ranks first.

```
  8  . r . . . . . .
  7  . . . . . k p .
  6  R q Q b . p . p
  5  . p . P p P . .
  4  . P p . B . . .
  3  . . P . . . . P
  2  . . . . . . P .
  1  . . . . . K . .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black.
FEN: 1r6/5kp1/RqQb1p1p/1p1PpP2/1Pp1B3/2P4P/6P1/5K2 b - - 14 45
```

**Accepted answer(s):** Qe3

Feedback shown for wrong moves:
- Qxc6: Trading queens. At depth 16 the engine rates it at least 2 pawns below Qe3.

**Explanation shown:** At depth 16 the engine puts the queen move to e3 first and the queen trade on c6 far behind. Whether it holds a draw is the open question of this lesson.

Hints (in order):
1. Look at White's king on f1 and the queen on b6.
2. Which black move brings the queen closer to that king?
3. The queen goes to the third rank.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] Qe3 is legal.
- [best_move_in] At depth 16 the engine's first choice is Qe3.
- [move_loses] At depth 16 Qxc6 is at least 2 pawns below Qe3.
- [piece_on] The white king stands on f1.

### Step 31: card

**Game 6, 11 May 1997.** Deep Blue had White against the Caro-Kann Defence, Steinitz Variation (Wikipedia). Kasparov resigned after 19 moves [S]. The first seven moves are a normal opening; the hook position comes next. The line is shown first, with a sentence per move, and only then the sacrifice.

### Step 32: board

Caption: Game 6, moves 1 to 7: how the hook position arose. White gains time against h7, then Black plays h6.

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
1. **1. e4**: White takes space in the centre and opens the bishop on f1.
2. **1... c6**: Black prepares to challenge the centre with ...d5.
3. **2. d4**: White builds a pair of centre pawns.
4. **2... d5**: Black challenges at once; the pawn on d5 attacks e4.
5. **3. Nc3**: The knight defends the pawn on e4.
6. **3... dxe4**: Black takes: the central pawns are traded.
7. **4. Nxe4**: The knight recaptures and stands in the centre.
8. **4... Nd7**: Black develops the knight to d7 so a later Nxf6+ would not damage the pawns.
9. **5. Ng5**: The knight attacks e6, f7 and h7 at once.
10. **5... Ngf6**: Black develops the other knight, which defends h7.
11. **6. Bd3**: The bishop joins the knight against h7.
12. **6... e6**: Black opens the bishop on f8.
13. **7. N1f3**: The second knight joins and defends the knight on g5.
14. **7... h6**: Black attacks the knight on g5 with a pawn.

```
  8  r . b q k b . r
  7  p p . n . p p .
  6  . . p . p n . p
  5  . . . . . . N .
  4  . . . P . . . .
  3  . . . B . N . .
  2  P P P . . P P P
  1  R . B Q K . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r1bqkb1r/pp1n1pp1/2p1pn1p/6N1/3P4/3B1N2/PPP2PPP/R1BQK2R w KQkq - 0 8
```

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [attackers] After 1...c6, 1 black pawn controls d5: the pawn on c6.
- [attackers] After 3...d5, 1 black pawn attacks the pawn on e4.
- [attackers] After 4.Nc3, 1 white knight defends e4.
- [pawn_set] Had Black played ...Nf6 instead, Nxf6+ gxf6 would double Black's pawns on the f-file.
- [piece_attacks] After 5.Ng5 the knight attacks exactly: e4, e6, f3, f7, h3, h7.
- [attackers] After 6.Bd3, 2 white pieces attack h7: the knight and the bishop.
- [attackers] After 7.N1f3, 2 white piece defends the knight on g5.
- [attackers] After 7...h6, 1 black pawn attacks the knight on g5.

### Step 33: item

**Task `IHI-LHIENGINESHUMANS1-1`** (classify_position, difficulty cue 3)

White to move (Deep Blue, game 6). If the knight on g5 takes the pawn on e6, how many black pieces can take it back?

```
  8  r . b q k b . r
  7  p p . n . p p .
  6  . . p . p n . p
  5  . . . . . . N .
  4  . . . P . . . .
  3  . . . B . N . .
  2  P P P . . P P P
  1  R . B Q K . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: r1bqkb1r/pp1n1pp1/2p1pn1p/6N1/3P4/3B1N2/PPP2PPP/R1BQK2R w KQkq - 0 8
```

Options shown: none / one / two or more

**Accepted answer:** {"class": "one"}

**Explanation shown:** Exactly one black piece, the pawn on f7, can take the knight on e6. At depth 16 the engine also ranks the capture first. Depth-limited evidence, not proof.

Hints (in order):
1. Look at which black pieces attack e6 right now.
2. Count attackers of the square e6 once the knight is on it.
3. Not a piece: one of the pawns.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] Nxe6 is legal.
- [attackers] After Nxe6, one black piece can capture the knight on e6.
- [piece_on] The black pawn on f7 is that piece.
- [best_move_in] At depth 16 the engine's first choice is Nxe6.

### Step 34: board

Caption: Game 6, moves 8 to 11. The sacrifice and its follow-up.

```
  8  r . b q k b . r
  7  p p . n . p p .
  6  . . p . p n . p
  5  . . . . . . N .
  4  . . . P . . . .
  3  . . . B . N . .
  2  P P P . . P P P
  1  R . B Q K . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: r1bqkb1r/pp1n1pp1/2p1pn1p/6N1/3P4/3B1N2/PPP2PPP/R1BQK2R w KQkq - 0 8
```

The line, with the sentence the learner sees at each move:
1. **8. Nxe6**: White gives a knight for a pawn. Only the pawn on f7 can take back.
2. **8... Qe7**: Black adds the queen against the knight.
3. **9. O-O**: White ignores the knight and castles, leaving Black to take it.
4. **9... fxe6**: Black takes. Black's e-pawn now has no neighbours.
5. **10. Bg6+**: The bishop checks the king along the diagonal.
6. **10... Kd8**: The king steps to d8; having moved, it can never castle.
7. **11. Bf4**: The bishop attacks the pawn on c7, which only the king defends.
8. **11... b5**: Black makes room for the bishop on c8.

```
  8  r . b k . b . r
  7  p . . n q . p .
  6  . . p . p n B p
  5  . p . . . . . .
  4  . . . P . B . .
  3  . . . . . N . .
  2  P P P . . P P P
  1  R . . Q . R K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r1bk1b1r/p2nq1p1/2p1pnBp/1p6/3P1B2/5N2/PPP2PPP/R2Q1RK1 w - - 0 12
```

Drawn on the board: arrows g5-e6.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [eval_range] At depth 16 the engine rates the position (White to move) as better for White.
- [attackers] After Nxe6, 1 black pawn can capture the knight on e6.
- [attackers] After ...Qe7, 2 black pieces attack the knight on e6.
- [attackers] After 10.Bg6+, 1 white piece attacks the king on e8.
- [pawn_set] After 9...fxe6 Black's isolated pawns are on: e6.
- [attackers] After 11.Bf4, 1 white piece attacks the pawn on c7.
- [attackers] After 11.Bf4, 1 black piece defends c7: only the king.

### Step 35: item

**Task `IHI-LHIENGINESHUMANS1-2`** (classify_position, difficulty cue 3)

White to move. If the bishop goes to g6, how many black pieces can capture it there?

```
  8  r . b . k b . r
  7  p p . n q . p .
  6  . . p . p n . p
  5  . . . . . . . .
  4  . . . P . . . .
  3  . . . B . N . .
  2  P P P . . P P P
  1  R . B Q . R K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: r1b1kb1r/pp1nq1p1/2p1pn1p/8/3P4/3B1N2/PPP2PPP/R1BQ1RK1 w kq - 0 10
```

Options shown: none / one / two or more

**Accepted answer:** {"class": "none"}

**Explanation shown:** No black piece covers g6, so the bishop checks the king without being taken; the king must move and loses its right to castle. At depth 16 the engine ranks the check first.

Hints (in order):
1. Check each black piece in turn: which squares does it attack?
2. Does any black pawn or piece cover g6?
3. Also ask what the bishop on g6 attacks.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] Bg6+ is legal.
- [attackers] After Bg6+, no black piece attacks the bishop on g6.
- [best_move_in] At depth 16 the engine's first choice is Bg6+.
- [piece_on] The black king stands on e8.

### Step 36: board

Caption: Game 6, moves 12 to 19. White increases the pressure; Black's king never finds safety.

```
  8  r . b k . b . r
  7  p . . n q . p .
  6  . . p . p n B p
  5  . p . . . . . .
  4  . . . P . B . .
  3  . . . . . N . .
  2  P P P . . P P P
  1  R . . Q . R K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: r1bk1b1r/p2nq1p1/2p1pnBp/1p6/3P1B2/5N2/PPP2PPP/R2Q1RK1 w - - 0 12
```

The line, with the sentence the learner sees at each move:
1. **12. a4**: White attacks the pawn on b5.
2. **12... Bb7**: Black's bishop develops.
3. **13. Re1**: The rook takes the e-file; the pawn on e6 is the first target.
4. **13... Nd5**: Black's knight heads for a central square.
5. **14. Bg3**: The bishop retreats but keeps its aim at c7.
6. **14... Kc8**: The king walks toward the queenside.
7. **15. axb5**: White opens the a-file toward a7.
8. **15... cxb5**: Black recaptures.
9. **16. Qd3**: The queen attacks the pawn on b5.
10. **16... Bc6**: Black's bishop defends b5.
11. **17. Bf5**: White offers the bishop: taking it opens the e-file.
12. **17... exf5**: Black takes the bishop, and the rook now attacks the queen.
13. **18. Rxe7**: The rook takes the queen.
14. **18... Bxe7**: Black takes the rook.
15. **19. c4**: The pawn attacks the knight on d5. Black resigns.

```
  8  r . k . . . . r
  7  p . . n b . p .
  6  . . b . . . . p
  5  . p . n . p . .
  4  . . P P . . . .
  3  . . . Q . N B .
  2  . P . . . P P P
  1  R . . . . . K .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r1k4r/p2nb1p1/2b4p/1p1n1p2/2PP4/3Q1NB1/1P3PPP/R5K1 b - - 0 19
```

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [eval_range] At depth 16 the engine rates the position before 12.a4 as clearly better for White.
- [attackers] After 12.a4, 1 white pawn attacks the pawn on b5.
- [attackers] After 13.Re1, 1 white piece attacks the pawn on e6.
- [attackers] After 16.Qd3, 1 white piece attacks the pawn on b5.
- [attackers] After 14.Bg3, 1 white piece attacks the pawn on c7.
- [attackers] After 16...Bc6, 1 black piece defends b5.
- [attackers] After 17...exf5, 1 white piece attacks the black queen on e7.
- [attackers] After 19.c4, 1 white pawn attacks the knight on d5.

### Step 37: board

Caption: Game 6, the final position, Black to move. Black resigned here.

```
  1  . K . . . . . R
  2  P P P . . . P .
  3  . B N . Q . . .
  4  . . . . P P . .
  5  . . p . n . p .
  6  p . . . . b . .
  7  . p . b n . . p
  8  r . . . . k . r
     h g f e d c b a

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: r1k4r/p2nb1p1/2b4p/1p1n1p2/2PP4/3Q1NB1/1P3PPP/R5K1 b - - 0 19
```

Drawn on the board: highlighted squares d5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [eval_range] At depth 16 the engine rates the final position (Black to move) as clearly better for White.
- [attackers] 1 white pawn attacks the knight on d5.

### Step 38: board

Caption: Game 6 before 7...h6, Black to move. At depth 16 the engine prefers developing the bishop first; this is its suggested line, not a game.

```
  1  R . . K Q B . R
  2  P P P . . P P P
  3  . . N . B . . .
  4  . . . . P . . .
  5  . N . . . . . .
  6  . . n p . p . .
  7  p p p . n . p p
  8  r . b k q b . r
     h g f e d c b a

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: r1bqkb1r/pp1n1ppp/2p1pn2/6N1/3P4/3B1N2/PPP2PPP/R1BQK2R b KQkq - 1 7
```

The line, with the sentence the learner sees at each move:
1. **7... Bd6**: Black develops the bishop first and leaves the pawn alone.
2. **8. Qe2**: White develops the queen.
3. **8... h6**: The pawn move comes a move later.
4. **9. Ne4**: The knight retreats to the centre.
5. **9... Nxe4**: Black trades knights.
6. **10. Qxe4**: White recaptures with the queen.

```
  1  R . . K . B . R
  2  P P P . . P P P
  3  . . N . B . . .
  4  . . . Q P . . .
  5  . . . . . . . .
  6  p . . p b p . .
  7  . p p . n . p p
  8  r . . k q b . r
     h g f e d c b a

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r1bqk2r/pp1n1pp1/2pbp2p/8/3PQ3/3B1N2/PPP2PPP/R1B1K2R b KQkq - 0 10
```

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [move_loses] At depth 16, 7...h6 is at least 0.2 pawns below the engine's best move for Black.
- [best_move_in] At depth 16 the engine's first choice for Black is a different move: f8d6.

### Step 39: board

Caption: Black to move after the sacrifice. The engine also prefers taking with the pawn at depth 16; the queen move that was played is close behind.

```
  1  R . . K Q B . R
  2  P P P . . P P P
  3  . . N . B . . .
  4  . . . . P . . .
  5  . . . . . . . .
  6  p . n N . p . .
  7  . p p . n . p p
  8  r . b k q b . r
     h g f e d c b a

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: r1bqkb1r/pp1n1pp1/2p1Nn1p/8/3P4/3B1N2/PPP2PPP/R1BQK2R b KQkq - 0 8
```

The line, with the sentence the learner sees at each move:
1. **8... fxe6**: Black takes the knight with the pawn.
2. **9. Bg6+**: The bishop checks the king.
3. **9... Ke7**: The king steps to e7, where it stays in the centre.

```
  1  R . . K Q B . R
  2  P P P . . P P P
  3  . . N . . . . .
  4  . . . . P . . .
  5  . . . . . . . .
  6  p B n p . p . .
  7  . p . k n . p p
  8  r . b . q b . r
     h g f e d c b a

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r1bq1b1r/pp1nk1p1/2p1pnBp/8/3P4/5N2/PPP2PPP/R1BQK2R w KQ - 2 10
```

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] At depth 16 the engine's first choice for Black is to take with the pawn.
- [attackers] Before Black's move, 1 black pieces attack the knight on e6.

### Step 40: board

Caption: After 9.O-O Black could try to avoid the pawn capture. At depth 16 that costs at least 3 pawns.

```
  1  . K R . Q B . R
  2  P P P . . P P P
  3  . . N . B . . .
  4  . . . . P . . .
  5  . . . . . . . .
  6  p . n N . p . .
  7  . p p q n . p p
  8  r . b k . b . r
     h g f e d c b a

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: r1b1kb1r/pp1nqpp1/2p1Nn1p/8/3P4/3B1N2/PPP2PPP/R1BQ1RK1 b kq - 2 9
```

The line, with the sentence the learner sees at each move:
1. **9... Nd5**: Black tries to avoid taking the knight.
2. **10. Nxf8**: The knight takes the bishop on f8; the knight on d7 recaptures.
3. **10... Nxf8**: The knight on d7 recaptures on f8.
4. **11. Re1**: The rook takes the e-file.
5. **11... Be6**: Black's bishop blocks the e-file.
6. **12. c4**: The pawn attacks the knight on d5.

```
  1  . K . R Q B . R
  2  P P P . . . P P
  3  . . N . B . . .
  4  . . . . P P . .
  5  . . . . n . . .
  6  p . . b . p . .
  7  . p p q . . p p
  8  r . n k . . . r
     h g f e d c b a

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r3kn1r/pp2qpp1/2p1b2p/3n4/2PP4/3B1N2/PP3PPP/R1BQR1K1 b kq - 0 12
```

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [move_loses] At depth 16 moving the knight to d5 is at least 3 pawns below the engine's best move.
- [move_loses] At depth 16 moving the other knight to b6 is at least 3 pawns below the engine's best move.

### Step 41: card

**Where did the sacrifice come from?** Wikipedia calls it a well-known refutation of Kasparov's set-up [S], so the idea was human theory before the match. Whether Deep Blue calculated it or had it stored in its opening book, we have no source [H]. Our engine ranks the sacrifice first, and prefers 7...Bd6 to Kasparov's 7...h6 [V]: the move order, not only the sacrifice, let it work [I].

### Step 42: reflect

Kind: unsure

Prompt: Which explanation seems likelier to you, search or preparation, and what would change your mind?

- Field "I lean toward:" (free text)

- Field "I would change my mind if:" (free text)

### Step 43: card

**What one match can and cannot show.** It shows that in May 1997 a machine built by a company, and prepared against this opponent, won a six-game match: three draws, one win for the human, two for the machine. It does not show that machines beat every human, or that the machine understood chess. Six games and one opponent are a small sample, the hardware was special, and IBM was a party to the match [S, I].

### Step 44: reflect

Kind: unsure

Prompt: Decide: 'The 1997 match proved computers play chess better than every human.' Is that supported, partly supported, or not supported, and what would you need to see?

- Field "my verdict:" with options: supported / partly supported / not supported; no single correct answer (a guess or a self-report)

### Step 45: card

**A fair reading [H].** The 1997 loss mattered less for chess than for how people felt about computers. The match was a cultural turning point more than a technical proof. You may disagree: a match with fair terms could have been more convincing.

### Step 46: reflect

Kind: expect

Prompt: Do you agree that the match was more a cultural turning point than a technical proof? Give one reason for and one against.

- Field "for:" (free text)

- Field "against:" (free text)

### Step 47: card

**Software and open engines [S].** The 2006 Bonn match was won by Deep Fritz, a commercial program. Stockfish is an open-source engine. Its version 12, released on 2 September 2020, made NNUE (a neural-network evaluation) its default [Stockfish blog]. The project's own post says version 12 won far more game pairs than it lost against version 11.

### Step 48: card

**The neural era [S].** The paper Mastering Chess and Shogi by Self-Play was first submitted to arXiv on 5 December 2017 (arXiv 1712.01815). Leela Chess Zero was announced on 9 January 2018 as an open project built on the same idea and adapted from the Go program Leela Zero; it won the engine championship TCEC season 15 in May 2019 (Wikipedia). We quote no AlphaZero match score: we read only the abstract page, and the score has one source.

### Step 49: reflect

Kind: count

Prompt: Write the year of each event, from memory.

- Field "Deep Fritz beats Kramnik in Bonn:" (free text)

- Field "AlphaZero preprint on arXiv:" (free text)

- Field "Leela Chess Zero announced:" (free text)

- Field "Stockfish 12 makes NNUE the default:" (free text)

### Step 50: reflect

Kind: expect

Prompt: For one of these dates, name its source and say how close that source is to the event: a party, a project's own page, or an outside summary.

- Field "date, source, how close:" (free text)

### Step 51: card

**Two ways to look.** An engine does two jobs: it searches (tries moves ahead) and it evaluates (judges the position it reaches). Early programs leaned on search speed. Neural evaluation lets a modern engine judge a position well after fewer lookups. [I] That is our reading of the sources above, not a measurement. The next two boards show what a search that is too shallow can miss.

### Step 52: board

Caption: A bishop and a rook pawn against a bare king, White's king on g6, Black to move. Depth 2: the engine thinks White is winning easily. Look before you trust it.

```
  8  . . . . . . . k
  7  . . . . . . . .
  6  . . . . . . K P
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  . . . . . B . .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: 7k/8/6KP/8/8/8/8/5B2 b - - 0 1
```

Drawn on the board: arrows h6-h8.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [eval_range] At depth 2 the engine rates this position (Black to move) as winning for White by five pawns or more.
- [piece_on] White has a bishop on f1, a light square.
- [piece_on] White has a pawn on h6.

### Step 53: contrast

Title: Same pawn, same material: what changes?

Prompt: Predict first. Same pawn, same kings, Black to move in both; only the bishop's square differs (f1 in one, g1 in the other). With best play, which one is a draw?

**The working board:**

**Task `IHI-LHIENGINESHUMANS1-4`** (predict_outcome, difficulty cue 3)

Black to move: White has a bishop and a rook pawn against a bare king. With best play, who wins?

```
  8  . . . . . . . k
  7  . . . . . . . .
  6  . . . . . . K P
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  . . . . . B . .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black.
FEN: 7k/8/6KP/8/8/8/8/5B2 b - - 0 1
```

**Accepted answer:** {"outcome": "draw"}

**Explanation shown:** The bishop and the promotion corner h8 are on opposite colours, so the bishop can never drive the king from the corner: a draw by the tablebase, though the depth-16 engine score is slightly above level.

Hints (in order):
1. Look at the corner h8 where Black's king stands.
2. Which squares can this bishop ever reach from f1?
3. Does it ever control h8?

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [tablebase] The 7-man tablebase says the position (Black to move) is a draw.
- [eval_range] At depth 16 the engine rates it slightly better for White (about +0.7), not a draw: a score is not the result.
- [piece_on] A white bishop stands on f1 (a light square).
- [piece_on] A white pawn stands on h6.

**The failing board:**

**Task `IHI-LHIENGINESHUMANS1-5`** (predict_outcome, difficulty cue 3)

Black to move: White has a bishop and a rook pawn against a bare king. With best play, who wins?

```
  8  . . . . . . . k
  7  . . . . . . . .
  6  . . . . . . K P
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  . . . . . . B .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black.
FEN: 7k/8/6KP/8/8/8/8/6B1 b - - 0 1
```

**Accepted answer:** {"outcome": "White wins"}

**Explanation shown:** Now the bishop is on the same colour as the corner h8, so it can control the queening square: a win by the tablebase.

Hints (in order):
1. Look at the corner h8 where Black's king stands.
2. Which squares can this bishop ever reach from g1?
3. Does it ever control h8?

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [tablebase] The 7-man tablebase says Black, the side to move, loses.
- [piece_on] A white bishop stands on g1 (a dark square).
- [piece_on] A white pawn stands on h6.

### Step 54: board

Caption: The same position played out, Black to move.

```
  8  . . . . . . . k
  7  . . . . . . . .
  6  . . . . . . K P
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  . . . . . B . .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: 7k/8/6KP/8/8/8/8/5B2 b - - 0 1
```

The line, with the sentence the learner sees at each move:
1. **1... Kg8**: Black's king steps aside.
2. **2. Bb5**: White's bishop waits; it cannot help the pawn queen.
3. **2... Kh8**: The king returns to the corner.
4. **3. Bd7**: A bishop tempo move.
5. **3... Kg8**: The king steps out again.
6. **4. h7+**: The pawn gives check; the king must go back, and g8 is now covered.
7. **4... Kh8**: Black's king returns to h8.
8. **5. Bc6**: Any bishop move leaves Black with no legal move. White cannot win.

```
  8  . . . . . . . k
  7  . . . . . . . P
  6  . . B . . . K .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  . . . . . . . .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 7k/7P/2B3K1/8/8/8/8/8 b - - 2 5
```

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [tablebase] The 7-man tablebase says this position (Black to move) is a draw.
- [eval_range] At depth 16 the engine rates it as level to slightly better for White (about +0.7): far from the five pawns of depth 2, yet still not the true result.

### Step 55: board

Caption: The end of that line, Black to move. Stalemate.

```
  8  . . . . . . . k
  7  . . . . . . . P
  6  . . B . . . K .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  . . . . . . . .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: 7k/7P/2B3K1/8/8/8/8/8 b - - 2 5
```

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [game_state] Black has no legal move and is not in check: stalemate, a draw.

### Step 56: card

**Why the shallow score failed.** Depth 2 sees the pawn about to queen and counts it as won. The corner h8 is a dark square and this bishop is light, so it can never cover the corner: Black's king shuffles and stalemate follows. Depth 2 is far shallower than any 1997 machine, so this shows only that a shallow search misreads fortresses, nothing about Deep Blue [I]. Depth 16 gives about +0.7: better, yet not the true result, a draw. The contrast is score versus tablebase.

### Step 57: board

Caption: The same pawn with a dark-squared bishop on g1, Black to move: the bishop can control h8 and the game ends in mate. Compare it with the draw above.

```
  8  . . . . . . . k
  7  . . . . . . . .
  6  . . . . . . K P
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  . . . . . . B .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: 7k/8/6KP/8/8/8/8/6B1 b - - 0 1
```

The line, with the sentence the learner sees at each move:
1. **1... Kg8**: Black's king must step out; it has no other move.
2. **2. h7+**: The pawn checks; the king must go back.
3. **2... Kh8**: Black's king returns to h8.
4. **3. Bd4#**: The bishop checks along the long diagonal, and the king has no square.

```
  8  . . . . . . . k
  7  . . . . . . . P
  6  . . . . . . K .
  5  . . . . . . . .
  4  . . . B . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  . . . . . . . .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 7k/7P/6K1/8/3B4/8/8/8 b - - 2 3
```

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [tablebase] The 7-man tablebase says the side to move (Black) loses.
- [legal_destinations] Black's king has exactly one legal move: g8.
- [piece_on] White has a bishop on g1, a dark square.

### Step 58: board

Caption: The end of that line, Black to move. Checkmate.

```
  8  . . . . . . . k
  7  . . . . . . . P
  6  . . . . . . K .
  5  . . . . . . . .
  4  . . . B . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  . . . . . . . .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: 7k/7P/6K1/8/3B4/8/8/8 b - - 2 3
```

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [game_state] Black has no legal move and is in check: checkmate.

### Step 59: card

**Using this.** When an engine score and your own sense disagree, ask what the score is blind to: a fortress, a stalemate, a position that needs a long plan. A score is a summary of a search; the board is the evidence. Later lessons use engines the other way round: engine last, after you have found the idea yourself.

### Step 60: card

**What a club player faces.** Deep Blue was a special IBM machine [S]. The engine in this app is Stockfish 19 lite, running in your browser [V]. How the two would score against each other we have not measured, so we make no claim [H]. What matters for you: a free engine is a tool in your hands, so the habits in this lesson (test the score, read the source) are yours to use.

### Step 61: reflect

Kind: expect

Prompt: Name two differences between Deep Blue in 1997 and the engine on a phone today. One must be a dated fact from this lesson; one may be your own conjecture, marked as such.

- Field "a dated fact:" (free text)

- Field "a conjecture [H]:" (free text)

### Step 62: reflect

Kind: expect

Prompt: Teach it back. Imagine a friend says: 'Computers solved chess in 1997.' Explain why that is not what happened.

- Field "the idea:" (free text)

- Field "what the 1997 match did show:" (free text)

- Field "one example from the games or the fortress:" (free text)

- Field "one thing I am unsure of:" (free text)

### Step 63: card

**Self-check.** Did you give a date and a source? Did you say what one match cannot show? Did you give an example a friend could set up on a board (the fortress works)? Did you mark one claim as your own guess? If you cannot answer one of these, reopen the matching board. The app grades none of this; you are the reviewer.

### Step 64: card

**Recap.** 1996: human won, 4-2. 1997: machine won, 3.5-2.5, under IBM's own organisation. 2006: Deep Fritz beat Kramnik. 2017 to 2020: neural ideas reached open engines. One match is a small sample. Scores are depth-limited evidence; fortresses and stalemates show why. Sources can disagree with an engine, and then you test, you do not pick a winner.

### Step 65: reflect

Kind: expect

Prompt: Your plan: write one engine habit you will try after this lesson (when you use an engine, and what you will do first), and one thing you will check before believing a source.

- Field "my engine habit:" (free text)

- Field "before believing a source I will:" (free text)

---

## Reviewer scorecard

Fill in the file `content/review/L-HI-ENGINES-HUMANS-1.json` (a template is below). Scale 1 to 5 for each dimension: 1 = wrong or unusable, 3 = acceptable with edits, 5 = I would put my name to it as it stands.
Revision to review: `e76b9651`. If the lesson text changes after your review, your sign-off no longer applies and the lesson goes back to needs-human.

| Dimension | What to judge | Score |
|---|---|---|
| chess | every statement, line and explanation is correct; near-misses are really near-misses | |
| clarity | the explanation actually explains (mechanism, conditions), in plain words | |
| prerequisites | the lesson assumes only what the learner has met | |
| tasks | each task has one defensible answer and a fair explanation | |

```json
{
  "lesson": "L-HI-ENGINES-HUMANS-1",
  "revision": "e76b9651",
  "reviewer": "<your name>",
  "reviewer_role": "strong-player",
  "date": "YYYY-MM-DD",
  "scores": {"chess": 0, "clarity": 0, "prerequisites": 0, "tasks": 0},
  "comments": "<what to change, by step number>",
  "verdict": "approved"
}
```

`reviewer_role` is `strong-player` or `teacher`. `verdict` is `approved` or `changes-requested`. See docs/review-slice.md.
