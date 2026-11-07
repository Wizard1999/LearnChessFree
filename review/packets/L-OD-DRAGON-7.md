# Review packet: L-OD-DRAGON-7

**The quieter lines: Classical 6.Be2, 6.f3, 6.g3 and 6.Bc4**

- Skill: OPN.STRUCT (D2); stage: exemplar; stated length: 36 minutes
- Steps: 67 (10 are tasks); revision: `79e9cd4f`
- Review status now: needs-human

## What the lesson says the learner will be able to do

- Compares four quiet White sixth moves (Be2, f3, g3, Bc4) by what each commits and what the engine's edge is, and reads the master counts with their sample sizes
- Plays and explains the Classical set-up (Be2, O-O, Be3, Nb3) and states Black's plan when both kings are castled short
- Decides whether ...Bg4 works by checking which square the white queen is on, and spots the trap in 6.Bc4 Nxe4
- Recognises the Yugoslav set-up whatever the move order, and meets 6.f3 Nc6 without trading on c6
- Names the lever that 6.g3 allows (e4-e5) and avoids Yugoslav habits (...Qa5, ...Bg4, ...h5) when White's king is on g1

## Sources the author names (check that they are used fairly, in our own words)

- app/public/masters/stats.json: 329,379 top-level games (both players 2500+), built 2026-10-29; counts read from the tree rows after 5...g6 (6.Be2 69 games 25/21/23, average rating 2,622; 6.Be3 579 games 221/235/123, 2,765; 6.f3 25 games 6/8/11; 6.g3 42 games 14/14/14; 6.Bc4 20 games 5/12/3, 2,864) and after 6.f3, 6.g3 (next moves) [V]
- app/public/openings (Lichess standard rated games CC0, September 2026, 4,752,291 games): band 2100+ after 5...g6, 1,436 games; 6.Be2 144 games (White 60, draws 15, Black 69); online results, not master theory [V]
- docs/citable-views.md 1.13 (Capablanca, Chess Fundamentals: an opening is judged by the concessions it forces) [V-sheet]; 4.11 (E. Lasker, Chess Strategy; Philidor: with opposite-side castling pawns are cheap and speed decides) [V-sheet]; 8.8 (Znosko-Borovsky, The Middle Game in Chess: the knight in crowded positions) [V-sheet]
- content/items/lesson-od-l-od-dragon-7.json: positions replayed with python-chess from the stated move orders; two edited positions (queen on d2, pawn on a6) are marked as not game positions; engine claims Stockfish 19 lite, depth 16 (evidence under recorded limits, not proof)
- Board lines in the lesson: replayed with python-chess; engine principal variations at depth 14 to 16 were used to choose the lines; conjecture is labelled [H] or [I] in the text
- docs/lesson-depth-standard.md section 6 (opening series, lesson 5: critical sidelines and move-order tricks); docs/competition-chess-steps.md

## How to read this packet

Boards are drawn with capitals for White and lower case for Black, rank 8 at the top unless the board is shown from Black's side. Moves in a line are in standard notation. Statements marked [V] were machine-checked, [I] inference, [H] hypothesis, [S] secondary source, [R] recalled. Please judge the explanations, not only the moves: does each sentence tell the learner why?

---

## Chapter: What if White waits?

### Step 1: board

Caption: White has castled short and Black's king is still in the middle. Black has the bishop on g7 and a half-open c-file. Can Black still attack here, and where?

```
  8  r . b q k . . r
  7  p p . . p p b p
  6  . . n p . n p .
  5  . . . . . . . .
  4  . . . N P . . .
  3  . . N . . . . .
  2  P P P . B P P P
  1  R . B Q . R K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: r1bqk2r/pp2ppbp/2np1np1/8/3NP3/2N5/PPP1BPPP/R1BQ1RK1 w kq - 4 8
```

Drawn on the board: highlighted squares g7, c2, e4, g1, d4.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [king_wing] White's king is on the kingside.
- [king_wing] Black's king is still in the centre.
- [open_files] The c-file is half open for Black and the d-file for White.
- [eval_range] The engine (depth 16) rates the position as slightly better for White: between 0 and half a pawn.

### Step 2: reflect

Kind: expect

Prompt: Before any explanation: can Black still attack here, and where? Pick the target you believe in.

- Field "Black's best target:" with options: White's king (a pawn storm) / White's centre: the e4 pawn and the knights / the c-file and the queenside / nowhere yet; just develop; no single correct answer (a guess or a self-report)

### Step 3: card

**The question.** Every Dragon player meets White's quieter sixth moves: Be2, f3, g3 and Bc4. What does each gain and give up? What does Black do when White's king stays home? [H] You already own most of the answer: the four Yugoslav ideas (long diagonal, c-file, the ...d5 break, king safety) still work, and only the h-pawn attack disappears. We test that guess as we go.

## Chapter: The four quiet moves

### Step 4: board

Caption: White to move after 5...g6. The four quiet moves of this lesson are the arrows. The main move 6.Be3 leads to the Yugoslav Attack and has its own lessons.

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

Drawn on the board: arrows f1-e2, f2-f3, g2-g3, f1-c4; highlighted squares e2, f3, g3, c4.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] Be2 is legal.
- [legal_move] f3 is legal.
- [legal_move] g3 is legal.
- [legal_move] Bc4 is legal.

### Step 5: reflect

Kind: expect

Prompt: Guess before you see the numbers: after which of the four moves does the engine give White the biggest edge, and after which the smallest? Write the reason for your guess; the next boards show the measured answer, so a wrong guess costs nothing.

- Field "Biggest edge:" with options: 6.Be2 / 6.f3 / 6.g3 / 6.Bc4; no single correct answer (a guess or a self-report)

- Field "Smallest edge:" with options: 6.Be2 / 6.f3 / 6.g3 / 6.Bc4; no single correct answer (a guess or a self-report)

### Step 6: board

Caption: After 6.Be2, the Classical setup. Engine edge for White about +0.2 to +0.3 at depth 16, one engine and run to run [V].

```
  8  r n b q k b . r
  7  p p . . p p . p
  6  . . . p . n p .
  5  . . . . . . . .
  4  . . . N P . . .
  3  . . N . . . . .
  2  P P P . B P P P
  1  R . B Q K . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: rnbqkb1r/pp2pp1p/3p1np1/8/3NP3/2N5/PPP1BPPP/R1BQK2R b KQkq - 1 6
```

The line, with the sentence the learner sees at each move:
1. **6... Bg7**: Black's usual reply (68 of 69 master games [V]): the bishop takes the long diagonal.
2. **7. O-O**: White castles at once: the king is home before anything else is decided.

```
  8  r n b q k . . r
  7  p p . . p p b p
  6  . . . p . n p .
  5  . . . . . . . .
  4  . . . N P . . .
  3  . . N . . . . .
  2  P P P . B P P P
  1  R . B Q . R K .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: rnbqk2r/pp2ppbp/3p1np1/8/3NP3/2N5/PPP1BPPP/R1BQ1RK1 b kq - 3 7
```

Drawn on the board: highlighted squares e2, g7.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [eval_range] The engine (depth 16) rates the position as slightly better for White: between +0.10 and +0.45.

### Step 7: board

Caption: After 6.f3. Engine edge for White about +0.6 at depth 16 [V]: the biggest of the four, and the same size as after 6.Be3, because 6.f3 is the Yugoslav setup by another route.

```
  8  r n b q k b . r
  7  p p . . p p . p
  6  . . . p . n p .
  5  . . . . . . . .
  4  . . . N P . . .
  3  . . N . . P . .
  2  P P P . . . P P
  1  R . B Q K B . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: rnbqkb1r/pp2pp1p/3p1np1/8/3NP3/2N2P2/PPP3PP/R1BQKB1R b KQkq - 0 6
```

The line, with the sentence the learner sees at each move:
1. **6... Bg7**: Same bishop move; Black does not need to decide about the knight yet.
2. **7. Be3**: The bishop takes its best square: the Yugoslav setup is on the way.

```
  8  r n b q k . . r
  7  p p . . p p b p
  6  . . . p . n p .
  5  . . . . . . . .
  4  . . . N P . . .
  3  . . N . B P . .
  2  P P P . . . P P
  1  R . . Q K B . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: rnbqk2r/pp2ppbp/3p1np1/8/3NP3/2N1BP2/PPP3PP/R2QKB1R b KQkq - 2 7
```

Drawn on the board: highlighted squares f3, e3.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [eval_range] The engine (depth 16) rates the position as clearly better for White: between +0.5 and +0.9.

### Step 8: board

Caption: After 6.g3. Engine edge for White about +0.1 at depth 16 [V]: the smallest of the four.

```
  8  r n b q k b . r
  7  p p . . p p . p
  6  . . . p . n p .
  5  . . . . . . . .
  4  . . . N P . . .
  3  . . N . . . P .
  2  P P P . . P . P
  1  R . B Q K B . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: rnbqkb1r/pp2pp1p/3p1np1/8/3NP3/2N3P1/PPP2P1P/R1BQKB1R b KQkq - 0 6
```

The line, with the sentence the learner sees at each move:
1. **6... Nc6**: Black attacks the d4 knight at once.
2. **7. Bg2**: The fianchetto bishop completes the setup and guards e4 from a distance.

```
  8  r . b q k b . r
  7  p p . . p p . p
  6  . . n p . n p .
  5  . . . . . . . .
  4  . . . N P . . .
  3  . . N . . . P .
  2  P P P . . P B P
  1  R . B Q K . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r1bqkb1r/pp2pp1p/2np1np1/8/3NP3/2N3P1/PPP2PBP/R1BQK2R b KQkq - 2 7
```

