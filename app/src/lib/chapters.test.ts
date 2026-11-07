import { describe, expect, it } from 'vitest'
import { chapterIndexAt, chaptersOf, startsLaterChapter } from './chapters'

const steps = (names: (string | undefined)[]) => names.map(chapter => ({ chapter }))

describe('chapters', () => {
  it('has none when no step is named (such lessons are unchanged)', () => {
    expect(chaptersOf(steps([undefined, undefined]))).toEqual([])
  })
  it('groups steps; unnamed steps belong to the chapter before; the first chapter starts at step 0', () => {
    const c = chaptersOf(steps([undefined, 'Basics', undefined, 'Basics', 'Practice', undefined]))
    expect(c).toEqual([{ name: 'Basics', start: 0, end: 3 }, { name: 'Practice', start: 4, end: 5 }])
    expect(chapterIndexAt(c, 0)).toBe(0)
    expect(chapterIndexAt(c, 3)).toBe(0)
    expect(chapterIndexAt(c, 5)).toBe(1)
  })
  it('marks a stopping point at the start of each later chapter only', () => {
    const c = chaptersOf(steps(['A', 'A', 'B', 'B', 'C']))
    expect(startsLaterChapter(c, 0)).toBeNull()
    expect(startsLaterChapter(c, 1)).toBeNull()
    expect(startsLaterChapter(c, 2)).toEqual({ finished: 'A', next: 'B' })
    expect(startsLaterChapter(c, 4)).toEqual({ finished: 'B', next: 'C' })
  })
})
