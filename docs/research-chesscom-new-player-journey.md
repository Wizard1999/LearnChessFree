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
