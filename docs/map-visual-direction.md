# Map and path: visual direction (Andrew, 8 Nov 2026; draft 1)

Trigger: Andrew likes chess.com's Learn path tile design (raised tiles with one icon each on a zigzag, a lit "Next" tile, dimmed locked tiles, graduation-cap checkpoints, a section title between levels, chess pieces as scenery) and wants the Scholarmate map to look better and feel like pathways unlocking as prerequisites are completed, while keeping the direction of our radial map. Evidence labels: [V] seen in his screenshots and our code, [I] inference, [H] hypothesis. Nothing here is built.

## 0. Fewer views, clearer homes (Andrew, 8 Nov 2026; decisions D60 and D61)
Today the app opens on Today and the Curriculum page holds three views (All lessons, Courses, the radial Map); the Path would make four. Andrew's aims: it must feel like the core curriculum without saying so at length; courses are extras, though they also teach; **people open straight onto the core curriculum and blast off with no friction**; Today is itself an extra.

**Decisions**
1. **The app opens on the Curriculum.** "Curriculum" (the existing name) is the core: stages S0 to S7, the recommended route. It is the home page. The college-catalogue pair is **Curriculum and Electives**: everyone knows the first is what you must do and the second is what you may add, and it fits the collegiate look. (Alternatives considered: "Learn" is vague; "Core" alone reads oddly; "Courses" does not separate core from extras.) The name of the extras place is **Electives**; the word "optional" is built in.
2. **Two views inside Curriculum:** **Path** (default, what next) and **Map** (the explorer, "how it fits"). Same selected skill and progress. "All lessons" becomes search and filter, not a view.
3. **Today is folded into the Path's top.** A **Continue** strip sits above the path: the next lesson (title, minutes, one big button), then at most two small chips for the rest of the old plan: "Review 6 items (4 min)" and "Play a game" (shown when it applies). First visit: the Start button opens the guided first game (D56) and then lands here. The "Next" tile on the path and the Continue button are the same target, so there are never two competing calls to action. Today's other parts move: "Set your own aim" and "What the evidence says" go to Progress; "How this school works" goes to the first-visit card and Settings > About; the planned blocks live in My plan (More).
4. **Electives** (extras only): opening deep dives, famous games, history, playstyles and later courses with art covers. A line at the top says nothing here is required. The Continue strip may invite one elective at a time after the learner finishes a stage, never a list.
5. **The Path never shows electives or lessons outside the route.** The Map keeps the whole core graph (206 skills) because it is the explorer.
6. **Progress and Practice stop being pages (Andrew, 8 Nov 2026; D62).** People should use the progress view built into the Curriculum window, and practice belongs inside the Mastery challenge.
   - **Progress** lives in Curriculum's left panel (the "Whole curriculum" ring, the mastered / level-two / level-one / seen counts and the per-strand squares), visible on both Path and Map, and a **Full report** section opens from it for what the old Progress page held: your path by stage, hints and independence, week by week, confidence against results, evidence per skill, your mistake diagnoses, your notes, badges and the certificates. Export and import move to Settings. The old address `#/progress` stays as a deep link that opens the report, so no link breaks.
   - **Practice** lives in the Mastery challenge. The challenge is the single doorway to training: the system chooses (spaced review of what is due, then a mixed unlabelled set of what you have learned), and "Choose what to practise" inside it covers a skill, a theme or a drill. A skill's own panel keeps "Practise this skill". The Continue strip's review chip opens the same challenge. `#/practice` and `#/drill` stay as deep links.
   - The Progress panel is busy today (206 small squares); on the Path it shrinks to a one-line summary (ring plus "next: ..."), with the detail one tap away. [I]
