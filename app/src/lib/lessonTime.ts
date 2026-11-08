import type { LessonStep } from '../types'

/** The number of practice questions that count toward a lesson's length; the rest of a practice pool is optional extra. */
export const PRACTICE_COUNTED = 3

/** Planned minutes for one step, estimated from what is in it: reading at about 200 words a minute, 0.8 min per exercise, 0.7 per
 * counted practice question (only the first three: the rest is optional), 1.5 for a contrast trio, 1 for a reflection, 0.4 for a board,
 * 0.4 plus 0.15 per move for a guided game, 0.25 per star for a reach step (every round's stars).
 * A planning estimate [I], not a measurement: lib/measuredTime.ts replaces it with the learner's own pace once enough steps are timed. */
export function stepMinutes(s: LessonStep): number {
  switch (s.type) {
    case 'card': return s.text.split(/\s+/).length / 200
    case 'board': return 0.4 + (s.caption ?? '').split(/\s+/).length / 200
    case 'item': return 0.8
    case 'contrast': return 1.5
    case 'reflect': return 1
    case 'practice': return Math.min(s.n ?? 3, PRACTICE_COUNTED) * 0.7
    case 'guided': return 0.4 + 0.15 * (Array.isArray(s.moves) ? s.moves.length : 0)
    case 'reach': {
      const n = (x: { stars?: unknown }) => (Array.isArray(x.stars) ? x.stars.length : 0)
      return 0.25 * (n(s) + (Array.isArray(s.rounds) ? s.rounds.reduce((a, r) => a + n(r), 0) : 0))
    }
    default: return 0
  }
}

export function lessonMinutes(l: { minutes?: number; steps?: readonly LessonStep[] }): number {
  if (!Array.isArray(l.steps)) return l.minutes ?? 8 // a catalog entry (tools/build_content.py computed `minutes` with this same formula) or a plan block: trust its own figure
  return stepsMinutes(l.steps)
}

export function stepsMinutes(steps: readonly LessonStep[]): number {
  let t = 0
  for (const s of steps) t += stepMinutes(s)
  return Math.max(3, Math.round(t))
}

/** How a duration is shown everywhere: always "about", never a promise. */
export function aboutMinutes(m: number): string {
  if (m < 60) return `about ${m} min`
  const h = Math.floor(m / 60), r = m % 60
  return r ? `about ${h} h ${r} min` : `about ${h} h`
}
