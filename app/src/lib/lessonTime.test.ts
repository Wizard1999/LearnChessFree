import { describe, expect, it } from 'vitest'
import { aboutMinutes, lessonMinutes, stepMinutes } from './lessonTime'
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

describe('practice and contrast steps', () => {
  it('counts only the first three practice questions, since the rest are optional', () => {
    const three = { ...base, steps: [{ type: 'practice', tags: [], n: 3 }] } as unknown as Lesson
    const ten = { ...base, steps: [{ type: 'practice', tags: [], n: 10 }] } as unknown as Lesson
    expect(lessonMinutes(ten)).toBe(lessonMinutes(three))
    expect(stepMinutes({ type: 'practice', tags: [], n: 10 } as never)).toBeCloseTo(2.1)
    expect(stepMinutes({ type: 'practice', tags: [], n: 2 } as never)).toBeCloseTo(1.4)
  })
  it('counts a contrast trio as 1.5 minutes', () => { expect(stepMinutes({ type: 'contrast', working: 'a', failing: 'b' } as never)).toBe(1.5) })
})

describe('aboutMinutes', () => {
  it('always says about', () => { expect(aboutMinutes(7)).toBe('about 7 min'); expect(aboutMinutes(90)).toBe('about 1 h 30 min'); expect(aboutMinutes(120)).toBe('about 2 h') })
})
