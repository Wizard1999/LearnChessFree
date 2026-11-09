// @vitest-environment jsdom
// The restructured top bar (D63-D65): masthead and byline on the left, one More button, no tab row; Back to Curriculum on other pages.
import 'fake-indexeddb/auto'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
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
  it('keeps the credit, centres the three Curriculum views, and has no Progress or Mastery challenge items, Back bar, Continue strip or Next button', async () => {
    const { container } = await open('/roadmap')
    expect(container.querySelector('header.top .byline')?.textContent).toBe(BRAND.byline)
    expect(container.querySelector('footer')?.textContent).toContain(`Since ${BRAND.since}`)
    expect(BRAND.founded).toBe('2026-10-25')
    const nav = container.querySelector('header.top nav')!
    expect([...nav.querySelectorAll('.navmain > a')].map(a => a.textContent)).toEqual(['Curriculum', 'Electives', 'Map'])
    expect(nav.querySelector('.navsep')).toBeNull() // three views need no divider
    expect(nav.querySelectorAll('.navmain > a.on')).toHaveLength(0) // none is lit on another page
    expect([...nav.querySelectorAll('.morelist a:not(.folded)')].map(a => a.textContent)).toEqual(['Play', 'Review', 'Library', 'Contrast lab', 'My plan', 'Roadmap'])
    expect(nav.querySelector('.morelist button')?.textContent).toBe('Settings')
    expect(nav.querySelector('summary')?.textContent).toContain('More')
    expect(nav.textContent).not.toMatch(/Progress|Mastery/)
    for (const sel of ['.backbar', '.continuestrip', 'header a.btn-primary']) expect(container.querySelector(sel)).toBeNull()
  })
  it('lights Curriculum on the Curriculum page and shows the lesson list directly with Next lesson and Mastery challenge buttons in the card and folded Progress details', async () => {
    const { container } = await open('/course?view=path')
    expect(container.querySelector('header .navmain > a.on')?.textContent).toBe('Curriculum')
    expect(container.querySelector('.viewtabs, .viewswitch')).toBeNull()
    expect(screen.queryByRole('button', { name: 'All lessons' })).toBeNull()
    await waitFor(() => expect(container.querySelector('.overallbar button.nextbtn')).not.toBeNull(), { timeout: 15000 })
    const btn = container.querySelector('.overallbar button.nextbtn')
    expect(btn?.textContent).toBe('Next lesson')
    ;(Element.prototype as unknown as { scrollIntoView: () => void }).scrollIntoView = () => undefined
    const mc = container.querySelector('.overallbar button.masterybtn')
    expect(mc?.textContent).toBe('Mastery challenge')
    const det = container.querySelector('.progressdetails button.detailsbtn') as HTMLElement
    expect(det.getAttribute('aria-expanded')).toBe('false')
    expect(container.querySelector('#progress-details')).toBeNull()
    await act(async () => { (btn as HTMLElement).click() })
    const row = container.querySelector('.lessonrow.flash')
    expect(row).not.toBeNull()
    expect(row!.querySelector('.nextlabel')?.textContent).toBe('Next')
    expect(document.activeElement).toBe(row)
  })
  it('opens Progress details from the old links (?win=progress and the #/progress redirect)', async () => {
    const { container } = await open('/course?win=progress&report=1')
    await waitFor(() => expect(container.querySelector('#progress-details .progressreport')).not.toBeNull(), { timeout: 15000 })
    expect(container.querySelector('.progressdetails button.detailsbtn')?.getAttribute('aria-expanded')).toBe('true')
  })
  it('Next lesson points at the same lesson whether the list is grouped by stage or by subject', async () => {
    const { container } = await open('/course')
    await waitFor(() => expect(container.querySelector('.overallbar button.nextbtn')).not.toBeNull(), { timeout: 15000 })
    ;(Element.prototype as unknown as { scrollIntoView: () => void }).scrollIntoView = () => undefined
    const labelled = () => container.querySelector('.lessonrow .nextlabel')?.closest('.lessonrow')?.id
    const byStage = labelled()
    expect(byStage).toBeTruthy()
    await act(async () => { (screen.getByRole('button', { name: 'Grouped by subject' }) as HTMLElement).click() })
    await act(async () => { (container.querySelector('.overallbar button.nextbtn') as HTMLElement).click() })
    expect(container.querySelector('.lessonrow.flash')?.id).toBe(byStage) // scrolled to and highlighted in the subject grouping too
    expect(labelled()).toBe(byStage)
  })
  it('Electives use the same collapsible sections: only the course holding the learner place is open, Expand all opens the rest, a search opens matches', async () => {
    const { container } = await open('/course?view=courses')
    await waitFor(() => expect(container.querySelectorAll('.disclose').length).toBeGreaterThan(1), { timeout: 15000 })
    const flags = () => [...container.querySelectorAll('.disclose')].map(b => b.getAttribute('aria-expanded'))
    expect(flags().filter(f => f === 'true')).toHaveLength(1)
    expect(container.querySelector('.disclose .discount')?.textContent).toMatch(/\d+ of \d+ done/)
    await act(async () => { (container.querySelector('button.toggleall') as HTMLElement).click() })
    expect(flags().every(f => f === 'true')).toBe(true)
    await act(async () => { (container.querySelector('button.toggleall') as HTMLElement).click() })
    expect(flags().every(f => f === 'false')).toBe(true)
    const q = container.querySelector('input[type=search]') as HTMLInputElement
    const title = container.querySelector('.disclose')!.textContent!.split(',')[0].slice(0, 8)
    await act(async () => { fireEvent.change(q, { target: { value: title.toLowerCase() } }) })
    expect(flags().length).toBeGreaterThan(0)
    expect(flags().every(f => f === 'false')).toBe(false) // matches open while searching
  })
  it('the map toolbar has no View menu (the header and the phone tab bar switch views)', async () => {
    const { container } = await open('/course?view=map')
    await waitFor(() => expect(container.querySelector('.sectionbar')).not.toBeNull(), { timeout: 15000 })
    expect(container.querySelector('.sectionbar')?.textContent).not.toMatch(/View:|Progress window|Mastery challenge window/)
    expect(container.querySelector('header .navmain > a.on')?.textContent).toBe('Map')
  })
})

