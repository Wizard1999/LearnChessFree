import { Chess } from 'chess.js'
import type { Key } from 'chessground/types'

/** Same position with the other side to move (a "null move"): used for "what does the opponent threaten?" tasks. */
export function flipTurn(fen: string): string {
  const p = fen.split(' ')
  p[1] = p[1] === 'w' ? 'b' : 'w'
  p[3] = '-' // en passant no longer applies
  return p.join(' ')
}
export const sideToMove = (fen: string): 'white' | 'black' => (fen.split(' ')[1] === 'w' ? 'white' : 'black')

export function destsFor(chess: Chess): Map<Key, Key[]> {
  const m = new Map<Key, Key[]>()
  for (const mv of chess.moves({ verbose: true })) {
    const from = mv.from as Key
    const list = m.get(from) ?? []
    if (!list.includes(mv.to as Key)) list.push(mv.to as Key)
    m.set(from, list)
  }
  return m
}

/** Build the UCI string for a drag/click move; promotions default to the accepted piece if the answer names one, else a queen. */
export function uciFor(chess: Chess, from: string, to: string, accepted?: string[], promotion?: string): string {
  const mv = chess.moves({ verbose: true }).find(m => m.from === from && m.to === to && m.promotion)
  if (!mv) return from + to
  if (promotion) return from + to + promotion
  const wanted = accepted?.find(a => a.startsWith(from + to) && a.length === 5)
  return wanted ?? from + to + 'q'
}

export function tryMove(fen: string, uci: string): { fen: string; san: string } | null {
  try {
    const c = new Chess(fen)
    const mv = c.move({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci.length > 4 ? uci[4] : undefined })
    return { fen: c.fen(), san: mv.san }
  } catch { return null }
}

/** Positions along a line of UCI moves, with the SAN of each move. */
export function lineFens(fen: string, moves: string[]): { fens: string[]; sans: string[]; lastMoves: ([string, string] | null)[]; played: number } {
  const fens = [fen]
  const sans: string[] = []
  const lastMoves: ([string, string] | null)[] = [null]
  let cur = fen
  for (const u of moves) {
    const r = tryMove(cur, u)
    if (!r) break
    cur = r.fen
    fens.push(cur); sans.push(r.san); lastMoves.push([u.slice(0, 2), u.slice(2, 4)])
  }
  return { fens, sans, lastMoves, played: sans.length }
}

export const isUci = (s: string) => /^[a-h][1-8][a-h][1-8][qrbn]?$/.test(s)

/** The same position with the pieces on the given squares removed (memory drills). Only the placement field changes. */
export function hidePieces(fen: string, squares: string[]): string {
  const parts = fen.split(' ')
  const rows = parts[0].split('/').map(r => { const cells: string[] = []; for (const ch of r) { if (/\d/.test(ch)) for (let n = 0; n < Number(ch); n++) cells.push(''); else cells.push(ch) } return cells })
  for (const sq of squares) { const f = 'abcdefgh'.indexOf(sq[0]); const r = 8 - Number(sq[1]); if (f >= 0 && r >= 0 && r < 8) rows[r][f] = '' }
  parts[0] = rows.map(cells => { let out = ''; let gap = 0; for (const c of cells) { if (c === '') gap++; else { if (gap) out += gap; gap = 0; out += c } } return out + (gap ? gap : '') }).join('/')
  return parts.join(' ')
}
