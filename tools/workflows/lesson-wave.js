// Shared workflow template for lesson waves (author, review, fix), written 7 Nov 2026 to save tokens WITHOUT lowering quality.
// Run with the Workflow tool: Workflow({scriptPath: 'O:/_Chessteaching/tools/workflows/lesson-wave.js', args: {kind, jobs, audit?}}).
//   args.kind:  'beginner' | 'core' | 'opening' | 'culture' | 'game'  (chooses the rules text and batch sizes)
//   args.jobs:  [{id, title, outline?}]  one per lesson (outline: sections, boards, tests from a planner; optional for rewrites)
//   args.skipAuthor: true to review and fix lessons that already exist (jobs need only ids)
//   args.audit: [lesson ids] that also get a second, stronger-model chess-accuracy audit (use for the Foundation and every exemplar)
// What it does differently from the older one-off scripts, and why quality is kept:
//   1. Authors take a small BATCH of related lessons (beginner 5, core 3, opening 2, culture 3, game 1) so the standards are read once per batch, not once per lesson. A batch is small enough that each lesson still gets full attention.
//   2. Reviewers take at most 3 lessons and MUST return a separate verdict for every lesson, listing what they re-verified; a lesson without its own verdict is reviewed again (coverage guard), so EVERY lesson is reviewed.
//   3. Models and effort are set per agent: authors and fixers Sonnet at medium effort, reviewers Sonnet at medium effort, the optional audit a stronger model; mechanical work belongs in tools/ scripts or a Haiku agent (see docs/workflow-guide.md).
//   4. Briefs are short: they point at docs/lesson-depth-standard.md and docs/authoring-guide.md instead of pasting them (every agent already has CLAUDE.md), and keep the hard format rules inline so nothing essential is skipped.
//   5. Agents validate only their own files; the coordinator runs the full tools/check.py once at the end.
export const meta = {
  name: 'lesson-wave',
  description: 'Author, review (every lesson), and fix a wave of lessons with batched agents and explicit models',
  phases: [{ title: 'Author' }, { title: 'Review' }, { title: 'Fix' }, { title: 'Audit' }],
}
const KIND = args && args.kind ? args.kind : 'core'
const JOBS = (args && args.jobs) || []
const AUDIT = new Set((args && args.audit) || [])
const BATCH = { beginner: 5, core: 3, opening: 2, culture: 3, game: 1 }[KIND] || 3
const REVIEW_BATCH = 3
const AUTHOR_MODEL = { model: 'sonnet', effort: 'medium' }
const REVIEW_MODEL = { model: 'sonnet', effort: 'medium' }
const AUDIT_MODEL = { model: 'opus', effort: 'high' }

const HARD = `Hard rules (validators enforce them): lesson files are content/lessons/<id>.json; cards at most 90 words (aim 60), plain text with **bold** and *italic*, at most 3 move tokens in a card (show lines on board steps with one sentence per move); a card is followed by a task (item, practice, contrast, reflect, finale, or a board step with claims) within two steps; every board step has a valid FEN and claims that tools/validate_lessons.py checks (never loosen a claim to pass: change the text); positions are never hand-typed without validation (replay real lines with python-chess); new exercises go in content/items/<file>.json with claims passed by tools/validate.py, three escalating hints and an explanation that says which pieces, why and what happens next BEFORE any engine fact; never ask about a position that has not been shown (show the original, name the one change, then ask; offer an 'I need an example first' route before a prediction); give 3 to 6 chapters by putting "chapter" on the first step of each; at most one concrete reflect step; keep ids, skill, depth and outcomes of existing lessons; no same position in two lessons (tools/check_overlap.py; lessons of one "series" may share); evidence labels [V][S][R][I][H]; original wording; quotations only if verbatim from a source you read, under 15 words, attributed.`
const READ = `Read first (once): docs/lesson-depth-standard.md, docs/authoring-guide.md, docs/content-schema.md, and ONE exemplar lesson for this kind (content/lessons/L-TAC-FORK-1.json for core, L-OD-DRAGON-1.json for openings). Depth means explanation (mechanism, conditions, near-miss, unfamiliar use), not step count: every step must let the learner do something they could not do before. Python: ./tools/.venv/Scripts/python.exe -I from O:\\_Chessteaching. Do not run git, tools/build_content.py, or tools/validate_lessons.py with no arguments. Validate only your own files: tools/validate.py <your item file>, tools/validate_lessons.py <your lesson files>, tools/check_text_notation.py. The coordinator runs the full checks.`
const KIND_RULES = {
  beginner: 'Beginner building blocks (class A): the lesson opens with a board the learner can act on inside the first minute, short explanation next to the board, worked example before any prediction, a "Say it back" model answer; use only vocabulary taught earlier in content/path.json order or defined in half a sentence.',
  core: 'Core skill lessons (class B): how to see it (2 or 3 boards from easy to hard), what makes it work and when it fails, how to set it up or prevent it, a near-miss contrast original-first, a mixed unlabelled test including positions where the idea does not apply, a short real example, a say-it-back card. Keep the lesson short enough to finish in one sitting: split into chapters rather than adding steps.',
  opening: 'Opening series lessons (class C): reasons, plans for both sides, structures, typical mistakes and tactics, model games with verified scores, our own statistics with sample sizes; every statement is a move order, an engine claim at a stated depth, one of our statistics, or a labelled [H]/[I].',
  culture: 'Culture course lessons (class D): boards for every position, sourced facts separated from interpretation, conjecture labelled, views of players and coaches paraphrased with the source named (docs/citable-views.md), no fabricated quotation.',
  game: 'Famous game lessons (class E): the game score verified from two sources and replayed legally, engine checks at stated depth, decision points as items, what the game teaches.',
}[KIND] || ''

