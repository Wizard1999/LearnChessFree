# Library registry: everything we hold, plan to hold, or deliberately do not hold

2026-10-24. One row per resource: what it is, **rights status and how I know**, where it lives, what we use it for. "Not stored" means we use it only through a service, or not at all. Datasets live in `library/data/` and books in `sources/raw/`; both are **gitignored**. Re-fetch with the URLs below.

Rights labels: **CC0 [V]** verified on the provider's page; **PD-US [V-notice]** public domain in the US by publication date, shown by the scan's own notice and metadata; **borrow-only** lending copies we do not use without the user; **excluded** known or suspected in-copyright copy.

## A. Data

| ID | Resource | Rights | Stored | Size | Use |
|---|---|---|---|---|---|
| D1 | Lichess puzzle database (6,157,341 puzzles; Glicko ratings, themes) | CC0 [V] | `library/data/lichess_db_puzzle.csv.zst` | 307 MB | Item-difficulty priors (Inference 01); a lawful tactics corpus after engine re-check |
| D2 | Lichess rated games, 2013-01 sample | CC0 [V] | `library/data/lichess_db_standard_rated_2013-01.pgn.zst` | 17.8 MB | Pipeline development; skill-vs-rating curves (later: larger months, bounded) |
| D3 | Lichess evaluations (416 M positions) | CC0 [V] | Not stored | 22.4 GB | Possible later subset; too large now |
| D4 | `lichess-org/chess-openings` (ECO names, PGN/UCI/EPD) | CC0 [V] | `library/data/chess-openings/` | small | Opening-name tagging; opening ladder |
| D5 | Lichess tablebase API (≤ 7 pieces) | Service; server code AGPL-3.0 [V] | Not stored | n/a | Endgame verification; local Syzygy later if needed (large) |
| D6 | Maia / Maia-2 (human-like move models) | Maia-2 code MIT [V]; weights licence unverified | Not stored | n/a | Possible rating-conditioned priors; verify weights licence first |

## B. Public-domain books (all five read in full by reading agents; synthesis sheets complete in `sources/sheets/`; consolidated in `docs/curriculum-map-v1.1.md`)

| ID | Book | Rights basis | Stored |
|---|---|---|---|
| B1 | Capablanca, *Chess Fundamentals* (1921) | Gutenberg #33870 [V]; PD-US for the 1921 body; the file is a 17th printing with a 1934 preface and 1949 notice, so paraphrase the preface only | `sources/raw/capablanca_chess-fundamentals_gutenberg33870.txt` |
| B2 | Edward Lasker, *Chess Strategy* (1915/1921) | Gutenberg #5614 [V]; PD-US | `sources/raw/edlasker_chess-strategy_gutenberg5614.txt` |
| B3 | Nimzowitsch, *My System* (Hereford transl., Harcourt Brace, **1930**) | Notice "Copyright 1930" on scan [V-notice]; 1930 publications entered the US public domain on 2026-01-01 (my application of the 95-year rule) | `sources/raw/nimzowitsch_my-system_1930-harcourt_archive.txt` |
| B4 | Emanuel Lasker, *Common Sense in Chess* ([1910]) | Archive metadata NOT_IN_COPYRIGHT (US) [V] | `sources/raw/emlasker_common-sense_archive.txt` |
| B5 | Znosko-Borovsky, *The Middle Game in Chess* (1922) | Archive metadata NOT_IN_COPYRIGHT (US) [V] | `sources/raw/znosko-borovsky_middle-game_archive.txt` |
| B6 | Franklin K. Young, *Chess Generalship, Vol. I: Grand Reconnaissance* | Gutenberg #55278 [V]; notice "Copyright, 1910" in the text, so PD-US by date | `sources/raw/pg55278.txt` (downloaded 28 Oct 2026; not yet read) |
| B7 | H. E. Bird, *Chess History and Reminiscences* | Gutenberg #4902 [V]; nineteenth-century text (references to games of the 1840s onward), PD-US | `sources/raw/pg4902.txt` (not yet read; for the history course) |
| B8 | F. M. Edge, *The Exploits and Triumphs, in Europe, of Paul Morphy* | Gutenberg #34180 [V]; 1859 original, PD-US | `sources/raw/pg34180.txt` (not yet read; Morphy games, history course) |
| B9 | Edward Lasker, *Chess and Checkers: The Way to Mastership* | Gutenberg #4913 [V]; text states "copyright 1918", PD-US by date | `sources/raw/pg4913.txt` (not yet read) |
| B10 | Howard Staunton, *The Blue Book of Chess* | Gutenberg #16377 [V]; Staunton 1840s-50s with a 1910 edition notice, PD-US | `sources/raw/pg16377.txt` (not yet read; openings of the period, for the history course) |

