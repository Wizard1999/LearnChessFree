import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { db, type LessonProgress } from '../db'
import { ghostPosition, layoutMap } from '../lib/mapLayout'
import { LEVEL_NAMES, type NodeProgress } from '../lib/missions'
import { skillState, sheetOffset, listMaxHeight } from '../lib/mapSheet'
import { REGIONS } from '../lib/mapRegions'
import { PATH_STAGES } from '../lib/pathStages'
import { currentStageIndex, skillHomeStages, skillReturns, stageSentence } from '../lib/skillStages'
import { onMapJump } from '../lib/mapJump'
import { ringLabelPlan, ringTextPaths, zoomZone } from '../lib/mapZoom'
import { setLinkedHover, useLinkedHover } from '../lib/linkedHover'
import { lessonsForSkill, primaryLesson } from '../lib/lessonRoles'
import { saveFinished, resetProgress } from '../lib/lessonSave'
import { TAP_SLOP, isDoubleTap, pinchGeometry, viewForPinch, zoomAt, type Cam, type Pinch } from '../lib/mapGesture'
import type { LessonMeta, Skill } from '../types'

interface Props { skills: Skill[]; progress: Map<string, NodeProgress>; picked: string | null; onPick: (id: string) => void; strandNames: Record<string, string>; /** A strand to emphasise: its nodes stay bright, the rest dim, and the view moves to it. */ highlightStrand?: string | null; lessons: LessonMeta[]; lessonProgress: LessonProgress[]; /** The skill of the lesson recommended next: marked on the map so the next step is unmistakable. */ recommended?: string | null; /** A stage (index 0..7) to light on every slice; the rest dim. */ highlightStage?: number | null }

/** Text that follows an arc of a circle round the map, centred on `mid` (radians), reading upright: on the top half it runs clockwise outside the baseline,
 * on the bottom half the path is reversed so the letters are not upside down. The size shrinks to fit the arc a label may use. */
function ArcLabel({ id, mid, radius, text, size, className }: { id: string; mid: number; radius: number; text: string; size: number; className: string }) {
  const top = Math.sin(mid) <= 0
  const r = top ? radius - size * 0.33 : radius + size * 0.33
  const half = Math.min(Math.PI * 0.95, (text.length * size * 0.6) / r / 2 + 0.03)
  const a1 = mid - half, a2 = mid + half
  const p = (a: number) => `${Math.cos(a) * r},${Math.sin(a) * r}`
  const d = top ? `M${p(a1)} A${r},${r} 0 0 1 ${p(a2)}` : `M${p(a2)} A${r},${r} 0 0 0 ${p(a1)}`
  return (
    <g pointerEvents="none">
      <path id={id} d={d} fill="none" stroke="none" />
      <text className={className} fontSize={size}><textPath href={`#${id}`} startOffset="50%" textAnchor="middle">{text}</textPath></text>
    </g>
  )
}
/** The empty channel between two stage rings is 2 x (EDGE_PAD - node radius); the divider text must fit inside it. */
const RING_TEXT_MAX = 56
const fitSize =(arc: number, chars: number, factor: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, (arc * 0.92) / (chars * factor)))

/** A stage boundary that IS its label: the words run all the way round the circle just inside the band's outer edge, repeated with a little space between the repeats.
 * Two half circles carry the text so it reads upright everywhere: the top half runs left to right over the top, the bottom half left to right along the bottom. */
function TextRing({ id, outer, size, text, className }: { id: string; outer: number; size: number; text: string; className: string }) {
  const unit = `${text}   \u2022   `
  const half = Math.PI * outer
  const fit = Math.min(size, (half * 0.97) / (unit.length * 0.6)) // a ring too small for one repeat shrinks its text rather than overflow
  const n = Math.max(1, Math.floor(half / (unit.length * fit * 0.6)))
  const content = unit.repeat(n)
  // the text is centred on the boundary circle itself (there is no line there: the words are the divider): on the top half the letters rise from the baseline
  // (outward), on the bottom half they hang from it (inward), so both halves read upright and each is centred on the same radius
  const { top, bottom, rTop: rt, rBottom: rb } = ringTextPaths(outer, fit)
  return (
    <g pointerEvents="none">
      <path id={`${id}-t`} d={top} fill="none" stroke="none" />
      <path id={`${id}-b`} d={bottom} fill="none" stroke="none" />
      <text className={className} fontSize={fit}><textPath href={`#${id}-t`} textLength={Math.PI * rt * 0.99} lengthAdjust="spacing">{content}</textPath></text>
      <text className={className} fontSize={fit}><textPath href={`#${id}-b`} textLength={Math.PI * rb * 0.99} lengthAdjust="spacing">{content}</textPath></text>
    </g>
  )
}
/** The curriculum as a map: the first skill at the centre, one ring per stage of the recommended path, a wedge per subject (strand). Pan by dragging,
 * zoom with the wheel or the buttons; arrow keys move between connected skills when a skill is focused. */
