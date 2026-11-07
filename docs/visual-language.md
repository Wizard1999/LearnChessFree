# Visual language (one page)

What each visual signal means, everywhere in the app. One signal, one meaning. Roles come from D45 to D47; tokens are in `app/src/styles/palette.css` (the Scholarmate look) and `app/src/theme.css` (the older looks, which use the same names). Evidence: [V] built and checked in the app; [H] not yet built.

| Signal | Meaning | Colour role | Class (in `app/src/index.css`) |
|---|---|---|---|
| Ring | Selection: the piece or square you picked | cobalt | `.selected` |
| Dots | Legal moves for the selected piece (a ring on a capture) | cobalt | `.move-dest` |
| Arrows | Threats and the move to look at | persimmon [H: arrows still use the board's own brush colour] | |
| Glow (soft fill) | A hint | gold, with ink text | `.hl` |
| Last move | The move just played | gold | `.last-move` |
| Tick in a jade shape | Completion and demonstrated skill; a correct answer | jade | `.resultmark-correct` |
| Tick in a jade diamond | A sound alternative: not the move the exercise wanted, but it works | jade | `.resultmark-sound-alternative` |
| Cross in an ink square | Unsuccessful this time; neutral, never alarm red | ink | `.resultmark-unsuccessful` |
| Persimmon edge and the label "Up next" | The next thing to do, in every view (map node, lesson list, courses, skills up next, practice) | persimmon | `.upnext-mark`, `.upnext-label` |
| Pulsing halo | The map's next skills | persimmon | `.nodeglow` |

Rules

1. Colour is never the only cue. A result always has a shape, a tick or a cross, and a word (jade and persimmon are close in brightness for red-green colour blindness).
2. Glow is rare. It marks only the current lesson, the selected piece and the Up next item. Everything else is flat.
3. Up next is a colour, not a button. The persimmon edge shows always; the words "Up next" appear on hover or keyboard focus, and pointing at it highlights the same skill in every open window (linked hover, D44). The component is `UpNextMark` (`app/src/components/UpNextMark.tsx`); the result marks are `ResultMark` (`app/src/components/ResultMark.tsx`).
4. Gold is a fill or border with ink text, never text on ivory. Persimmon is a fill or edge, with ink text on it.
5. Raw hex colours stay in the palette files; components use tokens (`app/src/lint.colours.test.ts`).
