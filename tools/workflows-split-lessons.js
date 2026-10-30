export const meta = {
  name: 'split-lessons',
  description: 'Author lessons for the calculation, positional, attack/defence and endgame nodes that have none (run in waves via args); review and fix each batch',
  phases: [
    { title: 'Author', detail: 'one author per batch of 3-6 nodes writes lessons against shipped items' },
    { title: 'Review', detail: 'one adversarial reviewer per batch: chess accuracy, honesty about the app, pedagogy' },
    { title: 'Fix', detail: 'a fixer verifies and applies the reviewer findings, re-runs validators' },
  ],
}

const BATCHES = [
  { id: 'sp1', lesson: 'L-FND-SPECIAL-1', nodes: ['FND.ENPASSANT', 'FND.PROMOTE', 'FND.DRAWS', 'FND.SPECIAL'] },
  { id: 'sp2', lesson: 'L-FND-ROOKBISHOP-1', nodes: ['FND.PIECE.ROOK', 'FND.PIECE.BISHOP'] },
  { id: 'sp3', lesson: 'L-FND-QUEENKING-1', nodes: ['FND.PIECE.QUEEN', 'FND.PIECE.KING'] },
  { id: 'sp4', lesson: 'L-FND-CAPTURE-1', nodes: ['FND.CAPTURE', 'FND.VALUE'] },
  { id: 'sp5', lesson: 'L-FND-CHECK-1', nodes: ['FND.CHECK', 'FND.STALEMATE'] },
  { id: 'sp6', lesson: 'L-TAC-REMOVE-DEFENDER-1', nodes: ['TAC.REMOVE-DEFENDER', 'TAC.DEFLECT', 'TAC.DECOY', 'TAC.OVERLOAD'] },
  { id: 'sp7', lesson: 'L-TAC-DISCOVER-1', nodes: ['TAC.DISCOVER', 'TAC.DOUBLE-CHECK'] },
  { id: 'sp8', lesson: 'L-END-LUCENA-PHILIDOR-1', nodes: ['END.LUCENA', 'END.PHILIDOR'] },
  { id: 'sp9', lesson: 'L-END-MATE-1', nodes: ['END.MATE-KQ', 'END.MATE-STALEMATE-AVOID'] },
  { id: 'sp10', lesson: 'L-END-PAWNRACE-1', nodes: ['END.SQUARE', 'END.PAWN-RACE'] },
  { id: 'sp11', lesson: 'L-END-WRONGBISHOP-1', nodes: ['END.WRONG-BISHOP', 'END.THEORY.2N'] },
  { id: 'sp12', lesson: 'L-OPN-REPERTOIRE-1', nodes: ['OPN.REPERTOIRE.WHITE', 'OPN.REPERTOIRE.BLACK'] },
  { id: 'sp13', lesson: 'L-POS-PLAN-1', nodes: ['POS.PLAN', 'POS.PLAN.DIFF'] },
]

const AUTHORED = {
  type: 'object',
  properties: {
    lessons: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, skill: { type: 'string' }, also: { type: 'array', items: { type: 'string' } }, items_new: { type: 'integer' }, items_reused: { type: 'integer' } }, required: ['id', 'skill', 'items_new', 'items_reused'] } },
    nodes_not_done: { type: 'array', items: { type: 'string' } },
    validator: { type: 'string' },
    caveats: { type: 'array', items: { type: 'string' } },
  },
  required: ['lessons', 'nodes_not_done', 'validator', 'caveats'],
}
const REVIEWED = {
  type: 'object',
  properties: {
    lessons_read: { type: 'integer' },
    findings: { type: 'array', items: { type: 'object', properties: {
      lesson: { type: 'string' }, step: { type: 'integer', description: '1-based step number, or 0 for the lesson as a whole' },
      lens: { type: 'string', enum: ['chess-accuracy', 'app-honesty', 'pedagogy', 'vocabulary', 'rights'] },
      severity: { type: 'string', enum: ['high', 'medium', 'low'] },
      problem: { type: 'string' }, replacement: { type: 'string', description: 'exact replacement text or a precise edit instruction' } },
      required: ['lesson', 'step', 'lens', 'severity', 'problem', 'replacement'] } },
    summary: { type: 'string' },
  },
  required: ['lessons_read', 'findings', 'summary'],
}
const FIXED = {
  type: 'object',
  properties: { applied: { type: 'array', items: { type: 'string' } }, rejected: { type: 'array', items: { type: 'string' } }, validators: { type: 'string' } },
  required: ['applied', 'rejected', 'validators'],
}

