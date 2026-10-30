import { lessonMinutes } from './lessonTime'
import type { Attempt, LessonProgress } from '../db'
import type { ContentBundle, Item } from '../types'
import { isDue } from './schedule'
import { evidenceAttempts, groupBySkillKey, masteryMap, nextLessons, type Placement } from './progress'
import { interleave, pickFresh } from './select'

export interface Block {
  id: string
  kind: 'review' | 'lesson' | 'mixed' | 'reflect' | 'start' | 'link'
  title: string
  why: string
  minutes: number
  itemIds?: string[]
  lessonId?: string
  to?: string // for kind 'link': where the block goes
  cta?: string
}

/** Things the plan can point to that live outside the exercise attempts. */
export interface Extras { plans: { due: boolean; created: number; checked: boolean }[]; games: number; analysedGames: number; labUses: number; hasPlan: boolean; repDue: number; /** A mastery challenge is unlocked: the skills it would review. */ challenge: { skills: string[] } | null }
export const NO_EXTRAS: Extras = { plans: [], games: 0, analysedGames: 0, labUses: 0, hasPlan: false, repDue: 0, challenge: null }


export const dateKey = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

/**
 * Today's plan (scheduler v1, CD-9 / docs/product-design): explicit rules, every choice has a stated reason.
 * 1. a few skills that are due for review (fresh items, not the same diagrams), 2. the next lesson whose prerequisites are met,
 * 3. interleaved mixed practice where nobody names the idea (including no-tactic positions), 4. one reflection.
 */
