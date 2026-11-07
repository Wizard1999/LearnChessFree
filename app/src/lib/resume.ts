// Where to resume a lesson. A saved place records the step's stable id (step.sid) and the lesson revision it was made for, so a rewrite
// that adds, removes or reorders steps cannot drop the learner at a wrong step (D43). Pure functions; the player does the I/O.
import type { LessonMeta } from '../types'

export interface SavedPlace { step: number; sid?: string; revision?: string; done?: boolean }
/** The catalog entry is enough: a place is found by step id, and the ids are in `stepRefs`. */
type Shape = Pick<LessonMeta, 'stepRefs' | 'revision'>

export type ResumePlan =
  | { kind: 'start' }
  /** Resume at `step`. `how` says how it was found; `mapped` is true when the lesson changed and the place was found by step id. */
  | { kind: 'resume'; step: number; how: 'sid' | 'index'; mapped: boolean }
  /** The lesson was rewritten and the old place cannot be found: ask. `near` is where "continue near where you were" would go. */
  | { kind: 'ask'; near: number }

export const REWRITTEN_QUESTION = 'This lesson has been rewritten since you last opened it. Start the revised lesson from the beginning, or continue near where you were?'

export function indexOfSid(steps: Shape['stepRefs'], sid: string | undefined): number {
  if (!sid) return -1
  return steps.findIndex(s => s.sid === sid)
}

export function planResume(saved: SavedPlace | undefined, lesson: Shape): ResumePlan {
  if (!saved || saved.done || saved.step <= 0) return { kind: 'start' }
  const n = lesson.stepRefs.length
  const bySid = indexOfSid(lesson.stepRefs, saved.sid)
  const sameRevision = !!saved.revision && !!lesson.revision && saved.revision === lesson.revision
  if (sameRevision) {
    if (bySid > 0) return { kind: 'resume', step: bySid, how: 'sid', mapped: false }
    if (saved.step < n) return { kind: 'resume', step: saved.step, how: 'index', mapped: false }
    return { kind: 'start' }
  }
  // A place saved before step ids existed has no revision: the lesson may or may not have changed since, so the index is used as before
  // (the player says where it picked up and offers the beginning).
  if (!saved.revision) {
    if (bySid > 0) return { kind: 'resume', step: bySid, how: 'sid', mapped: false }
    return saved.step < n ? { kind: 'resume', step: saved.step, how: 'index', mapped: false } : { kind: 'start' }
  }
  if (!lesson.revision) return saved.step < n ? { kind: 'resume', step: saved.step, how: 'index', mapped: false } : { kind: 'start' }
  // The lesson changed since the place was saved.
  if (bySid > 0) return { kind: 'resume', step: bySid, how: 'sid', mapped: true }
  if (bySid === 0) return { kind: 'start' }
  return { kind: 'ask', near: Math.max(0, Math.min(saved.step, n - 1)) }
}

/** What to store for the learner standing on step `i` (the step index stays as a fallback and for the lesson list). */
export function placeOf(lesson: Shape, i: number): { step: number; sid?: string; revision?: string } {
  const sid = lesson.stepRefs[i]?.sid
  return { step: i, ...(sid ? { sid } : {}), ...(lesson.revision ? { revision: lesson.revision } : {}) }
}

/** A finished lesson whose text was substantially rewritten after it was finished (the completion is kept, never erased). Skipped lessons and
 *  completions from before revisions were recorded are not flagged: nothing is known about them. */
export function finishedEarlierVersion(p: { done: boolean; skipped?: boolean; revision?: string } | undefined, lesson: Pick<LessonMeta, 'revision'>): boolean {
  return !!p && p.done && !p.skipped && !!p.revision && !!lesson.revision && p.revision !== lesson.revision
}
