import { describe, expect, it } from 'vitest'
import { skillLabel, tidyLabel } from './labels'

describe('tidyLabel', () => {
  it('turns ids into plain words', () => {
    expect(tidyLabel('theme.back-rank')).toBe('Back rank')
    expect(tidyLabel('kind.mate_in_two')).toBe('Mate in two')
    expect(tidyLabel('endgames')).toBe('Endgames')
  })
  it('never returns an empty label', () => { expect(tidyLabel('theme.')).toBe('theme.') })
})
describe('skillLabel', () => {
  it('uses the title and level', () => { expect(skillLabel('END.KPK.D2', 'King and pawn endings')).toBe('King and pawn endings (level 2)') })
  it('falls back to a tidied key', () => { expect(skillLabel('END.KPK.D2')).toBe('End kpk d2') })
})
import { independenceSentence } from './labels'
describe('independenceSentence', () => {
  it('handles no unlabeled data', () => { expect(independenceSentence(3, null, null)).not.toMatch(/—/) })
  it('reports both numbers', () => { expect(independenceSentence(7, 0, 1)).toBe('In your last 7 first attempts you used hints on 0% of unlabeled exercises, and were right 100% of the time when you used none.') })
  it('omits accuracy when every unlabeled answer used a hint', () => { expect(independenceSentence(7, 1, null)).toBe('In your last 7 first attempts you used hints on 100% of unlabeled exercises.') })
})
