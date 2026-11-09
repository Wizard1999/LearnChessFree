import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { playSound } from '../lib/sound'
import { challengeSummary, challengeToast } from '../lib/encourage'
import { celebrate } from '../lib/celebrate'
import { db, kvGet, kvSet } from '../db'
import { ItemSequence } from './LessonPlayer'
import { Button } from './Button'
import type { ItemResult } from './ItemPlayer'
import { LEVEL_NAMES, challengeSeed, challengeVerdict, nodeProgress, planChallenge, type ChallengePlan, type Level, type NodeProgress } from '../lib/missions'
import { masteryMap } from '../lib/progress'
import { interleave } from '../lib/select'
import { useMissionData } from '../lib/useMissions'
import { splitSkillKey, type Skill } from '../types'

/**
 * The Mastery challenge as a button next to Next lesson (D74): Next lesson brings you forward, the challenge brings back older material you
 * have seen at least once. It starts at once on the page (no pop-up window). The spaced-review gap is advice, never a lock.
 */
export function useMasteryChallenge(): { button: ReactNode; panel: ReactNode; hint: string } {
  const { content, attempts, ctx, overall } = useMissionData()
  const [last, setLast] = useState<number | null>(null)
  const [run, setRun] = useState<{ plan: ChallengePlan; items: ChallengePlan['picks'][number]['items']; before: Record<string, Level> } | null>(null)
  const [result, setResult] = useState<{ node: NodeProgress; rights: number; before: Level; after: Level }[] | null>(null)
  const [confirming, setConfirming] = useState(false)
  useEffect(() => { void kvGet<number | null>('challenge:last', null).then(setLast) }, [])
  const plan = useMemo<ChallengePlan | null>(() => (ctx && attempts ? planChallenge(overall.nodes, content.items, attempts, null, Date.now(), challengeSeed(overall.strand, last)) : null), [ctx, attempts, overall, content.items, last])

  function start() {
    if (!plan?.unlocked) return
    setResult(null)
    setRun({ plan, items: interleave(plan.picks.map(p => p.items)), before: Object.fromEntries(plan.picks.map(p => [p.node.id, p.node.level])) })
  }
  async function finish(results: ItemResult[]) {
    if (!run || !ctx) return
    const now = Date.now()
    await kvSet('challenge:last', now); setLast(now)
    const ctx2 = { ...ctx, masteries: masteryMap(await db.attempts.toArray(), Date.now(), content.cuedOnly) }
    setResult(run.plan.picks.map(p => {
      const rights = run.items.reduce((s, it, k) => s + (splitSkillKey(it.skill).skill === p.node.id && results[k]?.correct ? 1 : 0), 0)
      return { node: p.node, rights, before: run.before[p.node.id] as Level, after: nodeProgress(content.skillById.get(p.node.id) as Skill, ctx2).level }
    }))
    setRun(null)
    // passed: nothing went down and at least one skill had both exercises right
    const verdicts = run.plan.picks.map(p => challengeVerdict(run.items.reduce((s, it, k) => s + (splitSkillKey(it.skill).skill === p.node.id && results[k]?.correct ? 1 : 0), 0)))
    if (verdicts.includes('up') && !verdicts.includes('down')) {
      playSound('challengePassed')
      celebrate({ art: 'star', fromLevel: 0, toLevel: 4, ...challengeToast(verdicts.filter(v => v === 'up').length), sticky: false })
    }
  }

  /** Closing is always allowed. Answers already given in a run are saved as they are made (they count as evidence), so closing mid-run only drops the exercises not yet answered; the learner is told first. */
  function close(force = false) {
    if (run && !force) { setConfirming(c => !c); return } // asked in the page: a browser confirm box can be blocked inside an app window, which left the challenge impossible to close
    setConfirming(false); setRun(null); setResult(null)
  }
  const isOpen = !!run || !!result
  useEffect(() => {
    if (!isOpen) return
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') close(confirming) }
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }) // eslint-disable-line react-hooks/exhaustive-deps -- close() reads the current run

  const hint = plan?.unlocked ? `Review: six exercises, no hints, on skills you have seen before (${plan.picks.map(p => p.node.title).join(', ')})` : (plan?.reason ?? 'Review older material once you have answered some exercises')
  const button = <Button variant="secondary" icon="reset" className="masterybtn" aria-expanded={isOpen} aria-controls="mastery-challenge" disabled={!isOpen && !plan?.unlocked} tip={isOpen ? 'Close the challenge (Escape)' : hint} onClick={isOpen ? () => close() : start}>{isOpen ? 'Close challenge' : 'Mastery challenge'}</Button>
  const panel = run ? (
    <section className="card challenge" id="mastery-challenge" aria-label="Mastery challenge">
      <div className="row challengehead"><h2>Mastery challenge</h2><Button variant="quiet" onClick={() => close()}>Close</Button></div>
      {confirming && <p className="notice" role="alert">Close the challenge? Answers you have already given are kept as practice; the exercises you have not reached are dropped, and no result is shown. <Button variant="quiet" onClick={() => close(true)}>Close anyway</Button> <Button variant="quiet" onClick={() => setConfirming(false)}>Keep going</Button></p>}
      <ItemSequence items={run.items} source="challenge" silent intro="Six exercises on three skills, no hints" onComplete={r => void finish(r)} />
    </section>
  ) : result ? (
    <section className="card result ok" id="mastery-challenge" role="status" aria-live="polite">
      <h3>Challenge finished</h3>
      <p>{challengeSummary(result.map(r => challengeVerdict(r.rights)))}</p>
      <table className="table small"><thead><tr><th>Skill</th><th>Right</th><th>What it means</th><th>Level</th></tr></thead>
        <tbody>{result.map(r => { const v = challengeVerdict(r.rights); return (
          <tr key={r.node.id}><td>{r.node.title}</td><td>{r.rights} of 2</td>
            <td>{v === 'up' ? 'Both right: evidence for this skill.' : v === 'down' ? 'Both missed: evidence against it. It will come back for review.' : 'One right, one missed: about where it was.'}</td>
            <td>{LEVEL_NAMES[r.before]}{r.after !== r.before ? ` → ${LEVEL_NAMES[r.after]}` : ' (unchanged)'}</td></tr>) })}</tbody></table>
      <Button onClick={() => close(true)}>Close</Button>
    </section>
  ) : null
  return { button, panel, hint }
}
