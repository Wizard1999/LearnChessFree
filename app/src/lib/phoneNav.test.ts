import { describe, expect, it } from 'vitest'
import { MORE_LINKS, PHONE_TABS, isFocusRoute, phoneTabFor } from './phoneNav'

describe('phone navigation', () => {
  it('has the four tabs: Today, Practice and Progress now live on the Curriculum page', () => {
    expect(PHONE_TABS.map(t => t.label)).toEqual(['Curriculum', 'Electives', 'Map', 'More'])
  })
  it('lights the tab a page belongs to', () => {
    expect(phoneTabFor('/')).toBe('curriculum')
    expect(phoneTabFor('/today')).toBe('curriculum')
    expect(phoneTabFor('/course')).toBe('curriculum')
    expect(phoneTabFor('/course', '?view=courses')).toBe('electives')
    expect(phoneTabFor('/course', '?view=map')).toBe('map')
    expect(phoneTabFor('/course', '?win=progress')).toBe('curriculum') // old links land on the Curriculum page with Progress details open
    expect(phoneTabFor('/play')).toBe('more')
    expect(phoneTabFor('/lesson/L-FND-BOARD-1')).toBe('curriculum')
    expect(phoneTabFor('/practice')).toBe('curriculum')
    expect(phoneTabFor('/placement')).toBe('curriculum')
    expect(phoneTabFor('/drill')).toBe('curriculum')
    expect(phoneTabFor('/progress/')).toBe('curriculum')
    for (const [to] of MORE_LINKS) expect(phoneTabFor(to)).toBe('more')
    expect(phoneTabFor('/settings')).toBe('more')
  })
  it('steps aside only inside a lesson', () => {
    expect(isFocusRoute('/lesson/L-FND-BOARD-1')).toBe(true)
    expect(isFocusRoute('/practice')).toBe(false)
    expect(isFocusRoute('/play')).toBe(false)
    expect(isFocusRoute('/course')).toBe(false)
  })
  it('keeps every place reachable: the tabs, More and the Curriculum chips cover the old navigation', () => {
    const places = [...PHONE_TABS.filter(t => t.to).map(t => t.to), ...MORE_LINKS.map(([to]) => to)]
    for (const p of ['/course', '/course?view=courses', '/course?view=map', '/review', '/play', '/library', '/lab', '/plan', '/roadmap']) expect(places).toContain(p)
  })
})
