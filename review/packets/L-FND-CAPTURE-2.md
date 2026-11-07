# Review packet: L-FND-CAPTURE-2

**Free or defended: who can really recapture?**

- Skill: FND.CAPTURE (D2); stage: S2; stated length: 11 minutes
- Steps: 12 (8 are tasks); revision: `95071702`
- Review status now: needs-human

## What the lesson says the learner will be able to do

- Counts only the pieces that can capture on a square as its defenders
- Decides whether a capture is free, wins points or loses points
- Does not treat a nearby enemy piece as a defender

## Sources the author names (check that they are used fairly, in our own words)

- content/skills/FND.CAPTURE.json (D2 outcome)
- content/lessons/L-FND-CAPTURE-1.json (taught there, not repeated)
- items IG-CTRST-*, I-CAP-002, IBds11-9..12 (claims checked by tools/validate.py)

## How to read this packet

Boards are drawn with capitals for White and lower case for Black, rank 8 at the top unless the board is shown from Black's side. Moves in a line are in standard notation. Statements marked [V] were machine-checked, [I] inference, [H] hypothesis, [S] secondary source, [R] recalled. Please judge the explanations, not only the moves: does each sentence tell the learner why?

---

### Step 1: card

In **Taking pieces: is the capture safe?** you learned to ask whether a piece is guarded. Now look closer. A piece is **loose** when it is attacked and nothing defends it. A defender counts only if it can capture on that very square with its own kind of move. A piece standing right next to the target proves nothing; count the pieces that actually attack the square.

### Step 2: board

Caption: The rook attacks the bishop on g5. The pawn on h6 defends it. The pawn on g6 stands in front of it but cannot capture on g5.

```
  8  . . . . . . k .
  7  . . . . . p . .
  6  . . . . . . p p
  5  . . R . . . b .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 6k1/5p2/6pp/2R3b1/8/8/8/6K1 w - - 0 1
```

The line, with the sentence the learner sees at each move:
1. **1. Rxg5**: The rook takes the bishop for 3 points.
2. **1... hxg5**: The h6 pawn recaptures. The g6 pawn could not have. White gave 5 for 3.

```
  8  . . . . . . k .
  7  . . . . . p . .
  6  . . . . . . p .
  5  . . . . . . p .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 6k1/5p2/6p1/6p1/8/8/8/6K1 w - - 0 2
```

Drawn on the board: arrows c5-g5, h6-g5; highlighted squares g5, g6, h6.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [attackers] (no sentence; a rules check)
- [attackers] (no sentence; a rules check)
- [material_after_move] (no sentence; a rules check)

### Step 3: item

**Task `IG-CTRST-2`** (predict_outcome, difficulty cue 2)

White to move. Should the queen on f5 take the bishop on g5? Predict, then check.

```
  8  . . . . . . . .
  7  . k p . . . . .
  6  . . . . . . . p
  5  . . . . . Q b .
  4  . . . . . . . .
  3  . . K P . . . .
  2  . . . . . . . .
  1  . . . . . . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 8/1kp5/7p/5Qb1/8/2KP4/8/8 w - - 0 1
```

**Accepted answer:** {"outcome": "no"}

**Explanation shown:** The bishop on g5 is defended once, and the queen is worth more than the bishop: after the queen takes, it is taken back, and white ends at least 6 points down along the best defence.

Hints (in order):
1. Count first: how many enemy pieces defend the piece on g5?
2. A nearby piece only defends g5 if it could capture on g5 with its own kind of move. Check each one.
3. If the piece is defended, compare the value of what you take with the value of the piece you might lose.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [attackers] Black pieces defending g5: 1.
- [attackers] White pieces attacking g5: 1.
- [material_after_move] Qxg5 loses at least 6 point(s) of material.

### Step 4: card

So there are two questions. Is the square defended, by a piece that really attacks it? If it is, compare what you take with what you could lose. As a **rule of thumb**, with the counting values 1, 3, 3, 5, 9, a cheaper piece capturing a defended piece can still win points, and a dearer piece capturing a defended pawn loses them. The values are only a guide.

### Step 5: contrast

Title: Same capture, the defender changes

Prompt: Predict first: is the capture good when no piece defends the pawn, when a bishop defends it, and when a bishop stands nearby but cannot capture on that square?

**The working board:**

**Task `IG-CTRST-4`** (predict_outcome, difficulty cue 2)

Black to move. Should the knight on b4 take the pawn on d3? Predict, then check.

```
  1  K . . . . . . .
  2  . P . . . . . .
  3  . . . . P . . .
  4  . . . . . . n .
  5  . . . . . . . .
  6  . . . . . . . p
  7  . . . . . . p k
  8  . . . . . . . .
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: 8/kp6/p7/8/1n6/3P4/6P1/7K b - - 0 1
```

**Accepted answer:** {"outcome": "yes"}

