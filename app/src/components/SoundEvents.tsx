import { useEffect, useRef } from 'react'
import { useMissionData } from '../lib/useMissions'
import { playSound, initSound, type SoundId } from '../lib/sound'
import type { Level } from '../lib/missions'
import { nextLessons } from '../lib/progress'
import { coreLessonsOf } from '../lib/coreLessons'
import { PATH_STAGES, stageNumber } from '../lib/pathStages'
import { CHECK_LESSON_ID } from '../lib/firstGame'
import { bumpToday, celebrate, claimMilestone, claimSilently, completedStages, levelRises, MILESTONES_READY_KEY, topRise } from '../lib/celebrate'
import { firstLevelMilestone, levelUpToast, MILESTONES, stageMilestone } from '../lib/encourage'
import { kvGet, kvSet } from '../db'

/** The sound for the best level a skill has just reached in a set of changes (Guided, Independent, Mastered), or null when none rose to one of those. Pure. */
export function levelUpSound(before: ReadonlyMap<string, Level>, after: ReadonlyMap<string, Level>): SoundId | null {
  let best = 0
  for (const [id, lv] of after) { const b = before.get(id); if (b !== undefined && lv > b && lv >= 2 && lv > best) best = lv }
  return best === 4 ? 'levelMastered' : best === 3 ? 'levelIndependent' : best === 2 ? 'levelGuided' : null
}

/**
 * Notices real changes in the learner's evidence during this visit and answers them with a sound (if sound is on) and a celebration card (always).
 * The first reading after page load only records where things stand, so nothing fires on load. What a learner had reached before this feature existed
 * is recorded silently once, so old progress does not produce a burst of milestone cards.
 */
function Watch() {
  const { overall, progress, content, ctx, placement } = useMissionData()
  const nodes = overall.nodes
  const seenLevels = useRef<Map<string, Level> | null>(null)
  const seenDone = useRef<Set<string> | null>(null)
  const seenPercent = useRef<number | null>(null)

  // the whole core reaching 100 percent: once, the ring closes (in the ring itself) and this card appears
  useEffect(() => {
    if (nodes.length === 0) return
    const was = seenPercent.current
    seenPercent.current = overall.percent
    if (was === null || was >= 100 || overall.percent < 100) return
    void claimMilestone('core100').then(first => { if (first) celebrate({ art: 'star', fromLevel: 0, toLevel: 4, ...MILESTONES.core, sticky: true }) })
  }, [overall.percent, nodes.length])

  useEffect(() => {
    if (nodes.length === 0) return
    const now = new Map<string, Level>(nodes.map(m => [m.id, m.level]))
    const was = seenLevels.current
    seenLevels.current = now
    if (!was) return
    const rises = levelRises(was, now)
    if (rises.length === 0) return
    void bumpToday('ups', rises.length)
    const id = levelUpSound(was, now)
    if (id) playSound(id)
    const top = topRise(rises)
    if (!top || top.to < 2) return
    const level = top.to as 2 | 3 | 4
    const title = content.skillById.get(top.id)?.title ?? 'A skill'
    void claimMilestone(`level:${level}`).then(first => {
      const t = first ? firstLevelMilestone(level) : levelUpToast(title, level, rises.length - 1)
      celebrate({ art: level === 4 ? 'star' : 'glass', fromLevel: top.from, toLevel: top.to, title: t.title, body: first ? `${title}. ${t.body}` : t.body, sticky: first })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps -- a reading of the levels, not of the content
  }, [nodes])

  useEffect(() => {
    if (!progress || content.lessons.length === 0 || !ctx) return
    const done = new Set(progress.filter(p => p.done).map(p => p.lessonId))
    const was = seenDone.current
    seenDone.current = done
    const stages = coreLessonsOf(content.lessons)
    void (async () => {
      if (!was) {
        // first reading: record, silently, what is already true; then nothing is shown until something new happens
        if (!(await kvGet<boolean>(MILESTONES_READY_KEY, false))) {
          const keys = [...completedStages(stages, done)].map(s => `stage:${s}`)
          if (done.size > 0) keys.push('firstLesson')
          if (done.has(CHECK_LESSON_ID)) keys.push('firstCheck')
          for (const n of nodes) for (let lv = 2; lv <= n.level; lv++) keys.push(`level:${lv}`)
          await claimSilently([...new Set(keys)])
          await kvSet(MILESTONES_READY_KEY, true)
        }
        return
      }
      const fresh = [...done].filter(id => !was.has(id) && !progress.find(p => p.lessonId === id)?.skipped)
      if (fresh.length === 0) return
      void bumpToday('lessons', fresh.length)
      const next = nextLessons(content, ctx.masteries, placement, progress, 1)[0]
      const nextUp = next ? { to: `/lesson/${next.id}`, label: next.title } : undefined
      const after = completedStages(stages, done), before = completedStages(stages, was)
      for (const s of after) {
        if (before.has(s)) continue
        if (await claimMilestone(`stage:${s}`)) {
          const st = PATH_STAGES.find(p => p.id === s)
          if (st) { const t = stageMilestone(stageNumber(s), st.milestone); celebrate({ art: 'crest', fromLevel: 0, toLevel: 4, title: t.title, body: t.body, sticky: true, next: nextUp }); return }
        }
      }
      if (fresh.includes(CHECK_LESSON_ID) && await claimMilestone('firstCheck')) { celebrate({ art: 'glass', fromLevel: 0, toLevel: 1, ...MILESTONES.firstCheck, sticky: true, next: nextUp }); return }
      if (await claimMilestone('firstLesson')) celebrate({ art: 'glass', fromLevel: 0, toLevel: 1, ...MILESTONES.firstLesson, sticky: true, next: nextUp })
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reads the lesson list once progress and content are ready
  }, [progress, ctx])
  return null
}

/** Starts the audio engine's first-gesture unlock and watches for real changes (sounds follow the sound settings; the celebration cards do not). Renders nothing. */
export function SoundEvents() {
  useEffect(() => { initSound() }, [])
  return <Watch />
}