Drawn on the board: highlighted squares g3, g2.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [eval_range] The engine (depth 16) rates the position as level: between -0.25 and +0.2.

### Step 9: board

Caption: After 6.Bc4, with the bishop aimed at f7. Engine edge for White about +0.2 to +0.4 at depth 16 [V], like 6.Be2.

```
  8  r n b q k b . r
  7  p p . . p p . p
  6  . . . p . n p .
  5  . . . . . . . .
  4  . . B N P . . .
  3  . . N . . . . .
  2  P P P . . P P P
  1  R . B Q K . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: rnbqkb1r/pp2pp1p/3p1np1/8/2BNP3/2N5/PPP2PPP/R1BQK2R b KQkq - 1 6
```

The line, with the sentence the learner sees at each move:
1. **6... Bg7**: Black develops; the other Dragon moves can wait.
2. **7. f3**: The pawn guards e4 and heads for a Yugoslav-style setup with the bishop already on c4.

```
  8  r n b q k . . r
  7  p p . . p p b p
  6  . . . p . n p .
  5  . . . . . . . .
  4  . . B N P . . .
  3  . . N . . P . .
  2  P P P . . . P P
  1  R . B Q K . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: rnbqk2r/pp2ppbp/3p1np1/8/2BNP3/2N2P2/PPP3PP/R1BQK2R b KQkq - 0 7
```

Drawn on the board: highlighted squares c4, f7.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [eval_range] The engine (depth 16) rates the position as slightly better for White: between +0.15 and +0.5.

### Step 10: card

**Reading the ladder.** Depth-16 numbers [V], run to run: about 60 centipawns after f3 (the same after Be3), 20 to 40 after Be2 and Bc4, about 10 after g3. [I] The quiet moves leave the Yugoslav behind and give Black an easier game. But f3 is the Yugoslav by another route, so its edge is the Yugoslav's edge [H]. Capablanca's yardstick in *Chess Fundamentals*, judging an opening by the concessions it forces, is a rule of thumb [I], and this ladder is a counterexample to 'commit less, concede less'.

### Step 11: board

Caption: The Classical Dragon: the quiet road to a position where both kings are castled short.

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
1. **6. Be2**: Develops and clears f1 for castling. Only the knight on c3 guards e4, and the f-pawn stays home.
2. **6... Bg7**: The Dragon bishop. Its own knight on f6 blocks the long diagonal for now.
3. **7. O-O**: White's king goes home to g1. No pawn storm is planned, so no pawn needs to move.
4. **7... O-O**: Black's king is safe too. Both kings now stand on the kingside.

```
  8  r n b q . r k .
  7  p p . . p p b p
  6  . . . p . n p .
  5  . . . . . . . .
  4  . . . N P . . .
  3  . . N . . . . .
  2  P P P . B P P P
  1  R . B Q . R K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: rnbq1rk1/pp2ppbp/3p1np1/8/3NP3/2N5/PPP1BPPP/R1BQ1RK1 w - - 4 8
```

Drawn on the board: highlighted squares e2, g1, g8.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [attackers] After Be2 only one white piece guards e4.
- [king_wing] White's king is on the kingside.
- [king_wing] Black's king is on the kingside.

### Step 12: board

Caption: For contrast: the Yugoslav, where the kings stand on opposite wings (covered fully in the lessons before this one).

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
FEN: r1bq1rk1/pp2ppbp/2np1np1/8/3NP3/2N1BP2/PPPQ2PP/R3KB1R w KQ - 5 9
```

The line, with the sentence the learner sees at each move:
1. **9. O-O-O**: White's king goes to the queenside. The kings are on opposite wings, so pawns on the kingside are cheap.
2. **9... Bd7**: Black develops and prepares a rook for the half-open c-file.
3. **10. Kb1**: A useful king step: off the c-file, away from checks and pins.
4. **10... Rc8**: The rook takes the half-open c-file: the Yugoslav plan against a king on the queenside.

```
  8  . . r q . r k .
  7  p p . b p p b p
  6  . . n p . n p .
  5  . . . . . . . .
  4  . . . N P . . .
  3  . . N . B P . .
  2  P P P Q . . P P
  1  . K . R . B . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 2rq1rk1/pp1bppbp/2np1np1/8/3NP3/2N1BP2/PPPQ2PP/1K1R1B1R w - - 9 11
```

Drawn on the board: highlighted squares c1, g8, c8.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [king_wing] After O-O-O White's king is on the queenside.
- [king_wing] Black's king is on the kingside.
- [open_files] The c-file is half open for Black.

## Chapter: Kings on one wing

### Step 13: card

**Kings on one wing.** Edward Lasker (*Chess Strategy*), and Philidor in a lighter-read source, noted that when kings castle on opposite wings, pawns are cheap and speed decides. [I] Turn it round: if White castles short, a pawn storm drags your own cover forward, so slow piece play and central breaks matter more. But the Classical is a family, not a fixed structure: White can delay castling and keep both wings open [V engine, next board]. Check where White's king is before you choose a plan.

### Step 14: board

Caption: 6.Be2 does not commit the king. After Bg7, Be3, Nc6 and now f3, White can put the queen on d2 and castle long: a Yugoslav-like game. Our masters' tree shows Be3 (not O-O) at move 7 in 10 of 68 games [S: a review count, not re-read here]. The engine rates this position at roughly +0.3 for White [V].

```
  8  r . b q k . . r
  7  p p . . p p b p
  6  . . n p . n p .
  5  . . . . . . . .
  4  . . . N P . . .
  3  . . N . B P . .
  2  P P P . B . P P
  1  R . . Q K . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: r1bqk2r/pp2ppbp/2np1np1/8/3NP3/2N1BP2/PPP1B1PP/R2QK2R b KQkq - 0 8
```

The line, with the sentence the learner sees at each move:
1. **8... O-O**: Black castles short as usual.
2. **9. Qd2**: The queen heads for a bishop trade on h6, the king-attack idea.
3. **9... d5**: Black strikes in the centre at once; the engine still calls it level.
4. **10. O-O-O**: White castles long: kings on opposite wings, the pawn storm is back on.

```
  8  r . b q . r k .
  7  p p . . p p b p
  6  . . n . . n p .
  5  . . . p . . . .
  4  . . . N P . . .
  3  . . N . B P . .
  2  P P P Q B . P P
  1  . . K R . . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r1bq1rk1/pp2ppbp/2n2np1/3p4/3NP3/2N1BP2/PPPQB1PP/2KR3R b - - 1 10
```

Drawn on the board: highlighted squares f3, d2, c1.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [eval_range] The engine (depth 16) rates the starting position as slightly better for White: between 0 and +0.6.
- [king_wing] After O-O-O White's king is on the queenside.
- [attackers] The f3 pawn and the c3 knight guard the e4 pawn.

### Step 15: reflect

Kind: expect

Prompt: Our masters' data after 5...g6: 6.Be2 was played in 69 games (White 25 wins, 21 draws, Black 23 wins); 6.Be3 in 579 games (221, 235, 123). Does this show that 6.Be2 is the weaker move?

- Field "My answer:" with options: yes, White scored less / no, these counts do not show that; no single correct answer (a guess or a self-report)

### Step 16: card

**Reading the numbers.** White scored about 51% after the Be2 move and about 58% after the Be3 move [V, our masters' data]. But the average rating was 2,622 against 2,765, and 69 games are a small sample. [I] Part of the gap may be who chooses the move. Online (2100+, 144 games) Black won 69 and White 60. Counts show what was played and how it ended, not why.

### Step 17: board

Caption: Classical line from 7...O-O (masters: 8.Re1 21 games, 8.Be3 21 games). The knight retreat 9.Nb3 is rare among masters (not in our tree), so this is engine guidance only [V engine]. One purpose per move.

```
  8  r n b q . r k .
  7  p p . . p p b p
  6  . . . p . n p .
  5  . . . . . . . .
  4  . . . N P . . .
  3  . . N . . . . .
  2  P P P . B P P P
  1  R . B Q . R K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: rnbq1rk1/pp2ppbp/3p1np1/8/3NP3/2N5/PPP1BPPP/R1BQ1RK1 w - - 4 8
```

The line, with the sentence the learner sees at each move:
1. **8. Be3**: Develops the last minor piece and adds a second guard to the d4 knight.
2. **8... Nc6**: Black asks a question: the knight attacks d4, guarded twice.
3. **9. Nb3**: The knight steps back. No trade, and the queen now sees d6 along the open file.
4. **9... Be6**: The bishop develops toward the queenside and eyes b3 and c4. The rook goes to c8 next.

```
  8  r . . q . r k .
  7  p p . . p p b p
  6  . . n p b n p .
  5  . . . . . . . .
  4  . . . . P . . .
  3  . N N . B . . .
  2  P P P . B P P P
  1  R . . Q . R K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r2q1rk1/pp2ppbp/2npbnp1/8/4P3/1NN1B3/PPP1BPPP/R2Q1RK1 w - - 8 10
```

Drawn on the board: highlighted squares d4, b3, e6.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [eval_range] The engine (depth 16) rates the starting position as close to level: between 0 and +0.4.
- [attackers] After ...Nc6 the knight on d4 is attacked once.
- [attackers] After ...Nc6 the knight on d4 is guarded twice.
- [attackers] After Nb3 the white queen attacks the pawn on d6.
- [piece_attacks] After ...Be6 the bishop attacks b3 and c4.

### Step 18: board

Caption: The other move order: 7...Nc6 first (52 of the 56 master games with 7.O-O went on with ...O-O). The structure is the same.

```
  8  r . b q k . . r
  7  p p . . p p b p
  6  . . n p . n p .
  5  . . . . . . . .
  4  . . . N P . . .
  3  . . N . . . . .
  2  P P P . B P P P
  1  R . B Q . R K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: r1bqk2r/pp2ppbp/2np1np1/8/3NP3/2N5/PPP1BPPP/R1BQ1RK1 w kq - 4 8
