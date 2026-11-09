import { Link } from 'react-router-dom'
import { useContent } from '../lib/content'
import { LEVEL_NAMES } from '../lib/missions'
import { relevantCoreSkills } from '../lib/relevantSkills'
import { useMissionData } from '../lib/useMissions'
import type { LessonMeta } from '../types'

/**
 * "Relevant skills to know first" for an elective lesson (D80): the core skills it builds on, each linked to the core lesson that teaches it with the
 * learner's own level. A soft link only: nothing is locked and nothing here changes progress.
 */
export function RelevantSkills({ lesson }: { lesson: LessonMeta }) {
  const md = useMissionData()
  return <RelevantSkillsView lesson={lesson} levels={levelsOf(md.missions)} />
}

export const levelsOf = (missions: { nodes: { id: string; level: number }[] }[]) => new Map(missions.flatMap(m => m.nodes).map(n => [n.id, n.level]))

/** The same, with the learner's levels supplied (a list of many lessons computes them once). `compact` is one line for a list row. */
export function RelevantSkillsView({ lesson, levels, compact }: { lesson: LessonMeta; levels: Map<string, number>; compact?: boolean }) {
  const { lessons, skillById } = useContent()
  const all = relevantCoreSkills(lesson, lessons, skillById)
  const rel = compact ? all.slice(0, 4) : all
  if (rel.length === 0) return null
  const level = levels
  const one = (r: (typeof rel)[number]) => {
    const lv = level.get(r.skillId)
    const label = r.lesson ? <Link to={`/lesson/${r.lesson.id}`}>{r.title}</Link> : <span>{r.title}</span>
    return <>{label}{lv !== undefined && <span className="muted small"> ({LEVEL_NAMES[lv as 0 | 1 | 2 | 3 | 4]})</span>}</>
  }
  if (compact) return <p className="small muted relevant" data-testid="relevant-skills">Relevant skills to know first: {rel.map((r, i) => <span key={r.skillId}>{i > 0 && ' · '}{one(r)}</span>)}{all.length > rel.length && ` · and ${all.length - rel.length} more`}</p>
  return (
    <section className="card relevant" aria-label="Relevant skills to know first" data-testid="relevant-skills">
      <h2>Relevant skills to know first</h2>
      <p className="small muted">This lesson is an elective. These core skills help you get the most from it; each links to the core lesson. Nothing is locked, and you can start now.</p>
      <ul className="plain">{rel.map(r => <li key={r.skillId}>{one(r)}</li>)}</ul>
    </section>
  )
}
