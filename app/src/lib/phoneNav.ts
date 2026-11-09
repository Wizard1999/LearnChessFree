// The phone navigation (phase 2k, docs/mobile-design.md): five tabs at the bottom, the rest under More.
// Pure so it can be tested; App.tsx and components/PhoneTabBar.tsx render it.

export type PhoneTab = 'curriculum' | 'mastery' | 'progress' | 'more'

// D63/D64: Today, Practice and Progress are folded into the Curriculum page, so the phone bar points at their new homes.
export const PHONE_TABS: { id: PhoneTab; to: string; label: string }[] = [
  { id: 'curriculum', to: '/course', label: 'Curriculum' },
  { id: 'mastery', to: '/course?win=challenge', label: 'Mastery' },
  { id: 'progress', to: '/course?win=progress', label: 'Progress' },
  { id: 'more', to: '', label: 'More' },
]

/** The places under More (desktop menu and phone sheet), in order. Review gathers games review, analysis and openings; Settings is added by the desktop menu. */
export const MORE_LINKS: [string, string][] = [['/play', 'Play'], ['/review', 'Review'], ['/library', 'Library'], ['/lab', 'Contrast lab'], ['/plan', 'My plan'], ['/roadmap', 'Roadmap']]

/** Which tab is lit for a path (and query, and the window the Curriculum page has open). The Curriculum page holds the Progress and Mastery challenge windows, named in the address. */
export function phoneTabFor(pathname: string, search = '', openWindow: 'progress' | 'challenge' | null = null): PhoneTab {
  const p = pathname.replace(/\/+$/, '') || '/'
  // the address names the window only until the page has read it; after that the page's own state (lib/activeWindow.ts) does
  const win = new URLSearchParams(search).get('win') ?? openWindow
  if (p.startsWith('/progress') || (p.startsWith('/course') && win === 'progress')) return 'progress'
  if (p.startsWith('/practice') || p.startsWith('/placement') || p.startsWith('/drill') || (p.startsWith('/course') && win === 'challenge')) return 'mastery'
  if (p === '/' || p === '/today' || p.startsWith('/course') || p.startsWith('/lesson')) return 'curriculum'
  return 'more'
}

/** Focus mode: the tab bar steps aside so the board and the lesson's action bar have the screen. */
export function isFocusRoute(pathname: string): boolean {
  return pathname.startsWith('/lesson/')
}
