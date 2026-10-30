# Positional and planning lessons (Tiers 2-4): author note

Author worker "positional". Ten lessons, 48 items, 44 positions. Evidence labels: [V] verified by `tools/validate.py` in this session (stockfish 19 lite, single thread, depth 16, recorded in `content/_evidence/`); [I] my inference; [H] hypothesis. All lessons and items are `needs-human` except pure rules / tablebase items (`machine-only`). Nothing here is `human-reviewed`.

Files: `content/lessons/L-POS-*.json`, `content/lessons/L-DEF-WAIT-1.json`; `content/items/lesson-pos-1.json` (16 items: OPENFILE, OUTPOST, ACTIVITY), `lesson-pos-2.json` (14: PAWNWEAK, BISHOPS, PASSED), `lesson-pos-3.json` (18: DEVELOPMENT, PLAN, WAIT, EXCHANGE). Ids: positions `PA2-n`, items `IA2-n`. Validator [V]: 136 claims, 136 pass; `validate_lessons.py`: 10 lessons, 0 errors, 0 warnings; `check_all.py`: no errors from these files.

## Method
Every contrast changes one feature of a verified base (a pawn, a piece square, a king square, or the rook). Positions were built from piece lists and swept with the engine; I read the engine's best lines before using a position. Four positions come from CC0 Lichess games (provenance `lichess_game`): DV_W, DV_CW, EX_A, EX_B; the F-versions and everything else are authored. Where a claim could not be checked, the idea is stated only in a card and labelled a rule of thumb.

## Lessons
| Lesson | Skill | Items | Contrast (one feature) | What is checked |
|---|---|---|---|---|
| L-POS-OPENFILE-1 | POS.OPENFILE | 7 | Black knight h5 -> e8 (covers c7); b6 -> b7 (pawn protects c6) | `attackers`, `best_move_in`, `material_after_move`, `move_loses` |
| L-POS-OUTPOST-1 | POS.OUTPOST | 5 | Black pawn b7 -> c7 (can play ...c6) | `legal_destinations`, `attackers`, `eval_range` bands (+50..+105 v <= +40) |
| L-POS-PAWNWEAK-1 | POS.PAWNWEAK | 4 | Black c-pawn c5 -> c7 (protects d6) | `attackers`, `material_after_move`, `move_loses` |
| L-POS-BISHOPS-1 | POS.BISHOPS | 5 | bishop c8 -> f8; extra pawn d6 | `legal_destinations` (mobility), `material_after_move`, `best_move_in` |
| L-POS-DEVELOPMENT-1 | OPN.TEMPO | 5 | Ng8 -> f6; e4 -> e3 | `best_move_in`, `move_loses`, `material_after_move` |
| L-POS-ACTIVITY-1 | POS.ACTIVITY | 4 | rook behind the pawn v in front | tablebase (exact), `legal_destinations`, `best_move_in` |
| L-POS-PASSED-1 | POS.PASSED | 5 | Black king in front of the pawn v cut off | tablebase (exact) |
| L-POS-PLAN-1 | POS.PLAN | 4 | plan target (king g1 on a second skeleton) and carryability; split 2026-10-30 | `mate_in`, `move_loses` |
| L-POS-PLAN-DIFF-1 | POS.PLAN.DIFF | 7 | White king g1 -> b1, h1, c1; irrelevant a2-a3 | `mate_in`, `move_loses`, `best_move_in` |
| L-DEF-WAIT-1 | DEF.WAIT | 5 | pawn e5 -> e6 | tablebase (exact, per move) |
| L-POS-EXCHANGE-1 | POS.EXCHANGE | 4 | which piece takes / which trade | `best_move_in`, `move_loses`, `material_after_move` |

Each lesson has: a card, a worked board, a cue-1/2 item, a conditions card, a contrast step (predict first), 2 cue-3 items (one where the idea does not apply), and a reflect step. OPENFILE and BISHOPS have two contrast steps.

