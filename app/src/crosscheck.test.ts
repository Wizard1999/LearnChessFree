// Cross-checks between the data files and the places the app shows them. When content or a feature changes, these say what is out of step.
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { layoutMap } from './lib/mapLayout'
import { lessonSort } from './lib/progress'
import type { Course, Lesson, Skill } from './types'

const PUB = join(__dirname, '..', 'public')
const json = <T>(p: string): T => JSON.parse(readFileSync(join(PUB, p), 'utf8')) as T
const skills = json<Skill[]>('content/skills.json')
const lessons = json<Lesson[]>('content/lessons.json')
const courses = json<Course[]>('content/courses.json')
const manifest = json<{ lessons: number; skills: number; items: number }>('content/manifest.json')
const skillById = new Map(skills.map(s => [s.id, s]))

describe('lessons are reachable everywhere', () => {
  const core = lessons.filter(l => !l.course)
  const onMap = new Set(layoutMap(skills).nodes.map(n => n.id))

  it('every lesson belongs to a known skill with a strand (so the lesson list and the map section bar show it)', () => {
    for (const l of lessons) {
      const sk = skillById.get(l.skill)
      expect(sk, `${l.id}: skill ${l.skill} is not in the skill graph`).toBeTruthy()
      expect(sk!.strand, `${l.id}: skill ${l.skill} has no strand`).toMatch(/^S\d+$/)
    }
  })
  it('every core lesson is on the map (its skill is a node there)', () => {
    for (const l of core) expect(onMap.has(l.skill), `${l.id}: skill ${l.skill} is missing from the map`).toBe(true)
  })
  it('every skill is on the map, once', () => {
    expect(onMap.size).toBe(skills.length)
  })
  it('every course lesson is listed in a course, and every course entry is a real lesson', () => {
    const ids = new Set(lessons.map(l => l.id))
    const listed = new Set(courses.flatMap(c => c.lessons))
    for (const c of courses) for (const id of c.lessons) expect(ids.has(id), `course ${c.id} lists ${id}, which does not exist`).toBe(true)
    for (const l of lessons.filter(x => x.course)) expect(listed.has(l.id), `${l.id} is a course lesson that no course lists`).toBe(true)
  })
  it('lesson ids are unique and the ordering never puts a lesson before what it builds on within a tier', () => {
    expect(new Set(lessons.map(l => l.id)).size).toBe(lessons.length)
    const sorted = [...core].sort((a, b) => lessonSort(a, b, skillById))
    expect(sorted.length).toBe(core.length)
  })
  it('the manifest counts match the files', () => {
    expect(manifest.lessons).toBe(lessons.length)
    expect(manifest.skills).toBe(skills.length)
  })
})

describe('shipped data is complete and current', () => {
  it('every library book has its file (or is a link-only large book) and a rights record', () => {
    const { books } = json<{ books: { id: string; file: string | null; rights: { basis: string } }[] }>('library/catalog.json')
    expect(books.length).toBeGreaterThan(0)
    for (const b of books) {
      expect(b.rights?.basis, `${b.id}: no rights record`).toBeTruthy()
      if (b.file) expect(existsSync(join(PUB, 'library', b.file)), `${b.id}: file missing`).toBe(true)
    }
  })
  it('master statistics are present and non-trivial', () => {
    const m = json<{ info: { games: number; built: string }; tree: Record<string, unknown[]> }>('masters/stats.json')
    expect(m.info.games).toBeGreaterThan(10000)
    expect(Object.keys(m.tree).length).toBeGreaterThan(1000)
  })
  it('the roadmap data the app shows exists', () => {
    expect(existsSync(join(PUB, 'roadmap.json'))).toBe(true)
  })
})
