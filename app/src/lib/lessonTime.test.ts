import { describe, expect, it } from 'vitest'
import { lessonMinutes } from './lessonTime'
import type { Lesson } from '../types'

const base = { id: 'L-X', title: 't', skill: 'A.B', depth: 'D1', outcomes: [], review: { status: 'needs-human', reviewer: null } } as unknown as Lesson

describe('lessonMinutes', () => {
  it('adds reading time, exercises and reflections', () => {
    const l = { ...base, steps: [{ type: 'card', text: Array(400).fill('w').join(' ') }, { type: 'item', item: 'I-1' }, { type: 'item', item: 'I-2' }, { type: 'reflect', kind: 'k', prompt: 'p', fields: [] }] } as unknown as Lesson
    expect(lessonMinutes(l)).toBe(5) // 2 + 0.8 + 0.8 + 1
  })
  it('is at least three minutes and tolerates things that are not lessons', () => {
    expect(lessonMinutes({ ...base, steps: [] } as unknown as Lesson)).toBe(3)
    expect(lessonMinutes({ minutes: 7 } as unknown as Lesson)).toBe(7)
    expect(lessonMinutes({} as unknown as Lesson)).toBe(8)
  })
})
