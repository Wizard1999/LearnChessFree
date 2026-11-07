# Review packet: L-OD-DRAGON-2

**The Dragon structure: pawn skeleton, half-open files and the breaks each side wants**

- Skill: OPN.STRUCT (D2); stage: exemplar; stated length: 38 minutes
- Steps: 62 (18 are tasks); revision: `e62aa2f9`
- Review status now: needs-human

## What the lesson says the learner will be able to do

- Names the half-open files of the Dragon (c for Black, d for White) and says which pawn trade created each
- Finds each side's pawn lever (d, b and a for Black; g and h for White) and says which file it opens
- Says what each lever needs to be true (rook behind the b-pawn, bishop on c8 for d5, king safe before the h-file opens)
- Recognises a position where no lever is ready and chooses a quiet move, and a position where a quiet move is a mistake

## Sources the author names (check that they are used fairly, in our own words)

- Our structure tool (tools/structure.py, claims in tools/validate.py) for every statement about files, holes, protected pawns and chain bases [V]
- docs/citable-views.md 3.1 (Edward Lasker, Chess Strategy: the pawn skeleton lasts, pieces can retreat) [V-sheet]
- docs/citable-views.md 3.8 and 3.9 (Nimzowitsch, My System: attack the base of a chain) [V-sheet]
- docs/citable-views.md 4.11 (Edward Lasker and Philidor: with opposite-wing castling pawns are cheap and speed decides) [V-sheet, Philidor skim]
- docs/citable-views.md 8.5 (Nimzowitsch: holes and outposts) [V-sheet]
- app/public/masters/stats.json (329,379 games, both players 2500+, 2012-2026): counts quoted exactly from the tree rows after 9.O-O-O d5 and after 12...Ne5
- content/items/lesson-od-dragon.json (positions IODdragon-1 to -11 re-used) and content/items/lesson-od-l-od-dragon-2.json (positions replayed from the Dragon move sequence with python-chess; one-feature edits marked in provenance; engine claims at depth 16)
- Conjecture labelled [H] or [I] in the text is the author's own and is not checked

## How to read this packet

Boards are drawn with capitals for White and lower case for Black, rank 8 at the top unless the board is shown from Black's side. Moves in a line are in standard notation. Statements marked [V] were machine-checked, [I] inference, [H] hypothesis, [S] secondary source, [R] recalled. Please judge the explanations, not only the moves: does each sentence tell the learner why?

---

## Chapter: Who attacks first

### Step 1: board

Caption: White to move, twelve moves into the Yugoslav Attack. The kings stand on opposite wings. Do not calculate: look at the pawns, the open file and the bishop on g7.

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

Drawn on the board: highlighted squares c8, c1, h4, h5, g7.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [king_wing] White's king is on the queenside.
- [king_wing] Black's king is on the kingside.
- [eval_range] The engine rates this position between a fifth of a pawn for Black and nine tenths of a pawn for White (depth 16).

### Step 2: reflect

Kind: expect

Prompt: Whose attack do you think arrives first, and why? Write the reason, not just the name of the side. You will come back to this at the end.

- Field "My guess:" with options: White's attack on the h-file / Black's attack on the c-file / about equal; no single correct answer (a guess or a self-report)

- Field "Because:" (free text)

### Step 3: card

**Today's question.** Both kings are castled, but on opposite wings. A rule of thumb from Edward Lasker: with kings on opposite wings, speed counts more than material, because pawns stop being a shield and become a battering ram. We will test it. By the end you will say, for each side, which pawn lever it wants, which file it opens, and what to do when it is blocked or early. First, three small positions.

### Step 4: board

Caption: A Closed Sicilian: both sides keep their c- and d-pawns. Count the pawns on each file. Which files are open or half-open? Predict, then read the claim.

```
  8  r . b q k . n r
  7  p p . . p p b p
  6  . . n p . . p .
  5  . . p . . . . .
  4  . . . . P . . .
  3  . . N P . . P .
  2  P P P . . P B P
  1  R . B Q K . N R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: r1bqk1nr/pp2ppbp/2np2p1/2p5/4P3/2NP2P1/PPP2PBP/R1BQK1NR w KQkq - 0 6
```

Drawn on the board: highlighted squares c2, c5, d3, d6.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [open_files] No file is open or half-open: both sides still have pawns on every file that has any.

### Step 5: item

**Task `IOD-LODDRAGON2-1`** (predict_outcome, difficulty cue 2)

Look at the pawns. Which file is half-open for Black: no black pawn on it, and a white pawn at its far end?

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

White to move. Capitals = White, lower case = Black.
FEN: r1bq1rk1/pp2ppbp/2np1np1/8/3NP3/2N1BP2/PPPQ2PP/R3KB1R w KQ - 3 9
```

**Accepted answer:** {"outcome": "the c-file"}

**Explanation shown:** Black has no pawn on the c-file and White still has one, so the c-file is half-open for Black. The d-file is half-open for White in the same way.

Hints (in order):
1. Which black pawn has been traded off the board?
2. Black's c-pawn is gone, but White's c2 pawn is still there.
3. The c-file.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [open_files] The c-file is half-open for Black and the d-file is half-open for White.

### Step 6: board

Caption: The answer. One white pawn (d) and one black pawn (c) have gone from the board in the opening, which changes two files. What does that mean for each side's rooks?

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

Drawn on the board: highlighted squares c2, d6.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [open_files] The c-file is half-open for Black (no black pawn, a white pawn at its far end) and the d-file is half-open for White.

### Step 7: item

**Task `IOD-LODDRAGON2-2`** (predict_outcome, difficulty cue 2)

Black plays d5, White takes, Black retakes with the knight, White takes on c6 and Black retakes with the b-pawn. What is the d-file like now?

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

**Accepted answer:** {"outcome": "open: no pawns at all"}

**Explanation shown:** The only pawn on the d-file was Black's, and it was traded on d5, so no pawn is left on that file.

Hints (in order):
1. Count the pawns that stood on the d-file before the first move.
2. Black had one pawn there and White none; what happened to it?
3. No pawn is left on the d-file.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [open_files] After these moves the d-file is open, the e-file is half-open for White and the b-file is half-open for Black.

### Step 8: board

Caption: The answer: after ...d5 and the trades the d-file has no pawns at all. White's e-pawn has gone, so the e-file is half-open for White; Black's b-pawn has gone, so the b-file is half-open for Black.

```
  8  r . b q . r k .
  7  p . . . p p b p
  6  . . p . . . p .
  5  . . . n . . . .
  4  . . . . . . . .
  3  . . N . B P . .
  2  P P P Q . . P P
  1  . . K R . B . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: r1bq1rk1/p3ppbp/2p3p1/3n4/8/2N1BP2/PPPQ2PP/2KR1B1R w - - 0 12
