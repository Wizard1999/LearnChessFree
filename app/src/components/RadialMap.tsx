import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactElement, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { db, type LessonProgress } from '../db'
import { ghostPosition, layoutMap } from '../lib/mapLayout'
import { LEVEL_NAMES, type NodeProgress } from '../lib/missions'
import { skillState, sheetOffset, listMaxHeight } from '../lib/mapSheet'
import { REGIONS, regionOfStrand, tintOfStrand } from '../lib/mapRegions'
import { PATH_STAGES } from '../lib/pathStages'
import { currentStageIndex, skillHomeStages, skillReturns, stageSentence } from '../lib/skillStages'
import { onMapJump } from '../lib/mapJump'
import { ringLabelPlan, ringTextPaths, zoomZone } from '../lib/mapZoom'
import { planLabels, type LabelNode } from '../lib/mapLabels'
import { setLinkedHover, useLinkedHover } from '../lib/linkedHover'
import { lessonsForSkill, primaryLesson } from '../lib/lessonRoles'
import { saveFinished, resetProgress } from '../lib/lessonSave'
import { TAP_SLOP, isDoubleTap, pinchGeometry, viewForPinch, zoomAt, type Cam, type Pinch } from '../lib/mapGesture'
import { hueOfStrand } from '../lib/hue'
import type { LessonMeta, Skill } from '../types'

interface Props { /** Controls placed at the start of the toolbar (the view, section and stage menus), so everything sits on one line. */ toolbarLead?: ReactNode; skills: Skill[]; progress: Map<string, NodeProgress>; picked: string | null; onPick: (id: string) => void; strandNames: Record<string, string>; /** A strand to emphasise: its nodes stay bright, the rest dim, and the view moves to it. */ highlightStrand?: string | null; lessons: LessonMeta[]; lessonProgress: LessonProgress[]; /** The skill of the lesson recommended next: marked on the map so the next step is unmistakable. */ recommended?: string | null; /** The next few skills (prerequisites met): their names stay visible. */ upNext?: string[]; /** A stage (index 0..7) to light on every slice; the rest dim. */ highlightStage?: number | null }

/** Text that follows an arc of a circle round the map, centred on `mid` (radians), reading upright: on the top half it runs clockwise outside the baseline,
 * on the bottom half the path is reversed so the letters are not upside down. The size shrinks to fit the arc a label may use. */
function ArcLabel({ id, mid, radius, text, size, className, region }: { id: string; mid: number; radius: number; text: string; size: number; className: string; region?: string }) {
  const top = Math.sin(mid) <= 0
  const r = top ? radius - size * 0.33 : radius + size * 0.33
  const half = Math.min(Math.PI * 0.95, (text.length * size * 0.6) / r / 2 + 0.03)
  const a1 = mid - half, a2 = mid + half
  const p = (a: number) => `${Math.cos(a) * r},${Math.sin(a) * r}`
  const d = top ? `M${p(a1)} A${r},${r} 0 0 1 ${p(a2)}` : `M${p(a2)} A${r},${r} 0 0 0 ${p(a1)}`
  return (
    <g pointerEvents="none" data-region={region}>
      <path id={id} d={d} fill="none" stroke="none" />
      <text className={className} fontSize={size}><textPath href={`#${id}`} startOffset="50%" textAnchor="middle">{text}</textPath></text>
    </g>
  )
}
/** The empty channel between two stage rings is 2 x (EDGE_PAD - node radius); the divider text must fit inside it. */
const RING_TEXT_MAX = 56
const RING_TEXT_TINY = 9
const fitSize =(arc: number, chars: number, factor: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, (arc * 0.92) / (chars * factor)))

/** A stage boundary that IS its label, kept calm (8 Nov 2026): round most of the circle the words are a whisper (tiny, so the ring reads as a thin line until you
 * zoom right in); where the ring crosses the vertical centreline (top and bottom of the circle) they are large, upright and readable. Two half circles carry the whisper so it reads upright everywhere. */
