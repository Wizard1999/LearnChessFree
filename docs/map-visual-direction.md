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
7. **No tabs: one home and a menu (Andrew, 8 Nov 2026; D63).** The Curriculum is the base of the whole app. The top bar carries only the masthead (brand and "Created by Andrew Valentine", which stays on every page, CLAUDE.md rule 9) and one labelled **Menu** button (with Settings inside it). No row of tabs, on desktop or on a phone, and no bottom tab bar.
   - **Menu** lists, in plain words: Electives, Play, Review (games review, analysis, openings explorer), Library, Contrast lab, My plan, Roadmap, Settings. Two taps reach anything; a new learner never needs it.
   - **Everything else is reached from the home in context**, so the menu is the fallback, not the road: the Continue strip's chips (Review due, Play a game), a skill's panel ("Practise this skill", "Open in Review" after a game), the stage-end invitation to an elective, and after a finished game a "Review this game" button.
   - **Other pages** show a single "Back to Curriculum" at the top left beside the masthead, so nobody is ever lost. The Curriculum remembers where you were (Path or Map, selected skill).
   - Risk: things a learner has not been shown yet are hidden behind a button (discoverability) [H]. Mitigations: the menu button has a word on it, not only an icon; the Continue strip names the next useful thing; Play and Review get one-line invitations at the moments they apply. Test this in the first real use (after release); if Play or Review go unused, promote one of them to a visible link (a one-line change).
8. **Friction budget [H]:** from opening the app to the first move should be one tap for a returning learner (Continue) and one tap for a new one (Start). Count taps in the route smoke test.

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
