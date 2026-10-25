// FORK
//
// DEFINITION (structure). A piece F (any piece except a king) forks when it attacks, at the same moment, two or more
// enemy "targets" (src/chess/targets.ts):
//     target = the enemy king (F gives check), or
//              a non-pawn enemy piece whose counted value is higher than F's (even if defended), or
//              a non-pawn enemy piece with no piece that could really recapture on its square (undefended).
// Pawns are never targets. An absolutely pinned F only counts the squares along its pin line (plus a check).
//
// DEFINITION (works). The fork WORKS when all of these hold:
//   1. it is the defender's turn (the forking side just moved), and
//   2. no enemy piece CHEAPER than F can legally capture F, and
//   3. the two-ply check in exchange.ts (forcedGain) passes: for EVERY legal reply, F's side can then win at least one
//      more point of counted material on the targets (targets that move are followed; a reply that captures F is
//      scored by the recapture), AND
//   4. the independent material search of exchange.ts (securedGain: two plies plus quiescence) also finds a gain of at
//      least one point for F's side.
//   `guaranteedGain` is that two-ply minimum (exact when works is true, otherwise an upper bound), `bestDefence` the
//   reply that holds it down. This does NOT search deeper than one reply and one capture.
//
// MODES. Move mode: the forking piece is the piece that just moved (on its destination square). Position mode: every
// non-king piece of either colour that forks; `works` is only evaluated for a forker whose side is NOT to move.

import type { Color, PieceRef, PieceSymbol, Square } from '../board.ts'
import { ORDER_VALUE, PIECE_VALUE, cloneChess, legalCapturerSquares, opposite, piecesOf } from '../board.ts'
import type { Ctx } from '../context.ts'
import { makeCtx } from '../context.ts'
import { confirmed, forcedGain } from '../exchange.ts'
import { targetsAttackedBy } from '../targets.ts'
import type { Target } from '../targets.ts'

export type ForkFailure = 'forker-side-to-move' | 'forker-capturable-by-cheaper-piece' | 'defender-can-save-enough' | null

export interface ForkDetail {
  forker: PieceRef
  targets: Target[]
  /** Enemy pieces that can legally capture the forker right now (as if it were their move). */
  capturedBy: { square: Square; type: PieceSymbol; cheaper: boolean }[]
  works: boolean
  guaranteedGain: number
  bestDefence: string | null
  failure: ForkFailure
}

export interface ForkResult {
  found: boolean
  works: boolean
  details: ForkDetail[]
}

export function detectFork(fen: string, move?: string): ForkResult {
  return forkFromCtx(makeCtx(fen, move))
}

export function forkFromCtx(ctx: Ctx): ForkResult {
  const pos = ctx.now
  let forkers: PieceRef[]
  if (ctx.info) {
    forkers = piecesOf(pos, ctx.info.color).filter(p => p.square === ctx.info!.to && p.type !== 'k')
  } else {
    forkers = piecesOf(pos).filter(p => p.type !== 'k')
  }
  const details: ForkDetail[] = []
  for (const f of forkers) {
    const targets = targetsAttackedBy(pos, f.square)
    if (targets.length < 2) continue
    const enemy: Color = opposite(f.color)
    const scratch = cloneChess(pos)
    const capturedBy = legalCapturerSquares(pos, f.square, enemy, scratch).map(s => {
      const t = (pos.get(s) as { type: PieceSymbol }).type
      return { square: s, type: t, cheaper: ORDER_VALUE[t] < ORDER_VALUE[f.type] }
    })
    capturedBy.sort((a, b) => ORDER_VALUE[a.type] - ORDER_VALUE[b.type])
    let failure: ForkFailure = null
    let works = false
    let guaranteedGain = 0
    let bestDefence: string | null = null
    if (pos.turn() === f.color) {
      failure = 'forker-side-to-move'
    } else if (capturedBy.some(x => x.cheaper)) {
      failure = 'forker-capturable-by-cheaper-piece'
    } else {
      const fg = forcedGain(pos, targets.map(t => t.square), 1)
      guaranteedGain = fg.minNet
      bestDefence = fg.bestDefence
      works = fg.minNet >= 1 && confirmed(pos, f.color)
      if (!works) failure = 'defender-can-save-enough'
    }
    details.push({ forker: f, targets, capturedBy, works, guaranteedGain, bestDefence, failure })
  }
  details.sort((a, b) => Number(b.works) - Number(a.works) || totalValue(b) - totalValue(a))
  return { found: details.length > 0, works: details.some(d => d.works), details }
}

function totalValue(d: ForkDetail): number {
  return d.targets.reduce((s, t) => s + (t.type === 'k' ? 4 : PIECE_VALUE[t.type]), 0)
}