function TextRing({ id, outer, tiny, big, text, bigText, className }: { id: string; outer: number; tiny: number; big: number; text: string; bigText: string; className: string }) {
  const unit = `${text}   \u2022   `
  const fit = Math.min(tiny, (Math.PI * outer * 0.97) / (unit.length * 0.6))
  const { rTop: rt, rBottom: rb } = ringTextPaths(outer, fit)
  // the large words sit at the top and bottom of the circle (the vertical centreline); the small text runs on from either side of them, so the ring is one
  // continuous line of text with a larger middle and nothing overlaps: each half circle is cut into two pieces that stop a gap short of the large words
  const span = Math.min(Math.PI * 0.8, (bigText.length * big * 0.6) / outer), gap = span / 2 + (big * 0.9) / outer
  const rT = outer - big * 0.34, rB = outer + big * 0.34
  const pt = (a: number, r: number) => `${(r * Math.cos(a)).toFixed(2)},${(r * Math.sin(a)).toFixed(2)}`
  const P = Math.PI
  const topPath = `M${pt(-P / 2 - span / 2, rT)} A${rT},${rT} 0 0 1 ${pt(-P / 2 + span / 2, rT)}`
  const bottomPath = `M${pt(P / 2 + span / 2, rB)} A${rB},${rB} 0 0 0 ${pt(P / 2 - span / 2, rB)}`
  // [from angle, to angle, radius, clockwise]: top half runs left to right over the top (clockwise), bottom half left to right along the bottom (counter-clockwise)
  const pieces: [number, number, number, boolean][] = [
    [P, 1.5 * P - gap, rt, true], [1.5 * P + gap, 2 * P, rt, true],
    [P, P / 2 + gap, rb, false], [P / 2 - gap, 0, rb, false],
  ]
  return (
    <g pointerEvents="none">
      <path id={`${id}-r`} d={topPath} fill="none" stroke="none" />
      <path id={`${id}-l`} d={bottomPath} fill="none" stroke="none" />
      {pieces.map(([a1, a2, r, cw], i) => {
        if (cw ? a2 <= a1 : a1 <= a2) return null
        const len = r * Math.abs(a2 - a1), n = Math.floor(len / (unit.length * fit * 0.6))
        if (n < 1) return null
        return (
          <g key={i}>
            <path id={`${id}-w${i}`} d={`M${pt(a1, r)} A${r},${r} 0 0 ${cw ? 1 : 0} ${pt(a2, r)}`} fill="none" stroke="none" />
            <text className={`${className} whisper`} fontSize={fit}><textPath href={`#${id}-w${i}`} textLength={len * 0.99} lengthAdjust="spacing">{unit.repeat(n)}</textPath></text>
          </g>
        )
      })}
      <text className={className} fontSize={big} textAnchor="middle"><textPath href={`#${id}-r`} startOffset="50%">{bigText}</textPath></text>
      <text className={className} fontSize={big} textAnchor="middle"><textPath href={`#${id}-l`} startOffset="50%">{bigText}</textPath></text>
    </g>
  )
}
/** The curriculum as a map: the first skill at the centre, one ring per stage of the recommended path, a wedge per subject (strand). Pan by dragging,
 * zoom with the wheel or the buttons; arrow keys move between connected skills when a skill is focused. */
