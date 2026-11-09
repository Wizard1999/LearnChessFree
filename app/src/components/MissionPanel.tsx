import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { db } from '../db'
import { Button } from './Button'
import { Donut, FILL, Swatch } from './MissionParts'
import { SectionWarmup } from './SectionWarmup'
import { setLinkedHover, useLinkedHover } from '../lib/linkedHover'
import { lessonsForSkill } from '../lib/lessonRoles'
import { saveFinished, resetProgress } from '../lib/lessonSave'
import { LEVEL_HELP, LEVEL_NAMES, STRAND_NAMES, type Level, type Mission, type NodeProgress } from '../lib/missions'
import { useMissionData } from '../lib/useMissions'

export function Block({ n, selected, seen, onPick, onHover }: { n: NodeProgress; selected: boolean; seen: boolean; onPick: (id: string) => void; onHover: (n: NodeProgress | null, el?: HTMLElement) => void }) {
  const credited = n.levelWithAssumed > n.level // the fill includes credit that is only assumed
  const linked = useLinkedHover() === n.id // the same skill is under the pointer in another window
  const label = `${n.title}: ${LEVEL_NAMES[n.level]}${credited ? `, assumed up to ${LEVEL_NAMES[n.levelWithAssumed].toLowerCase()} from placement or warm-up, not yet shown` : ''}${n.due ? ', refresher due' : ''}${n.lessonDone ? ', lesson finished' : n.hasLesson ? ', lesson not yet finished' : ''}`
  return (
    <button type="button" className={`blk lv${n.level}${selected ? ' sel' : ''}${linked ? ' linked' : ''}${n.due ? ' due' : ''}${credited ? ' assumed' : ''}`} style={{ ['--fill' as string]: `${FILL[n.levelWithAssumed]}%` }}
      data-lesson={n.lessonDone ? '1' : undefined} data-seen={seen && !n.lessonDone ? '1' : undefined} aria-label={label} aria-pressed={selected} onClick={() => onPick(n.id)}
      onMouseEnter={e => { onHover(n, e.currentTarget); setLinkedHover(n.id) }} onMouseLeave={() => { onHover(null); setLinkedHover(null) }} onFocus={e => { onHover(n, e.currentTarget); setLinkedHover(n.id) }} onBlur={() => { onHover(null); setLinkedHover(null) }} />
  )
}

function Legend() {
  return (
    <details className="legend small">
      <summary>How to read the blocks</summary>
      <ul className="plain">{([0, 1, 2, 3, 4] as Level[]).map(l => <li key={l}><Swatch level={l} /> <strong>{LEVEL_NAMES[l]}</strong> <span className="muted">{LEVEL_HELP[l]}</span></li>)}
        <li><span className="blk swatch" data-lesson="1" style={{ ['--fill' as string]: '0%' }} aria-hidden="true" /> A filled dot: you have finished this skill's lesson. A hollow dot: you have opened it but not finished.</li>
        <li><span className="blk swatch due" style={{ ['--fill' as string]: '75%' }} aria-hidden="true" /> A dashed edge: a refresher is due. <span className="blk swatch assumed" style={{ ['--fill' as string]: '50%' }} aria-hidden="true" /> Hatched: assumed from your placement or a warm-up, not yet shown.</li></ul>
    </details>
  )
}


/**
 * The original mission view, unchanged (it was the Map's Progress window, docs/missions-design.md): the ring (average level), the level counts, the
 * explanation, the skill breakdown as water-fill blocks (by subject for the whole curriculum, by tier for one section), mark-all, the legend, and for
 * one section the warm-up. D76 reuses it on the Curriculum page. With the whole curriculum selected the ring and counts are the ones in the card above,
 * so they are not drawn twice.
 */
