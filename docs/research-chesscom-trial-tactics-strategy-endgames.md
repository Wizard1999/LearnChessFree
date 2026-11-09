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

### 6.4 Mating Nets lesson 3, Alekhine's Endgame Attack (12 min listed): played in full
Game: Alekhine - Yates, 1922 (named in the praise text at the end). Opening position r1b1r1k1/6pp/4p3/1pqp1p2/p2P4/4PN2/PP3PPP/2R2RK1, White to move. All five challenges follow the game; **challenge 1 and 2 have no tactic at all**: plans in a slow rook endgame (Rxc5, Rfc1, Ne5; then Kf2, h4, Kg3). The prompts name the plan ("How did Alekhine improve his f1-rook?", "How did Alekhine continue to activate his king?", "How did Alekhine grab space with a pawn on the kingside?"). [V]
- g4 (instead of h4) in challenge 2: **"is an alternative. This is reasonable, but Alekhine grabbed space with another pawn."** The label is about the game line. Engine [V, depth 16] puts the position's top moves within 0.35 pawns, so the alternatives are genuinely close.
- Challenge 4 (rr4k1... after Rcc7 and Nd7): Nc5, the engine's first choice (+5.35), was labelled "an alternative: there's an even better square for the knight. Try to make a strong threat." The accepted move was Nf6 (attacks the defender of g7), after which Rxg7 is mate in 8 by engine [V]. So the "even better" claim holds for the line, and the engine's depth-18 top move missed the stronger idea until Rxg7 was on the board [I: engine horizon]; I did not check Nf6's own evaluation separately.
- Challenge 5: Ke5 (mate in 7), and the closing sub-question "If Black defended the rook then White could checkmate. How?" Rh7+ Kg8 Rcg7# (mate in 2, verified).
Feedback pattern [V]: every wrong or alternative move triggers the same retry flow; praise sentences point at the next goal in the game's story ("The king soon landed on f4 and eventually ended up on e5").

### 6.5 Mating Nets lesson 4, Judit Polgar Goes Catches a King (12 min listed): played in full
Game: Polgar - Dominguez, 2011 (named at the end). Opening position r2b3k/... with **Black to move**: "White has a dangerous attack, but precise defense can still win for Black. Try to find it." (18 words). So a mating-nets course starts with the defender's task: Kg8, Bxf6 (engine [V, depth 18]: Kg8 +2.2 for Black, Bxf6 +2.0, others lose). Challenge 2 is a hypothetical branch ("Black could have tried Bg7... what cunning idea did Polgar prepare?") Ne7, Rxh6+, Qxh6# (mate in 2 verified). Challenge 3 continues the real game (Rxh7+, Qh6: "the key move of the attack"), challenge 4 a second hypothetical (Rh8+ Bxh8 Ne7#, mate in 2 verified), challenge 5 the game finish (e5, Kxg1, Kf1; praise says no defence to mate on h8 or g7). Pattern of lessons 1-4: odd challenges follow the game, even ones show the mate that would have happened in a side line [V]. Engine (depth 18) agreed with the first move of each challenge, except that it gave e5 in challenge 5 as mate in 6.

### 6.6 Mating Nets lesson 5, An Amazing Study (Kasparyan) (10 min listed): played in full
A composed study, not a game; White Kg8, Bc8, Nf5 against two rooks. Challenge 1 starts with Black to move: "White's tried the tempting Nf5 on the first move, but Black can escape. How?" Engine [V]: Kg4 is the only move that holds (0.00; Kg6 loses to a forced mate), and chess.com accepts Kg4 then Kf3.
- **Checkmate labelled "an alternative" [V, python-chess]:** in challenge 2 (4N1K1/8/7p/5Bpk/5r1P/6P1/7r/8 w, after Bxf5 Rxf4) both Nf6# and Ng7# are legal mates. chess.com accepted only Ng7#; the mate Nf6# got "This is a great checkmate! Can you find another one?" So the lesson asks the learner to find both mates, and shows the second as the solution. A learner who finds the first mate is told it is not what the author wanted, though it ends the game. [V]
- Challenges 3-5: "checkmate in two moves" prompts, with a quiet knight move (Ng7) before the mate at the end; engine confirms mate in 2 each time. The final praise, "What an amazing study!".

