import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { db, kvGet, kvSet } from '../db'
import { ItemSequence } from '../components/LessonPlayer'
import type { ItemResult } from '../components/ItemPlayer'
import { useContent } from '../lib/content'
import { describeMastery } from '../lib/mastery'
import { buildMissions, challengeVerdict, LEVEL_HELP, LEVEL_NAMES, nodeProgress, planChallenge, skillsUpNext, type ChallengePlan, type Level, type Mission, type MissionContext, type NodeProgress } from '../lib/missions'
import { masteryMap, nextLessons, useAttempts, useLessonProgress, usePlacement, NO_PLACEMENT } from '../lib/progress'
import { interleave } from '../lib/select'
import { splitSkillKey, type Skill } from '../types'

const FILL = [0, 25, 50, 75, 100]

function Block({ n, selected, onPick }: { n: NodeProgress; selected: boolean; onPick: (id: string) => void }) {
  const label = `${n.title}: ${LEVEL_NAMES[n.level]}${n.due ? ', refresher due' : ''}${n.assumed ? ', assumed from placement' : ''}${n.lessonDone ? ', lesson finished' : n.hasLesson ? ', lesson not yet finished' : ''}`
  return (
    <button type="button" className={`blk${selected ? ' sel' : ''}${n.due ? ' due' : ''}${n.assumed ? ' assumed' : ''}`} style={{ ['--fill' as string]: `${FILL[n.level]}%` }}
      data-lesson={n.lessonDone ? '1' : undefined} aria-label={label} title={label} aria-pressed={selected} onClick={() => onPick(n.id)} />
  )
}

function Swatch({ level }: { level: Level }) {
  return <span className="blk swatch" style={{ ['--fill' as string]: `${FILL[level]}%` }} aria-hidden="true" />
}

function Donut({ percent }: { percent: number }) {
  const r = 46, c = 2 * Math.PI * r
  return (
    <svg viewBox="0 0 120 120" width="120" height="120" role="img" aria-label={`${percent} percent progress`} className="donut">
      <circle cx="60" cy="60" r={r} fill="none" stroke="var(--chip)" strokeWidth="12" />
      <circle cx="60" cy="60" r={r} fill="none" stroke="var(--accent)" strokeWidth="12" strokeLinecap="butt" strokeDasharray={`${(c * percent) / 100} ${c}`} transform="rotate(-90 60 60)" />
      <text x="60" y="58" textAnchor="middle" fontSize="26" fontWeight="700" fill="var(--text)">{percent}%</text>
      <text x="60" y="76" textAnchor="middle" fontSize="11" fill="var(--text-secondary)">progress</text>
    </svg>
  )
}

function Legend() {
  return (
    <details className="legend small">
      <summary>How to read the blocks</summary>
      <ul className="plain">{([0, 1, 2, 3, 4] as Level[]).map(l => <li key={l}><Swatch level={l} /> <strong>{LEVEL_NAMES[l]}</strong> <span className="muted">{LEVEL_HELP[l]}</span></li>)}
        <li><span className="blk swatch" data-lesson="1" style={{ ['--fill' as string]: '0%' }} aria-hidden="true" /> A dot: you have finished this skill's lesson.</li>
        <li><span className="blk swatch due" style={{ ['--fill' as string]: '75%' }} aria-hidden="true" /> A dashed edge: a refresher is due. <span className="blk swatch assumed" style={{ ['--fill' as string]: '50%' }} aria-hidden="true" /> Hatched: assumed from your placement, not yet shown.</li></ul>
    </details>
  )
}

