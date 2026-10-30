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
  const [view, setView] = useState({ x: 0, y: 0, k: 3 })
  const drag = useRef<{ x: number; y: number; vx: number; vy: number } | null>(null)
  const svg = useRef<SVGSVGElement>(null)
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
    setView({ x: -cx, y: -cy, k: 1.6 })
  }, [highlightStrand, layout])
  /** When a skill is chosen, bring it into the part of the map that is not covered by a panel, with its neighbours around it. */
  useEffect(() => {
    if (!picked) return
    const n = byId.get(picked); if (!n) return
    const t = window.setTimeout(() => {
      const el = svg.current; if (!el) return
      const box = el.getBoundingClientRect()
      const cover = (sel: string) => [...document.querySelectorAll(sel)].map(e => e.getBoundingClientRect())
      let left = box.left, right = box.right
      for (const r of cover('.sidechrome > .sidedrawer.left, .sidechrome > .detaildrawer')) if (r.right > left && r.left < box.left + box.width / 2) left = Math.max(left, r.right)
      for (const r of cover('.sidechrome > .sidedrawer.right')) if (r.left < right && r.right > box.left + box.width / 2) right = Math.min(right, r.left)
      const dx = ((left + right) / 2) - (box.left + box.width / 2)
      setView(v => { const k = Math.max(v.k, 1.8); const upp = (2 * R) / k / Math.min(box.width, box.height); return { x: -n.x + dx * upp, y: -n.y, k } })
    }, 80)
    return () => window.clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [picked])
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
        <span className="maplegend small"><i className="swatch pre" />builds on <i className="swatch next" />leads to</span>
        <span className="small muted">Start at the centre and work outward: that is the recommended order. You may explore anywhere. Drag to move, scroll to zoom.</span>
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
              {picked !== n.id && hov !== n.id && (view.k >= 2.4 || next) && <text className="nodelabel" y={40} textAnchor="middle">{(p?.title ?? n.id).slice(0, 26)}</text>}
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
        <circle r={5} className="mapcentre" />
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
