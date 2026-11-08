import { useEffect, useState } from 'react'

/** The phone breakpoint of the mobile design (docs/mobile-design.md). Keep in step with the CSS `@media (max-width: 640px)` blocks. */
export const PHONE_QUERY = '(max-width: 640px)'

/** True on a phone-width screen. False where matchMedia does not exist (tests, old browsers), so the desktop markup is the fallback. */
export function usePhone(): boolean {
  const [on, setOn] = useState(() => typeof window !== 'undefined' && window.matchMedia?.(PHONE_QUERY).matches === true)
  useEffect(() => {
    const m = typeof window !== 'undefined' ? window.matchMedia?.(PHONE_QUERY) : undefined
    if (!m) return
    const h = () => setOn(m.matches)
    m.addEventListener?.('change', h); h()
    return () => m.removeEventListener?.('change', h)
  }, [])
  return on
}
