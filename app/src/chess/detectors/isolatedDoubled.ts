// ISOLATED AND DOUBLED PAWNS
//
// DEFINITIONS (standard).
//   ISOLATED pawn: a pawn with no friendly pawn on either neighbouring file (any rank).
//   DOUBLED pawns: two or more pawns of one colour on the same file (reported once per file with all their squares).
// Pure structure; whether such a pawn is a weakness in the position is NOT claimed.
// MOVE MODE: `created` lists the isolated pawns / doubled files that exist after the move and did not before (same
// square / same file and colour). found = created is non-empty. POSITION MODE: found = any isolated or doubled pawn.

import type { Chess } from 'chess.js'
import type { Color, PieceRef, Square } from '../board.ts'
import { FILES, piecesOf } from '../board.ts'
import type { Ctx } from '../context.ts'
import { makeCtx } from '../context.ts'

export interface DoubledFile {
  color: Color
  file: string
  squares: Square[]
}

export interface PawnStructureFacts {
  isolated: PieceRef[]
  doubled: DoubledFile[]
}

export interface IsolatedDoubledResult {
  found: boolean
  /** Structure in the examined position (after the move in move mode). */
  details: PawnStructureFacts
  /** Move mode: weaknesses of either side that the move created. */
  created: PawnStructureFacts
}

export function pawnStructure(pos: Chess): PawnStructureFacts {
  const pawns = piecesOf(pos).filter(p => p.type === 'p')
  const isolated: PieceRef[] = []
  const doubled: DoubledFile[] = []
  for (const color of ['w', 'b'] as Color[]) {
    const mine = pawns.filter(p => p.color === color)
    const filesWithPawn = new Set(mine.map(p => p.square[0]))
    for (const p of mine) {
      const i = FILES.indexOf(p.square[0])
      const left = i > 0 && filesWithPawn.has(FILES[i - 1])
      const right = i < 7 && filesWithPawn.has(FILES[i + 1])
      if (!left && !right) isolated.push(p)
    }
    for (const f of FILES) {
      const onFile = mine.filter(p => p.square[0] === f)
      if (onFile.length >= 2) doubled.push({ color, file: f, squares: onFile.map(p => p.square).sort() })
    }
  }
  return { isolated, doubled }
}

export function isolatedDoubledFromCtx(ctx: Ctx): IsolatedDoubledResult {
  const now = pawnStructure(ctx.now)
  const none: PawnStructureFacts = { isolated: [], doubled: [] }
  if (!ctx.info) return { found: now.isolated.length > 0 || now.doubled.length > 0, details: now, created: none }
  const before = pawnStructure(ctx.before)
  const bi = new Set(before.isolated.map(p => p.square + p.color))
  const bd = new Set(before.doubled.map(d => d.color + d.file))
  const created: PawnStructureFacts = {
    isolated: now.isolated.filter(p => !bi.has(p.square + p.color)),
    doubled: now.doubled.filter(d => !bd.has(d.color + d.file)),
  }
  return { found: created.isolated.length > 0 || created.doubled.length > 0, details: now, created }
}

export function detectIsolatedDoubled(fen: string, move?: string): IsolatedDoubledResult {
  return isolatedDoubledFromCtx(makeCtx(fen, move))
}
