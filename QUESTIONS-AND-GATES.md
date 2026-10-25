# Questions for Andrew and gates only he can open

I keep working without stopping and log here anything I need from you. **Answer any time by editing this file or telling me; I'll read it at the start of each work session.** Nothing here blocks the rest of the work unless marked **BLOCKS**.

Legend: **Q** question · **G** gate (an action or permission only you can give) · status: OPEN / ANSWERED / DONE.

## Open

| ID | Type | What I need | Why | Default I'm using meanwhile | Blocks |
|---|---|---|---|---|---|
| Q1 | Q | Your rough level (Chess.com/Lichess rating or "beats the 1200 bot") | Sets where your placement lands and which middle-tier lessons come first | Assume ~1200–1500 Lichess-scale | no |
| Q2 | Q | Your Lichess and/or Chess.com usernames | To import your real games (public data, no password needed) for baseline, opportunity detection, and opening stats at your level | None: game import is built so you paste a PGN or type a username | no |
| G1 | G | Take the baseline: ≥20 rapid games on Lichess + the mixed placement set I'll generate (route: app → Placement) | A before-measure we cannot recreate later | I build the placement; it stays "unmeasured" until you run it | no |
| G2 | G | ~~Authorize git commits and a remote~~ **ANSWERED (2026-10-25):** you said to use https://github.com/Wizard1999/LearnChessFree and that public is fine. Commits made and pushed | | | done |
| G3 | G | A **strong-player reviewer** (a name, or "I'll do it") for the first ~50 items and the lesson explanations | Engine agreement does not mean a good explanation | Items marked `needs-human` and shown with a "reviewed: no" badge | no (blocks *publishing*) |
| Q3 | Q | Content licence for original lessons: CC BY-SA 4.0 (proposed), or all-rights-reserved | Affects how we credit and whether others may reuse | Unlicensed/"project"; code is GPL-3.0-or-later | no |
| Q4 | Q | **Name.** My recommendation is **Long Diagonal** (fallback: Quiet Move); shortlist, checks and reasons in `docs/name-shortlist.md`. Pick one, or give me another, and I rename the app (one file, `app/src/brand.ts`, plus the page title and manifest) | The doctrine's wordmark and identity study need a name | Working title "Chess School" | no |
| Q5 | Q | Hosting target (GitHub Pages, Netlify, own server) | Affects base path and deploy script | Static build with relative base; no deploy yet | no |
| G4 | G | Lawful copies (or chapter lists) of in-copyright sources for tier 4–5 depth: Silman (both), Kotov, Heisman, Chernev, Stean, Vuković, Spielmann | Needed to move those from [recalled] to [read] | Ideas stay labeled [R] | no |
| Q6 | Q | Do you want **over-the-board master** statistics in the openings tree too? | The tree's top band is "2100+ (online)", not masters. Master data from the Lichess masters explorer needs an API token; other master collections have unclear reuse terms | Not included; the band is labelled "online" so nobody mistakes it for masters | no |
| Q7 | Q | Is it OK that **importing your games** calls the Lichess or Chess.com public API from your browser (only the username is sent, only when you press the button)? | Everything else in the app is offline and local | Yes, button-only, nothing automatic | no |
| G6 | G | Skim-review a sample of generated items: about 20 of the 150 "no tactic" quiet-position items (`content/items/quiet-*.json`) and 20 threat items (`threat-*.json`). Mark any you disagree with | These are machine-checked, not human-checked, and the "nothing is threatened" half is checked by the generator, not the validator | Shown with "Not yet reviewed by a person"; marked `needs-human` | no |
| G7 | G | OK to delete `library/data/openings-work/` (about 15 GB of working data from the openings build)? | Output is already in `app/public/openings/`; keeping it only helps re-running with more games | Left in place (gitignored) | no |
| Q8 | Q | Do you want the strand order of the Course map to follow the default route (a mid-level player tests out of the first 30 nodes) or stay grouped by strand as now? | Both are in the data; the map is grouped by strand with a "recommended next" box | Grouped by strand | no |
| G8 | G | Strong-player review of the **positional** items: the 133 engine-checked quiet-move items (accepted set within 30 cp, rule-of-thumb wording) and the working definitions in `docs/exercises-positional.md` section 5 (outposts, holes, backward pawns, hanging pairs, five named structures) | Chess usage varies; I simplified definitions so every claim is machine-checkable | Items marked `needs-human`; definitions as written | no |
| Q9 | Q | Cue policy for recognition items: keep "cue 3 = nothing in the prompt names the feature" (so recognition items are cue 1-2, and cue 3 is the which-statement-is-true and engine quiet-move items), or make cue 3 the majority? | The authoring guide forbids naming a theme in a cue-3 prompt; the positional bank is 366/167/223 at cue 1/2/3 | Keep the guide's rule | no |
| G9 | G | Skim `tools/validate.py` and `tools/structure.py` changes (new claim types, locked tablebase cache) and the structure-claims section of `docs/content-schema.md` | The validator is the project's safety net and was changed by an agent; it has a self-test (102 good claims accepted, 51 planted defects rejected) | In use | no |
| Q10 | Q | Identity study: after I build the three comparable treatments (warm editorial, darker tournament, restrained club), which do you prefer? Also the product name and wordmark (Q4) | The doctrine asks for a choice between coherent alternatives, and a wordmark needs a name | I proceed with the warm editorial treatment and the working title "Chess School" | no |
| G10 | G | Turn on GitHub Pages for the repository: Settings, Pages, Source = GitHub Actions (the workflow is `.github/workflows/pages.yml`, currently manual-only: after enabling Pages, run it from the Actions tab, or tell me and I will re-enable deploy-on-push) | Publishing the site is your call; the workflow only deploys after you enable it | Not published | no |
| G11 | G | Recruit about 5 people for the first usability round after the identity study (doctrine section 15): a mix of people who have never used a chess site and people who play online, plus one keyboard or screen-reader user | I cannot recruit; automated and expert checks are only substitutes | Heuristic review and automated checks, labelled as such | no |
| G5 | G | Maia-2 model weights licence check (needs a human read of the repository's LICENSE/weights terms) | Humanlike bots and rating-conditioned priors | Not used | no |

| Q11 | Q | Optional sign-in to keep progress across devices: which route? (A) none for now, use the export/import file (built); (B) the learner's own cloud storage (Google Drive / Dropbox / a folder) with their own login; (C) a small hosted backend with email magic-link or passkey sign-in; (D) self-hosted. Any of B-D needs an outside service, so it is your call and your money/privacy decision | The product works with no account (progress saves in the browser on first visit, nothing to set up). Sign-in would only add sync and recovery if the browser data is cleared. C is the simplest for learners; it means running or renting a server and storing their progress | A: nothing hosted. Export/import stays the only way to move progress | no |

## Answered / done
*(none yet)*

## Decisions I made autonomously (so you can veto them)
Logged in `DECISIONS-LOG.md` as I go; veto any by telling me.
