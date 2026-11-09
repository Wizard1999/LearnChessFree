import { describe, expect, it } from 'vitest'
import type { Attempt } from '../db'
import type { Item, Skill } from '../types'
import type { Mastery } from './mastery'
import { CHALLENGE_MIN_AGE_MS, LEVEL_HELP, buildMissions, challengeVerdict, nodeProgress, planChallenge, skillsUpNext, summarize, type MissionContext } from './missions'

const skill = (id: string, strand = 'S3', tier = 2, depths: Record<string, string[]> = { D0: [], D1: [], D2: ['X.D1'], D3: ['X.D2'] }): Skill =>
  ({ id, title: id, strand, tier, depths: Object.fromEntries(Object.entries(depths).map(([d, p]) => [d, { outcome: 'does the thing well enough', prereqs: p.map(x => x.replace('X', id)) }])) } as Skill)
const m = (state: Mastery['state'], lastTs = 1000): Mastery => ({ a: 1, b: 1, mean: 0.5, allMean: 0.5, pReliable: 0.5, unlabeledWeight: 5, cuedOnly: false, n: 5, ok: 4, guidedN: 0, lastTs, lastIndependentSuccess: lastTs, successDays: 2, recentMiss: false, wasReliableOn: null, reliableNow: state === 'reliable', state })
const ctxFor = (skills: Skill[], masteries: Record<string, Mastery>, itemDepths: Record<string, string[]>, lessonDone: string[] = []): MissionContext => ({
  masteries: new Map(Object.entries(masteries)), placement: { done: false, frontierTier: 0, ts: 0, byTier: {} },
  skillById: new Map(skills.map(s => [s.id, s])), itemDepths: new Map(Object.entries(itemDepths)), lessonDone: new Set(lessonDone), hasLesson: new Set(lessonDone),
})

describe('node levels come from evidence', () => {
  const F = skill('F')
  it('is Not started with no lesson and no attempts', () => {
    expect(nodeProgress(F, ctxFor([F], {}, { F: ['D1', 'D2'] })).level).toBe(0)
  })
  it('is Seen once the lesson is finished or an exercise tried', () => {
    expect(nodeProgress(F, ctxFor([F], {}, { F: ['D1', 'D2'] }, ['F'])).level).toBe(1)
    expect(nodeProgress(F, ctxFor([F], { 'F.D1': m('practising') }, { F: ['D1', 'D2'] })).level).toBe(1)
  })
  it('climbs with reliable depths and Mastered needs the deepest practiced depth', () => {
    const c1 = ctxFor([F], { 'F.D1': m('reliable') }, { F: ['D1', 'D2'] })
    expect(nodeProgress(F, c1).level).toBe(2)
    const c2 = ctxFor([F], { 'F.D1': m('reliable'), 'F.D2': m('reliable') }, { F: ['D1', 'D2'] })
    expect(nodeProgress(F, c2).level).toBe(4)
    const c3 = ctxFor([F], { 'F.D1': m('reliable'), 'F.D2': m('practising') }, { F: ['D1', 'D2'] })
    expect(nodeProgress(F, c3).level).toBe(2)
  })
  it('a refresher that is due caps Mastered at Level two and flags it', () => {
    const n = nodeProgress(F, ctxFor([F], { 'F.D1': m('reliable'), 'F.D2': m('refresh') }, { F: ['D1', 'D2'] }))
    expect(n.level).toBe(3); expect(n.due).toBe(true)
  })
  it('a node with no exercises can only reach Seen', () => {
    const n = nodeProgress(F, ctxFor([F], {}, {}, ['F']))
    expect(n.level).toBe(1); expect(n.noExercises).toBe(true)
  })
  it('placement-assumed depths are credited separately and never reach Mastered', () => {
    const c = { ...ctxFor([F], {}, { F: ['D1', 'D2'] }), placement: { done: true, frontierTier: 4, ts: 1, byTier: {} } }
    const n = nodeProgress(F, c)
    expect(n.assumed).toBe(true); expect(n.level).toBe(0); expect(n.levelWithAssumed).toBe(3)
  })
  it('assumed credit stays out of the mission percentage and is reported beside it', () => {
    const c = { ...ctxFor([F], {}, { F: ['D1', 'D2'] }), placement: { done: true, frontierTier: 4, ts: 1, byTier: {} } }
    const [mission] = buildMissions([F], c)
    expect(mission.percent).toBe(0); expect(mission.percentWithAssumed).toBe(75); expect(mission.assumedCount).toBe(1)
  })
  it('a depth with no exercises is met when a deeper depth with exercises is reliable', () => {
    const G = skill('G')
    const n = nodeProgress(G, ctxFor([G], { 'G.D2': m('reliable') }, { G: ['D2'] }))
    expect(n.level).toBe(4)
  })
  it('a lower depth that is overdue does not make the node due when the deeper depth is reliable', () => {
    const n = nodeProgress(F, ctxFor([F], { 'F.D1': m('refresh'), 'F.D2': m('reliable') }, { F: ['D1', 'D2'] }))
    expect(n.due).toBe(false); expect(n.level).toBe(4)
  })
})