const REPORT = { type: 'object', properties: { done: { type: 'array', items: { type: 'string' } }, notDone: { type: 'array', items: { type: 'string' } }, files: { type: 'array', items: { type: 'string' } } }, required: ['done', 'notDone'] }
const REVIEW_SCHEMA = { type: 'object', properties: { results: { type: 'array', items: { type: 'object', properties: {
  lesson: { type: 'string' }, verdict: { type: 'string', enum: ['pass', 'fix', 'rewrite'] }, reverified: { type: 'array', items: { type: 'string' } },
  findings: { type: 'array', items: { type: 'object', properties: { step: { type: 'integer' }, lens: { type: 'string' }, severity: { type: 'string' }, problem: { type: 'string' }, replacement: { type: 'string' } }, required: ['step', 'lens', 'severity', 'problem', 'replacement'] } } },
  required: ['lesson', 'verdict', 'reverified', 'findings'] } } }, required: ['results'] }

const chunk = (a, n) => { const o = []; for (let i = 0; i < a.length; i += n) o.push(a.slice(i, i + n)); return o }
const authorPrompt = (jobs) => `${READ}\n\nTask AUTHOR: write or rebuild these lessons one after another (${KIND}): ${JSON.stringify(jobs)}. ${KIND_RULES}\n${HARD}\nReturn {done, notDone, files}.`
const reviewPrompt = (ids) => `You are an adversarial reviewer. Review EACH of these lessons fully and separately (content/lessons/<id>.json and its item files): ${ids.join(', ')}. For every lesson, give its own verdict (pass, fix or rewrite), list what you re-verified (for chess claims: replay with python-chess, recheck engine claims with tools/engine.py or scratch scripts in the scratchpad), and report findings. Lenses: (1) chess accuracy, including whether general statements are true and whether a correct example hides a false generalisation; (2) teachability: could a learner explain the topic afterwards, is the explanation a real reason, is anything essential missing, no card with more than 3 moves, original position shown before any question; (3) honesty and rights (verbatim quotes under 15 words, nothing about the app that does not exist); (4) pedagogy: cards over 90 words, cue-3 items naming the theme, contrast halves differing by more than one feature, jumps in difficulty, reflect steps that ask nothing concrete. Do NOT edit files. Return one result per lesson; a missing lesson will be reviewed again.`
const fixPrompt = (results) => `${READ}\n\nTask FIX: apply the reviewers' findings. For each finding, reproduce it (run a check for chess claims), apply the exact edit if confirmed, reject with a reason if not. Findings: ${JSON.stringify(results.filter(r => r.verdict !== 'pass'))}. Keep cards at most 90 words, JSON valid, ids unchanged; re-run tools/validate.py on any item file you change and tools/validate_lessons.py on your lesson files. Return {done, notDone, files}.`

phase('Author')
const authored = args && args.skipAuthor ? [] : await parallel(chunk(JOBS, BATCH).map((b, i) => () => agent(authorPrompt(b), { label: `author ${i + 1} (${b.length})`, phase: 'Author', schema: REPORT, ...AUTHOR_MODEL })))
const ids = JOBS.map(j => j.id)

phase('Review')
const verdicts = new Map()
for (let round = 0; round < 3; round++) {
  const todo = ids.filter(id => !verdicts.has(id))
  if (!todo.length) break
  log(`review round ${round + 1}: ${todo.length} lessons without a verdict`)
  const res = await parallel(chunk(todo, REVIEW_BATCH).map((b, i) => () => agent(reviewPrompt(b), { label: `review r${round + 1}.${i + 1}`, phase: 'Review', schema: REVIEW_SCHEMA, ...REVIEW_MODEL })))
  for (const r of res.filter(Boolean)) for (const x of r.results || []) if (ids.includes(x.lesson) && x.reverified && x.reverified.length) verdicts.set(x.lesson, x)
}
const unreviewed = ids.filter(id => !verdicts.has(id))
if (unreviewed.length) log(`WARNING: lessons still without a review verdict: ${unreviewed.join(', ')}`)

phase('Fix')
const toFix = chunk([...verdicts.values()].filter(v => v.verdict !== 'pass'), REVIEW_BATCH)
const fixed = await parallel(toFix.map((b, i) => () => agent(fixPrompt(b), { label: `fix ${i + 1}`, phase: 'Fix', schema: REPORT, ...AUTHOR_MODEL })))

phase('Audit')
const auditIds = ids.filter(id => AUDIT.has(id))
const audits = auditIds.length ? await parallel(chunk(auditIds, 3).map((b, i) => () => agent(`${reviewPrompt(b)} This is the second, independent audit by a stronger reviewer of lessons that every learner will pass through: be especially strict about generalisations, near-misses and anything a strong player would object to.`, { label: `audit ${i + 1}`, phase: 'Audit', schema: REVIEW_SCHEMA, ...AUDIT_MODEL }))) : []
return {
  kind: KIND, lessons: ids.length, reviewed: verdicts.size, unreviewed,
  verdicts: [...verdicts.values()].map(v => ({ lesson: v.lesson, verdict: v.verdict, findings: v.findings.length })),
  audit: audits.filter(Boolean).flatMap(a => (a.results || []).map(x => ({ lesson: x.lesson, verdict: x.verdict, findings: x.findings.length }))),
  authored: authored.filter(Boolean).length, fixed: fixed.filter(Boolean).length,
}