```

Drawn on the board: highlighted squares d1, d8, e7, b2.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [open_files] The d-file is open, the e-file is half-open for White and the b-file is half-open for Black.

### Step 9: item

**Task `IOD-LODDRAGON2-3`** (predict_outcome, difficulty cue 2)

White plays g4, Black takes, White plays h5, and the knight takes it. Which file has no pawns at all now?

```
  8  . . r q r . k .
  7  p p . b p p b .
  6  . . . p . n p .
  5  . . . . n . . p
  4  . . . N P . . P
  3  . B N . B P . .
  2  P P P Q . . P .
  1  . K . R . . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 2rqr1k1/pp1bppb1/3p1np1/4n2p/3NP2P/1BN1BP2/PPPQ2P1/1K1R3R w - - 0 14
```

**Accepted answer:** {"outcome": "the h-file"}

**Explanation shown:** Both h-pawns have gone and a black pawn stands on g4, so the h-file is open and the g-file is half-open for White.

Hints (in order):
1. Follow each pawn: where does each h-pawn end up?
2. The black pawn on h5 captured on g4, and the white pawn on h5 was captured.
3. The h-file.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [open_files] After these moves the h-file is open and the g-file is half-open for White.

### Step 10: board

Caption: White to move. Offer the g-pawn, and if Black takes, push the h-pawn. After the knight takes on h5, look at the h-file.

```
  8  . . r q r . k .
  7  p p . b p p b .
  6  . . . p . n p .
  5  . . . . n . . p
  4  . . . N P . . P
  3  . B N . B P . .
  2  P P P Q . . P .
  1  . K . R . . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 2rqr1k1/pp1bppb1/3p1np1/4n2p/3NP2P/1BN1BP2/PPPQ2P1/1K1R3R w - - 0 14
```

The line, with the sentence the learner sees at each move:
1. **14. g4**: The pawn is offered: if Black takes it, the black h-pawn leaves the h-file.
2. **14... hxg4**: Black takes and now has a pawn on g4 but none on the h-file.
3. **15. h5**: The white h-pawn advances and attacks the pawn on g6.
4. **15... Nxh5**: The knight takes the pawn: now neither side has a pawn left on the h-file.

```
  8  . . r q r . k .
  7  p p . b p p b .
  6  . . . p . . p .
  5  . . . . n . . n
  4  . . . N P . p .
  3  . B N . B P . .
  2  P P P Q . . . .
  1  . K . R . . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 2rqr1k1/pp1bppb1/3p2p1/4n2n/3NP1p1/1BN1BP2/PPPQ4/1K1R3R w - - 0 16
```

Drawn on the board: arrows h1-h5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [open_files] After these four moves the h-file is open and the g-file is half-open for White.
- [pawn_attackers] After the h-pawn reaches h5 it attacks g6.

## Chapter: The pawn skeleton

### Step 11: card

**The skeleton.** Pieces can leave a square; pawns cannot go back, so the pawns fix the rest of the game (Edward Lasker, *Chess Strategy*). Black's c-pawn is gone, and no black pawn can ever guard h6. White's d-pawn is gone, and no white pawn can ever guard e3. [I] In the main line Black pushes the h-pawn to h5, which blocks White's h-pawn on h4 until the g-pawn offers a trade.

### Step 12: board

Caption: Only the pawns and kings, taken from the Dragon position. Each side has one hole on a dark square: h6 for Black, e3 for White.

```
  8  . . . . . . k .
  7  p p . . p p . p
  6  . . . p . . p .
  5  . . . . . . . .
  4  . . . . P . . .
  3  . . . . . P . .
  2  P P P . . . P P
  1  . . K . . . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 6k1/pp2pp1p/3p2p1/8/4P3/5P2/PPP3PP/2K5 w - - 0 1
```

Drawn on the board: highlighted squares c8, c1, d6, d1, h6, e3.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [open_files] The c-file is half-open for Black and the d-file is half-open for White.
- [pawn_set] Black's pawns on d6 and g6 are protected by pawns.
- [pawn_set] White's pawn chain e4-f3-g2 has its base on g2.
- [holes] h6 is a hole in Black's camp: no black pawn guards it now or can guard it later.
- [holes] e3 is a hole in White's camp.

### Step 13: item

**Task `IOD-LODDRAGON2-4`** (select_squares, difficulty cue 2)

Tap every square on Black's side (ranks 4 to 6) that no black pawn guards now and none can guard later: a hole.

```
  1  . . . . . K . .
  2  P P . . . P P P
  3  . . P . . . . .
  4  . . . P . . . .
  5  . . . . . . . .
  6  . p . . p . . .
  7  p . p p . . p p
  8  . k . . . . . .
     h g f e d c b a

White to move. Capitals = White, lower case = Black.
FEN: 6k1/pp2pp1p/3p2p1/8/4P3/5P2/PPP3PP/2K5 w - - 0 1
```

**Accepted answer:** squares h6

**Explanation shown:** A black pawn could guard h6 only from g7, and the g-pawn has already left that square.

Hints (in order):
1. Which dark square next to the bishop's diagonal has no pawn that could ever attack it?
2. A pawn guards diagonally forward; the g-pawn stands on g6.
3. h6.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [holes] h6 is the only hole in Black's camp.

## Chapter: The levers

### Step 14: card

**The levers.** A lever is a pawn push that challenges an enemy pawn or piece, to change the pawn structure or open a line. Black has three: the d-pawn hits e4; the b-pawn and the a-pawn need two moves each, to reach b4 and a4 and hit c3 and b3. White has two: the h-pawn (aimed at g6) and the g-pawn (kicks the knight on f6). A queen move or a rook given up on c3 are non-pawn ideas, not levers.

### Step 15: board

Caption: Black's three pawn levers on the skeleton. Each arrow is a legal pawn move. The d-pawn hits the e4 pawn at once; the b-pawn and a-pawn head for b4 and a4, from where they would hit c3 and b3.

```
  8  . . . . . . k .
  7  p p . . p p . p
  6  . . . p . . p .
  5  . . . . . . . .
  4  . . . . P . . .
  3  . . . . . P . .
  2  P P P . . . P P
  1  . . K . . . . .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: 6k1/pp2pp1p/3p2p1/8/4P3/5P2/PPP3PP/2K5 b - - 0 1
```

Drawn on the board: arrows d6-d5, b7-b5, a7-a5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] The d-pawn can advance.
- [legal_move] The b-pawn can advance.
- [legal_move] The a-pawn can advance.

### Step 16: board

Caption: White's two pawn levers. With opposite-wing castling, pawns can be spent for speed (Edward Lasker, Chess Strategy; Philidor [S]): the question is whether the file opens before the counterattack lands.

```
  8  . . . . . . k .
  7  p p . . p p . p
  6  . . . p . . p .
  5  . . . . . . . .
  4  . . . . P . . .
  3  . . . . . P . .
  2  P P P . . . P P
  1  . . K . . . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 6k1/pp2pp1p/3p2p1/8/4P3/5P2/PPP3PP/2K5 w - - 0 1
