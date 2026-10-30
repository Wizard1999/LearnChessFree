import type { NodeProgress } from './missions'

/** A short mark and a plain word for a skill's state, used in the map's skill list (the mark is decoration, the word is for screen readers). */
export function skillState(p: Pick<NodeProgress, 'level' | 'lessonDone'> | undefined): { mark: string; word: string } {
  if (!p) return { mark: '○', word: 'not started' }
  if (p.level >= 4) return { mark: '★', word: 'mastered' }
  if (p.lessonDone) return { mark: '✓', word: 'lesson finished' }
  if (p.level > 0) return { mark: '●', word: 'started' }
  return { mark: '○', word: 'not started' }
}

interface Box { top: number; bottom: number; left: number; right: number; width: number; height: number }

/** When a bottom sheet (a panel as wide as the map) covers the lower part of the map: how many screen pixels the picked skill should move
 * so that it sits in the middle of the part that stays visible. Negative means up the screen. Zero when there is no sheet or only a side panel. */
export function sheetOffset(map: Box, sheet: Box | null): number {
  if (!sheet || sheet.width < map.width * 0.8 || sheet.top >= map.bottom || sheet.top <= map.top) return 0
  const visibleBottom = sheet.top
  return (map.top + visibleBottom) / 2 - (map.top + map.bottom) / 2
}

/** The tallest the skill list may be, in pixels, so that it ends above an open bottom sheet instead of running under it. Null when there is no sheet. */
export function listMaxHeight(listTop: number, sheetTop: number | null, minimum = 160): number | null {
  if (sheetTop === null) return null
  return Math.max(minimum, Math.floor(sheetTop - listTop - 8))
}
