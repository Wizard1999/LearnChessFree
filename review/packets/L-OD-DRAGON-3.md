# Review packet: L-OD-DRAGON-3

**The Yugoslav set-up: what every move prepares, and the move-order questions**

- Skill: OPN.STRUCT (D2); stage: exemplar; stated length: 40 minutes
- Steps: 73 (14 are tasks); revision: `5353285a`
- Review status now: needs-human

## What the lesson says the learner will be able to do

- Says in one sentence what each early move of the Yugoslav set-up prepares: the pawn on f3 (support for e4, then g4), the queen on d2 (guard for e3, long castling, the h6 diagonal), the bishop's square on c4, long castling
- Says what each early Black move prepares: the bishop on g7, castling, the knight on c6, the bishop on d7 and the rook on c8
- Checks the conditions before the bishop trade on h6 (count the defenders of d4) and before ...d5 (count the controllers of d5)
- Compares move orders: three roads to one position, and what the slow seventh moves (Qd2, Be2) allow Black to do
- Names typical mistakes for both sides and the engine's verdict on each, and reads master counts as choices, not verdicts

## Sources the author names (check that they are used fairly, in our own words)

- app/public/masters/stats.json (329,379 games, both players 2500+, first 24 plies, built 2026-10-29): counts quoted exactly from the tree rows keyed by EPD, read in this session: after 5...g6 (6.Be3 579, 6.Be2 69, 6.g3 42, 6.f3 25, 6.Bc4 20); after 6.Be3 (...Bg7 490, ...Nc6 59, ...a6 30); after 6...Bg7 (7.f3 455, 7.Be2 27); after 7.f3 (...Nc6 212, ...O-O 210); 8.Qd2 after 7...Nc6 213 and after 7...O-O 197; ninth move at the Yugoslav position (O-O-O 217, Bc4 139, g4 41); after 9.Bc4 (...Bd7 116, ...Nxd4 25, ...a6 10) [V]
- Engine claims: Stockfish 19 lite, single thread, depth 16 (npm stockfish@19.0.1), checked by tools/validate_lessons.py and tools/validate.py; evidence under recorded limits, not proof. Evaluations vary by tens of centipawns between runs, so claims use wide margins [V]
- content/items/lesson-od-l-od-dragon-3.json: every position is replayed move by move with python-chess from the stated sequence (provenance in the position records); the f2 edit position is a one-feature edit of the Yugoslav position [V]
- docs/citable-views.md 1.2 and 6.8 (Emanuel Lasker, Common Sense in Chess: every opening move should add working power; name the purpose of each move) [V-sheet]
- docs/citable-views.md 1.6 (Nimzowitsch, My System: development is collective) [V-sheet]
- docs/citable-views.md 1.11 and 1.13 (Capablanca: delay castling until the opponent's plan is known; an opening is judged by the concessions it forces) [V-sheet]
- docs/citable-views.md 4.12 (Edward Lasker, Chess Strategy: every pawn move leaves something behind) [V-sheet]
- Conjecture labelled [H] or [I] in the text is the author's own and is not checked: f3 as the least natural move of the set-up [I]; the order ...Bg7, ...O-O, ...Nc6 keeps ...Ng4 and ...d5 open [H]; every option kept open is also an option for the opponent [I]
- docs/lesson-depth-standard.md (series lesson 3: each side's set-up and what each move prepares)

## How to read this packet

Boards are drawn with capitals for White and lower case for Black, rank 8 at the top unless the board is shown from Black's side. Moves in a line are in standard notation. Statements marked [V] were machine-checked, [I] inference, [H] hypothesis, [S] secondary source, [R] recalled. Please judge the explanations, not only the moves: does each sentence tell the learner why?

---

## Chapter: A chain of promises

### Step 1: board

Caption: White to move (move 9). Each side has a knight and a bishop out, Black has castled, White has not. Look at the pawn on f3, the queen on d2 and the bishop still at home on f1. Why has White not castled yet, and where will the king go?

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

Drawn on the board: arrows f3-e4, d2-e3; highlighted squares f3, d2, f1, e1.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] White can castle long: the squares between king and rook are empty.
- [illegal_move] White cannot castle short yet: the bishop on f1 is still in the way.

### Step 2: reflect

Kind: expect

Prompt: Before any explanation, one sentence each, even if you are not sure: what job does the pawn on f3 do? What job does the queen on d2 do? You will come back to your answers at the end.

- Field "The pawn on f3:" (free text)

- Field "The queen on d2:" (free text)

### Step 3: card

**The question of this lesson.** The Yugoslav set-up is a chain of promises: each early move is a loan that a later move repays. By the end you can say, for each move, what it prepares. For White: the f-pawn, the queen, the bishop's square, long castling. For Black: the bishop on g7, castling, the knight, the bishop on d7, the rook on c8. You will also judge when the order matters. Emanuel Lasker is said to have urged naming each move's purpose (our synthesis sheet). [S]

### Step 4: board

Caption: Black to move after White's seventh move, the pawn to f3. Predict first: can Black's knight jump to g4 here? Then step through to see what happens.

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

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: rnbqk2r/pp2ppbp/3p1np1/8/3NP3/2N1BP2/PPP3PP/R2QKB1R b KQkq - 0 7
```

The line, with the sentence the learner sees at each move:
1. **7... Ng4**: The knight jumps to g4, attacking the bishop on e3.
2. **8. fxg4**: The pawn on f3 takes the knight. The knight cost Black three points and the pawn only one.

```
  8  r n b q k . . r
  7  p p . . p p b p
  6  . . . p . . p .
  5  . . . . . . . .
  4  . . . N P . P .
  3  . . N . B . . .
  2  P P P . . . P P
  1  R . . Q K B . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: rnbqk2r/pp2ppbp/3p2p1/8/3NP1P1/2N1B3/PPP3PP/R2QKB1R b KQkq - 0 8
```

Drawn on the board: arrows f6-g4, f3-g4; highlighted squares f3, g4.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [move_loses] At depth 16 the jump ...Ng4 costs Black at least three pawns here.
- [pawn_attackers] After the knight lands on g4, one white pawn (on f3) attacks it.
- [eval_range] At depth 16 the engine gives White a clear but small edge here (between about a third of a pawn and a pawn).

### Step 5: item

**Task `IOD-LODDRAGON3-1`** (predict_outcome, difficulty cue 2)

Now White's seventh move was the queen to d2 instead of the pawn to f3. Black to move. If the knight jumps to g4, can White win it?

```
  1  R . B K . . . R
  2  P P P . Q P P P
  3  . . . B . N . .
  4  . . . P N . . .
  5  . . . . . . . .
  6  . p n . p . . .
  7  p b p p . . p p
  8  r . . k q b n r
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: rnbqk2r/pp2ppbp/3p1np1/8/3NP3/2N1B3/PPPQ1PPP/R3KB1R b KQkq - 3 7
```

**Accepted answer:** {"outcome": "no"}

**Explanation shown:** No white piece attacks g4 once the knight lands there, and the engine rates the jump as Black's best move. Without the pawn on f3 the square g4 is free for Black's knight.

Hints (in order):
1. Count the white pieces that look at g4 after the jump. Which squares do the queen on d2 and the bishop on e3 attack?
2. The queen sees d2-e3 and the h6 diagonal, not g4. The pawn that could have guarded g4 stands on f2.
3. No white piece attacks g4, so the knight is safe there.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [attackers] After ...Ng4 no white piece attacks the knight on g4.
- [best_move_in] ...Ng4 is the engine's top move here (depth 16).

### Step 6: board

Caption: Black to move after the queen went to d2 (no f3). Step through the jump to g4 and see how White copes.

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
1. **7... Ng4**: The knight lands on g4 and attacks the bishop on e3.
2. **8. Bg5**: The bishop steps out of the attack to g5, where it eyes the pawn on e7.
3. **8... h6**: Black asks the bishop what it wants.
4. **9. Bb5+**: White checks with the second bishop.
5. **9... Bd7**: Black blocks the check; the bishop on d7 also keeps watching g4.
6. **10. Bh4**: The bishop retreats to h4. The knight is not in danger.

```
  8  r n . q k . . r
  7  p p . b p p b .
  6  . . . p . . p p
  5  . B . . . . . .
  4  . . . N P . n B
  3  . . N . . . . .
  2  P P P Q . P P P
  1  R . . . K . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: rn1qk2r/pp1bppb1/3p2pp/1B6/3NP1nB/2N5/PPPQ1PPP/R3K2R b KQkq - 3 10
```

Drawn on the board: arrows f6-g4, e3-g4; highlighted squares g4, d2.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [eval_range] At depth 16 the engine rates this position as level: within a third of a pawn of zero.
- [attackers] After ...Ng4 no white piece attacks the knight.

### Step 7: item

**Task `IOD-LODDRAGON3-2`** (predict_outcome, difficulty cue 2)

White's seventh move was the bishop to e2 this time. Black to move. Is the square g4 guarded by a white piece?

```
  1  R . . K Q . . R
  2  P P P B . P P P
  3  . . . B . N . .
  4  . . . P N . . .
  5  . . . . . . . .
  6  . p n . p . . .
  7  p b p p . . p p
  8  r . . k q b n r
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: rnbqk2r/pp2ppbp/3p1np1/8/3NP3/2N1B3/PPP1BPPP/R2QK2R b KQkq - 3 7
```

**Accepted answer:** {"outcome": "yes"}

**Explanation shown:** The bishop on e2 attacks g4 through the empty square f3, so a knight on g4 can be taken.

Hints (in order):
1. Look along the diagonal from e2 towards the h5 corner. What stands between e2 and g4?
2. f3 is empty, so the bishop on e2 sees f3 and g4.
3. Yes: the bishop on e2 guards g4.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [attackers] One white piece (the bishop on e2) attacks g4.

### Step 8: board

Caption: Same position after the bishop went to e2. Step through ...Ng4: a bishop now guards g4, so see what the jump costs Black.

```
  8  r n b q k . . r
  7  p p . . p p b p
  6  . . . p . n p .
  5  . . . . . . . .
  4  . . . N P . . .
  3  . . N . B . . .
  2  P P P . B P P P
  1  R . . Q K . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: rnbqk2r/pp2ppbp/3p1np1/8/3NP3/2N1B3/PPP1BPPP/R2QK2R b KQkq - 3 7
```

The line, with the sentence the learner sees at each move:
1. **7... Ng4**: The knight jumps to g4, but now a bishop guards that square.
2. **8. Bxg4**: White takes the knight with the bishop.
3. **8... Bxg4**: Black retakes with the bishop. It looks like an even trade, but nothing defends the bishop on g4.
4. **9. Qxg4**: The queen takes the bishop: the diagonal from d1 is open. Black has lost a whole piece.

```
  8  r n . q k . . r
  7  p p . . p p b p
  6  . . . p . . p .
  5  . . . . . . . .
  4  . . . N P . Q .
  3  . . N . B . . .
  2  P P P . . P P P
  1  R . . . K . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: rn1qk2r/pp2ppbp/3p2p1/8/3NP1Q1/2N1B3/PPP2PPP/R3K2R b KQkq - 0 9
```

Drawn on the board: arrows e2-g4; highlighted squares e2, g4.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [attackers] After the exchange on g4, White's queen attacks the bishop on g4.
- [attackers] No black piece defends the bishop on g4.
- [best_move_in] The knight to c6 and castling are Black's two best replies to the bishop on e2 (depth 16); the jump to g4 is not among them.
- [eval_range] At depth 16 the engine gives White a small edge here (up to half a pawn).

### Step 9: reflect

Kind: expect

Prompt: Three seventh moves, one difference each time. In your own words: what does the pawn on f3 do that the queen on d2 and the bishop on e2 do not?

- Field "The pawn on f3:" (free text)

### Step 10: board

Caption: The spine of the lesson: the whole set-up on one board, White to move after ...g6. Step through it and ask of every move: what does this make possible later?

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
1. **6. Be3**: The bishop takes the best diagonal, guards d4 and clears c1, so the king will have a square.
2. **6... Bg7**: Black's bishop shelters the future castled king and will bite along the long diagonal.
3. **7. f3**: The pawn supports e4 and g4. The price: the square f3 and the pawn's guard of e3.
4. **7... O-O**: Black's king goes behind its shelter. Now White knows where the king should go.
5. **8. Qd2**: The queen guards the bishop on e3, clears d1 and looks towards h6.
6. **8... Nc6**: The knight attacks d4. White's knight is guarded twice, so this is a question, not a threat.
7. **9. O-O-O**: The king goes to c1 and the rook to d1. Every earlier move has now been used.

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

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r1bq1rk1/pp2ppbp/2np1np1/8/3NP3/2N1BP2/PPPQ2PP/2KR1B1R b - - 4 9
```

Drawn on the board: arrows e3-d4, f3-e4, d2-e3; highlighted squares e3, f3, d2.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [attackers] After f3, two white pieces defend e4.
- [attackers] After Qd2 the queen guards the bishop on e3.
- [attackers] After ...Nc6 the knight attacks d4.
- [king_wing] At the end White's king is on the queenside.
- [king_wing] At the end Black's king is on the kingside.

## Chapter: Four ideas of the set-up

### Step 11: card

**Idea 1: support the pawn on e4.** White's pawn on e4 is attacked by Black's knight on f6 and held only by the knight on c3. The pawn on f3 is the second defender, and it also takes g4 away from Black's knight. [I] Of all the moves in the set-up, f3 is the least natural for a beginner: it takes the f3 square from the knight on d4 and loosens the king. Treat it as a price White pays on purpose.

### Step 12: board

Caption: The Yugoslav position again. Count the defenders of e4: the knight on c3 and the pawn on f3. Black attacks it once, with the knight on f6.

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

Drawn on the board: arrows c3-e4, f3-e4, f6-e4; highlighted squares e4.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [attackers] Two white pieces attack (defend) e4.
- [attackers] One black piece attacks e4.
- [pawn_attackers] One of the two defenders is a pawn.

### Step 13: board

Caption: Edited position, not from a game: the pawn is put back on f2. Now e4 has one defender, and look at what the pawn on f2 guarded: the squares e3 and g3.

```
  8  r . b q . r k .
  7  p p . . p p b p
  6  . . n p . n p .
  5  . . . . . . . .
  4  . . . N P . . .
  3  . . N . B . . .
  2  P P P Q . P P P
  1  R . . . K B . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: r1bq1rk1/pp2ppbp/2np1np1/8/3NP3/2N1B3/PPPQ1PPP/R3KB1R w KQ - 3 9
```

Drawn on the board: arrows f2-e3, f2-g3; highlighted squares f2, e3, g3.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [attackers] With the pawn on f2, only one white piece defends e4.
- [pawn_attackers] The pawn on f2 attacks (guards) e3.
- [piece_on] The edited position has a white pawn on f2.

### Step 14: item

**Task `IOD-LODDRAGON3-3`** (select_squares, difficulty cue 2)

Edited position: the white pawn stands on f2. Tap every square the pawn on f2 guards.

```
  8  r . b q . r k .
  7  p p . . p p b p
  6  . . n p . n p .
  5  . . . . . . . .
  4  . . . N P . . .
  3  . . N . B . . .
  2  P P P Q . P P P
  1  R . . . K B . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: r1bq1rk1/pp2ppbp/2np1np1/8/3NP3/2N1B3/PPPQ1PPP/R3KB1R w KQ - 3 9
```

**Accepted answer:** squares e3, g3

**Explanation shown:** A white pawn guards the two squares diagonally ahead of it. From f2 that is e3 and g3. After f3 those two squares lose their pawn guard.

Hints (in order):
1. A pawn guards the two squares diagonally in front of it.
2. White pawns move up the board. In front of f2 are the files e and g.
3. e3 and g3.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [piece_attacks] The pawn on f2 attacks exactly e3 and g3.

### Step 15: card

**The price of f3.** Edward Lasker advised asking which squares a pawn push stops guarding (our synthesis sheet; he meant pawns near a castled king, so here it applies by analogy). [S][I] The pawn on f2 guarded e3 and g3. On f3 it guards e4 and g4 instead, takes the knight's retreat square, and leaves the bishop on e3 with no pawn behind it. That is why the queen comes to d2 next: it takes over the guard of e3. One loan, one repayment.

### Step 16: board

Caption: Count the guards of the bishop on e3 in the real position. The pawn no longer guards it; the queen on d2 does.

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

Drawn on the board: arrows d2-e3; highlighted squares e3, d2.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [attackers] One white piece guards the bishop on e3: the queen.
- [pawn_attackers] No white pawn guards e3 now.

### Step 17: board

Caption: Payoff of f3, first board. The pawn on g4 is defended by the pawn on f3. Step through: it is the start of White's pawn storm.

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
1. **9. g4**: The pawn leaps to g4. It is guarded by the pawn on f3, and it threatens to run on to g5 and chase the knight.
2. **9... Be6**: Black's bishop eyes the g4 pawn and the knight on d4.
3. **10. Nxe6**: White trades the knight for the bishop, removing the piece that attacked g4.
4. **10... fxe6**: Black retakes; the f-file opens for Black's rook.
5. **11. O-O-O**: White castles long: the king is out of the way of the pawn storm.

```
  8  r . . q . r k .
  7  p p . . p . b p
  6  . . n p p n p .
  5  . . . . . . . .
  4  . . . . P . P .
  3  . . N . B P . .
  2  P P P Q . . . P
  1  . . K R . B . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r2q1rk1/pp2p1bp/2nppnp1/8/4P1P1/2N1BP2/PPPQ3P/2KR1B1R b - - 1 11
```

Drawn on the board: arrows f3-g4; highlighted squares f3, g4.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] g4 is one of the engine's four best moves here (depth 16).
- [pawn_attackers] The pawn on g4 is attacked (guarded) by the pawn on f3.

