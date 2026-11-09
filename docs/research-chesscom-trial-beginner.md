# chess.com free trial: beginner courses (8 Nov 2026)

Method: Andrew's own free trial in the built-in browser, my own tab, only what the learner interface shows. No daily-limit modal appeared during the trial [V]: lessons 3 onward of Opening Principles started and played without a gate. Evidence labels: [V] seen on screen, [I] inference. Coordinates: viewport 800x652, so a lesson page is a board plus a 160 px side column; each challenge takes about 5 tool calls, so only a few lessons fit in the time.

Interface facts seen in every lesson [V]: one-line intro bubble plus "Start" and "Explainer Video" buttons on the lesson page; challenge screen has the coach bubble (text types in, begins with a side-to-move tag, e.g. "White to Move"), "Challenge n/N" bar, a play/replay-intro button, a hint bulb; after a right move a green tick on the square, a bubble starting "X is correct" plus one or two sentences of praise or reason, then a green next arrow; a first achievement toast ("Puzzle Newbie, you solved a Puzzle") appeared after the first correct answer. Wrong move: red cross on the square, bubble "e2 is incorrect" (move name only, no reason in the Ke2 test), buttons for retry and show solution; no refutation played in the test. Board flips automatically when Black is to move. Multi-move challenges exist: the opponent's reply is played for you and you then play the next move.

## Opening Principles, lesson 3 "Protect Your King" [V]

Course page: 5 lessons, 26 challenges, "26 Minutes", released 12/27/2018; lesson list with listed minutes and challenge counts: Control the Center 5 min / 5, Develop Your Pieces 7 / 5, Protect Your King 5 / 5, Active Pieces 7 / 5, Phases of the Game 2 / 6 (a video lesson). Course page tags: Fundamentals, Beginner, Development, Pawn Structure, Activity, Space, Opening for White, Opening for Black. Format: interactive board with coach bubbles; the intro is an Italian-Game-like position (White Bc4 Nf3, Black Nc6 Bc5, Ng8 undeveloped) with the one-line bubble "Usually ..." (the opening sentence is that castling is usually the best way to secure the king, per the course page).

| # | Position | Prompt (words) | Accepted | Feedback and hints |
|---|---|---|---|---|
| 1 | Italian set-up, White to move, FEN r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq | "There are several good moves in this position, but what is the best king move for White?" (18) | O-O | Ke2 gave "e2 is incorrect", no reason. Right answer: bubble about 25 words: king safe behind three pawns, rook on f1 supports the centre. No hint tested. |
| 2 | Same game, Black to move (board flipped), after castling | "How can you develop a knight toward the center and threaten White's e4-pawn at the same time?" (17) | Nf6, then the opponent plays d3 and the bubble says now move the king to safety; learner castles O-O | Hint 1: 28 words, names the g8 knight and says it attacks the pawn "so we can castle on the next turn" (the hint tells the plan); hint 2 shows an arrow g8-f6 and the bulb becomes "?" (no third level). Two-step challenge: development then castle. Correct text for O-O: about 17 words, "helps bring a rook toward the center". |
| 3 | White Ra1 Qd1 Ne1 Rf1 Kg1 Ba3, pawns a2 c2 c3 d4 f2 g2 h2; Black Ke8 Ra8 Rh8 Qd8 Bc6 Nh6, pawns a4 b6 c7 d7 f7 g7 h7 (FEN r2qk2r/2pp1ppp/1pb4n/8/p2P4/B1P5/P1P2PPP/R2QNRK1 w kq) | "Black left the king in the center for too long. Can you find White's best move to take advantage and win the game?" (22) | Qe2+ (opponent blocks Qe7), then Qxe7# | Hint 1: "Find a powerful check on the e-file." Hint 2: arrow d1-e2. After Qe2+: bubble asks "How can you checkmate?"; final text says Black probably regrets leaving the king there; board shows a "Checkmate / Winner" banner. Qxe7 is mate because the Ba3 guards e7 [I, checked by eye; also shown by the board banner]. |
| 4 | White Bc4 Nf3, pawns a2 b2 c2 f2 g2 h2, Rf1 Kg1; Black Ke8 uncastled, Qe4 and pawn d4 (it took e4), Nc6 (FEN r1b1kbnr/pppp1ppp/2n5/8/2Bpq3/5N2/PPP2PPP/RNBQ1RK1 w kq) | "Black forgot to castle and just captured the e4-pawn. How can White win material?" (14) | Re1 (queen is pinned to the king) | Hint 1 (20 words) says a castled rook can become an attacker and asks how to use it against the queen; hint 2 arrow f1-e1. Correct text: "There's no way for Black to save the queen." Checked with python-chess: after Re1 every queen move is illegal except Qxe1+ (the queen is pinned) [V]. |
| 5 | White Ke1 Ra1 Rh1 Qd2 Bb3 Be3, pawns a2 b2 c2 d4 f2 h3; Black Kg8 Qg2 attacking h1, Bd6 Nf6 Re8 Ra8, pawns a7 b7 c6 d5 f7 g7 h7 | "How can we move our king to safety and protect our hanging rook on h1?" (16) | O-O-O (Rd1 then guards h1 along the first rank) | O-O is impossible (Qg2 covers f1). Correct text ~30 words: position is not perfect but much better, king safe, rooks connected. Ends with "Lesson Complete!" modal (graduation cap, Finish). |

Ending [V]: the Finish button opens /learn (the Learn path) with the cursor on the next "Learn To Play" tile and a green "Next Lesson" button; no game, no quiz, no review. Next-want: a Next Lesson button; progress is tracked (the lesson gets a tick).
Quality notes [I]: lesson 3 teaches "castle" but three of five challenges are tactics (a mate, a pin) where the lesson name is not the tested idea; a pin is never named in the bubbles seen. Hint 1 for challenge 2 gives away the plan.

## Opening Principles, lesson 4 "Active Pieces" [V]

Course-page blurb: an active piece can make many moves; get pieces active by moving them to the centre. 5 challenges, listed 7 min. No intro text captured (it types slowly); the first screen is the starting board with the lesson blurb and Start / Explainer Video buttons.

| # | Position | Prompt (words) | Accepted | Feedback and hints |
|---|---|---|---|---|
| 1 | Black to move in an opening where White has Nf3, c3, d4, e5 and Black has Qb6, c5, d5, e6 (French-like Advance structure); White king still on e1 | "Can you find a developing move for Black that prevents White from castling?" (14) | Bc8-a6 (hits f1) | Hint 1: "The f1-a6 diagonal looks wide open, develop a piece there!" (13); hint 2 arrow c8-a6. Praise about 14 words, names both ideas (open diagonal, no castling). |
| 2 | Smith-Morra-like: White e4, Black pawn on c3 after 1.e4 c5 2.d4 cxd4 3.c3 dxc3 | "White wants to capture Black's pawn on c3, which capture best activates a piece?" (14) | Nxc3 | Wrong test bxc3: "bxc3 is incorrect", then a 22-word reason (the pawn blocks the b1 knight from its best square) and "try again", with a refutation not played. Praise 16 words. |
| 3 | English-style: White c4, Nc3, g3, Bf1; Black Nc6 Nf6 e5 | "How can White develop a bishop to control some important central squares?" (11) | Bg2 | Praise 25 words: bishop works with the c3 knight and c4 pawn on the light squares. |
| 4 | Black Ke8 uncastled, White Bf4 attacks c7 (Black has Be6 Be7 Nf6, pawns c5 etc.), Black to move, board flipped | "White is attacking the c7-pawn. How can you defend it and secure your king at the same time?" (18) | O-O-O (Kc8 guards c7, Rd8 activates) | Praise 24 words names the three gains of the one move. |
| 5 | King and pawn endgame: Ke1 Pb2 vs Kf8 Pb3, White to move | "Active pieces matter in the endgame, too. How can you activate White's king to win the black pawn?" (17) | Kd2, Black Ke7, Kc3, Black Kd6, Kxb3 (three learner moves, opponent replies) | Wrong test Kf1: "f1 is incorrect", then a generic "That's not the right move. Try again!" (no reason; the generic fallback). Intermediate bubbles: "Great start! How can you win the pawn as quickly as possible?" then "Almost there. How can you win material?" Final text ties the king activity to b2 promoting. |

Ending [V]: "Lesson Complete!" modal (graduation cap, Finish). Course shape so far [I]: lessons 3 and 4 both end with a king action (castling, king activation), mix opening, tactical and endgame positions, and use opponent replies inside a challenge; no unknown-term lesson text appeared in the bubbles.
Evidence note [V]: wrong-answer text is not uniform. The knight-development lesson gives a reason (bxc3), the generic fallback appears for a king move in the endgame, and the Ke2 test in lesson 3 gave none.

## Opening Principles, lesson 5 "Phases of the Game" [V]

Course page lists it as a 2-minute video lesson with 6 challenges; the board part has no video in the challenge screen (the Explainer Video is a separate button, not opened). It is really one continuous opening line cut into six prompts, with the opponent's replies played for you. The final lesson of the course ends on "Lesson Complete!" and Finish, with no course-end game, quiz or sign-off beyond that; Finish returns to /learn. The Learn path still points to "Learn To Play" as the current course (this account's path was not advanced by course lessons) [V].

