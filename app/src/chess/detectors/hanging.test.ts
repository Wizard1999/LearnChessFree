import { describe, expect, it } from 'vitest'
import { loadFen } from '../board.ts'
import { detectHanging, hangingInfo } from './hanging.ts'
import { legal } from '../testutil.ts'

describe('detectHanging', () => {
  it('an attacked piece with no defender is hanging (undefended)', () => {
    // Rd1 attacks the loose knight d5
    const r = detectHanging(legal('4k3/8/8/3n4/8/8/8/3R2K1 w - - 0 1'))
    expect(r.found).toBe(true)
    expect(r.details).toHaveLength(1)
    expect(r.details[0]).toMatchObject({ reason: 'undefended', gain: 3, ownerToMove: false })
    expect(r.details[0].piece).toMatchObject({ square: 'd5', type: 'n', color: 'b' })
    expect(r.details[0].attackers.map(a => a.square)).toEqual(['d1'])
  })

  it('a defended piece attacked by a cheaper piece is hanging (attacked-by-cheaper-piece)', () => {
    // pawn e4 attacks Nd5, which the pawn c6 defends
    const r = detectHanging(legal('4k3/8/2p5/3n4/4P3/8/8/6K1 w - - 0 1'))
    const h = r.details.find(x => x.piece.square === 'd5')!
    expect(h.reason).toBe('attacked-by-cheaper-piece')
    expect(h.cheaperAttacker).toBe(true)
    expect(h.defenders.map(d => d.square)).toEqual(['c6'])
    expect(h.gain).toBe(2)
  })

  it('FAILING LOOK-ALIKE: attacked by an equal piece but defended is not hanging', () => {
    // Nc3 and Nd5 attack each other, both are defended (Kd2, pc6)
    const r = detectHanging(legal('4k3/8/2p5/3n4/8/2N5/3K4/8 w - - 0 1'))
    expect(r.found).toBe(false)
    expect(r.details).toEqual([])
  })

  it('FAILING LOOK-ALIKE: the cheaper attacker is pinned to its king, so it does not count', () => {
    // pawn e4 is pinned by Re8 and cannot take d5
    const pinned = detectHanging(legal('4r1k1/8/2p5/3n4/4P3/8/8/4K3 w - - 0 1'))
    expect(pinned.details.some(h => h.piece.square === 'd5')).toBe(false)
    // move the rook away from the e-file: now the pawn can take, and the knight is hanging
    const free = detectHanging(legal('6kr/8/2p5/3n4/4P3/8/8/4K3 w - - 0 1'))
    expect(free.details.some(h => h.piece.square === 'd5')).toBe(true)
  })

  it('a piece attacked twice and defended once by equal pieces is listed as outnumbered, not as hanging', () => {
    // Nd5 (defended by pc6) is attacked by Bf3 and Rd1: Bxd5 cxd5 Rxd5 nets White +3 -3 +1 = +1
    const r = detectHanging(legal('4k3/8/2p5/3n4/8/5B2/8/3R2K1 w - - 0 1'))
    expect(r.details).toEqual([])
    expect(r.outnumbered.map(h => h.piece.square)).toEqual(['d5'])
    expect(r.outnumbered[0].gain).toBe(1)
  })

  it('move mode: capturing a loose piece is capturedHanging', () => {
    const r = detectHanging(legal('4k3/8/8/3n4/8/8/8/3R2K1 w - - 0 1'), 'Rxd5')
    expect(r.found).toBe(true)
    expect(r.capturedHanging?.piece).toMatchObject({ square: 'd5', type: 'n' })
    expect(r.capturedHanging?.reason).toBe('undefended')
  })

  it('move mode FAILING LOOK-ALIKE: capturing a defended piece with an equal piece is not capturing a hanging piece', () => {
    const r = detectHanging(legal('4k3/8/2p5/3n4/8/2N5/3K4/8 w - - 0 1'), 'Nxd5')
    expect(r.capturedHanging).toBeNull()
  })

  it('move mode: a move that puts the piece where a pawn attacks it reports it in leftHanging', () => {
    const fen = legal('4k3/8/2p5/8/8/2N5/8/6K1 w - - 0 1')
    const bad = detectHanging(fen, 'Nd5')
    expect(bad.leftHanging).toHaveLength(1)
    expect(bad.leftHanging[0]).toMatchObject({ reason: 'undefended', cheaperAttacker: true })
    expect(bad.leftHanging[0].piece.square).toBe('d5')
    expect(bad.leftHanging[0].attackers.map(a => a.square)).toEqual(['c6'])
    const fine = detectHanging(fen, 'Ne4')
    expect(fine.leftHanging).toEqual([])
  })

  it('hangingInfo returns null for kings and empty squares', () => {
    const c = loadFen(legal('4k3/8/8/3n4/8/8/8/3R2K1 w - - 0 1'))
    expect(hangingInfo(c, 'e8')).toBeNull()
    expect(hangingInfo(c, 'a1')).toBeNull()
    expect(hangingInfo(c, 'd5')).not.toBeNull()
  })
})
