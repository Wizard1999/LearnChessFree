# chess.com trial: intermediate courses (8 Nov 2026, second session)

Method as in `research-chesscom-trial-beginner.md` (Round 2 note): Andrew's own trial, my own tab, FEN read from the lesson board markup, engine checks with `tools/engine.py` (Stockfish 19 lite, depth 14). Labels [V] seen, [I] inference. Course data (lesson counts, minutes) from `research-chesscom-progress.md`.

## Make the Most of Your Pieces (2018, Chess.com Team; level badge I; 7 lessons, 35 challenges, 18 min on the course page) [V]
Lessons: Using Your Knights, Bishops, Rooks, Queen, King, Pawns, Pieces Working Together (listed minutes 3, 2, 1, 2, 4, 2, 4). Course order is piece by piece, then the pieces together [V from the course page].

### Lesson 1 "Using Your Knights" (5 challenges, listed 3 min) [V]
Intro bubble (about 25 words): knights are best in the centre where they can control up to eight squares; they work well with queens and block pawns. No video needed to start (Start + Explainer Video).

| # | Position (FEN board, side) | Prompt (words) | Accepted | Wrong-answer feedback |
|---|---|---|---|---|
| 1 | r1bq1rk1/pp1nbppp/2p1pn2/3p2B1/2PP4/4PN2/PP2BPPP/RN1Q1RK1 w | "Where is White's knight on b1 best placed?" (9) | Nc3 | Na3: red, 32 words: the knight on the edge controls only four squares, none central; asks for a more active square. Right-answer text names the e4 square and pressure on d5. |
| 2 | 5k2/2r3p1/5p2/8/3N4/6P1/5P1P/6K1 w | "How should White win material?" (5) | Ne6+ (Kf7), Nxc7: fork of king and rook | Not tested. After the fork the next prompt is only the hint-style line "Capture the rook!" because I pressed Next early (shown as "Hint"). |
| 3 | 4r1k1/pb3p1p/1p2p2p/1P1qP2N/P7/1QR4P/5PP1/6K1 w | "How can White use a knight to attack three important pieces at the same time?" (15) | Nf6+ (Kf8), then Nxd5 | Qxd5 (queen trade): red, "only an even trade; how can we capture the queen with a less valuable piece and win material?" Note: engine puts Qb4+ at +15.4 and Nxd5 at +15.3, both winning outright, so the key idea (take the queen with the knight) is a teaching choice, not the only winning route [V engine]. |
| 4 | 2b1r1k1/1p2r1pp/p1p1p3/2Pp4/1P6/P3PN2/5PPP/1R1R2K1 w | "Black's bishop and rooks want to become more active once the e6-pawn moves. What is White's best move in this position?" (23) | Ne5 (blockades e6) | Not tested. Correct text (about 30 words) says the knight enjoys a great central square and blockades the e6 pawn. A positional challenge mixed into a tactical lesson. |
| 5 | 3r2k1/p4pp1/1p5p/8/8/PbPp1N2/1P3PPP/4R1K1 w | "Black is ready to play d2 and promote the pawn. How can White best defend against this dangerous pawn?" (19) | Nd2 (only move: engine +0.2; alternatives -4.6) | Re4: red, "does not prevent Black's plan to advance the d-pawn". Correct text: the knight blockades the passed pawn and attacks the b3 bishop. |

Shape [V]: first lesson of the course is the piece-by-piece pattern (central square, fork, three-piece fork, blockade, defence), mixing positional and tactical ideas across five challenges; four of five solved in one move, no two-move challenge except the fork. Feedback style: named reason in red answers when the wrong move is one the author anticipated; generic "try again" where not. About 12 minutes.

## Forcing Moves (2018, Chess.com Team; level badge I; 5 lessons, 25 challenges, 18 min) [V course page]
Lessons: Powerful Moves 3 min, Combinations 2, Checkmate in 3 Moves 4, Queen Sacrifices 6, Saving Draws 3 (listed minutes). Concept order: define forcing moves, then chains of them (combinations), then a longer mate, then a sacrifice, then using forcing moves to draw.

### Lesson 1 "Powerful Moves" (5 challenges, listed 3 min) [V]
Intro bubble (about 33 words): forcing moves are checks, threats and captures, moves the opponent must answer at once or lose material or the game. Every challenge is a position where the forcing move beats a natural quiet move.

