import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { ArtEmblem, ArtScene, type SceneKind } from './index'

describe('illustrations (Scholarmate look)', () => {
  it('every scene is decorative, small and tokenised: aria-hidden, a few shapes, no fixed colours', () => {
    for (const kind of ['start', 'games', 'attempts', 'done', 'postgame'] as SceneKind[]) {
      const html = renderToStaticMarkup(<ArtScene kind={kind} />)
      expect(html).toContain('aria-hidden="true"')
      expect(html).not.toMatch(/#[0-9a-fA-F]{3,6}|rgb\(/)
      expect(html.length).toBeLessThan(1500)
    }
  })
  it('an emblem is stable for the same id and differs between ids', () => {
    const a = renderToStaticMarkup(<ArtEmblem seed="course-a" />)
    expect(renderToStaticMarkup(<ArtEmblem seed="course-a" />)).toBe(a)
    const others = new Set(['b', 'c', 'd', 'e', 'f', 'g'].map(s => renderToStaticMarkup(<ArtEmblem seed={`course-${s}`} />)))
    expect(others.size).toBeGreaterThan(2)
    expect(a).toContain('aria-hidden="true"')
  })
})