7. **One bar at the top, one row of chips on the page (Andrew, 8 Nov 2026, with a marked-up screenshot; D64 refines D63).**
   - **Top bar:** the masthead on the left ("Created by Andrew Valentine", rule 9); on the far right a single **More** button. No tab row, on desktop or phone, and no bottom tab bar. **More** holds Play, Review (games review, analysis, openings explorer), Library, Contrast lab, My plan, Roadmap and **Settings** (D65: Settings moved inside More to save space).
   - **One row of chips under it, on the Curriculum page (the home):** **Curriculum** (the default; the old "All lessons" slot, opening in the Path view with search and filter) · **Electives** (was "Courses") · **Map** | **Progress** · **Mastery challenge**. The first three switch what the page shows; the last two open the side windows as they do today. There are no longer two sets of buttons stacked at the top.
   - **Folded in:** Today becomes the Continue strip at the top of the Curriculum view (item 3); the Practice page becomes the Mastery challenge (item 6); the Progress page becomes the Progress window with its Full report (item 6).
   - Other pages (Play, Review and so on) show "Back to Curriculum" at the top left beside the masthead. The Curriculum remembers where you were.
   - Everything else is reached in context: the Continue chips (Review due, Play a game), a skill's panel, "Review this game" after a game, the stage-end invitation to an elective.
   - Risk: Play and Review sit one tap deeper, inside More [H]. If they go unused after release, promote one to a visible link.
8. **Friction budget [H]:** from opening the app to the first move should be one tap for a returning learner (Continue) and one tap for a new one (Start). Count taps in the route smoke test.

## 0b. The workspace: split your screen into panes (Andrew, 8 Nov 2026; D65)
Wide screens can show more than one thing at once, arranged however the learner likes: for example Path on the left, Progress in the centre and Map on the right; or Mastery challenge left, Map centre, the core-curriculum list right.

