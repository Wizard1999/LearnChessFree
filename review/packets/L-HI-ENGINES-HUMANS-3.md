# Review packet: L-HI-ENGINES-HUMANS-3

**Engines and humans 3: using an engine to learn**

- Skill: GAME.HISTORY (D1); stage: exemplar; stated length: 55 minutes
- Steps: 64 (9 are tasks); revision: `0c4fe1c1`
- Review status now: needs-human

## What the lesson says the learner will be able to do

- Writes a one-sentence verdict (move, threat, plan) for a position before asking an engine, then compares ideas before numbers
- Reads an engine score with its sign, its depth and a mate score, and says in plain words who is better and by roughly how much
- Reads an engine line by saying what each move threatens and what it stops, and says why the first move is advice and the rest evidence
- Shows with two boards why the engine's best move is not always the best teaching move
- Names one pattern behind three blunders (the capturing piece was a guard) and asks what a piece was doing before it captures or trades
- Uses the app's Analysis page (lines, depth, whole-game analysis, next mistake, learn from your mistakes, show threats) inside a small review routine

## Sources the author names (check that they are used fairly, in our own words)

- Game ufcqmfxx from the Lichess standard rated database file for January 2013 (public, CC0; the game header gives the UTC date 2012.12.31), library/data/lichess_db_standard_rated_2013-01.pgn.zst: moves replayed with python-chess; ratings 1463 and 1504 from the game headers; engine claims Stockfish 19 lite single thread, depth stated in each claim (evidence under recorded limits, not proof) [V]
- Lichess puzzle database in library/data (6,157,341 puzzles, CC0): puzzles 0QTfA, 1GRVJ, 1Zv6x, 1Gx3p, 0Fh76, 09vi3 and 0LeZV (guard-left pattern), 9ESVF (board of step 25) and 76PJV (step 26) are positions from real games; counts 224,023 / 125,348 / 26,506 are reproduced by tools/analysis/count_guard_left.py (python-chess; in the file the first move is the mistake that creates the puzzle; the 26,506 are about 12 per cent of the hangingPiece puzzles); puzzles are selected for a tactic, so the counts are a catalogue, not a frequency [V]
- app/src/pages/Analysis.tsx and app/src/engine.ts: Analysis page controls (Lines, Depth, Show threats, Analyse whole game at depth 12, Next mistake, Learn from your mistakes, ?! ? ?? thresholds) and the score sign convention, read in the source on 30 Oct 2026 [V]
- docs/council-synthesis.md: engine-last is our own design decision (untested), VanLehn step-level tutoring [S, secondary]
- docs/citable-views.md: 10.13 Silman (https://en.wikipedia.org/wiki/Jeremy_Silman and https://www.chess.com/article/view/how-to-evaluate-a-position; engine shows what, not why) [S, summaries]; 10.7 Aagaard (https://www.chess.com/blog/sputnick/calculation-in-the-engine-age-a-review-of-jacob-aagaards-excelling-at-chess-calculation; errors start at candidate moves) [S, reviewer's account]; 11.8 and 11.9 Dvoretsky (https://en.wikipedia.org/wiki/Mark_Dvoretsky; analysis of your own games) [S/R]. All paraphrased; no quotations
- Conjectures labelled in the text: [H] engine-last beats engine-first; [I] pattern naming helps below intermediate level; [H] a small review routine will be kept; [H] practical chances when lost
- Positions: step 19 is the authored sequence 1.d4 d5 2.c4 e6 3.Nc3 Nf6 4.Bg5 Be7 5.e3 O-O 6.Nf3 h6 7.Bh4 b6 (item PBa3-c4); the position of step 20 comes from our earlier example set and its original game is not recorded. Win chance figures use the logistic formula in app/src/pages/Analysis.tsx (recalled from Lichess, [R]); +1 pawn gives 59.1 per cent and +3 gives 75.1 per cent [V, arithmetic]. Engine lines vary with depth and the number of lines requested; every line on the boards was reproduced at depth 16 in at least one run [V]

## How to read this packet

Boards are drawn with capitals for White and lower case for Black, rank 8 at the top unless the board is shown from Black's side. Moves in a line are in standard notation. Statements marked [V] were machine-checked, [I] inference, [H] hypothesis, [S] secondary source, [R] recalled. Please judge the explanations, not only the moves: does each sentence tell the learner why?

---

### Step 1: board

Caption: A quiet Italian position, White to move. Several moves score almost the same for the engine: h3, b4 and Nbd2 are each within about a tenth of a pawn of its first choice, which was Re1 in our run [V]. Before you read on, choose your move and say what it is for. Not 'it develops' but what it makes possible. The next two boards show two plans, not verdicts.

```
  8  r . b q . r k .
  7  p p p . . p p p
  6  . . n p . n . .
  5  . . b . p . . .
  4  . . B . P . . .
  3  . . P P . N . .
  2  P P . . . P P P
  1  R N B Q . R K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: r1bq1rk1/ppp2ppp/2np1n2/2b1p3/2B1P3/2PP1N2/PP3PPP/RNBQ1RK1 w - - 2 7
```

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] At depth 16 the engine's first choice is Re1, h3 or Nbd2 (which one depends on the settings), and h3, b4, Nbd2 and Re1 all score within 0.3 pawn of the best. In our runs the gap was under 0.1 pawn.
- [eval_range] At depth 16 the engine rates the position as level: between about -0.3 and +0.7 pawns.

### Step 2: reflect

Kind: expect

Prompt: Write your move and what it makes possible later. Then guess: how many tenths of a pawn separate the engine's best and worst of h3, b4 and Nbd2?

- Field "my move:" (free text)

- Field "what it makes possible:" (free text)

### Step 3: board

Caption: The first eight plies of an engine line that starts with h3 (one depth-16 run; other settings order the moves differently, so read it as an example of the plan). Every position along it stays within 0.3 pawn of level in our check [V]. Read the purpose of each move, not its name.

```
  8  r . b q . r k .
  7  p p p . . p p p
  6  . . n p . n . .
  5  . . b . p . . .
  4  . . B . P . . .
  3  . . P P . N . .
  2  P P . . . P P P
  1  R N B Q . R K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: r1bq1rk1/ppp2ppp/2np1n2/2b1p3/2B1P3/2PP1N2/PP3PPP/RNBQ1RK1 w - - 2 7
```

The line, with the sentence the learner sees at each move:
1. **7. h3**: The pawn takes g4 away from Black's bishop.
2. **7... h6**: Black takes g5 away from White's pieces.
3. **8. b4**: The pawn attacks the bishop on c5 and starts a queenside advance.
4. **8... Bb6**: The bishop steps off the attacked square and still eyes f2.
5. **9. a4**: The a-pawn heads for a5, where it would attack the bishop again.
6. **9... a5**: Black stops that: the pawn on a5 attacks the pawn on b4.
7. **10. b5**: The pawn attacks the knight on c6.
8. **10... Ne7**: The knight retreats, and White's pawns now stand on a4 and b5.

```
  8  r . b q . r k .
  7  . p p . n p p .
  6  . b . p . n . p
  5  p P . . p . . .
  4  P . B . P . . .
  3  . . P P . N . P
  2  . . . . . P P .
  1  R N B Q . R K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r1bq1rk1/1pp1npp1/1b1p1n1p/pP2p3/P1B1P3/2PP1N1P/5PP1/RNBQ1RK1 w - - 1 11
```

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [pawn_attackers] After h3, one white pawn attacks g4.
- [pawn_attackers] After ...h6, one black pawn attacks g5.
- [attackers] After b4, one white piece attacks the bishop on c5.
- [attackers] After ...Bb6, one black piece attacks f2.
- [pawn_attackers] After ...a5, one black pawn attacks b4.
- [pawn_attackers] After b5, one white pawn attacks the knight on c6.
- [piece_on] White has a pawn on b5 at the end of the line.

### Step 4: board

Caption: The plain developing move: the first eight plies of an engine line from the same run, every position within 0.3 pawn of level [V]. Same question for each move: what does it make possible?

