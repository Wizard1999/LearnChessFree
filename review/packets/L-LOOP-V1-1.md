# Review packet: L-LOOP-V1-1

**The safety scan: look before you move**

- Skill: LOOP.V1 (D1); stage: S2; stated length: 9 minutes
- Steps: 10 (5 are tasks); revision: `ddad4c5e`
- Review status now: needs-human

## What the lesson says the learner will be able to do

- Names the two scan questions and runs them before a move
- Finds loose pieces on both sides of the board
- Explains why a defended piece can still be unsafe
- Runs the scan without being prompted in a silent item

## Sources the author names (check that they are used fairly, in our own words)

- docs/curriculum-map-v1.md S2 (LOOP.V1)
- docs/council-synthesis.md CD-3 (Heisman-style safety first; Kotov, Aagaard routines, recalled [R])
- positions: Lichess 2013-01 CC0 sample games and authored pairs

## How to read this packet

Boards are drawn with capitals for White and lower case for Black, rank 8 at the top unless the board is shown from Black's side. Moves in a line are in standard notation. Statements marked [V] were machine-checked, [I] inference, [H] hypothesis, [S] secondary source, [R] recalled. Please judge the explanations, not only the moves: does each sentence tell the learner why?

---

### Step 1: card

The **safety scan** is the two questions from the threat lesson, run on every move in about ten seconds.
**1. What did my opponent's last move threaten or open?**
**2. Is any of my pieces loose, or attacked by something cheaper?**
This is a habit to try, not a law. It catches obvious dangers, not deep ones.
Run it on your intended move too: after I move, what becomes capturable or exposed? Check the moved piece, any piece it stopped guarding, and any line it opened.

### Step 2: item

**Task `IA5-1`** (select_squares, difficulty cue 1)

White to move. Tap every loose White piece. Pawns count.

```
  8  . . . r . . . r
  7  . k . . . p p p
  6  . p p b p . . .
  5  P B . n . . . .
  4  . . . P . . . .
  3  . R . . B K . .
  2  . . . . . P P P
  1  . R . . . . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 3r3r/1k3ppp/1ppbp3/PB1n4/3P4/1R2BK2/5PPP/1R6 w - - 0 26
```

**Accepted answer:** squares a5, h2

**Explanation shown:** The pawns on a5 and h2 are each loose: attacked, and no White piece defends them. The bishop on b5 is attacked once too, but the rook on b3 defends it, so it is not loose. Defended is not always safe: that is the next idea.

Hints (in order):
1. Take the White pieces one at a time. Does a Black piece attack it?
2. For each attacked piece, ask whether a White piece could recapture on that square.
3. Two units qualify. Both are pawns: one on the a-file, one on the h-file.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [loose_pieces] Exactly two White pieces are loose: the pawns on a5 and h2.
- [attackers] The bishop on b5 is attacked once.
- [attackers] The bishop on b5 is defended once.

### Step 3: board

Caption: White to move. Run the scan before anything else.

```
  8  r . b q . r k .
  7  p p p . . p p .
  6  . . . b p n . p
  5  . . . . . . B .
  4  . . P P B . . .
  3  . . . . . N . .
  2  P P . . . P P P
  1  R . . Q . R K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: r1bq1rk1/ppp2pp1/3bpn1p/6B1/2PPB3/5N2/PP3PPP/R2Q1RK1 w - - 0 11
```

The line, with the sentence the learner sees at each move:
1. **11. Bxf6**: The bishop on e4 is attacked by the knight and nothing defends it. Bxf6 takes that attacker.
2. **11... Qxf6**: Black recaptures with the queen.

```
  8  r . b . . r k .
  7  p p p . . p p .
  6  . . . b p q . p
  5  . . . . . . . .
  4  . . P P B . . .
  3  . . . . . N . .
  2  P P . . . P P P
  1  R . . Q . R K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r1b2rk1/ppp2pp1/3bpq1p/8/2PPB3/5N2/PP3PPP/R2Q1RK1 w - - 0 12
```

Drawn on the board: arrows g5-f6, f6-e4, h6-g5; highlighted squares e4, g5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] (no sentence; a rules check)
- [loose_pieces] The bishop on e4 is loose.
- [attackers] One Black piece attacks the bishop on e4.
- [attackers] One Black piece attacks the bishop on g5 (the h6 pawn).
- [best_move_in] Bxf6 is the engine's best move.

### Step 4: item

**Task `IA5-2`** (find_move, difficulty cue 1)

Black's last move attacked a loose White piece. Find White's best move.

```
  8  r . . . k b . r
  7  . p . q . . p .
  6  p . . p . p . p
  5  . . . . p . . .
  4  . . . . . n . .
  3  . Q . . . P . .
  2  P P P N N . P P
  1  R . . . . R K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: r3kb1r/1p1q2p1/p2p1p1p/4p3/5n2/1Q3P2/PPPNN1PP/R4RK1 w kq - 2 17
```

**Accepted answer(s):** Nxf4