export function RadialMap({ skills, progress, picked, onPick, strandNames, highlightStrand = null, lessons, lessonProgress, recommended = null, highlightStage = null }: Props) {
  const homeStages = useMemo(() => skillHomeStages(skills, lessons), [skills, lessons])
  const layout = useMemo(() => layoutMap(skills, homeStages), [skills, homeStages])
  const hereStage = useMemo(() => currentStageIndex(lessons, new Set(lessonProgress.filter(p => p.done).map(p => p.lessonId))), [lessons, lessonProgress])
  const byId = useMemo(() => new Map(layout.nodes.map(n => [n.id, n])), [layout])
  const R = layout.radius + 300 // room outside the circle for the section and region names
  const navigate = useNavigate()
  const [hov, setHov] = useState<string | null>(null)
  const linkedHoverId = useLinkedHover() // a skill pointed at in another window (Progress boxes, Up next ...) is highlighted here too
  const [tip, setTip] = useState<{ id: string; corner: 'br' | 'bl' } | null>(null)
  const hideTimer = useRef<number | undefined>(undefined)
  const showTip = (id: string, el: Element) => {
    window.clearTimeout(hideTimer.current); setHov(id); setLinkedHover(id)
    const box = svg.current?.parentElement?.getBoundingClientRect(), r = el.getBoundingClientRect()
    if (!box) return
    // the card lives in a corner of the map (bottom right by default, bottom left when the skill is down there), never at the pointer, so it never hides the links
    const nearBR = r.left - box.left > box.width - 340 && r.top - box.top > box.height - 250
    setTip({ id, corner: nearBR ? 'bl' : 'br' })
  }
  const hideTip = () => { window.clearTimeout(hideTimer.current); hideTimer.current = window.setTimeout(() => { setTip(null); setHov(null); setLinkedHover(null) }, 220) }
  const doneBy = useMemo(() => new Map(lessonProgress.map(p => [p.lessonId, p])), [lessonProgress])
  const mark = (ids: string[], done: boolean) => Promise.all(ids.map(id => { const l = lessons.find(x => x.id === id); return done && l ? saveFinished(db.lessonProgress, l, false) : resetProgress(db.lessonProgress, id) }))
  // the camera is remembered for the session, so coming back from a lesson lands where the learner was
  const [view, setView] = useState(() => { try { const v = JSON.parse(sessionStorage.getItem('map-view') ?? 'null'); if (v && [v.x, v.y, v.k].every(Number.isFinite)) return v as { x: number; y: number; k: number } } catch { /* storage unavailable */ } return { x: 0, y: 0, k: 3 } })
  const viewRef = useRef(view); viewRef.current = view
  const [past, setPast] = useState<{ x: number; y: number; k: number }[]>([])
  /** A jump (search, a chosen skill, Where I am, Fit all) remembers where the camera was, so Back returns there. */
  const go = (next: { x: number; y: number; k: number }) => { setPast(p => [...p.slice(-19), viewRef.current]); setView(next) }
  const back = () => setPast(p => { const last = p[p.length - 1]; if (last) setView(last); return p.slice(0, -1) })
  useEffect(() => { try { sessionStorage.setItem('map-view', JSON.stringify(view)) } catch { /* storage unavailable */ } }, [view])
  const drag = useRef<{ x: number; y: number; vx: number; vy: number } | null>(null)
  const svg = useRef<SVGSVGElement>(null)
  // touch: the active pointers, the running pinch, and whether this gesture has been a drag or pinch (then its click must not select a skill)
  const ptrs = useRef(new Map<number, { x: number; y: number }>())
  const pinch = useRef<{ cam: Cam; from: Pinch } | null>(null)
  const suppressClick = useRef(false), moved = useRef(false), lastType = useRef('mouse')
  const lastTap = useRef<{ t: number; x: number; y: number } | null>(null)
  const endPointer = (e: React.PointerEvent<SVGSVGElement>) => {
    const wasPinch = pinch.current !== null
    ptrs.current.delete(e.pointerId)
    if (ptrs.current.size < 2) pinch.current = null
    // after a pinch the remaining finger does not start a pan (the map would jump); the next touch starts fresh
    drag.current = null
    if (e.type === 'pointerup' && e.pointerType === 'touch' && !wasPinch && !moved.current && ptrs.current.size === 0 && svg.current) {
      const tap = { t: e.timeStamp, x: e.clientX, y: e.clientY }
      if (isDoubleTap(lastTap.current, tap)) { suppressClick.current = true; lastTap.current = null; setView(zoomAt(viewRef.current, 2, R, svg.current.getBoundingClientRect(), e.clientX, e.clientY)) }
      else lastTap.current = tap
    }
  }
  const [q, setQ] = useState('')
  const [listOpen, setListOpen] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)
  // the list follows the map: when it opens, the picked skill is scrolled into view
  const level = (id: string) => Math.min(4, progress.get(id)?.level ?? 0)
  /** How ready a skill is to be started: the share of its prerequisite skills that are at Level one or better. A skill with none is ready at once. */
  const readiness = useMemo(() => {
    const parents = new Map<string, string[]>()
    for (const e of layout.edges) parents.set(e.to, [...(parents.get(e.to) ?? []), e.from])
    const m = new Map<string, number>()
    for (const n of layout.nodes) { const ps = parents.get(n.id) ?? []; m.set(n.id, ps.length ? ps.filter(p => (progress.get(p)?.level ?? 0) >= 2).length / ps.length : 1) }
    return m
  }, [layout, progress])
  /** Each prerequisite is worth an equal share of the way into a skill (3 prerequisites: a third each). A prerequisite counts fully at Level one and partly before that. */
  const pathLight = useMemo(() => {
    const parents = new Map<string, string[]>()
    for (const e of layout.edges) parents.set(e.to, [...(parents.get(e.to) ?? []), e.from])
    const share = (id: string) => Math.min(1, (progress.get(id)?.level ?? 0) / 2)
    const total = new Map<string, number>()
    for (const [t, ps] of parents) total.set(t, ps.reduce((sum, p) => sum + share(p), 0) / ps.length)
    return { total, share }
  }, [layout, progress])
  const linked = useMemo(() => {
    const s = new Set<string>()
    if (picked) { s.add(picked); for (const e of layout.edges) { if (e.from === picked) s.add(e.to); if (e.to === picked) s.add(e.from) } }
    return s
  }, [picked, layout])
  /** The chosen skill's neighbours: what it builds on (blue) and what it leads to (orange). */
  const relation = useMemo(() => {
    const pre = new Set<string>(), lead = new Set<string>()
    if (picked) for (const e of layout.edges) { if (e.to === picked) pre.add(e.from); if (e.from === picked) lead.add(e.to) }
    return { pre, lead }
  }, [picked, layout])
  const pickedSkill = useMemo(() => (picked ? skills.find(x => x.id === picked) ?? null : null), [picked, skills])
  /** The other stages where the chosen skill has lessons: ghost markers on those rings (nothing is hidden, the move is an illusion). */
  const ghosts = useMemo(() => {
    if (!pickedSkill) return []
    return skillReturns(pickedSkill, lessons).flatMap(g => { const pos = ghostPosition(layout, pickedSkill.id, g.stageIndex); return pos ? [{ ...g, ...pos }] : [] })
  }, [pickedSkill, lessons, layout])
  useEffect(() => {
    if (highlightStage === null) return
    go({ x: 0, y: 0, k: 1 }) // a stage runs round the whole circle: show it all
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [highlightStage])
  useEffect(() => {
    if (!highlightStrand) return
    const ns = layout.nodes.filter(n => n.strand === highlightStrand); if (!ns.length) return
    const cx = ns.reduce((t, n) => t + n.x, 0) / ns.length, cy = ns.reduce((t, n) => t + n.y, 0) / ns.length
    go({ x: -cx, y: -cy, k: 1.6 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [highlightStrand, layout])
  /** Centre the camera on a map point, in the part of the map that is not covered by a panel (the side drawers, or the bottom sheet on a phone). */
  const centreOn = (x: number, y: number, minK: number) => {
    const el = svg.current; if (!el) return
    // on a phone the page is scrolled so the whole map workspace (toolbar and map) sits above the bottom sheet
    if (window.matchMedia?.('(max-width: 700px)').matches) el.closest('.radialmap')?.scrollIntoView({ block: 'start' })
    const box = el.getBoundingClientRect()
    const cover = (sel: string) => [...document.querySelectorAll(sel)].map(e => e.getBoundingClientRect())
    let left = box.left, right = box.right
    for (const r of cover('.sidechrome > .sidedrawer.left, .sidechrome > .detaildrawer')) if (r.right > left && r.left < box.left + box.width / 2) left = Math.max(left, r.right)
    for (const r of cover('.sidechrome > .sidedrawer.right')) if (r.left < right && r.right > box.left + box.width / 2) right = Math.min(right, r.left)
    const dx = ((left + right) / 2) - (box.left + box.width / 2)
    const sheet = document.querySelector('.dock.right')?.getBoundingClientRect()
    const dy = sheetOffset(box, sheet ?? null)
    const v = viewRef.current; const k = Math.max(v.k, minK); const upp = (2 * R) / k / Math.min(box.width, box.height); go({ x: -x + dx * upp, y: -y + dy * upp, k })
  }
  /** When a skill is chosen, bring it into the part of the map that is not covered by a panel, with its neighbours around it. */
  useEffect(() => {
    if (!picked) return
    const n = byId.get(picked); if (!n) return
    const t = window.setTimeout(() => centreOn(n.x, n.y, 1.8), 80)
    return () => window.clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [picked])
  // the panel's "Where this skill returns" buttons move the camera to the ghost marker on that stage's ring
  useEffect(() => onMapJump(j => { const g = ghostPosition(layout, j.skill, j.stage); if (g) centreOn(g.x, g.y, 2.2) }))
  const zoom = (f: number) => setView(v => ({ ...v, k: Math.max(0.25, Math.min(6, v.k * f)) }))
  const fit = () => go({ x: 0, y: 0, k: 1 })
  const locate = () => {
    // centre on the first skill that is started but not mastered, else the first not started
    const open = layout.nodes.filter(n => { const p = progress.get(n.id); return p && p.level < 4 && !p.noExercises })
    const cand = open.find(n => (progress.get(n.id)?.level ?? 0) > 0) ?? open.sort((a, b) => a.ring - b.ring || a.sub - b.sub)[0]
    if (cand) { go({ x: -cand.x, y: -cand.y, k: 2 }); onPick(cand.id) }
  }
  // a native, non-passive wheel listener: React's onWheel cannot stop the page from scrolling
  useEffect(() => {
    const el = svg.current; if (!el) return
    const h = (e: WheelEvent) => { e.preventDefault(); zoom(e.deltaY < 0 ? 1.12 : 1 / 1.12) }
    el.addEventListener('wheel', h, { passive: false })
    return () => el.removeEventListener('wheel', h)
  }, [])
  // the skill to do next: the one the path recommends, else the earliest skill that is ready and not yet mastered
  const rec = recommended ?? layout.nodes.filter(n => { const p = progress.get(n.id); return p && p.level < 4 && !p.noExercises && (readiness.get(n.id) ?? 0) >= 1 }).sort((a, b) => a.ring - b.ring || a.sub - b.sub)[0]?.id ?? null
  const hits = useMemo(() => {
    const t = q.trim().toLowerCase(); if (!t) return []
    return layout.nodes.map(n => ({ n, title: progress.get(n.id)?.title ?? n.id })).filter(x => x.title.toLowerCase().includes(t) || x.n.id.toLowerCase().includes(t)).slice(0, 8)
  }, [q, layout, progress])
  const showSkill = (id: string) => { const n = byId.get(id); if (!n) return; go({ x: -n.x, y: -n.y, k: Math.max(viewRef.current.k, 2.4) }); onPick(id); setQ(''); setListOpen(false) }
  useEffect(() => {
    const el = listRef.current; if (!el) return
    // a bottom sheet (phones) must not cover the list: the list ends above it
    const sheet = document.querySelector('.dock.right')?.getBoundingClientRect()
    const cap = listMaxHeight(el.getBoundingClientRect().top, sheet && sheet.width >= window.innerWidth * 0.8 ? sheet.top : null)
    el.style.maxHeight = cap === null ? '' : `${cap}px`
    el.querySelector('[aria-current]')?.scrollIntoView({ block: 'nearest' })
  }, [listOpen, picked, hits.length])
  const zone = zoomZone(view.k)
  const labelUnits = Math.max(26, Math.min(130, (15 * 2 * R) / view.k / 800)) // about 15 screen pixels, in map units
  const vb = `${-R / view.k - view.x} ${-R / view.k - view.y} ${(2 * R) / view.k} ${(2 * R) / view.k}`
  return (
    <div className="radialmap">
      <div className="mapbarwrap">
      <div className="row filters mapbar">
        <input type="search" className="mapsearch" value={q} onChange={e => { setQ(e.target.value); setListOpen(false) }} placeholder="Find a skill" aria-label="Find a skill on the map" onKeyDown={e => { if (e.key === 'Enter' && hits[0]) showSkill(hits[0].n.id) }} />
        <button type="button" onClick={() => zoom(1.3)} aria-label="Zoom in">＋</button>
        <button type="button" onClick={() => zoom(1 / 1.3)} aria-label="Zoom out">－</button>
        <button type="button" onClick={fit}>Fit all</button>
        <button type="button" onClick={locate}>Where I am</button>
        <button type="button" onClick={back} disabled={past.length === 0}>‹ Back</button>
        <button type="button" aria-expanded={listOpen} onClick={() => { setListOpen(o => !o); setQ('') }}>Skill list</button>
        <span className="maplegend small"><i className="swatch pre" />builds on <i className="swatch next" />leads to</span>
        <span className="small muted">Rings are the stages of the recommended path, slices are the subjects. Every skill can be picked at any time. Drag to move, scroll to zoom.</span>
      </div>
      {(hits.length > 0 || listOpen) && (
        <div className="maplist" role="listbox" aria-label="Skills" ref={listRef}>
          {hits.length === 0 && <div className="maplisthead"><span className="small muted">All skills, in map order. The one you picked is marked.</span><button type="button" onClick={() => setListOpen(false)}>Close list</button></div>}
          {hits.length > 0
            ? hits.map(h => <button key={h.n.id} type="button" role="option" aria-selected={picked === h.n.id} className={picked === h.n.id ? 'on' : undefined} onClick={() => showSkill(h.n.id)}>{h.title} <span className="muted small">· {h.n.strand}</span></button>)
            : REGIONS.map(rg => (
              <div key={rg.id}><strong className="small">{rg.name}</strong>
                {rg.strands.map(st => (
                  <div key={st}><span className="small muted">{st} {strandNames[st] ?? ''}</span>
                    <div className="maplistrow">{layout.nodes.filter(n => n.strand === st).sort((a, b) => a.ring - b.ring || a.sub - b.sub || a.id.localeCompare(b.id)).map(n => {
                      const t = progress.get(n.id)?.title ?? n.id, st2 = skillState(progress.get(n.id))
                      return <button key={n.id} type="button" className={picked === n.id ? 'link on' : 'link'} aria-current={picked === n.id ? 'true' : undefined} aria-label={`${t}, ${st2.word}${picked === n.id ? ', selected' : ''}`} onClick={() => showSkill(n.id)}><span aria-hidden="true" className="listmark">{st2.mark}</span>{t}</button>
                    })}</div>
                  </div>))}
              </div>))}
        </div>
      )}
      </div>
      <svg ref={svg} className={`mapsvg zoom-${zone}${highlightStrand ? ' hasHi' : ''}${highlightStage !== null ? ' hasStageHi' : ''}`} viewBox={vb} role="group" aria-label="Curriculum map"
        onPointerDown={e => {
          if (ptrs.current.size === 0) { suppressClick.current = false; pinch.current = null; moved.current = false }
          ptrs.current.set(e.pointerId, { x: e.clientX, y: e.clientY }); lastType.current = e.pointerType;
          (e.target as Element).setPointerCapture?.(e.pointerId)
          if (ptrs.current.size === 2 && svg.current) {
            // a second finger: from now on the gesture is a pinch (zoom and pan together); it never selects a skill
            const [a, b] = [...ptrs.current.values()]
            pinch.current = { cam: viewRef.current, from: pinchGeometry(a, b) }
            drag.current = null; suppressClick.current = true
          } else if (ptrs.current.size === 1) drag.current = { x: e.clientX, y: e.clientY, vx: view.x, vy: view.y }
          else drag.current = null
        }}
        onPointerMove={e => {
          if (ptrs.current.has(e.pointerId)) ptrs.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
          if (pinch.current && ptrs.current.size >= 2 && svg.current) {
            const [a, b] = [...ptrs.current.values()]
            const r = svg.current.getBoundingClientRect()
            setView(viewForPinch(pinch.current.cam, pinch.current.from, pinchGeometry(a, b), R, r))
            return
          }
          const d = drag.current; if (!d || !svg.current) return
          if (e.pointerType === 'touch' && Math.hypot(e.clientX - d.x, e.clientY - d.y) > TAP_SLOP) { moved.current = true; suppressClick.current = true }
          const scale = (2 * R) / view.k / svg.current.getBoundingClientRect().width
          setView(v => ({ ...v, x: d.vx + (e.clientX - d.x) * scale, y: d.vy + (e.clientY - d.y) * scale }))
        }}
        onPointerUp={endPointer}
        onPointerCancel={endPointer}
        onClickCapture={e => { if (suppressClick.current) { e.stopPropagation(); e.preventDefault() } }}
        onDoubleClick={e => {
          // mouse: a double click zooms in on that point (touch has its own double tap above)
          if (lastType.current === 'touch' || !svg.current) return
          setView(zoomAt(viewRef.current, 1.8, R, svg.current.getBoundingClientRect(), e.clientX, e.clientY))
        }}>
        {layout.wedges.map(w => {
          const edge = (a: number) => `${Math.cos(a) * layout.radius},${Math.sin(a) * layout.radius}`
          return (
            <g key={w.strand} className={`mapwedge${highlightStrand === w.strand ? ' hi' : ''}`}>
              <path d={`M0,0 L${edge(w.from)} A${layout.radius},${layout.radius} 0 ${w.to - w.from > Math.PI ? 1 : 0} 1 ${edge(w.to)} Z`} className="wedgebg" />
            </g>
          )
        })}
        {/* section names: big, bold, curved round the outside of each slice, outside the region arc */}
        {layout.wedges.map(w => {
          const text = `${w.strand} ${strandNames[w.strand] ?? ''}`.trim()
          const rS = layout.radius + 70
          const size = fitSize((w.to - w.from) * rS, text.length, 0.6, 40, 92)
          return <ArcLabel key={`sl-${w.strand}`} id={`arc-${w.strand}`} mid={(w.from + w.to) / 2} radius={rS} text={text} size={size} className={`arclabel strand${highlightStrand === w.strand ? ' hi' : ''}`} />
        })}
        {/* stage rings: one band per stage of the recommended path; the learner's current stage is emphasised, a chosen stage is lit */}
        {layout.stages.map(st => {
          const ring = (r: number) => `M${r},0 A${r},${r} 0 1 1 ${-r},0 A${r},${r} 0 1 1 ${r},0 Z`
          return <path key={`stage-${st.index}`} d={st.inner > 0 ? ring(st.outer) + ring(st.inner) : ring(st.outer)} fillRule="evenodd" pointerEvents="none"
            className={`stageband${highlightStage === st.index ? ' hi' : ''}${hereStage === st.index ? ' here' : ''}`} />
        })}
        {layout.stages.map(st => {
          const t = PATH_STAGES[st.index]; if (!t) return null
          const here = hereStage === st.index, nm = `Stage ${st.index + 1}`
          const plan = ringLabelPlan(st.mid, labelUnits, here ? [`You are here · ${nm} · ${t.title}`, `You are here · ${nm}`, nm] : [`${nm} · ${t.title}`, nm])
          return <TextRing key={`sn-${st.index}`} id={`arc-stage-${st.index}`} outer={st.outer} text={plan.text} size={Math.min(plan.size, RING_TEXT_MAX)} className={`arclabel stagename${here ? ' here' : ''}${highlightStage === st.index ? ' hi' : ''}`} />
        })}
        {/* broad regions round the outside; readable when the section names are too small */}
        {REGIONS.map(rg => {
          const ws = layout.wedges.filter(w => rg.strands.includes(w.strand)); if (!ws.length) return null
          const from = ws[0].from, to = ws[ws.length - 1].to, mid = (from + to) / 2, r0 = layout.radius + 14
          const pt = (a: number, r: number) => `${Math.cos(a) * r},${Math.sin(a) * r}`
          return (
            <g key={rg.id} className="mapregion" pointerEvents="none">
              <path d={`M${pt(from + 0.01, r0)} A${r0},${r0} 0 ${to - from > Math.PI ? 1 : 0} 1 ${pt(to - 0.01, r0)}`} className="regionarc" fill="none" />
              <ArcLabel id={`arc-${rg.id}`} mid={mid} radius={layout.radius + 215} text={rg.name} size={fitSize((to - from) * (layout.radius + 215), rg.name.length, 0.62, 50, 84)} className="arclabel region" />
            </g>
          )
        })}
        <defs>
          <marker id="arrow-pre" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" className="arrowpre" /></marker>
          <marker id="arrow-next" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" className="arrownext" /></marker>
        </defs>
        {layout.edges.map(e => {
          const a = byId.get(e.from), b = byId.get(e.to); if (!a || !b) return null
          const focus = picked ?? hov
          // the chosen skill (or the one under the pointer): blue lines come IN from what it builds on, orange lines go OUT to what it leads to
          const pre = focus !== null && e.to === focus
          const next = focus !== null && e.from === focus
          // the path to a skill brightens as its prerequisites are done and is brightest when all of them are; it fades as the skill itself is mastered
          // (the light moves on to what comes next). Paths from skills you have not touched stay dark.
          const c = pathLight.share(e.from), tl = level(e.to)
          const light = tl >= 4 ? 0 : c * (0.25 + 0.75 * (pathLight.total.get(e.to) ?? 0)) * (tl >= 2 ? 0.5 : 1)
          const lit = light > 0.02
          if (pre || next) {
            // stop the line at the edge of the target node so the arrowhead is visible
            const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy) || 1, r = 24
            return <line key={`${e.from}>${e.to}`} x1={a.x + (dx / len) * r} y1={a.y + (dy / len) * r} x2={b.x - (dx / len) * r} y2={b.y - (dy / len) * r} className={pre ? 'mapedge pre' : 'mapedge next'} markerEnd={pre ? 'url(#arrow-pre)' : 'url(#arrow-next)'} />
          }
          return <line key={`${e.from}>${e.to}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} className={lit ? 'mapedge lit' : 'mapedge'} style={lit ? { opacity: 0.12 + 0.88 * light, strokeWidth: 1.5 + 3 * light } : undefined} />
        })}
        {layout.nodes.map(n => {
          const p = progress.get(n.id)
          const lvl = level(n.id)
          const ready = (readiness.get(n.id) ?? 0)
          const next = lvl < 4 && ready >= 1 && !p?.noExercises
          const dim = (picked && !linked.has(n.id)) || (!picked && ((highlightStrand && n.strand !== highlightStrand) || (highlightStage !== null && n.stage !== highlightStage)))
          const cid = `cp-${n.id.replace(/[^A-Za-z0-9]/g, '_')}`
          // unstarted skills fade with how few of their prerequisites are done, but stay readable
          const op = lvl > 0 || next ? 1 : 0.62 + 0.38 * ready
          return (
            <g key={n.id} onMouseEnter={e => showTip(n.id, e.currentTarget)} onMouseLeave={hideTip} onFocus={e => showTip(n.id, e.currentTarget)} className={`mapnode${picked === n.id ? ' sel' : ''}${dim ? ' dim' : ''}${relation.pre.has(n.id) ? ' prereq' : ''}${relation.lead.has(n.id) ? ' leadsto' : ''}${p?.due ? ' due' : ''}${next ? ' next' : ''}`} transform={`translate(${n.x},${n.y})`} style={dim ? undefined : { opacity: op }}
              tabIndex={0} role="button" aria-label={`${p?.title ?? n.id}, ${stageSentence(n.stage)}, ${LEVEL_NAMES[lvl]}${next ? ', ready to start' : ''}`}
              onClick={() => onPick(n.id)} data-id={n.id} onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onPick(n.id) }
                else if (['ArrowRight', 'ArrowUp', 'ArrowLeft', 'ArrowDown'].includes(e.key)) {
                  // along the links: right or up goes on to a skill this one leads to, left or down goes back to one it builds on
                  const fwd = e.key === 'ArrowRight' || e.key === 'ArrowUp'
                  const targets = layout.edges.filter(x => (fwd ? x.from : x.to) === n.id).map(x => (fwd ? x.to : x.from))
                  const t = targets.sort((p, q) => level(p) - level(q))[0]
                  if (t) { e.preventDefault(); (svg.current?.querySelector(`[data-id="${t}"]`) as SVGElement | null)?.focus() }
                }
              }}>
              {next && <circle r={32} className="nodeglow" />}
              <clipPath id={cid}><rect x={-22} y={22 - 44 * (lvl / 4)} width={44} height={44} /></clipPath>
              <circle r={22} fill="var(--canvas)" className="nodebase" />
              {lvl > 0 && <circle r={22} fill={lvl === 4 ? 'var(--success)' : 'var(--info)'} clipPath={`url(#${cid})`} />}
              <circle r={22} fill="none" className="nodecircle" />
              {p?.hasLesson && p.lessonDone && <text className="nodemark" textAnchor="middle" dy="5">✓</text>}
              {picked !== n.id && hov !== n.id && !(dim && zone !== 'near') && (zone !== 'far' || relation.pre.has(n.id) || relation.lead.has(n.id)) && <text className="nodelabel" y={40} textAnchor="middle">{(p?.title ?? n.id).slice(0, 26)}</text>}
              {zone === 'near' && picked !== n.id && hov !== n.id && <text className="nodestatus" y={62} textAnchor="middle">{LEVEL_NAMES[lvl]}{p?.lessonDone ? ' · lesson done' : ''}</text>}
            </g>
          )
        })}
        {/* ghost markers: where the chosen skill returns on the other stage rings; each is a button that moves the camera there */}
        {pickedSkill && byId.get(pickedSkill.id) && ghosts.map(g => {
          const n = byId.get(pickedSkill.id)!
          const what = g.items.map(i => i.adds).join(', ')
          return (
            <g key={`ghost-${g.stageId}`} className="mapghost">
              <line x1={n.x} y1={n.y} x2={g.x} y2={g.y} className="ghostline" pointerEvents="none" />
              <g transform={`translate(${g.x},${g.y}) scale(${Math.max(1, Math.min(5, 3.2 / view.k))})`} tabIndex={0} role="button" className="ghostmark" aria-label={`${pickedSkill.title} returns in ${stageSentence(g.stageIndex)}: ${what}. Move the map here.`}
                onClick={() => centreOn(g.x, g.y, 2.2)} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); centreOn(g.x, g.y, 2.2) } }}>
                <circle r={24} className="ghostring" />
                <text className="ghostnum" textAnchor="middle" dy="8">{g.stageIndex + 1}</text>
              </g>
            </g>
          )
        })}
        {/* top layer: the hovered and the chosen skill are redrawn last, fully visible, with a readable label, whatever is dimmed or crowded around them */}
        {[...new Set([picked, hov, linkedHoverId].filter((x): x is string => !!x))].map(id => {
          const n = byId.get(id); if (!n) return null
          return (
            <g key={`top-${id}`} transform={`translate(${n.x},${n.y})`} className={`maptop${id === picked ? ' sel' : ''}`} pointerEvents="none">
              <circle r={27} className="topring" fill="none" />
              <text className="toplabel" y={52} textAnchor="middle">{progress.get(id)?.title ?? id}</text>
            </g>
          )
        })}
        {rec && byId.get(rec) && picked !== rec && (() => {
          const n = byId.get(rec)!
          return (
            <g transform={`translate(${n.x},${n.y})`} className="maprec" pointerEvents="none">
              <circle r={42} className="recring" fill="none" />
              <rect x={-86} y={-78} width={172} height={34} rx={17} className="recpill" />
              <text y={-55} textAnchor="middle" className="rectext">Your next step</text>
            </g>
          )
        })()}
        <circle r={5} className="mapcentre" />
      </svg>
      <svg className="minimap" viewBox={`${-R} ${-R} ${2 * R} ${2 * R}`} role="img" aria-label="Overview of the whole map"
        onPointerDown={e => { const b = e.currentTarget.getBoundingClientRect(); const fx = ((e.clientX - b.left) / b.width) * 2 * R - R, fy = ((e.clientY - b.top) / b.height) * 2 * R - R; go({ x: -fx, y: -fy, k: viewRef.current.k }) }}>
        <circle r={layout.radius} className="miniback" />
        {layout.nodes.map(n => <circle key={n.id} cx={n.x} cy={n.y} r={n.id === linkedHoverId ? 40 : n.id === rec ? 26 : 12} className={n.id === linkedHoverId ? 'minilink' : n.id === rec ? 'minirec' : (progress.get(n.id)?.level ?? 0) > 0 ? 'minidone' : 'minidot'} />)}
        <rect x={-view.x - R / view.k} y={-view.y - R / view.k} width={(2 * R) / view.k} height={(2 * R) / view.k} className="miniview" />
      </svg>
      {tip && (() => {
        const p = progress.get(tip.id), sk = skills.find(x => x.id === tip.id)
        const sl = lessonsForSkill(lessons, tip.id)
        const ls = sl.teaching.length ? sl.teaching : sl.alsoTeaching // the skill's own teaching lessons; course applications and checks are not counted as its lessons
        const first = primaryLesson(lessons, tip.id, id => !!doneBy.get(id)?.done) ?? ls[0]
        const allDone = ls.length > 0 && ls.every(l => doneBy.get(l.id)?.done)
        return (
          <div className={`maptip ${tip.corner}`} role="tooltip" onMouseEnter={() => window.clearTimeout(hideTimer.current)} onMouseLeave={hideTip}>
            <h3>{p?.title ?? tip.id}{tip.id === rec && <span className="upnextbadge">Up next</span>}</h3>
            <p className="small"><strong>{stageSentence(homeStages.get(tip.id) ?? 0)}</strong>{homeStages.get(tip.id) === hereStage ? ' · you are here' : ''}</p>
            <p className="small muted">{sk?.strand} {strandNames[sk?.strand ?? ''] ?? ''} · tier {sk?.tier} · {LEVEL_NAMES[Math.min(4, p?.level ?? 0)]}{p?.due ? ' · refresher due' : ''}{p?.assumed ? ' · assumed from a test-out' : ''}</p>
            <p className="small">{ls.length === 0 ? 'No lesson for this skill yet.' : `${ls.filter(l => doneBy.get(l.id)?.done).length} of ${ls.length} lesson${ls.length === 1 ? '' : 's'} finished`}</p>
            <div className="row">
              {ls.length > 0 && !allDone && <button type="button" onClick={() => void mark(ls.map(l => l.id), true)}>Mark as already done</button>}
              {ls.some(l => doneBy.get(l.id)) && <button type="button" className="link" onClick={() => void mark(ls.map(l => l.id), false)}>Reset</button>}
              {first && <button type="button" className="link" onClick={() => navigate(`/lesson/${first.id}`)}>Open lesson</button>}<button type="button" className="link" onClick={() => onPick(tip.id)}>Details</button>
            </div>
          </div>
        )
      })()}
    </div>
  )
}
