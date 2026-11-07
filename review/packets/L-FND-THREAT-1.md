# Review packet: L-FND-THREAT-1

**Before every move: two questions**

- Skill: LOOP.V1 (D1); stage: S2; stated length: 12 minutes
- Steps: 12 (7 are tasks); revision: `24b935fa`
- Review status now: needs-human

## What the lesson says the learner will be able to do

- Names what the opponent's last move threatens, including a checkmate threat
- Finds one's own loose pieces, and knows when there is nothing to fix
- Plays the first games with a simple routine and marks a moment of doubt

## Sources the author names (check that they are used fairly, in our own words)

- docs/first-hours.md sessions 3-4 (the threat check, first games, reflection)
- docs/council-synthesis.md CD-3, CD-12
- sources/sheets/capablanca_chess-fundamentals.md (CI-51: failing to see the opponent's threat)

## How to read this packet

Boards are drawn with capitals for White and lower case for Black, rank 8 at the top unless the board is shown from Black's side. Moves in a line are in standard notation. Statements marked [V] were machine-checked, [I] inference, [H] hypothesis, [S] secondary source, [R] recalled. Please judge the explanations, not only the moves: does each sentence tell the learner why?

---

### Step 1: card

Before every move, ask two questions. **1. What does my opponent's last move threaten?** (a capture, a check, a checkmate). **2. Is any of my pieces loose?** (attacked, and not defended). Only then choose your own move, and test it: after I move, what becomes capturable or exposed (the moved piece, a piece it stopped guarding, a line it opened)? Strong players do this all the time; many games are lost by skipping it.

### Step 2: board

Caption: White's queen and bishop aim at f7. If Black ignores this and develops a knight, Qxf7 is checkmate.

```
  8  r . b q k b n r
  7  p p p p . p p p
  6  . . n . . . . .
  5  . . . . p . . Q
  4  . . B . P . . .
  3  . . . . . . . .
  2  P P P P . P P P
  1  R N B . K . N R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: r1bqkbnr/pppp1ppp/2n5/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR b KQkq - 4 3
```

The line, with the sentence the learner sees at each move:
1. **3... Nf6**: Black develops a knight and ignores the threat.
2. **4. Qxf7#**: Queen takes f7: checkmate.

```
  8  r . b q k b . r
  7  p p p p . Q p p
  6  . . n . . n . .
  5  . . . . p . . .
  4  . . B . P . . .
  3  . . . . . . . .
  2  P P P P . P P P
  1  R N B . K . N R
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: r1bqkb1r/pppp1Qpp/2n2n2/4p3/2B1P3/8/PPPP1PPP/RNB1K1NR b KQkq - 0 4
```

Drawn on the board: arrows h5-f7, c4-f7; highlighted squares f7.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [mate_in] (no sentence; a rules check)

### Step 3: item

**Task `IT-fgitrypr-21`** (threat_detection, difficulty cue 3)

Black to move. If Black did nothing useful and White moved next, what would White play to win material or checkmate? Name that move, or choose 'No threat'.

```
  1  . K R . Q . . R
  2  P P P . . . P P
  3  . . N B . N . .
  4  . . . . P . b .
  5  . . n P p . . .
  6  . . . p . n . .
  7  p p p . q . p p
  8  r . . k . . . r
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: r3k2r/pp1q1ppp/2n1p3/3pPn2/1b1P4/2N1BN2/PP3PPP/R2Q1RK1 b kq - 4 11
```

**Accepted answer:** the threatened move is none (none)

**Explanation shown:** Neither side has a piece that is attacked and undefended, and the engine rates the position within 1.5 pawns of equal (depth 16). A null-move engine search run when the item was built found no mating or material-winning move for White; the validator does not re-run that part.

Hints (in order):
1. Imagine it is the opponent's turn again. Which of their pieces could give check or capture something?
2. For each of their checks and captures, ask whether something of yours is left without a defender or without a flight square.
3. Check every piece of yours: is any of them attacked and undefended?

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [loose_pieces] Black has no piece that is attacked and undefended.
- [loose_pieces] White has no piece that is attacked and undefended.
- [eval_range] The engine's evaluation is within 1.5 pawns of equal (depth 16).

### Step 4: item

**Task `IT-grfph91k-45`** (threat_detection, difficulty cue 3)

Black to move. If Black did nothing useful and White moved next, what would White play to win material or checkmate? Name that move, or choose 'No threat'.

```
  1  K . R . . . . .
  2  P . B P Q . P P
  3  . . . . P . . .
  4  b . . . . P . .
  5  . . . p N . . .
  6  . q . . . . . .
  7  p p . . b p . .
  8  k . . . . r . .
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: 2r4k/2pb2pp/6q1/3Np3/2P4b/3P4/PP1QPB1P/5R1K b - - 5 23
```

**Accepted answer:** the threatened move is Bxh4 (f2h4)

**Explanation shown:** The bishop on h4 is attacked once and defended by nothing, so White could capture it with Bxh4. A null-move engine search run when the item was built found that this capture nets White at least 2 points of material; the validator does not re-run that part.

Hints (in order):
1. Imagine it is the opponent's turn again. Which of their pieces could give check or capture something?
2. For each of their checks and captures, ask whether something of yours is left without a defender or without a flight square.
3. The piece on h4 is attacked and has no defender.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [loose_pieces] The bishop on h4 is the only Black piece that is attacked and undefended.
- [attackers] Exactly one White piece attacks h4.

### Step 5: contrast

Title: The same attack, one defender more

Prompt: Black's knight went to h6, not f6. Predict first: does Qxf7 still win for White?

**The working board:**

**Task `IA0-108`** (predict_outcome, difficulty cue 2)

Black played Nf6 (a developing move). White to move: does Qxf7 win by checkmate? Predict, then check.

```
  8  r . b q k b . r
  7  p p p p . p p p
  6  . . n . . n . .
  5  . . . . p . . Q
  4  . . B . P . . .
  3  . . . . . . . .
  2  P P P P . P P P
  1  R N B . K . N R
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 5 4
```

**Accepted answer:** {"outcome": "yes"}

**Explanation shown:** Only the king defends f7, and the king cannot capture a queen that the bishop protects. Qxf7 is checkmate.

Hints (in order):
1. Which black pieces defend f7?
2. Who can capture the queen on f7?

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [mate_in] Qxf7 is checkmate.

**The failing board:**

**Task `IA0-109`** (predict_outcome, difficulty cue 3)

This time Black played Nh6 instead. White to move: does Qxf7 still win? Predict, then check.

```
  8  r . b q k b . r
  7  p p p p . p p p
  6  . . n . . . . n
  5  . . . . p . . Q
  4  . . B . P . . .
  3  . . . . . . . .
  2  P P P P . P P P
  1  R N B . K . N R
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: r1bqkb1r/pppp1ppp/2n4n/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 5 4
```

**Accepted answer:** {"outcome": "no"}

**Explanation shown:** The knight on h6 also defends f7, so the knight can take the queen on f7. The threat is gone: Qxf7+ would just lose White's queen for a pawn and more.

Hints (in order):
1. Who defends f7 now?
2. What happens if the queen takes on f7?

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [material_after_move] Qxf7+ loses material for White.
- [attackers] The king and the knight on h6 both defend f7.

### Step 6: card

The second question looks at your own side. After each opponent move, scan your pieces: is any of them attacked and not defended? If nothing is loose and nothing is threatened, you are free to follow your opening habits.

### Step 7: item

**Task `IA0-110`** (select_squares, difficulty cue 1)

Black to move. White's last move was d3. Which of your pieces is loose (attacked, and not defended)? Kings do not count.

```
  1  . K R . . B . R
  2  P P P . . P P P
  3  . . N . P . . .
  4  . . . n . . . .
  5  . . . . . . . .
  6  . . . . . . . .
  7  p p p . . p p p
  8  . k r . . b . r
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: r1b2rk1/ppp2ppp/8/8/4n3/3P1N2/PPP2PPP/R1B2RK1 b - - 0 1
```

**Accepted answer:** squares e4

**Explanation shown:** The pawn on d3 attacks e4, and nothing of Black's defends the knight there. It is the only loose black piece.

Hints (in order):
1. List every black piece that a white piece attacks.
2. The pawn on d3 attacks two squares. Is a black piece on one of them?

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [loose_pieces] The knight on e4 is the only loose black piece.

### Step 8: item

**Task `IA0-111`** (predict_outcome, difficulty cue 3)

Black to move. Is any of Black's pieces loose (attacked, and not defended)? Kings do not count.

```
  1  R . B K Q B . R
  2  P P P . P P P P
  3  . . N . . N . .
  4  . . . P . . . .
  5  . . . p . . . .
  6  . . n . . n . .
  7  p p p . p p p p
  8  r . b k q b . r
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: r1bqkb1r/pppp1ppp/2n2n2/4p3/4P3/2N2N2/PPPP1PPP/R1BQKB1R b KQkq - 4 4
```

**Accepted answer:** {"outcome": "no"}

**Explanation shown:** The only black pawn that White attacks, on e5, is defended by the knight on c6. Nothing is loose, so Black is free to carry on with a normal developing move.

Hints (in order):
1. List the black pieces that White attacks, if any.
2. For each, find a defender.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [loose_pieces] No black piece is loose.

### Step 9: item

**Task `IA0-112`** (threat_detection, difficulty cue 3)

Black to move. What is White threatening? Name the move.

```
  1  . K . . R . . .
  2  P P P . . . . .
  3  . . . . . . . .
  4  . . . . . . . .
  5  . . . . . . . .
  6  . . . . . . . .
  7  p p p . . . . r
  8  . k . . . . . .
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: 6k1/r4ppp/8/8/8/8/5PPP/3R2K1 b - - 0 1
```

**Accepted answer:** the threatened move is Rd8# (d1d8)

**Explanation shown:** The rook on d1 can slide to d8, where it checks the king along the back rank. The king's pawns block its escape and Black's rook on a7 cannot capture on d8. If Black passes, it is checkmate.

Hints (in order):
1. Which white piece could reach Black's back rank?
2. What stands in front of Black's king, and where could it go?

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [mate_in] If Black passes, Rd8 is checkmate.

### Step 10: item

**Task `IA0-113`** (find_move, difficulty cue 3)

Black to move. Make sure the threat does not work, without losing material.

```
  1  . K . . R . . .
  2  P P P . . . . .
  3  . . . . . . . .
  4  . . . . . . . .
  5  . . . . . . . .
  6  . . . . . . . .
  7  p p p . . . . r
  8  . k . . . . . .
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: 6k1/r4ppp/8/8/8/8/5PPP/3R2K1 b - - 0 1
```

**Accepted answer(s):** Ra8, f5, g6, Kf8, f6, g5, h6, h5

**Explanation shown:** A pawn move such as h6 gives the king a square to flee to, and Ra8 or Kf8 cover the back rank directly. Every other move in the position either allows the mate or loses the rook.

Hints (in order):
1. The king has no squares because its own pawns box it in. How could you give it one?
2. Move one of the pawns in front of the king, or defend the back rank with the rook.
3. A square for the king to run to is called 'luft' (German for air). h6 gives it one.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] These eight moves stop the mate and keep the game level.
- [move_loses] Rd7 loses.
- [move_loses] Ra1 loses.
- [move_loses] Re7 loses.
- [move_loses] Ra2 loses.
- [move_loses] Rc7 loses.
- [move_loses] Rb7 loses.
- [move_loses] Kh8 loses.

