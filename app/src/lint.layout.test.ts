// Layout guards for the exercise step (a bug report: the Hint and Reset buttons sat on the board's file letters). These read the CSS because the layout itself
// needs a real browser; the manual check is in docs/design-controls.md ("Exercise step layout check").
import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const big = readFileSync(join(__dirname, 'styles', 'bigboard.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '')
const board = readFileSync(join(__dirname, 'components', 'ChessBoard.tsx'), 'utf8')

describe('exercise step layout', () => {
  it('the wide lesson grid has room for every part of an exercise beside the board, and the board spans them all', () => {
    const rows = Number(/\.page\.stage \.lesson \{[^}]*grid-template-rows: repeat\((\d+), auto\) 1fr/.exec(big)?.[1])
    expect(rows).toBeGreaterThanOrEqual(30) // an exercise has well over a dozen parts; any part past the numbered rows fell under the board
    const span = Number(/\.page\.stage \.lesson \.board-wrap \{[^}]*grid-row: 1 \/ (\d+)/.exec(big)?.[1])
    expect(span).toBe(rows + 2) // rows plus the 1fr row, so the board covers the whole left column
  })
  it('the room kept under a board with the control-map bar includes the bar\'s own top margin (so the bar never covers what follows)', () => {
    expect(board).toMatch(/offsetHeight \+ \(parseFloat\(getComputedStyle\(el\)\.marginTop\)/)
    expect(board).toMatch(/marginBottom: barH \+ 14/)
    expect(board).toMatch(/addEventListener\('resize', measure\)/)
  })
  it('the bar still clears the file letters outside the board', () => {
    expect(big).toMatch(/@media \(min-width: 721px\) \{ \.controlbar \{ margin-top: 1\.9rem; \} \}/)
  })
})
