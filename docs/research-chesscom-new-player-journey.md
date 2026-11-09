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
Sign-up, level choice, rating estimate, the welcome flow, the start-of-day goal setting, and any "daily goal"; coach introductions; (updated 9 Nov: Beginner lessons 15 to 28 are now played in full, including wrong-answer feedback; see the full play notes below; only the graduation modal after tile 28 is still unseen); Intermediate and Advanced lessons beyond the first prompt (being played, see the Intermediate and Advanced path section); graduation modals of later groups; whether dim tiles open when clicked; mobile app.

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

## Intermediate and Advanced path (played in full, 9 Nov 2026)
Shell is the same as Beginner: Start card, "Challenge n/N", hint bulb, green Next arrow, red undo after a wrong move, "Lesson Complete" overlay with Finish. The Learn page's Next Lesson button opens the next tile directly (it passed from the Beginner group into the Openings-sourced lessons; the URL path changes to /lessons/chess-openings/). Section dividers on the path read NEXT SECTION: Beginner, Intermediate, Advanced. [V]

### Tile 29, Control The Center (4 challenges, /lessons/chess-openings/how-to-control-the-center) [V]
- Concept ladder: C1 push the pawn in front of the king to e4 (centre squares shaded on the board); C2 add d4 against 1.e4 e6; C3 same idea as Black (board flips, 1.d4 d5); C4 "they blundered" after 1.d4 d5 2.e4: take the free pawn with ...dxe4, with the moral "don't put pawns in the centre if they are not safe there".
- Wrong feedback [V]: a3 in C1 gives a hint-like line saying we are moving the pawn in front of the king; a red cross and undo appear. In C4, Nf6 (attacks e4, a perfectly sound move) is "incorrect: try to capture a free pawn". In C2 an attempt with a knight was silently ignored (only the highlighted pawn seems movable), so feedback depends on the challenge.
- Defect/overstatement [I]: C4 calls 2.e4 a "blunder"; it is a known gambit-like idea (Blackmar-Diemer type), not checked by engine here. Teaching "centre pawns must be safe" via a gambit is shaky. [H, not engine checked]
- Ending: Lesson Complete overlay; Finish returned to chess.com home, then /learn. The coach on /learn names the next lesson ("develop your pieces to control the center").
- Adopt: shade the centre squares; one-pawn first move as the first win. Avoid: marking a sound alternative incorrect without saying so.

### Tile 30, Develop Your Pieces (5 challenges, /lessons/chess-openings/developing-your-pieces) [V]
- Concept: develop knights before bishops, bishops to squares that attack something, free the queenside bishop by a centre pawn, then pin/attack with Bg5. Start card says "develop your pieces rapidly to squares where they control the center".
- Moves asked: C1 Nf3 (after 1.e4 e5; feedback says it is the most popular move among top players); C2 ...Nc6 defending the pawn; C3 Bb5 ("White is ready to castle"); C4 d3 freeing the c1 bishop; C5 Bg5 attacking Nf6.
- Wrong feedback [V]: Nh3 "we are asked to develop the kingside knight to the best square"; ...Nh6 "does not develop a piece and protect the pawn"; Be2 "develop your kingside bishop to attack a black knight on a light square"; b3 "it's better to move a centre pawn to free your queenside bishop"; Bd2 "use your dark-squared bishop to attack a knight". Each message names the principle rather than the move. The first Next click after hint shows a hint on a second press; the hint bulb gives a one-line hint.
- Quirk [V]: the board orientation flips for the Black challenge and the wrong-answer label shows the origin square (e.g. "d2 is incorrect" for Bd2).
- Defect [I]: C3 (after Nc3 Nf3 Nc6 Nf6) there are several good bishop moves (Bc4, Bb5); only Bb5 is accepted, Be2 was rejected with a hint to attack a knight. C5: Bg5 is the only accepted move although Bd2/Be3 are also normal development; the lesson tests "attack a knight", which is stated in the prompt, so it is fair.
- Adopt: the prompt states the goal ("develop to attack a black knight") so wrong answers can be diagnosed; each wrong message names a principle. 

