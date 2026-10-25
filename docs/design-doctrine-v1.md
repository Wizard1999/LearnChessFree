# Chess Website Design Doctrine

Version 1.0 · 25 October 2026

## Purpose and recommended direction

Build a free chess learning website that makes chess feel worth taking seriously and makes learning feel within reach. Preserve the board conventions and predictable controls people know from established chess websites. Create a distinct identity through typography, composition, color, chess history, and the way lessons reveal decisions.

The recommended direction is **a contemporary chess club with the atmosphere of a great tournament**. It should combine the hospitality of a public club, the clarity of a good analysis board, and the emotional weight of an annotated masterpiece. Warm ivory, deep ink, restrained vermilion, confident editorial typography, and recognizable chess pieces form the visual foundation.

This is a design proposal and implementation brief, not a claim of proven learning superiority. Better instruction and broader age appeal must be demonstrated through use. The website can communicate ambition immediately; its lessons must earn that ambition.

The governing sentence is: **Make the game feel consequential and the learner feel welcome.**

## 1 The experience we are creating

### Emotional sequence

| Moment | Desired feeling | Design response |
| --- | --- | --- |
| First visit | This looks exciting and credible | One striking chess position, strong title, clear free-access promise |
| Choosing a starting point | There is a place for me here | Start from zero, find my level, or browse without a test |
| Opening a lesson | I understand what I am about to learn | Plain objective, short time estimate, obvious next action |
| Facing a position | My decision matters | Board prominence, concise challenge, quiet surrounding interface |
| Making a mistake | I can understand and improve this | Explain the consequence and offer a usable next step |
| Solving a challenge | I saw something meaningful | Show the idea and why it works; restrained acknowledgement |
| Returning | I know where to continue | Saved position, visible next lesson, useful review |
| Becoming stronger | I am developing judgment | Increasing independence, game transfer, and self-directed practice |

### Personality boundaries

Serious means precise, well edited, and respectful of attention. Friendly means understandable language and recoverable errors. Courageous means distinctive composition and an invitation to make decisions. Adventurous means discovery, historical encounters, and branching lines. Competitive means meaningful challenges and evidence of improvement. Romantic means admiration for human creativity, struggle, and the beauty of positions.

Treat warfare as a metaphor already present in chess: attack, defense, initiative, counterplay, sacrifice, resistance. Let those ideas create tension. Literal weapons, military ranks, nationalistic imagery, blood effects, and adversarial teaching would narrow the audience and make the brand harder to inhabit.

Appeal across ages through a shared, legible identity. Offer adjustable assistance, text size, motion, and density. Age does not determine expertise, reading ability, or appetite for competition. A beginner adult and an experienced child should both feel respected.

## 2 What remains familiar and what becomes distinctive

| Keep familiar | Opportunity for distinction |
| --- | --- |
| Square 8 × 8 board with conventional orientation | Strong placement and warm, carefully balanced board palette |
| Recognizable Staunton piece silhouettes | Consistent, refined rendering and original surrounding identity |
| Coordinates, move notation, move history | Better explanations attached to specific moves and ideas |
| Click then click and drag interactions | Graceful keyboard and assistive alternatives |
| Plain labels such as Lessons, Practice, Review | Editorial course titles and memorable lesson introductions |
| Predictable navigation and visible settings | An unusually clear, welcoming start and return experience |
| Standard controls for undo, replay, flip, and hints | Thoughtful timing and explanations for each action |

Lichess's public learning navigation uses direct categories including Chess basics, Practice, Coordinates, and Study. Chess.com's lessons page exposes familiar subject categories, search, level filters, and lesson counts. Preserve that recognizable vocabulary where it fits this product [1, 2].

These references establish functional conventions, not a requirement to copy a site's color, iconography, exact arrangement, or personality. The criticism of Chessable's school-like feeling is a statement of this project's taste and target positioning; it is not presented as an objective audit. Its live homepage was unavailable to this research request, so no current visual claims about it are made.

### Reference translation

| Reference quality | Adopt in our own language | Risk to guard against |
| --- | --- | --- |
| Established chess interfaces | Board fluency and expected actions | A derivative skin without a distinct purpose |
| Tournament coverage | Stakes, players, decisive positions | Broadcasting spectacle inside every exercise |
| Annotated chess books | Human ideas, variations, historical context | Walls of notation before the learner can use them |
| Modern editorial design | Typographic authority and expressive composition | Headlines that sacrifice legibility for atmosphere |
| Public cultural institutions | Dignity and open access | Formality that makes newcomers feel unwelcome |
| Sports training | Practice, feedback, preparation | Pressure, shame, and compulsory competition |

