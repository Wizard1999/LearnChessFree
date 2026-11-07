# Review packet: L-OD-DRAGON-5

**The 9.O-O-O line: ...d5, the Nxd4 trades and the 9.g4 alternative**

- Skill: OPN.STRUCT (D2); stage: exemplar; stated length: 40 minutes
- Steps: 68 (16 are tasks); revision: `58d142a9`
- Review status now: needs-human

## What the lesson says the learner will be able to do

- Counts the attackers and defenders of d5 after ...d5 and uses the count to say whether the break works
- Names the three ways ...d5 fails here (extra attacker, queen away or blocked, knight chased by g5) and shows each on a board
- Steps through 9...d5 10.exd5 Nxd5 11.Nxc6 bxc6 12.Bd4 and says what each move prepares
- Chooses the right recapture after ...Nxd4 and avoids the queen recapture, with the engine evidence
- Reads game counts as results with a sample size, not as verdicts, and tells a tested claim from a conjecture

## Sources the author names (check that they are used fairly, in our own words)

- app/public/masters/stats.json (329,379 games, both players 2500+, 2012-2026; 9.O-O-O 217 games 69/102/46, 9.Bc4 139 games 60/62/17, 9.g4 41 games 21/15/5; 9...d5 199, 9...Nxd4 11; 10.exd5 136 38/71/27, 10.Nxc6 29 6/13/10, 10.Qe1 26 14/9/3; 11.Bh6 15 and 11.Bc4 13 after 10.Nxc6; 9.g4 Be6 31) [V]
- content/items/lesson-od-l-od-dragon-5.json (positions replayed with python-chess from the Dragon move sequence, or one-feature edits marked in provenance; engine claims at depth 16) [V]
- existing items IODdragon-6, 7, 8, 9 (the ...d5 contrast) [V]
- docs/citable-views.md 2.8 (Edward Lasker, Chess Strategy: keep ...d5 available as Black's equalising break) [V-sheet]
- docs/citable-views.md 2.4 (Nimzowitsch, My System: remove or restrain a mobile centre pawn) [V-sheet]
- docs/citable-views.md 4.11 (Edward Lasker; Philidor: pawns are cheap and speed decides when kings castle on opposite wings) [V-sheet]
- docs/lesson-depth-standard.md (opening series outline, lesson 5)
- [I] and [H] statements in the cards are conjectures, labelled in the text

## How to read this packet

Boards are drawn with capitals for White and lower case for Black, rank 8 at the top unless the board is shown from Black's side. Moves in a line are in standard notation. Statements marked [V] were machine-checked, [I] inference, [H] hypothesis, [S] secondary source, [R] recalled. Please judge the explanations, not only the moves: does each sentence tell the learner why?

---

## Chapter: What the king on c1 allows

### Step 1: board

Caption: Black to move after 9.O-O-O. White's king has left the centre for c1. Which Black move uses that?

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

Drawn on the board: arrows d6-d5; highlighted squares c1, d6, c8.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] ...d5 is the engine's top move here (depth 16).
- [eval_range] The engine rates the position as a small edge for White, between +0.25 and +1.3 (depth 16).

### Step 2: reflect

Kind: expect

Prompt: What does White's king on c1 allow Black to do that the bishop move 9.Bc4 prevented? Write your guess and a reason before you read on.

- Field "My guess:" (free text)

### Step 3: card

**What you will be able to do.** After castling long (9.O-O-O) the white king stands on c1, far from Black's king. Black gets a pawn break, ...d5, that two other ninth moves do not allow. By the end you will say **when ...d5 is a good idea and when it is not**, know the knight trades that follow, and meet the sharper 9.g4. First, the key idea: count.

### Step 4: item

**Task `IOD-LODDRAGON5-1`** (predict_outcome, difficulty cue 2)

White has played the bishop to c4 instead of castling. Black is considering ...d5. Does it lose ground, meaning it scores at least 50 centipawns worse than the engine's best move?

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

**Accepted answer:** {"outcome": "yes, it loses ground"}

**Explanation shown:** With the bishop on c4, d5 is attacked three times after ...d5. The move scores at least 50 cp worse than the engine's best at depth 16.

Hints (in order):
1. Look at the diagonal that starts on c4.
2. Which square would the pawn land on, and who attacks it?
3. Yes: three white pieces attack d5, so the pawn trade favours White.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [move_loses] ...d5 scores at least 50 cp worse than the best move (depth 16).
- [piece_on] A white bishop stands on c4.
- [attackers] After ...d5 three white pieces attack d5.

### Step 5: board

Caption: If Black recaptures on d5 with White's bishop on c4, the count loses the queen: two white pieces attack d5 and only one black piece defends it.

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
1. **9... d5**: The pawn strikes at e4 and opens the d-file.
2. **10. exd5**: White takes. The pawn on d5 now attacks the knight on c6.
3. **10... Nxd5**: Black recaptures with the knight, the usual idea.
4. **11. Nxd5**: White trades knights. The bishop and the second knight now both attack d5.
5. **11... Qxd5**: The queen recaptures. It is the only defender.
6. **12. Bxd5**: The bishop takes the queen. On balance Black has lost a whole queen.

```
  8  r . b . . r k .
  7  p p . . p p b p
  6  . . n . . . p .
  5  . . . B . . . .
  4  . . . N . . . .
  3  . . . . B P . .
  2  P P P Q . . P P
  1  R . . . K . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r1b2rk1/pp2ppbp/2n3p1/3B4/3N4/4BP2/PPPQ2PP/R3K2R b KQ - 0 12
```

Drawn on the board: arrows c4-d5, c3-d5, d8-d5; highlighted squares d5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [eval_range] With the bishop on c4 the engine rates the starting position between +0.25 and +1.3 for White (depth 16).
- [attackers] After the knight lands on d5, two white pieces attack that square.
- [attackers] One black piece, the queen, defends it.

### Step 6: board

Caption: Black need not recapture. After ...d5 exd5 the knight can step aside, but then White is simply a pawn up: the engine says about +1.3 (depth 16).

```
  8  r . b q . r k .
  7  p p . . p p b p
  6  . . n . . n p .
  5  . . . P . . . .
  4  . . B N . . . .
  3  . . N . B P . .
  2  P P P Q . . P P
  1  R . . . K . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: r1bq1rk1/pp2ppbp/2n2np1/3P4/2BN4/2N1BP2/PPPQ2PP/R3K2R b KQ - 0 10
```

The line, with the sentence the learner sees at each move:
1. **10... Na5**: The knight steps aside and attacks the bishop on c4.
2. **11. Bb3**: The bishop retreats.
3. **11... Nxb3**: Black trades the knight for the bishop.
4. **12. Nxb3**: White recaptures and keeps the extra pawn.

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

Drawn on the board: arrows a5-c4; highlighted squares d5, c6, a5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] ...Na5 is the engine's top move here (depth 16).
- [eval_range] White is clearly better, between +0.9 and +1.8 (depth 16).
- [move_loses] ...Nxd5 scores at least 300 cp worse than ...Na5 (depth 16).
- [attackers] After ...Na5 the knight attacks the bishop on c4.

### Step 7: item

**Task `IOD-LODDRAGON5-2`** (predict_outcome, difficulty cue 2)

Black's queen has already gone to e8 (an edited position, not from a game). Black is considering ...d5. Does it lose ground, meaning it scores at least 50 centipawns worse than the engine's best move?

```
  1  R . B . R K . .
  2  P P . . Q P P P
  3  . . P B . N . .
  4  . . . P N . . .
  5  . . . . . . . .
  6  . p n . p n . .
  7  p b p p . . p p
  8  . k r q . b . r
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: r1b1qrk1/pp2ppbp/2np1np1/8/3NP3/2N1BP2/PPPQ2PP/2KR1B1R b - - 4 9
```

**Accepted answer:** {"outcome": "yes, it loses ground"}

**Explanation shown:** With the queen on e8 it does not help on d5. After ...d5 exd5 only the knight attacks d5, and the move scores at least 50 cp worse than the best at depth 16.

Hints (in order):
1. Where is the black queen, and which file does it no longer watch?
2. After ...d5 exd5, who can take back on d5?
3. Yes: with the queen away only the knight attacks d5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [move_loses] ...d5 scores at least 50 cp worse than the best move (depth 16).
- [piece_on] A black queen stands on e8.
- [attackers] After ...d5 exd5 only one black piece, the knight, attacks d5.

### Step 8: board

Caption: Edited position: the black queen on e8. After the pawn trade the knight on d5 has no defender.

