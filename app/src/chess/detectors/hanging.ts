// HANGING PIECE
//
// DEFINITION (position). A non-king piece P of colour o is HANGING when
//   - some enemy piece can LEGALLY capture it (as if it were the enemy's move: pins and king safety respected), and
//   - either P has no real defender (nobody could recapture on its square: see realDefenders in targets.ts), reason
//     'undefended', or some legal capturer is strictly CHEAPER than P (ORDER value; a king is never cheaper), reason
//     'attacked-by-cheaper-piece' (when both hold the reason is 'undefended' and cheaperAttacker is true).
//   `gain` is the static-exchange result (exchange.ts seeGain) for the capturing side, always > 0 for a hanging piece.
//   Pieces that are merely outnumbered (attacked twice, defended once, by equal pieces) are listed in `outnumbered`,
//   not in `details`: that is a different, less certain claim.
// `ownerToMove` is true when the owner can still move/defend before the capture happens.
//
// MOVE MODE. `capturedHanging` is set when the move captures a piece that was hanging for the mover: the victim was
// undefended, or the capturing piece is cheaper than the victim. `details` then describes the position AFTER the move:
// `leftHanging` are the mover's own pieces that the move leaves hanging; `attacked` are the opponent's pieces that are
// hanging after the move and were not hanging (same square) before it. found = capturedHanging !== null || attacked.length > 0.
// Position mode: found = details.length > 0.

import type { Chess } from 'chess.js'
import type { PieceRef, Square } from '../board.ts'
import { ORDER_VALUE, PIECE_VALUE, legalCapturerSquares, opposite, pieceAt, piecesOf } from '../board.ts'
import type { Ctx } from '../context.ts'
import { makeCtx } from '../context.ts'
import { seeGain } from '../exchange.ts'
import { realDefenders } from '../targets.ts'

export type HangingReason = 'undefended' | 'attacked-by-cheaper-piece'

export interface HangingPiece {
  piece: PieceRef
  /** Enemy pieces that can legally capture it. */
  attackers: PieceRef[]
  /** Pieces that could really recapture on its square. */
  defenders: PieceRef[]
  reason: HangingReason
  cheaperAttacker: boolean
  /** Counted material the capturing side nets by the best exchange (> 0). */
  gain: number
  ownerToMove: boolean
}

export interface HangingResult {
  found: boolean
  /** Hanging pieces in the examined position (after the move in move mode), both colours. */
  details: HangingPiece[]
  /** Pieces attacked by more pieces than defend them but not hanging by the strict definition. */
  outnumbered: HangingPiece[]
  /** Move mode only. */
  capturedHanging: HangingPiece | null
  leftHanging: HangingPiece[]
  attacked: HangingPiece[]
}

function refs(pos: Chess, squares: Square[]): PieceRef[] {
  return squares.map(s => pieceAt(pos, s) as PieceRef)
}

/** Is the piece on `sq` hanging in `pos`? (Strict definition above.) Null if it is not, or is a king or empty. */
export function hangingInfo(pos: Chess, sq: Square): HangingPiece | null {
  const p = pieceAt(pos, sq)
  if (!p || p.type === 'k') return null
  const enemy = opposite(p.color)
  const attackers = refs(pos, legalCapturerSquares(pos, sq, enemy))
  if (attackers.length === 0) return null
  const defenders = refs(pos, realDefenders(pos, sq))
  const cheaper = attackers.some(a => ORDER_VALUE[a.type] < ORDER_VALUE[p.type])
  if (defenders.length > 0 && !cheaper) return null
  const gain = seeGain(pos, sq, enemy)
  if (gain <= 0) return null
  return {
    piece: p,
    attackers,
    defenders,
    reason: defenders.length === 0 ? 'undefended' : 'attacked-by-cheaper-piece',
    cheaperAttacker: cheaper,
    gain,
    ownerToMove: pos.turn() === p.color,
  }
}

function allHanging(pos: Chess): HangingPiece[] {
  const out: HangingPiece[] = []
  for (const p of piecesOf(pos)) {
    const h = hangingInfo(pos, p.square)
    if (h) out.push(h)
  }
  out.sort((a, b) => PIECE_VALUE[b.piece.type] - PIECE_VALUE[a.piece.type])
  return out
}

function findOutnumbered(pos: Chess, hanging: HangingPiece[]): HangingPiece[] {
  const out: HangingPiece[] = []
  const skip = new Set(hanging.map(h => h.piece.square))
  for (const p of piecesOf(pos)) {
    if (p.type === 'k' || p.type === 'p' || skip.has(p.square)) continue
    const enemy = opposite(p.color)
    const attackers = refs(pos, legalCapturerSquares(pos, p.square, enemy))
    if (attackers.length === 0) continue
    const defenders = refs(pos, realDefenders(pos, p.square))
    const gain = seeGain(pos, p.square, enemy)
    if (gain > 0) {
      out.push({ piece: p, attackers, defenders, reason: 'attacked-by-cheaper-piece', cheaperAttacker: false, gain, ownerToMove: pos.turn() === p.color })
    }
  }
  return out
}

export function hangingFromCtx(ctx: Ctx): HangingResult {
  const details = allHanging(ctx.now)
  const outnumbered = findOutnumbered(ctx.now, details)
  if (!ctx.info) {
    return { found: details.length > 0, details, outnumbered, capturedHanging: null, leftHanging: [], attacked: [] }
  }
  const info = ctx.info
  let capturedHanging: HangingPiece | null = null
  if (info.captured && !ctx.move?.isEnPassant()) {
    const h = hangingInfo(ctx.before, info.to)
    if (h && (h.defenders.length === 0 || ORDER_VALUE[info.piece] < ORDER_VALUE[h.piece.type])) capturedHanging = h
  }
  const beforeHanging = new Set(allHanging(ctx.before).map(h => h.piece.square))
  const leftHanging = details.filter(h => h.piece.color === info.color)
  const attacked = details.filter(h => h.piece.color !== info.color && !beforeHanging.has(h.piece.square))
  return {
    found: capturedHanging !== null || attacked.length > 0,
    details,
    outnumbered,
    capturedHanging,
    leftHanging,
    attacked,
  }
}

export function detectHanging(fen: string, move?: string): HangingResult {
  return hangingFromCtx(makeCtx(fen, move))
}
