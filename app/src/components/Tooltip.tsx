import { createPortal } from 'react-dom'
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'

const HOVER_MS = 400
const PRESS_MS = 500

/**
 * Tooltip around one control. The control keeps its own accessible name (aria-label); the tip is a visual helper for sighted
 * users, so it is hidden from the accessibility tree and is never the only name. It shows after 400 ms of hover, at once on
 * keyboard focus, and after a long press on touch. Escape closes it. It sits above the control (below when there is no room
 * above, or when the sticky header would cover it) and is nudged to stay inside the viewport. It is drawn in a portal with fixed
 * positioning, so no card, scroller or header can clip or cover it.
 */
export function Tooltip({ label, shortcut, children, className = '' }: { label: string; shortcut?: string; children: ReactNode; className?: string }) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState({ left: -9999, top: 0, arrow: 0, below: false })
  const wrap = useRef<HTMLSpanElement>(null)
  const tip = useRef<HTMLSpanElement>(null)
  const timer = useRef<number | undefined>(undefined)
  const pointerDown = useRef(false)
  const longPressed = useRef(false)
  const clear = () => { window.clearTimeout(timer.current); timer.current = undefined }
  const hide = useCallback(() => { window.clearTimeout(timer.current); timer.current = undefined; setOpen(false) }, [])
  useEffect(() => () => window.clearTimeout(timer.current), [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); e.stopPropagation() } }
    document.addEventListener('keydown', onKey, true)
    return () => document.removeEventListener('keydown', onKey, true)
  }, [open])

  useLayoutEffect(() => {
    if (!open || !wrap.current || !tip.current) return
    const w = wrap.current.getBoundingClientRect(), t = tip.current.getBoundingClientRect()
    const margin = 8
    const hdr = document.querySelector('header.top')?.getBoundingClientRect()
    const topLimit = Math.max(margin, hdr && hdr.bottom > 0 ? hdr.bottom + 4 : 0) // a sticky header is not free space
    const centre = w.left + w.width / 2
    const left = Math.max(margin, Math.min(centre - t.width / 2, window.innerWidth - margin - t.width))
    let below = w.top - t.height - 10 < topLimit
    if (below && w.bottom + 10 + t.height > window.innerHeight - margin && w.top - t.height - 10 >= margin) below = false // no room under it: above, even over the header
    const top = below ? w.bottom + 10 : w.top - t.height - 10
    const arrow = Math.max(12, Math.min(centre - left, t.width - 12))
    setPos(p => (p.left === left && p.top === top && p.arrow === arrow && p.below === below ? p : { left, top, arrow, below }))
  }, [open, label, shortcut])
  useEffect(() => { // the tip is fixed, so it would drift away from its control while the page scrolls: close it
    if (!open) return
    const t0 = Date.now()
    const h = () => { if (Date.now() - t0 > 250) hide() } // focusing a control can itself scroll it into view: that must not close its tip
    window.addEventListener('scroll', h, true); window.addEventListener('resize', h)
    return () => { window.removeEventListener('scroll', h, true); window.removeEventListener('resize', h) }
  }, [open, hide])

  const later = (ms: number) => { clear(); timer.current = window.setTimeout(() => setOpen(true), ms) }
  return (
    <span
      ref={wrap}
      className={`tipwrap ${className}`.trim()}
      onMouseEnter={() => later(HOVER_MS)}
      onMouseLeave={hide}
      onFocus={() => { if (!pointerDown.current) { clear(); setOpen(true) } }}
      onBlur={() => { pointerDown.current = false; hide() }}
      onPointerDown={e => {
        pointerDown.current = true; longPressed.current = false
        if (e.pointerType === 'touch') { clear(); timer.current = window.setTimeout(() => { longPressed.current = true; setOpen(true); timer.current = window.setTimeout(hide, 2200) }, PRESS_MS) }
        else hide()
      }}
      onPointerUp={() => { if (!longPressed.current) clear() }}
      onPointerCancel={hide}
      onKeyDown={() => { pointerDown.current = false }}
      onClickCapture={e => { if (longPressed.current) { e.preventDefault(); e.stopPropagation(); longPressed.current = false } }}
      onContextMenu={e => { if (longPressed.current) e.preventDefault() }}
    >
      {children}
      {open && createPortal(
        <span ref={tip} className={`tip tip-on${pos.below ? ' tip-below' : ''}`} style={{ left: pos.left, top: pos.top, ['--tip-arrow' as string]: `${pos.arrow}px` }} aria-hidden="true" data-open="true">
          {label}{shortcut && <kbd className="tipkey">{shortcut}</kbd>}
        </span>, document.body)}
    </span>
  )
}
