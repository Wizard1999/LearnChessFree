import { describe, expect, it } from 'vitest'
import { piecesOf, squareOrigin } from './boardImage'

describe('boardImage helpers', () => {
  it('reads the start position: 32 pieces, white king on e1', () => {
    const ps = piecesOf('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
    expect(ps).toHaveLength(32)
    expect(ps.find(p => p.key === 'white king')).toMatchObject({ file: 4, rank: 0 })
    expect(ps.find(p => p.key === 'black queen')).toMatchObject({ file: 3, rank: 7 })
  })
  it('skips empty squares by number', () => {
    expect(piecesOf('8/8/8/3k4/8/8/8/4K3 w - - 0 1').map(p => [p.key, p.file, p.rank])).toEqual([['black king', 3, 4], ['white king', 4, 0]])
  })
  it('puts a1 bottom-left, or top-right when flipped', () => {
    expect(squareOrigin(0, 0, 100, false)).toEqual({ x: 0, y: 700 })
    expect(squareOrigin(0, 0, 100, true)).toEqual({ x: 700, y: 0 })
  })
})
