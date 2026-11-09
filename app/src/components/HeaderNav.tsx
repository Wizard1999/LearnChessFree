import { Link, useLocation } from 'react-router-dom'
import { requestToggle, useOpenWindows } from '../lib/activeWindow'

/** Where the header's places go. The first three are views of the Curriculum page; the last two are its windows (toggled in place when the page is showing). */
export const NAV_ITEMS = [
  { id: 'curriculum', label: 'Curriculum', to: '/course' },
  { id: 'electives', label: 'Electives', to: '/course?view=courses' },
  { id: 'map', label: 'Map', to: '/course?view=map' },
  { id: 'progress', label: 'Progress', to: '/course?win=progress' },
  { id: 'challenge', label: 'Mastery challenge', to: '/course?win=challenge' },
] as const

/** Which header items are lit for an address and the open windows. On a lesson or any other page none is. */
export function activeNav(pathname: string, search: string, open: { progress: boolean; challenge: boolean }): Set<string> {
  const on = new Set<string>()
  const p = pathname.replace(/\/+$/, '') || '/'
  if (p !== '/course') return on
  const view = new URLSearchParams(search).get('view')
  on.add(view === 'courses' ? 'electives' : view === 'map' ? 'map' : 'curriculum')
  if (open.progress) on.add('progress')
  if (open.challenge) on.add('challenge')
  return on
}

/** The places of the Curriculum, in the header on every page (D72), with the divider at the exact centre of the bar. Phones use the bottom tab bar instead. */
export function HeaderNavItems() {
  const loc = useLocation()
  const open = useOpenWindows()
  const on = activeNav(loc.pathname, loc.search, open)
  const item = (it: (typeof NAV_ITEMS)[number]) => {
    const win = it.id === 'progress' || it.id === 'challenge'
    return <Link key={it.id} to={it.to} className={on.has(it.id) ? 'on' : ''} aria-current={on.has(it.id) ? (win ? 'true' : 'page') : undefined}
      onClick={win ? e => { if (requestToggle(it.id as 'progress' | 'challenge')) e.preventDefault() } : undefined}>{it.label}</Link>
  }
  return (
    <>
      <div className="navleft">{NAV_ITEMS.slice(0, 3).map(item)}</div>
      <span className="navsep" aria-hidden="true" />
      <div className="navright">{NAV_ITEMS.slice(3).map(item)}</div>
    </>
  )
}

/** Below about 900px the centred group no longer fits, so the same places fold into the top of the More menu (hidden above that width by CSS). */
export function FoldedNav() {
  const loc = useLocation()
  const open = useOpenWindows()
  const on = activeNav(loc.pathname, loc.search, open)
  return (
    <div className="foldednav">
      {NAV_ITEMS.map(it => {
        const win = it.id === 'progress' || it.id === 'challenge'
        return <Link key={it.id} to={it.to} className={`folded${on.has(it.id) ? ' on' : ''}`} onClick={win ? e => { if (requestToggle(it.id as 'progress' | 'challenge')) e.preventDefault() } : undefined}>{it.label}</Link>
      })}
    </div>
  )
}
