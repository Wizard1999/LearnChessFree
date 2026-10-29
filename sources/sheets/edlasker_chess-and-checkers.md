# Synthesis sheet: Edward Lasker, *Chess and Checkers: The Way to Mastership* (1918)

Sheet date: 2026-10-29. Labels: **[R]** recalled from the text I read; **[I]** my inference. "Checked" means I ran the bundled Stockfish (npm 19, lite, single thread, `tools/engine.py`) or python-chess here; engine scores are evidence under those settings, not proof. Original wording only; only positions and moves are listed. Diagram numbers are the e-text's.

## 1. Scope and edition

- Gutenberg ebook 4913 (`library/files/pg4913.txt`). The e-text calls itself a copy of the 1918 New York printing, with ASCII diagrams (white `^`, black `#`) [R]. The author is the chess master Edward Lasker, with the checker champion Alfred Jordan credited for Part II [R]. Rights: the e-text says US copyright is not claimed; author d. 1981, so outside the US treat as in copyright and use facts only [I, unverified].
- Two parts: chess (about 3,800 non-blank lines once diagrams are stripped) and checkers. The preface says two readers with no prior chess learned from the manuscript and flagged unclear spots [R]. This is the only claim of beginner testing; no data is given [I].
- Diagram flaws seen: Diagram 1 prints a black king where the g8 knight should be, and "page" cross-references cannot be resolved [R]. Any position must be rebuilt as a FEN and engine-checked before use [I].

## 2. What the book teaches, in order (chess part)

