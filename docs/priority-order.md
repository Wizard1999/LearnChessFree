# Priority order for the rest of the roadmap (8 Nov 2026)

Rule behind the order (D54-D57): do what changes a new learner's first hour first, then what makes the core complete, then breadth. Feedback from real people never gates anything. Labels: [V] measured, [I] my judgement.

## Tier 1: the first hour (finish before anything else)
1. **Verify the live deploy and the phone layout on a real phone** [V: built only in emulation]. A broken first screen costs every learner.
2. **Record progress from the guided first game** (a reload currently shows the Start screen again) and add the Start-screen hook check to the route smoke test.
3. **Re-sequence the path for the hook**: special rules (castling, promotion, en passant, stalemate) after the first game; first tactics early (loose pieces, mate in one, fork by about hour 2, then pin, skewer, back-rank, discovered). `tools/build_path.py`, then `check_path_time.py` made strict in `tools/check.py`.
4. **Rebuild stage S2 lessons (21) to the stage budgets**, measure cost per lesson, report cumulative path minutes. S2 is "first complete games", the next thing a hooked learner meets.

## Tier 2: the core path, in path order
5. **S3 to S4 lesson rebuilds** (95 lessons): first wins, basic tactics, simple plans. Decide the "-1/-2/-3 sibling merge" question after the S2 cost numbers (Steps needs about a third of our lesson count).
6. **Pool-depth floor**: about 30 validated unlabelled items per skill in S0-S4 (54 skills are under 20).
7. **Chess Steps adoptions**: closing reminder card per lesson, a named search routine per tactic, pool roles and a thinking-ahead strand.
8. **Stage milestones with the 80 percent unlabelled mix** (shown, never gating) and one retest.

## Tier 3: make the core trustworthy and complete
9. **Complete core figure to 100 percent**: lessons meeting the depth standard (the largest share), then the checklist.
10. **S5 to S7 lesson rebuilds** (377 lessons) in path order, batched waves with a verdict for every lesson.
11. **Re-review the lessons fixed this week** (Foundation and 45 openings): fixes were applied but not re-reviewed.
11b. **Art for courses** (decision D59, `docs/art-direction.md`, ROADMAP Phase 3h): frame kit and empty-slot fallback, first batch of 14 images, provenance register and `check_art.py`. Direction accepted; start only when items 9 to 11 are mostly or fully done, and before the advanced extras below.
12. **Remaining openings series and the history, meta and playstyle courses** (breadth after depth).

## Tier 4: polish and reach
13. Tablet and landscape layout, install and offline, Play setup as a sheet.
14. Audio regeneration for the new lessons (70 MB budget).
15. Sign-in sync (export/import), the simplicity pass, a lawyer's look at `LICENSES.md`, the product page counts.

## After release (does not gate anything)
Strong-player review (G3), learner pilots and baseline, usability rounds, receiver on Andrew's host.

## Why this order
- Tier 1 touches every new learner in the first hour; Tier 2 follows the path order so the earliest lessons are right before later ones exist.
- Rebuilding S5-S7 first would polish lessons few learners reach before the ones everyone meets [I].
- Waves are the slow, costly part: do S2 first to learn the real cost per lesson, then size the rest (the earlier 2 to 3 weeks of tokens estimate depends on that number).
