# Curriculum map as a radial flowchart (Andrew's idea, 29 October 2026)

**The idea.** The Map tab should look like a map, not a list with checkboxes: the first node in the centre, the rest branching outward in all directions along their prerequisite links, building off each other. Progress through S1, S2, S3 and on moves you outward through larger circular layers. The lessons view and the map are the same graph seen two ways, so every lesson shows its connections to the others.

**Does it fit the data? Yes [V: the graph already exists].** `content/skills` has 204 nodes, each with depths and prerequisite edges (`check_graph.py --strict` is clean), plus tiers 0 to 6 and 11 strands. Layout rule: ring = tier (or prerequisite depth from the centre, so a node always sits further out than anything it builds on); angle = strand sector (S1 to S11 each get a wedge, or a shared fan where strands interleave); nodes are placed inside their wedge and nudged apart by a force step so edges stay readable.

**Layout.**
- Centre: the first node (FND.BOARD). Rings outward by prerequisite depth. Strand wedges give each theme a direction, so tactics grows one way, endgames another, and cross-links (edges between wedges) show how themes depend on each other.
- Node = a circle or small building tile, coloured by the existing colour roles (not started, in progress, level one to four, assumed, due). Size = number of lessons or exercises. Edges = prerequisites; lesson-to-lesson "connected lessons" links (`lib/connections.ts`) as a second, lighter edge layer you can toggle.
- Pan and zoom (wheel, drag, pinch, keyboard), a "fit all" button, search and "locate me", rings labelled by tier, wedges labelled by strand. Click a node: detail drawer (outcomes, lessons, practice, mark finished or skip) as now.
- Fog and reach: nodes with all prerequisites met glow; the frontier ring is highlighted; nothing is locked (existing rule).

**Panels.**
- Left drawer, toggleable: the mission or section panel (progress wheel, level blocks, warm-up).
- Right drawer, toggleable: the mastery challenge and Skills up next.
- Both collapse to a thin tab so the map can use the full width; the state is remembered per device.

**Build plan.** `lib/mapLayout.ts` (pure function: skills and edges to x, y, ring, wedge; unit tests: every node outside its prerequisites' ring, no overlaps), `components/RadialMap.tsx` (SVG with pan and zoom; no new library), reuse `nodeProgress` for colours, replace the current Map view in `pages/Course.tsx`, keep the list as the All lessons view. Accessibility: the same graph as a keyboard-navigable list of nodes (the All lessons view) plus arrow-key movement along edges on the map.

**Open choices (defaults in brackets).** Rings by tier or by prerequisite depth [prerequisite depth, with tier as tie-break]; one wedge per strand or interleaved [one wedge per strand]; show all 204 nodes at once or collapse strands that are far from the learner's frontier [show all, dim far ones].

**Added by Andrew (same day): the All lessons view is always reachable from the map.** From the left-hand side of the Curriculum page, whatever view you are in, a toggle opens the overall project window (all lessons, with section lengths, totals and the overall progress bar) beside the map, so you never have to leave the map to see the list, and clicking a lesson in the list highlights its node on the map (and the reverse). The left drawer therefore holds: section progress, the overall project window, and the All lessons list; the right drawer holds the mastery challenge and Skills up next.

## Layout engine status (29 October 2026)
`app/src/lib/mapLayout.ts` (with tests) is written: ring = longest prerequisite chain behind a skill, a wedge per strand sized by how many skills it has, deterministic, survives cycles. Measured on the real 204 skills [V]: 19 rings, 452 skill-to-skill edges, map radius about 1,840 units, but the closest two nodes are only 27 units apart, so crowded rings (S5 ring 9 has 9 nodes, S5 ring 11 has 8) need a relaxation step or a larger ring step before the map is readable. Next: a force relaxation to separate nodes, the `RadialMap` SVG component with pan and zoom, and the two toggleable side drawers.
