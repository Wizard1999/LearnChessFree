# Positional exercises (strand S5 and neighbours): method, counts, what the claims prove

Written by the positional-exercise generator run (ids `IP-` items, `PP-` positions, files `content/items/pos-*.json`, scripts `tools/positional/`). Evidence labels: **[V]** verified here by a command that was run, **[I]** inference, **[H]** hypothesis. Everything below the counts is about what is and is not proved.

## 1. What was built

- **A hardened validator first.** `tools/validate.py` now writes the Lichess tablebase cache atomically under an OS file lock with merge-on-write (a parallel run no longer loses or corrupts entries; `tools/selftest.py` part 4 runs four writers and checks 190 of 190 entries survive; without the lock the same test kept 90 of 190 [V]). `legal_destinations` lists a promotion square once. New claim types: `move_is_not_mate`; `null_move_first` for `material_after_move`, `quiet_position` and `move_is_not_mate` (claims about what the OPPONENT could do); `after_move` and `after_moves` (a position after a move or a move sequence) for the structure claims, `attackers` and `loose_pieces`; and the structure claims `pawn_set`, `pawn_islands`, `open_files`, `holes`, `outposts`, `bishop_pair`, `pawn_colours`, `mobility`, `king_pawn_shield`, `space`, `rooks_connected`, `piece_on`, `king_wing`, `moves_where`, `piece_attacks`, `pawn_attackers`, `wing_pawns`. Definitions: `tools/structure.py` (docstring) and `docs/content-schema.md`. `tools/.validator-hardened` marks the work as finished.
- **Self-test that rejects planted defects** (`tools/selftest.py`, run it after any change to the validator): (1) the old four planted defects; (2) 102 hand-derived good claims accepted and 51 planted wrong claims rejected (`tools/tests/make_structure_tests.py`, expected values derived by hand, never by the code under test; one of my own hand derivations was wrong and the test caught it); (3) a differential test of `tools/structure.py` against an independent naive implementation (`tools/tests/test_structure_naive.py`) on 600 real and random boards, both colours (a deliberately mutated outposts or backward rule is caught on 295 and 259 of 300 random boards [V]); (4) the cache concurrency test.
- **Item banks** (counts in section 4): family A, exact structure recognition; family B, engine-checked quiet moves from real games; plus tablebase pawn endings, named structures and exchange effects.

## 2. Method

1. **Pool.** `tools/corpus/out/game_candidates.jsonl`: 195,887 positions from 24,656 Lichess standard rated games (January 2013 sample, CC0), players rated about 1600 to 2260. `tools/positional/build_index.py` keeps only **calm** positions (not in check; no capture wins material by static exchange for the side to move, and none for the opponent either, tested by letting the side to move pass): 119,142 positions. For each it stores the exact structure features and the complete sets of moves with each move property. Moves, bare positions and facts only; no text from any source.
2. **Selection.** Each generator streams the index, takes a seeded random sample per selector, and builds items from real positions (family = the game, `FAM-PS-<gid>`, so positions of one game never straddle practice and test). At most two items per game within one generator module.
3. **Contrast pairs.** A near-miss pair is two items asking the same yes/no question about the same pawn or square; the second position is the first with ONE pawn pushed one or two squares, or moved one file sideways (or one bishop replaced by a knight), chosen by search so that the exact answer flips. Both positions are valid and calm; the edited one is labelled `generated` with the edit described in its provenance. Edits are not legal game moves in general (a sideways shift is not a chess move) and the positions may be unreachable in a game [V by construction].
4. **Pre-check, then validate.** Every claim is checked with `validate.check_claim` while generating (rejects are counted, never loosened), then again by `tools/validate.py` which writes the evidence; `tools/build_content.py` ships an item only if its evidence hash matches.
5. **Independent audit.** `tools/positional/audit.py` re-derives the ANSWER of every item of the 70 or so rule-based templates from the FEN with the naive second implementation and compares it with the stored answer (claims prove sets; they do not prove that the answer was copied from the right set), checks the item contract (three hints, answer among unique options, accepted moves legal, ids, no duplicate positions across all my files).
6. **Cue rule used.** Cue 1 = the prompt names the feature and asks to find or apply it (this includes yes/no questions such as "is this pawn isolated?"). Cue 2 = a themed set: the prompt does not name a single feature but the options are the features of one theme, or the situation is described by its material. Cue 3 = nothing in the prompt names a feature: the **which-statement-is-true** items (four statements across features plus "none is true", about 25% have no true statement), the unlabelled named-structure items and the engine-checked "find a strong move" items. The authoring guide forbids a named theme in a cue-3 prompt, so recognition items cannot be cue 3; this is why cue 3 is not the majority (see the counts and the gate G3).

