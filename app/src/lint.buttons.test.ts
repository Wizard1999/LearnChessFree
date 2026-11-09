// Buttons stay readable wherever they sit (the "Back to Curriculum" bug): a link styled as a button must not be recoloured by a card's link rule, and a disabled
// control keeps the opacity that tools/check_contrast.py gates (its DISABLED_OPACITY). The colour pairs themselves are checked by tools/check_contrast.py.
import { describe, expect, it } from 'vitest'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const SRC = join(__dirname)
const files = ['index.css', 'theme.css', ...readdirSync(join(SRC, 'styles')).filter(f => f.endsWith('.css')).map(f => `styles/${f}`)]
const css = (f: string) => readFileSync(join(SRC, f), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '')
const rules = (f: string) => [...css(f).matchAll(/([^{}]+)\{([^{}]*)\}/g)].map(m => ({ sel: m[1].trim(), body: m[2] }))

describe('button colours survive their surroundings', () => {
  it('no card or page link rule recolours a link that is a button', () => {
    for (const f of files) for (const { sel, body } of rules(f)) {
      if (!/(^|[\s,])color\s*:/.test(body)) continue
      for (const part of sel.split(',').map(s => s.trim())) {
        // a rule for plain links (ends in " a") inside a card, a page or a field
        if (/(\.card|\.page|\[data-field\]|\.hero)[^,]*\sa$/.test(part)) expect(part, `${f}: ${part} would recolour .button links`).toMatch(/a:not\(\.button\)/)
      }
    }
  })
  it('disabled controls use the opacity the contrast gate assumes', () => {
    const gate = Number(/DISABLED_OPACITY = ([\d.]+)/.exec(readFileSync(join(SRC, '..', '..', 'tools', 'check_contrast.py'), 'utf8'))?.[1])
    expect(gate).toBeGreaterThan(0)
    for (const [f, sel] of [['index.css', 'button:disabled'], ['styles/controls.css', ':root:root .btn:disabled, :root:root .btn[aria-disabled=true]']] as const) {
      const r = rules(f).find(x => x.sel === sel)
      expect(r, `${f}: ${sel}`).toBeTruthy()
      expect(Number(/opacity:\s*([\d.]+)/.exec(r!.body)?.[1]), `${f}: ${sel}`).toBe(gate)
    }
  })
})
