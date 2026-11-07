# Review packet: L-SAF-DEFEND-OPTIONS-1

**Five ways to meet an attack**

- Skill: SAF.DEFEND-OPTIONS (D1); stage: S2; stated length: 12 minutes
- Steps: 16 (12 are tasks); revision: `ee56774f`
- Review status now: needs-human

## What the lesson says the learner will be able to do

- Names the five ways to answer an attack (move, defend, capture, block, counterattack) and uses the first four to save a piece
- Saves an attacked piece by a named way, and by any way when none is named
- Checks that the chosen way still works against that attacker, and that it leaves nothing else loose
- Says why defending fails against a cheaper attacker and why a far-away move is no answer

## Sources the author names (check that they are used fairly, in our own words)

- content/skills/SAF.DEFEND-OPTIONS.json (conditions, contrasts, misconceptions)
- docs/curriculum-map-v1.1.md (ways to meet an attack)
- positions: Lichess 2013-01 games (CC0), see item provenance; contrast positions authored

## How to read this packet

Boards are drawn with capitals for White and lower case for Black, rank 8 at the top unless the board is shown from Black's side. Moves in a line are in standard notation. Statements marked [V] were machine-checked, [I] inference, [H] hypothesis, [S] secondary source, [R] recalled. Please judge the explanations, not only the moves: does each sentence tell the learner why?

---

### Step 1: card

When one of your pieces is attacked and nothing defends it, you have five kinds of answer.
**Move** it. **Defend** it. **Capture** the attacker. **Block** the line (only against a bishop, rook or queen). **Counterattack** with a bigger threat of your own.
List them before you choose. A counterattack works only if your threat is bigger than theirs, so as a rule of thumb look at the first four first.

### Step 2: board

Caption: White to move. The black rook attacks the knight on d4 and nothing defends it. Two of the five answers are open here.

```
  8  . . . r . . k .
  7  p . . . . p p p
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . N . . . .
  3  . . . . . . . .
  2  . . . . . P P P
  1  . . B . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 3r2k1/p4ppp/8/8/3N4/8/5PPP/2B3K1 w - - 0 1
```

The line, with the sentence the learner sees at each move:
1. **1. Be3**: Defend it: the bishop now guards d4.
2. **1... a6**: Black makes a quiet move. Rxd4 Bxd4 would give a rook for a knight.

```
  8  . . . r . . k .
  7  . . . . . p p p
  6  p . . . . . . .
  5  . . . . . . . .
  4  . . . N . . . .
  3  . . . . B . . .
  2  . . . . . P P P
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 3r2k1/5ppp/p7/8/3N4/4B3/5PPP/6K1 w - - 0 2
```

Drawn on the board: arrows d8-d4, c1-e3; highlighted squares d4.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [loose_pieces] The knight on d4 is attacked and nothing defends it.
- [material_after_move] After Be3 the engine line does not lose material for White.
- [legal_destinations] The knight could also move to eight squares.

### Step 3: item

**Task `IB3-301`** (find_move, difficulty cue 1)

White to move. Your bishop on d5 is attacked by the black bishop on b7, and nothing defends it. Save it by moving it.

```
  8  . r . . . r k .
  7  p b q . . p b p
  6  . p . . . . p .
  5  . . p B p . . .
  4  . . . . . . . P
  3  . . P P B . P .
  2  P P . . . P . .
  1  R . . Q R . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 1r3rk1/pbq2pbp/1p4p1/2pBp3/7P/2PPB1P1/PP3P2/R2QR1K1 w - - 3 20
```

**Accepted answer(s):** Be4, Bf3, Bg2, Bh1

Feedback shown for wrong moves:
- Qf3: That defends the bishop instead of moving it. It works here too, but this exercise asks you to move the bishop.
- Bc4: Not attacked this move, but the engine line (depth 16) ends a pawn down for White. This exercise accepts the retreats along the long diagonal.
- Bb3: Not attacked this move, but the engine line (depth 16) ends a pawn down for White. This exercise accepts the retreats along the long diagonal.

**Explanation shown:** The bishop on d5 can be taken for free, because nothing defends it. Be4, Bf3, Bg2 and Bh1 stay on the same diagonal as the black bishop, so it can still take there, but each square is defended (by the d3 pawn, the queen or the king), so the worst case is a trade of bishops. Each leaves nothing else loose.

