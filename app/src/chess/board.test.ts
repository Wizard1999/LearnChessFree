import { describe, expect, it } from 'vitest'
import {
  absolutePins, attackersOf, attacksFrom, defendersOf, fileOf, findLegalMove, isLightSquare, legalCapturerSquares,
  legalMovesFor, loadFen, rankOf, relativeRank, squaresBetween, withTurn,
} from './board.ts'
import { legal } from './testutil.ts'

describe('square utilities', () => {
  it('indexes files and ranks', () => {
    expect(fileOf('a1')).toBe(0)
    expect(fileOf('h8')).toBe(7)
    expect(rankOf('a1')).toBe(0)
    expect(rankOf('e4')).toBe(3)
  })
  it('knows the square colours (a1 is dark, h1 is light)', () => {
    expect(isLightSquare('a1')).toBe(false)
    expect(isLightSquare('h1')).toBe(true)
    expect(isLightSquare('d4')).toBe(false)
    expect(isLightSquare('d5')).toBe(true)
  })
  it('counts ranks from the owner side', () => {
    expect(relativeRank('e4', 'w')).toBe(3)
    expect(relativeRank('e4', 'b')).toBe(4)
  })
  it('lists the squares strictly between aligned squares and nothing otherwise', () => {
    expect(squaresBetween('a1', 'a4')).toEqual(['a2', 'a3'])
    expect(squaresBetween('h1', 'e4')).toEqual(['g2', 'f3'])
    expect(squaresBetween('a1', 'b3')).toEqual([])
    expect(squaresBetween('c3', 'c4')).toEqual([])
  })
})

describe('FEN and move parsing', () => {
  it('throws a readable error for an invalid FEN', () => {
    expect(() => loadFen('not a fen')).toThrow(/Invalid FEN/)
  })
  it('finds a legal move from SAN or UCI and rejects illegal text', () => {
    const c = loadFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
    expect(findLegalMove(c, 'Nf3')?.to).toBe('f3')
    expect(findLegalMove(c, 'g1f3')?.san).toBe('Nf3')
    expect(findLegalMove(c, 'e2e5')).toBeNull()
    expect(findLegalMove(c, 'Ng1xf3')).toBeNull()
  })
  it('accepts check and mate suffixes on SAN', () => {
    const c = loadFen(legal('4k3/8/8/3N4/8/8/8/4K3 w - - 0 1'))
    expect(findLegalMove(c, 'Nc7+')?.to).toBe('c7')
    expect(findLegalMove(c, 'Nc7')?.to).toBe('c7')
  })
})

describe('attack queries', () => {
  it('attackersOf / defendersOf use chess.js geometry', () => {
    // white pawn e4 attacks the black pawn d5; nothing defends d5
    const c = loadFen(legal('4k3/8/8/3p4/4P3/8/8/4K3 w - - 0 1'))
    expect(attackersOf(c, 'd5', 'w')).toEqual(['e4'])
    expect(defendersOf(c, 'd5')).toEqual([])
    expect(defendersOf(c, 'e4')).toEqual([]) // nothing defends the white pawn either
  })
  it('attacksFrom stops at the first piece in a line and includes it', () => {
    const c = loadFen(legal('4k3/8/8/8/R2p4/8/8/4K3 w - - 0 1'))
    expect(attacksFrom(c, 'a4').sort()).toEqual(['a1', 'a2', 'a3', 'a5', 'a6', 'a7', 'a8', 'b4', 'c4', 'd4'].sort())
  })
  it('attacksFrom of a pawn is the two forward diagonals, of a knight is the L-jumps', () => {
    const c = loadFen(legal('4k3/8/8/8/3P4/8/6N1/4K3 w - - 0 1'))
    expect(attacksFrom(c, 'd4').sort()).toEqual(['c5', 'e5'])
    expect(attacksFrom(c, 'g2').sort()).toEqual(['e3', 'e1', 'f4', 'h4'].sort())
  })
})

describe('absolute pins', () => {
  it('finds the knight pinned to its king by a bishop, with the squares it may still use', () => {
    const c = loadFen(legal('4k3/8/2n5/1B6/8/8/8/4K3 w - - 0 1'))
    const pins = absolutePins(c, 'b')
    expect(pins).toHaveLength(1)
    expect(pins[0]).toMatchObject({ pinned: 'c6', pinner: 'b5', king: 'e8' })
    expect(pins[0].allowed.sort()).toEqual(['b5', 'd7'])
    expect(absolutePins(c, 'w')).toEqual([])
  })
})

describe('legal captures', () => {
  it('a pawn pinned to its king cannot capture off the pin line', () => {
    // Black rook e8 pins the white pawn e4 to the king e1; the pawn "attacks" d5 but may not take there
    const fen = legal('4r1k1/8/2p5/3n4/4P3/8/8/4K3 w - - 0 1')
    const c = loadFen(fen)
    expect(attackersOf(c, 'd5', 'w')).toEqual(['e4'])
    expect(legalCapturerSquares(c, 'd5', 'w')).toEqual([])
  })
  it('without the pin the same pawn can capture', () => {
    const c = loadFen(legal('6kr/8/2p5/3n4/4P3/8/8/4K3 w - - 0 1'))
    expect(legalCapturerSquares(c, 'd5', 'w')).toEqual(['e4'])
  })
  it('a king cannot capture a defended piece', () => {
    // black rook d8 guards the knight d2? no: the white king e1 may take the knight d2 only if d2 is not attacked
    const guarded = loadFen(legal('3rk3/8/8/8/8/8/3n4/4K3 w - - 0 1'))
    expect(legalCapturerSquares(guarded, 'd2', 'w')).toEqual([]) // the rook on d8 sees d2 through d3..d7
    const loose = loadFen(legal('4k3/8/8/8/8/8/3n4/4K3 w - - 0 1'))
    expect(legalCapturerSquares(loose, 'd2', 'w')).toEqual(['e1'])
  })
  it('works for the side that is not to move (turn is flipped on a copy)', () => {
    const c = loadFen(legal('4k3/8/8/3p4/4P3/8/8/4K3 b - - 0 1'))
    expect(legalCapturerSquares(c, 'd5', 'b')).toEqual([])
    expect(legalCapturerSquares(c, 'e4', 'b')).toEqual(['d5'])
    expect(legalMovesFor(c, 'w').some(m => m.san === 'exd5')).toBe(true)
    expect(withTurn(c, 'w').turn()).toBe('w')
  })
})