### Step 11: card

Now play your first games. Play simply: take the centre, bring your pieces out, castle, and ask the two questions before every move. Do not worry about winning. The goal is to notice. After a game, mark **one moment where you were unsure** and what you expected your opponent to do.

### Step 12: reflect

Kind: unsure

Prompt: After your first game: mark one move where you were unsure. What did you think your opponent would do there? You will compare your answer with what the game shows.

---

## Reviewer scorecard

Fill in the file `content/review/L-FND-THREAT-1.json` (a template is below). Scale 1 to 5 for each dimension: 1 = wrong or unusable, 3 = acceptable with edits, 5 = I would put my name to it as it stands.
Revision to review: `24b935fa`. If the lesson text changes after your review, your sign-off no longer applies and the lesson goes back to needs-human.

| Dimension | What to judge | Score |
|---|---|---|
| chess | every statement, line and explanation is correct; near-misses are really near-misses | |
| clarity | the explanation actually explains (mechanism, conditions), in plain words | |
| prerequisites | the lesson assumes only what the learner has met | |
| tasks | each task has one defensible answer and a fair explanation | |

```json
{
  "lesson": "L-FND-THREAT-1",
  "revision": "24b935fa",
  "reviewer": "<your name>",
  "reviewer_role": "strong-player",
  "date": "YYYY-MM-DD",
  "scores": {"chess": 0, "clarity": 0, "prerequisites": 0, "tasks": 0},
  "comments": "<what to change, by step number>",
  "verdict": "approved"
}
```

`reviewer_role` is `strong-player` or `teacher`. `verdict` is `approved` or `changes-requested`. See docs/review-slice.md.
