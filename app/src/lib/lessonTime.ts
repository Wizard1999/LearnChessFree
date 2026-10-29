import type { Lesson } from '../types'

/** Minutes a lesson takes, estimated from what is in it: reading at about 200 words a minute, 0.8 min per exercise, 0.7 per
 * practice question, 2 for a contrast trio, 1 for a reflection, 0.4 for a board. A planning estimate [I], not a measurement:
 * real timings come from the learner's own attempts once we have them. */
export function lessonMinutes(l: Lesson): number {
  if (!Array.isArray(l.steps)) return l.minutes ?? 8 // not a full lesson (a plan block, say): trust its own figure
  let t = 0
  for (const s of l.steps) {
    switch (s.type) {
      case 'card': t += s.text.split(/\s+/).length / 200; break
      case 'board': t += 0.4 + (s.caption ?? '').split(/\s+/).length / 200; break
      case 'item': t += 0.8; break
      case 'contrast': t += 2; break
      case 'reflect': t += 1; break
      case 'practice': t += (s.n ?? 3) * 0.7; break
    }
  }
  return Math.max(3, Math.round(t))
}
