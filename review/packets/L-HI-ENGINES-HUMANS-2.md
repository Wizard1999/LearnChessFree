# Review packet: L-HI-ENGINES-HUMANS-2

**Engines and humans 2: what engines see and what they miss**

- Skill: GAME.HISTORY (D1); stage: exemplar; stated length: 35 minutes
- Steps: 81 (18 are tasks); revision: `6418130a`
- Review status now: needs-human

## What the lesson says the learner will be able to do

- States which of win, draw or hard to hold a fortress position is, using the bishop's colour and the pawn's file, and checks it with a tablebase
- Explains why a shallow search can rate a drawn fortress above zero, and asks for a second depth before trusting a number
- Reads an engine score on a scale and says what it does and does not show about a pawn sacrifice
- Counts the only-moves a defender needs and says why an equal score can still be hard to hold
- Writes three questions to ask before believing an engine number

## Sources the author names (check that they are used fairly, in our own words)

- Syzygy tablebase results through the Lichess tablebase service, used by tools/validate.py (7 pieces or fewer) [V]
- Engine claims: Stockfish 19 lite single thread as in tools/engine.py, depth stated in each claim; depth-limited numbers are evidence under recorded settings, not proofs [V]
- Positions: fortress family from tools/endgames/gen_queen.py (PE-FORT-3, 6, 8, 9, 10, 11, 12, 14) and one-feature edits by python-chess (flip_horizontal, mirror); bishop and pawn positions built by hand and then tablebase-checked; opening lines replayed with python-chess [V]
- Wikipedia, 'Fortress (chess)' and 'Horizon effect': names and definitions only [S]
- Jeremy Silman: engine analysis shows what to play but not why (paraphrase), docs/citable-views.md 10.13 [S]
- Jacob Aagaard, Excelling at Chess Calculation: serious errors often come from overlooked candidate moves (paraphrase), docs/citable-views.md 10.7, via a reviewer's account [S]
- Opening names (Benko Gambit, Marshall Attack, Ruy Lopez) as in app/public/openings; the lines are replayed moves, facts only [V]
- Conjecture marked [H] or [I] in the text is ours; not tested [H]
- Not found: a position where Stockfish 19 stayed wrong at depth 16 or 20 in the fortress families tried. The shallow-depth gap is real, the depth-16 gap was not found [V]
- This revision: engine depths and tablebase results re-measured here with tools/engine.py and tools/validate.py (Stockfish 19 lite single thread; Lichess tablebase) [V]. Silman and Aagaard are cited from secondary summaries only, not read in full [S]. The win-probability formula is recalled, not re-checked [R].

## How to read this packet

Boards are drawn with capitals for White and lower case for Black, rank 8 at the top unless the board is shown from Black's side. Moves in a line are in standard notation. Statements marked [V] were machine-checked, [I] inference, [H] hypothesis, [S] secondary source, [R] recalled. Please judge the explanations, not only the moves: does each sentence tell the learner why?

---

### Step 1: board

Caption: Your hook position. White has a queen against a rook and a pawn: 9 against 6 by counting values. At depth 4 the engine says about +1.5. Win, draw or loss for White? Decide before reading on.

```
  8  . . k . . . . .
  7  r p . . . Q . .
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . K . . . . .
  2  . . . . . . . .
  1  . . . . . . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 2k5/rp3Q2/8/8/8/2K5/8/8 w - - 0 1
```

Drawn on the board: highlighted squares f7, a7, b7, c8.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [tablebase] Tablebase: draw.
- [eval_range] At depth 4 the engine shows about +1.5 for White.

### Step 2: reflect

Kind: expect

Prompt: Your verdict (win, draw or loss) and how sure you are, before any evidence.

- Field "My verdict and confidence:" (free text)

- Field "My reason in one sentence:" (free text)

### Step 3: card

**The question.** An engine's number feels like a fact. This lesson asks when it misleads a person: a *fortress* that a short search does not see, a *horizon* that hides the truth, a defence with many *only-moves*, and sacrifices whose worth no count shows. By the end you can say win, draw or hard to hold, and explain why the number alone could not tell you.

### Step 4: card

**An honest wrinkle [V].** The next board is a different case. There the engine does not show a big number, and its score rises with depth: +0.01, +0.15, +0.35 and +1.09 at depths 4, 8, 16 and 30, while the tablebase says draw. So a draw can hide behind a small or rising score as well as a big one.

### Step 5: board

Caption: A second discovery board. White has a bishop and a pawn more than Black: 3 + 1 = 4 ahead by counting values, and Black's king sits in the corner. Win, draw or loss for White? Decide before reading on.

```
  8  k . . . . . . .
  7  . . . . . . . .
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  P . . . . . . .
  1  K . B . . . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: k7/8/8/8/8/8/P7/K1B5 w - - 0 1
```

Drawn on the board: highlighted squares a1, c1, a2, a8.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [tablebase] Tablebase: draw.
- [eval_range] At depth 16 the engine shows about +0.35.
- [eval_range] At depth 4 the engine shows about 0.0.
- [eval_range] At depth 30 the engine shows about +1.1, higher than at depth 4.

### Step 6: board

Caption: This is the trap the defender hopes for, not a proof. With White's king already close, the check forces Black to choose between two squares; only one saves the game.

```
  8  k . . . . . . .
  7  . . . . . . . .
  6  . K . . . . . .
  5  . . . . . . . .
  4  P . . . . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  . . B . . . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: k7/8/1K6/8/P7/8/8/2B5 w - - 0 1
```

The line, with the sentence the learner sees at each move:
1. **1. a5**: White pushes the pawn: a rook pawn heads for the corner, with the king close behind.
2. **1... Kb8**: Black steps out of the corner but stays on the two squares it needs.
3. **2. Bf4+**: The bishop checks and takes b8 away. Black has two replies: Ka8 draws, Kc8 loses [V, tablebase].
4. **2... Ka8**: Black returns to the corner. No square the bishop uses includes a8, and from c8 the king would be cut off from it [I].
5. **3. a6**: White pushes again, but now Black has no legal move and is not in check.

```
  8  k . . . . . . .
  7  . . . . . . . .
  6  P K . . . . . .
  5  . . . . . . . .
  4  . . . . . B . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  . . . . . . . .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: k7/8/PK6/8/5B2/8/8/8 b - - 0 3
```

Drawn on the board: arrows a4-a5, c1-f4; highlighted squares a8, b8.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [tablebase] Tablebase: the position is a draw.
- [tablebase] Tablebase: after the pawn push the result is still a draw.
- [eval_range] At depth 16 the engine rates the position near +0.9, not as a win.

### Step 7: board

Caption: The position after the check. Black is in check and has two legal replies. One draws, one loses: the tablebase separates them.

```
  8  . k . . . . . .
  7  . . . . . . . .
  6  . K . . . . . .
  5  P . . . . . . .
  4  . . . . . B . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  . . . . . . . .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: 1k6/8/1K6/P7/5B2/8/8/8 b - - 0 1
```

Drawn on the board: highlighted squares b8, a8, c8, f4.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [tablebase] Tablebase: Ka8 draws.
- [tablebase] Tablebase: Kc8 loses.

### Step 8: board

Caption: The stalemate trap with the bishop at the far end of the diagonal: any bishop on this diagonal takes b8 away, and Black has no move.

```
  8  k . . . . . . .
  7  . . . . . . . .
  6  P K . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . . . . B
  1  . . . . . . . .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: k7/8/PK6/8/8/8/7B/8 b - - 0 3
```

Drawn on the board: highlighted squares a8, b6, h2, a6.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [game_state] Black to move: stalemate.

### Step 9: card

**Two words.** A *rook pawn* stands on the edge file (a or h). A *wrong-coloured bishop* travels on squares whose colour differs from the pawn's promotion corner. Here the corner a8 is light and this bishop is dark, so it can never cover the corner.

### Step 10: card

**The condition [S].** With a rook pawn and a wrong-coloured bishop, the defender draws if the king reaches the corner. Textbook geometry [S]. The same pieces with Black's king far away, on h8, are a tablebase win [V]. So the file of the pawn, the bishop's colour and where the defending king stands all matter.

