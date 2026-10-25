// OUTPOST
//
// DEFINITION. A square s is an OUTPOST for colour c when ALL of these hold:
//   1. it lies on c's fourth, fifth or sixth rank (counted from c's own back rank: ranks 4-6 for White, 5-3 for Black);
//   2. a pawn of c defends it;
//   3. NO enemy pawn can ever attack it by moving forward: there is no enemy pawn on the two neighbouring files that is
//      still "behind" s from the enemy's point of view (for a White outpost on rank r: no Black pawn on files f-1 / f+1
//      with a higher rank than r; mirror for Black). This is exactly "cannot be challenged by a pawn" and is permanent
//      until pawns change files by capturing (a later pawn capture can break it; this is not predicted).
// An OUTPOST PIECE is a knight or bishop of c standing on an outpost square. A piece that sits on a supported square
// which an enemy pawn can still attack is reported in `challengeable` with the pawns that can do it (the failing look-alike).
// found = at least one outpost piece. `vacant` lists outpost squares that are empty (no claim that a piece can get there).
// A knight and a bishop are both listed; the textbook case is a knight. Queen/rook/king are never outpost pieces.

import type { Chess } from 'chess.js'
import type { Color, PieceRef, Square } from '../board.ts'
import { ALL_SQUARES, fileOf, opposite, pawnStep, rankOf, relativeRank, toSquare } from '../board.ts'
import type { Ctx } from '../context.ts'
import { makeCtx } from '../context.ts'

export interface OutpostInfo {
  square: Square
  color: Color
  /** The knight/bishop standing there, or null for a vacant outpost square. */
  piece: PieceRef | null
  /** Friendly pawns defending the square. */
  supportedBy: Square[]
  /** Enemy pawns that can still attack the square (empty for a true outpost). */
  challengedBy: Square[]
}

export interface OutpostResult {
  found: boolean
  /** True outposts occupied by a knight or bishop. */
  details: OutpostInfo[]
  /** Pawn-supported squares occupied by a knight/bishop that an enemy pawn can still attack. */
  challengeable: OutpostInfo[]
  /** Empty true-outpost squares. */
  vacant: OutpostInfo[]
  /** Move mode: the moved piece landed on a true outpost. */
  movedToOutpost: OutpostInfo | null
}

function supporters(pos: Chess, sq: Square, color: Color): Square[] {
  const guardRank = rankOf(sq) - pawnStep(color)
  const out: Square[] = []
  for (const df of [-1, 1]) {
    const s = toSquare(fileOf(sq) + df, guardRank)
    const q = s ? pos.get(s) : undefined
    if (s && q && q.type === 'p' && q.color === color) out.push(s)
  }
  return out
}

function challengers(pos: Chess, sq: Square, color: Color): Square[] {
  const enemy = opposite(color)
  const step = pawnStep(color) // enemy pawns move by -step; those "behind" s have rank*step > rank(s)*step
  const out: Square[] = []
  for (const df of [-1, 1]) {
    for (let r = rankOf(sq) + step; r >= 0 && r <= 7; r += step) {
      const s = toSquare(fileOf(sq) + df, r)
      const q = s ? pos.get(s) : undefined
      if (s && q && q.type === 'p' && q.color === enemy) out.push(s)
    }
  }
  return out
}

export function outpostFromCtx(ctx: Ctx): OutpostResult {
  const pos = ctx.now
  const details: OutpostInfo[] = []
  const challengeable: OutpostInfo[] = []
  const vacant: OutpostInfo[] = []
  for (const sq of ALL_SQUARES) {
    const occupant = pos.get(sq)
    for (const color of ['w', 'b'] as Color[]) {
      const rr = relativeRank(sq, color)
      if (rr < 3 || rr > 5) continue
      const sup = supporters(pos, sq, color)
      if (sup.length === 0) continue
      if (occupant && occupant.color !== color) continue
      const isMinor = !!occupant && (occupant.type === 'n' || occupant.type === 'b')
      if (occupant && !isMinor) continue
      const ch = challengers(pos, sq, color)
      const info: OutpostInfo = {
        square: sq,
        color,
        piece: occupant ? { square: sq, type: occupant.type, color } : null,
        supportedBy: sup,
        challengedBy: ch,
      }
      if (ch.length === 0) (occupant ? details : vacant).push(info)
      else if (occupant) challengeable.push(info)
    }
  }
  let movedToOutpost: OutpostInfo | null = null
  if (ctx.info) {
    movedToOutpost = details.find(d => d.square === ctx.info!.to && d.color === ctx.info!.color) ?? null
  }
  const found = ctx.info ? movedToOutpost !== null : details.length > 0
  return { found, details, challengeable, vacant, movedToOutpost }
}

export function detectOutpost(fen: string, move?: string): OutpostResult {
  return outpostFromCtx(makeCtx(fen, move))
}
