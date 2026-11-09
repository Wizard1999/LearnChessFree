// @vitest-environment jsdom
// The restructured top bar (D63-D65): masthead and byline on the left, one More button, no tab row; Back to Curriculum on other pages.
import 'fake-indexeddb/auto'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { act, cleanup, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from './App'
import { BRAND } from './brand'

afterEach(() => { cleanup(); vi.unstubAllGlobals() })

const PUBLIC = join(__dirname, '..', 'public')
async function open(route: string) {
  vi.stubGlobal('fetch', async (url: string | URL) => {
    const path = String(url).split('?')[0].replace(/^https?:\/\/[^/]+/, '').replace(/^\.?\/?(Scholarmate\/)?/, '')
    try { return new Response(readFileSync(join(PUBLIC, path)), { status: 200, headers: { 'Content-Type': path.endsWith('.json') ? 'application/json' : 'text/plain' } }) } catch { return new Response('not found', { status: 404 }) }
  })
  vi.stubGlobal('ResizeObserver', class { observe() {} unobserve() {} disconnect() {} })
  vi.stubGlobal('Worker', class { postMessage() {} terminate() {} onmessage = null })
  ;(window as unknown as { scrollTo: () => void }).scrollTo = () => undefined
  const r = render(<MemoryRouter initialEntries={[route]}><App /></MemoryRouter>)
  await act(async () => { await new Promise(res => setTimeout(res, 1500)) })
  return r
}

describe('top bar (D72)', () => {
  it('keeps the credit, splits the Curriculum places at a centre divider, and has no Back bar, Continue strip or Next button', async () => {
    const { container } = await open('/roadmap')
    expect(container.querySelector('header.top .byline')?.textContent).toBe(BRAND.byline)
    const nav = container.querySelector('header.top nav')!
    expect([...nav.querySelectorAll('.navleft > a')].map(a => a.textContent)).toEqual(['Curriculum', 'Electives', 'Map'])
    expect([...nav.querySelectorAll('.navright > a')].map(a => a.textContent)).toEqual(['Progress', 'Mastery challenge'])
    expect(nav.querySelector('.navsep')).not.toBeNull()
    expect(nav.querySelectorAll('.navleft > a.on, .navright > a.on')).toHaveLength(0) // none is lit on another page
    expect([...nav.querySelectorAll('.morelist a:not(.folded)')].map(a => a.textContent)).toEqual(['Play', 'Review', 'Library', 'Contrast lab', 'My plan', 'Roadmap'])
    expect(nav.querySelector('.morelist button')?.textContent).toBe('Settings')
    expect(nav.querySelector('summary')?.textContent).toContain('More')
    for (const sel of ['.backbar', '.continuestrip', 'header a.btn-primary']) expect(container.querySelector(sel)).toBeNull()
  })
  it('lights Curriculum on the Curriculum page and shows the lesson list directly with a Next lesson button in the progress card', async () => {
    const { container } = await open('/course?view=path')
    expect(container.querySelector('header .navleft > a.on')?.textContent).toBe('Curriculum')
    expect(container.querySelector('.viewtabs, .viewswitch')).toBeNull()
    expect(screen.queryByRole('button', { name: 'All lessons' })).toBeNull()
    await waitFor(() => expect(container.querySelector('.overallbar button.nextbtn')).not.toBeNull(), { timeout: 15000 })
    const btn = container.querySelector('.overallbar button.nextbtn')
    expect(btn?.textContent).toBe('Next lesson')
    ;(Element.prototype as unknown as { scrollIntoView: () => void }).scrollIntoView = () => undefined
    await act(async () => { (btn as HTMLElement).click() })
    const row = container.querySelector('.lessonrow.flash')
    expect(row).not.toBeNull()
    expect(row!.querySelector('.nextlabel')?.textContent).toBe('Next')
    expect(document.activeElement).toBe(row)
  })
})
