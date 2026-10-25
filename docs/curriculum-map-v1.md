# Curriculum map v1: strands, ladders, and the source-to-node table

2026-10-24. This is the *result* of `council-synthesis.md` (decisions CD-1…CD-16). It is a **map**, not a lesson list: every node below still needs its own synthesis sheet, verified items, and review before it is published. IDs are proposed and may be refined during node enumeration; once published, IDs are never reused. All tiers and rating positions are **G0** (expert estimate), not calibrated.
Source tags as in the Council document: **[V]** verified here, **[S]** secondary, **[R]** recalled from the work and to be re-verified at its synthesis sheet, **[I]** my inference.

## 1. The shape

- **Tiers 0–7** are a *view* of when a node's unlabeled use (depth D2) becomes part of the recommended route. Depths: D0 idea · D1 cued · D2 unlabeled · D3 under calculation and counterexamples · D4 in play · D5 teach/repair/research.
- **Eleven strands**, with the Thinking Loop (S2) as their spine:

| # | Strand | One-line purpose |
|---|---|---|
| S1 | Rules and board vision | Legal play and seeing the board |
| S2 | Safety and the Thinking Loop | A single, versioned process for deciding |
| S3 | Tactics | Patterns, combinations, and knowing when none exist |
| S4 | Calculation | Candidate search, visualization, depth allocation |
| S5 | Positional play and planning | Pieces, structure, imbalances, prophylaxis |
| S6 | Attack, sacrifice and defense | Conditions, initiative, resourcefulness |
| S7 | Endgames | Spine from Tier 1; technique and theory |
| S8 | Openings and structures | Principles to preparation |
| S9 | Game study and own-game analysis | Master games; your own evidence |
| S10 | Practical performance | Clocks, nerves, load, competition |
| S11 | Self-direction | Observe → explain → diagnose → plan → experiment → lead |

- **Tier gloss** (what a learner at the *end* of each tier can do, with no cue):
  T0 plays a legal game · T1 doesn't hang pieces, mates simply, plays sensible short games · T2 sees basic tactics and develops sensibly · T3 holds a plan through a game, short calculation, simple pawn endings · T4 compares resulting positions, uses structures and imbalances, practical rook endings · T5 allocates calculation depth, prophylaxis, transitions, repertoire upkeep · T6 rigorous best-defence calculation, independent analysis projects · T7 original research and preparation. *No tier implies a rating.*

## 2. The strand ladders (node → tier → sources)

### S1 Rules and board vision
`FND.BOARD` squares and notation (T0) · `FND.PIECE.*` six movers (T0) · `FND.ATTACK` attacked/defended squares (T0–1) · `FND.CHECK` check, escapes, mate, stalemate (T0–1) · `FND.SPECIAL` castling, en passant, promotion, draws (T0–1) · `FND.NOTATION` reading and recording games (T1) · `FND.VISUAL` board-blind visualization (T3+, feeds S4).
*Sources:* Lichess Learn structure [V]; Chesscademy's *Getting Started* path [V]; Chess Steps step 1 [R/S]; Capablanca for explanation economy [R].

### S2 Safety and the Thinking Loop (spine)
`SAF.LOOSE` loose and defended pieces (T1) · `SAF.THREAT` what did their last move threaten? (T1, D2 with no-threat items) · `LOOP.V1` safety scan (T1) → `LOOP.V2` checks/captures/threats (T2) → `LOOP.V3` candidates and short lines (T3) → `LOOP.V4` compare resulting positions (T4) → `LOOP.V5` depth allocation, best-defence checking (T5) → `LOOP.V6` elimination and verification (T6).
*Sources:* Heisman, Kotov, Aagaard, Dvoretsky, Ramesh, Silman, Rowson [R/S]; Chesscademy's "The Two Kinds of Blunders", "Poorly Protected Pieces", "Visualizing Pieces" lessons [V: titles].

