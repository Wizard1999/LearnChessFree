# The first hours: a walkthrough for a true beginner

Status: design with a verified starter set. Every concrete position cited here is in `content/items/first-hours.v0.json` and **passed `tools/validate.py`** (rules facts via python-chess, material and mate claims via Stockfish 19 Lite, depth 16, no tablebase). Everything else (timings, item counts, thresholds) is my estimate **[J]** to be tuned with real learners. The text is original; no Lichess or Chesscademy wording or content is used.

## Why it looks like this

- **Text and interactive boards only, no video.** Agreed: books teach this way, and an interactive board replaces the book's diagram. Video costs more to make and change, cannot be machine-checked, was the thing that broke Chesscademy at launch (third-party hosting throttled), and is poor for accessibility. The one dynamic element we do keep is a **step-through board**: a short annotated line you advance one move at a time, with arrows and one sentence per step (the worked-example format).
- **Learn by doing from the first screen**, as Lichess Learn does well [V: its stage list is pieces → capture, protection, combat, check, mate → castling, en passant, stalemate → piece value]. We keep that shape for the very start and do not try to beat it on rules. Where we differ: unlabeled mixed items from session 1, predictions and contrast pairs, spaced return, and game evidence.
- **One idea per card, then act.** Cards are under about 60 words. No card is followed by another card without a board task between them.
- **Support fades by design.** Early on the system shows legal squares and flags attacked pieces (the "care" role); later those aids are off by default and their use is logged.

## What each session contains

Timings are for a motivated adult with no chess background **[J]**. "Mixed" means items from several concepts with no theme announced (cue level 3).

### Session 1 — Squares and movers (about 40 min)
1. **Naming squares** (5 min). Two cards (files a–h, ranks 1–8), then a rapid "tap e4" game, 20 prompts. *Why first:* every later explanation uses square names.
2. **Rook** (6 min). Card: a rook slides any distance along a rank or file; it cannot jump; it captures by landing on an enemy. Board: tap the rook and legal squares light up; reach target squares; capture a pawn; then **"tap every square the rook can reach"** with no highlights (`I-ROOK-001`, a position with an own pawn blocking and an enemy pawn to capture; 11 correct squares, verified).
3. **Bishop** (6), **queen** (5, "a rook plus a bishop"), **king** (5, one step; notes that it can never step next to an attacked square, expanded in session 2), **knight** (7, the jump; includes "reach this square in two jumps"). Verified examples: bishop with a blocked diagonal (`I-BISH-001`); knight from b1 has exactly a3 and c3 (`I-KNIGHT-001`).
4. **Pawn** (6). Moves forward, never back; two squares from the start; **captures diagonally, a different rule from moving** (`I-PAWN-001`: blocked ahead, exactly two captures, verified). Promotion shown, not yet tested.
5. **Mixed round** (5): about 10 unlabeled items such as "which of your pieces can capture the black bishop?" and "can this knight reach b6?". The learner marks confidence (low/medium/high) on three of them before feedback.
- **Recorded:** attempt, cue level, hints, time, confidence.
- **Return:** next day, a 4-item retrieval, fresh instances.

### Session 2 — Taking, losing, and not losing (about 40 min)
1. **Piece values** (4): pawn 1, knight 3, bishop 3, rook 5, queen 9, presented as a rule of thumb with exceptions to come.
2. **Free piece or trap?** (10). First a free piece (`I-CAP-001`: the bishop takes an undefended knight and wins 3, verified). Then the first **contrast pair** (`I-CAP-002`): same shape, but the pawn is defended, so taking loses the bishop for a pawn (net −2, verified). The learner predicts before the reveal; the reason shown comes from board facts ("defended by the pawn on d6").
3. **Counting attackers and defenders** on a square (generated, about 10 items).
4. **Check** (6): the three ways out (move, block, capture); tasks "tap every legal reply" (generated).
5. **Mate in one** (6): back-rank mate with the rook (`I-MATE-001`, verified), then about 10 generated patterns. **Stalemate** (4): `I-STALE-001` (verified): "same material, one move different: mate or stalemate?" because the difference is a rule beginners get wrong.
6. **Mixed** (6): "is this check, mate, stalemate, or none?" plus capture decisions; confidence on a few.
- **Habit seed:** "Before you move: is one of my pieces attacked, and is it defended?" Shown as a one-line routine, not a lecture.

