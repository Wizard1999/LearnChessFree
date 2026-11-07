// The class names listed in docs/visual-language.md must exist in index.css, so the document cannot drift from the code.
import { describe, expect, it } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const doc = join(__dirname, '..', '..', 'docs', 'visual-language.md')
describe('docs/visual-language.md', () => {
  it('exists and lists its classes', () => {
    expect(existsSync(doc)).toBe(true)
    expect(classesIn(readFileSync(doc, 'utf8')).length).toBeGreaterThan(5)
  })
  it('names only classes that index.css defines', () => {
    const css = readFileSync(join(__dirname, 'index.css'), 'utf8')
    const missing = classesIn(readFileSync(doc, 'utf8')).filter(c => !new RegExp(`\.${c.replace(/[-]/g, '\-')}(?![\w-])`).test(css))
    expect(missing).toEqual([])
  })
})

/** Class names written as `.name` in backticks in the table's last column. */
function classesIn(md: string): string[] {
  const out = new Set<string>()
  for (const line of md.split('\n')) if (line.startsWith('|')) for (const m of line.matchAll(/`\.([a-z][\w-]*)`/g)) out.add(m[1])
  return [...out]
}
