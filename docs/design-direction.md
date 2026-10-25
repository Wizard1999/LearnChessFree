# Design direction: my response to the Design Doctrine

Source brief: `docs/design-doctrine-v1.md` (Andrew's doctrine, v1.0, 25 October 2026). This file says what I adopt, what I change and why, and the order of work. Evidence labels: **[V]** checked here, **[I]** my judgement, **[H]** hypothesis to test.

## Verdict

Adopt it as the visual and interaction foundation. It is unusually well aimed: it puts the board first, treats help and mistakes as normal, separates *completing* from *understanding*, and refuses to claim more than it can show. Several of its rules describe things this project already does for evidence reasons (the first-attempt ledger, the hint ladder, "also sound" for an equally good move, honest "not yet reviewed" badges). Design and evidence model point the same way.

[V] I recomputed the contrast ratios for its tokens: 13.34 (text on canvas), 5.87 (secondary text), 6.53 (white on accent), 7.84 (dark-theme accent), all reproduced to two decimals. Also: accent text on canvas 5.78, control boundary 3.53 against canvas and 3.92 against surface (passes the 3:1 requirement for controls), success/warning/error on surface 6.2 to 7.3. The palette is sound as specified. Piece and square pairs still need testing with the real piece set (white fill on light squares is only 1.35:1, so white pieces depend on their outline).

## Adopt as written

- The governing sentence, the ten ordered principles, and the rule that board clarity beats atmosphere.
- Palette, typography (Source Serif 4, Source Sans 3, IBM Plex Mono; all SIL Open Font License, self-hosted and subset), spacing scale, radii, motion timings, voice table, empty and error state copy.
- The feedback model and hint ladder. Our "also sound" recognition is its "strong alternative" row. Rule 6 maps one-to-one onto our mastery states: started, completed, with help, independent evidence, review due.
- Release blockers: accessibility failures, incorrect chess, lost work and misleading claims block a release whatever the average score.
- Evocative title plus literal title for lessons (search and navigation keep the literal one).

## Change, and why

1. **No accounts.** The app is local-first. Screen B's account flow and section 13's account paths shrink to: guest only, progress saved on this device, export/import as the way to move between devices, optional sync later. No sign-in component is built. This makes "free access is tangible" trivially true.
2. **Navigation has more to show than five words.** The doctrine's Home/Learn/Practice/Review/Library would bury what makes this product different (own-plan experiments, the contrast lab, game review, the openings tree). Proposed primary navigation: **Home**, **Learn**, **Practice** (practice sets, review queue, contrast lab, my plan), **Games** (my games, play the engine, labelled as the engine), **Explore** (openings, sources and method). Settings, help and the roadmap live in a utility menu. Five items, plain words.
3. **Home has one job.** Today currently stacks welcome, aim, plan blocks and evidence. Adopt Screen C: one prominent *Continue* with the exact lesson title, a *Review* action with its reason, one optional challenge. The "your own aim for today" step stays, because teaching self-direction is the point of the project, but becomes one quiet inline question rather than a card that competes with Continue [I].
4. **Default board is the warm neutral, not the sage green.** The doctrine says it avoids the green familiar from other sites, then proposes sage (#7C8A78) dark squares. I would make the warm board (light #E4D9C4, dark #95836B) the default, matching ivory and vermilion, and keep sage as a preset. Light/dark square contrast is 2.62:1 (warm) vs 2.69:1 (sage), similar. Last-move, selection and check colours need testing on both [H].
5. **The lesson workspace is the biggest layout change.** Today every page is a single column about 700 px wide with the board above the text. Adopt Screen E: from about 960 px the board and teaching panel sit side by side; below that they stack with the task kept near the board. Lessons with contrast steps (two boards) and play-outs need explicit layouts.
6. **The landing hero must be a real, verified exercise.** Use a curated item from the shipped bank in the real player, with a visible Skip. A route for people who do not know the rules sits beside it ("I am new to chess" opens the first lesson).
7. **Show the cue ladder, which the doctrine does not know about.** The product's central distinction (named idea vs unlabelled position vs silent) needs visible, non-patronising language: a small mode label on every exercise ("Guided", "Unlabelled", "Silent"), the confidence chips, and an evidence chip in the feedback ("solved without help"). I will design these as components alongside the doctrine's list.
8. **Competition is out of scope for now.** No leaderboards, events or comparisons until there are learners. Personal bests could come later and stay private.
9. **Library becomes two things.** "Sources and method" (what we are built from and how things are checked; exists as the Library page) now; an annotated-games library (the Opera Game, guess-the-move games) when the content exists.
10. **Routes stay readable but hashed** (`#/learn/tactics/pins`). The static host has no server rewrites, so history-style URLs would break deep links.
11. **Round-one to round-three validation needs people.** I cannot recruit. Substitute, clearly labelled as *not* user testing: automated checks (axe, contrast scripts, keyboard walk-through) and an expert heuristic review against the rubric in section 17. The real rounds are a gate (G11).

## Things I would add

- A **keyboard-operable board** (roving focus, arrow keys, Enter to select and move, Escape to cancel, live-region summary). Chessground has none; typed move entry exists but is not the same. Required by the doctrine and by WCAG.
- `prefers-reduced-motion` support (turn off piece animation and transitions), a text-size setting, and a high-contrast board preset.
- A **notebook**: save a position with a note from any result (doctrine Screen G). We store reflections but not positions.
- Piece set licence record: Chessground ships the cburnett set, usable under its licence; record attribution on the Sources page.

## Order of work

1. **Tokens and look** (CSS only, no restructure): palette tokens in light and dark, self-hosted fonts, board and piece theme, focus rings, reduced motion. Biggest visible change for the least risk.
2. **Workspace layout** for lessons and practice (two columns, task panel, toolbar).
3. **Home, first visit and navigation** (Screens A to C, the new five items).
4. **Course page as a chapter list** with evocative plus literal titles (Screen D).
5. **Accessibility build**: keyboard board, live regions, skip link, target sizes, text-size setting, audit.
6. **Copy audit** against the voice table across app strings and lesson cards.
7. **Identity study**: three comparable treatments of one position (warm editorial, darker tournament, restrained club) for Andrew to choose from; wordmark exploration (needs the name, Q4).
8. **Validation rounds** with real people (gate G11).

Everything in 1 to 6 can proceed now; 7 and 8 need Andrew.
