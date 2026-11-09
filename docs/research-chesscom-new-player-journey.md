# chess.com: the brand-new-player journey (research started 9 Nov 2026)

Evidence labels: [V] seen here on Andrew's signed-in trial account (built-in browser), [I] inference, [H] hypothesis. Wording is paraphrased; lesson texts are not reproduced. The account is NOT new (old games from 2013 on, many courses played during this research), so first-run screens (sign-up quiz, level picker, welcome tour, rating estimate) cannot be seen; see "Could not observe" below.

## 1. The Learn path: full tile table [V from page markup, `https://www.chess.com/learn`]
Layout: one vertical isometric strip, drawn bottom to top, 68 tiles in 10 groups, 3 level banners (Beginner, Intermediate, Advanced; the first group, "Learn To Play", has no banner). Every tile is a single lesson with its own URL; each group ends in a graduation-cap tile (checkpoint, URL ends `/graduation`). No game, bot, video or quiz tiles. `data-status` 1 = lit (open), 2 = dim. "Next" marker sits on tile 1 (The King), because the path does not read library progress [V]. The first tile of each level (positions 14, 30 and 50) is lit as well, so each level can be entered without finishing the one before [V markup; not clicked].

Position numbers run from the start (bottom) upward.

| Pos | Group (course slug) | Tile | Type | Lit |
|---|---|---|---|---|
| 1 | learn-to-play | the-king | lesson | Next |
| 2 | learn-to-play | the-queen | lesson | dim |
| 3 | learn-to-play | the-rook | lesson | dim |
| 4 | learn-to-play | the-bishop | lesson | dim |
| 5 | learn-to-play | the-knight | lesson | dim |
| 6 | learn-to-play | the-pawn | lesson | dim |
| 7 | learn-to-play | en-passant | lesson | dim |
| 8 | learn-to-play | capturing | lesson | dim |
| 9 | learn-to-play | check | lesson | dim |
| 10 | learn-to-play | getting-out-of-check | lesson | dim |
| 11 | learn-to-play | checkmate | lesson | dim |
| 12 | learn-to-play | castling | lesson | dim |
| 13 | learn-to-play | graduation | checkpoint cap | dim |
| 14 | play-the-game-of-chess (Beginner banner) | capture-pieces | lesson | lit |
| 15 | same | piece-values | lesson | dim |
| 16 | same | retreating | lesson | dim |
| 17 | same | free-pieces | lesson | dim |
| 18 | same | defending-pieces | lesson | dim |
| 19 | same | capturing-decisions | lesson | dim |
| 20 | same | counting-captures | lesson | dim |
| 21 | same | saving-the-correct-piece | lesson | dim |
| 22 | same | promotion | lesson | dim |
| 23 | same | how-to-en-passant | lesson | dim |
| 24 | same | how-to-castle | lesson | dim |
| 25 | same | the-check | lesson | dim |
| 26 | same | get-out-of-check | lesson | dim |
| 27 | same | the-checkmate | lesson | dim |
| 28 | same | draws | lesson | dim |
| 29 | same | graduation | checkpoint cap | dim |
| 30 | chess-openings (Intermediate banner) | how-to-control-the-center | lesson | lit |
| 31 | same | developing-your-pieces | lesson | dim |
| 32 | same | castle-to-safety | lesson | dim |
| 33 | same | graduation | cap | dim |
| 34 | chess-tactics | how-to-fork | lesson | dim |
| 35 | same | how-to-pin | lesson | dim |
| 36 | same | how-to-skewer | lesson | dim |
| 37 | same | trapped-pieces | lesson | dim |
| 38 | same | discoveries | lesson | dim |
| 39 | same | graduation | cap | dim |
| 40 | chess-strategy | pawn-strategy | lesson | dim |
| 41 | same | bishops | lesson | dim |
| 42 | same | rooks | lesson | dim |
| 43 | same | knights | lesson | dim |
| 44 | same | queens | lesson | dim |
| 45 | same | graduation | cap | dim |
| 46 | chess-endgames | the-passed-pawns | lesson | dim |
| 47 | same | defending-promotion | lesson | dim |
| 48 | same | checkmate-with-a-queen | lesson | dim |
| 49 | same | graduation | cap | dim |
| 50 | advanced-openings (Advanced banner) | strike-in-the-center | lesson | lit |
| 51 | same | develop-with-tempo | lesson | dim |
| 52 | same | prevent-castling | lesson | dim |
| 53 | same | graduation | cap | dim |
| 54 | advanced-chess-tactics | remove-the-defender | lesson | dim |
| 55 | same | in-between-moves | lesson | dim |
| 56 | same | defense | lesson | dim |
| 57 | same | brilliant-sacrifices | lesson | dim |
| 58 | same | graduation | cap | dim |
| 59 | advanced-strategy | smart-trades | lesson | dim |
| 60 | same | chess-tempo | lesson | dim |
| 61 | same | chess-batteries | lesson | dim |
| 62 | same | gaining-space | lesson | dim |
| 63 | same | graduation | cap | dim |
| 64 | advanced-chess-endgames | king-and-pawn-endgames | lesson | dim |
| 65 | same | trading-into-winning-endgames | lesson | dim |
| 66 | same | active-pieces-in-the-endgame | lesson | dim |
| 67 | same | checkmate-with-a-rook | lesson | dim |
| 68 | same | graduation | cap | dim |

Totals [V]: 58 lessons and 10 caps; starter 12 lessons, Beginner 15, Intermediate 16 (3+5+5+3), Advanced 15 (3+4+4+4). Not library courses: the path's own course slugs are hidden (`/lessons/play-the-game-of-chess` is a 404 page, lessons under it open). The starter group's slug `learn-to-play` is the library course "Learn To Play" (12 lessons), so the first 12 tiles are a library course; positions 14 to 68 are path-only [V].

Lesson counts per path course are given by the group sizes above (lesson counts in the library do not apply).

## 2. Playing the path as a new learner (9 Nov 2026) [V]
Timing below is my estimate for a human learner at normal speed [I]; my own wall-clock was much longer because each action took a tool call.

### Format of the starter group (Learn To Play), lessons 1 to 6 (King, Queen, Rook, Bishop, Knight, Pawn) [V]
- Lesson page opens on a board showing only the piece, with the coach avatar and a speech bubble (text types out, then a green Continue / "Let's Start!" button). One or two explanation bubbles, with green arrows on the board showing the moves, then 3 "challenges" (4 for the pawn).
- A challenge is: "capture the star". A gold star sits on a square; the learner moves the lone piece there. Later stars need two moves ("move multiple times"), so the learner plans a route. There are no opponent pieces and no captures of real pieces in these lessons [V].
- Feedback: an illegal move is silently refused (piece snaps back, no message) [V]. A legal move that is not what the lesson asked (pawn two squares when one was requested) gets a kind message ("legal, but practise one square first") and a retry button [V]. Choosing a knight instead of a queen at promotion gets a red cross on the square, "let's select a queen, the most powerful piece", plus undo [V]; underpromotion is thus treated as a mistake in lesson 1 for pawns (a teaching simplification, later underpromotion appears in the Advanced Tactics courses [V earlier]). Correct answers get a one-line praise bubble that doubles as the next prompt; the progress bar fills per challenge.
- No hint button was visible in the star lessons; hints appear only where a bulb button shows [V partly].
- Ending: board dims, "Lesson Complete" badge with the piece, a "2 Day Streak" toast, and after about 8 seconds a green arrow appears that goes straight to the next tile's lesson (no return to the path). So the path is walked in a chain without choosing [V].
- Pace [I]: King ~1.5 min, Queen ~2, Rook ~2, Bishop ~2, Knight ~2, Pawn ~3. About 12 minutes for the six piece lessons, with no opponent and no game.
- Defect/oddity [V]: the second explanation bubble of the bishop lesson was skipped by my extra Continue click (the intro text can be skipped by double-clicking); the pawn lesson changed its prompt text while I waited ("Try moving the pawn one square forward." then "Move your pawn one square forward.") [V].