### Step 18: item

**Task `IOD-LODDRAGON3-4`** (predict_outcome, difficulty cue 3)

White to move. Find a move that starts the pawn storm.

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

**Accepted answer:** {"outcome": "g2-g4"}

**Explanation shown:** A white pawn arriving on g4 is guarded by the pawn on f3, which attacks g4 and e4. The engine rates g4 among White's four best moves here.

Hints (in order):
1. Which of the four moves lands on a square the pawn on f3 attacks?
2. A pawn attacks the two squares diagonally in front of it: e4 and g4.
3. The move g2-g4.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [pawn_attackers] A pawn on g4 would be guarded by the pawn on f3.
- [best_move_in] g4 is one of the engine's four best moves (depth 16).

### Step 19: board

Caption: Payoff of f3, second board, from the main line (13th move, White to move). Two pawn levers, both protected by the pawn on f3: step through the h-pawn and g-pawn attack.

```
  8  . . r q r . k .
  7  p p . b p p b p
  6  . . . p . n p .
  5  . . . . n . . .
  4  . . . N P . . .
  3  . B N . B P . .
  2  P P P Q . . P P
  1  . K . R . . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 2rqr1k1/pp1bppbp/3p1np1/4n3/3NP3/1BN1BP2/PPPQ2PP/1K1R3R w - - 11 13
```

