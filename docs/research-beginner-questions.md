# Beginner questions in their own words: extension of the learner-voice study (8 Nov 2026)

Extends `docs/research-learner-voice.md` (not repeated here). Rules followed: `CLAUDE.md` rules 3 (evidence labels) and 4 (original wording; at most one short quote per section).

## Method, labels and what could not be read
- **[V]** the page was opened with the fetch tool this session and a small model summarised it for me. Strictly this is a machine summary of the page, not a line-by-line reading by me, so treat [V] as "opened and summarised", slightly weaker than a full read.
- **[S-snip]** only a search-result title or search summary was seen; the page was not opened. Lead, not evidence. Counts that rely on these are marked.
- **[I]** my inference. **[H]** hypothesis.
- **Chess Stack Exchange could not be read.** The fetch tool refused the domain outright (`chess.stackexchange.com`, three tag pages tried: rules, beginners, stalemate), and two searches restricted to or aimed at that site returned no Stack Exchange pages. So **there are no Stack Exchange vote or view counts in this document**, and the CC BY-SA source the brief named is entirely missing. A future pass needs a different lawful route (their public data dump or API, if Andrew approves one).
- **Lichess "Chess Beginners" forum category:** the category URL I tried returned 404. I used Lichess "General chess discussion" and "Game analysis" threads that search surfaced instead. Two Lichess pages 404ed and one blog 403ed (not read).
- **Reddit:** two search results were Reddit mirrors (an r/beginnerchess mirror and an r/chessbeginners mirror). I did not open them and did not use their content.
- Most evidence is chess.com forum threads, because search returned them for rule questions. That is a skew; I note it where it matters. Handles are used only for the poster whose thread is the evidence; otherwise paraphrase.
- Counts are mine, from the 70 items in the catalogue below. They show **breadth of mention in what I read, not frequency in the population**.

## Catalogue of distinct beginner questions and struggles (70)
Codes: R rules, N notation and vision, O after the opening, B blunders, T tactics, A adults and time, P plateau, S study first and resources, K bots and ratings, X online vs OTB (over the board), G ending the game (resign, draw).

