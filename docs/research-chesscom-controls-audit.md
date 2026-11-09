# chess.com controls audit (design benchmark for Scholarmate buttons)

Method: built-in browser, Andrew's trial account, 9 Nov 2026, desktop width 1219 css px (frame 800x842). Tooltips read from the live DOM (`.cc-tooltip-inner`) after a mouse hover of about 1 second, so wording and styling are exact [V]. Nothing was clicked that changes account state. No screenshots saved to disk by me beyond the tool's own scratch images.
Marks: [V] seen here, [I] inferred.

## Part 1: chess.com

### 1.1 Lesson / challenge screen (Learn lessons, played in full)

Shared tooltip component (applies to every tooltip on this screen) [V]:
- Appears on mouse hover only. Appeared within the 1 s I waited; fade 0.2 s (opacity transition) [V]. Exact delay not measured [I: short, roughly 0.3 s].
- Position: centred above the control (placement "top"), about 5 px gap. Box: 32 px high, text 14 px medium-bold white, background black at 77% opacity, corner radius 3 px, no arrow seen, padding wraps the text (the "Share" tip was 52 px wide).
- Keyboard focus does NOT show the tooltip [V]: I focused Share with `.focus()` and with Tab; no tooltip appeared, only the browser's default light outline ring (white-ish rectangle drawn around the button) [V].
- Disabled icon buttons still show their tooltip on hover [V] (Review Challenge, Previous Move) but the cursor becomes "not-allowed" and the icon drops to 50% opacity [V].
- Controls with an accessible name but no tooltip: Back, Toggle Lesson Audio, Hint [V].

| Control | What it does | Words / icon | Icon shape | Role, size, colour | States | Tooltip (exact) | Notes |
|---|---|---|---|---|---|---|---|
| Start (lesson intro card) | begins the lesson | icon + words ("Start") | check mark in circle at left of label | primary green, wide pill button about 250 px wide [V from screenshot] | pressed = moves to challenge 1 [V] | none seen [V: not hovered] | the only green button until a challenge finishes |
| Next (arrow, bottom right of the panel, appears after a correct answer) | next challenge | icon only | right-pointing arrow in a wide green bar | primary green, full panel width about 250x48, radius about 10 px [V from screenshots] | appears only when the answer is correct; hidden while wrong [V] | none noted [V: not hovered] | the green bar is the strongest affordance on the screen |
| Hint | shows a hint for this challenge | icon only | light bulb with glow (glyph name `device-bulb-glow`) | secondary grey bar 252x48, radius 10 px, text colour white 85%, bg dark transparent [V] | hint count/“No hints” state per lesson (see journey notes) | none [V] | icon-only although it is the main help; meaning is clear from the bulb |
| Retry (after a wrong move) | undo the wrong move and try again | icon only (red button) | circular arrow, anticlockwise = restart | red/danger bar, same width as Hint (right half of a two-button row) [V from screenshots] | appears after a wrong move only | none [V: not hovered] | paired with Solution |
| Solution (after a wrong move) | show the answer | icon only | magnifier with a plus/zoom glyph | secondary grey, left half of the row | appears after a wrong move only | none [V: not hovered] | meaning of magnifier-plus as "show solution" is unclear until learned [V: unclear icon] |
| Back (top left of panel) | leave the lesson | icon only | arrow pointing left | ghost, 44x48, no fill, icon 50% white, radius 0 [V] | pointer cursor | none [V] | accessible name "Back" |
| Toggle Lesson Audio (top right) | mute / unmute the coach voice | icon only | speaker with sound waves | ghost 44x48, icon 50% white [V] | on/off toggle [I] | none [V] | state shown only by the glyph [I] |
| Settings (gear above the board, top-right corner of the board area) | open board/lesson settings | icon only | gearwheel (class `circle-gearwheel`) | ghost, 32x24 [V] | pointer | "Settings" [V] | small and low contrast; sits in the corner of the board |
| Share | share the position | icon only | three connected dots (share nodes) | ghost icon button 32x32, radius 5 px, icon 20 px, 50% white [V] | normal, hover brightens [I] | "Share" [V] | |
| Practice vs Computer | open a custom game against the bot from this position | icon only | target / bullseye (concentric rings) | ghost icon button 32x32 [V] | enabled | "Practice vs Computer" [V] | it is a link (`<a>`) not a button; the bullseye does not obviously mean "play the computer" [V: unclear icon] |
| Review Challenge | replay the challenge you just did | icon only | circular arrow with a play-style mark (undo-looking arrow in my zoom) | ghost 32x32, disabled until a challenge is finished: opacity 50%, cursor not-allowed [V] | disabled/enabled | "Review Challenge" [V, shown even when disabled] | the third icon in the row of three (share, target, undo-arrow) |
| Previous Move | step the board back | icon only | chevron pointing left | ghost 32x32, 50% opacity when disabled [V] | disabled when no moves played | "Previous Move" [V] | |
| Next Move | step the board forward | icon only | chevron pointing right | ghost 32x32, disabled [V] | disabled | "Next Move" [V] | |
| "Lesson Complete!" overlay: Finish | closes the lesson, goes to the path | words only | none | primary green full-width button inside a modal, about 250x40 [V from screenshots] | | none | the only words-only primary control in the flow |
| Board (squares) | move by click or drag | n/a | | selected square yellow-green, legal-move dots, red cross badge on a wrong move, green check badge on a right move [V] | | none | feedback badges sit on the target square's corner |