```

The line, with the sentence the learner sees at each move:
1. **8. Be3**: Develops and keeps the knight on d4 guarded.
2. **8... O-O**: Black castles; 7...Nc6 first or 7...O-O first reaches the same positions.
3. **9. Re1**: The rook takes the e-file behind the e4 pawn.
4. **9... Nxd4**: Black trades off the d4 knight.
5. **10. Bxd4**: The bishop recaptures; it now looks at f6, with the bishop on g7 behind that knight.
6. **10... Bd7**: Black develops the light bishop toward c6.

```
  8  r . . q . r k .
  7  p p . b p p b p
  6  . . . p . n p .
  5  . . . . . . . .
  4  . . . B P . . .
  3  . . N . . . . .
  2  P P P . B P P P
  1  R . . Q R . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r2q1rk1/pp1bppbp/3p1np1/8/3BP3/2N5/PPP1BPPP/R2QR1K1 w - - 1 11
```

Drawn on the board: highlighted squares d4, g7, e1.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] Be3 and a4 are each within 40 centipawns of the engine's top move (depth 16).
- [piece_attacks] After Bxd4 the bishop on d4 attacks the knight on f6 and the pawn on a7.

### Step 19: board

Caption: The main line after 8...Nc6: 9.Qd2 (29 masters visits; 9.a4 11 [S: review count]). Queen and bishop line up for a bishop trade on h6, and Black answers with an exchange on d4 or the d5 break.

```
  8  r . b q . r k .
  7  p p . . p p b p
  6  . . n p . n p .
  5  . . . . . . . .
  4  . . . N P . . .
  3  . . N . B . . .
  2  P P P . B P P P
  1  R . . Q . R K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: r1bq1rk1/pp2ppbp/2np1np1/8/3NP3/2N1B3/PPP1BPPP/R2Q1RK1 w - - 6 9
```

The line, with the sentence the learner sees at each move:
1. **9. Qd2**: The queen joins the bishop on e3: the pair eyes h6, where a trade would remove Black's Dragon bishop [I].
2. **9... Nxd4**: Black exchanges the knight that was hitting d4; the engine rates this fully playable.
3. **10. Bxd4**: The bishop recaptures and now looks at f6 and a7.
4. **10... Be6**: Black develops the light bishop and prepares a rook for the c-file.

```
  8  r . . q . r k .
  7  p p . . p p b p
  6  . . . p b n p .
  5  . . . . . . . .
  4  . . . B P . . .
  3  . . N . . . . .
  2  P P P Q B P P P
  1  R . . . . R K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r2q1rk1/pp2ppbp/3pbnp1/8/3BP3/2N5/PPPQBPPP/R4RK1 w - - 1 11
```

Drawn on the board: highlighted squares d2, e3, h6.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] Qd2, a4, Re1 and h3 are each within 40 centipawns of the engine's top move (depth 16).
- [piece_attacks] After Bxd4 the bishop on d4 attacks the knight on f6 and the pawn on a7.

### Step 20: card

**What each side wants.** White can gain space on the kingside and a-file, or prepare a bishop trade with the queen move. Black develops the light bishop, places a rook on the c-file and expands on the queenside [see the boards]. [V engine] The queen move, a4, the rook to e1 and h3 are within a few centipawns (15 to 25); the knight retreat and trade sit about 10 lower, a human plan. [H] With White's king safe, Black's queenside pushes cost less.

### Step 21: board

Caption: Black's space plan with ...a6 and ...b5: the Classical version of the queenside play.

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
1. **9... a6**: Black prepares ...b5, the queenside space plan.
2. **10. f4**: White takes space in the centre and on the kingside.
3. **10... b5**: The pawn gains space. No white attack is coming, so the advance costs little [H].
4. **11. Bf3**: The bishop eyes the knight on c6 and the long diagonal.
5. **11... Bb7**: Black develops and keeps the queenside space.

```
  8  r . . q . r k .
  7  . b . . p p b p
  6  p . n p . n p .
  5  . p . . . . . .
  4  . . . . P P . .
  3  . N N . B B . .
  2  P P P . . . P P
  1  R . . Q . R K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r2q1rk1/1b2ppbp/p1np1np1/1p6/4PP2/1NN1BB2/PPP3PP/R2Q1RK1 w - - 2 12
```

Drawn on the board: highlighted squares a6, b5, g1.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] a6 and Be6 are each within 40 centipawns of the engine's top move (depth 16).
- [piece_on] After ...b5 a black pawn stands on b5.
- [king_wing] White's king is still on the kingside.

### Step 22: board

Caption: White's space plan, f4 and a quiet king move (masters reach this structure only in a handful of games, so this is engine guidance).

```
  8  r . . q . r k .
  7  p p . . p p b p
  6  . . n p b n p .
  5  . . . . . . . .
  4  . . . . P . . .
  3  . N N . B . . .
  2  P P P . B P P P
  1  R . . Q . R K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: r2q1rk1/pp2ppbp/2npbnp1/8/4P3/1NN1B3/PPP1BPPP/R2Q1RK1 w - - 8 10
```

The line, with the sentence the learner sees at each move:
1. **10. f4**: Gains space on the kingside and prepares the e5 break.
2. **10... Qc8**: Queen and bishop line up behind each other: both aim at h3.
3. **11. Kh1**: A prophylactic step [I]: the king leaves g1 before the battery on the c8-h3 diagonal gets ideas.

```
  8  r . q . . r k .
  7  p p . . p p b p
  6  . . n p b n p .
  5  . . . . . . . .
  4  . . . . P P . .
  3  . N N . B . . .
  2  P P P . B . P P
  1  R . . Q . R . K
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r1q2rk1/pp2ppbp/2npbnp1/8/4PP2/1NN1B3/PPP1B1PP/R2Q1R1K b - - 2 11
```

Drawn on the board: highlighted squares f4, h3, c8.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] f4, Qd2, h3 and Re1 are each within 40 centipawns of the engine's top move (depth 16).
- [piece_attacks] After ...Qc8 the bishop on e6 attacks h3 with the queen behind it.
- [piece_on] After Kh1 the king stands on h1.

### Step 23: board

Caption: Trading on c6 instead of retreating: the structure changes. Black gets the half-open b-file and a pawn that watches d5; White gets targets on c6 and d6.

```
  8  r . b q . r k .
  7  p p . . p p b p
  6  . . n p . n p .
  5  . . . . . . . .
  4  . . . N P . . .
  3  . . N . B . . .
  2  P P P . B P P P
  1  R . . Q . R K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: r1bq1rk1/pp2ppbp/2np1np1/8/3NP3/2N1B3/PPP1BPPP/R2Q1RK1 w - - 6 9
```

The line, with the sentence the learner sees at each move:
1. **9. Nxc6**: The other way to meet the knight: trade at once.
2. **9... bxc6**: The b-pawn recaptures. The b-file is half open for Black and the c6 pawn watches d5.

```
  8  r . b q . r k .
  7  p . . . p p b p
  6  . . p p . n p .
  5  . . . . . . . .
  4  . . . . P . . .
  3  . . N . B . . .
  2  P P P . B P P P
  1  R . . Q . R K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r1bq1rk1/p3ppbp/2pp1np1/8/4P3/2N1B3/PPP1BPPP/R2Q1RK1 w - - 0 10
```

Drawn on the board: highlighted squares c6, b7, d5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [open_files] After the trade the b-file is half open for Black.
- [pawn_attackers] After the recapture a black pawn attacks d5.

### Step 24: board

Caption: After the trade: both sides fight for the d-file.

```
  8  r . b q . r k .
  7  p . . . p p b p
  6  . . p p . n p .
  5  . . . . . . . .
  4  . . . . P . . .
  3  . . N . B . . .
  2  P P P . B P P P
  1  R . . Q . R K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: r1bq1rk1/p3ppbp/2pp1np1/8/4P3/2N1B3/PPP1BPPP/R2Q1RK1 w - - 0 10
```

The line, with the sentence the learner sees at each move:
1. **10. Qd2**: The queen develops toward the centre.
2. **10... Qc7**: Black's queen steps off the d-file and guards c6 and d6.
3. **11. Rad1**: A rook takes the d-file behind the queen.
4. **11... Rd8**: Black contests the file: the engine calls the position balanced.

```
  8  r . b r . . k .
  7  p . q . p p b p
  6  . . p p . n p .
  5  . . . . . . . .
  4  . . . . P . . .
  3  . . N . B . . .
  2  P P P Q B P P P
  1  . . . R . R K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r1br2k1/p1q1ppbp/2pp1np1/8/4P3/2N1B3/PPPQBPPP/3R1RK1 w - - 4 12
