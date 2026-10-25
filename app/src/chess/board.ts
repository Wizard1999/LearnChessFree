// Small board helpers shared by every detector.
//
// Design rules for this whole folder (see docs/detectors.md):
//   * Everything here is a PURE function of a FEN (and optionally a move). No global state.
//   * chess.js (BSD) is the rules authority: legal move generation, check, attackers().
//   * Piece values are the conventional 1/3/3/5/9 "counted material"; no positional evaluation anywhere.
//   * Nothing in this folder is produced by, or calls, a language model (CD-4, CD-10).

import { Chess } from 'chess.js'
import type { Color, Move, PieceSymbol, Square } from 'chess.js'

export type { Color, Move, PieceSymbol, Square }

/** A piece standing on a square. */
export interface PieceRef {
  square: Square
  type: PieceSymbol
  color: Color
}

/** Counted material: pawn 1, knight 3, bishop 3, rook 5, queen 9. The king is 0 (it is never "won"). */
export const PIECE_VALUE: Readonly<Record<PieceSymbol, number>> = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 }

/**
 * Value used only to ORDER pieces ("is this piece cheaper than that one?"). The king is the most valuable
 * piece in this ordering, so a king is never a "cheaper" attacker and a checked king is always the front
 * piece of a skewer.
 */
export const ORDER_VALUE: Readonly<Record<PieceSymbol, number>> = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 100 }

export const PIECE_NAME: Readonly<Record<PieceSymbol, string>> = {
  p: 'pawn', n: 'knight', b: 'bishop', r: 'rook', q: 'queen', k: 'king',
}

export const COLOR_NAME: Readonly<Record<Color, string>> = { w: 'White', b: 'Black' }

export const FILES = 'abcdefgh'

export const ALL_SQUARES: readonly Square[] = (() => {
  const out: Square[] = []
  for (let r = 1; r <= 8; r++) for (const f of FILES) out.push(`${f}${r}` as Square)
  return out
})()

// ---------------------------------------------------------------------------------------------------------
// Square utilities
// ---------------------------------------------------------------------------------------------------------

/** File index 0..7 (a..h). */
export function fileOf(sq: Square): number { return sq.charCodeAt(0) - 97 }
/** Rank index 0..7 (rank 1 -> 0). */
export function rankOf(sq: Square): number { return sq.charCodeAt(1) - 49 }

/** Square from file/rank indices, or null if off the board. */
export function toSquare(file: number, rank: number): Square | null {
  if (file < 0 || file > 7 || rank < 0 || rank > 7) return null
  return `${FILES[file]}${rank + 1}` as Square
}

/** a1 is dark, h1 is light. */
export function isLightSquare(sq: Square): boolean { return (fileOf(sq) + rankOf(sq)) % 2 === 1 }

export function opposite(c: Color): Color { return c === 'w' ? 'b' : 'w' }

/** Rank counted from `color`'s own back rank: 0 = its back rank, 7 = the far rank. */
export function relativeRank(sq: Square, color: Color): number {
  return color === 'w' ? rankOf(sq) : 7 - rankOf(sq)
}

/** Direction a pawn of this colour moves along the ranks (+1 for White, -1 for Black). */
export function pawnStep(color: Color): number { return color === 'w' ? 1 : -1 }

export const BISHOP_DIRS: ReadonlyArray<readonly [number, number]> = [[1, 1], [1, -1], [-1, 1], [-1, -1]]
export const ROOK_DIRS: ReadonlyArray<readonly [number, number]> = [[1, 0], [-1, 0], [0, 1], [0, -1]]
export const ALL_DIRS: ReadonlyArray<readonly [number, number]> = [...ROOK_DIRS, ...BISHOP_DIRS]
const KNIGHT_JUMPS: ReadonlyArray<readonly [number, number]> = [
  [1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1], [-2, 1], [-1, 2],
]

/** Squares from `sq` (exclusive) in direction (df, dr) up to the board edge. */
export function rayFrom(sq: Square, df: number, dr: number): Square[] {
  const out: Square[] = []
  let f = fileOf(sq) + df
  let r = rankOf(sq) + dr
  while (f >= 0 && f <= 7 && r >= 0 && r <= 7) {
    out.push(toSquare(f, r) as Square)
    f += df
    r += dr
  }
  return out
}

/** Unit step (df, dr) from a towards b if the two squares share a rank, file or diagonal; otherwise null. */
export function stepBetween(a: Square, b: Square): [number, number] | null {
  const df = fileOf(b) - fileOf(a)
  const dr = rankOf(b) - rankOf(a)
  if (df === 0 && dr === 0) return null
  if (df === 0 || dr === 0 || Math.abs(df) === Math.abs(dr)) return [Math.sign(df), Math.sign(dr)]
  return null
}

