import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { ContentBundle, Item, Lesson, LessonStep, Manifest, Skill, VerifiedInfo } from '../types'

const base = import.meta.env.BASE_URL
async function load<T>(name: string): Promise<T> {
  const r = await fetch(`${base}content/${name}`)
  if (!r.ok) throw new Error(`Could not load content/${name} (${r.status}). Run tools/build_content.py.`)
  return r.json() as Promise<T>
}

/**
 * `full` is false while only the first-visit exercises (items-first.json) have arrived; the whole bank (items.json, about 10 MB) follows.
 * `ready` holds the practice tag sets (see tagKey) that are complete in the partial bank.
 */
interface Loaded { bundle: ContentBundle; full: boolean; ready: ReadonlySet<string> }
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
  return useContentFull() ? <>{children}</> : <main className="page"><p className="muted">Loading the exercise bank…</p></main>
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
    const small = Promise.all([load<Manifest>('manifest.json'), load<Skill[]>('skills.json'), load<Lesson[]>('lessons.json'), load<Record<string, VerifiedInfo>>('verified.json')])
    const assemble = ([manifest, skills, lessons, verified]: Awaited<typeof small>, items: Item[]): ContentBundle => ({
      manifest, skills, items, lessons, verified,
      skillById: new Map(skills.map(s => [s.id, s])),
      itemById: new Map(items.map(i => [i.id, i])),
      lessonById: new Map(lessons.map(l => [l.id, l])),
      cuedOnly: new Set(manifest.cued_only ?? []),
      depthsWithItems: new Set(manifest.depths_with_items ?? []),
    })
    void (async () => {
      try {
        const parts = await small
        // The first lessons need only a few exercises: show the app as soon as those are here, then fetch the whole bank.
        const first = await load<FirstVisit>('items-first.json').catch(() => null)
        if (cancelled) return
        if (first) setLoaded(prev => prev?.full ? prev : { bundle: assemble(parts, first.items), full: false, ready: new Set(first.ready) })
        const items = await load<Item[]>('items.json')
        if (!cancelled) setLoaded({ bundle: assemble(parts, items), full: true, ready: new Set() })
      } catch (e) { if (!cancelled) setError(String((e as Error).message ?? e)) }
    })()
    return () => { cancelled = true }
  }, [])
  if (error) return <main className="page"><h1>Content not available</h1><p>{error}</p></main>
  if (!loaded) return <main className="page"><p className="muted">Loading the curriculum…</p></main>
  return <Ctx.Provider value={loaded}>{children}</Ctx.Provider>
}

/** Items whose tag set contains every requested tag. */
export function itemsByTags(items: Item[], tags: string[]): Item[] {
  return items.filter(i => tags.every(t => (i.tags ?? []).includes(t)))
}
