import { describe, expect, it } from 'vitest'
import { readSliceColours, SLICE_KEY, writeSliceColours } from './mapPrefs'

const memory = () => { const m = new Map<string, string>(); return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v) } }

describe('slice colours preference', () => {
  it('is off by default and when the stored value is odd', () => {
    const s = memory(); expect(readSliceColours(s)).toBe(false)
    s.setItem(SLICE_KEY, 'maybe'); expect(readSliceColours(s)).toBe(false)
  })
  it('remembers on and off', () => {
    const s = memory(); writeSliceColours(true, s); expect(readSliceColours(s)).toBe(true)
    writeSliceColours(false, s); expect(readSliceColours(s)).toBe(false)
  })
  it('never throws when storage is blocked', () => {
    const bad = { getItem: () => { throw new Error('blocked') }, setItem: () => { throw new Error('blocked') } }
    expect(readSliceColours(bad)).toBe(false); expect(() => writeSliceColours(true, bad)).not.toThrow()
  })
})