| # | Position (FEN board, side) | Prompt (words) | Accepted | Wrong-answer feedback |
|---|---|---|---|---|
| 1 | r1bqk2r/1pp1b1pp/p1p2p2/4N3/3Pn3/2P5/PP3PPP/RNBQ1RK1 w | "Black just played ...f6, attacking White's knight. Does White have to retreat, or can you find a powerful move?" (19) | Qh5+ (...g6 forced), Nxg6: two learner moves; engine Qh5+ +5.3, next best +0.8 | Nf3 (retreat): red, "nice try, but there is a much stronger move". Text after Qh5+ explains the ...g6 is forced to stop Qf7#; text after Nxg6 says the h7 pawn is pinned. |
| 2 | r1br2kb/p3pp1p/2pp1npB/q7/4P3/2N5/PPPQBPPP/R4RK1 w | "Black's king cannot move and Black's unprotected queen is on the same diagonal as White's queen. Find a powerful move for White." (22) | Nd5 (discovered attack; ...Qxd2), then Nxe7# | Rab1: "nice try, there is a much stronger move". The correct text says "threatening checkmate and capturing the queen at the same time"; the lesson lets the queen go (a two-move sequence where the first move gives up the queen for mate). Engine Nd5 +5.7, others about +0.1 [V]. |
| 3 | r5k1/p1pqn1pp/2pp1r2/5p2/1bP5/4P1P1/PP3PBP/R1BQ1RK1 w | "Can you find powerful moves to take advantage of Black's vulnerable bishop?" (13) | a3 (...Bc5), b4 (...Bb6), c5: three learner moves chasing the bishop | Qa4 (engine +4.0, sound, attacks the bishop): red, "not a bad idea, but we want to attack the dark-squared bishop another way". Bb2 (engine +6.5, near the best): orange "is an alternative", "an excellent power move ... can you find an even more powerful move that wins a piece?" So the orange state is used when the move is about equal to the main line. Correct c5 text: bishop trapped, d6 pawn pinned to the queen. |
| 4 | r1b2r2/pppp1pkp/2n2n2/8/q7/2PB1P2/P1PQ2PP/R4RK1 w | "White has sacrificed two pieces to open lines of attack against Black's king. Let's use power moves to win the game!" (22) | Qg5+ (...Kh8), Qxf6+ (...Kg8), Qg5+ (...Kh8), Qh6: four learner moves; engine: Qg5+ mate in 6, next best -4.9 | Not tested. The text asks questions step by step ("Can you force the king back into the corner and then threaten mate in two?"). Qh6 text: "threatens Qxh7 and Qxf8 checkmate, Black cannot defend against both" [not checked; the engine line continues ...Qd4]. |
| 5 | r1bqkb1r/pp3ppp/2n1pn2/1B1P4/3Q4/2N5/PPP2PPP/R1B1K1NR w | "Can you find a powerful combination that destroys Black's position?" (11) | dxc6 (...Qxd4), cxb7+ (discovered check from the b5 bishop; engine dxc6 +6.7, next best +1.1) | Bg5: red, "this is a strong move, but there is a powerful combination that wins material" (engine +1.1). Lesson ends on cxb7+ with the text promising the rook capture next. |

Shape [V]: the longest-chain lesson so far, with two challenges of four moves, each step spoken by a bubble question; wrong answers are consistently a pointer to "something stronger" rather than a reason. The orange "alternative" state appears (challenge 3) and matches the engine margin. Ended on Lesson Complete with Finish. About 20 minutes with probes.

## Reading the Board (2018, Chess.com Team; level badge I; 7 lessons, 38 challenges, 40 min) [V course page]
Lessons: Pawn Structures 3 min, Pawn Chains 5, Space 4, Open Closed Semi-open Games 7 (6 challenges), Push Capture or Ignore 4, When to Trade Pieces 5 (7 challenges), Advanced Chess Notation 12.

### Lesson 1 "Pawn Structures" (5 challenges, listed 3 min) [V]
Intro bubble (about 30 words) defines connected, doubled and isolated pawns in one sentence. Every challenge is a pawn-structure decision in a pawn endgame or a simplified middlegame, so this is the first lesson of the three read so far that is truly strategic.