### S3 Tactics
T1–2: `TAC.FORK`, `TAC.PIN`, `TAC.SKEWER`, `TAC.DISCOVER`, `TAC.DOUBLE-CHECK`. T2–3: `TAC.REMOVE-DEFENDER`, `TAC.DEFLECT`, `TAC.DECOY`, `TAC.OVERLOAD`, `TAC.TRAPPED`, `TAC.BACKRANK`, `TAC.MATE-PATTERNS` (family of named patterns). T3–4: `TAC.ZWISCHENZUG`, `TAC.XRAY`, `TAC.INTERFERE`, `TAC.CLEARANCE`, `TAC.DESPERADO`, `TAC.PERPETUAL`, `TAC.STALEMATE-TRICK`. T4–5: `TAC.COMBO` multi-motif combinations, `TAC.QUIET-MOVE`, `TAC.UNDERPROMOTE`. Each exists at D1→D3; `TAC.NONE` ("is there a tactic at all?") runs through every tier. Two tracks: **fluency sets** and **transfer sets** (CD-2).
*Sources:* Polgár's 5334 [R]; Woodpecker (cycle structure [V, secondary]); Steps [R/S]; Chernev, *Most Instructive Games* [R]; Chess School / Manual of Chess Combinations (series and level claims disagree among sources, 900–1500 range [S]); Lichess Practice lists the named themes [V]; Chesscademy "Introduction to Tactics" 1–2 [V]; Detection Workbook for `TAC.NONE` [S]; Bilalić for the "familiar answer is not best" items [V].

### S4 Calculation
`CAL.VISUALIZE` (T3) · `CAL.CANDIDATES` list and prune (T3) · `CAL.TREE` analyse each branch once (T3–4) · `CAL.COMPARE` evaluate resulting positions (T4) · `CAL.DEFENSE` the opponent's best resource (T4–5) · `CAL.DEPTH` how deep, when to stop (T5) · `CAL.BLIND` variation entry without moving pieces (T5–6) · `CAL.ENDURANCE` long lines, accuracy under fatigue (T6–7).
*Sources:* Kotov, Aagaard, Ramesh, Dvoretsky [R/S]; Rowson (thinking inertia) [R]; Heisman [R].

### S5 Positional play and planning
T2: `POS.ACTIVITY` (piece activity), `POS.OPENFILE`, `POS.SEVENTH`, `POS.CONNECT` (connect rooks). T3: `POS.GOODBAD` (good/bad pieces), `POS.WEAKSQ` (weak squares), `POS.OUTPOST`, `POS.BISHOPS` (bishop pair), `POS.PAWNWEAK` (isolated, doubled, backward), `POS.PASSED` (create/support/stop a passed pawn), `POS.EXCHANGE` (which trades help). T4: `POS.IMBALANCES` (Silman checklist), `POS.SPACE`, `POS.BREAKS` (pawn breaks), `POS.STRUCTURE.*` families. T5: `POS.PROPHYLAXIS`, `POS.TRANSFORM` (favourable transformations), `POS.TWOWEAK`. T6: `POS.EXCEPTIONS` (when the rule fails), `POS.DYNAMIC`. Every node is a **contrast family** (CD-4).
*Sources:* Nimzowitsch (prophylaxis, blockade, over-protection) [R]; Silman (imbalances) [R]; Stean (simple strategic ideas) [R]; Watson (exceptions) [R]; Flores Rios (structures) [R]; Soltis (pawn structures) [R]; Dvoretsky (manoeuvring, prophylaxis) [R]; Yusupov positional chapters [V, secondary]; Chesscademy's *Basic Planning and Awareness* ("What is a plan?", "Optimizing Your Pieces", "Creating a Threat") and *Advanced Strategy* (imbalances, prophylaxis) [V: titles and blurbs]. *Memory check:* the specific items you recalled (castle early, bishop pair, connecting rooks, open files, passed pawns) map here and to S6/S8; I could not verify their Chesscademy lesson text.

### S6 Attack, sacrifice and defense
T2–3: `ATK.CENTER` king in the centre (T3), `ATK.CASTLED` attacking the castled king (T3–4), `ATK.GREEKGIFT` (T4, conditions-based), `ATK.PAWNSTORM` opposite-side attacks (T4). `DEF.RESOURCES` (T4), `DEF.COUNTER` counterattack and counter-sacrifice (T4–5), `DEF.TRADES` defensive exchanges (T5), `DEF.FORTRESS` (T6). `INI.INITIATIVE` (T5), `INI.COMPENSATION` (T6), `SAC.TYPES` sacrifice families (T4–6, "sound vs practical" labelled).
*Sources:* Vuković, Spielmann [R]; Tal's books, Alekhine, Kasparov (games) [R]; Dvoretsky, Aagaard (defence/resources) [R]; Chesscademy's *Attack and Defense* path: The King in the Center, Attacking the Castled King, Accepting/Sacrificing Material, Counterattack [V: titles]; Lichess Practice (Greek gift etc.) [V: list].

