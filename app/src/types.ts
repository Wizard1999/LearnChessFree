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
/** Every step may carry a stable id (made at build time) and a chapter name shown in long lessons. */
export type StepMeta = { sid?: string; chapter?: string }
export type LessonStep = StepMeta & (
  | { type: 'card'; title?: string; text: string }
  | { type: 'board'; fen: string; caption?: string; line?: { move: string; say?: string }[]; arrows?: { from: string; to: string }[]; highlight?: string[]; claims?: Claim[] }
  | { type: 'item'; item: string; silent?: boolean; ask_confidence?: boolean }
  | { type: 'practice'; tags: string[]; n: number; silent?: boolean; ask_confidence?: boolean }
  | { type: 'contrast'; title?: string; prompt?: string; working: string; failing: string; irrelevant?: string; silent?: boolean; ask_confidence?: boolean }
  | { type: 'reflect'; kind: string; prompt: string; fields?: ReflectField[] }
  /** An optional game from the position the lesson taught: against Maia or Stockfish, as White, Black or both (D41). */
  | { type: 'finale'; fen: string; color?: 'white' | 'black' | 'both'; prompt?: string; moves?: string[] }
)

/** A step's stable id and chapter name: all the catalog keeps of a lesson's steps (their bodies are in the lesson's own file). */
export interface StepRef { sid: string; chapter?: string }

/** What the lists, the map and the daily plan need to know about a lesson (lessons-catalog.<hash>.json, written by tools/build_content.py). No step bodies. */
export interface LessonMeta {
  id: string
  /** What this lesson is for its skill: its first teaching (intro), a later depth (continuation), a course lesson using the skill (application) or a check (assessment). Derived by tools/build_content.py unless the source sets it. */
  role?: 'intro' | 'continuation' | 'application' | 'assessment'
  /** Hash of the lesson's steps: changes when the lesson is rewritten (saved places and completions record it). Also names the body file. */
  revision?: string
  title: string
  skill: string
  depth: string
  /** Minutes the lesson takes, computed at build time with the formula of lib/lessonTime.ts (stepsMinutes). */
  minutes?: number
  /** Place in the recommended learning path (1 = first) and its stage id (S0..S7); set by tools/build_path.py. */
  order?: number
  stage?: string
  review: { status: string; reviewer?: string | null }
  /** Optional course this lesson belongs to (content/courses); such a lesson uses core skills and does not replace their lessons. */
  course?: string
  /** Opening series (several lessons on one opening). */
  series?: string
  uses?: string[]
  /** Other skill nodes this lesson also teaches (a lesson has one main skill; coverage of the rest is recorded here). */
  also?: string[]
  stepCount: number
  stepRefs: StepRef[]
  /** Path of the body file next to the catalog: lessons/<id>.<revision>.json. */
  file?: string
}

/** A whole lesson: the catalog entry plus its body (steps and the author-side extras). Loaded on demand (useLesson in lib/content.tsx). */
export interface Lesson extends LessonMeta {
  outcomes?: string[]
  steps: LessonStep[]
  sources?: string[]
}

/** The body file of a lesson, as written by tools/build_content.py. */
export type LessonBody = Pick<Lesson, 'id' | 'revision' | 'steps' | 'outcomes' | 'sources'>

export interface VerifiedInfo { claims: number; checked_at: string | null; engine: string | null; depth: number | null }
export interface ContentFiles { skills: string; items: string; itemsFirst: string; verified: string; courses: string; catalog: string }
export interface Manifest { version: number; /** File names of the hashed content files (content/<name>), written by tools/build_content.py. */ files?: ContentFiles; /** Skill-depth keys whose exercises are all cued (cue 1-2). */ cued_only?: string[]; /** Skill-depth keys that have at least one shipped exercise. */ depths_with_items?: string[]; built: string; hash: string; skills: number; items: number; lessons: number; skipped: number; by_review: Record<string, number> }

/** An optional path layered on the core curriculum (docs/course-families.md). Lessons are ordinary lessons listed by id. */
export interface Course { id: string; title: string; family: string; summary: string; audience?: string; uses?: string[]; lessons: string[] }

export interface ContentBundle {
  courses: Course[]
  manifest: Manifest
  skills: Skill[]
  items: Item[]
  /** The catalog: metadata of every lesson, no step bodies (read those with useLesson). */
  lessons: LessonMeta[]
  verified: Record<string, VerifiedInfo>
  skillById: Map<string, Skill>
  itemById: Map<string, Item>
  lessonById: Map<string, LessonMeta>
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
