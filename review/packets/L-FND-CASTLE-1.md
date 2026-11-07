# Review packet: L-FND-CASTLE-1

**Castling, and when you cannot**

- Skill: FND.CASTLE (D1); stage: S1; stated length: 8 minutes
- Steps: 10 (6 are tasks); revision: `a42546ca`
- Review status now: needs-human

## What the lesson says the learner will be able to do

- Castles kingside and queenside
- Knows the four conditions and which attacked squares matter
- Spots when castling is not available

## Sources the author names (check that they are used fairly, in our own words)

- docs/first-hours.md session 3
- docs/council-synthesis.md CD-1, CD-4

## How to read this packet

Boards are drawn with capitals for White and lower case for Black, rank 8 at the top unless the board is shown from Black's side. Moves in a line are in standard notation. Statements marked [V] were machine-checked, [I] inference, [H] hypothesis, [S] secondary source, [R] recalled. Please judge the explanations, not only the moves: does each sentence tell the learner why?

---

### Step 1: card

**Castling** is the one move where two pieces move at once. The king goes two squares toward a rook, and that rook jumps over to the king's other side. It tucks the king away and brings a rook into the game. You can castle toward the h-file (kingside) or toward the a-file (queenside).

### Step 2: board

Caption: White castles kingside: the king goes to g1 and the rook to f1. Black castles queenside.

```
  8  r . . . k . . r
  7  . . . . . . . .
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  R . . . K . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1
```

The line, with the sentence the learner sees at each move:
1. **1. O-O**: The king goes to g1 and the rook jumps to f1.
2. **1... O-O-O**: Black castles the other way: king to c8, rook to d8.

```
  8  . . k r . . . r
  7  . . . . . . . .
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  R . . . . R K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 2kr3r/8/8/8/8/8/8/R4RK1 w - - 2 2
```

Drawn on the board: arrows e1-g1, h1-f1; highlighted squares g1, f1.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] (no sentence; a rules check)
- [legal_move] (no sentence; a rules check)

### Step 3: item

**Task `IA0-78`** (find_move, difficulty cue 1)

Castle kingside.

```
  8  r . . . k . . r
  7  . . . . . . . .
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  R . . . K . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1
```

**Accepted answer(s):** O-O

**Explanation shown:** The king goes two squares toward the rook on h1, to g1, and the rook jumps to f1. Everything between the king and the rook is empty, and the king has never moved.

Hints (in order):
1. Castling is a king move. Which way is kingside, toward the h-file?
2. The king moves two squares toward the rook.
3. Move the king from e1 to g1; the rook follows.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] White can castle kingside.
- [legal_move] White can castle queenside.

### Step 4: card

You may castle only if: the king and that rook have never moved; every square between them is empty; the king is not in check; and the king does not pass over or land on an attacked square. The rook's own path does not have to be safe.

### Step 5: contrast

Title: Same castle, a rook arrives

Prompt: A black rook lands on f3. Predict first: can White still castle kingside?

**The working board:**

**Task `IA0-79`** (predict_outcome, difficulty cue 2)

Only a white king and rook stand on their starting squares, with nothing in between. Can White castle kingside? Predict, then check.

```
  8  . . . . k . . .
  7  . . . . . . . .
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  . . . . K . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 4k3/8/8/8/8/8/8/4K2R w K - 0 1
```

**Accepted answer:** {"outcome": "yes"}

**Explanation shown:** All four conditions are met: the king and the rook have not moved, f1 and g1 are empty, the king is not in check, and nothing attacks f1 or g1.

Hints (in order):
1. Have the king and rook moved? Are the squares between them empty?
2. Does any black piece attack the squares the king passes over and lands on?

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] White can castle kingside.
- [attackers] Nothing attacks f1.
- [attackers] Nothing attacks g1.

**The failing board:**

**Task `IA0-80`** (predict_outcome, difficulty cue 3)

A black rook stands on f3. Can White castle kingside? Predict, then check.

```
  8  . . . . k . . .
  7  . . . . . . . .
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . r . .
  2  . . . . . . . .
  1  . . . . K . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 4k3/8/8/8/8/5r2/8/4K2R w K - 0 1
```

**Accepted answer:** {"outcome": "no"}

**Explanation shown:** The king would pass over f1 on its way to g1, and the rook on f3 attacks f1. The king may not cross an attacked square, so castling is not allowed here.

Hints (in order):
1. Castling moves the king across the square next to it. Which square is that here?
2. Does any black piece attack that square?
3. The rook on f3 looks down the f-file at f1.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [illegal_move] White cannot castle kingside.
- [attackers] The black rook attacks f1, the square the king would pass over.

**The irrelevant board:**

