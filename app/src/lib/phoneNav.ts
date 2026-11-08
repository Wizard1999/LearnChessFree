// The phone navigation (phase 2k, docs/mobile-design.md): five tabs at the bottom, the rest under More.
// Pure so it can be tested; App.tsx and components/PhoneTabBar.tsx render it.

export type PhoneTab = 'today' | 'curriculum' | 'practice' | 'progress' | 'more'

export const PHONE_TABS: { id: PhoneTab; to: string; label: string }[] = [
  { id: 'today', to: '/', label: 'Today' },
  { id: 'curriculum', to: '/course', label: 'Curriculum' },
  { id: 'practice', to: '/practice', label: 'Practice' },
  { id: 'progress', to: '/progress', label: 'Progress' },
  { id: 'more', to: '', label: 'More' },
]

/** The places under More, in the order the desktop More menu lists them. */
export const MORE_LINKS: [string, string][] = [['/games', 'My games'], ['/openings', 'Openings'], ['/analysis', 'Analysis'], ['/lab', 'Contrast lab'], ['/plan', 'My plan'], ['/play', 'Play'], ['/library', 'Library'], ['/roadmap', 'Roadmap']]

/** Which tab is lit for a path. A lesson belongs to the Curriculum; placement and drills to Practice; anything else under More. */
export function phoneTabFor(pathname: string): PhoneTab {
  const p = pathname.replace(/\/+$/, '') || '/'
  if (p === '/' || p === '/today') return 'today'
  if (p.startsWith('/course') || p.startsWith('/lesson')) return 'curriculum'
  if (p.startsWith('/practice') || p.startsWith('/placement') || p.startsWith('/drill')) return 'practice'
  if (p.startsWith('/progress')) return 'progress'
  return 'more'
}

/** Focus mode: the tab bar steps aside so the board and the lesson's action bar have the screen. */
export function isFocusRoute(pathname: string): boolean {
  return pathname.startsWith('/lesson/')
}