The line, with the sentence the learner sees at each move:
1. **13. h4**: The h-pawn starts the storm. Black's knight on e5 and the rook on e8 are already set to meet it.
2. **13... h5**: Black's usual reply is to stop the pawn with the h-pawn. [H] I have not counted this in the master tree.
3. **14. g4**: White offers the g-pawn. If Black takes, his h-pawn has left the h-file.
4. **14... hxg4**: Black takes. White does not retake at once: the pawn on g4 will be won back with play on the open file.
5. **15. h5**: The pawn push attacks the pawn on g6.
6. **15... Nxh5**: The knight takes the pawn on h5. Now neither side has a pawn on the h-file.
7. **16. Bh6**: The bishop heads for h6 at last: the knight on d4 is no longer attacked, because the c6 knight is gone. Engine: about one pawn for White here (depth 16).

```
  8  . . r q r . k .
  7  p p . b p p b .
  6  . . . p . . p B
  5  . . . . n . . n
  4  . . . N P . p .
  3  . B N . . P . .
  2  P P P Q . . . .
  1  . K . R . . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 2rqr1k1/pp1bppb1/3p2pB/4n2n/3NP1p1/1BN2P2/PPPQ4/1K1R3R b - - 1 16
```

Drawn on the board: arrows h1-h5, f3-g4; highlighted squares h4, g4, f3.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] h4 and g4 are the engine's top two moves (depth 16, within 0.4 pawns).
- [open_files] After the exchanges the h-file is open and the g-file is half-open for White.
- [pawn_attackers] A pawn on g4 would be attacked (guarded) by the pawn on f3.

### Step 20: card

**Idea 2: the queen on d2 does three jobs.** It guards the bishop on e3 (the pawn no longer can). It frees d1, so the king can castle long. And it looks down the diagonal to h6, which matters once the bishop steps away to trade off Black's dragon bishop. A fourth idea is conditional, and the next board shows why.

### Step 21: board

Caption: Three jobs of the queen on d2, on one board: it guards the bishop on e3, it has left d1 so the king can castle, and once the bishop moves away it looks down the diagonal to h6.

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
1. **9. Bh6**: The bishop heads for h6. The queen follows along the same diagonal and defends it from d2.

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

Drawn on the board: arrows d2-h6; highlighted squares d2, h6, d1.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [attackers] The queen guards the bishop on e3.
- [legal_move] With d1 empty, castling long is legal.
- [attackers] After the bishop reaches h6 the queen on d2 defends it along the diagonal.

### Step 22: board

Caption: The trade on h6 as a plan. Step through it here, and then look at the knight on d4: what happens to it when the bishop leaves e3?

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
1. **9. Bh6**: The bishop heads for h6 to trade off Black's strongest piece.
2. **9... Bxh6**: Black takes.
3. **10. Qxh6**: The queen retakes. It could do so because the bishop left the diagonal.
4. **10... Nxd4**: The knight on c6 takes the knight on d4. The bishop and queen no longer guard d4, so nothing recaptures.

```
  8  r . b q . r k .
  7  p p . . p p . p
  6  . . . p . n p Q
  5  . . . . . . . .
  4  . . . n P . . .
  3  . . N . . P . .
  2  P P P . . . P P
  1  R . . . K B . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r1bq1rk1/pp2pp1p/3p1npQ/8/3nP3/2N2P2/PPP3PP/R3KB1R w KQ - 0 11
```

Drawn on the board: arrows c6-d4, e3-d4, d2-d4; highlighted squares d4, e3, d2.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [move_loses] At depth 16 the bishop trade on h6 costs White at least three pawns in this position.
- [attackers] One black piece attacks d4: the knight on c6.
- [attackers] Two white pieces defend d4: the bishop on e3 and the queen on d2.

### Step 23: item

**Task `IOD-LODDRAGON3-5`** (predict_outcome, difficulty cue 3)

White to move. Is the bishop trade on h6 (bishop e3 to h6) a good idea in this exact position?

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

**Accepted answer:** {"outcome": "no"}

**Explanation shown:** The bishop on e3 is one of d4's two defenders. After the bishop is taken on h6 and the queen retakes, nothing defends d4 and the knight on c6 wins the knight. A plan needs its conditions checked first.

Hints (in order):
1. Who defends the knight on d4 right now, and who attacks it?
2. The bishop on e3 and the queen on d2 defend d4. If the bishop goes to h6 and is traded, what is left?
3. After the trade nothing defends the knight on d4, and the knight on c6 attacks it.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [move_loses] At depth 16, e3-h6 loses at least three pawns in this position.

### Step 24: board

