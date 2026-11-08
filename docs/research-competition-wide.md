# Competition, wide survey: Lichess Learn and other free or cheap beginner products (8 Nov 2026)

Purpose: set the benchmark for the first hour and the whole beginner path. Companion to `docs/competition.md`, `docs/competition-chesscom.md`, `docs/competition-chess-steps.md`, `docs/chesscademy-research.md`.

Evidence labels: [V] primary page or source file read today; [S] secondary (search snippet, store listing, review site, summary by a fetch tool); [R] recalled, not rechecked; [I] inference; [H] hypothesis. Facts and structure only; no lesson text copied. Caveat on method: pages were read through a fetch tool that summarises with a small model, so counts below are summaries of the source, not my own line-by-line reading. Where I could cross-check by adding up, I did.

## 1. Lichess Learn (lichess.org/learn)

Source: the open-source app in `lichess-org/lila`, folder `ui/learn/src/` (file list, `stage/list.ts`, `score.ts` and all 18 stage files read) [V]. The learn page itself is a JS app and renders no stage list without scripts [V: lichess.org/learn gave only the title "Learn chess by playing" and an accessibility link].

### 1.1 Exact order (18 stages, four categories) [V: stage/list.ts]

| # | Category | Stage | Levels | What a level is |
|---|---|---|---|---|
| 1 | Chess pieces | Rook | 6 | Collect targets ("apples"): 1, 2, 3, 5 targets; then fewest-moves puzzles; then two rooks |
| 2 | | Bishop | 6 | Targets 2, 6, 6, 6; the last two need both bishops |
| 3 | | Queen | 5 | Targets 2, 4, 6, 7, 8 |
| 4 | | King | 3 | One target (the king is slow), then 4, then 6 |
| 5 | | Knight | 6 | Targets 2, 7, 5, 8 (jumping over obstacles), 6, 9 |
| 6 | | Pawn | 8 | One-step only, promotion, capture-then-promote, use all pawns, the second-rank double step, final free collection |
| 7 | Fundamentals | Capture | 5 | Take the black pieces (1 to 4 captures), later without losing your own |
| 8 | | Protection | 8 | Move an attacked piece away (2), cases with no escape (3), "do not leave anything undefended" (3). One move each |
| 9 | | Combat | 5 | Remove all black pieces; 1 to 2 captures each |
| 10 | | Check in one | 7 | Give check in one move, all pieces |
| 11 | | Out of check | 7 | Escape, block, capture the checker, knight check cannot be blocked |
| 12 | | Checkmate in one | 7 | Rook, smothered, queen plus knight, discovered, two "tricky" |
| 13 | Intermediate | Setup | 7 | Place the pieces on the starting position, back rank then pawn line |
| 14 | | Castling | 9 | Both sides; clear the path first; cannot castle after moving or through attack |
| 15 | | En passant | 4 | Capture en passant; only immediately; only on the fifth rank; take four |
| 16 | | Stalemate | 5 | Pick the move that avoids or finds stalemate |
| 17 | Advanced | Piece value | 5 | Choose the capture that wins most; illegal-move traps |
| 18 | | Check in two | 7 | Give check within two moves |

