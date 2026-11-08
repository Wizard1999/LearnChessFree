# Research: chesstactics.org (8 Nov 2026)

Purpose: Andrew pointed us at https://chesstactics.org/ as a source on teaching tactics. Facts only, original wording (rules 3, 4, 5). Labels: **[V]** seen on a page I opened (via WebFetch, whose small-model summariser read it, not by eye); **[S]** secondary; **[I]** inference; **[H]** hypothesis. Not checked: pages beyond those listed under "Pages opened"; the Chessable course; the print books; the Chess Quizzer site contents.

Pages opened [V]: home; 1.1 short guide; 1.2 rationale; 2.1.1.1 knight fork intro; links page; wardfarnsworth.com. One web search found nothing about the site itself.

## 1. Who and what
- Site title "Chess Tactics Explained in English"; it is the free online edition of Ward Farnsworth's book *Predator at the Chessboard* (two print volumes, over 700 pages combined per the home page), plus a puzzle trainer (the "Chess Quizzer" at chessproblems.org) [V].
- Author: Ward Farnsworth, listed as Professor of Law at the University of Texas at Austin; his page shows no chess rating or title and no chess credentials. His other books are on philosophy, rhetoric and law [V]. **Credential level: none shown for chess; treat it as a well-organised teacher's synthesis, not a titled-coach authority [I].** Whether he holds a rating: not checked.
- Also sold as a Chessable course ("A Field Guide to Chess Tactics"), said to have movable pieces and more quiz modes [V: home page claim]. Print books on Amazon [V]. The free site is therefore a funnel to paid products.

## 2. Contents and sequence [V, home page]
Roughly 20 chapters, about 200 topics, over 1,000 positions, about six diagrams per topic [V: 1.1].
1. Introductory matters (guide, rationale, a primer on the elements of tactics, notation, bibliography, chess in literature).
2. **Double attack:** knight fork, queen fork, bishop fork, rook fork, pawn fork.
3. **Discovered attack:** bishop, rook, knight, pawn discoveries.
4. **Pin and skewer:** arranging a pin, exploiting a pin, other patterns, relative pin, skewer.
5. **Removing the guard:** capturing the guard, distracting it (overloaded piece), attacking it, blocking it (interference).
6. **Mating patterns:** back-rank mate, other classic mating ideas.

Three core ideas named in the intro: double threats, loose pieces, forcing moves [V: 1.1]. Categorisation is by **mechanism, then by which piece does it** (fork split five ways by piece; discovery split four ways). Sequence is easy forks first, mates last. Topics can be read in order or independently [V].

## 3. Page and example structure [V]
- One page = one diagram plus a few paragraphs of plain-English reasoning; a subsection is a short run of pages ("1 of 3" counter on the knight-fork intro). The intro page has no question [V: 2.1.1.1].
- Reader may try to solve first or read the explanation straight away; notation kept minimal [V: 1.1].
- Trainer: positions with the explanation hidden, hint and answer on request, random or by topic [V: home].
- Quality of the positions themselves (source games or composed): **not checked**.

## 4. Claims about improvement
- Tactics matter more than strategy for beginners; games are decided by who wins material the other cannot recover; deep opening study is low value for novices; improving means recognising the signs that a combination exists and practising turning them into plans, through understanding not memorising; play opponents near your own strength [V: 1.2].
- **No studies or evidence are cited** on that page [V]. So all are opinion: label [H] for our purposes (rule 6, no grade above G0).
- Contrast with our design: the page treats "sign recognition" as the skill, which matches our `TAC.NONE` ("is there a tactic at all") idea [I].

