# Review packet: L-OD-DRAGON-8

**Model games, and what to do when it goes wrong**

- Skill: OPN.STRUCT (D2); stage: exemplar; stated length: 45 minutes
- Steps: 76 (25 are tasks); revision: `85bb5853`
- Review status now: needs-human

## What the lesson says the learner will be able to do

- Predicts the next move at twelve decision points in three real Dragon games and names the turning point of each, with the engine's evaluation before and after
- Explains in a sentence per phase what each side is doing in a Yugoslav race and in a quiet Classical game
- Names three typical Black slips (a delayed rook, ...d5 mistimed, a capture that opens the g-file) and plays the repair in each
- Names three typical White slips (the slow rook move, Bh6 without support, the queen on e2) and finds the repair in each
- Reads game counts from our data and says what they do and do not show

## Sources the author names (check that they are used fairly, in our own words)

- library/data/games (TWIC weekly zips and Lichess broadcast PGN, 2012 to 2026): games filtered by script for 1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 g6, both players 2500+, engines excluded by hand; three games chosen, their moves and results checked by python-chess [V]. Game 1: Iordachescu - Mchedlishvili, Turkish league, Konya, 14 July 2012, 1-0. Game 2: Durarbayli - Mchedlishvili, Konya, 18 July 2012, 0-1. Game 3: Smirin - Grandelius, European Individual Championship, Jerusalem, 27 Feb 2015, 1-0. Moves and results are facts; every comment is our own wording
- app/public/masters/stats.json: 329,379 top-level games (both players 2500+), first 24 plies; counts after 8...Nc6 (9.Bc4 139 games 60/62/17; 9.O-O-O 217 games 69/102/46; 9.g4 41 games 21/15/5) and after 9.O-O-O, 9.Bc4 Bd7 10.O-O-O (83 games), Rc8 (58 games 17/35/6) [V]; the data include engine games from broadcasts [V: seen in the source PGN]
- docs/citable-views.md 5.1 (Emanuel Lasker, Common Sense in Chess, Lecture 9), 5.4 and 6.4 (Znosko-Borovsky, The Middle Game in Chess): diagnose before defending; when worse, defend and restore freedom [V-sheet]; 11.1 (Capablanca left variations to the reader) [V-sheet]
- content/items/lesson-od-l-od-dragon-8.json: positions replayed with python-chess from the stated moves; engine claims Stockfish 19 lite, depth 16 (evidence under recorded limits, not proof); one-feature edit marked in the item (position 19)
- Purposes of moves on game boards are the usual textbook ideas [R] and are stated as aims, not verified outcomes; conjecture is labelled [H] or [I] in the text
- docs/lesson-depth-standard.md section 6 (opening series, lesson 7/8: model games and repairs); docs/competition-chess-steps.md

## How to read this packet

Boards are drawn with capitals for White and lower case for Black, rank 8 at the top unless the board is shown from Black's side. Moves in a line are in standard notation. Statements marked [V] were machine-checked, [I] inference, [H] hypothesis, [S] secondary source, [R] recalled. Please judge the explanations, not only the moves: does each sentence tell the learner why?

---

## Chapter: How games are decided

### Step 1: board

Caption: Final position of game 2 in this lesson (Durarbayli - Mchedlishvili, Konya, July 2012, a Turkish league match between two players rated above 2,500). White to move has a rook for a bishop, yet the game is lost. Why? Look at the black queen on f2, the pawn on g3 and the white king. How do you think this game was decided?

```
  8  . . . . . . k .
  7  . p . . . p . .
  6  p . . . . . p .
  5  . . . . . . P .
  4  . . . b . P . .
  3  P . . . . . p .
  2  P . Q . . q . .
  1  . K . R . . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 6k1/1p3p2/p5p1/6P1/3b1P2/P5p1/P1Q2q2/1K1R4 w - - 0 33
```

Drawn on the board: highlighted squares f2, g3, d4, b1.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [eval_range] The engine (depth 16) rates the final position as clearly better for Black.
- [piece_on] Black's bishop stands on d4.
- [piece_on] White's rook stands on d1.
- [piece_on] Black's queen stands on f2.
- [piece_on] Black's pawn stands on g3.

### Step 2: reflect

Kind: expect

Prompt: Before any moves: how do you think this game was decided? Pick the most likely story. We return to your guess at the end of the lesson.

- Field "My guess:" with options: A quick attack on the king decided it / A sacrifice on the open file decided it / A blunder in a quiet position decided it / A long endgame grind decided it / No idea yet; no single correct answer (a guess or a self-report)

### Step 3: card

**The question.** What decided real Dragon games, and how do you repair the typical worse positions? You will step through three games between players rated above 2,500, predict decision points, and name each turning point. Then you meet the usual mistakes of both sides and look for the repair. At the end you will teach it back: what decided each game, one typical mistake per side, and its repair. Capablanca left variations in his own book for the reader to work out; do the same: predict before you press.

## Chapter: Game 1: a race

### Step 4: board

Caption: GAME 1: Iordachescu - Mchedlishvili (Konya, 14 July 2012; ratings 2636 and 2656; White won). The first 17 plies are the Yugoslav set-up of the earlier lessons; we start after 9.Bc4. Purposes are the usual textbook ideas [R]; engine claims are [V] at depth 16.

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
1. **9... Bd7**: Black develops the bishop and frees the back rank, so a rook can reach the c-file.
2. **10. O-O-O**: White castles long: the kings are on opposite wings, so each side can throw pawns at the other king.
3. **10... Rc8**: The rook takes the half-open c-file and eyes the knight on c3, Black's first target.
4. **11. Bb3**: The bishop steps back from c4, where a black knight would hit it, and keeps the diagonal to f7.
5. **11... Ne5**: The knight heads for c4 to trade the bishop and watches f3 and g4.
6. **12. Kb1**: The king leaves the c-file, so tricks along it lose their sting, and the h-pawn is free to advance.
7. **12... a6**: Black prepares ...b5, the pawn lever that opens lines toward the white king.

```
  8  . . r q . r k .
  7  . p . b p p b p
  6  p . . p . n p .
  5  . . . . n . . .
  4  . . . N P . . .
  3  . B N . B P . .
  2  P P P Q . . P P
  1  . K . R . . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 2rq1rk1/1p1bppbp/p2p1np1/4n3/3NP3/1BN1BP2/PPPQ2PP/1K1R3R w - - 0 13
```

Drawn on the board: arrows c8-c3, e5-c4; highlighted squares c8, c3, b1, e5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [king_wing] After castling long White's king is on the queenside.
- [open_files] The c-file is half open for Black.
- [piece_attacks] The knight on e5 attacks c4, d3, f3 and g4.
- [piece_on] After Kb1 the white king stands on b1.

### Step 5: card

**One plan per side.** White: push the h-pawn and the g-pawn at the black king, then use the half-open h- or g-file for the rooks. Black: pressure the c3 knight and the c-file, then break with ...b5 toward the white king. Both plans are pawn races. [H] A guess to test: the side that is one move faster in the race wins more often. The next board counts a real race move by move, and the three games test the guess; three games prove nothing.

### Step 6: item

**Task `IOD-LODDRAGON8-1`** (find_move, difficulty cue 2)

Black to move. The kings are on opposite wings. Choose a move.

```
  1  R . . . R . K .
  2  . P . . Q P P P
  3  . . P B . N B .
  4  P . . P N . . .
  5  . . . n . . . .
  6  . p n . p . . p
  7  p b p p b . p .
  8  . k r . q r . .
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: 2rq1rk1/1p1bppbp/p2p1np1/4n3/3NP2P/1BN1BP2/PPPQ2P1/1K1R3R b - - 0 13
```

**Accepted answer(s):** h5

Feedback shown for wrong moves:
- Nc4: It trades the knight early, but White answers by advancing the h-pawn and the engine rates it clearly worse for Black.

**Explanation shown:** The pawn blocks White's h-pawn and prepares to open the h-file toward the white king. The immediate knight trade on c4 is worse by at least 30 centipawns at depth 16.

Hints (in order):
1. Look at the h-pawn on White's side: White wants to open the h-file against your king.
2. A pawn move on your own h-file stops that plan and prepares to open lines toward the white king.
3. A pawn goes to h5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] The engine (depth 16) prefers ...h5 and.
- [move_loses] The natural-looking ...Nc4 is worse by at least 30 centipawns.

### Step 7: board

Caption: Same game, moves 13 and 14. Count the tempi: White needs g4 and a capture; Black needs ...b4 and a break on the c-file.

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
1. **13... h5**: Black blocks the h-pawn and prepares to open lines against the king.
2. **14. Rdg1**: White places the rook on the g-file, ready to push the g-pawn and open it.
3. **14... b5**: Black counters on the queenside: the b-pawn starts the race toward White's king.

```
  8  . . r q . r k .
  7  . . . b p p b .
  6  p . . p . n p .
  5  . p . . n . . p
  4  . . . N P . . P
  3  . B N . B P . .
  2  P P P Q . . P .
  1  . K . . . . R R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 2rq1rk1/3bppb1/p2p1np1/1p2n2p/3NP2P/1BN1BP2/PPPQ2P1/1K4RR w - - 0 15
```

Drawn on the board: arrows g1-g4; highlighted squares g1, g4, b5, h5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [piece_on] The white rook stands on g1.
- [piece_on] Black's pawn stands on b5.

### Step 8: item

**Task `IOD-LODDRAGON8-2`** (find_move, difficulty cue 2)

White to move. The rook stands on g1. Choose a move.

```
  8  . . r q . r k .
  7  . . . b p p b .
  6  p . . p . n p .
  5  . p . . n . . p
  4  . . . N P . . P
  3  . B N . B P . .
  2  P P P Q . . P .
  1  . K . . . . R R
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 2rq1rk1/3bppb1/p2p1np1/1p2n2p/3NP2P/1BN1BP2/PPPQ2P1/1K4RR w - - 0 15
```

**Accepted answer(s):** g4

Feedback shown for wrong moves:
- Nd5: The jump looks active, but Black can simply take the knight and the king race slows down; the engine rates it clearly worse for White.

**Explanation shown:** The pawn attacks h5 and prepares to open the g-file for the rook. A knight jump to d5 instead is worse by at least 60 centipawns at depth 16.

Hints (in order):
1. Which file did White just put a rook on?
2. A pawn from that file can offer itself to the h5 pawn and open the file.
3. A pawn goes to g4.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] The engine (depth 16) prefers g4.
- [move_loses] Nd5 (the knight jump) is worse by at least 60 centipawns.

### Step 9: item

**Task `IOD-LODDRAGON8-3`** (find_move, difficulty cue 2)

Black to move. Choose a move.

```
  1  R R . . . . K .
  2  . . . . Q P P P
  3  . . P B . N B .
  4  P P . P N . . .
  5  p . . n . . p .
  6  . p n . p . . p
  7  . b p p b . . .
  8  . k r . q r . .
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: 2rq1rk1/3bppb1/p2p1np1/1p2n2p/3NP1PP/1BN1BP2/PPPQ4/1K4RR b - - 0 15
```

**Accepted answer(s):** b4

Feedback shown for wrong moves:
- hxg4: The capture gives White the h- and g-files for free: the rook on g1 and the pawn on h4 are suddenly pointing at the king.
- a5: This is the move played in the game. It is slower than ...b4 because it does not attack anything, so White gains a tempo for the g-file.

