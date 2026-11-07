# Review packet: L-OD-DRAGON-1

**Why the Dragon exists: ...g6, the bishop on g7 and the pawn on d6**

- Skill: OPN.STRUCT (D2); stage: exemplar; stated length: 35 minutes
- Steps: 54 (11 are tasks); revision: `76d5f4a7`
- Review status now: needs-human

## What the lesson says the learner will be able to do

- Explains in own words why Black answers 5.Nc3 with ...g6: the long diagonal for the bishop, with the d6 pawn and the c-file as the setting that makes it work, and what ...g6 costs
- Predicts how far a bishop on g7 sees when the diagonal holds a knight, a pawn or nothing
- Steps through the first six moves and says what each is for
- Says why 6.e5 does not refute ...g6, and reads opening counts as results of games, not verdicts

## Sources the author names (check that they are used fairly, in our own words)

- app/public/masters/stats.json (329,379 games, both players 2500+, 2012-2026; row counts after 5...g6 quoted from the tree) [V]
- app/public/openings (Lichess standard rated games, CC0, September 2026, 4,752,291 games; nodes after 5.Nc3 and 5...g6, bands 1100-1300 and 2100+) [V]
- docs/citable-views.md 1.12 (Emanuel Lasker, Common Sense in Chess, Lecture 6: first moves leave lasting marks; used here only as an example) [V-sheet]
- docs/citable-views.md 2.1 and 2.5 (Capablanca on the central squares; the hypermodern school on control from afar) [V-sheet]/[S]
- docs/citable-views.md 8.4 (Capablanca, Chess Fundamentals: the bishop is usually stronger than the knight except in blocked positions) [V-sheet]
- content/items/lesson-od-l-od-dragon-1.json (positions replayed from the Dragon move sequence or one-feature edits with python-chess; engine claims at depth 16)

## How to read this packet

Boards are drawn with capitals for White and lower case for Black, rank 8 at the top unless the board is shown from Black's side. Moves in a line are in standard notation. Statements marked [V] were machine-checked, [I] inference, [H] hypothesis, [S] secondary source, [R] recalled. Please judge the explanations, not only the moves: does each sentence tell the learner why?

---

## Chapter: A first look

### Step 1: board

Caption: White to move after 5...g6. Black's dark-squared bishop is still on f8. Look along the long diagonal from h8 to a1. Where could the f8 bishop aim once it reaches g7, and what is in its way?

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

Drawn on the board: arrows h8-a1; highlighted squares f8, g7, d4, c3, b2, a1.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [piece_on] A black pawn stands on g6.
- [open_files] The c-file is half-open for Black and the d-file half-open for White.

### Step 2: reflect

Kind: expect

Prompt: Before reading on: once Black's bishop reaches g7, what do you think it aims at, and what stands in its way first?

- Field "My guess:" (free text)

### Step 3: card

**The question of this lesson.** Why does Black answer 5.Nc3 with ...g6, and what do the bishop on g7 and the pawn on d6 make possible for the whole game? By the end you will explain it in your own words and could teach it to a friend. Marks you will meet: [H] is a hypothesis (a guess worth testing), [I] an inference (reasoned, not proven), [V] checked here.

### Step 4: card

**Three ways to answer 5.Nc3.** [I] 5...a6 keeps every plan open and stops Bb5 and Nb5, but commits to nothing. 5...Nc6 develops and hits d4, but gives the c-pawn's file plan less clarity. 5...g6 prepares Bg7: a clear plan and a clear diagonal, at a price, shown on the next card. So the reason for ...g6 is the diagonal; the d6 pawn and the c-file are the setting in which it works.

### Step 5: reflect

Kind: expect

Prompt: Before the boards: which of the three answers to 5.Nc3 would you pick, and what do you think it gives up?

- Field "My pick and its price:" (free text)

### Step 6: card

**What ...g6 costs.** [I] Three prices. The light squares around the king (f6, h6) rely on the g7 bishop. The king depends on that one bishop, so trading it is White's regular plan. And the bishop needs time: ...a6 or ...Nc6 develop faster. [I] The gain, a strong long diagonal, outweighs these prices only while the diagonal stays open.

### Step 7: board

