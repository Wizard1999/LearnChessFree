# chess.com free-trial site tour (not lessons), 8 Nov 2026

Method: Andrew's own trial account in the built-in browser (own tab), looking only at what the interface shows. No settings, billing, notification or upgrade controls touched; no rated play against people; no screenshots saved into the repo. Wording is mine. [V] = seen on screen today, [I] = my inference. Lessons are covered in `docs/research-chesscom-lessons.md` and not repeated here.

## 1. Navigation map [V]

Left rail: Play, Puzzles, Learn, More. More expands to Train, Watch, Community, Other.
- Play hub: Play Online, Play Bots, Play Coach, Play a Friend, Tournaments, Chess Variants (plus Game History, Leaderboard).
- Train hub: Courses, Analysis, Insights, Classroom, Endgames, Practice, Aimchess Training.
- Watch: Events, ChessTV, Streamers, Playing Now.
- Community hub: Friends, Clubs, Members, Coaches; Top Players, Rankings, Leaderboards; Chess Today, News, Articles, Blogs, Forums.
- Account row (bottom of rail): search, name, friends, messages (badge), bell, settings. A 1-unread badge sat on the messages icon from the start.
- Learn page: a vertical path (see 2). Puzzles page: a board with a game-like map (see 3).

## 2. Learn hub and path [V]

- The Learn page is a board on the left and a tall winding path on the right with a coach avatar bubble on top ("learn how to move the king, the most important" style nudge). The first tile is "Next" and a green "Next Lesson" button sits at the bottom. Sections are labelled New to Chess, Beginner, Intermediate, Advanced and show "next section" markers.
- The page text exposes no streak, XP or goal controls on this screen. Nothing on the path showed a placement quiz.

## 3. Puzzles [V]

- First visit shows an intro modal (three benefits) and then a **puzzle journey map**: 20 numbered stages on an illustrated landscape (trees, pond, house). Bottom of the side panel: a progress bar to the next level and a green "Solve Puzzles" button. A list icon opens the mode menu: **Solve Puzzles, Daily Puzzle, Puzzle Rush, Puzzle Battle, Custom**.
- A coach bubble above the map says daily puzzles make it easier to see the opponent's mistakes.
- **First two puzzles are coached**: puzzle 1 (white Rf1, black Kh8 with g7 h7, mate in one) opened with a bubble that says it is the player's turn as white and can win in one move. A "Hint" button gave step 1 (the piece to move highlighted; the button then became "Move", which reveals the move). A wrong move (Rf7) showed a red cross on the piece, a "Hint" bubble with a Socratic line (king trapped on the edge; can you finish it?), and retry, show-solution, analysis and next controls. Solved: "Solved. Yes! That's the way!", **+10 points**, progress bar up.
- Puzzle 2 (Ne5 to f7 mate): solved, with a **speed bonus (+15) and a +50 badge** animation, so points are tied to speed.
- After puzzle 2 the board dimmed and read "You Completed Level 1!". **Level 1 was two puzzles.** [I] The first level is a very short on-ramp, then the map unfolds.
- Not tested: Puzzle Rush, Battle, Custom, rating display after the on-ramp, themes (the mode menu offers Custom, which I did not open).

### 3b. More Puzzle modes [V]

- **Custom puzzles** (page title "Learn Themes and Patterns"): intro modal says to practise themes without time pressure, pick the difficulty, and retry puzzles missed before. Controls: Include = All Puzzles or **Puzzles I Have Failed**; a rating range; Select Theme(s). The list shows **19 themes plus All Themes, each with a personal "My Score" percentage** (on this account All 3%, Mate in 1 50%, the rest 0%). Themes: Back Rank Mate, Discovery, Endgame Tactics, Fork, Hanging Piece, Mate in 1, Mate in 2, Mate in 3+, Mating Net, Opposition, Pawn Endgame, Pin, Promotion, Queen Sacrifice, Sacrifice, Scholar's Mate, Skewer, Trapped Piece, Under Promotion. Button: Start!.
- **Puzzle Rush**: tabs 3 min, 5 min, Survival. Intro says puzzles start easy and get harder; **three misses end the Rush**. Shows Best Today and Top Score, and a Leaderboard. Not played.
- **Puzzle Battle**: head-to-head Rush against a random opponent or invited friends; page shows "November points" (a monthly season) and a separate battle rating (778 on this account); intro says **win streaks multiply season points**. Not played (person-vs-person).
- **Daily Puzzle**: dated (8 Nov 2026), previous/next day arrows, a Hint button, a heart, a puzzle title, and a social line "Solved by 1,308,420". Intro: new puzzle daily; **puzzles get harder through the week (Mon to Sun)**.

