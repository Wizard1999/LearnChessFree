# Running and deploying

## Run it on your machine

```bash
cd app
npm install          # first time only
npm run dev          # http://localhost:5173
```

The app needs built content. After you change anything in `content/`, rebuild it:

```bash
./tools/.venv/Scripts/python.exe -I tools/validate.py            # check every item's claims (needs Stockfish; a few minutes for many items)
./tools/.venv/Scripts/python.exe -I tools/validate_lessons.py    # check lessons
./tools/.venv/Scripts/python.exe -I tools/check_graph.py         # check the skill graph
./tools/.venv/Scripts/python.exe -I tools/build_content.py       # writes app/public/content/*.json; ships only items whose evidence matches
```

`build_content.py` is strict on purpose. An item whose evidence hash does not match its current content is skipped and listed, not shipped.

## Publish it

The build is a folder of static files with relative paths and hash routing, so any static host works, including a sub-folder of a site (GitHub Pages, Netlify, Cloudflare Pages, an S3 bucket, a school web server).

```bash
cd app
npm run build        # also copies the Stockfish files into public/engine
# upload everything in app/dist/
```

Notes:
- There is no server, no login and no database. Progress lives in the learner's browser (IndexedDB). The Settings page exports and imports it as one JSON file, which is also the backup and the way to move between devices.
- The engine is single-threaded WebAssembly, so the host does not need special cross-origin headers.
- After the first visit the service worker caches the app, so it works offline. The page, the lesson/exercise/skill files and the openings index are fetched network-first, so a new version arrives on the next online visit. Other files (hashed scripts, the engine, openings chunks) are cache-first; if you change one of those without renaming it, bump `CACHE` in `app/public/sw.js`.
- Licence: the app is GPL-3.0-or-later (it uses Chessground, GPL-3.0). If you publish it you must offer the source. Lichess opening names are CC0; puzzle data is CC0; Stockfish is GPL-3.0.

## Recorded read-aloud (audio)

Read aloud plays pre-generated speech when it exists and the browser's own voice otherwise. The recordings (`app/public/audio/<12-hex>.ogg` plus `index.json`, about 70 MB) are made once at build time by an open-source voice (`tools/make_audio.py`, licence in `LICENSES.md`) and shipped as plain static files, so the learner's device only plays files: no account, no service, nothing sent anywhere. The app hashes each spoken chunk (SHA-1, first 12 hex, same as `tools/export_speech.mjs`) and plays the file if it is listed; if any chunk of a text is missing it speaks the whole text with the browser voice, never a mix. The service worker never precaches audio: each file is cached on first play (at most 400 kept) and `audio/index.json` is network-first. Host the folder with the rest of `dist/`; `tools/check_audio.py` checks that the folder and index agree. Set `VITE_BASE` as for the rest of the site.

## The Maia opponent (optional)

The Play page can use Maia, a free network trained on human games, as an opponent. It runs on the CPU in the browser (onnxruntime-web, WebAssembly, one thread, so no special server headers are needed) and works on any static host. The five model files (`app/public/maia/maia<rating>.onnx`, 3.5 MB each) are committed; the runtime's wasm file (about 15 MB, about 4 MB compressed) and its loader are copied from `node_modules` into `app/public/maia/ort/` by `npm run prepare-engine` (run automatically by `dev` and `build`), so `ort/` can be left out of git like `public/engine/`. Nothing downloads until a learner picks Maia, and then only the one strength they chose plus the runtime, once: the service worker caches them (at most three models are kept). Your host should serve `.wasm` as `application/wasm` (most do). If Maia cannot load, the game falls back to Stockfish. Licences: `LICENSES.md`. Measured here: about 13 ms per move after loading.

## What is not decided

Hosting target, site name and content licence are open questions in `QUESTIONS-AND-GATES.md` (Q3, Q4, Q5). Nothing is published until you decide.
