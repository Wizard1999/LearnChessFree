// False-positive audit on REAL game positions, plus a deeper independent check of every "works" claim.
//
// Usage: node tools/analysis/detector_eval/audit.mjs [--games 400] [--puzzles 300] [--workers 4]
// Inputs : games.jsonl (games.py: ordinary rated games), sample.jsonl (sample.py: Lichess puzzles)
// Outputs: out/audit.json, out/audit.md, out/audit_samples.jsonl (firings to read by eye), out/audit_claims.jsonl (every
//          works claim, input for engine_check.mjs)
//
// For every move of every audited position (all plies of the games after the opening; all solver moves of the sampled puzzles)
// the detectors run in MOVE MODE. Fire rates are counted per 1000 plies. Each "works === true" claim (fork, pin, skewer,
// discovered attack, trapped piece) is then checked by an independent material search: after the move, the opponent chooses a
// reply, the mover answers, and captures are followed to quiet positions (quiescence); material is counted 1/3/3/5/9. The claim
// is CONFIRMED when the mover's material balance after that search is at least 1 point higher than the balance right after the
// move (or the search finds checkmate). This is a stricter and different test from the detectors' own two-ply check, so a
// confirmation rate below 100% shows where the two-ply logic over-claims (typically a counter-threat or a deeper recapture).
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { Worker, isMainThread, parentPort, workerData } from 'node:worker_threads'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const CHESS = path.resolve(HERE, '../../../app/src/chess')
const OUT = path.join(HERE, 'out')
const imp = p => import(pathToFileURL(path.join(CHESS, p)).href)
const VAL = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 }

function arg(name, def) {
  const i = process.argv.indexOf(`--${name}`)
  return i < 0 ? def : Number(process.argv[i + 1])
}

// ---- tiny material search ---------------------------------------------------------------------------------------------
function mat(c) {
  let s = 0
  for (const row of c.board()) for (const p of row) if (p) s += (p.color === c.turn() ? 1 : -1) * VAL[p.type]
  return s // from the side to move's point of view
}
const order = (a, b) => VAL[b.captured ?? 'p'] - VAL[b.piece] - (VAL[a.captured ?? 'p'] - VAL[a.piece])
function qsearch(c, alpha, beta, d) {
  const inCheck = c.inCheck()
  if (!inCheck) {
    const stand = mat(c)
    if (stand >= beta) return beta
    if (stand > alpha) alpha = stand
    if (d === 0) return stand
  } else if (d === 0) return mat(c)
  let moves = c.moves({ verbose: true })
  if (moves.length === 0) return inCheck ? -1000 : 0
  if (!inCheck) moves = moves.filter(m => m.captured || m.promotion)
  moves.sort(order)
  for (const m of moves) {
    c.move(m)
    const s = -qsearch(c, -beta, -alpha, d - 1)
    c.undo()
    if (s >= beta) return beta
    if (s > alpha) alpha = s
  }
  return alpha
}
function search(c, depth, alpha, beta) {
  if (depth === 0) return qsearch(c, alpha, beta, 4)
  const moves = c.moves({ verbose: true })
  if (moves.length === 0) return c.inCheck() ? -1000 - depth : 0
  moves.sort(order)
  for (const m of moves) {
    c.move(m)
    const s = -search(c, depth - 1, -beta, -alpha)
    c.undo()
    if (s >= beta) return beta
    if (s > alpha) alpha = s
  }
  return alpha
}
/** Material gain (counted points; 1000 = mate) the mover secures after `afterFen` (opponent to move): 2-ply search + quiescence. */
function securedGain(Chess, afterFen) {
  const c = new Chess(afterFen)
  const m0 = -mat(c) // mover's balance right after the move
  const v = -search(c, 2, -2000, 2000) // mover's balance after best play
  return v >= 900 ? 1000 : v - m0
}

