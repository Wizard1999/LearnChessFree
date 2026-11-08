# Research: what chess.com's interactive lessons actually are (8 Nov 2026)

The benchmark Andrew asked for. I walked chess.com's free "Learn To Play" course from first screen to last by doing every challenge in the built-in browser, logged out (no account, no sign-in). Then I tried every beginner course I could find, and played the one other course that opened.

**Evidence labels:** [V] seen today in the browser (with positions read from the page's board, not guessed); [I] my inference; [S] secondary (earlier notes in `docs/competition-chesscom.md`). Wording below is mine. Coach lines are paraphrased, with the word count of the original bubble in brackets. No screenshots are kept in the repo (the browser captures stay in the session scratch area).

## 1. What was read and what was not

**Read and played [V]:**
- "Learn To Play" (`/lessons/learn-to-play`, 12 lessons, 35 challenges): every lesson and every challenge, in order. I made a deliberate wrong move in about a third of them to see the feedback.
- The end-of-course modal, and the Learn path page it leads to (`/learn?fromIntro=true`).
- The older "Learn To Play Chess" course (`/lessons/learn-to-play-chess`, 2018, 13 lessons, 65 challenges, listed as 18 minutes). It is also free logged out. I played 3 of its 13 lessons in full: The King and the Goal, The Queen, Checkmate.
- The beginner catalogue page (`/lessons/skill-level/beginner`), plus the course pages of Playing the Game, Opening Principles, Winning the Game, Capturing Pieces and Finding Checkmate (their lesson lists and sizes).
- The mobile layout (375x812 emulation) of the first King challenge.

**Reached, but stopped by a sign-up wall [V]:** I clicked Start on the first lesson of each of Playing the Game, Winning the Game, Opening Principles, Capturing Pieces and Finding Checkmate. Every time, a "Sign up to unlock Lessons!" modal opened, the lesson did not start, and the lesson's "Explainer Video" was locked behind the same modal. So I saw only their opening positions and summaries, never their challenges.

**Not checked:**
- Anything behind sign-up. I created no account, as instructed.
- Whether the speaker button ("Toggle Lesson Audio") plays a voice-over or only sound effects. I could not hear the page, and no audio request showed in the buffer I could read.
- The "?" button that replaces the hint bulb after one hint. It probably reveals the move [I], but I did not press it.
- The other 10 lessons of the 2018 course.
- What the 13th tile of the "New to Chess" section of the path is (12 lessons, 13 tiles).
- Intermediate and Advanced content.
- Behaviour on a real phone (I only emulated the viewport).

No CAPTCHA or bot check appeared at any point.

## 2. The "Learn To Play" course, lesson by lesson [V]

**Layout [V]:**
- **Desktop:** board on the left, about 60% of the width. To its right a narrow sidebar holds the lesson title, a back arrow, a speaker toggle, a coach avatar with a speech bubble (the text types itself in), a "Challenge n/N" progress bar ending in a piece badge, and one big green button at the bottom. A display-ad column sits at the far right during lessons.
- **Mobile:** the board fills the width at the top, the title bar and coach bubble sit under it, and the big button is at the bottom. A Sign Up / Log In pair is in the header. No ad was visible in the first screen.

**What the learner does in the first 10 seconds [V]:** sees a board with a lone white king on e1 and one short bubble (12 words: start with the king, the most important piece), then presses "Let's Start!". The next screen gives the rule (9 words: one square in any direction) while green arrows on the board show the king's moves, then "Continue". On the third screen a star sits on f2 and an animated hand drags toward it. **The first move is possible about 6 to 10 seconds after landing [I from the number of screens].**

**Mechanics shared by all lessons [V]:**
- **Info screen:** one bubble and a "Continue" button. There are about 24 of these in the whole course.
- **Star challenge** (the six piece lessons): one piece and one star at a time. Any legal move is accepted and the piece simply stays where it lands. There is no move counter, no par and no rating; an extra move (I played Ke2 before Kf2) gets no comment. Taking a star plays a "+1" effect, points fly to the progress bar, and the next star appears.
- **Target challenge** (pawn onwards):
  - The right move turns the square green with a tick, shows a success bubble, and replaces the button with a "next" arrow.
  - A legal but wrong move turns both squares red. The coach explains the error, and two buttons appear: show solution (magnifier) and retry. Sometimes the opponent plays the refutation first: the rook takes the queen, or the king takes the rook.
  - An illegal move snaps back and shows legal-move dots, with no message.
- **Hints:** a bulb button. One press rewords the task and highlights the piece to move. After that the bulb becomes a "?" (not pressed). Show-solution plays the move, shows the success text, and still lets you continue.
- **Scoring:** none. There are no stars out of three, no best-move count, no rating and no time. Each lesson ends with a large "Lesson Complete" badge over the board (a piece emblem), and one arrow leads straight into the next lesson.
- **Positions:** positions are minimal and often have **no kings**. The six piece lessons use one piece; Capturing has no kings at all; Checkmate challenges 1 and 2 have no white king.

### Per-lesson table [V]

Times are my wall-clock time in the browser. Each includes 2 to 3 seconds of waiting per tool call and my deliberate wrong moves; a learner would be faster [I].

| # | Lesson | Info screens | Challenges | Interaction | Positions and escalation | Coach bubbles (paraphrase [words]) | My time |
|---|---|---|---|---|---|---|---|
| 1 | The King | 2 | 3 | drag to stars | Ke1, star f2 (1 move, hand animation) → Kf2, star f4 (2 moves, path arrows shown) → Kf4, star d3 (2 moves, no arrows) | most important piece [12]; one square any way [9]; drag to the star [7]; nice, next star [6]; one more [8]; now you know the king [10] | ~95 s, 11 calls |
| 2 | The Queen | 2 | 3 | stars | Qd1, star d5 (1) → Qd5, star h8 (2) → Qh8, star a2 (2) | next, the queen [8]; most powerful, any distance straight or diagonal [19]; take the star [7]; now several moves [11]; last star [8]; on to the other pieces [16] | ~60 s |
| 3 | The Rook | 1 | 3 | stars | Ra1, star a5 (1) → Ra5, star d7 (2) → Rd7, star b3 (2) | meet the rook, straight lines [16]; can you take it [9]; next [7]; last [6]; fast learner [6] | ~30 s |
| 4 | The Bishop | 1 | 3 | stars | Bb1, star f5 (1) → Bf5, star e8 (2) → Be8, star d5 (2) | diagonals [12]; take it [7]; next [4]; last [5]; two pieces to go [17] | ~30 s |
| 5 | The Knight | 2 | 3 | stars | intro Nb1 with pawns a2 b2 c2 to show the jump; then Nb1, star c3 (1) → Nc3, star g5 (2) → Ng5, star e1 (2) | L-shape [10]; only piece that jumps [12]; take the star [8]; a few moves [9]; last one [6]; keep going [5] | ~35 s |
| 6 | The Pawn | 3 | 4 | target moves, then a star, then promotion | e2 to e3 (e4 is refused with "legal, but practise one square"); e2 to e4; Pe4 with star d7 (e5, e6, then take the star diagonally); Pd7 to d8, piece picker Q/N/R/B | one forward, two on the first move [16]; one square [7]; refusal [13]; more pawns than any piece [21]; two squares [10]; hint: two forward [6]; done [8]; captures only diagonally [9]; up, then take [7]; promotion [22]; reach the end, choose queen [15]; queen is usually right [16] | ~90 s |
| 7 | En Passant | 1 | 1 | target | wPe5, bPd7 animates d7-d5; play exd6 | the rule in one bubble [25]; imagine it moved one square [13]; rare but useful [14] | ~25 s |
| 8 | Capturing | 6 | 4 | choose the safe capture | intro shows the full starting position (the only time in the course). Then: W Qd5, B Ph5 + Rh8 (green capture arrow, red recapture arrow) + Pa5 → Qxa5 (Qxh5 answered by Rxh5); W Qd1, B Pa4 Pg4 Qg6 → Qxa4; W Rd4, B Qg4 Bd6 Pe7 → Rxg4; W Nd4, B Pc5 Pd5 Pe5 Bc6 Re6 → Nxe6 | basics to play with confidence [19]; captures give an edge [10]; queen could take, but… [8]; what if a rook guards it [8]; rook would take back [15]; other pawn is free [6]; take the free pawn [7]; wrong: it was guarded [8]; free capture is great [10]; pick an unguarded pawn [10]; right [14]; which is safe [6]; right, queen was loose [10]; which should the knight take, it jumps [14]; bishop was guarded, rook is right [11] | ~95 s |
| 9 | Check | 1 | 2 | target | intro W Bc6, B Ka8 (arrow); W Bb5, B Ka8 → Bc6+; W Pd6 Pe6, B Ke8 → d7+ (e7 answered "no check, try again") | check defined: threatened, could be captured next turn [24]; check with the bishop [9]; king must move [13]; which pawn checks [15]; wrong [9]; pawns check diagonally [15] | ~50 s |
| 10 | Getting out of check | 1 | 3 | target | W Ka1, B Qa3 → Kb1 (Kb2 snaps back; only b1 is dotted); W Ka1, B Qb2 → Kxb2; W Ka1 Rb1 Rb2, B Qa3 → Ra2 | must get out next turn [16]; by moving [10]; escaped [8]; by capturing [10]; escaped [8]; by blocking [11]; three ways: escape, capture, block [17] | ~55 s |
| 11 | Checkmate | 1 | 3 | target | intro W Re8, B Kh8 Pg7 Ph7; W Re7 (same Black) → Re8# (Rxg7 answered by Kxg7); W Rb1 Rc2, B Ka8 → Ra2#; W Qc7 Kf6, B Kg8 → Qg7# | no escape = checkmate, game over [15]; mate with the rook [7]; wrong: rook lost [4]; can't capture, move or block [11]; mate with a rook [9]; nowhere to run [13]; your king guards your queen [17]; hint: a safe square next to the king [14]; king can't take, yours would take back [18] | ~55 s |
| 12 | Castling | 3 | 3 | target | W Ke1 Rh1 Pf2 g2 h2 → O-O; W Ke1 Ra1 Pa2 b2 c2 → O-O-O; full back-rank pawns plus B Rd8 → only O-O (O-O-O snaps back, dots on e2 f1 g1) | special move, king and rook together, safety [26]; king two squares right [14]; safe corner, rook joins [14]; either side, now left [17]; there are rules [17]; the rules list [29]; can't go left, the rook gives check [20]; right is safe [14]; castle early [16] | ~65 s |

**The ending [V]:** after the last Castling move comes the "Lesson Complete" badge. The next arrow opens a modal, "You Mastered the Basics!", with a one-line nudge to explore more beginner lessons and a Finish button. Finish opens the Learn path page. There, logged out, the path again marks the **King** as "Next": progress is not saved without an account. The path's menu offers Next Lesson, Play Coach, Learn an Opening and Lesson Library.

**Login and paywall inside this course [V]:** none. No sign-up prompt appeared at any point in the 12 lessons. The only prompts are the permanent header buttons (Sign Up, Log In) and the ads.

## 3. Interaction patterns, summarised

- **One piece, one goal, one bubble per screen [V].** No bubble in the course is longer than 29 words; most are 6 to 16. Info screens and challenges alternate, about 24 info screens for 35 challenges.
- **Escalation inside a piece lesson [V]:** 1-move reach, then 2-move reach with the path drawn, then 2-move reach with no drawing. The scaffold fades within 3 challenges.
- **Escalation across the course [V]:** move a piece; special moves (pawn, promotion, en passant); choose between captures (safe or guarded, then by value, then with a knight jumping over blockers); give check (with a piece, then picking the right pawn); the three ways out of check, one each; mate in one (rook, two rooks, queen and king); castling (short, long, then the case where only one is legal).
- **Teaching from the wrong answer [V]:** the opponent actually plays the refutation (rook recaptures, king takes the rook) and the coach names it in a few words.
- **Three kinds of "no" [V]:**
  - an illegal move snaps back with dots and no words;
  - a legal move that is not the task gets an explanation;
  - an unasked-for but legal move in the pawn lesson is acknowledged as legal ("legal, but practise one square first").
- **Arrows as explanation [V]:** green for my capture, red for the recapture, green fans for the moves of a piece.
- **Hints in two steps [V]:** a reworded instruction plus a highlighted piece, then a "?" (not pressed). Show-solution and retry appear after a wrong move.
- **Reward [V]:** a "+1" effect per star, a progress bar ending in a piece badge, a piece emblem at the end of each lesson, and a course trophy modal. Nothing is graded.
- **The 2018 course, for comparison [V]:**
  - Each challenge is a "White to Move" card with a question. The answer is shown in notation from the first move ("Ka7 is correct", "Kb8 is incorrect", "Qh8 is an alternative").
  - It accepts alternative solutions and then asks for the other one. In the Queen lesson, after Qh8 it asked for a second square and accepted Qh1.
  - Its positions are legal, with both kings (the Checkmate lesson: Ra8#, Qf8#, Be4#, Qh3#, Nd6#).
  - Each lesson has 5 challenges, an Explainer Video button, Analyze, and Review Challenge.
  - At the end of a lesson the next button goes back to the Learn page, not to the next lesson.

## 4. Pacing and total time for the free rules block

- **My time [V]:** about 11.5 minutes of wall-clock for all 12 lessons (from the first screen at about 0 s to the trophy at about 690 s), in about 60 browser tool calls (many batched). This included deliberate wrong moves in 8 challenges, hint and solution tests, and one interruption when another session took the browser pane.
- **A new learner [I]:** about 24 info screens at roughly 5 seconds each, 35 challenges at roughly 5 to 10 seconds each, and 12 end-of-lesson animations. That comes to **about 6 to 9 minutes for the whole rules block**, with **under 1 minute per piece lesson**.
- **What the block does not include [V]:** the starting set-up (shown once, never taught), stalemate, draws, notation, the rule against castling through an attacked square, and **any game**. The learner "masters the basics" without ever playing a game, and the course's next want ("explore more beginner lessons") leads straight to the sign-up wall.
- **The 2018 course [V]:** 13 lessons of 5 challenges, listed at 18 minutes. The three lessons I played took about 1 to 1.5 minutes each.

## 5. Paywall and login behaviour [V]

- **Logged out:**
  - Learn To Play (12 lessons) and Learn To Play Chess (13 lessons) open and play fully.
  - Every other beginner course I tried opens its lesson page and shows the first position and summary. Pressing Start (or the Explainer Video) opens a modal, "Sign up to unlock Lessons!". The modal is a carousel listing the benefits of an account: 1500+ lessons, puzzles, game analysis, a rating, saved games, opening explorer. It has Sign Up and Log In buttons. Closing it returns you to the locked lesson.
  - The path's tiles beyond "New to Chess" show a coach line on hover but do nothing on click.
- **Progress:** not kept logged out. After finishing all 12 lessons, the path still pointed to the King.
- **With a free account [S, support article, not checked today]:** other categories are limited to one lesson a day.
- **Course sizes seen today [V]:**
  - Playing the Game: 7 lessons, 35 challenges, 43 minutes.
  - Opening Principles: 5 lessons, 26 challenges, 26 minutes.
  - Winning the Game: 5 lessons, 25 challenges, 16 minutes.
  - Capturing Pieces: 9 lessons, 45 challenges, 34 minutes.
  - Finding Checkmate: 6 lessons, 30 challenges, 20 minutes.
  - The Learn path has 154 tiles: 13 "New to Chess", 43 Beginner, 41 Intermediate, 57 Advanced (counted from the page structure).
  - The beginner filter lists 38 courses on its first page, many of them video-led opening and pattern collections with dozens of lessons.

## 6. Better than ours, weaker than ours

Our side is described from `CLAUDE.md`, `app/src/lib/reach.ts` and `docs/competition-chesscom.md`; I did not open our app in this session.

**Where chess.com is better or equal [V for theirs, I for the comparison]:**
1. **Time to the first move.** It takes about 3 taps and under 10 seconds, with an animated hand demonstrating the drag. The first screen is a board, one sentence and one button.
2. **Brevity.** Bubbles run 4 to 29 words, there is one idea per screen, and a piece lesson takes under 1 minute. Our six piece lessons were 37 minutes before this week (`docs/competition-chesscom.md`).
3. **The refutation is played on the board** when a capture or check is wrong, so the punishment is seen rather than told.
4. **Graded refusal:** an illegal move gets silent dots, a legal off-task move gets a one-line reason, and a wrong idea gets an explanation plus a refutation.
5. **No dead ends:** every lesson flows into the next with one arrow. There are no menus and no choices until the course ends.
6. **Coloured explanatory arrows** (capture and recapture), and a scaffold that fades within 3 challenges (path arrows on challenge 2, none on challenge 3).
7. **The 2018 course accepts alternative answers** and asks for the other one, which is a cheap "find all solutions" exercise.
8. **The mobile layout:** full-width board, coach under it, one big button.

**Where chess.com is weaker, and we can beat it [V for theirs]:**
1. **No game at the end.** The rules block ends with a trophy, not a game. The next want is "more lessons", and that leads to a sign-up wall. Our D55/D56 (a guided game within about 10 minutes, a legal game within about an hour) beats this directly.
2. **Positions without kings** (Capturing, Check C1, Checkmate C1 and C2). These are impossible boards. Our validator-checked legal positions are stronger, and the learner never has to unlearn "a board can lack a king".
3. **Imprecise castling rule.** The rules bubble omits "not through an attacked square". The demonstration says the king "would move into check" when in fact it would pass through check (Rd8 covers d1, c1 is safe). This is a claim our validator discipline would catch.
4. **No measure of skill.** Stars carry no par and no rating, extra moves are invisible, and nothing is recorded. Our reach step has a par computed by breadth-first search and a 1 to 3 star rating that never blocks (`app/src/lib/reach.ts`).
5. **Gaps in the rules:** no starting set-up lesson, no stalemate or draws, no notation, and underpromotion is never shown.
6. **Progress is lost without an account; ads run beside the lesson; everything past the rules is behind sign-up.** We are free, with no account and no ads.
7. **No retrieval or spacing.** Each idea is met once, then the trophy. Nothing comes back later.

## 7. Concrete ideas to adopt or beat (numbered)

1. **First screen = board + one sentence (12 words or fewer) + one button; first move within 10 seconds.** Make it a gate in `tools/check_path_time.py` (time to first move), not only total path time.
2. **Add an animated "drag me" hand on the very first reach challenge only,** then drop it.
3. **Fade the scaffold in three steps inside each piece lesson:** 1-move reach; 2-move reach with the path drawn; 2-move reach with nothing drawn. Our par and star rating stays on top.
4. **Cap coach bubbles at about 25 words and one idea.** Add a lint in `tools/validate_lessons.py` that flags longer learner-facing bubbles in Foundation lessons. They have a 29-word bubble that is clipped on desktop.
5. **Play the refutation on wrong answers** (engine or authored reply), then explain in one line. Their "rook takes back" moment is the best teaching beat in the course.
6. **Three-level refusal:** illegal = snap back with dots and silence; legal but off-task = "legal, but this time try …"; wrong idea = refutation plus reason.
7. **Green and red arrows for "my capture / their recapture"** in Capturing and in the contrast lab.
8. **Keep every position legal with both kings** (already our rule). Say so on the About page, because it is a visible quality difference.
9. **Teach castling's real conditions, including passing through an attacked square,** with a validator-checked example. They get this wrong.
10. **End the rules block with a game, not a trophy.** The guided first game is our answer to their "You Mastered the Basics!" modal, and it should come before en passant and castling (D56 order).
11. **Accept alternative solutions and ask for the second one** (their 2018 Queen lesson). Use it where several answers are verified.
12. **One arrow from lesson to lesson, with no menu in between,** for the whole Foundation stage.
13. **Show the piece badge at lesson end and make the next want concrete** ("next: the bishop", "next: your first game"), not "explore more".
14. **Keep progress without an account** (localStorage plus export, Q11 option A). It is one of our clearest wins over a logged-out chess.com visitor.
15. **Teach the starting set-up, stalemate and notation** within the first hour. Their free block omits all three.
16. **Bring rules back later** (spaced checks) instead of meeting them once. Their course never revisits anything.

## 8. Open gaps

- I did not see what the paid or free-account beginner lessons look like inside: Playing the Game, Winning the Game, Opening Principles, Capturing Pieces, Finding Checkmate. A free account would show them, but creating one was out of scope.
- I did not test whether the lesson audio is a voice-over.
- I did not press the second hint level ("?").
- I did not find what the 13th "New to Chess" tile is.
- The one-lesson-a-day limit for free accounts is from the support article [S] and was not re-checked.
- Learner timing is my estimate from screen and challenge counts. A stopwatch run with a real beginner would settle it, but that is feedback work (`(feedback)` tag).
- I played only 3 of the 13 lessons of the 2018 course.

## Addendum 2 (all reachable lessons)

Session of 8 Nov 2026, built-in browser, logged out throughout. No account was created, nothing was typed into a sign-in form, no download was made, no paid flow was opened. No CAPTCHA or bot check appeared. All coach wording below is paraphrased; word counts are of the original bubble, counted by script from my notes. [V] means I saw it in the page; [I] means my own inference.

### A2.1 The 2018 course "Learn To Play Chess", lessons 3 to 13

All 13 lessons open logged out [V]. Each has 5 challenges (65 in total); the course card says 18 minutes. Lessons 1, 2 and 12 were covered in sections 3 to 5; the rest are below. Notation: white pieces unless marked b (black); the move after the arrow is the accepted answer.

**Shared mechanics [V]**

- Every challenge is a card headed "White to Move" with one prompt bubble. After a move the card says the move "is correct", "is incorrect", or (after Show Solution) "is the move".
- **Illegal move:** the piece snaps back and the legal target squares show as dots. No text at all.
- **Legal but wrong move:** a one or two sentence reason, then three buttons (analysis/next, show solution, retry). In 5 of the 65 challenges the opponent also plays the refutation on the board (Promotion 5, En Passant 3 and 5, Castling 3 and 5); in the others nothing moves.
- **Hints, two levels:** the first press rewords the task and highlights the piece to move; the second draws an orange arrow for the full move without playing it. There is no third level.
- **Show Solution** plays the move and shows the success text, so the learner never has to find it.
- **Multi-move challenges:** Black answers automatically (Promotion 3 and 4, En Passant 2, Castling 5). Bishop 4 asks for a two-move route but only checks the first move.
- "Analyze" appears only once a challenge is solved.
- **Lesson end:** a "Sign Up to Save Your Progress" modal (paraphrase: improve faster, get more lessons). Closing it, the next button returns to the /learn hub, not to the next lesson.
- **Sound:** the 2018 course preloads 47 short sound effects (correct, incorrect, coin and so on). I found no voice. Each lesson also has an "Explainer Video" button that plays logged out (for example the bishop video, 65 s, square format, overlaid on the board) [V].
- **Time:** about 1 to 2 minutes per lesson for me; a beginner would take longer [I].

**Prompt length.** Prompts run 3 to 33 words, most 10 to 25. Wrong-move reasons run 11 to 39 words; success texts 22 to 31. The longest single bubble is the castling intro rule card (39 words) and the pawn-race reason (39 words) [V, counted].

**Lesson by lesson**

| Lesson | Challenge: position, answer | Prompt (paraphrased, words) | Wrong-move feedback seen |
|---|---|---|---|
| 3 Rook | 1: Rg1 → Rg8 | reach the far side in one move (24) | Rg5: does not get all the way up (22) |
| | 2: Kh8, Rg8 → Ra8 | visit a corner (27) | hint 1: go as far left as you can (8); hint 2 arrow g8-a8 |
| | 3: Kd5, Ra5, Ra3 → Rh3 | which rook can cross sideways (30) | Ra5-h5 is illegal: snap back, dots |
| | 4: Qh7 Kh4 Ra7 Rh1 → Ra8 | only one rook can reach the top now (23) | Rh3: does not reach the top (20) |
| | 5: Qf2 Rh2 Kg1 Rh1 → Kg2 | the corner rook is boxed in; free it (33) | success: the king steps aside (22) |
| 4 Bishop | 1: Ba1 → Bh8 | cross in one move (22) | Bd4: right direction, keep going (19) |
| | 2: Bf1 → Bg2 | reach the long light diagonal (29) | |
| | 3: Bh7 Bd4 → Be4 | put the second bishop beside the first in the centre (32) | |
| | 4: Rh7 Kd7 Qb7 Bf1 Rg4 → Bc4 | reach the top in two moves (25) | only the first move is checked |
| | 5: same → Bg8 | climb to the top of the diagonal (22) | |
| 5 Knight | 1: Nh6 → Ng8 | reach the top in one move (20) | Nf7: not the top row (17) |
| | 2: Bc4 Kf3 Rb3 Nd2 → Ne4 | knights like the centre (19) | |
| | 3: Nb3 Ne4 → Nd4 | bring the second knight in (17) | |
| | 4: crowded board → Nd4 | find the forward route to the centre (25) | |
| | 5: bQc5 bKg5 bRd6 bRf6, Nf2 → Ne4+ | one square that hits all four black pieces (19) | Nd3: does not reach all four (27) |
| 6 Pawn | 1: e2 → e4 | one or two squares; go to the centre (25) | e3: try two squares (17) |
| | 2: Pe3 Pc2 → c4 | only one pawn may jump two (21) | e3-e5 illegal: snap back |
| | 3: bPf5 bPd5; Ph4 Pf4 Pd4 → h5 | two are blocked; play the only move (20) | |
| | 4: bRf5 bRd5; Pa2 Pe3 → e4 | attack both rooks at once (23) | a4: does not attack them (12) |
| | 5: bishop hemmed in → d5+ | open a diagonal with a pawn (18) | |
| 7 Promotion | 1: Ph7, bKb8 → h8=Q+ | promote to the strongest piece (20) | h8=N: you can pick a stronger piece (19). Picker is a Q/N/R/B column |
| | 2: Ph5 Pa2 vs bPh7 → a4 | which pawn promotes fastest (30) | h6: the black pawn blocks it (25) |
| | 3: pawn race → h7, (a2), h8=Q | win the race (28) | e4: too slow, black queens first (39) |
| | 4: bPe2 vs Kg3 → Kf2, (e1=Q), Kxe1 | guard the promotion square (20) | Kg2: black queens next move (23) |
| | 5: Pc5 Ph6 Kf1 vs bKe8 bPb3 → h7, (Kf7), h8=Q | which pawn queens safely (17) | c6: black queens first (14); black plays b2 |
| 8 En passant | 1: dxe6 | ordinary capture first (13) | |
| | 2: exd5, (e5), dxe6 e.p. | capture the queen (3), then the e.p. setup (31) | |
| | 3: bPc4; Pa2 Pd2 → a4 | which double step avoids e.p. (17) | d4: black takes e.p. on the board (22) |
| | 4: gxf6+ e.p. (discovered attack on the queen) | e.p. that also uncovers an attack (10) | exf6+: a better e.p. exists (17); success (29) |
| | 5: middlegame → hxg6 | "do not take e.p. this time" (14) | exf6: black is fine (11); Nxf4 played |
| 9 Moving and capturing | 1: Qxh3 | find a capture (7) | Qd5: not a capture (17) |
| | 2: Nxd3 | what can White take (4) | |
| | 3: dxe5 | the one pawn that can capture (18) | d4-d5 straight: illegal, dots show the capture |
| | 4: Rxc3 | take the bishop attacking a1 (14) | |
| | 5: Kxg3 | only one capture is good (20) | Qxc6: the queen gets taken by a pawn (18); nothing is played |
| 10 Check | 1: Qe3+ | find the one check (10) | Bb4: not check (15); hint 1 rewords (17); hint 2 arrow g1-e3 |
| | 2: Re1+ | make a check (6) | |
| | 3: g7+ | the only check (13) | Qe5: not check (11); success (28) |
| | 4: Bc3+ | a strong check despite the crowd (16) | |
| | 5: Ne7+ | attack the hidden king with check (16) | success (26) |
| 11 Out of check | 1: Kg1 | escape the check (6) | Kg2 illegal: only g1 dotted |
| | 2: Rxh3 | best answer to the check (17) | Kg1: escapes, but a stronger move exists (14) |
| | 3: Bd2 | block the check (9) | |
| | 4: Qxh4+ | escape the check (6) | Kg2 |
| | 5: Ng6+ | block and give check in one move (24) | Be4: the queen takes and checks again (18); success (31) |
| 13 Castling | intro card: rule including into, out of, or through check (39) | | |
| | 1: O-O (Two Knights position) | castle short (10) | Kf1: the king moves two squares (28) |
| | 2: O-O-O (Dragon position) | find the castling move (9) | O-O illegal (bishop on f1) |
| | 3: c3 against Bb4+ | best block (14) | Qd2: loses the queen (14); Bxd2+ played |
| | 4: O-O-O (black bishop covers f1) | castle this turn (12) | O-O illegal: snap back, dots, no text |
| | 5: g5, (Bg7), O-O-O+ | block the bishop to prepare castling (31) | f4: unprotected pawn (26); Bxf4 played; success (29) |

**Quality notes [I].**
- Lesson 10, challenge 5 (position 6k1/5ppp/8/3N4/8/B7/6K1/3R4, read from the page, checked with python-chess 8 Nov 2026 [V]): the earlier note that Rd8 mates was WRONG. The knight on d5 blocks the rook, so Rd8 is illegal; the only checks are Ne7+ and Nf6+, neither mates. Chess.com's challenge is sound. Correction recorded; no argument against them here.
- Several positions have no white king (Knight 5, Pawn 5). Our rule of legal positions with both kings stays a visible quality edge (section 7, item 8).
- The 2018 Castling course page states the full rule correctly, unlike the newer course (section 4).

### A2.2 "Learn to Play" (newer course) re-tests

| Lesson | Wrong answer | Hint level 1 | Hint level 2 | Other |
|---|---|---|---|---|
| Pawn | e4 when one step was asked: "legal, but practise one square first" | "move the pawn one square" plus highlight | arrow e2-e3 | a third press does nothing; show-solution plays the move with the success text; the star challenge has no hint button; under-promotion to a rook gets "pick a queen" plus retry/solution and an "incorrect" sound |
| Capturing | Qxh5: the rook recaptures within a second, then the reason (own voice clip) | "take the pawn the queen does not guard" (voiced) | arrow d1-a4 | six voiced info bubbles before the first task |
| Check | Bd3: "not check, try again", solution and retry buttons | "move a pawn diagonal to the king" | arrow d6-d7 | show-solution resets the board, then plays the move |
| Castling | Kf1, or Rh1-f1: "that does not castle" | | | dragging the king onto its own rook is accepted as castling |

**Voice-over: yes [V by network evidence; I did not listen].** Every coach bubble, including wrong-answer and hint text, fetches its own mp3 from a "David_coach/en-US" folder, plus a matching viseme file (mouth shapes for the animated coach). Clip lengths match the text (about 1.3 s for a two-word bubble, 4.4 s for 16 words). The level-2 arrow has no audio. The 2018 course has no voice, only sound effects.

The /learn hub now opens with the "Sign Up to Save Your Progress" modal on page load.

### A2.3 The lessons library

**Method [V].** I paged the library's own JSON listing (16 pages of 25), then loaded each course page and its first lesson. A first lesson counts as locked when its page carries the lesson-locked flag on the upgrade modal; I confirmed the flag against the real interface on 3 locked and 2 open courses (locked ones show "Sign up to unlock Lessons!").

**Totals [V].**
- 395 courses.
- 27 have an open first lesson; 368 are locked behind the sign-up modal.
- Fully open: the two rules courses (Learn To Play, 12 lessons; Learn To Play Chess, 13 lessons) and one joke course (Advanced Bongcloud Theory, 11 lessons).
- The other 24 open courses are samples: usually lesson 1 only, sometimes 2 to 7 lessons.

**Open lessons per course (o open, L locked) [V]:**

| Course | Pattern |
|---|---|
| Learn To Play | all 12 open |
| Learn To Play Chess (2018) | all 13 open |
| Advanced Bongcloud Theory | all 11 open |
| Learn Every Chess Opening | 7 of 50 open |
| The Indian School Of Chess | ooooLLLLLLL |
| How I Became A Five Time World Champion (Anand) | oLLLLoLLLL |
| Play Like Gukesh Dommaraju | oLLLo |
| Play Like A World Champion: Kasparov vs Karpov | oLLoo |
| Alexey Troitsky's Studies | oLLoLLL |
| The Top 10 Games Of The 1960s | oLoLLLLLLL |
| How To Win With The Ruy Lopez 5.d4 | oLo |
| Jan's Four Knights, Judit Polgar, Top 10 Games Of The 1950s, Play Like Teimour Radjabov, Play The Italian, Mamedyarov Teaches Dynamic Pawn Play, Pawns vs Pieces, How To Play The King's Indian Attack, King Activity In The Endgame, Learn The Closed Sicilian, Play The Tarrasch Defense | first lesson only |
| The Scotch Mieses Theory And Middlegame, Practice The London System, Exploiting Opening Errors 3, Understanding The Sicilian Dragon, The Benoni And Its Tactics | first lesson only (older Chess Mentor format) |

**Locked beginner material.** Every 2018 Chess.com Team course except Learn To Play Chess is locked: Playing the Game, Opening Principles, Winning the Game, Capturing Pieces, Finding Checkmate, Intro to Book Openings, Winning with Tactics, and the intermediate and advanced 2018 courses. So are Checkmate Patterns You Should Know, Your First Tournament, Mastering the Endgame, Games That Changed Chess History, and the big Chess Mentor beginner sets (Introduction to Tactics, 112 lessons; Basic Checkmates and More, 77; Pawn Endings: Beginner to Expert, 87; Essential Checkmate Patterns, 130; Exclusively Checkmates, 99).

**Previews visible before the wall [V].** A locked course page still shows its lesson titles and a board preview per lesson. Examples (titles are facts; FENs are bare positions):
- Playing the Game: goals of chess, piece values, finding the right move, notation ("language of chess"), playing a game, stalemate, other draws. The stalemate preview is K on g8 against q f6, k h6, white to move (6K1/8/5q1k/8/8/8/8/8 w).
- Winning the Game: four-move mate (the Scholar's mate position after Qh5 and Bc4), assisted mate, two-rook mate, queen mate (7k/8/5K2/6Q1/8/8/8/8 w), rook mate (6k1/R7/6K1/8/8/8/8/8 w).
- Opening Principles, Capturing Pieces, Finding Checkmate, Intro to Book Openings, Winning with Tactics, Checkmate Patterns You Should Know (15 named mates) and Mastering the Endgame show their titles in the same way.
- Read together, the free-account beginner path is: rules, then goals and values, then mates, then captures, then openings, then tactics. Our D56 order (game early, mates soon after) matches its shape [I].

**Open courses I played beyond the rules courses [V].**
- **Play Like Gukesh, lesson 1:** one long "challenge" of 14 White moves replaying a Gukesh vs Ding Liren World Championship game. Each move has a guiding question (the opener is 31 words), hint text and a hint arrow. A wrong move got a refutation on the board. Ends with the sign-up modal.
- **Exploiting Opening Errors 3, lesson 1 (old Chess Mentor format):** 2 challenges. A wrong move got a terse reason and no refutation. The closing comment is about 55 words of dense notation with evaluation symbols, a clear contrast with the beginner course.
- The other 22 open first lessons (mostly master-game and opening video courses) were confirmed open by the lock flag and by Gukesh as a spot check, but not played.

**Page-source note [V].** The page of a locked lesson still ships its full challenge data (moves, wrong-move texts, hints) in the source, hidden by the modal. I did not read, copy or use any of it: that is chess.com's paid material, and the modal makes its terms clear.

**Video [V].** 248 of the 395 courses carry video. The rest (147) are mostly the old Chess Mentor courses and the "Play Like" and studies series, which are text-and-board only and show no challenge or minute stats (148 courses have no stats).

### A2.4 What remains locked, and how to see it lawfully

- **Locked:** all 2018 beginner and intermediate courses except Learn To Play Chess, all of Chess Mentor's large sets, and 368 of 395 courses in total.
- **Cheapest lawful view:** Andrew signs in himself, with his own free account, in the built-in browser pane. A free account reportedly unlocks one lesson a day [S, support article, not re-checked]. With about 10 beginner courses of 5 to 9 lessons each, that is roughly 60 days of one-a-day access. A one-month paid membership would show everything at once. Either is his choice; an agent must not create an account or sign in.
- **Second best, free:** the course pages' titles and preview boards (A2.3) already show the structure of the locked beginner path.

### A2.5 Updated open gaps

- Closed: the voice-over question (yes, by network evidence), the second hint level (an arrow; there is no third), and all 13 lessons of the 2018 course.
- Still open: the inside of the locked beginner courses (needs Andrew's sign-in); whether the free-account limit is still one lesson a day; the 13th "New to Chess" tile; the 22 open sample lessons I did not play; listening to the voice itself.
- Lesson 10, challenge 5: resolved, see the quality note (Rd8 is not legal).

### A2.6 Full course list (395, as listed on 8 Nov 2026)

Columns as shown on the course card or page [V]. Level letters are the card's B, I, A, M badges (I read them as beginner, intermediate, advanced, master). Challenges, minutes and year are blank where the page shows no stats (older Chess Mentor and "Play Like" courses). "Video" means the first lesson's data carries a video link. "Logged out" is the state of the first lesson.

| # | Course | Level | Category | Lessons | Challenges | Min | Year | Video | Instructor | Logged out |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Learn To Play | B | Misc | 12 |  |  |  | N | Chess.com Team | OPEN |
| 2 | Play Like Gukesh Dommaraju | M | Master Games | 5 |  |  |  | N | NM Jeremy Kane | OPEN |
| 3 | Jan's Four Knights | M | Openings | 4 | 20 | 111 | 2024 | Y | GM Jan Gustafsson | OPEN |
| 4 | Gambit Buffet | M | Openings | 16 | 80 | 187 | 2024 | Y | GM Simon Williams | locked |
| 5 | Yusupov On Aronian: Fighting For The Initiative With Black | M | Strategy | 3 | 15 | 166 | 2024 | Y | GM Artur Yusupov | locked |
| 6 | A Personal Look At Mikhail Tal's Games | M | Master Games | 6 | 30 | 160 | 2024 | Y | GM Peter Svidler | locked |
| 7 | Prophylactic Thinking | M | Strategy | 7 | 35 | 236 | 2024 | Y | GM Artur Yusupov | locked |
| 8 | Calculation With Dvoretsky | M | Tactics | 6 | 30 | 231 | 2024 | Y | IM Mark Dvoretsky | locked |
| 9 | Loek's Endgame Strategy | M | Endgames | 8 | 40 | 297 | 2023 | Y | GM Loek van Wely | locked |
| 10 | How A Prodigy Plays Chess | M | Master Games | 8 | 40 | 106 | 2023 | Y | GM Praggnanandhaa Rameshbabu | locked |
| 11 | Strategies For Rapid Chess | M | Strategy | 4 | 20 | 64 | 2023 | Y | GM Liem Le | locked |
| 12 | Artur Yusupov: On Magnus Carlsen | M | Master Games | 5 | 25 | 217 | 2023 | Y | GM Artur Yusupov | locked |
| 13 | The Most Amazing Chess Moves Ever Played | M | Tactics | 7 | 35 | 116 | 2023 | Y | GM Surya Shekhar Ganguly | locked |
| 14 | How To Win With Zugzwang | M | Endgames | 5 | 25 | 59 | 2023 | Y | GM Dejan Bojkov | locked |
| 15 | c3 Sicil For The Kill | M | Openings | 5 | 25 | 60 | 2023 | Y | FM James Canty | locked |
| 16 | Judit Polgar: From Child Star To Super-Grandmaster | M | Master Games | 6 | 30 | 234 | 2023 | Y | GM Judit Polgar | OPEN |
| 17 | The Ultimate Blunder |  | Master Games | 4 | 20 | 35 | 2023 | Y | GM Ben Finegold | locked |
| 18 | Hall of Fame / The 50 Greatest Chess Players of All Time | M | Master Games | 50 | 114 | 623 | 2023 | Y | GM Jan Gustafsson | locked |
| 19 | Magnus Carlsen's Stonewall | M | Openings | 5 | 22 | 75 | 2023 | Y | GM Magnus Carlsen | locked |
| 20 | Hou Yifan: My Career So Far | M | Master Games | 7 | 35 | 109 | 2023 | Y | GM Hou Yifan | locked |
| 21 | Cuban Chess: Dominguez On Capablanca | M | Master Games | 5 | 25 | 78 | 2023 | Y | GM Leinier Dominguez Perez | locked |
| 22 | Learn The Evans Gambit | M | Openings | 3 | 21 | 30 | 2023 | Y | M Chess.com Coach | locked |
| 23 | How To Attack Without Sacrificing | M | Attacking | 4 | 20 | 69 | 2023 | Y | GM Magnus Carlsen | locked |
| 24 | Perfect Chess Games | M | Master Games | 5 |  |  |  | N | NM Jeremy Kane | locked |
| 25 | My Best Loss | M | Master Games | 4 | 20 | 61 | 2023 | Y | M Chess.com Coach | locked |
| 26 | How I Became A Five Time World Champion | M | Master Games | 10 | 50 | 391 | 2023 | Y | GM Viswanathan Anand | OPEN |
| 27 | Refute The Sacrifice | M | Tactics | 16 |  |  |  | N | NM Jeremy Kane | locked |
| 28 | The Ten Most Beautiful Chess Moves | M | Tactics | 11 |  |  |  | N | NM Jeremy Kane | locked |
| 29 | Play Like A Chess Streamer | M | Master Games | 5 |  |  |  | N | NM Jeremy Kane | locked |
| 30 | SCC Tactics | M | Master Games | 15 | 58 | 173 | 2022 | Y | M Chess.com Coach | locked |
| 31 | Chess In The Movies | M | Tactics | 7 |  |  |  | N | NM Jeremy Kane | locked |
| 32 | Play Like Levy Rozman | M | Master Games | 5 |  |  |  | N | NM Jeremy Kane | locked |
| 33 | Play Like A World Champion: The Carlsen Years | M | Master Games | 5 |  |  |  | N | NM Jeremy Kane | locked |
| 34 | Play Like Daniel Naroditsky | M | Master Games | 5 |  |  |  | N | NM Jeremy Kane | locked |
| 35 | Play Like a World Champion: The Anand Years | M | Master Games | 3 |  |  |  | N | NM Jeremy Kane | locked |
| 36 | How To Analyze Your Games |  | Strategy | 5 | 25 | 89 | 2022 | Y | NM Matt Jensen | locked |
| 37 | Learn Every Chess Opening | M | Openings | 50 |  |  |  | Y | M Chess.com Coach | OPEN |
| 38 | Learn The Catalan | M | Openings | 3 | 21 | 21 | 2022 | Y | M Chess.com Coach | locked |
| 39 | Learn The Indian Defenses And The Black Knights' Tango | M | Openings | 3 | 21 | 20 | 2022 | Y | M Chess.com Coach | locked |
| 40 | Learn The Flank Openings | M | Openings | 3 | 21 | 26 | 2022 | Y | M Chess.com Coach | locked |
| 41 | Learn The Old Indian Defense | M | Openings | 3 | 21 | 21 | 2022 | Y | M Chess.com Coach | locked |
| 42 | Learn The Dutch Defense | M | Openings | 3 | 21 | 24 | 2022 | Y | M Chess.com Coach | locked |
| 43 | Learn The King's Indian Attack And The Reti Opening | M | Openings | 3 | 21 | 34 | 2022 | Y | M Chess.com Coach | locked |
| 44 | Learn The Pirc Defense And The Modern Defense | M | Openings | 3 | 21 | 36 | 2022 | Y | M Chess.com Coach | locked |
| 45 | Learn The English Opening | M | Openings | 3 | 21 | 35 | 2022 | Y | M Chess.com Coach | locked |
| 46 | Learn The Alekhine's Defense | M | Openings | 3 | 21 | 33 | 2022 | Y | M Chess.com Coach | locked |
| 47 | Learn The Scandinavian Defense | M | Openings | 3 | 21 | 24 | 2022 | Y | M Chess.com Coach | locked |
| 48 | Learn The Caro-Kann Defense | M | Openings | 3 | 21 | 30 | 2022 | Y | M Chess.com Coach | locked |
| 49 | Learn The French Defense: Tarrasch And Advance Variations | M | Openings | 3 | 21 | 26 | 2022 | Y | M Chess.com Coach | locked |
| 50 | Learn The French Defense With 3.Nc3 | M | Openings | 3 | 21 | 22 | 2022 | Y | M Chess.com Coach | locked |
| 51 | Learn The Center Game And Danish Gambit | M | Openings | 3 | 21 | 18 | 2022 | Y | M Chess.com Coach | locked |
| 52 | Learn The Vienna Game And Bishop's Opening | M | Openings | 3 | 21 | 25 | 2022 | Y | M Chess.com Coach | locked |
| 53 | Learn The Philidor Defense | M | Openings | 3 | 21 | 19 | 2022 | Y | M Chess.com Coach | locked |
| 54 | Learn The King's Gambit | M | Openings | 3 | 21 | 27 | 2022 | Y | M Chess.com Coach | locked |
| 55 | Learn The Four Knights Game | M | Openings | 3 | 21 | 17 | 2022 | Y | M Chess.com Coach | locked |
| 56 | Learn The Two Knights Defense | M | Openings | 3 | 21 | 23 | 2022 | Y | M Chess.com Coach | locked |
| 57 | Learn The Scotch Game | M | Openings | 3 | 21 | 22 | 2022 | Y | M Chess.com Coach | locked |
| 58 | Learn The Italian Game | M | Openings | 3 | 21 | 30 | 2022 | Y | M Chess.com Coach | locked |
| 59 | Learn The Petroff Defense | M | Openings | 3 | 21 | 34 | 2022 | Y | M Chess.com Coach | locked |
| 60 | Learn The Trompowsky And Torre Attack | M | Openings | 3 | 21 | 33 | 2022 | Y | M Chess.com Coach | locked |
| 61 | Learn The Budapest Defense | M | Openings | 3 | 21 | 22 | 2022 | Y | M Chess.com Coach | locked |
| 62 | Learn The Benko Gambit | M | Openings | 3 | 21 | 29 | 2022 | Y | M Chess.com Coach | locked |
| 63 | Learn The Queen's Indian Defense | M | Openings | 3 | 21 | 17 | 2022 | Y | M Chess.com Coach | locked |
| 64 | Learn The Bogo Indian Defense | M | Openings | 3 | 21 | 24 | 2022 | Y | M Chess.com Coach | locked |
| 65 | Learn The Nimzo Indian Defense | M | Openings | 3 | 21 | 20 | 2022 | Y | M Chess.com Coach | locked |
| 66 | Learn The Benoni Defense | M | Openings | 3 | 21 | 24 | 2022 | Y | M Chess.com Coach | locked |
| 67 | Learn The Grunfeld Defense | M | Openings | 3 | 21 | 23 | 2022 | Y | M Chess.com Coach | locked |
| 68 | Learn The Slav Defense | M | Openings | 3 | 21 | 31 | 2022 | Y | M Chess.com Coach | locked |
| 69 | Learn The Queen's Gambit Accepted | M | Openings | 3 | 21 | 19 | 2022 | Y | M Chess.com Coach | locked |
| 70 | Learn The London And Colle Systems |  | Openings | 3 | 21 | 30 | 2022 | Y | M Chess.com Coach | locked |
| 71 | The Top 10 Games Of The 1950s | M | Master Games | 10 | 50 | 144 | 2022 | Y | NM Sam Copeland | OPEN |
| 72 | The Loud Italian | M | Openings | 6 | 30 | 98 | 2022 | Y | GM Alexandra Kosteniuk | locked |
| 73 | The Top 10 Games Of The 1960s | M | Master Games | 10 | 50 | 148 | 2022 | Y | NM Sam Copeland | OPEN |
| 74 | My Legendary Endgames | M | Endgames | 5 | 25 | 66 | 2022 | Y | GM Gata Kamsky | locked |
| 75 | Play Like Richard Rapport | M | Master Games | 5 |  |  |  | N | NM Jeremy Kane | locked |
| 76 | Play Like Jan-Krzysztof Duda | M | Master Games | 5 |  |  |  | N | NM Jeremy Kane | locked |
| 77 | Play Like Teimour Radjabov | M | Master Games | 5 |  |  |  | N | NM Jeremy Kane | OPEN |
| 78 | Learn The Ruy Lopez Closed Variation | IAM | Openings | 3 | 21 | 22 | 2022 | Y | M Chess.com Coach | locked |
| 79 | Learn The Sicilian Rossolimo And Moscow Variations | IAM | Openings | 3 | 21 | 22 | 2022 | Y | M Chess.com Coach | locked |
| 80 | Learn The Queen's Gambit Declined: Bf4 Variation | IAM | Openings | 3 | 21 | 19 | 2022 | Y | M Chess.com Coach | locked |
| 81 | Absolutely Must Know Endgames | M | Endgames | 12 | 60 | 174 | 2022 | Y | GM Alexandra Kosteniuk | locked |
| 82 | How To Defeat A Pawn Weakness | M | Strategy | 5 | 25 | 59 | 2022 | Y | NM Robert Ramirez | locked |
| 83 | The 10 Best Games Of The 1970s | AM | Master Games | 10 | 50 | 163 | 2022 | Y | NM Sam Copeland | locked |
| 84 | Play The Italian | IAM | Openings | 6 | 30 | 84 | 2022 | Y | IM Yuriy Krykun | OPEN |
| 85 | Mamedyarov Teaches Dynamic Pawn Play | M | Openings | 5 | 25 | 78 | 2022 | Y | GM Shakhriyar Mamedyarov | OPEN |
| 86 | Advanced Piece Values | AM | Strategy | 5 | 25 | 73 | 2022 | Y | GM Larry Kaufman | locked |
| 87 | Leonid Kubbel's Studies | M | Tactics | 8 |  |  |  | N | NM Jeremy Kane | locked |
| 88 | Modern Chess Masterpieces | M | Master Games | 6 | 30 | 91 | 2022 | Y | GM Surya Shekhar Ganguly | locked |
| 89 | Pawns vs Pieces | AM | Strategy | 5 | 25 | 38 | 2022 | Y | NM Elijah Logozar | OPEN |
| 90 | Grind Like Magnus Carlsen | AM | Endgames | 6 | 30 | 98 | 2022 | Y | GM Dejan Bojkov | locked |
| 91 | World Championship Preparation | M | Openings | 5 | 25 | 87 | 2022 | Y | GM Romain Edouard | locked |
| 92 | The Top 10 Games Of The 1980s | M | Master Games | 10 | 50 | 146 | 2022 | Y | NM Sam Copeland | locked |
| 93 | The Indian School Of Chess | M | Master Games | 11 | 55 | 168 | 2021 | Y | GM Surya Shekhar Ganguly | OPEN |
| 94 | Every Pawn Structure Explained | M | Strategy | 30 | 150 | 816 | 2021 | Y | GM Johan Hellsten | locked |
| 95 | The Complete History Of Computer Chess | M | Master Games | 15 | 75 | 228 | 2021 | Y | CM James Coleman | locked |
| 96 | World Championship Masterpieces | M | Master Games | 5 | 25 | 61 | 2021 | Y | IM Yuriy Krykun | locked |
| 97 | My Road To The World Championship | M | Master Games | 5 | 25 | 145 | 2021 | Y | GM Fabiano Caruana | locked |
| 98 | Advanced Bongcloud Theory | M | Openings | 11 | 55 | 122 | 2021 | Y | GM Jon Ludvig Hammer | OPEN |
| 99 | How to Be Materialistic In Chess | M | Strategy | 5 | 25 | 77 | 2021 | Y | IM Kostya Kavutskiy | locked |
| 100 | My Games With The World Chess Champions | M | Master Games | 6 | 30 | 86 | 2021 | Y | GM Shakhriyar Mamedyarov | locked |
| 101 | Carlsen vs. Nepomniachtchi: Their Greatest Games Analyzed | M | Master Games | 5 | 25 | 88 | 2021 | Y | GM Surya Shekhar Ganguly | locked |
| 102 | How To Beat A Grandmaster |  | Master Games | 4 | 20 | 63 | 2021 | Y | GM Romain Edouard | locked |
| 103 | Genrikh Kasparyan's Studies | M | Tactics | 6 |  |  |  | N | NM Jeremy Kane | locked |
| 104 | Play Like A World Champion: Kasparov vs Karpov | M | Master Games | 5 |  |  |  | N | NM Jeremy Kane | OPEN |
| 105 | Every Opening Trap To Crush Your Opponent | M | Openings | 16 | 80 | 156 | 2021 | Y | GM Ben Finegold | locked |
| 106 | Every Chess Tactic Explained | M | Tactics | 13 | 65 | 163 | 2021 | Y | WIM Fiona Steil-Antoni | locked |
| 107 | Oleg Pervakov's Studies | M | Tactics | 9 |  |  |  | N | NM Jeremy Kane | locked |
| 108 | Mamedyarov's Opening Surprises | M | Openings | 5 | 25 | 78 | 2021 | Y | GM Shakhriyar Mamedyarov | locked |
| 109 | Every Sacrifice To Destroy Your Opponent | M | Tactics | 24 | 120 | 294 | 2021 | Y | WGM Keti Tsatsalashvili | locked |
| 110 | Mating Nets | M | Attacking | 5 | 25 | 57 | 2021 | Y | WGM Tatev Abrahamyan | locked |
| 111 | Master Endgame Checkmates | M | Endgames | 5 | 25 | 63 | 2021 | Y | M Chess.com Coach | locked |
| 112 | Grandmaster Opening Kitchen | M | Openings | 4 | 20 | 55 | 2021 | Y | GM Romain Edouard | locked |
| 113 | How To Play The Sicilian Kalashnikov | M | Openings | 11 | 55 | 230 | 2021 | Y | GM Fabien Libiszewski | locked |
| 114 | The 10 Best Games Of The 1990s | M | Master Games | 10 | 50 | 183 | 2021 | Y | NM Sam Copeland | locked |
| 115 | How Levon Aronian Became America's Newest Super Grandmaster | M | Master Games | 5 | 25 | 51 | 2021 | Y | GM Melikset Khachiyan | locked |
| 116 | How To Play The King's Indian Attack | M | Openings | 5 | 25 | 51 | 2021 | Y | GM Dejan Bojkov | OPEN |
| 117 | King Activity In The Endgame |  | Endgames | 5 | 25 | 76 | 2021 | Y | GM Romain Edouard | OPEN |
| 118 | Candidate Moves | IAM | Strategy | 5 | 25 | 59 | 2021 | Y | IM Kostya Kavutskiy | locked |
| 119 | Play Like Ian Nepomniachtchi |  | Master Games | 5 |  |  |  | N | NM Jeremy Kane | locked |
| 120 | Play Like A World Champion: Fischer and Karpov | M | Master Games | 3 |  |  |  | N | NM Jeremy Kane | locked |
| 121 | Play Like A World Champion: Petrosian and Spassky | M | Master Games | 3 |  |  |  | N | NM Jeremy Kane | locked |
| 122 | My Best Games – Shakhriyar Mamedyarov | M | Master Games | 5 | 25 | 87 | 2021 | Y | GM Shakhriyar Mamedyarov | locked |
| 123 | Pal Benko's Studies | M | Tactics | 7 |  |  |  | N | NM Jeremy Kane | locked |
| 124 | Every Gambit Refuted |  | Openings | 29 | 145 | 511 | 2021 | Y | GM Eugene Perelshteyn | locked |
| 125 | Positional Masterpieces |  | Strategy | 4 | 20 | 55 | 2021 | Y | GM Romain Edouard | locked |
| 126 | The Top Ten Games Of The 2000s | M | Master Games | 10 | 38 | 179 | 2021 | Y | NM Sam Copeland | locked |
| 127 | Henri Rinck's Studies | M | Tactics | 6 |  |  |  | N | NM Jeremy Kane | locked |
| 128 | Best Of The Best | M | Master Games | 4 | 20 | 53 | 2021 | Y | GM Simon Williams | locked |
| 129 | Master Material Imbalances | M | Strategy | 5 | 25 | 55 | 2021 | Y | WGM Tatev Abrahamyan | locked |
| 130 | PogChamps Tactics | BIAM | Tactics | 4 | 20 | 32 | 2021 | Y | NM Jeremy Kane | locked |
| 131 | The 10 Best Chess Games Of The 2010s | M | Master Games | 10 | 13 | 158 | 2021 | Y | NM Sam Copeland | locked |
| 132 | How To Dominate Your Opponent's Pieces | M | Strategy | 4 | 20 | 50 | 2021 | Y | GM Romain Edouard | locked |
| 133 | Play Like Anish Giri | M | Master Games | 5 |  |  |  | N | NM Jeremy Kane | locked |
| 134 | A Chess Coach's Favorite Problems | M | Strategy | 5 | 25 | 87 | 2020 | Y | GM Surya Shekhar Ganguly | locked |
| 135 | Vasily Smyslov: Master Of Attack | M | Master Games | 5 | 25 | 66 | 2020 | Y | FM Andrey Terekhov | locked |
| 136 | Today's Top Juniors | M | Master Games | 5 | 25 | 63 | 2020 | Y | GM Melikset Khachiyan | locked |
| 137 | Breaking Down Closed Positions | M | Strategy | 4 | 20 | 44 | 2020 | Y | GM Jon Ludvig Hammer | locked |
| 138 | Learn From The Best: Komodo | M | Master Games | 4 | 20 | 48 | 2020 | Y | NM Sam Copeland | locked |
| 139 | Alexey Troitsky's Studies | M | Tactics | 7 |  |  |  | N | NM Jeremy Kane | OPEN |
| 140 | Play Like Beth Harmon | AM | Master Games | 6 |  |  |  | N | NM Jeremy Kane | locked |
| 141 | Play Like A Speed Chess Champion | M | Master Games | 20 |  |  |  | N | NM Jeremy Kane | locked |
| 142 | Richard Reti's Studies | M | Tactics | 5 |  |  |  | N | NM Jeremy Kane | locked |
| 143 | Doubled Pawns: Pros And Cons | M | Strategy | 4 | 20 | 57 | 2020 | Y | GM Fabien Libiszewski | locked |
| 144 | The Latvian School Of Chess | M | Attacking | 5 | 25 | 72 | 2020 | Y | GM Arturs Neiksans | locked |
| 145 | Learn From The Best: Stockfish | M | Master Games | 4 | 20 | 51 | 2020 | Y | NM Sam Copeland | locked |
| 146 | Daniil Dubov's Brilliant Opening Ideas | M | Openings | 4 | 20 | 55 | 2020 | Y | GM Romain Edouard | locked |
| 147 | Name Your Pawns | M | Strategy | 8 | 40 | 147 | 2020 | Y | GM Simon Williams | locked |
| 148 | The Sicilian Nimzowitsch Variation | M | Openings | 4 | 20 | 57 | 2020 | Y | GM Tuan Minh Le | locked |
| 149 | Use Your Pieces Tactically | M | Tactics | 5 | 25 | 54 | 2020 | Y | GM Dejan Bojkov | locked |
| 150 | My Best Game | IAM | Master Games | 20 | 100 | 304 | 2020 | Y | Chess.com Team | locked |
| 151 | How To Avoid Mistakes | M | Strategy | 4 | 20 | 68 | 2020 | Y | GM Romain Edouard | locked |
| 152 | Checkmate Grandmaster! - Winning In The Opening | AM | Master Games | 5 |  |  |  | N | NM Jeremy Kane | locked |
| 153 | How To Swindle Your Opponent | AM | Strategy | 5 | 25 | 69 | 2020 | Y | WGM Nemo Zhou | locked |
| 154 | Learn From The Best: AlphaZero | M | Master Games | 5 | 6 | 84 | 2020 | Y | IM Daniel Rensch | locked |
| 155 | Learn From The Best: Leela Chess Zero | M | Master Games | 5 | 25 | 114 | 2020 | Y | Chess.com Team | locked |
| 156 | Pawn Structures That Win | AM | Strategy | 5 | 25 | 45 | 2020 | Y | GM Aman Hambleton | locked |
| 157 | Play Like Daniil Dubov | M | Master Games | 5 |  |  |  | N | NM Jeremy Kane | locked |
| 158 | Play Like A World Champion: Kramnik And Controversy | M | Master Games | 5 |  |  |  | N | NM Jeremy Kane | locked |
| 159 | Play Like A World Champion: Botvinnik, Smyslov And Tal |  | Master Games | 6 |  |  |  | N | NM Jeremy Kane | locked |
| 160 | Play Like A World Champion: Capablanca, Alekhine and Euwe | M | Master Games | 6 |  |  |  | N | NM Jeremy Kane | locked |
| 161 | Play Like A World Champion: The Lasker Years | M | Master Games | 6 |  |  |  | N | NM Jeremy Kane | locked |
| 162 | Play Like A World Champion: The Steinitz Years | M | Master Games | 4 |  |  |  | N | NM Jeremy Kane | locked |
| 163 | Top Level Trickery | M | Strategy | 5 | 25 | 54 | 2020 | Y | GM Dejan Bojkov | locked |
| 164 | Tatev's Favorite Studies | M | Tactics | 5 | 25 | 61 | 2020 | Y | WGM Tatev Abrahamyan | locked |
| 165 | Online Nations Cup Highlights | M | Master Games | 8 | 37 | 101 | 2020 | Y | NM Jeremy Kane | locked |
| 166 | Play like Max Euwe | M | Master Games | 5 |  |  |  | N | NM Jeremy Kane | locked |
| 167 | Play Like Emanuel Lasker | M | Master Games | 5 |  |  |  | N | NM Jeremy Kane | locked |
| 168 | Learn the Queen's Gambit Exchange Variation | BIAM | Openings | 3 | 21 | 28 | 2020 | Y | M Chess.com Coach | locked |
| 169 | Learn the Queen's Gambit Declined | BIAM | Openings | 3 | 21 | 24 | 2020 | Y | M Chess.com Coach | locked |
| 170 | Learn the Queens Gambit: Cambridge Springs and Orthodox Defense | BIAM | Openings | 3 | 21 | 23 | 2020 | Y | M Chess.com Coach | locked |
| 171 | Top Five Moves: Legends Edition | IAM | Master Games | 11 | 55 | 112 | 2020 | Y | GM Simon Williams | locked |
| 172 | Tips And Tricks Of The London System | M | Openings | 5 | 25 | 45 | 2020 | Y | GM Aman Hambleton | locked |
| 173 | Top Five Moves: Candidates Edition | IAM | Master Games | 8 | 40 | 79 | 2020 | Y | GM Simon Williams | locked |
| 174 | Play Like Alexander Alekhine | M | Master Games | 5 |  |  |  | N | NM Jeremy Kane | locked |
| 175 | Defending Difficult Positions | AM | Strategy | 3 | 15 | 36 | 2020 | Y | NM Jeremy Kane | locked |
| 176 | How to Defend | M | Strategy | 5 | 25 | 51 | 2020 | Y | GM Dejan Bojkov | locked |
| 177 | 2020 - 2021 Candidates Highlights | IAM | Master Games | 14 | 75 | 246 | 2020 | Y | NM Jeremy Kane | locked |
| 178 | Learn the Ruy Lopez: Tricky Systems | BIAM | Openings | 3 | 21 | 19 | 2020 | Y | M Chess.com Coach | locked |
| 179 | Learn the Closed Sicilian | BIAM | Openings | 3 | 21 | 19 | 2020 | Y | M Chess.com Coach | OPEN |
| 180 | How To Win With The Ruy Lopez Exchange Variation | IAM | Openings | 3 | 15 | 27 | 2020 | Y | IM Keaton Kiewra | locked |
| 181 | How To Win With The Ruy Lopez 5.d4 | IAM | Openings | 3 | 15 | 36 | 2020 | Y | IM Keaton Kiewra | OPEN |
| 182 | Learn the Sicilian with 2...e6 | BIAM | Openings | 3 | 21 | 22 | 2020 | Y | M Chess.com Coach | locked |
| 183 | Learn the Sicilian: Alapin Variation | BIAM | Openings | 3 | 21 | 17 | 2020 | Y | M Chess.com Coach | locked |
| 184 | Learn the Sicilian Dragon | BIAM | Openings | 3 | 21 | 13 | 2020 | Y | M Chess.com Coach | locked |
| 185 | Don't Let Them Castle | M | Strategy | 4 | 20 | 44 | 2020 | Y | IM Levy Rozman | locked |
| 186 | Learn the Ruy Lopez Marshall Attack | BIAM | Openings | 3 | 21 | 19 | 2020 | Y | M Chess.com Coach | locked |
| 187 | Learn the Semi-Slav Defense | BIAM | Openings | 3 | 21 | 14 | 2020 | Y | M Chess.com Coach | locked |
| 188 | Play Like Alireza Firouzja | M | Master Games | 5 |  |  |  | N | NM Jeremy Kane | locked |
| 189 | Learn the Ruy Lopez Berlin Defense | BIAM | Openings | 3 | 21 | 19 | 2020 | Y | M Chess.com Coach | locked |
| 190 | Learn the King's Indian Defense | BIAM | Openings | 3 | 21 | 19 | 2020 | Y | M Chess.com Coach | locked |
| 191 | The Best Chess Games of 2019 | M | Master Games | 5 | 25 | 78 | 2020 | Y | IM Daniel Rensch | locked |
| 192 | Learn the Sicilian Sveshnikov | BIAM | Openings | 3 | 21 | 15 | 2019 | Y | M Chess.com Coach | locked |
| 193 | Hammertime Strategy | M | Strategy | 5 | 25 | 63 | 2019 | Y | GM Jon Ludvig Hammer | locked |
| 194 | How to Be Lucky In Chess | IAM | Strategy | 5 | 25 | 69 | 2019 | Y | GM Daniel Naroditsky | locked |
| 195 | Guide to the Alekhine's Defense | AM | Openings | 6 | 30 | 84 | 2019 | Y | NM Sam Copeland | locked |
| 196 | Play Like Danny Rensch | M | Master Games | 5 |  |  |  | Y | NM Jeremy Kane | locked |
| 197 | Learn the Sicilian Najdorf | BIAM | Openings | 3 | 21 | 10 | 2019 | Y | M Chess.com Coach | locked |
| 198 | Play Like Wilhelm Steinitz | M | Master Games | 5 |  |  |  | N | NM Jeremy Kane | locked |
| 199 | The Greatest Games You've Never Seen | M | Master Games | 9 | 45 | 111 | 2019 | Y | WGM Tatev Abrahamyan | locked |
| 200 | When the Amateur Wins | IAM | Master Games | 4 | 20 | 68 | 2019 | Y | GM Simon Williams | locked |
| 201 | Play Like Mikhail Botvinnik | M | Master Games | 5 |  |  |  | N | NM Jeremy Kane | locked |
| 202 | Play Like Vasily Smyslov | M | Master Games | 5 |  |  |  | N | NM Jeremy Kane | locked |
| 203 | Play Like Tigran Petrosian | M | Master Games | 5 |  |  |  | N | NM Jeremy Kane | locked |
| 204 | Play Like Boris Spassky | M | Master Games | 5 |  |  |  | N | NM Jeremy Kane | locked |
| 205 | Play Like Levon Aronian | M | Master Games | 5 |  |  |  | N | NM Jeremy Kane | locked |
| 206 | Play Like Anatoly Karpov | M | Master Games | 5 |  |  |  | N | NM Jeremy Kane | locked |
| 207 | Play Like Ding Liren | M | Master Games | 5 |  |  |  | N | NM Jeremy Kane | locked |
| 208 | Play Like Paul Morphy | M | Master Games | 5 |  |  |  | N | NM Jeremy Kane | locked |
| 209 | Play Like Jose Raul Capablanca | M | Master Games | 5 |  |  |  | N | NM Jeremy Kane | locked |
| 210 | Play Like Vladimir Kramnik | M | Master Games | 5 |  |  |  | N | NM Jeremy Kane | locked |
| 211 | What You Should Always Do | M | Strategy | 12 | 60 | 149 | 2019 | Y | WGM Tatev Abrahamyan | locked |
| 212 | Play the Tarrasch Defense | AM | Openings | 10 | 50 | 116 | 2019 | Y | IM Mateusz Bobula | OPEN |
| 213 | Play the Scotch Game | AM | Openings | 9 | 45 | 107 | 2019 | Y | GM Alex Delchev | locked |
| 214 | Play Like Judit Polgar | M | Master Games | 5 |  |  |  | N | NM Jeremy Kane | locked |
| 215 | Play Like Mikhail Tal | M | Master Games | 5 |  |  |  | N | NM Jeremy Kane | locked |
| 216 | Play Like Garry Kasparov | M | Master Games | 5 |  |  |  | N | NM Jeremy Kane | locked |
| 217 | Play Like Bobby Fischer | M | Master Games | 5 |  |  |  | N | NM Jeremy Kane | locked |
| 218 | The Fighting Dragon | AM | Openings | 10 | 50 | 232 | 2019 | Y | IM Keaton Kiewra | locked |
| 219 | The Carlsbad Pawn Structure | M | Strategy | 6 | 30 | 109 | 2019 | Y | GM Dejan Bojkov | locked |
| 220 | Play Like Maxime Vachier-Lagrave | M | Master Games | 5 |  |  |  | N | NM Jeremy Kane | locked |
| 221 | Play Like Vishy Anand | M | Master Games | 5 |  |  |  | N | NM Jeremy Kane | locked |
| 222 | Play Like Hikaru Nakamura | M | Master Games | 5 |  |  |  | N | NM Jeremy Kane | locked |
| 223 | Play Like Fabiano Caruana | M | Master Games | 5 |  |  |  | N | NM Jeremy Kane | locked |
| 224 | Play Like Magnus Carlsen | M | Master Games | 5 |  |  |  | N | NM Jeremy Kane | locked |
| 225 | How to Play the Philidor Defense | AM | Openings | 10 | 50 | 81 | 2019 | Y | GM Ben Finegold | locked |
| 226 | Pirc Defense for Black | M | Openings | 8 | 40 | 187 | 2019 | Y | GM Mackenzie Molner | locked |
| 227 | Pirc Defense for White | M | Openings | 2 | 10 | 50 | 2019 | Y | GM Roman Dzindzichashvili | locked |
| 228 | Secrets of the English Attack | M | Openings | 5 | 25 | 123 | 2019 | Y | WGM Tatev Abrahamyan | locked |
| 229 | The Complete English Defense | M | Openings | 5 | 25 | 108 | 2019 | Y | GM Simon Williams | locked |
| 230 | The Belgrade Gambit | M | Openings | 2 | 10 | 47 | 2019 | Y | GM Simon Williams | locked |
| 231 | How to Play the Trompowsky Attack | M | Openings | 8 | 40 | 83 | 2019 | Y | IM Keaton Kiewra | locked |
| 232 | Playing with Material Imbalances | M | Master Games | 2 | 10 | 45 | 2019 | Y | GM Ben Finegold | locked |
| 233 | The Complete Queen's Gambit Declined | M | Openings | 10 | 50 | 227 | 2019 | Y | GM Gregory Kaidanov | locked |
| 234 | Spicy Gambits! | IAM | Openings | 6 | 30 | 128 | 2019 | Y | GM Simon Williams | locked |
| 235 | Rook and Knight vs. Rook | M | Endgames | 3 | 15 | 47 | 2019 | Y | GM Ivan Sokolov | locked |
| 236 | Old School Cool | M | Master Games | 5 | 25 | 73 | 2019 | Y | GM Simon Williams | locked |
| 237 | The Complete Caro | M | Openings | 9 | 45 | 192 | 2019 | Y | GM Sam Shankland | locked |
| 238 | Tactical Ideas in the Endgame | AM | Tactics | 5 | 25 | 78 | 2019 | Y | GM Simon Williams | locked |
| 239 | Winning With Opposite Colored Bishops | AM | Endgames | 3 | 15 | 50 | 2019 | Y | GM Ben Finegold | locked |
| 240 | Why Simon Loves the Sicilian Dragandorf | AM | Openings | 7 | 35 | 153 | 2019 | Y | GM Simon Williams | locked |
| 241 | Mikhail Tal's Brilliancies | M | Attacking | 3 | 15 | 70 | 2019 | Y | FM Alisa Melekhina | locked |
| 242 | How to Develop the Initiative | M | Master Games | 3 | 15 | 78 | 2019 | Y | GM Victor Mikhalevski | locked |
| 243 | Think Like a Master | M | Master Games | 4 | 20 | 74 | 2019 | Y | IM Keaton Kiewra | locked |
| 244 | Secrets of the Carlsbad | M | Strategy | 3 | 15 | 47 | 2019 | Y | GM Melikset Khachiyan | locked |
| 245 | Improve Your Puzzle Rush | IAM | Tactics | 7 | 35 | 79 | 2019 | Y | GM Simon Williams | locked |
| 246 | Why Simon Loves the French Defense | AM | Openings | 9 | 45 | 188 | 2019 | Y | GM Simon Williams | locked |
| 247 | Key Ruy Lopez Lessons | M | Openings | 2 | 10 | 38 | 2019 | Y | GM Dejan Bojkov | locked |
| 248 | Mikhail Tal's Best Endgames | M | Endgames | 3 | 15 | 54 | 2019 | Y | GM Alex Yermolinsky | locked |
| 249 | Learning From Our Mistakes | IAM | Strategy | 5 | 25 | 46 | 2019 | Y | GM Max Illingworth | locked |
| 250 | Spicy Openings: The Max Lange Attack | M | Openings | 3 | 15 | 45 | 2019 | Y | GM Simon Williams | locked |
| 251 | Restrict and Win | M | Strategy | 6 | 30 | 96 | 2019 | Y | GM Melikset Khachiyan | locked |
| 252 | Positional Sacrifices | M | Master Games | 3 | 15 | 56 | 2019 | Y | GM Victor Mikhalevski | locked |
| 253 | Play in the Center | M | Strategy | 4 | 20 | 71 | 2019 | Y | GM Dejan Bojkov | locked |
| 254 | Using Time in Chess | M | Attacking | 4 | 20 | 91 | 2019 | Y | GM Simon Williams | locked |
| 255 | Storming the Castle | M | Attacking | 3 | 15 | 60 | 2019 | Y | IM Keaton Kiewra | locked |
| 256 | Beating the Anti-Sicilians | AM | Openings | 3 | 15 | 41 | 2019 | Y | GM Ben Finegold | locked |
| 257 | Using the Initiative | M | Attacking | 3 | 15 | 60 | 2019 | Y | GM Mackenzie Molner | locked |
| 258 | Attacking King Hunts | M | Attacking | 5 | 25 | 97 | 2019 | Y | GM Simon Williams | locked |
| 259 | Bishop Battles | M | Master Games | 5 | 25 | 106 | 2019 | Y | GM Jon Ludvig Hammer | locked |
| 260 | The Scotch Mieses Theory and Middlegame | M | Openings | 8 |  |  |  | N | IM Daniel Rensch | OPEN |
| 261 | Deep Concepts Explained | M | Strategy | 2 | 10 | 24 | 2019 | Y | GM Jon Ludvig Hammer | locked |
| 262 | Practice the London System | IAM | Openings | 16 |  |  |  | N | Chess.com Team | OPEN |
| 263 | The Classical Dutch | M | Openings | 5 | 25 | 95 | 2019 | Y | GM Simon Williams | locked |
| 264 | Kasparov's Greatest Combinations | M | Attacking | 3 | 15 | 64 | 2019 | Y | GM Dejan Bojkov | locked |
| 265 | Attacking Pawn Chains | IAM | Attacking | 4 | 20 | 75 | 2019 | Y | GM Eugene Perelshteyn | locked |
| 266 | Expect the Unexpected | M | Master Games | 3 | 15 | 47 | 2019 | Y | GM Melikset Khachiyan | locked |
| 267 | Crush with the King's Gambit | M | Openings | 5 | 25 | 100 | 2019 | Y | GM Simon Williams | locked |
| 268 | Winning with the Chigorin Defense | M | Openings | 3 | 15 | 51 | 2019 | Y | GM Ben Finegold | locked |
| 269 | How to Make a Comeback | M | Master Games | 3 | 15 | 49 | 2019 | Y | FM Mike Klein | locked |
| 270 | Combinations of Mikhail Tal Part 3 | AM | Tactics | 10 |  |  |  | N | Chess.com Team | locked |
| 271 | Combinations of Mikhail Tal Part 2 | AM | Tactics | 9 |  |  |  | N | Chess.com Team | locked |
| 272 | Tactics from the Old Masters | AM | Tactics | 88 |  |  |  | N | Chess.com Team | locked |
| 273 | Attack with the Catalan! | M | Openings | 10 | 50 | 172 | 2019 | Y | GM Georg Meier | locked |
| 274 | Play the Budapest Gambit! | M | Openings | 3 | 15 | 46 | 2019 | Y | GM Simon Williams | locked |
| 275 | When Computers Go Wrong | IAM | Strategy | 5 | 25 | 68 | 2019 | Y | GM Simon Williams | locked |
| 276 | London System for the Busy Chess Player | AM | Openings | 7 | 35 | 125 | 2019 | Y | GM Simon Williams | locked |
| 277 | Sacrifice on h6 | M | Attacking | 5 | 25 | 90 | 2019 | Y | GM Simon Williams | locked |
| 278 | Super GM Rook Endings | M | Endgames | 3 | 15 | 59 | 2019 | Y | GM Alex Yermolinsky | locked |
| 279 | The Most Amazing Chess Moves | AM | Master Games | 5 | 25 | 54 | 2019 | Y | GM Simon Williams | locked |
| 280 | Nakamura's King's Indian Defense | M | Openings | 5 | 25 | 77 | 2019 | Y | GM Simon Williams | locked |
| 281 | Essential Attacking Plans | AM | Attacking | 5 | 25 | 89 | 2019 | Y | GM Dejan Bojkov | locked |
| 282 | Knights vs Bishops | M | Strategy | 5 | 25 | 90 | 2019 | Y | GM Dejan Bojkov | locked |
| 283 | Your First Tournament | BIAM | Strategy | 4 | 20 | 37 | 2019 | Y | GM Ben Finegold | locked |
| 284 | Get Better at Bullet | IAM | Strategy | 5 | 25 | 48 | 2019 | Y | GM Aman Hambleton | locked |
| 285 | Spicy Openings: The Evans Gambit | M | Openings | 5 | 25 | 86 | 2019 | Y | GM Simon Williams | locked |
| 286 | Chess Psychology | M | Strategy | 5 | 25 | 75 | 2019 | Y | IM Lawrence Trent | locked |
| 287 | How To Sacrifice Your Queen | M | Attacking | 6 | 30 | 102 | 2019 | Y | FM Mike Klein | locked |
| 288 | The Funniest Chess Games of All Time | IAM | Master Games | 6 | 30 | 49 | 2019 | Y | IM Kostya Kavutskiy | locked |
| 289 | Hikaru Plays to Win | M | Master Games | 6 | 29 | 139 | 2019 | Y | GM Hikaru Nakamura | locked |
| 290 | Mastering the Endgame | BIAM | Endgames | 5 | 25 | 70 | 2019 | Y | IM Anna Rudolf | locked |
| 291 | Immortal Games | M | Master Games | 5 | 25 | 53 | 2019 | Y | GM Simon Williams | locked |
| 292 | Games That Changed Chess History | BIAM | Master Games | 10 | 50 | 150 | 2019 | Y | IM Anna Rudolf | locked |
| 293 | Checkmate Patterns You Should Know | BIAM | Tactics | 15 | 75 | 123 | 2019 | Y | GM Simon Williams | locked |
| 294 | Make the Most of Your Pieces | I |  | 7 | 35 | 18 | 2018 | Y | Chess.com Team | locked |
| 295 | Forcing Moves | I |  | 5 | 25 | 18 | 2018 | Y | Chess.com Team | locked |
| 296 | Intro to Book Openings | B |  | 5 | 25 | 21 | 2018 | Y | Chess.com Team | locked |
| 297 | Activating Your Pieces | A |  | 10 | 53 | 66 | 2018 | Y | Chess.com Team | locked |
| 298 | Opening Principles | B |  | 5 | 26 | 26 | 2018 | Y | Chess.com Team | locked |
| 299 | Advanced Endgames | A |  | 5 | 25 | 38 | 2018 | Y | Chess.com Team | locked |
| 300 | Key Openings | A |  | 8 | 43 | 50 | 2018 | Y | Chess.com Team | locked |
| 301 | Finding Checkmate | B |  | 6 | 30 | 20 | 2018 | Y | Chess.com Team | locked |
| 302 | Attacking the King | A |  | 7 | 35 | 53 | 2018 | Y | Chess.com Team | locked |
| 303 | Choosing the Best Move | A |  | 8 | 40 | 65 | 2018 | Y | Chess.com Team | locked |
| 304 | Winning the Game | B |  | 5 | 25 | 16 | 2018 | Y | Chess.com Team | locked |
| 305 | Reading the Board | I |  | 7 | 38 | 40 | 2018 | Y | Chess.com Team | locked |
| 306 | Winning with Tactics | BI |  | 10 | 50 | 29 | 2018 | Y | Chess.com Team | locked |
| 307 | Capturing Pieces | B |  | 9 | 45 | 34 | 2018 | Y | Chess.com Team | locked |
| 308 | Playing the Game | B |  | 7 | 35 | 43 | 2018 | N | Chess.com Team | locked |
| 309 | Understanding Endgames | I |  | 7 | 35 | 21 | 2018 | Y | Chess.com Team | locked |
| 310 | Learn To Play Chess | B |  | 13 | 65 | 18 | 2018 | Y | Chess.com Team | OPEN |
| 311 | Endgame Patterns | A |  | 7 | 35 | 41 | 2018 | Y | Chess.com Team | locked |
| 312 | Opposite-Colored Bishops | AM | Endgames | 10 |  |  |  | N | GM Dejan Bojkov | locked |
| 313 | Advanced Tactics | IAM | Tactics | 2 | 10 | 34 | 2014 | Y | GM Ben Finegold | locked |
| 314 | Sensing the Danger - Examples from My Games | M | Master Games | 8 |  |  |  | N | GM Aleksandr Lenderman | locked |
| 315 | Master Endgames | AM | Endgames | 8 |  |  |  | N | Chess.com Team | locked |
| 316 | En Prise Please! | M | Tactics | 10 |  |  |  | N | Chess.com Team | locked |
| 317 | Master Attack and Defense | AM | Attacking | 9 |  |  |  | N | Chess.com Team | locked |
| 318 | Master Tactics | M | Tactics | 9 |  |  |  | N | Chess.com Team | locked |
| 319 | Master Strategy | AM | Strategy | 9 |  |  |  | N | Chess.com Team | locked |
| 320 | Capablanca's Endgame Masterpieces | AM | Endgames | 10 |  |  |  | N | GM Dejan Bojkov | locked |
| 321 | The Technique of Calculation | AM | Tactics | 10 |  |  |  | N | Chess.com Team | locked |
| 322 | The Drawing Zone, Part 2 | IAM | Endgames | 18 |  |  |  | N | Chess.com Team | locked |
| 323 | Same Side Pawn Storms | AM | Attacking | 20 |  |  |  | N | Chess.com Team | locked |
| 324 | The Drawing Zone, Part 1 | IAM | Endgames | 18 |  |  |  | N | Chess.com Team | locked |
| 325 | Exploiting Opening Errors 2 | BIAM | Openings | 19 |  |  |  | N | Chess.com Team | locked |
| 326 | Weak Color Complexes Explained | AM | Strategy | 22 |  |  |  | N | IM David Pruess | locked |
| 327 | Advanced Tactics | A |  | 5 | 24 | 23 | 2011 | Y | Chess.com Team | locked |
| 328 | Premature Attacks on the King | AM | Attacking | 15 |  |  |  | N | Chess.com Team | locked |
| 329 | Exploiting Opening Errors 3 | BIAM | Openings | 9 |  |  |  | N | Chess.com Team | OPEN |
| 330 | Exploiting Typical Opening Errors | BIAM | Openings | 20 |  |  |  | N | Chess.com Team | locked |
| 331 | Clever Escapes from Common Mating Attacks | AM | Tactics | 15 |  |  |  | N | Chess.com Team | locked |
| 332 | Pawn Play in the Endgame | AM | Endgames | 20 |  |  |  | N | Chess.com Team | locked |
| 333 | Pawn Play | AM | Strategy | 18 |  |  |  | N | Chess.com Team | locked |
| 334 | Finding Tricky Tactics | M | Tactics | 15 |  |  |  | N | Chess.com Team | locked |
| 335 | Play Against Capablanca | M | Master Games | 22 |  |  |  | N | IM Igor Khmelnitsky | locked |
| 336 | Slaying the Sicilian: Kingside Storms | M | Openings | 12 |  |  |  | N | Chess.com Team | locked |
| 337 | The Essence of the Initiative | M | Attacking | 20 |  |  |  | N | Chess.com Team | locked |
| 338 | Complete Scotch #1:The Mieses Endgames | M | Endgames | 10 |  |  |  | N | IM Daniel Rensch | locked |
| 339 | Improve your Chess | M | Strategy | 19 |  |  |  | N | GM Sam Shankland | locked |
| 340 | Play Against Lasker | M | Misc | 19 |  |  |  | N | Chess.com Team | locked |
| 341 | Combinations of Mikhail Tal | AM | Tactics | 24 |  |  |  | N | Chess.com Team | locked |
| 342 | The Power of the Capture-Check | M | Tactics | 21 |  |  |  | N | Chess.com Team | locked |
| 343 | Understanding the Sicilian Dragon | IAM | Openings | 15 |  |  |  | N | Chess.com Team | OPEN |
| 344 | Defeating "Pet Openings" | BIAM | Openings | 16 |  |  |  | N | Chess.com Team | locked |
| 345 | Now What? | M | Openings | 20 |  |  |  | N | IM Jeremy Silman | locked |
| 346 | Strategic Errors | IAM | Strategy | 20 |  |  |  | N | IM Jeremy Silman | locked |
| 347 | Chess Traps and Miniatures Part 2- Checkmates | IAM | Attacking | 20 |  |  |  | N | Chess.com Team | locked |
| 348 | Do or Die with Rook Endings | IAM | Endgames | 20 |  |  |  | N | Chess.com Team | locked |
| 349 | Champion Tactics with GM Wolff - Back Rank | IAM | Tactics | 35 |  |  |  | N | Chess.com Team | locked |
| 350 | Champion Tactics with GM Wolff - Clearance Sacrifice | IAM | Tactics | 24 |  |  |  | N | Chess.com Team | locked |
| 351 | Champion Tactics with GM Wolff - Deflecting the Defender | IAM | Tactics | 42 |  |  |  | N | Chess.com Team | locked |
| 352 | Champion Tactics with GM Wolff - Discovered Check & Double Check | IAM | Tactics | 33 |  |  |  | N | Chess.com Team | locked |
| 353 | Champion Tactics with GM Wolff - Double Attacks | IAM | Tactics | 29 |  |  |  | N | Chess.com Team | locked |
| 354 | Champion Tactics with GM Wolff - Forks | IAM | Tactics | 37 |  |  |  | N | Chess.com Team | locked |
| 355 | Champion Tactics with GM Wolff - In Between Moves | IAM | Tactics | 13 |  |  |  | N | Chess.com Team | locked |
| 356 | Champion Tactics with GM Wolff - Interference | IAM | Tactics | 21 |  |  |  | N | Chess.com Team | locked |
| 357 | Champion Tactics with GM Wolff - Misplaced Pieces | IAM | Tactics | 15 |  |  |  | N | Chess.com Team | locked |
| 358 | Champion Tactics with GM Wolff - Pins and Skewers | IAM | Tactics | 52 |  |  |  | N | Chess.com Team | locked |
| 359 | Champion Tactics with GM Wolff - Smother Tactics | IAM | Tactics | 16 |  |  |  | N | Chess.com Team | locked |
| 360 | Play Against Bobby Fischer | M | Strategy | 25 |  |  |  | N | Chess.com Team | locked |
| 361 | Understanding the Colle-Zukertort | IAM | Openings | 25 |  |  |  | N | Chess.com Team | locked |
| 362 | Combinations of Alexander Alekhine | M | Tactics | 19 |  |  |  | N | Chess.com Team | locked |
| 363 | Shockers! | M | Tactics | 20 |  |  |  | N | Chess.com Team | locked |
| 364 | Improve Your Decision Making in Critical Positions | M | Misc | 25 |  |  |  | N | Chess.com Team | locked |
| 365 | Recognizing the Opponent's Moves | AM | Strategy | 26 |  |  |  | N | Chess.com Team | locked |
| 366 | Mental Domination | M | Strategy | 20 |  |  |  | N | IM Jeremy Silman | locked |
| 367 | The Art of Exchanging Pieces | M | Strategy | 25 |  |  |  | N | Chess.com Team | locked |
| 368 | Bishop versus Knight (Part 1) | M | Endgames | 13 |  |  |  | N | GM Dejan Bojkov | locked |
| 369 | IBM Deep Blue vs. Kasparov | M | Master Games | 24 |  |  |  | N | Chess.com Team | locked |
| 370 | Chess Traps and Miniatures Part 1 - Quick Knockouts | IAM | Tactics | 20 |  |  |  | N | Chess.com Team | locked |
| 371 | A Kaleidoscope of Openings | BIAM | Openings | 90 |  |  |  | N | Chess.com Team | locked |
| 372 | Build Your Technique | M | Misc | 116 |  |  |  | N | FM Thomas Wolski | locked |
| 373 | Pawn Endings: Beginner to Expert | BIAM | Endgames | 87 |  |  |  | N | Chess.com Team | locked |
| 374 | Basic Checkmates and More | BIAM | Misc | 77 |  |  |  | N | Chess.com Team | locked |
| 375 | Rook and Other Endgames | IAM | Endgames | 39 |  |  |  | N | IM Jeremy Silman | locked |
| 376 | Endings, Openings, a Taste of the Middle | IAM | Misc | 84 |  |  |  | N | Chess.com Team | locked |
| 377 | Chess Potpourri | AM | Misc | 102 |  |  |  | N | Chess.com Team | locked |
| 378 | Introduction to Tactics | BIAM | Tactics | 112 |  |  |  | N | Chess.com Team | locked |
| 379 | Knight versus Bishop (Part 2) | M | Endgames | 14 |  |  |  | N | GM Dejan Bojkov | locked |
| 380 | Critical Challenges | M | Misc | 12 |  |  |  | N | Chess.com Team | locked |
| 381 | Silman's Lessons in Strategy (2) | M | Strategy | 51 |  |  |  | N | IM Jeremy Silman | locked |
| 382 | Silman Teaches Tactics (1) | AM | Tactics | 103 |  |  |  | N | IM Jeremy Silman | locked |
| 383 | Roots of Positional Understanding | IAM | Strategy | 286 |  |  |  | N | IM Jeremy Silman | locked |
| 384 | Silman's Lessons in Strategy (1) | M | Strategy | 53 |  |  |  | N | IM Jeremy Silman | locked |
| 385 | World Champions at their Best (1) | M | Master Games | 43 |  |  |  | N | IM Jeremy Silman | locked |
| 386 | World Champions (2): The Lasker Years | M | Master Games | 26 |  |  |  | N | IM Jeremy Silman | locked |
| 387 | The Benoni and its Tactics | M | Openings | 18 |  |  |  | N | Chess.com Team | OPEN |
| 388 | Intermediate Tactics | IAM | Tactics | 76 |  |  |  | N | Chess.com Team | locked |
| 389 | Knight Endgames (Pt 2) - Both Sides Have Knights | IAM | Endgames | 10 |  |  |  | N | GM Dejan Bojkov | locked |
| 390 | Bent the Great | M | Master Games | 9 |  |  |  | N | GM Dejan Bojkov | locked |
| 391 | Essential Checkmate Patterns | BIAM | Attacking | 130 |  |  |  | N | FM Thomas Wolski | locked |
| 392 | Exclusively Checkmates | BIAM | Attacking | 99 |  |  |  | N | Chess.com Team | locked |
| 393 | Master Your Technique | M | Strategy | 52 |  |  |  | N | FM Thomas Wolski | locked |
| 394 | Knight Endgames (Part 1) | IAM | Endgames | 18 |  |  |  | N | GM Dejan Bojkov | locked |
| 395 | Step Up in Tactics | IAM | Tactics | 63 |  |  |  | N | Chess.com Team | locked |

## Addendum 3: logged-in free account (8 Nov 2026)

Account: Andrew's free account. After he pressed "I Agree" on a policy-update modal (which blocked play until accepted), I played one lesson. A daily limit then stopped me. I did not click the "Try for $0.00" trial button, and did not look for workarounds.

### A3.1 The free limit [V]
- **After one lesson the next lesson is refused.** Pressing Start on Opening Principles lesson 3 ("Protect Your King") opened a modal headed "Daily limit reached", "Get Unlimited Lessons!", with a line that frequent users improve 2.9x faster and a "Try for $0.00" button (a free trial). The lesson page itself loads and shows its first position and one-line bubble; Start is what is gated.
- **Count today: 1 lesson.** "Develop Your Pieces" (lesson 2 of Opening Principles) opened and played in full. Lesson 1 ("Control the Center") already showed a green tick when I arrived [I: done earlier on the account], so I cannot say whether it counted today; the policy modal prevented it being replayed. Whether the 27 free-first-lesson courses or the Learn To Play path count against the same allowance was not tested (the daily limit was hit before I reached them) [not opened].
- **Limit is per lesson, not per course [V for this case].** The path lesson "The King" (Learn To Play) opened on /lessons with no gate shown before the limit, but I did not press Start on it afterwards.
- **Cost of a course [I]:** one lesson a day means Opening Principles (5 lessons) takes 5 days; the beginner courses in A2.6 (Intro to Book Openings 5, Opening Principles 5, Finding Checkmate 6, Winning the Game 5, Winning with Tactics 10, Capturing Pieces 9, Playing the Game 7) total about 47 lessons, so about 47 days at one lesson a day for the whole beginner set.
- **Course page after the limit [V]:** Protect Your King also showed a green tick on the course page, which looks like a visual marker of lesson state not necessarily "completed"; ambiguous [I].

### A3.2 Lesson played: Opening Principles 2, "Develop Your Pieces" [V]
5 challenges, listed as 7 minutes; actual play with probing about 12 minutes of wall time, a real player would need nearer 3 to 5. Intro screen: board, one short bubble (about 15 words, "take control of the game by developing your pieces rapidly to squares where they control the center"), Start and Explainer Video buttons. A replay-intro button sits left of the hint bulb; pressing it replays the intro, not the challenge. Hint 1 highlights the piece; hint 2 changes the bulb to "?", adds a 26-word text hint and an arrow that gives the move away (no third level). A correct move shows a green tick and a "next" arrow. A wrong move shows a red cross and the retry button, and in 3 of 3 tests the bubble gave the move name and "incorrect".
Voice-over was not checked this time [not opened]. Progress is saved: the lesson-complete screen ended with a "1 day streak" toast and a tick on the course page.

| # | Position (squares) | Prompt (words) | Accepted | Wrong answer test and feedback |
|---|---|---|---|---|
| 1 | After 1.e4 e5, White to move | "White decides to move the knight on g1. What is the best square?" (13) | Nf3 | Nh3: "h3 is incorrect" plus 24-word line: there are several good moves but we want the best square for this knight; no refutation. Praise on right: "most popular move by top players" |
| 2 | After 1.e4 e5 2.Nf3, Black to move (board flipped) | "How can Black develop a knight to defend the e5-pawn?" (10) | Nc6 | Nf6: bare "incorrect", no explanation, no refutation. Correct Nc6: bare "correct" |
| 3 | After 3.Bc4 (Italian set-up), Black | "How should Black develop a bishop toward the center?" (9) | Bc5 | not tested |
| 4 | White has Ng5, Bc4, Nc3, d3, e4 against ...Nh5 set-up (FEN r2qkb1r/pppb1p1p/2np2p1/4p1Nn/2B1P3/2NP4/PPP2PPP/R1BQR1K1 w kq, read from the screen, engine-checked) | "White enjoys a huge lead in development. How can we combine our pieces to first check, then checkmate?" (26) | Bxf7+ (only checking move), then the board plays ...Ke7 and the learner plays Nd5# (verified mate with python-chess) | not tested; a one-move-ahead script |
| 5 | After a Qh5/Bc4 attack on f7, Black | "Kick my bishop while also blocking my checkmate threat." (9) | d5 (then White retreats the bishop, then the learner plays Nf6 attacking the queen) | Nf6 first: "incorrect" plus a 40-word hint toward a pawn move that attacks the bishop and blocks its diagonal. This is accurate: after ...Nf6 White plays Qxf7#, because Bc4 and Qh5 both attack f7 and only the king defends it. No refutation played. |

Quality notes: (a) a multi-move challenge (5) and a forced mating line (4) appear in a lesson called "develop your pieces", so the lesson ends on tactics, not on development; (b) "kick my bishop" in 5 is chess.com's coach speaking as White; (c) challenge 1's pre-highlighted blue f3 square is shown before the learner answers, a visible pre-hint [V: seen on screen at start].
Ending: "Lesson Complete!" modal (a graduation-cap icon, one Finish button), a "1 day streak" toast, then the Learn path with "Next" tile and a green "Next Lesson" button. No game, no sign-up nudge (already signed in), no review of earlier lessons.
Next-want created: "Next Lesson" button, the one-arrow flow again; but pressing it for a second lesson in the course hit the daily limit modal, so the want turns into a paywall.

### A3.3 Learn path for a logged-in user [V, limited]
The /learn page shows the current course ("Learn To Play" in this account), a green "Next Lesson" button, a "Next" marker on the following tile, and "Next section: Beginner" headings through Intermediate and Advanced. A coach bubble gives the next skill ("Learn how to move the king"). I found no daily goal, XP, placement or skill quiz result in the page text or by searching for "streak" on /learn; the streak appeared only as a toast after the lesson. Not opened: profile or lesson-stats pages, the full path scrolled to the end [not opened].

### A3.4 What remains locked [V/I]
Everything beyond the first lesson each day is locked, so no other beginner course was played. Unplayed today: Opening Principles lessons 3 to 5; Finding Checkmate, Winning the Game, Winning with Tactics, Capturing Pieces, Playing the Game, Intro to Book Openings; the 27 open first lessons; Learn To Play path lessons after The King. A free trial (offered at "Try for $0.00") would lift the limit; that is Andrew's decision, not an agent's.
