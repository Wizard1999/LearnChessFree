# Safety and tactics lessons (Tiers 1-4): what was built, weaknesses, what is unverified

Author worker A1. Labels: **[V]** verified by `tools/validate.py` / `tools/validate_lessons.py` in this run; **[I]** my inference; **[H]** hypothesis. Vocabulary follows `docs/authoring-guide.md` ("loose" = attacked and not defended; "hanging piece" only as the Lichess theme name or once as a synonym; counting values 1/3/3/5/9).

## 1. What exists

12 lessons, 89 hand-built items in 85 positions (`content/items/lesson-tac-1..4.json`, ids `IA1-001..089`, positions `PA1-001..085`), plus `practice` steps that draw on the puzzle corpus (`lp-*.json`) and the generator files (`gen-t0-*.json`).

| Lesson | Skill | Depth | Min | Hand-built items | Contrast (works / fails / irrelevant) |
|---|---|---|---|---|---|
| L-SAF-LOOSE-1 | SAF.LOOSE | D1 | 9 | 8 | rook attacks knight: no defender / rook defends it / nothing attacked |
| L-SAF-COUNT-1 | SAF.COUNT | D1 | 10 | 9 | pawn captures first / knight first, same 2-v-1 count / nothing attacks; pinned defender / unpinned; overloaded queen |
| L-SAF-THREAT-1 | SAF.THREAT | D1 | 9 | 6 | back-rank mate threat / square covered by a knight / no threat; pawn attack; fictitious rook attack; fork threat |
| L-TAC-FORK-2 | TAC.FORK | D2 | 10 | 9 | queen check-fork / forker captured by its own target / check forks nothing; knight fork / second target defended |
| L-TAC-PIN-1 | TAC.PIN | D1 | 10 | 8 | absolute pin wins the bishop / king moved, no pin / no pin line; relative pin (legal but costly) |
| L-TAC-SKEWER-1 | TAC.SKEWER | D1 | 9 | 6 | bishop skewer / attacker undefended next to the king / king off the line; queen skewer with back piece defended |
| L-TAC-DISCOVER-1 | TAC.DISCOVER | D1 | 9 | 7 | Bxh7+ discovers the rook / move is no check / nothing behind; discovered check (split 30 Oct 2026: double check is now L-TAC-DOUBLE-CHECK-1) |
| L-TAC-BACKRANK-1 | TAC.BACKRANK | D1 | 10 | 8 | Re8# / luft on h6 / bishop guards e8; luft as the cure; the threat against one's own king |
| L-TAC-REMOVE-DEFENDER-1 | TAC.REMOVE-DEFENDER | D1 | 12 | 8 | remove / deflect / decoy / overload, one example each; a second defender defeats the removal; decoy fails when another piece can capture |
| L-TAC-TRAPPED-1 | TAC.TRAPPED | D1 | 9 | 6 | knight on the rim, b4 wins it / one escape square uncovered (cut off, not trapped) |
| L-TAC-NONE-1 | TAC.NONE | D1 | 10 | 6 | knight fork wins / forking square covered by a pawn / quiet position; pawn fork wins vs. same fork loses |
| L-TAC-MATEPATTERNS-1 | TAC.MATE-PATTERNS | D1 | 10 | 8 | smothered mate / rook left g8; Arabian mate / unprotected rook; queen-and-bishop mate / knight guards h7 |

Every lesson follows card, board example, cued items, conditions card, contrast (predict first), cue-3 items (some with no tactic), reflect. Items outside the lesson's own skill: `rd.defl` (TAC.DEFLECT.D1), `rd.decoy` (TAC.DECOY.D1), `rd.ovl` (TAC.OVERLOAD.D1), `rd.c2`/`rd.name` (TAC.DECOY.Dn).

**What the learner can do afterwards that they could not before** (the point of each lesson): LOOSE: say which pieces are loose for either side and refuse a capture whose target has a far-away defender. COUNT: decide a capture on one square by value and order, and spot a pinned or overloaded defender. THREAT: state what the last move threatens, and say "nothing". FORK-2: check the forking square and the second target. PIN: tell "cannot move" from "should not move". SKEWER: check the front piece cannot take the attacker. DISCOVER: check the moving piece makes its own threat. BACKRANK: mate, defend with luft, see it against oneself. REMOVE-DEFENDER: name the four ways and count a second defender. TRAPPED: count escape squares, tell trapped from cut off. NONE: test a pattern before playing it. MATEPATTERNS: state each named mate's conditions.

## 2. How positions were made, and defects found in my own work

Positions came from three routes: (a) hand construction with the engine checking every one, (b) **Lichess puzzle seeds** (CC0, 14 seeds, provenance `lichess_puzzle`, mined from `library/data` with a one-pass filter: few pieces, rating <= 1700, many plays) because puzzles have a unique best move, and (c) one-feature edits and colour-reversed mirrors (`chess.Board.mirror()`) of verified positions. Builder and probe scripts were kept in the scratchpad, not in the repo.

