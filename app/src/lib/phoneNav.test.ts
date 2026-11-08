import { describe, expect, it } from 'vitest'
import { MORE_LINKS, PHONE_TABS, isFocusRoute, phoneTabFor } from './phoneNav'

describe('phone navigation', () => {
  it('has the five tabs of the mobile design, in order', () => {
    expect(PHONE_TABS.map(t => t.label)).toEqual(['Today', 'Curriculum', 'Practice', 'Progress', 'More'])
  })
  it('lights the tab a page belongs to', () => {
    expect(phoneTabFor('/')).toBe('today')
    expect(phoneTabFor('/today')).toBe('today')
    expect(phoneTabFor('/course')).toBe('curriculum')
    expect(phoneTabFor('/lesson/L-FND-BOARD-1')).toBe('curriculum')
    expect(phoneTabFor('/practice')).toBe('practice')
    expect(phoneTabFor('/placement')).toBe('practice')
    expect(phoneTabFor('/drill')).toBe('practice')
    expect(phoneTabFor('/progress/')).toBe('progress')
    for (const [to] of MORE_LINKS) expect(phoneTabFor(to)).toBe('more')
    expect(phoneTabFor('/settings')).toBe('more')
  })
  it('steps aside only inside a lesson', () => {
    expect(isFocusRoute('/lesson/L-FND-BOARD-1')).toBe(true)
    expect(isFocusRoute('/practice')).toBe(false)
    expect(isFocusRoute('/play')).toBe(false)
    expect(isFocusRoute('/course')).toBe(false)
  })
  it('keeps every place reachable: the tabs and More cover the desktop navigation', () => {
    const places = [...PHONE_TABS.filter(t => t.to).map(t => t.to), ...MORE_LINKS.map(([to]) => to)]
    for (const p of ['/', '/course', '/practice', '/progress', '/games', '/openings', '/analysis', '/lab', '/plan', '/play', '/library', '/roadmap']) expect(places).toContain(p)
  })
})
