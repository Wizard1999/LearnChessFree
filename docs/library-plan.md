# Sources library: acquire in an order, read in an order, show it all in the app

Written 29 October 2026 from Andrew's request: acquire the best resources in an organised order, download everything that can be downloaded at once, and make all of it viewable and downloadable inside the app, sortable by alphabet, subject and learning level. Status: plan. Rights rules: `CLAUDE.md` rule 4 and `library/REGISTRY.md`.

## The idea in one paragraph
A **Library** with three shelves. (1) **Books and texts we may redistribute** (public domain or openly licensed): shown and downloadable in the app, in the exe and on the web. (2) **Open data** (Lichess games and puzzles, opening names, tablebases): linked, with what we use them for, because they are too large to ship. (3) **Sources we use only as ideas**: in-copyright books and courses, listed by title with a link to where to get them lawfully, never stored or shown. Every entry says what rights it has and how we know, which lessons use it, and whether we have read it. The shelf is also the evidence trail for the lessons ("this lesson rests on these sources").

## Rule that decides what can be "downloaded all at once"
Only items whose rights are clear. The fetch script (below) downloads a book only if its notice or metadata shows public domain or an open licence, records the evidence, and refuses and logs the rest. "Public domain" tags on uploads are not evidence (CLAUDE.md rule 4). So: yes, all the clear ones at once; no, never an unclear one.

## Acquisition order (what we fetch and read first)
Priority = rights certainty, then curriculum gaps (`tools/coverage_audit.py`), then learner level.
1. **Tier 1, now (rights verified from Project Gutenberg, plus open texts):** the ten books already registered (B1 to B10), plus Wikibooks' "Chess" textbook (CC BY-SA, attribution and share-alike apply; compatible with a GPL project if we credit it) as the beginner text, plus the Lichess open data already held.
2. **Tier 2, candidates to verify one by one [R: from memory, not verified; each needs a copyright-notice check]:** Réti, *Modern Ideas in Chess* (1923); Marshall, *Chess Masterpieces* (1928); Steinitz, *The Modern Chess Instructor* (1889); Staunton, *Chess-Player's Handbook* (1847); Lowenthal, *Morphy's Games of Chess* (1860); Mason, *The Art of Chess* (1895); Freeborough, *Chess Openings Ancient and Modern* (1889); the first edition of Griffith and White, *Modern Chess Openings* (1911); Philidor's *Analysis of the Game of Chess* (1749, English editions); Emanuel Lasker's *Manual* only in an edition whose notice proves it is the early one (an uploader's "public domain" 1947 edition was already found to be in copyright and deleted). Sources: Project Gutenberg, Internet Archive, HathiTrust, and only where the scan's own notice and metadata agree.
3. **Tier 3, ideas only, listed not stored:** modern in-copyright books and courses (the "lawful routes" in the registry).

Reading order follows the curriculum, not the catalogue: first the books that fill the **gaps the coverage audit found** (famous games and history: Edge on Morphy, Bird, Lowenthal, Marshall; study methods; the middlegame planning gap: Young, Znosko-Borovsky again), then beginner and club technique (Lasker, Staunton), then the rest. One reading agent per book produces an original-wording synthesis sheet and a coverage check against the skill graph; sheets go in `sources/sheets/`.

## Data model
`library/catalog.json`, built by `tools/build_library.py` from `library/REGISTRY.md`-style rows plus a small file per entry. Each entry:
`id, title, author, year, language, kind (book | data | tool | course), rights {label, basis, notice_quote}, source_url, file (if stored), size, subjects[], level, era, status (unread | read | synthesised), used_in (lesson ids, from each lesson's `sources`), our_notes (link to the synthesis sheet)`.
The catalog ships to the app as `library.json`; the stored texts ship as plain text (and EPUB where the source has it) under `library/files/`, about 0.3 to 0.7 MB each, so ten books are about 5 MB. Large datasets are links.

## In the app (the Library page, extended)
- Three shelves as above, each entry a card: title, author, year, one line on what it is, rights badge, **Read** (in-app reader with chapter list and search for stored texts), **Download**, **Original source**, "Used in these lessons" (links to the lessons), "Our summary".
- **Sort by:** title A to Z, author, year, size, status. **Filter by subject:** rules and basics, tactics, strategy, endgames, openings, game collections, history, study methods, composition and problems. **Filter by level:** the chess equivalent of beginner through advanced: *Beginner* (new to the rules, up to about 800), *Improver* (800 to 1400), *Club* (1400 to 1900), *Advanced* (1900 and up), *Reference* (history, collections, anything not level-bound). Each book is tagged by us on how it reads, not on a claim about the author.
- Search across titles, authors and subjects; a "start here" strip for the first three books per level.
- The Library page works offline in the exe (stored texts ship inside it) and on the web (loaded on demand).
- Rights display is part of the card, so users see exactly why a text can be shared.

## Tools to build
- `tools/fetch_sources.py`: for each candidate (an id and a Gutenberg or Archive URL) download, read the header and notices, decide PD or open licence, write the evidence into the catalog, store the file or refuse and log. Idempotent; never overwrites.
- `tools/build_library.py`: catalog and `used_in` links to `app/public/library.json`; copies stored texts to the app's public folder.
- A check in `tools/check_all.py`: every lesson `sources` entry resolves to a catalog entry or a URL; every stored file has a rights record.

## Decisions and questions (logged)
- Ship full texts inside the app or link out? Default: ship texts that are public domain or openly licensed (small, offline, the stated goal); link datasets. Question Q15.
- Who tags subject and level? Default: me, labelled [I]; Andrew can override.
- Wikibooks text is CC BY-SA: attribution and share-alike apply to that text only; the lesson wording stays original.
- Nothing in copyright is ever stored or shown, however available it is online.