```
  8  r . b q . r k .
  7  p p p . . p p p
  6  . . n p . n . .
  5  . . b . p . . .
  4  . . B . P . . .
  3  . . P P . N . .
  2  P P . . . P P P
  1  R N B Q . R K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: r1bq1rk1/ppp2ppp/2np1n2/2b1p3/2B1P3/2PP1N2/PP3PPP/RNBQ1RK1 w - - 2 7
```

The line, with the sentence the learner sees at each move:
1. **7. Nbd2**: The knight develops and, with the d-pawn, guards e4.
2. **7... a6**: Black takes b5 away from White's pieces and keeps the bishop's retreat open.
3. **8. a4**: White takes b5 back: the pawn on a4 attacks it.
4. **8... h6**: Black takes g5 away from White's pieces.
5. **9. h3**: The pawn takes g4 from Black's bishop.
6. **9... Ba7**: The bishop steps out of reach of a later b4 and still looks at f2 from a7.
7. **10. Re1**: The rook takes the e-file behind the pawn on e4.
8. **10... Be6**: Black challenges White's bishop on c4.

```
  8  r . . q . r k .
  7  b p p . . p p .
  6  p . n p b n . p
  5  . . . . p . . .
  4  P . B . P . . .
  3  . . P P . N . P
  2  . P . N . P P .
  1  R . B Q R . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r2q1rk1/bpp2pp1/p1npbn1p/4p3/P1B1P3/2PP1N1P/1P1N1PP1/R1BQR1K1 w - - 3 11
```

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [attackers] After Nbd2, two white pieces defend the pawn on e4: the knight and the d-pawn.
- [pawn_attackers] After ...a6, one black pawn attacks b5.
- [pawn_attackers] After a4, one white pawn attacks b5.
- [pawn_attackers] After h3, one white pawn attacks g4.
- [attackers] After ...Ba7, one black piece attacks f2.
- [attackers] After Re1, three white pieces defend e4.
- [attackers] After ...Be6, one black piece attacks the bishop on c4.

### Step 5: card

**Two moves, two ideas.** At depth 16 the engine put Re1 first, with h3, b4 and Nbd2 each within a tenth of a pawn [V, one run]. A gap that small is invisible in play. The difference you can feel is the idea: one plan restrains Black and gains queenside space, the other finishes development first. [I] Both are ordinary here: the number cannot choose, your reason can.

### Step 6: reflect

Kind: unsure

Prompt: Which plan did you prefer, and can you give a reason that does not use a number? If your reason was a move name, rewrite it as an idea.

- Field "my reason, as an idea:" (free text)

### Step 7: card

**The question and the method.** Can you review a game engine-last, find the pattern behind a blunder, and read a score and a line the way a teacher would? Engine-last means: one, look and name a threat, a weak spot and a plan; two, write one sentence of why; three, only then ask the engine; four, compare ideas before numbers. That order is our own design decision, not a tested result.

### Step 8: board

Caption: Lichess game ufcqmfxx, played 31 Dec 2012 (UTC) by the game header, listed in the January 2013 database file. Ratings 1463 (White) and 1504 (Black) from the headers; moves are facts. The opening is an Italian Game with Black's bishop to e7, sometimes called the Hungarian Defence [R]. Eleven ordinary moves each. We stop four times. Each stop: look, write your sentence, then reveal.

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
1. **1. e4**: White takes the centre and opens lines for the queen and a bishop.
2. **1... e5**: Black matches it.
3. **2. Nf3**: The knight attacks the pawn on e5.
4. **2... Nc6**: The knight defends the pawn on e5.
5. **3. Bc4**: The bishop eyes f7, a square only the king defends.
6. **3... Be7**: Black develops quietly and prepares to castle.
7. **4. d4**: A centre pawn challenges the pawn on e5.
8. **4... exd4**: Black takes.
9. **5. Nxd4**: The knight recaptures and attacks the knight on c6.
10. **5... d6**: Black supports the e5 square and opens the bishop on c8.
11. **6. Nc3**: The knight develops and defends the pawn on e4.
12. **6... Nf6**: Black attacks e4 and develops the last knight.
13. **7. Bg5**: The bishop attacks the knight on f6.
14. **7... Nxd4**: Black trades a pair of knights.
15. **8. Qxd4**: The queen recaptures and also attacks f6.
16. **8... h6**: Black asks the bishop what it wants.
17. **9. Bh4**: The bishop keeps the pressure on f6.
18. **9... O-O**: Black castles; the knight on f6 stays well protected.
19. **10. O-O-O**: White castles long: kings on opposite wings.
20. **10... Bd7**: Black develops the last minor piece.
21. **11. Rhe1**: The second rook joins the e-file behind the pawn on e4.
22. **11... Re8**: Black's rook takes the other end of the e-file.

```
  8  r . . q r . k .
  7  p p p b b p p .
  6  . . . p . n . p
  5  . . . . . . . .
  4  . . B Q P . . B
  3  . . N . . . . .
  2  P P P . . P P P
  1  . . K R R . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r2qr1k1/pppbbpp1/3p1n1p/8/2BQP2B/2N5/PPP2PPP/2KRR3 w - - 6 12
```

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [attackers] After Nf3, one white piece attacks the pawn on e5.
- [attackers] After ...Nc6, one black piece defends the pawn on e5.
- [attackers] After Bc4, one white piece attacks f7.
- [attackers] After Bc4, one black piece defends f7: the king.
- [pawn_attackers] After d4, one white pawn attacks e5.
- [attackers] After Nxd4, one white piece attacks the knight on c6.
- [attackers] After ...Nf6, one black piece attacks the pawn on e4.
- [attackers] After Bg5, one white piece attacks the knight on f6.
- [attackers] After Qxd4, two white pieces attack the knight on f6.
- [king_wing] After O-O-O, White's king is on the queenside.
- [attackers] After Rhe1, three white pieces defend the pawn on e4: the knight, the queen and the rook.

### Step 9: board

Caption: Decision point 1, move 12. White to move. Black's king is castled short, White's long. Write your move, the threat you fear and the plan you like. Then step through what was played.

```
  8  r . . q r . k .
  7  p p p b b p p .
  6  . . . p . n . p
  5  . . . . . . . .
  4  . . B Q P . . B
  3  . . N . . . . .
  2  P P P . . P P P
  1  . . K R R . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: r2qr1k1/pppbbpp1/3p1n1p/8/2BQP2B/2N5/PPP2PPP/2KRR3 w - - 6 12
```

The line, with the sentence the learner sees at each move:
1. **12. Nd5**: White offers a knight trade, and the knight attacks e7 and c7.
2. **12... Nxd5**: Black trades.
3. **13. Qxd5**: White recaptures; the bishop on h4 is now attacked.
4. **13... Bxh4**: Black takes the bishop: nothing protects it.

```
  8  r . . q r . k .
  7  p p p b . p p .
  6  . . . p . . . p
  5  . . . Q . . . .
  4  . . B . P . . b
  3  . . . . . . . .
  2  P P P . . P P P
  1  . . K R R . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r2qr1k1/pppb1pp1/3p3p/3Q4/2B1P2b/8/PPP2PPP/2KRR3 w - - 0 14
```

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] At depth 16 the engine's best move is the pawn move to e5.
- [move_loses] At depth 16 the knight move to d5 is rated at least 5 pawns lower than the engine's best move.
- [piece_attacks] After the knight reaches d5 it attacks exactly these squares: b4, b6, c3, c7, e3, e7, f4, f6.
- [loose_pieces] After Nd5 Nxd5 Qxd5, White's only loose piece is the bishop on h4.

### Step 10: reflect

Kind: expect

Prompt: Decision point 1: write your sentence before you step through the reveal above, then compare your idea with the engine's choice, and with a quieter move, on the boards later in this lesson.

- Field "my move:" (free text)

- Field "what I fear:" (free text)

- Field "my plan:" (free text)

### Step 11: board

Caption: What the traded piece was doing. Look at the diagonal from e7 to h4.

```
  8  r . . q r . k .
  7  p p p b b p p .
  6  . . . p . n . p
  5  . . . . . . . .
  4  . . B Q P . . B
  3  . . N . . . . .
  2  P P P . . P P P
  1  . . K R R . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: r2qr1k1/pppbbpp1/3p1n1p/8/2BQP2B/2N5/PPP2PPP/2KRR3 w - - 6 12
```

