import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { MORE_LINKS, PHONE_TABS, isFocusRoute, phoneTabFor, type PhoneTab } from '../lib/phoneNav'
import { usePhone } from '../lib/usePhone'
import { Sheet } from './Sheet'

/** Simple line icons drawn in the text colour (no raw colours). */
function Icon({ tab }: { tab: PhoneTab }) {
  const p = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  return (
    <svg className="tabicon" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false">
      {tab === 'today' && <><circle cx="12" cy="12" r="4" {...p} /><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8" {...p} /></>}
      {tab === 'curriculum' && <><circle cx="12" cy="12" r="2.2" {...p} /><circle cx="12" cy="12" r="6" {...p} /><circle cx="12" cy="12" r="9.5" {...p} /><path d="M12 3.5v6.3M17.2 15.4l-3.3-2.2" {...p} /></>}
      {tab === 'practice' && <><rect x="3.5" y="3.5" width="17" height="17" rx="2" {...p} /><path d="M3.5 12h17M12 3.5v17" {...p} /><path d="M7.7 7.7h0M16.3 16.3h0" {...p} strokeWidth={3.4} /></>}
      {tab === 'progress' && <><path d="M4 20V13M10 20V8M16 20v-5M21 20H3" {...p} /><path d="M4 9l6-4 6 5 4-3" {...p} /></>}
      {tab === 'more' && <><circle cx="5.5" cy="12" r="1.4" {...p} /><circle cx="12" cy="12" r="1.4" {...p} /><circle cx="18.5" cy="12" r="1.4" {...p} /></>}
    </svg>
  )
}

/** The phone tab bar (docs/mobile-design.md): Today, Curriculum, Practice, Progress, More. Renders only on a phone and steps aside inside a lesson. */
export function PhoneTabBar() {
  const phone = usePhone()
  const loc = useLocation()
  const [moreOpen, setMoreOpen] = useState(false)
  if (!phone || isFocusRoute(loc.pathname)) return null
  const active = phoneTabFor(loc.pathname)
  return (
    <>
      <nav className="tabbar" aria-label="Main">
        {PHONE_TABS.map(t => t.id === 'more'
          ? <button key={t.id} type="button" className={active === 'more' ? 'tab on' : 'tab'} aria-haspopup="dialog" aria-expanded={moreOpen} onClick={() => setMoreOpen(true)}><Icon tab={t.id} /><span>{t.label}</span></button>
          : <NavLink key={t.id} to={t.to} end={t.to === '/'} className={() => (active === t.id ? 'tab on' : 'tab')} aria-current={active === t.id ? 'page' : undefined}><Icon tab={t.id} /><span>{t.label}</span></NavLink>)}
      </nav>
      <Sheet open={moreOpen} onClose={() => setMoreOpen(false)} title="More">
        <ul className="plain morelinks">{MORE_LINKS.map(([to, label]) => <li key={to}><NavLink to={to} className={({ isActive }) => (isActive ? 'on' : '')} onClick={() => setMoreOpen(false)}>{label}</NavLink></li>)}</ul>
      </Sheet>
    </>
  )
}
