// Appearance preferences (theme, board colours, text size, motion). Stored per device in localStorage (a convenience, never
// required: every read and write is guarded) and applied as data attributes on <html>, which theme.css reads.
// index.html applies the same attributes before first paint so a chosen theme does not flash.
export interface Appearance { theme: 'system' | 'light' | 'dark'; board: 'warm' | 'sage' | 'contrast'; text: 'standard' | 'large' | 'larger'; motion: 'system' | 'reduce' }
export const DEFAULT_APPEARANCE: Appearance = { theme: 'system', board: 'warm', text: 'standard', motion: 'system' }
const KEY = 'cs-appearance'
const NEUTRAL = new Set(['system', 'standard'])

export function loadAppearance(): Appearance {
  try { return { ...DEFAULT_APPEARANCE, ...(JSON.parse(localStorage.getItem(KEY) ?? '{}') as Partial<Appearance>) } } catch { return DEFAULT_APPEARANCE }
}

export function applyAppearance(a: Appearance) {
  const root = document.documentElement
  for (const k of ['theme', 'board', 'text', 'motion'] as const) {
    if (NEUTRAL.has(a[k])) root.removeAttribute(`data-${k}`)
    else root.setAttribute(`data-${k}`, a[k])
  }
}

export function saveAppearance(a: Appearance) {
  applyAppearance(a)
  try { localStorage.setItem(KEY, JSON.stringify(a)) } catch { /* private window or blocked storage: the choice lasts for this visit */ }
}

/** True when the learner or the system asks for less motion (used to turn off piece animation). */
export function prefersReducedMotion(): boolean {
  if (typeof document !== 'undefined' && document.documentElement.getAttribute('data-motion') === 'reduce') return true
  return typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches
}
