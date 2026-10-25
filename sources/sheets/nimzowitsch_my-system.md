# Synthesis sheet: Aron Nimzowitsch, *My System* (English version by Philip Hereford, 1930)

Sheet written 2026-10-24 from the OCR text at `O:\_Chessteaching\sources\raw\nimzowitsch_my-system_1930-harcourt_archive.txt`. One of five sources in this batch (Capablanca, Em. Lasker, Znosko-Borovsky, Ed. Lasker are the others).

**Evidence labels used throughout.** **[READ]**: stated or shown in this book, as I read it. **[OUTSIDE]**: my background knowledge, not from this book. **[CHECK]**: needs engine or tablebase verification before any learner-facing use (every absolute rule and every evaluation is marked). **[I]**: my own inference or design judgment (for example, likely learner misconceptions). Node IDs refer to `curriculum-map-v1.md`; "CD-n" refers to `council-synthesis.md`. Cue levels follow `first-hours.md`: 1 = idea named and explained, 2 = themed set, 3 = mixed and unlabeled, 4 = unlabeled in the learner's own game [I: my reading of that file].

**Quotation budget.** Exactly three short direct quotations appear in this sheet, each with a section reference (all in section 4: ideas 5, 35 and 40). Everything else is paraphrase. Book coinages (isolani, hanging pawns, mysterious rook move, and so on) are written as plain terms or in italics, not as quotations.

---

## 1. Source & rights

- **Work.** Aron Nimzowitsch, *My System: A Chess Treatise*. English version by Philip Hereford. Harcourt, Brace and Company, New York. The title page and the copyright notice in the text read 1930 (the OCR garbles one connecting word but the notice is legible: copyright 1930, Harcourt, Brace and Company, Inc.; printed in the United States) **[READ]**. The translator's preface is dated 29 August 1929 **[READ]**.
- **Rights basis.** First US publication 1930, so US public domain from 1 January 2026 under the 95-year term, as the commissioning note states **[OUTSIDE; renewal records not checked]**. The German original, *Mein System* (1925 onward), is a separate work; Nimzowitsch died in 1935, so the German text is out of copyright in life+70 jurisdictions **[OUTSIDE]**. The English edition differs from the German: the translator says he added several games, omitted a few passages with the author's agreement, and moved all the illustrative games into one section at the end **[READ]**. We use this edition only for ideas and for facts (game moves are facts); no sentence of it is copied into learner-facing text (CD-16).
- **Digitization.** Internet Archive scan (2024) with OCR. Header lines ignored, as instructed.
- **What I read.** Every line of the file: 24,379 lines, about 114,000 words. That is the translator's preface and biographical note, the lists of games, the errata list, Part I (nine chapters, *The Elements*), Part II (six chapters, *Position Play*), all 50 illustrative games with their annotations, and the publisher's advertisement pages. I read the games for their annotations and for the doctrine they illustrate. **I did not replay the move sequences or verify any of them.**
- **Text quality.**
  - **Prose is good.** The running text is mostly clean and the argument is followable in every chapter.
  - **Notation is noisy.** It is descriptive notation. The OCR confuses digits and letters throughout: the digit 1 shows up as `r`, 2 as `z`, 4 as `q`, 5 as `s` or `g`, 0 as `o` or `O`. Piece letters collide (K, R, B). Exclamation and question marks are often lost or doubled.
  - **No diagrams.** There are about 180 numbered diagrams and none are in the text. Captions survive as scrambled fragments. Where he gives a skeleton position in prose (a list of kings, pieces and pawns by square) it is usually reconstructable, but the OCR can corrupt the squares.
  - **Layout damage.** The two-column game scores run together. Running page headers (`MY SYSTEM`) are interleaved. The contents page prints the pawn-chain chapter as Chapter XI; it is Chapter IX (his own cross-references say `I. ix`). The list-of-games table is scrambled.
  - **The book prints its own errata.** There is a long errata list at the front (wrong moves, misplaced kings in diagrams) **[READ]**. So even the printed original had move-level errors, and every example needs engine verification before use.
  - **Limits on conclusions.** Anything that depends on a specific diagram or a specific move sequence (the endgame studies in I.iv §8, the bridge-building positions in I.vi §1a, the hanging-pawn family tree in II.iii §8) I can describe but not verify. I followed the argument in all fifteen chapters, but I could not follow every position.

---

## 2. One-paragraph portrait

*My System* is a two-part treatise that tries to turn positional play into a short list of named, linked devices. **Part I, The Elements,** teaches what he calls the elements of strategy: the centre, the open file, the seventh and eighth ranks, the passed pawn, the pin, discovered check, exchanging, and the pawn chain. A chapter on endgame strategy (Chapter VI), which he says belongs under position play, is inserted early for teaching reasons. **Part II, Position Play,** builds on those with prophylaxis, restraint, over-protection, the isolated queen's pawn, the bishop pair, and manoeuvring against weaknesses. The audience is the ambitious club player who already knows the rules and basic tactics [I]; he addresses the less experienced player directly and often as a scold, and says the first chapter is written with that reader in mind. His method is **assertion, then a vivid analogy, then examples mostly from his own games**: military and legal metaphors (a passed pawn is a criminal to be jailed; a mobile centre pawn is to be executed or imprisoned), jokes, and coined terms (blockader, outpost, restraint, over-protection, base of the chain, isolani). He argues from the reasons behind a rule rather than the rule itself; he says explicitly that the bare rule that passed pawns must be stopped shows poor understanding and that the why matters (I.iv §2). The voice is confident, partisan, and often dogmatic. He fights the school of Tarrasch (centre = pawns, freeing moves are always good, opposition) and repeatedly claims priority for his ideas. The book's real teaching value is in conditions (what has to be true for the device to work) that are often stated only in passing inside an example, which is exactly what our contrast-family design (CD-4) needs.

---

## 3. Structure of the book

**Front matter.** Translator's preface; biographical note (born 1886, Riga; learned the game at eight; worked out his system 1906 to 1913; lists tournament results); contents; lists of games; errata. **[READ]**

**Part I, The Elements.** (He numbers sections inside chapters as §1, §2, and so on; I cite as I.ii §4 = Part I, Chapter II, section 4.)
- **I.i On the centre and development.** What the centre is (four squares), development as a collective march of all pieces, pawn moves as aids only, tempo gain by exchange, liquidation, the free mobile centre pawn (kill or restrain it), pawn hunting and its exception.
- **I.ii On open files.** Definitions; how files open; the aim of file play is the seventh or eighth rank; protected and unprotected obstructing pawns; the evolutionary and revolutionary attack; the restricted advance; the outpost; a note on Zugzwang.
- **I.iii The seventh and eighth ranks.** Choosing a single objective; convergent and revolutionary attack on the rank; winning a point with check; five special cases (seventh rank absolute with passed pawn; perpetual check with rooks; the rook-plus-knight perpetual apparatus; driving the king from the corner; the enveloping manoeuvre in the corner).
- **I.iv The passed pawn.** Majority and candidate; why the blockade is obligatory (three reasons); the blockader's qualities and elasticity; exchanging the blockader; the king's tripartite approach to an isolated pawn (and the case against the opposition); privileged passed pawns; when to advance one; endgame studies.
- **I.v On exchanging.** The motives for exchanging; any exchange outside them is bad.
- **I.vi The elements of endgame strategy.** King and piece centralization; shelter and bridge-building; the aggressive rook and the active piece; rallying the scattered forces and advancing together; turning an abstract file or rank into a concrete point; endgame studies.
- **I.vii The pin.** Whole and half pins; the exchange combination on the pinning square; the four ways of unpinning and the corridor idea.
- **I.viii Discovered check.** Mobility of the masking piece; the see-saw; double check.
- **I.ix The pawn chain.** The base; two theatres of war; attack the base; the blockade viewpoint; exchange manoeuvre; war of movement versus siege; transfer of the attack.

**Part II, Position Play.**
- **II.i The conception of position play and the problem of the centre.** Two misconceptions to remove; prophylaxis (outer and inner); over-protection introduced; collective mobility of the pawn mass; guarding the centre; centralization as leitmotif; surrender of the centre (squares, not pawns).
- **II.ii The doubled pawn and restraint.** Static and dynamic weakness; true and false freeing moves; the mysterious rook move; restraint of mobile centre pawns, of qualitative majorities, of doubled-pawn complexes; the author's own opening systems.
- **II.iii The isolated queen's pawn and its descendants.** Isolani; isolated pawn couple; hanging pawns.
- **II.iv The two bishops.** Bishop versus knight; Horrwitz bishops; clamping and hemming in knights; the endgame.
- **II.v Over-protection.** Which points; which pawns to shed.
- **II.vi Manoeuvring against enemy weaknesses.** Pivot and terrain; two weaknesses; combined play on both wings.

