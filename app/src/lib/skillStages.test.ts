import { describe, expect, it } from 'vitest'
import { currentStageIndex, skillHomeStage, skillHomeStages, skillReturns, stageSentence, tierStage } from './skillStages'
import { readCatalog, readSkills } from './shippedContent'
import type { LessonMeta, Skill } from '../types'

const skill = (id: string, tier: number, strand = 'S3'): Skill => ({ id, title: id, strand, tier, depths: { D1: { outcome: '' } } })
const les = (id: string, sk: string, stage: string, role: LessonMeta['role'], depth = 'D1', order = 1): LessonMeta =>
  ({ id, title: id, skill: sk, depth, role, stage, order, review: { status: 'x' }, stepCount: 1, stepRefs: [] })

describe('stage of a skill', () => {
  it('uses the stage of the first teaching lesson', () => {
    const lessons = [les('A2', 'TAC.FORK', 'S4', 'continuation', 'D2', 9), les('A1', 'TAC.FORK', 'S3', 'intro', 'D1', 5)]
    expect(skillHomeStage(skill('TAC.FORK', 3), lessons)).toBe(3)
  })
  it('mirrors the tier rule of the path builder for a skill without a lesson', () => {
    expect(tierStage(0, 'S1')).toBe(1)
    expect(tierStage(3, 'S3')).toBe(4)
    expect(tierStage(1, 'S7')).toBe(3) // endgame technique starts one stage later
    expect(tierStage(9, 'S2')).toBe(7)
    expect(tierStage(undefined, 'S2')).toBe(7)
    expect(skillHomeStage(skill('TAC.NEW', 2), [])).toBe(3)
  })
  it('falls back to the tier rule when the lesson has no stage', () => {
    const l = les('A', 'TAC.X', 'S3', 'intro'); delete l.stage
    expect(skillHomeStage(skill('TAC.X', 2), [l])).toBe(3)
  })
})

describe('where a skill returns', () => {
  const lessons = [
    les('L1', 'TAC.FORK', 'S3', 'intro'), les('L2', 'TAC.FORK', 'S5', 'continuation', 'D2', 20), les('C1', 'TAC.FORK', 'S6', 'application'),
    les('K1', 'TAC.FORK', 'S6', 'assessment'), les('X', 'TAC.FORK', 'S3', 'application'),
  ]
  it('lists the lessons in other stages, grouped in path order, each saying what it adds', () => {
    const r = skillReturns(skill('TAC.FORK', 3), lessons)
    expect(r.map(g => g.stageId)).toEqual(['S5', 'S6'])
    expect(r[0].items.map(i => i.kind)).toEqual(['deeper level'])
    expect(r[0].items[0].adds).toContain('D2')
    expect(r[1].items.map(i => i.kind)).toEqual(['application', 'check'])
  })
  it('lists nothing for a skill whose lessons are all in its own stage, and never repeats the home stage', () => {
    expect(skillReturns(skill('TAC.FORK', 3), [lessons[0], lessons[4]])).toEqual([])
  })
})

describe('stage text and the current stage', () => {
  it('writes "Stage 3 · First wins"', () => { expect(stageSentence(3)).toBe('Stage 4 · First wins'); expect(stageSentence(2)).toBe('Stage 3 · First complete games'); expect(stageSentence(99)).toBe('') })
  it('is the first stage with an unfinished lesson', () => {
    const lessons = [les('a', 'X', 'S0', 'intro'), les('b', 'X', 'S1', 'intro'), les('c', 'X', 'S2', 'intro')]
    expect(currentStageIndex(lessons, new Set())).toBe(0)
    expect(currentStageIndex(lessons, new Set(['a']))).toBe(1)
    expect(currentStageIndex(lessons, new Set(['a', 'b', 'c']))).toBeNull()
  })
})

describe('shipped curriculum', () => {
  const skills = readSkills(), lessons = readCatalog()
  it('gives every skill a stage between 1 and 8', () => {
    for (const [id, i] of skillHomeStages(skills, lessons)) { expect(i, id).toBeGreaterThanOrEqual(0); expect(i, id).toBeLessThan(8) }
  })
  it('never lists the home stage as a return', () => {
    for (const s of skills.slice(0, 80)) {
      const home = skillHomeStage(s, lessons)
      for (const g of skillReturns(s, lessons)) expect(g.stageIndex, s.id).not.toBe(home)
    }
  })
})
