# Review packet: L-OD-DRAGON-6

**Tactics and traps of the Dragon: Bh6, Nd5, the h-file, the c-file and the exchange sacrifice**

- Skill: OPN.STRUCT (D2); stage: exemplar; stated length: 42 minutes
- Steps: 65 (15 are tasks); revision: `fb13d188`
- Review status now: needs-human

## What the lesson says the learner will be able to do

- Judges whether the bishop trade on h6 is safe by counting the guards of the knight on d4 (the bishop on e3 and the queen on d2) and shows the refutation when it is not
- Finds White's h-file sequence (queen takes h7 with check, then the bishop to h6) and Black's counter-sacrifice when the attack is a move too slow
- Counts attackers and guards on c3 and chooses between the knight jump to d5, the exchange sacrifice and a quiet move
- Names the common case of the exchange sacrifice on c3 (bishop on g7, a queenside king, a queen ready for a5) and the general principle behind it (a target the pawn recapture exposes), and recognises edits that make it fail
- Explains in his or her own words why each of six shapes works, when it fails, and what a beginner could set up on a board

## Sources the author names (check that they are used fairly, in our own words)

- app/public/masters/stats.json (329,379 games, both players 2500+, 2012-2026, first 12 moves (24 plies)): 9.Bc4 139 games (60 White wins, 62 draws, 17 Black wins); 10.O-O-O after 9...Bd7 83 games (27, 45, 11); 11.Bb3 Ne5 12.Kb1 30 games (14, 15, 1). The tree stops at move 12 (24 plies), so the h-file and sacrifice lines (13.Bg5 Rc5 and later) have no counts here. [V]
- content/items/lesson-od-l-od-dragon-6.json (positions replayed with python-chess from real games or from the Dragon move sequence; edits marked in provenance; engine claims at depth 16) [V]
- Positions from real games in a local TWIC file of Dragon games (library/data, not shipped): games from 2012 to 2026, ECO B7x, both players 2400+, which includes online rapid and blitz events. The file was counted as 1,375 games in an earlier run; a later recount with a broader filter found 1,571 with the Dragon move order, so the exact total is approximate and the filter should be re-run before the number is quoted again. Games used: Horvath-Kantor 2018, Iordachescu-Jianu 2013, Paravyan-Golubev 2022, Navara-Hou Yifan 2013 (blitz), Garcia Pantoja-Golubev 2022, Vasquez Schroeder-Golubev 2022, Erigaisi-Mamedov 2024, Godart-Dgebuadze 2020, Ter Sahakyan-Nakamura 2026, Matinian-Kanter 2013. Moves are facts. [V]
- docs/citable-views.md 4.8 (Capablanca: sacrifices on a castled king work through coordination) [S]
- docs/citable-views.md 4.11 (Edward Lasker, Philidor: opposite-wing castling, pawns are cheap and speed decides) [S]
- docs/citable-views.md 4.12 (Edward Lasker: every pawn move leaves something behind) [S]
- docs/citable-views.md 4.13 (Nimzowitsch: give material to clear the way, for the entry square) [S]
- docs/citable-views.md 5.11 (Petrosian and the positional exchange sacrifice) [S]
- docs/lesson-depth-standard.md (opening series outline, lesson 6)
- [H] and [I] statements in the cards are conjectures, labelled in the text

## How to read this packet

Boards are drawn with capitals for White and lower case for Black, rank 8 at the top unless the board is shown from Black's side. Moves in a line are in standard notation. Statements marked [V] were machine-checked, [I] inference, [H] hypothesis, [S] secondary source, [R] recalled. Please judge the explanations, not only the moves: does each sentence tell the learner why?

---

## Chapter: Six shapes

### Step 1: board

Caption: Hook, part 1. A real Yugoslav Attack position with White to move (9.Bc4 occurred in 139 games (60 White wins, 62 draws, 17 Black wins) in our master data). The tempting move is the bishop to h6, offering to trade Black's best defender. Is it good here?

```
  8  r . . q . r k .
  7  p p . b p p b p
  6  . . n p . n p .
  5  . . . . . . . .
  4  . . B N P . . .
  3  . . N . B P . .
  2  P P P Q . . P P
  1  R . . . K . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: r2q1rk1/pp1bppbp/2np1np1/8/2BNP3/2N1BP2/PPPQ2PP/R3K2R w KQ - 5 10
```

Drawn on the board: arrows e3-h6; highlighted squares h6, g7, c2.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] Castling long, h4 and g4 are each within 40 cp of the engine's best move (depth 16).
- [move_loses] The bishop move to h6 scores at least 400 cp worse than the best move (depth 16).

### Step 2: board

Caption: Hook, part 2. Another position, White to move (Navara-Hou Yifan, blitz playoff, 2013). Black's king has just stepped to f8. The same bishop move is available. Which of the two bishop moves is a mistake, and which one wins?

```
  8  . . r q . k . .
  7  p p . . p r b Q
  6  . . n . b . p .
  5  . . . n . . . .
  4  . . . . . . . .
  3  . N N . B P . .
  2  P P P . . . P .
  1  . . K R . B . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 2rq1k2/pp2prbQ/2n1b1p1/3n4/8/1NN1BP2/PPP3P1/2KR1B1R w - - 1 18
```

Drawn on the board: arrows e3-h6; highlighted squares h6, g7, f8, h7.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [eval_range] The engine rates this position at +5 or more for White (depth 16).

### Step 3: reflect

Kind: expect

Prompt: Write which of the two positions makes Bh6 a mistake, which one makes it win, and the first thing you looked at (the queen? the h-file? what each side guards?). Do not read on until you have committed to an answer.

- Field "My answer and my reason:" (free text)

### Step 4: card

**Six shapes decide most Dragon games.** The bishop trade on h6. The h-file. The knight jump to d5. The exchange sacrifice on c3. Queen-and-rook pressure on the c-file. King hunts near the back rank. By the end you can look at a position you have never seen and say which shape is in the air and what it needs. You are learning conditions, not lines. Each shape is shown working and failing.

## Chapter: The trade on h6

### Step 5: card

**The trade on h6.** Black's bishop on g7 guards the dark squares around the king. A white bishop on h6 attacks it. If Black trades, White's queen lands on h6; if Black retreats to h8, the queen gets the h-file. Either way a defender is gone. The price: the bishop on e3 and the queen on d2 are the two guards of the knight on d4, and this plan spends both. Three boards follow, each with a different answer.

### Step 6: board

Caption: Position 1 of 3 (Horvath-Kantor, 2018). Black may accept the trade and the game stays level: the engine puts White at most half a pawn ahead (depth 16).

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
1. **13. Bh6**: White offers the trade of Black's best defender.
2. **13... Bxh6**: Black accepts.
3. **14. Qxh6**: The queen recaptures and stands far from the queenside.
4. **14... Rxc3**: Black strikes on the wing the queen left: an exchange sacrifice.
5. **15. bxc3**: White takes; the pawn cover in front of the king is broken.
6. **15... Qa5**: The queen attacks the pawn on c3 and a2 behind the king.
7. **16. Ne2**: The knight steps to e2 to guard c3.

```
  8  . . . . . r k .
  7  p p . b p p . .
  6  . . . p . n p Q
  5  q . . . n . . p
  4  . . . . P . . P
  3  . B P . . P . .
  2  P . P . N . P .
  1  . . K R . . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 5rk1/pp1bpp2/3p1npQ/q3n2p/4P2P/1BP2P2/P1P1N1P1/2KR3R b - - 2 16
```

Drawn on the board: arrows e3-h6, a5-c3; highlighted squares h6, g7, c3.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] The king move to b1, g4 and the bishop move to h6 are each within 40 cp of the engine's best move (depth 16).
- [eval_range] The engine rates this position between +0.1 and +0.6 for White (depth 16).

### Step 7: board

Caption: Position 2 of 3 (Iordachescu-Jianu, 2013). Black does not have to take: the retreat to the corner costs a little time but keeps the bishop. White keeps a small edge (depth 16).

```
  8  . . r . r . k .
  7  p p . b p p b n
  6  . . . p . . p .
  5  q . . . n . B p
  4  . . . N P . . P
  3  . B N . . P . .
  2  P P P Q . . P .
  1  . K . R R . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 2r1r1k1/pp1bppbn/3p2p1/q3n1Bp/3NP2P/1BN2P2/PPPQ2P1/1K1RR3 w - - 8 16
```

The line, with the sentence the learner sees at each move:
1. **16. Bh6**: The same offer, but Black has a better answer than taking.
2. **16... Bh8**: Black declines: the bishop stays on the long diagonal.
3. **17. Be3**: White steps back; the trade did not happen, so no defender was removed.
4. **17... Nf6**: The knight returns to guard the king.
5. **18. Qe2**: The queen heads for the centre.
6. **18... Bg7**: The bishop goes back to its post.

```
  8  . . r . r . k .
  7  p p . b p p b .
  6  . . . p . n p .
  5  q . . . n . . p
  4  . . . N P . . P
  3  . B N . B P . .
  2  P P P . Q . P .
  1  . K . R R . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 2r1r1k1/pp1bppb1/3p1np1/q3n2p/3NP2P/1BN1BP2/PPP1Q1P1/1K1RR3 w - - 14 19
```

Drawn on the board: arrows g5-h6, g7-h8; highlighted squares h6, h8, g7.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] The bishop move to h6 is the engine's top choice (depth 16).
- [eval_range] The engine rates this position between +0.2 and +1.2 for White (depth 16).
- [attackers] After the bishop move one white piece attacks the bishop on g7.

### Step 8: board

Caption: Position 3 of 3 (Paravyan-Golubev, 2022). Here neither capture nor retreat holds: the engine puts White ahead by more than two pawns (depth 16), and the game went to White.

