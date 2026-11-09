# What people ask about chess: Chess Stack Exchange (8 Nov 2026)

Source: the public Stack Exchange data dump for chess.stackexchange.com, file `chess.stackexchange.com.7z` (35.7 MB, snapshot 6 April 2024, from the Internet Archive item `stackexchange`), downloaded with Andrew's go-ahead 8 Nov 2026 into `library/data/chess-se/` (gitignored, not committed). Licence CC BY-SA 3.0: these are internal research notes; questions are paraphrased with their question numbers (link form `https://chess.stackexchange.com/questions/<id>`). Any learner-facing reuse would need the site's attribution (author names, links) and is not planned. Labels: [V] counted here from the file, [I] inference.

## What the data is [V]
8,955 questions (2012 to April 2024). Top tags: opening 1,672, engines 1,077, analysis 947, rules 646, endgame 591, strategy 561, learning 548, fide 403, checkmate 354, rating 352, tactics 316, draw 222, beginner 191. View counts are lifetime and driven by search engines, so they measure what the public searches for, not only beginners. Many askers are casual or parents, not students. The site skews to rules and trivia; it under-represents the "what do I do in a game" questions. [I]

## Themes by weight (questions and total views; themes overlap, so do not add) [V, keyword counts on titles of the 4,981 questions in the beginner-relevant tags]
| Theme | Questions | Views | Most-viewed question (id) |
|---|---|---|---|
| Learning, improving, age, plateau | 331 | 1.03 M | Can I improve, or am I too old (6315, 29.8 k) |
| Ratings and what Elo means | 381 | 1.04 M | Percentile for my rating (414); rating gain in a year (2771) |
| Draw and stalemate, lone king | 117 | 860 k | How many moves until a draw with only a king left (2500, 290 k); why stalemate is a draw (1412, 61 k) |
| Illegal moves, touch-move, clock, etiquette | 167 | 591 k | What happens after an illegal move (181, 47 k); say "check" aloud (5904, 93 k) |
| Openings for beginners | 264 | 597 k | What is the Bongcloud (27227) |
| Check and king rules | 56 | 512 k | Can the king capture its attacker (2703, 198 k); can two kings stand adjacent (4596, 131 k) |
| Castling conditions | 130 | 424 k | Why illegal to castle with both hands (22312, 51 k); when is castling possible (80, 25 k); castling out of or through check (4414, 33 k) |
| Basic mates | 29 | 366 k | Can knight and king mate a king (1239, 197 k); how to mate with a rook (4886, 49 k); two bishops (4931, 37 k) |
| Piece values and how pieces move | 27 | 351 k | Where do king and queen start (2489, 274 k) |
| Blunders and calculation | 227 | 344 k | How to cut down blunders (2596, 25 k) |
| Promotion | 55 | 298 k | The promotion procedure (4482, 97 k); promote twice to a queen (8914, 29 k) |
| Notation and describing moves | 108 | 226 k | How to describe moves aloud (2231, 48 k) |
| En passant | 41 | 121 k | When and why it was invented (811, 31 k) |

## What this adds to the learner-voice picture
1. **The same few rules dominate every year**: lone-king draw, stalemate, what "check" requires, adjacent kings, castling conditions, promotion. These are exactly the confusions chess.com's rules lessons skip (they end after castling). Our first-hour set-up, castling, stalemate and special-move lessons are validated by this demand. [I]
2. **"King versus king" and "only a king left"** are the single most-viewed rules question. Our FND.DRAWS work should state plainly: a bare king can still be mated only if the other side has enough material; what ends the game is checkmate, stalemate, or a draw rule. [I]
3. **Over-the-board etiquette** (illegal move, touching, saying "check", promotion procedure, the clock and increment) is a large cluster with no counterpart in an online-only curriculum. Real beginners who walk into a club or a school match meet it. Our coverage of this is thin (touch-move and over-the-board readiness not covered; the earlier forum research found the same gap). [I]
4. **Basic mates are searched constantly** (K+R, K+B+B, K+N+B, K+N+N): our endgame strand has the mates; check they are early enough in the path for people who search for them. [I]
5. **Adults ask "am I too old" and "how do I improve"** in numbers; a short honest answer (what the evidence says, what a sensible weekly routine is, with evidence grade) belongs on Start or Today, not in a lesson. [I]
6. **Ratings confuse people** (percentile, what a class means, how online ratings compare): relevant to our rule that a rating attaches to items and learners with a stated evidence grade. A "what a rating means and does not" card is a cheap fix. [I]

## Recommendations (ROADMAP Phase 2m, "From the question data")
- Lesson or card: **touch-move, saying check, illegal moves, promotion procedure, increment and the clock**: one short over-the-board readiness lesson in a later Foundation stage, never in the first hour.
- **Draw rules in one place**: stalemate, lone-king and insufficient-material draws, repetition and the 50-move rule, how a draw is claimed. The forum research found "how to claim a repetition" uncovered; this data agrees.
- Make sure **K+R, K+Q, K+B+B, K+N+B** mates appear early in the endgame strand and as drills.
- A **"Is it too late to start?"** note and a **"What a rating means"** card.
- Keep the first-hour stalemate and castling-conditions lessons as designed; do not trim them.

## Not covered by this file
Answers' content (not read; we do not use it), question comments, the 2024 to 2026 gap, and whether the same demand holds on Reddit (blocked in our tools).