**Explanation shown:** ...b4 attacks the knight on c3 and gains a tempo for the race. The pawn move ...a5 (played in the game) is a little worse, and taking on g4 loses at least 60: it opens the g- and h-files for White's rooks. Other moves such as ...e6 may be close in value.

Hints (in order):
1. Count tempi: whoever opens lines first against the king wins the race.
2. If Black takes the pawn, which of White's pieces gets an open file toward the king?
3. A queenside pawn move that attacks a knight.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] The engine (depth 16) prefers ...b4.
- [move_loses] The game move ...a5 is worse than ...b4 by at least 20 centipawns.
- [move_loses] Taking on g4 is worse than the best move by at least 60 centipawns.

### Step 10: board

Caption: WORKED TEMPO COUNT. White needs two moves to open the g-file for the rook on g1: the g-pawn advances, then takes on h5. Black needs two moves to start hitting the king: the b-pawn attacks the knight, then the a-pawn heads for a4. White moves first, so White arrives first by one tempo. [H] The engine agrees only modestly: about +0.6 for White here. One position proves nothing.

```
  8  . . r q . r k .
  7  . . . b p p b .
  6  p . . p . n p .
  5  . p . . n . . p
  4  . . . N P . . P
  3  . B N . B P . .
  2  P P P Q . . P .
  1  . K . . . . R R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 2rq1rk1/3bppb1/p2p1np1/1p2n2p/3NP2P/1BN1BP2/PPPQ2P1/1K4RR w - - 0 15
```

The line, with the sentence the learner sees at each move:
1. **15. g4**: White move 1: the pawn attacks h5.
2. **15... b4**: Black move 1: the pawn attacks the knight on c3.
3. **16. Nce2**: The knight steps away and heads for the kingside.
4. **16... a5**: Black move 2: the a-pawn heads for a4.
5. **17. gxh5**: White move 2: the g-file is open. White opened it first.
6. **17... Nxh5**: Black recaptures; the race now turns on who strikes next.

```
  8  . . r q . r k .
  7  . . . b p p b .
  6  . . . p . . p .
  5  p . . . n . . n
  4  . p . N P . . P
  3  . B . . B P . .
  2  P P P Q N . . .
  1  . K . . . . R R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 2rq1rk1/3bppb1/3p2p1/p3n2n/1p1NP2P/1B2BP2/PPPQN3/1K4RR w - - 0 18
```

Drawn on the board: arrows g2-g4, b5-b4; highlighted squares g1, g4, b4, h5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] The engine (depth 16) prefers g4 at this point.
- [piece_on] The white rook stands on g1.
- [piece_on] After the six moves a black knight stands on h5.

### Step 11: board

Caption: Moves 15 and 16. The g-file has opened, and White's rook now stares at the g6 pawn.

```
  8  . . r q . r k .
  7  . . . b p p b .
  6  p . . p . n p .
  5  . p . . n . . p
  4  . . . N P . P P
  3  . B N . B P . .
  2  P P P Q . . . .
  1  . K . . . . R R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: 2rq1rk1/3bppb1/p2p1np1/1p2n2p/3NP1PP/1BN1BP2/PPPQ4/1K4RR b - - 0 15
```

The line, with the sentence the learner sees at each move:
1. **15... a5**: Black keeps the race going: the pawn heads for a4, though it is not yet a threat.
2. **16. gxh5**: White takes: the g-pawn has traded itself for the h-pawn, so the g-file is open to the white rook.
3. **16... Nxh5**: Black recaptures with the knight, which now stands far from the c-file.

```
  8  . . r q . r k .
  7  . . . b p p b .
  6  . . . p . . p .
  5  p p . . n . . n
  4  . . . N P . . P
  3  . B N . B P . .
  2  P P P Q . . . .
  1  . K . . . . R R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 2rq1rk1/3bppb1/3p2p1/pp2n2n/3NP2P/1BN1BP2/PPPQ4/1K4RR w - - 0 17
```

Drawn on the board: arrows g1-g6; highlighted squares g1, g6, h5, a5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [attackers] The white rook on g1 attacks g6 along the open g-file.
- [piece_on] Black's knight stands on h5.

### Step 12: item

**Task `IOD-LODDRAGON8-4`** (find_move, difficulty cue 2)

White to move. Choose a move.

```
  8  . . r q . r k .
  7  . . . b p p b .
  6  . . . p . . p .
  5  p p . . n . . n
  4  . . . N P . . P
  3  . B N . B P . .
  2  P P P Q . . . .
  1  . K . . . . R R
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 2rq1rk1/3bppb1/3p2p1/pp2n2n/3NP2P/1BN1BP2/PPPQ4/1K4RR w - - 0 17
```

**Accepted answer(s):** f4

Feedback shown for wrong moves:
- Bh6: The trade removes White's own attacker; the engine rates it clearly worse than the pawn advance.

**Explanation shown:** The pawn attacks the knight on e5 and opens the f-file and the e3-h6 diagonal. The bishop jump to h6 first is worse by at least 60 centipawns.

Hints (in order):
1. The knight on e5 has no pawn support; which pawn could hit it?
2. A pawn can attack the knight and open lines for the bishop and rooks at once.
3. The f-pawn advances to f4.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] The engine (depth 16) prefers f4.
- [move_loses] Bh6 is worse than the best move by at least 60 centipawns.

### Step 13: board

Caption: Moves 17 to 20. Both attacks are rolling: count each side's next two moves before you read the answer.

```
  8  . . r q . r k .
  7  . . . b p p b .
  6  . . . p . . p .
  5  p p . . n . . n
  4  . . . N P . . P
  3  . B N . B P . .
  2  P P P Q . . . .
  1  . K . . . . R R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 2rq1rk1/3bppb1/3p2p1/pp2n2n/3NP2P/1BN1BP2/PPPQ4/1K4RR w - - 0 17
```

The line, with the sentence the learner sees at each move:
1. **17. f4**: The pawn attacks the knight and prepares to open the f-file.
2. **17... a4**: Black's pawn attacks the bishop on b3: a tempo, before Black deals with the knight.
3. **18. Bd5**: The bishop leaves the attacked square with a threat on f7.
4. **18... b4**: The pawn attacks the knight on c3.
5. **19. Nce2**: The knight steps aside and heads for the kingside.
6. **19... e6**: Black attacks the bishop, trying to win a tempo back.
7. **20. fxe5**: White takes the knight and opens the f-file.
8. **20... dxe5**: Black recaptures and opens the d-file against the white queen.

```
  8  . . r q . r k .
  7  . . . b . p b .
  6  . . . . p . p .
  5  . . . B p . . n
  4  p p . N P . . P
  3  . . . . B . . .
  2  P P P Q N . . .
  1  . K . . . . R R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 2rq1rk1/3b1pb1/4p1p1/3Bp2n/pp1NP2P/4B3/PPPQN3/1K4RR w - - 0 21
```

Drawn on the board: arrows d5-e6; highlighted squares e5, d5, e6, g6.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [piece_on] After the exchange on e5 a black pawn stands on e5.
- [piece_on] White's knight stands on e2.

### Step 14: item

**Task `IOD-LODDRAGON8-5`** (find_move, difficulty cue 3)

Black to move. Choose a move.

```
  1  R R . . . . K .
  2  . . . N Q P P P
  3  . . . B . . . .
  4  P . . P . . p p
  5  n . N p B . . .
  6  . p . p . . . .
  7  . b p . b . . .
  8  . k r . q r . .
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: 2rq1rk1/3b1pb1/4p1p1/3BpN1n/pp2P2P/4B3/PPPQN3/1K4RR b - - 1 21
```

**Accepted answer(s):** gxf5

Feedback shown for wrong moves:
- exd5: The bishop falls but the knight on f5 then jumps to g7 with a decisive attack; the engine rates it far better for White.

**Explanation shown:** Taking the knight removes the piece that sets up the combination on g7 and keeps the position level. Taking the bishop loses at least 100 centipawns at depth 16.

Hints (in order):
1. Which of Black's pieces is attacked by the knight, and which pieces can capture on f5 or d5?
2. One capture removes the attacker that powers White's attack on the king.
3. A pawn takes the knight on f5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] The engine (depth 16) prefers ...gxf5.
- [move_loses] Taking the bishop with ...exd5 is worse by at least 100 centipawns.

### Step 15: board

Caption: The combination in the game: captures on g7, f8 and d5. Count the material before and after.

```
  8  . . r q . r k .
  7  . . . b . p b .
  6  . . . . p . p .
  5  . . . B p . . n
  4  p p . N P . . P
  3  . . . . B . . .
  2  P P P Q N . . .
  1  . K . . . . R R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 2rq1rk1/3b1pb1/4p1p1/3Bp2n/pp1NP2P/4B3/PPPQN3/1K4RR w - - 0 21
```

The line, with the sentence the learner sees at each move:
1. **21. Nf5**: White offers the knight; the bishop on d5 is attacked as well, so Black must choose.
2. **21... exd5**: Black takes the bishop. This is the game move; the engine prefers ...gxf5 (see the item before).
3. **22. Nxg7**: The knight takes the bishop on g7 and breaks the king's cover.
4. **22... Kxg7**: The king recaptures.
5. **23. Bh6+**: The bishop checks and drives the king to the h-file.
6. **23... Kh7**: The king steps to h7.
7. **24. Bxf8**: The bishop takes the rook.
8. **24... Qxf8**: Black recaptures.
9. **25. Qxd5**: White wins a pawn and Black's king has lost its cover. [I]

```
  8  . . r . . q . .
  7  . . . b . p . k
  6  . . . . . . p .
  5  . . . Q p . . n
  4  p p . . P . . P
  3  . . . . . . . .
  2  P P P . N . . .
  1  . K . . . . R R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 2r2q2/3b1p1k/6p1/3Qp2n/pp2P2P/8/PPP1N3/1K4RR b - - 0 25
```

Drawn on the board: highlighted squares g7, f8, d5, h7.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [piece_on] After the sequence White's queen stands on d5.
- [king_wing] Black's king is on the kingside after Kh7.

### Step 16: board

Caption: REWIND ONE MOVE. Before the knight jump to f5 White stood better: the engine's first choice is the exchange sacrifice on g6 (about +1.1), and the game move leaves the position near level (about +0.1). So White's jump threw away half a pawn or more, and Black's capture on d5 then gave it back.

```
  8  . . r q . r k .
  7  . . . b . p b .
  6  . . . . p . p .
  5  . . . B p . . n
  4  p p . N P . . P
  3  . . . . B . . .
  2  P P P Q N . . .
  1  . K . . . . R R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 2rq1rk1/3b1pb1/4p1p1/3Bp2n/pp1NP2P/4B3/PPPQN3/1K4RR w - - 0 21
```

The line, with the sentence the learner sees at each move:
1. **21. Rxg6**: The rook takes the pawn. This is the engine's first choice [V].
2. **21... fxg6**: Black takes the rook: the exchange is given for a pawn and open lines.

```
  8  . . r q . r k .
  7  . . . b . . b .
  6  . . . . p . p .
  5  . . . B p . . n
  4  p p . N P . . P
  3  . . . . B . . .
  2  P P P Q N . . .
  1  . K . . . . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 2rq1rk1/3b2b1/4p1p1/3Bp2n/pp1NP2P/4B3/PPPQN3/1K5R w - - 0 22
```

Drawn on the board: arrows g1-g6; highlighted squares g1, g6, f5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] The engine (depth 16) prefers Rxg6 here.
- [move_loses] The game move Nf5 is worse than Rxg6 by at least 30 centipawns.

### Step 17: item

