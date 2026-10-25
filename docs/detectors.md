# Concept detectors: definitions, API, benchmark, known gaps

2026-10-24. Code: `app/src/chess/` (TypeScript, runs in the browser, chess.js 1.4 is the rules library). Tests: `app/src/chess/**/*.test.ts` (`cd app && npx vitest run src/chess`). Benchmark: `tools/analysis/detector_eval/`. Labels: **[V]** verified here (a test or a measured number), **[I]** my inference, **[H]** hypothesis.

## 0. Why this exists, and the rule it keeps

Council decisions CD-4 and CD-10 (`docs/council-synthesis.md`): every reason shown to a learner comes from a deterministic detector or from reviewed text, never from a language model. These detectors are pure functions over a FEN (and optionally a move). They return **facts** (which piece attacks which, how many times, what a checked two-move line found, counted material). They are used for three things:

1. **Explanations** (`explain.ts`): short sentences assembled from facts by templates. No evaluative words; material is only ever *counted* (pawn 1, knight 3, bishop 3, rook 5, queen 9).
2. **Opportunities in imported games**: `findTacticalMoves(fen)` lists legal moves that carry out a verified tactic; `detectConcepts(fenBefore, playedMove)` says what a played move did.
3. **Labelling positions** for the curriculum graph.

Design stance: **prefer false negatives to false positives.** A detector that says nothing is harmless; one that states a wrong fact teaches a wrong thing. Every definition below is stated exactly as coded (the same text is at the top of each source file).

## 1. API (what the UI calls)

```ts
import { detectConcepts, findTacticalMoves, explainFacts } from '../chess'   // app/src/chess/index.ts

detectConcepts(fen: string, move?: string): ConceptFacts
findTacticalMoves(fen: string, only?: ConceptName[]): TacticalMove[]
explainFacts(facts: ConceptFacts, opts?: ExplainOptions): Explanation[]
```

* `fen`: any FEN chess.js loads. `move`: SAN (`"Nf3"`, `"Nc7+"`, `"O-O"`) or UCI (`"g1f3"`, `"e7e8q"`), legal in `fen`. Invalid FEN or illegal move: the function **throws** an `Error` (wrap in try/catch when reading user data).
* **Two modes.** *Position mode* (no `move`): the pattern as it stands in `fen`. *Move mode*: `fen` is the position **before** the move; the result describes what the move creates or carries out (patterns present after the move that were not there before, or that the move itself executes, such as capturing a hanging piece). Each detector's header says exactly what `found` means in each mode.
* Every result has `found: boolean` and `details: [...]`. Tactics that can be verified also have `works: boolean` (section 2) and, per detail, `works`, `guaranteedGain`, `bestDefence` (SAN of the reply that holds the gain down), and a `failure` reason where it applies.

Individual detectors (same `(fen, move?)` signature; the `...FromCtx(ctx)` forms in each file avoid re-parsing):

```ts
detectFork(fen, move?): ForkResult                 // { found, works, details: ForkDetail[] }
detectPin(fen, move?): PinResult                   // { found, works, details: PinDetail[] }
detectSkewer(fen, move?): SkewerResult
detectDiscovered(fen, move?): DiscoveredResult
detectDoubleCheck(fen, move?): DoubleCheckResult   // { found, details: [{ checkers, king }] }
detectHanging(fen, move?): HangingResult           // { found, details, outnumbered, capturedHanging, leftHanging, attacked }
detectTrapped(fen, move?): TrappedResult           // { found, works, details }
detectBackRank(fen, move?): BackRankResult
detectPassedPawn(fen, move?): PassedPawnResult     // { found, details, created }
detectOpenFile(fen, move?): OpenFileResult         // { found, details, created, rookMovedTo }
detectOutpost(fen, move?): OutpostResult           // { found, details, challengeable, vacant, movedToOutpost }
detectBishopPair(fen, move?): BishopPairResult
detectIsolatedDoubled(fen, move?): IsolatedDoubledResult
detectMaterialCount(fen, move?): MaterialResult    // found is always true
detectAttackCount(fen, move?): AttackCountResult   // per-piece attackers/defenders, square control, king zone
```

