# Plan for the session that resumes after the pause (about Wednesday 4 November 2026, evening)

Written 31 Oct 2026 so nothing Andrew said is lost. Everything below is also in `ROADMAP.md` (phases 2e, 2f, 2g, 5e, 5f, 5g) and `DECISIONS-LOG.md` (D37 to D42). State at the pause: everything committed and pushed; the full `tools/check.py` passed at the last push; live beta at andrewvalentine.net/scholarmate (Vercel builds from the repository).

## Reordered after the independent review (D43; details in ROADMAP phase 2h)

Four bounded packages, each ending in something usable: (1) trust and friction: items 1 and 2 below plus the mastery, confidence, step-id and save-failure fixes; (2) the beginner journey: item 3 below, a gentle default opponent, one post-game review moment, a few real beginners; (3) one complete opening application on the Dragon series: item 5 plus a post-game thematic review; (4) controlled expansion: a small batch of core lessons and one more opening series, reviewed for quality, loading cost and saved-progress migration. The 17 other opening series and the culture rewrites wait until package 3 shows the shared components work. Items 4 and 6 (map stages, real games) slot into packages 2 and 3.

## Colour palette (D45, roadmap 3e)

After the current app queue lands, apply the new palette in one pass: tokens first (the app already uses CSS variables), then roles, the map and board colours, `tools/check_contrast.py` in `tools/check.py`, the tick-and-cross rule, and a screenshot review of the main pages in both looks. Do not mix this with the map-stage work.

## Up next as colour and the design direction (D46, roadmap 3f)

The Up next button is already gone; roll the highlight-plus-label design out to the lesson list, courses, Progress boxes and Practice. Then the palette pass (3e) with the type, spacing and geometric-illustration direction. Linked hover (D44) applies to every highlighted item.

## A luminous school (D47, roadmap 3g)

Part of the palette and design pass (3e, 3f): the design brief and test, two rhythms, the reveal-as-explanation pattern in the depth standard, `docs/visual-language.md` with a test, selective glow, texture and type rules. Painted-world illustration is out; geometric shapes in the palette are in.

## A finishable Foundation (D48, roadmap 2i)

Reshape the path into tracks with a published Foundation and a capstone (before wider rollout of new lessons, because it decides which lessons the beginner rebuild and package 4 should be). First deliverables: `docs/foundation.md`, `tools/foundation_matrix.py`, the track field in `tools/build_path.py`, the rules-completeness pass (draws), the winning-a-won-game lesson and the opponent-awareness habit lessons, the opening starter package. The map's stage rings should become track-aware.

## Mobile map redesign (roadmap 2j)

A hotfix is in (single scrolling control rows, hidden hint and legend). When the app queue finishes, run the real redesign as one agent task: full-bleed map, thin top bar, floating round map buttons, one filters sheet, a draggable skill sheet.

## A dedicated mobile design (D49, roadmap 2k, contains 2j)

Not a hotfix. After the current app queue: first `docs/mobile-design.md` (wireframes of the bottom tab bar, the map, a lesson, an exercise, Practice and Play, Today and Progress at 375x812, with the touch and safe-area rules), then build it page by page, then test on a real phone. Keep the byline in the phone header (rule 9).

## Where things stood on 7 Nov 2026 (for the next session or after compacting)

**Git:** `main` is 4 local commits ahead of `origin/main` and NOT pushed (app queue 4, plans D44 to D50, the lesson-wave template, a daily-practice fix). The working tree also holds uncommitted work: the generated content outputs (`app/public/content/*`, hash-named files, `readiness.json`), the new map name plates (`app/src/lib/mapLabels.ts`, `RadialMap.tsx`), the quieter map lines, and the look workflow's edits to `index.css`, `appearance.ts`, `Settings.tsx`, `theme.css`, `app/src/styles/palette.css`, `index.html`. Push only after the full `tools/check.py` passes. The live site (Vercel builds from GitHub) therefore still shows the 30 Oct to 1 Nov build.

