import { describe, expect, it } from 'vitest'
import { announce, isPromotionMove, moveCursor, piecesFromFen, positionStatus, screenPos, squareLabel, squaresInOrder } from './boardKeys'

const START = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'

describe('moveCursor', () => {
  it('moves the way it looks on screen for White', () => {
    expect(moveCursor('e4', 'ArrowUp', 'white')).toBe('e5')
    expect(moveCursor('e4', 'ArrowDown', 'white')).toBe('e3')
    expect(moveCursor('e4', 'ArrowLeft', 'white')).toBe('d4')
    expect(moveCursor('e4', 'ArrowRight', 'white')).toBe('f4')
  })
  it('is mirrored when the board is flipped', () => {
    expect(moveCursor('e4', 'ArrowUp', 'black')).toBe('e3')
    expect(moveCursor('e4', 'ArrowDown', 'black')).toBe('e5')
    expect(moveCursor('e4', 'ArrowLeft', 'black')).toBe('f4')
    expect(moveCursor('e4', 'ArrowRight', 'black')).toBe('d4')
  })
  it('stops at the edges', () => {
    expect(moveCursor('a1', 'ArrowDown', 'white')).toBe('a1')
    expect(moveCursor('a1', 'ArrowLeft', 'white')).toBe('a1')
    expect(moveCursor('h8', 'ArrowUp', 'white')).toBe('h8')
    expect(moveCursor('h8', 'ArrowRight', 'black')).toBe('g8')
  })
  it('Home and End jump along the row', () => {
    expect(moveCursor('e4', 'Home', 'white')).toBe('a4')
    expect(moveCursor('e4', 'End', 'white')).toBe('h4')
    expect(moveCursor('e4', 'Home', 'black')).toBe('h4')
  })
})

describe('screen order', () => {
  it('lists 64 distinct squares starting top-left', () => {
    expect(squaresInOrder('white')[0]).toBe('a8')
    expect(squaresInOrder('black')[0]).toBe('h1')
    expect(new Set(squaresInOrder('black')).size).toBe(64)
  })
  it('screenPos agrees with the order', () => {
    for (const o of ['white', 'black'] as const) squaresInOrder(o).forEach((sq, i) => expect(screenPos(sq, o)).toEqual({ col: i % 8, row: Math.floor(i / 8) }))
  })
})

describe('pieces and labels', () => {
  const pieces = piecesFromFen(START)
  it('reads the FEN', () => {
    expect(pieces.size).toBe(32)
    expect(pieces.get('g1')).toEqual({ color: 'w', type: 'n' })
    expect(pieces.get('d8')).toEqual({ color: 'b', type: 'q' })
    expect(pieces.get('e4')).toBeUndefined()
  })
  it('names squares', () => {
    expect(squareLabel('g1', pieces.get('g1'))).toBe('g1, white knight')
    expect(squareLabel('e4', undefined)).toBe('e4, empty')
  })
  it('spots promotions', () => {
    const p = piecesFromFen('8/P6k/8/8/8/8/p7/K7 w - - 0 1')
    expect(isPromotionMove(p, 'a7', 'a8')).toBe(true)
    expect(isPromotionMove(p, 'a2', 'a1')).toBe(true)
    expect(isPromotionMove(p, 'a7', 'b7')).toBe(false)
    expect(isPromotionMove(p, 'a1', 'a2')).toBe(false)
  })
})

describe('announcements', () => {
  const n = { color: 'w', type: 'n' } as const
  it('uses plain words', () => {
    expect(announce.selected('f3', n)).toBe('Selected knight on f3.')
    expect(announce.moved('e5', n)).toBe('Moved knight to e5.')
    expect(announce.moved('a8', { color: 'w', type: 'p' }, 'q')).toBe('Moved pawn to a8, promoted to queen.')
    expect(announce.illegal()).toBe('Illegal move.')
  })
})

describe('positionStatus', () => {
  it('says nothing in a quiet position', () => { expect(positionStatus(START).text).toBe('') })
  it('announces check', () => {
    const s = positionStatus('rnb1kbnr/pppp1ppp/8/4p3/6Pq/5P2/PPPPP2P/RNBQKBNR w KQkq - 1 3')
    expect(s.check).toBe(true); expect(s.over).toBe(true)
    expect(s.text).toBe('Checkmate. Black wins.')
    const c = positionStatus('4k3/8/8/8/8/8/4r3/4K3 w - - 0 1')
    expect(c).toMatchObject({ check: true, over: false }); expect(c.text).toContain('Check')
  })
  it('announces stalemate and survives a bad FEN', () => {
    expect(positionStatus('7k/5Q2/6K1/8/8/8/8/8 b - - 0 1').text).toContain('Stalemate')
    expect(positionStatus('nonsense').text).toBe('')
  })
})