```

Drawn on the board: highlighted squares c6, d1, d8.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [eval_range] The engine (depth 16) rates the starting position as balanced: between -0.3 and +0.3.
- [piece_attacks] After ...Qc7 the queen guards c6 and d6.

### Step 25: card

**Retreat or trade?** The engine separates them by about one centipawn [V]. [H] Trade when you want to remove Black's active knight and aim at c6 and d6: Black's c-pawns are doubled, though Black gains the b-file and control of d5. Retreat when you want to keep the a4 and a5 pressure and not hand over the b-file. Znosko-Borovsky (*The Middle Game in Chess*) wrote that knights are strongest in crowded positions; his remark is not about this choice, so applying it here is our guess [H].

### Step 26: board

Caption: Black's knight route to c4: a human idea. The engine prefers ...Be6 by roughly 0.2 to 0.4 at depth 16 (and answers ...Ne5 with h3) [V]; read the knight jump as [H].

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
1. **9... Ne5**: The knight leaves c6 and heads for c4.
2. **10. h3**: White's best reply: the pawn covers g4 and gives the king air.
3. **10... Be6**: Black develops and attacks the knight on b3.
4. **11. Nd4**: The knight reroutes; the e5 knight now has c4.
5. **11... Nc4**: The knight jumps in and attacks the bishop on e3.

```
  8  r . . q . r k .
  7  p p . . p p b p
  6  . . . p b n p .
  5  . . . . . . . .
  4  . . n N P . . .
  3  . . N . B . . P
  2  P P P . B P P .
  1  R . . Q . R K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r2q1rk1/pp2ppbp/3pbnp1/8/2nNP3/2N1B2P/PPP1BPP1/R2Q1RK1 w - - 3 12
```

Drawn on the board: highlighted squares e5, c4, e3.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] Be6 is the engine's top move and Ne5 is within 60 centipawns of it (depth 16): Ne5 is playable but not best.
- [piece_attacks] After ...Ne5 the knight eyes c4.
- [pawn_attackers] After h3 a white pawn attacks g4.
- [piece_attacks] After ...Nc4 the knight attacks e3.

### Step 27: card

**Not the Yugoslav.** In the Yugoslav, f3 shuts the g4 square and guards e4, so Black can use neither; here the f-pawn is still on f2, so both squares are live. White's h3 is prophylaxis, not an attack. [H] That is why a knight route to c4 replaces the exchange sacrifice on c3.

### Step 28: board

Caption: The pawn push ...a5 hits the knight's retreat square at once, but the engine prefers developing: ...a5 gives White about +0.3, ...Be6 about 0 [V].

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
1. **9... a5**: The pawn threatens ...a4, which would chase the knight from b3.
2. **10. a4**: White stops it; Black's a-pawn is now fixed and the b5 square is no longer Black's.
3. **10... Be6**: Black develops and hits the knight on b3 again.
4. **11. Nd4**: The knight steps to d4 and the structure stays balanced.

```
  8  r . . q . r k .
  7  . p . . p p b p
  6  . . n p b n p .
  5  p . . . . . . .
  4  P . . N P . . .
  3  . . N . B . . .
  2  . P P . B P P P
  1  R . . Q . R K .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r2q1rk1/1p2ppbp/2npbnp1/p7/P2NP3/2N1B3/1PP1BPPP/R2Q1RK1 b - - 2 11
```

Drawn on the board: highlighted squares a5, a4, b3.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [move_loses] a5 is at least 15 centipawns worse than the best move (depth 16).
- [piece_on] After a4 a white pawn stands on a4.

### Step 29: card

**Plans, not races.** Both kings are already home, so there is no castling race and no tempo count: the side that develops best and keeps the better structure scores. [H] Be6 eyes b3 and c4 and prepares a rook for the c-file; the other bishop move keeps the c6 knight guarded and leaves g4 to the knight. The a-pawn push is slower than development, and the b-pawn push (after a6) wins space only once the knight has left d4.

### Step 30: board

Caption: Bg4 with the knight on d4 and the queen on d2: one white piece attacks g4, one black piece defends it.

```
  8  r . . q . r k .
  7  p p . . p p b p
  6  . . n p . n p .
  5  . . . . . . . .
  4  . . . N P . b .
  3  . . N . B . . .
  2  P P P Q B P P P
  1  R . . . . R K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: r2q1rk1/pp2ppbp/2np1np1/8/3NP1b1/2N1B3/PPPQBPPP/R4RK1 w - - 8 10
```

The line, with the sentence the learner sees at each move:
1. **10. f3**: White hits the bishop and guards e4.
2. **10... Nxd4**: Black removes the knight before White's pieces settle.
3. **11. Bxd4**: The bishop recaptures; the two dark-squared bishops now face each other.
4. **11... Be6**: Black keeps the bishop; the position stays balanced.

```
  8  r . . q . r k .
  7  p p . . p p b p
  6  . . . p b n p .
  5  . . . . . . . .
  4  . . . B P . . .
  3  . . N . . P . .
  2  P P P Q B . P P
  1  R . . . . R K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r2q1rk1/pp2ppbp/3pbnp1/8/3BP3/2N2P2/PPPQB1PP/R4RK1 w - - 1 12
```

Drawn on the board: highlighted squares g4, e2, d2.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [eval_range] The engine (depth 16) rates the starting position as close to level: between -0.2 and +0.6.
- [attackers] One white piece (the bishop on e2) attacks the bishop on g4.
- [attackers] One black piece (the knight on f6) defends the bishop on g4.

### Step 31: item

**Task `IOD-LODDRAGON7-1`** (find_move, difficulty cue 2)

Black to move. White's king is safe on g1 and no attack on it is possible yet. Find a move that develops a piece or hits the centre and keeps the position level.

```
  1  . K R . . . . R
  2  P P P B Q P P P
  3  . . . B . N . .
  4  . . . P N . . .
  5  . . . . . . . .
  6  . p n . p n . .
  7  p b p p . . p p
  8  . k r . q b . r
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: r1bq1rk1/pp2ppbp/2np1np1/8/3NP3/2N1B3/PPPQBPPP/R4RK1 b - - 7 9
```

**Accepted answer(s):** Ng4, Nxd4, Bd7, Re8, d5

**Explanation shown:** Ng4, Nxd4, Bd7, Re8 and d5 each score within 45 centipawns of the engine's best move at depth 16, so Black has no need to rush an attack while White's king stays at home.

Hints (in order):
1. White's king sits on g1 behind unmoved pawns. What does that say about speed?
2. Several developing or central moves are equally good; the knight on d4 and the centre offer targets.
3. Ng4, Nxd4, Bd7, Re8 or d5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] Ng4, Nxd4, Bd7, Re8 and d5 are each within 45 centipawns of the engine's top move (depth 16).
- [king_wing] White's king is on the kingside.

### Step 32: contrast

Title: Does ...Bg4 win a piece for White?

Prompt: Predict first. Position 1: White's queen is on d1, the knight on b3. Position 2: the queen is on d2. Position 3: Black's a-pawn is on a6. One difference matters, one does not.

**The working board:**

**Task `IOD-LODDRAGON7-2`** (predict_outcome, difficulty cue 1)

White to move after ...Bg4 (White's queen is on d1, the knight on b3). Does capturing on g4 win a piece (net, with best play)?

```
  8  r . . q . r k .
  7  p p . . p p b p
  6  . . n p . n p .
  5  . . . . . . . .
  4  . . . . P . b .
  3  . N N . B . . .
  2  P P P . B P P P
  1  R . . Q . R K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: r2q1rk1/pp2ppbp/2np1np1/8/4P1b1/1NN1B3/PPP1BPPP/R2Q1RK1 w - - 8 10
```

**Accepted answer:** {"outcome": "yes"}

**Explanation shown:** After Bxg4 the only recapture is the knight, and the queen on d1 takes it for free: White gains a piece.

Hints (in order):
1. After Bxg4 Nxg4, who attacks the knight on g4?
2. Look at the diagonal from d1 to g4: is anything in the way?
3. The queen takes the knight on g4 and nothing recaptures.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] Bxg4 is the engine's top move (depth 16).
- [eval_range] The engine (depth 16) rates the position at least three pawns better for White.
- [piece_on] The white queen is on d1.

**The failing board:**

**Task `IOD-LODDRAGON7-3`** (predict_outcome, difficulty cue 1)

White to move after ...Bg4 (the queen has been moved to d2; everything else as before). Does capturing on g4 win a piece (net, with best play)?

```
  8  r . . q . r k .
  7  p p . . p p b p
  6  . . n p . n p .
  5  . . . . . . . .
  4  . . . . P . b .
  3  . N N . B . . .
  2  P P P Q B P P P
  1  R . . . . R K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: r2q1rk1/pp2ppbp/2np1np1/8/4P1b1/1NN1B3/PPPQBPPP/R4RK1 w - - 8 10
```

**Accepted answer:** {"outcome": "no"}

**Explanation shown:** With the queen on d2 nothing attacks a knight that recaptures on g4, so Bxg4 Nxg4 is an even bishop trade, not a won piece (and the knight then attacks the bishop on e3). White's best here is still f3, about 60 centipawns at depth 16 [V]. The square of the queen decides.

Hints (in order):
1. Compare with the previous position. What moved?
2. From d2 the queen no longer looks along the diagonal to g4.
3. After Bxg4 Nxg4 nothing attacks the knight.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [material_after_move] Bxg4 wins at most one pawn here along the engine's line (depth 16): it does not win a piece.
- [piece_on] The white queen is on d2.

**The irrelevant board:**

**Task `IOD-LODDRAGON7-4`** (predict_outcome, difficulty cue 1)

White to move after ...Bg4. This time Black's a-pawn stands on a6 and White's queen is on d1. Does capturing on g4 win a piece (net, with best play)?

```
  8  r . . q . r k .
  7  . p . . p p b p
  6  p . n p . n p .
  5  . . . . . . . .
  4  . . . . P . b .
  3  . N N . B . . .
  2  P P P . B P P P
  1  R . . Q . R K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: r2q1rk1/1p2ppbp/p1np1np1/8/4P1b1/1NN1B3/PPP1BPPP/R2Q1RK1 w - - 8 10