`ConceptFacts` has one field per detector (`fork`, `pin`, `skewer`, `discovered`, `doubleCheck`, `hanging`, `trapped`, `backRank`, `passedPawn`, `openFile`, `outpost`, `bishopPair`, `isolatedDoubled`, `material`, `attackCount`), plus `fen`, `sideToMove`, `move: MoveInfo | null` (`san, uci, from, to, piece, color, captured, promotion, isCapture, isCheck, isCheckmate, fenBefore, fenAfter`) and `concepts: ConceptTag[]` (`{ concept, works: boolean | null }` for each found concept; `works === null` where "works" is not defined for that concept).

`findTacticalMoves(fen, only?)` returns `TacticalMove[]` (`{ move: MoveInfo, concepts: ConceptTag[], facts: ConceptFacts }`) for legal moves of the side to move that carry out, **verified**: a fork, pin, skewer or discovered attack with `works === true`; a double check; a capture of a hanging piece; a trapped piece that nothing rescues (`works === true`); a back-rank mate. Cost: about 20-400 ms per position (it runs the full detector set on every legal move, plus a confirmation search for each claim); run it off the main thread or only on the positions that matter.

## 2. The checks behind every "works"

All live in `app/src/chess/exchange.ts` and are unit-tested.

**seeGain(pos, square, byColor)** (static exchange). The most counted material `byColor` can win by capturing the piece on `square` when both sides recapture with their least valuable attacker (x-rays included) and either side may stop. Floor 0. The first capture must be legal (pins, check and king safety are respected, even when it is not `byColor`'s turn); later recaptures ignore pins. The extra value of a capture-promotion and en passant are ignored.

**forcedGain(pos, targets)** (two-ply check, **not** a search). `pos` is the position right after a side moved, so the defender is to move. For every legal defender reply R, take the best capture X (legal for the attacker) of one of the `targets` (a target the reply moved is followed to its new square, and the square the reply lands on is tracked too, so an interposed piece that can be taken counts), valued as *captured value minus what the defender wins back by recapturing there*, or a checkmating move. The result is the minimum over R of (best X minus the material R itself captured). `works` means that minimum is at least 1 point **and** the independent search below agrees. If the defender has no legal reply: checkmate (a large sentinel, `MATE_SCORE = 1000`) or stalemate (0).

**securedGain(pos, winner)** (confirmation search, added after the first audit). A different, small material search: the side to move chooses among all legal moves, the reply is limited to captures, promotions and checks, then captures are followed to quiet positions (quiescence, 4 plies; a side in check searches every evasion); alpha-beta on counted material. It returns the winner's balance after that search minus the balance now. It sees counter-threats and long recapture chains that the two-ply `forcedGain` ignores. **A tactic is `works` only if `forcedGain >= 1` and `securedGain >= 1`.** Before this gate, 84-98% of `works` claims on real game positions survived a stricter search (section 5); the gate removes the claims that did not.

What the checks do and do not establish: "whatever the defender replies, the attacker can then win at least N counted points on the targets". It does **not** look at counter-threats other than an immediate capture by the reply, nor at anything deeper than one reply and one capture. `works === false` therefore means "not shown to work by this check", not "the tactic fails".

## 3. Definitions (exactly as coded)

Notation: ORDER value = 1/3/3/5/9 with the **king as 100** (used only to compare pieces; a king is never "cheaper"). "Counted value" = 1/3/3/5/9 with the king 0.

### Fork (`detectors/fork.ts`)
A non-king piece F **forks** when it attacks two or more enemy **targets**: the enemy king (a check); or a non-pawn piece whose value is higher than F's (even if defended); or a non-pawn piece with no real defender (undefended). Pawns are never targets. An absolutely pinned F counts only squares on its pin line (plus a check). `works`: the defender is to move, **no enemy piece cheaper than F can legally capture F**, `forcedGain` over all targets is at least 1, and `securedGain` is at least 1. Failure reasons: `forker-side-to-move`, `forker-capturable-by-cheaper-piece`, `defender-can-save-enough`. Move mode: the piece that moved.

### Pin (`detectors/pin.ts`)
A rook/bishop/queen S **pins** an enemy piece P when, on one of S's lines, P is the first piece met and the next piece is the enemy king (**absolute**) or an enemy non-king piece worth more than P (**relative**). Equal-value pieces behind P are not pins. `works`: `forcedGain` with P (and the piece behind it) as targets is at least 1 (if S's side is to move: a capture netting at least 1 is available now) and `securedGain` is at least 1. **Only absolute pins match Lichess's own `pin` tag**: relative pins are real but Lichess does not label them (section 4), so a UI that wants to agree with Lichess should filter `kind === 'absolute'`. Move mode: pins by the mover's pieces that the move creates (`isNew`), or exploits: the moved piece newly attacks the pinned piece (`attacksPinned`), or stands where the absolutely pinned piece attacks but may not capture (`shieldsMovedPiece`).

