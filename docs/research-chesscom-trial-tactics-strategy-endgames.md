# chess.com trial: Tactics, Strategy, Endgames courses (8 Nov 2026)

Method: Andrew's account on a free trial (daily lesson limit no longer hit), own tab in the built-in browser. Only what a learner sees. Positions are read from the rendered board (piece squares on screen), written as FEN piece-placement; side to move is from the on-screen label. Engine checks used Stockfish 19 lite via tools/engine.py at depth 12-16 (evidence [V] for "engine agrees", not for chess.com's reasoning). Labels: [V] seen, [I] inference. Time and challenge counts are the page's listed figures.

## 0. Findings that hold across the lessons seen

- **Lesson shape [V]:** course page lists lessons with minutes and challenge count (all lessons seen: 5 challenges). A lesson opens on an intro screen (the board of challenge 1, the coach avatar with a bubble that repeats the lesson blurb, about 35-40 words, plus Start and an Explainer Video button). Pressing Start goes straight to challenge 1. There is no taught example before the first challenge; the teaching is the optional video and the hints. [V]
- **Prompt style [V]:** side-to-move label ("White to Move") plus a generic question: "How should White win material?" (6 words, no theme named). Real-game challenges name the player ("How did world champion Mikhail Tal win material?"). The theme is not named in the prompt; it is named in wrong-answer feedback and in hint 1 or 2.
- **Wrong answer [V]:** red cross, bubble "X is incorrect", plus a one-line nudge naming the theme ("Try again and look for a powerful double attack"; "look for a strong capture"). No refutation shown. Retry button (red arrow) replaces the next arrow.
- **Hints [V]:** bulb button. First press highlights the piece to move (queen highlighted on h5, challenge 1 of lesson 1). A text hint then names the idea and sometimes the move ("Retreat your queen to target the a4-rook and e3-bishop"; "Threaten checkmate on g2 and a free rook on c1"; "Sacrifice a knight to decoy White's bishop into a fork"). So the hint gives away the answer; there is no penalty visible. [V no penalty shown; I no score exists]
- **Correct answer [V]:** green tick, "X is correct", and one praise-plus-fact line ("Well done! White wins a knight and should win the game"). Real-game positions end with source and year ("Tal - Tringov, 1958"; "So - Carlsen, 2016").
- **Multi-move challenges [V]:** many challenges continue for 2-4 plies after the first correct move; the opponent replies automatically and the bubble asks a follow-up ("How should you win back the queen?", "What's the idea?"). A challenge is thus a mini-line, not one move. The challenge counter stays on the same number until the line ends, then a green next arrow appears.
- **Engine and chess.com agree on every first move tested (9 of 9) [V]**; on challenge 4 of Forks the engine's top move at depth 20 (Nxa4) was also the hinted sacrifice line.
- **Ending [V]:** after challenge 5 a modal "Lesson Complete!" (graduation cap, one Finish button), then back to the Learn path with a Next Lesson button. No summary of the pattern, no recap of the mistakes, no spaced review, no score. [I] Nothing records how many hints or retries were used on the page I saw.
- **Estimated wall time of one lesson by me:** about 12-15 minutes including engine checks; a learner who knows the motif would need perhaps 5-8 minutes; the page lists 9-13 minutes [I].

## 1. Every Chess Tactic Explained (Fiona Steil-Antoni, WIM), Tactics, Mastery tag

Course page [V]: 13 lessons, 163 minutes, 65 challenges, released 27 Jul 2021. Lessons: Double attacks 9 min, Forks 10, Pins 13, Skewers 11, Discovered attacks 12, Decoys 11, Interference 9, Remove the defender 11, Trapped pieces 9, Zugzwang 20, Promotion 15, Intermediate moves 15, Clearance 18; each 5 challenges. Tagged themes: decoy/deflection, discovered attack, double check, fork, pin, skewer. Related: Checkmate Patterns You Should Know; Introduction To Tactics.
Blurb opening quotation from a member review on the page: "much more difficult examples to all the basic tactics" [V]. Level label on the page: Mastery, but the content is plain tactics; the difficulty of lesson 1 is about 1200-1800 [I].

