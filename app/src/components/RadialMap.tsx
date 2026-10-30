import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { db, type LessonProgress } from '../db'
import { layoutMap } from '../lib/mapLayout'
import { LEVEL_NAMES, type NodeProgress } from '../lib/missions'
import { skillState, sheetOffset, listMaxHeight } from '../lib/mapSheet'
import { BANDS, REGIONS, bandOf } from '../lib/mapRegions'
import { TAP_SLOP, isDoubleTap, pinchGeometry, viewForPinch, zoomAt, type Cam, type Pinch } from '../lib/mapGesture'
import type { Lesson, Skill } from '../types'

interface Props { skills: Skill[]; progress: Map<string, NodeProgress>; picked: string | null; onPick: (id: string) => void; strandNames: Record<string, string>; /** A strand to emphasise: its nodes stay bright, the rest dim, and the view moves to it. */ highlightStrand?: string | null; lessons: Lesson[]; lessonProgress: LessonProgress[]; /** The skill of the lesson recommended next: marked on the map so the next step is unmistakable. */ recommended?: string | null }

/** The curriculum as a map: the first skill at the centre, rings outward by prerequisite chain, a wedge per strand. Pan by dragging,
 * zoom with the wheel or the buttons; arrow keys move between connected skills when a skill is focused. */
