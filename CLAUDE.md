# Chess learning system: project constitution

Read `README.md` for the document index and `03-product-design.md` for decisions D1–D13. This file is the short list of rules that must survive any session, including a one-shot "build it" request.

## Goal
The best possible place to learn chess and to learn how to learn: text-and-board lessons, unlabeled testing, machine-verified claims, contrast lab, games feeding a visible curriculum graph, support that fades with evidence. Not a play platform, not video, not a business. Andrew (student zero, a mid-level player) is the first user; the work doubles as an experiment in teaching self-directed learning.

**The hook (permanent):** the first moments decide whether anyone stays. Get a new learner looking at a board and playing a guided real game within about 10 minutes, and able to play a legal (bad) game about an hour later; teach rules when the game needs them; every early lesson is a small win plus a visible next want. Length follows difficulty (decisions D55, D56; `tools/check_path_time.py` measures it).

## Hard rules
1. **No learner-facing claim without a check.** Every item needs claims that `tools/validate.py` passes (rules, engine, tablebase) or a named human reviewer. Verify the *claim* ("wins the queen and keeps the knight"), not just the engine's score. A "wins material" claim must not end in a dead draw (the validator enforces this).
2. **Never trust a position you wrote by hand.** In this project, about half of hand-written tactical positions had defects (dead draw, trapped piece, hidden back-rank mate). Run the validator and `tools/selftest.py` after any change to it.
3. **Label evidence everywhere:** [V] verified here, [S] secondary, [R] recalled, [I] inference, [H] hypothesis. Say plainly what was not checked. Do not report a source as read unless it was.
4. **Rights:** original wording only. Facts (moves, bare positions) are usable. Never download or use in-copyright books from unauthorized uploads; uploader "public domain" tags are not evidence (two such scans were found to be in-copyright editions and deleted). Check the copyright notice and metadata. See `library/REGISTRY.md`.
5. **Simulated experts are labeled simulations.** No fabricated quotations or endorsements (`docs/council-synthesis.md`).
6. **No ratings without evidence grades** (G0 guess … G3 replicated). A rating attaches to items and learners, never to a concept.
7. **No live AI in the learner's loop in v1.** AI is the author's assistant; feedback comes from detectors and reviewed text.
8. **Commit and push only to the repository Andrew named** (github.com/Wizard1999/LearnChessFree, public by his choice), in logical commits, never rewriting history, after the checks pass (`tools/check_all.py`, `npm test`, `npm run build`). Do not publish anywhere else, enable hosting, send, or spend anything external without asking. Before any push: scan for secrets and personal data, keep large intermediates out (`.gitignore`).

## How to work
- **Keep the roadmap current.** `ROADMAP.md` is the visible plan (also shown in the app on the Roadmap page). When a task finishes, tick it (`[x]`, or `[~]` while in progress) and run `./tools/.venv/Scripts/python.exe -I tools/update_roadmap.py`, which recomputes the percentages and the coverage metrics from the real files. Add new tasks when new work appears. Andrew wants to see what is built and what is next at all times.
- **Agent waves:** use `tools/workflows/lesson-wave.js` and follow `docs/workflow-guide.md` (batched authors, every lesson reviewed with its own verdict, explicit models and effort, short briefs, one full check at the end). Never economise on review or on the Foundation audit.
- **Player feedback never gates readiness (Andrew, 8 Nov 2026).** There is no room to pilot or trial before release: it ships soon and the data arrives over time. Tasks that wait on real people (reviewers, pilots, testers) carry the tag `(feedback)` in `ROADMAP.md`, sit under "After release", and are left out of every percentage and readiness condition. The Roadmap also shows one headline figure, **Complete core**, computed by `tools/readiness.py` (`core_complete`).
- Explain design reasoning so Andrew can agree or disagree. Prefer a decision with a stated default over a question.
- He dislikes permission interruptions: batch work, avoid unnecessary browsing, and do not ask in chat for access he has already granted. Reddit is blocked in the browser tool; bot-checked sites (US Chess) are not to be bypassed.
- Work in milestones with gates (`03-product-design.md` §7). Do not build features beyond the current milestone. Update the docs and the memory file when a decision changes.

