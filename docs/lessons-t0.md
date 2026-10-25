# Tier 0-1 lessons for a true beginner (sessions 1-4 of `first-hours.md`)

Author worker note, 2026-10-24. 15 lessons, 135 hand-built items, 129 positions. All items pass `tools/validate.py` (255 claims, 0 failures) and all lessons pass `tools/validate_lessons.py` (0 errors, 0 warnings); `tools/check_all.py` reports 0 errors. Evidence labels: [V] verified by a validator run, [I] inference, [R] recalled from sources. Content wording is original; sources are listed in each lesson's `sources`.

Items live in `content/items/lesson-t0-1.json` ... `lesson-t0-7.json` (ids `IA0-n`, positions `PA0-n`). Volume comes from `practice` steps on the shipped generated corpus (tags `node.* + kind.generated`, each matching at least 3 shipped items [V by check_all]).

## Recommended order (teaching order, not file order)
The order follows CD-1 (rules through action, then check/mate/stalemate, then safety, then first games). Check and mate come before the capture lesson because the capture lesson uses the word "checkmate".

| # | Lesson | Skill.depth | Min | cards/boards/contrasts | Hand items | Practice (generated) |
|---|---|---|---|---|---|---|
| 1 | L-FND-BOARD-1 | FND.BOARD.D1 | 7 | 2/1/1 | 9 | FND.BOARD x8 |
| 2 | L-FND-ROOKBISHOP-1 | FND.PIECE.ROOK.D1 | 9 | 3/2/2 | 12 | ROOK x5, BISHOP x5 |
| 3 | L-FND-QUEENKING-1 | FND.PIECE.QUEEN.D1 | 10 | 3/2/1 | 9 | QUEEN x5, KING x5, cue-3 mix x6 |
| 4 | L-FND-KNIGHT-1 | FND.PIECE.KNIGHT.D1 | 8 | 2/2/1 | 7 | KNIGHT x6 |
| 5 | L-FND-PAWN-1 | FND.PIECE.PAWN.D1 | 9 | 2/2/2 | 10 | PAWN x6 |
| 6 | L-FND-CHECK-1 | FND.CHECK.D1 | 12 | 2/2/1 | 12 | CHECK x6, STALEMATE x4 |
| 7 | L-FND-MATE1-1 | FND.MATE1.D1 | 11 | 3/2/1 | 9 | MATE1 x8 |
| 8 | L-FND-CAPTURE-1 | FND.CAPTURE.D1 | 10 | 3/2/1 | 8 | CAPTURE x6 |
| 9 | L-FND-COUNT-1 | SAF.COUNT.D1 | 12 | 2/2/1 | 10 | LOOSE x6, COUNT x6 |
| 10 | L-FND-CASTLE-1 | FND.CASTLE.D1 | 8 | 2/1/1 | 7 | CASTLE x6 |
| 11 | L-FND-SPECIAL-1 | FND.ENPASSANT.D1 | 11 | 3/1/2 | 10 | ENPASSANT x4, PROMOTE x4 |
| 12 | L-FND-OPENING-1 | OPN.PRINCIPLES.D1 | 9 | 3/3/2 | 11 | none (no generated opening items) |
| 13 | L-FND-THREAT-1 | LOOP.V1.D1 | 12 | 3/1/1 | 8 | none (hand-built only) |
| 14 | L-END-MATEKQ-1 | END.MATE-KQ.D1 | 11 | 2/4/1 | 7 | none |
| 15 | L-END-MATEKR-1 | END.MATE-KR.D1 | 10 | 1/1/1 | 6 | none |

