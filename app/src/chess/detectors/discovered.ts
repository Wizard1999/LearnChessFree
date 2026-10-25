// DISCOVERED ATTACK and DOUBLE CHECK
//
// DEFINITION (executed, move mode). The move of piece M from square `from` UNMASKS an attack when, after the move,
// a rook/bishop/queen S of the mover's side (S is not M) attacks an enemy piece T although S did not attack T before
// the move, and `from` lies between S and T on S's line. T is the king or any other non-pawn piece (pawns are never
// counted: conservative). `worthy` says whether T is also worth attacking in the sense of src/chess/targets.ts (the king,
// a piece worth more than S, or an undefended non-pawn); the other targets, e.g. a defended piece of equal value, are
// reported with worthy = false. If T is the king this is a discovered check.
//
// DEFINITION (works). The discovered attack WORKS when the two-ply check (exchange.ts) passes with these targets:
// T (unless it is the king) and every target the moved piece M itself attacks after the move. I.e. the move makes TWO
// threats (or a check plus a threat) and against every reply the mover's side can then win at least one more point.
// A discovered check whose moving piece threatens nothing has found = true, works = false.
//
// DEFINITION (battery, position mode). A rook/bishop/queen S of colour c has one of c's own pieces B directly in front
// of it on a line, and directly behind B on that line an enemy target T (as above). Moving B would unmask S on T.
// `works` is not evaluated in position mode (use findTacticalMoves to test the actual moves).
//
// DOUBLE CHECK. After the move (or in the given position) the king of the side to move is attacked by two or more pieces.

import type { PieceRef, Square } from '../board.ts'
import { attackersOf, kingSquare, opposite, pieceAt, piecesOf, squaresBetween } from '../board.ts'
import type { Ctx } from '../context.ts'
import { makeCtx } from '../context.ts'
import { confirmed, forcedGain } from '../exchange.ts'
import { alignments } from '../lines.ts'
import { describeTarget, targetsAttackedBy } from '../targets.ts'
import type { Target } from '../targets.ts'

export interface DiscoveredDetail {
  /** 'executed': the move unmasks the line. 'battery': the line-up exists and a move of the blocker would unmask it. */
  kind: 'executed' | 'battery'
  /** The slider whose line is (or would be) opened. */
  slider: PieceRef
  /** The piece that moved away / could move away, on its ORIGIN square. */
  unmasker: PieceRef
  target: Target
  /** The target is worth attacking (reason is not 'other'): the king, a piece worth more than the slider, or an undefended non-pawn. */
  worthy: boolean
  /** The unmasked attack is a check. */
  check: boolean
  /** Move mode: the check comes from two pieces at once. */
  doubleCheck: boolean
  /** Move mode: worthy targets the moved piece itself attacks after the move. */
  moverTargets: Target[]
  works: boolean
  guaranteedGain: number
  bestDefence: string | null
}

export interface DiscoveredResult {
  found: boolean
  works: boolean
  details: DiscoveredDetail[]
}

export function detectDiscovered(fen: string, move?: string): DiscoveredResult {
  return discoveredFromCtx(makeCtx(fen, move))
}

export function discoveredFromCtx(ctx: Ctx): DiscoveredResult {
  const details: DiscoveredDetail[] = []

  if (ctx.info && ctx.after) {
    const info = ctx.info
    const c = info.color
    const after = ctx.after
    const moverTargets = targetsAttackedBy(after, info.to)
    const unmasker: PieceRef = { square: info.from, type: info.piece, color: c }
    const checkers = after.inCheck() ? attackersOf(after, kingSquare(after, opposite(c)) as Square, c) : []
    for (const t of piecesOf(after, opposite(c))) {
      if (t.type === 'p') continue // pawns are never targets (conservative; see docs/detectors.md)
      for (const sq of attackersOf(after, t.square, c)) {
        if (sq === info.to) continue
        const s = pieceAt(after, sq)
        if (!s || (s.type !== 'r' && s.type !== 'b' && s.type !== 'q')) continue
        if (!squaresBetween(sq, t.square).includes(info.from)) continue
        if (attackersOf(ctx.before, t.square, c).includes(sq)) continue
        const target = describeTarget(after, t.square, s.type, c)
        if (!target) continue
        const targets = [...moverTargets.map(x => x.square), ...(target.type === 'k' ? [] : [target.square])]
        let works = false
        let guaranteedGain = 0
        let bestDefence: string | null = null
        if (targets.length > 0) {
          const fg = forcedGain(after, [...new Set(targets)], 1)
          works = fg.minNet >= 1 && confirmed(after, c)
          guaranteedGain = fg.minNet
          bestDefence = fg.bestDefence
        }
        details.push({
          kind: 'executed',
          slider: s,
          unmasker,
          target,
          worthy: target.reason !== 'other',
          check: target.type === 'k',
          doubleCheck: target.type === 'k' && checkers.length >= 2,
          moverTargets,
          works,
          guaranteedGain,
          bestDefence,
        })
      }
    }
  } else {
    const pos = ctx.now
    for (const { slider, first, second } of alignments(pos)) {
      if (first.color !== slider.color || second.color === slider.color) continue
      const target = describeTarget(pos, second.square, slider.type, slider.color)
      if (!target || target.reason === 'other') continue
      if (first.type === 'k') continue
      details.push({
        kind: 'battery',
        slider,
        unmasker: first,
        target,
        worthy: true,
        check: target.type === 'k',
        doubleCheck: false,
        moverTargets: [],
        works: false,
        guaranteedGain: 0,
        bestDefence: null,
      })
    }
  }
  details.sort((a, b) => Number(b.works) - Number(a.works) || Number(b.check) - Number(a.check))
  return { found: details.length > 0, works: details.some(d => d.works), details }
}

// ---------------------------------------------------------------------------------------------------------------------

export interface DoubleCheckResult {
  found: boolean
  /** Squares of the checking pieces (two or more when found). */
  details: { checkers: PieceRef[]; king: PieceRef }[]
}

export function detectDoubleCheck(fen: string, move?: string): DoubleCheckResult {
  return doubleCheckFromCtx(makeCtx(fen, move))
}

export function doubleCheckFromCtx(ctx: Ctx): DoubleCheckResult {
  const pos = ctx.now
  if (!pos.inCheck()) return { found: false, details: [] }
  const side = pos.turn()
  const ksq = kingSquare(pos, side) as Square
  const checkers = attackersOf(pos, ksq, opposite(side)).map(s => pieceAt(pos, s) as PieceRef)
  if (checkers.length < 2) return { found: false, details: [] }
  return { found: true, details: [{ checkers, king: pieceAt(pos, ksq) as PieceRef }] }
}
