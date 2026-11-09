// The star chart look of the Constellations page (D88). Pure helpers, no DOM: how a skill is drawn as a star, and how the chart is labelled.

/** How one skill is drawn. level 0 (not started) .. 4 (Mastered). Units are map units, the same as the layout. */
export interface StarSpec {
  /** radius of the star's disc */ r: number
  /** radius of its soft glow (0 = none) */ glowR: number
  /** opacity of the glow, 0..1 */ glowOpacity: number
  /** share of the disc that is lit, filling upward like water (0, .25, .5, .75, 1) */ fill: number
  /** Mastered stars get rays */ rays: boolean
  /** length of the longest ray, from the centre (0 = none) */ rayLen: number
}

const R = [5, 8.5, 11.5, 14, 16]
const GLOW_OPACITY = [0, 0.3, 0.45, 0.62, 0.85]

/** Size and brightness by level: bigger and brighter with every level. A star never started is a faint dim dot (never an empty ring); a star in the middle of a lit
 *  cluster (all neighbours finished: `lone`) keeps a wider glow, as the old finished-skill glow did. */
export function starSpec(level: number, lone = false): StarSpec {
  const l = Math.max(0, Math.min(4, Math.trunc(Number.isFinite(level) ? level : 0)))
  const r = R[l]
  const glowR = l === 0 ? 0 : r * (lone ? 4 : 3)
  return { r, glowR, glowOpacity: GLOW_OPACITY[l], fill: l / 4, rays: l === 4, rayLen: l === 4 ? r * 2.7 : 0 }
}

const NUMERALS: [number, string][] = [[10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']]
/** Roman numerals for the stage rings (1 -> I). Anything below 1 or not a whole number gives an empty string. */
export function roman(n: number): string {
  if (!Number.isInteger(n) || n < 1 || n > 39) return ''
  let out = '', rest = n
  for (const [v, s] of NUMERALS) while (rest >= v) { out += s; rest -= v }
  return out
}

/** A subject drawn as a constellation: its name (the section code only when it has no name) and its progress. */
export function constellationLabel(code: string, name: string | undefined, pct: number): string {
  const nm = (name ?? '').trim()
  return `${nm || code} · ${Math.round(pct)}%`
}

/** A navigator's pointer ring: four short tick marks at north, east, south and west, outside a ring of radius r. */
export function pointerTicks(r: number, len: number): string {
  const a = r + len
  return `M0,${-r} L0,${-a} M0,${r} L0,${a} M${-r},0 L${-a},0 M${r},0 L${a},0`
}

/** Rays of a Mastered star: eight, the four on the axes longest. Returned as one path. */
export function rayPath(len: number): string {
  const d: string[] = []
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4, l = i % 2 === 0 ? len : len * 0.6, r0 = len * 0.28
    d.push(`M${(Math.cos(a) * r0).toFixed(2)},${(Math.sin(a) * r0).toFixed(2)} L${(Math.cos(a) * l).toFixed(2)},${(Math.sin(a) * l).toFixed(2)}`)
  }
  return d.join(' ')
}

/** A compass rose as one closed path: four long points (north, east, south, west), four short ones between them, and notches at radius `inner`. */
export function rosePath(long: number, short: number, inner: number): string {
  const pts: string[] = []
  for (let i = 0; i < 16; i++) {
    const a = (i * Math.PI) / 8 - Math.PI / 2, r = i % 4 === 0 ? long : i % 4 === 2 ? short : inner
    pts.push(`${(Math.cos(a) * r).toFixed(2)},${(Math.sin(a) * r).toFixed(2)}`)
  }
  return `M${pts.join(' L')} Z`
}

/** A fixed scatter of faint background stars inside a square tile of the given size: the same every time (a small deterministic generator, no Math.random).
 *  `o` is the opacity, `r` the radius in map units; the biggest few are brighter. */
export function dustField(seed: number, count: number, size: number): { x: number; y: number; r: number; o: number }[] {
  let s = (seed >>> 0) || 1
  const next = () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296 }
  return Array.from({ length: count }, () => {
    const x = next() * size, y = next() * size, big = next()
    return { x: +x.toFixed(1), y: +y.toFixed(1), r: big > 0.92 ? 2.6 : big > 0.6 ? 1.7 : 1.1, o: big > 0.92 ? 0.55 : big > 0.6 ? 0.38 : 0.26 }
  })
}
