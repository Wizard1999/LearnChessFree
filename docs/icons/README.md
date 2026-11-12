# Scholarmate concept icons (absorbed 11 Nov 2026)

Andrew designed an illustrated icon system and handed it over as two ZIPs plus a start-here note. This folder keeps the guidance and catalogs; the pictures live in `assets/icons/` as 256 px WebP (155 images, 2.1 MB, with `icons.json`). The 1254 px masters, prompts, variants and the full review history stay in Andrew's `scholarmate-icon-history.zip` and `Scholarmate-Claude-Handoff.zip` (about 630 MB; not in the repository). Rights: Andrew's own generated art, his to license; nothing here is from a third party [V: nothing in the package says otherwise; the generator used is named only in his manifests, which are not in this repository].

## What is here
| File | What it is |
|---|---|
| `design-doctrine.md` | The standing rules: subject, rendering, black space, frame, use in the school. Latest explicit feedback beats older batch notes. |
| `prompting-guide.md`, `production-guide.md` | How to make another icon (one master each, no baked frame, check at 32 px) and how to export it. |
| `review-status.md`, `batch-0*.md`, `Scholarmate-review-ledger-2026-11-10.md`, `extension-review.md` | Approval history. Approval is per exact image version, and approved art is not the same as approved meaning. |
| `scholarmate-core-icon-map.csv` | Andrew's proposed mapping of all 206 skills to 88 icons, with a status per row. The 206 ids match `content/skills` exactly [V]. |
| `gallery-art-index.csv` | The 159 gallery tiles (155 pictures, 4 blank slots: En Passant, Perpetual Check, Battery, Hanging Pawns) with review status and source master. |
| `../../assets/icons/icons.json` | The same tiles with the file name of each WebP. `frame.svg` is the thin bookbinding frame; it is applied outside the art, never baked in. |

## Status in numbers [V, counted from the CSVs]
- Gallery: 128 approved, 9 provisional, 10 earlier draft, 4 draft, 4 deferred draft, 4 blank.
- Skill map: 167 skills approved, 23 earlier draft, 8 provisional, 7 draft, 1 approved art with a proposed reuse. So **38 of 206 skills (18%) rest on art that is still draft or provisional**.
- Reuse is heavy: 88 icons for 206 skills. The Endgame candle alone is on 15 skills, Checkmate on 10, Weakness on 8, Evaluation and Calculation on 7 each.

## Doctrine in brief (from Andrew's files, our wording)
One recognisable object or action, not a miniature chess diagram; painted warmly (Ghibli for colour and life, Warcraft for small-size readability); black surroundings; a thin separate frame; it must still read at 32 px. Pieces appear only for the twelve dedicated portraits and where a chess piece is the metaphor (pawn promotion, the pawn in the mirror). Hide concept icons in unlabelled retrieval exercises until feedback, because the icon can tell you which technique is relevant. Icons supplement text and never replace the accessible name.

## What I think of them (D89; [H] unless marked)
**They are good, and the metaphors that work are very good.** Pin (a real pin through cloth), Fork (a pitchfork), Skewer, Defense (shield), Evaluation (scales), Time (hourglass), Check (crosshair on the king), Calculation (abacus), Memory (index-card box), Tempo (metronome), Balance (stacked stones) and Promotion (pawn beside a crown) read at once and carry an idea before any chess word, which is what an icon for learning should do. The doctrine of "an object or action first, chess second" is right: a newcomer who has never heard of a zwischenzug can still hold on to "the inserted step" as an image. The painted warmth also matches the school's feel (D85, D88) better than flat glyphs would.

**Will it help teaching? Probably yes in three narrow ways, and not in others.** Reasons come from how people remember pictures with words (dual coding) [R, not tested here], so treat the benefit as a hypothesis to measure:
1. *Finding things.* Skill lists, the Constellations skill panel, search and "weak skills" become faster to scan when each concept has a stable picture. This is the safest gain.
2. *Recap and review.* A returning learner sees the picture they learned the idea with. This is where a consistent image helps recall most.
3. *After-the-fact labelling.* After a move or a game, "this was a Pin" with the picture is a stronger tag than text alone.
It will **not** help, and could hurt: (a) inside lessons and next to boards or in the first hour (D55/D56, art direction section 2: nothing competes with the first move); (b) in unlabelled testing before the answer (the doctrine already forbids this and so do we); (c) where several skills share one picture, because identical icons stop distinguishing: 15 skills on one candle (Endgame) is a label for the section, not for the skill.

**Risks to manage:** the weakest assignments are scenes that need explaining (crowd, tug-of-war, the hidden snake) and anything still draft; 18% of skills lean on draft art; a few metaphors can mislead if read literally (Sacrifice as a bird sheltering a chick is a metaphor about giving, not about material). Mitigation: always show the skill name beside the icon, use the icon only for concepts whose picture Andrew has approved *as a meaning*, and test recognition (can a learner match icon to name after one session?) as a `(feedback)` task after release.

## Decision D89 (default, Andrew can change it)
- **Where icons may appear:** skill panel and star details on Constellations, skill and lesson lists from Stage 3 onward, the Practice and Contrast lab skill tags *after* an answer, Games review and recap labels, search results, milestone cards.
- **Where they may not:** the first two stages and the first game, any lesson board, any exercise before feedback, the Library wall.
- **Shared art:** a skill that shares an icon shows it in a small size and the section name, not as a claim of identity. Skills on draft or provisional art show no icon until the art is approved (an icon that may change is worse than none).
- **Build time:** a script (`tools/`, not yet written) joins `scholarmate-core-icon-map.csv` to `icons.json` and writes one lookup used by the app; icons ship as the 256 px WebP with the frame drawn in CSS.
- **Conflict to settle:** `art-direction.md` (D59) says art is for course covers and plates and "never inside a lesson". These icons are small functional labels, a second register next to the atlas. Both can stand; the atlas stays deferred, the icons are cheap to add to lists first.

## Open items
- Deferred art (En Passant, Perpetual Check, Battery, Hanging Pawns) and dedicated Exchange Sacrifice, Good and Bad Bishops. En Passant is the highest priority for beginners (Andrew's own note).
- Review draft assignments in context (Endgame, Planning, Center, File, Discovered Attack, Interference, Opposition, Space) before wiring them.
- Provisional: Legal Move, X-Ray Attack, Rook Lift, Backward Pawn, Minority Attack.
- Decide whether the twelve piece portraits become piece art in lessons (they would need a separate decision: the board pieces must stay the app's own set).
