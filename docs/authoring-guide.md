# Authoring guide: how to write a lesson that is allowed to ship

This is the bar for every lesson and item in `content/`. It exists because the same mistakes keep appearing in chess teaching material (including ours): unconditioned rules, unchecked positions, explanations that sound right but aren't proven.

## The shape of a lesson (see `content/lessons/L-TAC-FORK-1.json` as the exemplar)
1. A short **card** (≤ 70 words) names the idea in plain words.
2. A **board** step shows one clear example as a step-through line (one sentence per move, ≤ 20 words).
3. An **item** makes the learner do it (cued).
4. A **card** that states the **conditions**: when the idea works, and the question to ask before using it.
5. A **contrast** step: the same position shape with one feature changed so the idea fails (or doesn't apply). The learner **predicts first**, then sees the verified result and reason.
6. A **cue-3 item**: the same idea with nobody saying which idea to use (and, where sensible, a position where it does not apply).
7. A **reflect** step (confidence, "what did you expect?", or "what felt unclear?").
Lessons are 6-12 minutes. Never two cards in a row without a task. Use `practice` steps (by tag) to attach volume from the generated and puzzle corpora instead of authoring dozens of items by hand.

## Content rules
- **Original wording.** Use the synthesis sheets (`sources/sheets/*.md`) for *ideas, conditions, exceptions and failing look-alikes*, never their sentences. At most one short phrase (< 15 words) of any source, only with a reference.
- **Conditions, not rules.** Every principle states when it holds and gives the failing look-alike (CD-4). Do not teach absolutes ("always", "never") unless a tablebase proves them.
- **Explanations only state what claims verify.** If you write that a piece is pinned, a square is defended, a knight wins a queen, or a move loses material, a claim in the same file must establish it (`legal_destinations`, `attackers`, `loose_pieces`, `material_after_move`, `mate_in`, `best_move_in`, `move_loses`, `eval_range`, `tablebase`, `game_state`). Never write an evaluative judgement ("White is better", "this is the correct plan") without an `eval_range`/`best_move_in`/`tablebase` claim, and never claim to know why a famous player chose a move.
- **Positions are the main source of defects.** About half of positions written by hand during this project had a defect on first validation (dead draws, trapped pieces that spoil the lesson, hidden back-rank mates, illegal setups). Therefore: build positions **programmatically** (play legal moves from the start position, or make one-feature edits of a verified position with python-chess), then validate; add pawns so "winning material" is not a dead draw; give kings luft; run `tools/validate.py` and read the engine's best line for each position before you trust it.
- **Cue levels.** 1 = the idea is named in the prompt; 2 = themed set; 3 = unlabeled and mixed (sometimes with no idea applicable); 4 = in play. Items at cue 3 must never mention the theme in the prompt. Mix in positions where the idea does **not** apply.
- **Hints** escalate: attention → relation → partial line; only the last may be close to the answer. **Explain** is short and factual.
- **Review status:** machine-checked only → `needs-human` (strategic or explanatory content) or `machine-only` (pure rules/legality items). Never `human-reviewed`: only Andrew's reviewer sets that.
- **No video, no external links, no AI-generated claims about what authors "believed".**

## Workflow and commands (Windows; use `python -I`)
```
tools\.venv\Scripts\python.exe -I tools\validate.py content\items\<file>.json     # items: structure + every claim
tools\.venv\Scripts\python.exe -I tools\validate_lessons.py content\lessons\<file>.json   # lessons
tools\.venv\Scripts\python.exe -I tools\build_content.py                            # builds app/public/content (strict: unverified items are skipped)
```
Split item files to <= ~120 items so validation takes a few minutes. Practice steps that reference tags (e.g. `theme.pin`) fail validation until the corpus workers finish; write them anyway and re-run at the end.

## Quality checklist before you hand in
- [ ] Every lesson validates; every item file validates (100% claims pass).
- [ ] Each lesson has at least one contrast (failing look-alike) and one cue-3 item.
- [ ] No card exceeds 70 words; no unconditioned rule; no unexplained jargon at first use.
- [ ] You can state, for each lesson, what the learner can do afterwards that they could not do before.
- [ ] Sources listed per lesson; rights: original wording; positions are your own constructions or public data.
- [ ] A short `docs/lessons-<area>.md` note listing lessons, items, known weaknesses, and anything you could not verify.

## Vocabulary (fixed project-wide; added after two authors defined "loose" differently)
Use these terms exactly in learner-facing text and in item wording.
- **Loose piece**: a piece (never a king) that an enemy piece attacks and that none of its own side's pieces defends. This is the meaning of the validator claim `loose_pieces` and of the generated items. Lessons say "loose".
- **Undefended**: no friendly piece defends it. A piece can be undefended and not attacked; that is not yet a problem.
- **Hanging piece**: only as the Lichess theme name `hangingPiece` and as a synonym introduced once ("a loose piece is also called a hanging piece"). Do not use it with a different meaning.
- **Attacked**, **defended**: as in `FND.ATTACK`. A pinned defender still counts as a defender of the square for this vocabulary, with the caveat taught in `SAF.COUNT`.
- **Threat**: a move the opponent could play next that would gain material or mate; judged after their last move (`SAF.THREAT`).
- **Fork, pin, skewer, discovered attack, double check**: as in the node files `conditions`.
- Piece values 1/3/3/5/9 are "counting values", a rule of thumb, never "worth".
Lesson order for the first hours (set by the Tier 0-1 author, see `docs/lessons-t0.md`): board, rook and bishop, queen and king, knight, pawn, check, mate in one, capture, count, castle, special rules, opening habits, threat, K+Q, K+R. Later lessons may assume this order.
