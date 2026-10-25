// Differential benchmark: our concept detectors vs. Lichess puzzle themes (labels made by Lichess's own detectors).
//
// Usage (from anywhere; Node >= 22.18 or 24, which runs the .ts sources directly):
//   node tools/analysis/detector_eval/eval.mjs [--n 4000] [--workers 4] [--only fork,pin,...] [--reuse] [--dump]
//
// Input : tools/analysis/detector_eval/sample.jsonl   (made by sample.py)
// Output: tools/analysis/detector_eval/out/records.jsonl   one line per puzzle with every detector flag per solver move
//         tools/analysis/detector_eval/out/results.json    the aggregated table
//         tools/analysis/detector_eval/out/results.md      the same table as Markdown
//
// Protocol (Lichess puzzle CSV convention): FEN is the position BEFORE the opponent's first move; Moves[0] is the
// opponent's move; Moves[1], Moves[3], ... are the SOLVER's moves. We apply Moves[0], then for each solver move we ask
// every detector about that move in the position it is played from. For each theme we report
//   first : the detector fires on the first solver move (Moves[1])
//   any   : it fires on at least one solver move EXCEPT the final one (the last solver move is usually the capture/mate
//           that cashes in the tactic; Lichess's own tags for fork/pin/skewer/discovery are about earlier moves)
//   anyAll: it fires on at least one solver move including the final one
//   last  : it fires on the final solver move (this is the relevant one for backRankMate)
// Recall = share of puzzles carrying the theme where the detector fires. False-positive rate = share of puzzles NOT
// carrying the theme where it fires, measured on three populations:
//   FP/none  : the "none" bucket (puzzles carrying none of the eight benchmark themes), uniform sample
//   FP/rand  : the "random" bucket minus puzzles that carry the theme, uniform sample of the whole database
//   FP/other : every sampled puzzle without the theme, i.e. also puzzles drawn for the other seven themes (biased
//              towards tactics-rich positions, so tactics that Lichess did not tag but are really there inflate it)

import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { Worker, isMainThread, parentPort, workerData } from 'node:worker_threads'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const CHESS = path.resolve(HERE, '../../../app/src/chess')
const OUT = path.join(HERE, 'out')
const SAMPLE = path.join(HERE, 'sample.jsonl')
const imp = p => import(pathToFileURL(path.join(CHESS, p)).href)

const ALL_DETECTORS = ['fork', 'pin', 'skewer', 'discovered', 'doubleCheck', 'hanging', 'trapped', 'backRank']

/** Which variant(s) answer which Lichess theme. `moveSel` = which solver move(s) the variant is judged on. */
const THEME_VARIANTS = {
  fork: ['fork.found', 'fork.works'],
  pin: ['pin.found', 'pin.works', 'pin.new', 'pin.exploit', 'pin.abs', 'pin.absWorks', 'pin.shield'],
  skewer: ['skewer.found', 'skewer.works'],
  discoveredAttack: ['disc.found', 'disc.worthy', 'disc.works', 'disc.check'],
  doubleCheck: ['dbl.found'],
  backRankMate: ['back.found'],
  hangingPiece: ['hang.captured', 'hang.capturedNonPawn', 'hang.found'],
  trappedPiece: ['trap.found', 'trap.works'],
}

