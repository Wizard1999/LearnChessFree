# chess.com free trial: Openings and Master Games (8 Nov 2026)

Method: Andrew's signed-in free trial, built-in browser, own tab. Only what the learner interface shows. Nothing bought, no settings touched. [V] = seen on screen, [I] = my inference. Wording is paraphrased. Positions are read off screenshots; FENs marked "check" were not machine-verified.

## 1. Learn The Italian Game (Chess.com Coach, M badge, released Aug 2022)

**Course page [V]:** a hook question ("which opening was popular in 1600 and still is?"), three bullets (watch a video on plans and move orders, practise thematic tactics, study a model game by GM Kosteniuk), then three lessons: (1) Learn The Italian Game, 10 challenges, 30 min; (2) Thematic Tactics, 10 challenges; (3) Model Game, 1 challenge. Related links: Evans Gambit, Quiet Italian, Loud Italian, a Chessable course. The tag "Opening for White / for Black" shows it is meant for either colour.

**Lesson 1 structure [V]:**
- Opens on a board with a coach avatar and a Start button plus an "Explainer Video" button. The first challenge begins at once after Start. The lesson video (a short coach video with typed caption, about 1 sentence of intro) sits behind the play icon and can be replayed; it is not forced between challenges.
- Challenge 1 starts from a mid-opening position, not the start position: 1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 4.d3 Nf6 5.Ng5, Black to move (check: r1bqk2r/pppp1ppp/2n2n2/2b1p1N1/2B1P3/3P4/PPP2PPP/RNBQK2R b KQkq). Prompt: White threatens f7 in a way that does not work; how should Black defend and get a good game? Answer 5...O-O. [V]
- **A challenge is a short guided line, not one move.** After 5...O-O the opponent plays 6.Nxf7, the learner must play Rxf7, then 7.Bxf7+ and the learner plays Kxf7. All of it counts as challenge 1 of 10 (progress bar moves only at the end). Between learner moves the right arrow steps the opponent's reply on the board; each correct move gets a coach comment typed out (for example: Black's king is slightly exposed but White has no developed pieces and Black has an excellent position). [V]
- Challenge 2 starts from a different, more advanced position (both sides developed, a bishop on g5 and g4, White castled): White castled at a bad moment and Black can start an attack. Answer ...Nd4 (check by the hint arrow c6 to d4). The reply: White copies the idea with Nd5, coach says doubled pawns are not an issue because Black has not castled, then asks again. So one challenge = a short model variation with a question at each fork. [V]
- **Feedback on a wrong move [V, corrected below]:** a bubble "Bb4+ is incorrect" with a red cross on the square. I screenshotted at once and saw only that line, but in the Caro-Kann lesson (section 4) the same bubble gets a one-sentence reason typed in a second later, so I probably missed it here. Treat "wrong move gets a short typed reason, no refutation played on the board" as the format. Buttons: next/analysis, show solution (magnifier) and retry (red).
- **Hints, two levels [V]:** (1) highlights the piece to move and says only "Hint"; (2) a text clue in words ("safeguard your king and defend f7 with a rook") plus an orange arrow for the whole move. Second-level text for challenge 2 was a one-word fragment while typing ("Add..."); the arrow showed Nc6-d4.
- **Right-answer feedback [V]:** green tick on the square, "X is correct", then the coach comment appears after you press the step arrow (not at once). Final step of a challenge shows a green Next Move button.
- Coach voice: first person, mentor-like, praises ("Good decision!", "Good start!", "Keep it up!"), asks a "what should Black play?" at each step. [V]
- Length: I played challenge 1 (4 plies) and 2 (2 plies and the start of a third); the course page says 30 min for 10 challenges, so about 3 min per challenge. [I]

## 2. Learn The Italian Game: Model Game (Kosteniuk vs Tomashevsky)

**Format [V]:** one lesson, "1 Challenge", but the learner finds the moves for White all game long. It opens with the board already in a mid-opening position (White Bc4, Nf3, Nbd2, pawns d4/e4, Black pawn d5; a short intro bubble "Find the moves for White in an amazing attacking game..."), a Start button, then the card "White to Move", Challenge 1/1.
- Learner moves are checked one by one; Black's replies are played for the learner, who steps through with the arrow.
- First moves seen: 1) exd5 (hint 1: highlight the e-pawn; hint 2: "trade pawns in the center"), Black recaptures Nxd5. 2) Coach: "Good start! How should you secure your king?" Answer O-O. 3) next prompt began typing ("Whit...").
- So the model game is a **guess-the-White-move** game with an explanatory comment after every move and the hint ladder available at every move; there is no score shown, only the single progress bar for the whole game. [V]
- A comment appears after a correct move only when the step arrow is pressed. [V]
- Technique we do not use: a model game played as a sequence of guessed moves with a coach saying what each move was for. (Our games lessons do not yet have per-move guess prompts. [I])