Caption: Position A (edited: the knight on f6 is removed so the diagonal is clear of Black's own pieces). White's pawn is on e4 and White's knight on d4. Predict: how far does the bishop on g7 see along the diagonal?

```
  8  r n b q k . . r
  7  p p . . p p b p
  6  . . . p . . p .
  5  . . . . . . . .
  4  . . . N P . . .
  3  . . N . B . . .
  2  P P P . . P P P
  1  R . . Q K B . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: rnbqk2r/pp2ppbp/3p2p1/8/3NP3/2N1B3/PPP2PPP/R2QKB1R w KQkq - 0 7
```

Drawn on the board: arrows g7-a1; highlighted squares g7.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [piece_attacks] The bishop on g7 attacks exactly these squares.

### Step 8: item

**Task `IOD-LODDRAGON1-1`** (select_squares, difficulty cue 2)

Tap every square the black bishop on g7 attacks (squares holding its own pieces count).

```
  8  r n b q k . . r
  7  p p . . p p b p
  6  . . . p . . p .
  5  . . . . . . . .
  4  . . . N P . . .
  3  . . N . B . . .
  2  P P P . . P P P
  1  R . . Q K B . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: rnbqk2r/pp2ppbp/3p2p1/8/3NP3/2N1B3/PPP2PPP/R2QKB1R w KQkq - 0 7
```

**Accepted answer:** squares d4, e5, f6, f8, h6, h8

**Explanation shown:** The bishop attacks along the diagonal until the first piece: here White's knight on d4. It also covers f8, h6 and h8.

Hints (in order):
1. The diagonal toward White's side starts at f6.
2. Stop at the first piece you meet, enemy or own, and include that square.
3. f6, e5 and d4 on the long diagonal, plus h8, f8 and h6.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [piece_attacks] The piece on g7 attacks exactly these squares.

### Step 9: board

Caption: Position B (edited): same as A, but White's e-pawn has advanced to e5; the knight still stands on d4, behind the pawn. Predict first: shorter or longer than position A?

```
  8  r n b q k . . r
  7  p p . . p p b p
  6  . . . p . . p .
  5  . . . . P . . .
  4  . . . N . . . .
  3  . . N . B . . .
  2  P P P . . P P P
  1  R . . Q K B . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: rnbqk2r/pp2ppbp/3p2p1/4P3/3N4/2N1B3/PPP2PPP/R2QKB1R w KQkq - 0 7
```

Drawn on the board: arrows g7-e5; highlighted squares e5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [piece_attacks] The bishop on g7 attacks exactly these squares.

### Step 10: item

**Task `IOD-LODDRAGON1-2`** (select_squares, difficulty cue 2)

Tap every square the black bishop on g7 attacks in position B.

```
  8  r n b q k . . r
  7  p p . . p p b p
  6  . . . p . . p .
  5  . . . . P . . .
  4  . . . N . . . .
  3  . . N . B . . .
  2  P P P . . P P P
  1  R . . Q K B . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: rnbqk2r/pp2ppbp/3p2p1/4P3/3N4/2N1B3/PPP2PPP/R2QKB1R w KQkq - 0 7
```

**Accepted answer:** squares e5, f6, f8, h6, h8

**Explanation shown:** The pawn on e5 is the first thing on the diagonal, so the bishop sees only f6 and e5 in that direction.

Hints (in order):
1. Follow the diagonal from g7 toward White.
2. f6 is empty; what stands on e5?
3. f6 and e5, plus f8, h6 and h8. The e5 pawn stops the bishop.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [piece_attacks] The piece on g7 attacks exactly these squares.

### Step 11: board

Caption: Position C (edited): White's knight has left d4 (traded off). The knight on c3 and the pawn on e4 remain. Predict: how far now?

```
  8  r n b q k . . r
  7  p p . . p p b p
  6  . . . p . . p .
  5  . . . . . . . .
  4  . . . . P . . .
  3  . . N . B . . .
  2  P P P . . P P P
  1  R . . Q K B . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: rnbqk2r/pp2ppbp/3p2p1/8/4P3/2N1B3/PPP2PPP/R2QKB1R w KQkq - 0 7
```

Drawn on the board: arrows g7-c3; highlighted squares c3.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [piece_attacks] The bishop on g7 attacks exactly these squares.

### Step 12: item

**Task `IOD-LODDRAGON1-3`** (select_squares, difficulty cue 2)

Tap every square the black bishop on g7 attacks in position C.

```
  8  r n b q k . . r
  7  p p . . p p b p
  6  . . . p . . p .
  5  . . . . . . . .
  4  . . . . P . . .
  3  . . N . B . . .
  2  P P P . . P P P
  1  R . . Q K B . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: rnbqk2r/pp2ppbp/3p2p1/8/4P3/2N1B3/PPP2PPP/R2QKB1R w KQkq - 0 7
```

**Accepted answer:** squares c3, d4, e5, f6, f8, h6, h8

**Explanation shown:** With d4 empty the diagonal runs to the knight on c3. Behind it lie b2 and a1.

Hints (in order):
1. The same diagonal as in A, but d4 is empty.
2. Keep going past d4 until a piece stops you.
3. f6, e5, d4 and c3, plus f8, h6 and h8.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [piece_attacks] The piece on g7 attacks exactly these squares.

### Step 13: card

**What decided the range?** Not the bishop, which stood on the same square in all three. What stood on the diagonal decided it: nothing of Black's own, a white pawn on e5, a white knight on d4. Capablanca noted that the bishop is usually stronger than the knight except in blocked positions [V-sheet 8.4]. [I] With its diagonal blocked, the Dragon bishop loses that edge.

## Chapter: Three ideas behind ...g6

### Step 14: card

**Idea 1: the long diagonal.** Play ...g6 and the bishop can go to g7, from where it looks through f6, e5, d4 and c3 to b2 and a1. It is a distant centre-control piece, influencing the middle without a pawn there: a thought the hypermodern school pushed [S].

### Step 15: board

Caption: Black's bishop arrives on g7. Its own knight on f6 is first in line, then White's knight on d4.

```
  8  r n b q k b . r
  7  p p . . p p . p
  6  . . . p . n p .
  5  . . . . . . . .
  4  . . . N P . . .
  3  . . N . B . . .
  2  P P P . . P P P
  1  R . . Q K B . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: rnbqkb1r/pp2pp1p/3p1np1/8/3NP3/2N1B3/PPP2PPP/R2QKB1R b KQkq - 1 6
```

The line, with the sentence the learner sees at each move:
1. **6... Bg7**: The g6 pawn made room; from g7 the bishop looks down the long diagonal toward b2.

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

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: rnbqk2r/pp2ppbp/3p1np1/8/3NP3/2N1B3/PPP2PPP/R2QKB1R w KQkq - 2 7
```

Drawn on the board: arrows g7-b2; highlighted squares g7, f6, d4.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [piece_on] Black's knight stands on f6, the first piece on the diagonal.
- [piece_on] White's knight stands on d4, the second piece.

### Step 16: card

**Idea 2: the pawn on d6.** It guards e5 and c5, so a white pawn on e5 can be captured, and it keeps White's e-pawn from advancing for free. It is not on the long diagonal, so it blocks nothing there. [I] It also fixes Black's centre until ...d5 becomes possible.

### Step 17: board

Caption: The pawn on d6 watches e5 and c5. White's e4 pawn would like to advance; the pawn stands guard.

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

Drawn on the board: arrows d6-e5, d6-c5; highlighted squares d6, e5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [attackers] Black's pieces attack e5 (the d6 pawn).
- [attackers] White has no piece attacking e5 yet.

### Step 18: card

**Idea 3: the half-open c-file.** After ...cxd4 Black has no pawn on the c-file, but White's c2 pawn is still there. A black rook on c8 would press on that file and on the knight on c3. [I] In most Dragon games Black's rook pressure goes down this file, because White's c-pawn is the only pawn left on it. The d-file is White's: White has no d-pawn, Black has d6.

### Step 19: board

Caption: After the knight trade on d4 the c-file is open to Black's rook on c8, and White's knight on c3 stands in front of its c2 pawn. [I] This is why Black's rook often goes to c8.

```
  8  . . r q . r k .
  7  p p . b p p b p
  6  . . . p . n p .
  5  . . . . . . . .
  4  . . . B P . . .
  3  . B N . . P . .
  2  P P P Q . . P P
  1  . . K R . . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: 2rq1rk1/pp1bppbp/3p1np1/8/3BP3/1BN2P2/PPPQ2PP/2KR3R b - - 0 12
```

Drawn on the board: arrows c8-c3; highlighted squares c8, c3.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [open_files] The c-file is half-open for Black, the d-file for White.
- [attackers] One black piece (the rook on c8) attacks c3.

### Step 20: board

Caption: A typical use of the file. Black to move after White castled long.

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
1. **10... Rc8**: The rook takes the half-open c-file, behind the knight that can leave c6 with tempo.

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

Drawn on the board: arrows a8-c8; highlighted squares c8, c3.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] Rc8 is within 40 cp of the engine’s top choice (depth 16).
- [open_files] The c-file is half-open for Black.

## Chapter: The first moves, with reasons

### Step 21: card

**The first six moves, with reasons.** A move order is a chain of small purposes. Emanuel Lasker pointed out that first moves leave lasting marks on a game [V-sheet 1.12]; he used the French as his example, and we borrow the idea. Watch what each move leaves behind. Step through the boards and say each purpose aloud before reading it.

### Step 22: board

Caption: Move 1. Why not copy with ...e5? [I] After ...c5 White cannot build a pawn centre on d4 and e4 for free: the c-pawn is traded for White's d-pawn, which gives Black a half-open file. ...e5 would leave Black's e5 pawn needing protection at once.

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
1. **1. e4**: White grabs the centre and opens lines for the queen and the bishop.
2. **1... c5**: Black fights for d4 with a wing pawn. Leaves behind: unbalanced pawns and a trade that opens the c-file.

```
  8  r n b q k b n r
  7  p p . p p p p p
  6  . . . . . . . .
  5  . . p . . . . .
  4  . . . . P . . .
  3  . . . . . . . .
  2  P P P P . P P P
  1  R N B Q K B N R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2
```

Drawn on the board: arrows c5-d4; highlighted squares c5, d4.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [attackers] After the two moves a black pawn attacks d4.

### Step 23: board

Caption: Moves 2 to 4: the pawn trade that gives both sides a half-open file.

```
  8  r n b q k b n r
  7  p p . p p p p p
  6  . . . . . . . .
  5  . . p . . . . .
  4  . . . . P . . .
  3  . . . . . . . .
  2  P P P P . P P P
  1  R N B Q K B N R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2
```

The line, with the sentence the learner sees at each move:
1. **2. Nf3**: Develops a knight, eyes d4 and e5, and prepares d4. Leaves behind: the f-pawn free to move later.
2. **2... d6**: Guards e5 and c5 and opens the road for the bishop. Leaves behind: a pawn on d6 that fixes the centre.
3. **3. d4**: White challenges the c5 pawn and opens the centre.
4. **3... cxd4**: Black takes: the c-pawn is gone, so the c-file is half-open for Black.
5. **4. Nxd4**: White retakes with a developed piece; White has no d-pawn now, so the d-file is half-open for White.

```
  8  r n b q k b n r
  7  p p . . p p p p
  6  . . . p . . . .
  5  . . . . . . . .
  4  . . . N P . . .
  3  . . . . . . . .
  2  P P P . . P P P
  1  R N B Q K B . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: rnbqkbnr/pp2pppp/3p4/8/3NP3/8/PPP2PPP/RNBQKB1R b KQkq - 0 4
```

Drawn on the board: arrows d6-e5; highlighted squares d4.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [open_files] After the trade the c-file is half-open for Black and the d-file for White.

### Step 24: board

Caption: Moves 4 to 6: the Dragon takes shape.

```
  8  r n b q k b n r
  7  p p . . p p p p
  6  . . . p . . . .
  5  . . . . . . . .
  4  . . . N P . . .
  3  . . . . . . . .
  2  P P P . . P P P
  1  R N B Q K B . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: rnbqkbnr/pp2pppp/3p4/8/3NP3/8/PPP2PPP/RNBQKB1R b KQkq - 0 4
```

The line, with the sentence the learner sees at each move:
1. **4... Nf6**: Attacks e4 and brings a piece out, so White must defend the pawn.
2. **5. Nc3**: Defends e4 and adds a piece; this is the move the Dragon replies to.
3. **5... g6**: Clears g7 for the bishop. Leaves behind: weaker light squares and a king that leans on the g7 bishop.
4. **6. Be3**: Develops the bishop, guards the knight on d4 and prepares Qd2 and long castling [S: standard plan]. It also gets the bishop out before f2-f3 shuts it in.
5. **6... Bg7**: The bishop takes the long diagonal at last.

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

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: rnbqk2r/pp2ppbp/3p1np1/8/3NP3/2N1B3/PPP2PPP/R2QKB1R w KQkq - 2 7
```

Drawn on the board: arrows g7-b2; highlighted squares g7.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [piece_on] A black bishop stands on g7.
- [attackers] Black attacks e4 once; the knight on f6 does it.

### Step 25: card

**Why not 6.e5 at once?** White's e4 pawn is attacked by the knight on f6, and a push looks natural: it chases the knight. But nothing guards the pawn on e5, and Black has the d6 pawn ready. Predict first: does the push win something, or does Black simply take?

### Step 26: board

Caption: 6.e5? is not a refutation of ...g6: it gives the pawn away. Engine (depth 16): White's best try is 7.Bb5+, and White is still about 1.4 pawns down.

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
1. **6. e5**: White pushes to attack the knight on f6.
2. **6... dxe5**: The d6 pawn takes the pawn, and that capture opens the d-file so the black queen eyes the knight on d4.
3. **7. Nf3**: The d4 knight is attacked by the queen and must move; White is a pawn down.
4. **7... Qxd1+**: The queens trade with check.
5. **8. Nxd1**: White recaptures and is still a pawn down while Black's pieces come out.

```
  8  r n b . k b . r
  7  p p . . p p . p
  6  . . . . . n p .
  5  . . . . p . . .
  4  . . . . . . . .
  3  . . . . . N . .
  2  P P P . . P P P
  1  R . B N K B . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: rnb1kb1r/pp2pp1p/5np1/4p3/8/5N2/PPP2PPP/R1BNKB1R b KQkq - 0 8
```

Drawn on the board: arrows d6-e5; highlighted squares e5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] Be3 and f3 are each within 40 cp of the engine's top choice (depth 16).
- [move_loses] 6.e5 scores at least 100 cp worse than the best move (depth 16).