```
  8  r . b . q r k .
  7  p p . . p p b p
  6  . . n p . n p .
  5  . . . . . . . .
  4  . . . N P . . .
  3  . . N . B P . .
  2  P P P Q . . P P
  1  . . K R . B . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: r1b1qrk1/pp2ppbp/2np1np1/8/3NP3/2N1BP2/PPPQ2PP/2KR1B1R b - - 4 9
```

The line, with the sentence the learner sees at each move:
1. **9... d5**: Same push, but the queen is on e8 and no longer looks down the d-file.
2. **10. exd5**: White takes, and the pawn attacks the knight on c6 again.
3. **10... Nxd5**: The knight recaptures, but nothing defends it on d5.

```
  8  r . b . q r k .
  7  p p . . p p b p
  6  . . n . . . p .
  5  . . . n . . . .
  4  . . . N . . . .
  3  . . N . B P . .
  2  P P P Q . . P P
  1  . . K R . B . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r1b1qrk1/pp2ppbp/2n3p1/3n4/3N4/2N1BP2/PPPQ2PP/2KR1B1R w - - 0 11
```

Drawn on the board: arrows e8-d8, c3-d5; highlighted squares d5, e8.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [attackers] Nothing defends the knight on d5.
- [attackers] One white piece attacks it.
- [best_move_in] The engine's top moves in this edited position are ...a6 and ...Bd7, not ...d5 (depth 16).

### Step 9: item

**Task `IOD-LODDRAGON5-3`** (predict_outcome, difficulty cue 2)

White has played g4 instead of castling. Black is considering ...d5. Does it lose ground, meaning it scores at least 50 centipawns worse than the engine's best move?

```
  1  R . B K . . . R
  2  P . . . Q P P P
  3  . . P B . N . .
  4  . P . P N . . .
  5  . . . . . . . .
  6  . p n . p n . .
  7  p b p p . . p p
  8  . k r . q b . r
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: r1bq1rk1/pp2ppbp/2np1np1/8/3NP1P1/2N1BP2/PPPQ3P/R3KB1R b KQ - 0 9
```

**Accepted answer:** {"outcome": "yes, it loses ground"}

**Explanation shown:** After ...d5 White can answer with the pawn push g5, which attacks the knight that was supposed to recapture on d5. The move scores at least 50 cp worse than the best at depth 16.

Hints (in order):
1. Which black piece must recapture on d5?
2. Which white pawn could attack that piece?
3. Yes: g5 chases the knight away before it can recapture.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [move_loses] ...d5 scores at least 50 cp worse than the best move (depth 16).
- [pawn_attackers] After ...d5 g5 the pawn on g5 attacks the knight on f6.

### Step 10: board

Caption: The third way ...d5 fails: the recapturing knight is chased away first. Here g4 and g5 are the lever.

```
  8  r . b q . r k .
  7  p p . . p p b p
  6  . . n p . n p .
  5  . . . . . . . .
  4  . . . N P . P .
  3  . . N . B P . .
  2  P P P Q . . . P
  1  R . . . K B . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: r1bq1rk1/pp2ppbp/2np1np1/8/3NP1P1/2N1BP2/PPPQ3P/R3KB1R b KQ - 0 9
```

The line, with the sentence the learner sees at each move:
1. **9... d5**: Black tries the same break.
2. **10. g5**: The pawn attacks the knight, the piece that would recapture on d5.
3. **10... Ne8**: The knight retreats; it cannot recapture on d5 any more.
4. **11. exd5**: White takes the pawn. The new pawn attacks the knight on c6.
5. **11... Nb4**: The knight escapes, and White has won a pawn.

```
  8  r . b q n r k .
  7  p p . . p p b p
  6  . . . . . . p .
  5  . . . P . . P .
  4  . n . N . . . .
  3  . . N . B P . .
  2  P P P Q . . . P
  1  R . . . K B . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r1bqnrk1/pp2ppbp/6p1/3P2P1/1n1N4/2N1BP2/PPPQ3P/R3KB1R w KQ - 1 12
```

Drawn on the board: arrows g4-g5, g5-f6; highlighted squares f6, d5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] At the start Black's best moves are ...Be6, ...Nxd4 and ...h5, each within 40 cp of the top (depth 16).
- [move_loses] ...d5 scores at least 50 cp worse than the best move (depth 16).
- [pawn_attackers] After ...d5 g5 the pawn attacks the knight on f6.
- [pawn_attackers] After exd5 the pawn attacks the knight on c6.

## Chapter: Count the recapture

### Step 11: card

**The idea: count the recapture.** A pawn break works only if you can answer the trade. A useful first test [I]: after the exchange on d5, count the attackers and defenders of the square and see which pieces do the defending. Here the queen defends the knight down the open d-file. Three failures show up: an extra attacker (the bishop on c4), a missing defender (queen away or blocked), or the knight chased off first (g4-g5). The rook edit later shows a fourth we cannot yet explain.

### Step 12: board

Caption: Step 1 of the main line: the break and the recapture. The queen on d8 guards d5, so White cannot win the knight.

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
1. **9... d5**: Black strikes at the centre at once. The pawn attacks e4 and opens the queen's file.
2. **10. exd5**: White takes. The pawn on d5 attacks the knight on c6.
3. **10... Nxd5**: The knight recaptures and attacks the bishop on e3 and the knight on c3.

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

Drawn on the board: arrows d8-d5, d5-e3, d5-c3; highlighted squares d5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [pawn_attackers] The pawn on d5 attacks the pawn on e4.
- [pawn_attackers] After exd5 the pawn attacks the knight on c6.
- [attackers] The knight on d5 attacks the bishop on e3.
- [attackers] The knight on d5 attacks the knight on c3.
- [attackers] One white piece, the knight on c3, attacks the knight on d5.
- [attackers] The queen defends the knight on d5.

### Step 13: card

**Answering the opening question.** With the bishop not on c4, nothing hits d5, so the pawn trade stands. The trade opens the d-file and the dragon bishop's long diagonal, and both point at White's king on c1. [I] White cannot close those lines quickly, which is why this break suits a king on the queenside. It is my reading, not an engine verdict.

### Step 14: reflect

Kind: expect

Prompt: Compare your first guess with the card above. Which did you name: the missing bishop on c4, the open d-file, or the long diagonal? Write what you would change.

- Field "What I would change:" (free text)

### Step 15: board

Caption: Step 2: the knight trade, then the bishop trade. Main move 10.exd5: 136 games (38 White wins, 71 draws, 27 Black wins). The engine calls it a small edge for White (depth 16).

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
1. **11. Nxc6**: The knight lands on c6 attacking the queen on d8, so Black must take back; that is why the pawn structure breaks.
2. **11... bxc6**: The b-pawn recaptures. The a- and c-pawns are now both alone.
3. **12. Bd4**: The bishop aims along the long diagonal at Black's dragon bishop, the main guard of Black's king.
4. **12... Bxd4**: Black takes first and trades the bishop instead of waiting.
5. **13. Qxd4**: The queen recaptures in the centre and attacks the knight on d5.
6. **13... Qb6**: Black offers a queen trade and hits the queen on d4.

```
  8  r . b . . r k .
  7  p . . . p p . p
  6  . q p . . . p .
  5  . . . n . . . .
  4  . . . Q . . . .
  3  . . N . . P . .
  2  P P P . . . P P
  1  . . K R . B . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r1b2rk1/p3pp1p/1qp3p1/3n4/3Q4/2N2P2/PPP3PP/2KR1B1R w - - 1 14
```

Drawn on the board: arrows d4-g7, b6-d4; highlighted squares c6, a7, d4.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [eval_range] White is slightly better at the start of this step (depth 16).
- [best_move_in] Nxc6 is the engine's top move (depth 16).
- [pawn_set] After ...bxc6 Black's a- and c-pawns are both isolated.
- [attackers] The bishop on d4 attacks the bishop on g7.
- [attackers] The queen on b6 attacks the queen on d4.
- [attackers] After Nxc6 the knight attacks the queen on d8.

### Step 16: item

**Task `IOD-LODDRAGON5-4`** (find_move, difficulty cue 2)

Black to move after 12.Bd4. Find a move within 40 centipawns of the engine's top move (depth 16).

```
  1  R . B . R K . .
  2  P P . . Q P P P
  3  . . P . . N . .
  4  . . . . B . . .
  5  . . . . n . . .
  6  . p . . . p . .
  7  p b p p . . . p
  8  . k r . q b . r
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: r1bq1rk1/p3ppbp/2p3p1/3n4/3B4/2N2P2/PPPQ2PP/2KR1B1R b - - 1 12
```

**Accepted answer(s):** Bxd4, e5, Nxc3

Feedback shown for wrong moves:
- Be6: This ignores the bishop on d4: the engine scores it at least 50 cp worse than the trade or ...e5 (depth 16).

