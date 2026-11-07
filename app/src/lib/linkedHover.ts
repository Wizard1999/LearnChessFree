// One shared "which skill is the pointer on" for every window that can be open at the same time (the map, the Progress boxes, Up next, the skill list):
// pointing at a skill in any of them highlights that same skill in all of them. A rule for the Curriculum windows (D44).
import { useSyncExternalStore } from 'react'

let current: string | null = null
const listeners = new Set<() => void>()

/** Set the skill under the pointer (or null when it leaves). */
export function setLinkedHover(id: string | null) {
  if (current === id) return
  current = id
  for (const l of listeners) l()
}
export const getLinkedHover = () => current
const subscribe = (cb: () => void) => { listeners.add(cb); return () => { listeners.delete(cb) } }
/** The skill that is highlighted across the windows right now. */
export function useLinkedHover(): string | null {
  return useSyncExternalStore(subscribe, getLinkedHover, () => null)
}
/** Props that make any element a link in the shared hover: spread them on a skill's box, row or node. */
export const linkedHoverHandlers = (id: string) => ({
  onMouseEnter: () => setLinkedHover(id),
  onMouseLeave: () => setLinkedHover(null),
  onFocus: () => setLinkedHover(id),
  onBlur: () => setLinkedHover(null),
})