### Step 11: board

Caption: Same material, one difference: Black's king stands on h8, too far to reach the a8 corner in time. Tablebase: White wins.

```
  8  . . . . . . . k
  7  . . . . . . . .
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  P . . . . . . .
  1  K . B . . . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 7k/8/8/8/8/8/P7/K1B5 w - - 0 1
```

Drawn on the board: highlighted squares h8, a8, a2, c1.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [tablebase] Tablebase: a win.
- [eval_range] At depth 16 the engine shows over +7.

### Step 12: board

Caption: One feature changed: the bishop now stands on a light square, the colour of the corner. Same pawn, same kings.

```
  8  k . . . . . . .
  7  . . . . . . . .
  6  . K . . . . . .
  5  . . . . . . . .
  4  P . . . . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  . . . . . B . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: k7/8/1K6/8/P7/8/8/5B2 w - - 0 1
```

The line, with the sentence the learner sees at each move:
1. **1. Bh3**: This bishop travels on light squares, the colour of the corner, so it can help cover it.
2. **1... Kb8**: Black steps along the back rank.
3. **2. a5**: The pawn advances while the bishop keeps c8 covered.
4. **2... Ka8**: Black goes back to the corner.
5. **3. a6**: The pawn comes closer; the king has fewer squares each time.
6. **3... Kb8**: Black has no other safe move.
7. **4. a7+**: The pawn checks the king and pushes it into the corner.
8. **4... Ka8**: Forced.
9. **5. Bg2#**: The bishop checks along the long diagonal; the king has no escape: mate.

```
  8  k . . . . . . .
  7  P . . . . . . .
  6  . K . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . . . B .
  1  . . . . . . . .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: k7/P7/1K6/8/8/8/6B1/8 b - - 2 5
```

Drawn on the board: arrows f1-h3; highlighted squares f1, a8.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [tablebase] Tablebase: the position is a win.
- [mate_in] Bh3 forces mate in five (engine, depth 16).
- [eval_range] At depth 16 the engine shows a forced mate (a score above +9).

### Step 13: board

Caption: Another one-feature change: the bishop is still on the wrong colour, but the pawn is on the b-file instead of the edge. The line shows how the win starts.

```
  8  k . . . . . . .
  7  . . . . . . . .
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . P . . . . . .
  1  K . B . . . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: k7/8/8/8/8/8/1P6/K1B5 w - - 0 1
```

The line, with the sentence the learner sees at each move:
1. **1. b4**: The pawn sets off up the b-file.
2. **1... Ka7**: The black king leaves the corner.
3. **2. Be3+**: The bishop checks along the diagonal and drives the king back.
4. **2... Ka6**: The king steps up next to the pawn's future squares.
5. **3. Ka2**: White's king walks up to help.
6. **3... Kb7**: Black keeps close.

```
  8  . . . . . . . .
  7  . k . . . . . .
  6  . . . . . . . .
  5  . . . . . . . .
  4  . P . . . . . .
  3  . . . . B . . .
  2  K . . . . . . .
  1  . . . . . . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 8/1k6/8/8/1P6/4B3/K7/8 w - - 5 4
```

Drawn on the board: highlighted squares b2, c1.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [tablebase] Tablebase: the position is a win.
- [eval_range] At depth 16 the engine rates it above +7.

### Step 14: card

**Why a b-pawn wins [I].** It promotes on b8, a dark square, and this bishop is dark-squared, so the bishop can guard the queening square while the king cannot hold the corner. The tablebase agrees [V]. A rook pawn has only one neighbouring file, which is what lets the defender hide.

### Step 15: contrast

Title: Which of these holds a draw?

Prompt: Predict each result first. Compare the bishop's colour, the corner, and the file of the pawn.

**The working board:**

**Task `IHI-LHIENGINESHUMANS2-1`** (predict_outcome, difficulty cue 2)

Black to move. With best play from both sides, is the result a win, a draw or a loss for Black?

```
  1  . . . . . . . K
  2  . . . . . . . .
  3  . . . . . . . .
  4  . . . . . . . .
  5  . . . . . . . .
  6  . . . . . . . .
  7  . . . . . . . p
  8  . . . . . b . k
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: k1b5/p7/8/8/8/8/8/K7 b - - 0 1
```

**Accepted answer:** {"outcome": "draw"}

**Explanation shown:** The tablebase result is a draw: the extra bishop and pawn cannot win here.

Hints (in order):
1. Count the pieces first, then ask which corner the pawn must reach.
2. Look at the colour of the corner square and the colour of the bishop's squares.
3. The bishop and the promotion corner are on different colours.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [tablebase] Tablebase: the result is a draw for the side to move.

**The failing board:**

**Task `IHI-LHIENGINESHUMANS2-2`** (predict_outcome, difficulty cue 2)

White to move. With best play from both sides, is the result a win, a draw or a loss for White?

```
  8  . . . . . . . k
  7  . . . . . . . .
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . . . . P
  1  . . B . . . . K
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 7k/8/8/8/8/8/7P/2B4K w - - 0 1
```

**Accepted answer:** {"outcome": "win"}

**Explanation shown:** The tablebase result is a win: with the bishop on the other colour the king in the corner can be driven out.

Hints (in order):
1. Same pawn file, same corner. What is different?
2. Compare the colour of the bishop's square with the colour of the corner where the pawn would promote.
3. This bishop can reach the corner square.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [tablebase] Tablebase: the result is a win for the side to move.

**The irrelevant board:**

**Task `IHI-LHIENGINESHUMANS2-3`** (predict_outcome, difficulty cue 2)

Black to move. With best play from both sides, is the result a win, a draw or a loss for Black?

```
  1  . . . . . . . K
  2  . . . . . . . .
  3  . . . . . . . .
  4  . . . . . . . .
  5  . . . . . . . .
  6  . . . . . . . .
  7  . . . . . . p .
  8  . . . . . b . k
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: k1b5/1p6/8/8/8/8/8/K7 b - - 0 1
```

**Accepted answer:** {"outcome": "win"}

**Explanation shown:** The tablebase result is a win: this pawn is not a rook pawn, so the corner is no shelter.

Hints (in order):
1. The bishop is still on the wrong colour for the corner. Is the corner the pawn's goal here?
2. Which file is the pawn on?
3. The pawn is not on the edge file.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [tablebase] Tablebase: the result is a win for the side to move.

### Step 16: card

**A testable checklist [I].** A *fortress* is a position the stronger side cannot break however long it tries. Ask three questions. (1) Can a check also attack a second piece? If so, no fortress (the queen boards with the king on f8 and on e8). (2) Is every defending unit guarded by another or out of reach? (3) Does the defender have a safe spare move, or can zugzwang bite (the two pawn boards later)?

### Step 17: board

Caption: A second fortress family: a queen against a rook and a pawn. By counting values the queen side is 3 ahead (9 against 6). The rook guards the pawn along the seventh rank and the king guards the pawn from c8.

```
  8  . . k . . . . .
  7  r p . . . Q . .
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . K . . . . .
  2  . . . . . . . .
  1  . . . . . . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 2k5/rp3Q2/8/8/8/2K5/8/8 w - - 0 1
```

The line, with the sentence the learner sees at each move:
1. **1. Qe8+**: The queen checks along the back rank.
2. **1... Kc7**: The king steps up beside its pawn and the rook.
3. **2. Qe5+**: A second check from the centre looks for a way in.
4. **2... Kc8**: Back where it started: the queen has made no progress.
5. **3. Qe8+**: The same check again: White repeats and Black repeats.

```
  8  . . k . Q . . .
  7  r p . . . . . .
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . K . . . . .
  2  . . . . . . . .
  1  . . . . . . . .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 2k1Q3/rp6/8/8/8/2K5/8/8 b - - 5 3
```

Drawn on the board: highlighted squares a7, b7, c8.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [tablebase] Tablebase: the position is a draw.
- [eval_range] At depth 20 the engine rates it level.

### Step 18: card

**The working test [I].** The queen can win only if a check also attacks an unguarded piece. Here the pawn shields the rook along the seventh rank and the king stays near, so every check is just a check. A defender holds when no queen check forks king and rook.

### Step 19: board