## 5. Licence and what we may use
- Every page carries a Creative Commons badge linking to **CC BY-NC-ND 2.5** (Attribution, NonCommercial, NoDerivatives) [V: 1.1, 1.2, links page]. No separate terms page found. The print books and Chessable course are separate commercial products; their terms: not checked.
- **Consequences (rule 4) [I]:** we may link to it and cite it. We may not copy or adapt its explanations (ND), and our app is a public free project but we should not rely on "non-commercial" reading without a lawyer (already on the not-done list). So: **no text, no adapted explanations, no re-use of its diagram sets as a block.** Bare positions and chess facts are not copyrightable in themselves, but taking a curated set of ~1,000 positions wholesale would copy a selection and sequence; do not do that either. Safe use: its table of contents as an idea about categorisation, ours written and verified independently.
- No downloads were taken or offered (nothing was downloaded).

## 6. Comparison with our tactics strand
Ours (`docs/curriculum-map-v1.md` S3; skills in `content/skills/`): T1-2 fork, pin, skewer, discover, double-check; T2-3 remove-defender, deflect, decoy, overload, trapped piece, back-rank, mate-patterns; T3-4 zwischenzug, x-ray, interfere, clearance, desperado, perpetual, stalemate trick; T4-5 multi-motif combos, quiet move, underpromotion; `TAC.NONE` throughout [V: our doc].

Mapping [I]:
| chesstactics.org | Ours |
|---|---|
| Double attack (5 piece-specific forks) | `TAC.FORK` (one node; piece variants not separate) |
| Discovered attack (4 piece types) | `TAC.DISCOVER` (+ double-check) |
| Pin (arranging, exploiting, relative) and skewer | `TAC.PIN`, `TAC.SKEWER` |
| Removing the guard: capture, distract, attack, block | `TAC.REMOVE-DEFENDER`, `TAC.DEFLECT`/`DECOY`/`OVERLOAD`, `TAC.INTERFERE` |
| Mating patterns (back rank, others) | `TAC.BACKRANK`, `TAC.MATE-PATTERNS`, `TAC.MATE-SEARCH` |
| (no counterpart seen on the pages opened) | zwischenzug, x-ray, clearance, desperado, perpetual, stalemate trick, quiet move, underpromotion |

Order differs: they put mates last (chapter 6); we place basic mates very early in Foundation (FND.MATE1), consistent with most sources in `research-curriculum-orders.md` (Yusupov, Dane, Polgar start with mates). Our wider list is longer at the advanced end; theirs is deeper at the basic end (per-piece variants).

## 7. Ideas and gaps
1. **[V/I] Three unifying ideas (double threat, loose piece, forcing move)** as a spine under all named tactics. We could teach "what do all these share" as a short bridge lesson, in original words and our own verified positions. Check whether our Thinking Loop already carries "loose piece" (S2 "Poorly Protected Pieces" is cited there).
2. **[V/I] Piece-specific variants of fork and discovery** (queen fork, pawn fork, rook fork; bishop vs knight discoveries). Check whether our `TAC.FORK` items cover pawn forks and rook forks, not only knight forks; a coverage count by piece is cheap with `tools/` item metadata. [H] that learners miss pawn and queen forks most.
3. **[V] "Remove the guard" as one family** with four routes (capture, distract, attack, block). Our separate nodes could share a family label in the Map for learners; our unlabeled testing (D-rules) should keep the label hidden in tests.
4. **[V] Read-first-or-solve-first choice** per example. We already default to try-first for unlabeled testing; offering explanation-first as a fading-support level fits "support that fades" [I].
5. **[I] Sign recognition as the goal** matches `TAC.NONE`; the site has no equivalent "no tactic here" items on the pages seen. We are ahead there [I].
6. **[H] Low-evidence claims** (tactics over strategy, skip openings) should not be copied as principles; our own evidence labels apply.
7. Gap check, not a finding: the site's per-topic depth (about six positions per topic) is a rough size signal for items per micro-skill [I]; compare with our items per node.

## 8. Next steps (not done)
- Open 3 to 4 more pages (a mate-pattern page, the relative pin, interference) to see example quality and whether any claim needs checking; not done.
- Run an item-count by fork/discovery piece type against `content/items`.
- No Chessable or Amazon content read; no contents of the print volumes compared.
