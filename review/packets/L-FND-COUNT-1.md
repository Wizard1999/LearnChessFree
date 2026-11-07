# Review packet: L-FND-COUNT-1

**Is this piece safe? Loose pieces and counting**

- Skill: SAF.COUNT (D1); stage: S2; stated length: 12 minutes
- Steps: 15 (10 are tasks); revision: `1726b292`
- Review status now: needs-human

## What the lesson says the learner will be able to do

- Spots loose pieces (attacked and not defended) on either side
- Counts attackers and defenders of a square
- Decides whether to start captures on a square by adding up the swaps, cheapest piece first

## Sources the author names (check that they are used fairly, in our own words)

- docs/first-hours.md session 2
- docs/council-synthesis.md CD-1, CD-4
- sources/sheets/edlasker_chess-strategy.md (K2 counting, K3 spoilers)

## How to read this packet

Boards are drawn with capitals for White and lower case for Black, rank 8 at the top unless the board is shown from Black's side. Moves in a line are in standard notation. Statements marked [V] were machine-checked, [I] inference, [H] hypothesis, [S] secondary source, [R] recalled. Please judge the explanations, not only the moves: does each sentence tell the learner why?

---

### Step 1: card

A piece is **attacked** when an enemy piece could capture it. It is **defended** when a friendly piece could take back on that square. Attacked and **not defended** is **loose** here: it can be taken for free. Related words: **undefended** means no friendly piece guards it, even if nobody attacks it yet; **hanging** (*en prise*) means attacked without enough defence; **tactically vulnerable** means defended but still losable to a trick. Spot loose pieces, yours and theirs: the first safety habit.

### Step 2: board

Caption: The queen attacks the pawn on b6 and the bishop on d5. Only one of them is loose.

```
  8  . . . . . . k .
  7  . . . . . p p .
  6  . p n . p . . p
  5  . . . b . . . .
  4  . . . . . . . .
  3  . Q . . . N . .
  2  P P . . . P P P
  1  . . . R . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 6k1/5pp1/1pn1p2p/3b4/8/1Q3N2/PP3PPP/3R2K1 w - - 0 1
```

Drawn on the board: arrows b3-b6, b3-d5; highlighted squares b6, d5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [loose_pieces] (no sentence; a rules check)
- [attackers] (no sentence; a rules check)

### Step 3: item

**Task `IA0-56`** (select_squares, difficulty cue 1)

Tap every black piece that is loose (attacked, and not defended). Kings do not count.

```
  8  . . . . . . k .
  7  . . . . . p p .
  6  . p n . p . . p
  5  . . . b . . . .
  4  . . . . . . . .
  3  . Q . . . N . .
  2  P P . . . P P P
  1  . . . R . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 6k1/5pp1/1pn1p2p/3b4/8/1Q3N2/PP3PPP/3R2K1 w - - 0 1
```

**Accepted answer:** squares b6

**Explanation shown:** The bishop on d5 is attacked twice but the pawn on e6 defends it, so it is not loose. The pawn on b6 is attacked by the queen and nothing defends it: it is the only loose piece.

Hints (in order):
1. First find every black piece that a white piece attacks. Then check each one for a defender.
2. The bishop on d5 is attacked twice, but look at e6.
3. The pawn on b6 is attacked by the queen. Does any black piece defend it?

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [loose_pieces] The pawn on b6 is the only loose black piece.
- [attackers] Two white pieces attack the bishop on d5.
- [attackers] One black piece defends the bishop on d5.

### Step 4: item

**Task `IA0-57`** (select_squares, difficulty cue 1)

Tap every black piece that is loose (attacked, and not defended). Kings do not count.

```
  8  . . . . . . k .
  7  p p . . . p p p
  6  . . n . . . . .
  5  . . . b . . . .
  4  . . . . . . . .
  3  . Q . . . N . .
  2  P P . . . P P P
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 6k1/pp3ppp/2n5/3b4/8/1Q3N2/PP3PPP/6K1 w - - 0 1
```

