// Roles are applied with tokens only: raw #RRGGBB colours may live in the palette files, the board themes and pieces, and svg data URIs,
// and nowhere else. A few older files still hold raw colours from before the tokens existed; their counts are a ceiling that may only go down.
import { describe, expect, it } from 'vitest'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const SRC = __dirname
const ALLOWED = [/^styles\/palette\.css$/, /^theme\.css$/, /^assets\//, /^lib\/boardImage\.ts$/, /\.test\.tsx?$/] // palettes of the looks, board image colours, images, tests
const LEGACY_CEILING: Record<string, number> = { 'index.css': 51, 'lib/appearance.ts': 2, 'pages/Achievements.tsx': 1, 'pages/Games.tsx': 1 } // old look + browser-bar colour; lower, never raise

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap(n => { const p = join(dir, n); return statSync(p).isDirectory() ? walk(p) : [p] })
}
/** Raw hex colours in a file, ignoring those inside url("data:...") svg data URIs. */
function hexes(text: string): string[] {
  const noData = text.replace(/url\((["']?)data:[^)]*\)/g, '')
  return noData.match(/#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b(?![\w-])/g) ?? []
}

describe('colours come from tokens', () => {
  it('has no raw hex colour outside the palette files (legacy files are capped)', () => {
    const bad: string[] = []
    for (const f of walk(SRC)) {
      const rel = relative(SRC, f).split(String.fromCharCode(92)).join('/')
      if (!/\.(css|tsx?)$/.test(rel) || ALLOWED.some(r => r.test(rel))) continue
      const n = hexes(readFileSync(f, 'utf8')).length
      const cap = LEGACY_CEILING[rel] ?? 0
      if (n > cap) bad.push(`${rel}: ${n} raw colours (allowed ${cap})`)
    }
    expect(bad).toEqual([])
  })
})
