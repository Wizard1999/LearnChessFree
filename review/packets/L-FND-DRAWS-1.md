# Review packet: L-FND-DRAWS-1

**Ways a game is drawn**

- Skill: FND.DRAWS (D1); stage: S2; stated length: 9 minutes
- Steps: 10 (0 are tasks); revision: `f3bf6244`
- Review status now: needs-human

## What the lesson says the learner will be able to do

- Lists the ways a game can end drawn and says which can be claimed and which are automatic
- Says when a position has occurred for the third time, and what must match (same side to move, same rights)
- Counts the fifty-move clock and says what resets it (a capture or a pawn move, not a check)

## Sources the author names (check that they are used fairly, in our own words)

- docs/first-hours.md session 3 (draws)
- content/skills/FND.DRAWS.json (D1 outcome, conditions, misconceptions)
- the board lines are legal move by move (checked by tools/validate_lessons.py); the repetition and clock answers are rules arithmetic, checked once by script with python-chess when written, not by a claim type
- split from the former combined lesson 'Ways a game is drawn' (D24, one building block per lesson); insufficient material is taught in L-FND-DRAWS-2

## How to read this packet

Boards are drawn with capitals for White and lower case for Black, rank 8 at the top unless the board is shown from Black's side. Moves in a line are in standard notation. Statements marked [V] were machine-checked, [I] inference, [H] hypothesis, [S] secondary source, [R] recalled. Please judge the explanations, not only the moves: does each sentence tell the learner why?

---

### Step 1: card

A game ends drawn in five ways. **Stalemate** (see the lesson *Stalemate: no move, but no check*): automatic. **Not enough pieces** to mate: automatic. **Agreement:** both players say yes. **Repetition** and the **fifty-move rule:** a player must claim them. This lesson covers the last two. **Checked by you, not by the app.** The app has no check for them, so you see the answers after you save.

### Step 2: reflect

Kind: expect

Prompt: From memory: which of the five can a player claim, and which end the game by themselves? Write it down, then compare with the card above.

- Field "Number of ways that need a claim:" (free text)

### Step 3: board

Caption: White shuffles the rook; Black shuffles the king. Count how often this starting position comes back.

```
  8  . . . . k . . .
  7  . . . . . . . .
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  R . . . K . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 4k3/8/8/8/8/8/8/R3K3 w - - 0 1
```

The line, with the sentence the learner sees at each move:
1. **1. Ra2**: White moves the rook.
2. **1... Kd8**: Black moves the king.
3. **2. Ra1**: The rook goes home.
4. **2... Ke8**: Position 1 again, White to move: second time.
5. **3. Ra2**: Same moves again.
6. **3... Kd8**: Black repeats.
7. **4. Ra1**: Rook home.
8. **4... Ke8**: Third time. White may claim a draw.

```
  8  . . . . k . . .
  7  . . . . . . . .
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  R . . . K . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 4k3/8/8/8/8/8/8/R3K3 w - - 8 5
```

### Step 4: reflect

Kind: expect

Prompt: **Checked by you, not by the app.** Paper exercise. In the line above, count how many times the starting position has occurred after the last move (counting the start itself).

- Field "Times it has occurred:" (free text)

### Step 5: card

The position must match in three things: the piece placement, **the side to move**, and the rights (castling and en passant). The three occurrences need not follow one another and need not be in a row.

### Step 6: board

Caption: The same pieces can stand on the same squares with the other side to move.

```
  8  . . . . k . . .
  7  . . . . . . . .
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  R . . . K . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 4k3/8/8/8/8/8/8/R3K3 w - - 0 1
```

The line, with the sentence the learner sees at each move:
1. **1. Ra2**: Rook to a2.
2. **1... Kd8**: King to d8.
3. **2. Ra3**: Rook to a3.
4. **2... Ke8**: King back to e8.
5. **3. Ra1**: Rook back to a1: the pieces stand as at the start, but now Black is to move.

```
  8  . . . . k . . .
  7  . . . . . . . .
  6  . . . . . . . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  R . . . K . . .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 4k3/8/8/8/8/8/8/R3K3 b - - 5 3
```

### Step 7: reflect

Kind: expect

Prompt: **Checked by you, not by the app.** Paper exercise. After the last move, how many times has the exact starting position occurred (White to move)? How many times have the pieces stood on those squares, whoever was to move?

- Field "Exact starting position (same side to move):" (free text)

- Field "Same squares, any side to move:" (free text)

### Step 8: board

Caption: The clock counts half-moves: each move by either side adds one. It shows 40 without a capture or pawn move.

```
  8  . . . . k . . .
  7  . . . . . . . .
  6  . . . . . . . .
  5  . . . n . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  R . . . K . . .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 4k3/8/8/3n4/8/8/8/R3K3 w - - 40 60
```

The line, with the sentence the learner sees at each move:
1. **60. Ra5**: Clock 41.
2. **60... Nc3**: Clock 42.
3. **61. Rc5**: Clock 43.
4. **61... Nd5**: Clock 44.
5. **62. Rxd5**: A capture: the clock goes back to 0.
6. **62... Ke7**: Clock 1.
7. **63. Ra5**: Clock 2.
8. **63... Kf6**: Clock 3.
9. **64. Ra6+**: This move gives check.

```
  8  . . . . . . . .
  7  . . . . . . . .
  6  R . . . . k . .
  5  . . . . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  . . . . . . . .
  1  . . . . K . . .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 8/8/R4k2/8/8/8/8/4K3 b - - 4 64
```

### Step 9: reflect

Kind: expect

Prompt: **Checked by you, not by the app.** Paper exercise. What does the clock show after the last move, which is a check? A draw can be claimed when the clock reaches 100 half-moves; how many more half-moves without a capture or pawn move would be needed from there?

- Field "Clock after the check:" (free text)

- Field "Half-moves still needed to reach 100:" (free text)

### Step 10: reflect

Kind: confidence

Prompt: Which was harder to keep straight: the side to move in a repetition, or what resets the fifty-move clock? Rate how sure you are of both rules. (low / medium / high)

---

## Reviewer scorecard

Fill in the file `content/review/L-FND-DRAWS-1.json` (a template is below). Scale 1 to 5 for each dimension: 1 = wrong or unusable, 3 = acceptable with edits, 5 = I would put my name to it as it stands.
Revision to review: `f3bf6244`. If the lesson text changes after your review, your sign-off no longer applies and the lesson goes back to needs-human.

| Dimension | What to judge | Score |
|---|---|---|
| chess | every statement, line and explanation is correct; near-misses are really near-misses | |
| clarity | the explanation actually explains (mechanism, conditions), in plain words | |
| prerequisites | the lesson assumes only what the learner has met | |
| tasks | each task has one defensible answer and a fair explanation | |

```json
{
  "lesson": "L-FND-DRAWS-1",
  "revision": "f3bf6244",
  "reviewer": "<your name>",
  "reviewer_role": "strong-player",
  "date": "YYYY-MM-DD",
  "scores": {"chess": 0, "clarity": 0, "prerequisites": 0, "tasks": 0},
  "comments": "<what to change, by step number>",
  "verdict": "approved"
}
```

`reviewer_role` is `strong-player` or `teacher`. `verdict` is `approved` or `changes-requested`. See docs/review-slice.md.