**Task `IOD-LODDRAGON8-24`** (find_move, difficulty cue 3)

White to move. Choose a move.

```
  8  . . r q . r k .
  7  . . . b . p b .
  6  . . . . p . p .
  5  . . . B p . . n
  4  p p . N P . . P
  3  . . . . B . . .
  2  P P P Q N . . .
  1  . K . . . . R R
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 2rq1rk1/3b1pb1/4p1p1/3Bp2n/pp1NP2P/4B3/PPPQN3/1K4RR w - - 0 21
```

**Accepted answer(s):** Rxg6

Feedback shown for wrong moves:
- Nf5: The jump looks attractive but lets Black take the knight, and the extra pawn disappears.

**Explanation shown:** The exchange sacrifice on g6 is the engine's first choice at depth 16, about +1.1 for White. The game move Nf5 leaves the position near level; the loss is half a pawn or more, and the numbers move between runs.

Hints (in order):
1. The g-file is open and the g6 pawn is the only cover.
2. A rook for pawns: what lines does it open?
3. The rook captures on g6.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] The engine (depth 16) prefers Rxg6.
- [move_loses] The game move Nf5 is worse by at least 30 centipawns.

### Step 18: board

Caption: TURNING POINT of game 1: the position after 21.Nf5, Black to move. The engine reads about 0.0, so White's edge is largely gone. The game move, taking on d5, hands White more than a pawn again.

```
  8  . . r q . r k .
  7  . . . b . p b .
  6  . . . . p . p .
  5  . . . B p N . n
  4  p p . . P . . P
  3  . . . . B . . .
  2  P P P Q N . . .
  1  . K . . . . R R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: 2rq1rk1/3b1pb1/4p1p1/3BpN1n/pp2P2P/4B3/PPPQN3/1K4RR b - - 1 21
```

Drawn on the board: highlighted squares f5, d5, g6, e6.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [eval_range] Turning point of game 1: after Nf5 the engine (depth 16) rates the position between -0.4 and +0.4.

### Step 19: card

**What decided game 1.** Two moves. White's jump to f5 threw away a lead of half a pawn or more, and Black's capture of the bishop on d5 gave it back: afterwards White is better by more than a pawn [V, depth 16]. Baseline: these Yugoslav positions score about +0.5 to +0.9 for White before the swings, so 'level' is already a drop for White [V]. [I] The tactic worked because the g-file was open and the g6 cover was gone.

## Chapter: Game 2: the same position, another road

### Step 20: board

Caption: Game 1 and game 2 reach this very position after 13...h5. White to move: the rook to g1 (game 1) or the bishop to g5 (game 2). Depth 16 ranks Bh6 first, then g4 and Rdg1 within 25 centipawns; Bg5 is 15 to 50 behind. All are playable, so the two games split at a near-equal choice.

```
  8  . . r q . r k .
  7  . p . b p p b .
  6  p . . p . n p .
  5  . . . . n . . p
  4  . . . N P . . P
  3  . B N . B P . .
  2  P P P Q . . P .
  1  . K . R . . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 2rq1rk1/1p1bppb1/p2p1np1/4n2p/3NP2P/1BN1BP2/PPPQ2P1/1K1R3R w - - 0 14
```

Drawn on the board: arrows d1-g1, e3-g5; highlighted squares g1, g5, e3.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] The engine (depth 16) puts Bh6, g4 and Rdg1 within 40 centipawns of one another; Bh6 comes first.
- [king_wing] White's king is on the queenside.
- [king_wing] Black's king is on the kingside.
- [move_loses] The game-2 move Bg5 is at least 10 centipawns behind the best move.

### Step 21: card

**Game 2: the same position, another road.** Black's 13th move leaves White a choice. The engine's first choices are Bh6 and Rdg1; neither game played Bh6. In game 1 the rook went to g1; in game 2 the bishop went to g5 to threaten the f6 knight, a playable move a little behind. That difference did not decide anything yet: look at what each side did when the attack met resistance.

### Step 22: board

Caption: GAME 2: Durarbayli - Mchedlishvili (Konya, 18 July 2012; ratings 2576 and 2656; Black won). The same Black player as in game 1 (Mchedlishvili), four days later and with the opposite result. Purposes are the usual textbook ideas [R]; engine claims are [V] at depth 16.

```
  8  . . r q . r k .
  7  . p . b p p b .
  6  p . . p . n p .
  5  . . . . n . . p
  4  . . . N P . . P
  3  . B N . B P . .
  2  P P P Q . . P .
  1  . K . R . . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 2rq1rk1/1p1bppb1/p2p1np1/4n2p/3NP2P/1BN1BP2/PPPQ2P1/1K1R3R w - - 0 14
```

The line, with the sentence the learner sees at each move:
1. **14. Bg5**: White threatens to trade the bishop for the f6 knight, the main defender of the king.
2. **14... Re8**: The rook leaves f8 to guard e7 against the capture on f6 and keeps the e-file ready.
3. **15. g4**: White opens the g-file: the pawn attacks h5, and the rook on h1 eyes the h-file behind the h4 pawn.
4. **15... hxg4**: Black captures: the h-file is open, but now the h4 pawn can advance with tempo.
5. **16. f4**: The pawn attacks the knight on e5 and leaves the pawn on g4 alone for now.

```
  8  . . r q r . k .
  7  . p . b p p b .
  6  p . . p . n p .
  5  . . . . n . B .
  4  . . . N P P p P
  3  . B N . . . . .
  2  P P P Q . . . .
  1  . K . R . . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 2rqr1k1/1p1bppb1/p2p1np1/4n1B1/3NPPpP/1BN5/PPPQ4/1K1R3R b - - 0 16
```

Drawn on the board: arrows g5-f6, f4-e5; highlighted squares g5, f6, e5, f4.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [attackers] The bishop on g5 attacks the knight on f6.
- [piece_on] After f4 White's pawn stands on f4.
- [attackers] The pawn on f4 attacks the knight on e5.

### Step 23: item

**Task `IOD-LODDRAGON8-6`** (find_move, difficulty cue 2)

Black to move. The knight on e5 is attacked. Choose a move.

```
  1  R . . . R . K .
  2  . . . . Q P P P
  3  . . . . . N B .
  4  P p P P N . . .
  5  . B . n . . . .
  6  . p n . p . . p
  7  . b p p b . p .
  8  . k . r q r . .
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: 2rqr1k1/1p1bppb1/p2p1np1/4n1B1/3NPPpP/1BN5/PPPQ4/1K1R3R b - - 0 16
```

**Accepted answer(s):** Nc4

Feedback shown for wrong moves:
- Nc6: The knight retreats, but White then continues with the h-pawn and the engine rates the position clearly better for White.

**Explanation shown:** On c4 the knight attacks the queen on d2 and the b2 pawn, and offers a trade of the bishop. Retreating to c6 gives up the initiative and is worse by at least 60 centipawns at depth 16.

Hints (in order):
1. The knight must move. Which squares attack the white queen or the b2 pawn?
2. One square also hits the queen and trades off the bishop that eyes f7.
3. The knight goes to c4.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] The engine (depth 16) prefers ...Nc4.
- [move_loses] Retreating with ...Nc6 is worse by at least 60 centipawns.
- [attackers] From c4 the knight attacks the queen on d2.

### Step 24: board

Caption: Moves 16 and 17. Look at the diagonal a3-f8 and the knight on c4: what does the move after this do to White's king?

```
  8  . . r q r . k .
  7  . p . b p p b .
  6  p . . p . n p .
  5  . . . . n . B .
  4  . . . N P P p P
  3  . B N . . . . .
  2  P P P Q . . . .
  1  . K . R . . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: 2rqr1k1/1p1bppb1/p2p1np1/4n1B1/3NPPpP/1BN5/PPPQ4/1K1R3R b - - 0 16
```

The line, with the sentence the learner sees at each move:
1. **16... Nc4**: The knight attacks the queen and the b2 pawn at once, and offers to trade the bishop.
2. **17. Qe2**: The queen steps aside to e2. The engine prefers Qd3 here, which keeps the queen on the d-file.

```
  8  . . r q r . k .
  7  . p . b p p b .
  6  p . . p . n p .
  5  . . . . . . B .
  4  . . n N P P p P
  3  . B N . . . . .
  2  P P P . Q . . .
  1  . K . R . . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 2rqr1k1/1p1bppb1/p2p1np1/6B1/2nNPPpP/1BN5/PPP1Q3/1K1R3R b - - 2 17
```

Drawn on the board: arrows c4-d2, c4-a3; highlighted squares c4, d2, b2, a3.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [attackers] After Nc4 the black knight attacks the queen on d2.
- [attackers] After Qe2 the black knight attacks a3, b2 and b6.

### Step 25: item

**Task `IOD-LODDRAGON8-7`** (find_move, difficulty cue 3)

Black to move. The white king stands on b1 behind the b2 pawn. Choose a move.

```
  1  R . . . R . K .
  2  . . . Q . P P P
  3  . . . . . N B .
  4  P p P P N n . .
  5  . B . . . . . .
  6  . p n . p . . p
  7  . b p p b . p .
  8  . k . r q r . .
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: 2rqr1k1/1p1bppb1/p2p1np1/6B1/2nNPPpP/1BN5/PPP1Q3/1K1R3R b - - 2 17
```

**Accepted answer(s):** Na3+

Feedback shown for wrong moves:
- Nxb2: The knight takes a pawn, but the king simply recaptures; Black has given a piece for a pawn and the engine rates White much better.

**Explanation shown:** The knight gives check on a3. If the b-pawn takes it, the cover on b2 is gone and the c3 knight loses its pawn support. This works because the king is on b1 with only one pawn in front of it.

Hints (in order):
1. The king is on b1. Which squares give a knight check on b1?
2. The check is a sacrifice: what does the b2 pawn have to do?
3. The knight goes to a3 with check.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] The engine (depth 16) prefers ...Na3+.
- [attackers] From a3 the black knight attacks the white king on b1.

### Step 26: board

Caption: Move 17. Count the material: Black has given a knight for nothing so far. What is the second half of the combination?

```
  8  . . r q r . k .
  7  . p . b p p b .
  6  p . . p . n p .
  5  . . . . . . B .
  4  . . n N P P p P
  3  . B N . . . . .
  2  P P P . Q . . .
  1  . K . R . . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: 2rqr1k1/1p1bppb1/p2p1np1/6B1/2nNPPpP/1BN5/PPP1Q3/1K1R3R b - - 2 17
```

The line, with the sentence the learner sees at each move:
1. **17... Na3+**: The knight sacrifices itself with check: the b2 pawn must capture or the king moves.
2. **18. bxa3**: White takes: the pawn leaves b2 and the knight on c3 is no longer protected by it.

```
  8  . . r q r . k .
  7  . p . b p p b .
  6  p . . p . n p .
  5  . . . . . . B .
  4  . . . N P P p P
  3  P B N . . . . .
  2  P . P . Q . . .
  1  . K . R . . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 2rqr1k1/1p1bppb1/p2p1np1/6B1/3NPPpP/PBN5/P1P1Q3/1K1R3R b - - 0 18
```

Drawn on the board: arrows c8-c3; highlighted squares a3, b1, c3, b2.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [attackers] After bxa3 the white knight on c3 is attacked by the black rook on c8.
- [pawn_attackers] No white pawn defends the knight on c3.
- [piece_on] The b2 square is empty after bxa3.

### Step 27: item

**Task `IOD-LODDRAGON8-8`** (find_move, difficulty cue 3)