## 3. Item families, what each claim proves, and what it does not

All claims are exact computations in `tools/structure.py` unless the table says engine or tablebase. "Proves" is the machine-checked statement; "does not prove" is what the item must never say.

| Template (tag `tpl.`) | Nodes | Task, cue | Proves | Does not prove |
|---|---|---|---|---|
| `iso-select`, `dbl-select`, `back-select`, `weak-union`, `weak-count`, `pawn-kind`, `islands-n`, `pair-iso`, `pair-back` | POS.PAWNWEAK | select / classify / yes-no, 1-2 | the exact set of isolated, doubled, backward pawns of a colour; the exact pawn islands | that a weak pawn is a real weakness (compensation, phase) |
| `passed-select`, `prot-passed`, `conn-passed`, `passed-cat`, `pair-passed` | POS.PASSED | select / classify / yes-no, 1 | exact passed, protected passed, connected passed pawns | that pushing them is good |
| `maj-select`, `maj-wing` | POS.MAJORITY | select / classify, 1 | the exact majority pawns and the pawn counts per wing (a-d, e-h) | that the majority wins |
| endings (`find_move`, classify) | POS.MAJORITY | find / classify, 2 | Lichess tablebase result of a K+3P v K+2P position, and of each accepted move | any rule such as "push the candidate first" |
| `iqp-recog`, `iqp-block` | POS.STRUCTURE.IQP | classify / select, 1 | an isolated pawn on the d-file; the empty square in front of it | the plan for either side |
| `chain-base`, `chain-lever` | POS.STRUCTURE.CHAIN | select / find, 1 | the pawn that defends and is defended by pawns in a chain of three; the exact set of pawn moves that attack the base | that the lever is good |
| `hang-select`, `pair-hang` | POS.STRUCTURE.HANGING | select / yes-no, 1 | the exact pair (side by side on the 4th or 5th relative rank, alone on their files and flanks, no enemy pawn on their files) | the three plans for hanging pawns |
| `target` | POS.TARGET | select, 1 | backward pawns on a file with no enemy pawn | that the pawn can be won |
| `out-select`, `out-move`, `out-yn`, `out-pick`, `pair-out` | POS.OUTPOST | all four tasks, 1-2 | the exact outpost squares (definition in the prompt), the complete set of knight or bishop moves that land on one, the reason a square fails (no supporting pawn, or an enemy pawn that can still advance to attack) | that a pawn capture cannot dislodge the piece (captures that change a pawn's file are ignored); that the move is good |
| `hole-select`, `hole-yn`, `hole-pick`, `pair-hole` | POS.WEAKSQ | select / yes-no / pick, 1-2 | the exact holes (rank 3-5 squares no own pawn can ever attack, by advancing) | that an enemy piece can use the hole |
| `pm-holes`, `pm-class`, `sh-new`, `sh-pick` | POS.PAWNMOVE, DEF.SHELTER | select / classify, 1-2 | the exact change in holes, isolated and backward pawns caused by one pawn push (claims before and after) | that the move is dangerous or safe in the game |
| `space-n`, `space-ctl`, `space-who`, `pair-space`, `centre-n`, `centre-who` | POS.SPACE, POS.CENTER.CONTROL | classify / yes-no, 1-2 | counts of squares in the opponent's half (or the four central squares) attacked by pawns; pawns standing on the centre | real space or control: pieces are not counted |
| `blk-square`, `blk-move`, `blk-yn` | POS.BLOCKADE | select / find / yes-no, 1-2 | the stop square of a passed pawn, the complete set of moves that blockade it, whether an enemy non-pawn piece stands there | blockader quality |
| `bpair-cls`, `bpair-sel`, `pair-bpair` | POS.BISHOPS | classify / select / yes-no, 1 | who owns a light-squared and a dark-squared bishop | whether to keep the pair |
| `gb-cls`, `pair-gb` | POS.GOODBAD | classify / yes-no, 1 | the pawn counts on light and dark squares and the class under a stated rule (more than half of the side's pawns on the bishop's colour = bad) | how good the bishop really is |
| `act-cmp`, `act-min`, `oop` | POS.ACTIVITY, POS.OUTOFPLAY | classify / select, 1-2 | exact counts of attacked free squares or legal moves per piece | that few moves means out of play, or that more squares means a better move |
| `con-move`, `con-yn`, `con-between` | POS.CONNECT | find / yes-no / select, 1 | the complete set of moves that connect the rooks; who stands between them | that connecting is the best plan |
| `of-set`, `of-status`, `of-move`, `of-half` | POS.OPENFILE | classify / find, 1-2 | exact open and half-open file lists; the complete set of rook moves to an open or half-open file | that the file is useful |
| `sev-move`, `sev-sel` | POS.SEVENTH | find / select, 1 | the one rook move onto the seventh rank; the enemy pawns on that rank that the rook attacks | that the pawns are loose or the invasion is good |
| `sh-select`, `sh-n` | DEF.SHELTER | select / classify, 1 | the exact pawns on the three files around the king, two ranks deep | king safety |
| `cas-cmp` | ATK.CASTLED | classify, 1 | direct attacker and defender counts on a square next to the king | whether an attack works (pins and batteries are not considered) |
| `storm`, `lever` | ATK.PAWNSTORM | classify / find, 1 | the wings the kings stand on; the complete set of pawn moves that attack a shield pawn | that a storm is sound |
| `imbalances` (cue 3) | POS.PAWNWEAK, PASSED, OPENFILE, BISHOPS, OUTPOST, SPACE, MAJORITY, IMBALANCES | classify, 3 | four statements across features each with its own exact claim, so exactly one is true (or none) | the evaluation of the position |
| `doubled-ctx` | POS.STRUCTURE.DOUBLED | classify, 2 | doubled pawns plus which other feature is true | whether the compensation is enough |
| `struct` | OPN.STRUCT | classify, 1 and 3 | five named structures written as exact pawn squares and file conditions (my working definitions); every other structure fails one stated condition | which opening produced it |
| `exchange` | POS.EXCHANGE, POS.TRANSFORM | classify, 2 | exact before-and-after sets across a capture and its recapture (file opens, bishop pair lost, doubled, isolated or passed pawn gained, or nothing) | that the trade is good |
| `quiet-*` (family B) | POS.OUTPOST, OPENFILE, CONNECT, SEVENTH, BLOCKADE, TARGET, BREAKS, ACTIVITY | find_move, 2-3 | Stockfish 19 lite (one thread, depth 16) ranks the accepted move(s) best, all within 30 cp of the best and at most three; the exact structure fact about the move (for example `outposts` after the move); one tempting move is at least N cp worse (`move_loses`) | why the move is good: the reason in the explanation is labelled a rule of thumb. Engine output is evidence under recorded limits, not a proof. Status `needs-human` |

## 4. Counts

<!-- COUNTS START -->
**756 items on 756 positions** (719 families), 2520 claims; evidence records 2520/2520 pass. Cue 1: 366, cue 2: 167, cue 3: 223. Tasks: {'find_move': 179, 'classify_position': 356, 'select_squares': 133, 'predict_outcome': 88}. Review: {'needs-human': 171, 'machine-only': 585}. Positions: {'generated': 45, 'lichess_game': 711} (the 'generated' ones are the near-miss edits and the random tablebase endings).

Items per node (by the item's own skill node; tags add related nodes, so practice sets by `node.<ID>` are larger):

| node | items | cue 1 | cue 2 | cue 3 | depths |
|---|---|---|---|---|---|
| ATK.CASTLED | 14 | 14 | 0 | 0 | D1:14 |
| ATK.PAWNSTORM | 13 | 13 | 0 | 0 | D1:13 |
| DEF.SHELTER | 21 | 21 | 0 | 0 | D1:21 |
| OPN.STRUCT | 22 | 12 | 0 | 10 | D1:12, D2:10 |
| POS.ACTIVITY | 29 | 6 | 11 | 12 | D1:6, D2:23 |
| POS.BISHOPS | 29 | 16 | 0 | 13 | D1:12, D2:13, D3:4 |
| POS.BLOCKADE | 26 | 7 | 11 | 8 | D1:15, D2:11 |
| POS.BREAKS | 17 | 0 | 5 | 12 | D2:17 |
| POS.CENTER.CONTROL | 15 | 8 | 7 | 0 | D1:15 |
| POS.CONNECT | 28 | 15 | 4 | 9 | D1:15, D2:13 |
| POS.EXCHANGE | 12 | 0 | 12 | 0 | D1:12 |
| POS.GOODBAD | 15 | 15 | 0 | 0 | D1:9, D3:6 |
| POS.IMBALANCES | 28 | 0 | 0 | 28 | D1:20, D2:8 |
| POS.MAJORITY | 43 | 14 | 16 | 13 | D1:14, D2:29 |
| POS.OPENFILE | 62 | 15 | 15 | 32 | D1:23, D2:39 |
| POS.OUTOFPLAY | 12 | 12 | 0 | 0 | D1:12 |
| POS.OUTPOST | 69 | 24 | 16 | 29 | D1:16, D2:45, D3:8 |
| POS.PASSED | 46 | 33 | 0 | 13 | D1:25, D2:13, D3:8 |
| POS.PAWNMOVE | 17 | 10 | 7 | 0 | D1:10, D2:7 |
| POS.PAWNWEAK | 68 | 35 | 20 | 13 | D1:29, D2:27, D3:12 |
| POS.SEVENTH | 19 | 9 | 3 | 7 | D1:9, D2:10 |
| POS.SPACE | 33 | 20 | 0 | 13 | D1:14, D2:13, D3:6 |
| POS.STRUCTURE.CHAIN | 14 | 14 | 0 | 0 | D1:14 |
| POS.STRUCTURE.DOUBLED | 14 | 0 | 14 | 0 | D1:14 |
| POS.STRUCTURE.HANGING | 16 | 16 | 0 | 0 | D1:8, D3:8 |
| POS.STRUCTURE.IQP | 13 | 13 | 0 | 0 | D1:7, D2:6 |
| POS.TARGET | 23 | 8 | 4 | 11 | D1:8, D2:15 |
| POS.TRANSFORM | 14 | 0 | 14 | 0 | D3:14 |
| POS.WEAKSQ | 24 | 16 | 8 | 0 | D1:10, D2:8, D3:6 |

Items reachable by a `node.<ID>` tag (including secondary nodes): ATK.CASTLED 14, ATK.PAWNSTORM 28, DEF.SHELTER 21, OPN.STRUCT 22, POS.ACTIVITY 41, POS.BISHOPS 68, POS.BLOCKADE 32, POS.BREAKS 29, POS.CENTER.CONTROL 15, POS.CONNECT 28, POS.EXCHANGE 26, POS.GOODBAD 15, POS.IMBALANCES 133, POS.MAJORITY 94, POS.OPENFILE 156, POS.OUTOFPLAY 18, POS.OUTPOST 97, POS.PASSED 140, POS.PAWNMOVE 26, POS.PAWNWEAK 177, POS.SEVENTH 19, POS.SPACE 50, POS.STRUCTURE.CHAIN 18, POS.STRUCTURE.DOUBLED 23, POS.STRUCTURE.HANGING 16, POS.STRUCTURE.IQP 17, POS.TARGET 29, POS.TRANSFORM 14, POS.WEAKSQ 40.
<!-- COUNTS END -->

## 5. Definitions that simplify ordinary chess usage (decide at gate G2)

- **Outpost square**: relative rank 4-6, defended by an own pawn, no pawn on it, and no enemy pawn on a neighbouring file can attack it now or after advancing (blockers are ignored; pawn captures that change files are ignored). A knight that an enemy pawn capture can later dislodge may still count as being on an outpost.
- **Hole**: relative rank 3-5, no own pawn on it, no own pawn attacks it or can attack it by advancing (the same two simplifications).
- **Backward pawn**: a neighbouring own pawn exists, all neighbours are strictly further ahead, and an enemy pawn attacks the stop square (a piece on the stop square is ignored).
- **Hanging pawns**: two pawns side by side on the 4th or 5th relative rank, alone on their files and flanks, with no enemy pawn on their files. (The tightening to the 4th or 5th rank was made after the first generation showed 2nd-rank pairs.)
- **Pawn majority**: strictly more pawns than the opponent on files a-d or on files e-h.
- **Space and centre** count squares attacked by pawns only. **Mobility** counts legal destinations (or attacked squares not held by own pieces). **Pawn shield**: the three files around the king, the two ranks in front of it.
- **Named structures** (Carlsbad, isolated queen's pawn, Maroczy bind, hedgehog, advance French chain) are my own exact pawn-square definitions, written in `tools/positional/gen_struct.py`; they are working definitions for recognition practice and are not claimed to match any book.

## 6. What is not covered, and why

Nodes with no checkable fact (a plan, an evaluation or a judgement is the whole content): POS.PLAN, POS.PLAN.DIFF, POS.PLAN.MODE, POS.PLAN.PIECES, POS.REASSESS, POS.SWITCH, POS.CONVERT, POS.FREEING, POS.OVERPROTECT, POS.PLAN.RACE, POS.PROPHYLAXIS, POS.RESTRAINT, POS.TWOWEAK, POS.CENTER.MOBILE, POS.VALUES, POS.OBSTRUCT, POS.PIN.STRATEGIC, POS.DYNAMIC, POS.EXCEPTIONS, POS.MANEUVER. Also not covered: INI.* (initiative, held threat, compensation), DEF.DIAGNOSE, DEF.WAIT, DEF.COUNTER, DEF.TRADES, ATK.SUPERIORITY, ATK.CENTER, ATK.COMMIT, ATK.PACE, ATK.GREEKGIFT (other agents or tactics). Within covered nodes the higher depths that need judgement are not covered: keeping or trading the bishop pair, which plan to choose, whether a hole is usable, the quality of a blockader, the three plans for hanging pawns, what an IQP side should do, the cost of a transformation. The items train recognition of the features those judgements rest on, and engine-checked moves that happen to use them.

## 7. Known weaknesses

- Edited positions in pairs are not game positions (see method 3).
- The real positions are rated about 1600-2260 players from one month of 2013; structure frequencies follow that sample (for example Maroczy bind and hedgehog are rare: 239 and 32 matching positions among 119,142).
- Family B has a low yield (about 1.5% of the 8,922 screened candidates survived the checks: 98 items in the first batch, 35 in the second batch `pos-quietx-*.json`); only quiet moves (no capture, no check) are used and the accepted set is at most three moves within 30 cp.
- Hints are written by templates, not by a teacher; the cue-3 statements are mechanically phrased. All 'needs-human' items need Andrew's reviewer before they leave `needs-human`.
- The independent audit and the differential test share my reading of the definitions; they check the code against the definition, not the definition against chess usage (gate G2).

## 8. Gates and open questions for Andrew (logged, nothing blocks on them)

- **G1** Strong-player review of the engine-checked quiet-move items (status `needs-human`): are the rule-of-thumb sentences acceptable, and does the accepted set (within 30 cp) look fair?
- **G2** Approve or amend the working definitions in section 5 (especially outposts that ignore pawn captures that change file, backward pawns, hanging pawns, named structures).
- **G3** Cue policy: is "cue 3 = no theme named in the prompt" what you want, which makes recognition items cue 1 or 2? If you want cue 3 to be the majority, the cheapest route is more of the which-statement-is-true items per node and more family B items.
- **G4** The validator and `tools/structure.py` were changed (new claim types, locked cache). Review `docs/content-schema.md` section "Structure claims" and the self-test.
- **G5** Lessons still needed for: POS.ACTIVITY, CONNECT, SEVENTH, BISHOPS, GOODBAD, MAJORITY, BLOCKADE, PAWNWEAK, PASSED, WEAKSQ, PAWNMOVE, TARGET, CENTER.CONTROL, OUTOFPLAY, EXCHANGE, SPACE, IMBALANCES, STRUCTURE.* and DEF.SHELTER (only OPENFILE and OUTPOST have lessons). Practice steps can use the tags `node.<ID>`, `cue.<n>`, `tpl.<template>` and `contrast.working` / `contrast.failing` (pairs share a `contrast_group`).
- **G6** The quiet-move batch needs engine time to extend: each extra 40 items took more than an hour of engine time on a busy machine.

## 9. How to rerun

```
./tools/.venv/Scripts/python.exe -I tools/selftest.py                      # validator self-test (about 30 s)
./tools/.venv/Scripts/python.exe -I tools/positional/build_index.py 12     # index of calm positions (about 3 min)
./tools/.venv/Scripts/python.exe -I tools/positional/run_all.py            # all generators in order, then the audit
./tools/.venv/Scripts/python.exe -I tools/positional/gen_quiet.py          # family B (engine; ~10-60 min); add --extra for the second batch
./tools/.venv/Scripts/python.exe -I tools/positional/audit.py              # independent re-derivation of the answers
./tools/.venv/Scripts/python.exe -I tools/validate.py content/items/pos-pawns-1.json ...   # evidence (at most three runs at a time)
./tools/.venv/Scripts/python.exe -I tools/check_all.py ; ./tools/.venv/Scripts/python.exe -I tools/build_content.py
```
Seeds are fixed in each script (`SEED`); a rerun reproduces the same files for the same pool, index and sibling files. The quiet and ending outputs are never regenerated casually: the other generators avoid their positions (`pcommon.make_registry`). `tools/positional/report.py` prints the counts used in section 4.
