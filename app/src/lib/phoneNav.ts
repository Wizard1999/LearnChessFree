// The phone navigation (phase 2k, docs/mobile-design.md): five tabs at the bottom, the rest under More.
// Pure so it can be tested; App.tsx and components/PhoneTabBar.tsx render it.

export type PhoneTab = 'curriculum' | 'electives' | 'map' | 'more'

// D63/D64: Today, Practice and Progress are folded into the Curriculum page, so the phone bar points at their new homes.
export const PHONE_TABS: { id: PhoneTab; to: string; label: string }[] = [
  { id: 'curriculum', to: '/course', label: 'Curriculum' },
  { id: 'electives', to: '/course?view=courses', label: 'Electives' },
  { id: 'map', to: '/course?view=map', label: 'Map' },
  { id: 'more', to: '', label: 'More' },
]

/** The places under More (desktop menu and phone sheet), in order. Review gathers games review, analysis and openings; Settings is added by the desktop menu. */
export const MORE_LINKS: [string, string][] = [['/play', 'Play'], ['/review', 'Review'], ['/library', 'Library'], ['/lab', 'Contrast lab'], ['/plan', 'My plan'], ['/roadmap', 'Roadmap']]

/** Which tab is lit for a path and query. Progress and the Mastery challenge live on the Curriculum page itself (D74), so old links land on Curriculum. */
export function phoneTabFor(pathname: string, search = ''): PhoneTab {
  const p = pathname.replace(/\/+$/, '') || '/'
  if (p.startsWith('/course')) { const v = new URLSearchParams(search).get('view'); return v === 'courses' ? 'electives' : v === 'map' ? 'map' : 'curriculum' }
  if (p === '/' || p === '/today' || p.startsWith('/lesson') || p.startsWith('/progress') || p.startsWith('/practice') || p.startsWith('/placement') || p.startsWith('/drill')) return 'curriculum'
  return 'more'
}

/** Focus mode: the tab bar steps aside so the board and the lesson's action bar have the screen. */
export function isFocusRoute(pathname: string): boolean {
  return pathname.startsWith('/lesson/')
}