| # | Position | Prompt (words) | Accepted | Feedback |
|---|---|---|---|---|
| 1 | Start position, White | "Let's get started! Can you move a pawn directly into the center?" (12) | e4 (then Black plays e5, learner then plays Nf3: two learner moves in one challenge) | Wrong test a3: "a3 is incorrect" plus 17-word reason: that does not place a pawn directly in the centre. Right: 36 words, then asks for a knight developed with attack on e5. |
| 2 | After 1.e4 e5 2.Nf3 Be7 (Black's bishop move) | "Black just moved the bishop to the e7-square. Can you take advantage and immediately win a pawn?" (17) | Nxe5 | Praise 8 words: "wins a pawn for free". |
| 3 | After 1.e4 e5 2.Nf3, Black to move (board flipped, restarts the line) | "Black's pawn on e5 is under attack from the knight on f3. Can you develop a knight toward the center and protect the e5-pawn?" (24) | Nc6 | 20-word praise. |
| 4 | After 3...Nc6, White to move | "Can you move the f1-bishop to an open diagonal that controls the center?" (14) | Bc4 (and then castle O-O as the second move) | Bb5 got a new status, "b5 is an alternative" (orange, not red) with a 30-word note: it attacks the knight that protects e5, good, but find the move that directly controls central squares; retry button offered. Bc4 praise ends with "can you castle?" |
| 5 | After 3...Bc5 4.Bc4 ... Nf6, White castled | "Black's knight on f6 is attacking the e4-pawn. Can you develop a knight to protect the pawn?" (16) | Nc3 | 14-word praise. |
| 6 | White to move, Nc3 Nf3 Bc4 vs Nc6 Nf6 Bc5 | "White wants to move a pawn to protect the e4-pawn and open up a diagonal for the bishop on c1. Can you find the move?" (24) | d3 (Black replies d6), then Bg5 | After d3 the bubble asks for the bishop to a square that attacks a knight; Bg5 praise 14 words. |

Notes [V/I]: the lesson uses a four-move main line that is a Giuoco Pianissimo with Bg5 (a real opening move order, not a toy position). "Phases of the Game" is named for opening, middlegame, endgame but the six challenges only cover the opening and the first middlegame ideas [I]. Alternative-move handling ("is an alternative") is a third feedback state, new relative to Addendum 3 [V].

## Finding Checkmate (course page and lesson 1 "Pawn Race") [V]

Course page: 6 lessons, 30 challenges, "20 Minutes", released 12/26/2018. Tags: Fundamentals, Beginner, Attacking, Attacking the King, Endgames, Pawn Endgame, Back Rank. Promise (paraphrase): learn to find weak squares and calculate checkmates. Lesson order [V]: 1 Pawn Race (4 min, 5), 2 Back Rank Checkmates (3, 5), 3 Weak Targets: f2 and f7 (3, 5), 4 King Safety (3, 5), 5 Don't Just Check (4, 5), 6 Checkmate in 2 Moves (3, 5). Sequencing note [I]: the course starts with pawn races (a king-and-pawn counting skill, no mating at all), then back rank, then weak squares, then safety, then check discipline, then mate-in-2; the first lesson is the least "checkmate" one.

### Lesson 1 Pawn Race (5 challenges, listed 4 min) [V]

| # | Position (White unless stated) | Prompt (words) | Accepted | Feedback |
|---|---|---|---|---|
| 1 | Ka6 Pf5 Ph6 vs Kc6 Pa3 | "Which pawn should White move to win the pawn race?" (10) | h7, then after ...a2 the learner plays h8=Q (promotion picker appears: Q N R B) | Wrong test f5-f6: "f6 is incorrect" plus "This does not push a pawn, try advancing a pawn!" [V; this text is wrong for f6: f5-f6 is a pawn advance, the generic text does not match the move, so the learner is told something false]. Right: "Excellent! Keep going!" then "White promotes first, and notice the new queen protects Black's promotion square" (14). |
| 2 | Kf6 Pg6 Pb5 vs Kg8 Pa4 | "Which pawn should White advance to win the pawn race?" (10) | b6, b7, b8=Q mate (after ...a3, ...a2) | Explanation 21 words: advance the pawn whose path is not blocked by a piece. Final: "Black is checkmated" with a Checkmate/Winner banner. |
| 3 | Kd4 Pb6 Ph6 vs Kb4 Pa3 | "White has two pawns that can march forward and promote in two moves. Which pawn move is best?" (17) | b7, then b8=Q+ | python-checked: b7 a2 b8=Q+ is check on the b-file; h7 a2 h8=Q is not check, and I did not test whether h7 was accepted [V for b7; h7 untested]. Praise 16 words ("promotes with check"). |
| 4 | Pa7 Ke4 Nd3 vs Kg7 Ph2, White to move | "With White to move, should White promote, or should White first prevent Black from promoting?" (16) | Nf2 (covers h1) | Wrong test a8=Q (picker appears): the board plays ...h1=Q+ (a refutation shown), bubble 20 words: White promoted first but Black wins the queen after the king moves out of check. Right: 27-word note that the knight protects the promotion square. |
| 5 | Kd7 Pf7 vs Kg7 Ph3 | "Can you find a king move that protects the pawn and prepares to safely promote it on the next turn?" (19) | Ke7, Black plays ...h2, then f8=Q+ | Praise 7 words, then "Now let's promote the pawn!", final 9 words. Lesson Complete modal as before. |

Shape [V]: counting plus one defensive resource per lesson; promotion piece picker and refutation shown on the board in the knight-race example; two-move or three-move challenges are normal. No hints used in this lesson (not tested).

### Lesson 2 Back Rank Checkmates (5 challenges, listed 3 min) [V]

All five were solved on the first try (no wrong-answer test in this lesson); hint 1 and 2 used once.

| # | Position | Prompt (words) | Accepted line | Feedback |
|---|---|---|---|---|
| 1 | Kg1 Qg3 pawns f2 g2 h3 vs Kg8 Qh5 pawns f7 g7 h7 | "Can you find the move that immediately wins for White?" (10) | Qb8# (queen across the board to the back rank) | "White delivers a back rank checkmate!" (7); Checkmate/Winner banner. |
| 2 | Rd3 Rd1 Kg1 b3 f2 g2 h2 vs Rc8 Rb2 Kg8 b4 f7 g7 h7 | "Can you find a winning combination for White on the back rank?" (11) | Rd8+ Rxd8 Rxd8# (the opponent's capture is played for you) | Mid text: White forces Black to capture the rook, now deliver the mate (17). |
| 3 | Kg1 Rc1 Re7 vs Rd1 Rd8 (Black rook on d1 gives check), Kg8 | "White's king is in serious danger. Can you find the best defense for White?" (13) | Re1 (block the check with the e7 rook) | Hint 1: "Can you find a way to block the check?" (10); hint 2: arrow e7-e1. Praise 11 words: White protects the back rank. A defensive challenge in a mate lesson, the only one in this lesson. |
| 4 | Ka1 Qa5 Rd1 vs Kg8 Qd7 Rc2 | "Black's queen is hanging, or is it? Can you find a forced win for White based upon Black's weak back rank?" (21) | Qd8+ Qxd8 Rxd8# | Mid: "White can now deliver a back rank checkmate" (9). The prompt itself hints it is a trap. |
| 5 | Kg1 Qe2 Re1 Rf1 vs Kg8 Qb6 Rc8 Rc5, Black is a rook up | "How can White sacrifice material to force a quick checkmate?" (10) | Qe8+ Rxe8 Rxe8# | Final: "Black has more material, but checkmate is what counts!" (11). Lesson Complete modal. |

Observations [V]: pattern is one back-rank motif repeated (a queen or rook check that forces a capture on the back rank, then a mate by the second piece) in 4 of 5 challenges; the learner never plays a waiting move, luft or defensive move except in 3. Term "back rank" is never defined in the bubbles read; the course page blurb is where it is explained [V from the course page]. Text lengths: prompts 10 to 21 words, praise 7 to 17 words.

### Lesson 3 Weak Targets: f2 and f7 (5 challenges, listed 3 min) [V]

Theme: the f-pawns are guarded only by the king at the start. Mixed White/Black perspective (the board flips). Four of five challenges end on a material win rather than a mate; wrong answers on captures get the "even better way" messages.

| # | Position | Prompt (words) | Accepted | Feedback |
|---|---|---|---|---|
| 1 | Italian-type: White Qh5, Bc4 vs Black Nc6 Nf6, Black king e8, pawn f7 | "How can White checkmate?" (4) | Qxf7# | "The f7-weakness helps White win the game. Nice work!" (10) |
| 2 | Black to move: Bc5 hits f2 (White castled? no, king e1, pawns f2 g3 e4, Nf3 Nd2) | "Black's bishop attacks White's weak f2-pawn. With Black to move, can you find a way to safely add a second attacker to White's weakness?" (25) | Ng4 (second attacker) | 29-word praise: White has no good defence, Black will win material next move [not engine-checked by me; claim stands as a human-written one]. |
| 3 | Ng5 Bc4 vs Black with Nc6 Nf6, queen d8 rook h8, pawns d6 e5 | "How should White capture the f7-pawn and make a fork?" (11) | Nxf7 (forks queen and rook), Black plays ...Qe7, then Nxh8 | Wrong test Bxf7+: "Bxf7+ is incorrect" plus 14 words "White wins a pawn, but there's an even better way to capture on f7" and the board plays ...Kxf7 (a refutation shown). Hint: "Capture an undefended piece." (4) (an auto-shown hint, not the bulb; see note). Final 10 words: wins a rook. Not checked: whether the knight on h8 then gets trapped; the text does not mention it. |
| 4 | Black Bb7 Nc6 Ng8 h6 b6; White Ng5 Bc4 e4 (Bf8 Ke8 Qd8 Rh8 at home) | "What's the best way to capture the f7-pawn?" (9) | Bxf7# (mate) | Wrong test Nxf7: "Nxf7 is incorrect" plus 15 words "White wins material, but another capture wins the game right away." [V with python-checker: Bxf7# is checkmate and Nxf7 is not]. Right: "Checkmate is always the best move!" (6) |
| 5 | Black to move, flipped board: Black Bc5 aims at f2, queen on d8 (position transcribed roughly from a flipped board) | "Can your queen help the bishop attack White's f2-pawn?" (9) | Qb6, White defends, then Qxb2 | After Qb6: "White defended f2, but let's win the b2-pawn" (10); final 14 words: the double attack on f2 and b2. Lesson Complete modal. |

Observations [V]: this lesson uses both an "incorrect" with a pointer to a better capture (3, 4) and a plain correct (1, 2, 5); in 3 and 4 a "good but not best" capture is rejected as incorrect (red cross) with an explanation, while in the Phases lesson a similar case was labelled "an alternative". So best-move grading is the rule in tactics and open-minded grading in opening lessons [I]. A click on the arrow at the next-button location while a multi-move challenge was still running pressed the hint bulb instead (UI quirk: the next arrow only exists after the final move of a challenge) [V].

### Lesson 4 King Safety (5 challenges, listed 3 min) [V]

Theme: a big material lead does not matter if the king is open. All five were solved on the first correct line; checkmates in 1 were confirmed with python-chess (Nf6# in 2, Nb3# in 3).

| # | Position (short) | Prompt (words) | Accepted | Feedback / hints |
|---|---|---|---|---|
| 1 | White Qa4 Rb1 Be3 Nf3 Rf1 Kg1 vs Black Qe2, Bd7 Nc6 (Black is up material) | "Let's make the best out of a bad situation and capture an unprotected black pawn." (15) | Rxb7, then Black plays ...Nd8, then Qxd7# | Hint 1: "The b7 pawn is unprotected, how can you capture it?" (11); hint 2 arrow b1-b7. After Rxb7 the bubble (about 40 words) narrates Black's reply and asks for the overlooked winning move; second hint: "Black overlooked a very important check in the position..." (10), second arrow a4-d7. Final: Black was up lots of material but forgot king safety (14). |
| 2 | White Qd6 Nd5 Be3 vs Black Ke8 Bf8 Nc6 Qc8 pawns g6 b6 e5 | "White's dominant central knight is ready to win the game. How can you checkmate?" (13) | Nf6# | "Exactly! Black overlooked checkmate!" (5). |
| 3 | Black to move (flipped): Rc1 Nd4 vs White Kd2 Ng4 Nf6 Be4 Ra5 Rh1, Kh8 Rf8 | "White hasn't managed to castle the king to safety. How can Black checkmate?" (13) | Nb3# | Praise 17 words: Black resisted the temptation of taking a rook on h1 (the one capture it declined). |
| 4 | White Qc4 Re1 Kg1 vs Black Qh3 pawn f3, Kh8 Rf8 | "Black is trying to checkmate on g2. How can White defend?" (10) | Qf1 | "Great defensive play! White's queen prevents checkmate just in time and saves the game!" (13). A defence, not a mate. [Claim "saves the game" not engine-checked.] |
| 5 | White Kh1 Qf2 Rf1 vs Black Kg8 Qd6 Bc7 Bc6, pawns a6 b5 c4 g7 h7; Black threatens Qxh2# | "Should White defend the h2-pawn, or can you find a way to take advantage of Black's weak king?" (18) | Qf7+ Kh8 Qf8+ Qxf8 Rxf8# | After Qf7+: "Can you find a forced checkmate in two moves for White?" (12). Final 16 words: a bad looking position turned winning. Lesson Complete modal. |

Observations [V]: lesson mixes both colours and both defence and attack, uses a queen sacrifice pattern (5), and the first challenge asks for a pawn grab that sets up a mate two moves later (a "quiet then forcing" shape). The lesson never states a rule of king safety in the bubbles read; the point is carried by "forgot king safety" in the closing lines. No wrong-answer message was triggered in lessons 2-4 after the first correct choice except where noted.

## Not covered (final state after the follow-up run)

Not done: Winning the Game lesson 1 challenges 1-4 (played, not recorded) and lesson 5 challenges 3-5; Intro to Book Openings lessons 2-5 (listed only); Winning with Tactics lessons 2-10 (listed only); Capturing Pieces lessons 1-8 (listed only); Playing the Game lessons 3, 4, 5, 7 and challenges 3-5 of lesson 2 (listed only or partial); Learn To Play Chess (2018) lessons 2-13 (listed only); and the BIAM checkmate courses (Checkmate Patterns You Should Know, Basic Checkmates and More, Essential Checkmate Patterns, Exclusively Checkmates). For those I guessed the slugs "checkmate-patterns-you-should-know" and "checkmate-patterns" and both gave "404 Page not found", and /lessons redirects to the new 2026 Learn To Play course, so I could not find their URLs without search or locked data. Lesson URLs follow /lessons/<course-slug>/<lesson-slug> and the Start button opens the lesson at once with no daily-limit modal during this trial [V].

## Cross-lesson findings (so far)

- **Trial removes the one-lesson limit [V]:** nine lessons in a row started without any "Daily limit reached" modal.
- **Three feedback states [V]:** "is correct" (green), "is an alternative" (orange, Bb5 in Phases of the Game), "is incorrect" (red). Red can carry a specific reason (about 15 to 25 words), a generic "try again", or the text "does not push a pawn" which was wrong for f5-f6 [V].
- **Refutations [V]:** shown on the board only in some tactics (Bxf7+ answered by ...Kxf7; a8=Q answered by ...h1=Q+); not for opening or king-move errors.
- **Hints [V]:** two levels again (text, then arrow); text hints vary from a 4-word tag ("Capture an undefended piece.") to a 28-word plan.
- **Multi-move challenges are common [V]:** opponent replies are played for you, the next arrow appears only after the last move, and pressing the arrow position before then hits the hint bulb.
- **Course shape [V/I]:** the beginner 2018 courses pay little attention to teaching terms; the course page blurb is where concepts are named, and the challenge bubbles are 10 to 25 words of prompt and 5 to 40 words of praise.
- **Course end [V]:** no end-of-course game or quiz in Opening Principles or in the lessons played of Finding Checkmate; each lesson ends with the same "Lesson Complete!" modal and Finish goes to /learn.
- **Clipboard note [V]:** one promotion click made the page write to the OS clipboard; the harness warned that page content is now on Andrew's clipboard, so check before pasting.

## Follow-up run (coordinator request, trial still active)

### Engine check of the earlier King Safety challenge 4 claim [V]
Position FEN 5r1k/p5pp/1p6/2p5/2Q5/2P2pPq/PP3P1P/4R1K1 w, Stockfish 19 lite (tools/engine.py), depth 18, 4 lines: Qf1 scores 0.00; every other White move shown loses (mate in 1 or 2). So "Qf1 saves the game" is correct (the only non-losing move).

### Finding Checkmate, lesson 5 "Don't Just Check" (5 challenges, listed 4 min) [V]
Theme: a check must achieve something. Most challenges are chains of 2-3 learner moves with long narrating bubbles (35 to 45 words in the middle of a chain).

| # | Position | Prompt (words) | Accepted | Feedback |
|---|---|---|---|---|
| 1 | Caro-Kann-like: White e5 d4, Black Qa5+ gives check, Nf6 | "How can you block the check and win material for White?" (11) | Bd2 (attacks queen), Black Qb6; exf6; Black Qxb2; Bc3 (attacks queen, guards rook a1) | Three learner moves; bubbles explain each reply: "Black retreats the queen...", "now Black is trying to win our rook on a1. Can you find the powerful move that attacks Black's queen and protects the rook?" (30). Final 30 words. |
| 2 | Black to move (flipped), White Qe2 Bg5 Nf3 d4, Black Ke8 Be7 Nf6 | "What is the best way to get the black king away from the white queen on the e-file?" (18) | O-O | 40 words: after castling Black is ready for ...Re8; White's early queen move will cause more trouble than it is worth. |
| 3 | Black Qe4 vs White Qa4+ (check) | "White boldly delivers a check. Was this a good decision? Find Black's best response!" (14) | Qxa4 (queen captures the checking queen along the 4th rank) | "Instead of focusing on development, White's careless check lost a queen." (11) The prompt asks a judgement question, answer is a capture. |
| 4 | French Winawer: Bb4 pins Nc3 | "Black's dark-squared bishop is pinning our knight on c3 to the king. Can you find a powerful check that will win material?" (22) | Qa4+ then Qxb4 | Check also hits the unguarded bishop. Praise 26 and 29 words: "checking the king with purpose". The pin is named in the prompt but not explained. |
| 5 | Black to move, white pawn e5 forks Bd6 and Nf6 | "Black's bishop on d6 and knight are forked by White's pawn. Can you find a way to avoid losing material for Black?" (22) | Bb4+ (Stockfish: Bb4+ +1.15 for Black, next best -2.46) | Good idea! White must escape the check, then the knight moves (17). Single move, ends Lesson Complete. |

Observations [V]: the lesson contrasts "check that wins something" with "careless check" (3, 4) but also uses a check as a defensive tempo (5); the lesson name means the same idea in both directions [I].

### Finding Checkmate, lesson 6 "Checkmate in 2 Moves" (5 challenges, listed 3 min) [V]
All five solved first time; the unique mate-in-2 first moves and the final mates were computed with python-chess from my transcription of each screen. Positions (FEN, my transcription): 1 r4rk1/1p3pp1/p3n3/R2N4/1P6/7P/5PP1/5RK1 w (Ne7+ Kh7 Rh5#); 2 5rk1/5p2/7p/4P1p1/4Nn2/5P1q/2Q2P2/4R1K1 w (Nf6+ Kg7 Qh7#); 3 k4r1r/p1RR1p2/Bp6/6p1/P7/8/1P3bPP/7K b (Rxh2+ Kxh2 Rh8#); 4 r5k1/5p1p/6p1/4q3/3bP2P/P1p3P1/P7/K2RR3 b (c2+ discovered check, Rxd4, Qxd4#); 5 1k4rr/p1p5/1pPbqp2/6p1/4P2p/1P2RNP1/1P5P/R4Q1K w (Qa6 quiet, Qc8, Qxa7#, protected by Ra1). In every case the engine-free search found exactly one first move except none was ambiguous.
Prompts 11 to 19 words, e.g. "In this seemingly quiet position, White can unleash a two-move checkmate. Can you find it?" (16). Praise is 2 to 30 words, and the last two challenges give almost none ("You got it!", then only the tick). Notable: challenge 5 shows an empty bubble ("Can you fi...") before the prompt finishes typing, and ends with no explanatory bubble at all. Challenge 4 is a discovered check (c2+) with a quiet-looking pawn push. No hints tested here.
Course end [V]: Finish returns to /learn (Next Lesson button, Learn To Play path). The course page afterwards still shows the same blurb and a "Related / More by this author" block; I saw no end-of-course quiz, game against a bot, or recommendation. Course arc (lessons 1-6) [I]: pawn counting, back rank, f2/f7 targets, king safety, purposeful checks, then pure mate-in-2: a progression from calculation to combination, with the mate-in-2 lesson last. Tactical terms (pin, fork, discovered check, deflection) are used in bubbles but never defined.

## Winning the Game (2018 course, Chess.com Team; 5 lessons, 16 min, 25 challenges) [V]
Course page text: promises ways to checkmate "a lone king" with queen, rook, two rooks, assisted mates and "Four move checkmates like Scholar's Mate". Tags: Fundamentals, Beginner, Attacking, Attacking the King, Endgames, Checkmate. Listed order [V]: 1 The 4-Move Checkmate (4 min), 2 Assisted Checkmates (1 min), 3 Checkmate with Two Rooks (2), 4 Checkmate with the Queen (3), 5 Checkmate with the Rook (6). The blurb lists the learning bullets in a different order from the lessons. Lessons 3-5 say "Watch the video". Lesson start screen shows a board, a Start button and an "Explainer Video" button [V]. Sequencing [I]: the course starts with the attack opponents actually meet (Scholar's Mate), then drops to the bare mating patterns; the rook box method, the hardest, is last and longest.

### Lesson 1 The 4-Move Checkmate (5 challenges) [V partly]
Challenges 1-4 were played but I did not record their prompts before my notes were compacted; only challenge 5 is recorded here. Challenge 5 (Black to move, board flipped, after 1.e4 e5 2.Bc4 with White queen d1): prompt starts "Can you ..." (typing slowly). Accepted: Nf6. Nc6 shows "is an alternative"; g6 shows "is incorrect" with a short bubble, "This move does not develop a knight". After Nf6 White plays Qh5 on the board; the bubble says "Great job! The knight develops toward the center and threatens the unprotected queen". The lesson then stays in the challenge: the Next button area turns into a Next Move/hint control, hint text "Try capturing", and the learner must play Nxh5, whereupon "You got it! Black wins White's queen" and Lesson Complete appears. Point: the learner finishes by punishing the Scholar's-mate attack, so the final win is a refutation, not a mate [V]. UI quirk [V]: the play-triangle button replays the lesson intro and the "Resume Challenge" button then returns to the same challenge.

### Lesson 2 Assisted Checkmates (5 challenges) [V]
All positions are static mate-in-1 puzzles with a short prompt ("Can you combine the forces of the queen and bishop to deliver checkmate?" for the first). Answers (my transcriptions, then confirmed by the page): 1 Qxg7# (Rf8 Kg8 f7 g7 h7, Bb2 Qg2 Kg1); 2 Ra7# (Ka8, Rh7 Nc6 Kg2; knight guards a7 and b8); 3 Qd8# (Black Ke8 Rg8 Qb7 e6 f7; White Qa5 Rd1 g2 h2 Kh1; the bubble opens "Black is threatening ..." so the prompt shows the opponent threat Qxg2#); 4 b8=Q# (Black Ka7 a6 Qf3 h3, White b7 Qb1 f2 Kg1; prompt "Black's queen is ready to end the game with ...Qg2 checkmate. Can you find a clever move that checkmates Black's king?"; promotion picker appears with queen, knight, rook, bishop and a close button); 5 Qg1# (White Qa7 Kf1, Black Rb2 Rc2 Kh1; prompt "Both kings are in danger, but it is White to move"; python-chess finds Qg1# as the only mate in 1).
Wrong-answer feedback tested on challenge 1 [V]: Bxg7 gives "Bxg7 is incorrect" and a tailored message: roughly, nice try, it captures a pawn and attacks the rook, but capturing with a more powerful piece would have been checkmate, try again. No refutation is played; the move stays on the board and a red undo button appears. Correct-answer bubbles name the mechanism: the queen checks and covers the escape squares while the bishop protects the queen (1); the rook checks, the knight protects the rook and covers b8 (2); "The queen delivers checkmate" (3); promotion and "just in time" (4); the king is checkmated in the corner (5).
End of lesson [V]: Lesson Complete modal, Finish. Defect [V]: after challenge 3 the page rendered at a huge zoom once, hiding the Next control, and a reload restarted the lesson from the Start screen at challenge 1 (progress inside a lesson is not kept).

### Lesson 3 Checkmate with Two Rooks (5 challenges) [V]
Played all five. Start screen has an Explainer Video button (not watched); the term "rook roller" is used in challenge prompts ("Use the rook roller to checkmate Black!", "Now we have a vertical rook roller - find checkmate in one!") but is not defined in any bubble [V]. Progression: 1 mate in 1 (Rg8#, Rf7 Rg6 Kg2 vs Kb8); 2 mate in 1 (Ra6#, Rb7 Rc6 vs Ka4); 3 "How can you force Black's king to the back rank on the next move?" Rg7+ (unique, with Rf6 sealing the 6th rank), black Kc8 replies automatically, then Rf8#: the bubble says the rook roller forces the king to the back rank and asks for the move that ends the game; the board shows "Checkmate" and "Winner" labels; 4 a messy position (Black rook, knight, pawn on b2 threatening promotion): python-chess confirms Rh7+ is the only mate in 2, then Rf8# after Kb8 (bubbles: "Good start", then Great job); 5 White king under attack from a black queen and rook but the rooks mate first: "White king is under attack by the black queen and rook, but White's rooks can force Black's king into the corner" (24 words); Rb2+ (only mate in 2), Ka8, Rc8#, "You did it! Black's king is checkmated just in time". Pattern [V]: 1-2 plain, 3 teaches the roller, 4-5 add counter-threats so the learner must see that mate beats the opponent's threat.

### Lesson 4 Checkmate with the Queen (5 challenges) [V]
Played all five. Start screen again has Explainer Video; the box/edge-forcing technique is only in the video. All challenges are one or two learner moves: 1 Qg7# (Kf6 Qg5 vs Kh8; "White to move - can you find an immediate checkmate?" 9 words). Wrong try Qh5+ gives "This move does not immediately checkmate the black king. Try again!", a generic message, with undo button, no refutation. 2 Kf6 Qc7 vs Kh8: "Can White deliver checkmate immediately, or should White play Kg6 to prepare checkmate?" Qg7# (python-chess: Qg7 mates, Qf7 would stalemate, no other mate); the prompt names a decoy. 3 Ke5 Qg5 vs Kh8: "can you find a move for White that sets up checkmate on the following turn?" Kf6 is the unique mate in 2; Black answers Kh7, then Qg7#; the bubble explains "The white king prepares to help the queen". 4 Qb7# (Kc6 Qg7 vs Kb8) "How can White checkmate in one move?" 5 Qb8# (Kf6 Qb2 vs Kf8) "How can White make an immediate checkmate?". Observation: the real skill (forcing a lone king to the edge with a queen without stalemating) is never tested; stalemate is only avoided silently in challenge 2 [V].

### Lesson 5 Checkmate with the Rook (listed 6 min, 5 challenges) [V partly]
Played challenges 1-2 only. 1 Ra7 Kg6 vs Kg8, "Black's king is trapped on the back rank. Can you find the winning move for White?" Ra8#. 2 Ra... Rh6 Kc4 vs Ka4, "Black's king is stuck on the a-file. Can you find the move that wins immediately for White?" (Ra6#). Challenges 3-5 not played, so the box method is not confirmed as tested; it too appears to live in the video [I].

### Winning the Game: course-level findings [V/I]
- The course is almost all mate-in-1 or mate-in-2 puzzles from a given position. It never starts from the full king-and-queen or king-and-rook ending, so a learner cannot practise the technique, only recognise the last move [I from V].
- The only end-of-course event I saw is the Lesson Complete modal (Finish returns to /learn); no game, no quiz, no recommendation [V]. In lesson 1 the learner finishes by capturing an attacking queen, not by checkmating [V].
- Wrong-answer messages range from tailored (Bxg7: describe what the move did and what a stronger version would do) to generic (Qh5+); there is a short "Try again" loop and an undo button, never a played refutation [V].

## Intro to Book Openings (2018 course, Chess.com Team; 5 lessons, 21 min, 25 challenges) [V]
Course page text and order [V]: 1 e4 Openings for Beginners (white, 6 min), 2 d4 Openings for Beginners (white, 3 min), 3 Defending Against e4: e5 and the Sicilian (6 min, black), 4 Defending Against e4: French, Caro-Kann, Scandinavian (3 min), 5 Defending Against d4: d5 and Nf6 (3 min). Slugs: 1-e4-openings-for-beginners-white, 1-d4-openings-for-beginners-white, 1-e4-openings-for-beginners-black, intro-to-1-e4-defenses-for-black-1-e6-1-c6-and-1-d5, 1-d4-openings-for-beginners-black (so the url order differs from the listed order; the slug of lesson 3 is "...e4-openings-for-beginners-black"). Tags: Openings, Opening for White, Opening for Black, Development, Pawn Structure, Space. The blurb promises "the idea of chess theory"; opening names are given as labels, with no memorisation drill [V]. Only lesson 1 played in full; lessons 2-5 not played (time), listed only.

### Lesson 1 e4 Openings for Beginners (5 challenges; start screen has Explainer Video) [V]
The learner plays a scripted line against automatic replies; the prompt usually names the move or the idea, so the task is to find and execute the named move or the described idea (word counts of bubbles 10 to 40).
| # | Prompt (paraphrase) | Learner moves | Notes |
|---|---|---|---|
| 1 | "Let's get the game started by playing 1.e4!" then "How can we develop a knight toward the center and attack Black's pawn on e5?" then "turn this game into the Italian Game by moving our light-squared bishop to c4" | e4, Nf3 (Black e5, Nc6 automatic), Bc4 | Wrong move d3 gets "d3 is incorrect. This does not move a white pawn to e4. Try again!" with undo. Close: bishop controls a diagonal and White is ready to castle; the opening is named "Italian Game". |
| 2 | "Let's play 3. Bb5 - attacking Black's knight on c6 - which brings us to the Ruy Lopez opening!" | Bb5 (Black a6), hint question "How can you safely keep the light-squared bishop on the same diagonal ...?" Ba4 (Black b5) "how can we move the bishop to safety and enjoy a strong diagonal?" Bb3 | The first reply bubble ends with the hint text, since a stray next-arrow click opened the hint: the next-arrow location is the hint bulb until the move is complete [V]. Close: bishop "pointing directly at Black's weak f7 pawn" (f7 is described as weak; fine as a lesson claim [R]). |
| 3 | "Let's capture Black's knight and understand why this doesn't win a pawn for White." | Bxc6 (Black dxc6 automatic), Nxe5 (Black Qd4 automatic) | The learner is made to play the plausible greedy move and watch the refutation (queen fork of Ne5 and e4). Close: "Black will regain the pawn ... This is why White usually prefers to not trade the bishop for knight so early." I judge this the best teaching pattern seen so far in the beginner courses: explore-and-see rather than being told [I]. |
| 4 | "Let's explore the aggressive Scotch Opening by playing 3. d4." then "after this lesser move, how can White capture a pawn and prepare to open up the d-file?" (Black played 3...d6) | d4, dxe5 (Black Nxe5), Nxe5 (Black dxe5), Qxd8+ | Close: "Black won't be able to castle this game and White has a nice position." (the line is the known Scotch-type d6 line; "a nice position" is slightly generous, an [R] claim.) Note this challenge deliberately walks a side line (3...d6), not the main line. |
| 5 | "Let's open up the game by playing 3. d4, the Scotch Opening!" | d4 (Black exd4), Nxd4 (Black Bc5), Be3 | The main line follows lesson 4's side line. Close: "bishop into the game and adds another guard to the d4 knight to keep it safe." Lesson Complete. |
Observations [V/I]: this lesson has four of its five challenges inside the 1.e4 e5 2.Nf3 Nc6 tabiya, so the sequencing is "one tabiya, three branches" (Italian, Ruy Lopez with the Exchange idea, Scotch); each branch is two to four learner moves long; no move is ever tested without the prompt giving it away or a hint, so the learner mostly follows instructions rather than recalling, a gap to note for Scholarmate's unlabeled-testing rule [I]. Plans are stated in one phrase per move ("development toward the center", "controls a diagonal"), no pawn-structure vocabulary.
Course end [V]: Lesson Complete modal only.

## Winning with Tactics (2018 course, Chess.com Team; 10 lessons, 29 min, 50 challenges) [V course page; lesson 1 challenge 1 played]
Listed order and minutes [V]: 1 Sacrificing to Win (4), 2 Trapped Piece (2), 3 Discovered Attack (3), 4 Discovered Check (3), 5 Double Check (2), 6 Remove the Defender (2), 7 Smothered Mate (5), 8 Deflection (3), 9 Decoy (2), 10 Desperado and Zwischenzug (3, "Watch the video"). Tags: Key Concepts, Beginner and Intermediate; themes checkmate, decoy/deflection, discovered attack, double check, fork, interference, pin, removing the defender, sacrifice, skewer. Sequencing [I]: starts with the broad motive (sacrifice for mate), then one geometric trap, then a ladder of discovered themes (attack, check, double check), then removing/deflecting/decoying defenders, with the most exotic pattern (smothered mate) in the middle and the "in-between move" last. The page button says "Start" (course untouched by this account). Slugs: sacrificing-to-win, trapped-piece, discovered-attack, discovered-check, double-check, remove-defender, smothered-mate, deflection, decoy, desperado-and-zwischenzug.
Lesson 1 challenge 1 [V]: White Qa3 Nf3 Re2 Re1 Kg1 b3 a2 f2 g2 h2 vs Black Ra8 Bc8 Rf8 Kg8 Qc7 pawns a7 b6 f7 g7 h7; prompt "Can you find a powerful sacrifice that forces checkmate?" (10 words); answer Qxf8+ (python-chess: the only mate in 2), then after Kxf8 the bubble says "Black's king is exposed on the back rank - deliver checkmate!" and Re8# finishes with "Great job, Black is checkmated!". The word "sacrifice" is in the prompt, so the learner is told what to look for. Other lessons not played.

## Capturing Pieces (2018 course, Chess.com Team; 9 lessons, 34 min, 45 challenges) [V course page; last lesson played]
Listed order [V]: 1 Evaluating Captures (3), 2 Tactics and Hanging Pieces (3), 3 Counting Captures (7), 4 Forks (3), 5 Pins (2), 6 Piling Up (1), 7 Skewers (2), 8 Avoiding Bad Trades (5), 9 Your Opponent's Move (8, "Watch the video"). Slugs: value-of-the-pieces, tactics-and-hanging-pieces, counting-the-captures, forks, pins, piling-up, skewers, avoiding-bad-trades, your-opponents-move. The course page shows "Restart", i.e. the account had touched it. Tags: Fundamentals, Beginner, Middlegame; Tactics, Discovered Attack, Double Check, Fork, Passed Pawn, Pin, Promotion. Piece values given as pawn 1, knight 3, bishop 3, rook 5, queen 9. Sequencing [I]: values, then "is it loose?", then counting attackers against defenders, then three geometric tactics (fork, pin, skewer) with a one-minute "piling up" lesson tied to the pin, and the final two lessons turn to bad trades and thinking about the opponent's reply: a course that ends on habit of thought rather than a new pattern.

### Lesson 9 Your Opponent's Move (5 challenges, listed 8 min) [V]
Played all five, each position engine-checked (Stockfish 19 lite, depth 20). Theme: answer the opponent's last move or threat before your own plan.
| # | Position (my transcription) | Prompt (words) | Accepted | Engine and notes |
|---|---|---|---|---|
| 1 | White Kg8 pawn h7 vs Black Qg6 Kg2, White to move and in check | "How should White escape the check?" (6) | Kh8 | Kh8 0.00 (draw), Kf8 loses to Qxh7 (mate in 7). Bubble: Black cannot win the pawn before it promotes, "The game should soon end in a draw" [V]. |
| 2 | 8/6pk/8/5p2/PN3P2/6P1/3q1P1P/4R1K1 w (Qd2 attacks Re1 and Nb4) | "Black is attacking both your rook and knight. How can you save both of them?" (16) | Rb1 (defends Nb4 along the b-file and leaves the attack) | Rb1 +0.37 best, other moves about -0.4. Bubble says "good winning chances in the endgame": the engine shows only a small edge, so the claim is generous [V engine, I]. |
| 3 | 8/2Q2pkp/p2p2pq/4p3/4P3/1n1P4/P1P2PPP/6K1 w (Black Nb3 just captured) | "White needs to recapture on b3, but must be careful. How should you do it?" (15) | cxb3 | Engine: cxb3 +0.05; axb3 loses to Qc1# (mate in 1). The point is that cxb3 keeps the Qc7 guarding c1. Black then plays Qc1+ on its own, bubble "Black didn't pay attention to the idea behind White's last move and declares 'Checkmate!'... prove Black is mistaken", learner plays Qxc1. A nice "opponent's mistake" payoff [V]. |
| 4 | 3r2k1/4Rppp/p7/1p6/8/P7/1P3PPP/R2r2K1 w, White in check from Rd1 | "Black is attacking our king and rook on a1. What is White's best defense?" (14) | Re1 (Re7-e1), Black Rxe1+, Rxe1 forced, Black Rd2, then Re8# | Rxd1 loses to Rxd1+ Re1 Rxe1# (mate in 2). After Re1 Rxe1+ Rxe1 Rd2 the question "What is White's best response?" hides a mate: Re8# (mate in 1; other moves about -0.1). Bubble: "Nice job considering both your opponent's ideas as well as your own." [V] |
| 5 | Black to move, flipped board; 1.d4 d5 2.Bf4 Nf6 3.Nc3 Bf5 4.Nb5 line: rn1qkb1r/ppp1pppp/5n2/1N1p1b2/3P1B2/8/PPP1PPPP/R2QKBNR b | "White wants to play a knight fork on c7. How can you defend that square?" (15) | Na6, then White Nxc7+, Nxc7, White Bxc7, Qxc7 | Na6 +0.03 best, e5 -1.8, others -3 or worse. Praise "Great move! White should have admitted a faulty plan, but insists on attacking. How can Black win material?" then "Nicely done! What should we capture next?" then "Excellent work defending against an unsound attack!" [V]. A pure "refutation" lesson where Black's defence is the answer. |
Prompts are short (6 to 16 words) with the coaching in the praise after the move; the prompt never reveals a mate or a draw (challenges 1 and 4 hide the right idea behind a defensive question) [V]. Wrong-answer feedback not triggered here.
Course end [V]: the Lesson Complete modal ("Way to go! Continue your journey learning chess."), Finish goes to the Learn path with the Learn To Play column, a "NEXT SECTION: Beginner" marker and a green "Next Lesson" button. No course summary, no quiz, no game, no rating; the end of a standalone course is simply "return to the path" [V].

## Playing the Game (2018 course, Chess.com Team; 7 lessons, 43 min, 35 challenges) [V course page; lessons 1 and 6 partly played]
Listed order [V]: 1 The Goals Of Chess (no minutes shown), 2 The Value Of The Pieces (3), 3 Finding the Right Move (4), 4 The Language of Chess (3, notation, video), 5 Playing a Game (3, "a complete game of chess played with all moves explained", video; slug a-master-chess-game), 6 Stalemate (3), 7 Other Draws (listed 27 min, almost certainly a data defect or a long video, since the course total of 43 min needs the 27). Tags: Fundamentals, Beginner, Rules & Basics. The course page said "Continue" (course touched). Sequencing [I]: goal (capture, check, mate), values, "check the checks, captures and threats" habit, notation, a full explained game, then the two ways a game does not end in a win. Stalemate and draws come last, after notation and a model game.

### Lesson 1 The Goals Of Chess (5 challenges) [V]
No Explainer Video button on the start screen, just Start. Five static puzzles, prompts 5 to 20 words, answers one move each: 1 "Which piece can White capture?" (hanging bishop d6, Rxd6, "Good choice! White captures the bishop."); 2 "White's king is in check. How can you get to safety?" (Kg2, the only legal move, so it is not a real choice); 3 "The black bishop is checking White's king. What is White's best way out of check?" Qxd5 (capture the checker; praise "Capturing the bishop removes the attack on your king"); 4 "White can check with the queen or with the rook. Which one is checkmate?" Qd8# (python-chess: Qd8# is the only mate; Rh8+ is a check). Trying the wrong Rh8+ played the refutation Kxh8 on the board with "Black's king can capture the rook so this is not checkmate. Try to find a way to win the game." [V]; 5 "White has several checks, but only one is mate. Can you find it?" Rb8# (python-chess: checks are Ra8+, Rd7+, Rb8#, Rd6+). Pattern [V]: capture, escape check, capture the checker, choose mate among checks; the whole "three ways out of check" idea is practised by example, not stated.

### Lesson 6 Stalemate (5 challenges, video lesson; start screen shows a stalemate position and an Explainer Video button) [V partly]
The learner is asked to produce stalemate, not avoid it. 1 White Kd7 a6 vs Black Ka8 a7 Qc8: "What can White play to end the game in stalemate?" Kxc8, bubble "Good idea! Black's pieces can't move so the game ends in stalemate." 2 White Ka1 g4 vs Black Qc2 Kh6 g6: "White looks doomed, but can you find a way to save the game with stalemate?" g5+ (the only legal move), bubble explains that White's king has no legal move so whatever Black plays White is stalemated (I agree: Black must answer the check from the pawn, and the queen cannot free a1) [V/I]. Challenges 3-5 not played. This framing teaches stalemate as a defensive resource first, the opposite of the "avoid stalemate" order of the new course [I].

## Learn To Play Chess (2018 course, Chess.com Team; 13 lessons, 18 min, 65 challenges, released 10/18/2018) [V course page; lesson 1 played]
Listed order [V]: The King and the Goal (1 min), The Queen (1), The Rook (1), The Bishop (1), The Knight (1), The Pawn (2), Pawn Promotion (1), En Passant (1, video), Moving and Capturing (3), Check (1), Getting Out of Check (1), Checkmate (1), Castling (3). Slugs end in numeric suffixes (the-queen-1, the-rook-2, the-bishop-2, the-knight-1, the-pawn-2, en-passant-5, check-1, getting-out-of-check-3, checkmate-1, castling-4). Order of concepts: king before the others, pawn last of the pieces, promotion and en passant before captures in general, and checkmate in lesson 12, after "check" and "getting out of check"; castling last. Total about 18 minutes for the whole rules course.
Lesson 1 The King and the Goal [V]: start screen shows one white king alone on an empty board and a bubble that reads the course blurb. Five drills with no opponent: "Can you move the king straight up one square to get closer to the corner?" (a6 to a7, praise "Excellent! The king climbs up the board and is now touching the top left corner square."); then Ka8; then "move the king up one square diagonally to the right" (c3 to d4); then "move the king to the side, one square to the right" (d4 to e4); then "straight down into the corner" (h2 to h1). Wrong move Kb5 on the first drill: "Nice try, but this move brings the king away from the top of the board. Try again!" with undo. So the first minute never mentions or shows a checkmate; the "goal" in the lesson name is only the corner square [V]. Every prompt gives the exact direction, so the task is to follow the sentence [I].

## Follow-up run: course-end summary and sequencing findings [V/I]
- Every lesson ends with the same modal (Lesson Complete, "Way to go! Continue your journey learning chess.", Finish). Finish from a standalone course returns to the Learn path (Learn To Play column, "NEXT SECTION: Beginner" marker, a green Next Lesson button). I saw no end-of-course game, quiz, test, rating or recommendation in any of the five courses I finished a lesson in (Finding Checkmate, Winning the Game, Intro to Book Openings, Capturing Pieces, Playing the Game) [V].
- Courses are sequenced as ladders of 1 to 7 minute lessons, 5 challenges each, with the weakest-explained concepts left to an Explainer Video or a "Watch the video" blurb (rook roller, queen box, rook box method, notation, en passant, the model game). The in-lesson text defines nothing; the course page blurb carries the definition [V/I].
- Prompt style by course: Finding Checkmate and Capturing Pieces ask an open question with the theme hidden ("How should White escape the check?") but the lesson names the theme; Intro to Book Openings and Learn To Play tell the learner the exact move ("playing 1.e4", "up one square"); Winning the Game and Playing the Game ask "find the mate" in one move. Three levels of scaffolding in one product [I].
- Feedback: generic "does not X, try again" messages are common; tailored near-miss messages appear when the wrong move is one a beginner would plausibly play (Bxg7, Kb5, d3, Rh8+); a refutation is played on the board in some lessons (Rh8+ Kxh8, Nxe5 Qd4) and not in others (Qh5+ shown only as a message) [V].
- Claims I checked with the engine: Qf1 draw (earlier), Kh8 holding a draw, Rb1 as the safe move (+0.37, bubble says "good winning chances"), cxb3 over axb3 (the latter loses to Qc1#), Re1 then Re8#, Na6 as the only good defence of c7, Bb4+ best (earlier). One generous claim: Rb1 "good winning chances" [V engine, I judgement]. One text defect earlier: the "does not push a pawn" message on f5-f6.
- UI defects seen: after a mate in Assisted Checkmates challenge 3 the page once rendered at a huge zoom and the Next control was off-screen; reloading restarts the lesson from the Start screen at challenge 1, so progress inside a lesson is not saved [V]. Next-arrow area and the hint bulb share a position, so an early click opens a hint [V].
- Account notes: Andrew's account shows "Restart" on courses he has touched and "Start" or "Continue" on others; I did not change any setting, click nothing about upgrade or cancel, and entered no credentials. A promotion click earlier in the first run wrote to the OS clipboard (harness warning), so Andrew should check his clipboard before pasting anything.

# Round 2 (second trial session, 8 Nov 2026): full-library run

Method note [V]: the lesson board is ordinary page markup (pieces carry colour/type/square classes), so a FEN could be read from the screen state of the learner's own lesson with no network or source reading; coach text read from the visible page text. Positions below are FENs read that way (board part, side to move), engine-checked where a claim is made (Stockfish 19 lite depth 14, `tools/engine.py`). No daily-limit modal appeared for any lesson in this session [V].

## Winning with Tactics, lesson 2 "Trapped Piece" (5 challenges, listed 2 min) [V]
Intro screen: a Giuoco-like position, one bubble of about 35 words (the idea: take away a piece's safe squares with the right pawn move; trades are dangerous for a queen), Start and Explainer Video. Course tags: tactics for beginners/intermediates.

| # | Position (FEN board, side) | Prompt (words) | Accepted | Feedback, hints, refutation |
|---|---|---|---|---|
| 1 | r1bq1rk1/ppp2ppp/2np1n2/2b1p3/P1B1P3/2PP1N2/1P3PPP/RNBQK2R w | "Can you find a way to trap Black's c5-bishop?" (10) | b4 (bishop retreats Bb6 by itself), then a5 | Two-move challenge. After b4 the bubble says the bishop retreated to its only safe square and asks to trap it; after a5 "no safe squares to retreat, White will win material". Not tested wrong. |
| 2 | r1b1k2r/pp2ppbp/2n3p1/2p5/q2PP3/1R3N2/P1QB1PPP/4KB1R w | "Black's queen is all by itself on the edge of the board. Can you find a way to trap it?" (17) | Bb5 (the only move that attacks the queen and leaves it no safe square; python-chess search [V]) | Wrong test Rb4 (attacks the queen but she escapes): red cross, retry button, text "does not trap the black queen, try again" (generic for the theme); no refutation played. |
| 3 | 2q2rk1/pp5r/2p5/3pQ3/3Pn3/4PN2/PP4P1/2R1R1K1 b (board flipped) | "Can you use a rook to trap White's queen in the middle of the board?" (14) | Rf5 (Qxf5 Qxf5 wins the queen for a rook) | Wrong test Rfe8: the board plays the refutation Qf4 (queen leaves) and the text says the move "allows the queen to survive a little while longer". Wrong test Rh5: generic "does not trap White's queen". Hint 1: "find a move that attacks the queen and does not allow a safe retreat" (18 words) plus the f8 rook square highlighted green. Correct text says "no safe squares"; strictly the queen can take the rook on f5 but loses to the queen on c8 [I]. |
| 4 | 5k2/pp4pp/4pp2/1P6/8/P3P3/5PPb/2B2K2 w | "Can you find a way to trap the h2-bishop?" (10) | g3 (Black plays ...h5), then Kg2 (Black plays ...h4), then Kxh2: three learner moves | Hints at the later steps: "Which piece can attack Black's bishop?" and "How can White capture Black's bishop?" appear automatically as a question in the bubble if the learner presses Next early. Text after g3 says Black tries to send help with the h-pawn; after Kg2 it says Black should have taken the g3 pawn to get more for the piece. |
| 5 | rnbqkbnr/p3ppp1/3p3p/1pp5/4P3/1B3N2/PPPP1PPP/RNBQ1RK1 w | "Black just pushed the pawn to c5, planning to trap White's bishop with c4 on the next move. How can White best escape?" (23) | Bd5 (attacks the rook on a8; engine +7.2) | Wrong test a4: red "incorrect", text "not a bad idea, but there is a much stronger move". Engine: a4 about +1.8, Bd5 +7.2, so the text is accurate, but a sound, clearly winning-ish move gets a red cross, not the orange "alternative" state [V engine, I interpretation]. |

Lesson shape [V]: every challenge asks a "trap" question with the theme named in the prompt; two of five are multi-move. Ending: Lesson Complete modal with a graduation cap and Finish button. Nothing about the lesson recalls the previous lesson. Time to play with probes: about 12 minutes.

## Winning with Tactics, lesson 3 "Discovered Attack" (5 challenges, listed 3 min) [V]
Intro bubble (about 38 words) defines a discovered attack in one sentence and adds why it is strong (the opponent can answer only one piece). Start + Explainer Video. Every one of the five positions is a real or realistic game position with a discovered attack whose first move is a capture or a check.

| # | Position (FEN board, side) | Prompt | Accepted | Wrong-answer feedback |
|---|---|---|---|---|
| 1 | r1b2rk1/pp3ppp/3q1n2/3p2B1/8/2PB4/PP1N1PP1/R2Q1RK1 w (from a Gareyev blindfold game) | "Let's play the Grandmaster's next move, 14. Nc4" (tells the move) | Nc4 (...dxc4), Bxh7+ (...Nxh7), Qxd6: three learner moves in one challenge | not tested. Bxh7+ is the engine's only good move (+5.8) [V engine]. Narrative text between moves: Black thought White blundered; "Black resigned in the game". |
| 2 | r1bqr1k1/p1p2ppp/3b1n2/2P3B1/8/2NQ1N2/PP3PPP/R4RK1 b | "White just captured a pawn on c5, thinking Black would capture on c5 with the bishop and trade queens. What did White miss?" (26) | Bxh2+ (Nxh2), Qxd3 | Bxc5: the board plays the queen trade (Qxd8) and the text says White trades queens with a comfortable game and "there is a much stronger move". Engine: Bxc5 -0.2, Bxh2+ +6.2 [V]. |
| 3 | r2q1rk1/pbpn1pp1/1p2pb1p/8/2PPN3/6P1/PPQ2PBP/R1BR2K1 w | "How should White use a discovered attack to win material?" (11) | Nxf6+ (Nxf6), Bxb7 | Nd6 (also uncovers Bg2): red, "there is a better option, look for a strong capture", no refutation played. |
| 4 | k2r4/p2q4/2R5/3B4/8/7P/5PP1/6K1 w | "How can White checkmate?" (5) | Rc8# (double check, only mate in 1) | Rd6+ (a check): "there is a checkmate, but that is not it. Look at your checks." Near-miss text that knows a mate exists. Checkmate/Winner banner on the board. |
| 5 | rnb2rk1/pp3p1p/4pbp1/q1Pp4/7P/2N5/PPPQPPP1/1K1R1BNR w | "How can White use a discovered attack to win material?" (11) | Nxd5 (Qxd2), Nxf6+ | Ne4 (also discovered, engine +0.5): red, "only a fair trade, find a stronger knight move", and the board plays Qxd2. Rxd2 on the second step: "Black wins a knight, find a better capture". Lesson ends on Nxf6+ with text promising the queen capture next, so the final capture is not played. |

Shape [V]: four of five challenges ask for several learner moves, with opponent replies automatic. Wrong-answer feedback in this lesson is consistently specific (names why the move falls short) and often plays the refutation on the board, the opposite of the Finding Checkmate lesson. Hint button not used. Time about 14 minutes with probes.

## Capturing Pieces, lesson 1 "Evaluating Captures" (URL slug value-of-the-pieces; 5 challenges, listed 3 min) [V]
The course page lists the lesson as "Value of the Pieces"; the lesson page itself is titled "Evaluating Captures". Intro bubble (about 40 words): the point values (pawn 1, knight 3, bishop 3, rook 5, queen 9, king "the whole game"). The point counts then appear in the feedback texts of every challenge, so the numbers are taught by use.

| # | Position (FEN board, side) | Prompt | Accepted | Wrong-answer feedback |
|---|---|---|---|---|
| 1 | 3q2k1/2p2npp/4p3/5p2/3Q3B/4P3/5P2/6K1 w | "What is White's best capture?" (6) | Bxd8 (Nxd8 forced) | Qxd8+ (queen trade): red; "better to capture the queen without losing your own". |
| 2 | 2r4k/p5pp/1b3n2/3Np3/P3Pp2/2r2B1P/5PP1/R4RK1 w | "Which move wins material for White?" (6) | Nxc3 (rook for knight; engine +4.4) | Nxb6: "only an even trade (3 points for 3 points)". |
| 3 | 5rk1/1p3pb1/4p3/8/p2n4/6B1/1P1R1P2/3R2K1 w | "How can White win material?" (5) | Rxd4 (Bxd4), Rxd4: two learner moves | Kf1 (quiet): generic "there is a better move, look for a strong capture"; no refutation. |
| 4 | r2rn1k1/3nqp1p/pp2p1p1/2p3N1/2P2P2/1P4P1/P1Q2PBP/2RR2K1 w | "With White to move, can you find a way to win material?" (12) | Bxa8 (bishop 3 for rook 5; engine +5.2 after the follow-up) | Rxd7: the board plays ...Qxd7 and the text says rook (5) for knight (3) is not a good trade. A refutation shown plus a numbers explanation. |
| 5 | 3r2k1/4np2/p5b1/1p5p/2pN2p1/P5P1/1P2PP1P/R1N3K1 w | "White's knight on d4 is in trouble. Should White capture the pawn on b5, or is there a stronger defense for White?" (21) | e3 (defend the knight; engine -1.1 for White, best of the options) | Nxb5: board shows the knight lost; text "lost material by trading a knight (3) for a pawn (1)". Correct text explains that if the rook takes, White gains material. |

Shape [V]: the first Capturing Pieces lesson is a counting lesson that uses numbers in every wrong-answer text, two of five challenges are tactics where the "point count" is not the real reason (Rxd4 line, Bxa8 line); the last asks a "capture or defend?" question that anticipates the course's final lesson (Your Opponent's Move). Feedback quality here is the best seen in the 2018 beginner courses [I]. About 12 minutes with probes.

## Playing the Game, lesson 4 "The Language of Chess" (5 challenges, listed 3 min) [V]
Intro bubble (about 40 words) says squares have names (files a to h, ranks 1 to 8) and that a move is written with a letter for the piece plus the destination square, then sends the learner to the video. All five challenges are "play the move named in the prompt"; every prompt gives the move in notation, so the learner converts notation to action, never the reverse. No tactic or position of interest.

| # | Position | Prompt | Accepted | Wrong-answer feedback |
|---|---|---|---|---|
| 1 | 7k/8/8/4p3/P7/8/4P3/6K1 w | "White wants to march a pawn up the board. Play a5." (11) | a5 | e4: "this does not move a pawn to the a5 square" (accurate here). |
| 2 | 4r2k/1p4p1/p7/P4p2/5P2/6P1/1P6/3R2K1 w | "White would like to attack the b7-pawn by playing Rd7. How can you do that?" (15) | Rd7 | Rd6: "does not move a rook to the d7 square". |
| 3 | 8/4k3/8/8/8/8/R6P/6K1 w | "White wants to cut the black king off from the f-file. Play Rf2!" (13) | Rf2 | not tested. |
| 4 | 6k1/8/8/8/7B/8/8/3Q2K1 w | "White can move two pieces to d8. Play Qd8!" (9) | Qd8+ (bishop and queen both reach d8) | Bd8: "this is Bd8, or bishop to d8. We want to play Qd8." Names the move the learner actually made in notation. |
| 5 | 6k1/8/8/8/8/2N3N1/8/6K1 w | "White can move two knights to e4. Play the knight from the g-file to e4, which is Nge4." (19) | Nge4 | Nce4: "right square, wrong knight! You moved the knight on c3 to e4, known as Nce4. We want to play Nge4." The same-destination ambiguity is the first disambiguation example. |

What it teaches [V]: only the piece letter plus square form, the file-letter disambiguation (in challenge 5, by being told), and nothing about captures (x), check (+), castling (O-O) or the move-number layout of a scoresheet; the lesson ends after 5 moves. Best part [I]: wrong-answer text echoes the learner's move back in notation, so the learner sees how their own move is written. About 8 minutes with probes.

## Playing the Game, lesson 5 "Playing a Game" (slug a-master-chess-game; 5 challenges, listed 3 min) [V]
The first model game for a beginner: the whole lesson is one short game played out in five prompts, the learner always playing White, opponent moves automatic. Intro bubble (about 15 words) points to the video "with all moves explained"; the interactive part then re-plays the game. Ends on a mate the learner delivers; no game afterwards.

| # | Position before the learner's move | Prompt | Accepted | Notes |
|---|---|---|---|---|
| 1 | start position | "Let's start the game by advancing the e-pawn into the center." (12) | e4 (...d5), then exd5 (...Qxd5): two learner moves | Wrong test a3: "there are many playable first moves, but let's start by advancing the pawn in front of the king two squares forward" (tells the answer in words). Black "has played the Scandinavian Defense" (named once). |
| 2 | rnb1kbnr/ppp1pppp/8/3q4/8/8/PPPP1PPP/RNBQKBNR w | "How can White develop a piece and attack the black queen?" (11) | Nc3 (...Qd8), then Nf3 | Wrong test Nf3: "there is a better option, look for a way to develop a piece and attack the black queen". |
| 3 | rnbqkb1r/ppp1pppp/5n2/8/8/2N2N2/PPPP1PPP/R1BQKB1R w | "How should White develop another minor piece to control the center?" (11) | Bc4 (only one tried; others untested) | Praise says White "is ready to possibly castle soon" (the course never reaches castling in this game). |
| 4 | rn1qkb1r/ppp1pppp/5n2/5b2/2B5/2N2N2/PPPP1PPP/R1BQK2R w (Black has played ...Bf5) | "How can White centralize the f3-knight and threaten a quick checkmate?" (12) | Ne5 | The prompt names the idea (threaten a quick mate) but not the target (f7). |
| 5 | r2qkb1r/ppp1pppp/2n2n2/4Nb2/2B5/2N5/PPPP1PPP/R1BQK2R w | "Black's last move was a huge mistake and White can now win the game. Try to find a checkmate." (18) | Bxf7# (engine: mate in 1) | Nxf7 (engine +4.2, strong): red cross, "there is a checkmate, but that is not it". Final: "A quick win and a well-played game!" Checkmate/Winner banner. |

Shape [V]: the closest thing in the beginner free path to our guided real game, but it is a scripted 8-move game with a hanging mate, only five learner decisions, no opponent choice and no game afterwards [I]. All the white moves are fixed; no black alternatives are shown. About 10 minutes with probes.

### Playing the Game, lesson 3 "Finding the Right Move" (about 4 min, 5 challenges) [V]
Frame: intro card says to weigh your own options and the opponent's, checking checks, captures and threats. Free, no limit wall.

| # | FEN (board, side) | Prompt (paraphrase) | Accepted | Wrong test and feedback |
|---|---|---|---|---|
| 1 | 5rk1/5pp1/8/Q5q1/8/8/5P1P/5RK1 w | How should White escape the check? | Qxg5 | Kh1: "Black wins a queen", look for a capture |
| 2 | 6k1/6pp/7r/7Q/8/7P/3q2PK/8 w | Mate in 1 | Qe8# | Qg4: a stronger queen move wins at once |
| 3 | rnbqk1nr/pppp1ppp/8/2b1p3/4P3/5N2/PPPP1PPP/RNBQKB1R w | What should you capture? | Nxe5 (engine +1.5, best) | not tested |
| 4 | 7k/3R2pp/8/8/8/6N1/5PPP/2r3K1 w | How should White escape the check? | Nf1 (engine +6.2; Rd1 is -0.1) | Rd1: "Black wins the rook", find a better block; board shows the refutation. Success text: the knight is defended by the king |
| 5 | 6k1/1b4pp/3p4/3N4/r7/2P3P1/7P/5RK1 w | Prompt hints a black king in the h8 corner would allow mate; find the best move | Ne7+ then Rf8# (two-step; reply Kh8 played automatically) | Nb4: "much stronger move". Pressing the hint bulb: "find a knight move that forces the king into the corner" |

Observations [V]: the lesson mixes three ideas (escape check by capture/block, take the free piece, find the forcing mate) in 5 challenges. Wrong-move text names the consequence for escapes (queen/rook lost) and is generic for sound-but-weaker moves. Ending: a Lesson Complete modal with one Finish button. Engine confirmed all five answers as best [V, Stockfish].

### Intro to Book Openings, lesson 2 "d4 Openings for Beginners" (White; listed 3 min, 5 challenges) [V]
Frame: a short explainer-video intro card (text: 1.d4 is the second most popular start; main line is the Queen's Gambit, 1.d4 d5 2.c4 e6 or c6). Then five challenges that are really one repertoire line replayed against different Black replies. One move prompt in a challenge, with the opponent's reply played automatically and a Next (or hint bulb) step between your moves. Each success message explains the idea and names the Black reply (for example, "Queen's Gambit Declined").
- c1 (start position): 1.d4. Black answers 1...h6 (a poor move); you play 2.e4 ("place both pawns in the centre if allowed").
- c2 (after 1.d4 d5): 2.c4. Wrong test Nf3: red, text says it does not attack d5 with the c-pawn (specific, yet Nf3 is a sound move: opening lessons enforce the book move). After 2...dxc4 you play 3.e4 (Black accepts the gambit).
- c3 (Black replies 2...g6 style, a pawn takes d5): cxd5 then Nc3 (hint text says the b1 knight attacks the queen), then e4 (hint says "the pawn in front of the king, two squares").
- c4: replays 2.c4 and Black now declines with ...e6. Wrong test Nf3 gave ORANGE "is an alternative": good, but develop the other knight now. Then Nc3, and Bg5 (pin on f6; hint names the bishop and the pin).
- c5 (after ...Be7): e3 (protect d4, open the light bishop), Black castles, Nf3. Ending: Lesson Complete modal.
Observations [V]: the opponent varies replies between challenges (weak, accepted, declined), so one lesson shows three branches. The hint bulb text escalates from idea to piece to square (here the first hint already names the piece). Orange alternative is used for a sound move that is not the line being taught, red for a move that fails the stated task. Nothing here was engine-checked (book moves, not claims); no claim that chess.com is wrong.

### Intro to Book Openings, lesson 3 "Defending Against e4: e5 and the Sicilian" (Black; 5 challenges) [V]
Format as lesson 2: explainer card, then one line per challenge; the learner plays Black, the opponent's replies are automatic. Lines: c1 1...e5, exd4 (after 2.d4), Nc6 hitting the queen; c2 3.Nf3 with ...Nf6, d6, Nxe4 (Petrov line; wrong test Nc6 was ORANGE "most popular move, we look at it next"); c3 Italian: Bc5, then after 4.Ng5 Qxg5 wins a piece ("Is anything protecting the knight?" hint); c4 Nf6 and O-O; c5 Sicilian: c5, Nc6, cxd4. Hints escalate idea, piece, square. Success text names the opening idea ("fights for d4") and, for c3, calls 4.Ng5 "weak but dangerous". Difficulty: all moves are book moves; c3 is the one tactic. Ends with the Lesson Complete modal. Engine not needed for book moves; no chess.com claim disputed.

## Intro to Book Openings, lesson 4: defending against 1.e4 (French, Caro-Kann, Scandinavian) [V seen, 8 Nov 2026]

Five challenges, all played as Black (board flipped), one per opening line, each a short guided sequence in which the opponent replies are auto-played.

| Ch | Line taught | Moves asked of the learner | Feedback seen |
|---|---|---|---|
| 1 | Scandinavian | 1...d5, then 2...Qxd5 | Text notes Nc3 gains a tempo on the queen; one hint step returned "No hint available" |
| 2 | French | 1...e6, 2...d5, 3...exd5 | Each correct move gets a one-line reason; "pawn or queen?" prompts steer the recapture |
| 3 | French Advance | ...c5 against the e5 pawn chain | Reason given: attack d4, the pawn that holds e5 up |
| 4 | Caro-Kann Exchange | 1...c6, 2...d5, 2...cxd5 | Recapture with the pawn is explicitly the point |
| 5 | Caro-Kann Advance | ...d5, then ...Bf5 | Reason: develop the light bishop before closing it in with ...e6 |

Observations
- Format is pure move-recall of main lines with a reason per move; no wrong-answer branching was needed to progress. [V]
- The hint ladder is one short sentence naming the piece and the idea, not the move. [V]
- Pressing Next before moving opens a hint (as in earlier lessons). [V]
- The lesson ends with the "Lesson Complete!" modal and a Finish button; no game or quiz follows. [V]
- Difficulty: lesson 2 (d4 for White) and 3 (e4 for Black) are the same recall style; lesson 4 adds the idea "which pawn/piece recaptures" and a plan-level reason, still one-move answers. [I]

## Intro to Book Openings, lesson 5: defending against 1.d4 (d5 and Nf6) [V seen, 8 Nov 2026]

Five challenges as Black. The opponent's replies are auto-played; the learner supplies only Black's moves.

| Ch | Line | Learner moves | Notes |
|---|---|---|---|
| 1 | 1.d4 | ...d5 | Open prompt ("take control of the center"); reason: stops e4 |
| 2 | Queen's Gambit Declined, exchange | ...e6, then ...exd5 | The recapture prompt asks which pawn; hint "put a pawn back into the center" |
| 3 | QGD with 3.Nc3 | ...e6, ...Nf6 | Hint names the g8 knight outright |
| 4 | QGD with Bg5 pin | ...Nf6, ...Be7 | Reason: unpin the knight from the queen; hint says "between the knight and queen" |
| 5 | Slav | ...c6 | Framed as the alternative to ...e6; lesson ends straight after the one move |

- Lesson ends on the Lesson Complete modal and Finish; no game or quiz. [V]
- Challenges 2 and 4 repeat the same opening move with a new starting point (restating the previous move as the prompt), a spaced-repeat pattern inside one lesson. [V]
- Course shape (Intro to Book Openings, 5 lessons): L1 what an opening is, L2 d4 as White, L3 e4 as Black, L4 French/Caro-Kann/Scandinavian, L5 d4 defences. Difficulty is flat: each is guided main-line recall with one-move answers, growing from 1-2 moves to short sequences of 3-4. No end-of-course game or test observed (the lesson list page was the only "next" cue). [V partly; I for difficulty]

## Playing the Game, lessons 6 (Stalemate) and 7 (Other Draws) [V seen, 8 Nov 2026]

Both lessons are 5 challenges of "find the drawing move for the losing side". The learner is always White; the opponent's reply is auto-played. All positions below were checked for legality; the forced lines in L7 c5 were verified with python-chess [V rules].

| Lesson / Ch | FEN (before the move) | Prompt idea | Accepted | Notes |
|---|---|---|---|---|
| L6 c1 | k1q5/p2K4/P7/8/8/8/8/8 w | End the game in stalemate | Kxc8 | Wrong test Ke7: red, "better move, look for a good capture" |
| L6 c2 | 8/8/6pk/8/6P1/8/2q5/K7 w | Save the game with stalemate | g5+ | Check forces a stalemate whatever Black plays |
| L6 c3 | 8/3p4/1Pp5/1pP3p1/7p/5k1P/5P1K/3r4 w | Is it stalemate? If not, find a legal move | b7 | Trap prompt: the position is NOT stalemate, a pawn can still move; pawn-moves are easy to miss |
| L6 c4 | 8/8/8/8/8/7k/5Kp1/8 w | Stop the pawn, likely draw | Kg1 | Text says Black's only pawn-protecting move is stalemate |
| L6 c5 | 8/8/8/8/8/5p2/5P1p/4K2k w | Immediate stalemate | Kf1 | Position ends the lesson at once |
| L7 c1 | 6k1/6q1/8/8/8/8/1Q5K/8 w | Force a draw at once | Qxg7+ | Queen trade leaves bare kings (no mating material) |
| L7 c2 | 8/8/6kp/1p1p1p1p/1P1P1Pp1/6PP/K7/8 w | Block so no pawn can move | h4 | Fortress/blocked-position draw |
| L7 c3 | 8/Pk6/2r5/3K4/8/8/8/8 w | Trick to force a draw | a8=Q+ then Kxc6 | Two learner moves; the second is prompted after the king takes the queen |
| L7 c4 | 8/8/8/K7/R7/1b6/pk6/8 w | Rook sacrifice forces a draw | Rxa2+ | K+B vs K cannot mate |
| L7 c5 | 5rk1/8/Q7/3p2p1/8/4q3/8/7K w | Perpetual check | Qg6+, then Qh6+ | Forced: Kh8, Qh6+, Kg8, repeat [V rules] |

Interface observations
- Promotion: the first click on the target square opens a vertical picker over the file; the queen icon must be clicked near its centre (a click at the very edge of the board dismissed it silently, no feedback). [V]
- Red feedback on a wrong move is a short sentence with a nudge ("look for a good capture"), then the Retry button. [V]
- Finish returned to the chess.com home page rather than to a next lesson. [V]
- Difficulty and ending: both lessons stay at 1-2 move answers; the twist across L6 is the "is it really stalemate?" negation (c3); L7 adds second-move follow-ups (c3, c5). No game or quiz follows the course at lesson level. [V]

## Opening Principles, lessons 1 (Control the Center) and 2 (Develop Your Pieces) [V seen, 8 Nov 2026]

Format: five guided challenges per lesson, short explainer-style prompts, opponent replies auto-played. The first Start screen shows a board with an "Explainer Video" button.

| Lesson / Ch | Position (FEN before the move) | Prompt idea | Accepted | Notes |
|---|---|---|---|---|
| L1 c1 | rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b | Copy White: pawn to e5 | e5 | Wrong test a6: red, text says many moves are fine but we are asked for the e-pawn to e5, then Retry |
| L1 c2 | start position w | Put a pawn in the middle | e4, then d4, then dxe5 | Opponent plays ...a6 then ...e5; the lesson shows the punishment of slow play (win a pawn) |
| L1 c3 | rnbqkb1r/pppppppp/5n2/8/4P3/8/PPPP1PPP/RNBQKBNR w | Attack the black knight | e5 | Wrong test Nf3: "better move, attack it with a pawn" |
| L1 c4 | r1bqkb1r/ppp1pppp/2n5/3n4/3P4/5N2/PP2PPPP/RNBQKB1R w | Occupy the center with two pawns | e4 | Sequence continues from an Alekhine-like line |
| L1 c5 | rnbqkb1r/ppp2ppp/4p3/3n4/3P4/5N2/PP2PPPP/RNBQKB1R w | Occupy center and attack the knight | e4 | Same idea in a second line |
| L2 c1 | rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w | Best square for the g1 knight | Nf3 | Wrong test Nh3: red "we are asked to develop to the best square". Correct text cites "by far the most popular" move [stat claim not checked here] |
| L2 c2 | after 2.Nf3, Black to move | Develop a knight and defend e5 | Nc6 | |
| L2 c3 | after 3.Bc4 | Develop the bishop toward the center | Bc5 | |
| L2 c4 | r2qkb1r/pppb1p1p/2np2p1/4p1Nn/2B1P3/2NP4/PPP2PPP/R1BQR1K1 w | Check, then checkmate | Bxf7+ then Nd5# | Engine: Bxf7+ Ke7 Nd5# is mate in 2 [V engine]. The lesson auto-plays ...Ke7 |
| L2 c5 | r1bqkbnr/pppp1ppp/2n5/4p2Q/2B5/4P3/PPPP1PPP/RNB1K1NR b | Kick the bishop and block the mate threat | d5, then Nf6 | After ...d5 White retreats Bf1; the learner then plays Nf6 hitting the queen |

Observations
- Wrong-answer feedback in these early lessons is very gentle: it restates what is being asked ("we are asked to...") rather than saying why the move is bad. [V]
- A hint is a longer sentence than later courses (it names the piece and the aim). [V]
- Each lesson mixes an opening-principle statement, a short line of recall, and one tactical payoff (L1 c2 wins a pawn; L2 c4 is a mate) so the principle shows its consequence. [V]
- Difficulty: L1 asks one idea (pawns to the center) repeatedly in 3 positions; L2 moves from developing moves to a 2-move mating pattern, still guided. [V for contents, I for the climb]
- The lesson ends with the "Lesson Complete" modal; no game or quiz follows. [V]

## Playing the Game, lesson 2 (The Goals of Chess) [V seen, 8 Nov 2026]

A review lesson with a different launch screen: no Explainer Video button, a single green Start lower on the panel, and an intro line about captures, check and checkmate. A click on it caused the page to write to the OS clipboard (the harness flagged it).

| Ch | FEN (before the move) | Prompt idea | Accepted | Notes |
|---|---|---|---|---|
| 1 | 6k1/5pp1/3b1n1p/1p6/1P1R4/6PP/5P2/6K1 w | Which piece can White capture? | Rxd6 | Free bishop |
| 2 | 6k1/6p1/7p/2Q5/8/6P1/5P1P/4r1K1 w | King in check, get to safety | Kg2 | Only legal reply [I from rules]; the c5 queen cannot block |
| 3 | 6k1/5pp1/3Q3p/3b4/8/6P1/5PKP/2r5 w | Bishop checks, best way out | Qxd5 | Capture the checker |
| 4 | 6k1/1p3pp1/p5q1/8/7R/7P/3Q1PP1/6K1 w | Queen or rook check: which is mate | Qd8# | Black Qg6 cannot reach the back rank; Rh4 covers h7 |
| 5 | 3k4/R7/1R6/8/8/7P/3q2PK/8 w | Several checks, one is mate | Rb8# | Ladder mate |

Ends with the Lesson Complete modal. Difficulty: capture, escape check, capture the checker, then two choose-the-mate puzzles; all 1 move. [V]

## Winning with Tactics, lesson 1 (Sacrificing to Win) [V seen, engine-checked, 8 Nov 2026]

Five challenges; the learner always finds the sacrifice and then the follow-up with opponent replies auto-played. Hints are one sentence naming the idea (for example "what is the only check?", "fork the king and rook", "capture the rook").

| Ch | FEN (before the move) | Prompt idea | Learner moves | Engine |
|---|---|---|---|---|
| 1 | r1b2rk1/p1q2ppp/1p6/8/8/QP3N2/P3RPPP/4R1K1 w | Sacrifice that forces mate | Qxf8+, then Re8# | mate in 2 [V engine] |
| 2 | rnbqkb1r/pp2n1pp/2p2p2/4p3/2B1P3/2N2N2/PPP2PPP/R1BQK2R w | Sacrifice that wins the battle | Bxf7+, then Qxd8 | Bxf7+ is the top move, +6 [V engine] |
| 3 | 8/7k/1p3p2/pPr3pp/P7/6P1/2b2PBP/2R3K1 w | Sacrifice to set up a fork | Rxc2, Be4+, Bxc2 | Rxc2 top, +6 [V engine]; three learner moves |
| 4 | q6k/5p1b/1p2rP1p/4B1pP/2Q3P1/p7/P6K/4R3 w | Clear the pawn out of the bishop's path | Qxe6, then f7# | Qxe6 top, +6.7; f7# is mate in 1 [V engine]; discovered check by a pawn push |
| 5 | 1r5k/1p4pp/2p5/6r1/PP1QpP2/5bP1/5P2/1RR3K1 b | Black has sacked a queen, make it work | Rh5, then Rh1# | mate in 3 [V engine] |

Observations
- Difficulty climbs by sequence length (c1 two moves, c3 and c5 three, c4 hides a queen sacrifice and a discovered check) rather than by new concepts; each prompt tells the learner it is a sacrifice. [V]
- c2's feedback explains why the bishop sacrifice works (the king is dragged off the queen's protection). [V]
- Ends with the Lesson Complete modal; no game or quiz. [V]
- Tooling note: a button click through the page DOM (find the Start button, call click) avoids the clipboard write that a synthetic mouse click can trigger. [V]

## Winning with Tactics, lesson 4 (Discovered Check) [V seen, engine-checked, 8 Nov 2026]

| Ch | FEN (before the move) | Prompt idea | Learner moves | Engine |
|---|---|---|---|---|
| 1 | 1kr5/pp3p2/2p3bp/4R2p/8/2P3BP/PP3PP1/6K1 w | Any rook move discovers check, find the best | Re8+, then Rxc8# | mate in 2 [V engine]; Re8+ is a double check |
| 2 | 6k1/pp4bp/6p1/8/3P4/PN5P/BPr3P1/7K w | Which discovered check wins material | Na1+, then Nxc2 | top move, about +5 [V engine] |
| 3 | r1bqkb1r/pppp1ppp/2nn4/1B2N3/8/8/PPPP1PPP/RNBQR1K1 b | Black prevents a deadly discovered check on the e-file | Be7 | Be7 is the engine's first choice (about -1.2); Nxe5 is a close second (-1.4) [V engine]. Whether Nxe5 is accepted was not tested |
| 4 | 2r1r2k/4q1p1/p2b1pp1/1p6/5P2/1BP1P1n1/PP3Q1P/2K4R w | How should White capture on g3 | hxg3# | mate in 1; Qxg3 is only about -6 [V engine] (the pawn capture discovers the rook's check) |
| 5 | 5r1k/3n1p2/8/4p3/3pP3/3P3K/1rP5/6RR w | White is a piece down but the king is exposed | Kg4+, then Kf5# | mate in 2 [V engine]; a king move uncovers rook checks twice |

Observations
- c3 is a defensive item inside an attacking lesson: the learner must see the opponent's threat, a recurring pattern in Chess.com's tactics courses. [V]
- Hints are short and name the idea ("find mate in one", "capture the rook", "move the king again to discover a checkmate"). [V]
- Difficulty: c1 gives away the theme in the prompt; c3 hides it (defence); c4 and c5 ask the learner to find the capture or king move that discovers the check without being told. [V]
- Ends with the Lesson Complete modal. [V]

## Winning with Tactics, lesson 5 (Double Check) [V seen, engine-checked, 8 Nov 2026]

All five challenges are "find the double check that mates", the last four with a quiet follow-up move for the learner. Every answer matches the engine's top line.

| Ch | FEN (before the move) | Learner moves | Engine |
|---|---|---|---|
| 1 | 1rbk4/5p1p/p6p/1qp5/8/P5P1/1PPB1P1P/2KRR3 w | Ba5# | mate in 1 [V engine] |
| 2 | rn1qkbnr/ppp2ppp/8/8/4Np2/5b2/PPPPQ1PP/R1B1KB1R w | Nf6# | mate in 1 (knight plus queen on the e-file) [V engine] |
| 3 | 3r1nk1/3P3p/pp3q2/2p1p3/P1P3B1/3b2R1/1P5P/6K1 w | Be6+, then Rg8# | mate in 2 [V engine] |
| 4 | 7k/1pb3p1/p1p3p1/2P1n3/2P5/1P5P/6PK/4R1R1 b | Ng4+, then Nf2# | mate in 2 [V engine]; Black this time |
| 5 | r5k1/1b2Pp1p/3n4/1p5p/8/1PR2P2/rB5P/5R1K w | Rg1+, then Rc8# | mate in 2 [V engine]; the closing Rc8# is the double check |

Observations
- No wrong-answer tests were run in this lesson (all answers are single clear mates). [V]
- The "hint" ladder repeats the phrase "only check in the position" when only one check exists, a teachable habit (list the checks). [V]
- Difficulty: c1-c2 mate in one, c3-c5 mate in two with the double check either first or last. The lesson is 2 minutes by the listing but took longer to play. [V]
- Ends with Lesson Complete and Finish. [V]

## Winning with Tactics, lesson 6 (Remove the Defender) [V seen, engine-checked, 8 Nov 2026]

| Ch | FEN (before the move) | Prompt idea | Learner moves | Engine |
|---|---|---|---|---|
| 1 | 3r1rk1/1pb2ppp/p1q1n3/2p5/2P2P2/1P4Q1/PB4PP/4RR1K w | The knight on e6 guards g7, remove it | Rxe6, then Rxc6 | Rxe6 +6.2, then Rxc6 +6.2 [V engine]; Bf6 is -5 |
| 2 | 5b2/7K/6P1/5k2/7B/8/8/8 w | Remove the bishop that stops g7 | Be7, then g7 | Be7, Bd8 and Be1 all +6.9 [V engine]; only Be7 was tested (accepted) |
| 3 | rn1qkb1r/pp2pppp/2p2n2/4N2b/2BP4/2N4P/PPP2PP1/R1BQK2R w | The h5 bishop keeps Black together | Qxh5 (queen sacrifice), then Bxf7# | Qxh5 +8.9; after ...Nxh5, Bxf7# is mate in 1 [V engine] |
| 4 | 4r2k/1pp3p1/2n5/8/3b1P2/6P1/1PR4P/3R1K2 w | Remove the defender of the bishop | Rxc6, then Rxd4 | Rxc6 +3.7 [V engine]; wins a piece, not a mate |
| 5 | 8/3PkP2/8/8/1b6/5B2/6K1/8 w | Which pawn promotion wins | f8=Q+, then d8=Q+ | f8=Q+ +8.7; f8=R +4.1, f8=B+ +3 [V engine] |

Observations
- c3 mixes in a queen sacrifice to remove the guard (feedback says Black "greedily captures"), a nice demonstration that sacrificing is allowed when the follow-up is forced. [V]
- c5 asks "which pawn promotion wins", so the learner must also choose the piece. The promotion picker puts the queen first and needs a click near the top of the file column (clicking on the board edge dismisses it with no message). [V]
- Hints: "capture an undefended piece", "push the pawn", "use the strength of your knight and light-squared bishop". [V]
- Difficulty: material-winning and promotion tasks, mate at c3; all feedback is positive with one explanation sentence. [V]

## Winning with Tactics, lesson 7 (Smothered Mate) [V seen, engine-checked, 8 Nov 2026]

The lesson teaches one pattern (queen sacrifice or knight check into a boxed-in king) in escalating length. Multi-move challenges accept consecutive moves without pressing Next between them; opponent replies are auto-played. Learner moves are listed in order.

| Ch | FEN (before the move) | Learner moves | Engine |
|---|---|---|---|
| 1 | 1q3r1k/6pp/7N/8/8/1Q6/6PP/7K w | Qg8+, then Nf7# | mate in 2 [V engine] |
| 2 | 1qr4k/6pp/8/6N1/8/8/Q5PP/7K w | Nf7+, Nh6+ (double check), Qg8+, Nf7# | mate in 4 [V engine]; the full smothered-mate ladder |
| 3 | r1bqkb1r/pp1npppp/2p2n2/8/3PN3/8/PPP1QPPP/R1B1KBNR w | Nd6# | mate in 1 [V engine]; the Caro-Kann trap |
| 4 | r1bqk2r/pppp1ppp/2n5/4n3/1bP2B2/P4N2/1P1NPPPP/R2QKB1R b | Qe7 (told), then Nd3# | the prompt hands over Qe7; after White takes the bishop Nd3# is mate in 1 [V engine] (Legal-style trap) |
| 5 | rk5r/ppp1bq1p/2n5/2N3B1/3p2Q1/8/PPP2PPP/R5K1 w | Nd7+, Nb6+, Qc8+, Nd7# | mate in 4 [V engine] |

Observations
- c2 and c5 are the same ladder at two difficulty levels; c2 shows it with the final shape, c5 hides it in a middlegame position, which is a clear spaced-repeat design. [V]
- Feedback after each step tells the learner what the previous move did and what the next idea is ("double check forces the king to h8"). [V]
- c4 gives the first move (Qe7) in the prompt: the learner's real task is to see the smothered mate after the opponent takes the bait. [V]
- Ends with Lesson Complete. [V]

## Winning with Tactics, lesson 8 (Deflection) [V seen, engine-checked, 8 Nov 2026]

| Ch | FEN (before the move) | Prompt idea | Learner moves | Engine |
|---|---|---|---|---|
| 1 | 1k4r1/p1p5/1p6/8/8/5Qq1/6P1/4R1K1 w | Deflection to win material | Re8+, then Qxg3 | +4.7; the rook check drags the g8 rook off the defence of the queen [V engine] |
| 2 | 5bk1/p4qpp/1p6/2pQ4/8/P6P/2B2PP1/6K1 w | Win the queen by deflecting the king | Bxh7+, then Qxf7 | +8.9 [V engine] |
| 3 | 1b4rk/1Q3R1p/8/2pN4/2P5/r6B/P3n1P1/7K b | Deflect the g2 pawn | Rxh3+, then Rg1# | mate in 2 [V engine] |
| 4 | 7k/bp3rpp/p2q4/7N/2P5/1PQ2B2/PB4PP/7K b | Deflection, mate in two | Qd1+, then Rf1# | mate in 2 [V engine] |
| 5 | 3rr1k1/p3pp1p/1p3npQ/2q1N3/5R2/2P5/PP4PP/4R2K b | Deflect the only defender of the back rank | Qxe5 (one move only) | Qxe5 +6.5, best by engine [V engine]; the lesson ends here and does not play out the mate |

Observations
- The sacrifice is always a check or a capture that the opponent must answer; the feedback names the "deflected" piece each time. [V]
- Deflection lesson is the first where Black is the tactician in two consecutive challenges (3 and 4, then 5). [V]
- c5 explains "if White recaptures, then you can checkmate on the back rank", and the lesson completes without requiring the follow-up. [V]
- Ends with Lesson Complete. [V]

## Winning with Tactics, lesson 9 (Decoy) [V seen, engine-checked, 8 Nov 2026]

Every challenge is "force a piece onto a square where it will be forked". Sacrifice first, fork second.

| Ch | FEN (before the move) | Learner moves | Engine |
|---|---|---|---|
| 1 | 3R4/1kp5/8/4qPK1/1N6/8/8/8 w | Rb8+, then Nc6+ (the lesson ends at the fork, the queen capture is not played) | +7.6 [V engine] |
| 2 | 2r3k1/1b3pp1/p3p3/1p2N1q1/2n1P1P1/P2Q1PB1/1PP5/1K5R w | Rh8+, then Nxf7+ | +8.8 [V engine] |
| 3 | r1b2r1k/1pb3pp/2p5/p1n5/2B2q2/1P4NP/PB3PP1/R2QR1K1 w | Bxg7+, then Nh5+ | +6.9 [V engine] |
| 4 | 6k1/5p2/p1q5/3pbQ2/1P2r1P1/P2RB2K/8/8 b | Rxe3+, Qh6+, Qxe3 | +6.6 [V engine]; three learner moves |
| 5 | 8/5pkp/7p/3B4/p4P2/Pb4P1/3R2KP/r7 b | Ra2, then Bxd5+ | +6.1 [V engine] |

Observations
- The lesson ends a challenge as soon as the fork is on the board (c1, c2, c3, c5): the learner is not asked to cash it in. Time-to-finish is short even though each position is a full-board tactic. [V]
- Feedback always uses the word "decoyed" and states what the opponent lost ("a queen and a pawn for the sacrificed rook"), making the material trade explicit. [V]
- c4 hint is blunt ("capture White's rook") once the fork is made. [V]
- Ends with Lesson Complete. [V]

## Winning with Tactics, lesson 10 (Desperado and Zwischenzug) [V seen, engine-checked, 8 Nov 2026]

The course's last lesson. Learner moves are listed in order; only moves the lesson required are included. Several challenges end with a plain recapture, so the "in-between move" is the first one.

| Ch | FEN (before the move) | Prompt idea | Learner moves | Engine |
|---|---|---|---|---|
| 1 | 5k2/1p6/2p4n/8/2P5/1P6/3B1r2/6K1 w | Black took a rook on f2; what before recapturing | Bxh6+, then Kxf2 | Bxh6+ +6.3 against Kxf2 at 0.0 [V engine]: the desperado is worth a whole piece |
| 2 | 2r1r1k1/5ppp/4Q3/8/8/5N1P/1P4P1/q4R1K w | Both queens in danger | Qxe8+, then Rxa1 | +6.1 vs Qxf7+ at -2.9 [V engine] |
| 3 | 4q3/p3r1kp/2Q3p1/8/8/P7/1P3PPP/3r1RK1 w | A strong in-between move before recapturing the rook | Qc3+, then Rxd1 | Qc3+ +5.1 vs Qxe8 at -6.9 [V engine] |
| 4 | 5r2/2R2pp1/3qpn1p/pB1k1p2/P2P4/5PB1/1P4PP/6K1 w | Recapture at once or find a zwischenzug | Bc4+, then Bxd6 | Bc4+ +5.6 vs Bxd6 at +0.3 [V engine] |
| 5 | r5rk/ppN2p1p/5PpQ/5q2/1p3Rn1/1P6/P5PP/3R1K2 w | Desperado queen check that gains a rook | Qg7+, fxg7+, Rxf5, Nxa8 | +4.4 vs Rxf5 at +0.3 [V engine] |

Observations
- Wrong-answer test (c3, a deliberate Qd4 instead of Rxd1): red, "this does not capture Black's rook on d1 - try again", and the position resets with the learner back at the same prompt; pressing Next then restates the earlier prompt text. [V]
- The engine's recommended continuation sometimes differs from what the lesson plays: I expected the opponent to reply Rd4 in c3; the lesson actually asked for the recapture Rxd1 next. Auto-played replies are scripted, not engine-chosen. [V]
- Final-challenge feedback is a claim about the continuation ("White will be up a knight at the end"): after Nxa8 Ne3+ Ke1 Nxd1 Kxd1 White has a knight for two pawns, which the engine rates about +4.6 [V engine]; "up a knight" is a loose description of the pawn count, not an error.
- Ends with Lesson Complete. The course ends at Lesson 10 with no game, quiz or recommendation visible after Finish. [V]

### Winning with Tactics, how the course climbs [V seen / I]
- L1 and L2-L3 (earlier rounds) give a theme and the first move in the prompt; L4 to L10 each drill one named tactic with five positions, the last of which is usually a longer sequence (three or four learner moves).
- Position length grows within lessons (c1 two moves, c5 up to four) but across lessons stays the same: the course repeats "find the forcing sacrifice and the follow-up" with a different label each time (sacrifice, discovered check, double check, remove defender, smothered mate, deflection, decoy, desperado).
- Hints name the idea rather than the move; wrong answers carry a restating sentence. No lesson in this course used an unlabeled test: every prompt names the tactic or the goal. [V]

## Capturing Pieces, lesson 2 (Tactics and Hanging Pieces) [V seen, engine-checked, 8 Nov 2026]

Five one-move "capture the hanging piece" positions. Wrong-answer tests were not run in this lesson.

| Ch | FEN (before the move) | Prompt idea | Accepted | Engine |
|---|---|---|---|---|
| 1 | 7r/pk5p/1pp3p1/2b2p2/P1PB4/2P4P/5PP1/R5K1 w | Capture a hanging piece | Bxh8 (rook) | +5.3; the only other capture Bxc5 is about 0 [V engine] |
| 2 | 2k5/ppp4p/8/1BP3p1/PQ5n/2P4P/6P1/5q1K w | White's king looks in serious trouble | Bxf1 (queen) | Bxf1 +10; Kh2 would lose to Qxg2# [V engine]: the lesson makes the learner see that the check can be captured |
| 3 | r1bqk1nr/pppp1ppp/2n5/2b1p1N1/2B1P3/8/PPPP1PPP/RNBQK2R b | White attacks f7; anything hanging? | Qxg5 | +6.5; the alternative ...d5 is +2.5 [V engine] |
| 4 | r4rk1/2pn1ppp/1p2n3/8/2N5/6BP/PPP3P1/1K1RR3 w | Capture a hanging piece | Rxd7 | +5.9; Bxc7 is +3.8 [V engine] |
| 5 | r2qk2r/ppp2ppp/2n1p3/2bn4/Q5b1/2NP1NP1/PP2PPBP/R1B1K2R w | Capture a hanging piece | Qxg4 | +7.3 [V engine] |

Observations
- The feedback always states what was captured and that it was "unprotected", which names the check the learner should do (is it defended?). [V]
- c2 is the one "think before reacting" item: the opponent's last move is a check, and the answer is to capture the checker rather than move the king. [V]
- Difficulty: positions grow from near-empty (c1, c2) to a full middlegame (c5); no sequences, no auto-played reply needed. Ends with Lesson Complete. [V]

## Capturing Pieces, lesson 3 (Counting Captures) [V seen, engine-checked, 8 Nov 2026]

The lesson teaches attackers versus defenders on one square, from both sides (win material by capturing, or add a defender).

| Ch | FEN (before the move) | Prompt idea | Learner moves | Engine |
|---|---|---|---|---|
| 1 | rnb1kb1r/ppp2pp1/4pq1p/3p4/3PP3/2N5/PPP2PPP/R2QKBNR w | Win material | exd5, then Nxd5 | exd5 +0.45 [V engine]; wins a pawn and attacks the queen |
| 2 | 1r3rk1/5pp1/2p1pn1p/3p4/2PP4/4P1P1/1R3PBP/1R4K1 w | Win material | Rxb8, then Rxb8+ | Rxb8 +6.5 [V engine]; two rooks against one defender |
| 3 | r2qkbnr/ppp1pppp/8/3p1b2/1n1P1B2/5NP1/PPP1PP1P/RN1QKB1R w | The queen is c2's only defender, add a second | Na3 | Na3 is the engine's first choice (+0.14) [V engine] |
| 4 | 1r4k1/1p3p2/n1p1n1p1/8/2B3P1/1P4N1/PK3P2/4R3 w | A capture with more attackers than defenders | Bxe6, then Rxe6 | Bxe6 +1.2 [V engine]; wins one pawn only |
| 5 | 3r2k1/p5pp/bp3p2/3p4/3Q2n1/1P2P1Pq/PB1N1P1P/4R1K1 w | Black has two attackers on h2 and threatens mate: add a defender | Nf3 | Nf3 is the engine's first move but the position is still about -0.6 for White [V engine]; Qxg4 loses to Qxg4 |

Observations
- Hints and feedback speak in counts ("a second defender", "more attackers than defenders"), the vocabulary the lesson wants. [V]
- The reward size is honest: c4 only wins one pawn and the feedback says so ("wins a pawn due to good counting"). [V]
- c3 and c5 are defensive items, so the lesson switches between "attack the count" and "defend the count". [V]
- The learner never meets an unlabeled "is this capture good?" item in this lesson. Ends with Lesson Complete. [V]

## Capturing Pieces, lesson 4 (Forks) [V seen, engine-checked, 8 Nov 2026]

| Ch | FEN (before the move) | Prompt idea | Learner moves | Engine / notes |
|---|---|---|---|---|
| 1 | 6k1/P7/8/3q4/6N1/8/8/6K1 w | Game-winning fork | Nf6+, then Nxd5 | knight fork of king and queen; the feedback adds "we can promote our pawn next" [V] |
| 2 | 6k1/3r1p1p/3p3p/2p1p3/8/7P/5PP1/3Q2K1 w | Queen fork of king and rook | Qg4+, then Qxd7 | +7.8 [V engine] |
| 3 | r1bqkb1r/pppp1ppp/2n5/4p3/2B1N3/5N2/PPPP1PPP/R1BQK2R b | Black is down a knight for a pawn, find a fork | d5 (pawn fork), then dxe4 | d5 is the engine's top move (+0.1) [V engine] |
| 4 | r1bqkb1r/2p2ppp/p1np4/1p2p3/4n3/1BP2N2/PP1P1PPP/RNBQ1RK1 w | A fork after ...Nxe4 | Bd5 (attacks two unprotected knights); the challenge ends at the fork | +5.2 [V engine] |
| 5 | 8/3k1P2/6q1/8/8/8/6PP/7K w | Make the queen disappear with a surprising fork | f8=N+, then Nxg6+ | underpromotion; f8=Q was tested and is red [V] |

Observations
- Wrong-answer sample: choosing a queen in c5 gave a red "is incorrect" whose text says promoting to a queen is tempting but the king is in trouble, then asks for a different piece. The opponent's reply (Black queen check) was already played on the board. Retry restores the position. [V]
- c4's feedback calls the fork explicitly and ends the challenge without making the learner cash in. [V]
- Piece mix: knight (c1, c5), queen (c2), pawn (c3), bishop (c4). One fork carrier per challenge, which is the lesson's "variety" design. [V]
- Ends with Lesson Complete. [V]

## Capturing Pieces, lesson 5 (Pins) [V seen, engine-checked, 8 Nov 2026]

Each challenge is one move; the feedback states the pin in plain words ("the knight on c3 is pinned to White's king").

| Ch | FEN (before the move) | Prompt idea | Accepted | Engine |
|---|---|---|---|---|
| 1 | 6k1/6pp/4q3/8/8/8/4B1PP/2R4K w | Queen threatens the bishop; a pin that wins the queen | Bc4 (pins queen to king, protected by the rook) | +7.7 [V engine] |
| 2 | r1b1kb1r/1pp2ppp/p1p2n2/8/4q3/5N2/PPPP1PPP/RNBQ1RK1 w | The e-file is open, pin the queen | Re1 | the position's idea is the pin; engine not run on this one |
| 3 | 7k/5p1p/1B4p1/P3b3/5Q2/7P/6PK/4q3 w | White's queen is pinned, find a pin that saves it | Bd4 (pins the bishop to the king) | Bd4 is the top move (+0.3); Qxe5+ is -7.4 [V engine] |
| 4 | rn1qk1nr/pbpp1ppp/1p2p3/8/1b1PP3/2N5/PPP1NPPP/R1BQKB1R b | Win material using the pin | Bxe4 (the pinned c3 knight cannot recapture) | top move (+0.4) [V engine]; wins a pawn only |
| 5 | rn1qkb1r/pp1bpp1p/3p2p1/1B6/3NP1n1/2N1B3/PPP2PPP/R2QK2R w | The d7 bishop is pinned | Qxg4 (wins the knight) | +6.1 [V engine] |

Observations
- c1 is a "winning a queen" pin, but a pinned queen can still capture the pinner; the lesson's own wording is "White will win material", and the engine says +7.7 because the queen is lost for a bishop at best. [V engine / I]
- c3 reverses the usual direction: the learner's queen is the pinned piece and the defence is a counter-pin. [V]
- Moves are short and the lesson does not test a wrong answer in these five. Ends with Lesson Complete. [V]

## Capturing Pieces, lesson 6 (Piling Up) [V seen, partly engine-checked, 8 Nov 2026]

Theme: add attackers to a pinned piece until it falls. Several challenges run two or three learner moves because the opponent defends in between.

| Ch | FEN (before the move) | Learner moves | Notes |
|---|---|---|---|
| 1 | 5k2/6pp/4pn2/8/3pP3/7P/6P1/5RK1 w | e5, then exf6+ | Hint after the first move: "capture the knight without losing your rook"; Black's king sidestep is auto-played [V] |
| 2 | 7k/3n3p/4p2p/3pn2b/1P1B4/2P2P2/3N2P1/6K1 w | f4 (the challenge ends here) | f4 is the engine's top move at +1.0 [V engine]; a modest edge, not a won position |
| 3 | 8/4k3/2p1b3/1rp5/3p4/3P1N1P/5PP1/4R1K1 w | Ng5, then Nxe6 | Ng5 +5.9 [V engine]; the king steps out of the pin and the knight takes anyway |
| 4 | r1bq1rk1/ppp2p1p/2np1np1/2b1p1B1/2B1P3/2NP1N2/PPP2PPP/R2Q1RK1 w | Nd5, then Bxd8 | Nd5 +6.9 [V engine] |
| 5 | k4r2/p1n4p/1p3p2/2pn4/2N5/1P3B1P/P1P2PRK/8 w | Ne3, then c4 (third attacker) | Ne3 +5.9 [V engine]; the "pawn power" hint names the c-pawn without giving the square |

Observations
- The feedback counts attackers and defenders aloud ("adds a second defender... a third attacker"), tying back to the Counting Captures lesson. [V]
- c2 hint and finish: the challenge ends after one learner move with a pawn push that sets up the capture, so the lesson rewards the setup move, not the win. [V]
- Claims inside feedback ("a great trade for White" in c4, "White will win a piece" in c5) were not engine-checked beyond the first move. [I]
- Ends with Lesson Complete. [V]

## Capturing Pieces, lesson 7 (Skewers) [played 8 Nov 2026]

Theme: attack the more valuable piece so it must move, then take the piece behind it. Every challenge is a two-move sequence (the skewer, then the capture); the opponent's step is auto-played.

| Ch | FEN (before the move) | Learner moves | Notes |
|---|---|---|---|
| 1 | 8/8/4k3/8/8/pq6/6QP/7K w | Qg8+, then Qxb3 | Qg8+ then Qxb3 is +14.7 [V engine]; feedback says the king "has moved, capture the queen" [V] |
| 2 | 8/7p/p6B/2p1k3/P7/6P1/1r3P2/5RK1 w | Bg7+, then Bxb2 | +8.6 [V engine]; the bishop skewers king and rook along a diagonal [V] |
| 3 | 2n5/1r4k1/p4p2/4b1p1/8/3B2P1/4NPK1/7R w | Rh7+, then Rxb7 | Prompt asks for the BEST skewer; Rh7+ is the only checking move and the engine's top (+6.1) [V engine]; feedback notes the rook is protected by the bishop, so the king cannot take it [V] |
| 4 | 8/3r2p1/8/2p2k2/1pP5/1P5P/4B1P1/6K1 w | Bg4+, then Bxd7 | +4.3 [V engine]; the one quiet alternative Kf2 evaluates around -3.9 [V engine] |
| 5 | 8/8/8/3p4/3k3B/6RP/6PK/q7 w | Bf6+, then Bxa1 | +7.8 [V engine]; the closing prompt is the open "How can White use a skewer", with the piece-grab only hinted by the on-board line [V] |

Observations
- All five challenges are the same two-move shape; difficulty rises only through board clutter (c1 is a bare endgame, c3 and c4 add defenders and extra pieces to look past). [V]
- Only c3 has an explicit "best" framing, which teaches that a skewer needs a protected checking piece. [V]
- Ends with Lesson Complete and Finish. [V]

## Capturing Pieces, lesson 8 (Avoiding Bad Trades) [played 8 Nov 2026]

Theme: choose which piece or pawn to trade with, and which recapture to use. Prompts are open ("find a good trade", "best way to capture"), and the feedback explains the reason in terms of value or structure.

| Ch | FEN (before the move) | Learner moves | Notes |
|---|---|---|---|
| 1 | r2r2k1/p5bp/1p2bppn/2p1p3/2N5/P2PB1P1/1P2PPBP/2R1R1K1 w | Bxa8 | +3.2 [V engine]; feedback counts rook 5 for bishop 3 [V] |
| 2 | rnbq1rk1/ppp2ppp/4pn2/3p4/3P4/3BP1b1/PPPN1PPP/R2QK1NR w | hxg3 (recapture) | hxg3 +0.4, fxg3 -1.3 [V engine]; feedback: capture toward the centre, opens the h-file for the rook [V] |
| 3 | 3rr1k1/1p3pp1/p4n1p/2b1p3/3nP2P/NP3P2/PBP2PB1/3RK2R b | Bxa3 (White recaptures, auto), then Nxc2+ | Bxa3 +5.4 [V engine]; the point is removing the c2 defender, then a knight fork of king and bishop [V] |
| 4 | rnbqk1nr/ppp1bppp/4p3/3P4/3P4/2N5/PPP2PPP/R1BQKBNR b | exd5 | exd5 -0.4, the next best Nf6 -1.5 [V engine]; the lesson calls it the safe equalizing capture [V] |
| 5 | r1b2rk1/ppq1npb1/2pp2pp/2n5/P2pP3/2N2N1P/1PP2PP1/R1BQRBK1 w | Nxd4 | +0.5 [V engine]; feedback: wins back the pawn and centralizes [V] |

Observations
- The lesson mixes colours (c3 to c4 are Black) and uses a mix of wins and quiet equalizing choices, so a "good trade" is not always a gain. [V]
- A trade is judged by value, structure, open files and what the trade removes (c3: a defender). The lesson does not use the word "defender" in the prompt; the first hint wording was not triggered. [I]
- c5 ends the lesson immediately after one move with Lesson Complete. [V]

## Capturing Pieces, lesson 9 (Your Opponent's Move) [played 8 Nov 2026]

Theme: before replying, ask what the opponent's last move threatens. Several challenges are multi-step, with scripted opponent replies. This is the last lesson of the course.

| Ch | FEN (before the move) | Learner moves | Notes |
|---|---|---|---|
| 1 | 6K1/7P/6q1/8/8/8/6k1/8 w | Kh8 (only alternative Kf8) | Kh8 -0.7 vs Kf8 -6.8 [V engine]; feedback says the game "should soon end in a draw", which is looser than the engine's -0.7 [I] |
| 2 | 8/6pk/8/5p2/PN3P2/6P1/3q1P1P/4R1K1 w | Rb1 | Rb1 0.0, next Re5 -0.7 [V engine]; feedback "good winning chances" overstates an equal position [I] |
| 3 | 8/2Q2pkp/p2p2pq/4p3/4P3/1n1P4/P1P2PPP/6K1 w | cxb3 (Black replies Qc1+), then Qxc1 | cxb3 0.0, h3/h4/f4 all about -4.3 to -5.6 [V engine]; Qxc1 is the only legal move [V python-chess]; the "checkmate" Black announces is refuted by the queen on c7 covering the back rank [V] |
| 4 | 3r2k1/4Rppp/p7/1p6/8/P7/1P3PPP/R2r2K1 w | Re1 (answer), Rxe1, Re8# | Wrong try Rxd1 got a red message naming the capture and the mate that follows; engine agrees (mate in 2) [V engine]; final move is mate, banner shows "Checkmate / Winner" [V] |
| 5 | rn1qkb1r/ppp1pppp/5n2/1N1p1b2/3P1B2/8/PPP1PPPP/R2QKBNR b | Na6, then Nxc7, then Qxc7 | Na6 +0.1 (top); Qxc7 directly would lose to Bxc7 (-4.6) [V engine]; White's Nxc7+ and Bxc7 are auto-played; ends "defending against an unsound attack" [V] |

Observations
- Course ending: no quiz, game or recommendation; the last lesson ends with Lesson Complete and Finish like the rest. [V]
- How the course climbs: L1 sets values, L2 to L6 add one tactic or counting skill each, L7 skewers, L8 weighs trades, L9 turns the board around (defend, then punish an unsound attack). Challenge length rises from one move to a 3-move sequence in the final challenge. [I]
- c3 and c5 show the habit being trained: look at the opponent's reply first, including mate threats. [V]

## How To Checkmate (BIAM, 15 lessons, 75 challenges listed; lessons are named mates) [played L1, 8 Nov 2026]
Lesson order [V]: fools-mate, back-rank-mate, kiss-of-death-checkmate, damiano-mate, opera-mate, arabian-mate, morphy-mate, bodens-mate, epaulette-mate, dovetail-mate, smothered-mate-1, double-bishop-mate, legals-mate-1, anastasia-mate, forrest-gump-mate. Each lesson opens on a Start screen with an Explainer Video button.

### L1 "Fool's Mate" (5 challenges) [V]
| Ch | FEN (before the move) | Accepted line | Notes |
|---|---|---|---|
| 1 | rnbqkb1r/ppppp1pp/8/3n4/8/3B4/PPP2PPP/R1BQK1NR w | Qh5+ g6, Qxg6+ hxg6, Bxg6# | queen sacrifice mate in 3 [V engine]; the opening line is a made-up odd position |
| 2 | rnbqkbnr/pppp1ppp/8/4p3/5P2/6P1/PPPPP2P/RNBQKBNR b | exf4 (gxf4 scripted), Qh4# | Qh4+ at once is graded incorrect because it is not mate yet (Kf2 escapes); the lesson wants the pawn capture that drags the g-pawn away [V] |
| 3 | r1bqkb1r/pp1pp1pp/5n2/2p5/3n4/2NB3Q/PPP3PP/R1B1K1NR w | Qxh7 (Rxh7), Bg6# | Bg6+ at once is graded incorrect (hxg6); engine's top is the same queen sacrifice [V engine] |
| 4 | r1bqkbnr/pppnppp1/7p/6N1/4p3/2N5/PPPP1PPP/R1BQKB1R w | Ne6 (fxe6), Qh5+ g6, Qxg6# | mate in 2 after the knight sacrifice [V engine] |
| 5 | rn1qkbnr/pbppp1pp/1p6/5p2/3PP3/3B4/PPP2PPP/RNBQK1NR w | exf5 (Bxg2), Qh5+ g6, fxg6 (Nf6), gxh7+ (Nxh5), Bg6# | Qh5+ at once is graded incorrect; engine +2.5 for exf5 first [V engine]; ends with a discovered check and a bishop mate |

Observations
- The lesson title is a misnomer: only challenge 2 is the actual fool's-mate shape; the rest are early queen-and-bishop mates on f7/g6. [V]
- Pattern teaching with wrong-but-natural moves graded incorrect: a check that works only after a preparatory capture is marked wrong, which makes the learner find the order of moves. [V]
- Feedback texts are one line, often a question for the next move ("How can you checkmate?"). Lesson ends with Lesson Complete and Finish. [V]

### How To Checkmate L2 "Back Rank Mate" (5 challenges) [V]
| Ch | FEN (before the move) | Accepted line | Notes |
|---|---|---|---|
| 1 | 4rrk1/ppp2ppp/8/3p2q1/3P2b1/2PB1QP1/PP4P1/4RRK1 w | Qxf7+ Rxf7, Rxe8+ Rf8, Rexf8# | mate in 3 [V engine]; Rfxf8# is also mate but graded "an alternative", the lesson wants the e-rook to capture [V] |
| 2 | 4rbk1/3Q1ppp/3p4/3P4/3q4/B7/P5PP/5R1K b | Qf2, Re1, Qxe1# | prompt names Fischer; mate in 3 after Qf2 [V engine] |
| 3 | 4rrk1/2Q2Rpp/2p5/p7/3q4/8/2P3PP/5R1K w | Qe7, Rxf8# | queen sacrifice to remove the back-rank defender; engine +6.8 for Qe7 and mate next [V engine] |
| 4 | 5rk1/QR4p1/4p2p/4N3/p3Pn2/q6r/5PP1/4R1K1 b | Ne2+ Kf1, Ng3+ Kg1, Rh1# | mate in 3 [V engine]; a back-rank mate where the black king is the mated piece's neighbour: it is a hidden-piece pattern, not the textbook rank mate |
| 5 | 4k3/p3np2/1p2p3/3pP1QP/5P2/P2q4/2r3PR/4R1K1 b | Qd4+ Kh1, Qe3 (Qh4), Rc1 (Rxc1), Qxc1+ Qe1, Qxe1# | the first tries Qc3 ("an alternative") and Rxg2+ ("incorrect") are the natural ones; hint says "look for a good check" [V]; engine mate is not a forced mate from move 1 (+5.6 only) so the lesson teaches a plan, not a calculation [V engine] |

Observations
- Difficulty climbs by line length: the same mating idea (rook captures on the back rank, queen sacrifices) in 3, 3, 2+1, 3, 5 moves. The final challenge needs a five-move plan with a quiet move (Qe3) in the middle. [V]
- The opponent's replies are scripted, sometimes not the engine's top move (c5: White plays Qh4 where the engine has other defences). [V]
- Ends with Lesson Complete. [V]

## Mastering the Endgame (BIAM, 5 lessons, 25 challenges listed) [played L1, 8 Nov 2026]
Lesson order [V]: king-and-pawn-endgames-tips-and-tricks, king-and-pawn-endgames-airplanes-and-minefields, the-active-king-in-the-endgame, attacking-with-the-king, the-outside-passed-pawn.

### L1 "King and Pawn Endgames: Tips and Tricks" (5 challenges) [V]
| Ch | FEN | Moves played | Notes |
|---|---|---|---|
| 1 | 8/8/3k4/8/8/1KP5/8/8 w | Kb4 (Kc6), Kc4 (Kd6), Kb5 | prompt asks how to bring the king forward; engine: only Kb4 wins at once (+6.5), Ka3/Kc4/Kb2 are 0.00 [V engine]; the lesson ends after Kb5 without converting |
| 2 | 3k4/8/2K5/1r6/P7/8/8/8 w | axb5 | "capture with the king or the pawn": pawn wins (mate in 12), Kxb5 draws (0.00) [V engine] |
| 3 | 2k5/8/2K5/1P6/8/8/8/8 w | b6 (Kb8), b7 (Ka7), Kc7 | the tempting Kd6/Kc5 only draw; b6 wins [V engine]; the lesson stops once the pawn cannot be stopped |
| 4 | 3Q1qk1/8/3P4/8/6K1/8/8/8 w | Qxf8+ (Kxf8), Kf5 (Kf7), Ke5 (Ke8), Ke6 (Kd8), d7 | queen trade into a won pawn ending (mate in 15) [V engine]; the other queen moves keep +2 to +3.7 only [V engine] |
| 5 | 8/3k4/3P4/3K4/8/8/8/8 b | Kd8 (Ke6), Ke8 (d7+), Kd8 | the draw by opposition for the defender; only Kd8 draws, Kc8 and Ke8 lose [V engine]; closing claim "White will either lose the pawn or stalemate" is consistent with a 0.00 engine result [V engine] |

Observations
- Every challenge is a K+P ending where one specific move wins and the natural-looking alternative only draws. The prompt names the idea (opposition, king or pawn capture); the first 3 challenges are won positions, the 5th flips to defending. [V]
- Opponent replies are scripted; lesson ends right after the point is made rather than playing out the win. [V]
- Ends with Lesson Complete. [V]

## Your First Tournament (BIAM, 4 lessons, 20 challenges listed; taught by GM Ben Finegold) [played L1, 8 Nov 2026]
Lessons [V from the library listing]: illegal-chess-move, ..., how-to-handle-draw-claims (4 lessons; the middle two slugs were not recorded here).

### L1 "Illegal Chess Move" (5 challenges, touch-move rule) [V]
| Ch | FEN | Accepted move | Notes |
|---|---|---|---|
| 1 | 7k/5ppp/8/8/1Q2R3/8/6PP/q6K w | Qe1 (you have touched the queen) | White is in check, so only queen moves count; Qb1 loses (Qxb1+), Qe1 holds, engine +7.5 [V engine] |
| 2 | rnb1kbnr/ppp1pppp/8/4q3/8/2N5/PPPP1PPP/R1BQKBNR w | Nce2 (touched the knight) | only knight moves allowed; Nce2 is the only one that is both legal and fine (+0.3), Ne4 loses [V engine] |
| 3 | r3kbnr/ppp1pppp/2n5/4q3/6b1/2N2N2/PPPPBPPP/R1BQK2R w | Nxe5 | touched bishop is pinned and cannot move, so any move is allowed; the text says touch-move does not apply when the piece cannot move [V]; engine: Nxe5 +8.3 [V engine] |
| 4 | r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w | O-O | touched king; castling is accepted; other king moves not tried [V] |
| 5 | r4rk1/p1p1qp2/bpn3pp/8/4P3/1BP1QN2/PPP2PPP/R3K2R w | O-O-O | touched king; legal king moves are only Kd2, Kd1, O-O-O [V python-chess]; Kd2 is graded incorrect ("not a good idea to move the king around in the opening"); the closing text says O-O is impossible because Bf1 is attacked: true [V python-chess] |

Observations
- The lesson teaches a rule with a position per case rule exception. The engine score is irrelevant for grading in c1-c2, c4-c5: the learner must find the best move inside the legal set. [V]
- Ends with Lesson Complete and Finish. [V]

### Your First Tournament L4 "How to Handle Draw Claims" (5 challenges, Ben Finegold) [V]
| Ch | FEN | Accepted moves | Notes |
|---|---|---|---|
| 1 | 8/5k2/5P2/5K2/8/8/8/8 b | Kf8, Kg8, Kf8 | defender's draw (K+P vs K, pawn on the 6th): each move is the only drawing move [V engine]; ending text says White must stalemate or give up the pawn |
| 2 | 5k2/8/5PK1/8/8/8/8/8 w | f7, Kg7 | same structure with White to move: now it wins (mate 13) [V engine]; the text contrasts the two |
| 3 | r6k/2N4p/p1p1Q1p1/4pP2/2P2b2/7q/PP3P1P/R4RK1 w | Qf6+ Kg8, Qe6+ (Kg7), f6+ Kh8, Qxh3 | perpetual check draw; the opponent is scripted to blunder with Kg7 instead of repeating, and White then wins the queen (+25 engine) [V engine] |
| 4 | 8/3R4/2p2Qpk/2P1p2p/4P2P/6r1/r7/2R4K b | Rh2+ Kxh2, Rg2+ | attributed to GM Larry Christiansen; engine 0.00 [V engine]; the text says the game will end in repetition or stalemate |
| 5 | r1r4k/p3p2P/3ppn1Q/q5N1/1p2P3/1P1n1P2/P1P3P1/1K3B1R b | Qxa2+ Kxa2, Rxc2+ Ka1, Rc1+ Ka2, Rc2+ | perpetual check; engine 0.00 [V engine]; the lesson ends mid-repetition and says one more check pair gives a draw (three-fold counts the position, not the moves: unchecked claim [I]) |

Observations: the lesson title is about claiming draws OTB, but all five challenges are about reaching a draw (stalemate, opposition, perpetual), not the claim procedure; no screen teaches how to stop the clock or notify the arbiter. [V]

### Your First Tournament L3 "Chess Notation Issues" (5 challenges) [V]
A "which move is notated as X" quiz: the learner makes the move on the board. Items: Bxc6 vs bxc6 in the same position (piece capture vs pawn capture), Nbd7 and N8d7 (disambiguation by file and by rank, in two positions), and 0-0-0 (written with zeros; the board shows it as O-O-O). All five were accepted at once with one-word feedback ("Well done"), no hints used. The prompt is a notation string and the answer is an on-board move: a reverse of the usual move-to-notation drill [V]. Order of difficulty: pieces, pawns, disambiguation by file, by rank, castling. Ends with Lesson Complete. [V]

### Your First Tournament L1 "Reaching the Time Control" (5 challenges, Ben Finegold) [V]
Start screen mentions the "orange juice game" of Nakamura and a Carlsen example (Explainer Video). Theme: positions where the player short of time should steer to a draw.
| Ch | FEN | Accepted moves | Notes |
|---|---|---|---|
| 1 | (3rq2k/7p/R1pr1pp1/1p6/1P2P1bP/1Q3NP1/5P2/R5K1 w) | Qe3, Qf4, Qxf6+, Ra7 | counterplay for a draw; engine 0.00 to +0.05 along the line [V engine]; the lesson says "enough counterplay to draw", consistent |
| 2 | 3rq1k1/R6p/2p2Qp1/1p6/1P2P2P/5bP1/5P2/R2r2K1 w | Kh2, Qe6+ | perpetual check plan; text says White can repeat checks on e6 and e5 [I]; engine ~0.00 [V engine] |
| 3 | 1b6/1P3pk1/8/7p/3q4/5QPK/5P2/3B4 b | f5 | "trade a pawn": h4 is graded incorrect ("a free pawn for White", true); f5 accepted. Closing text: "good drawing chances"; engine gives White about +3.6 at depth 24, so the text is looser than the engine [V engine]. The real game was lost on time [V] |
| 4 | 7k/3q4/6KP/5BP1/4R3/8/8/8 b | Qf7+ | forced stalemate: after Qf7+ White's only legal move is Kxf7 and Black is stalemated [V python-chess] |
| 5 | (r3r1k1/1R3pp1/p1pN3p/2Q1Pn2/P4P2/2P3P1/5RKP/3q4 b) | Nh4+ gxh4, Qg4+ Kf1, Qd1+ | perpetual check; engine 0.00 [V engine]; text notes White would lose after Kh3 and h5 [I] |

Observations
- All five are "find the draw" tasks: perpetual check (c1, c2, c5), a pawn trade (c3), stalemate (c4), written for a player short on the clock. No lesson here teaches time management itself; the clock theme is the Start-screen video. [V]
- Ends with Lesson Complete. Course ends there (4 lessons, no game, no quiz). [V]
