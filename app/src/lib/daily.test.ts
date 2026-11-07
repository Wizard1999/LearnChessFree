import { describe, expect, it } from 'vitest'
import type { ContentBundle } from '../types'
import { buildDaily, NO_EXTRAS } from './daily'
import { NO_PLACEMENT } from './progress'

const empty = { items: [], lessons: [], skills: [], skillById: new Map(), itemById: new Map(), lessonById: new Map(), manifest: {}, verified: {} } as unknown as ContentBundle

describe('daily mixed set filler', () => {
  it('a new learner is never filled up with advanced material', () => {
    const skills = [{ id: 'FND.BOARD', tier: 0 }, { id: 'END.LUCENA', tier: 5 }]
    const mk = (id: string, skill: string) => ({ id, skill, cue: 3, family: id, tags: [], position: id, fen: '8/8/8/8/8/8/8/K6k w - - 0 1' })
    const items = [mk('a', 'FND.BOARD.D1'), mk('b', 'END.LUCENA.D1')]
    const c = { ...empty, items, skills, skillById: new Map(skills.map(s => [s.id, s])) } as unknown as ContentBundle
    const plan = buildDaily(c, [], NO_PLACEMENT, [], '2026-11-07', NO_EXTRAS)
    const mixed = plan.find(b => b.id === 'mixed')
    const ids = JSON.stringify(mixed ?? {})
    expect(ids).not.toContain('END.LUCENA')
  })
})

describe('daily plan nudges', () => {
  it('adds the mastery challenge block only when one is unlocked, with the skills named', () => {
    const none = buildDaily(empty, [], NO_PLACEMENT, [], '2026-10-25', NO_EXTRAS)
    expect(none.find(b => b.id === 'challenge')).toBeUndefined()
    const some = buildDaily(empty, [], NO_PLACEMENT, [], '2026-10-25', { ...NO_EXTRAS, challenge: { skills: ['Forks', 'Pins', 'Skewers'] } })
    const b = some.find(x => x.id === 'challenge')
    expect(b?.to).toBe('/course')
    expect(b?.why).toContain('Forks, Pins, Skewers')
  })
  it('always ends with the reflection', () => {
    const blocks = buildDaily(empty, [], NO_PLACEMENT, [], '2026-10-25', { ...NO_EXTRAS, challenge: { skills: ['A', 'B', 'C'] } })
    expect(blocks[blocks.length - 1].id).toBe('reflect')
  })
})