Defects found by the validator or my audits, all fixed before hand-in:
- Material imbalance I did not intend (about 6 first drafts): a position where one side was already winning by an exchange, so a "winning" tactic proved nothing (e.g. the first pin and fork drafts). Fixed by balancing pieces; the engine eval before the tactic is now within about +-1 for all working positions except where noted in section 3.
- **Hidden back-rank mates**: a "no threat" position where White had Rd8# (found by the null-move search), and a queen-fork draft where Qxd4 Qxd4 Rc8+ mated. Fixed by giving the king luft or moving a rook.
- **Illegal setups**: a king in check on the wrong turn (queen fork on an open file, Arabian mate with the rook already giving check). Caught by `is_valid()`.
- **Vacuous claim** (a trap worth knowing): `legal_destinations` on a piece that does not belong to the side to move passes with an empty set. The pin item that claims "the bishop has no legal move" therefore uses a position with that side to move. The builder asserts this.
- **Claim thresholds from PV noise**: `material_after_move` measures at the last capture in a 12-ply PV, so a winning side's loose last moves can lower the figure (delta 2 instead of 3). I kept `min` at what the line shows and added `best_move_in` plus rules claims (`loose_pieces`, `attackers`) so the "why" does not rest on the PV.
- A "double check" seed (Sg441) was a single check; replaced by KuUQg after counting `checkers()`.
- Wrong attacker counts in four statements (a bishop counted as its own defender, a queen counted as a rook defender); fixed against `attackers` output.
- Wording: first drafts defined "loose" as "undefended" and used "hanging" and "worth"; realigned to the project vocabulary.

## 3. Weaknesses and honest limits

- **`find_move` accepted sets can reject other good moves.** Most working positions have a unique best move (puzzle seeds, large gap to second best; `best_move_in` with the default 40 cp). Exceptions: `bk.luft` accepts three pawn moves (f6, h6, h5) and rejects `g6`, which is also a luft move but 82 cp worse; the feedback says so. `loose.find` accepts only the rook capture; the other capture also wins a piece but is 170 cp worse.
- **Material threats are verified indirectly.** The validator has no "null move then capture" claim except for mate, so material threats (`threat.p`, `threat.r`, `threat.m`, `bk.c3`, `threat.i`) are checked by a *pass move* (an unrelated move by the defender): "if the defender passes, the engine line loses >= N" or ">= 0". This establishes the threat or its absence under engine limits but does not check the named threat move itself. `threat_detection` items also show the pass-move arrow only if it comes first among claims; I put move-free claims first where possible.
- **Contrast failing items** use `predict_outcome` or `classify_position` on a position *after* the move when the claim has to show "not mate" (`bk.f`, `mate.smf`, `mate.arf`): the validator can prove "this is check, not mate" with `game_state` and `legal_destinations`, but cannot prove a negative on the pre-move position.
- **Cue-3 interface leak.** Positive cue-3 items are `find_move`, negative ones are `classify_position`, so the item type hints at the answer. Fix in the app: let `find_move` items carry a "no tactic here" button (the `threat_detection` task already has one); the data side would be `answer.outcome = "none"`.
- **Explanations about "why a piece is a poor defender", "strategic pins", "cut off from the action"** are general chess knowledge only partly covered by claims (the pinned-defender and cut-off facts are claimed for the specific positions). These items and the classification-by-idea items (`rd.name`, `trap.cl`, `none.q*`) are `needs-human`.
- **Piece-order and counting rules** (cheapest first) are taught as defaults with checked failing look-alikes; no claim shows the rule holds in general, and the lessons do not say it does.
- **Coverage gaps**: no lesson on `TAC.OVERLOAD`, `TAC.DEFLECT`, `TAC.DECOY` as separate skills (one comparative lesson as assigned); `TAC.DOUBLE-CHECK` has one board and one item inside the discovered-attack lesson; skewer has no "pawn behind the king" example; the trapped lesson has a knight example only (bishop traps come from the corpus).
- **Overlap with other items**: `check_all.py` warns when the same placement appears in several families (e.g. my threat mirror positions against the T0 author's threat items). The mirrors are deliberate colour reversals, not copies.
- **Difficulty is not calibrated.** Tiers and cue levels are my assignment; no rating claims are made.
- All lessons and items are `needs-human` or `machine-only`; none is `human-reviewed`.

## 4. Unverified

- Strong-player review of every card and every "why" sentence.
- Whether the teaching order inside each lesson works for a mid-level player (the pilot is Andrew).
- Whether `contrast` steps in the app play correctly with my failing items that start from a different FEN than the working item (the app shows the working position, then the failing item on its own board).
- The approximate lesson times (9-12 minutes) were not timed.

## 5. Open questions for the coordinator

1. "No tactic" answer for `find_move` (see section 3), or accept the type leak.
2. Should the app use `answer.options`/`display.study_seconds` for any of the board-vision style items here? I used only `options`.
3. Practice steps reference corpus tags (`theme.fork`, `theme.pin`, ...). If the corpus is later regenerated with different themes, `check_all.py` will flag the lessons; they are listed in each lesson's `practice` steps.
4. Skill nodes I used with depths: all exist in the 194-node graph; I did not add or edit skill files.

Cue-3 item steps in the lessons carry `"silent": true` (no hints and no engine line before answering), as the app now supports.

## 6. Reproducibility

Validator results at hand-in: `lesson-tac-1..4.json`, 89 items and 253 claims, all pass (0 failures); the 12 lesson files pass `validate_lessons.py` with 0 errors and 0 warnings; `check_all.py` reports no error for these files. Seeds used (Lichess puzzle ids): oYnsP, 1UwyD, 9Au7Y, W10Ql, HPJAK, 1HtCL, WIhp1, 5S982, 91ZxU, MlBfV, KuUQg, O6qUt, UULzT, x4ly6, D9ufo, lTEq0, PKmeH, BI9yD, cSi6Y.