export function RadialMap({ skills, progress, picked, onPick, strandNames, highlightStrand = null, lessons, lessonProgress, recommended = null }: Props) {
  const layout = useMemo(() => layoutMap(skills), [skills])
  const byId = useMemo(() => new Map(layout.nodes.map(n => [n.id, n])), [layout])
  const R = layout.radius + 40
  const navigate = useNavigate()
  const [hov, setHov] = useState<string | null>(null)
  const [tip, setTip] = useState<{ id: string; corner: 'br' | 'bl' } | null>(null)
  const hideTimer = useRef<number | undefined>(undefined)
  const showTip = (id: string, el: Element) => {
    window.clearTimeout(hideTimer.current); setHov(id)
    const box = svg.current?.parentElement?.getBoundingClientRect(), r = el.getBoundingClientRect()
    if (!box) return
    // the card lives in a corner of the map (bottom right by default, bottom left when the skill is down there), never at the pointer, so it never hides the links
    const nearBR = r.left - box.left > box.width - 340 && r.top - box.top > box.height - 250
    setTip({ id, corner: nearBR ? 'bl' : 'br' })
  }
  const hideTip = () => { window.clearTimeout(hideTimer.current); hideTimer.current = window.setTimeout(() => { setTip(null); setHov(null) }, 220) }
  const doneBy = useMemo(() => new Map(lessonProgress.map(p => [p.lessonId, p])), [lessonProgress])
  const mark = (ids: string[], steps: Record<string, number>, done: boolean) => Promise.all(ids.map(id => done ? db.lessonProgress.put({ lessonId: id, step: steps[id] ?? 0, done: true, ts: Date.now(), skipped: false }) : db.lessonProgress.delete(id)))
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
  useEffect(() => {
    if (!highlightStrand) return
    const ns = layout.nodes.filter(n => n.strand === highlightStrand); if (!ns.length) return
    const cx = ns.reduce((t, n) => t + n.x, 0) / ns.length, cy = ns.reduce((t, n) => t + n.y, 0) / ns.length
    go({ x: -cx, y: -cy, k: 1.6 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [highlightStrand, layout])
  /** When a skill is chosen, bring it into the part of the map that is not covered by a panel, with its neighbours around it. */
  useEffect(() => {
    if (!picked) return
    const n = byId.get(picked); if (!n) return
    const t = window.setTimeout(() => {
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
      const v = viewRef.current; const k = Math.max(v.k, 1.8); const upp = (2 * R) / k / Math.min(box.width, box.height); go({ x: -n.x + dx * upp, y: -n.y + dy * upp, k })
    }, 80)
    return () => window.clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [picked])
  const zoom = (f: number) => setView(v => ({ ...v, k: Math.max(0.25, Math.min(6, v.k * f)) }))
  const fit = () => go({ x: 0, y: 0, k: 1 })
  const locate = () => {
    // centre on the first skill that is started but not mastered, else the first not started
    const open = layout.nodes.filter(n => { const p = progress.get(n.id); return p && p.level < 4 && !p.noExercises })
    const cand = open.find(n => (progress.get(n.id)?.level ?? 0) > 0) ?? open.sort((a, b) => a.ring - b.ring)[0]
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
  const rec = recommended ?? layout.nodes.filter(n => { const p = progress.get(n.id); return p && p.level < 4 && !p.noExercises && (readiness.get(n.id) ?? 0) >= 1 }).sort((a, b) => a.ring - b.ring)[0]?.id ?? null
  // distance bands: the outer edge of each band is where most of its skills end (85th percentile of their distance from the centre)
  const bandEdges = useMemo(() => {
    const out: number[] = []
    BANDS.forEach((_, b) => {
      const rs = layout.nodes.filter(n => bandOf(n.tier) === b).map(n => Math.hypot(n.x, n.y)).sort((a, c) => a - c)
      const r = rs.length ? rs[Math.min(rs.length - 1, Math.floor(rs.length * 0.85))] + 30 : 0
      out.push(Math.max(r, (out[b - 1] ?? 0) + 60))
    })
    return out
  }, [layout])
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
        <span className="small muted">Centre outwards is the reading order of the subjects; the recommended path (Curriculum, All lessons) mixes them by stage. Drag to move, scroll to zoom.</span>
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
                    <div className="maplistrow">{layout.nodes.filter(n => n.strand === st).sort((a, b) => a.ring - b.ring || a.id.localeCompare(b.id)).map(n => {
                      const t = progress.get(n.id)?.title ?? n.id, st2 = skillState(progress.get(n.id))
                      return <button key={n.id} type="button" className={picked === n.id ? 'link on' : 'link'} aria-current={picked === n.id ? 'true' : undefined} aria-label={`${t}, ${st2.word}${picked === n.id ? ', selected' : ''}`} onClick={() => showSkill(n.id)}><span aria-hidden="true" className="listmark">{st2.mark}</span>{t}</button>
                    })}</div>
                  </div>))}
              </div>))}
        </div>
      )}
      </div>
      <svg ref={svg} className={`mapsvg${highlightStrand ? ' hasHi' : ''}`} viewBox={vb} role="group" aria-label="Curriculum map"
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
          const mid = (w.from + w.to) / 2
          const edge = (a: number) => `${Math.cos(a) * layout.radius},${Math.sin(a) * layout.radius}`
          return (
            <g key={w.strand} className={`mapwedge${highlightStrand === w.strand ? ' hi' : ''}`}>
              <path d={`M0,0 L${edge(w.from)} A${layout.radius},${layout.radius} 0 ${w.to - w.from > Math.PI ? 1 : 0} 1 ${edge(w.to)} Z`} className="wedgebg" />
              <text x={Math.cos(mid) * (layout.radius - 20)} y={Math.sin(mid) * (layout.radius - 20)} textAnchor="middle" className="wedgelabel" opacity={view.k >= 1.2 ? 1 : 0}>{w.strand} {strandNames[w.strand] ?? ''}</text>
            </g>
          )
        })}
        {/* milestone bands: faint rings labelled with the ability they stand for (orientation only, not a rating) */}
        {bandEdges.slice(0, -1).map((r, b) => (
          <g key={`band-${b}`} className="mapband" pointerEvents="none">
            <circle r={r} fill="none" className="bandring" />
            <text y={-r + 26} textAnchor="middle" className="bandlabel">{BANDS[b].name}: {BANDS[b].milestone}</text>
          </g>
        ))}
        <text y={-layout.radius + 70} textAnchor="middle" className="bandlabel" pointerEvents="none">{BANDS[BANDS.length - 1].name}: {BANDS[BANDS.length - 1].milestone}</text>
        {/* broad regions round the outside; readable when the section names are too small */}
        {REGIONS.map(rg => {
          const ws = layout.wedges.filter(w => rg.strands.includes(w.strand)); if (!ws.length) return null
          const from = ws[0].from, to = ws[ws.length - 1].to, mid = (from + to) / 2, r0 = layout.radius + 14
          const pt = (a: number, r: number) => `${Math.cos(a) * r},${Math.sin(a) * r}`
          return (
            <g key={rg.id} className="mapregion" pointerEvents="none">
              <path d={`M${pt(from + 0.01, r0)} A${r0},${r0} 0 ${to - from > Math.PI ? 1 : 0} 1 ${pt(to - 0.01, r0)}`} className="regionarc" fill="none" />
              <text x={Math.cos(mid) * (r0 + 52)} y={Math.sin(mid) * (r0 + 52)} textAnchor="middle" className="regionlabel">{rg.name}</text>
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
          const dim = (picked && !linked.has(n.id)) || (!picked && highlightStrand && n.strand !== highlightStrand)
          const cid = `cp-${n.id.replace(/[^A-Za-z0-9]/g, '_')}`
          // unstarted skills fade with how few of their prerequisites are done, but stay readable
          const op = lvl > 0 || next ? 1 : 0.38 + 0.62 * ready
          return (
            <g key={n.id} onMouseEnter={e => showTip(n.id, e.currentTarget)} onMouseLeave={hideTip} onFocus={e => showTip(n.id, e.currentTarget)} className={`mapnode${picked === n.id ? ' sel' : ''}${dim ? ' dim' : ''}${p?.due ? ' due' : ''}${next ? ' next' : ''}`} transform={`translate(${n.x},${n.y})`} style={dim ? undefined : { opacity: op }}
              tabIndex={0} role="button" aria-label={`${p?.title ?? n.id}, ${LEVEL_NAMES[lvl]}${next ? ', ready to start' : ''}`}
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
              {picked !== n.id && hov !== n.id && (view.k >= 3.5 || ((view.k >= 1.7 || next) && (lvl > 0 || next))) && <text className="nodelabel" y={40} textAnchor="middle">{(p?.title ?? n.id).slice(0, 26)}</text>}
            </g>
          )
        })}
        {/* top layer: the hovered and the chosen skill are redrawn last, fully visible, with a readable label, whatever is dimmed or crowded around them */}
        {[...new Set([picked, hov].filter((x): x is string => !!x))].map(id => {
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
        {layout.nodes.map(n => <circle key={n.id} cx={n.x} cy={n.y} r={n.id === rec ? 26 : 12} className={n.id === rec ? 'minirec' : (progress.get(n.id)?.level ?? 0) > 0 ? 'minidone' : 'minidot'} />)}
        <rect x={-view.x - R / view.k} y={-view.y - R / view.k} width={(2 * R) / view.k} height={(2 * R) / view.k} className="miniview" />
      </svg>
      {tip && (() => {
        const p = progress.get(tip.id), sk = skills.find(x => x.id === tip.id)
        const ls = lessons.filter(l => l.skill === tip.id || (l.also ?? []).includes(tip.id))
        const steps = Object.fromEntries(ls.map(l => [l.id, l.steps.length]))
        const allDone = ls.length > 0 && ls.every(l => doneBy.get(l.id)?.done)
        return (
          <div className={`maptip ${tip.corner}`} role="tooltip" onMouseEnter={() => window.clearTimeout(hideTimer.current)} onMouseLeave={hideTip}>
            <h3>{p?.title ?? tip.id}</h3>
            <p className="small muted">{sk?.strand} {strandNames[sk?.strand ?? ''] ?? ''} · tier {sk?.tier} · {LEVEL_NAMES[Math.min(4, p?.level ?? 0)]}{p?.due ? ' · refresher due' : ''}{p?.assumed ? ' · assumed from a test-out' : ''}</p>
            <p className="small">{ls.length === 0 ? 'No lesson for this skill yet.' : `${ls.filter(l => doneBy.get(l.id)?.done).length} of ${ls.length} lesson${ls.length === 1 ? '' : 's'} finished`}</p>
            <div className="row">
              {ls.length > 0 && !allDone && <button type="button" onClick={() => void mark(ls.map(l => l.id), steps, true)}>Mark as already done</button>}
              {ls.some(l => doneBy.get(l.id)) && <button type="button" className="link" onClick={() => void mark(ls.map(l => l.id), steps, false)}>Reset</button>}
              {ls[0] && <button type="button" className="link" onClick={() => navigate(`/lesson/${ls[0].id}`)}>Open lesson</button>}<button type="button" className="link" onClick={() => onPick(tip.id)}>Details</button>
            </div>
          </div>
        )
      })()}
    </div>
  )
}