Black to move, a knight down. Choose a move.

```
  1  R . . . R . K .
  2  . . . Q . P . P
  3  . . . . . N B P
  4  P p P P N . . .
  5  . B . . . . . .
  6  . p n . p . . p
  7  . b p p b . p .
  8  . k . r q r . .
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: 2rqr1k1/1p1bppb1/p2p1np1/6B1/3NPPpP/PBN5/P1P1Q3/1K1R3R b - - 0 18
```

**Accepted answer(s):** Rxc3

Feedback shown for wrong moves:
- Qa5: The queen move loses the moment: White consolidates and Black has just given up a knight for a pawn.

**Explanation shown:** The rook wins back the knight and attacks the bishop on b3 with tempo, so the sacrifice is repaid at once. A quiet move such as ...Qa5 is worse by at least 100 centipawns.

Hints (in order):
1. Which White piece is attacked by the c8 rook and not defended by a pawn?
2. The capture also attacks the bishop on b3 with the rook.
3. The rook captures on c3.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] The engine (depth 16) prefers ...Rxc3.
- [move_loses] The quiet ...Qa5 is worse by at least 100 centipawns.

### Step 28: board

Caption: Moves 18 to 20. Black has a rook on c3 with check threats; count the pieces that attack b3.

```
  8  . . r q r . k .
  7  . p . b p p b .
  6  p . . p . n p .
  5  . . . . . . B .
  4  . . . N P P p P
  3  P B N . . . . .
  2  P . P . Q . . .
  1  . K . R . . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: 2rqr1k1/1p1bppb1/p2p1np1/6B1/3NPPpP/PBN5/P1P1Q3/1K1R3R b - - 0 18
```

The line, with the sentence the learner sees at each move:
1. **18... Rxc3**: The rook takes the knight and attacks the bishop on b3: the sacrifice has been repaid.
2. **19. e5**: White attacks the knight on f6 and hopes to attack on the e-file; h5 was the engine's choice.
3. **19... Qc8**: Black adds the queen to the c-file and eyes the bishop and the c2 square.
4. **20. Rhe1**: White brings the second rook to the e-file.

```
  8  . . q . r . k .
  7  . p . b p p b .
  6  p . . p . n p .
  5  . . . . P . B .
  4  . . . N . P p P
  3  P B r . . . . .
  2  P . P . Q . . .
  1  . K . R R . . .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 2q1r1k1/1p1bppb1/p2p1np1/4P1B1/3N1PpP/PBr5/P1P1Q3/1K1RR3 b - - 2 20
```

Drawn on the board: arrows c3-b3; highlighted squares c3, b3, e5, c8.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [attackers] The black rook on c3 attacks the bishop on b3.
- [piece_on] After Rxc3 the black rook stands on c3.

### Step 29: item

**Task `IOD-LODDRAGON8-9`** (find_move, difficulty cue 3)

Black to move. Choose a move.

```
  1  . . . R R . K .
  2  . . . Q . P . P
  3  . . . . . r B P
  4  P p P . N . . .
  5  . B . P . . . .
  6  . p n . p . . p
  7  . b p p b . p .
  8  . k . r . q . .
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: 2q1r1k1/1p1bppb1/p2p1np1/4P1B1/3N1PpP/PBr5/P1P1Q3/1K1RR3 b - - 2 20
```

**Accepted answer(s):** Rxb3+

Feedback shown for wrong moves:
- Nh5: The knight move keeps all the pieces on but gives White time; the engine rates it clearly behind the rook capture.

**Explanation shown:** The rook trades itself for the bishop that guards the king's diagonal, with check. After the knight recaptures, the black pieces attack the open king; the engine rates the position clearly better for Black.

Hints (in order):
1. Which white piece defends the bishop on b3?
2. A rook for a bishop is an exchange sacrifice: what does the white king lose?
3. The rook captures on b3 with check.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] The engine (depth 16) prefers ...Rxb3+.
- [eval_range] After the best move the engine (depth 16) rates the position clearly better for Black.

### Step 30: board

Caption: Moves 20 to 22. After the sacrifice Black needs to bring more pieces than White can defend with: count attackers on the white king's area.

```
  8  . . q . r . k .
  7  . p . b p p b .
  6  p . . p . n p .
  5  . . . . P . B .
  4  . . . N . P p P
  3  P B r . . . . .
  2  P . P . Q . . .
  1  . K . R R . . .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: 2q1r1k1/1p1bppb1/p2p1np1/4P1B1/3N1PpP/PBr5/P1P1Q3/1K1RR3 b - - 2 20
```

The line, with the sentence the learner sees at each move:
1. **20... Rxb3+**: The exchange sacrifice: rook for bishop, with check, to destroy the last piece covering the king.
2. **21. Nxb3**: The knight takes. The b-pawn is gone and the bishop that covered the king's diagonal has been traded.
3. **21... Bc6**: The bishop develops with an eye on e4 and the long diagonal.
4. **22. exf6**: White takes the knight on f6.
5. **22... exf6**: Black recaptures and the e-file is open for both rooks.

```
  8  . . q . r . k .
  7  . p . . . p b .
  6  p . b p . p p .
  5  . . . . . . B .
  4  . . . . . P p P
  3  P N . . . . . .
  2  P . P . Q . . .
  1  . K . R R . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 2q1r1k1/1p3pb1/p1bp1pp1/6B1/5PpP/PN6/P1P1Q3/1K1RR3 w - - 0 23
```

Drawn on the board: arrows c6-g2; highlighted squares b3, c6, f6, b1.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [piece_on] After the knight recaptures it stands on b3.
- [piece_on] Black's bishop stands on c6.

### Step 31: board

Caption: FIRST SLIP of game 2, the position after 17.Qe2. The engine reads about 0.0. With the queen on d3 it would read about +0.6, so Qe2 gives up about half a pawn. The big swing comes two moves later (see the next board).

```
  8  . . r q r . k .
  7  . p . b p p b .
  6  p . . p . n p .
  5  . . . . . . B .
  4  . . n N P P p P
  3  . B N . . . . .
  2  P P P . Q . . .
  1  . K . R . . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: 2rqr1k1/1p1bppb1/p2p1np1/6B1/2nNPPpP/1BN5/PPP1Q3/1K1R3R b - - 2 17
```

Drawn on the board: highlighted squares e2, d3, a3.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [eval_range] After Qe2 the engine (depth 16) rates the position between -0.65 and +0.15, about level.

### Step 32: card

**What decided game 2.** Two moments. [V] White's queen to e2 gave up about half a pawn, because the queen on d3 would have avoided the knight sacrifice. After the sacrifice was repaid the position was level, and then White's pawn push to e5 threw about a pawn away. [I] A king on b1 has one pawn in front of it: remove that pawn and the c-file, b-file and long diagonal open at once.

### Step 33: board

Caption: TURNING POINT of game 2: the position after 18...Rxc3, White to move. The engine reads about 0.0 for h5 and f5. The game move, the pawn push to e5, drops White to about one pawn down [V, depth 16]. The sacrifice had been repaid; White needed to keep the initiative and did not.

```
  8  . . . q r . k .
  7  . p . b p p b .
  6  p . . p . n p .
  5  . . . . . . B .
  4  . . . N P P p P
  3  P B r . . . . .
  2  P . P . Q . . .
  1  . K . R . . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 3qr1k1/1p1bppb1/p2p1np1/6B1/3NPPpP/PBr5/P1P1Q3/1K1R3R w - - 0 19
```

The line, with the sentence the learner sees at each move:
1. **19. h5**: Even after the sacrifice White has a move: the pawn attacks g6 and takes the initiative.
2. **19... Nxh5**: Black takes.
3. **20. f5**: The f-pawn opens the f-file against f7 and the knight.

```
  8  . . . q r . k .
  7  . p . b p p b .
  6  p . . p . . p .
  5  . . . . . P B n
  4  . . . N P . p .
  3  P B r . . . . .
  2  P . P . Q . . .
  1  . K . R . . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 3qr1k1/1p1bppb1/p2p2p1/5PBn/3NP1p1/PBr5/P1P1Q3/1K1R3R b - - 0 20
```

Drawn on the board: highlighted squares h5, f5, e5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] The engine (depth 16) prefers h5 or f5.
- [move_loses] The game move e5 is worse than the best move by at least 60 centipawns.

### Step 34: item

**Task `IOD-LODDRAGON8-21`** (find_move, difficulty cue 3)

White to move. Black has just won the knight on c3 back with the rook. Which active move repairs the position?

```
  8  . . . q r . k .
  7  . p . b p p b .
  6  p . . p . n p .
  5  . . . . . . B .
  4  . . . N P P p P
  3  P B r . . . . .
  2  P . P . Q . . .
  1  . K . R . . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 3qr1k1/1p1bppb1/p2p1np1/6B1/3NPPpP/PBr5/P1P1Q3/1K1R3R w - - 0 19
```

**Accepted answer(s):** h5, f5

Feedback shown for wrong moves:
- e5: It looks forceful but it loses time against the rook on c3.

**Explanation shown:** Both pushes keep the position about level at depth 16. The game move e5 is worse by roughly a pawn (at least 60 centipawns).

Hints (in order):
1. Which pawn can attack the black king without opening the e-file for the rook?
2. Black's rook on c3 attacks the bishop on b3: do something with tempo.
3. Pawn to h5 or f5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] The engine (depth 16) rates h5 and f5 within 40 centipawns of each other as the top choices.
- [move_loses] The pawn push e5 is worse by at least 60 centipawns.

## Chapter: Game 3: the quiet game

### Step 35: card

**Game 3: the quiet game.** Not every Dragon is a pawn race. After the Classical set-up both kings castle short; no one pushes a pawn at the king, and the fight is over space and squares. [H] A quiet game rewards the player who keeps improving pieces; a single inaccurate piece move can then decide it, as a single missed tempo decides a race. Predict the plan of each side at each phase.

### Step 36: board

Caption: GAME 3: Smirin - Grandelius (European Individual Championship, Jerusalem, 27 Feb 2015; ratings 2650 and 2609; White won). The Classical set-up, 6.Be2. Purposes are the usual textbook ideas [R]; engine claims are [V] at depth 16.

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
1. **6. Be2**: A quiet developing move: no pawn is pushed and the bishop prepares castling.
2. **6... Bg7**: The fianchetto bishop eyes the long diagonal toward b2 and c3.
3. **7. O-O**: White castles short, so there will be no race: the kings stay on the same wing.
4. **7... O-O**: Black castles too.
5. **8. Re1**: The rook prepares to support e4 once the bishop retreats.
6. **8... Nc6**: The knight adds pressure on d4.
7. **9. Nb3**: The knight steps back before ...Nxd4 can trade it, and heads toward the queenside.
8. **9... a6**: Black prepares ...b5 to gain space on the queenside.
9. **10. Bf1**: The bishop retreats so the rook backs e4, and the a-pawn can advance without giving up the bishop.

```
  8  r . b q . r k .
  7  . p . . p p b p
  6  p . n p . n p .
  5  . . . . . . . .
  4  . . . . P . . .
  3  . N N . . . . .
  2  P P P . . P P P
  1  R . B Q R B K .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r1bq1rk1/1p2ppbp/p1np1np1/8/4P3/1NN5/PPP2PPP/R1BQRBK1 b - - 1 10
```

Drawn on the board: highlighted squares e2, f1, g7, b3.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [king_wing] White's king is on the kingside after castling.
- [king_wing] Black's king is on the kingside after castling.
- [piece_on] After Bf1 the bishop stands on f1.