```
  8  r . . . . r k .
  7  p b . . q p b p
  6  . . p . p n p .
  5  . . . p . . . .
  4  . . . . P . P .
  3  . B N . B P . .
  2  P P P Q . . . .
  1  . . K R . . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: r4rk1/pb2qpbp/2p1pnp1/3p4/4P1P1/1BN1BP2/PPPQ4/2KR3R w - - 1 16
```

The line, with the sentence the learner sees at each move:
1. **16. Bh6**: The offer comes with the black queen on e7 and the c-pawn on c6.
2. **16... Bh8**: Black declines; but now the queen can use the h-file.
3. **17. Qh2**: The queen aims at the pawn on h7 along the file.
4. **17... Rfd8**: Black brings the rook to the centre.
5. **18. Bg5**: The bishop attacks the knight on f6, which stands in front of the queen.
6. **18... e5**: Black tries to free the position.
7. **19. exd5**: White opens the centre.

```
  8  r . . r . . k b
  7  p b . . q p . p
  6  . . p . . n p .
  5  . . . P p . B .
  4  . . . . . . P .
  3  . B N . . P . .
  2  P P P . . . . Q
  1  . . K R . . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r2r2kb/pb2qp1p/2p2np1/3Pp1B1/6P1/1BN2P2/PPP4Q/2KR3R b - - 0 19
```

Drawn on the board: arrows e3-h6, d2-h2, h2-h7; highlighted squares h6, h7, g7, f6.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] The bishop move to h6 is the engine's top choice (depth 16).
- [eval_range] The engine rates this position at +2 or more for White (depth 16).
- [attackers] After the bishop reaches g5 one white piece attacks the knight on f6.

### Step 9: reflect

Kind: expect

Prompt: The three positions gave three different answers to the same bishop move. Before reading on, write what separates them: look at the h-pawns and at where Black's queen stands.

- Field "What decides each position:" (free text)

### Step 10: card

**What separates the three.** [I] In the first two, a black pawn on h5 faces White's pawn on h4, so the h-file stays closed and the trade only removes a defender. In the third White has no h-pawn, the file is open for the rook on h1, and Black's queen is far away: the queen lands on h2 and Bg5 attacks the knight on f6, a guard of h7. Scores are [V]; this explanation is inference.

### Step 11: item

**Task `IOD-LODDRAGON6-4`** (find_move, difficulty cue 2)

White to move. Black has castled short and kept the bishop on g7. Find White's best move.

```
  8  r . . . . r k .
  7  p b . . q p b p
  6  . . p . p n p .
  5  . . . p . . . .
  4  . . . . P . P .
  3  . B N . B P . .
  2  P P P Q . . . .
  1  . . K R . . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: r4rk1/pb2qpbp/2p1pnp1/3p4/4P1P1/1BN1BP2/PPPQ4/2KR3R w - - 1 16
```

**Accepted answer(s):** Bh6

**Explanation shown:** Bh6 attacks the bishop on g7. If Black trades, the queen reaches h6; if Black retreats to h8, the queen reaches the h-file. The engine (depth 16) prefers it by a wide margin.

Hints (in order):
1. Which Black piece guards the dark squares near the king?
2. A trade offer can also force it to move.
3. Look at the bishop on e3.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] This is the engine's top choice at depth 16 (every accepted move within 40 cp).

### Step 12: board

Caption: Why the trade fails here. The bishop on e3 and the queen on d2 both guard the knight on d4. Bh6 spends the bishop, the recapture on h6 spends the queen, so the knight on c6 simply takes a loose knight. The engine puts White about five pawns down (depth 16). Before any bishop trade, count the guards of d4. The hook answered: the first position is the mistake.

```
  8  r . . q . r k .
  7  p p . b p p b p
  6  . . n p . n p .
  5  . . . . . . . .
  4  . . B N P . . .
  3  . . N . B P . .
  2  P P P Q . . P P
  1  R . . . K . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: r2q1rk1/pp1bppbp/2np1np1/8/2BNP3/2N1BP2/PPPQ2PP/R3K2R w KQ - 5 10
```

The line, with the sentence the learner sees at each move:
1. **10. Bh6**: The offer comes in the hook position: the bishop leaves e3.
2. **10... Bxh6**: Black accepts.
3. **11. Qxh6**: The queen recaptures and leaves d2: now nothing guards d4.
4. **11... Nxd4**: The knight takes the loose knight; it also attacks c2 and f3.
5. **12. O-O-O**: White castles, but a knight is already lost.
6. **12... e5**: The pawn supports the new knight on d4.

```
  8  r . . q . r k .
  7  p p . b . p . p
  6  . . . p . n p Q
  5  . . . . p . . .
  4  . . B n P . . .
  3  . . N . . P . .
  2  P P P . . . P P
  1  . . K R . . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r2q1rk1/pp1b1p1p/3p1npQ/4p3/2BnP3/2N2P2/PPP3PP/2KR3R w - - 0 13
```

Drawn on the board: arrows c6-d4, e3-d4, d2-d4; highlighted squares d4, e3, d2, h6.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [move_loses] The bishop move to h6 scores at least 400 cp worse than the best move (depth 16).
- [attackers] Before the trade two white pieces guard the knight on d4: the bishop and the queen.
- [attackers] After the queen has recaptured on h6 no white piece guards d4.
- [piece_on] After ...Nxd4 a black knight stands on d4.

### Step 13: contrast

Title: Does the trade on h6 gain ground?

Prompt: Predict for each position, then check. One difference matters; one does not.

**The working board:**

**Task `IOD-LODDRAGON6-1`** (predict_outcome, difficulty cue 2)

White to move. Black's knight stands on b8, not on c6. White plays the bishop to h6. Is that one of the engine's good moves, or clearly worse than the best move?

```
  8  r n . q . r k .
  7  p p . b p p b p
  6  . . . p . n p .
  5  . . . . . . . .
  4  . . B N P . . .
  3  . . N . B P . .
  2  P P P Q . . P P
  1  R . . . K . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: rn1q1rk1/pp1bppbp/3p1np1/8/2BNP3/2N1BP2/PPPQ2PP/R3K2R w KQ - 5 10
```

**Accepted answer:** {"outcome": "one of the good moves"}

**Explanation shown:** With Black's knight still on b8 nothing can jump into d4, so spending the bishop and the queen costs little: Bh6 is about six-tenths of a pawn behind the best move (depth 16).

Hints (in order):
1. Which black piece could jump into d4?
2. Where is Black's knight in this position?
3. One of the good moves: no black piece can take the knight on d4, so the guards do not matter here.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] Castling long, h4, the bishop retreat, g4 and the bishop move to h6 are each within 70 cp of the engine's best move (depth 16).

**The failing board:**

**Task `IOD-LODDRAGON6-2`** (predict_outcome, difficulty cue 2)

White to move. Black's knight stands on c6. White plays the bishop to h6. Is that one of the engine's good moves, or clearly worse than the best move?

```
  8  r . . q . r k .
  7  p p . b p p b p
  6  . . n p . n p .
  5  . . . . . . . .
  4  . . B N P . . .
  3  . . N . B P . .
  2  P P P Q . . P P
  1  R . . . K . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: r2q1rk1/pp1bppbp/2np1np1/8/2BNP3/2N1BP2/PPPQ2PP/R3K2R w KQ - 5 10
```

**Accepted answer:** {"outcome": "clearly worse"}

**Explanation shown:** After the trade the bishop and the queen have both left their guard posts, so ...Nxd4 wins the knight on d4 for nothing. The engine (depth 16) rates the move about five and a half pawns worse than castling.

Hints (in order):
1. Which White pieces guard the knight on d4?
2. If the bishop trades itself and the queen recaptures, who is left to guard it?
3. Clearly worse: ...Nxd4 wins the knight on d4.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [move_loses] Bh6 scores at least 80 cp worse than the best move (depth 16).

**The irrelevant board:**

**Task `IOD-LODDRAGON6-3`** (predict_outcome, difficulty cue 2)

Black's knight stands on c6 and Black's a-pawn stands on a6. White plays the bishop to h6. Is that one of the engine's good moves, or clearly worse than the best move?

```
  8  r . . q . r k .
  7  . p . b p p b p
  6  p . n p . n p .
  5  . . . . . . . .
  4  . . B N P . . .
  3  . . N . B P . .
  2  P P P Q . . P P
  1  R . . . K . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: r2q1rk1/1p1bppbp/p1np1np1/8/2BNP3/2N1BP2/PPPQ2PP/R3K2R w KQ - 5 10
```

**Accepted answer:** {"outcome": "clearly worse"}

**Explanation shown:** The a-pawn does not touch d4, so the same reply ...Nxd4 works. The move still scores far below castling (depth 16).

Hints (in order):
1. Does the a-pawn have any link to d4?
2. Compare with the position with the knight on c6.
3. Clearly worse: the a-pawn is irrelevant; the loose knight on d4 is the problem.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [move_loses] Bh6 scores at least 80 cp worse than the best move (depth 16).

### Step 14: card

**Conditions, not a rule.** The trade tends to work when the h-file is open or opening and when taking on h6 is worse for Black than declining. It fails when the bishop and the queen are the only guards of a loose knight, here on d4. [I] The queen leaving d2 also loosens c2, but d4 decides this position. [H] Many amateur Dragon games are lost by playing the trade because it looks aggressive, without counting the guards. Test this on your own games.

## Chapter: The h-file and the race

### Step 15: card

**The h-file.** White pushes the h-pawn to h5 to trade it for the pawn on g6, the shield of Black's king. When the file opens, a rook stands behind and the other pieces join: the bishop removes the g7 defender, the queen lands on h6 or h4. Capablanca noted that sacrifices on a castled king work through coordination [S]; I apply that to h-file attacks [I]: cover stripped, then queen, rook and a minor piece finish.