Caption: Another queen against rook-and-pawn fortress. Black's king guards the rook; the pawn on f7 stays behind it. Watch White's checks run out of ideas.

```
  8  . . . . . k . r
  7  . . . . . p . .
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . Q . .
  2  K . . . . . . .
  1  . . . . . . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 5k1r/5p2/8/8/8/5Q2/K7/8 w - - 0 1
```

The line, with the sentence the learner sees at each move:
1. **1. Qa8+**: White checks. The rook on h8 is attacked too, but the king can defend it.
2. **1... Kg7**: The king steps next to the rook, so Qxh8 would lose the queen.
3. **2. Qg2+**: A check along the g-file, hoping to force the king away.
4. **2... Kf8**: Back again: the king returns and the rook is guarded once more.

```
  8  . . . . . k . r
  7  . . . . . p . .
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  K . . . . . Q .
  1  . . . . . . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 5k1r/5p2/8/8/8/8/K5Q1/8 w - - 4 3
```

Drawn on the board: highlighted squares f8, h8, f7.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [tablebase] Tablebase: the position is a draw.
- [eval_range] At depth 4 the engine shows about +1 for White.
- [eval_range] At depth 16 it shows 0.00.

### Step 20: board

Caption: One detail moved: Black's king stands on e8, not f8. Now the check on a8 also hits the rook, and the king cannot guard it.

```
  8  . . . . k . . r
  7  . . . . . p . .
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . Q . .
  2  K . . . . . . .
  1  . . . . . . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 4k2r/5p2/8/8/8/5Q2/K7/8 w - - 0 1
```

The line, with the sentence the learner sees at each move:
1. **1. Qa8+**: White checks the king and attacks the rook along the same rank.
2. **1... Ke7**: The king steps off the rank and cannot cover h8 from there.
3. **2. Qxh8**: The queen takes the rook; Black has no compensation.

```
  8  . . . . . . . Q
  7  . . . . k p . .
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  K . . . . . . .
  1  . . . . . . . .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 7Q/4kp2/8/8/8/8/K7/8 b - - 0 2
```

Drawn on the board: highlighted squares e8, h8, a8.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [tablebase] Tablebase: the position is a win for White.
- [eval_range] At depth 16 the engine shows over +3.

### Step 21: card

**Other families [H].** Locked pawn chains can also form fortresses. This course has no tablebase-checked board for them yet, so treat that as an idea to test, not a result.

### Step 22: card

**What 'depth' counts [R].** In engine settings, depth N means the search looks N half-moves (plies) ahead along its main lines, and good engines look further on promising lines. From here on, 'depth N' always means that setting.

### Step 23: board

Caption: Same position, three searches. Depth 4 shows about +1.5, depth 8 about +1.3, depth 20 and depth 30 both about 0.0. All four numbers are real output from the same engine [V].

```
  8  . . k . . . . .
  7  r p . . . Q . .
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . K . . . . .
  2  . . . . . . . .
  1  . . . . . . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 2k5/rp3Q2/8/8/8/2K5/8/8 w - - 0 1
```

Drawn on the board: highlighted squares f7.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [eval_range] At depth 4 the engine shows about +1.5 for White.
- [eval_range] At depth 8 about +1.3.
- [eval_range] At depth 20 about 0.0.
- [tablebase] Tablebase: draw.
- [eval_range] At depth 30 about 0.0.

### Step 24: board

Caption: Black to move, a queen against a rook and one pawn. The numbers at depth 4 and depth 16 differ a lot. The tablebase decides. [I] The king and rook guard each other, so no check wins the rook.

```
  8  . . . . . . . r
  7  . . . . K . k .
  6  . . . . Q . p .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  . . . . . . . .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: 7r/4K1k1/4Q1p1/8/8/8/8/8 b - - 0 1
```

The line, with the sentence the learner sees at each move:
1. **1... Rf8**: The rook offers itself: the queen cannot take it because the king guards it.
2. **2. Qe5+**: White checks, searching for a way in.
3. **2... Kg8**: Black steps to the back rank, where the rook and king protect each other.
4. **3. Qd5+**: Another check; the fortress keeps absorbing them.

```
  8  . . . . . r k .
  7  . . . . K . . .
  6  . . . . . . p .
  5  . . . Q . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  . . . . . . . .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 5rk1/4K3/6p1/3Q4/8/8/8/8 b - - 4 3
```

Drawn on the board: highlighted squares g7, f8, e7.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [tablebase] Tablebase: the position is a draw for Black.
- [eval_range] At depth 4 White seems about +1.4 ahead.
- [eval_range] At depth 16 the engine shows 0.00.

### Step 25: board

Caption: Not every fortress fools the engine. Here even a very shallow search stays under half a pawn, and the tablebase agrees. [I] The king and two pawns form a shelter, and the rook leaves it only while the king guards the pawn on g7. A big number is a warning sign, not the only sign.

```
  8  . . . . . r . .
  7  Q . . . . . p k
  6  . . K . . . p .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  . . . . . . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 5r2/Q5pk/2K3p1/8/8/8/8/8 w - - 0 1
```

The line, with the sentence the learner sees at each move:
1. **1. Qe7**: The queen attacks the g7 pawn, which the king guards.
2. **1... Rf5**: The rook steps out to f5: the engine's choice at depth 16 [V].

```
  8  . . . . . . . .
  7  . . . . Q . p k
  6  . . K . . . p .
  5  . . . . . r . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  . . . . . . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 8/4Q1pk/2K3p1/5r2/8/8/8/8 w - - 2 2
```

Drawn on the board: highlighted squares f8, g7, g6.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [tablebase] Tablebase: the position is a draw.
- [eval_range] Even at depth 4 the engine shows under half a pawn.
- [eval_range] At depth 16 the same.

### Step 26: reflect

Kind: unsure

Prompt: Why might a shallow search rate this position above zero, while the tablebase says draw?

- Field "My explanation:" (free text)

### Step 27: card

**What the engine does [I].** An engine adds up material and piece activity at the end of its search. To see a draw it must see that every winning try fails, which can take many moves. A tablebase simply stores the answer for positions with few pieces.

### Step 28: card

**What we found [V].** In the queen-versus-rook fortresses, depth 4 to 8 gave +1 to +1.5 and depth 16 to 20 gave 0.00. In the bishop and rook-pawn position the score rose with depth, from +0.01 at depth 4 to +1.09 at depth 30, while the tablebase says draw. [I] A second depth helps in some families, not all; the tablebase is the check when it applies.

### Step 29: item

**Task `IHI-LHIENGINESHUMANS2-7`** (predict_outcome, difficulty cue 2)

Black to move. A depth-6 search rates this clearly in White's favour; a depth-20 search rates it about equal. Draw or win for White? Say which depth you would believe and why.

```
  1  . . . . . . . .
  2  . . . . . . . .
  3  . . . . . . . .
  4  . . . . . . . .
  5  . . . . . . . .
  6  . . . . Q . p .
  7  . . . . K . k .
  8  . . . . . . . r
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: r7/1k1K4/1p1Q4/8/8/8/8/8 b - - 0 1
```

**Accepted answer:** {"outcome": "the depth-20 reading"}

**Explanation shown:** The tablebase says draw. Here the deeper search agrees; the shallow one did not yet see that every winning try fails. In other families (the bishop and rook-pawn board) the score rises with depth, so the tablebase is the check.

Hints (in order):
1. Which reading agrees with exact knowledge of the position?
2. A tablebase is exact for positions with few pieces.
3. Check the tablebase before trusting either depth.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [eval_range] At depth 6 the engine rates the position clearly in White's favour.
- [eval_range] At depth 20 the engine rates it about equal.
- [tablebase] Tablebase: the result is a draw for the side to move.

### Step 30: card

**Horizon effect.** The name comes from computer chess: a search that stops at a fixed depth cannot see what lies beyond it [R]. [I] Our fortress numbers are a related problem, the search stopping before the draw is visible, not the classic horizon effect, which is about delaying an unavoidable loss. Treat every number as 'this engine, this depth'.

### Step 31: board

Caption: The numbers wobble even in ordinary play. This position arises after Black takes a pawn in a famous Sicilian line. Searched at depth 2, 6, 10 and 16 the score changes by a few tenths each time, in no steady direction.