## What the learner can do afterwards that they could not before
OPENFILE: name the entry square and check who covers it before doubling rooks; count a blocking pawn's attackers and defenders. OUTPOST: check protection and the neighbouring pawns before planting a knight. PAWNWEAK: test whether a "weak" pawn can be protected by a pawn before attacking it. BISHOPS: count a bishop's squares; decide whether a bishop trade wins something. DEVELOPMENT: count developed pieces on both sides before sacrificing; tell when castling is urgent. ACTIVITY: count squares, improve the worst piece, rook behind the passed pawn. PASSED: judge a blockade by whether the blockader arrives in time. PLAN: list differences (king position can beat an extra pawn) and check the target still exists. WAIT: hold a good set-up while the opponent has no way forward, and switch when he has. EXCHANGE: compare the piece given up and the piece kept.

## Weak claims (read these before trusting a lesson)
- All engine claims are depth-16 single-thread evidence, not proofs. Measured scores move by 20-60 cp between depths and with the MultiPV count (e.g. one position scored 72 cp with six lines and 132 cp with five). Thresholds in claims are set with margin (usually half the measured value); a re-run on another build may need adjustment.
- OUTPOST: the contrast is an evaluation difference of about 70-100 cp between the b7 and c7 versions [V], not a forced result. "No pawn can ever attack d5" rests on the rule that pawns never move backward and the visible pawn placement; the validator checks only the current attackers and the b-/c-pawn's legal squares.
- BISHOPS: the bad-bishop position also has the king on d7 blocking the bishop, so the immobility has two causes; the claim shows immobility and the Ng5 gain, not the pawn-colour rule. The bishop pair itself is not tested (the second contrast is about a trade that wins a pawn). Capablanca's pawn-colour rule 1 is deliberately not taught.
- OPENFILE: the lever and the sacrifice have no positive verified example (card text only; a search of 4,620 doubled-rook positions found no rook sacrifice on the c6 pawn that the engine rated best). The seventh-rank invasion wins a pawn only in these set-ups; in many symmetric rook endings it is worth about +0.2 [V sweeps].
- PAWNWEAK: only the backward pawn is tested; doubled and isolated pawns appear in the card only.
- DEVELOPMENT: two sacrifice pairs and one castling pair, all engine-based; the "lead" is a count of developed pieces, not a measured quantity. The f7 theme overlaps `L-OPN-PUNISH-1` (that lesson shows why it usually fails; this one shows the licensed case).
- ACTIVITY: "connect your rooks" has no item (no claim type can check it); it is a rule of thumb in the first card. The rim-knight item (Nb5) wins a pawn, so it is partly tactical.
- PASSED: all positions are rook endings with one pawn (tablebase, exact). Middlegame blockade by a minor piece and "default, not duty" beyond the king-too-late contrast are not machine-checked.
- PLAN: only the king-position difference is tested. In the F positions the Black queen is also attacked by Nf3, so the change is not purely king safety.
- WAIT: the machine-checked part is one Philidor-type ending. Em. Lasker's middlegame advice (do not change your position needlessly) is a rule-of-thumb card only.
- EXCHANGE: the three positions are real games and tactically loaded (each good trade wins a pawn in the engine line). The claims show which trade is better and by how much, not why.

## Defects found in my own positions (all fixed or discarded)
Hand-built starts were wrong about half the time: unbalanced material (several), a hanging pawn that made the "positional" move a plain pawn grab (backward d6 base, outpost base with Rd1), a hanging Nf6 (bishop template), a back-rank mate after a rook trade (Rd1+), a rook-sac search that found nothing, a claim threshold that failed at validation (Bxf7+ loss 271 not 300; changed to 200), and two tablebase claims that failed only because the Lichess service was rate-limited (re-run passed). Random-piece sweeps gave unnatural positions and were dropped; mined real positions often contained a simply hanging piece and were filtered by requiring a sacrifice or a non-capturing balance.

## Needs a strong-player review
All ten lessons (every card's rule-of-thumb sentence); the OUTPOST and BISHOPS explanations; whether the four real-game positions are clear enough for a mid-level player; the choice of the Philidor-type waiting example for DEF.WAIT; the PLAN claim that king position outweighs a pawn in these two positions.

## Open questions
1. Should engine-only contrasts (OUTPOST, BISHOPS) be shown to learners as "the engine rates ... at least", or hidden behind a "tendency" label?
2. A claim type for "no enemy pawn can ever attack this square" (pawn permanence) and for "rooks connected" would remove two rule-of-thumb statements.
3. The shared tablebase cache is rewritten in full (14 MB) on each new query; parallel validators were slow and twice hit service errors.
