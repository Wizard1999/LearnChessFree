# Lessons: Thinking Loop, calculation, practical performance, self-direction

Author slice 5 (items `IA5-n`, positions `PA5-n`). Files: `content/lessons/L-LOOP-V1-1 … V5-1`, `L-CAL-DEFENSE-1`, `L-PRA-CLOCK-1`, `L-PRA-RECOVER-1`, `L-SELF-1-1 … 4-1`; items in `content/items/lesson-loop-1.json`, `-2.json`, `-3.json`. Evidence labels: [V] verified by `tools/validate.py` / `validate_lessons.py` or by my audit script, [I] inference, [H] hypothesis, [R] recalled.

## Status [V]
12 lessons, 69 items (64 + 49 + 46 = 159 claims), 67 positions. `validate.py`: all three item files pass 100%. `validate_lessons.py`: 12 of 12 lessons pass, 0 errors, 0 warnings. `check_all.py`: no error or warning mentions these files. Review status: 60 items `needs-human`, 9 `machine-only`; every lesson `needs-human`.

Extra check beyond the validator [V]: for every `find_move` item (32) I scored all legal moves at depth 14 (`multipv` = all) and required every move outside the accepted set to be at least 80 centipawns worse than the best. One candidate failed and was replaced (a recapture item whose second-best move was 23 cp behind). The validator alone would not have caught this; it only checks the listed moves.

## What each lesson is for
| Lesson | Skill / depth | Min | Items (cue 1/2/3) | The learner can afterwards |
|---|---|---|---|---|
| L-LOOP-V1-1 Safety scan | LOOP.V1 D1 | 9 | 7 (3/2/2) | run the two scan questions, find loose pieces, say why "defended" is not always "safe", and use the scan on the opponent's pieces too |
| L-LOOP-V2-1 Forcing moves first | LOOP.V2 D1 | 10 | 7 (2/2/3) | list checks, captures and threats first, count the opponent's legal replies to a check, test whether a check is safe |
| L-LOOP-V3-1 Candidates and short lines | LOOP.V3 D1 | 12 | 8 (3/3/2) | write a 2-4 move list, follow each for about three plies, list a piece's moves with some pieces hidden, name what a short line can miss |
| L-LOOP-V4-1 Compare positions | LOOP.V4 D1 | 10 | 6 (1/3/2) | compare the end positions of two recaptures with a four-question checklist; see that a tie in material is where comparison starts |
| L-LOOP-V5-1 How deep | LOOP.V5 D1 | 11 | 8 (2/4/2) | follow a forcing line to its end, tell critical moments from routine ones, give a reason to stop, log depth and worth |
| L-CAL-DEFENSE-1 Opponent's best reply | CAL.DEFENSE D1 | 11 | 8 (2/4/2) | test a tempting capture against the opponent's checks, captures and threats before playing it |
| L-PRA-CLOCK-1 Clock is a budget | PRA.CLOCK D1 | 10 | 4 (0/3/1) + 4 arithmetic fields | read 10+5, compute total and average time, keep a reserve, classify positions by how much clock they deserve |
| L-PRA-RECOVER-1 After a loss | PRA.RECOVER D1 | 9 | 3 (1/2/0) | separate result from decision, sort process from outcome goals, write a routine and a stopping rule in advance |
| L-SELF-1-1 Observe | SELF.1 D1 | 9 | 5 (1/3/1) | separate observation from guess, test a testable guess, write one unsure moment per game |
| L-SELF-2-1 Explain / calibrate | SELF.2 D1 | 11 | 5 (0/0/5) | give an answer and a confidence before feedback, read a small calibration table, write a two-sentence teach-back |
| L-SELF-3-1 Diagnose | SELF.3 D1 | 12 | 4 (0/2/2) | label a mistake with one of four boxes, tentatively, and test a diagnosis against an error log |
| L-SELF-4-1 Plan a block | SELF.4 D1 | 12 | 4 (1/1/2) | write a block (goal, practice, baseline, later check on unpractised tasks, what would change the plan) and revise it from evidence |

## Independence design: what the learner is told, and what is real
Every lesson has a card headed "What the app does for you now, and when it stops" and one silent item or silent off-app task.
- **LOOP.V1-V3** match `app/src/lib/loop.ts` [V, read]: prompts beside the board in these lessons, on request in mixed practice (the app notes that they were opened), retired after 5 mixed solves in a row with them closed. The card says "five is a first guess".
- **LOOP.V4, V5, CAL.DEFENSE, SELF.*, PRA.*** have no panel. The cards say so ("there is no checklist panel in this lesson") and state only what is true now (hints per item; a silent item switches hints and the engine off). Anything not built (time-per-move record, post-game summary, text export of notes, form asked "every third game") is written as "planned" or "the plan is", never as a present feature.
- **PRA.RECOVER** says plainly that the app cannot see games played elsewhere, so the routine only runs if the learner starts it. This is the one place where the independence is not a fade: it was never the app's to do.
- Thresholds (5 solves, every third game, five sessions) are labelled first guesses [H].
- Silent practice appears as (a) an `item` step with `"silent": true` (cue 3, no hints, no panel, no engine) and (b) an off-app task in a `plan` reflect ("write the result of the process goal before you look at your rating"; "start your own error log with the app closed").
- Honesty about failure: SELF.4 says "plans can fail" on its first card and again when revising (the plan, the check or the block length may be at fault, and with a few items you cannot tell which). SELF.1 and SELF.3 stress that labels are tentative and that guesses can be tested and refuted. Calibration, "habit to try" and similar hedges are used for every idea whose effect has not been measured; the one study referenced in a source line (Bilalic and colleagues 2008) is cited only in `sources`, not in learner text.

