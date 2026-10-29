// Missions: progress tracking for the course map (docs/missions-design.md).
// A mission is a strand; a block is a skill node; a node's level is READ from the evidence the rest of the app already keeps
// (first attempts, cue weights, the "reliable" rule in mastery.ts), never counted separately, so it cannot drift.
import type { Attempt } from '../db'
import type { Item, Skill } from '../types'
import type { Mastery } from './mastery'
import { prereqMet, statusOf, type NodeStatus, type Placement } from './progress'
import { pickFresh, shuffled } from './select'

export type Level = 0 | 1 | 2 | 3 | 4
export const LEVEL_NAMES = ['Not started', 'Seen', 'Level one', 'Level two', 'Mastered'] as const
export const LEVEL_HELP = [
  'No lesson viewed and no exercise tried.',
  'You have viewed the lesson or tried exercises, but the evidence is not yet reliable.',
  'The idea is reliable when it is named or cued (depth D1).',
  'The idea is reliable in unlabelled positions where nobody names it (depth D2).',
  'Reliable in the exercises at the deepest depth, and not due for a refresher. This is mastery in training: it is not yet shown in your own games.',
] as const
export const STRAND_NAMES: Record<string, string> = {
  S1: 'Rules and board vision', S2: 'Safety and the thinking loop', S3: 'Tactics', S4: 'Calculation', S5: 'Positional play and planning',
  S6: 'Attack, sacrifice and defense', S7: 'Endgames', S8: 'Openings and structures', S9: 'Game study', S10: 'Practical performance', S11: 'Self-direction',
}
export const TIER_GLOSS = [
  'Plays a legal game', 'Does not hang pieces, mates simply', 'Sees basic tactics, develops sensibly', 'Holds a plan, short calculation, simple pawn endings',
  'Compares resulting positions, uses structures', 'Allocates depth, prophylaxis, transitions', 'Rigorous calculation, independent analysis', 'Original research and preparation',
]

export interface MissionContext {
  masteries: Map<string, Mastery>
  placement: Placement
  skillById: Map<string, Skill>
  /** node id -> depths that have exercises, e.g. ['D1','D2'] */
  itemDepths: Map<string, string[]>
  /** nodes whose lesson (main skill or 'also') has been finished / exists */
  lessonDone: ReadonlySet<string>
  hasLesson: ReadonlySet<string>
  /** Skill-depth keys whose exercises are all cued (manifest.cued_only). */
  cuedOnly?: ReadonlySet<string>
  now?: number
}

export interface NodeProgress {
  id: string; title: string; strand: string; tier: number
  /** From evidence the learner produced (answers, finished lessons). Skills only assumed from a placement or warm-up do not raise it. */
  level: Level
  /** The level if the assumed depths were taken as met. Equal to `level` when nothing is assumed. */
  levelWithAssumed: Level
  /** The deepest depth that has exercises has only cued ones (cue 1-2), so Level two or Mastered here means "reliable when named or cued". */
  cuedTop: boolean
  due: boolean
  assumed: boolean
  lessonDone: boolean
  hasLesson: boolean
  noExercises: boolean
  depths: { depth: string; status: NodeStatus; hasItems: boolean }[]
  workingDepth: string | null
  lastTs: number | null
}

const depthNum = (d: string) => Number(d.slice(1))

export function nodeProgress(skill: Skill, ctx: MissionContext): NodeProgress {
  const id = skill.id
  const items = (ctx.itemDepths.get(id) ?? []).filter(d => depthNum(d) <= 3).sort()
  const depthNames = Object.keys(skill.depths).filter(d => depthNum(d) >= 1 && depthNum(d) <= 3).sort()
  const statuses = depthNames.map(d => ({ depth: d, status: statusOf(`${id}.${d}`, ctx.skillById, ctx.masteries, ctx.placement), hasItems: items.includes(d) }))
  const st = (d: string) => statuses.find(s => s.depth === d)?.status ?? 'unseen'
  /** What the learner's own evidence says about a depth, ignoring assumptions. */
  const own = (d: string): NodeStatus => { const m = ctx.masteries.get(`${id}.${d}`); return m && m.state !== 'unseen' ? m.state : 'unseen' }
  const lessonDone = ctx.lessonDone.has(id)
  const lastTs = Math.max(0, ...depthNames.map(d => ctx.masteries.get(`${id}.${d}`)?.lastTs ?? 0)) || null
  // A refresher is due when a depth is overdue and no deeper depth has been shown reliable since (a fresh deep answer covers the shallow one).
  const due = statuses.some((s, k) => s.status === 'refresh' && !statuses.slice(k + 1).some(t => t.status === 'reliable'))
  const assumed = statuses.some(s => s.status === 'assumed')
  const top = items[items.length - 1]
  const hasD1 = depthNames.includes('D1'), hasD2 = depthNames.includes('D2')

  const levelFrom = (status: (d: string) => NodeStatus): Level => {
    const okLike = (s: NodeStatus) => s === 'reliable' || s === 'refresh' || s === 'assumed'
    // A depth with no exercises is met when a deeper depth that has exercises is: the deeper evidence covers it.
    const met = (d: string) => okLike(status(d)) || (!items.includes(d) && items.some(x => depthNum(x) > depthNum(d) && okLike(status(x))))
    let level: Level = 0
    if (depthNames.some(d => status(d) !== 'unseen') || lessonDone) level = 1
    if (hasD1 && met('D1')) level = 2
    if (hasD2 && met('D2')) level = 3
    if (top && status(top) === 'reliable' && level >= (items.includes('D2') ? 3 : 2)) level = due ? 3 : 4 // mastered needs real evidence at the deepest practised depth, and a refresher not overdue
    if (!top) level = Math.min(level, 1) as Level // no exercises: only "Seen" can be earned, by finishing the lesson
    return level
  }
  const level = levelFrom(own)
  const levelWithAssumed = Math.max(level, levelFrom(d => st(d))) as Level

  let working: string | null = null
  if (top) working = items.find(d => st(d) !== 'reliable') ?? top
  return { id, title: skill.title, strand: skill.strand, tier: skill.tier, level, levelWithAssumed, cuedTop: !!top && !!ctx.cuedOnly?.has(`${id}.${top}`), due, assumed, lessonDone, hasLesson: ctx.hasLesson.has(id), noExercises: !top, depths: statuses, workingDepth: working, lastTs }
}

