import { describe, expect, it } from 'vitest'
import { hidePieces } from './play'

describe('hidePieces', () => {
  it('removes pieces on the named squares and keeps the rest of the FEN', () => {
    const fen = 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1'
    expect(hidePieces(fen, ['e4', 'a8'])).toBe('1nbqkbnr/pppppppp/8/8/8/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1')
  })
  it('ignores empty squares and bad names', () => {
    const fen = '4k3/8/8/8/8/8/8/4K3 w - - 0 1'
    expect(hidePieces(fen, ['a1', 'z9'])).toBe(fen)
  })
})
