# Art direction: the Scholarmate atlas (draft 1, 8 Nov 2026)

Status: ACCEPTED by Andrew 8 Nov 2026 (D59); implementation deferred until the core curriculum is mostly or entirely complete (priority order 11b). Labels: [I] our judgement, [H] hypothesis, [V] checked here. Nothing here is built yet. Slots and sizes are in `docs/art-slots.md`.

## 1. The idea in one line
**An academy with a map.** Scholarmate's curriculum already is a map (the radial skill map, strands, stages). The illustrations are *places on that map*: a ridge, a gate, a harbour, a library, a crest. A learner who finishes a course has "been somewhere". Calm, noble, a little adventurous; never cute, never loud. [I]

Why this and not the "enchanted field guide" alone: a field guide is a good *texture* (handmade, observed, labelled) but a weak *structure*. The atlas gives every image a job: it says where this course sits in the whole school, and it keeps forty separate pieces of art feeling like one world. [I]

## 2. Where the art goes, and where it never goes
**Goes:** course covers and course-page banners; opening-series emblems; famous-game and history plates; empty states and the completion moment of a course; the Library wall already has book covers and is left alone.

**Never goes:** inside a lesson, beside or behind a board, in practice, play, analysis, or the first-hour path (D55/D56: nothing competes with the first move). The core path keeps its tinted cards. Art is for *choosing and finishing*, not for *learning*. [I, agreed with Andrew 8 Nov 2026]

