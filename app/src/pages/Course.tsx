import { RadialMap } from '../components/RadialMap'
import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { LessonIndex } from './LessonIndex'
import { CoursesView } from './CoursesView'
import { describeMastery } from '../lib/mastery'
import { STRAND_NAMES, LEVEL_NAMES } from '../lib/missions'
import { lessonsForSkill, primaryLesson } from '../lib/lessonRoles'
import { db } from '../db'
import { saveFinished, resetProgress } from '../lib/lessonSave'
import { nextLessons } from '../lib/progress'
import { PATH_STAGES } from '../lib/pathStages'
import { currentStageIndex, skillHomeStages, skillReturns, stageSentence } from '../lib/skillStages'
import { requestMapJump } from '../lib/mapJump'
import { useMissionData } from '../lib/useMissions'
import type { LessonMeta } from '../types'

/** True on a phone-width screen (the chip rows become compact menus there). */
function useNarrow(): boolean {
  const q = '(max-width: 700px)'
  const [n, setN] = useState(() => typeof window !== 'undefined' && window.matchMedia?.(q).matches === true)
  useEffect(() => {
    const m = window.matchMedia?.(q); if (!m) return
    const h = () => setN(m.matches); m.addEventListener('change', h); h()
    return () => m.removeEventListener('change', h)
  }, [])
  return n
}

/** Choice chips. A row (`menu` off) wraps inside the bar and never scrolls sideways; a menu is one button that opens the chips above the map and closes when a choice is made.
 * On a phone every group is a menu. */
const MAP_HELP = 'Rings are the stages of the recommended path, slices are the subjects. Every skill can be picked at any time. Drag to move, scroll or pinch to zoom. Every skill is a block. A block fills as your evidence grows: seen, level one (the idea when it is named), level two (in positions where nobody names it), mastered (reliable at the deepest depth, and not due for a refresher). A dot in the corner means you have finished its lesson. Nothing is locked.'

function ChipGroup({ label, current, menu = false, children }: { label: string; current: string; menu?: boolean; children: ReactNode }) {
  const narrow = useNarrow()
  const [open, setOpen] = useState(false)
  if (!narrow && !menu) return <><span className="small muted sectionlabel">{label}:</span>{children}</>
  return (
    <div className="chipmenu">
      <button type="button" className="chipmenubtn" aria-expanded={open} onClick={() => setOpen(o => !o)}><span aria-hidden="true">{open ? '▴' : '▾'}</span> {label}: <strong>{current}</strong></button>
      {open && <div className="chipmenubody" role="group" aria-label={label} onClick={e => { if ((e.target as HTMLElement).closest('button')) setOpen(false) }} onKeyDown={e => { if (e.key === 'Escape') { e.stopPropagation(); setOpen(false) } }}>{children}</div>}
    </div>
  )
}