### Step 27: board

Caption: Black to move after 6.e5. Engine check: ...dxe5 leaves Black ahead.

```
  8  r n b q k b . r
  7  p p . . p p . p
  6  . . . p . n p .
  5  . . . . P . . .
  4  . . . N . . . .
  3  . . N . . . . .
  2  P P P . . P P P
  1  R . B Q K B . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: rnbqkb1r/pp2pp1p/3p1np1/4P3/3N4/2N5/PPP2PPP/R1BQKB1R b KQkq - 0 6
```

The line, with the sentence the learner sees at each move:
1. **6... dxe5**: Black takes the pawn; the engine at depth 16 scores this as the best reply.

```
  8  r n b q k b . r
  7  p p . . p p . p
  6  . . . . . n p .
  5  . . . . p . . .
  4  . . . N . . . .
  3  . . N . . . . .
  2  P P P . . P P P
  1  R . B Q K B . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: rnbqkb1r/pp2pp1p/5np1/4p3/3N4/2N5/PPP2PPP/R1BQKB1R w KQkq - 0 7
```

Drawn on the board: highlighted squares e5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] dxe5 is the engine's top choice here (depth 16).
- [material_after_move] dxe5 wins at least a pawn along the engine line.
- [eval_range] The engine puts Black clearly ahead after 6.e5 (White's point of view: at most -100 cp, depth 16).

### Step 28: item

**Task `IOD-LODDRAGON1-4`** (predict_outcome, difficulty cue 2)

Does Black simply win a pawn after 6.e5?

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

White to move. Capitals = White, lower case = Black.
FEN: rnbqkb1r/pp2pp1p/3p1np1/8/3NP3/2N5/PPP2PPP/R1BQKB1R w KQkq - 0 6
```

**Accepted answer:** {"outcome": "yes, Black simply wins a pawn"}

**Explanation shown:** The d6 pawn captures on e5, nothing recaptures, and the engine (depth 16) rates 6.e5 clearly worse than 6.Be3.

Hints (in order):
1. What can the d6 pawn do to an advanced e-pawn?
2. The e5 pawn is attacked by the d6 pawn and no white piece defends it.
3. Yes: Black simply captures on e5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [move_loses] e5 scores at least 100 cp worse than the best move (depth 16).
- [attackers] After 6.e5 no white piece defends the pawn on e5.

### Step 29: card

**One feature at a time.** Contrasts change a single feature and ask whether the idea still holds. Predict each answer before opening it. Then check: the first pair varies what is on the diagonal; the second varies the pawn that guards e5.

### Step 30: contrast

Title: Does the g7 bishop reach c3?

Prompt: Predict for each position, then check. One difference matters; one does not.

**The working board:**

**Task `IOD-LODDRAGON1-5`** (predict_outcome, difficulty cue 2)

Black's knight has left f6 and White's knight has left d4. Does a black piece attack the knight on c3?

```
  8  r n b q k . . r
  7  p p . . p p b p
  6  . . . p . . p .
  5  . . . . . . . .
  4  . . . . P . . .
  3  . . N . B . . .
  2  P P P . . P P P
  1  R . . Q K B . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: rnbqk2r/pp2ppbp/3p2p1/8/4P3/2N1B3/PPP2PPP/R2QKB1R w KQkq - 0 7
```

**Accepted answer:** {"outcome": "yes"}

**Explanation shown:** The diagonal g7-c3 is clear, so the bishop attacks the knight on c3.

Hints (in order):
1. Follow the long diagonal from g7.
2. Is anything on f6, e5 or d4?
3. Yes: the diagonal is clear to c3.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [attackers] One black piece (the bishop) attacks c3.

**The failing board:**

**Task `IOD-LODDRAGON1-6`** (predict_outcome, difficulty cue 2)

Same position, but White's knight is still on d4. Does a black piece attack the knight on c3?

```
  8  r n b q k . . r
  7  p p . . p p b p
  6  . . . p . . p .
  5  . . . . . . . .
  4  . . . N P . . .
  3  . . N . B . . .
  2  P P P . . P P P
  1  R . . Q K B . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: rnbqk2r/pp2ppbp/3p2p1/8/3NP3/2N1B3/PPP2PPP/R2QKB1R w KQkq - 0 7
```

**Accepted answer:** {"outcome": "no"}

**Explanation shown:** The knight on d4 is the first piece on the diagonal, so the bishop does not reach c3.

Hints (in order):
1. Follow the long diagonal again.
2. Where does the bishop's line stop?
3. No: the knight on d4 blocks the line.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [attackers] No black piece attacks c3.

**The irrelevant board:**

**Task `IOD-LODDRAGON1-7`** (predict_outcome, difficulty cue 2)

Position C again, but White's bishop has moved from e3 to d2. Does a black piece attack the knight on c3?

```
  8  r n b q k . . r
  7  p p . . p p b p
  6  . . . p . . p .
  5  . . . . . . . .
  4  . . . . P . . .
  3  . . N . . . . .
  2  P P P B . P P P
  1  R . . Q K B . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: rnbqk2r/pp2ppbp/3p2p1/8/4P3/2N5/PPPB1PPP/R2QKB1R w KQkq - 0 7
```

**Accepted answer:** {"outcome": "yes"}

**Explanation shown:** The bishop on d2 is not between g7 and c3, so nothing changes: the knight on c3 is still attacked.

Hints (in order):
1. Does a bishop on d2 stand on the long diagonal?
2. The squares between g7 and c3 are f6, e5 and d4.
3. Yes: d2 is not on that diagonal.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [attackers] One black piece attacks c3.

### Step 31: contrast

Title: Who guards e5?

Prompt: Predict the number of black pawns attacking e5 in each position.

**The working board:**

**Task `IOD-LODDRAGON1-8`** (predict_outcome, difficulty cue 2)

Black has a pawn on d6. How many black pawns attack the square e5?

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

White to move. Capitals = White, lower case = Black.
FEN: rnbqk2r/pp2ppbp/3p1np1/8/3NP3/2N1B3/PPP2PPP/R2QKB1R w KQkq - 2 7
```

**Accepted answer:** {"outcome": "1"}

**Explanation shown:** A pawn on d6 attacks c5 and e5, so one pawn attacks e5.

Hints (in order):
1. A pawn attacks the two squares diagonally in front of it.
2. Which pawn stands diagonally behind e5?
3. One: the pawn on d6.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [pawn_attackers] One black pawn (d6) attacks e5.

**The failing board:**

**Task `IOD-LODDRAGON1-9`** (predict_outcome, difficulty cue 2)

The black pawn stands on d5 instead of d6. How many black pawns attack the square e5?

```
  8  r n b q k . . r
  7  p p . . p p b p
  6  . . . . . n p .
  5  . . . p . . . .
  4  . . . N P . . .
  3  . . N . B . . .
  2  P P P . . P P P
  1  R . . Q K B . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: rnbqk2r/pp2ppbp/5np1/3p4/3NP3/2N1B3/PPP2PPP/R2QKB1R w KQkq - 0 7
```

**Accepted answer:** {"outcome": "0"}

**Explanation shown:** A pawn on d5 attacks c4 and e4, so nothing guards e5 and an advanced white pawn could stay there.

Hints (in order):
1. Which squares does a pawn on d5 attack?
2. It attacks c4 and e4.
3. Zero: e5 is no longer guarded by a pawn.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [pawn_attackers] No black pawn attacks e5.

**The irrelevant board:**

**Task `IOD-LODDRAGON1-10`** (predict_outcome, difficulty cue 2)

Black's a-pawn is on a6 instead of a7, the d-pawn on d6. How many black pawns attack e5?

```
  8  r n b q k . . r
  7  . p . . p p b p
  6  p . . p . n p .
  5  . . . . . . . .
  4  . . . N P . . .
  3  . . N . B . . .
  2  P P P . . P P P
  1  R . . Q K B . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: rnbqk2r/1p2ppbp/p2p1np1/8/3NP3/2N1B3/PPP2PPP/R2QKB1R w KQkq - 0 7
```

**Accepted answer:** {"outcome": "1"}

**Explanation shown:** The a-pawn is far from e5. The d6 pawn still guards it.

Hints (in order):
1. Is the a-pawn near e5?
2. Only the d6 pawn matters here.
3. One: the a-pawn is irrelevant.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [pawn_attackers] One black pawn attacks e5.

### Step 32: board

Caption: For contrast (edited): the bishop stands on e7 instead of g7. A bishop and a pawn cannot share e7, so the pawn is on e6; the knight on f6 is removed as before. [I] Behind its own pawns the bishop sees squares near its own king, not the long diagonal.

```
  8  r n b q k . . r
  7  p p . . b p . p
  6  . . . p p . p .
  5  . . . . . . . .
  4  . . . N P . . .
  3  . . N . B . . .
  2  P P P . . P P P
  1  R . . Q K B . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: rnbqk2r/pp2bp1p/3pp1p1/8/3NP3/2N1B3/PPP2PPP/R2QKB1R w KQkq - 0 7
```

Drawn on the board: arrows e7-h4, e7-d8; highlighted squares e7.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [piece_attacks] The bishop on e7 attacks exactly these squares.
- [attackers] No black piece attacks b2.

## Chapter: What the games say

### Step 33: card

**Who plays the Dragon, and why?** Our data: after 5.Nc3, 5...g6 was reached in 1436 of 6,673 games in the 2100+ online band, and in 100 of 328 in the 1100-1300 band (a small sample). In our master file 720 of 12,442 games after 5.Nc3 continue 5...g6; 5...a6 has 9,815. [H] The Dragon has a reputation as a sharp, risk-taking choice, and its plan is easy to see (a diagonal and a file); counts cannot test either.

### Step 34: board

Caption: Black to move after 5.Nc3. Online replies in the 2100+ band (Lichess, September 2026): 5...a6 in 4,372 games, 5...g6 in 1,436, 5...Nc6 in 1,285, 5...e6 in 327 (positions reached, including other move orders).

```
  8  r n b q k b . r
  7  p p . . p p p p
  6  . . . p . n . .
  5  . . . . . . . .
  4  . . . N P . . .
  3  . . N . . . . .
  2  P P P . . P P P
  1  R . B Q K B . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: rnbqkb1r/pp2pppp/3p1n2/8/3NP3/2N5/PPP2PPP/R1BQKB1R b KQkq - 2 5
```

Drawn on the board: highlighted squares g6, a6, c6, e6.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] 5...g6 is legal.
- [piece_on] White’s knight stands on c3.

