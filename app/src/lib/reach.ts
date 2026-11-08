// The "reach" step (docs/reach-step.md): grab the stars. The learner moves a piece over a board where the other side never moves, and
// collects a star each time a piece lands on one. Pure helpers: the rounds of a step, the moves on offer, applying one move, the shortest
// solution (breadth-first search, the same rules as tools/validate_lessons.py) and the 1-3 star rating.
import { Chess } from 'chess.js'
import type { ReachRoundSpec, ReachStepSpec } from '../types'

export type ReachOrder = 'any' | 'in-order'

export interface ReachRound {
  /** The start position, normalised: the learner to move, no castling, no en passant. */
  fen: string
  stars: string[]
  order: ReachOrder
  par?: number
  say?: string
  /** The learner's colour: the side to move in the authored FEN. */
  color: 'white' | 'black'
  /** Set when the round cannot be played (bad FEN, bad star square). */
  error?: string
}

export interface ReachMove { from: string; to: string; promotion?: 'q' | 'r' | 'b' | 'n' }

export interface ReachState {
  /** The position now (normalised, the learner to move again). */
  fen: string
  /** Stars collected so far, in the order they were collected. */
  got: string[]
  /** Moves made in this round. */
  moves: number
  last?: [string, string]
}

const SQUARE = /^[a-h][1-8]$/

/** The FEN with the learner to move again: the other side never moves, so the turn is handed straight back. Castling and en passant are dropped. */
export function normalise(fen: string, color: 'w' | 'b'): string {
  const f = fen.trim().split(/\s+/)
  return `${f[0]} ${color} - - 0 1`
}

/** The rounds of a step: the step's own fen and stars are round 1, `rounds` adds more (each may leave out fen and order, taken from the step). */
export function reachRounds(step: ReachStepSpec): ReachRound[] {
  const specs: ReachRoundSpec[] = [{ fen: step.fen, stars: step.stars, order: step.order, par: step.par, say: step.say }, ...(step.rounds ?? [])]
  return specs.map(r => makeRound(r.fen ?? step.fen, r.stars ?? [], r.order ?? step.order ?? 'any', r.par, r.say))
}

function makeRound(fen: string, stars: readonly string[], order: ReachOrder, par?: number, say?: string): ReachRound {
  const side = (fen ?? '').trim().split(/\s+/)[1] === 'b' ? 'b' : 'w'
  const base = { stars: [...stars], order: order === 'in-order' ? 'in-order' as const : 'any' as const, par, say, color: side === 'w' ? 'white' as const : 'black' as const }
  let norm: string
  try { norm = normalise(fen, side); new Chess(norm) } catch { return { ...base, fen: fen ?? '', error: 'The start position is not valid.' } }
  if (!stars.length) return { ...base, fen: norm, error: 'This round has no stars.' }
  const bad = stars.find(s => !SQUARE.test(s))
  if (bad) return { ...base, fen: norm, error: `${bad} is not a square.` }
  const own = stars.find(s => { const p = new Chess(norm).get(s as never); return !!p && p.color === side })
  if (own) return { ...base, fen: norm, error: `The star on ${own} sits on one of your own pieces.` }
  return { ...base, fen: norm }
}

/** The pieces that move in a reach step: every piece of the learner except the king, or the king when it is the only piece. */
function movableFrom(chess: Chess, side: 'w' | 'b'): Set<string> {
  const mine: { sq: string; type: string }[] = []
  for (const row of chess.board()) for (const p of row) if (p && p.color === side) mine.push({ sq: p.square, type: p.type })
  const others = mine.filter(p => p.type !== 'k')
  return new Set((others.length ? others : mine).map(p => p.sq))
}

