# The benchmark to beat (consolidated, 8 Nov 2026)

One list from all the competitor research, so plans point at one place. Sources (all in `docs/`): `research-chesscom-lessons.md` (free lessons, Addenda 2 and 3), `research-chesscom-trial-*.md` (beginner, tactics/strategy/endgames, openings/games, site tour; made on Andrew's own trial account), `research-competition-wide.md`, `research-competition-videos.md`, `research-learner-voice.md`, `research-curriculum-orders.md`, `research-learning-science.md`, `research-chesstactics-org.md`, `chess-steps-comparison.md`, `competition-chesscom.md`. Labels: [V] seen or measured, [S] secondary, [I] our inference, [H] hypothesis. Coverage limits: only the parts of chess.com listed in the research files were played; the full course library is being worked through (see `docs/research-chesscom-progress.md` once it exists).

## A. What they do that we must match (gates we can measure)
| # | Benchmark | Source | Our status | How we will check it |
|---|---|---|---|---|
| A1 | First move within about 10 seconds of opening the first lesson | chess.com Learn To Play, Lichess [V] | First guided game built; time to first move unmeasured | `check_path_time.py`: count prompt words before the first board action; fail over a limit |
| A2 | Coach bubble at most about 25 words, one idea | chess.com prompts 3-33 words, median 18 [V] | Cap documented, no lint | New lint in `validate_lessons.py` on bubbles and `say` fields |
| A3 | Three levels of refusal: illegal move snaps back with legal dots and no text; legal but off-task gets one line; wrong idea gets the refutation and the reason | chess.com [V] | Partly (reach and guided); no rule | Spec in `content-schema.md`, validator requires `refute` on wrong-answer items where a refutation exists |
| A4 | A fourth answer state: "alternative" (winning but not the main idea) | chess.com orange state [V] | Not built; items accept one key move | Item schema `alt[]` with engine-checked margin; validator checks each alt against the stated claim |
| A5 | Accept all engine-equivalent solutions, never reject a sound move silently | chess.com rejects sound moves in places (Mating Nets g4 about 0.26 pawn gap) [V] | Mate-in-n items accept all mates; others single-key | Extend `validate.py` to enumerate acceptable first moves within a stated margin |
| A6 | Two-step hints: first highlights the piece or asks a question, second shows the move | chess.com [V] | Hint ladder exists | Make step 1 a Socratic question per skill ("is any piece attacked?") |
| A7 | Hints that never give the move away before the learner chose to | chess.com hint 2 gives it away [V] | Ours fade with evidence | Keep ours; tested by `tests` on hint ladder |
| A8 | One clear arrow from lesson to lesson; a "Lesson Complete" moment | chess.com [V] | Lesson end card exists | Add piece badge and a concrete "next want" (name the next lesson and why) |
| A9 | Progress saved, with a visible path of what is next | chess.com path with Beginner/Intermediate/Advanced sections, nodes and checkpoint caps [V, Andrew's screenshots] | Map, Plan, Today | Keep; compare once a checkpoint concept is chosen (see C3) |
| A10 | Strong cover and short title for every course | chess.com [V] | Plain cards | Phase 3h (art), after the core |

## B. Where they are weak (our edge, keep it)
1. **No game at the end of a lesson or course.** Every lesson and course I played ends with the same "Lesson Complete" box and a return to the path; no bot link, quiz or recommendation [V, 3 agents]. Our guided game, game-per-block rule and Play Coach equivalent beat this (D55-D57).
2. **Impossible boards.** Several positions have no king (Capturing, Knight 5, Pawn 5) [V]. Ours are legal and validated.
3. **Loose rule wording** (castling "through check" in the 2026 course, "does not push a pawn" message wrong) [V]. Our claims are machine-checked.
4. **Lesson progress not saved mid-lesson; progress lost without an account; locked behind a daily limit and then a paid trial** [V]. Ours: free, no account, saved locally.
5. **Feedback inconsistent:** some wrong answers give a specific reason, some "try again" [V]. Ours: every item has a reason; check coverage.
6. **No unlabelled testing, no spacing, no retention measure** [V, absent in what I saw]. Ours: unlabelled mixes, evidence-weighted mastery.
7. **Game Review is a spectator view with no "your turn" retry** [V]. Our learn-from-mistakes and annotate-before-engine prompts are the retry step.
8. **Accuracy and "game rating" shown without uncertainty** [V]. Ours: evidence grades.

## C. What to adopt (ideas, with where each goes)
1. **Reach step with par** (done) and the play-first piece block (done).
2. **Contrast pair** in tactics lessons: the same position with colours reversed to show the refutation (chess.com Forks lesson) [V]. Goes in tactic lesson template.
3. **Checkpoint caps on the path** (the mortarboard nodes between skill tiles) [V, screenshots]. Candidate: a "show what you know" check per block, shown not gating (matches stage checks). Decision for Andrew.
4. **Stalemate taught by producing it** (chess.com Playing the Game) [V]. Goes in the first-hour stalemate lesson.
5. **Opening lessons begin from a loaded position at move 4 to 10, often with a trap, not from move 1** [V]. Candidate shape for deep-dive lesson openings.
6. **Model games: guess only the winner's moves with coach comments between** [V]. Check against our famous-games shape.
7. **Per-theme personal score and a "puzzles I missed" retry set; two-puzzle on-ramp; weekly daily puzzle from our bank** [V, Puzzles tour].
8. **One-screen game summary (accuracy, class counts, phase grades) before the walk-through; show-best-move variation with Resume** [V, Game Review tour]. Goes to Analysis.
9. **Win/draw/loss bar on our master-stats table; opening-name strip while playing; small ladder of 8-12 character bots** [V].
10. **Learning-behaviour toasts** (annotated before the engine, retested after 3 days); no streak shame [I].
11. **From Chess Steps:** closing reminder card per lesson, pool roles, thinking-ahead strand, named search routine per tactic, pool-depth floor of about 30 [S, `chess-steps-comparison.md`].
12. **From chesstactics.org:** three unifying ideas for tactics (double threat, loose piece, forcing move) and piece-specific fork and discovery coverage [V, `research-chesstactics-org.md`]. Link only: its licence forbids copying.

## D. What to avoid
Speed points and strike pressure on beginners; a rating attached to a theme; cosmetic reward tracks; ads or sale banners near learning; account walls; queue-based analysis; video-first teaching (we are text-and-board by decision); anything that claims a rating without grade (rule 6).

## E. Curriculum order notes (from `research-curriculum-orders.md`, `research-chesscom-lessons.md`)
- chess.com's rules course covers rules only (king, queen, rook, bishop, knight, pawn, en passant, capturing, check, out of check, checkmate, castling) with no set-up, notation, stalemate or draw lesson; ours adds them in the first hour [V for theirs].
- Tactics come early everywhere (Lichess, Chesscademy, Steps) [V/S]: our re-sequencing is item 3 of `priority-order.md`.
- Castling taught with real conditions (not through or out of check, pieces unmoved); en passant and stalemate are the confusion points to over-explain [V, learner voice].

## F. Still unseen (do not claim)
Most of chess.com's roughly 395-course library beyond the lessons recorded in the research files; ChessKid; Noctie; Chesscademy's interactive lessons; Duolingo Chess; Yusupov later volumes; Polgar order; Rensch chapters. Each is a research task in `ROADMAP.md`.