### Step 35: reflect

Kind: expect

Prompt: Do these counts show that the Dragon is stronger (or weaker) for lower-rated players? Write what else could explain them.

- Field "My answer:" with options: yes, the share of players shows strength / no, a share shows what people chose, not how well it works; no single correct answer (a guess or a self-report)

### Step 36: board

Caption: Master games from our file (both players 2500+, 2012-2026): after 5...g6 White chose 6.Be3 in 579 games (221 White wins, 235 draws, 123 Black wins), 6.Be2 in 69, 6.g3 in 42, 6.f3 in 25 and 6.Bc4 in 20.

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

Drawn on the board: arrows c1-e3; highlighted squares e3, e2, g3, f3, c4.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] Be3 and f3 are each within 40 cp of the engine's top choice (depth 16).
- [legal_move] 6.Be3 is legal.

### Step 37: board

Caption: Online counts after 5...g6 (Lichess, September 2026): in the 1100-1300 band 6.Bc4 was reached 37 times and 6.Be3 15 times; in the 2100+ band 6.Be3 751 times and 6.Bc4 154 times. Online amateur counts are not master theory.

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

Drawn on the board: arrows f1-c4, c1-e3; highlighted squares c4, e3.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] 6.Bc4 is legal.
- [legal_move] 6.Be3 is legal.