Feedback shown for wrong moves:
- Rae1: Rae1 adds a defender but leaves the attacker alive; the engine rates it clearly worse than Nxf4.
- Nc3: Nc3 saves the knight but is clearly worse than capturing the attacker.

**Explanation shown:** The knight on e2 was loose. Nxf4 removes the attacker, so nothing is left to rescue. The engine rates the retreats and extra defenders clearly lower.

Hints (in order):
1. Which White piece is attacked, and what attacks it?
2. Running away is not the only answer to an attack. Can you remove the attacker?
3. The attacker is the knight on f4. Capture it.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [loose_pieces] The knight on e2 is loose.
- [best_move_in] Nxf4 is the engine's best move.
- [move_loses] Rae1 is clearly worse.
- [move_loses] Retreating with Nc3 is clearly worse.

### Step 5: card

**Defended is not the same as safe.** A defended piece that a *cheaper* piece attacks can still be lost: the cheaper piece takes, you retake, and you gave up more than you won.
Ask: **is it attacked, and what would the trade cost me?**
The scan also works the other way. Your opponent's loose pieces are chances.

### Step 6: contrast

Title: Same square, different attacker

Prompt: A rook attacks a defended knight. Then a pawn does. Predict, for each, whether White must react.

**The working board:**

**Task `IA5-3`** (predict_outcome, difficulty cue 1)

Black's rook on e8 attacks White's knight on e5, which the bishop on d4 defends. White plays a quiet move such as a3. Does White lose material? Predict, then check.

```
  8  r . q . r . k .
  7  p p . . . p p p
  6  . n . . . n . .
  5  . . . . N . . .
  4  . . . B . . . .
  3  . . . . . . . .
  2  P P P Q . P P P
  1  R . . . . R K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: r1q1r1k1/pp3ppp/1n3n2/4N3/3B4/8/PPPQ1PPP/R4RK1 w - - 0 1
```

**Accepted answer:** {"outcome": "no"}

**Explanation shown:** Rxe5 Bxe5 would give Black a rook for a knight, so the attack is not a real threat. The engine confirms White does not lose material after a quiet move.

Hints (in order):
1. Count the attackers and defenders on e5.
2. If the rook takes, what takes back? Compare the value of the rook with the value of the knight.
3. A rook is worth more than a knight, so Rxe5 Bxe5 would cost Black material.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [attackers] The knight on e5 is attacked once.
- [attackers] The knight on e5 is defended once.
- [material_after_move] After a3 the engine finds no way for Black to win material.

**The failing board:**

**Task `IA5-4`** (predict_outcome, difficulty cue 2)

Now a Black pawn on d6 attacks White's knight on e5, which the bishop on d4 still defends. White plays a quiet move such as a3. Does White lose material? Predict, then check.

```
  8  r . q r . . k .
  7  p p . . . p p p
  6  . n . p . n . .
  5  . . . . N . . .
  4  . . . B . . . .
  3  . . . . . . . .
  2  P P P Q . P P P
  1  R . . . . R K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: r1qr2k1/pp3ppp/1n1p1n2/4N3/3B4/8/PPPQ1PPP/R4RK1 w - - 0 1
```

**Accepted answer:** {"outcome": "yes"}

**Explanation shown:** dxe5 Bxe5 gives Black a knight for a pawn, so the knight is not safe just because the bishop defends it. Moving the knight or trading it off is much better than a quiet move.

Hints (in order):
1. Same square, same defender. What changed is the attacking piece.
2. If the pawn takes and the bishop retakes, what has each side given up?
3. A pawn is worth less than a knight. Defended by a bishop is not enough.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [attackers] The knight on e5 is attacked once.
- [attackers] The knight on e5 is defended once.
- [material_after_move] After a3 White loses at least a knight's worth of material in the engine's line.
- [move_loses] A quiet move such as a3 is far worse than moving the knight.
- [best_move_in] Moving the knight (or trading on b6) is best.

**The irrelevant board:**

**Task `IA5-5`** (predict_outcome, difficulty cue 2)

Black to move. Run the scan's second question. Is any Black piece loose?

```
  8  . . . r . . . r
  7  . k . . . p p p
  6  . . p b . . . .
  5  P p . p . . . .
  4  . . . P . B . .
  3  . R . . . K . .
  2  . . . . . P P P
  1  . R . . . . . .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black.
FEN: 3r3r/1k3ppp/2pb4/Pp1p4/3P1B2/1R3K2/5PPP/1R6 b - - 1 28
```

**Accepted answer:** {"outcome": "no"}

**Explanation shown:** Two Black units are attacked, the bishop on d6 and the pawn on b5, and each has a defender. Nothing is loose, so the scan ends quickly and Black's time can go to Black's own plan.

Hints (in order):
1. Find every Black unit that a White piece attacks.
2. For each attacked unit, ask whether a Black piece defends it.
3. Two Black units are attacked: the bishop on d6 and the pawn on b5. Each has a defender.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [loose_pieces] No Black piece is loose.
- [attackers] The bishop on d6 is attacked once.
- [attackers] The bishop on d6 is defended once.
- [attackers] The pawn on b5 is attacked once.
- [attackers] The pawn on b5 is defended once.

