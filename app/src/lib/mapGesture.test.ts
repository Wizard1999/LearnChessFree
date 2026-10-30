import { describe, expect, it } from 'vitest'
import { isDoubleTap, pinchGeometry, screenToWorld, viewForPinch, zoomAt } from './mapGesture'

const R = 500
const box = { left: 10, top: 20, width: 400, height: 400 }
const near = (a: number, b: number) => expect(a).toBeCloseTo(b, 6)

describe('pinchGeometry', () => {
  it('gives distance and midpoint', () => {
    expect(pinchGeometry({ x: 0, y: 0 }, { x: 6, y: 8 })).toEqual({ dist: 10, cx: 3, cy: 4 })
  })
})

describe('screenToWorld', () => {
  it('maps the box centre to the camera centre', () => {
    const w = screenToWorld({ x: -30, y: 40, k: 2 }, R, box, 210, 220)
    near(w.x, 30); near(w.y, -40)
  })
  it('centres the square when the box is wider than tall', () => {
    const wide = { left: 0, top: 0, width: 800, height: 400 }
    const w = screenToWorld({ x: 0, y: 0, k: 1 }, R, wide, 400, 200)
    near(w.x, 0); near(w.y, 0)
  })
})

describe('viewForPinch', () => {
  const cam = { x: 10, y: -20, k: 1.5 }
  it('keeps the held point under the fingers while zooming and panning', () => {
    const from = pinchGeometry({ x: 150, y: 200 }, { x: 250, y: 200 })
    const now = pinchGeometry({ x: 100, y: 180 }, { x: 300, y: 260 })
    const held = screenToWorld(cam, R, box, from.cx, from.cy)
    const next = viewForPinch(cam, from, now, R, box)
    const after = screenToWorld(next, R, box, now.cx, now.cy)
    near(after.x, held.x); near(after.y, held.y)
    expect(next.k).toBeGreaterThan(cam.k)
  })
  it('scales with the finger distance', () => {
    const from = { dist: 100, cx: 200, cy: 200 }
    near(viewForPinch(cam, from, { ...from, dist: 200 }, R, box).k, 3)
    near(viewForPinch(cam, from, { ...from, dist: 50 }, R, box).k, 0.75)
  })
  it('does not move when the fingers do not move', () => {
    const g = { dist: 120, cx: 210, cy: 220 }
    const n = viewForPinch(cam, g, g, R, box)
    near(n.x, cam.x); near(n.y, cam.y); near(n.k, cam.k)
  })
  it('clamps the zoom and ignores a zero start distance', () => {
    const from = { dist: 10, cx: 200, cy: 200 }
    expect(viewForPinch(cam, from, { ...from, dist: 1000 }, R, box).k).toBe(6)
    expect(viewForPinch(cam, from, { ...from, dist: 0.1 }, R, box).k).toBe(0.25)
    expect(viewForPinch(cam, { ...from, dist: 0 }, from, R, box)).toEqual(cam)
  })
})

describe('zoomAt', () => {
  it('keeps the tapped point fixed', () => {
    const cam = { x: 0, y: 0, k: 1 }
    const before = screenToWorld(cam, R, box, 300, 100)
    const next = zoomAt(cam, 2, R, box, 300, 100)
    const after = screenToWorld(next, R, box, 300, 100)
    near(after.x, before.x); near(after.y, before.y); near(next.k, 2)
  })
  it('stops at the limit', () => {
    expect(zoomAt({ x: 0, y: 0, k: 5 }, 2, R, box, 100, 100).k).toBe(6)
  })
})

describe('isDoubleTap', () => {
  const a = { t: 1000, x: 50, y: 50 }
  it('accepts a quick nearby second tap', () => expect(isDoubleTap(a, { t: 1200, x: 58, y: 52 })).toBe(true))
  it('rejects slow or distant taps and a missing first tap', () => {
    expect(isDoubleTap(a, { t: 1600, x: 50, y: 50 })).toBe(false)
    expect(isDoubleTap(a, { t: 1100, x: 150, y: 50 })).toBe(false)
    expect(isDoubleTap(null, a)).toBe(false)
  })
})