export function Course() {
  const { content, attempts, progress, placement, ctx, missions, overall } = useMissionData()
  const [params, setParams] = useSearchParams()
  const view = params.get('mission') ?? 'all'
  const setView = (v: string) => { const p = new URLSearchParams(params); p.set('view', 'map'); if (v === 'all') p.delete('mission'); else p.set('mission', v); setParams(p, { replace: true }); setPicked(null) }
  const [picked, setPicked] = useState<string | null>(null)
  // a stage of the recommended path lit on the map (?stage=S3); the choice is in the address so it can be shared and survives a reload
  const stageSel = (() => { const i = PATH_STAGES.findIndex(x => x.id === params.get('stage')); return i < 0 ? null : i })()
  const setStage = (i: number | null) => { const p = new URLSearchParams(params); p.set('view', 'map'); if (i === null || i === stageSel) p.delete('stage'); else p.set('stage', PATH_STAGES[i].id); setParams(p, { replace: true }); setPicked(null) }
  // the map page is exactly as tall as the window under the header: measure the header so nothing needs scrolling
  useEffect(() => {
    const el = document.querySelector('.top'), foot = document.querySelector('.sitefooter'); if (!el) return
    const set = () => {
      document.documentElement.style.setProperty('--topH', `${Math.ceil(el.getBoundingClientRect().height)}px`)
      document.documentElement.style.setProperty('--botH', `${Math.ceil(foot?.getBoundingClientRect().height ?? 0)}px`)
    }
    set(); const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(set) : null; ro?.observe(el); if (foot) ro?.observe(foot); window.addEventListener('resize', set)
    return () => { ro?.disconnect(); window.removeEventListener('resize', set) }
  }, [])
  useEffect(() => { if (!picked) return; const k = (e: KeyboardEvent) => { if (e.key === 'Escape') setPicked(null) }; window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k) }, [picked])

  const isAll = view === 'all' || !missions.some(m => m.strand === view)
  const [why, setWhy] = useState<string | null>(null)
  const node = picked ? overall.nodes.find(n => n.id === picked) : undefined
  const homeStages = useMemo(() => skillHomeStages(content.skills, content.lessons), [content.skills, content.lessons])
  const hereStage = useMemo(() => currentStageIndex(content.lessons, new Set((progress ?? []).filter(p => p.done).map(p => p.lessonId))), [content.lessons, progress])
  const next = useMemo(() => (ctx && progress ? nextLessons(content, ctx.masteries, placement, progress, 3) : []), [ctx, progress, content, placement])
  if (!ctx || !attempts) return <main className="page"><h1 className="sr-only">Loading</h1><p className="muted">Loading…</p></main>

  const tab = params.get('view')
  const showCourses = tab === 'courses'
  const showLessons = tab !== 'map' && !showCourses // the Curriculum chip covers two views: the Path (default) and the All lessons list (?view=lessons)
  const setTab = (v: string) => { const p = new URLSearchParams(params); if (v === 'path') p.delete('view'); else p.set('view', v); setParams(p, { replace: true }) }
  const pick = (id: string) => { setPicked(id); const m = missions.find(x => x.nodes.some(n => n.id === id)); if (m && isAll) { /* stay on the overview: the detail opens beside it */ } }


  /** Every lesson that teaches this skill (its introduction first, then continuations); course applications and checks are listed separately. */
  const lessonsFor = (id: string) => { const s = lessonsForSkill(content.lessons, id); return s.teaching.length ? s.teaching : s.alsoTeaching }
  const sk = node ? content.skillById.get(node.id) : undefined

  // what a skill builds on and leads to, read from the prerequisites of its depths
  const links = (id: string) => {
    const s0 = content.skillById.get(id); const none = { from: [] as string[], to: [] as string[], why: new Map<string, string>() }
    if (!s0) return none
    const out = { from: new Set<string>(), to: new Set<string>(), why: new Map<string, string>() }
    const split = (k: string) => ({ node: k.slice(0, k.lastIndexOf('.')), depth: k.slice(k.lastIndexOf('.') + 1) })
    // the reason for a link is the checked outcome of the depth that is needed: nothing is written by hand
    for (const [d, dep] of Object.entries(s0.depths)) for (const k of dep.prereqs ?? []) {
      const { node: n, depth } = split(k); const p0 = content.skillById.get(n)
      if (n !== id && p0) { out.from.add(n); if (!out.why.has(n)) out.why.set(n, `${s0.title} at ${d} needs ${p0.title} at ${depth}: ${p0.depths[depth]?.outcome ?? ''}`) }
    }
    for (const o of content.skills) if (o.id !== id) for (const [d, dep] of Object.entries(o.depths)) for (const k of dep.prereqs ?? []) {
      const { node: n, depth } = split(k)
      if (n === id) { out.to.add(o.id); if (!out.why.has(o.id)) out.why.set(o.id, `${o.title} at ${d} needs ${s0.title} at ${depth}: ${s0.depths[depth]?.outcome ?? ''}`) }
    }
    return { from: [...out.from], to: [...out.to], why: out.why }
  }
  const markLesson = (l: LessonMeta, skipped: boolean) => saveFinished(db.lessonProgress, l, skipped)
  const resetLesson = (id: string) => resetProgress(db.lessonProgress, id)
  const skillName = (id: string) => content.skillById.get(id)?.title ?? id
  const detailPanel = (
    node && sk && (() => {
      const ls = lessonsFor(node.id)
      const more = lessonsForSkill(content.lessons, node.id)
      const lp = (id: string) => progress?.find(p => p.lessonId === id)
      const open = primaryLesson(content.lessons, node.id, id => !!lp(id)?.done) // the first unfinished of the introduction, then continuations: never a course lesson or a check
      const started = !!open && (lp(open.id)?.step ?? 0) > 0
      const cn = links(node.id)
      const returns = skillReturns(sk, content.lessons)
      const showDepth = node.workingDepth ?? 'D1'
      const outcome = sk.depths[showDepth]?.outcome ?? sk.depths.D1?.outcome
      // student-facing names for the evidence levels; each is ticked only when the evidence supports it (the same rule as the map nodes)
      const rungs: [string, string, boolean][] = [
        ['Recognise it', 'when the idea is named', node.level >= 2],
        ['Find it yourself', 'in positions where nobody names it', node.level >= 3],
        ['Rely on it', 'at the deepest depth, not due for a refresher', node.level >= 4],
      ]
      const lessonRow = (l: LessonMeta) => { const pr = lp(l.id); return (
        <p key={l.id} className="small"><Link to={`/lesson/${l.id}`}>{l.title}</Link>: {pr?.done ? (pr.skipped ? 'skipped' : 'finished') : pr && pr.step > 0 ? 'in progress' : 'not started'}{' '}
          {!pr?.done && <><button type="button" className="btn btn-quiet" aria-label={`Mark finished: ${l.title}`} onClick={() => void markLesson(l, false)}>Mark finished</button> · <button type="button" className="btn btn-quiet" aria-label={`Skip: ${l.title}`} onClick={() => void markLesson(l, true)}>Skip</button></>}
          {(pr?.done || (pr && pr.step > 0)) && <button type="button" className="btn btn-quiet btn-danger" aria-label={`Reset progress: ${l.title}`} onClick={() => void resetLesson(l.id)}>Reset</button>}</p>) }
      return (
            <section className={`card skilldetail detaildrawer`} role="dialog" aria-label={`${node.title} detail`}>
              <button type="button" className="closebtn" onClick={() => setPicked(null)}>Close ✕</button>
              <h2>{node.title}</h2>
              <p className="small stageline"><strong>{stageSentence(homeStages.get(node.id) ?? 0)}</strong>{homeStages.get(node.id) === hereStage ? ' · you are here' : ''}</p>
              <h3 className="sdh">What it lets you do</h3>
              <p>{outcome}</p>
              <h3 className="sdh">What you have shown</h3>
              <ul className="plain rungs">{rungs.map(([name, how, got]) => <li key={name} className={got ? 'got' : ''}><span aria-hidden="true">{got ? '●' : '○'}</span> <strong>{name}</strong> <span className="muted small">{how}{got ? '' : ': not shown yet'}</span></li>)}</ul>
              <p className="small muted">Using it in your own games is not measured yet. {LEVEL_NAMES[node.level]}{node.due ? ' · a refresher is due' : ''}{node.levelWithAssumed > node.level ? ` · assumed up to ${LEVEL_NAMES[node.levelWithAssumed].toLowerCase()} from your placement or warm-up, not yet shown` : ''}.</p>
              {node.noExercises && <p className="small muted">This skill has no exercises yet, so it can only reach Seen, by finishing its lesson.</p>}
              <h3 className="sdh">What to do next</h3>
              <div className="row">
                {open ? <Link className="button primary" to={`/lesson/${open.id}`}>{started ? 'Continue' : 'Start'} the lesson: {open.title}</Link>
                  : node.workingDepth ? <Link className="button primary" to={`/practice?skill=${node.id}.${node.workingDepth}&go=1&n=6`}>Practice {node.workingDepth}</Link> : null}
                {open && node.workingDepth && <Link className="button" to={`/practice?skill=${node.id}.${node.workingDepth}&go=1&n=6`}>Practice {node.workingDepth}</Link>}
                {node.workingDepth && <Link className="button" to={`/practice?skill=${node.id}.${node.workingDepth}&go=1&n=6&silent=1`}>Test it silently</Link>}
              </div>
              {returns.length > 0 && <>
                <h3 className="sdh">Where this skill returns</h3>
                <p className="small muted">It starts at {stageSentence(homeStages.get(node.id) ?? 0)} and comes back later. Each button shows that stage on the map.</p>
                <ul className="plain returns">{returns.map(g => (
                  <li key={g.stageId}><button type="button" className="link" aria-label={`Show ${stageSentence(g.stageIndex)} on the map`} onClick={() => requestMapJump({ skill: node.id, stage: g.stageIndex })}>{stageSentence(g.stageIndex)}</button>
                    <span className="small muted"> adds {g.items.map(i => i.adds).filter((a, k, all) => all.indexOf(a) === k).join(', ')}</span></li>))}</ul>
              </>}
              <h3 className="sdh">What it connects to</h3>
              <p className="small linkrow"><span className="muted">Builds on:</span> {cn.from.length ? cn.from.map(id => <span key={id}><button type="button" className="link" onClick={() => pick(id)}>{skillName(id)}</button> <button type="button" className="link why" aria-label={`Why ${skillName(id)}`} onClick={() => setWhy(w => w === id ? null : id)}>why?</button></span>) : <span className="muted">nothing: you can start here</span>}</p>
              <p className="small linkrow"><span className="muted">Leads to:</span> {cn.to.length ? cn.to.map(id => <span key={id}><button type="button" className="link" onClick={() => pick(id)}>{skillName(id)}</button> <button type="button" className="link why" aria-label={`Why ${skillName(id)}`} onClick={() => setWhy(w => w === id ? null : id)}>why?</button></span>) : <span className="muted">no skill after this one yet</span>}</p>
              {why && cn.why.get(why) && <p className="small whybox" role="status">{cn.why.get(why)}</p>}
              <details><summary>Lessons for this skill ({ls.length})</summary>
                {ls.map(l => lessonRow(l))}
                {ls.length === 0 && <p className="small muted">No lesson for this skill yet.</p>}
              </details>
              {more.appears.length > 0 && <details><summary>Where else this appears ({more.appears.length})</summary>
                <p className="small muted">Course lessons that use this skill. They assume you have met it; they do not teach it first.</p>
                {more.appears.map(l => lessonRow(l))}
              </details>}
              {more.checks.length > 0 && <details><summary>Check yourself ({more.checks.length})</summary>
                <p className="small muted">Stage checks test what you already learned; they are not where a skill starts.</p>
                {more.checks.map(l => lessonRow(l))}
              </details>}
              <details><summary>Every depth in detail</summary>
                {node.cuedTop && <p className="small muted">The deepest exercises for this skill name or cue the idea, so Level two or Mastered here means reliable when the idea is named or cued.</p>}
                <dl>{Object.keys(sk.depths).sort().map(d => { const m = ctx.masteries.get(`${node.id}.${d}`); const dep = sk.depths[d]; return (
                  <div key={d}><dt>{d} <span className="muted small">· {node.depths.find(x => x.depth === d)?.status ?? 'outline only'}</span></dt>
                    <dd>{dep.outcome}{m ? <span className="muted small"> {describeMastery(m)}</span> : null}</dd></div>) })}</dl>
              </details>
              {sk.conditions && sk.conditions.length > 0 && <details><summary>When the idea holds</summary><ul>{sk.conditions.map(c => <li key={c}>{c}</li>)}</ul></details>}
              {sk.contrasts && sk.contrasts.length > 0 && <details><summary>Where it fails or does not apply</summary><ul>{sk.contrasts.map(c => <li key={c}>{c}</li>)}</ul></details>}
              {sk.misconceptions && sk.misconceptions.length > 0 && <details><summary>Common misunderstandings</summary><ul>{sk.misconceptions.map(c => <li key={c}>{c}</li>)}</ul></details>}
            </section>
      )
    })()
  )
  /** The two side panels and their edge buttons belong to the whole Curriculum section: they show on the map, the lesson list and the courses. */
  const skillOpen = !!(node && sk)
  const chrome = (
    <div className="sidechrome" onKeyDown={e => { if (e.key === 'Escape') { setPicked(null) } }}>
      {skillOpen && (
        <aside className="dock right" aria-label="Selected skill">
          <div className="dockbody">{detailPanel}</div>
        </aside>
      )}
    </div>
  )

  const otherView = showCourses ? <main className="page wide curriculum"><h1 className="sr-only">Curriculum</h1><CoursesView /></main> : showLessons ? <main className={`page wide curriculum${node && sk ? ' skillopen' : ''}`}><h1 className="sr-only">Curriculum</h1><LessonIndex picked={picked} onPick={pick} /></main> : null // built after sk and busy exist; returned after every hook has run
  if (otherView) return <>{otherView}{chrome}</>
  const sectionChips = <>
        <button type="button" className={isAll ? 'chip on' : 'chip'} aria-pressed={isAll} onClick={() => setView('all')}><strong>Whole curriculum</strong> · {overall.percent}%</button>
        {missions.map(m => <button key={m.strand} type="button" className={!isAll && view === m.strand ? 'chip on' : 'chip'} aria-pressed={!isAll && view === m.strand} onClick={() => setView(m.strand)}>{m.strand} {m.name} · {m.percent}%</button>)}
  </>
  const stageChips = <>
        <button type="button" className={stageSel === null ? 'chip on' : 'chip'} aria-pressed={stageSel === null} onClick={() => setStage(null)}>All stages</button>
        {PATH_STAGES.map((st, i) => <button key={st.id} type="button" className={`chip stagechip${stageSel === i ? ' on' : ''}${hereStage === i ? ' here' : ''}`} aria-pressed={stageSel === i} aria-label={`${stageSentence(i)}${hereStage === i ? ', you are here' : ''}`} title={`${st.milestone}${hereStage === i ? ' (You are here.)' : ''}`} onClick={() => setStage(i)}>{stageSentence(i)}</button>)}
  </>
  // phones (docs/mobile-design.md): a thin bar with the three views as a segmented control; everything else is in one Filters sheet
  const phoneLead = (
    <div className="segmented" role="group" aria-label="Curriculum views">
      <button type="button" onClick={() => setTab('path')}>Curriculum</button>
      <button type="button" onClick={() => setTab('courses')}>Electives</button>
      <button type="button" className="on" aria-pressed="true" onClick={() => setTab('map')}>Map</button>
    </div>
  )
  const phoneFilters = <>
    <h3>Sections</h3><div className="options">{sectionChips}</div>
    <h3>Stages</h3><div className="options">{stageChips}</div>
    <details className="maphelptext"><summary>How the map fills in</summary><p className="small">{MAP_HELP.replace('Drag to move, scroll or pinch to zoom.', 'Drag with one finger to move, pinch to zoom, tap a skill to open it.')}</p></details>
  </>
  return (
    <>
    <main className={`page wide mappage curriculum${node && sk ? ' winright' : ''}`}>
      <h1 className="sr-only">Curriculum</h1>
      <div className="missiongrid mapgrid">

        <div className="mapcenter"><RadialMap phoneLead={phoneLead} phoneFilters={phoneFilters} toolbarLead={<div className="sectionbar inbar" role="group" aria-label="Sections and stages">
      <ChipGroup label="Sections" menu current={isAll ? 'Whole curriculum' : `${view} ${STRAND_NAMES[view] ?? ''}`.trim()}>
        {sectionChips}
      </ChipGroup>
      <ChipGroup label="Stages" menu current={stageSel === null ? 'All stages' : stageSentence(stageSel)}>
        {stageChips}
      </ChipGroup>
      <button type="button" className="chip maphelp" aria-label="How the map fills in" title={MAP_HELP}>?</button>
      </div>} skills={content.skills} progress={new Map(overall.nodes.map(n => [n.id, n]))} picked={picked} onPick={pick} strandNames={STRAND_NAMES} highlightStrand={isAll ? null : view} highlightStage={stageSel} lessons={content.lessons} lessonProgress={progress ?? []} recommended={next[0]?.skill ?? null} upNext={next.map(x => x.skill)} /></div>

      </div>

    </main>
    {chrome}
    </>
  )
}
