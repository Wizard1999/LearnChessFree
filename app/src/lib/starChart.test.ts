import { describe, expect, it } from 'vitest'
import { constellationLabel, dustField, pointerTicks, rayPath, roman, rosePath, starSpec } from './starChart'

describe('star size and brightness', () => {
  it('grows and brightens with every level', () => {
    for (let l = 1; l <= 4; l++) {
      expect(starSpec(l).r).toBeGreaterThan(starSpec(l - 1).r)
      expect(starSpec(l).glowOpacity).toBeGreaterThan(starSpec(l - 1).glowOpacity)
    }
  })
  it('not started is a faint dim dot with no glow and nothing lit', () => {
    const s = starSpec(0)
    expect(s.glowR).toBe(0); expect(s.fill).toBe(0); expect(s.rays).toBe(false); expect(s.r).toBeGreaterThan(0)
  })
  it('the lit share fills upward by quarters and only Mastered has rays', () => {
    expect([0, 1, 2, 3, 4].map(l => starSpec(l).fill)).toEqual([0, 0.25, 0.5, 0.75, 1])
    expect([0, 1, 2, 3, 4].map(l => starSpec(l).rays)).toEqual([false, false, false, false, true])
    expect(starSpec(4).rayLen).toBeGreaterThan(starSpec(4).r)
  })
  it('clamps odd input and widens the glow of a lone finished star', () => {
    expect(starSpec(9)).toEqual(starSpec(4)); expect(starSpec(-3)).toEqual(starSpec(0)); expect(starSpec(NaN)).toEqual(starSpec(0))
    expect(starSpec(3, true).glowR).toBeGreaterThan(starSpec(3).glowR)
  })
})

describe('chart labelling', () => {
  it('numbers the rings in Roman numerals', () => {
    expect([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(roman)).toEqual(['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'])
    expect(roman(0)).toBe(''); expect(roman(1.5)).toBe('')
  })
  it('names a constellation by its subject and shows progress; the code stands in only without a name', () => {
    expect(constellationLabel('S3', 'Tactics', 41.6)).toBe('Tactics · 42%')
    expect(constellationLabel('S3', undefined, 0)).toBe('S3 · 0%')
    expect(constellationLabel('S3', '  ', 5)).toBe('S3 · 5%')
  })
  it('draws four pointer ticks and eight rays', () => {
    expect(pointerTicks(24, 8).split('M').length - 1).toBe(4)
    expect(rayPath(30).split('M').length - 1).toBe(8)
  })
})

describe('chart furniture', () => {
  it('the compass rose has sixteen corners', () => { expect(rosePath(60, 38, 10).split('L').length).toBe(16) })
  it('the background dust is the same every time and stays inside its tile', () => {
    const a = dustField(7, 30, 240), b = dustField(7, 30, 240)
    expect(a).toEqual(b); expect(a).toHaveLength(30)
    for (const d of a) { expect(d.x).toBeGreaterThanOrEqual(0); expect(d.x).toBeLessThanOrEqual(240); expect(d.y).toBeLessThanOrEqual(240); expect(d.o).toBeLessThan(0.6) }
    expect(dustField(8, 30, 240)).not.toEqual(a)
  })
})
