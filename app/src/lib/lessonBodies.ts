// Lesson bodies (the steps) are separate files, loaded when a lesson is opened; the catalog (lessons-catalog.<hash>.json) holds the rest.
// Pure helpers, so the loading rules are testable without a network (the page-side wiring is in lib/content.tsx).
import type { Lesson, LessonBody, LessonMeta } from '../types'

export type FetchJson = (path: string) => Promise<unknown>

/** Combine a catalog entry with its body file, refusing a body that does not belong to it (an old file paired with a newer catalog). */
export function mergeLesson(meta: LessonMeta, body: unknown): Lesson {
  const b = body as Partial<LessonBody> | null
  if (!b || typeof b !== 'object' || b.id !== meta.id || !Array.isArray(b.steps)) throw new Error(`The file for lesson ${meta.id} is not that lesson.`)
  if (b.steps.length !== meta.stepCount) throw new Error(`Lesson ${meta.id} has ${b.steps.length} steps but the catalogue says ${meta.stepCount}.`)
  return { ...meta, ...b, id: meta.id, steps: b.steps }
}

/** A loader that fetches each body once and remembers it; a failed fetch is forgotten, so the next ask tries again. */
export function createBodyLoader(fetchJson: FetchJson): (meta: LessonMeta) => Promise<Lesson> {
  const seen = new Map<string, Promise<Lesson>>()
  return meta => {
    if (!meta.file) return Promise.reject(new Error(`Lesson ${meta.id} has no body file in the catalogue.`))
    const key = meta.file
    let p = seen.get(key)
    if (!p) {
      p = fetchJson(key).then(body => mergeLesson(meta, body))
      seen.set(key, p)
      p.catch(() => { if (seen.get(key) === p) seen.delete(key) })
    }
    return p
  }
}

/**
 * Fetch files in the background so the whole course works offline later (the service worker keeps what is fetched). `concurrency` requests at
 * a time; stops quietly at the first failure (the lesson is then fetched when opened) or when `stop()` says so. Returns how many arrived.
 */
export async function prefetchFiles(paths: readonly string[], fetchOne: (path: string) => Promise<unknown>, concurrency = 3, stop: () => boolean = () => false): Promise<number> {
  let next = 0, done = 0, failed = false
  const worker = async () => {
    while (!failed && !stop()) {
      const i = next++
      if (i >= paths.length) return
      try { await fetchOne(paths[i]); done++ } catch { failed = true }
    }
  }
  await Promise.all(Array.from({ length: Math.max(1, concurrency) }, worker))
  return done
}