### Step 38: card

**Counts are results, not verdicts.** The 579 games with 6.Be3 only show that strong players chose it often. A move can be popular for fashion, preparation or style. The engine here agrees that 6.Be3 is a good move (it is within 40 cp of the top choice at depth 16), but the count did not tell us that. Check the claim, not the crowd.

### Step 39: reflect

Kind: expect

Prompt: White won 221 of the 579 games with 6.Be3 and Black won 123. Does that prove 6.Be3 is the best move?

- Field "My answer:" with options: yes, White's score is higher, so it is best / no, results depend on the players and the preparation; no single correct answer (a guess or a self-report)

## Chapter: Test yourself

### Step 40: board

Caption: Does the g7 bishop attack or defend? [I] Both, depending on the moment: it guards f6 and h6 beside the castled king and, when the diagonal opens, aims at the queenside. [H] If so, one piece explains why Black castles calmly and why a king on the other wing feels pressure; counts cannot test that.

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

Drawn on the board: arrows g7-f6, g7-h6, g7-d4; highlighted squares g7, g8, f6, h6.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [piece_attacks] The bishop on g7 attacks exactly these squares.
- [king_wing] Black's king is on the kingside.

### Step 41: board

Caption: Preview: [I] White often trades this bishop, because it is Black's main defender of the king. A later lesson on the Yugoslav attack covers Bh6 in depth.

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
1. **9. Bh6**: White's bishop heads for h6 to trade off the defender of the black king.

