# Alien and Martian Gambits: research notes (8 Nov 2026)

Purpose: ground the L-OD-ALIEN series and a later Martian series. Facts only; our lessons use original wording. Labels: [V] verified here, [S] one secondary source, [R] recalled, [I] inference, [H] hypothesis. Nothing here has been engine-checked yet, so every move line below is a **claim to validate** (`tools/validate.py`), not content.

## Who and where
- Volen Dyulgerov, online name **Witty_Alien**, title CM. Lichess profile Witty_Alien: CM, bullet about 2268 and blitz about 2198 on 8 Nov 2026 [V, public API]. Lichess account `WittyAlien` (no underscore) is closed [V].
- Chess.com says he began making content on 13 Sep 2022, after a year as a web developer, runs a Discord, streams and the chess.com club "Witty Aliens"; claims about 100,000 games on chess.com [S: chess.com "Creator of the Month" article, updated 14 Oct 2026].
- He says he did not set out to create an opening: he started answering ...Nf6 in the Caro-Kann with Ng5 and Nxf7 after ...h6 [S, same article]. Our wording: "popularised and named by", "played and promoted by"; "inventor" is Andrew's word and the sources do not say who played it first [I].
- Blogs report Bulgarian origin, peak FIDE 2200 and junior titles [S, one personal blog; not independent]. Do not put in lessons.
- **Personal matters:** one blog reports a farewell video (5 Sep) stopping all platform activity, with health and income reasons from the video [S, unverified, personal blog]. We do not repeat health details anywhere in the product.

## Alien Gambit
- Line: 1.e4 c6 2.d4 d5 3.Nc3 (or 3.Nd2) dxe4 4.Nxe4 Nf6 5.Ng5 h6 6.Nxf7 [S, chess.com article, chess.com openings page, listudy, several blogs]. chess.com's formal name is the Caro-Kann "Two Knights Attack" [S, one blog].
- It spread in 2024 after his video; GothamChess, Eric Rosen and others played it [S]. Consensus in every source: objectively unsound, practically dangerous, especially in fast games.
- Trap lines blogs give (all [S], all to be validated; one of them has an illegal move):
  - 6...Kxf7 7.Nf3 Bg4 8.Ne5+ Kg8 9.Bc4+ Kh7 10.Qe3+ g6 11.Qxg6#
  - 7...Nbd7 8.Bc4+ Ke8 9.O-O ... (blog line contains an illegal knight move: do not use as written)
  - 7...Bf5 8.Ne5 Kg8 9.Bc4+ e6 10.g4; 10...Be4 11.Bxe6; 10...Kh7 variants with 11.g5 Bxh1 12.g6#
  - 7...e6 8.Ne5+ Ke7 9.Ng6+ (fork), 8...Ke8 9.Bd3 Bd6 10.Bg6+ Ke7 11.Nf7, 8...Kg8 9.Bd3 Bd6 10.f4 Bxe5 11.fxe5 ...
- Black's practical answers named in blogs: avoid 5...h6 (5...c5, 5...Bf5), or accept and play 7...c5 / ...e6 [S, [R] in the ChatGPT guide]. Already queued in the wave.

## Martian Gambit
- Line: 1.e4 c6 2.d4 d5 3.Nc3 (Witty also uses 3.Nd2) dxe4 4.Nxe4 Bf5 5.Ng5 Bg6 6.N1f3 h6 7.Ne6 fxe6 8.Ne5 [S: chess.com openings page "Caro-Kann Defense: Classical, Martian Gambit", a chess.com blog]. White sacrifices a knight on e6 and follows with Ne5; engines call 7.Ne6 a mistake but it is hard to meet over the board [S].
- Purpose per sources: a second gambit to catch players who avoided the Alien Gambit by changing move order (5...Bf5 instead of 5...Nf6) [S].
- Date conflict: the chess.com creator article (October 2026) calls it his latest creation, invented that month; two other pages say 2024 [S, conflicting]. Resolve before any lesson states a date; say "date not settled".
- Lines to validate from one blog: 7...fxe6 8.Ne5 Bf7 9.Bc4 Nf6 10.Qe2 or 10.Qd3; 9...Nd7? 10.Qg4; 10.Qe2 d7?? then Bd3, ...Qh3#; 5...Bf5 6.Qh5+ (blocked) 7.Be2 trap; 7...Qb6 declines the knight [S, SAN incomplete: needs a full replay].
- Win-rate claims ("skyrocketing") are the creator's own and unquantified [S]; do not use.

