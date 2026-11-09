// The Scholarmate and Atlas board squares live twice: as tokens (styles/palette.css and styles/atlas.css, which tools/check_contrast.py and this test read)
// and inside SVG data URIs (styles/scholarmate.css and styles/atlas.css, because a background image cannot use a CSS variable). They must never drift apart.
import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

for (const [name, tokenFile, uriFile] of [['Scholarmate', 'styles/palette.css', 'styles/scholarmate.css'], ['Atlas', 'styles/atlas.css', 'styles/atlas.css']] as const) {
  const palette = readFileSync(join(__dirname, tokenFile), 'utf8')
  const look = readFileSync(join(__dirname, uriFile), 'utf8')
  const tokens = [...palette.matchAll(/--board-sq-light:\s*(#[0-9a-fA-F]{6});\s*--board-sq-dark:\s*(#[0-9a-fA-F]{6});/g)].map(m => [m[1].toLowerCase(), m[2].toLowerCase()])
  const uris = [...look.matchAll(/url\("data:image\/svg\+xml,([^"]*)"\)/g)].map(m => decodeURIComponent(m[1])).filter(u => u.includes("viewBox='0 0 8 8'"))
  const colours = (svg: string) => { const f = [...svg.matchAll(/fill='(#[0-9a-fA-F]{6})'/g)].map(m => m[1].toLowerCase()); return [f[0], f[1]] }

  describe(`${name} board squares`, () => {
    it('are defined for light (once) and dark (twice: the system block and the explicit block)', () => {
      expect(tokens.length).toBe(3)
      expect(tokens[1]).toEqual(tokens[2])
    })
    it('match the colours inside the board images', () => {
      expect(uris.length).toBe(3) // light, dark for the system preference, dark for the explicit choice
      expect(uris[1]).toBe(uris[2])
      expect(colours(uris[0])).toEqual(tokens[0])
      expect(colours(uris[1])).toEqual(tokens[1])
    })
    it('draw 32 dark squares', () => {
      for (const u of uris.slice(0, 2)) expect((u.match(/<rect x=/g) ?? []).length).toBe(32)
    })
  })
}