The line, with the sentence the learner sees at each move:
1. **12. Nd5**: White offers a knight trade.
2. **12... Nxd5**: The knight on f6 was blocking this diagonal. When it goes, the bishop on e7 attacks h4 and nothing guards h4.

```
  8  r . . q r . k .
  7  p p p b b p p .
  6  . . . p . . . p
  5  . . . n . . . .
  4  . . B Q P . . B
  3  . . . . . . . .
  2  P P P . . P P P
  1  . . K R R . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r2qr1k1/pppbbpp1/3p3p/3n4/2BQP2B/8/PPP2PPP/2KRR3 w - - 0 13
```

Drawn on the board: arrows e7-h4.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [piece_attacks] After the knight trade on d5, the bishop on e7 attacks the bishop on h4.

### Step 12: card

**What was the traded piece doing?** The knight on f6 stood between two bishops. Trading it opened the line and left a bishop with no defender. [I] A miss like this is rarely about long calculation. It comes from asking what a trade wins and not what the traded piece was *doing*. The engine marks the move bad. Only your own sentence shows which question you skipped.

### Step 13: board

Caption: Decision point 2, move 14. White is a piece down and the engine's score is about -5 (White's side). What do you try when the position is lost? Choose a move that sets problems, then step through what was played.

```
  8  r . . q r . k .
  7  p p p b . p p .
  6  . . . p . . . p
  5  . . . Q . . . .
  4  . . B . P . . b
  3  . . . . . . . .
  2  P P P . . P P P
  1  . . K R R . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: r2qr1k1/pppb1pp1/3p3p/3Q4/2B1P2b/8/PPP2PPP/2KRR3 w - - 0 14
```

The line, with the sentence the learner sees at each move:
1. **14. Qxf7+**: The queen takes a pawn with check.
2. **14... Kh8**: The king goes to the corner.
3. **15. e5**: The pawn advances and attacks the pawn on d6.
4. **15... Rf8**: Black's rook attacks the queen.
5. **16. Qg6**: The queen steps away and eyes h7.
6. **16... Bxf2**: Black takes a pawn and attacks the rook on e1.
7. **17. Bd3**: The bishop lines up behind the queen on the diagonal to h7.

```
  8  r . . q . r . k
  7  p p p b . . p .
  6  . . . p . . Q p
  5  . . . . P . . .
  4  . . . . . . . .
  3  . . . B . . . .
  2  P P P . . b P P
  1  . . K R R . . .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r2q1r1k/pppb2p1/3p2Qp/4P3/8/3B4/PPP2bPP/2KRR3 b - - 1 17
```

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [eval_range] At depth 16 the engine rates the position as clearly better for Black: between about -7 and -3.5 pawns.
- [best_move_in] At depth 16 the engine's best move is the queen capture on f7.
- [attackers] After Qxf7+ one white piece gives check on g8.
- [pawn_attackers] After e5, one white pawn attacks d6.
- [attackers] After ...Rf8, one black piece attacks the queen on f7.
- [attackers] After Qg6, one white piece attacks h7.
- [attackers] After ...Bxf2, one black piece attacks the rook on e1.
- [piece_attacks] The bishop on d3 defends the queen on g6.

### Step 14: reflect

Kind: unsure

Prompt: [H] When you are lost, the best practical move is often the one that asks the opponent the most questions. Do you agree? What does it cost if the opponent answers correctly?

- Field "my view:" (free text)

### Step 15: board

Caption: Decision point 3, move 17. Black is a piece up and it is Black's move. Before the engine speaks: what does White threaten? You do not need a machine to see this one. Write the threat and two ways to stop it.

```
  8  r . . q . r . k
  7  p p p b . . p .
  6  . . . p . . Q p
  5  . . . . P . . .
  4  . . . . . . . .
  3  . . . B . . . .
  2  P P P . . b P P
  1  . . K R R . . .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: r2q1r1k/pppb2p1/3p2Qp/4P3/8/3B4/PPP2bPP/2KRR3 b - - 1 17
```

Drawn on the board: arrows g6-h7, d3-h7.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [mate_in] If Black could pass, White would mate at once with the queen move to h7.

### Step 16: reflect

Kind: expect

Prompt: Write the threat in one sentence and two moves that stop it.

- Field "White threatens:" (free text)

- Field "two ways to stop it:" (free text)

### Step 17: board

Caption: Black's move in the game, and what followed.

```
  8  r . . q . r . k
  7  p p p b . . p .
  6  . . . p . . Q p
  5  . . . . P . . .
  4  . . . . . . . .
  3  . . . B . . . .
  2  P P P . . b P P
  1  . . K R R . . .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: r2q1r1k/pppb2p1/3p2Qp/4P3/8/3B4/PPP2bPP/2KRR3 b - - 1 17
```

The line, with the sentence the learner sees at each move:
1. **17... Kg8**: Black steps off h8. The game move.
2. **18. e6**: The pawn attacks d7 and f7, and White's threat on h7 stays.

```
  8  r . . q . r k .
  7  p p p b . . p .
  6  . . . p P . Q p
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . B . . . .
  2  P P P . . b P P
  1  . . K R R . . .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r2q1rk1/pppb2p1/3pP1Qp/8/8/3B4/PPP2bPP/2KRR3 b - - 0 18
```

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [move_loses] At depth 16 the king move to g8 is rated at least 8 pawns lower than the engine's best move.
- [best_move_in] At depth 16 the engine's best move is the queen check on g5.
- [pawn_attackers] After e6, one white pawn attacks the bishop on d7.

### Step 18: item

**Task `IHI-LHIENGINESHUMANS3-7`** (find_move, difficulty cue 1)

Black is a piece up and White threatens mate on h7. Find a move that keeps the advantage and deals with White's idea.

```
  1  . . . R R K . .
  2  P P b . . P P P
  3  . . . . B . . .
  4  . . . . . . . .
  5  . . . P . . . .
  6  p Q . . p . . .
  7  . p . . b p p p
  8  k . r . q . . r
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: r2q1r1k/pppb2p1/3p2Qp/4P3/8/3B4/PPP2bPP/2KRR3 b - - 1 17
```

**Accepted answer(s):** Qg5+, Bf5

Feedback shown for wrong moves:
- Kg8: The king move leaves the threat on h7 in place and the engine rates it more than eight pawns lower at depth 16.
- Bxe1: Taking the rook ignores the threat: the engine rates this at least thirty pawns lower because it allows a mate.
- Bf5: Good: the bishop attacks the queen on g6 and keeps a decisive edge. The check on g5 is cleaner still (about +5.1 against +3.7).

**Explanation shown:** The threat is a queen move to h7 supported by the bishop. Qg5+ trades the queens with check and is the engine's first choice (about +5.1). Bf5 also stops the queen reaching h7 and keeps about +3.7. Taking a rook or stepping the king aside does not.

Hints (in order):
1. Ask what White's last move threatens before you look at what you can take.
2. The queen on g6 and the bishop on d3 line up on one diagonal.
3. Two moves work. One is a check that offers a queen trade.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] At depth 16 the queen check on g5 (about +5.1) is the engine's first choice and the bishop move to f5 (about +3.7) is also decisive; both score within 2 pawns of the best.
- [mate_in] If Black could pass, White would mate at once with the queen move to h7.
- [move_loses] At depth 16 the king move to g8 is rated at least 8 pawns lower than the engine's best move.
- [move_loses] At depth 16 the bishop capture on e1 is rated at least 30 pawns lower than the engine's best move (it allows a mate).

### Step 19: board

