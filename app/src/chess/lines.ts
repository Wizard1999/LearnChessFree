// Line-ups of sliders: the first two pieces met along each ray of every rook, bishop and queen.
// Pins, skewers and discovered-attack batteries are all special cases of such a line-up.

import type { Chess } from 'chess.js'
import type { PieceRef } from './board.ts'
import { ALL_DIRS, BISHOP_DIRS, ROOK_DIRS, piecesOf, rayFrom } from './board.ts'

export interface Alignment {
  /** The rook / bishop / queen whose ray this is. */
  slider: PieceRef
  /** The first piece met along the ray (nothing between it and the slider). */
  first: PieceRef
  /** The next piece met along the same ray (nothing between it and `first`). */
  second: PieceRef
}

/** Every (slider, first, second) triple on the board, for sliders of both colours. */
export function alignments(c: Chess): Alignment[] {
  const out: Alignment[] = []
  for (const s of piecesOf(c)) {
    if (s.type !== 'r' && s.type !== 'b' && s.type !== 'q') continue
    const dirs = s.type === 'r' ? ROOK_DIRS : s.type === 'b' ? BISHOP_DIRS : ALL_DIRS
    for (const [df, dr] of dirs) {
      let first: PieceRef | null = null
      for (const sq of rayFrom(s.square, df, dr)) {
        const p = c.get(sq)
        if (!p) continue
        const ref: PieceRef = { square: sq, type: p.type, color: p.color }
        if (first === null) {
          first = ref
          continue
        }
        out.push({ slider: s, first, second: ref })
        break
      }
    }
  }
  return out
}
