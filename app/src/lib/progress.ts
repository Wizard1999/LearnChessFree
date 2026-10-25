import { useLiveQuery } from 'dexie-react-hooks'
import { db, kvGet, type Attempt, type LessonProgress } from '../db'
import { masteryOf, type Mastery } from './mastery'
import type { ContentBundle, Lesson, Skill } from '../types'
import { splitSkillKey } from '../types'

export interface StrandWarmup { frontierTier: number; ts: number; byTier: Record<number, { n: number; ok: number }> }
export interface Placement {
  done: boolean; frontierTier: number; ts: number; byTier: Record<number, { n: number; ok: number }>
  /** The learner chose not to take the test: nothing is assumed, lessons start from the beginning. */
  skipped?: boolean
  /** Mission warm-ups (test-out within one strand). A strand's own result overrides the overall placement for that strand. */
  byStrand?: Record<string, StrandWarmup>
}
export const NO_PLACEMENT: Placement = { done: false, frontierTier: 0, ts: 0, byTier: {} }

export function useAttempts(): Attempt[] | undefined { return useLiveQuery(() => db.attempts.toArray(), []) }
export function useLessonProgress(): LessonProgress[] | undefined { return useLiveQuery(() => db.lessonProgress.toArray(), []) }
export function usePlacement(): Placement | undefined { return useLiveQuery(() => kvGet<Placement>('placement', NO_PLACEMENT), []) }

export function groupBySkillKey(attempts: Attempt[]): Map<string, Attempt[]> {
  const m = new Map<string, Attempt[]>()
  for (const a of attempts) { const l = m.get(a.skillKey) ?? []; l.push(a); m.set(a.skillKey, l) }
  return m
}
/**
 * Test-out attempts (placement, mission warm-up) carry no penalty on a skill the learner has never practised: a right answer is
 * evidence, a wrong one is only "not yet shown" and is left out. After real practice (lesson, practice, review, challenge, game)
 * every attempt counts, so a warm-up can never lower a skill the learner has worked on.
 */
export function evidenceAttempts(attempts: Attempt[]): Attempt[] {
  const out: Attempt[] = []
  for (const group of groupBySkillKey(attempts).values()) {
    let practised = false
    for (const a of [...group].sort((x, y) => x.ts - y.ts)) {
      const testOut = a.source === 'placement' || a.source === 'warmup'
      if (!testOut) practised = true
      if (testOut && !a.correct && !practised) continue
      out.push(a)
    }
  }
  return out
}

const NO_KEYS: ReadonlySet<string> = new Set()
/** `cuedOnly`: the skill-depth keys that have no exercise at cue 3 or above (from the content manifest). */
export function masteryMap(attempts: Attempt[], now = Date.now(), cuedOnly: ReadonlySet<string> = NO_KEYS): Map<string, Mastery> {
  const out = new Map<string, Mastery>()
  for (const [k, v] of groupBySkillKey(evidenceAttempts(attempts))) out.set(k, masteryOf(v, { now, cuedOnly: cuedOnly.has(k) }))
  return out
}

export type NodeStatus = 'unseen' | 'introduced' | 'practising' | 'reliable' | 'refresh' | 'assumed'

/**
 * The tier below which skills in this skill's strand are assumed: the strand's own warm-up, or the overall placement, whichever is
 * newer. Taking the placement again after a warm-up replaces it (and the other way round). A skipped placement assumes nothing and
 * does not cancel a warm-up.
 */
export function frontierFor(sk: Skill | undefined, placement: Placement): number {
  const strand = sk ? placement.byStrand?.[sk.strand] : undefined
  const overallTs = placement.done && !placement.skipped ? placement.ts : -1
  if (strand && strand.ts >= overallTs) return strand.frontierTier
  return placement.done ? placement.frontierTier : 0
}

/**
 * Status of a skill-depth. "assumed" = placement or a warm-up put the learner above this tier. It holds until the evidence says
 * otherwise: a few right answers (or a lesson) leave it assumed, a miss or a weak record replaces it with what was seen.
 */
export function statusOf(key: string, skills: Map<string, Skill>, masteries: Map<string, Mastery>, placement: Placement): NodeStatus {
  const m = masteries.get(key)
  const { skill } = splitSkillKey(key)
  const sk = skills.get(skill)
  const tier = sk?.tier
  const assumed = tier !== undefined && tier < frontierFor(sk, placement)
  if (m && m.state !== 'unseen') {
    if (assumed && (m.state === 'introduced' || m.state === 'practising') && m.mean >= 0.5) return 'assumed'
    return m.state
  }
  return assumed ? 'assumed' : 'unseen'
}
export const isMet = (s: NodeStatus) => s === 'reliable' || s === 'refresh' || s === 'assumed' || s === 'practising'

/**
 * A prerequisite depth is met when the learner has shown it. A depth that has no exercises cannot be shown, so it is met by finishing
 * a lesson on that skill, or, when no lesson covers it either, it does not block (that is a gap in the course, not something the
 * learner can fix; tools/check_graph.py reports such nodes).
 */
export function prereqMet(key: string, skills: Map<string, Skill>, masteries: Map<string, Mastery>, placement: Placement, hasItems: (key: string) => boolean,
  lessonDone: (skill: string) => boolean, hasLesson: (skill: string) => boolean): boolean {
  if (isMet(statusOf(key, skills, masteries, placement))) return true
  if (hasItems(key)) return false
  const { skill } = splitSkillKey(key)
  return lessonDone(skill) || !hasLesson(skill)
}

export function lessonSort(a: Lesson, b: Lesson, skills: Map<string, Skill>) {
  const ta = skills.get(a.skill)?.tier ?? 9
  const tb = skills.get(b.skill)?.tier ?? 9
  return ta - tb || a.skill.localeCompare(b.skill) || a.depth.localeCompare(b.depth) || a.id.localeCompare(b.id)
}

/** Lessons whose prerequisites are met, not yet finished, in curriculum order. */
export function nextLessons(c: ContentBundle, masteries: Map<string, Mastery>, placement: Placement, progress: LessonProgress[], limit = 3): Lesson[] {
  const done = new Set(progress.filter(p => p.done).map(p => p.lessonId))
  const doneSkills = new Set<string>(), lessonSkills = new Set<string>()
  for (const l of c.lessons) for (const s of [l.skill, ...(l.also ?? [])]) { lessonSkills.add(s); if (done.has(l.id)) doneSkills.add(s) }
  const sorted = [...c.lessons].sort((a, b) => lessonSort(a, b, c.skillById))
  const out: Lesson[] = []
  for (const l of sorted) {
    if (done.has(l.id)) continue
    const sk = c.skillById.get(l.skill)
    const pre = sk?.depths?.[l.depth]?.prereqs ?? []
    const ok = pre.every(p => prereqMet(p, c.skillById, masteries, placement, k => c.depthsWithItems.has(k), s => doneSkills.has(s), s => lessonSkills.has(s)))
    // a placement or warm-up above this tier means the beginner version is not needed unless the learner asks for it
    const skipped = sk && sk.tier < frontierFor(sk, placement) - 1 && statusOf(`${l.skill}.${l.depth}`, c.skillById, masteries, placement) === 'assumed'
    if (ok && !skipped) out.push(l)
    if (out.length >= limit) break
  }
  return out
}

/** Independence ledger: how often the learner got it right unprompted (cue >= 3, no hints) in the last N attempts. */
export function independence(attempts: Attempt[], last = 60) {
  const recent = evidenceAttempts(attempts).sort((x, y) => x.ts - y.ts).filter(a => a.firstAttempt).slice(-last)
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