// ---- worker ------------------------------------------------------------------------------------------------------------
async function work(items) {
  const board = await imp('board.ts')
  const ctxm = await imp('context.ts')
  const mods = {
    fork: await imp('detectors/fork.ts'), pin: await imp('detectors/pin.ts'), skewer: await imp('detectors/skewer.ts'),
    discovered: await imp('detectors/discovered.ts'), hanging: await imp('detectors/hanging.ts'),
    trapped: await imp('detectors/trapped.ts'), backrank: await imp('detectors/backrank.ts'),
  }
  const { explainFacts } = await imp('explain.ts')
  const idx = await imp('detectors/index.ts')
  const { Chess } = await import(pathToFileURL(path.resolve(CHESS, '../../node_modules/chess.js/dist/esm/chess.js')).href)
  const stat = {}
  const bump = (src, key, field, n = 1) => {
    ;((stat[src] ??= {})[key] ??= { plies: 0, found: 0, works: 0, confirmed: 0 })[field] += n
  }
  const samples = []
  const claims = []
  const count = (concept, verdict) => samples.filter(s => s.concept === concept && s.verdict === verdict).length
  for (const it of items) {
    const before = new Chess(it.fen)
    const m = board.findLegalMove(before, it.move)
    if (!m) continue
    const ctx = ctxm.ctxFromMove(it.fen, before, m)
    const r = {
      fork: mods.fork.forkFromCtx(ctx), pin: mods.pin.pinFromCtx(ctx), skewer: mods.skewer.skewerFromCtx(ctx),
      discovered: mods.discovered.discoveredFromCtx(ctx), trapped: mods.trapped.trappedFromCtx(ctx),
    }
    const hang = mods.hanging.hangingFromCtx(ctx)
    const back = mods.backrank.backRankFromCtx(ctx)
    const dbl = mods.discovered.doubleCheckFromCtx(ctx)
    const abs = r.pin.details.filter(d => d.kind === 'absolute')
    const flags = {
      fork: [r.fork.found, r.fork.works],
      pin: [r.pin.found, r.pin.works],
      'pin.absolute': [abs.length > 0, abs.some(d => d.works)],
      skewer: [r.skewer.found, r.skewer.works],
      discovered: [r.discovered.found, r.discovered.works],
      trapped: [r.trapped.found, r.trapped.works],
      hangingCapture: [hang.capturedHanging !== null && hang.capturedHanging.piece.type !== 'p', false],
      backRankMate: [back.details.some(d => d.mate), false],
      doubleCheck: [dbl.found, false],
    }
    let gain = null
    bump(it.src, 'fork', 'plies')
    for (const [key, [found, works]] of Object.entries(flags)) {
      if (found) bump(it.src, key, 'found')
      if (works) {
        bump(it.src, key, 'works')
        claims.push({ src: it.src, concept: key, fen: it.fen, move: it.move, san: ctx.info.san })
        gain ??= securedGain(Chess, ctx.info.fenAfter)
        if (gain >= 1) bump(it.src, key, 'confirmed')
        else if (count(key, 'not-confirmed') < 6) samples.push({ src: it.src, concept: key, verdict: 'not-confirmed', fen: it.fen, san: ctx.info.san, deepGain: gain })
      }
      if (found && it.src === 'games' && count(key, 'fired') < 8 && Math.random() < 0.1) {
        const concept = { 'pin.absolute': 'pin', hangingCapture: 'hangingPiece', backRankMate: 'backRank', discovered: 'discoveredAttack', trapped: 'trappedPiece' }[key] ?? key
        const text = explainFacts(idx.detectConcepts(it.fen, it.move), { only: [concept] }).map(e => e.text).join(' // ')
        samples.push({ src: it.src, concept: key, verdict: 'fired', works, fen: it.fen, san: ctx.info.san, text })
      }
    }
  }
  return { stat, samples, claims }
}

if (!isMainThread) {
  parentPort.postMessage(await work(workerData.items))
  process.exit(0)
}