Caption: Decision point 4 was the item above. This is what Black played at move 18, and the end of the game. (At move 17 the engine's first choice was the queen check you were asked to find.)

```
  1  . . . R R K . .
  2  P P b . . P P P
  3  . . . . B . . .
  4  . . . . . . . .
  5  . . . . . . . .
  6  p Q . P p . . .
  7  . p . . b p p p
  8  . k r . q . . r
     h g f e d c b a

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: r2q1rk1/pppb2p1/3pP1Qp/8/8/3B4/PPP2bPP/2KRR3 b - - 0 18
```

The line, with the sentence the learner sees at each move:
1. **18... Bxe1**: Black takes a rook and ignores the threat.
2. **19. Qh7#**: The queen mates: the bishop on d3 defends it and the king has no square.

```
  1  . . . b R K . .
  2  P P . . . P P P
  3  . . . . B . . .
  4  . . . . . . . .
  5  . . . . . . . .
  6  p . . P p . . .
  7  Q p . . b p p p
  8  . k r . q . . r
     h g f e d c b a

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r2q1rk1/pppb2pQ/3pP2p/8/8/3B4/PPP3PP/2KRb3 b - - 1 19
```

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [move_loses] At depth 16 the bishop capture on e1 is rated at least 30 pawns lower than the engine's best move (it allows a mate).
- [attackers] After Bxe1 and Qh7, the bishop on d3 defends the queen on h7.

### Step 20: card

**The same blind spot twice.** Black missed the mating idea on h7 at move 17 and again at move 18 [V from this game]. [H] Reviewing engine-last would expose it sooner: your own written sentence shows what you did not look for, while an engine-first review shows only the answer. [S] Our notes lean on VanLehn's review of tutoring, where feedback on the learner's own attempt at each step does the work. Untested for chess here.

### Step 21: board

Caption: Level. A Queen's Gambit structure; no piece is hanging for either side [V]. The engine says about +0.2 (White's side). Say it aloud: who is better, and by how much, in words?

```
  8  r n b q . r k .
  7  p . p . b p p .
  6  . p . . p n . p
  5  . . . p . . . .
  4  . . P P . . . B
  3  . . N . P N . .
  2  P P . . . P P P
  1  R . . Q K B . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: rnbq1rk1/p1p1bpp1/1p2pn1p/3p4/2PP3B/2N1PN2/PP3PPP/R2QKB1R w KQ - 0 8
```

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [eval_range] At depth 16 the engine rates the position between about -0.3 and +0.6 pawns: level.
- [loose_pieces] White has no loose piece.
- [loose_pieces] Black has no loose piece.

### Step 22: board

Caption: A clear edge, nothing forced. The engine rates this about +2 for White. [I] One reason a reader might give: the knight on a4 and White's extra space on the queenside. Say your own reason. Same question: who, and how much in words?

```
  8  . . . . k . . r
  7  r p . . n p . .
  6  p . p p . n q .
  5  . . . . p . p p
  4  N P P . P . . .
  3  P . . P . . Q P
  2  . . . . B P P .
  1  . R . . . R K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 4k2r/rp2np2/p1pp1nq1/4p1pp/NPP1P3/P2P2QP/4BPP1/1R3RK1 w k - 2 19
```

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [eval_range] At depth 16 the engine rates the position between about +1.5 and +3.0 pawns for White.

### Step 23: board

Caption: Black to move. The engine shows about -4.8, still from White's side. The minus sign means Black is better. Why? The engine's number is only the result; the reason is on the board.

```
  1  . . . R R K . .
  2  P P P . . P P P
  3  . . . . . . . .
  4  B . . P . B . .
  5  . . . . Q . . .
  6  p . . . p . . .
  7  . p p b b p p p
  8  . k . r q . . r
     h g f e d c b a

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: r2qr1k1/pppbbpp1/3p3p/3Q4/2B1P2B/8/PPP2PPP/2KRR3 b - - 0 13
```

Drawn on the board: arrows e7-h4.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [eval_range] At depth 16 the engine rates the position between about -6.0 and -3.8 pawns: clearly better for Black.
- [loose_pieces] White's only loose piece is the bishop on h4.

### Step 24: card

**Reading a score.** The number is pawns from White's side: plus one (100 centipawns) means White is about a pawn ahead, minus one means Black is. 'M3' means mate in three. 'Depth 16' means the main lines reached about sixteen half-moves; some go deeper, some shallower [R]. [I] Rough words: under half a pawn level, up to one and a half a small edge, up to three a clear edge, beyond that decisive.

### Step 25: card

**What a pawn is worth to a person.** The score assumes both sides play perfectly from here. *Win chance* turns it into odds: in the app's formula plus one pawn is about 59 per cent for White and plus three about 75 [V, arithmetic checked]. [I] For club players the practical chances are probably closer to level, since nobody plays perfectly. The marks ?!, ? and ?? later measure lost win chance.

### Step 26: item

**Task `IHI-LHIENGINESHUMANS3-10`** (classify_position, difficulty cue 3)

The engine shows +2.0 at depth 16, from White's side. Which sentence reads it best?

```
  8  . . . . k . . r
  7  r p . . n p . .
  6  p . p p . n q .
  5  . . . . p . p p
  4  N P P . P . . .
  3  P . . P . . Q P
  2  . . . . B P P .
  1  . R . . . R K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 4k2r/rp2np2/p1pp1nq1/4p1pp/NPP1P3/P2P2QP/4BPP1/1R3RK1 w k - 2 19
```

**Accepted answer:** {"class": "White has a clear edge, but the game is far from won"}

**Explanation shown:** Plus two is a clear edge for White on the lesson's scale. It assumes perfect play, so the game is not won.

Hints (in order):
1. Plus means White. How big is two pawns on the card's scale?
2. Up to three pawns is a clear edge, not a win.
3. The first option.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [eval_range] At depth 16 the engine rates the position between about +1.5 and +3.0 pawns for White.

### Step 27: board

Caption: Ruy Lopez, White to move. The engine says about +0.3: read the number first (who, how much, in words), then read the line, asking of every move: what does it threaten, and what does it stop? The line comes from one depth-16 run that showed three lines; a run showing one line preferred a different recapture on b3.

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
1. **10. h3**: A waiting move that takes g4 from Black's bishop before the centre advance.
2. **10... Be6**: Black challenges the bishop on b3.
3. **11. d4**: The centre pawn attacks e5 at last.
4. **11... Bxb3**: Black trades bishops.
5. **12. Qxb3**: The queen recaptures and looks along the diagonal at f7.
6. **12... Qd7**: Black's queen steps to d7 and helps guard e6.

```
  8  r . . . . r k .
  7  . . p q b p . p
  6  p . n p . n p .
  5  . p . . p . . .
  4  . . . P P . . .
  3  . Q P . . N . P
  2  P P . . . P P .
  1  R N B . R . . K
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r4rk1/2pqbp1p/p1np1np1/1p2p3/3PP3/1QP2N1P/PP3PP1/RNB1R2K w - - 1 13
```

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] At depth 16 the engine's best move is the pawn move to h3, a4 or d4, all within 0.4 pawns of the best.
- [eval_range] At depth 16 the engine rates the position between about +0.1 and +0.9 pawns.
- [pawn_attackers] After h3, one white pawn attacks g4.
- [attackers] After ...Be6, one black piece attacks the bishop on b3.
- [pawn_attackers] After d4, one white pawn attacks e5.
- [attackers] After Qxb3, one white piece attacks f7.
- [attackers] After ...Qd7, two black pieces defend e6.

### Step 28: card

**The first move is advice; the rest is evidence.** The first move is the engine's advice. Each later move answers the reply that would otherwise be good. [I] Past about five plies the line is increasingly the engine's guess, and the order of moves changes between runs, as the earlier boards showed. For each move ask two things: what does it threaten, and what does it stop?

### Step 29: item

**Task `IHI-LHIENGINESHUMANS3-11`** (classify_position, difficulty cue 3)

The engine shows +0.3 and its line starts with the pawn move h3. What does h3 do in this plan?

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

**Accepted answer:** {"class": "It takes g4 from Black's bishop before the centre advance"}

**Explanation shown:** A first move is advice: here it takes g4 away from Black's bishop before White advances in the centre. The small score does not say this; you read it from the board.

Hints (in order):
1. Ask what the move stops, not only what it threatens.
2. Which square does the pawn on h3 attack?
3. The pawn covers g4 where Black's bishop could go.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [pawn_attackers] After h3, one white pawn attacks g4.
- [eval_range] At depth 16 the engine rates the position between about +0.1 and +0.9 pawns.

### Step 30: board

