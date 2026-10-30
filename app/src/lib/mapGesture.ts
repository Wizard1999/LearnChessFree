/** Pure geometry for touch gestures on the curriculum map. The camera is {x, y, k}: the viewBox is a square of side 2R/k centred on (-x, -y). */
export interface Cam { x: number; y: number; k: number }
export interface Pt { x: number; y: number }
export interface Box { left: number; top: number; width: number; height: number }
export interface Pinch { dist: number; cx: number; cy: number }

export const K_MIN = 0.25
export const K_MAX = 6

/** Distance and midpoint of two touch points. */
export function pinchGeometry(a: Pt, b: Pt): Pinch {
  return { dist: Math.hypot(a.x - b.x, a.y - b.y), cx: (a.x + b.x) / 2, cy: (a.y + b.y) / 2 }
}

/** Where a screen point lies on the map (the svg keeps its square viewBox centred, "meet" style). */
export function screenToWorld(cam: Cam, R: number, box: Box, px: number, py: number): Pt {
  const side = Math.min(box.width, box.height) || 1, span = (2 * R) / cam.k
  const u = (px - box.left - (box.width - side) / 2) / side, v = (py - box.top - (box.height - side) / 2) / side
  return { x: -R / cam.k - cam.x + u * span, y: -R / cam.k - cam.y + v * span }
}

const clampK = (k: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, k))

/** The camera that keeps world point `w` under screen point (px, py) at zoom `k`. */
function camHolding(w: Pt, k: number, R: number, box: Box, px: number, py: number): Cam {
  const side = Math.min(box.width, box.height) || 1, span = (2 * R) / k
  const u = (px - box.left - (box.width - side) / 2) / side, v = (py - box.top - (box.height - side) / 2) / side
  return { x: -R / k + u * span - w.x, y: -R / k + v * span - w.y, k }
}

/** Two fingers: the zoom follows the change in finger distance and the map follows the midpoint, so the point first held stays under the fingers. */
export function viewForPinch(start: Cam, from: Pinch, now: Pinch, R: number, box: Box, lo = K_MIN, hi = K_MAX): Cam {
  if (!(from.dist > 0) || !Number.isFinite(now.dist)) return start
  const k = clampK(start.k * (now.dist / from.dist), lo, hi)
  return camHolding(screenToWorld(start, R, box, from.cx, from.cy), k, R, box, now.cx, now.cy)
}

/** Zoom by a factor about a screen point (double tap, double click): that point stays where it is. */
export function zoomAt(cam: Cam, factor: number, R: number, box: Box, px: number, py: number, lo = K_MIN, hi = K_MAX): Cam {
  const k = clampK(cam.k * factor, lo, hi)
  return camHolding(screenToWorld(cam, R, box, px, py), k, R, box, px, py)
}

/** A second tap counts as a double tap when it is soon enough and close enough to the first. */
export function isDoubleTap(prev: { t: number; x: number; y: number } | null, now: { t: number; x: number; y: number }, maxMs = 320, maxPx = 32): boolean {
  return !!prev && now.t - prev.t <= maxMs && Math.hypot(now.x - prev.x, now.y - prev.y) <= maxPx
}

/** Finger movement beyond this many pixels is a drag, not a tap. */
export const TAP_SLOP = 8