```

Drawn on the board: arrows h2-h4, g2-g4.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] The h-pawn can advance two squares.
- [legal_move] The g-pawn can advance two squares.

### Step 17: board

Caption: Black to move after White castles long. This is the ...d5 break. The engine ranks it first; watch what it does to the d-file and to the knight on d5.

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
1. **9... d5**: The lever: the pawn attacks e4, the pawn that f3 holds up, and aims to open the d-file.
2. **10. exd5**: White takes. The centre opens and the shield in front of Black's queen is gone.
3. **10... Nxd5**: The knight recaptures. From d5 it attacks both the knight on c3 and the bishop on e3.
4. **11. Nxc6**: White trades off the knight that was pressing on d4.
5. **11... bxc6**: Black recaptures with the b-pawn, which opens the b-file for a rook.
6. **12. Bd4**: The bishop takes the long diagonal and faces Black's bishop on g7.

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

Drawn on the board: arrows d6-d5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] d5 is the engine's top move (depth 16).
- [piece_attacks] The knight on d5 attacks b4, b6, c3, c7, e3, e7, f4 and f6.
- [open_files] After the trades on c6 the d-file is open.

### Step 18: board

Caption: White to move, one move earlier in the same line. The knight on d4 has to choose between two captures. Predict which one the engine prefers, then step through its line.

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

White to move. Capitals = White, lower case = Black. Starting position.
FEN: r1bq1rk1/pp2ppbp/2n3p1/3n4/3N4/2N1BP2/PPPQ2PP/2KR1B1R w - - 0 11
```

The line, with the sentence the learner sees at each move:
1. **11. Nxc6**: White captures the knight on c6 first; the engine ranks this far above the other recapture.
2. **11... bxc6**: Black recaptures with the b-pawn, which opens the b-file.
3. **12. Bd4**: White offers the trade of the dark-squared bishops.
4. **12... Bxd4**: Black accepts the trade.
5. **13. Qxd4**: The queen recaptures in the centre, on the same file as the rook.

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

Drawn on the board: highlighted squares c6, d5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] Nxc6 is the engine's top move (depth 16).
- [move_loses] Nxd5 is at least 50 centipawns worse than the best move (depth 16).
- [piece_attacks] The knight on d4 attacks b3, b5, c2, c6, e2, e6, f3 and f5.

### Step 19: card

**When ...d5 works.** In this position it needs d5 defended twice. [I] With the bishop on c8, the knight on f6 and the queen (through d7) defend d5; with the bishop on d7 only the knight does, so Nxd5 wins a pawn. We did not test the knight on c6. [H] ...d5 is a freeing move more than a plan. Weak evidence: of 199 master games with it, 97 were drawn (61 White wins, 41 Black wins).

### Step 20: board

Caption: White to move. The pawn lever on the h-file needs help, so first the g-pawn. Step through the plan and notice what each move does for the next.

```
  8  . . . q . r k .
  7  p p . b p p b p
  6  . . . p . n p .
  5  . . . . . . . .
  4  . . r N P . . P
  3  . . N . B P . .
  2  P P P Q . . P .
  1  . . K R . . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 3q1rk1/pp1bppbp/3p1np1/8/2rNP2P/2N1BP2/PPPQ2P1/2KR3R w - - 0 14
```

The line, with the sentence the learner sees at each move:
1. **14. g4**: The g-pawn guards h5 first, so the h-pawn can advance without being taken by the knight.
2. **14... b5**: Black counters on the other wing: the b-pawn heads for the knight on c3.
3. **15. h5**: White carries on. Pawns are cheap, and the h-file is the target.
4. **15... b4**: The pawn attacks the knight on c3.
5. **16. Nce2**: The knight steps back and still guards d4.
6. **16... Qa5**: Black's queen swings to the a-file, aimed at a2 and at the white king.

```
  8  . . . . . r k .
  7  p . . b p p b p
  6  . . . p . n p .
  5  q . . . . . . P
  4  . p r N P . P .
  3  . . . . B P . .
  2  P P P Q N . . .
  1  . . K R . . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 5rk1/p2bppbp/3p1np1/q6P/1prNP1P1/4BP2/PPPQN3/2KR3R w - - 2 17
```

Drawn on the board: arrows g2-g4, h4-h5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] g4 and h5 are the engine's two best moves, within 40 centipawns of each other (depth 16).
- [attackers] After g4 the pawn on g4 attacks h5.

### Step 21: item

**Task `IOD-LODDRAGON2-6`** (find_move, difficulty cue 2)

White to move. The h-pawn will advance. Find the move that makes its advance safe.

```
  8  . . . q . r k .
  7  p p . b p p b p
  6  . . . p . n p .
  5  . . . . . . . .
  4  . . r N P . . P
  3  . . N . B P . .
  2  P P P Q . . P .
  1  . . K R . . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 3q1rk1/pp1bppbp/3p1np1/8/2rNP2P/2N1BP2/PPPQ2P1/2KR3R w - - 0 14
```

**Accepted answer(s):** g4

Feedback shown for wrong moves:
- Kb1: Kb1 is a sensible king move, yet the engine rates it at least 30 centipawns below g4 in this position.

**Explanation shown:** g4 is among the engine's two best moves at depth 16, and it guards h5 before the h-pawn advances. Pushing the h-pawn at once is also close in score, but then the knight can simply take it.

Hints (in order):
1. Which pawn could guard h5 before the h-pawn gets there?
2. The pawn on g2 can step forward two squares.
3. g4.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] g4 and h5 are the engine's two best moves, within 40 centipawns of each other (depth 16).
- [attackers] After g4 the pawn on g4 attacks h5.
- [move_loses] Kb1 is at least 30 centipawns worse than g4 (depth 16).

### Step 22: board

Caption: White to move. The pawn on h5 attacks g6, so hxg6 looks like the break. Predict whether it works now, then step through what the engine expects.

```
  8  . . . . . r k .
  7  p . . b p p b p
  6  . . . p . n p .
  5  q . . . . . . P
  4  . p r N P . P .
  3  . . . . B P . .
  2  P P P Q N . . .
  1  . . K R . . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 5rk1/p2bppbp/3p1np1/q6P/1prNP1P1/4BP2/PPPQN3/2KR3R w - - 2 17
```

The line, with the sentence the learner sees at each move:
1. **17. hxg6**: White captures at once, before the king has left the c1 square.
2. **17... Qxa2**: Black's queen takes a2, right next to the white king.
3. **18. gxf7+**: White takes a pawn with check.
4. **18... Rxf7**: The rook recaptures.
5. **19. Qd3**: White's queen comes to d3 and covers the first rank.
6. **19... e5**: Black's pawn attacks the knight on d4.

```
  8  . . . . . . k .
  7  p . . b . r b p
  6  . . . p . n . .
  5  . . . . p . . .
  4  . p r N P . P .
  3  . . . Q B P . .
  2  q P P . N . . .
  1  . . K R . . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 6k1/p2b1rbp/3p1n2/4p3/1prNP1P1/3QBP2/qPP1N3/2KR3R w - - 0 20
```

Drawn on the board: arrows h5-g6.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [move_loses] hxg6 is at least 80 centipawns worse than the best move (depth 16).
- [best_move_in] Kb1 is the engine's top move (depth 16).
- [legal_move] The capture on g6 is legal.

### Step 23: card

**The break that comes too early.** The h-pawn lever is not a command. Here the capture on g6 opens the file but leaves the white king on c1 with a2 as a target, and the engine prefers a quiet king move first. [I] A rule of thumb: before you open a file, make sure the king can stand the counter-blow.

### Step 24: board

