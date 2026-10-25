# Inference 01: how hard is each tactical theme, empirically?

2026-10-24. Data: Lichess puzzle database (CC0 [V: licence on the database page]), 6,157,341 puzzles. Script: `tools/analysis/puzzle_themes.py` (28 s). Raw output: `library/inferences/puzzle_themes.json`. Labels: **[V]** computed here from the data; **[J]** my interpretation; **[R]** recalled, unverified.

## What was measured

For each puzzle theme, the distribution of the puzzle's **Glicko-2 rating on Lichess's puzzle scale** (each attempt is a rated "game" between solver and puzzle). I kept only well-measured puzzles: rating deviation ≤ 90 and at least 100 plays, leaving **4,070,644** puzzles [V]. Overall: 10th percentile 919, 25th 1133, **median 1453**, 75th 1823, 90th 2134 [V].

## What this number means, and does not mean

- It is the **difficulty of a puzzle** for the people who attempt it on Lichess, not a playing rating and not "the Elo of a concept." [J]
- Puzzles are a selected sample of positions where a tactic exists, so they say nothing about how well people notice tactics when none is promised. [J]
- A puzzle usually has several themes and a varying solution length, so a theme's difficulty is confounded with how long and how complicated its puzzles tend to be. The next analysis should hold solution length fixed. [J]
- Lichess's puzzle rating scale is not the same as its game-rating scale or any other site's. [V: Lichess says ratings cannot be compared across pools]

## Selected results [V]

| Theme (Lichess tag) | Our node | n (well-measured) | p25 | **median** | p75 |
|---|---|---|---|---|---|
| mateIn1 | `FND.MATE1` | 476,081 | 810 | **978** | 1186 |
| backRankMate | `TAC.BACKRANK` | 80,146 | 776 | **992** | 1188 |
| mateIn2 | mating patterns | 511,118 | 980 | **1175** | 1444 |
| skewer | `TAC.SKEWER` | 95,054 | 1085 | **1342** | 1683 |
| fork | `TAC.FORK` | 550,839 | 1090 | **1363** | 1701 |
| mateIn3 | mating patterns | 152,676 | 1136 | **1381** | 1686 |
| hangingPiece | `SAF.LOOSE` / `TAC.*` | 141,825 | 1100 | **1437** | 1802 |
| rookEndgame | `END.*` | 204,697 | 1129 | **1444** | 1859 |
| discoveredAttack | `TAC.DISCOVER` | 231,060 | 1172 | **1455** | 1800 |
| deflection | `TAC.DEFLECT` | 199,826 | 1212 | **1503** | 1855 |
| capturingDefender | `TAC.REMOVE-DEFENDER` | 32,502 | 1339 | **1561** | 1834 |
| pin | `TAC.PIN` | 270,397 | 1289 | **1576** | 1913 |
| doubleCheck | `TAC.DOUBLE-CHECK` | 25,771 | 1290 | **1613** | 1937 |
| attraction | `TAC.DECOY` | 175,368 | 1391 | **1625** | 1931 |
| sacrifice | `SAC.TYPES` | 334,711 | 1340 | **1633** | 1959 |
| intermezzo | `TAC.ZWISCHENZUG` | 54,804 | 1395 | **1635** | 1934 |
| trappedPiece | `TAC.TRAPPED` | 53,122 | 1436 | **1642** | 1897 |
| clearance | `TAC.CLEARANCE` | 54,820 | 1419 | **1741** | 2068 |
| pawnEndgame | `END.*` | 147,032 | 1368 | **1768** | 2122 |
| zugzwang | `END.*` / `POS.*` | 41,788 | 1478 | **1880** | 2153 |
| defensiveMove | `DEF.RESOURCES` | 224,037 | 1558 | **1907** | 2177 |
| quietMove | `TAC.QUIET-MOVE` | 142,555 | 1635 | **1964** | 2235 |

## What this tells us **[J]**

1. **The order of difficulty roughly matches the teaching order we proposed**: one-move mates, then forks and skewers, then discovered attacks and deflection, then pins, decoys and combinations with quiet moves.
2. **Pins sit well above forks and skewers** (median ~1576 vs ~1363). If that holds with solution length controlled, it argues for teaching pins with more care and later practice than forks, which the plan already does (forks in session 5; pins later with absolute vs relative contrast).
3. **Quiet and defensive moves are among the hardest puzzle types** (medians ~1964 and ~1907, versus ~978 for one-move mates). That is what the council argued: forcing tactics are what puzzle sites train, while quiet and defensive decisions are harder and under-trained. It supports building `TAC.NONE`, `TAC.QUIET-MOVE` and `DEF.*` early, and making them cue-level-3 items.
4. **The distributions are wide.** Fork puzzles span roughly 1090–1700 between the 25th and 75th percentile. A concept does not have a single difficulty; **items** do. That supports the item-level rating decision (D8).

## How we use it

- These medians become **G1 priors** (evidence grade 1) for the matching nodes' item-difficulty starting values on the Lichess scale. They are priors, to be replaced by our own learners' data.
- We do **not** claim "forks are a 1363 skill." The product would show "typical Lichess puzzles with this theme are mid-range (middle half 1090–1701)" or nothing at all.
- It also gives us a lawful corpus: millions of CC0 positions with themes, difficulty and solutions, which our validator can re-check by engine before use (Chesscademy's tactics failed on exactly this).

## Next inferences (not done)

1. Control for solution length and number of themes; fit a simple model of difficulty ≈ theme + length.
2. From a CC0 games sample, estimate how often players at each rating leave a piece hanging or miss a one-move tactic: a skill-vs-rating curve from games, not puzzles.
3. Compare puzzle-scale difficulty with an engine-based "obviousness" measure (how many candidate moves look reasonable) for the quiet-move cases.
