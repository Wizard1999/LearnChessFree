import { Chess } from 'chess.js'

// Pure helpers for the keyboard-operable board: square cursor movement, piece lookup, promotion detection and the plain-words announcements.

export type Orientation = 'white' | 'black'
export type CursorKey = 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight' | 'Home' | 'End'

const FILES = 'abcdefgh'
const PIECE_NAMES: Record<string, string> = { p: 'pawn', n: 'knight', b: 'bishop', r: 'rook', q: 'queen', k: 'king' }
export const PROMOTION_PIECES: { code: 'q' | 'r' | 'b' | 'n'; name: string }[] = [
  { code: 'q', name: 'Queen' }, { code: 'r', name: 'Rook' }, { code: 'b', name: 'Bishop' }, { code: 'n', name: 'Knight' },
]

/** Squares in screen order (top-left first), for the given board orientation. */
export function squaresInOrder(orientation: Orientation): string[] {
  const files = orientation === 'white' ? FILES : [...FILES].reverse().join('')
  const ranks = orientation === 'white' ? '87654321' : '12345678'
  return ranks.split('').flatMap(r => files.split('').map(f => `${f}${r}`))
}

/** Column and row (0 = top/left of the screen) of a square. */
export function screenPos(sq: string, orientation: Orientation): { col: number; row: number } {
  const f = FILES.indexOf(sq[0]), r = Number(sq[1]) - 1
  return orientation === 'white' ? { col: f, row: 7 - r } : { col: 7 - f, row: r }
}

/** Moves the square cursor one step the way it looks on screen (so Up is always towards the top). Stops at the edge. Home and End jump to the left and right edge of the row. */
export function moveCursor(sq: string, key: CursorKey, orientation: Orientation): string {
  const { col, row } = screenPos(sq, orientation)
  let c = col, r = row
  if (key === 'ArrowUp') r -= 1
  else if (key === 'ArrowDown') r += 1
  else if (key === 'ArrowLeft') c -= 1
  else if (key === 'ArrowRight') c += 1
  else if (key === 'Home') c = 0
  else if (key === 'End') c = 7
  c = Math.min(7, Math.max(0, c)); r = Math.min(7, Math.max(0, r))
  return squaresInOrder(orientation)[r * 8 + c]
}

export interface PieceOn { color: 'w' | 'b'; type: 'p' | 'n' | 'b' | 'r' | 'q' | 'k' }

/** Piece on every occupied square, read straight from the FEN placement field. */
export function piecesFromFen(fen: string): Map<string, PieceOn> {
  const out = new Map<string, PieceOn>()
  const rows = fen.split(' ')[0].split('/')
  for (let i = 0; i < rows.length && i < 8; i++) {
    let f = 0
    for (const ch of rows[i]) {
      if (/[1-8]/.test(ch)) { f += Number(ch); continue }
      const lower = ch.toLowerCase()
      if (PIECE_NAMES[lower] && f < 8) out.set(`${FILES[f]}${8 - i}`, { color: ch === lower ? 'b' : 'w', type: lower as PieceOn['type'] })
      f++
    }
  }
  return out
}

export function pieceName(p: PieceOn): string { return `${p.color === 'w' ? 'white' : 'black'} ${PIECE_NAMES[p.type]}` }

/** Accessible name of one square: "e4, white knight" or "e4, empty". */
export function squareLabel(sq: string, p: PieceOn | undefined): string {
  return `${sq}, ${p ? pieceName(p) : 'empty'}`
}

/** True when moving the piece on `from` to `to` is a pawn reaching the last rank (the caller still checks legality). */
export function isPromotionMove(pieces: Map<string, PieceOn>, from: string, to: string): boolean {
  const p = pieces.get(from)
  return !!p && p.type === 'p' && ((p.color === 'w' && to[1] === '8') || (p.color === 'b' && to[1] === '1'))
}

export const announce = {
  selected: (sq: string, p: PieceOn | undefined) => (p ? `Selected ${PIECE_NAMES[p.type]} on ${sq}.` : `Selected ${sq}.`),
  deselected: () => 'Selection cancelled.',
  moved: (to: string, p: PieceOn | undefined, promotion?: string) =>
    `Moved ${p ? `${PIECE_NAMES[p.type]} ` : ''}to ${to}${promotion ? `, promoted to ${PIECE_NAMES[promotion] ?? promotion}` : ''}.`,
  illegal: () => 'Illegal move.',
  promotionAsk: () => 'Choose the piece to promote to: queen, rook, bishop or knight.',
  cursor: (sq: string, p: PieceOn | undefined) => squareLabel(sq, p),
  noMoves: (sq: string) => `No legal moves from ${sq}.`,
}

export interface PositionStatus { check: boolean; over: boolean; text: string }

/** Check and game-result wording for a position, in plain words. Empty text when nothing needs saying. */
export function positionStatus(fen: string): PositionStatus {
  let c: Chess
  try { c = new Chess(fen) } catch { return { check: false, over: false, text: '' } }
  const side = c.turn() === 'w' ? 'White' : 'Black'
  const other = c.turn() === 'w' ? 'Black' : 'White'
  if (c.isCheckmate()) return { check: true, over: true, text: `Checkmate. ${other} wins.` }
  if (c.isStalemate()) return { check: false, over: true, text: 'Stalemate. The game is a draw.' }
  if (c.isInsufficientMaterial()) return { check: false, over: true, text: 'The game is a draw: not enough pieces left to checkmate.' }
  if (c.isDraw()) return { check: c.inCheck(), over: true, text: 'The game is a draw.' }
  if (c.inCheck()) return { check: true, over: false, text: `Check. ${side} is in check.` }
  return { check: false, over: false, text: '' }
}
