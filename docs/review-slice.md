# Human review of the release slice

Status: machinery built, **no lesson has been reviewed by a person**. Every lesson is still `needs-human`. This page says what a small, honest first review is, who does what, and how a sign-off is recorded so that nobody (including us) can claim more than was done. Related: ROADMAP phases 2h and 6d; DECISIONS-LOG D43; `docs/lesson-depth-standard.md` (what "deep" means); CLAUDE.md rules 1, 3 and 6.

## 1. The slice

51 lessons, listed in `review/index.md` (regenerate with `tools/review_packet.py`).

- **Stages S0, S1 and S2 of the recommended path** (`content/path.json`): 35 lessons. S0 is the board and how each piece moves, S1 is legal play (capture, attack, check, stalemate, castling, promotion, en passant), S2 is the first complete games (notation, piece values, who can really recapture, first mates). This is everything a true beginner meets before a first win.
- **Exemplar lessons**, the ones that set the standard for the rest: `L-TAC-FORK-1`, `L-TAC-BACKRANK-1` (the tactics template), `L-OD-DRAGON-1` to `9` (an opening taught deeply, the pattern for every opening course), `L-HI-ENGINES-HUMANS-1` to `5` (a history and ideas course with sourced claims and conjecture). 16 lessons.

**Why this slice [I]:**
1. Errors cost most at the start. A beginner who is taught a wrong rule or a wrong picture of "free" material carries it a long way, and S0 to S2 is where a wrong sentence does the most harm.
2. It is small enough to finish. The three stages hold about a tenth of the 456 lessons, and the exemplars about a thirtieth. A reviewer who signs off 51 lessons has reviewed something real; one who is handed 456 reviews nothing.
3. The exemplars are the templates the other 400 lessons are written from. A defect found in one is a defect in the pattern; fixing the pattern is worth more than fixing a single lesson.
4. The product can say precisely what it is: "stages 0 to 2 and four exemplar courses are human-reviewed; the rest is machine-verified and awaiting review". That is true and useful, and it needs no overclaiming.

What the slice is not: a claim about the quality of S3 and later. Those lessons keep their machine-checked claims (rules, engine, tablebase) and stay `needs-human`.

## 2. Two reviewers, two jobs

A packet (`review/packets/<lesson-id>.md`) is a readable text version of one lesson. Boards are drawn as diagrams with the FEN under each, a line is written out with the sentence the learner sees at each move, tasks show the accepted answer and the explanation shown, and the claims the program already checked are listed (so the reviewer does not have to recalculate engine facts, but should read them for sense). No app is needed.

### Strong player (about 1800 and up; a coach is better)
Judges whether the chess is **true** and whether the explanations **explain**. Check, step by step:
- Every statement of fact about a position, rule or opening is correct, including the ones the engine cannot judge ("this structure is typical", "the idea is...").
- The explanation gives the mechanism and its conditions, not just the move. Where it says a move "works", it says what makes it work and what would break it.
- Near-misses are real near-misses: the position meant to fail does fail, for the reason given and no other.
- Task answers: one defensible answer (or the accepted set is complete), and the explanation matches it. Say if a second good move is missing from a find-the-move task.
- Labels are honest: [H] and [I] are conjecture and read like conjecture; [S] and [V] sources are fairly and briefly paraphrased, not quoted at length. Anything that looks like a quotation must be one you can find, or it must go.
- Anything misleading to a learner, even if technically true.

### Teacher or beginner coach (someone who teaches new players; no rating needed)
Judges whether a learner can **follow** it. Check:
- Order: each idea is introduced before it is used; the lesson does not need something that comes later.
- Vocabulary: every term is explained at first use; no unexplained notation in the prose.
- Difficulty jumps: where the step before a task did not prepare the learner for it; where a learner would be bored.
- Length and rhythm: where attention would drop; whether a board is shown for every concrete line (the prose should carry ideas, the board the moves).
- Instructions and prompts: reflection prompts ask for something concrete; a learner knows what to do.
- A teacher cannot certify chess, and their approval is stored as such (section 4).

### Scales
Each reviewer gives a score from 1 to 5 on four dimensions, with the same meaning for both roles.

| Dimension | 1 | 3 | 5 |
|---|---|---|---|
| **chess**: correctness of every statement and explanation | contains a falsehood or a wrong answer | correct, with edits needed | I would put my name to every sentence |
| **clarity**: the explanation actually explains | restates moves, explains nothing | explains, but some steps are thin or vague | mechanism, conditions and near-miss are clear |
| **prerequisites**: suitable for the stated place in the path | assumes things not yet taught | one or two jumps | each step rests only on earlier ones |
| **tasks**: validity of the questions | wrong or ambiguous answers | mostly fine, a few fixes | each has one defensible answer and a fair explanation |

