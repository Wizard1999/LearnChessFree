import { describe, expect, it } from 'vitest'
import { detectFork } from './fork.ts'
import { legal } from '../testutil.ts'

describe('detectFork', () => {
  it('knight check that also attacks the rook is a fork that works (move mode)', () => {
    // White Nd5-c7+ attacks Ke8 and Ra8. Nothing can capture c7 and no reply saves the rook.
    const fen = legal('r3k3/8/8/3N4/8/8/8/4K3 w - - 0 1')
    const r = detectFork(fen, 'Nc7+')
    expect(r.found).toBe(true)
    expect(r.works).toBe(true)
    const d = r.details[0]
    expect(d.forker).toMatchObject({ square: 'c7', type: 'n', color: 'w' })
    expect(d.targets.map(t => t.square).sort()).toEqual(['a8', 'e8'])
    expect(d.targets.find(t => t.square === 'e8')?.reason).toBe('king')
    expect(d.targets.find(t => t.square === 'a8')?.reason).toBe('more-valuable')
    expect(d.capturedBy).toEqual([])
    expect(d.failure).toBeNull()
    expect(d.guaranteedGain).toBe(5)
  })

  it('is the same fact in position mode after the move', () => {
    const r = detectFork(legal('r3k3/2N5/8/8/8/8/8/4K3 b - - 1 1'))
    expect(r.found).toBe(true)
    expect(r.works).toBe(true)
    expect(r.details[0].forker.square).toBe('c7')
  })

  it('FAILING LOOK-ALIKE: the forking knight can be captured by a pawn (cheaper piece)', () => {
    // Nc4-d6+ attacks Ke8 and Rb7, but the pawn c7 simply takes the knight.
    const fen = legal('4k3/1rp5/8/8/2N5/8/8/4K3 w - - 0 1')
    const r = detectFork(fen, 'Nd6+')
    expect(r.found).toBe(true) // the structure is there: two targets
    expect(r.works).toBe(false)
    const d = r.details[0]
    expect(d.failure).toBe('forker-capturable-by-cheaper-piece')
    expect(d.capturedBy).toEqual([{ square: 'c7', type: 'p', cheaper: true }])
  })

  it('FAILING LOOK-ALIKE: the forker can be taken by an equal-value piece and is not defended', () => {
    // Nd4-e6 attacks Qd8 and Rf8, but Bc8xe6 removes the unprotected knight.
    const fen = legal('2bq1r2/7k/8/8/3N4/8/8/6K1 w - - 0 1')
    const r = detectFork(fen, 'Ne6')
    expect(r.found).toBe(true)
    expect(r.works).toBe(false)
    expect(r.details[0].failure).toBe('defender-can-save-enough')
    expect(r.details[0].bestDefence).toBe('Bxe6')
    expect(r.details[0].capturedBy.map(c => c.square)).toEqual(['c8'])
    expect(r.details[0].capturedBy[0].cheaper).toBe(false)
  })

  it('a single target is not a fork (loose pawns are never targets)', () => {
    // Nc7+ attacks the king and the pawn a6 only
    const r = detectFork(legal('4k3/8/p7/3N4/8/8/8/4K3 w - - 0 1'), 'Nc7+')
    expect(r.found).toBe(false)
    expect(r.details).toEqual([])
  })

  it('a pawn fork works when the pawn is defended and the pieces cannot both be saved', () => {
    // d4-d5 attacks Nc6 and Be6; Bxd5 exd5 still wins a piece for a pawn
    const fen = legal('4k3/8/2n1b3/8/3PP3/8/8/3QK3 w - - 0 1')
    const r = detectFork(fen, 'd5')
    expect(r.found).toBe(true)
    expect(r.works).toBe(true)
    expect(r.details[0].forker).toMatchObject({ square: 'd5', type: 'p' })
    expect(r.details[0].targets.map(t => t.square).sort()).toEqual(['c6', 'e6'])
    expect(r.details[0].guaranteedGain).toBeGreaterThanOrEqual(1)
  })

  it('when it is the forker\'s own turn the attack is reported but not as a working fork', () => {
    // White to move; Nc7 already attacks Ra8 and Qe6, so White can simply capture one of them
    const r = detectFork(legal('r6k/2N5/4q3/8/8/8/8/1K6 w - - 0 1'))
    const d = r.details.find(x => x.forker.square === 'c7')
    expect(d).toBeDefined()
    expect(d?.failure).toBe('forker-side-to-move')
    expect(d?.works).toBe(false)
  })

  it('throws on an illegal move', () => {
    expect(() => detectFork(legal('r3k3/8/8/3N4/8/8/8/4K3 w - - 0 1'), 'Nc6')).toThrow(/Illegal/)
  })
})
