// Prints the headline benchmark table (Markdown) from out/results.json, with ESTIMATED precision.
//
// precision = recall * p / (recall * p + FPrand * (1 - p)), where p is the theme's share of the whole Lichess puzzle database
// (counted by sample.py: it is the "of N" in its output) and FPrand is the false-positive rate on the uniform random sample.
// This answers: "in a Lichess-puzzle-like population, when the detector fires, how often does Lichess carry the theme?"
// It is NOT the precision on arbitrary game positions, where tactics are rarer (see audit.mjs for that).
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const r = JSON.parse(fs.readFileSync(path.join(HERE, 'out/results.json'), 'utf8'))
const TOTAL = 6157341
const SHARE = { fork: 788760, pin: 369437, skewer: 136176, discoveredAttack: 311174, backRankMate: 208093, hangingPiece: 224023, trappedPiece: 67547, doubleCheck: 32210 }
const rows = [
  ['fork', 'fork.works', ['first', 'any']],
  ['fork', 'fork.found', ['any']],
  ['pin', 'pin.abs', ['first', 'any']],
  ['pin', 'pin.absWorks', ['any']],
  ['pin', 'pin.found', ['any']],
  ['skewer', 'skewer.works', ['first', 'any']],
  ['skewer', 'skewer.found', ['any']],
  ['discoveredAttack', 'disc.found', ['first', 'any']],
  ['discoveredAttack', 'disc.works', ['any']],
  ['doubleCheck', 'dbl.found', ['first', 'any', 'anyAll']],
  ['backRankMate', 'back.found', ['last']],
  ['hangingPiece', 'hang.capturedNonPawn', ['first']],
  ['trappedPiece', 'trap.found', ['first', 'any']],
  ['trappedPiece', 'trap.works', ['any']],
]
const f = x => (x === null || Number.isNaN(x) ? 'n/a' : x.toFixed(1))
const out = ['| Lichess theme | Our detector variant | Judged on | n | Recall % | FP/none % | FP/rand % | FP/other % | Est. precision % |', '|---|---|---|---:|---:|---:|---:|---:|---:|']
for (const [theme, v, sels] of rows) {
  for (const s of sels) {
    const x = r.results[theme][`${v}@${s}`]
    const p = SHARE[theme] / TOTAL
    const R = x.recall / 100
    const F = x.fpRand / 100
    const prec = (R * p) / (R * p + F * (1 - p))
    out.push(`| ${theme} | \`${v}\` | ${s} | ${x.n} | ${f(x.recall)} | ${f(x.fpNone)} | ${f(x.fpRand)} | ${f(x.fpOther)} | ${f(100 * prec)} |`)
  }
}
console.log(out.join('\n'))