const SHARED = `You are writing lessons for a chess school (project rules are in O:\\_Chessteaching\\CLAUDE.md, already loaded). The product teaches by test-first practice, honest evidence and self-direction. Read first, and skim only what you need: docs/authoring-guide.md (format, limits, and the fixed Vocabulary section), docs/content-schema.md (including the extensions section at the end), one exemplar lesson from each of content/lessons/L-TAC-PIN-1.json, content/lessons/L-LOOP-V2-1.json and content/lessons/L-SELF-4-1.json, and the 'weaknesses' sections of docs/lessons-t0.md, docs/lessons-tactics.md, docs/lessons-loop-self.md, docs/lessons-openings.md, docs/lessons-positional.md, docs/lessons-endgames.md (they list defects earlier authors made so you do not repeat them). Skill nodes are in content/skills/<ID>.json (outcomes per depth, conditions, contrasts, misconceptions, prerequisites): your lesson must teach what those say and no more, in original wording.
Rules that matter most:
- Lesson file: content/lessons/L-<NODE with dots replaced by hyphens>-1.json, id the same without .json, skill = the node, depth D1 (D2 only if the node's D1 is already covered), minutes 6-12, outcomes (2-4 observable), steps, review {status:'needs-human', reviewer:null}, sources (docs or items it rests on). Cards: at most 90 words (aim 70), plain text with **bold** and *italic* only; a card must be followed by a task (item, practice, contrast or reflect) within two steps. Each lesson: a short idea card, a worked board (line with say-text) where useful, a cued item, a conditions card (when it holds and when it fails, with the word 'rule of thumb' wherever it is one), a contrast step (working, failing, irrelevant item ids: one-feature changes), two or more cue-3 items with silent:true, including a position where the idea does not apply, a practice step whose tags match at least 3 shipped items, and a reflect step. Where a node cannot honestly have chess items (habit nodes) use reflect steps and learner-run routines.
- Items: reuse shipped items first. Query app/public/content/items.json (run tools/build_content.py first if it is missing) by skill prefix and tags; reuse by id in item steps and by tags in practice steps. Author new items only where needed, in content/items/lesson-<batch>.json with ids IB<batch>-<n> and positions PB<batch>-<n> (batch = your batch id), every item with claims that tools/validate.py passes (rules, engine at recorded depth, tablebase), three escalating hints, an explain stating only what claims verify, and review.status machine-only or needs-human. Never loosen a claim to pass; discard the item. Positions are never hand-typed without validation (about half of hand-built positions have been defective: unbalanced material, hidden mates, illegal side to move); use families so near-duplicates stay together. Accepted-move sets for find_move are the engine's top moves; give feedback_by_move for tempting wrong moves only where a claim backs it.
- Honesty: say only what a claim or a stated rule verifies. Opening statistics only from app/public/openings with the band named. Features of the app that exist: Today (own aim first, daily plan), Course map, Practice (silent mode), Placement, My plan (baseline/train/check experiments with intervals), Contrast lab, My games (annotate first, engine, biggest drops with detector tags, patterns across games), Openings explorer with transpositions, repertoire and drill, Thinking prompts for LOOP.V1-V3, silent steps, 'also sound' recognition of equal moves, confidence chips, Settings export. Do not promise anything else (write 'planned' or make it a paper exercise).
- Use the fixed vocabulary (loose piece = attacked and not defended; 'hanging' only as theme name or once as a synonym; counting values are a rule of thumb).
- Coverage: if two of your nodes are best taught together, write one lesson and put the second node in the lesson's top-level 'also' list (the app and tools/check_all.py honour it), at most two nodes per lesson. If an existing lesson already teaches a node (list content/lessons), do not duplicate: say so in nodes_not_done with the lesson id.
- Validate: tools/validate.py on your item files (at most 3 at a time), tools/validate_lessons.py on your lessons (0 errors), tools/check_all.py (no error mentions your files), tools/build_content.py (your items ship). Run Python as ./tools/.venv/Scripts/python.exe -I from O:\\_Chessteaching. If the file tools/.validator-hardened exists the validator has been hardened for parallel runs; if tablebase calls fail with 'service unavailable' retry. Write only your own files (new lesson and item files); never edit existing lessons, items, skills, app or tools. Be economical with tokens: summarise tool output, do not re-read long documents.`