### S7 Endgames
T0–1: `END.MATE-KQ`, `END.MATE-KR`, `END.PAWN-RACE`. T2–3: `END.OPPOSITION`, `END.KEYSQ`, `END.SQUARE`, `END.OUTSIDE-PASSER`, `END.KPK`. T4: `END.LUCENA`, `END.PHILIDOR`, `END.ROOK-ACTIVE` (rook behind passer, activity), `END.MINOR` (B vs N, same/opposite bishops), `END.QUEEN-PAWN`. T5: `END.TRANSITION` (which ending to enter), `END.FORTRESS`, `END.TRIANGULATION`, `END.REMOTE`. T6–7: `END.THEORY.*` (the "must-know" list), `END.TABLEBASE-LAB`. Each theoretical position: principle → verified family → failing look-alike → play it out against a tablebase-backed opponent (CD-6).
*Sources:* Capablanca, Silman CEC (class-organised) [R]; Shereshevsky (strategy) [R]; Dvoretsky Endgame Manual (technique) [R]; Müller & Lamprecht, de la Villa (reference and curated 100) [R]; Chesscademy *Endgame Essentials* (Lucena, Philidor, Opposition and Breakthrough, K+P vs K+Q) [V: titles]; tablebase results [V].

### S8 Openings and structures
`OPN.PRINCIPLES` (T1) · `OPN.SETUP` one simple setup with reasons (T1–2) · `OPN.DEVIATION` "they left the book" (T1–2, recurring) · `OPN.REPERTOIRE.*` small reasons-first repertoire (T3) · `OPN.STRUCT.*` structure families (T4–5) · `OPN.PREP` forcing lines, transpositions, spaced review for forcing lines only (T5–6) · `OPN.NOVELTY` and opponent preparation (T6–7). Repertoire driven by learner's own opponent frequencies.
*Sources:* Capablanca, Lasker (principles) [R]; Seirawan, Alburt (beginner repertoire guidance) [R]; Flores Rios, Soltis (structures) [R]; Fischer, Kasparov (preparation) [R]; Yusupov opening chapters [V, secondary]; Dvoretsky–Yusupov *Secrets of Opening Preparation* [V, secondary]; Chesscademy overview lesson and Sicilian Dragon path [V]; CC0 Lichess game data for base rates [V].

### S9 Game study and own-game analysis
`GAME.GUESS` guess-the-move study (T3+) · `GAME.FAMILIES` model games by structure (T4–5) · `GAME.OWN` annotate-before-engine (T1 reflection → T3 protocol) · `GAME.TAXONOMY` error classification (T3–4) · `GAME.OPPORTUNITY` concept-opportunity log (T3+) · `GAME.PATTERNS` recurring-error evidence across games (T4+).
*Sources:* Chernev (both), Fischer, Tal, Bronstein, Alekhine, Kasparov, Kotov [R]; Botvinnik, Dvoretsky (own-game work) [R/V secondary]; Silman, Rowson, Heisman (error taxonomies) [R]; Steps/Yusupov test structures [V, secondary].

### S10 Practical performance
`PRA.CLOCK` literacy (T1) · `PRA.BUDGET` simple time budgets (T2) · `PRA.PHASEBUDGET` (T3) · `PRA.PRESSURE` calculation and decisions under time (T4–5) · `PRA.RECOVER` after a loss or bad session (T2+) · `PRA.LOAD` sustainable training load, returning after a break (T2+) · `PRA.COMPETE` event routine, preparation, post-event debrief (T5–7).
*Sources:* Rowson, Heisman, Smith (*Pump Up Your Rating*) [R]; Kasparov, Carlsen (as lenses) [I]; self-determination research [R].

### S11 Self-direction (the spine of independence)
Stages: `SELF.1 OBSERVE` (T0), `SELF.2 EXPLAIN` (T1–2), `SELF.3 DIAGNOSE` (T3), `SELF.4 PLAN-WITH-SUPPORT` (T4), `SELF.5 EXPERIMENT` (T4–5), `SELF.6 LEAD` (T5–6), `SELF.7 INVESTIGATE` (T6–7). Roles per skill: care → demonstration → coached → independent. Silent sessions, confidence calibration, unprompted-behaviour ledger, plan–do–review cycle, capstone training project, exportable training manual.
*Sources:* Botvinnik, Dvoretsky (self-analysis and self-assessment, *Secrets of Chess Training* vol. 1 [V, secondary]), Heisman, Rowson [R]; Zimmerman (SRL) [R]; Kalyuga (fading) [S]; the Guardian study's four roles and rehearsal-of-absence [V: user's document].