## 3 The central design doctrine

1. **The board is the primary instrument.** Every surrounding element must help someone see, decide, understand, or navigate.
2. **Put drama at meaningful thresholds.** Use it when introducing a course, revealing an important idea, or recognizing demonstrated improvement. Keep repeated study work quiet.
3. **Make hospitality visible.** Show where to begin, explain unfamiliar terms, and offer recovery without embarrassment.
4. **Use real chess to create identity.** Positions, variations, annotated decisions, and human stories should carry more character than decorative chess symbols.
5. **Keep navigation literal.** Use evocative names for learning experiences and plain names for controls and destinations.
6. **Distinguish completion from understanding.** Finishing content, solving with help, and applying an idea independently are different achievements.
7. **Make optional depth easy to open.** A short explanation can expand into a variation, historical note, or deeper analysis.
8. **Make free access tangible.** Let visitors inspect and begin the instruction before requesting an account.
9. **Preserve learner agency.** Recommend a path, explain the recommendation, and allow exploration.
10. **Let usability resolve aesthetic disagreements.** A distinctive treatment that slows recognition should be revised or confined to a less demanding context.

These are ordered priorities. Board clarity and comprehension take precedence over atmosphere. Atmosphere remains essential in the places where it can help people care about the game.

## 4 Visual identity

### Recommended palette

Use warm paper and dark ink as the main identity. The accent is vermilion: an energetic, slightly historical red-orange. This avoids depending on the green palette associated with some familiar chess products while remaining grounded in recognizable materials.

| Token | Light theme | Dark theme | Role |
| --- | --- | --- | --- |
| Canvas | `#F4F1E9` | `#171C22` | Main background |
| Surface | `#FFFDF7` | `#212832` | Lesson and utility panels |
| Text primary | `#202730` | `#F4F1E9` | Main text |
| Text secondary | `#535E68` | `#B7C0CA` | Supporting text |
| Accent | `#A73725` | `#F09A7B` | Primary action and active identity |
| Accent hover | `#862B1D` | `#F7AF96` | Hover state |
| Success | `#24644B` | `#8CCBAA` | Confirmed success plus label or icon |
| Warning | `#80580F` | `#E6C376` | Attention and review plus label or icon |
| Error | `#9D2942` | `#F3A1AE` | Actionable error plus label or icon |
| Focus | `#1559A6` | `#8ABEFF` | Keyboard focus only |
| Decorative divider | `#D8D1C5` | `#3C4651` | Nonessential separation |
| Control boundary | `#7A817E` | `#929CA6` | Boundaries needed to identify controls |

Color values are starting specifications. Arithmetic contrast checks on the proposed tokens give approximately 13.34:1 for light-theme primary text on canvas, 5.87:1 for secondary text on canvas, 6.53:1 for white text on the light-theme accent button, and 7.84:1 for dark text on the dark-theme accent button. Verify every actual foreground/background pairing and composited overlay. These checks do not certify the interface. The decorative divider is deliberately subtle and must not be the sole boundary of an interactive control.

Use the light theme for the first visual concept because it better expresses an open, warm place to learn. In production, respect the operating system preference on first visit and preserve explicit user choice. Both themes must feel intentional. A dark-only interface can make the identity feel closer to a gaming product than a public learning resource.

On an ordinary study screen, neutral tones should dominate almost entirely. Use the accent for one primary action and a few active indicators. This is a compositional guideline rather than a measurable 80/15/5 formula. Board-state colors must keep their instructional meanings even when the brand accent changes.

### Board palette and pieces

Recommended first board: light squares `#E5DDCA`, dark squares `#7C8A78`. Offer a second warm neutral board with light `#E4D9C4`, dark `#95836B`, and an explicit high-contrast preset. These are proposals requiring tests with actual piece assets, monitors, and overlays.

Use a high quality two-dimensional Staunton set with unmistakable king, queen, bishop, knight, rook, and pawn silhouettes. Black pieces need enough silhouette definition against dark squares; white pieces need a contrasting outline or edge against light squares. Test every piece on both square colors at the smallest supported board size. Unicode chess glyphs are suitable for temporary diagrams, not a production piece system whose appearance varies by platform.

