# Words sweep: one word per idea (visible text only)

Source of truth: D26 (Curriculum, sections, "All lessons") and the vocabulary section of `docs/authoring-guide.md` (loose, undefended, attacked, threat, counting values). Code identifiers, routes and URL parameters are unchanged (`/course`, `?mission=`, `Mission` type, `practice` route).

| Idea | Visible word | Replaced / not used |
|---|---|---|
| The whole structure | Curriculum | Course (code and URL only) |
| A strand group | Section | Mission, Missions ("MISSION PROGRESS" became "SECTION PROGRESS", "the mission's" became "the section's") |
| A teaching unit | Lesson | Unit |
| One thing to answer | Exercise | Question (warm-up counter, "Next exercise", challenge text, daily plan text), Item, Puzzle (kept only inside the proper name "Lichess puzzle database") |
| Training | Practice (noun and verb), practiced | Practise, practised, unpractised (the codebase majority was US: practice 70 vs practise 4) |
| Spelling | US: unlabeled (22 vs 16), colors, analyzed, unpenalized | unlabelled, colours, analysed, unpenalised |
| In-exercise assistance | Hint(s) | "Help is allowed" became "Hints are allowed"; "outside help" (other people or tools) stays, it means something different |
| Mastery levels | Seen, Level one, Level two, Reliable, Mastered | no variants found ("Level 2" etc. do not occur in visible text) |

Left alone on purpose: `analyse` (engine method name), `Colour` type in `controlV2.ts`, "Question" in the review form (a report type, not an exercise), "QUESTIONS-AND-GATES" on the Roadmap (a project file name), and British spelling in content/ (another agent's area).
