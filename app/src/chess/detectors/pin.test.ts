import { describe, expect, it } from 'vitest'
import { detectPin } from './pin.ts'
import { legal } from '../testutil.ts'

describe('detectPin', () => {
  it('absolute pin: bishop pins the knight to the king, and the loose knight is won', () => {
    // Bb5 - Nc6 - (d7) - Ke8, the knight has no defender; White to move wins it with Bxc6+
    const r = detectPin(legal('4k3/8/2n5/1B6/8/8/8/4K3 w - - 0 1'))
    expect(r.found).toBe(true)
    const d = r.details.find(x => x.pinner.square === 'b5')!
    expect(d.kind).toBe('absolute')
    expect(d.pinned.square).toBe('c6')
    expect(d.behind).toMatchObject({ square: 'e8', type: 'k' })
    expect(d.defenders).toEqual([])
    expect(d.pinnerToMove).toBe(true)
    expect(d.works).toBe(true)
    expect(d.guaranteedGain).toBe(3)
  })

  it('FAILING LOOK-ALIKE: an absolute pin of a knight that a pawn defends does not win it', () => {
    // same pin, but the pawn b7 defends c6: Bxc6+ bxc6 is an equal trade
    const r = detectPin(legal('4k3/1p6/2n5/1B6/8/8/8/4K3 w - - 0 1'))
    const d = r.details.find(x => x.pinner.square === 'b5')!
    expect(d.kind).toBe('absolute')
    expect(d.defenders).toEqual(['b7'])
    expect(d.works).toBe(false)
  })

  it('RELATIVE pin: the knight may move but exposes the queen behind it', () => {
    // Bg5 - Nf6 - (e7) - Qd8; the queen defends the knight so taking it wins nothing
    const r = detectPin(legal('3qk3/8/5n2/6B1/8/8/8/4K3 w - - 0 1'))
    const d = r.details.find(x => x.pinner.square === 'g5')!
    expect(d.kind).toBe('relative')
    expect(d.pinned.square).toBe('f6')
    expect(d.behind).toMatchObject({ square: 'd8', type: 'q' })
    expect(d.works).toBe(false)
  })

  it('a relative pin works when the pinned piece is also attacked by a cheaper piece', () => {
    // pawn e5 also attacks Nf6: exf6 wins the knight whatever the pin does
    const r = detectPin(legal('3qk3/8/5n2/4P1B1/8/8/8/4K3 w - - 0 1'))
    const d = r.details.find(x => x.pinner.square === 'g5')!
    expect(d.kind).toBe('relative')
    expect(d.works).toBe(true)
    expect(d.attackers.sort()).toEqual(['e5', 'g5'])
  })

  it('move mode: Bb5 creates the pin (it did not exist before)', () => {
    const fen = legal('4k3/8/2n5/8/8/8/8/4KB2 w - - 0 1')
    const r = detectPin(fen, 'Bb5')
    expect(r.found).toBe(true)
    expect(r.details[0]).toMatchObject({ kind: 'absolute', isNew: true })
    expect(r.details[0].pinner.square).toBe('b5')
  })

  it('move mode: an unrelated move creates no pin', () => {
    const fen = legal('4k3/8/2n5/8/8/8/8/4KB2 w - - 0 1')
    expect(detectPin(fen, 'Kd1').found).toBe(false)
  })

  it('move mode: the pinned piece cannot take the piece that just moved (pin exploited, not created)', () => {
    // The pin Re8 - Pe4 - Ke1 already exists. The pawn e4 attacks d5 but may not leave the e-file, so Nb6-d5 is immune to it.
    const fen = legal('4r1k1/8/1n6/8/4P3/8/8/4K3 b - - 0 1')
    const r = detectPin(fen, 'Nd5')
    expect(r.found).toBe(true)
    expect(r.details[0]).toMatchObject({ kind: 'absolute', isNew: false, shieldsMovedPiece: true, attacksPinned: false })
    expect(r.details[0].pinned.square).toBe('e4')
  })

  it('NOT a pin: an equal-value piece behind the first piece', () => {
    // Bb5 - Nc6 - Nd7 - Ke8: the first two pieces on the line are knights
    const r = detectPin(legal('4k3/3n4/2n5/1B6/8/8/8/4K3 w - - 0 1'))
    expect(r.details.filter(d => d.pinner.square === 'b5')).toEqual([])
  })

  it('NOT a pin: the piece behind is the pinner\'s own', () => {
    // rook a1, own knight a4, enemy king a8: that is a battery/discovery, not a pin
    const r = detectPin(legal('k7/8/8/8/N7/8/8/R3K3 w - - 0 1'))
    expect(r.found).toBe(false)
  })
})