Hints (in order):
1. Find the attacked piece and the piece that attacks it.
2. A bishop can only go to squares on its own diagonals. For each square ask two questions: does Black attack it, and if so, does White defend it?
3. The four squares down the long diagonal toward your own side are still attacked by Black's bishop, but White defends each of them.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [loose_pieces] The bishop on d5 is attacked and nothing defends it; no other piece of that side is loose.
- [attackers] Exactly one enemy piece attacks d5.
- [material_after_move] After Be4 the engine line does not lose material.
- [loose_pieces] After Be4 none of the side's pieces is loose.
- [material_after_move] After Bf3 the engine line does not lose material.
- [loose_pieces] After Bf3 none of the side's pieces is loose.
- [material_after_move] After Bg2 the engine line does not lose material.
- [loose_pieces] After Bg2 none of the side's pieces is loose.
- [material_after_move] After Bh1 the engine line does not lose material.
- [loose_pieces] After Bh1 none of the side's pieces is loose.
- [material_after_move] After Qf3 the engine line does not lose material.
- [material_after_move] After Bc4 the engine line leaves White at least a pawn behind.
- [material_after_move] After Bb3 the engine line leaves White at least a pawn behind.

### Step 4: item

**Task `IB3-302`** (find_move, difficulty cue 1)

Black to move. Your knight on c5 is attacked by the white queen, and nothing defends it. Save it by giving it a defender.

```
  8  r . . . k b n r
  7  p p . q p p p p
  6  . . . . . . . .
  5  . . n . . . . .
  4  . . Q . . . . .
  3  . . N . . . . .
  2  P P . . K P P P
  1  R . B . . . N R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black.
FEN: r3kbnr/pp1qpppp/8/2n5/2Q5/2N5/PP2KPPP/R1B3NR b kq - 5 12
```

**Accepted answer(s):** Rc8, b6, Qc6, Qc7, Qc8, e6

Feedback shown for wrong moves:
- Ne6: That moves the knight instead of defending it. It works here too, but this exercise asks you to defend it.

**Explanation shown:** The queen has a higher counting value than the knight (9 and 3), so once the knight has a defender, taking it would cost White the queen for a knight. Each of Rc8, b6, Qc6, Qc7, Qc8 and e6 adds a defender and leaves nothing else loose.

Hints (in order):
1. Which piece attacks the knight? Compare its counting value with the knight's.
2. A queen that takes a defended knight loses more than it wins, so any defender is enough here.
3. A pawn can defend the knight directly, and so can a piece that gets onto its file, rank or diagonal.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [loose_pieces] The knight on c5 is attacked and nothing defends it; no other piece of that side is loose.
- [attackers] Exactly one enemy piece attacks c5.
- [material_after_move] After Rc8 the engine line does not lose material.
- [loose_pieces] After Rc8 none of the side's pieces is loose.
- [material_after_move] After b6 the engine line does not lose material.
- [loose_pieces] After b6 none of the side's pieces is loose.
- [material_after_move] After Qc6 the engine line does not lose material.
- [loose_pieces] After Qc6 none of the side's pieces is loose.
- [material_after_move] After Qc7 the engine line does not lose material.
- [loose_pieces] After Qc7 none of the side's pieces is loose.
- [material_after_move] After Qc8 the engine line does not lose material.
- [loose_pieces] After Qc8 none of the side's pieces is loose.
- [material_after_move] After e6 the engine line does not lose material.
- [loose_pieces] After e6 none of the side's pieces is loose.
- [material_after_move] After Ne6 the engine line does not lose material.

### Step 5: item

**Task `IB3-303`** (find_move, difficulty cue 1)

White to move. Your bishop on b2 is attacked by the black knight on d3, and nothing defends it. Save it by capturing the knight.

```
  8  . . . q . r k .
  7  . . p . . . p p
  6  . . . b . . . .
  5  . p . . . . . .
  4  . . p P B P . .
  3  P . . n . . P .
  2  . B . . . . . P
  1  . . . Q . R K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 3q1rk1/2p3pp/3b4/1p6/2pPBP2/P2n2P1/1B5P/3Q1RK1 w - - 1 25
```

**Accepted answer(s):** Bxd3