describe('missions', () => {
  const A = skill('A', 'S3', 2), B = skill('B', 'S3', 3, { D0: [], D1: ['A.D1'], D2: ['B.D1'] }), C = skill('C', 'S4', 3)
  it('groups nodes by strand and tier and computes the percentage', () => {
    const ctx = ctxFor([A, B, C], { 'A.D1': m('reliable'), 'A.D2': m('reliable') }, { A: ['D1', 'D2'], B: ['D1', 'D2'], C: ['D1'] })
    const ms = buildMissions([A, B, C], ctx)
    expect(ms.map(x => x.strand)).toEqual(['S3', 'S4'])
    expect(ms[0].tiers.map(t => t.tier)).toEqual([2, 3])
    expect(ms[0].percent).toBe(50) // A is Mastered (4), B is Not started (0): (4+0)/(4*2)
    expect(ms[0].counts).toEqual([1, 0, 0, 0, 1])
  })
  it('summarizes any set of skills the way a section header shows it, and flags a complete section only when every skill is Mastered', () => {
    const ctx = ctxFor([A, B], { 'A.D1': m('reliable'), 'A.D2': m('reliable') }, { A: ['D1', 'D2'], B: ['D1', 'D2'] })
    const nodes = buildMissions([A, B], ctx)[0].nodes
    const s = summarize(nodes)
    expect(s.percent).toBe(50)
    expect(s.counts).toEqual([1, 0, 0, 0, 1])
    expect(s.complete).toBe(false)
    expect(summarize([nodes[0]]).complete).toBe(true)
    expect(summarize([]).complete).toBe(false)
    expect(summarize([]).percent).toBe(0)
  })
  it('suggests started skills first and only where the prerequisites are met', () => {
    const ctx = ctxFor([A, B], {}, { A: ['D1', 'D2'], B: ['D1', 'D2'] })
    const ms = buildMissions([A, B], ctx)
    expect(skillsUpNext(ms[0], ctx, new Set()).map(n => n.id)).toEqual(['A']) // B needs A.D1 first
    expect(skillsUpNext(ms[0], ctx, new Set(['A'])).map(n => n.id)).toEqual([])
  })
})

describe('spaced repetition (D77)', () => {
  const A2 = skill('A2', 'S3', 2)
  const reliable = (days: number) => ({ ...m('reliable', 5000), successDays: days })
  const level = (days: number) => nodeProgress(A2, ctxFor([A2], { 'A2.D1': reliable(days), 'A2.D2': reliable(days) }, { A2: ['D1', 'D2'] })).level
  it('success on one day cannot reach Mastered: the most it gives is Level two', () => {
    expect(level(1)).toBe(3)
  })
  it('success again on another day reaches Mastered', () => {
    expect(level(2)).toBe(4)
  })
  it('a skill with a single practised depth is held at Level one for the same reason', () => {
    const one = skill('A3', 'S3', 2, { D0: [], D1: [] })
    expect(nodeProgress(one, ctxFor([one], { 'A3.D1': reliable(1) }, { A3: ['D1'] })).level).toBe(2)
    expect(nodeProgress(one, ctxFor([one], { 'A3.D1': reliable(2) }, { A3: ['D1'] })).level).toBe(4)
  })
  it('the level help says why', () => expect(LEVEL_HELP[4]).toMatch(/success again on another day/))
})