const authorPrompt = (b) => `${SHARED}

THIS TASK IS A SPLIT, NOT A NEW LESSON. The doctrine is one building block per lesson (nothing taught twice, rule D24, and Andrew's request of 30 Oct 2026). The existing lesson ${b.lesson} teaches several skill nodes at once (${b.nodes.join(', ')}; see its top-level 'also'). Replace it with ONE LESSON PER SKILL NODE.
HOW:
- Read content/lessons/${b.lesson}.json and every item it uses. Decide for each node which cards, board steps, items, contrast and reflect steps belong to it; reuse existing text and items wherever they fit (move them, do not rewrite them) and write only the connecting cards and any missing task so that each new lesson stands alone: 8 to 12 minutes in the first-hours range, a card followed by a task within two steps, at least one cue-3 silent item where the node has items, a conditions card, a practice step with at least 3 matching items.
- Files: for each node content/lessons/L-<NODE with dots replaced by hyphens>-1.json (for example FND.ENPASSANT gives L-FND-ENPASSANT-1.json), id the same, skill = that node, depth D1, no 'also'. The FIRST node in the list keeps the OLD lesson id ${b.lesson} (so existing learner progress on it survives): write it to content/lessons/${b.lesson}.json and give it skill = the first node. If a node is a pure umbrella with no content of its own (for example FND.SPECIAL), say so in nodes_not_done and put nothing in it.
- Within the first-hours order, the lessons must be taught in this order: the order of the node list above unless the prerequisites in content/skills say otherwise. Cross-references use lesson titles, not ids.
- Do NOT leave a topic taught in two lessons: after the split each idea lives in exactly one lesson.
- Items: new items only where a node ends up with fewer than six usable ones (item file content/items/lesson-split-${b.id}.json, ids IS${b.id}-<n>, every claim machine-checked by tools/validate.py). Do not delete any existing item file.
- Also update the references to the old combined lesson: docs/first-10-hours.md (the table of lessons) and any content/courses/*.json that lists it.
- Validate: tools/validate_lessons.py on your lessons, tools/check_all.py (no error mentions your files), tools/check_overlap.py (no new overlap), tools/build_content.py. Python: ./tools/.venv/Scripts/python.exe -I from O:\_Chessteaching.
Return the report in the requested schema (lessons = the new lesson ids).`

