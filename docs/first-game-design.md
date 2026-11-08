# The first game: guided moves in ten minutes (design, 8 Nov 2026)

Andrew's rule (D55): within about 10 minutes of starting, the learner plays guided moves in a real game and sees and feels what a game is; about an hour later they can play a legal (bad) game. This note covers the app and tooling side of the first promise. The beginner lessons themselves (`content/lessons/L-FND-*.json`) are rewritten separately. Evidence labels as in `CLAUDE.md`.

## 0. The hook (D56, Andrew 8 Nov 2026)
The first moments decide whether anyone stays. The goal of the first hour is not knowledge: it is that the learner sits at a board, plays a real game with guidance and thinks "this is cool". Once they can play a legal game they are hooked and want the lessons that come next. For this work that means:
1. **A board and a marked move within seconds.** The Start screen's one button opens the guided game directly: no menu, no theory before it. (Returning learners with any progress see Today as before.)
2. **The guided game feels like a real game:** a recognisable opening, the opponent answers, a capture and a check happen, and it ends on a small win (for example winning a piece or a quick mate). One-line captions name what each piece is doing; never a lecture. (Authoring guidance for the lesson files; the validator checks legality and caption length, not the drama.)
3. **End on a small win plus a visible next want:** the `end` sentence points at something the learner almost sees ("something is about to happen here: the next lessons show you what").
4. **Play now is always available and never a gate:** a quiet link on the Start screen ("Just play a game"), a "Play now" button on the Today card after the first finished lesson, and the "Play your first game" card after the first rules lesson.
5. **Rules are taught when the game needs them:** castling, promotion, en passant and stalemate after the first game (lesson order, `tools/build_path.py`).

## 1. The ten-minute flow
1. Start screen (a learner with no progress): one button, **Start learning**. It opens the **guided game** of the first lesson on the path that has one (searched among the first three path lessons, `firstGuided` in `lib/firstGame.ts`) on its own, full width: a board and a marked move in front of the learner within seconds. Its last button is "Next: <first lesson>", which opens the first lesson. When the lesson met later contains the same guided game, it says "You have played this game already" with Play it again / Continue (remembered on the device, kv `guided:played:<lesson>:<step id>`). If no early lesson has a guided step yet, or its body cannot load, the button opens the first lesson as before.
2. The guided game: a short real opening (about 8 to 16 plies) from the standard start. The learner moves their own pieces; the opponent answers by itself. Each move has a one-sentence caption about what that piece is doing ("The knight jumps out towards the centre"). No notation is needed to follow it.
3. After the first finished lesson, the Today card offers a quiet **Play now** button next to the main action (a game against the gentle opponent, see section 3). It is an offer, never a gate.
4. After L-FND-CHECK-1, or any lesson of stage S1 "Legal play", Today shows one small card, **Play your first game**, until the learner finishes a game against the practice opponent or says "Not yet" (hidden for a week); while it shows, the Play now button is hidden so there is one offer at a time. The Up next lesson stays the one main card.

The time to step 2 depends on the lesson files: the app only guarantees that a guided step is quick to play (about 0.4 min + 0.15 min per move in the planned-time formula, [I] until measured by `lib/measuredTime.ts`).

## 2. The `guided` step type
```
{"type":"guided","title":"Your first moves","fen":"<optional, default the standard start>",
 "moves":[{"move":"e4","by":"learner","say":"Your pawn steps forward two squares to claim the centre.","hint":"The pawn in front of your king."},
          {"move":"e5","by":"opponent","say":"Black answers the same way."}, ...],
 "end":"That was the start of a real game. Next: how each piece moves."}
```
- `move` is SAN from the position reached so far. `by` is `learner` or `opponent`; every learner move is the same colour (the board faces that side) and the opponent plays the other.
- The learner's move is **marked**: an arrow from the piece to the target square, a highlight on both, and a line of text ("Your move: the pawn from e2 to e4"), which is also what a screen reader hears.
- Any **other legal** move is not played: the piece goes back and the line says "Not this one in the story: try the marked move" (plus the move's `hint` if it has one). It does not count as a mistake; nothing is recorded as an attempt. Illegal moves cannot be made (the board only offers legal destinations).
- **Show me** plays the marked move for the learner.
- The **opponent's** reply plays by itself after a short pause, with the board's move animation (off when the system asks for reduced motion).
- The caption under the board is the `say` of the move just played. At the end, the optional `end` sentence and a Continue button.
- Touch and mouse: drag or tap-tap. Keyboard: the board's existing grid (arrow keys, Enter on the piece, Enter on the square). The marked move is spelled out in words in a visible line and announced politely.
- Validation (`tools/validate_lessons.py`): FEN valid, at least one learner move, every SAN legal in turn (python-chess), colours consistent, `say` present (warning if missing, warning over 30 words), SAN in canonical form (warning). Captions follow the authoring guide: they may only state what the rules or a claim establish ("the knight attacks f7" is a rules fact; "White is better" needs a claim).
- Minutes: 0.4 + 0.15 per move (`lib/lessonTime.ts`, `tools/build_content.py`, `tools/check_depth.py` agree; a vitest compares them on every shipped lesson). For the depth report a guided step counts as a board.
- The acceptance logic is a pure helper (`app/src/lib/guided.ts`) with unit tests.

## 3. The gentle opponent
The invitation and the Play now button open `/play?from=invite&kind=stockfish&bot=b1&color=white&help=1` (`GENTLE_PLAY_PATH` in `lib/firstGame.ts`): **Stockfish "Beginner"** (`b1` in `app/src/engine.ts`: Skill Level 0, search depth 1), the learner plays White from the standard start, and the hint button is on. Why Stockfish b1 and not Maia 1100: Maia needs a download of about 18 MB the first time and is trained on games of club players (rated about 1100), which is far stronger than a learner in their first hour; b1 is already in the app, works offline at once and blunders often [I: not measured against beginners]. The learner can change anything on the Play page before starting. Nothing in the curriculum waits for the game.

## 4. Not done here
- The guided games themselves (lesson files, another agent).
- Measuring the real time to the first guided move with beginners (G1 baseline).
- A game "from the position the lesson taught" for the guided step: the `finale` step already exists for that (D41).