**Workflows (resume with `Workflow({scriptPath, resumeFromRunId})`; finished agents replay from cache):**
- Content week 1 (beginner rebuild, Italian series, core batch, Dragon finale, review slice): STOPPED to save the 5-hour limit. Script `C:/Users/Ender/AppData/Local/Temp/claude/O---Chessteaching/4071769d-cf5b-453e-9168-98863c2f445a/scratchpad/content-week-1.js`, run id `wf_2528c461-535`. Done: path rebuild (S0 + S1 about 155 planned minutes), Dragon finale, review-slice tooling, many authors. Not done: many reviews and fixes (beginner lessons), the Italian series authors, core-batch reviews. Lessons may be half-rewritten: run `tools/check_all.py` and `tools/validate_lessons.py` after resuming.
- Look and colour v3 (new opt-in 'Scholarmate' look, light and dark, colourful, old looks stay default): running when this note was written; script `C:/Users/Ender/.claude/projects/O---Chessteaching/4071769d-cf5b-453e-9168-98863c2f445a/workflows/scripts/look-and-colour-v3.js`, run id `wf_020d4e28-a36`.

**Owner preferences this week:** old look stays the default and the new look is opt-in and far more colourful (D50); Plus Jakarta Sans plus a serif for titles; both light and dark; Up next is a colour not a button; linked hover across windows (D44); text rings for the stage names; map names as non-overlapping plates (done, unpushed); mobile redesign is its own pass (roadmap 2k, D49); a finishable Foundation with a capstone (D48); Maia finale games (D41); real games prescribed by the curriculum (D42). Use `tools/workflows/lesson-wave.js` for lesson waves (every lesson reviewed, stronger-model audit for the Foundation).

**First actions next time:** check usage (5-hour limit resets about 15:00 UTC on 7 Nov); resume the content workflow; wait for the look workflow; run `./tools/.venv/Scripts/python.exe -I tools/check.py`; fix overlaps and failures; rebuild the content (`tools/build_content.py`); regenerate the lesson audio only once, after the rewrites (`tools/make_audio.py`); commit and push; confirm the Vercel deploy is green (the site is about 200 MB); then continue with roadmap 2k (mobile design), 2i (Foundation), 2l (forks split and the review follow-ups).

**Update, 7 Nov 2026 (later):** the look workflow (`wf_020d4e28-a36`) FINISHED: the old 'Friendly' look is the default again; the new opt-in 'Scholarmate' look (light, dark, system) is built (`app/src/styles/palette.css`, `scholarmate.css`, `lib/hue.ts`, `components/GeoArt.tsx`, `UpNextMark.tsx`, `ResultMark.tsx`, Plus Jakarta Sans), `tools/check_contrast.py` passes 212 pairs, `docs/visual-language.md` and two guard tests exist. Afterwards I changed the dark base to a warm dark paper (`--night-*` tokens) and added a faint paper grain on the page background. Still open from that work: board threat and check colours and the board overlays are not restyled; Games, Openings, Analysis, Lab and Play were not reviewed in the new look; the dark colour-field cards are still navy (ask Andrew whether to warm them); the map arc labels are not strand-coloured; the Up next field uses an ink button on persimmon (a deliberate deviation from 'cobalt = the one primary action', needs his OK); the phone header clips 'More' (belongs to the mobile redesign); roadmap ticks for 3e, 3f, 3g and a decision-log entry were not made; a raw-hex lint test is not yet strict because legacy files still hold hex colours. The 5-hour usage limit was at 87 percent (resets about 15:00 UTC on 7 Nov): do not launch workflows until it resets; the content workflow `wf_2528c461-535` is still the next thing to resume.

## Start with (in this order)

