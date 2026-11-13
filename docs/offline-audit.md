# Offline audit (rule 10): every way the app reaches the network

Done 13 Nov 2026 by reading `app/src`, `app/index.html` and `app/public` [V: grep of every `http(s)://` and every `fetch(`]. Not yet done: loading the built app with the network off and walking every route (Phase 2o).

## Needed for the app to work: all local
Content, lessons, items, engine (Stockfish), Maia weights, opening and master data, audio, icons, fonts (`@fontsource-*` packages, bundled), library text and covers, `readiness.json`, `roadmap.json`, `manifest.json`: all fetched from the app's own base URL.
No CDN script or stylesheet, no web-font service, no analytics, no embed. The Internet Archive iframe was removed when the scans became local.

## Optional extras that use the network (each degrades to a local path or a message)
| Where | What | With no connection |
|---|---|---|
| `lib/tablebase.ts` | `tablebase.lichess.ovh` online endgame lookup in Analysis | Off by default; the bundled engine and the lesson's own checked claims still work |
| `lib/pgn.ts` | Import games from lichess.org or api.chess.com by username | Fails with a message; PGN paste and file import still work |
| `lib/feedback.ts` | Posts a review file to `feedback-config.json` endpoint | Endpoint is empty by default; file export is the way |
| Links | chess.com/play/online, lichess.org, AndrewValentine.net, library "Where this came from" | Plain links, never needed |

## Still to prove (Phase 2o)
1. Offline bundle: one folder (or zip) with the built app, engine, content, library text and **scans** (scans are gitignored and shipped only here), served by a tiny local launcher or opened from disk.
2. Test the bundle with the network off, every route and one lesson, one exercise, one engine analysis, one book with scans.
3. A short "start here with no internet" page in the bundle (how to open it, what each folder holds).
4. Service worker (`public/sw.js`): confirm what it caches and that a cold start with no network works.

## Bundle test, 13 Nov 2026 [V]
Built `dist-offline/Scholarmate-offline` (33,577 files, 4.6 GB, page scans for all 101 books) and served it with the bundled `serve.py` logic on localhost.
- 14 routes loaded with content and no error text: Today, Course, Practice, Analysis, Openings, Library, Roadmap, Settings, Play, Lab, Games, Record, Plan, and a lesson.
- Zero requests to any other origin while loading them (`performance` resource entries).
- Stockfish ran in a Web Worker from the bundle: depth 12 on 1.e4 e5 gave 2.Nf3 at +0.28.
- A scanned page (last page of one book) came back as image/webp; the reader showed page 3 of The Art of Chess.
- Not proved: the service worker did not register on this run (no registration found), so a cold start after a restart with no server is not covered; the bundle needs its local server either way. Not tried: a machine with no network at all, a second operating system, a USB stick.


### Bundle rebuild and service worker check, 13 Nov 2026 [V]
Rebuilt with the latest CSS and the svh/phone changes: 33,578 files, 4,632 MB, 101 books with scans, zip 4,388 MB. Served three ways (the bundle's `serve.py`, `python -m http.server`, `vite preview`); the pages load and `sw.js` is fetched with status 200 and the right type from each. In the desktop app's built-in browser pane, registering `sw.js` failed on all three ("unknown error when fetching the script") yet succeeded on the dev server at port 5173 in the same pane, so the failure looks like a restriction of that pane on other ports, not of the bundle. [I] Not proved either way: a real browser (Chrome, Safari, Firefox) must register the worker from the bundle, then be taken offline and reloaded. This stays on Andrew's list (QUESTIONS-AND-GATES.md).
