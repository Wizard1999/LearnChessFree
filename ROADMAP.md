# Roadmap

How to read this: `[x]` done, `[~]` in progress (counts as half), `[ ]` not started. Percentages are computed by `tools/update_roadmap.py` from the boxes below; the metrics come from the actual content files. The same data is shown in the app on the **Roadmap** page. Rule for every session (also in `CLAUDE.md`): when a task finishes, tick it here and run `./tools/.venv/Scripts/python.exe -I tools/update_roadmap.py`.

<!-- PROGRESS:START -->
**Overall: 60%** (54 of 97 tasks done, in-progress tasks count half). Updated 2026-10-26T08:35+00:00 UTC.

| Phase | Done | % |
|---|---|---|
| Phase 0: Design, research and governance | 9/11 | 82% |
| Phase 1: Verification tooling | 6/8 | 75% |
| Phase 2: The app | 21/25 | 84% |
| Phase 3: Curriculum graph | 3/4 | 75% |
| Phase 3b: Design (from the Design Doctrine; see `docs/design-direction.md`) | 2/10 | 25% |
| Phase 4: Exercise bank | 4/8 | 62% |
| Phase 5: Lessons (one per skill node; see the metric above) | 7/19 | 50% |
| Phase 6: Data | 1/3 | 33% |
| Phase 7: Release | 1/6 | 17% |
| Phase 8: Evaluation | 0/3 | 0% |

**Coverage (computed from the files):** 152 of 204 skill nodes have a lesson (75%); 148 nodes have 10 or more shipped exercises; 6568 exercises ship, 0 wait for validation; 0 items reviewed by a person, 1910 flagged for human review.

| Strand | Nodes | With a lesson | With 10+ exercises |
|---|---|---|---|
| S1 Rules and board vision | 20 | 20 | 18 |
| S2 Safety and the thinking loop | 12 | 12 | 7 |
| S3 Tactics | 24 | 24 | 24 |
| S4 Calculation | 8 | 5 | 8 |
| S5 Positional play and planning | 49 | 25 | 30 |
| S6 Attack, sacrifice and defense | 19 | 8 | 16 |
| S7 Endgames | 37 | 23 | 35 |
| S8 Openings and structures | 12 | 12 | 7 |
| S9 Game study | 7 | 7 | 2 |
| S10 Practical performance | 9 | 9 | 1 |
| S11 Self-direction | 7 | 7 | 0 |

**Building now:** Endgame tablebase items (files built; validation in progress); Attack, defence, sacrifice and calculation items from puzzle themes; Tranche 2a: calculation (4 of 7 nodes done and reviewed: candidates, visualize, compare, tree; batch c2 not started); Tranche 2b: positional play (batches p1 and p2 written and validated, review pass unfinished; p3 to p6 not started); Tranche 2c: attack, defence, sacrifice, initiative (batch a1 written, review pass unfinished; a2 and a3 not started); Tranche 2d: endgames (batch e1 written, review pass unfinished; e2 to e4 not started); Lessons and exercises for the new gap nodes (written and validated: mate search, exchange sacrifice, practical resistance, knight and rook endings, four structure families; review pass unfinished, see docs/review-findings-pending.md)

**Next up:** Independent audit of generated items (second implementation); Skill-graph chess-accuracy audit (adversarial reviewers); Mission completion screen; Adversarial code review of the app and fixes; Accessibility and mobile fixes from the review

**Waiting on you (gates and questions):** Strong-player review of explanations (gate G3, G6, G8); Baseline measurement before starting (gate G1); Name: shortlist and recommendation written (`docs/name-shortlist.md`); waiting for your pick (question Q4); Identity study: three comparable treatments to choose from (question Q10); Usability rounds with real people (gate G11); Master (over-the-board) statistics (question Q6); Turn on Pages in the repository settings (gate G10); Choose a name and a content licence (questions Q3, Q4); Optional sign-in to sync progress across devices (question Q11: needs a hosting and account choice); Baseline games and placement (gate G1)