**Accepted answer:** squares b7, d5

**Explanation shown:** The queen attacks both the bishop on d5 and the pawn on b7, and no black piece defends either one. Both are loose.

Hints (in order):
1. Find every black piece that a white piece attacks. The queen attacks along lines.
2. For each attacked piece, ask: could a black piece take back on that square?
3. Two pieces on the queen's lines have no defender.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [loose_pieces] The pawn on b7 and the bishop on d5 are the loose black pieces.

### Step 5: card

When several pieces fight over one square, count. List the attackers and the defenders. Start captures with your cheapest attacker. Add up what each side takes and gives, and stop when the next swap would lose more than it wins. More attackers than defenders is not always enough.

### Step 6: board

Caption: Two attackers, one defender, and the pawn goes first. Count the swaps.

```
  8  . . . . . . k .
  7  p . . . . p p .
  6  . p . . . . . p
  5  . . n . . . . .
  4  . . . P . . . .
  3  B . . . . . . .
  2  P . . . . . P P
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black. Starting position.
FEN: 6k1/p4pp1/1p5p/2n5/3P4/B7/P5PP/6K1 w - - 0 1
```

The line, with the sentence the learner sees at each move:
1. **1. dxc5**: The pawn takes the knight: +3.
2. **1... bxc5**: The pawn takes the pawn: -1.
3. **2. Bxc5**: The bishop takes the pawn: +1.

```
  8  . . . . . . k .
  7  p . . . . p p .
  6  . . . . . . . p
  5  . . B . . . . .
  4  . . . . . . . .
  3  . . . . . . . .
  2  P . . . . . P P
  1  . . . . . . K .
     a b c d e f g h

Black to move. Capitals = White, lower case = Black. Position at the end of the line.
FEN: 6k1/p4pp1/7p/2B5/8/8/P5PP/6K1 b - - 0 2
```

Drawn on the board: arrows d4-c5, a3-c5; highlighted squares c5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [attackers] (no sentence; a rules check)
- [attackers] (no sentence; a rules check)
- [material_after_move] (no sentence; a rules check)

### Step 7: item

**Task `IA0-59`** (predict_outcome, difficulty cue 1)

How many white pieces and pawns attack the black knight on e5?

```
  8  . . . . . . k .
  7  p . . . . p p .
  6  . . . p . . . p
  5  . . . . n . . .
  4  . . . . . P . .
  3  . . . . . N . .
  2  P . . . . . P P
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 6k1/p4pp1/3p3p/4n3/5P2/5N2/P5PP/6K1 w - - 0 1
```

**Accepted answer:** {"outcome": "2"}

**Explanation shown:** The pawn on f4 attacks e5 diagonally, and the knight on f3 attacks e5 with an L-jump: two attackers.

Hints (in order):
1. Pawns attack the two squares diagonally in front of them.
2. Knights attack the squares an L-jump away.
3. The pawn on f4 and the knight on f3 both reach e5.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [attackers] Two white pieces attack e5.

### Step 8: item

**Task `IA0-60`** (predict_outcome, difficulty cue 1)

How many black pieces and pawns defend the black knight on e5?

```
  8  . . . . . . k .
  7  p . . . . p p .
  6  . . . p . . . p
  5  . . . . n . . .
  4  . . . . . P . .
  3  . . . . . N . .
  2  P . . . . . P P
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 6k1/p4pp1/3p3p/4n3/5P2/5N2/P5PP/6K1 w - - 0 1
```

**Accepted answer:** {"outcome": "1"}

**Explanation shown:** Only the pawn on d6 could take back on e5: one defender.

Hints (in order):
1. A piece defends a square if it could capture there after an enemy piece lands on it.
2. Black pawns attack diagonally downward.
3. Look at d6.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [attackers] One black piece defends e5.

### Step 9: contrast

Title: Same count, different pieces

