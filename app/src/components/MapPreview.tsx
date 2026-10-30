import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { layoutMap } from '../lib/mapLayout'
import { currentStrand, previewText } from '../lib/mapPreview'
import { STRAND_NAMES } from '../lib/missions'
import type { Skill } from '../types'

interface Props { skills: Skill[]; levels: Map<string, number>; nextId: string | null; nextTitle: string | null }

/** A small static picture of the whole curriculum map on the Today page: wedges per strand, finished skills filled, the next skill ringed. Links to the full map. */
export function MapPreview({ skills, levels, nextId, nextTitle }: Props) {
  const layout = useMemo(() => layoutMap(skills), [skills])
  const nodes = useMemo(() => layout.nodes.map(n => ({ id: n.id, strand: n.strand, level: levels.get(n.id) ?? 0 })), [layout, levels])
  const strand = currentStrand(nodes, nextId)
  const started = nodes.filter(n => n.level > 0).length
  const text = previewText({ strandName: strand ? (STRAND_NAMES[strand] ?? strand) : null, started, total: nodes.length, nextTitle })
  const R = layout.radius + 20
  const next = nextId ? layout.nodes.find(n => n.id === nextId) : undefined
  const edge = (a: number) => `${Math.cos(a) * layout.radius},${Math.sin(a) * layout.radius}`
  return (
    <Link to="/course?view=map" className="card mappreview" aria-label={`${text} Open the full map.`}>
      <svg viewBox={`${-R} ${-R} ${2 * R} ${2 * R}`} className="mappreviewsvg" aria-hidden="true" focusable="false">
        {layout.wedges.map(w => (
          <path key={w.strand} className={`pvwedge${w.strand === strand ? ' here' : ''}`} d={`M0,0 L${edge(w.from)} A${layout.radius},${layout.radius} 0 ${w.to - w.from > Math.PI ? 1 : 0} 1 ${edge(w.to)} Z`} />
        ))}
        {nodes.map(n => {
          const p = layout.nodes.find(x => x.id === n.id)!
          return <circle key={n.id} cx={p.x} cy={p.y} r={22} className={n.level >= 4 ? 'pvdot full' : n.level > 0 ? 'pvdot part' : 'pvdot'} />
        })}
        {next && <g><circle cx={next.x} cy={next.y} r={70} className="pvnextring" /><circle cx={next.x} cy={next.y} r={30} className="pvnextdot" /></g>}
      </svg>
      <span className="mappreviewtext">
        <span className="eyebrow">Where you are</span>
        <span className="pvnext">{nextTitle ? <>Next: <strong>{nextTitle}</strong></> : 'Open the map'}</span>
        <span className="small muted">{started} of {nodes.length} skills started · See the full map</span>
      </span>
    </Link>
  )
}