```

**Accepted answer:** {"outcome": "yes"}

**Explanation shown:** The a-pawn takes no part: after Bxg4 Nxg4 the queen on d1 still takes the knight, so White gains a piece.

Hints (in order):
1. Which pieces take part in the capture on g4?
2. Is the a-pawn on any of the lines from d1 to g4?
3. Which pieces take part in the capture on g4?

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [material_after_move] Bxg4 wins at least a piece along the engine's line (depth 16).
- [piece_on] Black's pawn is on a6 and the white queen on d1.

### Step 33: board

Caption: The punishment when the queen is on d1: ...Bg4 with the knight already on b3 loses a piece.

```
  8  r . . q . r k .
  7  p p . . p p b p
  6  . . n p . n p .
  5  . . . . . . . .
  4  . . . . P . b .
  3  . N N . B . . .
  2  P P P . B P P P
  1  R . . Q . R K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: r2q1rk1/pp2ppbp/2np1np1/8/4P1b1/1NN1B3/PPP1BPPP/R2Q1RK1 w - - 8 10
```

The line, with the sentence the learner sees at each move:
1. **10. Bxg4**: White takes the bishop. Black's only recapture is the knight.
2. **10... Nxg4**: The knight recaptures, but nothing guards it.
3. **11. Qxg4**: The queen, still on d1, takes the knight: a whole piece won.

```
  8  r . . q . r k .
  7  p p . . p p b p
  6  . . n p . . p .
  5  . . . . . . . .
  4  . . . . P . Q .
  3  . N N . B . . .
  2  P P P . . P P P
  1  R . . . . R K .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r2q1rk1/pp2ppbp/2np2p1/8/4P1Q1/1NN1B3/PPP2PPP/R4RK1 b - - 0 11
```

Drawn on the board: highlighted squares g4, d1.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] Bxg4 is the engine's top move (depth 16).
- [eval_range] The engine (depth 16) rates the position at least three pawns better for White.
- [loose_pieces] After the capture and recapture, Black's knight on g4 is attacked and unguarded.
- [attackers] After the capture and recapture, the white queen attacks g4.

### Step 34: reflect

Kind: unsure

Prompt: In your own words: what single feature decided whether ...Bg4 worked? (Hint: one of the positions had a white piece on a different square.) Then finish the sentence: 'Before a bishop trade offer, I check ...'

- Field "The deciding feature:" with options: the square of the white queen / the square of the white knight / Black's a-pawn / White's king; no single correct answer (a guess or a self-report)

- Field "Before a bishop trade offer, I check:" (free text)

### Step 35: board

Caption: The break ...d5 in the Classical: it works with queens and kings both at home.

```
  8  r . b q . r k .
  7  p p . . p p b p
  6  . . n p . n p .
  5  . . . . . . . .
  4  . . . N P . . .
  3  . . N . B . . .
  2  P P P Q B P P P
  1  R . . . . R K .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: r1bq1rk1/pp2ppbp/2np1np1/8/3NP3/2N1B3/PPPQBPPP/R4RK1 b - - 7 9
```

The line, with the sentence the learner sees at each move:
1. **9... d5**: The central break of the toolkit: it frees Black's pieces and challenges e4.
2. **10. exd5**: White takes; the knight on f6 recaptures.
3. **10... Nxd5**: Black's knight lands in the centre.
4. **11. Nxc6**: White trades the knight that was hitting d4.
5. **11... bxc6**: Black recaptures.
6. **12. Nxd5**: White trades the other knights.
7. **12... Qxd5**: Black's queen is centralised and the d-file is open.

```
  8  r . b . . r k .
  7  p . . . p p b p
  6  . . p . . . p .
  5  . . . q . . . .
  4  . . . . . . . .
  3  . . . . B . . .
  2  P P P Q B P P P
  1  R . . . . R K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r1b2rk1/p3ppbp/2p3p1/3q4/8/4B3/PPPQBPPP/R4RK1 w - - 0 13
```

Drawn on the board: highlighted squares d5, d4.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] Re8, Bd7, Nxd4, d5 and Ng4 are each within 45 centipawns of the engine's top move (depth 16).
- [open_files] After the trades the d-file is open.

### Step 36: card

**Back to the first question.** From that opening position Black's targets are the d4 knight and the centre, through exchanges on d4 and the d5 break, and the c-file and the queenside. They are not White's king. At depth 16 the d5 break and the knight jump to g4 are both fully playable [V]. The early guess that only the h-pawn attack disappears is partly right [I]: the piece ideas carry over, and the pawn storm is off unless White castles long.

### Step 37: reflect

Kind: unsure

Prompt: Check your first answer. Which target did you pick at the start, and what in the last boards agrees or disagrees with it?

- Field "My first pick, and what changed my mind (or did not):" (free text)

## Chapter: The moves f3 and Bc4

### Step 38: card

**The move f3: the move order.** The pawn guards e4 and frees e3 for the bishop. Black's two sensible answers in our masters' data (25 games) are ...Bg7 (15 games, transposing to the Yugoslav) and ...Nc6 (8 games), which hits d4 first. White scored 40% there in only 25 games [V], so read it as a small sample. Engine edge: about 60 to 70 centipawns either way [V].

### Step 39: board

Caption: The transposition: 6.f3 first, the Yugoslav setup anyway.

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
1. **6. f3**: Guards e4 and frees e3 and the queen's diagonal: the base of the Yugoslav.
2. **6... Bg7**: Black develops the bishop; nothing forces the knight out yet.
3. **7. Be3**: The bishop aims at h6 and supports the d4 knight.
4. **7... O-O**: Black castles; kings may soon stand on opposite wings [I].
5. **8. Qd2**: The queen backs a later Bh6 trade.
6. **8... Nc6**: Black hits d4. This is the main Yugoslav Attack, reached by 6.f3 first.

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
FEN: r1bq1rk1/pp2ppbp/2np1np1/8/3NP3/2N1BP2/PPPQ2PP/R3KB1R w KQ - 5 9
```

Drawn on the board: highlighted squares f3, e3, d2.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [eval_range] The engine (depth 16) rates the starting position as clearly better for White: between +0.5 and +0.8.
- [piece_on] After f3 a white pawn stands on f3.
- [piece_on] After Be3 the bishop stands on e3.
- [piece_on] After Qd2 the queen stands on d2.

### Step 40: card

**After f3, Black cannot stop the Yugoslav setup.** The realistic choice is between waiting with the bishop move and playing the knight first; the engine rates them alike (55 to 70 centipawns for White) [V]. [H] Playing the knight first keeps the e-pawn break in reserve, but it also lets White choose between bishop development and trading; the next boards show why the trade is the wrong one.

### Step 41: item

**Task `IOD-LODDRAGON7-5`** (classify_position, difficulty cue 2)

Is this the Yugoslav Attack setup (pawn on f3, bishop on e3, queen on d2, Black's bishop on g7), however the moves arrived?

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
FEN: r1bq1rk1/pp2ppbp/2np1np1/8/3NP3/2N1BP2/PPPQ2PP/R3KB1R w KQ - 5 9
```

**Accepted answer:** {"class": "Yugoslav setup"}

**Explanation shown:** The pawn is on f3, the bishop on e3 and the queen on d2, with Black's bishop on g7: the Yugoslav setup, reached here by 6.f3 first. Move order can differ; the position is what counts.

Hints (in order):
1. Look for the pawn on f3, the bishop on e3 and the queen on d2.
2. Move order does not matter; the pieces on the board do.
3. All three White pieces are on their Yugoslav squares, so the answer is yes.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [piece_on] A white pawn stands on f3.
- [piece_on] The white bishop stands on e3.
- [piece_on] The white queen stands on d2.
- [piece_on] Black's bishop stands on g7.

### Step 42: item

**Task `IOD-LODDRAGON7-6`** (classify_position, difficulty cue 2)

Is this the Yugoslav Attack setup (pawn on f3, bishop on e3, queen on d2, Black's bishop on g7)?

```
  1  R . . K . . . R
  2  P P P B Q P P P
  3  . . . B . N . .
  4  . . . P N . . .
  5  . . . . . . . .
  6  . p n . p n . .
  7  p b p p . . p p
  8  r . . k q b . r
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: r1bqk2r/pp2ppbp/2np1np1/8/3NP3/2N1B3/PPPQBPPP/R3K2R b KQkq - 5 8
```

**Accepted answer:** {"class": "Not the Yugoslav setup"}

**Explanation shown:** The pawn is still on f2. Bishop and queen stand on their Yugoslav squares, so White can play f3 next and reach the Yugoslav setup by transposition (the engine rates f3 as the top move here [V]); as it stands the setup is not complete, and White's king has not yet chosen a side.

Hints (in order):
1. Which of the three Yugoslav marks are missing?
2. Check the f-file pawn and the bishop on e2.
3. The pawn is still on f2, so the setup is not the Yugoslav.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [piece_on] The f3 square is empty: White's f-pawn is still on f2.
- [piece_on] A white pawn stands on f2.
- [piece_on] White's bishop stands on e2.

### Step 43: board

Caption: 6.f3 Nc6: keep the knight. Be3 is the engine's choice.

```
  8  r . b q k b . r
  7  p p . . p p . p
  6  . . n p . n p .
  5  . . . . . . . .
  4  . . . N P . . .
  3  . . N . . P . .
  2  P P P . . . P P
  1  R . B Q K B . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: r1bqkb1r/pp2pp1p/2np1np1/8/3NP3/2N2P2/PPP3PP/R1BQKB1R w KQkq - 1 7
```

The line, with the sentence the learner sees at each move:
1. **7. Be3**: The bishop develops, keeping the knight on d4 and its pressure on the centre.
2. **7... Bg7**: Black's bishop comes out.
3. **8. Qd2**: The queen joins; O-O-O and g4 are the follow-up.
4. **8... O-O**: Black castles: again the main Yugoslav Attack.

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
FEN: r1bq1rk1/pp2ppbp/2np1np1/8/3NP3/2N1BP2/PPPQ2PP/R3KB1R w KQ - 5 9
```

Drawn on the board: highlighted squares d4, e3.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] Be3 is the engine's top move (depth 16).

