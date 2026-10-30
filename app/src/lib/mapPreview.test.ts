import { describe, expect, it } from 'vitest'
import { currentStrand, previewText } from './mapPreview'

const nodes = [
  { id: 'A.1', strand: 'S1', level: 4 }, { id: 'A.2', strand: 'S1', level: 0 },
  { id: 'B.1', strand: 'S3', level: 2 }, { id: 'B.2', strand: 'S3', level: 1 }, { id: 'B.3', strand: 'S3', level: 0 },
]

describe('previewText', () => {
  it('names the strand, the count and the next skill', () => {
    expect(previewText({ strandName: 'Tactics', started: 12, total: 205, nextTitle: 'Forks' })).toBe('You are in Tactics, 12 of 205 skills started; your next skill is Forks.')
  })
  it('works for a new learner with no next skill yet', () => {
    expect(previewText({ strandName: null, started: 0, total: 205, nextTitle: null })).toBe('You are at the start, 0 of 205 skills started.')
  })
})

describe('currentStrand', () => {
  it('prefers the strand of the next skill', () => { expect(currentStrand(nodes, 'A.2')).toBe('S1') })
  it('falls back to the strand with most started skills', () => { expect(currentStrand(nodes, null)).toBe('S3') })
  it('ignores an unknown next id', () => { expect(currentStrand(nodes, 'nope')).toBe('S3') })
  it('is null when nothing is started', () => { expect(currentStrand(nodes.map(n => ({ ...n, level: 0 })), null)).toBeNull() })
})