<!-- PROGRESS:END -->

## Phase 0: Design, research and governance
- [x] Independent review of the original plan (`review/`)
- [x] Product design decisions D1-D13 (`03-product-design.md`)
- [x] Chesscademy research from the Wayback Machine and forums
- [x] Simulated expert council and curriculum map v1 / v1.1 (labelled simulation)
- [x] Five public-domain source synthesis sheets
- [x] Library registry and rights rules
- [x] Content schema v1, authoring guide with fixed vocabulary
- [x] Evaluation plan for student zero (`docs/evaluation-plan.md`)
- [x] Questions-and-gates file and decisions log
- [ ] Strong-player review of explanations (gate G3, G6, G8)
- [ ] Baseline measurement before starting (gate G1)

## Phase 1: Verification tooling
- [x] Claim-level validator: rules, engine, tablebase (`tools/validate.py`)
- [x] Validator self-test that rejects planted defects (`tools/selftest.py`)
- [x] Hardened validator: locked tablebase cache, null-move claims, 17 structure claim types
- [x] Strict build: only items whose evidence matches ship (`tools/build_content.py`)
- [x] Cross-file consistency check (`tools/check_all.py`) and graph checker (`tools/check_graph.py`)
- [x] Content smoke test over the shipped bundle (`app/src/content.smoke.test.ts`)
- [ ] Independent audit of generated items (second implementation)
- [ ] Skill-graph chess-accuracy audit (adversarial reviewers)

## Phase 2: The app
- [x] Local-first PWA with offline cache and export/import
- [x] Exercise player: all task types, hints, confidence, typed moves
- [x] Lesson player: cards, boards, contrast steps, reflect steps, number fields, silent steps
- [x] Evidence-weighted mastery, spaced review, daily plan with reasons
- [x] Placement test with skip option
- [x] Practice with silent mode and interleaving
- [x] My plan experiments (baseline, train, check on unseen positions)
- [x] Contrast lab (change one thing, predict, engine checks)
- [x] Game import and review (annotate first, engine, verified pattern tags)
- [x] Play against the engine
- [x] Openings explorer with transpositions, rating bands, repertoire, PGN import, drill
- [x] Thinking-prompt panels that fade on evidence (V1-V3)
- [x] "Also sound" recognition of equally good moves
- [x] Memory drills and whole-line entry
- [x] Fix: Black pieces can be moved by dragging (board turn colour)
- [x] Fix: crooked board (crisp SVG squares, width snapped to a multiple of 8)
- [x] Settings as a side panel (overlay drawer) with theme, board, text size, motion
- [x] Roadmap page in the app
- [x] Missions: progress donut, five levels per skill, block map of the whole course, skills up next, mastery challenge (`docs/missions-design.md`)
- [x] Mission warm-up (per-mission test-out, no penalty), mastery-challenge nudge on Today, overall wheel and challenge on the All missions tab
- [ ] Mission completion screen
- [ ] Adversarial code review of the app and fixes
- [ ] Accessibility and mobile fixes from the review
- [ ] Full-course walkthrough in the browser as a first-time learner
- [x] Zero-friction start: first visit goes straight into the first lesson, staged content loading, auto-save with a storage check, resume mid-lesson (decision D19)

## Phase 3: Curriculum graph
- [x] 204 skill nodes with outcomes, conditions, contrasts and misconceptions
- [x] Graph is acyclic, tier-consistent, with a default route
- [x] Fill gaps the graph agent named: 10 new skill nodes (mate search, rook basics, knight endings, rook-pawn endings, four pawn-structure families, exchange sacrifice, practical resistance); 204 nodes, checker clean
- [ ] Re-check tiers and prerequisites after the structure critic