| # | Position (FEN board, side) | Prompt (words) | Accepted | Wrong-answer feedback |
|---|---|---|---|---|
| 1 | 1k6/6p1/5p1p/8/7K/6P1/5P1P/8 b | "White's king is threatening to attack Black's pawns. What is Black's only move that doesn't lose?" (16) | g6 (pawn wall; engine g6 -0.5, every other move -7 or worse) | Kc7: "this move allows Kh5, when Black's pawns will fall" (specific, true). Correct text: pawn wall, the king can attack nothing, a draw is likely. |
| 2 | 8/8/1pp2kp1/p1p1p2p/K1P1P3/1P4PB/7P/8 w | "How can White attack the c6-pawn before Black has a chance to defend it?" (14) | Bd7 (engine +6.0; next best Ka3 +2.2) | Ka3: "this move does not attack the c6 pawn" (literal and accurate). |
| 3 | 8/8/2b5/p6k/Pp5p/1P3N1P/1K4P1/8 b | "Black's only winning move is based upon creating two isolated pawns ... for White - find the move!" (20) | Bxf3 (gxf3), Kg5, Kf4: three learner moves (engine Bxf3 +5.9; Bd7 0.0) | Bd7: "does not force isolated pawns for White". The prompt names the theme (isolated pawns) so the task is to find the move that creates them. |
| 4 | 8/2k3p1/3p1p1n/3p4/3P2P1/5PK1/3BP3/8 w | "Can you find White's only winning move in this position?" (10) | Bxh6 (gxh6; engine +6.0; Kh4 only +0.3) | Kh4: explanation of the knight route (...Nf7-e7 covers g6) shown as text. Correct text counts "three pawn islands" and says all Black pawns are isolated, which is true of the d-pawns (doubled) and f6, h6 [I]. |
| 5 | 2b5/6k1/p2pprp1/2p4p/2P1P3/1P3P2/P4NP1/2R3K1 w | "White to move. Can you find a temporary sacrifice that ruins Black's pawn structure?" (14) | e5 (...dxe5), Ne4 (engine e5 +2.2; Nd3 +0.8) | Nd3: "does not ruin Black's pawn structure". Correct text: "Black now has four pawn islands and several weak pawns", then Ne4 attacks c5. |

Shape [V]: only-move prompts ("only winning move", "only move that does not lose") in three of five challenges, and the engine agrees each time [V engine]; wrong-answer text is literal and short. The lesson never teaches a defence of the term "pawn island" before using it in a bubble. Ended with Lesson Complete + Finish. About 18 minutes with probes.

## Understanding Endgames (2018, Chess.com Team; level badge I; 7 lessons, 35 challenges, 21 min) [V course page]
Lessons: Passed Pawns 2 min, Escort the Pawn 4, Sacrificing to Promote 3, 3 vs 3 Pawn Breakthrough 3, Exchanging Down to a Win 3, Rule of the Square 3, Creating a Passed Pawn 3. Concept order: the passed pawn as the winning asset, then how to help it, then breakthrough and counting tools last [V from titles].

### Lesson 1 "Passed Pawns" (5 challenges, listed 2 min) [V]
Intro bubble (about 28 words): a pawn with no opposing pawns that could ever block or capture it is likely to promote in an endgame. Promotion uses a piece picker (queen, rook, bishop, knight shown stacked on the promotion square, with a cancel cross) [V].

| # | Position (FEN board, side) | Prompt (words) | Accepted | Wrong-answer feedback |
|---|---|---|---|---|
| 1 | 8/KP6/6P1/3kb3/8/8/8/8 w | "Which pawn should you advance to force a winning queen vs bishop ending?" (13) | g7 (Bxg7), b8=Q (engine g7 +5.6; Kb6 about 0.0) | Kb6: "this is not a pawn move" (the prompt asked for a pawn, so the checker reads the piece type). Correct text: the bishop must capture one pawn so the other promotes. |
| 2 | 8/5Nk1/p4pp1/5p2/Pp3P2/6PP/6K1/8 w | "How can you stop the b4-pawn before it promotes?" (10) | Nd6 (...b3), Nc4 (engine Nd6 +4.0; other moves -6.7 or worse) | Kf2: "this is not a knight move" (again a piece-type message). After Nd6 the prompt: "How can White's knight prevent Black from safely moving the pawn to b2?" |
| 3 | 8/6n1/4k3/7P/8/8/8/6K1 w | "How can White's one pawn overpower the black king and knight?" (11) | h6 (...Kf7), h7 (...Nf5), h8=Q (engine h6 +5.2; Kf2 0.0) | Kf2: "Black captures White's pawn. Try again and look for a way to save it." |
| 4 | 6k1/5ppp/4p3/1P6/8/7P/r4PP1/1R4K1 w | "White's passed pawn is only three moves away from promoting. Push it!" (13) | b6 (...Ra8), b7 (...Rb8), Rc1 (...Kf8), Rc8+ (engine Rc1 +7.3, Ra1 +7.0) | Rd1 (engine +3.3, still winning): red, "White should still win this endgame, but it will require work. There is an easier way." |
| 5 | 8/p7/P3K3/1P6/4k3/7p/8/8 w | "How can White create a passed pawn in the race to promote?" (12) | b6 (...h2), bxa7 (...h1=Q), a8=Q+ (skewer), Qxh1 (engine: b6 +6.3, all else about -7) | Kd7: "does not force a passed pawn for White". b7 (draw, engine 0.0): "Black promotes first and will be ready to attack White's king first. White will have to fight for the draw." Accurate [V engine]. |