### Step 16: board

Caption: The h-file attack in a real game (Navara-Hou Yifan, 2013, blitz): every White piece arrives in turn. The engine puts White ahead by nearly three pawns even before the attack lands (depth 16).

```
  8  r . . q . r k .
  7  p p . . p p b p
  6  . . n . b n p .
  5  . . . p . . . .
  4  . . . . P . . P
  3  . N N . B P . .
  2  P P P . . . P .
  1  . . K R Q B . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: r2q1rk1/pp2ppbp/2n1bnp1/3p4/4P2P/1NN1BP2/PPP3P1/2KRQB1R w - - 3 13
```

The line, with the sentence the learner sees at each move:
1. **13. h5**: The pawn heads for g6, the shield of the king.
2. **13... Rc8**: Black counters on the c-file at once.
3. **14. hxg6**: The pawn trade removes White's h-pawn and clears the file.
4. **14... fxg6**: Black recaptures; the pawn on h7 is the next target.
5. **15. exd5**: The pawn takes on d5 and attacks the bishop on e6.
6. **15... Nxd5**: Black recaptures with the knight.
7. **16. Qh4**: The queen reaches the h-file and attacks h7; the rook stands behind it.
8. **16... Rf7**: Black guards the seventh rank.
9. **17. Qxh7+**: The queen takes h7 with check.
10. **17... Kf8**: The king steps to f8; the bishop on e3 now has a route to h6.

```
  8  . . r q . k . .
  7  p p . . p r b Q
  6  . . n . b . p .
  5  . . . n . . . .
  4  . . . . . . . .
  3  . N N . B P . .
  2  P P P . . . P .
  1  . . K R . B . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 2rq1k2/pp2prbQ/2n1b1p1/3n4/8/1NN1BP2/PPP3P1/2KR1B1R w - - 1 18
```

Drawn on the board: arrows h4-h5, e3-h6; highlighted squares g6, h7, g7.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] The pawn move to h5 is within 40 cp of the engine's best move (depth 16).
- [eval_range] The engine rates this position at +2 or more for White (depth 16).
- [attackers] After the queen reaches h4 one white piece attacks the pawn on h7.

### Step 17: board

Caption: The last step. The bishop on h6 pins the bishop on g7 against the king on f8, so the queen can enter on h8. Black's other defences also lose (depth 16).

```
  8  . . r q . k . .
  7  p p . . p r b Q
  6  . . n . b . p .
  5  . . . n . . . .
  4  . . . . . . . .
  3  . N N . B P . .
  2  P P P . . . P .
  1  . . K R . B . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 2rq1k2/pp2prbQ/2n1b1p1/3n4/8/1NN1BP2/PPP3P1/2KR1B1R w - - 1 18
```

The line, with the sentence the learner sees at each move:
1. **18. Bh6**: The bishop attacks g7 and takes away the guard of h8.
2. **18... Ncb4**: Black ignores the threat.
3. **19. Qh8#**: The queen takes h8: the pinned bishop cannot capture, and it is checkmate.

```
  8  . . r q . k . Q
  7  p p . . p r b .
  6  . . . . b . p B
  5  . . . n . . . .
  4  . n . . . . . .
  3  . N N . . P . .
  2  P P P . . . P .
  1  . . K R . B . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 2rq1k1Q/pp2prb1/4b1pB/3n4/1n6/1NN2P2/PPP3P1/2KR1B1R b - - 4 19
```

Drawn on the board: arrows e3-h6, h7-h8; highlighted squares h6, g7, f8, h8.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [eval_range] The engine rates this position at +5 or more for White (depth 16).
- [attackers] After the bishop move two white pieces attack the bishop on g7: the bishop and the queen.

### Step 18: board

Caption: The engine's best defence also loses. Even after the bishops are traded, the queen on h6 and the rook on h1 keep the black king in the net (depth 16). An attack that is a team job does not depend on one reply.

```
  8  . . r q . k . .
  7  p p . . p r b Q
  6  . . n . b . p .
  5  . . . n . . . .
  4  . . . . . . . .
  3  . N N . B P . .
  2  P P P . . . P .
  1  . . K R . B . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 2rq1k2/pp2prbQ/2n1b1p1/3n4/8/1NN1BP2/PPP3P1/2KR1B1R w - - 1 18
```

The line, with the sentence the learner sees at each move:
1. **18. Bh6**: The same bishop move, now met by the best defence.
2. **18... Bxh6+**: Black takes the bishop with check.
3. **19. Qxh6+**: The queen recaptures with check.
4. **19... Rg7**: The rook blocks on g7.
5. **20. Nc5**: The knight attacks the bishop on e6.
6. **20... Bf7**: The bishop steps aside.

```
  8  . . r q . k . .
  7  p p . . p b r .
  6  . . n . . . p Q
  5  . . N n . . . .
  4  . . . . . . . .
  3  . . N . . P . .
  2  P P P . . . P .
  1  . . K R . B . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 2rq1k2/pp2pbr1/2n3pQ/2Nn4/8/2N2P2/PPP3P1/2KR1B1R w - - 3 21
```

Drawn on the board: arrows h6-g7, b3-c5; highlighted squares h6, g7, f8.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [eval_range] The engine rates this position at +5 or more for White (depth 16).
- [attackers] After the bishops are traded the rook on h1 defends the queen on h6.

### Step 19: item

**Task `IOD-LODDRAGON6-5`** (find_move, difficulty cue 2)

White to move. The h-file is open and the queen stands on h4. Find White's best move.

```
  8  . . r q . . k .
  7  p p . . p r b p
  6  . . n . b . p .
  5  . . . n . . . .
  4  . . . . . . . Q
  3  . N N . B P . .
  2  P P P . . . P .
  1  . . K R . B . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 2rq2k1/pp2prbp/2n1b1p1/3n4/7Q/1NN1BP2/PPP3P1/2KR1B1R w - - 2 17
```

**Accepted answer(s):** Qxh7+

Feedback shown for wrong moves:
- Nxd5: Taking the knight first lets Black trade bishops on d5 and gives away the sharpest line; it scores clearly lower.

**Explanation shown:** The queen takes h7 with check; the king must step to f8, and Bh6 follows. The engine (depth 16) rates the position at more than seven pawns for White.

Hints (in order):
1. Which Black pawn is defended by nothing but the king?
2. A check is also a capture.
3. The queen takes on h7 with check.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] This is the engine's top choice at depth 16 (every accepted move within 40 cp).
- [move_loses] Nxd5 scores at least 60 cp worse than the best move (depth 16).

### Step 20: board

Caption: The mirror case (Garcia Pantoja-Golubev, 2022). White's attack looks built: g- and h-pawns have been traded, a rook stands on g1, the queen on d2. But Black's rook on c4 and the knights are active too. What is Black's answer to the bishop move to h6?

```
  8  . . . q . r k .
  7  p p . b p p b .
  6  . . . p . n p .
  5  . . . . . . . .
  4  . . r N P . p .
  3  . . N . B P . .
  2  P P P Q . . . .
  1  . K . . . . R R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 3q1rk1/pp1bppb1/3p1np1/8/2rNP1p1/2N1BP2/PPPQ4/1K4RR w - - 2 18
```

Drawn on the board: arrows e3-h6, c4-d4; highlighted squares h6, d4, c4.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] The knight move to f5, the pawn move fxg4 and the bishop move to h6 are each within 40 cp of the engine's best move (depth 16).
- [eval_range] The engine rates this position between -0.4 and +0.6 (depth 16): about level.

### Step 21: board

Caption: Black's save: the counter-sacrifice Rxd4 removes the knight that holds White's attack together. The engine prefers it and rates the retreat to h8 far lower (depth 16). [H] Giving the exchange to remove a key defender may be a general idea.

```
  8  . . . q . r k .
  7  p p . b p p b .
  6  . . . p . n p B
  5  . . . . . . . .
  4  . . r N P . p .
  3  . . N . . P . .
  2  P P P Q . . . .
  1  . K . . . . R R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: 3q1rk1/pp1bppb1/3p1npB/8/2rNP1p1/2N2P2/PPPQ4/1K4RR b - - 3 18
```

The line, with the sentence the learner sees at each move:
1. **18... Rxd4**: The rook takes the knight that holds White's position together.
2. **19. Qxd4**: The queen recaptures.
3. **19... Bxh6**: Black takes the bishop that came to h6.
4. **20. Rxh6**: The rook recaptures; White's attack has produced only trades.
5. **20... Qb6**: Black offers the queens.
6. **21. Qxb6**: White takes.
7. **21... axb6**: Black recaptures and stands slightly better.

```
  8  . . . . . r k .
  7  . p . b p p . .
  6  . p . p . n p R
  5  . . . . . . . .
  4  . . . . P . p .
  3  . . N . . P . .
  2  P P P . . . . .
  1  . K . . . . R .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 5rk1/1p1bpp2/1p1p1npR/8/4P1p1/2N2P2/PPP5/1K4R1 w - - 0 22
```

Drawn on the board: arrows c4-d4, g7-h6; highlighted squares d4, h6, c4.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] The rook capture on d4 is the engine's top choice (depth 16).
- [move_loses] The retreat Bh8 scores at least 150 cp worse than the best move (depth 16).
- [eval_range] The engine rates this position between -1.2 and 0.0 (depth 16): Black stands slightly better or level.

### Step 22: item

**Task `IOD-LODDRAGON6-6`** (find_move, difficulty cue 2)

Black to move. White has just played the bishop to h6 and the white attack looks strong. Find Black's best move.