Totals [V by summing the stage files; the stage-name-to-count mapping for capture/protection/combat rests on the tool's per-file answers]: pieces 34 levels, Fundamentals 39, Intermediate 25, Advanced 12, **110 levels**. "Draw" and "fork" stage files exist in the list as commented-out entries [V: list.ts]; the file `fork.ts` is in the folder, so a fork stage was planned or retired.

### 1.2 Mechanics [V: score.ts, level files]
- Each level is a tiny board with a goal key (collect all targets, take all pieces, give check, etc.) and a **par** move count.
- Scoring: each apple 50 points, each capture 50 points (when enabled), plus a **move bonus**: 500 for par or fewer moves, 300 if slightly over par (allowance is the larger of 1 and par/8 extra moves), 100 if more. Level rank 1 ("three stars" in the UI, [I]) needs the full maximum, rank 2 within 200 points, otherwise rank 3.
- Stage rank: full maximum, or within the larger of 200 and 150 points per level, or lower. So **efficiency (moves for stars) is built in from the start**, not just completion.
- Some levels show hint arrows (first levels of rook, queen, knight, check in two). Failure resets the level; there is no penalty beyond the star rank [I from design, not tested].
- Hash-routed single-page app; progress is stored in the browser, with no account required [V: `storage.ts`, `hashRouting.ts` exist; contents not read; [I] that it is local].
- Pieces are a game of reaching squares first (apples), and the king is last of the piece stages and has the fewest levels.

### 1.3 Length to "Intermediate" [I]
Levels before Intermediate: 34 (pieces) + 39 (Fundamentals) = **73 levels**. Most are one to four moves and take 15 to 60 seconds each; my estimate is **35 to 60 minutes** for a first pass, 10 to 20 minutes for the pieces block alone. The first interaction (rook, level 1, one target, a hint arrow) comes within seconds [V for the level, I for time]. Lichess Learn has **no game**: it ends at "check in two" and sends the learner to play. No tactics beyond mate in one, check in two, and loose-piece safety in the Protection stage (which is the only real habit lesson) [V].

What to beat [I]: Lichess gets a new learner to a first move in seconds, with zero reading, no account and no cost. A rules block of about 34 piece levels and 73 levels before special rules is the same size as the chess.com block (35 challenges, section 2.1) and the same size as ours should be. Its weakness is that it teaches no judgement: nothing about trades beyond "take the higher piece", nothing about openings, and no game.

## 2. Other products

### 2.1 Chess.com Learn To Play, bots, puzzles
Already covered in `docs/competition-chesscom.md` [V there]: Learn To Play = 12 lessons, 35 challenges, order king, queen, rook, bishop, knight, pawn, en passant, capturing, check, out of check, checkmate, castling. Free tier limits: new-to-chess section free, one other lesson per day, 3 puzzles per day, about 20-25 bots [S, conflicting pages]. Beginner bots: roughly 15 named "Beginner" bots rated from about 250 (Martin) to about 850 (Karim); Wally about 180 [S: player blogs, a comparison site; not an official page; https://www.chess.com/blog/vitualis/beginner-bots-gauntlet-defeating-all-the-bots-in-one-run, https://chessiverse.com/compare/easiest-chess-bots]. Users say Martin does not play like a real beginner [S, same search]. Not read here: official bots page, daily puzzle page, the in-lesson screens.

### 2.2 ChessKid
- Free "Basic": unlimited games, **beginner lesson levels only**, 3 puzzles a day, bots level 1 to 3, limited videos, 10 workouts, 10 Vision Trainer sessions, 30-day game archive. Gold unlocks all lesson levels, puzzles, bots, videos [V: https://support.chesskid.com/article/413-whats-the-difference-between-a-free-account-a-gold-membership].
- Format: each class is a **video plus extra activities**; completing lessons raises a child's level up to a top "King" level [V: https://www.chesskid.com/learn/articles/complete-guide-to-chesskid]. The page gave no lesson count, order or first-screen description.
- Price: about $10 a month or $49 a year for Gold [S: search summary of a support page; the membership page itself returned only its title, so not [V]]. Common Sense Education notes missing closed captions on video [S: https://www.commonsense.org/education/reviews/chesskid].
- Not read: the actual lesson list, how long to first game, the 150+ video-lesson claim (it belonged to a different app listing).
- What to beat [I]: a child-friendly path, video-led, with a paywall after the beginner levels. Our edge is a text/board path that is free in full; theirs is production and voice.

### 2.3 Chessable and free beginner courses
- Chess.com's Courses run on Chessable's MoveTrainer (spaced repetition: repeat the correct move, longer and longer intervals) [S: https://www.chess.com/news/view/im-danny-rensch-releases-new-chessable-course-for-beginners and chess.com announcements; rating of 4.6 stars from 50+ reviews is chess.com's claim].
- IM Danny Rensch's free beginner course: re-recorded videos for MoveTrainer, covers fundamentals, opening focus, key tactical patterns and finishing endgames; free, with a week of Chessable PRO offered. The page gave no lesson count or length [V: that news page]. Chessable app is free with in-app purchases; PRO adds unlimited free-course slots and offline use [S].
- Not read: Chessable's own beginner course listing (404 on the guessed URL), any user reviews of the beginner course, pricing of paid beginner courses.
- What to beat [I]: spaced repetition of **memorised variations** suits openings, not understanding; for a true beginner the free course is video plus drill with no game.

### 2.4 Noctie
- Store listing [V: https://apps.apple.com/us/app/noctie-chess/id6444289077]: human-like bots in **25 levels** (easiest about 600 Elo, strongest about 2700), colour-coded move feedback as you play, opening training from a chosen or imported repertoire, tactics puzzles and flashcards built from your own struggles, position builder, some lessons and endgame scenarios. Requires internet. Free to download; subscription "Club Noctie" about $14 a month or $99.99 a year with a trial. Rating 4.7 from 639 ratings. Reviewer remarks: game review limited to move quality and auto puzzles; features hard to discover.
- It is a play-and-practise tool, not a syllabus: no rules block found [V for the listing]. What to beat: the play-with-feedback loop with human-like opponents (Maia-style); we already plan this [per CLAUDE.md memory].

### 2.5 Aimchess
Analyses your recent games across six areas (tactics, endgame, advantage capitalisation, resourcefulness, time management, openings), compares with your rating peers, builds a weekly plan and puzzles; free: one 40-game report a month, weekly plan, one daily training session; Premium $7.99 a month or $57.99 a year [V: https://aimchess.com]. Needs games already played, so not for a new learner. It is the model for our Games review loop.

### 2.6 Listudy
Free and open source; spaced-repetition for openings, tactics, endgames against Stockfish, daily puzzle, an "AI tutor" link; **no dedicated beginner lessons** seen [V: https://listudy.org home page]. Not a competitor for the first hour; a comparable for opening repertoire practice.

### 2.7 Chessly (Levy Rozman / GothamChess)
Membership to 70+ openings and skills courses, XP, achievements, leaderboards, an AI called Levi; no beginner-specific track named, prices not on the page [V: https://chessly.com]. Trustpilot: 3.5/5, one reviewer says the beginner, intermediate and tactics courses took them from about 450 to 1650 on chess.com (anecdote), another notes a broken leaderboard [S: https://jp.trustpilot.com/review/chessly.com]. Format of lessons not established.

### 2.8 Magnus Trainer, Play Magnus
Magnus Trainer (now a chess.com product): interactive lessons and puzzle-style mini-games, "250+ lessons", most behind membership; free with in-app purchases; memberships 1 month, 12 months or lifetime, with store price points from about $38 to about $300 [V: App Store listing]; 4.8 from about 13K ratings. One sample reviewer said piece introductions came too fast, early mate practice was too hard, and lessons were slow to open [V: same page, a single review]. Play Magnus (separate, free) has Magnus explaining the basics, then tactics and strategy tips [S: store summaries]. What to beat: the "lives" model gates practice; a beginner who stumbles at mate practice hits a wall with no ramp [I from one review].

### 2.9 Chesscademy (new points only)
Nothing new fetched; see `docs/chesscademy-research.md`. Its design (Paths with lessons, tactic sets, game sets, test-out games) is still the nearest to our own shape, and its failures (single-answer exercises, hints that repeat, no why) are the checklist for our items.

### 2.10 Udemy and Coursera
Udemy has many beginner courses; sample facts from a search summary: a 40.5-hour all-phases course by a FIDE Candidate Master; a 5-hour introduction; a free crash course for players below 900; a fundamentals course of 3 sections, 51 lectures, 5h34m that assumes the learner knows the moves [S: search results listing udemy.com course pages]. I did not open any course page (one fetch of a Udemy URL returned no usable syllabus in the tool output, and I did not retry), so no syllabus order is recorded. No Coursera beginner chess course was found [S, negative]. Pattern [I]: long video catalogues, rules first, then three phases (opening, middlegame, endgame) by level; no board-testing loop.

### 2.11 Duolingo Chess
Search summaries only: short lessons, rewards, streaks; recommended as a rules starter for younger or total beginners, with the criticism that it is narrow and less suitable for broader learning [S: search summary; the one article I tried to open was blocked as a copy of walled content, so I did not read it]. Not read: Duolingo's own help page on chess, its syllabus, whether play is included, price.

### 2.12 Chess Steps
Nothing new beyond `docs/competition-chess-steps.md`. For the table: Step 1 reaches "800" by their claim after rules and basic mates; about 486 exercises in the Step 1 workbook [S, there].

### 2.13 What strong coaches say the order should be (Yusupov)
Quality Chess publishes Yusupov's course as nine volumes in three levels: Fundamentals (Build Up Your Chess 1, Boost Your Chess 1, Chess Evolution 1), Beyond the Basics (volume 2s), and Mastery (volume 3s) [S: search summary of publisher and retailer listings]. Partial chapter titles seen: early in Build Up Your Chess 1 "Mating motifs", "Mating motifs 2", "Basic opening principles" (an excerpt that was garbled; another copy was on an unauthorised-looking site so I did not open it); in volume 3 "Combinations involving promotion", "Evaluation of the position", "Pawn endings" [S, partial]. The two retailer pages I tried for a full table of contents returned 403, so **no complete chapter list is recorded**. What can be said: the order of the Fundamentals tier is mating motifs and tactics early, openings as principles, and position evaluation and pawn endings much later [S, partial]. This matches the "tactics before strategy" order in `docs/competition-chess-steps.md` and the chess.com coach advice quoted in `docs/competition-chesscom.md`. Do not treat the Yusupov row as established until a publisher PDF excerpt is read.

## 3. Comparison table

Times are estimates for a first pass unless marked.

| Product | Rules block | First interaction | First game | Where tactics start | Where it stops (rating) | Price | What to beat |
|---|---|---|---|---|---|---|---|
| Lichess Learn | 34 piece levels; 73 levels before special rules [V], 35 to 60 min [I] | A piece collecting a target within seconds, no reading [V] | None in Learn; play is elsewhere | Mate in one at the end of Fundamentals; check in two last; loose pieces in Protection [V] | After 110 levels, about "knows the rules" (about 0 to 600) [I] | Free, no account | Instant first move; stars-for-fewest-moves; zero friction |
| Chess.com Learn To Play | 12 lessons, 35 challenges [V] | Coach plus first challenge on the King lesson [V order] | Bots after the course; guided path says play bots next [S] | Beginner path "Capturing the pieces" and puzzles [S] | Advanced path courses; the free tier stops early | Free: first section and one lesson a day; Premium paid | Voiced coach, bots, 100M players |
| ChessKid | Not established | Video lesson [V format] | Games from day one on free [S] | Not established | Up to a King level [V] | Basic free (beginner levels only); Gold about $49 a year [S] | Child-friendly production, safe community |
| Danny Rensch free course (Chessable) | Not given | Video then MoveTrainer drill [V] | Not included | Key patterns, in the course [V, no order] | Beginner to fundamentals [V] | Free | Spaced-repetition recall of moves |
| Noctie | None (lessons minor) | A bot game at 600 Elo or an opening drill [V] | Immediately | Auto puzzles from your mistakes [V] | Up to 2700 bots | Free with a $14 a month club [V] | Human-like bots with instant feedback |
| Magnus Trainer | Introductory lessons in the 250+ [V] | Lessons and mini-games with lives [V] | Not established | Mini-games from beginner [S] | Foundations to endgames | Free start; membership about $38 to $300 [V] | Magnus brand and mini-game feel |
| Chessly | Not a beginner product | Course video [S] | None | Courses | 70+ courses | Membership (price not read) | Personality (GothamChess) |
| Aimchess / Listudy | Not for new learners | Needs games / a repertoire | Needs games played | Puzzle from your errors / tactics sets | Intermediate | Free tier; $8 a month / free | Personal weakness reports; free openings drill |
| Udemy courses | Video sections, hours vary [S] | Video | None | Varies, often later | Beginner to club | A one-off price (not read) | Length of catalogue only |
| Duolingo Chess | Not read | Short lessons with streaks [S] | Not read | Not read | Not read | Not read | Streaks and short sessions |
| Chess Steps | Step 1 (about 486 exercises) [S] | Trainer plus workbook | At the club | Step 2 (tactics before position) [S] | Step 6 to about 2100 [S] | Books | Volume per theme, steps with exams |
| Yusupov series | Not a rules book | Reading and exercises | None | Early (mating motifs) [S, partial] | Mastery tier (volume 3) | Books | What strong coaches choose to teach first |
| Chesscademy (defunct) | Video lessons | Video | Game sets after lessons [V] | Course 2 (fork, pin, skewer) [V] | Endgames and a Dragon path | Free (died) | Test-out games, tactic sets, the idea of paths |

## 4. What this means for us [I]

1. **The rules block is a 30 to 60 minute object, not four hours.** Lichess (34 piece levels plus 39 Fundamentals) and chess.com (35 challenges) agree. Our own pieces block should aim for this scale, with a first interaction on the first screen and no reading. Matches decisions D55 and D56.
2. **Both free leaders stop short of a game.** Lichess ends at check-in-two and chess.com sends beginners to bots. A guided real game inside ten minutes is a place to be different, not just equal.
3. **Stars for fewest moves (Lichess) is the cheapest motivation device in the field.** It adds efficiency to completion with one number per level. A "reach" step with par moves is close to what is already planned; whether to show stars is a design choice (mastery evidence, rule 6, should still be the real measure).
4. **Loose-piece safety is taught by Lichess in the 4th Fundamentals stage** (move the attacked piece, no escape, do not leave anything hanging): same habit as our safety scan, and shows it is a stage-one habit for the best free competitor.
5. **Competitors with video, voice or bots beat us on production, not on correctness;** none of the products I opened claims machine-checked content, so rule 1 remains a distinguishing point but must not be overclaimed (I found no evidence either way for their internals).
6. **Free tiers are gated by day-caps (chess.com, ChessKid) or lives (Magnus Trainer).** "Free in full, offline, no account" is a real difference.

## 5. Not read, or only partly read (explicit)

- Lichess `apple.ts`, `levelCtrl.ts`, `storage.ts` and the stage `scenario` code: names seen, contents not read. Real minutes per level not timed; the 35 to 60 minute figure is an inference. The mapping of capture/protection/combat to level counts comes from three answers of a summarising tool; a quick recheck of `protection.ts` and `combat.ts` is cheap.
- Chess.com: official bots page, daily puzzle page, in-lesson screens; the Beginner and Intermediate course pages.
- ChessKid: lesson list, lesson count, first-game timing, the membership page's price (title only).
- Chessable: own beginner listing (404), paid course reviews.
- Noctie: its own website, lessons list; Chessly: price, lesson format; Magnus Trainer: the lesson list; Play Magnus.
- Udemy course pages (any syllabus); Coursera (nothing found).
- Duolingo Chess: all primary pages (the one article I tried was blocked).
- Yusupov: complete tables of contents (two retailer pages gave 403); no copyrighted excerpts from unauthorised scans were opened.
- User reports specific to Lichess Learn: none found in my searches (negative result).
- Reddit not attempted (blocked by project policy).

## Sources opened today

- https://lichess.org/learn
- https://github.com/lichess-org/lila (via raw files `ui/learn/src/stage/*.ts` and `score.ts`; GitHub API listing of `ui/learn/src` and `ui/learn/src/stage`)
- https://support.chesskid.com/article/413-whats-the-difference-between-a-free-account-a-gold-membership
- https://www.chesskid.com/learn/articles/complete-guide-to-chesskid
- https://www.chess.com/news/view/im-danny-rensch-releases-new-chessable-course-for-beginners
- https://apps.apple.com/us/app/noctie-chess/id6444289077
- https://apps.apple.com/us/app/magnus-trainer-train-chess/id1097863089
- https://aimchess.com
- https://listudy.org
- https://chessly.com
- Search summaries (not opened): ChessKid reviews, Noctie, Chessly Trustpilot, Udemy listings, Yusupov series, chess.com beginner bots, Duolingo chess.
