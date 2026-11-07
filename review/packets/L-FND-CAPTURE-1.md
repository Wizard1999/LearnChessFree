# Review packet: L-FND-CAPTURE-1

**Taking pieces: is the capture safe?**

- Skill: FND.CAPTURE (D1); stage: S1; stated length: 9 minutes
- Steps: 11 (6 are tasks); revision: `8441ffc2`
- Review status now: needs-human

## What the lesson says the learner will be able to do

- Finds a capture that wins an undefended piece
- Checks whether the target is defended before taking
- Knows that a capture is never forced and that a king cannot be captured

## Sources the author names (check that they are used fairly, in our own words)

- docs/first-hours.md session 2
- docs/council-synthesis.md CD-1, CD-4
- sources/sheets/edlasker_chess-strategy.md (values are conditional)
- sources/sheets/capablanca_chess-fundamentals.md
- content/lessons/L-FND-CAPTURE-1.json (earlier combined lesson, split by D24)

## How to read this packet

Boards are drawn with capitals for White and lower case for Black, rank 8 at the top unless the board is shown from Black's side. Moves in a line are in standard notation. Statements marked [V] were machine-checked, [I] inference, [H] hypothesis, [S] secondary source, [R] recalled. Please judge the explanations, not only the moves: does each sentence tell the learner why?

---

### Step 1: card

You **capture** by moving onto an enemy piece and taking it off the board. A piece is **attacked** when the enemy could capture it next move. Captures are never forced, and a king is never captured: the game ends first, when the king is checkmated (a later lesson explains how). Look at the target first. A queen has a higher counting value than a rook, bishop or knight, and each of those more than a pawn; the exact numbers come in a later lesson.

### Step 2: board

Caption: The bishop takes a knight that nothing defends. Black cannot take back, so White has simply won a piece.

```
  8  . . . . . . k .
  7  p . . . . p p p
  6  . . . . . . . .
  5  . . . . n . . .
  4  . . . . . . . .
  3  . . B . . . . .
  2  P . . . . P P P
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 6k1/p4ppp/8/4n3/8/2B5/P4PPP/6K1 w - - 0 1
```

The line, with the sentence the learner sees at each move:
1. **1. Bxe5**: The bishop takes the knight on e5.
2. **1... g6**: Black has no piece that can take the bishop back.

```
  8  . . . . . . k .
  7  p . . . . p . p
  6  . . . . . . p .
  5  . . . . B . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  P . . . . P P P
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 6k1/p4p1p/6p1/4B3/8/8/P4PPP/6K1 w - - 0 2
```

Drawn on the board: arrows c3-e5; highlighted squares e5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [material_after_move] (no sentence; a rules check)
- [attackers] (no sentence; a rules check)

### Step 3: item

**Task `IA0-48`** (find_move, difficulty cue 1)

White to move. One black piece can be captured for free. Find the move.

```
  8  . . . . . . k .
  7  . . . . . p p p
  6  . . . b . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . . P P P
  1  . . . R . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 6k1/5ppp/3b4/8/8/8/5PPP/3R2K1 w - - 0 1
```

**Accepted answer(s):** Rxd6

**Explanation shown:** Nothing guards the bishop on d6, so the rook takes it and cannot be taken back: White wins 3 points.

Hints (in order):
1. Which black pieces can a white piece capture?
2. A capture is free when nothing can recapture. Which black piece has no defender?
3. The rook on the d-file can take the bishop on d6.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [material_after_move] Rxd6 wins the bishop and White keeps the rook.
- [attackers] No black piece defends the bishop.

### Step 4: item

**Task `IA0-49`** (predict_outcome, difficulty cue 2)

Should White take the knight on e5 with the bishop? Predict, then check.

```
  8  . . . . . . k .
  7  p . . . . p p p
  6  . . . . . . . .
  5  . . . . n . . .
  4  . . . . . . . .
  3  . . B . . . . .
  2  P . . . . P P P
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 6k1/p4ppp/8/4n3/8/2B5/P4PPP/6K1 w - - 0 1
```