Feedback shown for wrong moves:
- Bc1: That moves the bishop instead of capturing. It works here too, but this exercise asks you to capture the knight.
- Qxd3: The queen can take on d3 too, but it is the wrong capture: the engine line then loses at least 5 in counting values.

**Explanation shown:** The knight on d3 is the only attacker, and Bxd3 removes it at once. Capturing the attacker is the cleanest answer when it is safe.

Hints (in order):
1. What attacks the bishop on b2? Which of your pieces can take that piece?
2. Look at which of your pieces see the square d3.
3. Two of your pieces can take on d3. Only one of the captures keeps your material.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [loose_pieces] The bishop on b2 is attacked and nothing defends it; no other piece of that side is loose.
- [attackers] Exactly one enemy piece attacks b2.
- [material_after_move] After Bxd3 the engine line does not lose material.
- [loose_pieces] After Bxd3 none of the side's pieces is loose.
- [material_after_move] After Bc1 the engine line does not lose material.
- [material_after_move] After Qxd3 the engine line loses at least 5 in counting values.

### Step 6: item

**Task `IB3-304`** (find_move, difficulty cue 1)

White to move. Your rook on c1 is attacked by the black rook on c8 along the c-file, and nothing defends it. Save it by putting a piece between the two rooks.

```
  8  r . r . b . k .
  7  p p . . . p p p
  6  . . . . p . n .
  5  . . . p P . . .
  4  . . . . . P R .
  3  . P . B . N . .
  2  P . . . . P . P
  1  . . R . K . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: r1r1b1k1/pp3ppp/4p1n1/3pP3/5PR1/1P1B1N2/P4P1P/2R1K3 w - - 9 19
```

**Accepted answer(s):** Bc2

Feedback shown for wrong moves:
- Rd1: That moves the rook instead of blocking. It works here too, but this exercise asks you to block the file.

**Explanation shown:** A line piece attacks only along its line, so a piece stepped between them stops the attack. Bc2 puts the bishop on c2; the black rook could only take it, and the rook on c1 would take back.

Hints (in order):
1. Which squares lie between the two rooks on the c-file?
2. A piece that steps onto one of those squares blocks the line. Which of your pieces can get there?
3. Your bishop on d3 can reach c2.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [loose_pieces] The rook on c1 is attacked and nothing defends it; no other piece of that side is loose.
- [attackers] Exactly one enemy piece attacks c1.
- [material_after_move] After Bc2 the engine line does not lose material.
- [loose_pieces] After Bc2 none of the side's pieces is loose.
- [material_after_move] After Rd1 the engine line does not lose material.

### Step 7: card

An answer must pass two checks.
**Does it stop the attack?** Defending fails when the attacker has a lower counting value than the attacked piece (a rule of thumb): a pawn takes a defended knight, and you lose a knight for a pawn. A far-away move does nothing unless it threatens more.
**Does it leave something else loose?** A defender that moves can leave the piece it guarded loose.

### Step 8: contrast

Title: Same defence, one change

Prompt: The knight on d4 is attacked, and White tries a defence. Predict, then check.

**The working board:**

**Task `IB3-310`** (predict_outcome, difficulty cue 2)

Black's rook attacks the white knight on d4, and nothing defends it. White plays Be3 (defending the knight with the bishop). Does that keep White from losing material? Predict, then check.

```
  8  . . . r . . k .
  7  p . . . . p p p
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . N . . . .
  3  . . . . . . . .
  2  . . . . . P P P
  1  . . B . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 3r2k1/p4ppp/8/8/3N4/8/5PPP/2B3K1 w - - 0 1
```

**Accepted answer:** {"outcome": "yes"}

**Explanation shown:** If the rook takes the defended knight, the bishop takes the rook: Black would give up the rook for a knight (counting values 5 and 3). The attacker has a higher counting value than the knight, so a defender is enough.

Hints (in order):
1. What does the rook win if it takes the knight? What does it lose?
2. The bishop recaptures on d4. Compare a rook with a knight.
3. Counting values: the rook counts 5 and the knight 3.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [loose_pieces] The knight on d4 is attacked and nothing defends it.
- [material_after_move] After Be3 the engine line does not lose material for White.
- [attackers] After Be3 the bishop defends the knight.

**The failing board:**

**Task `IB3-311`** (predict_outcome, difficulty cue 2)

