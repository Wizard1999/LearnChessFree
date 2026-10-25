# Chess verification report — sample lessons in master plan v0.4

Date: 2026-10-24. Scope: the four FENs and every concrete line in the plan's three sample lessons (section 7). Nothing here is publication-ready; it only states what was and was not established.

**Tools actually used** (details in `evidence/ENVIRONMENT.txt`): python-chess 1.11.2 for legality; Stockfish 19 Lite WASM, one thread, 16 MB hash, **no tablebases**; the public Lichess tablebase service for positions with 7 or fewer pieces. Raw outputs are in `evidence/`; scripts in `scripts/`.

**Evidence levels used below**
- **Rules-verified**: python-chess confirms legality and the stated rules facts.
- **Tablebase-verified**: exact result from a tablebase (only possible with ≤7 pieces).
- **Engine-supported**: forced-mate or large-evaluation score from a depth 36–40 search. This is strong evidence, **not a proof** (engine pruning is not sound in the formal sense), and it is the best available for the 8-piece Lesson 2.
- **Unverified**: nothing established.

## Summary

| Lesson | Position(s) | Result |
|---|---|---|
| 1 — absolute vs relative pin | A, B | **Rules-verified.** All claims hold. |
| 2 — pawn breakthrough | `7k/ppp5/8/PPP5/8/8/8/7K w` | **Engine-supported** for the main lines and the counterexamples. "1.b6 is the unique solution" is **not established** (see below). |
| 3 — rook-ending defence | `4k3/8/r7/4K3/4P3/8/8/R7 b` | **Invalid as written. Do not use.** Black simply wins White's rook. |

## Lesson 1 — rules-verified

- Both FENs are legal positions (`is_valid()`), Black to move, not in check.
- Position A (`4k3/4n3/8/8/8/8/8/4R1K1 b`): Black has no legal knight move at all (6 pseudo-legal knight moves, 0 legal); the legal moves are exactly the four king moves Kd7, Kd8, Kf7, Kf8. So "Nc8 is illegal" and "Kf8 is legal, so this is not checkmate" are both correct. The knight is absolutely pinned (`is_pinned` true).
- Position B (`4q1k1/4n3/8/8/8/8/8/4R1K1 b`): the knight is **not** absolutely pinned; five legal knight moves exist including Nc8. Nc8 is legal and loses the queen to Rxe8+ (the king on g8 cannot recapture on e8). The plan's claim is correct, and the lesson correctly refuses the "pinned pieces cannot move" rule.
- Not checked: the planned independent tasks, because the plan gives no FENs for them. Each will need the same legality check plus an "apparent pin with a second blocker" check.

## Lesson 2 — engine-supported, with an unresolved answer set

The position has 8 pieces, so no tablebase applies.

**Confirmed (depth 36–40):**
- 1.b6 is the clear best move: forced mate in 20 is reported at depth 40.
- 1.a6 and 1.c6 **lose** for White (Black is ahead by roughly 9 pawns at depth 36). The lesson's guided "wrong first move" feedback should say so; "pushing an outer pawn first" is a real error, not a slower win.
- After 1.b6 axb6, **2.c6 is the only winning continuation** (mate in 18; 2.axb6 and 2.cxb6 score about -0.19). Every Black reply then loses, including the lesson's 2…bxc6 3.a6 (the engine's choice is 3.a6 with a decisive evaluation).
- After 1.b6 cxb6, **2.a6 is the only winning continuation** (mate in 18 reported; 2.axb6 and 2.cxb6 score 0.00). Every Black reply loses, including the lesson's 2…bxa6 3.c6 (mate in 18).
- Both main lines are legal move for move, and the stated final positions match what python-chess produces.
- The plan's counterexample suggestions work as the lesson intends. Moving the Black king to b8 or d8, or moving White's a-pawn back to a4, changes the evaluation to 0.00 (a draw), so the breakthrough fails. Moving White's king to a1 leaves the win intact (about +9). The lesson should state which of these the student is meant to find.

