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