// ---------------------------------------------------------------------------------------------------------------------
// worker: compute flags for a slice of puzzles
// ---------------------------------------------------------------------------------------------------------------------
async function flagsForMove(mods, only, fen, before, uci) {
  const { findLegalMove } = mods.board
  const m = findLegalMove(before, uci)
  if (!m) return null
  const ctx = mods.context.ctxFromMove(fen, before, m)
  const f = { san: ctx.info.san, check: ctx.info.isCheck, mate: ctx.info.isCheckmate }
  const t = {}
  const time = (k, fn) => {
    const t0 = performance.now()
    const r = fn()
    t[k] = (t[k] ?? 0) + (performance.now() - t0)
    return r
  }
  if (only.has('fork')) {
    const r = time('fork', () => mods.fork.forkFromCtx(ctx))
    f['fork.found'] = r.found
    f['fork.works'] = r.works
  }
  if (only.has('pin')) {
    const r = time('pin', () => mods.pin.pinFromCtx(ctx))
    f['pin.found'] = r.found
    f['pin.works'] = r.works
    f['pin.new'] = r.details.some(d => d.isNew)
    f['pin.exploit'] = r.details.some(d => d.attacksPinned || d.shieldsMovedPiece)
    f['pin.shield'] = r.details.some(d => d.shieldsMovedPiece)
    f['pin.abs'] = r.details.some(d => d.kind === 'absolute')
    f['pin.absWorks'] = r.details.some(d => d.kind === 'absolute' && d.works)
  }
  if (only.has('skewer')) {
    const r = time('skewer', () => mods.skewer.skewerFromCtx(ctx))
    f['skewer.found'] = r.found
    f['skewer.works'] = r.works
  }
  if (only.has('discovered')) {
    const r = time('discovered', () => mods.discovered.discoveredFromCtx(ctx))
    f['disc.found'] = r.found
    f['disc.worthy'] = r.details.some(d => d.worthy)
    f['disc.works'] = r.works
    f['disc.check'] = r.details.some(d => d.check)
  }
  if (only.has('doubleCheck')) {
    const r = time('doubleCheck', () => mods.discovered.doubleCheckFromCtx(ctx))
    f['dbl.found'] = r.found
  }
  if (only.has('hanging')) {
    const r = time('hanging', () => mods.hanging.hangingFromCtx(ctx))
    f['hang.captured'] = r.capturedHanging !== null
    f['hang.capturedNonPawn'] = r.capturedHanging !== null && r.capturedHanging.piece.type !== 'p'
    f['hang.found'] = r.found
  }
  if (only.has('trapped')) {
    const r = time('trapped', () => mods.trapped.trappedFromCtx(ctx))
    f['trap.found'] = r.found
    f['trap.works'] = r.works
  }
  if (only.has('backRank')) {
    const r = time('backRank', () => mods.backrank.backRankFromCtx(ctx))
    f['back.found'] = r.found
  }
  f._t = t
  return f
}

async function processSlice(puzzles, only) {
  const mods = {
    board: await imp('board.ts'),
    context: await imp('context.ts'),
    fork: await imp('detectors/fork.ts'),
    pin: await imp('detectors/pin.ts'),
    skewer: await imp('detectors/skewer.ts'),
    discovered: await imp('detectors/discovered.ts'),
    hanging: await imp('detectors/hanging.ts'),
    trapped: await imp('detectors/trapped.ts'),
    backrank: await imp('detectors/backrank.ts'),
  }
  const { Chess } = await import(pathToFileURL(path.resolve(CHESS, '../../node_modules/chess.js/dist/esm/chess.js')).href)
  const out = []
  for (const p of puzzles) {
    const rec = { id: p.id, themes: p.themes, buckets: p.buckets, moves: [], error: null }
    try {
      const c = new Chess(p.fen)
      c.move({ from: p.moves[0].slice(0, 2), to: p.moves[0].slice(2, 4), promotion: p.moves[0][4] })
      for (let i = 1; i < p.moves.length; i += 2) {
        const fenNow = c.fen()
        const before = new Chess(fenNow)
        const f = await flagsForMove(mods, only, fenNow, before, p.moves[i])
        if (!f) { rec.error = `illegal solver move ${p.moves[i]}`; break }
        rec.moves.push(f)
        c.move({ from: p.moves[i].slice(0, 2), to: p.moves[i].slice(2, 4), promotion: p.moves[i][4] })
        if (i + 1 < p.moves.length) c.move({ from: p.moves[i + 1].slice(0, 2), to: p.moves[i + 1].slice(2, 4), promotion: p.moves[i + 1][4] })
      }
    } catch (e) {
      rec.error = String(e && e.message ? e.message : e)
    }
    out.push(rec)
  }
  return out
}

if (!isMainThread) {
  const recs = await processSlice(workerData.puzzles, new Set(workerData.only))
  parentPort.postMessage(recs)
  process.exit(0)
}

// ---------------------------------------------------------------------------------------------------------------------
// main
// ---------------------------------------------------------------------------------------------------------------------
function arg(name, def) {
  const i = process.argv.indexOf(`--${name}`)
  if (i < 0) return def
  const v = process.argv[i + 1]
  return v === undefined || v.startsWith('--') ? true : v
}

const nPer = Number(arg('n', 4000))
const nWorkers = Number(arg('workers', Math.min(4, os.cpus().length)))
const only = new Set(String(arg('only', ALL_DETECTORS.join(','))).split(','))
const reuse = Boolean(arg('reuse', false))

fs.mkdirSync(OUT, { recursive: true })
const RECORDS = path.join(OUT, 'records.jsonl')

