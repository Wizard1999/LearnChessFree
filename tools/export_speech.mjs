// Lists every speakable chunk of every lesson exactly as the app computes it (app/src/lib/speech.ts, imported directly; Node 24 strips the types).
// Spoken units mirror LessonPlayer/LinePlayer: card (title + text), board caption, each line move's "say".
// Usage: node tools/export_speech.mjs [out.json]   (default tools/_voices/chunks.json)
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { pathToFileURL } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
// Node 24 strips the TypeScript types itself, so the app's own file is imported as it is
const { speakable, chunkForSpeech } = await import(pathToFileURL(resolve(root, 'app/src/lib/speech.ts')).href)

export const hash = t => createHash('sha1').update(t).digest('hex').slice(0, 12)
const lessons = JSON.parse(readFileSync(resolve(root, 'app/public/content/lessons.json'), 'utf8'))
const path = JSON.parse(readFileSync(resolve(root, 'content/path.json'), 'utf8'))
const byId = new Map(lessons.map(l => [l.id, l]))
const order = path.stages.flatMap(s => s.lessons).filter(id => byId.has(id))

function units(step) {
  if (step.type === 'card') return [[step.title, step.text].filter(Boolean).join('. ')]
  if (step.type === 'board') {
    if (step.line && step.line.length > 0) return [step.caption ?? '', ...step.line.map(l => l.say ?? '')]
    return [step.caption ?? '']
  }
  return []
}

const chunks = {}
const outLessons = []
for (const id of order) {
  const hs = []
  for (const step of byId.get(id).steps) for (const raw of units(step)) {
    if (!raw) continue
    for (const c of chunkForSpeech(speakable(raw))) { const h = hash(c); chunks[h] = c; hs.push(h) }
  }
  outLessons.push({ id, hashes: [...new Set(hs)] })
}
const out = process.argv[2] ?? resolve(root, 'tools/_voices/chunks.json')
mkdirSync(dirname(out), { recursive: true })
writeFileSync(out, JSON.stringify({ lessons: outLessons, chunks }))
console.log(`lessons ${outLessons.length}, unique chunks ${Object.keys(chunks).length}`)
