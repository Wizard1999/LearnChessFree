// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { CelebrationLayer } from './CelebrationLayer'
import { Donut } from './MissionParts'
import { GlassFill, GLASS_FILL } from './Celebrate'
import { celebrate } from '../lib/celebrate'
import { saveSoundPrefs } from '../lib/sound'

afterEach(() => { cleanup(); vi.unstubAllGlobals(); vi.useRealTimers(); document.documentElement.removeAttribute('data-motion') })
const base = { art: 'glass' as const, fromLevel: 1 as const, toLevel: 3 as const, body: 'It says what it means.', next: undefined }

describe('CelebrationLayer', () => {
  it('shows a card in words, even with sound off, and a toast fades by itself', () => {
    saveSoundPrefs({ on: false })
    vi.useFakeTimers()
    render(<MemoryRouter><CelebrationLayer /></MemoryRouter>)
    expect(document.querySelector('.celebration')).toBeNull()
    act(() => celebrate({ ...base, title: 'Forks: now Independent', sticky: false }))
    expect(screen.getByRole('status').textContent).toContain('Forks: now Independent')
    expect(document.querySelector('svg.glassfill')).not.toBeNull()
    act(() => { vi.advanceTimersByTime(7100) })
    expect(document.querySelector('.celebration')).toBeNull()
    saveSoundPrefs({ on: true })
  })
  it('a milestone card waits to be dismissed, offers the next lesson, and Escape or the button closes it', () => {
    vi.useFakeTimers()
    render(<MemoryRouter><CelebrationLayer /></MemoryRouter>)
    act(() => celebrate({ ...base, art: 'crest', title: 'Stage 1: every lesson finished', sticky: true, next: { to: '/lesson/L-X', label: 'Castling' } }))
    act(() => { vi.advanceTimersByTime(60000) })
    expect(screen.getByText('Stage 1: every lesson finished')).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Castling' }).getAttribute('href')).toBe('/lesson/L-X')
    fireEvent.click(screen.getByRole('button', { name: /dismiss/i }))
    expect(document.querySelector('.celebration')).toBeNull()
    act(() => celebrate({ ...base, title: 'Second', sticky: true }))
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(document.querySelector('.celebration')).toBeNull()
  })
  it('queues celebrations one at a time and never takes the page: the layer ignores the pointer (class only the card takes clicks)', () => {
    render(<MemoryRouter><CelebrationLayer /></MemoryRouter>)
    act(() => { celebrate({ ...base, title: 'One', sticky: true }); celebrate({ ...base, title: 'Two', sticky: true }) })
    expect(document.querySelectorAll('.celebration')).toHaveLength(1)
    fireEvent.click(screen.getByRole('button', { name: /dismiss/i }))
    expect(screen.getByText('Two')).toBeTruthy()
    expect(document.querySelector('.celebrations')).not.toBeNull()
  })
})

describe('GlassFill', () => {
  it('rests at the new level (so reduced motion shows the result) and is hidden from assistive tech', () => {
    const { container } = render(<GlassFill from={0} to={3} />)
    const svg = container.querySelector('svg')!
    expect(svg.getAttribute('aria-hidden')).toBe('true')
    expect(svg.style.getPropertyValue('--to')).toBe(`${(1 - GLASS_FILL[3]) * 42}px`)
    expect(svg.style.getPropertyValue('--from')).toBe('42px')
    expect([0, 1, 2, 3, 4].map(l => GLASS_FILL[l as 0])).toEqual([0, 0.25, 0.5, 0.75, 1])
  })
})

describe('the progress ring', () => {
  const dash = (c: HTMLElement) => Number((c.querySelector('.donutarc') as SVGElement).getAttribute('stroke-dasharray')!.split(' ')[0])
  const C = 2 * Math.PI * 46
  beforeEach(() => { document.documentElement.removeAttribute('data-motion') })
  it('shows the level at once on load, with the figure in its name', () => {
    const { container } = render(<Donut percent={7} label="overall" />)
    expect(dash(container)).toBeCloseTo((C * 7) / 100, 3)
    expect(container.querySelector('svg')!.getAttribute('aria-label')).toBe('7 percent overall')
    expect(container.textContent).toContain('7%')
    expect(container.querySelector('.donutstar')).toBeNull()
  })
  it('with reduced motion a rise is instant, with a brief highlight instead', () => {
    document.documentElement.dataset.motion = 'reduce'
    vi.useFakeTimers()
    const { container, rerender } = render(<Donut percent={7} />)
    rerender(<Donut percent={50} />)
    expect(dash(container)).toBeCloseTo((C * 50) / 100, 3)
    expect(container.querySelector('svg')!.getAttribute('class')).toContain('bumped')
    act(() => { vi.advanceTimersByTime(1100) })
    expect(container.querySelector('svg')!.getAttribute('class')).not.toContain('bumped')
  })
  it('without it the arc glides up to the new value over about a second, then rests there', () => {
    let now = 0
    const frames: FrameRequestCallback[] = []
    vi.stubGlobal('requestAnimationFrame', (f: FrameRequestCallback) => { frames.push(f); return frames.length })
    vi.stubGlobal('cancelAnimationFrame', () => undefined)
    vi.spyOn(performance, 'now').mockImplementation(() => now)
    vi.stubGlobal('matchMedia', () => ({ matches: false }))
    const { container, rerender } = render(<Donut percent={7} />)
    rerender(<Donut percent={50} />)
    expect(dash(container)).toBeCloseTo((C * 7) / 100, 3) // starts at the old value
    now = 300; act(() => { frames.splice(0).forEach(f => f(now)) })
    const mid = dash(container)
    expect(mid).toBeGreaterThan((C * 7) / 100); expect(mid).toBeLessThan((C * 50) / 100)
    now = 1300; act(() => { frames.splice(0).forEach(f => f(now)) })
    expect(dash(container)).toBeCloseTo((C * 50) / 100, 3)
    expect(container.textContent).toContain('50%')
  })
  it('a fall is instant, and at 100 percent the ring closes with a star and still says the figure', () => {
    const { container, rerender } = render(<Donut percent={40} />)
    rerender(<Donut percent={30} />)
    expect(dash(container)).toBeCloseTo((C * 30) / 100, 3)
    rerender(<Donut percent={100} />)
    expect(container.querySelector('svg')!.getAttribute('aria-label')).toBe('100 percent progress')
    expect(container.querySelector('.donutstar')).not.toBeNull()
  })
})
