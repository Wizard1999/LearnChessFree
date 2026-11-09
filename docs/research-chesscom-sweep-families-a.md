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