```
  8  r . b q . r k .
  7  p p . . p p b p
  6  . . n p . n p B
  5  . . . . . . . .
  4  . . . N P . . .
  3  . . N . . P . .
  2  P P P Q . . P P
  1  R . . . K B . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r1bq1rk1/pp2ppbp/2np1npB/8/3NP3/2N2P2/PPPQ2PP/R3KB1R b KQ - 4 9
```

Drawn on the board: arrows e3-h6, h6-g7; highlighted squares h6, g7.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] Bh6 is a legal move.
- [attackers] No white piece attacks g7 before the bishop moves.

### Step 42: board

Caption: The two features of the Dragon on one board: the long diagonal for the bishop and, once the c-pawn is gone, the half-open c-file. The pawns: White has the islands a-b-c and e-f-g-h; Black has a-b and d-e-f-g-h.

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

Drawn on the board: arrows g7-b2, c8-c2; highlighted squares g7, c8.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [open_files] The c-file is half-open for Black and the d-file for White.
- [pawn_islands] White has two pawn islands: a-b-c and e-f-g-h.
- [pawn_islands] Black has two pawn islands: a-b and d-e-f-g-h.

### Step 43: board

Caption: A preview of the lessons that follow: the usual first plan for each side. The queen on d2 and the king on opposite wings make the race of the middlegame.

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

