# Chess learning system: project constitution

Read `README.md` for the document index and `03-product-design.md` for decisions D1–D13. This file is the short list of rules that must survive any session, including a one-shot "build it" request.

## Goal
The best possible place to learn chess and to learn how to learn: text-and-board lessons, unlabeled testing, machine-verified claims, contrast lab, games feeding a visible curriculum graph, support that fades with evidence. Not a play platform, not video, not a business. Andrew (student zero, a mid-level player) is the first user; the work doubles as an experiment in teaching self-directed learning.

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
- Explain design reasoning so Andrew can agree or disagree. Prefer a decision with a stated default over a question.
- He dislikes permission interruptions: batch work, avoid unnecessary browsing, and do not ask in chat for access he has already granted. Reddit is blocked in the browser tool; bot-checked sites (US Chess) are not to be bypassed.
- Work in milestones with gates (`03-product-design.md` §7). Do not build features beyond the current milestone. Update the docs and the memory file when a decision changes.

## Commands
- Validate content: `./tools/.venv/Scripts/python.exe -I tools/validate.py` (add paths to limit). Self-test the validator: `tools/selftest.py`.
- Engine: npm `stockfish@19.0.1` lite single-thread (`app/node_modules/stockfish/bin/`); the app copies it to `app/public/engine` via `npm run prepare-engine`.
- App: `cd app && npm run dev` (port 5173) or `npm run build`.
- Datasets: `library/data/` (gitignored; URLs in `library/REGISTRY.md`). Source texts: `sources/raw/`; synthesis sheets: `sources/sheets/`.

## Current state
Autonomous build phase (Andrew asked me to take over; questions go to `QUESTIONS-AND-GATES.md`, my own calls to `DECISIONS-LOG.md`).
- **App** (`app/`): Today, Course map, lessons, Practice, Placement, My plan, Contrast lab, Games review (detector tags), Openings explorer (transposition tree, bands, repertoire, PGN import, drill), Play, Library, Settings. Thinking Loop prompts fade on evidence (`lib/loop.ts`). `npm test` and `npm run build` pass.
- **Content:** 194 skill nodes (`check_graph.py` clean), thousands of generated and puzzle-derived items, ~27 lessons. Only items whose evidence matches ship (`build_content.py`); the rest wait for validation. Every lesson is `needs-human` until a strong player signs off (G3).
- **After any agent batch run:** `tools/check_all.py`, `tools/check_graph.py`, `tools/validate_lessons.py`, `tools/validate.py`, `tools/build_content.py`, `npm test`, `npm run build`. Agents drift on ids and schema.
- **Not done:** human review (G3), baseline (G1), commits (G2), hosting (Q5), master-game statistics (Q6). Evaluation design: `docs/evaluation-plan.md`. Deploy notes: `docs/running-and-deploying.md`.
