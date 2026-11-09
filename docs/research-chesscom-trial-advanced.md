# chess.com Learn trial notes: advanced (2018 Chess.com Team courses, level badge A)

Played with Andrew's trial in the built-in browser, 8 Nov 2026. Evidence: [V] seen on the learner interface, [V engine] checked with Stockfish 19 lite depth 18 (`tools/engine.py`), [I] inference. Positions and moves are facts; text is paraphrased.

## Endgame Patterns (7 lessons, 35 challenges, 41 min on the course page)
Lessons: 1 distant-opposition, 2 triangulation, 3 lucena-position, 4 philidor-position, 5 pieces-and-pawns, 6 queen-vs-pawn, 7 two-bishop-checkmate.

### Lesson 3 "Lucena Position" (5 challenges; start card has an Explainer Video) [V]
Frame: start card describes the Lucena position (king, rook and pawn against king and rook, pawn one step from queening) and tells the learner to watch the video. The five challenges walk ONE technique from several angles, and the opponent plays the defender's tries automatically.

| # | Start FEN (side) | Prompt | What was accepted | Wrong tests |
|---|---|---|---|---|
| 1 | 3K4/3P4/4k3/8/8/8/2r5/3R4 w | How can White use Black's king being on the e-file? | Ke8 AND Re1+ both green (two accepted answers, engine: Ke8 +5.84, Re1+ +4.76) | none needed |
| 2 | 3K4/3P1k2/8/8/8/8/2r5/3R4 w | Force the king off the f-file; then a multi-move sequence (about 9 learner moves across Next steps) | Rf1+, Rf4 (the fourth-rank bridge), then king walks e7, d6/e6, d5 while Black checks, finally the rook blocks on d4 | Rd6 red "we are trying to force the king off the f-file"; Ke7 red (rook checks follow, text says the rook must reach the d-file); Re4 (with the king on e7) red "move the king toward the fifth rank"; Rd4 (king on d6) red; Re4 (king on e6) red |
| 3 | same start as 2 | "First idea: force the king off the f-file" | Rf1+, then Rf8 (after Kg6), then Rf4 | Rf4 immediately: ORANGE "an alternative", Rf8 is also winning; a green undo button |
| 4 | 8/3P2k1/3K4/8/5R2/8/3r4/8 (after Black declines to check) | Return to the position after the king step; bring the rook to the king | Ke6, Rf5, Rd5, Kd6 | Rd4 red: "a stronger idea, block the d-file from the fifth rank" |
| 5 | 3R4/3K1k2/3P4/8/8/8/3r4/8 w | Mirror setup; prompt says "first play Ra8" | Ra8, Kc7, Kd8, d7 | Kc6 red (get the king to d8 without losing the pawn); Ra7+ red "White has a stronger move" |

Engine checks [V engine]:
- c2, Rd6 (their red): engine +4.83 against +4.82 for Rf1+; both win. The red is therefore about the lesson's plan, not about soundness; the text says so ("we are trying to force...").
- c2, Ke7 (red): engine +5.06, a win. Same reading.
- c2, Re4 with Black rook on e3 and White king on e6: engine 0.00 (a draw: ...Rxe4 and the pawn is lost). Their red is TRUE here.
- c4, Rd4 (red): with Black rook d2, Rd4 fails to Rxd4, d8=Q, Rxd8. Their red is TRUE; Rf5 and Re4 both score +12.75.
- c5, Ra7+ (red "stronger move"): engine +4.73, equal to d7 +4.73. The red is a plan-shaped wrong answer; the engine does not support "stronger". [I] the lesson teaches a single shape and its feedback text names strength where it means "not our plan".

Observations [V]:
- One idea, five angles: classic line, the same start but a different Black defence (orange alternative), a Black defence that does not check, a mirrored board. Each challenge ends when the plan stage is reached (a green Next arrow), so challenge boundaries are plan stages, not single moves.
- Opponent replies are scripted and depend on the learner's route, so the same start gives different continuations (the king walks e7/d6 or e6/d5 depending on checks).
- Hint bulb after a mismatch gives the idea first ("hide the king on the d-file"), no square.
- Wrong-move feedback names the missing idea ("prepare the rook block on the d-file", "king toward the fifth rank") but sometimes marks sound moves red. Two accepted first moves in c1 show that multiple answers are supported when the author lists them.
- Promotion is not needed in this lesson (the line stops before promotion); the c1 pawn push d8 was not required.
- Ending: Lesson Complete modal with one Finish button.