## 3. Source-to-node table: how each of your resources is used

*"Use" is always: inspire original teaching and verified items; never copy text, annotations, or exercise sets. "Status" = what I actually confirmed about the source in this session. Everything marked [R] needs a synthesis sheet from a lawful copy before its nodes are written.*

| # | Resource | What we take | Nodes | Status |
|---|---|---|---|---|
| 1 | *My System* — Nimzowitsch | Prophylaxis, blockade, over-protection, restraint, open file, seventh rank | S5 `POS.PROPHYLAXIS`, `POS.OPENFILE`, `POS.SEVENTH`, blockade | [R] |
| 2 | *Chess Fundamentals* — Capablanca | Economy of explanation; early endgame sense | S7 early, S1 | [R] |
| 3 | *Lasker's Manual* — Lasker | Principles; chess as struggle; practical psychology | S8 principles, S10 | [R] |
| 4 | *My 60 Memorable Games* — Fischer | Precise annotated games; opening-to-middlegame logic | S9 families, S8 | [R] |
| 5 | *Zurich 1953* — Bronstein | Narrated decisions under uncertainty | S9 guess-the-move | [R] |
| 6 | *Life and Games of Tal* — Tal | Calculation under complexity; practical sacrifices | S6, S9 | [R] |
| 7 | *Tal–Botvinnik 1960* — Tal | Match preparation and psychology | S9, S10 | [R] |
| 8 | *My Best Games of Chess* — Alekhine | Long-term attack preparation | S6, S9 | [R] |
| 9 | *My Great Predecessors* — Kasparov | Historical development of ideas; deep concrete analysis (engine-check required) | S9, S6 | [R] |
| 10 | *Logical Chess: Move by Move* — Chernev | Every move explained in plain language | S9, S2 | [R] |
| 11 | *Most Instructive Games* — Chernev | Lessons grouped by theme | S9, S3 | [R] |
| 12 | *How to Reassess Your Chess* — Silman | Imbalances | S5 `POS.IMBALANCES` | [R] |
| 13 | *The Amateur's Mind* — Silman | Classification of amateur errors | S9 `GAME.TAXONOMY` | [R] |
| 14 | *Simple Chess* — Stean | Basic positional ideas | S5 T2–3 | [R] |
| 15 | *Think Like a Grandmaster* — Kotov | Candidate list, analysis tree | S2/S4 | [R] |
| 16 | *Secrets of Modern Chess Strategy* — Watson | Exceptions to rules; rule-independence | S5 `POS.EXCEPTIONS`, CD-4 | [R] |
| 17 | *Chess Structures* — Flores Rios | Structure-specific plans | S5, S8 | [R] |
| 18 | *Pawn Structure Chess* — Soltis | Structure catalogue | S5, S8 | [R] |
| 19 | *The Art of Attack* — Vuković | Conditions for attack | S6 | [R] |
| 20 | *The Art of Sacrifice* — Spielmann | Sacrifice types and reasons | S6 `SAC.TYPES` | [R] |
| 21 | *Dvoretsky's Endgame Manual* | Technique, resources, theory | S7 T4–7 | [R] |
| 22 | *Silman's Complete Endgame Course* | Class-organised endgame content | S7 tiering cross-check | [R] |
| 23 | *Fundamental Chess Endings* — Müller/Lamprecht | Reference for verification | S7 | [R] |
| 24 | *100 Endgames You Must Know* — de la Villa | The curated must-know list | S7 `END.THEORY.*` | [R] |
| 25 | *Endgame Strategy* — Shereshevsky | Strategic principles of endings | S7 | [R] |
| 26 | *5334 Problems…* — L. Polgár | Volume of graded problems | S3 volume design | [R] |
| 27 | *The Woodpecker Method* | Repetition at rising speed; ~4-week first cycle, halving thereafter | S3 fluency track | [V, secondary] |
| 28 | *Seven Deadly Chess Sins* — Rowson | Thinking failures | S2, S10, S9 | [R] |
| 29 | *Chess for Zebras* — Rowson | Complexity, mindset | S5, S10 | [R] |
| 30 | *Pump Up Your Rating* — Smith | Practical training habits | S10 | [R] |
| C1 | Steps Method — Brunia/van Wijgerden | Small steps, motif repetition, teacher guidance | S1–S3 sequencing | [R/S]; no method detail verified |
| C2 | Yusupov: Build Up / Boost / Chess Evolution | Nine volumes; themes spread across all volumes; chapter pattern theme → examples → exercises → solutions | Whole-curriculum cross-check; test design | [V, secondary] |
| C3 | Soviet School tradition | Systematic training of analysts | S9, S11 | [I] |
| C4 | Botvinnik School | Self-analysis and regime | S11, S9 | [R/I] |
| C5 | Dvoretsky–Yusupov, and Dvoretsky's solo series | **School of Future Champions** (Dvoretsky + Yusupov; 5 vols: training, opening prep, endgame technique, positional play, creative thinking) and **School of Chess Excellence** (Dvoretsky; 4 vols: endgame analysis, tactical play, strategic play, opening developments) | S11, S8, S7, S6, S5, S4 | [V, secondary] both series exist (corrected 2026-10-24) |
| C6 | *Grandmaster Preparation* — Aagaard | Candidates, comparison, elimination | S4 | [R] |
| C7 | *Winning Chess* — Seirawan (+ Silman) | Accessible breadth: strategy, tactics, openings, endings | S1–S8 T1–3 | [R] |
| C8 | *Comprehensive Chess Course* — Alburt | Graded self-study course | Cross-check; S8 beginner repertoire | [R] |
| C9 | *Chess School* — Ivashchenko (+ Mazja) | Large graded combination and endings exercises | S3, S7 volumes | [S]; level/size claims disagree across sources |
| C10 | Woodpecker (again) | See #27 | S3 | [V, secondary] |
| C11 | Susan Polgar Foundation curriculum | Free school curriculum, USCF-approved (2006) | T0–2 cross-check | [S]; contents not seen |
| X1 | Lichess Learn | Short goal-based levels: pieces → capture/protection/combat/check/mate → castling, en passant, stalemate → piece value | S1 design shape | [V] |
| X2 | Lichess Practice | Named tactics and endgame drills; engine-based practice positions | S3, S6, S7 reference list | [V] |
| X3 | Chesscademy (research) | Paths, tactic/game sets, test-out, failures | Whole structure | [V] |
| X4 | Guardian study (your document) | Four roles; unaided performance; rehearsal of absence | S11 | [V: your document] |
| X5 | Original handoff plan v0.4 | Hierarchy sketch, tier clusters, student model, falsification criteria | Whole | [V] |
| X6 | "and more" | *Yours to add; each new source gets a synthesis sheet* | — | — |