## 4. Play Coach [V]

- Opens on a coach called Coach David, shown with a rating of 100. Level picker: **Casual, Balanced, Challenging**, each with a one-line description ("an easier game so you can focus on learning"), plus "Show All Levels" (not opened). Colour icons (white, random, black), one big Play button. The coach greets first.
- In the game: a vertical eval bar beside the board, a resign flag, a **hint bulb**, and a **take-back arrow**. After 1.e4 the coach replied in words ("moving your king's pawn first? a fine idea") and named the opening in a strip above the move list; a small book icon marks book moves on the board. After the coach's 1...Nf6 it named the opening (Alekhine's Defense) with a one-line character note.
- **Hint is Socratic and two-step**: press 1 gives a question in the coach bubble ("is one of your pieces under attack?"); press 2 highlights the attacked piece on the board (e4, in blue). It gave no move. [I] A threat-awareness hint, not an engine suggestion.
- Take-back worked at once and returned to the starting position, no confirmation, no limit seen.
- Not played to the end, so I did not see in-game blunder warnings [I].

## 5. Play Bots [V]

- Intro modal ("challenge a bot, from beginner to master"), then a roster. A featured seasonal strip: a themed event ("Grand Chess Auto", 22 days left) with five bots rated 5 to 30 and a reward track (0/125 collected). The whole board and background changed theme for the event. [I] Seasonal events are an engagement mechanic sold with cosmetic rewards.
- **Roster groups with counts**: New to Chess 5, Beginner 15, Intermediate 15, Advanced 20, Master 10, Adaptive 5, Athletes 15, Musicians 6, Creators 36, Top Players 22, Personalities 14, Visualization 25, Engine 25 (about 213 bots). A bot card shows a name, flag, rating (first: Marko, 300), a portrait and an intro line in character.
- Options: time controls from No Timer through Bullet, Blitz, Rapid to Standard, and a **Bot Chat** toggle.
- In game: the bot speaks in character after your moves (after a bad capture it remarked that standing in the wrong place has a price). Same flag / take-back / hint buttons. Reward points need enough moves ("play more moves to earn").
- I played four moves, blundered a bishop on purpose and resigned (unrated). The result card offered **Game Review (primary button), New Bot, Rematch**.

## 6. Game Review: the benchmark [V]

Reached from the bot result card; it loaded in about 10 seconds.

