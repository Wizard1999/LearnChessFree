import { describe, expect, it } from 'vitest'
import type { Attempt } from '../db'
import type { Skill } from '../types'
import { evidenceAttempts, frontierFor, independence, masteryMap, prereqMet, statusOf, type Placement } from './progress'

const att = (o: Partial<Attempt>): Attempt => ({ itemId: 'i', skillKey: 'N.D2', cue: 3, family: o.itemId ?? 'i', correct: true, firstAttempt: true, hints: 0, timeMs: 1, source: 'practice', ts: 1, unprompted: true, ...o })

describe('test-out attempts carry no penalty on unpracticed skills', () => {
  it('drops wrong warm-up and placement answers when the skill was never practiced', () => {
    const a = [att({ source: 'warmup', correct: false, ts: 1 }), att({ source: 'placement', correct: false, ts: 2 }), att({ source: 'warmup', correct: true, ts: 3 })]
    expect(evidenceAttempts(a).map(x => x.ts)).toEqual([3])
  })
  it('keeps wrong warm-up answers once the learner has practiced the skill', () => {
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

describe('assumed skills hold until the evidence says otherwise', () => {
  const N = { id: 'N', title: 'N', strand: 'S3', tier: 2, depths: {} } as Skill
  const skills = new Map<string, Skill>([['N', N]])
  const placed: Placement = { done: true, frontierTier: 4, ts: 10, byTier: {} }
  it('a few right answers leave a skill assumed instead of lowering it to "seen"', () => {
    const m = masteryMap([att({ cue: 1, source: 'lesson', ts: 20 })])
    expect(statusOf('N.D2', skills, m, placed)).toBe('assumed')
  })
  it('a miss on real practice replaces the assumption with what was seen', () => {
    const m = masteryMap([att({ correct: false, source: 'practice', ts: 20 }), att({ itemId: 'j', correct: false, source: 'practice', ts: 21 })])
    expect(statusOf('N.D2', skills, m, placed)).not.toBe('assumed')
  })
})

describe('which frontier applies', () => {
  const N = { id: 'N', title: 'N', strand: 'S3', tier: 2, depths: {} } as Skill
  const warm = { frontierTier: 1, ts: 50, byTier: {} }
  it('uses the newer of the strand warm-up and the overall placement', () => {
    expect(frontierFor(N, { done: true, frontierTier: 4, ts: 10, byTier: {}, byStrand: { S3: warm } })).toBe(1) // warm-up is newer
    expect(frontierFor(N, { done: true, frontierTier: 4, ts: 90, byTier: {}, byStrand: { S3: warm } })).toBe(4) // a retaken placement is newer
  })
  it('a skipped placement does not cancel a warm-up', () => {
    expect(frontierFor(N, { done: true, skipped: true, frontierTier: 0, ts: 90, byTier: {}, byStrand: { S3: warm } })).toBe(1)
  })
})

describe('prerequisites on depths that have no exercises', () => {
  const skills = new Map<string, Skill>([['H', { id: 'H', title: 'H', strand: 'S11', tier: 1, depths: {} } as Skill]])
  const none: Placement = { done: false, frontierTier: 0, ts: 0, byTier: {} }
  const call = (hasItems: boolean, done: boolean, lesson: boolean) => prereqMet('H.D2', skills, new Map(), none, () => hasItems, () => done, () => lesson)
  it("are met by finishing the skill's lesson, and not before", () => {
    expect(call(false, false, true)).toBe(false)
    expect(call(false, true, true)).toBe(true)
  })
  it('do not block when nothing at all can be done about them', () => expect(call(false, false, false)).toBe(true))
  it('still need real evidence when the depth has exercises', () => expect(call(true, true, true)).toBe(false))
})

describe('independence(): confidence is accuracy by band, with sample sizes', () => {
  const conf = (n: number, confidence: 'low' | 'medium' | 'high', correct: boolean, off = 0) =>
    Array.from({ length: n }, (_, i) => att({ itemId: `${confidence}${correct}${off}${i}`, confidence, correct, ts: off + i + 1 }))
  it('reports no accuracy for a band with fewer than 8 answers', () => {
    const r = independence([...conf(7, 'high', true)])
    const high = r.confidenceBands.find(b => b.band === 'high')!
    expect(high).toMatchObject({ n: 7, correct: 7, enough: false, accuracy: null })
  })
  it('reports accuracy once a band has 8 answers, separately per band', () => {
    const r = independence([...conf(6, 'high', true), ...conf(2, 'high', false, 100), ...conf(8, 'low', false, 200)])
    expect(r.confidenceBands.find(b => b.band === 'high')).toMatchObject({ n: 8, correct: 6, accuracy: 0.75, enough: true })
    expect(r.confidenceBands.find(b => b.band === 'low')).toMatchObject({ accuracy: 0 })
    expect(r.confidenceBands.find(b => b.band === 'medium')).toMatchObject({ n: 0, accuracy: null })
    expect(r).not.toHaveProperty('calibrationError')
  })
  it('lists recent high-confidence mistakes, newest first, and not low-confidence ones', () => {
    const r = independence([...conf(1, 'high', false, 10), ...conf(1, 'low', false, 20), ...conf(1, 'high', false, 30)])
    expect(r.highMisses.map(m => m.ts)).toEqual([31, 11])
  })
  it('lesson answers are not unprompted and are left out', () => {
    expect(independence([att({ source: 'lesson', confidence: 'high', correct: false })]).highMisses).toHaveLength(0)
  })
})

describe('guided evidence does not decide a placement-assumed status', () => {
  const skills = new Map<string, Skill>([['N', { id: 'N', title: 'N', strand: 'S3', tier: 2, depths: {} } as Skill]])
  const placed: Placement = { done: true, frontierTier: 4, ts: 1, byTier: {} }
  it('stays assumed after guided successes and independent evidence is still thin', () => {
    const a = [att({ cue: 1, source: 'lesson' }), att({ itemId: 'x', cue: 2 })]
    expect(statusOf('N.D2', skills, masteryMap(a), placed)).toBe('assumed')
  })
  it('is replaced by what was seen once independent answers go badly', () => {
    const a = Array.from({ length: 4 }, (_, i) => att({ itemId: `m${i}`, correct: false, ts: i + 1 }))
    expect(statusOf('N.D2', skills, masteryMap(a), placed)).toBe('practising')
  })
})
