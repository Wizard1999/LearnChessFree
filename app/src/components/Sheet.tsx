import { useEffect, useId, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { usePhone } from '../lib/usePhone'

/** A bottom sheet for phones (docs/mobile-design.md): it covers the lower part of the screen so the board or map above stays in sight.
 *  A close button, a tap on the light backdrop or Escape closes it; focus moves to the close button and returns to the opener. */
export function Sheet({ open, onClose, title, children, className }: { open: boolean; onClose: () => void; title: string; children: ReactNode; className?: string }) {
  const closeBtn = useRef<HTMLButtonElement>(null)
  const id = useId()
  const close = useRef(onClose)
  useEffect(() => { close.current = onClose })
  // depends on `open` only: a parent that re-renders with a new onClose must not move the focus again
  useEffect(() => {
    if (!open) return
    const opener = document.activeElement as HTMLElement | null
    closeBtn.current?.focus()
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { e.preventDefault(); close.current() } }
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('keydown', onKey); opener?.focus?.() }
  }, [open])
  if (!open) return null
  // a portal to the body, so a sheet opened from inside the sticky board is never under the action bar
  return createPortal(
    <>
      <div className="sheet-backdrop" onClick={onClose} aria-hidden="true" />
      <section className={`sheet${className ? ` ${className}` : ''}`} role="dialog" aria-modal="true" aria-labelledby={`${id}-t`}>
        <div className="sheet-head">
          <span className="sheet-grip" aria-hidden="true" />
          <h2 id={`${id}-t`}>{title}</h2>
          <button type="button" ref={closeBtn} className="sheet-close" onClick={onClose} aria-label={`Close ${title.toLowerCase()}`}>Close</button>
        </div>
        <div className="sheet-body">{children}</div>
      </section>
    </>,
    document.body,
  )
}

/** A fold that is a <details> on wider screens and a button that opens a bottom sheet on a phone. The desktop markup is unchanged. */
export function PhoneFold({ summary, className, children, open, onToggle }: { summary: string; className?: string; children: ReactNode; open: boolean; onToggle: (open: boolean) => void }) {
  const phone = usePhone()
  if (!phone) return <details className={className}><summary>{summary}</summary>{children}</details>
  return (
    <>
      <button type="button" className={`sheetopener${className ? ` ${className}` : ''}`} aria-haspopup="dialog" aria-expanded={open} onClick={() => onToggle(true)}>{summary}</button>
      <Sheet open={open} onClose={() => onToggle(false)} title={summary}>{children}</Sheet>
    </>
  )
}
