import 'fake-indexeddb/auto'
import { beforeEach, describe, expect, it } from 'vitest'
import { dismissSaveNotice, reportSaveFailure, resetSaveStatusForTests, safeWrite, saveNoticeVisible } from './saveStatus'
import { finishedRecord, resetProgress, saveFinished, saveStep, stepRecord, type ProgressTable } from './lessonSave'
import { db, kvSet } from '../db'

const lesson = { id: 'L-1', revision: 'rev1', stepCount: 2, stepRefs: [{ sid: 'a' }, { sid: 'b' }] }
const failing: ProgressTable = { put: () => Promise.reject(new Error('QuotaExceededError')), delete: () => Promise.reject(new Error('blocked')) }
function working() {
  const rows: unknown[] = []
  const t: ProgressTable = { put: r => { rows.push(r); return Promise.resolve() }, delete: () => Promise.resolve() }
  return { t, rows }
}

beforeEach(() => resetSaveStatusForTests())

describe('honest saving', () => {
  it('reports a failed write and returns false, never throwing', async () => {
    expect(saveNoticeVisible()).toBe(false)
    expect(await safeWrite(() => Promise.reject(new Error('x')))).toBe(false)
    expect(saveNoticeVisible()).toBe(true)
    expect(await safeWrite(() => Promise.reject(new Error('y')))).toBe(false)
    expect(saveNoticeVisible()).toBe(true)
  })
  it('a successful write reports nothing', async () => {
    expect(await safeWrite(() => Promise.resolve(1))).toBe(true)
    expect(saveNoticeVisible()).toBe(false)
  })
  it('the notice stays away after it was dismissed (once per session)', async () => {
    reportSaveFailure()
    dismissSaveNotice()
    await safeWrite(() => Promise.reject(new Error('again')))
    expect(saveNoticeVisible()).toBe(false)
  })
  it('lesson progress writes against a failing db return false and raise the notice', async () => {
    expect(await saveStep(failing, lesson, 1)).toBe(false)
    expect(saveNoticeVisible()).toBe(true)
    resetSaveStatusForTests()
    expect(await saveFinished(failing, lesson)).toBe(false)
    expect(await resetProgress(failing, 'L-1')).toBe(false)
    expect(saveNoticeVisible()).toBe(true)
  })
  it('lesson progress writes against a working db return true and store step id and revision', async () => {
    const { t, rows } = working()
    expect(await saveStep(t, lesson, 1)).toBe(true)
    expect(await saveFinished(t, lesson)).toBe(true)
    expect(rows[0]).toMatchObject({ lessonId: 'L-1', step: 1, sid: 'b', revision: 'rev1', done: false, format: 2 })
    expect(rows[1]).toMatchObject({ lessonId: 'L-1', step: 2, done: true, revision: 'rev1', skipped: false })
    expect(saveNoticeVisible()).toBe(false)
  })
  it('builds records without ids or revision for lessons that have none', () => {
    expect(stepRecord({ id: 'x', stepCount: 1, stepRefs: [{ sid: '' }] }, 0, 5)).toEqual({ lessonId: 'x', step: 0, done: false, ts: 5, format: 2 })
    expect(finishedRecord({ id: 'x', stepCount: 0, stepRefs: [] }, true, 5)).toEqual({ lessonId: 'x', step: 0, done: true, ts: 5, skipped: true, format: 2 })
  })
  it('a real db write that fails (closed database) is reported by safeWrite', async () => {
    db.close()
    expect(await safeWrite(() => db.attempts.add({ itemId: 'i', skillKey: 'N.D2', cue: 3, family: 'f', correct: true, firstAttempt: true, hints: 0, timeMs: 1, source: 'practice', ts: 1, unprompted: true }))).toBe(false)
    expect(saveNoticeVisible()).toBe(true)
    resetSaveStatusForTests()
    await kvSet('k', 1)
    expect(saveNoticeVisible()).toBe(true)
    await db.open()
  })
})
