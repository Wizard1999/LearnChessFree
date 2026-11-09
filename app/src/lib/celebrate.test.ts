// @vitest-environment jsdom
import 'fake-indexeddb/auto'
import { describe, expect, it, vi } from 'vitest'
import { bumpToday, celebrate, claimMilestone, claimSilently, completedStages, dayKey, levelRises, subscribeCelebrations, topRise } from './celebrate'
import { kvGet } from '../db'
import { easeOut, eased } from './useAnimatedNumber'

type L = 0 | 1 | 2 | 3 | 4
const m = (o: Record<string, L>) => new Map(Object.entries(o))

describe('level changes', () => {
  it('finds only real rises and the one to celebrate', () => {
    const r = levelRises(m({ a: 1, b: 2, c: 3, d: 0 }), m({ a: 2, b: 2, c: 4, d: 1, e: 4 }))
    expect(r.map(x => x.id).sort()).toEqual(['a', 'c', 'd'])
    expect(topRise(r)?.id).toBe('c')
    expect(topRise([])).toBeNull()
    expect(levelRises(m({ a: 3 }), m({ a: 2 }))).toEqual([]) // a fall is not celebrated
  })
  it('prefers the bigger jump at the same level', () => {
    expect(topRise([{ id: 'x', from: 1, to: 2 }, { id: 'y', from: 0, to: 2 }])?.id).toBe('y')
  })
})

describe('stages', () => {
  const lessons = [{ id: 'a', stage: 'S0' }, { id: 'b', stage: 'S0' }, { id: 'c', stage: 'S1' }, { id: 'd' }]
  it('a stage is complete when every lesson in it is finished, and never when it has none', () => {
    expect([...completedStages(lessons, new Set(['a']))]).toEqual([])
    expect([...completedStages(lessons, new Set(['a', 'b']))]).toEqual(['S0'])
    expect([...completedStages(lessons, new Set(['a', 'b', 'c']))].sort()).toEqual(['S0', 'S1'])
    expect(completedStages([], new Set())).toEqual(new Set())
  })
})

describe('milestones are shown once', () => {
  it('claims a key the first time only, and records silent ones', async () => {
    expect(await claimMilestone('t:one')).toBe(true)
    expect(await claimMilestone('t:one')).toBe(false)
    await claimSilently(['t:two'])
    expect(await claimMilestone('t:two')).toBe(false)
  })
})

describe('the day counts', () => {
  it('add up under a local-date key', async () => {
    expect(dayKey(new Date(2026, 10, 9))).toBe('today:2026-11-09')
    await bumpToday('lessons'); await bumpToday('lessons'); await bumpToday('ups', 3); await bumpToday('ups', 0)
    expect(await kvGet(dayKey(), null)).toEqual({ lessons: 2, ups: 3 })
  })
})

describe('the celebration bus', () => {
  it('delivers each celebration with its own id and stops after unsubscribe', () => {
    const seen: number[] = []
    const off = subscribeCelebrations(c => seen.push(c.id))
    const base = { art: 'glass' as const, fromLevel: 0 as L, toLevel: 2 as L, title: 't', body: 'b', sticky: false }
    celebrate(base); celebrate(base)
    off(); celebrate(base)
    expect(seen).toHaveLength(2); expect(seen[1]).toBeGreaterThan(seen[0])
  })
})

describe('ring easing', () => {
  it('starts at the old value, ends at the new one, rises monotonically and eases out', () => {
    expect(eased(7, 50, 0)).toBe(7); expect(eased(7, 50, 1)).toBe(50)
    let prev = 7
    for (let t = 0.1; t <= 1.0001; t += 0.1) { const v = eased(7, 50, t); expect(v).toBeGreaterThanOrEqual(prev); prev = v }
    expect(easeOut(0.5)).toBeGreaterThan(0.5) // fast first, then settling
    expect(Number.isFinite(eased(0, 100, 2))).toBe(true); expect(eased(0, 100, 2)).toBe(100)
  })
  it('stubbed reduced-motion lookups do not throw', () => { vi.stubGlobal('matchMedia', undefined); expect(easeOut(1)).toBe(1); vi.unstubAllGlobals() })
})