```
  1  R R . . . . K .
  2  . . . . Q P P P
  3  . . P . . N . .
  4  . p . P N r . .
  5  . . . . . . . .
  6  B p n . p . . .
  7  . b p p b . p p
  8  . k r . q . . .
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: 3q1rk1/pp1bppb1/3p1npB/8/2rNP1p1/2N2P2/PPPQ4/1K4RR b - - 3 18
```

**Accepted answer(s):** Rxd4

Feedback shown for wrong moves:
- Bh8: The retreat leaves the knight on f6 without its bishop and lets a white knight jump to f5; it scores far lower.

**Explanation shown:** The rook takes on d4; after Qxd4 the bishop takes on h6 and Black stands slightly better (depth 16). Declining with ...Bh8 loses ground.

Hints (in order):
1. Which white piece guards the key squares around the white king?
2. The rook on c4 can take something with a capture that is also a sacrifice.
3. The rook takes the knight on d4.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] This is the engine's top choice at depth 16 (every accepted move within 40 cp).
- [move_loses] Bh8 scores at least 220 cp worse than the best move (depth 16).

### Step 23: board

Caption: Black's quiet defence: ...h5 answers h4. In our master data 12.h4 was played in 11 games (1 White wins, 7 draws, 3 Black wins), against 30 games (14 White wins, 15 draws, 1 Black wins) for 12.Kb1. [I] The pawn on h5 keeps the file closed, which is why many White players start with the king move instead. The engine puts the king move first (depth 16).

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
1. **12. h4**: White starts the h-pawn at once.
2. **12... h5**: Black stops it: with a pawn on h5 the h-file cannot be opened by h4-h5.
3. **13. Kb1**: White tucks the king away first.
4. **13... Nc4**: The knight jumps in, attacking the queen and the bishop on e3.
5. **14. Bxc4**: White removes it.
6. **14... Rxc4**: The rook recaptures.

```
  8  . . . q . r k .
  7  p p . b p p b .
  6  . . . p . n p .
  5  . . . . . . . p
  4  . . r N P . . P
  3  . . N . B P . .
  2  P P P Q . . P .
  1  . K . R . . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 3q1rk1/pp1bppb1/3p1np1/7p/2rNP2P/2N1BP2/PPPQ2P1/1K1R3R w - - 0 15
```

Drawn on the board: arrows h7-h5, h2-h4; highlighted squares h5, h4, h7.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] The king move to b1 is the engine's top choice (depth 16).
- [eval_range] The engine rates this position between +0.2 and +1.5 for White (depth 16).

### Step 24: card

**Count the race.** Edward Lasker noted that when kings castle on opposite wings pawns are cheap and speed decides [S]; our notes pair Philidor with him [S]. So count: how many moves does each side need to open a line against the enemy king, and who can slow the other with one forcing move? [I] This counting is a heuristic, not a law. One worked count follows, then three positions to judge before you read the engine's verdict.

### Step 25: board

Caption: Worked count (the Navara-Hou Yifan position again). White: h5, hxg6, then the queen to h4 puts queen and rook on the file, three moves. Black: a rook to c8 and a knight move open the c-file, about two moves [I]. The gap is one move, and the pawn trade on g6 is the forcing move that gains White the time. [I] Heuristic only.

```
  8  r . . q . r k .
  7  p p . . p p b p
  6  . . n . b n p .
  5  . . . p . . . .
  4  . . . . P . . P
  3  . N N . B P . .
  2  P P P . . . P .
  1  . . K R Q B . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: r2q1rk1/pp2ppbp/2n1bnp1/3p4/4P2P/1NN1BP2/PPP3P1/2KRQB1R w - - 3 13
```

Drawn on the board: arrows h4-h5, e1-h4; highlighted squares g6, h7, c8.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] The pawn move to h5 is within 40 cp of the engine's best move (depth 16).
- [eval_range] The engine rates this position at +2 or more for White (depth 16).

### Step 26: item

**Task `IOD-LODDRAGON6-12`** (classify_position, difficulty cue 3)

White to move; kings are on opposite wings. Whose attack is further ahead, or is neither?

```
  8  r . . q . r k .
  7  p p . . p p b p
  6  . . n . b n p .
  5  . . . p . . . .
  4  . . . . P . . P
  3  . N N . B P . .
  2  P P P . . . P .
  1  . . K R Q B . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: r2q1rk1/pp2ppbp/2n1bnp1/3p4/4P2P/1NN1BP2/PPP3P1/2KRQB1R w - - 3 13
```

**Accepted answer:** {"class": "White"}

**Explanation shown:** White is ahead: the engine rates the position at +1.5 or better (depth 16), and the h-pawn needs only a push or two to open a file against the king on g8.

Hints (in order):
1. Where are the two kings?
2. Which side has a pawn that can open a file in one or two moves?
3. Count the moves each side needs to open a line against the enemy king.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [eval_range] The engine rates this position at +1.5 or more for White (depth 16).
- [king_wing] White's king is on the queenside.
- [king_wing] Black's king is on the kingside.

### Step 27: item

**Task `IOD-LODDRAGON6-13`** (classify_position, difficulty cue 3)

White to move; kings are on opposite wings. Whose attack is further ahead, or is neither?

```
  8  . . . . r . k .
  7  p p . b p p . .
  6  . . . p . b p B
  5  q . . . . . . n
  4  . . r N P P p .
  3  . . N . . . . .
  2  P P P Q . . . .
  1  . K . . . . R R
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 4r1k1/pp1bpp2/3p1bpB/q6n/2rNPPp1/2N5/PPPQ4/1K4RR w - - 0 20
```

**Accepted answer:** {"class": "Black"}

**Explanation shown:** Black is ahead: the engine rates the position at -0.8 or worse for White (depth 16). White's attack has already spent its pawns, while the black rook and queen aim at c3.

Hints (in order):
1. Count the Black pieces aimed at c3.
2. White's h-file attack has produced no mate threat.
3. Compare the squares each side's attackers already aim at.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [eval_range] The engine rates this position at -0.8 or worse for White (depth 16).
- [king_wing] White's king is on the queenside.

### Step 28: item

**Task `IOD-LODDRAGON6-14`** (classify_position, difficulty cue 3)

White to move; kings are on opposite wings. Whose attack is further ahead, or is neither?

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

**Accepted answer:** {"class": "Neither"}

**Explanation shown:** Neither is clearly ahead: the engine rates the position within about half a pawn of level (depth 16). Both h-pawns have moved, and neither side has opened a file.

Hints (in order):
1. Both sides have moved a rook-pawn.
2. Neither side has opened a file yet.
3. Check whether either side already has a piece or pawn ready to open a file.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [eval_range] The engine rates this position between -0.3 and +0.7 (depth 16).
- [king_wing] White's king is on the queenside.

## Chapter: The knight jump and the exchange sacrifice

### Step 29: card

**The jump to d5.** When Black chases the knight with ...b5-b4, the knight often has a good square on d5. If Black takes with the bishop, the e-pawn recaptures and Black's bishop on e6 is gone; if Black takes with the knight, a bishop recaptures. The jump works when d5 is reachable, when White can recapture, and when the trade does not remove a guard of a key square.

### Step 30: board

Caption: Fifteen games in our local file (both players 2400+) reach this position and 13 continue with the knight jump to d5 (a recount). Two examples: Vasquez Schroeder-Golubev 2022 and Erigaisi-Mamedov 2024, both won by White. The engine puts the jump first (depth 16).

```
  8  r . . . . r k .
  7  p . . . p p b p
  6  . . . p b n p .
  5  q . . . . . . .
  4  . p . B P . . .
  3  . B N . . P . .
  2  P P P Q . . P P
  1  . K . R . . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: r4rk1/p3ppbp/3pbnp1/q7/1p1BP3/1BN2P2/PPPQ2PP/1K1R3R w - - 0 14
```

The line, with the sentence the learner sees at each move:
1. **14. Nd5**: The knight jumps to d5, attacking f6 and e7 and offering a trade.
2. **14... Bxd5**: Black takes with the bishop.
3. **15. exd5**: The pawn recaptures; the bishop on e6 is gone and d5 is guarded.
4. **15... Qb5**: Black's queen attacks d5 along the fifth rank.
5. **16. Qd3**: White offers the queens and guards d5.
6. **16... Qxd3**: Black takes.
7. **17. Rxd3**: White recaptures; the pawn on d5 is safe.

```
  8  r . . . . r k .
  7  p . . . p p b p
  6  . . . p . n p .
  5  . . . P . . . .
  4  . p . B . . . .
  3  . B . R . P . .
  2  P P P . . . P P
  1  . K . . . . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r4rk1/p3ppbp/3p1np1/3P4/1p1B4/1B1R1P2/PPP3PP/1K5R b - - 0 17
```

Drawn on the board: arrows c3-d5, e4-d5; highlighted squares d5, e6, b4.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] The knight jump to d5 is the engine's top choice (depth 16).
- [attackers] After the pawn recaptures on d5 it is guarded.

### Step 31: board

Caption: Black's side of the jump. The recapture with the knight looks natural, but it uncovers the bishop on g7 to the white bishop on d4. The engine prefers the bishop recapture by about 0.8 of a pawn (depth 16).

```
  8  r . . . . r k .
  7  p . . . p p b p
  6  . . . p b n p .
  5  q . . N . . . .
  4  . p . B P . . .
  3  . B . . . P . .
  2  P P P Q . . P P
  1  . K . R . . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: r4rk1/p3ppbp/3pbnp1/q2N4/1p1BP3/1B3P2/PPPQ2PP/1K1R3R b - - 1 14
```

