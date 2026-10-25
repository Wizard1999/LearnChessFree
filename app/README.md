# Chess School: the app

A local-first, offline-capable web app: lessons, unlabelled practice, a placement check, a contrast lab, game review, an openings explorer and a play-the-engine page. There is no backend. Progress lives in the browser (IndexedDB) and can be exported from Settings.

Licence: GPL-3.0-or-later (Chessground is GPL-3.0). Stack: Vite, React, TypeScript (strict), Dexie, Chessground, chess.js, Stockfish (WASM, single thread, in a worker).

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # unit tests (mastery maths, scheduling-adjacent logic, opportunity tags)
npm run build      # type-check, copy the engine into public/engine, bundle to dist/
```

Content is not edited here. It is authored in `../content/`, checked by the Python tools in `../tools/`, and built into `public/content/*.json` by `../tools/build_content.py`. See `../docs/running-and-deploying.md` and `../CLAUDE.md`.

## Where things are

| Path | What |
|---|---|
| `src/lib/mastery.ts` | Evidence-weighted mastery (Beta posterior, cue weights, first attempts only). Tests beside it. |
| `src/lib/daily.ts` | Builds the Today plan: due reviews, next lesson, interleaved unlabelled practice, nudges toward student-led work. Every block carries its reason. |
| `src/lib/select.ts`, `schedule.ts`, `progress.ts` | Fresh-item selection by family, concept-level spacing, progress hooks and the independence ledger. |
| `src/lib/verify.ts` | Browser-side material check used by the contrast lab. |
| `src/lib/opportunities.ts` | Names the tactical pattern in a move using `src/chess/detectors` (position facts, not explanations). |
| `src/chess/` | Structural concept detectors (forks, pins, skewers, hanging pieces, ...). Pure functions over a FEN. |
| `src/components/ChessBoard.tsx` | Chessground wrapper with edit mode, arrows, typed-move support. |
| `src/components/ItemPlayer.tsx` | Every exercise type, hints, confidence, first-attempt recording. |
| `src/components/OpeningTree.tsx` | The layered opening tree with transposition markers. |
| `src/pages/` | One file per route. |
| `public/sw.js` | Offline cache. Content and page are network-first; everything else cache-first. |

## Rules that are easy to break

- Learner-facing chess claims must come from content that passed `tools/validate.py`. Do not hand-write positions into components.
- Mastery counts first attempts only. If you add a new way to answer, record it with `source` and `firstAttempt` correctly or the independence ledger lies.
- The openings data is statistics from a sample of online games, labelled as such. Do not label the top band as "masters".
