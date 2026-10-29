// Content types: the runtime shape of what tools/build_content.py writes to public/content/.
// The contract is documented in docs/content-schema.md.
export type Cue = 1 | 2 | 3 | 4
export type TaskType = 'find_move' | 'select_squares' | 'predict_outcome' | 'classify_position' | 'threat_detection' | 'play_out'

export interface Claim { id: string; type: string; params: Record<string, unknown>; statement?: string }

export interface ItemAnswer {
  moves?: string[]
  squares?: string[]
  from?: string
  outcome?: string
  class?: string
  threat_move?: string
  goal?: 'win' | 'draw' | 'hold'
  max_moves?: number
  /** Answer choices for predict_outcome and classify_position (the generators put them here). */
  options?: string[]
  /** mode.variation items: the whole line to enter, UCI, starting with the learner's move, `plies` long. */
  line?: string[]
  plies?: number
}

/** Memory drills: show the position for a while, then hide some pieces; the answer is judged on the full position. */
export interface ItemDisplay { study_seconds?: number; hide?: string[]; reveal?: 'after_answer' }

export interface Item {
  id: string
  skill: string // SKILL.Dn
  cue: Cue
  task: TaskType
  position: string
  fen: string
  family: string
  prompt: string
  answer: ItemAnswer
  options?: string[]
  display?: ItemDisplay
  claims: Claim[]
  tags?: string[]
  hints?: string[]
  explain?: string
  feedback_by_move?: Record<string, string>
  contrast_group?: string
  orientation?: 'white' | 'black' | 'auto'
  difficulty_prior?: { scale: string; rating: number; rd?: number; plays?: number; grade?: string }
  source?: { kind: string; id?: string }
  review: { status: 'machine-only' | 'needs-human' | 'human-reviewed'; reviewer?: string | null }
  reveal_pv?: string[]
  provenance?: { kind: string; ref?: string; licence?: string }
  verified?: boolean
}

export interface SkillDepth { outcome: string; prereqs?: string[] }
export interface Skill {
  id: string
  title: string
  strand: string
  tier: number
  depths: Record<string, SkillDepth>
  misconceptions?: string[]
  conditions?: string[]
  contrasts?: string[]
  soft_prereqs?: string[]
  sources?: string[]
  rating?: { grade: string; note?: string }
}

/** A field of a reflect step. type 'number' shows a number box; with `answer` the step checks it (within `tolerance`) after saving. */
export interface ReflectField { id: string; label: string; options?: string[]; type?: 'number' | 'text'; answer?: number; tolerance?: number }
export type LessonStep =
  | { type: 'card'; title?: string; text: string }
  | { type: 'board'; fen: string; caption?: string; line?: { move: string; say?: string }[]; arrows?: { from: string; to: string }[]; highlight?: string[]; claims?: Claim[] }
  | { type: 'item'; item: string; silent?: boolean; ask_confidence?: boolean }
  | { type: 'practice'; tags: string[]; n: number; silent?: boolean; ask_confidence?: boolean }
  | { type: 'contrast'; title?: string; prompt?: string; working: string; failing: string; irrelevant?: string; silent?: boolean; ask_confidence?: boolean }
  | { type: 'reflect'; kind: string; prompt: string; fields?: ReflectField[] }

export interface Lesson {
  id: string
  title: string
  skill: string
  depth: string
  minutes?: number
  outcomes?: string[]
  steps: LessonStep[]
  review: { status: string; reviewer?: string | null }
  /** Other skill nodes this lesson also teaches (a lesson has one main skill; coverage of the rest is recorded here). */
  also?: string[]
  sources?: string[]
}

export interface VerifiedInfo { claims: number; checked_at: string | null; engine: string | null; depth: number | null }
export interface Manifest { version: number; /** Skill-depth keys whose exercises are all cued (cue 1-2). */ cued_only?: string[]; /** Skill-depth keys that have at least one shipped exercise. */ depths_with_items?: string[]; built: string; hash: string; skills: number; items: number; lessons: number; skipped: number; by_review: Record<string, number> }

/** An optional path layered on the core curriculum (docs/course-families.md). Lessons are ordinary lessons listed by id. */
export interface Course { id: string; title: string; family: string; summary: string; audience?: string; uses?: string[]; lessons: string[] }

export interface ContentBundle {
  courses: Course[]
  manifest: Manifest
  skills: Skill[]
  items: Item[]
  lessons: Lesson[]
  verified: Record<string, VerifiedInfo>
  skillById: Map<string, Skill>
  itemById: Map<string, Item>
  lessonById: Map<string, Lesson>
  /** Skill-depth keys whose exercises are all cued: evidence there counts in full (lib/mastery.ts). From the manifest, so it is right before the whole bank has loaded. */
  cuedOnly: ReadonlySet<string>
  /** Skill-depth keys with at least one exercise. A prerequisite depth without any is met by finishing the skill's lesson (progress.ts prereqMet). */
  depthsWithItems: ReadonlySet<string>
}

export const skillKeyOf = (skillDepth: string) => skillDepth // alias for clarity: 'TAC.FORK.D2'
export const splitSkillKey = (key: string): { skill: string; depth: string } => {
  const i = key.lastIndexOf('.')
  return { skill: key.slice(0, i), depth: key.slice(i + 1) }
}
