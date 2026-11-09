// Which window of the Curriculum page is open (Progress or Mastery challenge), kept outside the address because the address is cleared after a
// deep link (?win=progress) is read. The phone tab bar reads it so the right tab stays lit.
import { useSyncExternalStore } from 'react';

export type ActiveWindow = 'progress' | 'challenge' | null
let current: ActiveWindow = null
const subs = new Set<() => void>()
export function setActiveWindow(w: ActiveWindow) { if (w === current) return; current = w; subs.forEach(f => f()) }
export function useActiveWindow(): ActiveWindow {
  return useSyncExternalStore(f => { subs.add(f); return () => { subs.delete(f) } }, () => current, () => null)
}