| # | Theme | Question or struggle (paraphrase) | Source | Label |
|---|---|---|---|---|
| 1 | R | Can the king castle when the rook's path crosses a square the other side attacks? (poster thought it was illegal) | [chess.com forum, castle through check](https://www.chess.com/forum/view/for-beginners/how-did-my-opponent-castle-through-check) | V |
| 2 | R | If my knight attacks their rook, shouldn't castling be illegal? | [chess.com forum, "shouldn't this be illegal"](https://chess.com/forum/view/for-beginners/shouldnt-this-be-illegal) | V |
| 3 | R | I learned you cannot castle with the rook under attack: is that wrong? | [chess.com forum](https://www.chess.com/forum/view/general/i-thought-you-can-t-castle-with-your-castling-rook-under-attack?lc=1) | S-snip |
| 4 | R | Does an earlier check cancel my right to castle later? | [chess.com support: how do I castle](https://support.chess.com/en/articles/8557430-how-do-i-castle) | S-snip |
| 5 | R | Day-3 beginner: Black has no legal move and is not in check; why is it a draw when White clearly won? | [chess.com forum, why there is draw](https://www.chess.com/forum/view/game-analysis/why-there-is-draw) | V |
| 6 | R | Why is a boxed-in king a draw rather than a win? | [chess.com forum](https://chess.com/forum/view/endgames/why-is-a-boxed-in-king-stalemate-a-draw) | S-snip |
| 7 | R | Why does stalemate count as a draw at all? (long debate thread) | [Straight Dope board](https://boards.straightdope.com/t/why-does-a-stalemate-count-as-a-draw-in-chess/623845?page=3) | S-snip |
| 8 | R | Does a pawn really capture sideways, or did the opponent cheat when my pawn vanished? (en passant) | [chess.com article, most misunderstood rules, by staff writer Nathaniel Green](https://www.chess.com/article/view/the-most-misunderstood-chess-rules) | V |
| 9 | R | Can a pawn promote to a king, or only to a piece already captured? | same article | V |
| 10 | R | Can the king be captured? (why does the game stop at checkmate) | same article | V |
| 11 | R | What counts as "the same position" for threefold repetition: must it be consecutive? does castling or en passant change it? | same article | V |
| 12 | G | What does threefold repetition even mean? (asked by a sub-200 player) | [chess.com forum, when should resign](https://www.chess.com/forum/view/general/when-should-resign-ina-game) | V |
| 13 | G | Is a repetition draw automatic or must I claim it? | search summary over several pages, [e.g. Wikipedia: Threefold repetition](https://en.wikipedia.org/wiki/Threefold_repetition) | S-snip |
| 14 | X | Touch-move: must I move a piece I touched? what does "I adjust" mean? | [chess.com forum, first OTB tournament](https://www.chess.com/forum/view/general/general-first-over-the-board-chess-tournament) | V |
| 15 | X | When castling over the board, which piece do I touch first? | search summary of Lichess/chess.com OTB threads | S-snip |
| 16 | R | How does the fifty-move rule work and who claims it? | search summary ([DEV Community draws article](https://dev.to/chaprisalaaaa/how-does-a-chess-game-end-in-a-draw-5-ways-and-which-ones-beginners-accidentally-cause-18hc)) | S-snip |
| 17 | N | I cannot read "e4"; this blocks me from learning openings | [chess.com forum, reading notation](https://chess.com/forum/view/general/how-to-get-better-at-reading-chess-notation) | V |
| 18 | N | How long should it take before I can move by notation without looking at board labels? | [chess.com forum](https://chess.com/forum/view/general/how-long-after-getting-into-chess-should-one-try-to-master-algebraic-notation) | V |
| 19 | N | I know the notation but cannot picture the position quickly | [chess.com forum, board vision](https://chess.com/forum/view/general/board-vision-coordinate-training) | S-snip |
| 20 | N | Visualising moves from a book is confusing | [chess.com forum, memorizing coordinates](https://chess.com/forum/view/general/memorizing-coordinates) | S-snip |
| 21 | N | Following notation from Black's side is awkward | Lichess forum post surfaced by search ([redirect link](https://lichess.org/forum/redirect/post/Bb8mRZmm)) | S-snip |
| 22 | N | Should squares be taught before pieces? (an educator's view) | [Premier Chess](https://premierchess.com/chess-pedagogy/back-to-basics-notation) | S-snip |
| 23 | N | Is turning coordinates on or off better for learning the squares? | [Lichess feedback thread](https://lichess.org/forum/lichess-feedback/coordinates-notation-on-the-board-squares) | S-snip |
| 24 | O | After the book moves end every move feels wrong and the plan falls apart; I also have no terminology | [chess.com forum, book-move phase](https://chess.com/forum/view/for-beginners/what-am-i-supposed-to-do-after-the-book-move-phase) | V |
| 25 | O | I play e4, Nf3, Bc4, d3, castle, then have no idea what to aim for | [chess.com forum, what to do after the opening](https://chess.com/forum/view/general/what-to-do-after-the-opening-moves-beginner-player-here) | V |
| 26 | O | I know lots of opening theory but cannot decide where pieces go; they end up overloaded | [Lichess forum](https://lichess.org/forum/general-chess-discussion/is-there-anything-that-would-help-me-in-chess-that-i-dont-know) | V |
| 27 | O | How do I form a plan at all? | [chess.com forum](https://www.chess.com/forum/view/general/how-to-form-a-plan) | S-snip |
| 28 | O | Solid opening, then no middlegame | [chess.com forum](https://chess.com/forum/view/game-analysis/solid-opening-no-middle-game) | S-snip |
| 29 | O | Moving without a plan; ignoring the opponent's plan (two of five problems named by a ChessBase writer) | [ChessBase, Bill Gordon, 2018](https://en.chessbase.com/newsroom/post/five-problems-most-new-chess-players-face) | V |
| 30 | B | I have known the moves since 2020, still hang a piece nearly every game, stuck near 800: am I just not capable? | [Lichess forum, giving away pieces](https://lichess.org/forum/general-chess-discussion/how-to-stop-giving-away-pieces-to-my-opponent) | V |
| 31 | B | My blunders are two kinds: putting a piece where it is captured, and moving a defender so the defended piece falls. How do I train against that? | [Lichess forum, simple blunders](https://lichess.org/forum/general-chess-discussion/how-to-train-against-simple-blunders) | V |
| 32 | B | I peaked at 1129, have lost every recent game, and spend only a fraction of my clock | [Lichess forum, game analysis](https://lichess.org/forum/game-analysis/beginner-looking-for-improve-in-chess) | V |
| 33 | B | Please point out my flaws as Black; an early king move cost me castling | [Lichess forum, teach me](https://lichess.org/forum/general-chess-discussion/teach-me-how-to-get-better) | V |
| 34 | B | Beginners: how do I stop blundering? | [chess.com forum, Chess Mentor](https://chess.com/forum/view/chess-mentor/beginners-how-to-stop-blundering) | S-snip |
| 35 | B | Why do I keep bringing the queen out too soon? (listed as a main thing keeping players under 1000) | [chess.com blog, Benson_Gaterell, May 2026](https://www.chess.com/blog/Benson_Gaterell/the-5-biggest-mistakes-that-keep-chess-players-stuck-below-1000) | V |
| 36 | B | Why do my attacks fail? (attacking undeveloped, with an exposed king) | same blog | V |
| 37 | B | Should I capture whenever I can? (automatic trades hand the opponent open lines) | [chess.com blog, 7 mistakes 800-1200](https://www.chess.com/blog/IM-HAKUJI/7-mistakes-800-1200-rated-players-make-every-game-and-how-to-fix-them) (byline and "IM" prefix not explained on the page) | V |
| 38 | B | Pushing many pawns early instead of developing | same blog | V |
| 39 | T | I solve puzzles but never spot the tactic in my own games unless the game announces it | [chess.com forum](https://chess.com/forum/view/general/does-anyone-else-have-trouble-applying-tactics-theyve-learned-in-puzzles-to-their-games) | V |
| 40 | T | 63-year-old, two years in, takes minutes per puzzle, wonders if starting was a mistake | [chess.com forum, just not seeing it](https://www.chess.com/forum/view/for-beginners/just-not-seeing-it) | V |
| 41 | T | Simple tactics are not simple: why do I miss them? | [Lichess forum](https://lichess.org/forum/general-chess-discussion/simple-tactics-arent-so-simple) | S-snip |
| 42 | T | I know I should learn tactics but... (title only) | [chess.com forum](https://www.chess.com/forum/view/for-beginners/i-know-im-supposed-to-learn-tactics-but) | S-snip |
| 43 | T | Does my low puzzle rating mean my games are weak? | search summary (a Reddit mirror was mentioned; not opened) | S-snip |
| 44 | T | Should I guess and retry, or stop when a puzzle is too hard? | search summary, chess.com and chessmood posts | S-snip |
| 45 | A | Started at 40 after a TV series; what is a realistic goal and how should an older adult study? | [chess.com forum, learning later in life](https://www.chess.com/forum/view/for-beginners/learning-chess-later-in-life) | V |
| 46 | A | Can I learn if I cannot visualise? | [chess.com forum](https://chess.com/forum/view/general/possible-to-learn-chess-as-a-non-visualizing-adult) | S-snip |
| 47 | A | Is 35 too late? | [chess.com forum](https://chess.com/forum/view/general/is-35-too-late-to-start-playing-chess) | S-snip |
| 48 | A | Adults are slower than children and get discouraged by comparison | search summary of adult-learning pages (commercial chess teaching sites; incentive to encourage) | S-snip |
| 49 | A | I lose concentration late in a game and throw away good positions | ChessBase, Gordon (as #29) | V |
| 50 | A | I mostly play 3-minute blitz; how do I cope with slow games? | chess.com OTB thread (as #14) | V |
| 51 | P | Returning player, fell to 700, back to about 850, overwhelmed by the amount of material; what to study | [chess.com forum, 800-900 stuck](https://www.chess.com/forum/view/for-beginners/800-900-stuck-55684462) | V |
| 52 | P | Stuck at 800 again after almost a year: what happened? | [chess.com forum](https://www.chess.com/forum/view/for-beginners/i-havent-been-800-rated-for-almost-a-year-and-now-im-stuck-at-800-what-happened) | S-snip |
| 53 | P | Am I studying traps instead of fundamentals? | search summary across several blog posts | S-snip |
| 54 | P | Skipping game review is named as a cause of staying stuck | Benson_Gaterell blog (as #35) | V |
| 55 | P | Playing too fast: moves that merely look good | HAKUJI blog (as #37) | V |
| 56 | S | Opening, middlegame or endgame first? Replies split three ways | [Lichess forum, which part to study](https://lichess.org/forum/general-chess-discussion/which-part-of-the-game-should-a-beginner-spend-most-time-studying) | V |
| 57 | S | Should I study endgames first, as a classic author advised? | Lichess forum (as #26) | V |
| 58 | S | One opening or a few basic ones? | search summary, chess.com "where do I start" threads | S-snip |
| 59 | S | Adaptive or sequential lessons? Replies disagreed | same search summary | S-snip |
| 60 | S | I do not want to pay; what are free resources? | chess.com forum (as #24) | V |
| 61 | S | Which book for a total beginner who knows the moves but not how to think? | [chess.com forum, new to chess](https://www.chess.com/forum/view/for-beginners/new-to-chess-1) | V |
| 62 | S | Do I need a coach? | same thread | V |
| 63 | K | I beat 1000-1300 bots easily but lose to humans rated far lower: are bot ratings fake? | [chess.com forum](https://www.chess.com/forum/view/for-beginners/why-can-i-beat-1300-elo-bots-but-not-400-elo-humans) | V |
| 64 | K | How accurate are bot ratings? | [chess.com forum](https://www.chess.com/forum/view/community/how-accurate-are-the-bot-elo-ratings) | S-snip |
| 65 | K | A "1300" bot could not mate with king and rook | search summary of bot-rating threads | S-snip |
| 66 | K | New player beating advanced bots: what is my rating? | [chess.com forum](https://www.chess.com/forum/view/community/new-player-beating-advanced-bots-whats-my-elo) | S-snip |
| 67 | K | Should I play bots or humans to learn? | chess.com 800-900 thread (as #51) | V |
| 68 | K | Are site ratings lower than over-the-board ratings? | search summary of one thread (one user's opinion) | S-snip |
| 69 | G | Should I resign when 12-15 points down or when the opponent is rated higher? | chess.com forum (as #12) | V |
| 70 | G | Resign early or make them earn it? Sources disagree | search summary, Lichess and chess.com posts | S-snip |

Additional OTB items seen in the same OTB thread [V]: whether phones may be in the hall (differs by federation), shaking hands, not speaking while the opponent's clock runs, calling the director for an illegal move. Folded into #14 and theme X.

## Themes with counts (from the 70 items)

| Theme | Items | Of which opened [V] | Share of 70 |
|---|---|---|---|
| Rules confusion (R, plus G #12-13) | 16 | 8 | 23% |
| Blunders and hanging pieces (B) | 9 | 8 | 13% |
| Study first and resources (S) | 7 | 5 | 10% |
| Notation and board vision (N) | 7 | 2 | 10% |
| After the opening (O) | 6 | 4 | 9% |
| Tactics not seen (T) | 6 | 2 | 9% |
| Adults, time, motivation (A) | 6 | 3 | 9% |
| Plateau (P) | 5 | 3 | 7% |
| Bots and ratings (K) | 6 | 2 | 9% |
| Online vs OTB (X) | 2 (plus the extras above) | 2 | 3% |
| Resigning and ending (G #69-70) | 2 | 1 | 3% |

Notes: the rules count includes stalemate (3), castling (4), en passant (1), promotion (1), check/king capture (1), repetition and fifty-move (4), touch-move and OTB (2 counted under R/X). Counts are approximate because some items serve two themes. [I] The rules share is inflated by my search choice (I searched rule words), so do not read it as "rules are the biggest problem". What is robust is that **blunders/hanging pieces appear in every source type** (forum posts, blogs, articles) and that **rule confusions are specific, narrow and repeat**: the same five or six rules.

## Theme detail and what Scholarmate does

Coverage checked in `content/skills/`, `content/items/` and `ROADMAP.md`. "Covered" means a skill and items exist; all lessons are still `needs-human` (G3 review pending), so "covered" is not "proven to work".

### 1. Rules confusion (16 items)
Representative questions: why is a boxed-in king with no check a draw (#5); can the king castle when the rook's path is attacked (#1, #2); does a pawn really capture sideways (#8). The castling and stalemate threads each show the same two beliefs: "any attacked square blocks castling" and "if the king cannot move, I won". The misunderstood-rules article confirms the same list [V].
- **What we do:** Covered. `FND.CASTLE` lesson `lesson-bg-l-fnd-castle-1` has items on the king passing over a square and an explicit item that an attacked rook is fine because only the king's squares matter [V, read in the file]. `FND.ENPASSANT`/`FND.SPECIAL` have "did the pawn jump two squares or step one" items. `FND.STALEMATE`, `END.MATE-STALEMATE-AVOID` (mating without stalemating) and `TAC.STALEMATE-TRICK` cover the three stages of stalemate. `FND.DRAWS` items mention repetition and the fifty-move rule (python-chess backed). `FND.PROMOTE` exists.
- **Not covered / thin:** (a) the *reason* and history of stalemate-as-draw, which the questions keep asking (#5-7); (b) whether threefold repetition requires claiming, the equal-position subtleties (castling and en passant rights, #11, #13); `ROADMAP.md` already lists a rules completeness pass (fivefold, 75-move, dead position) as open; (c) "the king cannot be captured, the game ends first" (#10) as an explicit sentence.
- **Recommendation:** add a "rules you will argue about" lesson built on misconception-style items (the belief, then a position that refutes it), each tied to the learner's own game when the situation occurs. Trigger the stalemate lesson from a near-stalemate in a game (already the design in learner-voice section 8). Add a one-screen "why stalemate is a draw" note after the learner has felt it, not before.

### 2. Blunders and hanging pieces (9 items)
Representative: still hanging a piece nearly every game years after learning the moves (#30); moving a defender so the defended piece falls (#31); queen out too early (#35). Advice across threads converges: slow down, a per-move check of own pieces, then opponent's, then checks; predict the reply. One answer in the "simple blunders" thread made a point worth keeping: this is partly a discipline problem rather than a knowledge problem, and a checklist is a temporary crutch [V].
- **What we do:** Covered well in design: `SAF.LOOSE`, `SAF.THREAT` ("what does their last move threaten?"), `SAF.COUNT`, `LOOP.V1` safety scan, `LOOP.V2` checks/captures/threats. `OPN.PRINCIPLES` covers queen timing.
- **Not covered:** a drill for the specific "I moved the defender" error (check for it by name: `SAF` has no explicit "overloaded/removed defender in my own move" item that I could find; [I] unchecked in detail); no trigger that detects the learner's *own* repeated blunder type from played games (roadmap games-feeding-learning item is open).
- **Recommendation:** make the safety scan the most-repeated habit, with a named "defender check" step; a game-review detector for "left a piece loose / moved a defender", with the flipped-board puzzle idea (play threats from the opponent's side) as an item type.

### 3. What to study first and resources (7 items)
Representative: opening/middlegame/endgame first, answers split three ways (#56); which book for a total beginner (#61); free resources only (#60). Learners are overwhelmed by choice more than by lack of it (#51); one view in the surfaced results was to pick any single plan and commit.
- **What we do:** Covered by design: one path, Today card, Library of about 27 rights-checked books. The endgame-first argument is partly present (`END.MATE-*`).
- **Not covered:** an honest in-app "why this order" explanation addressing the three-way split; a short "what to ignore for now" list.
- **Recommendation:** on the first-path screen state the order and the reason in two lines, and list what is deliberately postponed (opening theory, advanced endgames). Cheap, answers a real repeated question.

### 4. Notation and board vision (7 items)
Representative: cannot read "e4" and feels blocked from openings (#17); knows notation but cannot picture positions (#19); how long should mastery take (#18, answers ranged from days to a few months). Common fixes: replay on a real board, say moves aloud, drill random squares.
- **What we do:** Covered: `FND.NOTATION` ("Reading and recording moves"), `lesson-bg-l-fnd-notation-1`, `lesson-b3-notation`, `FND.VISUAL` ("Board vision without the board"), coordinates and tap-to-see boards, and the earlier doctrine to defer notation.
- **Not covered:** an explicit statement of what "enough notation" is for each stage (the forum thread's own benchmark is a useful measurable: move by notation without edge labels).
- **Recommendation:** adopt that benchmark as the pass condition for `FND.NOTATION` D1; add a "random square" speed drill; keep notation away from the first 10 minutes.

### 5. After the opening (6 items)
Representative: the book moves end and everything feels wrong (#24); knows e4 Nf3 Bc4 d3 castle then nothing (#25). Replies give concrete small plans: improve the worst piece, find weak pawns or squares in the opponent's half, open files for rooks, play both colours.
- **What we do:** Covered: `POS.PLAN`, `POS.TARGET`, `POS.WEAKSQ`, `POS.ACTIVITY`, `POS.OPENFILE`, `POS.CONNECT`, and a large positional strand (50 nodes). Tranche 2b has an unfinished review pass.
- **Not covered:** a beginner-tier "first middlegame" lesson before the full positional strand: the poster questions are at 600-900 level, where the 50-node strand is far away. [I]
- **Recommendation:** a short bridge lesson "your opening is done: three questions" (are my pieces safe, which piece is worst, what can I attack), reusing the checks-captures-threats loop. Put it right after the first full-game lesson.

### 6. Tactics not seen (6 items)
Representative: solve puzzles but not in games unless the game announces them (#39); an older learner taking minutes per puzzle and doubting the whole attempt (#40). Advice: slow down, name the motif after solving, expect the gap since puzzles hide the "a tactic exists" signal.
- **What we do:** 24 tactic skills; `CAL.*` calculation; unlabeled testing (hard rule: items are unlabeled) addresses the "announces itself" problem directly; `GAME.OWN`.
- **Not covered:** puzzles from the learner's own games at their level (roadmap games-feeding-learning, open); a puzzle time-target pressure question (we do not show clocks on lessons, which is good [I]).
- **Recommendation:** keep unlabeled mixed sets prominent; add "name the motif" as a post-solve step; seed practice from the learner's own game positions once review exists.

### 7. Adults, time, motivation (6 items)
Representative: started at 40 after a TV series, asks for a realistic goal (#45); late-game concentration lapses (#49); blitz habits clash with slow play (#50). Replies encourage and give goals from about 1600 upward as anecdote [S]; many adult-learning pages are written by teaching businesses with an interest in encouragement [I].
- **What we do:** Partly. `PRA.RECOVER`, `PRA.CLOCK`, `PRA.LOAD`, `SELF.1-7` (self-direction) and the short-session Today card.
- **Not covered:** an explicit "adult starter" framing or realistic-goals page, no promises about rating; no concentration/stamina lesson at beginner level (`CAL.ENDURANCE` exists but is deep in the map).
- **Recommendation:** one honest page "what to expect": time per week, where progress stalls, no rating promise; keep rating claims out (hard rule 6).

### 8. Plateau (5 items)
Representative: returning player stuck near 850 and overwhelmed (#51); stuck near 800 for a year (#52). Cited causes: ignoring threats, playing too fast, skipping review, studying traps instead of basics.
- **What we do:** Covered in intent: `GAME.OWN`, `SELF.3` (diagnose), `PRA.*`, the thinking loops.
- **Not covered:** a visible "plateau is normal, here is the diagnostic" page in the app; the learner-voice doc already asks for review-as-habit.
- **Recommendation:** after N games without progress, show a diagnosis card from detectors (which blunder type recurs), not generic encouragement.

### 9. Bots and ratings (6 items)
Representative: easily beats 1000-1300 bots but loses to humans rated far lower (#63); asks how accurate bot ratings are (#64). Explanations in the thread: bot ratings are labels not measurements, bots make deliberate random errors and are weak in particular ways (hanging pieces but sharp at short tactics), humans are less predictable [V, one thread].
- **What we do:** Partly. Roadmap tasks on Maia/Stockfish levels and a "gentle" labelled setting; hard rule 6 forbids ratings without evidence grades.
- **Not covered:** a plain-language page "what a bot level means here"; no lesson or note on why beating a bot does not predict human results.
- **Recommendation:** label every opponent as a style (careless, greedy, tricky) with an honest note that the number is not a human rating; ship the "bot levels are not human ratings" explanation inside the first bot game. This also answers the learner-voice complaint 10.

### 10. Online vs over the board (2 items plus extras)
Representative: first OTB tournament after only 3-minute blitz (#50); touch-move and "I adjust" (#14); phone rules, not speaking on the opponent's time, calling the director [V, one thread].
- **What we do:** Not covered. Content grep for touch-move and "j'adoube" found nothing in skills or items. `ROADMAP.md` lists an optional tournament-readiness checklist (clock, writing moves, touch-move, claiming draws) but unchecked.
- **Recommendation:** a short optional "your first tournament" checklist lesson, clearly labeled optional, using the roadmap item. Federation differences (phones) must be stated as varying and sourced, not asserted.

### 11. Resigning and ending (2 items)
Representative: when to resign (#69). Replies: judge hopelessness, not material count; look for stalemate or repetition chances; resources disagree on resigning early.
- **What we do:** `TAC.STALEMATE-TRICK` and `PRA.RESIST` (practical resistance) cover the resource; no explicit resigning etiquette.
- **Recommendation:** add one item or note in `PRA.RESIST`: "resign when mate cannot be prevented or no resource remains; before that, check for a draw trick." Mark it as etiquette, with no engine claim.

## Cross-cutting findings [I]
1. The questions are narrow and repetitive. Five rule beliefs (attacked rook blocks castling, any attack blocks castling, stalemate should be a win, en passant is a cheat, repetition is automatic) account for most rule posts I read. Each can be a one-position refutation item.
2. "Know the moves, still hang pieces" is the most persistent struggle, across forum, blog and article. Habit (check before moving), not information.
3. Learners keep asking "what do I do now?" at two points: after the book moves, and when picking study material. Both want a **named small next step**, not a theory.
4. Bots: the confusion is partly about meaning. A label is cheaper than a better bot.
5. OTB readiness is the one theme with no coverage.

## Gaps summary (for the roadmap)
- Not covered: touch-move/OTB readiness; bot-level meaning; "why stalemate is a draw"; threefold repetition claim mechanics; explicit adult expectations page.
- Thin: first-middlegame bridge lesson; "moved a defender" drill; notation pass benchmark.
- Evidence still missing: Chess Stack Exchange views and votes (blocked), Lichess "Chess Beginners" category (404), anything from app-store review text (already noted as unreachable in the earlier study).

## Sources opened [V], with author where the page gave one
chess.com articles and blogs: [misunderstood rules](https://www.chess.com/article/view/the-most-misunderstood-chess-rules) (staff writer Nathaniel Green); [Benson_Gaterell, May 2026](https://www.chess.com/blog/Benson_Gaterell/the-5-biggest-mistakes-that-keep-chess-players-stuck-below-1000); [IM-HAKUJI blog](https://www.chess.com/blog/IM-HAKUJI/7-mistakes-800-1200-rated-players-make-every-game-and-how-to-fix-them). ChessBase: [five problems](https://en.chessbase.com/newsroom/post/five-problems-most-new-chess-players-face) (Bill Gordon, freelance writer, 2018). chess.com forum threads: castle through check, shouldn't this be illegal, why there is draw, when should resign, first OTB tournament, book-move phase, what to do after the opening, reading notation, master notation timing, 800-900 stuck, tactics gap, just not seeing it, learning later in life, new to chess, 1300 bots vs 400 humans. Lichess forum threads: giving away pieces, which part to study, teach me, anything that would help, simple blunders, advice for beginners, beginner looking to improve. Two search-result Lichess pages 404ed (what am I doing wrong; chess beginners category) and a Lichess blog returned 403.
