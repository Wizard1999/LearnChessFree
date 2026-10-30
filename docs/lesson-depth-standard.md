# Lesson depth standard (30 October 2026)

The checklist for every lesson beyond the beginner building blocks. It answers the owner's review of 30 Oct 2026: lessons are "a lazy slideshow", paragraphs full of notation are poor teaching, and an opening course should leave a learner able to teach the opening. Evidence labels: [V] measured in this repo today, [S] read on a page (see the research docs), [I] inference, [H] hypothesis. Run `./tools/.venv/Scripts/python.exe -I tools/check_depth.py` to see where any lesson stands.

Related: `docs/authoring-guide.md` (claims, wording, validation: all still binding), `docs/content-schema.md`, `docs/course-families.md`, `docs/citable-views.md` (what may be attributed to whom), `docs/competition-chesscom.md`, `docs/competition-chess-steps.md`.

## 1. The problem in numbers [V]
- 444 lessons. The median lesson has **11 steps, about 140 words of card text and 2 boards** (the fork lesson: 7 steps, 2 boards).
- **85 cards** carry four or more moves in prose (`tools/check_text_notation.py`). The reader must play those moves in their head.
- The Dragon lesson: 21 steps and about 420 words; one 14-ply line on a board, a few cards, then tests of remembering. It says what the moves are and hardly why.
- The engines-and-humans lesson has no boards at all.
- Class medians now (steps): opening deep dives 18, famous games 15, culture 12, core skills 11. The targets below are two to four times higher. Only 2 of 444 lessons meet their class target.
- Competition [S]: chess.com's beginner path is coach-guided with challenges, and users report thin, non-progressive beginner lessons and a coach that names moves without reasons. The Steps method keeps explanation short and puts about 500 to 630 exercises in each workbook, but leaves the teaching to a human trainer. We have no trainer in the loop, so all explanation must live in the lesson. Our opening: be the deepest free course, with every statement checked.

## 2. Principle: show it, then say it
1. **Every concrete line of moves is shown on a board step**, one short sentence per move (or per pair), the learner stepping through it. Never as a string in a card.
2. **A card carries ideas, not move strings.** At most **3 move tokens** in any card (`check_text_notation` flags 4 or more; this standard is stricter). A single move may be named when the board shows it next.
3. Order: position first, question second, words after. Say it only once the learner has seen it.
4. One idea per card, at most one paragraph (about 60 to 90 words). Never two cards in a row without a board, a prediction or a task.
5. The sentence on a board step explains the move's purpose ("this prepares ...", "this stops ..."), not its name ("the bishop goes to e3"). A move sentence that only restates the move is a defect.
6. Every board that makes an evaluative or tactical statement carries a machine claim (authoring guide). Conjecture needs no claim but must be labelled (section 7).

## 3. Lesson classes and targets
Steps = cards, boards, contrasts, items, practice and reflect steps. "Boards" = board plus contrast steps (the learner steps through a shown position); item steps come on top. `tools/check_depth.py` uses these numbers.

| Class | What | Id prefix | Steps | Boards | Minutes |
|---|---|---|---|---|---|
| **A** | Beginner building block (stages S0 to S1) | the lessons of S0, S1 in `path.json` | 15 to 30 | as needed; each rule shown | 8 to 15 |
| **B** | Core skill lesson | `L-TAC-`, `L-POS-`, `L-END-`, ... | 30 to 60 | at least half of steps | 25 to 45 |
| **C** | Opening deep dive, a **series** of 8 to 10 lessons | `L-OD-<NAME>-n` | 40 to 70 each | at least half | 25 to 45 each |
| **D** | Culture / history / playstyle lesson | `L-HI-`, `L-PS-` | 20 to 40 | at least 40% (positions, maps or games illustrating each fact) | 20 to 35 |
| **E** | Famous game | `L-FG-` | 40 to 60 | at least half | 30 to 45 |

Lessons from stage S2 on are class B unless the id puts them elsewhere. A lesson that honestly needs fewer steps (a single rule fact) is merged with a neighbour; do not pad. Padding is repeated cards, restated tests and filler boards. Depth is more positions, more contrasts and more reasons.

## 4. Anatomy of a deep lesson (classes B to E)
Order to aim for; counts are for about 40 steps.
1. **Hook position (1 to 2 steps).** A board with a real puzzle or surprising position and one question ("what would you play, and why?"). A `reflect` records the guess. No explanation yet.
2. **The question (1 card).** What the lesson will let you do, as an outcome you can test yourself on.
3. **Guided discovery (3 to 5 steps).** Two or three positions that differ in one feature; the learner predicts, sees the verified result, then is asked what changed. The idea is spoken second.
4. **The idea (1 to 2 cards).** In plain words, with its conditions (authoring guide: conditions, not rules).
5. **Worked boards (3 to 6, rising difficulty; about 8 to 14 steps with their tasks).** Each: a stepped line, a purpose sentence per move, a claim, then a short item.
6. **Why it works, when it fails (2 to 4 steps).** The mechanism in a sentence or two, then the failing look-alike.
7. **Contrasts (2 to 4).** One feature changed so the idea fails or is irrelevant; predict first.
8. **Mixed tests (4 to 8 items or practice steps).** Unlabelled; some where the idea does not apply (cue 3).
9. **Model game or real example (3 to 6 steps).** A short real game or a position from our game data, with decision points where the learner predicts.
10. **Common mistakes with feedback (2 to 4).** The typical wrong move at the key moment, with `feedback_by_move` saying why it fails and what it allows. The source of "typical" is stated (our data, a named book) or labelled [H].
11. **Teach-it-back (a reflect step plus a card).** The learner writes the idea in their own words for an imagined beginner (fields: the idea, when it works, one example, one warning). A closing card gives a **self-check list**: did I say when it works, when it fails, give an example a beginner could set up on a board, name one mistake? The app grades nothing (no live AI in the loop, rule 7).
12. **Recap (1 card).** Five to eight short lines, a "what to remember" list in the spirit of the Steps method's reminder page [S]. No move strings.

