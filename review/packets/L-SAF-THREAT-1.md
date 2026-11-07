# Review packet: L-SAF-THREAT-1

**What did their last move threaten?**

- Skill: SAF.THREAT (D1); stage: S2; stated length: 9 minutes
- Steps: 10 (6 are tasks); revision: `bc69b7c2`
- Review status now: needs-human

## What the lesson says the learner will be able to do

- Names what an opponent's last move threatens: a capture, a mate, or an attack on two pieces at once
- Tells a real threat from an attack that fails after the recapture
- Says when the last move threatens nothing

## Sources the author names (check that they are used fairly, in our own words)

- sources/sheets/znosko-borovsky_middle-game.md (C14 real and fictitious threats; exercise idea 5)
- docs/curriculum-map-v1.1.md section 3 (real vs fictitious threats feed SAF.THREAT)
- docs/council-synthesis.md CD-3

## How to read this packet

Boards are drawn with capitals for White and lower case for Black, rank 8 at the top unless the board is shown from Black's side. Moves in a line are in standard notation. Statements marked [V] were machine-checked, [I] inference, [H] hypothesis, [S] secondary source, [R] recalled. Please judge the explanations, not only the moves: does each sentence tell the learner why?

---

### Step 1: card

After your opponent moves, ask first: **what does that move threaten?** Imagine they get a second move in a row. Could they win a piece, give mate, or attack two pieces at once? Look at what their piece now attacks and what line it has just opened.
If the answer is 'nothing', you are free to follow your own plan.

### Step 2: board

Caption: Black to move. White has just played Re1. What is the threat?

```
  8  . . . . . . k .
  7  p p . r . p p p
  6  . . n . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  P P . . . P P P
  1  . . B . R . K .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Starting position.
FEN: 6k1/pp1r1ppp/2n5/8/8/8/PP3PPP/2B1R1K1 b - - 0 1
```

The line, with the sentence the learner sees at each move:
1. **1... a6**: Black ignores the threat and plays an unrelated move.
2. **2. Re8#**: Re8 is checkmate: the pawns shut the king in and nothing covers e8.

```
  8  . . . . R . k .
  7  . p . r . p p p
  6  p . n . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  P P . . . P P P
  1  . . B . . . K .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 4R1k1/1p1r1ppp/p1n5/8/8/8/PP3PPP/2B3K1 b - - 1 2
```

Drawn on the board: arrows e1-e8; highlighted squares e8.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [mate_in] White threatens Re8 mate.
- [attackers] No black piece covers e8.

### Step 3: item

**Task `IA1-018`** (threat_detection, difficulty cue 1)

Black has just moved. What does Black threaten? Move a Black piece to show it.

```
  8  . . b . r . k .
  7  p p . . . p p p
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . N . . . . .
  2  P P . R . P P P
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 2b1r1k1/pp3ppp/8/8/8/2N5/PP1R1PPP/6K1 w - - 0 1
```

**Accepted answer:** the threatened move is Re1# (e8e1)

**Explanation shown:** The rook on e8 now looks straight down the open e-file. ...Re1+ would be checkmate: the pawns shut the king in, no white piece covers e1, and nothing can block on f1.

Hints (in order):
1. Look at the rook that just arrived. Which files and ranks does it control now?
2. Black can give check on the first rank. Can White's king escape or capture the checking piece?
3. The rook can slide down the e-file to e1.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [mate_in] If White passes, ...Re1 is checkmate.
- [attackers] No white piece covers e1.
- [attackers] The rook on e8 reaches e1 along the open e-file.

### Step 4: item

**Task `IA1-021`** (threat_detection, difficulty cue 2)

Black has just played ...d5. What does Black threaten? Move a Black piece to show it.

```
  8  . . r q . . k .
  7  p p . . b p p p
  6  . . . . p n . .
  5  . . . p . . . .
  4  . . B . . . . .
  3  . P . . P N . .
  2  P . P . . P P P
  1  . . . Q . R K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 2rq2k1/pp2bppp/4pn2/3p4/2B5/1P2PN2/P1P2PPP/3Q1RK1 w - - 0 1
```

