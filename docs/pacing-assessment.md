# Pacing assessment: how long should a lesson be? (11 Nov 2026, D91)

Andrew's observation: Stage 3 lessons run about 30 minutes each and the stage totals about 10 hours, for ideas as simple as reading and writing a move. Early lessons should be easy to finish so students stay; depth belongs later. This note says what the evidence and good teaching practice suggest, what we measured, and what was changed. Labels: [V] verified here, [R] recalled general knowledge, not looked up in this session, [I] inference, [H] hypothesis. No expert is quoted: "what the best coaches would say" below is a synthesis of widely held principles [R], not a statement by any named person (project rule 5).

## What good teachers and coaches converge on [R]
1. **Small units, each ending in a win (mastery learning, micro-lessons).** Learners keep going when each step is short enough to finish in one sitting and ends with something they can now do. A long first lesson is a long wait for that feeling.
2. **Working memory is small, and novices have the least room (cognitive load).** A beginner can hold a handful of new things at once. Notation, piece values or check each carry a few rules; piling a dozen drills of the same rule into one sitting teaches fatigue, not the rule.
3. **Spacing and retrieval beat massing.** Ten correct answers in a row on one day are worth less than three answers on each of three days. Extra drills belong in later practice, not in the first lesson. (The app already has the machinery: Practice, the Mastery challenge, spaced review, "Mastered" needing two separate days.)
4. **Rules are learned by playing.** Strong chess teaching for beginners keeps them at the board and playing early, and teaches rules as the game needs them. This is the project's own hook (D55, D56).
5. **Depth earns its length.** A lesson on a rook ending or a calculation method can fairly take 30 to 40 minutes because the idea is hard and the learner is committed. The same length on "the rook moves in straight lines" is a design fault. Length should follow difficulty and commitment, which is the rule already adopted in D55.

## What we saw at chess.com [V from our own sampling, docs/research-chesscom-synthesis.md]
- A chess.com lesson is one to five challenges, a few minutes, and ends on a Finish button. Its beginner path reached the first opponent piece at about minute 11 and the first checkmate at about minute 31 (2018 course) or minute 21 and minute 31 (2021 path) [V, segment 17 report].
- They show no score, no list of misses and no review at the end; their strength is brevity, not depth. Our depth is a differentiator, but only once a learner has stayed long enough to need it.

## What we measured [V, `tools/pace_lessons.py` dry run and `scratch` counts]
| Stage | Lessons | Hours (estimate) | Mean min | Longest | Over its D55 ceiling |
|---|---|---|---|---|---|
| 1 Moves and the board | 8 | 0.7 | 4.9 | 8 | 0 |
| 2 Legal play | 7 | 0.9 | 7.9 | 9 | 0 |
| **3 First complete games** | 22 | **10.8** | **29.5** | 48 | **21 of 22** |
| 4 First wins | 46 | 13.4 | 17.5 | 47 | 13 |
| 5 Becoming independent | 49 | 10.3 | 12.6 | 48 | 6 |
| 6 Developing strength | 161 | 27.2 | 10.1 | 39 | 3 |
| 7 Advanced craft | 178 | 51.7 | 17.4 | 51 | 35 |
| 8 Specialization | 37 | 8.4 | 13.7 | 48 | 5 |
The D55 ceilings (15, 20, 25, 30, 35, 40 minutes for Stages 3 to 8) were written down and never enforced beyond Stage 2, so the first teaching lesson of each Stage 3 idea (the "-1" lessons) grew to 25 to 48 minutes with 40 to 80 steps, 14 to 22 of them exercises. Stage 3 was 36 times the length of Stage 1 for ideas of similar difficulty. About half of the long lessons beyond Stage 3 are opening deep dives, which are bonus depth (D80) and were left alone.

## My assessment
- Andrew is right, and the cause is a missing enforcement, not a design choice: Stage 3 teaches simple ideas (notation, values, loose pieces, the six pieces in busy positions, check, mate in one) with the length of a deep topic.
- The lesson should teach the idea and prove it once or twice; the pool of further exercises on that idea already exists in the bank (about 10,000 items) and is served by Practice and review. So thinning drills inside a lesson loses no content and moves the repetition to where it works best.
- A lesson that is still long after thinning should be cut into parts of about ten to fifteen minutes, each with its own start and finish, so a learner can stop, play a game, and return. Cutting at the lesson's own chapters keeps each part coherent.
- Target: Stage 3 about four to five hours, not eleven; no Stage 3 part over about eleven minutes; Stage 4 parts about thirteen. These are targets to tune, not facts about learners [H].

## What was done (D91)
`tools/pace_lessons.py`: for core lessons over their D55 ceiling in Stages 3 to 8 (not opening deep dives, culture or famous-game lessons), thin the exercises per chapter, then cut at chapter boundaries into the fewest parts that fit. Part 1 keeps the lesson id (so existing progress is kept); later parts take the suffix B, C, D and the same skill, and open with one short bridge card. Nothing taught (cards, boards, guided games, contrasts) is removed. See DECISIONS-LOG D91 for the counts after the rebuild.

## What is left
- Opening deep dives in Stages 4 to 7 (about 40 lessons at 28 to 51 minutes) are still long; they are bonus depth and each is already cut into chapters. Decide whether to apply the same split.
- A human reader should check one or two split lessons for flow (the bridge card is mechanical). `(feedback)`: do learners finish more lessons now?
- Keep the ceilings enforced: `tools/check_depth.py` now reports lessons over their stage ceiling (see below), and the path-time check covers Stages 1 to 3.