(Further lessons are appended below as played.)

### Starter group, lessons 7 to 12 (En Passant, Capturing, Check, Getting out of check, Checkmate, Castling) [V]
Same shell as above (coach bubble, Continue, challenges counted "Challenge n/N"). Differences:
- **En Passant** (lesson 7, 1 challenge): a scripted demo (the black pawn jumps two squares, the white pawn takes it on the passed square), then one task: capture en passant. The bubble text changes by itself after some idle seconds to a stronger hint ("move one square behind the black pawn") [V]. Praise line says it is rare but will matter. This is minute ~13 of a straight run [I]. Rule introduced before the learner has seen a single real capture; the Capturing lesson follows it, an ordering oddity [V].
- **Capturing** (lesson 8, 4 challenges): first lesson with a full starting position (all 32 pieces) in the intro and an enemy side. Explains "defended or not" with a staged mini-demo (a queen could take a pawn, but a rook defends it, so the queen is lost; another pawn is free). Challenge 1: take the free pawn; picking the defended pawn actually plays out the recapture and the bubble says that pawn was protected, with an undo button (the lesson lets the learner fail by consequence) [V]. Challenges 2 to 4: pick which of two or three captures is safe (queen d1 takes the loose a4 pawn rather than the g4 pawn that a queen defends; rook takes an undefended queen rather than a pawn-protected bishop; knight takes a rook rather than a defended bishop). Exact wording of feedback is positive and gives the reason ("the queen was unprotected and safe to capture", "the bishop was protected, so capturing the rook makes sense") [V].
- **Check** (lesson 9, 2 challenges): move a bishop to give check (hint text arrives automatically); choose which of two pawns gives check [V].
- **Getting out of check** (lesson 10, 3 challenges): escape (king move), capture the checker, block with a rook; named explicitly as the three ways in the final praise line. A king move into an attacked square is not allowed at all: selecting the king shows only legal squares and an arrow hint, and a click on a forbidden square does nothing [V].
- **Checkmate** (lesson 11, 3 challenges): a scripted example mate, then: mate with a rook (Re8 against king on h8 with pawns on g7 h7), mate with the two-rook ladder (Ra2 against king a8, other rook on b1), mate with queen supported by king (Qg7 against Kg8 with Kf6). A wrong try (Rc8+ instead of Ra2#) lets the opponent answer (king goes to a7) and says "the king can escape check", with undo [V]. The positions are correct mates [V by hand].
- **Castling** (lesson 12, 3 challenges): castle kingside, castle queenside, then a demo that castling queenside is illegal because a rook watches d1, then castle kingside in that position. Loose wording [V]: the bubble says the king "would move into check", but the king ends on c1; the real rule is about the square it passes (d1), and a beginner may hear it wrong. The requirements list (never moved, not in check, not through or into check, empty between) is stated in one bubble of about 30 words [V]. An illegal castle attempt is silently refused and the prompt stays.
- **Graduation**: finishing the last lesson shows a modal ("You Mastered the Basics!", a graduation cap picture, "Explore more beginner lessons", one Finish button) over the board. Finish returns to the Learn page (`/learn?fromIntro=true`; the query name suggests this is the end of the intro flow) where the Next marker has moved to the first tile of the Beginner group, course title shown as "Playing The Game", with the coach saying "Learn how to capture pieces." and a green Next Lesson button below the strip [V]. The 12 finished tiles now carry `data-status` 3 (completed); the cap tile stays 2 [V markup].
- Correction to an earlier note [V]: the Learn page "Next" marker DOES follow the path's own lessons (it moved after I finished the starter group); it did not follow library "Complete" labels earlier because those are a different course set.

Count for the starter group [V]: 6 piece lessons (19 challenges), 6 rule lessons (16 challenges); 35 interactive tasks in all; no opponent that moves except scripted replies; no full game; no real choice among several good moves before lesson 8; no timer; no rating. Estimated 22 to 28 minutes for a real beginner [I].

(Beginner group, "Playing The Game", appended below as played.)

### Beginner group, "Playing The Game" (positions 14 to 28): a different lesson shell [V]
From tile 14 on, the path leaves the star-and-bubble shell and uses the standard library lesson player: a start card with one Start button, then "White to Move" challenges with a bubble prompt, a hint bulb, and a progress bar "Challenge n/N". A correct answer shows a green tick and a short praise ("Great capture!", "Nice one!"); the green arrow at the bottom right is available at once (no 8-second pause). Finishing the last challenge returns to `/learn` (no automatic chain into the next lesson), and the coach line on that page names the next lesson ("Learn the value of the chess pieces.") [V].

**Lesson 14 "Capture Pieces" (10 challenges) played in full [V].** Order of the ten tasks: take the only capturable piece with a rook; with a rook again (bishop on the file); "which piece can you capture" with a bishop (only one is reachable); knight capture with a prompt that restates the L-shape; queen capture ("most powerful piece"); rook takes a queen in a middlegame-like position; bishop from across the board (long diagonal); knight capture where jumping matters; a full 32-piece opening position ("don't move until you see it": queen takes a hanging bishop on g4); a ten-piece middlegame where only the bishop on c1 can capture (the h6 rook). Prompts get terser as the difficulty rises; the last one says it is hard. Every challenge has exactly one capture that works, so there is no judgement about trades yet. Feedback seen: only the correct-answer lines (I did not test wrong answers here). Estimated 6 to 8 minutes [I].
- Each bubble line is a hint in disguise ("Knights move in an L-shape", "Bishops can capture from all the way across the board"), so the prompt teaches as well as asks [V].

**Breadth: first screen of every other tile [V] (I opened each lesson and read the first challenge; the rest not played).**

| Pos | Lesson | Challenges | First prompt (paraphrase) |
|---|---|---|---|
| 15 | piece-values | 10 | capture the most valuable piece, the queen (bishop takes queen, pawn nearby) |
| 16 | retreating | 8 | move the bishop to a safe square (rook attacks it) |
| 17 | free-pieces | 8 | take the knight the rook does not protect |
| 18 | defending-pieces | 7 | how can the rook defend the bishop |
| 19 | capturing-decisions | 6 | which capture gets the most points, beware defenders |
| 20 | counting-captures | 8 | rule of thumb: go if attackers outnumber defenders |
| 21 | saving-the-correct-piece | 5 | which of two attacked pieces to retreat (14-piece position) |
| 22 | promotion | 7 | make a queen (lone pawn on the 7th) |
| 23 | how-to-en-passant | 4 | definition in the prompt, then capture en passant |
| 24 | how-to-castle | 6 | castle kingside, "gets your king to safety" |
| 25 | the-check | 10 | attack the king to give check |
| 26 | get-out-of-check | 8 | queen checks the king, get away |
| 27 | the-checkmate | 9 | rook on the 7th... a mate-in-one with bishops in a pawn-shield position |
| 28 | draws | 5 | find stalemate (queen and king vs king with pawn) |
| 29 | graduation | cap | no page: `/lessons/play-the-game-of-chess/graduation` is a 404; the cap is the modal after tile 28 (assumed to behave like the starter group's modal) [V for 404, I for modal] |

Beginner totals [V]: 15 lessons, 111 challenges (10+10+8+8+7+6+8+5+7+4+6+10+8+9+5, read from each lesson's counter). At about 40 seconds per challenge that is roughly 75 minutes [I].

### Intermediate and Advanced: first screen of every tile [V] (opened and first prompt read; not played)
| Pos | Lesson | Challenges | Pieces on board | First prompt (paraphrase) |
|---|---|---|---|---|
| 30 | chess-openings / how-to-control-the-center | 4 | 32 | put the pawn in the center |
| 31 | developing-your-pieces | 5 | 32 | develop the knight to attack a pawn |
| 32 | castle-to-safety | 5 | 32 | castle to get the king out of the centre |
| 34 | chess-tactics / how-to-fork | 8 | 3 | a fork attacks two pieces at once |
| 35 | how-to-pin | 9 | 7 | a pinned piece cannot move without losing a more valuable one behind it |
| 36 | how-to-skewer | 6 | 3 | skewer = backwards pin (correct definition) |
| 37 | trapped-pieces | 5 | 15 | attack a piece that has no escape |
| 38 | discoveries | 4 | 4 | attack the queen while revealing a check |
| 40 | chess-strategy / pawn-strategy | 5 | 4 | pawns dislike being isolated; capture the knight and connect the pawns |
| 41 | bishops | 6 | 32 | activate the light-squared bishop |
| 42 | rooks | 6 | 14 | rooks like open files |
| 43 | knights | 5 | 1 | knights like the centre; move to the highlighted square |
| 44 | queens | 5 | 17 | queens are active in the centre |
| 46 | chess-endgames / the-passed-pawns | 3 | 7 | passed pawns: do not trade, create a passed pawn |
| 47 | defending-promotion | 6 | 2 | cover their promotion square with the bishop |
| 48 | checkmate-with-a-queen | 4 | 3 | queen mates at the edge with king support |
| 50 | advanced-openings / strike-in-the-center | 5 | 32 | punish an opponent who ignored the centre |
| 51 | develop-with-tempo | 4 | 30 | develop while forcing the opponent's valuable piece to move |
| 52 | prevent-castling | 4 | 32 | where can the bishop go so the weakened king cannot castle |
| 54 | advanced-chess-tactics / remove-the-defender | 6 | 5 | capture the knight so the bishop loses its defender |
| 55 | in-between-moves | 5 | 9 | capture with check first, then take the rook anyway |
| 56 | defense | 6 | 21 | one move from mate, how to defend |
| 57 | brilliant-sacrifices | 5 | 12 | sacrifice a valuable piece for a bigger gain |
| 59 | advanced-strategy / smart-trades | 4 | 25 | good pieces see many squares: which piece to trade the knight for |
| 60 | chess-tempo | 6 | 30 | Black to move: develop with a threat |
| 61 | chess-batteries | 5 | 12 | use the rook battery to force mate |
| 62 | gaining-space | 6 | 32 | save the pawn, threaten, and take space at once |
| 64 | advanced-chess-endgames / king-and-pawn-endgames | 5 | 3 | goal position shown first (promotion is easy) |
| 65 | trading-into-winning-endgames | 5 | 6 | trade the rooks so you can promote |
| 66 | active-pieces-in-the-endgame | 5 | 5 | use the bishop so the knight can never return |
| 67 | checkmate-with-a-rook | 5 | 3 | shrinking-box technique: control a rank and file, tighten when safe |
| 68 | graduation | cap | page absent; assumed modal | |

Counts [V from each lesson's counter]: Intermediate 16 lessons with 4 to 9 challenges, 86 in all (openings 14, tactics 32, strategy 27, endgames 13); Advanced 15 lessons with 4 to 6, 76 in all (openings 13, tactics 22, strategy 21, endgames 20). The whole path therefore holds 58 lessons and 308 challenges (35 starter tasks, 111 Beginner, 86 Intermediate, 76 Advanced) [V arithmetic].
Observation [V]: each lesson's first prompt states the concept in one sentence (often with the strategic reason), then asks for one move. Intermediate and Advanced lessons are 4 to 9 challenges: shorter and denser than the Beginner ones. Piece-poor positions (1 to 7 pieces) are used for the pure tactics lessons (fork, skewer, discoveries, endgames), real middlegame positions (25 to 32 pieces) for strategy and openings. A lesson of 1 piece ("Knights", first challenge: move to the highlighted square) shows a technique drill inside the strategy section [V].

### The home page and nudges (`/home`) [V text, I interpretation]
What a learner meets, in page order: a "2 Day Streak" counter (my research session started it); "Play Online" with 10 min, 5 min, 3 days presets and a Start Game button, then "Play Bots", "Tournaments", "Play a Friend" tabs; below, a single "Next Lesson" card ("Piece Values", with "Coach David / Play Coach" beside it): the path's next tile is surfaced on the home page [V]. A "Solve Puzzles" card, game history (my one bot game of 8 Nov and old games), a Daily Puzzle ("Solved by 1,425,720 players" label), a streak week strip, friends (empty), and a stats box (Rapid -, Blitz 778, Puzzles 326, Lessons 111) [V]. A learner who opens the app can reach the first game via Play Bots at any time without finishing the path [I].
Not seen, because the account is not new [I]: the sign-up flow, the "how well do you play" or goal questions, rating estimate, the welcome tour, first-run coach introductions, and any first-session push to play a bot. The only first-run signal found is the query `?fromIntro=true` on the Learn page after finishing the starter group, so there is an intro flow that ends there [V query, I meaning].
Side effect of my research on this account (tell Andrew) [V]: the 12 starter lessons (Learn To Play path course) are now marked complete, Beginner tile 14 (Capture Pieces) is complete, the Learn "Next" marker now sits at Piece Values (tile 15), the home page shows "Next Lesson: Piece Values", and a 2 Day Streak counter exists.

## 3. Minute-by-minute first hour of a brand-new learner on chess.com [I from timing of the lessons I played; screens before the first lesson not observed]
| Minute | What happens |
|---|---|
| 0 to 2? | sign-up and any questions: not observed [I] |
| 2 to 4 | Learn path opens; first tile The King: explanation bubble, board with a lone king, three star targets |
| 4 to 6.5 | The Queen: same shape, three stars needing one or two moves |
| 6.5 to 9 | The Rook |
| 9 to 11.5 | The Bishop |
| 11.5 to 14.5 | The Knight (L-shape arrows, jump demo with three pawns) |
| 14.5 to 18.5 | The Pawn: four challenges including a capture and the promotion picker |
| 18.5 to 20.5 | En Passant: one challenge |
| 20.5 to 25 | Capturing: first opponent pieces; defended versus free; four decisions |
| 25 to 28 | Check |
| 28 to 31 | Getting out of check (escape, capture, block) |
| 31 to 35 | Checkmate: three mate-in-one tasks |
| 35 to 39 | Castling; then the "You Mastered the Basics!" modal and back to the Learn page |
| 39 to 47 | Beginner lesson 1, Capture Pieces (10 challenges) |
| 47 to 60 | about two more 8 to 10 challenge lessons (Piece Values, Retreating) |
First real game against an opponent: not on the path at all. It is reachable from home (Play Bots) at any time [V]. So a path-following learner has made zero moves in a real game by minute 60 and has solved roughly 80 to 100 single-position tasks [I].

## 4. Comparison with Scholarmate's first hour [I]
Scholarmate (content/path.json): S0 "Moves and the board" starts with L-FND-FIRSTGAME-1, a guided real game at about minute 3, then board, rook and bishop, queen and king, knight, king, pawn; S1 "Legal play": capture, attack, check, stalemate, castling, promotion, special moves; S2 "First complete games" (21 lessons, includes notation, value, loose pieces, opening habits, a self-review lesson, clock, mate in one, counting, threats, draws). The project hook is "a guided real game within about 10 minutes and a legal (bad) game about an hour later" (CLAUDE.md).

| Dimension | chess.com path | Scholarmate |
|---|---|---|
| First board contact | lone king and stars, minute 2 | guided real game, minute 3 [I from our path] |
| First contact with an opponent | lesson 8 (Capturing), about minute 21, scripted pieces | the first game |
| First full game | none on the path; Play Bots separate | planned minute 3 and again by minute ~60 |
| Length of lessons | 1 to 4 min starter; 6 to 8 min Beginner lessons | short early lessons, length follows difficulty |
| Feedback on a wrong answer | consequence shown (the recapture is played, the king escapes), then a one-line reason, undo button; illegal moves silently refused | detector-based feedback; see our own design |
| Hints | prompt text rotates to a stronger hint after idle time (starter group); bulb button in the standard shell | per our design |
| Completion cue | lesson-complete badge, streak toast, 8-second forced pause before Next, graduation modal | visible curriculum graph |
| Next step | green arrow chains lessons (starter group); path page names the next lesson (standard shell) | Today card with one main task |
| Placement | none on the path (first tile of each level lit) | placement planned |
| Evidence of mastery | none visible (no accuracy score per lesson on the path) [I] | evidence-led fading support |

### What they do better [I]
1. Zero-friction first touch: one piece, one star, one move; a learner cannot fail the first lesson. Pure motor learning of piece movement before any rule text.
2. Consequence-based feedback: wrong captures are played out (the defended pawn is lost to the recapture) and the bubble explains after the fact, with undo.
3. Three-ways-out-of-check and the stalemate demo are named in plain words at the moment of use.
4. Tight visual identity per lesson (coach face, short bubbles, arrows on the board).
5. The home page surfaces the next lesson and a play button together.
6. A visible 68-tile map with checkpoints gives a sense of a finite journey.
7. Small streak and completion celebration, with a deliberate pause that prevents click-through.

### What they do worse [I/V]
1. No real game in the first hour on the path; the first opponent move is a scripted recapture at minute ~21.
2. En passant taught at minute 19 before capturing is understood, and again at minute ~66 (tile 23) as a full lesson.
3. The starter group is 35 tasks of one kind (move to a star, then single moves) with no choice among good moves until lesson 8.
4. The path does not ask the learner anything (no level, goal or placement), and the first tile of each level is lit without a test.
5. Sloppy wording in the castling demo ("move into check" for a king that passes through an attacked square) [V].
6. A pawn lesson that insists on the queen and marks a knight as wrong (underpromotion treated as an error) [V].
7. Intermediate and Advanced strands are thin (3 to 5 lessons each) and the beginner group has 15 lessons of one shape (find the capture, check, mate) with no mixed-review lesson [I].
8. No evidence displayed (accuracy, mistakes) and no spacing or review in the path itself [I].

## 5. Courses ever (partly) played on Andrew's account, so he can tell research badges from his own (from `research-chesscom-progress.md`, 9 Nov 2026) [V tracker]
Library badges "N% Complete" or "Complete" on the beginner list that came from this research (not his own play): Your First Tournament (all 4 lessons), Intro to Book Openings, Opening Principles (L1 to L5 at least partly), Finding Checkmate, Winning the Game, Winning with Tactics, Capturing Pieces, Learn To Play Chess, Playing the Game (86%), Learn the Queen's Gambit Exchange Variation (33%), Mastering the Endgame (20%), Checkmate Patterns You Should Know (13%), Pawn Endings: Beginner to Expert (1%), Introduction to Tactics (2%), Essential Checkmate Patterns (2%), Exclusively Checkmates (1%, possibly list-only opening). Everything marked in the tracker as played or played-partly (rows): Learn To Play, Play Like Gukesh Dommaraju, Prophylactic Thinking, Calculation With Dvoretsky, How To Win With Zugzwang, How I Became A Five Time World Champion, Refute The Sacrifice (L1), How To Analyze Your Games (L1 c1), Learn Every Chess Opening, Learn The Caro-Kann Defense, Learn The Italian Game, Learn The London And Colle Systems, Absolutely Must Know Endgames, Pawns vs Pieces (L1), Every Pawn Structure Explained, Every Chess Tactic Explained, Mating Nets, Master Endgame Checkmates, King Activity In The Endgame (L1 c1), Candidate Moves, Learn the Queen's Gambit Exchange Variation, Play Like Hikaru Nakamura (L1 first 2 moves), Practice the London System, Your First Tournament, Mastering the Endgame (L1), Checkmate Patterns You Should Know (L1 to 2), Make the Most of Your Pieces (L1 to 3), Forcing Moves, Intro to Book Openings, Activating Your Pieces, Opening Principles, Advanced Endgames, Key Openings, Finding Checkmate, Attacking the King, Choosing the Best Move, Winning the Game, Reading the Board, Winning with Tactics, Capturing Pieces, Playing the Game, Understanding Endgames, Learn To Play Chess, Endgame Patterns, Advanced Tactics (the 2018 course), Exploiting Opening Errors 3, Pawn Endings: Beginner to Expert (L1, L87), Introduction to Tactics (L1, 42, 108), Essential Checkmate Patterns (L1), and from 9 Nov: Advanced Tactics by Ben Finegold (L1 challenges 1 to 3), plus the Learn path's own lessons: all 12 of the starter group and Beginner "Capture Pieces". Not played but only opened (first screen read, not completed): the other 29 path lessons in the tables above and about 4 library course pages.

## 6. Defects and oddities found in this pass [V]
- Castling demo wording (see above): says the king "would move into check", whereas the king passes over d1 and ends on c1.
- En passant is taught at lesson 7 before captures (lesson 8) and before the learner has seen a pawn capture a real piece (pawn lesson did include a diagonal capture of a star-marked pawn; no opponent pieces) [I on pedagogy].
- Underpromotion is rejected in the pawn lesson: a knight choice shows a red cross and "let's select a queen" [V]; the positions are technically legal.
- The pawn lesson's prompt text changed while idle (a hint swap) [V]; harmless but the bubble text is not stable.
- Page script wrote to the system clipboard when I clicked Start with a synthetic click on two lesson pages [V, tool note].
- Positions: no wrong or impossible position was found in the starter group and in Capture Pieces. The ten Capture Pieces positions each have one capture that works; I did not engine-check every position for hidden alternatives [I].
- The Learn page "Next" marker at tile 1 earlier read as a defect; it was not (see correction above).

## 7. Not observed [V]
Sign-up, level choice, rating estimate, the welcome flow, the start-of-day goal setting, and any "daily goal"; coach introductions; the Beginner lessons 15 to 28 beyond their first challenge; Intermediate and Advanced lessons beyond the first prompt; graduation modals of later groups; whether dim tiles open when clicked; mobile app.

## Beginner shell, full play notes, tiles 15 onward (9 Nov 2026)

### Tile 15, Piece Values (10 challenges) [V]
- Concept: take the most valuable piece on offer. Each challenge is "White to Move" with one short hint line ("There are two captures. But one is best.", "Look at all of your pieces.", "Last one!"). Exercise type is always one move on a full-ish board, no choice among options shown.
- Wrong answer [V]: the move is played out, a red cross sits on the square, the bubble says the move is incorrect and gives a nudge ("You have a better capture to find. Look again."), and a red undo button appears at the bottom right. No penalty counter, no lost lives.
- Right answer: the bubble praises and restates the idea in a line ("The queen is more valuable than a rook.").
- Position notes: C7 `r1b1k1nr/pppp1ppp/8/4b3/4P2q/5N2/PPP3PP/RNBQKB1R w`, Nxh4 wins the queen; the feedback adds why the bishop cannot be taken (check). C8 `1r4nk/1R3q2/1p6/pPb4p/Pn5P/4N1P1/5P2/5RK1 w`, Rxf7 (queen) beats Rxb8 (rook). C9 `r5k1/4npp1/7p/pp2b3/2p3P1/2P4P/PPN2PB1/4R1K1 w`: Rxe5 wins a free bishop yet is marked incorrect because Bxa8 wins a free rook. Not a defect in the chess, but a learner who found a real free piece is told "incorrect"; our own rule is to accept any correct move and say what the better one was. C10 `r1bq2k1/p1p2ppp/1p2pn2/1nb1P1B1/P7/2N3PN/1PP1QPBP/3R2K1 w`, Rxd8+ wins the queen with check.
- Oddity (C5): the black queen on e1 also attacks Ne4 along the file, which the prompt ignores.
- Ending: last next arrow returns to /learn with the coach bubble naming the next lesson ("Learn how and when to retreat"). The Next tile moves on. [V]
- Adopt: one-line hint before the move, undo instead of a fail state, praise that restates the concept. Avoid: marking a clearly winning alternative as incorrect without saying it also wins.

### Tile 16, Retreating (8 challenges) [V]
- Concept stated in the first prompt: "Move your bishop to a safe square" (C1, lone bishop vs lone rook). Later prompts are a nudge each ("Don't let their pawn get you!", "Your strongest piece is in danger.", "No more hints!" on C7, a long "take your time" line on C8).
- Task type: one move, any safe square accepted (several correct squares). Pieces grow from 2 on the board to a full middlegame by C5-C8 (C5 is a real opening position after ...b5 hitting Bc4; C8 a crowded middlegame where a knight on d4 is hit twice).
- Wrong answer [V]: the move is played out and the opponent captures; bubble reads "Your bishop was captured. Try again." / "Your queen gets captured here." and undo appears. A capture that is itself bad (Qxd7+ into a recapture) gets the same treatment.
- Right answer: praise names the piece and why ("Your bishop is safe here", "Your knight is now defended" for Nb3 guarded by two pawns). The hint bulb shows a rule ("Knights move in an L shape") rather than the answer.
- Position FENs: C1 `8/8/8/8/3r2B1/8/8/8 w`; C2 `8/8/8/8/3b4/8/5R2/8 w`; C3 `8/8/8/8/3n4/8/4Q3/8 w`; C4 `5rk1/1b3ppp/8/8/8/8/PPP3R1/1KR5 w`; C5 `r1bqkbnr/2pp1ppp/p1n5/1p2p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w`; C6 `r2qkb1r/pppbn1pp/5pn1/3p4/Q7/2PNPN2/PP2BPPP/R1B1K2R w`; C7 `5rk1/5pp1/5b1p/4n3/8/5QP1/5P1P/1R4K1 w`; C8 `r4rk1/1ppn1ppp/p2p1qn1/2b5/3NP3/2N3Q1/PPP1BPPP/R4RK1 w`. No defects found (C6 as printed in an earlier pass was set to a position where Qxd7+ loses the queen; confirmed by hand).
- Not a defect, a tooling note: tapping an enemy-occupied square the selected piece cannot reach (my Qxd4 mistake, a knight's-move away) is silently ignored with no message.
- Ending: Finish button on C8, then the page returns to /learn.

### Tile 17, Free Pieces (8 challenges) [V]
- Concept in first prompt: "Take the knight that is not protected by the rook" (C1, 3 pieces). Later prompts: "Which rook has no defenders?", "Capturing something small for free is sometimes the best option." (a pawn is the free piece, the rook is defended), "two pieces you can capture, but which is undefended?", "Capturing backwards is always an option." (C6: bishop on b5 takes a queen on e2), crowded boards in C7-C8.
- Task type: choose the one capture that is not defended. Wrong answers lose the capturing piece to a recapture ("Your bishop gets captured."), with undo.
- Right-answer praise is short and varied ("That's correct", "Yes, that was a free knight", "Nice find!"). One odd line: C3 praise says "you avoided the rook's threats" after taking a pawn.
- FENs: C1 `8/4r1n1/1n6/8/3B4/8/8/8 w` (Bxb6 free, Bxg7 loses to Rxg7); C2 `8/8/4r3/8/3N3n/5r2/8/8 w` (Nxe6, not Nxf3); C3 `8/6r1/1p6/6r1/8/4Q3/8/8 w` (Qxb6); C4 `r1bqk2r/p1pp1ppp/2p5/2b3n1/4P3/4B3/PPP2PPP/RN1QKB1R w` (Bxc5; Bxg5 loses to Qxg5); C5 `r2qkbnr/ppp1pppp/8/3p1b2/1n1P1B2/5N2/PPP1PPPP/RN1KQB1R w` (Qxb4); C6 `2k5/ppp4p/8/1B4p1/PR5n/7P/4q1PK/8 w` (Bxe2); C7 `r2q1rk1/pbp1ppbp/1p1p1np1/8/2BnP3/1PN2N2/PB1P1PPP/R2QK2R w` (Nxd4, c2 square as printed in the reading was inexact, verify with the live board); C8 `r4rk1/2pn1ppp/1b2n3/8/2N5/1B4BP/PPP3P1/1K1RR3 w` (Rxd7).
- Oddity: C5 starts with the white king on d1 and no queen-side castling rights, i.e. a made-up position, fine for the task. C7 position note: I did not engine-check these; the "free" claim was verified by hand only [I].
- Ending: Finish button, then jump to the next page; the lesson was reached by URL, so the next-lesson chain was not observed.
- Adopt for us: a ladder inside one lesson, from 3 pieces to a crowded board, with the hint line carrying the one rule needed.

### Tile 18, Defending Pieces (7 challenges) [V]
- Concept in first prompt: "How can your rook defend your bishop?" Each challenge names the defender type to use (rook, pawn, another piece avoiding a knight, knights protecting each other, then two open "how can you defend your knight/ find the piece in danger" ladders).
- Task type: one move that adds a defender; several answers accepted (C5 g3 pawn accepted, C6 c3 pawn accepted, C7 Bd2 accepted).
- Wrong answer [V]: "Your bishop is still in danger." (a rook move that defends nothing, C1 Re5) and "Your rook gets captured here, and your bishop is still in danger." (C3 Rd2 into a knight fork square). Undo button each time.
- FENs: C1 `B7/1N6/8/8/4R3/r7/8/8 w` (Re8); C2 `8/8/8/3q1B2/8/6P1/8/8 w` (g4); C3 `5r2/3R4/8/8/8/5nN1/7B/8 w` (Rh7); C4 `8/8/8/8/3NqN2/8/8/8 w` (Nde2, knights guard each other); C5 `6b1/kp5p/p1p3pb/8/5N2/P2P3P/1P2RPP1/2R3K1 w`; C6 `r1b1k2r/1pppnp1p/pb4p1/8/3NP3/1P3P2/P1P1B1PP/R1B1K2R w`; C7 `r2b1r1k/p1n3pp/2p2p2/3pp3/3bP3/PBNP4/2P2PPP/R1B1R1K1 w`. No defect found; in C7 the Bd4 also eyes f2, which the lesson does not mention.
- Ending: Finish button; needed a second press on this lesson to leave to /learn [V].
- Adopt: the prompt names the tool ("with your pawn"), so the first answer is a tiny search; later prompts remove the name and make the learner find the attacked piece first.

### Tile 19, Capturing Decisions (6 challenges) [V]
- Concept in first prompt: win the most points by choosing the best capture (hint-free C1; later hints: "Sometimes capturing a protected piece is still the best idea.", "Which capture is worth the most?", "Capture higher-value pieces with lower-value pieces.", "Let's try a position from a real game.", "be aware of defenders!").
- Task type: pick one of several captures; the scoring is explicit in points (9/5/3/1).
- Wrong-answer feedback is the best seen so far [V]: it counts the points of what you chose. C1 Bxc6 (rook for bishop after bxc6): "This trade gains two points - not bad! Now let's win three points!". C6 Nxa8 (Rxa8 recapture): "This tempting move wins two points. Now find a stronger capture." Undo is offered. A partly good move is graded as incorrect but praised.
- Right-answer praise restates the arithmetic ("trading your three point bishop for their nine point queen - six points in your favor").
- FENs: C1 `8/1p5n/2r5/8/4B3/8/8/8 w` (Bxh7 free knight); C2 `8/1p6/2q5/5b2/3N4/8/8/8 w` (Nxc6); C3 `8/1p6/2q4r/8/4B3/8/8/8 w` printed as `8/1p5r/2q5/8/4B3/8/8/8 w` (Bxc6 +6 over Bxh7 +5); C4 `8/1p6/2r3R1/8/8/8/6B1/8 w` (Bxc6, not Rxc6); C5 `r1b2rk1/ppp1nppp/1b1p4/8/3nP3/2N1B3/PPP2PPP/2KR1B1R w` (Bxd4); C6 `r4rk1/ppN3pp/2p1bnn1/3p4/3P4/1P2PN2/4BPPP/R4RK1 w` (Nxe6 free bishop, Nxa8 only +2).
- Possible defect [I]: C5 praise calls Bxd4 "an even trade", yet after Bxd4 Bxd4 Rxd4 white is a knight up (the d4 knight is attacked by bishop and rook, defended once). The feedback understates what the lesson's own answer wins. Not engine-checked.
- Ending: Finish button, then /learn.
- Adopt: score every candidate capture in points in the feedback, and tell the learner when a wrong move was still partly good.

### Tile 20, Counting Captures (8 challenges) [V]
- Concept: an exchange sequence. Count who has more attackers than defenders, start the sequence with the lowest-value capturer. Prompts are mostly empty or one-liners ("Go for it!", "Which capture should you start with?", "Once your forces are piled up, you can go for the capture.", "Be sure to look at both of your capture options.", "How can White win a pawn?", "What should you capture?", "Is the capture worth it?").
- Task type [V]: a multi-move line. The learner plays the first capture, the program plays the black recapture, the bubble says "Good start! What's next?" and the learner plays the follow-up capture. The challenge counter stays at n/8 across the whole sequence; praise after the last move ("You win a piece. Nice job!", "You have an extra rook. Well played!").
- Wrong-answer feedback [V], graded in material: quiet move C1 "We are trying to find a capture. How can you do it?"; wrong capture order C3 Rxd5 (should be Bxd5 first) "Black wins material. Try to find a better capture."; C5 Rxd5 "There's no need to lose your rook. Try to find a better capture."; C7 Qxe6+ "Black wins the queen. Try to find a better capture." Undo each time.
- FENs: C1 `8/2r3r1/8/8/8/2R5/2R5/8 w` (Rxc7 Rxc7 Rxc7); C2 `8/1p6/2b5/8/8/5B2/6Q1/8 w` (Bxc6 bxc6 Qxc6); C3 `8/8/2p5/3n4/8/8/3R2B1/8 w` (Bxd5 cxd5 Rxd5); C4 `1r3rk1/5pp1/2p1pn1p/3p4/2PP4/4P1P1/1R3PBP/1R4K1 w` (Rxb8 Rxb8 Rxb8+); C5 `r4rk1/ppp2pbp/2n1b1p1/3n4/8/2N2NP1/PP3PBP/R1BR2K1 w` (Nxd5 Bxd5 Rxd5, wins a piece); C6 `rnb1kbnr/ppp2ppp/4pq2/3p4/3PP3/2N5/PPP2PPP/R1BQKBNR w` (exd5 exd5 Nxd5); C7 `r2qk2r/ppp2ppp/4b1n1/2b1p3/6Q1/1BPP1N2/P1P2PPP/R1B1K2R w` (Bxe6 fxe6 Qxe6+); C8 `8/pb2rpkp/1p4p1/3n4/8/8/3R1PPP/3R1BK1 w` (Rxd5 Bxd5 Rxd5, net +1 only).
- C8 note [I]: "Is the capture worth it?" ends as a one-point gain (rook for knight and bishop); a hand count, not engine-checked. The position is real-looking but contrived (black king g7 next to Re7).
- Ending: the final screen is a "Lesson Complete! Way to go! Continue your journey learning chess." overlay with a Finish button; Finish returned to /learn (a second press was needed in some lessons, the first press seems to dismiss the overlay) [V].
- Adopt: multi-move exchange as one challenge with a mid-sequence nudge; the cost of the wrong order is stated in material, not just "wrong".

### Tile 21, Saving the Correct Piece (5 challenges) [V]
- Concept: two of your pieces are attacked; decide which to save (usually the more valuable, unless the less valuable one is the one that cannot be defended). Prompts: none on C1, "What about now?", "You can only save one piece.", "Can you save both pieces here?" (hint says so), "How can White stay ahead?".
- Task type: one move; multiple tries allowed; the answer set is small. Wrong-answer feedback [V]: "Nice try, but this move doesn't defend your hanging piece. Try again." (C1 Rb6); "Good try, but your most powerful piece can still be captured. Try again." (C2 Ba3); "Nice try, but this move loses a rook for free. Try again." (C5 Kf3). Undo shown.
- Right-answer text names the reason: "Great job moving your queen to safety, which is far more valuable than your hanging bishop.", "A knight is worth more than a rook traded for a bishop." (C3, the rook is guarded by g3 so save the knight), "Impressive job finding a way to save your rook and defend the knight at the same time." (C4 Ra7), "Your king defends the threatened rook - you're still up material." (C5 Kg1).
- Engine check [V, depth 16, Stockfish 19 lite]: C1 `6k1/1p2q1pp/8/3p2N1/1R1P4/P7/5PP1/5BK1 w` Nf3 +4.6, Rb6 +0.1 (the rook on b4 is guarded by a3, so saving the knight is right); C2 `2rr2k1/5pp1/2n1p3/3pQ3/1B1P4/4P1P1/5P1P/5RK1 w` Qg5 +3.7; C5 `2k5/2p5/8/6R1/8/4n1PP/1r3PK1/5R2 w` Kg1 +5.5, Kf3 +0.0, Kh2 -0.2. So in C5 the lesson's wrong answer (Kf3) is not a blunder by itself: after Nxf1 the engine still holds equality, but the feedback "loses a rook for free" is accurate for that rook, only not for the game. Minor.
- Other FENs: C3 `5nk1/5pp1/3bp3/3p4/3P1R2/N2P2P1/5P1P/6K1 w` (Nb5 accepted; Rf4 is guarded by g3); C4 `1r6/5Npk/1p5p/3b4/1P6/5P1P/R5P1/6K1 w` (Ra7 saves the rook and guards Nf7).
- Oddity: C5 contains a pin the lesson never mentions (Rb2 pins f2 to the king, so fxe3 is illegal). Contrived-looking but legal; not a defect.
- Ending: "Lesson Complete!" overlay with Finish. Advance in this ladder is from simple (one hanging piece) to a pinned-pawn puzzle.
- Adopt: the answer text says why the other piece did not need saving (defended by a pawn).

### Tile 22, Promotion (7 challenges) [V]
- Concept in first prompt: "Make a queen!" (C1, lone pawn on b7). Then: win a pawn race, promote on a square the enemy bishop does not cover, promote and also cover the opponent's promotion square, choose which of two pawns to push, use the king to stop two passed pawns.
- UI [V]: promotion opens a vertical picker over the board (queen, knight, rook, bishop, and a close cross). Wrong piece gives "Nice try, but this does not promote your pawn into a queen." and the move can be undone. Positions have no kings in C1-C4 (kingless toy positions) and kings only from C5.
- Task type: C2, C5, C6, C7 are multi-move lines with auto-replies (black pawn pushes, black promotes, you capture the new queen); mid-sequence praise is specific ("They're about to promote the pawn - let's get a queen on the board!", "Both sides have promoted a pawn into a queen, but now it's your turn to win material!").
- Wrong-answer samples [V]: C3 b8=Q under the bishop "Nice try, but the bishop is covering this promotion square."; C5 the wrong pawn "Nice try, but this path will not prevent them from safely promoting. Push the other pawn."; C7 Kxd3 "Capturing this pawn was tempting, but the other pawn promotes."
- FENs and engine checks [V, depth 16]: C1 `8/1P6/8/8/8/8/8/8 w`; C2 `8/p7/8/4P3/8/8/8/8 w`; C3 `8/1P4P1/8/4b3/8/8/8/8 w` (g8=Q safe, b8 loses to Bxb8); C4 `8/P7/8/8/8/8/7p/8 w` (a8=Q covers h1); C5 `8/8/8/P4P2/7p/8/1K1k4/8 w`: a6 +12.3, f6 +2.4, b3 0.0. **Defect [V]:** the lesson marks f6 incorrect with "will not prevent them from safely promoting", yet f6 still wins by the engine (+2.4); only the a-pawn route is the cleanest. C6 `3k4/8/8/8/8/5K2/3p4/8 w` (Ke2, then Kxd1 after d1=Q+); C7 `4k3/8/8/8/8/3p4/4Kp2/8 w` (Kxf2 +0.04, Kxd3 loses to f1=Q, others about -13).
- Ending: "Lesson Complete!" overlay, Finish (second press needed).
- Adopt: the picker UI, the "tempting but wrong" phrase naming the trap, positions of 2-4 pieces. Avoid: calling a still-winning alternative incorrect with a false reason.

### Tile 23, En Passant (4 challenges) [V]
- Concept: capture a pawn that just advanced two squares as if it had advanced one. C1 is the bare pattern on a two-pawn board (white d5, black e5, e.p. dxe6); C2-C4 embed it in play: push your pawn to the fifth rank, the opponent double-steps beside it, you capture en passant and then promote (C2, C3) or rescue a forked bishop and knight (C4). The rule is stated in the hint bulb, not in the first prompt (C3 hint: capture the pawn as if it had advanced only one square).
- Task type: multi-step lines with auto-replies. The program makes the opponent's double step at the right time, so the learner never has to wait for a "natural" opportunity.
- Wrong-answer samples [V]: C1 d6 push "Nice try, but this move does not capture the pawn." C3 Kxf7 "Good try, but this move doesn't capture their queen. Try again." Undo each time.
- FENs: C1 `8/8/8/3Pp3/8/8/8/8 w`; C2 `8/1p6/p7/8/P4K1k/8/8/8 w`, a5 then axb6 e.p., then b7, b8=Q; C3 `k7/4K3/6p1/6q1/7P/8/8/8 w` is `k7/4Kp2/6p1/6q1/7P/8/8/8 w` (queen gives check on e7, hxg5 is a plain capture, then ...f5 and gxf6 e.p., then f7, f8=Q+); C4 `6k1/b2p2pp/4p3/4P3/2B1n3/6N1/5PPP/6K1 w` (Nxe4, ...d5 forks, exd6 e.p.).
- Observation [V]: C3 begins with a capture that is not en passant (hxg5), a deliberate decoy so the learner has to read the position; the same position is then reused for the real e.p. step. Both claims are legal. The prompt text for C1 did not appear in my read of the page text; I did not see a rule definition on the first screen [not observed].
- Ending: "Lesson Complete!" overlay, Finish.
- Adopt: have the opponent create the en passant situation on cue; give the rule in a hint, not before the learner has tried the move.

### Tile 24, Castling (6 challenges) [V]
- Concept ladder, one rule per challenge, prompt names the rule: C1 castle kingside (no prompt text seen), C2 "Now to the left!" (queenside), C3 "Your king cannot move through a checked square when castling. Which way can you go?" (rooks on d7 and h7 attack d1 and h1; only kingside is legal), C4 "You can't castle when your king is in check. Block it, so you keep the right to castle." (Ne2 blocks the e-file check), C5 "You can't castle if the rook involved has moved." (only queenside), C6 "If you ever move your king, you can't castle. Force your opponent to move their king..." (Re1+).
- Task type: castle by moving the king two squares (it also accepted clicking the king then the target square). A king step is judged incorrect; an illegal castle (C3, attempted queenside through the attacked d1) is silently refused with no message [V], the prompt stays.
- Wrong-answer samples [V]: C1 Kf1 "That does not castle."; C4 Kf1 "By moving your king, you lost the right to castle."
- Right-answer text: "Good job! Your king is safe now.", "Sweet! Now you know how to castle on both sides.", "Exactly! That was the only castling option.", "Good! You protected your king with your knight and kept the right to castle.", "Yes! That was the only way to castle.", "Correct! Now the king is forced to move and cannot castle."
- FENs: C1 `8/8/8/8/8/8/5PPP/4K2R w`; C2 `8/8/8/8/8/8/PPP5/R3K3 w`; C3 `8/3r3r/8/8/8/8/8/R3K2R w`; C4 `4k3/4r3/8/8/8/2N5/PPP5/R3K3 w`; C5 `r4rk1/ppp2ppp/2b2n2/8/8/2N2N2/PPP2PPP/R3K1R1 w`; C6 `r3k2r/ppp2ppp/1n4b1/8/8/2PB2N1/PP3PPP/R1N2RK1 w`.
- **Defect [V by board geometry]:** C6 says after Re1+ the king is "forced to move". It is not: ...Bg6-e4 blocks the check (g6, f5, e4 are clear), and ...Be4 could then be taken but the black king never has to move. The lesson accepts Re1+ and states a false forcing claim. The point (a check that makes the king move) is better taught by a check with no interposition.
- Note: C4's Re7 check is also blockable by Ne2 and Ne4 (two blocks); the lesson accepts Ne2 (Ne4 not tried).
- Ending: Lesson Complete overlay, Finish, back to /learn.
- Adopt: one rule per challenge, each introduced by a prompt that is the rule, and an illegal castle that is simply not allowed.

### Tile 25, Check (10 challenges) [V]
- Concept in first prompt: "Check please." / put the king in check. Ladder: bishop check (C1), rook check (C2), knight check from a safe square (C3, "Check from a safe square"), a queen check against a knight (C4, "That knight will keep you on your toes"), "How can you safely check?" (C5), "capture with check" (C6), "Which check plus capture is safe?" (C7), then three game positions: "Find the safe check in this game." (C8), "You have a lot of ways to take the black pawn. But only one is check!" (C9), "Attack the king with a strong check." (C10).
- Task type: single move; the learner is judged on one property (is it check, and later, is the checking piece safe). Several different checks may be legal; only safe ones are accepted from C3 on.
- Wrong-answer samples [V]: "That move did not put the king in check." (C1, C3); "Your queen gets captured." (C4 Qc6+ into Nxc6); "Your knight gets captured." (C5 Nf6+ gxf6); "This capture does not check the king." (C6); "Your piece gets captured." (C7, C8); "That is not a check." (C9, C10). Undo each time.
- Right-answer text: "Correct. Now the king is in check.", "Correct. Your knight is safely putting the king in check.", "Yes! This is a safe check.", "You found the strong check!".
- FENs and engine checks [V, depth 16]: C1 `3k4/2p5/8/8/3B4/8/8/8 w` Bf6+; C2 `5k2/5p2/8/8/3R4/8/8/8 w` Rd8+; C3 `b4k2/8/8/8/3N4/8/8/8 w` Ne6+; C4 `4k3/4n3/8/2Q5/8/8/8/8 w` Qb5+ (Qc6+ loses the queen); C5 `6k1/5ppp/8/3N4/8/B7/6K1/3R4 w`: Ne7+ is **mate in 2** (Ne7+ Kh8 Rd8#), Nf6+ gxf6 still keeps +7 for white, so the lesson's "your knight gets captured" is true but the check it calls wrong is also winning; the lesson praises Ne7+ only as "a check with the knight", missing the better teaching point that it is a mating idea. C6 `3k4/8/5r2/8/1n6/2B5/8/8 w` Bxf6+; C7 `8/6q1/2k5/4r3/1n6/3N4/8/8 w` Nxb4+ (Nxe5+ loses the knight to Qxe5); C8 `r4rk1/ppp2p2/1qnp4/2b1p3/2B1P3/2N5/1PP3PP/R2Q1R1K w` Qg4+ (Bxf7+ Rxf7); C9 `rnbqk2r/pppp1p1p/1b3np1/4p2Q/4P3/2BP1N2/PPP1BPPP/RN2K2R w` Qxe5+; C10 `rn1qk2r/pp2bppp/2p2n2/4p3/2B1P3/1QN5/PPP2PPP/R1B1K2R w KQkq - 0 1`: Bxf7+ is +3.5, but the engine's first choice is Be3 (+3.6) and Qxb7 is +2.9; so "the strong check" is sound, not the only good move.
- Ending: "Lesson Complete!" overlay, Finish.
- Adopt: two separate judgements (is it check; is it safe) taught in order. Avoid: calling a check "strong" when an equally good quiet move exists without saying so (minor).

### Tile 26, Getting Out of Check (8 challenges) [V]
- Concept ladder: move the king (C1 "If your king is in check, you have to get away."; C2 "Be sure to avoid all the pieces." one safe square), block (C3 "Another option is to block a check with one of your pieces.", C4 "Block the check.", C5 "Block the check, but don't give away an important piece!"), capture the checker (C6 "Sometimes you can even capture the checking piece.", C7 and C8 "What's the best way to get out of check?"). The three ways to answer a check are therefore taught as three separate runs, then mixed.
- Wrong-answer samples [V]: an illegal king step (C1 Kd2 into the queen) is silently refused and the rule hint is shown again ("If your king is in check, you have to get away."); C3 Ne4 block "You have the right idea, but this move loses the knight. Look for a safer square."; C5 Qd2 block "Nice try, but this move loses your powerful queen. Try to block the check with something less valuable."; C7 Rg2 block "This is a reasonable move, but can you find a way to eliminate the attacking piece?" (a legal, safe block is marked incorrect because capturing is better; the message says so).
- Right-answer text is concrete: "This is the only safe square and you found it", "Your pawn blocks the check while attacking the bishop.", "The bishop captures the checking piece.", "The knight wins the queen."
- FENs: C1 `8/8/8/8/8/4q3/8/4K3 w` (Kd1/Kf1); C2 `8/8/8/4q3/7n/4K3/1r6/8 w` (Kd3 only); C3 `8/8/8/4q3/8/2N5/8/4K3 w` (Ne2); C4 `7k/8/7B/8/8/3q4/8/2RKR3 w` (Bd2); C5 `r1n1k2r/p1pp1ppp/2p2q2/8/1b2P3/6N1/PPP1BPPP/R2QK2R w` (c3, attacks the bishop; a position with black Nc8 and no b8 knight, plausible); C6 `8/8/8/8/4q3/2N5/8/4K3 w` (Nxe4); C7 `8/7B/8/8/4q3/8/8/6RK w` (Bxe4, Rg2 accepted by the rules but marked incorrect); C8 `rnb1k1nr/pppp1ppp/8/2b5/4PB1q/3P1N2/PPP3PP/RN1QKB1R w` (Nxh4).
- Not engine-checked [I]: C2 "only safe square" by hand (Kd3; every other square is hit by Qe5, Rb2 or Nh4).
- Ending: Lesson Complete overlay, Finish (second press).
- Adopt: three runs, one per escape (move, block, capture), and a feedback line that says why a legal answer is still not the one wanted.

### Tile 27, Checkmate (9 challenges) [V]
- Concept in the first prompt: deliver mate (C1 no text, C2 "There are several checks, but only one is checkmate."). Ladder of patterns: back-rank rook mate (C1), queen mate with a piece guarding the queen (C2 Qe6#, C3 "Your bishop is supporting your queen's checkmate attack." Qxg7#, C4 knight-supported Qxe7#), Scholar's-mate pattern ("This is a classic checkmate trap.", C5 Qxf7#), "Their king is open in the center. Go in for the win!" (C6 Qe6#), then the rook ladder: C7 with the second-to-last rank covered (the prompt states the method), C8 and C9 rung by rung ("Let's step the rooks one at a time like rungs on a ladder", "Can you checkmate with the rooks in three moves?").
- Task type: one move that mates in C1-C7; C8 and C9 are multi-move: the learner checks, the program moves the king, the learner checks again. The board shows a "Winner" tag on the mated king and the praise line when the mate lands.
- Wrong-answer samples [V]: C1 Bxf7+ "Nice try, but the king can capture your piece. Look for another check that wins the game."; C2 Qe4+ "Nice try, but this is not checkmate. Let's look for a way to safely check the king so it cannot escape."; C5 Qxe5+ "Nice try, but this loses the queen. Look for another queen check and you'll find checkmate."
- FENs, engine-checked where not obvious [V, depth 16]: C1 `6k1/5ppp/6b1/3B4/8/8/5PPP/2R3K1 w` (Rc8#); C2 `3rkr2/8/8/8/2Q5/8/8/2K5 w` (Qe6#, unprotected on e6 but nothing can take it); C3 `5rk1/1q3ppp/8/8/3Q4/8/1B3PPP/6K1 w` (Qxg7#); C4 `4k3/4bppp/2N5/8/8/4Q3/q4PPP/6K1 w` (Qxe7#, engine: mate 1; the only mate, other moves about 0.0); C5 `r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w` (Qxf7#); C6 `rn1q1b1r/p1p1kBpp/1p3n2/4p3/4P3/1Q6/PPP2PPP/RNB1K2R w KQ - 0 1` (Qe6#, engine: mate 1, next best +4.4); C7 `5k2/2R5/8/8/8/8/1R6/K7 w` (Rb8#); C8 `8/6k1/1R6/R7/8/8/8/4K3 w` (Ra7+ then Rb8#); C9 `8/8/7k/1R6/2R5/8/8/4K3 w` (Rc6+, Rb7+, Rc8#).
- No defect found. C2 and C6 are real "find the only mate" positions, not forced-answer boards.
- Ending: Lesson Complete overlay with Finish.
- Adopt: the Winner tag on the mated king, patterns introduced in order (back rank, supported queen, Scholar's mate, ladder), the method stated only after the learner has met the pattern twice.

### Tile 28, Draws (played in full, 5 challenges) [V]
- C1: a stalemate trick. The prompt itself defines stalemate (side to move, not in check, no legal move). Kxc8 stalemates and is graded correct.
- C2: Kg1 stalemate; the program scripts the black reply (Kg3) before the draw is awarded.
- C3: Nxe6 draws; the tempting Nxf5 is graded wrong with a message.
- C4: Rxa2 is the only drawing move (engine -0.10 against about -6.9 for the others) [V engine]. The lesson teaches a "find the only move" skill well.
- C5: perpetual check by threefold repetition. The learner must repeat Qg5+/Qh5+ about three cycles; each check gets a fresh encouraging line, and the final one says the position was repeated three times and the draw is salvaged. A wrong try (Qxh8+) was marked "not a safe queen check". The multi-move repetition is the notable design: the learner does the repeating, which makes the rule felt, not told.
- Ending: the standard "Lesson Complete" overlay with Finish. The graduation modal after tile 28 was not observed [H: it may not exist].
- Adopt: teach draws as a rescue tool (winning-looking positions you must save), not as a rule list. Avoid: nothing notable; no defect found in Draws.
