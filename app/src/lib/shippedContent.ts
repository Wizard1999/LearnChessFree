/// <reference types="node" />
// Test helper: reads the SHIPPED content from public/content the way the app does (manifest.json names the hashed files). Not used by the app.
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { Course, Item, Lesson, LessonMeta, Manifest, Skill } from '../types'

export const CONTENT_DIR = join(__dirname, '..', '..', 'public', 'content')
const read = <T>(name: string) => JSON.parse(readFileSync(join(CONTENT_DIR, name), 'utf8')) as T

export const readManifest = () => read<Manifest>('manifest.json')
const files = () => { const f = readManifest().files; if (!f) throw new Error('manifest.json names no files; run tools/build_content.py'); return f }
export const readCatalog = () => read<LessonMeta[]>(files().catalog)
export const readSkills = () => read<Skill[]>(files().skills)
export const readCourses = () => read<Course[]>(files().courses)
export const readItems = () => read<Item[]>(files().items)
/** Every lesson with its steps, joined from the catalog and the body files. */
export const readLessons = (): Lesson[] => readCatalog().map(m => ({ ...m, ...read<Partial<Lesson>>(m.file as string) }) as Lesson)