**Explanation shown:** Trading on d4, taking on c3 or blocking the long diagonal with ...e5 each stay within 40 cp of the top move at depth 16. A developing move such as ...Be6 loses at least 50 cp.

Hints (in order):
1. The bishop on d4 attacks your bishop on g7. What can you do about it?
2. Trade it, or block the diagonal with a pawn.
3. Bxd4, Nxc3 or e5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] ...Bxd4, ...Nxc3 and ...e5 are each within 40 cp of the top move (depth 16).
- [move_loses] ...Be6 scores at least 50 cp worse than the top move (depth 16).

### Step 17: board

Caption: [H] Trading White's d4 bishop removes the piece aimed at the dragon bishop and so at Black's king. Test: the engine prefers ...Bxd4 to the developing ...Be6 by more than half a pawn (depth 16).

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
1. **12... Bxd4**: Black trades a bishop for a bishop.
2. **13. Qxd4**: White recaptures. Each side has one bishop left.

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

Drawn on the board: highlighted squares g7, c8, d4, f1.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [bishop_pair] Both sides own two bishops before the trade.
- [best_move_in] ...Bxd4 and ...e5 are the engine's top moves (depth 16).
- [move_loses] ...Be6 scores at least 50 cp worse than the top move (depth 16).

### Step 18: reflect

Kind: expect

Prompt: The hypothesis: trading the white bishop on d4 matters because it removes the piece aimed at Black's king. The engine trades at once and rates the developing ...Be6 clearly worse. Does that support the hypothesis, refute it, or leave it open?

- Field "My verdict:" with options: supports it / refutes it / leaves it open; no single correct answer (a guess or a self-report)

## Chapter: The structure after the trade

### Step 19: card

**What the structure asks.** After the knight trade Black has pawns on a7 and c6 with no neighbours, but the b-file is half open for Black and the bishop on c8 is free. White's plans [I]: attack the weak pawns, keep the king safe on c1, play for the better minor pieces. Black's plans [I]: use the half-open b-file, trade queens early to reach an endgame, aim for ...e5 to free the position. These are ideas to test, not verdicts.

### Step 20: board

Caption: Look at the structure after 11...bxc6, a position from the main line. Which pawns have no neighbours, and which file is half open for Black?

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

Drawn on the board: arrows b8-b2; highlighted squares a7, c6, b2, b8.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [pawn_set] Black's a- and c-pawns are both isolated.
- [open_files] The b-file is half open for Black (no black pawn on it, a white pawn on it).

### Step 21: board

Caption: Where the main line leads: a queen trade is on offer, Black's queenside pawns are thin, and both kings are fairly safe. White keeps a small edge in the engine's line (depth 16). [H] Whether it lasts is a conjecture.

```
  8  r . b . . r k .
  7  p . . . p p . p
  6  . q p . . . p .
  5  . . . n . . . .
  4  . . . Q . . . .
  3  . . N . . P . .
  2  P P P . . . P P
  1  . . K R . B . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: r1b2rk1/p3pp1p/1qp3p1/3n4/3Q4/2N2P2/PPP3PP/2KR1B1R w - - 1 14
```

The line, with the sentence the learner sees at each move:
1. **14. Nxd5**: White trades knights, which removes the piece the queen was hitting.
2. **14... cxd5**: The c-pawn recaptures and Black's centre pawn now stands on d5.
3. **15. h4**: With Black's king guarded only by pawns, the h-pawn starts to advance.
4. **15... h5**: Black answers on the same file and keeps the h-file shut.

```
  8  r . b . . r k .
  7  p . . . p p . .
  6  . q . . . . p .
  5  . . . p . . . p
  4  . . . Q . . . P
  3  . . . . . P . .
  2  P P P . . . P .
  1  . . K R . B . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r1b2rk1/p3pp2/1q4p1/3p3p/3Q3P/5P2/PPP3P1/2KR1B1R w - - 0 16
```

Drawn on the board: arrows d4-b6; highlighted squares a7, d5, h4.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [eval_range] White keeps a small edge in the position after 13...Qb6 (depth 16).
- [best_move_in] Nxd5 is the engine's top move here (depth 16).
- [pawn_set] After ...cxd5 only the a-pawn is isolated.

### Step 22: board

Caption: The other reply to 12.Bd4: ...e5 (47 games: 17 White wins, 19 draws, 11 Black wins), beside ...Bxd4 (75 games: 17, 46, 12). Both are within 40 cp of the top move (depth 16).

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
1. **12... e5**: The pawn attacks the bishop and blocks the long diagonal at the same time.
2. **13. Bc5**: The bishop retreats with an attack on the rook on f8.
3. **13... Re8**: The rook moves with tempo and eyes the e-file.
4. **14. Ne4**: The knight comes to a strong post and eyes the c5 bishop's neighbours.
5. **14... Qc7**: The queen guards the pawn on c6 and eyes the c5 bishop.

```
  8  r . b . r . k .
  7  p . q . . p b p
  6  . . p . . . p .
  5  . . B n p . . .
  4  . . . . N . . .
  3  . . . . . P . .
  2  P P P Q . . P P
  1  . . K R . B . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r1b1r1k1/p1q2pbp/2p3p1/2Bnp3/4N3/5P2/PPPQ2PP/2KR1B1R w - - 4 15
```

Drawn on the board: arrows e5-d4; highlighted squares d4, e5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] ...Bxd4 and ...e5 are each within 40 cp of the top move (depth 16).
- [pawn_attackers] After ...e5 the pawn attacks the bishop on d4.
- [attackers] After Bc5 the bishop attacks the rook on f8.

### Step 23: board

Caption: Why White prefers the other knight trade: 11.Nxd5 keeps Black's pawns healthy, and the engine rates it clearly lower than 11.Nxc6 (depth 16).

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
1. **11. Nxd5**: White could take the knight on d5 instead.
2. **11... Qxd5**: The queen recaptures and now looks at the knight on d4.
3. **12. Nxc6**: White takes the knight that guards d4.
4. **12... Qxc6**: The queen recaptures, and Black's pawns stay whole.
5. **13. Bh6**: White can still offer the bishop trade.

```
  8  r . b . . r k .
  7  p p . . p p b p
  6  . . q . . . p B
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . P . .
  2  P P P Q . . P P
  1  . . K R . B . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r1b2rk1/pp2ppbp/2q3pB/8/8/5P2/PPPQ2PP/2KR1B1R b - - 1 13
```

Drawn on the board: arrows c3-d5; highlighted squares d5, c6.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] Nxc6 is the engine's top move (depth 16).
- [move_loses] Nxd5 scores at least 50 cp worse than the top move (depth 16).

### Step 24: card

**What our games show** (both players 2500+, 2012 to 2026, 329,379 games). On move 9 White castled long in 217 games (69 White wins, 102 draws, 46 Black wins), played the bishop to c4 in 139 (60, 62, 17) and the g-pawn in 41 (21, 15, 5). After castling long Black played ...d5 in 199 games. Counts say what was played, not what is best [V].

### Step 25: reflect

Kind: expect

Prompt: After 10.Nxc6 White won 6 and Black won 10 of 29 games, yet the engine rates it close to its top move for White. What could explain the gap, and what does a count of 29 games let you say?

- Field "My explanation:" (free text)

### Step 26: reflect

Kind: expect

Prompt: Counting a draw as half a point, White scored about 55 per cent after 9.O-O-O, 66 after 9.Bc4 and 70 after 9.g4 (computed from the counts [V]), yet the engine puts all three in one band. Why might White score least after castling long? [H] Candidates: ...d5 is easy for Black to play, small samples (41 games after 9.g4), or which players chose which line.

- Field "My hypothesis:" (free text)

### Step 27: board

Caption: What Black plays against 9.Bc4 instead of ...d5: ...Bd7 (116 games: 41 White wins, 57 draws, 18 Black wins), then 10.O-O-O (83 games) and ...Rc8 (58 games: 17, 35, 6).

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
1. **9... Bd7**: The bishop steps aside and prepares ...Rc8 on the half-open file.
2. **10. O-O-O**: White castles long after all, so the kings are on opposite wings.
3. **10... Rc8**: The rook takes the half-open c-file, the classic Dragon plan.
4. **11. Bb3**: The bishop retreats to a safe diagonal.
5. **11... Nxd4**: Black trades knights.
6. **12. Bxd4**: The bishop recaptures.

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

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 2rq1rk1/pp1bppbp/3p1np1/8/3BP3/1BN2P2/PPPQ2PP/2KR3R b - - 0 12
```

Drawn on the board: arrows c8-c1, c4-b3; highlighted squares c8, c1.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] ...Qa5, ...Bd7 and ...Nxd4 are each within 40 cp of Black's top move (depth 16).
- [piece_on] After ...Rc8 a black rook stands on c8.

### Step 28: board

Caption: Branch 10.Nxc6 (29 games: 6 White wins, 13 draws, 10 Black wins). The engine puts White slightly ahead (depth 16).

```
  8  r . b q . r k .
  7  p p . . p p b p
  6  . . n . . n p .
  5  . . . p . . . .
  4  . . . N P . . .
  3  . . N . B P . .
  2  P P P Q . . P P
  1  . . K R . B . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: r1bq1rk1/pp2ppbp/2n2np1/3p4/3NP3/2N1BP2/PPPQ2PP/2KR1B1R w - - 0 10