## 5. Combining steps
A board step with claims counts as the task that follows a card (the "no two cards without a task" rule). A hook board plus its `reflect` also counts. Two boards in a row are fine; three cards in a row are not.

## 6. Opening series (class C)
One opening = a series of 8 to 10 lessons. After it a learner can explain the structure, say what each move sets up, play both sides, avoid the typical mistakes and **teach it to someone**. A lesson that passes 70 steps splits in two.

| # | Lesson | Must contain |
|---|---|---|
| 1 | The idea and the first moves | Why the opening exists and who plays it [S/H]; the first moves on a board with a purpose per move; the pawn structure it creates |
| 2 | The structure and the pawn breaks | Pawn skeleton, open and half-open files, the breaks each side wants, a plan card per side, boards of typical middlegames |
| 3 | Each side's setup and what each move prepares | Setup of every piece; for each early move "what does this make possible later", with a board showing the payoff; move-order choices |
| 4 | The main line move by move, with reasons | The main line to about move 12 to 15 as stepped boards, a reason for each move, the engine-checked alternatives that fail and why |
| 5 | Critical sidelines and move-order tricks | The popular deviations, the best answer to each (engine claim), transpositions |
| 6 | Tactics and traps typical of the opening | Recurring patterns (sacrifices, pins, back-rank, king hunts), three or more positions each, from our data or engine; traps that actually occur |
| 7 | Model games | Two to four real games (moves are facts), decision points, what decided each, a one-sentence plan per phase |
| 8 | When it goes wrong and how to repair it | Typical errors for each side, the worse positions that arise, the repair and the engine evidence that it works |
| 9 | Plan-building exercises | "What is your plan?" positions: choose among 3 to 4 plans with feedback; unlabelled |
| 10 | Final test and teach-back | Mixed unlabelled test; explain the whole opening to a beginner in five minutes, with the self-check |

Rules: popularity numbers come from our own game data with the sample stated; "the theory says" only where we hold a checked source; engine claims state depth; typical plans are structure-tool claims or labelled [I]/[H]. Online amateur data is not master theory.

## 7. Conjecture, other people's views, quotations
- **Use conjecture.** Where the evidence stops, say what you think and label it: "[H] ..." or "[I] ...". Hypotheses are a feature: they teach that chess ideas have a status. Offer at least one where it is honest, and let the learner disagree in a `reflect` step.
- **Views of others.** Use `docs/citable-views.md` first. Paraphrase in our words, name the person (and the book), no quotation marks on a paraphrase, never "X would say". Old views get the engine-age caveat from that file when the claim is absolute.
- **Quotations.** Only verbatim text from a source we actually read, at most 15 words, at most one per page, in quotation marks with attribution. Never fabricate a quotation or endorsement; never reproduce lyrics or long passages. Simulated experts are labelled simulations (rule 5).
- **Labels** on any non-trivial claim of history or origin: [S] with the source named, [R] recalled, [H]. A date or origin claim with no source is not shipped (rule 1).
- A "what [coach or player] teaches" card says where the learner can check it.

## 8. Series, ids, registration
- Ids: `L-OD-<NAME>-1` to `L-OD-<NAME>-N`. Existing single lessons keep `-1` and become lesson 1 of their series (ids are permanent). Other series follow the pattern (`L-FG-<GAME>-n`, `L-HI-<TOPIC>-n`).
- Add top-level `"series": "<id>"` (for example `"series": "dragon"`) to every lesson of the series. `tools/check_overlap.py` then lets lessons of one series revisit their own key positions. It does not exempt a course lesson from the rule that it may not claim a core skill as its main skill.
- Register every lesson in its course file `content/courses/<course>.json` (`lessons` in teaching order; add newly relied-on core skills to `uses`). Each lesson sets `course`, `skill`, `depth`, `uses`, `minutes` (25 to 45), `outcomes`, `review` (`needs-human`) and `sources`.
- Class A and B lessons belong to the core path (`tools/build_path.py`).
- After authoring: `tools/validate_lessons.py <file>`, `tools/check_text_notation.py`, `tools/check_depth.py`. The coordinator runs the full checks.

## 9. Checklist
- [ ] Steps and boards within the class target; minutes 25 to 45 (classes B to E).
- [ ] No card with more than 3 move tokens; every line of moves is on a board with a purpose per move.
- [ ] Hook, guided discovery, idea, 3 to 6 worked boards of rising difficulty, why and when it fails, contrasts, mixed tests, example or model game, mistakes with feedback, teach-it-back with self-check, recap.
- [ ] No two cards in a row without a task; no padding.
- [ ] Every evaluative or tactical statement has a claim; every other non-trivial statement is labelled.
- [ ] At least one honest [H]/[I] conjecture and, where useful, a paraphrased named view from `citable-views.md`.
- [ ] At most one quotation, under 15 words, verbatim from a source we read.
- [ ] `series` field and course registration done; `check_overlap` still clean.
- [ ] Opening lessons follow section 6; after the series a learner could teach the opening.
