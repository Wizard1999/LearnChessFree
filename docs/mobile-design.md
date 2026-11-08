# Mobile design (phase 2k, decision D49)

The phone is designed on its own, not squeezed from the desktop. Phone = width up to 640 px; touch rules also apply on coarse pointers up to 900 px. Desktop is unchanged: every phone rule lives in a `@media (max-width: 640px)` (or `(pointer: coarse) and (max-width: 900px)`) block, or in a component that renders only on phones (`lib/usePhone.ts`). The old Friendly look stays the default; colours come from tokens.

Status labels: [I] these are design decisions; nothing here has been tested on a real phone yet (only Chrome's mobile emulation at 375x812).

## Principles
1. **Thumb first.** Navigation and the main action live at the bottom; the top holds identity (brand and the permanent credit line, CLAUDE.md rule 9) and Settings.
2. **Board first.** On any page with a board, the board is the first thing and stays in view; text and questions sit under it.
3. **One sheet at a time.** Detail (hints, how it was checked, the control map key, map filters, the selected skill, More) opens as a bottom sheet over the lower part of the screen, closed by a button, a tap on the backdrop or Escape.
4. **Targets 44 px**, safe areas respected (`viewport-fit=cover`, `env(safe-area-inset-*)`), heights in `dvh`, no hover-only information.
5. **Focus mode.** Inside a lesson the tab bar steps aside so the board and the action bar have the screen; the header (brand link to Today) and the breadcrumb lead out.

## Navigation
```
+-------------------------------------+
| [crest] Scholarmate      [Settings] |  header: brand, byline, Settings (not sticky)
| Created by Andrew Valentine         |
+-------------------------------------+
|                                     |
|            page content             |
|                                     |
+-------------------------------------+
| Today  Curric.  Practice  Progr. More|  tab bar, fixed, 56 px + home-bar inset
+-------------------------------------+
More -> bottom sheet: My games, Openings, Analysis, Contrast lab, My plan, Play, Library, Roadmap
```

## Map
```
+-------------------------------------+
| header (brand, byline, Settings)    |
+-------------------------------------+
| [Lessons|Courses|Map]    [Filters]  |  thin top bar (segmented control)
+-------------------------------------+
|                                (+)  |
|        full-bleed radial map   (-)  |  floating round buttons at the right edge:
|                                [ ]  |  zoom in, zoom out, fit all,
|                                (o)  |  where I am, back, search
|                                (<)  |
|                                (?)  |
+-------------------------------------+
| tab bar                             |
+-------------------------------------+
Filters sheet: sections, stages, Progress, Mastery challenge, skill list, legend, how the map fills in.
Selected skill: a bottom sheet (the existing right dock) with its own close button; the map stays visible above.
Acceptance: map >= 70 % of the 812 px height with the sheets closed.
```

## Lesson
```
+-------------------------------------+
| header                              |
| Curriculum > skill > D1   [Options] |  options fold: skip, mark finished, start over, all lessons
| Title (smaller)                     |
| Chapter 2 of 8: ...  ============---|  slim step bar
+-------------------------------------+
|                                     |
|             board (sticky)          |  stays in view while the text scrolls
|                                     |
+-------------------------------------+
| caption / text                      |
+-------------------------------------+
|        [        Continue        ]   |  bottom action bar, 48 px, sticky
+-------------------------------------+
```

## Exercise
```
+-------------------------------------+
|             board (sticky)          |
+-------------------------------------+
| Prompt: White to move. Find ...     |
| Or type the move [____] [Play it]   |
+-------------------------------------+
| [Hint 0/2] [Reset] [Show answer]    |  action bar while answering
+-------------------------------------+
After answering: result text, then [Next] in the action bar; "How this was checked" opens a sheet.
Hints open a sheet (board stays visible above). The control map key opens as a sheet while the map is on.
```

## Practice
```
+-------------------------------------+
| Practice                            |
| [ Start 8 mixed positions ]         |  big primary button
| Choose what to practice instead  v  |
+-------------------------------------+
In a set: the exercise layout above, with the tab bar still shown under the action bar.
```

## Play
```
+-------------------------------------+
| setup card: opponent, level, colour |  (sheet planned; today a single-column card)
| [ Start game ]                      |
+-------------------------------------+
In a game: full-width board, then [Hint] [Resign] [New game] in the action bar.
```

## Today
```
+-------------------------------------+
| Today                               |
| +---------------------------------+ |
| | UP NEXT . about 6 min           | |  one primary card, full-width button
| | Quick return                    | |
| | [            Start            ] | |
| +---------------------------------+ |
| Stage 1 of 8 ...                    |
| [map preview]  Where you are        |  folded detail below
+-------------------------------------+
```

## Progress
```
+-------------------------------------+
| Progress                            |
| one column of cards; wide tables    |
| scroll inside their own box, never  |
| the page                            |
+-------------------------------------+
```

## Not in this pass
Tablets and landscape (two columns from about 700 px), install and offline, the play setup as a sheet, and a real-phone test (Andrew's step).