**Explanation shown:** No white piece defends the pawn on d3, so taking it with the knight wins at least 1 point.

Hints (in order):
1. Count first: how many enemy pieces defend the piece on d3?
2. A nearby piece only defends d3 if it could capture on d3 with its own kind of move. Check each one.
3. If the piece is defended, compare the value of what you take with the value of the piece you might lose.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [attackers] White pieces defending d3: 0.
- [attackers] Black pieces attacking d3: 1.
- [material_after_move] Nxd3 wins at least 1 point(s) of material.

**The failing board:**

**Task `IG-CTRST-5`** (predict_outcome, difficulty cue 2)

Black to move. Should the knight on b4 take the pawn on d3? Predict, then check.

```
  1  K . . . . . . .
  2  . P . . . . . .
  3  . . . . P . . .
  4  . . . . . . n .
  5  . . . . . . . .
  6  . B . . . . . p
  7  . . . . . . p k
  8  . . . . . . . .
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: 8/kp6/p5B1/8/1n6/3P4/6P1/7K b - - 0 1
```

**Accepted answer:** {"outcome": "no"}

**Explanation shown:** The pawn on d3 is defended once, and the knight is worth more than the pawn: after the knight takes, it is taken back, and black ends at least 2 points down along the best defence.

Hints (in order):
1. Count first: how many enemy pieces defend the piece on d3?
2. A nearby piece only defends d3 if it could capture on d3 with its own kind of move. Check each one.
3. If the piece is defended, compare the value of what you take with the value of the piece you might lose.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [attackers] White pieces defending d3: 1.
- [attackers] Black pieces attacking d3: 1.
- [material_after_move] Nxd3 loses at least 2 point(s) of material.

**The irrelevant board:**

**Task `IG-CTRST-6`** (predict_outcome, difficulty cue 2)

Black to move. Should the knight on b4 take the pawn on d3? Predict, then check.

```
  1  K . . . . . . .
  2  . P . . . . B .
  3  . . . . P . . .
  4  . . . . . . n .
  5  . . . . . . . .
  6  . . . . . . . p
  7  . . . . . . p k
  8  . . . . . . . .
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: 8/kp6/p7/8/1n6/3P4/1B4P1/7K b - - 0 1
```

**Accepted answer:** {"outcome": "yes"}

**Explanation shown:** The nearby white piece does not defend the pawn on d3: no white piece does. Taking with the knight still wins at least 1 point.

Hints (in order):
1. Count first: how many enemy pieces defend the piece on d3?
2. A nearby piece only defends d3 if it could capture on d3 with its own kind of move. Check each one.
3. If the piece is defended, compare the value of what you take with the value of the piece you might lose.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [attackers] White pieces defending d3: 0.
- [attackers] Black pieces attacking d3: 1.
- [material_after_move] Nxd3 wins at least 1 point(s) of material.

### Step 6: item  (shown without telling the learner the topic: unlabeled test)

**Task `I-CAP-002`** (predict_outcome, difficulty cue 3)

Should White take the pawn on e5 with the bishop? Predict, then check.

```
  8  . . . . k . . .
  7  . . . . . . . .
  6  . . . p . . . .
  5  . . . . p . . .
  4  . . . . . . . .
  3  . . B . . . . .
  2  . . . . . . . .
  1  . . . . K . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 4k3/8/3p4/4p3/8/2B5/8/4K3 w - - 0 1
```

**Accepted answer:** {"outcome": "no"}

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [material_after_move] (no sentence; a rules check)

### Step 7: item  (shown without telling the learner the topic: unlabeled test)

**Task `IBds11-9`** (predict_outcome, difficulty cue 3)

White to move. Should the bishop on b3 take the knight on d5? Predict, then check.

```
  8  . . . . . . k .
  7  . . . . . p p p
  6  . . . . . . . .
  5  . . b n . . . .
  4  . . . . . . . .
  3  . B . . . . . .
  2  . . . . . P P P
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 6k1/5ppp/8/2bn4/8/1B6/5PPP/6K1 w - - 0 1
```

**Accepted answer:** {"outcome": "yes"}

**Explanation shown:** The black bishop on c5 stands next to the knight but moves on diagonals of the other colour, so no black piece defends d5. Bxd5 wins at least 3 points.

Hints (in order):
1. Count first: which black pieces could capture on that square, and which white pieces attack it?
2. A nearby piece only defends a square if it can capture there with its own kind of move.
3. Compare what you take with what you could lose: a cheaper capturing piece changes the answer.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [attackers] No black piece defends d5.
- [attackers] One white piece attacks d5.
- [material_after_move] Bxd5 wins at least 3 points.

### Step 8: item  (shown without telling the learner the topic: unlabeled test)

**Task `IBds11-10`** (predict_outcome, difficulty cue 3)

White to move. Should the rook on d1 take the knight on d5? Predict, then check.