/** Squares strictly between a and b when they are aligned (rank/file/diagonal); [] otherwise. */
export function squaresBetween(a: Square, b: Square): Square[] {
  const step = stepBetween(a, b)
  if (!step) return []
  const out: Square[] = []
  let f = fileOf(a) + step[0]
  let r = rankOf(a) + step[1]
  while (f !== fileOf(b) || r !== rankOf(b)) {
    out.push(toSquare(f, r) as Square)
    f += step[0]
    r += step[1]
  }
  return out
}

/** Chebyshev (king-move) distance. */
export function squareDistance(a: Square, b: Square): number {
  return Math.max(Math.abs(fileOf(a) - fileOf(b)), Math.abs(rankOf(a) - rankOf(b)))
}

// ---------------------------------------------------------------------------------------------------------
// Loading positions and moves
// ---------------------------------------------------------------------------------------------------------

/** Parse a FEN. Throws an Error with a readable message if it is not a loadable position. */
export function loadFen(fen: string): Chess {
  try {
    return new Chess(fen)
  } catch (e) {
    throw new Error(`Invalid FEN "${fen}": ${(e as Error).message}`)
  }
}

/** Independent copy of a position (no move history). */
export function cloneChess(c: Chess): Chess { return new Chess(c.fen()) }

/** UCI text for a verbose move, e.g. "e2e4" or "e7e8q". */
export function uciOf(m: Move): string { return m.from + m.to + (m.promotion ?? '') }

/**
 * Find a LEGAL move in `c` given as SAN ("Nf3", "O-O", "exd5+") or UCI ("g1f3", "e7e8q").
 * Returns null if the text matches no legal move. Does not change `c`.
 */
