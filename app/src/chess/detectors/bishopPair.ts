// BISHOP PAIR
//
// DEFINITION. A colour HAS THE BISHOP PAIR when it has at least one bishop on a light square and at least one on a dark
// square (so promoted bishops count, and two bishops on same-coloured squares do not). `advantage` is the colour that has
// the pair while the other side does not; null if both or neither have it. Pure fact: how much the pair is worth is not
// claimed.
// found (position mode) = at least one side has the pair.
// MOVE MODE: found = the move changes who has the pair (a capture of a bishop, or a promotion to a bishop); `before` and
// `after` give the status either side of the move.

import type { Chess } from 'chess.js'
import type { Color, Square } from '../board.ts'
import { isLightSquare, piecesOf } from '../board.ts'
import type { Ctx } from '../context.ts'
import { makeCtx } from '../context.ts'

export interface PairStatus {
  w: boolean
  b: boolean
  advantage: Color | null
  bishops: { w: Square[]; b: Square[] }
}

export interface BishopPairResult {
  found: boolean
  /** Status in the examined position (after the move in move mode), when found. */
  details: PairStatus[]
  /** Move mode: status before the move. */
  before: PairStatus | null
  after: PairStatus
}

export function pairStatus(pos: Chess): PairStatus {
  const bishops = { w: [] as Square[], b: [] as Square[] }
  for (const p of piecesOf(pos)) if (p.type === 'b') bishops[p.color].push(p.square)
  const has = (c: Color) => bishops[c].some(isLightSquare) && bishops[c].some(s => !isLightSquare(s))
  const w = has('w')
  const b = has('b')
  return { w, b, advantage: w && !b ? 'w' : b && !w ? 'b' : null, bishops }
}

export function bishopPairFromCtx(ctx: Ctx): BishopPairResult {
  const after = pairStatus(ctx.now)
  if (!ctx.info) return { found: after.w || after.b, details: after.w || after.b ? [after] : [], before: null, after }
  const before = pairStatus(ctx.before)
  const changed = before.w !== after.w || before.b !== after.b
  return { found: changed, details: changed ? [after] : [], before, after }
}

export function detectBishopPair(fen: string, move?: string): BishopPairResult {
  return bishopPairFromCtx(makeCtx(fen, move))
}