Caption: From puzzle 9ESVF (Lichess puzzle database, a real game), after a trade of pieces on f6. White to move. One quiet move wins by force: find it before you step.

```
  8  r . . q . r k .
  7  p p p . . p b .
  6  . . . . . p . .
  5  . . . . . . . .
  4  . . P P . . Q P
  3  . . N . . . . .
  2  P P . . . . . .
  1  . . K R . . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: r2q1rk1/ppp2pb1/5p2/8/2PP2QP/2N5/PP6/2KR4 w - - 0 18
```

The line, with the sentence the learner sees at each move:
1. **18. Rg1**: A quiet rook move: the queen on g4 now has a protected capture on g7.
2. **18... Kh8**: Black's king steps to h8; the engine finds no defence that avoids mate.
3. **19. Qxg7#**: The queen takes the bishop, protected by the rook, and the king has no square.

```
  8  r . . q . r . k
  7  p p p . . p Q .
  6  . . . . . p . .
  5  . . . . . . . .
  4  . . P P . . . P
  3  . . N . . . . .
  2  P P . . . . . .
  1  . . K . . . R .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r2q1r1k/ppp2pQ1/5p2/8/2PP3P/2N5/PP6/2K3R1 b - - 0 19
```

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [mate_in] White mates in two moves, starting with the rook move to g1.
- [attackers] After Rg1 the queen attacks g7 and the rook stands behind it on the same file.

### Step 31: board

Caption: A mate score (puzzle 76PJV, a real game). At depth 2 the engine shows about -1.3 here (Black better). At depth 6 the same search finds a forced mate in three for White [V, one-off run]. The quiet first move is a rook coming to the h-file; the finish is a sacrifice.

```
  8  r . . . . . k .
  7  p . p p q . b R
  6  . p . . p . Q .
  5  . . . . . r P .
  4  . . . . . . p .
  3  . . P . . . . .
  2  P P . . . P P .
  1  . K . R . . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: r5k1/p1ppq1bR/1p2p1Q1/5rP1/6p1/2P5/PP3PP1/1K1R4 w - - 3 24
```

The line, with the sentence the learner sees at each move:
1. **24. Rdh1**: A quiet rook move: two rooks now point at h8.
2. **24... Kf8**: The king steps to f8, but the engine finds no defence that avoids mate.
3. **25. Rh8+**: The rook sacrifices itself on the corner square.
4. **25... Bxh8**: The bishop must take the rook.
5. **26. Rxh8#**: The second rook takes the bishop and mates.

```
  8  r . . . . k . R
  7  p . p p q . . .
  6  . p . . p . Q .
  5  . . . . . r P .
  4  . . . . . . p .
  3  . . P . . . . .
  2  P P . . . P P .
  1  . K . . . . . .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r4k1R/p1ppq3/1p2p1Q1/5rP1/6p1/2P5/PP3PP1/1K6 b - - 0 26
```

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [eval_range] At depth 2 the engine rates the position between about -3.0 and -0.5 pawns, in Black's favour.
- [mate_in] White mates in three moves, starting with the rook move to h1.

### Step 32: card

**Depth is a statement about effort.** The same position gave about -1.3 at depth 2 and a forced mate at depth 6 [V]. A score without its depth is half a sentence. When you review, note the depth the app reached before you trust a surprising score; if it is low, wait or raise it. [I] Below roughly intermediate level, naming the pattern probably helps more than reading evaluations. Untested here.

### Step 33: board

Caption: Move 12 again. The best move is not always the best lesson. The engine's first choice, e5, begins a nine-ply line with a check in the middle [V, one depth-16 run]. [I] A human would struggle to see all of it. Step through it: where would you have stopped calculating?

```
  8  r . . q r . k .
  7  p p p b b p p .
  6  . . . p . n . p
  5  . . . . . . . .
  4  . . B Q P . . B
  3  . . N . . . . .
  2  P P P . . P P P
  1  . . K R R . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: r2qr1k1/pppbbpp1/3p1n1p/8/2BQP2B/2N5/PPP2PPP/2KRR3 w - - 6 12
```

The line, with the sentence the learner sees at each move:
1. **12. e5**: The pawn attacks the knight on f6, which the bishop on h4 already attacks.
2. **12... dxe5**: Black takes, and the new pawn attacks the white queen.
3. **13. Rxe5**: The rook takes the pawn, and now attacks the bishop on e7.
4. **13... Be6**: Black blocks the e-file, and the bishop attacks the bishop on c4.
5. **14. Bxe6**: White takes the bishop. The black queen now looks at the white queen.
6. **14... Qxd4**: Black takes the queen.
7. **15. Bxf7+**: White checks first with the bishop.
8. **15... Kxf7**: The king takes.
9. **16. Rxd4**: The rook takes the queen. Count what each side has now.

```
  8  r . . . r . . .
  7  p p p . b k p .
  6  . . . . . n . p
  5  . . . . R . . .
  4  . . . R . . . B
  3  . . N . . . . .
  2  P P P . . P P P
  1  . . K . . . . .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r3r3/ppp1bkp1/5n1p/4R3/3R3B/2N5/PPP2PPP/2K5 b - - 0 16
```

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [attackers] After e5, two white pieces attack the knight on f6.
- [pawn_attackers] After ...dxe5, one black pawn attacks the white queen on d4.
- [attackers] After Rxe5, one white piece attacks the bishop on e7.
- [attackers] After ...Be6, one black piece attacks the bishop on c4.
- [attackers] After Bxe6, one black piece attacks the white queen on d4.
- [best_move_in] At depth 16 the engine's first choice is the pawn move to e5.

### Step 34: board

Caption: The quiet alternative: h3 first, taking g4 from Black's pieces. Black is to move and the engine still prefers White by about 1.1 to 1.4 pawns, a small-to-moderate edge on this lesson's scale. After h3 the e5 break is still available. The line is an example (a multi-line engine run gave it; other runs differ), and the score stays near +1.1 to +1.5 along it [V, one run].

```
  8  r . . q r . k .
  7  p p p b b p p .
  6  . . . p . n . p
  5  . . . . . . . .
  4  . . B Q P . . B
  3  . . N . . . . P
  2  P P P . . P P .
  1  . . K R R . . .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: r2qr1k1/pppbbpp1/3p1n1p/8/2BQP2B/2N4P/PPP2PP1/2KRR3 b - - 0 12
```

The line, with the sentence the learner sees at each move:
1. **12... c6**: Black prepares ...b5 against the bishop on c4.
2. **13. e5**: White plays the same break a move later, now with g4 covered.
3. **13... dxe5**: Black takes.
4. **14. Rxe5**: The rook takes the pawn and attacks the bishop on e7.
5. **14... b5**: Black attacks the bishop on c4 with a pawn.
6. **15. Bb3**: The bishop retreats and stays on the same diagonal.
7. **15... c5**: A pawn attacks the white queen.

```
  8  r . . q r . k .
  7  p . . b b p p .
  6  . . . . . n . p
  5  . p p . R . . .
  4  . . . Q . . . B
  3  . B N . . . . P
  2  P P P . . P P .
  1  . . K R . . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r2qr1k1/p2bbpp1/5n1p/1pp1R3/3Q3B/1BN4P/PPP2PP1/2KR4 w - - 0 16
```

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [eval_range] After h3, at depth 16 the engine rates the position between about +1.0 and +3.2 pawns for White.
- [pawn_attackers] After h3, one white pawn attacks g4.
- [loose_pieces] After h3, White has no loose piece.
- [loose_pieces] After h3, Black has no loose piece.
- [pawn_attackers] After ...c6, one black pawn attacks b5.
- [attackers] After Rxe5, one white piece attacks the bishop on e7.
- [pawn_attackers] After ...b5, one black pawn attacks the bishop on c4.
- [pawn_attackers] After ...c5, one black pawn attacks the white queen on d4.

### Step 35: reflect

Kind: unsure

Prompt: Which would you teach a club player: the move that needs nine half-moves of exact calculation, or the one whose idea fits a sentence? [I] Where would you draw the line between them?

- Field "I would teach:" (free text)

- Field "because:" (free text)

### Step 36: card

