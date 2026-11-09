// Encouragement wording, all in one place so the tone can be tuned (docs/design-feel.md, D86). Calm, kind, a little academy-warm; no exclamation
// marks, no emojis, no claims about chess that this file does not know. Everything here is generic or built from text the caller already has
// (an exercise's own explanation is shown by the caller, never rewritten here). Praise names what the learner did (kept going, tried the whole board),
// never a talent, and a wrong answer is never praised. Psychology behind the choices is [R]/[H] and is not cited in the app.
import type { ResultKind } from './resultText'

/** The first line after an answer. `wrongsBefore` is how many wrong tries came first. */
export function answerHeadline(kind: ResultKind, wrongsBefore: number): string {
  if (kind === 'sound-alternative') return 'A sound alternative: your move works too.'
  if (kind === 'unsuccessful') return 'Not this time. Have a look at the answer below; seeing it is how it starts to feel familiar.'
  return wrongsBefore === 0 ? 'Right. You found it on the first try.' : 'Right. You kept at it and found it.'
}

/** After a wrong try (never praise), pointing at the next try. `misses` counts this miss (1 = first). From the third, a hint is offered kindly. */
export function wrongTry(misses: number): string {
  if (misses <= 1) return 'Not quite. Look at the whole board once more, then try again.'
  if (misses === 2) return 'Not quite yet. Check what each piece can reach, then try again.'
  return 'Still not it, and that is fine. A hint is there whenever you want one; using it is part of learning.'
}

/** The goal exercise (play it out). */
export function goalLine(reached: boolean): string {
  return reached ? 'Goal reached. Well played.' : 'Goal not reached this time. Look back at how it went, then try again when you are ready.'
}

/** The lesson-complete card. */
export const lessonDoneLead = (title: string) => `Well done: you finished ${title}.`
export const LESSON_SEEN_CAPTION = 'Seen'

/** The Mastery challenge result: one line about the whole run, from the per-skill verdicts. Never alarming. */
export function challengeSummary(verdicts: readonly ('up' | 'same' | 'down')[]): string {
  const up = verdicts.filter(v => v === 'up').length, down = verdicts.filter(v => v === 'down').length
  if (up > 0 && down === 0) return `You got both exercises right on ${up} ${up === 1 ? 'skill' : 'skills'}. That is real evidence the idea is firming up.`
  if (down > 0 && up === 0) return 'Some misses. That is what a challenge is for: it shows what to look at next, and those skills will come back for review.'
  if (up === 0 && down === 0) return 'About where you were. Steady practice is what moves a skill up.'
  return 'A mixed result: some skills held up and some need another look. Both are useful to know.'
}

/** After a game. */
export const postGameTitle = (first: boolean) => (first ? 'You finished your first game.' : 'You finished the game.')
export const POST_GAME_FIRST_LINE = 'Playing one through to the end is the hard part.'

/** What each level means, in plain words (the names are LEVEL_NAMES in lib/missions.ts; Seen and Not started are not celebrated). */
export const LEVEL_MEANING: Record<2 | 3 | 4, string> = {
  2: 'Guided: you can do it when the idea is named or hinted.',
  3: 'Independent: you found it with nobody naming the idea.',
  4: 'Mastered: you have shown it on your own, on separate days.',
}

/** The "Today" line: factual, never a nudge, nothing at all when both counts are zero. */
export function todaySummary(lessons: number, skillsUp: number): string | null {
  const l = lessons > 0 ? `finished ${lessons} ${lessons === 1 ? 'lesson' : 'lessons'}` : ''
  const s = skillsUp > 0 ? `moved ${skillsUp} ${skillsUp === 1 ? 'skill' : 'skills'} up` : ''
  const parts = [l, s].filter(Boolean)
  return parts.length ? `Today you ${parts.join(' and ')}.` : null
}

// ---- milestone cards: each is shown once (stored on this device) ----
export interface MilestoneText { title: string; body: string }
export const MILESTONES = {
  firstLesson: { title: 'Your first lesson is finished', body: 'That is the start of everything else. Each lesson ends in practice, and the practice shows how well the idea has stuck.' },
  firstCheck: { title: 'You finished the lesson on check', body: 'Check and checkmate are the ideas much of the game leans on. Practice will show how well they have stuck.' },
  core: { title: 'Every core skill is Mastered', body: 'The whole core curriculum is at Mastered, shown on your own on separate days. That took real, steady work.' },
  firstGame: { title: 'You finished your first game', body: 'You played a game through to the end. When you want to look back, My games has it, ready to review.' },
} satisfies Record<string, MilestoneText>

/** The stage card. `milestone` is the stage's authored aim (PATH_STAGES). Finishing the lessons is not proof of the aim, so the card says "the aim", not "you can". */
export function stageMilestone(n: number, milestone: string): MilestoneText {
  return { title: `Stage ${n}: every lesson finished`, body: `The aim of this stage: ${milestone} Practice will show how solid it is.` }
}

/** The first time a level is reached on any skill. */
export function firstLevelMilestone(level: 2 | 3 | 4): MilestoneText {
  const name = LEVEL_MEANING[level].split(':')[0]
  return { title: `Your first ${name} skill`, body: LEVEL_MEANING[level] }
}
/** A level-up toast after the first. */
export function levelUpToast(title: string, level: 2 | 3 | 4, more: number): MilestoneText {
  const name = LEVEL_MEANING[level].split(':')[0]
  return { title: `${title}: now ${name}`, body: LEVEL_MEANING[level] + (more > 0 ? ` ${more} other ${more === 1 ? 'skill' : 'skills'} moved up too.` : '') }
}
export function challengeToast(passed: number): MilestoneText {
  return { title: 'Challenge passed', body: `Both exercises right on ${passed} ${passed === 1 ? 'skill' : 'skills'}: evidence, not luck.` }
}

/** Every string a learner can see from this module, for the test that checks the tone rules. */
export function allSamples(): string[] {
  const kinds: ResultKind[] = ['correct', 'sound-alternative', 'unsuccessful']
  return [
    ...kinds.flatMap(k => [0, 1, 3].map(w => answerHeadline(k, w))),
    ...[1, 2, 3, 6].map(wrongTry), goalLine(true), goalLine(false), lessonDoneLead('Check'),
    challengeSummary(['up']), challengeSummary(['down']), challengeSummary(['same']), challengeSummary(['up', 'down']), challengeSummary(['up', 'up']),
    postGameTitle(true), postGameTitle(false), POST_GAME_FIRST_LINE, ...Object.values(LEVEL_MEANING),
    todaySummary(1, 0) ?? '', todaySummary(0, 3) ?? '', todaySummary(2, 1) ?? '',
    ...Object.values(MILESTONES).flatMap(m => [m.title, m.body]),
    ...([2, 3, 4] as const).flatMap(l => [firstLevelMilestone(l), levelUpToast('Forks', l, 2)]).flatMap(m => [m.title, m.body]),
    challengeToast(1).title, challengeToast(2).body,
  ]
}
