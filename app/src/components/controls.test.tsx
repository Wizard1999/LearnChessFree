// @vitest-environment jsdom
// The controls system (docs/design-controls.md): icon buttons carry an aria-label, their tooltip is reachable from the keyboard, Escape closes it.
import { afterEach, describe, expect, it } from 'vitest'
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Button, IconButton, LinkButton } from './Button'
import { ICONS, Icon } from './Icon'

afterEach(cleanup)
const tip = (c: HTMLElement) => c.querySelector('.tip') as HTMLElement

describe('IconButton', () => {
  it('has an accessible name, a decorative icon and a hidden tooltip with the shortcut', () => {
    const { container } = render(<IconButton icon="flip" label="Flip the board" shortcut="F" />)
    const b = screen.getByRole('button', { name: 'Flip the board' })
    expect(b.getAttribute('aria-keyshortcuts')).toBe('F')
    expect(b.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true')
    expect(tip(container).textContent).toContain('Flip the board')
    expect(tip(container).textContent).toContain('F')
    expect(tip(container).classList.contains('tip-on')).toBe(false)
  })
  it('shows the tooltip on keyboard focus and closes it on Escape', () => {
    const { container } = render(<IconButton icon="next" label="Next move" />)
    act(() => { screen.getByRole('button', { name: 'Next move' }).focus() })
    expect(tip(container).classList.contains('tip-on')).toBe(true)
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(tip(container).classList.contains('tip-on')).toBe(false)
  })
  it('shows the tooltip after a hover delay, not at once', async () => {
    const { container } = render(<IconButton icon="close" label="Close" />)
    fireEvent.mouseEnter(container.querySelector('.tipwrap')!)
    expect(tip(container).classList.contains('tip-on')).toBe(false)
    await act(async () => { await new Promise(r => setTimeout(r, 450)) })
    expect(tip(container).classList.contains('tip-on')).toBe(true)
    fireEvent.mouseLeave(container.querySelector('.tipwrap')!)
    expect(tip(container).classList.contains('tip-on')).toBe(false)
  })
  it('reports the pressed state', () => {
    render(<IconButton icon="engine" label="Engine" pressed />)
    expect(screen.getByRole('button', { name: 'Engine' }).getAttribute('aria-pressed')).toBe('true')
  })
})

describe('Button and LinkButton', () => {
  it('keeps words as the name, adds a tooltip only when asked, and marks danger and pressed', () => {
    const { container } = render(<MemoryRouter><Button variant="danger" tip="Erase it">Start over</Button><Button aria-pressed>Engine</Button><LinkButton to="/course">Curriculum</LinkButton></MemoryRouter>)
    expect(screen.getByRole('button', { name: 'Start over' }).classList.contains('btn-danger')).toBe(true)
    expect(container.querySelectorAll('.tip')).toHaveLength(1)
    expect(screen.getByRole('button', { name: 'Engine' }).classList.contains('is-on')).toBe(true)
    expect(screen.getByRole('link', { name: 'Curriculum' }).getAttribute('href')).toBe('/course')
  })
})

describe('Icon set', () => {
  it('draws every glyph on the 24px grid in currentColor', () => {
    for (const name of Object.keys(ICONS) as (keyof typeof ICONS)[]) {
      const { container, unmount } = render(<Icon name={name} />)
      const svg = container.querySelector('svg')!
      expect(svg.getAttribute('viewBox')).toBe('0 0 24 24')
      expect(svg.getAttribute('stroke')).toBe('currentColor')
      expect(svg.querySelectorAll('path').length).toBeGreaterThan(0)
      unmount()
    }
  })
})
