import { describe, expect, it } from 'vitest'
import { MORE_LINKS, PHONE_TABS, backBarShown, isFocusRoute, phoneTabFor } from './phoneNav'

describe('phone navigation', () => {
  it('has the four tabs: Today, Practice and Progress now live on the Curriculum page', () => {
    expect(PHONE_TABS.map(t => t.label)).toEqual(['Curriculum', 'Mastery', 'Progress', 'More'])
  })
  it('lights the tab a page belongs to', () => {
    expect(phoneTabFor('/')).toBe('curriculum')
    expect(phoneTabFor('/today')).toBe('curriculum')
    expect(phoneTabFor('/course')).toBe('curriculum')
    expect(phoneTabFor('/course', '?win=progress')).toBe('progress')
    expect(phoneTabFor('/course', '?win=challenge')).toBe('mastery')
    expect(phoneTabFor('/lesson/L-FND-BOARD-1')).toBe('curriculum')
    expect(phoneTabFor('/practice')).toBe('mastery')
    expect(phoneTabFor('/placement')).toBe('mastery')
    expect(phoneTabFor('/drill')).toBe('mastery')
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
  it('shows Back to Curriculum on every page but the Curriculum and lessons', () => {
    for (const p of ['/', '/course', '/today', '/lesson/L-FND-BOARD-1']) expect(backBarShown(p)).toBe(false)
    for (const p of ['/play', '/review', '/games', '/analysis', '/openings', '/library', '/lab', '/plan', '/roadmap', '/settings', '/practice', '/placement', '/drill']) expect(backBarShown(p)).toBe(true)
  })
  it('keeps every place reachable: the tabs, More and the Curriculum chips cover the old navigation', () => {
    const places = [...PHONE_TABS.filter(t => t.to).map(t => t.to), ...MORE_LINKS.map(([to]) => to)]
    for (const p of ['/course', '/course?win=challenge', '/course?win=progress', '/review', '/play', '/library', '/lab', '/plan', '/roadmap']) expect(places).toContain(p)
  })
})