```

The line, with the sentence the learner sees at each move:
1. **10. Nxc6**: White trades at once, before Black can use the knight.
2. **10... bxc6**: The b-pawn recaptures.
3. **11. Bh6**: The bishop offers to trade the dragon bishop.
4. **11... Qa5**: Black's queen hits the knight on c3 and the pawn on a2.
5. **12. Bxg7**: The bishops come off.
6. **12... Kxg7**: The king recaptures.
7. **13. exd5**: White opens the e-file and removes the d5 pawn.
8. **13... cxd5**: The c-pawn recaptures. Black has a pawn on d5 and a king on g7.

```
  8  r . b . . r . .
  7  p . . . p p k p
  6  . . . . . n p .
  5  q . . p . . . .
  4  . . . . . . . .
  3  . . N . . P . .
  2  P P P Q . . P P
  1  . . K R . B . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r1b2r2/p3ppkp/5np1/q2p4/8/2N2P2/PPPQ2PP/2KR1B1R w - - 0 14
```

Drawn on the board: arrows h6-g7, a5-c3; highlighted squares c6, h6.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] exd5, Qe1 and Nxc6 are each within 40 cp of White's top move (depth 16).
- [attackers] The queen on a5 attacks the knight on c3.
- [attackers] The bishop on h6 attacks the bishop on g7.

### Step 29: board

Caption: Branch 11.Bc4 (13 games: 4 White wins, 4 draws, 5 Black wins) beside 11.Bh6 (15 games: 2, 9, 4). The b-file is Black's asset.

```
  8  r . b q . r k .
  7  p . . . p p b p
  6  . . p . . n p .
  5  . . . p . . . .
  4  . . . . P . . .
  3  . . N . B P . .
  2  P P P Q . . P P
  1  . . K R . B . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: r1bq1rk1/p3ppbp/2p2np1/3p4/4P3/2N1BP2/PPPQ2PP/2KR1B1R w - - 0 11
```

The line, with the sentence the learner sees at each move:
1. **11. Bc4**: The other way: the bishop eyes f7 and heads for b3.
2. **11... Rb8**: Black puts a rook on the open b-file at once.
3. **12. Bb3**: The bishop reaches a safe diagonal that still hits d5 and f7.
4. **12... Qc7**: The queen guards c6 and keeps an eye on the c-file.

```
  8  . r b . . r k .
  7  p . q . p p b p
  6  . . p . . n p .
  5  . . . p . . . .
  4  . . . . P . . .
  3  . B N . B P . .
  2  P P P Q . . P P
  1  . . K R . . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 1rb2rk1/p1q1ppbp/2p2np1/3p4/4P3/1BN1BP2/PPPQ2PP/2KR3R w - - 4 13
```

Drawn on the board: arrows b8-b2; highlighted squares c6, b8.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] Bh6 and Bc4 are each within 40 cp of White's top move (depth 16).
- [attackers] After ...Rb8 the rook attacks the pawn on b2.

### Step 30: board

Caption: Branch 10.Qe1 (26 games: 14 White wins, 9 draws, 3 Black wins). [H] The queen steps off the d-file before Black's pieces can use it. The engine ranks Qe1 level with the more common 10.exd5 (depth 16), and White won 14 of 26 games [V].

```
  8  r . b q . r k .
  7  p p . . p p b p
  6  . . n . . n p .
  5  . . . p . . . .
  4  . . . N P . . .
  3  . . N . B P . .
  2  P P P . . . P P
  1  . . K R Q B . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: r1bq1rk1/pp2ppbp/2n2np1/3p4/3NP3/2N1BP2/PPP3PP/2KRQB1R b - - 1 10
```

The line, with the sentence the learner sees at each move:
1. **10... e5**: The pawn attacks the knight on d4 and fights for the centre.
2. **11. Nxc6**: White trades the attacked knight rather than retreat it.
3. **11... bxc6**: Black recaptures with the b-pawn again.
4. **12. exd5**: White takes the central pawn.
5. **12... cxd5**: The c-pawn recaptures; Black has pawns on d5 and e5.
6. **13. Bg5**: The bishop attacks the knight on f6, which stands in front of the queen.

```
  8  r . b q . r k .
  7  p . . . . p b p
  6  . . . . . n p .
  5  . . . p p . B .
  4  . . . . . . . .
  3  . . N . . P . .
  2  P P P . . . P P
  1  . . K R Q B . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r1bq1rk1/p4pbp/5np1/3pp1B1/8/2N2P2/PPP3PP/2KRQB1R b - - 1 13
```

Drawn on the board: arrows d2-e1, e5-d4; highlighted squares e1, d4.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] ...e5 and ...h5 are each within 40 cp of Black's top move (depth 16).
- [pawn_attackers] After ...e5 the pawn attacks the knight on d4.
- [attackers] The bishop on g5 attacks the knight on f6.

### Step 31: item

**Task `IOD-LODDRAGON5-5`** (find_move, difficulty cue 1)

White has played the queen to e1 to leave the d-file. Find the pawn move that attacks White's knight on d4.

```
  1  R . B Q R K . .
  2  P P . . . P P P
  3  . . P B . N . .
  4  . . . P N . . .
  5  . . . . p . . .
  6  . p n . . n . .
  7  p b p p . . p p
  8  . k r . q b . r
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: r1bq1rk1/pp2ppbp/2n2np1/3p4/3NP3/2N1BP2/PPP3PP/2KRQB1R b - - 1 10
```

**Accepted answer(s):** e5

**Explanation shown:** The pawn on e5 attacks the knight on d4 and is the engine's top move at depth 16.

Hints (in order):
1. Which pawn could reach a square next to the knight?
2. The e-pawn has two steps available.
3. e5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] ...e5 is the engine's top move (depth 16).
- [pawn_attackers] After ...e5 the pawn attacks the knight on d4.

## Chapter: Other roads for both sides

### Step 32: card

**The simplifying trade.** Black can take the knight at once. It occurred in only 11 of our games (4 White wins, 3 draws, 4 Black wins). The engine rates it below ...d5 but within one pawn (the gap varies by run), so it is playable but rare [V]. [H] The recapturing bishop sits opposite the dragon bishop, so Black must develop and find a file for the rook while White tucks the king away. Test: the engine gives White about +1.1.

### Step 33: board

Caption: Branch 9...Nxd4 (11 games, 9 of which reached 11.Kb1). Within one pawn of the top move (depth 16; runs differ by a few tenths). The engine's second choice here, ...h5, is not covered in this lesson.

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
1. **9... Nxd4**: Black trades the knight, which simplifies and removes a possible target.
2. **10. Bxd4**: The bishop recaptures; the queen recapture would let ...Nxe4 uncover the g7 bishop on the queen.
3. **10... Be6**: Black develops the last minor piece and eyes a2.
4. **11. Kb1**: The king steps off the c-file and stands next to the pawn on a2.

```
  8  r . . q . r k .
  7  p p . . p p b p
  6  . . . p b n p .
  5  . . . . . . . .
  4  . . . B P . . .
  3  . . N . . P . .
  2  P P P Q . . P P
  1  . K . R . B . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r2q1rk1/pp2ppbp/3pbnp1/8/3BP3/2N2P2/PPPQ2PP/1K1R1B1R b - - 2 11
```

Drawn on the board: arrows d4-f6, e6-a2; highlighted squares d4, e6, b1.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] At the start ...d5 is still Black's best move (depth 16).
- [best_move_in] ...Nxd4, ...d5 and ...h5 are all within 100 cp of Black's top move (depth 16).
- [attackers] After the recapture the bishop on d4 attacks the knight on f6.
- [attackers] The bishop on e6 attacks a2.

### Step 34: board

Caption: Black puts the rook on the c-file and meets h4 with ...h5. White is still clearly better, about +1.1 (depth 16): the price of this simplification.

```
  8  r . . q . r k .
  7  p p . . p p b p
  6  . . . p b n p .
  5  . . . . . . . .
  4  . . . B P . . .
  3  . . N . . P . .
  2  P P P Q . . P P
  1  . K . R . B . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: r2q1rk1/pp2ppbp/3pbnp1/8/3BP3/2N2P2/PPPQ2PP/1K1R1B1R b - - 2 11
