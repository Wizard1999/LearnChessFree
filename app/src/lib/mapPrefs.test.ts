import { describe, expect, it } from 'vitest'
import { ALL_LINKS_KEY, readAllLinks, readSliceColours, SLICE_KEY, writeAllLinks, writeSliceColours } from './mapPrefs'

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

describe('all connections preference', () => {
  it('is off by default, remembers on and off, and survives blocked storage', () => {
    const s = memory(); expect(readAllLinks(s)).toBe(false)
    writeAllLinks(true, s); expect(s.getItem(ALL_LINKS_KEY)).toBe('1'); expect(readAllLinks(s)).toBe(true)
    writeAllLinks(false, s); expect(readAllLinks(s)).toBe(false)
    const bad = { getItem: () => { throw new Error('x') }, setItem: () => { throw new Error('x') } }
    expect(readAllLinks(bad)).toBe(false); expect(() => writeAllLinks(true, bad)).not.toThrow()
  })
  it('is stored apart from the slice colours', () => { const s = memory(); writeSliceColours(true, s); expect(readAllLinks(s)).toBe(false) })
})
