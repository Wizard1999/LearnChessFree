// @vitest-environment jsdom
// The controls system (docs/design-controls.md): icon buttons carry an aria-label, their tooltip is reachable from the keyboard, Escape closes it.
import { afterEach, describe, expect, it } from 'vitest'
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Button, IconButton, LinkButton } from './Button'
import { ICONS, Icon } from './Icon'

afterEach(cleanup)
// the tip is drawn in a portal on the body, only while shown, so no card or header can clip it
const tip = () => document.querySelector('.tip') as HTMLElement | null

describe('IconButton', () => {
  it('has an accessible name, a decorative icon and a hidden tooltip with the shortcut', () => {
    const { container } = render(<IconButton icon="flip" label="Flip the board" shortcut="F" />)
    const b = screen.getByRole('button', { name: 'Flip the board' })
    expect(b.getAttribute('aria-keyshortcuts')).toBe('F')
    expect(b.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true')
    expect(container.querySelector('.tip')).toBeNull() // nothing is rendered until the tip is shown
    act(() => { b.focus() })
    expect(tip()!.textContent).toContain('Flip the board')
    expect(tip()!.textContent).toContain('F')
    expect(tip()!.getAttribute('aria-hidden')).toBe('true')
    expect(container.contains(tip()!)).toBe(false) // drawn in a portal on the body: no card or sticky header can clip or cover it
  })
  it('shows the tooltip on keyboard focus and closes it on Escape', () => {
    render(<IconButton icon="next" label="Next move" />)
    act(() => { screen.getByRole('button', { name: 'Next move' }).focus() })
    expect(tip()!.classList.contains('tip-on')).toBe(true)
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(tip()).toBeNull()
  })
  it('shows the tooltip after a hover delay, not at once', async () => {
    const { container } = render(<IconButton icon="close" label="Close" />)
    fireEvent.mouseEnter(container.querySelector('.tipwrap')!)
    expect(tip()).toBeNull()
    await act(async () => { await new Promise(r => setTimeout(r, 450)) })
    expect(tip()!.classList.contains('tip-on')).toBe(true)
    fireEvent.mouseLeave(container.querySelector('.tipwrap')!)
    expect(tip()).toBeNull()
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
    expect(container.querySelectorAll('.tipwrap')).toHaveLength(1)
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