export function findLegalMove(c: Chess, text: string): Move | null {
  const t = text.trim()
  const moves = c.moves({ verbose: true })
  const stripped = t.replace(/[+#!?]+$/g, '').replace(/0/g, 'O')
  for (const m of moves) {
    if (m.san === t || m.san.replace(/[+#]+$/g, '') === stripped) return m
  }
  const lower = t.toLowerCase()
  for (const m of moves) {
    if (uciOf(m) === lower) return m
  }
  return null
}

/** The position after the legal move `m` (a new Chess; `m` carries the FEN it was generated from). */
export function afterMove(m: Move): Chess {
  const copy = new Chess(m.before)
  copy.move({ from: m.from, to: m.to, promotion: m.promotion })
  return copy
}

/** The same position but with `color` to move (en passant cleared). May describe a position that could not occur in a game. */
export function withTurn(c: Chess, color: Color): Chess {
  if (c.turn() === color) return c
  const parts = c.fen().split(' ')
  parts[1] = color
  parts[3] = '-'
  parts[4] = '0'
  return new Chess(parts.join(' '))
}

/**
 * All legal moves for `color` in `c`, even when it is not `color`'s turn (the turn is flipped on a copy).
 * Moves that would capture a king are dropped (they only arise in positions where the side not to move is in check).
 */
export function legalMovesFor(c: Chess, color: Color): Move[] {
  const pos = withTurn(c, color)
  return pos.moves({ verbose: true }).filter(m => m.captured !== 'k')
}

// ---------------------------------------------------------------------------------------------------------
// Piece maps and attack queries
// ---------------------------------------------------------------------------------------------------------

/** All pieces on the board, optionally restricted to one colour. */
export function piecesOf(c: Chess, color?: Color): PieceRef[] {
  const out: PieceRef[] = []
  const board = c.board()
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const p = board[i][j]
      if (p && (!color || p.color === color)) out.push({ square: p.square, type: p.type, color: p.color })
    }
  }
  return out
}

export function pieceAt(c: Chess, sq: Square): PieceRef | null {
  const p = c.get(sq)
  return p ? { square: sq, type: p.type, color: p.color } : null
}

export function kingSquare(c: Chess, color: Color): Square | null {
  for (const p of piecesOf(c, color)) if (p.type === 'k') return p.square
  return null
}

/**
 * Squares of `byColor` pieces that attack `sq` by the rules of movement (chess.js attackers()).
 * "Attack" here is geometric: it ignores pins and ignores whether `sq` is occupied, so a pinned piece still counts
 * as an attacker, and an own piece counts as "attacked" (= defended). Use legalCaptures() for real captures.
 */
export function attackersOf(c: Chess, sq: Square, byColor: Color): Square[] {
  return c.attackers(sq, byColor)
}

/** Squares of pieces that defend the piece on `sq` (same colour as the occupant, geometric). [] if empty. */
export function defendersOf(c: Chess, sq: Square): Square[] {
  const p = c.get(sq)
  return p ? c.attackers(sq, p.color) : []
}

/** Squares attacked (or defended) by the piece standing on `sq`, by the rules of movement. */
export function attacksFrom(c: Chess, sq: Square): Square[] {
  const p = c.get(sq)
  if (!p) return []
  const f0 = fileOf(sq)
  const r0 = rankOf(sq)
  const out: Square[] = []
  const push = (f: number, r: number) => {
    const s = toSquare(f, r)
    if (s) out.push(s)
  }
  switch (p.type) {
    case 'p': {
      const dr = pawnStep(p.color)
      push(f0 - 1, r0 + dr)
      push(f0 + 1, r0 + dr)
      break
    }
    case 'n':
      for (const [df, dr] of KNIGHT_JUMPS) push(f0 + df, r0 + dr)
      break
    case 'k':
      for (const [df, dr] of ALL_DIRS) push(f0 + df, r0 + dr)
      break
    default: {
      const dirs = p.type === 'b' ? BISHOP_DIRS : p.type === 'r' ? ROOK_DIRS : ALL_DIRS
      for (const [df, dr] of dirs) {
        for (const s of rayFrom(sq, df, dr)) {
          out.push(s)
          if (c.get(s)) break
        }
      }
    }
  }
  return out
}

/**
 * Legal captures that land on `target`, by `byColor`, as if it were byColor's move.
 * Pins, checks and king safety are all respected because the moves come from chess.js move generation.
 */
export function legalCaptures(c: Chess, target: Square, byColor: Color): Move[] {
  return legalMovesFor(c, byColor).filter(m => m.to === target && m.captured !== undefined && !m.isEnPassant())
}

/** The piece to place on `target` when `p` lands there: a pawn reaching the last rank is placed as a queen. */
export function landingPiece(p: { type: PieceSymbol; color: Color }, target: Square): { type: PieceSymbol; color: Color } {
  if (p.type === 'p' && (rankOf(target) === 0 || rankOf(target) === 7)) return { type: 'q', color: p.color }
  return { type: p.type, color: p.color }
}

/**
 * Squares of `byColor` pieces that can LEGALLY capture the (enemy) piece standing on `target`, as if it were byColor's
 * move: the geometric attackers whose capture does not leave their own king attacked (so pinned pieces and a king
 * stepping into attack are excluded; being in check is respected). En passant is not considered.
 * Much faster than legalCaptures() because it does not generate every move. `scratch` must be a disposable copy of the
 * position (it is changed temporarily and restored); pass nothing to have one made.
 */
export function legalCapturerSquares(c: Chess, target: Square, byColor: Color, scratch?: Chess): Square[] {
  const victim = c.get(target)
  if (!victim || victim.color === byColor || victim.type === 'k') return []
  const geometric = c.attackers(target, byColor)
  if (geometric.length === 0) return []
  const work = scratch ?? cloneChess(c)
  const enemy = opposite(byColor)
  const king = kingSquare(work, byColor)
  const out: Square[] = []
  for (const from of geometric) {
    const p = work.get(from)
    if (!p) continue
    work.remove(from)
    work.put(landingPiece(p, target), target)
    const kingAt = p.type === 'k' ? target : king
    const unsafe = kingAt ? work.isAttacked(kingAt, enemy) : false
    work.put(victim, target)
    work.put(p, from)
    if (!unsafe) out.push(from)
  }
  return out
}

// ---------------------------------------------------------------------------------------------------------
// Absolute pins (pins to the king)
// ---------------------------------------------------------------------------------------------------------

export interface AbsolutePin {
  /** The pinned piece (belongs to `color`). */
  pinned: Square
  /** The enemy rook/bishop/queen that pins it. */
  pinner: Square
  king: Square
  /** Squares the pinned piece may still move to: the squares between king and pinner, plus the pinner's square. */
  allowed: Square[]
}

/** Pieces of `color` that stand between their own king and an enemy slider on the same line, with nothing else between. */
export function absolutePins(c: Chess, color: Color): AbsolutePin[] {
  const king = kingSquare(c, color)
  if (!king) return []
  const out: AbsolutePin[] = []
  for (const [df, dr] of ALL_DIRS) {
    const diagonal = df !== 0 && dr !== 0
    let candidate: Square | null = null
    for (const s of rayFrom(king, df, dr)) {
      const p = c.get(s)
      if (!p) continue
      if (candidate === null) {
        if (p.color === color) { candidate = s; continue }
        break // an enemy piece first: nothing is pinned on this line
      }
      const slides = p.type === 'q' || (diagonal ? p.type === 'b' : p.type === 'r')
      if (p.color !== color && slides) {
        const between = squaresBetween(king, s).filter(x => x !== candidate)
        out.push({ pinned: candidate, pinner: s, king, allowed: [...between, s] })
      }
      break
    }
  }
  return out
}

// ---------------------------------------------------------------------------------------------------------
// Misc
// ---------------------------------------------------------------------------------------------------------

/** "knight on c7" */
export function describePiece(p: { type: PieceSymbol; square: Square }): string {
  return `${PIECE_NAME[p.type]} on ${p.square}`
}

/** Counted material (king excluded) for one colour. */
export function materialOf(c: Chess, color: Color): number {
  let total = 0
  for (const p of piecesOf(c, color)) total += PIECE_VALUE[p.type]
  return total
}