export interface Mission {
  strand: string; name: string; nodes: NodeProgress[]
  /** Average level of what the learner has shown, as a percentage. */
  percent: number
  /** The same if assumed skills were confirmed: percent <= percentWithAssumed. */
  percentWithAssumed: number
  /** Skills that raise the second figure but not the first. */
  assumedCount: number
  counts: number[]; tiers: { tier: number; gloss: string; nodes: NodeProgress[] }[]
}

const meanPercent = (nodes: NodeProgress[], pick: (n: NodeProgress) => number) => (nodes.length ? Math.round((100 * nodes.reduce((s, n) => s + pick(n), 0)) / (4 * nodes.length)) : 0)

/** Teaching order inside a tier: how long the chain of hard prerequisites beneath the node is, then title. */
export function chainLevels(skills: Skill[]): Map<string, number> {
  const byId = new Map(skills.map(s => [s.id, s]))
  const memo = new Map<string, number>()
  const walk = (id: string, seen: Set<string>): number => {
    if (memo.has(id)) return memo.get(id)!
    if (seen.has(id)) return 0
    seen.add(id)
    let m = 0
    for (const d of Object.values(byId.get(id)?.depths ?? {})) for (const p of d.prereqs ?? []) {
      const nid = p.slice(0, p.lastIndexOf('.'))
      if (nid !== id && byId.has(nid)) m = Math.max(m, walk(nid, seen) + 1)
    }
    seen.delete(id); memo.set(id, m); return m
  }
  for (const s of skills) walk(s.id, new Set())
  return memo
}

export function buildMissions(skills: Skill[], ctx: MissionContext): Mission[] {
  const order = chainLevels(skills)
  const strands = [...new Set(skills.map(s => s.strand))].sort((a, b) => Number(a.slice(1)) - Number(b.slice(1)))
  return strands.map(strand => {
    const nodes = skills.filter(s => s.strand === strand).map(s => nodeProgress(s, ctx))
      .sort((a, b) => a.tier - b.tier || (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0) || a.title.localeCompare(b.title))
    const counts = [0, 0, 0, 0, 0]
    for (const n of nodes) counts[n.level]++
    const percent = meanPercent(nodes, n => n.level)
    const tiers = [...new Set(nodes.map(n => n.tier))].sort((a, b) => a - b).map(tier => ({ tier, gloss: TIER_GLOSS[tier] ?? '', nodes: nodes.filter(n => n.tier === tier) }))
    return { strand, name: STRAND_NAMES[strand] ?? strand, nodes, percent, percentWithAssumed: meanPercent(nodes, n => n.levelWithAssumed), assumedCount: nodes.filter(n => n.levelWithAssumed > n.level).length, counts, tiers }
  })
}

/** The whole course as one mission: the same wheel, counts, challenge and suggestions, across every strand. */
export function overallMission(missions: Mission[]): Mission {
  const nodes = missions.flatMap(m => m.nodes)
  const counts = [0, 0, 0, 0, 0]
  for (const n of nodes) counts[n.level]++
  return { strand: 'all', name: 'All missions', nodes, percent: meanPercent(nodes, n => n.level), percentWithAssumed: meanPercent(nodes, n => n.levelWithAssumed), assumedCount: nodes.filter(n => n.levelWithAssumed > n.level).length, counts, tiers: [] }
}

