// Chapters inside long lessons. A step may carry a chapter name; a step without one belongs to the chapter before it.
import type { LessonStep } from '../types'

export interface Chapter { name: string; start: number; end: number }

/** The chapters of a lesson, in order. Empty when no step has a chapter name (such lessons look the same as before). */
export function chaptersOf(steps: readonly Pick<LessonStep, 'chapter'>[]): Chapter[] {
  const out: Chapter[] = []
  steps.forEach((s, i) => {
    const name = s.chapter?.trim()
    if (name && (out.length === 0 || out[out.length - 1].name !== name)) {
      if (out.length > 0) out[out.length - 1].end = i - 1
      out.push({ name, start: i, end: steps.length - 1 })
    }
  })
  // Steps before the first named step belong to the first chapter, so every step has a chapter.
  if (out.length > 0) out[0].start = 0
  return out
}

export function chapterIndexAt(chapters: readonly Chapter[], i: number): number {
  for (let k = chapters.length - 1; k >= 0; k--) if (i >= chapters[k].start) return k
  return -1
}

/** Step `i` is the first step of a chapter after the first: a natural stopping point, since leaving here resumes at this step. */
export function startsLaterChapter(chapters: readonly Chapter[], i: number): { finished: string; next: string } | null {
  const k = chapters.findIndex(c => c.start === i)
  return k > 0 ? { finished: chapters[k - 1].name, next: chapters[k].name } : null
}
