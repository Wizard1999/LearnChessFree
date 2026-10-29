# Course families and learning paths

Written 28 October 2026 (autonomous session). Status: design, not built. Decision D22 in `DECISIONS-LOG.md`.

## The idea in one paragraph
The **core curriculum** (204 skill nodes, strands S1 to S11) stays the spine: every concept is taught once, in prerequisite order. **Courses** are optional paths layered on top. A course never re-teaches a concept: its lessons *use* core skills (as prerequisites) and teach only what is new about the subject (a specific opening, a specific game, a player's style, an era). The overlap checker (`tools/check_overlap.py`) enforces this, and a course lesson names the core skill it relies on so the learner can jump back.

## Families, in the order I would build them
| # | Family | What is new in it | What it relies on | Checkable how | Rights |
|---|---|---|---|---|---|
| 1 | **Famous games, annotated** | The story of a game: where it was decided, which core idea decided it | Tactics, strategy and endgame skills | Every position and "decisive moment" claim engine-checked (swing in evaluation at a stated depth); game moves are facts | Moves are facts; commentary is ours; public-domain game collections for sources |
| 2 | **Opening deep dives** (one course per system) | Main line, traps, refutations of common bad tries, typical middlegame plans and structures | S8 opening principles and structure skills, tactics | Lines checked with the engine and the opening data (`app/public/openings`); popularity numbers from the bands we hold | Facts and our wording; ECO names CC0 |
| 3 | **History and the opening "meta"** | Eras, how ideas changed (e.g. from open games to hypermodern), why popularity shifted | Opening courses for context | Popularity over time only from data we hold; narrative from public-domain histories (Bird, Edge, Staunton) | PD books; our wording |
| 4 | **Playstyles of great players** | A player's measurable habits | Strategy and opening skills | **Only measured claims**: from a named game sample (trade rates, opening clusters, average game length). No "X is strong at Y" without numbers | Game moves are facts; claims state the sample |
| 5 | **Advanced club-style courses** | Dvoretsky-style technique topics (prophylaxis in depth, transformation of advantages, conversion), practical decision rules | Core strategy and calculation | Position claims engine-checked; rules of thumb labelled | Our wording |

## Structure (data design, to build with the first course)
- A course is a file `content/courses/<id>.json`: `{id, title, summary, family, uses: [skill ids], lessons: [lesson ids], order, audience}`. Lessons live in `content/lessons` like any other and carry `course: <id>` so the app can list them under it.
- Each lesson states `uses` (core skills it assumes). The app shows "Needs: ..." and links to those lessons, and a course lesson's prerequisites use the same met/assumed machinery as core lessons (nothing is locked).
- The Course tab gets a third view, **Courses**, listing families and their courses with progress bars (same pattern as the lesson index).
- The overlap checker also compares a course lesson against core skills: a course lesson may not claim a core skill as its main skill.

## First course to build: "Famous games" (pilot)
Eight to ten games, chosen for how clearly they show one core idea each (examples to choose from, all public-domain era or old enough that the moves are simply facts): a king-hunt, a classic sacrifice, a positional squeeze, a famous endgame. Per game, a lesson of about 10 minutes: the setup, three to five **decision points** where the learner predicts the move before seeing it (these are ordinary find-the-move items with engine-checked accepted sets), and a closing card naming the core skills the game used, with links. Source for the moves: public-domain collections (e.g. Edge on Morphy, Bird, Young) and databases; the commentary is written fresh and checked against the engine.
Why first: it is the largest gap the coverage audit found, it needs no new engine of checks (decision points are existing item types), and it shows the whole curriculum working.

## Opening deep dives (second)
Template per opening (one course, five to seven lessons): 1. the idea and the pawn structure it creates; 2. the main line to move 10 with the reason for each move; 3. the most common deviations by the opponent and the refutation of each bad try; 4. traps (checked by engine, shown only where they actually occur in the data); 5. typical plans in the middlegame (links to core strategy skills); 6. a drill set (the repertoire drill already exists); 7. when this opening is a good choice for a given kind of player (stated as a rule of thumb). Order of openings: by popularity in our own data, strongest-and-most-common first.

## What I will not do without a decision
- Claims about named players' "strengths" that are not computed from games.
- Any course text that follows an in-copyright book.
- Anything that needs a server or an account (a shared leaderboard, a community).

## Open questions (logged as Q12 to Q14 in QUESTIONS-AND-GATES.md)
