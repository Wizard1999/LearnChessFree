# Skill graph v1: the curriculum as data

Generated 2026-10-24 from `content/skills/*.json` by the numbers below; checked by `tools/check_graph.py`. Evidence labels as in `CLAUDE.md`: **[V]** the graph structure (acyclic, references exist, tiers consistent) is machine-checked; **[I]** tier, depth and prerequisite choices are our design (all ratings **G0**, expert estimate); **[S]/[R]** the conditions and contrasts come from the five synthesis sheets, which are themselves summaries of the books; every engine- or tablebase-flagged claim in them stays **[CHECK]** until an item is validated.

This document replaces nothing: `curriculum-map-v1.md` and `-v1.1.md` say *what* the nodes are and why; `content-schema.md` is the file contract; this file says what was built from them, how to read it, where the choices were mine, and what is still missing.

## 1. What exists

- One file per node: `content/skills/<ID>.json`. **194 nodes**: 169 written here and 25 written by the foundation worker (the 24 ids of the assignment plus `FND.SPECIAL`, a combiner node it added). Foundation ids missing when this was generated: none.
- **Fields beyond `content-schema.md`** (additive; the foundation worker's files use the same shapes): `origin` (map-v1, map-v1.1, reconciliation, or a note on how the id came about) · `invented_by_us` (true where the id or the node is not in a map: `END.THEORY.MUSTKNOW`, `FND.DRAWS`, `FND.SPECIAL`, `OPN.REPERTOIRE.BLACK`, `OPN.REPERTOIRE.WHITE`, `SAF.FICTITIOUS`) · `status` (`placeholder`, `blocked`) · `note` · `soft_prereqs` (list of `NODE.Dn` strings) with `soft_prereq_notes` (`{ref: why}`, one per soft prerequisite) · **evidence for every line of `conditions` and `contrasts` in parallel arrays**: `condition_sources[i]` for `conditions[i]`, `contrast_sources[i]` and `contrast_kinds[i]` (`fails` = failing look-alike, `irrelevant` = irrelevant case) for `contrasts[i]`. The texts stay clean because the app shows them to learners on the Course page; the evidence stays machine-readable. `strand` uses `S1`..`S11` as in the schema (the first v0 file used a word and was replaced).
- **Depths.** D0 idea (explains it, no prerequisites) · D1 cued (told the theme or the name) · D2 unlabeled (mixed set, includes positions where the idea does not apply; this is what a *tier* refers to) · D3 under calculation and counterexamples (one-feature changes, failing look-alikes) · D4 in play (evidence from own games with prompts off) · D5 teach/repair (builds a contrast family, repairs a faulty exercise). Nodes with a D4: 14; with a D5: 1. Not every node has D4/D5: only where evidence from play is meaningful. Habit nodes (`LOOP.V1`, `SELF.1`, `PRA.*`) are defined by D4 evidence and cannot be tested out by items alone.
- **Prerequisites.** `prereqs` are *hard*: `NODE.Dn` strings, only where the skill truly cannot be learned without the other. Depth Dn (n >= 2) always lists `NODE.D(n-1)` first (the chain, as in the TAC.FORK example); D0 has none. Cross-node prerequisites are chosen per depth, so an advanced node's D1 does not wait for what only its D3 needs. `soft_prereqs` ("helps if known first", 103 links in all) never block access; a scheduler may use them to order teaching and to pick review items. A soft link never points at a node that hard-depends on this one.
- **Rules the checker enforces.** The hard graph is acyclic at depth level and, as a stricter policy, at node level; every reference exists (node and depth); a node's tier is never lower than a hard prerequisite's tier; no tier >= 2 node is an orphan; average hard in-degree (distinct prerequisite nodes per node) <= 2.5; one node should not lean on more than four others; the source and kind arrays are as long as the texts they annotate; every soft prerequisite has a note.
- **Source vocabulary** (entries of `condition_sources` and `contrast_sources`): `CAP CI-n` Capablanca sheet core idea n (`§5 item n` the dated/contestable list, `§8 item n` exercise idea) · `Nimz #n` Nimzowitsch sheet idea n · `EML 4.n` Em. Lasker sheet idea 4.n · `EDL Kn` Ed. Lasker sheet idea Kn · `ZB Cnn` Znosko-Borovsky sheet idea Cnn · letters in parentheses are the sheets' own fields: (b) idea, (c) conditions, (d) exceptions, (e) where, (f) example type, (g) likely misconception · `FH ...` `docs/first-hours.md` · `CNC ...` `docs/council-synthesis.md` (Round n, CD-n) · `MAP1`, `MAP11`, `REC` the maps and the reconciliation · `rules` a rules fact · **`ours`** no sheet supports the line; it is our reasoning and must be checked by engine/tablebase and a reviewer before any item uses it.

## 2. Counts

194 nodes, 415 distinct hard edges between nodes, average hard in-degree **2.14** (limit 2.5), 103 soft links. Longest hard chain: **19 nodes**: `FND.BOARD` -> `FND.PIECE.BISHOP` -> `FND.PIECE.QUEEN` -> `FND.VALUE` -> `FND.CAPTURE` -> `FND.CHECK` -> `FND.STALEMATE` -> `FND.PROMOTE` -> `FND.MATE1` -> `SAF.THREAT` -> `LOOP.V1` -> `LOOP.V2` -> `CAL.CANDIDATES` -> `CAL.TREE` -> `CAL.DEFENSE` -> `TAC.PERPETUAL` -> `DEF.RESOURCES` -> `DEF.TRADES` -> `DEF.FORTRESS`.

| Strand | T0 | T1 | T2 | T3 | T4 | T5 | T6 | T7 | Total |
|---|---|---|---|---|---|---|---|---|---|
| S1 Rules and board vision | 15 | 4 | 0 | 1 | 0 | 0 | 0 | 0 | 20 |
| S2 Safety and the Thinking Loop | 0 | 5 | 2 | 2 | 1 | 1 | 1 | 0 | 12 |
| S3 Tactics | 0 | 0 | 6 | 9 | 7 | 1 | 0 | 0 | 23 |
| S4 Calculation | 0 | 0 | 0 | 2 | 3 | 2 | 1 | 0 | 8 |
| S5 Positional play and planning | 0 | 0 | 4 | 15 | 13 | 10 | 3 | 0 | 45 |
| S6 Attack, sacrifice and defense | 0 | 0 | 0 | 3 | 9 | 4 | 2 | 0 | 18 |
| S7 Endgames | 0 | 5 | 1 | 10 | 7 | 8 | 2 | 1 | 34 |
| S8 Openings and structures | 0 | 1 | 5 | 3 | 1 | 1 | 0 | 1 | 12 |
| S9 Game study and own-game analysis | 0 | 0 | 0 | 3 | 2 | 1 | 1 | 0 | 7 |
| S10 Practical performance | 0 | 1 | 4 | 1 | 1 | 0 | 1 | 0 | 8 |
| S11 Self-direction | 1 | 0 | 1 | 1 | 1 | 1 | 1 | 1 | 7 |
| **All** | **16** | **16** | **23** | **50** | **45** | **29** | **12** | **3** | **194** |

Tier gloss as in the map (a tier is when a node's unlabeled use, D2, joins the recommended route; no tier implies a rating): T0 plays a legal game · T1 doesn't hang pieces, mates simply · T2 sees basic tactics, develops sensibly · T3 holds a plan, short calculation, simple pawn endings · T4 compares resulting positions, uses structures and imbalances, practical rook endings · T5 allocates depth, prophylaxis, transitions · T6 rigorous best-defence calculation, independent analysis · T7 original research and preparation.

## 3. Default route

The order in which a learner first meets the nodes (D0 to D2), aligned with `first-hours.md` (nodes 1-31 are its sessions 1-5 plus the Tier 1 endgame spine) and with the placement idea: **a mid-level learner takes the 20-30 minute placement and tests out of nodes 1-31 at D2 (unlabeled), entering at node 32.** Habit nodes in that zone (`SELF.1`, `LOOP.V1`, `SAF.THREAT`, `PRA.CLOCK`) stay open until games show the behaviour unprompted (D4). The checker verifies that every node's D0-D2 prerequisites (the foundation nodes' too) appear earlier in this list.

Andrew's remembered basics (`first-hours.md`): development and castling early (nodes 27 and 41-45), connecting rooks (47), open files (48), passed pawns (59) and the bishop pair (61) all fall inside the first 60; the Greek gift is node 84 because it truly needs the count, the mate patterns and the castled-king attack ideas before it. It is the end of a path, not a lesson to jump to.

### A. The first hours: sessions 1-5 of first-hours.md and the Tier 0-1 endgame spine (a mid-level player tests out of these)

1. `FND.BOARD` (T0, S1) - every later explanation uses square names; first-hours session 1.
2. `FND.PIECE.ROOK` (T0, S1) - first mover, taught by tapping every reachable square with blockers.
3. `FND.PIECE.BISHOP` (T0, S1) - diagonals and the blocked-diagonal contrast.
4. `FND.PIECE.QUEEN` (T0, S1) - a rook plus a bishop, so almost nothing new to learn.
5. `FND.PIECE.KING` (T0, S1) - one step; sets up the rule that a king may not step next to an attacked square.
6. `FND.PIECE.KNIGHT` (T0, S1) - the jump; reach a square in two jumps.
7. `FND.PIECE.PAWN` (T0, S1) - captures differently from how it moves.
8. `FND.CAPTURE` (T0, S1) - capture is landing on an enemy piece; the first free-piece items.
9. `FND.VALUE` (T0, S1) - values as a rule of thumb with exceptions to come.
10. `FND.ATTACK` (T0, S1) - what a piece attacks; needed before counting and before every tactic.
11. `SAF.LOOSE` (T1, S2) - free piece or trap: the first contrast pair.
12. `SAF.COUNT` (T1, S2) - attackers against defenders on one square; the most used hub in the graph.
13. `FND.CHECK` (T0, S1) - the three ways out of check.
14. `FND.MATE1` (T1, S1) - mate in one, back-rank first.
15. `FND.STALEMATE` (T0, S1) - same material, one move different: mate or stalemate.
16. `FND.CASTLE` (T0, S1) - legal castling and the 'may not pass through an attacked square' contrast.
17. `FND.ENPASSANT` (T0, S1) - the special capture, tested not just shown.
18. `FND.PROMOTE` (T0, S1) - promotion, shown here and tested in pawn races.
19. `FND.DRAWS` (T1, S1) - repetition, fifty moves, insufficient material.
20. `FND.SPECIAL` (T1, S1) - the mixed check: which special move, if any, is available.
21. `SELF.1` (T0, S11) - the one-line reflection after the first game, before any engine comment.
22. `FND.NOTATION` (T1, S1) - read and record a game; also the entry to board vision.
23. `END.MATE-KQ` (T1, S7) - king and queen against king, played out against the bot.
24. `END.MATE-STALEMATE-AVOID` (T1, S7) - finish the mate without stalemating.
25. `END.PAWN-RACE` (T1, S7) - pawn races counted, not guessed.
26. `END.OPPOSITION` (T1, S7) - the first king-and-pawn idea; positions checked against the tablebase.
27. `OPN.PRINCIPLES` (T1, S8) - three principles with reasons and a contrast showing what goes wrong.
28. `SAF.THREAT` (T1, S2) - what did their last move threaten; includes positions with no threat.
29. `LOOP.V1` (T1, S2) - the safety scan as a routine; prompts fade after five moves.
30. `END.MATE-KR` (T1, S7) - king and rook against king; the king must help.
31. `PRA.CLOCK` (T1, S10) - clock literacy before the first timed game.

### B. Tier 2: where a mid-level player starts

32. `SAF.DEFEND-OPTIONS` (T1, S2) - the five answers to a threat: move, protect, capture, block, counter-threat.
33. `TAC.FORK` (T2, S3) - the first tactic; cue ladder from named to mixed with no-fork positions.
34. `TAC.PIN` (T2, S3) - second tactic; real versus fictitious pins.
35. `TAC.SKEWER` (T2, S3) - taught as the pin's mirror image.
36. `TAC.DISCOVER` (T2, S3) - uncovering a second threat with the masking piece.
37. `LOOP.V2` (T2, S2) - checks, captures, threats for both sides.
38. `SAF.FICTITIOUS` (T2, S2) - real versus fictitious threats; feeds no-threat items.
39. `TAC.BACKRANK` (T2, S3) - back-rank mates and the weakness of one's own back rank.
40. `TAC.DOUBLE-CHECK` (T2, S3) - the forcing special case of a discovered check.
41. `OPN.NONDEV` (T2, S8) - developing versus time-wasting moves.
42. `OPN.TEMPO` (T2, S8) - which moves helped; the exceptions to tempo counting.
43. `OPN.TRAPS` (T2, S8) - take sure material, except when the material is the trap.
44. `OPN.SETUP` (T2, S8) - one simple setup with a reason for every piece.
45. `OPN.DEVIATION` (T2, S8) - what to do when they leave the book; recurs from here on.
46. `POS.ACTIVITY` (T2, S5) - activity as useful squares, not advancement; opens the positional strand.
47. `POS.CONNECT` (T2, S5) - connecting rooks as the last step of development.
48. `POS.OPENFILE` (T2, S5) - open file means entry square and target, not occupation.
49. `POS.SEVENTH` (T2, S5) - the seventh rank and its conditions.
50. `END.KING-ACTIVE` (T2, S7) - when the king should come out in an ending.
51. `SELF.2` (T2, S11) - explain a move in a sentence that names a feature.
52. `PRA.BUDGET` (T2, S10) - a simple time budget, checked against the log.
53. `PRA.SECURE` (T2, S10) - complacency when ahead; a habit node.
54. `PRA.RECOVER` (T2, S10) - a routine after a loss, instead of a streak.
55. `PRA.LOAD` (T2, S10) - a training load the learner can keep.

### C. Tier 3 entry (the first 60 or so end here)

56. `TAC.NONE` (T3, S3) - tell 'no tactic' from 'tactic'; makes fork and pin count as transfer.
57. `POS.WEAKSQ` (T3, S5) - holes and weak squares; precondition for outposts and pawn play.
58. `POS.PAWNWEAK` (T3, S5) - isolated, doubled, backward with their conditions.
59. `POS.PASSED` (T3, S5) - passed pawns: push, support or hold back.
60. `POS.GOODBAD` (T3, S5) - good and bad pieces; reroute, retreat or trade.
61. `POS.BISHOPS` (T3, S5) - the bishop pair and when it is not worth much.
62. `POS.OUTPOST` (T3, S5) - outposts: e4 against e3 contrast.

### D. Continuation: the pawn-ending spine, calculation basics, and the path to the Greek gift

63. `END.KPK` (T3, S7) - king first, pawn second; win or draw by the controlling condition.
64. `POS.EXCHANGE` (T3, S5) - which trades help and which relieve the opponent.
65. `TAC.REMOVE-DEFENDER` (T3, S3) - removing the guard; the count lies.
66. `TAC.MATE-PATTERNS` (T3, S3) - what must be true for a check to be mate; named families.
67. `FND.VISUAL` (T3, S1) - board vision without the board; feeds calculation.
68. `CAL.VISUALIZE` (T3, S4) - tracking a short line.
69. `CAL.CANDIDATES` (T3, S4) - list and prune candidates.
70. `LOOP.V3` (T3, S2) - candidates and short lines as a habit.
71. `GAME.OWN` (T3, S9) - annotate before the engine.
72. `POS.TARGET` (T3, S5) - attack what cannot move away.
73. `POS.PLAN` (T3, S5) - a plan you can carry out.
74. `OPN.REPERTOIRE.WHITE` (T3, S8) - a reasons-first line as White built from own opponents.
75. `OPN.REPERTOIRE.BLACK` (T3, S8) - same as Black.
76. `SAF.COUNT.FUTURE` (T3, S2) - count what can arrive; bridge to calculation.
77. `ATK.SUPERIORITY` (T3, S6) - do not attack without a tangible superiority.
78. `ATK.CENTER` (T3, S6) - the king in the centre as a target.
79. `POS.PAWNMOVE` (T3, S5) - what does this pawn move leave behind.
80. `DEF.SHELTER` (T3, S6) - pawn cover in front of the king.
81. `CAL.TREE` (T4, S4) - the analysis tree: each branch once.
82. `SAC.TYPES` (T4, S6) - why sacrifices work and when they do not.
83. `ATK.CASTLED` (T4, S6) - count attackers against defenders around the castled king.
84. `ATK.GREEKGIFT` (T4, S6) - the h7 sacrifice with its conditions and its failing look-alike.

## 4. The ten most connected nodes

Degree = distinct hard prerequisite nodes plus distinct hard dependents.

1. `SAF.COUNT` (T1, S2) - in 3, out 17. Counting attackers and defenders.
2. `SAF.THREAT` (T1, S2) - in 2, out 10. What does their last move threaten?
3. `CAL.DEFENSE` (T4, S4) - in 2, out 9. The opponent's best resource.
4. `FND.ATTACK` (T0, S1) - in 2, out 9. Attacked and defended squares.
5. `FND.CHECK` (T0, S1) - in 2, out 9. Check.
6. `POS.ACTIVITY` (T2, S5) - in 2, out 9. Piece activity.
7. `POS.WEAKSQ` (T3, S5) - in 2, out 8. Weak squares and holes.
8. `FND.PROMOTE` (T0, S1) - in 3, out 7. Promotion.
9. `FND.STALEMATE` (T0, S1) - in 1, out 8. Stalemate.
10. `CAL.TREE` (T4, S4) - in 2, out 7. The analysis tree.

What this says: the safety count (`SAF.COUNT`), what a piece attacks (`FND.ATTACK`), and the threat check (`SAF.THREAT`) are the roots of almost everything tactical, so their D1-D2 items carry most of the graph's weight and their quality matters more than any other single piece of content. `POS.ACTIVITY` and `POS.WEAKSQ` play the same role for the positional strand, and `CAL.DEFENSE`/`CAL.TREE` for calculation.

## 5. Judgement calls (the places where the map was ambiguous)

**Merged (one id where several sheets proposed duplicates, as MAP11 §3 says):** `POS.TEMPO` (Z-B) into `OPN.TEMPO` · `END.KINGPOWER` (Em. Lasker) and `END.KING-ACTIVE` (Cap/Nimz) into `END.KING-ACTIVE` · `END.THEORY.WRONGB` (Cap) into `END.WRONG-BISHOP` · `POS.OPENFILE.SWITCH` into `POS.OPENFILE` (D3) · `END.ZUGZWANG` (Nimz + Em. Lasker) one node · `NEW FND.VALUE` (Ed. Lasker) into the foundation `FND.VALUE`, with the position-dependent half in `POS.VALUES`.
**Split or renamed:** the map's `FND.SPECIAL` became `FND.CASTLE`, `FND.ENPASSANT`, `FND.PROMOTE` (foundation; the foundation worker kept `FND.SPECIAL` as a 'which special move applies?' combiner) and `FND.DRAWS` (here; the foundation list left the draws out) · `OPN.REPERTOIRE.*` became `.WHITE` and `.BLACK` (mastery is tracked per colour) · `OPN.STRUCT.*` became one node `OPN.STRUCT` (it links lines to structures; the families themselves are `POS.STRUCTURE.CHAIN/IQP/HANGING/DOUBLED`) · `END.THEORY.*` became `END.THEORY.2N`, `END.THEORY.QvR` and a placeholder `END.THEORY.MUSTKNOW` · "real versus fictitious threats" (named in MAP11 §3 without an id) became `SAF.FICTITIOUS`.
**Tier placements that differ from the map's range:** `TAC.NONE` is one node at T3 although the map says "every tier" (every tactic node's unlabeled sets are meant to feed it) · `END.ZUGZWANG` T3 (map: T3 D1 / T4 D3) · `POS.VALUES` T4 (map: T0 D1 and T4; the D1 warning lives in the foundation `FND.VALUE`) · `SAC.TYPES` at the low end of its T4-T6 range, so that `ATK.GREEKGIFT` (T4) is reachable · `END.QUEEN-PAWN` T4 as the v1 map says (the Ed. Lasker sheet suggested T5-6) · `CAL.TREE` T4 (map T3-4) · `ATK.CASTLED` T4 (map T3-4) because it needs `DEF.SHELTER` (T3).
**Prerequisite choices:** the Greek gift's D1 needs only the castled-king idea (`ATK.CASTLED.D1`); the sacrifice-types node is needed from D2, and declined-line calculation from D3 (hard-wiring all of it at D1 would put a whole tier behind a Tier 4 lesson). Skewer and discovered attack do *not* depend on the pin (the pin is a soft link and the best teaching contrast). Habit nodes (`PRA.CLOCK`, `SELF.1`) depend on a single weak rules prerequisite because "has played a game" is a milestone, not a node.
**Ambiguity kept visible:** `END.REMOTE` is undefined in the map; it is read here as the remote passed pawn used as a decoy (Nimz #19). `END.PAWN-TEMPO` is carried as `status: blocked` with depths D0-D1 only, as MAP11 says. `END.THEORY.MUSTKNOW` is `status: placeholder`.
**Replaced file:** `content/skills/TAC.FORK.json` (the v0 example) was overwritten with the full node; its two prerequisites `FND.ATTACK.D1` and `FND.THREAT.D1` became `FND.ATTACK.D1/D2` and `SAF.COUNT.D2`.

## 6. Gaps found in the map

1. **Mate search.** Between `FND.MATE1` and `TAC.MATE-PATTERNS` there is no "mate in two / forced-mate search" node; it is folded into `TAC.MATE-PATTERNS` D2 but deserves its own node or a `LOOP.V2` depth.
2. **Endgame breadth.** No knight endings, queen-and-pawn endings (only queen against a pawn), rook against minor pieces beyond the mating-material classification, rook-pawn special cases, or rook endings beyond Lucena/Philidor/activity. The de la Villa and Silman CEC sheets would define them; `END.THEORY.MUSTKNOW` stands in.
3. **Structure families.** Only four `POS.STRUCTURE.*` families are sheet-backed (chain, isolani, hanging pawns, doubled pawns). Carlsbad, Maroczy, Hedgehog, King's Indian chains and Sicilian structures need the Flores Rios and Soltis sheets.
4. **Exchange sacrifice.** Nimzowitsch, Capablanca and Z-B all praise giving the exchange for activity or to replace a blockader; `SAC.TYPES` covers reasons but there is no node for it.
5. **Practical resistance.** Capablanca's G6 note (playing on in a lost game hoping for a trap) and Z-B's advice to resign pull in opposite directions; the map has no swindle or resourcefulness node (`DEF.RESOURCES` only partly covers it).
6. **Endgame counting is not linked to calculation.** `END.SQUARE`, `END.PAWN-FLANK` and `CAL.*` share no prerequisite, although exact counting is calculation.
7. **Foundation count and ids.** The assignment said 25 foundation ids and listed 24; the foundation worker also wrote `FND.SPECIAL` (a "which special move?" combiner, not in the map), which makes 25. Draws are in neither: `FND.DRAWS` is ours. Earlier item files that pointed at `FND.THREAT`, `FND.POSITIONTYPE` and `FND.DRAW` (none of which exist) have since been corrected: every skill reference in `content/items` and `content/lessons` resolves to a node and depth in this graph.
8. **Thin source support.** The five sheets say almost nothing about `TAC.SKEWER`, `TAC.INTERFERE`, `TAC.CLEARANCE`, `TAC.ZWISCHENZUG`, `TAC.DESPERADO`, `TAC.UNDERPROMOTE`, and little about S4, S9, S10 and S11. Their conditions are marked `[ours]` or rest on the council document; they are the first lines to check.
9. **Calibration.** Every tier is G0. Tiers 2-3 of S3 are the first candidates to upgrade to G1 with the Lichess puzzle data.

## 7. What is not verified

No position was authored, so nothing here is checked by engine or tablebase; the sheets' [CHECK] flags carry over as flags in the `conditions` text (for example the K+P frame, the opposition wording, rook-ending cut-off criteria, the Philidor skeleton). Outcomes are written to be observable, but no item exists yet that tests them. Tiers and depths are expert estimates.

## 8. Running the check

```
./tools/.venv/Scripts/python.exe -I tools/check_graph.py          # full report
./tools/.venv/Scripts/python.exe -I tools/check_graph.py --quiet  # errors, warnings, one summary line
```

Options: `--top N`, `--json`, `--strict` (warnings fail), `--skills DIR` (test on a copy), `--no-route`. Exit status 1 on any error.

## 9. Inventory

### S1 Rules and board vision (20 nodes)

| ID | T | Title | Hard prerequisites (nodes) | Flags |
|---|---|---|---|---|
| `FND.ATTACK` | 0 | Attacked and defended squares | `FND.CAPTURE`, `FND.PIECE.PAWN` |  |
| `FND.BOARD` | 0 | Squares and notation | - |  |
| `FND.CAPTURE` | 0 | Capturing and attack | `FND.PIECE.KNIGHT`, `FND.PIECE.PAWN`, `FND.PIECE.QUEEN`, `FND.VALUE` |  |
| `FND.CASTLE` | 0 | Castling | `FND.CHECK`, `FND.PIECE.KING`, `FND.PIECE.ROOK` |  |
| `FND.CHECK` | 0 | Check | `FND.CAPTURE`, `FND.PIECE.KING` |  |
| `FND.ENPASSANT` | 0 | En passant | `FND.CAPTURE`, `FND.CHECK`, `FND.PIECE.PAWN` |  |
| `FND.PIECE.BISHOP` | 0 | How the bishop moves | `FND.BOARD` |  |
| `FND.PIECE.KING` | 0 | How the king moves | `FND.BOARD` |  |
| `FND.PIECE.KNIGHT` | 0 | How the knight moves | `FND.BOARD` |  |
| `FND.PIECE.PAWN` | 0 | How the pawn moves | `FND.BOARD` |  |
| `FND.PIECE.QUEEN` | 0 | How the queen moves | `FND.PIECE.BISHOP`, `FND.PIECE.ROOK` |  |
| `FND.PIECE.ROOK` | 0 | How the rook moves | `FND.BOARD` |  |
| `FND.PROMOTE` | 0 | Promotion | `FND.CHECK`, `FND.PIECE.PAWN`, `FND.STALEMATE` |  |
| `FND.STALEMATE` | 0 | Stalemate | `FND.CHECK` |  |
| `FND.VALUE` | 0 | Piece values | `FND.PIECE.QUEEN` |  |
| `FND.DRAWS` | 1 | Ways a game is drawn | `FND.STALEMATE` | invented |
| `FND.MATE1` | 1 | Checkmate in one move | `FND.CHECK`, `FND.PROMOTE` |  |
| `FND.NOTATION` | 1 | Reading and recording moves | `FND.BOARD`, `FND.CASTLE` |  |
| `FND.SPECIAL` | 1 | Which special move applies | `FND.CASTLE`, `FND.ENPASSANT`, `FND.PROMOTE` | invented |
| `FND.VISUAL` | 3 | Board vision without the board | `FND.ATTACK`, `FND.NOTATION` |  |

### S2 Safety and the Thinking Loop (12 nodes)

| ID | T | Title | Hard prerequisites (nodes) | Flags |
|---|---|---|---|---|
| `LOOP.V1` | 1 | Thinking Loop v1: safety scan | `SAF.LOOSE`, `SAF.THREAT` |  |
| `SAF.COUNT` | 1 | Counting attackers and defenders | `FND.CAPTURE`, `FND.VALUE`, `SAF.LOOSE` | v1.1 |
| `SAF.DEFEND-OPTIONS` | 1 | Ways to meet an attack | `FND.CHECK`, `SAF.COUNT`, `SAF.LOOSE`, `SAF.THREAT` | v1.1 |
| `SAF.LOOSE` | 1 | Loose pieces | `FND.ATTACK` |  |
| `SAF.THREAT` | 1 | What does their last move threaten? | `FND.MATE1`, `SAF.LOOSE` |  |
| `LOOP.V2` | 2 | Thinking Loop v2: checks, captures, threats | `LOOP.V1`, `SAF.COUNT` |  |
| `SAF.FICTITIOUS` | 2 | Real and fictitious threats | `SAF.THREAT`, `TAC.PIN` | invented, v1.1 |
| `LOOP.V3` | 3 | Thinking Loop v3: candidates and short lines | `CAL.CANDIDATES`, `LOOP.V2` |  |
| `SAF.COUNT.FUTURE` | 3 | Counting what can arrive | `CAL.CANDIDATES`, `SAF.COUNT` | v1.1 |
| `LOOP.V4` | 4 | Thinking Loop v4: compare resulting positions | `CAL.COMPARE`, `LOOP.V3` |  |
| `LOOP.V5` | 5 | Thinking Loop v5: depth allocation and best defence | `CAL.DEPTH`, `LOOP.V4` |  |
| `LOOP.V6` | 6 | Thinking Loop v6: elimination and verification | `CAL.BLIND`, `CAL.DEPTH`, `LOOP.V5` |  |

### S3 Tactics (23 nodes)

| ID | T | Title | Hard prerequisites (nodes) | Flags |
|---|---|---|---|---|
| `TAC.BACKRANK` | 2 | Back-rank mates | `FND.MATE1`, `SAF.THREAT` |  |
| `TAC.DISCOVER` | 2 | Discovered attacks and checks | `FND.ATTACK`, `FND.CHECK` |  |
| `TAC.DOUBLE-CHECK` | 2 | Double check | `TAC.DISCOVER` |  |
| `TAC.FORK` | 2 | Forks (double attacks) | `FND.ATTACK`, `SAF.COUNT` |  |
| `TAC.PIN` | 2 | Pins | `FND.ATTACK`, `FND.CHECK`, `SAF.COUNT` |  |
| `TAC.SKEWER` | 2 | Skewers | `FND.ATTACK`, `FND.VALUE` |  |
| `TAC.DECOY` | 3 | Decoy | `FND.MATE1`, `TAC.DEFLECT` |  |
| `TAC.DEFLECT` | 3 | Deflection | `TAC.REMOVE-DEFENDER` |  |
| `TAC.MATE-PATTERNS` | 3 | Mating patterns | `FND.ATTACK`, `TAC.BACKRANK` |  |
| `TAC.NONE` | 3 | Is there a tactic at all? | `SAF.COUNT`, `TAC.FORK`, `TAC.PIN` |  |
| `TAC.OVERLOAD` | 3 | Overloaded defenders | `TAC.REMOVE-DEFENDER` |  |
| `TAC.REMOVE-DEFENDER` | 3 | Removing the defender | `SAF.COUNT`, `TAC.PIN` |  |
| `TAC.STALEMATE-TRICK` | 3 | Stalemate as a resource | `END.MATE-STALEMATE-AVOID`, `FND.STALEMATE` |  |
| `TAC.TRAPPED` | 3 | Trapped pieces | `FND.ATTACK`, `SAF.COUNT` |  |
| `TAC.ZWISCHENZUG` | 3 | In-between moves | `LOOP.V2`, `SAF.COUNT` |  |
| `TAC.CLEARANCE` | 4 | Clearance | `TAC.DEFLECT` |  |
| `TAC.COMBO` | 4 | Multi-motif combinations | `CAL.TREE`, `TAC.MATE-PATTERNS`, `TAC.REMOVE-DEFENDER` |  |
| `TAC.DESPERADO` | 4 | Desperado pieces | `SAF.COUNT`, `TAC.ZWISCHENZUG` |  |
| `TAC.INTERFERE` | 4 | Interference | `TAC.OVERLOAD` |  |
| `TAC.PERPETUAL` | 4 | Perpetual check | `CAL.DEFENSE`, `FND.DRAWS`, `LOOP.V2` |  |
| `TAC.UNDERPROMOTE` | 4 | Underpromotion | `FND.PROMOTE`, `TAC.FORK`, `TAC.STALEMATE-TRICK` |  |
| `TAC.XRAY` | 4 | X-ray and batteries | `SAF.COUNT`, `TAC.SKEWER` |  |
| `TAC.QUIET-MOVE` | 5 | The quiet move in a combination | `CAL.DEFENSE`, `TAC.COMBO` |  |

### S4 Calculation (8 nodes)

| ID | T | Title | Hard prerequisites (nodes) | Flags |
|---|---|---|---|---|
| `CAL.CANDIDATES` | 3 | Candidate moves: list and prune | `CAL.VISUALIZE`, `LOOP.V2` |  |
| `CAL.VISUALIZE` | 3 | Visualising a line | `FND.VISUAL`, `SAF.COUNT` |  |
| `CAL.COMPARE` | 4 | Comparing resulting positions | `CAL.TREE`, `POS.ACTIVITY`, `POS.IMBALANCES` |  |
| `CAL.DEFENSE` | 4 | The opponent's best resource | `CAL.TREE`, `SAF.THREAT` |  |
| `CAL.TREE` | 4 | The analysis tree | `CAL.CANDIDATES`, `CAL.VISUALIZE` |  |
| `CAL.BLIND` | 5 | Entering variations without the pieces | `CAL.TREE`, `CAL.VISUALIZE` |  |
| `CAL.DEPTH` | 5 | How deep, and when to stop | `CAL.COMPARE`, `CAL.DEFENSE` |  |
| `CAL.ENDURANCE` | 6 | Long lines and accuracy under fatigue | `CAL.BLIND`, `PRA.PRESSURE` |  |

### S5 Positional play and planning (45 nodes)

| ID | T | Title | Hard prerequisites (nodes) | Flags |
|---|---|---|---|---|
| `POS.ACTIVITY` | 2 | Piece activity | `FND.ATTACK`, `FND.VALUE` |  |
| `POS.CONNECT` | 2 | Connecting the rooks | `OPN.PRINCIPLES` |  |
| `POS.OPENFILE` | 2 | Open files | `POS.ACTIVITY`, `SAF.COUNT` |  |
| `POS.SEVENTH` | 2 | The seventh rank | `POS.OPENFILE`, `TAC.FORK` |  |
| `POS.BISHOPS` | 3 | The bishop pair | `POS.EXCHANGE`, `POS.GOODBAD` |  |
| `POS.BLOCKADE` | 3 | Blockading a passed pawn | `POS.OUTPOST`, `POS.PASSED` |  |
| `POS.CENTER.CONTROL` | 3 | Controlling the centre | `OPN.PRINCIPLES`, `POS.WEAKSQ` |  |
| `POS.EXCHANGE` | 3 | Which trades help | `FND.VALUE`, `POS.ACTIVITY` |  |
| `POS.GOODBAD` | 3 | Good and bad pieces | `FND.PIECE.BISHOP`, `POS.ACTIVITY` |  |
| `POS.MAJORITY` | 3 | Pawn majorities | `END.OPPOSITION`, `POS.PASSED` |  |
| `POS.OUTOFPLAY` | 3 | Pieces out of play | `POS.GOODBAD`, `TAC.TRAPPED` |  |
| `POS.OUTPOST` | 3 | Outposts | `FND.PIECE.KNIGHT`, `POS.WEAKSQ` |  |
| `POS.PASSED` | 3 | Passed pawns | `END.PAWN-RACE`, `POS.WEAKSQ` |  |
| `POS.PAWNMOVE` | 3 | What does this pawn move leave behind? | `POS.PAWNWEAK`, `POS.WEAKSQ` |  |
| `POS.PAWNWEAK` | 3 | Pawn weaknesses | `FND.PIECE.PAWN`, `POS.WEAKSQ`, `SAF.COUNT` |  |
| `POS.PLAN` | 3 | Making a plan you can carry out | `POS.ACTIVITY`, `POS.TARGET` |  |
| `POS.PLAN.DIFF` | 3 | The key difference between the two sides | `POS.ACTIVITY`, `POS.PLAN` |  |
| `POS.TARGET` | 3 | Choose a target that cannot move | `POS.PAWNWEAK`, `SAF.COUNT` |  |
| `POS.WEAKSQ` | 3 | Weak squares and holes | `FND.PIECE.PAWN`, `POS.ACTIVITY` |  |
| `POS.BREAKS` | 4 | Pawn breaks and levers | `POS.CENTER.CONTROL`, `POS.PAWNMOVE` |  |
| `POS.CENTER.MOBILE` | 4 | The free mobile centre pawn | `POS.BREAKS`, `POS.CENTER.CONTROL` |  |
| `POS.IMBALANCES` | 4 | Imbalances checklist | `POS.PAWNWEAK`, `POS.PLAN.DIFF`, `POS.SPACE` |  |
| `POS.OBSTRUCT` | 4 | Obstructions | `POS.BLOCKADE`, `POS.WEAKSQ` |  |
| `POS.PIN.STRATEGIC` | 4 | Pins as strategy: asking the question | `POS.CENTER.CONTROL`, `TAC.PIN` |  |
| `POS.PLAN.MODE` | 4 | Active, passive or neutral: mode follows the evaluation | `CAL.COMPARE`, `POS.IMBALANCES` |  |
| `POS.PLAN.PIECES` | 4 | Allocating pieces to the plan | `POS.GOODBAD`, `POS.PLAN` |  |
| `POS.REASSESS` | 4 | Re-evaluating after changes | `LOOP.V4`, `POS.IMBALANCES` | recon. |
| `POS.SPACE` | 4 | Space and restriction | `POS.CENTER.CONTROL`, `POS.WEAKSQ` |  |
| `POS.STRUCTURE.CHAIN` | 4 | Pawn chains: attack the base | `POS.BLOCKADE`, `POS.BREAKS` |  |
| `POS.STRUCTURE.IQP` | 4 | Isolated queen's pawn | `POS.OUTPOST`, `POS.PAWNWEAK` |  |
| `POS.SWITCH` | 4 | Switch of wing | `POS.PLAN`, `POS.TARGET` |  |
| `POS.VALUES` | 4 | Piece values depend on the position | `FND.VALUE`, `POS.ACTIVITY` |  |
| `POS.CONVERT` | 5 | Converting an advantage | `END.TRANSITION`, `POS.EXCHANGE`, `POS.PLAN.MODE` |  |
| `POS.FREEING` | 5 | True and illusory freeing moves | `OPN.TEMPO`, `POS.BREAKS` |  |
| `POS.OVERPROTECT` | 5 | Over-protection | `POS.OUTPOST`, `POS.PROPHYLAXIS` |  |
| `POS.PLAN.RACE` | 5 | Racing plans | `CAL.COMPARE`, `POS.PLAN.PIECES` |  |
| `POS.PROPHYLAXIS` | 5 | Prophylaxis | `CAL.DEFENSE`, `POS.BREAKS`, `SAF.FICTITIOUS` |  |
| `POS.RESTRAINT` | 5 | Restraint | `POS.BLOCKADE`, `POS.PROPHYLAXIS`, `POS.SPACE` |  |
| `POS.STRUCTURE.DOUBLED` | 5 | Doubled pawns in context | `POS.BISHOPS`, `POS.PAWNWEAK` |  |
| `POS.STRUCTURE.HANGING` | 5 | Hanging pawns | `POS.BREAKS`, `POS.STRUCTURE.IQP` |  |
| `POS.TRANSFORM` | 5 | Favourable transformations | `POS.EXCHANGE`, `POS.IMBALANCES` |  |
| `POS.TWOWEAK` | 5 | Two weaknesses | `POS.SWITCH`, `POS.TARGET` |  |
| `POS.DYNAMIC` | 6 | Dynamic play | `INI.INITIATIVE`, `POS.EXCEPTIONS` |  |
| `POS.EXCEPTIONS` | 6 | When the rule fails | `OPN.NONDEV`, `POS.IMBALANCES`, `POS.REASSESS` |  |
| `POS.MANEUVER` | 6 | Manoeuvring against weaknesses | `POS.PLAN.PIECES`, `POS.TWOWEAK` |  |

### S6 Attack, sacrifice and defense (18 nodes)

| ID | T | Title | Hard prerequisites (nodes) | Flags |
|---|---|---|---|---|
| `ATK.CENTER` | 3 | Attacking a king in the centre | `ATK.SUPERIORITY`, `TAC.MATE-PATTERNS` |  |
| `ATK.SUPERIORITY` | 3 | Tangible superiority before attacking | `OPN.TEMPO`, `SAF.COUNT`, `SAF.COUNT.FUTURE` |  |
| `DEF.SHELTER` | 3 | Pawn cover in front of the king | `POS.PAWNMOVE`, `POS.WEAKSQ` |  |
| `ATK.CASTLED` | 4 | Attacking the castled king | `ATK.SUPERIORITY`, `DEF.SHELTER`, `SAF.COUNT.FUTURE`, `TAC.MATE-PATTERNS` |  |
| `ATK.COMMIT` | 4 | Committing to a direct attack | `ATK.CASTLED`, `CAL.DEFENSE` |  |
| `ATK.GREEKGIFT` | 4 | The bishop sacrifice on h7 (Greek gift) | `ATK.CASTLED`, `CAL.DEFENSE`, `SAC.TYPES` |  |
| `ATK.PACE` | 4 | Pace of the attack | `ATK.SUPERIORITY`, `SAF.COUNT.FUTURE` |  |
| `ATK.PAWNSTORM` | 4 | Pawn storms and opposite-side castling | `ATK.CASTLED`, `ATK.PACE`, `POS.PAWNMOVE` |  |
| `DEF.DIAGNOSE` | 4 | Diagnosing a worse position | `CAL.DEFENSE`, `POS.PLAN.DIFF` |  |
| `DEF.RESOURCES` | 4 | A defender's resources | `CAL.DEFENSE`, `SAF.DEFEND-OPTIONS`, `TAC.PERPETUAL` |  |
| `DEF.WAIT` | 4 | Defence by waiting | `POS.PAWNMOVE`, `SAF.FICTITIOUS` |  |
| `SAC.TYPES` | 4 | Types of sacrifice | `CAL.DEFENSE`, `CAL.TREE`, `TAC.MATE-PATTERNS` |  |
| `DEF.COUNTER` | 5 | Counter-attack | `ATK.PACE`, `DEF.DIAGNOSE`, `POS.PLAN.RACE` |  |
| `DEF.TRADES` | 5 | Defensive exchanges | `DEF.RESOURCES`, `POS.EXCHANGE` |  |
| `INI.INITIATIVE` | 5 | The initiative | `ATK.PACE`, `OPN.TEMPO`, `POS.PLAN.MODE` |  |
| `INI.THREAT` | 5 | The held threat | `INI.INITIATIVE`, `SAF.FICTITIOUS` |  |
| `DEF.FORTRESS` | 6 | Fortresses in the middlegame and ending | `DEF.TRADES`, `END.FORTRESS` |  |
| `INI.COMPENSATION` | 6 | Compensation for material | `INI.INITIATIVE`, `POS.CONVERT`, `SAC.TYPES` |  |

### S7 Endgames (34 nodes)

| ID | T | Title | Hard prerequisites (nodes) | Flags |
|---|---|---|---|---|
| `END.MATE-KQ` | 1 | Mate with king and queen | `FND.MATE1`, `FND.PIECE.QUEEN`, `FND.STALEMATE` |  |
| `END.MATE-KR` | 1 | Mate with king and rook | `FND.MATE1`, `FND.PIECE.ROOK`, `FND.STALEMATE` |  |
| `END.MATE-STALEMATE-AVOID` | 1 | Mating without stalemating | `END.MATE-KQ`, `FND.STALEMATE` | recon. |
| `END.OPPOSITION` | 1 | Opposition (basic: T1-2 depth only) | `END.PAWN-RACE`, `FND.STALEMATE` |  |
| `END.PAWN-RACE` | 1 | Pawn races and the square | `FND.CHECK`, `FND.PIECE.KING`, `FND.PROMOTE` |  |
| `END.KING-ACTIVE` | 2 | The king as a fighting piece | `END.PAWN-RACE`, `SAF.THREAT` | v1.1 |
| `END.BREAKTHROUGH` | 3 | Pawn breakthrough | `END.SQUARE`, `POS.PASSED` |  |
| `END.KEYSQ` | 3 | Key squares | `END.KPK`, `END.OPPOSITION` |  |
| `END.KPK` | 3 | King and pawn against king | `END.KING-ACTIVE`, `END.OPPOSITION` |  |
| `END.MATE-2B` | 3 | Mate with two bishops | `END.MATE-MATERIAL`, `END.MATE-STALEMATE-AVOID` | v1.1 |
| `END.MATE-MATERIAL` | 3 | Which material can force mate | `END.MATE-KQ`, `END.MATE-KR` | v1.1 |
| `END.OUTSIDE-PASSER` | 3 | The outside passed pawn | `END.KING-ACTIVE`, `END.SQUARE`, `POS.PASSED` |  |
| `END.PAWN-FLANK` | 3 | Pawn endings: act on the stronger flank | `END.KING-ACTIVE`, `END.PAWN-RACE` |  |
| `END.PAWN-RACE.QUEEN-FIRST` | 3 | Both sides queen: the first queen's move | `END.PAWN-RACE`, `FND.PROMOTE` |  |
| `END.SQUARE` | 3 | The rule of the square | `END.PAWN-RACE`, `FND.PROMOTE` |  |
| `END.ZUGZWANG` | 3 | Zugzwang | `END.KEYSQ`, `END.OPPOSITION` | v1.1 |
| `END.LUCENA` | 4 | Lucena: building the bridge | `END.ROOK-ACTIVE`, `FND.PROMOTE` |  |
| `END.MINOR` | 4 | Minor-piece endings | `END.KING-ACTIVE`, `POS.BISHOPS`, `POS.GOODBAD` |  |
| `END.OPPOSITION.DISTANT` | 4 | Distant and lateral opposition | `END.KEYSQ`, `END.OPPOSITION` |  |
| `END.PHILIDOR` | 4 | Philidor: the passive defence that works | `END.LUCENA`, `END.ROOK-ACTIVE` |  |
| `END.QUEEN-PAWN` | 4 | Queen against an advanced pawn | `END.KPK`, `TAC.STALEMATE-TRICK` |  |
| `END.ROOK-ACTIVE` | 4 | Active rooks in rook endings | `END.KING-ACTIVE`, `POS.PASSED`, `POS.SEVENTH` |  |
| `END.TEMPO` | 4 | Spare moves and knight parity | `END.ZUGZWANG`, `FND.PIECE.KNIGHT` |  |
| `END.FORTRESS` | 5 | Fortresses in endings | `END.WRONG-BISHOP`, `TAC.STALEMATE-TRICK` |  |
| `END.MATE-BN` | 5 | Mate with bishop and knight | `END.MATE-2B`, `FND.DRAWS` | v1.1 |
| `END.PAWN-TEMPO` | 5 | A unit that holds two: pawn-step timing | `END.TEMPO` | blocked, v1.1 |
| `END.REMOTE` | 5 | The remote passed pawn as a decoy | `END.OUTSIDE-PASSER`, `END.ZUGZWANG` |  |
| `END.THEORY.2N` | 5 | Two knights against a bare king and a pawn | `END.MATE-MATERIAL`, `FND.STALEMATE` | v1.1 |
| `END.TRANSITION` | 5 | Which ending to enter | `END.KPK`, `END.MINOR`, `POS.EXCHANGE` |  |
| `END.TRIANGULATION` | 5 | Triangulation | `END.OPPOSITION`, `END.TEMPO` |  |
| `END.WRONG-BISHOP` | 5 | The wrong-coloured bishop | `END.KPK`, `END.MINOR` | v1.1 |
| `END.THEORY.MUSTKNOW` | 6 | The must-know endings list | `END.PHILIDOR`, `END.TRIANGULATION` | invented, placeholder |
| `END.THEORY.QvR` | 6 | Queen against rook | `END.QUEEN-PAWN`, `TAC.STALEMATE-TRICK` | v1.1 |
| `END.TABLEBASE-LAB` | 7 | The tablebase lab | `END.THEORY.MUSTKNOW`, `END.THEORY.QvR` |  |

### S8 Openings and structures (12 nodes)

| ID | T | Title | Hard prerequisites (nodes) | Flags |
|---|---|---|---|---|
| `OPN.PRINCIPLES` | 1 | Opening principles (stub: outcomes only, no items yet) | `FND.CASTLE`, `SAF.COUNT`, `SAF.LOOSE` |  |
| `OPN.DEVIATION` | 2 | They left the book | `OPN.SETUP`, `SAF.THREAT` |  |
| `OPN.NONDEV` | 2 | Developing and time-wasting moves | `OPN.PRINCIPLES`, `SAF.THREAT` |  |
| `OPN.SETUP` | 2 | One simple setup with reasons | `OPN.PRINCIPLES`, `OPN.TEMPO` |  |
| `OPN.TEMPO` | 2 | Tempo: which moves helped | `OPN.NONDEV`, `POS.ACTIVITY` | v1.1 |
| `OPN.TRAPS` | 2 | Opening traps and sure material | `OPN.PRINCIPLES`, `SAF.THREAT` | v1.1 |
| `OPN.PUNISH` | 3 | Punishing an opening mistake | `OPN.TEMPO`, `OPN.TRAPS` | recon. |
| `OPN.REPERTOIRE.BLACK` | 3 | A reasons-first repertoire as Black | `GAME.OWN`, `OPN.DEVIATION`, `OPN.SETUP` | invented |
| `OPN.REPERTOIRE.WHITE` | 3 | A reasons-first repertoire as White | `GAME.OWN`, `OPN.DEVIATION`, `OPN.SETUP` | invented |
| `OPN.STRUCT` | 4 | Opening lines and the structures they lead to | `OPN.REPERTOIRE.WHITE`, `POS.STRUCTURE.CHAIN`, `POS.STRUCTURE.IQP` |  |
| `OPN.PREP` | 5 | Preparation of forcing lines | `CAL.TREE`, `OPN.STRUCT` |  |
| `OPN.NOVELTY` | 7 | Novelties and opponent preparation | `CAL.ENDURANCE`, `OPN.PREP` |  |

### S9 Game study and own-game analysis (7 nodes)

| ID | T | Title | Hard prerequisites (nodes) | Flags |
|---|---|---|---|---|
| `GAME.GUESS` | 3 | Guess the move | `CAL.CANDIDATES`, `POS.PLAN` |  |
| `GAME.OWN` | 3 | Annotating your own games before the engine | `FND.NOTATION`, `SELF.1` |  |
| `GAME.TAXONOMY` | 3 | Error taxonomy | `GAME.OWN`, `SELF.2` |  |
| `GAME.OPPORTUNITY` | 4 | The opportunity log | `GAME.TAXONOMY`, `TAC.NONE` |  |
| `GAME.PATTERNS` | 4 | Recurring errors across games | `GAME.OPPORTUNITY`, `SELF.3` |  |
| `GAME.FAMILIES` | 5 | Model games by structure | `GAME.GUESS`, `POS.STRUCTURE.CHAIN`, `POS.STRUCTURE.IQP` |  |
| `GAME.HISTORY` | 6 | How ideas changed over time | `GAME.FAMILIES`, `POS.EXCEPTIONS` | recon. |

### S10 Practical performance (8 nodes)

| ID | T | Title | Hard prerequisites (nodes) | Flags |
|---|---|---|---|---|
| `PRA.CLOCK` | 1 | Clock literacy | `LOOP.V1`, `SELF.1` |  |
| `PRA.BUDGET` | 2 | A simple time budget | `LOOP.V1`, `PRA.CLOCK` |  |
| `PRA.LOAD` | 2 | Sustainable training load | `PRA.RECOVER`, `SELF.2` |  |
| `PRA.RECOVER` | 2 | Recovering after a loss or a bad session | `SELF.2` |  |
| `PRA.SECURE` | 2 | Complacency when ahead | `LOOP.V1`, `SAF.THREAT` | v1.1 |
| `PRA.PHASEBUDGET` | 3 | Budgeting by phase | `GAME.OWN`, `PRA.BUDGET` |  |
| `PRA.PRESSURE` | 4 | Deciding under time pressure | `CAL.TREE`, `LOOP.V4`, `PRA.PHASEBUDGET` |  |
| `PRA.COMPETE` | 6 | Competition routine | `GAME.PATTERNS`, `PRA.PRESSURE`, `PRA.RECOVER` |  |

### S11 Self-direction (7 nodes)

| ID | T | Title | Hard prerequisites (nodes) | Flags |
|---|---|---|---|---|
| `SELF.1` | 0 | Self-direction 1: observe | `FND.CAPTURE` |  |
| `SELF.2` | 2 | Self-direction 2: explain | `LOOP.V1`, `SELF.1` |  |
| `SELF.3` | 3 | Self-direction 3: diagnose | `GAME.TAXONOMY`, `SELF.2` |  |
| `SELF.4` | 4 | Self-direction 4: plan with support | `GAME.PATTERNS`, `PRA.LOAD`, `SELF.3` |  |
| `SELF.5` | 5 | Self-direction 5: experiment | `GAME.PATTERNS`, `SELF.4` |  |
| `SELF.6` | 6 | Self-direction 6: lead | `PRA.LOAD`, `SELF.5` |  |
| `SELF.7` | 7 | Self-direction 7: investigate | `END.TABLEBASE-LAB`, `SELF.6` |  |