### Session 3 — A whole game (about 45 min)
1. **Castling** (6): legal kingside and queenside (`I-CASTLE-001`, verified), then the contrast `I-CASTLE-002`: the king may not pass through an attacked square (verified illegal). **En passant** (5, `I-EP-001`, verified). **Promotion** (3). **Draws** (3): repetition, the 50-move rule, insufficient material.
2. **Unfamiliar-board legal-play test** (6): the first held-out check; flipped boards, unusual positions.
3. **First game vs the bot** (15–20), easiest level. The system is in **care** mode: illegal moves blocked; a gentle marker when one of your pieces can be captured.
4. **Reflection** (5): before any engine commentary, the learner marks **one moment they were unsure** and what they expected the opponent to do (self-direction stage 1, "observe"). Only then does the system show the biggest swing of the game, and they compare.

### Session 4 — Opening ideas and the safety check (about 40 min)
1. **Three principles with reasons** (12): take the centre, develop pieces before moving one twice, castle early. Each is a step-through board (a short original model line, one sentence per move) followed by a task and a contrast showing what goes wrong if ignored.
2. **The threat check** (12), the first piece of the **thinking loop** (v1: "what does their last move threaten? is anything of mine loose? then choose"). Verified examples: `I-THREAT-001` (the position where Black must notice White threatens Qxf7# if given a free move; checked by giving White a "null move") and `I-THREAT-002` (after Black ignores it, Qxf7# is mate). Mixed in on purpose: positions with **no** threat.
3. **King and queen vs king** (6): play it out against the bot, with a move budget.
4. **Game 2** (15) with the threat-check prompt on for the first five moves, then off ("fading"); whether the learner checks unprompted is logged.

### Session 5 — First tactics (about 40 min)
1. **Spaced return** (6): fresh instances of sessions 1–2.
2. **Forks.** One card, then the cue ladder in miniature: **named** ("find the fork", `I-FORK-001`: Nc7+ wins the queen and keeps the knight, +9 verified) → a short themed set → **mixed with no-tactic positions** (`I-FORK-002` as the cue-3 version, and the quiet position `I-QUIET-001` as a distractor) → **contrast lab** (`I-FORK-003`: move the king to d8 and the fork loses the knight, −3 verified; the learner predicts first).
3. **Game 3** with an **opportunity log**: did a hanging piece or a fork appear, and did the learner take it? That is the first cue-level-4 evidence.
4. **End-of-hours map** (5): shows capability statements with their evidence, e.g. "recognised the hanging piece in 7 of 8 unlabeled positions; not yet tested under a clock," never a score or a rating.

## Counts and cost **[J]**
Roughly 25 short text cards and 6 step-through lines authored; about 250 interactions, mostly **generated** from rules (movement, attack counting, check, mate in one) and checked by the validator, with about 30 hand-authored positions for contrasts, threats and forks. Today there are 13 hand-verified items covering 12 position families.

## What would show this does or doesn't work
- Learners who finish session 2 but cannot answer **unlabeled** items in session 3 → cue-level-3 practice came too late; move it earlier.
- Reflection answers that are empty or generic after game 2 → the prompt is too abstract; give a concrete question.
- Learners ignoring care-mode markers and then blundering when they are off → fading is too abrupt.
- Time per session far outside 30–50 minutes → resize.

## For Andrew specifically
You are not a true beginner. Your path would start with a **placement** of about 20–30 minutes: roughly 30 mixed items across levels (including no-tactic positions) and one game, with node-by-node test-out. I expect sessions 1–3 to be skipped. Your real curriculum starts around forks and pins under no cue, the threat check as a habit, and the positional basics you remember from Chesscademy: development, castling early, bishop pair, connecting rooks, open files, passed pawns, and the Greek gift. **Those authored middle-tier lessons are the real work and are not written yet.** That changes build order (see the product design, D13).
