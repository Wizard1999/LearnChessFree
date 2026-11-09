import { describe, expect, it } from 'vitest'
import { pickNextOnPath } from './useNextCoreLesson'
import type { LessonMeta } from '../types'

const L = (id: string, stage: string | undefined, order?: number) => ({ id, stage, order, skill: id, depth: 'D1' }) as unknown as LessonMeta

describe('Next lesson follows the path', () => {
  it('takes the earliest stage, then the path order, whatever order the candidates arrive in (subject order must not win)', () => {
    const open = [L('tactics-fork', 'S3', 40), L('rook', 'S1', 7), L('pawn', 'S1', 3), L('unplaced', undefined), L('king', 'S2', 12)]
    expect(pickNextOnPath(open)?.id).toBe('pawn')
    expect(pickNextOnPath([...open].reverse())?.id).toBe('pawn')
  })
  it('puts lessons without a stage last and returns nothing for an empty list', () => {
    expect(pickNextOnPath([L('x', undefined), L('y', 'S4', 1)])?.id).toBe('y')
    expect(pickNextOnPath([])).toBeUndefined()
  })
})