```
  8  . . . . . . k .
  7  . . . . . p p p
  6  . . p . . . . .
  5  . . . n . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . . P P P
  1  . . . R . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 6k1/5ppp/2p5/3n4/8/8/5PPP/3R2K1 w - - 0 1
```

**Accepted answer:** {"outcome": "no"}

**Explanation shown:** The pawn on c6 defends d5. After Rxd5 cxd5 White has given a rook (5) for a knight (3): at least 2 points down along the best defence.

Hints (in order):
1. Count first: which black pieces could capture on that square, and which white pieces attack it?
2. A nearby piece only defends a square if it can capture there with its own kind of move.
3. Compare what you take with what you could lose: a cheaper capturing piece changes the answer.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [attackers] The pawn on c6 defends d5.
- [attackers] One white piece attacks d5.
- [material_after_move] Rxd5 loses at least 2 points.

### Step 9: item  (shown without telling the learner the topic: unlabeled test)

**Task `IBds11-11`** (predict_outcome, difficulty cue 3)

White to move. Should the queen on d1 take the bishop on d5? Predict, then check.

```
  8  . . . r . . k .
  7  . . . . . p p p
  6  . . . . . . . .
  5  . . . b . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . . P P P
  1  . . . Q . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 3r2k1/5ppp/8/3b4/8/8/5PPP/3Q2K1 w - - 0 1
```

**Accepted answer:** {"outcome": "no"}

**Explanation shown:** The rook on d8 is far away but the d-file is open between it and d5, so it defends the bishop. Qxd5 Rxd5 loses at least 6 points.

Hints (in order):
1. Count first: which black pieces could capture on that square, and which white pieces attack it?
2. A nearby piece only defends a square if it can capture there with its own kind of move.
3. Compare what you take with what you could lose: a cheaper capturing piece changes the answer.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [attackers] The rook on d8 defends d5 along the file.
- [attackers] One white piece attacks d5.
- [material_after_move] Qxd5 loses at least 6 points.

### Step 10: item  (shown without telling the learner the topic: unlabeled test)

**Task `IBds11-12`** (predict_outcome, difficulty cue 3)

White to move. Should the pawn on e4 take the knight on d5? Predict, then check.

```
  8  . . . . . . k .
  7  . . . . . p p p
  6  . . p . . . . .
  5  . . . n . . . .
  4  . . . . P . . .
  3  . . . . . . . .
  2  . . . . . P P P
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 6k1/5ppp/2p5/3n4/4P3/8/5PPP/6K1 w - - 0 1
```

**Accepted answer:** {"outcome": "yes"}

**Explanation shown:** The knight is defended by the pawn on c6, yet exd5 cxd5 gives a pawn (1) for a knight (3): at least 2 points ahead. Defended does not always mean 'do not take'.

Hints (in order):
1. Count first: which black pieces could capture on that square, and which white pieces attack it?
2. A nearby piece only defends a square if it can capture there with its own kind of move.
3. Compare what you take with what you could lose: a cheaper capturing piece changes the answer.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [attackers] The pawn on c6 defends d5.
- [attackers] One white piece attacks d5.
- [material_after_move] exd5 wins at least 2 points.

### Step 11: practice  (shown without telling the learner the topic: unlabeled test)

A drill of 6 tasks drawn from the bank by tag ['node.FND.CAPTURE', 'cue.2'] (61 tasks carry those tags). Not reproduced here; ask for a sample if you want one checked.

### Step 12: reflect

Kind: unsure

Prompt: Which kind of nearby piece fooled you most often: a piece of the wrong colour square, a pawn straight in front, or a rook behind a blocker? Name one square where you counted a defender that was not one.

---

## Reviewer scorecard

Fill in the file `content/review/L-FND-CAPTURE-2.json` (a template is below). Scale 1 to 5 for each dimension: 1 = wrong or unusable, 3 = acceptable with edits, 5 = I would put my name to it as it stands.
Revision to review: `95071702`. If the lesson text changes after your review, your sign-off no longer applies and the lesson goes back to needs-human.

| Dimension | What to judge | Score |
|---|---|---|
| chess | every statement, line and explanation is correct; near-misses are really near-misses | |
| clarity | the explanation actually explains (mechanism, conditions), in plain words | |
| prerequisites | the lesson assumes only what the learner has met | |
| tasks | each task has one defensible answer and a fair explanation | |

```json
{
  "lesson": "L-FND-CAPTURE-2",
  "revision": "95071702",
  "reviewer": "<your name>",
  "reviewer_role": "strong-player",
  "date": "YYYY-MM-DD",
  "scores": {"chess": 0, "clarity": 0, "prerequisites": 0, "tasks": 0},
  "comments": "<what to change, by step number>",
  "verdict": "approved"
}
```

`reviewer_role` is `strong-player` or `teacher`. `verdict` is `approved` or `changes-requested`. See docs/review-slice.md.