export function Course() {
  const content = useContent()
  const attempts = useAttempts()
  const progress = useLessonProgress()
  const placementQ = usePlacement()
  const placement = placementQ ?? NO_PLACEMENT
  const [view, setView] = useState<string>('all')
  const [picked, setPicked] = useState<string | null>(null)
  const [showBreakdown, setShowBreakdown] = useState(true)
  const [dismissed, setDismissed] = useState<string[]>([])
  const [lastChallenge, setLastChallenge] = useState<number | null>(null)
  const [run, setRun] = useState<{ plan: ChallengePlan; items: ChallengePlan['picks'][number]['items']; before: Record<string, Level> } | null>(null)
  const [result, setResult] = useState<{ node: NodeProgress; rights: number; before: Level; after: Level }[] | null>(null)

  useEffect(() => { void kvGet<string[]>('upnext:dismissed', []).then(setDismissed); void kvGet<number | null>('challenge:last', null).then(setLastChallenge) }, [])

  const ctx = useMemo<MissionContext | null>(() => {
    if (!attempts || !progress) return null
    const itemDepths = new Map<string, string[]>()
    for (const i of content.items) { const { skill, depth } = splitSkillKey(i.skill); const l = itemDepths.get(skill) ?? []; if (!l.includes(depth)) l.push(depth); itemDepths.set(skill, l) }
    const doneIds = new Set(progress.filter(p => p.done).map(p => p.lessonId))
    const lessonDone = new Set<string>(), hasLesson = new Set<string>()
    for (const l of content.lessons) for (const node of [l.skill, ...(l.also ?? [])]) { hasLesson.add(node); if (doneIds.has(l.id)) lessonDone.add(node) }
    return { masteries: masteryMap(attempts), placement, skillById: content.skillById, itemDepths, lessonDone, hasLesson }
  }, [attempts, progress, placement, content])

  const missions = useMemo(() => (ctx ? buildMissions(content.skills, ctx) : []), [ctx, content.skills])
  const mission: Mission | undefined = missions.find(m => m.strand === view)
  const node = picked ? missions.flatMap(m => m.nodes).find(n => n.id === picked) : undefined
  const next = useMemo(() => (ctx && progress ? nextLessons(content, ctx.masteries, placement, progress, 3) : []), [ctx, progress, content, placement])
  const dismissedSet = useMemo(() => new Set(dismissed), [dismissed])
  const upNext = useMemo(() => (ctx && mission ? skillsUpNext(mission, ctx, dismissedSet) : []), [ctx, mission, dismissedSet])
  const plan = useMemo<ChallengePlan | null>(() => (ctx && attempts && mission ? planChallenge(mission.nodes, content.items, attempts, lastChallenge, Date.now(), `${new Date().toDateString()}:${mission.strand}:${lastChallenge ?? 0}`) : null), [ctx, attempts, mission, content.items, lastChallenge])

  if (!ctx) return <main className="page"><p className="muted">Loading…</p></main>

  const pick = (id: string) => { setPicked(id); const m = missions.find(x => x.nodes.some(n => n.id === id)); if (m && view === 'all') setView(m.strand) }

  function startChallenge() {
    if (!plan?.unlocked || !mission) return
    const items = interleave(plan.picks.map(p => p.items))
    setResult(null)
    setRun({ plan, items, before: Object.fromEntries(plan.picks.map(p => [p.node.id, p.node.level])) })
  }
  async function finishChallenge(results: ItemResult[]) {
    if (!run || !ctx) return
    const now = Date.now()
    await kvSet('challenge:last', now); setLastChallenge(now)
    const fresh = masteryMap(await db.attempts.toArray())
    const ctx2 = { ...ctx, masteries: fresh }
    const rows = run.plan.picks.map(p => {
      const rights = run.items.reduce((s, it, k) => s + (it.skill.startsWith(p.node.id + '.') && results[k]?.correct ? 1 : 0), 0)
      const skill = content.skillById.get(p.node.id) as Skill
      return { node: p.node, rights, before: run.before[p.node.id] as Level, after: nodeProgress(skill, ctx2).level }
    })
    setResult(rows); setRun(null)
  }
  const dismiss = async (id: string) => { const n = [...dismissed, id]; setDismissed(n); await kvSet('upnext:dismissed', n) }

  const lessonsFor = (id: string) => content.lessons.filter(l => l.skill === id || l.also?.includes(id))
  const sk = node ? content.skillById.get(node.id) : undefined

  return (
    <main className="page wide">
      <h1>Course map</h1>
      <p className="lede">Every skill is a block. A block fills as your evidence grows: seen, level one (the idea when it is named), level two (in positions where nobody names it), mastered (reliable at the deepest depth, and not due for a refresher). A dot in the corner means you have finished its lesson. Nothing is locked.</p>

      {next.length > 0 && !run && (
        <section className="card">
          <h2>Continue</h2>
          <ul className="plain">{next.slice(0, 2).map(l => <li key={l.id}><Link to={`/lesson/${l.id}`}><strong>{l.title}</strong></Link> <span className="muted small">· {content.skillById.get(l.skill)?.title ?? l.skill} · {l.minutes ?? 8} min</span></li>)}</ul>
          {!placement.done && <p className="muted small">Not sure where to start? <Link to="/placement">Take the placement</Link> (it can be skipped).</p>}
        </section>
      )}

      <div className="row filters" role="group" aria-label="Missions">
        <button type="button" className={view === 'all' ? 'chip on' : 'chip'} onClick={() => { setView('all'); setPicked(null) }}>All missions</button>
        {missions.map(m => <button key={m.strand} type="button" className={view === m.strand ? 'chip on' : 'chip'} onClick={() => { setView(m.strand); setPicked(null) }}>{m.strand} {m.name} · {m.percent}%</button>)}
      </div>

      {view === 'all' && (
        <section aria-label="All missions">
          <p className="muted small">The whole course on one screen. Pick a mission to see its skills, what to do next and its mastery challenge.</p>
          {missions.map(m => (
            <article key={m.strand} className="card worldrow">
              <div className="row"><h2><button type="button" className="link" onClick={() => setView(m.strand)}>{m.strand} · {m.name}</button></h2><span className="muted small">{m.percent}% · {m.counts[4]} mastered of {m.nodes.length}</span></div>
              <div className="blocks">{m.nodes.map(n => <Block key={n.id} n={n} selected={picked === n.id} onPick={pick} />)}</div>
            </article>
          ))}
          <Legend />
        </section>
      )}

      {mission && (
        <div className="missiongrid">
          <section className="card missionpanel" aria-label={`${mission.name} mission`}>
            <button type="button" className="link" onClick={() => { setView('all'); setPicked(null) }}>‹ See all missions</button>
            <h2>{mission.name}</h2>
            <p className="small muted">MISSION PROGRESS</p>
            <div className="donutrow">
              <Donut percent={mission.percent} />
              <ul className="plain legendlist">
                {([4, 3, 2, 1, 0] as Level[]).map(l => <li key={l}><Swatch level={l} /> <strong>{mission.counts[l]}</strong> {l === 4 ? 'mastered' : l === 0 ? 'not started' : LEVEL_NAMES[l].toLowerCase()}</li>)}
              </ul>
            </div>
            <p className="small muted">Progress is the average level of the mission's skills (mastered counts 4 of 4, level two 3, level one 2, seen 1, not started 0).</p>
            <button type="button" className="link" onClick={() => setShowBreakdown(s => !s)} aria-expanded={showBreakdown}>{showBreakdown ? 'Hide skill breakdown' : 'Show skill breakdown'}</button>
            {showBreakdown && mission.tiers.map(t => (
              <div key={t.tier} className="tierrow">
                <div className="small"><strong>Tier {t.tier}</strong> <span className="muted">{t.gloss}</span></div>
                <div className="blocks">{t.nodes.map(n => <Block key={n.id} n={n} selected={picked === n.id} onPick={pick} />)}</div>
              </div>
            ))}
            <Legend />
          </section>

          <div>
            {run ? (
              <section className="card challenge">
                <h2>Mastery challenge</h2>
                <ItemSequence items={run.items} source="challenge" intro="Six questions on three skills" onComplete={r => void finishChallenge(r)} />
              </section>
            ) : (
              <section className="card challenge">
                <h2>Mastery challenge</h2>
                <p>Strengthen skills you have already practised: six unlabelled questions on three skills, two each, chosen because they are the most overdue. It includes at most one skill you have mastered, as a check that you still have it.</p>
                {plan?.unlocked ? <div className="row"><button type="button" className="primary" onClick={startChallenge}>Start</button><span className="muted small">{plan.picks.map(p => p.node.title).join(' · ')}</span></div> : <p className="muted small">{plan?.reason}</p>}
                <details><summary className="small">How a challenge changes your levels</summary>
                  <p className="small">Both questions right on a skill counts as evidence for it. Both wrong counts as evidence against it, and it comes back for review. One of each leaves it about where it was. Levels are read from all your evidence, so they can move more than one step when the evidence shifts, and nothing is deducted for missing practice. Ordinary practice is never penalised.</p></details>
              </section>
            )}

            {result && (
              <section className="card result ok" role="status" aria-live="polite">
                <h3>Challenge finished</h3>
                <table className="table small"><thead><tr><th>Skill</th><th>Right</th><th>What it means</th><th>Level</th></tr></thead>
                  <tbody>{result.map(r => { const v = challengeVerdict(r.rights); return (
                    <tr key={r.node.id}><td>{r.node.title}</td><td>{r.rights} of 2</td>
                      <td>{v === 'up' ? 'Both right: evidence for this skill.' : v === 'down' ? 'Both missed: evidence against it. It will come back for review.' : 'One right, one missed: about where it was.'}</td>
                      <td>{LEVEL_NAMES[r.before]}{r.after !== r.before ? ` → ${LEVEL_NAMES[r.after]}` : ' (unchanged)'}</td></tr>) })}</tbody></table>
                <button type="button" onClick={() => setResult(null)}>Close</button>
              </section>
            )}

            {!run && (
              <section className="card">
                <h2>Skills up next for you</h2>
                {upNext.length === 0 ? <p className="muted">Nothing is ready in this mission yet. Finish an earlier skill, or pick a block to open it.</p> : (
                  <ul className="plain upnext">{upNext.map(n => {
                    const d = n.workingDepth ? content.skillById.get(n.id)?.depths[n.workingDepth] : undefined
                    return (
                      <li key={n.id}>
                        <div className="upnext-head"><button type="button" className="link" onClick={() => setPicked(n.id)}><strong>{n.title}</strong></button> <Swatch level={n.level} /> <span className="muted small">{LEVEL_NAMES[n.level]}{n.due ? ' · refresher due' : ''}</span></div>
                        {d && <p className="small muted">{n.workingDepth}: {d.outcome}</p>}
                        <div className="row">
                          {lessonsFor(n.id).filter(() => !n.lessonDone).slice(0, 1).map(l => <Link key={l.id} className="button" to={`/lesson/${l.id}`}>Lesson</Link>)}
                          {n.workingDepth && <Link className="button primary" to={`/practice?skill=${n.id}.${n.workingDepth}&go=1&n=6`}>Practice</Link>}
                          <button type="button" className="link" onClick={() => void dismiss(n.id)}>Remove</button>
                        </div>
                      </li>
                    )
                  })}</ul>
                )}
                {dismissed.length > 0 && <button type="button" className="link small" onClick={async () => { setDismissed([]); await kvSet('upnext:dismissed', []) }}>Show removed suggestions again ({dismissed.length})</button>}
              </section>
            )}

            {node && sk && !run && (
              <section className="card skilldetail" aria-label={`${node.title} detail`}>
                <h2>{node.title}</h2>
                <p><span className="blk swatch inline" style={{ ['--fill' as string]: `${FILL[node.level]}%` }} aria-hidden="true" /> <strong>{LEVEL_NAMES[node.level]}</strong>{node.due ? ' · a refresher is due' : ''}{node.assumed ? ' · assumed from your placement, not yet shown' : ''}<br /><span className="small muted">{LEVEL_HELP[node.level]}</span></p>
                {node.noExercises && <p className="small muted">This skill has no exercises yet, so it can only reach Seen, by finishing its lesson.</p>}
                <dl>{Object.keys(sk.depths).sort().map(d => { const m = ctx.masteries.get(`${node.id}.${d}`); const dep = sk.depths[d]; return (
                  <div key={d}><dt>{d} <span className="muted small">· {node.depths.find(x => x.depth === d)?.status ?? 'outline only'}</span></dt>
                    <dd>{dep.outcome}{m ? <span className="muted small"> {describeMastery(m)}</span> : null}</dd></div>) })}</dl>
                <div className="row">
                  {lessonsFor(node.id).map(l => <Link key={l.id} className="button" to={`/lesson/${l.id}`}>Lesson: {l.title}</Link>)}
                  {node.workingDepth && <Link className="button primary" to={`/practice?skill=${node.id}.${node.workingDepth}&go=1&n=6`}>Practise {node.workingDepth}</Link>}
                  {node.workingDepth && <Link className="button" to={`/practice?skill=${node.id}.${node.workingDepth}&go=1&n=6&silent=1`}>Test it silently</Link>}
                </div>
                {sk.conditions && sk.conditions.length > 0 && <details><summary>When the idea holds</summary><ul>{sk.conditions.map(c => <li key={c}>{c}</li>)}</ul></details>}
                {sk.contrasts && sk.contrasts.length > 0 && <details><summary>Where it fails or does not apply</summary><ul>{sk.contrasts.map(c => <li key={c}>{c}</li>)}</ul></details>}
                {sk.misconceptions && sk.misconceptions.length > 0 && <details><summary>Common misunderstandings</summary><ul>{sk.misconceptions.map(c => <li key={c}>{c}</li>)}</ul></details>}
              </section>
            )}
          </div>
        </div>
      )}
    </main>
  )
}
