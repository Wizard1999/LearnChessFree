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
import { db } from './db'

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
    expect([...nav.querySelectorAll('.morelist a:not(.folded)')].map(a => a.textContent)).toEqual(['Play', 'Play real people', 'Review', 'Library', 'Contrast lab', 'My plan', 'Learning record', 'Roadmap'])
    expect(nav.querySelector('.morelist button')?.textContent).toBe('Settings')
    expect(nav.querySelector('summary')?.textContent).toContain('More')
    expect(nav.textContent).not.toMatch(/Progress|Mastery/) // the old Progress page is the Learning record under More (D76)
    for (const sel of ['.backbar', '.continuestrip', 'header a.btn-primary']) expect(container.querySelector(sel)).toBeNull()
  })
  it('lights Curriculum on the Curriculum page and shows the lesson list directly with Next lesson and Mastery challenge buttons in the card and the mission progress (no folded Progress report)', async () => {
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
    expect(container.querySelector('.progressdetails, #progress-details, .progressreport')).toBeNull()
    await act(async () => { (btn as HTMLElement).click() })
    const row = container.querySelector('.lessonrow.flash')
    expect(row).not.toBeNull()
    expect(row!.querySelector('.nextlabel')?.textContent).toBe('Next')
    expect(document.activeElement).toBe(row)
  })
  it('one card holds the lesson bar, the ring with its one-column legend and the two buttons; the original mission view folds below it, collapsed by default', async () => {
    const { container } = await open('/course')
    await waitFor(() => expect(container.querySelector('.overallmission .donut')).not.toBeNull(), { timeout: 15000 })
    const card = container.querySelector('.overallbar')!
    expect(card.querySelector('.overallinfo .overallmeta progress')).not.toBeNull()
    expect(card.querySelectorAll('.overallmission ul.legendlist li').length).toBeGreaterThanOrEqual(5)
    expect(container.querySelector('.upnextsection, .pips, .skillblock, .blockmap')).toBeNull() // no Skills up next, no invented grids
    const shown = card.cloneNode(true) as HTMLElement; shown.querySelectorAll('.tip').forEach(t => t.remove())
    expect(shown.textContent).not.toMatch(/average level of all/) // the long sentence lives only in the ? tooltip
    expect(card.querySelector('.infobtn')?.getAttribute('aria-label')).toMatch(/average level of all \d+ skills/)
    expect(container.querySelector('#mission-panel')).toBeNull()
    const btn = card.querySelector('button.mapbtn') as HTMLElement
    expect(btn.getAttribute('aria-expanded')).toBe('false')
    await act(async () => { btn.click() })
    expect(btn.getAttribute('aria-expanded')).toBe('true')
    const panel = container.querySelector('#mission-panel')!
    expect(panel.querySelectorAll('.tierrow')).toHaveLength(11) // the original breakdown: one row of water-fill blocks per subject
    expect(panel.querySelector('.tierrow .blocks .blk')?.getAttribute('aria-label')).toMatch(/: (Not started|Seen|Level one|Level two|Mastered)/)
    expect(panel.querySelector('.donutrow')).toBeNull() // the whole-curriculum ring is the one in the card, not drawn twice
    expect(container.querySelectorAll('.lessonindex .blk, .lessonindex .missionrow')).toHaveLength(0) // never inside the stage lists
    // choosing one section shows its ring, its tiers and the icon-only warm-up
    await act(async () => { (panel.querySelector('.options .chip:nth-of-type(2)') as HTMLElement).click() })
    expect(container.querySelector('#mission-panel .donutrow .donut')).not.toBeNull()
    expect(container.querySelector('#mission-panel .tierrow .small strong')?.textContent).toMatch(/^Tier /)
    const warm = container.querySelector('#mission-panel button[aria-label^="Warm-up: test out S1"]')
    expect(warm).not.toBeNull()
    expect(warm!.textContent).toBe('') // icon only
  })
  it('the Mastery challenge button toggles: it opens the run, becomes Close challenge, and Escape or Close puts it away', async () => {
    const { container } = await open('/course')
    await waitFor(() => expect(container.querySelector('.overallbar button.masterybtn')).not.toBeNull(), { timeout: 15000 })
    const btn = () => container.querySelector('.overallbar button.masterybtn') as HTMLButtonElement
    if (btn().disabled) return // a brand-new learner has nothing to review yet: the button is disabled with the reason as its tooltip
    expect(btn().getAttribute('aria-expanded')).toBe('false')
    await act(async () => { btn().click() })
    expect(btn().getAttribute('aria-expanded')).toBe('true')
    expect(btn().textContent).toBe('Close challenge')
    expect(container.querySelector('#mastery-challenge')).not.toBeNull()
    vi.stubGlobal('confirm', () => true)
    await act(async () => { fireEvent.keyDown(window, { key: 'Escape' }) })
    expect(container.querySelector('#mastery-challenge')).toBeNull()
    expect(btn().textContent).toBe('Mastery challenge')
  })
  it('the old Progress links reach the standalone Learning record: #/progress redirects, and the page has the evidence report', async () => {
    const { container } = await open('/progress')
    await waitFor(() => expect(container.querySelector('main h1')?.textContent).toBe('Learning record'), { timeout: 15000 })
    await waitFor(() => expect(container.querySelector('.progressreport')).not.toBeNull(), { timeout: 15000 })
    expect(container.querySelector('header .morenav summary')?.className).toBe('on') // lit under More
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
  it('Electives use the same collapsible sections: only the course holding the learner place is open and a search opens matches', async () => {
    const { container } = await open('/course?view=courses')
    await waitFor(() => expect(container.querySelectorAll('.disclose').length).toBeGreaterThan(1), { timeout: 15000 })
    const flags = () => [...container.querySelectorAll('.disclose')].map(b => b.getAttribute('aria-expanded'))
    expect(flags().filter(f => f === 'true')).toHaveLength(1)
    expect(container.querySelector('.disclose .discount')?.textContent).toMatch(/\d+ of \d+ done/)
    expect(container.querySelector('button.toggleall')).toBeNull() // no Expand all / Collapse all: each section has its own dropdown
    const closed = [...container.querySelectorAll('.disclose')].find(b => b.getAttribute('aria-expanded') === 'false')!
    const q = container.querySelector('input[type=search]') as HTMLInputElement
    const title = closed.textContent!.split(',')[0].slice(0, 8)
    await act(async () => { fireEvent.change(q, { target: { value: title.toLowerCase() } }) })
    expect(closed.getAttribute('aria-expanded')).toBe('true') // a search opens the sections that match
    expect(flags().every(f => f === 'false')).toBe(false) // matches open while searching
  })
  it('the Map has no Progress or Mastery windows: the selected-skill dock is all that is left', async () => {
    const { container } = await open('/course?view=map&win=progress')
    await waitFor(() => expect(container.querySelector('.sectionbar')).not.toBeNull(), { timeout: 15000 })
    expect(container.querySelector('.dock.left, .missionpanel, .dockwin')).toBeNull()
  })
  it('the map toolbar has no View menu (the header and the phone tab bar switch views)', async () => {
    const { container } = await open('/course?view=map')
    await waitFor(() => expect(container.querySelector('.sectionbar')).not.toBeNull(), { timeout: 15000 })
    expect(container.querySelector('.sectionbar')?.textContent).not.toMatch(/View:|Progress window|Mastery challenge window/)
    expect(container.querySelector('header .navmain > a.on')?.textContent).toBe('Map')
  })
  it('Play real people lists lichess and chess.com as plain new-tab links with labelled claims, and links on to the game review', async () => {
    const { container } = await open('/people')
    await waitFor(() => expect(container.querySelector('main h1')?.textContent).toBe('Play real people'), { timeout: 15000 })
    const links = [...container.querySelectorAll('main a[target=_blank]')] as HTMLAnchorElement[]
    expect(links.map(a => a.getAttribute('href'))).toEqual(['https://lichess.org/', 'https://www.chess.com/play/online'])
    for (const a of links) { expect(a.getAttribute('rel')).toBe('noopener noreferrer'); expect(a.getAttribute('href')).not.toMatch(/\?|ref=|utm/) }
    expect(container.textContent).toMatch(/Not checked:/)
    expect(container.textContent).toMatch(/15\+10/)
    expect(container.textContent).toMatch(/\[V\]/)
    expect(container.querySelector('a[href$="/games#import"]')?.textContent).toBe('Review a game you played elsewhere')
  })
  it('the game review leads with Review a game you played elsewhere', async () => {
    const { container } = await open('/games')
    await waitFor(() => expect(container.querySelector('#import h2')).not.toBeNull(), { timeout: 15000 })
    expect(container.querySelector('#import h2')?.textContent).toBe('Review a game you played elsewhere')
  })
  it('after a first game the Curriculum card carries the Play a game today nudge with a line from the latest lesson, and not before', async () => {
    await db.games.clear(); await db.lessonProgress.clear()
    const before = await open('/course')
    await waitFor(() => expect(before.container.querySelector('.overallbar')).not.toBeNull(), { timeout: 15000 })
    expect(before.container.querySelector('.playnudge')).toBeNull()
    before.unmount()
    await db.games.add({ source: 'practice', white: 'You', black: 'Bot', result: '1-0', pgn: '1. e4 e5', ts: Date.now(), me: 'white' })
    await db.lessonProgress.put({ lessonId: 'L-FND-BOARD-1', step: 5, done: true, ts: Date.now() })
    const { container } = await open('/course')
    await waitFor(() => expect(container.querySelector('.playnudge')).not.toBeNull(), { timeout: 15000 })
    expect(container.querySelector('.playnudge')?.textContent).toMatch(/Play a game today/)
    expect(container.querySelector('.playnudge')?.textContent).toMatch(/What to try this game: Last lesson: /)
    expect(container.querySelector('.playnudge a[href$="/people"]')).not.toBeNull()
    await db.games.clear(); await db.lessonProgress.clear()
  })
  it('the Curriculum counts only core lessons: electives stay out of the totals, the stage sections and the first-game slot, and Core complete is named (D80)', async () => {
    await db.games.clear(); await db.lessonProgress.clear()
    const cat = JSON.parse(readFileSync(join(PUBLIC, 'content', 'lessons.json'), 'utf8')) as { lessons?: { id: string; course?: string; stage?: string }[] } | { id: string; course?: string; stage?: string }[]
    const all = Array.isArray(cat) ? cat : cat.lessons ?? []
    const core = all.filter(l => !l.course)
    expect(all.length - core.length).toBeGreaterThan(0) // the catalog really has elective lessons
    const { container } = await open('/course')
    await waitFor(() => expect(container.querySelector('.overallbar .overallmeta')).not.toBeNull(), { timeout: 15000 })
    expect(container.querySelector('.overallbar .overallmeta')?.textContent).toContain(`of ${core.length} lessons`)
    expect(container.querySelector('.overallbar .overalltitle')?.textContent).toContain('Core curriculum')
    const rows = [...container.querySelectorAll('.card .disclose .discount')].map(e => Number(/of (\d+) done/.exec(e.textContent ?? '')?.[1] ?? 0))
    expect(rows.reduce((a, b) => a + b, 0)).toBe(core.length) // the stage sections add up to the core
    expect(container.querySelector('.corenote')?.textContent).toMatch(/Core complete means all \d+ core skills with exercises are Mastered/)
    expect(container.querySelector('.corenote a')?.getAttribute('href')).toMatch(/view=courses/)
    expect(container.querySelector('.corenote')?.textContent).toMatch(/Looking for something different\? Electives are bonus chess: history, famous games and more/)
    expect(container.querySelector('.corenote')?.textContent).not.toMatch(/after the core/i)
    expect(container.querySelector('.overallbar')?.textContent).not.toMatch(/of 508 lessons/)
  })
  it('an elective row and lesson page show Relevant skills to know first, linked to core lessons and never locking', async () => {
    const { container } = await open('/course?view=courses')
    await waitFor(() => expect(container.querySelectorAll('.disclose').length).toBeGreaterThan(1), { timeout: 15000 })
    await waitFor(() => expect(container.querySelector('[data-testid="relevant-skills"]')).toBeTruthy(), { timeout: 15000 })
    const line = container.querySelector('[data-testid="relevant-skills"]')!
    expect(line.textContent).toMatch(/^Relevant skills to know first:/)
    expect(line.querySelector('a[href*="/lesson/L-"]')).toBeTruthy()
  })
  it('the Electives page keeps its own totals and says it is bonus chess outside the core', async () => {
    const { container } = await open('/course?view=courses')
    await waitFor(() => expect(container.querySelectorAll('.disclose').length).toBeGreaterThan(1), { timeout: 15000 })
    expect(container.querySelector('.lede')?.textContent).toMatch(/Bonus chess for the curious: history, famous players, iconic games and more\. Not part of the core, so nothing here affects your progress/)
    expect(container.querySelector('.lede')?.textContent).not.toMatch(/after the core/i)
    const cat = JSON.parse(readFileSync(join(PUBLIC, 'content', 'lessons.json'), 'utf8')) as { lessons?: { course?: string }[] } | { course?: string }[]
    const elective = (Array.isArray(cat) ? cat : cat.lessons ?? []).filter(l => l.course).length
    const totals = [...container.querySelectorAll('.disclose .discount')].map(e => Number(/of (\d+) done/.exec(e.textContent ?? '')?.[1] ?? 0))
    expect(totals.reduce((a, b) => a + b, 0)).toBe(elective)
  })
})