An approval needs every score at least 3 and **chess at least 4** (`tools/apply_review.py` refuses otherwise). Use `changes-requested` with comments saying what to change, by step number.

## 3. How long it takes [I: estimates from step counts, not measured]

Counted from the packets: the 35 core lessons hold 426 steps (82 cards, 42 boards, 194 tasks, 36 contrasts, 31 drills, 41 reflections); the 16 exemplars hold about 1,100 (265 cards, 433 boards, 164 tasks, 29 contrasts, 129 reflections). The exemplar course lessons are being rewritten at the same time as this was built, so their counts will move.

| Reviewer | Core S0 to S2 | Exemplars | Total |
|---|---|---|---|
| Strong player, reading carefully (cards about 45 s, boards about 1 min, tasks about 30 s, contrasts about 2 min) | about 4 hours | about 12 to 14 hours | **about 16 to 18 hours**, in sessions of 2 to 3 hours |
| Teacher, reading for clarity and order (about 60% of that) | about 3 hours | about 7 to 8 hours | **about 10 hours** |

Do a **pilot first**: one S0 lesson (`L-FND-BOARD-1`, 13 steps) and `L-TAC-FORK-1` (65 steps), then agree how long a lesson takes before committing to the rest. If the real time is double, review S0 to S2 first and the exemplars second; the order in `review/index.md` is the order of the path. A reviewer may sign off any single lesson; partial progress counts and is shown honestly.

## 4. Recording a sign-off

One file per lesson: `content/review/<lesson-id>.json`. One object, or a list of objects when two people review the same lesson.

```json
{
  "lesson": "L-TAC-FORK-1",
  "revision": "0a1b2c3d",
  "reviewer": "Full name as it should be credited",
  "reviewer_role": "strong-player",
  "date": "2026-11-20",
  "scores": {"chess": 5, "clarity": 4, "prerequisites": 4, "tasks": 4},
  "comments": "Step 14: the second move also wins; add it. Otherwise fine.",
  "verdict": "approved"
}
```

- `revision` is printed at the top of each packet and in `review/index.md`. It is the first 8 hex digits of a sha1 of the lesson's steps (each carrying its stable step id), the same hash `tools/build_content.py` puts on every shipped lesson; `tools/review_packet.revision()` computes it from the lesson file. It ties the sign-off to the exact text reviewed.
- `reviewer_role` is `strong-player` or `teacher`. `verdict` is `approved` or `changes-requested`.
- `tools/apply_review.py` reads the files and writes into the lesson file:
  - approved by a strong player, revision matches: `review.status` becomes `human-reviewed`, with reviewer, role, date, revision, scores and comments;
  - approved by a teacher only: recorded under `review.teacher_reviews`; the lesson stays `needs-human` (chess is not certified);
  - revision does not match (the text changed after the review): nothing is promoted; the lesson stays `needs-human` with a note naming both revisions;
  - a lesson already `human-reviewed` whose text later changes goes back to `needs-human` with a note; one marked `human-reviewed` without a sign-off file is reported as a problem;
  - `changes-requested`: recorded as a note.
  `--dry-run` reports without writing. Run `tools/review_packet.py` again afterwards so the index shows the new state.
- `tools/check_all.py` and `tools/validate_lessons.py` accept `human-reviewed` lessons (they only look at `review.status` being one of the three allowed values; items without claims are allowed only when human-reviewed). `tools/test_review.py` (stage "review tools" of `tools/check.py`) tests the hash, the packets, the sign-off rules and the stale cases.

### Honesty rules
- Nobody marks a lesson reviewed except by a real sign-off file from a real named person who read the packet. The author (an AI assistant) never writes one, and this repository contains none until a person supplies it.
- A review applies to a revision, not to a lesson forever. Editing a lesson after review removes the status; fix the lesson, then ask again.
- The app and the docs may say "human-reviewed" only for lessons whose file says so. Counts of reviewed lessons come from the files.
- Reviewers are credited as they ask. Credit appears in the lesson's `review` block; whether and how the app shows it is a product decision for the owner.

## 5. Open questions for the owner
1. Who are the two reviewers, and how are they credited (name, handle, or "a strong player")? Until there is a name, nothing changes.
2. Is one strong-player approval enough per lesson, or should the exemplars need two? Default: one, since the roles differ and the engine already checks the claims.
3. Packets are generated (about 1.7 MB for 51) and regenerable; share `review/packets/` as a zip or a printed PDF. Keeping them out of version control is reasonable. The sign-off files in `content/review/` are the records and belong in the repository.