**Task `IA0-81`** (predict_outcome, difficulty cue 3)

A black rook stands on b8 and attacks b1. Can White castle queenside? Predict, then check.

```
  8  . r . . k . . .
  7  . . . . . . . .
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  R . . . K . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 1r2k3/8/8/8/8/8/8/R3K3 w Q - 0 1
```

**Accepted answer:** {"outcome": "yes"}

**Explanation shown:** The king only travels over d1 and lands on c1, and neither is attacked. The rook crosses b1, but only the king's squares have to be safe, so White can castle.

Hints (in order):
1. Which squares does the king pass over and land on? It goes e1, d1, c1.
2. Is b1 one of them? Only the rook crosses b1.
3. Check whether d1 and c1 are attacked.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] White can castle queenside.
- [attackers] The black rook attacks b1.
- [attackers] d1 is not attacked.
- [attackers] c1 is not attacked.

### Step 6: item

**Task `IA0-82`** (predict_outcome, difficulty cue 3)

A black rook gives check along the e-file. Can White castle? Predict, then check.

```
  8  . . . . r . k .
  7  . . . . . . . .
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  R . . . K . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 4r1k1/8/8/8/8/8/8/R3K2R w KQ - 0 1
```

**Accepted answer:** {"outcome": "no"}

**Explanation shown:** You cannot castle out of check. The king must move, or the check must be blocked or captured.

Hints (in order):
1. Is White's king attacked right now?
2. You must get out of check, and castling is not one of the three ways.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [game_state] White is in check.
- [illegal_move] Castling kingside is not allowed.
- [illegal_move] Castling queenside is not allowed.

### Step 7: item

**Task `IA0-83`** (predict_outcome, difficulty cue 3)

White's king moved earlier in this game and has come back to e1. Both rooks are on their squares and the squares between are empty. Can White castle? Predict, then check.

```
  8  r . . . k . . r
  7  . . . . . . . .
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  R . . . K . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: r3k2r/8/8/8/8/8/8/R3K2R w kq - 0 1
```

**Accepted answer:** {"outcome": "no"}

**Explanation shown:** Once the king has moved, castling is gone for the rest of the game, even if the king comes home. The same is true of a rook that has moved: that side is lost.

Hints (in order):
1. Castling needs the king and the rook to have never moved.
2. Did White's king ever move?

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [illegal_move] White cannot castle kingside.
- [illegal_move] White cannot castle queenside.

### Step 8: item

**Task `IA0-84`** (find_move, difficulty cue 3)

White wants to castle. Which castling move can White play here?

```
  8  r . . . k . . r
  7  . . . . . . . .
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  R N . . K . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: r3k2r/8/8/8/8/8/8/RN2K2R w KQkq - 0 1
```

**Accepted answer(s):** O-O

**Explanation shown:** The knight on b1 stands between the king and the queenside rook, so only kingside castling is possible.

Hints (in order):
1. Check each side: the squares between the king and the rook must be empty.
2. Look at b1, c1 and d1.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [legal_move] Kingside castling is legal.
- [illegal_move] Queenside castling is not legal.

### Step 9: practice

A drill of 6 tasks drawn from the bank by tag ['node.FND.CASTLE', 'kind.generated'] (32 tasks carry those tags). Not reproduced here; ask for a sample if you want one checked.

### Step 10: reflect

Kind: confidence

Prompt: Which castling condition would you check last in a real game: moved pieces, empty squares, check, or attacked squares?

---

## Reviewer scorecard

Fill in the file `content/review/L-FND-CASTLE-1.json` (a template is below). Scale 1 to 5 for each dimension: 1 = wrong or unusable, 3 = acceptable with edits, 5 = I would put my name to it as it stands.
Revision to review: `a42546ca`. If the lesson text changes after your review, your sign-off no longer applies and the lesson goes back to needs-human.

| Dimension | What to judge | Score |
|---|---|---|
| chess | every statement, line and explanation is correct; near-misses are really near-misses | |
| clarity | the explanation actually explains (mechanism, conditions), in plain words | |
| prerequisites | the lesson assumes only what the learner has met | |
| tasks | each task has one defensible answer and a fair explanation | |

```json
{
  "lesson": "L-FND-CASTLE-1",
  "revision": "a42546ca",
  "reviewer": "<your name>",
  "reviewer_role": "strong-player",
  "date": "YYYY-MM-DD",
  "scores": {"chess": 0, "clarity": 0, "prerequisites": 0, "tasks": 0},
  "comments": "<what to change, by step number>",
  "verdict": "approved"
}
```

`reviewer_role` is `strong-player` or `teacher`. `verdict` is `approved` or `changes-requested`. See docs/review-slice.md.
