# Witty_Alien video research notes (auto-caption transcripts)

Written 7 Nov 2026 for the Alien/Martian series. Source: YouTube auto-captions in `sources/raw/witty-alien/` for 20 videos by CM Volen Dyulgerov ("Witty_Alien") or featuring him. Everything is paraphrased in our own words; no transcript text is copied.

## Evidence labels and how far to trust this file
- [V] verified here: titles, upload dates, durations and chapter names come from each video's `info.json`.
- [S-video, auto-caption, unverified]: what he says or plays, as understood from garbled captions. **Every move line is a reconstruction and a claim to validate** with `tools/validate.py`, not content.
- "His claim": a result or statistic stated by him, self-reported, no sample sizes.
- [I] my inference when reconstructing SAN from spoken moves. [H] hypothesis, could not decode.

**Caption hazards (read before re-using any VTT):**
1. Spoken notation is mangled. "Pawn" and "pony" (his word for knight) both come out as "pawn/point", so "pawn F3", "point G5", "pawn D2" are almost always Nf3, Ng5, Nd2. After 4.Nxe4 White has no e-pawn, so a spoken "e5" push is a knight move (Ne5 or Ne5+) [I].
2. Black's "pawn F6" is ...Nf6 in the Caro-Kann videos but ...f6 (a pawn move) in the Elephant Gambit videos [I].
3. Squares are often wrong and long analysis is described by idea, so lines below are partial. Several are marked "garbled".
4. The shouted catchphrase before each sacrifice is a ritual, not part of any line.

## Coverage
- 20 videos covered, all with captions. `8RGI5C_0UBQ` (first Martian video) had failed with a 429 in the bulk run; I retried it once: its `en-orig` captions and `info.json` downloaded, the `en` variant hit another 429 and was not retried (not needed, it duplicates `en-orig`). So **no video lacks a transcript**; only `8RGI5C_0UBQ.en.vtt` is absent.
- Depth: I read the teaching parts of the long videos closely (videos 1-6, 10, 12, 19, 20 and the Martian intro). For the Eric Rosen collab (8), the Elephant speedrun (17) and the Martian arena (7) I read only the start and targeted passages; those notes are thin and say so.
- `YkzrVvXHN7w` is on another creator's channel (host Pietro): Witty teaches for about 20 minutes, then the host plays viewers.

## Per-video notes (chronological)

### 1. The Gambit That Shocked The Chess World - Alien Gambit (`FaQP9wfleu8`)
2023-11-13, 21:59 [V]. Chapters: introduction, nine annotated games (basic, advanced).
- First full explanation, aimed at beginners. Move order: 1.e4 c6 2.d4 d5 3.Nd2 dxe4 4.Nxe4 Nf6 5.Ng5 h6 6.Nxf7 Kxf7 7.Nf3 [S-video, auto-caption, unverified]. He sacrifices only after ...h6.
- Why it works, his version: the king on f7 is stuck, cannot castle, and four diagonals become targets (h5-e8, a2-g8, b1-h7, c1-h6). The h1 rook later swings to the attack.
- Stresses he has lost often as Black against it, so he knows how hard the defence is.
- Trap 1: 7...Bg4? (pinning the queen) 8.Ne5+ (king moves) then Bc4+ and Qd3 ideas with mate on g6 or h7 in about 11 moves [S-video, auto-caption, unverified]. He says ...Bg4 is the most common reply in the database and that players rated 2200 to 2900 have fallen for it (his claim).
- Warning: after 8.Ne5+ Ke8, do not play 9.Bc4? because ...Qa5+ gives Black the better game; just take the bishop on g4. If Black took the queen the point would have been a fork on the king (for example Bf7 style idea) [S-video, auto-caption, unverified].
- Principle: because White is a piece down, trading pieces helps Black; keep pieces on and use the initiative.
- Admits the engine shows a large Black advantage and says practical games differ. His claim.
- Games shown: wins against a 2K opponent with ...Bg4, a time-scramble draw, a grandmaster game where the line was good until an error, and a blitz loss in a Titled Tuesday style event. Results are his own account.
- Fixes the date of the first public Alien video as Nov 2023 [V].

### 2. Mastering The Alien Gambit | Tips & Tricks (`R2k-5jChuLw`)
2023-12-28, 34:21 [V]. Chapters: eleven games (basic/advanced vs GM, FM, IM).
- One month after the first video he claims a roughly 60% score with the gambit since publication. His claim, no sample size.
- States he has beaten GMs, FMs and IMs with it, and some weaker players too (his claim).
- Piece placement: against ...Nbd7 the bishop belongs on d3 (b1-h7 diagonal), because the c4 square is contested by ...Nd5 [S-video, auto-caption, unverified].
- Best-game line (vs a GM, blitz): 7...Nbd7 8.Bd3 e6 9.O-O Bd6 10.Re1 Re8 11.Ne5+; Black takes on e5, then Qh5+, a bishop sacrifice on h6 and a rook swing finish [S-video, auto-caption, unverified, details garbled].
- Time-control advice: blitz and bullet are fine; do not use it in rapid if you are 1800+; it is a surprise weapon. His advice.
- He says that if Black knows exactly what to do, Black should win objectively, but that is hard when a player meets it fresh.
- Mentions a smothered-style queen-sacrifice mate pattern appearing repeatedly (queen to g6/h7 after a bishop move) [S-video, auto-caption, unverified].
- Marks 7...c5 as Black's best engine move and says only prepared players choose it.
- Ends with how community games arrive daily on his Discord channel (not chess content).

