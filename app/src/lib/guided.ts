// The guided game step (docs/first-game-design.md): the learner plays the marked moves of a short real game, the opponent replies by itself.
// Pure helpers: the plan of the whole game (each SAN turned into squares and positions) and the judgement of one learner move.
import { Chess } from 'chess.js'

export const STANDARD_START = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'

export interface GuidedMoveSpec { move: string; by: 'learner' | 'opponent'; say?: string; hint?: string }

export interface GuidedPly {
  san: string
  from: string
  to: string
  promotion?: 'q' | 'r' | 'b' | 'n'
  by: 'learner' | 'opponent'
  color: 'white' | 'black'
  say?: string
  hint?: string
  /** The position before and after this move. */
  before: string
  after: string
  /** Name of the moving piece, for the words ("the knight"). */
  piece: string
}

export interface GuidedPlan {
  start: string
  plies: GuidedPly[]
  /** The side the learner plays (the colour of their first move); the board faces it. */
  learner: 'white' | 'black'
  /** Set when the list cannot be played from the start position: the plan stops before the bad move. */
  error?: string
}

const NAMES: Record<string, string> = { p: 'pawn', n: 'knight', b: 'bishop', r: 'rook', q: 'queen', k: 'king' }

/** Replays the authored moves. A move that is not legal ends the plan there (the validator stops such lessons from shipping). */
export function planGuided(fen: string | undefined, moves: readonly GuidedMoveSpec[]): GuidedPlan {
  const start = fen && fen.trim() ? fen.trim() : STANDARD_START
  const plies: GuidedPly[] = []
  let chess: Chess
  try { chess = new Chess(start) } catch { return { start, plies, learner: 'white', error: 'The start position is not valid.' } }
  let error: string | undefined
  for (const [i, m] of moves.entries()) {
    const before = chess.fen()
    let mv
    try { mv = chess.move(m.move) } catch { mv = null }
    if (!mv) { error = `Move ${i + 1} (${m.move}) is not legal here.`; break }
    plies.push({
      san: mv.san, from: mv.from, to: mv.to, promotion: mv.promotion as GuidedPly['promotion'], by: m.by === 'opponent' ? 'opponent' : 'learner',
      color: mv.color === 'w' ? 'white' : 'black', say: m.say, hint: m.hint, before, after: chess.fen(), piece: NAMES[mv.piece] ?? 'piece',
    })
  }
  const first = plies.find(p => p.by === 'learner')
  const learner = first ? first.color : (start.split(' ')[1] === 'b' ? 'black' : 'white')
  return { start, plies, learner, error }
}

export type GuidedVerdict = 'accept' | 'other' | 'illegal' | 'not-learner'

/**
 * Judges a move the learner made at ply `index`. 'accept': it is the marked move (a promotion made without choosing a piece counts as the
 * marked piece, since a drag gives none). 'other': a legal move that is not in the story; the board goes back and nothing is recorded.
 * 'illegal': not a legal move at all. 'not-learner': the ply is the opponent's or the game is over.
 */
export function judgeGuided(plan: GuidedPlan, index: number, from: string, to: string, promotion?: string): GuidedVerdict {
  const ply = plan.plies[index]
  if (!ply || ply.by !== 'learner') return 'not-learner'
  if (from === ply.from && to === ply.to && (!ply.promotion || !promotion || promotion === ply.promotion)) return 'accept'
  try {
    const c = new Chess(ply.before)
    const legal = c.moves({ verbose: true }).some(m => m.from === from && m.to === to && (!promotion || !m.promotion || m.promotion === promotion))
    return legal ? 'other' : 'illegal'
  } catch { return 'illegal' }
}

/** What happens after the learner's move or after the opponent's move: the index of the next ply, and whether the opponent plays next. */
export function nextPly(plan: GuidedPlan, index: number): { index: number; opponentNext: boolean; finished: boolean } {
  const n = index + 1
  const p = plan.plies[n]
  return { index: n, opponentNext: !!p && p.by === 'opponent', finished: n >= plan.plies.length }
}

/** The marked move in plain words, for the visible line and screen readers: "Your move: the pawn from e2 to e4." */
export function markedMoveText(ply: GuidedPly): string {
  const promo = ply.promotion ? `, and it becomes a ${NAMES[ply.promotion]}` : ''
  return `Your move: the ${ply.piece} from ${ply.from} to ${ply.to}${promo}.`
}

export const OTHER_MOVE_TEXT = 'Not this one in the story: try the marked move.'

/** Pause before the opponent's reply, so the learner sees their own move land first. Shorter when motion is reduced (no animation to wait for). */
export const opponentDelay = (reducedMotion: boolean): number => (reducedMotion ? 250 : 650)
