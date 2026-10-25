# Curriculum map v1.1: what five primary sources changed

2026-10-24. Builds on `curriculum-map-v1.md`. Inputs: the five synthesis sheets in `sources/sheets/` (Capablanca, Nimzowitsch, Em. Lasker, Ed. Lasker, Znosko-Borovsky; ~57,000 words in total; each written by an agent that read its book in full) plus the pasted-curriculum reconciliation. All tiers/depths remain **G0** (expert estimates). Labels: **[READ]** read in full by a reading agent (I reviewed their summaries and grepped the sheets; I did not re-read the books); **[V]** verified by tool here; **[CHECK]** needs an engine or tablebase before use.

## 1. What the five books agree on (and so are safest to teach)

1. **King activity in endings and the opposition** (Capablanca, E. Lasker, Em. Lasker, Nimzowitsch) with the pawn-race counting that goes with it.
2. **Mobilize before you attack; tempo and development are real** (Capablanca, E. Lasker, Em. Lasker, Nimzowitsch, Z-B). Em. Lasker and E. Lasker also say *when* a lead licenses attack and a deficit voids it, which is exactly the conditions-not-rules form (CD-5).
3. **Holes, outposts and weak squares; open file → entry square → seventh rank** (Nimzowitsch, E. Lasker, Z-B, Capablanca).
4. **Attacks need conditions** (Em. Lasker "tangible superiority", E. Lasker "objectives that cannot run away", Z-B attacker/defender counts, Capablanca's castled-king types).
5. **Piece values depend on the position** (E. Lasker: value as mobility; Capablanca; Z-B), a good contrast family.
6. **Simple mates need the king** (Capablanca, E. Lasker).

## 2. The most important cross-source finding

**Every one of the five books states its rules more absolutely than it practises them, and almost never shows a failing look-alike.** The reading agents independently flagged this for Capablanca, Nimzowitsch, E. Lasker, Z-B and Em. Lasker. This is our biggest content opportunity: the principles are sound defaults, and the missing half is the contrast family (works / fails / irrelevant). It confirms CD-4 from primary evidence.

Concrete dated or contestable claims to **not** teach as written (full lists in each sheet):
- Capablanca: backward pawns "invariably" lose; bishop nearly always beats knight; 1910s opening verdicts; pawn-colour rule 1; wording of the opposition.
- Nimzowitsch: the blockade is "obligatory"; "always take a centre pawn"; the 80/60/90% figures (rhetoric); the claim that the opposition is superseded; over-protection and pawn-roller sacrifices are practical, not proven.
- Em. Lasker (1895 lectures): every opening verdict (Ruy Lopez rook-pawn defence, French Advance, King's Bishop's Gambit, Evans); "doubled pawns a chimera"; two numerical slips (a knight needs six moves between opposite corners, not five; a rook attacks fourteen squares, not thirteen).
- E. Lasker (1915): opening survey omits most modern defences; the "first-move birthright"; "an unsound plan beats no plan".
- Z-B (1922): numeric "force" in pawn units, square-value belts, "a pawn up means won", advice to resign when hopelessly worse, passive defensive doctrine.

## 3. New and changed nodes (consolidated from the sheets, duplicates merged)

*Tier/depth are G0 suggestions from the sheets; IDs are proposals. "Src" lists which sheets support the node.*

**S1 / S2 Safety and Thinking Loop**
`SAF.COUNT` count attackers and defenders on one square by value, with the failure cases (loose, pinned, overloaded defender) · T1–2 · E. Lasker (+ our own T1 plan). `SAF.COUNT.FUTURE` count what can arrive · T3. `PRA.SECURE` complacency in "safe" positions (a habit node) · T2+ · Capablanca. `OPN.TRAPS` and "take sure material" recapture traps · T1–2 · Capablanca. `SAF.DEFEND-OPTIONS` · T1–2 (pasted curriculum). Real vs fictitious threats, and the move that turns a threat into a fictitious one · T2–3 · Z-B (feeds `SAF.THREAT`).

**S3 Tactics**: no new nodes from these sources beyond emphasising `TAC.BACKRANK`, `TAC.TRAPPED` (with `POS.OUTOFPLAY` as the contrast: a piece cut off from play vs really trapped).

**S5 Positional play and planning**
- Plans: `POS.PLAN` (a plan you can actually carry out, T3, Capablanca) with sub-nodes `POS.PLAN.DIFF` (find the key difference between the two sides, T3–4), `POS.PLAN.MODE` (active/passive/neutral follows the type of advantage, T4), `POS.PLAN.PIECES` (allocate pieces, T4), `POS.PLAN.RACE` (tempo of competing plans, T5), `POS.CONVERT` (cashing in an advantage and what it costs, T4–5), all Z-B.
- Values and tempo: `POS.VALUES` (conditional piece values, T0 D1 and T4), `OPN.TEMPO` (which moves helped; tempo lost) · T1–3 · E. Lasker, Nimzowitsch, Z-B.
- Pawns: `POS.PAWNMOVE` ("what does this pawn move leave behind?") T3–4; `POS.TARGET` (objective that cannot move) T3; `POS.MAJORITY` T3; `POS.STRUCTURE.CHAIN` (attack the base, not the head) T4; `POS.STRUCTURE.IQP`, `POS.STRUCTURE.HANGING`, `POS.STRUCTURE.DOUBLED` T4–5; `POS.FREEING` (true vs illusory freeing moves) T5.
- Centre: `POS.CENTER` family (control vs mobile centre pawn: `POS.CENTER.CONTROL`, `POS.CENTER.MOBILE`) T3–4.
- Blockade/restraint family: `POS.BLOCKADE` (a default, not a duty) T3; `POS.RESTRAINT` T4–5; `POS.OVERPROTECT` (heavily conditioned) T5; `POS.OBSTRUCT` T4.
- Pieces: `POS.OUTOFPLAY` T3; `POS.MANEUVER` T5–6; `POS.SWITCH` (switch of wing) T4–5; `POS.PIN.STRATEGIC` T4.
- `POS.OPENFILE.SWITCH` folds into `POS.OPENFILE` (entry square, three ways past an obstructing pawn: batter, lever, sacrifice).

**S6 Attack, sacrifice, defense**
`ATK.SUPERIORITY` (tangible superiority before attacking; premature attacks invite counterattack) T3–4 · Em. Lasker. `ATK.PACE` (quick vs moderate, set by the margin) T4. `ATK.COMMIT` (direct attack en masse; when to break off) T4 · Capablanca. `INI.THREAT` (a held threat) T5. `DEF.WAIT` (defence by economy: do not change your position voluntarily; skip superfluous defensive moves) T4 · Em. Lasker; a rich source of no-threat items. `DEF.SHELTER` (pawn cover loosened by a pawn push) T3–4. `DEF.DIAGNOSE` (the defender's checklist: find the weakness and chief threat) T4 · Z-B (replace its passive doctrine with active defence).

**S7 Endgames**
- `END.KING-ACTIVE` (king as a fighting piece) T2–3, merged from Capablanca, Nimzowitsch, Em. Lasker ("king power").
- `END.ZUGZWANG` T3 D1 / T4 D3, merged from Em. Lasker and Nimzowitsch; `END.TEMPO` (spare moves, knight parity) T4–5 · E. Lasker.
- `END.MATE-MATERIAL` (which material can mate: K+Q, K+R, two bishops, B+N; two knights cannot force it) with `END.MATE-2B`, `END.MATE-BN`, `END.THEORY.2N` T3–6.
- `END.OPPOSITION.DISTANT` T4; `END.PAWN-RACE.QUEEN-FIRST` T3; `END.PAWN-FLANK` T3; `END.BREAKTHROUGH` T3; `END.PAWN-TEMPO` (blocked until its positions are reconstructed).
- `END.WRONG-BISHOP` (merged: E. Lasker, Capablanca) T4–5; `END.THEORY.QvR` T6.

**S8 Openings**
`OPN.NONDEV` (developing vs time-wasting moves: early rook-pawn moves, needless queen moves) T1–2 · Em. Lasker.

**S9, S10, S11:** Capablanca's candid self-annotation in Part II is a model for `GAME.OWN`. Z-B's long positional case studies are T4+ excerpt material only. No new S10/S11 nodes beyond `PRA.SECURE`.

**Net effect:** about 45 new or changed nodes on top of the roughly 110 in v1, concentrated in S5 (positional/planning) and S7 (endgames).

## 4. Tablebase checks run so far (closing the sheets' [CHECK] backlog)

Run through the Lichess tablebase service on 2026-10-24 [V]:

| Claim from the sheets | Position (FEN) | Result |
|---|---|---|
| Two knights cannot force mate | `4k3/8/8/8/8/8/8/1NN1K3 w` | draw ✓ |
| Wrong-colored rook pawn (a-pawn, dark-squared bishop, king in a8 corner) draws | `k7/8/8/8/P7/8/8/2B1K3 w` | draw ✓ |
| Right-colored bishop (light-squared) wins | `k7/8/8/8/P7/8/8/3BK3 w` | win, mate in 29 ✓ |
| K+B+N vs K is a theoretical win | `4k3/8/8/8/8/8/8/1NB1K3 w` | win ✓ |
| King-and-pawn: pawn d2, Kd1 vs Kd4 is a draw with either side to move | `8/8/8/8/3k4/8/3P4/3K4 w` and `b` | draw both ✓ |
| A Lucena-type position (Kb8 Pb7 Rc1 vs Kd8 Ra2) wins | `1K1k4/1P6/8/8/8/8/r7/2R5 w` | win ✓ |

Still open from the sheets (not yet run): every 1895/1915/1922/1930 opening verdict; the Philidor and rook-ending skeletons; Q vs R; Capablanca's pawn-colour rule 1 and the K+P "rule of thumb"; Z-B's "plan race" counts; Nimzowitsch's sacrifice-for-blockade claims. These need diagrams rebuilt as FENs first (several books' diagrams are missing from the text; E. Lasker's 167 are in the text as ASCII).

## 5. Text, edition and rights notes (for the registry)

- **Capablanca**: the Gutenberg text is the 17th printing with a **1934 preface and a 1949 notice**; the 1921 body is US public domain, but treat the preface as possibly protected (paraphrase only). 150 diagrams missing.
- **E. Lasker**: 1915 second edition, du Mont translation; US public domain via Gutenberg. Outside the US the term may run much longer for the author; our policy (original wording, facts only) makes this moot. Diagrams present as ASCII, at least one mis-transcribed.
- **Em. Lasker**: scan lacks about five printed pages (the four opening rules and the start of lecture 2), has no diagrams and badly damaged notation. A second scan is needed before relying on its opening section; the durable core (attack, defence, endgame lectures) is readable.
- **Nimzowitsch**: 1930 Hereford edition; prose good, notation noisy, about 180 diagrams missing, the book's own errata list printed.
- **Z-B**: the file is the 1930 reprint of the 1922 first edition; Part III move tables scrambled; diagrams missing.
- **Cue scale** (an open question from one agent): in `docs/content-schema.md`, cue 1 = named (most cued), 2 = themed set, 3 = mixed/unlabeled, 4 = in play. All five sheets were told this; one agent assumed 4 = unlabeled. Cue 3 is "unlabeled."

## 6. What this changes next

- **Teaching rule confirmed:** supply the failing look-alike for every principle; state conditions; label absolutes as defaults.
- **Content to build first** (matches where Andrew starts): `SAF.COUNT`, `POS.OPENFILE` → seventh rank, `POS.OUTPOST` (e4 vs e3-type contrast), `ATK.SUPERIORITY`, `DEF.WAIT`, `END.KING-ACTIVE`, `END.OPPOSITION` (tablebase-backed), blockade of a passed pawn.
- **Reading budget:** the five sheets are enough for Tiers 2–4 positional and endgame ideas. I recommend no more broad book reading; read a specific copy only when a node needs it.
