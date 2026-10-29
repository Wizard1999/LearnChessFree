# The simplicity pass: beginner-first, easy on the eyes, still the whole scope

Written 29 October 2026 from Andrew's request: take a hard look at the whole site, make it super beginner friendly and intuitive, easy on the eyes yet engaging, without over-designing and without losing the complexity the scope needs.

## The rule that stops over-design: a complexity budget
Every screen gets a budget, and a new element must replace one or earn its place.
1. **One job per screen.** A screen answers one question ("what do I do next?", "where am I in the whole?", "how is this skill going?"). Anything else is a link, a drawer or a tab.
2. **Three levels of depth, always the same.** Level 1: the thing to do (one primary button). Level 2: the context (progress, why, what is next), visible but quiet. Level 3: the machinery (maps, evidence, engine, settings), one click away and never in the way of levels 1 and 2.
3. **No overlap, no shifting.** Content never covers content; the centre never resizes when a panel opens (decided today, now a rule).
4. **Words over widgets.** If a sentence does the job, no new control.
5. **Progressive disclosure by evidence:** features appear as the learner meets the need (the map after the first lessons, the analysis board after the first games), not all on day one. Today and the first lessons stay as bare as the Start screen.

## What we keep (the complexity the scope needs)
The curriculum map, evidence-based progress, unlabelled testing, the Analysis board, the library, courses, the lab. They live under Level 3, with names a beginner can guess.

## The audit (a checklist, run once per page; findings go in this file)
- **First five minutes:** a new learner on a phone and a laptop reaches a first move and a first correct answer with no explanation. Count the clicks and the words.
- **Navigation:** four main places (Today, Curriculum, Practice, Progress) plus More. Rename anything a beginner must decode ("Contrast lab", "Course" vs "Curriculum"); one word per idea across the site.
- **Reading load:** words per screen, jargon on first use, line length and size (aim 60 to 75 characters per line, 16 px or more), contrast (WCAG AA minimum).
- **Visual calm:** one accent colour for the one primary action per screen; colour roles used the same everywhere; no more than two type sizes in body content; generous spacing; icons only with labels.
- **Engagement without noise:** small, honest progress cues (the fill and the glow on the map, the next-skill card); no points, streaks or badges for their own sake (decision D21).
- **Accessibility:** keyboard route everywhere, focus visible and consistent, screen-reader names, reduced motion respected.
- **Mobile:** every page usable at 375 px with the bottom-sheet pattern, no sideways scroll.

## How we avoid getting lost
- **Test with people, not opinions:** five beginners and five club players, ten minutes each, think aloud (gate G11). Fix only what two or more stumble on.
- **Before and after screenshots** of each page, kept in `docs/design-audit/`, with the click and word counts.
- **A freeze rule:** one design pass at a time, two days at most; anything not fixing an audit finding waits.
- **Andrew decides taste; the audit decides usability.** A change that makes the first five minutes slower is rejected however nice it looks.

## Order of work
1. Today and the Start screen (the first five minutes).
2. Lesson player and exercise screens (where learners spend their time).
3. Curriculum (list first, then the map, then the docks).
4. Practice and Progress.
5. Analysis, Library, Games, Lab (Level 3 tools): consistency and naming only.
6. A names and words sweep, then the screenshots and the beginner test.