export function buildDaily(c: ContentBundle, attempts: Attempt[], placement: Placement, progress: LessonProgress[], day = dateKey(), extras: Extras = NO_EXTRAS): Block[] {
  const blocks: Block[] = []
  const masteries = masteryMap(attempts, Date.now(), c.cuedOnly)
  const bySkill = groupBySkillKey(evidenceAttempts(attempts))
  const poolFor = (key: string) => c.items.filter(i => i.skill === key)

  // A depth whose exercises are all cued (cue 1) still needs its refresher: count cue 1 there, and only there.
  const minCueOf = (k: string) => (c.cuedOnly.has(k) ? 1 : 2)
  const due = [...bySkill.entries()].filter(([k, v]) => v.length >= 3 && isDue(v, Date.now(), minCueOf(k))).map(([k]) => k).slice(0, 3)
  const reviewItems: Item[] = []
  for (const k of due) reviewItems.push(...pickFresh(poolFor(k).filter(i => i.cue >= minCueOf(k)), attempts, 2, `${day}:rev:${k}`))
  const dueName = (k: string) => { const i = k.lastIndexOf('.'); return `${c.skillById.get(k.slice(0, i))?.title ?? k.slice(0, i)} (${k.slice(i + 1)})` }
  if (reviewItems.length) blocks.push({ id: 'review', kind: 'review', title: 'Quick return', minutes: Math.max(3, reviewItems.length),
    why: `These skills are due for a look: ${due.map(dueName).join(', ')}. You get fresh positions, not the ones you have already seen.`, itemIds: reviewItems.map(i => i.id) })

  const lessons = nextLessons(c, masteries, placement, progress, 1)
  if (lessons[0]) blocks.push({ id: 'lesson', kind: 'lesson', title: lessons[0].title, minutes: lessonMinutes(lessons[0]), lessonId: lessons[0].id,
    why: 'It is the next lesson whose prerequisites you have met, in curriculum order.' })

  if (attempts.length === 0 && !placement.done) {
    blocks.push({ id: 'start', kind: 'start', title: 'Already play? Find your starting point', minutes: 15,
      why: 'Optional. A short mixed placement (positions from several levels, none labelled) shows where to begin so you do not repeat what you already know. You can skip it and start from the beginning.' })
  }

  const open = [...masteries.entries()].filter(([, m]) => m.state === 'introduced' || m.state === 'practising')
    .sort((a, b) => a[1].pReliable - b[1].pReliable).slice(0, 5).map(([k]) => k)
  const lists = open.map(k => pickFresh(poolFor(k).filter(i => i.cue >= 3), attempts, 2, `${day}:mix:${k}`)).filter(l => l.length)
  let mixed = interleave(lists).slice(0, 8)
  if (mixed.length < 4) {
    const gen = pickFresh(c.items.filter(i => i.cue >= 3), attempts, 6 - mixed.length, `${day}:mixfill`, { exclude: new Set(mixed.map(i => i.id)) })
    mixed = [...mixed, ...gen]
  }
  const quiet = pickFresh(c.items.filter(i => (i.tags ?? []).includes('kind.quiet')), attempts, 1, `${day}:quiet`, { exclude: new Set(mixed.map(i => i.id)) })
  mixed = [...mixed, ...quiet]
  if (mixed.length) blocks.push({ id: 'mixed', kind: 'mixed', title: 'Mixed practice: no labels', minutes: Math.max(5, mixed.length),
    why: 'Different skills are interleaved on purpose. Nobody tells you which idea applies, and some positions have no tactic at all. This is the evidence that counts.', itemIds: mixed.map(i => i.id) })

  // Pointers to the student-led parts. Each shows only when it has something real to offer, and says why.
  const dueCheck = extras.plans.find(p => p.due && !p.checked)
  if (dueCheck) blocks.push({ id: 'plan-check', kind: 'link', to: '/plan', cta: 'Open my plan', title: 'Check your training plan', minutes: 6,
    why: 'You set a plan and the time you chose has passed. Checking on positions you have not seen is how you find out whether it worked.' })
  if (extras.challenge) blocks.push({ id: 'challenge', kind: 'link', to: '/course', cta: 'Start the challenge', title: 'A mastery challenge is ready', minutes: 6,
    why: `Six unlabeled exercises on three skills you have already practiced (${extras.challenge.skills.join(', ')}). They are the most overdue. Spaced review is what keeps a skill from fading, and it can raise a level as well as lower one.` })
  if (extras.repDue > 0) blocks.push({ id: 'drill', kind: 'link', to: '/drill', cta: 'Drill my lines', title: 'Repertoire drill', minutes: Math.max(3, Math.min(8, extras.repDue)),
    why: `${extras.repDue} position${extras.repDue === 1 ? '' : 's'} in the openings you saved ${extras.repDue === 1 ? 'is' : 'are'} due. A line you do not recall at the board is not yet a line you play.` })
  const unanalysed = extras.games - extras.analysedGames
  if (unanalysed > 0) blocks.push({ id: 'game-review', kind: 'link', to: '/games', cta: 'Review a game', title: 'Review one of your games', minutes: 10,
    why: `You have ${unanalysed} saved game${unanalysed === 1 ? '' : 's'} not yet reviewed. Marking your own critical moments first, then comparing with the engine, shows what you do and do not notice.` })
  const firsts = attempts.filter(a => a.firstAttempt && a.cue >= 3 && a.source !== 'lesson').length
  if (!extras.hasPlan && firsts >= 20) blocks.push({ id: 'make-plan', kind: 'link', to: '/plan', cta: 'Make a plan', title: 'Choose what to work on yourself', minutes: 5,
    why: 'You have enough history to pick your own focus. Say what you will do and how you will know it worked. The system will check your reasoning rather than choose for you.' })
  if (extras.labUses === 0 && firsts >= 15) blocks.push({ id: 'lab', kind: 'link', to: '/lab', cta: 'Try the lab', title: 'Contrast lab: change one thing', minutes: 6,
    why: 'Knowing that an idea works is different from knowing what it depends on. In the lab you change one feature of a position, predict the result, and the engine checks.' })
  const hinted = attempts.filter(a => a.firstAttempt && a.cue >= 3 && a.hints > 0).length
  if (firsts >= 12 && hinted / firsts > 0.3) blocks.push({ id: 'silent', kind: 'link', to: '/practice?go=1&n=8&silent=1', cta: 'Start silent set', title: 'A silent set', minutes: 6,
    why: `You used hints on ${Math.round((hinted / firsts) * 100)}% of recent unlabeled exercises. One set with hints turned off tells you where you stand on your own.` })

  blocks.push({ id: 'reflect', kind: 'reflect', title: 'One minute to think', minutes: 1,
    why: 'Noticing what felt unclear is how you start choosing your own training.' })
  return blocks
}