describe('mastery challenge', () => {
  const skills = ['P', 'Q', 'R', 'S'].map(id => skill(id))
  const ctx = ctxFor(skills, Object.fromEntries(skills.flatMap(s => [[`${s.id}.D1`, m('practising', 100)]])), Object.fromEntries(skills.map(s => [s.id, ['D1']])))
  const items = skills.flatMap(s => [1, 2, 3].map(n => ({ id: `${s.id}${n}`, skill: `${s.id}.D1`, cue: 3, family: `fam-${s.id}${n}` } as unknown as Item)))
  const nodes = buildMissions(skills, ctx)[0].nodes
  it('stays locked until three skills are started', () => {
    const few = planChallenge(nodes.slice(0, 2), items, [], null, 1e9, 's')
    expect(few.unlocked).toBe(false)
  })
  it('stays locked for 12 hours after the last one and says why', () => {
    const p = planChallenge(nodes, items, [], 1e9 - 3600000, 1e9, 's')
    expect(p.unlocked).toBe(false); expect(p.reason).toMatch(/hour/)
  })
  it('leaves out skills learned or practised less than a day ago and says nothing is ready yet', () => {
    const now = 1e9
    const freshCtx = ctxFor(skills, Object.fromEntries(skills.map(k => [`${k.id}.D1`, m('practising', now - 3600000)])), Object.fromEntries(skills.map(k => [k.id, ['D1']])))
    const justNow = buildMissions(skills, freshCtx)[0].nodes
    const p = planChallenge(justNow, items, [], null, now, 's')
    expect(p.unlocked).toBe(false)
    expect(p.reason).toBe('Nothing is ready to review yet: skills become eligible a day after you learn them.')
    expect(p.picks).toHaveLength(0)
  })
  it('lets a skill in once a day has passed, and counts only the ready ones', () => {
    const now = 1e9
    const mix = ctxFor(skills, { 'P.D1': m('practising', now - CHALLENGE_MIN_AGE_MS - 1), 'Q.D1': m('practising', now - 3600000), 'R.D1': m('practising', now - CHALLENGE_MIN_AGE_MS - 1), 'S.D1': m('practising', now - CHALLENGE_MIN_AGE_MS - 1) }, Object.fromEntries(skills.map(k => [k.id, ['D1']])))
    const ns = buildMissions(skills, mix)[0].nodes
    const p = planChallenge(ns, items, [], null, now, 's')
    expect(p.unlocked).toBe(true)
    expect(p.picks.map(k => k.node.id)).not.toContain('Q') // practised an hour ago
    const two = planChallenge(ns.filter(n => n.id !== 'S'), items, [], null, now, 's')
    expect(two.unlocked).toBe(false)
    expect(two.reason).toMatch(/Only 2 skills are ready to review yet/)
  })
  it('picks three skills with two fresh questions each', () => {
    const p = planChallenge(nodes, items, [] as Attempt[], null, 1e9, 's')
    expect(p.unlocked).toBe(true)
    expect(p.picks).toHaveLength(3)
    for (const k of p.picks) { expect(k.items).toHaveLength(2); expect(new Set(k.items.map(i => i.family)).size).toBe(2) }
    expect(new Set(p.picks.map(k => k.node.id)).size).toBe(3)
  })
  it('both right is up, both wrong is down, one each is the same', () => {
    expect(challengeVerdict(2)).toBe('up'); expect(challengeVerdict(0)).toBe('down'); expect(challengeVerdict(1)).toBe('same')
  })
})
