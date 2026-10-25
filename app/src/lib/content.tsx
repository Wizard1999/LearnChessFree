import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { ContentBundle, Item, Lesson, Manifest, Skill, VerifiedInfo } from '../types'

const base = import.meta.env.BASE_URL
async function load<T>(name: string): Promise<T> {
  const r = await fetch(`${base}content/${name}`)
  if (!r.ok) throw new Error(`Could not load content/${name} (${r.status}). Run tools/build_content.py.`)
  return r.json() as Promise<T>
}

const Ctx = createContext<ContentBundle | null>(null)
export const useContent = () => {
  const c = useContext(Ctx)
  if (!c) throw new Error('useContent outside ContentProvider')
  return c
}

export function ContentProvider({ children }: { children: ReactNode }) {
  const [bundle, setBundle] = useState<ContentBundle | null>(null)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    let cancelled = false
    Promise.all([load<Manifest>('manifest.json'), load<Skill[]>('skills.json'), load<Item[]>('items.json'), load<Lesson[]>('lessons.json'), load<Record<string, VerifiedInfo>>('verified.json')])
      .then(([manifest, skills, items, lessons, verified]) => {
        if (cancelled) return
        setBundle({
          manifest, skills, items, lessons, verified,
          skillById: new Map(skills.map(s => [s.id, s])),
          itemById: new Map(items.map(i => [i.id, i])),
          lessonById: new Map(lessons.map(l => [l.id, l])),
        })
      })
      .catch(e => !cancelled && setError(String(e.message ?? e)))
    return () => { cancelled = true }
  }, [])
  if (error) return <main className="page"><h1>Content not available</h1><p>{error}</p></main>
  if (!bundle) return <main className="page"><p className="muted">Loading the curriculum…</p></main>
  return <Ctx.Provider value={bundle}>{children}</Ctx.Provider>
}

/** Items whose tag set contains every requested tag. */
export function itemsByTags(items: Item[], tags: string[]): Item[] {
  return items.filter(i => tags.every(t => (i.tags ?? []).includes(t)))
}
