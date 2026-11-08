// @vitest-environment jsdom
// The reach step ("grab the stars") in a real render: stars named in words and on their squares, keyboard play, the move counter and best,
// the result line with a 1-3 star rating, Retry, Show me (no rating after it), rounds, and a broken step that still lets the learner go on.
import { afterEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { ReachStep } from './ReachStep'
import type { ReachStepSpec } from '../types'

const ROOK = '7k/8/8/8/8/8/8/R3K3 w - - 0 1'
const step: ReachStepSpec = { fen: ROOK, stars: ['a5', 'd5'], order: 'any', par: 2, say: 'The rook slides along straight lines.' }

afterEach(() => { cleanup(); vi.useRealTimers() })
const press = (el: Element, key: string, n = 1) => { for (let k = 0; k < n; k++) fireEvent.keyDown(el, { key }) }

describe('ReachStep', () => {
  it('names every star, plays by keyboard, collects the stars and rates the result without blocking', () => {
    const done = vi.fn()
    render(<ReachStep step={step} onDone={done} />)
    expect(screen.getByText('Grab the stars')).toBeTruthy()
    expect(screen.getByText('Star on a5')).toBeTruthy()
    expect(screen.getByText('Star on d5')).toBeTruthy()
    expect(screen.getByLabelText('a5, empty, star')).toBeTruthy()
    expect(screen.getByText('The rook slides along straight lines.')).toBeTruthy()
    expect(screen.getByText('Moves: 0')).toBeTruthy()
    const grid = screen.getByRole('grid')
    fireEvent.focus(grid) // the cursor starts on the rook, the only piece that moves
    press(grid, 'Enter'); press(grid, 'ArrowUp', 4); press(grid, 'Enter') // a1-a5
    expect(screen.getByText('Moves: 1')).toBeTruthy()
    expect(screen.getByText(/Star on a5 collected\. 1 star left\./)).toBeTruthy()
    expect(screen.getByText(/Star on a5 \(collected\)/)).toBeTruthy()
    press(grid, 'Enter'); press(grid, 'ArrowRight', 3); press(grid, 'Enter') // a5-d5
    expect(screen.getByText('Done in 2 moves (best 2).')).toBeTruthy()
    expect(screen.getByRole('img', { name: '3 of 3 stars' })).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }))
    expect(done).toHaveBeenCalledTimes(1)
  })
  it('a longer route gets fewer stars but still continues; Retry starts again', () => {
    render(<ReachStep step={step} onDone={() => undefined} />)
    const grid = screen.getByRole('grid')
    fireEvent.focus(grid)
    press(grid, 'Enter'); press(grid, 'ArrowUp', 2); press(grid, 'Enter') // a1-a3
    press(grid, 'Enter'); press(grid, 'ArrowUp', 2); press(grid, 'Enter') // a3-a5
    press(grid, 'Enter'); press(grid, 'ArrowRight', 3); press(grid, 'Enter') // a5-d5
    expect(screen.getByText('Done in 3 moves (best 2).')).toBeTruthy()
    expect(screen.getByRole('img', { name: '2 of 3 stars' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Continue' })).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }))
    expect(screen.getByText('Moves: 0')).toBeTruthy()
  })
  it('Show me plays the shortest way, without a rating, then rounds go on to the next', () => {
    vi.useFakeTimers()
    const done = vi.fn()
    render(<ReachStep step={{ ...step, rounds: [{ stars: ['c3'], par: 2 }] }} onDone={done} />)
    expect(screen.getByText(/round 1 of 2/)).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Show me' }))
    act(() => { vi.advanceTimersByTime(3000) })
    expect(screen.getByText('Shown in 2 moves (best 2).')).toBeTruthy()
    expect(screen.queryByRole('img', { name: /of 3 stars/ })).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Next round' }))
    expect(screen.getByText(/round 2 of 2/)).toBeTruthy()
    expect(screen.getByText('Star on c3')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Show me' }))
    act(() => { vi.advanceTimersByTime(3000) })
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }))
    expect(done).toHaveBeenCalledTimes(1)
  })
  it('lets the learner go on past a step that cannot be played', () => {
    const done = vi.fn()
    render(<ReachStep step={{ fen: 'not a fen', stars: ['a5'] }} onDone={done} />)
    expect(screen.getByText(/cannot be played/)).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }))
    expect(done).toHaveBeenCalled()
  })
})
