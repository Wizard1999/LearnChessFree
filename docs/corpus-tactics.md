# Corpus: re-verified tactics, no-tactic positions and threat items

2026-10-24. Code: `tools/corpus/` (seeded, rerunnable). Items: `content/items/lp-*.json` (tactics), `quiet-*.json`, `threat-*.json`. Raw verdicts and logs: `tools/corpus/out/` (`verdicts.jsonl`, `tactics_report.json`, `corpus_summary.json`, `quiet_screen.jsonl`, `tactic_screen.jsonl`, `threat_screen.jsonl`). Labels: **[V]** measured here, **[J]** my interpretation, **[S]** supplied by the data source, not checked here.

## What was built [V]

| Part | Files | Items | Positions | Claims | Validator result |
|---|---|---|---|---|---|
| A tactics (20 themes, 879 cue-3 + 200 cue-1 siblings) | 10 `lp-*.json` | 1,079 | 879 | 2,826 | all pass |
| B quiet / tactic classification (150 + 150) | 3 `quiet-*.json` | 300 | 300 | 600 | all pass |
| C threat detection (46 mate, 56 loose piece, 40 no threat) | 2 `threat-*.json` | 142 | 142 | 278 | all pass |
| **Total** | 15 | **1,521** | | **3,704** | **3,704 / 3,704 claims, 1,521 / 1,521 items** |

`tools/build_content.py` ships all 1,521 (evidence hash matches current content); `tools/check_all.py` reports no error for these files (all skill ids and depths exist).