### Step 44: board

Caption: 6.f3 Nc6 7.Nxc6?! The trade gives most of the advantage away: about -0.1 against +0.6 for the bishop move [V].

```
  8  r . b q k b . r
  7  p p . . p p . p
  6  . . n p . n p .
  5  . . . . . . . .
  4  . . . N P . . .
  3  . . N . . P . .
  2  P P P . . . P P
  1  R . B Q K B . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: r1bqkb1r/pp2pp1p/2np1np1/8/3NP3/2N2P2/PPP3PP/R1BQKB1R w KQkq - 1 7
```

The line, with the sentence the learner sees at each move:
1. **7. Nxc6**: White trades at once.
2. **7... bxc6**: Black recaptures with the b-pawn: the pawn on c6 takes d5 away, the b-file opens, and the knight that pressured the centre is gone.
3. **8. Be3**: White develops, but the early edge of the Yugoslav is gone.

```
  8  r . b q k b . r
  7  p . . . p p . p
  6  . . p p . n p .
  5  . . . . . . . .
  4  . . . . P . . .
  3  . . N . B P . .
  2  P P P . . . P P
  1  R . . Q K B . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r1bqkb1r/p3pp1p/2pp1np1/8/4P3/2N1BP2/PPP3PP/R2QKB1R b KQkq - 1 8
```

Drawn on the board: highlighted squares c6, b7.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [move_loses] Nxc6 is at least 50 centipawns worse than the best move (depth 16).
- [open_files] After the trade the b-file is half open for Black.

### Step 45: reflect

Kind: expect

Prompt: [H] A player who knows the Yugoslav can play 6.f3 setups with no new ideas. Does the 6.f3 Nc6 position support this guess, or does it show a trap for the Yugoslav player? Write what you think and why.

- Field "Supports it / shows a trap, because:" (free text)

### Step 46: card

**Verdict on the guess.** Mostly supported [I]. The familiar development move is the engine's pick, so the Yugoslav player needs no new idea. The one new risk is the urge to simplify with the trade on c6, which costs about 60 centipawns and gives Black a solid centre and the half-open b-file [V]. [H] So the Yugoslav player's job is to resist that urge.

### Step 47: board

Caption: 6.g3 Nc6: the bishop guards e4 from afar, so the f-pawn can stay home. Masters (42 games): White 14, drawn 14, Black 14, average rating 2,704 [V]. The common seventh moves: Nde2 (28 games: 2 wins, 17 draws, 9 losses), Bg2 (25), Nxc6 (11) [S: review count of our tree].

```
  8  r . b q k b . r
  7  p p . . p p . p
  6  . . n p . n p .
  5  . . . . . . . .
  4  . . . N P . . .
  3  . . N . . . P .
  2  P P P . . P . P
  1  R . B Q K B . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: r1bqkb1r/pp2pp1p/2np1np1/8/3NP3/2N3P1/PPP2P1P/R1BQKB1R w KQkq - 1 7
```

The line, with the sentence the learner sees at each move:
1. **7. Bg2**: The fianchetto completes: the bishop guards e4 and eyes the long diagonal.
2. **7... Bg7**: Black mirrors with the Dragon bishop.
3. **8. O-O**: The king goes home; no attack is planned.
4. **8... O-O**: Black's king is safe too: a quiet game for both.

```
  8  r . b q . r k .
  7  p p . . p p b p
  6  . . n p . n p .
  5  . . . . . . . .
  4  . . . N P . . .
  3  . . N . . . P .
  2  P P P . . P B P
  1  R . B Q . R K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r1bq1rk1/pp2ppbp/2np1np1/8/3NP3/2N3P1/PPP2PBP/R1BQ1RK1 w - - 5 9
```

Drawn on the board: highlighted squares g2, e4.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] Bg2, Nxc6, a4, Nde2 and h3 are each within 40 centipawns of the engine's top move (depth 16).
- [king_wing] After O-O White's king is on the kingside.
- [attackers] After Bg2 the e4 pawn is guarded twice.

### Step 48: board

Caption: The slow version: Nde2 and Bg2, with the e4 pawn guarded twice.

```
  8  r n b q k b . r
  7  p p . . p p . p
  6  . . . p . n p .
  5  . . . . . . . .
  4  . . . N P . . .
  3  . . N . . . P .
  2  P P P . . P . P
  1  R . B Q K B . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: rnbqkb1r/pp2pp1p/3p1np1/8/3NP3/2N3P1/PPP2P1P/R1BQKB1R b KQkq - 0 6
```

The line, with the sentence the learner sees at each move:
1. **6... Nc6**: As before, Black challenges d4.
2. **7. Nde2**: White keeps the knights: the e2 knight supports c3 and f4 and e4 stays guarded.
3. **7... Bg7**: Black completes the Dragon bishop.
4. **8. Bg2**: The fianchetto bishop now guards e4 as well.
5. **8... O-O**: Black castles.
6. **9. O-O**: So does White: a quiet game for both sides.

```
  8  r . b q . r k .
  7  p p . . p p b p
  6  . . n p . n p .
  5  . . . . . . . .
  4  . . . . P . . .
  3  . . N . . . P .
  2  P P P . N P B P
  1  R . B Q . R K .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r1bq1rk1/pp2ppbp/2np1np1/8/4P3/2N3P1/PPP1NPBP/R1BQ1RK1 b - - 6 9
```

Drawn on the board: highlighted squares e4, g2, e2.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [attackers] After Nde2 the e4 pawn is guarded once.
- [attackers] After Bg2 the e4 pawn is guarded twice.

### Step 49: board

Caption: A trap for the greedy: 7.Nde2 Nxe4? fails. After ...d5 the knight steps back to d2 and White has won a knight for a pawn (about +3.2 at depth 16) [V].

```
  8  r . b q k b . r
  7  p p . . p p . p
  6  . . n p . n p .
  5  . . . . . . . .
  4  . . . . P . . .
  3  . . N . . . P .
  2  P P P . N P . P
  1  R . B Q K B . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: r1bqkb1r/pp2pp1p/2np1np1/8/4P3/2N3P1/PPP1NP1P/R1BQKB1R b KQkq - 2 7
```

The line, with the sentence the learner sees at each move:
1. **7... Nxe4**: The pawn looks loose: it is attacked once and guarded once.
2. **8. Nxe4**: White recaptures.
3. **8... d5**: Black's pawn attacks the knight on e4 (only that knight: c4 is empty).
4. **9. Nd2**: The knight steps back; White is a knight for a pawn ahead.

```
  8  r . b q k b . r
  7  p p . . p p . p
  6  . . n . . . p .
  5  . . . p . . . .
  4  . . . . . . . .
  3  . . . . . . P .
  2  P P P N N P . P
  1  R . B Q K B . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r1bqkb1r/pp2pp1p/2n3p1/3p4/8/6P1/PPPNNP1P/R1BQKB1R b KQkq - 1 9
```

Drawn on the board: highlighted squares e4, d5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [move_loses] Nxe4 is at least 250 centipawns worse than the best move (depth 16).
- [pawn_attackers] After ...d5 a black pawn attacks the knight on e4.

### Step 50: item

**Task `IOD-LODDRAGON7-7`** (find_move, difficulty cue 2)

Black to move after 6.g3 Nc6 7.Nde2. Find a sound developing move.

```
  1  R . B K Q B . R
  2  P . P N . P P P
  3  . P . . . N . .
  4  . . . P . . . .
  5  . . . . . . . .
  6  . p n . p n . .
  7  p . p p . . p p
  8  r . b k q b . r
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: r1bqkb1r/pp2pp1p/2np1np1/8/4P3/2N3P1/PPP1NP1P/R1BQKB1R b KQkq - 2 7
```

**Accepted answer(s):** Bg7, Bd7

Feedback shown for wrong moves:
- Nxe4: Nxe4 loses at least 250 centipawns (depth 16): White recaptures on e4, ...d5 attacks that knight, and it steps back to d2. White is a knight for a pawn ahead.

**Explanation shown:** Bg7 and Bd7 are within 40 centipawns of the engine's best move at depth 16. Nxe4 loses at least 250 centipawns: White recaptures, ...d5 attacks the knight on e4, and the knight steps back to d2. White has won a knight for a pawn (about +3.2) [V].

Hints (in order):
1. The pawn on e4 is attacked once and guarded once.
2. What happens after Nxe4 Nxe4 d5?
3. Develop with Bg7 or Bd7.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] Bg7 and Bd7 are each within 40 centipawns of the engine's top move (depth 16).
- [move_loses] Nxe4 is at least 250 centipawns worse than the best move (depth 16).

### Step 51: board

Caption: The e4-e5 break (a pawn sacrifice) after 6.g3 Nc6 7.Nxc6 bxc6: dxe5 Qxd8+ Kxd8 and White has no pawn for it. Depth 16 calls it level (about 0.0): the king has lost castling and 10.Bg2 hits c6 and a8 [V]. Whether that is enough for a human to enjoy is [H]. It works only because f3 was never played, and it costs a pawn.

```
  8  r . b q k b . r
  7  p . . . p p . p
  6  . . p p . n p .
  5  . . . . . . . .
  4  . . . . P . . .
  3  . . N . . . P .
  2  P P P . . P . P
  1  R . B Q K B . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: r1bqkb1r/p3pp1p/2pp1np1/8/4P3/2N3P1/PPP2P1P/R1BQKB1R w KQkq - 0 8
```

