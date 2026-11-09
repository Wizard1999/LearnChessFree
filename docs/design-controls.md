# Controls: buttons, icon buttons, tooltips (decision D73)

Andrew, 9 Nov 2026: chess.com buttons are designed buttons, some with words, some symbols only, with a styled tooltip on hover; chess.com and lichess are the benchmarks to beat. Evidence labels: [V] verified here, [S] secondary, [R] recalled, [I] inference, [H] hypothesis.

Code: `app/src/components/Button.tsx` (Button, IconButton, LinkButton), `Icon.tsx` (own 24px line drawings, `currentColor`, no icon font), `Tooltip.tsx`; CSS `app/src/styles/controls.css` (tokens only). Tests: `components/controls.test.tsx`, `header.nav.test.tsx`.

## (a) Inventory of our own app

Counted from the source before the change [V, grep]: 274 `<button>` elements, 43 `className="link"` action-links, plus router `Link`s used as actions. Words/symbol classification of the places converted now, and what is left:

| Screen | Control | Was | Now |
|---|---|---|---|
| Analysis toolbar | first / previous / next / last move | symbols in plain buttons (⏮ ◀ ▶ ⏭) | icon-only, tooltip with key (Home, left, right, End) |
| | Flip | word "Flip" | icon-only, tooltip "Flip the board" + F |
| | Edit board, Make main line | words | icon + words, tooltip explains |
| | Delete from here | words, `title` only | danger: icon + words, tooltip |
| | Engine on/off | words | icon + words, toggle (pressed state), tooltip |
| | More | words + text arrow | icon + words secondary |
| | Keyboard shortcuts, Save as image (in More) | words | quiet, icon + words |
| Lesson/exercise | Hint, Reset the board, Show me the answer | words | icon + words, tooltip (words stay: a beginner must know what each does) |
| | Read aloud | chip, words | icon + words toggle; pause / resume / stop are icon-only with names |
| | Line player first/previous/next | symbols | icon-only; Next is primary |
| Board | Control map toggle | words | icon + words toggle |
| Play / guided game | Hint, Show me, Play it again | words | icon + words; Stop is danger |
| Lesson page | Skip / Mark finished / Start over, Curriculum list | underlined links | quiet buttons; Start over is danger; all with tooltips |
| Header | Curriculum, Electives, Map, Progress, Mastery challenge | chip row on one page | words, in the bar on every page (D72) |
| Curriculum list | Grouped by / status filters | chips | segmented controls; Next lesson is one primary button; Expand/Collapse all |
| Many pages | Mark finished, Reset, Remove, Not now, Review this lesson, Open lesson, Clear filters, Download a copy... | underlined `link` | quiet buttons (Reset is danger) |
| Left as text links | links inside a sentence (Set one now, retry, Change), move lists, "Builds on / Leads to", table links | `link` | unchanged: navigation inside prose stays text |
| Left for a later pass | about 150 plain `<button>` in Practice, Placement, Plan, Settings, Games, Openings, Library, RadialMap dock, and the phone header Settings button | default button style | still consistent (the old default button looks like a secondary), not yet on the new classes |

## (b) Taxonomy

1. **Primary** (words, filled accent): the one action that moves the learner forward on a screen (Continue, Next lesson, Start game). One per region.
2. **Secondary** (words, outlined, optional leading icon): everything else with a clear name (Hint, Reset the board, Edit board).
3. **Quiet** (words, smaller outlined): tidy side actions in rows and lists (Mark finished, Clear filters).
4. **Icon-only** (square, symbol, tooltip + `aria-label` always): board and game controls whose symbol is universal: first / previous / next / last, flip, close, pause / play / stop, settings, menu. Toolbars group them.
5. **Toggle** (any of the above with `aria-pressed`): pressed state is a tinted fill plus an inner accent ring, so it never relies on colour alone (the label also changes where the meaning flips, e.g. "Engine on").
6. **Danger** (words, outlined in the error colour, never filled): anything that deletes or ends something (Start this lesson over, Delete from here, Reset, Stop).
7. **Segmented** (`.seg`): one outlined group where exactly one is pressed (Grouped by stage | subject; status filter).