Begin with an appropriately licensed existing set. Record the license and attribution requirements. Custom drawing can follow once readability is proven. Avoid perspective, reflective 3D pieces, texture, and light effects in the lesson board.

### Typography

Use **Source Serif 4** for editorial headlines and chapter introductions, **Source Sans 3** for interface and teaching text, and **IBM Plex Mono** for compact move sequences or technical notation where it helps alignment. These are proposed families; verify current licenses and asset delivery before integration. Use system fallbacks, self-host the selected files, and load only the weights needed.

| Role | Desktop starting size | Small-screen starting size | Guidance |
| --- | --- | --- | --- |
| Landing title | 56–72 px | 36–44 px | Serif, short, approximately 1.05–1.15 line height |
| Page title | 32–40 px | 28–32 px | Serif or sans according to page function |
| Lesson title | 24–30 px | 22–26 px | Clear before expressive |
| Teaching text | 18 px | 17–18 px | Approximately 1.5–1.65 line height |
| Interface text | 16 px | 16 px | Avoid making basic controls visually secondary |
| Supporting metadata | 14 px | 14 px | For nonessential details only |
| Moves and coordinates | Context dependent | Context dependent | Legibility at actual board size takes priority |

Use approximately 55–75 characters per line for extended reading. Avoid all-cap paragraphs, condensed body text, and widely spaced move notation. A serif headline creates romance; readable instructional text creates trust. Permit long translated headings to wrap.

### Shape and spacing

Use a 4 px spacing foundation, with 8, 12, 16, 24, 32, 48, 64, and 96 px as common steps. Most interactive panels use a restrained 8–12 px radius. Buttons use about 8 px. The chessboard remains square. Reserve pill shapes for short filters or tags, rather than applying them to the entire interface.

Prefer alignment, whitespace, and typographic hierarchy to enclosing every block in a card. Use shadows only where they communicate elevation, such as a menu or modal. A main lesson page should feel like a considered workspace, not a collection of floating widgets.

### Identity mark and imagery

Explore an original wordmark with one subtle chess-derived detail, such as a deliberate cut or a relationship between two letterforms. Test at favicon size, in one color, and with the wordmark removed. Avoid treating an unmodified stock knight as sufficient differentiation. Naming and trademark clearance are separate work.

Image hierarchy: actual chess positions first, diagrams second, human chess photography third, ornamental atmosphere last. Use archival portraits only with appropriate rights and context. Avoid AI portraits masquerading as historical players or decorative boards with illegal or nonsensical positions.

Illustration can express files, diagonals, pressure, and competing plans. Keep it away from interactive boards unless it is part of an explanation. Fine grain or paper texture, if used at all, belongs in large editorial backgrounds and should disappear in focus mode.

## 5 Information architecture

The website teaches chess. Its navigation should make that purpose obvious.

| Destination | User question | Primary contents |
| --- | --- | --- |
| Home | What should I do now? | New visitor introduction or returning learner dashboard |
| Learn | What can I learn? | Guided curriculum, searchable lessons, prerequisites |
| Practice | Can I use the idea? | Thematic exercises and optional challenges |
| Review | What should I revisit? | Saved mistakes, due practice, retained skills |
| Library | What can I explore? | Annotated games, reference material, deeper studies |

Profile, appearance, accessibility, help, and account settings live in a utility menu. Search remains easy to find. Do not add Play to the primary navigation unless there is a real playable destination with a clear role. External play integrations should be labelled as external.

Suggested lesson URL structure: `/learn/tactics/pins/relative-pins`. URLs and breadcrumbs should remain understandable even if the curriculum recommendation changes.

Make terminology explicit. Learn introduces and explains; Practice applies; Review revisits. If testing shows those destinations overlap confusingly, combine the latter two into Train with clearly labelled subsections. Keep the initial navigation small enough to understand without a product tour.

## 6 Core screens and layouts

### Screen A Public landing page

The first viewport contains the name, four or five clear navigation destinations, a brief free-access statement, one proposition, and one usable chess encounter.

Suggested title: **Every position holds a possibility.**

Supporting sentence: **Learn to see it through clear lessons, challenging positions, and the ideas behind great games. Free for everyone.**

