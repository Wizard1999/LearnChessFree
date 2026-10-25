// PIN
//
// DEFINITION (structure). A rook, bishop or queen S pins an enemy piece P when, along one of S's lines, P is the first
// piece met and the next piece met behind it is
//   - the enemy KING                              -> ABSOLUTE pin (P may not leave the line at all), or
//   - an enemy non-king piece Q with ORDER value(Q) > value(P)   -> RELATIVE pin (P may move, but exposes Q).
// Equal-value or cheaper pieces behind P are not pins. A pawn can be pinned; a king cannot.
//
// DEFINITION (works). The pin WORKS when the two-ply check in exchange.ts passes with the pinned piece and the piece
// behind it (if not the king) as targets: against every legal reply S's side can win at least one more point of
// counted material on them. If S's side is to move, `works` means: a capture of the pinned piece (or checkmate) that
// nets at least one point is available right now. So a pin of a piece that is well defended against the pinner is
// reported as found but NOT working (e.g. a bishop pinning a knight that a pawn defends).
//
// MODES. Position mode: all pins of both colours. Move mode: pins BY THE MOVER'S PIECES that the move either
//   - CREATES (the line-up did not exist before the move), or
//   - EXPLOITS: the line-up already existed but the moved piece (a) now attacks the pinned piece (`attacksPinned`), or
//     (b) stands on a square the absolutely pinned piece attacks but is forbidden to capture on (`shieldsMovedPiece`:
//     "the pinned piece cannot take the piece that just moved").

import type { Chess } from 'chess.js'
import type { PieceRef, Square } from '../board.ts'
import { ORDER_VALUE, absolutePins, attackersOf, attacksFrom } from '../board.ts'
import type { Ctx } from '../context.ts'
import { makeCtx } from '../context.ts'
import { confirmed, exploitable } from '../exchange.ts'
import { alignments } from '../lines.ts'
import { realDefenders } from '../targets.ts'

export type PinKind = 'absolute' | 'relative'

export interface PinStructure {
  kind: PinKind
  pinner: PieceRef
  pinned: PieceRef
  /** The enemy king (absolute) or the more valuable piece shielded by the pinned piece (relative). */
  behind: PieceRef
}

export interface PinDetail extends PinStructure {
  /** Squares of the pinner's side that attack the pinned piece (geometric; includes the pinner). */
  attackers: Square[]
  /** Pieces that could really recapture on the pinned piece's square. */
  defenders: Square[]
  pinnerToMove: boolean
  /** Move mode: the line-up did not exist before the move. */
  isNew: boolean
  /** Move mode: the moved piece attacks the pinned piece (and did not from its old square). */
  attacksPinned: boolean
  /** Move mode: the absolutely pinned piece attacks the moved piece's square but the pin forbids capturing there. */
  shieldsMovedPiece: boolean
  works: boolean
  /** Two-ply guaranteed gain (exact when `works`, otherwise an upper bound). */
  guaranteedGain: number
  bestDefence: string | null
}

export interface PinResult {
  found: boolean
  works: boolean
  details: PinDetail[]
}

const keyOf = (d: PinStructure) => `${d.pinner.square}|${d.pinned.square}|${d.behind.square}`

/** Pins in a position, structure only (no `works` evaluation). Both colours. */
export function pinStructures(pos: Chess): PinStructure[] {
  const out: PinStructure[] = []
  for (const { slider, first, second } of alignments(pos)) {
    if (first.color === slider.color || second.color === slider.color || first.type === 'k') continue
    if (second.type === 'k') out.push({ kind: 'absolute', pinner: slider, pinned: first, behind: second })
    else if (ORDER_VALUE[second.type] > ORDER_VALUE[first.type]) out.push({ kind: 'relative', pinner: slider, pinned: first, behind: second })
  }
  return out
}

function evaluate(pos: Chess, s: PinStructure, extra: { isNew: boolean; attacksPinned: boolean; shieldsMovedPiece: boolean }): PinDetail {
  const targets = s.behind.type === 'k' ? [s.pinned.square] : [s.pinned.square, s.behind.square]
  const ex = exploitable(pos, s.pinner.color, targets, 1)
  return {
    ...s,
    attackers: attackersOf(pos, s.pinned.square, s.pinner.color),
    defenders: realDefenders(pos, s.pinned.square),
    pinnerToMove: pos.turn() === s.pinner.color,
    ...extra,
    works: ex.minNet >= 1 && confirmed(pos, s.pinner.color),
    guaranteedGain: ex.minNet,
    bestDefence: ex.bestDefence,
  }
}

export function detectPin(fen: string, move?: string): PinResult {
  return pinFromCtx(makeCtx(fen, move))
}

export function pinFromCtx(ctx: Ctx): PinResult {
  const none = { isNew: false, attacksPinned: false, shieldsMovedPiece: false }
  let details: PinDetail[]
  if (ctx.info) {
    const info = ctx.info
    const mover = info.color
    const before = new Set(pinStructures(ctx.before).map(keyOf))
    const now = ctx.now
    const pins = absolutePins(now, mover === 'w' ? 'b' : 'w')
    details = []
    for (const st of pinStructures(now)) {
      if (st.pinner.color !== mover) continue
      const isNew = !before.has(keyOf(st))
      const attacksPinned = attackersOf(now, st.pinned.square, mover).includes(info.to) &&
        !attackersOf(ctx.before, st.pinned.square, mover).includes(info.from)
      let shieldsMovedPiece = false
      if (st.kind === 'absolute') {
        const pin = pins.find(x => x.pinned === st.pinned.square)
        shieldsMovedPiece = !!pin && attacksFrom(now, st.pinned.square).includes(info.to) && !pin.allowed.includes(info.to)
      }
      if (isNew || attacksPinned || shieldsMovedPiece) details.push(evaluate(now, st, { isNew, attacksPinned, shieldsMovedPiece }))
    }
  } else {
    details = pinStructures(ctx.now).map(st => evaluate(ctx.now, st, none))
  }
  details.sort((a, b) => Number(b.works) - Number(a.works) || Number(b.kind === 'absolute') - Number(a.kind === 'absolute'))
  return { found: details.length > 0, works: details.some(d => d.works), details }
}