**One pattern, from real games.** The Lichess puzzle file we hold has 6,157,341 puzzles; 224,023 carry the tag *hangingPiece*. In 125,348 of those the first move, the mistake that creates the puzzle, is a capture. In 26,506 (about 12 per cent of all hangingPiece puzzles) the reply takes a different piece the capturing piece had been guarding [V, our count]. Puzzles are chosen because a tactic exists: a catalogue of mistakes, not a frequency in play.

### Step 37: board

Caption: Puzzle 0QTfA, from a real game. White to move takes a pawn and attacks two pieces at once. Which white piece is left without a guard? Decide, then step.

```
  8  r . b q k . . r
  7  . p . . . p p p
  6  . n p . . . . .
  5  . . . . N . . .
  4  p . B P P . . .
  3  P . . . . . . .
  2  . . . Q . P P P
  1  R . . . K . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: r1bqk2r/1p3ppp/1np5/4N3/p1BPP3/P7/3Q1PPP/R3K2R w KQkq - 1 16
```

The line, with the sentence the learner sees at each move:
1. **16. Nxf7**: The knight takes a pawn and attacks the queen and the rook.
2. **16... Nxc4**: Black's knight takes the bishop for free.

```
  8  r . b q k . . r
  7  . p . . . N p p
  6  . . p . . . . .
  5  . . . . . . . .
  4  p . n P P . . .
  3  P . . . . . . .
  2  . . . Q . P P P
  1  R . . . K . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r1bqk2r/1p3Npp/2p5/8/p1nPP3/P7/3Q1PPP/R3K2R w KQkq - 0 17
```

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [move_loses] At depth 16 the knight capture on f7 is rated at least 2 pawns lower than the engine's best move.
- [attackers] Before the capture, one white piece defends the bishop on c4: the knight on e5.
- [piece_attacks] The knight on f7 attacks the queen on d8 and the rook on h8.
- [loose_pieces] After Nxf7, White's only loose piece is the bishop on c4.

### Step 38: board

Caption: Puzzle 1GRVJ, from a real game. Black to move can take the white queen with the queen. What does Black's queen stop guarding when it leaves d6?

```
  8  r . . . . r k .
  7  . . p . b p p p
  6  p p N q . . . .
  5  . . . Q . b . .
  4  . . . P . . . .
  3  . . . . P . . .
  2  P P . . . P P P
  1  R . B . K . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: r4rk1/2p1bppp/ppNq4/3Q1b2/3P4/4P3/PP3PPP/R1B1K2R b KQ - 0 13
```

The line, with the sentence the learner sees at each move:
1. **13... Qxd5**: Black's queen takes White's queen.
2. **14. Nxe7+**: The knight takes the bishop with check and attacks the black queen.

```
  8  r . . . . r k .
  7  . . p . N p p p
  6  p p . . . . . .
  5  . . . q . b . .
  4  . . . P . . . .
  3  . . . . P . . .
  2  P P . . . P P P
  1  R . B . K . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r4rk1/2p1Nppp/pp6/3q1b2/3P4/4P3/PP3PPP/R1B1K2R b KQ - 0 14
```

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [move_loses] At depth 16 the queen capture on d5 is rated at least 2 pawns lower than the engine's best move.
- [attackers] Before the capture, one black piece defends the bishop on e7: the queen on d6.
- [loose_pieces] After Qxd5, Black's only loose piece is the bishop on e7.
- [piece_attacks] The knight on e7 attacks the queen on d5 and the king on g8.

### Step 39: board

Caption: Puzzle 1Zv6x, from a real game. White's queen takes a pawn. What was the queen doing on d2 before it left?

```
  8  . r . . . . k .
  7  n . . b q p b p
  6  p r . p . . p .
  5  . . p P . . . .
  4  . . P . P p P .
  3  P . N B . N . P
  2  . . . Q . P . .
  1  . R . . R . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 1r4k1/n2bqpbp/pr1p2p1/2pP4/2P1PpP1/P1NB1N1P/3Q1P2/1R2R1K1 w - - 0 23
```

The line, with the sentence the learner sees at each move:
1. **23. Qxf4**: The queen takes a pawn.
2. **23... Bxc3**: The bishop takes the knight, which only the queen had protected.

```
  8  . r . . . . k .
  7  n . . b q p . p
  6  p r . p . . p .
  5  . . p P . . . .
  4  . . P . P Q P .
  3  P . b B . N . P
  2  . . . . . P . .
  1  . R . . R . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 1r4k1/n2bqp1p/pr1p2p1/2pP4/2P1PQP1/P1bB1N1P/5P2/1R2R1K1 w - - 0 24
```

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [move_loses] At depth 16 the queen capture on f4 is rated at least 2 pawns lower than the engine's best move.
- [attackers] Before the capture, one white piece defends the knight on c3: the queen on d2.
- [loose_pieces] After Qxf4, White's only loose piece is the knight on c3.

### Step 40: card

**One question for all three.** Before a capture, a trade or a 'free pawn', ask: *what was this piece doing before it moved?* If the answer is 'guarding something', keep guarding, or make sure the guarded piece is safe another way. [I] The habit works because attention follows the prize; the question moves attention to what you give up.

### Step 41: item

**Task `IHI-LHIENGINESHUMANS3-2`** (select_squares, difficulty cue 3)

White's queen has just captured a rook on c2. Tap the white piece Black can now win for nothing.

```
  1  K . . . . . . .
  2  P . . . . Q . P
  3  . . R B . . . .
  4  b q P . . . . .
  5  . . . P . . P .
  6  . . . p . . . .
  7  . p p . . . . .
  8  . k . . . . . .
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: 6k1/5pp1/4p3/1P2P3/5Pqb/4BR2/P1Q4P/7K b - - 0 41
```

**Accepted answer:** squares f3

**Explanation shown:** Before the capture the queen defended the rook; after it, that rook is attacked and nothing defends it.

Hints (in order):
1. Ask what the queen on e2 was doing before it captured.
2. One white piece was defended by the queen only.
3. Look at the rook on the third rank.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [loose_pieces] White's only loose piece is on f3.

### Step 42: item

**Task `IHI-LHIENGINESHUMANS3-3`** (classify_position, difficulty cue 3)

Black plays Qxb4. Which sentence names what went wrong?

```
  1  . K R . . . Q .
  2  B P P . . . . .
  3  . . . P . . . .
  4  P . . . P . P .
  5  p p . p p . B P
  6  . . p . q n p .
  7  . . . . . p . .
  8  . r . . r . k .
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: 1k1r2r1/2p5/1pnq1p2/PB1pp1pp/1P1P3P/4P3/5PPB/1Q3RK1 b - - 5 23
```

**Accepted answer:** {"class": "It left a piece loose that the capturing piece had been guarding"}

**Explanation shown:** The capturing piece was defending another piece. Once it moved, that piece was attacked and undefended.

Hints (in order):
1. Which piece did the capturing piece stop protecting?
2. Look at the piece the opponent can now attack for free.
3. A piece was left loose.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [loose_pieces] After the capture the mover's only loose piece is on c6.
- [move_loses] At depth 16 the capture is rated at least 2 pawns lower than the engine's best move.

### Step 43: card

**The Analysis page, step by step** [V, read in the app source on 30 Oct 2026]. Load a game as text, or set up a position. Choose how many lines and what depth. *Analyse whole game* scores every position at depth 12 and marks moves: ?! loses 10 to 20 points of win chance, ? 20 to 30, ?? 30 or more. *Next mistake* and *Learn from your mistakes* visit the ? and ?? moves only.

### Step 44: reflect

Kind: unsure

Prompt: Guided exercise, no screenshots needed. Open Analysis with a game you lost. Before you press anything, write your own list: the three moments you felt unsure. Then run the whole-game analysis and count how many of your three the tool also marked.

- Field "my three moments:" (free text)

- Field "how many matched:" (free text)

### Step 45: card

**Two more buttons.** *Learn from your mistakes* returns to the position before an error and asks you for a better move; press *Show the answer* only after you have written your own sentence. *Show threats* draws one red arrow: the first move the engine would play if it were the opponent's turn. The next board shows what it would draw for Black at move 17.

### Step 46: board