let records
if (reuse && fs.existsSync(RECORDS)) {
  records = fs.readFileSync(RECORDS, 'utf8').split('\n').filter(Boolean).map(l => JSON.parse(l))
  console.log(`reusing ${records.length} records from ${RECORDS}`)
} else {
  // take the first nPer puzzles of every bucket (the sample file is already a uniform random sample per bucket)
  const all = fs.readFileSync(SAMPLE, 'utf8').split('\n').filter(Boolean).map(l => JSON.parse(l))
  const taken = new Map()
  const counts = {}
  for (const p of all) {
    const keep = p.buckets.filter(b => (counts[b] ?? 0) < nPer)
    if (keep.length === 0) continue
    for (const b of keep) counts[b] = (counts[b] ?? 0) + 1
    taken.set(p.id, p)
  }
  const puzzles = [...taken.values()]
  console.log(`evaluating ${puzzles.length} puzzles with ${nWorkers} workers; detectors: ${[...only].join(',')}`)
  const t0 = Date.now()
  const slices = Array.from({ length: nWorkers }, () => [])
  puzzles.forEach((p, i) => slices[i % nWorkers].push(p))
  let done = 0
  const parts = await Promise.all(slices.map(slice => new Promise((resolve, reject) => {
    const w = new Worker(fileURLToPath(import.meta.url), { workerData: { puzzles: slice, only: [...only] } })
    w.on('message', m => { done += m.length; resolve(m) })
    w.on('error', reject)
  })))
  records = parts.flat()
  console.log(`done in ${((Date.now() - t0) / 1000).toFixed(0)} s`)
  fs.writeFileSync(RECORDS, records.map(r => JSON.stringify(r)).join('\n') + '\n')
}

// ---------------------------------------------------------------------------------------------------------------------
// aggregate
// ---------------------------------------------------------------------------------------------------------------------
const errors = records.filter(r => r.error).length
const usable = records.filter(r => !r.error && r.moves.length > 0)

function fires(rec, variant, sel) {
  const ms = rec.moves
  if (sel === 'first') return ms[0][variant] === true
  if (sel === 'last') return ms[ms.length - 1][variant] === true
  if (sel === 'any') return ms.slice(0, ms.length > 1 ? ms.length - 1 : 1).some(m => m[variant] === true)
  return ms.some(m => m[variant] === true) // anyAll
}
const pct = (a, b) => (b === 0 ? NaN : (100 * a) / b)
const fmt = x => (Number.isNaN(x) ? '  n/a' : x.toFixed(1).padStart(5))

const results = {}
const lines = []
lines.push(`| Theme | Variant | Move | n(theme) | Recall % | FP/none % | FP/rand % | FP/other % |`)
lines.push(`|---|---|---|---:|---:|---:|---:|---:|`)
for (const [theme, variants] of Object.entries(THEME_VARIANTS)) {
  const pos = usable.filter(r => r.buckets.includes(`theme:${theme}`) && r.themes.includes(theme))
  const none = usable.filter(r => r.buckets.includes('none'))
  const rand = usable.filter(r => r.buckets.includes('random') && !r.themes.includes(theme))
  const other = usable.filter(r => !r.themes.includes(theme))
  results[theme] = {}
  for (const v of variants) {
    for (const sel of ['first', 'any', 'anyAll', 'last']) {
      const hit = pos.filter(r => fires(r, v, sel)).length
      const fpn = none.filter(r => fires(r, v, sel)).length
      const fpr = rand.filter(r => fires(r, v, sel)).length
      const fpo = other.filter(r => fires(r, v, sel)).length
      const row = { n: pos.length, recall: pct(hit, pos.length), fpNone: pct(fpn, none.length), fpRand: pct(fpr, rand.length), fpOther: pct(fpo, other.length) }
      results[theme][`${v}@${sel}`] = row
      lines.push(`| ${theme} | ${v} | ${sel} | ${pos.length} | ${fmt(row.recall)} | ${fmt(row.fpNone)} | ${fmt(row.fpRand)} | ${fmt(row.fpOther)} |`)
    }
  }
}
fs.writeFileSync(path.join(OUT, 'results.json'), JSON.stringify({ puzzles: records.length, usable: usable.length, errors, results }, null, 1))
fs.writeFileSync(path.join(OUT, 'results.md'), lines.join('\n') + '\n')
console.log(`puzzles ${records.length}, usable ${usable.length}, errors ${errors}`)
console.log(lines.join('\n'))
