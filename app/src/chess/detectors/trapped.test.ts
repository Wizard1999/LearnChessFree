import { describe, expect, it } from 'vitest'
import { loadFen } from '../board.ts'
import { detectTrapped, trappedInfo } from './trapped.ts'
import { legal } from '../testutil.ts'

describe('detectTrapped', () => {
  it('a bishop on a7 attacked by a rook, with pawns b6/c7 covering its only squares, is trapped and lost', () => {
    // Ba7 can only go to b8 (Rxb8) or take b6 (cxb6); the rook a8 attacks it and nothing defends it
    const r = detectTrapped(legal('r5k1/B1p5/1p6/8/8/8/8/6K1 w - - 0 1'))
    expect(r.found).toBe(true)
    expect(r.works).toBe(true)
    const t = r.details.find(x => x.piece.square === 'a7')!
    expect(t.piece).toMatchObject({ type: 'b', color: 'w' })
    expect(t.rescuable).toBe(false)
    expect(t.lossIfLeft).toBe(3)
    expect(t.moves.map(m => m.to).sort()).toEqual(['b6', 'b8'])
    expect(t.moves.every(m => m.net < 0)).toBe(true)
    expect(t.ownerToMove).toBe(true)
  })

  it('FAILING LOOK-ALIKE: the same attacked bishop with open diagonal squares is not trapped', () => {
    const r = detectTrapped(legal('r5k1/B7/8/8/8/8/8/6K1 w - - 0 1'))
    expect(r.details.find(x => x.piece.square === 'a7')).toBeUndefined()
  })

  it('FAILING LOOK-ALIKE: every move loses, but a rook defends the bishop, so it is not attacked enough to be lost', () => {
    const c = loadFen(legal('r5k1/B1p5/1p6/8/8/8/8/R5K1 w - - 0 1'))
    expect(trappedInfo(c, 'a7')).toBeNull()
  })

  it('trapped but rescuable: another move (Ra1) adds a defender', () => {
    const r = detectTrapped(legal('r5k1/B1p5/1p6/8/8/8/5K2/7R w - - 0 1'))
    expect(r.found).toBe(true)
    expect(r.works).toBe(false)
    expect(r.details.find(x => x.piece.square === 'a7')?.rescuable).toBe(true)
  })

  it('is not reported while the owner is in check (the check decides the move)', () => {
    const c = loadFen(legal('r5k1/B1p5/1p6/8/8/8/8/6K1 w - - 0 1'))
    expect(trappedInfo(c, 'a7')).not.toBeNull()
    // same trapped bishop, but now a black queen checks the white king
    const inCheck = loadFen(legal('r5k1/B1p5/1p6/8/8/8/6q1/6K1 w - - 0 1'))
    expect(trappedInfo(inCheck, 'a7')).toBeNull()
  })

  it('move mode: Ra8 attacks the bishop that has no safe square (it was not attacked before)', () => {
    const fen = legal('7r/B1p2k2/1p6/8/8/8/8/6K1 b - - 0 1')
    const r = detectTrapped(fen, 'Ra8')
    expect(r.found).toBe(true)
    expect(r.works).toBe(true)
    expect(r.details[0].piece.square).toBe('a7')
    // a quiet unrelated move traps nothing
    expect(detectTrapped(fen, 'Kg7').found).toBe(false)
  })

  it('pawns and kings are never reported', () => {
    const c = loadFen(legal('4k3/8/8/8/8/8/p7/R3K3 b - - 0 1'))
    expect(trappedInfo(c, 'a2')).toBeNull()
    expect(trappedInfo(c, 'e1')).toBeNull()
  })
})