Caption: Black to move. The rook already stands on c8, so the b-pawn lever has support. Step through one plausible continuation; it is not claimed as best play.

```
  8  . . r q r . k .
  7  p p . b p p b p
  6  . . . p . n p .
  5  . . . . n . . .
  4  . . . N P . P .
  3  . B N . B P . .
  2  P P P Q . . . P
  1  . K . R . . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: 2rqr1k1/pp1bppbp/3p1np1/4n3/3NP1P1/1BN1BP2/PPPQ3P/1K1R3R b - - 0 13
```

The line, with the sentence the learner sees at each move:
1. **13... b5**: The lever: the pawn heads for b4 to hit the knight on c3, with the rook on c8 behind the c-file.
2. **14. g5**: White kicks first: the knight on f6 must move or be captured.
3. **14... b4**: Black ignores the kick and attacks the knight on c3 instead.
4. **15. Na4**: The knight steps to a4, where Black can take it.
5. **15... Bxa4**: Black trades the bishop for it and removes a defender of e4 and d5.
6. **16. Bxa4**: White recaptures with the other bishop, which leaves b3.

```
  8  . . r q r . k .
  7  p . . . p p b p
  6  . . . p . n p .
  5  . . . . n . P .
  4  B p . N P . . .
  3  . . . . B P . .
  2  P P P Q . . . P
  1  . K . R . . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 2rqr1k1/p3ppbp/3p1np1/4n1P1/Bp1NP3/4BP2/PPPQ3P/1K1R3R b - - 0 16
```

Drawn on the board: arrows b7-b5, c8-c3.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] b5 is the engine's top move (depth 16).
- [piece_attacks] The knight on c3 attacks a2, a4, b1, b5, d1, d5, e2 and e4.
- [move_loses] The slow move a6 is at least 80 centipawns worse than b5 (depth 16).

### Step 25: board

Caption: Black to move after the exchanges of that one line. The pawn on g5 still attacks the knight on f6, and White is ahead by the engine's count. This shows one continuation, not what the lever achieves in general.

```
  8  . . r q r . k .
  7  p . . . p p b p
  6  . . . p . n p .
  5  . . . . n . P .
  4  B p . N P . . .
  3  . . . . B P . .
  2  P P P Q . . . P
  1  . K . R . . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: 2rqr1k1/p3ppbp/3p1np1/4n1P1/Bp1NP3/4BP2/PPPQ3P/1K1R3R b - - 0 16
```

Drawn on the board: highlighted squares f6, g5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [pawn_attackers] One white pawn (g5) attacks f6.
- [eval_range] White is ahead by at least 0.3 pawns by the engine's count (depth 16).

### Step 26: item

**Task `IOD-LODDRAGON2-7`** (find_move, difficulty cue 2)

Black to move. The rook stands on c8. Find the pawn lever that fits.

```
  1  R . . . R . K .
  2  P . . . Q P P P
  3  . . P B . N B .
  4  . P . P N . . .
  5  . . . n . . . .
  6  . p n . p . . .
  7  p b p p b . p p
  8  . k . r q r . .
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: 2rqr1k1/pp1bppbp/3p1np1/4n3/3NP1P1/1BN1BP2/PPPQ3P/1K1R3R b - - 0 13
```

**Accepted answer(s):** b5

Feedback shown for wrong moves:
- a6: a6 is quiet and loses a tempo: the engine rates it at least 80 centipawns below b5.
- d5: d5 does not fit this position: the engine rates it at least 80 centipawns below b5.

**Explanation shown:** b5 is the engine's top move at depth 16. A quiet a6 or an early d5 each score at least 80 centipawns lower.

Hints (in order):
1. Which pawn can attack the knight on c3 in two moves?
2. The b-pawn, once the bishop on d7 defends b5.
3. b5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] b5 is the engine's top move (depth 16).
- [move_loses] a6 is at least 80 centipawns worse than b5 (depth 16).
- [move_loses] d5 is at least 80 centipawns worse than b5 (depth 16).

### Step 27: board

Caption: Black to move, already somewhat worse [I]. The sacrifice is a try when worse, not a recommendation: one of three near moves gives up a rook for the knight. Step through it, then read what the claim does and does not say.

```
  8  . . r q r . k .
  7  p p . b p p b .
  6  . . . p . n p .
  5  . . . . n . . p
  4  . . . N P . P P
  3  . B N . B P . .
  2  P P P Q . . . .
  1  . K . R . . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: 2rqr1k1/pp1bppb1/3p1np1/4n2p/3NP1PP/1BN1BP2/PPPQ4/1K1R3R b - - 0 14
```

The line, with the sentence the learner sees at each move:
1. **14... Rxc3**: The exchange sacrifice: the rook takes the knight that holds e4 and d5 together.
2. **15. Qxc3**: White takes the rook; the queen is pulled away from the defence of the king.
3. **15... hxg4**: Black collects a pawn and the h-pawn leaves the h-file.
4. **16. h5**: White offers the h-pawn to open the file.
5. **16... Nxh5**: Black takes it.
6. **17. f4**: The f-pawn attacks the knight on e5.

```
  8  . . . q r . k .
  7  p p . b p p b .
  6  . . . p . . p .
  5  . . . . n . . n
  4  . . . N P P p .
  3  . B Q . B . . .
  2  P P P . . . . .
  1  . K . R . . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 3qr1k1/pp1bppb1/3p2p1/4n2n/3NPPp1/1BQ1B3/PPP5/1K1R3R b - - 0 17
```

Drawn on the board: arrows c8-c3.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] Nc4, hxg4 and Rxc3 are all within 80 centipawns of the engine's top move (depth 16).
- [pawn_attackers] After f4 one white pawn attacks e5.

### Step 28: board

Caption: A different move order, with a pawn on b3 and the bishop on e3. A non-pawn idea on the same file: the queen lines up with the white queen behind the c3 knight. One try; White's reply shown is not claimed as best.

```
  8  . . r q . r k .
  7  p p . b p p b .
  6  . . . p . n p .
  5  . . . . . . . p
  4  . . . N P . P P
  3  . P N . B P . .
  2  P . P Q . . . .
  1  . K . R . . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: 2rq1rk1/pp1bppb1/3p1np1/7p/3NP1PP/1PN1BP2/P1PQ4/1K1R3R b - - 0 16
```

The line, with the sentence the learner sees at each move:
1. **16... Qa5**: The queen lines up with White's queen behind the knight on c3.
2. **17. Nd5**: White unblocks with a threat of its own.
3. **17... Qxd2**: Black takes the queen.
4. **18. Nxe7+**: The knight takes a pawn with check.
5. **18... Kh7**: The king steps aside.
6. **19. Rxd2**: White's rook takes back on d2.

```
  8  . . r . . r . .
  7  p p . b N p b k
  6  . . . p . n p .
  5  . . . . . . . p
  4  . . . N P . P P
  3  . P . . B P . .
  2  P . P R . . . .
  1  . K . . . . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 2r2r2/pp1bNpbk/3p1np1/7p/3NP1PP/1P2BP2/P1PR4/1K5R b - - 0 19
```

