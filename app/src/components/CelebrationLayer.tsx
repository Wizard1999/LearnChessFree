import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { subscribeCelebrations, type Celebration } from '../lib/celebrate'
import { CrestGlow, GlassFill, StarGlow } from './Celebrate'
import { Button } from './Button'

const TOAST_MS = 7000
const MAX_QUEUE = 4

/**
 * Shows celebrations one at a time in a small card fixed near the bottom of the screen. It never covers the controls it is celebrating for long, never moves
 * the page, and the page stays fully usable: the layer itself ignores the pointer, only the card takes clicks. A toast fades by itself (paused while it is
 * hovered or focused); a milestone card waits to be dismissed. The words carry the meaning; the animation is a reinforcement and is off with reduced motion.
 */
export function CelebrationLayer() {
  const [queue, setQueue] = useState<Celebration[]>([])
  const [paused, setPaused] = useState(false)
  const current = queue[0]
  useEffect(() => subscribeCelebrations(c => setQueue(q => (q.length >= MAX_QUEUE ? q : [...q, c]))), [])
  const dismiss = useCallback(() => setQueue(q => q.slice(1)), [])
  const timer = useRef<number | undefined>(undefined)
  useEffect(() => {
    window.clearTimeout(timer.current)
    if (!current || current.sticky || paused) return
    timer.current = window.setTimeout(dismiss, TOAST_MS)
    return () => window.clearTimeout(timer.current)
  }, [current, paused, dismiss])
  useEffect(() => {
    if (!current) return
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') dismiss() }
    document.addEventListener('keydown', k)
    return () => document.removeEventListener('keydown', k)
  }, [current, dismiss])
  if (!current) return null
  const c = current
  return (
    <div className="celebrations">
      <section key={c.id} className={`celebration${c.sticky ? ' sticky' : ''} art-${c.art}`} role="status" aria-label={c.sticky ? 'A milestone' : 'Progress'}
        onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
        <div className="celebart">
          {c.art === 'crest' ? <CrestGlow /> : c.art === 'star' ? <StarGlow /> : <GlassFill from={c.fromLevel} to={c.toLevel} />}
        </div>
        <div className="celebtext">
          <h2>{c.title}</h2>
          <p>{c.body}</p>
          {c.next && <p className="celebnext">Next up: <Link to={c.next.to} onClick={dismiss}>{c.next.label}</Link></p>}
        </div>
        <Button variant="quiet" className="celebclose" onClick={dismiss} aria-label={`Dismiss: ${c.title}`}>{c.sticky ? 'Got it' : 'Close'}</Button>
      </section>
    </div>
  )
}