## Phase 3b: Design (from the Design Doctrine; see `docs/design-direction.md`)
- [x] Read the doctrine, verify its contrast figures, write my response and plan
- [x] Tokens and look: palette (light and dark), self-hosted fonts, board theme, appearance settings, reduced motion
- [ ] Lesson and practice workspace layout (board beside the teaching panel)
- [ ] Home, first visit and navigation (Continue, Review, five primary destinations)
- [ ] Course page as a chapter list with evocative and literal titles
- [ ] Accessibility build: keyboard-operable board, live regions, skip link, text size, audit
- [ ] Copy audit against the doctrine's voice table
- [~] Name: shortlist and recommendation written (`docs/name-shortlist.md`); waiting for your pick (question Q4)
- [ ] Identity study: three comparable treatments to choose from (question Q10)
- [ ] Usability rounds with real people (gate G11)

## Phase 4: Exercise bank
- [x] Tier 0-1 generators (pieces, counting, mates, special moves, K+P, K+Q, K+R)
- [x] Tactics corpus from Lichess puzzles (20 themes, re-verified with the engine)
- [x] "No tactic" and threat sets
- [x] Positional structure items (pawn structure, files, outposts, bishops, space)
- [~] Endgame tablebase items (files built; validation in progress)
- [~] Attack, defence, sacrifice and calculation items from puzzle themes
- [ ] Items for strategy nodes with no checkable fact (plans, prophylaxis, restraint, conversion)
- [ ] Items for initiative and compensation

## Phase 5: Lessons (one per skill node; see the metric above)
- [x] Tier 0-1 first-hours lessons (15)
- [x] Tactics core and safety (12)
- [x] Thinking loop and self-direction levels 1-4 (12)
- [x] Openings and game study first set (8)
- [x] Positional first set (10)
- [x] Endgames first set (9)
- [x] Tranche 1: advanced tactics, foundations, openings, game study, practice habits, self-direction 5-7 (written, reviewed and fixed)
- [~] Tranche 2a: calculation (4 of 7 nodes done and reviewed: candidates, visualize, compare, tree; batch c2 not started)
- [~] Tranche 2b: positional play (batches p1 and p2 written and validated, review pass unfinished; p3 to p6 not started)
- [~] Tranche 2c: attack, defence, sacrifice, initiative (batch a1 written, review pass unfinished; a2 and a3 not started)
- [~] Tranche 2d: endgames (batch e1 written, review pass unfinished; e2 to e4 not started)
- [~] Lessons and exercises for the new gap nodes (written and validated: mate search, exchange sacrifice, practical resistance, knight and rook endings, four structure families; review pass unfinished, see docs/review-findings-pending.md)
- [ ] Review and fix pass on the unreviewed tranche lessons (p1, p2, a1, e1, g1, g2, g3) and the remaining batches c2, p3-p6, a2, a3, e2-e4 (paused: weekly usage limit)
- [ ] Contrast step: show the baseline result and ask the irrelevant item, as the lesson cards promise (review finding on the g2 lessons)
- [ ] Read-through of all lessons for voice, order and consistency
- [ ] Course: famous games analysed (each game verified move by move; original commentary)
- [ ] Courses: deep dives into each common opening (built on the openings data, no overlap with other lessons)
- [ ] Advanced club-style courses; an overlap check in the curriculum tools so no two lessons teach the same thing
- [ ] Readability pass: text size, fewer nested boxes, stronger secondary text

## Phase 6: Data
- [x] Opening statistics from 4.75 million Lichess games in eight rating bands
- [ ] Master (over-the-board) statistics (question Q6)
- [ ] Difficulty calibration from real learner data (needs learners)

## Phase 7: Release
- [x] Public GitHub repository (Wizard1999/LearnChessFree): first commits pushed
- [ ] Build-and-deploy workflow for GitHub Pages
- [ ] Turn on Pages in the repository settings (gate G10)
- [ ] Choose a name and a content licence (questions Q3, Q4)
- [ ] Test the deployed site on a phone
- [ ] Optional sign-in to sync progress across devices (question Q11: needs a hosting and account choice)

## Phase 8: Evaluation
- [ ] Baseline games and placement (gate G1)
- [ ] Eight-week run with the pre-registered measures
- [ ] Report with intervals, including failed plans
