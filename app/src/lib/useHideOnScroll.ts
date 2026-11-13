import { useEffect } from 'react'

/** Phone only: slide the page header away while the learner scrolls down and bring it back on the first scroll up, so reading gets the whole screen.
 *  Writes data-hdr="hidden" on <html>; styles/mobile.css does the sliding. Never hides near the top of the page or while a focus is inside the header. */
export function useHideOnScroll(on: boolean) {
  useEffect(() => {
    const root = document.documentElement
    if (!on) { root.removeAttribute('data-hdr'); return }
    let last = window.scrollY, ticking = false
    const frame = () => {
      ticking = false
      const y = window.scrollY, dy = y - last
      if (y < 80 || dy < -6) root.removeAttribute('data-hdr')
      else if (dy > 10 && !document.querySelector('header.top')?.contains(document.activeElement)) root.setAttribute('data-hdr', 'hidden')
      if (Math.abs(dy) > 6) last = y
    }
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(frame) } }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { window.removeEventListener('scroll', onScroll); root.removeAttribute('data-hdr') }
  }, [on])
}
