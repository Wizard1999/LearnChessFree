import type { Level } from '../lib/missions'

/** Fill height of each level (the water-fill blocks): not started empty, mastered full. */
export const FILL = [0, 25, 50, 75, 100]

export function Swatch({ level }: { level: Level }) {
  return <span className={`blk swatch lv${level}`} style={{ ['--fill' as string]: `${FILL[level]}%` }} aria-hidden="true" />
}

export function Donut({ percent, assumed = percent, label = 'progress', size = 120 }: { percent: number; assumed?: number; label?: string; size?: number }) {
  const r = 46, c = 2 * Math.PI * r
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} role="img" aria-label={`${percent} percent ${label}${assumed > percent ? `, ${assumed} percent if the skills you assumed are confirmed` : ''}`} className="donut">
      <circle cx="60" cy="60" r={r} fill="none" stroke="var(--chip)" strokeWidth="12" />
      {assumed > percent && <circle cx="60" cy="60" r={r} fill="none" stroke="var(--accent)" strokeOpacity="0.35" strokeWidth="12" strokeLinecap="butt" strokeDasharray={`${(c * assumed) / 100} ${c}`} transform="rotate(-90 60 60)" />}
      <circle cx="60" cy="60" r={r} fill="none" stroke="var(--accent)" strokeWidth="12" strokeLinecap="butt" strokeDasharray={`${(c * percent) / 100} ${c}`} transform="rotate(-90 60 60)" />
      <text x="60" y="58" textAnchor="middle" fontSize="26" fontWeight="700" fill="var(--text)">{percent}%</text>
      <text x="60" y="76" textAnchor="middle" fontSize="11" fill="var(--text-secondary)">{label}</text>
    </svg>
  )
}
