# Roadmap

How to read this: `[x]` done, `[~]` in progress (counts as half), `[ ]` not started. Percentages are computed by `tools/update_roadmap.py` from the boxes below; the metrics come from the actual content files. The same data is shown in the app on the **Roadmap** page. Rule for every session (also in `CLAUDE.md`): when a task finishes, tick it here and run `./tools/.venv/Scripts/python.exe -I tools/update_roadmap.py`.

<!-- PROGRESS:START -->
**Overall: 55%** (83 of 162 tasks done, in-progress tasks count half). Updated 2026-10-29T15:08+00:00 UTC.

| Phase | Done | % |
|---|---|---|
| Phase 0: Design, research and governance | 9/11 | 82% |
| Phase 1: Verification tooling | 6/8 | 75% |
| Phase 2: The app | 22/26 | 85% |
| Phase 2c: Radial curriculum map (Andrew's idea, 29 October 2026; design: docs/map-radial-design.md) | 3/4 | 75% |
| Phase 2b: Square control map (Andrew's idea, 29 October 2026) | 1/4 | 50% |
| Phase 3: Curriculum graph | 3/4 | 75% |
| Phase 3b: Design (from the Design Doctrine; see `docs/design-direction.md`) | 3/10 | 30% |
| Phase 4: Exercise bank | 4/8 | 62% |
| Phase 5: Lessons (one per skill node; see the metric above) | 12/24 | 62% |
| Phase 6: Data | 2/3 | 67% |
| Phase 6b: Motivation (local, no server) | 4/5 | 80% |
| Phase 6e: Sources library (plan: docs/library-plan.md) | 7/9 | 83% |
| Phase 6f: Top-level game data (Andrew, 29 October 2026: all of it, now back to the beginning) | 2/4 | 50% |
| Phase 3c: The simplicity pass (design: docs/design-simplicity-pass.md) | 0/7 | 0% |
| Phase 5b: Follow-ups from the review waves (29 October 2026) | 2/6 | 33% |
| Phase 3d: Analysis page, what remains | 0/4 | 0% |
| Phase 6g: Famous games, wave 2 (29 October 2026) | 1/2 | 50% |
| Phase 6d: Release 0.1, the first 10 hours (docs/first-10-hours.md) | 1/9 | 11% |
| Phase 6c: Courses on top of the core (design: docs/course-families.md) | 0/5 | 0% |
| Phase 7: Release | 1/6 | 17% |
| Phase 8: Evaluation | 0/3 | 0% |

**Coverage (computed from the files):** 205 of 205 skill nodes have a lesson (100%); 164 nodes have 10 or more shipped exercises; 7108 exercises ship, 0 wait for validation; 0 items reviewed by a person, 2431 flagged for human review.

| Strand | Nodes | With a lesson | With 10+ exercises |
|---|---|---|---|
| S1 Rules and board vision | 20 | 20 | 18 |
| S2 Safety and the thinking loop | 12 | 12 | 7 |
| S3 Tactics | 24 | 24 | 24 |
| S4 Calculation | 8 | 8 | 8 |
| S5 Positional play and planning | 50 | 50 | 45 |
| S6 Attack, sacrifice and defense | 19 | 19 | 16 |
| S7 Endgames | 37 | 37 | 36 |
| S8 Openings and structures | 12 | 12 | 7 |
| S9 Game study | 7 | 7 | 2 |
| S10 Practical performance | 9 | 9 | 1 |
| S11 Self-direction | 7 | 7 | 0 |

**Building now:** Click a square: attackers and defenders listed (pins ignored); x-rays and the exchange outcome not yet; Training items from the map: the Square control lesson (L-POS-CONTROL-MAP-1) with rules-checked tap and count items is written; a hidden-map mode is not; Endgame tablebase items (files built; validation in progress); Attack, defence, sacrifice and calculation items from puzzle themes; Tranche 2a: calculation (4 of 7 nodes done and reviewed: candidates, visualize, compare, tree; batch c2 not started); Tranche 2b: positional play (p1-p6 written and validated; review pass unfinished on p3-p6); Tranche 2c: attack, defence, sacrifice, initiative (all batches written and validated; review pass unfinished); Tranche 2d: endgames (all batches written and validated; review pass unfinished); Lessons and exercises for the new gap nodes (written and validated: mate search, exchange sacrifice, practical resistance, knight and rook endings, four structure families; review pass unfinished, see docs/review-findings-pending.md); Resolve overlaps: 65 reduced to 1 (LOOP.V1.D1 pair), plus demonstration boards, thin lessons and item swaps listed in docs/overlaps-to-resolve.md; Acquire Tier 1 and verify Tier 2 candidates one by one (5 Gutenberg books stored; Capablanca refused because the file carries a 1949 notice; Wikibooks and the rest pending)

**Next up:** Independent audit of generated items (second implementation); Skill-graph chess-accuracy audit (adversarial reviewers); Mission completion screen; Adversarial code review of the app and fixes; Accessibility and mobile fixes from the review

**Waiting on you (gates and questions):** Strong-player review of explanations (gate G3, G6, G8); Baseline measurement before starting (gate G1); Identity study: three comparable treatments to choose from (question Q10); Usability rounds with real people (gate G11); Beginner test: five beginners and five club players (gate G11), fix what two or more stumble on; Strong-player review of the slice (gate G3); Web version online (gate G10) and the exe tested on a second machine; Put the receiver on Andrew's host and test one submission (gate G14); First testers and the evaluation plan started (gate G11); Course data model and a Courses view in the Course tab (question Q12); Turn on Pages in the repository settings (gate G10); Choose a name and a content licence (questions Q3, Q4); Optional sign-in to sync progress across devices (question Q11: needs a hosting and account choice); Baseline games and placement (gate G1)

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
- [x] Analysis page (More → Analysis): move tree with variations, eval bar and graph, clickable engine lines, whole-game analysis with accuracy, opening names, PGN/FEN import and export, saved games, control map. Not yet: board editor, tablebase lookup, engine-vs-you training from a position

## Phase 2c: Radial curriculum map (Andrew's idea, 29 October 2026; design: docs/map-radial-design.md)
- [x] Layout engine `lib/mapLayout.ts`: rings by prerequisite chain, a wedge per strand, crowding-aware radii, tests
- [x] `RadialMap` SVG with pan, zoom, fit, where-I-am, hover card with mark-as-done, nodes that fill with progress, lit paths, glowing next skills
- [x] Side panels: progress and challenge dock on the left, the selected skill's information on the right, fixed-width centre, bottom sheet on narrow screens
- [ ] Lesson links drawn as a second edge layer; keyboard route between connected skills; clicking a lesson in the list highlights its node

## Phase 2b: Square control map (Andrew's idea, 29 October 2026)
- [x] Control map toggle on boards: per-square counts and blue/orange tint, in lesson boards, move-by-move steps, exercise answers, game review and the Contrast lab (off in tests and in Play on purpose)
- [~] Click a square: attackers and defenders listed (pins ignored); x-rays and the exchange outcome not yet
- [ ] Value-aware version; derived views (outposts and holes, space, king zone, safe squares for each piece)
- [~] Training items from the map: the Square control lesson (L-POS-CONTROL-MAP-1) with rules-checked tap and count items is written; a hidden-map mode is not

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
- [x] Name chosen: Scholarmate (D25); trademark and domain clearance still open (G15)
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
- [~] Tranche 2b: positional play (p1-p6 written and validated; review pass unfinished on p3-p6)
- [~] Tranche 2c: attack, defence, sacrifice, initiative (all batches written and validated; review pass unfinished)
- [~] Tranche 2d: endgames (all batches written and validated; review pass unfinished)
- [~] Lessons and exercises for the new gap nodes (written and validated: mate search, exchange sacrifice, practical resistance, knight and rook endings, four structure families; review pass unfinished, see docs/review-findings-pending.md)
- [x] Review and fix pass on the tranche lessons (p3-p6, c2, a2, a3, e2-e4 done 29 October; p1, p2, a1, e1, g1-g3 earlier); human review (G3) still pending
- [ ] Contrast step: show the baseline result and ask the irrelevant item, as the lesson cards promise (review finding on the g2 lessons)
- [ ] Read-through of all lessons for voice, order and consistency
- [ ] Course: famous games analysed (each game verified move by move; original commentary)
- [ ] Courses: deep dives into each common opening (built on the openings data, no overlap with other lessons)
- [x] Overlap check in the curriculum tools (tools/check_overlap.py; found 3 duplicate lesson pairs, listed in docs/review-findings-pending.md)
- [~] Resolve overlaps: 65 reduced to 1 (LOOP.V1.D1 pair), plus demonstration boards, thin lessons and item swaps listed in docs/overlaps-to-resolve.md
- [x] Lesson pages show Connected lessons (builds on, uses, leads to, seen in a course), derived from the skill graph
- [x] Coverage audit script (tools/coverage_audit.py) and a by-level misconceptions note (docs/misconceptions-by-level.md); both from recall, to be replaced by real syllabi and learner data
- [ ] Check that every listed misconception has a practice exercise; write the missing ones
- [ ] Advanced club-style courses
- [x] Readability pass: text size, fewer nested boxes, stronger secondary text (first round; review on real screens)

## Phase 6: Data
- [x] Opening statistics from 4.75 million Lichess games in eight rating bands
- [x] Master (over-the-board) statistics: 329,379 top-level games (both players 2500+, first 12 moves) in Analysis and the Openings explorer
- [ ] Difficulty calibration from real learner data (needs learners)

## Phase 6b: Motivation (local, no server)
- [x] Evidence-based badges (Foundations, Mission complete, 20 in a row) on the Progress page; no points, avatars or shared board (decision D21)
- [x] Printable certificate listing the skills shown, and one for the whole curriculum
- [ ] Spoken lessons with AI voices (the lesson scripts are already plain text)
- [x] A "seen" marker on every skill and lesson (map dot, outline, lesson index), separate from mastery

- [x] Trivial-skill signals: five quick correct answers in a row, or a Too easy button, leave a skill out of mixed practice

## Phase 6e: Sources library (plan: docs/library-plan.md)
- [x] Plan: acquisition order, rights rule, catalog model, in-app Library design
- [x] Candidate list of 80 sources recorded (library/candidates.csv; unverified leads from ChatGPT)
- [x] `tools/fetch_sources.py`: rights check from each text's own notices, refuses unclear ones (first run: 5 stored, 3 refused for hand check: Fishburne x2 no year found, Young "all rights reserved" text)
- [~] Acquire Tier 1 and verify Tier 2 candidates one by one (5 Gutenberg books stored; Capablanca refused because the file carries a 1949 notice; Wikibooks and the rest pending)
- [x] `library/catalog.json` and `tools/build_library.py` (subjects, level, rights; used-in links not yet)
- [ ] Reading agents in the planned order: one synthesis sheet and coverage check per book
- [x] In-app Library: wall of book covers (27 books), details beside the cover on hover or click, reader with find and bookmark, download, sort and filter, search; data shelf and ideas-only pointers still to add
- [x] Check in check_all: every stored library text has a rights record and still passes the text check (or is on library/approved.json); lesson sources resolving to catalog entries still to do
- [x] Ship stored texts in the exe and web build (default yes, 3 MB cap per book, 8.5 MB total)

## Phase 6f: Top-level game data (Andrew, 29 October 2026: all of it, now back to the beginning)
- [x] `tools/fetch_games.py`: Lichess broadcasts (81 monthly files) and The Week in Chess weekly zips (issues 920 to 1668; earlier issues have no zip), resumable, stored locally and gitignored
- [ ] Older games (before 1994): PGN Mentor event files and public-domain game books; check each source's terms
- [x] Build master-game statistics (`tools/build_master_stats.py`, `tools/ship_master_stats.py`): de-duplicated, standard games only, about 7 MB shipped
- [ ] Famous-games course candidates ranked from the data (decisive, instructive, well-annotated)

## Phase 3c: The simplicity pass (design: docs/design-simplicity-pass.md)
- [ ] Complexity budget and the five rules adopted (one job per screen, three levels of depth, no overlap or shifting, words over widgets, progressive disclosure)
- [ ] Audit Today and the Start screen: first five minutes on a phone and a laptop, clicks and words counted
- [ ] Audit the lesson player and exercise screens
- [ ] Audit the Curriculum views (list, map, docks) and Practice and Progress
- [ ] Names and words sweep (one word per idea across the site)
- [ ] Accessibility and mobile checks per page; before and after screenshots in `docs/design-audit/`
- [ ] Beginner test: five beginners and five club players (gate G11), fix what two or more stumble on

## Phase 5b: Follow-ups from the review waves (29 October 2026)
- [ ] A genuine triangulation example (none exists in the single-pawn families searched; needs a richer generator or a human)
- [x] Cue-1 and cue-2 siblings for the doubled-pawn items (4 new)
- [x] Cue-1 and cue-2 siblings for convert, over-protection, opposite-bishop, attack and square-control items (about 26 new practice items)
- [ ] A dedicated opposite-coloured-bishops skill node and lesson (the items currently sit in L-END-MINOR-1)
- [ ] Resolve the last overlap pair (L-FND-THREAT-1 and L-LOOP-V1-1): keep the first, deepen the second
- [ ] Strong-player review (G3) of explanations; beta feedback from Andrew's friends and site stands in until then

## Phase 3d: Analysis page, what remains
- [ ] Clock times from PGN comments and a time-per-move graph
- [ ] Move labels beyond mistakes: best, book, brilliant (needs a stated rule and a check)
- [ ] Multi-chapter studies; image export; keyboard shortcut help
- [ ] Opening explorer pages using the master statistics for the whole Openings page

## Phase 6g: Famous games, wave 2 (29 October 2026)
- [x] Five more annotated games: Capablanca-Marshall 1918, Lasker-Capablanca 1914, Fischer-Spassky 1972 game 6, Short-Timman 1991, Tal-Botvinnik 1960 game 6 (13 course lessons in all; scores checked against several sources, game dates and endings stated only where sources agree)
- [ ] Wave 3: older public-domain games and endgame classics; opening deep dives; history and meta course (needs a named human reviewer for history claims)

## Phase 6d: Release 0.1, the first 10 hours (docs/first-10-hours.md)
- [ ] Review and fix pass on the 59 lessons of the slice (several batches are in progress)
- [ ] Strong-player review of the slice (gate G3)
- [ ] A test that the slice is reachable from the Start screen without dead ends
- [ ] Clear the human-review flags on exercises in the slice
- [ ] Web version online (gate G10) and the exe tested on a second machine
- [x] Human review and feedback: review panel on every lesson, report-a-problem on every exercise, export or send, PHP receiver and ingest tool (docs/feedback.md)
- [ ] Put the receiver on Andrew's host and test one submission (gate G14)
- [ ] First testers and the evaluation plan started (gate G11)
- [ ] Keyboard-operable board and screen-reader pass

## Phase 6c: Courses on top of the core (design: docs/course-families.md)
- [ ] Course data model and a Courses view in the Course tab (question Q12)
- [ ] Famous games course, pilot of about 8 games
- [ ] Opening deep dives, strongest and most common first
- [ ] History and opening-meta course
- [ ] Playstyles course (measured claims only, question Q14)

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
