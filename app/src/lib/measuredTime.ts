// The learner's own pace. Each step's time on screen is recorded (db.stepTimes); once at least MIN_SAMPLES steps of a type have been timed
// on this device, the median of those replaces the planned figure for that type. Nothing here leaves the device. Pure functions.
import type { LessonStep } from '../types'
import { stepMinutes } from './lessonTime'

export const MIN_SAMPLES = 20
/** Time with no touch, key press or click counts for at most this long. */
export const IDLE_CAP_MS = 90_000

export type StepType = LessonStep['type']
export interface StepTime { lessonId: string; sid: string; type: string; ms: number; ts: number }

/**
 * Times one step. It counts the time the page is visible, and a stretch with no activity counts for at most IDLE_CAP_MS.
 * `tick(now)` is called on any interaction; hide/show follow the Page Visibility API. All times are passed in (testable).
 */
export class StepTimer {
  private last: number
  private visible: boolean
  private total = 0
  constructor(now: number, visible = true) { this.last = now; this.visible = visible }
  private settle(now: number) {
    if (this.visible) this.total += Math.min(Math.max(0, now - this.last), IDLE_CAP_MS)
    this.last = now
  }
  tick(now: number) { this.settle(now) }
  setVisible(now: number, visible: boolean) { this.settle(now); this.visible = visible }
  /** The counted time so far, in ms. */
  stop(now: number): number { this.settle(now); return Math.round(this.total) }
}

/** Steps shorter than this were skipped through, not read; they are not recorded. */
export const MIN_RECORD_MS = 1000
export const worthRecording = (ms: number) => Number.isFinite(ms) && ms >= MIN_RECORD_MS

export function median(xs: readonly number[]): number | null {
  if (xs.length === 0) return null
  const s = [...xs].sort((a, b) => a - b)
  const m = s.length >> 1
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2
}

/** Median milliseconds per step type, only for types with at least `minSamples` timed steps. */
export function typeMedians(rows: readonly Pick<StepTime, 'type' | 'ms'>[], minSamples = MIN_SAMPLES): Map<string, number> {
  const by = new Map<string, number[]>()
  for (const r of rows) { if (!Number.isFinite(r.ms) || r.ms <= 0) continue; by.set(r.type, [...(by.get(r.type) ?? []), r.ms]) }
  const out = new Map<string, number>()
  for (const [t, xs] of by) if (xs.length >= minSamples) out.set(t, median(xs)!)
  return out
}

/**
 * The lesson's length at this learner's pace, in whole minutes, or null when no step type in it has enough timed samples yet.
 * A type without enough samples keeps its planned figure inside the total.
 */
export function measuredMinutes(steps: readonly LessonStep[], medians: ReadonlyMap<string, number>): number | null {
  if (!steps.some(s => medians.has(s.type))) return null
  let t = 0
  for (const s of steps) { const m = medians.get(s.type); t += m !== undefined ? m / 60000 : stepMinutes(s) }
  return Math.max(1, Math.round(t))
}

/** "about 6 min at your pace", or null. */
export function paceText(steps: readonly LessonStep[] | undefined, medians: ReadonlyMap<string, number>): string | null {
  if (!steps) return null
  const m = measuredMinutes(steps, medians)
  return m === null ? null : `about ${m} min at your pace`
}