### Step 7: item

**Task `IA5-6`** (find_move, difficulty cue 3)

White to move. Find the best move.

```
  8  r . b q k b . r
  7  . p p p . p p p
  6  p . . . . n . n
  5  . B . . P . . .
  4  . . . P . . . .
  3  . . . . . . . P
  2  P P P . . P P .
  1  R N B Q K . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: r1bqkb1r/1ppp1ppp/p4n1n/1B2P3/3P4/7P/PPP2PP1/RNBQK2R w KQkq - 0 8
```

**Accepted answer(s):** exf6

Feedback shown for wrong moves:
- Bd3: Bd3 saves the bishop but throws away the chance to win a knight with exf6.
- Ba4: Ba4 saves the bishop but leaves Black's knight alone; the engine prefers exf6.

**Explanation shown:** The a6 pawn attacks the bishop on b5, but White's e5 pawn already attacks the knight on f6. Capturing first wins a knight for a pawn, and the bishop can retreat afterwards. A scan that only looks for danger misses this.

Hints (in order):
1. Run both scan questions, and look at Black's pieces as well as your own.
2. Your bishop is attacked. Is any Black piece attacked too?
3. A pawn of yours attacks a knight.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] exf6 is the engine's best move.
- [material_after_move] exf6 wins a knight for a pawn along the engine's line.
- [move_loses] Retreating the bishop at once is clearly worse.
- [loose_pieces] The bishop on b5 is loose: the a6 pawn attacks it and no White piece defends it.

### Step 8: card

**What the app does for you now, and when it stops.** Here the two scan questions sit beside the board. In mixed practice they are hidden; you can open them and the app notes that you did. The plan: stop showing them once you solve five mixed items in a row with them closed (five is a first guess). Next item is silent: no prompts, hints or engine.

### Step 9: item  (shown without telling the learner the topic: unlabeled test)

**Task `IA5-7`** (find_move, difficulty cue 3)

Black to move. Find the best move.

```
  1  . K . R Q . . R
  2  . P P . . . . .
  3  P . N B . N . P
  4  . b . . P P . .
  5  n . . P . . . .
  6  . p p . . . . p
  7  p b . p . p p .
  8  . k r . q . . r
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: r2q1rk1/1pp1p1bp/p4pp1/4P2n/2PP2b1/P1N1BN1P/5PP1/R2QR1K1 b - - 0 15
```

**Accepted answer(s):** Bxf3

Feedback shown for wrong moves:
- Bd7: Bd7 loses time and the engine rates it clearly worse than Bxf3.
- Bc8: Bc8 retreats too far; the engine rates it clearly worse than Bxf3.

**Explanation shown:** The h3 pawn attacks the bishop on g4. Bxf3 trades it for the knight; the two natural retreats are rated more than two pawns worse.

Hints (in order):
1. Which of your pieces is attacked? What is attacking it?
2. Retreating is not the only answer to an attack.
3. Trade the attacked bishop for a piece of equal value.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] Bxf3 is the engine's best move.
- [move_loses] Retreating with Bd7 is more than two pawns worse.
- [move_loses] Retreating with Bc8 is more than two pawns worse.

### Step 10: reflect

Kind: review

Prompt: That item was silent. Before you moved, did you run the two scan questions without being told to? Answer honestly: this record is for you, not a grade.

- Field "Did you run the scan before moving?" with options: yes / partly / no; no single correct answer (a guess or a self-report)

- Field "What did the scan show? (one line)" (free text)

- Field "In your next real game, on which moves will you run the scan on purpose?" (free text)

---

## Reviewer scorecard

Fill in the file `content/review/L-LOOP-V1-1.json` (a template is below). Scale 1 to 5 for each dimension: 1 = wrong or unusable, 3 = acceptable with edits, 5 = I would put my name to it as it stands.
Revision to review: `ddad4c5e`. If the lesson text changes after your review, your sign-off no longer applies and the lesson goes back to needs-human.

| Dimension | What to judge | Score |
|---|---|---|
| chess | every statement, line and explanation is correct; near-misses are really near-misses | |
| clarity | the explanation actually explains (mechanism, conditions), in plain words | |
| prerequisites | the lesson assumes only what the learner has met | |
| tasks | each task has one defensible answer and a fair explanation | |

```json
{
  "lesson": "L-LOOP-V1-1",
  "revision": "ddad4c5e",
  "reviewer": "<your name>",
  "reviewer_role": "strong-player",
  "date": "YYYY-MM-DD",
  "scores": {"chess": 0, "clarity": 0, "prerequisites": 0, "tasks": 0},
  "comments": "<what to change, by step number>",
  "verdict": "approved"
}
```

`reviewer_role` is `strong-player` or `teacher`. `verdict` is `approved` or `changes-requested`. See docs/review-slice.md.
