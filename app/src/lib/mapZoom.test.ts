import { describe, expect, it } from 'vitest'
import { ringLabelPlan, zoomZone } from './mapZoom'

describe('map zoom zones', () => {
  it('is far, mid, then near as the camera comes closer', () => {
    expect([0.25, 1, 1.49].map(zoomZone)).toEqual(['far', 'far', 'far'])
    expect([1.5, 2.4, 3.49].map(zoomZone)).toEqual(['mid', 'mid', 'mid'])
    expect([3.5, 6].map(zoomZone)).toEqual(['near', 'near'])
  })
})
describe('ring label plan', () => {
  it('uses the full title where it fits and the short form where it does not', () => {
    const full = 'Stage 2 · Legal play', short = 'Stage 2'
    expect(ringLabelPlan(2000, 60, [full, short]).text).toBe(full)
    const small = ringLabelPlan(185, 60, [full, short])
    expect(small.text).toBe(short)
    expect(small.size).toBeLessThanOrEqual(60)
  })
  it('never makes a label wider than the arc it may use', () => {
    const p = ringLabelPlan(185, 200, ['Stage 1'])
    expect(p.size * 0.6 * 'Stage 1'.length).toBeLessThanOrEqual(1.5 * 185 + 1e-6)
  })
})

import { ringTextPaths } from './mapZoom'
describe('ringTextPaths (stage text that replaces the dividing lines)', () => {
  const parse = (d: string) => { const m = d.match(/^M(-?[\d.]+),0 A([\d.]+),([\d.]+) 0 0 ([01]) (-?[\d.]+),0$/); if (!m) throw new Error(d); return { x1: +m[1], r: +m[2], sweep: +m[4], x2: +m[5] } }
  it('runs both halves left to right so no letter is upside down', () => {
    const p = ringTextPaths(400, 30)
    const t = parse(p.top), b = parse(p.bottom)
    expect(t.x1).toBeLessThan(0); expect(t.x2).toBeGreaterThan(0)
    expect(b.x1).toBeLessThan(0); expect(b.x2).toBeGreaterThan(0)
    expect(t.sweep).toBe(1) // clockwise over the top
    expect(b.sweep).toBe(0) // counter-clockwise along the bottom
  })
  it('is centred on the boundary circle itself', () => {
    const p = ringTextPaths(400, 30)
    expect((p.rTop + p.rBottom) / 2).toBeCloseTo(400)
    expect(p.rTop).toBeLessThan(400); expect(p.rBottom).toBeGreaterThan(400)
  })
})