Shape [V]: the first endgame lesson is five puzzles in a row, with pieces as the carriers (bishop vs pawns, knight vs pawn, pawn vs knight, rook endgame, pawn race) and no plain counting exercise; the wrong-answer text varies from a generic piece-type check to a precise evaluation ("easier way", "draw"). Note: the last move text shows "a8= +" with the promoted piece missing, a small display defect [V]. Seven to ten moves per challenge in the longest ones. About 25 minutes with probes.

### Make the Most of Your Pieces, lesson 2 "Using Your Bishops" (5 challenges, listed 2 min) [played 8 Nov 2026]

| Ch | FEN (before the move) | Learner moves | Notes |
|---|---|---|---|
| 1 | r2q1rk1/pp3pp1/1bn2np1/3p4/3P4/1QN2N2/PP3PPP/R1BR2K1 w | Bg5 (pin) | Engine +0.4, a2/Bb2 style moves are close; feedback says d5 "will soon fall" (a pin plus attack, plausible, not checked) [V engine for the score] |
| 2 | 2k2B2/8/8/8/3Kp3/P2p4/2p5/8 w | Bh6 (challenge ends here) | Bh6 is the only move that holds (Bb4 is -6.2) [V engine d20]; the line then leads to bishop and a-pawn against a bare king with a dark-squared bishop, and the a-pawn queens on a light square, so the final ending is likely a draw; the feedback ("soon capture all of Black's pawns") is true but stops before that [V engine eval +0.3, I for the draw] |
| 3 | r1b1r1k1/1pp2p1p/1n4p1/pN1p2b1/P2P4/BP3BPP/2P2P1K/3R1R2 b | Bd8 (defends c7) | Bd8 -0.7 vs Bf5 -3.7 [V engine] |
| 4 | 1r4k1/7p/6pP/2B2p2/8/6P1/2r2PB1/6K1 w | Bd5+, then Bd4# | mate in 2 [V engine]; the second move is a mate and the banner reads "Checkmate / Winner" [V] |
| 5 | rn1qk2r/p3bpp1/1p2pn1p/2p5/2P1P3/3B1N2/P1P1QPPP/R1B2RK1 w | e5, then Be4 (Black replies Na6), then Bxa8 | e5 +4.4 is the engine's top; "make the passive bishop active" is answered by a pawn push, then the bishop move wins the trapped rook [V engine] |

Observations
- Teaches the bishop in five roles (pin, stopping pawns from afar, defending a pawn, long-range mate, activating a passive piece), one per challenge. [V]
- c2 shows that the chess.com position can be objectively drawn while the feedback is positive; I did not see the end of that line. [I]
- Ends with Lesson Complete and Finish. [V]

### Make the Most of Your Pieces, lesson 3 "Using Your Rooks" (5 challenges, listed 1 min) [played 8 Nov 2026]