- **Summary screen**: coach avatar saying "let's review some key moments", an **evaluation graph**, two player columns with **accuracy %** (56.1 vs 66.4), a **classification table with counts per side** (Brilliant, Great, Best, Excellent, Good, Mistake, Miss, Blunder, coloured icons), a **Game Rating per side** (400 and 800 here, estimated from the game) and **four phase grades per side** (Opening, Tactics, Strategy, Endgame, icons; a dash where not reached). Buttons: Start Review, New Game.
- **Start Review** walks the game move by move. Each move gets a bubble: classification label, evaluation chip and one short sentence. Examples: "Book +0.27: you give yourself dozens of strong options after e4"; for Black's 1...Na6 an inaccuracy mark and a green arrow for the engine's better move; for my Bxf7+ "Blunder -2.00: you are losing a bishop this way" with a red arrow showing the capture. Forced moves are labelled "Forced". Opening names on a strip.
- **Per-move controls**: a bulb (hint), a "show best move" button that **plays the engine's best move as a variation in the move list** with its own bubble ("Best +1.50: developing the knight and increasing influence in the center"), a next arrow, a Resume control back to the game line, play/pause, first/last, the eval graph with a marker, a Share button.
- **Skills panel** (bottom button): tabs Fundamentals, Openings, Tactics, with counters such as Captures 0/5, Checks 0/5, Castles 0/3, Checkmates 0/3. [I] Lifetime skill ticks across games.
- A left eval bar throughout. An engagement toast appeared: "Second Opinion: you had a game analyzed!" (an achievement).
- **I did not see a separate "learn from mistakes" retry quiz** in this flow; the nearest was show-best-move. A Retry control may exist on larger games [I, not seen].
- Sentences are short (about 10 to 15 words) and template-like: they name the idea but do not explain it at length. [I] That fits the support articles' claim that fuller coach explanations are paid.

## 7. Practice and drills [V]

- Practice hub (a rating of 400 was already assigned to this account): **Master Games, Openings, Drills, Custom Position**.
- **Drills** groups: Attacking, Defending, Endgame Fundamentals, Endgame Practice, Imbalances.
- Endgame Fundamentals lists 10 positions, each with a title and a one-to-two sentence goal: King and Pawn vs King (two with the king in front), King and Two Pawns vs King, King vs King and Rook Pawn, King and Two Pawns A File Apart, Bahr's Rule (a typical win, a typical draw), Zugzwang, Triangulation, Outside Passer.
- A drill = a set position vs the engine: choose colour, choose Engine level (default Intermediate 1200), press Practice, play it out. The eval bar shows during play (it showed a mate count, "M13", in the first drill). An achievement toast fired: "Train Your Brain: you attempted 1 drill!".
- [I] The goal and the idea are stated before the position (labelled testing), the opposite of our unlabelled testing.

## 8. Analysis board [V]

- Landing: a paste box (PGN, FEN or study link) with Load, and Set Up Position, New Analysis, Game Collections, Game Search (master games, other players, your games), Explore, Saved Analysis, Classroom, Load Previous.
- After one move: tabs Analysis, Games, Explore. The engine strip reads **"Stockfish 19 Lite, depth 20"**, the same engine as ours. Top three lines with eval chips, opening name, move list, a sentence "e4 was played". Bottom: New, Save, **Review**, "..." menu.
- **Explore = opening explorer**: next moves from "All Chess.com Games" with an eval chip, a percentage share (after 1.e4: ...c5 32%, ...e5 23%, ...e6 12%, ...c6 11%, ...d5 7%), a result bar, a "More" fold, and a "Notable Games" tab. **A "Recommended" list under it sells paid courses** (title, author, star rating, review count). Commerce sits inside the study tool.

## 9. Insights [V]

- Sections: Overview, Game Results, Game Shapes, Game Phases, Openings, Tactics, Moves, Calendar, Geography, with a date range (Last 30 Days). For this new account: **"This may take a while: analysing 6 of your games, 11 players ahead of you in the queue; we will notify you when ready"** (queue-based analysis).
- A banner says **Advanced Stats is replacing Insights at the end of the year**, with a survey link (not opened). A "Featured Insights" list shows famous players. Empty state: Games played 0, accuracy "--".

## 10. Navigation extras [V]

Train hub also lists Aimchess Training ("personalised training based on past games"), Classroom (shared board), Endgames ("practice endgames vs the computer"), Courses ("from your favourite chess players").


## 11. Home dashboard, streaks, engagement [V]