**Model [I]**
- A **pane** holds one **panel**. Panel types: **Path**, **Map**, **Curriculum list** (the searchable list of core lessons; the old All lessons content), **Progress** (with its Full report), **Mastery challenge**, **Skill** (the selected skill's detail, as the right dock is now), **Electives**. The lesson player is a full page, not a pane.
- **1 to 3 panes** on desktop, in a row. Presets in a "Layout" menu: one pane; two halves; thirds; two-thirds and one-third (either way). Dividers drag to resize and snap to preset widths. Minimum widths protect each panel: Map about 520 px, Path about 360 px, Mastery challenge about 480 px (it holds a board), Progress about 360 px, list about 320 px. The app only offers a layout the screen can hold at those widths, so 3 panes need roughly 1,300 px or more; below that it offers 2, and below about 900 px one. [I]
- **Opening a panel:** the chips on the Curriculum page (Curriculum, Electives, Map, Progress, Mastery challenge) are toggles. A click puts the panel in the next free pane (or replaces the focused one if all are full). **Drag a chip into a pane** to place it exactly. Keyboard and screen-reader alternative to dragging: each pane has a "Show here" menu listing the panels.
- **Linked selection:** one selected skill across all panes. Clicking a node on the Map highlights it in the Path and the list and fills the Skill panel; filters (strand, stage) can be linked or per pane (default linked, one switch). The Mastery challenge can follow the selection ("practise the selected skill") or run on its own.
- **Remembered:** the layout and each pane's panel are saved on the device, per screen size class; a "Reset layout" button restores the default (Path alone, with the Continue strip).
- **Phone and tablet:** always one pane; the chip row switches panels, with a swipe between neighbours. Split panes are a desktop feature only; nothing about the core path needs them [I].
- **Accessibility:** every pane is a labelled landmark, focus order is left to right, "Show here" menus replace drag, Escape closes a pane, panes never trap focus, reduced motion turns resizing animations off, and the contrast gates apply to every panel.
- **Relationship to what exists:** the map page already has a left dock (progress, challenge) and a right dock (selected skill) with fixed widths; this generalises them into a pane layout (`Course.tsx` holds the window state today, `wins`). Nothing is lost: the current layout becomes the preset "Map with docks".

**Motion and feel: panes are sheets of digital paper, nothing snaps (Andrew, 8 Nov 2026; D66).** This replaces the preset-snapping and the "only offer layouts that fit" rules above.
- **No snapping, ever.** Dividers and panes follow the pointer exactly and stay where they are let go. There are no magnets and no jumps to a preset width. Opening, closing or rearranging a pane never teleports anything: the other panes **glide** to their new places (about 250 to 350 ms, a gentle ease-out, one spring-like settle, no bounce).
- **Paper, depth and overlap.** Each pane is a card with a soft shadow. When there is not room for every pane at its comfortable width, panes **overlap like sheets on a desk** instead of being squashed or refused: the focused pane sits in front, the others tuck partly behind with their edge and title showing. Click a peeking edge and that sheet slides forward while the other slides back. Dragging a pane by its header lifts it (stronger shadow, in front), and the others slide aside as it passes; it settles where released, in front of or behind its neighbours, according to where the learner put it.
- **Preference, not presets.** The learner decides how much screen each pane takes. The Layout menu still offers starting arrangements (halves, thirds, two to one), but choosing one animates the panes smoothly to those widths, and anything the learner then drags stays exactly as left. A "Tidy" action evens the widths on request (also animated); double-clicking a divider does the same for its two neighbours. Layouts and the stacking order are remembered.
- **How [I]:** animate with transforms and opacity (`translateX`, `scale`, shadow opacity), and animate widths through a measured FLIP step or `grid-template-columns` transitions, so it stays at 60 fps on a modest laptop; no layout thrash while dragging. The pointer is tracked with pointer events (mouse, pen, touch). A small spring helper of our own, or a vetted MIT-licensed animation library if the licence review passes (LICENSES.md), not a heavy framework.
- **Accessibility and reduced motion:** the DOM order and focus are final at once, so screen readers and keyboard users never wait for an animation; the "Show here" menu, arrow-key resizing and a "Bring to front" action give every pointer gesture a keyboard equivalent; with `prefers-reduced-motion` (or Settings > Motion: Reduced) panes move with a very short fade and no sliding or depth shadows; focus rings, contrast and 44 px touch targets are unchanged.
- **Limits:** a pane never goes below a usable width in front (Map about 520 px, Mastery challenge about 480 px); behind another sheet it may show only its edge, and bringing it forward restores its width. Practical ceiling is about four sheets; the test layouts are one, two and three.

**Cost and order [I]:** medium to large. Ship single-pane first (D61 to D64), then add the pane container (rows of 1 to 3, presets, resize), then drag-to-place, then remembering layouts. Build the panels as self-contained components first, so they work as a pane or as a page.

## What chess.com's path does well [V from screenshots]
1. One obvious next step: a single glowing tile with a "Next" label.
2. Tactile, readable tiles: a raised diamond with one icon; locked ones sink and dim, tinted by the section colour.
3. Rhythm: a zigzag with checkpoint tiles (graduation cap) every few skills and a section banner at each level.
4. Pieces drawn between tiles give character without text.
Its weakness: it is a straight line. It hides that skills depend on several others, and a learner cannot see why something is locked.

## Our map's strength [V, CLAUDE.md]
The radial map shows the real prerequisite graph (centre skill, rings by chain, a wedge per strand), with fills for progress, brighter white paths where prerequisites are done, and a glow on next skills. It tells the truth about the structure. It looks flat.

## Recommendation [I]
Do not replace the radial map. Add what chess.com has and we lack, and lift the map's look with the art direction.

### 1. A Path view (new, small, high value)
The default way into the core curriculum (see section 0 for how the views fit together): the recommended route (stages S0 to S7 from `content/path.json`) as a zigzag ladder of tiles, with a "Next" tile, a stage banner and a checkpoint tile per stage (our stage checks, shown never gating). It answers "what do I do next?" in one second, which is exactly the first-hour need (D55, D56). Data and progress already exist; this is layout and states. Tap a tile: the lesson. Tap "why": the radial map opens on that skill.

### 2. Tiles with state, in our language
Five states, never colour alone (a label or glyph always accompanies colour):
- **Locked (needs X):** sunk, dim, a small chain glyph; tooltip and long-press name the missing prerequisite and link to it.
- **Available:** raised, rim light in the strand colour, soft pulse (reduced-motion: static ring).
- **Next:** persimmon rim and a "Next" label (our existing role for persimmon: look here).
- **In progress:** partly filled from the bottom.
- **Mastered:** jade with a small crown mark (our role for jade: demonstrated skill).
Icon per skill: start with one glyph per strand plus the piece or motif glyph where the skill has one; a full 206-icon set is optional and waits for the art pass (Phase 3h).

### 3. Pathways that unlock
- Edges are dark channels until their prerequisite is mastered; then a line of light runs along the edge once (about 600 ms), and the next tile lifts. Reduced-motion: the channel simply switches to lit.
- Choosing a tile highlights the lit and unlit routes into it (our blue and orange links already do this on the map).
- Tie to the atlas idea (`docs/art-direction.md`): regions beyond your frontier are fogged like an unexplored chart and gain colour as you reach them; mastered regions show full colour. Fog is a style on top of facts: no information is hidden that a learner needs (the skill list stays searchable).

### 4. Checkpoints on both views
A checkpoint node per stage ring on the map and per stage on the path: the existing stage check, shown as a gate that opens (a visual only). Matches chess.com's cap tiles; never blocks.

### 5. Style
Tiles as carved stone or enamel with a brass inlay line, pieces as sculpture (no characters), one light direction. Distinct from chess.com's isometric tiles: ours are rounded stones in the six-colour palette, strand colour on the rim. Contrast gates stay (3:1 graphics, 4.5:1 text, both modes). Targets 44 px on touch; keyboard and screen-reader paths stay.

## Order [I]
1. Path view (needs no art; lifts the first hour). Place with Tier 2 of `docs/priority-order.md`.
2. Tile states and the unlock animation on the Path view and the map (CSS and SVG only).
3. Fog and per-skill icons with the art pass (Phase 3h, after the core).

## Risks
Copying chess.com's tile look too closely (rights and identity): borrow the principles, keep our own forms. A two-view split confusing people: one line on each view says what it is for ("Path: what next", "Map: how it all fits"). Performance: 206 nodes in SVG is fine; animate only the changed edge.

## Update: Constellations (D88, 9 Nov 2026)
The Map is named **Constellations** in the header and tabs (address and code names unchanged) and is drawn as a star chart (night sky or parchment, stars, thin constellation lines, astrolabe rings, a compass rose). Behaviour, the D74 line rules and the layout are unchanged. The earlier look is kept at tag `map-before-constellations` (commit 52167ae); restore with `git checkout map-before-constellations -- app/src/components/RadialMap.tsx app/src/styles/map.css`. Details in `DECISIONS-LOG.md` D88.

Second pass (D88b): a near-black sky in dark mode, almost no background dust, the open frontier bright and the rest dim, a soft highlight along the chosen skill's whole way in, and an optional "Slice colours" toggle (off by default, stored per device) that tints each subject's slice in its own hue.

D88c: with Slice colours off each slice still has a thin band in its subject hue along its outer edge and its constellation name in that hue (mixed toward the ink so the text stays readable); the wedge tint is the toggle.

D88d: line brightness is graded again (many small steps from how far the source skill and the target's prerequisites have come), with a floor that keeps the faintest line at 3:1; the frontier keeps small arrowheads, a chosen skill keeps its gold trail.

D88e: chart labels are upright and larger (heading serif for subject names, UI sans for the rest); lines into completed skills are the thinnest hairline at the dimmest allowed brightness, lines into unfinished skills are graded.