**Accepted answer:** {"outcome": "yes"}

**Explanation shown:** Nothing defends the knight, so Black cannot recapture. White wins a whole knight (3 points) for nothing.

Hints (in order):
1. Can White capture the knight at all?
2. After the capture, could Black capture the bishop back?

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [material_after_move] Bxe5 wins the knight and White keeps the bishop.
- [attackers] No black piece guards e5.

### Step 5: card

Before you take, ask: **is the piece defended?** A piece is defended when a friend could take back on that square. If it is not defended, it is a *loose* piece and the capture is free. If it is defended, you may lose the piece you capture with, so compare what you win with what you can lose back.

### Step 6: contrast

Title: Same capture, one change

Prompt: The queen on d4 could take the knight on b6. Predict first, then check. In the second position a pawn defends the knight; in the third a pawn stands nearby but defends nothing.

**The working board:**

**Task `IG-CTRST-7`** (predict_outcome, difficulty cue 2)

White to move. Should the queen on d4 take the knight on b6? Predict, then check.

```
  8  . . . . . . . .
  7  . . . . . . . .
  6  . n . . . . . .
  5  . . . . . . . K
  4  . . . Q . . P .
  3  k . . . . . . .
  2  . . . . . . . .
  1  . . . . . . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 8/8/1n6/7K/3Q2P1/k7/8/8 w - - 0 1
```

**Accepted answer:** {"outcome": "yes"}

**Explanation shown:** No black piece defends the knight on b6, so taking it with the queen wins at least 3 points.

Hints (in order):
1. Count first: how many enemy pieces defend the piece on b6?
2. A nearby piece only defends b6 if it could capture on b6 with its own kind of move. Check each one.
3. If the piece is defended, compare the value of what you take with the value of the piece you might lose.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [attackers] Black pieces defending b6: 0.
- [attackers] White pieces attacking b6: 1.
- [material_after_move] Qxb6 wins at least 3 point(s) of material.

**The failing board:**

**Task `IG-CTRST-8`** (predict_outcome, difficulty cue 2)

White to move. Should the queen on d4 take the knight on b6? Predict, then check.

```
  8  . . . . . . . .
  7  p . . . . . . .
  6  . n . . . . . .
  5  . . . . . . . K
  4  . . . Q . . P .
  3  k . . . . . . .
  2  . . . . . . . .
  1  . . . . . . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 8/p7/1n6/7K/3Q2P1/k7/8/8 w - - 0 1
```

**Accepted answer:** {"outcome": "no"}

**Explanation shown:** The knight on b6 is defended once, and the queen is worth more than the knight: after the queen takes, it is taken back, and white ends at least 6 points down along the best defence.

Hints (in order):
1. Count first: how many enemy pieces defend the piece on b6?
2. A nearby piece only defends b6 if it could capture on b6 with its own kind of move. Check each one.
3. If the piece is defended, compare the value of what you take with the value of the piece you might lose.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [attackers] Black pieces defending b6: 1.
- [attackers] White pieces attacking b6: 1.
- [material_after_move] Qxb6 loses at least 6 point(s) of material.

**The irrelevant board:**

**Task `IG-CTRST-9`** (predict_outcome, difficulty cue 2)

White to move. Should the queen on d4 take the knight on b6? Predict, then check.

```
  8  . . . . . . . .
  7  . . . . . . . .
  6  . n . . . . . .
  5  . p . . . . . K
  4  . . . Q . . P .
  3  k . . . . . . .
  2  . . . . . . . .
  1  . . . . . . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 8/8/1n6/1p5K/3Q2P1/k7/8/8 w - - 0 1
```

**Accepted answer:** {"outcome": "yes"}

**Explanation shown:** The nearby black piece does not defend the knight on b6: no black piece does. Taking with the queen still wins at least 3 points.

Hints (in order):
1. Count first: how many enemy pieces defend the piece on b6?
2. A nearby piece only defends b6 if it could capture on b6 with its own kind of move. Check each one.
3. If the piece is defended, compare the value of what you take with the value of the piece you might lose.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [attackers] Black pieces defending b6: 0.
- [attackers] White pieces attacking b6: 1.
- [material_after_move] Qxb6 wins at least 3 point(s) of material.

