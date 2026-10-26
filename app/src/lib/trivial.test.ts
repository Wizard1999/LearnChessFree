import { describe, expect, it } from 'vitest'
import type { Attempt } from '../db'
import { autoTrivial } from './trivial'

const a = (i: number, o: Partial<Attempt> = {}): Attempt => ({ itemId: `i${i}`, skillKey: 'X.D2', cue: 3, family: 'f', correct: true, firstAttempt: true, hints: 0, timeMs: 4000, source: 'practice', ts: i, unprompted: true, ...o })
describe('autoTrivial', () => {
  it('five quick, right, unhinted answers on five different exercises', () => expect(autoTrivial([1, 2, 3, 4, 5].map(i => a(i))).has('X.D2')).toBe(true))
  it('a slow answer, a miss or a repeat breaks it', () => {
    expect(autoTrivial([1, 2, 3, 4].map(i => a(i)).concat(a(5, { timeMs: 30000 }))).size).toBe(0)
    expect(autoTrivial([1, 2, 3, 4].map(i => a(i)).concat(a(5, { correct: false }))).size).toBe(0)
    expect(autoTrivial([1, 2, 3, 4].map(i => a(i)).concat(a(5, { itemId: 'i1' }))).size).toBe(0)
  })
})
