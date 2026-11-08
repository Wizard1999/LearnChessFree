# Competition lessons seen through YouTube (auto-caption research)

Written 8 Nov 2026. Method as in `docs/research-witty-alien-videos.md`: yt-dlp from the scratchpad venv, auto-captions only (no video files), one retry on HTTP 429. Transcripts and `info.json` files are in the scratchpad (`...\scratchpad\cv\`), not in the repo; nothing below quotes a caption. Everything is paraphrased. Search was done with yt-dlp `ytsearchN:` queries (about 60 queries, roughly 150 distinct results screened by title and length), then captions fetched for 41 videos (31 had usable captions), and 24 read in some depth.

## Evidence labels
- [V-video] seen or heard in a transcript, as understood from garbled auto-captions. Lesson names are what a narrator read out; spelling and numbers may be off.
- [V] title, channel, date and length from each video's `info.json`.
- [S-web] from a web page I fetched (ChessKid lesson guide, a chess.com community blog), used only where no video covered the point. Not video evidence.
- [I] my inference. [H] hypothesis.

**Honest headline:** I did NOT find any video that walks through chess.com's Beginner, Intermediate and Advanced Learn courses (titles and order). I found one good screen-recording of the free "New to Chess" ("Learn to Play") course, one 2017 walk through a Lessons course, a 2008 promo for the older Chess Mentor, and several indirect sources. See "What we could not see".

## Caption hazards
1. Chess terms are mangled ("pawn" appears as "upon", "bishop" as other words, and so on). Treat all moves as unverified.
2. Machine-translated captions (the Palm Beach Chess video was dubbed: rook = "Turk", bishop = "elephant", knight = "horse") say things the original English did not. I use only the structure.
3. A few channels read lesson text aloud with a synthetic voice (Gamer Reels). The title says "chess.com", but the star-collecting tasks look like Lichess's pieces course, so I do not rely on it for chess.com [I].
4. Dates: `upload_date` is the upload, not when the lessons were recorded. Chess.com has rebuilt its Learn area several times; older videos may show older versions.

## Table of videos

Usefulness: 3 = shows lesson names, format or pricing in detail; 2 = partial or indirect; 1 = reaction/context only; 0 = nothing for us. "Read" = how closely I read the transcript (full, part, skim).

| id | channel | date | length | covers | use | read |
|---|---|---|---|---|---|---|
| `obXxGFBBEQk` | A Legend warrior | 2025-08-05 | 13:41 | chess.com free Learn to Play lessons, end of the course: captures, check, escaping check, queen, king and goal, checkmate, castling | 3 | full |
| `2lWo1CxTaos` | Chess Nerd Bird | 2017-09-01 | 44:37 | chess.com Lessons course "Essentials of Opening Play", ten lessons with feedback | 3 | full |
| `FmRNlDZmK5Y` | jacksark | 2025-04-12 | 22:20 | whole-site critique; says he did 400+ chess.com lessons; what is paid | 3 | skim, targeted |
| `D7gfDpEiDks` | Han Schut | 2022-04-17 | 1:01:20 | Dutch Steps Method: structure, books, didactics, exercise types | 3 | full |
| `I1gAp8Q4Qt8` | Chesstrugles.roadtogm | 2024-08-17 | 1:56:28 | live first-time run of the free Chessable course by IM Danny Rensch (part 1) | 3 | skim (chapter 1) |
| `06MFMa-jppg` | Anthony Giles | 2026-01-30 | 56:03 | Lichess site tour incl. Learn menu: basics, practice, coordinates, study | 3 | targeted |
| `hRLOEjAnfBk` | Palm Beach Chess (NM Bryan Tillis) | 2020-09-07 | 17:30 | Lichess "Piece movement" star-collecting levels, with teaching advice | 3 | full |
| `CEj9pxVCEaw` | Maverick Chess | 2025-12-21 | 15:40 | 7-day trial of Chessly: layout, courses, drills, XP, price | 2 | full |
| `OfZ1thrQrAQ` | jacksark | 2026-02-23 | 13:03 | critical review of Chessly courses and drills | 3 | full |
| `LtvLEqc1VPc` | ZorkChess | 2025-02-20 | 2:46 | Chessly 2.0 vs old Chessly | 1 | full |
| `_Bc3PtAdSF8` | Chess Boot Camp | 2025-11-14 | 8:22 | Noctie placement game and rating estimate | 1 | full |
| `miv4Rrk-6Sw` | Chess.com | 2008-09-30 | 7:02 | promo for the older "Chess Mentor" interactive lessons | 2 | full |
| `vzsbroy1J1Q` | Chess.com | 2016-04-19 | 19:03 | Danny Rensch on "Drills" under the Learn menu | 2 | skim |
| `ej_fnsdsksA` | Chess.com | 2021-07-14 | 19:47 | official "how to play" video (rules script) | 2 | skim |
| `S5GIpAM-aWQ` | Chess.com | 2019-03-26 | 3:03 | official "Playing a game" video, ends in "put it into action in the challenges" | 2 | skim |
| `Rwnfs-E4xlI`, `XgUqRMYE1SY`, `7TAkzIFl7io`, `NFUrJDgvwR0`, `6XWbK9ZdL2E` | Chesscademy | 2017-01 | 4-13 min each | the Getting Started series (#1 pieces, #2 setup and notation, #4 strategy, #5 tactics part 1, #7 lone-king mates) | 2 | skim |
| `zD6iWxRO-K4` | Gamer Reels | 2026-10-20 | 8:54 | rules recap then star-capture piece levels, synthetic voice (title says chess.com; see hazard 3) | 1 | skim |
| `2K1_P71egag` | Alex Payne | 2026-11-07 | 16:19 | 7 days from zero; says all chess.com lessons took about 3 days | 2 | full |
| `oyNJ91YJGJM` | rue | 2026-01-03 | 23:59 | 7 days "0 to 1400" mostly bots and openings; no lessons shown | 1 | skim |
| `44pG6hL6f1g` | Dylan Bolt | 2026-10-09 | 16:45 | 7 days from zero; confusions: stalemate, castling, en passant | 2 | skim |
| `7HZoyNFP-BE` | Dina Belenkaya | 2026-06-14 | 16:59 | 4-week coaching of a 800-rated player; no app lessons | 0 | skim |
| `mjnzhf8K_lo` | GothamChess | 2026-03-28 | 51:35 | Gotham reviews a streamer's first games; classic first-month mistakes | 1 | skim |
| `rUTYH3v3HiQ` | GothamChess | 2020-07-29 | 54:37 | one-hour live lesson with a new player | 1 | not read (captured only) |
| `H3SwfEv_TRo` | Titan | 2023-03-24 | 2:46 | "how to use chess.com" tutorial, little on lessons | 0 | skim |
| `yGom1V5qRLE`, `_4KBwhbbR0Y` | Chaya Chess Academy; Better Chess Training | 2023, 2021 | 3:36; 12:27 | generic Lichess tours | 1 | not read |

Found and judged relevant by title but with NO captions available (the "not seen" pile): `YDDyoWQuBOQ` (AslanTZ, "All New to Chess Lessons Completed", 27:27), `Fnmf36RbhgA` and `ZdFv3I5H_oE` (Regnaz HQ, Lichess Chess Basics stage walkthroughs, 2:39 and 3:07), `TEkw1PmNH3o` ("Learn Chess for FREE", Lichess Learn by Playing), `qUhOOgJTuik` ("Complete 5 Tasks" chess.com Level 1), `Fl54HiXyOkE` (change coach in chess.com lessons), `MUP79Jni1sc` (ChessKid all features, 17:30), `0YeTAU3av_g` (Chessimple, Chess-Steps overview), `sjpKC9SMvKs` and other ChessKid tactics videos, and the Noctie channel's own tutorials (`sXhzZLlUync`, `Zl5jLt2HTo4`, `awWbLMAA4xo`, `9D8WBVnDX5I`). Also seen in results, not fetched: ChessKid "What is ChessKid" (`evtKzun4sng`, `dACeJPjpJkE`), Chessable review parts 2-4 (`4u5dyQg_2dQ`, `hOKwHK9pjq4`, `64ceK9Wkt88`), and Chess.com's "How to Play Chess" series (`lBsWZqv5acI`, `XlxDsTzUqbY`, `ffRmXZZDuWM`).

## Findings per product

### 1. Chess.com Learn: the free "New to Chess" course
Source: `obXxGFBBEQk` (Aug 2025, the viewer replays the course after resetting his account), `ej_fnsdsksA`, `S5GIpAM-aWQ`.

- **Lesson order near the end of the course** [V-video]: a pawn lesson (the two-square first move and en passant), then captures ("most captures work like normal moves, pawns capture diagonally"), then check, then getting out of check (three ways: move, block, capture), then a queen movement lesson, a "king and the goal" lesson, checkmate, and castling as the last lesson. The viewer says this closes the "learn to play" lessons. He says earlier lessons cover piece movement (referred to as "episode two" of his series) [V-video].
- **Lesson format** [V-video]: a short explanation panel in plain text (sometimes with an optional watch-the-video prompt; the viewer says he does not watch it), then 3 to 5 "challenges" per lesson. Each challenge poses a question about a board position: "can you find a capture for white", "what can white capture", "find white's best capture" (several captures exist, one is good), "find the check", "find a move that blocks", "block the check and deliver a check in one move", "can you block the bishop and prepare to castle". A "Lesson complete" message appears at the end.
- **Difficulty ramp inside a lesson** [V-video]: the first challenge has one obvious answer; the last often has several legal answers and asks for the best one (captures) or two things at once (block with check).
- **What the on-screen coach says** [V-video]: after a right answer it confirms briefly; wrong answers are not shown in this video. Rules are stated as general sentences ("a king can never actually be captured", "you must escape check, there are three ways"), not as discovery.
- **Mechanics**: tap or drag a piece on the board; no typing. No timer, no score visible [V-video]. The viewer notes his progress was reset when he used a new account, so progress is tied to the account [V-video].
- **Pace** [V-video]: lessons of 3 to 5 challenges took him roughly 40 seconds to 1 minute each, so the whole later half (6 lessons) is about 8 minutes of play with a viewer who already knows the answers [I].
- **Official "how to play" video** (`ej_fnsdsksA`, 19:47, Danny Rensch) is a lecture, not interactive: board, rook, bishop, queen, knight, pawn with promotion and en passant, king, check and its three answers, checkmate, stalemate vs mate, castling, board set-up. It ends with an invitation to make a free account [V-video]. This is the same script as the Chessable course in section 5, so we can treat the free chess.com course content as: lecture script plus challenge sets [I].
- **"Playing a game" video** (`S5GIpAM-aWQ`) [V-video]: after the rules, a model game is walked through to show two pieces working together and a king surrounded by its own pieces being mated; the video ends with "put your ideas into action in the challenges". So the course goes rules, then a narrated game, then challenges, which is close to our "game early" rule.
- **Pricing and paywall** [V-video] / [S-web]: the 2025 critic (`FmRNlDZmK5Y`) says lessons are a paid feature, that he completed over 400 of them as a beginner and rates them very highly (10/10), mostly because they are quick to finish, engaging and efficient; he says you could do them all in a month. A chess.com community blog [S-web] gives the same four-level Guided Path (New to Chess, Beginner, Intermediate, Advanced) plus a topic Lesson Library, and a table: the New to Chess course is free for everyone; free accounts get 1 lesson per week; paid tiers get unlimited lessons; coach explanations only at the top tier. I did not verify that table against chess.com itself [H]. Alex Payne (`2K1_P71egag`) says he did "all chess.com lessons" in about 3 days alongside puzzles on a free premium trial [V-video], consistent with a fast, linear path.

### 2. Chess.com Learn: Beginner, Intermediate, Advanced courses
- **Not seen as a path.** The only course-level lesson walkthrough is `2lWo1CxTaos` (2017): a lesson set called "Essentials of Opening Play" [V-video]. It is useful as a sample of the older Lessons format:
  - Lesson topics, in the order shown: develop toward the centre (knight to f3 better than to the rim), do not bring the rooks out early, learning the Four Knights move by move, the Ruy Lopez, the Danish Gambit as the cost of greed, the Smith-Morra Gambit, the Queen's Gambit as a temporary pawn for the centre, the Scandinavian (early queen), delaying castling is punished, passive development is punished [V-video].
  - Format: each lesson states a goal in a sentence, shows a position, and asks "what is a good developing move"; wrong choices get an explanation of why. Then a short model game or trap is played through. The viewer plays moves himself and comments [V-video].
  - Voice: written by named strong players (international masters/grandmasters) per the viewer [V-video]. Tone is instructive prose, comparing squares controlled by a good and bad move (a centralized knight controls eight squares vs a rim knight with four) [V-video].
- **Chess Mentor (2008 promo, `miv4Rrk-6Sw`)** [V-video]: the earlier interactive-lesson product. Courses by named authors across openings, tactics, strategy, endgames; every legal move gets a coach comment; hints, "key squares/pieces", "move importance", and a show-me button; a lesson starts with a synopsis and a goal; progress tracked with a strengths/weaknesses report; sells itself against a $25 book and a $100/hour coach. This is the clearest picture of the mechanic we want to compare with: feedback on every move, hint ladder.
- **Drills (2016, `vzsbroy1J1Q`)** [V-video]: a list of practical positions (queen vs rook, knight-bishop mate, two bishops mate) in the Learn menu, played against the engine, with coach feedback on the best move; Rensch invites coaches to suggest positions. Not part of the path.
- **Intermediate and Advanced contents**: the only data is the web summary (Intermediate: positional play, complex endgames, opening lines; Advanced: master-level strategy) [S-web]. No video found.

### 3. Lichess Learn
Sources: `hRLOEjAnfBk`, `06MFMa-jppg` (and titles of unreadable Regnaz HQ videos).
- **Structure** [V-video]: Learn menu pages: Chess basics, Practice, Coordinates, Study. Chess basics lists lessons from how the pieces move through capturing, checkmate, setting up the board, castling, en passant, stalemate, then "what to practice next". A progress count is shown per lesson set (for example two of seven mate-in-one done). The Practice page expands this into fundamentals, techniques, principles, tactical themes (pin, deflection, counter-check), pawn and rook endgames, and key-square positions like Lucena and Philidor [V-video].
- **Piece-movement levels** [V-video]: a lone piece and "stars" scattered over the board; clicking the piece shows legal squares as dots; the goal is to collect every star in the fewest moves; up to three stars per level for efficiency. The coach (Tillis) advises taking the outlying star last and moving without a wasted step, and recommends a paper cheat sheet. Queen and knight levels are the ones students stumble on [V-video].
- **Mate-in-one lessons** [V-video]: a narrator panel says where to move; the move is made; "awesome, level won"; next. Tactic lessons (the pin) show the geometry first, then ask the learner to play the pinning move.
- **Coordinates trainer** [V-video]: a timed game, tap the named square, or name the highlighted square by typing or voice; the tester got a score of 16 and admitted slips from colour orientation.
- **Pricing**: free, no account needed to use the lessons [V-video] (the tour says you do not have to register to use the site).
- **Teaching comment** [V-video]: Tillis teaches "see, hear, do" together and says to introduce pieces gradually to build habits, with a minimum-moves puzzle used as a daily warm-up in his classroom.
- **Not seen:** the "Learn Chess by Playing" course (the page with a guided first game) — `TEkw1PmNH3o` had no captions.

### 4. Chesscademy (old chess.com interactive lessons)
- I found no screen-recordings of the old interactive "Chesscademy" lessons themselves. The Chesscademy YouTube channel has a seven-part "Getting Started" series (Jan 2017) plus a "Moving Past the Basics" series. These are slideless board lectures, not interactive [V-video].
- Getting Started order [V-video]: #1 piece moves and piece values; #2 board set-up (corners inward, queen on own colour) and algebraic notation, with the prefix letters; #3 basic rules (title only; not fetched); #4 basic strategy (material points, the centre, space); #5 and #6 introduction to tactics (fork, pin, skewer); #7 lone-king mates (king and queen using a shrinking box idea) and other mating patterns. The lone-king-mate lecture at 13 minutes is the longest.
- Difficulty progression is by lecture: first value and movement, then notation, then material, then centre, then three tactics, then mates [V-video]. This is a conventional order; ours deliberately differs (game first).
- **Link to Chess.com** [I]: the channel is the old site's lessons made as video; I have not verified who runs it now.

### 5. Chessable beginner course (IM Danny Rensch, free)
Source: `I1gAp8Q4Qt8`, a live first run by a 1700 player. Chapter 1 only.
- Facts [V-video]: free course with about 4.5 stars from about 366 raters at the time; a free account can hold a few free courses [H on the exact slot count]. The streamer was a paying (Pro) member and says free members get a handful of free-course slots.
- Chapter 1 "Learning the game" order [V-video]: introduction video; ranks, files, diagonals (the board geometry); each piece in turn ("meet the rook" and so on) with a written explanation, a video, and practice variations (drag a piece to a named square, find the f7 square for the queen); promotion; piece values; check, three escapes; checkmate; stalemate; quizzes ("test mate in one"). A progress bar by percentage of chapter.
- Mechanics [V-video]: each variation asks for one move; wrong tries are replayed; the system spaces repetition (the streamer says the trainer promises mastery of the material in a stated number of hours with spaced repetition).
- **Reaction**: a mediocre-rated adult liked having text, video or both and said repetition suits him; he found the master-level basics "boring" for himself but valid for a newcomer [V-video].

### 6. Chessly (GothamChess)
Sources: `CEj9pxVCEaw`, `OfZ1thrQrAQ`, `LtvLEqc1VPc`.
- **Price** [V-video]: about 90 US dollars a year in early 2025/2026 (Chessly 2.0); old Chessly was a one-off purchase per course at about 64 dollars; a 7-day free trial and 7-day money-back were advertised, and a trial promotion from Gotham in Dec 2025 [V-video].
- **Content** [V-video]: video-based courses by Rozman (London System, Fried Liver, aggressive Italian, Ruy Lopez, endgame masterclass, tactics levels, fundamentals). Chapter list with videos, lines to learn, quizzes, drills, "drill shuffle" across a course, and a bot ("Levi") you can play restricted to the lines you studied.
- **Gamification** [V-video]: XP, levels that unlock courses (level 2 and 3 unlocked tactics levels and new courses), a holiday event, leaderboard (the 2.0 review says leaderboards "coming soon"), and a community XP goal.
- **Critic's complaints (jacksark)** [V-video]: the drill tells you only that you were wrong, not why, so it trains memorising; the coach's reason for a correct move flashes on screen for about half a second; common opponent mistakes are left out, so learners are not warned about the replies they will actually meet; no evaluation bar in drills; no puzzles; little variation in drill format; middlegame planning thin. He scored interface 9/10, functions 8/10, content 7/10.
- **What the reviewer liked** [V-video]: after a game against the bot, a deviation analysis says where you left the course, what the engine thought, and whether a study covers it.
- **Relevance**: this is the closest competitor in drill mechanics to our "contrast" and "no labels" ideas; its main weakness (reasons are brief, no why on mistakes) is something our verified wrong-answer feedback can beat.

### 7. Noctie
Sources: `_Bc3PtAdSF8` (one sponsored try), titles only for the official tutorials.
- A placement-style game against a human-like bot, then a rating estimate (the reviewer was given about 1490) and an offer to "level up with an AI tutor"; the bot's play felt humanlike to the tester, with a clock and increment he had not noticed; arrows and move hints appear [V-video]. The reviewer did not sign up, so lessons, sparring positions, opening books and the tactics trainer were not shown [V-video].
- The official channel lists tutorials: opening books, sparring positions, how to train tactics, how to learn openings [V]. No captions were available, so I cannot say what they show.

### 8. ChessKid
- Not seen. No video of lessons returned captions. Web sources only [S-web]: levels named Pawn, Knight, Bishop, Rook, Queen, King (41+ lessons in King), SuperKing, each lesson holding 5 to 10 topics. Order: Pawn 1 to 6 introduce rook, bishop, queen, king, pawn, knight; Knight 1 to 3 are check, checkmate, stalemate; Bishop covers mates with a bishop, king and queen mate, the rook roller; Rook covers castling, special pawns, back-rank mates and two "first moves" lessons; Queen covers hanging pieces, counting material, double attack, fork, pin, skewer, discovered attacks and king-and-rook mate, "your opponent"; King is the long strategy list (phases, passed pawns, opposition, when to trade, outposts, zugzwang and so on). Lessons mix video and quizzes and award rank on completion [S-web]. The piece-by-piece "meet the X" sequencing mirrors the other products, with checks and stalemate before castling.

### 9. Chess Steps (Dutch Steps Method)
Source: `D7gfDpEiDks` (an IM-level author gives the full presentation) [V-video].
- **Design** [V-video]: six steps; each step has a trainer manual of scripted lessons (about 25 lessons: 10 to 15 basic plus 10 to 15 "plus") and workbooks (basis, plus, extra, mix; thinking-ahead books in steps 2 and 3; stepping stones for ages 6 to 9). About 14,000 exercises in total. Page layout is about 12 diagrams per page, about 50 pages per workbook.
- **Method** [V-video]: lesson, then homework, then games and mini-games. Mini-games: capture all pawns with the fewest king moves, two knights taking all the pawns. Each lesson lists the prior knowledge needed. "Mix" workbooks have no theme label, so the learner must identify the pattern; the author drops a learner to the previous step's mix book when a step is too hard.
- **Core ideas that match our rules** [V-video]: first learn to see (board vision: safe squares, attackers, defenders) then to think; concepts as shared vocabulary (king attack: gain access, bring attackers, remove defenders, find the mate); a five-way defence checklist (protect, capture, move away, interpose, counter-attack); the first themes include defending against mate and not blundering by looking only at your own options; opening teaching is three principles, not theory; the author compares it to deliberate practice (explicit prerequisites, specific goals, feedback, full attention).
- **Exercise types shown** [V-video]: "get your bishop to b2 in three moves, safely"; "give a safe check in three moves"; "find the mating square by making two moves with the same colour"; visualisation exercises that give moves and ask for the mate position.
- Pricing: books sold separately; the video does not give prices [V-video, not stated].
- Chessimple's overview (`0YeTAU3av_g`) had no captions.

### 10. "Learn chess in 7 days / complete beginner" videos: where beginners got stuck
- Most "7 days" videos (rue, Dylan Bolt) do **not** use a lesson path; they play bots and try openings. Only Alex Payne names chess.com lessons [V-video].
- **First-hour experience (Alex Payne)** [V-video]: the app offers a "play with a coach" first game and pick-your-coach screen (famous-player voices); the first game reminds the player how pieces move if they do not know; he says he did the lessons for about three days, then moved to puzzles and bots. He learned the piece-value point system late (from a coach pop-up) and that taking material is not the purpose of the game.
- **Confusions in the first week** [V-video]: how to win (a lone king that keeps running away from an attack; chasing but not trapping), stalemate versus checkmate ("a draw?"), castling surprising him ("why didn't anyone tell me"), en passant seen as a bug, giving up the queen to simple tactics, the rook being left en prise, weak openings chosen by name rather than idea, time trouble; one player (Jynxzi, with Gotham) touched the king instead of the rook and moved it by accident [V-video]. Dylan Bolt adds that the clock pressure rattled him.
- **Time to first legal game** [V-video]: Alex played a coached game at the very start, Dylan played a trainer game on day two after a day of moving pieces freely, and rue played placement games in the first minute; all three lost early. This supports our rule of a guided real game within ten minutes.
- **Gotham with a new streamer** [V-video]: the lesson points were gambit as a concept, a knight and bishop for a rook and pawn is a material win despite equal "points", the evaluation bar as feedback, and "danger levels" (a bigger threat can ignore a smaller one). These are first-month leaps beyond the free lessons.
- **Dina's 4-week plan** [V-video]: no app; coached sessions, openings prep, and calm-down advice before a tournament. Not relevant to app lessons.

## Cross-product patterns worth knowing (for design, not content)
1. Every product teaches pieces one at a time and puts check, checkmate and stalemate before castling and en passant, which are saved for last [V-video] across chess.com, Chessable and ChessKid [S-web].
2. Interaction is almost always "one move per question". Lichess adds efficient collection (stars, minimum moves); chess.com adds "find the best of several captures"; Chessly adds repeat-until-right drills [V-video].
3. Wrong-answer explanations are the main differentiator: Chess Mentor (2008) explained every move; Chessly drills do not [V-video].
4. Free tier shapes: chess.com gives the basics course free and rations other lessons [S-web]; Lichess is entirely free [V-video]; Chessable's course is free but behind an account [V-video]; Chessly is about 90 dollars a year [V-video].
5. Entertainment-style "7 days" videos show the stuck points to design for: how to trap a king, stalemate, castling, and early over-reliance on named openings [V-video].

## What we could not see (and the best remaining way)

| gap | why | best next step |
|---|---|---|
| chess.com Beginner, Intermediate, Advanced courses: titles, order, counts | no video walks the path; the free "New to Chess" is covered but later levels sit behind the lesson quota and subscription | Manual: open a free chess.com account and read course titles on the Learn page (titles are visible even when locked); or watch `YDDyoWQuBOQ` (27 min speedrun of New to Chess, no captions) and sample frames; search again for creators who review "chess.com lessons Beginner course" by name. |
| What the chess.com coach says after a wrong move | all videos show right answers or skip | Record or find a first-time-user screen capture that makes a wrong move; `Fl54HiXyOkE` ("change coach in lessons", no captions) may show the coach picker. |
| Lichess "Learn Chess by Playing" and Regnaz HQ stage walkthroughs | captions missing | Ask Andrew to play it himself (free, no login) and note screenshots; or read the open-source lesson definitions in the Lichess repository (AGPL, facts only, never copy text). |
| ChessKid actual lessons (video style, quiz style) | no caption sources | Free account at chesskid.com shows the first lessons; or the official "What is ChessKid" videos (`evtKzun4sng`) — no captions fetched. |
| Noctie lessons and tutor behaviour | one sponsored placement game only | Noctie has a free tier; the channel tutorials have no captions; Andrew could run the placement and tutorial once. |
| Chess Steps workbook flip-through | no flip-through video found | Library or bookshop preview of Step 1 workbook; the author's own presentation (`D7gfDpEiDks`) already gives the structure. |
| Chesscademy's interactive lessons (not the YouTube lectures) | no recording found | Internet Archive snapshots of the old site (facts only), or ask Andrew whether he remembers it. |
| Pricing table for chess.com lessons tiers | only a community blog and a critic's remark | Read chess.com's support pages (not bot-checked) for the current plan table; do not rely on the blog. |
| Chessable course parts 2 to 4 (rest of Rensch's course) | not fetched for budget | Fetch `4u5dyQg_2dQ`, `hOKwHK9pjq4`, `64ceK9Wkt88` and read the chapter lists. |

## Rights note
Captions are auto-generated transcripts of other people's talks. They stay in the scratchpad; this file holds facts and short paraphrases only. The ChessKid and chess.com web facts were fetched once, summarised in my own words, and are marked [S-web]. No video files were downloaded; subtitles only.
