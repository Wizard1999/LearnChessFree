# Chess Steps compared with our curriculum (8 Nov 2026)

Builds on `docs/competition-chess-steps.md` (30 Oct; the method's facts and sources are there, with their limits: no workbook or manual was seen inside). This note compares it with what we actually have today and says what to take. Labels: [V] measured in our files today, [S] from the earlier research note, [I] inference, [H] hypothesis.

## Side by side
| | Chess Steps [S] | Scholarmate today [V] |
|---|---|---|
| Shape | Six steps, rules to about 2100; each step a trainer manual of 17 to 31 lessons plus a 56-page workbook | One graph of 206 skills, a recommended path of 8 stages and **463 lessons** (386 core), plus 41 opening lessons |
| Lesson | Short, spoken by a trainer, ends in a one-page reminder; explanation is small | 12 steps in the median, but the Foundation lessons run 22 to 35 minutes each (409 minutes before the first full game); being rebuilt shorter (D55) |
| Practice | The bulk: about 490 to 630 positions per workbook, four or five books per step (basic, extra, plus, thinking ahead, a mixed unlabelled test) | 9,532 exercises over 204 nodes, **median 39 per node**, 54 nodes under 20, some with 2; tactics 1,921, endgames 1,752 |
| Labelled to unlabelled | Themes drilled labelled, then the Extra and Mix books remove the label | Same idea built in (cue ladder; stage checks are unlabelled mixes) |
| Gate | Exam and diploma per step; 80 percent on the Mix book means the step is mastered | Stage checks exist; no diploma; mastery is evidence-weighted, never a gate (rule 6) |
| Tactics | Early and central: Step 2 is attack techniques and winning material; "games are decided by tactics" | Late: the first fork is about 25 hours into the path (D57 fixes this) |
| Positional play | Late and modest (mostly Step 4 on) | Present from Stage 3 on, but thin and unbalanced against tactics (POS 1,604 items) |
| Games | None in the product; played at the club | Games feed the graph; first game promised inside the first hour (D55, D56) |
| Teacher | Needed (the workbook has little prose) | None: all explanation must live in the lesson |
| Evidence | Vendor claims only; no independent trial found | Machine-checked claims; no learner trial (feedback comes after release, D54) |

## What stands out
1. **They need far fewer lessons.** A whole course to 2100 is on the order of 100 to 170 lessons across six steps [I, from the lesson counts per step]. We have 463. Our count came from splitting every skill into -1, -2 and -3 depths, and from the early over-lengthening; many are one idea in several sittings. This supports a merge of the small siblings (open question from the earlier turn) and a firm cap on the core.
2. **Their lessons are short and their practice is huge.** The learning happens in the exercises; the lesson is a few minutes and a reminder. That is exactly Andrew's point on lesson length (D55): keep lessons short and put the volume in the pools.
3. **Tactics early is the field's consensus**: Steps, Lichess and Chesscademy all do it. We buried it (D57).
4. **Even exercise volume.** They hold roughly 500 per step evenly; our pool depth is lumpy (482 on one node, 2 on another).

## Notes to take (adopt, with where it goes)
1. **Closing reminder card per lesson**: 5 to 8 lines, the whole lesson on one screen. We have "say it back", which asks the learner; add the model answer as the reminder. Cheap; goes in the lesson standard.
2. **Pool roles**: label each practice pool by role: matched to the lesson, more of the same, depth/new, **thinking ahead**, and the mixed unlabelled test. Practice already schedules by evidence, so this is a tag plus a mode, not new content for most nodes.
3. **A thinking-ahead strand** (calculation and visualisation: "play these three moves in your head, where is the knight?"). We have no such strand (S4 calculation is the nearest). Add a short run of items per tactic block.
4. **A named search routine per tactic**: what to look for, in what order ("checks, captures, threats" and the motif's own tell). Put it as one card at the start of each tactic lesson and in the reminder.
5. **Minimum pool depth per node**: a floor (about 30 unlabelled items for any skill in the first four stages) so no node is thin. 54 nodes are under 20 today; generate with the existing validated generators.
6. **A visible step finish line without a gate**: a stage check scored on an unlabelled mix with a stated threshold (the 80 percent idea) shown as a milestone with a retest later. We have the checks; surface the milestone.
7. **A fixed lesson shape** within a stage so the learner learns the rhythm (hook, act, reminder): lowers load. Make the shapes explicit by stage in the standard.
8. **Preparatory-move tactics** (luring, clearing, chasing, aiming; 2.5 moves deep) are their Step 4 core. We cover decoy, deflection, removing the defender and clearance; check the set is complete and drilled at that depth.

## What we should not copy
- A teacher-dependent shell with little prose: we have no teacher, so explanation stays, but short.
- Tactics-only until Step 4: we introduce structure and plans earlier because adult learners and the first-game hook need them [H].
- Diplomas as gates: we show milestones, never block (rule 6, D54).

## Roadmap items created
Phase 5e gets: closing reminder card; pool roles and the thinking-ahead strand; a pool-depth floor per node; a named search routine per tactic. The lesson-count question (merge or not) is for Andrew after the Stage 2 batch gives a measured cost per lesson.

Not established here: the lesson text inside any Steps manual, and the real exam format (see the earlier note's open questions).
