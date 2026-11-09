import type { Level } from '../lib/missions'
import { useAnimatedNumber } from '../lib/useAnimatedNumber'

/** Fill height of each level (the water-fill blocks): not started empty, mastered full. */
export const FILL = [0, 25, 50, 75, 100]

export function Swatch({ level }: { level: Level }) {
  return <span className={`blk swatch lv${level}`} style={{ ['--fill' as string]: `${FILL[level]}%` }} aria-hidden="true" />
}

/** The progress ring. When progress rises during the visit the arc glides to the new value (instant with reduced motion, with a brief ring of light instead); at 100 percent it closes with a soft glow and a gold star. The label always carries the exact figure. */
export function Donut({ percent, assumed = percent, label = 'progress', size = 120 }: { percent: number; assumed?: number; label?: string; size?: number }) {
  const r = 46, c = 2 * Math.PI * r
  const { value, bumped, rising } = useAnimatedNumber(percent)
  const shown = Math.round(value)
  const full = percent >= 100
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} role="img" aria-label={`${percent} percent ${label}${assumed > percent ? `, ${assumed} percent if the skills you assumed are confirmed` : ''}`} className={`donut${bumped ? ' bumped' : ''}${rising ? ' rising' : ''}${full ? ' full' : ''}`}>
      <circle cx="60" cy="60" r={r} fill="none" stroke="var(--chip)" strokeWidth="12" />
      {assumed > percent && <circle cx="60" cy="60" r={r} fill="none" stroke="var(--accent)" strokeOpacity="0.35" strokeWidth="12" strokeLinecap="butt" strokeDasharray={`${(c * assumed) / 100} ${c}`} transform="rotate(-90 60 60)" />}
      <circle className="donutarc" cx="60" cy="60" r={r} fill="none" stroke="var(--accent)" strokeWidth="12" strokeLinecap="butt" strokeDasharray={`${(c * value) / 100} ${c}`} transform="rotate(-90 60 60)" />
      <text x="60" y="58" textAnchor="middle" fontSize="26" fontWeight="700" fill="var(--text)">{shown}%</text>
      <text x="60" y="76" textAnchor="middle" fontSize="11" fill="var(--text-secondary)">{label}</text>
      {full && <path className="donutstar" d="M60 84l2.6 5.6 6.1.7-4.5 4.1 1.2 6L60 97.4l-5.4 3 1.2-6-4.5-4.1 6.1-.7z" />}
    </svg>
  )
}