The line, with the sentence the learner sees at each move:
1. **14... Nxd5**: Black takes with the knight, and the bishop on g7 loses its shield.
2. **15. Bxg7**: The bishop on d4 takes it along the long diagonal.
3. **15... Nc3+**: Black checks, attacking the king and the rook on d1.
4. **16. bxc3**: White takes the knight with the pawn.
5. **16... Kxg7**: Black takes the bishop.
6. **17. Qd4+**: The queen checks along the long diagonal.

```
  8  r . . . . r . .
  7  p . . . p p k p
  6  . . . p b . p .
  5  q . . . . . . .
  4  . p . Q P . . .
  3  . B P . . P . .
  2  P . P . . . P P
  1  . K . R . . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r4r2/p3ppkp/3pb1p1/q7/1p1QP3/1BP2P2/P1P3PP/1K1R3R b - - 1 17
```

Drawn on the board: arrows f6-d5, d4-g7; highlighted squares d5, g7, d4.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] The bishop recapture on d5 is the engine's top choice (depth 16).
- [move_loses] The knight recapture on d5 scores at least 60 cp worse than the best move (depth 16).
- [attackers] After the knight leaves f6 the white bishop on d4 attacks g7.

### Step 32: board

Caption: A jump with an extra task: the knight on d5 also supports the pawn storm. Godart-Dgebuadze, 2020 (Black won, so the engine's +2.6 at depth 16 shows White had the better chance, not the result).

```
  8  . . . q . r k .
  7  p p . . . p b p
  6  . . . p . . p .
  5  . . . . n . P .
  4  . . r N P . n P
  3  . . N . . . . .
  2  P P P Q . . . .
  1  . K . R . . B R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 3q1rk1/pp3pbp/3p2p1/4n1P1/2rNP1nP/2N5/PPPQ4/1K1R2BR w - - 0 18
```

The line, with the sentence the learner sees at each move:
1. **18. Nd5**: The knight jumps to d5, a square no black pawn attacks.
2. **18... Qd7**: Black's queen prepares to guard.
3. **19. h5**: White keeps the h-file attack going.
4. **19... f6**: Black blocks the diagonal of the bishop.
5. **20. b3**: The pawn attacks the rook on c4.
6. **20... Rcc8**: The rook retreats.
7. **21. hxg6**: White opens the h-file.

```
  8  . . r . . r k .
  7  p p . q . . b p
  6  . . . p . p P .
  5  . . . N n . P .
  4  . . . N P . n .
  3  . P . . . . . .
  2  P . P Q . . . .
  1  . K . R . . B R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 2r2rk1/pp1q2bp/3p1pP1/3Nn1P1/3NP1n1/1P6/P1PQ4/1K1R2BR b - - 0 21
```

Drawn on the board: arrows c3-d5, b2-b3; highlighted squares d5, c4.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] The knight jump to d5 and the pawn move h5 are each within 40 cp of the engine's best move (depth 16).
- [eval_range] The engine rates this position between +2 and +4 for White (depth 16).
- [attackers] No black piece attacks d5 before the jump.

### Step 33: item

**Task `IOD-LODDRAGON6-15`** (find_move, difficulty cue 2)

White to move. Black has just played ...b4 to chase the knight. Find White's best move.

```
  8  r . . . . r k .
  7  p . . . p p b p
  6  . . . p b n p .
  5  q . . . . . . .
  4  . p . B P . . .
  3  . B N . . P . .
  2  P P P Q . . P P
  1  . K . R . . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: r4rk1/p3ppbp/3pbnp1/q7/1p1BP3/1BN2P2/PPPQ2PP/1K1R3R w - - 0 14
```

**Accepted answer(s):** Nd5

**Explanation shown:** Nd5 trades the knight for the bishop on e6 after the pawn recaptures; the engine (depth 16) prefers it to the quiet alternatives.

Hints (in order):
1. The knight on c3 is attacked by a pawn.
2. Which square in the middle is attacked by a Black bishop and a Black knight?
3. The knight can jump to d5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] This is the engine's top choice at depth 16 (every accepted move within 40 cp).

### Step 34: card

**The exchange sacrifice on c3.** Black gives a rook for the knight. In the common case a pawn recaptures, White's king (usually on the queenside) has lost its cover, the queen reaches a5, and the bishop on g7 stands behind the knight on f6. [I] The general principle: the rook is paid for by a target the pawn recapture exposes: a king without cover, a loose pawn, a long diagonal. Nimzowitsch argued for giving material to open a line, but only after quieter attacks have been tried [S].

### Step 35: board

Caption: A real exchange sacrifice (Ter Sahakyan-Nakamura, 2026, Black won). The engine rates it only a little below its best move and calls White slightly better (depth 16): it is sound, not magic.

```
  8  . . r q k . . r
  7  . b . n p p b p
  6  p . . p . n p .
  5  . p . . . . . .
  4  . . . N P . . P
  3  . B N . B P . .
  2  P P P . Q . P .
  1  . . K R . . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: 2rqk2r/1b1nppbp/p2p1np1/1p6/3NP2P/1BN1BP2/PPP1Q1P1/2KR3R b k - 0 12
```

The line, with the sentence the learner sees at each move:
1. **12... Rxc3**: The rook takes the knight that guards the white king's flank.
2. **13. bxc3**: White recaptures; the pawn cover in front of the king is broken.
3. **13... Qa5**: The queen attacks the pawn on c3 and eyes a2.
4. **14. Kb1**: White takes the king off the open c-file.
5. **14... Qxc3**: The queen wins the pawn back and stands next to the king.
6. **15. Bc1**: The bishop falls back to guard b2.
7. **15... Ne5**: A knight joins the attack on the white king.

```
  8  . . . . k . . r
  7  . b . . p p b p
  6  p . . p . n p .
  5  . p . . n . . .
  4  . . . N P . . P
  3  . B q . . P . .
  2  P . P . Q . P .
  1  . K B R . . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 4k2r/1b2ppbp/p2p1np1/1p2n3/3NP2P/1Bq2P2/P1P1Q1P1/1KBR3R w k - 2 16
```

Drawn on the board: arrows c8-c3, g7-c3; highlighted squares c3, c1, g7.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] The pawn move h5, the knight move Nc5 and the exchange sacrifice are each within 40 cp of the engine's best move (depth 16).
- [attackers] After the pawn recaptures and the queen reaches a5 one black piece attacks c3: the queen.
- [piece_on] The bishop stands on g7 behind the knight on f6.
- [piece_on] The knight stands on f6.

### Step 36: board

Caption: The same position with one change: White's king stands on g1 (rooks on d1 and h1). The queenside king is gone, and the sacrifice is no longer one of Black's best moves: the engine rates it about 1.4 pawns below the best move (depth 16). That is the common case failing. The next boards show where it still works.

```
  8  . . r q k . . r
  7  . b . n p p b p
  6  p . . p . n p .
  5  . p . . . . . .
  4  . . . N P . . P
  3  . B N . B P . .
  2  P P P . Q . P .
  1  . . . . . R K R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: 2rqk2r/1b1nppbp/p2p1np1/1p6/3NP2P/1BN1BP2/PPP1Q1P1/5RKR b k - 0 12
```

Drawn on the board: arrows c8-c3; highlighted squares g1, c3.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [move_loses] The exchange sacrifice scores at least 100 cp worse than the best move (depth 16).
- [king_wing] White's king is on the kingside.

### Step 37: board

Caption: Another sacrifice, from the other side of the attack (Matinian-Kanter, 2013). White won the game, but the engine rates this position clearly better for Black, about two and a third pawns, and the sacrifice is its first choice (depth 16). The line is the engine's continuation: the queen swings to b6 and Black keeps the advantage. A sacrifice can be right and still lose to later mistakes.

```
  8  . . . . r . k .
  7  p p . b p p . .
  6  . . . p . b p B
  5  q . . . P . . n
  4  . . r N . P p .
  3  . . N . . . . .
  2  P P P Q . . . .
  1  . K . . . . R R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: 4r1k1/pp1bpp2/3p1bpB/q3P2n/2rN1Pp1/2N5/PPPQ4/1K4RR b - - 0 20
```

The line, with the sentence the learner sees at each move:
1. **20... Rxc3**: The rook takes the knight that guards the white king's flank.
2. **21. bxc3**: White recaptures with the pawn.
3. **21... Qb6+**: The queen swings to b6 and attacks the knight on d4.
4. **22. Nb3**: The knight retreats.
5. **22... Bh8**: The bishop retreats to h8.
6. **23. Re1**: The rook leaves the g-file.
7. **23... Bf5**: The bishop comes to f5.
8. **24. Kc1**: The king steps to c1.

```
  8  . . . . r . k b
  7  p p . . p p . .
  6  . q . p . . p B
  5  . . . . P b . n
  4  . . . . . P p .
  3  . N P . . . . .
  2  P . P Q . . . .
  1  . . K . R . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 4r1kb/pp2pp2/1q1p2pB/4Pb1n/5Pp1/1NP5/P1PQ4/2K1R2R b - - 6 24
```

Drawn on the board: arrows c4-c3, a5-b6; highlighted squares c3, e5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] The exchange sacrifice is the engine's top choice (depth 16).
- [eval_range] The engine rates this position at -1 or worse for White (depth 16).

### Step 38: board

Caption: The shot behind the sacrifice: after the pawn recaptures on c3, the e4 pawn is loose. Sasikiran-Yakovich, 2020 (Black won). White's king stands on g1 and Black's queen is still on d8, yet the sacrifice is the engine's first choice, about two pawns ahead for Black (depth 16). So the target is not always a king on the queenside. Not every Dragon has an f3 pawn; here White never played it.

```
  8  . . r q . r k .
  7  p b . n p p b p
  6  . p . p . n p .
  5  . . . . . . . .
  4  . . . . P . . .
  3  . B N . . N . P
  2  P P P . Q P P .
  1  R . B R . . K .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: 2rq1rk1/pb1nppbp/1p1p1np1/8/4P3/1BN2N1P/PPP1QPP1/R1BR2K1 b - - 5 12
```

