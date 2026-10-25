# Exercises from the Lichess puzzle database, second tranche (lp2): attack, defence, sacrifice, initiative, calculation and the remaining tactics and endgames

2026-10-25. Code: `tools/corpus/l2_*.py` (seeded, rerunnable; the first tranche in `tools/corpus/a*.py`, `b*.py`, `c*.py` was not touched). Items: `content/items/lp2-*.json`. Logs and raw verdicts: `tools/corpus/out/l2/` (`verdicts.jsonl`, `selection.json`, `build_report.json`, `report.json`, `report.md`, `survey.json`). Labels: **[V]** measured here, **[S]** supplied by the data source (Lichess tags), **[J]** my judgement or inference, **[R]** recalled, not checked here.

<!--TABLES-->
## Results

**1532 items on 1310 positions in 19 files** (`content/items/lp2-*.json`), 37 nodes, 4127 claims, of which the validator passes **1532 items / 4127 claims** at the time of writing (an item counts only when every claim of it has a passing record in `content/_evidence/`).

| measure | counts |
|---|---|
| cue level | cue 1: 255, cue 2: 45, cue 3: 1232 |
| task | find_move: 1296, predict_outcome: 146, classify_position: 60, select_squares: 30 |
| review status | machine-only: 1188, needs-human: 344 |
| claim types | `best_move_in`: 1409, `tablebase`: 750, `material_after_move`: 650, `move_loses`: 511, `mate_in`: 420, `eval_range`: 327, `legal_destinations`: 30, `quiet_position`: 30 |

### Funnel per bucket [V]

`selected` = drawn from the database by the seeded rule; `verified` = passed every engine and tablebase check; `delivered` = items written (cue-1 siblings and yes / no pairs included). The difference selected minus verified is the drop; the commonest reasons are in the last column.

