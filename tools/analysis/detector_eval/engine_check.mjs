// Independent check of the detectors' "works" claims with Stockfish (npm stockfish 19 lite, run under Node as a child process).
//
// Usage: node tools/analysis/detector_eval/engine_check.mjs [--depth 14] [--max 400] [--engines 4]
// Input : out/audit_claims.jsonl (written by audit.mjs: every move on which a detector claimed that a tactic works)
// Output: out/engine_check.md, out/engine_check.json
//
// For each claim the position AFTER the claimed move is analysed to a fixed depth. The engine's principal variation (best play for
// both sides) is played out; the PV is cut at its last quiet move (so an exchange is not judged half-way). The claim is CONFIRMED
// when the mover's counted material (1/3/3/5/9) at that point is at least 1 point higher than right after the claimed move, or the
// engine reports a forced mate for the mover. This is independent of both the detectors' two-ply check and of the material search
// used to gate `works`, so it measures how often a "works" claim is a real, forced material gain. It does not test whether the move
// was the best move, only whether the claimed gain materialises against best defence.
import fs from 'node:fs'
import path from 'node:path'
import { spawn } from 'node:child_process'
import { fileURLToPath, pathToFileURL } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(HERE, 'out')
const SF = path.resolve(HERE, '../../../app/node_modules/stockfish/bin/stockfish-19-lite-single.js')
const { Chess } = await import(pathToFileURL(path.resolve(HERE, '../../../app/node_modules/chess.js/dist/esm/chess.js')).href)
const VAL = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 }
const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i < 0 ? d : Number(process.argv[i + 1]) }
const depth = arg('depth', 14)
const maxPer = arg('max', 400)
const nEngines = arg('engines', 4)

class Engine {
  constructor() {
    this.p = spawn('node', [SF], { stdio: ['pipe', 'pipe', 'ignore'] })
    this.buf = ''
    this.waiters = []
    this.p.stdout.on('data', d => {
      this.buf += d
      const lines = this.buf.split('\n')
      this.buf = lines.pop()
      for (const l of lines) for (const w of [...this.waiters]) w(l.trim())
    })
    this.p.stdin.write('uci\nsetoption name Threads value 1\nsetoption name Hash value 16\nisready\n')
  }
  ready() { return this.waitFor(l => l === 'readyok') }
  waitFor(pred) {
    return new Promise(res => {
      const w = l => { if (pred(l)) { this.waiters.splice(this.waiters.indexOf(w), 1); res(l) } }
      this.waiters.push(w)
    })
  }
  async analyse(fen, d) {
    let last = null
    const collect = l => { if (l.startsWith('info') && / pv /.test(l) && / score /.test(l)) last = l }
    this.waiters.push(collect)
    this.p.stdin.write(`ucinewgame\nposition fen ${fen}\ngo depth ${d}\n`)
    await this.waitFor(l => l.startsWith('bestmove'))
    this.waiters.splice(this.waiters.indexOf(collect), 1)
    if (!last) return null
    const sc = last.match(/score (cp|mate) (-?\d+)/)
    return { kind: sc[1], value: Number(sc[2]), pv: last.split(' pv ')[1].trim().split(' ') }
  }
  quit() { this.p.kill() }
}

function material(c, color) {
  let s = 0
  for (const row of c.board()) for (const p of row) if (p) s += (p.color === color ? 1 : -1) * VAL[p.type]
  return s
}

async function check(engine, claim) {
  const c = new Chess(claim.fen)
  const mv = c.move(claim.move.length >= 4 && /^[a-h][1-8][a-h][1-8][qrbn]?$/.test(claim.move) ? { from: claim.move.slice(0, 2), to: claim.move.slice(2, 4), promotion: claim.move[4] } : claim.move)
  const mover = mv.color
  const m0 = material(c, mover)
  if (c.isCheckmate()) return { ok: true, why: 'checkmate', gain: 1000 }
  if (c.moves().length === 0) return { ok: false, why: 'stalemate', gain: 0 }
  const r = await engine.analyse(c.fen(), depth)
  if (!r) return { ok: false, why: 'no-engine-output', gain: 0 }
  if (r.kind === 'mate' && r.value < 0) return { ok: true, why: 'forced-mate', gain: 1000 } // stm (the opponent) is mated
  // play the PV, cut at the last quiet move
  const played = []
  for (const u of r.pv) {
    try { played.push(c.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] })) } catch { break }
  }
  let end = played.length
  while (end > 0 && played[end - 1].captured) end--
  if (end === 0) end = played.length
  const c2 = new Chess(claim.fen)
  c2.move(claim.move.length >= 4 && /^[a-h][1-8][a-h][1-8][qrbn]?$/.test(claim.move) ? { from: claim.move.slice(0, 2), to: claim.move.slice(2, 4), promotion: claim.move[4] } : claim.move)
  for (let i = 0; i < end; i++) c2.move(played[i].san)
  const gain = material(c2, mover) - m0
  return { ok: gain >= 1, why: gain >= 1 ? 'material' : 'no-gain', gain, pv: played.slice(0, end).map(m => m.san).join(' ') }
}

const claimsAll = fs.readFileSync(path.join(OUT, 'audit_claims.jsonl'), 'utf8').split('\n').filter(Boolean).map(l => JSON.parse(l))
const per = {}
const claims = []
for (const cl of claimsAll) {
  const k = `${cl.src}|${cl.concept}`
  per[k] = (per[k] ?? 0) + 1
  if (per[k] <= maxPer) claims.push(cl)
}
console.log(`checking ${claims.length} of ${claimsAll.length} claims with Stockfish depth ${depth} on ${nEngines} engines`)
const engines = Array.from({ length: nEngines }, () => new Engine())
await Promise.all(engines.map(e => e.ready()))
const results = []
const t0 = Date.now()
await Promise.all(engines.map(async (e, ei) => {
  for (let i = ei; i < claims.length; i += nEngines) {
    const r = await check(e, claims[i])
    results.push({ ...claims[i], ...r })
  }
}))
engines.forEach(e => e.quit())
const agg = {}
for (const r of results) {
  const k = `${r.src}|${r.concept}`
  const a = (agg[k] ??= { n: 0, ok: 0, bad: [] })
  a.n++
  if (r.ok) a.ok++
  else if (a.bad.length < 5) a.bad.push({ fen: r.fen, san: r.san, why: r.why, gain: r.gain, pv: r.pv })
}
const lines = [`Stockfish depth ${depth}; claim confirmed = mover's counted material rises by >= 1 along the engine's principal variation (cut at its last quiet move), or forced mate.`, '', '| Population | Detector (works claim) | claims checked | confirmed by Stockfish |', '|---|---|---:|---:|']
for (const [k, a] of Object.entries(agg).sort()) {
  const [src, concept] = k.split('|')
  lines.push(`| ${src} | ${concept} | ${a.n} | ${a.ok} (${((100 * a.ok) / a.n).toFixed(0)}%) |`)
}
fs.writeFileSync(path.join(OUT, 'engine_check.md'), lines.join('\n') + '\n')
fs.writeFileSync(path.join(OUT, 'engine_check.json'), JSON.stringify(agg, null, 1))
console.log(`done in ${((Date.now() - t0) / 1000).toFixed(0)} s`)
console.log(lines.join('\n'))
