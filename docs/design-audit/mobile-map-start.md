# Audit: phone pass for Start, Today, Curriculum list and map (30 Oct 2026)

Method: built-in browser emulating 390x844. First visit with cleared localStorage, then `/` (Start / first-visit Today), `/course?view=lessons`, `/course?view=map`, and Today after finishing three lessons. A script listed controls under 40 px tall, elements wider than the viewport and text under 12 px. [V] for measured values; contrast judged by eye only [I].

## Before
| Page | Findings |
|---|---|
| Start (first visit) | Header links 34 px tall, brand link 31 px, "Created by" line 11.5 px; "Find your starting level" and "see the whole course" 21 px inline links in a sentence. |
| Today | "Find your starting point" 21 px. `/today` showed "Not found" (Today lives at `/`). |
| Map | The toolbar wrapped into four rows plus a three-line explanation, about 240 px, so the map began halfway down the screen. The long explanatory paragraph above it added more. The bottom sheet (46 vh) covered the lower half of the toolbar, and the map itself was mostly under the sheet. The skill list opened at a fixed offset over the toolbar and under the sheet. The minimap was hidden under 700 px. The map ran past the bottom of the screen. |
| Lesson list | Fine on its own, but a picked skill's sheet carried its small controls (links 21-24 px, "why?" 18 px) and covered the end of the list. |

## Changed
- **Header on phones:** nav links, More summary and its items, the brand link and Settings are at least 40 px; the byline is 12.5 px (the credit line is unchanged).
- **Start / Today:** the two secondary links are stacked 40 px rows ("Already play?", "Find your starting level (about 15 minutes, optional)", "See the whole course"). `/today` now redirects to `/`.
- **Map toolbar:** search takes a full row, the buttons sit in two compact rows with 44 px zoom buttons, the long hint is hidden under 700 px (the "How the map fills in" fold above it keeps the explanation, now closed by default at every width). The map starts higher and its height is sized to the screen so the map and its minimap fit without scrolling.
- **Minimap:** shown on phones, 5.5 rem, in the bottom-right corner of the map (the Progress tab keeps the bottom-left).
- **Bottom sheet:** 36 vh (at most 20 rem), rounded top, a sticky 44 px Close button; the page keeps room under it. When a skill is picked on a phone the page scrolls so the toolbar and map sit above the sheet, and the picked skill is moved into the visible part of the map (`sheetOffset` in `lib/mapSheet.ts`, tested). The same height applies to the Progress sheet. Small controls inside the sheet (links, "why?", summaries) are at least 40 px; the list page leaves room for an open sheet.
- **Skill list:** opens directly under the toolbar (wrapper `mapbarwrap`) instead of at a fixed offset, never runs under the sheet (`listMaxHeight`, tested), has a "Close list" button, marks the picked skill (highlight, `aria-current`, scrolled into view when the list opens or the pick changes), and shows each skill's state (not started, started, lesson finished, mastered) as a mark and in its accessible name.

## Left as is
- The floating "Progress" tab still floats over list content while scrolling (existing pattern, noted in the earlier audit); the list leaves room at its end.
- Pinch zoom on the map is not implemented; the + and - buttons work. [H] Two-finger gestures would help; not measured with real touch.
- Only the emulated viewport was tested, not a physical phone, and the dark theme was not re-checked.
