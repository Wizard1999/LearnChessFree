import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'

const HOVER_MS = 400
const PRESS_MS = 500

/**
 * Tooltip around one control. The control keeps its own accessible name (aria-label); the tip is a visual helper for sighted
 * users, so it is hidden from the accessibility tree and is never the only name. It shows after 400 ms of hover, at once on
 * keyboard focus, and after a long press on touch. Escape closes it. It sits above the control (below when there is no room
 * above) and is nudged to stay inside the viewport.
 */
export function Tooltip({ label, shortcut, children, className = '' }: { label: string; shortcut?: string; children: ReactNode; className?: string }) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState({ dx: 0, below: false })
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
    const centre = w.left + w.width / 2
    let dx = 0
    if (centre - t.width / 2 < margin) dx = margin - (centre - t.width / 2)
    else if (centre + t.width / 2 > window.innerWidth - margin) dx = window.innerWidth - margin - (centre + t.width / 2)
    const below = w.top - t.height - 10 < margin
    setPos(p => (p.dx === dx && p.below === below ? p : { dx, below }))
  }, [open, label, shortcut])

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
      <span ref={tip} className={`tip${open ? ' tip-on' : ''}${pos.below ? ' tip-below' : ''}`} style={{ ['--tip-dx' as string]: `${pos.dx}px` }} aria-hidden="true" data-open={open}>
        {label}{shortcut && <kbd className="tipkey">{shortcut}</kbd>}
      </span>
    </span>
  )
}
