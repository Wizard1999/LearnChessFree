export const meta = {
  name: 'write-lessons-tranche2',
  description: 'Author lessons for the calculation, positional, attack/defence and endgame nodes that have none (run in waves via args); review and fix each batch',
  phases: [
    { title: 'Author', detail: 'one author per batch of 3-6 nodes writes lessons against shipped items' },
    { title: 'Review', detail: 'one adversarial reviewer per batch: chess accuracy, honesty about the app, pedagogy' },
    { title: 'Fix', detail: 'a fixer verifies and applies the reviewer findings, re-runs validators' },
  ],
}

const BATCHES = [
 {
  "id": "ds11",
  "nodes": [
   "FND.BOARD.D2",
   "FND.CAPTURE.D2",
   "FND.CASTLE.D2",
   "FND.CHECK.D2",
   "FND.ENPASSANT.D2"
  ],
  "note": "Strand S1 deeper lessons (tiers 0-0). Titles: Squares and notation; Capturing and attack; Castling; Check; En passant"
 },
 {
  "id": "ds12",
  "nodes": [
   "FND.PIECE.BISHOP.D2",
   "FND.PIECE.KING.D2",
   "FND.PIECE.KNIGHT.D2",
   "FND.PIECE.PAWN.D2",
   "FND.PIECE.QUEEN.D2"
  ],
  "note": "Strand S1 deeper lessons (tiers 0-0). Titles: How the bishop moves; How the king moves; How the knight moves; How the pawn moves; How the queen moves"
 },
 {
  "id": "ds13",
  "nodes": [
   "FND.PIECE.ROOK.D2",
   "FND.PROMOTE.D2",
   "FND.PROMOTE.D3",
   "FND.STALEMATE.D2",
   "FND.DRAWS.D2"
  ],
  "note": "Strand S1 deeper lessons (tiers 0-1). Titles: How the rook moves; Promotion; Promotion; Stalemate; Ways a game is drawn"
 },
 {
  "id": "ds14",
  "nodes": [
   "FND.MATE1.D2",
   "FND.MATE1.D3",
   "FND.SPECIAL.D2"
  ],
  "note": "Strand S1 deeper lessons (tiers 1-1). Titles: Checkmate in one move; Checkmate in one move; Which special move applies"
 },
 {
  "id": "ds31",
  "nodes": [
   "TAC.BACKRANK.D2",
   "TAC.DISCOVER.D3",
   "TAC.DOUBLE-CHECK.D2",
   "TAC.FORK.D3",
   "TAC.PIN.D3"
  ],
  "note": "Strand S3 deeper lessons (tiers 2-2). Titles: Back-rank mates; Discovered attacks and checks; Double check; Forks (double attacks); Pins"
 },
 {
  "id": "ds32",
  "nodes": [
   "TAC.SKEWER.D2",
   "TAC.DECOY.D2",
   "TAC.DEFLECT.D2",
   "TAC.MATE-PATTERNS.D2",
   "TAC.NONE.D2"
  ],
  "note": "Strand S3 deeper lessons (tiers 2-3). Titles: Skewers; Decoy; Deflection; Mating patterns; Is there a tactic at all?"
 },
 {
  "id": "ds33",
  "nodes": [
   "TAC.REMOVE-DEFENDER.D2",
   "TAC.STALEMATE-TRICK.D2",
   "TAC.STALEMATE-TRICK.D3",
   "TAC.TRAPPED.D2",
   "TAC.ZWISCHENZUG.D2"
  ],
  "note": "Strand S3 deeper lessons (tiers 3-3). Titles: Removing the defender; Stalemate as a resource; Stalemate as a resource; Trapped pieces; In-between moves"
 },
 {
  "id": "ds34",
  "nodes": [
   "TAC.ZWISCHENZUG.D3",
   "TAC.CLEARANCE.D2",
   "TAC.CLEARANCE.D3",
   "TAC.DESPERADO.D2",
   "TAC.INTERFERE.D2"
  ],
  "note": "Strand S3 deeper lessons (tiers 3-4). Titles: In-between moves; Clearance; Clearance; Desperado pieces; Interference"
 },
 {
  "id": "ds35",
  "nodes": [
   "TAC.INTERFERE.D3",
   "TAC.PERPETUAL.D2",
   "TAC.UNDERPROMOTE.D2",
   "TAC.XRAY.D2",
   "TAC.XRAY.D3"
  ],
  "note": "Strand S3 deeper lessons (tiers 4-4). Titles: Interference; Perpetual check; Underpromotion; X-ray and batteries; X-ray and batteries"
 },
 {
  "id": "ds36",
  "nodes": [
   "TAC.QUIET-MOVE.D2"
  ],
  "note": "Strand S3 deeper lessons (tiers 5-5). Titles: The quiet move in a combination"
 },
 {
  "id": "ds21",
  "nodes": [
   "LOOP.V1.D2",
   "SAF.COUNT.D2",
   "SAF.LOOSE.D2",
   "SAF.THREAT.D2",
   "LOOP.V2.D2"
  ],
  "note": "Strand S2 deeper lessons (tiers 1-2). Titles: Thinking Loop v1: safety scan; Counting attackers and defenders; Loose pieces; What does their last move threaten?; Thinking Loop v2: checks, captures, threats"
 },
 {
  "id": "ds22",
  "nodes": [
   "LOOP.V3.D2",
   "LOOP.V4.D2",
   "LOOP.V5.D2",
   "LOOP.V6.D2"
  ],
  "note": "Strand S2 deeper lessons (tiers 3-6). Titles: Thinking Loop v3: candidates and short lines; Thinking Loop v4: compare resulting positions; Thinking Loop v5: depth allocation and best defence; Thinking Loop v6: elimination and verification"
 },
 {
  "id": "ds41",
  "nodes": [
   "CAL.CANDIDATES.D2",
   "CAL.VISUALIZE.D2",
   "CAL.DEFENSE.D2",
   "CAL.TREE.D2",
   "CAL.BLIND.D2"
  ],
  "note": "Strand S4 deeper lessons (tiers 3-5). Titles: Candidate moves: list and prune; Visualising a line; The opponent's best resource; The analysis tree; Entering variations without the pieces"
 },
 {
  "id": "ds42",
  "nodes": [
   "CAL.DEPTH.D2",
   "CAL.ENDURANCE.D2"
  ],
  "note": "Strand S4 deeper lessons (tiers 5-6). Titles: How deep, and when to stop; Long lines and accuracy under fatigue"
 },
 {
  "id": "ds51",
  "nodes": [
   "POS.ACTIVITY.D2",
   "POS.CONNECT.D2",
   "POS.OPENFILE.D2",
   "POS.OPENFILE.D3",
   "POS.SEVENTH.D2"
  ],
  "note": "Strand S5 deeper lessons (tiers 2-2). Titles: Piece activity; Connecting the rooks; Open files; Open files; The seventh rank"
 },
 {
  "id": "ds52",
  "nodes": [
   "POS.SEVENTH.D3",
   "POS.BISHOPS.D2",
   "POS.BISHOPS.D3",
   "POS.BLOCKADE.D2",
   "POS.EXCHANGE.D2"
  ],
  "note": "Strand S5 deeper lessons (tiers 2-3). Titles: The seventh rank; The bishop pair; The bishop pair; Blockading a passed pawn; Which trades help"
 },
 {
  "id": "ds53",
  "nodes": [
   "POS.GOODBAD.D2",
   "POS.GOODBAD.D3",
   "POS.MAJORITY.D2",
   "POS.MAJORITY.D3",
   "POS.OUTOFPLAY.D2"
  ],
  "note": "Strand S5 deeper lessons (tiers 3-3). Titles: Good and bad pieces; Good and bad pieces; Pawn majorities; Pawn majorities; Pieces out of play"
 },
 {
  "id": "ds54",
  "nodes": [
   "POS.OUTPOST.D2",
   "POS.OUTPOST.D3",
   "POS.PASSED.D2",
   "POS.PASSED.D3",
   "POS.PAWNMOVE.D2"
  ],
  "note": "Strand S5 deeper lessons (tiers 3-3). Titles: Outposts; Outposts; Passed pawns; Passed pawns; What does this pawn move leave behind?"
 },
 {
  "id": "ds55",
  "nodes": [
   "POS.PAWNWEAK.D2",
   "POS.PAWNWEAK.D3",
   "POS.PLAN.D2",
   "POS.TARGET.D2",
   "POS.WEAKSQ.D2"
  ],
  "note": "Strand S5 deeper lessons (tiers 3-3). Titles: Pawn weaknesses; Pawn weaknesses; Making a plan you can carry out; Choose a target that cannot move; Weak squares and holes"
 },
 {
  "id": "ds56",
  "nodes": [
   "POS.WEAKSQ.D3",
   "POS.BREAKS.D2",
   "POS.CENTER.MOBILE.D2",
   "POS.IMBALANCES.D2",
   "POS.OBSTRUCT.D2"
  ],
  "note": "Strand S5 deeper lessons (tiers 3-4). Titles: Weak squares and holes; Pawn breaks and levers; The free mobile centre pawn; Imbalances checklist; Obstructions"
 },
 {
  "id": "ds57",
  "nodes": [
   "POS.PIN.STRATEGIC.D2",
   "POS.PLAN.MODE.D2",
   "POS.PLAN.PIECES.D2",
   "POS.REASSESS.D2",
   "POS.SPACE.D2"
  ],
  "note": "Strand S5 deeper lessons (tiers 4-4). Titles: Pins as strategy: asking the question; Active, passive or neutral: mode follows the evaluation; Allocating pieces to the plan; Re-evaluating after changes; Space and restriction"
 },
 {
  "id": "ds58",
  "nodes": [
   "POS.SPACE.D3",
   "POS.STRUCTURE.CARLSBAD.D2",
   "POS.STRUCTURE.CHAIN.D2",
   "POS.STRUCTURE.IQP.D2",
   "POS.STRUCTURE.MAROCZY.D2"
  ],
  "note": "Strand S5 deeper lessons (tiers 4-4). Titles: Space and restriction; Carlsbad structure: the minority attack; Pawn chains: attack the base; Isolated queen's pawn; The Maroczy bind"
 },
 {
  "id": "ds59",
  "nodes": [
   "POS.SWITCH.D2",
   "POS.RESTRAINT.D2",
   "POS.STRUCTURE.DOUBLED.D2",
   "POS.STRUCTURE.HANGING.D2",
   "POS.STRUCTURE.HANGING.D3"
  ],
  "note": "Strand S5 deeper lessons (tiers 4-5). Titles: Switch of wing; Restraint; Doubled pawns in context; Hanging pawns; Hanging pawns"
 },
 {
  "id": "ds510",
  "nodes": [
   "POS.STRUCTURE.HEDGEHOG.D2",
   "POS.STRUCTURE.KID.D2",
   "POS.TRANSFORM.D2",
   "POS.TRANSFORM.D3",
   "POS.TWOWEAK.D2"
  ],
  "note": "Strand S5 deeper lessons (tiers 5-5). Titles: The hedgehog; The King's Indian chain and its pawn breaks; Favourable transformations; Favourable transformations; Two weaknesses"
 },
 {
  "id": "ds511",
  "nodes": [
   "POS.DYNAMIC.D2",
   "POS.EXCEPTIONS.D2",
   "POS.MANEUVER.D2"
  ],
  "note": "Strand S5 deeper lessons (tiers 6-6). Titles: Dynamic play; When the rule fails; Manoeuvring against weaknesses"
 },
 {
  "id": "ds71",
  "nodes": [
   "END.MATE-KQ.D3",
   "END.MATE-KR.D2",
   "END.MATE-KR.D3",
   "END.MATE-STALEMATE-AVOID.D2",
   "END.OPPOSITION.D2"
  ],
  "note": "Strand S7 deeper lessons (tiers 1-1). Titles: Mate with king and queen; Mate with king and rook; Mate with king and rook; Mating without stalemating; Opposition (basic: T1-2 depth only)"
 },
 {
  "id": "ds72",
  "nodes": [
   "END.PAWN-RACE.D2",
   "END.KING-ACTIVE.D2",
   "END.KING-ACTIVE.D3",
   "END.BREAKTHROUGH.D2",
   "END.BREAKTHROUGH.D3"
  ],
  "note": "Strand S7 deeper lessons (tiers 1-3). Titles: Pawn races and the square; The king as a fighting piece; The king as a fighting piece; Pawn breakthrough; Pawn breakthrough"
 },
 {
  "id": "ds73",
  "nodes": [
   "END.KEYSQ.D2",
   "END.KPK.D2",
   "END.KPK.D3",
   "END.MATE-2B.D2",
   "END.MATE-2B.D3"
  ],
  "note": "Strand S7 deeper lessons (tiers 3-3). Titles: Key squares; King and pawn against king; King and pawn against king; Mate with two bishops; Mate with two bishops"
 },
 {
  "id": "ds74",
  "nodes": [
   "END.MATE-MATERIAL.D2",
   "END.OUTSIDE-PASSER.D2",
   "END.OUTSIDE-PASSER.D3",
   "END.PAWN-FLANK.D2",
   "END.SQUARE.D2"
  ],
  "note": "Strand S7 deeper lessons (tiers 3-3). Titles: Which material can force mate; The outside passed pawn; The outside passed pawn; Pawn endings: act on the stronger flank; The rule of the square"
 },
 {
  "id": "ds75",
  "nodes": [
   "END.SQUARE.D3",
   "END.ZUGZWANG.D2",
   "END.LUCENA.D2",
   "END.LUCENA.D3",
   "END.MINOR.D2"
  ],
  "note": "Strand S7 deeper lessons (tiers 3-4). Titles: The rule of the square; Zugzwang; Lucena: building the bridge; Lucena: building the bridge; Minor-piece endings"
 },
 {
  "id": "ds76",
  "nodes": [
   "END.MINOR.D3",
   "END.OPPOSITION.DISTANT.D2",
   "END.PHILIDOR.D2",
   "END.PHILIDOR.D3",
   "END.QUEEN-PAWN.D2"
  ],
  "note": "Strand S7 deeper lessons (tiers 4-4). Titles: Minor-piece endings; Distant and lateral opposition; Philidor: the passive defence that works; Philidor: the passive defence that works; Queen against an advanced pawn"
 },
 {
  "id": "ds77",
  "nodes": [
   "END.QUEEN-PAWN.D3",
   "END.ROOK-ACTIVE.D2",
   "END.ROOK-ACTIVE.D3",
   "END.TEMPO.D3",
   "END.FORTRESS.D2"
  ],
  "note": "Strand S7 deeper lessons (tiers 4-5). Titles: Queen against an advanced pawn; Active rooks in rook endings; Active rooks in rook endings; Spare moves and knight parity; Fortresses in endings"
 },
 {
  "id": "ds78",
  "nodes": [
   "END.FORTRESS.D3",
   "END.MATE-BN.D2",
   "END.MATE-BN.D3",
   "END.REMOTE.D2",
   "END.THEORY.2N.D2"
  ],
  "note": "Strand S7 deeper lessons (tiers 5-5). Titles: Fortresses in endings; Mate with bishop and knight; Mate with bishop and knight; The remote passed pawn as a decoy; Two knights against a bare king and a pawn"
 },
 {
  "id": "ds79",
  "nodes": [
   "END.TRANSITION.D2",
   "END.TRIANGULATION.D2",
   "END.WRONG-BISHOP.D2",
   "END.WRONG-BISHOP.D3",
   "END.THEORY.QvR.D2"
  ],
  "note": "Strand S7 deeper lessons (tiers 5-6). Titles: Which ending to enter; Triangulation; The wrong-coloured bishop; The wrong-coloured bishop; Queen against rook"
 },
 {
  "id": "ds710",
  "nodes": [
   "END.THEORY.QvR.D3"
  ],
  "note": "Strand S7 deeper lessons (tiers 6-6). Titles: Queen against rook"
 },
 {
  "id": "ds61",
  "nodes": [
   "ATK.SUPERIORITY.D2",
   "ATK.COMMIT.D2",
   "ATK.PAWNSTORM.D2",
   "DEF.WAIT.D2",
   "DEF.COUNTER.D2"
  ],
  "note": "Strand S6 deeper lessons (tiers 3-5). Titles: Tangible superiority before attacking; Committing to a direct attack; Pawn storms and opposite-side castling; Defence by waiting; Counter-attack"
 },
 {
  "id": "ds62",
  "nodes": [
   "DEF.TRADES.D2",
   "INI.INITIATIVE.D2",
   "SAC.EXCHANGE.D2",
   "DEF.FORTRESS.D2"
  ],
  "note": "Strand S6 deeper lessons (tiers 5-6). Titles: Defensive exchanges; The initiative; The exchange sacrifice; Fortresses in the middlegame and ending"
 },
 {
  "id": "ds81",
  "nodes": [
   "OPN.PRINCIPLES.D3",
   "OPN.DEVIATION.D2",
   "OPN.DEVIATION.D3",
   "OPN.NONDEV.D2",
   "OPN.NONDEV.D3"
  ],
  "note": "Strand S8 deeper lessons (tiers 1-2). Titles: Opening principles (stub: outcomes only, no items yet); They left the book; They left the book; Developing and time-wasting moves; Developing and time-wasting moves"
 },
 {
  "id": "ds82",
  "nodes": [
   "OPN.SETUP.D2",
   "OPN.TEMPO.D2",
   "OPN.TRAPS.D2",
   "OPN.PUNISH.D2",
   "OPN.PUNISH.D3"
  ],
  "note": "Strand S8 deeper lessons (tiers 2-3). Titles: One simple setup with reasons; Tempo: which moves helped; Opening traps and sure material; Punishing an opening mistake; Punishing an opening mistake"
 },
 {
  "id": "ds83",
  "nodes": [
   "OPN.REPERTOIRE.BLACK.D3",
   "OPN.REPERTOIRE.WHITE.D2",
   "OPN.STRUCT.D2",
   "OPN.STRUCT.D3",
   "OPN.PREP.D2"
  ],
  "note": "Strand S8 deeper lessons (tiers 3-5). Titles: A reasons-first repertoire as Black; A reasons-first repertoire as White; Opening lines and the structures they lead to; Opening lines and the structures they lead to; Preparation of forcing lines"
 },
 {
  "id": "ds84",
  "nodes": [
   "OPN.NOVELTY.D2"
  ],
  "note": "Strand S8 deeper lessons (tiers 7-7). Titles: Novelties and opponent preparation"
 },
 {
  "id": "ds91",
  "nodes": [
   "GAME.OWN.D2",
   "GAME.OWN.D3"
  ],
  "note": "Strand S9 deeper lessons (tiers 3-3). Titles: Annotating your own games before the engine; Annotating your own games before the engine"
 },
 {
  "id": "ds101",
  "nodes": [
   "PRA.CLOCK.D3",
   "PRA.RESIST.D2"
  ],
  "note": "Strand S10 deeper lessons (tiers 1-4). Titles: Clock literacy; Practical resistance when worse"
 }
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
- Validate: tools/validate.py on your item files (at most 3 at a time), tools/validate_lessons.py on your lessons (0 errors), tools/check_all.py (no error mentions your files), tools/build_content.py (your items ship). Run Python as ./tools/.venv/Scripts/python.exe -I from O:\\_Chessteaching. If the file tools/.validator-hardened exists the validator has been hardened for parallel runs; if tablebase calls fail with 'service unavailable' retry. Write only your own files (new lesson and item files); never edit existing lessons, items, skills, app or tools. NO OVERLAP (owner's rule): nothing is taught twice. Before you finish, run tools/check_overlap.py: none of the lessons you wrote may share a board position with any other lesson (do not reuse a position that another lesson already shows as an item or board step; choose a different shipped item or an authored one) and none may duplicate another lesson's skill and depth. Where your lesson relies on an idea taught elsewhere, name that lesson by its exact title in a card instead of re-teaching it. Other agents write lessons at the same time: ignore overlaps that are not yours. Be economical with tokens: summarise tool output, do not re-read long documents.`

const authorPrompt = (b) => `${SHARED}\n\nYOUR BATCH ${b.id}: write DEEPER lessons for these skill depths: ${b.nodes.join(', ')} (each key is NODE.DEPTH). THIS OVERRIDES THE FILE-NAMING AND DEPTH RULES ABOVE: the core D1 lesson for each node already exists (content/lessons/L-<NODE>-1.json): read it and do NOT re-teach it (link to it in the first card by name; nothing is taught twice, rule D24). Your lesson teaches only what the named depth's outcome and prerequisites in content/skills/<NODE>.json add: file content/lessons/L-<NODE with dots replaced by hyphens>-<depth number>.json (for example L-POS-OUTPOST-2.json for D2), id the same, skill = the node, depth = the named depth (D2 or D3), minutes 8-14, review {status:'needs-human', reviewer:null}. Prefer the shipped items at that depth (query app/public/content/items.json for skill NODE.DEPTH and tags node.NODE); author new items only where there are fewer than six usable ones, in content/items/lesson-${b.id}.json. If two of your depths belong together, one lesson with the second node in 'also'. If a depth cannot honestly be taught with checkable items, do not write it and say so in nodes_not_done.\nNotes for this batch: ${b.note}\nFirst check whether partial work for your nodes already exists (a previous run may have been interrupted): list content/lessons/ for your nodes and content/items/lesson-${b.id}.json; if so continue from it instead of starting over. tools/.validator-hardened exists (atomic, locked tablebase cache; new claim types in docs/content-schema.md), so run tools/validate.py freely, a few files at a time, and retry transient 'service unavailable' errors. Report ALL lessons for your nodes.\nReturn the report in the requested schema.`

const reviewPrompt = (b, a) => `You are an adversarial reviewer with three lenses applied to the lessons just written for batch ${b.id}: ${a.lessons.map(l => l.id).join(', ')} (files content/lessons/<id>.json; their new items are in content/items/lesson-${b.id}.json if it exists, other items are shared). The author reports: validator ${a.validator}; caveats: ${(a.caveats || []).join(' | ')}.
Lens 1, CHESS ACCURACY: every statement a card, caption, hint or explanation makes about chess. Test concrete claims with python-chess, tools/engine.py (Stockfish) or the Lichess tablebase API from scripts in the scratchpad directory only (./tools/.venv/Scripts/python.exe -I). A rule of thumb written as a law is a defect. A board example whose say-text or caption misdescribes the position is a defect.
Lens 2, APP HONESTY AND RIGHTS: anything promised about the app that does not exist (it has Today, Course, Practice with silent mode, Placement, My plan, Contrast lab, My games with detector tags, Openings explorer with repertoire and drill, thinking prompts for LOOP.V1-V3, 'also sound' move recognition, confidence chips, Settings export; nothing else); statistics not from app/public/openings; text that copies a book or website rather than original wording; claims that overstate the evidence (engine depth-limited evidence called proof).
Lens 3, PEDAGOGY: cards over 90 words or dense; a task missing within two steps of a card; cue-3 items that name the theme in the prompt; a contrast whose halves differ by more than one feature; answer choices that leak the answer; a lesson that does not teach what its node's outcomes say; vocabulary breaking docs/authoring-guide.md; a beginner-hostile jump in difficulty; no position where the idea does not apply.
Read each lesson file fully and every item it references (and the node file). Report only real defects with the exact replacement text or a precise edit instruction. Do NOT edit any file. Return the schema.`

const fixPrompt = (b, a, r) => `You are the fixer for lesson batch ${b.id} (${a.lessons.map(l => l.id).join(', ')}). A reviewer produced the findings below. For each finding: open the lesson (and item) file, VERIFY the problem yourself (run a check where it is a chess claim), then apply the replacement with an exact edit if you confirm it; reject it with a reason if you cannot reproduce it or the replacement would be wrong. Keep cards at most 90 words, keep JSON valid and ids unchanged. You may edit only these batch's lesson files (content/lessons/${a.lessons.map(l => l.id).join(', ')}.json) and content/items/lesson-${b.id}.json. If an item's content changes, re-run tools/validate.py on that file (the evidence hash goes stale otherwise). Finally run tools/validate_lessons.py on the lessons, tools/check_all.py, and tools/build_content.py and report the result lines. Run Python as ./tools/.venv/Scripts/python.exe -I from O:\\_Chessteaching.\n\nFINDINGS:\n${r.findings.filter(f => f.severity !== 'low').map((f, n) => `${n + 1}. [${f.lens}/${f.severity}] ${f.lesson} step ${f.step}: ${f.problem}\n   FIX: ${f.replacement}`).join('\n') || '(none: just run the validators and report)'}`

phase('Author')
const only = Array.isArray(args) && args.length ? args : null
const WAVE = BATCHES.filter(b => !only || only.includes(b.id))
log(`wave: ${WAVE.map(b => b.id).join(', ')}`)
const out = await pipeline(
  WAVE,
  (b) => agent(authorPrompt(b), { label: `author:${b.id}`, phase: 'Author', schema: AUTHORED }),
  (a, b) => a && a.lessons.length
    ? agent(reviewPrompt(b, a), { label: `review:${b.id}`, phase: 'Review', schema: REVIEWED }).then(r => ({ a, r }))
    : { a, r: null },
  (x, b) => x && x.a && x.r
    ? agent(fixPrompt(b, x.a, x.r), { label: `fix:${b.id}`, phase: 'Fix', schema: FIXED }).then(f => ({ batch: b.id, lessons: x.a.lessons.map(l => l.id), notDone: x.a.nodes_not_done, caveats: x.a.caveats, findings: x.r.findings.length, high: x.r.findings.filter(q => q.severity === 'high').length, applied: f ? f.applied.length : 0, rejected: f ? f.rejected : [], validators: f ? f.validators : 'fixer failed' }))
    : { batch: b.id, lessons: x && x.a ? x.a.lessons.map(l => l.id) : [], notDone: x && x.a ? x.a.nodes_not_done : b.nodes, caveats: [], findings: 0, high: 0, applied: 0, rejected: [], validators: 'author or reviewer failed' }
)
return out.filter(Boolean)
