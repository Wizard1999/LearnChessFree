# Art slots (draft 1, 8 Nov 2026)

Companion to `docs/art-direction.md`. Priority A = first batch, B = next, C = optional and only if the Courses view still wants it. Core path: no art (see direction, section 2). Strand colours are the app's existing eleven (`palette.css`); here a hue is named, never a hex.

Sizes: card 960x640, banner 1600x686, emblem 512x512 (limits in the direction doc, section 9). Alt text is a draft; finalise with the image.

## A. Course covers (card + banner), register in brackets
| Slot id | Course | Register | Idea and subject | Dominant / accent | Draft alt |
|---|---|---|---|---|---|
| `course-opening-deep-dives` | Opening deep dives (77 lessons, 21 series) | Landscape | A crossroads of many roads leaving a walled town at dawn, each road ending at a banner | cobalt / gold | A walled town at dawn with many roads leading to banners. |
| `course-famous-games` | Famous games, annotated (19 games) | Archive plate | A study table by a window: a board mid-game, a lamp, a pocket watch, a folded map | ink / gold | A study table with a chess game in progress, a lamp and a pocket watch. |
| `course-history-and-meta` | History and the modern game | Archive plate | A long library gallery receding to a window; an old clock and a glowing modern lantern side by side | persimmon / ivory | A long library gallery with an old clock and a modern lantern. |
| `course-playstyles` | Playstyles, measured | Pavilion | Four pavilions around a still pond, each a different build, reflections on the water | jade / gold | Four timber pavilions around a still pond. |
| `course-stage-checks` | Stage checks | Landscape | A mountain pass with a watchtower and a lit beacon at the summit | ink / persimmon | A mountain pass with a watchtower and a lit beacon. |

## A. Opening-series emblems (heraldry, 512 square; first nine, ranked by learner interest)
| Slot id | Series (lessons) | Emblem | Dominant / accent | Draft alt |
|---|---|---|---|---|
| `od-alien` | Alien Gambit (8) | A single star-shaped comet over a plain shield, slightly mischievous | cobalt / gold | A shield with a comet. |
| `od-martian` | Martian Gambit (5) | A red moon over a mountain ridge on a shield | persimmon / ivory | A shield with a red moon above a ridge. |
| `od-elephant` | Elephant Gambit (3) | A stone elephant in profile on a banner | jade / gold | A banner with a carved elephant. |
| `od-dragon` | Sicilian Dragon (9) | A coiled dragon along a diagonal on a shield | persimmon / gold | A shield with a coiled dragon. |
| `od-najdorf` | Najdorf (8) | A sunburst over a crossed key and quill | gold / ink | A shield with a sunburst and a key. |
| `od-italian` | Italian Game (8) | A bishop-shaped tower beside a calm sea | cobalt / ivory | A shield with a tower beside the sea. |
| `od-ruylopez` | Ruy Lopez (8) | A cathedral window and a crown | ink / gold | A shield with a cathedral window and a crown. |
| `od-qgd` | Queen's Gambit Declined (8) | A queen's crown over a closed gate | jade / ivory | A shield with a crown over a gate. |
| `od-kid` | King's Indian Defence (8) | A king's crown atop a rising wave | cobalt / persimmon | A shield with a crown over a wave. |

## B. Opening-series emblems, the single-lesson series (one shared family look; do these as a set)
`od-benoni`, `od-caro-kann`, `od-catalan`, `od-dutch`, `od-english`, `od-french`, `od-grunfeld`, `od-london`, `od-nimzo`, `od-pirc`, `od-scandinavian`, `od-slav` (12 emblems). Idea: an emblem per name (a windmill for Dutch, a lily for French, a bridge for London, a rose for English, and so on), same shield, same frame; only the emblem changes. Alt text is written per emblem.

## B. Completion moment
| Slot id | Where | Register | Idea |
|---|---|---|---|
| `done-course` | Course finished (card and print certificate) | Landscape | A small banner raised on a summit, evening light; one image reused for every course, tinted by the course's strand colour |
| `empty-courses` | Courses view with nothing started | Landscape | A map table with an unrolled chart and a lantern, an invitation, not a task |
| `empty-library` | Library nothing selected | Archive plate | An open shelf and a ladder |

## C. Optional, only if the Courses and Map still want them
- **Strand banners** (ten, one per S1 to S10 name): Rules and board vision, Safety and the thinking loop, Tactics, Calculation, Positional play and planning, Attack/sacrifice/defense, Endgames, Openings and structures, Game study, Practical performance. Landscape register, each in its own strand colour; shown only in the Courses view, never on the core path.
- **Famous-game plates** (19, one per game; Archive plate, e.g. Opera Game = an opera house box seat; Immortal Game = a candlelit table; Fischer-Spassky = a quiet hall). No portraits.
- **Stage emblems** S0 to S7: skip unless a use appears.

## Counts
A: 5 course covers + 9 emblems = 14. B: 12 emblems + 3 = 15. C: up to 10 + 19 + 8 = 37 (only if wanted). Budget: the first 29 images at about 45 KB is about 1.3 MB.

## Per-slot data (to record in `library/art/REGISTRY.md` and the app's art table)
slot id, register, file, width/height, bytes, dominant tint, alt text, tool and version, date, who generated it, prompt, terms link, reviewer ("Andrew" until another is named). A slot with no file renders the tinted fallback card, so the app is complete at zero art.
