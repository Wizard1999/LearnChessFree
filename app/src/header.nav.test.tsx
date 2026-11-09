// @vitest-environment jsdom
// The restructured top bar (D63-D65): masthead and byline on the left, one More button, no tab row; Back to Curriculum on other pages.
import 'fake-indexeddb/auto'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { act, cleanup, render, screen } from '@testing-library/react'
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

describe('top bar', () => {
  it('keeps the credit and has only a More menu, no tab row', async () => {
    const { container } = await open('/roadmap')
    expect(container.querySelector('header.top .byline')?.textContent).toBe(BRAND.byline)
    const nav = container.querySelector('header.top nav')!
    expect(nav.querySelectorAll(':scope > a')).toHaveLength(0)
    const links = [...nav.querySelectorAll('.morelist a')].map(a => a.textContent)
    expect(links).toEqual(['Play', 'Review', 'Library', 'Contrast lab', 'My plan', 'Roadmap'])
    expect(nav.querySelector('.morelist button')?.textContent).toBe('Settings')
    expect(nav.querySelector('summary')?.textContent).toBe('More')
  })
  it('offers Back to Curriculum on other pages but not on the Curriculum', async () => {
    await open('/roadmap')
    expect(screen.getByRole('link', { name: /Back to Curriculum/ }).getAttribute('href')).toBe('/course')
    cleanup()
    const { container } = await open('/course')
    expect(container.querySelector('.backbar')).toBeNull()
  })
})
