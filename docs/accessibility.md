# Accessibility notes (roadmap 2h)

Frame: WCAG 2.2 as a checklist, not a claim. **This app is not certified or declared compliant.** No real screen reader (NVDA, JAWS, VoiceOver, TalkBack) was run; one is still needed.

## What was tested [V = verified here]
- Built-in browser, 1440x900 desktop and the 375x812 mobile preset, on the dev server. Routes: Today, Curriculum (list and Map), Practice, Play, Settings, a lesson (L-FND-BOARD-1), Progress, Openings, Analysis.
- Scripted probes on each route: horizontal overflow, interactive elements under 24 px, controls with no accessible name, live regions present. [V]
- Map: 206 nodes, all keyboard-focusable, each with a text label that includes its status ("Not started", "Seen", ...) so colour is not the only cue. Node outline contrast against the dark page 15:1, stage names 7.8:1. [V, dark theme only]
- Ring text on the map: the words run round each stage boundary and read upright on both halves (glyph rotation at the middle of the top and bottom arcs is about 0 degrees). No dotted ring lines are drawn; the only dashed shape left on the map is the "next skill" marker. [V]
- Automated (vitest, `src/a11y.test.tsx`): skip link, header, labelled nav, one `main`, footer, the credit line, names on every shell control, and that the answer, play-out, board, saving-notice, lesson and settings code each keep a live region. Hand-written assertions, no axe dependency.

## Fixed in this pass
- Board file letters were shifted 24 px right of the board (wrong file under each letter) and pushed lessons and Analysis 12 px wider than a phone. Fixed in CSS.
- Openings grid forced the page 9 px wider than a phone at 375 px. Fixed.
- Move buttons in the Openings tree were 19-23 px wide; now at least 28 px. Checkboxes and radios are 20 px with a 32 px label target.
- Visible focus ring on links, buttons, summaries; `scroll-padding` so focus is not hidden under the sticky header.
- Reduced motion: one global rule for the device setting and for Settings > Motion > Reduce.
- Read-aloud now says which voice is speaking (see below).

## Read-aloud safety [V by test]
Recordings are looked up by a SHA-1 of the exact text chunk being displayed, computed in the browser at play time. A rewritten lesson therefore changes the hash and finds no recording; it can never play old audio over new words. If any chunk of a text lacks a recording the whole text uses the browser voice (never a mix). Tests in `audioIndex.test.ts` cover a one-character edit, a trailing space and one changed chunk among several. When the browser voice is used the lesson bar and Settings show "your browser's built-in voice, not the recorded one" in a status region.

## Does not pass or not checked
- Light theme contrast of map nodes and labels: not measured (dark only). [not checked]
- 200 percent text: Settings text size "Larger" and 375 px width showed no horizontal scroll on the routes above, but browser-level 200 percent zoom was not emulated separately, and the Text size setting was not confirmed to have applied during the probe. Recheck by hand.
- Full keyboard journeys (first visit to first board move, answer and continue, Practice set, a promotion, the voice settings) were not driven end to end with the keyboard only. Source and probes show names, focusability and live regions; actual announcement order is unverified.
- Board play by keyboard: the board has a keyboard grid (`.kbdgrid`), not exercised here.
- Remaining small targets: inline text links inside sentences (allowed by the 2.2 inline exception).
- Contrast of the remaining pages, colour-blind simulation, and zoom reflow on the Analysis page: not checked.
- Content-file test `contentFiles.test.ts` failed twice during this run because of in-flight content edits by another agent; unrelated to these changes.

## What a screen-reader session still needs
NVDA + Firefox/Chrome and VoiceOver + Safari (iOS) through: Start, first lesson, an exercise (is the right/wrong result announced once, before the focus moves?), the Map (does a node read its name, stage and status?), Play (move and promotion announcements), Settings. Record order of announcements, focus loss after route changes, and anything read twice.
