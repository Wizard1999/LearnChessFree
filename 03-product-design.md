# A chess learning system — product design (v1, my decisions)

2026-10-24. Planning plus one technical spike. The website has not been started.
Evidence labels: **[V]** I verified it this session · **[S]** seen only in search snippets/secondary text · **[J]** my judgment or hypothesis · **[U]** unverified.
Each decision is numbered **D#** with my reasoning and what would make me change it, so you can agree or disagree item by item. Earlier work in `review/` still stands as a record; it is superseded in scope by this document (and your instruction that the sample lessons are not needed).

---

## 0. What I would have said in the first conversation

The ChatGPT prompt is a good *report* prompt and a weak *project* prompt. It is missing the questions that decide whether this works:

1. **Is someone already doing it?** It never asked. See §2; short answer: parts, yes; the combination, not that I could find.
2. **What is the ground truth?** Education software lives or dies on whether its answer key and explanations are *correct*. Chess is unusually lucky here: engines, tablebases and a rules library give machine-checkable truth. A strategy built on that is stronger than one built on a fluent chatbot. The prompt treats this as an AI-safety footnote; it should be the architecture.
3. **What causes improvement?** The prompt lists features. It never states a theory of *why* a learner gets better and what the product does about each cause. §3 does.
4. **How will you know?** It put evaluation last. For you, evaluation should come *first*, because you are the first student and an experiment is cheap now and expensive later.
5. **A council of 30 famous names and a mass book ingest are theatre.** Neither produces verifiable improvement. I dropped both. Sources are used one node at a time, when a node needs them.
6. **"Everything" is not a plan.** A solo builder with Claude is limited by *verified content* and *review attention*, not by code. The plan must say what is deliberately not built.

On "render all other tools obsolete": I would drop that as a goal. Lichess and Chess.com have hundreds of engineers and a network of players you do not want to replicate; you will keep playing there. The achievable and worthwhile goal is: **the best place to *learn* chess, and the first one that explicitly teaches you to teach yourself.** If that is true, people use it *alongside* those sites, and that is a good outcome.

---

## 1. Thesis

> A student opens the system and it shows what they can do **without being told which idea to use**, teaches the gap with explanations whose every claim has been checked by machine or reviewed by a person, lets them poke the ideas to see where they break, learns from their real games, and steadily hands the steering wheel back to them.

Five mechanisms carry that sentence (§3). Everything else is secondary.

---

## 2. Is this already done? (Your test for whether it is worth building)