Drawn on the board: arrows d8-a5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] Rxc3 and Qa5 are both within 100 centipawns of the engine's top move (depth 16), and the top move is one of them.

### Step 29: board

Caption: White to move. The bishop can trade itself for Black's key piece on the hole at h6. Step through the idea; the engine counts it among White's best moves.

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
1. **13. Bh6**: The bishop lands on h6, the hole: no black pawn can ever chase it away.
2. **13... Qa5**: Black counterattacks along the a-file toward a2 and the white king.
3. **14. Bxg7**: White trades the bishop on g7, which covers the dark squares next to Black's king.
4. **14... Kxg7**: The king recaptures and is now the only black piece that guards h6.
5. **15. Rhe1**: White brings the second rook toward the centre.
6. **15... Nc4**: Black's knight jumps to c4, attacking the queen on d2.

```
  8  . . r . . r . .
  7  p p . b p p k .
  6  . . . p . n p .
  5  q . . . . . . p
  4  . . n N P . . P
  3  . B N . . P . .
  2  P P P Q . . P .
  1  . . K R R . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 2r2r2/pp1bppk1/3p1np1/q6p/2nNP2P/1BN2P2/PPPQ2P1/2KRR3 w - - 2 16
```

Drawn on the board: arrows e3-h6.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [holes] h6 is a hole in Black's camp: no black pawn guards it now or can guard it later.
- [best_move_in] Bh6, Kb1 and Bg5 are all within 40 centipawns of the engine's top move (depth 16).

### Step 30: card

**Why the h-pawn lever works.** [H] I think it works less because the black king is weak than because h6 is a hole: no black pawn can ever guard it, so a white bishop can land there and a rook can follow down the opened file. Test it before you push: does the hole exist, and does a black piece or pawn block the file?

### Step 31: contrast

Title: Does ...d5 lose ground?

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

### Step 32: board

Caption: The look-alike that fails: the same lever with the bishop on d7 instead of c8. White simply takes the pawn, and the engine counts a pawn or more by the end of the line.

```
  8  r . . q . r k .
  7  p p . b p p b p
  6  . . n p . n p .
  5  . . . . . . . .
  4  . . . N P . . .
  3  . . N . B P . .
  2  P P P Q . . P P
  1  . . K R . B . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: r2q1rk1/pp1bppbp/2np1np1/8/3NP3/2N1BP2/PPPQ2PP/2KR1B1R b - - 4 9
```

The line, with the sentence the learner sees at each move:
1. **9... d5**: The same lever, but the bishop now stands on d7.
2. **10. Nxd5**: White takes the pawn with the knight, which now attacks f6 and c7.
3. **10... e6**: Black attacks the knight.
4. **11. Nxf6+**: The knight takes with check.
5. **11... Qxf6**: The queen recaptures.
6. **12. c3**: White defends the knight on d4 with a pawn.

```
  8  r . . . . r k .
  7  p p . b . p b p
  6  . . n . p q p .
  5  . . . . . . . .
  4  . . . N P . . .
  3  . . P . B P . .
  2  P P . Q . . P P
  1  . . K R . B . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r4rk1/pp1b1pbp/2n1pqp1/8/3NP3/2P1BP2/PP1Q2PP/2KR1B1R b - - 0 12
```

Drawn on the board: arrows d6-d5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [move_loses] d5 is at least 100 centipawns worse than the best move (depth 16).
- [piece_on] A black bishop stands on d7.

### Step 33: contrast

Title: Does ...b5 lose ground?

Prompt: Same lever, one piece moved. Predict whether ...b5 still works, then check.

**The working board:**

**Task `IOD-LODDRAGON2-12`** (predict_outcome, difficulty cue 2)

Black is considering ...b5. Does it lose ground, meaning it scores at least 80 centipawns worse than the engine's best move?

```
  1  R . . . R . K .
  2  P . . . Q P P P
  3  . . P B . N B .
  4  . P . P N . . .
  5  . . . n . . . .
  6  . p n . p . . .
  7  p b p p b . p p
  8  . k . r q r . .
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: 2rqr1k1/pp1bppbp/3p1np1/4n3/3NP1P1/1BN1BP2/PPPQ3P/1K1R3R b - - 0 13
```

**Accepted answer:** {"outcome": "no, it does not lose ground"}

**Explanation shown:** The pawn on b5 is defended by the bishop on d7 and b5 is the engine's top move at depth 16.

Hints (in order):
1. Look at which black piece defends the square b5.
2. The bishop on d7 looks along the diagonal to b5.
3. No: here b5 is the engine's top move.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] b5 is the engine's top move (depth 16).
- [attackers] After b5 one black piece defends the pawn on b5.
- [piece_on] A black bishop stands on d7.

**The failing board:**

**Task `IOD-LODDRAGON2-13`** (predict_outcome, difficulty cue 2)

Black is considering ...b5. Does it lose ground, meaning it scores at least 80 centipawns worse than the engine's best move?

```
  1  R . . . R . K .
  2  P . . . Q P P P
  3  . . P B . N B .
  4  . P . P N . . .
  5  . . . n . . . .
  6  . p n b p . . .
  7  p b p p . . p p
  8  . k . r q r . .
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: 2rqr1k1/pp2ppbp/3pbnp1/4n3/3NP1P1/1BN1BP2/PPPQ3P/1K1R3R b - - 0 13
```

**Accepted answer:** {"outcome": "yes, it loses ground"}

**Explanation shown:** With the bishop on e6 nothing defends the pawn on b5, and b5 scores at least 80 centipawns below the best move at depth 16.

Hints (in order):
1. Compare with the previous position: where is the bishop?
2. The bishop on e6 no longer looks at b5.
3. Yes: with the bishop on e6, b5 loses ground.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [move_loses] b5 is at least 80 centipawns worse than the best move (depth 16).
- [attackers] After b5 no black piece defends the pawn on b5.
- [piece_on] A black bishop stands on e6.

**The irrelevant board:**

**Task `IOD-LODDRAGON2-14`** (predict_outcome, difficulty cue 2)

Black is considering ...b5. Does it lose ground, meaning it scores at least 80 centipawns worse than the engine's best move?

```
  1  R . . . R . K .
  2  P . . . Q P P P
  3  . . P B . N B .
  4  . P . P N . . .
  5  . . . n . . . .
  6  . p n . p . . .
  7  p b p p b . p p
  8  . k r . q r . .
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: 2rq1rk1/pp1bppbp/3p1np1/4n3/3NP1P1/1BN1BP2/PPPQ3P/1K1R3R b - - 0 13
```

**Accepted answer:** {"outcome": "no, it does not lose ground"}

**Explanation shown:** Moving the rook from e8 to f8 makes no difference: the bishop on d7 still defends b5 and b5 is the engine's top move at depth 16.

Hints (in order):
1. Compare with the first position: only a rook has moved.
2. The rook moved from e8 to f8; the bishop still defends b5.
3. No: the rook's square does not matter here.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] b5 is the engine's top move (depth 16).
- [piece_on] A black rook stands on f8.
- [piece_on] A black bishop stands on d7.

## Chapter: Plans for both sides

### Step 34: card

