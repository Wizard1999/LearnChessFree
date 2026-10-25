import { describe, expect, it } from 'vitest'
import type { Attempt } from '../db'
import type { Skill } from '../types'
import { evidenceAttempts, masteryMap, statusOf, type Placement } from './progress'

const att = (o: Partial<Attempt>): Attempt => ({ itemId: 'i', skillKey: 'N.D2', cue: 3, family: 'f', correct: true, firstAttempt: true, hints: 0, timeMs: 1, source: 'practice', ts: 1, unprompted: true, ...o })

describe('test-out attempts carry no penalty on unpractised skills', () => {
  it('drops wrong warm-up and placement answers when the skill was never practised', () => {
    const a = [att({ source: 'warmup', correct: false, ts: 1 }), att({ source: 'placement', correct: false, ts: 2 }), att({ source: 'warmup', correct: true, ts: 3 })]
    expect(evidenceAttempts(a).map(x => x.ts)).toEqual([3])
  })
  it('keeps wrong warm-up answers once the learner has practised the skill', () => {
    const a = [att({ source: 'practice', correct: true, ts: 1 }), att({ source: 'warmup', correct: false, ts: 2 })]
    expect(evidenceAttempts(a)).toHaveLength(2)
  })
  it('keeps every real-practice failure', () => {
    expect(evidenceAttempts([att({ source: 'practice', correct: false }), att({ source: 'challenge', correct: false, ts: 2 })])).toHaveLength(2)
  })
  it('does not let a wrong warm-up answer move the mastery estimate', () => {
    const none = masteryMap([att({ source: 'warmup', correct: false })])
    expect(none.get('N.D2')).toBeUndefined()
    const right = masteryMap([att({ source: 'warmup', correct: true })])
    expect(right.get('N.D2')?.n).toBe(1)
  })
})

describe('strand warm-ups override the overall placement for that strand', () => {
  const skills = new Map<string, Skill>([['N', { id: 'N', title: 'N', strand: 'S3', tier: 2, depths: {} } as Skill], ['M', { id: 'M', title: 'M', strand: 'S7', tier: 2, depths: {} } as Skill]])
  const base: Placement = { done: false, frontierTier: 0, ts: 0, byTier: {} }
  it('assumes skills below a strand frontier only in that strand', () => {
    const p: Placement = { ...base, byStrand: { S3: { frontierTier: 3, ts: 1, byTier: {} } } }
    expect(statusOf('N.D1', skills, new Map(), p)).toBe('assumed')
    expect(statusOf('M.D1', skills, new Map(), p)).toBe('unseen')
  })
  it('lets a strand result lower the assumption made by an overall placement', () => {
    const p: Placement = { ...base, done: true, frontierTier: 4, byStrand: { S3: { frontierTier: 0, ts: 1, byTier: {} } } }
    expect(statusOf('N.D1', skills, new Map(), p)).toBe('unseen')
    expect(statusOf('M.D1', skills, new Map(), p)).toBe('assumed')
  })
})
