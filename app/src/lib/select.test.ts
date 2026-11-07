import { describe, expect, it } from 'vitest'
import type { Item } from '../types'
import { pickFresh } from './select'

const item = (id: string, family: string): Item => ({ id, family, cue: 3, skill: 'X.D2' } as unknown as Item)
const pool = [item('a1', 'A'), item('a2', 'A'), item('a3', 'A'), item('b1', 'B')]

describe('pickFresh strictFamilies', () => {
  it('by default tops up a short set from families already chosen', () => {
    const got = pickFresh(pool, [], 4, 's')
    expect(got).toHaveLength(4)
  })
  it('strict: never repeats a family, so the set comes back shorter', () => {
    const got = pickFresh(pool, [], 4, 's', { strictFamilies: true })
    expect(got).toHaveLength(2)
    expect(new Set(got.map(i => i.family)).size).toBe(2)
  })
  it('excludeFamilies keeps families out entirely', () => {
    const got = pickFresh(pool, [], 2, 's', { strictFamilies: true, excludeFamilies: new Set(['A']) })
    expect(got.map(i => i.id)).toEqual(['b1'])
  })
})