- **Home** (`/home`): a flame with "1 Day Streak" in the top right; three action cards (Play Online with time chips and Start Game; **Solve Puzzles** with a points bar and its own small streak flame; a **Learn card pointing at the next lesson**, here "The King"; Play Coach). Below: Game History table (opponent, result, **accuracy**, moves, date, a Review link per game), a Daily Puzzle card with a **weekly streak row (S M T W T ...)**, Friends, a Stats box (counts of Games, Puzzles, Lessons; ratings per format; puzzle rating) and a Black Friday course-sale banner at the top (an ad for paid courses, closable).
- **Achievement toasts** appear at the corner during normal use: "Second Opinion" (had a game analysed), "Train Your Brain" (attempted a drill). [V]
- Streaks: one site-wide day streak (any activity), a puzzle streak flame, a daily-puzzle week row. No XP total, no leagues, no daily-goal setter, and no placement quiz were visible in the places I opened; Puzzle Battle has a monthly "season". [V for what I saw; leagues, goals and e-mail settings were not opened.]
- Notifications (bell), messages (a 1-unread badge), settings: **not opened or changed**.

## 12. Membership page (read only) [V]

- Banner on this account: **7 days remaining on a free trial of Diamond; first billing date 15 Nov 2026 after the trial ends unless cancelled**. A timeline lists: Today (unlimited access), Day 5 (reminder), Day 7 (charged, cancel any time). [Flag for Andrew: the charge date is real; I did not click anything on this page.]
- Tiers and yearly-billed prices as shown after the trial: **Gold about $4.17/mo, Platinum about $6.67/mo, Diamond about $10/mo (marked "most popular"), Friends & Family about $16.67/mo for 2 to 6 members ("save 72%")**. A Monthly / Yearly switch ("save 41%") is on the page.
- Feature matrix [V, from the ticks]: Puzzles, Lessons, Bots, Play Coach, No Ads are in every tier; **Game Review starts at Platinum; Move Explanations, Advanced Stats and Courses Perks start at Diamond**; Friends & Family has all.
- Headline claims on the page (theirs, not verified): "Increase your rating 2.7x faster with Premium", "over 500,000 puzzles", "thousands of lessons by Chess Masters".
- [I] The "move explanations" layer (the plain sentences in Game Review) is the paid differentiator; my review used Diamond, so what I saw may be richer than a free account sees.

## 13. Openings hub, Videos, Articles, Other [V]

