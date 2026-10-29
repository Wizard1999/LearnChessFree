import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { db, type LessonProgress } from '../db'
import { layoutMap } from '../lib/mapLayout'
import { LEVEL_NAMES, type NodeProgress } from '../lib/missions'
import type { Lesson, Skill } from '../types'

interface Props { skills: Skill[]; progress: Map<string, NodeProgress>; picked: string | null; onPick: (id: string) => void; strandNames: Record<string, string>; /** A strand to emphasise: its nodes stay bright, the rest dim, and the view moves to it. */ highlightStrand?: string | null; lessons: Lesson[]; lessonProgress: LessonProgress[] }

const LEVEL_FILL = ['var(--canvas)', 'var(--chip)', 'var(--info)', 'var(--info)', 'var(--success)']

/** The curriculum as a map: the first skill at the centre, rings outward by prerequisite chain, a wedge per strand. Pan by dragging,
 * zoom with the wheel or the buttons; arrow keys move between connected skills when a skill is focused. */
export function RadialMap({ skills, progress, picked, onPick, strandNames, highlightStrand = null, lessons, lessonProgress }: Props) {
  const layout = useMemo(() => layoutMap(skills), [skills])
  const byId = useMemo(() => new Map(layout.nodes.map(n => [n.id, n])), [layout])
  const R = layout.radius + 40
  const navigate = useNavigate()
  const [tip, setTip] = useState<{ id: string; x: number; y: number } | null>(null)
  const hideTimer = useRef<number | undefined>(undefined)
  const showTip = (id: string, el: Element) => {
    window.clearTimeout(hideTimer.current)
    const box = svg.current?.parentElement?.getBoundingClientRect(), r = el.getBoundingClientRect()
    if (!box) return
    setTip({ id, x: Math.min(Math.max(8, r.right - box.left + 10), box.width - 310), y: Math.min(Math.max(8, r.top - box.top - 10), box.height - 220) })
  }
  const hideTip = () => { window.clearTimeout(hideTimer.current); hideTimer.current = window.setTimeout(() => setTip(null), 220) }
  const doneBy = useMemo(() => new Map(lessonProgress.map(p => [p.lessonId, p])), [lessonProgress])
  const mark = (ids: string[], steps: Record<string, number>, done: boolean) => Promise.all(ids.map(id => done ? db.lessonProgress.put({ lessonId: id, step: steps[id] ?? 0, done: true, ts: Date.now(), skipped: false }) : db.lessonProgress.delete(id)))
  const [view, setView] = useState({ x: 0, y: 0, k: 3 })
  const drag = useRef<{ x: number; y: number; vx: number; vy: number } | null>(null)
  const svg = useRef<SVGSVGElement>(null)
  const linked = useMemo(() => {
    const s = new Set<string>()
    if (picked) { s.add(picked); for (const e of layout.edges) { if (e.from === picked) s.add(e.to); if (e.to === picked) s.add(e.from) } }
    return s
  }, [picked, layout])
  useEffect(() => {
    if (!highlightStrand) return
    const ns = layout.nodes.filter(n => n.strand === highlightStrand); if (!ns.length) return
    const cx = ns.reduce((t, n) => t + n.x, 0) / ns.length, cy = ns.reduce((t, n) => t + n.y, 0) / ns.length
    setView({ x: -cx, y: -cy, k: 1.6 })
  }, [highlightStrand, layout])
  const zoom = (f: number) => setView(v => ({ ...v, k: Math.max(0.25, Math.min(6, v.k * f)) }))
  const fit = () => setView({ x: 0, y: 0, k: 1 })
  const locate = () => {
    // centre on the first skill that is started but not mastered, else the first not started
    const open = layout.nodes.filter(n => { const p = progress.get(n.id); return p && p.level < 4 && !p.noExercises })
    const cand = open.find(n => (progress.get(n.id)?.level ?? 0) > 0) ?? open.sort((a, b) => a.ring - b.ring)[0]
    if (cand) { setView({ x: -cand.x, y: -cand.y, k: 2 }); onPick(cand.id) }
  }
  // a native, non-passive wheel listener: React's onWheel cannot stop the page from scrolling
  useEffect(() => {
    const el = svg.current; if (!el) return
    const h = (e: WheelEvent) => { e.preventDefault(); zoom(e.deltaY < 0 ? 1.12 : 1 / 1.12) }
    el.addEventListener('wheel', h, { passive: false })
    return () => el.removeEventListener('wheel', h)
  }, [])
  const vb = `${-R / view.k - view.x} ${-R / view.k - view.y} ${(2 * R) / view.k} ${(2 * R) / view.k}`
  return (
    <div className="radialmap">
      <div className="row filters mapbar">
        <button type="button" onClick={() => zoom(1.3)} aria-label="Zoom in">＋</button>
        <button type="button" onClick={() => zoom(1 / 1.3)} aria-label="Zoom out">－</button>
        <button type="button" onClick={fit}>Fit all</button>
        <button type="button" onClick={locate}>Where I am</button>
        <span className="small muted">Centre: the first skill. Each ring out needs the ring before it. Drag to move, scroll to zoom.</span>
      </div>
      <svg ref={svg} className="mapsvg" viewBox={vb} role="group" aria-label="Curriculum map"
        onPointerDown={e => { drag.current = { x: e.clientX, y: e.clientY, vx: view.x, vy: view.y }; (e.target as Element).setPointerCapture?.(e.pointerId) }}
        onPointerMove={e => {
          const d = drag.current; if (!d || !svg.current) return
          const scale = (2 * R) / view.k / svg.current.getBoundingClientRect().width
          setView(v => ({ ...v, x: d.vx + (e.clientX - d.x) * scale, y: d.vy + (e.clientY - d.y) * scale }))
        }}
        onPointerUp={() => { drag.current = null }}>
        {layout.wedges.map(w => {
          const mid = (w.from + w.to) / 2
          const edge = (a: number) => `${Math.cos(a) * layout.radius},${Math.sin(a) * layout.radius}`
          return (
            <g key={w.strand} className={`mapwedge${highlightStrand === w.strand ? ' hi' : ''}`}>
              <path d={`M0,0 L${edge(w.from)} A${layout.radius},${layout.radius} 0 ${w.to - w.from > Math.PI ? 1 : 0} 1 ${edge(w.to)} Z`} className="wedgebg" />
              <text x={Math.cos(mid) * (layout.radius - 20)} y={Math.sin(mid) * (layout.radius - 20)} textAnchor="middle" className="wedgelabel">{w.strand} {strandNames[w.strand] ?? ''}</text>
            </g>
          )
        })}
        {layout.edges.map(e => {
          const a = byId.get(e.from), b = byId.get(e.to); if (!a || !b) return null
          const on = picked && (e.from === picked || e.to === picked)
          return <line key={`${e.from}>${e.to}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} className={on ? 'mapedge on' : 'mapedge'} />
        })}
        {layout.nodes.map(n => {
          const p = progress.get(n.id)
          const lvl = p ? Math.min(4, p.level) : 0
          const dim = (picked && !linked.has(n.id)) || (!picked && highlightStrand && n.strand !== highlightStrand)
          return (
            <g key={n.id} onMouseEnter={e => showTip(n.id, e.currentTarget)} onMouseLeave={hideTip} onFocus={e => showTip(n.id, e.currentTarget)} className={`mapnode${picked === n.id ? ' sel' : ''}${dim ? ' dim' : ''}${p?.due ? ' due' : ''}`} transform={`translate(${n.x},${n.y})`}
              tabIndex={0} role="button" aria-label={`${p?.title ?? n.id}, level ${lvl}`}
              onClick={() => onPick(n.id)} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onPick(n.id) } }}>
              <circle r={22} fill={LEVEL_FILL[lvl]} className="nodecircle" />
              {p?.hasLesson && p.lessonDone && <text className="nodemark" textAnchor="middle" dy="5">✓</text>}
              <title>{p?.title ?? n.id}</title>
              {(picked === n.id || view.k >= 2.4) && <text className="nodelabel" y={40} textAnchor="middle">{(p?.title ?? n.id).slice(0, 26)}</text>}
            </g>
          )
        })}
        <circle r={5} className="mapcentre" />
      </svg>
      {tip && (() => {
        const p = progress.get(tip.id), sk = skills.find(x => x.id === tip.id)
        const ls = lessons.filter(l => l.skill === tip.id || (l.also ?? []).includes(tip.id))
        const steps = Object.fromEntries(ls.map(l => [l.id, l.steps.length]))
        const allDone = ls.length > 0 && ls.every(l => doneBy.get(l.id)?.done)
        return (
          <div className="maptip" style={{ left: tip.x, top: tip.y }} role="tooltip" onMouseEnter={() => window.clearTimeout(hideTimer.current)} onMouseLeave={hideTip}>
            <h3>{p?.title ?? tip.id}</h3>
            <p className="small muted">{sk?.strand} {strandNames[sk?.strand ?? ''] ?? ''} · tier {sk?.tier} · {LEVEL_NAMES[Math.min(4, p?.level ?? 0)]}{p?.due ? ' · refresher due' : ''}{p?.assumed ? ' · assumed from a test-out' : ''}</p>
            {sk && <p className="small">{Object.values(sk.depths)[0]?.outcome}</p>}
            {ls.length === 0 ? <p className="small muted">No lesson for this skill yet.</p> : (
              <ul>
                {ls.map(l => { const d = doneBy.get(l.id); return (
                  <li key={l.id}><button type="button" className="link" onClick={() => navigate(`/lesson/${l.id}`)}>{l.title}</button><span className="muted small">{d?.done ? (d.skipped ? 'Skipped' : 'Finished') : d && d.step > 0 ? 'In progress' : 'Not started'}</span></li>
                ) })}
              </ul>
            )}
            <div className="row">
              {ls.length > 0 && !allDone && <button type="button" onClick={() => void mark(ls.map(l => l.id), steps, true)}>Mark as already done</button>}
              {ls.some(l => doneBy.get(l.id)) && <button type="button" className="link" onClick={() => void mark(ls.map(l => l.id), steps, false)}>Reset</button>}
              <button type="button" className="link" onClick={() => onPick(tip.id)}>Details</button>
            </div>
          </div>
        )
      })()}
    </div>
  )
}
