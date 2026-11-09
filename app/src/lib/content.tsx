import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { cleanTitle } from './displayText'
import { createBodyLoader, prefetchFiles } from './lessonBodies'
import type { ContentBundle, ContentFiles, Course, Item, Lesson, LessonMeta, LessonStep, Manifest, Skill, VerifiedInfo } from '../types'

const base = import.meta.env.BASE_URL
/** One content file. The big files have the hash of their bytes in their names (named by manifest.json), so a URL never changes meaning and the service worker may keep it for good. */
async function load<T>(name: string, fresh = false): Promise<T> {
  const r = await fetch(`${base}content/${name}`, fresh ? { cache: 'no-cache' } : undefined)
  if (!r.ok) throw new Error(`Could not load content/${name} (${r.status}). Run tools/build_content.py.`)
  return r.json() as Promise<T>
}
const loadBody = createBodyLoader(path => load(path))

/**
 * `full` is false while only the first-visit exercises (items-first) have arrived; the whole bank (items, about 15 MB) follows.
 * `ready` holds the practice tag sets (see tagKey) that are complete in the partial bank.
 */
interface Loaded { bundle: ContentBundle; full: boolean; ready: ReadonlySet<string>; /** The whole bank could not be downloaded (the first lessons still work). */ bankFailed?: boolean; /** The course list could not be downloaded (everything else works). */ coursesFailed?: boolean }
interface FirstVisit { items: Item[]; ready: string[] }
export const tagKey = (tags: string[]) => [...tags].sort().join('|')
const Ctx = createContext<(Loaded & { retryCourses: () => Promise<void> }) | null>(null)
/** The loaded content, or null when there is no provider yet (the shell can render before content). */
export const useContentMaybe = () => useContext(Ctx)
export const useContent = () => {
  const c = useContext(Ctx)
  if (!c) throw new Error('useContent outside ContentProvider')
  return c.bundle
}
/** Whether the course list is missing (its download failed) and a way to ask again. Pages show a small message, never an empty list. */
export function useCoursesStatus(): { failed: boolean; retry: () => Promise<void> } {
  const c = useContext(Ctx)
  return { failed: !!c?.coursesFailed, retry: c?.retryCourses ?? (() => Promise.resolve()) }
}
export const useContentFull = () => useContext(Ctx)?.full ?? false
/** Whether a practice step's exercises can be drawn now (whole bank loaded, or its tag set is complete in the first-visit file). */
export function usePracticeReady(): (tags: string[]) => boolean {
  const c = useContext(Ctx)
  return tags => !!c && (c.full || c.ready.has(tagKey(tags)))
}

/** Pages that draw on the whole exercise bank wait for it; the first lesson and the start screen do not. */
export function RequireFullContent({ children }: { children: ReactNode }) {
  const c = useContext(Ctx)
  if (c?.full) return <>{children}</>
  if (c?.bankFailed) return <main className="page"><h1 className="sr-only">Exercises unavailable</h1><p role="alert">The exercises could not be downloaded. Check your connection, then <button type="button" className="link" onClick={() => location.reload()}>try again</button>. The first lessons still work.</p></main>
  return <main className="page"><h1 className="sr-only">Loading</h1><p className="muted" role="status">Loading the exercise bank (about 15 MB, once)…</p></main>
}

/** Exercise ids a lesson step names directly. */
export function stepItemIds(step: LessonStep): string[] {
  if (step.type === 'item') return [step.item]
  if (step.type === 'contrast') return [step.working, step.failing, ...(step.irrelevant ? [step.irrelevant] : [])]
  return []
}

