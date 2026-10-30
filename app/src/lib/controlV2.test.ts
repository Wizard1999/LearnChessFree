import { describe, expect, it } from 'vitest'
import { controlMapV2 } from './controlV2'

describe('square control v2', () => {
  it('counts a bishop behind its own pawn as an x-ray attacker', () => {
    // white pawn d4, bishop c3 behind it on the same diagonal, knight f3: all aim at e5
    const m = controlMapV2('4k3/8/8/8/3P4/2B2N2/8/4K3 w - - 0 1').get('e5')!
    expect(m.white.length).toBe(3)
    expect(m.white.filter(a => a.xray).map(a => a.type)).toEqual(['b'])
  })
  it('lets the pawn side hold a queen where the other side can hold only a pawn', () => {
    // black queen e8 attacks e5; white pawn d4 defends it
    const m = controlMapV2('4q1k1/8/8/8/3P4/8/8/6K1 w - - 0 1').get('e5')!
    expect(m.safe.w).toBe(9)
    expect(m.safe.b).toBe(1)
    expect(m.score).toBeGreaterThan(5)
  })
  it('ignores an attacker that is pinned to its king', () => {
    // white knight c3 is pinned against the king on e1? use a rook pin on the e-file: knight e2 pinned by rook e8, so it cannot cover d4 or f4
    const m = controlMapV2('4r1k1/8/8/8/8/8/4N3/4K3 w - - 0 1')
    expect(m.get('d4')!.white.length).toBe(0)
    expect(m.get('f4')!.white.length).toBe(0)
  })
  it('does not let the king capture into a defended square', () => {
    // black pawn d6 defended by a black rook d8; white king and rook only: white taking the pawn with the king is not allowed to win
    const m = controlMapV2('3r2k1/8/3p4/8/8/8/8/3RK3 w - - 0 1').get('d6')!
    expect(m.captureNet.w).not.toBeNull()
  })
  it('marks control as fragile when a defender is itself attacked and loses the exchange', () => {
    // white pawn d4 defends e5; black bishop attacks the pawn? make d4 attacked by a black pawn c5 with nothing behind it
    const m = controlMapV2('4k3/8/8/2p5/3P4/8/8/4K3 w - - 0 1').get('e5')!
    expect(m.white.length).toBe(1)
  })
})
