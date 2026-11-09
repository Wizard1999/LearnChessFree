// Which lines the radial map draws, and how brightly (Andrew, 9 Nov 2026; docs/map-visual-direction.md). Pure functions, no DOM.
//
// "Completed" = the lesson-level notion the map's readiness already uses: Level one or better (progress level >= 2). One notion for both the
// fill-in of a skill and the lines, so a skill you have finished is never shown as still needing its lines.
//   - A line glows with the share of its TARGET skill's prerequisites that are completed: none done = a faint soft glow, all done = the strongest.
//   - A line between two completed skills is not drawn: the line has done its job. A completed skill whose every neighbour is completed has no lines
//     at all (a "star": it stays filled and softly glowing). So lines are drawn only within one step of the frontier (not-yet-completed skills and
//     their direct prerequisites and dependents).
//   - The lines of the chosen (or pointed-at) skill are always drawn at full strength, in both directions, told apart by shape (see RadialMap).
import type { MapEdge } from './mapLayout'

export const DONE_LEVEL = 2
export const isDone = (level: number): boolean => level >= DONE_LEVEL

export type EdgeKind = 'quiet' | 'pre' | 'next'
export interface EdgeDraw { from: string; to: string; /** 0..1: 0 = faint, 1 = strongest */ power: number; kind: EdgeKind }

/** Share of each skill's prerequisites that are completed (a skill with none: 1). */
export function prereqShare(edges: MapEdge[], level: (id: string) => number): Map<string, number> {
  const tot = new Map<string, number>(), done = new Map<string, number>()
  for (const e of edges) { tot.set(e.to, (tot.get(e.to) ?? 0) + 1); if (isDone(level(e.from))) done.set(e.to, (done.get(e.to) ?? 0) + 1) }
  const out = new Map<string, number>()
  for (const [t, n] of tot) out.set(t, (done.get(t) ?? 0) / n)
  return out
}

/** Completed skills whose every neighbour (prerequisite and dependent) is also completed: they draw no lines and stay as stars. */
export function starNodes(ids: string[], edges: MapEdge[], level: (id: string) => number): Set<string> {
  const stars = new Set(ids.filter(id => isDone(level(id))))
  for (const e of edges) { if (!isDone(level(e.from)) || !isDone(level(e.to))) { stars.delete(e.from); stars.delete(e.to) } }
  return stars
}

/** The edges to draw, with strength. `focus` is the chosen or pointed-at skill: all its links are drawn at full strength. */
export function edgesToDraw(edges: MapEdge[], level: (id: string) => number, focus: string | null): EdgeDraw[] {
  const share = prereqShare(edges, level)
  const out: EdgeDraw[] = []
  for (const e of edges) {
    if (focus && e.to === focus) { out.push({ ...e, power: 1, kind: 'pre' }); continue }
    if (focus && e.from === focus) { out.push({ ...e, power: 1, kind: 'next' }); continue }
    if (isDone(level(e.from)) && isDone(level(e.to))) continue
    out.push({ ...e, power: share.get(e.to) ?? 0, kind: 'quiet' })
  }
  return out
}