Prompt: Again two attackers and one defender. This time the target is a pawn and the first attacker is a knight. Predict first: does the count still win?

**The working board:**

**Task `IA0-61`** (predict_outcome, difficulty cue 2)

Two attackers against one defender. White starts by taking with the pawn on f4. Black takes back, and White takes again. Is White ahead in the end? Predict, then check.

```
  8  . . . . . . k .
  7  p . . . . p p .
  6  . . . p . . . p
  5  . . . . n . . .
  4  . . . . . P . .
  3  . . . . . N . .
  2  P . . . . . P P
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 6k1/p4pp1/3p3p/4n3/5P2/5N2/P5PP/6K1 w - - 0 1
```

**Accepted answer:** {"outcome": "yes"}

**Explanation shown:** The pawn takes a knight (+3), the pawn on d6 takes the pawn (-1), the knight takes the pawn on e5 (+1): White ends 3 points ahead. The cheapest attacker went first.

Hints (in order):
1. Add up the swaps one at a time: first capture, recapture, last capture.
2. The pawn takes the knight (3). The pawn on d6 takes the pawn (1). Then the knight takes the pawn (1).
3. White gains 3 + 1, loses 1.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [material_after_move] Starting with the pawn wins 3 points.
- [attackers] Two attackers.
- [attackers] One defender.

**The failing board:**

**Task `IA0-62`** (predict_outcome, difficulty cue 3)

Two attackers against one defender again, but now the attackers are a knight and a bishop and the target is a pawn. White starts with a capture on e5. Is White ahead in the end? Predict, then check.

```
  8  . . . . . . k .
  7  p . . . . p p .
  6  . . . p . . . p
  5  . . . . p . . .
  4  . . . . . . . .
  3  . . B . . N . .
  2  P . . . . . P P
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 6k1/p4pp1/3p3p/4p3/8/2B2N2/P5PP/6K1 w - - 0 1
```

**Accepted answer:** {"outcome": "no"}

**Explanation shown:** More attackers than defenders did not help. White gives a knight (3) for a pawn, then wins a second pawn: 3 given, 2 won. The first piece to capture was worth more than the target.

Hints (in order):
1. Count the swaps again: first capture, recapture, last capture. What is each piece worth?
2. The first capturer is a knight (3). The target is a pawn (1).
3. The knight takes a pawn (+1), the pawn takes the knight (-3), the bishop takes a pawn (+1).

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [material_after_move] Starting the captures on e5 leaves White behind.
- [attackers] Two attackers.
- [attackers] One defender.

### Step 10: item

**Task `IA0-63`** (classify_position, difficulty cue 3)

White thinks about taking the knight on d5 with the bishop. Black will recapture if it can. After the captures, what has happened to White's points?

```
  8  . . . . . . k .
  7  p p . . . p p p
  6  . . . . . . . .
  5  . . . n . . . .
  4  . . . . . . . .
  3  . B . . . . . .
  2  P P . . . P P P
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 6k1/pp3ppp/8/3n4/8/1B6/PP3PPP/6K1 w - - 0 1
```

**Accepted answer:** {"class": "White gains material"}

**Explanation shown:** One attacker, no defenders: the bishop takes the knight and nothing recaptures. White is 3 points ahead.

Hints (in order):
1. Count the attackers and the defenders of the knight.
2. With no defender, nothing can take back.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [material_after_move] Bxd5 wins the knight.
- [attackers] One attacker.
- [attackers] No defenders.

### Step 11: item

**Task `IA0-65`** (classify_position, difficulty cue 3)

White thinks about starting the captures on e5, with either the knight or the bishop. Black will recapture whenever it can. After all the captures, what has happened to White's points?

```
  8  . . . . . . k .
  7  p . . . . p p .
  6  . . n p . . . p
  5  . . . . p . . .
  4  . . . . . . . .
  3  . . B . . N . .
  2  P . . . . . P P
  1  . . . . . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 6k1/p4pp1/2np3p/4p3/8/2B2N2/P5PP/6K1 w - - 0 1
```

