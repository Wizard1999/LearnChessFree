import { describe, expect, it } from 'vitest'
import { lessonSort } from './progress'
import { readCatalog, readSkills } from './shippedContent'

const skills = readSkills()
const lessons = readCatalog()

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
