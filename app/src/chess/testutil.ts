// Helpers for the detector tests (not part of the app bundle: nothing in the app imports this file).

import { Chess } from 'chess.js'
import { expect } from 'vitest'

/**
 * Assert that a hand-built FEN is a legal position in the sense the tests rely on, then return it:
 * it loads, each side has exactly one king, the kings are not adjacent, no pawns on the first or last rank, at most 8 pawns
 * and 16 pieces per side, and the side NOT to move is not in check.
 */
export function legal(fen: string): string {
  const c = new Chess(fen)
  const pieces = c.board().flat().filter((p): p is NonNullable<typeof p> => p !== null)
  for (const color of ['w', 'b'] as const) {
    const mine = pieces.filter(p => p.color === color)
    expect(mine.filter(p => p.type === 'k'), `${color} kings in ${fen}`).toHaveLength(1)
    expect(mine.filter(p => p.type === 'p').length, `${color} pawns in ${fen}`).toBeLessThanOrEqual(8)
    expect(mine.length, `${color} pieces in ${fen}`).toBeLessThanOrEqual(16)
  }
  expect(pieces.filter(p => p.type === 'p' && (p.square[1] === '1' || p.square[1] === '8')), `edge pawns in ${fen}`).toHaveLength(0)
  const wk = pieces.find(p => p.type === 'k' && p.color === 'w')!.square
  const bk = pieces.find(p => p.type === 'k' && p.color === 'b')!.square
  expect(Math.max(Math.abs(wk.charCodeAt(0) - bk.charCodeAt(0)), Math.abs(wk.charCodeAt(1) - bk.charCodeAt(1))), `kings adjacent in ${fen}`).toBeGreaterThan(1)
  const notToMove = c.turn() === 'w' ? 'b' : 'w'
  const kingOfNotToMove = notToMove === 'w' ? wk : bk
  expect(c.isAttacked(kingOfNotToMove, c.turn()), `side not to move is in check in ${fen}`).toBe(false)
  return fen
}

/** SAN of every legal move, for assertions such as "the only legal replies are ...". */
export function legalSans(fen: string): string[] {
  return new Chess(fen).moves()
}
