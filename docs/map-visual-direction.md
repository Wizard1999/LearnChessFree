# Map and path: visual direction (Andrew, 8 Nov 2026; draft 1)

Trigger: Andrew likes chess.com's Learn path tile design (raised tiles with one icon each on a zigzag, a lit "Next" tile, dimmed locked tiles, graduation-cap checkpoints, a section title between levels, chess pieces as scenery) and wants the Scholarmate map to look better and feel like pathways unlocking as prerequisites are completed, while keeping the direction of our radial map. Evidence labels: [V] seen in his screenshots and our code, [I] inference, [H] hypothesis. Nothing here is built.

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
A fourth view beside Map, Courses and All lessons: the recommended route (stages S0 to S7 from `content/path.json`) as a zigzag ladder of tiles, with a "Next" tile, a stage banner and a checkpoint tile per stage (our stage checks, shown never gating). It answers "what do I do next?" in one second, which is exactly the first-hour need (D55, D56). Data and progress already exist; this is layout and states. Tap a tile: the lesson. Tap "why": the radial map opens on that skill.

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
