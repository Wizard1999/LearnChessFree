// Openings explorer data layer. Contract: docs/openings-data.md and app/public/openings/README.md.
// The graph is keyed by POSITION, so move-order transpositions merge into one node with several parents.
export interface OBand { id: string; label: string; min: number; max: number; games: number }
export interface OManifest {
  version: number; dev?: boolean
  source: { name: string; month: string; games_scanned: number; games_used: number; speeds: string[]; sampling: string; generated: string }
  bands: OBand[]; bandRule: string; maxPly: number; core: string; chunkIndex: string | null; dir: string
}
export interface ONode { e: string; p: number; n: number[]; eco: string | null; name: string | null; path: string; c?: string }
export interface OEdge { f: string; t: string; m: string; u: string; n: number[]; w: number[]; d: number[] }

export interface OGraph {
  manifest: OManifest
  nodes: Map<string, ONode>
  out: Map<string, OEdge[]>
  inn: Map<string, OEdge[]>
  rootId: string
  base: string
  chunkIndex: Record<string, string>
  loadedChunks: Set<string>
  version: number
}

async function getJson<T>(url: string): Promise<T> {
  const r = await fetch(url)
  if (!r.ok) throw new Error(`${url}: ${r.status}`)
  return r.json() as Promise<T>
}

export function emptyGraph(manifest: OManifest, base: string): OGraph {
  return { manifest, nodes: new Map(), out: new Map(), inn: new Map(), rootId: '', base, chunkIndex: {}, loadedChunks: new Set(), version: 0 }
}

export function mergeInto(g: OGraph, data: { nodes: Record<string, ONode>; edges: OEdge[] }) {
  for (const [id, n] of Object.entries(data.nodes)) {
    const old = g.nodes.get(id)
    if (!old) g.nodes.set(id, n)
    else { if (n.c && !old.c) old.c = n.c; if (n.p < old.p) old.p = n.p; if (!old.name && n.name) { old.name = n.name; old.eco = n.eco } }
  }
  const have = new Set<string>()
  for (const l of g.out.values()) for (const e of l) have.add(e.f + e.u)
  for (const e of data.edges) {
    if (have.has(e.f + e.u)) continue
    have.add(e.f + e.u)
    g.out.set(e.f, [...(g.out.get(e.f) ?? []), e])
    g.inn.set(e.t, [...(g.inn.get(e.t) ?? []), e])
  }
  g.version++
}

/** Load the manifest and the core graph. Tries /openings/ first and falls back to /openings-dev/ so the UI works while the full build runs. */
export async function loadOpenings(): Promise<OGraph> {
  const root = import.meta.env.BASE_URL
  let base = `${root}openings/`
  let manifest: OManifest
  try { manifest = await getJson<OManifest>(`${base}manifest.json`) }
  catch { base = `${root}openings-dev/`; manifest = await getJson<OManifest>(`${base}manifest.json`) }
  const g = emptyGraph(manifest, base)
  const core = await getJson<{ nodes: Record<string, ONode>; edges: OEdge[] }>(`${base}${manifest.core}`)
  mergeInto(g, core)
  g.rootId = [...g.nodes.entries()].find(([, n]) => n.p === 0)![0]
  if (manifest.chunkIndex) { try { g.chunkIndex = await getJson<Record<string, string>>(`${base}${manifest.chunkIndex}`) } catch { /* chunks are optional */ } }
  for (const [id, n] of g.nodes) if (n.c && !g.chunkIndex[id]) g.chunkIndex[id] = n.c
  return g
}

/** Fetch the deeper lines below a boundary node, once. */
export async function ensureChunk(g: OGraph, nodeId: string): Promise<boolean> {
  const file = g.chunkIndex[nodeId] ?? g.nodes.get(nodeId)?.c
  if (!file || g.loadedChunks.has(file)) return false
  g.loadedChunks.add(file)
  try { mergeInto(g, await getJson(`${g.base}${g.manifest.dir}${file}`)); return true } catch { g.loadedChunks.delete(file); return false }
}

export const sum = (a: number[]) => a.reduce((s, x) => s + x, 0)
/** Counts for a band index, or all bands when `band` is null. */
export const cnt = (a: number[], band: number | null) => (band === null ? sum(a) : a[band] ?? 0)

export function nodeFen(n: ONode): string { return `${n.e} 0 1` }

/** The opening name of a node, inherited from the nearest named ancestor along the first parent chain. */
export function nameOf(g: OGraph, id: string): { eco: string | null; name: string | null } {
  let cur: string | undefined = id
  for (let guard = 0; guard < 40 && cur; guard++) {
    const n = g.nodes.get(cur)
    if (n?.name) return { eco: n.eco, name: n.name }
    const parents = g.inn.get(cur)
    if (!parents || parents.length === 0) break
    const best = parents.reduce((a, b) => (sum(b.n) > sum(a.n) ? b : a))
    cur = best.f
  }
  return { eco: null, name: null }
}

export function children(g: OGraph, id: string, band: number | null): OEdge[] {
  return [...(g.out.get(id) ?? [])].sort((a, b) => cnt(b.n, band) - cnt(a.n, band))
}
