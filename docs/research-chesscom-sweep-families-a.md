# chess.com sweep: families A (Learn the X openings, Wolff, Kane Studies, engine courses, Tal 2/3, Candidates), started 9 Nov 2026

Sign convention [V]: all engine scores below are from the SIDE TO MOVE's point of view (eng.py / `tools/engine.py`, local Stockfish 19 lite single thread, depth in each line; positive = good for the player to move). Labels: [V] seen on chess.com and checked here, [I] inference for Scholarmate, [S] secondary. Wording original; only short feedback phrases quoted. Account: Andrew's trial, built-in browser, own tab. Method: lesson 1 challenge 1, a deliberate wrong move where it registered, then the right move; FEN read with `game.getFEN()`; board frame unflipped x=104+63*file, y=42+63*(8-rank); Retry (733,757). Shell for every "Learn the X" course [V, 3 lessons, 21 challenges, one lesson per theme]: L1 "Learn the X" 10 challenges (key ideas), L2 "...thematic tactics", L3 "Model game" (one challenge, many steps).

## Learn the X courses (CC, 3 lessons, 21 challenges)

### Learn The Evans Gambit (#22, 30 min) [V]
- L1 C1 (`r1bqk2r/ppppnppp/2n5/b7/2BpP3/2P2N2/P4PPP/RNBQ1RK1 w kq`, "White to Move", prompt blank at first paint). Engine d14 / d20, White: cxd4 +0.06 / +0.01, Ng5 -0.13 / -0.06, Ba3 -0.34, h3 -1.05.
- h3 red: "There's a better move to target f7." cxd4 (engine-first at both depths) ALSO red with the identical text. Ng5 green: "Nice move. Black just blundered. How ..." (the engine has the position level, so "blundered" is a stretch; the course treats Black's last move as an error because it is off the book Evans line).
- L3 model game (`r1bqk1nr/pppp1ppp/1bn5/4p3/1PB1P3/5N2/P1PP1PPP/RNBQK2R w`, Challenge 1/1): d4 (-0.09 at d14, only 0.45 below a4) red: "It's better to advance a queenside pawn and ..."; a4 (+0.36, engine-first) green: "Great start! Now that there's a black pawn ...".
- Finding [V]: the grader is the book, not the engine: an engine-first move is red with a goal sentence. The goal sentence ("to target f7") is a hint stated as a rejection.

### Learn The Catalan (#38, 21 min) [V]
- L1 C1 (`1rbqkb1r/1pp2ppp/p1n1pn2/8/2pP4/4PNP1/PP3PBP/RNBQ1RK1 w k`). d14 White: Nfd2 +0.37, Qe2 -0.06, a4 -0.17, Bd2 -0.23, b3 -0.25.
- Qe2 red: "There's a better move to prevent b7-b5 and win the c4-pawn. Try to find it." Nfd2 green: "Good move! Na5 only made things worse for Black. How can White go about trying to win that piece?" (a scripted Black reply and a follow-up question).
- Finding [V]: the red text states the TWO goals the right move achieves (stop b5, win c4). That is as good as the amber tier of the Mastery courses without needing an amber state. The 0.43 gap is large enough for the red.

### Learn The Indian Defenses And The Black Knights' Tango (#39, 20 min) [V]
- L1 C1 (`r1bqkb1r/pppppppp/8/3Pn3/2P1n3/8/PP3PPP/RNBQKBNR w KQkq`): a trap-first lesson, the first challenge is a winning fork. d14 White: Qd4 +3.81, Qe2 +2.92, f4 +0.33, Be2 -0.26.
- Be2 red: "There's a better move to win material. Try again and look for a winning fork." Qd4 green: "Good idea! What's next?" (filler; a +3.8 fork deserves a sentence on why it wins both knights).
- Finding [V]: "Indian Defenses" course opens on the Tango, a gambit trap, i.e. a hook first; the 10-challenge lesson starts mid-line (move 5) with no board setup shown.

### Learn The Flank Openings (#40, 26 min) [V]
- L1 C1 (`rnbqk1nr/ppp2p1p/3b4/6p1/8/2N2N2/PPPPP1PP/R1BQKB1R b KQkq`, Black, board flipped): d14 Black: g4 +1.54 (d22 +2.17), Nc6 -0.63, a5 -1.39, f5 -1.48. Nc6 red: "There's a better attacking move. Try again and look for a strong threat." g4 green: "We are only on move six and Black can already force checkmate! How should you do it?"
- Check [V]: after g4 White is -2.1 to -2.4 at d20 and no mate is shown in the top three lines, so "force checkmate" is an overclaim (winning, not forced mate within the search shown). The reds never state the cost; g4 is the only move that is a threat so the text is true but generic.

### Learn The Old Indian Defense (#41, 21 min) [V]
- L1 C1 (`rnbqkb1r/ppp1pppp/3p1n2/8/2PP4/2N5/PP2PPPP/R1BQKBNR b KQkq`, flipped): flat, d14 Black: g6 -0.43, e5 -0.46, Na6 -0.68, a5 -0.73, Nbd7 -0.76.
- a5 red: "There's a better move. Try again and look for a strong pawn break." (class hint). Nbd7 (0.3 below e5) AMBER "an alternative": "This is playable, but there's no need to prepare e7-e5. You can safely play it right away." (the best amber text in this family: names the concrete surplus step). e5 green: "Good idea! What's next?"
- Finding [V]: three-state grading exists in the 2022-era Learn the X shell and is calibrated at about 0.3 pawn here.

### Learn The Dutch Defense (#42, 24 min) [V]
- L1 C1 (`r1b1qrk1/ppp1p1bp/3p1np1/2nP1p2/1PPN4/2N3P1/P3PPBP/R1BQ1RK1 b - -`, move 10, a Leningrad middlegame with the b4 pawn hitting the c5 knight; no moves shown before). d14 Black: Nfe4 -0.47, Nce4 -0.52, Na6 -1.89, e5 -1.93, Ng4 -4.09, f4 -4.17.
- Ng4 red: "There's a better option. Try again and look for a good way to exchange knights." (names the goal; the true cost is a piece). Nfe4 green: "Good idea! How should you recapture?" (a follow-up question, scripted).
- L2 "Thematic Tactics" C1 (`rnbqkb1r/pppp2pp/4pn2/5p2/3P4/3BPN2/PPP2PPP/RNBQK2R b KQkq`, move 4): NOT a tactic; a development question. d14 Black: b6 -0.40, d5 -0.44, Bb4+ -0.45, c6/Be7 -0.45, a5 -0.47 (flat). g5 red: "There's a better developing move. Try to find a way to bring out your c8-bishop." Be7 AMBER: "This is another strong move, but not the most popular choice. Try to find the best way to develop the other bishop." (answer b6; grading by book popularity).
- Deeper-lesson check [V]: L2 is no harder than L1 (move 4 versus move 10), the title "Thematic Tactics" overpromises, and feedback keeps the same templates, so the course does not escalate. Difficulty is in the opening, not in a ladder.

### Learn The King's Indian Attack And The Reti Opening (#43, 34 min) [V]
- L1 C1 (`rnbq1rk1/pp2bppp/4pn2/2pp4/8/3P1NP1/PPPNPPBP/R1BQ1RK1 w - -`, move 7). Flat, d14 White: Re1 -0.03, e4 -0.03, c3 -0.07, a3 -0.19, b3 -0.22.
- Re1 (tied first with e4) AMBER "an alternative": "This is OK, but the e-pawn is already supported enough to advance. How should you do it?" c3 (0.04 behind e4) RED: "There's a better move. Try again and look for a strong pawn break." e4 green: "Good start! How should you support your e-pawn?"
- Finding [V]: grading is by the book move (e4), not by margin: a tied-first move is amber, a 0.04-behind move is red. The amber text is again the good form (names the reason).

### Learn The Pirc Defense And The Modern Defense (#44, 36 min) [V]
- L1 C1 (`r1bqk2r/ppp1ppbp/2np1np1/8/2BPP3/2N2N1P/PPP2PP1/R1BQK2R b KQkq`, flipped, move 6). d14 Black: Nxe4 -0.40, O-O -0.54, e6/a6 -0.61, Na5 -0.75, a5 -0.88.
- a5 red: "There's a better move. Try to find a good capture." O-O (0.14 behind) AMBER: "This is a good move, but there's an even better one. Try to find a strong capture." Nxe4 green: "Good move! How can you win back your lost piece?"
- Finding [V]: the margin is honestly small for the amber and the hint names the class ("a capture") in both tiers, so the amber tier doubles as a hint.

### Learn The English Opening (#45, 35 min) [V]
- L1 C1 (`r1bqk1nr/pp1p1pbp/2n1p1p1/2p5/1PP5/P1N3P1/3PPPBP/R1BQK1NR b KQkq`, flipped, move 6, a gambit-style pawn on b4). d14 Black: Nxb4 +0.18, Nge7 -0.27, d6 -0.36, cxb4 -0.74, d5 -0.83, Nf6 -0.99.
- BOTH Nxb4 (green: "Great start! How should you win back the lost material?") and cxb4 (green: "Good choice! What must Black play next to keep good winning chances?") are right. cxb4 is 0.92 pawn weaker than Nxb4 and "good winning chances" is an overstatement for a move the engine rates as slightly worse for Black. Nf6 red: "There's a better option. Try again and look for a strong capture."
- Finding [V]: here the accepted set is wider than the engine's (two captures), and a weaker capture earns the stronger praise.

### Learn The Alekhine's Defense (#46, 33 min) [V]
- L1 C1 (`r1bqkb1r/pppnpppp/8/3nN3/3P4/8/PPP2PPP/RNBQKB1R w KQkq`, move 6, White has a knight sacrifice available). d14 White: Nxf7 +1.38, Nxd7 +0.45, Nf3 +0.42, Nd3 +0.36, Qf3 +0.26. Nxd7 red: "White is only slightly better. Try to find a stronger capture." (a calibrated evaluation sentence: +0.45 is indeed slight; the move is graded wrong because a better one exists at +1.38). Nxf7 green: "Great move! How can you justify the knight sacrifice?" (honest: a sacrifice whose justification is asked next).
- L3 model game (`rnbqkb1r/pppppppp/5n2/4P3/8/8/PPPP1PPP/RNBQKBNR b KQkq`, Black, 1.e4 Nf6 2.e5; Challenge 1/1 hides the whole game): Ne4 (-1.39; Ng8 -1.02; Nd5 -0.55) red: "White is better. Try to find a stronger knight move." Nd5 green: "Good start! How should you attack the white pawn center?"; the scripted reply then asks the next question.
- Finding [V]: this course writes the best red texts in the family, because they state the evaluation, not just "a better move". The model game is a full game from move 2 as one "challenge", asked one move at a time, with the learner always on the side being taught.

### Learn The French Defense: Tarrasch And Advance Variations (#49, 26 min) [V]
- L1 C1 (`rnbqkb1r/pppn1ppp/4p3/3pP3/3P4/2P5/PP1N1PPP/R1BQKBNR b KQkq`, flipped, move 5; the course starts straight after 5.c3). d14 Black: c5 -0.91, a5 -1.09, a6 -1.18, h6 -1.28, c6 -1.39. h6 red: "There's a better way to attack the white center. Try again." c5 green: "Good start! How should you develop another piece to keep attacking d4?"
- Finding [V]: the first question of a course is the single best-known move of the line (c5), 0.18 ahead of the next; nothing in the red tells a beginner why h6 is slow.

### Learn The French Defense With 3.Nc3 (#50, 22 min) [V]
- L1 C1 (`rnbqk2r/pppnbppp/4p3/3pP1B1/3P4/2N5/PPP2PPP/R2QKBNR w KQkq`, the Classical French, move 6). d14 White: h4 +0.60, Bxe7 +0.34, Be3 -0.14, Bf4 -0.49, Bd2 -0.62, Bc1 -0.88.
- Bc1 red: "There's a stronger move. Try to find a way to defend g5." (the bishop is attacked on g5? it is attacked by the e7 bishop: the red names the real problem). Bxe7 (0.26 behind h4) AMBER "an alternative": "This is a good move, but Kasparov chose to offer a strong gambit. What did he play?" (names the course's champion and the idea word "gambit"). h4 green: "This enters the dangerous Alekhine - Chatard Attack. What's next?"
- Finding [V]: names the master and the line (Alekhine-Chatard) in the feedback, a "learn the name" hook; the lesson thus doubles as opening-name vocabulary.

### Learn The Center Game And Danish Gambit (#51, 18 min) [V]
- L1 C1 (`rnbqkb1r/ppp2ppp/5n2/3B4/4P3/8/PB3PPP/RN1QK1NR w KQkq`, a Danish gambit position, White two pawns down, bishop on d5 attacked). d14 White: Bxf7+ +0.04, Nc3 -0.53, Ne2 -0.81, Nf3 -1.18, Qd2 -1.36. Qd2 red: "There's a better move. Try to find it and check the hint if you're stuck." (generic, no class). Bxf7+ green: "Great move! What should you capture next?"
- Tool note [V]: a click on a bishop square with the wrong rank (y) is silent and the pre-move prompt is re-shown ("Allowing Nxd5 or retreating the bishop gives Black a good position. What should White play?"); that prompt is the real goal-in-the-prompt text and appears only after a stray click, as in Exploiting Typical Opening Errors.
- Finding [V]: "Great move!" for a move the engine puts at +0.04 (the position is a gambit being justified by a forced line, not a winning one). Course tone is encouraging for any book move.

### Learn The Vienna Game And Bishop's Opening (#52, 25 min) [V]
- L1 C1 (`rnbqkb1r/pppp1ppp/8/4p3/2BPn3/8/PPP2PPP/RNBQK1NR w KQkq`, Bishop's Opening with 3.d4 against ...Nxe4). d14 White: dxe5 +0.83, Bd5 -0.46, Bd3 -0.51, Nf3 -0.88, Bb3 -1.07, Nc3 -1.18. Nc3 red: "There's a better move. Try again and look for a way to win material." (the goal is stated as a class). dxe5 green: "Good start! How should White win material?" (+0.83 is an edge, not a won piece; the "win material" claim is the line's follow-up).

### Learn The Four Knights Game (#55, 17 min) [V]
- L1 C1 (`r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/2N2N2/PPPP1PPP/R1BQK2R b KQkq`, flipped, Italian Four Knights, move 4). d14 Black: Nxe4 +0.02, Bc5 -0.16, Bb4 -0.25, Be7 -0.35, Na5 -0.66, a6 -0.69. a6 red: "There's a better option. Try again and look for a strong and temporary sacrifice." (a hint that names the concept, "temporary sacrifice", for a pawn-grab). Nxe4 green: "We will examine Bxf7+ in the next challenge. How should Black win back the sacrificed material after Nxe4?" (an explicit forward pointer: the lesson announces what comes next).
- L2 "Thematic Tactics" C1 (`r1bq1rk1/pppp1ppp/2n2n2/2b5/3NP3/2N1B3/PPP2PPP/R2QKB1R w KQ`, a real tactic): d14 White: Nxc6 +5.73 (bxc6 Bxc5), Ne6 +0.41, f3 +0.37, Be2 +0.20. Ne6 red: "There's a better move. Try to find a way to win material and check the hint if you're stuck." Nxc6 green: "Good start! What's next?"
- Deeper-lesson check [V]: here L2 does change kind: L1 asks for the opening move and L2 asks for a tactic with a +5.7 answer and a tempting +0.4 decoy; the wrong-move text is still the generic template (the decoy sacrifice is graded exactly like a quiet move).

### Learn The Two Knights Defense (#56, 23 min) [V]
- L1 C1 (`r1bqkb1r/ppp2ppp/2n5/3np1N1/2B5/8/PPPP1PPP/RNBQK2R w KQkq`, Fried Liver line, move 6). d14 White: Nxf7 +1.08, d4 +0.70, d3 -0.16, O-O -0.29, Nf3 -0.88. Nf3 red: "There's a better move. Try to find it and check the hint if you're stuck." d4 (0.38 behind) AMBER: "This is a good move, but there's an even better one. Try to find it." Nxf7 green: "Great move! How should you take advantage of the exposed black king?"
- Finding [V]: calibrated amber (0.38 gap) but the amber and red texts are both content-free here ("try to find it"); the right-move text carries the concept (exposed king).

### Learn The Scotch Game (#57, 22 min) [V]
- L1 C1 (`r1bqk2r/pppp1ppp/2n2n2/2b5/3NP3/4B3/PPP2PPP/RN1QKB1R w KQkq`, move 6): the same trap as Four Knights L2 C1. d14 White: Nxc6 +5.83, Nc3 +0.36, Nf5 +0.30, c3 -0.21. Nc3 red: "There's a better move. Try to find a way to win material." Nxc6 green: "Good start! What's next?" (the knight takes, bxc6 Bxc5 wins a piece; the green text does not say what is won).
- Finding [V]: the same Nxc6/Bxc5 pin-trick appears as L1 C1 in Scotch and L2 C1 in Four Knights, i.e. the family re-teaches one motif in two courses; the reds are the same generic sentence.

### Learn The Petroff Defense (#59, 34 min) [V]
- L1 C1 (`rnbqkb1r/pppp1ppp/8/4N3/4n3/8/PPPP1PPP/RNBQKB1R w KQkq`, after 3.Nxe5 Nxe4). d14 White: Qe2 +0.94 (the famous trap line), d4 +0.26, Nxf7 +0.23, d3 +0.21, Nc3 -0.01, Nf3 -0.06. Nf3 red: "There's a better move. Try to find it." Qe2 green: "Good start! Black should have played Qe7, which only lets White emerge with an extra pawn. Now White has a famous trap which wins the black queen. What should you play?" (a long, rich response that explains what Black should have done, then asks the follow-up).
- Finding [V]: the course shows the refutation of Black's tempting alternative before the learner plays it, so the lesson is trap + correct defence in one sequence, a model for Scholarmate's "trap and its antidote" items. Wrong-move text is generic (0.9 gap, not even "better move to win material").

### Learn The Trompowsky And Torre Attack (#60, 33 min) [V]
- L1 C1 (`rnbqkb1r/pppp1pp1/4pn1p/8/3PP2B/8/PPP2PPP/RN1QKBNR b KQkq`, flipped, 1.d4 Nf6 2.Bg5 e6 3.e4 h6 4.Bh4). d14 Black: g5 +1.38 (Bg3 Nxe4 wins a pawn), d5 +0.05, c5 -0.10, d6 -0.23, Be7 -0.26. Be7 red: "White is OK. Try again." (a calibrated evaluation: the move leaves White +0.26). g5 green: "Good move! What's next?" (the best-known refutation of the early h6; filler praise).
- Finding [V]: red text that is only an evaluation ("White is OK") with no goal or hint, the shortest and least helpful red in the family; accuracy is fine, teaching value low.

### Learn The Budapest Defense (#61, 22 min) [V]
- L1 C1 (`r1bqk2r/1ppp1ppp/2n5/p1b1P3/2P1n3/P3PN2/1P3PPP/RNBQKB1R w KQkq`, White to move in a Budapest line where Black has gone wrong). d14 White: Qd5 +4.07 (fork of Ne4/Bc5/f7), Bd3 +1.67, Qc2 +1.56, h4 +1.48, Be2 +1.37. Be2 red: "There's a better option. Try again and look for a strong fork." Qd5 green: "Good move! What's the best way to get ahead?"
- Finding [V]: the Black-repertoire course opens with the learner on the WHITE side punishing a mistake, i.e. a "trap, from the other side" start. Be2 still keeps +1.37, so the red is a "stronger move exists" statement for a move that is already winning-ish; the "strong fork" text names the class.

### Learn The Benko Gambit (#62, 29 min) [V]
- L1 C1 (`rn1qkb1r/3ppp1p/b4np1/2pP4/4P3/2N5/PP3PPP/R1BQKBNR b KQkq`, flipped, move 7, the Benko with the e4 advance). Flat, d14 Black: d6 -0.77, Qa5 -0.79, Bxf1 -0.83, Qc7 -1.02, e6 -1.72, Bg7 -1.86.
- Bxf1 green with an explanatory text 150 characters long: "White must play Kxf1 to win back the piece and must lose the right to castle. This is a key idea in the Benko when White advances the e-pawn." (a theme statement, not a move comment; the best explanatory right-move text in the family). d6 also accepted: the lesson then shows "White to Move: How should White clear a safe square for the king?" (a prompt that continues into the opponent's side).
- Tool note [V]: after Retry in a multi-step challenge the lesson stays at step 2; a further click then registers on the wrong colour and reads "b1 is incorrect ... look for a useful pawn move", a stray result from my click, not from the course.
- Finding [V]: two of the three near-equal moves (-0.77, -0.83) are accepted, one 0.06 behind the other, which is the calibrated behaviour; a theme-sentence on the right move is the thing to copy.

### Learn The Queen's Indian Defense (#63, 17 min) [V]
- L1 C1 (`r2q1rk1/pb1pbpp1/1pn2n1p/3P4/7B/2NB1N2/PP3PPP/R2Q1RK1 b - -`, flipped, move 12, Black can take a pawn on d5). d14 Black: Nxd5 +0.22, Nb4 -0.25, Na5 -1.26, Nb8 -1.86, Nh5 -5.33, Ne5 -5.54. Ne5 red: "White is doing well. Try again and look for a way to win material." (understates: White is +5.5, i.e. winning). Nxd5 green: "Good choice! What should you capture next?"
- Finding [V]: the adjective scale: "OK" for +0.26 (Trompowsky), "slightly better" for +0.45 (Alekhine), "doing well" for +5.5 here. The same family uses "doing well" for a won game, so the words are not a graded scale.

### Learn The Bogo-Indian Defense (#64, 24 min) [V]
- L1 C1 (`r2q1rk1/pbpn2pp/1p1pp3/5p2/1PPPn3/P3PN2/2Q1BPPP/R1B2RK1 w - -`, move 12, flat). d14 White: Ne1 +0.77, d5 +0.54, Bb2 +0.50, c5 +0.48, Nd2 +0.41, Bd3 +0.30, a4 +0.29. a4 red: "There's a better option. Try again and look for a useful pawn break." Ne1 (engine-first) AMBER: "This is a good choice, but GM Gelfand preferred a powerful pawn break. What did he play?" 
- Finding [V]: the amber is attached to the engine's first move because the course answer is the pawn break (Gelfand's game move); the text says so honestly ("a good choice"), which is the right wording for "different from the book, not worse".

## Wolff "Champion Tactics" (Team, IAM, one tactic per course; lessons titled "Lesson N", URL `lesson-N-1`)

### Champion Tactics with GM Wolff - Clearance Sacrifice (#350, 24 lessons) [V]
- L1 C1 (`8/3b4/1pk3p1/2p1PnB1/2P2Pr1/2KN4/8/R7 w - -`, Challenge 1/3). d18 White: e6 +3.14 (attacks the bishop and clears e5 for the Nd3), Bd8 +0.28, Ra7 +0.26, Re1 -0.67, Ra6 -0.70. Re1 red: "You are missing a strong tactical opportunity. There is only one correct choice to force a win of material. Try again." (true here: the next move is 2.9 pawns behind). e6 green with the concept: "It's the pawn on e5 that is in the way of White's Knight. This move gets it out of the way with tempo, that is, with gain of time because it attacks Black's Bishop." (the right-move text teaches the theme in two sentences).
- L12 C1 (`r4r1k/p5pp/1p4Q1/2p1Bp2/2P2Pn1/7R/PP3qPP/R6K b - -`, Challenge 1/4, Black under a mating threat). d18 Black: Qe1+ +4.75 (Rxe1 Nf2+), then Nf6, Qxg2+, Qf1+, Qg1+ and b5 all get Black MATED (mate -2/-3). Nf6 red: "You are missing a combination which will allow for the gain of material and avoid the mating threats which white currently has. Try again." Qe1+ green: "Only this check does the trick, because when White captures the Queen, the key square must not be defended."
- Check [V]: the claim "only this check" is true by engine (every other tested candidate loses to a forced mate), so the text is exact. The wrong text is honest but names no square or idea.
- Deeper-lesson check [V]: L12 is harder than L1 in the right way (mating threat to defuse, 4 challenges against 3, a quiet-looking check as the only move) and the text escalates with it ("avoid the mating threats"). This is the one family so far where the deeper lesson changes the demand, not only the opening.

### Champion Tactics with GM Wolff - Pins and Skewers (#358, 52 lessons, URL `lesson-1-9`: the numeric suffix is not always 1) [V]
- L1 C1 (`5r2/pp2k3/2q2p2/3Qb3/2Bp4/1P5R/P5KP/8 w - -`, Challenge 1/2). d18 White: Rh7+ MATE in 8 (Ke8 Bb5, the pin wins the queen then mate), Kf1 -0.36, Kf3 -0.39, Qxc6 -0.41, Kf2 -0.43, Qf3 -0.53. Kf1 red: "There is only one road that leads to a winning position. Try again." (true by engine: one forcing move, everything else is slightly worse for White). Rh7+ green: "Forcing the King back to the e8 square." (a terse explanation: the idea is the check that fixes the king on e8 before the bishop pin).
- Check [V]: the "one road" wording is accurate and the position is a real deep tactic (mate in 8 for a C1 of lesson 1), i.e. the first Wolff puzzle is already advanced; the difficulty ladder (Pins and Skewers 52 lessons) starts high.
- Family result [V]: Wolff courses are one-tactic puzzle sets (1 to 4 challenges per lesson, 13 to 52 lessons per course), engine-faithful, graded by "only move" logic, with a short idea sentence on the right move. That is exactly the "tactic pattern with an exact refutation" shape; the lack of any ladder (lesson 12 is no longer than lesson 1 in text) is the gap.

## Kane Studies

### Oleg Pervakov's Studies (#107, Jeremy Kane, 9 lessons with topic titles such as "Saving The Pawn Ending", "Not A Draw", "Checkmate Or Promote"; lesson URLs are `oleg-pervakov-<topic>`) [V]
- L1 "Saving The Pawn Ending", Challenge 1/1 (`8/1p6/5K2/5p2/k7/3P4/8/8 w - -`). Engine d24 White: Kg5! 0.00 (draw), Kxf5 -7.43, Ke5 -8.97, Ke6 -16.78, Ke7 -18.92, Kg6 -91.65 (lost). Kxf5 red: "Black will promote the b-pawn with check and win the game. Try to find a better move." (true: the b-pawn runs). Kg5 green: "Great start! What's next?" then the line continues.
- Finding [V]: the study result is a DRAW, and the prompt does not state the target result (consistent with Rinck and Kubbel); the title "Saving The Pawn Ending" gives the goal, which the Rinck title ("Finding A Path") did not. Lesson titles in this course name the theme (pins and forks, pawns holding rooks, checkmate beats promotion), a content map Scholarmate's endgame/study strand could reuse.

## Engine courses (Sam Copeland / Chess.com Team)

### Learn From The Best: Stockfish (#145, 4 lessons, 20 challenges, 51 min; lesson titles "Stockfish's Morphy Impression", "...King's Indian", "Stockfish Slays The Dragon", "Stockfish Goes On A King Hunt") [V]
- L1 C1 (`r1bqkb1r/ppppnppp/2n5/4p3/2P5/1P3N2/PB1PPPPP/RN1QKB1R b KQkq`, Challenge 1/5, flipped). d16 Black: d5 +0.22, d6 -0.35, f6 -0.35, e4 -0.36, h5 -0.42, Ng6 -0.71. Ng6 red: "The knight won't be stable on g6. Try to find a stronger pawn move." (true: h4-h5 kicks it; the text also tells the move class, a pawn move). d5 green: "Nice move! How should you recapture?" (scripted follow-up).
- Finding [V]: lesson titles are clickbait-style character studies of an engine's play; the content is a normal "choose the book move" lesson and the amount of hint in the red text (the piece and the class of the answer) is higher than in the Komodo course.

### Learn From The Best: Leela Chess Zero (#155, 5 lessons: "The Troll", "Pawn Storm", "King Hunt", "Amazing Sacrifice", "Vs The Newcomer"; Team, 25 challenges) [V]
- L1 "The Troll" C1 (`r1bqk2r/1pp2pp1/3p3p/p1b5/P1BpPPn1/3P4/1PPN2PP/R1BQ1RK1 w kq`, Challenge 1/5). d16 White: Nb3 +1.12, Nf3 +0.99, Nb1 +0.28, f5 +0.12, Qe2 -0.58, Qe1 -1.01. Qe1 red: "There's a stronger option. Try to find a way to defend the e3 square." (names the real problem). Nb1 (+0.28, the "troll" retreat) red: "There's a more active square for the knight. Try to find it." Nb3 green: "Nice move! What's next?"
- Finding [V]: a +0.28 retreat is red with a hint to a "more active" square, true (0.8 behind); the "troll" title promises a trick move, and the first challenge is not it (the engine's top is the ordinary Nb3). Titles over-promise, as with "Thematic Tactics".

## Combinations of Mikhail Tal Part 2 (#271, Team, AM, 9 lessons with topic titles: Air for the King, Drag that King out, Get the King at home) [V]
- L1 "Air for the King" C1 (`8/8/4np2/4pk1p/RNr4P/P3KP2/1P6/8 w - -`, Challenge 1/2; game move 70, an endgame, not an attack). d20 White: Nd5 +6.27 (Nf4 Rxc4), Ra6 -0.14, Ra8 -0.29, Ra7 -0.51, b3 -0.89. Ra6 red: "This move is missing the moment and the black king escapes!" Nd5 green: "The only move which wins, but it wins straight away!"
- Check [V]: "the only move which wins" is true (next best -0.14). Red text is in-narrative (the king escapes), gives the consequence but no hint.
- Finding [V]: Tal 2 has topic-named lessons (a content map: king air, king drag), unlike Tal 1's numbering, and starts at a Tal endgame; lesson length stays at 2 challenges.

## 2020 - 2021 Candidates Highlights (#177, Jeremy Kane, IAM, 14 lessons, 75 min; lessons are round recaps: "Nepo and Wang Take The Lead!", "MVL and Caruana Get On The Board", ...) [V]
- L1 C1 (`r1b1k2r/1p3ppp/1q2p3/1p1p4/1bP2BP1/2N1P1P1/P4P2/2RQKB1R b Kkq`, Challenge 1/10, flipped). d18 Black: Ra3 +0.14, bxc4 -1.00, f6 -1.22, dxc4 -1.24, Rxa2 -1.31, Bxc3+ -2.44, Bd7 -2.76. Bd7 red: "There's a better move. Try to find the strongest way to attack the pinned knight." Ra3 green: "Good start! How should you chase away a defender of the white knight?" (a multi-step line).
- Finding [V]: a tournament recap in event-news form: each lesson is a round (10 challenges) from several games, i.e. a "current events" lesson type with a time hook; lesson titles are headlines naming players, not ideas.

## Content gaps for Scholarmate (grep of `content/lessons`, `content/skills`, `content/courses`, 9 Nov 2026; keyword counts are rough [I], lesson ids from `ls content/lessons`)
Scholarmate has full opening lesson sets for: Italian (8), Ruy Lopez (8), Najdorf (8), Dragon (9), King's Indian Defence (8), Queen's Gambit Declined (8), plus the odd-opening sets ALIEN, ELEPHANT, MARTIAN. It has ONE lesson each (L-OD-<X>-1) for: Benoni, Caro-Kann, Catalan, Dutch, English, French, Gruenfeld, London, Nimzo, Pirc, Scandinavian, Slav. Sampled chess.com courses with NO opening lesson in `content/` (zero keyword hits unless noted) [I]:
- Zero hits: Black Knights' Tango, Old Indian, Center Game / Danish Gambit, Scotch, Petroff, Trompowsky / Torre, Bogo-Indian, Rossolimo (Sicilian), Sveshnikov.
- Mentions only (1 to 5 files, no dedicated lesson): Evans Gambit, Alekhine, Vienna / Bishop's Opening, Four Knights, Budapest, Benko, Queen's Indian, Queen's Gambit Accepted, Cambridge Springs, Marshall, Berlin, Closed Sicilian, Alapin, Semi-Slav, French Advance/Tarrasch and Winawer, King's Indian Attack/Reti (hit count of 9 includes unrelated words, treat as unconfirmed).
- Tactics families: Wolff covers named tactics we also teach (back rank, forks, pins and skewers, discovered check, double attack, deflection, interference, clearance sacrifice, zwischenzug, smother, misplaced pieces). Gap check needed for clearance sacrifice, interference, misplaced pieces and smothered mate as named lessons (not grepped here) [I].
- Study courses (Kane: Kubbel, Rinck, Pervakov, Kasparyan, Benko, Troitsky, Reti) teach composed endgame studies with a topic title per lesson ("Saving The Pawn Ending", "Checkmate Beats Promotion"). `content/endgames` has technique but no composed-study lane [I].
- Event-recap format (Candidates Highlights): no equivalent; Scholarmate's Games review is the nearest.

## Five findings (families A) [V unless marked]
1. Grading is by the book move, with a three-state display: in the Learn-the-X shell both the engine's first move (Evans cxd4 red at +0.01; KIA Re1 amber while tied first) and a clearly weaker move (English cxb4 -0.74 green, "good winning chances") are mis-graded; the calibrated cases are Alekhine (red text states the evaluation), Old Indian and Pirc (amber at 0.14 to 0.3). Scholarmate rule: accepted set from the engine, "book move" as a separate label.
2. The red text is a hint in disguise in about 80 percent of the sampled items: it names the class ("a strong fork", "a pawn break", "a capture", "defend e3") rather than the move. That is the cheapest hint ladder rung and could be a required field per item (`why_wrong` + `class_hint`).
3. Shell is identical for 21 openings: L1 key ideas from move 4 to 12 with no board-setup explanation, L2 "thematic tactics" (title overpromises: Dutch L2 C1 was a move-4 development question; Four Knights L2 C1 was a real +5.7 tactic), L3 one-challenge model game played move by move as one side. Deeper lessons do not escalate; Wolff does (L12 mate-threat defence vs L1 clearance) [V, one sample each].
4. Wolff puzzle courses are the best-checked content seen: "only one correct choice" claims held up under engine check (Pins and Skewers a mate in 8, Clearance L12 a unique saving check). 13 to 52 one-tactic lessons per course with a two-sentence theme explanation on the right move. Scholarmate has no per-tactic puzzle ladder of that size [I].
5. Long right-move texts that teach a theme beat "Good move! What's next?": Benko ("White must play Kxf1 ... a key idea in the Benko"), Petroff (names the refuted alternative and the trap), Wolff Clearance ("gain of time because it attacks the bishop"). The generic filler appeared in about half of the sampled right moves (Tango, Old Indian, Scotch, Trompowsky, Leela, Stockfish).

## Tracker state and resume point
Sampled this run (lesson 1 challenge 1, wrong then right move, engine check): 30 courses: Learn the X 22 (Evans, Catalan, Indian/Tango, Flank, Old Indian, Dutch, KIA/Reti, Pirc/Modern, English, Alekhine, French Tarrasch/Advance, French 3.Nc3, Center/Danish, Vienna/Bishop's, Four Knights, Two Knights, Scotch, Petroff, Trompowsky/Torre, Budapest, Benko, Queen's Indian, Bogo-Indian = 23), Wolff 2 (Clearance, Pins and Skewers), Kane Studies 1 (Pervakov), Learn From The Best 2 (Stockfish, Leela), Tal Part 2, Candidates Highlights #177. Later lessons sampled: Evans L3, Dutch L2, Alekhine L3, Four Knights L2, Wolff Clearance L12 (5 later-lesson samples in 31 courses).
RESUME HERE: Learn the X still unsampled (about 21): Nimzo-Indian, Benoni, Gruenfeld, Slav, Queen's Gambit Accepted, QGD, QGD Cambridge Springs/Orthodox, QGD Bf4, Semi-Slav, Ruy Lopez Closed / Tricky Systems / Marshall / Berlin, Sicilian Rossolimo-Moscow / Closed / 2...e6 / Alapin / Dragon / Sveshnikov / Najdorf, King's Indian Defense, Caro-Kann (partly played earlier). Wolff unsampled: Deflecting the Defender, Discovered Check, Double Attacks, In Between Moves, Interference, Misplaced Pieces, Smother Tactics. Kane Studies unsampled: Kasparyan, Benko, Troitsky, Reti. Tal Part 3. Later-lesson samples still owed for most of the rest (every 4th course). Method unchanged (see header; board x=104+63*file, y=42+63*(8-rank), flipped x=104+63*(7-file), y=42+63*(rank-1), Retry (733,757); lesson 1 URL = first lesson link on the course page; later lessons `<course>-thematic-tactics`, `-model-game`).


## Segment 17 (9 Nov 2026): remaining Learn-the-X courses, 7 Wolff courses, 4 Kane Studies, Tal Part 3

Sign convention [V]: ALL engine scores below are from the SIDE TO MOVE's point of view (eng.py / `tools/engine.py`, local Stockfish 19 lite single thread; depth stated in each line, 14 for Learn-the-X, 18 to 20 for Wolff, 24 to 30 for studies; positive = good for the player to move). Labels: [V] seen on chess.com and checked here, [I] inference for Scholarmate. Wording original; only short feedback phrases quoted. Method: lesson 1 challenge 1 (the lesson URL opened directly, `navigate` plus a Start script in one browser_batch), one deliberate wrong move where it registered, then the right move and, where cheap, a second alternative to read the amber tier; FEN from `game.getFEN()`; Retry (733,757); clicks computed from file/rank by a helper. Own tab. Feedback text appears BEFORE the "Challenge n/m" marker in the page text. The grader labels the move by destination square only ("d2 is incorrect", "xe6 is correct", "ge2" for a disambiguated knight move).

### Learn The Nimzo Indian Defense (#65, 20 min) [V]
- L1 C1 (`r2q1rk1/pb1p1ppp/1p2pn2/n1p5/2PPP3/P1PB1P2/4N1PP/R1BQ1RK1 b - -`, flipped, move 11, Black's knight on a5 and f6 attacked by e5). d14 Black: Ne8 +0.22, cxd4 -0.02, Rc8 -0.15, Qe7 -0.38, h6 -0.39, Ba6 -0.56, Nh5 -0.80, d6 -0.87.
- Nh5 red: "There's a stronger option. Try again and look for a good knight move." (class hint, exact). cxd4 (0.24 behind) AMBER: "This is reasonable, but it's safer to prevent White from pinning with Bg5. How should you do it?" Ne8 green: "Good choice! The knight is no longer a target and Black has the option of meeting f3-f4 with f7-f5 ... You may enjoy checking out the spectacular game, Geller - Euwe, 1953" (a theme sentence plus a game pointer).
- Finding [V]: amber at a 0.24 gap names the cost ("safer to prevent the pin") and the surplus step; the right text links a model game, an "optional deeper" pointer.

### Learn The Benoni Defense (#66, 24 min) [V]
- L1 C1 (`rnbqkb1r/pp1p1ppp/3Ppn2/2p5/2P5/8/PP2PPPP/RNBQKBNR b KQkq`, flipped, move 4, White has pushed a pawn to d6 en prise). d14 Black: Ne4 +1.33, Qb6 +0.97, Qa5+ +0.17, a6 -0.01, b5 -0.02, b6 -0.41, g6 -0.65, Na6 -0.73.
- g6 red: "It's better to target the d6-pawn with another piece. How should you do it?" (goal + question). Qb6 (0.36 behind) AMBER: "This is a good choice, but it's even stronger to attack d6 with a knight." Ne4 green: "Great start! How should you take advantage of the exposed bishop on f4?" (scripted follow-up; the lesson then plays White's reply).
- Finding [V]: the amber and red texts agree with the engine ranking (Qb6 second, g6 seventh); the key "attack d6 with a knight" is the same goal in both. A clean three-state calibration at 0.36 / 2.0.

### Learn The Grunfeld Defense (#67, 23 min) [V]
- L1 C1 (`rnbqkb1r/ppp1pppp/5n2/3p4/2PP4/8/PP2PPPP/RNBQKBNR w KQkq`, move 3 after 1.d4 Nf6 2.c4 d5, Black's move-order error). d14 White: cxd5 +0.52, Nf3 +0.22, Nc3 +0.22, e3 +0.10, g3 -0.12, h3 -0.13.
- h3 red: "There's a better move. Look at your forcing options and try again." Nc3 (0.30 behind, a main-line Grunfeld transposition) red with a REASON: "This transposes back into a main-line Grunfeld defense or Queen's Gambit. Try again and look for a more forcing way to punish Black's move order mistake." cxd5 green: "Good start! e4 is playable, but it's more precise to delay that advance and develop a piece first. How should you do it?"
- Finding [V]: the best red text of the batch: it states why a sound move is rejected (it lets Black back into the main line), i.e. a goal-conditioned item ("punish the move-order error"). A 0.3 gap is red here, amber elsewhere, so the tier depends on the item's goal, not the margin alone.

### Learn The Slav Defense (#68, 31 min) [V]
- L1 C1 (`rn1qkb1r/pp2pppp/5n2/3p1b2/3P4/1QN1P3/PP3PPP/R1B1KBNR b KQkq`, flipped, move 6, Qb3 hits b7). d14 Black: Nc6 -0.35, Bc8 -0.36, e6 -0.45, Qd7 -0.60, Nbd7 -0.78, a6 -1.02, Bd7 -1.19, Qc7 -1.29.
- a6 red: "There's a better option. Try again and look for a strong developing move." Nc6 green: "A great pawn sacrifice! How should you save your knight?" (the gambit-style answer is engine-first). e6 (0.10 behind the top) RED: "There's a better option. Try again and look for the strongest way to protect c6."
- Finding [V]: a 0.10 gap is red, so the grader accepts one move out of a flat top three (Nc6/Bc8/e6 within 0.1); "strongest way to protect c6" is again a goal that is true only of the book move. Same unit as Nimzo amber at 0.24: no consistent tier threshold.

### Learn The Queen's Gambit Accepted (#69, 19 min) [V]
- L1 C1 (`rn1qkbnr/pp3ppp/4b3/2p1N3/2BpP3/8/PP3PPP/RNBQK2R w KQkq`, move 7, Black has played ...Be6 into a pin-free bishop trade). d14 White: Bxe6 +1.10, Qa4+ +0.05, Bb5+ -0.14, Qb3 -0.31, Na3 -0.34, Nd2 -0.46, O-O -0.59, a4 -0.75.
- Nd2 red: "There's a better move. Try again and look for a strong forcing option." Bxe6 green: "Nice move! How should you continue the attack?" (scripted follow-up).
- Tool/UI note [V]: the status line names the move by destination only ("d2 is incorrect", "xe6 is correct"), the same short label for every course in the shell; the SAN is not shown.

### Learn the Queen's Gambit Declined (#169, 24 min) [V]
- L1 C1 (`rnbqkb1r/ppp2pp1/4pn1p/3p2B1/2PP4/2N5/PP2PPPP/R2QKBNR w KQkq`, move 5, Black has asked the g5 bishop with ...h6). d14 White: Bxf6 +1.24, Bh4 +0.05, Bf4 0.00, Bc1 -0.31, Bd2 -0.32, Qa4+ -0.46, Be3 -0.66, cxd5 -4.41.
- cxd5 red: "Black is winning. Try to find a better capture." (true, -4.4; the red names the evaluation and the class "capture"). Bh4 red: "Black is OK. Try to find a good capture." (true at 0.05, "OK" = level, the accurate word here). Bxf6 green: "Good choice! Black should have accepted doubled pawns with gxf6. Now White can win material. How?"
- Finding [V]: the evaluation-only red ("Black is winning" / "Black is OK") is the only text in this family that scales with the engine margin, and here both words are correct: -4.4 winning, 0.05 level. The "capture" class hint appears in both reds, so even a bad move is told the answer class.

### Learn the Queen's Gambit: Cambridge Springs and Orthodox Defense (#170, 23 min) [V]
- L1 C1 (`r1bqkb1r/pppn1ppp/5n2/3N2B1/3P4/8/PP2PPPP/R2QKBNR b KQkq`, flipped, move 6, the White knight on d5 hangs to the pinned Nf6). d14 Black: Nxd5 +4.88, h6 -0.76, c6 -1.07, Nb6 -1.18, Bd6 -1.20.
- h6 red: "White is doing well. Try to find a strong capture." (evaluation word plus the class "capture"; true, -0.76 and the capture is +4.9). Nxd5 green: "Great move! How can you win back the queen?" (the lesson then plays the Cambridge Springs trap: the queen is offered and regained).
- Finding [V]: the opening of the Cambridge Springs course is the trap, as with the Tango and Budapest courses: first challenge is "take the free piece", the learner sees the punchline before the setup. That is an engagement hook, but there is no "what did White do wrong" sentence.

### Learn The Queen's Gambit: Bf4 Variation (#80, 19 min) [V]
- L1 C1 (`r1bq1rk1/p2nbppp/1pp1pn2/2Pp4/3P1B2/2NBPN2/PP3PPP/R2QK2R w KQ`, move 9, a Carlsbad-like fight over c5). d14 White: b4 +0.19, cxb6 -0.21, Qa4 -0.33, Rc1 -0.89, O-O -0.90, Ne5 -1.00, h3 -1.04, Na4 -1.14.
- Rc1 red: "There's a better move. Try to find the best way to defend c5." cxb6 (a 0.40 gap, a pawn trade) red: "Black is doing well. Try again." (an overstatement: after cxb6 Black is +0.2, level). b4 green: "Good start! How can you keep everything defended?"
- Finding [V]: "doing well" for +0.2 is the same loose adjective seen in Queen's Indian (+5.5 also "doing well"), so the words in this shell do not scale: level (QGD: "Black is OK"), +0.2 and +5.5 can share one word. Two reds use different information: Rc1 states the goal ("defend c5"), cxb6 states only the verdict and no goal.

### Learn the Semi-Slav Defense (#187, 14 min) [V]
- L1 C1 (`r1bqkb1r/pp1n1ppp/2p1pn2/3p4/2PP4/2NBPN2/PP3PPP/R1BQK2R b KQkq`, flipped, move 6, the Meran trigger). Flat, d14 Black: dxc4 -0.26, Be7 -0.34, b6 -0.37, Bb4 -0.41, a6 -0.42, Bd6 -0.44, c5 -0.47, a5 -0.52.
- a5 (0.26 behind) red: "There's a better move. Try to find it." (the least informative red of the shell: no goal, no class). Be7 (0.08 behind) AMBER: "This is playable, but there's a stronger and more popular move. Try to find it." dxc4 green: "Good start! How should you continue to attack White's bishop?"
- Finding [V]: the amber criterion is stated as "more popular": the grading is by opening-database frequency, which the learner is told, an honest label for a flat position. Scholarmate can copy the honesty: label a book answer "the main-line move" instead of "the best move".

### Learn The Ruy Lopez Closed Variation (#78, 22 min, IAM) [V]
- L1 C1 (`r1bqkbnr/1pp2ppp/p1p5/4N3/4P3/8/PPPP1PPP/RNBQK2R b KQkq`, flipped, move 5): NOT the Closed Ruy. It is the Exchange Variation trap (1.e4 e5 2.Nf3 Nc6 3.Bb5 a6 4.Bxc6 dxc6 5.Nxe5, Black forks). d14 Black: Qd4 +0.47, Qe7 +0.47 (tied), Qg5 0.00, Ne7 -1.07, Qd6 -1.13, f5 -1.18.
- Qd6 red: "There's a better move. Try to find a fork to win a pawn." (true, names the fork). Qe7 (tied first with Qd4) RED: "Black is OK, but there's a better queen move. Try to find it." Qd4 green: "Great move! What's next?" (filler).
- Finding [V]: (1) the course titled Closed Variation begins in the Exchange Ruy, a title/content mismatch of the kind seen in Exploiting Opening Errors 2; (2) an engine-tied move is graded red with a verdict that undersells it ("OK", +0.47); (3) "Great move! What's next?" is filler after a fork.

### Learn the Ruy Lopez: Tricky Systems (#178, 19 min) [V]
- L1 C1 (`8/8/1ppk1p2/p1p2P1p/P1P1PK1P/1P6/8/8 w - -`, a pawn ending). The prompt arrives about 10 s after Start: "This position is an ideal endgame for White in the Exchange Variation. How should you make a passed pawn and win the game?" d20 White: e5+ +6.03, Kf3 +6.03, Kg3 +5.95, Ke3 +5.95, b4 -6.63 (all king moves tie; the goal "make a passed pawn" selects e5+).
- Kf3 (tied top) AMBER: "White is still winning, but there's a better move to make progress. Try to find a stronger option." e5+ green: "Great move! What's next?"
- Finding [V]: a goal-conditioned item in a course called "Tricky Systems" that opens with a composed-looking pawn ending (not a trick, not a system): title/content mismatch again; the amber wording ("still winning, but ... make progress") is the best-calibrated text of the batch: it concedes the evaluation (all moves win) and states the criterion ("make a passed pawn") rather than a number.

### Learn the Ruy Lopez Marshall Attack (#186, 19 min) [V]
- L1 C1 is the SAME position as the Closed Variation course L1 C1 (`r1bqkbnr/1pp2ppp/p1p5/4N3/4P3/8/PPPP1PPP/RNBQK2R b KQkq`: Exchange Ruy trap, Black to play Qd4 fork); not a Marshall position. d14 as above: Qd4 +0.47, Qe7 +0.47, Qg5 0.00.
- Qg5 (0.47 below) AMBER: "This is a good option, but there's a better queen fork. Try to find it." Qd4 green: "Great move! What's next?" In the Closed Variation course the same position gave Qe7 RED ("Black is OK, but there's a better queen move").
- Finding [V]: one item reused in two courses with different feedback texts/states for different alternatives: the Marshall course never reaches the Marshall in C1; the item is the same file, recycled for a different prompt ("queen fork" here, "queen move" there). A duplicate-item detector would catch it; Scholarmate's validator already forbids duplicate FEN across items (check_overlap).

### Learn the Ruy Lopez Berlin Defense (#189, 19 min; lesson URL has a typo "learn-the-ruy-lopze-berlin-defense") [V]
- L1 C1 (`r1bqkb1r/pppp1ppp/2B2n2/4p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq`, flipped, move 4, the Berlin with 4.Bxc6, a recapture choice). d14 Black: dxc6 -0.02, bxc6 -0.31, Bc5 -4.81, a6 -5.07, Be7 -5.19.
- Bc5 red: "White keeps a material advantage. Try to find a stronger move." (true: -4.8, loses a bishop; in this shell the red states the evaluation). bxc6 (0.29 behind) AMBER: "This is OK, but most players choose another recapture. What is it?" dxc6 green: "Good start! What's the best way to win back the lost pawn?" (the lost pawn: the e4 pawn will fall after Nxe4).
- Finding [V]: second course where "most players choose" / "more popular" is the stated amber criterion (Semi-Slav, Berlin, Dutch earlier). The learner is told the answer is a frequency, not a score. The typo in the lesson slug ("lopze") and "siclian" (Alapin) show the same content pipeline has slug defects, harmless to learners.

### Learn The Sicilian Rossolimo And Moscow Variations (#79, 22 min, IAM) [V]
- L1 C1 (`r1bqk2r/p3ppbp/1pp2np1/2p5/4P3/2NPBN1P/PPP2PP1/R2QK2R b KQkq`, flipped, move 8, a Black fianchetto structure with Be3 eyeing h6). Flat; d14 Black: O-O -0.34, Nd7 -0.37, h6 -0.43, a5 -0.50, Qc7 -0.56; d20: O-O -0.34, a5 -0.44, Nd7 -0.50, h6 -0.50.
- Bb7 red: "There's a better option. Try again and look for a way to control the e5-square." Nd7 green: "Good start! How should you prevent White's plan to trade dark-squared bishops?" O-O (the engine's first at BOTH depths) RED: "It's stronger to prevent White from trading dark-squared bishops. How should you do it?"
- Check [V]: the claim "stronger to prevent the trade" is contradicted at d20 (O-O is 0.16 ahead of Nd7). It is a plan-level reason (the strategic story of the line) that the engine does not support; the item is in the book-answer bucket. Lesson for Scholarmate: a strategic reason shown to the learner needs either an engine-agreeing margin or the label "the idea of this line", never "stronger".

### Learn the Closed Sicilian (#179, 19 min, free first lesson) [V]
- L1 C1 (`rnbqkbnr/pp1ppp1p/6p1/2p5/4P3/2N5/PPPP1PPP/R1BQKBNR w KQkq`, move 3, 1.e4 c5 2.Nc3 g6). Flat, d14 White: Nge2 +0.36, Nf3 +0.35, d4 +0.30, h4 +0.18, Bc4/d3 -0.07, a4 -0.08, f4 -0.09, g3 -0.11.
- a4 red: "There's a better move. Try to find a way to develop and prepare d2-d4." (states the two goals). g3 (0.47 behind, the actual Closed Sicilian move) AMBER: "This is an OK move, but doesn't aim for an Open Sicilian. How can you transpose into one of those variations?" Nge2 (engine-first by 0.01) AMBER: "This is reasonable, but there's a more active square for the knight. Try to find it." (answer Nf3).
- Finding [V]: the course named "Closed Sicilian" rewards moving AWAY from the Closed Sicilian: the book answer is the Open-Sicilian-transposing Nf3, and the system's own signature move g3 is amber. Course title and content disagree on purpose or by accident; a learner who picks the course to learn the Closed system is told g3 "doesn't aim for" the thing the course is named after. The knight-move label is "ge2" (file letter plus square for a disambiguated move), a display quirk.

### Learn the Sicilian with 2...e6 (#182, 22 min) [V]
- L1 C1 (`rnbqk2r/pp1p1ppp/4p3/4P3/3N4/2P5/P1P2PPP/R2QKB1R b KQkq`, flipped, move 9, a pawn on e5 and a knight on d4 both loose to a queen fork). d14 Black: Qc7 +1.10, Qa5 +0.25, O-O +0.10, d6 -0.03, a6 -0.09, Nc6 -0.27, h6 -0.28.
- h6 red: "There's a better move. Try to find a fork to win material." (true and names the class). Qa5 red: "Black is only slightly better. Try to find a stronger queen move." (a calibrated verdict: +0.25 is slightly better, and the stated gap to Qc7 is 0.85). Qc7 green: "Good choice! What's next?" (filler).
- Finding [V]: here the red "only slightly better" is accurate to the engine; in other courses (QGD Bf4 "doing well" at +0.2) the same shell exaggerates, so the grader's wording is per-author, not generated from the margin.

### Learn the Sicilian: Alapin Variation (#183, 17 min; URL typo "siclian") [V]
- L1 C1 (`r3kb1r/pp2pppp/1nnq4/8/3p2b1/1BP2N2/PP3PPP/RNBQ1RK1 w kq`, move 10, a trap line where Black's king bishop and knights have wandered and f7 is weak). d14 White: Bxf7+ +0.83 (Kxf7 Ng5+ Kg8 Qxg4), cxd4 0.00, h3 -0.06, a4 -0.11, Qd3 -0.12, Re1 -0.27, Qe2 -0.62.
- Qe2 red: "There's a better move. Try to find a strong forcing option." cxd4 (0.83 behind; a recapture that leaves the position level) red: "Black has a comfortable position. Try to find a stronger move." (an overstatement at 0.00, "comfortable" for an equal position). Bxf7+ green: "Great start! What's next?"
- Finding [V]: the Alapin course opens with a tactical sacrifice (the Tango/Budapest/Cambridge-Springs pattern: trap first), the main-line idea of the Alapin (c3, d4) never appears in C1; the sacrifice's idea is not stated after the right move. "Great start! What's next?" is filler on a piece sacrifice that deserves an explanation (it regains the piece with Ng5+ and Qxg4).

### Learn the Sicilian Dragon (#184, 13 min, the shortest course in the shell) [V]
- L1 C1 (`rnbqkb1r/pp2pp1p/3p2g1/8/3NP1n1/2N1B3/PPP2PPP/R2QKB1R w KQkq`, move 7, the Be3 is attacked by Ng4, Bb5+ is the idea). d14 White: Bb5+ +4.51, Bg5 +0.88, Bc1 +0.38, Bf4 +0.37, Bd2 +0.21, Qf3 -0.37, Nd5 -0.44, Qd2 -0.44.
- Nd5 (-0.44) red: "Black is OK. Try to find a better move." Bg5 (+0.88: White is clearly better) red with the IDENTICAL text "Black is OK. Try to find a better move." Bb5+ green: "Well played! How can you win material?"
- Finding [V]: one text for two moves 1.3 pawns apart in opposite directions of "OK": at Bg5 White is +0.9 and the sentence "Black is OK" is false; at Nd5 Black is +0.4 and "OK" is fair. A fixed template per challenge ignores the move's actual evaluation (the two-moves-one-text test).

### Learn the Sicilian Sveshnikov (#192, 15 min) [V]
- L1 C1 (`r1bqkb1r/p2ppppp/2p2n2/4P3/8/8/PPP2PPP/RNBQKB1R b KQkq`, flipped, move 6, a pawn on e5 hits the Nf6, the queen check wins it). d14 Black: Qa5+ +1.53, Nd5 -0.25, Ng8 -0.54, Ne4 -3.81, e6 -4.48, Rg8 -4.75.
- Ne4 (-3.8, loses a piece to Qd4) red: "White has a good position. Try to find a better move." Nd5 (-0.25) red with the SAME words: "White has a good position. Try to find a better move." Qa5+ green: "Great start! What's next?" (filler).
- Finding [V]: the same template for -0.25 and -3.8 ("a good position" fits neither well: 0.25 is level-ish, 3.8 is winning). Second course of the batch with identical red text for distinct margins (Dragon is the first).

### Learn the Sicilian Najdorf (#197, 10 min, the shortest listed) [V]
- L1 C1 (`rnbqkb1r/1p2pppp/p2p1n2/8/3NP3/2N1B3/PPP2PPP/R2QKB1R b KQkq`, flipped, move 6 after 6.Be3 the English attack). Flat, d14 Black: e5 -0.37, Nc6 -0.48, Ng4 -0.48, Qc7 -0.62, Bd7/e6 -0.64, h6 -0.74, g6 -0.79.
- g6 AMBER (0.42 behind): "This is an OK move, but it's not typical for the Najdorf. Try moving the e-pawn instead." (hint names the piece class). Ng4 (tied second, 0.11 behind) RED: "There's a better move. Try to find it." e5 green: "Good start! White would have been better off playing Nb3 or Ne2. How should Black take advantage of the vulnerable f5 knight?"
- Finding [V]: the amber sits on a worse move (g6, 0.42) and the red on a better one (Ng4, 0.11): the tiers follow "typical for the Najdorf" (g6 is a Najdorf-family move?), not margin. Good feature: the right-move text names the OPPONENT's better alternatives (Nb3 or Ne2) before continuing, i.e. it tells the learner what the other side should have done.

### Learn the King's Indian Defense (#190, 19 min) [V]
- L1 C1 (`rnbqk2r/ppp1ppbp/3p1np1/4P3/2PP4/2N5/PP3PPP/R1BQKBNR b KQkq`, flipped, move 5, White's e5 hits the Nf6). d14 Black: dxe5 +0.66 (dxe5 Qxd1 Nxd1 Nd7 wins the pawn), Nfd7 -0.44, Ng8 -0.44, Ng4 -0.53, Nh5 -1.39, Bg4 -3.97, Ne4 -4.52, O-O -5.13.
- O-O (-5.13, loses a piece) red: "White is doing well. Try to find a stronger move." Nfd7 (-0.44) red with the SAME words. dxe5 green: "Good move! How should you take advantage of the open d-file?"
- Finding [V]: third course (after Dragon, Sveshnikov) where a piece-losing blunder and a 0.4-pawn inaccuracy get the identical red sentence. Calibrated feedback would separate "White wins a piece" from "White is a bit better".

### Learn The Caro-Kann Defense, L2 "Thematic Tactics" (#48, later-lesson sample) [V]
- C1 (`2rqkb1r/p2bpppp/1p6/nB6/Q2P4/2P2N2/P4PPP/R1B1K2R w KQk`, Challenge 1/10, move 13, Black's Bd7 and Qd8 are lined up, the Bd7 is pinned to the c8 rook after Ne5). d16 White: Ne5 +4.85, Rb1 +0.29, Ng5 +0.14, O-O +0.06, h4 -0.06. Bd2 red and Ng5 red: both "There's a better move. Try to find it and check the hint if you're stuck." Ne5 green: "Good move! What's next?" (filler).
- Finding [V]: this is a real tactic (a +4.9 pin/fork), unlike Dutch L2 C1 (move-4 development) and unlike Alapin/Dragon L1: the "thematic tactics" lesson of the Caro-Kann course does deliver a tactic, so L2 quality varies across courses. The red here sends the learner to the Hint button explicitly ("check the hint if you're stuck"), the only shell text that points at the hint ladder (the hint ladder is the support).

### Nimzo-Indian L2 "Thematic Tactics" (#65, later-lesson sample) [V]
- C1 (`2rq1rk1/pb2bppp/1p2pn2/8/2BP4/1QN2N2/PP3PPP/2R1R1K1 w - -`, Challenge 1/10, move 15). d16 White: Bxe6 -0.12 (a bishop sacrifice that holds the balance), Ne2 -0.84, Rcd1 -0.90, Ne5 -1.16, Be2 -1.19, d5 -1.70. d5 red: "Black is slightly better. Try to find a stronger move." (understates: -1.70). Bxe6 green: "Good start! How can you justify the sacrifice?" (a Socratic follow-up).
- Finding [V]: L2 here IS a tactic, a sacrifice whose compensation is only equality (-0.12), i.e. the "tactic" is "keep the balance by a piece sacrifice", a theme not "win material": the position is objectively worse for White (every other move -0.84 or worse), so the item teaches a resource, not a win. Scholarmate's validator would call this "holds", not "wins".

### Champion Tactics with GM Wolff - Deflecting the Defender (#351, 42 lessons) [V]
- L1 C1 (`r1b2rk1/2q4p/6p1/p2pP3/1n3P1P/nBpN1NP1/P3Q3/2R1K2R w K -`, Challenge 1/2). d18 White: Nxb4 +3.56 (axb4 Bxd5, the pawn on a5 is deflected), h5 -2.19, Qe3 -2.30, Ng5 -2.70, Qd1 -3.30. Qe3 red: "There is no clear threat to this move and Black will be up a pawn with no clear compensation for White." (true; the red names the cost in material). Nxb4 green: "Of course if Black does not recapture the Knight, Black has lost a knight for nothing." (the idea of the sacrifice stated as a refutation of declining).
- L42 (last lesson) C1 (`1r1r4/p1RbkppB/1qp1pn2/4N3/P1P5/8/4QPPP/4R1K1 w - -`, Challenge 1/4). d20 White: Ng6+ MATE in 4 (Ke8 Qxe6+ fxe6 Rxe6 ...), Nxc6+ +0.09, Rxd7+ -0.22, Nxd7 -0.63, Bg8 -3.76. Nxd7 red: "You are missing a forced checkmating combination. Try again." (true by engine; the text says what the answer IS, mate). Ng6+ green: "The first of several decoy sacrifices. Basically white wants to deflect selected defenders so that his Queen and king's Rook, presently doubled on a closed file, can achieve full potential."
- Finding [V]: L1 (win a piece with a deflection) versus L42 (a four-challenge mating combination with a decoy sacrifice) shows genuine escalation; the red text switches from material cost (L1) to "missing a forced mating combination" (L42), naming the class of answer. 42 lessons = 1 to 4 challenges each, so about 100 positions for one tactic.

### Champion Tactics with GM Wolff - Discovered Check & Double Check (#352, 33 lessons), lesson 30 C1 (reached by accident via a wrong URL suffix) [V]
- C1 (`6k1/6r1/1pnp4/3q2p1/3B4/3Q4/6P1/5RK1 w - -`, Challenge 1/3). d20 White: Rf8+ +7.03 (Kxf8 Bxg7+ discovers on the queen), Rd1 -1.48, Rf6 -6.42, Qf3 -6.96 (all other moves lose the queen). Rd1 red: "This will save the Bishop but allows Black to trade down to a winning endgame after 1...Nxd4." (a concrete refutation line, true: -1.48 for White). Rf8+ green: "Forcing black's King to a dark square. Why is this so important?" (idea sentence plus a Socratic question).
- Finding [V]: one of the best red texts in the library: names the opponent's reply (1...Nxd4) and the outcome (a winning endgame), and it is true. The lesson number in the URL is a separate counter per course; /lesson-30-2 resolved to this course, not the Deflecting one (URL suffix is a global counter, so lesson links must be taken from the course page).

### Champion Tactics with GM Wolff - Discovered Check & Double Check (#352, 33 lessons), L1 C1 [V]
- L1 C1 (`8/3k4/b3p2p/3pP3/1prN4/3K4/1PR3PP/8 b - -`, flipped, Challenge 1/2). d18 Black: Rc3+ +6.08 (the rook move discovers the bishop's check: a double check), Ke7 -1.49, Ke8 -1.99, Kc8 -2.48. Ke7 red: "This would give time for White to move the King to the safer e3 square." (a true line-level reason). Rc3+ green: "Since the Rook is protected, White has only one legal move to get out of the double check." (states the rule of double check).
- Finding [V]: the right-move texts state a RULE in one sentence ("double check can only be answered by a king move"); the red names the opponent's best defence. The first position is already a double-check tactic with only one winning move.

### Champion Tactics with GM Wolff - Double Attacks (#353, 29 lessons, URL numbers run to 30) [V]
- L1 C1 (`4rrk1/pp1q1ppp/2p5/3p4/3PnPN1/2P4Q/PP4PP/3R1RK1 w - -`, Challenge 1/2). d18 White: Nh6+ +5.86 (gxh6 Qxd7 wins the queen), Rfe1 -0.50, Nf2 -0.51, c4 -0.52, Rd3 -0.53, Qf3 -0.86. Rfe1 red: "A natural plan to bring the Rook to the open file but this is too slow and there is a much stronger choice available." (names the plausible plan and why it is slow). Nh6+ green: "Giving check on the Black King, but also attacking the Queen on d7."
- L29 (last; URL `lesson-30-3`, page title "Lesson 29") C1 (`r4r2/7k/bq1pp1pp/p1pn1p2/3P1P2/P3PNQ1/1P4PP/R1B1K2R b KQ -`, flipped, Challenge 1/2): a position where almost every move wins. d18 Black: Nf6 +5.51, Qb5 +5.24, Nxe3 +4.99, cxd4 +4.93, Rae8 +4.52, Rac8 +4.40, Qb3 +4.15. Rae8 (+4.52, clearly winning) is red "incorrect": "There is a strong move which shows the over extension of white's position and prepares a winning double attack. Try again." Nxe3 (+4.99) green: "It turns out white's Bishop is overloaded allowing this capture."
- Finding [V]: at L29 the item accepts one of seven winning moves and marks a +4.5 move "incorrect"; the text is honest ("a strong move", "prepares a winning double attack") but the label is not. For a thematic puzzle the grade is "the move that uses the double attack", which is fine if the prompt says so ("Find the double attack"); the prompt is only "Black to Move". Scholarmate rule: puzzle items state the motif OR accept everything within a margin, never both silent.
- Defect [V]: the course page lists 29 lessons but the last URL is `lesson-30-3` titled "Lesson 29"; lesson numbers in URLs do not match the visible counter (the numeric suffix is a course/series id).

### Champion Tactics with GM Wolff - In Between Moves (#355, 13 lessons) [V]
- L1 C1 (`4R3/5kpp/BK3p2/8/rp6/8/5PPP/8 b - -`, flipped, Challenge 1/2). d18 Black: Rxa6+ +8.48 (Kxa6 and the rook on e8 is attacked: the in-between check), b3 -2.37, Ra1 -4.09, Kg6 -4.16. b3 red: "This is not the best choice. You are missing an opportunity to turn the game clearly in your favor." Rxa6+ green: "Not only capturing the bishop, but check to boot. White has nothing better than to capture the rook..." (the sentence continues into the follow-up line).
- L13 (last) C1 (`8/pp1r2kp/2p1p1p1/P7/3qP3/2Q3P1/1P3PKP/4R3 w - -`, Challenge 1/3). d18 White: Rd1 +6.63 (the zwischenzug attacks the queen and the rook behind it), Re3 +0.29, Qb3 +0.27, h4 +0.26, Qc2 +0.10. Qc2 red: "This is not correct. You are missing a chance to take a decisive edge. Look again for the one and only best move." Rd1 green: "Indirectly, yes. This move wouldn't work if Black could reply 1...Qxe4+, to say nothing of 1...Qxd1. But as the queen is pinned and attacked, Black must trade on c3."
- Finding [V]: "one and only best move" is TRUE by engine (next best +0.29 against +6.63). The green text begins "Indirectly, yes." which answers a question that is not on screen: an author's Q&A fragment left in the data (a text defect, and a hint that the original was a dialogue). Only 13 lessons for the tactic, the shortest of the Wolff set, so a zwischenzug ladder is much shorter than the pins ladder (52).

### Champion Tactics with GM Wolff - Interference (#356, 21 lessons; URL numbers run to 23) [V]
- L1 C1 (`6k1/p1q2rp1/7p/5Np1/bPQ5/7P/5PP1/4R1K1 w - -`, Challenge 1/2). d18 White: Ne7+ +10.87 (it cuts the rook f7 from the queen c7; the rook is pinned), Qe4 +0.45, Qa2 +0.24, Qd5 +0.15. Qe4 red: "Centralization of the queen is usually a good idea but not when there is a strong tactical chance available." (a principle quoted and then overruled: good teaching). Ne7+ green: "This check cuts off the rook's protection of the queen. Black can't take the knight with the rook, because the rook is pinned to the king. White will win the queen no matter how Black responds."
- L21 (page title "Lesson 21", last) C1 (`3k3r/4Rp1p/3Pp3/3P4/8/1K6/8/8 w - -`, Challenge 1/4). d22 White: dxe6 +5.47, Ra7 +5.05, Rb7 +4.03, Kb4 +0.01, Rxf7 +0.01, Kc4 0.00. Kc4 red: "No, you are missing an opportunity to take a decisive advantage. Try again." dxe6 (engine-first, not the author's main line) AMBER "alternative": "Also wins as a similar continuation will follow just as in the main solution."
- Finding [V]: an amber tier exists in the 2010s Wolff shell and is used exactly right (a different move that also wins, with a reason in one sentence). The rare place where the engine-first move is graded as a valid alternative rather than red. The L1 green text is the model "say what the tactic does" sentence (cut the protection, pinned rook, queen is won).

### Champion Tactics with GM Wolff - Misplaced Pieces (#357, 15 lessons; URL numbers jump, page title "Lesson 15" for `lesson-16-7`) [V]
- L1 C1 (`8/p1p1kppp/1p6/8/5P2/3BP1P1/bPP4P/2K5 w - -`, Challenge 1/2, a bishop stranded on a2). d18 White: b3 +3.74 (the bishop is trapped), Bxh7 +1.39, Kd2 +0.09, h4 +0.06. Kd2 red: "Not the right idea. Try again to spot the winning plan." b3 green: "This cuts off the bishop's retreat. (But not 1.c4? Bb3 and the bishop has plenty of squares to move to.)" (a rule plus the wrong version of the same idea in one sentence).
- L15 (last) C1 (`2kr3r/ppqnbppp/2p1b3/2Pp4/3P1NP1/4BP2/PP1QB2P/2KR3R w - -`, Challenge 1/3, an ordinary middlegame, the misplaced piece is the queen on c7). d18 White: Bf2 +2.08, h4 +1.86, Bd3 +1.79, Kb1 +1.52 ... Nxe6 +1.13 (every move +1.3 to +2.1; White is much better anyway). a4 red: "This is not the correct idea. You are missing a hidden tactical opportunity. Take a deeper look to see if you can spot the right idea." Bf2 (the ENGINE'S first move, +2.08) red: "An interesting plan to go for Bg3 next to put pressure on the Black queen. But there may be a more effective way..." Nxe6 red: "Now the pawn will recapture to e6 and on Be3-f4 Black will have e6-e5 saving the all important queen." (this line is exactly the engine's PV f7e6, Bf4, e5). The author's answer was not found in three tries (Bd3, Nh5, Bg3-type moves untested).
- Finding [V]: the most position-specific red texts in the library: the text follows the engine line for the refuted move (Nxe6 fxe6 Bf4 e5) and hedges honestly on a move that is engine-top but not the author's ("there may be a more effective way"). Defect to note: an engine-top move is red in a position where every move is +1.3 or better, so the "misplaced queen" tactic can only be judged by the author's key, with the margin between key and engine-top under 0.3 (unproven at d18).

### Champion Tactics with GM Wolff - Smother Tactics (#359, 16 lessons; the longest lessons of the set: 5 and 7 challenges) [V]
- L1 C1 (`rr4k1/6pp/2Q5/3KN3/8/q7/8/8 w - -`, Challenge 1/5, White's king is exposed on d5 and every wrong move loses). d20 White: Qe6+ MATE in 5 (Kh8 Nf7+ Kg8 Nd8+...), Ke4 -16.1, Qc7 -16.8, Nc4 -17.0, Kd4/Qc2/Qd7 mate against White in 11 to 13. Qc7 red: "This is not the right idea. You must focus your energy on an attack against the enemy king." Qe6+ green: "Now Black has only two legal moves." (a comment on the smothering structure, not a general rule).
- L16 (last) C1 (`2r2rk1/pp1bqpp1/1n2p2p/3pN2n/3P4/2NBP3/PPQ2PPP/2R2RK1 w - -`, Challenge 1/7). d18 White: Bh7+ +5.78, f4 +0.95, g4 +0.94, Qe2 +0.76, Qd2 +0.62, a3 +0.46. a3 red: "You have missed the key idea here. You must take advantage of the misplaced pieces of the opponent. Only one method will work." (the unique-move claim is true: next best +0.95 against +5.78). Bh7+ green: "Driving the king to the corner where it is exposed to possible forking checks by White's knight."
- Finding [V]: the red names the theme of the PREVIOUS course ("misplaced pieces") and the green names the next idea (knight forks), so by L16 the course is a mixed-motif exam, not a smother drill; the first lesson is the only unmistakable smothered-mate position. L1 is a mate in 5, i.e. not a beginner drill: the ladder here starts hard, again.

## Wolff tactic themes versus Scholarmate (grep and count of `content/items`, `content/lessons`, `content/skills`, 9 Nov 2026; counts are distinct item ids by skill, any review state, not only shipped items) [V counts, I reading]
| Wolff course (lessons) | Scholarmate skill | Lessons | Items (needs-human / machine-only) |
|---|---|---|---|
| Deflecting the Defender (42) | TAC.DEFLECT (+TAC.DECOY 62, TAC.OVERLOAD 47, TAC.REMOVE-DEFENDER 65) | L-TAC-DEFLECT-1, -2 | 69 (20 / 49) |
| Discovered Check & Double Check (33) | TAC.DISCOVER 71 and TAC.DOUBLE-CHECK 69 | L-TAC-DISCOVER-1, -3; L-TAC-DOUBLE-CHECK-1, -2 | 140 (48 / 92) |
| Double Attacks (29) | TAC.FORK (no separate double-attack skill) | L-TAC-FORK-1, -2, -3 | 109 (54 / 55) |
| In Between Moves (13) | TAC.ZWISCHENZUG | L-TAC-ZWISCHENZUG-1, -2, -3 | 66 (21 / 45) |
| Interference (21) | TAC.INTERFERE | L-TAC-INTERFERE-1, -2, -3 | 73 (29 / 44) |
| Misplaced Pieces (15) | TAC.TRAPPED (trapped piece; the nearest) | L-TAC-TRAPPED-1, -2 | 64 (15 / 49) |
| Smother Tactics (16) | no skill: smothered mate is one named pattern inside TAC.MATE-PATTERNS | L-TAC-MATEPATTERNS-1, -2 (smothered mentioned in both) | 184 for all mate patterns together (39 / 145), unknown share smothered |
Reading [I]: the earlier claim that Scholarmate has no per-tactic puzzle ladder was too strong on VOLUME: our 47 to 109 items per tactic are of the same order as Wolff's (In Between Moves has 13 lessons, roughly 30 positions; we have 66 items). The real gaps are (1) a graded order: every Wolff course runs easy to hard, with L1 already a real tactic and the last lessons mating combinations or 4 to 7 challenge sets, while ours are skill-and-difficulty-suffix items (D1, D2) that the app serves by need, not as a visible numbered ladder per tactic; (2) a one-tactic course page with a lesson count and a finished-bar the learner can see; (3) smothered mate and misplaced pieces (trapped piece) as named drills, not buried in mate patterns / trapped; (4) 'Double attack' as a named motif separate from the fork. All of our items are still G0 (no G3 review), about 64 percent are machine-only (334 of 521 across the DEFLECT, DISCOVER, DOUBLE-CHECK, FORK, ZWISCHENZUG, INTERFERE and TRAPPED skills). Counting method: JSON `content/items/*.json`, key `skill`, trailing `.D<n>` removed, deduped by `id`.

## Kane Studies, remaining four (Jeremy Kane; lesson URLs are topic slugs; the lesson title names the theme) [V]

### Genrikh Kasparyan's Studies (#103, 6 lessons; L1 "Kasparyan's Active Rooks", 1 challenge) [V]
- L1 C1 (`5rk1/3R4/RP3r2/8/5p2/8/6K1/8 w - -`). d24 White: Raa7 +2.92 (the only winning move), Kf3/Kf2/Rc7/Kf1/Kg1/Rd3/Rda7 all 0.00 (draws). Kf3 red: "Black will round up the b-pawn with an OK game. Try to find a stronger move." (a draw is called "an OK game" for Black: loose but not false). Raa7 green: "Good start! Where should you place your king?" (the lesson continues).
- Finding [V]: the prompt does not state "White to win" (as in Rinck, Kubbel); the red says "stronger move", which is the only hint that the result is a win. 7 of 8 top moves are exact draws, so a win-or-draw label per move would be machine-checkable.

### Pal Benko's Studies (#123, 7 lessons; L1 "Kings And Pawns", 2 challenges) [V]
- L1 C1 (`8/8/7K/6p1/1Pp5/k1P5/8/8 w - -`). d26 White: Kh5 +6.42 (wins), Kxg5 0.00 (draw), b5 0.00, Kg6 -16.5, Kg7 -16.9. Kxg5 (the natural capture) red: "After b5 and Kxc3, we will reach a position with a White queen against a black pawn on c2. White is unable to win that endgame as Black can place a king on a1, meaning that Qxc2 will always be stalemate. Try to find a way to avoid this trap." (a 55-word exact explanation of the drawing fortress; the engine confirms 0.00 at d26). Kh5 green: "Great start! What should you play next?"
- Finding [V]: the best red text in the study family: it states the refutation line, the resulting material (queen v c-pawn), the drawing mechanism (stalemate with the king on a1), and a goal for the retry. It is correct per engine (0.00). Scholarmate's stalemate-trap items (Q v pawn on the 7th) could use the same wording; our tablebase check can machine-verify the claim.

### Alexey Troitsky's Studies (#139, 7 lessons; L1 "A Sneaky Checkmate", 1 challenge) [V]
- L1 C1 (`5k2/4p2p/6P1/3K4/8/4B3/8/8 w - -`). d26 White: Bh6+ +7.55, gxh7/Ke6/Bg5/Bc5/Bd2/Bf4/Bc1 all 0.00. gxh7 red: "Black will soon capture the h7 pawn and draw the game. Try to find a stronger move." Bh6+ green: "Good start! How can you maintain chances to win the game?"
- Finding [V]: same pattern as Kasparyan: only one winning move, seven draws; the title says "A Sneaky Checkmate" but the first move (Bh6+) and the lesson aim (win) are never stated before the move. A title that names the result (checkmate) is a free hint.

### Richard Reti's Studies (#142, 5 lessons; L1 "The Reti Position", 2 challenges) [V]
- L1 C1 (`7K/8/k1P5/7p/8/8/8/8 w - -`, the famous Reti draw). d30 White: Kg7 0.00 (the only move that does not lose), c7 mate -16 for White, Kh7 and Kg8 mate -15 for White. c7 red: "Black will capture your pawn and promote the h-pawn. Try to find a stronger move." (true). Kg7 green: "Great start! Keep it up." (filler).
- Finding [V]: the Reti study is a DRAW study (a defensive goal), the only one of the seven Kane courses sampled whose answer is a save; the wrong move text says "stronger move" even though the goal is to draw, so the prompt wording is shared across win and draw studies.

## Combinations of Mikhail Tal Part 3 (#270, 10 lessons; slug `the-amazing-combinations-of-mikhail-tal-2`; lessons "Heavy Metal", "Weak By Presumption", "Cashing In", "Pawn Tsunami") [V]
- L1 "Heavy Metal" C1 (`r2n3k/5pp1/5r1p/ppNqp2Q/1P6/P2P2R1/5PPP/5RK1 b - -`, flipped, Challenge 1/5, move 29). d20 Black: axb4 +1.93, Nc6 +0.47, Rf4 +0.33, Ra7 +0.05, Ne6 +0.01. Ne6 red: "29...Ne6 30.Ne4 is solid for White." (a one-line refutation in game notation). axb4 green: "The file is opened for a VIP (a very important piece that is!)" (a pun with a theme: the a-file opens for the rook).
- Finding [V]: red uses full algebraic game notation with a ply number, as annotated-game text; the right-move text has personality (a pun). Lesson titles are theme names ("Heavy Metal" = heavy pieces, "Pawn Tsunami"), the Part 2 topic-title format. 5 challenges per lesson against 2 in Part 2 L1: a lesson is one game's combination broken into 5 steps.
