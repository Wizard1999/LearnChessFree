# Endgame lessons, Tiers 1-5 (author worker A3)

2026-10-24. Nine lessons, every factual claim backed by the Lichess tablebase (exact for <= 7 pieces) or by a rules check. Labels: **[V]** verified by `tools/validate.py` / `tools/validate_lessons.py` in this session; **[B]** checked by assertion in my build script (python-chess rules facts; the tablebase result of every claimed move was compared with the service before the file was written); **[R]** recalled, not checked; **[I]** inference.

Files: `content/lessons/L-END-*.json` (nine of mine), `content/items/lesson-end-1..9.json` (items `IA3-<lesson><nn>`, positions `PA3-<lesson><nn>`). Two other lessons with `END` in the name (`L-END-MATEKQ-1`, `L-END-MATEKR-1`) belong to the Tier 0-1 author; mine (`L-END-MATE-1`) is the stalemate-trap and mate-in-N drill that follows them.

## The nine lessons

| # | Lesson | Skill (lesson) | Min | Steps (card/board/item/contrast/practice/reflect) | Items | Positions | Play-outs |
|---|---|---|---|---|---|---|---|
| 1 | `L-END-MATE-1` (split by D24: now only the K+Q supported check; the stalemate part is `L-END-MATE-STALEMATE-AVOID-1`, Mating without stalemating) | END.MATE-KQ | 11 | 2/1/8/1/1/1 | 14 | 14 | KR win, KQ win |
| 2 | `L-END-OPPOSITION-1` Opposition: one tempo between a win and a draw | END.OPPOSITION | 12 | 2/1/7/2/1/1 | 14 | 12 | win as White, hold as Black |
| 3 | `L-END-PAWNRACE-1` The rule of the square (split 2026-10-30; the race count is now `L-END-PAWN-RACE-1`, Pawn races: count both pawns) | END.SQUARE | 12 | 2/2/4/2/1/1 | 15 | 15 | race win, hold |
| 4 | `L-END-KINGACTIVE-1` The king as a fighter | END.KING-ACTIVE | 11 | 2/1/5/2/1/1 | 11 | 9 | win, hold |
| 5 | `L-END-OUTSIDE-1` The outside passed pawn: a decoy | END.OUTSIDE-PASSER | 12 | 2/1/5/1/1/1 | 11 | 9 | win |
| 6 | `L-END-ZUGZWANG-1` Zugzwang: when having the move is a burden | END.ZUGZWANG | 12 | 2/1/4/2/1/1 | 11 | 8 | win (triangulation), hold |
| 7 | `L-END-ROOK-1` Rook and pawn against rook: cut the king off | END.ROOK-ACTIVE | 11 | 2/1/5/1/1/1 | 8 | 6 | win |
| 8 | `L-END-LUCENA-PHILIDOR-1` Lucena and Philidor | END.LUCENA | 12 | 2/1/5/1/1/1 | 12 | 9 | Lucena win, Philidor hold |
| 9 | `L-END-WRONGBISHOP-1` The wrong bishop, and two knights | END.WRONG-BISHOP | 11 | 2/1/5/2/1/1 | 12 | 11 | hold, win |

Every lesson follows the requested order: card, board example, cued item (cue 1), conditions card, contrast (the failing look-alike changes **one** thing, checked by `one_change()` in my build script [B]), cue-3 mixed items (no theme named in the prompt; each lesson has at least one position where the tempting idea does not apply), a `play_out` item, a final `practice` step (tags `node.END.*`, drawing on the generated corpus as well as mine) and a reflect step. Lessons 2, 3, 4, 6 and 9 have two contrast steps; the rest have one. Each lesson's steps use one `play_out` item (L2 uses two); the other play-out items are in the bank for the practice step.

## Verified facts the lessons rest on (selection)

Every row is a tablebase result for the side to move unless stated [V].

