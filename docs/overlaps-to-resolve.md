# Overlaps

Policy (Andrew, 28 October 2026): **nothing is taught twice. Lessons link to each other instead.** `tools/check_overlap.py` is the gate (same skill and depth in two lessons; the same board position in two lessons). Run it after every authoring batch.

## State on 29 October 2026
A resolution run (five agents, one per cluster of overlapping lessons) took the checker from **65 overlaps to 1**. Each position now lives in one lesson; the others use a different shipped exercise of the same skill, or the step was removed and a card names the lesson that teaches it. Validators, `check_all` and the graph check are clean.

## Still open
1. **LOOP.V1.D1: `L-FND-THREAT-1` and `L-LOOP-V1-1`** teach the same skill at the same depth. Neither can be retargeted as it stands: THREAT-1 is the first-games intro with prompts on; LOOP-V1-1 is the scan lesson but only two of its four task items are depth D2. Options: retarget THREAT-1 to SAF.THREAT D1 (its lesson `L-SAF-THREAT-1` needs a distinct angle first), or make LOOP-V1-1 a real D2 lesson (prompts off, mixed threat and no-threat positions) that links back to THREAT-1.
2. **Worked-demonstration boards that are not exercises** still show the start position or 1.e4 e5 in several first lessons (BOARD, OPENING, SETUP, GAME-OWN, NOTATION) and the Ng5 d5 position in NOVELTY and PUNISH. The checker only compares exercises, so it does not flag them. Replace them with a text description or an unused position, and teach the checker to compare board steps too.
3. **Thin lessons** left after removing duplicates: GAME-OWN (one cue-3 item, no contrast step), PREP (no contrast step), NONDEV, PRINCIPLES (leans on one item of its own skill and one loosely fitting OPN.DEVIATION D3 item). They need new verified items authored for them, not reused positions.
4. **L-END-MATEKQ-1 was retargeted to depth D2** but keeps two D1 items; swap them for D2 items for a strict match.
5. **IBg1-37 repeats the board of IBg1-34 inside `L-PRA-RESIST-1`** (the checker compares lessons, not items within one lesson).
Details for the other clusters are in the run's report.
