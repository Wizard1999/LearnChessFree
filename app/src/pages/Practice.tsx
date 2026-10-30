import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useContent } from '../lib/content'
import { masteryMap, useAttempts, useLessonProgress } from '../lib/progress'
import { isDue } from '../lib/schedule'
import { effectiveTrivial, loadNever, loadTrivial } from '../lib/trivial'
import { interleave, pickFresh } from '../lib/select'
import { ItemSequence } from '../components/LessonPlayer'
import type { Item } from '../types'

export function Practice() {
  const content = useContent()
  const attempts = useAttempts()
  const progress = useLessonProgress()
  const [params, setParams] = useSearchParams()
  const [silent, setSilent] = useState(false)
  const [round, setRound] = useState(0)
  const [finished, setFinished] = useState<number | null>(null)

  const [manualTrivial, setManualTrivial] = useState<string[]>([])
  const [neverTrivial, setNeverTrivial] = useState<string[]>([])
  useEffect(() => { void loadTrivial().then(setManualTrivial); void loadNever().then(setNeverTrivial) }, [])
  const everything = params.get('all') === '1' // default: only skills the learner has met
  const skill = params.get('skill') ?? ''
  const tag = params.get('tag') ?? ''
  const strand = params.get('strand') ?? ''
  const n = Number(params.get('n') ?? 8)
  const started = params.get('go') === '1'
  const silentOn = silent || params.get('silent') === '1'

  const skillKeys = useMemo(() => [...new Set(content.items.map(i => i.skill))].sort(), [content.items])
  const tags = useMemo(() => [...new Set(content.items.flatMap(i => (i.tags ?? []).filter(t => t.startsWith('theme.') || t.startsWith('kind.'))))].sort(), [content.items])
  const strands = useMemo(() => [...new Set(content.skills.map(s => s.strand))].sort(), [content.skills])

  const items = useMemo<Item[]>(() => {
    if (!started || !attempts) return []
    // Skills the learner has shown they find trivial are left out of mixed practice (a chosen skill is always honoured).
    const trivial = effectiveTrivial(attempts, manualTrivial, neverTrivial)
    let pool = content.items.filter(i => i.cue >= 3 && (skill || !trivial.has(i.skill)))
    // Mixed practice draws only from skills the learner has met: a lesson seen, or any answers given. Never empty: a brand-new learner gets everything.
    if (!skill && !everything && progress) {
      const met = new Set<string>()
      for (const l of content.lessons) if (progress.some(p => p.lessonId === l.id)) for (const n of [l.skill, ...(l.also ?? [])]) met.add(n)
      for (const a of attempts) met.add(a.skillKey.slice(0, a.skillKey.lastIndexOf('.')))
      const known = pool.filter(i => met.has(i.skill.slice(0, i.skill.lastIndexOf('.'))))
      if (known.length >= 4) pool = known
    }
    if (skill) pool = content.items.filter(i => i.skill === skill)
    if (tag) pool = pool.filter(i => (i.tags ?? []).includes(tag))
    if (strand) pool = pool.filter(i => content.skillById.get(i.skill.slice(0, i.skill.lastIndexOf('.')))?.strand === strand)
    // interleave across skills so unlike ideas alternate
    const bySkill = new Map<string, Item[]>()
    for (const i of pool) bySkill.set(i.skill, [...(bySkill.get(i.skill) ?? []), i])
    const per = Math.max(1, Math.ceil(n / Math.max(1, bySkill.size)))
    const lists = [...bySkill.entries()].map(([k, l]) => pickFresh(l, attempts, per, `practice:${round}:${k}`))
    const mixed = !skill && !tag && !strand
    if (!mixed) return interleave(lists).slice(0, n)
    // Mixed practice also brings back skills the learner has already mastered, the longest-unseen first: a miss there counts against the level, so mastery has to be kept.
    const m = masteryMap(attempts, Date.now(), content.cuedOnly)
    const byKey = new Map<string, typeof attempts>(); for (const a of attempts) byKey.set(a.skillKey, [...(byKey.get(a.skillKey) ?? []), a])
    const back = [...m.entries()].filter(([k, v]) => (v.state === 'reliable' || v.state === 'refresh') && isDue(byKey.get(k) ?? [], Date.now(), content.cuedOnly.has(k) ? 1 : 2)).sort((a, b) => (a[1].lastTs ?? 0) - (b[1].lastTs ?? 0)).slice(0, Math.max(1, Math.ceil(n / 4)))
    const review = back.flatMap(([k]) => pickFresh(content.items.filter(i => i.skill === k && i.cue >= 3), attempts, 1, `practice:${round}:back:${k}`))
    const ids = new Set(review.map(i => i.id))
    return interleave([review, ...lists.map(l => l.filter(i => !ids.has(i.id)))]).slice(0, n)
  }, [started, attempts, progress, manualTrivial, neverTrivial, everything, content, skill, tag, strand, n, round])

  const set = (k: string, v: string) => { const p = new URLSearchParams(params); if (v) p.set(k, v); else p.delete(k); p.delete('go'); setParams(p); setFinished(null) }
  const go = () => { const p = new URLSearchParams(params); p.set('go', '1'); setParams(p); setRound(r => r + 1); setFinished(null) }

  return (
    <main className="page">
      <h1>Practice</h1>
      {!started && (
        <section className="card">
          <p className="lede">Practice gives you positions where nobody tells you which idea applies. Fresh positions come first.</p>
          <div className="row"><button type="button" className="primary big" onClick={go}>Start mixed practice</button></div>
          <details className="practiceopts">
            <summary>Choose what to practise instead</summary>
            <div className="grid2">
              <label className="field"><span className="small muted">Skill (optional)</span>
                <select value={skill} onChange={e => set('skill', e.target.value)}><option value="">Mixed: all skills</option>{skillKeys.map(k => <option key={k} value={k}>{k}</option>)}</select></label>
              <label className="field"><span className="small muted">Theme or kind (optional)</span>
                <select value={tag} onChange={e => set('tag', e.target.value)}><option value="">Any</option>{tags.map(t => <option key={t} value={t}>{t}</option>)}</select></label>
              <label className="field"><span className="small muted">Strand (optional)</span>
                <select value={strand} onChange={e => set('strand', e.target.value)}><option value="">Any</option>{strands.map(t => <option key={t} value={t}>{t}</option>)}</select></label>
              <label className="field"><span className="small muted">Which skills</span>
                <select value={everything ? '1' : ''} onChange={e => set('all', e.target.value)}><option value="">Only skills I have met</option><option value="1">Everything</option></select></label>
              <label className="field"><span className="small muted">How many</span>
                <select value={n} onChange={e => set('n', e.target.value)}>{[5, 8, 12, 20].map(x => <option key={x} value={x}>{x}</option>)}</select></label>
            </div>
            <label className="check"><input type="checkbox" checked={silentOn} onChange={e => { setSilent(e.target.checked); if (!e.target.checked && params.get('silent')) set('silent', '') }} /> <span><strong>Silent practice</strong>: no hints. This is how you check that you can do it on your own. (Answers and explanations still appear after each exercise.)</span></label>
          </details>
        </section>
      )}
      {started && finished === null && (
        <>
          <p><button type="button" onClick={() => { const p = new URLSearchParams(params); p.delete('go'); setParams(p) }}>← Change focus</button></p>
          <ItemSequence items={items} source="practice" silent={silentOn} onComplete={r => setFinished(r.filter(x => x.correct).length)} intro={silentOn ? 'Silent practice' : 'Practice'} />
        </>
      )}
      {started && finished !== null && (
        <section className="card">
          <h2>Set finished</h2>
          <p>{finished} of {items.length} right on the first try without hints. That is one data point, not a verdict; what counts is how this looks over many sets.</p>
          <div className="row"><button type="button" className="primary" onClick={go}>Another set</button>
            <button type="button" onClick={() => { const p = new URLSearchParams(params); p.delete('go'); setParams(p); setFinished(null) }}>Change focus</button></div>
        </section>
      )}
    </main>
  )
}
