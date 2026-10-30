# The first 10 hours: release gate for version 0.1

Written 28 October 2026, after reading an outside assessment of the repository (ChatGPT, shared by Andrew). Its central advice, which Andrew agrees with: make the first 10 to 20 hours exceptionally good and get them in front of people, before trying to make the rest comprehensive. This note defines that slice and the gate for calling it ready.

## The slice
The lessons below are the first 10 hours (lesson minutes added in teaching order by tier, skill and depth; the order a learner actually sees follows prerequisites and placement, so this is an approximation). Time is the lesson's stated minutes only; exercises and practice add to it, so the real time is longer.

| # | Lesson | Min | Running total |
|---|---|---|---|
| 1 | Which squares does a piece attack? (`L-FND-ATTACK-1`, tier 0) | 11 | 11 min |
| 2 | The board and its square names (`L-FND-BOARD-1`, tier 0) | 7 | 18 min |
| 3 | Taking pieces: is the capture safe? (`L-FND-CAPTURE-1`, tier 0) | 9 | 27 min |
| 3b | Piece values: counting what you win and lose (`L-FND-VALUE-1`, tier 0) | 10 | 37 min |
| 4 | Castling, and when you cannot (`L-FND-CASTLE-1`, tier 0) | 8 | 45 min |
| 5 | Check and checkmate: the three ways out (`L-FND-CHECK-1`, tier 0) | 10 | 55 min |
| 6 | En passant: capture a pawn in passing (`L-FND-SPECIAL-1`, tier 0) | 9 | 64 min |
| 7 | Promotion: a pawn on the last rank (`L-FND-PROMOTE-1`, tier 0) | 9 | 73 min |
| 8 | Ways a game is drawn (`L-FND-DRAWS-1`, tier 0) | 9 | 82 min |
| 9 | The knight: the piece that jumps (`L-FND-KNIGHT-1`, tier 0) | 8 | 90 min |
| 10 | The pawn: moves and captures are different (`L-FND-PAWN-1`, tier 0) | 9 | 99 min |
| 11 | How the queen moves (`L-FND-QUEENKING-1`, tier 0) | 9 | 108 min |
| 12 | How the rook moves (`L-FND-ROOKBISHOP-1`, tier 0; the old combined lesson, split by rule D24, keeps its id) | 9 | 117 min |
| 13 | Observe: one unsure moment, and what you actually saw (`L-SELF-1-1`, tier 0) | 9 | 126 min |
| 14 | Mate with king and queen: the supported check (`L-END-MATE-1`, tier 1; the old combined lesson, split by rule D24, keeps its id) | 10 | 136 min |
| 14b | Mating without stalemating (`L-END-MATE-STALEMATE-AVOID-1`, tier 1; taught right after 14) | 10 | 146 min |
| 15 | King and queen against king: shrink the box (`L-END-MATEKQ-1`, tier 1) | 11 | 148 min |
| 16 | King and rook against king: cut off and close in (`L-END-MATEKR-1`, tier 1) | 10 | 158 min |
| 17 | Opposition: one tempo between a win and a draw (`L-END-OPPOSITION-1`, tier 1) | 12 | 170 min |
| 18 | Checkmate in one: four patterns (`L-FND-MATE1-1`, tier 1) | 11 | 181 min |
| 19 | Reading and writing a move (`L-FND-NOTATION-1`, tier 1) | 12 | 193 min |
| 20 | Before every move: two questions (`L-FND-THREAT-1`, tier 1) | 12 | 205 min |
| 21 | The safety scan: look before you move (`L-LOOP-V1-1`, tier 1) | 9 | 214 min |
| 22 | Your first moves: three habits (`L-FND-OPENING-1`, tier 1) | 9 | 223 min |
| 23 | When the opening habits fail: reasons and conditions (`L-OPN-PRINCIPLES-1`, tier 1) | 9 | 232 min |
| 24 | The clock is a budget (`L-PRA-CLOCK-1`, tier 1) | 10 | 242 min |
| 25 | Is this piece safe? Loose pieces and counting (`L-FND-COUNT-1`, tier 1) | 12 | 254 min |
| 26 | Counting attackers and defenders (`L-SAF-COUNT-1`, tier 1) | 10 | 264 min |
| 27 | Five ways to meet an attack (`L-SAF-DEFEND-OPTIONS-1`, tier 1) | 12 | 276 min |
| 28 | Loose pieces: what can be taken for free? (`L-SAF-LOOSE-1`, tier 1) | 9 | 285 min |
| 29 | What did their last move threaten? (`L-SAF-THREAT-1`, tier 1) | 9 | 294 min |
| 30 | The king as a fighter: pawn endings the active king decides (`L-END-KINGACTIVE-1`, tier 2) | 11 | 305 min |
| 31 | Checks, captures, threats: look at the forcing moves first (`L-LOOP-V2-1`, tier 2) | 10 | 315 min |
| 32 | They left the book: three questions (`L-OPN-DEVIATION-1`, tier 2) | 11 | 326 min |
| 33 | Moves that help and moves that wait (`L-OPN-NONDEV-1`, tier 2) | 10 | 336 min |
| 34 | A setup is a job for every piece (`L-OPN-SETUP-1`, tier 2) | 11 | 347 min |
| 35 | Development: a lead you can spend (`L-POS-DEVELOPMENT-1`, tier 2) | 10 | 357 min |
| 36 | Sure material, or a trap? (`L-OPN-TRAPS-1`, tier 2) | 11 | 368 min |
| 37 | Active and passive pieces (`L-POS-ACTIVITY-1`, tier 2) | 8 | 376 min |
| 38 | Connecting the rooks: a step, not a goal (`L-POS-CONNECT-1`, tier 2) | 9 | 385 min |
| 39 | Open files: find the entry square (`L-POS-OPENFILE-1`, tier 2) | 11 | 396 min |
| 40 | The seventh rank: targets and a cut-off king (`L-POS-SEVENTH-1`, tier 2) | 11 | 407 min |
| 41 | A budget, not an equal share (`L-PRA-BUDGET-1`, tier 2) | 10 | 417 min |
| 42 | A training load you actually keep (`L-PRA-LOAD-1`, tier 2) | 9 | 426 min |
| 43 | After a loss: judge decisions, set process goals (`L-PRA-RECOVER-1`, tier 2) | 9 | 435 min |
| 44 | When you are ahead, look again (`L-PRA-SECURE-1`, tier 2) | 12 | 447 min |
| 45 | Real threats and fictitious ones (`L-SAF-FICTITIOUS-1`, tier 2) | 11 | 458 min |
| 46 | Explain it, and say how sure you are (`L-SELF-2-1`, tier 2) | 11 | 469 min |
| 47 | Back-rank mate, and luft as the cure (`L-TAC-BACKRANK-1`, tier 2) | 10 | 479 min |
| 48 | Discovered attacks and discovered check (`L-TAC-DISCOVER-1`, tier 2) | 9 | 488 min |
| 48b | Double check (`L-TAC-DOUBLE-CHECK-1`, tier 2) | 9 | 497 min |
| 49 | Forks: one move, two targets (`L-TAC-FORK-1`, tier 2) | 8 | 505 min |
| 50 | Forks with pawns and queens, and when they fail (`L-TAC-FORK-2`, tier 2) | 10 | 515 min |
| 51 | Pins: cannot move, or should not move (`L-TAC-PIN-1`, tier 2) | 10 | 525 min |
| 52 | Skewers: the king moves, the piece behind falls (`L-TAC-SKEWER-1`, tier 2) | 9 | 534 min |
| 53 | A king in the centre: open the lines before he hides (`L-ATK-CENTER-1`, tier 3) | 10 | 544 min |
| 54 | Count before you attack: attack now, not yet, or no (`L-ATK-SUPERIORITY-1`, tier 3) | 11 | 555 min |
| 55 | Write the candidate list: forcing moves, one quiet move, a reason each (`L-CAL-CANDIDATES-1`, tier 3) | 12 | 567 min |
| 56 | Track the line: what moved, what is gone, what is attacked (`L-CAL-VISUALIZE-1`, tier 3) | 12 | 579 min |
| 57 | Pawn cover: what a pawn push in front of your king gives away (`L-DEF-SHELTER-1`, tier 3) | 10 | 589 min |
| 58 | The pawn breakthrough: giving pawns to make a passed pawn (`L-END-BREAKTHROUGH-1`, tier 3) | 11 | 600 min |
| 59 | Key squares: where the king must get to (`L-END-KEYSQ-1`, tier 3) | 11 | 611 min |
| 60 | King and pawn against king: the king leads (`L-END-KPK-1`, tier 3) | 12 | 623 min |
| 61 | Two bishops against a lone king (`L-END-MATE-2B-1`, tier 3) | 12 | 635 min |
| 5b | Stalemate: no move, but no check (`L-FND-STALEMATE-1`, tier 0) | 9 | 55 min |
| 9b | How the king moves (`L-FND-PIECE-KING-1`, tier 0) | 10 | 102 min |
| 12b | How the bishop moves (`L-FND-PIECE-BISHOP-1`, tier 0; taught right after the rook) | 10 | 118 min |