| Ch | FEN (before the move) | Learner moves | Notes |
|---|---|---|---|
| 1 | 1r5k/1pp2pp1/8/6P1/5P2/2P4P/1P4K1/4R3 w | Re7 (Black replies Rc8), then Rxf7 | Re7 +4.3 top [V engine]; second prompt "which pawn can you capture for free" |
| 2 | 2r3k1/r1P3pp/5p2/8/8/7P/6P1/2RR2K1 w | Rd8+ (challenge ends) | +7.7 [V engine]; feedback names the double attack on king and rook [V] |
| 3 | r1b1kb1r/ppppqppp/2n2n2/6B1/2BpP3/5N2/PPP2PPP/RN1QK2R w | O-O (Black takes e4), then Re1 | O-O is a deliberate bait; Re1 +7.3 [V engine]; feedback "Black falls into the trap" [V] |
| 4 | 1R6/1R4pp/4qk2/8/4p3/7P/6P1/6K1 w | Rb6 | +7.5 [V engine]; feedback says the extra rook "should be enough to easily win", fine for a queen pinned to the king [V] |
| 5 | 2R5/8/8/3k4/4pK2/8/8/3q4 w | Rd8+ (Black replies Kc4, scripted, not the engine's Ke6), then Rxd1 | +4.9 [V engine]; ends in rook against a pawn [V] |

Observations
- Five rook jobs: win loose pawns on the 7th, double attack, open file after a bait, pin, skewer. [V]
- Opponent replies are scripted and not always the engine's (c5 Kc4, not Ke6). [V]
- A challenge can end right after the first move (c2, c3 move 2 had no extra step) without a result screen beyond the message. [V]
- Ends with Lesson Complete and Finish. [V]

### Forcing Moves, lesson 2 "Combinations" (5 challenges, listed 2 min) [played 8 Nov 2026]

| Ch | FEN (before the move) | Learner moves | Notes |
|---|---|---|---|
| 1 | r1r5/1b3Qpk/p2qp2n/2npN3/1p1P1P2/4P2R/PP4PP/2R3K1 w | Rxh6+ (Kxh6 auto), Qg6# | mate in 2 [V engine]; prompt gives the length of the mate |
| 2 | 2r2rk1/pb3pp1/1p1bp2p/2p5/3P1q2/2P2N1P/PPQNBPPn/R3R1K1 w | g3 (Nxf3+ auto), Bxf3 | g3 +3.2 top [V engine]; the pawn move traps the queen and forces the knight capture |
| 3 | r2q1rk1/1b2nppp/p4n2/1p6/8/P4N2/BP3PPP/R1BQR1K1 w | Qxd8 (Rxd8 auto), Rxe7 | +2.2 [V engine]; "White wins a piece" |
| 4 | 2k2r2/2b5/8/2NK4/4P3/8/R7/8 w | Ra8+ (Bb8), Rxb8+ (Kxb8), Nd7+ | prompt "remove all of Black's pieces"; Ra8+ +8.8 [V engine]; the challenge ends after the fork move and the text says the rook falls next [V] |
| 5 | r1b2r1k/pp4pp/3p4/4Npq1/2B5/8/PPP2PPP/R3R1K1 w | Nf7+ (Kg8), Nxg5+ | +8.2 [V engine]; feedback claims Black's rook cannot take the knight because of Re8 mate: verified, Rxf7 Re8+ is checkmate because the rook on f7 is pinned and Bc8 blocks Ra8 [V python-chess] |

Observations
- All five are the same shape: a forcing first move (check, threat, or pawn attack), then the win; difficulty rises from a mate in 2 (stated) to a position where the learner has to see a queen sacrifice already made. [V]
- The final message after the lesson read "You took 100 Lessons!", a lifetime lesson-count milestone in the Lesson Complete screen. [V]
- Ends with Lesson Complete and Finish. [V]

### Forcing Moves, lesson 3 "Checkmate in 3 Moves" (5 challenges) [played 8 Nov 2026]

| Ch | FEN (before the move) | Learner moves | Notes |
|---|---|---|---|
| 1 | k6r/p2RR3/2P2p2/7q/6p1/8/6PP/7K w | Rxa7+ (Kb8), Reb7+ (Kc8), Ra8# | mate in 3 [V engine]; prompt warns Black threatens mate in 1 (the race framing) |
| 2 | 1k1r4/ppnr2pp/4p3/4Q3/1q6/6P1/PP3PBP/2RR2K1 w | Qxc7+ (Rxc7), Rxd8+ (Rc8), Rdxc8# | prompt says "only checks"; Rcxc8# is also mate but graded "an alternative" and the lesson makes you find Rdxc8# [V]; the explanation names a side line (Ka8 Qc8#) |
| 3 | r2q1b1r/pppb1Bpp/2np1k2/5pN1/4P3/2N5/PPP2PPP/R1B1K2R w | Nd5+ (Ke5), Nf3+ (Kxe4), Nc3# | mate in 3 [V engine]; prompt hands over the idea (two knight checks into the centre) |
| 4 | 1r4k1/5Npp/8/8/2Q5/8/1q5P/7K w | Nh6+ (Kh8), Qg8+ (Rxg8), Nf7# | double check then queen sacrifice (smothered mate) [V engine]; prompt names the double check |
| 5 | 1k4r1/ppqR3p/2p1p3/P4n2/1Q6/5p1P/1PP4P/3R3K b | Qxh2+ (Kxh2), Rg2+ (Kh1), Ng3# | Black to move; queen sacrifice named in the prompt [V engine] |

Observations
- Difficulty climbs by how much the prompt hides: a stated race (c1), "only checks" (c2), the two knight checks (c3), the double check (c4), and finally a queen sacrifice with Black to move (c5). Ideas are named in the prompt each time, so it is guided pattern spotting, not blind calculation. [V]
- Opponent replies are forced in every line, so the lesson never tests a choice by the defender. [V]
- A strictly graded sequence: Rcxc8# vs Rdxc8# shows the lesson picks one of two mates as the answer and calls the other an alternative. [V]
- Ends with Lesson Complete and Finish. [V]

### Forcing Moves, lesson 4 "Queen Sacrifices" (5 challenges) [played 8 Nov 2026]

| Ch | FEN (before the move) | Learner moves | Notes |
|---|---|---|---|
| 1 | r1b2rk1/pppp1ppp/8/2b1P3/2B3nq/5N2/PP3PPP/RNBQR1K1 b | Qxf2+ (Kh1), Qg1+ (Nxg1 or Rxg1), Nf2# | mate in 3 [V engine]; either recapture on g1 still mates, the opponent chose the rook [V] |
| 2 | 2kr4/pp1rbppp/2n1p1q1/2p5/2PPQB2/2P2N2/P4PPP/1R1R2K1 w | Qxc6+ (bxc6), Rb8# | mate in 2 [V engine]; the text notes the other defence Rc7 loses to Qxc7# |
| 3 | 4rk2/R4p2/1pp4p/2Pp1p1q/3P3P/1P2QPP1/P4K2/8 w | Qxe8+ (Kxe8), cxb6 | credited to GM Ivanchuk by the prompt; engine +6.7 [V engine]; a rare quiet follow-up that wins by a passed pawn, not mate |
| 4 | 6R1/3Q3p/6bk/2p3p1/2P5/5q1P/r5PK/8 w | Qg7+ (Kh5), Qxg6+ (hxg6), Rh8# | mate in 3 [V engine] |
| 5 | 2rq4/pb4pk/1p6/4R3/5R2/PB5P/1P1r2PK/8 w | Rh5+ (Kg6), Bf7# | prompt says the queen is already sacrificed; mate in 2 [V engine] |

Observations: all mates but c3; c3 is the one "convert the sacrifice into a winning ending" example and it comes third, so the mate rhythm is broken once. Ends with Lesson Complete. [V]

### Forcing Moves, lesson 5 "Saving Draws" (5 challenges) [played 8 Nov 2026]

| Ch | FEN (before the move) | Learner moves | Notes |
|---|---|---|---|
| 1 | k7/2Q5/1K6/8/8/8/8/4b3 b | Ba5+ (Kxa5 scripted) | skewer into stalemate [V]; engine's own first choice is the same check but it expects Kc5, so the lesson line is a trap, not a forced line [V engine] |
| 2 | 8/Pb6/3K4/3p2k1/3Pp3/4P3/8/8 w | Kc7, Kb8, Kc7 | drive the bishop back and repeat; engine 0.00 on all [V engine]; the lesson ends on the idea of threefold repetition |
| 3 | k4r2/bpp5/8/Q7/3p3p/7P/5qPK/4r3 w | Qxa7+ (Kxa7) | stalemate; engine 0.00 and the other tries lose [V engine] |
| 4 | 8/2R3pk/5Qp1/1q3p2/4p3/6PP/5P1K/1r6 b | Rh1+ (Kxh1), Qf1+ (Kh2), Qxf2+ | perpetual check; engine 0.00 [V engine]; the text says Kg2 would lose to Qf1# so White must take |
| 5 | 3B4/1r2p3/r2p1p2/bkp1P1p1/1p1P1PPp/p1P4P/PPBK4/8 w | Ba4+ (Kxa4), b3+ (Kb5), c4+ (Kc6), d5+ (Kd7), e6+ (Kxd8), f5 | a fortress: the text says Black cannot break through if White only moves the king and captures nothing. Engine says Black is much better (-6 to -7 for White from the start, +4.75 for Black after f5, depth 26). Fortress is neither confirmed nor refuted by the engine [V engine]; the real claim is a human-judgment one |

Observations
- The chain of checks in c5 is guided by hints that name only the idea ("what is White's only check") and the feedback just says "keep checking". [V]
- Whole course ends here: lesson complete, no quiz or final game; the five lessons climb from a one-move tactic (Powerful Moves) to mate in 2 (Combinations), mate in 3, queen sacrifices, and finally defensive resources (draws), so the course ends by switching from attack to defence. [V]

## Advanced Tactics, Ben Finegold (course slug advanced-tactics-1; badge IAM; 2 lessons, 10 challenges, 34 min; released 2014) (9 Nov 2026, segment 3) [V]
Lessons: Expect the Unexpected (5 challenges, 20 min listed), Pseudo-Pins (5 challenges, 14 min listed). Course page lists three learning points (expect the unexpected, the pseudo-pin, how Carlsen and Anand prepare for surprise tactics) plus a one-line learner testimonial (marketing). The lesson start card has Start and Explainer Video buttons.

### Lesson 1 "Expect the Unexpected" (first 3 of 5 challenges played) [V]
Method: the board is read from the markup; engine checks with Stockfish 19 lite depth 16 [V engine]. The board is shown from the side to move (flipped when Black is to move).

| # | Start FEN (side) | Prompt (words) | Line played | Feedback seen |
|---|---|---|---|---|
| 1 | rn1q1rk1/4ppbp/bn1p2p1/2pP4/4PP2/N2B4/PPQ1N1PP/R1B2RK1 b | "How can Black win material with an unexpected tactic?" (10) | ...c4 (engine +5.1; next best +0.2), Nxc4 Nxc4, Bxc4 Qc8 (pin on the c-file), Bb3 Qxc2, Bxc2 Bxe2 | Four learner moves after the first; each correct move gets a short line ("Good start! How can you win material?", "Great move. How can you win a piece?", "What can you capture for free?"). Wrong ...Bxc4 (engine about 0.0): red "incorrect" plus a specific reason (White escapes the c-file pin by defending the queen with the bishop). Wrong ...Qxc3 on the second step: red "White is OK. Try again." (generic). |
| 2 | 3r1rk1/pp2bpp1/4pn1p/q1p1N2P/3P1B2/8/PPP1QPP1/1K1R3R w | "How did GM Carlsen start a brilliant attack?" (8) | Ng6 (engine +1.1, next best +0.1), fxg6 Qxe6+ (engine only +0.26 for White here, so objectively marginal), Kh8 hxg6 (engine: Black -4.3, text says White has a winning attack: true) | Wrong Bd2: "There's a better move. Try again and look for a good sacrifice." (names the type of idea but no square). A famous-game position, played as a multi-move chain with scripted opponent replies. |
| 3 | 3r1rnk/pp2bp1p... (after Ng8): 3r1rnk/pp2b1p1/4Q1Pp/q1p5/3P1B2/8/PPP2PP1/1K1R3R w | "How did GM Carlsen continue the attack?" | Bxh6 (engine +6.9), gxh6 Rxh6+ (engine +4.8) Nxh6 | Wrong Rxh6+ (engine +3.7, still winning): red "White still has a good position, but there's a better move. Try to find it." So the red state is used for sound-but-lesser moves here, with honest wording (not "wrong"). |

Observations [V]: (1) challenge boundaries are plan stages, not single moves: 4 to 6 learner moves per challenge. (2) The wrong-answer text varies from a concrete refutation (best) to "try again" (worst); the best form says why in one sentence. (3) The next-challenge arrow turns green only after the chain ends; a red undo button appears on wrong moves and wrong moves are shown on the board before undo. (4) The opponent replies are scripted, so a sound alternative by the learner can end up in the lesson line only if the author listed it. (5) The "incorrect" mark for sound but lesser moves is soft ("good position, but a better move"). (6) Famous-game framing ("how did GM Carlsen...") changes the task from "find the best move" to "recall or rediscover the master's idea"; engine margins show the master line is not always objectively best, so a verified claim has to be "plays the winning attack" not "the only move".

Not played: challenges 4 and 5 of lesson 1, lesson 2 (Pseudo-Pins) not opened beyond the course page.
