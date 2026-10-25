// OPEN AND HALF-OPEN FILES
//
// DEFINITION. A file is OPEN when no pawn of either colour stands on it. A file is HALF-OPEN for colour c when none of
// c's pawns stands on it but at least one enemy pawn does (c's rooks look at that pawn). Reported per file together with
// the rooks and queens of each colour standing on it. Facts only: whether occupying the file is a good idea depends on
// the position and is NOT claimed.
// MOVE MODE: `created` lists files that became open or half-open because of the move (a pawn capture or a pawn move
// off the file); `rookMovedTo` is set when the moved piece is a rook/queen that landed on an open or half-open (for it) file.
// found (move mode) = created.length > 0 || rookMovedTo !== null.
// POSITION MODE: found = at least one open or half-open file exists.

import type { Chess } from 'chess.js'
import type { Color, PieceRef } from '../board.ts'
import { FILES, piecesOf } from '../board.ts'
import type { Ctx } from '../context.ts'
import { makeCtx } from '../context.ts'

export interface FileInfo {
  /** 'a'..'h' */
  file: string
  kind: 'open' | 'half-open'
  /** For half-open files: the colour with no pawn on the file. */
  forColor: Color | null
  /** Rooks and queens of either colour standing on the file. */
  heavyPieces: PieceRef[]
}

export interface OpenFileResult {
  found: boolean
  details: FileInfo[]
  /** Move mode: files that became open/half-open (a subset of `details`). */
  created: FileInfo[]
  /** Move mode: the moved rook/queen landed on an open file, or on a file half-open for its colour. */
  rookMovedTo: FileInfo | null
}

export function fileStates(pos: Chess): FileInfo[] {
  const pieces = piecesOf(pos)
  const out: FileInfo[] = []
  for (const f of FILES) {
    const onFile = pieces.filter(p => p.square[0] === f)
    const wp = onFile.some(p => p.type === 'p' && p.color === 'w')
    const bp = onFile.some(p => p.type === 'p' && p.color === 'b')
    const heavy = onFile.filter(p => p.type === 'r' || p.type === 'q')
    if (!wp && !bp) out.push({ file: f, kind: 'open', forColor: null, heavyPieces: heavy })
    else if (!wp) out.push({ file: f, kind: 'half-open', forColor: 'w', heavyPieces: heavy })
    else if (!bp) out.push({ file: f, kind: 'half-open', forColor: 'b', heavyPieces: heavy })
  }
  return out
}

const sig = (i: FileInfo) => `${i.file}:${i.kind}:${i.forColor ?? ''}`

export function openFileFromCtx(ctx: Ctx): OpenFileResult {
  const details = fileStates(ctx.now)
  if (!ctx.info) return { found: details.length > 0, details, created: [], rookMovedTo: null }
  const before = new Set(fileStates(ctx.before).map(sig))
  const created = details.filter(d => !before.has(sig(d)))
  let rookMovedTo: FileInfo | null = null
  if (ctx.info.piece === 'r' || ctx.info.piece === 'q') {
    const f = ctx.info.to[0]
    const hit = details.find(d => d.file === f && (d.kind === 'open' || d.forColor === ctx.info!.color))
    if (hit) rookMovedTo = hit
  }
  return { found: created.length > 0 || rookMovedTo !== null, details, created, rookMovedTo }
}

export function detectOpenFile(fen: string, move?: string): OpenFileResult {
  return openFileFromCtx(makeCtx(fen, move))
}

