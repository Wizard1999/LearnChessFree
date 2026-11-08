import { describe, expect, it } from 'vitest'
import type { Item } from '../types'
import { pickFresh, planTestSet } from './select'

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

describe('planTestSet: training-plan baseline and check are strict about families', () => {
  const big = [...pool, item('b2', 'B'), item('c1', 'C'), item('d1', 'D'), item('d2', 'D')]
  const fam = (id: string) => big.find(i => i.id === id)?.family
  it('the baseline never repeats a family and may come back shorter than asked', () => {
    const got = planTestSet(big, [], 'baseline', undefined, fam, 8, 'p')
    expect(got).toHaveLength(4)
    expect(new Set(got.map(i => i.family)).size).toBe(got.length)
  })
  it('the check leaves out every exercise and every family used at baseline', () => {
    const got = planTestSet(big, [], 'check', { itemIds: ['a1', 'b1'] }, fam, 8, 'p')
    expect(got.map(i => i.family).sort()).toEqual(['C', 'D'])
  })
  it('the check is empty, not padded, when baseline used every family', () => {
    expect(planTestSet(big, [], 'check', { itemIds: ['a1', 'b1', 'c1', 'd1'] }, fam, 8, 'p')).toEqual([])
  })
})