## 3. Learn The London And Colle Systems (Chess.com Coach)

**Course page [V]:** the same three-lesson template as the Italian: (1) key ideas for both sides, 10 challenges, 30 min; (2) Thematic Tactics, 10 challenges; (3) a model game ("a model Colle from Edgar Colle", 1929), 1 challenge. Hook question on the page: why is the London so popular at the top level? Related list: three third-party London/Colle courses. Intro text says "not every d4-d5 game becomes a Queen's Gambit".
**Lesson 1, challenge 1 [V]:** no start-position move list. It begins in a middlegame tactic: White: Ra1 Qd1 Ke1 Rh1, Nd2, Bd3, Bg3, pawns a2 b2 c3 d4 e3 f2 g2 h2. Black: Ra8 Rf8 Kg8, Nc6 Bd6 Bd7 Qe7, pawns a7 b7 c5 d5 e6 f7 g7 h7 (FEN r4rk1/pp1bqppp/2nbp3/2pp4/3P4/2PBP1B1/PP1N1PPP/R2QK2R w KQ, checked valid with python-chess; Bxd6 is legal). Prompt: how can White lure the black queen to c5 to prepare a tactic? Hint 1 highlighted the Bg3; hint 2 text: use forcing moves to lure the queen to a vulnerable square, plus the arrow Bg3xd6. After Bxd6 Qxd6 the coach asked: how can you lure the black queen forward again? [V]
[I] So the London lesson teaches the system by the typical tactic it produces (the Bg3 versus Bd6 trade then a lure), not by its move order. That is a "typical-position first" approach.

## 4. Learn The Caro-Kann Defense (Chess.com Coach)

- Course card: 30 min, 10 challenges in lesson 1; the full course is the same 3-part pattern (key ideas, thematic tactics, model game). [V from listing]
- **Challenge 1 is a trap, in one move [V]:** 1.e4 c6 2.d4 d5 3.Nc3 dxe4 4.Nxe4 Nd7 5.Qe2 Ngf6, White to move. Prompt: Black has just blundered and White can win already. Answer 6.Nd6# (FEN r1bqkb1r/pp1npppp/2p2n2/8/3PN3/8/PPP1QPPP/R1B1KBNR w KQkq - 0 6; python-chess confirms valid, and Nd6 is checkmate). Comment after the mate: an important trap for Caro-Kann players to avoid with Black.
- **Wrong move [V]:** Nxf6+ got "incorrect" and, a second later, a reason that is a checkmate hint: there is a mate, but this is not it; look at your checks. So wrong-move feedback does carry a one-sentence nudge and the nudge avoids naming the move.
- Challenge 2 [V]: a real game, introduced with a named player ("what clever sacrifice did a young Magnus Carlsen play to start a dangerous attack?"). Position: White Kb1 Rd1 Rh1 Qe2 Ne5 Bf4, pawns a2 b2 c2 d4 g2 h5; Black Rd8 Rf8 Kg8 Bb7(?) Qa5 Nf6, pawns a7 b7 c5 e6 f7 g7 h6 (not machine-checked).
- [I] The first challenge is a win to hook the learner (a mate in one with a moral), the second a famous player's sacrifice. Compare ours: the hook is a game and rules; their opening courses hook with a trap and a name.

## 5. Learn Every Chess Opening (50 lessons, Chess.com Coach)

