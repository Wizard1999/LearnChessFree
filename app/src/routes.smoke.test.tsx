// @vitest-environment jsdom
// Loads every page of the app with the real shipped content and fails if any shows the "This page hit a problem" screen.
// This is the check that would have caught the Today crash by itself: run it (npm test) after any change.
import 'fake-indexeddb/auto'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { act, cleanup, render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import App from './App'

const PUBLIC = join(__dirname, '..', 'public')

beforeAll(() => {
  // serve the built content, openings, library and masters files from app/public
  vi.stubGlobal('fetch', async (url: string | URL) => {
    const path = String(url).split('?')[0].replace(/^https?:\/\/[^/]+/, '').replace(/^\.?\/?(Scholarmate\/)?/, '')
    try {
      const body = readFileSync(join(PUBLIC, path))
      return new Response(body, { status: 200, headers: { 'Content-Type': path.endsWith('.json') ? 'application/json' : 'text/plain' } })
    } catch { return new Response('not found', { status: 404 }) }
  })
  // jsdom has no layout engine or workers; the pages must not need them just to render
  vi.stubGlobal('ResizeObserver', class { observe() {} unobserve() {} disconnect() {} })
  vi.stubGlobal('Worker', class { postMessage() {} terminate() {} onmessage = null })
  ;(window as unknown as { scrollTo: () => void }).scrollTo = () => undefined
  Element.prototype.scrollIntoView = () => undefined
  HTMLElement.prototype.setPointerCapture = () => undefined
})
afterAll(() => { cleanup(); vi.unstubAllGlobals() })

const ROUTES = [
  '/', '/course', '/course?view=lessons', '/course?view=courses', '/course?view=map', '/practice', '/progress', '/analysis', '/library',
  '/games', '/lab', '/plan', '/play', '/openings', '/roadmap', '/settings', '/placement', '/drill',
  '/lesson/L-FND-BOARD-1', '/lesson/L-POS-CONTROL-MAP-1', '/lesson/L-FG-OPERA-1',
]

describe('every page renders', () => {
  for (const route of ROUTES) {
    it(route, async () => {
      const { container, unmount } = render(<MemoryRouter initialEntries={[route]}><App /></MemoryRouter>)
      // give the staged content load and the first effects time to run
      // wait until the page has really rendered (a heading, no loading text), up to 12 s
      for (let i = 0; i < 48; i++) {
        await act(async () => { await new Promise(r => setTimeout(r, 250)) })
        const t = container.textContent ?? ''
        if (t.includes('This page hit a problem')) break
        if (container.querySelector('main h1, main h2') && !/Loading|Preparing/.test(container.querySelector('main')?.textContent ?? '')) break
      }
      expect(container.querySelector('main h1, main h2, main .sr-only'), `${route} never rendered a heading`).toBeTruthy()
      expect(container.textContent).not.toContain('This page hit a problem')
      expect(container.textContent).not.toContain('Lesson not found')
      unmount(); cleanup()
    }, 20000)
  }
})