### Step 37: item

**Task `IOD-LODDRAGON8-10`** (find_move, difficulty cue 2)

White to move. Choose a move.

```
  8  r . b q . r k .
  7  . . . . p p b p
  6  p . n p . n p .
  5  . p . . . . . .
  4  . . . . P . . .
  3  . N N . . . . .
  2  P P P . . P P P
  1  R . B Q R B K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: r1bq1rk1/4ppbp/p1np1np1/1p6/4P3/1NN5/PPP2PPP/R1BQRBK1 w - - 0 11
```

**Accepted answer(s):** a4, h3, Nd5, Bg5, Bf4

**Explanation shown:** The position is quiet: five moves are within about a quarter of a pawn at depth 16. The game move a4 challenges b5 and fixes the queenside; it is a typical plan, not a clear first choice.

Hints (in order):
1. Which Black pawn is the new space-gainer?
2. A pawn from your own wing can attack it.
3. The a-pawn advances to a4.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] The engine (depth 16) rates a4, h3, Nd5, Bg5 and Bf4 within 40 centipawns of one another.

### Step 38: board

Caption: Moves 11 to 15. The long manoeuvring phase: nothing is forced and every move is a small positional choice.

```
  8  r . b q . r k .
  7  . . . . p p b p
  6  p . n p . n p .
  5  . p . . . . . .
  4  . . . . P . . .
  3  . N N . . . . .
  2  P P P . . P P P
  1  R . B Q R B K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: r1bq1rk1/4ppbp/p1np1np1/1p6/4P3/1NN5/PPP2PPP/R1BQRBK1 w - - 0 11
```

The line, with the sentence the learner sees at each move:
1. **11. a4**: White challenges the b5 pawn and the squares behind it.
2. **11... b4**: Black pushes: the pawn attacks the knight on c3 and gains space.
3. **12. Nd5**: The knight leaps to the centre: from d5 it hits b4 and e7.
4. **12... Nd7**: Black retreats and prepares ...Nc5 or ...e6.
5. **13. a5**: The pawn takes b6 away from Black's knight and cramps the queenside.
6. **13... Rb8**: The rook defends b4 and prepares ...e6.
7. **14. Ra2**: The rook swings to the second rank to defend the pawn and switch to the kingside.
8. **14... e6**: Black challenges the knight on d5.
9. **15. Ne3**: The knight retreats toward g4 and f5, where it eyes the black king.
10. **15... Nf6**: Black returns to f6 to trade pieces.

```
  8  . r b q . r k .
  7  . . . . . p b p
  6  p . n p p n p .
  5  P . . . . . . .
  4  . p . . P . . .
  3  . N . . N . . .
  2  R P P . . P P P
  1  . . B Q R B K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 1rbq1rk1/5pbp/p1nppnp1/P7/1p2P3/1N2N3/RPP2PPP/2BQRBK1 w - - 2 16
```

Drawn on the board: highlighted squares d5, e3, b4, a5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [piece_attacks] From d5 the knight attacks b4 and e7.
- [pawn_attackers] The pawn on a5 attacks b6.
- [piece_on] After Ne3 the knight stands on e3.

### Step 39: item

**Task `IOD-LODDRAGON8-11`** (find_move, difficulty cue 3)

White to move. Choose a move.

```
  8  . r b q . r k .
  7  . . . . . p b p
  6  p . n p p n p .
  5  P . . . . . . .
  4  . p . . P . . .
  3  . N . . N . . .
  2  R P P . . P P P
  1  . . B Q R B K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 1rbq1rk1/5pbp/p1nppnp1/P7/1p2P3/1N2N3/RPP2PPP/2BQRBK1 w - - 2 16
```

**Accepted answer(s):** Ng4, Nc4

**Explanation shown:** The knight on g4 attacks the knight on f6 and offers a trade of Black's best kingside defender. Nc4 is also within 40 centipawns, so both are fine; the game chose the kingside.

Hints (in order):
1. Where can the knight on e3 go?
2. One of the squares attacks the defender of the black king.
3. The knight goes to g4, offering a trade.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] The engine (depth 16) rates Ng4 and Nc4 within 40 centipawns of each other as the top choices.
- [attackers] From g4 the knight attacks the knight on f6.

### Step 40: board

Caption: Moves 16 to 21. Pieces are traded and the structure stays closed; count what each side's last piece can still do.

```
  8  . r b q . r k .
  7  . . . . . p b p
  6  p . n p p n p .
  5  P . . . . . . .
  4  . p . . P . . .
  3  . N . . N . . .
  2  R P P . . P P P
  1  . . B Q R B K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 1rbq1rk1/5pbp/p1nppnp1/P7/1p2P3/1N2N3/RPP2PPP/2BQRBK1 w - - 2 16
```

The line, with the sentence the learner sees at each move:
1. **16. Ng4**: The knight offers a trade of Black's defender.
2. **16... Nxg4**: Black accepts.
3. **17. Qxg4**: The queen takes and now eyes the black king and the e6 pawn.
4. **17... Nd4**: Black centralises the knight, attacking the c2 and e2 squares.
5. **18. Nxd4**: White trades off the knight.
6. **18... Bxd4**: The bishop recaptures on the long diagonal.
7. **19. Qd1**: The queen retreats and attacks the bishop on d4 along the d-file.
8. **19... e5**: Black defends the bishop with a pawn and takes space.
9. **20. Be3**: White's dark bishop finally develops and challenges the bishop on d4.
10. **20... Be6**: Black develops the last piece, with an attack on the rook on a2.
11. **21. b3**: White blocks the diagonal to the rook on a2 with a pawn. The next move decides the game.

```
  8  . r . q . r k .
  7  . . . . . p . p
  6  p . . p b . p .
  5  P . . . p . . .
  4  . p . b P . . .
  3  . P . . B . . .
  2  R . P . . P P P
  1  . . . Q R B K .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 1r1q1rk1/5p1p/p2pb1p1/P3p3/1p1bP3/1P2B3/R1P2PPP/3QRBK1 b - - 0 21
```

Drawn on the board: highlighted squares d4, e3, e6, b3.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [piece_on] After Be3 White's bishop stands on e3.
- [attackers] After Be6 the black bishop attacks the rook on a2.

### Step 41: item

**Task `IOD-LODDRAGON8-12`** (find_move, difficulty cue 3)

Black to move. Choose a move.

```
  1  . K B R Q . . .
  2  P P P . . P . R
  3  . . . B . . P .
  4  . . . P b . p .
  5  . . . p . . . P
  6  . p . b p . . p
  7  p . p . . . . .
  8  . k r . q . r .
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: 1r1q1rk1/5p1p/p2pb1p1/P3p3/1p1bP3/1P2B3/R1P2PPP/3QRBK1 b - - 0 21
```

**Accepted answer(s):** Bxe3

Feedback shown for wrong moves:
- Bc3: The bishop attacks the rook on e1, but White simply takes the a6 pawn with the bishop and Black is worse by more than half a pawn.

**Explanation shown:** Taking on e3 removes White's dark bishop and keeps the structure simple. The game move ...Bc3 is worse by at least 50 centipawns at depth 16.

Hints (in order):
1. Look at the rook on e1 and the pawn on a6.
2. Trading removes White's bishop and keeps the rook on e1 out of play.
3. Bishop takes e3.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] The engine (depth 16) prefers ...Bxe3.
- [move_loses] The game move ...Bc3 is worse by at least 50 centipawns.

### Step 42: board

Caption: The two errors of game 3: 21...Bc3 (the engine prefers the trade on e3) and then, after 22.Bxa6, 22...Bxe1. A bishop on a6 does not attack the rook on e1; the bishop capture was a choice, not a necessity.

```
  8  . r . q . r k .
  7  . . . . . p . p
  6  p . . p b . p .
  5  P . . . p . . .
  4  . p . b P . . .
  3  . P . . B . . .
  2  R . P . . P P P
  1  . . . Q R B K .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: 1r1q1rk1/5p1p/p2pb1p1/P3p3/1p1bP3/1P2B3/R1P2PPP/3QRBK1 b - - 0 21
```

The line, with the sentence the learner sees at each move:
1. **21... Bc3**: Black attacks the rook on e1 with the bishop; the engine prefers ...Bxe3.
2. **22. Bxa6**: White ignores the attack on the rook and takes a6; if the bishop takes the rook, White has given the exchange for a pawn and a far-advanced a-pawn.
3. **22... Bxe1**: Black takes the rook. A second small error: the engine prefers ...Ra8 (see the next item).
4. **23. Qxe1**: White recaptures: Black has the exchange for a pawn, but the engine now rates White about +1.6.

```
  8  . r . q . r k .
  7  . . . . . p . p
  6  B . . p b . p .
  5  P . . . p . . .
  4  . p . . P . . .
  3  . P . . B . . .
  2  R . P . . P P P
  1  . . . . Q . K .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 1r1q1rk1/5p1p/B2pb1p1/P3p3/1p2P3/1P2B3/R1P2PPP/4Q1K1 b - - 0 23
```

Drawn on the board: highlighted squares c3, a6, e1.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [piece_on] After the sequence White's queen stands on e1.
- [piece_on] White has won the a6 pawn: a white bishop stands on a6.

### Step 43: item

**Task `IOD-LODDRAGON8-25`** (find_move, difficulty cue 3)

Black to move. White has just taken the pawn on a6. Choose a move.

```
  1  . K . R Q . . .
  2  P P P . . P . R
  3  . . . B . b P .
  4  . . . P . . p .
  5  . . . p . . . P
  6  . p . b p . . B
  7  p . p . . . . .
  8  . k r . q . r .
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: 1r1q1rk1/5p1p/B2pb1p1/P3p3/1p2P3/1Pb1B3/R1P2PPP/3QR1K1 b - - 0 22
```

**Accepted answer(s):** Ra8, Qh4

Feedback shown for wrong moves:
- Bxe1: The exchange for a pawn looks good, but White's far-advanced a-pawn and the loose pawns give the engine about +1.8.

**Explanation shown:** ...Ra8 attacks the bishop and keeps the bishop on c3 under control; the capture on e1 gives White about +1.8 against about +1.2. The error is about half a pawn or more.

Hints (in order):
1. The bishop on a6 does not attack the rook on e1.
2. Do you have to take the rook now?
3. The rook attacks the bishop on a6 from a8.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] The engine (depth 16) rates Ra8 and Qh4 within 40 centipawns of one another as the top choices.
- [move_loses] Taking the rook with ...Bxe1 is worse than ...Ra8 by at least 30 centipawns.

### Step 44: board

Caption: BEFORE THE ERRORS in game 3, the position after 21.b3. The engine bar reads about +0.3: balanced, with White slightly ahead. Two small errors by Black follow (21...Bc3, then 22...Bxe1), each worth roughly half a pawn or more.

```
  8  . r . q . r k .
  7  . . . . . p . p
  6  p . . p b . p .
  5  P . . . p . . .
  4  . p . b P . . .
  3  . P . . B . . .
  2  R . P . . P P P
  1  . . . Q R B K .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: 1r1q1rk1/5p1p/p2pb1p1/P3p3/1p1bP3/1P2B3/R1P2PPP/3QRBK1 b - - 0 21
```

Drawn on the board: highlighted squares d4, e3, a6, e1.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [eval_range] Turning point of game 3 (after b3): the engine (depth 16) rates the position between -0.15 and +0.65 for White.

### Step 45: card