Caption: Now the same bishop trade when the knight has left d4 (White's ninth move was the knight to b3, Black developed the bishop to e6 and played ...a6). White to move. Step through: the trade now works.

```
  8  r . . q . r k .
  7  . p . . p p b p
  6  p . n p b n p .
  5  . . . . . . . .
  4  . . . . P . . .
  3  . N N . B P . .
  2  P P P Q . . P P
  1  . . K R . B . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: r2q1rk1/1p2ppbp/p1npbnp1/8/4P3/1NN1BP2/PPPQ2PP/2KR1B1R w - - 0 11
```

The line, with the sentence the learner sees at each move:
1. **11. Bh6**: The bishop heads for h6. The knight no longer stands on d4, so the bishop is free to leave.
2. **11... Bxh6**: Black takes the bishop.
3. **12. Qxh6**: The queen retakes: Black's dragon bishop is gone, and the queen on h6 stands near Black's king.
4. **12... Qb6**: Black answers by attacking the knight on b3.

```
  8  r . . . . r k .
  7  . p . . p p . p
  6  p q n p b n p Q
  5  . . . . . . . .
  4  . . . . P . . .
  3  . N N . . P . .
  2  P P P . . . P P
  1  . . K R . B . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r4rk1/1p2pp1p/pqnpbnpQ/8/4P3/1NN2P2/PPP3PP/2KR1B1R w - - 1 13
```

Drawn on the board: arrows e3-h6, d2-h6; highlighted squares h6, d4.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [piece_on] The square d4 is empty: the knight has gone to b3.
- [best_move_in] Kb1, h4, g4 and Bh6 all lie within 0.4 pawns of the engine's best move (depth 16).

### Step 25: contrast

Title: Does the trade on h6 work?

Prompt: Predict first. Both positions have the same bishop on e3 and the same queen on d2. In one, Black's knight stands on c6, ready to take on d4. In the other it is still at home on b8. Nothing else differs.

**The working board:**

**Task `IOD-LODDRAGON3-6`** (predict_outcome, difficulty cue 2)

White to move. Black's knight is still on b8, not on c6. Is the bishop trade on h6 playable here, losing no material?

```
  8  r n b q . r k .
  7  p p . . p p b p
  6  . . . p . n p .
  5  . . . . . . . .
  4  . . . N P . . .
  3  . . N . B P . .
  2  P P P Q . . P P
  1  R . . . K B . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: rnbq1rk1/pp2ppbp/3p1np1/8/3NP3/2N1BP2/PPPQ2PP/R3KB1R w KQ - 3 9
```

**Accepted answer:** {"outcome": "yes"}

**Explanation shown:** With Black's knight still on b8 nothing attacks d4, so the bishop can leave its guard post and the trade loses no material. The engine still prefers long castling or g4, but the trade is playable. Compare the same position with the knight on c6.

Hints (in order):
1. Who attacks the knight on d4 in this position?
2. Black's knight is still on b8, so nothing attacks d4; the bishop is free to leave.
3. Yes: the trade loses no material.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [material_after_move] The trade on h6 loses no material (bishop for bishop).
- [attackers] No black piece attacks the knight on d4.

**The failing board:**

**Task `IOD-LODDRAGON3-5`** (predict_outcome, difficulty cue 3)

White to move. Is the bishop trade on h6 (bishop e3 to h6) a good idea in this exact position?

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

**Accepted answer:** {"outcome": "no"}

**Explanation shown:** The bishop on e3 is one of d4's two defenders. After the bishop is taken on h6 and the queen retakes, nothing defends d4 and the knight on c6 wins the knight. A plan needs its conditions checked first.

Hints (in order):
1. Who defends the knight on d4 right now, and who attacks it?
2. The bishop on e3 and the queen on d2 defend d4. If the bishop goes to h6 and is traded, what is left?
3. After the trade nothing defends the knight on d4, and the knight on c6 attacks it.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [move_loses] At depth 16, e3-h6 loses at least three pawns in this position.

### Step 26: card

**Idea 3: Black has castled, so White castles long.** Capablanca advised delaying castling until the opponent's plan is known. [S] Black's king is already on g8, which is a reason to prefer long castling, not a rule. [I] Why not castle short? The bishop on f1 still blocks the way, and a king on g1 would stand where White's own pawns are about to advance. [I] Qd2, the bishop on e3 and the empty squares b1, c1 and d1 prepared long castling.

### Step 27: board

Caption: Step through White's long castling. Look at where the king and the rook stand afterwards.

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
1. **9. O-O-O**: The king goes to c1 and the rook to d1. The rook stands behind the queen on the half-open d-file, and the king is far from the coming pawn storm.

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

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r1bq1rk1/pp2ppbp/2np1np1/8/3NP3/2N1BP2/PPPQ2PP/2KR1B1R b - - 4 9
```

Drawn on the board: arrows a1-d1, e1-c1; highlighted squares c1, d1.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [king_wing] After castling long, White's king is on the queenside.
- [king_wing] Black's king is on the kingside.
- [attackers] The knight on d4 stays defended twice after castling (bishop and queen).
- [piece_on] The rook stands on d1 after castling.

### Step 28: item

**Task `IOD-LODDRAGON3-7`** (find_move, difficulty cue 3)

White to move (Black has just castled). Find White's best move.

```
  8  r n b q . r k .
  7  p p . . p p b p
  6  . . . p . n p .
  5  . . . . . . . .
  4  . . . N P . . .
  3  . . N . B P . .
  2  P P P . . . P P
  1  R . . Q K B . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: rnbq1rk1/pp2ppbp/3p1np1/8/3NP3/2N1BP2/PPP3PP/R2QKB1R w KQ - 1 8
```

**Accepted answer(s):** Qd2

Feedback shown for wrong moves:
- g4: A good move too, but it does not clear d1 yet, so long castling stays impossible.
- Bc4: Playable, but it does not yet prepare long castling.

**Explanation shown:** Long castling is illegal while the queen stands on d1. The queen to d2 clears d1, guards the bishop on e3 and, later, prepares the trade on h6. The engine ranks it first (depth 16).

Hints (in order):
1. White cannot castle long yet. Which piece stands between king and rook?
2. The queen on d1. Which developing move frees d1 and guards the bishop on e3?
3. The queen to d2.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] Qd2 is the engine's top move here (depth 16).
- [illegal_move] Castling long is illegal now: the queen still stands on d1.

### Step 29: card

**Idea 4: the bishop on c4 stops ...d5.** Black's freeing break ...d5 attacks e4. With the bishop still on f1 it works. With the bishop on c4, three white pieces attack d5 and a pawn arriving there has only two defenders. The bishop also eyes f7 and has a retreat square on b3. Check the count on the next board before you trust it.

### Step 30: board

Caption: Black to move after the bishop went to c4. Count who controls d5, then step through what happens if Black plays ...d5 anyway.

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
1. **9... d5**: Black tries the freeing break; the pawn attacks e4.
2. **10. exd5**: White takes the pawn; it now attacks the knight on c6.
3. **10... Na5**: The knight leaves with a threat to the bishop.
4. **11. Bb3**: The bishop retreats to b3, where it still watches d5.
5. **11... Nxb3**: Black trades the knight for the bishop.
6. **12. Nxb3**: White retakes; the pawn on d5 is still there and Black's break has not freed anything.

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

Drawn on the board: arrows c4-d5, c3-d5, e4-d5, f6-d5; highlighted squares d5, c4.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [attackers] Three white pieces attack d5: the bishop on c4, the knight on c3 and the pawn on e4.
- [attackers] After ...d5 two black pieces defend the pawn on d5: the knight on f6 and the queen.
- [move_loses] At depth 16 the break ...d5 costs Black at least 0.3 pawns here.

## Chapter: Black's moves and move orders

### Step 31: card

**Black's moves are promises too.** The bishop on g7 shelters the castled king and later looks down the long diagonal. Castling puts the king behind f7, g6 and h7. The knight on c6 attacks d4. The bishop on d7 clears c8 for a rook and guards the knight. The rook on c8 uses the half-open c-file. Test each against a board: which of them can Black play at once, and which depend on White's move?

### Step 32: board

Caption: Black to move after White's sixth move. First question: which piece comes first? Step through the usual order and watch the king's shelter.

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
1. **6... Bg7**: The bishop to g7 shelters the king and aims along the long diagonal; it bites once the knight on f6 steps away.
2. **7. f3**: White plays the support move.
3. **7... O-O**: Black castles: the king stands behind the bishop and the pawns on f7, g6 and h7.

```
  8  r n b q . r k .
  7  p p . . p p b p
  6  . . . p . n p .
  5  . . . . . . . .
  4  . . . N P . . .
  3  . . N . B P . .
  2  P P P . . . P P
  1  R . . Q K B . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: rnbq1rk1/pp2ppbp/3p1np1/8/3NP3/2N1BP2/PPP3PP/R2QKB1R w KQ - 1 8
```

Drawn on the board: arrows g7-d4; highlighted squares g7.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] Bg7, Nc6, a6 and Bd7 are all within 0.4 pawns of each other at depth 16: the engine does not force the bishop to come first.
- [king_pawn_shield] After castling, Black's three shield pawns are f7, g6 and h7.

### Step 33: reflect

Kind: expect

Prompt: Masters (our data, both players 2500+, 579 games after the bishop went to e3): the bishop to g7 came first in 490 games, the knight to c6 in 59, the pawn to a6 in 30. The engine sees little difference. [H] My guess: the bishop first keeps both the knight jump to g4 and the break d5 available for longer. Do you agree, or can you think of a better reason?

- Field "My reason:" (free text)

### Step 34: card

**Black's order: what is known, what is guessed.** Known: the bishop to g7 is overwhelmingly first in master games. [V] Guesses: the bishop has no drawback while the options g4 and d5 stay open [H]; the knight to c6 first lets White choose among set-ups [H]; the bishop leaves c8 early because it blocks the rook on a8 from the c-file (the exercise on the rook shows this). [V] None of the guesses is tested against master games.

### Step 35: board

Caption: Black to move (move 8, after Qd2). Step through the knight to c6: it attacks the knight on d4, so White has to have an answer. Count the defenders.

```
  8  r n b q . r k .
  7  p p . . p p b p
  6  . . . p . n p .
  5  . . . . . . . .
  4  . . . N P . . .
  3  . . N . B P . .
  2  P P P Q . . P P
  1  R . . . K B . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: rnbq1rk1/pp2ppbp/3p1np1/8/3NP3/2N1BP2/PPPQ2PP/R3KB1R b KQ - 2 8
```

The line, with the sentence the learner sees at each move:
1. **8... Nc6**: The knight attacks d4. White's knight is defended twice, by the bishop and the queen, so nothing is lost.

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

Drawn on the board: arrows c6-d4, e3-d4, d2-d4; highlighted squares d4, c6.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [attackers] After ...Nc6 one black piece attacks d4.
- [attackers] Two white pieces defend d4.

### Step 36: item

**Task `IOD-LODDRAGON3-8`** (select_squares, difficulty cue 2)

Black to move. Tap every square the rook on a8 can reach right now.

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

**Accepted answer:** squares b8 (from a8)

**Explanation shown:** The bishop on c8 blocks the rook. That is why Black's next job is the bishop: it has to leave c8 before a rook can use the c-file.

Hints (in order):
1. Look at the squares next to the rook along the back rank.
2. b8 is empty. What stands on c8?
3. Only b8.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_destinations] The rook on a8 can only go to b8: the bishop on c8 blocks the way.

### Step 37: board

Caption: Black to move after the bishop went to c4. Step through the three setup moves: bishop to d7, White castles, rook to c8.

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
1. **9... Bd7**: The bishop leaves c8, guards the knight on c6 and prepares the rook.
2. **10. O-O-O**: White castles long.
3. **10... Rc8**: The rook takes the c-file. The knight on c6 stands in front of it for now.

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

Drawn on the board: arrows c8-c3; highlighted squares c8, c6, d7.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [open_files] The c-file is half-open for Black and the d-file half-open for White.
- [piece_attacks] The rook on c8 attacks a8, b8, c7, c6 and d8.

### Step 38: board

Caption: Black to move after White castled long. The usual move is the rook to c8 (58 master games here); the rook to b8 is the other (15 games). Step through the b8 idea: the rook backs the pawn on b5.

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
1. **10... Rb8**: The rook goes to b8 to support a later ...b5.
2. **11. Kb1**: White tucks the king away on b1.
3. **11... Ne5**: The knight jumps to e5, attacking the bishop on c4.
4. **12. Be2**: The bishop retreats to e2 and loses time.
5. **12... a6**: Black prepares ...b5.
6. **13. g4**: White starts the pawn storm.

```
  8  . r . q . r k .
  7  . p . b p p b p
  6  p . . p . n p .
  5  . . . . n . . .
  4  . . . N P . P .
  3  . . N . B P . .
  2  P P P Q B . . P
  1  . K . R . . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 1r1q1rk1/1p1bppbp/p2p1np1/4n3/3NP1P1/2N1BP2/PPPQB2P/1K1R3R b - - 0 13
```

Drawn on the board: arrows b8-b5; highlighted squares b8.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] Rb8 and Rc8 are the engine's two best moves here (depth 16, within 0.4 pawns); masters chose Rc8 in 58 games and Rb8 in 15.
- [eval_range] At depth 16 the engine gives White between 0.3 and 1.1 pawns here.

### Step 39: board

Caption: White to move after ...Rc8 (the position the setup moves lead to). The bishop on c4 is not attacked yet, because the knight on c6 stands in front of the rook. Step through the retreat and watch the c-file.

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

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 2rq1rk1/pp1bppbp/2np1np1/8/2BNP3/2N1BP2/PPPQ2PP/2KR3R w - - 7 11
```

The line, with the sentence the learner sees at each move:
1. **11. Bb3**: The bishop steps back to b3. It keeps the diagonal to d5 and f7 and leaves the c-file.
2. **11... Nxd4**: The knight trades on d4. The knight stepped aside and uncovered the rook's view of c4 and c3.

```
  8  . . r q . r k .
  7  p p . b p p b p
  6  . . . p . n p .
  5  . . . . . . . .
  4  . . . n P . . .
  3  . B N . B P . .
  2  P P P Q . . P P
  1  . . K R . . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 2rq1rk1/pp1bppbp/3p1np1/8/3nP3/1BN1BP2/PPPQ2PP/2KR3R w - - 0 12
```

Drawn on the board: arrows c8-c4; highlighted squares c8, c6, c4.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [attackers] Right now no black piece attacks c4: the knight on c6 blocks the rook.
- [attackers] After the knight leaves c6, the rook on c8 attacks c4 (empty after the retreat).

### Step 40: board

Caption: Black to move after White's bishop retreated to b3. Black has two plans for the knight. First plan: the trade on d4, which opens the c-file for the rook. Step through it and count what the rook attacks.

```
  8  . . r q . r k .
  7  p p . b p p b p
  6  . . n p . n p .
  5  . . . . . . . .
  4  . . . N P . . .
  3  . B N . B P . .
  2  P P P Q . . P P
  1  . . K R . . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: 2rq1rk1/pp1bppbp/2np1np1/8/3NP3/1BN1BP2/PPPQ2PP/2KR3R b - - 8 11
```

The line, with the sentence the learner sees at each move:
1. **11... Nxd4**: The knight trades itself off. It was standing in front of the rook.
2. **12. Bxd4**: White recaptures with the bishop, which now eyes the dragon bishop's diagonal.
3. **12... b5**: The b-pawn starts to roll, preparing ...b4 to chase the knight on c3.

```
  8  . . r q . r k .
  7  p . . b p p b p
  6  . . . p . n p .
  5  . p . . . . . .
  4  . . . B P . . .
  3  . B N . . P . .
  2  P P P Q . . P P
  1  . . K R . . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 2rq1rk1/p2bppbp/3p1np1/1p6/3BP3/1BN2P2/PPPQ2PP/2KR3R w - - 0 13
```

Drawn on the board: arrows c8-c3; highlighted squares c8, c3.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [attackers] After the trade on d4 the rook on c8 attacks the knight on c3.
- [attackers] Three white pieces defend c3: the b2 pawn, the queen and the bishop on d4.
- [best_move_in] Nxd4 and Ne5 are the engine's best two moves here (depth 16, within 0.6 pawns).

### Step 41: board

Caption: Second plan: the knight goes to e5 and then to c4, the outpost square. The position comes from the master games (12.Kb1, Black to move). Step through the exchange on c4.

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
1. **12... Nc4**: The knight reaches c4: it attacks the queen on d2 and the pawn on b2.
2. **13. Bxc4**: White removes the knight with the bishop.
3. **13... Rxc4**: The rook retakes and now stands on c4, attacking the knight on d4 from the side.
4. **14. g4**: White starts the pawn storm.
5. **14... b5**: Black's b-pawn answers by rolling forward.

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

Drawn on the board: arrows c4-d2, c4-b2; highlighted squares c4, d2.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [piece_attacks] A knight on c4 attacks a3, a5, b2, b6, d2, d6, e3 and e5.
- [attackers] After the exchange on c4 the rook attacks the knight on d4.
- [eval_range] At depth 16 the engine gives White between 0.3 and 1.3 pawns here.

### Step 42: board

Caption: Black to move after the bishop went to c4. A third setup idea: the queen to a5, one of the engine's top three moves here. It presses on the knight on c3. Step through the usual continuation.

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
1. **9... Qa5**: The queen goes to a5, pressing on the knight on c3 and the pawn on a2.
2. **10. O-O-O**: White castles long as planned.
3. **10... Nxd4**: The knight trades on d4.
4. **11. Bxd4**: White recaptures with the bishop.
5. **11... Be6**: Black's bishop goes to e6 to trade the bishop on c4.
6. **12. Bb3**: White retreats the bishop to b3.
7. **12... b5**: Black pushes the b-pawn, as in the other plans.

```
  8  r . . . . r k .
  7  p . . . p p b p
  6  . . . p b n p .
  5  q p . . . . . .
  4  . . . B P . . .
  3  . B N . . P . .
  2  P P P Q . . P P
  1  . . K R . . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r4rk1/p3ppbp/3pbnp1/qp6/3BP3/1BN2P2/PPPQ2PP/2KR3R w - - 0 13
```

Drawn on the board: arrows a5-c3; highlighted squares a5, c3.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] Qa5, Bd7 and Nxd4 are the engine's top three moves (depth 16, within 0.4 pawns); masters chose Bd7 in 116 of the games here.
- [eval_range] At depth 16 the engine gives White between 0.3 and 1.1 pawns here.