| bucket | node | selected | verified | delivered | commonest drop reasons |
|---|---|---|---|---|---|
| ATK.CASTLED:k | ATK.CASTLED | 54 | 54 | 34 | - |
| ATK.CASTLED:q | ATK.CASTLED | 19 | 18 | 12 | no win claim: neither mate, material >= 2, eval >= 250 for the mover (1) |
| ATK.CENTER | ATK.CENTER | 58 | 58 | 36 | - |
| ATK.COMMIT | ATK.COMMIT | 51 | 48 | 32 | no win claim: neither mate, material >= 2, eval >= 250 for the mover (2); engine disagrees: Lichess move not within N cp of engine best (1) |
| ATK.GREEKGIFT:fails | ATK.GREEKGIFT | 56 | 32 | 30 | foil: the tempting move does not lose material along the engine line (24) |
| ATK.GREEKGIFT:works | ATK.GREEKGIFT | 48 | 48 | 30 | - |
| ATK.PACE | ATK.PACE | 51 | 50 | 32 | no win claim: neither mate, material >= 2, eval >= 250 for the mover (1) |
| ATK.PAWNSTORM | ATK.PAWNSTORM | 48 | 46 | 30 | no win claim: neither mate, material >= 2, eval >= 250 for the mover (2) |
| ATK.SUPERIORITY | ATK.SUPERIORITY | 72 | 71 | 30 | no win claim: neither mate, material >= 2, eval >= 250 for the mover (1) |
| CAL.BLIND | CAL.BLIND | 89 | 35 | 30 | line: second best within N cp at ply 1 (35); line: not the engine's best move at ply 1 (8) |
| CAL.CANDIDATES | CAL.CANDIDATES | 66 | 49 | 30 | line: second best within N cp at ply 1 (10); line: second best within N cp at ply 2 (3) |
| CAL.COMPARE | CAL.COMPARE | 72 | 71 | 30 | no win claim: neither mate, material >= 2, eval >= 250 for the mover (1) |
| CAL.DEFENSE | CAL.DEFENSE | 86 | 85 | 36 | no win claim: neither mate, material >= 2, eval >= 250 for the mover (1) |
| CAL.DEPTH:4 | CAL.DEPTH | 36 | 36 | 18 | - |
| CAL.DEPTH:5 | CAL.DEPTH | 25 | 25 | 12 | - |
| CAL.ENDURANCE | CAL.ENDURANCE | 173 | 28 | 26 | line: second best within N cp at ply 1 (77); line: second best within N cp at ply 3 (32) |
| CAL.TREE | CAL.TREE | 70 | 30 | 30 | line: second best within N cp at ply 1 (27); line: not the engine's best move at ply 1 (6) |
| CAL.VISUALIZE | CAL.VISUALIZE | 48 | 0 | 30 | - |
| DEF.COUNTER | DEF.COUNTER | 51 | 51 | 32 | - |
| DEF.FORTRESS (switched off) | DEF.FORTRESS | 48 | 0 | 0 | tablebase says win for the mover (needed draw) (48) |
| DEF.FORTRESS:eq | DEF.FORTRESS | 59 | 59 | 30 | - |
| DEF.RESOURCES | DEF.RESOURCES | 54 | 54 | 34 | - |
| DEF.RESOURCES:eq | DEF.RESOURCES | 48 | 42 | 30 | tablebase says draw for the mover (needed win) (4); no win claim: neither mate, material >= 2, eval >= 250, nor an only-mo (2) |
| DEF.TRADES | DEF.TRADES | 54 | 54 | 34 | - |
| END.BREAKTHROUGH | END.BREAKTHROUGH | 51 | 49 | 32 | no win claim: neither mate, material >= 2, eval >= 250 for the mover (2) |
| END.KING-ACTIVE | END.KING-ACTIVE | 54 | 54 | 34 | - |
| END.LUCENA (switched off) | END.LUCENA | 48 | 1 | 0 | tablebase says win for the mover (needed draw) (47) |
| END.MINOR | END.MINOR | 58 | 58 | 36 | - |
| END.PHILIDOR (switched off) | END.PHILIDOR | 48 | 0 | 0 | tablebase says win for the mover (needed draw) (48) |
| END.QUEEN-PAWN | END.QUEEN-PAWN | 58 | 58 | 36 | - |
| END.ROOK-ACTIVE | END.ROOK-ACTIVE | 58 | 58 | 36 | - |
| END.THEORY.QvR | END.THEORY.QvR | 48 | 48 | 30 | - |
| END.ZUGZWANG | END.ZUGZWANG | 58 | 58 | 36 | - |
| FND.SPECIAL | FND.SPECIAL | 40 | 39 | 25 | no win claim: neither mate, material >= 2, eval >= 250 for the mover (1) |
| INI.INITIATIVE | INI.INITIATIVE | 54 | 38 | 34 | initiative: an opponent reply is not clearly forced (16) |
| SAC.TYPES | SAC.TYPES | 54 | 53 | 34 | no win claim: neither mate, material >= 2, eval >= 250 for the mover (1) |
| SAC.TYPES:p | SAC.TYPES | 62 | 58 | 26 | no win claim: neither mate, material >= 2, eval >= 250 for the mover (4) |
| TAC.COMBO | TAC.COMBO | 58 | 58 | 36 | - |
| TAC.DESPERADO | TAC.DESPERADO | 48 | 47 | 30 | no win claim: neither mate, material >= 2, eval >= 250 for the mover (1) |
| TAC.MATE-PATTERNS:anastasiaMate | TAC.MATE-PATTERNS | 8 | 8 | 5 | - |
| TAC.MATE-PATTERNS:arabianMate | TAC.MATE-PATTERNS | 8 | 8 | 5 | - |
| TAC.MATE-PATTERNS:bodenMate | TAC.MATE-PATTERNS | 6 | 6 | 4 | - |
| TAC.MATE-PATTERNS:cornerMate | TAC.MATE-PATTERNS | 5 | 5 | 3 | - |
| TAC.MATE-PATTERNS:doubleBishopMate | TAC.MATE-PATTERNS | 6 | 6 | 4 | - |
| TAC.MATE-PATTERNS:dovetailMate | TAC.MATE-PATTERNS | 6 | 6 | 4 | - |
| TAC.MATE-PATTERNS:epauletteMate | TAC.MATE-PATTERNS | 5 | 5 | 3 | - |
| TAC.MATE-PATTERNS:hookMate | TAC.MATE-PATTERNS | 8 | 8 | 5 | - |
| TAC.MATE-PATTERNS:morphysMate | TAC.MATE-PATTERNS | 5 | 5 | 3 | - |
| TAC.MATE-PATTERNS:operaMate | TAC.MATE-PATTERNS | 6 | 6 | 4 | - |
| TAC.MATE-PATTERNS:pillsburysMate | TAC.MATE-PATTERNS | 6 | 6 | 4 | - |
| TAC.MATE-PATTERNS:smotheredMate | TAC.MATE-PATTERNS | 8 | 8 | 5 | - |
| TAC.OVERLOAD | TAC.OVERLOAD | 54 | 53 | 34 | no win claim: neither mate, material >= 2, eval >= 250 for the mover (1) |
| TAC.PERPETUAL | TAC.PERPETUAL | 54 | 37 | 34 | draw: position not within +-N cp (13); draw: move_loses failed (4) |
| TAC.STALEMATE-TRICK | TAC.STALEMATE-TRICK | 13 | 10 | 10 | draw: move_loses failed (3) |
| TAC.UNDERPROMOTE | TAC.UNDERPROMOTE | 61 | 35 | 34 | under: promoting to a queen is not at least N cp worse (26) |

