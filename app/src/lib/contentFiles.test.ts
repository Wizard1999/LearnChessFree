/// <reference types="node" />
// The shipped content files agree with each other: the manifest names real files, the catalog matches the lesson bodies (so the lists
// and the player never disagree), and the minutes computed in Python equal lessonMinutes. Run tools/build_content.py if these fail.
import { existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { lessonMinutes } from './lessonTime'
import { CONTENT_DIR, readCatalog, readLessons, readManifest } from './shippedContent'

describe('shipped content files', () => {
  const manifest = readManifest()
  const catalog = readCatalog()
  it('the manifest names every hashed file, and each exists with the hash of its bytes in its name', () => {
    const files = manifest.files!
    expect(Object.keys(files).sort()).toEqual(['catalog', 'courses', 'items', 'itemsFirst', 'skills', 'verified'])
    for (const name of Object.values(files)) { expect(name).toMatch(/\.[0-9a-f]{12}\.json$/); expect(existsSync(join(CONTENT_DIR, name)), name).toBe(true) }
  })
  it('no hashed file of an older build is left behind', () => {
    const named = new Set(Object.values(manifest.files!))
    const stray = readdirSync(CONTENT_DIR).filter(f => /\.[0-9a-f]{12}\.json$/.test(f) && !named.has(f))
    expect(stray).toEqual([])
  })
  it('the catalog has no step bodies and names one body file per lesson, with nothing else in the folder', () => {
    expect(catalog.length).toBe(manifest.lessons)
    expect(catalog.every(l => !('steps' in l))).toBe(true)
    const named = catalog.map(l => l.file).sort()
    expect(named).toEqual(readdirSync(join(CONTENT_DIR, 'lessons')).map(f => `lessons/${f}`).sort())
    for (const l of catalog) expect(l.file, l.id).toBe(`lessons/${l.id}.${l.revision}.json`)
  })
  it('each catalog entry agrees with its body: step count, step ids, and minutes by the same formula as lessonMinutes', () => {
    const bad: string[] = []
    for (const l of readLessons()) {
      if (l.steps.length !== l.stepCount) bad.push(`${l.id}: stepCount`)
      if (l.stepRefs.map(r => r.sid).join() !== l.steps.map(s => s.sid).join()) bad.push(`${l.id}: step ids`)
      if (lessonMinutes({ steps: l.steps }) !== l.minutes) bad.push(`${l.id}: minutes ${l.minutes} vs ${lessonMinutes({ steps: l.steps })}`)
    }
    expect(bad.slice(0, 10)).toEqual([])
  }, 30_000) // reads every lesson body (441 files): under a full parallel run this took over the 5 s default
  it('the first visit stays small: the catalog is under a fifth of the old lessons file and the lists need no bodies', () => {
    const lessonsJson = JSON.stringify(readLessons()).length
    expect(JSON.stringify(catalog).length).toBeLessThan(lessonsJson / 5)
  })
})
