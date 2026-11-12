# Autopilot: how an unattended session works

Andrew's standing order (12 Nov 2026): do everything possible without being asked, and save decisions that need him for when he can see them. This file is what a scheduled or looping session follows. `CLAUDE.md` rules (all ten) still bind.

## The loop
1. Read `CLAUDE.md`, `ROADMAP.md`, the tail of `DECISIONS-LOG.md` and `QUESTIONS-AND-GATES.md`. Run `git status`; if another session or a background tool (`tools/fetch_scans.py`, `tools/fetch_ia_bulk.py`) is running, leave its files alone.
2. Pick the next task: first any `[~]` (in progress), then the earliest unticked `[ ]` in the core phases that needs no human input. Skip tasks tagged `(feedback)` and tasks waiting on a decision in `QUESTIONS-AND-GATES.md`.
3. Build it small. Follow `docs/workflow-guide.md` for lesson waves (explicit models and effort, every lesson reviewed, never start a batch twice).
4. Check: `tools/check_all.py`, `tools/validate_lessons.py` per changed file, `tools/check_graph.py --strict`, `npm test`, `npx vite build`; load the routes the change touches.
5. Commit in a logical commit and push to `Wizard1999/LearnChessFree` only (never force, never rewrite history). Scan for secrets and personal data first.
6. Tick the roadmap, run `tools/update_roadmap.py`, log any decision of your own in `DECISIONS-LOG.md`.
7. Repeat until nothing unblocked is left or the time budget of this run is spent.

## What to save for Andrew instead of doing
Anything that spends money, publishes somewhere other than the named repository, contacts people, needs his taste (visual design directions, names, tone), needs a strong player's judgment (G3), or removes content. Write each as a question with a stated default into `QUESTIONS-AND-GATES.md` and carry on with the default only where it is reversible.

## Stop conditions
Checks failing in a way you cannot fix in the run (revert your own change, log it); the same task failing twice (log and move to the next); no unblocked task left. End every run by writing a short note at the top of `QUESTIONS-AND-GATES.md` under "Autopilot log" with the date, what shipped (commit hashes), and what is waiting on Andrew.
