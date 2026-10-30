import { describe, expect, it } from 'vitest'
import { createHash } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { Chess } from 'chess.js'
import { chooseMove, encodePlanes, historyFens, legalPolicy, moveIndex, MAIA_POLICY } from './maiaCore'
import { MAIA_MOVES } from './maiaMoves'
import { MAIA_LEVELS } from './maia'

const START = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
const pub = join(__dirname, '..', '..', 'public', 'maia')

describe('maia encoding', () => {
  it('has the 1858-move vocabulary with unique entries', () => {
    expect(MAIA_POLICY).toBe(1858)
    expect(new Set(MAIA_MOVES).size).toBe(1858)
  })
  it('indexes every legal move of a spread of positions (both colours, castling, promotion, en passant)', () => {
    const fens = [START, 'r3k2r/pppq1ppp/2n2n2/3pp3/1b1PP3/2N2N2/PPP1BPPP/R1BQK2R b KQkq - 0 1', '8/P6k/8/8/8/8/6p1/K7 w - - 0 1', 'rnbqkbnr/ppp1p1pp/8/3pPp2/8/8/PPPP1PPP/RNBQKBNR w KQkq f6 0 3']
    for (const fen of fens) {
      const c = new Chess(fen)
      for (const m of c.moves({ verbose: true })) expect(moveIndex(m.from + m.to + (m.promotion ?? ''), c.turn() === 'b')).toBeGreaterThanOrEqual(0)
    }
  })
  it('puts the side to move at the bottom: Black is flipped', () => {
    const w = encodePlanes([START]), b = encodePlanes(['rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 0 1'])
    // plane 0 = our pawns: on rank 2 (index 8..15) in both views, because Black is mirrored
    for (const x of [w, b]) for (let f = 0; f < 8; f++) expect(x[8 + f]).toBe(1)
    expect(w[108 * 64]).toBe(0); expect(b[108 * 64]).toBe(1) // black-to-move plane
    expect(w[111 * 64 + 5]).toBe(1)
    expect(w[104 * 64]).toBe(1) // we can castle
  })
  it('builds history positions from a move list, most recent first', () => {
    const f = historyFens(START, ['e2e4', 'e7e5', 'g1f3'])
    expect(f.length).toBe(4)
    expect(f[0].startsWith('rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2')).toBe(true)
    expect(f[3]).toBe(START)
  })
  it('samples from the policy and can take the best move', () => {
    const rows = legalPolicy(START, Float32Array.from({ length: 1858 }, (_, i) => (i === moveIndex('e2e4', false) ? 5 : i === moveIndex('d2d4', false) ? 4 : 0)))
    expect(rows[0].uci).toBe('e2e4')
    expect(rows.reduce((s, r) => s + r.prob, 0)).toBeCloseTo(1, 6)
    expect(rows.length).toBe(20)
    expect(chooseMove(rows, { best: true })?.uci).toBe('e2e4')
    expect(chooseMove(rows, { random: () => 0 })?.uci).toBe('e2e4')
    expect(chooseMove(rows, { random: () => 0.9999999 })?.uci).not.toBe('e2e4')
  })
})

describe('maia model files', () => {
  it('match the manifest and the level table (size and SHA-256)', () => {
    const manifest = JSON.parse(readFileSync(join(pub, 'manifest.json'), 'utf8')) as { models: { rating: number; file: string; bytes: number; sha256: string }[] }
    expect(manifest.models.map(m => m.rating)).toEqual(MAIA_LEVELS.map(l => l.rating))
    for (const m of manifest.models) {
      const bytes = readFileSync(join(pub, m.file))
      expect(bytes.length).toBe(m.bytes)
      expect(createHash('sha256').update(bytes).digest('hex')).toBe(m.sha256)
      expect(MAIA_LEVELS.find(l => l.rating === m.rating)?.bytes).toBe(m.bytes)
    }
  })
  it.skipIf(!existsSync(join(pub, 'maia1500.onnx')))('runs the 1500 network under node: legal, human-like, matches the published check', async () => {
    const ort = await import('onnxruntime-web/wasm')
    ort.env.wasm.numThreads = 1
    ort.env.wasm.wasmPaths = `file:///${join(__dirname, '..', '..', 'node_modules', 'onnxruntime-web', 'dist').replace(/\\/g, '/')}/`
    const s = await ort.InferenceSession.create(readFileSync(join(pub, 'maia1500.onnx')), { executionProviders: ['wasm'] })
    const run = async (fen: string) => {
      const out = await s.run({ [s.inputNames[0]]: new ort.Tensor('float32', encodePlanes([fen]), [1, 112, 8, 8]) })
      return legalPolicy(fen, out[s.outputNames[0]].data as Float32Array)
    }
    const start = await run(START)
    expect(start[0].uci).toBe('e2e4') // the model card's check: e4 13.1 > d4 12.1 > c4 10.0
    expect(start[1].uci).toBe('d2d4')
    expect(start[0].prob + start[1].prob).toBeGreaterThan(0.7)
    const reply = await run('rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1') // Black: the mirror must be undone
    expect(reply[0].uci).toBe('e7e5')
    const promo = await run('8/P7/8/8/8/8/k6K/8 w - - 0 1')
    expect(promo[0].uci).toBe('a7a8q')
    const hang = await run('rnb1kbnr/pppp1ppp/8/4p3/4P2q/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 1') // legal-only, probabilities sum to one
    expect(hang.reduce((x, r) => x + r.prob, 0)).toBeCloseTo(1, 6)
  }, 60000)
})
