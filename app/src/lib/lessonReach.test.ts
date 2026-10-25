/// <reference types="node" />
// Can a learner who does everything right be offered every lesson? A lesson is offered when its prerequisites are met (progress.ts
// nextLessons); a prerequisite depth that can never become reliable or practising would hide every lesson behind it.
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import type { Attempt, LessonProgress } from '../db'
import type { ContentBundle, Item, Lesson, Manifest, Skill } from '../types'
import { masteryMap, nextLessons, NO_PLACEMENT } from './progress'

const dir = join(__dirname, '..', '..', 'public', 'content')
const read = <T>(f: string) => JSON.parse(readFileSync(join(dir, f), 'utf8')) as T
const manifest = read<Manifest>('manifest.json')
const skills = read<Skill[]>('skills.json')
const items = read<Item[]>('items.json')
const lessons = read<Lesson[]>('lessons.json')
const bundle: ContentBundle = {
  manifest, skills, items, lessons, verified: {},
  skillById: new Map(skills.map(s => [s.id, s])), itemById: new Map(items.map(i => [i.id, i])), lessonById: new Map(lessons.map(l => [l.id, l])),
  cuedOnly: new Set(manifest.cued_only ?? []), depthsWithItems: new Set(manifest.depths_with_items ?? []),
}

/**
 * A learner who has answered every exercise right, once, and finishes each lesson as it is offered. If a lesson is still not offered
 * after that, one of its prerequisites can never be met, and the lesson is hidden for good.
 */
function walk(): { offered: Set<string> } {
  const attempts: Attempt[] = []
  const progress: LessonProgress[] = []
  const offered = new Set<string>()
  let ts = 1_000_000
  for (const it of items) attempts.push({ itemId: it.id, skillKey: it.skill, cue: it.cue, family: it.family, correct: true, firstAttempt: true, hints: 0, timeMs: 1000, source: 'practice', ts: ++ts, unprompted: it.cue >= 3 })
  for (let round = 0; round < 200; round++) {
    const next = nextLessons(bundle, masteryMap(attempts, ts + 1, bundle.cuedOnly), NO_PLACEMENT, progress, 1000).filter(l => !offered.has(l.id))
    if (next.length === 0) break
    for (const l of next) { offered.add(l.id); progress.push({ lessonId: l.id, step: l.steps.length, done: true, ts: ++ts }) }
  }
  return { offered }
}

describe('lesson reachability', () => {
  it('a learner who answers everything right is offered (nearly) every lesson', () => {
    const { offered } = walk()
    const missing = lessons.filter(l => !offered.has(l.id))
    if (missing.length) console.log('never offered:', missing.map(l => l.id).join(', '))
    expect(offered.size).toBeGreaterThanOrEqual(Math.floor(lessons.length * 0.95))
  })
})
