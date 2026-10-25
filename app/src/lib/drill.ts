// Repertoire drill: positions from lines the learner saved in the openings explorer, where it is the learner's move.
// Spacing here is per position (Leitner boxes), unlike skills, because a line is something you recall, not a concept you apply.
import { Chess } from 'chess.js'
import { INTERVAL_DAYS } from './schedule'

export interface RepLine { note: string; side: 'white' | 'black'; san: string[] }
export interface DrillCard { key: string; fen: string; side: 'white' | 'black'; expected: string; before: string[]; note: string; line: string[] }
export interface DrillState { box: number; due: number; seen: number; ok: number }

const DAY = 86400000
const epd = (fen: string) => fen.split(' ').slice(0, 4).join(' ')
export const numbered = (sans: string[]) => sans.map((s, i) => (i % 2 === 0 ? `${i / 2 + 1}. ${s}` : s)).join(' ')

/** One card per distinct position where the learner is to move, taken from every saved line. */
export function buildCards(rep: Record<string, RepLine>): DrillCard[] {
  const out = new Map<string, DrillCard>()
  for (const line of Object.values(rep)) {
    const c = new Chess()
    for (let k = 0; k < line.san.length; k++) {
      const mine = (k % 2 === 0) === (line.side === 'white')
      if (mine) {
        const key = epd(c.fen())
        if (!out.has(key)) out.set(key, { key, fen: c.fen(), side: line.side, expected: line.san[k], before: line.san.slice(0, k), note: line.note, line: line.san })
      }
      try { c.move(line.san[k]) } catch { break }
    }
  }
  return [...out.values()]
}

export function dueCards(cards: DrillCard[], state: Record<string, DrillState>, now = Date.now()): DrillCard[] {
  return cards.filter(c => !state[c.key] || state[c.key].due <= now)
}

/** Record the learner's first answer to a card. A miss sends the card back to tomorrow; a hit moves it one box out. */
export function grade(prev: DrillState | undefined, correct: boolean, now = Date.now()): DrillState {
  const s = prev ?? { box: 0, due: 0, seen: 0, ok: 0 }
  const box = correct ? Math.min(s.box + 1, INTERVAL_DAYS.length) : 0
  return { box, due: now + (correct ? INTERVAL_DAYS[box - 1] : 1) * DAY, seen: s.seen + 1, ok: s.ok + (correct ? 1 : 0) }
}
