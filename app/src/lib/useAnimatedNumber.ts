import { useEffect, useRef, useState } from 'react'

/** Smooth ease-out (fast at first, settling gently). t is clamped to 0..1. */
export const easeOut = (t: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3)
/** The value a fraction t of the way from `from` to `to`, eased. */
export const eased = (from: number, to: number, t: number) => from + (to - from) * easeOut(t)

/** True when the learner asked for less motion (the device setting or the app's own Motion choice). */
export function calmMotion(): boolean {
  try { return (typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches) || document.documentElement.dataset.motion === 'reduce' } catch { return false }
}

/**
 * A number that glides to its target when the target RISES during the visit (about 1.2 s, eased); on the first render it is simply the target (the level
 * shows at once on page load), and a fall or a reduced-motion preference is instant. `bumped` is true for a moment after a rise that was shown without
 * movement, so a static highlight can stand in for the animation.
 */
export function useAnimatedNumber(target: number, ms = 1200): { value: number; bumped: boolean; rising: boolean } {
  const [value, setValue] = useState(target)
  const [bumped, setBumped] = useState(false)
  const [rising, setRising] = useState(false)
  const shown = useRef(target)
  const raf = useRef(0)
  useEffect(() => {
    const from = shown.current
    if (target === from) return
    cancelAnimationFrame(raf.current)
    if (target < from || calmMotion() || typeof requestAnimationFrame !== 'function') {
      shown.current = target; setValue(target)
      if (target > from) { setBumped(true); const t = window.setTimeout(() => setBumped(false), 1000); return () => window.clearTimeout(t) }
      return
    }
    const start = performance.now()
    setRising(true)
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / ms)
      shown.current = eased(from, target, t); setValue(shown.current)
      if (t < 1) raf.current = requestAnimationFrame(step); else { shown.current = target; setValue(target); setRising(false) }
    }
    raf.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf.current)
  }, [target, ms])
  return { value, bumped, rising }
}
