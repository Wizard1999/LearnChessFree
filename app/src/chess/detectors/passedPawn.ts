// PASSED PAWN
//
// DEFINITION. A pawn of colour c on file f and rank r is PASSED when no enemy pawn stands on files f-1, f or f+1 on a
// rank in front of it (higher ranks for White, lower ranks for Black). An enemy pawn directly in front on the same file
// therefore means "not passed". That is the standard textbook definition; it says nothing about whether the pawn is
// strong or weak.
// Facts reported per passed pawn: squares to the promotion rank, whether a friendly pawn defends it, the piece (if any)
// standing directly in front of it (a blockader), and the friendly passed pawns on neighbouring files (connected).
// MOVE MODE: `created` lists passed pawns of the mover that exist after the move on a square where the mover did not
// already have a passed pawn before it (a pawn that advanced while staying passed is not "created"); found = created
// is non-empty. POSITION MODE: found = some pawn is passed.

import type { Chess } from 'chess.js'
import type { Color, PieceRef, Square } from '../board.ts'
import { fileOf, opposite, pawnStep, piecesOf, rankOf, relativeRank, toSquare } from '../board.ts'
import type { Ctx } from '../context.ts'
import { makeCtx } from '../context.ts'

export interface PassedPawn {
  pawn: PieceRef
  /** Pawn moves still needed to reach the last rank. */
  stepsToPromotion: number
  protectedByPawn: boolean
  /** The piece directly in front of the pawn, if any. */
  blockedBy: PieceRef | null
  /** Friendly passed pawns on adjacent files. */
  connectedWith: Square[]
}

export interface PassedPawnResult {
  found: boolean
  /** Passed pawns in the examined position (after the move in move mode), both colours. */
  details: PassedPawn[]
  /** Move mode: passed pawns of the mover that the move created. */
  created: PassedPawn[]
}

export function isPassed(pos: Chess, sq: Square): boolean {
  const p = pos.get(sq)
  if (!p || p.type !== 'p') return false
  const step = pawnStep(p.color)
  const f = fileOf(sq)
  const r = rankOf(sq)
  for (let df = -1; df <= 1; df++) {
    for (let rr = r + step; rr >= 0 && rr <= 7; rr += step) {
      const s = toSquare(f + df, rr)
      if (!s) continue
      const q = pos.get(s)
      if (q && q.type === 'p' && q.color === opposite(p.color)) return false
    }
  }
  return true
}

function allPassed(pos: Chess): PassedPawn[] {
  const pawns = piecesOf(pos).filter(p => p.type === 'p')
  const passed = pawns.filter(p => isPassed(pos, p.square))
  const set = new Set(passed.map(p => p.square))
  return passed.map(p => {
    const step = pawnStep(p.color)
    const f = fileOf(p.square)
    const r = rankOf(p.square)
    const front = toSquare(f, r + step)
    const blocker = front ? pos.get(front) : undefined
    const guardRank = r - step
    const protectedByPawn = [-1, 1].some(df => {
      const s = toSquare(f + df, guardRank)
      const q = s ? pos.get(s) : undefined
      return !!q && q.type === 'p' && q.color === p.color
    })
    const connectedWith = passed
      .filter(o => o.color === p.color && Math.abs(fileOf(o.square) - f) === 1 && set.has(o.square))
      .map(o => o.square)
    return {
      pawn: p,
      stepsToPromotion: 7 - relativeRank(p.square, p.color),
      protectedByPawn,
      blockedBy: front && blocker ? { square: front, type: blocker.type, color: blocker.color } : null,
      connectedWith,
    }
  })
}

export function passedPawnFromCtx(ctx: Ctx): PassedPawnResult {
  const details = allPassed(ctx.now)
  if (!ctx.info) return { found: details.length > 0, details, created: [] }
  const mover: Color = ctx.info.color
  const beforeSquares = new Set(allPassed(ctx.before).filter(d => d.pawn.color === mover).map(d => d.pawn.square))
  const created = details.filter(d => d.pawn.color === mover && !beforeSquares.has(d.pawn.square) && !(d.pawn.square === ctx.info!.to && beforeSquares.has(ctx.info!.from)))
  return { found: created.length > 0, details, created }
}

export function detectPassedPawn(fen: string, move?: string): PassedPawnResult {
  return passedPawnFromCtx(makeCtx(fen, move))
}