**Excluded and deleted unread:** an archive upload tagged "Public Domain Mark" of *Lasker's Manual* that is the **1947 McKay edition** ("Copyright © 1947 … all rights reserved"), and an upload of *My System* that is the **21st Century Edition** (modern intro and edit). Tagging by an uploader is not evidence of public domain.

## C. In-copyright Tier 2–3 sources (not stored)

| Source | What exists on the Internet Archive | Our status |
|---|---|---|
| Silman: *How to Reassess Your Chess*, *The Amateur's Mind* | Borrow-only scans exist; **unrestricted uploads also exist and look unauthorized** | Not used; ideas marked [R] |
| Stean, *Simple Chess* | Not found in the search | [R] |
| Kotov, *Think Like a Grandmaster* | Borrow-only scans; an unrestricted upload exists (looks unauthorized) | Not used; [R] |
| Chernev, *Logical Chess*, *Most Instructive Games* | Borrow-only; unrestricted uploads of *Logical Chess* exist (look unauthorized) | Not used; [R] |
| Heisman | Not found | [R] |
| Seirawan, *Winning Chess* series | Borrow-only scans | [R] |
| Vuković, *Art of Attack*; Spielmann, *Art of Sacrifice* | Borrow-only scans | [R] |
| Polgár, Dvoretsky, Aagaard, Yusupov, Flores Rios, Watson, Müller, de la Villa, Rowson, Smith | Not searched | [R] / publisher samples where available |

**Lawful routes for these** (the user's choice): borrow through the user's own Open Library account and name chapters for me to read; supply purchased ebooks; use publisher sample chapters; or keep as recalled-only until a copy is available.

## D. Reference material we keep as notes, not as text

| ID | Resource | Where |
|---|---|---|
| R1 | Chesscademy (Wayback, HN, MetaFilter, press) | `docs/chesscademy-research.md` |
| R2 | Lichess Learn and Practice structure | `docs/first-hours.md`, `docs/curriculum-map-v1.md` |
| R3 | The Guardian study (user's document) | cited in `docs/council-synthesis.md` |
| R4 | The original ChatGPT handoff plan v0.4 and its review | `review/` |
| R5 | The pasted 14-stage "unified curriculum" | `docs/reconciliation-pasted-curriculum.md` |

## E. Tools

| Tool | Licence | Use |
|---|---|---|
| python-chess 1.11.2 | GPL-3.0 (my recollection, [U]; consistent with our GPL project) | Validation, analysis |
| Stockfish 19 Lite WASM (npm 19.0.1) | GPL-3.0 [V: registry] | Verification, in-app engine |
| zstandard (Python) | BSD (recollection, [U]) | Reading `.zst` datasets |

## F. Inferences produced so far

| ID | File | What |
|---|---|---|
| I01 | `docs/inference-01-puzzle-theme-difficulty.md` | Empirical difficulty of tactical themes on Lichess's puzzle scale |

## G. Sheets and backlog
- Synthesis sheets (5, ~57,000 words): `sources/sheets/*.md`.
- Tablebase checks closed so far, and the open backlog: `docs/curriculum-map-v1.1.md` §4.
