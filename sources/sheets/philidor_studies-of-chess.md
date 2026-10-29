# Synthesis sheet: F. D. Philidor, *Studies of Chess* (London: Bagster, 1803, ed. P. Pratt)

Labels: [R] recalled from the text I read; [I] my inference; [V] checked here with Stockfish 19 lite (`tools/engine.py`, 1 thread, depth 22-30, no tablebase, positions transcribed by me from the book's square names, so a transcription slip is possible). Book claims are the author's or editor's views, not facts. Wording is mine; no passages are quoted. Line numbers are not given; the source is `library/files/pg78804.txt` (Gutenberg #78804).

## 1. Scope and edition

- This is a two-volume English edition of Philidor's *Analysis of Chess* with a long beginner's introduction, two "essays" of annotated practice games, an appendix, and Jones's poem *Caissa*. The introduction, the maxims, the first and second essays, the scale of powers and the appendix are the editor's work, not Philidor's. The editor says he rewrote or retouched almost all the notes [R]. So "Philidor says" is safe only for the *Analysis* proper (his own games, three gambits, Cunningham and Salvio gambits, Queen's Gambit, six regular parties, endings, blindfold games) [R], and even there the notes were reworded.
- Pre-modern conventions: pawns "move two squares", castling puts the king on the knight's square or two squares (varies by side), a pawn may promote to any piece, and in the English code the player who is stalemated *wins* [R].
- Evidence: Gutenberg ebook, 1803 text, public domain in the US. Philidor's opening verdicts predate any theory work; treat them as historical.

## 2. What the book teaches, in order

1. Board, piece powers, check, "stale" (the editor argues the stalemated side should win), promotion [R].
2. General maxims (32 numbered): develop with the king's pawn, keep pawns together and supported, don't move pawns in front of your castled king, castle on the side away from the opponent's pawn advance and attack with pawns against an opposite-wing king, avoid pointless checks, offer exchanges when defending, keep an adverse pawn that sits in front of your king, beware pawn and knight forks, king active in the ending [R].
3. Progressive examples (two essays), the Scholar's mate, a game of "involved combinations", a scale of piece powers [R, skimmed].
4. Philidor's own four games with back games (alternate lines), three Philidor gambits (king's-pawn gambit lines with ...g5), Cunningham gambit, Queen's Gambit ("Aleppo"), six regular parties, Salvio gambit, supplements [R].
5. Practical endings and mates: R+B vs R, B+N mate, R+P vs B, R vs R+P, Q vs R, Q vs R+P, R+P vs R, Q+P vs Q, Q vs pawn on the seventh, lone-king-versus-pawn, N vs pawn, two pawns vs one, two separated vs two united; a closing list of results by material [R].
6. Laws, appendix on disputed rules (promotion, two-square pawn move, castling), three blindfold matches [R, partly].

## 3. Ideas with conditions and exceptions

**P1. Pawn centre first, supported by the other pawns.** Play e4, then d4 (supported by c3) to get two pawns side by side; do not hurry either forward; if one is attacked, advance it rather than let it be exchanged and separated [R]. Condition: pieces developed behind them. Exception he states: take the opposing pawn with the king in a queenless ending [R]. Author's view; see section 7.

**P2. Keep pawns united; join the smaller group to the larger when you can choose which pawn recaptures.** When you have two groups and an exchange lets one pawn pass from one group to the other, move it to the larger one [R]. Also: avoid recapturing in a way that leaves your pawns separated, avoid trading your own e-pawn for the f-pawn or d-pawn for the c-pawn (the royal pawns hold the centre) [R].

**P3. Doubled pawns are not a defect when neighbours support them.** Doubling matters mostly when no pawn stands on an adjoining file [R]. Condition: the recapture gives an open file or development.

**P4. Pawn advance too far is a liability.** One or two pawns pushed far forward can be treated as lost unless pieces can cover them or other pawns can replace them; two pawns abreast on the fourth rank beat the same pair on the sixth [R]. A lone pawn that crosses into the enemy half and cannot be supported falls [R]. Also, do not push wing (knight/rook) pawns casually since that opens a file for the enemy rook [R].

**P5. Attack separated pawns.** Hitting a pawn cut off from its group is worth doing even just to tie down enemy pieces [R]. Between equal pawn groups, whoever first breaks the other's larger group on that wing tends to win [R].