Layout facts [V]: the right panel is about 250-300 css px wide; the primary bar buttons (Hint, Next, Retry, Solution) are all 48 px high with 10 px radius; the small icon row (share, target, undo-arrow on the left; chevrons on the right) sits under the bar with 0 gap between 32 px buttons, 32 px centres [V].

(More screens follow below as they are audited.)

### 1.2 Learn path (/learn)
Layout [V]: the board stays on the left (initial position); the right panel holds a coach speech bubble ("it's time for your next lesson"), a scrolling mini-map of hexagonal tiles (the path), then a stack of four full-width buttons.

| Control | What it does | Words / icon | Role, size | Tooltip | Notes |
|---|---|---|---|---|---|
| Next Lesson | opens the next unfinished lesson | words only | primary green, 252x64, radius 10 px [V] | none | the only green control on the screen |
| Play Coach | opens a game with the coach bot | icon + words (coach avatar + "Play Coach") | secondary grey, 252x64, radius 10 px [V] | none | |
| Learn an Opening | opens the openings trainer | icon + words (wooden box icon) | secondary, 252x64 [V] | none | label wraps to two lines |
| Lesson Library | opens the course library | icon + words (blue library icon) | secondary, 252x64 [V] | none | |
| Close (X above the button stack) | dismisses the "next lesson" call-to-action panel | icon only | ghost 40x40, no radius [V] | none [V] | plain cross |
| Scroll to active lesson (floating, bottom of the tile map) | jumps the map back to the current tile | icon only | icon button large 48x48, radius 10 px, glyph `arrow-line-top` (arrow up to a line) [V] | none [V] | unclear icon: "arrow up to a bar" does not say "back to current lesson" [V] |
| Path tiles (hexagons) | open that lesson | icon only (a piece icon per tile) | about 96x72 SVG links [V] | none seen | one tile carries a small dark "Next" tag [V screenshot]; locked/finished shown by fill, not by tooltip [I] |
| Left sidebar (Play, Puzzles, Learn, then three more) | main navigation | icon only, 40x40 ghost, radius 5 px [V] | ghost | no tooltip; hovering opens a dark FLYOUT list to the right, small-caps heading plus word links: Play = Play Online, Play Bots, Play Coach, Stats, Tournaments; Learn = Lessons, Play Coach, Openings [V] | the flyout replaces tooltips for top navigation |
| Sidebar bottom (search, club/building, people, mail with red count badge, bell, cogwheel) | search, social, notifications, settings | icon only, 32x32 ghost, radius 3 px [V] | glyphs: magnifier, building, `users`, `message-envelope-fill`, `media-bell-fill`, `utility-cogwheel` | no tooltip or flyout seen on the one I hovered [V weak] | the red number badge is the only state marker |

