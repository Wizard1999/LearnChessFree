import { describe, expect, it } from 'vitest'
import type { Item } from '../types'
import { buildMissions, type MissionContext } from './missions'
import { concludeWarmup, planWarmup, plannedPerTier, shouldStop } from './warmup'

describe('concludeWarmup', () => {
  it('assumes tiers below the first tier that was not comfortable', () => {
    const r = concludeWarmup([{ tier: 2, ok: true }, { tier: 2, ok: true }, { tier: 2, ok: false }, { tier: 3, ok: false }, { tier: 3, ok: false }], 5)
    expect(r.frontierTier).toBe(3) // tier 2: 2 of 3 = 0.67 passes, tier 3 fails
    expect(r.byTier[3]).toEqual({ n: 2, ok: 0 })
  })
  it('assumes nothing when the first tier is not comfortable', () => {
    expect(concludeWarmup([{ tier: 1, ok: false }, { tier: 1, ok: false }], 0).frontierTier).toBe(1)
  })
  it('never assumes the top tier that was tested', () => {
    expect(concludeWarmup([{ tier: 2, ok: true }, { tier: 3, ok: true }, { tier: 4, ok: true }], 0).frontierTier).toBe(4)
  })
})

describe('shouldStop', () => {
  const planned = new Map([[2, 2], [3, 2], [4, 2]])
  it('stops after two finished tiers in a row went badly', () => {
    const r = [{ tier: 2, ok: false }, { tier: 2, ok: false }, { tier: 3, ok: false }, { tier: 3, ok: true }]
    expect(shouldStop(r, planned)).toBe(true)
  })
  it('keeps going after one weak tier, or while a tier is unfinished', () => {
    expect(shouldStop([{ tier: 2, ok: false }, { tier: 2, ok: false }, { tier: 3, ok: false }], planned)).toBe(false)
    expect(shouldStop([{ tier: 2, ok: false }, { tier: 2, ok: false }, { tier: 3, ok: true }, { tier: 3, ok: true }], planned)).toBe(false)
  })
})

describe('planWarmup', () => {
  const skills = [2, 2, 3, 3, 4].map((tier, i) => ({ id: `K${i}`, title: `K${i}`, strand: 'S3', tier, depths: { D1: { outcome: 'does it', prereqs: [] }, D2: { outcome: 'does it', prereqs: [] } } }))
  const ctx = { masteries: new Map(), placement: { done: false, frontierTier: 0, ts: 0, byTier: {} }, skillById: new Map(skills.map(s => [s.id, s])), itemDepths: new Map(skills.map(s => [s.id, ['D2']])), lessonDone: new Set<string>(), hasLesson: new Set<string>() } as unknown as MissionContext
  const mission = buildMissions(skills as never, ctx)[0]
  const items = skills.flatMap(s => [1, 2].map(n => ({ id: `${s.id}-${n}`, skill: `${s.id}.D2`, cue: 3, family: `${s.id}-${n}` } as unknown as Item)))
  it('asks one question per node, easiest tier first, never two for the same node', () => {
    const p = planWarmup(mission, items, [], 'seed')
    expect(p.items).toHaveLength(5)
    expect(new Set(p.items.map(i => i.skill)).size).toBe(5)
    const tiers = p.items.map(i => p.tierOf.get(i.id)!)
    expect([...tiers].sort((a, b) => a - b)).toEqual(tiers)
    expect([...plannedPerTier(p).entries()].sort()).toEqual([[2, 2], [3, 2], [4, 1]])
  })
})