Black's pawn attacks the white knight on d4, and nothing defends it. White plays Be3 (defending the knight with the bishop). Does that keep White from losing material? Predict, then check.

```
  8  . . . . . . k .
  7  p . . . . p p p
  6  . . . . . . . .
  5  . . . . p . . .
  4  . . . N . . . .
  3  . . . . . . . .
  2  . . . . . P P P
  1  . . B . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 6k1/p4ppp/8/4p3/3N4/8/5PPP/2B3K1 w - - 0 1
```

**Accepted answer:** {"outcome": "no"}

**Explanation shown:** The pawn takes the knight and the bishop takes the pawn: White has given up a knight for a pawn (counting values 3 and 1). Defending does not help when the attacker has a lower counting value than the piece it attacks; the knight has to move.

Hints (in order):
1. What does the pawn win if it takes the knight? What does it lose?
2. The bishop recaptures on d4. Compare a pawn with a knight.
3. Counting values: the pawn counts 1 and the knight 3.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [loose_pieces] The knight on d4 is attacked and nothing defends it.
- [material_after_move] After Be3 the engine line loses at least 2 for White.
- [attackers] After Be3 the bishop defends the knight.

**The irrelevant board:**

**Task `IB3-312`** (predict_outcome, difficulty cue 2)

Black's rook attacks the white knight on d4, and nothing defends it. White plays h3 (a pawn move on the other side of the board). Does that keep White from losing material? Predict, then check.

```
  8  . . . r . . k .
  7  p . . . . p p p
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . N . . . .
  3  . . . . . . . .
  2  . . . . . P P P
  1  . . B . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 3r2k1/p4ppp/8/8/3N4/8/5PPP/2B3K1 w - - 0 1
```

**Accepted answer:** {"outcome": "no"}

**Explanation shown:** The pawn move does nothing about the attack: it does not move, defend or shield the knight, and the rook simply takes it. A move far from both the attacked piece and the attacker is not an answer unless it makes a bigger threat.

Hints (in order):
1. Does h3 touch the knight, or the rook that attacks it?
2. A move helps only if it moves the attacked piece, defends it, captures or blocks the attacker, or makes a bigger threat.
3. h3 does none of these.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [loose_pieces] The knight on d4 is attacked and nothing defends it.
- [material_after_move] After h3 the engine line loses at least 3 for White.

### Step 9: item

**Task `IB3-312`** (predict_outcome, difficulty cue 2)

Black's rook attacks the white knight on d4, and nothing defends it. White plays h3 (a pawn move on the other side of the board). Does that keep White from losing material? Predict, then check.

```
  8  . . . r . . k .
  7  p . . . . p p p
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . N . . . .
  3  . . . . . . . .
  2  . . . . . P P P
  1  . . B . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 3r2k1/p4ppp/8/8/3N4/8/5PPP/2B3K1 w - - 0 1
```

**Accepted answer:** {"outcome": "no"}

**Explanation shown:** The pawn move does nothing about the attack: it does not move, defend or shield the knight, and the rook simply takes it. A move far from both the attacked piece and the attacker is not an answer unless it makes a bigger threat.

Hints (in order):
1. Does h3 touch the knight, or the rook that attacks it?
2. A move helps only if it moves the attacked piece, defends it, captures or blocks the attacker, or makes a bigger threat.
3. h3 does none of these.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [loose_pieces] The knight on d4 is attacked and nothing defends it.
- [material_after_move] After h3 the engine line loses at least 3 for White.

### Step 10: item

**Task `IB3-305`** (find_move, difficulty cue 2)

Black to move. Your rook on e7 is attacked by the white rook on e1, and nothing defends it. Find any move that saves it without losing anything else.

```
  8  . r . . . . k .
  7  . b . . r p p p
  6  p . p . . . . .
  5  . . n p . . . .
  4  . . . . . P B .
  3  . P . . . . N P
  2  P . P . . . P .
  1  . . . . R R K .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black.
FEN: 1r4k1/1b2rppp/p1p5/2np4/5PB1/1P4NP/P1P3P1/4RRK1 b - - 2 22
```

**Accepted answer(s):** Rbe8, Ne4, Ne6, Rc7, Ree8, Kf8

