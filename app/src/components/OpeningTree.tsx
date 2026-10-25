import { useMemo } from 'react'
import { children, cnt, nameOf, type OGraph } from '../lib/openingsData'

const COL = 168
const ROW = 40
const PILL_W = 66
const PILL_H = 24

export interface TreeProps {
  g: OGraph
  band: number | null
  expanded: ReadonlySet<string>
  trail: string[]
  minShare: number
  repertoire: ReadonlySet<string>
  onSelect: (id: string, via: string | null) => void
  onToggle: (id: string) => void
}

interface Placed { id: string; x: number; y: number; ply: number; san: string; share: number; color: 'w' | 'b'; viaParent: string | null; hasKids: boolean; open: boolean; nameLabel: string | null; transposed: boolean }
interface Link { from: string; to: string; share: number; cross: boolean; n: number }

export function OpeningTree({ g, band, expanded, trail, minShare, repertoire, onSelect, onToggle }: TreeProps) {
  const { placed, links, width, height, hidden } = useMemo(() => {
    const placed = new Map<string, Placed>()
    const links: Link[] = []
    const hidden = new Map<string, number>() // collapsed-by-threshold children count
    let row = 0
    const inCount = new Map<string, number>()

    function visible(id: string) {
      const parentN = cnt(g.nodes.get(id)!.n, band) || 1
      const pp = g.nodes.get(id)!.p
      const all = children(g, id, band).filter(e => (g.nodes.get(e.t)?.p ?? 0) > pp)
      const keep = all.filter(e => cnt(e.n, band) / parentN >= minShare && cnt(e.n, band) > 0)
      hidden.set(id, all.length - keep.length)
      return { keep, parentN }
    }

    function place(id: string, ply: number, san: string, share: number, via: string | null): number {
      const node = g.nodes.get(id)!
      const open = expanded.has(id)
      let kids: ReturnType<typeof visible>['keep'] = []
      let parentN = 1
      if (open) { const v = visible(id); kids = v.keep; parentN = v.parentN }
      const ys: number[] = []
      for (const e of kids) {
        const sh = cnt(e.n, band) / parentN
        inCount.set(e.t, (inCount.get(e.t) ?? 0) + 1)
        if (placed.has(e.t)) { links.push({ from: id, to: e.t, share: sh, cross: true, n: cnt(e.n, band) }); continue }
        const y = place(e.t, ply + 1, e.m, sh, id)
        ys.push(y)
        links.push({ from: id, to: e.t, share: sh, cross: false, n: cnt(e.n, band) })
      }
      const y = ys.length ? (ys[0] + ys[ys.length - 1]) / 2 : row++
      const inherited = via ? nameOf(g, via).name : null
      const own = node.name && node.name !== inherited ? node.name : null
      placed.set(id, {
        id, x: node.p * COL, y: y * ROW, ply: node.p, san, share, color: node.p % 2 === 1 ? 'w' : 'b', viaParent: via,
        hasKids: (g.out.get(id)?.length ?? 0) > 0 || !!g.chunkIndex[id], open, nameLabel: own, transposed: false,
      })
      void ply
      return y
    }
    place(g.rootId, 0, 'start', 1, null)
    for (const [id, c] of inCount) if (c > 1 && placed.get(id)) placed.get(id)!.transposed = true
    let maxX = 0, maxY = 0
    for (const p of placed.values()) { maxX = Math.max(maxX, p.x); maxY = Math.max(maxY, p.y) }
    return { placed, links, width: maxX + PILL_W + 260, height: maxY + ROW + 20, hidden }
    // g.version re-triggers when chunks merge
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [g, g.version, band, expanded, minShare])

  const onTrail = new Set(trail)
  const pad = 12
  return (
    <div className="treescroll" tabIndex={0} aria-label="Opening tree. Use the table at the right for a keyboard-friendly list of moves.">
      <svg width={width + pad * 2} height={height + pad * 2} role="presentation">
        <g transform={`translate(${pad},${pad})`}>
          {links.map((l, i) => {
            const a = placed.get(l.from)!, b = placed.get(l.to)!
            const x1 = a.x + PILL_W, y1 = a.y + PILL_H / 2, x2 = b.x, y2 = b.y + PILL_H / 2
            const mx = (x1 + x2) / 2
            const sw = Math.max(1.2, Math.min(20, 1.2 + l.share * 26))
            const hot = onTrail.has(l.from) && onTrail.has(l.to)
            return <path key={i} d={`M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`} className={`edge${hot ? ' hot' : ''}${l.cross ? ' cross' : ''}`} strokeWidth={sw} fill="none" />
          })}
          {[...placed.values()].map(p => {
            const isRoot = p.id === g.rootId
            const sel = trail[trail.length - 1] === p.id
            const star = repertoire.has(p.id)
            return (
              <g key={p.id} transform={`translate(${p.x},${p.y})`} className={`tnode ${p.color}${sel ? ' sel' : ''}${onTrail.has(p.id) ? ' trail' : ''}`}>
                <g role="button" tabIndex={-1} onClick={() => onSelect(p.id, p.viaParent)} style={{ cursor: 'pointer' }}>
                  <rect width={PILL_W} height={PILL_H} rx={12} />
                  <text x={PILL_W / 2} y={16} textAnchor="middle" className="san">{isRoot ? 'Start' : p.san}</text>
                  {!isRoot && <text x={PILL_W / 2} y={PILL_H + 11} textAnchor="middle" className="pct">{p.share >= 0.1 ? Math.round(p.share * 100) : p.share >= 0.001 ? (p.share * 100).toFixed(1) : '<0.1'}%</text>}
                  {p.transposed && <text x={PILL_W - 2} y={-3} textAnchor="end" className="badge"><title>Reached by more than one move order (transposition)</title>⇄</text>}
                  {star && <text x={-4} y={9} textAnchor="end" className="star"><title>In your repertoire</title>★</text>}
                </g>
                {p.hasKids && (
                  <g onClick={() => onToggle(p.id)} style={{ cursor: 'pointer' }} role="button" aria-label={p.open ? 'Collapse' : 'Expand'}>
                    <circle cx={PILL_W + 12} cy={PILL_H / 2} r={8} className="tog" />
                    <text x={PILL_W + 12} y={PILL_H / 2 + 4} textAnchor="middle" className="togt">{p.open ? '−' : '+'}</text>
                  </g>
                )}
                {p.nameLabel && <text x={PILL_W + 28} y={PILL_H / 2 + 4} className="oname">{p.nameLabel}</text>}
                {p.open && (hidden.get(p.id) ?? 0) > 0 && <text x={0} y={PILL_H + 23} className="rare">+{hidden.get(p.id)} rarer {hidden.get(p.id) === 1 ? 'move' : 'moves'} hidden</text>}
              </g>
            )
          })}
        </g>
      </svg>
    </div>
  )
}
