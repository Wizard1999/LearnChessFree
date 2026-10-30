# Competition study: chess.com's beginner path against ours (30 October 2026)

Evidence labels: [S] read on a public page today (sources at the end); [R] recalled, not rechecked; [I] inference; [H] judgement or hypothesis. I did not use chess.com as a learner, so what the lessons feel like in practice is not [V]. I did not copy any lesson text. Chess.com's own pages did not give a lesson count or the lesson titles of the first courses (not found in public search results, not behind a bot check); tier limits are inconsistent across pages (see section 1).

## 1. How chess.com teaches a beginner

- **Structure.** The Learn Path has four skill levels (New to Chess, Beginner, Intermediate, Advanced). Each holds courses; each course holds lessons and challenges. Tiles are locked, available or completed; the first lesson of any course is open, and skipping ahead asks for confirmation. A separate Lesson Library is browsable by topic (openings, strategy, tactics, endgames, master games), level, theme or instructor. [S: help centre "How do lessons work"]
- **Format.** Newer Learn Path lessons are interactive and coach-guided with practice challenges, replacing the older video lessons, which remain in the Library. The coach can be muted. [S: same article] Interactive boards, quizzes, bots, puzzles and a coach are the toolkit. [S/R]
- **Courses.** In 2025 chess.com added Courses on Chessable's MoveTrainer technology, with spaced repetition, expert video and a free "Starter Kit" for each member. [S: announcement; marketing claim of "4.6x faster" is theirs, no evidence given]. An article on what to study after the moves recommends five or six mostly Chessable courses (a free primer by Danny Rensch, a workbook on board vision, a calculation course, a blunder-avoidance course), explicitly without a fixed order. [S]
- **Lesson count.** No official number found. A community blog says the "Beginner" achievement needs all 30 lessons of the Beginner category; a forum user calls the beginner guide "about 10 short videos". Both are unofficial and may predate the redesign. [S, weak]
- **Free against paid.** Help centre: free members get the New to Chess section unlimited plus one other lesson per day; Premium gets everything. Features page: free gets one game review a day, 3 puzzles a day, one game against the Coach a month, about 20-25 bots; paid tiers lift these (Diamond adds a coach explanation on every move). Videos are not on the free plan. One features table said "1 per week" for extra free lessons, so the cap has changed over time. [S, conflicting]
- **Game review and coach.** Review is a once-a-day free analysis with engine-based move classification; the paid "coach explanations" are the human-sounding layer. The Play Coach is criticised by users for recommending moves without explaining why and for rating estimates far above reality. [S: forum, anecdotal]
- **Known complaints about the beginner experience.** Users describe no clear roadmap, beginner and advanced material mixed, thin and non-progressive beginner lessons, and confusing level labels. [S: forum thread, anecdotal]

## 2. Our first stages (S0 to S3: 81 lessons; S4 adds more, so "about 100" in the brief is reached with S4)

S0 Moves and the board (7 lessons), S1 Legal play (19), S2 First complete games (14), S3 First wins (41). [V: content/path.json]. Six sampled lessons have 7 to 15 steps (about 3 cards, 1 to 3 boards, a predict-first contrast, 2 to 10 test items, a reflection) and 8 to 12 minutes [V]. Cards are short, and most boards carry a machine-checked claim [V].

| Topic | Chess.com treatment | Ours | Stronger, and why |
|---|---|---|---|
| Moves of the pieces | Coach-guided interactive lessons, one course; first free [S] | 7 intro lessons plus a "busy position" repeat per piece in S1; unlabelled testing of destinations [V] | Ours on rigour and repetition; theirs probably on warmth and pacing [H] |
| Check, mate, stalemate | Part of New to Chess, with challenges [S] | CHECK-1/2, STALEMATE-1/2, mixed positions; "three ways out" test [V] | Ours on depth and sorting practice [H]; theirs on voice and animation [H] |
| Castling, promotion, en passant | Covered in New to Chess [S] | Two or three lessons each, with "can I do it right now?" tests [V] | Ours on depth [H] |
| Notation and values | Not found; likely inside Beginner [R] | NOTATION-1 (15 steps), VALUE-1, count-attackers lessons [V] | Unknown; ours is checked [I] |
| First opening habits | Opening lessons in the Library with video [S via forum] | OPENING-1 with contrasts showing habits as conditional, then PRINCIPLES/NONDEV/TRAPS [V] | Ours on "why and when it fails" [H]; theirs on volume of named openings [H] |
| Safety and blunder check | Courses on board vision (Chessable, paid or Starter Kit) [S] | A safety scan, loose pieces, threat questions, taken through three loops [V] | Even; theirs has more drills, ours has the habit design [H] |
| Mate in one, forks, pins | Puzzles (3 a day free) and tactics lessons [S] | Pattern lessons plus 7,000 checked items; fork lesson only 7 steps [V] | Ours on checking; they win on puzzle volume (millions) [R] |
| Basic endgames (KQ, KR mate, opposition) | Endgame lessons, videos [R] | Tablebase-checked lessons, stalemate-avoid lessons [V] | Ours on correctness; unknown on clarity |
| Playing practice | 100+ bots, live play with 100M+ players [S/R] | Play page against Stockfish levels; no opponents | Theirs by a huge margin |
| Reviewing a game | One free review a day; coach explanations paid [S] | Games review, detectors, annotate-before-engine lesson [V] | Different bet: ours teaches self-review; theirs shows more instantly [H] |

