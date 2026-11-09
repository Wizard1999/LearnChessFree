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

/** The lowest strength of a live line: a frontier line is always a little above the hairline of old territory. */
export const FRONTIER_MIN = 0.1

/** How one line looks when nothing is chosen (Andrew, 9 Nov 2026). A line into a skill that is NOT yet completed is a live frontier line: graded by `edgeStrength`
 *  (0.1 to 1). A line into a completed skill leads nowhere new: it is old territory and gets the thinnest hairline at the dimmest allowed brightness (power 0, `old`),
 *  with no glow and no head. This covers lines between two completed skills and lines out of a completed skill into completed ones. */
export function lineLook(edges: MapEdge[], level: (id: string) => number): (from: string, to: string) => { old: boolean; power: number } {
  const strength = edgeStrength(edges, level)
  return (from, to) => isDone(level(to)) ? { old: true, power: 0 } : { old: false, power: FRONTIER_MIN + (1 - FRONTIER_MIN) * strength(from, to) }
}

/** The necessary links only: an edge A to C is dropped when A reaches C some other way (A to B to C). Cycle-safe; the order of the remaining edges is kept. */
export function transitiveReduction(edges: MapEdge[]): MapEdge[] {
  const out = new Map<string, string[]>()
  for (const e of edges) out.set(e.from, [...(out.get(e.from) ?? []), e.to])
  const reaches = (from: string, target: string, skip: MapEdge): boolean => {
    const seen = new Set<string>([from]), stack = [from]
    while (stack.length) {
      const n = stack.pop()!
      for (const m of out.get(n) ?? []) {
        if (n === skip.from && m === skip.to) continue
        if (m === target) return true
        if (!seen.has(m)) { seen.add(m); stack.push(m) }
      }
    }
    return false
  }
  return edges.filter(e => !reaches(e.from, e.to, e))
}

/** Three tiers of line (D88f). LIVE: from a skill you have started toward one you have not completed (graded by `edgeStrength`, at most `maxLive` of the strongest);
 *  FIGURE: the soft shape of finished territory (each completed skill linked to at most its two strongest completed prerequisites), a little brighter when recent;
 *  BACKDROP: everything else, decorative only (old territory, surplus live lines, links toward skills not reached yet); FAR is the part of the backdrop between two skills
 *  not started whose neighbours are not live: shown only when `showFar` or an end is the chosen or pointed-at skill. With `all`, links the reduction removed and
 *  the far ones are shown too, at backdrop strength. Only LIVE lines (and the chosen skill's own links and trail, drawn elsewhere) carry the 3:1 line gate. */
export type LineTier = 'live' | 'figure' | 'backdrop' | 'far'
export interface TieredEdge { from: string; to: string; tier: LineTier; /** 0..1, live lines only (FRONTIER_MIN to 1) */ power: number; /** 0..1 how recently a figure line was drawn */ fresh: number }
export interface TierOptions { maxLive: number; showFar: boolean; focus?: string | null; recent?: (id: string) => number; all?: boolean }
export function tierEdges(edges: MapEdge[], level: (id: string) => number, opt: TierOptions): TieredEdge[] {
  const reduced = transitiveReduction(edges), strength = edgeStrength(edges, level)
  const keyOf = (e: MapEdge) => `${e.from}>${e.to}`
  const liveC = reduced.filter(e => !isDone(level(e.to)) && level(e.from) >= 1)
    .map(e => ({ e, s: strength(e.from, e.to) })).sort((a, b) => b.s - a.s || keyOf(a.e).localeCompare(keyOf(b.e)))
  const live = new Map(liveC.slice(0, Math.max(0, opt.maxLive)).map(x => [keyOf(x.e), x.s]))
  const liveStars = new Set<string>(); for (const k of live.keys()) { const [f, t] = k.split('>'); liveStars.add(f); liveStars.add(t) }
  const keepFig = new Set<string>(), byTarget = new Map<string, MapEdge[]>()
  for (const e of reduced) if (isDone(level(e.from)) && isDone(level(e.to))) byTarget.set(e.to, [...(byTarget.get(e.to) ?? []), e])
  for (const es of byTarget.values()) es.sort((a, b) => level(b.from) - level(a.from) || a.from.localeCompare(b.from)).slice(0, 2).forEach(e => keepFig.add(keyOf(e)))
  const out: TieredEdge[] = []
  const touchesFocus = (e: MapEdge) => !!opt.focus && (e.from === opt.focus || e.to === opt.focus)
  for (const e of reduced) {
    const k = keyOf(e), base = { from: e.from, to: e.to, power: 0, fresh: 0 }
    if (live.has(k)) { out.push({ ...base, tier: 'live', power: FRONTIER_MIN + (1 - FRONTIER_MIN) * live.get(k)! }); continue }
    if (keepFig.has(k)) { out.push({ ...base, tier: 'figure', fresh: Math.max(0, Math.min(1, opt.recent?.(e.to) ?? 0)) }); continue }
    const far = level(e.from) === 0 && level(e.to) === 0 && !liveStars.has(e.from) && !liveStars.has(e.to)
    if (far) { if (opt.showFar || opt.all || touchesFocus(e)) out.push({ ...base, tier: 'far' }); continue }
    out.push({ ...base, tier: 'backdrop' })
  }
  if (opt.all) { const kept = new Set(reduced.map(keyOf)); for (const e of edges) if (!kept.has(keyOf(e))) out.push({ from: e.from, to: e.to, tier: 'backdrop', power: 0, fresh: 0 }) }
  return out
}