### 6.7 The complete Mating Nets course: what the five lessons show [V unless marked]
- 25 challenges, 57 listed minutes. My play took about 15-20 minutes per lesson including engine checks.
- Course arc: three famous games, one modern game, one composed study; each lesson 5 challenges; the same device (question that ends in "how did X..."; a hypothetical side line before the real finish).
- Difficulty: lesson 1 starts with a positional choice (h6/g5/h5), lesson 3 opens with two plan questions in a slow endgame; the mating tactic only arrives in the last two challenges. Lesson 5 is a study where each answer is a single move. Challenge count per lesson is constant, but number of plies the learner plays per challenge varies from 1 to 5.
- The "alternative" label appears in 5 places over the course (Qh6+ in lesson 2; Qxe6+ lesson 2; g4 lesson 3; Nc5 lesson 3; Nf6# lesson 5), always for a move that is good but not the author's line; once for a legal checkmate. Engine checks: supported once (Qh6+: Nxe6+ leads to mate in 11), not supported in three (Qxe6+ and g4 are tied with the author's move; Nc5 is the engine's own first choice at depth 18, ahead of the author's Nf6), and Nf6# is a legal mate.
- Ending: Lesson Complete modal with one Finish button (as in section 0), then the Learn path. No summary of the course, no review, no certificate.

## 7. Calculation With Dvoretsky, lesson 1 "Counter Chances Part 1" (played, 5 of 5 challenges)

Course page [V]: 6 lessons, 231 min, 30 challenges (5 each): Counter Chances 1-2, Candidate Moves 1-2, Prophylaxis 1-2. Lessons are listed at 32-44 min, so they almost certainly include long video parts that I did not watch [I]. Built on a 2016 interview with Dvoretsky [V, course blurb].

Format [V]: interactive board, 5 challenges, coach bubble. The intro bubble says the opponent is not passive and you must find their ideas too. No examples before the first task (the first challenge comes straight away) [V].

| # | FEN (side) | Prompt (paraphrase, words) | Accepted and checked |
|---|---|---|---|
| 1 | 3r1k2/ppr2pp1/q2Np2p/4n2P/6Q1/P5P1/5P2/3RR1K1 w | "What shocking tactic wins material" (7) | Nf5 queen offer, then Rxd8#; mate in 1 engine-checked [V] |
| 2 | 3r1k2/ppr2pp1/q1nNp2p/4P2P/6Q1/P5P1/5P2/3RR1K1 b | "What calm move keeps a decisive advantage" (8) | Rcd7 (+1.78 at depth 18, next best Kg8 +1.23) [V]; feedback names the two threats (Nxe5, Qxa3) |
| 3 | 8/8/6p1/4R2p/7P/6Pk/3r4/6K1 w | "What fantastic resource allows White to hold a draw" (9) | Re6, Rg2+ Kh1 Rxg3, then Rxg6 stalemate trap. Engine: Re6 -0.26, other tries lose. Rxg6 is the only move (0.00) and Rxg6 Rxg6 is stalemate [V] |
| 4 | 8/8/6p1/6Rp/7P/6Pk/3r4/6K1 b | "How can Black refute White's Rg5 defense" (7) | Rg2+ Kh1 Rf2 Kg1 Rf6, a waiting-move zugzwang. Engine +5.06. After Rf6 every white move loses: Kh1 allows a mate in 1, rook moves about -5 [V] |
| 5 | 6k1/R4pp1/5q1p/8/4B3/1rr1P1Pb/1Q3P1P/2R3K1 b | "What surprising move allows Black to win" (7) | Qxf2+ Kxf2 Rxb2+ Kf3 Rxc1; engine +7.08, other tries about 0.00 [V] |

Observations
- Prompts are the shortest seen so far (7-9 words) and never name the idea; each asks for a "surprising", "calm" or "fantastic" move, which only hints at the category [V].
- Multi-move challenges: the lesson auto-plays the opponent, praises each step with a one-line "what now" ("How should you attack after Kxf2?"), so the learner calculates a line move by move rather than being given a single answer [V].
- Challenge 4 is a mirror of challenge 3: it shows the line the author's side would have to refute (the tempting alternative Rg5), a "prove the other side's idea fails" pattern. Worth copying for the contrast lab [I].
- Feedback on correct moves explains the consequence, e.g. in challenge 3: the bubble said that if Black takes the rook it is stalemate, and otherwise a simple draw. Engine agrees on the draw [V].
- Difficulty ramp: 1 forcing tactic, 2 quiet move, 3 drawing resource, 4 zugzwang, 5 deep combination. Not a smooth ramp; it alternates idea types [I].
- No wrong move was entered in this lesson, so wrong-answer feedback was not seen here.

## 8. Calculation With Dvoretsky, lesson 3 "Candidate Moves Part 1" (played, 5 of 5)

Format [V]: after Start the lesson went straight to challenge 1 (no video seen in the pane; the page showed an "Explainer Video" label before Start, not opened). Ends with a "Lesson Complete" screen.

| # | FEN (side) | Prompt (paraphrase, words) | Result |
|---|---|---|---|
| 1 | 4k3/2p2r1p/1p1p2rP/pPqN2P1/2P1pP2/8/PQ4RK/8 w | White is an exchange down for an attack: "how should you continue" (16) | f5 (decoy), then Qh8+ Rf8 Qxh7. Engine top (+1.57); Qh8+ at once only +0.44. After f5 Rxf5, Qh8+ is +8.25 [V] |
| 2 | 7Q/2pk1r1p/1p1p2rP/pPqN1PP1/2P1p3/8/P5RK/8 b | "How can Black hold on in this difficult position" (9) | Rxg5 Rxg5 Qf2+ Kh3 Qf3+, perpetual check. Engine 0.00; next best -4.25 [V]. Feedback says White cannot escape the checks (consistent with 0.00) |
| 3 | QR2rq1k/2p3p1/3p1pPp/4p3/4P3/8/2r3PP/1R4K1 b | "How should Black defend this difficult position" (8) | Ra2, White Rxe8, Rxa8 wins material (+1.83). Ra2 and Rc1+ both 0.00 for the engine; Ra2 was accepted [V]. Challenge ends after Rxa8 with a claim of an easy endgame win; engine +1.83, not "decisive" [V] |
| 4 | 1R2rq1k/2p3p1/Q2p1pPp/4p3/4P3/8/2r3PP/1R4K1 w | "How should White take advantage of Black's vulnerable back rank" (11) | Qb5 Rxb8 Qxb8 Rc1+ Kf2; feedback says Black's only way to stop mate loses a whole rook. Engine Qb5 +6.63, Kf2 +6.63 [V] |
| 5 | 4q2k/2p3p1/Q2p1pPp/4p3/4P3/8/2r3PP/1R4K1 w | "How should White continue the attack" (6) | Qa4 Qxa4 Rb8+ Qe8 Rxe8#. Engine Qa4 +3.57, then mate in 2 [V] |

Observations
- All five challenges come from one Dvoretsky game and run backward: 3, 4 and 5 are earlier and earlier moments of the same combination, challenge 5 ends in mate. So the learner replays the same position family at increasing depth [V from FENs: same pawns g6/g2/h2/e4/e5 throughout].
- The lesson's title is "Candidate Moves", but no prompt mentions candidates. The skill is shown, not named: the bubble comment after a correct move often lists a rejected try ("Black would have been better off with Rxg2+", challenge 5) [V].
- Defensive prompts ("hold on", "defend") are half of the tasks (2 and 3), unusual for tactics courses [V].
- In challenge 3 the author's answer Ra2 was accepted while the engine rated Rc1+ equal; no "alternative" label appeared since I only tried the engine's pick. The claim "convert into victory" rests on +1.8 [V].
- Wrong-answer feedback was again not seen: engine-first play means I never entered a wrong move here.

## 9. Prophylactic Thinking (Yusupov), lesson 1 "Prophylactic Thinking" (played, 5 of 5)

Course page [V]: 7 lessons, 236 min, 35 challenges, Yusupov with Gustafsson, released 3/6/2024. Lesson 1 is listed at 51 min, the longest in the course; lessons 2-4 are 22-25 min. Format [V]: an intro screen shows the stem game's position (Yusupov-Gavrikov, Zurich 1994) with a blurb and a Start button next to an "Explainer Video" button (not opened); then 5 interactive challenges. A pure-text board lesson here would have to replace the video, so the 51 minutes are mostly not the challenges [I].

| # | FEN (side) | Prompt (paraphrase, words) | Result |
|---|---|---|---|
| 1 | r2r2k1/1p1n1pb1/1qp1p1pp/p7/2BP1B2/4PP2/PPQ2P1P/2RR3K w | "How can White launch a powerful attack" (7) | Bxe6 fxe6 Qxg6; engine +2.34 then +2.84 [V]. Ends after two white moves |
| 2 | r4rk1/pp3p2/1qp3pp/4b3/2B5/4PP2/PP1Q1P1P/2RR2K1 w | "How should White fight for the initiative" (7) | Qc2 (+0.92, engine top), then Rd7 Qxb2, then Qxb2 (accepted) |
| 3 | r4r2/pp1R1pk1/2p3pp/8/2B5/4PP2/Pb3P1P/2R3K1 w | "What's the best way for White to save the c1-rook" (11) | Rc2, then Bb3, then Rxc6 (all engine top, +1.08/+0.99) |
| 4 | 2rr1nk1/1p2bp2/1qp1p1p1/p1R4p/P2P3P/1B2PPB1/1PQ2P2/2R4K w | "White's rook is in danger, but Black is the one in trouble... launch a winning attack" (about 20) | Rxh5 gxh5 Rg1+ (engine +1.04, then +6.83) [V] |
| 5 | 2rr2k1/1p2bp2/1qp1p1n1/p6p/P2P3P/1B2PPB1/1PQ2P2/6RK w | "What powerful sacrifice gives White a winning attack" (8) | Bxe6 Kh7 Qf5 Rg8 Be5. Engine +8.22 and then mate in 8, mate in 6 [V] |

"Alternative" feedback seen (first wrong-answer-flow data in these courses) [V]
- Challenge 2, second move: f4 was rated "an alternative: strong attacking idea, but there's a capture that's even more precise, try to find it". The author's Qxb2 (+1.15) was the expected move; the engine prefers f4 (+1.47) at depth 20. So the label contradicts the engine on this one: the claim "even more precise" is not supported [V]. (Position: r4r2/pp1R1pk1/2p3pp/4b3/2B5/4PP2/PqQ2P1P/2R3K1 w; f4 Qxc2 Rxc2 Bf6 Rxb7 +1.47.)
- Mechanism: the move stays on the board with the green retry button lit; the learner must press retry to take it back. The hint is given in words ("a capture"), narrowing the search to a piece type, not a square [V].

Observations
- The title concept (prophylaxis) is never named in the prompts. Five tasks are attacking and sacrificial; the lesson teaches prophylaxis by showing its result (Yusupov's moves 'prevent' counterplay) in the video, not in the challenges [V on prompts, I on the video].
- Challenge chain: bubble text "You can continue the game in the next challenge" appears, so 2-3 and 4-5 form continuous runs from one game; the learner plays the same side to the end [V].
- Praise strings vary ("A brilliant move!", "A beautiful move!"), and the follow-up is always a question ("How can you justify the sacrifice?"), then the next move [V].

## 10. Master Endgame Checkmates, lesson 1 "Checkmate With Two Bishops" (played, 5 of 5)

Course page [V]: 5 lessons, 63 min, 25 challenges, released 6/17/2021. Lesson times: 4, 7, 13, 21, 18 min (two bishops 4 min; bishop and knight 7 min; three queen-vs-rook lessons by GM Friedel 13-21 min). Lesson 1 is by NM Sam Copeland. This is the shortest lesson format seen in the trial, and it matches the lengths our own early lessons target [I]. Format [V]: intro screen with a one-paragraph blurb ("the defending side may sacrifice a piece to eliminate the last pawn") and the starting position, then Start; 5 interactive challenges; a "Lesson Complete" screen.

| # | FEN (side) | Prompt (paraphrase, words) | Result |
|---|---|---|---|
| 1 | 8/8/5k2/8/5KB1/8/5B2/8 w | "What's the one move that White can play to force Black's king to immediately retreat toward the seventh rank?" (about 20) | Bf5 (g4-f5). Python: after Bf5 the black king's only moves are e7, f7, g7, and no other bishop move gives that [V]. No coach text appeared, only a green check; the learner presses next [V] |
| 2 | 8/8/8/2KBB3/k7/8/8/8 w | "Now that Black's king is caught on the edge... how can you make the black king advance to a5" (about 28) | Bb2 (e5-b2) is the only move that leaves Ka5 as Black's only legal move [V by python]; then Bb3 (engine mate in 9 line) |
| 3 | 6k1/8/6K1/2B5/B7/8/8/8 w | "How should White force the black king toward the corner" (9) | Bb3+ Kh8 Bd4#; engine mate in 2 [V] |
| 4 | 2B4k/8/1B4K1/8/8/8/8/8 w | "How can White checkmate in just three moves" (8) | Bc5 Kg8 Be6+ Kh8 Bd4#; engine mate in 3, next best mate in 4 [V] |
| 5 | 8/8/8/8/5B2/6KB/8/7k w | "How can White checkmate in two moves" (7) | Bg2+ Kg1 Be3#; engine mate in 2 [V] |

Observations
- Prompts state the mate depth ("in two moves", "in just three moves") from challenge 4, a pure find-the-mate design with a uniquely solvable target; the answer is checkable by search, which would fit our validator [V on prompts, I on fit].
- Challenges 1-2 ask for a restricting move, not a mate: the instruction says what the move must do ("force the king to retreat to the seventh rank"), so the learner tests candidate moves against a stated effect. This is checkable by counting the black king's legal replies (done above) [V].
- Difficulty ramp is clean and short: shape of the net (1-2), then forced sequence from the edge (3), then two mates with the bishops already placed (4-5) [V].
- Feedback is minimal here: "Good start!", "Well played!", "Where's the mate?" Often just praise and the next question. In challenge 1 there was no text at all [V].
- Wrong-answer feedback not seen (engine and rule-first play).

## 11. How To Win With Zugzwang (Bojkov), lesson 1 (played, 5 of 5)

Course page [V]: 5 lessons, 59 min, 25 challenges, released 9/13/2023. Lesson times 13, 8, 10, 12, 16 min. Lesson 1 listed at 13 min (blurb: use zugzwang to win common endgame positions). Format [V]: intro screen with the starting position and blurb, then Start, 5 interactive challenges. All five are pawn or minor-piece endgames, the whole course is about one idea.

| # | FEN (side) | Prompt (paraphrase, words) | Result |
|---|---|---|---|
| 1 | 8/8/8/2p5/2P5/k2K4/P7/8 w | "How can White win the pawn ending" (7) | Ke4 (only winning move: +6.35; Kd2, Kc3 are 0.00), Ka4 Kd5. Kd5 accepted; Ke5 and Ke3 are also +6.3 for the engine and were not tried [V] |
| 2 | 8/8/8/2pK4/1kP5/8/P7/8 w | "How can White win the ending" (7) | a3+ Kxa3 Kxc5, bubble: "the pawn cannot be stopped". Engine: a3+ and a4 both winning (+16), Kd6 0.00 [V] |
| 3 | 8/8/4k1P1/4p1p1/4K3/3P4/8/8 w | "What precise move allows White to win the pawn ending" (10) | g7 (+5.71; d4 and Ke3 0.00), then Kf5, Kg4, Kxg5, then Kh6 ("the only way to win"), dxe4 [V] |
| 4 | 6k1/6P1/8/4p1K1/8/3P4/8/8 b | "What clever defense allows Black to save the game" (9) | e4! dxe4 Kxg7 Kf5 Kf7 (engine 0.00; the other tries -7) [V]. Coach: "White has no way to make progress" |
| 5 | 8/5bk1/4p1p1/3pP1K1/1p1P4/1P1B1P2/8/8 w | "How should White use a series of zugzwangs to win material" (about 13) | Bb5, then Be8, then f4; Black's four legal replies all lose the g6 pawn, engine +6.0 to +7.6 [V]. Barca-Videman 1958 (game source named by the coach) |

Observations
- A concept-named lesson ("zugzwang") in which the prompts never say the word, except challenge 5 ("a series of zugzwangs") [V].
- Challenge 3 is a long forcing line (6 white moves). Only the move g7 is clearly best at move 1 and Kh6 at move 4, with no hints. The bubble gave a verdict on the move already played and a question ("How should White keep control?") for the next [V].
- Both defender tasks (challenge 4) and attacker tasks (1-3, 5) mix in one lesson, one defender task in five: unlike the tactics lessons, losing sides get a move to find too [V].
- Where more than one move wins (1: three winning kings moves; 2: a3+ and a4), the lesson accepted the move I tried, but the "only move" claims in challenges 3 and 4 match the engine: Kh6 is the only win (+5.95), dxe4 only draws (0.00), Kf7 is the only draw [V]. This matters: the lesson text says "only" and it is true.
- Difficulty: 1-2 shortest wins, 3 and 5 long ones. The ending of 5 comes from a real game, not a study [V on the coach text].

## 12. Every Pawn Structure Explained, lesson 1 "The Isolated d-Pawn" (finished, 5 of 5; completes section 4)

Format [V]: intro screen with the blurb ("the most famous structural imbalance in chess; GM Johan Hellsten explains the key ideas for both sides") and a position from challenge 1, then Start and 5 challenges. The 5 challenges come from 5 different games, each named in the praise bubble after the last move (Rapport-Yu 2020, Fier-Moina 2020, Karpov-Spassky 1979, Lukacs-Klundt 1994). The concept (the isolated d-pawn) shows up in the prompts only as "keep d4 under control", "pressure against d5", "attack for the side with the isolated pawn". Challenge 1, the Nxf7 sacrifice, is described in section 4; its full line is Nxf7 Kxf7 Ng5+ Kg8 Bxg6 (engine +6.36) [V].

| # | FEN (side) | Prompt (paraphrase, words) | Result |
|---|---|---|---|
| 2 | 2rqr1k1/pb3ppp/1pn1p3/8/3P1b2/P1NQ1N2/BP3PPP/3RR1K1 w | "White has more active pieces and can advantageously open the position. How should you do it?" (16) | d5! (+2.26; best), exd5 Qf5 (a counter-intuitive delay of the recapture), Rxe1+ Rxe1 Bh6 Nxd5. Rapport-Yu 2020. Engine +2.24 at the end [V] |
| 3 | r2q1rk1/1p3ppp/p1n2n2/2bp4/7N/1PN1P2P/PB2bPP1/R2Q1RK1 w | "How did GM Fier recapture on e2?" (7) | Nxe2 (+0.45) accepted at once; Qxe2 is +0.19 [V]. Then "How should White further control d4?" Nf4 was marked incorrect; Nf5 accepted (+0.84, Fier-Moina 2020) |
| 4 | 3r2k1/pp2bpp1/1qr1b2p/3p4/8/P1B1PB2/1P2QPPP/3R1RK1 w | "How did world champion Karpov prepare to form a battery against the d5-pawn?" (14) | Rd3 (+0.45), Rfd1 (+0.69), R1d2 (+0.77), Qd1 (+0.76); each praised, with a "how do you add the fourth attacker" follow-up. Karpov-Spassky 1979 [V] |
| 5 | 2rqr1k1/1p2bp1p/p1b1pnpB/3nN3/3P4/2N3R1/PP3PPP/1BRQ2K1 w | "How should White break open the black kingside?" (9) | Bxg6 fxg6 Nxg6 hxg6 Qd3 Kh8 Qxg6 Rg8 Bg7+ Rxg7 Qxg7#; engine +4.79 at the start, +8.15, mate in 4, mate in 2. Lukacs-Klundt 1994 [V] |

Wrong-answer flow seen [V]
- Challenge 3, second move: Nf4 got the label "incorrect" and the sentence "there's a stronger option... look for a way to increase your control of d4". I checked it: after Nf4 White still stands about +0.46, compared with +0.84 for Nf5 (depth 22). So "incorrect" was applied to a move that keeps a half-pawn edge and loses only 0.38 [V]. The earlier "alternative" label (Prophylactic Thinking section 9) is for a move that was better than the author's. Neither label follows the engine's gap; both follow the author's line [I].
- Retry: the red/green retry arrow beside the hint button lets the learner take it back. The hint is in words and gives the goal ("increase control of d4") without a square [V].

Observations
- "How did GM X play" prompts (challenges 3 and 4) are recall-flavoured ("How did GM Fier recapture", "how did Karpov prepare...") yet the engine's top move was accepted each time; they are really "find the master's move" tasks. A learner who recalls the game would shortcut the thinking; one who does not must reason from the structure [I].
- The praise bubble often ends with a named game and the result ("soon won in..."). That is a motivation device, not an engine claim. Where it states a strategic claim, I checked it: "eventually White can play e3-e4 to win the pawn" (Karpov-Spassky, challenge 4) is not engine-supported as a forced win: the position after Qd1 is only +0.76 [V].
- The structure lesson is attack-heavy: 3 of 5 challenges end in a kingside attack on the d-pawn side's own king, and the "ideas for both sides" (blocking and the isolated pawn's defence) are not tested at all. All five challenges are played from the side with the isolated pawn; Black never gets a task [V]. This differs from Dvoretsky's mirror pairs.