## 3. Where we are weaker (honest)

1. **Production and warmth.** A voiced, animated coach with a personality beats our text cards. We have a good deal of silent reading. [H]
2. **Video.** None, by choice; some learners will not read. Chess.com also moved away from video for new lessons [S], which weakens that point but not the preference for spoken explanation.
3. **Bots and live play.** 100+ personalities and a huge player pool against our single engine page. Maia-style human-like opponents would narrow this (the owner likes the idea; not built). [I]
4. **Volume and polish.** Many courses, mobile apps, daily puzzle streaks, leagues and a community. [S/R]
5. **Social and motivation.** Friends, clubs, rating, streaks. We have none and deliberately no accounts. [V]
6. **Human review.** Their courses are written by named titled players; ours are all `needs-human`. This is our biggest trust gap. [V]
7. **Our own shallowness.** The owner's review is right: several S3 lessons are 7 to 9 steps with short cards (the fork lesson has one board and two cards). On depth we currently match the "lazy slideshow" charge. [V]

## 4. Where we can clearly beat them

1. **Verified claims.** Every learner-facing claim is checked by rules, engine or tablebase. Users report that their coach states moves without reasons and gives inflated ratings [S, anecdotal]. We can make "every statement checked" the headline. [V for us]
2. **Unlabelled testing.** Tests do not name the idea, which trains recognition instead of recall; the contrast lab shows what changes. Chess.com's lesson challenges are labelled by lesson [R, I].
3. **Evidence-based progress.** Mastery with refreshers, grades on evidence, no ratings attached to concepts. Their spaced repetition lives in paid Courses [S].
4. **Free forever, offline, no account, no gating.** Their free tier caps lessons, reviews and bots [S].
5. **One prerequisite graph with nothing taught twice,** answering the "no clear roadmap" complaint [S, anecdotal; V for ours].
6. **Deep explanation: conditions, failures and reasons.** Our lessons already say "when it holds and when it fails" [V]. With 12 to 20 boards and real explanation per lesson, we could be the deepest free beginner course. [H]
7. **Teaching how to learn:** reflection steps, process goals, load and recovery lessons. Not found in chess.com's beginner path in my search [I].

## 5. Ten improvements to our first 100 lessons, in priority order

1. **Deepen the 20 weakest S3 lessons to 14 to 20 steps** (fork, pin, skewer, back-rank, discovered, double check first): one idea per card, 4 to 6 shown lines, a checked "does it work?" failure case. Highest impact against the "slideshow" charge.
2. **Show every line on a board.** Replace notation strings in prose with `line` boards (already supported); lint for cards containing three or more move tokens.
3. **Spoken narration** for S0 to S3 (pre-generated audio, decision D39) so the first hours are not silent reading.
4. **A 30-minute "first game" on-ramp** with a gentle bot and prompts before and after each phase, to answer their bots and Coach; later a Maia-style option.
5. **Reasons-first rewrites of the piece-movement block:** why the knight's colour flips, why bishops pair, with 5-minute "teach it back" reflection (we have `reflect` steps; use them to ask the learner to explain).
6. **Add a visible 100-lesson path with a progress ring and "what this unlocks"** on the Today page, to put the roadmap in front of the learner (their main user complaint).
7. **Mixed-pattern retrieval sets** after each tactics lesson (unlabelled, fork/pin/skewer/none), plus daily puzzles drawn from our checked bank.
8. **Third-party viewpoints, with sources named,** in rephrased form: e.g. how coaches suggest the order for beginners [H until sources are read]. Add a "Different coaches disagree" card to opening principles.
9. **Add stalemate and draw-avoid practice inside mate lessons,** since "wins material must not end in a draw" is a validator rule but not yet a teaching moment. [I]
10. **Get one strong player to review S0 to S1,** clearing `needs-human` for the first 26 lessons, then publish "reviewed by" on each; this closes trust gap 6.

## Sources read today

- Chess.com support, "How do lessons work": https://support.chess.com/en/articles/8609703-how-do-lessons-work
- Chess.com support, membership tiers: https://support.chess.com/en/articles/8562418-what-does-each-level-of-membership-get-me
- Chess.com features guide: https://www.chess.com/article/view/chesscom-features
- Courses announcement: https://www.chess.com/announcements/view/improve-4-6-times-faster-with-chesscoms-new-courses-feature
- What to study next: https://www.chess.com/announcements/view/you-know-how-the-pieces-move-what-should-you-study-next
- Forum thread on the missing beginner roadmap: https://www.chess.com/forum/view/for-beginners/a-call-for-a-real-beginner-roadmap-on-chess-com
- Community blog on Beginner lesson count: https://www.chess.com/blog/Nightwish85/beginner-complete
- Not done: chess.com lessons pages themselves, the in-lesson experience, lesson titles. Chessable's and Chess Steps' own pages not read here.