**What decided game 3.** The position was balanced after twenty quiet moves. [V] Two small errors followed: a bishop move that avoided the trade on e3, and then taking the rook on e1 instead of ...Ra8. Each cost roughly half a pawn or more. [H] In a quiet game small errors add up because nothing forces matters; one slip can be survived, two are hard to. A loose pawn on a6 was the first sign.

### Step 46: item

**Task `IOD-LODDRAGON8-13`** (classify_position, difficulty cue 3)

Which statement names Black's decisive error in game 1?

```
  1  R R . . . . K .
  2  . . . N Q P P P
  3  . . . B . . . .
  4  P . . P . . p p
  5  n . N p B . . .
  6  . p . p . . . .
  7  . b p . b . . .
  8  . k r . q r . .
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: 2rq1rk1/3b1pb1/4p1p1/3BpN1n/pp2P2P/4B3/PPPQN3/1K4RR b - - 1 21
```

**Accepted answer:** {"class": "B. 21...exd5: Black took the bishop and left the knight on f5 alive"}

**Explanation shown:** Before ...exd5 the engine rates the position level; after it White is better by more than a pawn. ...h5 on move 13 was the engine's first choice, and ...a5 is only a small step behind ...b4. White's own Nf5 had just given away about a pawn; Black gave it back.

Hints (in order):
1. Which statement is about a moment where the evaluation changes by more than a pawn?
2. At that moment the engine says the position is level; one capture decides.
3. Look at the position after the knight jumps to f5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [move_loses] Taking the bishop with ...exd5 is worse by at least 100 centipawns.
- [best_move_in] The engine (depth 16) prefers ...gxf5.

### Step 47: item

**Task `IOD-LODDRAGON8-14`** (classify_position, difficulty cue 3)

Which statement names the real turning point of game 2?

```
  8  . . . q r . k .
  7  . p . b p p b .
  6  p . . p . n p .
  5  . . . . . . B .
  4  . . . N P P p P
  3  P B r . . . . .
  2  P . P . Q . . .
  1  . K . R . . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 3qr1k1/1p1bppb1/p2p1np1/6B1/3NPPpP/PBr5/P1P1Q3/1K1R3R w - - 0 19
```

**Accepted answer:** {"class": "C. 19.e5: after the sacrifice was repaid, the pawn push lost about a pawn"}

**Explanation shown:** After 18...Rxc3 the engine rates h5 and f5 about level; the game move e5 is worse by roughly a pawn. Qe2 cost about half a pawn and Bg5 even less.

Hints (in order):
1. Which statement is about a moment where the evaluation changes by about a pawn?
2. The king stands on b1; the exchange sacrifice has just been repaid.
3. Look at the position after the black rook takes on c3.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [move_loses] The game move e5 is worse than the best move by at least 60 centipawns.
- [best_move_in] The engine (depth 16) prefers h5 or f5.

### Step 48: item

**Task `IOD-LODDRAGON8-15`** (classify_position, difficulty cue 3)

What went wrong for Black in game 3 after the balanced middlegame?

```
  1  . K B R Q . . .
  2  P P P . . P . R
  3  . . . B . . P .
  4  . . . P b . p .
  5  . . . p . . . P
  6  . p . b p . . p
  7  p . p . . . . .
  8  . k r . q . r .
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: 1r1q1rk1/5p1p/p2pb1p1/P3p3/1p1bP3/1P2B3/R1P2PPP/3QRBK1 b - - 0 21
```

**Accepted answer:** {"class": "A. 21...Bc3 and 22...Bxe1: two small errors, each roughly half a pawn or more"}

**Explanation shown:** ...Bxe3 was better than ...Bc3, and after 22.Bxa6 the engine prefers ...Ra8 to the rook capture. 11.a4 is one of five near-equal moves, and Bxa6 is fine for White because the rook capture favours White.

Hints (in order):
1. After twenty balanced moves the engine's bar moves.
2. Two bishop moves by Black are worse than the alternatives.
3. Look at the bishop on d4.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] The engine (depth 16) prefers ...Bxe3.
- [move_loses] The game move ...Bc3 is worse by at least 50 centipawns.

### Step 49: reflect

Kind: expect

Prompt: Which phase of which game would you play differently, as White or as Black, and what would you change? Answer in a sentence.

- Field "The phase and the change:" (free text)

### Step 50: card

**A guess about the swings.** [H] In these three games the swing came from an inaccurate move just before a forcing sequence: a wrong capture, a pawn push, a bishop move. Whether that is general is untested, and tempo counting may or may not matter more than learning patterns. Caution: I chose three games with clear stories from the 2500+ games in our data, so they show examples, not how often each happens. Find a game that contradicts the guess.

### Step 51: reflect

Kind: expect

Prompt: Look back at game 1: the combination on g7 took several moves. Does 'one inaccurate move' or 'a tempo race' describe it better? Say why.

- Field "I think this because:" with options: agree / disagree / unsure; no single correct answer (a guess or a self-report)

## Chapter: Diagnose and repair

### Step 52: card

**Diagnose before you defend.** Znosko-Borovsky (*The Middle Game in Chess*) advises: find your chief weakness and the opponent's chief threat, then choose a long plan, not a single parry; when you stand worse, defend and win back freedom. Emanuel Lasker (*Common Sense in Chess*, Lecture 9) advises vacating weak points and supporting them when compromised. In the Dragon, ask: whose pawns are nearer the enemy king, which file is open, and which trade removes an attacker?

### Step 53: board

Caption: BLACK GOES WRONG, 1: a small slip, worth roughly 0.2 to 0.5 of a pawn (the number moves a little between runs). After long castling the engine wants the rook on the c-file; here Black plays a pawn move first.

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
1. **10... a6**: Black delays the rook: the pawn prepares ...b5 but the c-file stays unused.
2. **11. Bb3**: White retreats the bishop with a gain of time: the h-pawn can now run.

```
  8  r . . q . r k .
  7  . p . b p p b p
  6  p . n p . n p .
  5  . . . . . . . .
  4  . . . N P . . .
  3  . B N . B P . .
  2  P P P Q . . P P
  1  . . K R . . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r2q1rk1/1p1bppbp/p1np1np1/8/3NP3/1BN1BP2/PPPQ2PP/2KR3R b - - 1 11
```

Drawn on the board: highlighted squares c8, a6, b3.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] The engine (depth 16) prefers ...Rc8 at this point.
- [move_loses] The delaying move ...a6 is worse than ...Rc8 by at least 15 centipawns.
- [piece_on] After Bb3 the bishop stands on b3.

### Step 54: board

Caption: DAMAGE LIMITATION: with the bishop already on b3, the engine puts the knight challenge, ...b5, ...h5 and ...Rc8 within about 0.2 of each other. Whatever Black picks, the position stays about a pawn worse for Black. [I] The repairs here trade an attacker or slow the race.

```
  8  r . . q . r k .
  7  . p . b p p b p
  6  p . n p . n p .
  5  . . . . . . . .
  4  . . . N P . . .
  3  . B N . B P . .
  2  P P P Q . . P P
  1  . . K R . . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: r2q1rk1/1p1bppbp/p1np1np1/8/3NP3/1BN1BP2/PPPQ2PP/2KR3R b - - 1 11
```

The line, with the sentence the learner sees at each move:
1. **11... Na5**: The repair: challenge the bishop. A trade removes one of White's attackers.
2. **12. h4**: White continues the plan.
3. **12... Nxb3+**: The knight takes the bishop with check.
4. **13. axb3**: White recaptures; the a-file is half open next to his own king.

```
  8  r . . q . r k .
  7  . p . b p p b p
  6  p . . p . n p .
  5  . . . . . . . .
  4  . . . N P . . P
  3  . P N . B P . .
  2  . P P Q . . P .
  1  . . K R . . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r2q1rk1/1p1bppbp/p2p1np1/8/3NP2P/1PN1BP2/1PPQ2P1/2KR3R b - - 0 13
```

Drawn on the board: highlighted squares a5, b3.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] The engine (depth 16) puts Na5, b5, h5 and Rc8 within 40 centipawns of its first choice.
- [bishop_pair] After the trade Black holds the bishop pair.
- [piece_on] After the recapture a white pawn stands on b3.
- [eval_range] After the best repair the engine (depth 16) still rates the position at least +0.6 for White.

### Step 55: item

**Task `IOD-LODDRAGON8-16`** (find_move, difficulty cue 3)

Black to move. Choose a move.

```
  1  R . . . R K . .
  2  P P . . Q P P P
  3  . . P B . N B .
  4  . . . P N . . .
  5  . . . . . . . .
  6  . p n . p n . p
  7  p b p p b . p .
  8  . k r . q . . r
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: r2q1rk1/1p1bppbp/p1np1np1/8/3NP3/1BN1BP2/PPPQ2PP/2KR3R b - - 1 11
```

**Accepted answer(s):** Na5, b5, h5, Rc8

**Explanation shown:** The engine rates four moves within about 0.2 of each other; Black stays roughly a pawn worse in all of them. The best Black can do here is limit the damage: challenge the attacking bishop, or start the counterplay. The earlier slip is why the position is worse.

Hints (in order):
1. White's bishop on b3 and the h-pawn are the attackers.
2. Four moves are within a couple of tenths of each other.
3. Any of the knight challenge, b5, h5 or the rook move.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] The engine (depth 16) puts Na5, b5, h5 and Rc8 within 40 centipawns of its first choice.
- [eval_range] Even after the best move the engine rates the position at least +0.6 for White.

### Step 56: board

Caption: BLACK GOES WRONG, 2 (contrast): ...d5 mistimed. First the version that works: White has castled long but the bishop is still on f1. Masters played this break in 199 of 210 games in our data [V].

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
1. **9... d5**: The break works here: the bishop is still on f1 and no piece attacks d5 twice.
2. **10. exd5**: White takes.
3. **10... Nxd5**: Black recaptures with the knight; the central pawn trade is done.
4. **11. Nxc6**: White removes the knight that defended the centre.
5. **11... bxc6**: Black recaptures and the c6 pawn watches d5.
6. **12. Bd4**: White offers to trade the strongest black piece, the bishop on g7.

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

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r1bq1rk1/p3ppbp/2p3p1/3n4/3B4/2N2P2/PPPQ2PP/2KR1B1R b - - 1 12
```

Drawn on the board: highlighted squares d5, d4, c6.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] The engine (depth 16) prefers ...d5.

### Step 57: board

Caption: The same position with ONE change: White's bishop stands on c4 instead of f1 (an edited position, not a game position). The engine now rates the break much worse; this is one natural continuation, not the engine's only line.

```
  8  r . b q . r k .
  7  p p . . p p b p
  6  . . n p . n p .
  5  . . . . . . . .
  4  . . B N P . . .
  3  . . N . B P . .
  2  P P P Q . . P P
  1  . . K R . . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: r1bq1rk1/pp2ppbp/2np1np1/8/2BNP3/2N1BP2/PPPQ2PP/2KR3R b - - 4 9
```

The line, with the sentence the learner sees at each move:
1. **9... d5**: The same break, but now the bishop on c4 attacks d5 as well.
2. **10. Nxd5**: White takes with the knight: d5 is attacked more often than it is defended.
3. **10... Nxd5**: Black recaptures.
4. **11. Bxd5**: The bishop takes: White has won a pawn.
5. **11... Qb6**: The queen attacks d4 and b2, but White keeps the extra pawn.

```
  8  r . b . . r k .
  7  p p . . p p b p
  6  . q n . . . p .
  5  . . . B . . . .
  4  . . . N P . . .
  3  . . . . B P . .
  2  P P P Q . . P P
  1  . . K R . . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r1b2rk1/pp2ppbp/1qn3p1/3B4/3NP3/4BP2/PPPQ2PP/2KR3R w - - 1 12