The line, with the sentence the learner sees at each move:
1. **7. f3**: The usual next step: the pawn supports e4 and stops ...Ng4 hitting the bishop.
2. **7... O-O**: Black castles; the bishop on g7 now guards the king.
3. **8. Qd2**: The queen prepares to castle long and to trade on h6.
4. **8... Nc6**: Black develops and hits d4.

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

Drawn on the board: arrows d2-h6; highlighted squares d2, g7.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] f3 is within 40 cp of the engine’s top choice (depth 16).
- [king_wing] White’s king is still in the centre.

### Step 44: item  (shown without telling the learner the topic: unlabeled test)

**Task `IOD-LODDRAGON1-11`** (classify_position, difficulty cue 3)

Look from Black's bishop on g7 toward White. Which piece blocks it first?

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

White to move. Capitals = White, lower case = Black.
FEN: rnbqk2r/pp2ppbp/3p1np1/8/3NP3/2N1B3/PPP2PPP/R2QKB1R w KQkq - 2 7
```

**Accepted answer:** {"class": "its own knight on f6"}

**Explanation shown:** The knight on f6 is the first piece on the diagonal; the bishop sees through it only after the knight moves.

Hints (in order):
1. Follow the diagonal from g7 toward White.
2. The first square is f6.
3. Black's own knight on f6.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [piece_on] A black knight stands on f6.
- [piece_attacks] The bishop attacks exactly these squares.

### Step 45: item  (shown without telling the learner the topic: unlabeled test)

**Task `IOD-LODDRAGON1-12`** (predict_outcome, difficulty cue 3)

White pushes the pawn from e4 to e5. Compared with now, does the bishop on g7 see more squares of the diagonal or fewer?

```
  8  r n b q k . . r
  7  p p . . p p b p
  6  . . . p . . p .
  5  . . . . . . . .
  4  . . . N P . . .
  3  . . N . B . . .
  2  P P P . . P P P
  1  R . . Q K B . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: rnbqk2r/pp2ppbp/3p2p1/8/3NP3/2N1B3/PPP2PPP/R2QKB1R w KQkq - 0 7
```

**Accepted answer:** {"outcome": "fewer"}

**Explanation shown:** The pawn on e5 becomes the first thing on the diagonal, so the bishop no longer attacks d4.

Hints (in order):
1. Find the first piece on the diagonal now (d4) and after the push.
2. A pawn on e5 stops the line one square earlier.
3. Fewer: d4 drops out.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [piece_attacks] Before the push the bishop attacks f8, h6, h8, f6, e5 and d4.
- [piece_attacks] After e4-e5 the bishop attacks only f8, h6, h8, f6 and e5.

### Step 46: item  (shown without telling the learner the topic: unlabeled test)

**Task `IOD-LODDRAGON1-13`** (classify_position, difficulty cue 3)

Why is ...g6 a sensible move in this position (rather than, say, ...e6)?

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

White to move. Capitals = White, lower case = Black.
FEN: rnbqkb1r/pp2pp1p/3p1np1/8/3NP3/2N5/PPP2PPP/R1BQKB1R w KQkq - 0 6
```

**Accepted answer:** {"class": "the bishop gets a long diagonal and the c-file is half-open"}

**Explanation shown:** The bishop on f8 is not attacked, so the first option is the only one that names a feature of the position: a long diagonal for the g7 bishop and a half-open c-file.

Hints (in order):
1. Is the bishop in any danger on f8?
2. What does ...g6 allow the bishop to do next?
3. The first option: the diagonal and the c-file.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [open_files] The c-file is half-open for Black.
- [attackers] No white piece attacks f8.

### Step 47: item  (shown without telling the learner the topic: unlabeled test)

**Task `IOD-LODDRAGON1-14`** (select_squares, difficulty cue 3)

Tap every square White's bishop on g2 attacks.

```
  8  r n b q k b . r
  7  p p p . . p p p
  6  . . . . p n . .
  5  . . . p . . . .
  4  . . P P . . . .
  3  . . . . . . P .
  2  P P . . P P B P
  1  R N B Q K . N R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black.
FEN: rnbqkb1r/ppp2ppp/4pn2/3p4/2PP4/6P1/PP2PPBP/RNBQK1NR b KQkq - 1 4
```

**Accepted answer:** squares d5, e4, f1, f3, h1, h3

**Explanation shown:** The same idea from the other side: the bishop sees along its diagonal until the black pawn on d5.

Hints (in order):
1. Follow the long diagonal toward Black's side.
2. Squares up to the first piece count.
3. e4, f3 and d5, plus f1, h1 and h3.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [piece_attacks] The bishop on g2 attacks exactly these squares.

