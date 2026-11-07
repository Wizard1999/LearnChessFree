// Illustrations for the Scholarmate look: small inline-SVG compositions of circles, quarter circles, bars, squares and diagonals.
// Every one is decorative (aria-hidden), a few shapes, no animation. They are drawn in every look but only shown in the Scholarmate look
// (the .art rule in styles/scholarmate.css), and they never sit under text: callers place them beside it or on a band's end.
// Colours: scenes use --art-1..4 (cobalt, persimmon, gold, jade, mode-aware); emblems use currentColor, which is the band's own text colour.
import { Bars, Circle, Diagonals, QuarterCircle, Squares } from './shapes'

export { Bars, Circle, Diagonals, QuarterCircle, Squares }

const svgProps = { viewBox: '0 0 100 100', 'aria-hidden': true, focusable: false } as const

export type SceneKind = 'start' | 'games' | 'attempts' | 'done' | 'postgame'

/** A bold scene for the start screen, empty states, lesson completion and the post-game card. `quiet` lowers it (used inside a lesson). */
export function ArtScene({ kind, quiet = false, className = '' }: { kind: SceneKind; quiet?: boolean; className?: string }) {
  const cls = `art art-scene art-${kind}${quiet ? ' quiet' : ''} ${className}`.trim()
  switch (kind) {
    case 'start': return (
      <svg {...svgProps} className={cls}>
        <QuarterCircle x={20} y={20} s={80} q={2} className="a1" />
        <Circle x={6} y={6} s={44} className="a3" />
        <Squares x={58} y={4} s={34} className="a4" />
        <Diagonals x={2} y={58} s={38} n={3} className="a2" />
      </svg>)
    case 'games': return (
      <svg {...svgProps} className={cls}>
        <Squares x={10} y={34} s={56} className="a1" />
        <Circle x={52} y={8} s={38} className="a3" />
        <Bars x={62} y={56} s={34} n={3} className="a2" />
      </svg>)
    case 'attempts': return (
      <svg {...svgProps} className={cls}>
        <Bars x={8} y={30} s={60} n={3} className="a4" />
        <Circle x={56} y={8} s={36} className="a2" />
        <QuarterCircle x={52} y={50} s={42} q={3} className="a1" />
      </svg>)
    case 'done': return (
      <svg {...svgProps} className={cls}>
        <Circle x={14} y={14} s={72} className="a4" />
        <Circle x={52} y={6} s={34} className="a3" />
        <QuarterCircle x={6} y={58} s={36} q={1} className="a1" />
        <Diagonals x={64} y={60} s={32} n={2} className="a2" />
      </svg>)
    case 'postgame': return (
      <svg {...svgProps} className={cls}>
        <Squares x={6} y={6} s={58} className="a1" />
        <QuarterCircle x={44} y={44} s={52} q={2} className="a2" />
        <Circle x={66} y={6} s={28} className="a3" />
        <Bars x={6} y={72} s={22} n={2} className="a4" />
      </svg>)
  }
}

/** A tiny deterministic hash, so an emblem is the same every time for the same id. */
function hash(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) }
  return h >>> 0
}

/** A small square emblem for the left of a band (stage header, course cover): three shapes picked and placed from the id, in the band's own text
 * colour, so it reads on every strand colour in both modes. Decorative. */
export function ArtEmblem({ seed, className = '' }: { seed: string; className?: string }) {
  const h = hash(seed)
  const pick = (n: number, shift: number) => ((h >>> shift) % n)
  const big = pick(3, 0), mid = pick(4, 3), small = pick(3, 7), q = pick(4, 11) as 0 | 1 | 2 | 3
  return (
    <svg {...svgProps} className={`art art-emblem ${className}`.trim()}>
      {big === 0 ? <Circle x={4} y={4} s={64} className="e1" /> : big === 1 ? <QuarterCircle x={4} y={4} s={72} q={q} className="e1" /> : <Squares x={4} y={4} s={64} className="e1" />}
      {mid === 0 ? <Bars x={58} y={44} s={38} n={3} className="e2" /> : mid === 1 ? <Diagonals x={52} y={44} s={44} n={2} className="e2" /> : mid === 2 ? <Circle x={56} y={56} s={38} className="e2" /> : <QuarterCircle x={52} y={52} s={44} q={((q + 2) % 4) as 0 | 1 | 2 | 3} className="e2" />}
      {small === 0 ? <Circle x={64} y={4} s={26} className="e3" /> : small === 1 ? <Squares x={62} y={4} s={30} className="e3" /> : <Bars x={66} y={4} s={26} n={2} className="e3" />}
    </svg>
  )
}