Primary action: **Start learning**. Secondary action: **Explore the lessons**. Put the actions adjacent on wide screens and vertically on small screens. Avoid competing account creation and subscription actions.

The visual focus is a real, curated position with one intelligible question. Choose a position that is visually uncluttered and representative of the teaching. Provide a quiet Skip interaction action. A person who does not know the rules must have an equally obvious entry point. Do not depend on solving the hero to enter the site.

Below the opening: show a sample lesson, explain the learning method with concrete examples, present the curriculum's breadth, and state the access model. Use testimonials only when real and permissioned. Claims such as best, scientifically proven, or better than paid alternatives require evidence; the page should demonstrate quality rather than proclaim it.

### Screen B First visit and placement

Offer three direct routes: **I am new to chess**, **Help me find my level**, and **Let me explore**. A placement exercise is optional, resumable, and brief enough that it does not become a barrier. State its purpose and estimated length before it begins. Do not make rating entry mandatory or equate an external rating directly with course mastery.

Let visitors start a lesson without an account. Explain the limits of local progress saving and give a clear way to keep progress across devices. Ask for an account when that benefit becomes relevant. No date of birth or public identity is needed merely to read or practice.

### Screen C Returning learner home

Lead with one prominent Continue lesson action. Show the exact lesson title and a short description of the next idea. Present a Review action beside or below it, with enough context to explain why review is useful. Follow with an optional challenge and links to explore.

Keep the summary useful: current topic, recent independent success, and a small number of specific skills to revisit. Avoid a dashboard dominated by charts, streaks, and empty achievement slots. A returning user should find the next useful action without first interpreting analytics.

### Screen D Curriculum and course page

Use a readable chapter list as the default curriculum representation. A visual map may be an optional overview, but must have an equivalent list. Let users inspect any lesson. Indicate prerequisites and recommended order without turning the entire curriculum into locked doors.

A course overview includes a clear outcome, expected background, approximate duration, sample position, lesson sequence, and Start or Continue action. Distinguish interactive practice from reading or video. Offer alternate entry points if someone already knows the basics.

Recommended course tile: title, one sentence describing the skill, level or prerequisites, duration, and meaningful progress. Use an actual diagram where it distinguishes the course. Avoid repetitive stock chess artwork, urgency tags, and a store-like grid of promotional covers.

### Screen E Lesson workspace

On wide screens, place the board left or centrally and the teaching panel immediately alongside it. Keep both visible without excessive head turning. Start testing at a 1440 × 900 viewport with a board around 560–640 px and teaching panel around 340–400 px; these are prototype ranges, not fixed production dimensions. Leave breathing room for controls, coordinates, and focus outlines.

The teaching panel contains lesson title, one immediate task, relevant explanation, feedback, and one primary next action. Navigation to other chapters is collapsible. Technical variation trees and engine output are closed until needed. A lesson should not open with a full analysis dashboard.

On tablets, collapse secondary navigation before shrinking the board aggressively. On phones, stack compact context, board, current task, response, and actions. Keep the current task discoverable while interacting, with an expand control for longer explanations. Avoid a large sticky header that steals square size. Never shrink body text merely to force everything into one viewport.

At 390 px width with 16 px side margins, a 358 px board produces squares around 44.75 px. At 320 px width the available square is smaller; preserve full-board visibility and comfortable surrounding controls. Actual layouts must account for borders and coordinate gutters. Do not advertise a universal 44 px square guarantee.

Responsive transitions should occur when content no longer fits, rather than at arbitrary device labels. Test the narrowest supported width, short laptop screens, landscape phones, browser zoom, and enlarged text.

### Screen F Lesson completion

Show the idea learned and one example of demonstrated understanding. Offer a short application or next lesson. State honestly whether completion involved hints or revealed solutions. A calm closing sentence can provide satisfaction: **You found the defender before choosing the attack.**

Offer **Continue**, **Practice this idea**, and **Save a note** with one visually primary action. Do not require a social share or rating prompt to proceed.

### Screen G Review and independent study

Review should explain what is due and why, let people choose a short session, and reopen the original explanation when needed. Mistakes belong to the learner's private workspace by default. Add a notebook linked to positions and moves.

Advanced learners can choose topic, source material, difficulty, review cadence, and practice goals. Teach them how to inspect their own errors and decide what to study next. As expertise grows, the interface should reveal deeper control without changing its basic vocabulary.