**Explanation shown:** Six moves work, in three different ways: Rbe8, Ne4, Ne6, Rc7, Ree8 and Kf8. Kf8 and Rbe8 defend the rook, Ree8 and Rc7 move it, and the knight moves block the e-file. Each leaves nothing else loose.

Hints (in order):
1. You have five kinds of answer: move it, defend it, capture the attacker, block the line, counterattack. Which are available here?
2. The attacker is a rook on the same file. Which of your pieces could step in between, or defend the rook on e7?
3. The knight on c5 can block the file in two ways.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [loose_pieces] The rook on e7 is attacked and nothing defends it; no other piece of that side is loose.
- [attackers] Exactly one enemy piece attacks e7.
- [material_after_move] After Rbe8 the engine line does not lose material.
- [loose_pieces] After Rbe8 none of the side's pieces is loose.
- [material_after_move] After Ne4 the engine line does not lose material.
- [loose_pieces] After Ne4 none of the side's pieces is loose.
- [material_after_move] After Ne6 the engine line does not lose material.
- [loose_pieces] After Ne6 none of the side's pieces is loose.
- [material_after_move] After Rc7 the engine line does not lose material.
- [loose_pieces] After Rc7 none of the side's pieces is loose.
- [material_after_move] After Ree8 the engine line does not lose material.
- [loose_pieces] After Ree8 none of the side's pieces is loose.
- [material_after_move] After Kf8 the engine line does not lose material.
- [loose_pieces] After Kf8 none of the side's pieces is loose.

### Step 11: item

**Task `IB3-306`** (find_move, difficulty cue 2)

Black to move. Your bishop on d5 is attacked by the white bishop on c4, and nothing defends it. Find any move that saves it without losing anything else.

```
  8  . . r . . r k .
  7  . . q . b p p p
  6  . . . . . . . .
  5  . . . b p . . .
  4  Q . B . . . . .
  3  . . . P . . . P
  2  . . . B . P P .
  1  R . . . . R K .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black.
FEN: 2r2rk1/2q1bppp/8/3bp3/Q1B5/3P3P/3B1PP1/R4RK1 b - - 1 23
```

**Accepted answer(s):** Qc6, Qd6, Qd8, Ba8, Bb7, Bxc4

Feedback shown for wrong moves:
- Qd7: Qd7 defends the bishop, but White's queen on a4 attacks d7 and nothing defends your queen.
- Qa5: Qa5 defends the bishop along the fifth rank, but the white queen on a4 attacks a5 and nothing defends your queen.

**Explanation shown:** Several ways work: Qc6, Qd6, Qd8, Ba8, Bb7 and Bxc4. Bxc4 captures the attacker, Ba8 and Bb7 move the bishop, and the queen moves give it a defender.

Hints (in order):
1. Name the ways: move it, defend it, capture the attacker, block the line, counterattack. Which can you use here?
2. The attacker is a bishop that is itself attacked by your bishop. What does that give you?
3. The queen on c7 can defend the bishop from three squares.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [loose_pieces] The bishop on d5 is attacked and nothing defends it; no other piece of that side is loose.
- [attackers] Exactly one enemy piece attacks d5.
- [material_after_move] After Qc6 the engine line does not lose material.
- [loose_pieces] After Qc6 none of the side's pieces is loose.
- [material_after_move] After Qd6 the engine line does not lose material.
- [loose_pieces] After Qd6 none of the side's pieces is loose.
- [material_after_move] After Qd8 the engine line does not lose material.
- [loose_pieces] After Qd8 none of the side's pieces is loose.
- [material_after_move] After Ba8 the engine line does not lose material.
- [loose_pieces] After Ba8 none of the side's pieces is loose.
- [material_after_move] After Bb7 the engine line does not lose material.
- [loose_pieces] After Bb7 none of the side's pieces is loose.
- [material_after_move] After Bxc4 the engine line does not lose material.
- [loose_pieces] After Bxc4 none of the side's pieces is loose.
- [loose_pieces] After Qd7 the queen on d7 is attacked and nothing defends it.
- [loose_pieces] After Qa5 the queen on a5 is attacked and nothing defends it.

### Step 12: item  (shown without telling the learner the topic: unlabeled test)

**Task `IB3-307`** (find_move, difficulty cue 3)

White to move. One of your pieces is attacked and nothing defends it. Find a move that saves it without losing anything else.