### Skewer (`detectors/skewer.ts`)
On a line of a rook/bishop/queen S: the first piece is an enemy piece A, the next an enemy piece B, A is the king or worth strictly more than B, and B is not a pawn or king. (Reverse the values and it is a pin.) `works`: `forcedGain` with A and B as targets is at least 1 and `securedGain` is at least 1.

### Discovered attack and double check (`detectors/discovered.ts`)
*Executed (move mode):* the moving piece M leaves square `from`, and afterwards a rook/bishop/queen S (not M) of the mover's side attacks an enemy non-pawn piece T (pawns are never counted) that S did not attack before, with `from` between S and T. `worthy` records whether T is also worth attacking (king, more valuable than S, or undefended). `works`: `forcedGain` with T (unless the king) and everything M itself attacks as targets is at least 1 and `securedGain` is at least 1; a discovered check whose moving piece threatens nothing is found but not working. *Battery (position mode):* an own piece sits directly between S and an enemy target on S's line. *Double check:* the king of the side to move is attacked by two or more pieces.

### Hanging piece (`detectors/hanging.ts`)
A non-king piece P is **hanging** when an enemy piece can legally capture it and either nobody could really recapture on its square (`undefended`) or some legal capturer is strictly cheaper (`attacked-by-cheaper-piece`), and the static exchange gains the capturer more than 0. Pieces merely attacked more often than defended are reported separately (`outnumbered`). Move mode: `capturedHanging` is set when the move captured a piece that was undefended or taken by a cheaper piece; `leftHanging` are the mover's own pieces the move leaves hanging; `attacked` are opponent pieces that became hanging.