**What I verified or saw**
- Chess.com: Lessons, Courses (Chessable's library with MoveTrainer spaced repetition) [V announcement], Game Review with a report card, a "miss" category and selectable star coaches [S]. I found no skill assessment or personalised lesson path [S, absence of evidence].
- ChessMood: pricing page lists AI game analysis and a custom study plan under its **free** tier [V page text; not tested as a product].
- Aimchess: plans and drills from your imported games, with skill categories [S].
- Chess King University, Chessable, Lichess (free analysis, studies, a CC0 puzzle set with ratings and themes) [V]. A vendor-run field of "AI coach" sites is advertising heavily [S, marketing].
- Old ideas worth keeping that exist only in books or small corners: a *Tactics Detection Workbook* built on the fact that real games, unlike puzzles, don't promise a tactic exists [S]; a community set of ~2,200 positional puzzles on Lichess [S].

**My verdict [J]:** the *pieces* exist and some are strong. I did not find a product that (a) measures mastery by performance **with the cue removed**, (b) lets you manipulate a position and shows verified reasons it breaks, (c) links your own games to a visible prerequisite map, and (d) teaches self-direction as a graded strand. That is a real gap, not a proven one: I did not test any paid product hands-on.

**Why gaps like this can persist** [J]: correct content is expensive; assessing "understands the idea" is genuinely hard; single-product teams optimise for engagement and subscription retention, not for making themselves unnecessary; and the serious-improver audience is smaller than the casual one.

**Falsifiable check (cheap, do first):** a 2–3 day hands-on teardown of Chess.com Lessons + Game Review, ChessMood and Aimchess against these six questions: unlabeled cue-free testing? no-tactic positions? manipulable counterexamples with reasons? games → concept graph? visible full prerequisite graph? graded self-direction? If a competitor already does four or more well, I'd stop and tell you. I can prepare the checklist; the hands-on part needs accounts, which are yours to create.

**Is it worth doing anyway?** For your purpose (learning how to teach self-directed learning), yes, even if the market answer is "someone is close." A chess site is an unusually good lab: fast feedback, checkable truth, and cheap to run.

---

## 3. The mechanisms

### M-A. The cue ladder — measure what you can do when nobody tells you which idea applies
Every attempt on a skill is recorded at one of four **cue levels**:
1. *Named*: "find the pin."
2. *Themed set*: all exercises in this lesson.
3. *Mixed*: tasks from many concepts, none announced.
4. *In play*: an opportunity in your own games or a bot game.

Mastery means success at level 3 on unfamiliar position families, and later at level 4. Success at level 1 is only "has seen it." This is the one idea in the ChatGPT write-up I'd build the whole assessment around, and it matches the Guardian study's rule that a tutor must be judged by performance "away from its hints and screens" (§18 of your document). The Bastani et al. finding it cites (§25) (AI help raised practice scores but lowered later unaided scores unless safeguarded) is the reason for this design; I know it only through your document [S].

### M-B. Machine-verified claims — the oracle stack
Nothing is shown to a learner as fact unless it comes from:

| Layer | Provides | Never trusted for |
|---|---|---|
| Rules library | Legal moves, state | Meaning |
| Concept detectors (we write them) | True, named facts about a position: pinned, forked, hanging, outpost, passed pawn, open file… | Anything not yet covered; flagged when unexplained |
| Engine / tablebase | Outcome evidence under recorded settings | Why; and see below |
| Human review | Teaching value, ambiguity | Speed |
| AI | Drafting at authoring time | Truth (never at runtime in v1, D3) |

A **claim-level** rule, found in the spike below: a lesson claim is "this wins a queen *and keeps the knight*," not "the engine likes it." Verifying against raw evaluation mislabels a tactic that wins material but loses it back.

### M-C. The contrast lab — minimal pairs with reasons
After teaching an idea, the student changes one thing (move a defender, add a pawn) and **predicts** whether the idea still works; the system reveals the verified outcome and the reason from the detectors. This turns "rules and exceptions" into something you discover. **Spike result [V]** (`spikes/`): on a knight fork, 101 single-piece edits were engine-checked in **3 seconds**; 24 broke the idea; **19 of 24 (79%)** got a correct reason from deterministic board facts ("the knight no longer gives check," "the landing square can now be captured by a piece worth 9"). The 5 without a reason are exactly the useful kind: in at least three of them (queen moved to a8; pawn added on a5; pawn added on b7) the knight wins the queen but is then trapped or recaptured, which the detectors don't know yet. Re-searching those five at depth 24 gave the same verdicts as depth 12 (I did not re-check the other edits). Conclusion: feasible, cheap, and its failures are a to-do list of detectors. Caveats: one tactic, one position, depth 12; my first test position was wrong (the "win" left a dead-drawn K+N v K) which is the argument for claim-level verification.

### M-D. Decision-type training — not every position hides a tactic
Mixed sessions include positions with **no** tactic, positions to defend, quiet improving moves, and equal positions where several plans are fine. The first question is often "what kind of position is this?" Puzzle sites announce a tactic exists; real games don't. The *no tactic* label is engine-checkable (no move gains material within N plies after quiescence) and human-reviewed for the instructive ones. The Detection Workbook idea in book form [S] is the prior art; we make it adaptive and scored.

### M-E. Games feed the curriculum
Import PGNs (Lichess, Chess.com, over-the-board). The system finds **opportunities** by concept (a pin existed; a fork was available; a defender could be removed), compares with what you played, and attaches them to nodes in the prerequisite graph: "pins: seen at level 3, missed 2 of 3 chances in games." Small samples say "worth checking," not "you are bad at pins."

### M-F. The independence engine — the part that is yours
Taken from §29–30, §18 and §23 of the Guardian study, translated:

- **Four roles** (Guardian §30) as the teaching mode per skill: *care* (the system does it for you, e.g. checks for hanging pieces), *demonstration*, *coached practice* (support fades), *independent practice* (you plan and act; it reviews on request).
- **Success is declining assistance with maintained performance.** The key metric is the **unprompted-behaviour ledger**: did you run your blunder check without being asked?
- **Rehearsal of absence.** Scheduled *silent sessions*: no hints, no engine, no recommendations; measured, with an emergency "show me" button that costs nothing but is logged.
- **Teach-back.** Explain an idea to a (silent) virtual novice or write it up; checked against detector facts, not a fluent guess.
- **Confidence calibration.** Mark confidence before feedback; track the gap between how sure you were and how right.
- **Question the tutor.** Occasionally a lesson contains a labelled error ("find the mistake in this analysis"); claims are tagged *established / engine-says / hypothesis* (Guardian §23).
- **Own-plan experiments.** From stage 4 on, you choose a training block, state what would count as improvement, and the system measures it with held-out positions.
- **Succession portfolio.** Export: your games, annotations, error log, plans and notes in open formats you can read without the app (Guardian §31, §21).

### M-G. The whole map is visible
The prerequisite graph is shown in full, with the recommended path highlighted (Guardian §38: "teaching order and access are different questions"). A **challenge-out** test lets a stronger player prove a node and skip it. A stronger player with a basic hole can repair it without walking everything beneath their rating.

### M-H. It survives its own death
Static, local-first, open-format content, exportable progress. (This is the lesson of Chesscademy, and the Guardian study's offline precedents, Kolibri and RACHEL [S via your document].)

---

## 4. Curriculum architecture (carried forward from review, tightened)

- A **skill node** is taught at several **depths**: understand → recognise with a cue → recognise unlabeled → use under calculation (including counterexamples) → execute in play → teach/repair. Tiers are a *view*, not the data.
- A single **thinking loop** (threat check → forcing replies → candidates → calculation depth → evaluation) grows by tier, so "how deeply to calculate" is a taught skill.
- **Ratings** attach to items and carry an evidence grade (G0 expert guess → G3 replicated). Reference scale: Lichess. The Lichess CC0 puzzle database (6.16 M puzzles with ratings and themes) and a 416 M-position evaluation set are the free calibration sources [V]. Nothing is shown as a number without its grade.
- **Opening ladder:** principles → a small set of reasons-first lines → structures → repertoire → research, plus a *what to do when they leave the book* family from Tier 1.
- **v1 content scope** (D10): Tier 0 (how the pieces work) to roughly Tier 2, plus two complete deep branches (forks and pins at all depths) and the self-direction strand from day one. Reason: depth in few places tests the *model*; breadth in many tests nothing.

---

## 5. Decisions, with reasoning

| # | Decision | Why | I'd change it if… |
|---|---|---|---|
| **D1** | Goal is "best place to learn and to learn how to learn," not "replace every chess site." | Honest, achievable, compatible with players using Lichess/Chess.com. | You want a play-and-social product. |
| **D2** | Differentiate on the six mechanisms (A–F) plus G/H; spend nothing on parity features. | Parity with Chess.com is unwinnable and not what you asked for. | The teardown (§2) shows a rival already does most of them. |
| **D3** | **No live AI in the learner's loop in v1.** Claude is the *author's* assistant; shipped feedback comes from detectors + reviewed templates. | Correctness, zero running cost, works offline, and avoids the "AI help hurts unaided performance" trap. AI at runtime is a later optional layer, fed only verified facts. | Early users clearly need open-ended dialogue and detectors can't cover it. |
| **D4** | **Static, local-first web app (PWA); no backend in v1.** Progress in the browser's database with export/import. | Fits the Chesscademy-proof goal; no hosting cost, no privacy risk, a solo builder can finish it. | You need multi-device sync or accounts early. |
| **D5** | **TypeScript + React + Vite; chess.js; Chessground board (see D6); Stockfish WASM "lite single-thread" in a worker; IndexedDB (Dexie).** Content-verification tooling in Python (python-chess + native Stockfish), offline. | Single-thread Stockfish needs no special server headers, so it runs on any static host [V: the build exists; version 19, 'lite-single']. chess.js is BSD-2 [V]. Python is the best language for the verification and generation scripts. | A framework you prefer; performance on low-end phones. |
| **D6** | **REVISED by Andrew 2026-10-24: open is fine, money is not the goal, GPL allowed if it improves the product.** So: code is **GPL-3.0-or-later**; use **Chessground** (Lichess's board: mature drag/touch, arrows, highlights, animation, which the contrast lab and lesson overlays need) instead of a hand-built board; bundle Stockfish and python-chess freely. Original lessons/exercises: proposed **CC BY-SA 4.0** (confirm before publishing). Third-party data keeps its own licence (Lichess data is CC0). Keep the copyright holder as one person so relicensing stays possible. | Removes all licence friction and gives the best board for free. Chessground and Stockfish are GPL [V]; building on them under GPL is the compliant path. | You later want a closed commercial product (then relicensing needs every contributor's consent, so avoid taking outside code contributions without an agreement). |
| **D7** | The **evidence layer is domain-agnostic** (skills, cue levels, scaffolds, ledger, plans); chess knowledge, detectors and verification are chess modules. | Lets the same learning engine be reused later (your gym) without building a generic platform now. | It slows v1; then I'd collapse them. |
| **D8** | Ratings: Lichess-anchored internal scale; every number carries an evidence grade; conversions appear only after paired data. | Free calibration data exists for Lichess; Chess.com's is closed [V]. | You want Chess.com-native numbers for marketing. |
| **D9** | **You are student zero**, with a measured baseline and a within-person experiment (§6). | Cheapest honest test; produces the first real data. | You'd rather recruit testers first. |
| **D10** | v1 scope as in §4, **plus a basic engine opponent for "play it out" tasks and game sets** (added after the Chesscademy research: its loved loop ended in a game against the computer, which is our cue level 4; see `docs/chesscademy-research.md`). Deferred: humanlike bots, narrated video, human matchmaking, native apps, LLM tutor, server sync, full tiers 3–7. | Protects the loop and the verified-content budget. | Needs change after M2. |
| **D12** | **Text and interactive boards only; no video.** Teaching uses short cards, step-through annotated boards, and exercises. Agreed with Andrew 2026-10-24. | Books show text works; video is costly to make and revise, cannot be machine-verified, breaks when hosting fails (it did for Chesscademy), and hurts accessibility. | Early learners clearly cannot learn a concept from text and boards. |
| **D13** | **Build order follows the first user's frontier, not the tier numbers.** Tier 0–1 is mostly generated and cheap, so build a thin version; put authored effort into the middle tier (tactics under no cue, the threat check, positional basics) where Andrew actually starts and where Lichess Learn/Practice stop. | Lichess Learn and Practice already do rules, named tactics and basic endings well [V]; a beginner path is not where we win, and Andrew will skip it. | Real beginners become the main early testers. |
| **D11** | Drop the council; use real sources node by node; every item carries provenance and rights data. | The council yields no checkable improvement; source work is where quality comes from. | You value it as a marketing story. |

---

## 6. Using it as a research instrument (your real goal)

You asked for a way to *learn about teaching self-learning* by testing yourself. A design that makes that possible:

**Baseline first (before any build).** A Lichess account; 20+ rapid games; a short unlabeled test of mixed positions, including no-tactic ones, that I'll generate and verify. This gives a pre-measure we cannot recreate later.

**Multiple-baseline within-person design [J].** Pick matched concept pairs (say, pins vs. skewers; forks vs. discovered attacks). Teach one of each pair with the full loop and the other with the common method (labelled puzzles). After a delay, test **both** on held-out positions at cue level 3. One person is weak evidence; but concept-pair designs give many comparisons, and a friend or two makes it stronger. It does not prove superiority; it tells us whether the mechanism is worth keeping.

**Independence metrics, recorded from day one:** unprompted-behaviour rate, hint rate over time, silent-session performance vs. supported performance, calibration error, plan quality.

**What to be honest about:** you are the designer and the subject, so expectancy effects are real; hold some items back from yourself (I generate and seal a test set).

**Transfer to other skill-training domains** [J]: the cue ladder maps to *pressure-testing* (named drill → mixed drilling → live sparring); the four roles and the unprompted-behaviour ledger transfer directly; teach-back and silent sessions transfer. What does **not** transfer is the oracle: chess has an engine; martial arts has no ground truth, so correctness depends on instructor review, video review and rubric agreement between people. Building the chess version teaches you what the *minimum viable oracle* looks like when you remove the engine.

---

## 7. Roadmap (work units, no invented dates)

| Milestone | What | Gate to continue |
|---|---|---|
| **M0** (this document + spike) | Design, competitive check, contrast spike | You agree/disagree on D1–D11; teardown outcome |
| **M0.5** | Baseline data collection (you); more spikes: no-tactic filter, trapped-piece/pin/skewer detectors, claim-level verification | Detector coverage ≥ 90% of auto-generated breaks on three tactics |
| **M1** | Content schema + validator CLI; Tier 0 generated exercises; board; one complete concept at all cue levels | A skill can be taught, tested at levels 1–3, and every item passes the validator |
| **M2** | Local evidence store; cue-ladder scheduler v1; placement; daily session | **You use it ≥4 days/week for 4 weeks** and delayed unlabeled scores beat the control concepts |
| **M3** | Contrast lab + mixed/no-tactic practice in product | Users predict outcomes better than chance after a short training |
| **M4** | Game import → opportunities → nodes | Opportunity detection precision checked by hand on ≥ 50 positions |
| **M5** | Independence strand v1: ledger, silent sessions, own-plan experiments, export | A learner completes a plan→measure→revise cycle unaided |

**Kill criteria, stated in advance:** a competitor does most of §2's six questions well; you stop using it unprompted; transfer to unlabeled positions is no better than the control; or verified-content production is too slow to sustain.

---

## 8. Biggest risks [J]

1. **Verified content is the bottleneck.** Mitigation: generators for Tier 0–2, the Lichess puzzle corpus for tactics practice, human review only for lessons and quiet-position tasks.
2. **Detectors are brittle.** Mitigation: unexplained results are a first-class output and go to a queue; the UI says "no explanation yet" instead of guessing.
3. **Mastery thresholds are guesses.** Mitigation: evidence-weighted estimates, provisional mastery, calibration against your data.
4. **Self-experiment bias.** Mitigation: sealed test sets, concept-pair controls.
5. **Scope creep.** Mitigation: D10 and the kill criteria.

---

## 9. What is established, and what is not

**Established this session [V]:** the contrast-generation spike works at small scale (above); the Lichess data and licences cited; FIDE's GM requirements are as the review states; competitor details marked [V]; the Guardian study's pedagogy as I summarised it.
**Not established:** that the cue ladder or contrast lab improves real chess strength; that any competitor lacks them; the detector coverage across tactics; calibration of any rating; the value of the independence strand beyond theory. Those are what M0.5–M5 are for.
