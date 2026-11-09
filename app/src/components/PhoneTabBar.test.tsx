// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { PhoneTabBar } from './PhoneTabBar'
import { PhoneFold } from './Sheet'
import { useState } from 'react'

function phone(on: boolean) {
  vi.stubGlobal('matchMedia', (q: string) => ({ matches: on, media: q, addEventListener() {}, removeEventListener() {} }))
  window.matchMedia = globalThis.matchMedia
}
afterEach(() => { cleanup(); vi.unstubAllGlobals() })

describe('phone tab bar', () => {
  it('renders nothing on a wide screen (the desktop navigation is unchanged)', () => {
    phone(false)
    const { container } = render(<MemoryRouter initialEntries={['/']}><PhoneTabBar /></MemoryRouter>)
    expect(container.querySelector('.tabbar')).toBeNull()
  })
  it('shows four tabs on a phone, lights the current one, and opens More as a sheet', () => {
    phone(true)
    render(<MemoryRouter initialEntries={['/course?win=progress']}><PhoneTabBar /></MemoryRouter>)
    const nav = screen.getByRole('navigation', { name: 'Main' })
    expect(nav.querySelectorAll('.tab')).toHaveLength(4)
    expect(nav.querySelector('.tab.on')?.textContent).toBe('Progress')
    fireEvent.click(screen.getByRole('button', { name: 'More' }))
    const dlg = screen.getByRole('dialog', { name: 'More' })
    expect(dlg.textContent).toContain('Library')
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).toBeNull()
  })
  it('steps aside inside a lesson', () => {
    phone(true)
    const { container } = render(<MemoryRouter initialEntries={['/lesson/L-FND-BOARD-1']}><PhoneTabBar /></MemoryRouter>)
    expect(container.querySelector('.tabbar')).toBeNull()
  })
})

describe('PhoneFold', () => {
  function Fold() { const [o, setO] = useState(false); return <PhoneFold summary="How this was checked" open={o} onToggle={setO}><p>details</p></PhoneFold> }
  it('is a plain details fold on a wide screen', () => {
    phone(false)
    const { container } = render(<Fold />)
    expect(container.querySelector('details > summary')?.textContent).toBe('How this was checked')
  })
  it('is a button that opens a bottom sheet on a phone', () => {
    phone(true)
    render(<Fold />)
    expect(screen.queryByText('details')).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'How this was checked' }))
    expect(screen.getByRole('dialog', { name: 'How this was checked' }).textContent).toContain('details')
    fireEvent.click(screen.getByRole('button', { name: 'Close how this was checked' }))
    expect(screen.queryByRole('dialog')).toBeNull()
  })
})