### Trapped piece (`detectors/trapped.ts`)
A knight/bishop/rook/queen P is **trapped** when (checked with legal moves, as if it were its owner's turn): some enemy piece can legally capture it and the exchange wins material for the enemy; **every** legal move of P ends worse than staying (captured value minus what the enemy wins back there is negative; a checking move of P is judged like any other, because a checking piece that can be captured on the spot gains nothing); and the owner is not in check and has a legal move. `found` is that. `works` (= `rescuable` is false) additionally requires that **no other** legal move of the owner rescues P (one move deep: capturing the attacker, adding a defender, blocking, a check, or a compensating capture all count as rescue) and that `securedGain` is at least 1. In move mode a trap counts as *created* only if the move changed the piece's attackers, reachable squares or controlled squares (a move that merely answers a check, so that an existing trap becomes analysable, does not create it). **Show a trapped piece to a learner only when `works` is true**: a trapped piece whose attacker can simply be captured is a true board fact but not a working tactic.

### Back rank (`detectors/backrank.ts`)
*Position mode:* the king stands on its own back rank and every square directly in front of it (up to three) holds one of its own pieces; reported only while the enemy still has a rook or queen; `mateInOne` gives a back-rank mate for the side to move if one exists. *Move mode:* the move is checkmate, a checking piece is a rook/queen on the king's own rank, and every square in front of the mated king holds its own piece (the looser version where some squares are merely covered is deliberately **not** counted; see the benchmark).

### Structure detectors (all `found`/`details` exactly as in the file headers)
* **Passed pawn**: no enemy pawn on the same or neighbouring files in front of it. Also reports steps to promotion, pawn support, blockader, connected passed pawns.
* **Open / half-open file**: no pawns at all / none of one colour; lists the rooks and queens on the file.
* **Outpost**: square on the owner's 4th-6th rank, defended by an own pawn, that **no enemy pawn can ever attack** (no enemy pawn on a neighbouring file that is still behind it); an outpost *piece* is a knight or bishop on such a square. Supported squares an enemy pawn can still attack are reported in `challengeable` (the failing look-alike).
* **Bishop pair**: at least one bishop on each square colour.
* **Isolated / doubled pawns**: standard definitions.
* **Material count**: 1/3/3/5/9 counts and the difference; arithmetic, not an evaluation.
* **Attack count**: per piece, attackers and defenders by the rules of movement (pins ignored, x-rays not counted); per square, how many pieces of each colour attack it; attacked squares and attackers around each king.

## 4. Benchmark: our detectors vs Lichess puzzle themes

**What it is.** The Lichess puzzle theme tags are made by Lichess's own detectors, so they are a free, large, *independent* labelling. For each theme we ask: when Lichess says "fork", does our detector fire on the solving line (recall)? When Lichess does not say it, how often do we fire (false-positive rate)? Lichess themes are fuzzy (a puzzle carries several, the tag rules are heuristics), so a "false positive" can be a real tactic Lichess did not label; the numbers are a consistency check, not a truth measurement. [I]

**Data and protocol.** `tools/analysis/detector_eval/sample.py` draws a reproducible sample (seed 20261024) from the CC0 puzzle database: 4000 puzzles per theme for fork, pin, skewer, discoveredAttack, backRankMate, hangingPiece, trappedPiece, doubleCheck; 4000 carrying none of those eight ("none"); 4000 uniform from the whole database ("random"); 39,958 unique puzzles. `eval.mjs` applies `Moves[0]` (the opponent's move; the FEN is the position *before* it), then for **each solver move** (`Moves[1]`, `[3]`, ...) runs the detector in move mode on the position that move is played from.

Four ways of judging a puzzle, because Lichess tags a puzzle if the pattern occurs on *any* solver move, not only the first:
* `first`: fires on the first solver move (`Moves[1]`), the protocol from the task brief;
* `any`: fires on any solver move except the last (the last move is usually the capture or mate that cashes in the tactic; this matches how fork/pin/skewer/discovery tags behave);
* `last`: fires on the final solver move (the right test for back-rank *mate*);
* `anyAll`: any solver move including the last (in `out/results.md`).

False-positive rates are given on three populations: **FP/none** (the "none" bucket: no tag of the eight), **FP/rand** (uniform database sample minus puzzles carrying the theme), **FP/other** (every sampled puzzle without the theme, including those drawn for the other seven themes; biased towards tactics-rich positions, so real but untagged tactics inflate it).

### 4.1 Results (4000 puzzles per theme; full table with every variant and move selection: `tools/analysis/detector_eval/out/results.md`)

Judged on `first` / `any` / `last` as defined above. **Recall** = share of puzzles carrying the theme where the detector fires. **FP** = share of puzzles without the theme where it fires. **Est. precision** = recall × share / (recall × share + FP/rand × (1 − share)), where *share* is the theme's frequency in the whole database (fork 12.8%, pin 6.0%, skewer 2.2%, discovered 5.1%, back-rank mate 3.4%, hanging 3.6%, trapped 1.1%, double check 0.5%). It answers "in a Lichess-puzzle-like population, when we fire, how often does Lichess also carry the theme?" and is a **lower bound on real precision**: some of our "false positives" are genuine tactics that Lichess did not tag (a fork on the last move, a knight check that also hits a rook in a mate-in-one puzzle, and so on). [I]

| Lichess theme | Our detector variant | Judged on | n | Recall % | FP/none % | FP/rand % | FP/other % | Est. precision % |
|---|---|---|---:|---:|---:|---:|---:|---:|
| fork | `fork.works` | first | 4000 | 58.0 | 1.9 | 2.5 | 3.3 | 77.1 |
| fork | `fork.works` | any | 4000 | 87.7 | 2.0 | 2.8 | 4.0 | 82.4 |
| fork | `fork.found` (structure only) | any | 4000 | 99.9 | 7.3 | 9.2 | 11.1 | 61.4 |
| pin | `pin.abs` (absolute pin created or exploited) | first | 4000 | 57.6 | 3.6 | 3.3 | 2.5 | 52.9 |
| pin | `pin.abs` | any | 4000 | 75.7 | 4.7 | 4.5 | 3.4 | 51.6 |
| pin | `pin.absWorks` (absolute pin that wins material) | any | 4000 | 32.3 | 0.5 | 0.6 | 0.3 | 78.7 |
| pin | `pin.found` (absolute + relative) | any | 4000 | 79.6 | 17.9 | 16.8 | 15.5 | 23.2 |
| skewer | `skewer.works` | first | 4000 | 50.7 | 3.3 | 2.8 | 2.0 | 28.8 |
| skewer | `skewer.works` | any | 4000 | 86.9 | 3.8 | 3.3 | 2.6 | 37.2 |
| skewer | `skewer.found` (structure only) | any | 4000 | 96.1 | 7.5 | 7.3 | 6.4 | 22.9 |
| discoveredAttack | `disc.found` | first | 4000 | 68.5 | 3.8 | 3.6 | 10.6 | 50.4 |
| discoveredAttack | `disc.found` | any | 4000 | 85.9 | 4.7 | 4.4 | 13.7 | 51.0 |
| discoveredAttack | `disc.works` | any | 4000 | 54.3 | 1.4 | 1.3 | 7.7 | 69.7 |
| doubleCheck | `dbl.found` | any / anyAll | 4000 | 85.9 / 100.0 | 0.0 | 0.0 | 0.0 | 100.0 |
| backRankMate | `back.found` (the move is a back-rank mate) | last | 4000 | 100.0 | 1.7 | 1.7 | 1.9 | 66.8 |
| hangingPiece | `hang.capturedNonPawn` | first | 4000 | 100.0 | 6.4 | 5.1 | 4.4 | 42.4 |
| trappedPiece | `trap.found` (no safe square) | any | 4000 | 95.8 | 1.2 | 2.4 | 4.3 | 30.9 |
| trappedPiece | `trap.works` (and nothing rescues it) | any | 4000 | 55.1 | 0.1 | 0.8 | 1.5 | 44.6 |

Reading the table honestly:
* **Targets met.** Recall >= ~60% with FP <= ~10% on fork (`works`, any move: 87.7% / 2.8%), pin (absolute, any: 75.7% / 4.5%), skewer (`works`, any: 86.9% / 3.3%), back-rank mate (last move: 100% / 1.7%) and hanging piece (first move: 100% / 5.1%). On the **first solver move only** (the literal protocol of the brief) fork is 58.0% (just under 60), pin 57.6% and skewer 50.7%: Lichess tags a puzzle when the pattern occurs on *any* solver move but the first move is only sometimes the one that makes it, so `any` is the faithful comparison. [V]
* **Lichess's `pin` tag is absolute pins.** Counting relative pins as well raises recall only from 75.7% to 79.6% but raises FP from 4.5% to 16.8%: relative pins are real (a piece shielding a more valuable one) and common (pins of either kind are created or exploited on 12% of real-game plies, absolute ones on 3.8%) but Lichess does not label the relative ones. [V]
* **Estimated precision against Lichess's labels is low for rarer themes** (skewer 37%, trapped 31-45%) because even a 3% FP rate on the 98% of puzzles without the theme outweighs 2% prevalence. That says the label comparison is a poor judge of precision for rare themes, not that the claims are wrong; section 5 checks the claims directly.
* **Weak spot.** `disc.found` has FP/other 13.7%: positions where a piece moves off a line and uncovers an attack on a non-pawn piece, which Lichess does not tag in puzzles about something else. `works` halves that (7.7%).
* **Hanging piece:** recall 100% means every Lichess `hangingPiece` puzzle opens with a capture our definition calls hanging (undefended, or taken by a cheaper piece). The 5.1% FP are first moves that capture such a piece in a puzzle Lichess tags differently (typically a mate or a larger combination).

## 5. Audit on real game positions, and an independent check of every "works" claim

Puzzle positions are tactics-rich, so they cannot show how often the detectors speak in an ordinary game. `tools/analysis/detector_eval/audit.mjs` runs every detector, in move mode, on **23,896 plies of 400 real rated games** (CC0 Lichess games, January 2013, both players rated; first 4 moves of each side skipped; `games.py` extracts them) and on 5,000+ puzzle moves for comparison. Output: `out/audit.md`.

| Detector (real games) | `found` per 1000 plies | `works` per 1000 plies |
|---|---:|---:|
| fork | 17.4 | 5.6 |
| pin (absolute + relative) | 122.6 | 3.6 |
| pin, absolute only | 38.2 | 1.8 |
| skewer | 11.0 | 2.2 |
| discovered attack | 26.0 | 1.4 |
| trapped piece (no safe square) | 8.0 | 1.4 (nothing rescues it) |
| capture of a hanging non-pawn piece | 88.2 | - |
| double check | 0.3 | - |
| back-rank mate | 0.3 | - |

**Independent check of the `works` claims.** `engine_check.mjs` takes every move on which a detector said "this tactic works" and asks Stockfish 19 (depth 14, run under Node) to play out the position after the move. The claim is **confirmed** when, along the engine's principal variation (cut at its last quiet move), the mover's counted material ends at least 1 point higher than right after the move, or the engine sees a forced mate. This is independent of the detectors' own checks. It tests whether the claimed gain is real against best defence, not whether the move was best. 1,950 claims checked [V]:

| `works` claim | Real games: confirmed | Lichess puzzle positions: confirmed |
|---|---|---|
| fork | 129 / 135 (96%) | 380 / 381 (99.7%) |
| pin (any kind) | 83 / 87 (95%) | 232 / 233 (99.6%) |
| pin, absolute | 42 / 44 (95%) | 156 / 157 (99.4%) |
| skewer | 46 / 52 (88%) | 340 / 341 (99.7%) |
| discovered attack | 31 / 33 (94%) | 226 / 226 (100%) |
| trapped piece | 30 / 33 (91%) | 228 / 228 (100%) |

The real-game samples are small (33-135 claims, so roughly +/- 5-9 points at 95%); the puzzle samples are large but easy. Before the confirmation search was added to `works`, the same claims held up under a stricter material search in 84% (trapped), 87% (pin), 88% (discovered), 92% (absolute pin), 94% (fork) and 98% (skewer) of real-game cases; the gate removes the failures that the two-ply check alone let through. The engine-check failures that remain are counter-threats and in-between moves (zwischenzugs) that a material-only search does not value.

**Reading firings by eye.** I read about 110 randomly drawn `found` firings from the real games (pins, skewers, forks, discovered attacks, trapped pieces) as the sentences the explainer produces from them, and re-checked on the board the ones that looked doubtful (the reported test game below, a pawn pin, two trapped-piece cases). Apart from the bug below I found no false statement; I did not re-derive every sentence by hand [H]. The recurring problem is not falsehood but **noise**: a relative pin of a pawn in front of a knight, a skewer where the "front" queen is simply offered for trade, a trapped piece that the attacker's capture or a defender rescues. That is why those variants are in the "not safe to show" list below.

**The reported test game** (1.e4 e5 2.Nf3 Nc6 3.Bc4 Nd4 4.Nxe5 Qg5 5.Nxf7 Qxg2 6.Rf1 Qxe4+ 7.Be2 Nf3#):
* The `pin` on **7...Nf3#** is *correct*, not a false positive: the queen on e4 pins the bishop on e2 to the king on e1 (e3 is empty), so the bishop cannot capture the knight on f3, which is exactly why Nf3 is mate. The detector now says so (`shieldsMovedPiece`) and the explanation reads "The pinned piece cannot capture the piece that just moved. The move is checkmate."
* The `trappedPiece` tag on **7.Be2** was a *real bug*, now fixed. The trapped piece is Black's rook on h8 (attacked by the knight on f7, boxed in by Ng8 and the h7 pawn), and it was trapped by 5.Nxf7, not by 7.Be2. 7.Be2 only interposed against the check, which let the detector analyse a trap that already existed. A trap now counts as created by a move only if the move changed the piece's attackers or squares. The rook's trap is also correctly reported as *not working* (`works = false`, Kxf7 captures the attacker), so `findTacticalMoves` no longer lists it. Regression tests: `detectors/index.test.ts`.

## 6. Which detectors are safe to show to learners

**Two precision numbers, and which one decides.** Measured against Lichess's labels in a puzzle-like population, only `doubleCheck` reaches precision 0.9 (100%); every other detector scores 23-83% because Lichess tags only part of what is on the board (section 4.1). That figure is a lower bound for rare themes, so it cannot be the safety criterion. The criterion is **claim correctness**: of the times a detector says "this tactic works", how often is it true against an independent check (Stockfish, section 5)? By that measure fork, absolute pin, discovered attack and trapped piece are at or above 0.9 on real games and skewer is at 0.88.

Rule of thumb used here: show a detector's output as a statement of fact to a learner only if (a) its claims were confirmed in at least 90% of the real-game cases by the independent Stockfish check, or it is exact by construction (rules of chess, chess.js), and (b) its wording says only what was checked. "Safe" means the sentence is true; it does not mean the pattern is the lesson of the position.

**Safe (use as stated):**
| Output | Basis |
|---|---|
| `doubleCheck` | exact (chess.js); 0 false positives in 40k puzzle positions, recall 100% on the theme |
| `backRank` with `mate: true` (move mode) | exact checkmate plus a stated geometry; Lichess agreement 100% recall, 1.7% FP, ~0.3 per 1000 game plies |
| `fork` with `works: true` | Stockfish-confirmed 96% on real games (99.7% on puzzles); Lichess recall 87.7% |
| `pin` with `works: true`, **absolute pins** | confirmed 95% (games) / 99.4% (puzzles); Lichess FP 0.6% |
| `discovered` with `works: true` | confirmed 94% (games) / 100% (puzzles) |
| `trappedPiece` with `works: true` (not rescuable) | confirmed 91% (games) / 100% (puzzles) |
| `hangingPiece.capturedHanging` (non-pawn) | exact by definition (legal capture + exchange); phrase it as "was undefended / was attacked by a cheaper piece", not as "won material" |
| Structure facts: `passedPawn`, `openFile`, `outpost` (including `challengeable`), `bishopPair`, `isolatedDoubled`, `materialCount`, `attackCount` | textbook definitions, no search; unit-tested with failing look-alikes. Not benchmarked against Lichess (it has no such tags) |

**Borderline (show only with the wording the explainer produces, or with a reviewer):**
| Output | Why |
|---|---|
| `skewer` with `works: true` | 88% confirmed on real games (46/52, interval roughly 77-95%), 99.7% on puzzles. Shown with its checking depth it is safe to *state*; do not call it a tested lesson item yet |
| `pin` `works: true` with a **relative** pin | 95% confirmed overall but the relative pins are the ones Lichess disagrees with and they are the noisy kind |

**Not safe to show as a tactic (true board facts, but not claims that the tactic works):**
`fork.found` / `skewer.found` / `discovered.found` / `pin.found` with `works: false` (the explainer words these as "the check found a reply after which ..." which is accurate but is a contrast item, not a tactic), **relative pins** in general (Lichess FP 16.8%), `trapped.found` with `rescuable: true`, `hanging.details`/`outnumbered`/`attacked` (a piece attacked now, not a capture made), `attackCount` (raw counts: pins ignored, x-rays not counted). `app/src/lib/opportunities.ts` already keeps only `works === true` for fork/pin/skewer/discoveredAttack; it should do the same for `trappedPiece` (it currently keeps any `found`, so a rescuable trap can reach a learner).

## 7. Known gaps

1. **Depth.** `works` rests on one reply plus a short capture search. Deflection, decoy, zwischenzug, quiet-move and longer combinations are not recognised; `works: false` never means "the tactic fails".
2. **Material only.** Everything counts 1/3/3/5/9. Mate threats, initiative, positional compensation and king safety are invisible, so a tactic that wins no material but wins the game (or a sacrifice that is sound) is not found.
3. **Counter-threats** other than immediate captures and checks are not seen by the two-ply check; the audits show this cost 2-16% of `works` claims on real games before the confirmation gate (section 5).
4. **Pawn targets.** Pawns are never fork, skewer or discovered-attack targets; loose-pawn forks and a discovered attack that uncovers an attack on a pawn followed by mate (for example Qxh7#) are missed. Discovered-attack recall is 86% for this reason among others.
5. **Static exchange** ignores pins on later recapturers, capture-promotions and en passant; x-ray defenders are handled only inside the exchange, not in the `defenders` lists.
6. **Trapped piece**: the rescue search is one move deep; a piece that is *lured* into a trap (a bait capture that loses the capturer) is not recognised as trapped (97% of Lichess `trappedPiece` puzzles end with a capture of a non-pawn piece, but only part of those are traps by our definition).
7. **Outpost** counts a knight or bishop; it does not predict that pawn captures can later break the outpost. **Back rank** is strict: a mate on the back rank where the escape squares are covered but not blocked by the king's own pieces is not reported (the loose version had 9-11% FP against Lichess).
8. **Benchmark limits.** Lichess themes are fuzzy and a puzzle usually has several; recall is measured only where the theme is present, FP only where it is absent, so rare themes get a low estimated precision from a small FP rate. The real-game `works` samples are small (33-135 per detector). Stockfish depth 14 is not a proof; its PV cut at the last quiet move can misjudge a long exchange.
9. **Cost.** A `works` claim costs a search: about 20 ms median and 100-250 ms at the 90th percentile on tactical positions; `findTacticalMoves` on a busy middlegame position can take a few hundred ms. Run it in a worker or only where needed. Plain `detectConcepts` on a quiet move is 3-11 ms.

## 8. Reproducing the numbers

```
cd app && npx vitest run src/chess                    # unit tests for every detector (with failing look-alikes)
./tools/.venv/Scripts/python.exe -I tools/analysis/detector_eval/sample.py 4000 20261024   # puzzle sample (seeded)
./tools/.venv/Scripts/python.exe -I tools/analysis/detector_eval/games.py 400 30            # real games for the audit
node tools/analysis/detector_eval/eval.mjs --n 4000 --workers 4    # themes benchmark (~25 min with the confirmation gate)
node tools/analysis/detector_eval/headline.mjs                      # headline table with estimated precision
node tools/analysis/detector_eval/audit.mjs --games 400 --puzzles 300 --workers 4   # real-game audit (~10 min)
node tools/analysis/detector_eval/engine_check.mjs --depth 14 --max 300 --engines 4  # Stockfish check of the works claims (~5 min)
```
Node 22.18+ or 24 runs the TypeScript sources directly. All outputs are written to `tools/analysis/detector_eval/out/`.

