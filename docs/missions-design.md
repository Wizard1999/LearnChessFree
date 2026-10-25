# Missions: progress tracking inspired by Khan Academy's "World of Math"

Andrew asked for lesson progress tracking like the old Khan Academy mission dashboards (the "World of Math"): a donut of mission progress, a level for every skill, small blocks that darken as you advance, a "skills up next" list and the Mastery Challenge. This note records what the system was, what people said about it, what I could and could not see, and how it maps onto this project's evidence model. Evidence labels: **[V]** read or seen here, **[S]** secondary, **[I]** my inference.

## What I could and could not see

- Andrew's screenshot of the "1st grade" mission [V]: left panel with a mission-progress donut (12%), a legend of five levels (skills mastered, level two, level one, practiced, not started) with counts, per-section rows of small blocks (Place value, Addition and subtraction, Measurement and data, Geometry), "Hide skill breakdown", upcoming badges, recently finished; right panel "Skills up next for you" with a **Mastery Challenge** card ("Strengthen skills you've already practiced") and a list of skills with Practice buttons and a Remove link.
- Reddit blocks my browser tool, so I could not open the post itself. The Wayback Machine had no capture of the mission app pages (they were client-rendered app screens) and its index service was offline when I tried. So I did not see an archived live dashboard. I read Khan Academy's own support community and help centre and the fan wiki instead [V]; sources below.

## What it was [V unless marked]

- Missions (introduced around 2013, retired June 2020) were per-grade or per-course dashboards. The "World of Math" was the largest: about 1,500 skills laid out in one place, grouped into missions from early math to calculus, each mission split into sections of skills.
- Five skill levels: not started, practiced, level one, level two, mastered. Blocks were shaded from light to dark blue by level. The mission percentage was the share of the whole.
- **Mastery Challenge**: available every 16 hours when practiced skills existed; it could raise a skill by one level, lower it by one, or leave it, and it also tested skills already marked mastered, to check they were still known. **Booster Challenge**: practice with no penalty. **Mission Warm-Up**: once per mission, a no-penalty test of what you might already know, so you could test out.
- A recommendation stream ("skills up next") picked skills based on what you had done and what you still needed; you could add skills by clicking blocks and **remove** any suggestion.
- Points, badges ("Geek of the week: mastery" for five Mastery Challenges in a week) and an end-of-mission celebration screen.
- Staff's reasons for removal (June 2020): the old code base was hard to maintain; teachers could not assign missions and track them; it was unclear to teachers how mastery was evaluated; missions were not integrated with the course library; they covered only math and some computing. The successor, Course Mastery, has levels Attempted, Familiar, Proficient, Mastered; 100 points per skill (50 at Familiar, 80 at Proficient); and a new Mastery Challenge of **6 questions across 3 skills, 2 per skill**: both right moves a skill up, both wrong moves it down, one each keeps it; it unlocks after Familiar on 3 skills, Proficient on 1, and 12 hours since the last one, and chooses skills by time since last review and level (spaced review).

## What people said [S: user posts, not studies]

Praised: seeing the whole of math on one screen and watching it darken ("the biggest draw"); a tech-tree feel where prerequisites were visible; mastery in small sets so one slip did not erase progress, compared with unit tests of nine or more questions that needed perfection; recommendations that "felt correct"; test-out through the warm-up and challenges; a less formal feel than quizzes and unit tests.
Criticised or complicated: students found a challenge covering a whole grade overwhelming (one teacher); in the 2018 successor beta people disliked losing progress after an error on a test, missing progress counters, and being prompted for points; staff said the rules for reaching mastery were opaque to teachers. Several users asked for it back after removal; staff said a replacement is on a wish list.

## Our version

| Khan Academy idea | Here | Why |
|---|---|---|
| Mission per course | A **mission per strand** (S1 to S11); large strands split by tier band | We already have 11 strands and 194 nodes |
| Block per skill | One block per **skill node**; shading by level; a corner mark when its lesson has been finished | Shows both "viewed" and "level" as asked |
| Five levels | Not started, **Seen** (lesson or any practice), **Level one** (the named-idea depth D1 reliable), **Level two** (unlabelled depth D2 reliable), **Mastered** (the deepest depth with exercises reliable and not due for a refresher) | Levels come from the same evidence as the rest of the app: first attempts, cue weights, "reliable" needs unlabelled evidence. No separate counters to drift |
| Mission % | Average level across the mission's nodes | Same idea, transparent arithmetic shown on the page |
| Mastery Challenge | **6 questions, 3 skills, 2 each**, unlabelled and fresh, picked by staleness and level, including mastered skills; unlocks after 3 skills practised and 12 hours; results are recorded as ordinary first attempts (source "challenge") and the level is recomputed from evidence; the page says what moved and why | Keeps what people valued (small, spaced, can raise or lower, checks retention) and makes the rule readable, which staff said was the weakness |
| Mission Warm-Up | The existing placement, runnable per strand later; Skip stays | Test out without penalty |
| Booster | Ordinary Practice (never penalised) | Already exists |
| "Skills up next" with Remove | Same, from prerequisites met and lowest level first; Remove hides a suggestion on this device | Learner control; small |
| Points, energy points, badges, streaks | **Not now** | The doctrine (`docs/design-direction.md`) asks for no shame mechanics; points need a justification we do not have yet |

A level can go down only through new evidence (a missed unlabelled item, a challenge) or time (a refresher becomes due). The page states that rule in plain words.

## Sources read (all accessed 25 October 2026)
- Khan Academy Help Center community: [World of Math: how can we replace or recreate it?](https://support.khanacademy.org/hc/en-us/community/posts/360078571572) (official reply from support plus users' accounts)
- [Why did you remove Missions?](https://support.khanacademy.org/hc/en-us/community/posts/360070675772) (staff list of reasons; a user's description of the five levels and the challenge)
- [Update (May 2018): New Unit Mastery](https://support.khanacademy.org/hc/en-us/community/posts/115001845151) (point values, levels, comments)
- [What are Mastery Challenges in course mastery?](https://support.khanacademy.org/hc/en-us/articles/360037127892) (the 6-question, 3-skill rule)
- Khan Academy fan wiki (community content, CC-BY-SA): [The World of Math](https://khanacademy.fandom.com/wiki/The_World_of_Math), [Mastery and Booster Challenge](https://khanacademy.fandom.com/wiki/Mastery_and_Booster_Challenge), [Math Pretest](https://khanacademy.fandom.com/wiki/Math_Pretest)