## 4. Reading and synthesis order (what I need to actually read, first)

1. **Tier 2–3 first**, because that is where Andrew starts: Silman (both), Stean, Kotov, Heisman, Chernev (*Logical Chess*), Seirawan, Nimzowitsch (positional concepts), Vuković/Spielmann (attack conditions).
2. Then **endgame spine**: de la Villa, Silman CEC, Shereshevsky; Dvoretsky and Müller as verification references.
3. Then **structures**: Flores Rios, Soltis, Watson.
4. Then **training systems**: Yusupov, Steps (via publisher material), Woodpecker, Aagaard, Dvoretsky–Yusupov.
5. Master games (Fischer, Bronstein, Tal, Alekhine, Kasparov) are used for *positions and plan labels* checked by engine, not for text.

Per source I write a **synthesis sheet** (definitions; where sources agree; where they differ; exceptions; good and bad examples; engine/tablebase checks; an original explanation; graded items; rights record). I can only do this properly from lawful copies of the books. I cannot read the books for you from here; I can work from copies you supply, from public-domain editions, or from library/lawful-access sources you point me to.

## 5. Open questions this map exposes

- Where exactly each of your remembered Chesscademy lessons lived is unverified; the logged-in content was never archived.
- Tier assignments are G0 everywhere. The first calibration use of the Lichess puzzle data (needs your download permission) will upgrade some tactics nodes to G1.
- Several seat positions are my inference [I]; none should be quoted as theirs.