**Black's plans, and what must be true.** Put a rook on the half-open c-file, then pick a lever. The boards showed: the d-pawn lever needs d5 defended enough, and the b-pawn lever needs its pawn defended after the push (here by the bishop on d7). [I] A rook behind the lever probably helps; not tested. [H] The a-pawn lever wants a piece to hit; not tested. A quiet move at the wrong moment can lose the race.

### Step 35: board

Caption: A typical Black set-up: rook on c8, knight on e5, bishop on d7, queen on d8. The pieces are ready; White has just played the king move.

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

Drawn on the board: arrows c8-c2; highlighted squares c8, e5, d7.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [piece_on] A black rook stands on c8.
- [piece_on] A black knight stands on e5.
- [piece_on] The white king stands on b1.

### Step 36: item

**Task `IOD-LODDRAGON2-8`** (classify_position, difficulty cue 2)

Black to move. Which plan fits this position best?

```
  1  R . . . R . K .
  2  P . . . Q P P P
  3  . . P B . N B .
  4  . P . P N . . .
  5  . . . n . . . .
  6  . p n . p . . .
  7  p b p p b . p p
  8  . k . r q r . .
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: 2rqr1k1/pp1bppbp/3p1np1/4n3/3NP1P1/1BN1BP2/PPPQ3P/1K1R3R b - - 0 13
```

**Accepted answer:** {"class": "the b-pawn lever"}

**Explanation shown:** The engine's top move is b5; the d-pawn push and a quiet a6 are each at least 80 centipawns worse.

Hints (in order):
1. Is the rook on c8 doing anything yet?
2. A lever that uses the rook on c8 is ready.
3. The b-pawn lever.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] b5 is the engine's top move (depth 16).
- [move_loses] d5 is at least 80 centipawns worse (depth 16).
- [move_loses] a6 is at least 80 centipawns worse (depth 16).

### Step 37: board

Caption: Black's plan in action: trade White's attacking bishop, keep the rook on the c-file, and meet the pawn storm with the b-pawn lever.

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
1. **12... Nc4**: The knight lands on c4, attacking the queen on d2 and the bishop on e3.
2. **13. Bxc4**: White takes the knight with the bishop from b3.
3. **13... Rxc4**: The rook recaptures and stands on the c-file in front of the c2 pawn.
4. **14. g4**: White's g-pawn advances: the race has begun.
5. **14... b5**: Black's lever comes with the rook already on the c-file.
6. **15. h4**: The h-pawn follows.

```
  8  . . . q . r k .
  7  p . . b p p b p
  6  . . . p . n p .
  5  . p . . . . . .
  4  . . r N P . P P
  3  . . N . B P . .
  2  P P P Q . . . .
  1  . K . R . . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 3q1rk1/p2bppbp/3p1np1/1p6/2rNP1PP/2N1BP2/PPPQ4/1K1R3R b - - 0 15
```

Drawn on the board: arrows e5-c4.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [attackers] After Nc4 one black piece attacks the queen on d2.
- [attackers] After Nc4 one black piece attacks the bishop on e3.
- [best_move_in] a6, Re8 and Nc4 are all within 60 centipawns of the top move (depth 16).

### Step 38: card

**White's plans, and what must be true.** Tuck the king away on b1, then use the g- and h-pawns together, or trade the dark-squared bishop on h6. The plan needs the king safe, the queen on d2 and a knight on d4 to cover. Do not wait: a quiet move when the lever is ready gives Black time.

### Step 39: board

Caption: A typical White set-up: king on b1, queen on d2, bishop on e3, rooks on d1 and h1, pawns on h4 and f3. The move g4 is ready.

```
  8  . . r q r . k .
  7  p p . b p p b .
  6  . . . p . n p .
  5  . . . . n . . p
  4  . . . N P . . P
  3  . B N . B P . .
  2  P P P Q . . P .
  1  . K . R . . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 2rqr1k1/pp1bppb1/3p1np1/4n2p/3NP2P/1BN1BP2/PPPQ2P1/1K1R3R w - - 0 14
```

Drawn on the board: arrows g2-g4; highlighted squares b1, d2, h4, g2.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [piece_on] The white king stands on b1.
- [piece_on] The white queen stands on d2.
- [piece_on] A white pawn stands on h4.

### Step 40: item

**Task `IOD-LODDRAGON2-9`** (classify_position, difficulty cue 2)

White to move. Which plan fits this position best?

```
  8  . . r q r . k .
  7  p p . b p p b .
  6  . . . p . n p .
  5  . . . . n . . p
  4  . . . N P . . P
  3  . B N . B P . .
  2  P P P Q . . P .
  1  . K . R . . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 2rqr1k1/pp1bppb1/3p1np1/4n2p/3NP2P/1BN1BP2/PPPQ2P1/1K1R3R w - - 0 14
```

**Accepted answer:** {"class": "the g-pawn lever"}

**Explanation shown:** The pawn lever g4 is one of the engine's two best moves at depth 16; the quiet a3 is at least 30 centipawns worse.

Hints (in order):
1. Is the king already safe on b1?
2. Which pawn lever is still available now that the h-pawn is blocked?
3. The g-pawn lever.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] g4 and Bh6 are the engine's two best moves, within 40 centipawns (depth 16).
- [move_loses] a3 is at least 30 centipawns worse than the best move (depth 16).

### Step 41: board

Caption: White's plan in action: first the king, off the half-open c-file, then the g-pawn. The same knight trade appears, because it suits Black's plan too.

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
1. **12. Kb1**: The king leaves c1, which stands on the half-open c-file.
2. **12... Nc4**: Black's knight jumps in, attacking the queen on d2.
3. **13. Bxc4**: White trades the bishop for it.
4. **13... Rxc4**: The rook recaptures.
5. **14. g4**: The g-pawn starts the pawn storm.
6. **14... b5**: Black launches its own lever.

```
  8  . . . q . r k .
  7  p . . b p p b p
  6  . . . p . n p .
  5  . p . . . . . .
  4  . . r N P . P .
  3  . . N . B P . .
  2  P P P Q . . . P
  1  . K . R . . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 3q1rk1/p2bppbp/3p1np1/1p6/2rNP1P1/2N1BP2/PPPQ3P/1K1R3R w - - 0 15
```

Drawn on the board: arrows c1-b1.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] Kb1 is the engine's top move (depth 16).
- [piece_on] The white king stands on c1.
- [open_files] The c-file is half-open for Black and the d-file is half-open for White.

### Step 42: board

Caption: The Classical set-up: both kings castled on the same wing, and a similar skeleton, but White's f-pawn is on f4. Black to move. Three different moves are within 0.4 of a pawn of the best, so there is no single lever to find.

```
  8  r . . q . r k .
  7  p p . . p p b p
  6  . . n p b n p .
  5  . . . . . . . .
  4  . . . . P P . .
  3  . N N . B . . .
  2  P P P . B . P P
  1  R . . Q . R K .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: r2q1rk1/pp2ppbp/2npbnp1/8/4PP2/1NN1B3/PPP1B1PP/R2Q1RK1 b - - 0 10
```