**Accepted answer:** {"class": "White loses material"}

**Explanation shown:** Equal numbers favour the defender. White's first capture wins only a pawn, and a piece is taken in return. Whoever starts a capture on a square with as many defenders as attackers loses material first.

Hints (in order):
1. Count the attackers of e5, then the defenders. Are the numbers equal?
2. Who has to capture first? That piece is the first one in danger.
3. White offers a piece for a pawn before getting anything back.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [attackers] Two attackers.
- [attackers] Two defenders.
- [material_after_move] Nxe5 leaves White behind.
- [material_after_move] Bxe5 leaves White behind.

### Step 12: item

**Task `IA0-58`** (predict_outcome, difficulty cue 3)

White to move. The black bishop attacks White's queen. How many of White's pieces are loose? (Attacked, and not defended; kings do not count.)

```
  8  . . . . . . k .
  7  . . . . . p p .
  6  . p n . p . . p
  5  . . . b . . . .
  4  . . . . . . . .
  3  . Q . . . N . .
  2  P P . . . P P P
  1  . . . R . . K .
     a b c d e f g h

White to move. Capitals = White, lower case = Black.
FEN: 6k1/5pp1/1pn1p2p/3b4/8/1Q3N2/PP3PPP/3R2K1 w - - 0 1
```

**Accepted answer:** {"outcome": "none"}

**Explanation shown:** The bishop attacks the queen, but the pawn on a2 defends her, and no other white piece is attacked at all. Attacked is not the same as loose: no white piece is loose.

Hints (in order):
1. Make a list of the white pieces that Black attacks.
2. For each one, find a white defender.
3. Look at what defends the queen on b3.

Claims the program checks (engine, rules or tablebase), which you need not re-calculate but should read for sense:
- [loose_pieces] No white piece is both attacked and undefended.
- [attackers] The bishop on d5 attacks the queen on b3.
- [attackers] The pawn on a2 defends the queen on b3.

### Step 13: practice

A drill of 6 tasks drawn from the bank by tag ['node.SAF.LOOSE', 'kind.generated'] (58 tasks carry those tags). Not reproduced here; ask for a sample if you want one checked.

### Step 14: practice

A drill of 6 tasks drawn from the bank by tag ['node.SAF.COUNT', 'kind.generated'] (145 tasks carry those tags). Not reproduced here; ask for a sample if you want one checked.

### Step 15: reflect

Kind: confidence

Prompt: Pick one counting question. Which swap did you add up last, and did you check that each defender could really capture? Rate how sure you were of that answer. (low / medium / high)

---

## Reviewer scorecard

Fill in the file `content/review/L-FND-COUNT-1.json` (a template is below). Scale 1 to 5 for each dimension: 1 = wrong or unusable, 3 = acceptable with edits, 5 = I would put my name to it as it stands.
Revision to review: `1726b292`. If the lesson text changes after your review, your sign-off no longer applies and the lesson goes back to needs-human.

| Dimension | What to judge | Score |
|---|---|---|
| chess | every statement, line and explanation is correct; near-misses are really near-misses | |
| clarity | the explanation actually explains (mechanism, conditions), in plain words | |
| prerequisites | the lesson assumes only what the learner has met | |
| tasks | each task has one defensible answer and a fair explanation | |

```json
{
  "lesson": "L-FND-COUNT-1",
  "revision": "1726b292",
  "reviewer": "<your name>",
  "reviewer_role": "strong-player",
  "date": "YYYY-MM-DD",
  "scores": {"chess": 0, "clarity": 0, "prerequisites": 0, "tasks": 0},
  "comments": "<what to change, by step number>",
  "verdict": "approved"
}
```

`reviewer_role` is `strong-player` or `teacher`. `verdict` is `approved` or `changes-requested`. See docs/review-slice.md.
