import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useContent } from '../lib/content'
import { describeMastery } from '../lib/mastery'
import { masteryMap, nextLessons, statusOf, useAttempts, useLessonProgress, usePlacement, NO_PLACEMENT, type NodeStatus } from '../lib/progress'
import type { Skill } from '../types'

const STRAND_NAMES: Record<string, string> = {
  S1: 'Rules and board vision', S2: 'Safety and the thinking loop', S3: 'Tactics', S4: 'Calculation', S5: 'Positional play and planning',
  S6: 'Attack, sacrifice and defense', S7: 'Endgames', S8: 'Openings and structures', S9: 'Game study and your own games', S10: 'Practical performance', S11: 'Self-direction',
}
const STATUS_LABEL: Record<NodeStatus, string> = { unseen: 'not started', introduced: 'seen', practising: 'practising', reliable: 'reliable', refresh: 'needs refresh', assumed: 'assumed (placement)' }

export function Course() {
  const content = useContent()
  const attempts = useAttempts()
  const progress = useLessonProgress()
  const placementQ = usePlacement()
  const placement = placementQ ?? NO_PLACEMENT
  const [open, setOpen] = useState<string | null>(null)
  const [strand, setStrand] = useState('all')
  const masteries = useMemo(() => masteryMap(attempts ?? []), [attempts])
  const next = useMemo(() => progress ? nextLessons(content, masteries, placement, progress, 3) : [], [content, masteries, placement, progress])

  const strands = useMemo(() => [...new Set(content.skills.map(s => s.strand))].sort((a, b) => Number(a.slice(1)) - Number(b.slice(1))), [content.skills])
  // Teaching order within a strand: tier, then how long the chain of prerequisites beneath the node is, then title.
  const level = useMemo(() => {
    const memo = new Map<string, number>()
    const walk = (id: string, seen: Set<string>): number => {
      if (memo.has(id)) return memo.get(id)!
      if (seen.has(id)) return 0
      seen.add(id)
      let m = 0
      for (const d of Object.values(content.skillById.get(id)?.depths ?? {})) for (const p of d.prereqs ?? []) {
        const nid = p.slice(0, p.lastIndexOf('.'))
        if (nid !== id && content.skillById.has(nid)) m = Math.max(m, walk(nid, seen) + 1)
      }
      seen.delete(id); memo.set(id, m); return m
    }
    for (const s of content.skills) walk(s.id, new Set())
    return memo
  }, [content.skills, content.skillById])
  const bySkill = useMemo(() => {
    const m = new Map<string, Skill[]>()
    for (const s of content.skills) m.set(s.strand, [...(m.get(s.strand) ?? []), s])
    for (const l of m.values()) l.sort((a, b) => a.tier - b.tier || (level.get(a.id) ?? 0) - (level.get(b.id) ?? 0) || a.title.localeCompare(b.title))
    return m
  }, [content.skills, level])
  const nodeName = (ref: string) => { const i = ref.lastIndexOf('.'); return `${content.skillById.get(ref.slice(0, i))?.title ?? ref.slice(0, i)} ${ref.slice(i + 1)}` }

  return (
    <main className="page wide">
      <h1>Course map</h1>
      <p className="lede">Everything is visible from the start; nothing is locked. The recommended path is highlighted. Strong players can test out of any node with silent practice instead of walking through what they already know.</p>
      <section className="card">
        <h2>Recommended next</h2>
        {next.length === 0 ? <p className="muted">No lesson is queued. Everything available is done, or no lessons have been added for the nodes you have unlocked.</p> : (
          <ul className="plain">{next.map(l => <li key={l.id}><Link to={`/lesson/${l.id}`}><strong>{l.title}</strong></Link> <span className="muted small">· {content.skillById.get(l.skill)?.title ?? l.skill} {l.depth} · {l.minutes ?? 8} min</span></li>)}</ul>
        )}
        {!placement.done && <p className="muted small">Not sure where to start? <Link to="/placement">Take the placement</Link>.</p>}
      </section>
      <div className="row filters" role="group" aria-label="Strand filter">
        <button type="button" className={strand === 'all' ? 'chip on' : 'chip'} onClick={() => setStrand('all')}>All strands</button>
        {strands.map(s => <button key={s} type="button" className={strand === s ? 'chip on' : 'chip'} onClick={() => setStrand(s)}>{s} {STRAND_NAMES[s] ?? ''}</button>)}
      </div>
      {strands.filter(s => strand === 'all' || strand === s).map(s => (
        <section key={s} className="strand">
          <h2>{s} · {STRAND_NAMES[s] ?? s}</h2>
          <div className="skillgrid">
            {(bySkill.get(s) ?? []).map(sk => {
              const depths = Object.keys(sk.depths).sort()
              const lessons = content.lessons.filter(l => l.skill === sk.id || l.also?.includes(sk.id))
              const isOpen = open === sk.id
              return (
                <article key={sk.id} className={isOpen ? 'skill open' : 'skill'}>
                  <button type="button" className="skillhead" onClick={() => setOpen(isOpen ? null : sk.id)} aria-expanded={isOpen}>
                    <span className="tier">T{sk.tier}</span> <strong>{sk.title}</strong>
                  </button>
                  <div className="depthrow">
                    {depths.map(d => { const st = statusOf(`${sk.id}.${d}`, content.skillById, masteries, placement); return <span key={d} className={`depth st-${st}`} title={`${d}: ${STATUS_LABEL[st]}`}>{d}</span> })}
                  </div>
                  {isOpen && (
                    <div className="skilldetail">
                      <p className="muted small">{sk.id}{sk.rating?.grade ? ` · rating grade ${sk.rating.grade} (expert estimate, not measured)` : ''}</p>
                      <dl>
                        {depths.map(d => { const m = masteries.get(`${sk.id}.${d}`); const dep = sk.depths[d]; return (
                          <div key={d}><dt>{d} <span className="muted small">· {STATUS_LABEL[statusOf(`${sk.id}.${d}`, content.skillById, masteries, placement)]}</span></dt>
                            <dd>{dep.outcome}{m ? <span className="muted small"> — {describeMastery(m)}</span> : null}
                              {(dep.prereqs?.length ?? 0) > 0 && <span className="muted small"> Needs: {dep.prereqs!.map(nodeName).join('; ')}.</span>}
                              {content.items.some(i => i.skill === `${sk.id}.${d}`) && <> <Link className="small" to={`/practice?skill=${sk.id}.${d}&go=1&n=5`}>Test it</Link></>}</dd></div>) })}
                      </dl>
                      {sk.conditions && sk.conditions.length > 0 && <><h4>When the idea holds</h4><ul>{sk.conditions.map(c => <li key={c}>{c}</li>)}</ul></>}
                      {sk.contrasts && sk.contrasts.length > 0 && <><h4>Where it fails or does not apply</h4><ul>{sk.contrasts.map(c => <li key={c}>{c}</li>)}</ul></>}
                      {sk.misconceptions && sk.misconceptions.length > 0 && <><h4>Common misunderstandings</h4><ul>{sk.misconceptions.map(c => <li key={c}>{c}</li>)}</ul></>}
                      {lessons.length > 0 && <p><strong>Lessons:</strong> {lessons.map(l => <Link key={l.id} to={`/lesson/${l.id}`} className="pill">{l.title}</Link>)}</p>}
                    </div>
                  )}
                </article>
              )
            })}
          </div>
        </section>
      ))}
    </main>
  )
}