- **Structure [V]:** a playlist of the key-ideas lesson of fifty openings (it re-lists the first lesson of each "Learn The ..." course: Italian 30 min, Two Knights 23, Evans 30, Berlin 19, Marshall 19, Closed Ruy 22, Najdorf 10, Dragon 13, Sveshnikov 15, Queen's Gambit family 19 to 28, Nimzo 20, London/Colle 30, French 22 to 26, Caro-Kann 30, Slav 31, KID 19, Scotch 22, Catalan 21, Scandinavian 24 and others), each with 10 challenges. Course blurb: watch an introductory video that explains the goals for each side, then use the single-opening courses for extra tactics and model games. [V]
- The time figure on the card: "English Opening 125 min" looks like a data error (other cards are 10 to 31 min). [I]
- The listed minutes include video time (the same lesson with 10 challenges shows from 10 to 31 min). [I]

## 6. Master Games, format A: "How I Became A Five Time World Champion" (GM Anand with IM Danny Rensch)

- **Course [V]:** 10 lessons, each one named for one game (Tal-Anand, Anand-Kasparov, Anand-Karpov, Anand-Shirov, Aronian-Anand, Kramnik-Anand, Topalov-Anand, Anand-Gelfand, Anand-Aronian, Carlsen-Anand), each 5 challenges and 32 to 57 min; 391 min and 50 challenges in all. The course tags: Master Games, Historical Match, Modern Match, Famous Players. Level badge M. Released Jan 2023.
- **Lesson shape [V]:** the lesson opens on a game-position and Start. A video button plays an interview: a split screen with Anand on the left, Rensch on the right, a small board between them showing the game's moves, and the two names under it. I did not watch more than the opening frame. The video is the long part (about 30+ min), the five challenges are placed at critical moments of the game. [I: that the challenges are interleaved with the video and not afterwards; I did not sit through it.]
- **Challenge 1 of Tal-Anand [V]:** prompt: how can White refute Black's ...Rxc4 sacrifice? Position (White Kg2 Qd1 Ra1 Rf1 Bb2 Nc3, pawns a4 b3 d5 f2 g3 h2; Black Kg8 Qb6 Rc4 Rf8 Bg7 Nf5, pawns a7 b7 d6 e7 f7 g6 h7): FEN 5rk1/pp2ppbp/1q1p2p1/3P1n2/P1r5/1PN3P1/1B3PKP/R2Q1R2 w - - 0 1 (python-chess: valid). Hint 1 highlighted the a-pawn; hint 2 text "attack the black queen" with the arrow a4-a5. Answer a5; coach: "Great idea! How should you win material?" and Black's reply Qb4 was then played on the board. So each challenge is a **short continuation** (two or more learner moves), not one move; the prompt after a correct move asks the next question. [V]
- Coach voice: the same cartoon coach as the opening courses speaks the question bubbles; the player's own voice is in the video. [V]

## 7. Master Games, format B: "Play Like Gukesh Dommaraju" (NM Jeremy Kane; text and board only)

- **Course [V]:** 5 lessons, each "1 Challenge", "No Videos", tags Strategy and Attacking. The five games: vs Ding Liren, Keymer, Tari, Sargissian, Lupulescu. Intro text: "Test yourself against the best games of the world champion". Each lesson card promises what to find ("win a match game", "checkmate Keymer", "find several brilliancies").
- **Lesson 1 [V]:** opens on a mid-game position (White Kg1 Qf4 Rd1 Ra1 Bg2 Bc1 Nb1, pawns a3 b5 c4 d3 g3 h3 f2; Black Ke8 Qc7 Ra8... Nc5 Ne5 pawns a5 b7 d4 e7 f7 g6 h7; not machine-checked). Intro bubble: join Gukesh in the middle of a complicated fight in the World Championship match; how did he create more space on the queenside? Then Start, then the same question with the board active.
- **Feedback [V]:** wrong move Qh4 gets "h4 is incorrect" and, after about a second, a **typed reason that narrows the search without giving the move**: there is a better option, look for a useful queenside pawn move. Hint 1 highlights the a3-pawn with an arrow; hint 2 says: advance a pawn to clear an important square for your bishop. Correct move a4, comment: Ding's reply was a bit slow (Black played ...h5), Gukesh found a powerful move to fight for the initiative, can you spot the idea? [V]
- So the **whole game is one challenge**; the learner finds the winner's moves one at a time, the opponent's moves are played automatically, and a coach comment frames every few moves. It is the same engine as the Model Game lesson in the opening courses (section 2).

## 8. Teaching techniques here that we do not use [I]

1. **Guess-the-move through an entire model game with narrated pauses.** One "challenge" is an excerpt of 10+ moves where only the winner's moves are scored; the opponent's moves are scripted. We have no equivalent in the games lessons.
2. **Trap-first opening lessons.** The Caro-Kann lesson 1 starts with a mate in one on a famous trap (the learner looks for the checkmate before learning any plan). The London lesson starts from the typical middlegame tactic. Opening ideas are explained through what the move order allows, not through the move list.
3. **Hint ladder with words, then an arrow**, and a wrong-move message that names the type of move wanted ("look for a queenside pawn move") instead of the move.
4. **Multi-ply challenges where the opponent punishes the sacrifice in front of the learner** (the Italian 5.Ng5 O-O 6.Nxf7 Rxf7 7.Bxf7+ Kxf7 line is one challenge).
5. **Named-player framing** ("what sacrifice did a young Carlsen play?"): real games are used as targets from the first challenge.
6. Interview-style videos with the player (Anand and Rensch), not an engine voice.

## 9. First challenge of four more opening courses (lesson 1 each, Chess.com Coach template) [V]

| Course | Challenge 1 setting | Prompt (paraphrased) |
|---|---|---|
| Italian, Thematic Tactics (lesson 2) | Italian with c3, d3, Re1 both castled; Black knight on d5 after an early exchange; White Bc4, Nf3 | An early exchange on d5 gives Black active pieces but also tactics for White: how can White win material? Hint 1 highlights the d3 pawn, hint 2 says to target the e5 pawn with one of your own (arrow d3-d4). The text of the lesson card was one intro line only. |
| Ruy Lopez Closed (title says Closed) | After 1.e4 e5 2.Nf3 Nc6 3.Bb5 a6 4.Bxc6 dxc6 5.Nxe5, Black to move (FEN r1bqkbnr/1pp2ppp/p1p5/4N3/4P3/8/PPPP1PPP/RNBQK2R b KQkq - 0 5; python-chess valid, and ...Qd4 is legal and attacks e5 and e4). | White has won a pawn but Black can quickly win it back: how? So the first challenge of a "Closed Variation" course is a trap in the Exchange Variation, not the closed structure. [I: the course text says it is about Chigorin and Breyer, so the trap is a hook; I did not play on] |
| Queen's Gambit Accepted | White Bc4, Ne5, pawn e4 against Black Be6, c5 and pawn d4 (a sharp early position, not machine-checked) | How should White start a strong attack? |
| Sicilian Najdorf (10 min) | The English Attack set-up: White Be3, Nc3, Nd4, e4; Black ...a6, ...d6, Nf6, Black to move | How should Black fight back with a pawn in the centre? (I did not play it. My recall is that ...e5 is the thematic answer [R].) |

Across the six courses I opened (Italian, London, Caro-Kann, Ruy Lopez Closed, QGA, Najdorf) challenge 1 is never the first moves of the opening from the start position. It is a **loaded position from move 4 to 10** with a prompt that starts "how can White...". [V]

## 10. Common mechanics seen in all of the above [V]

- Layout: board left, coach avatar plus speech bubble top right, "White/Black to Move" card, progress bar "Challenge n/N", then a play button (replays the lesson video), a hint bulb, share and undo icons, and back/forward arrows (step the opponent's scripted reply).
- Wrong move: red cross on the square, "Xxx is incorrect", then a typed one-sentence reason that never gives the move (needs about a second to appear, so grab it late). Buttons then: show solution and retry.
- Correct move: green tick, "Xxx is correct", then (after the step arrow) a comment ending in a question when the line continues.
- Hints: bulb 1 highlights the piece, bulb 2 gives a text clue plus arrow. The same on all courses.
- A lesson can start with an intro bubble that is the opening hook question, then Start, then the first challenge. The Model Game lesson has an additional intro card.
- Illegal drops snap back (not retested here).

## 11. Not covered

- Master Games: only two courses opened (Anand 1 lesson and Gukesh 1 lesson, one move deep). I did not watch the interview video, did not finish a whole game, and could not reach other Master Games pages (guessed slugs for Judit Polgar and the 1950s games returned 404).
- Not played to the end: any whole opening lesson. So lesson length is the card's, and the ending flow (summary? play-against-bot link?) is not recorded. I found no "Play Coach" or "practice vs bot" link inside an opening lesson before the lesson end; the only place seen is the Learn path menu (Next Lesson, Play Coach, Learn an Opening) already noted in research-chesscom-lessons.md.
- Chess Mentor lessons, Intro to Book Openings and Opening Principles were not opened (Opening Principles already showed "Restart" for this account, so someone else had played it).
- No claim here that chess.com is wrong. All positions I wrote as FEN were checked for legality with python-chess; the engine was not used, so "wins material" answers are the course's, not verified.

---
# Round 2 (same day, continued)

## 12. Italian Game lesson 1 played to the end (10 challenges, Black or White as given) [V]

Method: hint 2 for each answer, so every answer below is the course's, then engine-checked (see 12.2). Positions are in the opening Italian (Giuoco Piano) family, Moller-type and Greco material; challenges 1 to 10 in order:

| # | Side | Prompt gist | Answer path (learner moves) | Learner moves |
|---|---|---|---|---|
| 1 | Black | White's Ng5 threat on f7 does not work: defend and get a good game | O-O, Rxf7, Kxf7 | 3 |
| 2 | Black | White castled at a bad moment, Black can attack; then "what should Black play?" after White copies the idea with Nd5 | Nd4, c6, Nxf3+, Bh3 (with a wrong-move feedback on Bxf3) | 4 |
| 3 | Black | Dangerous attack but White's bishop blocks the g-file | h5, h4, Bg2+, Bxf3+, Bxd1 (wins the queen) | 5 |
| 4 | Black | Pinning a knight before the opponent castles; take advantage of the bishop on h4 | g5, hxg5, Rg8, Bb4 | 4 |
| 5 | Black | (Moller-type) save the bishop; then win material after White's Nc3 | exd4, Bb4+, Nxe4 | 3 |
| 6 | White | Black's knight on e4 is vulnerable: how to take advantage | Bd5, cxd4 (after ...f5) | 2 |
| 7 | Black | How to prevent White dominating the centre | d5 (a single move, then a comment about the thematic ...d5 break) | 1 |
| 8 | White | Black has captured too many pawns and White can win material | Qe1+, Qxc3 (fork of king and knight) | 2 |
| 9 | White | Black has been incautious: win material | b4, a5 (traps the Bc5/Bb6) | 2 |
| 10 | White | "How did Giovanni Greco, first great master of the Italian, justify his huge sacrifices?" | Bxf7+, Bg5, Ne5, Bg6, Qf3+, Bxf5, Be6+, Bxf6, Bxg7 (ends: Black resigned in Greco-NN, 1620) | 9 |

Total about 35 learner moves in about 10 challenges. [V counted from my own play; challenge 5 gave me the first move without my seeing the prompt, so the prompt wording is from the hint.]

**Structure [V]:** challenges 1 to 5 are Black (the learner defends or counterattacks), 6 to 9 are tactics for either side, 10 is a famous historical attack by Greco. It starts with the reply to a threat, ends with a 400-year-old master attack. The sequence is a story about the opening's themes (f7 sacrifice, pins, central break ...d5, discovered checks), not the move order.
**Wrong-answer feedback [V]:** challenge 2, ...Bxf3 (not the best): "Black is slightly better, but there's a threat that's significantly stronger. Try to find it." The wrong move is played on the board and the opponent recaptures. So the feedback is graded: "playable but not best" is a different message from "incorrect". In Caro-Kann and Gukesh the message just said incorrect plus a nudge. Hint 1 usually gives a verbal nudge about the idea ("chase White's knight from the centre"); hint 2 an arrow.
**Hint texts [V], examples:** "Recapture and avoid any discovered checks"; "Attack the h4 bishop"; "Pin the c3 knight"; "Fork Black's king and knight"; "Capture a piece and prepare a deadly discovered check"; "Capture a piece to force checkmate". All name the theme, not the square.
**Comments [V]:** after the learner's move the coach comment appears only after the step arrow is pressed; they are one to three sentences, either praise plus the next question, or a verdict on the position ("White's kingside is exposed...", "Black should convert the material advantage into a win", "Greco won by...").
**Ending [V]:** after the last move the progress bar fills and the green Next button, pressed once, went straight to the Learn path page (/learn) showing the beginner section and a "Next Lesson" button. No lesson-complete screen, no score, no "play a game against the coach" prompt, no list of the moves learnt. In this free-trial session no "Play Coach" link was visible at the end. (Earlier report: the path menu offers Next Lesson, Play Coach, Learn an Opening, Lesson Library.) [V for this ending; the menu item was not re-opened.]
**Time [V]:** about 40 min of screen time for me including answer lookups; the course card says 30 min for the lesson. [I: a real learner with the video would take about the card time.]

### 12.2 Engine checks (Stockfish 19 lite, depth 16 to 18, single thread, tools/engine.py; labelled [V engine])

| Claim from the lesson | Engine | Verdict |
|---|---|---|
| Ch1, 5.Ng5 O-O: Black is fine | 5...O-O gives about -0.5 (Black slightly better) | consistent |
| Ch1, after 6.Nxf7 Rxf7 7.Bxf7+ Kxf7 "Black has an excellent position" | -2.76 | consistent (Black clearly better) |
| Ch2, Nd4 is the best move; Bxf3 gxf3 "slightly better but a stronger move exists" | Nd4 -0.90; Bxf3 gxf3 -0.42 | consistent |
| Ch5, 7...Nxe4 in the Moller line: "White might struggle to show compensation for the pawn" | -0.27 (near equal), after 8.O-O Bxc3 -0.23 | overstated: the engine sees roughly equal, not a Black advantage |
| Ch6, Bd5 f5 cxd4: "dominant centre and safer king" | +1.79 for White | consistent |
| Ch8, Qe1+ Nce7 Qxc3 wins material | +5.7 before, +6.0 after | consistent, and a decisive win |
| Ch9, b4 Bb6 a5 traps the bishop | start +3.4; after b4 Bb6 a5 +4.7 | consistent |
| Ch10, final position (after ...Bf6 Bxf6): Bxg7 | +11.2, best is also Bxg7 +12.7 | consistent |
| Caro-Kann ch1: a wrong move (Nxf6+ Nxf6) loses the mate | -0.01 after Nxf6+ Nxf6; Nd6# is mate (python-chess) | consistent: the mate is thrown away |
| Ruy Lopez "Closed" ch1: after 5.Nxe5 Black wins the pawn back with ...Qd4 | start -0.59 (Black fine), 5...Qd4 is the engine's first choice | consistent |
| Anand/Tal ch1: a5 is the winning idea after ...Rxc4 | start +3.07; a5 +3.13; the natural bxc4 gives -1.92 | consistent, and the natural capture is a mistake (a good "hide the obvious move" item) |
| London ch1: lure the queen with Bxd6 | position about equal (0.00); after Bxd6 Qxd6 -0.09 | the claim is a tactic setup, not a win at that point |

No chess.com claim here was found wrong, except the single overstatement in ch5 (a soft claim, not a hard error).

## 13. Round 3: complete master-game lesson and Chess Mentor style

### 13.1 Gukesh vs Ding Liren, played to the end [V]
- Format: one challenge ("Challenge 1/1") that holds the whole game excerpt. The learner plays only the winner's moves (11 moves: a4, b6, Ba3, Bxc5, Qe4, Na3, Nc2, Rb1, Rb5, Na1, Nb3, Nc5, Rb1, Qxc6; the opponent's replies are scripted and appear automatically after a correct move).
- Coach comments are one to three short sentences after each correct move, and almost always end with a question that sets up the next guess ("where should the knight head next?", "how can White win material?"). A story beat (the opponent was short of time) is dropped in mid-game.
- Hints: first press gives a verbal clue ("Fork the b7-pawn and the d7-rook", "Double your rooks on the b-file", "Sacrifice your queen to rip open the b-file"); second press adds an arrow. The clues are concrete and nearly give the move, so the guess is closer to a guided puzzle than a prediction test.
- Ending [V]: a modal "Lesson Complete!" with confetti and a Finish button, no score, no accuracy figure, no recap of the moves, no Play Coach or bot link. Finish returns to the /learn path page.
- Engine check [I, Stockfish 19 lite, depth 18, position reconstructed from the screen]: before Qxc6 White is about +5.7 and Qxc6 is the engine's first choice; after it Black stands near -5.9. The comment "Black collapsed with a major tactical error" is consistent. Not checked: the earlier moves of this game.
- Note: the pane was in a narrow phone-like layout for this part (board on top, coach panel below), which showed the mobile arrangement: same elements, stacked.

### 13.2 Chess Mentor style (Practice The London System) [V from round 2 notes]
- A list of named real games, each with 1 to 7 challenges; the source game is named in the prompt. Comments explain the idea behind the move ("threatening a capture followed by a mate on h7") with a "we" voice in hints. Closer to the school's model-game plan than the opening-course lessons.

### 13.3 Play Coach or bot link [V]
- None seen at the end of Italian lesson 1 or of the Gukesh lesson. Both end on /learn with a Next Lesson button.

### 13.4 Not covered
- Intro to Book Openings and Opening Principles (the latter shows Restart on this account, played earlier by another agent) were not opened in this round.

### 13.5 Techniques the school does not use [I]
- Guess-the-winner's-moves scoring inside one long challenge, and the question-ending coach comment that creates a next want every move. Worth testing against our explain-then-test lessons.

## Learn the Scandinavian Defense (Learn-the-X opening course; 3 lessons: theory, a middle lesson, model game; lesson 1 challenges 1 and 2 played, 8 Nov 2026)
Format [V]: the Start screen has an Explainer Video button beside Start; lesson 1 has 10 challenges, each a "what move here" position reached by auto-played opening moves. I played challenges 1 and 2 only; lessons 2 and 3 not played (the last lesson of every Learn-the-X course is named "model game", see the list file). [V]

| Ch | Position | Learner move(s) | Notes |
|---|---|---|---|
| 1 | after 1.e4 d5 2.e5, Black to move (FEN rnbqkbnr/ppp1pppp/8/3pP3/8/8/PPPP1PPP/RNBQKBNR b) | c5 | The prompt says any second move by White besides exd5 gives Black an easy game (an opinion, not engine-checked). c5 +0.13, Bf5 +0.04, a6 +0.03, d4 -0.05 in White's favour terms are all within 0.2 [V engine]; the lesson accepts c5, feedback "White can't easily occupy the center with more than just the e-pawn" [V] |
| 2 | after 1.e4 d5 2.exd5 Qxd5 3.d4, Black to move (rnb1kbnr/ppp1pppp/8/3q4/3P4/8/PPP2PPP/RNBQKBNR b) | e5, (White dxe5 auto), then Qxd1+ | e5 is the engine's top (about -0.3, i.e. slightly better for White) [V engine]. Capturing Qxe5+ got the verdict "is an alternative: OK but there's an even better capture"; Qxg2 got "incorrect"; the hint said "Trade queens to prevent White from castling"; Qxd1+ was accepted with the explanation that White's king is stuck in the center [V]. |

Observations [V]
- "Is an alternative" appears here too (second place after Pawns vs Pieces and King Activity): the opening course accepts a reasonable move but pushes to the lesson's main idea. [V]
- The hint names a strategic idea (stop castling), the first wrong answer names no idea. [V]
- The comment claim "Black is doing well" after 2.e5 c5 is mild optimism; the engine sees equal. [V engine, I]

## Play Like Hikaru Nakamura, lesson 1 "Zherebukh vs Nakamura" (Master Games; 5 lessons, one game each; first 2 moves played, 8 Nov 2026)
- Course page [V]: five lessons, each a Nakamura game; the slug pattern is play-like-hikaru-<white>-vs-<black>; the same pattern holds for the other "Play Like" courses (list file). The page frames the series as learning a player's habits (this one: winning quickly with Black).
- Lesson format [V]: the lesson counter shows "Challenge 1/1", but inside it the learner plays the black moves of the real game one at a time, with the opponent's moves auto-played; the prompts are coaching nudges ("What piece should you develop next?", "How should you keep developing?") rather than puzzles. FEN at the start: rn1qkbnr/pp2pppp/2p3b1/8/3P4/6NN/PPP2PPP/R1BQKB1R b; the first two accepted moves were Nf6 and Nbd7, which are also the engine's two top choices (-0.2 for Black in White's favour terms; Nf6 -0.16, Nbd7 -0.21) [V engine].
- Not played: the rest of the game (the number of moves, the final comment, and the lesson end were not seen).

## Learn the Queen's Gambit Exchange Variation (BI, 3 lessons, 21 min) [played L1 c1-5, 8 Nov 2026]
Lessons [V]: learn-the-queens-gambit-exchange-variation (10 challenges), ...-thematic-tactics, ...-model-game. Start screen text promises both sides' ideas plus the Tarrasch and Semi-Tarrasch (Explainer Video button).

L1 is a 10-challenge mix of plans for both colours, tactics after typical mistakes, and the Tarrasch and Semi-Tarrasch structures; challenges 1-5 are:
| Ch | FEN (before the move) | Accepted | Notes |
|---|---|---|---|
| 1 | rn1qkb1r/pp3ppp/2p2n2/3p1bB1/3P4/2N1P3/PP3PPP/R2QKBNR w | Qf3 (Bg6), Bxf6 (Qxf6), Qxf6 | the prompt "damage Black's pawn structure": the immediate Bxf6 is graded "incorrect" because Qxf6 recaptures and Black has a good position; Qf3 first makes gxf6-style recapture forced. Engine +0.27 for Qf3 [V engine] |
| 2 | rn1qk1nr/pp3ppp/2p3b1/3p4/3P1BPb/2N1P3/PP3P2/R2QKBNR w | Qb3 (b6), Rxh4 (Qxh4), Nxd5 (cxd5), Bb5+ (Nd7), Bxd7+ (Kxd7), Qxd5+ (Kc8), Rc1+ (Bc2), Rxc2# | punishing "an unsound pawn grab" (Black's Bh4); Qxd5 at the tenth step is graded "an alternative" and the lesson wants Bb5+, but the engine prefers Qxd5 (+6.7 versus +4.9 for Bb5+ at depth 26, which is still winning) [V engine d26]: the lesson's "even better move" is not the engine's best. A candidate discrepancy; both win |
| 3 | (r1bqkbnr/pp3ppp/2n5/2pp4/3P4/2N2N2/PP2PPPP/R1BQKB1R w) | g3, Bg2 | Tarrasch structure; the prompt says the bishop should go to take advantage of d5; engine puts dxc5 first (+0.46) and g3 at +0.07, so the plan is thematic not engine-best [V engine] |
| 4 | rnbqkb1r/ppp2ppp/4p3/8/3PP3/2P5/P4PPP/R1BQKBNR b | c5, cxd4 (cxd4), Bb4+ (Bd2), Bxd2+ | Semi-Tarrasch-like plan: attack the centre, then trade the white-squared bishop; engine -0.64 for White after c5 [V engine] |
| 5 | rnbqkb1r/ppp2ppp/5n2/3p4/3P1B2/2N5/PP2PPPP/R2QKBNR b | Bd6 | prompt: White's Bf4 instead of Bg5 is inaccurate; Bf5 is graded "an alternative" ("develops and attacks the f4-bishop" is the lesson's wording); engine rates c6, Bf5 -0.17 and Bd6 -0.24 so the choice is a teaching preference, not a strict best [V engine] |

Observations
- A long first lesson (10 challenges, listed course time 21 min for all 3 lessons) mixing both sides, tactics and structures; difficulty does not climb in a line. [V]
- The "alternative" verdict appears twice in five challenges: the lesson keeps a single teaching move even when the engine has another equal or better. [V]
- Unplayed: L1 challenges 6-10, L2 thematic tactics, L3 model game (the course ends with a model game, by the title). [V from the lesson list]

### Learn the Queen's Gambit Exchange Variation L1, challenges 6-10 [played 8 Nov 2026, V]
| Ch | FEN (before the move) | Accepted | Notes |
|---|---|---|---|
| 6 | rn1qkb1r/ppp2ppp/5n2/3p1bB1/3P4/2N5/PP2PPPP/R2QKBNR w | Bxf6 (Qxf6), Nxd5 | "Black's Bf5 was premature"; engine +1.19 for Bxf6 and +1.67 after Nxd5; the text says White wins a pawn [V engine] |
| 7 | rnbqk2r/pp2bppp/2p2n2/3p2B1/3P4/2N1PN2/PP3PPP/R2QKB1R b | Bf5 | the learner develops the bishop that White's slow move order allowed; engine puts h6 first (0.00) and Bf5 at -0.21, so the lesson's choice is thematic [V engine]; text: White usually plays Qc2 or Bd3 early to prevent Bf5 |
| 8 | r1bqr1k1/pp2bp1p/2p1nnp1/3p4/3P4/2NBPN1P/PPQ2PPB/R4RK1 b | Ng7, Bf5 | prepares Bf5 first; engine's top is also Ng7 (-0.17) [V engine] |
| 9 | 4r1k1/1p3pnp/2pq1np1/3p4/1P1P4/r1N1PN1P/2Q2PP1/1R3RK1 w | b5, bxc6 | minority attack; engine top b5 (+0.21) [V engine]; text cites a real game (So - Hracek 2016) won a pawn but drew [R from the page, not checked] |
| 10 | r2q2k1/pp2rppp/2p1b1n1/8/3PP1n1/2NB3P/PP1QN1P1/R4RK1 b | N4e5 (dxe5), Nxe5, Rd7, Bc4, Bxd3 | a knight sacrifice then a pin on the bishop; Bc4 at once is graded incorrect ("White is OK and can meet Rd7 with Nd5"), Nxd3 is "an alternative", Bxd3 is the accepted one; final text claims Black has an extra pawn and a good position, engine: Black ahead by about 2.6 at depth 22 [V engine] |

Observations
- The last challenge is a 5-move sequence led by one-line "how should you ..." prompts and ends on a sacrifice line from a game; the climb is toward longer guided sequences, not harder single choices. [V]
- In L1 the lesson graded "alternative" three times (Qxd5 in c2, Bf5 in c5, Nxd3 in c10), twice where an engine considers the alternative equal or better (c2: engine prefers the alternative; c5: Bf5 at -0.17 is better than the lesson's Bd6 at -0.24). [V engine]
- Ends with Lesson Complete and Finish. [V]

### Learn the Queen's Gambit Exchange Variation L3 "Model Game" (listed as 1 challenge) [played the first 10 White moves, 8 Nov 2026, V]
- Start screen: GM Boris Avrukh beats FM Merlijn Donk; the page says the game follows Polugaevsky - Tal for 21 moves ("it pays to study the classics"). The whole game is ONE challenge ("Challenge 1/1"): the learner plays every White move, Black's replies are scripted, and each White move gets a one-line verdict. [V]
- Moves accepted so far (White): e4, bxc3, cxd4, Bd2, Qxd2, Bc4, O-O, Rad1 (position starts after 1.d4 d5 2.c4 e6 3.cxd5 exd5 4.Nc3 c5 5.Nf3 Nf6 6.Bg5-type Semi-Tarrasch transposition [I], FEN rnbqkb1r/pp3ppp/4p3/2pn4/3P4/2N2N2/PP2PPPP/R1BQKB1R w).
- Verdicts: Bd3 graded "incorrect" (Nc6 hits d4; engine -0.14 versus 0.00 for h4), Rd1 and Rfe1 graded "an alternative" ("White moved another rook first"), Be2 "incorrect"; so the lesson insists on the actual game move order, and the engine's top choices (h4 in one position, Rfe1 at +0.48 in another) are marked less right. [V, engine d18-20]
- The learner is told when a move is "OK" but not the game move, so the model game teaches game-move recall rather than the best move. [I]
- Not finished: the remaining 12 or so White moves and the ending screen. [not played]

### QG Exchange L3 model game, continued (8 Nov 2026, late session) [V seen]
After Rfe1 the single challenge continued: d5 (centre break; "Good move", next prompt about keeping the bishop), Bd3 (accepted; Bf1 was the engine's first choice at d16, +0.8, Bd3 +0.5, both fine), e5 (accepted, prompt about the clever bishop-scope move), then "bring your queen to a safe square on the kingside". Qe2 was graded "an alternative" (engine about -0.1) and Qf4 accepted (engine first choice, +0.8, d16) [V engine]. Next prompt: the sacrifice to expose the king, Bxh7+, accepted; Black's scripted reply Kxh7; the final Ng5+ step was in progress (engine first choice, +1.7) when the tab was navigated away by something outside my actions (it landed on the local Scholarmate app), so the ending screen was NOT seen. Pattern: the model game is one long challenge with about 15 White moves, hints name the idea ("a safe square on the kingside"), and "alternative" verdicts again match engine-playable moves. Note: two clicks right after a scripted reply were ignored; wait a second after each reply.