## Schema extensions used (the validator ignores them; the app needs to agree)
1. `item` and `practice` steps may carry `"silent": true` (hints, panel and engine off; "show me" logged) and `"ask_confidence": true` (ask low/medium/high before feedback). A `contrast` step may carry `"ask_confidence": true`.
2. `reflect` `fields`: `{id, label, options?, type?: "number", answer?, tolerance?}`. `answer`/`tolerance` let the app show "correct / not yet" for the arithmetic fields (CLOCK) and the sorting fields (RECOVER, SELF-3). Answers are checked in the build script (`assert`), not by the validator.
3. Item `answer.line` (list of UCI moves) and `answer.plies` for variation entry (LOOP.V3: IA5-15, IA5-18). Claims verify the first move and the outcome; the line is the engine's principal variation and is checked for legality by my audit script. The app should accept any legal opponent reply that still leads to the claimed result.
4. Item `display`: `{"study_seconds": 15, "hide": [squares], "reveal": "after_answer"}` for the hidden-piece drill (IA5-16, IA5-17). Without app support the item still works as a normal select-squares item, only easier.
5. `contrast` without an `irrelevant` arm (SELF-4: a fair check versus a mirrored position) and a contrast whose "irrelevant" arm is a forced or quiet position (most others).
6. Item tags `mode.silent`, `mode.visualise`, `mode.variation`, `mode.baseline`, `mode.practice`, `mode.check`.

## Method notes [V]
- Positions come from the Lichess puzzle database and the 2013-01 game sample (both CC0, provenance recorded per position), or are authored one-feature edits of verified positions (the defended-knight pair, the check with and without a defender). Nothing was written by hand without the validator.
- "Critical moment" is defined in V5 and in CLOCK by what the claims can check: a tempting move that loses at least 250-300 cp against the best move. "Routine" means three sensible moves within 40 cp and no line that wins more than a pawn. These are working definitions [H], not established chess terms.
- The `loose` vocabulary follows `docs/authoring-guide.md`; the scan card refers to the threat lesson instead of redefining it. The app string in `app/src/lib/loop.ts` (`LOOP_INFO.V1.lines`) still says "attacked and undefended"; I did not edit app files. A one-line change to "Is any of my pieces loose, or attacked by something cheaper?" would match the lesson card.

## Known weaknesses and what was not verified
- **Arithmetic is not machine-checked by the validator.** The CLOCK sums (10+5 over 40 moves is 800 s and 20 s per move; (300-60)/35 is 6.9; 3+2 over 30 moves gains 60 s) and the SELF-3 error-log counts are asserted in the build script only. A validator claim type such as `arith` would close this.
- **Player notes in SELF-3 are fictional.** The claims verify the board facts (the move loses; the pawn is won in the "misjudged" item) but cannot verify that a note is true of a real player. The lesson says the label is tentative. Whether the four labels separate cleanly in real players' notes is untested [H].
- **Hidden-piece drill and calibration are untested as training.** "Habit to try" is the strongest claim made; there is no data here that they improve play. The calibration cut-off ("about one in four") is a stated guess.
- **Position leakage.** Puzzle 0qAue appears in L-LOOP-V5-1 (before the capture) and L-CAL-DEFENSE-1 (after it). Everything else is used once.
- **SELF-3 has no contrast step** (the contrast is the error-log test in its reflect step), and SELF-2/PRA-RECOVER use their three-arm contrast for judgments (confidence, decision versus result) rather than for a chess idea that fails. PRA-CLOCK has only four chess items; its weight is in the reflect and arithmetic steps by design.
- **Explanations of why** (for example, that a recapture "spoils the pawns") are limited to what claims verify. Where a lesson says a position is better or worse it means the engine's rating at depth 16, recorded in the evidence file. A strong-player review is still needed for wording and for whether the chosen examples teach the right thing.
- Mixed-practice behaviour for V4+ (what "retirement" means without a panel) is not specified by the app; the cards only promise hints on request.

## Open questions for Andrew / the coordinator
1. Should V4, V5 and CAL.DEFENSE get a `LoopPanel` too (the card text is written so it works either way, but says "no panel" today)?
2. Which app feature should own the "time per item" record promised as *planned* in PRA.CLOCK, and should the planned export of notes (SELF.1, SELF.3) be tracked as a milestone item?
3. Is "five" the right retire threshold for every level, or should it be set per level and revised after the first month of use?
4. Do you want the arithmetic fields checked by a new validator claim type, or is a build-script assertion acceptable for v1?