```

Drawn on the board: highlighted squares d5, c4, c3.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [move_loses] The break ...d5 is worse than the best move by at least 70 centipawns.
- [attackers] After ...d5 three white pieces attack the pawn on d5.

### Step 58: contrast

Title: Is the central break ...d5 on?

Prompt: Predict first. Position 1: White has castled long and the bishop is on f1. Position 2: the same position, but White's bishop stands on c4. Position 3: as position 1 with White's h-pawn on h3. For which positions does the break work?

**The working board:**

**Task `IOD-LODDRAGON8-17`** (find_move, difficulty cue 2)

Black to move. White has castled long and White's bishop is on f1. Choose a move.

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

**Accepted answer(s):** d5

Feedback shown for wrong moves:
- Bd7: A reasonable developing move, but the engine rates it about 0.7 behind the central break.

**Explanation shown:** The break gains time in the centre and the engine rates it best at depth 16. With the bishop still on f1, d5 is attacked only by the e4 pawn and the c3 knight.

Hints (in order):
1. Which pawn can challenge the pawn on e4?
2. What would a white capture on c6 do to the pieces guarding d5?
3. The d-pawn advances to d5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] The engine (depth 16) prefers ...d5; the next move, ...h5, is about 0.3 behind.

**The failing board:**

**Task `IOD-LODDRAGON8-18`** (find_move, difficulty cue 3)

Black to move. The same position as before, but White's bishop stands on c4 instead of f1. Choose a move.

```
  1  R . . . R K . .
  2  P P . . Q P P P
  3  . . P B . N . .
  4  . . . P N B . .
  5  . . . . . . . .
  6  . p n . p n . .
  7  p b p p . . p p
  8  . k r . q b . r
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: r1bq1rk1/pp2ppbp/2np1np1/8/2BNP3/2N1BP2/PPPQ2PP/2KR3R b - - 4 9
```

**Accepted answer(s):** Bd7, Na5, Ne5, Qa5

Feedback shown for wrong moves:
- d5: The break loses a pawn: d5 is attacked three times (by the e4 pawn, the c3 knight and the bishop) and defended once.

**Explanation shown:** With the bishop on c4 the break loses a pawn: at least 70 centipawns at depth 16. The mechanism: d5 is attacked three times and defended once. Several quiet moves (Bd7, Na5, Ne5, Qa5) are close in value.

Hints (in order):
1. What does a knight capture on c6 do to the knight that guards d5?
2. With the bishop on c4, how many white pieces attack d5, and how many black pieces defend it?
3. Develop the bishop, or reposition a knight; do not break yet.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] The engine (depth 16) puts Bd7, Na5, Ne5 and Qa5 within 40 centipawns of its first choice.
- [move_loses] The break ...d5 is worse than the best move by at least 70 centipawns.

**The irrelevant board:**

**Task `IOD-LODDRAGON8-19`** (find_move, difficulty cue 2)

Black to move. The same position as the first one, but White's h-pawn stands on h3. Choose a move.

```
  1  R . B . R K . .
  2  . P . . Q P P P
  3  P . P B . N . .
  4  . . . P N . . .
  5  . . . . . . . .
  6  . p n . p n . .
  7  p b p p . . p p
  8  . k r . q b . r
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: r1bq1rk1/pp2ppbp/2np1np1/8/3NP3/2N1BP1P/PPPQ2P1/2KR1B1R b - - 0 9
```

**Accepted answer(s):** d5

Feedback shown for wrong moves:
- Nxd4: Trading the knight first is playable but the engine rates it about half a pawn behind the break.

**Explanation shown:** The h-pawn does not touch d5, so the break works as before: this is the irrelevant change. This is an edited position, not a game position.

Hints (in order):
1. Which feature of the position changed: does it touch d5?
2. The h-pawn is far from the centre.
3. The d-pawn advances to d5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] The engine (depth 16) still prefers ...d5; the next move is about 0.5 behind.

### Step 59: board

Caption: BLACK GOES WRONG, 3: the king exposed. In game 1 Black had the move ...b4. Here Black takes on g4 and opens the g-file for the rook already standing on g1.

```
  8  . . r q . r k .
  7  . . . b p p b .
  6  p . . p . n p .
  5  . p . . n . . p
  4  . . . N P . P P
  3  . B N . B P . .
  2  P P P Q . . . .
  1  . K . . . . R R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: 2rq1rk1/3bppb1/p2p1np1/1p2n2p/3NP1PP/1BN1BP2/PPPQ4/1K4RR b - - 0 15
```

The line, with the sentence the learner sees at each move:
1. **15... hxg4**: Black takes the pawn: the g-file opens in front of the white rook.
2. **16. h5**: White's h-pawn advances with tempo: it attacks g6.
3. **16... Rxc3**: Black tries the exchange sacrifice.
4. **17. Qxc3**: White takes the rook and the king race stops being a race.

```
  8  . . . q . r k .
  7  . . . b p p b .
  6  p . . p . n p .
  5  . p . . n . . P
  4  . . . N P . p .
  3  . B Q . B P . .
  2  P P P . . . . .
  1  . K . . . . R R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 3q1rk1/3bppb1/p2p1np1/1p2n2P/3NP1p1/1BQ1BP2/PPP5/1K4RR b - - 0 17
```

Drawn on the board: highlighted squares g4, g1, h5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [move_loses] Taking on g4 is worse than the best move by at least 60 centipawns.
- [attackers] After hxg4 the pawn on g4 is attacked by the rook and the f3 pawn.

### Step 60: board

Caption: THE REPAIR for the third slip: instead of taking on g4, push the b-pawn as in game 1. The pawn hits the knight with tempo, and the g-file stays shut for White's rook.

```
  8  . . r q . r k .
  7  . . . b p p b .
  6  p . . p . n p .
  5  . p . . n . . p
  4  . . . N P . P P
  3  . B N . B P . .
  2  P P P Q . . . .
  1  . K . . . . R R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: 2rq1rk1/3bppb1/p2p1np1/1p2n2p/3NP1PP/1BN1BP2/PPPQ4/1K4RR b - - 0 15
```

The line, with the sentence the learner sees at each move:
1. **15... b4**: The pawn attacks the knight on c3.
2. **16. Nce2**: The knight steps away.
3. **16... a5**: Black keeps the race going.
4. **17. gxh5**: White opens the g-file, but Black is now one tempo closer to the king.

```
  8  . . r q . r k .
  7  . . . b p p b .
  6  . . . p . n p .
  5  p . . . n . . P
  4  . p . N P . . P
  3  . B . . B P . .
  2  P P P Q N . . .
  1  . K . . . . R R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 2rq1rk1/3bppb1/3p1np1/p3n2P/1p1NP2P/1B2BP2/PPPQN3/1K4RR b - - 0 17
```

Drawn on the board: arrows b5-b4; highlighted squares b4, c3, g4.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] The engine (depth 16) prefers ...b4.
- [move_loses] Taking on g4 is worse than ...b4 by at least 60 centipawns.

### Step 61: card

**What the three Black slips have in common.** The first lost time (the rook came late), the second broke with ...d5 when White's bishop already stood on c4, the third opened the g-file for White's rook. [I] The break works while the bishop is on f1 and fails once it has come to c4. [H] A repair on the c-file may be more reliable than one on the long diagonal; four positions are not enough to know. Test it on your own games.

### Step 62: board

Caption: WHITE GOES WRONG, 1: the attack too slow, a small slip of roughly 0.4 of a pawn. The usual plan is the h-pawn. Here White brings a rook to the centre instead.

```
  8  . . r q . r k .
  7  . p . b p p b p
  6  p . . p . n p .
  5  . . . . n . . .
  4  . . . N P . . .
  3  . B N . B P . .
  2  P P P Q . . P P
  1  . K . R . . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 2rq1rk1/1p1bppbp/p2p1np1/4n3/3NP3/1BN1BP2/PPPQ2PP/1K1R3R w - - 0 13
```

The line, with the sentence the learner sees at each move:
1. **13. Rhe1**: White brings the second rook to the e-file: it feels active but the kingside pawns do not move.
2. **13... b5**: Black uses the free tempo: the pawn starts the race toward White's king.

```
  8  . . r q . r k .
  7  . . . b p p b p
  6  p . . p . n p .
  5  . p . . n . . .
  4  . . . N P . . .
  3  . B N . B P . .
  2  P P P Q . . P P
  1  . K . R R . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 2rq1rk1/3bppbp/p2p1np1/1p2n3/3NP3/1BN1BP2/PPPQ2PP/1K1RR3 w - - 0 14
```

Drawn on the board: highlighted squares e1, b5, h4.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] The engine (depth 16) prefers h4; h3, a3, g4, Bh6 and Rhe1 are 30 to 45 centipawns behind.
- [move_loses] The rook move is worse than the best move by at least 25 centipawns.
- [piece_on] After ...b5 the pawn stands on b5.

### Step 63: board

Caption: THE REPAIR: after the tempo was lost, the engine rates the position about level. White's way back is to slow Black's race and trade, not to hurry. Here the king is on b1, so the Bh6 trade is safe; compare the next board.

```
  8  . . r q . r k .
  7  . . . b p p b p
  6  p . . p . n p .
  5  . p . . n . . .
  4  . . . N P . . .
  3  . B N . B P . .
  2  P P P Q . . P P
  1  . K . R R . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 2rq1rk1/3bppbp/p2p1np1/1p2n3/3NP3/1BN1BP2/PPPQ2PP/1K1RR3 w - - 0 14
```

The line, with the sentence the learner sees at each move:
1. **14. a3**: The repair: a pawn move that stops ...b4 and keeps the b-file closed.
2. **14... Rb8**: Black prepares ...b4 anyway.
3. **15. Bh6**: Now the bishop trade, supported by the queen and without the c3 knight hanging.
4. **15... Bxh6**: Black accepts the trade.
5. **16. Qxh6**: The queen takes and the position is balanced.

```
  8  . r . q . r k .
  7  . . . b p p . p
  6  p . . p . n p Q
  5  . p . . n . . .
  4  . . . N P . . .
  3  P B N . . P . .
  2  . P P . . . P P
  1  . K . R R . . .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 1r1q1rk1/3bpp1p/p2p1npQ/1p2n3/3NP3/PBN2P2/1PP3PP/1K1RR3 b - - 0 16
```

Drawn on the board: highlighted squares a3, b4, h6.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [eval_range] The position after 13...b5 is balanced: the engine (depth 16) rates the position between -0.40 and +0.40 for White.
- [best_move_in] The engine (depth 16) prefers a3 or Bh6; both are within 40 centipawns.

### Step 64: item

**Task `IOD-LODDRAGON8-22`** (find_move, difficulty cue 3)

White to move. The slow rook move has let Black start ...b5. Which move keeps the position level?

```
  8  . . r q . r k .
  7  . . . b p p b p
  6  p . . p . n p .
  5  . p . . n . . .
  4  . . . N P . . .
  3  . B N . B P . .
  2  P P P Q . . P P
  1  . K . R R . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 2rq1rk1/3bppbp/p2p1np1/1p2n3/3NP3/1BN1BP2/PPPQ2PP/1K1RR3 w - - 0 14
