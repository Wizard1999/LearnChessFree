// The phone navigation (phase 2k, docs/mobile-design.md): five tabs at the bottom, the rest under More.
// Pure so it can be tested; App.tsx and components/PhoneTabBar.tsx render it.

export type PhoneTab = 'curriculum' | 'electives' | 'map' | 'more'

// D63/D64/D76: Today and Practice are folded into the Curriculum page; the old Progress page lives on as the Learning record under More.
export const PHONE_TABS: { id: PhoneTab; to: string; label: string }[] = [
  { id: 'curriculum', to: '/course', label: 'Curriculum' },
  { id: 'electives', to: '/course?view=courses', label: 'Electives' },
  { id: 'map', to: '/course?view=map', label: 'Map' },
  { id: 'more', to: '', label: 'More' },
]

/** The places under More (desktop menu and phone sheet), in order. Review gathers games review, analysis and openings; Settings is added by the desktop menu. */
export const MORE_LINKS: [string, string][] = [['/play', 'Play'], ['/review', 'Review'], ['/library', 'Library'], ['/lab', 'Contrast lab'], ['/plan', 'My plan'], ['/record', 'Learning record'], ['/roadmap', 'Roadmap']]

/** Which tab is lit for a path and query. The Mastery challenge lives on the Curriculum page (D74); the Learning record is a page under More (D76). */
export function phoneTabFor(pathname: string, search = ''): PhoneTab {
  const p = pathname.replace(/\/+$/, '') || '/'
  if (p.startsWith('/course')) { const v = new URLSearchParams(search).get('view'); return v === 'courses' ? 'electives' : v === 'map' ? 'map' : 'curriculum' }
  if (p === '/' || p === '/today' || p.startsWith('/lesson') || p.startsWith('/practice') || p.startsWith('/placement') || p.startsWith('/drill')) return 'curriculum'
  return 'more'
}

/** Focus mode: the tab bar steps aside so the board and the lesson's action bar have the screen. */
export function isFocusRoute(pathname: string): boolean {
  return pathname.startsWith('/lesson/')
}
