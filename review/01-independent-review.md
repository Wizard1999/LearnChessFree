# Independent review of the chess school plan (v0.4)

Review 1 — 2026-10-24 — planning only; no website code has been written.
Companion files: `02-chess-verification-report.md`, `evidence/`, `scripts/`.

## 0. What I reviewed, and how to read the evidence labels

**Read in full:** the attached combined handoff, which is byte-for-byte equivalent (whitespace-normalised) to the zip's `08` file and to each separate file in the zip; the zip's SHA-256 values match its `MANIFEST.json`. That covers the user requirements, rationale, conversation context, master plan v0.4 with its 37-source register, the review prompt, the original brief, and the open-issues file.

**Labels used throughout**

| Tag | Meaning |
|---|---|
| **[V]** | I verified it this session: ran code, or read the official/primary page. |
| **[S]** | Seen only in search snippets or secondary descriptions. Plausible, not confirmed at source. |
| **[U]** | Not verified. |
| **[J]** | My judgment or hypothesis. Needs testing. |
| **[X]** | Rejected, or I could not substantiate it. |

**What I did not do:** read any book in full; use any paid product; contact anyone; run learners. Several publisher pages (New In Chess, Simon & Schuster) returned HTTP 403 to my fetch tool, so book details below are [S]. Fetched pages were summarised by a small model, so figures taken from them (the FIDE regulations, the competitor pages) should be re-read at source before they go into product copy.

**Independence caveat:** I had the draft in context throughout, as the prompt anticipated. My agreement with parts of it is not independent confirmation. Where I rely on the draft's claim without checking it, I say so.

---

## 1. Verdict

**Strongest parts of the draft** (keep them)
- It separates what is known from what is proposed. Few education plans do that, and it makes review possible.
- Four separate rating attributes — introduction timing, task difficulty, mastery expectation, student strength — and an explicit "uncalibrated" state. The framing is right; the execution (section 4, I-07) falls short of it.
- A student model built on evidence and uncertainty rather than labels, with diagnosis kept tentative.
- Self-direction as a taught, assessed strand with responsibility transfer, rather than a closing lecture.
- Falsification criteria, a pilot design that compares against a credible alternative, and AI confined behind verified facts.

**Errors and gaps I found** (details in section 4)
1. **Sample Lesson 3 is invalid.** Black wins White's rook on move one. [V]
2. **Sample Lesson 2's answer set is not established.** The main lines hold; "1.b6 is the unique move" does not. [V]
3. **The mastery gate has no stated target**, and its error rates are mediocre when you compute them. [V]
4. **Phase 1's content count is too small for its own gate** by roughly 2×. [J, arithmetic shown]
5. **The reference rating pool cannot be calibrated** (closed data), and 64 clusters carry only 8 distinct values. [V from plan text]
6. **The best free calibration data was not used:** Lichess's CC0 puzzle database, with Glicko ratings and themes, plus a 416-million-position evaluation set. [V]
7. **Competitor table is stale or incomplete:** ChessMood's free tier, a missing direct competitor in the game-to-training loop (Aimchess), and a misapplied "4.6×" claim. [V]/[S]
8. **Shutdown resilience — the reason this project exists — is deferred to "later."** [V from plan text]
9. **Two overlapping eight-level systems** (Tiers 0–7 and Stages A–H) with no mapping. [V from plan text]

**Highest-value changes** (explained in section 5)
1. Make the curriculum a node × depth graph, with tiers as a derived view.
2. Replace the single Elo-per-topic idea with item-level difficulty, learner skill vectors, and an evidence grade on every rating claim; anchor on Lichess; bootstrap from open data.
3. Replace the 8-of-10 gate with an evidence model whose target is stated.
4. Split content into generated, public-corpus, and authored classes, so reviewer time goes where only people can help.
5. Make "Chesscademy-proof" a founding architecture principle: static, exportable, mostly client-side.
6. Strengthen the self-coaching strand with confidence calibration and an unprompted-behaviour ledger.

---

## 2. Pass A — my own position, before comparing details