**Not established — do not publish an acceptance set from this:**
- The plan implies a single accepted first move. The engine does **not** support that. Single-PV searches after quiet first moves gave: 1.Kg2 about +6.7 for White, 1.Kh2 and 1.Kg1 exactly 0.00. A multi-PV run earlier gave 1.Kg2 a much larger score and 1.Kh2/1.Kg1 zero. A king-move asymmetry like this is exactly what a shallow search can get wrong in a pawn ending. **1.Kg2 may be a second winning move.** The lesson's prompt ("Can White create a pawn the others cannot stop?") may still be fine, but the grader must not call a move wrong because it is not 1.b6.
- Not exhaustively solved. A short retrograde or exhaustive pawn-ending solver over this small state space (kings plus six pawns) should replace the engine as the authority before this position becomes an assessment item.

## Lesson 3 — invalid

- FEN `4k3/8/r7/4K3/4P3/8/8/R7 b`: Black's rook on a6 faces White's rook on a1 along an open a-file. **1…Rxa1 is legal and wins a whole rook.** Lichess tablebase: root result is a win for the side to move (Black), `dtz 1`, with Rxa1 as the winning capture. Stockfish: Rxa1 scores mate in 19 for Black.
- Only four Black moves keep the draw (tablebase): Rb6, Rc6, Rg6, Rh6. The other fourteen non-capturing moves lose; e.g. Ra7, Ra8, Ke7 and Kd8 are all losing here.
- The lesson's own line fails. After 1…Rh6 2.Kf5 Rb6 3.e5, the plan's 3…Rb1 is a blunder: it hangs the rook to Rxb1 and the engine reports mate in 9 for White. The idea the lesson describes (shift to checking from behind after the pawn advances) is real, but the diagram and line do not demonstrate it.
- The label "Philidor" is also loose. The teaching point — keep the defending rook on the sixth rank until the pawn reaches it — needs a position where White's rook is not en prise.

**Candidate replacement bases (tablebase-verified results only; these are skeletons, not lessons):**

| FEN (Black to move) | Root | Black moves that hold the draw |
|---|---|---|
| `4k3/8/r7/4K3/4P3/8/8/3R4 b - - 0 1` | draw | Ra2, Ra3, Ra4, Ra5+, Rb6, Rc6, Rg6, Rh6, Ra7, Ra8, Ke7, Kf7, Kf8 (13); Ra1, Rd6, Re6+, Rf6 lose |
| `4k3/8/r7/3KP3/8/8/8/7R b - - 0 1` | draw | Ra2, Ra3, Ra4, Ra5+, Rb6, Rg6, Kd7, Ke7, Kf7, Kd8, Kf8 (11); Rc6, Rh6, Ra7, Ra8, Ra1, Rf6, Rd6+, Re6 lose |

Both have many drawing moves at the root, which suits a "did you keep the draw" grader but not a "find the one method" lesson. The second is more instructive about which sixth-rank squares are safe. Choosing positions where the teaching point is forced needs a small search over tablebase positions, then human instructional review.

## What this shows about the process

The plan correctly labelled these samples unverified. The check found one position that is simply wrong, one acceptance set that is unsound, and one lesson that is fully correct. That is a useful base rate: **hand-reasoned chess fails often enough that no position should enter assessment content without a script-run check** (legality, engine or tablebase result, alternative-move scan, and a recorded tool/version/limit).

## Remaining gaps

1. Exhaustive solve of the Lesson 2 position, including every White first move and the quiet-move question.
2. A replacement Lesson 3 with a chosen teaching point, tablebase acceptance set, and instructional review by a strong player.
3. FENs for all "independent task" families in Lessons 1–3 (not given in the plan).
4. Independent strong-player review of the explanations. Engine/tablebase agreement says nothing about whether the explanation is good.