The line, with the sentence the learner sees at each move:
1. **8. e5**: The pawn offer: the e-pawn can advance only because the f-pawn never moved. It hits d6 and the f6 knight.
2. **8... dxe5**: Black takes the pawn.
3. **9. Qxd8+**: White trades queens with check.
4. **9... Kxd8**: Black's king recaptures: Black is a pawn up but has lost the right to castle.
5. **10. Bg2**: The bishop hits c6 and eyes the rook on a8: the compensation.

```
  8  r . b k . b . r
  7  p . . . p p . p
  6  . . p . . n p .
  5  . . . . p . . .
  4  . . . . . . . .
  3  . . N . . . P .
  2  P P P . . P B P
  1  R . B . K . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r1bk1b1r/p3pp1p/2p2np1/4p3/8/2N3P1/PPP2PBP/R1B1K2R b KQ - 1 10
```

Drawn on the board: highlighted squares e5, d8, g2, c6.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] e5 and Bg2 are each within 40 centipawns of the engine's top move (depth 16).
- [material_after_move] After e5 dxe5 White has given up at least a pawn along the engine's line (depth 16).
- [piece_attacks] After Bg2 the bishop attacks c6.
- [king_wing] After ...Kxd8 Black's king is in the centre.

### Step 52: card

**The move Bc4.** The bishop aims at f7 and may drop back to b3, as in the Sozin Attack of the Najdorf. The difference here: Black has no ...a6 yet, so a check on b5 is always in the air, and the bishop makes Black watch f7 and d5 at once. Masters: 20 games, all by players averaging 2,864; 12 drawn, against 41% drawn after Be3 [V]. Too few games to say anything about Black holding [H].

### Step 53: board

Caption: After 6.Bc4. The line with f3 and Bb3 is one option, about +0.4 for White [V]; the next board shows another.

```
  8  r n b q k b . r
  7  p p . . p p . p
  6  . . . p . n p .
  5  . . . . . . . .
  4  . . B N P . . .
  3  . . N . . . . .
  2  P P P . . P P P
  1  R . B Q K . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: rnbqkb1r/pp2pp1p/3p1np1/8/2BNP3/2N5/PPP2PPP/R1BQK2R b KQkq - 1 6
```

The line, with the sentence the learner sees at each move:
1. **6... Bg7**: Black's bishop; the engine's choice.
2. **7. f3**: The pawn guards e4 and prepares the Yugoslav-style setup.
3. **7... Nc6**: Black hits d4.
4. **8. Be3**: White's bishop goes to its best square.
5. **8... O-O**: Black castles.
6. **9. Bb3**: The bishop steps back but stays on the same diagonal, aimed at f7.
7. **9... Nxd4**: Black trades off the d4 knight.
8. **10. Bxd4**: White recaptures with the bishop: a typical Yugoslav-like middlegame with the bishop already on b3.

```
  8  r . b q . r k .
  7  p p . . p p b p
  6  . . . p . n p .
  5  . . . . . . . .
  4  . . . B P . . .
  3  . B N . . P . .
  2  P P P . . . P P
  1  R . . Q K . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r1bq1rk1/pp2ppbp/3p1np1/8/3BP3/1BN2P2/PPP3PP/R2QK2R b KQ - 0 10
```

Drawn on the board: highlighted squares c4, f7, b3.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] Bg7 is the engine's top move (depth 16).
- [eval_range] The engine (depth 16) rates the starting position as slightly better for White: between +0.15 and +0.5.
- [piece_attacks] After Bb3 the bishop attacks f7.

### Step 54: board

Caption: The other main try after 6.Bc4 Bg7: h3 first, which stops ...Ng4 and ...Bg4 before White develops. The engine rates f3 and h3 both playable here (about +0.4 and +0.1) [V].

```
  8  r n b q k . . r
  7  p p . . p p b p
  6  . . . p . n p .
  5  . . . . . . . .
  4  . . B N P . . .
  3  . . N . . . . .
  2  P P P . . P P P
  1  R . B Q K . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: rnbqk2r/pp2ppbp/3p1np1/8/2BNP3/2N5/PPP2PPP/R1BQK2R w KQkq - 2 7
```

The line, with the sentence the learner sees at each move:
1. **7. h3**: White stops the knight and bishop jumps to g4 before they start.
2. **7... O-O**: Black castles.
3. **8. Be3**: The bishop takes its post and covers d4.
4. **8... Nc6**: Black hits d4 again: a normal Dragon position with the bishop on c4.

```
  8  r . b q . r k .
  7  p p . . p p b p
  6  . . n p . n p .
  5  . . . . . . . .
  4  . . B N P . . .
  3  . . N . B . . P
  2  P P P . . P P .
  1  R . . Q K . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r1bq1rk1/pp2ppbp/2np1np1/8/2BNP3/2N1B2P/PPP2PP1/R2QK2R w KQ - 3 9
```

Drawn on the board: highlighted squares h3, g4, c4.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] f3 and h3 are each within 40 centipawns of the engine's top move (depth 16).
- [pawn_attackers] After h3 a white pawn attacks g4.

### Step 55: board

Caption: The tempting grab ...Nxe4 and the fork it hopes for.

```
  8  r n b q k b . r
  7  p p . . p p . p
  6  . . . p . . p .
  5  . . . . . . . .
  4  . . B N n . . .
  3  . . N . . . . .
  2  P P P . . P P P
  1  R . B Q K . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: rnbqkb1r/pp2pp1p/3p2p1/8/2BNn3/2N5/PPP2PPP/R1BQK2R w KQkq - 0 7
```

The line, with the sentence the learner sees at each move:
1. **7. Nxe4**: White takes the pawn; Black hopes for a fork.
2. **7... d5**: The pawn attacks both the bishop on c4 and the knight on e4.
3. **8. Bb5+**: The bishop moves with check, so it is saved and the knight is still attacked.
4. **8... Bd7**: Black blocks the check.
5. **9. Bxd7+**: White trades off the blocking bishop with check.
6. **9... Qxd7**: Black recaptures. White is a piece ahead.

```
  8  r n . . k b . r
  7  p p . q p p . p
  6  . . . . . . p .
  5  . . . p . . . .
  4  . . . N N . . .
  3  . . . . . . . .
  2  P P P . . P P P
  1  R . B Q K . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: rn2kb1r/pp1qpp1p/6p1/3p4/3NN3/8/PPP2PPP/R1BQK2R w KQkq - 0 10
```

Drawn on the board: highlighted squares d5, c4, e4.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [material_after_move] Nxe4 wins at least a piece along the engine's line (depth 16).
- [pawn_attackers] After ...d5 a black pawn attacks the bishop on c4.
- [pawn_attackers] After ...d5 a black pawn attacks the knight on e4.

### Step 56: item

**Task `IOD-LODDRAGON7-8`** (find_move, difficulty cue 3)

Black to move after 6.Bc4. Find a sound reply.

```
  1  R . . K Q B . R
  2  P P P . . P P P
  3  . . . . . N . .
  4  . . . P N B . .
  5  . . . . . . . .
  6  . p n . p . . .
  7  p . p p . . p p
  8  r . b k q b n r
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: rnbqkb1r/pp2pp1p/3p1np1/8/2BNP3/2N5/PPP2PPP/R1BQK2R b KQkq - 1 6
```

**Accepted answer(s):** Bg7

Feedback shown for wrong moves:
- Nxe4: Nxe4 loses at least 300 centipawns (depth 16): White takes on e4 and answers ...d5 with Bb5+, keeping the extra piece.

**Explanation shown:** Bg7 is the engine's top move at depth 16. Nxe4 loses at least 300 centipawns: after Nxe4 White recaptures, and the fork ...d5 is met by Bb5+ with a piece ahead.

Hints (in order):
1. The bishop on c4 and the knight on d4 both rely on e4. Black's Dragon bishop has not moved yet.
2. A developing move on the long diagonal fits the Dragon plan.
3. Bg7.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] Bg7 is the engine's top move (depth 16).
- [move_loses] Nxe4 is at least 300 centipawns worse than the best move (depth 16).

## Chapter: Mixed tests

### Step 57: card

**Mixed tests.** From here on the positions carry no labels. For each, ask: whose king is where? Is the f-pawn on f2 or f3? Which piece is attacked and which square sees it? Then choose a plan that fits, not a move that merely looks familiar.

### Step 58: item  (shown without telling the learner the topic: unlabeled test)

**Task `IOD-LODDRAGON7-9`** (find_move, difficulty cue 3)

White to move after 6.f3 Nc6. Find a sound move.

```
  8  r . b q k b . r
  7  p p . . p p . p
  6  . . n p . n p .
  5  . . . . . . . .
  4  . . . N P . . .
  3  . . N . . P . .
  2  P P P . . . P P
  1  R . B Q K B . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: r1bqkb1r/pp2pp1p/2np1np1/8/3NP3/2N2P2/PPP3PP/R1BQKB1R w KQkq - 1 7
```

**Accepted answer(s):** Be3

Feedback shown for wrong moves:
- Nxc6: Nxc6 gives up at least 50 centipawns of White's edge (depth 16): Black recaptures bxc6, gaining the b-file and a solid centre.

**Explanation shown:** Be3 is the engine's top move at depth 16. Nxc6 bxc6 loses at least 50 centipawns of White's edge, because the trade removes the knight that makes the centre hard for Black.

Hints (in order):
1. The knight on d4 is attacked. You may keep it or trade it.
2. Which piece belongs on e3 in this setup?
3. Be3.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] Be3 is the engine's top move (depth 16).
- [move_loses] Nxc6 is at least 50 centipawns worse than the best move (depth 16).

