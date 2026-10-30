# Lessons: opening principles, opening structure and game study (author slice A4)

Files: `content/lessons/L-OPN-*.json` (6) and `L-GAME-GUESS-1.json`, `L-GAME-OWN-1.json`; items `content/items/lesson-opn-1..8.json` (IA4-nnn, positions PA4-nnn, blocks of 20 per lesson). All text original. Every position was built by replaying legal moves from the start (`python-chess`); none is hand-typed FEN except one-line board steps that start from such a position. Review status of everything: `needs-human` (strategic wording, plan classes, accepted sets). Evidence labels: [V] machine-verified by `tools/validate.py` (Stockfish 19 Lite, depth 16, one thread), [I] my inference, [H] hypothesis.

Validator results at hand-in [V]: all 8 item files pass 100% of their claims (62 items); all 8 lessons pass `validate_lessons.py` with 0 errors and 0 warnings; `tools/check_all.py` shows no error for these files (one warning: skill `OPN.REPERTOIRE.BLACK` has items but no lesson, see below).

## Lessons

| Lesson | Skill / depth | Items | What the learner can do afterwards |
|---|---|---|---|
| `L-OPN-PRINCIPLES-1` | OPN.PRINCIPLES D2 (builds on `L-FND-OPENING-1`, which teaches the three habits) | IA4-002, 004-008 | State the condition under which a habit works (nothing of mine is loose, no threat pending); predict when castling or a developing move fails because of the opponent's last move |
| `L-OPN-NONDEV-1` | OPN.NONDEV D1 | IA4-021..028 | Tell a developing move from a wasted one by what new work a piece does; know the cost of a rook-pawn move or early queen trip is set by what the opponent can do with the time, and that it can be nearly free |
| `L-OPN-PUNISH-1` | OPN.PUNISH D1 | IA4-041..051 | Meet a Scholar's-mate setup; refuse the queen in Legal's trap; play or decline the Fried Liver sacrifice; see why 4.Ng5 works in one Italian position and fails in another |
| `L-OPN-DEVIATION-1` | OPN.DEVIATION D1 | IA4-061..071 | Run three questions (what changed, what is loose, which habit) on a surprising move; judge whether an offered pawn is a gift or bait |
| `L-OPN-STRUCTURE-1` | OPN.STRUCT D1 | IA4-081..087 | Say that two move orders can reach one structure; pick plan-consistent moves in Carlsbad, isolated-d-pawn and open-centre positions; see that a push (b4) belongs to a structure |
| `L-GAME-GUESS-1` | GAME.GUESS D1 | IA4-101..106 | Commit to a move before the reveal in the Opera Game, compare with engine and plan |
| `L-GAME-OWN-1` | GAME.OWN D1 | IA4-121..125 | Mark up to three critical moments before an engine, and check the marks against routine / slip / blunder bands |
| `L-OPN-REPERTOIRE-1` | OPN.REPERTOIRE.WHITE D1 (split 30 Oct 2026: one lesson per node) | IA4-141, 144, 145, 148, ISsp12-1..5 | A White repertoire from his own games; forcing positions (remember the move) against flexible ones (remember the plan) |
| `L-OPN-REPERTOIRE-BLACK-1` | OPN.REPERTOIRE.BLACK D1 | IA4-142, 143, 146, 147, ISsp12-10..15 | A Black repertoire against 1.e4 and 1.d4; reading the Openings page for frequency, not worth; checking that a reply is sound |

