// What the map shows at which zoom (roadmap 2f / 2g): far away the stage rings and slice names, at medium zoom the skill names, close up the connections and status.
export type ZoomZone = 'far' | 'mid' | 'near'
export const zoomZone = (k: number): ZoomZone => (k < 1.5 ? 'far' : k < 3.5 ? 'mid' : 'near')

/**
 * Choose the words and the size of a ring label that runs along a circle of the given radius. The label may span at most `maxAngle` radians.
 * The first candidate that fits at about the wanted size wins; otherwise the last (shortest) is shrunk to fit. Sizes are in map units.
 */
export function ringLabelPlan(radius: number, desired: number, candidates: string[], maxAngle = 2.5, fallbackIndex = candidates.length - 1): { text: string; size: number } {
  const fit = (t: string) => (maxAngle * radius) / (Math.max(1, t.length) * 0.6)
  for (const c of candidates) if (fit(c) >= desired * 0.9) return { text: c, size: Math.min(desired, fit(c)) }
  const last = candidates[fallbackIndex] ?? candidates[candidates.length - 1] ?? ''
  return { text: last, size: Math.min(desired, fit(last)) }
}

/**
 * The two half-circle paths that carry a stage boundary's text. The words ARE the boundary (no line is drawn), so the text is centred on the circle of
 * radius `outer`. Both halves run left to right: the top half goes clockwise over the top (letters rise outward, baseline just inside the boundary), the
 * bottom half goes counter-clockwise along the bottom (letters hang inward, baseline just outside). That keeps every letter upright; the text flips at
 * the left and right edges of the circle, halfway round.
 */
export function ringTextPaths(outer: number, size: number): { top: string; bottom: string; rTop: number; rBottom: number } {
  const rTop = outer - size * 0.36, rBottom = outer + size * 0.36
  return {
    top: `M${-rTop},0 A${rTop},${rTop} 0 0 1 ${rTop},0`,
    bottom: `M${-rBottom},0 A${rBottom},${rBottom} 0 0 0 ${rBottom},0`,
    rTop, rBottom,
  }
}