**Accepted answer:** the threatened move is dxc4 (d5c4)

**Explanation shown:** The pawn on d5 attacks the bishop. Even though the bishop is defended, trading a bishop for a pawn is a loss, so ...dxc4 is a real threat. An attack by a piece with a lower counting value always needs an answer.

Hints (in order):
1. Which white piece did the new pawn attack?
2. A bishop counts 3 and a pawn 1. What does each side lose if the bishop recaptures?

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [material_after_move] If White ignores the pawn, Black wins material along the engine line.
- [attackers] Two black pieces attack c4: the pawn on d5 and the rook on c8.
- [attackers] One white piece, the pawn on b3, defends c4.

### Step 5: card

A threat is real only if carrying it out works. Ask:
**What would they take or attack?**
**After my recapture, do they gain?** A rook that takes a pawn-defended bishop loses material.
**Can they really play it?** A covered square or an escape square for my king can cancel it.
Sometimes the honest answer is: no threat.

### Step 6: contrast

Title: Same rook, one change

Prompt: Black's rook stands on e8 again. A white knight now stands on f3 instead of c3.

**The working board:**

**Task `IA1-018`** (threat_detection, difficulty cue 1)

Black has just moved. What does Black threaten? Move a Black piece to show it.

```
  8  . . b . r . k .
  7  p p . . . p p p
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . N . . . . .
  2  P P . R . P P P
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 2b1r1k1/pp3ppp/8/8/8/2N5/PP1R1PPP/6K1 w - - 0 1
```

**Accepted answer:** the threatened move is Re1# (e8e1)

**Explanation shown:** The rook on e8 now looks straight down the open e-file. ...Re1+ would be checkmate: the pawns shut the king in, no white piece covers e1, and nothing can block on f1.

Hints (in order):
1. Look at the rook that just arrived. Which files and ranks does it control now?
2. Black can give check on the first rank. Can White's king escape or capture the checking piece?
3. The rook can slide down the e-file to e1.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [mate_in] If White passes, ...Re1 is checkmate.
- [attackers] No white piece covers e1.
- [attackers] The rook on e8 reaches e1 along the open e-file.

**The failing board:**

**Task `IA1-019`** (predict_outcome, difficulty cue 2)

Black to move. A white knight stands on f3. Is ...Re1+ checkmate? Predict, then check.

```
  1  . K . . . . . .
  2  P P P . R . P P
  3  . . N . . . . .
  4  . . . . . . . .
  5  . . . . . . . .
  6  . . . . . . . .
  7  p p p . . . p p
  8  . k . r . b . .
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: 2b1r1k1/pp3ppp/8/8/8/5N2/PP1R1PPP/6K1 b - - 0 1
```

**Accepted answer:** {"outcome": "no"}

**Explanation shown:** The knight on f3 covers e1, so ...Re1+ just loses the rook for nothing. The same rook on the same file is a real threat only when the square it needs is not covered.

Hints (in order):
1. Who can capture a piece that lands on e1?
2. A check is only mate if nothing can take the checking piece.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [material_after_move] ...Re1+ Nxe1 loses the rook.
- [attackers] The knight on f3 covers e1.

**The irrelevant board:**

**Task `IA1-020`** (threat_detection, difficulty cue 3)

Black has just moved. Anything to worry about? Show the threat by moving a Black piece, or say there is none.

```
  8  . . b r . . k .
  7  p p . . . p p p
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . N . . . . .
  2  P P R . . P P P
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 2br2k1/pp3ppp/8/8/8/2N5/PPR2PPP/6K1 w - - 0 1
```

**Accepted answer:** the threatened move is  ()

**Explanation shown:** The rook on d8 aims at the d-file, but the knight on c3 covers d1, and no white piece can be won. Black's last move threatens nothing.

Hints (in order):
1. Imagine Black gets a free move. What could Black take or give check with?
2. Which squares on the first rank could the rook reach, and are they covered?

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [material_after_move] If White makes an unrelated move, Black does not win material along the engine line.
- [loose_pieces] No white piece is loose.
- [attackers] The knight on c3 covers d1, so the rook cannot enter there safely.

