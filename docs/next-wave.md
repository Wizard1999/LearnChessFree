# What to start when the usage window resets (written 29 October 2026, evening)

Say "go" and I start these in this order, a few agents at a time (the 5-hour window is the limit; about 1% per minute while ten agents run).

1. **Review-and-fix pass on the unreviewed lessons** (about 52 lessons: batches c2, p3 to p6, a2, a3, e2 to e4). Script: `tools/workflows-review-tranche2.js` (copy of the session script; it takes batch ids as `args`, for example `["p3","p4","p5","p6"]`). Run four batches first, then the rest. Known item for p5: two competing sets of lessons exist (relaunch text is live, the original agent's set is in `content/lessons-alt-p5/`), pick one in the review.
2. **Square control lesson** ("Square control: the whole board at once"), linking to L-SAF-COUNT-1, L-FND-COUNT-1, L-SAF-COUNT-FUTURE-1, L-POS-CENTER-CONTROL-1, L-POS-SPACE-1, L-POS-OUTPOST-1, L-POS-WEAKSQ-1, L-POS-ACTIVITY-1. Rule: nothing already taught is taught again; items are control-map questions checked by the rules engine.
3. **Library reading agents** (one per stored book, in the planned order: gap-filling books first): synthesis sheet in `sources/sheets/`, coverage check against the skill graph. Stored: pg4913 Chess and Checkers, pg5614 Chess Strategy, pg4902 Bird, pg34180 Edge on Morphy, pg78804 Philidor. Also Tier 1 Wikibooks Chess (CC BY-SA) to locate and check.
4. **Courses on top of the core**: famous games wave 2, then opening deep dives (draft one) per `docs/course-families.md`; playstyles only from measured samples (Q14).
5. **Release 0.1 hardening**: review the first-10-hours slice (`docs/first-10-hours.md`), reachability test from the Start screen.

After each wave: `tools/validate_lessons.py` (no args), `tools/check_all.py`, `tools/check_graph.py --strict`, `tools/check_overlap.py` (stay at 1), `tools/build_content.py`, `npm test`, `npx vite build`; delete any `app/src/_audit_*.test.ts`; `tools/update_roadmap.py`; commit and push (pull `--no-rebase` first). Do NOT start a second copy of a batch while one is running (this caused the p5 collision).
- After any UI change: load every route (Today, Curriculum x3, Practice, Progress, Analysis, Library, Games, Lab, Plan, Play, Openings, Roadmap, Settings, a lesson, Placement, Drill) and confirm none shows 'This page hit a problem'.