## Other gambits
- No other opening of his is named in any page we could read. A podcast episode outline mentions "Witty's favorite gambits" and "new gambits from Witty?" but its contents were not readable [S]. So: **no verified third gambit**.

## What I could not read
- YouTube pages (titles only through oEmbed; no transcripts or descriptions), Reddit (blocked), chess.com member and club pages (bot check), Lichess game export for Witty_Alien (needs login). Video content is therefore not used or paraphrased anywhere.

## Games
- 226 Alien Gambit games from TWIC and Lichess broadcast files: `content/_work/alien-games.json` (tools/scan_alien.py). Dyulgerov appears as White in many (online, chess.com Titled Tuesday and 3-0 events). Martian Gambit games not yet scanned: the line has a different move order; run a second scan once the line is validated.

## Next steps
1. Validate the Martian main line and branch claims with the engine (7.Ne6 depth and eval, 7...fxe6 8.Ne5 Bf7, 9.Bc4 lines).
2. Scan the archive for the Martian line (1.e4 c6 2.d4 d5 3.N?3 dxe4 4.Nxe4 Bf5 5.Ng5 Bg6 6.N1f3 h6 7.Ne6) and count.
3. Author an L-OD-MARTIAN series (about 5 lessons) with the same wave template once the Alien wave is reviewed.
4. If Andrew can export Witty_Alien's own games (PGN) from his profile pages, add them to the archive for model games.

## ChatGPT's Martian guide (pasted by Andrew, 8 Nov 2026): claims to validate, all [R]
Do not use any of it until the engine and the rules checker pass each claim; wording of the guide is not reused.
- Main line 1.e4 c6 2.d4 d5 3.Nc3 dxe4 4.Nxe4 Bf5 5.Ng5 Bg6 6.N1f3 h6 7.Ne6 fxe6 8.Ne5; 7.Ne6 attacks Qd8 and Bf8; after 7...fxe6 White's knight on e5 attacks the bishop on g6.
- Claimed best defences after 8.Ne5: 8...Bf5! and 8...Bh7; 8...Bf7?! is playable but gives White more practical chances (check eval at depth for all three).
- 8...Bf5 lines: 9.g4 Bh7; 9.Bc4 (with ...h5 against g4; ...Nf6? allowing g4); 9.Qh5+ g6 10.Nxg6 Nf6 (check legality and whether the queen is really attacked).
- 8...Bh7 lines: 9.Bd3, 9.Bc4, 9.Qg4.
- Declining the knight: 7...Qd7 8.Nxf8; 7...Qd6 and 7...Qb6 named as alternatives that allow Nxf8 (check each).
- "Black should be better; White has no pawn back for the piece": needs an eval at depth for every branch, and the 'wins material but ends in a dead draw' rule applies if any lesson says White regains material.
- Claim that the guide's 'Chess.com analysis' picks 8...Bf5!: the source is unnamed and unread, so it stays unverified.
- Known risk: the guide has errors elsewhere (it called a non-check a check in a different gambit page), so treat every 'check' and 'fork' statement as unverified.

- Video research (20 Witty_Alien videos, auto-caption notes, conflicts with this file): see `docs/research-witty-alien-videos.md`.

## Corrections after the video notes (8 Nov 2026; full notes in docs/research-witty-alien-videos.md)
- The line "No other opening of his is named" is wrong: his videos teach the Elephant Gambit (1.e4 e5 2.Nf3 d5 3.exd5 e4 4.Qe2 f6!), an Alien Bonjour in the French and an Alien "Viking" idea in the Scandinavian, and he names the Smith-Morra, a Danish-type gambit and the Englund. Every move line is an unverified reconstruction of auto-captions [S-video] until validated.
- Dates: his first Alien video is from Nov 2023 and a follow-up from Dec 2023; he says in videos from July 2024 and Feb 2025 that he invented the Martian in July 2024. The chess.com "October 2026" date is therefore not the invention date [S-video, his own account].
- He teaches 3.Nd2 (the ChatGPT guide uses 3.Nc3). The 7...Bg4 trap line in his videos is Qd3+, not Qe3+ as one blog gives. He meets 7...Nbd7 with a quiet Bd3 set-up; 9.Bc4? is met by ...Qa5+. His replies to 8...Bf5 are 9.Bc4 and 9.g4; the ChatGPT line 9.Qh5+ g6 10.Nxg6 is not in his videos.
- His win-rate figures (about 60 percent, 12 of 13, about 95 to 100 percent) are claims without sample sizes and are never used as evidence.
