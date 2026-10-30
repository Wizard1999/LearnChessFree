import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { expect, it } from 'vitest'
import { PATH_STAGES } from './pathStages'

it('the stage names match the built path, and every lesson is on the path once', () => {
  const dir = join(__dirname, '..', '..', 'public', 'content')
  const path = JSON.parse(readFileSync(join(dir, 'path.json'), 'utf8')) as { stages: { id: string; title: string; milestone: string; lessons: string[] }[] }
  expect(path.stages.map(s => ({ id: s.id, title: s.title, milestone: s.milestone }))).toEqual(PATH_STAGES)
  const lessons = JSON.parse(readFileSync(join(dir, 'lessons.json'), 'utf8')) as { id: string; order?: number; stage?: string }[]
  const placed = path.stages.flatMap(s => s.lessons)
  expect(new Set(placed).size).toBe(placed.length)
  expect(placed.sort()).toEqual(lessons.map(l => l.id).sort())
  expect(lessons.every(l => l.order && l.stage)).toBe(true)
})