## Commands
- Validate content: `./tools/.venv/Scripts/python.exe -I tools/validate.py` (add paths to limit). Self-test the validator: `tools/selftest.py`.
- Engine: npm `stockfish@19.0.1` lite single-thread (`app/node_modules/stockfish/bin/`); the app copies it to `app/public/engine` via `npm run prepare-engine`.
- App: `cd app && npm run dev` (port 5173) or `npm run build`.
- Datasets: `library/data/` (gitignored; URLs in `library/REGISTRY.md`). Source texts: `sources/raw/`; synthesis sheets: `sources/sheets/`.

## Current state
Autonomous build phase (Andrew works at his day job and asks me to take over; questions go to `QUESTIONS-AND-GATES.md`, my own calls to `DECISIONS-LOG.md`). Brand: **Scholarmate**, credit "Created by Andrew Valentine" (rule 9). Live beta: andrewvalentine.net/scholarmate (Vercel; base `/Scholarmate/`, keep the tab icon link root-relative).
- **App** (`app/`): Start screen with one button; Today (one main card, rest folded); **Curriculum** = All lessons list, Courses, and the **radial Map** (`components/RadialMap.tsx`, `lib/mapLayout.ts`: centre skill, rings by prerequisite chain, a wedge per strand, nodes fill with progress, white paths brighten with finished prerequisites, glow on the next skills, blue/orange links for the chosen skill; left dock = progress and challenge, right dock = selected skill, fixed-width centre; no overlap, no shifting); Practice, Placement, My plan, Contrast lab, Games review, Openings, Play; **Analysis** (move tree with variations, comments and marks, eval bar and graph, whole-game analysis, learn from mistakes, board editor, threat arrows, optional online tablebase, top-level game statistics when `app/public/masters/stats.json` is built); **Library** (wall of covers for about 27 rights-checked books, reader, download); Roadmap; Settings. Control map toggle on lesson boards, game review and the lab.
- **Content:** 204 skill nodes (graph clean), about 7,040 shipped items, 202 lessons, all `needs-human` until a strong player signs off (G3). Review waves done for p3-p6, c2, a2, a3, e2-e4; missing exercises are being authored (`content/items/gap-*.json`).
- **After any agent batch run:** `tools/validate_lessons.py` (no args), `tools/check_all.py`, `tools/check_graph.py --strict`, `tools/check_overlap.py` (stay at 1), `tools/build_content.py`, `npm test`, `npx vite build`, **then load every route** (see `docs/next-wave.md`). Never start a workflow batch twice. Agents drift on ids and schema.
- **Tools added:** `tools/fetch_sources.py` and `tools/fetch_archive.py` (rights text check is mandatory; uploader tags never clear a book), `tools/build_library.py`, `tools/fetch_games.py`, `tools/build_master_stats.py` + `tools/ship_master_stats.py`.
- **Not done:** human review (G3), baseline (G1), sign-in sync (Q11 option A chosen: export/import), opening deep dives and history/meta/playstyle courses, the simplicity pass (`docs/design-simplicity-pass.md`), a lawyer's look at `LICENSES.md`.

## Credit (permanent)
9. **Andrew's name stays on it.** The masthead line "Created by Andrew Valentine" (`app/src/brand.ts`: `author`, `byline`) shows in the header of every page and look, with a footer line, `NOTICE`, the author meta tag and `package.json`. Never remove or hide it, in any redesign, name change, exe or deploy. If the credited name should change, he says so; the one edit is in `brand.ts`.

## Survival (permanent)
10. **It must stand alone.** If a USB stick with Scholarmate on it were the only thing of chess that survived, a person with a computer and no network must be able to learn the game from nothing and go on to strength: rules, every lesson and exercise, the engine, the opening and game data, and the library **with the original page scans, not only extracted text**, all inside the download and working with no connection. No feature may need a server, an account or a live embed to function (a link to the web may be offered as an extra, never as the way). When a size or repo limit forces a choice, the offline build gets everything and git gets only what the repository can carry (large assets such as `app/public/library/scans/` are built by tools and shipped in the offline build). Tracked in `ROADMAP.md` under "Core".
