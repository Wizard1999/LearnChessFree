import { describe, expect, it } from 'vitest'
import { detectPin } from './pin.ts'
import { detectSkewer } from './skewer.ts'
import { legal } from '../testutil.ts'

describe('detectSkewer', () => {
  it('rook check along the file skewers the king and the rook behind it (works)', () => {
    // Ra1-e1+ : Ke5 must leave the e-file, then Rxe8
    const fen = legal('4r3/8/8/4k3/8/8/6K1/R7 w - - 0 1')
    const r = detectSkewer(fen, 'Re1+')
    expect(r.found).toBe(true)
    expect(r.works).toBe(true)
    const d = r.details[0]
    expect(d.attacker).toMatchObject({ square: 'e1', type: 'r' })
    expect(d.front).toMatchObject({ square: 'e5', type: 'k' })
    expect(d.back).toMatchObject({ square: 'e8', type: 'r' })
    expect(d.guaranteedGain).toBe(5)
  })

  it('FAILING LOOK-ALIKE: the piece behind the king is defended by a rook, so Rxe8 Rxe8 loses material', () => {
    // Re1+ skewers Ke5 and Ne8, but Rh8 guards e8
    const fen = legal('4n2r/8/8/4k3/8/8/6K1/R7 w - - 0 1')
    const r = detectSkewer(fen, 'Re1+')
    expect(r.found).toBe(true)
    expect(r.works).toBe(false)
    expect(r.details[0].back).toMatchObject({ square: 'e8', type: 'n' })
  })

  it('NOT a skewer: the cheaper piece is in front (that line-up is a pin)', () => {
    // Re1 attacks Re5 and the king e8 stands behind it
    const fen = legal('4k3/8/8/4r3/8/8/7K/4R3 w - - 0 1')
    expect(detectSkewer(fen).found).toBe(false)
    const pin = detectPin(fen)
    expect(pin.details.some(d => d.kind === 'absolute' && d.pinned.square === 'e5')).toBe(true)
  })

  it('NOT a skewer: nothing valuable stands behind the front piece', () => {
    // rook a1 attacks the queen a5, behind it only a pawn (pawns never count as the back piece)
    const fen = legal('4k3/p7/8/q7/8/8/8/R3K3 w - - 0 1')
    expect(detectSkewer(fen).details.filter(d => d.attacker.square === 'a1')).toEqual([])
  })

  it('a bishop line-up with the queen in front of a rook is a skewer (front worth more than back)', () => {
    // Bb2 attacks Qd4 and the rook g7 stands behind it on the same diagonal
    const fen = legal('7k/6r1/8/8/3q4/8/1B6/K7 w - - 0 1')
    const r = detectSkewer(fen)
    const d = r.details.find(x => x.attacker.square === 'b2')
    expect(d).toBeDefined()
    expect(d?.front.square).toBe('d4')
    expect(d?.back.square).toBe('g7')
  })
})
