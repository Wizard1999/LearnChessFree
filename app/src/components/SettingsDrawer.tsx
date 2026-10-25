import { useEffect, useRef } from 'react'
import { SettingsContent } from '../pages/Settings'

/** Settings as a panel that slides over the right side of the screen. Escape, the close button or a click outside closes it,
 *  focus moves into the panel and returns to the opening button, and Tab stays inside while it is open. */
export function SettingsDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const panel = useRef<HTMLElement>(null)
  const closeBtn = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const opener = document.activeElement as HTMLElement | null
    closeBtn.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); return }
      if (e.key !== 'Tab' || !panel.current) return
      const f = [...panel.current.querySelectorAll<HTMLElement>('a[href], button:not(:disabled), input:not(:disabled), select, textarea, [tabindex]:not([tabindex="-1"])')].filter(x => x.offsetParent !== null)
      if (f.length === 0) return
      const first = f[0], last = f[f.length - 1]
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('keydown', onKey); opener?.focus?.() }
  }, [open, onClose])

  if (!open) return null
  return (
    <>
      <div className="drawer-backdrop" onClick={onClose} aria-hidden="true" />
      <aside className="drawer" role="dialog" aria-modal="true" aria-labelledby="drawer-title" ref={panel}>
        <div className="drawer-head">
          <h2 id="drawer-title">Settings and your data</h2>
          <button type="button" ref={closeBtn} onClick={onClose} aria-label="Close settings">Close</button>
        </div>
        <SettingsContent />
      </aside>
    </>
  )
}
