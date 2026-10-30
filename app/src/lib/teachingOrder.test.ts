import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { lessonSort } from './progress'
import type { Lesson, Skill } from '../types'

const PUB = join(__dirname, '..', '..', 'public', 'content')
const skills = JSON.parse(readFileSync(join(PUB, 'skills.json'), 'utf8')) as Skill[]
const lessons = JSON.parse(readFileSync(join(PUB, 'lessons.json'), 'utf8')) as Lesson[]

describe('the order the first lessons are taught in', () => {
  it('teaches the sliding pieces first, then the knight, then the pawn', () => {
    const byId = new Map(skills.map(s => [s.id, s]))
    const sorted = lessons.filter(l => !l.course).sort((a, b) => lessonSort(a, b, byId)).map(l => l.id)
    const at = (id: string) => sorted.indexOf(id)
    expect(at('L-FND-BOARD-1')).toBeLessThan(at('L-FND-ROOKBISHOP-1'))
    expect(at('L-FND-ROOKBISHOP-1')).toBeLessThan(at('L-FND-QUEENKING-1'))
    expect(at('L-FND-QUEENKING-1')).toBeLessThan(at('L-FND-KNIGHT-1'))
    expect(at('L-FND-KNIGHT-1')).toBeLessThan(at('L-FND-PAWN-1'))
  })
})