## Chapter: What the engine and masters say

### Step 43: card

**Three plans, one verdict.** In each starting position the engine gives White between half a pawn and a pawn (depth 16, varying by run): playable for Black, not equalising. [V] Black's counterplay shares three ideas: a rook on the c-file, the push of the b-pawn, and a reply with the h-pawn when White starts the h-pawn storm. [H] A rook-for-knight sacrifice on c3 is another idea of this kind; I have not checked it in these positions. [H]

### Step 44: card

**The order, from master games** (329,379 games, both players 2500+; counts of choices, not verdicts). [V] Masters mostly reach the same set-up; only the order varies. White played f3 as the seventh move in 455 games and the bishop to e2 in 27. Against f3, Black castled in 210 games and developed the knight in 212. Different roads, one destination: the next four boards.

### Step 45: board

Caption: Road one: Black develops the knight first, White develops the queen, Black castles. Step through it.

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

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: rnbqk2r/pp2ppbp/3p1np1/8/3NP3/2N1BP2/PPP3PP/R2QKB1R b KQkq - 0 7
```

The line, with the sentence the learner sees at each move:
1. **7... Nc6**: The knight attacks d4 at once.
2. **8. Qd2**: The queen guards the bishop on e3 and clears d1.
3. **8... O-O**: Black castles. This is the position from the first board of the lesson.

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

Drawn on the board: arrows b8-c6; highlighted squares c6, g8.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [piece_on] A black knight stands on c6 at the end.
- [piece_on] The black king stands on g8 at the end.
- [piece_on] The white queen stands on d2 at the end.

### Step 46: board

Caption: Road two: Black castles first, White develops the queen, Black plays the knight. Step through it and compare the final position with road one.

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

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: rnbqk2r/pp2ppbp/3p1np1/8/3NP3/2N1BP2/PPP3PP/R2QKB1R b KQkq - 0 7
```