```

The line, with the sentence the learner sees at each move:
1. **11... Rc8**: The rook takes the half-open c-file, the same file the white king left.
2. **12. h4**: White starts the h-pawn advance against Black's king.
3. **12... h5**: Black meets the pawn on its own file and keeps the h-file shut.
4. **13. Be2**: The bishop completes development.
5. **13... a6**: Black prepares queenside play and keeps the knight on c3 under watch.

```
  8  . . r q . r k .
  7  . p . . p p b .
  6  p . . p b n p .
  5  . . . . . . . p
  4  . . . B P . . P
  3  . . N . . P . .
  2  P P P Q B . P .
  1  . K . R . . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 2rq1rk1/1p2ppb1/p2pbnp1/7p/3BP2P/2N2P2/PPPQB1P1/1K1R3R w - - 0 14
```

Drawn on the board: arrows c8-c1, h4-h5; highlighted squares c8, h4, h5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] ...h5, ...Rc8, ...Qc7 and ...Nd7 are each within 40 cp of Black's top move (depth 16).
- [eval_range] White is clearly better, between +0.8 and +1.6 (depth 16).

### Step 35: board

Caption: After 11...Rc8 12.h4: the h-pawn must be met on its own file. ...h5 is the engine's move (depth 16).

```
  8  . . r q . r k .
  7  p p . . p p b p
  6  . . . p b n p .
  5  . . . . . . . .
  4  . . . B P . . P
  3  . . N . . P . .
  2  P P P Q . . P .
  1  . K . R . B . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: 2rq1rk1/pp2ppbp/3pbnp1/8/3BP2P/2N2P2/PPPQ2P1/1K1R1B1R b - - 0 12
```

Drawn on the board: arrows h7-h5; highlighted squares h4, h7.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] ...h5 is within 40 cp of the top move (depth 16).

### Step 36: card

**White's plan when Black skips ...d5 [I].** First the king steps from c1 to b1, off the c-file where Black's rook is aimed. Then the h-pawn marches to h5 to pry the kingside open, and a bishop trade on h6 removes the dragon bishop. Black meets the h-pawn on its own file. This is my reading of the lines above, not an engine verdict.

### Step 37: item

**Task `IOD-LODDRAGON5-6`** (find_move, difficulty cue 2)

Black has traded on d4. White to move. Find the recapture that keeps the most pressure.

```
  8  r . b q . r k .
  7  p p . . p p b p
  6  . . . p . n p .
  5  . . . . . . . .
  4  . . . n P . . .
  3  . . N . B P . .
  2  P P P Q . . P P
  1  . . K R . B . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: r1bq1rk1/pp2ppbp/3p1np1/8/3nP3/2N1BP2/PPPQ2PP/2KR1B1R w - - 0 10
```

**Accepted answer(s):** Bxd4

Feedback shown for wrong moves:
- Qxd4: The queen steps onto the long diagonal. Once the knight on f6 moves, the bishop on g7 attacks it. The engine scores this at least 150 cp worse (depth 16).

**Explanation shown:** Bxd4 is the engine's top move. After Qxd4 the black knight can capture on e4 and uncover the bishop on g7 against the queen; the engine scores the queen recapture at least 150 cp worse at depth 16.

Hints (in order):
1. Two white pieces can recapture. One of them lands on the long diagonal of Black's bishop.
2. What happens to the diagonal if the knight on f6 moves?
3. Bxd4.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] Bxd4 is the engine's top move (depth 16).
- [move_loses] Qxd4 scores at least 150 cp worse (depth 16).
- [attackers] After Qxd4 Nxe4 the bishop on g7 attacks the queen on d4.

### Step 38: board

Caption: A tempting slip after 11.Kb1: ...Qa5 looks active but leaves e7 undefended once the white knight reaches d5. The engine scores it about 0.7 of a pawn worse than the best move (depth 16).

```
  8  r . . q . r k .
  7  p p . . p p b p
  6  . . . p b n p .
  5  . . . . . . . .
  4  . . . B P . . .
  3  . . N . . P . .
  2  P P P Q . . P P
  1  . K . R . B . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: r2q1rk1/pp2ppbp/3pbnp1/8/3BP3/2N2P2/PPPQ2PP/1K1R1B1R b - - 2 11
```

The line, with the sentence the learner sees at each move:
1. **11... Qa5**: Black's queen hits the knight on c3 and the pawn on a2. It looks active.
2. **12. Nd5**: The knight leaves c3 and attacks the pawn on e7, uncovering the queen on a5 against the queen on d2.
3. **12... Qxd2**: Black takes the queen first.
4. **13. Nxe7+**: The knight takes the pawn with check.
5. **13... Kh8**: The king steps aside.
6. **14. Rxd2**: White recaptures the queen, and Black has lost the pawn on e7.

```
  8  r . . . . r . k
  7  p p . . N p b p
  6  . . . p b n p .
  5  . . . . . . . .
  4  . . . B P . . .
  3  . . . . . P . .
  2  P P P R . . P P
  1  . K . . . B . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r4r1k/pp2Npbp/3pbnp1/8/3BP3/5P2/PPPR2PP/1K3B1R b - - 0 14
```

Drawn on the board: arrows c3-d5, d5-e7; highlighted squares e7, d5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] ...h5, ...Rc8, ...Qc7 and ...Nd7 are each within 40 cp of Black's top move (depth 16).
- [move_loses] ...Qa5 scores at least 50 cp worse than the top move (depth 16).
- [attackers] After Nd5 the knight attacks the pawn on e7.
- [attackers] Nothing defends the pawn on e7 once the queen has left d8.

### Step 39: item

**Task `IOD-LODDRAGON5-7`** (find_move, difficulty cue 2)

Black to move after 11.Kb1. Find a move within 40 centipawns of the engine's top move (depth 16).

```
  1  R . B . R . K .
  2  P P . . Q P P P
  3  . . P . . N . .
  4  . . . P B . . .
  5  . . . . . . . .
  6  . p n b p . . .
  7  p b p p . . p p
  8  . k r . q . . r
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: r2q1rk1/pp2ppbp/3pbnp1/8/3BP3/2N2P2/PPPQ2PP/1K1R1B1R b - - 2 11
```

**Accepted answer(s):** h5, Rc8, Nd7, Qc7

Feedback shown for wrong moves:
- Qa5: The queen leaves d8 and the white knight jumps to d5 with a threat on e7. The engine scores this at least 50 cp worse (depth 16).

**Explanation shown:** The pawn move ...h5, the rook move ...Rc8, the queen move ...Qc7 and the knight move ...Nd7 are each within 40 cp of the top move at depth 16. The queen move ...Qa5 loses at least 50 cp because of Nd5.

Hints (in order):
1. Which Black piece is not yet on the half-open file?
2. A pawn move on the h-file and a rook move are both fine.
3. h5, Rc8, Qc7 or Nd7.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] ...h5, ...Rc8, ...Qc7 and ...Nd7 are each within 40 cp of the top move (depth 16).
- [move_loses] ...Qa5 scores at least 50 cp worse than the top move (depth 16).
- [attackers] After ...Qa5 Nd5 the knight attacks the pawn on e7.
- [attackers] Nothing defends the pawn on e7 then.

### Step 40: card

**The sharper try: 9.g4.** White does not castle yet. The pawn on g4 is guarded by f3 and prepares g5 to chase the knight that guards Black's king. Edward Lasker wrote that with kings on opposite wings pawns are cheap and speed counts [V-sheet]; that is his view, not a law. [H] 9.g4 avoids a mass of theory and keeps the attack, but the engine may disagree. Check at depth 16.

### Step 41: board

Caption: After 9.g4 (41 games: 21 White wins, 15 draws, 5 Black wins). White threatens g5. [H] tested: the engine scores 9.g4 in the same band as 9.O-O-O and 9.Bc4 (between +0.25 and +1.3, depth 16), so the guess is neither refuted nor shown better.

```
  8  r . b q . r k .
  7  p p . . p p b p
  6  . . n p . n p .
  5  . . . . . . . .
  4  . . . N P . P .
  3  . . N . B P . .
  2  P P P Q . . . P
  1  R . . . K B . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: r1bq1rk1/pp2ppbp/2np1np1/8/3NP1P1/2N1BP2/PPPQ3P/R3KB1R b KQ - 0 9
