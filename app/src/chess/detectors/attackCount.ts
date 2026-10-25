// ATTACK COUNT
//
// DEFINITION. For every piece (kings excluded) the number of enemy pieces that attack its square and the number of
// friendly pieces that defend it, by the rules of movement (chess.js attackers(): ignores pins, and x-rays are not
// counted). `outnumbered` = attackers > defenders (raw counts; it does NOT say a capture wins material: use the hanging
// detector or the exchange evaluation for that). `control` gives, for every square, how many White and how many Black
// pieces attack it. `kingZone[c]` is, for c's king, the number of adjacent squares attacked by at least one enemy piece
// and the number of distinct enemy pieces attacking at least one of them.
// MOVE MODE: the same numbers after the move, plus `changed`: pieces whose attacker count is higher after the move than
// before (same square).
// found = some piece is attacked by at least one enemy piece (position mode) / the move raised some attacker count (move mode).

import type { Chess } from 'chess.js'
import type { Color, PieceRef, Square } from '../board.ts'
import { ALL_DIRS, ALL_SQUARES, attackersOf, defendersOf, fileOf, kingSquare, opposite, piecesOf, rankOf, toSquare } from '../board.ts'
import type { Ctx } from '../context.ts'
import { makeCtx } from '../context.ts'

export interface PieceAttackInfo {
  piece: PieceRef
  attackers: Square[]
  defenders: Square[]
  outnumbered: boolean
}

export interface KingZone {
  /** Squares adjacent to the king that an enemy piece attacks. */
  attackedSquares: number
  /** Distinct enemy pieces attacking at least one square adjacent to the king. */
  attackingPieces: number
}

export interface AttackCountResult {
  found: boolean
  /** Every non-king piece that is attacked by at least one enemy piece. */
  details: PieceAttackInfo[]
  control: Record<Square, { w: number; b: number }>
  kingZone: { w: KingZone | null; b: KingZone | null }
  /** Move mode: pieces whose number of attackers is higher after the move than before (same square). */
  changed: PieceAttackInfo[]
}

function zone(pos: Chess, color: Color): KingZone | null {
  const k = kingSquare(pos, color)
  if (!k) return null
  const enemy = opposite(color)
  const pieces = new Set<Square>()
  let squares = 0
  for (const [df, dr] of ALL_DIRS) {
    const s = toSquare(fileOf(k) + df, rankOf(k) + dr)
    if (!s) continue
    const att = attackersOf(pos, s, enemy)
    if (att.length > 0) squares++
    for (const a of att) pieces.add(a)
  }
  return { attackedSquares: squares, attackingPieces: pieces.size }
}

function infoFor(pos: Chess): PieceAttackInfo[] {
  const out: PieceAttackInfo[] = []
  for (const p of piecesOf(pos)) {
    if (p.type === 'k') continue
    const attackers = attackersOf(pos, p.square, opposite(p.color))
    if (attackers.length === 0) continue
    const defenders = defendersOf(pos, p.square)
    out.push({ piece: p, attackers, defenders, outnumbered: attackers.length > defenders.length })
  }
  return out
}

export function attackCountFromCtx(ctx: Ctx): AttackCountResult {
  const pos = ctx.now
  const details = infoFor(pos)
  const control = {} as Record<Square, { w: number; b: number }>
  for (const sq of ALL_SQUARES) control[sq] = { w: attackersOf(pos, sq, 'w').length, b: attackersOf(pos, sq, 'b').length }
  const kingZone = { w: zone(pos, 'w'), b: zone(pos, 'b') }
  let changed: PieceAttackInfo[] = []
  if (ctx.info) {
    const before = new Map(infoFor(ctx.before).map(i => [i.piece.square, i.attackers.length]))
    changed = details.filter(d => d.attackers.length > (before.get(d.piece.square) ?? 0))
  }
  return { found: ctx.info ? changed.length > 0 : details.length > 0, details, control, kingZone, changed }
}

export function detectAttackCount(fen: string, move?: string): AttackCountResult {
  return attackCountFromCtx(makeCtx(fen, move))
}