Caption: What Show threats would draw here: one arrow, the white queen's move to h7. The bishop on d3 that backs it is not drawn: you must see that yourself. Use the button after you have written your own threat, not before.

```
  8  r . . q . r . k
  7  p p p b . . p .
  6  . . . p . . Q p
  5  . . . . P . . .
  4  . . . . . . . .
  3  . . . B . . . .
  2  P P P . . b P P
  1  . . K R R . . .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: r2q1r1k/pppb2p1/3p2Qp/4P3/8/3B4/PPP2bPP/2KRR3 b - - 1 17
```

Drawn on the board: arrows g6-h7.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [mate_in] If Black could pass, White would mate at once with the queen move to h7.
- [piece_attacks] The bishop on d3 defends the queen on g6 and so backs a queen move to h7.

### Step 47: card

**What others say.** As summarised on pages we could read, Jeremy Silman puts a tactical check first and treats engine output as the what, not the why [S]. Jacob Aagaard argues that serious errors often start at the very beginning of a calculation, when a candidate move is never considered [S, a reviewer's account]. Mark Dvoretsky's school stressed analysing your own games [R, from memory]. None of this tests engine-last review; they are directions to try.

### Step 48: contrast

Title: Does the threat still exist?

Prompt: Predict first. In the second position White's bishop stands on c4 instead of d3. Is a mate on h7 still threatened? In the third, White's a-pawn is on a3. Does that change what Black should do?

**The working board:**

**Task `IHI-LHIENGINESHUMANS3-7`** (find_move, difficulty cue 1)

Black is a piece up and White threatens mate on h7. Find a move that keeps the advantage and deals with White's idea.

```
  1  . . . R R K . .
  2  P P b . . P P P
  3  . . . . B . . .
  4  . . . . . . . .
  5  . . . P . . . .
  6  p Q . . p . . .
  7  . p . . b p p p
  8  k . r . q . . r
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: r2q1r1k/pppb2p1/3p2Qp/4P3/8/3B4/PPP2bPP/2KRR3 b - - 1 17
```

**Accepted answer(s):** Qg5+, Bf5

Feedback shown for wrong moves:
- Kg8: The king move leaves the threat on h7 in place and the engine rates it more than eight pawns lower at depth 16.
- Bxe1: Taking the rook ignores the threat: the engine rates this at least thirty pawns lower because it allows a mate.
- Bf5: Good: the bishop attacks the queen on g6 and keeps a decisive edge. The check on g5 is cleaner still (about +5.1 against +3.7).

**Explanation shown:** The threat is a queen move to h7 supported by the bishop. Qg5+ trades the queens with check and is the engine's first choice (about +5.1). Bf5 also stops the queen reaching h7 and keeps about +3.7. Taking a rook or stepping the king aside does not.

Hints (in order):
1. Ask what White's last move threatens before you look at what you can take.
2. The queen on g6 and the bishop on d3 line up on one diagonal.
3. Two moves work. One is a check that offers a queen trade.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] At depth 16 the queen check on g5 (about +5.1) is the engine's first choice and the bishop move to f5 (about +3.7) is also decisive; both score within 2 pawns of the best.
- [mate_in] If Black could pass, White would mate at once with the queen move to h7.
- [move_loses] At depth 16 the king move to g8 is rated at least 8 pawns lower than the engine's best move.
- [move_loses] At depth 16 the bishop capture on e1 is rated at least 30 pawns lower than the engine's best move (it allows a mate).

**The failing board:**

**Task `IHI-LHIENGINESHUMANS3-8`** (find_move, difficulty cue 1)

Black to move. White's bishop stands on c4 instead of d3. First decide: is a mate on h7 still threatened? Then play any strong move (several are accepted).

```
  1  . . . R R K . .
  2  P P b . . P P P
  3  . . . . . . . .
  4  . . . . . B . .
  5  . . . P . . . .
  6  p Q . . p . . .
  7  . p . . b p p p
  8  k . r . q . . r
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: r2q1r1k/pppb2p1/3p2Qp/4P3/2B5/8/PPP2bPP/2KRR3 b - - 1 17
```

**Accepted answer(s):** Bf5, Be8, Qe8, Bxe1, Bh4, Qh4, d5

**Explanation shown:** Without the bishop behind the queen, a queen move to h7 is not mate, so there is no mate threat to stop. Black can take a rook or improve a piece.

Hints (in order):
1. Which piece used to support a queen on h7?
2. With the bishop on c4 the queen on h7 would be alone.
3. Taking material or moving a bishop both work here.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] At depth 16 the engine's first choice is the bishop move to f5, and these seven moves all score within 2.5 pawns of it: nothing needs to be stopped, so taking material or improving a piece is fine.
- [move_is_not_mate] If Black could pass, the queen move to h7 would not be checkmate.

**The irrelevant board:**

**Task `IHI-LHIENGINESHUMANS3-9`** (find_move, difficulty cue 1)

Black to move. White's a-pawn stands on a3. Does that change what Black must do about h7?

```
  1  . . . R R K . .
  2  P P b . . P P .
  3  . . . . B . . P
  4  . . . . . . . .
  5  . . . P . . . .
  6  p Q . . p . . .
  7  . p . . b p p p
  8  k . r . q . . r
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: r2q1r1k/pppb2p1/3p2Qp/4P3/8/P2B4/1PP2bPP/2KRR3 b - - 0 17
```

**Accepted answer(s):** Qg5+, Bf5

**Explanation shown:** The a-pawn is irrelevant to the threat on h7: the same moves work, and the queen check is still the engine's first choice.

Hints (in order):
1. The pawn is far from the kingside.
2. The threat on h7 is unchanged.
3. The same two moves work as before.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] At depth 16 the queen check on g5 is the engine's first choice and the bishop move to f5 is also decisive, within 2 pawns.
- [mate_in] If Black could pass, White would mate at once with the queen move to h7.

### Step 49: item

**Task `IHI-LHIENGINESHUMANS3-4`** (classify_position, difficulty cue 3)

Black plays the bishop capture on f4 and loses a rook. Which sentence belongs in your notes as the lesson, not just the best move?

```
  1  . . . . . . . .
  2  . . . . K . P .
  3  . . . N . P . .
  4  . . P . P . . .
  5  . . . . p . . .
  6  b . . . . q . p
  7  . . . Q . . p .
  8  . . r . . . k .
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: 1k3r2/1p2Q3/p1q4b/3p4/3P1P2/2P1N3/1P1K4/8 b - - 2 37
```

**Accepted answer:** {"class": "Before a capture, ask what the capturing piece is guarding."}

**Explanation shown:** The bishop was the only guard of the rook on f8. A reusable lesson asks what the capturing piece is guarding before it captures.

Hints (in order):
1. A sentence for your notes should work in other positions, not only here.
2. Which of your pieces becomes undefended when the bishop leaves h6?
3. The bishop on h6 was guarding the rook on f8.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [loose_pieces] After Bxf4 the rook on f8 is Black's only loose piece.
- [move_loses] At depth 16 the bishop capture on f4 is rated at least 5 pawns lower than the engine's best move.

### Step 50: item

**Task `IHI-LHIENGINESHUMANS3-1`** (predict_outcome, difficulty cue 3)

Black has just moved. The engine shows about -5.0 at depth 16. Who is better, and why does the sign say so?

```
  8  r . . q r . k .
  7  p p p b . p p .
  6  . . . p . . . p
  5  . . . Q . . . .
  4  . . B . P . . b
  3  . . . . . . . .
  2  P P P . . P P P
  1  . . K R R . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: r2qr1k1/pppb1pp1/3p3p/3Q4/2B1P2b/8/PPP2PPP/2KRR3 w - - 0 14
```

**Accepted answer:** {"outcome": "Black"}

**Explanation shown:** The engine's number is measured from White's side, so a minus sign means Black is ahead: here by roughly four to seven pawns at depth 16.

