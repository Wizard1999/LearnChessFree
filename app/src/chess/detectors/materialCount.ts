// MATERIAL COUNT
//
// DEFINITION. Counted material with the conventional values pawn 1, knight 3, bishop 3, rook 5, queen 9 (kings are not
// counted). `balance` = White's total minus Black's total. This is arithmetic, not an evaluation: it says nothing about
// who is better.
// MOVE MODE: `details` is the position after the move; `before` is the position before; `change` is the balance after minus
// balance before, from White's point of view; `capturedValue` is the counted value of the piece the move captured.
// found is always true (a count always exists).

import type { Chess } from 'chess.js'
import type { Color } from '../board.ts'
import { PIECE_VALUE, piecesOf } from '../board.ts'
import type { Ctx } from '../context.ts'
import { makeCtx } from '../context.ts'

export interface MaterialSide {
  pawns: number
  knights: number
  bishops: number
  rooks: number
  queens: number
  /** Counted value: 1/3/3/5/9. */
  total: number
}

export interface MaterialCount {
  w: MaterialSide
  b: MaterialSide
  /** White total minus Black total. */
  balance: number
  /** The colour with more counted material, or null if equal. */
  ahead: Color | null
}

export interface MaterialResult {
  found: true
  details: MaterialCount[]
  before: MaterialCount | null
  /** balance(after) - balance(before); null in position mode. */
  change: number | null
  capturedValue: number
}

function side(pos: Chess, color: Color): MaterialSide {
  const s: MaterialSide = { pawns: 0, knights: 0, bishops: 0, rooks: 0, queens: 0, total: 0 }
  for (const p of piecesOf(pos, color)) {
    s.total += PIECE_VALUE[p.type]
    if (p.type === 'p') s.pawns++
    else if (p.type === 'n') s.knights++
    else if (p.type === 'b') s.bishops++
    else if (p.type === 'r') s.rooks++
    else if (p.type === 'q') s.queens++
  }
  return s
}

export function materialCount(pos: Chess): MaterialCount {
  const w = side(pos, 'w')
  const b = side(pos, 'b')
  const balance = w.total - b.total
  return { w, b, balance, ahead: balance > 0 ? 'w' : balance < 0 ? 'b' : null }
}

export function materialFromCtx(ctx: Ctx): MaterialResult {
  const now = materialCount(ctx.now)
  if (!ctx.info) return { found: true, details: [now], before: null, change: null, capturedValue: 0 }
  const before = materialCount(ctx.before)
  const captured = ctx.info.captured ? PIECE_VALUE[ctx.info.captured] : 0
  return { found: true, details: [now], before, change: now.balance - before.balance, capturedValue: captured }
}

export function detectMaterialCount(fen: string, move?: string): MaterialResult {
  return materialFromCtx(makeCtx(fen, move))
}
