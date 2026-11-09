// Per-device preferences of the Constellations page (D88). Stored in localStorage; every read and write is guarded, so a blocked or full store never breaks the page.
export const SLICE_KEY = 'cs-map-slices'

/** Slice colours (each subject's wedge tinted in its own hue): off unless the learner turned them on. */
export function readSliceColours(store?: Pick<Storage, 'getItem'>): boolean {
  try { return (store ?? localStorage).getItem(SLICE_KEY) === '1' } catch { return false }
}
export function writeSliceColours(on: boolean, store?: Pick<Storage, 'setItem'>): void {
  try { (store ?? localStorage).setItem(SLICE_KEY, on ? '1' : '0') } catch { /* storage unavailable: the choice lasts for this visit only */ }
}