Drawn on the board: highlighted squares a7, b7, c8.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [king_wing] White's king is on the kingside.
- [king_wing] Black's king is on the kingside.
- [open_files] The c-file is half-open for Black and the d-file is half-open for White, as in the Yugoslav.
- [best_move_in] Rc8, a6 and b5 are all within 40 centipawns of the engine's top move (depth 16).

### Step 43: board

Caption: The a-pawn lever in the Classical set-up: it hits the knight on b3 and, after the trade, opens the c-file for both sides.

```
  8  r . . q . r k .
  7  p p . . p p b p
  6  . . n p b n p .
  5  . . . . . . . .
  4  . . . . P P . .
  3  . N N . B . . .
  2  P P P . B . P P
  1  R . . Q . R K .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: r2q1rk1/pp2ppbp/2npbnp1/8/4PP2/1NN1B3/PPP1B1PP/R2Q1RK1 b - - 0 10
```

The line, with the sentence the learner sees at each move:
1. **10... a5**: The a-pawn lever: it threatens to chase the knight from b3.
2. **11. a4**: White meets it and takes the b5 square.
3. **11... Bxb3**: Black trades the bishop for the knight before it can retreat.
4. **12. cxb3**: White recaptures with the c-pawn: the c-file is now open for both rooks.
5. **12... e6**: Black prepares ...d5.
6. **13. Rc1**: White's rook takes the open file at once.

```
  8  r . . q . r k .
  7  . p . . . p b p
  6  . . n p p n p .
  5  p . . . . . . .
  4  P . . . P P . .
  3  . P N . B . . .
  2  . P . . B . P P
  1  . . R Q . R K .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r2q1rk1/1p3pbp/2nppnp1/p7/P3PP2/1PN1B3/1P2B1PP/2RQ1RK1 b - - 1 13
```

Drawn on the board: arrows a7-a5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [open_files] After the trade on b3 the c-file is open.
- [legal_move] The a-pawn can advance.

### Step 44: reflect

Kind: unsure

Prompt: A similar skeleton, but both kings are on one wing. Which lever do you doubt here, and why? [I] This is a guess: the engine did not rank these levers in this position.

- Field "A lever that lost its point:" with options: White's h-pawn storm / Black's ...b5 / Black's ...d5; no single correct answer (a guess or a self-report)

- Field "Because:" (free text)

### Step 45: board

Caption: White's chain runs e4, f3, g2: the head is e4 and the base is g2. Nimzowitsch advised attacking the base of a chain, not its head (My System), a long-term siege that matters most in endgames. [I] In the Dragon the ...d5 lever hits the head, and that attack is the faster one. White's pawn on h4 starts the lever and keeps the black h-pawn from marching down to the base.

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

Drawn on the board: highlighted squares e4, f3, g2, h4, h5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [pawn_set] White's chain has its base on g2.
- [legal_destinations] Black's pawn on h5 cannot move: the white pawn on h4 blocks it.

### Step 46: board

Caption: Masters (both 2500+, 2012 to 2026, our own file): from here White played the king move in 30 games (14 White wins, 15 draws, 1 Black win) and the h-pawn move in 11 (White 1, draws 7, Black 3). Small samples; the count shows a choice, not a verdict.

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

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [king_wing] White's king is on the queenside.
- [king_wing] Black's king is on the kingside.

### Step 47: reflect

Kind: expect

Prompt: In those 30 games White won 14 and Black won 1. Does that show the king move is stronger than the h-pawn move?

- Field "My answer:" with options: yes: 14 wins to 1 shows it is stronger / no: the samples are small and differ / only if the two samples were the same size; no single correct answer (a guess or a self-report)

## Chapter: Test yourself

### Step 48: item  (shown without telling the learner the topic: unlabeled test)

**Task `IOD-LODDRAGON2-5`** (find_move, difficulty cue 3)

Black to move. Find the engine's best move (depth 16).

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

**Explanation shown:** d5 is the engine's top move at depth 16.

Hints (in order):
1. Look for a pawn move that attacks a white pawn.
2. The pawn on d6 can attack e4.
3. d5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] d5 is the engine's top move (depth 16).

### Step 49: item  (shown without telling the learner the topic: unlabeled test)

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

### Step 50: item  (shown without telling the learner the topic: unlabeled test)

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

### Step 51: item  (shown without telling the learner the topic: unlabeled test)

**Task `IOD-LODDRAGON2-11`** (find_move, difficulty cue 3)

Black to move. Find one of the moves within 80 centipawns of the engine's top move (depth 16).

```
  1  R . . . R . K .
  2  . . . . Q P P P
  3  . . P B . N B .
  4  P P . P N . . .
  5  p . . n . . . .
  6  . p n . p . . .
  7  . b p p b . p p
  8  . k . r q r . .
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: 2rqr1k1/pp1bppb1/3p1np1/4n2p/3NP1PP/1BN1BP2/PPPQ4/1K1R3R b - - 0 14
```

**Accepted answer(s):** Nc4, hxg4, Rxc3

**Explanation shown:** Nc4, hxg4 and Rxc3 are each within 80 centipawns of the engine's top move at depth 16.

Hints (in order):
1. Ask which of Black's pieces and pawns could change the position now.
2. Look for a capture, a jump into the centre and a trade on the c-file.
3. Nc4, hxg4 or Rxc3.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] Nc4, hxg4 and Rxc3 are all within 80 centipawns of the top move (depth 16).

### Step 52: board

Caption: Black to move, one move after the king stepped to b1. [I] A quiet move is not passive: it prepares a lever for later. Which of Black's pieces is not yet doing a job?

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

Drawn on the board: highlighted squares a6, c4.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] a6, Re8 and Nc4 are within 60 centipawns of the engine's top move (depth 16).

### Step 53: item  (shown without telling the learner the topic: unlabeled test)

**Task `IOD-LODDRAGON2-15`** (find_move, difficulty cue 3)

Black to move. Find one of the moves within 60 centipawns of the engine's top move (depth 16).

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

**Accepted answer(s):** a6, Re8, Nc4

**Explanation shown:** a6, Re8 and Nc4 are each within 60 centipawns of the engine's top move at depth 16.

Hints (in order):
1. No pawn lever is clearly ahead. Which pieces can still improve?
2. Ask which pieces are not yet doing a job.
3. a6, Re8 or Nc4.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] a6, Re8 and Nc4 are within 60 centipawns of the top move (depth 16).

### Step 54: card

**Slow moves the engine punishes.** Black plays a quiet move where a lever was ready. White plays a quiet move where the g-pawn was ready. [I] Calling these typical is our inference from our own engine runs at depth 16 on these constructed positions, not from master statistics; the a3 case is only a small loss.

### Step 55: board

Caption: Black to move. The quiet move a6 looks harmless. Step through what the engine expects.

```
  8  . . r q r . k .
  7  p p . b p p b p
  6  . . . p . n p .
  5  . . . . n . . .
  4  . . . N P . P .
  3  . B N . B P . .
  2  P P P Q . . . P
  1  . K . R . . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: 2rqr1k1/pp1bppbp/3p1np1/4n3/3NP1P1/1BN1BP2/PPPQ3P/1K1R3R b - - 0 13
```

