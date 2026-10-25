// SKEWER
//
// DEFINITION (structure). A rook, bishop or queen S skewers when, along one of S's lines, the first piece met is an enemy
// piece A and the next piece met behind it is an enemy piece B, with
//   - A is the enemy king, or A is worth strictly more than B (ORDER value; so A is attacked and, if it moves away,
//     B is left to be taken), and
//   - B is not a pawn and not a king.
// (If the piece behind is worth MORE than the front piece the line-up is a pin, see pin.ts.)
//
// DEFINITION (works). Same two-ply check as for forks (exchange.ts): with A and B as targets, whatever the defender
// replies (moving A, interposing, capturing S...), S's side can then win at least one more point of counted material.
// If S's side is to move: a capture netting at least one point is available now.
//
// MODES. Position mode: all skewers of both colours. Move mode: only skewers BY THE MOVER'S PIECES that did not exist
// before the move.

import type { Chess } from 'chess.js'
import type { PieceRef } from '../board.ts'
import { ORDER_VALUE } from '../board.ts'
import type { Ctx } from '../context.ts'
import { makeCtx } from '../context.ts'
import { confirmed, exploitable } from '../exchange.ts'
import { alignments } from '../lines.ts'

export interface SkewerStructure {
  attacker: PieceRef
  /** The attacked piece nearest the attacker: the king or the more valuable piece. */
  front: PieceRef
  /** The piece behind it, left exposed if the front piece moves. */
  back: PieceRef
}

export interface SkewerDetail extends SkewerStructure {
  attackerToMove: boolean
  works: boolean
  guaranteedGain: number
  bestDefence: string | null
}

export interface SkewerResult {
  found: boolean
  works: boolean
  details: SkewerDetail[]
}

const keyOf = (d: SkewerStructure) => `${d.attacker.square}|${d.front.square}|${d.back.square}`

export function skewerStructures(pos: Chess): SkewerStructure[] {
  const out: SkewerStructure[] = []
  for (const { slider, first, second } of alignments(pos)) {
    if (first.color === slider.color || second.color === slider.color) continue
    if (second.type === 'k' || second.type === 'p') continue
    if (first.type === 'k' || ORDER_VALUE[first.type] > ORDER_VALUE[second.type]) {
      out.push({ attacker: slider, front: first, back: second })
    }
  }
  return out
}

export function detectSkewer(fen: string, move?: string): SkewerResult {
  return skewerFromCtx(makeCtx(fen, move))
}

export function skewerFromCtx(ctx: Ctx): SkewerResult {
  let structures = skewerStructures(ctx.now)
  if (ctx.info) {
    const mover = ctx.info.color
    const before = new Set(skewerStructures(ctx.before).map(keyOf))
    structures = structures.filter(s => s.attacker.color === mover && !before.has(keyOf(s)))
  }
  const details: SkewerDetail[] = structures.map(s => {
    const targets = s.front.type === 'k' ? [s.back.square] : [s.front.square, s.back.square]
    const ex = exploitable(ctx.now, s.attacker.color, targets, 1)
    return {
      ...s,
      attackerToMove: ctx.now.turn() === s.attacker.color,
      works: ex.minNet >= 1 && confirmed(ctx.now, s.attacker.color),
      guaranteedGain: ex.minNet,
      bestDefence: ex.bestDefence,
    }
  })
  details.sort((a, b) => Number(b.works) - Number(a.works))
  return { found: details.length > 0, works: details.some(d => d.works), details }
}
