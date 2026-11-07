// Geometric primitives for the Scholarmate look's illustrations: each draws one flat shape inside a 100 x 100 view box at (x, y) with side s.
// They carry only a class name; the colours come from the CSS tokens of the look (--art-1..4, or currentColor in a band), so one drawing is right
// in both light and dark mode. All are purely decorative (the callers set aria-hidden).
import type { CSSProperties } from 'react'

export interface ShapeProps { x: number; y: number; s: number; className?: string; style?: CSSProperties }

export function Circle({ x, y, s, className, style }: ShapeProps) {
  return <circle cx={x + s / 2} cy={y + s / 2} r={s / 2} className={className} style={style} />
}

/** A quarter disc whose right angle is at one corner of its box: q 0 = top left, 1 = top right, 2 = bottom right, 3 = bottom left. */
export function QuarterCircle({ x, y, s, q = 0, className, style }: ShapeProps & { q?: 0 | 1 | 2 | 3 }) {
  const right = x + s, bottom = y + s
  const d = q === 0 ? `M${x} ${y}H${right}A${s} ${s} 0 0 1 ${x} ${bottom}Z`
    : q === 1 ? `M${right} ${y}V${bottom}A${s} ${s} 0 0 1 ${x} ${y}Z`
    : q === 2 ? `M${right} ${bottom}H${x}A${s} ${s} 0 0 1 ${right} ${y}Z`
    : `M${x} ${bottom}V${y}A${s} ${s} 0 0 1 ${right} ${bottom}Z`
  return <path d={d} className={className} style={style} />
}

/** n upright bars of equal width with equal gaps. */
export function Bars({ x, y, s, n = 3, className, style }: ShapeProps & { n?: number }) {
  const w = s / (2 * n - 1)
  return <g className={className} style={style}>{Array.from({ length: n }, (_, i) => <rect key={i} x={x + i * 2 * w} y={y} width={w} height={s} />)}</g>
}

/** Two filled squares on the diagonal of a 2 x 2 grid: the chessboard in four strokes. */
export function Squares({ x, y, s, className, style }: ShapeProps) {
  const h = s / 2
  return <g className={className} style={style}><rect x={x} y={y} width={h} height={h} /><rect x={x + h} y={y + h} width={h} height={h} /></g>
}

/** n slanted bars, leaning right, clipped by nothing (they stay inside the box). */
export function Diagonals({ x, y, s, n = 3, className, style }: ShapeProps & { n?: number }) {
  const w = s / (2 * n + 1)
  const lean = s * 0.34
  return <g className={className} style={style}>{Array.from({ length: n }, (_, i) => {
    const x0 = x + lean + i * 2 * w
    return <path key={i} d={`M${x0} ${y}h${w}l${-lean} ${s}h${-w}Z`} />
  })}</g>
}
