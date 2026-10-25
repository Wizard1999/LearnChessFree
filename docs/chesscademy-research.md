# Chesscademy: what it was, what people said, why it matters here

Research done 2026-10-24 from the Wayback Machine (captures 2013–2021), the 2013 founder interview, press, and Hacker News/MetaFilter threads. **Not found / blocked:** Reddit (the tool blocks it), any official shutdown notice, the lesson videos and the exercise content itself (it sat behind login and was never archived). Labels: **[V]** read directly in an archived page or thread; **[S]** secondary/aggregator; **[U]** not established. Quotes are paraphrased on purpose.

## 1. Timeline

| When | What | Source |
|---|---|---|
| Jun 7, 2013 | Founded by Andrew Ng (chess NM, Princeton), Francis Hinson (developer, Rochester), Sabar Dasgupta (database/algorithms, high school). Started as a two-day hackathon idea: short chess videos. They then "took a more structured approach": courses, lessons, videos, exercises, quizzes, plus a badge/points system. First version took about two months. | [US Chess interview, Aug 2013 (Wayback copy)](https://web.archive.org/web/2014/https://www.uschess.org/content/view/12325/221) **[V]** |
| Aug 2013 | Public launch; Hacker News front page (about 228 points). Videos briefly broke when Dropbox throttled them. | [HN thread](https://news.ycombinator.com/item?id=6235450) **[V]** |
| Fall 2013 | Founders returned to school; full-time work resumed Jan 2014. | HN founder comments **[V]** |
| Feb–Aug 2014 | Techstars NYC office space (not officially in the program); Imagine K12 cohort; 10–15k unique visitors/month (Feb 2014); relaunch on HN Aug 2014 (about 438 points, 116 comments). | [Daily Princetonian](https://www.dailyprincetonian.com/article/2014/02/start-ups-chesscademy-wick), [HN thread](https://news.ycombinator.com/item?id=8155431) **[V]** |
| 2015 | Redesign from a "Course Library" to guided **Paths** (§3). About page claims 40M moves played, 190+ countries, "80% user improvement" (a site claim, not verified). | Wayback captures **[V]** (claim itself **[U]**) |
| Dec 2015 | Third HN thread (about 207 points); users report unanswered bug reports and ask if it is abandoned. | [HN thread](https://news.ycombinator.com/item?id=10694545) **[V]** |
| Apr 2017 | Founder comments that the company was raising $750k and that monetization was very difficult. | HN comment, 2017-04-25 **[V]** |
| Jun–Dec 2018 | Marketing homepage still renders ("Learn how to play chess. Watch videos, solve puzzles, and play games. All for free."). | [Wayback 2018-06-16](https://web.archive.org/web/20180616071217/https://www.chesscademy.com/) **[V]** |
| Apr 2019 | Inner pages (about, faq, welcome) show an "Application Error." | Wayback **[V]** |
| Dec 2021 | Site says "Offline for Maintenance." | Wayback **[V]** |
| Sep 2026 | The domain no longer resolves cleanly (Cloudflare "DNS points to prohibited IP"). | Wayback **[V]** |

**Why it ended** is **[U]**. The evidence points to a free product that never found a way to pay for itself, a founding team that moved on (the founder later worked on other startups, per his HN comments), and infrastructure left to decay. I found no shutdown announcement.

## 2. What it taught (the curriculum as archived)

**2014 "Course Library"**, four public courses (each lesson = video + exercises + quiz) **[V]**:
- *Getting Started*: The Pieces; Setup and Notation; Basic Rules; Basic Strategy.
- *Moving Past The Basics*: Intro to Tactics 1 (fork, pin, skewer, combining tactics) and 2 (discoveries, overloading, deflection, decoy, removing the defender); Checkmating the Lone King and Other Mating Patterns; Stages of the Game: An Overview of Openings.
- *Diving Deep*: The Art of Attack and Calculation; Introduction to Positional Chess; Imbalances, Planning by Position (two parts).
- *Endgame Essentials*: Lucena; Philidor; Opposition and Breakthrough (K+P); K+P vs K+Q.

**2015+ "Paths"** (the redesigned structure) **[V]**:
- *Getting Started* (17 steps; about 67k students): the four lessons above, then Tactics 1–2, Mating Patterns, Stages of the Game, with Tactic Sets and Game Sets between lesson blocks.
- *Basic Planning and Awareness* (20 steps; instructor IM Daniel Tapia): The Two Kinds of Blunders; Poorly Protected Pieces; Visualizing Pieces; Getting and Giving Up Squares; Grandmaster Blunders 1–2; What Is a Plan?; Getting Good Pieces Out of the Opening; Optimizing Your Pieces; Creating a Threat; Endgame Plans.
- *Attack and Defense* (15 steps): The King in the Center; Attacking the Castled King; Mating Patterns; Defensive Maneuvering; Accepting Sacrifices; Sacrificing Material; Counterattack.
- *Advanced Strategy* (13 steps): the Diving Deep lessons, then Basic Prophylaxis, Advanced Prophylaxis, Examples from Grandmaster Games.
- *The Fire Breathing Sicilian Dragon* and *Endgame Essentials*, plus a public "Future Paths" roadmap page.

**Your memory vs. the record:** "it eventually got into a black response opening" is the Sicilian Dragon path **[V]**. The specific lessons you remember (a Greek gift, castle-or-be-attacked, move each piece once, bishop pair, connecting rooks, open files, passed pawns) are not in the public lesson titles. Several plausibly sit in the logged-in lesson parts of *Basic Planning and Awareness* ("Optimizing Your Pieces", "Getting Good Pieces Out of the Opening") and *Attack and Defense* ("Attacking the Castled King"), but I could not verify that, and I will not claim it.

## 3. How it worked (from the 2015 FAQ, which is the best description of the design) **[V]**

- **Paths** were "guided curriculums," assigned by your current ability, containing lessons, tactic sets and game sets.
- **Tactic Sets** followed the lesson's themes. **Game Sets** were games against the computer "to test your mastery" of the lesson.
- **Checkpoints** let you **test out** of earlier steps, or a whole path, by beating the computer in a test-out game.
- Quizzes required all answers correct to complete a lesson.
- **Train** was a Glicko-2 rated tactics trainer ("make the absolute best move"); tactics carried motif tags; explanations were written by experienced community members.
- **Play**: 12 AI levels; games saved; multiplayer promised for April 2015.
- Points, badges (bronze/silver/gold) and daily streaks: about 25 badges, including "complete all courses."
- Tech: Rails app, chessboard.js, HTML5/jQuery; the board was drag-and-drop.

## 4. What people said

**Praise [V]** — "a well-written chess book with interactive diagrams" (MetaFilter, 2014); a step-by-step tutorial from scratch with videos and interactive exercises (HN); a MOOC approach that stays fun and manageable (HN); a very guided, beautifully designed tool (testimonial); the opening explanations clearer than others a commenter had seen (HN 2013); the tactics were "addictive" and sometimes harder than at Chess.com; a user's child came to love chess after the videos. A reviewer called it one of the best places online to develop chess skill.

**Criticism, mostly about execution [V]:**
- Exercises that accepted a single move and rejected valid alternatives (for example, another bishop pin that also worked); hints that never escalated and repeated verbatim after ten failures; no explanation of *why* a move was wrong; some exercises solvable only by trial and error.
- A detailed 2013 critique (a user "jfarmer") of the pin exercise: undefined terms ("absolute pin" was never explained), hints that didn't model how an expert thinks, and the learner reverse-engineering the answer from right/wrong feedback instead of reasoning. He suggested annotated boards and hints like "which of your pieces can attack along a line toward something bigger?"
- Tactics quality: some looked auto-generated or ended implausibly; some froze; buggy ones lingered.
- Rating system: new-player ratings swung 20+ points on a few problems (provisional rating handled badly); puzzle difficulty varied randomly.
- Friction: Facebook sign-in rejected names with periods, hyphens or accents; drag-and-drop was poor on touch screens; no subtitles; contrast and button affordances; videos hosted on third-party services that broke under load; no "give up/show solution".
- A late-2015 user said touch bugs reported several times got no response and asked if the project was abandoned.

**The founder's replies [V]** acknowledged most of this and planned fixes: explanations of why a move is wrong, tracking common wrong answers to target feedback, motif tags, Stockfish-based checking, a post-exercise analysis mode, a "show solution" option to discourage brute-forcing, better rating deviation, adaptive onboarding for Train. His stated differentiator: a focus on **education and progression** ("each course should prepare you for the next"), not multiplayer. The long-term plan reported by the press was to **combine Learn and Train and personalize by past performance** (Daily Princetonian, 2014), and to sell to schools.

## 5. What this means for the new design

Chesscademy's **core loop was a primitive cue ladder** that closely matches the design in `03-product-design.md`: *lesson (cued) → themed tactic set → mixed tactics → a game against the computer to prove it*, with test-out checkpoints. It worked well for you, and its own users asked for exactly the fixes our design already contains. Its failures were mostly about **correctness of answers and feedback, scale of content verification, and sustainability**, not the idea.

| Chesscademy | Our design |
|---|---|
| Single accepted move per exercise; rejected valid alternatives | Claim-verified items with accepted *sets*, checked by engine (validator) |
| Hints that don't escalate; no "why wrong" | Escalating hint ladder; reasons from deterministic detectors; contrast lab |
| Quality of auto-generated tactics unknown | Every item validated; corpus items filtered and re-verified |
| Glicko-2 without good provisional handling | Item and learner ratings with explicit uncertainty and evidence grades |
| Path **assigned** by ability; test-out by beating the computer | Visible full graph, challenge-out tests, and game evidence at cue level 4 |
| Game Sets = beat the computer | Keep it. **Change to v1 scope: include a basic bot for "play it out" tasks** (see below) |
| Third-party hosting, logins, abandoned bugs | Static, local-first, no accounts or external video host in v1; exportable |
| Free with no revenue model → decay | Not a business goal; open licence + exportable data so it can outlive the author |
| Videos as the main teaching medium | Text-first with boards (captions solved by construction); video optional |
| Lessons are pass/fail | Mastery counted at cue levels 3–4 (unlabeled, in play) |

**One change to the design:** the user-loved part of Chesscademy was applying each idea in a real game. Our v1 scope (D10) had deferred bots. Revised: v1 includes a **basic engine opponent** for lesson "play it out from this position" tasks and game sets (Stockfish at a limited strength; whether this build exposes strength limiting must be checked, **[U]**), because that is the cue-level-4 evidence the whole model depends on. Humanlike bots (Maia) remain later.
