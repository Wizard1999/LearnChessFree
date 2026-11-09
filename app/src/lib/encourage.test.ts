import { describe, expect, it } from 'vitest'
import { allSamples, answerHeadline, challengeSummary, firstLevelMilestone, goalLine, levelUpToast, LEVEL_MEANING, MILESTONES, stageMilestone, todaySummary, wrongTry } from './encourage'
import { PATH_STAGES } from './pathStages'

describe('encouragement wording (one place, tone rules)', () => {
  const samples = allSamples()
  it('is calm: no exclamation marks, no emojis, no shouting, no empty strings', () => {
    expect(samples.length).toBeGreaterThan(30)
    for (const s of samples) {
      expect(s.trim().length, s).toBeGreaterThan(5)
      expect(s, s).not.toMatch(/!/)
      expect(s, s).not.toMatch(/\p{Extended_Pictographic}/u)
      expect(s, s).not.toMatch(/\b[A-Z]{4,}\b/)
    }
  })
  it('never praises talent, and never frames loss, guilt or a streak', () => {
    for (const s of samples) {
      expect(s, s).not.toMatch(/\b(genius|gifted|natural|talent|smart|brilliant|amazing|incredible|streak|don't break|lose your|keep your)\b/i)
    }
  })
  it('claims nothing about chess that the code does not know: no chess terms outside the authored milestone texts', () => {
    const generic = [
      ...[0, 1, 3].flatMap(w => (['correct', 'sound-alternative', 'unsuccessful'] as const).map(k => answerHeadline(k, w))),
      ...[1, 2, 3, 6].map(wrongTry), goalLine(true), goalLine(false), challengeSummary(['up']), challengeSummary(['down']), challengeSummary(['same']),
      ...Object.values(LEVEL_MEANING), todaySummary(2, 3) ?? '', MILESTONES.firstLesson.body, MILESTONES.firstGame.body, MILESTONES.core.body,
    ]
    for (const s of generic) expect(s, s).not.toMatch(/\b(fork|pin|skewer|mate|checkmate|sacrifice|winning|losing|blunder|best move|material|tactic|queen|rook|knight|bishop|pawn|king)\b/i)
  })
  it('answers: a right answer says right, a wrong one never says right or praises', () => {
    expect(answerHeadline('correct', 0)).toMatch(/^Right\./)
    expect(answerHeadline('correct', 2)).toMatch(/kept at it/)
    expect(answerHeadline('sound-alternative', 0)).toMatch(/sound alternative/i)
    expect(answerHeadline('unsuccessful', 1)).not.toMatch(/right|correct|well done|great|good/i)
    for (const n of [1, 2, 3, 5]) expect(wrongTry(n)).not.toMatch(/right|correct|well done|great|good job/i)
    for (const n of [1, 2, 3]) expect(wrongTry(n)).toMatch(/try again|hint/i) // points at the next try
  })
  it('offers the hint kindly only after a miss streak', () => {
    expect(wrongTry(1)).not.toMatch(/hint/i)
    expect(wrongTry(2)).not.toMatch(/hint/i)
    expect(wrongTry(3)).toMatch(/hint/i)
    expect(wrongTry(3)).toMatch(/fine/)
  })
  it('the challenge summary follows the evidence', () => {
    expect(challengeSummary(['up', 'same'])).toMatch(/1 skill\./)
    expect(challengeSummary(['up', 'up'])).toMatch(/2 skills/)
    expect(challengeSummary(['down', 'same'])).toMatch(/come back for review/)
    expect(challengeSummary(['same'])).toMatch(/About where you were/)
    expect(challengeSummary(['up', 'down'])).toMatch(/mixed/i)
  })
  it('the Today line is factual and absent when nothing happened', () => {
    expect(todaySummary(0, 0)).toBeNull()
    expect(todaySummary(2, 3)).toBe('Today you finished 2 lessons and moved 3 skills up.')
    expect(todaySummary(1, 0)).toBe('Today you finished 1 lesson.')
    expect(todaySummary(0, 1)).toBe('Today you moved 1 skill up.')
  })
  it('levels are explained in plain words and the stage card quotes the authored aim without claiming the ability', () => {
    expect(LEVEL_MEANING[3]).toMatch(/nobody naming the idea/)
    expect(firstLevelMilestone(3).title).toBe('Your first Independent skill')
    expect(levelUpToast('Forks', 2, 2).title).toBe('Forks: now Guided')
    expect(levelUpToast('Forks', 2, 2).body).toMatch(/2 other skills/)
    const t = stageMilestone(1, PATH_STAGES[0].milestone)
    expect(t.title).toBe('Stage 1: every lesson finished')
    expect(t.body).toContain(PATH_STAGES[0].milestone)
    expect(t.body).not.toMatch(/You can now/)
  })
})