/** "Skills up next": started skills first, then the lowest tier; only where the prerequisites of the working depth are met. */
export function skillsUpNext(mission: Mission, ctx: MissionContext, dismissed: ReadonlySet<string>, limit = 6): NodeProgress[] {
  const ok = mission.nodes.filter(n => !dismissed.has(n.id) && (n.level < 4 || n.due) && !n.noExercises)
    .filter(n => {
      const d = n.workingDepth ? ctx.skillById.get(n.id)?.depths[n.workingDepth] : undefined
      return (d?.prereqs ?? []).every(p => p.startsWith(n.id + '.') || prereqMet(p, ctx.skillById, ctx.masteries, ctx.placement, k => (ctx.itemDepths.get(k.slice(0, k.lastIndexOf('.'))) ?? []).includes(k.slice(k.lastIndexOf('.') + 1)), s => ctx.lessonDone.has(s), s => ctx.hasLesson.has(s)))
    })
  // refreshers first, then skills already started, then ones the learner has not claimed (assumed skills last: they are confirmed by practice, but they are not the first thing to do), by tier
  ok.sort((a, b) => Number(b.due) - Number(a.due) || Number(b.level >= 1) - Number(a.level >= 1) || Number(a.levelWithAssumed > a.level) - Number(b.levelWithAssumed > b.level) || a.tier - b.tier || a.level - b.level)
  return ok.slice(0, limit)
}

export const CHALLENGE_GAP_MS = 12 * 3600 * 1000
/** One seed for the day, so the skills Today names are the ones the Course page offers. */
export const challengeSeed = (strand: string, lastChallenge: number | null, day = new Date().toDateString()) => `${day}:${strand}:${lastChallenge ?? 0}`
export interface ChallengePlan { unlocked: boolean; reason: string; picks: { node: NodeProgress; items: Item[] }[] }

/**
 * Mastery challenge: 6 questions on 3 skills, 2 each, unlabelled, fresh, chosen for staleness and level, one mastered skill at
 * most (a retention check). Unlocks when 3 skills have been started and 12 hours have passed since the last challenge.
 */
export function planChallenge(nodes: NodeProgress[], items: Item[], attempts: Attempt[], lastChallengeTs: number | null, now: number, seed: string): ChallengePlan {
  const bySkill = new Map<string, Item[]>()
  for (const i of items) { if (i.cue >= 3) bySkill.set(i.skill, [...(bySkill.get(i.skill) ?? []), i]) }
  /** Unlabelled exercises for the node at the depth to test: at least two, from at least two different positions. */
  const usablePool = (n: NodeProgress): Item[] => {
    for (const d of [n.workingDepth, ...n.depths.map(x => x.depth).reverse()].filter((x): x is string => !!x)) {
      const pool = bySkill.get(`${n.id}.${d}`) ?? []
      if (pool.length >= 2 && new Set(pool.map(i => i.family)).size >= 2) return pool
    }
    return []
  }
  // "Started" means the learner has answered exercises in it (a finished lesson alone has no date to rank by, and an assumed skill has no
  // evidence) and the challenge has something to ask about it.
  const started = nodes.filter(n => n.level >= 1 && !n.noExercises && n.lastTs !== null && usablePool(n).length > 0)
  if (started.length < 3) return { unlocked: false, reason: `Practise at least 3 skills first (${started.length} so far).`, picks: [] }
  if (lastChallengeTs !== null && now - lastChallengeTs < CHALLENGE_GAP_MS) {
    const h = Math.ceil((CHALLENGE_GAP_MS - (now - lastChallengeTs)) / 3600000)
    return { unlocked: false, reason: `Another challenge opens in about ${h} hour${h === 1 ? '' : 's'}. The gap is on purpose: spaced review works better than back-to-back review. Ordinary practice is open any time.`, picks: [] }
  }
  const rank = (n: NodeProgress) => (n.due ? 0 : 1) * 1e15 + (n.lastTs ?? 0) + (n.level < 4 ? 0 : 5e14) // due first, then stalest; mastered ones come last (a higher rank sorts later)
  const ordered = [...started].sort((a, b) => rank(a) - rank(b))
  const picks: ChallengePlan['picks'] = []
  let mastered = 0
  for (const n of shuffled(ordered.slice(0, 12), seed).sort((a, b) => rank(a) - rank(b))) {
    if (picks.length >= 3) break
    if (n.level === 4 && mastered >= 1) continue
    const pool = usablePool(n)
    const chosen = pickFresh(pool, attempts, 2, `${seed}:${n.id}`)
    if (chosen.length < 2 || chosen[0].family === chosen[1].family) continue // two variants of one position test memory, not the skill
    if (n.level === 4) mastered++
    picks.push({ node: n, items: chosen })
  }
  if (picks.length < 3) return { unlocked: false, reason: 'Not enough fresh unlabelled exercises yet for three of your skills.', picks: [] }
  return { unlocked: true, reason: 'Ready: six questions on three skills.', picks }
}

/** What a challenge result means for one skill (two questions): both right is evidence for, both wrong is evidence against. */
export function challengeVerdict(rights: number, questions = 2): 'up' | 'same' | 'down' {
  if (rights >= questions) return 'up'
  if (rights === 0) return 'down'
  return 'same'
}
