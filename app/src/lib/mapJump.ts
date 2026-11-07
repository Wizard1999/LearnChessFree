// A tiny message from the skill panel to the map: "move the camera to where this skill returns in that stage" (a ghost marker, roadmap 2f).
const EVENT = 'scholarmate-map-jump'
export interface MapJump { skill: string; stage: number }

export function requestMapJump(j: MapJump) { if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent<MapJump>(EVENT, { detail: j })) }
/** Listen for jump requests; returns the unsubscribe function. */
export function onMapJump(cb: (j: MapJump) => void): () => void {
  if (typeof window === 'undefined') return () => {}
  const h = (e: Event) => cb((e as CustomEvent<MapJump>).detail)
  window.addEventListener(EVENT, h)
  return () => window.removeEventListener(EVENT, h)
}