```

**Accepted answer(s):** a3, Bh6

Feedback shown for wrong moves:
- h3: A slow move again: Black continues ...b4 with tempo.

**Explanation shown:** Stopping ...b4 with a3 or trading with Bh6 keeps the engine's score near level at depth 16. The quiet h3 is worse by at least 30 centipawns.

Hints (in order):
1. Black's next idea is ...b4 to hit the c3 knight.
2. Stopping that pawn, or trading the dark bishops, keeps the balance.
3. Pawn to a3 or bishop to h6.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] The engine (depth 16) rates a3 and Bh6 within 40 centipawns of each other as the top choices.
- [move_loses] The quiet h3 is worse than the best move by at least 30 centipawns.

### Step 65: board

Caption: WHITE GOES WRONG, 2: the Bh6 trade without preparation. [H] The trade is safest when the king is already on b1 and the c3 knight is supported. Here the king is still on c1: the engine prefers Kb1 first (about +0.8 for White) and rates Bh6 about 0.9 lower.

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
1. **12. Bh6**: White hurries the trade of the dark bishops before the king is safe.
2. **12... Bxh6**: Black accepts.
3. **13. Qxh6**: The queen takes on h6; the c3 knight is now guarded only by the b2 pawn.
4. **13... Rxc3**: The exchange sacrifice: the rook takes the knight.
5. **14. bxc3**: White takes the rook.
6. **14... a5**: Black has given up the exchange; White's king has lost the cover of the b-pawn.

```
  8  . . . q . r k .
  7  . p . b p p . p
  6  . . . p . n p Q
  5  p . . . n . . .
  4  . . . N P . . .
  3  . B P . . P . .
  2  P . P . . . P P
  1  . . K R . . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 3q1rk1/1p1bpp1p/3p1npQ/p3n3/3NP3/1BP2P2/P1P3PP/2KR3R w - - 0 15
```

Drawn on the board: highlighted squares h6, c3, c1.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [piece_on] White's king is still on c1.
- [best_move_in] The engine (depth 16) prefers Kb1.
- [move_loses] Bh6 is worse than Kb1 by at least 40 centipawns.
- [piece_on] After the exchange sacrifice and recapture a white pawn stands on c3.

### Step 66: item

**Task `IOD-LODDRAGON8-20`** (find_move, difficulty cue 3)

White to move after the exchange sacrifice on c3. Which recapture limits the damage?

```
  8  . . . q . r k .
  7  p p . b p p . p
  6  . . . p . n p Q
  5  . . . . n . . .
  4  . . . N P . . .
  3  . B r . . P . .
  2  P P P . . . P P
  1  . . K R . . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 3q1rk1/pp1bpp1p/3p1npQ/4n3/3NP3/1Br2P2/PPP3PP/2KR3R w - - 0 14
```

**Accepted answer(s):** bxc3

Feedback shown for wrong moves:
- h4: The attack is too slow: Black takes the bishop on b3 with check and White's king is naked.

**Explanation shown:** Taking the rook is the only move within 40 centipawns at depth 16; hurrying with h4 loses at least 300 centipawns.

Hints (in order):
1. Black has given an exchange. What would you take?
2. Count: if you attack the king now, Black's rook takes the bishop on b3 with check.
3. The b-pawn takes the rook.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] The engine (depth 16) prefers bxc3.
- [move_loses] The attacking h4 is worse than bxc3 by at least 300 centipawns.

### Step 67: item

**Task `IOD-LODDRAGON8-26`** (find_move, difficulty cue 3)

White to move. The king stands on c1 and the c-file is half open. Choose a move.

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

**Accepted answer(s):** Kb1

Feedback shown for wrong moves:
- Bh6: The trade invites the exchange sacrifice on c3 while the king is still on c1.

**Explanation shown:** With the king on b1 the c-file tricks lose their sting; the trade on h6 then becomes safe. Bh6 at once is worse than Kb1 by at least 40 centipawns at depth 16.

Hints (in order):
1. The king is on the c-file, where the black rook is aimed.
2. A king move removes the c-file tricks.
3. The king goes to b1.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] The engine (depth 16) prefers Kb1.
- [move_loses] Bh6 is worse than Kb1 by at least 40 centipawns.

### Step 68: board

Caption: WHITE GOES WRONG, 3: the queen on e2 allows the knight sacrifice on a3. In game 2 White played Qe2. The engine prefers the queen on d3 by about half a pawn or more.

```
  8  . . r q r . k .
  7  . p . b p p b .
  6  p . . p . n p .
  5  . . . . . . B .
  4  . . n N P P p P
  3  . B N . . . . .
  2  P P P Q . . . .
  1  . K . R . . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 2rqr1k1/1p1bppb1/p2p1np1/6B1/2nNPPpP/1BN5/PPPQ4/1K1R3R w - - 1 17
```

The line, with the sentence the learner sees at each move:
1. **17. Qd3**: The repair: the queen steps to d3, keeping the d-file and avoiding the knight sacrifice on a3.
2. **17... Qc7**: Black prepares the c-file attack.
3. **18. Bxf6**: White removes the main defender of the black king.
4. **18... Bxf6**: Black recaptures.

```
  8  . . r . r . k .
  7  . p q b p p . .
  6  p . . p . b p .
  5  . . . . . . . .
  4  . . n N P P p P
  3  . B N Q . . . .
  2  P P P . . . . .
  1  . K . R . . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 2r1r1k1/1pqbpp2/p2p1bp1/8/2nNPPpP/1BNQ4/PPP5/1K1R3R w - - 0 19
```

Drawn on the board: highlighted squares d3, a3, b1.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] The engine (depth 16) prefers Qd3.
- [move_loses] Qe2 (the game move) is worse than Qd3 by at least 30 centipawns.
- [attackers] After Qd3 the queen and the bishop on b3 both attack the knight on c4.

### Step 69: item

**Task `IOD-LODDRAGON8-27`** (find_move, difficulty cue 3)

White to move. The black knight on c4 attacks the queen. Choose a move.

```
  8  . . r q r . k .
  7  . p . b p p b .
  6  p . . p . n p .
  5  . . . . . . B .
  4  . . n N P P p P
  3  . B N . . . . .
  2  P P P Q . . . .
  1  . K . R . . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 2rqr1k1/1p1bppb1/p2p1np1/6B1/2nNPPpP/1BN5/PPPQ4/1K1R3R w - - 1 17
```

**Accepted answer(s):** Qd3

Feedback shown for wrong moves:
- Qe2: It steps aside but allows the knight sacrifice on a3.

**Explanation shown:** Qd3 keeps the queen on the d-file and attacks the knight on c4 together with the bishop; Qe2 allows the knight sacrifice on a3. Qd3 is better by roughly half a pawn at depth 16.

Hints (in order):
1. Which queen square avoids the knight check on a3?
2. The queen can attack the knight on c4 as well.
3. The queen goes to d3.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] The engine (depth 16) prefers Qd3.
- [move_loses] Qe2 (the game move) is worse than Qd3 by at least 30 centipawns.

### Step 70: item  (shown without telling the learner the topic: unlabeled test)

**Task `IOD-LODDRAGON8-23`** (find_move, difficulty cue 3)

Black to move. Choose the move you would play in a game.

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

**Accepted answer(s):** a6, h5, Re8

Feedback shown for wrong moves:
- Kh8: A tempo move that prepares nothing: the engine rates it clearly worse for Black.

**Explanation shown:** Three moves are within a few tenths of each other at depth 16; each prepares or hits something (the engine is not fully stable here, and ...Nc4 is close too). A waiting king move is worse by at least 40 centipawns.

Hints (in order):
1. White's king is safe on b1, the h-pawn is about to run.
2. Look for a move that prepares or hits something.
3. Candidates: the a-pawn, the h-pawn, the rook.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] The engine (depth 16) rates ...a6, ...h5 and ...Re8 within 40 centipawns of its first choice.
- [move_loses] The waiting move ...Kh8 is worse by at least 40 centipawns.

### Step 71: card

**Cross-check with our data** (players 2500+). After Black's eighth move, three ninth moves matter. The bishop to c4: 139 games (White 60 wins, 62 draws, Black 17). Long castling: 217 games (69, 102, 46); only 210 have a recorded Black reply. The g-pawn push: 41 games (21, 15, 5). [V] The bishop games average 2934, so many are engine games: read White's 65% as engine-assisted play. Counts show what was played, not what is stronger.

### Step 72: reflect

Kind: expect

Prompt: Name one thing these counts do not tell you, and one thing you would want to check before using them to choose a move.

- Field "What the counts hide:" (free text)

## Chapter: Recap and teach it back

### Step 73: card

**Recap.**
- Game 1 turned on two moves, game 2 on a slip and a pawn push, game 3 on two bishop moves. [V]
- [H] In these games one inaccurate move came before a forcing sequence; whether that is general is untested.
- [I] Black's repairs here were trades or quiet moves, and they leave Black worse.
- [I] White's repair was to slow Black's race.
- [H] In the Classical, pieces matter more than a race.
- Check the machine's numbers against the sample size.

### Step 74: board

Caption: Back to the start: this was the final position of game 2 (Durarbayli - Mchedlishvili, Konya 2012). You guessed how it was decided at the beginning.

```
  8  . . . . . . k .
  7  . p . . . p . .
  6  p . . . . . p .
  5  . . . . . . P .
  4  . . . b . P . .
  3  P . . . . . p .
  2  P . Q . . q . .
  1  . K . R . . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 6k1/1p3p2/p5p1/6P1/3b1P2/P5p1/P1Q2q2/1K1R4 w - - 0 33
```

Drawn on the board: highlighted squares f2, g3, b1.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [piece_on] Black's queen stands on f2.

### Step 75: reflect

Kind: expect

Prompt: Was your first guess right? In a sentence: what actually decided game 2, and what would have changed it?

- Field "My guess was:" with options: right / partly right / wrong; no single correct answer (a guess or a self-report)

- Field "What decided it, in my words:" (free text)

### Step 76: reflect

Kind: unsure

Prompt: Teach it back to a friend who knows only the opening moves. Use these four fields; then check them against the list below.
Self-check: Did I say when the plan works? When it fails? Give one example a beginner could set up on a board? Name one mistake and its repair?

- Field "The idea of a model game:" (free text)

- Field "When a Dragon game turns on one move:" (free text)

- Field "One example I would show:" (free text)

- Field "One warning and its repair:" (free text)

---

## Reviewer scorecard

Fill in the file `content/review/L-OD-DRAGON-8.json` (a template is below). Scale 1 to 5 for each dimension: 1 = wrong or unusable, 3 = acceptable with edits, 5 = I would put my name to it as it stands.
Revision to review: `85bb5853`. If the lesson text changes after your review, your sign-off no longer applies and the lesson goes back to needs-human.

| Dimension | What to judge | Score |
|---|---|---|
| chess | every statement, line and explanation is correct; near-misses are really near-misses | |
| clarity | the explanation actually explains (mechanism, conditions), in plain words | |
| prerequisites | the lesson assumes only what the learner has met | |
| tasks | each task has one defensible answer and a fair explanation | |

```json
{
  "lesson": "L-OD-DRAGON-8",
  "revision": "85bb5853",
  "reviewer": "<your name>",
  "reviewer_role": "strong-player",
  "date": "YYYY-MM-DD",
  "scores": {"chess": 0, "clarity": 0, "prerequisites": 0, "tasks": 0},
  "comments": "<what to change, by step number>",
  "verdict": "approved"
}
```

`reviewer_role` is `strong-player` or `teacher`. `verdict` is `approved` or `changes-requested`. See docs/review-slice.md.