### Step 7: item  (shown without telling the learner the topic: unlabeled test)

**Task `IA1-022`** (threat_detection, difficulty cue 3)

Black has just moved. Anything to worry about? Show the threat by moving a Black piece, or say there is none.

```
  8  . . r q . . k .
  7  p p . p b p p p
  6  . . . . p n . .
  5  . . . . . . . .
  4  . . B . . . . .
  3  . P . . P N . .
  2  P . P . . P P P
  1  . . . Q . R K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 2rq2k1/pp1pbppp/4pn2/8/2B5/1P2PN2/P1P2PPP/3Q1RK1 w - - 0 1
```

**Accepted answer:** the threatened move is  ()

**Explanation shown:** The rook attacks the bishop, but a pawn defends it: ...Rxc4 bxc4 would cost Black a rook for a bishop. An attack on a defended piece by a more valuable piece is not a threat.

Hints (in order):
1. What is attacked, and by what?
2. If the rook took the bishop, what would recapture, and what would each side have lost?

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [material_after_move] If White makes an unrelated move, Black does not win material along the engine line.
- [attackers] Only the rook on c8 attacks the bishop on c4.
- [attackers] The pawn on b3 defends the bishop.
- [loose_pieces] No white piece is loose.

### Step 8: item  (shown without telling the learner the topic: unlabeled test)

**Task `IA1-023`** (threat_detection, difficulty cue 3)

Black has just moved. Anything to worry about? Show the threat by moving a Black piece, or say there is none.

```
  8  r . . q . . k .
  7  p p . . . p . p
  6  . . . . . . p .
  5  . . . . . . . .
  4  Q . . n . . . .
  3  . . . . . . . .
  2  P P . . . P P P
  1  . N R . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: r2q2k1/pp3p1p/6p1/8/Q2n4/8/PP3PPP/1NR3K1 w - - 0 1
```

**Accepted answer:** the threatened move is Ne2+ (d4e2)

**Explanation shown:** ...Ne2+ would fork the king on g1 and the rook on c1, and nothing covers e2. The threat is a move away, not on the board yet.

Hints (in order):
1. Nothing of yours is attacked yet. Where could the knight go next?
2. From d4 a knight reaches e2. What stands on the squares a knight on e2 would attack?

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [material_after_move] If White ignores the knight, Black wins a rook along the engine line.
- [attackers] No white piece covers e2.
- [loose_pieces] No white piece is loose right now: the danger is one move away.

### Step 9: practice

A drill of 3 tasks drawn from the bank by tag ['node.SAF.THREAT', 'cue.3'] (151 tasks carry those tags). Not reproduced here; ask for a sample if you want one checked.

### Step 10: reflect

Kind: expect

Prompt: Before you looked, did you expect Black's last move to threaten something? Were you right?

---

## Reviewer scorecard

Fill in the file `content/review/L-SAF-THREAT-1.json` (a template is below). Scale 1 to 5 for each dimension: 1 = wrong or unusable, 3 = acceptable with edits, 5 = I would put my name to it as it stands.
Revision to review: `bc69b7c2`. If the lesson text changes after your review, your sign-off no longer applies and the lesson goes back to needs-human.

| Dimension | What to judge | Score |
|---|---|---|
| chess | every statement, line and explanation is correct; near-misses are really near-misses | |
| clarity | the explanation actually explains (mechanism, conditions), in plain words | |
| prerequisites | the lesson assumes only what the learner has met | |
| tasks | each task has one defensible answer and a fair explanation | |

```json
{
  "lesson": "L-SAF-THREAT-1",
  "revision": "bc69b7c2",
  "reviewer": "<your name>",
  "reviewer_role": "strong-player",
  "date": "YYYY-MM-DD",
  "scores": {"chess": 0, "clarity": 0, "prerequisites": 0, "tasks": 0},
  "comments": "<what to change, by step number>",
  "verdict": "approved"
}
```

`reviewer_role` is `strong-player` or `teacher`. `verdict` is `approved` or `changes-requested`. See docs/review-slice.md.
