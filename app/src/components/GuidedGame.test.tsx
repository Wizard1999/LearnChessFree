// @vitest-environment jsdom
// The guided game step in a real render: the marked move in words, keyboard play (select the piece, then the square), a move that is not in
// the story refused gently, "Show me", the opponent's automatic reply and the closing sentence.
import { afterEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { GuidedGame } from './GuidedGame'
import { OTHER_MOVE_TEXT } from '../lib/guided'
import type { GuidedMove } from '../types'

const moves: GuidedMove[] = [
  { move: 'e4', by: 'learner', say: 'Your pawn steps into the centre.' },
  { move: 'e5', by: 'opponent', say: 'Black answers in the centre too.' },
  { move: 'Nf3', by: 'learner', say: 'The knight jumps out and attacks the pawn on e5.', hint: 'It is the knight beside your king.' },
]

afterEach(() => { cleanup(); vi.useRealTimers() })

const press = (el: Element, key: string, n = 1) => { for (let k = 0; k < n; k++) fireEvent.keyDown(el, { key }) }

describe('GuidedGame', () => {
  it('plays by keyboard, refuses a move outside the story, replies by itself and ends with the closing sentence', () => {
    vi.useFakeTimers()
    const done = vi.fn()
    render(<GuidedGame moves={moves} title="Your first moves" end="You played a real opening." onDone={done} />)
    expect(screen.getByText('Your move: the pawn from e2 to e4.')).toBeTruthy()
    const grid = screen.getByRole('grid')
    fireEvent.focus(grid) // the cursor starts on the first square with a legal move: a2
    // a2-a3 is legal but not the marked move: refused, nothing changes
    press(grid, 'Enter'); press(grid, 'ArrowUp'); press(grid, 'Enter')
    expect(screen.getByText(OTHER_MOVE_TEXT)).toBeTruthy()
    expect(screen.getByText('Your move: the pawn from e2 to e4.')).toBeTruthy()
    // e2-e4 by keyboard: from a3 back to a2, right to e2, select, up two, place
    press(grid, 'ArrowDown'); press(grid, 'ArrowRight', 4); press(grid, 'Enter'); press(grid, 'ArrowUp', 2); press(grid, 'Enter')
    expect(screen.getByText('Your pawn steps into the centre.')).toBeTruthy()
    expect(screen.getByText(/is replying/)).toBeTruthy()
    act(() => { vi.advanceTimersByTime(1000) })
    expect(screen.getByText('Black answers in the centre too.')).toBeTruthy()
    expect(screen.getByText('Your move: the knight from g1 to f3.')).toBeTruthy()
    // Show me plays the marked move
    fireEvent.click(screen.getByRole('button', { name: 'Show me' }))
    expect(screen.getByText('You played a real opening.')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }))
    expect(done).toHaveBeenCalledTimes(1)
  })
  it('shows the hint after a move that is not in the story', () => {
    render(<GuidedGame moves={[{ move: 'Nf3', by: 'learner', hint: 'It is the knight beside your king.' }]} onDone={() => undefined} />)
    const grid = screen.getByRole('grid')
    fireEvent.focus(grid); press(grid, 'Enter'); press(grid, 'ArrowUp'); press(grid, 'Enter')
    expect(screen.getByText(/It is the knight beside your king/)).toBeTruthy()
  })
  it('lets the learner continue past a game that cannot be played', () => {
    const done = vi.fn()
    render(<GuidedGame moves={[{ move: 'Ke4', by: 'learner' }]} onDone={done} />)
    expect(screen.getByText(/stops early/)).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }))
    expect(done).toHaveBeenCalled()
  })
})
