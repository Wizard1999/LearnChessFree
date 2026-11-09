// The star chart's subject colours (D88c): the crust band and the constellation name use the subject hue mixed by shares that live in the palette files (checked by
// tools/check_contrast.py), in every block of both looks, so a look that drops them cannot ship an unchecked colour.
import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { hueOfStrand } from './lib/hue'

const read = (f: string) => readFileSync(join(__dirname, f), 'utf8')

describe('star chart subject colours', () => {
  for (const f of ['styles/atlas.css', 'styles/palette.css']) {
    it(`${f} defines the label and band shares in the light block and both dark blocks`, () => {
      const css = read(f)
      expect(css.match(/--sky-hue-label: \d+%; --sky-hue-band: \d+%;/g)?.length).toBe(3)
    })
  }
  it('the crust and the name read the checked shares, and the crust is always on', () => {
    const css = read('styles/map.css')
    expect(css).toMatch(/\.chart \.strandband \{[^}]*var\(--sky-hue-band\)/)
    expect(css).toMatch(/\.arclabel\.strand \{[^}]*var\(--sky-hue-label\)/)
    expect(css).not.toMatch(/\.slices[^{]*\.strandband/) // the toggle only adds the wedge tint
  })
  it('every subject has a hue to take', () => { for (let i = 1; i <= 11; i++) expect(hueOfStrand(`S${i}`)).toBe(String(i)) })
})

describe('the backdrop exemption (D88f)', () => {
  it('only rules for the backdrop tier set a numeric opacity below 1 on a line; every other line uses the checked floor', () => {
    const css = read('styles/map.css').replace(/\/\*[\s\S]*?\*\//g, '')
    const bad: string[] = []
    for (const m of css.matchAll(/([^{}@]+)\{([^{}]*)\}/g)) {
      const sel = m[1].replace(/\s+/g, ' ').trim()
      if (!sel.includes('.mapglow') || sel.includes('.backdrop') || sel.includes('.edgehalo')) continue
      for (const o of m[2].matchAll(/(?<![-\w])opacity\s*:\s*([0-9.]+)\s*;/g)) if (parseFloat(o[1]) < 1) bad.push(`${sel}: ${o[1]}`)
    }
    expect(bad).toEqual([])
  })
  it('live lines use the floor token, so the 3:1 gate covers them', () => {
    expect(read('styles/map.css')).toMatch(/\.edgecore \.mapglow \{[^}]*var\(--sky-edge-floor\)/)
  })
  it('the checker documents the exemption', () => {
    expect(readFileSync(join(__dirname, '..', '..', 'tools', 'check_contrast.py'), 'utf8')).toMatch(/D88f: the one exemption/)
  })
})
