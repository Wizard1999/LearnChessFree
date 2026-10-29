# Chess learning system — project index

Status (2026-10-24): working app and content pipeline built; autonomous build in progress. Open questions for Andrew: `QUESTIONS-AND-GATES.md`. My own calls: `DECISIONS-LOG.md`.

| File | What it is |
|---|---|
| `03-product-design.md` | **Current design and decisions D1–D13, with reasoning. Start here.** (Project rules for any session: `CLAUDE.md`.) |
| `docs/chesscademy-research.md` | What Chesscademy was (curriculum, mechanics, timeline, what users said, why it matters). |
| `docs/council-synthesis.md` | The simulated deliberation (10 players, 10 coaches, education experts, the Collective), decisions CD-1…CD-16 and where each idea came from. **Simulation, not quotations.** |
| `docs/curriculum-map-v1.md` | The resulting map: 11 strands, node ladders by tier, source-to-node table for the full resource list. |
| `docs/curriculum-map-v1.1.md` | What the five primary-source sheets changed: consolidated ~45 new/changed nodes, cross-source findings, tablebase checks run, rights/edition notes. |
| `sources/sheets/` | Five synthesis sheets (Capablanca, Nimzowitsch, Em. Lasker, Ed. Lasker, Znosko-Borovsky). |
| `docs/inference-01-puzzle-theme-difficulty.md`, `docs/reconciliation-pasted-curriculum.md`, `library/REGISTRY.md` | First data inference; reconciliation with the pasted curriculum; registry of every resource and its rights. |
| `docs/first-hours.md` | Session-by-session walkthrough of the first ~3.5 hours, with verified example positions (`content/items/first-hours.v0.json`). |
| `docs/content-schema.md` | Content schema v0 and why. |
| `app/`, `tools/`, `content/` | The school: Vite+React app (`app/README.md`), Python validators and build (`tools/`), skills/items/lessons (`content/`). GPL-3.0-or-later (`LICENSE`). Git initialised, nothing committed (gate G2). |
| `QUESTIONS-AND-GATES.md`, `DECISIONS-LOG.md` | What I need from Andrew, and the calls I made without asking. |
| `docs/skill-graph.md` | The curriculum as data: nodes, depths, prerequisites, default route. |
| `docs/evaluation-plan.md` | How we will tell whether it works (one learner; pre-registered measures). |
| `docs/running-and-deploying.md` | Run, rebuild content, publish as static files. |
| `spikes/` | Technical feasibility experiments. `contrast_spike.py` = engine-verified minimal-pair counterexamples (works; output included). |
| `review/01-independent-review.md` | Audit of the original ChatGPT-derived plan v0.4 (issues, evidence register). Still valid as a record. |
| `review/02-chess-verification-report.md` | Engine/tablebase check of the handoff's sample positions. Sample lessons are no longer needed. |
| `review/scripts`, `review/evidence` | Reproducible validation scripts and raw outputs. |


## Run it with one click (Windows)
Download `desktop/ChessSchool.exe` and double-click it. Nothing to install. It is portable: the program serves the site from inside itself and keeps your progress in a `ChessSchoolData` folder created next to it. Copy or move the folder anywhere (a USB stick works), and delete everything by putting the folder in the recycle bin. If the folder is read-only, progress is kept in your user profile instead and the tray notice says so. It opens in Microsoft Edge or Google Chrome (one of them must be installed). Right-click the tray icon to quit. Rebuild: `powershell -File desktopuild-exe.ps1`.
