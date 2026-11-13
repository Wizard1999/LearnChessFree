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