### 3. All Alien Gambit Brilliants And Tricks (`W5JEs5UdwFE`)
2024-02-27, 19:38 [V]. Chapters: 7.Bg4, 7.Nbd7, 7.Be6, a queen sacrifice, 7.Bf5, 7.c5 (all are Black's seventh move; "7." is shorthand).
- 7...Bg4: 8.Ne5+ then Bc4+ and Qd3 mates; the opponent thinks pinning is natural. After ...Qa5+ ideas, take the bishop rather than play Bc4. He also mentions that ...Bg4 followed by a king step to h7 loses to Qd3 [S-video, auto-caption, unverified].
- 7...Nbd7 (the solid reply of strong players): 8.Bd3 e6 (or ...b6) 9.O-O Bd6 10.Re1 Re8 11.Ne5+. If Black captures on e5, Qh5+, then Bxh6! and the rook comes via e4 to g4 [S-video, auto-caption, unverified]. Examples against a GM and an IM.
- If Black declines with ...Kg8, he brings the queen towards g3/g6 and still sacrifices on h6.
- 7...Be6 (stops Bc4+): same Bd3/O-O/Re1 setup; if Black pushes ...g5, Bxg5 or Rxe6 sacrifices; after a rook sacrifice, a check on c4 stops the king returning to f7 [S-video, auto-caption, unverified].
- Queen-sacrifice chapter: with the queen on f3/d3 and Black's king on g8/h8, a queen sacrifice on h7 or f-file squares mates after a bishop check. Exact lines not decodable.
- 7...Bf5: bishop heads to e6; he plays Bb5+/Bc4+ at once then g4 to chase the bishop (g4 removes the e6 defender), then sacrifices on g5 and a rook for mate. He calls it very playable but less engine-approved than ...c5 [S-video, auto-caption, unverified].
- 7...c5: he suggests 8.d5, then queen tricks with Bb5+/Bc4 (queen cannot capture on d5 without a fork). A friend recommended 8.d5. [S-video, auto-caption, unverified].
- Closing: risky, not best play objectively, but hard to defend. His claim.

### 4. The Gambit That Shocked France - Alien Gambit Bonjour Variation (`V1-SQEJ0tNM`)
2024-06-24, 18:52 [V]. Chapters: introduction, seven games (including 8.g6, 8.b6, 2.Nc6).
- Same idea against the French: 1.e4 e6 2.d4 d5 3.Nd2 (or Nc3) dxe4 4.Nxe4 Nf6 5.Ng5 h6 6.Nxf7 [S-video, auto-caption, unverified]. He calls it the Bonjour variation.
- His own verdict: worse than the Caro-Kann version, because Black's pawns are on e6/c7-style squares and Black has more options. He says to learn the Caro-Kann version first.
- Stop rule: if Black replies ...c5 against it, he says you should stop playing the French version against that opponent.
- Plan identical to the Caro-Kann: Bd3, O-O, Re1, Ne5+; the c3 option appears for White.
- Typical Black mistake: artificial castling (...Kg8, ...Re8, ...Bd6), then a natural capture on e5, after which Qg4/Qh5 and a bishop sacrifice on h6 win.
- Game chapters named 8.g6, 8.b6 and 2.Nc6 are side branches I could not decode.

### 5. The Gambit That Shocked Mars - Martian Gambit (`8RGI5C_0UBQ`)
2024-07-11, 19:59 [V]. First Martian video; retried and obtained, see Coverage.
- Says he invented it the week before recording (his claim; fits the upload date).
- Move order: 1.e4 c6 2.d4 d5 3.Nd2 dxe4 4.Nxe4 Bf5 5.Ng5 Bg6 6.N1f3 h6 7.Ne6 fxe6 8.Ne5 [S-video, auto-caption, unverified]. White gives a full piece and takes no pawn back.
- Reasons it works (his): (1) Black's kingside pieces cannot develop because of the Ne5 knight; (2) permanent light-square weakness (he calls it the "Martian desert"); (3) White gains tempo with Ne5 attacking the bishop and stays ahead in development.
- Relationship to Alien: Black chooses. After 4...Nf6 5.Ng5 h6 it is Alien; after 4...Bf5 5.Ng5 Bg6 6.N1f3 h6 it is Martian. If Black plays 4...Bf5 and White follows with Ng5 and then ...Nf6 or an early ...h6, lines transpose into Alien. He says Martian does not replace Alien; it exists because players avoided Alien by playing 4...Bf5.
- Main reply 8...Bf7 (almost everyone's choice, he says). Then 9.Bc4 (his favourite) or 9.Bd3 [S-video, auto-caption, unverified].
- After 9.Bc4: 9...Nd7? 10.Qg4 wins; 9...Nf6 10.Qe2 or 10.Qd3 (he says he switches between them depending on opponent strength).
- Versus declining the knight: 7...Qd6 8.Nxf7 and a bishop sacrifice to remove the d6 defender (garbled).
- Says the Martian "has no refutation" with the engine; the earlier Alien at least has ...c5. His claim.
- Example games: a blitz win, a stream win where a bishop on e6 supported by a rook cannot be kicked, and a game lost on time while winning.

### 6. All Martian Gambit Brilliants And Tricks (`9seNc-BBBlQ`)
2024-08-07, 26:55 [V]. Chapters: vs 8...Bf7 (9.Bc4, 9.Bd3, with Qe2 and Qd3), vs 8...Bf5 (9.Bc4, 9.g4), vs 8...Bh7 (9.Bc4, 9.Bd3), vs 8...Qd5, "if Black doesn't take the knight", Alien vs Martian.
- Claims: about 95% win rate on the chess.com ladder three weeks after the first Martian video, and "100%" after naming it (his claim, no sample size).
- Chapter 8...Bf7 9.Bc4:
  - 9...Nd7? 10.Qg4 and Black is lost [S-video, auto-caption, unverified].
  - 9...Nf6 10.Qe2: indirect pressure on f7; Black commonly blunders with a natural ...Nbd7 or ...b5 and loses to Nxf7 or Bxe6 [S-video, auto-caption, unverified].
  - 10.Qd3 as the alternative; he recommends Qe2 against players below about 2400 and Qd3 against 2400+, and switching to confuse repeat opponents.
  - A bishop on e6 supported by a rook is called nearly winning; Black cannot dislodge it.
- Chapter 8...Bh7: 9.Bc4 main, 9.Bd3 also; he recommends Bc4 [S-video, auto-caption, unverified].
- Chapter 8...Bf5: 9.Bc4 or the immediate 9.g4; if Black answers with the "natural" pawn or bishop move the combinations include Bxe6 and rook sacrifices [S-video, auto-caption, unverified].
- Chapter 8...Qd5: a trick with Bc4 trapping or winning the queen (only sketched).
- Chapter "Black does not take": if Black ignores the knight (for example 7...e6 or 7...Qb6) White is much better; he says 7...Qb6 even loses the queen to a quiet knight move [S-video, auto-caption, unverified; move cannot be decoded].
- Alien vs Martian reminder: 4...Nf6 leads to Alien; 4...Bf5 leads to Martian; he repeats that both are needed and that he has "not replaced" Alien.
- Teaching habit: he repeats the move order from move 1 in every game for new viewers.

### 7. Unbelievable Martian Gambit ONLY Arena (`I8HtyHOMLI8`)
2024-10-09, 32:28 [V]. Chapters: intro, arena games, outro.
- Stream session of Martian games in an arena; mostly conversation with chat. Low chess content.
- Only usable item: confirms the Martian was in use in Oct 2024, three months after its first video [V date].
- One passage about trapping the bishop on g6 with f3-style and g4 moves, too garbled to use [H].
- Nothing else I extracted is relevant; I left off-topic chat out of these notes.

### 8. I played Eric Rosen: The Stafford Gambit vs. Martian Gambit (`-Gu50TGV-PY`)
2025-02-25, 2:11:07 [V]. Chapters: nine blitz games (Alien, Halloween, Martian, Danish, Alien, King's Gambit, Martian, Elephant, Stafford) and a bullet game. Thin notes: read the start and targeted passages only.
- Witty credits Rosen with the first big video about the Alien Gambit and says others followed (his claim).
- Says he invented the Martian Gambit "since July last year" and has a beard pledge until it becomes a book move on chess.com. In 2025 he says it is a book move on Lichess but not chess.com (his claim).
- Match format: Witty plays Alien/Martian against Rosen's Stafford; they alternate; the chapter list shows he also used Halloween, Danish, King's and Elephant gambits for the match.
- Rosen's remark in the stream: the Stafford may be even more dubious objectively than Alien/Martian, though the engine sees more practical poison in it. (Rosen's view as relayed in the video.)
- Chess pointers from the commentary: as the piece-down side, do not offer a queen trade (Rosen tries to trade queens to make the extra piece count); Witty keeps queens on.
- Chess.com play note: a castling-through-attacked-square question came up and was left unresolved.

### 9. GM Hikaru Nakamura Shocking Loss to Alien Gambit! (`u2i4Txq5qZw`)
2025-04-07, 11:37 [V]. Chapters: introduction, the game, Chessable course, outro.
- Game: his viewer "Midnight Horizon" as White vs Hikaru Nakamura, online blitz, 29 March 2025 per his intro.
- Reaches Alien via the Martian move order: 1.e4 c6 2.d4 d5 3.Nd2 dxe4 4.Nxe4 Bf5 5.Ng5 and after ...h6, 6.N1f3 and 7.Nxf7 Kxf7 8.Ne5+ transposes into Alien [S-video, auto-caption, unverified; detail garbled].
- Why 3.Nd2: he says the move itself warns experienced players that an "alien" is coming, and he prefers it to 3.Nc3 because of ...g6 (the Gurgenidze set-up) where the pawn on c3 is needed [S-video, auto-caption, unverified].
- Line: 8.Ne5+ Kg8 (most popular, chosen by top players including Hikaru) 9.Bc4 ... then g4, Bb3 and Qd3 give a strong initiative; he says Black's correct defence needs several only moves (...Bh7 type) and 90% of players, including strong ones, play the natural but wrong ...Bd5 [S-video, auto-caption, unverified].
- Lesson: when Black defends actively with ...Bf5 there is no time for the quiet setup; attack at once with checks and g4.
- Result, by his account: White got a clearly better position and won, with Hikaru taking a pawn that he should have taken with a piece.
- Advertises his Chessable course (Alien and Martian) and a short course.

### 10. Destroy EVERYONE with the Elephant Gambit! (`AG3sZm0pNG0`)
2025-05-01, 28:25 [V]. Chapters: intro/definition, 4.Nd4, 4.Qe2, 3.Nxe5, 3.Nxe5 with d4, 3.Nc3, 4.Qe2 with Nc3, summary, Eric Rosen vs Witty.
- Definition: 1.e4 e5 2.Nf3 d5 (the captions say "pawn F3"; Nf3 is the move for this gambit) [S-video, auto-caption, unverified]. He says it only works after 2.Nf3; against other moves you simply play chess.
- Main line: 3.exd5 e4 4.Qe2 (he says this is the only move that keeps an edge) 4...f6! protects the e4 pawn (a pin on the e-file makes 5.Nxe4 impossible). Do not recapture on d5 too early because c3 then wins the e-pawn [S-video, auto-caption, unverified]. He says Black is slightly better (his claim).
- Variation: 5.d3 Bb4+ and the exchange queen trade leads to an equal endgame; "boring but equalises" (his claim).
- 3.Nxe5: the second main idea ...Bd6; and 3.Nc3 d4. Also a 4.Nd4 chapter (a knight retreat) for which Black plays ...Qxd5 or ...c5 style replies; unclear.
- Plan: develop fast with ...Bd6, ...Nf6/...c6, castle, use the e-file and d-file, and the queen goes to e6/d5; he repeats that whenever White puts a bishop on c4/g5 early, Black sacrifices the e-pawn back for time.
- Statistic: he reports about 85% with Black in one line (his claim).
- Rosen game: after 3.exd5 Rosen played d4; Witty replied ...c6; Rosen blundered with Bc4 and Black won a long attacking game involving a rook sacrifice on e8 and bishop sacrifices (garbled).
- He says he prefers the Elephant to every other gambit for Black.

### 11. ALIEN GAMBIT IN CLASSICAL CHESS!! (`hCEDjGVPRl4`)
2025-06-02, 10:00 [V]. Chapters: introduction, the game, game 2, outro.
- First over-the-board classical game with the Alien Gambit (opponent about 1800 rapid, his claim). He had not played classical since 2018.
- Game 1: 1.e4 c6 2.d4 d5 3.Nd2 dxe4 4.Nxe4 Nf6 5.Ng5 h6 6.Nxf7 Kxf7 7.Nf3 Bg4? 8.Ne5+ Kg8 (or Ke8) 9.Nxg4 (he took the bishop rather than play 9.Bc4, which loses to ...Qa5+); the game finished in 13 moves [S-video, auto-caption, unverified].
- Game 2: a friend (a first-time classical player) played it as White in the same event against an opponent of about 1900, reaching the structure by transposition; she completed Bd3, O-O, Re1, Ne5+, then Qg3 and the rook swing, and won. He calls it a textbook "ultimate setup" [S-video, auto-caption, unverified].
- Observation: the opponent in game 1 looked only at the kingside and never at the queenside defence (...Qc7 or ...b6 type); he says few find the quiet defence.
- Advice: use it as a surprise weapon, not a main repertoire.

### 12. 7 Reasons why you Should play Alien Gambit (`5dquo0cYmGA`)
2025-06-25, 25:26 [V]. Chapters: seven reasons.
- Reason 1 (results): reports winning 12 of 13 ladder games; the most common database reply (...Bg4) loses; says chess.com described the opening as "shockingly effective" (as he reports it).
- Reason 2 (easy to reach): the Caro-Kann is popular and 4...Nf6 is common; if Black avoids ...h6 you do not sacrifice; against 4...Bf5 he plays the Martian instead [S-video, auto-caption, unverified]. Also works to some extent against the French and the Scandinavian, though less well.
- Reason 3 (teaches attack): develop first (Bd3, O-O, Re1, Ne5+) then attack; transfer the queen (Qh5, Qf3-g3); rook swings.
- Reason 4 (tactics): the h6 bishop sacrifice, discovered checks, a rook sacrifice on d7 in an endgame line.
- Reason 5 (dynamic play): keep the initiative; do not let Black develop the queenside; make a new threat each move.
- Reason 6 (all time controls): he played it OTB in a classical event in Italy in June 2025 and won in 13 moves; but he advises it as a surprise weapon.
- Reason 7: fun with friends. Promotes his Chessable Caro-Kann course.

### 13. I played Alien Gambit vs. Fabiano Caruana (`Cjk-ZTKkSAo`)
2025-12-07, 10:21 [V]. Chapters: the game, game analysis.
- Friendly game with the two chatting. Caruana's first impression of the position was "losing for White" in theory, but he was not scared at the start.
- Caruana chose natural moves such as ...Nbd7, ...Qc7 (to stop Ne5+ and the bishop on f4) and later ...Nf8 to cover h7/g6; White set up with c3 and Qe3 [S-video, auto-caption, unverified].
- He felt his queenside could not develop easily, but was never in immediate danger.
- Post-game: both sides made errors; result not clear in the captions (time scramble).

### 14. I played Martian Gambit vs. Levon Aronian (`5Yw3NGilCLs`)
2025-12-08, 10:51 [V]. Chapters: opening the game, midgame development, tactical exchanges, final endgame struggle. Very short captions (about 1,700 characters).
- Aronian says it "shouldn't work" but notes Black's kingside development problems; Witty says that is the idea.
- Witty explains that the 5.Ng5 idea exists and that if Black plays ...h6 he goes Alien; the exchange is mostly a conversation about how surprising the line is.
- A comment that Black still has all pieces and White can still castle (as opposed to Alien).
- Not enough to use as lesson material; the reaction is the only content.
- Result not clear in the captions.

### 15. Can GM Fabiano Caruana survive the Martian Gambit? (`zR-a79Mclbw`)
2025-12-09, 9:21 [V]. Chapters: the game, game analysis.
- Caruana's candidates at move 8 included ...Bf7 and ...Bh7 and ...Nf6; he says ...Bf7 would be the most natural for him. The trap Witty keeps pointing to is ...Nd7? after which ...Qf5-type play is missed [S-video, auto-caption, unverified].
- They agree ...Qc8 (the queen retreat that protects d7/d6) is the best Black defence. After it the position is described as scary and long-term for Black.
- White's plan was f4-style kingside pawns; Black's centralization; a late error with ...Qg7 nearly lost for Caruana, but he survived.
- Caruana's verdict: more scary than Alien, no obvious refutation. Result not clear.

### 16. Top GM's View on Alien and Martian Gambit (`Jr0jzYXBe8U`)
2025-12-31, 4:26 [V]. Chapters: Caruana, Keymer, Mendonca, Maghsoodloo, Erigaisi. Opinions below are the players' as relayed by Witty's video (his claim of what they said), not independently verified.
- Caruana: Alien gives Black many options so it feels less scary, but natural moves left him feeling equal or slightly worse; it works up to about 2000 to 2200 FIDE (chess.com ratings higher). Martian: dangerous at nearly any level after 7.Ne6 fxe6 8.Ne5; about -2 on the engine but Black must find deep only-moves.
- Keymer: an option; objectively lost for White, but decent chances in blitz and against weaker players; he lost to it himself. Martian is trickier because of the ...Qf5 trick, though if the opponent knows it the line is just lost for White.
- Mendonca: Alien is fun and playable at any level, probably losing, good in blitz; Martian is better and more exciting.
- Maghsoodloo: Alien was hard to face in blitz as a Caro-Kann player; Martian a better practical choice but fewer players now choose ...Bf5.
- Erigaisi: feels wrong at first; tricky when Black is out of book, especially in rapid or blitz; recommends it for roughly 1000 to 1800 rating.
- Consensus: nobody calls either sound; all see practical value in fast games.

### 17. Elephant Gambit Speedrun from 800 to 2200 | Part 1 (`7HFa7qRsHfw`)
2026-02-13, 54:04 [V]. Chapters: games vs 914, 895, 946, 938, "what is Elephant Gambit with the White pieces?", 977, 1048, 1094, 1114, 1145. Thin notes: read the opening and one analysed game.
- Plays Black on a fresh account climbing; the first Elephant Gambit game arrived after 13 games.
- Line in that game: 1.e4 e5 2.Nf3 d5 3.exd5 e4 4.Qe2 f6 5.d3 (or c3) then ...exd3 6.Qxd3 Qxd5 (take with the queen, not the pawn) and an equal queenless endgame [S-video, auto-caption, unverified, partly garbled].
- Rule he repeats: do not recapture on d5 before ...f6 because c3 would win the e-pawn.
- With the bishop pair: do not trade the bishops voluntarily; keep both. "The pin" on the e-file prevents White from capturing e4 (king hanging).
- When piece up, trade pieces; centralization is the strongest attack; have three pieces in a king attack so a sacrifice leaves two to mate.
- A chapter shows the opening from the White side and the principle that in this opening a bishop that goes to g5 or b5 should not retreat.
- His claim: Elephant is "equal" if White finds Qe2, and White rarely does at lower ratings.

### 18. I played Martian Gambit vs. Dina Belenkaya! (`v5LGh_NkS_s`)
2026-03-19, 3:46 [V]. No chapters.
- A comic sketch with a teasing "young fan" role; not instruction. The Martian is played quickly and wins.
- Includes a second game where a king move is played; nothing decodable.
- Only shows the Martian main line is still in his repertoire in March 2026 [V date].

### 19. Witty Alien Teaches me the Alien Gambit!! (`YkzrVvXHN7w`)
2026-07-29, 40:51 [V], another creator's channel. Chapters: Witty Alien (0:00), Alien Gambit lesson (1:00 to 22:00), then viewer games rated 600, 1200, 1500, 2200.
- Move order: 1.e4 c6 2.d4 d5 3.Nd2 dxe4 4.Nxe4 Nf6 5.Ng5 h6 6.Nxf7 Kxf7 7.Nf3 [S-video, auto-caption, unverified]. He says 3.Nd2 versus 3.Nc3 has no major difference, but he plays Nd2.
- What White gets: Black cannot castle; light squares around the king are weak (queen to h5, d3, g6); White is ahead in development.
- Main trap: 7...Bg4 8.Ne5+; after the king moves, Bc4+ and Qd3, or Qh5. After 8...Ke8 take the bishop; if the queen captures on d1 later there is a bishop check that wins the queen back [S-video, auto-caption, unverified].
- 7...Nbd7: "ultimate setup" Bd3, O-O, Re1, Ne5+ (his words: the most deadly set-up). If Black captures e5 then Qh5+ Kg8 Bxh6!; Black's pieces get in each other's way. If Black does not take, Qf3 (queen move) still keeps the attack.
- 7...Bf5: no time for the quiet set-up; check, g4, and sacrifice on g5/queen f3 to deflect the bishop, then mate on the light squares.
- 7...c5 (the engine move): 8.d5 and Bc4 tricks; if Black plays ...Kg8, castle, sacrifice the d4 pawn, c6/g6 pushes and Rook to e1; a smothered-style mate with Qh7 after a rook sacrifice appears.
- Martian section: after 5...Bf5 White continues 6.N1f3 (move order: 4...Bf5 5.Ng5 Bg6 6.N1f3 h6 7.Ne6). He explains the point: Ne6 hits the queen and bishop; then 8.Ne5 gains time. 7...Qb6 supposedly loses the queen; 7...Qd6 allows Qc5-type or Nxf8; after 7...fxe6 8.Ne5 Bf7 9.Bc4 b5 10.Bxe6! and Qf3; 9...Nd7 10.Qg4; 9...Nf6 10.Qd3 [S-video, auto-caption, unverified].
- Naming: chess.com's explorer already recognises the Alien Gambit (host's remark).
- The host stumbles in the viewer games, in particular against a 600 who knew the ...c5 defence, and says he will re-check the line.

### 20. Romantic Opening Repertoire for White and Black! (`zmGrC6HLC1U`)
2026-08-02, 46:00 [V]. Chapters: vs Caro-Kann, Sicilian, Scandinavian, French, 1...e5, Modern, Owen's Defense, Alekhine's; as Black vs 1.e4, Van't Kruijs, 1.d4 and more.
- A "play something romantic against everything" repertoire, framed as for fun and fast time controls.
- vs Caro-Kann: Alien Gambit (with 3.Nd2 because of the ...g6 system) and the Martian; the Caro-Kann is called super solid and hard to make romantic.
- vs Sicilian: the Smith-Morra Gambit (2.d4 cxd4 3.c3 style); idea: pawn sacrifice for lead in development, with Bc4 and Qe2 and a typical sacrifice on b6 (garbled) [S-video, auto-caption, unverified].
- vs Scandinavian: "Alien Gambit Viking variation", only in bullet, not blitz [S-video, auto-caption, unverified].
- vs French: Alien Gambit Bonjour and the Rubinstein-line version; also a line he says he invented in the French with a bishop to d2/e3 and a queen trap (name given as "Bone cloud" in captions, garbled) [H].
- vs 1...e5: a Danish-type two-pawn sacrifice for development, bullet only.
- vs Modern: h4 and h5 pawn lever, and c3/d4 centre; vs Owen/Alekhine/others: less detail.
- As Black vs 1.e4: 1...e5 and after 2.Nf3 the Elephant Gambit; 3.exd5 e4 4.Qe2 f6! (he calls ...Bd6 the dull normal line); vs 2.f4 a counter-gambit idea; vs 1.e3 an f5 setup with a knight sacrifice; vs 1.d4 the Englund Gambit (bullet only); vs 1.c4 either 1...e5 or 1...b5; vs 1.g3 a ...h5 plan. Details are garbled and need re-checking.
- Claims 100,000-plus chess.com games and says the Elephant Gambit is his best gambit as Black (his claim).
- Not useful for move orders; useful only as a list of openings he associates with himself.

## Synthesis

### 1. The Alien Gambit lines and his recommended handling
Spine [S-video, auto-caption, unverified]: 1.e4 c6 2.d4 d5 3.Nd2 dxe4 4.Nxe4 Nf6 5.Ng5 h6 6.Nxf7 Kxf7 7.Nf3.
- He prefers 3.Nd2 to 3.Nc3 (for example because ...g6 and Gurgenidze set-ups need c3 in the other order); he says the difference is small.
- He sacrifices only after ...h6.

| Black's reply after 7.Nf3 | His treatment |
| --- | --- |
| 7...Bg4? (the most common move in the database, his claim) | 8.Ne5+ (king moves); then Bc4+ and Qd3 (or Qh5) mate nets; but 9.Bc4 fails to ...Qa5+ in some lines, so he takes the bishop on g4. |
| 7...Nbd7 (the solid reply used by strong players) | The "ultimate setup": Bd3, O-O, Re1, Ne5+. If Black captures on e5: Qh5+ and Bxh6!, Re4 and a rook swing to g4. |
| 7...Be6 | Same set-up; ...g5 is met by Bxg5 or Rxe6 sacrifices. |
| 7...Bf5 (active) | No quiet set-up: Ne5+, Bc4+, g4 at once, then rook and queen sacrifices on the light squares. |
| 7...c5 (best engine move, prepared players) | 8.d5 and Bc4 tricks; castle and sacrifice d4 if Black plays ...Kg8. |

Handling rules he repeats: develop before attacking; transfer the queen (Qf3-g3, Qh5); swing the rook (Re1-e4-g4/h4); make a new threat every move; never trade a piece down; use as a surprise weapon in blitz and bullet. His own caveat: the engine prefers Black.

### 2. The Martian Gambit lines
Spine [S-video, auto-caption, unverified]: 1.e4 c6 2.d4 d5 3.Nd2 dxe4 4.Nxe4 Bf5 5.Ng5 Bg6 6.N1f3 h6 7.Ne6 fxe6 8.Ne5.
- Black's eighth moves and his answers:
  - 8...Bf7 (most common): 9.Bc4, then 10.Qe2 (below about 2400) or 10.Qd3 (stronger opponents); alternative 9.Bd3. Traps: 9...Nd7? 10.Qg4; 9...b5? 10.Bxe6.
  - 8...Bf5: 9.Bc4 or 9.g4.
  - 8...Bh7: 9.Bc4 or 9.Bd3.
  - 8...Qd5: Bc4 and a queen trap (sketched).
  - Declining the knight: 7...Qb6 (queen trapped by a quiet knight move), 7...Qd6 (Nxf7 and a bishop sacrifice, or Qc5/Nxf8), 7...e6 (just better for White).
- Invention date (his claim): the week before 11 Jul 2024 [V upload date].
- Result claims: about 95% (Aug 2024), "100%" later. His claims, no sample sizes.
- Guests' views (in video 16): Martian more dangerous or exciting than Alien; objectively around -2 for White; requires deep only-moves for Black.

### 3. The Elephant Gambit and other openings he names
- Elephant Gambit (Black): 1.e4 e5 2.Nf3 d5 3.exd5 e4 4.Qe2 f6! (protects e4; the pin on the e-file stops Nxe4); do not recapture on d5 early; 5.d3 is met by ...Bb4+ or ...exd3 6.Qxd3 Qxd5; 3.Nxe5 Bd6; 3.Nc3 d4 [S-video, auto-caption, unverified]. He says it is equal-ish objectively and tough for the white player to meet.
- Alien Gambit Bonjour (French): 1.e4 e6 2.d4 d5 3.Nd2 dxe4 4.Nxe4 Nf6 5.Ng5 h6 6.Nxf7. Worse than the Caro-Kann version, stop if Black plays ...c5.
- Alien Gambit Viking variation (Scandinavian), bullet only.
- Smith-Morra Gambit vs the Sicilian; Danish-type gambit vs 1...e5; Englund Gambit as Black vs 1.d4; Stafford and Halloween, King's and Danish gambits appear in the Rosen match.
- Others (Modern with h4, etc.) are ideas rather than lines.

### 4. Claims in the videos that conflict with `docs/research-alien-martian.md`
1. **Martian date.** The earlier note records chess.com's article (Oct 2026) as saying he invented it that month. The video uploaded 2024-07-11 [V] has him saying he invented it the week before, and the Feb 2025 collab repeats "since July last year". The 2024 date is supported by his own dated videos; the October 2026 date cannot be the invention date.
2. **Alien date.** The earlier note says it spread in 2024. His first Alien video is dated 2023-11-13 and the follow-up 2023-12-28 [V]; spread began late 2023. Witty credits Rosen with the first big video (his claim, collab).
3. **"No other opening of his is named."** The videos name the Elephant Gambit (a full video 2025-05-01 and a 2026 speedrun), Alien Bonjour, Alien Viking, Smith-Morra and others. So there is a third gambit he promotes: the Elephant.
4. **Win-rate claims "unquantified".** He gives numbers: about 60% in the first month (Dec 2023), 12 of 13 (June 2025), about 95% then 100% Martian (Aug 2024). Still his claims with no samples; not usable as evidence.
5. **3.Nc3 as the main line.** The ChatGPT Martian guide uses 3.Nc3; he teaches 3.Nd2.
6. **"7.Ne6 attacks Qd8 and Bf8".** The caption of his intro garbles targets ("bishop on f8, rook on h8"); the queen on d8 is not named. Likely a garble, but verify with the validator.
7. **ChatGPT: best defences 8...Bf5 and 8...Bh7, with 8...Bf7 "playable".** He treats 8...Bf7 as the most common reply and as the one he beats with 9.Bc4 and the Qe2/Qd3 tricks, and gives 8...Bf5, 8...Bh7 and 8...Qd5 as other replies with their own wins. He does not call any of them best. Do not call 8...Bf7 "playable" in a lesson without an engine check.
8. **ChatGPT: "7...Qb6 and 7...Qd6 allow Nxf8".** He says 7...Qb6 loses the queen to a quiet knight move and that 7...Qd6 is met by Nxf7 and a bishop sacrifice (or Qc5). Differs from ChatGPT's description; needs an engine check.
9. **ChatGPT: 8...Bf5 9.Qh5+ g6 10.Nxg6.** Not in these videos. His replies to 8...Bf5 are 9.Bc4 and 9.g4. ChatGPT's line is unsupported by him.
10. **ChatGPT: 8...Bh7 with 9.Qg4.** His chapters list only 9.Bc4 and 9.Bd3.
11. **Earlier note's blog trap: 7...Bg4 8.Ne5+ Kg8 9.Bc4+ Kh7 10.Qe3+ g6 11.Qxg6#.** In the videos the queen check is Qd3+ (b1-h7 diagonal), not Qe3+; the blog's move is probably a typo. Validate.
12. **Earlier note's blog line 7...Nbd7 8.Bc4+.** His answer to ...Nbd7 is the quiet 8.Bd3 e6 9.O-O Bd6 10.Re1 Re8 11.Ne5+, not Bc4+. Bc4+ appears against ...Bg4, ...Bf5 and ...c5.
13. **"Black's practical answers named in blogs: 5...c5, 5...Bf5 ..., 7...c5."** In the videos 7...c5 is the line that prepared opponents choose; 5...Bf5 leads to Martian; the sacrifice only happens after ...h6.
14. **Origin wording.** He says he and "his community" invented it, and that Rosen was first to make a video. Nothing independent says who played it first; keep "popularised and named by".
15. **Strong-player sightings.** New from these videos: a viewer beat Hikaru with it (Mar 2025, Witty's account), and Caruana, Aronian, Keymer, Mendonca, Maghsoodloo and Erigaisi each commented. All from his own videos (secondary); results not independently checked.

## Five most useful teaching ideas for lessons
1. **The "ultimate setup" as a development lesson.** After 7.Nf3 the plan is Bd3, O-O, Re1, then Ne5+: a side that is a piece down attacks only after finishing development. Pose "which developing move comes next?" before showing the tactic.
2. **Natural-move traps for the contrast lab.** 7...Bg4? 8.Ne5+ and, against ...Nbd7, the natural capture on e5 lose to forcing queen/bishop shots. Use as unlabelled paired items: the human-looking move versus the only move. Also teach the attacker's trap: 9.Bc4? loses to ...Qa5+.
3. **The diagonal map.** Four weak diagonals around the uncastled king (h5-e8, a2-g8, b1-h7, c1-h6) plus the rook swing (Re1-e4-g4/h4). A reusable lesson on where to put each piece when the enemy king cannot castle.
4. **Keep making threats; choose trades by material.** When the first idea fails, re-route the queen (Qf3-g3, Qh5-g6) and create a second threat; when a piece down, avoid trades; when a piece up (Elephant ...f6 lines), trade and centralise. Each needs the honest note that the gambit is objectively unsound.
5. **Choose the weapon from the opponent's move order, and know when to stop.** Alien after 4...Nf6 and 5...h6, Martian after 4...Bf5 5.Ng5 Bg6, Bonjour in the French; stop the French version once the opponent plays ...c5. Teaches preparation, move-order awareness and a stop rule, and that every elite player quoted calls these practical weapons for blitz and bullet, not sound openings.

## Rights and use notes
- All content is paraphrase plus bare move data; no transcripts are included.
- No health or personal matters are recorded in this file.
- Nothing here is engine-checked; do not teach any line until `tools/validate.py` passes it.
