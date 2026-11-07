# Review packet: L-SELF-1-1

**Observe: one unsure moment, and what you actually saw**

- Skill: SELF.1 (D1); stage: S2; stated length: 9 minutes
- Steps: 7 (3 are tasks); revision: `85904e24`
- Review status now: needs-human

## What the lesson says the learner will be able to do

- Separates an observation (what you can point to) from a guess (a prediction or judgment)
- Knows that some guesses can be tested
- Writes down one unsure moment per game

## Sources the author names (check that they are used fairly, in our own words)

- docs/curriculum-map-v1.md S11 (SELF.1 observe)
- docs/council-synthesis.md CD-11, CD-12 (observe before judging; Botvinnik, Dvoretsky, Rowson recalled [R]); Guardian study ch. 18, 23 (user's document: noticing uncertainty; observation versus explanation)
- positions: Lichess 2013-01 games (CC0)

## How to read this packet

Boards are drawn with capitals for White and lower case for Black, rank 8 at the top unless the board is shown from Black's side. Moves in a line are in standard notation. Statements marked [V] were machine-checked, [I] inference, [H] hypothesis, [S] secondary source, [R] recalled. Please judge the explanations, not only the moves: does each sentence tell the learner why?

---

### Step 1: card

**Observe** before you judge. An **observation** is something you can point to on the board or the clock: 'my queen is attacked by a knight', 'I had two minutes left'. A **guess** is a prediction or a judgment: 'I am lost', 'he will win my pawn'. Guesses are fine. Label them, and test the ones that can be tested.

### Step 2: item

**Task `IA5-52`** (classify_position, difficulty cue 1)

After the game a player wrote: 'The knight on d4 attacks my queen on f3.' Is that an observation or a guess?

```
  8  r . . q k . . r
  7  p p p . b p p p
  6  . . . p . n . .
  5  . . . . p . . .
  4  . . B n P . . .
  3  P . N P . Q . P
  2  . P P . . P P .
  1  R . B . K . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: r2qk2r/ppp1bppp/3p1n2/4p3/2BnP3/P1NP1Q1P/1PP2PP1/R1B1K2R w KQkq - 1 9
```

**Accepted answer:** {"class": "observation"}

**Explanation shown:** It is an observation: you can point at the board and count. One Black piece (the knight) attacks f3, and one White piece (the g2 pawn) defends it.

Hints (in order):
1. Can you point to something on the board that settles it?
2. An observation can be checked by looking; a guess is a prediction or a judgment.
3. You can count the attackers on f3.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [attackers] One Black piece attacks the queen on f3.
- [attackers] One White piece defends the queen on f3.

### Step 3: contrast

Title: Guesses can be tested

Prompt: Each note is an observation or a guess. For a guess, predict whether a test will confirm it, then check.

**The working board:**

**Task `IA5-55`** (classify_position, difficulty cue 2)

A fourth note: 'Qd1 is my best move.' Observation or guess? Then see what a test says.

```
  8  r . . q k . . r
  7  p p p . b p p p
  6  . . . p . n . .
  5  . . . . p . . .
  4  . . B n P . . .
  3  P . N P . Q . P
  2  . P P . . P P .
  1  R . B . K . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: r2qk2r/ppp1bppp/3p1n2/4p3/2BnP3/P1NP1Q1P/1PP2PP1/R1B1K2R w KQkq - 1 9
```

**Accepted answer:** {"class": "guess"}

**Explanation shown:** It is a guess that happens to be right: the engine agrees that Qd1 is best. A guess that is confirmed by a test is worth more than one that is not.

Hints (in order):
1. Is this something you can see, or something you judge?
2. A judgment can still be right.
3. It is a judgment; the engine agrees with it.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [best_move_in] Qd1 is the engine's best move.
- [move_loses] Qg3 is clearly worse.

**The failing board:**

**Task `IA5-54`** (classify_position, difficulty cue 2)

A third note: 'I am lost.' Observation or guess? Then see what a test says.

```
  8  r . . q k . . r
  7  p p p . b p p p
  6  . . . p . n . .
  5  . . . . p . . .
  4  . . B n P . . .
  3  P . N P . Q . P
  2  . P P . . P P .
  1  R . B . K . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: r2qk2r/ppp1bppp/3p1n2/4p3/2BnP3/P1NP1Q1P/1PP2PP1/R1B1K2R w KQkq - 1 9
```

**Accepted answer:** {"class": "guess"}

**Explanation shown:** It is a guess, and a testable one: the engine rates the position as close to level. A feeling of being lost is data about you, not yet about the position.

Hints (in order):
1. Can you point at the board and settle it?
2. 'Lost' is a judgment about the future.
3. The engine can test judgments of this kind.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [eval_range] The engine rates the position as close to level, not lost.

**The irrelevant board:**

**Task `IA5-53`** (classify_position, difficulty cue 2)

Another note from the same game: 'My pawn on c2 is loose.' Observation or guess?

```
  8  r . . q k . . r
  7  p p p . b p p p
  6  . . . p . n . .
  5  . . . . p . . .
  4  . . B n P . . .
  3  P . N P . Q . P
  2  . P P . . P P .
  1  R . B . K . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: r2qk2r/ppp1bppp/3p1n2/4p3/2BnP3/P1NP1Q1P/1PP2PP1/R1B1K2R w KQkq - 1 9
```

**Accepted answer:** {"class": "observation"}

**Explanation shown:** It is an observation: the board shows the c2 pawn is attacked and nothing defends it. Observations like this are what you write down first.

Hints (in order):
1. Can the board answer this without any opinion?
2. Check whether the pawn is attacked and whether anything defends it.
3. It is a fact about attack and defence.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [loose_pieces] The pawn on c2 is White's only loose piece.

### Step 4: card

**One unsure moment per game.** After each game choose one move where you felt unsure. Write: the move number; what you could see (observations); what you guessed; what would settle it. Do not ask an engine yet. One moment written down beats a long review you never finish. This is a habit to try.

### Step 5: item  (shown without telling the learner the topic: unlabeled test)

**Task `IA5-56`** (classify_position, difficulty cue 3)

White to move. A note says: 'Black is going to win my e4 pawn.' Observation or guess?

```
  8  r . . q k . . r
  7  p p p . b p p p
  6  . . n p . n . .
  5  . . . . p . . .
  4  . . B . P . . .
  3  P . N . . Q . P
  2  . P P P . P P .
  1  R . B . K . . R
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: r2qk2r/ppp1bppp/2np1n2/4p3/2B1P3/P1N2Q1P/1PPP1PP1/R1B1K2R w KQkq - 1 8
```

**Accepted answer:** {"class": "guess"}

**Explanation shown:** The attack and defence counts are observations (one attacker, two defenders); 'is going to win' is a guess about the future, and the engine does not support it.

Hints (in order):
1. Separate what you can count from what you predict.
2. Attackers and defenders are facts; 'is going to win' is a forecast.
3. The forecast is the guess.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [attackers] The pawn on e4 is attacked once.
- [attackers] The pawn on e4 is defended twice.
- [eval_range] The engine rates the position as roughly level.

### Step 6: card

**What the app does for you now, and when it stops.** After each practice game the form below asks for one unsure moment. The plan is to ask only after every third game, then only when you open the form yourself (a first guess, to be changed by what you actually do). Exporting your notes as plain text is planned, so they stay yours.

### Step 7: reflect

Kind: unsure

Prompt: Use your last game, or the position from the item you just solved. Pick ONE moment where you were unsure and fill in the four lines. Keep observation and guess apart.

- Field "Move number:" (free text)

- Field "What I could see (observations):" (free text)

- Field "What I guessed:" (free text)

- Field "What would settle it:" (free text)

- Field "Next game I will write this:" with options: right after the game / the next day / I will not; no single correct answer (a guess or a self-report)

---

## Reviewer scorecard

Fill in the file `content/review/L-SELF-1-1.json` (a template is below). Scale 1 to 5 for each dimension: 1 = wrong or unusable, 3 = acceptable with edits, 5 = I would put my name to it as it stands.
Revision to review: `85904e24`. If the lesson text changes after your review, your sign-off no longer applies and the lesson goes back to needs-human.

| Dimension | What to judge | Score |
|---|---|---|
| chess | every statement, line and explanation is correct; near-misses are really near-misses | |
| clarity | the explanation actually explains (mechanism, conditions), in plain words | |
| prerequisites | the lesson assumes only what the learner has met | |
| tasks | each task has one defensible answer and a fair explanation | |

```json
{
  "lesson": "L-SELF-1-1",
  "revision": "85904e24",
  "reviewer": "<your name>",
  "reviewer_role": "strong-player",
  "date": "YYYY-MM-DD",
  "scores": {"chess": 0, "clarity": 0, "prerequisites": 0, "tasks": 0},
  "comments": "<what to change, by step number>",
  "verdict": "approved"
}
```

`reviewer_role` is `strong-player` or `teacher`. `verdict` is `approved` or `changes-requested`. See docs/review-slice.md.