Mapping to `first-hours.md`: session 1 = lessons 1-5; session 2 = 6, 7, 8, 9; session 3 = 10, 11 and the first game (the app's game feature) after lesson 13; session 4 = 12, 13 (threat check, "mark one moment you were unsure"), 14, 15. The assignment said "about 8-10 lessons"; I split four topics to respect the 6-12 minute rule (capture/values vs counting; castling vs en passant/promotion/draws; opening habits vs threat check; K+Q vs K+R). Every lesson has at least one contrast step, one cue-3 item and a reflect step. Pawn promotion is previewed in lesson 5 (board plus one item) and tested in lesson 11.

Counts [V]: cue 1 = 38 items, cue 2 = 23, cue 3 = 72, cue 4 = 2 (the two `play_out` items). Tasks: predict_outcome 41, find_move 35, classify_position 31, select_squares 24, threat_detection 2, play_out 2. Review status: 103 `machine-only` (rules and legality), 32 `needs-human` (principles, values heuristics, engine-set items, technique, play-out); no item or lesson is `human-reviewed`.

## Contrast pairs (working / failing / irrelevant)
Flipped board (names do not change); rook blocked or not; bishop landing on enemy vs own piece; king capture of an unguarded vs guarded knight; knight b1 vs bishop c1 in a boxed-in start; pawn two-step vs one-step; pawn capture diagonal vs straight; mate vs stalemate (queen f8 vs f7); back-rank mate with and without luft; free vs guarded piece; count with pawn first vs knight first (same numbers); castle with a rook on f3 (failing) and on b8 (irrelevant); en passant now vs a move later; K+R vs K+N (an extra piece is not always enough); e4 vs a4 opening lines; Nf3 vs Nh3; Qxf7 with the knight on f6 vs h6; Ke6 vs Rg8+ with a king and rook.

## What I could not verify, and known weaknesses
1. **Cards state rules; claims verify only the examples.** Definitions such as "the king starts on e1", "a bishop keeps its colour", "pawn 1, knight 3, bishop 3, rook 5, queen 9", and the draw rules (repetition, fifty moves) are rules of chess or conventions, checked by me and by builder assertions (colour of squares, mobility counts), not by a validator claim. No claim type can test repetition or the fifty-move rule, so those appear only on a card (lesson 11); `FND.DRAWS.D1` (third occurrence) is therefore not trained. The K+N vs K draw is checked by tablebase and engine [V]; K+R vs K by tablebase [V].
2. **Opening habits are the weakest lesson.** A sound engine shows almost every sensible quiet move within about 0.3 pawns, so "a3 wastes time" cannot be claimed. Evidence used instead: piece mobility (rules facts), the engine's top moves for 1.e4/d4, Nf3/Nc3 and castling in two named positions, "at least a pawn worse" for 1.g4 and Nh3 (`move_loses`), and a mate in one for the Fool's mate. All 11 items are `needs-human`; claims like "castling is best here" can flip with a different engine build.
3. **"Value depends on position" has one worked example** (mate beats material, lesson 8) plus the guarded-rook case and the K+N draw (lesson 11). Trapped pieces, bishop pair and passed pawns are left to POS.VALUES.
4. **Accepted sets are complete by construction in most items** (legal moves enumerated by python-chess; all mates enumerated for the mate-in-one items). Exceptions: the mate-in-two sets (`KQ_m2a`, `KR_*`) come from a depth-12 MultiPV list of 8-10 lines; `O_first`, `O_nf3` accept only the moves named in the prompt; `T_stop` and `T_luft` list every non-losing move and add `move_loses` claims for the plausible losers, but not for every mating blunder. A learner who finds an equally good unlisted move would be marked wrong.
5. **Stalemate wording in feedback.** The stalemate positions after Qd6/Qg3 (lesson 14) and Qf7 (lesson 6) are verified by `game_state` claims on separate boards or items; the `find_move` items that mention them rely on `move_loses` plus that separate claim. Qc4 in `CK_find` is mentioned as stalemate but has no `game_state` claim of its own (I checked it with python-chess only).
6. **Engine evidence is depth 16 on a lite build**, not proof. "No mate in one" items (`M_luft`, `M_none`) are shown by an engine evaluation bound (no forced mate), not by an exhaustive negative claim, because no claim type says "no mate exists".
7. **Play-out items** (`KQ_play`, `KR_play`) claim only that the start position is a tablebase win; the app's move budgets (25 and 40 moves) are my estimate [I] (tablebase distance to mate is 9 and 15 moves).
8. **Board square-name items** use a rule claim that a piece stands on the square (`legal_destinations` of that piece) because no "piece on square" claim exists. The start-position statement "the white king starts on e1" has no claim.
9. **Overlap with other workers' lessons** (their files, not edited): `L-SAF-COUNT-1`, `L-SAF-LOOSE-1` (deeper: pins, overloaded defenders; they call a piece "loose" when undefended and "hanging" when also attacked) and `L-END-MATE-1` (the stalemate-trap drill for K+Q/K+R). My `L-FND-COUNT-1` defines *loose* as attacked and undefended (also called hanging), matching the validator's `loose_pieces` claim and the generated items; the two vocabularies conflict slightly and need one owner. Suggested order: my lessons 9, 14, 15 come first and their lessons deepen them. `check_all.py` still warns that skills FND.PIECE.BISHOP/KING, FND.PROMOTE, FND.STALEMATE, FND.DRAWS and FND.ATTACK have items but no lesson of their own (my lessons carry one skill each and train these as part of other lessons).
10. Ten of my positions are the same diagram as positions in other files (the first-hours set, `PA3-*`, `PA4-*`): `check_all.py` warns because families differ across files; I cannot merge families across files.

## Defects found in my own positions (before or at validation) [V]
Caught by reasoning or builder asserts before shipping, none reached a learner: a Black-to-move "nothing hangs" item where Black could simply win the white queen with a bishop (rebuilt as a White-to-move item); a "loose own piece" position with Black two rooks and a bishop down; a pawn-blocked item whose answer set was empty (rebuilt with a capture); a queen-and-king mate position that was illegal (side not to move in check); a mate-in-one set missing a fourth mate (Qb8); an unprotected-rook claim that counted the rook itself as a defender; a false sentence ("the queen confines the king to the back rank"); "Nh3 reaches half as many squares" (it reaches 3 against 5, rewritten without a number); a candidate count example (a bishop capture on a pawn guarded by a pawn, rook behind) where the engine's best defence declined the recapture, so the naive "lose a point" story was false (replaced by positions whose engine line matches the story); mislabelled skill depths (relabelled to the final skill graph). The validator caught no further claim failure.

## Open questions for the reviewer
- Should the first game (against the bot) sit between lessons 13 and 14, as `first-hours.md` has it, or after the castling and special-move lessons? The lessons assume the game feature exists only for the `reflect(unsure)` step.
- Opening habits: is a defaults-plus-mobility lesson acceptable, or should it wait for a model-game format (GAME.FAMILIES)?
- Who owns the words *loose/hanging* and the order of my lessons 9, 14, 15 against the SAF/END lessons?
- Items use `answer.options` for classify and predict tasks, and `select_squares` without `from` for "tap every piece that can capture". Confirm both shapes are supported by the app.
