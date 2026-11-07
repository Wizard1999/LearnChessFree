# Review packet: L-PRA-CLOCK-1

**The clock is a budget**

- Skill: PRA.CLOCK (D1); stage: S2; stated length: 10 minutes
- Steps: 9 (2 are tasks); revision: `c38d987f`
- Review status now: needs-human

## What the lesson says the learner will be able to do

- Reads a time control such as 10+5 and works out total time and average time per move
- Plans a reserve and a per-move average
- Tells forced, equal-choice and tempting-move positions apart
- Writes a time plan before a game and compares it afterwards

## Sources the author names (check that they are used fairly, in our own words)

- docs/curriculum-map-v1.md S10 (PRA.CLOCK, PRA.BUDGET)
- docs/council-synthesis.md CD-14 (clock literacy; Heisman and Rowson on time use, recalled [R])
- arithmetic checked in the build script; positions: Lichess puzzles and games (CC0)

## How to read this packet

Boards are drawn with capitals for White and lower case for Black, rank 8 at the top unless the board is shown from Black's side. Moves in a line are in standard notation. Statements marked [V] were machine-checked, [I] inference, [H] hypothesis, [S] secondary source, [R] recalled. Please judge the explanations, not only the moves: does each sentence tell the learner why?

---

### Step 1: card

A time control such as **10+5** gives each player 10 minutes at the start and adds 5 seconds after every move that player makes (the *increment*). If your clock reaches zero you usually lose the game on time.
Time is a budget: **average time per move = time you have ÷ moves still to play.**

### Step 2: reflect

Kind: expect

Prompt: Work these out before you read on. Time control 10+5, and you play 40 moves. How many seconds do you have in total, and how many seconds per move on average?

- Field "Total seconds available:" (free text)

- Field "Average seconds per move:" (free text)

### Step 3: card

**Answers:** 10 minutes is 600 seconds. Increment: 40 × 5 = 200 seconds. Total 800 seconds, which is 20 seconds per move.
An average hides the point: **spend by position type.** Next you judge three kinds: one legal move, many moves about equal, and a position where a tempting move loses a lot.

### Step 4: contrast

Title: Where should the time go?

Prompt: Each position comes with 2:40 on the clock. Say what kind of position it is, then check. Think about how much clock each deserves.

**The working board:**

**Task `IA5-47`** (classify_position, difficulty cue 2)

You have 2:40 left and no increment. Black to move. What kind of position is this?

```
  1  . K R . Q . . R
  2  . . P . . . P .
  3  P . N B P P . P
  4  . . . P . B . .
  5  . P . p . . . .
  6  p b q . p n . p
  7  . p p . . p p b
  8  . k r . . . . r
     h g f e d c b a

Black to move. Capitals = White, lower case = Black.
FEN: r4rk1/bpp2pp1/p1np1qbp/4p1P1/2B1P3/P1PPBN1P/1P3P2/R2Q1RK1 b - - 0 14
```

**Accepted answer:** {"class": "a tempting move loses a lot"}

**Explanation shown:** The pawn capture hxg5 looks free but loses material by force, so one tempting move here is much worse than the sensible ones. This is the kind of moment to spend clock on.

Hints (in order):
1. Is there a capture that looks free?
2. Check what White can do after you take.
3. The pawn on g5 can be taken, and that capture is the costly mistake.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [move_loses] The capture hxg5 is far worse than the best move.
- [best_move_in] The engine's best move is Qd8 or Qe7.

**The failing board:**

**Task `IA5-46`** (classify_position, difficulty cue 2)

You have 2:40 left and no increment. White to move. What kind of position is this?

```
  8  r . b . r . k .
  7  . p q . . p p p
  6  p . n b p n . .
  5  . . . p . . . .
  4  Q . . P . . . .
  3  P . N . P N P .
  2  . P . B B P . P
  1  R . . . . R K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: r1b1r1k1/1pq2ppp/p1nbpn2/3p4/Q2P4/P1N1PNP1/1P1BBP1P/R4RK1 w - - 3 13
```

**Accepted answer:** {"class": "many moves are about equal"}

**Explanation shown:** No forcing line wins material and three sensible moves are within 40 centipawns of each other. A long think here has little to find; a short think is enough.

Hints (in order):
1. Look for a capture or a check that changes the material.
2. If you find none, ask how different the sensible moves really are.
3. Three different plans score within a fraction of a pawn.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] The engine's best move is one of three moves that are all within 40 centipawns of it.
- [quiet_position] No line wins more than a pawn for White.

**The irrelevant board:**

**Task `IA5-45`** (classify_position, difficulty cue 2)