## 2b. The three references to hold at once
- **System clarity (Apple, Google, Samsung):** generous space, one focal subject, consistent corner radius and framing, perfect legibility at thumbnail size, light and dark variants. This governs the *page around the art*.
- **Painted world (Ghibli and Zelda's wild-adventure feel):** soft light, weathered natural materials, a sense that the place is old and lived in, quiet wonder, scale (a tiny gate in a huge landscape). This governs the *picture*. We describe these qualities in words; we never name a studio, game or living artist in a prompt, and never reproduce a recognisable character, creature design or composition (see section 8).
- **Collegiate nobility (Ivy League, trad, European history, paladin, East Asian architecture):** heraldry, stone, brass, vellum, banners, timber frames, pavilions, courtyards, symmetry and balance, ritual. This governs the *subjects and the emblems*.

The three meet in one sentence: **a well-kept old academy set in a wild, beautiful land.**

## 3. Four registers (the variety), one family (the coherence)
Every image belongs to one of four registers. Variety comes from the register; coherence comes from the shared rules in section 4.

| Register | Used for | Looks like | Mood |
|---|---|---|---|
| **Landscape** | Course covers, strand banners | A wide painted vista: a pass, a harbour, a valley of squares, a bridge, a watchtower; a tiny figure or banner for scale | Adventure, discovery |
| **Heraldry** | Opening series (21 series) | A crest or banner on a plain field, with one emblem from the opening's idea (a dragon, a lion, an elephant, a star, a gate); stitched or carved texture | Nobility, identity |
| **Archive plate** | Famous games, history | Ink-and-wash or engraved plate: a table with a board, a window, a clock, a map, an instrument; muted, sepia-leaning, one accent colour | Study, memory |
| **Pavilion** | Playstyles, culture, "ways of playing" | Timber and stone architecture in a garden or on water; balance, symmetry, negative space; seasonal light | Harmony, composure |

Rule of thumb: at most one register per course family, so the Courses view shows four recognisable families rather than a jumble. [I]

## 4. The shared rules (what makes forty images one world)
1. **Light:** one low, warm key light from the upper left in every image, soft shadows, a thin cool rim light. No hard noon sun, no neon.
2. **Palette:** images live inside our tokens. Allowed dominant hues are the six brand colours (cobalt, persimmon, gold, jade, midnight ink, ivory) and their tints, plus earth neutrals (stone, timber, parchment). Each course family has **one dominant strand colour** (the same one the app already shows for that subject) and one accent. Never more than three saturated hues in a picture. [I]
3. **Texture:** warm painterly grain, visible but fine; the same grain strength everywhere. Clean silhouettes; detail concentrated at the focal point.
4. **Subject scale:** one focal subject occupying about a third of the frame, large calm areas around it. If it is not readable at 320 px wide it is wrong.
5. **Pieces:** when a chess piece appears it is *sculpture or architecture* (carved stone, bronze, timber), never a cartoon character with a face. Pieces cast shadows and stand on the world. This keeps the nobility and avoids cuteness. [I]
6. **People:** none with readable faces. A distant cloaked figure, a hand moving a piece, a silhouette on a bridge is allowed. No real person, ever (rule 5: no implied endorsement).
7. **Boards:** a board in an image is a position claim. Use an abstract board or a plain checker pattern; if a specific position is shown it must be legal and, if it carries a meaning, validated (`tools/validate.py`). Never a wrong-coloured corner square (a1 is dark).
8. **No text in the image.** Titles are HTML over the art (accessible, translatable, crisp). Generators spell badly.
9. **Frame:** every cover shares one corner radius, one inset hairline in the strand colour, and one gradient scrim at the bottom for the title. The system supplies the frame, so even a mediocre image looks like part of the school.
10. **Both modes:** art is mid-toned at its edges (no pure white or black) so it sits on ivory and on warm night paper; a CSS overlay adjusts brightness in dark mode.

## 5. Motifs we reuse (the vocabulary)
Use a few repeated objects so the world accrues meaning:
- **Gate** = a threshold concept (a rule, a first skill); **bridge** = a link between ideas; **watchtower** = vision and calculation; **harbour and ships** = development; **lantern** = a hint, with the gold of the app's curiosity colour; **banner and crest** = an opening or a school of thought; **compass and chart** = planning; **keystone** = structure; **garden and pavilion** = balance and patience.
- **Seasons for stages** [H]: a quiet idea that the path moves from dawn (first stages) to late autumn (late stages), used only in the banner light, never as a decorative filler.

## 6. How I would take it beyond your brief (my own view)
Your brief and the field-guide idea point at a warm adventurous world. What I would add or tighten, and why:
1. **The atlas frame** (section 1). It turns decoration into orientation and ties art to the Map we already built. Cost: nothing extra, it is a rule.
2. **Heraldry as the opening system.** Openings are *named schools with a history*; a crest per opening is the most honest visual form, scales to 21 series with variety, and delivers the nobility and trad feel without needing 21 landscapes.
3. **Restraint on cuteness, strictness on scale.** The most common failure of generated "adventure" art is a pile of glowing fantasy clichés. Calm space, one subject and real materials give the Ghibli-Zelda feeling of wonder; sparkle and lens flare do not. [H]
4. **System chrome, painted content.** Apple/Google/Samsung's strength is the page around the art; we keep our existing clean tokens, spacing and type, and let only the picture be painterly. That keeps the app usable on a phone.
5. **A small consistent "frame kit"**: corner radius, hairline, scrim and a one-colour strand chip. It does half of the unifying work, so the pictures do not all need to be perfect.
6. **Fewer, better.** Twenty good images beat sixty uneven ones. Start with the slots marked A, judge them in the real Courses view in light and dark, then decide on B and C.

Where I would *not* follow the field-guide brief literally: pieces as characters, and diagrams drawn inside the art (a "valley of squares" is fine as mood; a lesson diagram belongs on the real board).

## 7. Prompt template (words, not names)
Fill the brackets; keep the rest. Generate 4 candidates per slot and choose one.

> A [register] illustration for a chess course about [idea in one plain sentence]. Subject: [one focal subject, scale cue]. Composition: wide, calm, the subject about one third of the frame, generous open space at the bottom for a title. Light: low warm key light from the upper left with a thin cool rim light, soft shadows. Materials: weathered stone, timber, bronze, parchment, moss. Palette: dominant [strand colour name] with an accent of [accent colour], plus warm neutrals; at most three saturated hues. Mood: calm, noble, quietly adventurous, academic. Style: hand-painted, fine warm grain, clean silhouettes, soft atmospheric depth. No text, no letters, no logos, no faces, no real people, no cartoon characters, no glowing particles, no lens flare.

Per-register additions:
- Landscape: "an expansive vista with a tiny cloaked figure or banner for scale".
- Heraldry: "a symmetrical crest on a plain field, stitched or carved, one emblem for [idea], flat even lighting".
- Archive plate: "an ink and wash study plate on aged paper, a table, a window and an instrument, muted sepia with one accent colour".
- Pavilion: "timber and stone architecture beside still water, symmetrical, abundant negative space, seasonal light".

Never include: names of studios, games, artists or living people; "in the style of". Describe qualities instead. [see section 8]

## 8. Rights and process (rule 4 applies to pictures too)
- **Original only.** No image is traced from, reconstructed from, or prompted by reference to chess.com's, Lichess's or anyone's art, and none uses a recognisable character, creature or logo from a game, film or studio. The brief's references are mood, not source.
- **Provenance register.** Every shipped image has a row in `library/art/REGISTRY.md`: file, slot, tool and version, date, who generated it, the prompt, and the tool's terms at the time (screenshot or link) confirming commercial use is allowed and no attribution is required. If the terms are unclear, the image does not ship. Andrew generating elsewhere is welcome; the register records it.
- **No live AI in the learner's loop.** Images are generated once at build time and shipped as static files (our AI policy: free, no accounts, no hardware needs).
- **Safety:** nothing depicting a real person, a child, or a private individual; no political or religious iconography beyond generic heraldry.
- **Lawyer's look:** the image terms join the `LICENSES.md` review already on the roadmap.

## 9. Production spec (a check will enforce it)
- Cards: 960 x 640 WebP, target 30 to 60 KB, hard limit 90 KB. Banners: 1600 x 686, limit 140 KB. Emblems: 512 x 512, limit 40 KB. Also a 24-colour dominant tint stored in the slot data for the loading state.
- `loading="lazy"`, explicit width and height (no layout shift), a flat tinted fallback, and real `alt` text (one sentence describing the scene, not "image of").
- Files live in `app/public/art/<slot-id>.webp`; the service worker caches them after first view; total budget 6 MB for the first 60 images.
- A build check (`tools/check_art.py`, to write) fails on: a missing register row, a file over its limit, an image with no alt text, a missing provenance row, or text in a filename.
- A decorative-only rule: art never carries meaning that is not also in text.

## 10. Order of work
1. Accept or amend this doc. 2. Build the frame kit and the empty-slot fallback in the Courses view first (no images needed), so the app looks right with zero art. 3. Generate the A slots (about 14), judge them in the real view in light and dark and on a phone. 4. Write `check_art.py` and the registry. 5. Then B, then C if it still feels right.