**How to read the 100% validator pass rate [J].** It is a consequence of the method, not an independent result: every claim was run through `validate.check_claim` (the validator's own function) when the item was generated, and only claims that passed were written. The engine search is deterministic at fixed depth, so the later `validate.py` run reproduces it. The informative numbers are the **generation-time pass rates** below.

## Method

### A. Tactics (`a1_sample.py`, `a2_verify.py`, `a2b_tablebase.py`, `a3_build.py`)
1. **Data.** Lichess puzzle database (CC0), 6,157,341 puzzles. Kept: rating deviation <= 80, plays >= 500, popularity >= 85, rating 800 to 2199 (1,813,252 puzzles). The position is the FEN **after** the opponent's first move (`Moves[0]`); the solver's move is `Moves[1]`.
2. **Sample.** Per theme, 45 puzzles, stratified over seven 200-point rating bins (6, 6, 7, 7, 7, 6, 6 from the easiest bin up), seeded (`SEED = 20261024`). Preference order inside a bin: at most 4 tags besides length/phase tags **and no other target motif theme**, then at most 4 tags, then at most 6. All 900 sampled puzzles met the strictest tier. Each puzzle is used for one theme only (rarest theme picks first). A 25-per-theme reserve was drawn but not needed (not verified).
3. **Re-verification of every puzzle** with the validator's claim code, depth 16, Stockfish 19 lite (single thread):
   - MultiPV 6; the Lichess solution move must be within 40 cp of the engine's best, else the puzzle is dropped ("engine disagrees").
   - Accepted set = all moves within 40 cp (at most 3; for mates, all moves that mate within n, at most 4); more means "ambiguous", dropped.
   - Win claim, in this order: `mate_in` (mate puzzles, n from the solution length); `material_after_move` with `min` = the measured net material (must be >= 2); `eval_range` of 250 cp or more for the mover; for `defensiveMove` only, an "only-move" fallback (eval not worse than -1.00 plus `move_loses` of the best alternative by >= 150 cp). Plus `best_move_in` on the accepted set.
   - Optional `feedback_by_move`: the highest-ranked non-accepted capture or check, kept only if a `move_loses` claim (>= 150 cp, capped at 600 in the shown claim) passes. The text says only what the claim says.
   - **Tablebase cross-check** (not requested; added because an engine "win" can be a theoretical draw): every material or eval win with 7 pieces or fewer (29 puzzles) was queried in the Lichess tablebase; all 29 are wins, and a `tablebase` claim was added to those items.
4. **Items.** Cue 3: prompt "White to move. Find the best move." (the theme is not named). Cue 1 sibling (`IL-<id>-c1`, same position, 10 per theme spread evenly over the rating range): prompt "Theme: <name>. ...". Hints: attention, relation, then "A good first move is made by the piece on X". `explain` restates only claim-backed facts. `difficulty_prior` is the Lichess puzzle rating, deviation and plays at grade G1. Tier tag by rating: <1200 tier.2, 1200-1499 tier.3, 1500-1799 tier.4, 1800 and above tier.5. Skill depth D2 for cue 3, D1 for cue 1.

### B. No-tactic positions (`b1_games.py`, `b2_screen.py quiet|tactic`, `b3_build.py`, `b4_audit.py`)
- **Games.** Lichess standard rated games, January 2013 sample (CC0): 121,332 games; 24,729 had both players rated 1600 to 2499 and at least 62 plies. Up to 8 random plies in 16 to 60 per game, only where the last move was not a capture or check and the side to move is not in check: 195,887 candidates. Games are split by hash parity (even to task B, odd to task C), so a game never feeds both tasks. One position per game.
- **Quiet rule**, all required: `quiet_position(max=1)` passes; `eval_range(-80..+80)` passes; an independent depth-22 search also gives |eval| <= 100 cp, no mate score and a best-line net of <= +1. 1,171 candidates screened (300 per ply bucket, equal buckets).
- **Matching tactic items.** 450 puzzles from a seeded reservoir of well-measured tactic puzzles (disjoint from part A), with the opponent's last move neither a capture nor a check, 16 to 60 plies, at least 8 pieces; each verified like part A (mate or material win only, eval-only wins excluded).
- **Classification items.** `classify_position`, options `["There is a tactic","No tactic: make a good quiet move"]`, identical prompts for both classes, 1:1 inside each file (50 : 50). Quiet items: `review.status` needs-human; tactic items: machine-only.

### C. Threats (`b1_games.py`, `c2_screen.py`, `c3_build.py`)
- **mate**: the opponent would mate in one if the side to move passed, mating move unique. Claim `mate_in(n=1, null_move_first)`: fully validator-checked, no engine needed. The side to move must be at eval -300..+600 (not already lost).
- **loose**: exactly one loose piece (value >= 3) attacked exactly once. Claims `loose_pieces` (exact set) and `attackers` (count 1) are validator-checked. That the capture really nets >= 2 material and is the opponent's best move after a null move was checked by `c2_screen.py` with a null-move search; **the validator cannot do this** (no `null_move_first` for material claims), so these items say so in `explain` and are needs-human.
- **none** (balance, 40 of 142): no loose piece on either side, no mate in one, eval within +-150, and a depth-20 null-move search finds nothing for the opponent (best line net <= 0, score <= +100). Validator claims: `loose_pieces` for both colours (empty) and `eval_range`. The null-move part is again offline-only; needs-human. Answer is `{"threat_move":"none"}`.

## Results [V]

### A. Re-verification (900 sampled puzzles, 879 pass, drop rate 2.3%)
| theme | sampled | passed | dropped | no win claim | other | mate | material | eval-only | only-move |
|---|---|---|---|---|---|---|---|---|---|
| fork | 45 | 45 | 0 | 0 | 0 | 1 | 43 | 1 | 0 |
| pin | 45 | 44 | 1 | 1 | 0 | 3 | 40 | 1 | 0 |
| skewer | 45 | 45 | 0 | 0 | 0 | 0 | 42 | 3 | 0 |
| discoveredAttack | 45 | 42 | 3 | 3 | 0 | 3 | 38 | 1 | 0 |
| doubleCheck | 45 | 45 | 0 | 0 | 0 | 28 | 14 | 3 | 0 |
| backRankMate | 45 | 44 | 1 | 0 | 1 | 44 | 0 | 0 | 0 |
| hangingPiece | 45 | 44 | 1 | 1 | 0 | 5 | 36 | 3 | 0 |
| trappedPiece | 45 | 45 | 0 | 0 | 0 | 0 | 41 | 4 | 0 |
| deflection | 45 | 45 | 0 | 0 | 0 | 10 | 29 | 6 | 0 |
| attraction | 45 | 44 | 1 | 1 | 0 | 10 | 30 | 4 | 0 |
| clearance | 45 | 42 | 3 | 3 | 0 | 9 | 25 | 8 | 0 |
| intermezzo | 45 | 45 | 0 | 0 | 0 | 3 | 39 | 3 | 0 |
| xRayAttack | 45 | 44 | 1 | 1 | 0 | 14 | 28 | 2 | 0 |
| interference | 45 | 44 | 1 | 1 | 0 | 2 | 34 | 8 | 0 |
| capturingDefender | 45 | 44 | 1 | 1 | 0 | 0 | 38 | 6 | 0 |
| sacrifice | 45 | 42 | 3 | 2 | 1 | 27 | 13 | 2 | 0 |
| quietMove | 45 | 42 | 3 | 3 | 0 | 3 | 24 | 15 | 0 |
| defensiveMove | 45 | 43 | 2 | 2 | 0 | 0 | 18 | 23 | 2 |
| mateIn2 | 45 | 45 | 0 | 0 | 0 | 45 | 0 | 0 | 0 |
| mateIn3 | 45 | 45 | 0 | 0 | 0 | 45 | 0 | 0 | 0 |
| **all** | **900** | **879** | **21** | **19** | **2** | 252 | 532 | 93 | 2 |

- Drop reasons: 19 "no win claim" (Lichess "advantage" puzzles whose best line nets < 2 material and whose eval is < 250 cp, e.g. a +1.9 positional edge), and 2 "mate not confirmed" (a mate in 5 and a mate in 4 that the depth-16 search shows only as longer mates). **No puzzle was dropped for "engine disagrees" and none for "ambiguous"**: the engine's best move equals the Lichess move in 879 of 879, and the accepted set has one move in 878 (doubleCheck has one with two). [J] This is expected from how Lichess builds puzzles (engine-generated, uniqueness-filtered) and means this check cannot catch an error shared by every Stockfish version; it does catch the "win is not big enough to teach" cases.
- Drop rate rises with puzzle rating: 0 of 240 below 1200, 3 of 140 (1200s), 1 of 140 (1400s), 6 of 140 (1600s), 7 of 120 (1800s), 4 of 120 (2000s).
- Themes with the most non-material "wins" (so the claim is `eval_range`, not "wins N points"): defensiveMove 23 of 43, quietMove 15 of 42, clearance 8, interference 8, capturingDefender 6, deflection 6. These are the themes where "tactics" are least about taking something, as expected.
- Mate-heavy themes: backRankMate 44 of 44 passes are mates, doubleCheck 28, sacrifice 27, mateIn2 and mateIn3 all.
- Tablebase: 29 of 29 puzzles with 7 pieces or fewer are confirmed wins (mostly quietMove, defensiveMove and skewer endings).
- `feedback_by_move` (a verified wrong move) exists for 510 of 879 cue-3 items; rare for defensiveMove (4 of 43) and trappedPiece (10 of 45), because there the tempting alternatives are not captures or checks.
- Difficulty (Lichess puzzle rating of delivered items) is close to uniform by construction, 808 to 2194, medians 1450 to 1580 for every theme; items per 200-point bin from 800 are 6, 6, 7, 7, 7, 6, 6 (a few themes have 4 to 5 in the top bins after drops). This is a sample for practice, **not** the natural distribution (compare `docs/inference-01-puzzle-theme-difficulty.md`, where pin and quietMove are much harder than fork in the full database).

### B. Quiet positions
- 1,171 screened, **410 quiet (35.0%)**. 634 (54.1%) were outside +-80 cp, 119 (10.2%) had a forcing gain of more than a pawn, 8 (0.7%) failed the depth-22 check. Quiet share by ply: 56% (plies 16-26), 37% (27-37), 23% (38-48), 23% (49-60). [J] Most real positions of 1600-rated players are not "quiet" under this strict definition; the quiet share falls as the game goes on.
- Tactic side: 450 verified, 442 pass (98.2%), 398 of those mate or material wins.
- **Leakage audit** (`b4_audit.py`; AUC for separating "tactic" from "quiet" by one rules feature, 0.5 = no information):

| feature | AUC first matched on ply and piece count only | AUC final set (matched on material difference and checks available, then ply order) |
|---|---|---|
| material difference (absolute) | 0.74 | 0.52 |
| checks available to the side to move | 0.76 | 0.51 |
| captures available | 0.71 | 0.67 |
| attacked own / enemy pieces | 0.66 / 0.70 | 0.69 / 0.68 |
| loose own / enemy pieces | 0.64 / 0.59 | 0.60 / 0.59 |
| legal moves | 0.67 | 0.60 |
| ply / piece count | 0.52 / 0.48 | 0.57 / 0.45 |

  The first build showed that puzzle positions (which follow a blunder) differ from quiet game positions in material imbalance and number of checks, a cue unrelated to chess skill. The final set is matched on those two (cells of material-difference bucket x checks bucket, then ply order), so only **chess-relevant cues remain** (more attacked and loose pieces, more captures in tactic positions). [J] A learner using "is something attacked?" is using a legitimate cue but also a shortcut; the set is not perfectly de-biased (AUC 0.6 to 0.7 on those features), and ply drifted slightly (0.57). A further round would need a larger verified pool.

### C. Threats
| kind | screened | kept | main reasons for dropping |
|---|---|---|---|
| mate in one | 330 | 219 (66%) | 109: side to move already lost (< -3.00) or far ahead; 2: mate on the board |
| loose piece | 240 | 120 (50%) | 91 side to move lost or winning already; **22: the static "free piece" does not net >= 2 in a null-move search**; 6: another threat is bigger |
| no threat | 150 | 50 (33%) | 63 eval outside +-150; **35 of the remaining 85 (41%) still had a null-move threat** (material or mate); 2 other |

[J] Counting attackers and defenders (the static test) misses about 40% of the threats in positions with no loose piece and no mate in one, and about 1 in 11 "hanging piece" threats is not really winning. Both support teaching the null-move question ("what would they play if I passed?") rather than only a loose-piece count.

## Caveats
1. **Selection bias.** Every puzzle contains a tactic; practice on them says nothing about noticing tactics in games. That is why the part-B items exist and why the tactic items there are matched to quiet game positions.
2. **Puzzle ratings are on Lichess's own puzzle scale** (Glicko-2 of solvers against puzzles), grade G1 priors only; not playing ratings and not comparable with other sites. Rating deviation <= 80 and plays >= 500 make them well-measured but still not calibrated for our learners. The popularity filter (>= 85) favours puzzles people liked, which may favour clean, instructive ones over typical ones. Quiet, threat and classification items carry no `difficulty_prior`.
3. **Theme labels are not machine-checked.** The validator has no motif claim types. Cue-3 items never state a theme (machine-only). Cue-1 siblings do ("Theme: fork"), a label from Lichess's detectors and community tagging **[S]**, so they are `needs-human`. Hint 1 and 2 on cue-3 items are generic theme-appropriate nudges and are the only place the idea appears; the app should log hint use.
4. **Engine evidence under recorded limits** (depth 16, Stockfish 19 lite, one thread; quiet items also depth 22; null-move and threat checks depth 16 to 20). Not proofs. The re-check is by the same engine family that built the Lichess puzzles, so shared blind spots survive.
5. **Null-move gap.** `material_after_move`, `quiet_position` and `best_move_in` have no `null_move_first`, so the "wins material" part of loose-piece threats and the "nothing is threatened" part of no-threat items are checked by the generator, not the validator. Their `explain` says so and the items are needs-human. Recommended validator additions: `null_move_first` for `material_after_move` and `quiet_position`, and a `threat_wins_material` claim.
6. **Quiet definition.** "Quiet" means: best line nets <= +1, eval within +-0.8 at depth 16, and the same at depth 22 within +-1.0. It is a working definition, not a theorem; a human should skim the 150 quiet items (`needs-human`).
7. **Games are a 2013 sample** of rated Lichess games, 1600+ rated (rating at that time, mostly classical). Opening and endgame shapes may differ from today's play.
8. **Families.** Every position is its own family (one position per puzzle or game), and a cue-1 sibling shares its position with the cue-3 item, so they cannot be split between training and test. No two positions are variations of each other by construction, but near-duplicates by transposition or mirror were not searched for (`tools/check_all.py` warns only on identical placement in different families; it raised none for these files).
9. **Gaps in the pass rate.** The 100% validator result excludes the 500 reserve puzzles (never verified) and everything dropped before writing.

## Reproduce
`tools/.venv/Scripts/python.exe -I tools/corpus/<script>`: `a1_sample.py` (36 s), `a2_verify.py primary 6` (~20 min), `a2b_tablebase.py`, `a3_build.py`; `b1_games.py` (3 min), `b2_screen.py quiet 6` (~8 min), `b2_screen.py tactic 6` (~14 min), `b3_build.py`, `b4_audit.py`; `c2_screen.py 6` (~3 min), `c3_build.py`; `validate_all.py 6` (about 12 minutes for all 15 files); `a4_report.py`, `a5_summary.py` for the tables. Everything is seeded; reruns reproduce the selection (engine searches at fixed depth are deterministic).

## Not done
- Mate-in-two threats (too rare to screen cheaply: roughly one in several hundred positions).
- The 500-puzzle reserve tranche was never needed or verified.
- No human review of any item; no motif (fork, pin) detector; no search for transposed or mirrored duplicates.
- No second de-biasing round for the classification set (captures, attacked pieces).
- The validator itself was not changed and `tools/selftest.py` was not re-run.