## 7 Board interaction specification

### Required conventions

Keep White at the bottom by default; provide an explicit flip action and preserve deliberate user choice. Show whose turn it is in text. Use notation and coordinates consistently. Provide tap or click selection as well as drag. Support promotion with a labelled piece picker. Illegal moves must leave the position intact and explain the rule when appropriate.

Selection, legal destinations, last move, check, suggested move, and keyboard focus are separate states with separate visual treatments. Keep legal destination markers optional. Color must not be their sole distinguishing cue. Do not allow several competing arrow systems to accumulate unchecked.

Use a labelled toolbar for Back, Forward, Restart position, Flip board, and Settings. Disable unavailable actions with a reason where needed. A course can temporarily restrict undo for an assessment, but explain that rule before the assessment and offer untimed learning outside it. Premove is off for lessons unless specifically teaching a timed activity.

### Feedback model

| Input outcome | System behavior | Learner-facing explanation |
| --- | --- | --- |
| Illegal move | Restore or retain original state | Explain the relevant rule, not a generic failure |
| Legal but misses the objective | Demonstrate the relevant reply when useful | State what the move allows and what to inspect next |
| Strong alternative | Acknowledge or offer a supported branch | Explain its merits and relation to the lesson |
| Plausible unhandled alternative | Do not falsely declare it bad | Say the lesson covers a different continuation; allow return or analysis |
| Intended move | Show the idea and appropriate response | Explain why the decision works |
| Input or network failure | Preserve work and provide retry | Separate technical failure from chess feedback |

When a narrow exercise requires a specific pattern, say so in the task: Find a move that wins the queen with a discovered attack. Avoid marking any other winning move as a chess mistake. Authored coverage, engine validation, and explanation quality are content and engineering responsibilities; the UI must expose their limits honestly.

### Hint ladder

Use a consistent progression: a conceptual cue, attention to a region or relationship, candidate guidance, then the move and explanation. Label help levels clearly. Allow Try again after the reveal. Treat solving with help as useful practice without presenting it as independent mastery.

### Keyboard and assistive interaction

Provide documented square navigation with arrow keys, a selection action, an Escape action, and a move-entry alternative such as algebraic notation or source/destination fields. Use a roving focus model so the board does not create 64 stops in the page's ordinary Tab order. Let users enter and exit it predictably.

Expose piece identity, square, side to move, selection, move result, and relevant feedback to assistive technology. Announce a useful summary rather than re-reading the entire board after every move. Offer a textual position representation and move list. Test with screen reader users; adding labels alone does not establish accessibility.

## 8 Instructional drama and competitive energy

Create excitement through the decision itself. Begin a chapter with an intriguing position, reveal the opponent's threat, and let the learner choose a response before presenting a full explanation. A variation can unfold like a short story: intention, resistance, turning point, consequence.

Use historical episodes to show actual human stakes, with accurate attribution. Include resilient defense, elegant simplification, quiet preparation, and endgame resourcefulness alongside sacrifices. If every lesson depicts an attack on the king, the brand will misrepresent chess and undervalue other styles.

Pair an evocative title with a literal description. **The king has nowhere to run** can introduce **Recognizing mating nets**. **Hold the position** can introduce **Finding defensive resources**. The literal description remains available in search, navigation, and lesson metadata.

Competition is an optional layer: personal bests, recurring challenges, themed events, or opt-in comparisons. Keep untimed practice and private progress fully available. No shame for absence, no depleted lives, no permanent beginner labels, and no claims that fast input means deep understanding. Timed activities measure something different from careful calculation; label them accordingly.

## 9 Writing and feedback voice

Speak like a capable coach who takes the student seriously. Use concise, concrete sentences tied to the position. Explain terms in context. Allow curiosity and occasional warmth without turning every move into a celebration.

| Situation | Recommended copy | Avoid |
| --- | --- | --- |
| First visit | Start with the rules, or find a challenge at your level | Become a chess god |
| Task | Black threatens your rook. Find a move that also attacks the king | Crush the enemy now |
| Wrong idea | This wins a pawn, but leaves your queen undefended. What is Black's strongest reply? | Wrong. Try harder |
| Correct idea | Yes. The rook cannot move without exposing the king | Genius! Legendary move! |
| Hint | Look for a piece defending two targets | The answer is obvious |
| Review | Revisit mating nets while the pattern is still fresh | Your skills are decaying |
| Return | Continue with knight forks | You broke your streak |
| Account prompt | Create an account to keep your progress across devices | Unlock your true potential |
| Technical error | Your move is saved. Reconnect to continue | Something went wrong |