**Principles**
1. *The unit of the curriculum is a skill at a depth, not a topic.* "Pins" is not one thing; recognising a pin, calculating around one, and noticing one in your own game are three different learning targets with three difficulty ranges.
2. *Only observable behaviour counts as progress.* Every node needs a task a learner can fail.
3. *A rating claim must state its evidence.* A number with no source is a label, not an association.
4. *Production cost decides what can exist.* Human-reviewed content is the scarce resource, so spend it only where machines cannot.
5. *Independence is a design constraint, not a feature.* Every scaffold needs a planned way to remove it, and a way to detect that removing it worked.
6. *The system must survive its own shutdown.* Learners' data, content and tools should outlive the host.

**Failure modes I would watch for**
- The tree looks rigorous but its ordering is an author's taste (draft already admits this).
- Pass rates measure familiarity with a position family, not skill.
- Rating labels look precise and are guesses.
- The most expensive content (strategic, advanced) is never written because early content consumed the budget.
- Personalisation adds complexity without outperforming a fixed route (draft's own falsification test; keep it).
- The platform quietly becomes a dependency.

---

## 3. Evidence register (what I checked)

| # | Claim | Status | Source / method |
|---|---|---|---|
| E1 | Handoff files are internally consistent and intact | [V] | SHA-256 vs MANIFEST; text comparison script `scripts/compare_handoff.py` |
| E2 | GM title: 2500 rating at some point, norms in events covering ≥27 games (each norm ≥9 games, 2600 performance, 35% minimum score, ≥1/3 of opponents GMs with minimum 3, ≥50% titled, at least two foreign federations) | [V] with caveat | [FIDE Title Regulations](https://handbook.fide.com/chapter/B012024), read through a summarising fetch. Re-read the primary text before building any title feature. The plan's one-line summary is accurate but incomplete. |
| E3 | Lichess database exports are CC0; puzzle DB has 6,157,341 puzzles with `Rating`, `RatingDeviation`, `Popularity`, `NbPlays`, `Themes`, `OpeningTags`; Glicko-2 ratings treat each solve as a rated game; an evaluation DB of 416,442,401 Stockfish-evaluated positions (updated 2026-10-05) | [V] | [Lichess database page](https://database.lichess.org/) |
| E4 | Lichess uses Glicko-2, starts new players at 1500, and says ratings cannot be compared across servers; its ratings are often higher than FIDE/Chess.com | [V] | [Lichess rating systems](https://lichess.org/page/rating-systems). Floor not stated there. |
| E5 | Maia covers Lichess ratings 600–2600 and lists Maia-3; Maia-2's code is MIT, trained on Lichess rapid/blitz games May 2018–Nov 2023; the repository page I read states no licence for the weights; Maia-2 takes player and opponent Elo as inputs | [V] | [maiachess.com](https://www.maiachess.com/), [CSSLab/maia2](https://github.com/CSSLab/maia2), [Maia-2 paper abstract](https://arxiv.org/abs/2409.20553) |
| E6 | ChessMood's pricing page lists "AI game analysis" and "custom study plan" under its free Basic plan; paid plans say "all current and upcoming AI features"; the only "Coming soon" item I saw is a hardware ring | [V] page text; **not tested as a product** | [ChessMood pricing](https://chessmood.com/pricing). The plan's table ("paid offering … coming soon") is out of date. |
| E7 | Chess.com Courses brings most of Chessable's library with MoveTrainer spaced repetition. The "4.6× faster" figure is Chess.com's own analysis of **MoveTrainer in Chessable courses** over six months, not of Courses; its basis is not independently verified. The page is marked "Updated Sep 23, 2026" | [V] | [Announcement](https://www.chess.com/news/view/announcing-courses) |
| E8 | Chess King University page describes 7 paths and 44 courses, but the same page says "one more will be added soon" and names only four paths in one sentence | [V] | [Product page](https://www.chesskinguniversity.com/product/chess-king-university-full/). The plan's source S7 URL slug says "10-guided-courses", a different product page I did not open. |
| E9 | Aimchess builds personalised plans from games imported from Chess.com/Lichess, with categories (openings, tactics, endings, advantage capitalisation, resourcefulness, time) and mistake-based drills | [S] | App Store and third-party pages, not the official site. The plan's table omits it. |
| E10 | chess.js is BSD-2-Clause; chessground (Lichess's board) is **GPL-3.0** and says combined works must be distributed under GPL; lila-tablebase server code is AGPL-3.0; ts-fsrs is MIT; the npm `stockfish` package declares GPL-3.0 | [V] | GitHub pages and `npm view` |
| E11 | Lichess tablebase API serves standard results with `category`, `dtz`, `dtm` per move; seven-piece coverage is indicated by project posts | [V] for ≤5 pieces (used); 7-piece [S] | [lila-tablebase](https://github.com/lichess-org/lila-tablebase) |
| E12 | Deliberate practice explained about 34% of variance in chess skill in a six-study meta-analysis, with critiques about the variance framing | [S] | [Hambrick et al., 2014 discussion](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4101876/) and summaries |
| E13 | Expertise-reversal effect: guidance that helps novices can hinder more knowledgeable learners; fading is the design response | [S] | Kalyuga and colleagues, via search summaries |
| E14 | An Elo-style model can estimate learner ability and item difficulty on the fly without pretesting items, targeting ~75% success (Maths Garden: over 3.5 M problems from 3,648 children in ten months) | [S] | Klinkenberg, Straatemeier & van der Maas (2011), *Computers & Education* 57:1813–1824, via abstract-level search results |
| E15 | Ramesh's *Improve Your Chess Calculation* (New In Chess) exists and has ~172 exercises of widely varied difficulty. Gelfand's *Positional Decision Making in Chess* credits Gelfand as author; the draft says "Gelfand with Aagaard," and a secondary review says Aagaard co-developed the books | [S] | Retailer/review pages |
| E16 | Judit Polgar's trilogy is a three-volume **games collection** (How I Beat Fischer's Record; From GM to Top Ten; A Game of Queens) | [S] | Retailer/publisher snippets |
| E17 | The sample lessons: Lesson 1 correct; Lesson 2 main lines and counterexamples hold, answer set unresolved; Lesson 3 invalid | [V] | `02-chess-verification-report.md` |
| E18 | Mastery gate operating characteristics (table in I-05) | [V] computed under stated assumptions | `scripts/gate_oc.py`, `evidence/gate_oc.txt` |

**Claims in the draft I did not re-check:** every item in the competitor table other than ChessMood, Courses and Chess King; the Chess Steps details; the learning-science papers S10–S13 beyond their existence; the Supabase, Maia licensing beyond what is above; Chuchelov, Razuvaev and Heisman entries; all book descriptions other than those in E15–E16. They remain [U].

---

## 4. Issue table

Severity: **Critical** = would ship wrong chess or invalidate a core mechanism. **High** = changes design or cost materially. **Medium** = real but bounded. **Low** = tidy-up.

| ID | Sev | Where | Finding | Evidence | Correction | Status |
|---|---|---|---|---|---|---|
| I-01 | Critical | §7 Lesson 3 | The position `4k3/8/r7/4K3/4P3/8/8/R7 b` leaves White's rook en prise; 1…Rxa1 wins. The lesson's own line (…Rb1) also loses, mate in 9 for White. | Rules, engine and tablebase all agree (`02-…`) | Withdraw. Author a replacement from tablebase positions; see the candidate skeletons in the report. | [V] |
| I-02 | High | §7 Lesson 2 | Acceptance set unestablished. 1.a6 and 1.c6 lose outright (useful teaching fact). Quiet king moves score from 0.00 to about +6.7 depending on square, so 1.b6 may not be unique. | Engine runs, depth 36–40, no tablebase | Exhaustively solve before any item is graded; keep "1.b6" as the lesson target but accept other winning moves. | [V] finding; solution pending |
| I-03 | Low | §7 Lesson 1 | Correct. Task families need FENs. | python-chess | Write the FENs; run the same checks. | [V] |
| I-04 | High | §5 Mastery policy | The gate (≥8/10 independent, ≥3 families, then ≥4/5 delayed) has no stated target skill level, so its quality cannot be judged. If "mastered" means 90% true success, 15% of masters fail and 20% of 70%-skill learners pass; at 80% true success only half pass. Correlated items make this worse. | Computation (table below) | State the target, size the test to required error rates, and make mastery provisional and revisable (the plan already re-tests via review). See §5.3. | [V] |
| I-05 | High | §9 Phase 1 | "~240 exercises for 12 competencies" is ~20 each. The gate alone needs 10 independent items per attempt across ≥3 families, 5 delayed items, fresh items for any retry, plus guided practice, mixed review and remediation: about 40–50 per competency, or 480–600 for twelve. | Arithmetic from the plan's own rules | Revise scope after node enumeration; use generated and corpus content for the foundations (§5.4). | [J] |
| I-06 | High | §5 Rating policy | "Every item inherits its tier's range": 64 clusters carry 8 values, so the draft claims an association for tiers, not for the things the user asked to associate. | Plan text | Item-level difficulty, node-depth bands with intervals, evidence grade on each (§5.2). | [V] |
| I-07 | High | §5 Rating policy | Reference pool "Chess.com rapid" has no open data. Nothing in it can be calibrated before there are learners with Chess.com ratings. | Plan text; E3 | Anchor internally on Lichess (open data, documented Glicko-2, CC0 corpora). Map to Chess.com/FIDE/USCF only through learners' paired self-reported ratings. | [J] |
| I-08 | High | §5 | Open calibration data not used. | E3, E5 | Work package WP-R1: priors from the puzzle DB, Maia-2 and CC0 games (§5.2). Needs download permission. | [V] data exists; usefulness [J] |
| I-09 | High | §8, §9 | Shutdown resilience is "a later feature" although the project began because a site died. Retrofitting export and offline use is expensive. | Plan text; conversation context | Founding principle; §5.6. | [J] |
| I-10 | Medium | §2 | Competitor table: ChessMood is described as a paid offering with "coming soon" AI coaching (E6); Aimchess, the closest game→training product, is absent (E9); the 4.6× claim is not about Courses (E7); Chess King's page is internally inconsistent (E8). The v0.4 rationale file already corrects ChessMood, the master plan does not. | See E6–E9 | Update the table; keep "available / advertised / demonstrated" columns separate; add Aimchess and re-check each product hands-on before any comparative claim. | [V]/[S] |
| I-11 | Medium | §5 | Two parallel eight-level schemes: Tiers 0–7 and Stages A–H, and a third lettering in the source table. No mapping. | Plan text | One spine (tiers); drop stage letters; derive stage-style summaries from node coverage. | [V] |
| I-12 | Medium | §5.1 clusters | Time and clock literacy first appears at 3.8 (800–1300), though a beginner's first online game has a clock. Converting an advantage, defending worse positions and drawing technique are named mainly from Tiers 4–5 (4.6, 5.5, 6.4), though beginners meet them early. | Plan text | Pull clock literacy to Tier 1, time budgeting to Tier 2, and add elementary convert/hold/draw nodes at Tier 2–3. | [J] |
| I-13 | Medium | §5, §6 | The thinking routine — safety check, candidates, calculation depth, evaluation — is spread across 1.3, 2.4, 3.1, 4.1, 5.1, 6.1, 7.1 and never specified as one procedure that grows. "Choosing how deeply to calculate" appears only in the audit list. | Plan text | Name it as a single versioned "thinking loop" with a version per tier (§5.1). | [J] |
| I-14 | Medium | §6, §8 data model | `ReviewState` is per item. Rescheduling the same position trains diagram memory (the plan says so elsewhere). | Plan text | Schedule at the skill-family level; draw a fresh instance each review; store item exposure so repeats are excluded from transfer evidence. | [J] |
| I-15 | Medium | §3, §4 | Learning-science base is thin: retrieval, spacing and interleaving only. Missing: expertise reversal (justifies the fading design), practice-volume limits (E12), Elo-style adaptive practice (E14). | E12–E14 | Add and cite at source; re-read them before relying on them. | [S] |
| I-16 | Medium | §4 | Source-map details: the Polgar trilogy is a games collection, not a graded course (E16); Gelfand's credit is uncertain (E15); the council's "current competitor" selection avoids current rankings although the original brief said to use them if relevant. | E15–E16; brief | Correct entries; check current standings if the council is kept. | [S]/[U] |
| I-17 | Medium | §8 licences | The board choice is a licence decision, not a taste decision. Chessground and Stockfish are GPL; chess.js is BSD; python-chess (my validation tool) I believe is GPL-3.0 [U]. Product licence (open vs closed) is a prerequisite to stack selection. | E10 | Decision D2 (§8). | [V] |
| I-18 | Low | §2 | "Chess.com Courses announcement, September 23, 2026": the page says "Updated" that date. | E7 | Cite as "updated". | [V] |
| I-19 | Low | §3 council | The council adds no evidence; the draft says so. It is also all-male for coaches. | Plan text | Fine as a prompt-generator; do not cite as support. | [J] |

**Mastery gate operating characteristics** (`scripts/gate_oc.py`; independent items, fixed per-item success probability — optimistic):

| True success rate | Pass ≥8/10 | Pass ≥4/5 delayed | Pass both |
|---|---|---|---|
| 0.60 | 0.167 | 0.337 | **0.056** |
| 0.70 | 0.383 | 0.528 | **0.202** |
| 0.80 | 0.678 | 0.737 | **0.500** |
| 0.90 | 0.930 | 0.919 | **0.854** |
| 0.95 | 0.988 | 0.977 | 0.966 |

---

## 5. Revised design

### 5.1 Hierarchy — what changes

**H1. Node × depth, with tiers as a view.** Each *skill node* (e.g. "pin") exists at several *depths*:

| Depth | Meaning | Evidence that counts |
|---|---|---|
| D0 | Understand the idea | Explanation, worked examples; no scoring |
| D1 | Recognise it with a cue | Labelled exercises |
| D2 | Recognise it unlabelled among distractors | Mixed, unlabelled tasks across ≥3 position families |
| D3 | Use it under calculation, including refutations and counterexamples | Variation entry, "why does this fail here?" |
| D4 | Execute it in play | Game opportunities (imported or bot), opportunity-adjusted |
| D5 | Teach, repair or research it | Explain, diagnose, build an exercise, compare sources |

This is the draft's own capability list (§11, "A clearer model of competence") made structural. It gives "revisit at greater depth" a data home, gives ratings somewhere honest to attach, and lets a 1900 player repair a D2 gap without re-walking Tiers 0–3. A tier becomes "the lowest band where a node's D2 is on the default route." [J]

*Proposed identifier form:* `DOMAIN.CONCEPT.D#` (e.g. `TAC.PIN.D2`), stable and never reused. [J]

**H2. One spine.** Keep the draft's Tiers 0–7 and retire Stages A–H and the A–G labels in the source map. [J]

**H3. Name the thinking loop.** One routine with a version per tier — T1 "is anything of mine attacked? what does the last move threaten?", T2 "check forcing replies before committing", T3 "candidates, short lines", T4 "compare resulting positions", T5 "depth allocation and best-defence checking", onward. It replaces seven scattered clusters with one designed progression, and gives "how deeply to calculate" a home. [J]

**H4. Re-time time management.** Clock literacy at Tier 1, simple budgeting at Tier 2, game-phase budgeting at Tier 3, pressure routines later. [J]

**H5. Split strand 8.** The draft's last strand mixes time management, analysis habits, competition preparation and self-direction. Make "Practical performance" (clock, nerves, competition) and "Self-direction" separate strands, since the second has its own staged progression. [J]

**H6. Quiet, convert, hold.** Positions with no tactic, converting an advantage, holding a worse position, drawing resources and simplification choices appear as nodes from Tier 2–3 in elementary form, not only in the "important additions" overlay and Tier 5–7. [J]

**H7. Opening ladder (kept) plus deviation triage.** The draft's six-row opening-depth table is sound; I keep it. I add a node family for "what to do when the opponent leaves the book" starting at Tier 1–2: flank openings, early gambits, early queen sorties, and the common third-move alternatives in open games. Repertoire choices should be made for teachability first; I will not pick lines until nodes are enumerated, and every line will be engine-checked at that point. [J]

**Not changed:** the eight strands other than strand 8; the hard/soft/contextual prerequisite policy and the use of relational edges instead of a graph database; the staged pawn-endgame branch as a format for deep branches; "no months-long prerequisite before playing."

### 5.2 Ratings — the replacement for "Elo per topic"

The user asked for "accurate Elo association with everything." The honest version, which I think is also the best achievable one:

**(a) Say what a rating attaches to.** Difficulty attaches to *items* (a position plus task plus conditions). Skill attaches to a *learner* as a vector by strand. A node-depth cell gets an *interval* summarising its items, never one number. Introduction timing stays a separate teaching decision (enabling value, frequency, cost of failure, learning cost), not a rating.

**(b) Put an evidence grade on every association.**

| Grade | Basis |
|---|---|
| G0 | Expert estimate only. Every band in v0.4 is here. |
| G1 | Prior from open external data, on the Lichess scale |
| G2 | Calibrated on our learners' first attempts with paired external ratings; interval and sample size shown |
| G3 | Replicated on a later cohort |

The product shows the grade. "Estimated, grade G0" is honest; "1100–1600" alone is not.

**(c) Bootstrap G1 before any learner exists.** [J, data existence V]
- *Tactics:* the Lichess puzzle database gives a Glicko rating, deviation, themes and play counts for 6.16 M puzzles. That is difficulty on a named scale for pin, fork, skewer and similar themes. It is *puzzle* difficulty on Lichess's puzzle scale, not a claim about playing strength, so it informs item difficulty only.
- *Quiet and positional positions:* Maia-2 outputs move probabilities conditioned on player and opponent rating. The probability that a 1500 chooses the instructive move is a defensible prior for a decision task. Caveats: Maia predicts what humans play, not what they can find when told what to look for; the weights' licence is unconfirmed (E5).
- *Skill-vs-rating curves:* from a sample of CC0 games, estimate how often players at each rating drop a piece, miss a one-move tactic, or convert a won position. That is an empirical rating association for a skill, from public data. It needs an engine pass, which I can script.
- *Concept knowledge with no behavioural ground truth* (for example "what a bishop pair is worth"): no public data exists; this stays G0 until we have learners.

**(d) Calibrate on our learners online.** Use an Elo/Glicko-style co-estimation of learner and item (E14), which needs no pretest and handles sparse data, then a logistic/IRT fit once there is enough data to check it. The draft's offline logistic model is fine later, but data is scarce at first.

**(e) Reference pool.** Anchor the internal scale on Lichess (Glicko-2, 1500 start, open data). Learners enter their own platform, time control, rating and date; we fit mappings with intervals from those pairs and hide any conversion until its sample is adequate. Never display a FIDE-equivalent below a stated sample size. [J]

### 5.3 Mastery and evidence

- State the target: "mastery at depth D2 means ≥ X true success on held-out families," where X is a pilot decision (the draft's thresholds imply roughly 0.85–0.9).
- Use evidence-weighted estimation per node-depth (Beta or Elo-style), weighting independent, unfamiliar, unhinted, first-attempt items and discounting repeated families, hint use and correlated moves from one position.
- Mark mastery as *provisional*, revised by later mixed practice and game evidence. This makes a noisy gate cheap.
- Keep the draft's rules that hint-assisted success does not count, and that "not observed in games" differs from "failed."
- A sequential rule can reduce error without fixed length. In simulation (stop when P(p ≥ 0.8) ≥ 0.9, cap 60 tasks, 300 learners per row), true 0.9 passed 89% using 26 tasks on average, true 0.7 passed 3%, and true 0.6 passed 0%; but true 0.8 passed only 28%. [V] It is not better, only different: it trades length for fewer false passes. The threshold remains a pilot decision.

### 5.4 Content production classes

| Class | What | Review burden |
|---|---|---|
| **G — generated** | Tier 0–2 board vision, legal moves, attacked squares, hanging pieces, check, mate-in-one. Produced from the rules library and checked by engine; held-out families by construction. | Review the generator and its coverage, not each item |
| **P — public corpus** | Tactical practice from the CC0 puzzle DB, filtered by theme, popularity, rating deviation and engine re-check, de-duplicated into families | Review the filter and sample items |
| **A — authored** | Lessons, counterexample pairs, quiet-position tasks, plan-choice tasks, self-coaching tasks, model games | Per-item human and strong-player review; this is where cost lives |

[J] Whether puzzle DB items meet the "unique, instructive" standard after filtering is unproven; I would pilot it on a few themes first.

### 5.5 Self-coaching strand — additions, not a rewrite

The draft's seven stages and capstone are good. Additions:
1. **Start at Tier 0–1** with one-line habits: "mark one moment you were unsure," "what did you expect your opponent to do?" The draft has stage 1 "Observe" but ties it loosely to chess level.
2. **Confidence calibration.** Before feedback, the learner marks confidence; track the gap between confidence and correctness over time. It is cheap, measurable metacognition and teaches diagnosis. [J]
3. **Unprompted-behaviour ledger.** For each thinking-loop step, record whether the learner did it unprompted in games or only when asked. This is the direct measure of declining reliance. [J]
4. **Fading by evidence.** Give learners the toggle for hints and prompts; log what happens when they remove them. Expertise reversal (E13) is the reason to fade, but the schedule is an open question for the pilot.
5. Keep the draft's warnings: reduced platform use is ambiguous; self-reports are fallible; assessed reasoning matters more than a rating change.

### 5.6 Architecture and licensing

- **Chesscademy-proof principle** [J]: lessons and exercises are versioned open-format files; rules, engine and board run in the browser; progress lives in a user-exportable store with optional sync; the server provides accounts, sync and any AI calls; every user can export all content they have access to and their history. The core loop must work with no AI provider and, ideally, offline.
- **Licence decision first.** Chessground (GPL-3.0) and Stockfish (GPL-3.0) fit an open-source product naturally; a proprietary one needs permissive alternatives (chess.js is BSD-2) and a legal read of how the engine is distributed. Content can be licensed separately from code. The draft's instruction to avoid GPL "accidentally" becomes a deliberate choice (decision D2).
- **Keep the draft's defaults** (TypeScript, PostgreSQL, a worker for engine jobs, typed content in version control, server-side AI adapter with strict schemas). I have no evidence that improves on them, and the plan rightly says to defer the choice of framework.
- **Review scheduling:** FSRS (ts-fsrs, MIT) is appropriate for *concept-level* review with fresh instances (I-14), not for repeating particular positions.

### 5.7 Revised first-release shape

[J] The draft's Phase 1 is a good loop. I would keep it as the *product* slice and add a *design* slice that tests the hierarchy model:

- **Product slice:** placement → Tiers 0–1 (mostly class G content) → a handful of authored lessons → mixed test → delayed review → game import or bot game → justified next assignment. Counts to be set after enumeration.
- **Model probe:** one complete branch at all depths, D0–D4, for a single concept (pins are the draft's own example), with its thinking-loop and self-coaching hooks. This is where the hierarchy model either works or breaks.
- **Verification before content:** no item enters assessment without the scripted checks in the verification report.

---

## 6. Change log

| Draft element | Decision | Why |
|---|---|---|
| Product thesis, boundaries, GM boundary | **Retained** | Accurate against FIDE text [V] |
| Eight tiers, 64 clusters | **Retained as v0.4 blueprint;** restructured by H1–H7 | Clusters become nodes at depths; tiers become a view |
| Stages A–H | **Removed** | Redundant with tiers (I-11) |
| Eight strands | **Changed:** strand 8 split | H5 |
| Four rating attributes | **Retained**, extended with evidence grades | The framing was right; execution was missing |
| Chess.com rapid as reference pool | **Rejected** | Cannot be calibrated (I-07) |
| Per-tier inherited bands | **Rejected** | I-06 |
| Provisional bands | **Retained** as G0 labels | Honest if labelled |
| 8/10 + 4/5 gate | **Changed** | I-04; §5.3 |
| Mastery states (introduced … retained, in play) | **Retained** | Matches D0–D4 |
| Scheduler v1 (explicit rules, logged reasons) | **Retained** | No evidence against; sound |
| Self-coaching seven stages, capstone | **Retained**, extended | §5.5 |
| Student model and diagnosis table | **Retained** | Consistent with the evidence-first stance |
| Lessons 1–3 | L1 retained; L2 retained with answer set open; L3 **withdrawn** | Verification report |
| Competitor table | **Updated** | I-10 |
| Council, debates | **Retained** as prompts only | No evidential weight, per the draft |
| Source canon | **Retained** with corrections; full audit still pending | I-16 |
| Phase plan | **Changed:** adds model probe and production classes | I-05, §5.7 |
| Architecture defaults | **Retained** with added principle and licence gate | I-09, I-17 |
| Added | Node × depth, thinking loop, evidence grades, open-data bootstrap, production classes, confidence calibration, unprompted-behaviour ledger | §5 |

---

## 7. What was and was not completed against the required deliverables

| # | Deliverable | Status |
|---|---|---|
| 1 | Concise verdict | **Done** (§1) |
| 2 | Issue table | **Done for what I examined** (§4). Not exhaustive: the curriculum audit questions remain open until nodes are enumerated |
| 3 | Revised long-term hierarchy with IDs, edges, ordering, roles, rating metadata | **Partial.** Structural model and seven concrete changes (§5.1); **node enumeration not done** |
| 4 | Beginner route and a deep branch | **Not done.** Next work package |
| 5 | Opening progression with fallback guidance | **Partial.** Ladder kept; deviation-triage family proposed; **content not written** |
| 6 | Assessment and calibration policy | **Partial draft** (§5.2–5.3) |
| 7 | Chess verification report | **Done for the supplied samples** (`02-…`); replacement Lesson 3 and exhaustive Lesson 2 solve outstanding |
| 8 | Source-to-curriculum map | **Partial.** Corrections only; no full source audit |
| 9 | First-release scope and technical recommendation | **Preliminary** (§5.4, 5.6, 5.7) |
| 10 | Change log | **Done** (§6) |
| 11 | Implementation brief | **Not started.** Premature: hierarchy and contracts unresolved |
| 12 | Self-coaching curriculum and capstone | **Partial.** Additions to the draft (§5.5); tasks and rubrics not written |
| 13 | Traceability ledger and coverage matrix | **Not done.** Needs node enumeration |

**Not researched at all this round:** a full source-canon audit; reviewing each competitor hands-on; learning-science primary papers read at source; accessibility and children's privacy requirements; cost modelling; the opening repertoire itself.

---

## 8. Decisions and permissions I need

**Decisions** (each has a default I will use unless you say otherwise)
- **D1 — Reference pool.** Default: Lichess-anchored internal scale (I-07). Alternative: Chess.com rapid as in the draft, accepting that it cannot be calibrated until users arrive.
- **D2 — Product licence posture.** Default: leave open until after the hierarchy; but it gates the board and engine choice. If you want the curriculum and tools to remain usable if the project stops, open-source is the natural fit.
- **D3 — Chesscademy-proof as a nonnegotiable principle (§5.6).** Default: yes.
- **D4 — Whether to keep the "council."** Default: keep as a prompt-generating device only; no further effort.

**Permissions** (I have not done these)
- Downloading the Lichess puzzle database (`lichess_db_puzzle.csv.zst`, size not stated on the page I read) to produce the G1 theme-difficulty priors.
- Downloading a sample of a CC0 Lichess games month (monthly files are large; I would stream a bounded sample) for the skill-vs-rating curves.
- Installing Maia-2 and running it locally for rating-conditioned priors.
- Syzygy tablebase files, if you want local verification beyond the public API (large; sizes to be confirmed).

---

## 9. Next work package

1. Your answers on D1–D3, and your reaction to the structural changes in §5.1, particularly H1 (node × depth) since everything else depends on it.
2. With your go-ahead: enumerate Tier 0–1 as nodes at depths, with prerequisites, rating metadata (G0, labelled), exercise classes and thinking-loop version; walk it as a total beginner and as a returning adult.
3. In parallel, the "pins" model probe D0–D4.
4. Replace Lesson 3 and exhaustively solve Lesson 2.
5. If permitted, WP-R1: build G1 priors from open data.
