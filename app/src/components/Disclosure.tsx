import { useEffect, useState, type ReactNode } from 'react'
import { ArtEmblem } from './art'
import { Icon } from './Icon'

/**
 * The collapsible section used by the lesson list (stages and subjects) and by Electives (D74): one heading with a disclosure button
 * (chevron, name, "n of m done"), keyboard accessible (a real button with aria-expanded and aria-controls), reduced motion respected in CSS.
 */
export function SectionHead({ id, open, onToggle, name, done, total, emblem, badge, right }: {
  id: string; open: boolean; onToggle: () => void; name: string; done: number; total: number; emblem: string; badge?: ReactNode; right?: ReactNode
}) {
  return (
    <div className="sectionhead">
      <h2><ArtEmblem seed={emblem} />
        <button type="button" className="disclose" aria-expanded={open} aria-controls={id} onClick={onToggle}>
          <Icon name="chevron" size={18} className="chev" />{name}<span className="muted small discount">, {done} of {total} done</span>{badge}
        </button>
      </h2>
      {right}
    </div>
  )
}

/** Open or closed per section, kept for the session. A choice the learner has made wins; otherwise `fallback` decides (the section holding their place, or any match while searching). */
export function useOpenSections(storageKey: string) {
  const [state, setState] = useState<Record<string, boolean>>(() => { try { return JSON.parse(sessionStorage.getItem(storageKey) ?? '{}') } catch { return {} } })
  useEffect(() => { try { sessionStorage.setItem(storageKey, JSON.stringify(state)) } catch { /* optional */ } }, [storageKey, state])
  return {
    isOpen: (key: string, fallback: boolean) => state[key] ?? fallback,
    setOpen: (key: string, v: boolean) => setState(o => ({ ...o, [key]: v })),
    setMany: (keys: string[], v: boolean) => setState(o => ({ ...o, ...Object.fromEntries(keys.map(k => [k, v])) })),
  }
}