Use familiar chess terms in chess contexts, but keep menus understandable before someone learns the terminology. Avoid predicting a rating increase or a learning speed without evidence. If an AI tutor is added, distinguish generated guidance from verified lesson content and provide correction paths for errors.

## 10 Components and complete state coverage

| Component | Essential content | Important states |
| --- | --- | --- |
| Primary button | Specific action label | Default, hover, focus, pressed, pending, disabled |
| Lesson item | Title, skill, duration, progress | Available, active, completed, recommended, prerequisite note |
| Board | Position, turn, input affordance | Ready, selected, moving, promotion, response, failure |
| Explanation panel | Objective, text, optional variation | Reading, asking, hint, feedback, expanded depth |
| Move list | Current position and navigable moves | Current move, side branch, keyboard focus |
| Progress indicator | What has been observed | Started, completed, with help, independent evidence, review due |
| Search | Query and filters | Initial, typing, results, no results, error |
| Review queue | Topic and reason to revisit | Ready, postponed, empty, unavailable |
| Account flow | Purpose and required fields | Guest, pending, success, validation error, expired session |

Use a consistent icon family and a text label for unfamiliar actions. Tooltips supplement controls; they do not replace names available to touch or keyboard users. Preserve focus and scroll position when content changes. Pending buttons should communicate work in progress without jumping in width.

Empty states teach one next action. For example: **Your saved positions will appear here. Save a position from any lesson to return to it.** Error states explain the specific recovery. Distinguish an empty library from a failed request and a lesson without an illustration from a loading image.

## 11 Motion and sound

Use brief transitions to show continuity: around 120–180 ms for small interface state changes and 150–250 ms for ordinary piece movement as initial prototype values. Sequential instructional moves should be step-controlled or pausable. Important explanations remain until dismissed or advanced.

Avoid autoplay hero video, parallax, particle effects, shaking error states, dramatic camera movement, and mandatory celebration sequences. Offer a reduced-motion treatment and an immediate movement option. Do not move content away from a pointer or keyboard user during interaction.

Sound is optional and off initially for teaching narration or ambient sound. If familiar move sounds are provided, expose a clear mute control and persist the choice. Correctness cannot depend on hearing a sound. Never autoplay music to manufacture atmosphere.

## 12 Accessibility and inclusive use

Target WCAG 2.2 AA and include manual chess-specific testing [3]. Use at least 4.5:1 contrast for ordinary text and 3:1 for qualifying large text. Required non-text controls and indicators need appropriate 3:1 contrast under the applicable criterion. Check overlays in their composited state.

Provide keyboard operation, visible focus, meaningful names, logical headings, a skip link, predictable reading order, and no keyboard traps. Focus must not be obscured by sticky content. Support text enlargement and narrow-screen reflow; a chessboard has a spatial purpose, but surrounding instruction still needs to reflow.

Use a 44 × 44 CSS px comfort target for ordinary controls where feasible. WCAG 2.2 AA's target-size criterion is 24 × 24 CSS px with specified exceptions; do not misstate the larger product preference as the AA minimum. Supply an alternative to dragging. Let users adjust or bypass time limits where required. Provide captions and transcripts for teaching media.

Offer high contrast and multiple board palettes, readable text size controls, reduced motion, and a clear focus mode. Do not communicate success, check, progress, or errors by color alone. Test color-vision differences, pieces on both square colors, sunlight on mobile screens, low-quality displays, and screen reader workflows.

Localize whole phrases, support longer labels, and plan RTL page layout independently of chessboard orientation. A translated interface should not silently reverse the board. Use culturally broad imagery and avoid equating chess strength with intelligence or personal worth.

Do not promise equal appeal to every age. Test with different age groups and different skill levels, including young learners, adults beginning chess, and older learners. Accessibility preferences should remain individual rather than being hidden behind an age category.

## 13 Free access and trust

Make the full educational offer clear. Do not use lock icons as course decoration if lessons are free. Explain optional accounts, data storage, and any donation or funding model in plain language. Keep donation requests away from moments of failure or interrupted concentration.