### Step 48: item  (shown without telling the learner the topic: unlabeled test)

**Task `IOD-LODDRAGON1-15`** (predict_outcome, difficulty cue 3)

Black's bishop stands on e7 behind its pawns. Does a black piece attack the pawn on b2?

```
  8  r n b q k . . r
  7  p p . . b p . p
  6  . . . p p . p .
  5  . . . . . . . .
  4  . . . N P . . .
  3  . . N . B . . .
  2  P P P . . P P P
  1  R . . Q K B . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: rnbqk2r/pp2bp1p/3pp1p1/8/3NP3/2N1B3/PPP2PPP/R2QKB1R w KQkq - 0 7
```

**Accepted answer:** {"outcome": "no"}

**Explanation shown:** From e7 the bishop does not use the long diagonal, so b2 is not under pressure.

Hints (in order):
1. Which black piece could reach b2?
2. Check the diagonals from e7.
3. No: the bishop is on the wrong diagonal.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [attackers] No black piece attacks b2.

### Step 49: reflect

Kind: expect

Prompt: [H] Is the Dragon easier to understand than other Sicilians, because Black’s plan shows on the board as one diagonal and one file? Agree, disagree, or say what would test it.

- Field "My view:" (free text)

## Chapter: Recap and teach it back

### Step 50: card

**Recap: what to remember.** The pawn on g6 lets the bishop reach g7 and look down the long diagonal; what stands on that diagonal decides its range. The d6 pawn guards e5, so a white e-pawn push can be met by a capture. The c-file is half-open for Black, the d-file for White. ...g6 costs light-square weakness and a dependence on the g7 bishop. Counts show what was chosen, not what is best. Next lesson: the pawn structure and the breaks.

### Step 51: card

**Typical mistakes.** [I] First, grabbing the e4 pawn with the knight: after 6.Be3 the capture ...Nxe4 loses a piece for a pawn, because White recaptures (see the board). Second, letting the bishop be traded on h6 with no plan for the king. Third, blocking your own bishop with a knight that never moves, so the diagonal stays closed.

### Step 52: board

Caption: 6...Nxe4? is a mistake: White's knight on c3 recaptures and Black has given up a knight for a pawn.

```
  8  r n b q k b . r
  7  p p . . p p . p
  6  . . . p . n p .
  5  . . . . . . . .
  4  . . . N P . . .
  3  . . N . B . . .
  2  P P P . . P P P
  1  R . . Q K B . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: rnbqkb1r/pp2pp1p/3p1np1/8/3NP3/2N1B3/PPP2PPP/R2QKB1R b KQkq - 1 6
```

The line, with the sentence the learner sees at each move:
1. **6... Nxe4**: Tempting: it wins a pawn for one move.
2. **7. Nxe4**: White recaptures; Black has lost a knight for a pawn.

```
  8  r n b q k b . r
  7  p p . . p p . p
  6  . . . p . . p .
  5  . . . . . . . .
  4  . . . N N . . .
  3  . . . . B . . .
  2  P P P . . P P P
  1  R . . Q K B . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: rnbqkb1r/pp2pp1p/3p2p1/8/3NN3/4B3/PPP2PPP/R2QKB1R b KQkq - 0 7
```

Drawn on the board: highlighted squares e4.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [move_loses] 6...Nxe4 scores at least 150 cp worse than the best move (depth 16).

### Step 53: card

**Say it like this.** [I] 'Black plays ...g6 so the bishop can sit on g7 and look along the long diagonal. It works while nothing stands on that diagonal, and it fails when a white pawn on e5 blocks it. Set up a bishop on g7 with a pawn on e5 and count its squares. Warning: do not grab the e4 pawn with the knight; White just recaptures.'

### Step 54: reflect

Kind: unsure

Prompt: Teach-back: in two or three sentences, explain to a beginner why the bishop goes to g7. Say when the idea works and when it does not (for example when a white pawn stands on e5), give one example you could set up on a board, and one mistake to avoid. Self-check afterwards: did you say when it works and when it fails, give an example a beginner could set up, and name a mistake? The app grades nothing; compare with the recap.

- Field "The idea:" (free text)

- Field "When it works / fails:" (free text)

- Field "One example:" (free text)

- Field "One warning:" (free text)

---

## Reviewer scorecard

Fill in the file `content/review/L-OD-DRAGON-1.json` (a template is below). Scale 1 to 5 for each dimension: 1 = wrong or unusable, 3 = acceptable with edits, 5 = I would put my name to it as it stands.
Revision to review: `76d5f4a7`. If the lesson text changes after your review, your sign-off no longer applies and the lesson goes back to needs-human.

| Dimension | What to judge | Score |
|---|---|---|
| chess | every statement, line and explanation is correct; near-misses are really near-misses | |
| clarity | the explanation actually explains (mechanism, conditions), in plain words | |
| prerequisites | the lesson assumes only what the learner has met | |
| tasks | each task has one defensible answer and a fair explanation | |

```json
{
  "lesson": "L-OD-DRAGON-1",
  "revision": "76d5f4a7",
  "reviewer": "<your name>",
  "reviewer_role": "strong-player",
  "date": "YYYY-MM-DD",
  "scores": {"chess": 0, "clarity": 0, "prerequisites": 0, "tasks": 0},
  "comments": "<what to change, by step number>",
  "verdict": "approved"
}
```

`reviewer_role` is `strong-player` or `teacher`. `verdict` is `approved` or `changes-requested`. See docs/review-slice.md.