/** The moves on offer: legal moves of the movable pieces that do not give check (the other side never moves, so a check could never be answered). */
export function reachMoves(fen: string): ReachMove[] {
  let chess: Chess
  try { chess = new Chess(fen) } catch { return [] }
  const side = chess.turn()
  const movable = movableFrom(chess, side)
  return chess.moves({ verbose: true })
    .filter(m => movable.has(m.from) && !/[+#]$/.test(m.san))
    .map(m => ({ from: m.from, to: m.to, ...(m.promotion ? { promotion: m.promotion as ReachMove['promotion'] } : {}) }))
}

/** from-square -> to-squares, for the board. */
export function reachDests(fen: string): Map<string, string[]> {
  const m = new Map<string, string[]>()
  for (const mv of reachMoves(fen)) { const l = m.get(mv.from) ?? []; if (!l.includes(mv.to)) l.push(mv.to); m.set(mv.from, l) }
  return m
}

export function startState(round: ReachRound): ReachState { return { fen: round.fen, got: [], moves: 0 } }

/** The stars still to collect, in their authored order. */
export function starsLeft(round: ReachRound, got: readonly string[]): string[] { return round.stars.filter(s => !got.includes(s)) }

/** The star that counts next: in an in-order round only the first one left, in an 'any' round every one left. */
export function liveStars(round: ReachRound, got: readonly string[]): string[] {
  const left = starsLeft(round, got)
  return round.order === 'in-order' ? left.slice(0, 1) : left
}

export const isDone = (round: ReachRound, s: ReachState): boolean => s.got.length >= round.stars.length

/**
 * Applies one move of the learner. Returns null when the move is not on offer (not legal, a piece that does not move here, or a move that
 * gives check). A promotion without a chosen piece becomes a queen (a drag gives none). `collected` names the star taken, if any.
 */
export function applyReach(round: ReachRound, s: ReachState, mv: ReachMove): { state: ReachState; collected: string | null } | null {
  if (isDone(round, s)) return null
  const offer = reachMoves(s.fen).filter(m => m.from === mv.from && m.to === mv.to)
  if (!offer.length) return null
  return play(round, s, offer.find(m => m.promotion === (mv.promotion ?? 'q')) ?? offer[0])
}

/** Plays a move already known to be on offer. */
function play(round: ReachRound, s: ReachState, pick: ReachMove): { state: ReachState; collected: string | null } {
  const chess = new Chess(s.fen)
  const side = chess.turn()
  chess.move({ from: pick.from, to: pick.to, ...(pick.promotion ? { promotion: pick.promotion } : {}) })
  const collected = liveStars(round, s.got).includes(pick.to) ? pick.to : null
  return { state: { fen: normalise(chess.fen(), side), got: collected ? [...s.got, collected] : s.got, moves: s.moves + 1, last: [pick.from, pick.to] }, collected }
}

/** Past this many positions the search gives up (a step that large should be split; tools/validate_lessons.py uses the same limit). */
export const SEARCH_LIMIT = 100000

/**
 * The shortest list of moves that collects every star still to collect from `s` (breadth-first: every move costs one).
 * null when the stars cannot all be collected from here, or the search is larger than SEARCH_LIMIT.
 */
export function solveReach(round: ReachRound, s: ReachState = startState(round), limit = SEARCH_LIMIT): ReachMove[] | null {
  if (round.error) return null
  if (isDone(round, s)) return []
  const key = (st: ReachState) => `${st.fen.split(' ')[0]}|${round.order === 'in-order' ? st.got.length : [...st.got].sort().join(',')}`
  const seen = new Map<string, { prev: string | null; mv: ReachMove | null }>()
  seen.set(key(s), { prev: null, mv: null })
  let frontier: ReachState[] = [s]
  while (frontier.length) {
    const next: ReachState[] = []
    for (const st of frontier) {
      const here = key(st)
      for (const mv of reachMoves(st.fen)) {
        const r = play(round, st, mv)
        const k = key(r.state)
        if (seen.has(k)) continue
        seen.set(k, { prev: here, mv })
        if (isDone(round, r.state)) {
          const path: ReachMove[] = []
          for (let at: string | null = k; at; ) { const n: { prev: string | null; mv: ReachMove | null } = seen.get(at)!; if (n.mv) path.unshift(n.mv); at = n.prev }
          return path
        }
        if (seen.size > limit) return null
        next.push(r.state)
      }
    }
    frontier = next
  }
  return null
}

/** The fewest moves that collect every star from the start (the authored `par` when the step gives one, which the validator has checked). */
export function parOf(round: ReachRound): number | null {
  if (typeof round.par === 'number') return round.par
  const sol = solveReach(round)
  return sol ? sol.length : null
}

/** 3 stars at par (or better), 2 at one move over, 1 otherwise. A rating, never a penalty: it never blocks going on. */
export function starRating(moves: number, par: number | null): 1 | 2 | 3 {
  if (par === null) return 3
  return moves <= par ? 3 : moves === par + 1 ? 2 : 1
}

export const doneText = (moves: number, par: number | null): string =>
  `Done in ${moves} move${moves === 1 ? '' : 's'}${par !== null ? ` (best ${par})` : ''}.`

/** Pause between the moves of "Show me". Shorter when motion is reduced (no animation to wait for). */
export const showDelay = (reducedMotion: boolean): number => (reducedMotion ? 300 : 650)
