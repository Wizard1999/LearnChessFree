// Which windows of the Curriculum page are open (Progress, Mastery challenge), kept outside the address because the address is cleared after a
// deep link (?win=progress) is read. The header and the phone tab bar read it so the right item stays lit. The header also asks the page to
// toggle a window (requestToggle) when the Curriculum page is already showing; elsewhere it navigates to /course?win=...
import { useSyncExternalStore } from 'react'

export type ActiveWindow = 'progress' | 'challenge' | null
export type OpenWindows = { progress: boolean; challenge: boolean }
let current: OpenWindows = { progress: false, challenge: false }
const subs = new Set<() => void>()
export function setOpenWindows(w: OpenWindows) {
  if (w.progress === current.progress && w.challenge === current.challenge) return
  current = { progress: w.progress, challenge: w.challenge }; subs.forEach(f => f())
}
export function setActiveWindow(w: ActiveWindow) { setOpenWindows({ progress: w === 'progress', challenge: w === 'challenge' }) }
export function useOpenWindows(): OpenWindows {
  return useSyncExternalStore(f => { subs.add(f); return () => { subs.delete(f) } }, () => current, () => current)
}
export function useActiveWindow(): ActiveWindow {
  const w = useOpenWindows()
  return w.progress ? 'progress' : w.challenge ? 'challenge' : null
}

type Handler = (k: 'progress' | 'challenge') => void
const handlers = new Set<Handler>()
/** The Curriculum page registers while it is mounted. */
export function onToggleRequest(h: Handler) { handlers.add(h); return () => { handlers.delete(h) } }
/** True when the Curriculum page took the request (so the caller should not navigate). */
export function requestToggle(k: 'progress' | 'challenge'): boolean { if (handlers.size === 0) return false; handlers.forEach(h => h(k)); return true }