1. Preface and history (skipped as content; the preface sells chess as military training, a claim with no support offered) [R].
2. Rules: board and men, then moves in the order rook, bishop, queen, king, knight, pawn (with en passant and promotion), then castling, then attack and defense, check, mate, stalemate, perpetual check, then a glossary (exchange, doubled/passed/isolated/backward pawn, fork, sacrifice, discovered and double check), then notation (algebraic used; descriptive explained in a footnote), then touch-move and draw rules [R]. Notation comes before any move is described [R].
3. "Elementary tactics" starts from endings, on purpose: find the minimum force to mate (Q or R mates; B or N alone cannot; two bishops can; B+N can in a corner of the bishop's colour; two knights cannot), then derive piece values from mobility, then K+P v K with the opposition, then "win a pawn, trade pieces, win the pawn ending", then why a pawn matters [R].
4. How men cooperate: the two kinds of attack (one man hits two targets; more attackers than defenders), knight forks, discovered attacks, queen double attacks, the h7 attack with queen plus bishop or knight, rook on the seventh, pins, then sacrifices (temporary by design; a mating sacrifice needs a foreseeable forced mate) [R].
5. General strategy: develop with no lost moves, keep a central pawn, mobility as the measure of a piece; then King's Pawn and Queen's Pawn openings as applications; then a short middle-game section (weak squares after pawn moves, rooks need files, castle early, queen stays near the action, backward pawns) [R].
6. Two annotated Lasker games (one win in a Ruy Lopez, one loss to Capablanca), five composed problems and two studies, with a note that problems differ from game positions [R].

## 3. Ideas, with conditions and exceptions

- **Min-force mate** [R]: mating needs to attack the king and control an adjacent square at once; a lone B or N cannot, so the learner learns what a piece can and cannot do by what it can mate. Exception he gives: with a blocking enemy pawn, N or B can mate in a corner. Checked: Diagram 10 White to move mates in 5 (engine mate score 5), Black to move is 0.00; consistent.
- **Value from mobility** [R]: value is what a piece can do, not a fixed number; queen about two rooks or three minors, minor about three pawns, rook about a minor plus one to two pawns; do not give a minor for three pawns while queens and minors remain. This is the author's view; I did not test the numeric rule.
- **Pawn endings** [R]: with pawn e4, kings f5 and e7, White to move, the king move to e5 wins and the pawn push draws. Checked (Diagram 15): Ke5 +6.2, e5 0.00 at depth 22. The sixth-rank opposition summary and the "win a pawn then trade down" method are standard.
- **Do not sacrifice a piece to save a pawn** [R]: author's view, backed by two long sample lines; unchecked.
- **Counting** [R]: attack a square with more men than defend it; pinned men do not count as defenders. Condition: count in value order (his Diagram 32 examples).
- **Pin plus extra attackers** [R]: the bishop's main early job is to pin a knight; a pin is only worth a piece if more men can be brought than defend.
- **Queen out early** [R]: not because of a rule but because minor pieces chase it; so if the opponent has not developed, it is less of a problem. A genuine causal explanation, rare in 1918 books [I].
- **Two opening principles** [R]: (a) develop with no lost moves (no pawn moves not needed, no piece twice, keep castling rights); (b) keep a central pawn. Exceptions he states: a move that stops the opponent's development, or a pawn sacrifice (gambit) paid back in tempi.
- **Pawn skeleton view of the centre** [R]: a white pawn on e4 controls d5 and f5, so Black pieces cannot sit there; advancing it gives that up.
- **Weak squares after pawn moves** [R]: a square is weak if no pawn can guard it again and an enemy piece can sit there; most dangerous near the king. Wing pawn moves also cost spare tempi for the opposition in the ending.
- **Piece order in a battle** [R]: minors, then queen, then rooks; rooks need an open file; he prefers opening a central file.
- **Different-side castling** [R]: only then can pawns storm without self-weakening.
- **Problems vs game** [R]: composed problems follow aesthetic laws (single solution, economy); real mates are known patterns. Useful for a learner to hear, not covered in our graph [I].

## 4. Examples (positions or games)

- Mates: K+Q v K (Diagram 9, K c3 Q h3 v K d6), K+R v K, K+2B v K (Diagram 11), K+B+N v K (Diagram 12 and 13), stalemate trap with Q mate (Diagram 7; Rf3 sacrifice leads to stalemate; python-chess confirms the line ends in stalemate).
- K+P (Diagrams 14 to 19). Diagram 14 (Qs plus pawn): Qd1+ is the right start and e5 loses the pawn; checked: Qd1+ +6.1, e5 0.00.
- Tactical set (Diagrams 20 to 42): knight fork on d5, discovered attacks, early queen traps (1.e4 e5 2.f4 Bc5 3.fxe5?? Qh4+ checked, Black about +4.6), h7 attacks, rooks on the seventh, pin and sacrifice patterns, throttled mate, cover position (Thomas v E. Lasker, London, a queen sacrifice and a king hunt).
- Opening samples: 1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 4.d3 Nf6 5.Nc3 d6 6.O-O O-O 7.Bg5 and the Nd5 plan (Diagram 43 to 48). He judges Diagram 47 lost for Black; unchecked. 1.e4 d5 2.exd5 Qxd5 3.Nc3 Qa5 4.d4 is called better for White; engine gives about +0.6 for White, so the claim holds mildly. 1.d4 d5 2.Nf3 Nf6 3.c4 dxc4 4.e3 b5 5.a4 c6 6.b3: White regains the pawn, "far ahead". Checked: after 4...b5 engine prefers 5.a4 (+0.4); but after 6...e6 the evaluation is only about +0.3, and the capture line 6...cxb3 7.axb5 cxb5 8.Bxb5+ is about +0.9 for White; "far ahead" is overstated.
- Master moments: Teichmann v Rubinstein (Karlsbad 1911), Capablanca v Bernstein (San Sebastian 1911), Lasker v Tarrasch (1908), Teichmann v Dus Chotimirski (1908). Moves and eval claims in these are the author's; unchecked.
- Games: Showalter v E. Lasker (Lexington 1917, Ruy Lopez with 3...a6), E. Lasker v Capablanca (New York 1915, QGD). Notes blame lost opening time; unchecked.
- Studies: Diagram 82 (K b6, P c6, R d5 v K a1, 1.c7 and a promotion to rook idea) and Diagram 83 (draw by a stalemate trick). Checked: 82 engine +2.9 at depth 28 with c7 first (supports a win, not proof); 83 engine 0.00 at depth 28 (supports the draw).

## 5. Mapping to skill nodes (real ids)

- FND.BOARD, FND.NOTATION, FND.PIECE.ROOK/BISHOP/QUEEN/KING/KNIGHT/PAWN, FND.CASTLE, FND.ENPASSANT, FND.PROMOTE, FND.CHECK, FND.MATE1, FND.STALEMATE, FND.DRAWS, FND.ATTACK, FND.CAPTURE, FND.VALUE.
- END.MATE-KQ, END.MATE-KR, END.MATE-2B, END.MATE-BN, END.MATE-MATERIAL, END.MATE-STALEMATE-AVOID, END.KPK, END.OPPOSITION, END.KING-ACTIVE, END.TRANSITION, END.OUTSIDE-PASSER, END.THEORY.2N, TAC.STALEMATE-TRICK, TAC.UNDERPROMOTE.
- TAC.FORK, TAC.PIN, TAC.DISCOVER, TAC.DOUBLE-CHECK, TAC.MATE-PATTERNS, TAC.PERPETUAL, TAC.BACKRANK, SAC.TYPES, SAF.COUNT, SAF.LOOSE.
- OPN.PRINCIPLES, OPN.TEMPO, POS.CENTER.CONTROL, POS.OPENFILE, POS.SEVENTH, POS.CONNECT, POS.PAWNMOVE, POS.WEAKSQ, POS.PAWNWEAK, POS.VALUES, ATK.PAWNSTORM, DEF.SHELTER.

## 6. Comparison with our first-10-hours slice (`docs/first-10-hours.md`)

What he introduces first and why [R/I]:
- **Notation before moves.** He wants squares named so every explanation can point at them. Our slice puts the board and square names second, and "reading and writing a move" at lesson 17. [I] Ours is later for the move notation; arguably fine because our app shows moves on a board.
- **Piece order.** He teaches rook, bishop, queen, king, knight, pawn, i.e. straight lines before the leap and the odd pawn. Ours: attacked squares first, then knight, pawn, queen/king, rook/bishop. [I] His order is simpler for sliding pieces; ours defers the pawn like his but puts the knight earlier. No evidence either is better.
- **Endings as the classroom.** After the rules he stays with bare-board mates and K+P to show what each piece can do and to produce values. Our slice does the same with L-END-MATE-1 to L-END-OPPOSITION-1 (lessons 12 to 15), but after the rules and after value is stated as a rule (lesson 3). He derives value after the mates. [I] Deriving value from "who can mate" is a stronger explanation than a table; worth trying in L-FND-CAPTURE-1 or a later revisit.
- **"Avoid losing material, however small."** He says this as the leading rule, then shows why with pawn endings. Our "safety scan" and counting lessons (19, 23 to 27) cover the habit but not this reasoning. [I]
- **Two elementary attacks** (one man hits two; more attackers than defenders) as the spine of tactics. [I] Our counting lessons are close; our fork lesson is at 47. His order puts forks before counting.
- **Opening principles with reasons.** Two principles with causal explanations; ours has three habits (L-FND-OPENING-1) and a reasons-and-conditions follow-up (L-OPN-PRINCIPLES-1). [I] The match is good.
- **Not present in his beginner path:** self-observation, calibration, clock budget, practice load (our SELF/PRA nodes); he offers no practice or feedback.

## 7. Gaps in the graph the book fills

- **A mating-power node** that explains why B or N alone cannot mate and why two knights cannot (END.THEORY.2N exists; the general "attack plus control a flight square" idea behind it is not stated as a node) [I].
- **Latent value of a pawn** (the pawn's worth is queening) as an explicit bridge from FND.VALUE to END.KPK [I].
- **"Two attacks" taxonomy** as an organising idea above TAC.FORK and SAF.COUNT [I].
- **Piece-order in an attack** (minors, queen, rooks) and **when rooks can be useful** (open files, same-side vs opposite-side castling), partly in POS.OPENFILE and ATK.PAWNSTORM [I].
- **Problem vs game position** distinction, for puzzle-trained learners [I].

## 8. Outdated or doubtful claims

- Military analogies and "the pawn is rarely worth saving at a piece's expense" style statements are rhetoric. The preface's chess-trains-strategy claim is unsupported.
- "Queen about two rooks": rough, context-dependent; unchecked.
- "Black must not castle" and similar hard verdicts in the Diagram 25 and 47 lines are single-source opinions; unchecked, so do not teach.
- The Queen's Gambit pawn-recovery verdict overstated (see section 4). His rule "play c4 before Nc3 in Queen's Pawn games" is contradicted by his own sample line 4.Nc3 (an internal inconsistency) [I].
- 1918 opening verdicts (Ruy Lopez, Two Knights lines, Queen's Gambit Accepted) predate modern theory; treat as history.
- The e-text has typos in notation (for example a letter in place of a digit); no move list was fully replayed except where checked above.

## 9. What I did not read or check

- Part II (checkers, about 3,700 lines) and the Project Gutenberg header/footer: not read, only located.
- I read the chess prose and the game notes but did not replay or engine-check most variations, the master-game snippets, the problems' solutions (except Diagrams 82 and 83 with the engine) or the long Ruy Lopez notes. I did not check any "wins/loses" verdict in sections 3 and 4 other than the ones marked Checked.
- No claim here has human review; nothing should ship to a learner without the validator.