```
  8  r n b . k b . r
  7  . p . . . p p p
  6  p . . p p n . .
  5  . . . . . . B .
  4  . . . N P P . .
  3  . . N . . . . .
  2  P q P Q . . P P
  1  R . . . K B . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: rnb1kb1r/1p3ppp/p2ppn2/6B1/3NPP2/2N5/PqPQ2PP/R3KB1R w KQkq - 0 9
```

Drawn on the board: highlighted squares b2.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [eval_range] Depth 2.
- [eval_range] Depth 6.
- [eval_range] Depth 10.
- [eval_range] Depth 16.

### Step 32: reflect

Kind: unsure

Prompt: A friend says 'the engine says +0.5, so I am better'. Which two things would you ask before agreeing?

- Field "Question 1:" (free text)

- Field "Question 2:" (free text)

### Step 33: card

**Reading a score honestly [H].** A rough guide many players use, not tested here: 0.0 to +0.5 level, about +1 a small edge, +3 and above often winning. Whether +3 wins depends on the position type: fortress positions can read +3 at shallow depth and be drawn. Always note the engine and the depth.

### Step 34: card

**From score to chance [I].** 'Win probability' curves turn a score into a chance. One public formula, recalled and not re-checked [R], gives 50 + 50 x (2 / (1 + e^(-0.00368 x score in hundredths)) - 1) per cent. Worked here: +1.00 gives about 59%, +3.00 about 75%. The curve is a model fitted to games, not a fact about your position.

### Step 35: item

**Task `IHI-LHIENGINESHUMANS2-8`** (predict_outcome, difficulty cue 3)

White to move. Is the engine's depth-16 score (White's point of view) under +1, between +1 and +3, or over +3?

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

**Accepted answer:** {"outcome": "under +1"}

**Explanation shown:** A quiet opening position: the depth-16 score is small.

Hints (in order):
1. Think of the scale on the card.
2. Under +1 is the quietest band.
3. Under +1.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [eval_range] At depth 16 the engine score is under +1 (White's point of view).

### Step 36: item

**Task `IHI-LHIENGINESHUMANS2-9`** (predict_outcome, difficulty cue 3)

White to move. Is the engine's depth-16 score (White's point of view) under +1, between +1 and +3, or over +3?

```
  8  . . . . . . . r
  7  . . . . K . k .
  6  . . . . Q . . .
  5  . . . . . p . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  . . . . . . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 7r/4K1k1/4Q3/5p2/8/8/8/8 w - - 0 1
```

**Accepted answer:** {"outcome": "over +3"}

**Explanation shown:** The engine score is far above +3, and here the tablebase agrees: a win.

Hints (in order):
1. Count the pieces on each side.
2. A queen against a rook and a pawn, with the queen side to move.
3. Think about the top band.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [eval_range] At depth 16 the engine score is over +3 (White's point of view).
- [tablebase] Tablebase: the result is a win for the side to move.

### Step 37: board

Caption: Ruy Lopez, Black to move. Four replies lie within about 0.21 of a pawn of each other at depth 16 [V]. Which one does the engine name?

```
  8  r . b q k b n r
  7  p p p p . p p p
  6  . . n . . . . .
  5  . B . . p . . .
  4  . . . . P . . .
  3  . . . . . N . .
  2  P P P P . P P P
  1  R N B Q K . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3
```

Drawn on the board: highlighted squares g8, a7, c6.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] At depth 16 the engine's best move is one of these four, and all four are within 40 hundredths of a pawn of it.

### Step 38: card

**Close numbers [I].** Four replies lie within 0.21 of a pawn of each other at depth 16 [V]. When several moves are this close, the number cannot choose between them; your plans and your understanding must.

### Step 39: reflect

Kind: unsure

Prompt: Four moves are within a fifth of a pawn. Which would you play, and what plan decides it for you?

- Field "My move and plan:" (free text)

### Step 40: card

**Long-term compensation.** A sacrifice may or may not leave the engine near zero. The next boards test three cases at depth 16 and depth 24: a pawn sacrifice where the engine still shows nearly the full pawn, a second whose number shrinks with depth, and an exchange sacrifice that reads level. The numbers, not our expectations, decide what we say.

### Step 41: board

Caption: The Benko Gambit. Step through the first moves: Black gives a pawn for lasting pressure.

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
1. **1. d4**: White claims the centre.
2. **1... Nf6**: Black develops and looks at e4.
3. **2. c4**: A second central pawn.
4. **2... c5**: Black attacks the d4 pawn.
5. **3. d5**: White gains space and cramps the black pawns.
6. **3... b5**: The gambit: Black offers a pawn to open the queenside files.
7. **4. cxb5**: White accepts.
8. **4... a6**: Black attacks b5 and offers a second pawn.
9. **5. bxa6**: White takes again.
10. **5... Bxa6**: Black takes back with a developed bishop.
11. **6. Nc3**: White develops.
12. **6... d6**: Black solidifies and keeps the open files.

```
  8  r n . q k b . r
  7  . . . . p p p p
  6  b . . p . n . .
  5  . . p P . . . .
  4  . . . . . . . .
  3  . . N . . . . .
  2  P P . . P P P P
  1  R . B Q K B N R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: rn1qkb1r/4pppp/b2p1n2/2pP4/8/2N5/PP2PPPP/R1BQKBNR w KQkq - 0 7
```

### Step 42: board

Caption: The engine puts White about +0.9 ahead at depth 16 and again at depth 24, nearly the full pawn. It sees little compensation here [V]. Humans often claim more [H]. Black's half-open a- and b-files are what the sacrifice aims at.

```
  8  r n . q k b . r
  7  . . . . p p p p
  6  b . . p . n . .
  5  . . p P . . . .
  4  . . . . . . . .
  3  . . N . . . . .
  2  P P . . P P P P
  1  R . B Q K B N R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: rn1qkb1r/4pppp/b2p1n2/2pP4/8/2N5/PP2PPPP/R1BQKBNR w KQkq - 0 7
```

The line, with the sentence the learner sees at each move:
1. **7. e4**: White takes more of the centre.
2. **7... Bxf1**: Black trades off White's good bishop.
3. **8. Kxf1**: White recaptures; now castling is gone for good.
4. **8... g6**: Black prepares a bishop on the long diagonal.
5. **9. g3**: White secures the kingside and prepares to tuck the king away.
6. **9... Bg7**: The bishop looks down the long diagonal at the queenside.
7. **10. Kg2**: White's king finds a safe home by hand.
8. **10... O-O**: Black castles; the rooks will aim at the open a- and b-files.

```
  8  r n . q . r k .
  7  . . . . p p b p
  6  . . . p . n p .
  5  . . p P . . . .
  4  . . . . P . . .
  3  . . N . . . P .
  2  P P . . . P K P
  1  R . B Q . . N R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: rn1q1rk1/4ppbp/3p1np1/2pP4/4P3/2N3P1/PP3PKP/R1BQ2NR w - - 3 11
```

Drawn on the board: arrows a8-a2, b8-b2; highlighted squares a2, b2, a8, b8.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [eval_range] At depth 16 White is ahead by nearly a pawn.
- [eval_range] At depth 24 the same.
- [wing_pawns] White has three queenside pawns.
- [wing_pawns] Black has two.
- [open_files] The a- and b-files are half-open for Black.

### Step 43: reflect

Kind: expect

Prompt: [H] Imagine playing this as Black against a friend of equal rating. Is the compensation easier to use or to meet? Write your guess before reading the next card.

- Field "My guess and reason:" (free text)

### Step 44: board

Caption: The Marshall Attack in the Ruy Lopez: a second pawn sacrifice, this time for an attack on the king.

```
  8  r . b q . r k .
  7  . . p p b p p p
  6  p . n . . n . .
  5  . p . . p . . .
  4  . . . . P . . .
  3  . B P . . N . .
  2  P P . P . P P P
  1  R N B Q R . K .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: r1bq1rk1/2ppbppp/p1n2n2/1p2p3/4P3/1BP2N2/PP1P1PPP/RNBQR1K1 b - - 0 8
```

