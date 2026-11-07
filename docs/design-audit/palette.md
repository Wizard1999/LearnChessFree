# Palette look review (opt-in "Scholarmate" look, light and dark)

Date: 7 Nov 2026. Evidence labels: [V] checked here, [I] judgement.

## Scope and default
The old look ('Friendly') is the default and was not changed; 'Collegiate' is untouched; saved choices are not migrated. The manifest (`theme_color #1f3a5f`, `background_color #17191b`), the static `theme-color` meta (#f4f1e9) and `icon.svg` keep their old colours [V]. Only while the new look is active does a live `theme-color` tag follow the mode (ivory or ink).

## What was reviewed
[V] Automated: a script walked every text node on 14 routes (Today, Curriculum, Practice, Progress, Play, Analysis, Openings, Lab, My games, Library, Roadmap, Settings, My plan, a lesson) in light and in dark, composited the real background colours and tested 4.5:1 (3:1 for large text). Disabled controls, book covers (gradient art) and the build stamp were handled separately. [V] `tools/check_contrast.py`: 212 token pairs OK in both modes.
[V] By eye in the built-in browser (mobile preset, 375 px; desktop 1440 px emulation was only partly visible in the capture pane): Today, Curriculum (stage headers in solid colour), the map with the stage chip row, a lesson with a board (a wrong tap-squares answer, then "show me the answer"), Progress (coloured stage cards, "You are here" marker), Play (a move against the engine), Settings (Light switched on while the device was dark; reload kept it with no flash because `index.html` sets the attributes before paint), dark and light.
[V] Not driven by hand: the line player, a contrast-lab step with a result, Practice and the Roadmap screens were covered by the automated contrast walk only; I did not look at them in a screenshot. A correct answer was not entered (the wrong and revealed states were).

## What changed
1. Active item in the "More" menu was white text on a pale chip (1.2:1): the header rule for `nav a.on` leaked into the dropdown. Now ink text, chip fill, bold, cobalt bar at the left edge, and a visible focus ring.
2. Board rank numbers (the left edge) were inverted: the colour for light squares sat on dark squares. In dark mode that put ink numbers on teal (about 2.8:1) and ivory on cream. Now rank 1 on a1 (dark) takes the dark-square colour and so on; Black-below is handled the other way round (the numbers then sit on the h-file).
3. The interim "Not quite: ..." message now carries a cross before its words, so colour is not the only cue (the final result already had a shape, a tick or cross and a word).
4. The build stamp passed only at 4.44:1 because of an opacity of 0.8; it is full opacity in the new look (the old look is unchanged).

## What remains
- The automated walk cannot see text on gradient or image backgrounds; the library covers were judged by eye only in part. [I] Cover text uses its own light-on-dark pairing but is not gated.
- Colour-blind simulation was not run; jade and persimmon are always accompanied by a tick, a cross, a shape or a word [I].
- Map: on the phone the mini-map preview overlays the lower-left of the map view and can hide a label; the layout is out of scope here (the mobile redesign comes later).
- One unrelated test fails (`contentFiles.test.ts`, lesson minutes versus the catalog): in-flight content changes, not the look.
- The desktop 1440 px review was done through an emulated viewport that the capture pane shows only partly; a pass on a real wide window is still worth doing.
