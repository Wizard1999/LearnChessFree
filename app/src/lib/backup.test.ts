import { describe, expect, it } from 'vitest'
import { betterProgress, describeScope, planMerge, shouldNudgeBackup, validateExport, WEEK_MS, type ExportFile } from './backup'
import { stampLegacyProgress, type LessonProgress } from '../db'

const att = (itemId: string, ts: number) => ({ itemId, skillKey: 'N.D2', cue: 3, family: itemId, correct: true, firstAttempt: true, hints: 0, timeMs: 1, source: 'practice' as const, ts, unprompted: true })
const file = (o: Partial<ExportFile> = {}): ExportFile => ({ format: 'chess-school-export', version: 1, exportedAt: '2026-11-01T10:00:00Z', attempts: [], reflections: [], lessonProgress: [], games: [], kv: [], feedback: [], ...o })

describe('validateExport', () => {
  it('accepts a good file and reports its scope', () => {
    const v = validateExport(file({ attempts: [att('a', 1000), att('b', 5000)], lessonProgress: [{ lessonId: 'L', step: 3, done: true, ts: 1 }] }))
    expect(v.ok).toBe(true)
    if (v.ok) {
      expect(v.scope).toMatchObject({ attempts: 2, lessonProgress: 1, lessonsFinished: 1, firstTs: 1000, lastTs: 5000 })
      expect(describeScope(v.scope)).toContain('2 answers')
    }
  })
  it('accepts older files that lack the smaller lists', () => {
    const old: Record<string, unknown> = { ...file() }
    delete old.feedback
    delete old.kv
    expect(validateExport(old).ok).toBe(true)
  })
  it('rejects other JSON, wrong labels, newer versions and damaged rows with plain words', () => {
    const bads: unknown[] = [null, [], 'x', { format: 'other' }, file({ version: 2 }), { ...file(), attempts: 'no' }, file({ attempts: [{ itemId: 'a' } as never] }), file({ lessonProgress: [{ lessonId: 'L', step: 'x', done: true } as never] })]
    for (const bad of bads) {
      const v = validateExport(bad)
      expect(v.ok).toBe(false)
      if (!v.ok) expect(v.error.length).toBeGreaterThan(10)
    }
  })
})

describe('planMerge', () => {
  it('adds only what is missing and never removes', () => {
    const cur = file({ attempts: [att('a', 1)], lessonProgress: [{ lessonId: 'L1', step: 5, done: true, ts: 9 }], kv: [{ key: 'placement', value: 1 }] })
    const inc = file({ attempts: [att('a', 1), att('b', 2)], lessonProgress: [{ lessonId: 'L1', step: 2, done: false, ts: 20 }, { lessonId: 'L2', step: 1, done: false, ts: 3 }], kv: [{ key: 'placement', value: 2 }, { key: 'theme', value: 'x' }] })
    const p = planMerge(cur, inc)
    expect(p.attempts.map(a => a.itemId)).toEqual(['b'])
    expect(p.lessonProgress.map(l => l.lessonId)).toEqual(['L2']) // a finished lesson stays finished
    expect(p.kv.map(k => k.key)).toEqual(['theme'])
  })
  it('lets the file win a lesson when it is finished and this device is not', () => {
    const p = planMerge(file({ lessonProgress: [{ lessonId: 'L', step: 1, done: false, ts: 50 }] }), file({ lessonProgress: [{ lessonId: 'L', step: 9, done: true, ts: 10 }] }))
    expect(p.lessonProgress).toHaveLength(1)
  })
  it('merging a file with itself adds nothing', () => {
    const f = file({ attempts: [att('a', 1)], lessonProgress: [{ lessonId: 'L', step: 1, done: false, ts: 1 }] })
    const p = planMerge(f, f)
    expect(p.attempts).toHaveLength(0)
    expect(p.lessonProgress).toHaveLength(0)
  })
  it('betterProgress prefers finished then newer', () => {
    const a: LessonProgress = { lessonId: 'L', step: 1, done: false, ts: 9 }
    const b: LessonProgress = { lessonId: 'L', step: 2, done: true, ts: 1 }
    expect(betterProgress(a, b)).toBe(b)
    expect(betterProgress({ ...a, ts: 1 }, { ...a, ts: 5 }).ts).toBe(5)
  })
})

describe('shouldNudgeBackup', () => {
  const now = 100 * WEEK_MS
  const day = 24 * 3600e3
  it('never before a lesson is finished', () => { expect(shouldNudgeBackup({ now, finished: 0, latestProgressTs: now })).toBe(false) })
  it('once after the first finished lesson', () => { expect(shouldNudgeBackup({ now, finished: 1, latestProgressTs: now })).toBe(true) })
  it('not again within a week of a reminder or a backup', () => {
    expect(shouldNudgeBackup({ now, finished: 3, latestProgressTs: now, lastNudgeTs: now - 3 * day })).toBe(false)
    expect(shouldNudgeBackup({ now, finished: 3, latestProgressTs: now, lastBackupTs: now - 1000 })).toBe(false)
  })
  it('after a week only when there is new progress', () => {
    expect(shouldNudgeBackup({ now, finished: 3, latestProgressTs: now - 9 * day, lastNudgeTs: now - 8 * day })).toBe(false)
    expect(shouldNudgeBackup({ now, finished: 3, latestProgressTs: now - 1000, lastNudgeTs: now - 8 * day })).toBe(true)
  })
})

describe('version 3 migration of one progress row', () => {
  it('stamps rows without a revision as the old format and leaves new rows alone', () => {
    const old: LessonProgress = { lessonId: 'L', step: 2, done: false, ts: 1 }
    stampLegacyProgress(old)
    expect(old.format).toBe(1)
    const cur: LessonProgress = { lessonId: 'L', step: 2, done: false, ts: 1, revision: 'r', format: 2 }
    stampLegacyProgress(cur)
    expect(cur.format).toBe(2)
  })
})
