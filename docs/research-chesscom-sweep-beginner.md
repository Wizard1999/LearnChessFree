# chess.com library sweep, Beginner level (started 9 Nov 2026)

Scope: the Beginner filter of the lesson library (`/lessons/all-lessons?level=beginner`, 37 courses on 2 pages per the site tour). Source: Andrew's trial account, built-in browser, played by hand. Evidence labels: [V] seen here, [I] inference. Engine checks use Stockfish 19 lite (depth 16). Original wording only.

Method per lesson: play every challenge, try one deliberate wrong move on most, note feedback text kind, hint, defects (FEN plus what is wrong), and the ending.

## Status map for the Beginner filter

Beginner-only courses (badge B), with the earlier notes already on file:
- Learn To Play (12 lessons): played in full, see `research-chesscom-new-player-journey.md`.
- Intro to Book Openings, Finding Checkmate, Winning with Tactics, Learn To Play Chess, Capturing Pieces (L2-9), Playing the Game: played earlier, see `research-chesscom-trial-beginner.md`.
- Opening Principles: L1-2 earlier (trial files); L3-5 in this file.
- Winning the Game: partly played earlier (L1 c1-4 and L5 c3-5 not recorded); to redo here.
The 29 other courses on the filter carry all four badges (BIAM): the 14 opening-repertoire courses (3 lessons each), PogChamps Tactics, Your First Tournament (done earlier), Mastering the Endgame, Games That Changed Chess History, How to Checkmate, the Exploiting/Defeating opening-error series and the three 77 to 130-lesson reference courses.

## Opening Principles (Chess.com Team, 2018 course, 5 lessons, 26 challenges)

Lesson UI note [V]: this older course shows an "Explainer Video" button under Start (Start sits at the bottom of the side panel, not at the top). In-lesson, a correct move turns the bottom bar into three icons: a play-through arrow, the Solution magnifier, and the green Next arrow at the right edge; a wrong move shows only the Solution icon and the red Retry. A third answer tier exists here and not on the Learn path: a good but unintended move gets "is an alternative", the bubble explains why it is good, and a green Retry (circular arrow) appears instead of Next, so the learner must replay the intended move.