```
  8  . . r . . r k .
  7  p b . . . p p p
  6  . p . . p n . .
  5  . . . . N . . .
  4  . . . P . . . .
  3  . . . . . P . .
  2  P P B . . . P P
  1  R . . . . R K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 2r2rk1/pb3ppp/1p2pn2/4N3/3P4/5P2/PPB3PP/R4RK1 w - - 1 19
```

**Accepted answer(s):** Rac1, Bb1, Bb3, Bd3

**Explanation shown:** The rook on c8 attacks the bishop on c2. A rook has a higher counting value than a bishop, so a defender is enough (the bishop could not be taken without loss), and so is moving the bishop: Rac1, Bb1, Bb3 and Bd3.

Hints (in order):
1. Which of your pieces is attacked, and by what?
2. The attacker has a higher counting value than the attacked piece. What does that tell you about defending?
3. The bishop can step away along either diagonal, or a rook can defend it.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [loose_pieces] The bishop on c2 is attacked and nothing defends it; no other piece of that side is loose.
- [attackers] Exactly one enemy piece attacks c2.
- [material_after_move] After Rac1 the engine line does not lose material.
- [loose_pieces] After Rac1 none of the side's pieces is loose.
- [material_after_move] After Bb1 the engine line does not lose material.
- [loose_pieces] After Bb1 none of the side's pieces is loose.
- [material_after_move] After Bb3 the engine line does not lose material.
- [loose_pieces] After Bb3 none of the side's pieces is loose.
- [material_after_move] After Bd3 the engine line does not lose material.
- [loose_pieces] After Bd3 none of the side's pieces is loose.

### Step 13: item  (shown without telling the learner the topic: unlabeled test)

**Task `IB3-308`** (find_move, difficulty cue 3)

Black to move. One of your pieces is attacked and nothing defends it. Find a move that saves it without losing anything else.

```
  8  . . . . r . k .
  7  . p . . . p b p
  6  . . . . p . p .
  5  . B . p . . . .
  4  . R . P . . . .
  3  . . . . P . . P
  2  P . r . . P P .
  1  . . . . . R K .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black.
FEN: 4r1k1/1p3pbp/4p1p1/1B1p4/1R1P4/4P2P/P1r2PP1/5RK1 b - - 2 23
```

**Accepted answer(s):** Rb8, Rec8, Rd8, Re7, Rf8

**Explanation shown:** The bishop on b5 has a lower counting value than the rook on e8, so a defender would not stop Bxe8: the rook has to move, and Rb8, Rec8, Rd8, Re7 and Rf8 do that safely. Defending it fails here.

Hints (in order):
1. Which of your pieces is attacked, and by what? Compare their counting values.
2. Defending does not help when the attacker has a lower counting value than the piece it attacks.
3. The rook has to move; it can go along the back rank or the e-file.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [loose_pieces] The rook on e8 is attacked and nothing defends it; no other piece of that side is loose.
- [attackers] Exactly one enemy piece attacks e8.
- [material_after_move] After Rb8 the engine line does not lose material.
- [loose_pieces] After Rb8 none of the side's pieces is loose.
- [material_after_move] After Rec8 the engine line does not lose material.
- [loose_pieces] After Rec8 none of the side's pieces is loose.
- [material_after_move] After Rd8 the engine line does not lose material.
- [loose_pieces] After Rd8 none of the side's pieces is loose.
- [material_after_move] After Re7 the engine line does not lose material.
- [loose_pieces] After Re7 none of the side's pieces is loose.
- [material_after_move] After Rf8 the engine line does not lose material.
- [loose_pieces] After Rf8 none of the side's pieces is loose.

### Step 14: item  (shown without telling the learner the topic: unlabeled test)

**Task `IB3-313`** (predict_outcome, difficulty cue 3)

White to move. Black's queen on a4 attacks your rook on d1. Does White have to do something about the rook right now? Predict, then check.

```
  8  . . r . r b k .
  7  R . . . . p p .
  6  p . . p . n . p
  5  . . . P p . . .
  4  q . . . . . . .
  3  . . . . . N P P
  2  P . . Q P P B .
  1  . . . R . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 2r1rbk1/R4pp1/p2p1n1p/3Pp3/q7/5NPP/P2QPPB1/3R2K1 w - - 3 24
```

