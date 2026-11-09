// Appearance preferences (theme, board colours, text size, motion, look). Stored per device in localStorage (a convenience, never
// required: every read and write is guarded) and applied as data attributes on <html>, which theme.css and styles/palette.css read.
// index.html applies the same attributes before first paint so a chosen theme does not flash.
// theme: 'system' (default) follows the device; 'light' and 'dark' are the learner's choice and always win.
// style: 'friendly' is the default look and sets nothing on <html>; 'collegiate' and 'scholarmate' are opt-in choices. Scholarmate is the
// new six-colour look (styles/palette.css, styles/scholarmate.css); it is never applied to anyone who did not choose it, and saved choices are not migrated.
export type LookStyle = 'friendly' | 'collegiate' | 'scholarmate'
export const LOOK_STYLES: readonly LookStyle[] = ['friendly', 'collegiate', 'scholarmate']
export interface Appearance { theme: 'system' | 'light' | 'dark'; board: 'warm' | 'sage' | 'contrast' | 'scholarmate'; text: 'standard' | 'large' | 'larger'; motion: 'system' | 'reduce'; style: LookStyle }
export const DEFAULT_APPEARANCE: Appearance = { theme: 'system', board: 'warm', text: 'standard', motion: 'system', style: 'friendly' }
const KEY = 'cs-appearance'
const NEUTRAL = new Set(['system', 'standard', 'friendly'])
/** Browser chrome colours (the tab bar on a phone) while the Scholarmate look is active: the deep jade of the header band in both modes. Keep in step with palette.css (--bar). */
export const THEME_COLOR = { light: '#123f42', dark: '#123f42' } as const

/** What the learner's choice of look does to the board: the Scholarmate look brings its own board (ivory and jade) unless a board was chosen on purpose,
 * and leaving the look takes that board away again. Nothing else about the saved choices changes, and nobody is moved to the look. */
export function withLookBoard(before: Appearance, after: Appearance): Appearance {
  if (before.style === after.style) return after
  if (after.style === 'scholarmate' && after.board === 'warm') return { ...after, board: 'scholarmate' }
  if (before.style === 'scholarmate' && after.style !== 'scholarmate' && after.board === 'scholarmate') return { ...after, board: 'warm' }
  return after
}

const oneOf = <T extends string>(v: unknown, allowed: readonly T[], fallback: T): T => (allowed as readonly unknown[]).includes(v) ? (v as T) : fallback

export function loadAppearance(): Appearance {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? '{}') as Partial<Record<string, unknown>> | null
    const r = raw && typeof raw === 'object' ? raw : {}
    return {
      style: oneOf(r.style, LOOK_STYLES, DEFAULT_APPEARANCE.style),
      theme: oneOf(r.theme, ['system', 'light', 'dark'] as const, DEFAULT_APPEARANCE.theme),
      board: oneOf(r.board, ['warm', 'sage', 'contrast', 'scholarmate'] as const, DEFAULT_APPEARANCE.board),
      text: oneOf(r.text, ['standard', 'large', 'larger'] as const, DEFAULT_APPEARANCE.text),
      motion: oneOf(r.motion, ['system', 'reduce'] as const, DEFAULT_APPEARANCE.motion),
    }
  } catch { return DEFAULT_APPEARANCE }
}

/** Which mode is showing now: the learner's choice, or the device's when the choice is "system". */
export function effectiveTheme(a: Pick<Appearance, 'theme'>): 'light' | 'dark' {
  if (a.theme !== 'system') return a.theme
  return typeof matchMedia === 'function' && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function syncThemeColor(a: Appearance) {
  // Only the Scholarmate look sets the browser-bar colour (the other looks keep the static tag in index.html): one tag whose colour follows the mode in use.
  let tag = document.querySelector<HTMLMetaElement>('meta[name="theme-color"][data-live]')
  if (a.style !== 'scholarmate') { tag?.remove(); return }
  if (!tag) { tag = document.createElement('meta'); tag.name = 'theme-color'; tag.setAttribute('data-live', ''); document.head.appendChild(tag) }
  tag.content = THEME_COLOR[effectiveTheme(a)]
}

let watching = false
export function applyAppearance(a: Appearance) {
  const root = document.documentElement
  for (const k of ['theme', 'board', 'text', 'motion', 'style'] as const) {
    if (NEUTRAL.has(a[k])) root.removeAttribute(`data-${k}`)
    else root.setAttribute(`data-${k}`, a[k])
  }
  syncThemeColor(a)
  if (!watching && typeof matchMedia === 'function') {
    watching = true
    try { matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => syncThemeColor(loadAppearance())) } catch { /* old browser: the colour is set at load */ }
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
