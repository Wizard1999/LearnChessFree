import { describe, expect, it } from 'vitest'
import { afterMixedItem, EMPTY_LOOP, offeredLevels, RETIRE_AFTER } from './loop'

describe('offeredLevels', () => {
  it('offers only levels whose lesson is done and not retired', () => {
    expect(offeredLevels(EMPTY_LOOP, new Set())).toEqual([])
    expect(offeredLevels(EMPTY_LOOP, new Set(['L-LOOP-V1-1', 'L-LOOP-V3-1']))).toEqual(['V1', 'V3'])
    expect(offeredLevels({ retired: { V1: true }, streak: {} }, new Set(['L-LOOP-V1-1']))).toEqual([])
  })
})

describe('afterMixedItem', () => {
  it('retires a level after RETIRE_AFTER closed solves in a row', () => {
    let s = EMPTY_LOOP
    for (let i = 0; i < RETIRE_AFTER; i++) s = afterMixedItem(s, ['V1'], true, false)
    expect(s.retired.V1).toBe(true)
  })
  it('resets the streak when the prompt was opened or the item was missed', () => {
    let s = afterMixedItem(EMPTY_LOOP, ['V1'], true, false)
    s = afterMixedItem(s, ['V1'], true, true)
    expect(s.streak.V1).toBe(0)
    s = afterMixedItem(afterMixedItem(s, ['V1'], true, false), ['V1'], false, false)
    expect(s.streak.V1).toBe(0)
    expect(s.retired.V1).toBeUndefined()
  })
  it('does not change levels that were not offered', () => {
    const s = afterMixedItem(EMPTY_LOOP, ['V1'], true, false)
    expect(s.streak.V2).toBeUndefined()
  })
})
