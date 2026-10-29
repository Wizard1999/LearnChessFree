import { RadialMap } from '../components/RadialMap'
import { lessonMinutes } from '../lib/lessonTime'
import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { db, kvGet, kvSet } from '../db'
import { ItemSequence } from '../components/LessonPlayer'
import { LessonIndex } from './LessonIndex'
import { CoursesView } from './CoursesView'
import type { ItemResult } from '../components/ItemPlayer'
import { WarmupRun } from '../components/WarmupRun'
import { describeMastery } from '../lib/mastery'
import { STRAND_NAMES, challengeSeed, challengeVerdict, LEVEL_HELP, LEVEL_NAMES, nodeProgress, planChallenge, skillsUpNext, type ChallengePlan, type Level, type Mission, type NodeProgress } from '../lib/missions'
import { masteryMap, nextLessons, type Placement, type StrandWarmup } from '../lib/progress'
import { interleave } from '../lib/select'
import { useMissionData } from '../lib/useMissions'
import { splitSkillKey, type Skill } from '../types'

const FILL = [0, 25, 50, 75, 100]

function Block({ n, selected, seen, onPick, onHover }: { n: NodeProgress; selected: boolean; seen: boolean; onPick: (id: string) => void; onHover: (n: NodeProgress | null, el?: HTMLElement) => void }) {
  const credited = n.levelWithAssumed > n.level // the fill includes credit that is only assumed
  const label = `${n.title}: ${LEVEL_NAMES[n.level]}${credited ? `, assumed up to ${LEVEL_NAMES[n.levelWithAssumed].toLowerCase()} from placement or warm-up, not yet shown` : ''}${n.due ? ', refresher due' : ''}${n.lessonDone ? ', lesson finished' : n.hasLesson ? ', lesson not yet finished' : ''}`
  return (
    <button type="button" className={`blk lv${n.level}${selected ? ' sel' : ''}${n.due ? ' due' : ''}${credited ? ' assumed' : ''}`} style={{ ['--fill' as string]: `${FILL[n.levelWithAssumed]}%` }}
      data-lesson={n.lessonDone ? '1' : undefined} data-seen={seen && !n.lessonDone ? '1' : undefined} aria-label={label} aria-pressed={selected} onClick={() => onPick(n.id)}
      onMouseEnter={e => onHover(n, e.currentTarget)} onMouseLeave={() => onHover(null)} onFocus={e => onHover(n, e.currentTarget)} onBlur={() => onHover(null)} />
  )
}

function Swatch({ level }: { level: Level }) {
  return <span className={`blk swatch lv${level}`} style={{ ['--fill' as string]: `${FILL[level]}%` }} aria-hidden="true" />
}

function Donut({ percent, assumed = percent, label = 'progress' }: { percent: number; assumed?: number; label?: string }) {
  const r = 46, c = 2 * Math.PI * r
  return (
    <svg viewBox="0 0 120 120" width="120" height="120" role="img" aria-label={`${percent} percent ${label}${assumed > percent ? `, ${assumed} percent if the skills you assumed are confirmed` : ''}`} className="donut">
      <circle cx="60" cy="60" r={r} fill="none" stroke="var(--chip)" strokeWidth="12" />
      {assumed > percent && <circle cx="60" cy="60" r={r} fill="none" stroke="var(--accent)" strokeOpacity="0.35" strokeWidth="12" strokeLinecap="butt" strokeDasharray={`${(c * assumed) / 100} ${c}`} transform="rotate(-90 60 60)" />}
      <circle cx="60" cy="60" r={r} fill="none" stroke="var(--accent)" strokeWidth="12" strokeLinecap="butt" strokeDasharray={`${(c * percent) / 100} ${c}`} transform="rotate(-90 60 60)" />
      <text x="60" y="58" textAnchor="middle" fontSize="26" fontWeight="700" fill="var(--text)">{percent}%</text>
      <text x="60" y="76" textAnchor="middle" fontSize="11" fill="var(--text-secondary)">{label}</text>
    </svg>
  )
}