// ---- main --------------------------------------------------------------------------------------------------------------
const nGames = arg('games', 400)
const nPer = arg('puzzles', 300)
const nWorkers = arg('workers', 4)
const { Chess } = await import(pathToFileURL(path.resolve(CHESS, '../../node_modules/chess.js/dist/esm/chess.js')).href)
const items = []
const games = fs.readFileSync(path.join(HERE, 'games.jsonl'), 'utf8').split('\n').filter(Boolean).slice(0, nGames).map(l => JSON.parse(l))
for (const g of games) {
  const c = new Chess()
  for (let i = 0; i < g.sans.length; i++) {
    const fen = c.fen()
    try { c.move(g.sans[i]) } catch { break }
    if (i >= 8) items.push({ src: 'games', fen, move: g.sans[i] }) // skip the first 4 moves of each side (opening book)
  }
}
const sample = fs.readFileSync(path.join(HERE, 'sample.jsonl'), 'utf8').split('\n').filter(Boolean).map(l => JSON.parse(l))
const take = { random: nPer * 2, 'theme:fork': nPer, 'theme:pin': nPer, 'theme:skewer': nPer, 'theme:discoveredAttack': nPer, 'theme:trappedPiece': nPer }
const got = {}
for (const p of sample) {
  const b = p.buckets.find(b => (got[b] ?? 0) < (take[b] ?? 0))
  if (!b) continue
  got[b] = (got[b] ?? 0) + 1
  const src = b === 'random' ? 'puzzles-random' : 'puzzles-tactic'
  const c = new Chess(p.fen)
  c.move({ from: p.moves[0].slice(0, 2), to: p.moves[0].slice(2, 4), promotion: p.moves[0][4] })
  for (let i = 1; i < p.moves.length; i += 2) {
    items.push({ src, fen: c.fen(), move: p.moves[i] })
    c.move({ from: p.moves[i].slice(0, 2), to: p.moves[i].slice(2, 4), promotion: p.moves[i][4] })
    if (i + 1 < p.moves.length) c.move({ from: p.moves[i + 1].slice(0, 2), to: p.moves[i + 1].slice(2, 4), promotion: p.moves[i + 1][4] })
  }
}
console.log(`auditing ${items.length} moves (${items.filter(i => i.src === 'games').length} game plies from ${games.length} games)`)
const slices = Array.from({ length: nWorkers }, () => [])
items.forEach((it, i) => slices[i % nWorkers].push(it))
const t0 = Date.now()
const parts = await Promise.all(slices.map(sl => new Promise((res, rej) => {
  const w = new Worker(fileURLToPath(import.meta.url), { workerData: { items: sl } })
  w.on('message', res)
  w.on('error', rej)
})))
const total = {}
const samples = []
const claims = []
for (const p of parts) {
  samples.push(...p.samples)
  claims.push(...p.claims)
  for (const [src, o] of Object.entries(p.stat)) {
    for (const [k, v] of Object.entries(o)) {
      const t = ((total[src] ??= {})[k] ??= { plies: 0, found: 0, works: 0, confirmed: 0 })
      for (const [f, n] of Object.entries(v)) t[f] += n
    }
  }
}
const lines = ['| Population | Detector | plies | found /1000 plies | works /1000 plies | works claims confirmed by search |', '|---|---|---:|---:|---:|---:|']
for (const [src, o] of Object.entries(total)) {
  const plies = o.fork.plies
  for (const [k, v] of Object.entries(o)) {
    const conf = v.works > 0 ? `${v.confirmed}/${v.works} (${((100 * v.confirmed) / v.works).toFixed(0)}%)` : '-'
    lines.push(`| ${src} | ${k} | ${plies} | ${((1000 * v.found) / plies).toFixed(1)} | ${v.works ? ((1000 * v.works) / plies).toFixed(1) : '-'} | ${conf} |`)
  }
}
fs.mkdirSync(OUT, { recursive: true })
fs.writeFileSync(path.join(OUT, 'audit.json'), JSON.stringify(total, null, 1))
fs.writeFileSync(path.join(OUT, 'audit.md'), lines.join('\n') + '\n')
fs.writeFileSync(path.join(OUT, 'audit_claims.jsonl'), claims.map(s => JSON.stringify(s)).join('\n') + '\n')
fs.writeFileSync(path.join(OUT, 'audit_samples.jsonl'), samples.map(s => JSON.stringify(s)).join('\n') + '\n')
console.log(`done in ${((Date.now() - t0) / 1000).toFixed(0)} s`)
console.log(lines.join('\n'))
