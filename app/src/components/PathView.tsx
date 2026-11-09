import { useMemo, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import type { LessonProgress } from '../db'
import type { ContentBundle } from '../types'
import type { Mastery } from '../lib/mastery'
import type { Placement } from '../lib/progress'
import { aboutMinutes, lessonMinutes } from '../lib/lessonTime'
import { hueOfStrand } from '../lib/hue'
import { buildPath, type PathTile, type TileState } from '../lib/pathView'
import { FirstGameInvite } from './FirstGameInvite'

/** One small line icon per state, drawn in the text colour; the word beside it carries the meaning too. */
function StateIcon({ state, mastered }: { state: TileState; mastered: boolean }) {
  const p = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  return (
    <svg className="tileicon" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">
      {state === 'locked' && <><rect x="5" y="11" width="14" height="9" rx="2" {...p} /><path d="M8 11V8a4 4 0 0 1 8 0v3" {...p} /></>}
      {state === 'available' && <circle cx="12" cy="12" r="7" {...p} />}
      {state === 'next' && <path d="M8 5l11 7-11 7z" fill="currentColor" stroke="currentColor" strokeWidth={1.5} strokeLinejoin="round" />}
      {state === 'progress' && <><circle cx="12" cy="12" r="7" {...p} /><path d="M12 5a7 7 0 0 1 0 14z" fill="currentColor" stroke="currentColor" strokeWidth={1.5} /></>}
      {state === 'done' && (mastered
        ? <path d="M4 18l2-10 4 4 2-6 2 6 4-4 2 10z" {...p} />
        : <path d="M5 12.5l4.5 4.5L19 7.5" {...p} />)}
    </svg>
  )
}

function Tile({ t, stageNumber, refFor }: { t: PathTile; stageNumber: number; refFor: (el: HTMLAnchorElement | null) => void }) {
  const l = t.lesson
  const mins = aboutMinutes(lessonMinutes(l))
  const label = `${l.title}. ${t.word}. ${mins}.${t.missing ? ' You can still open it.' : ''}`
  return (
    <Link ref={refFor} to={`/lesson/${l.id}`} className="pathtile" data-state={t.state} data-skipped={t.skipped ? 'true' : undefined} data-hue={hueOfStrand(t.strand)} aria-label={label} aria-current={t.state === 'next' ? 'step' : undefined} data-stage={stageNumber}>
      <StateIcon state={t.state} mastered={t.word === 'Mastered'} />
      <span className="tiletext">
        <span className="tiletitle">{l.title}</span>
        <span className="tilemeta">{mins}</span>
        <span className="tileword">{t.word}</span>
      </span>
    </Link>
  )
}

/** The Path (D60, D61): the recommended route as a ladder of tiles in stages, with a Next tile and a gate at the end of each stage. Nothing here blocks: every tile opens. */
export function PathView({ content, masteries, placement, progress, nextId }: { content: ContentBundle; masteries: Map<string, Mastery>; placement: Placement; progress: LessonProgress[]; nextId?: string }) {
  const path = useMemo(() => buildPath({ content, masteries, placement, progress, nextId }), [content, masteries, placement, progress, nextId])
  // Stages other than the one in progress start folded, so a long route never buries the Next tile. The learner's choices are kept in this state.
  const [toggled, setToggled] = useState<Record<string, boolean>>({})
  const isOpen = (id: string, status: string) => toggled[id] ?? status === 'current'
  const tileRefs = useMemo(() => new Map<string, HTMLAnchorElement>(), [])
  const totalLessons = path.stages.reduce((n, s) => n + s.tiles.length, 0)
  const doneLessons = path.stages.reduce((n, s) => n + s.doneCount, 0)
  const nextStage = path.stages.find(s => s.tiles.some(t => t.lesson.id === path.nextId))
  const goNext = () => {
    if (!path.nextId || !nextStage) return
    setToggled(t => ({ ...t, [nextStage.id]: true }))
    // wait for the stage to open, then bring the tile into view and focus it (smooth only when motion is allowed)
    requestAnimationFrame(() => {
      const el = tileRefs.get(path.nextId!)
      if (!el) return
      const calm = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || document.documentElement.dataset.motion === 'reduce'
      el.scrollIntoView({ block: 'center', behavior: calm ? 'auto' : 'smooth' })
      el.focus({ preventScroll: true })
    })
  }
  const inviteAfter = path.stages.findIndex(s => s.id === 'S1') // the optional first-game invitation sits after the rules stage, as in the list
  const rows: ReactNode[] = []
  path.stages.forEach((s, i) => {
    const open = isOpen(s.id, s.status)
    const panelId = `pstage-${s.id}`
    rows.push(
      <section key={s.id} className={`pstage ${s.status}`} aria-labelledby={`${panelId}-h`} data-hue={String(((s.number - 1) % 11) + 1)}>
        <h2 id={`${panelId}-h`} className="pathbanner">
          <button type="button" className="bannerbtn" aria-expanded={open} aria-controls={panelId} onClick={() => setToggled(t => ({ ...t, [s.id]: !open }))}>
            <span className="stagenum">Stage {s.number}</span>
            <span className="stagetitle">{s.title}</span>
            <span className="stagecount">{s.doneCount} of {s.tiles.length} done</span>
            <span className="chev" aria-hidden="true">{open ? '▾' : '▸'}</span>
          </button>
        </h2>
        <p className="stagegoal">{s.milestone}</p>
        <div id={panelId} hidden={!open}>
          <ol className="pathladder">
            {s.tiles.map((t, k) => <li key={t.lesson.id} className={`rung r${k % 4}`}><Tile t={t} stageNumber={s.number} refFor={el => { if (el) tileRefs.set(t.lesson.id, el); else tileRefs.delete(t.lesson.id) }} /></li>)}
          </ol>
          <div className={`stagegate ${s.gateOpen ? 'open' : 'closed'}`}>
            <svg className="tileicon" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">
              {s.gateOpen
                ? <path d="M4 20V9a8 8 0 0 1 16 0v11M4 20h16M9 20v-6M15 20v-6" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
                : <path d="M4 20V9a8 8 0 0 1 16 0v11M4 20h16M9 20v-6M15 20v-6M12 4v16" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />}
            </svg>
            <span><strong>Stage {s.number} gate: {s.gateOpen ? 'open' : 'closed'}.</strong> {s.gateOpen ? 'Every lesson here is finished.' : `${s.tiles.length - s.doneCount} lesson${s.tiles.length - s.doneCount === 1 ? '' : 's'} to go. This is a signpost, not a lock: the next stage is open to you now.`}</span>
            {s.checkId && <Link className="chip" to={`/lesson/${s.checkId}`}>{s.checkDone ? 'Stage check (done)' : 'Take the stage check'}</Link>}
          </div>
        </div>
      </section>,
    )
    if (i === inviteAfter) rows.push(<FirstGameInvite key="invite" />)
  })
  return (
    <section className="pathview" aria-label="Path">
      <div className="pathhead">
        <p className="muted small">Open any tile. A locked one only says what it builds on. <progress value={doneLessons} max={totalLessons || 1} aria-label={`${doneLessons} of ${totalLessons} path lessons finished`} /> {doneLessons} of {totalLessons} finished</p>
        {path.nextId && <button type="button" className="chip" onClick={goNext}>Jump to Next</button>}
      </div>
      {rows}
    </section>
  )
}