export function MissionPanel({ data, picked, onPick }: { data: ReturnType<typeof useMissionData>; picked?: string | null; onPick?: (id: string) => void }) {
  const { content, progress, placement, attempts, missions, overall } = data
  const [view, setView] = useState('all')
  const [showBreakdown, setShowBreakdown] = useState(true)
  const [bulk, setBulk] = useState<string[] | null>(null) // lessons changed by the last mark-all, so it can be undone
  const [hover, setHover] = useState<{ n: NodeProgress; x: number; y: number } | null>(null)
  const hoverNode = (n: NodeProgress | null, el?: HTMLElement) => { if (!n || !el) { setHover(null); return } const r = el.getBoundingClientRect(); setHover({ n, x: Math.min(r.left, window.innerWidth - 340), y: r.bottom + 6 }) }
  const isAll = view === 'all' || !missions.some(m => m.strand === view)
  const mission: Mission | undefined = isAll ? undefined : missions.find(m => m.strand === view)
  const current: Mission = mission ?? overall
  const lessonSeen = (id: string) => content.lessons.some(l => (l.skill === id || l.also?.includes(id)) && progress?.some(p => p.lessonId === l.id)) // a lesson opened, even if not finished
  const lessonsFor = (id: string) => { const s = lessonsForSkill(content.lessons, id); return s.teaching.length ? s.teaching : s.alsoTeaching }
  const lessonIdsOf = (nodes: NodeProgress[]) => content.lessons.filter(l => nodes.some(n => n.id === l.skill || l.also?.includes(n.id)))
  async function markAll(nodes: NodeProgress[], skipped: boolean, label: string) {
    const ls = lessonIdsOf(nodes)
    if (!window.confirm(`${label} ${ls.length} lessons? You can undo this right after, or reset any lesson later.`)) return
    const changed: string[] = []
    for (const l of ls) if (!progress?.find(p => p.lessonId === l.id)?.done) { await saveFinished(db.lessonProgress, l, skipped); changed.push(l.id) }
    setBulk(changed)
  }
  async function undoBulk() { for (const id of bulk ?? []) await resetProgress(db.lessonProgress, id); setBulk(null) }
  const pick = (id: string) => onPick?.(id)
  const live = useMemo(() => current.nodes.filter(n => !n.noExercises), [current])
  const complete = live.length > 0 && live.every(n => n.level === 4 && !n.due)
  return (
    <section className="missionpanel" id="mission-panel" aria-label={`${current.name} progress`}>
      <div className="options" role="group" aria-label="Section">
        <button type="button" className={isAll ? 'chip on' : 'chip'} aria-pressed={isAll} onClick={() => setView('all')}><strong>Whole curriculum</strong> · {overall.percent}%</button>
        {missions.map(m => <button key={m.strand} type="button" className={!isAll && view === m.strand ? 'chip on' : 'chip'} aria-pressed={!isAll && view === m.strand} onClick={() => setView(m.strand)}>{m.strand} {m.name} · {m.percent}%</button>)}
      </div>
      {!isAll && <h2>{current.name}</h2>}
      {complete && <div className="completebanner" role="status"><strong>✓ {isAll ? 'Curriculum' : 'Section'} complete.</strong> All {live.length} skills with exercises are Mastered and none is due for a refresher. Your badges are in the <Link to="/record">Learning record</Link>.</div>}
      {!isAll && <>
        <p className="small muted">SECTION PROGRESS</p>
        <div className="donutrow">
          <Donut percent={current.percent} assumed={current.percentWithAssumed} label="progress" />
          <ul className="plain legendlist">
            {([4, 3, 2, 1, 0] as Level[]).map(l => <li key={l}><Swatch level={l} /> <strong>{current.counts[l]}</strong> {l === 4 ? 'mastered' : l === 0 ? 'not started' : LEVEL_NAMES[l].toLowerCase()}</li>)}
            {current.assumedCount > 0 && <li><span className="blk swatch assumed" style={{ ['--fill' as string]: '50%' }} aria-hidden="true" /> of these, <strong>{current.assumedCount}</strong> are only assumed (hatched), not yet shown</li>}
          </ul>
        </div>
      </>}
      <p className="small muted">{isAll ? 'Overall' : 'Section'} progress is the average level of {isAll ? 'all' : "the mission's"} {current.nodes.length} skills, counting only what you have shown (mastered counts 4 of 4, level two 3, level one 2, seen 1, not started 0).{current.percentWithAssumed > current.percent && ` The lighter part of the ring is what it would be if the ${current.assumedCount} skills assumed from your placement or warm-up were confirmed.`}{current.nodes.some(n => n.noExercises) && ` ${current.nodes.filter(n => n.noExercises).length} skills have no exercises yet and can reach Seen at most, so the ring cannot fill completely.`}</p>
      <Button variant="quiet" onClick={() => setShowBreakdown(s => !s)} aria-expanded={showBreakdown}>{showBreakdown ? 'Hide skill breakdown' : 'Show skill breakdown'}</Button>
      {showBreakdown && isAll && missions.map(m => (
        <div key={m.strand} className="tierrow">
          <div className="small"><button type="button" className="link" onClick={() => setView(m.strand)}><strong>{m.strand} · {m.name}</strong></button> <span className="muted">{m.percent}% · {m.counts[4]} mastered of {m.nodes.length}</span></div>
          <div className="blocks">{m.nodes.map(n => <Block key={n.id} n={n} selected={picked === n.id} seen={lessonSeen(n.id)} onPick={pick} onHover={hoverNode} />)}</div>
        </div>
      ))}
      {showBreakdown && !isAll && current.tiers.map(t => (
        <div key={t.tier} className="tierrow">
          <div className="small"><strong>Tier {t.tier}</strong> <span className="muted">{t.gloss}</span></div>
          <div className="blocks">{t.nodes.map(n => <Block key={n.id} n={n} selected={picked === n.id} seen={lessonSeen(n.id)} onPick={pick} onHover={hoverNode} />)}</div>
        </div>
      ))}
      <p className="small"><Button variant="quiet" onClick={() => void markAll(current.nodes, false, `Mark every lesson in ${current.name} as finished:`)}>Mark all lessons here finished</Button> · <Button variant="quiet" onClick={() => void markAll(current.nodes, true, `Skip every lesson in ${current.name}:`)}>Skip all lessons here</Button>{bulk && bulk.length > 0 && <> · <Button variant="quiet" onClick={() => void undoBulk()}>Undo: reset the {bulk.length} lessons just changed</Button></>}</p>
      <Legend />
      {mission && attempts && <SectionWarmup mission={mission} placement={placement} items={content.items} attempts={attempts} />}
      {hover && !picked && (() => { const d = content.skillById.get(hover.n.id)?.depths[hover.n.workingDepth ?? 'D1']; const ls = lessonsFor(hover.n.id); return (
        <div className="blocktip" role="tooltip" style={{ left: hover.x, top: hover.y }}>
          <strong>{hover.n.title}</strong>
          <div className="small">{LEVEL_NAMES[hover.n.level]}{hover.n.levelWithAssumed > hover.n.level ? ` (assumed up to ${LEVEL_NAMES[hover.n.levelWithAssumed].toLowerCase()})` : ''}{hover.n.due ? ' · refresher due' : ''} · {hover.n.strand} {STRAND_NAMES[hover.n.strand] ?? ''}</div>
          {d && <div className="small muted">{d.outcome}</div>}
          <div className="small">{ls.length === 0 ? 'No lesson yet' : ls.map(l => { const pr = progress?.find(x => x.lessonId === l.id); return `${pr?.done ? '✓' : pr && pr.step > 0 ? '◐' : '○'} ${l.title}` }).join(' · ')}</div>
          <div className="small muted">Click for details</div>
        </div>) })()}
    </section>
  )
}
