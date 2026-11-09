// Which lines the radial map draws, and how brightly (Andrew, 9 Nov 2026; docs/map-visual-direction.md). Pure functions, no DOM.
//
// "Completed" = the lesson-level notion the map's readiness already uses: Guided or better (progress level >= 2). One notion for both the
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

/** The whole way into a skill: every line on any chain of prerequisites that ends at `focus` (the direct links included). Used for the soft highlight along the path
 *  from the chosen skill back to where it starts; cycle-safe. */
export function ancestorEdges(edges: MapEdge[], focus: string | null): MapEdge[] {
  if (!focus) return []
  const into = new Map<string, MapEdge[]>()
  for (const e of edges) into.set(e.to, [...(into.get(e.to) ?? []), e])
  const seen = new Set<string>([focus]), out: MapEdge[] = [], queue = [focus]
  while (queue.length) {
    const t = queue.shift()!
    for (const e of into.get(t) ?? []) { out.push(e); if (!seen.has(e.from)) { seen.add(e.from); queue.push(e.from) } }
  }
  return out
}

/** How strongly one line glows (0..1), so that constellations seem to be drawn as stars light up (Andrew, 9 Nov 2026): half from how far the line's source skill has
 *  come (Seen counts a little, Guided or better fully), half from the average of ALL the target's prerequisites the same way. It rises in small steps with every bit of
 *  progress, unlike `prereqShare`, which only counts completed prerequisites and so has very few values. */
export function edgeStrength(edges: MapEdge[], level: (id: string) => number): (from: string, to: string) => number {
  const credit = (id: string) => Math.max(0, Math.min(1, level(id) / DONE_LEVEL))
  const into = new Map<string, string[]>()
  for (const e of edges) into.set(e.to, [...(into.get(e.to) ?? []), e.from])
  return (from, to) => {
    const ps = into.get(to) ?? [from]
    return 0.5 * credit(from) + 0.5 * (ps.reduce((t, p) => t + credit(p), 0) / ps.length)
  }
}