**Constructed stalemate positions [V]** (`l2_stalemate_gen2.py`, outside the table). 47,600 seeded probes in seven material sets gave 118 positions whose depth-12 engine line reaches a stalemate; 109 of those are tablebase draws, 100 have one to three drawing moves; the first 36 that also passed the depth-16 line and the material rule were kept (generation stopped at its target of 36), and 26 remain after balancing the material sets (none more than 13) = 26 cue-3 items and 7 cue-1 siblings. K+N v K+Q gave nothing, K+P(7th) v K+R almost nothing (sets in which the weaker side cannot hold).

**Compensation positions [V]** (`l2_comp.py`, outside the table). 3,000 game positions screened at depth 14: 304 looked level for the side that is down material, 2,366 clearly worse. 272 matched jobs were verified at depth 16 (`eval_range` + `quiet_position`), 170 passed, and 30 items remain (13 'at least level', 17 'clearly worse').
<!--/TABLES-->

## Method

### 1. Data and sampling [V]
- **Source.** The CC0 Lichess puzzle database (`library/data/lichess_db_puzzle.csv.zst`, 6,157,341 rows). The learner sees the position **after** the opponent's first move (`Moves[0]`); the solver's first move is `Moves[1]`, as in the first tranche.
- **Quality classes.** Strict (the first tranche's filter): rating deviation <= 80, plays >= 500, popularity >= 85, rating 800 to 2199. Relaxed (rare themes only: equality, underpromotion, rare mating patterns, queen/rook endings, castling): rating deviation <= 200, plays >= 30, popularity >= 0, rating 500 to 2499. Relaxed puzzles carry `difficulty_prior.grade` G0 (rating poorly measured); strict ones G1. Strict puzzles are always picked first.
- **Buckets.** A bucket is one (node, selection rule). Each rule is a python-chess predicate over the puzzle line (`l2_common.py`); a cheap string pre-filter keeps the 6 M-row pass at about 4 minutes. The buckets are listed in the funnel table under Results. Rarer buckets pick first, one puzzle is used once across all buckets, and nothing already in `content/items` is reused (puzzle ids and FEN keys are excluded; `check_all.py` reports no duplicate).
- **Stratification and cleanliness.** Per bucket the seeded sample is spread over the seven 200-point rating bins, the cleanest puzzles (fewest Lichess tags) first. The sample is oversampled (x1.6, up to x2.4 where a tempting wrong move is needed) because verification drops some puzzles. Buckets that stayed short after verification were topped up in append-only rounds (`l2_sample.py topup`), sized by the bucket's own observed yield (verified-ok / verified), so earlier verdicts stayed valid.
- **Very large pools** (line entry, "is it the best move", visualisation) use a seeded 1 to 15 percent hash sample of the database; the pools are still tens of thousands of puzzles.

### 2. Verification [V]
Each selected puzzle is re-checked with `validate.check_claim` (the validator's own function) at depth 16, Stockfish 19 lite, one thread, MultiPV 6; only claims that passed are written, so `validate.py` reproduces them (the 100 percent pass rate is a consequence of the method, as in `corpus-tactics.md`). In this tranche the material claim and the feedback claim reuse the search that measured them instead of running it a second time; `validate.py` is the independent second run, and any item whose claim fails there is removed (`l2_prune.py`), never loosened.
- **Accepted set.** The moves within 40 cp of the engine's best (at most 3; mates: all mating moves within n, at most 4); the Lichess move must be inside it. More moves means "ambiguous" and the puzzle is dropped. Among the 1,194 delivered puzzles that went through this stage (visualisation items and the Greek-gift 'fails' foils are not counted), **the engine's best move equals the Lichess solution move in 1,192** (99.8 percent) [V]; as in the first tranche this is expected from how Lichess builds puzzles and means the check mainly drops puzzles whose win is too small to teach, not engine disagreements.
- **Win/hold claim by bucket mode.** `mate_in`, else `material_after_move` (measured net >= 2, dead-draw safeguard replayed), else `eval_range` >= 250 cp; holds (defence buckets) may use "only move": eval not worse than -100 plus `move_loses` of the best alternative >= 150; draws (perpetual check) need an eval within 60 cp of level plus `move_loses` of the best alternative >= 150.
- **Tablebase stage** (`l2_tb.py`, 7 pieces or fewer). The accepted set becomes **all** moves that keep the exact result (at most 4, else dropped as ambiguous), each with a `tablebase` claim; the engine `best_move_in` is kept only if it still passes for that set. A tempting wrong move that the tablebase shows to be worse gives the feedback claim. This replaces the engine's guess with an exact result in the endgame nodes.
- **Underpromotion** items also carry `move_loses` on the queen promotion (>= 150 cp worse), and a tablebase claim on it when the position has 7 pieces or fewer. Underpromotion is thus shown to be *needed*, not just present.
- **Counter-attack** items add a `mate_in` claim with `null_move_first`: the opponent would mate in one if the mover passed.

### 3. Item kinds
| kind | task | what the learner does | how the answer is checked |
|---|---|---|---|
| find (cue 3) | `find_move` | "Find the best move." No theme named. | `best_move_in` plus a mate / material / eval / hold / tablebase claim |
| find (cue 1) | `find_move` | "Theme: ..." names the idea (same position as a cue-3 item, `needs-human`) | same claims; the theme label is [S] or [J], never a claim |
| predict | `predict_outcome` | "X to move, thinking about M. Is it the best move?" yes / no (the app draws M as an arrow) | yes: best move + win claim; no: `move_loses` on a tempting capture or check (>= 1.5 pawns worse) + `best_move_in` for the real best move |
| Greek gift | `predict_outcome` | "Does the sacrifice on h7 work?" | works: win claim on Bxh7+ (mate or material); fails: `move_loses` >= 2 pawns plus `material_after_move` max |
| compare | `classify_position` | "Which move is better, A or B?" (no arrow is drawn for this task) | `best_move_in` for the better move, `move_loses` for the other |
| line | `find_move` with `answer.line` / `answer.plies`, tag `mode.variation` | enter your move, the reply, your next move ... | claims cover the first move and the result; the line itself is checked by the generator (below) |
| blind | line item with `display` hiding every piece after a study time | enter the line without seeing the pieces (typing is allowed) | as line |
| viz | `select_squares` with `display.hide` | study, some pieces vanish, tap every legal destination of one piece | `legal_destinations` (rules, exact) |
| stalemate (constructed) | `find_move` | "Find the best move" in a constructed ending where the weaker side draws | one `tablebase` claim per drawing move (draw) and one on a tempting move that loses; the stalemate itself is shown by the generator's engine line, not by a claim |
| compensation | `classify_position` | "At least level, or clearly worse?" for a side that is down material in a real game position | `eval_range` (level or clearly worse) plus `quiet_position` (the best line does not win more than a pawn back) |

**Line items (variation entry): what is and is not checked.** The validator checks the first move and the outcome, not the opponent's replies in the middle of the line. The generator (`l2_verify.py: line_check`) additionally requires, at depth 16 and MultiPV 3, that **every** ply of the Lichess line is the engine's best move and at least 40 cp better than the second best (or the only legal move). That is a generator check [V here, not a validator claim], so line items are `needs-human` and their `explain` says "the engine's main line", not "forced". The app accepts exactly one reply per ply, so lines with a close second reply were dropped.

### 4. What each claim proves and does not prove
| claim | proves | does not prove |
|---|---|---|
| `best_move_in` (depth 16) | the engine's top move is in the set and every set member is within 40 cp of it | that the move is best at greater depth or for another engine; Lichess built the puzzles with Stockfish, so a shared blind spot survives |
| `mate_in` | the engine finds a forced mate within n at depth 16 (n = 1 is exact rules) | a proof for long mates; a mate the engine does not see in 16 plies was dropped, not weakened |
| `material_after_move` | net material along the engine's best-defence line, measured at its last capture | that the opponent has no better practical defence; "wins N points" is under recorded limits |
| `eval_range` | the engine's evaluation lies in the range at depth 16 | a position verdict beyond depth 16 |
| `move_loses` | the move is at least the stated number of centipawns worse than the engine's best (depth 16) | why the move is bad; the feedback text says only "worse by X" |
| `tablebase` | exact win / draw / loss (Lichess 7-man service) | that the move is the *fastest* (accepted sets contain every move that keeps the result) |
| `legal_destinations` | the exact set of legal moves of that piece (rules) | nothing beyond rules |
| `quiet_position` (max 1) | the engine's best line from the position does not win more than one point of material for the side to move (v0 heuristic of the validator) | that the position is quiet in any strategic sense; it only rules out a hidden recapture |
| `mate_in` + `null_move_first` | the opponent mates in one if the mover passes (rules / engine) | that the mover has no better defence than counter-attack (the other claims cover the best move) |
| *theme labels* | nothing: they come from Lichess tags [S] or from my predicates [J] | every label is a statement for a human to check; they appear only in cue-1 siblings, in the first two hints and in `kind`/`theme` tags |

### 5. What went wrong on the way, and what changed [V]
These are defects found by measuring, kept here so the next author does not repeat them.
1. **Three endgame buckets selected the wrong kind of position.** `END.LUCENA`, `END.PHILIDOR` and the first `DEF.FORTRESS` rule passed the engine stage (a win or a hold claim) and failed only at the tablebase stage: the solver of a K+R v K+R+P puzzle wins by a tactic, and the 'defensive' endings picked were wins. They were switched off or replaced (see What this tranche does not cover). Lesson: for an endgame node, check the tablebase result class before trusting a theme tag.
2. **Decision items had almost no tempting wrong move.** The first verifier looked only at the engine's second-ranked move. `l2_feedback.py` now tries every capture, check or promotion in the engine's top six that the validator's `move_loses` shows to be at least 150 cp worse; 63 of 183 verdicts gained one, which is what lets `CAL.COMPARE` and the 'No' answers of `CAL.DEFENSE`, `ATK.SUPERIORITY` and `SAC.TYPES` exist at all.
3. **Cue-1 siblings may name only one theme.** 13 of the 14 first Greek-gift siblings carried a second tactical tag (`discoveredAttack`, `deflection`, ...). The build now uses only puzzles without another motif tag for them (6 remain); the other Greek-gift puzzles are yes / no items, whose prompts describe the move, not the theme. `TAC.COMBO` siblings are multi-motif by definition and say so.
4. **Stalemate tricks cannot be sampled from the puzzle data** (an engine scan of 9,081 equality or defensive endings with the solver behind found 13 whose engine line reaches a stalemate, and 10 of those passed verification). The first generator asked the tablebase first and found nothing in 47 minutes; the second runs the engine first (cheap, parallel) and asks the tablebase only about the survivors, which gave 36 positions in 17 minutes. A material rule was added afterwards: at the stalemate position the weaker side must still be at least three points behind, so that the draw is not a plain equal-material draw.
5. **Compensation items need matched classes.** 'Down material but fine' is rare (about 10 percent of screened positions, and about a third of those survive `quiet_position`), and 'down material and lost' is common. The two classes are matched on material deficit and on phase (pieces on the board) before truncation, so the answer cannot be read off the count or the phase alone.
6. **Line items.** About half of the long lines (seven and nine plies) were dropped because some ply had a second reply within 40 cp: the app accepts one reply per ply.

<!--NODES-->
## Items per node

| node | items | by cue | tasks | what is in it | claims (most common) | validator |
|---|---|---|---|---|---|---|
| `ATK.CASTLED` | 55 | c1:9, c3:46 | find_move:55 | Lichess kingsideAttack / queensideAttack, not mate in one, without exposedKing / attackingF2F7 (those go to ATK.CENTER) | best_move_in:55, material_after_move:30, move_loses:26 | 55/55 |
| `ATK.CENTER` | 44 | c1:8, c3:36 | find_move:44 | exposedKing or attackingF2F7, opening or middlegame, the enemy king on the d, e or f file on its back two ranks, a queen on the board | best_move_in:44, mate_in:26, move_loses:22 | 44/44 |
| `ATK.COMMIT` | 39 | c1:7, c3:32 | find_move:39 | an attack theme plus a sacrifice and a line of at least four plies: the attack has to be carried through | best_move_in:39, mate_in:24, material_after_move:13 | 39/39 |
| `ATK.PACE` | 39 | c1:7, c3:32 | find_move:39 | an attack theme where the first move is quiet (no capture, check, king move or promotion): strengthen before striking | best_move_in:39, material_after_move:26, eval_range:10 | 39/39 |
| `ATK.PAWNSTORM` | 37 | c1:7, c3:30 | find_move:37 | kings on opposite wings, the first move a non-capturing pawn move on the 4th rank or higher within two files of the enemy king | best_move_in:37, material_after_move:30, move_loses:10 | 37/37 |
| `ATK.GREEKGIFT` | 60 | c1:6, c3:54 | predict_outcome:54, find_move:6 | the first move is a bishop capture with check on h7 / h2 (works) or such a capture exists but loses (fails); yes / no items, plus cue-1 find items | material_after_move:56, move_loses:32, best_move_in:30 | 60/60 |
| `ATK.SUPERIORITY` | 30 | c3:30 | predict_outcome:30 | attack-theme puzzles with a tempting capture or check; the learner judges 'is this the best move?' | best_move_in:30, move_loses:15, mate_in:9 | 30/30 |
| `TAC.UNDERPROMOTE` | 42 | c1:8, c3:34 | find_move:42 | the first move promotes to a rook, bishop or knight; promoting to a queen is shown to be worse | move_loses:67, best_move_in:42, material_after_move:26 | 42/42 |
| `TAC.STALEMATE-TRICK` | 49 | c1:13, c3:36 | find_move:49 | equality endgames from the puzzle data whose engine line reaches a stalemate, plus constructed positions (tablebase draw, solver at least 3 points behind) | tablebase:97, best_move_in:16, eval_range:16 | 49/49 |
| `TAC.PERPETUAL` | 42 | c1:8, c3:34 | find_move:42 | equality puzzles in which at least two of the solver's moves in the line are checks | move_loses:45, best_move_in:42, eval_range:42 | 42/42 |
| `TAC.DESPERADO` | 37 | c1:7, c3:30 | find_move:37 | a piece with no safe square captures, is recaptured, and the line continues with a further capture | best_move_in:37, material_after_move:31, move_loses:16 | 37/37 |
| `TAC.OVERLOAD` | 42 | c1:8, c3:34 | find_move:42 | the defender recaptures and thereby leaves a piece worth at least three points without its only protector | best_move_in:42, material_after_move:35, move_loses:17 | 42/42 |
| `TAC.COMBO` | 44 | c1:8, c3:36 | find_move:44 | two or more tactical motif tags, a line of at least five plies, a winning or mating result | best_move_in:44, material_after_move:38, move_loses:15 | 44/44 |
| `TAC.MATE-PATTERNS` | 61 | c1:12, c3:49 | find_move:61 | Lichess tags for twelve named mating patterns (Anastasia, Arabian, Boden, double bishop, hook, smothered, dovetail, opera, Pillsbury, epaulette, corner, Morphy) | best_move_in:61, mate_in:61, move_loses:25 | 61/61 |
| `SAC.TYPES` | 68 | c1:8, c3:60 | find_move:42, predict_outcome:26 | sacrifice puzzles that are not attack-theme puzzles, plus 'does the sacrifice work?' yes / no items | best_move_in:68, mate_in:32, material_after_move:23 | 68/68 |
| `FND.SPECIAL` | 31 | c1:6, c3:25 | find_move:31 | castling puzzles in which castling itself is the first move | best_move_in:31, material_after_move:26, move_loses:6 | 31/31 |
| `END.ZUGZWANG` | 44 | c1:8, c3:36 | find_move:44 | zugzwang-tagged endgames, at most 14 pieces (exact tablebase for 7 or fewer) | tablebase:88, best_move_in:44, eval_range:34 | 44/44 |
| `END.BREAKTHROUGH` | 39 | c1:7, c3:32 | find_move:39 | pawn endings in which a pawn is pushed and taken by a pawn and the line goes on (a sacrifice that opens the road) | best_move_in:39, eval_range:35, tablebase:32 | 39/39 |
| `END.QUEEN-PAWN` | 44 | c1:8, c3:36 | find_move:44 | queen against one or two advanced pawns (sixth rank or further) | tablebase:88, best_move_in:44, material_after_move:33 | 44/44 |
| `END.THEORY.QvR` | 37 | c1:7, c3:30 | find_move:37 | queen against rook, pawns at most two in all | tablebase:74, best_move_in:37, material_after_move:34 | 37/37 |
| `END.MINOR` | 44 | c1:8, c3:36 | find_move:44 | bishop or knight endings without queens or rooks | tablebase:88, best_move_in:44, eval_range:29 | 44/44 |
| `END.ROOK-ACTIVE` | 44 | c1:8, c3:36 | find_move:44 | rook endings with rooks and pawns only | tablebase:88, best_move_in:44, material_after_move:23 | 44/44 |
| `END.KING-ACTIVE` | 42 | c1:8, c3:34 | find_move:42 | endings without queens or rooks where the first move is a king move | tablebase:84, best_move_in:42, eval_range:26 | 42/42 |
| `DEF.RESOURCES` | 79 | c1:15, c3:64 | find_move:79 | defensiveMove puzzles, and equality puzzles that are not endgames; the claim is an 'only move' hold | best_move_in:79, material_after_move:53, eval_range:24 | 79/79 |
| `DEF.COUNTER` | 39 | c1:7, c3:32 | find_move:39 | the opponent would mate in one if the mover passed, and the best move is a check or capture with check | mate_in:56, best_move_in:39, material_after_move:21 | 39/39 |
| `DEF.TRADES` | 42 | c1:8, c3:34 | find_move:42 | a defensive exchange: an equal-value capture of a minor piece or more that is recaptured | best_move_in:42, material_after_move:35, move_loses:8 | 42/42 |
| `DEF.FORTRESS` | 37 | c1:7, c3:30 | find_move:37 | endings with at most seven pieces, tagged equality, the solver at least two points behind; the tablebase says draw | tablebase:74, best_move_in:37 | 37/37 |
| `INI.INITIATIVE` | 42 | c1:8, c3:34 | find_move:42 | winning lines of at least five plies where at least half of the solver's moves are checks and every opponent reply is clearly forced | best_move_in:42, material_after_move:37, move_loses:14 | 42/42 |
| `INI.COMPENSATION` | 30 | c3:30 | classify_position:30 | real games (Lichess 2013-01 sample): is the side to move, down at least two points of material, at least level or clearly worse? Classes matched by deficit and phase | eval_range:30, quiet_position:30 | 30/30 |
| `CAL.VISUALIZE` | 30 | c1:15, c2:15 | select_squares:30 | a middlegame position; one or two pieces vanish; tap every legal destination of one piece (rules only) | legal_destinations:30 | 30/30 |
| `CAL.DEPTH` | 37 | c1:7, c3:30 | find_move:37 | forced mates in four and in five moves (find the first move) | best_move_in:37, mate_in:37, move_loses:12 | 37/37 |
| `CAL.CANDIDATES` | 30 | c1:6, c3:24 | find_move:30 | three-ply lines (your move, the reply, your move) entered whole | best_move_in:30, mate_in:30, move_loses:13 | 30/30 |
| `CAL.TREE` | 30 | c1:6, c3:24 | find_move:30 | five-ply lines entered whole | best_move_in:30, mate_in:30, move_loses:15 | 30/30 |
| `CAL.BLIND` | 30 | c3:30 | find_move:30 | five- and seven-ply lines entered after every piece has vanished | best_move_in:30, mate_in:30, move_loses:11 | 30/30 |
| `CAL.ENDURANCE` | 26 | c3:26 | find_move:26 | seven- and nine-ply lines entered whole | best_move_in:26, mate_in:25, move_loses:10 | 26/26 |
| `CAL.DEFENSE` | 36 | c3:36 | predict_outcome:36 | yes / no: does a tempting capture or check survive the best reply? | best_move_in:36, move_loses:17, material_after_move:17 | 36/36 |
| `CAL.COMPARE` | 30 | c2:30 | classify_position:30 | which of two moves is better (one best move, one verified-worse tempting move) | best_move_in:30, move_loses:30 | 30/30 |
<!--/NODES-->

<!--GAPS-->
## What this tranche does not cover

- **Nodes of the families this tranche targets that have no item anywhere in `content/items` (snapshot when this page was generated; other authors were writing items at the same time):** `DEF.DIAGNOSE`, `END.THEORY.MUSTKNOW`, `FND.VALUE`, `INI.THREAT`.
- **Why `END.LUCENA` and `END.PHILIDOR` got no items from this tranche [V].** The first version selected K+R against K+R+P puzzles. The tablebase stage showed that 95 of the 96 puzzles it picked were *wins* for the side to move: in the puzzle data the solver always wins by a tactic (a skewer or a fork that takes the rook), never by Lucena or Philidor technique. Both buckets are switched off (`off=True` in `l2_common.py`, their old verdicts stay in `verdicts.jsonl`). Those two nodes need constructed positions with a tablebase check, built the way the constructed stalemate positions are.
- **Why the first `DEF.FORTRESS` bucket was replaced [V].** It took 'equality or defensiveMove' endings; all 48 picked were tablebase *wins* for the side to move (strict-quality puzzles tagged crushing). The replacement requires the Lichess tag `equality` and a tablebase draw.
- **Nodes that are about judgement, not a position:** `INI.THREAT` (the held threat) and `DEF.DIAGNOSE` (diagnosing a worse position) have no item anywhere; `DEF.WAIT` and `DEF.SHELTER` have only the few items other authors wrote. The puzzle data has no tag for them and a machine claim for them would be a claim about a plan, not a position; they need lessons and human-reviewed items.
- **`CAL.DEPTH` ('how deep, and when to stop')** has only its checkable half here: forced mates in four and five moves (the claim is a forced mate at depth 16). The metacognitive half (stopping rules) is lesson material.
- **Tag noise [S].** Lichess themes are assigned by its own scripts; a label can be wrong. Labels appear only in cue-1 siblings (marked needs-human), in the first two hints and in tags, never as a claim.
- **Depth.** Every engine claim is at depth 16 with one thread and Stockfish 19 lite. A position that needs deeper search was dropped when the engine did not agree with the Lichess solution, but a shared blind spot of engines at this depth cannot be excluded.
- **Strong players have not read any of these items.** `machine-only` means every sentence shown is claim-checked, not that a human looked.
- **Whole-line items check the first move and the result, not each reply** (see section 3). The generator additionally checked every ply (best move and a gap of at least 40 cp to the second best) but that is not a validator claim.
- **The `INI.COMPENSATION` verdict is an engine verdict at fixed depth, not a proof;** the class labels say so in `explain`.
- **Generated stalemate positions are constructions,** not game positions, in a handful of material sets; they teach the idea, not how often it arises.
- **Age and rating.** Puzzle ratings are Lichess's (G1 for strict-quality puzzles, G0 for the relaxed rare-theme classes); they are priors, not measurements on our learners.
<!--/GAPS-->

<!--GATES-->
## Gates before these items are used with a learner

1. `tools/validate.py` passes every claim of every item (`python l2_report.py` counts; failures are pruned by `l2_prune.py`, never loosened). Items needing a human: 344; machine-only: 1188.
2. A strong player should read a sample of the `needs-human` items (all cue-1 siblings, all whole-line items) and the tablebase endings; the labels and the sentence 'the engine's main line' are the points to check.
3. Cue-1 siblings share their position (and family) with the cue-3 item: the scheduler must never put the two on both sides of a practice / test split. Families are `FAM-LP2-<puzzle id>`; the generated stalemate positions share a family per material set and pawn file.
4. The app ships an item only when its evidence hash matches: after any edit of an item file the validator must be run again (`tools/build_content.py` reports the shipped counts).
5. Nothing here is a rating. `difficulty_prior` is the Lichess puzzle rating with a grade (G1 or G0); learner and item ratings come from use.
6. **Open integration defect [V].** The app's `src/content.smoke.test.ts` over the shipped items passes 7 of 8 tests with these items (legal answers, options for predict / classify items, hidden squares and study times of the memory drills are fine). The one failure is its skill-id pattern `^[A-Z]{2,5}(\.[A-Z0-9-]+)+\.D[0-5]$`, which rejects the lowercase `v` of the node `END.THEORY.QvR` (37 lp2 items, ids `END.THEORY.QvR.D1/D2`, which are the ids defined in `content/skills`). This tranche did not touch `app/` or `content/skills/`; the owner should either allow lower case in the pattern or rename the node.
<!--/GATES-->

## Reproduce
All commands from `O:\_Chessteaching`, with `tools/.venv/Scripts/python.exe -I`. Each stage is resumable and seeded (`L2_SEED = 20261031`); engine searches at fixed depth are deterministic, so a rerun reproduces the selection and, up to load-dependent timing, the verdicts.
```
tools/corpus/l2_all.py scan                      # engine scan of 9,081 equality / defensive endings for stalemate lines (~40 min)
tools/corpus/l2_all.py                           # sample extra verify tb topup verify tb topup verify tb feedback build validate report doc
tools/corpus/l2_stalemate_gen2.py 36 100         # constructed stalemate positions: engine first, tablebase second (~20 min), then writes lp2-stalemate-1.json
tools/corpus/l2_comp.py screen 8                 # INI.COMPENSATION: engine screen of game positions, then:  l2_comp.py build 10  (writes lp2-ini-1.json)
tools/corpus/validate_all.py 3 "lp2-*.json"      # the project validator, three files at a time (about 12 minutes per file of ~100 items)
tools/corpus/l2_prune.py                         # drop items whose claim failed in validate.py (never loosen), then validate those files again
```
Order matters in one place: `l2_tb.py` and the stalemate generators share `out/l2/tb_cache.json` (plain file, not locked), so do not run them at the same time.
The first, abandoned stalemate generator (`l2_stalemate_gen.py`, tablebase first) found nothing in 47 minutes; its `build()` and settings are reused by `l2_stalemate_gen2.py`.