* **Opposition (L2).** Pe4, Ke5 v Ke7: Black to move loses, White to move draws. Pe4, Kd5 v Ke7, Black to move: draw (only Kd7 holds), White to move: win (only Ke5). Pe4, Kd4 v Kd6, Black to move: draw (the heuristic "the side not to move wins" fails when the king is level with the pawn). Pe4, Ke6 v Ke8, White to move: win (a king two ranks ahead needs no opposition). Rook pawn a5, Kb6 v Kb8: draw with either side to move.
* **Pawn races (L3).** Pb4, Kh1 v Kg6: White to move wins, Black to move draws (the king steps into the square). With White's king on a5 instead of h1, Black's king on f6 inside the square loses. Race Ka1, Pa5 v Kh6, Ph4: White wins (the a8 queen attacks h1); with the pawn on b5 it is a draw; with the pawn on a4 White loses. Exception to the square rule: Pb2, Kh1 v Kg8, White to move wins only by Kg2.
* **King activity (L4).** Pawns g2 h2 v g7 h7: Ke5 v Kc8 wins only with Ke6; Ke5 v Kd8 draws; Ke4 v Kb8 wins (three king moves), Ke3 v Kb8 draws; no pawn move wins in the first three of these (with Ke5 v Kb8 several pawn moves also win).
* **Outside passed pawn (L5).** Kd4, Pa3, Pf2 v Ke6, Pf7, Pg7, White to move: win, only Kc5 (a4 draws). The same with the pawn on d3, b3 or h3: draw. Black to move: draw.
* **Zugzwang (L6).** Kd5, Pe4 v Kf4, Pe5: whoever is to move loses (found by scanning all king squares with the engine, then confirmed by the tablebase). Kc4 v Kf4: only Kd5 wins. Kc5 v Kg4: only Kd6 wins; Kd5 loses (the tempo-losing detour).
* **Rook cut-off (L7).** Kc3, Pc4, Re1 v Kg6, Ra8: win (19 of 22 moves win; Ra1, Re8 lose the rook, Kc2 draws). The same with Black's king on d6 or d7: draw.
* **Lucena and Philidor (L8).** Ke8, Pe7, Rf1 v Kg8, Rd2: win. The block Rf4 or Re4 against a check by Black's rook draws when the blocking rook is loose; promoting at once draws in the sample position. Philidor: Kd5, Pe5, Rh2 v Ke8, Ra6, Black to move: 11 of 19 moves hold; after e6, Ra1 holds with White's rook on h2 or h3 and loses with it on h1. With White's king on d6, only Ra6+, Rd7+ and Kf8 hold.
* **Wrong bishop (L9).** Pa4, dark bishop, Ke1 v Ka8: draw (all 13 White moves); light bishop: win; pawn on the b-file with the dark bishop: win; Kb6, Pa5 with the dark bishop: Black king on b8 draws, on d8 wins. Two knights v bare king: draw; a position of two knights v king and pawn where Nd7 is the only win.

## Items: accepted sets, wrong moves, claims

