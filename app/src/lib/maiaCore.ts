// Maia core: pure functions with no network, worker or runtime in them, so they are unit-tested.
// Maia (CSSLab, GPL-3.0) is a Leela-Chess-Zero-format network trained on human games of one rating band. It takes the
// classical 112-plane input and returns 1858 move logits; sampling from those (not taking the best) gives human-style play.
import { Chess } from 'chess.js'
import { MAIA_MOVES } from './maiaMoves'

export const MAIA_PLANES = 112
export const MAIA_POLICY = MAIA_MOVES.length // 1858

const MOVE_INDEX = new Map<string, number>(MAIA_MOVES.map((m, i) => [m, i]))
const PIECE_ORDER = ['p', 'n', 'b', 'r', 'q', 'k'] as const

interface Placed { type: string; color: 'w' | 'b'; rank: number; file: number } // rank 0 = rank 1

function placement(fen: string): Placed[] {
  const out: Placed[] = []
  const rows = fen.split(' ')[0].split('/')
  rows.forEach((row, i) => {
    let file = 0
    for (const ch of row) {
      if (/\d/.test(ch)) { file += Number(ch); continue }
      out.push({ type: ch.toLowerCase(), color: ch === ch.toLowerCase() ? 'b' : 'w', rank: 7 - i, file })
      file++
    }
  })
  return out
}

/**
 * Network input for a position. `fens[0]` is the position to move from, then up to seven earlier positions (most recent first).
 * Missing history is left empty (this reproduces the published check, start position: e4 13.1, d4 12.1, c4 10.0). `fillHistory` repeats a lone FEN eight times.
 * The board is seen from the side to move: for Black it is flipped top to bottom and "ours" is Black.
 * Not encoded: the repetition planes (left zero).
 */
export function encodePlanes(fens: string[], opts: { fillHistory?: boolean } = {}): Float32Array {
  const cur = fens[0]
  const parts = cur.split(' ')
  const black = parts[1] === 'b'
  const out = new Float32Array(MAIA_PLANES * 64)
  const history = fens.length === 1 && (opts.fillHistory ?? false) ? Array<string>(8).fill(cur) : fens.slice(0, 8)
  history.forEach((f, h) => {
    for (const p of placement(f)) {
      const ours = (p.color === 'b') === black
      const rank = black ? 7 - p.rank : p.rank
      const plane = h * 13 + (ours ? 0 : 6) + PIECE_ORDER.indexOf(p.type as typeof PIECE_ORDER[number])
      out[plane * 64 + rank * 8 + p.file] = 1
    }
  })
  const castling = parts[2] ?? '-'
  const us = black ? 'kq' : 'KQ', them = black ? 'KQ' : 'kq' // kingside letter first
  const flags = [castling.includes(us[1]), castling.includes(us[0]), castling.includes(them[1]), castling.includes(them[0])] // ours Q, ours K, theirs Q, theirs K
  flags.forEach((on, i) => { if (on) out.fill(1, (104 + i) * 64, (105 + i) * 64) })
  if (black) out.fill(1, 108 * 64, 109 * 64)
  const rule50 = Number(parts[4] ?? 0)
  if (rule50 > 0) out.fill(rule50, 109 * 64, 110 * 64)
  out.fill(1, 111 * 64, 112 * 64)
  return out
}

const flipSquare = (sq: string) => sq[0] + String(9 - Number(sq[1]))

/** Index of a UCI move (standard chess notation, real board) in the policy vector, or -1. */
export function moveIndex(uci: string, black: boolean): number {
  let from = uci.slice(0, 2), to = uci.slice(2, 4)
  if (black) { from = flipSquare(from); to = flipSquare(to) }
  const promo = uci.length > 4 ? uci[4] : ''
  // Leela writes a queen promotion as the plain move and under-promotions with a suffix; the list holds q, r, b suffixes.
  // The convention used here was settled by running the network (see maiaCore.test.ts): knight promotion is the plain move.
  const key = promo === 'n' ? from + to : from + to + promo
  return MOVE_INDEX.get(key) ?? -1
}

export interface MaiaMove { uci: string; san: string; logit: number; prob: number }

/** Legal moves with probabilities: a softmax over the legal moves' logits only, at the given temperature, best first. */
export function legalPolicy(fen: string, logits: ArrayLike<number>, temperature = 1): MaiaMove[] {
  const chess = new Chess(fen)
  const black = chess.turn() === 'b'
  const rows: MaiaMove[] = []
  for (const m of chess.moves({ verbose: true })) {
    const uci = m.from + m.to + (m.promotion ?? '')
    const idx = moveIndex(uci, black)
    if (idx < 0) continue
    rows.push({ uci, san: m.san, logit: logits[idx], prob: 0 })
  }
  if (!rows.length) return rows
  const t = Math.max(0.05, temperature)
  const mx = Math.max(...rows.map(r => r.logit))
  let sum = 0
  for (const r of rows) { r.prob = Math.exp((r.logit - mx) / t); sum += r.prob }
  for (const r of rows) r.prob /= sum
  return rows.sort((a, b) => b.prob - a.prob)
}

/** Choose a move: by default sample from the policy (random() in [0,1)); `best` takes the single most likely move. */
export function chooseMove(rows: MaiaMove[], opts: { best?: boolean; random?: () => number } = {}): MaiaMove | null {
  if (!rows.length) return null
  if (opts.best) return rows[0]
  let r = (opts.random ?? Math.random)()
  for (const row of rows) { r -= row.prob; if (r < 0) return row }
  return rows[rows.length - 1]
}

/** FENs of the last positions (most recent first, current included), from a game's move list, for the history planes. */
export function historyFens(startFen: string, ucis: string[], max = 8): string[] {
  const c = new Chess(startFen)
  const fens = [c.fen()]
  for (const u of ucis) {
    try { c.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] }) } catch { break }
    fens.push(c.fen())
  }
  return fens.reverse().slice(0, max)
}
