# Performance: what the app downloads, and when

Written for roadmap phase 2h (first-visit speed). Evidence labels: [V] measured here, [I] inference, [H] hypothesis.

## What loads when

| Step | File(s) | Raw | Gzip [V] | Blocks the first lesson? |
|---|---|---|---|---|
| 1. Shell | `index.html`, hashed JS and CSS in `assets/` (all chunks together are 951 KB raw, 293 KB gzip; not all are needed on first paint) | | | yes |
| 2. Manifest | `content/manifest.json` (network-first, never cached as a name) | 10.5 KB | 2.5 KB | yes |
| 3. Catalogue set, in parallel | `skills.<hash>.json`, `lessons-catalog.<hash>.json`, `verified.<hash>.json`, `courses.<hash>.json` | 1.65 MB | 234 KB | yes (courses may fail; see below) |
| 4. First exercises | `items-first.<hash>.json` (what the first 12 lessons need) | 648 KB | 73 KB | yes; the app shows after this |
| 5. A lesson | `lessons/<id>.<revision>.json`, when a lesson is opened | 2 to 53 KB (first lesson 9.5 KB) | 3.4 KB for the first lesson | only that lesson |
| 6. Whole exercise bank | `items.<hash>.json`, right after step 4 | 15.4 MB | 1.58 MB | no (practice pages wait for it) |
| 7. All lesson bodies, quietly | 456 files, started 3 seconds after step 6, 3 at a time, skipped when the browser asks to save data | 2.8 MB | about 1.0 MB | no; makes every lesson work offline |

The old order loaded `lessons.json` (all 456 lessons with every step) in step 3.

## Before and after (the same content build, 7 Nov 2026)

Bytes to reach a usable first lesson (manifest, skills, lessons, verified, courses, first exercises), measured on the built files, gzip level 6 as a stand-in for what a host sends:

| | Raw | Gzip [V] | At 10 Mbit/s [I] | At 2 Mbit/s [I] |
|---|---|---|---|---|
| Before (`lessons.json`) | 4.96 MB | 979 KB | 0.78 s | 3.9 s |
| After (catalogue) | 2.31 MB | 310 KB | 0.25 s | 1.2 s |

That is 68 percent fewer bytes before the first lesson, and 3.4 KB more when the lesson itself opens. The transfer times are arithmetic on the gzip sizes, not a measurement of a real network (this machine serves from loopback, where the whole first visit took about 170 ms in the built app with the browser's resource timings, so it says nothing about a phone). Parsing the lesson data: 10.9 ms for `lessons.json` against 1.9 ms for the catalogue (node, best of 7, one machine). The three roundtrips before the app shows (manifest, the four files in parallel, the first exercises) are unchanged; reducing them further would mean putting the manifest into the HTML, which was not done.

Still large and not changed: `verified.<hash>.json` is 950 KB raw (64 KB gzip) and `skills` is 404 KB raw; both are needed for screens beyond the first lesson, so they stay in step 3. Loading `verified` after the first paint would save about 64 KB gzip and is the next candidate if the budget below is exceeded.

## Budgets

These are limits to keep, checked by hand when content grows (and by `src/lib/contentFiles.test.ts` for the catalogue):

| Budget | Limit | Now |
|---|---|---|
| Shell plus the files before the first lesson (gzip) | 500 KB content, 300 KB scripts and styles | 310 KB content, 293 KB for all chunks |
| First lesson body | 20 KB gzip | 3.4 KB |
| Whole exercise bank | 2 MB gzip, loaded in the background | 1.58 MB |
| Optional opponent (Maia nets and runtime), only when a game is started | 25 MB, once | 17 MB of nets plus the wasm runtime |
| Full offline copy | everything above plus the engine and lessons, audio not included | about 200 MB built site, of which 70 MB is audio fetched one file at a time, never precached |

The catalogue is kept to a fifth of the size of the whole-lesson file by a test; if it grows past that, move fields into the body files (`CATALOG_KEYS` in `tools/build_content.py`).

## How the files are named

`tools/build_content.py` writes each big file twice: `items.json` and friends for the tools and tests (they read these), and `items.<12 hex of the bytes>.json` for the app. `manifest.json` has a `files` map naming the app's copies, and it is the only content file fetched by a fixed name. An old manifest therefore cannot pair with new files: it names old files, and an old file at its own name is still the old content. The previous `?v=<hash>` scheme relied on the query string and on every request agreeing about the hash; names carry it now.

- Lesson bodies are `lessons/<id>.<revision>.json`; the revision is the hash of the steps, so a changed lesson is a new file. The catalogue entry names its body (`file`), and the app refuses a body whose id or step count does not match the entry (`mergeLesson`), then offers a retry.
- Each build removes the earlier hashed files and bodies, so the folder holds exactly one build; `contentFiles.test.ts` fails if a stray one is left.
- `vite.config.ts` leaves the unhashed copies out of `dist` (about 18 MB), since only the tools read them.
- The catalogue's `minutes` is computed in Python with the formula of `lessonMinutes`; the same test compares the two for all 456 lessons.

## Service worker (`public/sw.js`, cache `chess-school-v6`)

- Network-first: the page, `content/manifest.json`, the openings index. The app asks for the manifest with `cache: 'no-cache'`.
- Cache-first, for ever: any `content/**/*.<hash>.json`. When a new file of the same stem arrives (`items.<new>.json`), the older one is deleted from the cache.
- Offline after one visit: shell, manifest, catalogue, first exercises, the bank, and (after step 7 finishes) all lessons. A lesson whose body has not been fetched yet and is opened offline shows "could not be downloaded" with a retry.

## What fails, and what the learner sees

- Manifest, skills, catalogue, verified, or the first exercises fail: "Content not available" with a Try again button. While loading, the page names the step ("Loading the skills and the lesson catalogue…").
- The course list fails: the app works; the Courses page says the list could not be downloaded and offers a retry (it never shows an empty list or the "planned" list in its place).
- A lesson body fails: the lesson page says so, with a retry. Everything else keeps working.
- The whole bank fails after three tries: practice pages say so; the first lessons still work.

## How to measure

1. `cd app; MSYS_NO_PATHCONV=1 VITE_BASE=/Scholarmate/ npm run build`, then serve it under its base: `VITE_BASE=/Scholarmate/ npx vite preview --port 4174`.
2. Open `http://localhost:4174/Scholarmate/` in a fresh profile (or with site data cleared) and run in the console:
   `performance.getEntriesByType('resource').filter(r => r.name.includes('/content/')).map(r => [r.name.split('/content/')[1], r.transferSize, Math.round(r.responseEnd)])`
3. The rows before `items.<hash>.json` are the first-visit cost; `transferSize` is compressed bytes. For a real network, use the browser's network throttling (Slow 4G) and read the time until the lesson page text appears.
4. Sizes without a browser: gzip each file named by `manifest.json` (`python -c "import gzip,sys;print(len(gzip.compress(open(sys.argv[1],'rb').read(),6)))" <file>`).
5. After a content change: `tools/build_content.py`, `npm test` (catalogue and bodies agree), then repeat step 2 and update the table above.

## What was not done

- The manifest is still a separate request before the other files (one extra round trip); inlining it in `index.html` at build time would remove it.
- `verified` is loaded before the first lesson although only exercise reveals need it.
- The failure screens were checked by reading the code and by unit tests of the loader (`lessonBodies.test.ts`); they were not provoked in a browser.
- No measurement on a real phone or throttled network was made.