- **Openings**: quick links (Opening Principles, Key Openings, Learn the Queen's Gambit, Learn the Sicilian, Search for Openings Lessons); a popular list grouped by 1.e4 (Sicilian, French, Ruy Lopez, Caro-Kann, Italian, ...), 1.d4 (Queen's Gambit, Slav, King's Indian, ...) and Other (Reti, English, Bird, ...); and a side table of win/draw/loss shares per first move (1.e4 39 / 28 / 33, 1.d4 39 / 30 / 31). Tools: Explore Openings, Games Database, Opening Lessons.
- **Videos**: a plain chronological list: length, title, a GM badge and author, date, two-line blurb. Mostly opening and master-game series (Jan Gustafsson, Simon Williams). Structure only; no learning path.
- **Articles**: a news and editorial feed (club how-tos, odds chess, tournament stories, a back-rank piece), author title badges, dates. Not a curriculum.
- **Other** page (a catalogue of side features): Collections, Games Database, Chess Terms, Rules, Explore, Vote Chess, Solo Chess, Computer Championship, **ChessKid** (their kids' site, a separate link), Tools, **Vision** (a 30-second coordinate and move trainer with Coordinates / Moves / Both, colour choice and a show-coordinates toggle), Shop, Merch, Gift.

## 14. Mobile site (375x812 emulation) [V]

- Header collapses to a hamburger, logo, and four icons (play, friends, messages, bell). Home stacks as one column of cards, with the sale banner first.
- A puzzle on mobile: the coach avatar and bubble sit **above** the board, the board fills the width, Hint is a full-width button **under** the board, and the Puzzles level header is below the fold. No ads were visible in the puzzle. Layout matches the lesson finding (coach under or over the board, one big button).

## 15. Not seen, and why

- Onboarding and sign-up flow: the account already existed and was signed in; creating an account was out of scope. A skill-level quiz was not offered anywhere I looked.
- Notification, e-mail, league, daily-goal and billing settings: deliberately not opened.
- Puzzle Rush and Puzzle Battle were not played (a live timer and a human opponent); the puzzle rating logic after the two on-ramp puzzles, the themed puzzle feedback, and hint levels beyond the first two steps were not tested.
- Play Coach: full game, in-game blunder warnings and the post-game coach summary were not seen.
- Game Review: a mistake-retry mode (if any) was not found in a four-move game.
- Courses (Chessable-style) page, Endgames page, Classroom, ChessKid, Aimchess and Streamers were not opened.

## 16. Feature-by-feature comparison with Scholarmate

Scholarmate side from `CLAUDE.md`, `docs/competition-chesscom.md` and the page files in `app/src/pages` (Today, Practice, Placement, Plan, Lab, Games, Analysis, Openings, Play, Library, Achievements, Progress, Roadmap, Drill, Course views). I did not open our app today. [I]

| Area | chess.com (seen) | Scholarmate | Better | Adopt / avoid |
|---|---|---|---|---|
| Home / what next | One home with streak flame, three action cards, the next lesson as a card, history with accuracy | Today with one main card and the rest folded | Equal; theirs has stronger social proof, ours a calmer page | Keep Today. Adopt a small streak flame as an option; avoid a sale banner or sound-alike pushes |
| Learn path | One vertical path with four named levels and a coach nudge; locked tiles | 204-skill graph, radial map, courses, All lessons | Ours (prerequisites visible, free) | Keep the map. Adopt the coach-nudge line on the path |
| Placement / skill quiz | None seen; the account got a default rating of 400 | Placement page | Ours | Keep; say plainly it is not a rating |
| Puzzles | Journey map of 20 levels; 2-puzzle first level; points and speed bonus; coach text on early puzzles; Rush (3/5 min, survival, 3 strikes); Battle; Daily with weekday difficulty and "solved by" counts; Custom by 19 themes with a **per-theme My Score** and "puzzles I failed" | Practice and Drill from machine-checked items | Theirs on volume (500k) and modes; ours on checked claims and no ratings without grades | Adopt: per-theme score, retry-failed set, an easy-to-hard weekly daily puzzle from our bank, a 2-puzzle on-ramp. Avoid: speed points on beginners, three-strikes pressure, a rating attached to a theme (our rule 6) |
| Hints | Two steps: highlight the piece, then reveal the move; coach hints are questions | Evidence-fading support | Equal | Adopt the Socratic question hint ("is any piece attacked?") as hint level 1 |
| Play Coach | Casual / Balanced / Challenging; bubble commentary; opening names; hint and take-back; eval bar | Play against engine levels, guided first game | Theirs on warmth; ours on the guided game | Adopt a three-word level label and opening-name strip; keep unlimited take-back with a note when used |
| Play Bots | About 213 character bots, themed seasons, chat, reward track | One engine page; Maia-style bots not built | Theirs by a wide margin | Avoid cosmetics and reward tracks. Adopt: a small ladder of 8 to 12 bots with a one-line character intro each, human-like (Maia) when built |
| Game Review | Summary: accuracy, class counts, game rating, 4 phase grades; step-through with one-sentence bubble, arrows and show-best-move variation; Skills ticks; paid explanations | Games review with detectors; learn-from-mistakes; whole-game analysis; annotate-before-engine lesson | Theirs on instant polish; ours on teaching the review habit and verified wording | See section 17 |
| Analysis board | Paste PGN/FEN, setup, collections, search, explore with move shares, Stockfish 19 Lite depth 20, saved analysis | Move tree, variations, eval bar and graph, board editor, tablebase, master stats | Close; theirs has the move-share table with a bar and a games database | Adopt a win/draw/loss bar on our master-stats table; avoid in-tool ads |
| Drills | Position + stated goal + play vs engine; 5 groups; 10 endgame positions with one-line goals | Contrast lab, drills, tablebase-checked endgames | Ours on rigour and unlabelled testing; theirs on "play it out vs engine" | Adopt "play it out vs the engine" as an option for tablebase endings, after the solution step |
| Insights | Queue-based analysis, 9 sections; being replaced by Advanced Stats (Diamond) | Progress page | Theirs on breadth if you have many games | Adopt a few honest charts from our own data; avoid a queue and notify-by-e-mail |
| Openings | Hub with popular openings, per-first-move result table, courses and a games database | Openings page and deep-dive lessons | Theirs on catalogue; ours on principles and why | Keep. Adopt a first-move result bar |
| Video / articles | A chronological feed of GM videos and editorials | None, by choice | Theirs for people who like video | Avoid video; keep text-and-board |
| Streaks / achievements | Day streak flame, puzzle flame, weekday row, achievement toasts, monthly season | Achievements page | Theirs on visibility | Adopt toasts for learning behaviours (annotated before engine, retested after 3 days). Avoid streak shame; use the Today page |
| Membership | Gold / Platinum / Diamond / Friends & Family; reviews and explanations paywalled | Free, no account | Ours | Say so on About and Start. Avoid any tier |
| Mobile | One column, board full width, coach above, one big button | Phone layout built | Equal | Check that hint sits under the board |
| Social | Friends, clubs, leaderboards, Battle | None, by design | Theirs | Avoid; export and import only |

## 17. Game Review: what to copy and what to beat [V for theirs, I for the rest]

What they do well that Analysis and Games review can adopt:
1. **A one-screen summary before the walk-through**: accuracy per side, counts per class, a game-rating estimate, and four phase grades. It answers "how did it go?" in five seconds. [V]
2. **Classification vocabulary with one icon each**: Brilliant, Great, Best, Excellent, Good, Book, Forced, Inaccuracy, Mistake, Miss, Blunder. Consider a shorter set with plain words.
3. **Show-best-move as a variation** that keeps the actual game line (Resume), with a one-sentence reason.
4. **Arrows tell the story**: green for the better move, red for the refutation.
5. **A Skills tab** of small lifetime counters (captures, checks, castles, checkmates) that tick off in play.
6. **Eval graph with a marker** tied to the move list.

Where they are weak, and we can beat them:
- The sentences are short and template-like ("you are losing a bishop this way"); they say what, not why, and do not ask the learner to think first. Our annotate-before-engine and "what did you see?" prompts do.
- The review is a spectator view. There was no "your turn: find the better move" step in the flow I saw (nearest: a hint bulb). Our learn-from-mistakes can be the retry quiz they lack.
- Accuracy and "game rating" numbers are shown with no uncertainty (rating 400 vs 800 from four moves). Our G0 to G3 evidence grades are an honest answer.
- The detailed explanations sit behind a higher paid tier.

What to avoid: a rating estimate on short games, coloured grades with no reasons, queue-based analysis, and ad or course-sale surfaces inside the review.

## 18. Priority list for us (ranked) [I]

1. Per-theme personal score and a "puzzles I missed" retry set (checked bank, no rating attached to themes).
2. A one-screen game summary (accuracy, class counts per side, phase grades) before the walk-through, with a plain word set and arrows.
3. Socratic hint level 1 ("is any piece attacked?") before any move hint.
4. A short on-ramp for puzzles (two coached puzzles, then the map).
5. Win/draw/loss bar on our master-stats table.
6. Learning-behaviour toasts, no shame mechanics.
7. A ladder of 8 to 12 character bots (human-like if possible), no reward tracks.
8. Say "free, no account, no ads, nothing paywalled" in the first minute.

## 19. Notes for Andrew

- **The trial renews on 15 Nov 2026 unless cancelled.** I touched nothing on the billing page.
- The account carries old games from 2013 to 2024; I left them alone. One bot game and four coach/puzzle sessions were created today (one resigned bot game, take-backs in a coach game, two puzzles, one drill attempt). They affect Home stats only.
- A seasonal "Grand Chess Auto" bot event and a Black Friday course sale were running: sales and events change what a visitor sees.

