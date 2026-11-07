// Writing lesson progress. Each function says whether the write really happened; a failure is reported once (lib/saveStatus.ts) and
// the caller must not show a "saved" state when it returns false.
import type { LessonProgress } from '../db'
import type { LessonMeta } from '../types'
import { placeOf } from './resume'
import { safeWrite } from './saveStatus'

/** The part of a Dexie table these functions need (a test passes a mock that fails). */
export interface ProgressTable { put(r: LessonProgress): PromiseLike<unknown>; delete(id: string): PromiseLike<unknown> }
type L = Pick<LessonMeta, 'id' | 'stepCount' | 'stepRefs' | 'revision'>

export const stepRecord = (lesson: L, i: number, now = Date.now()): LessonProgress => ({ lessonId: lesson.id, ...placeOf(lesson, i), done: false, ts: now, format: 2 })
export const finishedRecord = (lesson: L, skipped = false, now = Date.now()): LessonProgress =>
  ({ lessonId: lesson.id, step: lesson.stepCount, done: true, ts: now, skipped, ...(lesson.revision ? { revision: lesson.revision } : {}), format: 2 })

export const saveStep = (t: ProgressTable, lesson: L, i: number) => safeWrite(() => t.put(stepRecord(lesson, i)))
export const saveFinished = (t: ProgressTable, lesson: L, skipped = false) => safeWrite(() => t.put(finishedRecord(lesson, skipped)))
export const resetProgress = (t: ProgressTable, lessonId: string) => safeWrite(() => t.delete(lessonId))