The line, with the sentence the learner sees at each move:
1. **12... Rxc3**: The rook takes the knight that guards e4 and c3.
2. **13. bxc3**: White recaptures with the pawn.
3. **13... Nxe4**: The knight takes e4 and attacks c3 and f2.
4. **14. Bb2**: White guards c3 with the bishop.
5. **14... Nxc3**: The knight takes c3, attacking the queen on e2 and the rook on d1.
6. **15. Bxc3**: White takes the knight.
7. **15... Bxc3**: Black takes back; the long diagonal now hits the rook on a1.

```
  8  . . . q . r k .
  7  p b . n p p . p
  6  . p . p . . p .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . B b . . N . P
  2  P . P . Q P P .
  1  R . . R . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 3q1rk1/pb1npp1p/1p1p2p1/8/8/1Bb2N1P/P1P1QPP1/R2R2K1 w - - 0 16
```

Drawn on the board: arrows f6-e4, e4-c3; highlighted squares e4, c3.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] The exchange sacrifice is the engine's top choice (depth 16).
- [eval_range] The engine rates this position at -0.8 or worse for White (depth 16).

### Step 39: reflect

Kind: expect

Prompt: This White king is on g1, yet the sacrifice works. What does the pawn recapture expose instead? Write your answer, then replay the line and check it.

- Field "The target the recapture exposes:" (free text)

### Step 40: board

Caption: Games and engines differ: after the sacrifice the engine's first choice is the queen move to c7, and the game's ...Qa5 is within a fraction of a pawn of it (depth 16). Both keep the attack alive; the engine still gives White a small edge.

```
  8  . . . q k . . r
  7  . b . n p p b p
  6  p . . p . n p .
  5  . p . . . . . .
  4  . . . N P . . P
  3  . B P . B P . .
  2  P . P . Q . P .
  1  . . K R . . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: 3qk2r/1b1nppbp/p2p1np1/1p6/3NP2P/1BP1BP2/P1P1Q1P1/2KR3R b k - 0 13
```

The line, with the sentence the learner sees at each move:
1. **13... Qc7**: The queen aims at c3 from the side and keeps the e5 break.
2. **14. g4**: White starts the pawn storm.
3. **14... e5**: The pawn hits the knight on d4.
4. **15. h5**: White keeps going.
5. **15... exd4**: Black takes the knight.
6. **16. cxd4**: White recaptures.
7. **16... Nb6**: The knight heads for c4.

```
  8  . . . . k . . r
  7  . b q . . p b p
  6  p n . p . n p .
  5  . p . . . . . P
  4  . . . P P . P .
  3  . B . . B P . .
  2  P . P . Q . . .
  1  . . K R . . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 4k2r/1bq2pbp/pn1p1np1/1p5P/3PP1P1/1B2BP2/P1P1Q3/2KR3R w k - 1 17
```

Drawn on the board: arrows d8-c7, e7-e5; highlighted squares c7, d4.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] The queen moves to c7 and to a5 are each within 100 cp of the engine's best move (depth 16).
- [eval_range] The engine rates this position between 0.0 and +1.2 for White (depth 16).

### Step 41: contrast

Title: Is the exchange sacrifice sound?

Prompt: Predict for each position, then check. One difference matters; one does not.

**The working board:**

**Task `IOD-LODDRAGON6-8`** (predict_outcome, difficulty cue 2)

Black to move. Black can give the exchange with the rook taking the knight on c3. Is that one of the engine's good moves, or clearly worse than the best move?

```
  1  R . . . R K . .
  2  . P . Q . P P P
  3  . . P B . N B .
  4  P . . P N . . .
  5  . . . . . . p .
  6  . p n . p . . p
  7  p b p p n . b .
  8  r . . k q r . .
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: 2rqk2r/1b1nppbp/p2p1np1/1p6/3NP2P/1BN1BP2/PPP1Q1P1/2KR3R b k - 0 12
```

**Accepted answer:** {"outcome": "one of the good moves"}

**Explanation shown:** The exchange sacrifice scores close to the engine's best move (depth 16): the bishop on g7 and the queen coming to a5 attack c3, and the king on c1 has lost its cover.

Hints (in order):
1. Black's bishop stands on g7 and White's king stands on c1.
2. What attacks c3 after the pawn recaptures?
3. One of the good moves: the sacrifice is within 40 centipawns of the best move.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] The exchange sacrifice, h5 and Nc5 are each within 40 cp of the engine's best move (depth 16).

**The failing board:**

**Task `IOD-LODDRAGON6-9`** (predict_outcome, difficulty cue 2)

The same position, but White's queen stands on d2 instead of e2. Black gives the exchange on c3. Is that one of the engine's good moves, or clearly worse than the best move?

```
  1  R . . . R K . .
  2  . P . . Q P P P
  3  . . P B . N B .
  4  P . . P N . . .
  5  . . . . . . p .
  6  . p n . p . . p
  7  p b p p n . b .
  8  r . . k q r . .
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: 2rqk2r/1b1nppbp/p2p1np1/1p6/3NP2P/1BN1BP2/PPPQ2P1/2KR3R b k - 0 12
```

**Accepted answer:** {"outcome": "clearly worse"}

**Explanation shown:** With the queen on d2 it can recapture on c3, so the pawn cover in front of the king is not broken and Black has given a rook for a knight with little in return. The sacrifice scores at least 150 centipawns below the best move (depth 16).

Hints (in order):
1. Which White pieces can recapture on c3?
2. Compare who recaptures with the first position.
3. Clearly worse: the queen recaptures on c3 and the king's cover stays.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [move_loses] Rxc3 scores at least 150 cp worse than the best move (depth 16).

**The irrelevant board:**

**Task `IOD-LODDRAGON6-10`** (predict_outcome, difficulty cue 2)

The same position, but White's a-pawn stands on a3. Black gives the exchange on c3. Is that one of the engine's good moves, or clearly worse than the best move?

```
  1  R . . . R K . .
  2  . P . Q . P P .
  3  . . P B . N B P
  4  P . . P N . . .
  5  . . . . . . p .
  6  . p n . p . . p
  7  p b p p n . b .
  8  r . . k q r . .
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: 2rqk2r/1b1nppbp/p2p1np1/1p6/3NP2P/PBN1BP2/1PP1Q1P1/2KR3R b k - 0 12
```

**Accepted answer:** {"outcome": "one of the good moves"}

**Explanation shown:** The a-pawn is irrelevant to the sacrifice: the verdict is the same as in the first position (within 40 centipawns of the best move, depth 16).

Hints (in order):
1. Does the a-pawn guard anything on the c-file or the long diagonal?
2. Compare with the first position.
3. One of the good moves: the a-pawn does not change the verdict.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] Rxc3 is within 40 cp of the engine's top choice (depth 16).

### Step 42: reflect

Kind: expect

Prompt: [H] Hypothesis: the exchange sacrifice on c3 is the most common way for a club player with Black to meet White's attack in time, because it removes a defender and creates threats in one move. Our data stops at the twelfth move, so it cannot test this. What would you look for in your own games to support or refute it?

- Field "What I would look for:" (free text)

## Chapter: The c-file and king hunts

### Step 43: card

**Queen and rook on the c-file.** Black's queen on a5 and rook on c8 aim at the knight on c3 and the king behind it. Count who guards what: the pawn on b2 and the queen on d2 guard c3, the black queen attacks it, and the rook waits behind its own knight. [H] A single missed guard, usually of the knight on c3 or the pawn on c2, is behind many Dragon blunders. The habit to train is: who guards what.

### Step 44: board

Caption: Who guards what? The knight on c3 has two defenders (the pawn on b2 and the queen on d2) and one attacker (the queen on a5). The rook on c8 is blocked by its own knight, but a single knight move opens the file.

```
  8  r . r . . . k .
  7  p p . b p p b p
  6  . . n p . n p .
  5  q . . . . . . .
  4  . . . N P . . .
  3  . B N . B P . .
  2  P P P Q . . P P
  1  . . K R . . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: r1r3k1/pp1bppbp/2np1np1/q7/3NP3/1BN1BP2/PPPQ2PP/2KR3R w - - 9 12
```

Drawn on the board: arrows a5-c3, d2-c3, b2-c3, c8-c6; highlighted squares c3, c6, c2.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [attackers] Two white pieces attack (defend) c3.
- [attackers] One black piece attacks c3.
- [best_move_in] g4, Kb1 and h4 are each within 40 cp of the engine's best move (depth 16).

### Step 45: item

**Task `IOD-LODDRAGON6-17`** (predict_outcome, difficulty cue 2)

White to move. How many White pieces defend the knight on c3?

```
  8  r . r . . . k .
  7  p p . b p p b p
  6  . . n p . n p .
  5  q . . . . . . .
  4  . . . N P . . .
  3  . B N . B P . .
  2  P P P Q . . P P
  1  . . K R . . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: r1r3k1/pp1bppbp/2np1np1/q7/3NP3/1BN1BP2/PPPQ2PP/2KR3R w - - 9 12
```

**Accepted answer:** {"outcome": "two"}

**Explanation shown:** The pawn on b2 and the queen on d2 defend the knight; the black queen on a5 attacks it. The rook on c8 is blocked by its own knight on c6.

Hints (in order):
1. Look for a pawn and a queen.
2. A defender must be able to capture on c3.
3. The pawn on b2 and the queen on d2.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [attackers] Two white pieces attack (defend) c3.
- [attackers] One black piece attacks c3.

### Step 46: board

Caption: The pressure in action. The engine calls this position better for White at depth 16, but several White moves are fine only if they leave c3 safe: the king move to b1 and g4 both do. Black's queen and rook now both attack c3.

