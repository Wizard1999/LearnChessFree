// Radial layout for the curriculum map (docs/map-radial-design.md): the first node in the centre, one ring per prerequisite step,
// one wedge per strand. Pure function of the skill list; no randomness, so the map looks the same every time.
import type { Skill } from '../types'

export interface MapNode { id: string; strand: string; ring: number; angle: number; x: number; y: number; tier: number }
export interface MapEdge { from: string; to: string }
export interface MapLayout { nodes: MapNode[]; edges: MapEdge[]; rings: number; wedges: { strand: string; from: number; to: number }[]; radius: number }

const STEP = 90 // distance between rings, in map units
const CENTRE_GAP = 40

/** Skill-level prerequisite edges: a skill depends on every other skill named in any of its depths' prerequisites. */
export function skillEdges(skills: Skill[]): MapEdge[] {
  const ids = new Set(skills.map(s => s.id))
  const seen = new Set<string>(); const out: MapEdge[] = []
  for (const s of skills) for (const d of Object.values(s.depths)) for (const p of d.prereqs ?? []) {
    const i = p.lastIndexOf('.'); const from = p.slice(0, i)
    if (from !== s.id && ids.has(from) && !seen.has(`${from}>${s.id}`)) { seen.add(`${from}>${s.id}`); out.push({ from, to: s.id }) }
  }
  return out
}

export function layoutMap(skills: Skill[]): MapLayout {
  const edges = skillEdges(skills)
  const parents = new Map<string, string[]>()
  for (const e of edges) parents.set(e.to, [...(parents.get(e.to) ?? []), e.from])
  // ring = the longest prerequisite chain behind the skill (cycle-safe)
  const ring = new Map<string, number>()
  const depth = (id: string, path: Set<string>): number => {
    const known = ring.get(id); if (known !== undefined) return known
    if (path.has(id)) return 0
    path.add(id)
    const r = Math.max(-1, ...(parents.get(id) ?? []).map(p => depth(p, path))) + 1
    path.delete(id); ring.set(id, r); return r
  }
  for (const s of skills) depth(s.id, new Set())
  const strands = [...new Set(skills.map(s => s.strand))].sort((a, b) => Number(a.slice(1)) - Number(b.slice(1)))
  // wedge width proportional to the strand's size, so big strands get room
  const total = skills.length
  const wedges: MapLayout['wedges'] = []
  let a0 = -Math.PI / 2
  for (const st of strands) { const w = (2 * Math.PI * skills.filter(s => s.strand === st).length) / total; wedges.push({ strand: st, from: a0, to: a0 + w }); a0 += w }
  const nodes: MapNode[] = []
  for (const w of wedges) {
    const inStrand = skills.filter(s => s.strand === w.strand)
    const byRing = new Map<number, Skill[]>()
    for (const s of inStrand) byRing.set(ring.get(s.id)!, [...(byRing.get(ring.get(s.id)!) ?? []), s])
    for (const [r, group] of byRing) {
      group.sort((x, y) => x.id.localeCompare(y.id))
      group.forEach((s, i) => {
        const angle = w.from + ((i + 0.5) / group.length) * (w.to - w.from)
        const rad = r === 0 && s.id === 'FND.BOARD' ? 0 : CENTRE_GAP + (r + 1) * STEP
        nodes.push({ id: s.id, strand: s.strand, ring: r, angle, x: Math.cos(angle) * rad, y: Math.sin(angle) * rad, tier: s.tier })
      })
    }
  }
  const rings = Math.max(0, ...[...ring.values()]) + 1
  return { nodes, edges, rings, wedges, radius: CENTRE_GAP + (rings + 1) * STEP }
}