### Step 7: card

**When it holds.** A capture is free when the target is loose. It can also pay when the target is worth more than the piece you may lose (*rule of thumb*; a later lesson counts the points). **When it fails.** A defended target taken with a piece worth more than the target loses material. You may always decline, and a nearby piece that cannot capture on the square does not defend it.

### Step 8: item  (shown without telling the learner the topic: unlabeled test)

**Task `IA0-50`** (predict_outcome, difficulty cue 3)

The same bishop can take a pawn on e5. Should White take it? Predict, then check.

```
  8  . . . . . . k .
  7  p . . . . p p p
  6  . . . p . . . .
  5  . . . . p . . .
  4  . . . . . . . .
  3  . . B . . . . .
  2  P . . . . P P P
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 6k1/p4ppp/3p4/4p3/8/2B5/P4PPP/6K1 w - - 0 1
```

**Accepted answer:** {"outcome": "no"}

**Explanation shown:** The pawn on d6 guards e5. After Bxe5 dxe5, White has traded a bishop (3 points) for a pawn (1 point): White is 2 points behind.

Hints (in order):
1. Can White capture the pawn? Yes. So ask the second question: what happens next?
2. Which black piece could take the bishop back on e5?
3. The pawn on d6 guards e5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [material_after_move] Bxe5 loses the bishop for a pawn.
- [attackers] The pawn on d6 guards e5.

### Step 9: item  (shown without telling the learner the topic: unlabeled test)

**Task `IA0-53`** (classify_position, difficulty cue 3)

White thinks about taking the pawn on e5 with the knight. After the captures, what has happened to White's points?

```
  8  . . . . . . k .
  7  p . . . . p p .
  6  . . . . . . . p
  5  . . . . p . . .
  4  . . . . . . . .
  3  . . . . . N . .
  2  P . . . . . P P
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 6k1/p4pp1/7p/4p3/8/5N2/P5PP/6K1 w - - 0 1
```

**Accepted answer:** {"class": "White gains material"}

**Explanation shown:** Nothing guards the pawn on e5, so White simply wins it.

Hints (in order):
1. Is the pawn guarded?
2. If nothing can recapture, what does White gain?

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [material_after_move] Nxe5 wins at least a pawn.
- [attackers] No black piece guards e5.

### Step 10: practice  (shown without telling the learner the topic: unlabeled test)

A drill of 6 tasks drawn from the bank by tag ['node.FND.CAPTURE', 'kind.generated'] (100 tasks carry those tags). Not reproduced here; ask for a sample if you want one checked.

### Step 11: reflect

Kind: expect

Prompt: Before answering each 'take it or not' question: what did you check first, and in what order?

---

## Reviewer scorecard

Fill in the file `content/review/L-FND-CAPTURE-1.json` (a template is below). Scale 1 to 5 for each dimension: 1 = wrong or unusable, 3 = acceptable with edits, 5 = I would put my name to it as it stands.
Revision to review: `8441ffc2`. If the lesson text changes after your review, your sign-off no longer applies and the lesson goes back to needs-human.

| Dimension | What to judge | Score |
|---|---|---|
| chess | every statement, line and explanation is correct; near-misses are really near-misses | |
| clarity | the explanation actually explains (mechanism, conditions), in plain words | |
| prerequisites | the lesson assumes only what the learner has met | |
| tasks | each task has one defensible answer and a fair explanation | |

```json
{
  "lesson": "L-FND-CAPTURE-1",
  "revision": "8441ffc2",
  "reviewer": "<your name>",
  "reviewer_role": "strong-player",
  "date": "YYYY-MM-DD",
  "scores": {"chess": 0, "clarity": 0, "prerequisites": 0, "tasks": 0},
  "comments": "<what to change, by step number>",
  "verdict": "approved"
}
```

`reviewer_role` is `strong-player` or `teacher`. `verdict` is `approved` or `changes-requested`. See docs/review-slice.md.