### Tile 31, Castle to safety (5 challenges, /lessons/chess-openings/castle-to-safety) [V]
- Concept ladder: C1 castle kingside (Italian-type position); C2 castle queenside ("either side of the board"); C3 clear the path first (Ne2 so the king can castle; Nf3 was also accepted, the label showed "ge2" for the knight from g1, a cosmetic label quirk); C4 "castling has to avoid check": the black bishop on c5 aims at g1, so only queenside works; the hint bulb draws a red arrow from the bishop to g1; C5 "protect the rook": O-O-O so Rd1 and Rh1 protect each other while Qg2 hits h1.
- Wrong feedback [V]: Nxe5 in C1 "That move is not castle."; Ke2 in C2 "That move is not castle."; Ke2 in C5 "By moving your king, you lost the right to castle." (a better, specific message); an illegal castle in C4 (through the bishop's attack) is silently refused. The correct feedback in C4 says "that was the only way to castle".
- The title says "Castle to safety" but the lesson is really the rules plus one legality test; C5 is the only tactical idea.
- Defect check: none found. C5 FEN `r3r1k1/pp3ppp/2pb1n2/3p4/3P4/1B2B2P/PPPQ1Pq1/4K2R w` queenside castle is legal (king not in check, d1/c1 unattacked) [I, not engine-run].
- Adopt: the hint draws the attacking line as an arrow. Avoid: "not castle" as the only feedback for a wrong move; say why the move is wrong.

### Tile 32, Forks (8 challenges, /lessons/chess-tactics/how-to-fork) [V]
- Shell variant: this board shows no coordinates beside the squares while the lesson opens on a two-piece diagram; Start card says "Learn how to fork". Each challenge is two-step: make the fork, then the lesson plays the opponent's reply and asks "Can you capture now?" (the Next arrow shows a hint at that point, not a skip).
- Ladder: C1 knight fork king+queen (Ne6+; bare K+Q+N board); C2 queen fork from a SAFE square (Qe7+ forking Kg7 and Bc7; the other highlighted square g3 loses the queen, feedback "Your queen gets captured."); C3 bishop fork (Bd5+ king and rook) and a trap: "Can you save your knight?" so the capture of the rook must wait; C4 pawn fork (c6 against Rb7 and Nd7); C5 forks where pieces work together (Nf7+ protected by Bb3); C6 fork to promote (Re8+ Qxe8, dxe8=Q+); C7 pawn fork d5; C8 "sneaky check": Qa4+ forking king and bishop g4.
- Wrong feedback [V]: "You cannot attack both pieces here. Do you want a hint?"; "This is not a fork. Try again."; "That is not the fork. Look again."; "That was not it. Try again, you can use a hint."; "Can you promote to the most powerful piece?" (for dxe8=R+); "Your queen gets captured." Hints name the target ("Move your knight where it can attack both pieces").
- Quirk [V]: after the correct fork the opponent reply is scripted and sometimes skips moves; in C7 after d5 black captured the pawn and the lesson jumped (exd5, then an unexplained later position in C8). The learner is not shown what happened.
- Defects [V engine, depth 16]: C3 position `8/p5pk/Pp4Np/1PnB4/8/6P1/r4P1P/6K1 w`: Bxa2 (rook for knight) is marked incorrect but engine +1.39 (still winning; best Nf8+ +6.29). C6 `q5k1/r2P1pp1/6b1/7p/8/1BP3NP/PP3PP1/4R1K1 w`: Re8+ is best (+6.56); dxe8=R+ is marked incorrect with "promote to the most powerful piece" even though the rook also checks, an acceptable simplification. C7 `r2qk2r/ppp2ppp/1bnpbn2/4p3/3PP3/2P2N2/PP2BPPP/RNBQ1RK1 w`: d5 is best (+4.64); the pawn fork wins a piece. C8 `4k2r/ppp2ppp/1q2n3/8/6b1/2P2N2/PP3PPP/2BQ1RK1 w`: Qa4+ best (+6.79).
- Ending: Lesson Complete, Finish. Adopt: "safe square" test inside a fork lesson, hint text that names the idea, capture as a second step so the fork is proved by winning material. Avoid: scripted skipped moves with no explanation.

### Tile 33, Pins (9 challenges, /lessons/chess-tactics/how-to-pin) [V]
- Ladder: C1 Bc5 pinning Qd6 to Kf8, then win the queen (note: the king steps away and the pin is gone; the queen is still attacked, so the message "now you can win the queen" is loose); C2 Re1 pins Ne4 to Ke8 (the knight is the only black piece besides the king); C3 Rc8 pins Bd8 to Kg8; C4 Bb2 pins Nc3 to Kf6 in a middlegame; C5 Bg5 pins Nf6 to Rd8 with Qf3 behind it, "play the best capture" (the lesson wants the bishop, not the queen: "your queen is too valuable, capture the knight with a less valuable piece"); C6 double up on a pinned bishop (Rd1; black adds a defender that does not defend); C7 "pin, then add an attacker" (Re1, then f3 pawn attack); C8 a pinned bishop cannot capture the queen (Qxd4); C9 Re8# because the pinned rook cannot block.
- Wrong feedback [V], the best of any lesson seen so far: it explains the refutation. Rc4 in C2: "attacking the knight this way allows a surprising fork, winning your rook." Rd1 in C3: "Attacking a moving target can be tricky. Try pinning the bishop to the king." Bxd5 in C7: "this loses your bishop." Re7 in C9: "such a tempting move ... the king is able to escape when you are not winning" (engine: Re7 is -0.01, Re8# is mate in 1 [V]). Bxf6+ in C8: "this capture doesn't win material."
- Defects [V]: C6 feedback says the knight "is trying to defend the bishop" but the knight on f5 does not defend d5 (FEN `3r2k1/p4p1p/1p4p1/3b1n2/8/1P6/P2R1PPP/3R2K1 w`). C5 engine: Bg5 +5.66 versus Be5 +0.40 (the pin is the winning idea) [V].
- Quirk [V]: each pin challenge is two moves (make the pin, then the lesson makes the king/defender move and you capture), the Next arrow acts as a hint button until the second step is done.
- Adopt: refutation-naming wrong-answer text, the "tempting move" praise, mate as the last challenge. Avoid: loose "the pin is gone but win the queen" wording.

### Tile 34, Skewers (6 challenges, /lessons/chess-tactics/how-to-skewer) [V]
- Concept stated up front: "Skewers are backwards pins: you attack a higher-value piece, and when it moves, you win a lower-value piece." Ladder: C1 Rd1+ vs Ke3?/Qd8 (bare board K+Q+R); C2 Bb2+ king and queen on one diagonal; C3 Ra8+ king and rook on the back rank; C4 Rd1 vs queen with Bd8 behind (two rooks cooperate), engine +4.38 [V]; C5 "No hints this time": Bb4 against Qe7 and Rf8, then Bxf8; C6 a skewer with nothing behind: Rd1 hits the queen, then Rd8# (engine Rd1 +6.14, c4 -0.60 [V]).
- Wrong feedback [V]: almost always the same stock line "That was not a skewer." (also "That was not the right attack. Please try again."). No refutation named (compare Pins). Bxb6 in C3 (free pawn) and Re1 in C4 are both just "not a skewer".
- Structure: same two-step pattern as Pins (make the skewer, then the opponent moves the front piece and you capture the back piece). Hint bulb exists except C5 (a message announces no hints). Ending: Lesson Complete with a "Checkmate / Winner" banner after the mate.
- Defects: none found. Adopt: "no hints this time" as a fading-support moment, a final challenge that bends the definition (no piece behind). Avoid: the one stock wrong message.

### Tile 35, Trapped Pieces (5 challenges, /lessons/chess-tactics/trapped-pieces) [V]
- Ladder: C1 Bb2 attacks the boxed-in Rh8 (Ng8 blocks it); C2 Bxb7 traps Ra8 behind Nb8 (engine +6.15 [V]); C3 Bg5 attacks Qf6 whose flight squares are covered, Qxg5 Nxg5 (queen for bishop); C4 "your wall of pawns": h5 traps Bg6 (Bxh5 gxh5); C5 "No hints this time": Rcg1 traps Qg2 (engine +4.08 [V]), Qxg1 Bxg1.
- Wrong feedback [V]: "You can't capture a rook this way." (Bg5 in C1); "That's not the way to capture a trapped piece." (Bh6 in C2, which the engine rates +5.54, a strong move, so the message is misleading); "That's not the move." (Qe2 in C3); "That's not it, try again." (g5 in C4). Nf5 in C5 (engine -1.60) was ignored with no feedback at all [I: the click may not have registered; not retried].
- Structure: each challenge is two or three steps (trap, then the captured piece recaptured). Support fades: "No hints this time" in C5.
- Defects: C2 Bh6 labelled wrong while strong [V engine]. Otherwise none found.
- Adopt: "your wall of pawns" framing for a pawn trap, the exchange recapture as the last step so the trade is seen. Avoid: stock messages.

### Tile 36, Discoveries (4 challenges, /lessons/chess-tactics/discoveries) [V]
- Concept stated up front: a discovery attacks twice, "attack the queen while revealing a check on the king". Ladder: C1 Bh6 uncovers Rd1+ and hits Qg7 (K+Q+B+R board); C2 the reverse, Bh7+ uncovers Rd1 on Qd5 (black king takes the bishop, Rxd5 wins the queen for a bishop); C3 "which knight check wins the queen?" Nf6+ (gxf6 not shown; the lesson plays ...f6) versus Ne7+, where Qxe7 refutes; C4 a discovered mate: Bxf6# (bishop on g7 in front of Rg1, the king has no flight).
- Wrong feedback [V]: Be1+ (C1) "find a way for your bishop to attack the black queen while your rook checks the king" (names the missing half); Bf5 (C2) "try to find a way to check with your bishop"; Ne7+ (C3) "Black wins the knight and saves the queen" (names the refutation, good); Bh6+ (C4) "try to find a capture that's also checkmate" (a hint that gives away the answer type).
- Shortest lesson in the group (4 challenges); no defects found. Positions are small, so the engine was used only to confirm the answer in C4 by inspection (no mate-in-one alternative).
- Adopt: teach the two-way discovery (attack queen + check, then reverse), end with a mate. Avoid: nothing notable.

### Tile 37, Pawn Strategy (5 challenges, /lessons/chess-strategy/pawn-strategy; first lesson of the strategy strand) [V]
- Start card: "Pawns are best on adjacent files, rather than isolated or doubled." Ladder: C1 pawn-only board with a knight: exd5 (not cxd5) so b3-c4-d5 stay connected; C2 pawns d3/d2 doubled: dxe4 (not Bxe4) undoubles; C3 K+B+2 pawns vs K: axb6 (not Kxb6) undoubles and wins (engine +8.11 versus +0.09 for Kxb6 [V]); C4 recapture on f3 with the knight, not gxf3 (keeps pawns healthy); C5 trade a bishop for the f6 knight so black recaptures gxf6 and doubles pawns near the king, then Qg3+ and Qg7# (the exposed king pays).
- Wrong feedback [V]: always names the structural reason ("This move leaves one pawn isolated", "We are trying to undouble our pawns", "Black's king can block the white pawns", "There's no need to double your pawns"). Illegal clicks (a mis-clicked square) are silently ignored.
- Design note [V]: the first challenges use stripped boards (no kings), which isolates the concept; C3 and C5 return to king-and-pawn / middlegame positions so the concept earns a concrete result (a won ending, a mate). A strong pattern: concept in the vacuum, then cashed in.
- Defect check: none found; the "right" answers are also the engine's best in the two positions checked (C3, and C5 by sight). Adopt: show the structural concept on a bare board, then the same idea deciding a game. Avoid: nothing notable.

### Tile 38, Bishops (played in full, 9 Nov 2026)
- Strategy-strand opener, 6 challenges, single-step (some two-step). Ladder: bishop to a long diagonal (C1), pin a knight (C2), one bishop against three pawns (C3), bishop guarding the pawn shield (C4), queen plus bishop mate threat (C5), then a trapped bishop that does not matter because a mate is available (C6). [V]
- Wrong feedback: C2 Be3 got a specific "interesting trade but pinning is stronger" note; C4 g3 named the refutation (loses a knight, mate still threatened); C5 Qf4 said it does not threaten mate; C6 a3 (engine +2.66, still winning) was marked incorrect with "you can win in one move, look for a powerful check", a hint that steers without giving the move. C1 Be2 was silently ignored. [V]
- Defect: C3 `2k2B2/8/8/8/3Kp3/P2p4/2p5/8 w`: the lesson says the bishop can stop all three pawns, but engine gives Bh6 only +0.24 (about a draw); Bb4 is -6.52. The claim is overstated. [V engine]
- Defect pattern: a sound alternative (a3) is "incorrect"; the text softens it ("nice try"). Adopt that tone; avoid marking winning moves wrong, or say "also winning, but mate is faster". [V]
- Ending: Lesson Complete overlay with Finish; no graduation modal. [V]

### Tile 39, Rooks (played in full, 9 Nov 2026)
- 6 challenges, mostly one-step with a scripted reply. Ladder: rook to the only open file (C1, highlighted file), double rooks to win a pawn (C2, bare board), double on the open file (C3), double first then capture the weak pawn (C4, d5 highlighted red), rook to the seventh rank (C5, row highlighted), doubled rooks on the seventh (C6). [V]
- Teaching device: the target file or rank is highlighted on the board in the early challenges, then the prompt gets terse; a clear concept-to-position fit. Weak pawn shown in red. [V]
- Wrong feedback is specific and names the missing idea: "does not move your rook to the only open file", "one move too early, double first" (Rxd5), "does not add a second attacker", "loses your rook, move it behind your other rook", "does not double across the seventh". Each ends with a nudge, never the move. Adopt. [V]
- Defects: none found. C6 `1r1r2k1/1pR3pp/p7/P7/4P3/7P/6PK/5R2 w`: Rf7 is +5.52 engine best; the alternative Rb1 is about +0.25, so the lesson's choice is right. Rb7 capture try in C5 was a mis-click (not recorded as a test). [V engine]
- Ending: Lesson Complete overlay with Finish; no graduation modal. [V]

### Tile 40, Knights (played in full, 9 Nov 2026)
- 5 challenges. Ladder: bare-board centralisation with arrows showing the knight's reach grows from 4 to 8 squares (C1, highlighted target), a true outpost supported by a pawn that no enemy pawn can challenge (C2, bare pawn skeleton), an Italian-style position: outpost on d5 pinning-pressure then capture (C3), a second knight rerouted so the outposted one can be replaced (C4, red arrow shows the threat), knight and queen mate (C5). [V]
- Wrong feedback: C1 "we're focusing on the highlighted square"; C2 Nc5 "loses the knight" (true: bxc5); C3 Nb5 and C4 Na3 and C5 Ng6 got generic "not a knight move that ..." or "not a safe square" lines, less specific than the Rooks lesson. [V]
- No defects: C3 Nd5 is engine best (+0.64); C4 Ne3 is near-best (+0.28 vs +0.30); C5 Qxg7# is mate in 1 and Nf5 is +5.47. The C2 outpost is genuine (no black d- or f-pawn left to evict it). [V engine]
- Weakness: in C5 the opponent reply Rfd8 walks into a mate in 1; the position is staged, not natural. Positive: the same tile mixes concept (outpost) with a tactic payoff each time, giving a visible want. [V]
- Ending: Lesson Complete overlay with Finish; no graduation modal. [V]

### Tile 41, Queens (played in full, 9 Nov 2026)
- 5 challenges. Ladder: centralise the queen (C1, Qd5 engine best +4.72), do not bring the queen out early: attack it with a developing knight (C2, Scandinavian after 1.e4 d5 2.exd5 Qxd5, Nc3 highlighted), queen plus rook mate on g7 (C3), queen fork Qh5+ against king and e5 pawn (C4), then a chain: Qxe5+ forking king and rook, then Qxh8 (C5). [V]
- Wrong feedback: C2 Nf3 "there's a better move, find a back-rank piece to attack the queen"; C3 Qd6 "there is a checkmate but that is not it, look for a check and see if it's mate" (good graded hint); C4 Qf3 "look for a strong check"; C5 Qxh7 "look for a safe capture" (true: Rxh7). The hints name the type of move without giving the square. Adopt. [V]
- Defects: C1 Qa4 was a mistaken attempt (illegal, b3 pawn blocks), not a lesson test. C4 and C5 positions skip black's reply g6 and Kf7 the usual way: a Next press reveals the scripted reply, an inconsistency with other lessons where it plays automatically. C5 Qxh8 "free rook" is true but Qxg8 is not tested. No engine-flagged error. [V, partial engine]
- Weakness: the Scandinavian-based C2 uses a sample line that leaves the black queen hanging nothing; the lesson states "Black must lose time" but the queen did not move in-lesson. [V]
- Ending: Lesson Complete overlay with Finish; no graduation modal. [V]

### Tile 42, Passed Pawns (played in full, 9 Nov 2026) - first Endgames-strand lesson
- Only 3 challenges, but each is multi-step: make the passed pawn, then push it move by move to promotion with the opponent's replies scripted, including a promotion picker (queen/knight/rook/bishop). Ladder: C1 f5 instead of the trade fxe5 (highlighted f4 pawn with arrow), C2 b6 instead of bxa6 (bxa6 Nxa6 is a dead draw; engine b6 +5.30 vs bxa6 0.00), C3 sacrifice h6 gxh6 and run the g-pawn. [V engine for C2]
- Wrong feedback: C1 "you missed the opportunity to create a passed pawn", C2 "trading pawns leads to a draw, create a passed pawn instead" (accurate and names the evaluation), C3 Kd2 "better move, clear a path to promote". Adopt the draw/win naming. [V]
- Defects: copy typo in the final message ("You pushed you created a passed pawn"). No position error found. Not tested: whether the opponent's king could catch the pawn if you play slower. [V]
- Ending: Lesson Complete overlay with Finish; no graduation modal. [V]

### Tile 43, Defending Promotion (played in full, 9 Nov 2026)
- 6 challenges, endgames strand. Ladder: cover the queening square with a bishop on a bare board with no kings (C1; Be4 refuted as "Black can promote"), cover it with a knight (C2, Nf2 then capture the new queen), win the pawn with a check (C3, Bc7+ then Bxh2), a pawn promotes but a rook skewer-like sequence recovers (C4, Rh8, Rxh6+, Rxh1, ends as a stated draw), rule of the square (C5, shaded square on the board, king steps in and chases, "the game is a draw"), and the same idea from the attacker's side (C6, h6 not hxg6, then promote). [V]
- Teaching device: the square is shaded on the board in C5; C1 uses kingless positions to isolate the one idea. Honest outcomes: the lesson says "draw" when the chase only trades down (C4, C5). [V]
- Wrong feedback: C1 "Black can promote, cover the square it is trying to reach"; C2 "does not stop the pawn from safely promoting"; C3 Kc4 "will promote next turn, target it"; C4 Rd6 only "there's a better move, check the hint"; C5 Kf4 "won't catch before it promotes"; C6 hxg6 "Black's king soon catches your pawn". Mostly consequence-naming. [V]
- Engine checks: C3 start `3B4/8/8/1K2k3/8/8/7p/8 w`: Bc7+ is best, eval +0.18 (K+B vs K, a draw), so "win the pawn" is true and winning is not claimed. C4 `3R4/8/7n/8/8/3K3k/7p/8 w`: Rh8 is 0.00, Rd6 -6.08; claim matches. C6 `8/8/6p1/3k3P/8/8/6K1/8 w`: h6 +6.34, hxg6 0.00; claim matches. No defect. [V engine]
- Interface note: a promotion picker (Q/N/R/B) appears at the top of the file and must be clicked; the Next arrow after a capture only shows "Capture the queen." as a hint if the step is not finished (C5, black Qa1 after promoting). [V]
- Ending: Lesson Complete overlay with Finish; no graduation modal. [V]

### Tile 44, Checkmate with a Queen (played in full, 9 Nov 2026)
- 4 challenges, all on bare K+Q vs K boards, each with one stated principle. Ladder: edge mate with king support (C1, Qg7# target highlighted), the knight's-move box (C2, an arrow shows the king being herded, Qe6), the stalemate trap in the corner (C3, the stalemating square Qf7 is shaded red, the safe Qe7 is shaded orange), bring the king up so mate is next (C4, Kf6 then Qg7#). [V]
- Wrong feedback: C1 Qh7+ "there's a checkmate but that's not it, look at your checks"; C2 Qg4+ "move the queen to the closest safe square near the black king" (Qg4+ is not a blunder but loses the box); C3 Qf7 "That's stalemate. Try again." explicit; C4 Kd6 "move your king as close as possible". Naming stalemate as the failure is the best wrong-answer text of this sweep so far. Adopt. [V]
- Defect: none positional. Minor: the opponent reply (Kh8, Kg8) is not played on the board between steps; the learner presses Next and the next challenge starts from the new position, so the king's forced reply is described in the prompt, not shown. [V]
- Pattern to copy: shade the trap square and the good square in the stalemate challenge; the lesson prepares the learner for the single most common queen-mate error. [V]
- Ending: Lesson Complete overlay with Finish; no graduation modal. [V]

### Tile 45, Strike in the Center (played in full, 9 Nov 2026) - Advanced Openings strand
- 5 one-step challenges from five opening shapes: Philidor 3.d4 (C1, arrow on d2-d4), Giuoco Pianissimo d4 (C2, d4 shaded), a Queen's Gambit shape c4 "side pawn in front of the bishop" (C3), French Advance ...c5 played as Black with the board flipped (C4), and an Italian/Two Knights shape ...d5 (C5). The principle is one sentence: answer a centre by hitting it with a pawn. [V]
- Wrong feedback is the weakest so far: stock lines like "That was not the move", "There is a better move to strike in the center", "That is not the correct move"; C3 and C4 add "find the pawn move". No refutation named. Bc4, O-O, Nc6, h6 were all marked incorrect without a reason. [V]
- Defects: C2 O-O is "incorrect" although castling is main line there; engine puts d4 at +0.63 and the rest of the top 3 are queenside pawn moves, so "better move" is true but only by a few tenths. C4 Nc6 is a main-line French move marked incorrect on a prompt-sense technicality (the lesson wants a pawn strike). C5 `r1bqk2r/pppp1ppp/2n2n2/8/2BPP3/5N2/PP1N1PPP/R2QK2R b`: ...d5 is engine best (-0.44), ...Nxe4 -0.54, so "the" answer is right but not unique. [V engine]
- Design note: marking reasonable alternatives "incorrect" teaches single-answer thinking in openings. Scholarmate should accept near-equal moves with a short explanation of why the strike is better. Black-side and flipped-board exercises appear here for the first time in the path (C4, C5). [I]
- Ending: Lesson Complete overlay with Finish; no graduation modal. [V]

### Tile 46, Develop with Tempo (played in full, 9 Nov 2026)
- 4 one-step challenges. Ladder: Nc3 hitting an early queen (C1, Scandinavian shape, arrow shown; reuses the Queens-lesson position), ...Bc5 as Black hitting a loose knight (C2, Scotch shape, flipped board, f8 square shaded), O-O-O+ gaining a tempo on a king on the open d-file (C3), Bc4 developing with a mate threat on f7 (C4, Scholar's-mate shape). [V]
- Wrong feedback: all stock lines ("That is not a way to gain tempo", "That is not the correct development", "That is not the move" x2). No refutation or hint in any of four. [V]
- Defects: C1 Bb5+ is refuted by Qxb5 (the bishop is unprotected), but the text says only "not a way to gain tempo", which hides the real reason. C3 Bxf6 and C4 Nc3 are marked incorrect with "That is not the move", which tells the learner nothing. The C1 position is the same one used in Queens C2 (position reuse across lessons). Not engine-checked beyond reasoning: Bb5+ Qxb5 is forced loss of a bishop [I]. [V partial]
- Takeaway: this is the thinnest-feedback lesson of the strand; the concept (a move that attacks something while developing) is clear but a learner who guesses wrong learns nothing. Scholarmate should always say why a near miss fails (what it hangs). [I]
- Ending: Lesson Complete overlay with Finish; no graduation modal. [V]

### Tile 47, Prevent Castling (played in full, 9 Nov 2026)
- 4 challenges. Ladder: bishop to the diagonal that covers the castling squares (C1, Bc4 vs Black's weakened f6; an arrow shows the bishop's line to g8), a check that forces the king to move (C2, Nxg7+ with an escape on g7-e6), a never-castled king punished: Qe2+ Qe7 then Qxe7# supported by the a3 bishop (C3, two-step), and a pin against the queen on the e-file: Re1 (C4). [V]
- Wrong feedback: C1 Be2 "That is not the move."; C2 Nxd6+ "Your knight gets captured." (a real reason); C3 Bf8 "That is not the move yet. Please try again."; C4 Nc3 "find a way to attack their queen with your rook" (nudges the piece, not the square). [V]
- Engine checks: C2 `r3k1nr/pppq1p1p/2npb1p1/2b1pN2/4P3/2NP2P1/PPPBQPBP/R4RK1 w kq`: Nxg7+ best (+1.33), Nxd6+ is a real mistake. C3 `r2qk2r/2pp1ppp/1pb4n/8/p2P4/B1P5/P1P2PPP/R2QNRK1 w kq`: the engine finds mate in 3 starting Qe2+; the lesson's Qe2+ then Qxe7# matches. C4 `r1b1kbnr/pppp1pp1/2n4p/8/2Bpq3/5N2/PPP2PPP/RNBQ1RK1 w kq`: Re1 +5.80, Nc3 +1.76 (also winning, but marked incorrect). [V engine]
- Defects: (a) C1's premise "make it hard for the king to castle" is weak: Black's Bf8 and Ng8 still stand, so castling is not possible anyway, and the Bc4 vs g8 idea only matters later. (b) C4 closing line "They can't save the queen" is overstated: Qxe1 Qxe1 trades queen for rook, it does not win a free queen. (c) C3 Bf8 was refuted by the lesson with a non-reason. [V engine for C4]
- Ending: Lesson Complete overlay with Finish; no graduation modal. [V]

### Tile 48, Remove the Defender (played in full, 9 Nov 2026) - Advanced Tactics strand
- 6 challenges, longest chains yet (two to three scripted opponent moves). Ladder: bare-board bishop takes a knight that guards a bishop, rook then takes the bishop (C1, red highlight on the defender, arrows showing the guard); rook for rook to expose a bishop (C2); Rxf6 removes the knight that guards h7, then Qxh7# (C3); Bxf6 Bxf6 Nxd5 (C4, defender highlighted); a pawn push e5 hits the defender, then Rxd7 (C5, hint "a lowly pawn can be powerful"); g5 hits the knight that guards f7, then Qxf7# (C6, hint "which piece is stopping you?"). [V]
- Wrong feedback: short, specific and true, always naming the cause: "Your rook gets captured", "That piece was defended", "The bishop was defended", "Your queen gets captured", "The knight was defending" (this last one is the lesson's concept named in the failure). Better than Strike in the Center and Develop with Tempo. [V]
- Engine checks: C3 `5rk1/pp3pp1/1bpq1n1p/3p4/3P4/2PQ3P/PPB3P1/5RK1 w`: Rxf6 +5.10, anything else about -6; C4 `1kr4r/ppp1bppp/2n2n2/3bp1B1/8/2N5/PPP1NPPP/R3RBK1 w`: Bxf6 +4.92, Nxd5 -0.87; C5 `r4rk1/pppb1ppp/1b3n2/8/4P3/P1N2N2/BP3PPP/3R1RK1 w`: e5 +5.21, Rxd7 loses; C6 `r2qk2r/ppp2ppp/1bnp3n/4p3/2B1P1P1/2NP1Q1P/PPP1NP2/R3K1R1 w kq`: g5 +5.20, Nd5 +1.43. No defects found. [V engine]
- Design takeaway: the concept is stated as a question, "which piece is stopping you?", so the learner names the defender before moving. The wrong-answer text then re-uses the same word, "defender", reinforcing the vocabulary. Adopt for Scholarmate's tactic lessons. [I]
- Ending: the final mate shows the Checkmate/Winner banner; the Lesson Complete overlay follows (see next tile entry for the observed Finish). [V]

### Tile 49, In Between Moves (played in full, 9 Nov 2026)
- Note on the previous tile: pressing the green Next arrow after the final mate of Remove the Defender went straight back to /learn with no Lesson Complete overlay; the lesson was still counted (Next Lesson advanced). [V]
- 5 challenges on the zwischenzug. Ladder: capture with check first, then the rook (C1, arrows show the knight on h6 and the king on f8; Bxh6+ then Kxf2), a check that saves a forked rook (C2, Ra8+), a queen move with check that saves the queen and keeps the threat (C3, Qc2+ then Nxf6), a queen sacrifice with check that wins the other queen back (C4, Qxe8+ Rxe8 Rxa1), and an unhinted final test (C5, "No hints this time!", Nf5 saves the knight with tempo, then Kxg2). Support fading is explicit in C5. [V]
- Wrong feedback: C1 Kxf2 "better move, look for a strong check"; C2 Rc1 same stock text; C3 Qxf6 "try to find a safe check"; C4 Rxa1 "Black is ahead in material. Try to find an in-between-move to play before capturing the queen." (names the concept and the consequence); C5 Kxg2 "try to save your knight before capturing the bishop". Good where it names the hanging piece. [V]
- Engine: C2 `5k2/5p2/5rp1/7p/8/7P/2n2PP1/R3R1K1 w` Ra8+ +3.24 vs Rc1 +0.06; C3 `2k5/p5pp/1p3q2/8/6N1/3n3P/5Q2/7K w` Qc2+ +6.47 vs Qxf6 -5.87; C4 `2r1r1k1/5ppp/4Q3/8/8/5N1P/6P1/q4R1K w` Qxe8+ +2.98 vs Rxa1 -5.56; C5 `r5k1/pp2qpNp/2p5/3p4/3P4/3B2P1/PPP2PbP/R4RK1 w` Nf5 +6.23 vs Kxg2 -0.10 (drawish but the lesson says Kxg2 loses the knight, true). No defect. [V engine]
- Mechanics note: in several steps the opponent's reply is shown only after pressing Next or the next click; the learner is told what to look for rather than shown the full sequence. [V]
- Ending: Lesson Complete overlay with Finish; no graduation modal. [V]

### Tile 50, Defense (Advanced Tactics strand), played in full [V]
Six challenges on defending under attack: cover the attacked square with a quiet piece move (C1 Bf1, C2 Ne1), develop a piece to answer a pawn threat (C3 Na6), block a check with a piece rather than moving the king (C4 Nf6), choose the king square that avoids a skewer (C5 Ke2 then Rd2), and a forcing queen-trade sequence for Black (C6: Qc1+, Kh2, Qf4+, Qxf4, gxf4).
- Feedback on wrong moves is the strongest seen so far on the path: it names the consequence ("loses your queen, try blocking the check with a piece", "skewers your king to the queen", "right piece, find a safer defensive square"). Engine checks of the wrong tries all show a large loss (-1.3 to -5.7).
- Exception: C6 wrong try Qa1+ got only a bare "is incorrect" with no reason (engine: Qa1+ allows a mate in 5 against Black, so a reason was available). Worth copying the consequence style there.
- C6 plays the whole trade out, including the opponent's scripted capture, so the learner finishes the combination rather than stopping after the key move.
- Overlay "Lesson Complete!" with Finish; the closing remark says to move on to the next lesson. No defects found in the six positions (engine-checked best moves clearly best).
- Layout note: the pane flipped back to the 800x842 desktop frame during C6; flipped-board file x runs h..a = 103..537.

### Tile 51, Brilliant Sacrifices (Advanced Tactics strand), played in full [V]
Five challenges, all "give material to win more": C1 queen sacrifice for back-rank mate (Qd8+ Rxd8 Rxd8#), C2 rook sacrifice to drag the king into a knight fork (Rf8+ Kxf8 Nd7+ then Nxb8), C3 rook sacrifice to deflect the only defender of the queen (Re8+ Rxe8 Qxg3), C4 bishop on h7 then rook on d7 to win the queen (Bxh7+ Kxh7 Rxd7), C5 queen sacrifice then rooks on the seventh to mate (Qe6+ Bxe6 Rg7+ Kh8 Rxh7+ Kg8 Rcg7#).
- Ladder: the four named motifs are mate, fork, deflection, and the rooks-on-the-seventh finish. Each prompt names the idea in a sentence ("Sacrifice a piece to draw their rook away...", "which sacrifice lets your knight fork...") so the learner searches for a goal, not a move.
- Wrong-move feedback is generic and consistent: "Nice try, but this does not work / is not a winning move / only trades queens ... Look for a powerful check." Only C3 gave a reason ("only trades queens"); C4 Nd5 (engine +0.7, a decent move) is rejected by the stated test "does not win their queen", which is honest. Hints point at "a powerful check", which narrows the search a lot.
- Engine-checked best moves (Stockfish 19 lite) are clearly best in all five (C1 mate in 2, C5 mate in 4; others +2.9 to +4.8 against alternatives near 0 or worse). No defects found.
- Weakness: C4 ends on Rxd7 with no recapture shown, so the learner never sees that the line is only +4.8 not a clean win; C2 and C3 scripted replies are forced, fine.
- Ending: all five completed, then "Lesson Complete!" overlay with Finish.

### Tile 52, Smart Trades (first Advanced Strategy lesson), played in full [V]
Four challenges teaching which trades to make. First time the path moves from tactics to positional judgement.
- C1 (middlegame): which enemy piece should the knight trade for? Answer: Nxd3, the strong knight, not Nxc6, the bishop blocked by its own pawns. Wrong-move feedback is conceptual ("This bishop was not a threat. It was blocked by pawns."). Engine (Stockfish 19 lite): Nxd3 +0.4, Nxc6 -0.2, so the rejected move is only slightly worse; the lesson's claim is a sound strategic principle, not a tactical fact.
- C2 (pawn ending): trade pawns or advance? Answer: h6, h7, h8=Q (engine +7.8; hxg6 is a dead draw, 0.0). Feedback for the wrong try was the generic "Try again. You can do it." with no reason. Promotion here queened automatically after the second click (no picker shown).
- C3 (bishops): "Should you trade for their bishop?" Nxf7 wins; Ng4 is "incorrect" with only "Try again." Engine: Nxf7 +5.6, Ng4 +0.1. Correct feedback ("because it was a threat to your king") is vague, and the challenge ends before Kxf7 Bc7, so the pawn win that makes the line good is never shown.
- C4 (opening): "Your pawns are strong on the dark squares, theirs on the light. Should you trade dark-square bishops?" The board highlights the relevant pawns and bishops in colour (orange pawns, red bishop) before the move, a good visual cue to copy. Both Bg3 (inviting the trade) and by implication Bxd6 are accepted; the positive feedback explains the h-pawn recapture freeing the rook. Engine: Bxd6 +0.1, Bg3 -0.1, all equal, so the lesson accepts any move that keeps the principle.
- Pattern worth noting for Scholarmate: yes/no style questions ("should you trade?") with a move as the answer; the principle (bad bishop = blocked by own pawns) is stated in the prompt, which makes it a recognition task, not a discovery task.
- No defect, but feedback depth drops sharply versus Defense/Brilliant Sacrifices: three of four wrong tries got generic text.

### Tile 53, Tempo (Advanced Strategy strand), played in full [V]
Six challenges, one idea: develop a piece while attacking something so the opponent must answer. The first prompt defines it ("develop with tempo: make a threat at the same time"); later prompts just ask "how can White develop with tempo?".
- C1 (Black, flipped, Scandinavian-style queen on d4): Nc6 hits the queen. C2 Bd3 hits the knight on e4. C3 Bf4 hits the queen on c7. C4 Nf3 hits the queen on d4 (Nb3 also attacks it but was rejected). C5 Be3 hits the queen on c5. C6 Rac1 hits the queen on c7. So four of six targets are the queen: a repeated pattern, with the target piece shifting.
- Feedback on wrong moves is short and mostly points back at the idea: "Try again, think about tempo", "Try again, with tempo", "is there a major piece you can attack?", "threaten the queen". C4 Nb3 got an excellent consequence line: the queen escapes while taking a pawn (true: Qxb2). That is the best feedback in the lesson.
- Questionable rejections (engine, Stockfish 19 lite, [V]): C1 Nf6 (attacks e4, normal development) and C3 O-O (+0.1 behind Bf4) are marked wrong only because they lack a threat. C5 started from a position the engine rates -1.7 for White, so "tempo" there is damage control, not a gain; the lesson does not say that development with tempo can still be a worse position.
- Gap: no exercise where the tempo move is a mistake (for example the attacked queen captures something), apart from the Nb3 line. The lesson only trains the "find the threat" reflex, not "check the reply".
- Ending: C6 Rc1 triggers "Lesson Complete!" with Finish. Pacing is quick (about 6 min), good for a short concept.

### Tile 54, Batteries (Advanced Strategy strand), played in full [V]
Five challenges. Defines a battery in the first prompt (two pieces lined up in one direction that support each other), then uses it three ways: mate, winning material, and breaking the opponent's.
- C1 rook battery on the e-file: Re8+ Rxe8 Rxe8# (a back-rank mate; the learner plays both halves). C2 is tagged "Review Challenge" in the header, the first time I have seen the path label a review item: Be5 behind the queen on the long diagonal, then Qg7# (engine: mate in 2). C3 triple battery: Qh1 behind two rooks on the h-file, then Rxh7 (engine +5.1 for Qh1, other tries about 0). C4 Rh1 builds a queen-in-front h-file battery, then Qh8# (engine: Rh1 -0.3, so only "best by a mile" because the other moves are -4; the position is not winning on the spot). C5 defence: interpose Ba3 to disrupt Black's a-file rooks (engine +1.7, c3 and c4 are only +0.2).
- Teaching point stated in C3's prompt: a queen in front of a battery suits mating, a cheaper piece in front suits winning material. This is the clearest piece of the lesson and is then tested (C3 puts the queen at the back, correctly).
- Wrong-move feedback is the weakest tier: "Try again. You can do it.", "not the best move yet", "Try again." Four of five wrong tries got no reason. "Not the best move" is honest here because several moves were playable (C4, C5).
- C4 weakness: the engine gives Rh1 only -0.3 and the line needs Black to cooperate (g6 played by the script). Marked as a clean win by tone, not by evaluation.
- C5 line "Their battery is ruined" is loose: after Ba3 Rxa3 bxa3 Rxa3 the rooks still trade into a won rook ending for Black? Engine +1.7 for White, so the claim holds in outcome, not in wording.
- Ending: "Lesson Complete!" overlay with Finish after C5. Time about 8 min.

### Tile 55, Gaining Space (partial notes, C1-C2 played) [V]
- C1: 1.e4 Nf6, "save your pawn, make a threat, take space at the same time": e5. The prompt itself names the three goals. Wrong try Nc3 (a normal move, protects the pawn) got only "Try again." with no reason.
- C2: Giuoco Pianissimo shape, "how should White gain space in the center?": d4 (attacks the bishop). Wrong try O-O got "Try again." Both rejected moves are sound moves, rejected only for not matching the lesson's aim.

### Tile 55, Gaining Space (complete, six challenges) [V]
Replaces the partial notes above (C1-C2 stay valid).
- C3 (Black, flipped): the "famous trap" (Noah's Ark): c5 hits the queen, then c4 traps the bishop on b3, then Nxc4. Engine: c5 +3.1 against Bb7 +0.7. The prompt names it a "famous trap" but not its name, and wrong try Bb7 got "find the best move" only. The learner finishes the whole sequence.
- C4: after 1.e4 Nf6 2.e5 Nd5 3.c4, "take advantage of the extra space to win material": c4 (engine +5.4; Nf3 only +1.2). Positive feedback names both ideas ("gained space and attacked the knight"). The knight is not actually won here, so the lesson stops before the claim is tested: the "win material" framing is stronger than the position (the knight has retreats).
- C5 (advance French, bishop on f5): g4, then f3, then h5 and gxh5 traps and wins the bishop (engine +4.3 for g4). Wrong try Nc3 got a useful reason: "you need a move that takes space". Scripted replies make the trap work; a free opponent could defend better, which the lesson does not say.
- C6 (check from Bc5 after Black's ...f4 pushed): "get out of check and gain space": d4 (engine +1.2; Kh1 +1.1 is nearly equal), Rf2 is -4.5 yet the feedback was only "Try again." Positive feedback is the generic "Correct! Nice find!".
- Pattern: this lesson mixes three ideas (pawn advances that gain space, traps from space, blocks that gain space) in six challenges and always has the pawn as the answer except C3's knight capture. Prompt lines tell the answer category ("a move that takes space"), so it is guided recognition.
- Ending: "Lesson Complete!" overlay with Finish. Wrong-answer feedback tier: mostly generic ("Try again."), with two reasons (C5, C3).

### Tile 56, King and Pawn Endgames (Advanced Endgames strand), played in full [V]
Five challenges on the one pattern: king in front of the pawn, win by promotion. Every position was checked with Stockfish 19 lite and is won.
- C1 "goal position" (Kd7, e6 vs Kf8): e7+ then e8=Q (engine +9.1). C2 Kd6 e6 vs Kf8: Kd7 (mate in 11) then e7, e8. C3 Ke6 e5 vs Kf8: Kd7, e6+, e7, e8. C4 Kd6 e6 vs Ke8: e7! (Ke8 must go to f7) then Kd7, e8. C5: Kd6 e5 vs Ke8, "take the opposition": Ke6 then the C3 pattern again.
- Defects (all engine-confirmed, [V]): C1 Kd6 (+8.7, wins) and C3 Kd6 (+9.6, wins) were marked incorrect with "Try again, push for promotion." and "Try again, you can do it!". C2 Ke5 (engine 0.0, a draw) got only "That was not the best, try again please", which hides that it throws away the win. C4 Kd5 (draw) got "There's a better move... check the hint". C5 Kc6 (draw) got "Do you need a hint?". So the lesson accepts one move per position although other winning king moves exist, and never says a wrong move gives a draw.
- Feedback tier is weak: no wrong try named the draw, the opposition or the reason. Positive feedback does name the idea ("their king was forced to move away").
- Promotion: a picker (Q, N, R, B) appears at the promotion file; the queen is at the top and the first click selects it. Challenge C3's last step ends with an extra "Analyze" button next to Next (opens a new tab; the pane blocked it). Click the green bar, not the right edge, to continue.
- Ending: "Lesson Complete!" and Finish. About 8 minutes; the same win is repeated in C3 and C5 (about 40% of the lesson is repeated pattern, which suits the idea of drilling).
- Absent: no draw-by-stalemate example, no distinction between the key squares and the rook pawn; this is the entry to the endgame strand, not the full theory.

### Tile 57, Trading into Winning Endgames (Advanced Endgames strand), played in full, five challenges [V]
Idea: trade the pieces that stop your pawn, then win the pawn race or the opposition. All positions engine-checked (Stockfish 19 lite).
- C1 `6R1/4krp1/6K1/7P/8/8/8/8 w`: Rxg7 Rxg7 Kxg7, then h6, h7, h8=Q (engine +6.2). Wrong try Ra8 got "Try again, use your rook. Do you want a hint?", which is misleading because Ra8 is a rook move.
- C2 (Black, flipped) `8/r7/7p/8/4k3/RK4PP/8/8 b`: Rxa3+ Kxa3 Kf3, then Kxg3 and Kxh3 (engine +6.2). Wrong try Rf7 got "That was not the best move. You can try again."
- C3 (Black, flipped) `5b2/7p/4p1p1/1r2Pp2/1BK2PkP/1R4P1/8/8 b`: Rxb4+ Rxb4 Bxb4+ Kxb4 Kxg3, Kxf4 (engine +3.0). Wrong try Rb8 got "not the best move, do you want a hint?"
- C4 (Black, flipped) `8/6k1/4q3/6pp/8/2Q3P1/PK6/8 b`, "Force a queen trade, then promote a pawn!": Qf6 (engine +6.2; Kf7 only +0.4), Qxf6 Kxf6, a4 h4, gxh4 gxh4, h3, h2, h1=Q, and White promotes at the same time (a8=Q), then Qxa8 wins the queen. Wrong try Kf7 got "f7 is incorrect. Try again. You can do it." Feedback after each step names the stage ("You forced the queen exchange, now can you recapture?", "The race is on. Can you win?", "One last square. Can you make it?", "You both promoted, what's next?"). Good: a pawn race taught with a running commentary. Weak point: the script makes White promote into a queen that Black then takes; a real opponent would not play Qa8 into it, and the lesson does not say so.
- C5 `8/4n3/3k4/5PK1/8/8/8/2B5 w`, "Force a trade then use opposition to promote your pawn": Ba3+ (pins the knight, engine +5.96), Kd7 Bxe7 Kxe7, Kg6, Kf8, Kf6 (the only winning move, +6.5; f6 draws, engine 0.0), Kg8, Ke7 (+6.3), Kg7, f6+, Kg6, f7, f8=Q+. Wrong tries: f6 on move one got "Try again, can you find a tricky move?" (engine +0.18, so it is no blunder, only not winning); f6 in the king ending got "Try again. You can do it." and hides that it is a draw. Positive feedback is strong on the opposition ("you used your king to block their king").
- The lesson ends right after f8=Q+ with "Lesson Complete!" and Finish; no mate is played out.
- Defects: the Ra8 hint wording in C1 (above); in C4 the opponent walks into a lost queen (script, not a position defect). No position was unsound.
- Time about 10 minutes. The promotion picker here is a vertical stack Q, N, R, B above the promotion square with an X below; the queen is the first item.

### Tile 58, Active Pieces in the Endgame (Advanced Endgames strand), played in full, five challenges [V]
Idea: in endgames, activity beats material; make the opponent's pieces passive. Engine: Stockfish 19 lite. All five are one- or two-move challenges, much shorter than tile 57.
- C1 `1k3n2/8/1P6/2K5/8/8/2B5/8 w`, "Use your bishop to make sure their knight can never get back in the game": Bf5 (engine +8.2; Kc6 +0.24). The board arrives with four red squares already marked (d7, h7, e6, g6: the knight's targets), so the picture does the teaching. Wrong try Kc6 got "Try again, there is a better move." Right: "Now their knight is stuck."
- C2 `r5k1/p2R1pp1/1r6/6P1/5P2/8/1P4PK/2R5 w`, "Should you passively protect your pawn or go on the offensive?": Rc7 doubling on the seventh (engine +3.2; b3, the passive move, +0.3). Wrong try b3 got only "Try again." Right: "Yes, doubling rooks is very powerful." The prompt gives the answer away ("go on the offensive").
- C3 `5rk1/1p3pbp/6p1/p4PP1/P6P/6B1/8/4R1K1 w`, "ensure Black will never activate the bishop": f6 (engine +4.1, bishop retreats to h8 and stays shut in). Wrong try Re7 (engine +0.02) got "Try again."
- C4 `4k3/2r5/4p1p1/p1p2pPp/PpPpPP2/1P1P3P/4BK2/8 w`: e5 closes the position so the rook has no entry (engine +0.08, near equal, only the plan is claimed). Wrong try Bxh5 (a real pawn grab, engine -0.84) got a reason: "Your bishop gets captured." Right: "Yes, now the rook is stuck."
- C5 `1r4k1/7R/6K1/2B5/q2P4/8/6P1/8 w`, "Black has a large material advantage, but White's pieces are active enough to force a draw": Rg7+ Kh8 Rh7+ and a perpetual (engine 0.0; Ra7 loses, -6.3). Wrong try Ra7 got "There's a better move. Try to find it." The lesson ends on the first repetition with "Exactly, you will get a draw by repetition" (the only lesson so far that teaches a draw as the goal).
- Findings: (1) the red-square overlay in C1 is the best visual cue seen so far in the Advanced strand. (2) Only C4 gave a reason for a wrong move; the rest are "Try again." (3) The strand teaches a concept (activity) from five different shapes in five minutes, with no explanation text; the learner infers it. (4) Time about 6 minutes. Ending: "Lesson Complete!" overlay and Finish.
- Defects: none unsound. C4's claim is only a plan (+0.08).

### Tile 59, Checkmate with a Rook (Advanced Endgames strand), played in full, five challenges [V]
The "box method" for K+R vs K, taught by drawing the box as two yellow arrows (the rook's rank and file) on the board. Engine: Stockfish 19 lite.
- C1 `8/8/8/4k3/8/8/3R4/4K3 w`: the rook already draws its rank and file as arrows; the prompt names the idea ("a shrinking box: control a rank and file, then tighten it each move when safe"). Rd3 accepted ("Exactly, now the box is smaller."), and the arrows redraw. The engine's top move is Rd8 (+7.8), Ke2 and Rd1 also win; the lesson accepts the box-shrinking move. The blunder Rd4 (hangs the rook to Kxd4) got only "Try again." with no reason.
- C2 `8/8/8/8/4k3/3R4/8/4K3 w` (Black king attacks the rook): Ke2 protects the rook ("Yes, the king is now protecting the rook."). Engine: Ke2 +6.2, Kd2 +5.8, Rd8 +5.8, all winning. Rd8 was marked "incorrect. Try again." with no reason, so a sound winning move is rejected and the learner is not told why.
- C3 `8/8/4k3/8/8/3RK3/8/8 w`: Rd4 accepted ("Yes, now the box shrinks."). Engine: the top moves are king moves (mate in 11 and 13); the rook box move is slower, so the lesson teaches the rule, not the fastest mate.
- C4 `6k1/8/5RK1/8/8/8/8/8 w` ("Eventually, you will reach a position like this one"): the engine finds mate in 2 with Rf4, Rf1, Rf7 (all equal). Rf4 was accepted at once with "This move leads to checkmate. Congratulations." and the challenge ended without playing Kh8 and Rf8#. So here several moves are accepted, unlike C1 and C2; the acceptance rule is not consistent across the lesson.
- C5 `7k/5R2/6K1/8/8/8/8/8 w`, "Look at your checks. Which one is mate?": Rf8#. The wrong check Rh7+ got a reason ("The king escapes."), the only reasoned wrong feedback in the lesson. The mate is played out: a "Checkmate / Winner" card appears under the "Lesson Complete!" overlay.
- Defects: C2 Rd8 (winning) rejected without a reason; C4 accepts all mate-in-2 moves, C2 does not. No position was unsound.
- Time about 6 minutes. The lesson teaches a method (box, king to the rook's side, mate on the edge) in five single positions; nothing is practised from the start of the method to the end in one position (no play-it-out).

### End of the Learn path (tile 59) [V]
- The path has 59 tiles in the page's own link list: the last is Checkmate with a Rook (Advanced Endgames strand). The sections shown are Beginner, Intermediate, Advanced.
- On finishing, `/learn` shows the coach line "Excellent work, my friend. You're ready to move on in your chess journey." in a speech bubble. No separate graduation modal appeared. The "Next Lesson" button stays and now points at an opening course outside the path (Learn the Closed Sicilian, `/lessons/learn-the-closed-sicilian/learn-the-closed-sicilian`), so the product hands the finished learner to the opening library rather than ending.
- Strand lengths in this stretch: Advanced Tactics, Advanced Strategy (4 tiles), Advanced Endgames (4 tiles). Advanced Endgames lessons are the shortest of the path (about 6 to 10 minutes each).
