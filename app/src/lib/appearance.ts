// Appearance preferences (theme, board colours, text size, motion, look). Stored per device in localStorage (a convenience, never
// required: every read and write is guarded) and applied as data attributes on <html>, which theme.css and styles/palette.css read.
// index.html applies the same attributes before first paint so a chosen theme does not flash.
// theme: 'system' (default) follows the device; 'light' and 'dark' are the learner's choice and always win.
// style: 'atlas' is the default look (moss, crimson, gold, umber, navy and ivory: styles/atlas.css, decision D67). Every look that was ever offered stays
// selectable: 'friendly' and 'collegiate' (theme.css), and 'scholarmate' (the jade-and-cobalt look, styles/palette.css). Saved choices are kept as saved;
// only a device that never chose gets Atlas. 'atlas' and 'scholarmate' share their layout rules (styles/scholarmate.css) and differ in tokens and board.
export type LookStyle = 'atlas' | 'friendly' | 'collegiate' | 'scholarmate'
export const LOOK_STYLES: readonly LookStyle[] = ['atlas', 'friendly', 'collegiate', 'scholarmate']
export type BoardChoice = 'warm' | 'sage' | 'contrast' | 'scholarmate' | 'atlas'
export const BOARD_CHOICES: readonly BoardChoice[] = ['warm', 'sage', 'contrast', 'scholarmate', 'atlas']
export interface Appearance { theme: 'system' | 'light' | 'dark'; board: BoardChoice; text: 'standard' | 'large' | 'larger'; motion: 'system' | 'reduce'; style: LookStyle }
export const DEFAULT_APPEARANCE: Appearance = { theme: 'system', board: 'atlas', text: 'standard', motion: 'system', style: 'atlas' }
const KEY = 'cs-appearance'
const NEUTRAL = new Set(['system', 'standard'])
/** Browser chrome colours (the tab bar on a phone) for the looks that colour it: the header band, the same in both modes. Keep in step with the --bar tokens (palette.css, atlas.css). */
export const THEME_COLOR: Record<'atlas' | 'scholarmate', string> = { atlas: '#223b26', scholarmate: '#123f42' }

/** The board a look brings with it (the others use the shared boards). */
const LOOK_BOARD: Partial<Record<LookStyle, BoardChoice>> = { scholarmate: 'scholarmate', atlas: 'atlas' }

/** What the learner's choice of look does to the board: Atlas and Scholarmate each bring their own board unless a board was chosen on purpose, and leaving a
 * look takes its board away again (back to Warm, or over to the next look's own board). Nothing else about the saved choices changes. */
export function withLookBoard(before: Appearance, after: Appearance): Appearance {
  if (before.style === after.style) return after
  const own = LOOK_BOARD[after.style], carried = LOOK_BOARD[before.style]
  if (after.board === 'warm' && own) return { ...after, board: own }
  if (carried && after.board === carried) return { ...after, board: own ?? 'warm' }
  return after
}

const oneOf = <T extends string>(v: unknown, allowed: readonly T[], fallback: T): T => (allowed as readonly unknown[]).includes(v) ? (v as T) : fallback

export function loadAppearance(): Appearance {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? '{}') as Partial<Record<string, unknown>> | null
    const r = raw && typeof raw === 'object' ? raw : {}
    const style = oneOf(r.style, LOOK_STYLES, DEFAULT_APPEARANCE.style)
    return {
      style,
      theme: oneOf(r.theme, ['system', 'light', 'dark'] as const, DEFAULT_APPEARANCE.theme),
      board: oneOf(r.board, BOARD_CHOICES, LOOK_BOARD[style] ?? 'warm'),
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
  // Only Atlas and Scholarmate set the browser-bar colour (the other looks keep the static tag in index.html): one tag whose colour follows the mode in use.
  let tag = document.querySelector<HTMLMetaElement>('meta[name="theme-color"][data-live]')
  if (a.style !== 'atlas' && a.style !== 'scholarmate') { tag?.remove(); return }
  if (!tag) { tag = document.createElement('meta'); tag.name = 'theme-color'; tag.setAttribute('data-live', ''); document.head.appendChild(tag) }
  tag.content = THEME_COLOR[a.style]
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
