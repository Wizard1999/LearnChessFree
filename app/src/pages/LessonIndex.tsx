import { hueOfStage, hueOfStrand } from '../lib/hue'
import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { db } from '../db'
import { saveFinished, resetProgress } from '../lib/lessonSave'
import { finishedEarlierVersion } from '../lib/resume'
import { useContent } from '../lib/content'
import { useCoreLessons } from '../lib/coreLessons'
import type { LessonMeta } from '../types'
import { lessonSort, masteryMap, useAttempts, useLessonProgress } from '../lib/progress'
import { stageProgress } from '../lib/stageProgress'
import { Donut, Swatch } from '../components/MissionParts'
import { MissionPanel } from '../components/MissionPanel'
import { PlayNudge } from '../components/PlayNudge'
import { Tooltip } from '../components/Tooltip'
import { useMissionData } from '../lib/useMissions'
import { useMasteryChallenge } from '../components/MasteryChallenge'
import { LEVEL_NAMES, STRAND_NAMES, summarize, type Level } from '../lib/missions'
import { PATH_STAGES, stageLabel } from '../lib/pathStages'
import { FirstGameInvite } from '../components/FirstGameInvite'
import { inviteSlot } from '../lib/firstGame'
import { Button } from '../components/Button'
import { SectionHead, useOpenSections } from '../components/Disclosure'
import { useNextCoreLesson } from '../lib/useNextCoreLesson'
import { UpNextMark } from '../components/UpNextMark'

/** A list row; the up next row carries the shared persimmon mark (UpNextMark). */
function UpNextOrLi({ up, skillId, className, id, children }: { up: boolean; skillId: string; className: string; id: string; children: React.ReactNode }) {
  return up ? <UpNextMark as="li" skillId={skillId} className={className} id={id} tabIndex={-1}>{children}</UpNextMark> : <li className={className} id={id} tabIndex={-1}>{children}</li>
}

type Filter = 'all' | 'todo' | 'started' | 'done'
type View = 'path' | 'section'

import { aboutMinutes, lessonMinutes } from '../lib/lessonTime'
const mins = (l: LessonMeta) => lessonMinutes(l)
const fmt = aboutMinutes