## Sources and rights
* Games: the Opera Game move list (L-GAME-GUESS-1) is read from Edward Lasker, *Chess Strategy* (1915), `sources/raw/edlasker_chess-strategy_gutenberg5614.txt` lines 1417-1560 (US public domain per `library/REGISTRY.md`), checked move by move against python-chess [V]. The beginner's game in L-OPN-NONDEV-1 / L-GAME-OWN-1 is from lines 1311-1416 of the same file (the engine confirms it ends in mate). Moves are facts; all commentary is mine. The sample game in L-GAME-OWN-1 (Elephant Trap line) is a well-known move sequence used as practice, not a quoted record.
* Ideas and conditions come from the synthesis sheets (Em. Lasker 4.2-4.5, 4.8; Ed. Lasker K6, K7, K9, K10; Capablanca CI-45..50), never their sentences. Opening names are not used in learner text except common ones (Legal's trap, Fried Liver, Carlsbad, Scholar's mate).
* No openings statistics are quoted anywhere. The only mention of the explorer is a description of what the Openings page shows (`L-OPN-REPERTOIRE-1`, card 6); it depends on no data.

## How the claims work (and a lesson learned)
Engine numbers change with the search configuration: the same move measured 109 centipawns worse in a 40-line search and 62 in the validator's 10-line search. So (1) every number in learner text is a threshold that a claim checks ("at least 50 centipawns worse", "within 40 of the best"), never a measured value; (2) accepted sets are the engine's top moves within a stated margin, listed so that the validator's top-k window contains them; (3) wrong-but-plausible moves get `feedback_by_move` only with a `move_loses` claim behind the sentence; (4) forced-mate statements rest on `mate_in` or on `move_loses` with a mate-sized threshold. Rules facts in text (who attacks f7, which pawns are isolated, that two move orders reach one position) are asserted in the build scripts with python-chess, not by validator claims.

## Known weaknesses and what was not verified
1. **Accepted sets reject some sound moves.** `best_move_in` takes the engine's top moves; a learner who plays another sound move 40-60 centipawns lower is marked wrong, with feedback only where I added a claim. This is the Chesscademy failure mode in mild form. A "also fine" tier in the app would fix it.
2. **Plan-class items are soft.** In L-OPN-STRUCTURE-1 the accepted moves are the engine's top moves that I classed as the structure's usual plan (b4/Na4/Bxe4 in the Carlsbad, Bb1/Be4 for the isolated pawn, Re1 in the open centre). The engine does not separate plans at depth 16: in several of these positions moves of other kinds are within 10 centipawns. The failing look-alikes (g4, c5, Bxh7+, Nxd4, b4 in the wrong structure) are checked at 150-300+ centipawns, so those contrasts are solid; the plan labels themselves are my judgement [I].
3. **Cue levels are approximate.** The prompts of cue-2/3 items still name the situation ("White to move in the Carlsbad structure"), because a plan cannot be asked for without a context.
4. **Skill graph.** The lesson skill field holds one id, so `OPN.REPERTOIRE.BLACK` has five items but no lesson (check_all warning). Fix by a second repertoire lesson for Black or by letting a lesson list two skills.
5. **Duplicate positions across families.** Several PA4 positions equal other authors' (e.g. PA4-002 = PA0-5). They are kept under their own families; the leakage check should treat them as one family.
6. **Two items were removed before shipping.** After the coordinator's note that `L-FND-OPENING-1` already teaches the three habits, IA4-001 (can the f1 bishop move at the start?) and IA4-003 (castle) were dropped from `L-OPN-PRINCIPLES-1`, and that lesson was re-aimed at conditions (depth D2). No ids were reused.
7. **Opera Game commentary** states only what claims show (engine rank at depth 16, mate in two). It does not say why Morphy chose a move.
8. **Not checked:** nothing was run on the app (no UI test of the new answer shapes `options`); the L-OPN-REPERTOIRE card that mentions the Openings page assumes the route `#/openings` exists; I did not read the generated openings data.

## Open questions
* Should "guess the move" be scored by an explicit tier (exact match / engine-approved / plan class) in the app? The data now carries `plan.*` tags and `within_cp` margins, but the scoring rule is not defined in the schema.
* Is a band scheme (routine up to 40 cp, slip 50-150, blunder 200+) acceptable as the measuring stick for `GAME.OWN`? It is arbitrary [H] and stated as such in the lesson.
* Which of the 2-per-lesson `practice` pools should draw from `kind.game` items only?
