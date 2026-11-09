import { Link, useLocation } from 'react-router-dom'

/** Where the header's places go: the three views of the Curriculum page. Progress and the Mastery challenge live on the page itself (D74). */
export const NAV_ITEMS = [
  { id: 'curriculum', label: 'Curriculum', to: '/course' },
  { id: 'electives', label: 'Electives', to: '/course?view=courses' },
  { id: 'map', label: 'Constellations', to: '/course?view=map' },
] as const

/** Which header item is lit for an address. On a lesson or any other page none is. */
export function activeNav(pathname: string, search: string): Set<string> {
  const on = new Set<string>()
  const p = pathname.replace(/\/+$/, '') || '/'
  if (p !== '/course') return on
  const view = new URLSearchParams(search).get('view')
  on.add(view === 'courses' ? 'electives' : view === 'map' ? 'map' : 'curriculum')
  return on
}

/** The three views of the Curriculum, in the header on every page (D72, D74), centred in the bar. Phones use the bottom tab bar instead. */
export function HeaderNavItems() {
  const loc = useLocation()
  const on = activeNav(loc.pathname, loc.search)
  const item = (it: (typeof NAV_ITEMS)[number]) => {
    return <Link key={it.id} to={it.to} className={on.has(it.id) ? 'on' : ''} aria-current={on.has(it.id) ? 'page' : undefined}>{it.label}</Link>
  }
  return (
    <>
      <div className="navmain">{NAV_ITEMS.map(item)}</div>
    </>
  )
}

/** Below about 900px the centred group no longer fits, so the same places fold into the top of the More menu (hidden above that width by CSS). */
export function FoldedNav() {
  const loc = useLocation()
  const on = activeNav(loc.pathname, loc.search)
  return (
    <div className="foldednav">
      {NAV_ITEMS.map(it => <Link key={it.id} to={it.to} className={`folded${on.has(it.id) ? ' on' : ''}`}>{it.label}</Link>)}
    </div>
  )
}
