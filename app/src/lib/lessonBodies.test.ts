import { describe, expect, it } from 'vitest'
import { createBodyLoader, mergeLesson, prefetchFiles } from './lessonBodies'
import type { LessonMeta } from '../types'

const meta = (id = 'L-A', n = 2): LessonMeta => ({ id, title: 'T', skill: 'A.B', depth: 'D1', review: { status: 'x' }, stepCount: n, stepRefs: Array.from({ length: n }, (_, i) => ({ sid: `s${i}` })), file: `lessons/${id}.abc.json`, revision: 'abc' })
const body = (id = 'L-A', n = 2) => ({ id, revision: 'abc', steps: Array.from({ length: n }, (_, i) => ({ type: 'card', text: `t${i}`, sid: `s${i}` })), outcomes: ['o'] })

describe('mergeLesson', () => {
  it('joins the catalog entry and the body', () => {
    const l = mergeLesson(meta(), body())
    expect(l.title).toBe('T'); expect(l.steps).toHaveLength(2); expect(l.outcomes).toEqual(['o']); expect(l.stepCount).toBe(2)
  })
  it('refuses a body of another lesson or with another number of steps', () => {
    expect(() => mergeLesson(meta(), body('L-B'))).toThrow(/not that lesson/)
    expect(() => mergeLesson(meta(), body('L-A', 3))).toThrow(/3 steps/)
    expect(() => mergeLesson(meta(), null)).toThrow()
    expect(() => mergeLesson(meta(), { id: 'L-A' })).toThrow()
  })
})

describe('createBodyLoader', () => {
  it('fetches a body once and shares the answer', async () => {
    let calls = 0
    const load = createBodyLoader(async () => { calls++; return body() })
    const [a, b] = await Promise.all([load(meta()), load(meta())])
    expect(a).toBe(b); expect(calls).toBe(1)
  })
  it('forgets a failure so the next ask tries again', async () => {
    let calls = 0
    const load = createBodyLoader(async () => { if (++calls === 1) throw new Error('offline'); return body() })
    await expect(load(meta())).rejects.toThrow('offline')
    await expect(load(meta())).resolves.toMatchObject({ id: 'L-A' })
    expect(calls).toBe(2)
  })
  it('rejects an entry with no body file', async () => {
    await expect(createBodyLoader(async () => body())({ ...meta(), file: undefined })).rejects.toThrow(/no body file/)
  })
})

describe('prefetchFiles', () => {
  const paths = Array.from({ length: 10 }, (_, i) => `f${i}`)
  it('fetches everything with a bounded number of requests at once', async () => {
    let open = 0, peak = 0
    const n = await prefetchFiles(paths, async () => { open++; peak = Math.max(peak, open); await Promise.resolve(); await Promise.resolve(); open-- }, 3)
    expect(n).toBe(10); expect(peak).toBeLessThanOrEqual(3)
  })
  it('stops at the first failure', async () => {
    const seen: string[] = []
    const n = await prefetchFiles(paths, async p => { seen.push(p); if (p === 'f2') throw new Error('x') }, 1)
    expect(n).toBe(2); expect(seen).toEqual(['f0', 'f1', 'f2'])
  })
  it('stops when asked', async () => {
    let stop = false
    const n = await prefetchFiles(paths, async p => { if (p === 'f1') stop = true }, 1, () => stop)
    expect(n).toBe(2)
  })
})
