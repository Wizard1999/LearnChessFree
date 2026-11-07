// Skill names on the map (owner, 8 Nov 2026): a calm map. Only the names that matter now are shown (the chosen skill, the skill pointed at, skills in
// progress and skills whose prerequisites are all met); the rest appear when pointed at. Names are drawn in SCREEN pixels (a fixed readable size at every
// zoom), as plates, always centred just below their node: the position never depends on other names, so nothing jumps and the pattern is the same everywhere.

export interface LabelNode { id: string; x: number; y: number; title: string; priority: number; ring?: number }
export interface MapView { x: number; y: number; k: number }
export interface Box { x: number; y: number; w: number; h: number }
export interface PlacedLabel { id: string; text: string; box: Box; forced: boolean }
export interface LabelOptions { fontPx?: number; minPriority?: number; maxLabels?: number; margin?: number }

/** Pixels per map unit for the svg (viewBox 2R/k square, centred, preserveAspectRatio meet). */
export const mapScale = (R: number, k: number, w: number, h: number) => Math.min(w, h) / ((2 * R) / k)

export function toScreen(n: { x: number; y: number }, view: MapView, scale: number, w: number, h: number) {
  return { sx: w / 2 + (n.x + view.x) * scale, sy: h / 2 + (n.y + view.y) * scale }
}

export function labelText(title: string, max = 30): string {
  return title.length > max ? `${title.slice(0, max - 1).trimEnd()}…` : title
}

/** Place the names that are shown. Every plate sits in the SAME spot relative to its node (centred, just below it): nothing slides to a free side or
 * avoids another name, so the map reads as one steady pattern. Which names are shown is the caller's choice (priority); `forced` (>= 800) marks the chosen one. */
export function planLabels(nodes: LabelNode[], view: MapView, R: number, w: number, h: number, opts: LabelOptions = {}): PlacedLabel[] {
  const fontPx = opts.fontPx ?? 14, minPriority = opts.minPriority ?? 0
  if (w <= 0 || h <= 0) return []
  const scale = mapScale(R, view.k, w, h), rNode = 22 * scale
  const order = nodes.filter(n => n.priority >= minPriority).sort((a, b) => b.priority - a.priority || (a.ring ?? 0) - (b.ring ?? 0) || a.id.localeCompare(b.id))
  const placed: PlacedLabel[] = []
  for (const n of order) {
    const { sx, sy } = toScreen(n, view, scale, w, h)
    if (sx < -rNode || sx > w + rNode || sy < -rNode || sy > h + rNode) continue
    if (opts.maxLabels !== undefined && placed.length >= opts.maxLabels && n.priority < 800) break
    const text = labelText(n.title, n.priority >= 800 ? 44 : 30)
    const tw = Math.ceil(text.length * fontPx * 0.58) + 14, th = fontPx + 10
    placed.push({ id: n.id, text, box: { x: sx - tw / 2, y: sy + Math.max(rNode, 6) + 4, w: tw, h: th }, forced: n.priority >= 800 })
  }
  return placed
}