Hints (in order):
1. Which side is the number measured from?
2. A minus sign means Black.
3. Black.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [eval_range] At depth 16 the engine rates the position between about -7 and -3.5 pawns (White's side): clearly better for Black.

### Step 51: item

**Task `IHI-LHIENGINESHUMANS3-6`** (predict_outcome, difficulty cue 3)

A friend says the engine shows +0.4, so White should attack. What do you answer?

```
  8  r n . q . r k .
  7  . p . . b p p p
  6  p . . p b n . .
  5  . . . . p . . .
  4  . . . . P . . .
  3  . N N . B P . .
  2  P P P Q . . P P
  1  R . . . K B . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: rn1q1rk1/1p2bppp/p2pbn2/4p3/4P3/1NN1BP2/PPPQ2PP/R3KB1R w KQ - 3 10
```

**Accepted answer:** {"outcome": "A small number: the structure and pieces should guide the plan"}

**Explanation shown:** [I] Below about half a pawn, a plan comes from the structure more than from the number. At depth 16 the score here is only a few tenths of a pawn.

Hints (in order):
1. Compare a few tenths of a pawn with the scale on the card.
2. Several different moves score almost the same here.
3. It is a small edge at most.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [eval_range] At depth 16 the engine rates the position between about +0.1 and +0.9 pawns.

### Step 52: board

Caption: Common mistake: playing the engine's line without knowing why. This is the engine's first line for Black. Before you trust it, say what each move stops or threatens.

```
  8  r . . q . r . k
  7  p p p b . . p .
  6  . . . p . . Q p
  5  . . . . P . . .
  4  . . . . . . . .
  3  . . . B . . . .
  2  P P P . . b P P
  1  . . K R R . . .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: r2q1r1k/pppb2p1/3p2Qp/4P3/8/3B4/PPP2bPP/2KRR3 b - - 1 17
```

The line, with the sentence the learner sees at each move:
1. **17... Qg5+**: A check that offers a queen trade: the piece that threatens mate must trade or leave.
2. **18. Qxg5**: White takes.
3. **18... hxg5**: Black recaptures, and the threat on h7 has gone with the queens.
4. **19. Re2**: The rook attacks the bishop on f2.
5. **19... Bg4**: The bishop attacks the rook on e2.
6. **20. Rdd2**: The other rook comes to d2 and guards the rook on e2.
7. **20... Bxe2**: Black takes the rook on e2.
8. **21. Rxe2**: White recaptures.

```
  8  r . . . . r . k
  7  p p p . . . p .
  6  . . . p . . . .
  5  . . . . P . p .
  4  . . . . . . . .
  3  . . . B . . . .
  2  P P P . R b P P
  1  . . K . . . . .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r4r1k/ppp3p1/3p4/4P1p1/8/3B4/PPP1RbPP/2K5 b - - 0 21
```

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [attackers] After Qg5+, one white piece attacks the black queen on g5.
- [attackers] After Re2, one white piece attacks the bishop on f2.
- [attackers] After ...Bg4, one black piece attacks the rook on e2.
- [attackers] After Rdd2, one white piece defends the rook on e2.

### Step 53: reflect

Kind: unsure

Prompt: Two patterns so far: the capturing piece was a guard, and the check you did not look at. Which one does this engine line belong to? Name the pattern in one word and write the one question that would have caught it.

- Field "pattern, in one word:" (free text)

- Field "the question that would have caught it:" (free text)

### Step 54: card

**Three habits that waste an engine.** One, shown above: playing its line without knowing why. Two: trusting a small plus in a quiet position; a score near plus one half is within what both sides can reach with sensible play [I]. Three: analysing only your losses. [H] Wins hide errors too. [H] Reading the engine's answer before trying may feel like learning without being so; this is our conjecture.

### Step 55: reflect

Kind: unsure

Prompt: Which of the three habits is yours? Write one sentence about the last time you did it.

- Field "my habit, and the last time:" (free text)

### Step 56: card

**Where engines mislead.** Three cases. Depth: the same position gave -1.3 at depth 2 and a forced mate at depth 6 [V, earlier board]. Perfect play: the score assumes both sides play exactly, so a plus that needs ten precise moves may be worth little to you [I]. Fortresses: when the side ahead cannot make progress against best defence, a large number can hide a draw [R, endgame books; we did not check a position here].

### Step 57: card

**Compare ideas with several lines.** The Lines setting in Analysis shows more than one engine choice. Set it to 3 on the Ruy Lopez position from earlier and hide the scores in your mind. For each of the three first moves, write what it is for in one sentence. Then compare the ideas. [H] Choosing between ideas for your own reasons trains judgement more than reading which number is largest.

### Step 58: reflect

Kind: expect

Prompt: Open the Ruy Lopez position in Analysis with Lines set to 3. Write the idea of each first move before you look at its score, then say which idea you prefer and why.

- Field "first move, idea:" (free text)

- Field "second move, idea:" (free text)

- Field "third move, idea:" (free text)

- Field "I prefer, because:" (free text)

### Step 59: card

**A weekly routine [H].** After a game that mattered: replay it without the engine and mark the moments you felt unsure (ten minutes). Run whole-game analysis and open only the three biggest swings, writing your sentence before each answer (ten minutes). Name the pattern in one word and add it to a list (two minutes). Once a week, pick one pattern to watch for. Cut any step you will not do.

### Step 60: board

Caption: Teach it back with this position (puzzle 0LeZV, a real game; White to move after Black's rook took a knight on e3). Set it up for a beginner: what do you ask them to write first, which pattern is it, and which single question would have caught it?

```
  8  . . . Q . r . k
  7  . . P . . . p .
  6  b . . . . . . p
  5  P . p . . . . .
  4  . p . . . . . .
  3  . . . . r . P q
  2  . . . . . . . P
  1  . . . . R . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 3Q1r1k/2P3p1/b6p/P1p5/1p6/4r1Pq/7P/4R1K1 w - - 0 35
```

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [loose_pieces] Black has two loose pieces: the rook on e3 and the rook on f8.
- [attackers] One white piece attacks the rook on f8: the queen on d8.

### Step 61: reflect

Kind: unsure

Prompt: Teach it back. A club teammate says: 'I just look at what the engine says after my game.' Explain engine-last review to them in your own words.

- Field "the idea:" (free text)

- Field "when it helps, and when it does not:" (free text)

- Field "an example they could set up on a board:" (free text)

- Field "one warning:" (free text)

### Step 62: card

**Teach-back checklist.** Did you (1) ask your listener for a sentence before showing the engine, (2) name the pattern, (3) give one example they could set up on a board, (4) give one warning? A missing item is the one to practise.

### Step 63: card

**Recap.** Write before you ask; compare ideas, then numbers. The first move is advice, the rest is evidence. Before a capture ask what the piece was guarding. [H] Keep one habit: a sentence of why before the engine. **Check yourself:** minus means Black is better; depth is how far the search looked; for a line, say what each move threatens and stops; drop the habit you named.

### Step 64: reflect

Kind: confidence

Prompt: Your engine habits. Write one habit you will start, one you will stop, and the first game you will use them on.

- Field "I will start:" (free text)

- Field "I will stop:" (free text)

- Field "first game:" (free text)

---

## Reviewer scorecard

Fill in the file `content/review/L-HI-ENGINES-HUMANS-3.json` (a template is below). Scale 1 to 5 for each dimension: 1 = wrong or unusable, 3 = acceptable with edits, 5 = I would put my name to it as it stands.
Revision to review: `0c4fe1c1`. If the lesson text changes after your review, your sign-off no longer applies and the lesson goes back to needs-human.

| Dimension | What to judge | Score |
|---|---|---|
| chess | every statement, line and explanation is correct; near-misses are really near-misses | |
| clarity | the explanation actually explains (mechanism, conditions), in plain words | |
| prerequisites | the lesson assumes only what the learner has met | |
| tasks | each task has one defensible answer and a fair explanation | |

```json
{
  "lesson": "L-HI-ENGINES-HUMANS-3",
  "revision": "0c4fe1c1",
  "reviewer": "<your name>",
  "reviewer_role": "strong-player",
  "date": "YYYY-MM-DD",
  "scores": {"chess": 0, "clarity": 0, "prerequisites": 0, "tasks": 0},
  "comments": "<what to change, by step number>",
  "verdict": "approved"
}
```

`reviewer_role` is `strong-player` or `teacher`. `verdict` is `approved` or `changes-requested`. See docs/review-slice.md.