## Advanced Tactics (5 lessons, 24 challenges, 23 min on the course page)
Lessons: 1 exchange-sacrifices, 2 clearance-sacrifices, 3 overloading, 4 interference, 5 underpromotion.

### Lesson 1 "Exchange Sacrifices" (4 challenges; start card has an Explainer Video) [V]
Frame: start card says a rook for a minor piece is among the most common good sacrifices, and two pawns or a positional edge usually pay for it. Every challenge is a famous game position (Botvinnik, Petrosian, Karpov-Kamsky are named), so the learner is shown a human name with each idea.

| # | Position (side) | Prompt | Accepted line | Wrong tests |
|---|---|---|---|---|
| 1 | 5rk1/1p1b1rqp/p1nbp3/3p2p1/3P2P1/2QN1N2/PP2RPP1/1B2R1K1 b | Find a powerful move that creates a strong attack | Rxf3 (gxf3 auto), then Nxd4 | h5: red "much stronger move" (engine h5 +0.06 against Rxf3 +4.33, so the red is TRUE [V engine]) |
| 2 | r5k1/pp5p/3qb1n1/3P1r2/1P4Q1/3p4/1B3PPP/4RRK1 w | Botvinnik must choose how to capture the bishop; find the exchange sacrifice | Rxe6, then a king hunt of 6 learner moves: Rxg6+, Qxg6+, Qg7+, Re1+, Qe7+, Rc1+ (replies auto) | dxe6: red but the text admits "White still has good winning chances" (engine +3.02 against Rxe6 +6.56 [V engine]); Rd6 at the 2nd step: red "there is a winning move based on an exchange sacrifice" (engine +0.79 vs +8.04, true) |
| 3 | 2r1kb1r/1p1n1ppp/pq1p1n2/4pPB1/4P3/P1N5/1PPNQ1PP/2KR3R b | Petrosian wants ...d5; find a move that prepares it and creates weaknesses at White's king | Rxc3, then d5 | h5: red "much stronger move" (engine -1.56 against Rxc3 -0.17, true) |
| 4 | r1bq1r1k/2p1p1bp/pnn3p1/1p6/3P3Q/2NB1N2/PP3P1P/R1B1K2R b | Find an exchange sacrifice that holds the balance | Rxf3, Nxd4, Bf5 (Kamsky's idea), then Qxa8 after White takes the rook | e5: red "we are looking for an exchange sacrifice" although the engine ranks e5 first (+1.35, Rxf3 +1.32 [V engine]); Bb7 (blunder: Bxb7) red "find a bishop move that safely attacks the light bishop" |

Observations [V]:
- Prompt frames the TASK ("find the exchange sacrifice"), so the engine-best quiet move is red with a text that names the task, not the engine verdict (c4 e5). The dxe6 text is honest about a still-winning position.
- Multi-step challenges: one challenge can be a whole attack (c2 has six learner moves). Hint bulb at a stuck step says what piece should join ("how can our rook join the attack").
- Flipped board for Black positions; the board file labels show g..a on the bottom row in the screenshot, matching the flipped orientation.
- Success text adds game history: "Karpov decided to play 17.Be3 and the game was soon drawn" next to a line where the engine thinks Black is winning after Bxa8 Qxa8 (+6.28). [V engine] [I] the lesson teaches the idea and not a verdict about the actual game.
- Ending: Lesson Complete modal.

## Attacking the King (7 lessons, 35 challenges, 53 min on the course page)
Lessons: 1 king-in-danger, 2 attacking-the-castled-king, 3 advanced-checkmate-patterns, 4 mating-net, 5 provoking-weaknesses, 6 pawn-storms, 7 defending-the-king.

### Lesson 1 "King in Danger" (5 challenges; start card has an Explainer Video) [V]
Frame: start card says that when attacking you must examine all forcing moves and the moves that stop the king escaping. Challenges mix attack and defence, and the last one is a defensive move by Karpov.

| # | Position (side) | Prompt | Accepted | Wrong tests |
|---|---|---|---|---|
| 1 | 4r2k/1p1q3p/2b2pp1/8/2P4P/2QBb1B1/P5P1/5R1K b | Force a surprising checkmate | Qh3+, Bh2 (auto), then Qxg2# green; Bxg2# ORANGE "great, can you find the other mate?" (both mate) | Bd4: red "there is a forced win" (engine +8.43, a win but not the mate; true as framed); Qxh2+ (no mate, Kxh2): red "not a forced win" |
| 2 | r1b1kb1r/p1qn1pp1/2N1pn1p/2p5/1P6/3B4/P1P1QPPP/R1B1K1NR w | Sacrifice to force mate in two | Qxe6+ (fxe6 auto), Bg6# | b5: red "there is a forced mate in two, find a more forcing move" |
| 3 | 3r4/kb5p/4R3/1p6/8/6B1/3q2PP/2R4K w | Things look hopeless; save the game by attacking the king | Ra1+, Raxa6+ (not Rexa6+), Rb6+, Ra8+, Rxd8+ (Rd6+ is ORANGE "also winning, find the other rook check"), Rd6+ | Rexa6+: red "no longer losing, but a stronger rook capture should win"; Rc6+: red "only repeats moves" |
| 4 | r2qkb1r/p2pppnp/n5p1/1NpNP3/6P1/4B3/P1P2P1P/3QKB1R w | The Aronian sacrifice that exposes the king | Nbd6+, then Nf6+ (Black can only play Qxf6 or Ke7, Qxd6#) | Qd2: red "not the grandmaster's winning idea" |
| 5 | r3k2r/1p1n1qp1/p6p/4p2P/4K1P1/2PpQPbR/PP6/R1B2B2 w | Karpov must bring his king to safety | Kxd3, Qg1 (the instruction says so), Kc2 | b3: red "the king must be brought to safety"; Qe1: red "we are asked to play Karpov's move, Qg1" |

Engine checks [V engine]:
- c1: Qh3+ is mate in 2 for either mating move; Qxh2+ fails to Kxh2.
- c3: Ra1+ is winning for White (+6.68), so the prompt "save the game" understates it (the success text later says White has a winning endgame). After the red Rexa6+ the engine gives Black +1.36, so "no longer losing" is a fair description of a worse-for-White position but "White is no longer losing" is loose; White is still the one worse. [I] Not a defect that matters.
- c3 Rc6+ is engine-winning (+5.83) if Black answers Kd7, but Black plays Kb7 and the position repeats, matching their text.
- c4: after Nf6+ Black has exactly two legal moves, Qxf6 (-6.64) and Ke7 allowing Qxd6#. Their "allow checkmate or sacrifice the queen" is TRUE.
- c5: Kxd3 is the only non-losing first move (+1.31); b3 and Qxd3 score -4.9 and -5.8. Qe1 (+1.13) is engine-best after Kxd3, but Qe2, Qf2 and Qg1 score +0.63, +0.46, +0.43, so "several good queen moves" is TRUE. Their red on Qe1 names the instruction openly ("asked to play Karpov's move").

Observations [V]:
- A famous-game ending line is taught with the historical result ("Karpov actually ended up winning"), and move names (Aronian, Karpov) are used as motivation. The lesson says openly when it asks for a specific move.
- Orange "alternative" appears twice (c1, c3) with a prompt to find the other equally good move: this turns an alternative into a second learning target rather than a dead end.
- The prompt for c3 ("save the game") differs from the engine reality (winning) and the feedback line corrects it only at the end.
- Ending: Lesson Complete modal.

## Choosing the Best Move (8 lessons, 40 challenges, 65 min on the course page)
Lessons: 1 how-to-choose-a-move, 2 making-a-plan, 3 positional-play, 4 good-bad-pieces, 5 playing-a-bad-position, 6 when-youre-losing, 7 winning-the-won-game, 8 overcoming-your-emotions.

### Lesson 1 "How to Choose a Move" (5 challenges; start card has an Explainer Video) [V]
Frame: start card says to look at forcing options for BOTH sides when choosing a move. The five challenges are choose-the-move positions with no tactic labelled in the prompt; the feedback carries the principle ("play the moves you have to play before the moves you want to play"; "when you find a good move, look for a better one").

| # | Position (side) | Prompt | Accepted | Wrong tests |
|---|---|---|---|---|
| 1 | 4r1k1/3q1p1p/p3B1pQ/1p3b2/8/1P6/PB3PPP/2R3K1 b | Several ways to recapture on e6; choose the best | fxe6 | Rxe6: red "don't forget your opponent's moves" (Qg7# follows) |
| 2 | rnbqr1k1/1p3ppp/5n2/p1bNp3/8/PP1P2P1/2Q1PPBP/R1B1K1NR b | Find the move that wins a pawn | Bxf2+ (Kxf2 auto), Nxd5 (the success text names a desperado bishop) | none tested (Bd4, engine-best +2.37, was not played, Bxf2+ +1.76 was accepted) |
| 3 | 6k1/5p1p/p5q1/n4p2/p1p5/2P2N1P/P4PP1/3Q2K1 w | White is ready to take a4; is that best? | Qd8+ then Qxa5 (wins a knight) | Qxa4: red "a good move, look for a better one" (engine Qxa4 +3.04 against Qd8+ +5.75, true) |
| 4 | 2q2rk1/2pnbpp1/1p2pB1p/6N1/2P5/6P1/1PQ1PPBP/5RK1 b | White is up a piece; two white pieces can be captured; choose the best | Nxf6 (the only move that is not losing) | hxg5: red "prevented mate but White wins another piece" (engine -6.25, true) |
| 5 | 5bk1/2p2bp1/2p1p2p/5p2/2PP4/4PNP1/2N2PP1/6K1 b | Black has two passive bishops and a bad pawn structure; improve by offering an exchange | c5 (engine-best -0.08; Bh5 is -0.96) | c5 was accepted at once; no wrong test needed. The retry button after a correct answer re-plays nothing. |

Engine checks [V engine]: c1: fxe6 is the only move that does not lose to mate (other recaptures lose to Qg7# or Qxg7#). c4: Nxf6 -0.09 against every other move -6 or worse, so "only move" is TRUE. All red verdicts in c3 and c4 confirmed.

Observations [V]:
- The principle lines are generic and reusable ("moves you have to play first") and appear in the success or red text, not on a separate card.
- c2 accepts a sound alternative (Bxf2+) that is not the engine's first choice, and the text says desperado. c5's prompt gives the plan ("offering an exchange"); c5 alone is a quiet-move challenge in an otherwise tactical lesson, which fits the title.
- The lesson mixes recapture, tactic, defence and a strategic pawn move: a "which move?" format without a tactic label. No wrong answer got a refutation played on the board except by position change (Rxe6 shows Qg7).
- Ending: Lesson Complete modal.

## Activating Your Pieces (10 lessons, 53 challenges, 66 min on the course page)
Lessons: 1 breakthrough, 2 pawns-in-the-middlegame, 3 blockading-pawns, 4 isolated-and-hanging-pawns, 5 outposts, 6 using-the-bishop-pair, 7 bishops-vs-knights, 8 batteries, 9 pigs-on-the-7th-rank, 10 windmill. (The first lesson's title is "Breakthrough"; the 6 challenges are all pawn-sacrifice breakthroughs.)

### Lesson 1 "Breakthrough" (6 challenges; start card has an Explainer Video) [V]
Frame: start card says that promoting a pawn is often the way to win, so a sacrifice of a piece or two for a queen is usually worth it. All six challenges are pawn-structure breakthroughs, three of them the SAME start position (8/8/2k1K3/p1p5/1p1p4/1P1P4/1PP5/8 b) replayed with White declining or capturing differently each time.

| # | Start FEN (side) | Prompt | Accepted | Wrong tests |
|---|---|---|---|---|
| 1 | 8/8/2pp4/8/1P1P4/6k1/8/6K1 w | White appears in trouble: time for a breakthrough | d5, bxc5 (after ...c5 auto), d6 | b5: red "right idea, wrong pawn: this creates a passed pawn for Black" (engine b5 -91.65, d5 +6.20, true) |
| 2 | 8/2k2b2/8/8/1p6/p4P2/P4K2/2N5 b | The knight defends the pawn and guards against advances; breakthrough time | Bxa2, b3, then a2 (not b2), then bxa2 | Kd6: red "does not create passed pawns" although the engine rates Kd6 equal to Bxa2 (+6.90 both); b2: red "White is saved by a fork" (engine b2 not in top 4, a2 +8.61 [V engine]) |
| 3 | 8/1kp5/8/1P1P2p1/K6p/6PP/5P2/8 b | White up two pawns; bring the point home with a breakthrough | g4 (hxg4 auto), then h3 | Kc8: red "not a pawn breakthrough" (engine -7.16 true); hxg3: red "we want a queen, not a trade" (engine -9.52 after fxg3, true) |
| 4 | 8/8/2k1K3/p1p5/1p1p4/1P1P4/1PP5/8 b | A pawn sacrifice forces a breakthrough | c4 (bxc4 auto), then a4 | Kc7: red "no breakthrough" (engine 0.00, drawn, true); b3: red "does not force a passed pawn" (engine -6.81, true) |
| 5 | same as 4 | "Same winning move again" | c4 (this time dxc4 auto), a4, b3, d3 | d3 (first move after c4): red "White is winning, find a better pawn sacrifice" (engine -7.28, true) |
| 6 | same as 4 | "Start again with a pawn sacrifice" | c4 (White declines with Ke5), a4, c3, a3 | bxc3 (one step before the end): red "creates a passed pawn for White, not Black" |

Engine checks [V engine]: the red verdicts in c1, c3, c4, c5 all match the engine, including the non-obvious losses (hxg3, d3). The one place where the red text and the engine disagree is c2 Kd6: the engine rates it equal to Bxa2, so the red means "not the lesson's plan". c5 text "White has four pawns against one, but Black is winning" is TRUE (engine +6.90 for Black).

Observations [V]:
- One idea is drilled by three replays of the same position, with the opponent's defence changing (capture with the b-pawn, capture with the d-pawn, decline). This is the only lesson seen so far that varies the opponent's reply to teach "what if he does not take".
- Hints at a mismatch name the idea in the challenge ("force open the b3 square") before the move.
- Pawn-only positions are used throughout, so no piece graphics matter; flipped boards for Black.
- Ending: Lesson Complete modal.

## Advanced Endgames (5 lessons, 25 challenges, 38 min on the course page)
Lessons: 1 endgame-principles, 2 common-rook-endgames, 3 king-opposition, 4 zugzwang-waiting-moves, 5 opposite-colored-bishops-endgames.

### Lesson 1 "Endgame Principles" (5 challenges; start card has an Explainer Video) [V]
Frame: start card says endgame technique means staying calm to avoid counterplay and that nothing is gained by winning quickly. Four of five prompts say "ONLY winning move", and the engine agrees each time. Every wrong answer I tried is a draw or worse.

| # | Position (side) | Prompt | Accepted | Wrong tests |
|---|---|---|---|---|
| 1 | 8/2P5/8/5b2/p7/Pk6/8/2K5 b | Close to winning; find the ONLY winning move | Kxa2, Kxa3, Ka2 (three single steps, White replies auto) | Bh3: red "this does not win" (engine Bh3 +1.31 vs Kxa2 +8.27); Bc8 later: red "does not win" |
| 2 | 6k1/7p/p1p4K/Pp1p2P1/1P1P4/2P5/8/8 w | White's only winning move | g6 (hxg6), Kxg6, Kf6 (opposition), Ke6 | Kh5: red "Black's king becomes active, no longer winning" (engine 0.00 vs g6 +6.82); Kg7 at move 3: red "does not maintain opposition" (engine 0.00 vs Ke6 +7.28) |
| 3 | 8/5P2/2N5/8/4k3/3r4/8/5K2 w | Find the surprising move that disrupts Black's coordination | Nd4! (Rxd4 auto), then f8=Q (queen vs rook, "winning technical endgame") | f8=Q at once: red "the game is drawn" (engine 0.00 vs Nd4 +2.52, true) |
| 4 | R7/8/1k6/5K2/3P4/8/pr6/8 b | Rook stops the pawn; find a plan that destroys White's defence | Rb5+ (Ke4 auto), then Ra5 | Kb7: red "White's rook stays behind the pawn, drawn" (engine 0.00 vs Rb5+ +6.57, true); Rb2 at step 2: red "does not put the rook between the passed pawn and White's rook" (engine Rb2 0.00 vs Ra5 +6.29, true) |
| 5 | R7/4k3/P7/8/8/8/3K4/r7 w | White's only winning move | a7, then Rh8 (skewer threat Rh7+) | Kc3: red "Black's king reaches the passed pawn and draws" (engine 0.00 vs a7 +6.12, true) |

Engine checks [V engine]: every "only winning move" claim and every "this draws" red verdict above is confirmed (about 10 positions, depth 22 to 24 single thread, all red moves score 0.00 or below, all accepted moves +2.5 to +8). No chess.com claim was found to be wrong in this lesson.

Observations [V]:
- Format: a minimum-length multi-step challenge ends at a plan stage and the next step is shown with the hint bulb (the hint for a multi-step challenge says what the NEXT stage is, for example "gain opposition and keep the king on the back rank").
- c3 gives the learner a promotion picker: the picker appears beside the target square with queen at the top, and a wrong first choice (promote now) is red with "the game is drawn" while the correct plan (a knight move) is a quiet decoy. This is the clearest "do not promote yet" teaching in the lessons seen.
- Feedback text always says the verdict in endgame terms (draw/win), never in numbers.
- Ending: Lesson Complete modal.

## Key Openings (8 lessons, 43 challenges, 50 min on the course page)
Lessons: 1 offbeat-openings, 2 popular-1-e4-openings, 3 popular-1-e4-openings-the-sicilian-defense, 4 popular-1-e4-openings-french-and-caro-kann-1, 5 popular-1-d4-openings, 6 popular-1-d4-openings-1-nf6-dutch-defense, 7 gambits, 8 opening-traps.

### Lesson 2 "Popular e4 Openings" (5 challenges; start card has an Explainer Video; I started here, not at lesson 1) [V]
Frame: start card shows 1.e4 e5 2.Nf3 Nc6 and says 3.Bc4 is the Italian, 3.Bb5 the Ruy Lopez. Each challenge is a short branching line from the same start: Italian (c1-c2), Ruy Lopez Exchange (c3), and the Closed Ruy (c4-c5). The side to play alternates, so the learner plays Black in c2 and c3.

| # | Position (side) | Prompt | Accepted | Wrong tests |
|---|---|---|---|---|
| 1 | r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w | Explore the Italian by moving the bishop to c4 | Bc4; then at the second step a knight move that "defends e4 and adds a second attacker to f7" (the move I played, Ng5, was accepted; the accepted answer set was not mapped) | Bb5: red "does not move the bishop to c4" (a sound move marked wrong because the task names the square) |
| 2 | (Black) after 4.Ng5 style line | Secure the king; respond to White's early aggression | O-O, Rxf7, Kxf7 (White has sacrificed on f7; Black ends a rook and pawn down for two minor pieces) | none tested |
| 3 | r1bqkbnr/1ppp1ppp/p1B5/4p3/4P3/5N2/PPPP1PPP/RNBQK2R b | Recapture on c6 (White cannot win a pawn by capturing the knight) | dxc6 (Black can regain the pawn with Qd4 after Nxe5) | bxc6: red "Black can still regain the pawn after Qe7 but the structure has weaknesses"; Qg5 (instead of Qd4): red "creative idea that wins g2 but allows Rg1; we want the stronger move that wins e4" |
| 4 | r1bqkbnr/1ppp1ppp/p1n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w | Move the bishop to safety keeping pressure on c6 | Ba4, O-O (hint explains Re1 follows if Black takes e4), Re1 | none tested |
| 5 | r1bqk2r/1ppp1ppp/p1n2n2/2b1p3/B3P3/5N2/PPPP1PPP/RNBQ1RK1 w | Strong pawn move that prepares d4 | c3, Bb3, d4 | d4 immediately: red "not a pawn move that prepares d4" (a prompt-literal reading) |

Engine checks [V engine]:
- c2: after Nxf7 Rxf7 Bxf7+ Kxf7 the engine gives White -3.75 (White to move, so Black is better), which supports their "White lost all development with a worse position".
- c3: bxc6 -0.11 and dxc6 -0.16 (Black's view), essentially equal. Their red on bxc6 is a plan-based preference for the d-pawn recapture, openly admitted in the text ("Black can still regain the pawn... but weaknesses"). Qg5: engine -5.23, so the red is TRUE.
- c1 caveat: after I retried following a Next press, the app showed Black's c2 position with 4.Ng5 d3 and ...Bc5 already played; I did not map how Retry/Next interacted there, so the c1 ordering is [V partly].

Observations [V]:
- Opening lessons in this course reuse the same move-by-move "explain and name the opening" structure as Intro to Book Openings, but with prompts that name the idea ("add a second attacker to f7") in place of the move. Success texts introduce opening names (Italian Game, Ruy Lopez Exchange) and typical traps.
- The opponent's reply is NOT always the book reply: after the c2 sacrifice Black must find the defence, which teaches the refutation of a premature attack.
- A sound move is red when it fails the prompt's literal condition (Bb5, d4, Qg5); text tells the learner the idea and sometimes names the engine-like verdict ("wins the g2 pawn but...").
- Not played: lessons 1, 3 to 8 of the course.
- Ending: Lesson Complete modal.

## Candidate Moves (Chess Mentor style, badge IAM, IM Kostya Kavutskiy; 5 lessons, 25 challenges, 59 min on the course page)
Lessons: 1 candidate-moves-checks, 2 candidate-moves-the-opponents-ideas (listed title "Forcing Moves"), 3 candidate-moves-the-opponents-ideas-1, 4 candidate-moves-imbalances, 5 candidate-moves-improve-your-worst-piece.

### Lesson 1 "Candidate Moves: Checks" (5 challenges; start card has an Explainer Video; played c1 and the first step of c2) [V partly]
Frame: start card says Kavutskiy starts a series on choosing candidate moves with checks, "the most forcing move in chess".

| # | Position (side) | Prompt | Accepted | Wrong tests |
|---|---|---|---|---|
| 1 | r1r4k/p3p2P/3ppn1Q/q5N1/1p2P3/1P1n1P2/P1P3P1/1K3B1R b | How can Black escape White's scary-looking attack? (answer: a perpetual) | Qxa2+, Kxa2 (auto), Rxc2+, Ka1 (auto), Rc1+ (hint: "check and force the white king back to a2") | Qxg5: red "White has a winning material advantage; look for a more forcing queen move" (engine -5.77, true; the only drawing move is Qxa2+ 0.00 [V engine]) |
| 2 | 2r3k1/3nqpp1/p7/1p1P2P1/8/P7/KPp4Q/7R b | It looks like White is about to mate; how can Black survive? | c1=N+ (the underpromotion; engine 0.00, the only move that holds) | c1=Q: red "that's checkmate" (Qh8# follows, true) |

Engine checks [V engine]: c1: Qxa2+ is the only move that holds (0.00; everything else is -5 or worse or mated). c2: c1=N+ 0.00 and f5 -5.33, f6 mated in 3; so both red verdicts are TRUE.

Observations [V]:
- The lesson answers a defensive question (find the perpetual and the underpromotion) with a forcing-moves frame: the point is that checks are the first candidate to look at even when you are losing.
- The promotion picker for a Black pawn on the first rank opens as a vertical stack under the target square, queen first and knight second; no promotion piece is pre-selected.
- The wrong-promotion feedback is the clearest I have seen: it says only "that's checkmate", and the learner discovers on the board that the queen promotion walks into Qh8#.
- Not played: c3 to c5 of lesson 1 and lessons 2 to 5.

Addendum to Candidate Moves lesson 1: c2 continues c1=N+ (Ka1), Nb3+ (Ka2), Nc1+; the success text says the game (named as Yi-Giri, 2020) was soon drawn, so the learner finishes the perpetual by repeating checks. c3 shows a Carlsen position (8/p4pk1/6p1/4Q1qp/2pn1rP1/4R2P/PR1K4/8 b, "How did Magnus Carlsen win material?"); not played. [V]