You have 2:40 left and no increment. White to move. What kind of position is this? (Decide how much of your remaining time it deserves.)

```
  8  . . k r . . n r
  7  p p . . . p . p
  6  . . p . p . . .
  5  . . . . . . p .
  4  . . . . P . . .
  3  . Q N . . P . .
  2  P P . q K . P P
  1  . . . . . . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 2kr2nr/pp3p1p/2p1p3/6p1/4P3/1QN2P2/PP1qK1PP/7R w - - 3 22
```

**Accepted answer:** {"class": "only one legal move"}

**Explanation shown:** White has exactly one legal move, Kf1. A forced move deserves almost none of your clock; the time is better saved for the positions below.

Hints (in order):
1. Count White's legal moves.
2. Can anything capture the checking queen, or block, or can the king go anywhere else?
3. Only one square is available to the king.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [game_state] White is in check.
- [legal_moves_set] White has exactly one legal move.

### Step 5: card

**A budget with a reserve.** Keep some time for the end. Example: 5+0, reserve 60 seconds, 35 moves to play: (300 − 60) ÷ 35 is about 6.9 seconds per move. Forced moves can cost a second or two and bank time for the hard ones. These numbers are a first guess to test in your own games, not a law.

### Step 6: reflect

Kind: expect

Prompt: Two more sums. (1) Control 5+0, reserve 60 seconds, 35 moves: average seconds per move, to one decimal? (2) Control 3+2: how many seconds of increment have you gained after 30 moves?

- Field "Average seconds per move:" (free text)

- Field "Seconds of increment gained:" (free text)

### Step 7: card

**What the app does for you now, and when it stops.** Right now the app gives you the average and names the position types. From the next item on it gives nothing: you decide how much clock the position deserves. A time-per-move record and a post-game summary are planned; if they are built they will be shown to you and not scored.

### Step 8: item  (shown without telling the learner the topic: unlabeled test)

**Task `IA5-48`** (classify_position, difficulty cue 3)

You have 1:50 left and no increment. White to move. What kind of position is this?

```
  8  r . b q k b . r
  7  p p p . p p . .
  6  . . . . . . . p
  5  . . . p n . p n
  4  . . . P . . . B
  3  . . N . P . . .
  2  P P P . . P P P
  1  R . . Q K B . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: r1bqkb1r/ppp1pp2/7p/3pn1pn/3P3B/2N1P3/PPP2PPP/R2QKB1R w KQkq - 0 9
```

**Accepted answer:** {"class": "a tempting move loses a lot"}

**Explanation shown:** Qxh5 wins a knight on the surface, but Bg4 traps the queen. A tempting capture with a hidden reply is the sign of a moment worth spending time on.

Hints (in order):
1. Is there a capture that looks free?
2. Check what Black can answer with a bishop move.
3. The knight on h5 can be taken; that capture is the costly mistake.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [move_loses] The capture Qxh5 is far worse than the best move.
- [best_move_in] dxe5 is the engine's best move.

### Step 9: reflect

Kind: plan

Prompt: Write a time plan for your next game before you start. After the game, compare the plan with what really happened; the gap is the information.

- Field "Time control:" (free text)

- Field "Moves I expect to play:" (free text)

- Field "Seconds I keep in reserve:" (free text)

- Field "Average seconds per move that leaves:" (free text)

- Field "After the game: where did my time actually go?" (free text)

---

## Reviewer scorecard

Fill in the file `content/review/L-PRA-CLOCK-1.json` (a template is below). Scale 1 to 5 for each dimension: 1 = wrong or unusable, 3 = acceptable with edits, 5 = I would put my name to it as it stands.
Revision to review: `c38d987f`. If the lesson text changes after your review, your sign-off no longer applies and the lesson goes back to needs-human.

| Dimension | What to judge | Score |
|---|---|---|
| chess | every statement, line and explanation is correct; near-misses are really near-misses | |
| clarity | the explanation actually explains (mechanism, conditions), in plain words | |
| prerequisites | the lesson assumes only what the learner has met | |
| tasks | each task has one defensible answer and a fair explanation | |

```json
{
  "lesson": "L-PRA-CLOCK-1",
  "revision": "c38d987f",
  "reviewer": "<your name>",
  "reviewer_role": "strong-player",
  "date": "YYYY-MM-DD",
  "scores": {"chess": 0, "clarity": 0, "prerequisites": 0, "tasks": 0},
  "comments": "<what to change, by step number>",
  "verdict": "approved"
}
```

`reviewer_role` is `strong-player` or `teacher`. `verdict` is `approved` or `changes-requested`. See docs/review-slice.md.