### L3 Protect Your King (5 challenges) [V]
- C1 `r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w` (Italian), "best king move": O-O. Wrong try Ke2 got a reason: "we do not want to keep our king in the center. How can we move it to safety?" Right feedback counts the three pawns and the rook on f1.
- C2 (Black): develop the g8 knight to a central square that hits e4, then castle. Nf6 right; wrong try d6 got a reason ("we were asked where to best develop Black's g8 knight"). The challenge has two moves (Nf6, then O-O after a scripted d3).
- C3 `r2qk2r/2pp1ppp/1pb4n/8/p2P4/B1P5/P1P2PPP/R2QNRK1 w` ("Black left the king in the center too long"): Qe2+ (engine: mate in 3), scripted Qe7 block, then Qxe7# (the queen is guarded by Ba3). Wrong try Nf3 got "look for a strong check" (a hint that names the idea). Wrong try Bxe7 (wins the queen, engine +8.1) was marked incorrect: "look for a way to win the game", so the lesson wants the mate and rejects the clearly winning capture; not a defect but worth knowing for a design that must accept "also winning" moves.
- C4 `r1b1kbnr/pppp1ppp/2n5/8/2Bpq3/5N2/PPP2PPP/RNBQ1RK1 w` ("Black just captured e4; how can White win material?"): Re1 (pins the queen). Wrong try Nc3 got "stronger move to find". Bxf7+ (engine +7.3, the top move) got the verdict "is an alternative": "Wow! This is an incredible tactical idea that also works with accurate play", then the learner is sent back to play Re1. Good practice: the alternative is praised as strong, not marked wrong.
- C5 `r3r1k1/pp3ppp/2pb1n2/3p4/3P4/1B2B2P/PPPQ1Pq1/R3K2R w KQ` ("move our king to safety and protect the hanging rook on h1"): O-O-O (the king cannot castle short into the queen's attack; Rd1 then guards h1). Wrong try Rf1 got a strong hint: "Don't forget about queenside castling!". Engine: O-O-O is best but White is still about -3.9, and the closing text admits it ("White's position isn't perfect, but it's much better now"). Honest, and the lesson claim "protect the rook" is only half the story (Qg2 stays strong).
- Feedback tier: every wrong try this lesson got a reason or a pointer, unlike the 2018 Playing the Game lessons. Ending: "Lesson Complete!" and Finish.

### L4 Active Pieces (5 challenges) [V]
- C1 (Black, flipped) `r1b1kbnr/p4ppp/1qp1p3/2ppP3/3P4/2P2N2/PP3PPP/RNBQK2R b`, "developing move that prevents White from castling": Ba6 (the bishop hits f1; engine +0.5, Nh6 only +0.1). Wrong try Nh6 got a reason ("does not prevent White from castling").
- C2 `rnbqkbnr/pp1ppppp/8/8/4P3/2p5/PP3PPP/RNBQKBNR w` (Danish-like gambit), "which capture best activates a piece?": Nxc3. Wrong try bxc3 got a reason: the pawn blocks the b1 knight from its best square.
- C3 `r1bqkb1r/pppp1ppp/2n2n2/4p3/2P5/2N3P1/PP1PPP1P/R1BQKBNR w` (English with g3): Bg2. Wrong try Bh3 got "doesn't control the center".
- C4 (Black) `r3k2r/1pp1bpp1/p3bn1p/2p5/5B2/2NP1N1P/PPP2PP1/R3R1K1 b`, "defend c7 and secure the king": O-O-O (engine +0.2; Bd6 about 0.0). Wrong try Rc8 (also protects c7) got "does not bring the king to safety and protect the c7 pawn at the same time".
- C5 endgame `5k2/8/8/8/8/1p6/1P6/4K3 w`: Kd2 (engine +5.9), Ke7 reply, Kc3, Kxb3. Wrong try Ke2 (engine +0.12, a draw-ish line where Black's king reaches the pawn) got a reason: "Black's king will be able to stop the white pawn from promoting". The final K+P vs K (`8/8/3k4/8/8/1K6/1P6/8 b`) is a win for White (engine -11.6 for Black), so the closing claim holds.
- Defects: none unsound. Ending: "Lesson Complete!".

### L5 Phases of the Game (6 challenges) [V]
One game played over six challenges, from the first move: 1.e4 e5 2.Nf3 (as White), then the same opening replayed with Black's choice, then Bc4, O-O, Nc3, d3, Bg5.
- C1 two-step: e4 (wrong try Nf3: "does not place a pawn directly into the center"), then Nf3 (hits e5). The first ask is "move a pawn directly into the center", i.e. the learner has to find the concept before the move.
- C2 `rnbqk1nr/ppppbppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w` ("Black just moved the bishop to e7; win a pawn"): Nxe5. Wrong try Bc4 got "does not capture a black pawn". Note the opponent's earlier move was a blunder by script (Be7 with e5 unprotected).
- C3 (Black, flipped) `rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b`: Nc6. Wrong try Nf6 got the "alternative" verdict: "doesn't protect the e5 pawn, but it does counterattack e4. Interesting move".
- C4 `r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w`: Bc4. Wrong try Bb5 (Ruy Lopez, fully sound) got "alternative": "attacks the knight that protects e5. Good choice, but find another move that lets the bishop directly control central squares". Then O-O is asked next.
- C5: Nc3 to protect e4. Wrong try d3 got "alternative": "strong move that also protects e4".
- C6: d3 then Bg5 (hits the f6 knight). Each step is explained.
- The lesson teaches the three phases implicitly: opening aims (centre, develop, castle) by playing a model game; the words "phases" and "middlegame/endgame" do not appear in the prompts I saw (about 90 percent opening only). Time about 6 minutes.
- Ending: "Lesson Complete!".

### Opening Principles, course-level findings [V/I]
- Eight challenges across L3-L5 got a reasoned wrong-move text; only the endgame one (L4 C5) and the check-and-castle ones needed the reason to land. This course has the best wrong-move feedback of the older Chess.com Team courses.
- The "alternative" tier is a model worth copying: a sound move the author did not intend is named good, the reason it is not the target is given, and the learner is sent back to the intended move. Compare the Learn path, where Rd8 or Kd6 in won endgames was marked "incorrect" without a reason (tiles 56, 59).
- Every lesson plays one fixed model line, with scripted replies; no lesson lets Black or White deviate.

## Winning the Game (Chess.com Team, 2018 course, 5 lessons, 25 challenges)

### L1 The 4-Move Checkmate (5 challenges) [V]
The lesson is about DEFENDING against the four-move mate: the learner plays Black throughout, the opponent plays 2.Qh5 and 3.Bc4 by script.
- C1 `rnbqkbnr/pppp1ppp/8/4p2Q/4P3/8/PPPP1PPP/RNB1KBNR b`, "develop a knight toward the center and protect the pawn": Nc6. Wrong try d6 got a reason ("does not develop a knight").
- C2 (after Bc4 and Qh5 again): "attack the queen and block the queen from capturing f7": g6. Wrong try Nf6 got a real consequence: "Whoops! The knight attacked the queen but allowed checkmate." (Qxf7#.) Reasoned and honest.
- C3 `r1bqkbnr/pppp1p1p/2n3p1/4p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR b` (White's Qf3 threatens Qxf7#): Nf6. Wrong try Bc5 got "either allows checkmate or loses material".
- C4: same Nc6/g6 defence again from the start of the line. Wrong try Nf6 got the "alternative" tier ("also a good move ... Try moving the other knight").
- C5: Nf6 attacking e4 (wrong try Nc6 is "alternative"), then after the scripted Qh5 the learner finds Nxh5 and wins the queen ("White carelessly brings out the queen").
- Pattern: the same defence is rehearsed in four of five challenges (C1-C4 all end at "protect e5 / block f7 with a pawn or knight"), a deliberate repetition of one 4-move sequence; the fifth shows the punishment. Time about 5 minutes.

### L2 Assisted Checkmates (5 challenges) [V]
All five are mate-in-one with two pieces; each prompt names the pair. Engine-checked, all unique mates.
- C1 `5rk1/5ppp/8/8/8/8/1B4Q1/6K1 w`: Qxg7# (queen plus bishop). Wrong try Bxg7 got a precise hint: "if you captured that pawn with a more powerful piece, it would have been checkmate".
- C2 `k7/7R/2N5/8/8/8/6K1/8 w`: Ra7# (rook plus knight). Wrong try Rh8+ got "the Black king escapes".
- C3 `4k1r1/1q3p2/4p3/Q7/8/8/6PP/3R3K w` (Black threatens Qxg2#): Qd8# with the rook behind it. Wrong try Qa4+ got "this does not checkmate" and no reason.
- C4 `8/kP6/p7/8/8/5q1p/5P2/1Q4K1 w`: b8=Q# (promotion mate with the queen on the b-file; the picker gives Q, N, R, B). Wrong try Qb6+ got the generic "does not checkmate".
- C5 `8/Q7/8/8/8/8/1rr5/5K1k w`: Qg1# (both kings in danger; Qh7+ is refuted by Rh2, feedback "Black's rooks keep the king safe"). 
- Feedback tier: three of five wrong tries got a reason. No defect.

### L3 Checkmate with Two Rooks (5 challenges) [V]
The "rook roller" (ladder mate) with the name given in the first prompt ("Use the rook roller to checkmate Black!").
- C1 `1k6/5R2/6R1/8/8/8/6K1/8 w`: Rg8#. C2 vertical roller `8/1R6/2R5/8/k7/8/8/6K1 w`: Ra6# (engine mate in 1; Rc1 and Rc3 are mate in 2, so they are slower). C3 `8/1k6/5R2/6R1/8/8/8/6K1 w`: Rg7+ forces the king to the back rank, then Rf8#. C4 `7N/k7/p4R1R/8/rn6/8/1p4PP/7K w` (Black's pieces look scary): Rh7+ (Kb8) Rf8#. C5 `8/pk5r/p7/8/5P1q/8/4R1PP/2R4K w` (White's own king is under attack): Rb2+ Ka8 Rc8#.
- Wrong tries: Rb6+ and Rc4+ (not mate) got "does not checkmate" only; Rb5+ got "does not force the black king to the back rank"; Rf7+ in C4 got a useful reason ("White doesn't have time to checkmate with the h6-rook"); Rc7+ in C5 got "does not force the black king into the corner".
- Teaching shape: the first two challenges are mate-in-1 recognition; C3 to C5 add the idea of forcing the king to the edge first. C4 and C5 are the only ones with distractions (extra black pieces, a threat against White). Rook mate at its core is shown in 5 positions, not as a method for a fresh position (no "play the whole mate from the middle of the board").
- No defect found. Time about 5 minutes.

### L4 Checkmate with the Queen (5 challenges) [V]
- C1 `7k/8/5K2/6Q1/8/8/8/8 w`: Qg7# (queen protected by the king). The wrong try Qg6 is stalemate and the feedback says so plainly: "Whoops! The black king cannot move but it is not in check - it's stalemate." The first stalemate lesson in the Beginner path comes inside a mate drill, which is the right place.
- C2 `7k/2Q5/5K2/8/8/8/8/8 w` ("immediate checkmate, or should White play Kg6 to prepare?"): Qg7#. Kg6 got the "alternative" tier: "does allow checkmate on the next turn, but you can win the game immediately".
- C3 `7k/8/8/4K1Q1/8/8/8/8 w` ("set up checkmate on the following turn"): Kf6, then Qg7#. Wrong try Qg6 is stalemate again, again named ("White's queen prevents the black king from moving, but Black is not in check").
- C4 `1k6/6Q1/2K5/8/8/8/8/8 w`: Qb7#. Wrong try Qg8+ got "not checkmate".
- C5 `5k2/8/5K2/8/8/8/1Q6/8 w`: Qb8# (the hint says "a check on the back rank"). Wrong try Qb4+ got "Black's king can run away".
- Positive: stalemate shown twice as a consequence, not as a lecture. Time about 4 minutes.

### L5 Checkmate with the Rook (5 challenges) [V]
- C1 `6k1/R7/6K1/8/8/8/8/8 w`: Ra8#. Wrong try Rg7+ got "Black's king can escape the check. Try to find a stronger rook check."
- C2 `8/8/7R/8/k1K5/8/8/8 w` (king stuck on the a-file): Ra6#. Wrong try Rb6 got "does not win immediately".
- C3 `k7/7R/2K5/8/8/8/8/8 w` ("bring your king closer so you can mate in two"): Kb6 (Kb8 forced) then Rh8#. Wrong try Kc7 is stalemate; the feedback was only "does not prepare to deliver checkmate after Black's next move" and does not name the stalemate (unlike the queen lesson L4). Engine: Kb6 mate in 2.
- C4 `1k6/2R5/2K5/8/8/8/8/8 w` ("force Black's king to a8"): Kb6 then Rc8#. Wrong try Rb7+ got "does not force the black king to a8".
- C5 `7k/1R6/5K2/8/8/8/8/8 w` ("line up the kings to force mate in two moves"): Kg6, Kg8, Rb8#. Wrong try Kf7 is stalemate (Kh8 has no move) and got "There's no checkmate on the next move. Try to bring your king closer".
- Defect: two stalemate traps (C3 Kc7 and C5 Kf7) are marked wrong without saying "stalemate", while the same trap in L4 is called by name; an inconsistency in the author's feedback, not a position defect.
- Teaching shape: C1 to C2 recognition, C3 to C5 the king-and-rook technique in its simplest forms (king one step, opposition, force to the corner). Time about 6 minutes.

### Winning the Game, course-level findings [V/I]
- Every position is a clean mate or a clean defence, engine-checked unique where claimed. No unsound item found.
- The course is the best example in the old Team set of using the stalemate trap as the wrong-answer teacher (L4 C1, C3; L5 C3, C5).
- "Alternative" tier appears in L1 and L4. Wrong-move feedback ranges from a precise reason (about 60 percent) to a bare "does not checkmate" (about 40 percent). The tier is not uniform across lessons.
- No rule or notation teaching here; the course assumes the learner already knows how pieces move and what mate is.

## Capturing Pieces (Chess.com Team, 2018 course, 9 lessons, 45 challenges): L1 only here (L2-9 earlier)

### L1 Evaluating Captures (slug value-of-the-pieces, 5 challenges) [V]
The point counts (3 for 3, 3 for 5) are written into the feedback text; the learner is never shown a table first (the "Explainer Video" button holds that).
- C1 `3q2k1/2p2npp/4p3/5p2/3Q3B/4P3/5P2/6K1 w`, "best capture": Bxd8 (engine +7.6). Wrong try Qxd8+ (a queen trade, engine about 0.0) got "better to capture Black's queen without losing your own".
- C2 `2r4k/p5pp/1b3n2/3Np3/P3Pp2/2r2B1P/5PP1/R4RK1 w`, "which move wins material": Nxc3 (engine +4.5, knight for rook). Wrong try Nxb6 got a number: "only an even trade (3 points for 3 points)".
- C3 `5rk1/1p3pb1/4p3/8/p2n4/6B1/1P1R1P2/3R2K1 w`: Rxd4 Bxd4 Rxd4 (engine +3.0, "extra bishop"). Wrong try Kg2 got "a better move ... look for a strong capture".
- C4 `r2rn1k1/3nqp1p/pp2p1p1/2p3N1/2P2P2/1P4P1/P1Q2PBP/2RR2K1 w`: Bxa8 (engine +5.2; "bishop for rook"). Wrong try Nxe6 got "does not gain material".
- C5 `3r2k1/4np2/p5b1/1p5p/2pN2p1/P5P1/1P2PP1P/R1N3K1 w` ("knight on d4 in trouble; capture b5 or defend?"): e3 (protects the knight; engine -1.0, still worse for White but the least bad move). Wrong try Nxb5 got arithmetic: "trading a knight (3 points) for a pawn (1)". Right feedback is honest: "if Black captures the knight with the rook, White gains material".
- Defects: none unsound. Note C3, C4 and C5 involve scripted recaptures (the learner makes the final capture); C5's e3 is chosen as the best defence, not as a winning move, and the feedback does not claim a win.
- Ending: "Lesson Complete!". Time about 4 minutes. The feedback uses point values consistently, a good habit for a first captures lesson.

## Playing the Game (Chess.com Team, 2018 course): L1 "The Value Of The Pieces" (slug the-value-of-the-pieces-2, 5 challenges) [V]
A five-challenge "which capture is best" drill; all positions engine-checked (Stockfish 19 lite). Wrong moves got only "<move> is incorrect" with no reason in this lesson (compare Capturing Pieces L1, which gave point arithmetic).
- C1 `6k1/8/4b3/8/4Rq2/8/6P1/6K1 w`: Rxf4 (wins the queen, the rook was attacked by it). Wrong try Rxe6 (wins a bishop) marked incorrect. Engine verdict not needed: the queen is worth more, but nothing tells the learner so.
- C2 `6k1/6p1/n6p/5r2/8/P2B4/1PP5/2K5 w`: Bxf5 (wins a rook). Wrong try Bxa6 (wins a free knight, also sound) was marked "incorrect" with no mention that it wins material. The "is an alternative" tier of the other 2018 courses would fit here.
- C3 `6k1/5pp1/5n1p/p4b2/3Np3/4P3/5P2/R3K3 w`: Nxf5 (engine +4.95, wins a bishop). Wrong try Rxa5 (wins a pawn, engine +0.06) marked incorrect.
- C4 `1k6/2p4p/1p4q1/1r6/7P/3Q2P1/5P2/5RK1 w`: Qxb5 (engine +7.1, wins a rook). Wrong try Qxg6 (queen trade, engine +0.3) marked incorrect.
- C5 `8/3k2q1/8/P6p/8/2B5/3n2PP/6K1 w`, prompt "two possible captures, which is best?": Bxg7 (engine +5.8, wins the queen). Wrong try Bxd2 (engine -10.1: Qd4+ wins the bishop and more) marked incorrect; the prompt itself warns that there are two captures.
- Findings: (1) The lesson is pure "take the bigger piece" and never says why a free knight is worse than a free rook; a reason line on wrong moves is missing. (2) C2 and C3 punish a sound material win (knight, pawn) with a bare "incorrect", the same defect as tile 56/59 in the Learn path. (3) The point-value ladder (Q 9, R 5, B/N 3, P 1) is never displayed in the lesson body; it relies on the Explainer Video. (4) Defects: none unsound. Time about 4 minutes.
- Method note for the next session: on this 2018 UI the JS helper `__xy` mis-scales; use the fixed frame coordinates (file x = 170+54.4*i, rank y = 420-54.4*(r-1)) directly.
