# Workflow guide: running agent waves without wasting tokens or quality

Written 7 Nov 2026. Most token use comes from agent fleets, not from the main session. These rules cut waste and keep quality; where a saving would lower quality, we do not take it.

## The template
`tools/workflows/lesson-wave.js` is the one shared template for lesson waves. Run it with the Workflow tool and `args`: `{kind: 'beginner'|'core'|'opening'|'culture'|'game', jobs: [{id, title, outline?}], audit?: [ids]}`. It replaces the older one-off scripts in `tools/workflows-*.js` (keep those only as history).

## What it does and why it is safe for quality
| Saving | How it is kept safe |
|---|---|
| Authors take a small batch of related lessons (beginner 5, core 3, opening 2, culture 3, game 1) | The standards are read once per batch. The batch is small enough that each lesson is still written and checked on its own |
| Reviewers take at most 3 lessons | Each reviewer must give a separate verdict per lesson, list what it re-verified, and replay chess claims. A lesson without its own verdict is reviewed again (up to three rounds), so every lesson is reviewed. The final report lists any lesson still unreviewed |
| Explicit models and effort per agent | Authors, fixers and reviewers run Sonnet at medium effort. The optional audit (`args.audit`) uses a stronger model on the lessons every learner passes through (the Foundation and every exemplar). Raise the effort for a task only when it is genuinely hard |
| Short briefs | The standard and authoring guide are linked, not pasted. The hard format rules stay inline so nothing essential is skipped |
| No repeated full checks | Agents validate only their own files. The coordinator runs `tools/check.py` once at the end |
| Resume, never restart | Use `resumeFromRunId` after an interruption: finished agents replay from cache |

## Other habits that save tokens (no quality cost)
- Mechanical work (renaming, ticking the roadmap, card-length trims, link sweeps) belongs in a `tools/` script, or in a Haiku agent at low effort, never in an authoring agent.
- App agents use page text, DOM measurements and tests first, and take screenshots only to judge how something looks.
- Keep each agent's job to one clear deliverable with the files it may touch, so it does not wander.
- Put shared context in `docs/` once (for example `docs/lesson-depth-standard.md`) and link it.

## What we never economise on
- Every lesson gets a full review by a person-like adversarial reader and the engine-backed checks, and the Foundation and exemplars also get the stronger-model audit.
- Human review (a strong player, a teacher) stays the real gate for `human-reviewed` status; no agent marks a lesson reviewed.
- Overlap, graph and path checks run on every wave before anything is committed.