```

Drawn on the board: arrows g4-g5, g5-f6; highlighted squares g4, f3, f6.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [eval_range] The engine rates the position after 9.g4 between +0.25 and +1.3 for White (depth 16).
- [best_move_in] ...Be6, ...Nxd4 and ...h5 are each within 40 cp of the top move (depth 16).
- [pawn_attackers] The pawn on f3 defends the pawn on g4.

### Step 42: board

Caption: Main reply 9...Be6 (31 of the 41 games in our data) and the engine's line (depth 16).

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
1. **9. g4**: White gains space and prepares g5 before castling.
2. **9... Be6**: Black develops and invites the trade on e6; the bishop also eyes the g-pawn.
3. **10. Nxe6**: White removes the bishop that watches the g-pawn.
4. **10... fxe6**: The f-pawn recaptures and opens the f-file.
5. **11. O-O-O**: Now White castles long; the g-pawn has already moved.
6. **11... Ne5**: The knight reaches a central square and attacks f3 and g4.
7. **12. Be2**: The bishop completes development before the pawns advance.

```
  8  r . . q . r k .
  7  p p . . p . b p
  6  . . . p p n p .
  5  . . . . n . . .
  4  . . . . P . P .
  3  . . N . B P . .
  2  P P P Q B . . P
  1  . . K R . . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r2q1rk1/pp2p1bp/3ppnp1/4n3/4P1P1/2N1BP2/PPPQB2P/2KR3R b - - 3 12
```

Drawn on the board: arrows e5-f3, e5-g4; highlighted squares g4, e5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [attackers] After ...Be6 the bishop and the knight on f6 both attack the pawn on g4.
- [pawn_attackers] The pawn on f3 defends g4.
- [attackers] The knight on e5 attacks the pawn on f3.
- [attackers] The knights on e5 and f6 both attack the pawn on g4.

### Step 43: board

Caption: The structure after the main 9.g4 line: Black has doubled pawns on the e-file, but the f-file and the c-file are half open for Black. Who benefits? The cards below answer for both sides.

```
  8  r . . q . r k .
  7  p p . . p . b p
  6  . . . p p n p .
  5  . . . . n . . .
  4  . . . . P . P .
  3  . . N . B P . .
  2  P P P Q B . . P
  1  . . K R . . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: r2q1rk1/pp2p1bp/3ppnp1/4n3/4P1P1/2N1BP2/PPPQB2P/2KR3R b - - 3 12
```

Drawn on the board: arrows f8-f3, e5-g4; highlighted squares e6, e7, f8, c8.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [pawn_set] Black's e-pawns are doubled.
- [open_files] The c- and f-files are half open for Black, the d-file for White.

### Step 44: reflect

Kind: expect

Prompt: Before you read on: what would you do next as White here, and what as Black? One plan each, with a reason.

- Field "White's plan:" (free text)

- Field "Black's plan:" (free text)

### Step 45: card

**Plans in this structure [I].** White: push the h-pawn to h5 to pry the kingside open, finish development, and bring a rook to the g-file. Black: use the half-open c-file (rook and queen aim at White's king), keep the knight on e5 pressing on f3 and g4, and aim for ...d5 once the centre is steady. My reading, not an engine verdict.

### Step 46: board

Caption: White's choice after 9...Be6: 10.Nxe6 (19 games in our data), but 10.Be2 and castling long are each within 40 cp of the top move (depth 16).

```
  8  r . . q . r k .
  7  p p . . p p b p
  6  . . n p b n p .
  5  . . . . . . . .
  4  . . . N P . P .
  3  . . N . B P . .
  2  P P P Q . . . P
  1  R . . . K B . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: r2q1rk1/pp2ppbp/2npbnp1/8/3NP1P1/2N1BP2/PPPQ3P/R3KB1R w KQ - 1 10
```

The line, with the sentence the learner sees at each move:
1. **10. Be2**: The bishop completes development and connects the rooks; g4 is still held only by the f3 pawn.
2. **10... Qa5**: Black's queen hits the knight on c3 and the pawn on a2.
3. **11. h4**: The h-pawn supports g5 and prepares h5.
4. **11... Nxd4**: Black trades the knight on d4.
5. **12. Bxd4**: The bishop recaptures and keeps the diagonal.
6. **12... h5**: Black meets the h-pawn on the same file.

```
  8  r . . . . r k .
  7  p p . . p p b .
  6  . . . p b n p .
  5  q . . . . . . p
  4  . . . B P . P P
  3  . . N . . P . .
  2  P P P Q B . . .
  1  R . . . K . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r4rk1/pp2ppb1/3pbnp1/q6p/3BP1PP/2N2P2/PPPQB3/R3K2R w KQ - 0 13
```

Drawn on the board: arrows e2-h5, h2-h4; highlighted squares e2, h4.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] Be2, Nxe6 and O-O-O are each within 40 cp of White's top move (depth 16).
- [attackers] The queen on a5 attacks the knight on c3.

### Step 47: board

Caption: Second reply 9...h5 (a close second or third choice behind ...Be6, depth 16). The h-pawn challenges the g-pawn at once. [I] After ...h5 and h3 the g-pawn can no longer advance for free, so ...d5 becomes possible. This is the engine's own line, one line, not a proof.

```
  8  r . b q . r k .
  7  p p . . p p b p
  6  . . n p . n p .
  5  . . . . . . . .
  4  . . . N P . P .
  3  . . N . B P . .
  2  P P P Q . . . P
  1  R . . . K B . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: r1bq1rk1/pp2ppbp/2np1np1/8/3NP1P1/2N1BP2/PPPQ3P/R3KB1R b KQ - 0 9
```

The line, with the sentence the learner sees at each move:
1. **9... h5**: Black attacks the g-pawn with the rook's pawn.
2. **10. h3**: White supports the pawn and keeps the structure.
3. **10... d5**: Now the break works: the g-pawn cannot chase the knight for free.
4. **11. Nxc6**: White trades the knight that guards the centre.
5. **11... bxc6**: The b-pawn recaptures.
6. **12. O-O-O**: White castles long at last.

```
  8  r . b q . r k .
  7  p . . . p p b .
  6  . . p . . n p .
  5  . . . p . . . p
  4  . . . . P . P .
  3  . . N . B P . P
  2  P P P Q . . . .
  1  . . K R . B . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r1bq1rk1/p3ppb1/2p2np1/3p3p/4P1P1/2N1BP1P/PPPQ4/2KR1B1R b - - 1 12
```

Drawn on the board: arrows h5-g4; highlighted squares g4, h5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] ...Be6, ...Nxd4 and ...h5 are each within 40 cp of the top move (depth 16).
- [pawn_attackers] After ...h5 the pawn attacks g4.

### Step 48: board

Caption: Third reply 9...Nxd4 (the knight trade again), a close second choice (depth 16). White keeps a clear edge in the engine's line.

```
  8  r . b q . r k .
  7  p p . . p p b p
  6  . . n p . n p .
  5  . . . . . . . .
  4  . . . N P . P .
  3  . . N . B P . .
  2  P P P Q . . . P
  1  R . . . K B . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: r1bq1rk1/pp2ppbp/2np1np1/8/3NP1P1/2N1BP2/PPPQ3P/R3KB1R b KQ - 0 9
```

The line, with the sentence the learner sees at each move:
1. **9... Nxd4**: Black trades the knight.
2. **10. Bxd4**: The bishop recaptures; the queen recapture would run into ...Nxg4.
3. **10... Be6**: Black develops and eyes the g-pawn.
4. **11. h4**: White supports g5 and prepares h5.
5. **11... h5**: Black blocks the h-pawn so the lever stays shut.
6. **12. O-O-O**: White castles long.
7. **12... Qa5**: Black's queen goes to a5, hitting a2.

```
  8  r . . . . r k .
  7  p p . . p p b .
  6  . . . p b n p .
  5  q . . . . . . p
  4  . . . B P . P P
  3  . . N . . P . .
  2  P P P Q . . . .
  1  . . K R . B . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r4rk1/pp2ppb1/3pbnp1/q6p/3BP1PP/2N2P2/PPPQ4/2KR1B1R w - - 2 13
