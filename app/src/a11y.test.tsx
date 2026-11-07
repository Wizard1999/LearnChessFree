// @vitest-environment jsdom
// Cheap automated accessibility checks: page landmarks and labelled controls in the app shell, and that the places which give feedback keep a live region.
// This is not a compliance audit (see docs/accessibility.md): a real screen-reader session is still needed.
import { describe, expect, it, vi } from 'vitest'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import App from './App'

// The shell is what is under test, not the content download: let the provider pass its children straight through.
vi.mock('./lib/content', async orig => ({ ...(await orig<object>()), ContentProvider: ({ children }: { children: React.ReactNode }) => children, RequireFullContent: ({ children }: { children: React.ReactNode }) => children }))

const src = (f: string) => readFileSync(join(__dirname, f), 'utf8')

describe('app shell', () => {
  it('has a skip link, banner, labelled navigation, one main landmark and a footer', () => {
    const { container } = render(<MemoryRouter initialEntries={['/no-such-page']}><App /></MemoryRouter>)
    expect(container.querySelector('a.skiplink[href="#main"]')).not.toBeNull()
    expect(container.querySelector('header')).not.toBeNull()
    expect(container.querySelector('nav[aria-label="Main"]')).not.toBeNull()
    expect(container.querySelectorAll('main')).toHaveLength(1)
    expect(container.querySelector('footer')).not.toBeNull()
    expect(container.querySelector('h1')).not.toBeNull()
  })
  it('gives every button and link in the shell an accessible name', () => {
    const { container } = render(<MemoryRouter initialEntries={['/no-such-page']}><App /></MemoryRouter>)
    const bad = [...container.querySelectorAll('button, a[href], summary')].filter(e => !(e.textContent?.trim() || e.getAttribute('aria-label') || e.getAttribute('title')))
    expect(bad.map(e => e.outerHTML)).toEqual([])
  })
  it('keeps the credit line in the header', () => {
    const { container } = render(<MemoryRouter initialEntries={['/no-such-page']}><App /></MemoryRouter>)
    expect(container.querySelector('header')?.textContent).toContain('Created by Andrew Valentine')
  })
})

describe('feedback is announced', () => {
  const live = /aria-live|role="status"|role="alert"|role=\{[^}]*(status|alert)/
  it.each([
    ['components/ItemPlayer.tsx', 'answer feedback'],
    ['components/PlayOut.tsx', 'play-out results'],
    ['components/ChessBoard.tsx', 'board move announcements'],
    ['components/SaveNotice.tsx', 'saving notices'],
    ['components/LessonPlayer.tsx', 'lesson feedback'],
    ['pages/Settings.tsx', 'settings notices'],
  ])('%s has a live region (%s)', file => {
    expect(live.test(src(file))).toBe(true)
  })
})