## Gate for version 0.1 (what must be true before we hand it to strangers)
1. Every lesson above has had an adversarial review and fix pass, then a read by a strong player (gate G3). Known example of what the reviews must catch: an outside review found a lesson saying a side was "a whole queen ahead" when it was a knight ahead; fixed, and the review lenses now include material arithmetic.
2. A clean path from the Start screen through all of it with no dead ends (the lesson-reachability test covers the whole course; add a test for this slice specifically).
3. Exercises in the slice are checked for answer leaks and for items that give away the idea in their prompt; the exercises flagged for human review in this slice are cleared first.
4. The web version is online (gate G10, Pages) and the exe is tested on a second machine.
5. A way for testers to send feedback without a server: Settings export, mailed or pasted to Andrew.
6. The evaluation plan (`docs/evaluation-plan.md`) is started with the first testers rather than saved for the end: beginners, intermediate players and stronger club players, measuring performance on position families they have not seen.

## What waits
Everything past the slice: remaining core lessons, the opening deep dives, famous games, history and playstyles. They stay visible as "coming" and never block the first release.

## From the same assessment, now done or logged
- Same-family exercises overstate independence in the mastery estimate: same-family exercises now count half (a new exercise from a family already answered), on top of the quarter weight for repeats.
- "Mastered" can be read as shown in games: the legend now says it is mastery in training, not yet shown in your own games (depth D4 evidence is still not part of the level).
- Navigation had 11 links: now four plus a More menu.
- Keyboard-operable board and screen-reader support: not done yet (roadmap).
- Deploy: the GitHub Pages workflow cannot deploy until Pages is enabled (gate G10).
