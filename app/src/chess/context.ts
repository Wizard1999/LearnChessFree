// Shared "what are we looking at?" context for detectors.
//
// Every detector has the signature  detectX(fen: string, move?: string)  and two modes:
//   POSITION mode (no move): describe the pattern as it stands in `fen`.
//   MOVE mode (move given, SAN or UCI, legal in `fen`): `fen` is the position BEFORE the move; the result describes
//     what that move CREATES or CARRIES OUT (patterns that exist after the move and did not exist before, or that the
//     move itself executes, such as capturing a hanging piece).

import type { Chess } from 'chess.js'
import type { Color, Move, PieceSymbol, Square } from './board.ts'
import { afterMove, findLegalMove, loadFen, uciOf } from './board.ts'

export interface MoveInfo {
  san: string
  uci: string
  from: Square
  to: Square
  piece: PieceSymbol
  color: Color
  captured?: PieceSymbol
  promotion?: PieceSymbol
  isCapture: boolean
  isCheck: boolean
  isCheckmate: boolean
  fenBefore: string
  fenAfter: string
}

export interface Ctx {
  fen: string
  /** The position as given. */
  before: Chess
  /** The legal move, if one was given. */
  move: Move | null
  /** The position after the move (null in position mode). */
  after: Chess | null
  info: MoveInfo | null
  /** The position the detector describes: after the move in move mode, otherwise the given position. */
  now: Chess
}

/** Build a context. Throws Error if the FEN cannot be loaded or the move is not legal in it. */
export function makeCtx(fen: string, move?: string): Ctx {
  const before = loadFen(fen)
  if (move === undefined || move === '') {
    return { fen, before, move: null, after: null, info: null, now: before }
  }
  const m = findLegalMove(before, move)
  if (!m) throw new Error(`Illegal or unreadable move "${move}" in position ${fen}`)
  return ctxFromMove(fen, before, m)
}

/** Context for a legal move `m` already generated from `before` (no re-parsing of FEN or move text). */
export function ctxFromMove(fen: string, before: Chess, m: Move): Ctx {
  const after = afterMove(m)
  const info: MoveInfo = {
    san: m.san,
    uci: uciOf(m),
    from: m.from,
    to: m.to,
    piece: m.piece,
    color: m.color,
    captured: m.captured,
    promotion: m.promotion,
    isCapture: m.captured !== undefined,
    isCheck: after.inCheck(),
    isCheckmate: after.isCheckmate(),
    fenBefore: m.before,
    fenAfter: m.after,
  }
  return { fen, before, move: m, after, info, now: after }
}
