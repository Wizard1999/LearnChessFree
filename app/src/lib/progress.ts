import { useLiveQuery } from 'dexie-react-hooks'
import { db, kvGet, type Attempt, type LessonProgress } from '../db'
import { masteryOf, type Mastery } from './mastery'
import type { ContentBundle, Lesson, Skill } from '../types'
import { splitSkillKey } from '../types'

export interface Placement { done: boolean; frontierTier: number; ts: number; byTier: Record<number, { n: number; ok: number }>; /** The learner chose not to take the test: nothing is assumed, lessons start from the beginning. */ skipped?: boolean }
export const NO_PLACEMENT: Placement = { done: false, frontierTier: 0, ts: 0, byTier: {} }

export function useAttempts(): Attempt[] | undefined { return useLiveQuery(() => db.attempts.toArray(), []) }
export function useLessonProgress(): LessonProgress[] | undefined { return useLiveQuery(() => db.lessonProgress.toArray(), []) }
export function usePlacement(): Placement | undefined { return useLiveQuery(() => kvGet<Placement>('placement', NO_PLACEMENT), []) }

export function groupBySkillKey(attempts: Attempt[]): Map<string, Attempt[]> {
  const m = new Map<string, Attempt[]>()
  for (const a of attempts) { const l = m.get(a.skillKey) ?? []; l.push(a); m.set(a.skillKey, l) }
  return m
}
export function masteryMap(attempts: Attempt[], now = Date.now()): Map<string, Mastery> {
  const out = new Map<string, Mastery>()
  for (const [k, v] of groupBySkillKey(attempts)) out.set(k, masteryOf(v, { now }))
  return out
}

export type NodeStatus = 'unseen' | 'introduced' | 'practising' | 'reliable' | 'refresh' | 'assumed'
/** Status of a skill-depth. "assumed" = placement put the learner above this tier but nothing has been shown yet. */
export function statusOf(key: string, skills: Map<string, Skill>, masteries: Map<string, Mastery>, placement: Placement): NodeStatus {
  const m = masteries.get(key)
  if (m && m.state !== 'unseen') return m.state
  const { skill } = splitSkillKey(key)
  const tier = skills.get(skill)?.tier
  if (placement.done && tier !== undefined && tier < placement.frontierTier) return 'assumed'
  return 'unseen'
}
export const isMet = (s: NodeStatus) => s === 'reliable' || s === 'refresh' || s === 'assumed' || s === 'practising'

export function lessonSort(a: Lesson, b: Lesson, skills: Map<string, Skill>) {
  const ta = skills.get(a.skill)?.tier ?? 9
  const tb = skills.get(b.skill)?.tier ?? 9
  return ta - tb || a.skill.localeCompare(b.skill) || a.depth.localeCompare(b.depth) || a.id.localeCompare(b.id)
}

/** Lessons whose prerequisites are met, not yet finished, in curriculum order. */
export function nextLessons(c: ContentBundle, masteries: Map<string, Mastery>, placement: Placement, progress: LessonProgress[], limit = 3): Lesson[] {
  const done = new Set(progress.filter(p => p.done).map(p => p.lessonId))
  const sorted = [...c.lessons].sort((a, b) => lessonSort(a, b, c.skillById))
  const out: Lesson[] = []
  for (const l of sorted) {
    if (done.has(l.id)) continue
    const sk = c.skillById.get(l.skill)
    const pre = sk?.depths?.[l.depth]?.prereqs ?? []
    const ok = pre.every(p => isMet(statusOf(p, c.skillById, masteries, placement)))
    // a placement above this tier means the beginner version is not needed unless the learner asks for it
    const skipped = placement.done && sk && sk.tier < placement.frontierTier - 1 && statusOf(`${l.skill}.${l.depth}`, c.skillById, masteries, placement) === 'assumed'
    if (ok && !skipped) out.push(l)
    if (out.length >= limit) break
  }
  return out
}

/** Independence ledger: how often the learner got it right unprompted (cue >= 3, no hints) in the last N attempts. */
export function independence(attempts: Attempt[], last = 60) {
  const recent = attempts.filter(a => a.firstAttempt).slice(-last)
  const cued = recent.filter(a => a.cue >= 3)
  const unprompted = cued.filter(a => a.hints === 0)
  const withConf = cued.filter(a => a.confidence)
  let calibration: number | null = null
  if (withConf.length >= 8) {
    const target = { low: 0.4, medium: 0.7, high: 0.9 } as const
    calibration = withConf.reduce((s, a) => s + Math.abs(target[a.confidence!] - (a.correct ? 1 : 0)), 0) / withConf.length
  }
  return {
    counted: recent.length,
    hintRate: cued.length ? 1 - unprompted.length / cued.length : null,
    unpromptedAccuracy: unprompted.length ? unprompted.filter(a => a.correct).length / unprompted.length : null,
    calibrationError: calibration,
  }
}