/** Every lesson on one page: find it, open it, or mark it finished, skipped or unstarted. Nothing is locked. */
export function LessonIndex({ picked, onPick }: { picked?: string | null; onPick?: (id: string) => void } = {}) {
  const content = useContent()
  const coreLessons = useCoreLessons()
  const progress = useLessonProgress()
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [strandSel, setStrandSel] = useState('')
  const [stageSel, setStageSel] = useState('')
  const [view, setView] = useState<View>('path') // the recommended path mixes the sections by stage; the section view is the reference library
  const nextCore = useNextCoreLesson()
  const challenge = useMasteryChallenge()
  const attempts = useAttempts()
  const md = useMissionData()
  const stages = useMemo(() => stageProgress(coreLessons, progress ?? [], masteryMap(attempts ?? [], Date.now(), content.cuedOnly)), [coreLessons, content.cuedOnly, progress, attempts])
  const open = useOpenSections('lessonlist:open')
  const [flash, setFlash] = useState<string | null>(null)
  const [target, setTarget] = useState<{ id: string; n: number } | null>(null)
  const handled = useRef(0)
  /** Scrolls to the next lesson's row (clearing any filter that hides it), highlights it, and moves keyboard focus there so Enter opens it. */
  const goNext = () => {
    if (!nextCore) return
    if (q || strandSel || stageSel || filter !== 'all') { setQ(''); setStrandSel(''); setStageSel(''); setFilter('all') }
    const g = view === 'path' ? nextCore.stage : content.skillById.get(nextCore.skill)?.strand
    if (g) open.setOpen(`${view}:${g}`, true)
    setTarget({ id: nextCore.id, n: Date.now() })
  }
  useEffect(() => {
    if (!target || handled.current === target.n) return
    const el = document.getElementById(`lessonrow-${target.id}`)
    if (!el) return // the filters are being cleared; this runs again once the row exists
    handled.current = target.n
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true
    el.scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' })
    el.focus({ preventScroll: true })
    setFlash(target.id)
    if (reduce) return // reduced motion: the highlight stays until the learner moves on
    const t = window.setTimeout(() => setFlash(null), 4000)
    return () => window.clearTimeout(t)
  }, [target, q, strandSel, stageSel, filter, view])
  const byId = useMemo(() => new Map((progress ?? []).map(p => [p.lessonId, p])), [progress])
  const groups = useMemo(() => {
    const sorted = [...coreLessons].sort((a, b) => lessonSort(a, b, content.skillById))
    const m = new Map<string, typeof sorted>()
    for (const l of sorted) {
      const sk = content.skillById.get(l.skill)
      const text = `${l.title} ${sk?.title ?? ''} ${l.skill}`.toLowerCase()
      const done = byId.get(l.id)?.done
      if (q && !text.includes(q.toLowerCase())) continue
      if (filter === 'done' && !done) continue
      if (filter === 'todo' && done) continue
      if (filter === 'started' && (done || !((byId.get(l.id)?.step ?? 0) > 0))) continue
      if (strandSel && sk?.strand !== strandSel) continue
      if (stageSel && l.stage !== stageSel) continue
      const strand = view === 'path' ? l.stage ?? '?' : sk?.strand ?? '?'
      m.set(strand, [...(m.get(strand) ?? []), l])
    }
    return [...m.entries()].sort((a, b) => Number(a[0].slice(1)) - Number(b[0].slice(1)))
  }, [content, byId, q, filter, strandSel, stageSel, view])
  // Up next: in the recommended path the first unfinished lesson in path order; by subject, the first unfinished lesson of each subject. Filters and search never move it.
  const upNextIds = useMemo(() => {
    const sorted = [...coreLessons].sort((a, b) => lessonSort(a, b, content.skillById))
    const first = new Map<string, string>()
    for (const l of sorted) {
      if (byId.get(l.id)?.done) continue
      const key = view === 'path' ? l.stage ?? '?' : content.skillById.get(l.skill)?.strand ?? '?'
      if (!first.has(key)) first.set(key, l.id)
    }
    if (view === 'path') { const ks = [...first.keys()].sort((a, b) => Number(a.slice(1)) - Number(b.slice(1))); return new Set(ks.length ? [first.get(ks[0])!] : []) }
    return new Set(first.values())
  }, [content, byId, view])
  const strandIds = useMemo(() => [...new Set(content.skills.map(k => k.strand))].sort((a, b) => Number(a.slice(1)) - Number(b.slice(1))), [content.skills])
  const groupOf = (l: LessonMeta) => (view === 'path' ? l.stage : content.skillById.get(l.skill)?.strand)
  const doneCount = coreLessons.filter(l => byId.get(l.id)?.done).length
  const totalMin = coreLessons.reduce((t, l) => t + mins(l), 0)
  const doneMin = coreLessons.filter(l => byId.get(l.id)?.done).reduce((t, l) => t + mins(l), 0)
  const mark = (l: LessonMeta, skipped: boolean) => saveFinished(db.lessonProgress, l, skipped)
  const reset = (id: string) => resetProgress(db.lessonProgress, id)

  const filtersActive = !!(q || strandSel || stageSel || filter !== 'all')
  // the section holding the learner's current place: the Next lesson's, else the lesson last worked on, else the first
  const lastWorked = useMemo(() => [...(progress ?? [])].sort((a, b) => (b.ts ?? 0) - (a.ts ?? 0))[0], [progress])
  const homeLesson = nextCore ?? (lastWorked ? content.lessonById.get(lastWorked.lessonId) : undefined)
  const homeKey = (homeLesson ? groupOf(homeLesson) : undefined) ?? groups[0]?.[0]
  const sk = (strand: string) => `${view}:${strand}`
  const isOpen = (strand: string) => open.isOpen(sk(strand), filtersActive || strand === homeKey)
  // searching or filtering opens every section that has a match (an earlier Collapse all must not hide the answer)
  const matchKeys = groups.map(g => sk(g[0])).join('|')
  useEffect(() => { if (filtersActive) open.setMany(matchKeys.split('|'), true) }, [filtersActive, q, strandSel, stageSel, filter, matchKeys]) // eslint-disable-line react-hooks/exhaustive-deps
  const setOpenKey = (strand: string, v: boolean) => open.setOpen(sk(strand), v)
  // Mission progress (D76): the Khan-style view of the Map's old side panel, per section. A stage's skills are those of its lessons; a subject is a mission.
  const overallSum = summarize(md.overall.nodes)
  const mapOpen = open.isOpen('skillmap', false)
  const explain = `Overall progress is the average level of all ${overallSum.n} skills, counting only what you have shown (Mastered counts 4 of 4, Level two 3, Level one 2, Seen 1). ${view === 'path' ? 'Stages mix the subjects: each stage ends with something you can do in a real game.' : 'The subject sections are a reference library. Take the recommended path (Stage 1 to Stage 8) to learn in order.'}`
  const mission = md.ctx && md.overall.nodes.length > 0 ? (
    <div className="donutrow overallmission">
      <Donut size={150} percent={overallSum.percent} assumed={overallSum.percentWithAssumed} label="overall" />
      <ul className="plain legendlist" aria-label="Skills by level">
        {([4, 3, 2, 1, 0] as Level[]).map(l => <li key={l}><Swatch level={l} /> <strong>{overallSum.counts[l]}</strong> {l === 4 ? 'mastered' : l === 0 ? 'not started' : LEVEL_NAMES[l].toLowerCase()}</li>)}
        {overallSum.assumedCount > 0 && <li title="Credited from a placement or warm-up, not yet shown in practice"><span className="blk swatch assumed" style={{ ['--fill' as string]: '50%' }} aria-hidden="true" /> of these, <strong>{overallSum.assumedCount}</strong> are only assumed (hatched)</li>}
      </ul>
    </div>
  ) : null
  return (
    <section aria-label="Lesson index">
      <div className="card overallbar">
        <div className="overallinfo">
          <h2 className="overalltitle">Core curriculum <Tooltip label={explain}><button type="button" className="infobtn" aria-label={explain}>?</button></Tooltip></h2>
          <p className="small muted overallmeta"><progress value={doneCount} max={coreLessons.length || 1} aria-label={`${doneCount} of ${coreLessons.length} lessons finished`} /><span>{doneCount} of {coreLessons.length} lessons ({Math.round((100 * doneCount) / (coreLessons.length || 1))}%) · {fmt(Math.max(0, totalMin - doneMin))} left</span></p>
          <p className="small corenote">{overallSum.complete
            ? <><strong>Core complete.</strong> Every core skill with exercises is Mastered. </>
            : <><strong>Core complete</strong> means all {overallSum.liveCount} core skills with exercises are Mastered ({overallSum.counts[4]} so far; each needs success on two separate days). </>}
            Looking for something different? <Link to="/course?view=courses">Electives</Link> are bonus chess: history, famous games and more.</p>
        </div>
        {mission}
        <div className="nextcta">
          {nextCore && <div className="cta"><Button variant="primary" icon="next" className="nextbtn" tip="Forward: scroll to the next lesson on your route" onClick={goNext}>Next lesson</Button><span className="small muted ctasub">{nextCore.title}, {aboutMinutes(lessonMinutes(nextCore))}</span></div>}
          <div className="cta">{challenge.button}<span className="small muted ctasub">Back: review what you have seen</span></div>
        </div>
        <PlayNudge compact />
        <div className="overallmore">
          <Button variant="quiet" icon="chevron" className="mapbtn" aria-expanded={mapOpen} aria-controls="mission-panel" tip="Every skill as a small block that fills as you learn it, by subject, with warm-ups to test out" onClick={() => open.setOpen('skillmap', !mapOpen)}>{mapOpen ? 'Hide skills by section' : 'Show skills by section'}</Button>
          {mapOpen && md.ctx && <MissionPanel data={md} picked={picked} onPick={onPick} />}
        </div>
      </div>
      {challenge.panel}
      <div className="lede">Nothing is locked: open any lesson, in any order. <details className="inlinenote"><summary>How this list works</summary>The recommended path mixes the subjects so you can play a full game early and meet each idea when you need it; "By subject" groups the same lessons for looking things up. Marking a lesson finished or skipped only changes this list and the map; it is not evidence that you know the skill.</details></div>
      <div className="toolbar listbar" role="group" aria-label="List controls">
        <div className="seg" role="group" aria-label="Group lessons by">
          {(['path', 'section'] as View[]).map(v => <button key={v} type="button" aria-pressed={view === v} onClick={() => setView(v)}>{v === 'path' ? 'Grouped by stage' : 'Grouped by subject'}</button>)}
        </div>
        <input className="listsearch" type="search" value={q} onChange={e => setQ(e.target.value)} placeholder="Search lessons" aria-label="Search lessons by title" />
        <select className="listselect" value={strandSel} onChange={e => setStrandSel(e.target.value)} aria-label="Filter by subject"><option value="">Every subject</option>{strandIds.map(id => <option key={id} value={id}>{STRAND_NAMES[id] ?? id}</option>)}</select>
        <select className="listselect stagesel" value={stageSel} onChange={e => setStageSel(e.target.value)} aria-label="Filter by stage"><option value="">Every stage</option>{PATH_STAGES.map(st => <option key={st.id} value={st.id}>{stageLabel(st.id)}: {st.title}</option>)}</select>
        <div className="seg" role="group" aria-label="Filter by status">
          {(['all', 'todo', 'started', 'done'] as Filter[]).map(f => <button key={f} type="button" aria-pressed={filter === f} onClick={() => setFilter(f)}>{f === 'all' ? 'All' : f === 'todo' ? 'To do' : f === 'started' ? 'In progress' : 'Finished or skipped'}</button>)}
        </div>
        {filtersActive && <button type="button" className="btn btn-quiet" onClick={() => { setQ(''); setStrandSel(''); setStageSel(''); setFilter('all') }}>Clear filters</button>}
      </div>
      {groups.length === 0 && <p className="muted">No lessons match.</p>}
      {groups.map(([strand, ls], gi) => (
        <Fragment key={strand}>
        {view === 'path' && gi === inviteSlot(groups.map(g => g[0])) && <FirstGameInvite />}
        <div className="card" data-hue={view === 'path' ? hueOfStage(Math.max(1, PATH_STAGES.findIndex(x => x.id === strand) + 1)) : hueOfStrand(strand)}>
          {(() => { const all = coreLessons.filter(l => groupOf(l) === strand); const t = all.reduce((x, l) => x + mins(l), 0); const d = all.filter(l => byId.get(l.id)?.done).length; const open = isOpen(strand); const name = view === 'path' ? `${stageLabel(strand)}: ${PATH_STAGES.find(x => x.id === strand)?.title ?? strand}` : (STRAND_NAMES[strand] ?? strand); return (
            <SectionHead id={`sec-${view}-${strand}`} open={open} onToggle={() => setOpenKey(strand, !open)} name={name} done={d} total={all.length} emblem={strand}
              badge={view === 'path' && stages.find(x => x.id === strand)?.current ? <span className="badge here">You are here</span> : undefined}
              right={<span className="muted small" title="Total length of every lesson in this section">{all.length} lessons · {fmt(t)}</span>} />) })()}
          {view === 'path' && PATH_STAGES.find(x => x.id === strand)?.milestone && <p className="stagesub">{PATH_STAGES.find(x => x.id === strand)?.milestone}</p>}
          {(() => { const all = coreLessons.filter(l => groupOf(l) === strand); const d = all.filter(l => byId.get(l.id)?.done).length; return (
            <p className="small muted"><progress value={d} max={all.length || 1} aria-label={`${d} of ${all.length} lessons finished`} /> {d} of {all.length} finished or skipped{view === 'path' && (() => { const st = stages.find(x => x.id === strand); return st ? <> · Shown in exercises: <strong>{st.shown} of {st.skills}</strong> skills</> : null })()}</p>) })()}
          {isOpen(strand) && <ul className="plain lessonindex" id={`sec-${view}-${strand}`}>
            {ls.map(l => {
              const p = byId.get(l.id)
              const earlier = finishedEarlierVersion(p, l)
              const status = p?.done ? (p.skipped ? 'Skipped' : earlier ? 'Finished (earlier version)' : 'Finished') : p && p.step > 0 ? `In progress (step ${p.step + 1} of ${l.stepCount})` : 'Not started'
              return (
                <UpNextOrLi key={l.id} id={`lessonrow-${l.id}`} up={upNextIds.has(l.id)} skillId={l.skill} className={`row lessonrow ${flash === l.id ? 'flash ' : ''}${p?.done ? (p.skipped ? 'skipped' : 'finished') : p && p.step > 0 ? 'inprogress' : 'todo'}`}>
                  <span className="statusmark" aria-hidden="true">{p?.done ? (p.skipped ? '»' : '✓') : p && p.step > 0 ? '◐' : '○'}</span>
                  <Link className={p?.done ? 'button' : p && p.step > 0 ? 'button primary' : 'button'} to={`/lesson/${l.id}`} aria-label={`Open lesson: ${l.title}`}>{earlier ? 'Review the new version' : p?.done ? 'Review' : p && p.step > 0 ? 'Continue' : 'Open'}</Link>
                  <span>{nextCore?.id === l.id && <span className="nextlabel">Next</span>}<strong>{l.title}</strong> <span className="muted small">· {content.skillById.get(l.skill)?.title ?? l.skill} · {aboutMinutes(lessonMinutes(l))} · {status}</span></span>
                  <span className="actions">
                    {!p?.done && <><button type="button" className="btn btn-quiet" aria-label={`Mark finished: ${l.title}`} onClick={() => void mark(l, false)}>Mark finished</button> <button type="button" className="btn btn-quiet" aria-label={`Skip: ${l.title}`} onClick={() => void mark(l, true)}>Skip</button></>}
                    {(p?.done || (p && p.step > 0)) && <button type="button" className="btn btn-quiet btn-danger" aria-label={`Reset progress: ${l.title}`} onClick={() => void reset(l.id)}>Reset</button>}
                  </span>
                </UpNextOrLi>
              )
            })}
          </ul>}
        </div>
        </Fragment>
      ))}
      {view === 'path' && groups.length > 0 && inviteSlot(groups.map(g => g[0])) === groups.length && <FirstGameInvite />}
    </section>
  )
}