The line, with the sentence the learner sees at each move:
1. **13... a6**: A quiet move: it prepares the b-pawn but gives White a free move.
2. **14. h4**: White accelerates: the h-pawn starts the march while Black's lever is still unprepared.
3. **14... Nc4**: Black trades off the bishop on b3.
4. **15. Bxc4**: White takes.
5. **15... Rxc4**: The rook recaptures.
6. **16. h5**: The h-pawn is already on h5 and the file is about to open.

```
  8  . . . q r . k .
  7  . p . b p p b p
  6  p . . p . n p .
  5  . . . . . . . P
  4  . . r N P . P .
  3  . . N . B P . .
  2  P P P Q . . . .
  1  . K . R . . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 3qr1k1/1p1bppbp/p2p1np1/7P/2rNP1P1/2N1BP2/PPPQ4/1K1R3R b - - 0 16
```

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [move_loses] a6 is at least 80 centipawns worse than the best move (depth 16).
- [best_move_in] b5 is the engine's top move (depth 16).

### Step 56: board

Caption: White to move. The quiet move a3 looks careful. Step through what the engine expects.

```
  8  . . r q r . k .
  7  p p . b p p b .
  6  . . . p . n p .
  5  . . . . n . . p
  4  . . . N P . . P
  3  . B N . B P . .
  2  P P P Q . . P .
  1  . K . R . . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 2rqr1k1/pp1bppb1/3p1np1/4n2p/3NP2P/1BN1BP2/PPPQ2P1/1K1R3R w - - 0 14
```

The line, with the sentence the learner sees at each move:
1. **14. a3**: A careful move: it stops a black pawn from using b4, but it does not advance the attack.
2. **14... Nc4**: Black's knight jumps to c4, attacking the queen on d2.
3. **15. Bxc4**: White trades the bishop for the knight.
4. **15... Rxc4**: The rook recaptures on the half-open c-file.
5. **16. Nb3**: The knight retreats to b3.
6. **16... b6**: Black answers with a quiet move of its own.

```
  8  . . . q r . k .
  7  p . . b p p b .
  6  . p . p . n p .
  5  . . . . . . . p
  4  . . r . P . . P
  3  P N N . B P . .
  2  . P P Q . . P .
  1  . K . R . . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 3qr1k1/p2bppb1/1p1p1np1/7p/2r1P2P/PNN1BP2/1PPQ2P1/1K1R3R w - - 0 17
```

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [move_loses] a3 is at least 30 centipawns worse than the best move (depth 16).
- [best_move_in] Bh6 and g4 are the engine's top two moves, within 40 centipawns (depth 16).

### Step 57: item

**Task `IODdragon-3`** (find_move, difficulty cue 2)

White to move. The kings stand on opposite wings. Find a move that starts the h-pawn advance or makes White's king safer.

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

**Accepted answer(s):** h4, Kb1, h3

Feedback shown for wrong moves:
- g4: g4 is rated at least 100 centipawns worse than the best move here (depth 16).

**Explanation shown:** Kb1, h3 and h4 each score within 60 centipawns of the engine's top move at depth 16. 12.g4 scores at least 100 centipawns below the best move.

Hints (in order):
1. Two pawn moves on the h-file start the advance; the king also has a quieter square.
2. h3 or h4 starts the h-pawn advance; Kb1 steps off the c-file.
3. h3, h4 or Kb1.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] Kb1, h3 and h4 are within 60 cp of the engine's top move (depth 16).
- [move_loses] g4 is at least 100 cp worse than the engine's best move (depth 16).
- [king_wing] White's king is on the queenside.

### Step 58: item

**Task `IOD-LODDRAGON2-10`** (find_move, difficulty cue 3)

White to move. Find one of the engine's two best moves (depth 16).

```
  8  . . r q r . k .
  7  p p . b p p b .
  6  . . . p . n p .
  5  . . . . n . . p
  4  . . . N P . . P
  3  . B N . B P . .
  2  P P P Q . . P .
  1  . K . R . . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 2rqr1k1/pp1bppb1/3p1np1/4n2p/3NP2P/1BN1BP2/PPPQ2P1/1K1R3R w - - 0 14
```

**Accepted answer(s):** g4, Bh6

Feedback shown for wrong moves:
- a3: a3 is careful but slow: the engine rates it at least 30 centipawns below the best moves.

**Explanation shown:** g4 and Bh6 are the engine's two best moves at depth 16; a quiet a3 scores at least 30 centipawns lower.

Hints (in order):
1. Both kings are castled on opposite wings: speed matters.
2. Think about which plans help the attack, not only which move is safe.
3. g4 or Bh6.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] g4 and Bh6 are the engine's two best moves, within 40 centipawns (depth 16).
- [move_loses] a3 is at least 30 centipawns worse than the best move (depth 16).

## Chapter: Teach it back

### Step 59: reflect

Kind: unsure

Prompt: Teach it back. Write four sentences for a beginner who knows how the pieces move: (1) what a pawn lever is, (2) when it works, (3) one example they could set up on a board, (4) one warning. Then go back to your first guess and ask it again: whose attack is faster, and by how many moves?

- Field "The idea:" (free text)

- Field "When it works:" (free text)

- Field "An example:" (free text)

- Field "A warning:" (free text)

### Step 60: card

**Self-check.** Did you say when the lever works? When it fails? Did you give an example a beginner could set up on a board? Did you name one mistake? Nothing here is graded by the app. If you can answer all four, you can teach this part of the Dragon.

### Step 61: card

**What to remember.**
The pawns last; the pieces move around them.
Black's c-file and White's d-file are half-open because a pawn was traded.
Black's levers: d, b, a. White's levers: h, g.
A lever needs support: the pushed pawn defended, the king safe.
With opposite kings pawns are cheap, but a quiet move can cost a pawn.
[I] With both kings on one wing the plans change.

### Step 62: practice

A drill of 6 tasks drawn from the bank by tag ['theme.dragon'] (171 tasks carry those tags). Not reproduced here; ask for a sample if you want one checked.

---

## Reviewer scorecard

Fill in the file `content/review/L-OD-DRAGON-2.json` (a template is below). Scale 1 to 5 for each dimension: 1 = wrong or unusable, 3 = acceptable with edits, 5 = I would put my name to it as it stands.
Revision to review: `e62aa2f9`. If the lesson text changes after your review, your sign-off no longer applies and the lesson goes back to needs-human.

| Dimension | What to judge | Score |
|---|---|---|
| chess | every statement, line and explanation is correct; near-misses are really near-misses | |
| clarity | the explanation actually explains (mechanism, conditions), in plain words | |
| prerequisites | the lesson assumes only what the learner has met | |
| tasks | each task has one defensible answer and a fair explanation | |

```json
{
  "lesson": "L-OD-DRAGON-2",
  "revision": "e62aa2f9",
  "reviewer": "<your name>",
  "reviewer_role": "strong-player",
  "date": "YYYY-MM-DD",
  "scores": {"chess": 0, "clarity": 0, "prerequisites": 0, "tasks": 0},
  "comments": "<what to change, by step number>",
  "verdict": "approved"
}
```

`reviewer_role` is `strong-player` or `teacher`. `verdict` is `approved` or `changes-requested`. See docs/review-slice.md.