**Accepted answer:** {"outcome": "no"}

**Explanation shown:** The rook is attacked but defended, and the attacker is a queen (counting value 9) against a rook (5): after Qxd1 White would take the queen. The rook does not need saving right now; it only needs watching.

Hints (in order):
1. Is the rook attacked? Is it defended?
2. Compare the counting values of the attacker and the piece it attacks.
3. If the queen takes the rook, White takes the queen.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [loose_pieces] No white piece is loose.
- [attackers] One black piece, the queen, attacks the rook.
- [attackers] 1 white piece defends the rook.
- [material_after_move] If White passed and the queen took the rook, the engine line leaves Black at least 2 behind.
- [quiet_position] If White passed, Black could not win material.

### Step 15: item  (shown without telling the learner the topic: unlabeled test)

**Task `IB3-309`** (find_move, difficulty cue 3)

Black to move. One of your pieces is attacked and nothing defends it. Find a move that saves it without losing anything else.

```
  8  r . . . . r k .
  7  p p . . . p p p
  6  . . p . . n . .
  5  . . . . b b . .
  4  . . . . . . . .
  3  . . P . B N . P
  2  P P . . B P P .
  1  R . . . . R K .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black.
FEN: r4rk1/pp3ppp/2p2n2/4bb2/8/2P1BN1P/PP2BPP1/R4RK1 b - - 1 14
```

**Accepted answer(s):** Bc7, Bd6, Nd7, Rfe8

Feedback shown for wrong moves:
- Rae8: Rae8 does defend the bishop, but the rook was guarding the a7 pawn. Now the white bishop on e3 attacks a7 and nothing defends it.

**Explanation shown:** The knight on f3 attacks the bishop on e5. The bishop can step back or be given a defender: Bc7, Bd6, Nd7 and Rfe8.

Hints (in order):
1. Which of your pieces is attacked, and by what?
2. The attacker is a knight and the attacked piece is a bishop. Think about which ways of answering are available.
3. The bishop can retreat along the diagonal, or a piece can defend it.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [loose_pieces] The bishop on e5 is attacked and nothing defends it; no other piece of that side is loose.
- [attackers] Exactly one enemy piece attacks e5.
- [material_after_move] After Bc7 the engine line does not lose material.
- [loose_pieces] After Bc7 none of the side's pieces is loose.
- [material_after_move] After Bd6 the engine line does not lose material.
- [loose_pieces] After Bd6 none of the side's pieces is loose.
- [material_after_move] After Nd7 the engine line does not lose material.
- [loose_pieces] After Nd7 none of the side's pieces is loose.
- [material_after_move] After Rfe8 the engine line does not lose material.
- [loose_pieces] After Rfe8 none of the side's pieces is loose.
- [loose_pieces] After Rae8 the pawn on a7 is attacked by the bishop on e3 and nothing defends it.

### Step 16: reflect

Kind: unsure

Prompt: When your piece was attacked, which of the five ways did you check first, and which did you forget to check? Did any answer you liked turn out to leave something else loose?

---

## Reviewer scorecard

Fill in the file `content/review/L-SAF-DEFEND-OPTIONS-1.json` (a template is below). Scale 1 to 5 for each dimension: 1 = wrong or unusable, 3 = acceptable with edits, 5 = I would put my name to it as it stands.
Revision to review: `ee56774f`. If the lesson text changes after your review, your sign-off no longer applies and the lesson goes back to needs-human.

| Dimension | What to judge | Score |
|---|---|---|
| chess | every statement, line and explanation is correct; near-misses are really near-misses | |
| clarity | the explanation actually explains (mechanism, conditions), in plain words | |
| prerequisites | the lesson assumes only what the learner has met | |
| tasks | each task has one defensible answer and a fair explanation | |

```json
{
  "lesson": "L-SAF-DEFEND-OPTIONS-1",
  "revision": "ee56774f",
  "reviewer": "<your name>",
  "reviewer_role": "strong-player",
  "date": "YYYY-MM-DD",
  "scores": {"chess": 0, "clarity": 0, "prerequisites": 0, "tasks": 0},
  "comments": "<what to change, by step number>",
  "verdict": "approved"
}
```

`reviewer_role` is `strong-player` or `teacher`. `verdict` is `approved` or `changes-requested`. See docs/review-slice.md.