The line, with the sentence the learner sees at each move:
1. **8... d5**: Black strikes at the centre at once, at the price of a pawn.
2. **9. exd5**: White takes.
3. **9... Nxd5**: Black recaptures and keeps the pieces active.
4. **10. Nxe5**: White takes the e5 pawn: White is a pawn up.
5. **10... Nxe5**: Black trades.
6. **11. Rxe5**: The rook recaptures.
7. **11... c6**: The pawn protects the knight on d5, which White's bishop was attacking.

```
  8  r . b q . r k .
  7  . . . . b p p p
  6  p . p . . . . .
  5  . p . n R . . .
  4  . . . . . . . .
  3  . B P . . . . .
  2  P P . P . P P P
  1  R N B Q . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r1bq1rk1/4bppp/p1p5/1p1nR3/8/1BP5/PP1P1PPP/RNBQ2K1 w - - 0 12
```

### Step 45: board

Caption: White is a pawn up. Depth 16 shows +0.57 and depth 24 shows +0.24 [V], so the number shrinks as the search deepens. [H] Black's compensation is future play: the bishop to d6 and the queen to h4 against the king, not something already on the board.

```
  8  r . b q . r k .
  7  . . . . b p p p
  6  p . p . . . . .
  5  . p . n R . . .
  4  . . . . . . . .
  3  . B P . . . . .
  2  P P . P . P P P
  1  R N B Q . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: r1bq1rk1/4bppp/p1p5/1p1nR3/8/1BP5/PP1P1PPP/RNBQ2K1 w - - 0 12
```

Drawn on the board: highlighted squares g1, d5, e7.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [eval_range] At depth 16 White is ahead by about half a pawn.
- [eval_range] At depth 24 about a quarter of a pawn.
- [wing_pawns] White has four queenside pawns.
- [wing_pawns] Black has three.

### Step 46: board

Caption: An exchange sacrifice in the Dragon: Black has given a rook for a knight, yet the engine scores it level at depth 16 and depth 24 [V]. [I] The compensation is a pawn structure around White's king that has been broken, and a strong knight on e5.

```
  8  . . . q . r k .
  7  p p . b p p b p
  6  . . . p . n p .
  5  . . . . n . . .
  4  . . . N P . . .
  3  . B P . B P . .
  2  P . P Q . . P P
  1  . K . R . . . R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: 3q1rk1/pp1bppbp/3p1np1/4n3/3NP3/1BP1BP2/P1PQ2PP/1K1R3R b - - 0 13
```

Drawn on the board: highlighted squares e5, c3, b1.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [eval_range] At depth 16 about level.
- [eval_range] At depth 24 about level.

### Step 47: card

**Disagreeing with the engine [H].** Where compensation comes from pressure and activity, a human's feel may beat a short search or fall short of a deep one. We do not know how often. Hypothesis: write your own view down before looking, because the disagreement is the lesson. Candidates first, engine second.

### Step 48: card