**P6. Bishop colour and your own pawns.** When attacking with advanced pawns, place them on the colour opposite your bishop so the bishop can guard the gaps between them; when defending, put the pawns on your bishop's colour [R]. Related: when you have advanced pawns, open hostility against the enemy bishops, which can block and attack them best [R].

**P7. Pawn advance against a castled king.** Castle away from where the opponent will attack; the pawns on your castled side stay home; if kings castle on opposite wings, push your pawns on his king, backed by queen and rook; if same wing, attack with pieces only [R]. Don't show which wing you will push until his king has castled [R].

**P8. Pawn endings.** Whoever has the opposition (king in front, facing) holds the pawn; a king in front of its own pawn can win; two pawns beat one almost always but the stronger side must avoid trading a pawn for the lone pawn; rook-pawn plus wrong-coloured bishop is the one piece-plus-pawn exception to "pawn plus any piece wins" [R]. Move (tempo) decides most pawn endings; the book repeatedly shows the same position won or drawn depending on who moves [R].

## 4. Examples listed

- Philidor's first party: 1.e4 e5 2.Bc4 Bc5 3.c3 Nf6 4.d4 exd4 5.cxd4 Bb6 6.Nc3 O-O ... with advance of f-pawn, queen exchange and a won pawn ending [R].
- Second party: 1.e4 e5 2.Bc4 c6 3.d4 exd4 4.Qxd4 d6 5.f4 Be6 ... [R].
- First gambit: 1.e4 e5 2.f4 exf4 3.Nf3 g5 4.Bc4 Bg7 (white tries 4.h4 first in a back game) 5.h4 h6 6.d4 d6 7.c3 [R]. Second gambit: 3.Bc4 Qh4+ 4.Kf1 g5 [R]. Third gambit: 2.f4 d5 3.exd5 Qxd5 4.fxe5 Qxe5+ 5.Be2 [R].
- Cunningham: 1.e4 e5 2.f4 exf4 3.Nf3 Be7 4.Bc4 Bh4+ 5.g3 fxg3 6.O-O [R]. Queen's Gambit: 1.d4 d5 2.c4 dxc4 3.e4 e5 4.d5 f5 5.Nc3 Nf6 [R].
- Regular parties 1-3: 1.e4 e5 2.Bc4 Bc5 3.c3 Qe7 4.Nf3 Nf6 5.Qe2 d6, and 2...Nf6 and 2...c6 variants [R].
- Endings as positions (squares in the book's own terms; I converted): R+B v R mating net (Ke6 Be5 Rc1 v Ke8 Rd7); N v a3 pawn drawn by repeated knight checks (Kh2 Na2 v Kb3 pa3); Q v f2 pawn with Kg1, Q+K far away (Kc4 Qe2); two v one pawn with Ke4 f4 g5 v Ke6 g6; R+P v R third-rank defence (Kf5 e4 Rh7 v Ke8 Ra6) [R].

## 5. Mapping to skill node ids

- OPN.PRINCIPLES, OPN.TEMPO, POS.CENTER.CONTROL, POS.CENTER.MOBILE, ATK.CENTER: P1, the maxims on queen and rook timing [R, I].
- POS.STRUCTURE.CHAIN, POS.STRUCTURE.DOUBLED, POS.PAWNWEAK, POS.PAWNMOVE, POS.TARGET, POS.TWOWEAK: P2-P5.
- ATK.PAWNSTORM, ATK.CASTLED, DEF.SHELTER: P7. POS.BISHOPS: P6.
- END.OPPOSITION, END.SQUARE, END.PAWN-TEMPO, END.ROOK-PAWN, END.WRONG-BISHOP, END.PHILIDOR (the R+P v R third-rank defence appears here in embryo), END.QUEEN-PAWN, END.THEORY.QvR, END.MATE-BN, END.MATE-2B, END.THEORY.2N, END.MINOR, END.TRANSITION: P8 and the endings list.
- FND.STALEMATE, FND.ENPASSANT, FND.PROMOTE, FND.CASTLE, FND.VALUE, GAME.HISTORY: rules, laws, scale of powers.
- TAC.STALEMATE-TRICK: the "get stalemated to win" maxim, only as history.

## 6. Gaps the graph has and the book fills

[I] The graph has no node for *which pawn should recapture to keep groups united* (P2 is only implicit in POS.MAJORITY and POS.STRUCTURE.CHAIN). It also has no node for *placing pawns on the colour opposite (attack) or the same as (defence) your bishop* (P6; I did not search other books for this). A short "recapture choice" micro-skill could sit under POS.PAWNMOVE. The book fills nothing on rook activity, outposts, minority attacks, or plan selection; it is thin on strategy beyond pawn advice [I].

## 7. Outdated or doubtful claims, with checks

- **"Keep the centre pawns on d4/e4 and avoid trading them" (P1)**: modern theory accepts Black's challenge with ...d5 or ...c5 in many lines, and holds that a pawn centre can be a target (hypermodern). Author's view, partly outdated [I]. In the Queen's Gambit line, 4.d5 after 3...e5 is a sound idea [V +0.28 for White at depth 22 after 4...f5]; 4.dxe5 instead gives about +0.37 [V]; so both fine, not "only move".
- **Opening verdicts**: Philidor's gambit 5.h4 h6 6.d4 d6: Black is slightly better, about -0.4 to -0.6 [V], so the book's claim that White's attack wins is doubtful. Third gambit 4.fxe5 Qxe5+ 5.Be2 is roughly equal [V 0.0], not a clear plus for the "gambit" side. Second gambit 3.Bc4 Qh4+ 4.Kf1 g5 is roughly equal [V +0.08]. Game 1 line 5...Bb6 is +0.7 White, i.e. better for White than the book hints [V]. The line 1.e4 e5 2.Bc4 c6 3.d4 exd4 4.Qxd4 d6 5.f4 is about equal [V]. None of the book's "wins in a few moves" back-game claims were checked, except the mate net below.
- **R+B v R**: the book treats R+B v R as a won ending, and its mating net does work from the arranged position (mate-level score, +6 at depth 28) [V]. Modern theory says R+B v R is a draw with best defence in most positions [R from general knowledge, I]; the book's arranged position is a mating net, not proof the ending is generally won. Unchecked beyond that position.
- **Result list**: R+N v R draw, R v B draw, R v N draw: consistent with modern view [I, unchecked]. "R+B v Q draw" and "Q v R+2P draw" and "R v B+2P draw" are broad generalisations; I did not test them. "Pawn plus any piece wins except rook pawn with a wrong-colour bishop" is *wrong as stated*: K+N+rook-pawn can draw against a defender who reaches the corner, and wrong-bishop is only one drawing pattern [I].
- **Pawn endings**: lone-king v pawn: the move decides [V: 2P v 1P position Ke4 f4 g5 v Ke6 g6 is a draw with White to move at depth 28, White wins (-22) with Black to move; N v pawn position Kh2 Na2 v Kb3 pa3: White draws, Black to move wins, mate 13]. The book's tempo claim is confirmed in these examples. Q v f2 pawn with distant king: 0.00 [V], matching the book's drawn verdict. R+P v R (Philidor defence): 0.00 with either side to move [V], matching the book.
- **Scale of powers** (editor's): second scale gives pawn about 2.2, knight 6.25, bishop 9.75, rook 15, queen 23.75 (arithmetic from the book's fractions; mine). Relative to the pawn this makes bishop 4.4, rook 6.8, queen 10.8: outdated; modern values are about 3, 3, 5, 9 [R, from general knowledge].
- **Rules**: stalemate as a win for the stalemated player, unlimited promotion rule differences, and a "pawn may not move two squares if it passes an adverse pawn" version of en passant are outdated [R: FIDE draw by stalemate; modern en passant is capture-only]. Not tested here beyond common knowledge.
- **"Rooks stay in reserve until the end"** and **"queen not early"** are weaker than modern view (rooks belong on open files; early queen is fine if safe) [I].
- **Bishop is better than knight early because it is not blocked** [R]: positional preference, not a rule [I].

## 8. What I did not read

I did not read the poem *Caissa*, most of the back-game move lists, most of the detail of the two essays (I read their openings and the scale of powers), the Scholar's-mate and combinations sections beyond their first notes, the Salvio gambit, most blindfold games (only their introduction), and most of the supplementary endings beyond headings and the positions above. Notes I read in full: the maxims, the laws, Philidor's first two parties, parts of the third and fourth, first gambit opening notes, the second and third gambits, Cunningham opening, Queen's Gambit main line, regular parties 1-3, observations on endings, and the appendix up to the discussion of castling. Anything in "Examples" beyond these should be re-read before use. Hand-transcribed endgame positions are unvalidated by `tools/validate.py`; run it before any item uses them.
