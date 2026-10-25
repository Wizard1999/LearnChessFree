// "Target worth attacking" rules shared by the fork, skewer and discovered-attack detectors.

import type { Chess } from 'chess.js'
import type { Color, PieceSymbol, Square } from './board.ts'
import { ORDER_VALUE, absolutePins, attacksFrom, opposite } from './board.ts'

export type TargetReason = 'king' | 'more-valuable' | 'undefended' | 'other'

export interface Target {
  square: Square
  type: PieceSymbol
  color: Color
  /**
   * Why attacking this piece matters:
   *  - 'king'          : the piece is the enemy king (the attack is a check);
   *  - 'more-valuable' : counted value (king excluded) of the target is higher than the attacker's, so even a defended
   *                      target can be won for a profit;
   *  - 'undefended'    : the target is not a pawn and has no piece that could really recapture on its square.
   *  - 'other'         : (only from describeTarget) an attacked piece that is none of the above, e.g. a pawn or a defended
   *                      piece of equal or lower value.
   */
  reason: TargetReason
  defended: boolean
}

/**
 * Pieces of the same colour as the piece on `sq` that could really recapture there if an enemy piece captured on `sq`.
 * Geometric defenders, minus absolutely pinned pieces that could not leave their pin line to reach `sq`, minus a king
 * when the enemy has a second attacker on `sq` (the king could not recapture into attack).
 */
export function realDefenders(c: Chess, sq: Square): Square[] {
  const p = c.get(sq)
  if (!p) return []
  const pins = absolutePins(c, p.color)
  const enemyAttackers = c.attackers(sq, opposite(p.color)).length
  return c.attackers(sq, p.color).filter(d => {
    const piece = c.get(d)
    if (!piece) return false
    if (piece.type === 'k') return enemyAttackers <= 1
    const pin = pins.find(x => x.pinned === d)
    return !pin || pin.allowed.includes(sq)
  })
}

/**
 * Enemy pieces the piece on `attackerSq` attacks AND that are worth attacking (see TargetReason). Pawns are never
 * targets (a deliberate false-negative choice: forks of loose pawns are not what a learner needs to see).
 * An attacker that is absolutely pinned only "attacks" along its pin line (but a pinned piece still gives check).
 */
export function targetsAttackedBy(c: Chess, attackerSq: Square): Target[] {
  const f = c.get(attackerSq)
  if (!f) return []
  let attacked = attacksFrom(c, attackerSq)
  const pin = absolutePins(c, f.color).find(x => x.pinned === attackerSq)
  if (pin) attacked = attacked.filter(s => pin.allowed.includes(s) || c.get(s)?.type === 'k')
  const out: Target[] = []
  for (const s of attacked) {
    const t = c.get(s)
    if (!t || t.color === f.color) continue
    if (t.type === 'k') {
      out.push({ square: s, type: 'k', color: t.color, reason: 'king', defended: false })
      continue
    }
    if (t.type === 'p') continue
    const defended = realDefenders(c, s).length > 0
    if (ORDER_VALUE[t.type] > ORDER_VALUE[f.type]) {
      out.push({ square: s, type: t.type, color: t.color, reason: 'more-valuable', defended })
    } else if (!defended) {
      out.push({ square: s, type: t.type, color: t.color, reason: 'undefended', defended })
    }
  }
  return out
}

/** Is the piece on `sq` a legal-looking target for an attacker of type `attackerType` (same rules as above)? */
export function isWorthyTarget(c: Chess, sq: Square, attackerType: PieceSymbol, attackerColor: Color): Target | null {
  const t = c.get(sq)
  if (!t || t.color === attackerColor) return null
  if (t.type === 'k') return { square: sq, type: 'k', color: t.color, reason: 'king', defended: false }
  if (t.type === 'p') return null
  const defended = realDefenders(c, sq).length > 0
  if (ORDER_VALUE[t.type] > ORDER_VALUE[attackerType]) return { square: sq, type: t.type, color: t.color, reason: 'more-valuable', defended }
  if (!defended) return { square: sq, type: t.type, color: t.color, reason: 'undefended', defended }
  return null
}

/** Like isWorthyTarget but never null for an enemy piece: pieces that are not worth attacking get reason 'other'. */
export function describeTarget(c: Chess, sq: Square, attackerType: PieceSymbol, attackerColor: Color): Target | null {
  const t = c.get(sq)
  if (!t || t.color === attackerColor) return null
  return isWorthyTarget(c, sq, attackerType, attackerColor) ?? { square: sq, type: t.type, color: t.color, reason: 'other', defended: realDefenders(c, sq).length > 0 }
}
