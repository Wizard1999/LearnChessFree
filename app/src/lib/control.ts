// Square control: for every square, which white and which black pieces attack it (for an occupied square, the attackers of the other
// colour are its attackers and those of the same colour are its defenders). Exact, from the rules (chess.js); pins and the king's
// safety are ignored on purpose, as in the usual "count the attackers" habit, and the overlay says so.
import { Chess, type Square } from 'chess.js'

export interface SquareControl { square: string; white: string[]; black: string[]; net: number; piece: string | null }

const FILES = 'abcdefgh'
export const ALL_SQUARES: string[] = Array.from({ length: 64 }, (_, i) => `${FILES[i % 8]}${Math.floor(i / 8) + 1}`)

const label = (chess: Chess, sq: string) => { const p = chess.get(sq as Square); return p ? `${p.color === 'w' ? '' : ''}${p.type.toUpperCase()}${sq}` : sq }

export function controlMap(fen: string): Map<string, SquareControl> {
  const chess = new Chess(fen)
  const out = new Map<string, SquareControl>()
  for (const sq of ALL_SQUARES) {
    const w = chess.attackers(sq as Square, 'w'), b = chess.attackers(sq as Square, 'b')
    const p = chess.get(sq as Square)
    out.set(sq, { square: sq, white: w.map(s => label(chess, s)), black: b.map(s => label(chess, s)), net: w.length - b.length, piece: p ? `${p.color === 'w' ? 'White' : 'Black'} ${({ p: 'pawn', n: 'knight', b: 'bishop', r: 'rook', q: 'queen', k: 'king' } as Record<string, string>)[p.type]}` : null })
  }
  return out
}

/** One line a learner can read: who attacks and who defends a square. */
export function describe(c: SquareControl): string {
  const list = (a: string[]) => (a.length ? a.join(', ') : 'none')
  if (!c.piece) return `${c.square} is empty. White attacks it with ${c.white.length}: ${list(c.white)}. Black attacks it with ${c.black.length}: ${list(c.black)}.`
  const white = c.piece.startsWith('White')
  const attackers = white ? c.black : c.white, defenders = white ? c.white : c.black
  return `${c.square}: ${c.piece}. Attacked by ${attackers.length} (${list(attackers)}); defended by ${defenders.length} (${list(defenders)}). Pins are ignored.`
}
