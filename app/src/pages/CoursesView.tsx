import { hueOfStage } from '../lib/hue'
import { useEffect, useState } from 'react'
import { SectionHead, useOpenSections } from '../components/Disclosure'
import { aboutMinutes, lessonMinutes } from '../lib/lessonTime'
import { RelevantSkillsView, levelsOf } from '../components/RelevantSkills'
import { courseFacts, plannedCourses, withoutTypedCount, type PlannedCourse } from '../lib/displayText'
import { Link } from 'react-router-dom'
import { useContent, useCoursesStatus } from '../lib/content'
import { useMissionData } from '../lib/useMissions'
import { useLessonProgress } from '../lib/progress'
import { UpNextMark } from '../components/UpNextMark'

/** Courses promised but possibly not written yet. The list shown is whatever of these has no course in the courses file (plannedCourses). */
const PROMISED: PlannedCourse[] = [
  { id: 'famous-games', title: 'Famous games, annotated', note: 'Each game shows one idea deciding a real position; you predict the key moves first.' },
  { id: 'opening-deep-dives', title: 'Opening deep dives', note: 'One course per system: main line, traps, refutations of bad tries, typical plans.' },
  { id: 'history-and-meta', title: 'History and the opening meta', note: 'How ideas and popular openings changed, and why.' },
  { id: 'playstyles', title: 'Playstyles of great players', note: 'Only what the games measurably show.' },
  { id: 'advanced-club', title: 'Advanced club courses', note: 'Technique topics for stronger players.' },
]

/** Optional paths on top of the core curriculum. A course lesson is an ordinary lesson (it also appears under All lessons). */
export function CoursesView() {
  const content = useContent()
  const courses = useCoursesStatus()
  const levels = levelsOf(useMissionData().missions)
  const progress = useLessonProgress()
  const planned = plannedCourses(PROMISED, content.courses)
  const done = new Set((progress ?? []).filter(p => p.done).map(p => p.lessonId))
  const unfinished = (c: (typeof content.courses)[number]) => c.lessons.filter(id => content.lessonById.has(id) && !done.has(id))
  // The course to continue: one already started, else the first with lessons left. Its first unfinished lesson is the next one.
  const started = content.courses.find(c => unfinished(c).length > 0 && unfinished(c).length < c.lessons.length)
  const upCourse = (started ?? content.courses.find(c => unfinished(c).length > 0))?.id
  const [q, setQ] = useState('')
  const open = useOpenSections('electives:open')
  const needle = q.trim().toLowerCase()
  const shown = content.courses.filter(c => !needle || `${c.title} ${c.summary} ${c.family} ${c.lessons.map(id => content.lessonById.get(id)?.title ?? '').join(' ')}`.toLowerCase().includes(needle))
  // only the course holding the learner's place (else the first) starts open; a search opens every match
  // searching opens every section that matches (an earlier Collapse all must not hide the answer)
  const shownIds = shown.map(c => c.id).join('|')
  useEffect(() => { if (needle) open.setMany(shownIds.split('|'), true) }, [needle, shownIds]) // eslint-disable-line react-hooks/exhaustive-deps -- open's setters are stable in effect
  const homeId = upCourse ?? content.courses[0]?.id
  const isOpen = (id: string) => open.isOpen(id, !!needle || id === homeId)
  return (
    <section aria-label="Courses">
      <p className="lede">Bonus chess for the curious: history, famous players, iconic games and more. Not part of the core, so nothing here affects your progress. Dip in any time; each lesson says which core skills it uses.</p>
      {content.courses.length > 0 && (
        <div className="toolbar listbar" role="group" aria-label="Electives controls">
          <input className="listsearch" type="search" value={q} onChange={e => setQ(e.target.value)} placeholder="Search electives" aria-label="Search electives" />
          {needle && <button type="button" className="btn btn-quiet" onClick={() => setQ('')}>Clear filters</button>}
        </div>
      )}
      {needle && shown.length === 0 && <p className="muted">No elective matches.</p>}
      {content.courses.map((c, ci) => {
        if (!shown.includes(c)) return null
        const ls = c.lessons.map(id => content.lessonById.get(id)).filter((l): l is NonNullable<typeof l> => !!l)
        const d = ls.filter(l => done.has(l.id)).length
        const nextLesson = c.id === upCourse ? unfinished(c)[0] : undefined
        const inner = (
          <>
            <SectionHead id={`course-${c.id}`} open={isOpen(c.id)} onToggle={() => open.setOpen(c.id, !isOpen(c.id))} name={c.title} done={d} total={ls.length} emblem={c.id} />
            {isOpen(c.id) && <div id={`course-${c.id}`}>
            <p className="small muted"><progress value={d} max={ls.length || 1} aria-label={`${d} of ${ls.length} lessons finished`} /> {d} of {ls.length} finished or skipped · {c.family} · {courseFacts(c, content.lessonById)}</p>
            <p>{withoutTypedCount(c.summary)}</p>
            {c.uses && c.uses.length > 0 && <p className="small muted">Uses: {c.uses.map(u => content.skillById.get(u)?.title ?? u).join(', ')}</p>}
            <ol className="plain">{ls.map(l => { const row = (<><span aria-hidden="true">{done.has(l.id) ? '✓' : '○'}</span><Link className={done.has(l.id) ? 'button' : 'button primary'} to={`/lesson/${l.id}`}>{done.has(l.id) ? 'Review' : 'Open'}</Link> <span><strong>{l.title}</strong> <span className="muted small">· {aboutMinutes(lessonMinutes(l))}</span><RelevantSkillsView lesson={l} levels={levels} compact /></span></>); return l.id === nextLesson ? <UpNextMark as="li" key={l.id} skillId={l.skill} className="row">{row}</UpNextMark> : <li key={l.id} className="row">{row}</li> })}</ol>
            </div>}
          </>
        )
        return c.id === upCourse ? <UpNextMark key={c.id} className="card" data-hue={hueOfStage(ci + 1)}>{inner}</UpNextMark> : <div key={c.id} className="card" data-hue={hueOfStage(ci + 1)}>{inner}</div>
      })}
      {courses.failed && <p role="alert">The course list could not be downloaded. Check your connection, then <button type="button" className="link" onClick={() => void courses.retry()}>try again</button>.</p>}
      {!courses.failed && content.courses.length === 0 && <p className="muted">No courses are written yet.</p>}
      {!courses.failed && planned.length > 0 && <div className="card"><h2>Planned</h2><ul className="plain">{planned.map(p => <li key={p.id}><strong>{p.title}</strong> <span className="muted small">{p.note}</span></li>)}</ul></div>}
    </section>
  )
}
