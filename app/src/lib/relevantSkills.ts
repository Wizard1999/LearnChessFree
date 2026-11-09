import type { LessonMeta, Skill } from '../types'
import { coreLessonsOf } from './coreLessons'
import { openingLesson } from './lessonRoles'

/** One core skill an elective lesson builds on, with the core lesson that teaches it. Never a gate (D80). */
export interface RelevantSkill { skillId: string; title: string; lesson: LessonMeta | null }

const MAX = 8
const skillOfRef = (ref: string) => ref.replace(/\.D\d+$/, '')

/**
 * The core skills worth knowing before an elective lesson: the skills the lesson says it uses, its own skill, and the skills that its skill's
 * prerequisites at that depth name. Each is linked to the core lesson that teaches it (the first teaching lesson). Order: uses, own skill, prerequisites.
 */
export function relevantCoreSkills(lesson: LessonMeta, lessons: readonly LessonMeta[], skillById: Map<string, Skill>): RelevantSkill[] {
  const core = coreLessonsOf(lessons)
  const ids: string[] = []
  const add = (id: string) => { if (id && skillById.has(id) && !ids.includes(id)) ids.push(id) }
  ;(lesson.uses ?? []).forEach(add)
  add(lesson.skill)
  const pre = skillById.get(lesson.skill)?.depths?.[lesson.depth]?.prereqs ?? []
  pre.map(skillOfRef).forEach(add)
  return ids.slice(0, MAX).map(skillId => ({ skillId, title: skillById.get(skillId)?.title ?? skillId, lesson: openingLesson(core, skillId) }))
}