**Illustrative Games** (50, with running annotations; the last five, Nos. 46 to 50, are called historically important to his own development). **Publisher's advertisement pages** (list Capablanca's *Chess Fundamentals* and Znosko-Borovsky's *The Middle Game in Chess*, among others, so the English publisher marketed this book alongside two of the other sources in this batch). **[READ]**

---

## 4. Core ideas

**Reading key.** For each idea: (a) name; (b) the idea in my words; (c) conditions under which it holds; (d) exceptions and limits he states or implies, plus my qualifications; (e) where it appears; (f) the example type he uses; (g) a likely misconception it invites **[I]**. Fields (b), (c), (e), (f) are **[READ]** unless tagged. Field (d) mixes limits he states **[READ]** with my qualifications **[OUTSIDE]**/**[CHECK]**. "Games" refers to the numbered illustrative games.

### Part I: The Elements

**1. Development is collective; tempi are the currency**
- (b) A side is developed only when all its pieces have been brought toward the front, not when a few have. The side with the lead in development has the initiative. Every extra move of a piece already moved, and every retreat, is a lost tempo.
- (c) Open or semi-open openings with contact between the sides.
- (d) He says closed games develop more slowly and allow more pawn moves. Tempo counting is a heuristic. **[OUTSIDE]** Modern analysis weighs concrete lines over tempo tallies. **[CHECK]** his tempo counts in the examples.
- (e) I.i §1, §3.
- (f) Short opening lines in which one side makes a developing move that attacks a piece already moved, and the other side must lose time answering.
- (g) Counting tempi mechanically and concluding that any piece moved twice is bad.

**2. Pawn moves in the opening are aids, not development**
- (b) If pieces could develop without pawn moves, that would be best, but an enemy pawn centre would drive them back, so a pawn centre must come first. In open games a pawn move is justified only if it builds, supports, or attacks the centre; flank pawn moves cost time. He cites Lasker for the limit of one or two pawn moves in the opening.
- (c) Open games.
- (d) Closed games excepted (stated). The rule is an open-game tempo rule; he himself plays flank pawn moves such as b3 in his own games (Games 25 and 34) and fianchettoes as Black (Games 7, 8, 18). **[CHECK]** the absolute form (every pawn move that is not centre-related loses time).
- (e) I.i §2; II.i examples.
- (f) A pawnless advance of the pieces that is punished by a central pawn thrust; a game at odds where Black's development becomes pawnless.
- (g) *Never move a flank pawn in the opening.* Hypermodern play (his own) contradicts this.

**3. Exchange to gain tempo; liquidate to cure a cramped development; no motiveless exchanges**
- (b) Two opening uses of exchange: (i) take so that the recapture is forced and gains the capturer a developing move or hits a piece that has already moved; (ii) when development is stuck, exchange wholeheartedly to relieve the tension, rather than patching with a protecting or flight move. Exchanging a piece that has moved several times for one that has not is the beginner's typical error.
- (c) Early middlegame or opening; the exchange must relieve tension in the centre and let development continue.
- (d) He says to exchange only in those two cases. **[CHECK]** The absolute form (see section 5, item 3).
- (e) I.i §4, §5.
- (f) Opening positions where Black's queen or bishop is harassed and either shuffles or liquidates.
- (g) Believing that any exchange that relieves tension is good; ignoring recapture tempo.

**4. A free mobile centre pawn: kill it or restrain it; defend a centre with pawns**
- (b) If you have allowed the enemy a mobile centre pawn, treat it as the main enemy: either remove it with a prepared pawn break, or keep it under restraint (set up pieces so it cannot advance) until it is impotent, then remove it. If you hold the centre, support it with a pawn rather than a piece; a pawn defends without being tied.
- (c) After a centre exchange where the opponent keeps a pawn on e4 or d4 against a restrained set-up; the set-up he gives is Nf3, Be7, castling, Re8, Bf8.
- (d) Restraint is hard; the quick kill is rarely available (stated). Holding the centre is the more prudent course only if no counterbalancing disadvantage appears. **[CHECK]**
- (e) I.i §6, §6a; II.ii §5(a); Games 2, 4.
- (f) Open-game structure, White pawn e4 against Black pawns d6 and f6 area.
- (g) Thinking the centre must always be held by pawns, or that the enemy centre pawn must be captured at once.

**5. Pawn hunting in the opening; the centre-pawn exception**
- (b) Winning a wing pawn while development is unfinished is the typical amateur mistake. The rule in his words: "Never play to win a pawn while your development is yet unfinished!" (I.i §7). The one exception: a pawn in the centre should be taken if it can be done without too much danger, because the gain is not the pawn but the room it gives you to expand where the fight is.
- (c) Early opening; development unfinished.
- (d) Gambits: decline with developing moves; accept the King's Gambit only to test the centre, not to keep the pawn (stated). **[CHECK]** both halves; see section 5, item 4. Game 1 is built around a queen grabbing a pawn.
- (e) I.i §7, §7a; Game 1.
- (f) Centre Gambit, Evans Gambit, King's Gambit lines; a queen raid that wins a wing pawn and loses the game.
- (g) *Never take a pawn early.* The exception is as important as the rule.

**6. The open file: definition, genesis, objective**
- (b) A file is open for a side when it contains no pawn of that side (an enemy pawn standing on it does not close it for you). Playing against a pawn or against the point it stands on is the same thing. Files open either peacefully (the opponent trades off your centrally posted piece and recaptures with a pawn) or by assault (you advance a pawn to exchange it). The pawn you attack is the objective; the file to open is the one next to it. Post pieces centrally so the opponent has to trade them, if you can do so safely.
- (c) Rooks (and heavy pieces) present; an objective exists.
- (d) The definition text is garbled in the OCR; I follow the sense. A rook merely standing on an open file does nothing without a way in (see 7, 10).
- (e) I.ii §1, §2; Game 11 (Thomas–Alekhine).
- (f) Middlegame where a knight exchange opens the c-file, with rooks doubling.
- (g) Occupying the open file as a goal in itself.

**7. The aim of file play is the seventh or eighth rank; raids and enveloping**
- (b) Every operation in a file should aim at an invasion square on the seventh or eighth rank. Reaching the rank by a roundabout route does not count as using the file. Typical wins: forks on the rank (a marauding raid), and a triangular queen manoeuvre against a king stuck behind pawns (an enveloping attack).
- (c) The enemy is cramped there and has few defenders on the rank; the way in is safeguarded.
- (d) Catastrophic invasions arise from the opponent's serious mistakes, so in normal play the seventh rank is mostly an endgame asset (stated, I.iii §1). He urges trying to invade early anyway and not getting discouraged if the first attempts fail. **[CHECK]** any claim that an invasion wins.
- (e) I.ii §3; I.iii §1.
- (f) Queen checks to the seventh and eighth ranks against a castled king with weakened pawns.
- (g) Rook-to-seventh as an automatic evaluation plus.

**8. Obstructions in a file: protected (granite) and unprotected; evolutionary and revolutionary attack**
- (b) A pawn that blocks your file is either protected by another pawn or not. Do not batter a pawn-protected obstruction; undermine it with a pawn lever. An unprotected obstruction can be besieged: bring more attackers than defenders, and thin the defenders by driving them off, exchanging them, or shutting them out (the evolutionary attack). If that fails, give up material to clear the way (the revolutionary attack: sacrifice a piece or rook on the obstruction so a second rook reaches the rank). Try the converging attack first, the sacrifice second.
- (c) For the sacrifice: the invasion square really wins (mate or decisive gain).
- (d) Stated: sacrifice only after the quiet method has been tried; the sacrifice is made for the entry, not for material.
- (e) I.ii §4; I.iii §2 (the same pair applied to the rank).
- (f) Small endgame and middlegame studies with rooks on the h-file and a pawn shielding the king's corner; a rook sacrifice on that pawn mates.
- (g) Sacrificing whenever a file is open.

**9. The restricted advance: a file as a jumping-off place**
- (b) Sometimes you cannot use a file directly, but you can advance along it a limited distance and then switch to another file to win a pawn or reach a target. The file has been used indirectly.
- (c) The direct entry is closed; a second route exists.
- (d) None beyond (c).
- (e) I.ii §5; Games 9, 10, 11 notes.
- (f) A rook goes up the c-file and then to the a-file.
- (g) Thinking an unusable file is worthless.

**10. The outpost**
- (b) A piece (usually a knight) stationed in an open file on the enemy side, protected by a pawn. It forces the opponent to weaken himself to drive it away (for example by ...c6 or ...a6), and it is a base for the next phase of the attack. Its strength comes from its hinterland: the open file behind it and the protecting pawn. Remove either and it loses its point. In a flank file the post-holder should be a rook, not a knight (a knight's radius is too small there). An outpost is often exchanged off, and the recapture (a pawn, or a piece with a pawn structure change) then gives compensation: conversion of advantages.
- (c) Protecting pawn present; open file behind; the opponent cannot kick it with a pawn without damage.
- (d) Stated: with a pawn on the file in front of the outpost, or with the supporting pawn on a different square, the outpost is no longer a weakness for the enemy. **[CHECK]** all example verdicts.
- (e) I.ii §6; Games 5, 11; the same logic reappears for the blockader (idea 16).
- (f) Knight on d5 with a pawn on e4 against a pawn on d6; the same position with the pawn on e3 (the pair is a ready-made contrast).
- (g) A knight on the fifth rank is automatically an outpost. It needs the file and the pawn.

**11. Zugzwang**
- (b) The compulsion to move: a position where any move worsens the side to move. Usually arises when pieces are best placed and any change hurts; the weapon is mainly endgame, often pure pawn endings. A defender whose piece has only one job (a uni-operative defender) is the usual victim.
- (c) Few pieces; limited safe moves.
- (d) Term left untranslated by the translator on purpose.
- (e) Footnote at the end of I.ii; I.iv §5; I.vi §2; Game 8.
- (f) King-and-pawn endings where the attacker can pass the move.
- (g) Thinking every blocked position is a zugzwang.

**12. Pick one objective on the rank; attack it from behind; win a point with check**
- (b) The player who drifts between targets on the seventh rank, with no fixed aim, loses time. Choose a pawn or a point, concentrate on it, and if the pawn flees, follow it from behind (an enveloping rook beats a flank rook beats a frontal one). A queen should win the target with check so the enemy king cannot bring reserves.
- (c) Target chosen has a realistic route.
- (d) Sometimes the target is badly chosen (an example in I.iii §2 shows the wrong objective losing).
- (e) I.iii §1, §2.
- (f) Rook and queen positions with a chosen target pawn or square on the seventh rank, and a fleeing pawn that the rook follows from behind.
- (g) Always chasing the pawn from behind, whatever else is on the board.

**13. The five special cases of the seventh rank**
- (b) (1) A rook on the seventh with the enemy king confined behind it and an advanced passed pawn wins almost always (the rank is *absolute*). (2) Two rooks on the seventh give perpetual check; do not needlessly change which rook checks, because a rook that has been guarding the rank should stay as the sentinel. (3) Rook plus knight can form a perpetual-check apparatus against several enemy pawns about to queen. (4) Two rooks can drive the king from the corner and then raid. (5) The corner enveloping manoeuvre: king in contact with the nearer rook is safe, so the rooks must break the contact (by a check, protection, or attack) to mate or win material or time.
- (c) Specific piece configurations; each case spelled out in prose with a skeleton position.
- (d) For (1) he says it would be only a draw if the king stood elsewhere; the rank must really be absolute. **[CHECK]** the claim that case (1) wins almost always; **[CHECK]** every skeleton position with a tablebase or engine.
- (e) I.iii §3 (including the Wilna 1912 and Riga 1910 examples); I.iv §8 (Nimzowitsch–Alapin); Game 13 note.
- (f) Small-material endgames, a tournament rook-and-bishop ending, and a swindle that saves a lost game by perpetual check.
- (g) Rook on the seventh is always strong.

**14. The pawn majority and the candidate**
- (b) A healthy majority must be able to create a passed pawn. The candidate is the pawn with no enemy pawn directly in front of it on its own file; it leads, the others support. The weaker player pushes the middle pawn first, which lets the opponent fix the majority.
- (c) Majority intact; no tactical interference.
- (d) The rule is stated absolutely for every healthy, uncompromised majority. **[CHECK]**
- (e) I.iv §1; qualitative majority in II.ii §4.
- (f) Three pawns against two on one wing, where the order in which the three advance matters.
- (g) Thinking numbers alone decide; tempo and king position matter.

**15. The blockade of a passed pawn is obligatory: the three reasons**
- (b) He argues it is not enough to watch a passed pawn. (1) A passed pawn wants to expand; it will even sacrifice itself to free the pieces behind it (open a file for a rook, a diagonal for a bishop, a square for a knight). (2) The blockader sits safe from frontal attack in front of the pawn, and the blockading square tends to become a weak square for the enemy; this is where he locates the origin of the weak-square concept, later widened to any square in front of an enemy pawn that you can occupy without being driven off. (3) The crippling extends to the rear: a blockaded pawn's own pieces are cramped around it.
- (c) The blockading piece is well supported; the pawn is dangerous or central.
- (d) Elasticity falls as the pawn advances; the king or queen are poor middlegame blockaders (idea 16). **[CHECK]** the claim that the blockade is obligatory.
- (e) I.iv §2, §2a, §2b, §2c; Games 12, 24.
- (f) A passed central pawn with bishop, rook and knight grouped round it; a sacrificial pawn advance that frees the pieces behind it (Alekhine–Treybal); Game 12 (a blockade that imprisons the enemy bishop).
- (g) All passed pawns are lethal. Also: blockading with whichever piece is nearest.

**16. The quality of the blockader: strong or weak, elastic or inelastic; support**
- (b) A blockader has a primary job (block), secondary jobs (threats from its post; elasticity: the ability to leave and return, or leave a deputy). Elasticity is greatest against a half-passed central pawn, least against a far-advanced one. Minor pieces make the best blockaders; the queen leaves at the first attack; the king is poor in the middlegame but useful in the endgame. Support the blockader and over-protect the blockading square before attacks arrive.
- (c) As described.
- (d) Stated: elasticity matters only in certain cases.
- (e) I.iv §3, §3a; Games 14, 15.
- (f) A knight as blockader on a central square (Games 14, 15); a rook blockading from a side file that can swing across the board (the Nimzowitsch–Nilsson ending).
- (g) Treating a blockader as a stuck piece.

**17. Replace or uproot the blockader**
- (b) If the blockader is strong, exchange it so a weaker one takes over; then attack its supports (in endgames drive them away, in the middlegame keep them busy). Applies equally to a pawn chain, because a chain pawn is a blockader (idea 31).
- (c) The replacement really is weaker or less elastic.
- (d) The exchange is justified only then (stated).
- (e) I.iv §4; I.ix §4; Games 13, 46.
- (f) Taking a bishop blockader so a rook must take over; giving up the exchange to replace a bishop with a rook.
- (g) Exchanging blockaders without checking quality.

**18. The king against an isolated pawn; the tripartite manoeuvre; reserve blockading point; the case against opposition**
- (b) The king leads in endgames. Against an isolated pawn, the king aims for a frontal position, forces the enemy king to give way (often through Zugzwang), then wins a square by a turning move. The defender holds the blockading square and falls back on a reserve blockading point. He calls the standard theory of the opposition unclear and in effect superseded by this picture.
- (c) Pawn endings with a stationary target.
- (d) **[CHECK]** and **[OUTSIDE]** The tripartite pattern describes real king technique (outflanking, key squares). Opposition remains standard teaching; do not retire it. Verify each skeleton position with a tablebase.
- (e) I.iv §5, §8 (Nimzowitsch–Rubinstein, Breslau 1925).
- (f) K+P endings with an advanced candidate and kings on the squares in front.
- (g) Dropping the opposition. This is a point where the book is dated and where our endgame spine (CD-6) should be traditional first.

**19. Privileged passed pawns; hole-stopping**
- (b) Three privileged kinds: two united passers on the same rank (advance only when no strong blockade is possible, then bring the second up at once); a protected passer (immune to the enemy king); a remote passer (a decoy; prepare the king's journey *before* the diverting sacrifice or exchange, use Zugzwang, and entice enemy pawns forward). The king should step into the hole the pawn's advance leaves.
- (c) As described.
- (d) Stated: a pawn may push alone only if it is far advanced.
- (e) I.iv §6; I.iv §8 (Tarrasch–Berger ending, also Game 6 note); the Stockholm 1921 club-match position with two united passers.
- (f) K+P studies; a remote passer drawing the defending king away.
- (g) Pushing a passed pawn at once; spending the remote passer too early.

**20. When a passed pawn should advance**
- (b) Only (a) when the advance brings it nearer promotion against a weak blockade, or makes it protect useful squares; (b) to win ground for its own king or a following piece; (c) as a sacrifice to divert the enemy king, placed so the diversion costs the enemy the most time. Beginners advance at the least suitable moment.
- (c) As described.
- (d) None stated.
- (e) I.iv §7.
- (f) Pawn endings.
- (g) Pushing a pawn simply because it is passed.

**21. Motives for exchanging**
- (b) Open or seize a file without losing a tempo (the recapture is forced); destroy a defender (a defender in the wide sense: a piece that guards a file entry, an outpost, a blockade, or the castled king); avoid losing a tempo by retreating (with the special case of selling a doomed queen dearly); simplify when ahead in material; settle the fight for a key point; exchange weak pawns for each other; an advance in a file you control forces exchanges.
- (c) As described.
- (d) He says an exchange outside these is bad. **[CHECK]** (section 5, item 3).
- (e) I.v; Games 11, 14.
- (f) A short series of exchanges that wins a back-rank mate.
- (g) Counting only material.

**22. The endgame as realization; centralize the king and the pieces**
- (b) The endgame is not leftovers; it is where middlegame advantages are cashed in. The king becomes a principal actor there rather than a bystander: bring it to the centre as soon as the endgame begins, for activity and to limit the enemy king's squares. Knights, bishops and the queen also want the centre. A king-knight-pawn island in the centre is a stable structure.
- (c) Queens off or heavy attackers gone; no mating threats.
- (d) He notes a case where an immediate king move fails to a bishop check (I.vi §1, third example); centralization must follow the tactics.
- (e) I.vi intro, §1.
- (f) Rook and minor-piece endings with the kings racing for e4 or d4.
- (g) Moving the king into the centre before the attackers are gone.

**23. Shelter and bridge-building**
- (b) When checks threaten to drive a king back, the king uses a shelter square away from the checks; a rook may build a bridge by standing on a line so the king is covered, and the bridge can be shifted.
- (c) Rook and pawn against rook, with long-range checks.
- (d) **[CHECK]** the positions are diagram-based; they resemble the technique usually taught as the Lucena bridge **[OUTSIDE]**, but the book does not use that name in what I read.
- (e) I.vi §1a (Diagrams LXVIII, LXIX); Game 10 note (a knight move that builds a shelter).
- (f) Rook endings with a pawn on the seventh.
- (g) Treating this as a separate theory from the standard rook ending.

**24. The aggressive versus the passive piece; the rook behind the passed pawn**
- (b) A rook does best in an aggressive post that gives it freedom of action on both wings; a passive rook tied to a pawn is a liability, and giving up the pawn for activity is often right. Tarrasch's formula: the rook belongs behind a passed pawn, its own or the enemy's. A defending knight has only one task and falls to Zugzwang; a defending bishop is slow to change front.
- (c) Rook endings and endings with minor pieces.
- (d) **[CHECK]** the rule of sacrificing the pawn rather than defending it passively; passive defence is sometimes the only draw **[OUTSIDE]**.
- (e) I.vi §2.
- (f) Rook and pawn endings; knight and bishop endings with a king march.
- (g) Never defending passively.

**25. Rally the detachments; advance together; the file in the endgame**
- (b) Combined play is about eighty per cent of endgame technique (his figure, unsupported): bring scattered pieces into mutual contact, advance the pawns with the king and pieces in step, put a king or knight on the square the pawn vacated. In the endgame a file is exploited meditatively: it is already yours, and the breakthrough point will arrive almost by itself.
- (c) A permanent file advantage and no counter-chances.
- (d) **[CHECK]** the claim that the breakthrough point will arrive of its own accord.
- (e) I.vi §3, §4.
- (f) Rook and pawn endings; Games 10, 11.
- (g) Waiting passively once you hold a file.

**26. The pin: anatomy and exploitation**
- (b) Three actors: pinning, pinned, screened. A pinned piece is wholly pinned if it cannot move at all, half pinned if it can slide along the line. A pinned piece's protection of a square is imaginary, so you can place a piece where only a pinned piece guards it. Win a pinned piece by multiplying attackers; best of all, attack it with a pawn, because the pinned piece cannot flee. He also treats a pin as a strategic motive (it can shape a whole game), not just a tactical one.
- (c) The pin is genuine (against king or a more valuable piece with no tactical escape).
- (d) A pinned knight is always wholly pinned; a pinned pawn can be fully immobilized only by a diagonal pinner or by blockade.
- (e) I.vii §1, §2.
- (f) Queen sacrifice on a square guarded only by a pinned bishop or pawn; pawn attack on a pinned piece.
- (g) Treating any pin as winning a piece.

**27. The exchange combination on the pinning square**
- (b) When you want to win a pinned piece, exchanging on the square it stands on can (1) replace a half-pinned defender with a wholly pinned one, or (2) win a tempo that would otherwise let the opponent unpin. The two can combine.
- (c) The recapturing piece is itself pinned or tied.
- (d) None stated.
- (e) I.vii §3; Morphy's opera-box game is used as the standard example.
- (f) A rook takes the pinned knight, is recaptured, and a second rook takes over the file with tempo (the Morphy opera-box game); a rook-for-bishop exchange on the pinning square in a pawn-race ending.
- (g) Believing the sacrifice always wins; the point is the count of attackers.

**28. Unpinning: the question, ignoring, reserves, holding the choice, the corridor; tolerate pins**
- (b) Four policies when your piece is pinned: ask the pinning bishop what it intends with a flank pawn push (the question); ignore the pin and accept damaged pawns in exchange for central freedom; bring up reserves to unpin quietly; or keep choosing among the three. Corridor idea: put a protected piece in the line between pinner and pinned, or move the screened piece. The moderns tolerate pins for a long time.
- (c) The question is good when the driven bishop lands on a desert that cannot be brought to life because the centre cannot be opened; it is bad when the centre can open or when the pawn advance leaves the king exposed to a break.
- (d) The question is disorganizing for the side that asks it, so it should not be put without compensation (stated). **[CHECK]** all the opening verdicts.
- (e) I.vii §4; Games 16, 17, 18.
- (f) Pins of a knight on f6 by a bishop on g5 in Italian-game and Scotch-game structures, answered by ...h6 and ...g5 (the question) or by ...Be6 (holding the choice); the Metger and Petroff unpinning set-ups.
- (g) Thinking the question always wins a tempo.

**29. Discovered check, the see-saw, double check**
- (b) A discovered check is a pin where the pinned piece has changed sides: the masking piece can capture anything, attack anything, or relocate, and cannot be recaptured because the opponent is in check. The see-saw: a bishop that checks on one square and then discovers check from another wins material with each swing because the king has only one move. Double check leaves only flight.
- (c) King with few flight squares.
- (d) He calls double check purely tactical.
- (e) I.viii (Torre–Lasker, Réti–Tartakower, and a simultaneous-display game of his own).
- (f) Bishop see-saw against a king in the corner; double-check mates after a queen sacrifice.
- (g) None particular.

**30. The pawn chain: base, two theatres of war, attack the base**
- (b) A chain is a set of pawns in consecutive diagonals; its lowest link is the base. When a chain forms, the board splits into two fronts: the wing cramped by the head of the chain and the base itself. Attack the *base*, not the head (loosening the head leaves the foundation); the aim is to free your own cramped pawns. The side with the chain's head, in turn, plans a pawn lever on the other wing and a piece attack on the cramped king.
- (c) A real chain with fixed head and base.
- (d) He says freeing operations in the region of a chain cannot begin too early, an absolute claim **[CHECK]**; he also warns that half-finished liberating operations are dangerous for the one who starts them.
- (e) I.ix §1, §2, §3; Games 19 to 24 and 46 (the chain games).
- (f) The French Defence advance structure (White pawn on e5, d4; Black e6, d5).
- (g) Hitting the head of the chain (the ...f6 lever) instead of the base.

**31. The chain as a blockade problem: exchange manoeuvre, war of movement versus siege, unprotected base, transfer of attack**
- (b) A chain pawn blockades, so Chapter IV applies: replace a strong blockader by a weaker one. Two plans: a war of movement (try to force the base to capture) or a siege (fix the base and attack it with many pieces, which also forces the defender's pieces to be passive). A weak base is chiefly an endgame weakness; in the middlegame the siege should lead to a second weakness elsewhere, and then you switch to that. If the base itself cannot be shaken, transfer the attack to another link. Every chain owner also has a base of his own to protect.
- (c) As described.
- (d) Do not stay with the same base forever (this is how he distinguishes himself from Tarrasch).
- (e) I.ix §4, §5, §5a, §6; Games 19 to 24 and 46.
- (f) A siege of d4 followed by a switch to a king-side weakness.
- (g) Keeping up the siege after a second weakness has appeared.

### Part II: Position Play

**32. Two misconceptions to uproot: the urge to be always doing something; overrating small advantages**
- (b) (1) Many amateurs think every move must threaten or parry; positional moves are neither, but secure the position and bring pieces into contact with key points. (2) The master's idea of position play as the slow accumulation of small advantages is secondary in his view; the prophylactic idea is the main one.
- (c) As stated.
- (d) His downgrading of small advantages is overstated. **[OUTSIDE]**
- (e) II.i §2 (the Riga 1910 game against an amateur, given in full in the text).
- (f) A game against an amateur who expects a race of opposite-flank pawn storms and is answered by a knight outpost in the centre.
- (g) Thinking quiet moves need no purpose.

**33. Prophylaxis: outer (prevent freeing moves) and inner (contact with strategic points)**
- (b) He claims the real positional skill is to blunt the opponent's useful possibilities. Outer: stop the opponent's *real* freeing move. Inner: bring your pieces into contact with your own important points, which leads to over-protection.
- (c) The freeing move is real (idea 35); the points are strategic.
- (d) The node `POS.PROPHYLAXIS` is broader than his two forms; see section 9.
- (e) II.i §3; Games 32, 33.
- (f) A position where a rook goes to a closed file to deter a break.
- (g) Equating all prophylaxis with passivity.

**34. Over-protection**
- (b) Provide more defence than the attack seems to require for a strategically important point (a strong central pawn, an outpost, the base of a chain, a blockading square, your own king's shelter in the centre). The reward is that the over-protectors become active by contact with the strong point. Do not over-protect ordinary weak points; the exception is a weak pawn that supports a strong point (the base of a chain).
- (c) The point is strong and will come under pressure; the pieces involved do not become passive.
- (d) Stated: ordinary weak points should not be over-protected, because it makes the defenders passive. **[OUTSIDE]** The claim that contact with a strong point gives the over-protectors strength is a heuristic, not a law; **[CHECK]** with engines on his examples.
- (e) II.i §3; II.v §1; Games 38, 39, 49 (and the Nimzowitsch–Giese and Nimzowitsch–Alekhine diagrams in II.i §3).
- (f) White's e5 pawn in the French advance structure over-protected by knight, bishop and rook; Black's e5 pawn against a hypermodern pawn-centre plan (Réti–Yates).
- (g) Over-protecting everything; confusing it with passive defence.

**35. True versus illusory freeing moves**
- (b) A freeing move (usually a pawn break) is not freeing in itself. It is real only if the position can bear the opening of lines (development is far enough along). In an undeveloped position the break just exposes weaknesses. His own wording: "There is no such thing as an absolute freeing move" (II.ii §3). He puts the old estimate of the ...f5 break being good at eighty per cent and his own at sixty (rhetorical figures).
- (c) Compare development, tempo lead and structure.
- (d) **[CHECK]** any specific break verdict.
- (e) II.i §3; II.ii §3; Games 32, 33.
- (f) The ...f5 break against a centre pawn pair when the other side leads in development (Diagram CXLII); a ...e5 break that fails because the player is behind in tempi (Diagram CXIII); Blackburne–Nimzowitsch (Game 32), where a d4 break is declared a false liberation.
- (g) Thinking restraint should be permanent; he says it cannot hold forever, only make the break harder.

**36. Collective mobility of the pawn mass**
- (b) The pawn mass's value is its collective ability to advance, not each pawn's individual mobility; a pawn left behind may serve as a nurse for those in front. A mobile centre or wing mass can roll forward, supported by the bishops.
- (c) Support from pieces; the mass is not blockaded.
- (d) Hypermodern practice shows that a roller can be restrained (idea 47).
- (e) II.i §4; Games 25, 31.
- (f) Pawns on e4, f4, g4 with a bishop on b2.
- (g) Counting pawns on the board.

**37. Watch the centre; a flank attack needs a secure centre; the centre file refutes the flank attack**
- (b) The centre is a theatre where fighting can start at any moment; many apparently closed centres can open. Pieces drawn to a wing leave the centre exposed to an invasion (a knight jump to d5). A wing attack is justified only if the centre is secure; the central player usually has the better prospects, especially with an open central file against a flank attack.
- (c) As described.
- (d) He says the central player always has the better prospects in these positions; that is not justified in general. **[CHECK]** (section 5, item 8). His ninety per cent figure for closed centres that can open is a rhetorical estimate.
- (e) II.i §5, §6; Games 22, 26, 27, 28, 44.
- (f) Capablanca–Martinez (a wasted move in an apparently closed centre); Rubinstein–Nimzowitsch, San Sebastian 1912 (a knight excursion on the king's wing punished through the centre files).
- (g) Neglecting wing play altogether.

**38. The centre is squares, not pawns; surrender and obstruction**
- (b) Control of the centre is a matter of effective influence, not of pawns on e4 and d4. Pieces and long-range bishops and rooks can hold the centre. Pawns are the most stable builders but also an obstruction to their own pieces. Giving up a centre pawn by exchange (for example ...dxe4 in the French) can increase influence by opening the d-file and the long diagonal.
- (c) The pieces can actually exert the pressure; the opponent's pawns are put under restraint.
- (d) **[OUTSIDE]** Largely absorbed into modern teaching, but he overstates the case against counting pawns.
- (e) II.i §7; Games 1, 26, 27.
- (f) The French Defence after Black captures on e4 early; positions where a piece, not a pawn, holds the key central square (Games 26, 27).
- (g) Leaving the centre forever; hypermodern play waits for the right moment to occupy it.

**39. Doubled pawns: static versus dynamic weakness; incite the owner to advance; their tenacity**
- (b) A doubled-pawn complex shows its weakness mainly when it advances (a dynamic weakness), and only less so when it is attacked (a static one). Rule: if you want to exploit doubled pawns, first induce the owner to advance them; and put the question to them (attack them with pawns) if they are isolated, compact, or already advancing. Their one real strength is that they hold out well when they stay still. Restraint becomes complete when the opponent has doubled pawns (imprisoned bishops, cramped space).
- (c) The doubled pawns are on the c-file (or equivalent) and the owner can be provoked.
- (d) Stated: you should only create such a complex if you can force the owner to advance, else you gain little (Game 34). **[CHECK]** the strong claim; doubled pawns often come with the bishop pair and open files **[OUTSIDE]**.
- (e) II.ii §1, §1a, §2, §5(c); Games 34, 35.
- (f) Doubled c-pawns after ...Bxc3; the imprisoned g2 bishop in the Bird's opening.
- (g) Treating doubled pawns as an automatic weakness.

**40. Restraint: the mysterious rook move; first restrain, next blockade, lastly destroy**
- (b) Restraint is stopping an enemy pawn break before it happens. The mysterious rook move places a rook on a file that is still closed so that it will be ready if the opponent's own freeing move opens it; the sacrifice of the rook's activity is justified only if the break is real. The sequence against a mobile centre pawn: the passive sawing position (pawns on d6 and f6 against e4), then rook pressure, then make the pawn backward or isolated, then a blockading piece, then win it. His formula: "First restrain, next blockade, lastly destroy!" (II.ii §5a).
- (c) The enemy pawn break is real; the structure allows the set-up.
- (d) He says restraint cannot hold forever against a freeing move whose time has come, and that a mysterious rook move is justified only when the break it deters is real; his jibe at players who ask only for direct attacking activity from their pieces is rhetoric.
- (e) II.ii §3, §5(a); Games 2, 29, 32, 35.
- (f) A rook placed on a still-closed file ahead of an expected break (the opening skeleton in Diagram CXXXIX, Game 32); Capablanca's rook manoeuvre to the h-file in Kupchik–Capablanca.
- (g) Putting a rook on a closed file without a reason.

**41. Majorities and the restraint of a qualitative majority**
- (b) The germ cell of restraint: against a majority, neutralize its plus by an open file plus a double blockade possibility. A qualitative majority (the majority more advanced toward the enemy base) is the one to restrain; a central majority must not be allowed to advance far.
- (c) As described.
- (d) None stated.
- (e) II.ii §4, §5(b); Game 35.
- (f) A two-against-one pawn majority in the centre or on a wing, with blockade squares in front of it (II.ii §4; the Van Vliet–Nimzowitsch ending).
- (g) Counting majorities rather than looking at their advancement.

**42. The isolated queen's pawn (isolani)**
- (b) Strength: it gives space, supports outposts on e5 and c5, and aids attack on the king. Weakness: in the endgame it needs protection, the squares around it (d5 in particular) become the enemy's blockading and entry point, and the pawn complex is no longer compact. Build solidly first (the bishop on e3 belongs to d4 as a nurse to a child), attack only when the enemy has withdrawn his king-side pieces. Siege of an isolani: do not cage it completely; let it keep an illusion of freedom. The weakness of the isolani can transfer to the queenside pawns (reflex weakness).
- (c) The player with the isolani has pieces on and a king-side target; the opponent's pieces are not yet traded.
- (d) The pros and cons weigh differently by phase (stated). **[OUTSIDE]** Modern analysis rates IQP positions as dynamically about balanced; the endgame minus is real but not decisive. **[CHECK]** every example.
- (e) II.iii §§1 to 6; Games 11, 36, 39.
- (f) Queen's Gambit isolani after exchange; Rubinstein–Lasker (a queenside reflex weakness); Lasker–Tarrasch (letting the isolani appear free).
- (g) Treating the IQP as a plain weakness or as a plain strength.

**43. The isolated pawn couple and hanging pawns**
- (b) A pair of pawns on the c3 and d4 squares that are blockaded is passive (the isolated pair); the owner must work to make c4 possible. The mobile pair c4 and d4 (hanging pawns) are better because they threaten. He derives them from the isolani as a family tree. Hanging pawns carry a static weakness and dynamic strength both masked. Advance them into a blockaded position only if the blockading ring itself can be attacked or if the blockaders are unfit; otherwise stay in the air (unprotected but mobile) and liquidate at the right moment. Never accept dead, blockaded security.
- (c) As described.
- (d) Players tend to liquidate a move or two too soon (his observation).
- (e) II.iii §7, §8; Games 36, 37.
- (f) Queen's Gambit structures: Rubinstein–Nimzowitsch (Carlsbad 1907), Cohn–Duras, Bernstein–Teichmann, Nimzowitsch–Tartakower (Copenhagen 1923).
- (g) Choosing safety over activity.

**44. The two bishops**
- (b) The bishop pair is a *weapon*, neither an element nor a strategic device in his scheme. A bishop is long-striding but cannot defend squares of the other colour; the pair neutralizes that. Typical uses: Horrwitz bishops on adjacent diagonals; bishops that support an advancing pawn mass and hem in the enemy knights; bishops in endgames. They are weak in closed positions and against an unassailable, centrally posted knight. The aim is to convert a weapon-class advantage into a genuine strategic one (an aggressive versus a passive position).
- (c) Open or semi-open lines; enemy knights without stations.
- (d) Stated clearly.
- (e) II.iv; Games 15, 38, 41, 47.
- (f) Richter–Tarrasch; Michel–Tartakower.
- (g) Valuing the pair in closed positions.

**45. Which weak pawns to shed**
- (b) Sometimes a pawn complex has one weak pawn and the right plan is to trade it off. Decide whether the weakness is obvious now or will only appear after an advance, and plan accordingly.
- (c) As described.
- (d) Left to the individual case (stated).
- (e) II.v §2 (Nimzowitsch–Jacobsen, 1923; Tarrasch–Barthmann).
- (f) A rook ending in which the loose h-pawn is cast out before it can be attacked; a king-side pawn storm that leaves a lasting weakness.
- (g) None particular.

**46. Manoeuvring against weaknesses: pivot, terrain, two weaknesses**
- (b) Manoeuvring is purposeful when (i) there is a weakness you can attack in at least two different ways, (ii) your forces have more room to move than the defender's, (iii) there is a pivot (a fortified square or line) through which every piece passes in turn. Against two weaknesses on opposite wings: attack one, force the opponent's other wing to deploy, and the latent weakness there becomes real. The king itself may be the weakness (a hunt across a line).
- (c) As described.
- (d) Stated: a variety of targets can partly offset a lack of variety of threats (Lasker–Salwe).
- (e) II.vi; Games 40 to 45.
- (f) Rubinstein–Selesnieff; Kalaschnikow–Nimzowitsch; Lasker–Salwe.
- (g) Aimless shuffling.

**47. Pawn sacrifice for blockade; the roller is overrated**
- (b) Headings and notes to Games 48 to 50 introduce: (i) a pawn sacrifice made with no attack in mind, only to keep a key square so that a blockade can be set up (Games 49, 50; he links it to a similar idea in draughts); (ii) the thesis, claimed as first stated in Game 48, that a pawn roller is relatively harmless (the notes I read for that game concern play against hanging pawns and are not fully explicit on the roller point).
- (c) Only as the annotations state.
- (d) **[CHECK]** all three games' verdicts; he presents them as historical priority claims.
- (e) Games 48, 49, 50 and their notes.
- (f) The French Defence advance structure with a pawn sacrificed (Games 49, 50, including his queen-to-g4 innovation).
- (g) Treating a positional sacrifice as sound without checking; it may be only practical.

---

## 5. Claims that are dated, absolute, or contestable

Each item marked [CHECK] needs engine or tablebase verification before learner use.

1. **Priority claims.** He claims discovery of open-file outposts, over-protection, restraint, the blockade concept and the five special cases (translator's preface, I.ii §1, II.i §3). These are his claims and I am not asserting them. **[OUTSIDE]** Several ideas have predecessors (Steinitz, Tarrasch, Lasker; he credits Steinitz in II.i §7 and cites Krause on one opening idea).
2. **Numerical figures that are rhetoric.** Examples: combined play is 80% of endgame technique; the ...f5 break is right in 80% of cases by the old school and 60% by his; 90% of closed central positions can open at any moment. None is supported by data. Do not carry these figures into learner text.
3. **An exchange that fits none of his listed motives is bad** (I.v and I.i §5). Overstated: modern play also exchanges for structure, for the bishop pair, to remove attackers when defending, and to reach a favourable endgame. **[CHECK]**
4. **Pawn grabbing and gambits** (I.i §7, §7a). The blanket warning and the take-a-centre-pawn exception are both heuristics; many early pawn grabs are fine, many centre-pawn captures lose. Also his advice to decline the King's Gambit as a beginner and treat acceptance as a test of the centre is dated. **[CHECK]**
5. **Flank pawn moves lose time** (I.i §2). Contradicted by his own fianchetto openings (Games 7, 8, 18, 25, 34); true only as an open-game tempo observation. **[CHECK]**
6. **Opposition declared superseded** (I.iv §5). The king-outflanking pattern is sound, but opposition and key squares remain core, simpler teaching. Do not follow him on dropping it. Tablebase every position. **[CHECK]**
7. **Seventh rank absolute with an advanced passed pawn wins almost always** (I.iii §3), and the strength of a rook on the seventh generally. True only in specific configurations; rook endings are full of drawn seventh-rank positions. **[CHECK]**
8. **The central player always has better prospects; flank attacks fail against a centre file** (II.i §6). Counterexamples are common (opposite-side pawn storms, pawn attacks on a king with a stable centre). **[CHECK]**
9. **Blockade is obligatory** (I.iv §2). His three reasons are persuasive for dangerous central passers with weak blockades; as a rule it overreaches. A far-advanced passer may be better watched; a blockader can be overloaded. **[CHECK]**
10. **A passive rook should be sacrificed for pawns rather than tie it down** (I.vi §2). Often right; sometimes the passive rook is the only way to draw. **[CHECK]**
11. **Over-protection** (II.i §3, II.v). The claim that pieces gain strength by contact with the protected point is a heuristic; the examples are won games by a strong player, so survivor bias is likely. The method can become passive defence if misapplied. **[OUTSIDE]** Treat it as a conditional device, not a law.
12. **Doubled pawns** (II.ii). The thesis that they are weak chiefly when they advance is neat, but modern analysis treats them as a package (bishop pair, open files, centre). His own Games 34 and 35 are built on provoking or accepting doubled pawns, which shows how much depends on the whole position. **[CHECK]**
13. **Isolani and hanging pawns** (II.iii). Broadly consistent with modern teaching, but modern engines rate many isolated-pawn positions as about equal; avoiding dead blockaded security is advice, not a theorem. **[CHECK]**
14. **Pawn-chain claims** (I.ix). The statement that freeing operations against a chain cannot begin too early is too absolute; the French advance chain assessments (attack the base with ...c5) are mainstream, but timing and piece placement can change the answer. **[CHECK]**
15. **Opening verdicts** that are dated: the Hanham set-up, his own sidelines (Nimzowitsch Defence, the ...Nf6 Sicilian, the 1.c4 e5 2.Nc3 Nf6 3.Nf3 Nc6 4.e4 system, the queen sortie in the French advance). They remain playable sidelines but not main lines. **[OUTSIDE]** **[CHECK]**
16. **Every win or draw verdict in the examples** and every analytical note in the 50 games. The book's own errata show errors. Engine-verify before using any position.
17. **The book is partisan history.** The older Tarrasch school is caricatured; contemporary masters are used as foils. Do not import the polemic into learner text.

---

## 6. Teaching method observed

- **Defined terms first, then conditions.** Almost every chapter opens with a definition and a skeleton position in prose, then the rule, then the exceptions.
- **Why before what.** He explicitly rejects the bare rule that passed pawns must be stopped as shallow and insists on a derived reason (the three reasons for blockade). This is the heart of the book and matches our reasons-first design.
- **Metaphor as mnemonic.** Courtroom (criminal, prison), military (frontier, storm troops), domestic (nurse, shepherd), commerce (liquidation). Memorable, but the metaphors sometimes carry unargued claims (a passed pawn is said to want to expand). Use sparingly in our text; keep the conditions.
- **Contrast pairs built in.** He frequently shows the same structure with one feature moved: pawn on e4 versus e3 for the outpost; enemy king on g3 versus elsewhere for the seventh rank; development done versus not for the freeing move; centre closed versus openable for the unpinning question. These are exactly the one-feature contrasts of CD-4.
- **Examples mostly from his own games**, annotated with remarks on what the student should take from them, and with directions to play through a given game at a given point. Some diagrams carry a question caption (for example: which point must be over-protected?). The student is told to practise: play both sides of a structure (a Queen's Gambit isolani from both colours), analyse a given opening for restraint, set up a chain with pawns and play out the endgame.
- **Layering.** The centre is treated twice on purpose: a simple version for the less experienced (I.i), and a higher-level version later (II.i). The elements are explicitly an introduction to position play.
- **Errors displayed.** Many annotations show the opponent's typical mistake and say which principle it violates (an amateur pawn grab; an unprovoked flank attack). Useful as failing look-alikes.
- **Dogmatism as pedagogy.** Absolutes (never, always, obligatory) are used to make the rule stick; the exceptions, where given, are tucked inside the examples. In our materials the exceptions must be promoted to first-class content (CD-4).
- **Evidence style.** Assertion plus selected master games; no systematic counterexamples. His proofs are logical deductions from stated principles, such as the argument in the Rubinstein–Duras note that one weakness implies another by consistency of the plan. Not a proof in the engine sense.

---

## 7. Mapping to our nodes

Node IDs from `curriculum-map-v1.md` unless marked NEW. Tier and depth are G0 suggestions only. "NEW" IDs follow the `AAA.NAME` style and have not been enumerated.

| Idea (section 4 number) | Node ID(s) | Suggested tier / depth | Note |
|---|---|---|---|
| 1 Development is collective; tempi | `OPN.PRINCIPLES`; NEW `OPN.TEMPO` | T1 D1 to D2; T2 D2 to D3 | Tempo-gaining captures as a contrast family; avoid mechanical tempo counting. |
| 2 Pawn moves in opening | `OPN.PRINCIPLES`; `POS.EXCEPTIONS` | T1 D1; T3 D3 | Teach the default, then the closed-game and fianchetto exceptions. |
| 3 Exchange for tempo; liquidation | `POS.EXCHANGE`; `OPN.DEVIATION` | T3 D1 to D3 | Do not teach the two-motives limit as stated. |
| 4 Mobile centre pawn: kill or restrain | NEW `POS.CENTER.MOBILE`; `POS.BREAKS` | T4 D1 to D3 | Needs engine-verified examples. |
| 5 Pawn hunting; centre-pawn exception | `OPN.PRINCIPLES` | T1 D1; contrast family T2 to T3 D3 | Strong candidate for "works / fails / irrelevant". |
| 6 Open file | `POS.OPENFILE` | T2 D0 to D2 | Teach entry squares, not *occupy the file*. |
| 7 Aim: seventh/eighth rank; raids | `POS.SEVENTH`; `TAC.BACKRANK`; `TAC.FORK` | T2 D1 to D2 | |
| 8 Obstructions; evolutionary vs revolutionary | `POS.OPENFILE` (advanced); `POS.BREAKS`; `TAC.REMOVE-DEFENDER`; `SAC.TYPES` | T3 D3; T4 D3 | Lever vs batter vs sacrifice is a clean three-way choice. |
| 9 Restricted advance | NEW `POS.OPENFILE.SWITCH` (or fold into `POS.OPENFILE`) | T3 to T4 D2 | |
| 10 Outpost | `POS.OUTPOST` | T3 D1 to D3 | Core contrast family. |
| 11 Zugzwang | NEW `END.ZUGZWANG` | T3 D1; T4 D3 | Tablebase backed. |
| 12 One objective; attack from behind | `POS.SEVENTH` | T2 D2 | |
| 13 Five special cases | `POS.SEVENTH`; `TAC.PERPETUAL`; `END.ROOK-ACTIVE` | T4 D3 | Needs [CHECK] for all skeletons. |
| 14 Majority and candidate | NEW `POS.MAJORITY`; `POS.PASSED` | T3 D1 to D3 | Tablebase on pawn endings. |
| 15 Blockade is obligatory | NEW `POS.BLOCKADE`; `POS.PASSED` | T3 D1 to D3 | Teach as a default, not a duty. |
| 16 Blockader quality; elasticity | `POS.BLOCKADE`; `POS.GOODBAD` | T4 D3 | |
| 17 Replace or uproot the blockader | `POS.BLOCKADE`; `POS.EXCHANGE` | T5 D3 | |
| 18 King vs isolated pawn | `END.KEYSQ`; `END.OPPOSITION`; `END.TRIANGULATION` | T3; T5 D3 | Present as an alternative lens; teach opposition first. |
| 19 Privileged passers; hole-stopping | `POS.PASSED`; `END.OUTSIDE-PASSER` | T3 to T4 D2 to D3 | |
| 20 When a passer advances | `POS.PASSED` | T4 D3 | |
| 21 Motives for exchanging | `POS.EXCHANGE` | T3 D1 to D3 | |
| 22 King and piece centralization | NEW `END.KING-ACTIVE`; `POS.ACTIVITY` | T2 D1 to D2 | Maps to the endgame spine (CD-6). |
| 23 Shelter and bridge-building | `END.LUCENA` | T4 D3 | [CHECK] that it matches the standard position. |
| 24 Aggressive vs passive piece; rook behind passer | `END.ROOK-ACTIVE`; `POS.ACTIVITY` | T2 D1; T4 D3 | Tablebase exceptions required. |
| 25 Rally and advance; file in endgame | `POS.PASSED`; `END.KING-ACTIVE` | T4 D2 | |
| 26 Pin anatomy and exploitation | `TAC.PIN` | T1 to T2 D1 to D2 | |
| 27 Exchange on the pinning square | `TAC.PIN`; `TAC.REMOVE-DEFENDER` | T3 D3 | |
| 28 Unpinning; the question; tolerate pins | `TAC.PIN`; NEW `POS.PIN.STRATEGIC` | T4 D3 | Opening-linked. |
| 29 Discovered check; double check | `TAC.DISCOVER`; `TAC.DOUBLE-CHECK` | T1 to T2 D1; T3 D3 (see-saw) | |
| 30 Pawn chain: base | NEW `POS.STRUCTURE.CHAIN`; `OPN.STRUCT.*` | T4 D1 to D3 | |
| 31 Chain as blockade; siege; transfer | `POS.STRUCTURE.CHAIN`; `POS.BREAKS`; `POS.TRANSFORM` | T5 D3 | |
| 32 Two misconceptions (always do something; small advantages) | `LOOP.V3`; `POS.PROPHYLAXIS` | T3 D1 | Candidates include quiet moves. |
| 33 Prophylaxis (outer, inner) | `POS.PROPHYLAXIS` | T5 D1 to D3 | His scope is narrower than the node's. |
| 34 Over-protection | NEW `POS.OVERPROTECT` | T5 D3 | Conditions-heavy. |
| 35 True vs illusory freeing moves | NEW `POS.FREEING`; `POS.BREAKS` | T5 D3 | |
| 36 Collective mobility of pawn mass | `POS.SPACE`; `POS.BREAKS` | T4 D2 | |
| 37 Watch the centre; flank attacks | NEW `POS.CENTER.CONTROL`; `ATK.PAWNSTORM` | T3 to T4 D3 | |
| 38 Centre = squares | `POS.CENTER.CONTROL`; `POS.EXCEPTIONS` | T3 D1; T5 D3 | |
| 39 Doubled pawns | `POS.PAWNWEAK`; NEW `POS.STRUCTURE.DOUBLED` | T3; T4 to T5 D3 | |
| 40 Restraint; mysterious rook move | NEW `POS.RESTRAINT`; `POS.PROPHYLAXIS` | T4 to T5 D1 to D3 | |
| 41 Majorities; qualitative majority | `POS.RESTRAINT`; `POS.MAJORITY` | T5 D3 | |
| 42 Isolated queen's pawn | NEW `POS.STRUCTURE.IQP`; `POS.PAWNWEAK` | T4 D1 to D3 | |
| 43 Isolated pair; hanging pawns | NEW `POS.STRUCTURE.HANGING` | T4 to T5 D3 | |
| 44 Two bishops | `POS.BISHOPS` | T3 D1 to D3 | |
| 45 Which weak pawns to shed | `POS.PAWNWEAK`; `POS.TRANSFORM` | T5 D3 | |
| 46 Manoeuvring against weaknesses | `POS.TWOWEAK`; NEW `POS.MANEUVER` | T5 to T6 D3 | |
| 47 Sacrifice for blockade; roller | `SAC.TYPES`; `POS.DYNAMIC` | T5 to T6 | Label "practical, not sound" until verified. |

---

## 8. Candidate exercise & contrast-family ideas

Cue levels as defined at the top. For contrast families: **W** = working case, **F** = failing look-alike, **I** = irrelevant case. No FENs are given; every position needs to be built and engine-verified.

1. **Tempo-gaining capture (idea 1, 3).** Opening-stage positions. Learner picks between a capture that gains a tempo and a quiet retreat. Cue 2 to 3. **W:** capture forces a recapture that loses time. **F:** capture that lets the recapture develop a piece. **I:** no capture available.
2. **Pawn grab versus development (idea 5).** Learner decides whether to take. Cue 2 to 3. **W:** wing pawn is poisoned because development lags. **F:** same pawn is safe because the pieces are developed. **I:** a centre pawn that really should be taken.
3. **Kill or restrain the centre pawn (idea 4).** Learner chooses a break or a set-up. Cue 3. **W:** a prepared break kills the pawn. **F:** the break is premature. **I:** no mobile centre pawn.
4. **Open file objective (idea 6, 7).** Learner names the target and the entry square, not just the file. Cue 2 to 3. **W:** a file with an entry square. **F:** file with entry squares covered by minor pieces. **I:** closed file that will not open.
5. **Granite or soft obstruction (idea 8).** Learner chooses: pile up attackers, lever, or sacrifice. Cue 3. **W:** unprotected obstruction (siege). **F:** pawn-protected obstruction (battering fails; lever needed). **I:** no obstruction.
6. **Outpost conditions (idea 10).** Learner places a knight. Cue 1 to 3. **W:** protected, open file behind. **F:** the supporting pawn on the wrong square (his e4 versus e3 pair). **I:** closed file.
7. **Rook behind the passed pawn (idea 24).** Cue 1 to 3. **W:** rook behind its own passer. **F:** passive defence that is the only draw. **I:** no passer. Tablebase-backed.
8. **Seventh rank absolute (idea 13).** Cue 2 to 3. **W:** king cut off. **F:** king can step out. **I:** rook on the seventh with nothing to attack.
9. **Choose the blockader (idea 15, 16).** Learner picks which piece to put in front of the pawn. Cue 2 to 3. **W:** knight with support. **F:** queen or king that is exposed to attack. **I:** passer already harmless.
10. **Replace the blockader (idea 17).** Cue 3. **W:** the exchange puts a weaker blockader in. **F:** the replacement is stronger. **I:** no blockade.
11. **Majority move order (idea 14).** Learner picks which pawn goes first. Cue 2 to 3. **W:** the candidate. **F:** the middle pawn. **I:** equal pawn counts. Tablebase.
12. **Endgame king timing (idea 22).** Learner decides to centralize or not. Cue 3 to 4. **W:** queens off, no checks. **F:** a bishop check or mating threat still on. **I:** king safe, no activity gain.
13. **Pin: is it real? (idea 26).** Learner finds a capture on a square that only a pinned piece appears to defend. Cue 2 to 3. **W:** genuine pin. **F:** half-pin or pin against a non-king where recapture works. **I:** no pin.
14. **The question (idea 28).** Learner decides whether to ask the bishop. Cue 3. **W:** the centre is fixed and the bishop goes to a desert. **F:** the centre can open, so the bishop revives. **I:** no pin.
15. **True or illusory freeing move (idea 35).** One-feature change in development. Cue 3. **W:** the pieces are developed. **F:** the pieces are not. **I:** no break available.
16. **Attack the chain (idea 30).** Learner picks the lever. Cue 2 to 3. **W:** attack on the base. **F:** attack on the head. **I:** no chain.
17. **Isolated pawn: which plan? (idea 42).** Learner states the plan for each side. Cue 3. **W:** pieces on, attacking chances. **F:** pieces traded. **I:** no isolani.
18. **Hanging pawns (idea 43).** Learner chooses: hold, advance, or liquidate. Cue 3. **W:** advance when the blockade ring can be attacked. **F:** advance against an ideal blockader. **I:** pawns not hanging.
19. **Over-protect or not (idea 34).** Learner chooses the placement. Cue 3. **W:** a strong point that will come under pressure. **F:** a weak pawn, which makes the pieces passive. **I:** no pressure on the point.
20. **Flank attack with an open centre file (idea 37).** Learner chooses wing or centre. Cue 3. **W:** the open file wins. **F:** the centre is closed and the wing attack works. **I:** both wings closed.

---

## 9. Agreements and tensions with the other sources in this batch and with modern teaching

**I have not re-read the other four books in this session. These notes rest on what I know of them [OUTSIDE] and are at best moderate confidence.**

- **Capablanca, *Chess Fundamentals* [OUTSIDE].** Agreement: development and tempo, king activity in the endgame, rooks on open files and the seventh, rook behind the passed pawn (I believe he also gives this). Tension: Capablanca is plain and rule-light and teaches the opposition; Nimzowitsch builds a system and calls the opposition obscure. For our curriculum Capablanca-style explanation economy is better for T1 to T2 and Nimzowitsch is better for conditions at T3 to T5. The publisher's back pages here advertise *Chess Fundamentals* **[READ]**.
- **Em. Lasker, *Common Sense in Chess* [OUTSIDE].** Nimzowitsch quotes Lasker for the opening pawn-move limit (I.i §2) and for the remark that a player who is not strong in the centre should not try a wing operation (II.i §7) **[READ]**. He also classes Lasker among the moderns (II.iii §6) **[READ]**. As far as I recall, Lasker's book is more general and psychological, and Nimzowitsch more structural **[OUTSIDE, moderate confidence]**.
- **Znosko-Borovsky, *The Middle Game in Chess* [OUTSIDE, low confidence].** I do not know its detail well enough to compare. He appears in this book as Nimzowitsch's opponent (Games 3 and 37) **[READ]**, and the publisher advertises the book **[READ]**.
- **Ed. Lasker, *Chess Strategy* [OUTSIDE, low confidence].** I believe it covers pawn structure and exchanges in a more catalogue style, but I have not verified. Leave blank until read.
- **Modern teaching [OUTSIDE].**
  - **Agreement.** Weak squares and outposts; blockading passed pawns (his blockade concept is mainstream); rook behind the passed pawn; active versus passive pieces; king activity; the importance of the pawn structure; the pin as a strategic factor; the idea that pawns are not the only way to control the centre (hypermodern, absorbed).
  - **Tension.** Watson's *Secrets of Modern Chess Strategy* reassesses these ideas as conditional rather than rules; Silman's imbalances list covers the same ground differently (a checklist, not a system); Dvoretsky's prophylactic thinking asks what the opponent wants to do next, which is broader than Nimzowitsch's outer and inner forms. So `POS.PROPHYLAXIS` should not be defined as his two forms; keep them as sub-ideas. Doubled pawns and the bishop pair are valued more positively in modern play than his thesis suggests. Engines are generous to dynamic play that he would call premature.
  - **Our curriculum map.** It lists Nimzowitsch for "prophylaxis, blockade, over-protection, restraint, open file, seventh rank". The book's main thesis is that positional play *is* prophylaxis (II.i §3), but prophylaxis there has the two narrow forms above; blockade and restraint are the better-developed teaching ideas.

---

## 10. Open questions

1. **Diagrams.** Without them, a number of positions cannot be rebuilt reliably. Should we obtain a diagram-bearing copy (library scan) or rebuild positions from the prose and engine-check them?
2. **How much of the translator's text is original to the German?** The English edition adds games and omits passages. Is there a copy of *Mein System* in German or a later English edition to cross-check?
3. **Opposition.** Do we adopt his tripartite king manoeuvre as an extra lens, or leave it out? Tablebase-check each skeleton position first.
4. **Prophylaxis scope.** Should the node `POS.PROPHYLAXIS` define itself through Dvoretsky/Karpov-style prophylactic thinking and treat Nimzowitsch's outer and inner forms as sub-ideas? I think yes.
5. **Over-protection.** Is it a node at T5, or only a sub-case of prophylaxis and outposts? The conditions are heavy and the claims contestable.
6. **Which of his examples can be used?** The moves are facts and may be used; the annotations are not to be copied. Choose positions from his games and engine-verify them.
7. **Terminology for learners.** His coinages (isolani, hanging pawns) are standard now; others (the mysterious rook move, the sawing position, Horrwitz bishops) are not. Which do we keep?
8. **Priority and polemic.** Do we mention history (Tarrasch versus Nimzowitsch) at all? Probably only in teacher notes.
9. **Numerical claims** (80%, 60%, 90%). Drop them, or attempt to test them with engine statistics? I recommend dropping.
10. **Descriptive notation.** All the examples need conversion to algebraic and re-checking; the OCR damage in the notation is the main risk. Who does the conversion and the check?
11. **Hanging pawns and the isolani.** Engine evaluation of the structures his games use is not in my knowledge; ask the engine-check step to produce a table.
12. **Rights record.** Record the renewal check for the 1930 US copyright, if the policy requires one, and the date of the Internet Archive scan.
