// Browser-side version of the validator's `material_after_move` check (tools/validate.py), used by the contrast lab.
// Engine results are evidence under recorded limits, not proofs.
import { Chess } from 'chess.js'
import type { Engine } from '../engine'

const VALUE: Record<string, number> = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 }
export function material(chess: Chess, color: 'w' | 'b'): number {
  let s = 0
  for (const row of chess.board()) for (const sq of row) if (sq && sq.color === color) s += VALUE[sq.type]
  return s
}

export interface Judgement {
  legal: boolean
  mate: boolean
  mateIn?: number
  /** Net material change for the mover along the engine's best-defence line, measured at its last capture. */
  delta: number
  line: string[] // UCI, starting with the move itself
  deadDraw: boolean
  depth: number
  note?: string
}

export async function judgeMove(engine: Engine, fen: string, uci: string, depth = 13): Promise<Judgement> {
  const base = new Chess(fen)
  const mover = base.turn()
  const start = material(base, mover) - material(base, mover === 'w' ? 'b' : 'w')
  let mv
  try { mv = base.move({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] }) } catch { return { legal: false, mate: false, delta: 0, line: [], deadDraw: false, depth, note: 'The move is not legal in this position.' } }
  if (base.isCheckmate()) return { legal: true, mate: true, mateIn: 1, delta: 0, line: [uci], deadDraw: false, depth }
  if (base.isGameOver()) return { legal: true, mate: false, delta: 0, line: [uci], deadDraw: base.isInsufficientMaterial(), depth, note: 'The game ends immediately after this move.' }
  void mv
  const lines = await engine.analyse(base.fen(), { depth })
  const top = lines[0]
  const pv = top ? top.pv : []
  const full = [uci, ...pv]
  const replay = new Chess(fen)
  let delta = 0
  let played = 0
  for (const u of full.slice(0, 12)) {
    try {
      const m = replay.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] })
      played++
      if (m.captured || replay.isCheckmate()) delta = material(replay, mover) - material(replay, mover === 'w' ? 'b' : 'w') - start
    } catch { break }
  }
  const mate = !!top && top.kind === 'mate' && top.value < 0 // the opponent (side to move after our move) is getting mated
  return { legal: true, mate, mateIn: mate ? 1 + Math.abs(top!.value) : undefined, delta, line: full.slice(0, Math.max(1, played)), deadDraw: replay.isInsufficientMaterial(), depth }
}

/** A short plain-language list of what differs between two FEN piece placements. */
export function describeChanges(before: string, after: string): string[] {
  const grid = (placement: string) => {
    const m = new Map<string, string>()
    placement.split('/').forEach((row, ri) => { let f = 0; for (const ch of row) { if (/\d/.test(ch)) f += Number(ch); else { m.set('abcdefgh'[f] + (8 - ri), ch); f++ } } })
    return m
  }
  const names: Record<string, string> = { p: 'pawn', n: 'knight', b: 'bishop', r: 'rook', q: 'queen', k: 'king' }
  const nm = (c: string) => `${c === c.toUpperCase() ? 'White' : 'Black'} ${names[c.toLowerCase()]}`
  const a = grid(before.split(' ')[0]), b = grid(after.split(' ')[0])
  const out: string[] = []
  const removed: [string, string][] = [], added: [string, string][] = []
  for (const [sq, c] of a) if (b.get(sq) !== c) removed.push([sq, c])
  for (const [sq, c] of b) if (a.get(sq) !== c) added.push([sq, c])
  const used = new Set<number>()
  for (const [sq, c] of removed) {
    const j = added.findIndex(([, d], k) => d === c && !used.has(k))
    if (j >= 0) { used.add(j); out.push(`${nm(c)} moved from ${sq} to ${added[j][0]}`) } else out.push(`${nm(c)} on ${sq} was removed`)
  }
  added.forEach(([sq, c], k) => { if (!used.has(k)) out.push(`${nm(c)} was added on ${sq}`) })
  return out
}
