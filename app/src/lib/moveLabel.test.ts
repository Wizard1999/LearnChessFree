import { describe, expect, it } from 'vitest'
import { moveLabel, ONLY_MOVE_GAP_CP } from './moveLabel'

describe('moveLabel', () => {
  it('Book wins whenever the position is in the opening data', () => {
    expect(moveLabel({ played: 'e2e4', best: 'd2d4', inBook: true })).toBe('Book')
  })
  it('Best only when the played move equals the first line', () => {
    expect(moveLabel({ played: 'g1f3', best: 'g1f3', inBook: false })).toBe('Best')
    expect(moveLabel({ played: 'g1f3', best: 'e2e4', inBook: false })).toBeNull()
  })
  it('no engine data means no label', () => {
    expect(moveLabel({ played: 'g1f3', inBook: false })).toBeNull()
  })
  it('Only move needs a gap of at least 150 centipawns', () => {
    expect(moveLabel({ played: 'a', best: 'a', gapCp: ONLY_MOVE_GAP_CP, inBook: false })).toBe('Only move')
    expect(moveLabel({ played: 'a', best: 'a', gapCp: ONLY_MOVE_GAP_CP - 1, inBook: false })).toBe('Best')
    expect(moveLabel({ played: 'a', best: 'a', gapCp: undefined, inBook: false })).toBe('Best')
  })
  it('a big gap does not label a move that was not the best', () => {
    expect(moveLabel({ played: 'b', best: 'a', gapCp: 400, inBook: false })).toBeNull()
  })
})
