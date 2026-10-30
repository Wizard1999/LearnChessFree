import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { ContentBundle, Course, Item, Lesson, LessonStep, Manifest, Skill, VerifiedInfo } from '../types'

const base = import.meta.env.BASE_URL
/** `v`: the manifest's hash. Each content file is requested as ?v=<hash>, so one visit never mixes files of different builds (the service worker caches by URL). */
async function load<T>(name: string, v?: string): Promise<T> {
  const r = await fetch(`${base}content/${name}${v ? `?v=${v}` : ''}`)
  if (!r.ok) throw new Error(`Could not load content/${name} (${r.status}). Run tools/build_content.py.`)
  return r.json() as Promise<T>
}

/**
 * `full` is false while only the first-visit exercises (items-first.json) have arrived; the whole bank (items.json, about 10 MB) follows.
 * `ready` holds the practice tag sets (see tagKey) that are complete in the partial bank.
 */
interface Loaded { bundle: ContentBundle; full: boolean; ready: ReadonlySet<string>; /** The whole bank could not be downloaded (the first lessons still work). */ bankFailed?: boolean }
interface FirstVisit { items: Item[]; ready: string[] }
export const tagKey = (tags: string[]) => [...tags].sort().join('|')
const Ctx = createContext<Loaded | null>(null)
export const useContent = () => {
  const c = useContext(Ctx)
  if (!c) throw new Error('useContent outside ContentProvider')
  return c.bundle
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
  if (c?.bankFailed) return <main className="page"><h1 className="sr-only">Exercises unavailable</h1><p>The exercises could not be downloaded. Check your connection, then <button type="button" className="link" onClick={() => location.reload()}>try again</button>. The first lessons still work.</p></main>
  return <main className="page"><h1 className="sr-only">Loading</h1><p className="muted">Loading the exercise bank…</p></main>
}

/** Exercise ids a lesson step names directly. */
export function stepItemIds(step: LessonStep): string[] {
  if (step.type === 'item') return [step.item]
  if (step.type === 'contrast') return [step.working, step.failing, ...(step.irrelevant ? [step.irrelevant] : [])]
  return []
}

export function ContentProvider({ children }: { children: ReactNode }) {
  const [loaded, setLoaded] = useState<Loaded | null>(null)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    let cancelled = false
    const small = load<Manifest>('manifest.json').then(async manifest => {
      const v = manifest.hash
      return [manifest, ...(await Promise.all([load<Skill[]>('skills.json', v), load<Lesson[]>('lessons.json', v), load<Record<string, VerifiedInfo>>('verified.json', v), load<Course[]>('courses.json', v).catch(() => [] as Course[])]))] as const
    })
    const assemble = ([manifest, skills, lessons, verified, courses]: Awaited<typeof small>, items: Item[]): ContentBundle => ({
      // Course exercises (tag course.*) are reached through their own lessons by id; they stay out of the core pools used by practice, daily plans, placement and challenges.
      manifest, skills, items: items.filter(i => !(i.tags ?? []).some(t => t.startsWith('course.'))), lessons, verified, courses,
      skillById: new Map(skills.map(s => [s.id, s])),
      itemById: new Map(items.map(i => [i.id, i])),
      lessonById: new Map(lessons.map(l => [l.id, l])),
      cuedOnly: new Set(manifest.cued_only ?? []),
      depthsWithItems: new Set(manifest.depths_with_items ?? []),
    })
    void (async () => {
      let shown = false // a running app is never replaced by an error page because the big download failed
      try {
        const parts = await small
        const v = parts[0].hash
        // The first lessons need only a few exercises: show the app as soon as those are here, then fetch the whole bank.
        const first = await load<FirstVisit>('items-first.json', v).catch(() => null)
        if (cancelled) return
        if (first) { shown = true; setLoaded(prev => prev?.full ? prev : { bundle: assemble(parts, first.items), full: false, ready: new Set(first.ready) }) }
        let items: Item[] | null = null
        for (const wait of [0, 1500, 4000]) { // a flaky connection gets two more tries
          if (wait) await new Promise(r => setTimeout(r, wait))
          if (cancelled) return
          try { items = await load<Item[]>('items.json', v); break } catch (e) { console.error(e) }
        }
        if (cancelled) return
        if (items) setLoaded({ bundle: assemble(parts, items), full: true, ready: new Set() })
        else if (shown) setLoaded(prev => (prev ? { ...prev, bankFailed: true } : prev))
        else setError('The curriculum could not be downloaded. Check your connection and reload the page.')
      } catch (e) { console.error(e); if (!cancelled) setError('The curriculum could not be downloaded. Check your connection and reload the page.') }
    })()
    return () => { cancelled = true }
  }, [])
  if (error) return <main className="page"><h1>Content not available</h1><p>{error}</p></main>
  if (!loaded) return <main className="page"><h1 className="sr-only">Loading</h1><p className="muted">Loading the curriculum…</p></main>
  return <Ctx.Provider value={loaded}>{children}</Ctx.Provider>
}

/** Items whose tag set contains every requested tag. */
export function itemsByTags(items: Item[], tags: string[]): Item[] {
  return items.filter(i => tags.every(t => (i.tags ?? []).includes(t)))
}
