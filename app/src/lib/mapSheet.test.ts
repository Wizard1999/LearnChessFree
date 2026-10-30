import { describe, expect, it } from 'vitest'
import { listMaxHeight, sheetOffset, skillState } from './mapSheet'

const box = (top: number, bottom: number, left = 0, right = 400) => ({ top, bottom, left, right, width: right - left, height: bottom - top })

describe('sheetOffset', () => {
  it('is zero without a sheet', () => { expect(sheetOffset(box(100, 700), null)).toBe(0) })
  it('is zero for a narrow side panel', () => { expect(sheetOffset(box(100, 700), box(100, 700, 0, 120))).toBe(0) })
  it('is zero when the sheet starts below the map', () => { expect(sheetOffset(box(100, 500), box(600, 800))).toBe(0) })
  it('moves the centre up by half the covered height', () => { expect(sheetOffset(box(100, 700), box(500, 844))).toBe(-100) })
})

describe('skillState', () => {
  it('names each state in words', () => {
    expect(skillState(undefined).word).toBe('not started')
    expect(skillState({ level: 0, lessonDone: false }).mark).toBe('○')
    expect(skillState({ level: 1, lessonDone: false }).word).toBe('started')
    expect(skillState({ level: 1, lessonDone: true }).word).toBe('lesson finished')
    expect(skillState({ level: 4, lessonDone: true }).word).toBe('mastered')
  })
})

describe('listMaxHeight', () => {
  it('is null without a sheet', () => { expect(listMaxHeight(300, null)).toBeNull() })
  it('stops 8px above the sheet', () => { expect(listMaxHeight(300, 600)).toBe(292) })
  it('never gets smaller than the minimum', () => { expect(listMaxHeight(300, 350)).toBe(160) })
})
