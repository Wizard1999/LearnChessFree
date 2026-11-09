import { describe, expect, it } from 'vitest'
import { coreLessonsOf, isCoreLesson } from './coreLessons'
import type { LessonMeta } from '../types'

const L = (id: string, course?: string) => ({ id, course } as unknown as LessonMeta)

describe('core lessons (D80)', () => {
  it('a lesson with a course is an elective; everything else is core', () => {
    expect(isCoreLesson(L('a'))).toBe(true)
    expect(isCoreLesson(L('b', 'famous-games'))).toBe(false)
    expect(coreLessonsOf([L('a'), L('b', 'x'), L('c')]).map(l => l.id)).toEqual(['a', 'c'])
  })
})
