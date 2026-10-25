// TRAPPED PIECE
//
// DEFINITION. A knight, bishop, rook or queen P (owner o, enemy e) is TRAPPED when ALL of these hold; every clause is
// checked with real legal moves from chess.js, as if it were o's turn:
//   1. some enemy piece can legally capture P right now, and the static exchange (exchange.ts seeGain) says that
//      capturing wins material for e (> 0): P is attacked and not defended enough;
//   2. every legal move of P ends worse than staying: for each, (value of what it captures) - (what e wins back on the
//      destination square, by seeGain) is NEGATIVE. (A move of P that gives check is judged like any other: a checking
//      piece that the enemy can capture on the spot gains nothing.) A piece with no legal move at all satisfies this
//      vacuously;
//   3. o is not in check (a check, not the trap, would decide the move) and has at least one legal move.
// Pawns and kings are never reported. If o is not the side to move, the question is asked "as if it were o's turn";
// when that would be an impossible position (e is in check) the piece is not reported.
//
// WORKS (`rescuable` = false). The trapped piece is really lost: no OTHER legal move of o rescues it. A move rescues P
// when afterwards e can no longer win material by capturing P (seeGain <= 0: the attacker was captured, P got a
// defender, the line was blocked...), or when it gives check, or when it captures something worth at least what e
// would win by taking P. The search is one move deep (it does not look at what happens after e captures).
// `found` = trapped by clauses 1-3 (the piece has no safe square); `works` = additionally not rescuable.
//
// MOVE MODE. Trapped pieces of the OPPONENT after the move that were not trapped (same square) before it AND whose
// attackers / reachable squares / controlled squares the move changed (a move that merely answers a check, so that an
// existing trap becomes analysable, does not create it).
// POSITION MODE. Trapped pieces of both colours.

import type { Chess } from 'chess.js'
import type { PieceRef, Square } from '../board.ts'
import type { Color } from '../board.ts'
import { PIECE_VALUE, afterMove, attackersOf, attacksFrom, kingSquare, legalCapturerSquares, opposite, piecesOf, withTurn } from '../board.ts'
import type { Ctx } from '../context.ts'
import { makeCtx } from '../context.ts'
import { confirmed, seeGain } from '../exchange.ts'

export interface TrappedPiece {
  piece: PieceRef
  /** Enemy pieces that can capture it. */
  attackers: Square[]
  /** Counted material the enemy wins by capturing it (static exchange). */
  lossIfLeft: number
  /** Every legal move of the piece with its net result (all negative). */
  moves: { to: Square; net: number }[]
  /** Some other move of the owner rescues the piece (see header); false means the piece is really lost. */
  rescuable: boolean
  ownerToMove: boolean
}

export interface TrappedResult {
  /** At least one trapped piece (no safe square). */
  found: boolean
  /** At least one trapped piece that no other move rescues. */
  works: boolean
  details: TrappedPiece[]
}

/** The trapped-piece analysis for the piece on `sq`, or null if it is not trapped (or not analysable). */
export function trappedInfo(pos: Chess, sq: Square): TrappedPiece | null {
  const p = pos.get(sq)
  if (!p || p.type === 'k' || p.type === 'p') return null
  const piece: PieceRef = { square: sq, type: p.type, color: p.color }
  const enemy = opposite(p.color)
  const attackers = legalCapturerSquares(pos, sq, enemy)
  if (attackers.length === 0) return null
  const lossIfLeft = seeGain(pos, sq, enemy)
  if (lossIfLeft <= 0) return null
  if (pos.turn() !== p.color) {
    const ek = kingSquare(pos, enemy)
    if (ek && pos.isAttacked(ek, p.color)) return null // o-to-move would be an impossible position
  }
  const ownerPos = withTurn(pos, p.color)
  if (ownerPos.inCheck()) return null
  const all = ownerPos.moves({ verbose: true }).filter(m => m.captured !== 'k')
  if (all.length === 0) return null
  const moves: { to: Square; net: number }[] = []
  let rescuable = false
  for (const m of all) {
    const givesCheck = m.san.endsWith('+') || m.san.endsWith('#')
    const after = afterMove(m)
    if (m.from === sq) {
      const net = (m.captured ? PIECE_VALUE[m.captured] : 0) - seeGain(after, m.to, enemy)
      if (net >= 0) return null
      moves.push({ to: m.to, net })
    } else if (!rescuable) {
      if (givesCheck) {
        rescuable = true
        continue
      }
      const exposure = seeGain(after, sq, enemy)
      if (exposure <= 0) rescuable = true
      else if (m.captured && PIECE_VALUE[m.captured] - seeGain(after, m.to, enemy) >= exposure) rescuable = true
    }
  }
  // a trap that no other move rescues must also be confirmed by the independent material search
  if (!rescuable && !confirmed(pos, enemy)) rescuable = true
  return { piece, attackers, lossIfLeft, moves, rescuable, ownerToMove: pos.turn() === p.color }
}

/**
 * What bears on whether the piece on `sq` can be trapped, by geometry only: which `attacker`-coloured pieces attack it, the
 * squares it can reach, and which of those the attacker controls. If a move leaves this unchanged (for example it only
 * answers a check), the move did not create the trap, even though the trap may only become analysable after it.
 */
function trapSignature(pos: Chess, sq: Square, attacker: Color): string {
  const p = pos.get(sq)
  if (!p) return ''
  const attackers = attackersOf(pos, sq, attacker).sort().join(',')
  const reach = attacksFrom(pos, sq).filter(s => pos.get(s)?.color !== p.color).sort()
  const controlled = reach.filter(s => attackersOf(pos, s, attacker).length > 0).join(',')
  return `${p.type}${p.color}|${attackers}|${reach.join(',')}|${controlled}`
}

function allTrapped(pos: Chess): TrappedPiece[] {
  const out: TrappedPiece[] = []
  for (const p of piecesOf(pos)) {
    const t = trappedInfo(pos, p.square)
    if (t) out.push(t)
  }
  out.sort((a, b) => b.lossIfLeft - a.lossIfLeft)
  return out
}

export function trappedFromCtx(ctx: Ctx): TrappedResult {
  let details: TrappedPiece[]
  if (ctx.info) {
    const mover = ctx.info.color
    details = []
    for (const p of piecesOf(ctx.now, opposite(mover))) {
      if (p.type === 'k' || p.type === 'p') continue
      const t = trappedInfo(ctx.now, p.square)
      if (t) details.push(t)
    }
    if (details.length > 0) {
      const wasTrapped = new Set<Square>()
      for (const p of piecesOf(ctx.before, opposite(mover))) {
        if (p.type === 'k' || p.type === 'p') continue
        if (trappedInfo(ctx.before, p.square)) wasTrapped.add(p.square)
      }
      details = details.filter(
        t => !wasTrapped.has(t.piece.square) && trapSignature(ctx.before, t.piece.square, mover) !== trapSignature(ctx.now, t.piece.square, mover),
      )
    }
  } else {
    details = allTrapped(ctx.now)
  }
  return { found: details.length > 0, works: details.some(d => !d.rescuable), details }
}

export function detectTrapped(fen: string, move?: string): TrappedResult {
  return trappedFromCtx(makeCtx(fen, move))
}