/** A lesson with its steps: the catalog entry is in the bundle, the body is fetched when the lesson is opened. */
export function useLesson(meta: LessonMeta | undefined): { lesson: Lesson | undefined; loading: boolean; failed: boolean; retry: () => void } {
  const key = meta ? `${meta.id}.${meta.revision ?? ''}` : ''
  const [state, setState] = useState<{ key: string; lesson?: Lesson; failed?: boolean } | null>(null)
  const [tick, setTick] = useState(0)
  useEffect(() => {
    if (!meta) return
    let live = true
    loadBody(meta).then(lesson => { if (live) setState({ key, lesson }) }, (e: unknown) => { console.error(e); if (live) setState({ key, failed: true }) })
    return () => { live = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- the entry is identified by `key` (id and revision)
  }, [key, tick])
  const cur = state && state.key === key ? state : null
  const retry = useCallback(() => { setState(null); setTick(t => t + 1) }, [])
  return { lesson: cur?.lesson, loading: !!meta && !cur, failed: !!cur?.failed, retry }
}

/** What a lesson page shows while the lesson's body downloads, or when it could not (with a button to ask again). */
export function LessonLoading({ failed, retry, title }: { failed: boolean; retry: () => void; title?: string }) {
  if (failed) return <p role="alert">The lesson{title ? ` “${title}”` : ''} could not be downloaded. Check your connection, then <button type="button" className="link" onClick={retry}>try again</button>.</p>
  return <p className="muted" role="status">Loading the lesson{title ? ` “${title}”` : ''}…</p>
}

const BASE_ERR = 'The curriculum could not be downloaded. Check your connection, then try again.'

export function ContentProvider({ children }: { children: ReactNode }) {
  const [loaded, setLoaded] = useState<Loaded | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [what, setWhat] = useState('Checking for the latest curriculum')
  const [attempt, setAttempt] = useState(0)
  const [files, setFiles] = useState<ContentFiles | null>(null)
  useEffect(() => {
    let cancelled = false
    setError(null); setWhat('Checking for the latest curriculum')
    const assemble = (manifest: Manifest, skills: Skill[], catalog: LessonMeta[], verified: Record<string, VerifiedInfo>, courses: Course[], items: Item[]): ContentBundle => ({
      // Course exercises (tag course.*) are reached through their own lessons by id; they stay out of the core pools used by practice, daily plans, placement and challenges.
      manifest, skills: skills.map(s => ({ ...s, title: cleanTitle(s.title) })), items: items.filter(i => !(i.tags ?? []).some(t => t.startsWith('course.'))), lessons: catalog, verified, courses,
      skillById: new Map(skills.map(s => [s.id, { ...s, title: cleanTitle(s.title) }])),
      itemById: new Map(items.map(i => [i.id, i])),
      lessonById: new Map(catalog.map(l => [l.id, l])),
      cuedOnly: new Set(manifest.cued_only ?? []),
      depthsWithItems: new Set(manifest.depths_with_items ?? []),
    })
    void (async () => {
      let shown = false // a running app is never replaced by an error page because the big download failed
      try {
        // The manifest is the one file asked for by a fixed name; it names the others (each with a hash in its name), so an old manifest can never meet new files.
        const manifest = await load<Manifest>('manifest.json', true)
        const f = manifest.files
        if (!f) throw new Error('content/manifest.json does not name the content files. Run tools/build_content.py.')
        if (cancelled) return
        setFiles(f); setWhat('Loading the skills and the lesson catalogue')
        const [skills, catalog, verified, coursesTry] = await Promise.all([
          load<Skill[]>(f.skills), load<LessonMeta[]>(f.catalog), load<Record<string, VerifiedInfo>>(f.verified),
          load<Course[]>(f.courses).then(c => ({ ok: true as const, c }), (e: unknown) => { console.error(e); return { ok: false as const, c: [] as Course[] } }),
        ])
        if (cancelled) return
        setWhat('Loading the first exercises')
        // The first lessons need only a few exercises: show the app as soon as those are here, then fetch the whole bank.
        const first = await load<FirstVisit>(f.itemsFirst).catch(() => null)
        if (cancelled) return
        const parts = [manifest, skills, catalog, verified, coursesTry.c] as const
        const coursesFailed = !coursesTry.ok
        if (first) { shown = true; setLoaded(prev => prev?.full ? prev : { bundle: assemble(...parts, first.items), full: false, ready: new Set(first.ready), coursesFailed }) }
        let items: Item[] | null = null
        for (const wait of [0, 1500, 4000]) { // a flaky connection gets two more tries
          if (wait) await new Promise(r => setTimeout(r, wait))
          if (cancelled) return
          try { items = await load<Item[]>(f.items); break } catch (e) { console.error(e) }
        }
        if (cancelled) return
        if (items) {
          const bank = items
          setLoaded(prev => ({ bundle: assemble(...parts, bank), full: true, ready: new Set(), coursesFailed: prev?.coursesFailed ?? coursesFailed }))
          void prefetchBodies(catalog, () => cancelled) // quietly, so every lesson works offline later
        } else if (shown) setLoaded(prev => (prev ? { ...prev, bankFailed: true } : prev))
        else setError(BASE_ERR)
      } catch (e) { console.error(e); if (!cancelled) setError(BASE_ERR) }
    })()
    return () => { cancelled = true }
  }, [attempt])
  const retryCourses = useCallback(async () => {
    if (!files) return
    try {
      const courses = await load<Course[]>(files.courses)
      setLoaded(prev => (prev ? { ...prev, bundle: { ...prev.bundle, courses }, coursesFailed: false } : prev))
    } catch (e) { console.error(e) }
  }, [files])
  if (error) return <main className="page"><h1>Content not available</h1><p role="alert">{error}</p><p><button type="button" className="primary" onClick={() => setAttempt(a => a + 1)}>Try again</button></p></main>
  if (!loaded) return <main className="page"><h1 className="sr-only">Loading</h1><p className="muted" role="status">{what}…</p></main>
  return <Ctx.Provider value={{ ...loaded, retryCourses }}>{children}</Ctx.Provider>
}

/** After the app is running and the exercises are here, fetch every lesson body once in the background (about 4 MB, 3 at a time), so the service worker holds the whole course for offline use. Skipped when the browser asks to save data. */
async function prefetchBodies(catalog: LessonMeta[], stop: () => boolean) {
  const nav = navigator as Navigator & { connection?: { saveData?: boolean } }
  if (nav.connection?.saveData) return
  await new Promise(r => setTimeout(r, 3000))
  const paths = catalog.map(l => l.file).filter((p): p is string => !!p)
  await prefetchFiles(paths, p => load(p), 3, stop)
}

/** Items whose tag set contains every requested tag. */
export function itemsByTags(items: Item[], tags: string[]): Item[] {
  return items.filter(i => tags.every(t => (i.tags ?? []).includes(t)))
}