* `find_move` items list the full accepted set (24 items). Where the set is "all winning moves" it is computed from the tablebase move list; the "mate in N" items list only the fastest mates and carry `mate_in` claims, and slower winning moves named in feedback carry `move_loses cp=1` claims (engine). Item totals: 108 items (24 `find_move`, 63 `predict_outcome`, 5 `classify_position`, 16 `play_out`); cue 1 = 11, cue 2 = 46, cue 3 = 35, cue 4 = 16; 103 `needs-human`, 5 `machine-only` (the stalemate/mate recognition items).
* Every accepted move and every listed wrong move has its own `tablebase` claim with `move`; for most items the claims also cover every other legal move (the builder's `cover_all`), so "all other moves draw" statements in `explain` are checked.
* `predict_outcome` answers are absolute strings (`"White wins"`, `"Draw"`, `"Black wins"`) with `options`; the claim is the tablebase result for the side to move (or after the stated move).
* `play_out`: the learner plays the side to move at the start position (the `orientation` field says which colour is at the bottom). Goals: `win` (position is a tablebase win for the side to move), `hold` (tablebase draw). `max_moves` = distance to mate in moves + 12 where known (35-45 for the long rook and pawn wins).

## Validator results [V]

* `tools/validate.py` on `content/items/lesson-end-1.json` ... `-9.json`: **685 claims, 685 pass** (671 `tablebase`, 5 `mate_in`, 5 `game_state`, 4 `move_loses`); each file ends with ALL CHECKS PASSED. The tablebase pass rate is 671 of 671 in the final runs. On the first full pass 8 claims failed with "tablebase service unavailable" (not wrong results: files 3, 5 and 7); they passed on re-run, and one more transient failure in file 5 passed on the next run. Before writing any file my build script compared the tablebase result of every claimed move with the service, so no claim failed on content.
* `tools/validate_lessons.py` on the nine lessons: **ALL LESSONS PASSED, 0 errors, 0 warnings** (board lines legal move by move; board claims checked; practice tags resolved against the shipped corpus).
* `tools/check_all.py`: 0 errors (the 40 warnings are not mine; they include "skill X has items but no lesson" for nodes my lessons only touch through item skills, e.g. END.KEYSQ, END.KPK, END.MATE-MATERIAL, END.PAWN-RACE).

## Defects found in my own positions and sources (all fixed before shipping)

1. **Philidor rook on h1 spoils the check from behind.** The position `4k3/8/r7/3KP3/8/8/8/7R` from `curriculum-map-v1.1.md` draws, but after e6 the move Ra1 loses (White's rook takes it). I moved White's rook to h2 and made the pair h1/h2 the contrast of L8.
2. **The b-pawn Lucena of the curriculum map is not the bridge.** `1K1k4/1P6/8/8/8/8/r7/2R5 w` wins, but 12 of 14 moves win and the interposition Rb4 *draws* (Rxb4+). I replaced it with a central e-pawn position; there too many moves win, so the items test the two errors that do lose (promoting at once, blocking with a loose rook).
3. **The square rule with the pawn on its second rank.** Pb2, Kh1 v Kg8: the b3-square contains g8, yet White wins, only by the king move Kg2 (pawn pushes draw). This is the "ignores your own king" exception, used as a bank item.
4. **"Wrong bishop" is not just the corner.** With the dark bishop and Pa4, Black's king on e5 still draws, and on c3 White wins (only a5). The lesson therefore says the king must be able to reach the corner in time, and gives a tablebase pair (b8 draws, d8 wins).
5. **Stalemate-trap check was not a tablebase fact.** Several feedback texts say "stalemate". The validator cannot claim stalemate after a move, so each stalemate named in feedback is covered by a rules assertion in my build script [B] and by a separate `classify_position` item with a `game_state` claim for the principal cases (Qg6 in lesson 1, Rg7, Bf4 in lesson 9).
6. **Mirror and "irrelevant" changes were checked, not assumed.** For example, moving White's king h1 to h2 in the square-rule position keeps the draw, but the same king on a5 flips the result; the file shift d4/e4 in L2 keeps the result for a non-rook pawn.
7. **Shared scratchpad collision.** Another worker overwrote my helper `tb.py` in the shared scratchpad mid-session (my first Lucena search ran against its function and printed a wrong table). The files in `content/` were never affected; I moved my tools to a private subfolder and re-ran everything.
8. **Transient tablebase failures.** In several runs `validate.py` reported "tablebase service unavailable" for single positions and passed on the next run. I now pre-fill `library/cache/tablebase.json` with the (checked) responses of my positions before validating; the cache is shared and other workers can overwrite it, so a re-run may be needed.

## What I could not do, and weaknesses

* **Not taught as verified positions:** the Lucena *bridge* (rook protected by the king on the fourth rank) as a find-the-move item; "rook behind the passed pawn" as a win/draw contrast (an engine scan of about 4,500 R+P v R positions gave no clean single-change pair); the breakthrough (3 v 3 pawns needs 8 pieces, outside the tablebase; the 3 v 2 version is simply an extra pawn); triangulation beyond the single K+P pair of L6.
* **Cards state general ideas; claims verify only the examples.** For example "two knights cannot force mate" is verified for the tested position (all 12 White moves draw) and agrees with the standard result [R]; the key-square statement in L2 is verified for the tested squares, not for all Black king squares.
* **Many first moves win** in the rook positions (e.g. 19 of 22 in L7); the cued items there ask "keep the win" with a large accepted set and rely on the three that lose.
* **Pedagogy is untested.** Wording, hint ladders and the length of the lessons (11-12 minutes, longer than the 6-12 target when both play-outs are played) need a human read; all lessons and items are `needs-human` except the pure rules items (`machine-only`).
* **Duplicates/overlap.** L1 overlaps the Tier 0-1 mating lessons by design (same pieces, different task: mate in N, stalemate recognition, K+B draw). If the coordinator prefers no overlap, drop L1's board and keep its stalemate items as a practice set (`node.END.MATE-STALEMATE-AVOID`).

## Vocabulary

Aligned with the authoring guide: a piece that is attacked and not defended is called **loose** (the earlier wording "unprotected" and "hangs" was removed from L1); "hanging" is not used.

## Skill nodes used

`END.MATE-KQ`, `END.MATE-KR`, `END.MATE-STALEMATE-AVOID`, `END.MATE-MATERIAL`, `END.OPPOSITION`, `END.KEYSQ`, `END.KPK`, `END.SQUARE`, `END.PAWN-RACE`, `END.PAWN-RACE.QUEEN-FIRST`, `END.KING-ACTIVE`, `END.OUTSIDE-PASSER`, `END.ZUGZWANG`, `END.TRIANGULATION`, `END.ROOK-ACTIVE`, `END.LUCENA`, `END.PHILIDOR`, `END.WRONG-BISHOP`, `END.THEORY.2N` (all exist in `content/skills/`; `tools/check_all.py`: 0 errors). Item `skill` fields use these ids with depths D1-D3; `POS.MAJORITY` appears only as a tag.

## Sources

Synthesis sheets only for ideas, conditions and failing look-alikes (Capablanca CI-01..14, 21, 22; E. Lasker K22-K29; Em. Lasker 4.17-4.20; Nimzowitsch ideas 11, 14-22); no sentences copied. All positions are own constructions; results are from the Lichess tablebase service [V].