```
  8  r . r . . . k .
  7  p p . b p p b p
  6  . . n p . n p .
  5  q . . . . . . .
  4  . . . N P . . .
  3  . B N . B P . .
  2  P P P Q . . P P
  1  . . K R . . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: r1r3k1/pp1bppbp/2np1np1/q7/3NP3/1BN1BP2/PPPQ2PP/2KR3R w - - 9 12
```

The line, with the sentence the learner sees at each move:
1. **12. Kb1**: The king leaves the c-file and the diagonal that starts on a5.
2. **12... Ne5**: The knight leaves c6 and opens the c-file: now two black pieces aim at c3.
3. **13. g4**: White starts the pawn storm.
4. **13... Nc4**: The knight attacks the queen on d2 and the bishop on e3 at once.
5. **14. Bxc4**: White removes the knight.
6. **14... Rxc4**: The rook recaptures and owns the c-file.
7. **15. Nb3**: The knight steps to b3 to cover the weak squares.
8. **15... Qa6**: The queen eyes the rook and the pawn on a2.

```
  8  r . . . . . k .
  7  p p . b p p b p
  6  q . . p . n p .
  5  . . . . . . . .
  4  . . r . P . P .
  3  . N N . B P . .
  2  P P P Q . . . P
  1  . K . R . . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r5k1/pp1bppbp/q2p1np1/8/2r1P1P1/1NN1BP2/PPPQ3P/1K1R3R w - - 2 16
```

Drawn on the board: arrows c8-c3, a5-c3; highlighted squares c3, c4, e5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [attackers] After the knight leaves c6 two black pieces attack c3: the queen and the rook.
- [best_move_in] The king move to b1 and g4 are each within 40 cp of the engine's best move (depth 16).
- [eval_range] The engine rates this position between +0.3 and +1.5 for White (depth 16).

### Step 47: board

Caption: The same trick with queen and rook behind it. Bh6 loses to ...Nxd4: the trade on g7 is answered by a check on b3. The engine puts White more than five pawns down (depth 16).

```
  8  r . r . . . k .
  7  p p . b p p b p
  6  . . n p . n p .
  5  q . . . . . . .
  4  . . . N P . . .
  3  . B N . B P . .
  2  P P P Q . . P P
  1  . . K R . . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: r1r3k1/pp1bppbp/2np1np1/q7/3NP3/1BN1BP2/PPPQ2PP/2KR3R w - - 9 12
```

The line, with the sentence the learner sees at each move:
1. **12. Bh6**: The same offer as in the hook position.
2. **12... Nxd4**: The knight takes d4: it attacks the bishop on b3 and the pawn on c2.
3. **13. Bxg7**: White takes the bishop.
4. **13... Nxb3+**: The knight takes the bishop with check.
5. **14. cxb3**: White recaptures; the c-pawn has left, so the c-file is open to the king.
6. **14... Kxg7**: Black recaptures and White is a piece down.
7. **15. Kb1**: White steps off the file.
8. **15... h5**: Black pushes on the wing.

```
  8  r . r . . . . .
  7  p p . b p p k .
  6  . . . p . n p .
  5  q . . . . . . p
  4  . . . . P . . .
  3  . P N . . P . .
  2  P P . Q . . P P
  1  . K . R . . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r1r5/pp1bppk1/3p1np1/q6p/4P3/1PN2P2/PP1Q2PP/1K1R3R w - - 0 16
```

Drawn on the board: arrows c6-d4, d4-b3; highlighted squares b3, c2, d4.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [move_loses] The bishop move to h6 scores at least 400 cp worse than the best move (depth 16).
- [attackers] After ...Nxd4 the knight attacks c2 and the bishop on b3.

### Step 48: item

**Task `IOD-LODDRAGON6-7`** (find_move, difficulty cue 2)

Black to move. White has just offered the trade on g7 with the bishop. Find Black's best move.

```
  1  R . . . R K . .
  2  P P . . Q P P P
  3  . . P . . N B .
  4  . . . P N . . .
  5  . . . . . . . q
  6  B p n . p n . .
  7  p b p p b . p p
  8  . k . . . r . r
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: r1r3k1/pp1bppbp/2np1npB/q7/3NP3/1BN2P2/PPPQ2PP/2KR3R b - - 10 12
```

**Accepted answer(s):** Nxd4

Feedback shown for wrong moves:
- Bxh6: Taking the bishop first also loses material but gives White more chances; the knight capture wins the knight at once.

**Explanation shown:** After ...Nxd4 the knight attacks the bishop on b3 and the pawn on c2; White cannot take the trade on g7 without losing material (depth 16). Taking on h6 first scores far lower.

Hints (in order):
1. Which white piece guarded d4 and c2?
2. The queen is on a5, the rook on c8, and the white bishop on b3 stands next to the loose pawn on c2.
3. The knight on c6 takes the knight on d4.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] This is the engine's top choice at depth 16 (every accepted move within 40 cp).
- [move_loses] Bxh6 scores at least 100 cp worse than the best move (depth 16).

### Step 49: card

**King hunts and the back rank.** With the king on c1 or b1, White's weak squares are c2, b2 and a2, and the knight on c3 and the pawn on b2 are the cover. [I] In the sharp lines White's king is in more danger than Black's, because Black's pieces already stand on the c-file; our data stops at the twelfth move, so check this against your own games. Black's matching weak points are h7 and g7.

### Step 50: board

Caption: A king hunt that does not mate but ties White down (Ter Sahakyan-Nakamura, 2026). Black wins no material here by force: the engine still gives White a small edge (depth 16). Note the squares: b2, a1, c2.

```
  8  . . . . k . . r
  7  . b . n p p b p
  6  p . . p . n p .
  5  q p . . . . . .
  4  . . . N P . . P
  3  . B P . B P . .
  2  P . P . Q . P .
  1  . K . R . . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: 4k2r/1b1nppbp/p2p1np1/qp6/3NP2P/1BP1BP2/P1P1Q1P1/1K1R3R b k - 2 14
```

The line, with the sentence the learner sees at each move:
1. **14... Qxc3**: The queen takes the pawn: it now eyes b2, c2 and a1 around the king.
2. **15. Bc1**: The bishop covers b2 and slows the hunt.
3. **15... Ne5**: A knight joins the attack.
4. **16. Bb2**: The bishop returns and attacks the queen.
5. **16... Qc5**: The queen steps away and keeps the pressure.
6. **17. g4**: White starts its own attack on the other wing.

```
  8  . . . . k . . r
  7  . b . . p p b p
  6  p . . p . n p .
  5  . p q . n . . .
  4  . . . N P . P P
  3  . B . . . P . .
  2  P B P . Q . . .
  1  . K . R . . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 4k2r/1b2ppbp/p2p1np1/1pq1n3/3NP1PP/1B3P2/PBP1Q3/1K1R3R b k - 0 17
```

Drawn on the board: arrows c3-b2, c3-a1; highlighted squares b2, a1, c2, b1.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [attackers] After ...Qxc3 the black queen attacks b2.
- [eval_range] The engine rates this position between +0.3 and +1.2 for White (depth 16).

### Step 51: board

Caption: King hunt on the first rank. After axb3, the worse recapture, the queen reaches a1 with check and the knight on b1 can never move, tying the king to c1, b1 and a2. Recapturing with the c-pawn loses too but avoids this net. Both lose clearly (depth 16).

```
  8  r . r . . . k .
  7  p p . b p p B p
  6  . . . p . n p .
  5  q . . . . . . .
  4  . . . . P . . .
  3  . n N . . P . .
  2  P P P Q . . P P
  1  . . K R . . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: r1r3k1/pp1bppBp/3p1np1/q7/4P3/1nN2P2/PPPQ2PP/2KR3R w - - 0 14
```

The line, with the sentence the learner sees at each move:
1. **14. axb3**: White recaptures with the a-pawn and opens the a-file.
2. **14... Qa1+**: The queen checks along the first rank.
3. **15. Nb1**: The knight blocks and is pinned to the king.
4. **15... Kxg7**: Black takes the bishop.
5. **16. h4**: White pushes on.
6. **16... h5**: Black makes luft.

```
  8  r . r . . . . .
  7  p p . b p p k .
  6  . . . p . n p .
  5  . . . . . . . p
  4  . . . . P . . P
  3  . P . . . P . .
  2  . P P Q . . P .
  1  q N K R . . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r1r5/pp1bppk1/3p1np1/7p/4P2P/1P3P2/1PPQ2P1/qNKR3R w - - 0 17
```

Drawn on the board: arrows a5-a1, a1-b1; highlighted squares a1, b1, c1, a2.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] Both recaptures are within 100 cp of each other and both lose heavily (depth 16).
- [eval_range] The engine rates this position at -4 or worse for White (depth 16).
- [attackers] After ...Qa1+ and Nb1 the black queen attacks the knight on b1 and the king stands on c1.

### Step 52: board

Caption: Why the king steps to b1 first. In our master data this position (after 11.Bb3 Ne5) saw 12.Kb1 in 30 games: 14 White wins, 15 draws, 1 Black win. The engine also puts the king move first (depth 16).

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
1. **12. Kb1**: The king leaves the c-file and the diagonal a5-e1 before anything else.
2. **12... Nc4**: The knight attacks the queen and the bishop on e3.
3. **13. Bxc4**: White removes the knight.
4. **13... Rxc4**: The rook recaptures and takes the c-file.
5. **14. g4**: White starts the pawn storm.
6. **14... b5**: Black prepares to chase the knight on c3.
7. **15. h4**: White pushes.

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