**Two outside views, rephrased.** Silman is summarised as saying engine analysis shows what to play but not why [S, secondary summary]. Aagaard is reported to say serious errors often begin when a key candidate move is overlooked [S, a reviewer's account]. Neither source was read in full here.

### Step 49: reflect

Kind: unsure

Prompt: Choose a position from your own games where you disagreed with an engine. Write your view first, then the engine's, then one reason you now believe for the gap.

- Field "My view:" (free text)

- Field "The engine's view and depth:" (free text)

- Field "A reason for the gap:" (free text)

### Step 50: card

**The reverse case.** The engine says 0.00, yet the position is hard for a person. A defender may hold only if they find the single saving move several times in a row. The evaluation, 0.00, hides how narrow the path is. We now count those moves.

### Step 51: board

Caption: Black to move in a drawn position (engine: level). White keeps checking. Step through and notice how often Black has exactly one safe move.

```
  8  . . . . . . k .
  7  . . . K . p . .
  6  . . . . . . . r
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . Q . . . . .
  1  . . . . . . . .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: 6k1/3K1p2/7r/8/8/8/2Q5/8 b - - 0 1
```

The line, with the sentence the learner sees at each move:
1. **1... Rb6**: Black has five safe moves here. This rook move keeps the rook out of the queen's reach.
2. **2. Qc8+**: White starts a series of checks.
3. **2... Kg7**: The only move that keeps the draw (see the next items).
4. **3. Qc3+**: Another check, from a different square.
5. **3... Kg8**: Again the only move.
6. **4. Qg3+**: A third check.
7. **4... Rg6**: Again the only saving move: the rook returns to shield the king.
8. **5. Qb8+**: The queen changes diagonal.
9. **5... Kg7**: Black steps aside once more.
10. **6. Ke7**: White brings its king to attack the f7 pawn.
11. **6... Re6+**: The only move out of sixteen: the rook offers itself.
12. **7. Kd7**: White goes back; the fortress holds.

```
  8  . Q . . . . . .
  7  . . . K . p k .
  6  . . . . r . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  . . . . . . . .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 1Q6/3K1pk1/4r3/8/8/8/8/8 b - - 12 7
```

Drawn on the board: highlighted squares g8, h6, c2.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [tablebase] Tablebase: the position is a draw for Black.
- [eval_range] At depth 16 the engine shows about 0.00.

### Step 52: item

**Task `IHI-LHIENGINESHUMANS2-10`** (find_move, difficulty cue 2)

Black to move; the position is a theoretical draw but White keeps checking. Find the only move that keeps the draw (2 legal moves).

```
  1  . . . . . . . .
  2  . . . . . . . .
  3  . . . . . . . .
  4  . . . . . . . .
  5  . . . . . . . .
  6  . . . . . . r .
  7  . . p . K . . .
  8  . k . . . Q . .
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: 2Q3k1/3K1p2/1r6/8/8/8/8/8 b - - 2 2
```

**Accepted answer(s):** Kg7

**Explanation shown:** Only Kg7 holds the draw; each of the other 1 legal move(s) loses (tablebase).

Hints (in order):
1. Which squares can the checked piece reach safely?
2. Only one of the legal moves keeps the draw; the rest lose to the tablebase.
3. The move is Kg7.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [tablebase] Tablebase: after Kg7 the result is a draw for the mover.
- [tablebase] Tablebase: after Kh7 the result is a loss for the mover.

### Step 53: item

**Task `IHI-LHIENGINESHUMANS2-11`** (find_move, difficulty cue 2)

Black to move; the position is a theoretical draw but White keeps checking. Find the only move that keeps the draw (7 legal moves).

```
  1  . . . . . . . .
  2  . . . . . . . .
  3  . . . . . Q . .
  4  . . . . . . . .
  5  . . . . . . . .
  6  . . . . . . r .
  7  . k p . K . . .
  8  . . . . . . . .
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: 8/3K1pk1/1r6/8/8/2Q5/8/8 b - - 4 3
```

**Accepted answer(s):** Kg8

**Explanation shown:** Only Kg8 holds the draw; each of the other 6 legal move(s) loses (tablebase).

Hints (in order):
1. Which squares can the checked piece reach safely?
2. Only one of the legal moves keeps the draw; the rest lose to the tablebase.
3. The move is Kg8.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [tablebase] Tablebase: after Rf6 the result is a loss for the mover.
- [tablebase] Tablebase: after f6 the result is a loss for the mover.
- [tablebase] Tablebase: after Kf8 the result is a loss for the mover.
- [tablebase] Tablebase: after Kg6 the result is a loss for the mover.
- [tablebase] Tablebase: after Kg8 the result is a draw for the mover.
- [tablebase] Tablebase: after Kh6 the result is a loss for the mover.
- [tablebase] Tablebase: after Kh7 the result is a loss for the mover.

### Step 54: reflect

Kind: expect

Prompt: [H] Guess: out of ten club players with this position and a clock, how many find every one of these moves? Write a number and a reason.

- Field "My number and reason:" (free text)

### Step 55: item

**Task `IHI-LHIENGINESHUMANS2-12`** (find_move, difficulty cue 2)

Black to move; the position is a theoretical draw but White keeps checking. Find the only move that keeps the draw (4 legal moves).

```
  1  . . . . . . . .
  2  . . . . . . . .
  3  . Q . . . . . .
  4  . . . . . . . .
  5  . . . . . . . .
  6  . . . . . . r .
  7  . . p . K . . .
  8  . k . . . . . .
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: 6k1/3K1p2/1r6/8/8/6Q1/8/8 b - - 6 4
```

**Accepted answer(s):** Rg6

**Explanation shown:** Only Rg6 holds the draw; each of the other 3 legal move(s) loses (tablebase).

Hints (in order):
1. Which squares can the checked piece reach safely?
2. Only one of the legal moves keeps the draw; the rest lose to the tablebase.
3. The move is Rg6.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [tablebase] Tablebase: after Rg6 the result is a draw for the mover.
- [tablebase] Tablebase: after Kf8 the result is a loss for the mover.
- [tablebase] Tablebase: after Kh7 the result is a loss for the mover.
- [tablebase] Tablebase: after Kh8 the result is a loss for the mover.

### Step 56: item

**Task `IHI-LHIENGINESHUMANS2-13`** (find_move, difficulty cue 2)

Black to move; the position is a theoretical draw. White's king has come up to attack the pawn. Find the only move that keeps the draw (16 legal moves).

```
  1  . . . . . . . .
  2  . . . . . . . .
  3  . . . . . . . .
  4  . . . . . . . .
  5  . . . . . . . .
  6  . r . . . . . .
  7  . k p K . . . .
  8  . . . . . . Q .
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: 1Q6/4Kpk1/6r1/8/8/8/8/8 b - - 10 6
```

**Accepted answer(s):** Re6+

**Explanation shown:** Only Re6+ holds the draw; each of the other 15 legal move(s) loses (tablebase).

Hints (in order):
1. Which move keeps the rook safe from the king and the pawn?
2. Only one of the legal moves keeps the draw; the rest lose to the tablebase.
3. The move is Re6+.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [tablebase] Tablebase: after f5 the result is a loss for the mover.
- [tablebase] Tablebase: after f6 the result is a loss for the mover.
- [tablebase] Tablebase: after Ra6 the result is a loss for the mover.
- [tablebase] Tablebase: after Rb6 the result is a loss for the mover.
- [tablebase] Tablebase: after Rc6 the result is a loss for the mover.
- [tablebase] Tablebase: after Rd6 the result is a loss for the mover.
- [tablebase] Tablebase: after Re6+ the result is a draw for the mover.
- [tablebase] Tablebase: after Rf6 the result is a loss for the mover.
- [tablebase] Tablebase: after Rg1 the result is a loss for the mover.
- [tablebase] Tablebase: after Rg2 the result is a loss for the mover.
- [tablebase] Tablebase: after Rg3 the result is a loss for the mover.
- [tablebase] Tablebase: after Rg4 the result is a loss for the mover.
- [tablebase] Tablebase: after Rg5 the result is a loss for the mover.
- [tablebase] Tablebase: after Rh6 the result is a loss for the mover.
- [tablebase] Tablebase: after Kh6 the result is a loss for the mover.
- [tablebase] Tablebase: after Kh7 the result is a loss for the mover.

### Step 57: card

**What this suggests [H].** In practice, a position with many only-moves is more likely to be lost at club level than its 0.00 suggests, while a position that is theoretically lost but needs the opponent to find many only-moves may score better than the engine's number. We have no data of our own to test this; treat it as a hypothesis to check with your own games.

### Step 58: item

**Task `IHI-LHIENGINESHUMANS2-14`** (find_move, difficulty cue 2)

Black to move. Down on counting values but with a drawn position. Find a move that keeps the draw (several do; most legal moves lose).

```
  1  . . . . . . . .
  2  . . Q . . . . .
  3  . . . . . . . .
  4  . . . . . . . .
  5  . . . . . . . .
  6  . . . . . . . r
  7  . . . K . p . .
  8  . . . . . . k .
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: 1k6/2p1K3/r7/8/8/8/5Q2/8 b - - 0 1
```

**Accepted answer(s):** Rb6, Rd6, Rg6, Kb7, Kc8

Feedback shown for wrong moves:
- Ra1: The tablebase says this move loses: after it, White has a forced win.
- Ra2: The tablebase says this move loses: after it, White has a forced win.
- Ra3: The tablebase says this move loses: after it, White has a forced win.
- Ra4: The tablebase says this move loses: after it, White has a forced win.
- Ra5: The tablebase says this move loses: after it, White has a forced win.
- Ra7: The tablebase says this move loses: after it, White has a forced win.
- Ra8: The tablebase says this move loses: after it, White has a forced win.
- Rc6: The tablebase says this move loses: after it, White has a forced win.
- Re6+: The tablebase says this move loses: after it, White has a forced win.
- Rf6: The tablebase says this move loses: after it, White has a forced win.
- Rh6: The tablebase says this move loses: after it, White has a forced win.
- Ka8: The tablebase says this move loses: after it, White has a forced win.
- c5: The tablebase says this move loses: after it, White has a forced win.
- c6: The tablebase says this move loses: after it, White has a forced win.

**Explanation shown:** 5 of 19 legal moves keep the draw; the other 14 lose (tablebase).

Hints (in order):
1. Count how many of the legal moves are safe: fewer than a third.
2. Try each legal move and ask what the queen can do next.
3. Not every rook move on the sixth rank holds; check what the queen can fork.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [tablebase] Tablebase: after Ra1 the result is a loss for the mover.
- [tablebase] Tablebase: after Ra2 the result is a loss for the mover.
- [tablebase] Tablebase: after Ra3 the result is a loss for the mover.
- [tablebase] Tablebase: after Ra4 the result is a loss for the mover.
- [tablebase] Tablebase: after Ra5 the result is a loss for the mover.
- [tablebase] Tablebase: after Ra7 the result is a loss for the mover.
- [tablebase] Tablebase: after Ra8 the result is a loss for the mover.
- [tablebase] Tablebase: after Rb6 the result is a draw for the mover.
- [tablebase] Tablebase: after Rc6 the result is a loss for the mover.
- [tablebase] Tablebase: after Rd6 the result is a draw for the mover.
- [tablebase] Tablebase: after Re6+ the result is a loss for the mover.
- [tablebase] Tablebase: after Rf6 the result is a loss for the mover.
- [tablebase] Tablebase: after Rg6 the result is a draw for the mover.
- [tablebase] Tablebase: after Rh6 the result is a loss for the mover.
- [tablebase] Tablebase: after Ka8 the result is a loss for the mover.
- [tablebase] Tablebase: after Kb7 the result is a draw for the mover.
- [tablebase] Tablebase: after Kc8 the result is a draw for the mover.
- [tablebase] Tablebase: after c5 the result is a loss for the mover.
- [tablebase] Tablebase: after c6 the result is a loss for the mover.

### Step 59: item

**Task `IHI-LHIENGINESHUMANS2-15`** (predict_outcome, difficulty cue 3)

Same position. How many of Black's 19 legal moves keep the draw?

```
  1  . . . . . . . .
  2  . . Q . . . . .
  3  . . . . . . . .
  4  . . . . . . . .
  5  . . . . . . . .
  6  . . . . . . . r
  7  . . . K . p . .
  8  . . . . . . k .
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: 1k6/2p1K3/r7/8/8/8/5Q2/8 b - - 0 1
```

**Accepted answer:** {"outcome": "5"}

**Explanation shown:** Tablebase: 5 of 19 legal moves hold the draw.

Hints (in order):
1. Guess a fraction before you look.
2. It is more than one and fewer than half.
3. 5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [tablebase] Tablebase: after Ra1 the result is a loss for the mover.
- [tablebase] Tablebase: after Ra2 the result is a loss for the mover.
- [tablebase] Tablebase: after Ra3 the result is a loss for the mover.
- [tablebase] Tablebase: after Ra4 the result is a loss for the mover.
- [tablebase] Tablebase: after Ra5 the result is a loss for the mover.
- [tablebase] Tablebase: after Ra7 the result is a loss for the mover.
- [tablebase] Tablebase: after Ra8 the result is a loss for the mover.
- [tablebase] Tablebase: after Rb6 the result is a draw for the mover.
- [tablebase] Tablebase: after Rc6 the result is a loss for the mover.
- [tablebase] Tablebase: after Rd6 the result is a draw for the mover.
- [tablebase] Tablebase: after Re6+ the result is a loss for the mover.
- [tablebase] Tablebase: after Rf6 the result is a loss for the mover.
- [tablebase] Tablebase: after Rg6 the result is a draw for the mover.
- [tablebase] Tablebase: after Rh6 the result is a loss for the mover.
- [tablebase] Tablebase: after Ka8 the result is a loss for the mover.
- [tablebase] Tablebase: after Kb7 the result is a draw for the mover.
- [tablebase] Tablebase: after Kc8 the result is a draw for the mover.
- [tablebase] Tablebase: after c5 the result is a loss for the mover.
- [tablebase] Tablebase: after c6 the result is a loss for the mover.

### Step 60: card

**Who has the waiting moves? [I]** In the next two boards the pieces are identical and only whose turn it is changes. Even a depth-4 search sees the swing here: +4.6 for White with Black to move, +0.08 with White to move [V]. One tempo flips the result. A fortress that survives only while you can shuffle fails the moment you must break it.

### Step 61: board

Caption: Black to move. It is the same kings and pawn as the next board; only whose turn it is changes. Here Black must move, and every move loses ground.

```
  8  . . . . . . . .
  7  . . . k . . . .
  6  . . . . . . . .
  5  . . . K . . . .
  4  . . . P . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  . . . . . . . .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: 8/3k4/8/3K4/3P4/8/8/8 b - - 0 1
```

The line, with the sentence the learner sees at each move:
1. **1... Ke8**: Black has to move. The king gives way, and the opposition is gone.
2. **2. Kd6**: White steps forward, and the king gets in front of the pawn.
3. **2... Kf7**: Black keeps the king nearby.
4. **3. Kd7**: White pushes the king to the edge for good.

```
  8  . . . . . . . .
  7  . . . K . k . .
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . P . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  . . . . . . . .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 8/3K1k2/8/8/3P4/8/8/8 b - - 4 3
```

Drawn on the board: highlighted squares d7, d5, d4.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [tablebase] Tablebase: the side to move, Black, loses.
- [eval_range] At depth 16 the engine shows over +4 for White.
- [eval_range] At depth 4 the engine already shows over +4.

### Step 62: board

Caption: Now White must move instead. White has no useful waiting move, and the engine agrees it is level. The same position changed from lost to drawn by one tempo.

```
  8  . . . . . . . .
  7  . . . k . . . .
  6  . . . . . . . .
  5  . . . K . . . .
  4  . . . P . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  . . . . . . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 8/3k4/8/3K4/3P4/8/8/8 w - - 0 1
```

The line, with the sentence the learner sees at each move:
1. **1. Ke5**: White steps aside, since the pawn alone cannot advance safely.
2. **1... Ke7**: Black keeps the opposition by moving next to it.
3. **2. Kd5**: White returns.
4. **2... Kd7**: Black returns; nobody can make progress.

```
  8  . . . . . . . .
  7  . . . k . . . .
  6  . . . . . . . .
  5  . . . K . . . .
  4  . . . P . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  . . . . . . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 8/3k4/8/3K4/3P4/8/8/8 w - - 4 3
```

Drawn on the board: highlighted squares d7, d5, d4.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [tablebase] Tablebase: the position is a draw for White.
- [eval_range] At depth 16 the engine shows about 0.00.
- [eval_range] At depth 4 about level.

### Step 63: contrast

Title: Break the shelter

Prompt: Predict: draw or win? One difference between the two boards: how far Black's pawn has advanced (g7 versus g6).

**The working board:**

**Task `IHI-LHIENGINESHUMANS2-5`** (predict_outcome, difficulty cue 3)

White to move. With best play from both sides, is the result a win, a draw or a loss for White?

```
  8  . . . . . k . .
  7  . . Q . . . p r
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . K . .
  2  . . . . . . . .
  1  . . . . . . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 5k2/2Q3pr/8/8/8/5K2/8/8 w - - 0 1
```

**Accepted answer:** {"outcome": "draw"}

**Explanation shown:** The tablebase result is a draw although the queen side is ahead by counting values.

Hints (in order):
1. Count the counting values on each side.
2. Can the queen attack the rook and the pawn at once?
3. Is anything of Black's left undefended, so a check can attack it twice?

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [tablebase] Tablebase: the result is a draw for the side to move.

**The failing board:**

**Task `IHI-LHIENGINESHUMANS2-6`** (predict_outcome, difficulty cue 3)

White to move. With best play from both sides, is the result a win, a draw or a loss for White?

```
  8  . . . . . k . .
  7  . . Q . . . . r
  6  . . . . . . p .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . K . .
  2  . . . . . . . .
  1  . . . . . . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 5k2/2Q4r/6p1/8/8/5K2/8/8 w - - 0 1
```

**Accepted answer:** {"outcome": "win"}

**Explanation shown:** The tablebase result is a win: with the pawn on g6 the queen reaches the rook along the seventh rank.

Hints (in order):
1. Compare with the board where the pawn stands one step further back.
2. Which black unit is no longer shielded along the seventh rank?
3. The queen can now reach the rook.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [tablebase] Tablebase: the result is a win for the side to move.

### Step 64: board

Caption: Back to the queen against a rook and one pawn, but the pawn has moved one step, from f7 to f6. Predict the verdict before reading the claims.

```
  8  . . . . . . k .
  7  . . . K . . . .
  6  . . . . . p . r
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . Q . . . . .
  1  . . . . . . . .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: 6k1/3K4/5p1r/8/8/8/2Q5/8 b - - 0 1
```

Drawn on the board: highlighted squares f6, d7, h6.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [tablebase] Tablebase: the side to move, Black, loses.
- [eval_range] At depth 16 the engine shows over +2.5 for White.

### Step 65: card

**Why the pawn step matters [I].** In the f7 board the only saving rook moves went to g6 and e6, squares the pawn on f7 guards. On f6 the pawn no longer guards them, so the rook has no safe shelter and the queen's checks fork it. The tablebase confirms the loss [V].

### Step 66: reflect

Kind: unsure

Prompt: In one sentence: why did moving Black's pawn a single step flip the result?

- Field "My reason:" (free text)

### Step 67: card

**Common mistakes.** Three to watch. Trusting a plus score in a locked position. Giving up material in a fortress because it feels passive: the shelter needs those pieces where they are. Resigning a drawn game because the number looks big. [H] The last is the costliest, because nobody can punish it; you only lose the chance to learn the position.

### Step 68: card

**A real model case [H].** We have not yet read and checked a famous game where a misread evaluation or a mistaken resignation decided the result, so none is claimed here. Until that is done, the constructed example below is a teaching device, not history.

### Step 69: board

Caption: A constructed example, not a real game. White has a rook and two pawns against a queen: 7 against 9 by counting values, and many players would give up. The tablebase says draw.

```
  8  . . . . . . . .
  7  . . . . . q . .
  6  . . . . . . . .
  5  . . k . . . . .
  4  . . . . . . . .
  3  R . P . . . . .
  2  . . P . . . . .
  1  . K . . . . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 8/5q2/8/2k5/8/R1P5/2P5/1K6 w - - 0 1
```

The line, with the sentence the learner sees at each move:
1. **1. Kb2**: The king guards both pawns, so the queen cannot win either for free.
2. **1... Qf2**: The queen attacks the c2 pawn, which the king defends.

```
  8  . . . . . . . .
  7  . . . . . . . .
  6  . . . . . . . .
  5  . . k . . . . .
  4  . . . . . . . .
  3  R . P . . . . .
  2  . K P . . q . .
  1  . . . . . . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 8/8/8/2k5/8/R1P5/1KP2q2/8 w - - 2 2
```

Drawn on the board: highlighted squares a3, c3, c2, b1.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [tablebase] Tablebase: the position is a draw.
- [eval_range] At depth 16 the engine rates it level.

### Step 70: item  (shown without telling the learner the topic: unlabeled test)

**Task `IHI-LHIENGINESHUMANS2-4`** (predict_outcome, difficulty cue 3)

White to move. With best play from both sides, is the result a win, a draw or a loss for White?

```
  8  . . . . . . . k
  7  . . . . . . . .
  6  . . . . . . K .
  5  . . . . . . . .
  4  . . . . . . . P
  3  . . . . . . . .
  2  . . . . . . . .
  1  . . . . . B . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 7k/8/6K1/8/7P/8/8/5B2 w - - 0 1
```

**Accepted answer:** {"outcome": "draw"}

**Explanation shown:** The tablebase result is a draw.

Hints (in order):
1. Look at the colour of the corner and of the bishop.
2. Is the pawn a rook pawn?
3. Is the pawn on the edge file?

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [tablebase] Tablebase: the result is a draw for the side to move.

### Step 71: item  (shown without telling the learner the topic: unlabeled test)

**Task `IHI-LHIENGINESHUMANS2-18`** (predict_outcome, difficulty cue 3)

White to move. With best play from both sides, is the result a win, a draw or a loss for White?

```
  8  r . . k . . . .
  7  . . p . . . . .
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . Q . . . . .
  2  . . . . . . . K
  1  . . . . . . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: r2k4/2p5/8/8/8/2Q5/7K/8 w - - 0 1
```

**Accepted answer:** {"outcome": "win"}

**Explanation shown:** The tablebase result is a win: the king does not guard the rook, so a check wins it.

Hints (in order):
1. Does a check also attack the rook?
2. Where do the king and the rook stand relative to each other?
3. Compare with a fortress where the king guards the rook.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [tablebase] Tablebase: the result is a win for the side to move.

### Step 72: item  (shown without telling the learner the topic: unlabeled test)

**Task `IHI-LHIENGINESHUMANS2-16`** (predict_outcome, difficulty cue 3)

White to move. With best play from both sides, is the result a win, a draw or a loss for White?

```
  8  . . r . . . . .
  7  k p . . . . . Q
  6  . p . . . K . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  . . . . . . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 2r5/kp5Q/1p3K2/8/8/8/8/8 w - - 0 1
```

**Accepted answer:** {"outcome": "draw"}

**Explanation shown:** The tablebase result is a draw.

Hints (in order):
1. Count the counting values.
2. Black's king and rook cooperate.
3. Draw.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [tablebase] Tablebase: the result is a draw for the side to move.

### Step 73: item  (shown without telling the learner the topic: unlabeled test)

**Task `IHI-LHIENGINESHUMANS2-20`** (predict_outcome, difficulty cue 3)

White to move. With best play from both sides, is the result a win, a draw or a loss for White?

```
  8  k . . . . . . .
  7  . . . . . . . .
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . B . . . . .
  2  P . . . . . . .
  1  . K . . . . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: k7/8/8/8/8/2B5/P7/1K6 w - - 0 1
```

**Accepted answer:** {"outcome": "draw"}

**Explanation shown:** The tablebase result is a draw: wrong-coloured bishop, rook pawn, and the king already in the corner.

Hints (in order):
1. Is the pawn a rook pawn?
2. Compare the bishop's colour with the promotion corner.
3. Where is Black's king?

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [tablebase] Tablebase: the result is a draw for the side to move.

### Step 74: item  (shown without telling the learner the topic: unlabeled test)

**Task `IHI-LHIENGINESHUMANS2-19`** (predict_outcome, difficulty cue 3)

White to move. With best play from both sides, is the result a win, a draw or a loss for White?

```
  8  . . . . . . . k
  7  . . . . . . . .
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . . . P .
  1  . . . . . B . K
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 7k/8/8/8/8/8/6P1/5B1K w - - 0 1
```

**Accepted answer:** {"outcome": "win"}

**Explanation shown:** The tablebase result is a win: this is not a rook pawn, so the corner is no shelter.

Hints (in order):
1. Is this a rook pawn?
2. Which colour is the promotion corner, and the bishop?
3. Where does the pawn queen?

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [tablebase] Tablebase: the result is a win for the side to move.

### Step 75: item  (shown without telling the learner the topic: unlabeled test)

**Task `IHI-LHIENGINESHUMANS2-17`** (predict_outcome, difficulty cue 3)

Black to move. With best play from both sides, is the result a win, a draw or a loss for Black?

```
  1  . . . . . . . .
  2  P . K . . . . .
  3  . P R . . . . .
  4  . . . . . . . .
  5  . q . . . . . .
  6  . . . . . . . .
  7  . . . . . . . .
  8  . . . . . . k .
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: 1k6/8/8/6q1/8/5RP1/5K1P/8 b - - 0 1
```

**Accepted answer:** {"outcome": "draw"}

**Explanation shown:** The tablebase result is a draw.

Hints (in order):
1. Count the counting values.
2. Look for a shelter for the rook.
3. Draw.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [tablebase] Tablebase: the result is a draw for the side to move.

### Step 76: item  (shown without telling the learner the topic: unlabeled test)

**Task `IHI-LHIENGINESHUMANS2-21`** (predict_outcome, difficulty cue 2)

White to move. With best play from both sides, is the result a win, a draw or a loss for White?

```
  8  . . . . . . . .
  7  . . . . . . . .
  6  . . . . k . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . r . . .
  1  K . . . Q . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 8/8/4k3/8/8/8/4r3/K3Q3 w - - 0 1
```

**Accepted answer:** {"outcome": "win"}

**Explanation shown:** The tablebase result is a win: a queen against a lone rook is a win in the tablebase, though it needs care.

Hints (in order):
1. Count the pieces on each side.
2. Is there a shelter for the rook?
3. The queen side has the move.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [tablebase] Tablebase: the result is a win for the side to move.

### Step 77: card

**Three questions before you believe a number.** (1) Which engine and which depth, and does a second depth agree? (2) Is the position locked, or built on a few precise moves, so counting is the wrong tool? (3) What would a person need to do next, and could they? A number answers none of these. [H] Writing the three answers down is a habit worth building.

### Step 78: reflect

Kind: expect

Prompt: Teach it back to a beginner who says 'the engine says +5, so it is won'. Fill all four.

- Field "The idea in my words:" (free text)

- Field "When it applies:" (free text)

- Field "One example I could set up on a board:" (free text)

- Field "One warning:" (free text)

### Step 79: card

**Self-check.** Did I say when a big score can mislead (a fortress, a short search)? Did I say when it does not (a score over +3 that a tablebase also agrees with)? Did I give an example a beginner could set up on a board? Did I name one mistake? Nothing here is graded; compare your answer with the lesson, not with a mark.

### Step 80: card

**Recap.** A big score can hide a fortress, and a small or rising score can hide one too. Bishop colour, the file of the pawn and where the defending king stands decide the corner. A second depth is one check, not a guarantee. Compensation is not in the count. A 0.00 can hide five only-moves. Write your view down before the engine's.

### Step 81: reflect

Kind: confidence

Prompt: One habit I will change when I use an engine this week.

- Field "My habit:" (free text)

---

## Reviewer scorecard

Fill in the file `content/review/L-HI-ENGINES-HUMANS-2.json` (a template is below). Scale 1 to 5 for each dimension: 1 = wrong or unusable, 3 = acceptable with edits, 5 = I would put my name to it as it stands.
Revision to review: `6418130a`. If the lesson text changes after your review, your sign-off no longer applies and the lesson goes back to needs-human.

| Dimension | What to judge | Score |
|---|---|---|
| chess | every statement, line and explanation is correct; near-misses are really near-misses | |
| clarity | the explanation actually explains (mechanism, conditions), in plain words | |
| prerequisites | the lesson assumes only what the learner has met | |
| tasks | each task has one defensible answer and a fair explanation | |

```json
{
  "lesson": "L-HI-ENGINES-HUMANS-2",
  "revision": "6418130a",
  "reviewer": "<your name>",
  "reviewer_role": "strong-player",
  "date": "YYYY-MM-DD",
  "scores": {"chess": 0, "clarity": 0, "prerequisites": 0, "tasks": 0},
  "comments": "<what to change, by step number>",
  "verdict": "approved"
}
```

`reviewer_role` is `strong-player` or `teacher`. `verdict` is `approved` or `changes-requested`. See docs/review-slice.md.