### 1.1 Lesson 1, Double Attacks (9 min listed, 5 challenges)
Order [V]: opens directly on challenge 1, no worked example. Concept is introduced by the lesson title and the generic prompt; the lesson's own explanation is in the optional video [V button seen, I did not watch].

| # | FEN (placement) side | Prompt (words) | Answer | Wrong-answer test / feedback |
|---|---|---|---|---|
| 1 | 5rk1/6pp/p2br3/3p1p1q/R2P1Pb1/2P1B1P1/1P1N3P/4RQK1 b | "How should Black win material?" (5) | Qe8 attacking Ra4 and Be3 | not tested; hint 1 highlights the queen, hint 2 says retreat to hit rook and bishop (12 words). Praise: no way to save both |
| 2 | r4rk1/1q3ppp/p1n1p3/1p1n2N1/3P4/8/PP3PPP/2RQRBK1 w | same (5) | Qc2 (threat Qxh7#), then after ...g6 Qxc6 | Bd3: "incorrect, stronger move, look for a powerful double attack" (13). Qxc6 wanted but Qc5? tested as "incorrect, look for a strong capture". Two-step answer |
| 3 | 8/6pk/5p1p/8/7n/3q1PN1/6PP/2R3BK b | same | Qd2 (threatens Qxg2# and Qxc1), after Bf2 Qxc1+ | hint 2 states both threats in 10 words. Praise says better than what Grischuk played |
| 4 | 1r1r2k1/2Q2pp1/4pb1p/Rp1q4/8/2P1B2P/5PP1/2R3K1 b | same | Be5 (hits queen, wins exchange), then queen back: Qd1+ Rxd1 Rxd1# | engine: Be5 first; final mate verified by engine (mate in 2 from the second position) |
| 5 | 1r1q1rk1/5pp1/p2bp2p/1p1b1n2/3PN3/4BB2/PP3PPP/2RQ1RK1 b | "White has misplayed the opening and NM Nicholas Rosenthal found a way to take advantage. How should you win material?" (24) | Bxe4, then Qh4 (double attack on Be4/Be3 after Bxe4) | engine: Bxe4 first, then Qh4; the line ends the lesson |

Difficulty progression [I]: positions are real-game or composed tactics from the start: no warm-up in lesson 1. Count of themes per challenge: always a double attack by a queen or minor piece with a follow-up. Each challenge gives the one-line "what to look for" in the prompt only when wrong.
Observed about wrong feedback: it is generic and names the theme only; it never shows why the other move fails. [V]

### 1.2 Lesson 2, Forks (10 min listed, 5 challenges)
Intro screen showed challenge 1's board with the blurb ("Using one piece to attack two opposing pieces will win you many games"). [V]

| # | FEN side | Prompt (words) | Answer | Notes |
|---|---|---|---|---|
| 1 | 8/4N1k1/R4np1/1p6/1r5P/7K/6P1/8 w | "How should White win material?" | Rxf6 Kxf6 Nd5+ (fork K and Rb4) then Nxb4 | three-ply line; praise "What's next?" |
| 2 | r3kr2/1p1b1pp1/p1n1p2p/8/4q3/1N6/PPP1BKPP/R2Q1R2 w | "How did world champion Mikhail Tal win material?" (9) | Qxd7+ Kxd7 Nc5+ (fork K and Qe4) Nxe4 | source line: Tal - Tringov, 1958 (shown at the end) |
| 3 | same position with White's knight already on c5, Black to move: r3kr2/1p1b1pp1/p1n1p2p/2N5/4q3/8/PPP1BKPP/R2Q1R2 b | "If Tal had tried Nc5 before Qxd7+ ... Black could have played a winning fork. Try to find it." (about 20) | Qf5+ (fork K and Nc5), Qxc5 | **a contrast pair**: the same position, colours reversed, shows the refutation of the other move order. Strong teaching idea [V] |
| 4 | 8/1p4p1/2pk1p1p/p1n4P/P1K2PP1/4P3/2B5/8 b | "What strong move did world Champion, Garry Kasparov, play to swiftly win the game?" (15) | Nxa4 (sac), Bxa4 b5+ (pawn fork K and B), Bxb5 cxb5+ Kxb5 Kd5 | hint 1 only highlights; hint 2 "Sacrifice a knight to decoy White's bishop into a fork" (12). The sequence is 4 Black moves long and ends in a king and pawn ending; final question "How should Black win the king and pawn ending?" |
| 5 | 4r1k1/3Q1ppp/8/2B5/p1n5/Pq1b1BP1/5P1P/3R2K1 b | "What amazing combination did Magnus Carlsen play to win in this complicated position?" (14) | Qxd1+ Bxd1 Re1+ Kg2 Bf1+ Kf3 Ne5+ (fork K and Qd7) Nxd7 | So - Carlsen, 2016; the final fork occurs on ply 6 of the line; 7 clicks to complete |

Fork motif seen: knight fork of king and rook (1), knight fork of king and queen (2, 3 with the queen), pawn fork (4), queen fork K and N (3), knight fork K and Q (5). The forks are mostly **after a forcing first move** (sacrifice, check), not a one-move fork. [V]

Ending: lesson complete modal as above, then Learn path.
Honesty note: lessons 1 and 2 are not "forks 101": every challenge needs 2-6 plies of calculation. [V]

## 2. Mating Nets (WGM Tatev Abrahamyan), Tactics/Attacking, Mastery tag

Course page [V]: 5 lessons, 57 minutes, 25 challenges, released 22 Jun 2021. Each lesson is **one annotated game**: Chigorin's queen sacrifice (11 min), Tatev's own win over a Dragon (12), Alekhine's endgame attack (12), Judit Polgar (12), a Kasparyan study (10). The course blurb frames each lesson as a question ("How did Alekhine checkmate in the endgame?"). Themes tagged: attacking the king, checkmate, queen sacrifice, sacrifice.

### 2.1 Lesson 1, Chigorin's Queen Sacrifice (11 min listed, 5 challenges)
Structure [V]: the five challenges follow the game in order, from a quiet opening position to the finish; the game's remaining moves play automatically between challenges. So the lesson is a replayed game with five decision points, not five separate positions. Challenge 1 is not a tactic: it is a development decision in an Italian-type position, which is where the lesson starts.

| # | FEN side | Prompt (words) | Moves the learner must play | Notes |
|---|---|---|---|---|
| 1 | r1bqk2r/ppp2ppp/2np1n2/2b1p1B1/2B1P3/3P1N2/PPP2PPP/RN1Q1RK1 b | "How should Black handle White's early pin on the f6-knight?" (12) | h6, (Bh4) g5, (Bg3) h5 | three-step line. g4 instead of h5 at the last step: **"incorrect"** and the board played Nh4 with 22-word explanation (White's knight heads to f5, Black is worse) plus "find a stronger pawn move". Engine check [V, Stockfish 19 lite, depth 20]: g4 -0.55 and h5 -0.29 from Black's side, i.e. about 0.26 pawns apart, both near equal; the "difficult position" wording overstates. chess.com marks only the game move correct |
| 2 | r1bqk2r/ppp2p2/2np1n2/2b1p1Np/2B1P3/3P2B1/PPP2PPP/RN1Q1RK1 b | "Black has sacrificed a pawn for a strong attack. How did he add more fuel to the fire?" (17) | h4 (Nxf7) hxg3 (queen sacrifice: Nxd8 follows) | praise at the sacrifice: "What a move! You can justify the sacrifice in the next challenge" (13): the lesson **promises the justification one challenge later** |
| 3 | r1bNk2r/ppp5/2np1n2/2b1p3/2B1P3/3P2p1/PPP2PPP/RN1Q1RK1 b | "Chigorin has sacrificed his queen for the initiative. How did he bring more pieces into his attack?" (17) | Bg4, then Nd4 | engine agrees with Bg4 (mate threats follow) |
| 4 | r2Nk2r/ppp5/3p1n2/2b1p1Q1/2BnP1b1/3P2p1/PPP2PPP/RN3RK1 b | "White's counter-attack isn't enough to save the game. How can Black force checkmate?" (14) | Ne2+ Kh1 Rxh2# | verified mate in 2 by engine. Praise warns the next challenge shows the real finish: **challenge 4 is a hypothetical line, 5 is the game** |
| 5 | r2Nk2r/ppp5/3p1n2/2b1p3/2BnP1b1/2NP2p1/PPPQ1PPP/R4RK1 b | "How can Black force checkmate?" (5) | Nf3+ gxf3 Bxf3 (White resigns here); then "How would Black checkmate after Qg5?" gxh2# | engine: mate in 7 starts with Nf3+ too; final mate is a pawn capture, verified |

Ending [V]: "What a beautiful miniature!" then, presumably the same Lesson Complete modal (I did not press further in this lesson [not opened]).
Observations [V]: (a) wrong feedback in a game lesson includes the opponent's refutation move and a reason; in the tactic lesson it was generic. (b) the sequence is front-loaded with one hard "choose the pawn move" decision that an engine counts as equal. (c) each challenge's bubble ends in a question that points at the next goal ("How did he bring more pieces..."): the coach narrates the game as a chain of "how did X..." questions.

## 3. Absolutely Must Know Endgames (GM Alexandra Kosteniuk), Endgames, Mastery tag

Course page [V]: 12 lessons, 174 minutes, 60 challenges, released 10 May 2022, "now with even more essential endgames". Lessons in order with listed minutes: knight and bishop mate 13, winning with two knights 14, fortresses 13, rook vs knight 20, rook vs bishop 16, rook and bishop vs rook 21, queen vs pawn 8, queen vs pawn stalemate tricks 14, rook vs pawn 14, minor pieces vs pawns 13, king and pawn endgames 16, endgame principles 12. Every lesson 5 challenges. The order is by piece rarity, not by learner need: **king and pawn endings are lesson 11 of 12**, after rook-and-bishop vs rook (21 min). [V] For a learner the rank looks inverted [I].

### 3.1 Lesson 11, King and Pawn Endgames (16 min listed, 5 challenges), played to challenge 3
Prompt style [V]: unlike the tactics lessons, the endgame prompt **carries the concept** ("critical squares two ranks in front of the pawn"), so the teaching is in the question; the bubble after each correct move gives the next sub-question.

| # | FEN side | Prompt | What the learner plays | Feedback seen |
|---|---|---|---|---|
| 1 | 3k4/8/8/8/6P1/8/5K2/8 w | "How can White's king reach the critical squares two ranks in front of the pawn?" (14) | Kg3, Kh4, Kh5, Kg5, Kf6 against Black's Ke7, Kf6, Kg7, Kh7 (5 white moves, one challenge) | **Kf3 first: "incorrect"** with a 17-word hint that Black's king can block the critical squares. Checked: Stockfish 19 lite depth 24 gives Kf3 0.00 (draw) and Kg3 +6.45; so chess.com is right here [V]. After Kh5 the bubble says Black has blocked the king; the only winning move is Kg5 (engine: g5? and Kh4 evaluate 0.00 at depth 26) then Kf6. Each correct move has a short follow-up question |
| 2 | 8/8/8/8/6p1/8/5k2/7K b | "How should Black convert the extra pawn into a win?" (10) | Kg3, Kh3, g3, g2, Kh2 (five Black decisions) | **g3 (the stalemate move): "incorrect: That's stalemate! Try again and look for a good king move."** Verified with python-chess: after ...g3 White has no legal move [V]. The lesson plants the stalemate trap on purpose and names it. One mid-line bubble says "Now only one move wins. Can you find it?" (engine agrees: g2 wins, the alternatives to it draw or are slower) |
| 3 | 8/8/8/4p3/3k4/8/2K5/8 b | "What's the most straightforward way to promote the pawn?" (9) | Ke3 expected (engine +6.23 top; Ke4 +6.20; Kc4 +6.13) | **Kc4 (winning too) got a third feedback class: "is an alternative", "there's a faster path to victory. Try again."** So chess.com distinguishes correct, alternative-but-slower, and wrong. Engine shows all three win; the difference is about 0.1 pawn, so the label is about distance to promotion, not about winning or not [I] |

Not completed: challenges 4 and 5 of this lesson, and lessons 1 to 10 and 12 [not opened].
Evidence about difficulty [I]: challenge 1 is the standard "king in front of the pawn, critical squares" lesson, handled with 5 forced steps and a trap at step 1; there is no worked example before it. A learner who has not met "opposition" or "critical squares" has only the prompt phrase and hints.

## 4. Every Pawn Structure Explained (GM Johan Hellsten), Strategy

Course page [V]: lesson list of 30 structures (as the page says "now complete with 30 essential pawn structures"); the first dozen are: isolated d-pawn 21 min, hanging pawns 19, Carlsbad 20, Semi-Tarrasch 20, open Catalan 21, Exchange Slav 23, Scheveningen 27, Dragon 25, Maroczy 27, Botvinnik 23, Sveshnikov 22, Hedgehog 23, Advanced French (listed). Each 5 challenges. The blurb promises plans for both sides, tactics from each structure, thematic opening ideas. [V] Every structure is tied to an opening name, so the course is opening-led strategy [I].

### 4.1 Lesson 1, The Isolated d-Pawn (21 min listed, 5 challenges), challenge 1 only
Position: 2rqr1k1/pp2bp2/4pnpB/3bN3/2nPNQ2/8/PP3PP1/RB2R1K1, White to move [V]. Prompt: "What strong sacrifice should White play to start a powerful attack?" (11 words). Answer: Nxf7 (engine 3.30 for White vs 1.33 for Nxg6); the follow-up asks how to keep hunting the king. **The first challenge of a structure lesson is an attacking sacrifice from the structure's typical middlegame, not a question about the pawn.** [V] The structure is the setting, the tactic is the task.

## 5. Coverage and what the trial showed (summary)
- Covered with play: Every Chess Tactic Explained lessons 1 and 2 (full), Mating Nets lesson 1 (full), Absolutely Must Know Endgames lesson 11 (to challenge 3), Every Pawn Structure Explained lesson 1 (challenge 1).
- Category pages read: Tactics (about 25 courses), Strategy (about 28), Endgames (about 27); course pages read for Every Chess Tactic Explained, Mating Nets, Absolutely Must Know Endgames, Every Pawn Structure Explained.
- Not covered: Prophylactic Thinking, Candidate Moves, Calculation With Dvoretsky, Master Endgame Checkmates, How to Win With Zugzwang, Mastering the Endgame, How To Defeat A Pawn Weakness; second lessons of Mating Nets, Endgames and Strategy courses; one full course end to end per category (Mating Nets 1 of 5 lessons is the nearest). The explainer videos were not played.
- Design observations worth copying [I]: (1) the **contrast pair** (the same position with the other side to move, to show the refutation of an alternative); (2) the **named trap** feedback (stalemate); (3) a three-way verdict (correct, alternative, incorrect); (4) hint text that names the idea, no penalty shown; (5) game lessons that follow a game with a decision at each critical moment and a "hypothetical, then the real finish" pair.
- Weaknesses seen [I]: generic prompt "How should X win material?" gives no scaffold; hint 2 gives the move away so there is no graded hint ladder; no recap, no spaced review, no pattern name after the lesson; the order inside courses is by author, not by difficulty (king and pawn lesson 11 of 12); the lessons labelled Mastery start at full difficulty.

## 6. Continuation (second session)

### 6.1 Mating Nets lesson 2, Tatev Slays The Dragon (12 min listed, 5 challenges), played in full
Again one game followed in order, decisions at critical moments. Position of challenge 1 [V]: r1br2k1/pp3pbp/2n3p1/q2p4/3N4/2N1BP2/PPPQ2PP/2KR3R, White to move, "How should White start a strong attack in this complicated position?" (12 words). Accepted: h4, then h5, then hxg6 (three-move line). Engine [V, Stockfish 19 lite, depth 16]: h5 and h4 are the top two but only +0.5 to +1.4, so these are game moves in a roughly level position, not forced wins.

| # | FEN side | Prompt | Learner plays | Notes |
|---|---|---|---|---|
| 2 | r2r2k1/pp3pb1/4b1p1/q2pn3/3N4/2N1BP2/PPPQ2P1/2KR3R w | "Black has prepared Nc4 to start a strong attack, but White can strike first. How should you do it?" (19) | Bh6, then Bxg7 after ...Nc4/...Nxd2, then Bf6 | engine: Bh6 +4.4 (then Bxg7 +6.4); after ...Nxd2 the engine finds mate in 4 starting Bf6, and chess.com's praise says White "will soon checkmate on h8" [V]. The lesson lets Black's reply surprise the learner ("In the actual game Black tried Qb4. What would White play after Nxd2?") = a branch the game did not follow |
| 3 | r2r2k1/pp3pB1/4b1p1/3p4/1qnN4/2N2P2/PPPQ2P1/2KR3R w | "Black threatens checkmate, but White is the one with a winning attack. What did she play?" (17) | Rh8+ (accepted), then Nxe6+, Qh6+, Qf4+ | **Qh6+ at the middle step got "is an alternative: there's an even stronger check"**. Engine [V]: Nxe6+ leads to mate in 11 and Qh6+ is only +4.6 (not mate), so here the label is supported. Hint-free |
| 4 | r2r3R/pp4k1/4p1p1/3p4/1qn2Q2/2N2P2/PPP3P1/2KR4 w | "What sacrifice should White play to force a win in style?" (12) | Rh7+ Kxh7 Qf7+ Kh6 Rh1+ | engine: mate in 11 starts with Rh7+ (verified) |
| 5 | r2r4/pp3Q2/4p1p1/3p2k1/1qn5/2N2P2/PPP3P1/2K4R w | "How should White continue to hunt down the black king?" (11) | f4+ (Kg4), Qxg6+ (Kxf4), Qf6+, then Re1# | **Qxe6+ was labelled "an alternative": "Can you find the other strong queen check as well?"** Engine [V, depth 20]: Qxe6+ and Qxg6+ are both mate in 5 from that position, so the engine does not rank Qxg6+ higher; the "alternative" label is about the author's line, not about speed. chess.com's later wording "Almost there" etc. |

Ending [V]: last move a checkmate on e1; the bubble says only that the move is correct.
Technical note for other researchers [V]: when the Browser pane is hidden, the coach bubble text stops after its first sentence (praise follow-up sentences and the lesson-opening prompt did not render) and screenshots time out. Keep the pane displayed when reading bubbles. My FEN reader dropped a king while it was highlighted as the last-moved piece in one position; always check that the FEN has two kings.

### 6.2 Mating Nets lesson 3, Alekhine's Endgame Attack: started, then stopped
Challenge 1 position [V]: r1b1r1k1/6pp/4p3/1pqp1p2/p2P4/4PN2/PP3PPP/2R2RK1, White to move. The prompt did not render (pane hidden). Rxc5 (capturing on c5, where Black has a queen on the screen) was accepted as correct; engine [V] puts Rxc5 first at +1.86 with Ne5 and dxc5 also fine. Not continued.

### 6.3 Mating Nets lesson 3 (Alekhine), progress on resume
Challenge 1 [V]: Rxc5, then Rfc1 ("How did Alekhine improve his f1-rook?"), then Ne5 were all accepted; the first bubble after Rxc5 says White has the better minor pieces and the only open file (26 words). Challenge 2 starts at rr4k1/6p1/b3p2p/2RpNp2/p2P4/Pp2PP2/1P4PP/2R3K1, White to move; engine [V, depth 16] top choices Rc7 (+2.8), Nd7, Kf2 within 0.35 pawns of each other, so the position is a slow squeeze, not a tactic. The prompt did not render (pane hidden again). Stopped here.