Offer public lesson links and permit exploration without registration. Preserve guest progress locally where possible and explain that clearing storage or switching devices can lose it. Provide an account path for cross-device persistence and reasonable export options for notes and saved positions.

Collect only the information required for the feature. Keep progress private by default. If public profiles, chat, or leaderboards are added, design privacy, moderation, and age-appropriate participation before release; applicable requirements depend on the actual audience and jurisdictions. These features are optional and should not delay a good learning experience.

## 14 Implementation contract

Use semantic HTML and shared design tokens. Separate brand appearance, board-state colors, content, and learning logic so each can evolve without rewriting the others. Components must consume theme tokens rather than scattering literal hex values throughout screens.

Initial CSS token example:

```css
:root {
  color-scheme: light;
  --canvas: #f4f1e9;
  --surface: #fffdf7;
  --text: #202730;
  --text-secondary: #535e68;
  --accent: #a73725;
  --accent-hover: #862b1d;
  --on-accent: #ffffff;
  --focus: #1559a6;
  --control-boundary: #7a817e;
  --divider: #d8d1c5;
  --board-light: #e5ddca;
  --board-dark: #7c8a78;
  --radius-control: 8px;
  --radius-panel: 12px;
  --space-unit: 4px;
  --font-ui: 'Source Sans 3', system-ui, sans-serif;
  --font-editorial: 'Source Serif 4', Georgia, serif;
  --font-moves: 'IBM Plex Mono', ui-monospace, monospace;
}

[data-theme='dark'] {
  color-scheme: dark;
  --canvas: #171c22;
  --surface: #212832;
  --text: #f4f1e9;
  --text-secondary: #b7c0ca;
  --accent: #f09a7b;
  --accent-hover: #f7af96;
  --on-accent: #171c22;
  --focus: #8abeff;
  --control-boundary: #929ca6;
  --divider: #3c4651;
}
```

This snippet defines the visual foundation, not complete component styles or an accessibility certification. Add explicit semantic tokens for selection, last move, check, hints, feedback, and chart series only after testing them on both board palettes. Respect operating-system theme preference in the initialization layer unless a saved preference overrides it.

Each lesson should provide structured fields: stable identifier, title, outcome, prerequisites, estimated effort, position data, task, accepted continuations, feedback, hint levels, explanation, optional deeper material, source attribution, and version. Define which fields are authored and which are generated. Keep a position and explanation synchronized when content is edited.

Preserve work before navigating away. Restore the current lesson state after reload when technically possible. Use semantic loading states and reserve layout space so a late font or diagram does not move a control. Load expensive engines and optional media only when needed. Initial product performance targets can include a usable lesson within about 2.5 seconds on a representative midrange phone and connection, with immediate local move feedback. Define the test device and conditions before calling that target achieved.

The first implementation does not require a custom chess engine, a social network, a complete visual curriculum map, or a bespoke piece set. Invest first in the lesson experience and verified content.

## 15 Validation plan

### Round one Direction and recognition

Create three comparable visual treatments using the same position, lesson text, and controls: the recommended warm editorial version, a darker tournament variation, and a more restrained modern club variation. Keep the board recognizable in all three. Compare coherent alternatives rather than changing color alone.

Ask people what the site appears to offer, where they would begin, whether it feels welcoming, and what feels distinctive. Collect unaided impressions before showing words such as dramatic or friendly. Include people who use existing chess sites and people who have never used one. Do not select only the most stylish concept if it obscures the task.

### Round two Usability

Run small, iterative sessions across age and skill groups. Five or six participants per round can reveal practical problems, but cannot prove universal preference or learning efficacy. Include keyboard and screen reader users in dedicated sessions.

Tasks: begin without an account; choose an appropriate lesson; make a move; recover from a mistake; request a hint; replay a variation; find a definition; resume later; change board appearance; locate the next useful action. Observe hesitation and mistaken assumptions before asking for opinions.

Initial targets, to refine after a baseline: at least 80 percent complete core navigation tasks without help; most identify the first learning action within roughly ten seconds; no critical loss-of-progress or keyboard-blocking issue. These are proposed acceptance targets, not established industry facts or statistically strong claims from a small sample.

### Round three Learning and emotional fit