The line, with the sentence the learner sees at each move:
1. **7... O-O**: The king goes to safety first.
2. **8. Qd2**: The queen goes to d2, exactly as before.
3. **8... Nc6**: The knight comes out. This is the position from the first board of the lesson. The position is identical to road one.

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

Drawn on the board: arrows e8-g8; highlighted squares c6, g8.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [piece_on] A black knight stands on c6 at the end.
- [piece_on] The black king stands on g8 at the end.
- [piece_on] The white queen stands on d2 at the end.
- [piece_on] The rook stands on f8 at the end.

### Step 47: board

Caption: Road three starts earlier: White plays f3 as the sixth move (25 games). Black to move. Step through to the same position again.

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
1. **6... Bg7**: The bishop develops; the f-pawn is already on f3.
2. **7. Be3**: The bishop goes to e3. With the pawn already on f3, only the queen will be able to guard it later.
3. **7... O-O**: Black castles.
4. **8. Qd2**: The queen guards the bishop and clears d1.
5. **8... Nc6**: The knight comes out. Same position, third road.

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

Drawn on the board: arrows f3-e4; highlighted squares f3.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [eval_range] At depth 16 the engine gives White a small edge after the early f3 as well (between 0.3 and 1 pawn).
- [piece_on] The white queen stands on d2 at the end.
- [piece_on] A black knight stands on c6 at the end.
- [piece_on] The white bishop stands on e3 at the end.

### Step 48: board