const reviewPrompt = (b, a) => `You are an adversarial reviewer with three lenses applied to the lessons just written for batch ${b.id}: ${a.lessons.map(l => l.id).join(', ')} (files content/lessons/<id>.json; their new items are in content/items/lesson-fg-${b.id}.json if it exists, other items are shared). The author reports: validator ${a.validator}; caveats: ${(a.caveats || []).join(' | ')}.
Lens 1, CHESS ACCURACY (and SPLIT QUALITY: every new lesson teaches exactly one skill node, each idea of the old lesson now lives in exactly ONE lesson, nothing was lost (compare the old lesson's steps and items with the new ones: list anything dropped), every card is original wording and chess-accurate (re-check claims with python-chess or the engine), and the lessons make sense in the stated order): every statement a card, caption, hint or explanation makes about chess. Test concrete claims with python-chess, tools/engine.py (Stockfish) or the Lichess tablebase API from scripts in the scratchpad directory only (./tools/.venv/Scripts/python.exe -I). A rule of thumb written as a law is a defect. A board example whose say-text or caption misdescribes the position is a defect.
Lens 2, APP HONESTY AND RIGHTS: anything promised about the app that does not exist (it has Today, Course, Practice with silent mode, Placement, My plan, Contrast lab, My games with detector tags, Openings explorer with repertoire and drill, thinking prompts for LOOP.V1-V3, 'also sound' move recognition, confidence chips, Settings export; nothing else); statistics not from app/public/openings; text that copies a book or website rather than original wording; claims that overstate the evidence (engine depth-limited evidence called proof).
Lens 3, PEDAGOGY: cards over 90 words or dense; a task missing within two steps of a card; cue-3 items that name the theme in the prompt; a contrast whose halves differ by more than one feature; answer choices that leak the answer; a lesson that does not teach what its node's outcomes say; vocabulary breaking docs/authoring-guide.md; a beginner-hostile jump in difficulty; no position where the idea does not apply.
Read each lesson file fully and every item it references (and the node file). Report only real defects with the exact replacement text or a precise edit instruction. Do NOT edit any file. Return the schema.`

const fixPrompt = (b, a, r) => `You are the fixer for lesson batch ${b.id} (${a.lessons.map(l => l.id).join(', ')}). A reviewer produced the findings below. For each finding: open the lesson (and item) file, VERIFY the problem yourself (run a check where it is a chess claim), then apply the replacement with an exact edit if you confirm it; reject it with a reason if you cannot reproduce it or the replacement would be wrong. Keep cards at most 90 words, keep JSON valid and ids unchanged. You may edit only these batch's lesson files (content/lessons/${a.lessons.map(l => l.id).join(', ')}.json) and content/items/lesson-fg-${b.id}.json. If an item's content changes, re-run tools/validate.py on that file (the evidence hash goes stale otherwise). Finally run tools/validate_lessons.py on the lessons, tools/check_all.py, and tools/build_content.py and report the result lines. Run Python as ./tools/.venv/Scripts/python.exe -I from O:\\_Chessteaching.\n\nFINDINGS:\n${r.findings.filter(f => f.severity !== 'low').map((f, n) => `${n + 1}. [${f.lens}/${f.severity}] ${f.lesson} step ${f.step}: ${f.problem}\n   FIX: ${f.replacement}`).join('\n') || '(none: just run the validators and report)'}`

phase('Author')
const only = Array.isArray(args) && args.length ? args : null
const WAVE = BATCHES.filter(b => !only || only.includes(b.id))
log(`games: ${WAVE.map(b => b.id).join(', ')}`)
const out = await pipeline(
  WAVE,
  (b) => agent(authorPrompt(b), { label: `author:${b.id}`, phase: 'Author', schema: AUTHORED }),
  (a, b) => a && a.lessons.length
    ? agent(reviewPrompt(b, a), { label: `review:${b.id}`, phase: 'Review', schema: REVIEWED }).then(r => ({ a, r }))
    : { a, r: null },
  (x, b) => x && x.a && x.r
    ? agent(fixPrompt(b, x.a, x.r), { label: `fix:${b.id}`, phase: 'Fix', schema: FIXED }).then(f => ({ batch: b.id, lessons: x.a.lessons.map(l => l.id), caveats: x.a.caveats, findings: x.r.findings.length, high: x.r.findings.filter(q => q.severity === 'high').length, applied: f ? f.applied.length : 0, rejected: f ? f.rejected : [], validators: f ? f.validators : 'fixer failed' }))
    : { batch: b.id, lessons: x && x.a ? x.a.lessons.map(l => l.id) : [], caveats: x && x.a ? x.a.caveats : [], findings: 0, validators: 'author or reviewer failed' }
)
return out.filter(Boolean)