1. **Check the deploy.** The built site is about 200 MB (70 MB lesson audio, 17 MB Maia models, onnxruntime wasm, 10 MB items, 7 MB master statistics). Confirm the latest Vercel build is green; the size and file-count limits of his plan were never checked. If it fails, move the audio to separate hosting before anything else.
2. **Quick fixes from the live-build review of 5bb096 (roadmap 2g).** The skill panel offers a stage check as the first lesson for Forks (course lessons such as L-SC-S3-1 carry a core skill and the panel lists every lesson of that skill: exclude course lessons or list them last); contrast step must show the original position before asking what changes; plain-language explanation first, engine evidence second; stale interface text (Stage 0 vs Stage 1 numbering, "stub" label on opening principles, famous games "eight" vs nineteen, courses both available and planned).
3. **Shorten the road to the first game (roadmap 2e).** Today the 26 lessons of stages S0 and S1 estimate at 5.5 hours and the first complete-games stage ends at 8.2 hours: too long (a guess [H]: about two hours is right). Plan: each rule's first lesson stays in S1, the "busy position" and "can I now" drills (D2/D3) move later as a spiral, offer a "play a game now" invitation after the basic rules. Replace the invented lesson-time constants (`app/src/lib/lessonTime.ts`: 200 words a minute, 0.8 min per exercise, 0.7 per practice question, 2 per contrast trio, 1 per reflection, 0.4 per board; all [I], never measured) with measured medians by recording time per step; do not count optional practice pools at full price.
4. **Map: stages as rings (D42, roadmap 2f).** Rings = the 8 path stages, slices stay the subjects, stage chip row highlights a stage across all slices, "you are here" ring for the current stage, panel and hover card say "Stage 3 · First wins". Hard rules: the whole map is always visible and every node always clickable and selectable; a skill with lessons in several stages sits at its first stage but the move is an illusion: the panel shows its other stages and jumps to any, ghost markers on those rings while it is selected. Also map readability (zoom levels, stronger unstarted nodes, section buttons without horizontal scrolling).
5. **Maia finale games (D41, roadmap 5f).** Opening lessons end with an optional invitation to play Maia from the opening position taught, one game as White and one as Black; the learner picks the Maia level (1100 to 1900); record that it was done plus lesson, colour, level, result, date, and the highest level beaten per lesson (no merit awarded yet, the data is kept for a later decision); quiet mark, never a gate or streak. Builds on `components/PlayOut.tsx`, `lib/maia.ts` and the lesson progress records in `db.ts`.
   Level range: the shipped Maia nets are 1100, 1300, 1500, 1700 and 1900 only; a true beginner will lose to 1100 for a long time. Research Maia-2 first (a newer rating-conditioned model; range, licence and a browser-ready ONNX unverified); else a labelled 'gentle' setting (Maia 1100 plus extra slips, an approximation); before stage S3 the finale uses gentle Stockfish levels from the lesson's position and Maia levels appear later. Record which opponent and level every time.
6. **Real games in the curriculum (D42, roadmap 5g).** At the right stage the curriculum invites full games, then prescribes daily games against a bot (sometimes from positions the lessons covered) and against people when ready; invitations, never gates; the learner's own game data feeds My plan, training and Up next. Open question: games against people without accounts or a server (import of Lichess games afterwards, or a later optional peer feature): decide and log it.

## Then: the depth overhaul (D40, roadmap 5e)

Andrew's review: lessons were shallow (median 11 steps, 140 words of card text, one board), notation paragraphs with no board, the Dragon lesson showed moves but explained little. Standard: `docs/lesson-depth-standard.md` (show it then say it, at most 3 move tokens per card; classes A beginner block, B core skill 30 to 60 steps at least half boards, C opening series of 8 to 10 lessons with `series` field, D culture course, E famous game; teach-it-back). Research: `docs/competition-chess-steps.md`, `docs/competition-chesscom.md`, `docs/citable-views.md` (172 ideas, paraphrased with sources, 8 verbatim quotes under 15 words). Measure with `tools/check_depth.py` and `tools/check_text_notation.py`. At the pause only 4 percent of lessons met the standard. Exemplars done: Sicilian Dragon (9 lessons, series `dragon`), engines and human play (5 lessons), forks, back-rank mate.

Rollout order: the other 17 opening series (including the Maia finale from step 5), famous games and culture courses, the beginner stages against chess.com's path, then the core skill lessons in waves of about 40. Workflow scripts from earlier waves live in the session scratchpad and as copies `tools/workflows-*.js`; the pattern is author, adversarial review, fix, then run the full `tools/check.py`, fix overlaps, register courses, commit, push.

## After the rewrites

- Regenerate the lesson audio once (`tools/make_audio.py`; budget 70 MB; changed text loses its recording; `tools/check_audio.py` reports stale files). Voice: Piper en_US-ljspeech-high (LJ Speech, public domain). Playback with browser-voice fallback is built.
- Update the product page text (`docs/product-page.md`) so "rolling out" items become live statements.

## Standing rules that still apply

Commit and push only to Wizard1999/LearnChessFree, never rewrite history, run `tools/check.py` first; no learner-facing claim without a check; original wording; evidence labels [V][S][R][I][H]; "Created by Andrew Valentine" stays; AI is allowed if it stays free and equally available, no accounts, no special hardware (D39); no live AI in the learner's loop until he lifts rule 7. Run `./tools/.venv/Scripts/python.exe -I tools/update_roadmap.py` after ticking roadmap items; start and end each session with a roadmap update and a push.

## Open items needing Andrew or people

Human review of the lessons (G3); baseline measurement (G1) and testing with real beginners; a lawyer's look at LICENSES.md (G18); purging withdrawn books from git history (G19); `desktop/Scholarmate.exe` (renamed from ChessSchool.exe) not rebuilt; a stray `git stash` entry in the repository (drop it with `git stash drop`).