```

Drawn on the board: arrows h4-g5; highlighted squares h4, g4, h5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] ...Be6, ...Nxd4 and ...h5 are each within 40 cp of the top move (depth 16).
- [pawn_attackers] After h4 the pawn attacks g5, so the g-pawn can advance with support.

### Step 49: item

**Task `IOD-LODDRAGON5-8`** (find_move, difficulty cue 2)

White played g4 and threatens g5. Black to move. Find a move within 40 centipawns of the engine's top move (depth 16).

```
  1  R . B K . . . R
  2  P . . . Q P P P
  3  . . P B . N . .
  4  . P . P N . . .
  5  . . . . . . . .
  6  . p n . p n . .
  7  p b p p . . p p
  8  . k r . q b . r
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: r1bq1rk1/pp2ppbp/2np1np1/8/3NP1P1/2N1BP2/PPPQ3P/R3KB1R b KQ - 0 9
```

**Accepted answer(s):** Be6, h5, Nxd4

Feedback shown for wrong moves:
- d5: The break fails here: g5 attacks the knight that should recapture. The engine scores ...d5 at least 50 cp worse (depth 16).

**Explanation shown:** The bishop move ...Be6, the knight trade ...Nxd4 and the pawn move ...h5 each stay within 40 cp of the top move at depth 16. The break ...d5 loses at least 50 cp because g5 follows.

Hints (in order):
1. The g-pawn is the danger. Which Black move challenges it or watches it?
2. A bishop move and a pawn move both do.
3. Be6, Nxd4 or h5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] ...Be6, ...Nxd4 and ...h5 are each within 40 cp of the top move (depth 16).
- [move_loses] ...d5 scores at least 50 cp worse than the top move (depth 16).

### Step 50: board

Caption: The trap behind the g-pawn. Recapturing with the queen loses material because the knight on f6 can move with tempo.

```
  8  r . b q . r k .
  7  p p . . p p b p
  6  . . . p . n p .
  5  . . . . . . . .
  4  . . . n P . P .
  3  . . N . B P . .
  2  P P P Q . . . P
  1  R . . . K B . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: r1bq1rk1/pp2ppbp/3p1np1/8/3nP1P1/2N1BP2/PPPQ3P/R3KB1R w KQ - 0 10
```

The line, with the sentence the learner sees at each move:
1. **10. Qxd4**: The natural recapture with the queen.
2. **10... Nxg4**: The knight takes a pawn and uncovers the bishop on g7 against the queen.
3. **11. Qd2**: The queen must run back.
4. **11... Nxe3**: The knight on g4 attacks the bishop on e3 and uncovers the g7 bishop on the queen, so White loses material here.

```
  8  r . b q . r k .
  7  p p . . p p b p
  6  . . . p . . p .
  5  . . . . . . . .
  4  . . . . P . . .
  3  . . N . n P . .
  2  P P P Q . . . P
  1  R . . . K B . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r1bq1rk1/pp2ppbp/3p2p1/8/4P3/2N1nP2/PPPQ3P/R3KB1R w KQ - 0 12
```

Drawn on the board: arrows g7-d4, f6-g4, g4-e3; highlighted squares d4, g4.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] Bxd4 is the engine's top move (depth 16).
- [move_loses] Qxd4 scores at least 300 cp worse (depth 16).
- [attackers] After Nxg4 the bishop on g7 attacks the queen on d4.
- [attackers] After Nxg4 and Qd2 the knight on g4 attacks the bishop on e3.

### Step 51: board

Caption: After ...Nxe3: Black is clearly better, about +4 for the engine (depth 16). The trap has paid off.

```
  8  r . b q . r k .
  7  p p . . p p b p
  6  . . . p . . p .
  5  . . . . . . . .
  4  . . . . P . . .
  3  . . N . n P . .
  2  P P P Q . . . P
  1  R . . . K B . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: r1bq1rk1/pp2ppbp/3p2p1/8/4P3/2N1nP2/PPPQ3P/R3KB1R w KQ - 0 12
```

Drawn on the board: highlighted squares e3, d4.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [eval_range] Black is far ahead, between +3 and +7 (depth 16).

### Step 52: item

**Task `IOD-LODDRAGON5-9`** (find_move, difficulty cue 2)

After 9.g4 Black traded on d4. White to move. Find the recapture.

```
  8  r . b q . r k .
  7  p p . . p p b p
  6  . . . p . n p .
  5  . . . . . . . .
  4  . . . n P . P .
  3  . . N . B P . .
  2  P P P Q . . . P
  1  R . . . K B . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: r1bq1rk1/pp2ppbp/3p1np1/8/3nP1P1/2N1BP2/PPPQ3P/R3KB1R w KQ - 0 10
```

**Accepted answer(s):** Bxd4

Feedback shown for wrong moves:
- Qxd4: The queen lands on the long diagonal. The engine scores this at least 300 cp worse (depth 16).

**Explanation shown:** Bxd4 is the engine's top move. The queen recapture scores at least 300 cp worse at depth 16: after the knight on f6 jumps to g4 the bishop on g7 attacks the queen.

Hints (in order):
1. One recapture lands on the diagonal of the bishop on g7.
2. That diagonal opens when the knight on f6 moves.
3. Bxd4.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] Bxd4 is the engine's top move (depth 16).
- [move_loses] Qxd4 scores at least 300 cp worse (depth 16).
- [attackers] After Qxd4 Nxg4 the bishop on g7 attacks the queen on d4.

### Step 53: card

**Why it works, when it fails.** Against castling long the queen answers the trade on d5, and no bishop attacks d5. The break also removes White's e-pawn: Nimzowitsch taught that a free, mobile enemy centre pawn should be removed by a prepared break or restrained [V-sheet]. It fails with an extra attacker, a chased knight or a queen that cannot see d5. The rook edit shows a fourth way we cannot explain [H]. Predict first.

## Chapter: When the break fails

### Step 54: contrast

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

### Step 55: board

Caption: Why the bishop on d7 matters: it stands between the queen and d5. The same count as before gives the same failure.

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
1. **9... d5**: The same push, but the bishop on d7 blocks the d-file.
2. **10. exd5**: White takes and attacks the knight on c6.
3. **10... Nxd5**: The knight recaptures, but the queen cannot defend it through the bishop.

```
  8  r . . q . r k .
  7  p p . b p p b p
  6  . . n . . . p .
  5  . . . n . . . .
  4  . . . N . . . .
  3  . . N . B P . .
  2  P P P Q . . P P
  1  . . K R . B . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r2q1rk1/pp1bppbp/2n3p1/3n4/3N4/2N1BP2/PPPQ2PP/2KR1B1R w - - 0 11
```

Drawn on the board: arrows d8-d5; highlighted squares d7, d5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [attackers] Nothing defends the knight on d5: the bishop on d7 blocks the queen.
- [attackers] One white piece attacks it.

### Step 56: contrast

Title: Two more edits

Prompt: Predict each, then check. Both edits move one piece by one square.

**The working board:**

**Task `IOD-LODDRAGON5-10`** (predict_outcome, difficulty cue 2)

White's king stands on b1 instead of c1 (an edited position, not from a game). Black is considering ...d5. Does it lose ground, meaning it scores at least 50 centipawns worse than the engine's best move?

```
  1  R . B . R . K .
  2  P P . . Q P P P
  3  . . P B . N . .
  4  . . . P N . . .
  5  . . . . . . . .
  6  . p n . p n . .
  7  p b p p . . p p
  8  . k r . q b . r
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: r1bq1rk1/pp2ppbp/2np1np1/8/3NP3/2N1BP2/PPPQ2PP/1K1R1B1R b - - 4 9
```

**Accepted answer:** {"outcome": "no, it does not lose ground"}

**Explanation shown:** The king's square does not change the count on d5. ...d5 is still the engine's top move at depth 16.

Hints (in order):
1. Does the king's square change who attacks or defends d5?
2. Count the attackers and defenders of d5 after the trade.
3. No: ...d5 is still the top move.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] ...d5 is the engine's top move (depth 16).
- [piece_on] The white king stands on b1.
- [attackers] After ...d5 exd5 two black pieces, the knight and the queen, attack d5.

**The failing board:**

**Task `IOD-LODDRAGON5-11`** (predict_outcome, difficulty cue 2)

Black's rook stands on e8 instead of f8 (an edited position, not from a game). Black is considering ...d5. Does it lose ground, meaning it scores at least 50 centipawns worse than the engine's best move?

```
  1  R . B . R K . .
  2  P P . . Q P P P
  3  . . P B . N . .
  4  . . . P N . . .
  5  . . . . . . . .
  6  . p n . p n . .
  7  p b p p . . p p
  8  . k . r q b . r
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: r1bqr1k1/pp2ppbp/2np1np1/8/3NP3/2N1BP2/PPPQ2PP/2KR1B1R b - - 4 9
```

**Accepted answer:** {"outcome": "yes, it loses ground"}

**Explanation shown:** With the rook on e8, ...d5 scores at least 50 cp worse than the best move at depth 16. The engine does not tell us why.

Hints (in order):
1. Compare with the king move: which piece moved here?
2. The rook leaves the f-file and the square f8.
3. Yes.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [move_loses] ...d5 scores at least 50 cp worse than the best move (depth 16).
- [piece_on] A black rook stands on e8.

### Step 57: item

**Task `IOD-LODDRAGON5-15`** (predict_outcome, difficulty cue 2)

White's a-pawn stands on a3 instead of a2 (an edited position, not from a game). Black is considering ...d5. Does it lose ground, meaning it scores at least 50 centipawns worse than the engine's best move?

```
  1  R . B . R K . .
  2  P P . . Q P P .
  3  . . P B . N . P
  4  . . . P N . . .
  5  . . . . . . . .
  6  . p n . p n . .
  7  p b p p . . p p
  8  . k r . q b . r
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: r1bq1rk1/pp2ppbp/2np1np1/8/3NP3/P1N1BP2/1PPQ2PP/2KR1B1R b - - 0 9
```

**Accepted answer:** {"outcome": "no, it does not lose ground"}

**Explanation shown:** The pawn on a3 does not touch d5. ...d5 is still the engine's top move at depth 16.

Hints (in order):
1. Does the pawn on a3 change who attacks or defends d5?
2. Count the attackers and defenders of d5 after the trade.
3. No: ...d5 is still the top move.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] ...d5 is the engine's top move (depth 16).
- [piece_on] A white pawn stands on a3.
- [attackers] After ...d5 exd5 two black pieces, the knight and the queen, attack d5.

### Step 58: reflect

Kind: expect

Prompt: [H] The rook on e8 changes the verdict although it does not touch d5. Write a guess: what could it change? (The engine does not say, so your guess is a hypothesis.)

- Field "My hypothesis:" (free text)

### Step 59: board

Caption: Black to move after 10.exd5. The natural recapture is also the engine's choice. Count attackers and defenders on d5 before you answer the next item.

```
  8  r . b q . r k .
  7  p p . . p p b p
  6  . . n . . n p .
  5  . . . P . . . .
  4  . . . N . . . .
  3  . . N . B P . .
  2  P P P Q . . P P
  1  . . K R . B . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: r1bq1rk1/pp2ppbp/2n2np1/3P4/3N4/2N1BP2/PPPQ2PP/2KR1B1R b - - 0 10