### 1.3 Puzzles (landing /puzzles and the Daily Puzzle screen)
Landing [V]: two controls under the headline: "Solve Puzzles" (words only, primary green, x-large 189x64, radius 10 px) and "Expand Puzzles Menu" (icon only, secondary 55x64, glyph `layout-list-bullet`, bulleted lines; no tooltip on hover [V]).
I did not start a rated puzzle (it would change Andrew's puzzle rating); I used the Daily Puzzle, which can be viewed without solving.
Daily Puzzle intro modal [V]: title "Daily Chess Puzzle", three icon-plus-text bullets, primary green "Ok" (words only, 396x64), small X close top right (icon only, 48x48).
Daily Puzzle screen [V]:

| Control | Words / icon | Shape and role | Tooltip |
|---|---|---|---|
| Back (top of panel) | icon only | arrow left to a line (`arrow-line-left`), ghost 44x48 | none |
| Toggle Coach Audio | icon only | speaker with waves, ghost 44x48 | none |
| Previous Day / Next Day | icon only | chevrons left / right, 32x32 small icon buttons | "Previous Day" shown above-left of the button in the same dark pill [V]; Next Day is disabled on today's puzzle [V] |
| Date selector | words + icon ("Nov 8, 2026" + down chevron) | dropdown button 116x35 | none seen |
| Hint | icon + words ("Hint") | secondary grey bar 268x48, bulb glyph `device-bulb-glow` | none seen |
| Share | icon only | three nodes, 32x32 | "Share" on the lesson screen [V]; not checked here |
| Lives | icon only | row of five green hearts | none |
| Settings (cog above the board) | icon only | cog 32x24 | "Settings" [V on other screens] |

Difference worth noting [V]: the lesson screen's Hint is the bulb alone; the daily puzzle's Hint is bulb plus the word "Hint".

### 1.4 Play vs bot (/play/computer)
Setup screen [V]: list of bot categories (New to Chess, Beginner, Intermediate, Advanced, Master, Adaptive, Athletes, Musicians, Creators), each a row with a face, a name and a bot count. Bottom: "Options" dropdown (clock-badge icon + chevron, 172x40), a three-way side selector (three 24x24 icon-only toggles), a secondary "No Timer" button (266x40), and the large primary green "Play" (276x64, words only). No tooltips on the side selector or Options [V].
In-game screen [V]:

| Control | Words / icon | Shape and role | Tooltip |
|---|---|---|---|
| Resign | icon only | straight flag (`game-flag-straight`), secondary grey, 87x48 | "Resign" [V] |
| Undo | icon only | curved arrow pointing left (`arrow-triangle-swoosh-left`), secondary, 87x48 | "Undo" [V] |
| Show Hint | icon only | bulb with glow, secondary, 87x48 | "Show Hint" [V] |
| Download | icon only | arrow into a tray (`arrow-triangle-tray-in-bottom`), ghost 32x32 | "Download" [V] |
| Settings | icon only | cogwheel, ghost 32x32 | "Settings" [V] |
| Opening label icons | icon only 20x20 | small icons next to "Starting Position" | none seen |

The three main in-game actions are equal-width icon-only bars in one row, each with a tooltip. Same dark pill tooltip as lessons [V].

### 1.5 Analysis (/analysis and the analysis board)
Landing [V]: a "Paste a PGN, FEN, or study link" field with a plus icon button (Upload File, 48x48, glyph `mark-plus`), a secondary "Load" button (276x48, DISABLED until text is pasted), then seven FEATURE BUTTONS stacked (276 px wide, 72-86 px high), each with an icon at left, a bold title and a one-line grey description: Set Up Position, New Analysis, Game Collections, Game Search, Explore, Saved Analysis, Classroom. Last: a ghost "Load Previous" (clock-rewind icon + words, 276x32).
Analysis board [V]:

| Control | Words / icon | Shape and role | Tooltip |
|---|---|---|---|
| Tabs: Analysis, Games, Explore | icon above words | three 100x56 tabs | none |
| Run Cloud Analysis | icon only | chip with exclamation (`device-chip-exclam`), 32x32 | "Run Cloud Analysis" [V]; unclear icon [V] |
| More options (top and bottom) | icon only | three dots in a row, 32x32 | none appeared [V] (menu on click [I]) |
| Settings | icon only | cog 32x32 | "Settings" [I] |
| Engine lines | words + score badge | white score pill (+0.29); a 24x24 down-triangle "Show More" per line | none |
| Game Details | icon only | pencil-line 24x24 | "Game Details" [V] |
| First / Previous / Next / Last Move | icon only | double chevron start, chevron left, chevron right, double chevron end; secondary grey 65x48, DISABLED at the starting position [V] | "First Move" shows even while disabled [V]; others have the matching names [V as accessible names] |
| New (New Analysis) | icon + short word | ghost 65x40, magnifier-checker | none (label visible) |
| Save (Save Game) | icon + short word | ghost 65x40, stacked boards with plus | none |
| Review (Game Review) | icon + short word | ghost 81x40, star in a circle, DISABLED until a game is loaded | none |

Pattern: navigation is four equal-width icon-only arrows (secondary, large); file actions are icon + SHORT word (ghost). The accessible names are longer than the visible words ("New Analysis" vs "New").

### 1.6 Home (/home, logged in)
Controls [V]: dismiss X on the marketing banner (icon only, 24x24, `mark-cross`); in the "Play Online" card three time-control chips ("10 min", "5 min", "3 days", words only, secondary, 77x40) above the primary green "Start Game" (words only, 248x48) and four secondary buttons: Play Online, Tournaments, Play Bots, Play a Friend (248x48, icon + words). Recommended-activity cards (248x384) each hold a secondary words button: "Solve Puzzles", "Next Lesson" (the card names the next lesson, Gaining Space), "Play Coach" (216x48). Game history rows (728x76) each have a "Review" button (star-in-circle icon + word, secondary 77x32) and a heart icon button "Add to Favorites" (32x32, tooltip "Add to Favorites" [V]). A full-screen promo modal (Black Friday) appeared on load with a green "Let's Go!" and an X; I closed it with the X [V].
Sidebar: as in 1.2.

### 1.7 Patterns (chess.com)
1. Colour roles [V]: green = the one primary action on a screen (Start, Next Lesson, Play, Start Game, Solve Puzzles, Ok, Finish, Let's Go). Grey secondary = bar buttons (Hint, Resign, Undo, Load, Play Coach). Ghost (no fill) = small utility (back, share, cog, sidebar). Red = Retry after a wrong move. Heights: 64 px on big pages, 48 px in panels, 40 px chips, 32 px small icon buttons. Radius 10 px on bars, 3-5 px on small icon buttons.
2. Always icon only [V]: Back, audio toggle, share, settings cog, previous/next, first/last, hint inside lessons, resign/undo/hint in games, undo/retry arrows, sidebar items. Always words or icon + words: the primary green button, the feature buttons, Review, game-mode choices; Hint on the daily puzzle.
3. Tooltip rule [V]: dark pill (black at 77%, white 14 px medium-bold text, 3 px radius, 32 px tall, a few px above the control, fades in over 0.2 s), HOVER ONLY. It appears on the 32 px ghost icon buttons, on the in-game and analysis icon bars, and on day-arrows. It does NOT appear on the big lesson Back / audio / Hint buttons, the sidebar (a flyout menu replaces it), Scroll-to-lesson, Close, the side selector, or More options.
4. Keyboard focus never showed the tooltip [V on lesson Share and Practice vs Computer]; focus shows only the browser's default outline ring.
5. Disabled [V]: 50% opacity, not-allowed cursor, and the tooltip still shows on hover. Disabled primary actions (Load) stay in place instead of disappearing.
6. Spacing [V]: small icon buttons sit edge to edge at 32 px centres; bar buttons in a row share the width equally with a small gap (three 87 px bars in the bot game).
7. Unclear icons [V]: bullseye = Practice vs Computer; magnifier-plus = Solution; chip with exclamation = Run Cloud Analysis; arrow up to a bar = Scroll to active lesson; list bullets = Expand Puzzles Menu. Most have a tooltip or accessible name, but a first-time learner could not guess them.
8. Takeaway for Scholarmate [I]: one green button per screen; words on anything that starts or commits; tooltip on hover AND on keyboard focus (chess.com skips focus); a visible text label for touch where hover does not exist.

## Part 2: lichess.org

Method for lichess [V]: separate tab, no login (anonymous), pages /analysis, /training, /learn#/1, plus the top bar. Lichess draws icons from its own icon font (no glyph names in the DOM), so shapes below are from screenshots. Its tooltips are the browser's NATIVE `title` attribute, which does not appear in DOM or screenshots, so I read the title strings but could not time or style the pop-up itself [I: native title pop-up appears after about 0.5-1 s, small light-grey box next to the cursor, only on mouse hover and not on keyboard focus]. There is no custom tooltip component on these pages (zero `data-hint` attributes) [V].

### 2.1 Top bar (all pages)
| Control | Words / icon | Role, size | Tooltip / state |
|---|---|---|---|
| Site title "lichess.org" | words (logo) | link 179x59 | none |
| PLAY, PUZZLES, LEARN, WATCH, COMMUNITY, TOOLS | words only, small caps | nav links 53-108 px wide, 53 px high; each opens a hover dropdown of word links (PLAY has four 138x54 entries, others 138x35) [V] | no tooltip; dropdown is the label |
| DONATE | icon (wing) + words, orange | link 106x48 | none |
| Search | icon only (magnifier) | link 58x60 | none seen |
| SIGN IN | words only, outlined | 77x39 | none |
| REGISTER | words only, solid blue (rgb 54,146,231), uppercase 14 px, radius 8 px, height 39 px | 92x39 | the only filled button in the bar |
| Preferences | icon only (cog) | button 58x60, `title="Preferences"` [V] | native title only |
| "Lichess Updates Feed" | icon only (broadcast/feed) | `title` [V] | native title only |
| Accessibility "Enable blind mode" | words, hidden skip control at the very top | 214x19 | |

### 2.2 Analysis board (/analysis)
Layout [V]: board left, engine/moves panel right, a FEN box and PGN box below the board, a variant dropdown ("Standard" with a crown icon). The control bar under the move list:

| Control | Words / icon | Shape, size | Title (native tooltip) | States |
|---|---|---|---|---|
| First / Previous / Next / Last move (`data-act` first, prev, next, last) | icon only | double chevron to a bar, chevron left, chevron right, double chevron to a bar; flat, no fill, 69x34 | NO title text on any of the four [V] | dimmed and `disabled` at the start (all four) [V] |
| Opening explorer & tablebase | icon only | book glyph, 35x42 | "Opening explorer & tablebase" [V] | |
| Practice with computer | icon only | robot/computer glyph, 35x42 | "Practice with computer" [V] | |
| Menu | icon only | three horizontal lines (hamburger), 35x42 | "Menu" [V] | turns solid green when open [V screenshot] |
| Show threat (x) | icon only | small icon beside the engine toggle, 18x44 | "Show threat (x)" [V]; the letter is the keyboard shortcut | |
| Engine settings | icon only | cog, 31x44 | "Engine settings" [V] | |
| Engine on/off | toggle switch (grey pill 40x24, no words) | grey = off, blue = on [I] | none | |
Menu panel (opens in place of the move list, titled "Analysis board") [V]: rows of icon + words, one control per row, in a two-column grid, each row 174x56 and flat dark grey: Flip board (two arrows), Board editor (pencil), Continue from here (crossed swords), Study (square-in-square), Settings (cog). No tooltips because the labels are visible [V].
Keyboard shortcuts are shown inside the title strings (for example "(x)") and in a help dialog opened with the "?" key [I from lichess's documented behaviour; not opened].

### 2.3 Puzzles (/training)
| Control | Words / icon | Shape and role | Notes |
|---|---|---|---|
| GET A HINT | words only | outlined ("button-empty"), uppercase, 102x39 [V] | |
| VIEW THE SOLUTION | words only | outlined, uppercase, 161x39 [V] | |
| "Jump to next puzzle immediately" | words + toggle switch | grey pill 40x24, label beside it [V] | the only toggle in the screen |
| « Puzzle Themes | words | text link | |
| First / Previous / Next / Last / Menu | icon only | same flat bar as in analysis, 78x34 | Menu has `title="Menu"`; the four arrows have none; Next and Last disabled while at the latest move [V] |
| REGISTER | words, solid blue | 92x39 | account prompt in a panel |
Feedback after a wrong move is shown as text in the side panel ("Your turn / Find the best move for black"); the prompt panel is a flat dark rectangle with the king icon [V].

### 2.4 Learn (/learn#/1, "Learn chess by playing")
| Control | Words / icon | Shape and role | Notes |
|---|---|---|---|
| LET'S GO! | words only | filled blue button, 280x48 [V] | on the stage intro; the only button in the lesson |
| Level pills 1 to 6 | numbers only | small tabs 62x38 in one row under the stage title; active = solid blue, finished = lighter, future = dimmed [V] | clicking a finished level reopens it; no tooltip |
| Menu (back to the stage list) | words, with a small chess-piece icon in a blue square | text bar 782x50 [V] | |
| Stage list rows ("The rook", "The bishop", ...) | icon + words | full-width rows 781x50; active = brighter, future = dimmed [V] | |
In the level itself [V]: no Hint, no Retry and no Next buttons were visible; the board shows a star and a green arrow as the goal, and the stage ends by a message and an automatic move to the next level. Retry on failure is automatic (the board resets) [I from the Rook stage design; I did not fail a level].

### 2.5 Patterns (lichess) [V unless marked I]
1. Buttons: words, uppercase, 14 px; blue filled = primary (REGISTER, LET'S GO!); outlined/empty = secondary (SIGN IN, GET A HINT, VIEW THE SOLUTION). Radius about 8 px, height 39-48 px. Fewer sizes than chess.com.
2. Icon-only, with a native `title`: the board toolbar (explorer, practice, menu, engine settings, threat), preferences cog. Icon-only with NO title and no visible label: first / previous / next / last move arrows (their meaning is conventional) [V].
3. Words always: every start/commit action and every puzzle help action (hint, solution). The puzzle and learn screens put words on the buttons that chess.com leaves as icon-only bulbs.
4. Tooltips: native browser titles only. No custom pop-up, no styling, no controlled delay, none on keyboard focus [V/I]. Shortcut keys are exposed in the title text "(x)".
5. Disabled state: reduced contrast and the `disabled` attribute; no tooltip content change [V].
6. Focus: a visible 2-3 px light outline/glow on buttons (outline colour rgb(255,255,255) on REGISTER, box-shadow glow) [V].
7. Spacing and size: toolbar buttons are equal-width flat cells filling the control bar (69-78 px by 34 px), dense, no gaps. Menu items are big flat rows (174x56) with icon + label.
8. Toggles are pill switches (40x24) with a label to the right, not icons [V].

## Part 3: Cross-site comparison for Scholarmate buttons [I]
- Both sites keep ONE filled colour button as the primary action per screen. chess.com: green, 48-64 px high, 10 px radius, icon optional. lichess: blue, uppercase, 39-48 px, 8 px.
- Navigation arrows (first / previous / next / last) are icon only on both sites; both dim the buttons that cannot act. chess.com also shows their tooltips when disabled; lichess shows no titles for them.
- Help actions in puzzles: chess.com = bulb (icon, sometimes plus word); lichess = words "GET A HINT" / "VIEW THE SOLUTION". For learners new to the interface, words win; consider icon + word.
- Tooltips: chess.com has a styled custom one (hover only, 0.2 s fade, dark pill above the icon) but never on keyboard focus; lichess relies on native titles. Scholarmate can beat both by showing the same tooltip on hover AND on keyboard focus, with the shortcut key in the text, and by keeping a visible label for any icon the learner needs on first use.
- Unclear-icon list (chess.com) in 1.7 item 7 is the list to avoid copying without a label.