Caption: Road four starts earlier: the queen first (White's seventh move), Black develops the knight, White plays f3 and Black castles. Black to move. Step through; the position is the same once more.

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
1. **7... Nc6**: The knight attacks d4. This is one of Black's choices after the queen move.
2. **8. f3**: The support move, played one move late.
3. **8... O-O**: Black castles. The position is the Yugoslav position again. Black could instead have played ...Ng4 at move seven, which is why White prefers f3 first.

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
FEN: r1bq1rk1/pp2ppbp/2np1np1/8/3NP3/2N1BP2/PPPQ2PP/R3KB1R w KQ - 1 9
```

Drawn on the board: arrows f2-f3; highlighted squares f3.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [piece_on] A black knight stands on c6 at the end.
- [piece_on] The white pawn stands on f3 at the end.
- [piece_on] The black king stands on g8 at the end.

### Step 49: reflect

Kind: expect

Prompt: The same position is reached by four roads. Which road gives Black the most options, and which gives White the most? Write one sentence. [I] My view: the road decides who can choose, not what the position is.

- Field "My answer:" (free text)

### Step 50: card

**What slowness gives away.** Emanuel Lasker asked that each opening move add working power; Nimzowitsch, by our synthesis sheet, stressed the whole army working together. [S] By that test the early queen move is slow: it gives Black ...Ng4 and the evaluation falls from a small White edge to level. The bishop to e2 is slow in another way: it lets ...d5 work. [I] Each option Black keeps open is an option White keeps too, so flexibility has a price for both.

### Step 51: reflect

Kind: expect

Prompt: Do you agree that every option Black keeps open is also an option for White? Try to find a counterexample from the boards you have seen. [I] This is my inference, not a proven rule.

- Field "My answer:" (free text)

### Step 52: card

**Why f3 works, and when it stops.** f3 holds up e4 and g4 as long as pawns stand on those squares. After ...d5 and the exchange of e4, the pawn on f3 guards two empty squares and takes the knight's retreat square. [H] It may do less work than before, but the engine still prefers White, by roughly half a pawn or more, so this is a reduction in value, not a mistake. Look at the exchange on the next board.

### Step 53: board

Caption: Black to move after White castled long. Step through the break ...d5 and the trades on c6 and d5. Then look at the pawn on f3.

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
1. **9... d5**: The freeing break: the pawn attacks e4.
2. **10. exd5**: White takes. The pawn on e4 is gone.
3. **10... Nxd5**: The knight recaptures and attacks the bishop on e3 and the knight on c3.
4. **11. Nxc6**: White trades knights.
5. **11... bxc6**: Black retakes with the b-pawn; the b-file opens.
6. **12. Bd4**: The bishop steps to the long diagonal and faces Black's bishop on g7.

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

Drawn on the board: arrows f3-e4, f3-g4; highlighted squares f3, e4, g4.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [piece_on] At the end e4 is empty.
- [piece_attacks] The pawn on f3 attacks e4 and g4 (both empty at the end).
- [eval_range] At depth 16 White stands better here, by roughly half a pawn or more, even though Black can play the break d5.

### Step 54: contrast

Title: Does the bishop stop ...d5?

Prompt: Predict first. Three white ninth moves: the bishop to e2, the bishop to c4, and a pawn to a3. Which of them stops the break ...d5?

**The working board:**

**Task `IOD-LODDRAGON3-9`** (predict_outcome, difficulty cue 2)

Black to move. White's ninth move was the bishop to e2. Is the freeing break ...d5 a good move for Black here?

```
  1  R . . K . . . R
  2  P P . B Q P P P
  3  . . P B . N . .
  4  . . . P N . . .
  5  . . . . . . . .
  6  . p n . p n . .
  7  p b p p . . p p
  8  . k r . q b . r
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: r1bq1rk1/pp2ppbp/2np1np1/8/3NP3/2N1BP2/PPPQB1PP/R3K2R b KQ - 4 9
```

**Accepted answer:** {"outcome": "yes"}

**Explanation shown:** With the bishop on e2 only the knight on c3 and the pawn on e4 control d5, so the break works. The engine names ...d5 and ...Nxd4 as Black's two best moves (depth 16).

Hints (in order):
1. Count who controls d5: Black's knight and queen against which white pieces?
2. With the bishop on e2 (not c4), only the knight on c3 and the pawn on e4 attack d5.
3. Yes: d5 is among the engine's best two moves.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] ...d5 and ...Nxd4 are the engine's two best moves, within 0.4 pawns (depth 16).

**The failing board:**

**Task `IOD-LODDRAGON3-10`** (predict_outcome, difficulty cue 2)

Black to move. White's ninth move was the bishop to c4. Is the freeing break ...d5 a good move for Black here?

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

**Accepted answer:** {"outcome": "no"}

**Explanation shown:** With the bishop on c4 three white pieces attack d5 against two defenders, and the engine says the break costs Black at least 0.3 pawns (depth 16).

Hints (in order):
1. Count again: who controls d5 now?
2. The bishop on c4, the knight on c3 and the pawn on e4 attack d5; Black has two defenders.
3. No: d5 costs ground.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [move_loses] At depth 16 ...d5 costs Black at least 0.3 pawns here.

**The irrelevant board:**

**Task `IOD-LODDRAGON3-11`** (predict_outcome, difficulty cue 2)

Black to move. White's ninth move was the pawn to a3, a slow move far from d5. Is ...d5 a good move for Black?

```
  1  R . B K . . . R
  2  P P . . Q P P .
  3  . . P B . N . P
  4  . . . P N . . .
  5  . . . . . . . .
  6  . p n . p n . .
  7  p b p p . . p p
  8  . k r . q b . r
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: r1bq1rk1/pp2ppbp/2np1np1/8/3NP3/P1N1BP2/1PPQ2PP/R3KB1R b KQ - 0 9
```

**Accepted answer:** {"outcome": "yes"}

**Explanation shown:** The pawn on a3 does nothing for d5, and the bishop is still on f1, so ...d5 works. The engine ranks it first (depth 16).

Hints (in order):
1. Does a3 change who controls d5?
2. The bishop is still on f1, so d5 is controlled by the knight and the pawn only.
3. Yes: d5 works. The pawn on a3 is irrelevant to d5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] ...d5 is the engine's top move (depth 16).

### Step 55: reflect

Kind: unsure

Prompt: Black's break ...d5 works against two of the three bishop-and-pawn moves. In one sentence: what does the bishop on c4 take away that the others do not? Then say whether you would rather have the king's bishop on c4 or the pawn storm. [H] My guess: a player who wants g4 and h4 quickly should accept ...d5.

- Field "What c4 takes away:" (free text)

### Step 56: card

**Two good plans, not one necessity.** The engine's first choice is long castling at once, then the bishop to c4, then the pawn storm; at depth 16 both stand roughly +0.5 to +0.9 for White, varying by run. [V] After ...d5 White still stands better. Why castle before c4? [H] The bishop on c4 can be chased by a knight to a5 and a rook to c8, while castling brings a rook to d1 straight away. Treat c4 as one good plan, not a requirement.

## Chapter: Mistakes and tests

### Step 57: card

**Typical mistakes.** For Black: jumping with the knight to g4 while White's queen still stands on d1. For White: trading bishops on h6 while the knight on d4 needs the bishop; a slow pawn move (a3) or the bishop to d3, which let ...d5 work. The next boards check each one with the engine.

### Step 58: board

Caption: Black has played the knight to g4 on move six (before ...Bg7); White to move. Step through the answer. Why can the bishop on d7 not take the knight on g4 at the end?

```
  8  r n b q k b . r
  7  p p . . p p . p
  6  . . . p . . p .
  5  . . . . . . . .
  4  . . . N P . n .
  3  . . N . B . . .
  2  P P P . . P P P
  1  R . . Q K B . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: rnbqkb1r/pp2pp1p/3p2p1/8/3NP1n1/2N1B3/PPP2PPP/R2QKB1R w KQkq - 2 7
```

The line, with the sentence the learner sees at each move:
1. **7. Bb5+**: White checks along the diagonal; the bishop on f1 was not needed.
2. **7... Bd7**: Black blocks the check. The bishop on d7 is now pinned to the king.
3. **8. Qxg4**: The queen takes the knight on g4 from d1. Black's bishop cannot retake because it is pinned.

```
  8  r n . q k b . r
  7  p p . b p p . p
  6  . . . p . . p .
  5  . B . . . . . .
  4  . . . N P . Q .
  3  . . N . B . . .
  2  P P P . . P P P
  1  R . . . K . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: rn1qkb1r/pp1bpp1p/3p2p1/1B6/3NP1Q1/2N1B3/PPP2PPP/R3K2R b KQkq - 0 8
```

Drawn on the board: arrows b5-e8, d1-g4; highlighted squares b5, d7, g4.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] Bb5+ is the engine's top move (depth 16).

### Step 59: item

**Task `IOD-LODDRAGON3-12`** (predict_outcome, difficulty cue 2)

The queen has just taken on g4. Can the bishop on d7 take the queen?

```
  1  R . . K . . . R
  2  P P P . . P P P
  3  . . . B . N . .
  4  . Q . P N . . .
  5  . . . . . . B .
  6  . p . . p . . .
  7  p . p p b . p p
  8  r . b k q . n r
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: rn1qkb1r/pp1bpp1p/3p2p1/1B6/3NP1Q1/2N1B3/PPP2PPP/R3K2R b KQkq - 0 8
```

**Accepted answer:** {"outcome": "no"}

**Explanation shown:** The bishop on b5 pins the bishop on d7 to the king on e8, so d7-g4 is illegal. That is why the queen can take on g4 for free, and why the queen moving to d2 first changes this tactic.

Hints (in order):
1. Which white piece gave check a moment ago?
2. The bishop on b5 attacks d7 and the king on e8 stands behind it on the same diagonal.
3. No: the bishop on d7 is pinned.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [illegal_move] The move Bd7xg4 is illegal: the bishop is pinned to the king by the bishop on b5.

### Step 60: board

Caption: Compare: the same trick when the queen has already gone to d2 (White to move after ...Ng4 at move seven). Step through the check and the block.

```
  8  r n b q k . . r
  7  p p . . p p b p
  6  . . . p . . p .
  5  . . . . . . . .
  4  . . . N P . n .
  3  . . N . B . . .
  2  P P P Q . P P P
  1  R . . . K B . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: rnbqk2r/pp2ppbp/3p2p1/8/3NP1n1/2N1B3/PPPQ1PPP/R3KB1R w KQkq - 4 8
```

The line, with the sentence the learner sees at each move:
1. **8. Bb5+**: The check along the diagonal.
2. **8... Bd7**: Black blocks. This time nothing attacks g4, because the queen has left the d1-g4 diagonal.

```
  8  r n . q k . . r
  7  p p . b p p b p
  6  . . . p . . p .
  5  . B . . . . . .
  4  . . . N P . n .
  3  . . N . B . . .
  2  P P P Q . P P P
  1  R . . . K . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: rn1qk2r/pp1bppbp/3p2p1/1B6/3NP1n1/2N1B3/PPPQ1PPP/R3K2R w KQkq - 6 9
```

Drawn on the board: arrows d2-d1; highlighted squares g4, d2.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [attackers] No white piece attacks g4 after the check and the block.
- [best_move_in] Bg5 is the engine's top move here (depth 16); the check does not win anything.

### Step 61: board

Caption: Black to move after the bishop went to d3 instead of c4. The bishop blocks the d-file, and it does not watch d5. Step through ...d5.

```
  8  r . b q . r k .
  7  p p . . p p b p
  6  . . n p . n p .
  5  . . . . . . . .
  4  . . . N P . . .
  3  . . N B B P . .
  2  P P P Q . . P P
  1  R . . . K . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: r1bq1rk1/pp2ppbp/2np1np1/8/3NP3/2NBBP2/PPPQ2PP/R3K2R b KQ - 4 9
```

The line, with the sentence the learner sees at each move:
1. **9... d5**: The break works at once: the pawn attacks e4.
2. **10. exd5**: White takes.
3. **10... Nxd5**: The knight recaptures in the centre.
4. **11. Nxd5**: White takes the knight.
5. **11... Nxd4**: Black takes the knight on d4 with the c6 knight. White could retake with the bishop, but the engine rates the bishop jump to e4 and a pawn push equally; the position is about level.
6. **12. Be4**: The bishop jumps to e4, escaping and attacking the pieces round c6.
7. **12... Nc6**: Black re-routes the knight.

```
  8  r . b q . r k .
  7  p p . . p p b p
  6  . . n . . . p .
  5  . . . N . . . .
  4  . . . . B . . .
  3  . . . . B P . .
  2  P P P Q . . P P
  1  R . . . K . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r1bq1rk1/pp2ppbp/2n3p1/3N4/4B3/4BP2/PPPQ2PP/R3K2R w KQ - 2 13
```

Drawn on the board: arrows d3-d1, d6-d5; highlighted squares d3, d5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] ...d5 is the engine's top move here (depth 16).

### Step 62: board

Caption: A tempting pawn grab: Black takes the e4 pawn with the knight (the pawn on e4 is guarded twice). Step through it.

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
1. **9... Nxe4**: The knight takes the pawn on e4.
2. **10. fxe4**: The pawn on f3 takes the knight. Black has given a knight for a pawn.
3. **10... Ne5**: The knight attacks the bishop on c4 and hopes to regain something.

```
  8  r . b q . r k .
  7  p p . . p p b p
  6  . . . p . . p .
  5  . . . . n . . .
  4  . . B N P . . .
  3  . . N . B . . .
  2  P P P Q . . P P
  1  R . . . K . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r1bq1rk1/pp2ppbp/3p2p1/4n3/2BNP3/2N1B3/PPPQ2PP/R3K2R w KQ - 1 11
```

Drawn on the board: arrows f6-e4, f3-e4; highlighted squares e4.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [move_loses] At depth 16 the capture ...Nxe4 costs Black at least three pawns here.
- [attackers] Two white pieces defend e4: the pawn on f3 and the knight on c3.

### Step 63: item

**Task `IOD-LODDRAGON3-13`** (find_move, difficulty cue 3)

White to move in the Yugoslav position. Find a good move (three are within half a pawn of the best). Several tempting moves are mistakes; the feedback tells you why.

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

**Accepted answer(s):** O-O-O, Bc4, g4

Feedback shown for wrong moves:
- Bh6: The bishop is one of the two defenders of the knight on d4. After the trade on h6 the knight on c6 wins the knight on d4.
- a3: A slow move far from the action: it does not stop ...d5, which the engine rates as Black's best reply. It costs at least half a pawn.
- Bd3: The bishop on d3 does not stop ...d5 and blocks the d-file for the rook that is about to arrive. It costs at least 0.6 pawns.

**Explanation shown:** Long castling is the engine's first choice (roughly +0.5 to +0.9, varying by run); the bishop to c4 and the pawn push g4 (protected by f3) are within half a pawn of it. The bishop trade on h6 loses the knight on d4's guards; a3 and the bishop to d3 let ...d5 equalise.

Hints (in order):
1. Which moves use f3, the queen on d2 or the empty squares to the left of the king?
2. Think of a pawn push that f3 now protects, and of castling.
3. g2-g4 or castling long.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] Long castling is the engine's first choice; Bc4 and g4 are within half a pawn of it (depth 16).
- [move_loses] e3-h6 loses at least three pawns (depth 16).
- [move_loses] a2-a3 costs at least half a pawn (depth 16).
- [move_loses] f1-d3 costs at least 0.6 pawns (depth 16).

### Step 64: item

**Task `IOD-LODDRAGON3-14`** (find_move, difficulty cue 3)

Black to move after the bishop went to c4. Find a good move (three are within 0.4 pawns). Two natural-looking moves are mistakes.

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

**Accepted answer(s):** Qa5, Bd7, Nxd4

Feedback shown for wrong moves:
- a6: Slow: it does not develop and White gains tempo for the pawn storm (engine: costs at least a quarter of a pawn). Masters did choose it 10 times; the engine disagrees. [V] counts, not a verdict.
- d5: With the bishop on c4 the break fails: three white pieces attack d5 and Black has two defenders.
- Nxe4: The knight takes a pawn defended by f3 and the knight on c3, and it loses a piece.

**Explanation shown:** Qa5, Bd7 and Nxd4 are Black's top three at depth 16. Masters chose Bd7 in 116 of the games from this position and the trade on d4 in 25 (our data). The early ...a6 and the break ...d5 each cost ground.

Hints (in order):
1. Which black pieces are still undeveloped? Which move uses the half-open c-file or the long diagonal?
2. Think of moves that develop or trade, not of pawn moves.
3. The queen to a5, the bishop to d7, or the knight takes on d4.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] Qa5, Bd7 and Nxd4 are the engine's top three moves (depth 16, within 0.4 pawns).
- [move_loses] a7-a6 costs at least a quarter of a pawn (depth 16).
- [move_loses] d6-d5 costs at least 0.3 pawns (depth 16).
- [move_loses] f6xe4 loses at least three pawns (depth 16).

### Step 65: item  (shown without telling the learner the topic: unlabeled test)

**Task `IOD-LODDRAGON3-15`** (find_move, difficulty cue 3)

White to move. Black has played the knight to c6 first. Find White's best move.

```
  8  r . b q k . . r
  7  p p . . p p b p
  6  . . n p . n p .
  5  . . . . . . . .
  4  . . . N P . . .
  3  . . N . B P . .
  2  P P P . . . P P
  1  R . . Q K B . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: r1bqk2r/pp2ppbp/2np1np1/8/3NP3/2N1BP2/PPP3PP/R2QKB1R w KQkq - 1 8
```

**Accepted answer(s):** Qd2

**Explanation shown:** Whichever order Black chooses, the queen to d2 is White's move: it guards the bishop on e3, clears d1 for the rook and prepares the trade on h6. The engine ranks it first (depth 16).

Hints (in order):
1. What does the queen do from d2?
2. It guards the bishop on e3 and clears d1.
3. The queen to d2.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] Qd2 is the engine's top move (depth 16).

### Step 66: item  (shown without telling the learner the topic: unlabeled test)

**Task `IOD-LODDRAGON3-16`** (find_move, difficulty cue 3)

White to move at move seven. Find White's best move.

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

**Accepted answer(s):** f3

**Explanation shown:** The engine ranks f3 first among White's seventh moves (depth 16). It supports e4, takes g4 from Black's knight and prepares the queen move to d2.

Hints (in order):
1. Which pawn move supports e4 and takes g4 away from the knight?
2. Look at the second rank.
3. f2-f3.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] f3 is the engine's top move (depth 16).

### Step 67: board

Caption: Map of White's promises, on the position after the bishop went to c4. Each arrow is a loan repaid: f3 guards e4 and g4, the queen guards e3, the bishop controls d5 and f7. Find each one.

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

Drawn on the board: arrows f3-e4, f3-g4, d2-e3, c4-d5, c4-f7; highlighted squares f3, d2, c4.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [attackers] e4 is guarded twice.
- [attackers] The bishop on c4 attacks f7.
- [attackers] d5 is attacked three times.

### Step 68: board

Caption: Map of Black's promises, on a main-line position (Black to move after 12.Kb1). The bishop on g7 stands behind the pawn shelter, the bishop on d7 guards c6, the rook on c8 uses the half-open file, and the knight on e5 heads for c4. Find each one.

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

Drawn on the board: arrows e5-c4, c8-c4, d7-c6, g7-d4; highlighted squares e5, c8, d7, g7.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [attackers] c4 is covered by the knight on e5 and the rook on c8.

## Chapter: Teach it back

### Step 69: reflect

Kind: unsure

Prompt: Teach it back. Imagine you are teaching a friend who knows how the pieces move. Write five sentences: (1) why White plays f3 before the queen move, (2) why the queen goes to d2, (3) one position they could set up on a board that shows it, (4) one warning, (5) for Black: why the rook goes to c8 and what it attacks. [H] Explaining a move to someone else is a quick test of whether you can name its purpose.

- Field "1. Why f3 comes first:" (free text)

- Field "2. Why the queen goes to d2:" (free text)

- Field "3. A position to set up:" (free text)

- Field "4. One warning:" (free text)

- Field "5. Black's rook on c8:" (free text)

### Step 70: card

**Self-check.** Did you say when it works (Black has castled short, the knight on d4 is safe, d5 is under control) and when it fails (the bishop trade while the knight needs the bishop; ...d5 after a slow move)? Did you give an example a friend could set up on a board? Did you name one mistake from this lesson? Then go back to your first guess at the start of the lesson and change one word.

### Step 71: reflect

Kind: confidence

Prompt: Did your teach-back pass the self-check? Which of the four sentences was the weakest?

### Step 72: card

**What to remember.**
- f3 pays for e4 and g4; it costs e3, g3 and f3.
- Qd2 guards e3, clears d1, later sees h6.
- No short castling yet: f1 blocks it and the pawn storm comes. [I]
- Black's short castling favours long castling; no rule. [I]
- Before the h6 trade, count d4's attackers and defenders. [V]
- The bishop on c4 takes d5 away.
- Slow moves hand the opponent options. [I]

### Step 73: reflect

Kind: expect

Prompt: Go back to your very first guesses about the pawn on f3 and the queen on d2. Rewrite one of them in a better sentence.

- Field "My better sentence:" (free text)

---

## Reviewer scorecard

Fill in the file `content/review/L-OD-DRAGON-3.json` (a template is below). Scale 1 to 5 for each dimension: 1 = wrong or unusable, 3 = acceptable with edits, 5 = I would put my name to it as it stands.
Revision to review: `5353285a`. If the lesson text changes after your review, your sign-off no longer applies and the lesson goes back to needs-human.

| Dimension | What to judge | Score |
|---|---|---|
| chess | every statement, line and explanation is correct; near-misses are really near-misses | |
| clarity | the explanation actually explains (mechanism, conditions), in plain words | |
| prerequisites | the lesson assumes only what the learner has met | |
| tasks | each task has one defensible answer and a fair explanation | |

```json
{
  "lesson": "L-OD-DRAGON-3",
  "revision": "5353285a",
  "reviewer": "<your name>",
  "reviewer_role": "strong-player",
  "date": "YYYY-MM-DD",
  "scores": {"chess": 0, "clarity": 0, "prerequisites": 0, "tasks": 0},
  "comments": "<what to change, by step number>",
  "verdict": "approved"
}
```

`reviewer_role` is `strong-player` or `teacher`. `verdict` is `approved` or `changes-requested`. See docs/review-slice.md.