```

The line, with the sentence the learner sees at each move:
1. **10... Nxd5**: The knight recaptures; the queen defends it.

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

Drawn on the board: arrows f6-d5, d8-d5; highlighted squares d5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] ...Nxd5 is the engine's top move (depth 16).
- [attackers] After the recapture the queen defends the knight.

### Step 60: item

**Task `IOD-LODDRAGON5-12`** (find_move, difficulty cue 2)

Black to move after 10.exd5. Find the recapture that keeps the pieces defended.

```
  1  R . B . R K . .
  2  P P . . Q P P P
  3  . . P B . N . .
  4  . . . . N . . .
  5  . . . . P . . .
  6  . p n . . n . .
  7  p b p p . . p p
  8  . k r . q b . r
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: r1bq1rk1/pp2ppbp/2n2np1/3P4/3N4/2N1BP2/PPPQ2PP/2KR1B1R b - - 0 10
```

**Accepted answer(s):** Nxd5

Feedback shown for wrong moves:
- Nxd4: The engine scores this at least 100 cp worse than the knight recapture (depth 16).
- Qxd5: The queen takes the pawn on d5, which a white knight attacks. The engine scores this at least 400 cp worse (depth 16).

**Explanation shown:** The knight recapture ...Nxd5 is the engine's top move. ...Nxd4 scores at least 100 cp worse, and ...Qxd5 at least 400 cp worse, at depth 16.

Hints (in order):
1. The pawn on d5 attacks a black knight. Several pieces could take it.
2. Two of them leave pieces loose.
3. Nxd5 with the knight from f6.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] ...Nxd5 is the engine's top move (depth 16).
- [move_loses] ...Nxd4 scores at least 100 cp worse (depth 16).
- [move_loses] ...Qxd5 scores at least 400 cp worse (depth 16).
- [attackers] One white piece, the knight on c3, attacks the pawn on d5.

### Step 61: item  (shown without telling the learner the topic: unlabeled test)

**Task `IOD-LODDRAGON5-14`** (predict_outcome, difficulty cue 3)

White has pushed the g-pawn and Black's bishop already stands on d7 (an edited position, not from a game). Black is considering ...d5. Does it lose ground, meaning it scores at least 50 centipawns worse than the engine's best move?

```
  1  R . B K . . . R
  2  P . . . Q P P P
  3  . . P B . N . .
  4  . P . P N . . .
  5  . . . . . . . .
  6  . p n . p n . .
  7  p b p p b . p p
  8  . k r . q . . r
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: r2q1rk1/pp1bppbp/2np1np1/8/3NP1P1/2N1BP2/PPPQ3P/R3KB1R b KQ - 0 9
```

**Accepted answer:** {"outcome": "yes, it loses ground"}

**Explanation shown:** In this edited position ...d5 scores at least 50 cp worse than the best move at depth 16: the pawn on g4 can chase the recapturing knight.

Hints (in order):
1. Count the attackers and the defenders of d5 after the trade.
2. Which Black piece would have to recapture, and can anything chase it first?
3. Yes.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [move_loses] ...d5 scores at least 50 cp worse than the best move (depth 16).
- [piece_on] A black bishop stands on d7.
- [pawn_attackers] After ...d5 g5 the pawn on g5 attacks the knight on f6.

### Step 62: item  (shown without telling the learner the topic: unlabeled test)

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

### Step 63: practice

A drill of 6 tasks drawn from the bank by tag ['theme.dragon'] (171 tasks carry those tags). Not reproduced here; ask for a sample if you want one checked.

### Step 64: card

**A guess to argue with.** [H] Castling long may give Black an easier game than the bishop move to c4 for players below master level, because ...d5 and the knight trades are simple to understand and can be checked by counting. Test: compare error rates on ...d5 items for the c4 and castling positions in our own data. It is a guess about people, not positions.

## Chapter: Teach it back

### Step 65: reflect

Kind: unsure

Prompt: Teach it back. Imagine a beginner who has just seen 9.O-O-O. In your own words write: the idea (how you decide if ...d5 works), when it works, one example a beginner can set up on a board, and one warning.

- Field "The idea:" (free text)

- Field "When it works:" (free text)

- Field "One example:" (free text)

- Field "One warning:" (free text)

### Step 66: card

**Self-check.** Did you say when ...d5 works, when it fails, give an example a beginner could set up on a board (a piece count on d5), and name one mistake (the queen recapture on d4, or ...d5 into g5)? The app does not grade this. Compare with a friend or your coach, and revisit any answer that has no example.

### Step 67: card

**Recap.**
- ...d5 needs the recapture: count attackers and defenders on d5 (a first test [I]).
- It fails against an extra attacker, a blocked queen or a chased knight; the rook edit shows a fourth failure we cannot explain [H].
- After the knight trade Black has isolated a- and c-pawns and the half-open b-file.
- ...Nxd4 is playable but rare: 11 games [V].
- Against the g-pawn push Black plays ...Be6, ...Nxd4 or ...h5.
- Counts show what was played, not what is best.

### Step 68: reflect

Kind: confidence

Prompt: How sure are you that you could explain the count on d5 to someone else? Pick one and name the part you would check first.

- Field "I could explain it:" with options: clearly / with help / not yet; no single correct answer (a guess or a self-report)

---

## Reviewer scorecard

Fill in the file `content/review/L-OD-DRAGON-5.json` (a template is below). Scale 1 to 5 for each dimension: 1 = wrong or unusable, 3 = acceptable with edits, 5 = I would put my name to it as it stands.
Revision to review: `58d142a9`. If the lesson text changes after your review, your sign-off no longer applies and the lesson goes back to needs-human.

| Dimension | What to judge | Score |
|---|---|---|
| chess | every statement, line and explanation is correct; near-misses are really near-misses | |
| clarity | the explanation actually explains (mechanism, conditions), in plain words | |
| prerequisites | the lesson assumes only what the learner has met | |
| tasks | each task has one defensible answer and a fair explanation | |

```json
{
  "lesson": "L-OD-DRAGON-5",
  "revision": "58d142a9",
  "reviewer": "<your name>",
  "reviewer_role": "strong-player",
  "date": "YYYY-MM-DD",
  "scores": {"chess": 0, "clarity": 0, "prerequisites": 0, "tasks": 0},
  "comments": "<what to change, by step number>",
  "verdict": "approved"
}
```

`reviewer_role` is `strong-player` or `teacher`. `verdict` is `approved` or `changes-requested`. See docs/review-slice.md.
