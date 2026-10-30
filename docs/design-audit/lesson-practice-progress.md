# Audit: lesson player, Practice, Progress, lesson list (30 Oct 2026)

Method: built-in browser at 1440x900 and at the mobile preset (375 px wide), pages `/lesson/L-FND-BOARD-1`, `/practice`, `/progress`, `/course?view=lessons`. A script listed controls under 40 px tall, controls with no name, elements wider than the viewport, and word counts. [V] for what was measured; contrast was judged by eye only, not measured [I].

## What I looked at (before)
| Page | Findings |
|---|---|
| Lesson | Skip / Mark finished / Reset links 24 px tall; breadcrumb 21 px; "Connected lessons" links 21 px; "Reset" did not say it deletes progress; "All lessons" went to the old route; "Show control map" 34 px. Board and steps fine, no overlap, no sideways scroll. |
| Practice | 24 words above the button (good). The "Choose what to practise" list showed raw ids (`ATK.CASTLED.D1`, `theme.back-rank`) and the word "Strand"; summary 27 px; checkbox 13 px; button said "Start mixed practice" without saying how many. |
| Progress | A long lede before any data; the first sentence printed dashes ("used hints on — of ... right — of the time"); jargon "unlabeled" unexplained; on a phone the three tables made the page scroll sideways. |
| Lesson list | Two paragraphs (about 90 words) between the heading and the first lesson; Mark finished / Skip / Reset 27 px and identical for every row for screen readers; filter chips 37 px; on a phone the floating "Progress" tab covered the end of the list. |

## What I changed
- **Copy:** Practice button now reads "Start 8 mixed positions" (the chosen count); Practice lede shortened; "Strand" became "Area of chess"; Progress lede cut to one sentence; one plain hints sentence that never prints a dash (`lib/labels.ts`, tested); "unlabeled" explained once; "Reset" became "Start this lesson over"; the lesson-list explanation went into a "How this list works" fold, leaving one sentence ("Nothing is locked...").
- **Readable names:** Practice dropdowns show skill titles with a level and tidied tags instead of raw ids (`skillLabel`, `tidyLabel`).
- **Screen readers:** each Mark finished / Skip / Reset in the lesson list and course view now names its lesson (`aria-label`).
- **Layout and size (CSS block at the end of `index.css`):** text controls on lesson pages, the list and Practice are at least 40 px tall (scoped to `main.page` so the map and Analysis do not shift); filter chips, summaries, selects, breadcrumb, connected-lesson links and the control-map toggle meet 40 px; larger checkbox; visible focus ring on links; tables sit in their own scroll box so the page never scrolls sideways; the weekly table is folded under "Week by week"; room is left at the bottom of the list on phones so the floating Progress tab does not cover the last rows.

## Left as is (and why)
- The floating "Progress" tab on phones still floats over content while scrolling; it is the existing bottom-sheet pattern. Proper fix is part of the Curriculum pass (item 3 of the order of work).
- Inline links inside sentences ("My games") stay under 40 px: running-text links are exempt from the target-size rule.
- The Progress page still has five cards; a beginner view (one sentence plus "see details") is a bigger design decision for Andrew.
- Contrast was not measured with a tool; the audit found nothing obviously low.
- `crosscheck.test.ts` fails on `L-FG-BOTVINNIK-CAPABLANCA-1` (a new content lesson no course lists). That is a content change by another agent, not this pass.