Drawn on the board: arrows c1-b1, e5-c4; highlighted squares b1, c1, c4.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] The king move to b1 is the engine's top choice (depth 16).
- [eval_range] The engine rates this position between +0.3 and +1.5 for White (depth 16).

### Step 53: card

**Traps: what actually occurs.** In a local file of well over a thousand high-level Dragon games (both players 2400+, 2012 to 2026, online rapid and blitz included; see the sources for the filter) [V], the three mistakes on these boards, three specific positions, never occur: players avoid them. They are errors a lower-rated player might make, and the engine shows that each loses. [I] You learn the shape, not the line. The move 7...Ng4 below does occur, in 3 games, and is good.

### Step 54: board

Caption: Trap 1: ...Nxe4? Black takes a pawn, but the f-pawn recaptures and Black has no compensation. In the first twelve moves (24 plies) no master game reached this; the engine rates it at least 400 cp lower than the best move (depth 16).

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
1. **9... Nxe4**: Black grabs a pawn with the knight.
2. **10. fxe4**: The f-pawn takes: Black has given a knight for a pawn.
3. **10... Ne5**: Black attacks the bishop on c4.
4. **11. Be2**: The bishop steps back.
5. **11... Bg4**: Black attacks the bishop on e2.
6. **12. Nf3**: The knight blocks the diagonal.
7. **12... Rc8**: Black brings a rook to the c-file.

```
  8  . . r q . r k .
  7  p p . . p p b p
  6  . . . p . . p .
  5  . . . . n . . .
  4  . . . . P . b .
  3  . . N . B N . .
  2  P P P Q B . P P
  1  R . . . K . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 2rq1rk1/pp2ppbp/3p2p1/4n3/4P1b1/2N1BN2/PPPQB1PP/R3K2R w KQ - 5 13
```

Drawn on the board: arrows f6-e4, f3-e4; highlighted squares e4, f3.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [move_loses] The knight capture on e4 scores at least 400 cp worse than the best move (depth 16).
- [attackers] After the capture a white pawn can retake on e4.

### Step 55: board

Caption: Trap 2 and its opposite. If White delays f3, ...Ng4 is a good move (the engine puts it first, depth 16), but ...Nxe4? loses at least three pawns. The pawn on f3 is what makes the Yugoslav work.

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
1. **7... Ng4**: Without a pawn on f3 the knight can jump to g4 and attack the bishop on e3.
2. **8. Bg5**: The bishop steps to g5, attacking the queen.
3. **8... h6**: The pawn attacks the bishop.
4. **9. Bh4**: The bishop retreats.
5. **9... Nc6**: Black develops a piece.
6. **10. Nb3**: The knight steps back.
7. **10... Be6**: Black develops the last piece.

```
  8  r . . q k . . r
  7  p p . . p p b .
  6  . . n p b . p p
  5  . . . . . . . .
  4  . . . . P . n B
  3  . N N . . . . .
  2  P P P Q . P P P
  1  R . . . K B . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r2qk2r/pp2ppb1/2npb1pp/8/4P1nB/1NN5/PPPQ1PPP/R3KB1R w KQkq - 4 11
```

Drawn on the board: arrows f6-g4, e3-g4; highlighted squares g4, e4, e3.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] The knight move to g4 is the engine's top choice (depth 16).
- [move_loses] The knight capture on e4 scores at least 300 cp worse than the best move (depth 16).

### Step 56: item

**Task `IOD-LODDRAGON6-18`** (predict_outcome, difficulty cue 2)

Black to move. Black can take the pawn on e4 with the knight. Is that one of the engine's good moves, or clearly worse than the best move?

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

**Accepted answer:** {"outcome": "clearly worse"}

**Explanation shown:** After the knight is taken Black has only a pawn in return. The engine (depth 16) rates ...Nxe4 at least 400 centipawns lower than its top move.

Hints (in order):
1. Which White pawn can recapture?
2. What does the recapture do to the e4 square and to the knight on c6?
3. Clearly worse: after fxe4 the knight is gone and Black has one pawn.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [move_loses] Nxe4 scores at least 80 cp worse than the best move (depth 16).

## Chapter: What the shapes share

### Step 57: card

**What the six shapes share.** Each removes or overloads a guard: the bishop on g7, the pawn on g6, the guards of d4, the knight on c3. Before a forcing move ask who guards what and what leaves. Edward Lasker's rule applies too: every pawn move leaves something behind [S]. Nimzowitsch spoke of giving material to clear the way [S]; Petrosian used the positional exchange sacrifice [S], a different purpose from a quick attack [I].

### Step 58: reflect

Kind: unsure

Prompt: [H] Hypothesis: the six shapes can be reduced to one question, "who guards what, and what leaves?". Do you agree? Name a Dragon shape (or a position from your own games) that this question would not catch.

- Field "I agree / disagree because:" with options: agree / partly / disagree; no single correct answer (a guess or a self-report)

### Step 59: item  (shown without telling the learner the topic: unlabeled test)

**Task `IOD-LODDRAGON6-20`** (find_move, difficulty cue 3)

White to move. Find a strong move.

```
  8  r . . q . r k .
  7  p p . . p p b p
  6  . . n . b n p .
  5  . . . p . . . .
  4  . . . . P . . P
  3  . N N . B P . .
  2  P P P . . . P .
  1  . . K R Q B . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: r2q1rk1/pp2ppbp/2n1bnp1/3p4/4P2P/1NN1BP2/PPP3P1/2KRQB1R w - - 3 13
```

**Accepted answer(s):** h5

**Explanation shown:** h5 aims to open the h-file; the engine (depth 16) rates the position at about +3 after it.

Hints (in order):
1. Which wing do the kings point at?
2. A pawn can open a file.
3. A pawn move on the wing where Black's king stands.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] This is the engine's top choice at depth 16 (every accepted move within 40 cp).

### Step 60: item  (shown without telling the learner the topic: unlabeled test)

**Task `IOD-LODDRAGON6-21`** (find_move, difficulty cue 3)

Black to move. Find a good move; three moves are accepted.

```
  1  R . . . R K . .
  2  . P . Q . P P P
  3  . . P B . N B .
  4  P . . P N . . .
  5  . . . . . . p .
  6  . p n . p . . p
  7  p b p p n . b .
  8  r . . k q r . .
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: 2rqk2r/1b1nppbp/p2p1np1/1p6/3NP2P/1BN1BP2/PPP1Q1P1/2KR3R b k - 0 12
```

**Accepted answer(s):** Rxc3, h5, Nc5

**Explanation shown:** The exchange sacrifice, h5 and Nc5 are each within 40 centipawns of the engine's best (depth 16): the sacrifice is sound but not the only good plan.

Hints (in order):
1. Which squares are weak near the white king?
2. A pawn move can also be the right answer.
3. At least one accepted move is a quiet pawn or knight move, not only the sacrifice.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] The exchange sacrifice, h5 and Nc5 are each within 40 cp of the engine's best move (depth 16).

### Step 61: practice

A drill of 6 tasks drawn from the bank by tag ['theme.dragon'] (171 tasks carry those tags). Not reproduced here; ask for a sample if you want one checked.

### Step 62: reflect

Kind: unsure

Prompt: Teach it back. Imagine a beginner who has just seen the Dragon. In your own words write: which of the six shapes you would teach first, when it works, one example a beginner can set up on a board, and one warning.

- Field "The shape and the idea:" (free text)

- Field "When it works and when it fails:" (free text)

- Field "An example on a board:" (free text)

- Field "One warning:" (free text)

### Step 63: card

**Self-check.** Did you say when the trade on h6 works and when it fails? Did you give an example a beginner could set up on a board? Did you name the common case of the exchange sacrifice (bishop on g7, king on the queenside, a queen ready to arrive) and the general principle (a target the recapture exposes)? Did you name one mistake, such as spending both guards of the knight on d4? The app grades nothing. Compare with a friend or coach.

### Step 64: card

**Recap.**
- The trade on h6 works when the h-file is ready; it fails when the bishop and queen are the only guards of a loose knight on d4.
- The h-file attack is a team job and a race.
- Count attackers and guards before the jump to d5.
- The exchange sacrifice needs a target the recapture exposes: often a queenside king, sometimes a loose pawn.
- Queen and rook on the c-file make c3 the square to count.
- Ask who guards what before every forcing move.

### Step 65: reflect

Kind: confidence

Prompt: How sure are you that you could spot, in a new position, which of the six shapes is in the air? Pick one and name the shape you would check first.

- Field "I could spot it:" with options: clearly / with help / not yet; no single correct answer (a guess or a self-report)

- Field "The shape I would check first:" (free text)

---

## Reviewer scorecard

Fill in the file `content/review/L-OD-DRAGON-6.json` (a template is below). Scale 1 to 5 for each dimension: 1 = wrong or unusable, 3 = acceptable with edits, 5 = I would put my name to it as it stands.
Revision to review: `fb13d188`. If the lesson text changes after your review, your sign-off no longer applies and the lesson goes back to needs-human.

| Dimension | What to judge | Score |
|---|---|---|
| chess | every statement, line and explanation is correct; near-misses are really near-misses | |
| clarity | the explanation actually explains (mechanism, conditions), in plain words | |
| prerequisites | the lesson assumes only what the learner has met | |
| tasks | each task has one defensible answer and a fair explanation | |

```json
{
  "lesson": "L-OD-DRAGON-6",
  "revision": "fb13d188",
  "reviewer": "<your name>",
  "reviewer_role": "strong-player",
  "date": "YYYY-MM-DD",
  "scores": {"chess": 0, "clarity": 0, "prerequisites": 0, "tasks": 0},
  "comments": "<what to change, by step number>",
  "verdict": "approved"
}
```

`reviewer_role` is `strong-player` or `teacher`. `verdict` is `approved` or `changes-requested`. See docs/review-slice.md.