export function RadialMap({ toolbarLead, skills, progress, picked, onPick, strandNames, highlightStrand = null, lessons, lessonProgress, recommended = null, upNext = [], highlightStage = null }: Props) {
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
  /** Completion as the average level reached, as a percentage (the same sum the Progress window uses), for the whole map, each section, region and stage. */
  const pct = useMemo(() => {
    const mean = (ids: string[]) => (ids.length ? Math.round((100 * ids.reduce((sum, id) => sum + Math.min(4, progress.get(id)?.level ?? 0), 0)) / (4 * ids.length)) : 0)
    const by = (f: (n: (typeof layout.nodes)[number]) => boolean) => mean(layout.nodes.filter(f).map(n => n.id))
    return {
      all: by(() => true),
      strand: (s: string) => by(n => n.strand === s),
      region: (strands: string[]) => by(n => strands.includes(n.strand)),
      stage: (i: number) => by(n => n.stage === i),
    }
  }, [layout, progress])
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
  // skill names are planned in screen pixels: the size of the svg area on screen
  const [box, setBox] = useState({ w: 0, h: 0, left: 0, top: 0 })
  useEffect(() => {
    const el = svg.current; if (!el) return
    const measure = () => { const r = el.getBoundingClientRect(), pr = el.parentElement?.getBoundingClientRect(); setBox({ w: r.width, h: r.height, left: r.left - (pr?.left ?? 0), top: r.top - (pr?.top ?? 0) }) }
    measure()
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null
    ro?.observe(el); window.addEventListener('resize', measure)
    return () => { ro?.disconnect(); window.removeEventListener('resize', measure) }
  }, [])
  const labelPlan = useMemo(() => {
    const dimNode = (n: { id: string; strand: string; stage?: number }) => (picked && !linked.has(n.id)) || (!picked && ((highlightStrand && n.strand !== highlightStrand) || (highlightStage !== null && n.stage !== highlightStage)))
    // the names always shown besides the chosen skill: the next few skills (their prerequisites are met) and the few most recently worked on, so the map stays calm
    const upNextSet = new Set(upNext)
    const working = new Set([...progress.values()].filter(p => p.level > 0 && p.level < 4 && !p.noExercises).sort((a, b) => (b.lastTs ?? 0) - (a.lastTs ?? 0)).slice(0, 4).map(p => p.id))
    const nodes: LabelNode[] = layout.nodes.map(n => {
      const p = progress.get(n.id)
      let priority = 0
      if (n.id === picked) priority = 1000
      else if (n.id === rec) priority = 800
      else if (dimNode(n as never)) priority = 0
      else if (upNextSet.has(n.id)) priority = 150
      else if (working.has(n.id)) priority = 120
      return { id: n.id, x: n.x, y: n.y, title: p?.title ?? n.id, priority, ring: n.ring }
    })
    // far away only the important names; closer in, every name that fits without touching another
    return planLabels(nodes, view, R, box.w, box.h, { fontPx: 14, minPriority: 100 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layout, view, R, box, picked, rec, upNext, progress, highlightStrand, highlightStage, linked])
  // the hovered name never changes the plan (nothing moves or resizes): it is lit if it already has a plate, otherwise one plate is added on its own
  const hotId = hov ?? linkedHoverId ?? null
  const [lastHot, setLastHot] = useState<string | null>(null)
  useEffect(() => { if (hotId) setLastHot(hotId) }, [hotId])
  const hotExtra = useMemo(() => {
    if (!lastHot || labelPlan.some(l => l.id === lastHot)) return null
    const n = layout.nodes.find(x => x.id === lastHot); if (!n) return null
    return planLabels([{ id: n.id, x: n.x, y: n.y, title: progress.get(n.id)?.title ?? n.id, priority: 100, ring: n.ring }], view, R, box.w, box.h, { fontPx: 14, minPriority: 0 })[0] ?? null
  }, [lastHot, labelPlan, layout, progress, view, R, box])
  const labelUnits = Math.max(26, Math.min(130, (15 * 2 * R) / view.k / 800)) // about 15 screen pixels, in map units
  const vb = `${-R / view.k - view.x} ${-R / view.k - view.y} ${(2 * R) / view.k} ${(2 * R) / view.k}`
  return (
    <div className="radialmap">
      <div className="mapbarwrap">
      <div className="row filters mapbar">
        {toolbarLead}
        <input type="search" className="mapsearch" value={q} onChange={e => { setQ(e.target.value); setListOpen(false) }} placeholder="Find a skill" aria-label="Find a skill on the map" onKeyDown={e => { if (e.key === 'Enter' && hits[0]) showSkill(hits[0].n.id) }} />
        <button type="button" onClick={() => zoom(1.3)} aria-label="Zoom in">＋</button>
        <button type="button" onClick={() => zoom(1 / 1.3)} aria-label="Zoom out">－</button>
        <button type="button" onClick={fit}>Fit all</button>
        <button type="button" onClick={locate}>Where I am</button>
        <button type="button" onClick={back} disabled={past.length === 0}>‹ Back</button>
        <button type="button" aria-expanded={listOpen} onClick={() => { setListOpen(o => !o); setQ('') }}>Skill list</button>
        {picked && <span className="maplegend small"><i className="swatch pre" />builds on <i className="swatch next" />leads to</span>}
        <span className="levellegend small" aria-label="Skill colours">{LEVEL_NAMES.map((nm, i) => <span key={nm} className="lvkey"><i className={`lvdot lv${i}`} />{nm}</span>)}</span>
        <span className="small"><strong>Overall {pct.all}%</strong></span>
      </div>
      {/* skill names: plates in screen pixels above the map and its stage rings, planned so no two overlap and each is easy to read */}
      <div className="maplabels" aria-hidden="true" style={{ left: box.left, top: box.top, width: box.w, height: box.h }}>
        {(hotExtra ? [...labelPlan, hotExtra] : labelPlan).map(l => <span key={l.id} className={`maplabel${l.forced ? ' forced' : ''}${l.id === picked ? ' sel' : ''}${l.id === hotId ? ' hot' : ''}${hotExtra && l.id === hotExtra.id ? ` ghost${hotId === l.id ? ' on' : ''}` : ''}`} style={{ left: l.box.x, top: l.box.y, minWidth: l.box.w, height: l.box.h }}>{l.text}</span>)}
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
            <g key={w.strand} className={`mapwedge${highlightStrand === w.strand ? ' hi' : ''}`} data-hue={hueOfStrand(w.strand)} data-region={regionOfStrand(w.strand)} data-tint={tintOfStrand(w.strand)}>
              <path d={`M0,0 L${edge(w.from)} A${layout.radius},${layout.radius} 0 ${w.to - w.from > Math.PI ? 1 : 0} 1 ${edge(w.to)} Z`} className="wedgebg" />
            </g>
          )
        })}
        {/* section names: big, bold, curved round the outside of each slice, outside the region arc */}
        {layout.wedges.map(w => {
          const text = `${w.strand} ${strandNames[w.strand] ?? ''}`.trim() + ` (${pct.strand(w.strand)}%)`
          const rS = layout.radius + 70
          const size = fitSize((w.to - w.from) * rS, text.length, 0.6, 40, 92)
          return <ArcLabel key={`sl-${w.strand}`} id={`arc-${w.strand}`} mid={(w.from + w.to) / 2} radius={rS} text={text} size={size} region={regionOfStrand(w.strand)} className={`arclabel strand${highlightStrand === w.strand ? ' hi' : ''}`} />
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
          const sp = `(${pct.stage(st.index)}%)`, full = `${nm}: ${t.title} ${sp}`
          const plan = ringLabelPlan(st.mid, labelUnits, here ? [`You are here · ${full}`, full, `${nm} ${sp}`] : [full, `${nm} ${sp}`], 2.5, here ? 1 : 0)
          return <TextRing key={`sn-${st.index}`} id={`arc-stage-${st.index}`} outer={st.outer} text={`${nm} · ${t.title}`} bigText={plan.text} tiny={Math.min(RING_TEXT_TINY, plan.size)} big={Math.min(plan.size, RING_TEXT_MAX)} className={`arclabel stagename${here ? ' here' : ''}${highlightStage === st.index ? ' hi' : ''}`} />
        })}
        {/* broad regions round the outside; readable when the section names are too small */}
        {REGIONS.map(rg => {
          const ws = layout.wedges.filter(w => rg.strands.includes(w.strand)); if (!ws.length) return null
          const from = ws[0].from, to = ws[ws.length - 1].to, mid = (from + to) / 2, r0 = layout.radius + 14
          const rgText = rg.strands.length > 1 ? `${rg.name} (${pct.region(rg.strands)}%)` : rg.name // one section: its own percentage already says it
          const pt = (a: number, r: number) => `${Math.cos(a) * r},${Math.sin(a) * r}`
          return (
            <g key={rg.id} className="mapregion" pointerEvents="none" data-region={String(REGIONS.indexOf(rg) + 1)}>
              <path d={`M${pt(from + 0.01, r0)} A${r0},${r0} 0 ${to - from > Math.PI ? 1 : 0} 1 ${pt(to - 0.01, r0)}`} className="regionarc" fill="none" />
              <ArcLabel id={`arc-${rg.id}`} mid={mid} radius={layout.radius + 215} text={rgText} size={fitSize((to - from) * (layout.radius + 215), rgText.length, 0.62, 50, 84)} className="arclabel region" region={String(REGIONS.indexOf(rg) + 1)} />
            </g>
          )
        })}
        <defs>
          <marker id="arrow-pre" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" className="arrowpre" /></marker>
          <marker id="arrow-next" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" className="arrownext" /></marker>
          {/* the Scholarmate look draws what a skill leads to with a dashed line and an open head, so the two kinds of link differ in shape as well as colour */}
          <marker id="arrow-next-open" viewBox="-1 -1 12 12" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" className="arrownextopen" /></marker>
        </defs>
        {/* a constellation you build as you learn: lines between skills you have worked on are bright, the lines that lead on to the skills you can branch out to
            are the brightest of all (full strength once every prerequisite is done), and lines between skills you have never touched are very faint but never gone */}
        {(() => {
          const els: { tier: string; el: ReactElement }[] = []
          for (const e of layout.edges) {
            const a = byId.get(e.from), b = byId.get(e.to); if (!a || !b) continue
            const focus = picked ?? hov
            const pre = focus !== null && e.to === focus
            const next = focus !== null && e.from === focus
            if (pre || next) {
              // stop the line at the edge of the target node so the arrowhead is visible
              const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy) || 1, r = 24
              els.push({ tier: 'frontier', el: <line key={`${e.from}>${e.to}`} x1={a.x + (dx / len) * r} y1={a.y + (dy / len) * r} x2={b.x - (dx / len) * r} y2={b.y - (dy / len) * r} className={pre ? 'mapedge pre' : 'mapedge next'} markerEnd={pre ? 'url(#arrow-pre)' : 'url(#arrow-next)'} /> })
              continue
            }
            const lf = level(e.from), lt = level(e.to), strength = pathLight.total.get(e.to) ?? 0
            let tier = 'base', cls = 'mapedge', style: CSSProperties = { opacity: 0.07, strokeWidth: 1 }
            if (lf >= 1 && lt >= 1) { const lo = Math.min(lf, lt, 4); tier = `built b${lo}`; cls = `mapedge built b${lo}`; style = { opacity: 0.55 + 0.3 * Math.min(1, (lf + lt) / 6), strokeWidth: 2.2 } }
            else if (lf >= 1 && lt < 1) {
              // only a skill with every prerequisite done is a branch you can take now: those lines are the fierce ones; a half-opened path is a quiet line
              if (strength >= 0.999) { tier = 'frontier'; cls = 'mapedge frontier full'; style = { opacity: 1, strokeWidth: 4.4 } }
              else { cls = 'mapedge partial'; style = { opacity: 0.12 + 0.3 * strength, strokeWidth: 1.2 + 0.8 * strength } }
            }
            els.push({ tier, el: <line key={`${e.from}>${e.to}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} className={cls} style={style} /> })
          }
          return ['base', 'built b1', 'built b2', 'built b3', 'built b4', 'frontier'].map(t => <g key={t} className={`edges ${t}`}>{els.filter(x => x.tier === t).map(x => x.el)}</g>)
        })()}
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
            <g key={n.id} onMouseEnter={e => showTip(n.id, e.currentTarget)} onMouseLeave={hideTip} data-hue={hueOfStrand(n.strand)} onFocus={e => showTip(n.id, e.currentTarget)} className={`mapnode${picked === n.id ? ' sel' : ''}${dim ? ' dim' : ''}${relation.pre.has(n.id) ? ' prereq' : ''}${relation.lead.has(n.id) ? ' leadsto' : ''}${p?.due ? ' due' : ''}${next ? ' next' : ''}`} transform={`translate(${n.x},${n.y})`} style={dim ? undefined : { opacity: op }}
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
              {next && <circle r={36} className="nodeglow" />}
              {!next && lvl > 0 && <circle r={31} className={`nodeglow soft lv${lvl}`} />}
              <clipPath id={cid}><rect x={-22} y={22 - 44 * (lvl / 4)} width={44} height={44} /></clipPath>
              <circle r={22} fill="var(--canvas)" className="nodebase" />
              {lvl > 0 && <circle r={22} fill={lvl === 4 ? 'var(--success)' : 'var(--info)'} clipPath={`url(#${cid})`} className="oldfill" />}
              {lvl > 0 && <circle r={22} className={`nodefill lv${lvl}`} />}
              <circle r={22} fill="none" className="nodecircle" />
              {p?.hasLesson && p.lessonDone && <text className={`nodemark lv${lvl}`} textAnchor="middle" dy="5">✓</text>}
              {lvl > 0 && <g className={`nodepips lv${lvl}`} aria-hidden="true">{lvl === 4 ? <path className="nodestar" d="M0.0,-18.5 L1.8,-13.5 L7.1,-13.3 L2.9,-10.0 L4.4,-4.9 L0.0,-7.9 L-4.4,-4.9 L-2.9,-10.0 L-7.1,-13.3 L-1.8,-13.5 Z" /> : Array.from({ length: lvl }, (_, i) => <circle key={i} className="nodepip" r={2.7} cx={(i - (lvl - 1) / 2) * 7.5} cy={-12} />)}</g>}
              {zone === 'near' && lvl > 0 && picked !== n.id && hov !== n.id && <text className="nodestatus" y={62} textAnchor="middle">{LEVEL_NAMES[lvl]}{p?.lessonDone ? ' · lesson done' : ''}</text>}
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
            </g>
          )
        })}
        {rec && byId.get(rec) && picked !== rec && (() => {
          const n = byId.get(rec)!
          return (
            <g transform={`translate(${n.x},${n.y})`} className="maprec" pointerEvents="none">
              <circle r={42} className="recring recbg" fill="none" />
              <circle r={42} className="recring" fill="none" />
              <rect x={-86} y={-78} width={172} height={34} rx={17} className="recpill" />
              <text y={-55} textAnchor="middle" className="rectext"><tspan className="recold">Your next step</tspan><tspan className="recnew">Up next</tspan></text>
            </g>
          )
        })()}
        <circle r={5} className="mapcentre" />
      </svg>
      <svg className="minimap" viewBox={`${-R} ${-R} ${2 * R} ${2 * R}`} role="img" aria-label="Overview of the whole map"
        onPointerDown={e => { const b = e.currentTarget.getBoundingClientRect(); const fx = ((e.clientX - b.left) / b.width) * 2 * R - R, fy = ((e.clientY - b.top) / b.height) * 2 * R - R; go({ x: -fx, y: -fy, k: viewRef.current.k }) }}>
        <circle r={layout.radius} className="miniback" />
        {layout.nodes.map(n => <circle key={n.id} cx={n.x} cy={n.y} r={n.id === linkedHoverId ? 40 : n.id === rec ? 26 : 12} className={`${n.id === linkedHoverId ? 'minilink' : n.id === rec ? 'minirec' : (progress.get(n.id)?.level ?? 0) > 0 ? 'minidone' : 'minidot'} lv${level(n.id)}`} />)}
        {/* the regions as a coloured rim (shown in the Scholarmate look only) */}
        {REGIONS.map(rg => { const ws = layout.wedges.filter(w => rg.strands.includes(w.strand)); if (!ws.length) return null; const a = ws[0].from + 0.01, b = ws[ws.length - 1].to - 0.01, r0 = layout.radius + 30; return <path key={rg.id} className="miniregion" data-region={String(REGIONS.indexOf(rg) + 1)} fill="none" d={`M${Math.cos(a) * r0},${Math.sin(a) * r0} A${r0},${r0} 0 ${b - a > Math.PI ? 1 : 0} 1 ${Math.cos(b) * r0},${Math.sin(b) * r0}`} /> })}
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