Rules for words versus a symbol:
- Words are required for anything that changes or erases progress, anything destructive, any action a beginner has never seen (Hint, Show me the answer, Edit board, Control map), and any primary action. An icon may sit beside the words.
- A symbol alone is enough only when it is a convention shared by every media player and chess site (arrows, flip arrows, play/pause/stop, close, gear, menu dots) and the action is cheap to undo. Even then, tooltip and `aria-label` are required.
- Where chess.com uses a bulb alone for Hint and a magnifier for Solution [V, controls audit], we keep words: the audit marks those icons as unclear.

Sizes and states:
- Minimum 40px square or height; 44px on touch (`pointer: coarse` raises `--btn-min`). Icon buttons are 40 (large 48). Gap 0.4rem in a toolbar; a 1px separator groups related sets.
- States: rest (surface, 1px `--control-boundary`, 2px lower edge), hover (accent border), pressed (`:active` drops 2px, no motion under reduced motion), `:focus-visible` (3px `--focus` ring, 2px offset), disabled (50% opacity, no shadow; the tooltip still shows so the reason can be read), toggled (above).
- Colour pairs are in the contrast gate (`tools/check_contrast.py`): label on accent, error on surface, symbol on surface and on the pressed tint, tooltip label on tooltip fill; 4.5:1 text, 3:1 graphics, both modes, both gated looks.

## (c) Tooltip rules

- Styled to the site with tokens only: fill `--tip-bg` (= `--text`), label `--tip-fg` (= `--canvas`), so it inverts correctly in every look and in dark mode. Small radius, soft shadow, an arrow, 0.82rem bold.
- Shows after 400ms of hover, at once on keyboard focus (`:focus-visible`-like: not after a mouse press), and after a 500ms long press on touch (the click that would follow is swallowed; it hides itself after about 2s).
- Content: the action name, plus the shortcut in a small key cap where one exists (`aria-keyshortcuts` is set on the button too).
- Position: above the control, centred, 8px gap; flips below when there is no room above; slid sideways to stay inside the viewport with an 8px margin; never covers the control (it sits outside it and ignores the pointer).
- Escape closes it (and is not passed on, so it does not also close a dialog).
- Reduced motion: no fade or slide. Forced colours: gets a border.
- Never the only accessible name: every icon button has `aria-label`; the tooltip is `aria-hidden` so a screen reader does not hear the name twice.
- Disabled controls still show it (chess.com does too [V]).
- Tested: render, name present, shown on focus, Escape closes, hover delay (`controls.test.tsx`).

## (d) How this beats chess.com and lichess

chess.com [V, `docs/research-chesscom-controls-audit.md`, 9 Nov 2026]: a dark pill tooltip (about 77% black, 14px bold white, 3px radius, above, 0.2s fade) on hover only; focus does not show it; many main actions (Hint, Retry, Solution, Practice vs Computer, scroll-to-active) are bare icons whose meaning has to be learned; top navigation uses flyouts instead.
lichess [R, recalled, not checked here]: plain icon buttons with the browser's native `title` tooltip (slow, unstyled, no shortcut, not on focus, never on touch); shortcuts are listed in a separate dialog.

Where we are equal or better:
- **Keyboard and touch parity** (better than both): the tooltip appears on focus and on long press; chess.com's does not appear on focus [V]; lichess's native titles do not on touch [R].
- **The shortcut is in the tooltip** (better than both [V][R]).
- **No unclear bare icons** (better than chess.com): words for Hint, Answer, Edit board, Control map; symbols only for universal ones.
- **Danger is distinct and always has words** (better than chess.com's red icon-only Retry).
- **Tokens, four looks, dark mode, contrast gated** (a native `title` cannot be styled at all).
- Equal: designed raised buttons with pressed travel; compact icon toolbars; a tooltip that fades in above the control.
- Not matched: chess.com's polished animated icon art (ours are plain strokes) [I]. Our icon set is 35 glyphs, enough for the board and lesson controls only.

## Not verified / left
- Real screen-reader and touch-device testing of long press (browser emulation only) [H].
- Remaining plain buttons (see inventory) still use the old default; convert page by page.
- The header `More` summary and the phone Settings button keep the bar's own colours (`on-bar` tokens) and are not yet drawn as controls-system buttons.
