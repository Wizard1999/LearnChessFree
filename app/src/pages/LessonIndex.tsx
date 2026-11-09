import { hueOfStage, hueOfStrand } from '../lib/hue'
import { ArtEmblem } from '../components/art'
import { Fragment, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { db } from '../db'
import { saveFinished, resetProgress } from '../lib/lessonSave'
import { finishedEarlierVersion } from '../lib/resume'
import { useContent } from '../lib/content'
import type { LessonMeta } from '../types'
import { lessonSort, useLessonProgress } from '../lib/progress'
import { STRAND_NAMES } from '../lib/missions'
import { PATH_STAGES, stageLabel } from '../lib/pathStages'
import { FirstGameInvite } from '../components/FirstGameInvite'
import { inviteSlot } from '../lib/firstGame'
import { UpNextMark } from '../components/UpNextMark'

/** A list row; the up next row carries the shared persimmon mark (UpNextMark). */
function UpNextOrLi({ up, skillId, className, children }: { up: boolean; skillId: string; className: string; children: React.ReactNode }) {
  return up ? <UpNextMark as="li" skillId={skillId} className={className}>{children}</UpNextMark> : <li className={className}>{children}</li>
}

type Filter = 'all' | 'todo' | 'started' | 'done'
type View = 'path' | 'section'

import { aboutMinutes, lessonMinutes } from '../lib/lessonTime'
const mins = (l: LessonMeta) => lessonMinutes(l)
const fmt = aboutMinutes

/** Every lesson on one page: find it, open it, or mark it finished, skipped or unstarted. Nothing is locked. */
export function LessonIndex() {
  const content = useContent()
  const progress = useLessonProgress()
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [strandSel, setStrandSel] = useState('')
  const [stageSel, setStageSel] = useState('')
  const [view, setView] = useState<View>('path') // the recommended path mixes the sections by stage; the section view is the reference library
  const byId = useMemo(() => new Map((progress ?? []).map(p => [p.lessonId, p])), [progress])
  const groups = useMemo(() => {
    const sorted = [...content.lessons].sort((a, b) => lessonSort(a, b, content.skillById))
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
    const sorted = [...content.lessons].sort((a, b) => lessonSort(a, b, content.skillById))
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
  const doneCount = content.lessons.filter(l => byId.get(l.id)?.done).length
  const totalMin = content.lessons.reduce((t, l) => t + mins(l), 0)
  const doneMin = content.lessons.filter(l => byId.get(l.id)?.done).reduce((t, l) => t + mins(l), 0)
  const mark = (l: LessonMeta, skipped: boolean) => saveFinished(db.lessonProgress, l, skipped)
  const reset = (id: string) => resetProgress(db.lessonProgress, id)

  return (
    <section aria-label="Lesson index">
      <div className="card overallbar">
        <div className="sectionhead"><strong>Whole curriculum</strong><span className="muted small">{fmt(totalMin)} of lessons in all · {fmt(Math.max(0, totalMin - doneMin))} left</span></div>
        <p className="small muted"><progress value={doneCount} max={content.lessons.length || 1} aria-label={`${doneCount} of ${content.lessons.length} lessons finished`} /> {doneCount} of {content.lessons.length} lessons finished or skipped ({Math.round((100 * doneCount) / (content.lessons.length || 1))}%)</p>
        <p className="small muted">{view === 'path' ? 'Stages mix the subjects: each stage ends with something you can do in a real game.' : 'The subject sections are a reference library. Take the recommended path (Stage 1 to Stage 8) to learn in order.'}</p>
      </div>
      <div className="lede">Nothing is locked: open any lesson, in any order. <details className="inlinenote"><summary>How this list works</summary>The recommended path mixes the subjects so you can play a full game early and meet each idea when you need it; "By subject" groups the same lessons for looking things up. Marking a lesson finished or skipped only changes this list and the map; it is not evidence that you know the skill.</details></div>
      <div className="row filters">
        {(['path', 'section'] as View[]).map(v => <button key={v} type="button" className={view === v ? 'chip on' : 'chip'} aria-pressed={view === v} onClick={() => setView(v)}>{v === 'path' ? 'Grouped by stage' : 'Grouped by subject'}</button>)}
        <input type="search" value={q} onChange={e => setQ(e.target.value)} placeholder="Search lessons" aria-label="Search lessons by title" />
        <select value={strandSel} onChange={e => setStrandSel(e.target.value)} aria-label="Filter by subject"><option value="">Every subject</option>{strandIds.map(id => <option key={id} value={id}>{STRAND_NAMES[id] ?? id}</option>)}</select>
        <select value={stageSel} onChange={e => setStageSel(e.target.value)} aria-label="Filter by stage"><option value="">Every stage</option>{PATH_STAGES.map(st => <option key={st.id} value={st.id}>{stageLabel(st.id)}: {st.title}</option>)}</select>
      </div>
      <div className="row filters" role="group" aria-label="Filter by status">
        {(['all', 'todo', 'started', 'done'] as Filter[]).map(f => <button key={f} type="button" className={filter === f ? 'chip on' : 'chip'} aria-pressed={filter === f} onClick={() => setFilter(f)}>{f === 'all' ? 'All' : f === 'todo' ? 'To do' : f === 'started' ? 'In progress' : 'Finished or skipped'}</button>)}
        {(q || strandSel || stageSel || filter !== 'all') && <button type="button" className="link" onClick={() => { setQ(''); setStrandSel(''); setStageSel(''); setFilter('all') }}>Clear filters</button>}
      </div>
      {groups.length === 0 && <p className="muted">No lessons match.</p>}
      {groups.map(([strand, ls], gi) => (
        <Fragment key={strand}>
        {view === 'path' && gi === inviteSlot(groups.map(g => g[0])) && <FirstGameInvite />}
        <div className="card" data-hue={view === 'path' ? hueOfStage(Math.max(1, PATH_STAGES.findIndex(x => x.id === strand) + 1)) : hueOfStrand(strand)}>
          {(() => { const all = content.lessons.filter(l => groupOf(l) === strand); const t = all.reduce((x, l) => x + mins(l), 0); return (
            <div className="sectionhead"><h2><ArtEmblem seed={strand} />{view === 'path' ? `${stageLabel(strand)} · ${PATH_STAGES.find(x => x.id === strand)?.title ?? strand}` : (STRAND_NAMES[strand] ?? strand)}</h2><span className="muted small" title="Total length of every lesson in this section">{all.length} lessons · {fmt(t)}</span></div>) })()}
          {view === 'path' && PATH_STAGES.find(x => x.id === strand)?.milestone && <p className="stagesub">{PATH_STAGES.find(x => x.id === strand)?.milestone}</p>}
          {(() => { const all = content.lessons.filter(l => groupOf(l) === strand); const d = all.filter(l => byId.get(l.id)?.done).length; return (
            <p className="small muted"><progress value={d} max={all.length || 1} aria-label={`${d} of ${all.length} lessons finished`} /> {d} of {all.length} finished or skipped</p>) })()}
          <ul className="plain lessonindex">
            {ls.map(l => {
              const p = byId.get(l.id)
              const earlier = finishedEarlierVersion(p, l)
              const status = p?.done ? (p.skipped ? 'Skipped' : earlier ? 'Finished (earlier version)' : 'Finished') : p && p.step > 0 ? `In progress (step ${p.step + 1} of ${l.stepCount})` : 'Not started'
              return (
                <UpNextOrLi key={l.id} up={upNextIds.has(l.id)} skillId={l.skill} className={`row lessonrow ${p?.done ? (p.skipped ? 'skipped' : 'finished') : p && p.step > 0 ? 'inprogress' : 'todo'}`}>
                  <span className="statusmark" aria-hidden="true">{p?.done ? (p.skipped ? '»' : '✓') : p && p.step > 0 ? '◐' : '○'}</span>
                  <Link className={p?.done ? 'button' : p && p.step > 0 ? 'button primary' : 'button'} to={`/lesson/${l.id}`} aria-label={`Open lesson: ${l.title}`}>{earlier ? 'Review the new version' : p?.done ? 'Review' : p && p.step > 0 ? 'Continue' : 'Open'}</Link>
                  <span><strong>{l.title}</strong> <span className="muted small">· {content.skillById.get(l.skill)?.title ?? l.skill} · {aboutMinutes(lessonMinutes(l))} · {status}</span></span>
                  <span className="actions">
                    {!p?.done && <><button type="button" className="link" aria-label={`Mark finished: ${l.title}`} onClick={() => void mark(l, false)}>Mark finished</button> <button type="button" className="link" aria-label={`Skip: ${l.title}`} onClick={() => void mark(l, true)}>Skip</button></>}
                    {(p?.done || (p && p.step > 0)) && <button type="button" className="link" aria-label={`Reset progress: ${l.title}`} onClick={() => void reset(l.id)}>Reset</button>}
                  </span>
                </UpNextOrLi>
              )
            })}
          </ul>
        </div>
        </Fragment>
      ))}
      {view === 'path' && groups.length > 0 && inviteSlot(groups.map(g => g[0])) === groups.length && <FirstGameInvite />}
    </section>
  )
}