function Legend() {
  return (
    <details className="legend small">
      <summary>How to read the blocks</summary>
      <ul className="plain">{([0, 1, 2, 3, 4] as Level[]).map(l => <li key={l}><Swatch level={l} /> <strong>{LEVEL_NAMES[l]}</strong> <span className="muted">{LEVEL_HELP[l]}</span></li>)}
        <li><span className="blk swatch" data-lesson="1" style={{ ['--fill' as string]: '0%' }} aria-hidden="true" /> A filled dot: you have finished this skill's lesson. A hollow dot: you have opened it but not finished.</li>
        <li><span className="blk swatch due" style={{ ['--fill' as string]: '75%' }} aria-hidden="true" /> A dashed edge: a refresher is due. <span className="blk swatch assumed" style={{ ['--fill' as string]: '50%' }} aria-hidden="true" /> Hatched: assumed from your placement or a warm-up, not yet shown.</li></ul>
    </details>
  )
}

export function Course() {
  const { content, attempts, progress, placement, ctx, missions, overall } = useMissionData()
  const [params, setParams] = useSearchParams()
  const view = params.get('mission') ?? 'all'
  const setView = (v: string) => { const p = new URLSearchParams(params); p.set('view', 'map'); if (v === 'all') p.delete('mission'); else p.set('mission', v); setParams(p, { replace: true }); setPicked(null); setWarmOpen(false); setWarmDone(null) }
  const [picked, setPicked] = useState<string | null>(null)
  const [leftOpen, setLeftOpen] = useState(() => { try { return localStorage.getItem('map:left') === '1' } catch { return true } })
  const [rightOpen, setRightOpen] = useState(() => { try { return localStorage.getItem('map:right') === '1' } catch { return true } })
  const toggleSide = (side: 'left' | 'right') => { const set = side === 'left' ? setLeftOpen : setRightOpen; set(v => { try { localStorage.setItem(`map:${side}`, v ? '0' : '1') } catch { /* optional */ } return !v }) }
  const [showBreakdown, setShowBreakdown] = useState(true)
  const [dismissed, setDismissed] = useState<string[]>([])
  const [lastChallenge, setLastChallenge] = useState<number | null>(null)
  const [run, setRun] = useState<{ plan: ChallengePlan; items: ChallengePlan['picks'][number]['items']; before: Record<string, Level> } | null>(null)
  const [result, setResult] = useState<{ node: NodeProgress; rights: number; before: Level; after: Level }[] | null>(null)
  const [warmOpen, setWarmOpen] = useState(false)
  const [bulk, setBulk] = useState<string[] | null>(null) // lessons changed by the last mark-all, so it can be undone
  const [hover, setHover] = useState<{ n: NodeProgress; x: number; y: number } | null>(null)
  const hoverNode = (n: NodeProgress | null, el?: HTMLElement) => { if (!n || !el) { setHover(null); return } const r = el.getBoundingClientRect(); setHover({ n, x: Math.min(r.left, window.innerWidth - 340), y: r.bottom + 6 }) }
  useEffect(() => { if (!picked) return; const k = (e: KeyboardEvent) => { if (e.key === 'Escape') setPicked(null) }; window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k) }, [picked])
  const [warmDone, setWarmDone] = useState<StrandWarmup | null>(null)

  useEffect(() => { void kvGet<string[]>('upnext:dismissed', []).then(setDismissed); void kvGet<number | null>('challenge:last', null).then(setLastChallenge) }, [])

  const isAll = view === 'all' || !missions.some(m => m.strand === view)
  const mission: Mission | undefined = isAll ? undefined : missions.find(m => m.strand === view)
  const current: Mission = mission ?? overall
  const node = picked ? overall.nodes.find(n => n.id === picked) : undefined
  const next = useMemo(() => (ctx && progress ? nextLessons(content, ctx.masteries, placement, progress, 3) : []), [ctx, progress, content, placement])
  const dismissedSet = useMemo(() => new Set(dismissed), [dismissed])
  const currentIds = useMemo(() => new Set(current.nodes.map(n => n.id)), [current])
  const dismissedHere = useMemo(() => dismissed.filter(id => currentIds.has(id)), [dismissed, currentIds])
  const upNext = useMemo(() => (ctx ? skillsUpNext(current, ctx, dismissedSet, isAll ? 8 : 6) : []), [ctx, current, dismissedSet, isAll])
  const plan = useMemo<ChallengePlan | null>(() => (ctx && attempts ? planChallenge(current.nodes, content.items, attempts, lastChallenge, Date.now(), challengeSeed(current.strand, lastChallenge)) : null), [ctx, attempts, current, content.items, lastChallenge])

  // The 12-hour gap is advice (spaced review works better), never a lock: the learner can always run a challenge now.
  const planNow = useMemo<ChallengePlan | null>(() => (ctx && attempts ? planChallenge(current.nodes, content.items, attempts, null, Date.now(), challengeSeed(current.strand, lastChallenge)) : null), [ctx, attempts, current, content.items, lastChallenge])
  if (!ctx || !attempts) return <main className="page"><p className="muted">Loading…</p></main>

  const tab = params.get('view')
  const showCourses = tab === 'courses'
  const showLessons = tab !== 'map' && !showCourses // the list of lessons is the default view; the map is the second
  const setTab = (v: string) => { const p = new URLSearchParams(params); if (v === 'lessons') p.delete('view'); else p.set('view', v); setParams(p, { replace: true }) }
  const tabs = (
    <div className="row filters" role="group" aria-label="Curriculum views">
      <button type="button" className={showLessons ? 'chip on' : 'chip'} aria-pressed={showLessons} onClick={() => setTab('lessons')}>All lessons</button>
      <button type="button" className={showCourses ? 'chip on' : 'chip'} aria-pressed={showCourses} onClick={() => setTab('courses')}>Courses</button>
      <button type="button" className={tab === 'map' ? 'chip on' : 'chip'} aria-pressed={tab === 'map'} onClick={() => setTab('map')}>Map</button>
    </div>
  )
  const otherView = showCourses ? <main className="page wide"><h1>Curriculum</h1>{tabs}<CoursesView /></main> : showLessons ? <main className="page wide"><h1>Curriculum</h1>{tabs}<LessonIndex /></main> : null // returned after every hook has run

  const pick = (id: string) => { setPicked(id); const m = missions.find(x => x.nodes.some(n => n.id === id)); if (m && isAll) { /* stay on the overview: the detail opens beside it */ } }

  function startChallenge() {
    const chosen = plan?.unlocked ? plan : planNow?.unlocked ? planNow : null
    if (!chosen) return
    const items = interleave(chosen.picks.map(p => p.items))
    setResult(null)
    setRun({ plan: chosen, items, before: Object.fromEntries(chosen.picks.map(p => [p.node.id, p.node.level])) })
  }
  async function finishChallenge(results: ItemResult[]) {
    if (!run || !ctx) return
    const now = Date.now()
    await kvSet('challenge:last', now); setLastChallenge(now)
    const ctx2 = { ...ctx, masteries: masteryMap(await db.attempts.toArray(), Date.now(), content.cuedOnly) }
    const rows = run.plan.picks.map(p => {
      const rights = run.items.reduce((s, it, k) => s + (splitSkillKey(it.skill).skill === p.node.id && results[k]?.correct ? 1 : 0), 0)
      return { node: p.node, rights, before: run.before[p.node.id] as Level, after: nodeProgress(content.skillById.get(p.node.id) as Skill, ctx2).level }
    })
    setResult(rows); setRun(null)
  }
  async function finishWarmup(r: StrandWarmup) {
    if (!mission) return
    if (r.conclusive !== false) {
      const cur = (await kvGet<Placement>('placement', placement))
      await kvSet('placement', { ...cur, byStrand: { ...(cur.byStrand ?? {}), [mission.strand]: r } })
    } // an inconclusive warm-up is shown but not saved: it must not replace what a placement assumed
    setWarmDone(r); setWarmOpen(false)
  }
  const markLesson = (id: string, steps: number, skipped: boolean) => db.lessonProgress.put({ lessonId: id, step: steps, done: true, ts: Date.now(), skipped })
  const resetLesson = (id: string) => db.lessonProgress.delete(id)
  const lessonIdsOf = (nodes: NodeProgress[]) => content.lessons.filter(l => nodes.some(n => n.id === l.skill || l.also?.includes(n.id)))
  async function markAll(nodes: NodeProgress[], skipped: boolean, label: string) {
    const ls = lessonIdsOf(nodes)
    if (!window.confirm(`${label} ${ls.length} lessons? You can undo this right after, or reset any lesson later.`)) return
    const changed: string[] = []
    for (const l of ls) if (!progress?.find(p => p.lessonId === l.id)?.done) { await markLesson(l.id, l.steps.length, skipped); changed.push(l.id) }
    setBulk(changed)
  }
  async function undoBulk() { for (const id of bulk ?? []) await resetLesson(id); setBulk(null) }
  const dismiss = async (id: string) => { const n = [...dismissed, id]; setDismissed(n); await kvSet('upnext:dismissed', n) }

  const lessonSeen = (id: string) => content.lessons.some(l => (l.skill === id || l.also?.includes(id)) && progress?.some(p => p.lessonId === l.id)) // a lesson opened, even if not finished
  const lessonsFor = (id: string) => content.lessons.filter(l => l.skill === id || l.also?.includes(id))
  const sk = node ? content.skillById.get(node.id) : undefined
  const warm = mission ? placement.byStrand?.[mission.strand] : undefined
  const busy = !!run || (warmOpen && !!mission)

  if (otherView) return otherView
  return (
    <main className="page wide mappage">
      <h1>Curriculum map</h1>
      {tabs}
      <p className="lede">Every skill is a block. A block fills as your evidence grows: seen, level one (the idea when it is named), level two (in positions where nobody names it), mastered (reliable at the deepest depth, and not due for a refresher). A dot in the corner means you have finished its lesson. Nothing is locked.</p>

      {!busy && (
        <p className="muted small">
          {!placement.done ? <>Not sure where to start? <Link to="/placement">Take the placement</Link> (it can be skipped), or open a section and take its warm-up.</>
            : placement.skipped ? <>You skipped the placement. If the early lessons feel easy, you can <Link to="/placement">take it now</Link>, or take a section's warm-up.</>
            : <>You took the placement on {new Date(placement.ts).toLocaleDateString()}. You can <Link to="/placement">take it again</Link>.</>}
        </p>
      )}

      {next.length > 0 && !busy && (
        <section className="card">
          <h2>Continue</h2>
          <ul className="plain">{next.slice(0, 2).map(l => <li key={l.id}><Link to={`/lesson/${l.id}`}><strong>{l.title}</strong></Link> <span className="muted small">· {content.skillById.get(l.skill)?.title ?? l.skill} · {lessonMinutes(l)} min</span></li>)}</ul>
        </section>
      )}


      <div className={`missiongrid mapgrid${leftOpen ? ' lo' : ''}${rightOpen ? ' ro' : ''}`} onKeyDown={e => { if (e.key === 'Escape') { setLeftOpen(false); setRightOpen(false) } }}>
        <button type="button" className="edgetab left" aria-expanded={leftOpen} onClick={() => toggleSide('left')}>{leftOpen ? '‹ Close' : 'Progress ›'}</button>
        <button type="button" className="edgetab right" aria-expanded={rightOpen} onClick={() => toggleSide('right')}>{rightOpen ? 'Close ›' : '‹ Challenge'}</button>
        {leftOpen && <section className="card missionpanel sidedrawer left" aria-label={`${current.name} progress`}>
        <div className="row filters" role="group" aria-label="Sections">
        <button type="button" className={isAll ? 'chip on' : 'chip'} aria-pressed={isAll} onClick={() => setView('all')}>All lessons · {overall.percent}%</button>
        {missions.map(m => <button key={m.strand} type="button" className={!isAll && view === m.strand ? 'chip on' : 'chip'} aria-pressed={!isAll && view === m.strand} onClick={() => setView(m.strand)}>{m.strand} {m.name} · {m.percent}%</button>)}
        </div>
        <button type="button" className="link" onClick={() => setParams(p => { const n = new URLSearchParams(p); n.set('view', 'lessons'); return n })}>Open the All lessons list</button>
          {!isAll && <button type="button" className="link" onClick={() => setView('all')}>‹ See all lessons</button>}
          <h2>{current.name}</h2>
          {(() => { const live = current.nodes.filter(n => !n.noExercises); return live.length > 0 && live.every(n => n.level === 4 && !n.due) ? (
            <div className="completebanner" role="status"><strong>✓ {isAll ? 'Curriculum' : 'Section'} complete.</strong> All {live.length} skills with exercises are Mastered and none is due for a refresher. Your certificate is on the Progress page.</div>) : null })()}
          <p className="small muted">{isAll ? 'OVERALL PROGRESS' : 'MISSION PROGRESS'}</p>
          <div className="donutrow">
            <Donut percent={current.percent} assumed={current.percentWithAssumed} label={isAll ? 'overall' : 'progress'} />
            <ul className="plain legendlist">
              {([4, 3, 2, 1, 0] as Level[]).map(l => <li key={l}><Swatch level={l} /> <strong>{current.counts[l]}</strong> {l === 4 ? 'mastered' : l === 0 ? 'not started' : LEVEL_NAMES[l].toLowerCase()}</li>)}
              {current.assumedCount > 0 && <li><span className="blk swatch assumed" style={{ ['--fill' as string]: '50%' }} aria-hidden="true" /> of these, <strong>{current.assumedCount}</strong> are only assumed (hatched), not yet shown</li>}
            </ul>
          </div>
          <p className="small muted">{isAll ? 'Overall' : 'Section'} progress is the average level of {isAll ? 'all' : 'the mission\'s'} {current.nodes.length} skills, counting only what you have shown (mastered counts 4 of 4, level two 3, level one 2, seen 1, not started 0).{current.percentWithAssumed > current.percent && ` The lighter part of the ring is what it would be if the ${current.assumedCount} skills assumed from your placement or warm-up were confirmed.`}{current.nodes.some(n => n.noExercises) && ` ${current.nodes.filter(n => n.noExercises).length} skills have no exercises yet and can reach Seen at most, so the ring cannot fill completely.`}</p>
          <button type="button" className="link" onClick={() => setShowBreakdown(s => !s)} aria-expanded={showBreakdown}>{showBreakdown ? 'Hide skill breakdown' : 'Show skill breakdown'}</button>
          {showBreakdown && isAll && missions.map(m => (
            <div key={m.strand} className="tierrow">
              <div className="small"><button type="button" className="link" onClick={() => setView(m.strand)}><strong>{m.strand} · {m.name}</strong></button> <span className="muted">{m.percent}% · {m.counts[4]} mastered of {m.nodes.length}</span></div>
              <div className="blocks">{m.nodes.map(n => <Block key={n.id} n={n} selected={picked === n.id} seen={lessonSeen(n.id)} onPick={pick} onHover={hoverNode} />)}</div>
            </div>
          ))}
          {showBreakdown && !isAll && current.tiers.map(t => (
            <div key={t.tier} className="tierrow">
              <div className="small"><strong>Tier {t.tier}</strong> <span className="muted">{t.gloss}</span></div>
              <div className="blocks">{t.nodes.map(n => <Block key={n.id} n={n} selected={picked === n.id} seen={lessonSeen(n.id)} onPick={pick} onHover={hoverNode} />)}</div>
            </div>
          ))}
          <p className="small"><button type="button" className="link" onClick={() => void markAll(current.nodes, false, `Mark every lesson in ${current.name} as finished:`)}>Mark all lessons here finished</button> · <button type="button" className="link" onClick={() => void markAll(current.nodes, true, `Skip every lesson in ${current.name}:`)}>Skip all lessons here</button>{bulk && bulk.length > 0 && <> · <button type="button" className="link" onClick={() => void undoBulk()}>Undo: reset the {bulk.length} lessons just changed</button></>}</p>
          <Legend />
        </section>}

        <div className="mapcenter"><RadialMap skills={content.skills} progress={new Map(overall.nodes.map(n => [n.id, n]))} picked={picked} onPick={pick} strandNames={STRAND_NAMES} /></div>

        {rightOpen && <div className="mapright sidedrawer right card">
          {warmOpen && mission ? (
            <section className="card challenge">
              <h2>Warm-up: {mission.name}</h2>
              <WarmupRun mission={mission} items={content.items} attempts={attempts} onFinish={r => void finishWarmup(r)} onCancel={() => setWarmOpen(false)} />
            </section>
          ) : run ? (
            <section className="card challenge">
              <h2>Mastery challenge</h2>
              <ItemSequence items={run.items} source="challenge" silent intro="Six questions on three skills, no hints" onComplete={r => void finishChallenge(r)} />
            </section>
          ) : (
            <>
              {mission && (
                <section className="card">
                  <h2>Warm-up: test out what you know</h2>
                  {warmDone || warm ? (() => { const w = warmDone ?? warm!; const shown = Object.entries(w.byTier).map(([t, b]) => `tier ${t}: ${b.ok} of ${b.n}`).join(', ')
                    const superseded = !warmDone && placement.done && !placement.skipped && placement.ts > w.ts // a newer placement replaced it (progress.ts frontierFor)
                    const assumedHere = mission.nodes.filter(n => n.levelWithAssumed > n.level).length
                    return (
                    <p role="status">Taken {new Date(w.ts).toLocaleDateString()} ({shown}).{' '}
                      {w.conclusive === false ? 'It was too short to vouch for any tier, so nothing was changed.'
                        : superseded ? `A newer placement (${new Date(placement.ts).toLocaleDateString()}) replaced this result.`
                        : assumedHere > 0 ? `${assumedHere} skills in tiers below ${w.frontierTier} show as assumed (hatched) until mixed practice and challenges confirm them. A wrong answer on something you had not practised at that level was not held against you.`
                        : 'Nothing in this section is assumed from it.'}</p>) })()
                    : <p>About ten unlabelled questions, easiest tier first, no hints. A wrong answer on something you have not practised at that level is not held against you (once you have practised it, every answer counts). It stops early if two tiers in a row go badly. If you do well, the early skills in this section show as assumed, and their lessons (except the tier just below the line) are left out of Continue; you can still open any lesson. Assumed skills are not counted as progress until you show them.</p>}
                  <div className="row"><button type="button" className={warm || warmDone ? '' : 'primary'} onClick={() => { setWarmDone(null); setWarmOpen(true) }}>{warm || warmDone ? 'Take it again' : 'Start the warm-up'}</button></div>
                </section>
              )}
              <section className="card challenge">
                <h2>Mastery challenge{isAll ? ' across every section' : ''}</h2>
                <p>Strengthen skills you have already practised: six unlabelled questions on three skills, two each, chosen because they are the most overdue. It includes at most one skill you have mastered, as a check that you still have it.</p>
                {plan?.unlocked ? <div className="row"><button type="button" className="primary" onClick={startChallenge}>Start</button><span className="muted small">{plan.picks.map(p => p.node.title).join(' · ')}</span></div> : <><p className="muted small">{plan?.reason}</p>{planNow?.unlocked && <div className="row"><button type="button" onClick={startChallenge}>Start anyway</button><span className="muted small">Nothing is locked; the wait is only advice.</span></div>}</>}
                <details><summary className="small">How a challenge changes your levels</summary>
                  <p className="small">Both questions right on a skill counts as evidence for it. Both wrong counts as evidence against it, and it comes back for review. One of each leaves it about where it was. A challenge has no hints, so every answer counts as it stands. Levels are read from all your evidence, so they can move more than one step when the evidence shifts. Misses in ordinary practice count too. Time away takes nothing off a level except one thing: a Mastered skill drops back when a refresher is due (after about three weeks), to Level two, or to Level one for a skill whose deepest exercises are the named or cued ones (D1), and it returns when you answer it again.</p></details>
              </section>
            </>
          )}

          {result && !busy && (
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

          {!busy && (
            <section className="card">
              <h2>Skills up next for you</h2>
              {upNext.length === 0 ? <p className="muted">No skill has all its prerequisites shown yet {isAll ? '' : 'in this section '}(nothing is locked: every lesson and exercise below is open to you now). The whole list is in the outline under the map.</p> : (
                <ul className="plain upnext">{upNext.map(n => {
                  const d = n.workingDepth ? content.skillById.get(n.id)?.depths[n.workingDepth] : undefined
                  return (
                    <li key={n.id}>
                      <div className="upnext-head"><button type="button" className="link" onClick={() => setPicked(n.id)}><strong>{n.title}</strong></button> <Swatch level={n.level} /> <span className="muted small">{n.levelWithAssumed > n.level ? `${LEVEL_NAMES[n.level]}, assumed up to ${LEVEL_NAMES[n.levelWithAssumed].toLowerCase()}` : LEVEL_NAMES[n.level]}{n.due ? ' · refresher due' : ''}{isAll ? ` · ${n.strand}` : ''}</span></div>
                      {d && <p className="small muted">{n.workingDepth}: {d.outcome}</p>}
                      <div className="row">
                        {lessonsFor(n.id).filter(() => !n.lessonDone).slice(0, 1).map(l => <Link key={l.id} className="button" to={`/lesson/${l.id}`} aria-label={`Lesson: ${n.title}`}>Lesson</Link>)}
                        {n.workingDepth && <Link className="button primary" to={`/practice?skill=${n.id}.${n.workingDepth}&go=1&n=6`} aria-label={`Practice: ${n.title}`}>Practice</Link>}
                        <button type="button" className="link" aria-label={`Remove ${n.title} from suggestions`} onClick={() => void dismiss(n.id)}>Remove</button>
                      </div>
                    </li>
                  )
                })}</ul>
              )}
              {dismissedHere.length > 0 && <button type="button" className="link small" onClick={async () => { const keep = dismissed.filter(id => !currentIds.has(id)); setDismissed(keep); await kvSet('upnext:dismissed', keep) }}>Show removed suggestions again ({dismissedHere.length})</button>}
            </section>
          )}

          {node && sk && !busy && (
            <section className="card skilldetail detaildrawer" role="dialog" aria-label={`${node.title} detail`}>
              <button type="button" className="closebtn" onClick={() => setPicked(null)}>Close ✕</button>
              <h2>{node.title}</h2>
              <p><span className="blk swatch inline" style={{ ['--fill' as string]: `${FILL[node.level]}%` }} aria-hidden="true" /> <strong>{LEVEL_NAMES[node.level]}</strong>{node.due ? ' · a refresher is due' : ''}{node.levelWithAssumed > node.level ? ` · assumed up to ${LEVEL_NAMES[node.levelWithAssumed].toLowerCase()} from your placement or warm-up, not yet shown` : ''}<br /><span className="small muted">{LEVEL_HELP[node.level]}</span></p>
              {node.noExercises && <p className="small muted">This skill has no exercises yet, so it can only reach Seen, by finishing its lesson.</p>}
              {node.cuedTop && <p className="small muted">The deepest exercises for this skill are ones that name or cue the idea, so Level two or Mastered here means reliable when the idea is named or cued.</p>}
              <div className="row">
                {lessonsFor(node.id).map(l => <Link key={l.id} className="button primary" to={`/lesson/${l.id}`}>Open lesson: {l.title}</Link>)}
              </div>
              {lessonsFor(node.id).map(l => { const pr = progress?.find(p => p.lessonId === l.id); return (
                <p key={l.id} className="small">{l.title}: {pr?.done ? (pr.skipped ? 'skipped' : 'finished') : pr && pr.step > 0 ? 'in progress' : 'not started'}{' '}
                  {!pr?.done && <><button type="button" className="link" onClick={() => void markLesson(l.id, l.steps.length, false)}>Mark finished</button> · <button type="button" className="link" onClick={() => void markLesson(l.id, l.steps.length, true)}>Skip</button></>}
                  {(pr?.done || (pr && pr.step > 0)) && <button type="button" className="link" onClick={() => void resetLesson(l.id)}>Reset</button>}</p>) })}
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
        </div>}
      </div>

      <section className="card outline" aria-label={`${current.name} outline`}>
        <h2>Outline: {current.name}</h2>
        <p className="small muted">Everything in {isAll ? 'the curriculum' : 'this section'}, in teaching order, with nothing hidden or locked. Open any lesson or practise any skill at any time.</p>
        {(isAll ? missions : [current]).map(m => (
          <div key={m.strand}>
            {isAll && <h3>{m.strand} · {m.name}</h3>}
            {m.tiers.map(t => (
              <div key={t.tier}>
                <h4>Tier {t.tier} <span className="muted small">{t.gloss}</span></h4>
                <ul className="plain outlinelist">{t.nodes.map(n => {
                  const d = n.workingDepth ? content.skillById.get(n.id)?.depths[n.workingDepth] : content.skillById.get(n.id)?.depths.D1
                  return (
                    <li key={n.id}>
                      <Swatch level={n.levelWithAssumed} /> <strong>{n.title}</strong> <span className="muted small">· {LEVEL_NAMES[n.level]}{n.levelWithAssumed > n.level ? ' (assumed)' : ''}{n.due ? ' · refresher due' : ''}</span>
                      {d && <span className="small"> {d.outcome}</span>}
                      {' '}{lessonsFor(n.id).map(l => { const pr = progress?.find(x => x.lessonId === l.id); return <Link key={l.id} className="small" to={`/lesson/${l.id}`}>{pr?.done ? (pr.skipped ? '» skipped' : '✓ seen') : pr && pr.step > 0 ? '◐ started' : '○ not seen'} · Lesson: {l.title}</Link> })}
                      {n.workingDepth && <> <Link className="small" to={`/practice?skill=${n.id}.${n.workingDepth}&go=1&n=6`}>Practise</Link></>}
                      {!n.hasLesson && n.noExercises && <span className="muted small"> (nothing written yet)</span>}
                    </li>)
                })}</ul>
              </div>
            ))}
          </div>
        ))}
      </section>
      {hover && !picked && (() => { const d = content.skillById.get(hover.n.id)?.depths[hover.n.workingDepth ?? 'D1']; const ls = lessonsFor(hover.n.id); return (
        <div className="blocktip" role="tooltip" style={{ left: hover.x, top: hover.y }}>
          <strong>{hover.n.title}</strong>
          <div className="small">{LEVEL_NAMES[hover.n.level]}{hover.n.levelWithAssumed > hover.n.level ? ` (assumed up to ${LEVEL_NAMES[hover.n.levelWithAssumed].toLowerCase()})` : ''}{hover.n.due ? ' · refresher due' : ''} · {hover.n.strand}</div>
          {d && <div className="small muted">{d.outcome}</div>}
          <div className="small">{ls.length === 0 ? 'No lesson yet' : ls.map(l => { const pr = progress?.find(x => x.lessonId === l.id); return `${pr?.done ? '✓' : pr && pr.step > 0 ? '◐' : '○'} ${l.title}` }).join(' · ')}</div>
          <div className="small muted">Click for details</div>
        </div>) })()}
    </main>
  )
}
