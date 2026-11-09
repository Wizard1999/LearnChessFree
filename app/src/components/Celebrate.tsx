import type { CSSProperties } from 'react'
import type { Level } from '../lib/missions'
import { Crest } from './Crest'

/** How full the glass is at each level (the legend: Not started empty ... Mastered full). */
export const GLASS_FILL: Record<Level, number> = { 0: 0, 1: 0.25, 2: 0.5, 3: 0.75, 4: 1 }
const INNER = 42 // the height of the glass's inside, in drawing units

/**
 * The glass that fills (design-feel: water rising to the new level). Decorative: the words beside it say the level. The water's resting place is its
 * final level, so with reduced motion (animations shortened to nothing) the glass simply shows the new level. Fixed size: it never moves the layout.
 */
export function GlassFill({ from, to, className = '' }: { from: Level; to: Level; className?: string }) {
  const style = { '--from': `${(1 - GLASS_FILL[from]) * INNER}px`, '--to': `${(1 - GLASS_FILL[to]) * INNER}px` } as CSSProperties
  return (
    <svg className={`glassfill ${className}`} viewBox="0 0 40 52" width="40" height="52" aria-hidden="true" focusable="false" style={style}>
      <defs><clipPath id="glassclip"><path d="M9 6h22l-3 38a4 4 0 0 1-4 4h-8a4 4 0 0 1-4-4z" /></clipPath></defs>
      <g clipPath="url(#glassclip)"><rect className="water" x="0" y="6" width="40" height={INNER + 4} /></g>
      <path className="glassline" d="M9 6h22l-3 38a4 4 0 0 1-4 4h-8a4 4 0 0 1-4-4z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  )
}

/** A small gold star that lights and settles (Mastered). */
export function StarGlow({ className = '' }: { className?: string }) {
  return (
    <svg className={`stargold ${className}`} viewBox="0 0 40 40" width="40" height="40" aria-hidden="true" focusable="false">
      <path className="starshape" d="M20 4l4.7 10.2 11.1 1.2-8.3 7.5 2.3 11L20 28.2 10.2 33.9l2.3-11-8.3-7.5 11.1-1.2z" strokeLinejoin="round" />
    </svg>
  )
}

/** The crest with a slow shimmer (first game, a finished stage). */
export function CrestGlow() {
  return <span className="crestglow" aria-hidden="true"><Crest /></span>
}