### Step 59: item  (shown without telling the learner the topic: unlabeled test)

**Task `IOD-LODDRAGON7-10`** (find_move, difficulty cue 3)

White to move after 6.g3 Nc6. Find a sound move.

```
  8  r . b q k b . r
  7  p p . . p p . p
  6  . . n p . n p .
  5  . . . . . . . .
  4  . . . N P . . .
  3  . . N . . . P .
  2  P P P . . P . P
  1  R . B Q K B . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: r1bqkb1r/pp2pp1p/2np1np1/8/3NP3/2N3P1/PPP2P1P/R1BQKB1R w KQkq - 1 7
```

**Accepted answer(s):** Bg2, Nxc6, a4, Nde2, h3

**Explanation shown:** Bg2, Nxc6, a4, Nde2 and h3 each score within 40 centipawns of the engine's best move at depth 16: the bishop completes the fianchetto, the knight can trade or retreat, a4 gains space and h3 gives the king air and covers g4. The position has several good plans, not one.

Hints (in order):
1. The g3 pawn was played to give a bishop its diagonal; the king also needs a little air.
2. Several moves score alike: complete the setup, trade or keep the knights, gain space, or give the king air.
3. Bg2, Nxc6, a4, Nde2 or h3.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] Bg2, Nxc6, a4, Nde2 and h3 are each within 40 centipawns of the engine's top move (depth 16).
- [king_wing] White's king is still on e1, in the centre.

### Step 60: item  (shown without telling the learner the topic: unlabeled test)

**Task `IOD-LODDRAGON7-11`** (find_move, difficulty cue 3)

White to move. Find a sound move.

```
  8  r . b q . r k .
  7  p p . . p p b p
  6  . . n p . n p .
  5  . . . . . . . .
  4  . . . N P . . .
  3  . . N . B . . .
  2  P P P . B P P P
  1  R . . Q . R K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: r1bq1rk1/pp2ppbp/2np1np1/8/3NP3/2N1B3/PPP1BPPP/R2Q1RK1 w - - 6 9
```

**Accepted answer(s):** a4, Re1, Qd2, h3, Nb3, Nxc6

**Explanation shown:** a4, Re1, Qd2, h3, Nb3 and Nxc6 each score within 45 centipawns of the engine's best move at depth 16: with both kings at home, several slow improvements fit.

Hints (in order):
1. No attack on the king is planned. What improves the position slowly?
2. Space on the queenside, a rook to the e-file, or the queen to d2.
3. a4, Re1, Qd2, h3, Nb3 or Nxc6.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] a4, Re1, Qd2, h3, Nb3 and Nxc6 are each within 45 centipawns of the engine's top move (depth 16).
- [king_wing] Both kings are castled: White's is on the kingside.

### Step 61: board

Caption: A mistake: copying a Yugoslav plan when the white knight stands on b3.

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
1. **9... Qa5**: A Yugoslav habit: the queen eyes the knight on c3.
2. **10. Nxa5**: Here the knight on b3 attacks a5, and the queen is lost.
3. **10... Nxa5**: Black takes the knight back, but gave up a queen for a knight.

```
  8  r . b . . r k .
  7  p p . . p p b p
  6  . . . p . n p .
  5  n . . . . . . .
  4  . . . . P . . .
  3  . . N . B . . .
  2  P P P . B P P P
  1  R . . Q . R K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r1b2rk1/pp2ppbp/3p1np1/n7/4P3/2N1B3/PPP1BPPP/R2Q1RK1 w - - 0 11
```

Drawn on the board: highlighted squares a5, b3.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [material_after_move] Qa5 loses at least four points of material along the engine's line (depth 16).
- [piece_attacks] After ...Qa5 the white knight on b3 attacks a5.

### Step 62: board

Caption: A milder mistake: ...h5 is not a blunder but a concession.

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
1. **9... h5**: The Yugoslav-style pawn push, copied. There is no king to attack.
2. **10. h3**: White spends a quiet move; the g4 square is covered and the h5 pawn may become a target [H].

```
  8  r . b q . r k .
  7  p p . . p p b .
  6  . . n p . n p .
  5  . . . . . . . p
  4  . . . . P . . .
  3  . N N . B . . P
  2  P P P . B P P .
  1  R . . Q . R K .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r1bq1rk1/pp2ppb1/2np1np1/7p/4P3/1NN1B2P/PPP1BPP1/R2Q1RK1 b - - 0 10
```

Drawn on the board: highlighted squares h5, g4.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [move_loses] h5 is at least 30 centipawns worse than the best move (depth 16).
- [pawn_attackers] After h3 a white pawn attacks g4.

### Step 63: item  (shown without telling the learner the topic: unlabeled test)

**Task `IOD-LODDRAGON7-12`** (find_move, difficulty cue 3)

Black to move after 9.Nb3. Find a sound move.

```
  1  . K R . Q . . R
  2  P P P B . P P P
  3  . . . B . N N .
  4  . . . P . . . .
  5  . . . . . . . .
  6  . p n . p n . .
  7  p b p p . . p p
  8  . k r . q b . r
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: r1bq1rk1/pp2ppbp/2np1np1/8/4P3/1NN1B3/PPP1BPPP/R2Q1RK1 b - - 7 9
```

**Accepted answer(s):** Be6, a6, Ne5, Bd7, Rb8, b6, Re8

Feedback shown for wrong moves:
- Qa5: Qa5 loses at least 300 centipawns (depth 16): the knight on b3 attacks a5, so White simply takes the queen.
- Bg4: Bg4 loses at least 300 centipawns (depth 16): Bxg4 Nxg4 and the queen on d1 takes the knight.
- h5: h5 loses at least 30 centipawns (depth 16): a mild concession, since there is no attack on a king that is still at home.

**Explanation shown:** Be6, a6, Ne5, Bd7, Rb8, b6 and Re8 are within 40 centipawns of the engine's top move at depth 16. The Yugoslav-style ...Qa5 and ...Bg4 each lose at least 300 centipawns here, and ...h5 loses at least 30.

Hints (in order):
1. Look at what the knight on b3 attacks, and which White queen square sees g4.
2. Check what each of your pieces would attack, and what the knight on b3 sees.
3. Be6, a6 or another quiet developing move.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] Be6, a6, Ne5, Bd7, Rb8, b6 and Re8 are each within 40 centipawns of the engine's top move (depth 16).
- [move_loses] Qa5 is at least 300 centipawns worse than the best move (depth 16).
- [move_loses] Bg4 is at least 300 centipawns worse than the best move (depth 16).
- [move_loses] h5 is at least 30 centipawns worse than the best move (depth 16).

### Step 64: card

**Recap.**
- The edge shrinks as White commits less, but f3 is the Yugoslav by another route.
- Check White's king first: short castling means pieces and centre; long castling revives the storm.
- The queen's square decides a trade.
- Against f3 and ...Nc6, keep the knight.
- Without f3 the e-pawn can advance, for a pawn.
- Against the bishop on c4, a greedy capture on e4 fails to ...d5.
- Black's targets: the d4 knight, the centre, the c-file, not White's king.
**Self-check:** works, fails, example, mistake?

## Chapter: Teach it back

### Step 65: reflect

Kind: expect

Prompt: Teach it back. Imagine a friend who knows only the Yugoslav Attack. In your own words: what do 6.Be2, 6.f3, 6.g3 and 6.Bc4 each give White and take away; and what is Black's plan when White's king stays on g1? Give one position, one warning, and say when your advice would not hold.

- Field "The idea:" (free text)

- Field "When it works / when it fails:" (free text)

- Field "One position a friend could set up:" (free text)

- Field "One warning:" (free text)

### Step 66: card

**Model answer.** The quiet bishop move keeps the king flexible; the edge is about 25 centipawns and Black plays for the d5 break. The pawn move f3 commits to the Yugoslav; the edge is about 60, and White should keep the knight against ...Nc6. The pawn move g3 guards e4 from afar; the edge is about 10 and Black has the easiest game. The bishop on c4 eyes f7; the edge is about 30 and the capture on e4 fails. The advice fails if White castles long. [I]

### Step 67: reflect

Kind: unsure

Prompt: Compare your teach-back with the model answer. What did yours miss, and what would you add for a friend who plays only the Yugoslav?

- Field "What my answer missed:" (free text)

---

## Reviewer scorecard

Fill in the file `content/review/L-OD-DRAGON-7.json` (a template is below). Scale 1 to 5 for each dimension: 1 = wrong or unusable, 3 = acceptable with edits, 5 = I would put my name to it as it stands.
Revision to review: `79e9cd4f`. If the lesson text changes after your review, your sign-off no longer applies and the lesson goes back to needs-human.

| Dimension | What to judge | Score |
|---|---|---|
| chess | every statement, line and explanation is correct; near-misses are really near-misses | |
| clarity | the explanation actually explains (mechanism, conditions), in plain words | |
| prerequisites | the lesson assumes only what the learner has met | |
| tasks | each task has one defensible answer and a fair explanation | |

```json
{
  "lesson": "L-OD-DRAGON-7",
  "revision": "79e9cd4f",
  "reviewer": "<your name>",
  "reviewer_role": "strong-player",
  "date": "YYYY-MM-DD",
  "scores": {"chess": 0, "clarity": 0, "prerequisites": 0, "tasks": 0},
  "comments": "<what to change, by step number>",
  "verdict": "approved"
}
```

`reviewer_role` is `strong-player` or `teacher`. `verdict` is `approved` or `changes-requested`. See docs/review-slice.md.