Check whether learners can explain the idea and solve a different position later. Track delayed transfer, hint use, and recurring misconceptions rather than celebrating page views or raw completion alone. Compare instructional alternatives under reasonably similar conditions before making superiority claims.

Ask whether the site feels serious, welcoming, exciting, clear, childish, or intimidating. Preserve room for open feedback. Segment by skill and age without assuming one explains the other. Investigate a dramatic screen that attracts people but makes them less willing to try.

### Release review

Verify both themes, board presets, required contrast pairings, zoom and reflow, keyboard navigation, screen reader use, reduced motion, touch input, long text, slow connections, empty states, error recovery, session expiry, and lesson state restoration. Validate every displayed position and accepted continuation. Confirm licenses and historical attributions.

## 16 Build sequence and handoff

| Phase | Concrete output | Decision before proceeding |
| --- | --- | --- |
| 1 Identity study | Palette, typography, piece trials, three comparable screen treatments | Does it feel distinctive while remaining clear? |
| 2 Core flow | Landing, first visit, course, lesson, completion, return layouts | Can someone start and continue without guidance? |
| 3 Interactive slice | One complete lesson with branching feedback and review | Does the experience teach a transferable idea? |
| 4 System coverage | Component states, two themes, mobile, keyboard and assistive support | Is the system consistent under real conditions? |
| 5 Content expansion | Representative beginner, intermediate, and advanced units | Does the design scale across material and expertise? |
| 6 Refinement | Usability fixes and measured learning improvements | Is the evidence strong enough for the claims being made? |

The designer's handoff includes editable screen files, component states, responsive behavior, typography assets, color pairings, spacing, icon sources, and piece licenses. The developer's handoff includes tokens, interaction rules, lesson data contracts, accessibility behavior, error recovery, and performance test conditions. The editor's handoff includes voice rules, terminology, feedback patterns, attribution standards, and chess validation responsibilities.

Keep a short decision log. Record the problem, alternatives, rationale, and evidence so later changes do not slowly turn the identity into a generic collection of popular UI trends.

## 17 Design review rubric

Use this rubric during critique. It is a conversation aid, not a scientific scoring instrument.

| Dimension | Weight | Review question |
| --- | --- | --- |
| Board and learning clarity | 25 | Can I see the position, understand the task, and act? |
| Familiarity and navigation | 20 | Do expected chess interactions and destinations make sense? |
| Warmth and inclusion | 15 | Can I begin and make mistakes without feeling judged? |
| Distinctive character | 15 | Would this still be recognizable with the logo removed? |
| Drama and competitive energy | 15 | Does the game feel worth engaging with? |
| Consistency and restraint | 10 | Does every treatment have a role and behave predictably? |

Accessibility failures, incorrect chess, lost work, and misleading learning claims are release blockers regardless of the weighted score. A strong average cannot compensate for them.

## 18 The concept in one screen

Imagine a warm ivory page with a small, confident wordmark and simple navigation. A large serif sentence introduces a position. The board is square, recognizable, and beautifully readable. One restrained vermilion button invites you to begin. A short line makes the promise clear: free lessons, available to everyone.

Inside the lesson, the headline becomes quieter. The board grows in importance. A calm coach asks a precise question, shows the consequence of your choice, and helps you understand the idea. The sense of occasion comes from discovering something in the position. Afterward, you know what you learned, what you can try next, and where to return.

That combination is the identity: an ambitious public place to learn a demanding and beautiful game.

## Sources and scope

Sources checked 25 October 2026. Product references support functional observations only; this document is not a comprehensive visual audit. Palette, typography, screen dimensions, performance budgets, and testing thresholds are proposed design decisions requiring validation.

1. Lichess. Learn chess by playing. https://lichess.org/learn — public learning navigation and familiar chess destinations.
2. Chess.com. Chess Lessons. https://www.chess.com/lessons — subject categories, search, filters, lesson descriptions, and counts. Current help documentation also describes guided learning and interactive challenges: https://support.chess.com/en/articles/8609703-how-do-lessons-work-on-chess-com
3. W3C Web Accessibility Initiative. How to Meet WCAG 2.2. https://www.w3.org/WAI/WCAG22/quickref/ and the normative standard https://www.w3.org/TR/WCAG22/ — accessibility criteria. Target-size guidance: https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html. Implementation must check applicable criteria and exceptions rather than treating this document as a substitute for the standard.
