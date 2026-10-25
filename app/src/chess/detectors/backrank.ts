// BACK-RANK WEAKNESS and BACK-RANK MATE
//
// DEFINITION (weak king, position). The king of colour k stands on its own back rank (rank 1 for White, 8 for Black)
// and every square directly in front of it (the up to three squares on the next rank, on the king's file and the two
// neighbouring files) is occupied by one of k's own pieces. The king then has no flight square once a rook or queen
// checks it along the back rank. ("Escape squares along the back rank" are always covered by such a check, because the
// checking line runs through them, so they are not needed in the definition.)
//   found (position mode) = some king is weak AND the enemy still has a rook or a queen.
//   `mateInOne` (position mode): if the side to move is the enemy of a weak king, a legal move that is checkmate with the
//   checking piece a rook/queen on the king's rank (null otherwise).
//
// DEFINITION (back-rank mate, move mode). The move checkmates a king on its back rank, one of the checking pieces is a
// rook or queen on the king's own rank, and EVERY square directly in front of the mated king holds the king's own piece.
// (A looser version, where some of those squares are merely covered by the mating side's pieces, fires on 9-11% of
// puzzles that Lichess does not call back-rank mates, so it is not used: conservative.) found = works = back-rank mate.

import type { Chess } from 'chess.js'
import type { Color, PieceRef, Square } from '../board.ts'
import { afterMove, attackersOf, fileOf, kingSquare, opposite, pieceAt, piecesOf, rankOf, relativeRank, toSquare, uciOf } from '../board.ts'
import type { Ctx } from '../context.ts'
import { makeCtx } from '../context.ts'

export interface BackRankDetail {
  /** Owner of the weak / mated king. */
  color: Color
  king: Square
  /** The king's own pieces on the squares in front of it. */
  blockers: PieceRef[]
  /** Position mode: a back-rank mate in one exists for the side to move against this king. */
  mateInOne: { san: string; uci: string; piece: PieceRef } | null
  /** Move mode: this move IS the back-rank mate. */
  mate: boolean
}

export interface BackRankResult {
  found: boolean
  works: boolean
  details: BackRankDetail[]
}

function frontSquares(king: Square, color: Color): Square[] {
  const dr = color === 'w' ? 1 : -1
  const out: Square[] = []
  for (const df of [-1, 0, 1]) {
    const s = toSquare(fileOf(king) + df, rankOf(king) + dr)
    if (s) out.push(s)
  }
  return out
}

function weakKing(pos: Chess, color: Color): { king: Square; blockers: PieceRef[] } | null {
  const king = kingSquare(pos, color)
  if (!king || relativeRank(king, color) !== 0) return null
  const blockers: PieceRef[] = []
  for (const s of frontSquares(king, color)) {
    const p = pieceAt(pos, s)
    if (!p || p.color !== color) return null
    blockers.push(p)
  }
  return { king, blockers }
}

/** Is the king of `matedColor` checkmated in `pos` by a rook/queen checking along its rank? Returns the checker. */
function rankMate(pos: Chess, matedColor: Color): PieceRef | null {
  if (!pos.isCheckmate() || pos.turn() !== matedColor) return null
  const king = kingSquare(pos, matedColor)
  if (!king || relativeRank(king, matedColor) !== 0) return null
  for (const s of attackersOf(pos, king, opposite(matedColor))) {
    const p = pieceAt(pos, s)
    if (p && (p.type === 'r' || p.type === 'q') && rankOf(s) === rankOf(king)) return p
  }
  return null
}

export function backRankFromCtx(ctx: Ctx): BackRankResult {
  const pos = ctx.now
  const details: BackRankDetail[] = []
  if (ctx.info) {
    const mated = opposite(ctx.info.color)
    const checker = rankMate(pos, mated)
    if (checker) {
      const king = kingSquare(pos, mated) as Square
      const blockers: PieceRef[] = []
      for (const sq of frontSquares(king, mated)) {
        const p = pieceAt(pos, sq)
        if (p && p.color === mated) blockers.push(p)
      }
      if (blockers.length === frontSquares(king, mated).length) {
        details.push({ color: mated, king, blockers, mateInOne: null, mate: true })
      }
    }
  } else {
    for (const color of ['w', 'b'] as Color[]) {
      const weak = weakKing(pos, color)
      if (!weak) continue
      const enemy = opposite(color)
      if (!piecesOf(pos, enemy).some(p => p.type === 'r' || p.type === 'q')) continue
      let mateInOne: BackRankDetail['mateInOne'] = null
      if (pos.turn() === enemy) {
        for (const m of pos.moves({ verbose: true })) {
          if (!m.san.endsWith('#')) continue
          if (!rankMate(afterMove(m), color)) continue
          mateInOne = { san: m.san, uci: uciOf(m), piece: { square: m.from, type: m.piece, color: m.color } }
          break
        }
      }
      details.push({ color, king: weak.king, blockers: weak.blockers, mateInOne, mate: false })
    }
  }
  return { found: details.length > 0, works: details.some(d => d.mate || d.mateInOne !== null), details }
}

export function detectBackRank(fen: string, move?: string): BackRankResult {
  return backRankFromCtx(makeCtx(fen, move))
}
