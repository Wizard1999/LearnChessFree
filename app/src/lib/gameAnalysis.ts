// Whole-game engine analysis, shared by My games (the review) and the post-game screen after a game against the practice opponent.
import type { ConceptName } from '../chess/detectors'
import type { EngineLine } from '../engine'
import type { Ply } from './pgn'
import { momentFor } from './opportunities'

/** Centipawns from the mover's point of view. */
export interface MoveEval { before: number; after: number; best?: string; loss: number }
export interface Analysis {
  depth: string
  evals: MoveEval[]
  whiteEvals: number[]
  at: number
  /** bests[k]: the engine's preferred move (UCI) in the position before ply k+1; bests[n]: in the final position. */
  bests?: string[]
  /** For each move that lost a pawn or more: the tactical patterns the better move carried out (missed) and the reply carried out (allowed). */
  tags?: Record<number, { missed: ConceptName[]; allowed: ConceptName[] }>
}

export const clamp = (v: number) => Math.max(-1000, Math.min(1000, v))
export const toCp = (kind: 'cp' | 'mate', value: number) => (kind === 'mate' ? (value > 0 ? 1000 - value : -1000 - value) : clamp(value))

/** The part of the engine this needs (a test passes a stub). */
export interface Analyser { analyse(fen: string, opts: { movetime?: number }): Promise<Pick<EngineLine, 'kind' | 'value' | 'pv'>[]> }

export const ANALYSIS_LABEL = '140 ms per position (Stockfish 19 Lite)'

/**
 * Scores every position of the game, then works out each move's loss and names the patterns behind every drop of a pawn or more.
 * Returns null if `cancelled()` becomes true part-way.
 */
export async function analysePlies(plies: readonly Ply[], eng: Analyser, opts: { movetime?: number; onProgress?: (fraction: number) => void; cancelled?: () => boolean } = {}): Promise<Analysis | null> {
  if (plies.length === 0) return null
  const whiteEvals: number[] = []
  const bests: string[] = []
  const fens = [plies[0].fenBefore, ...plies.map(p => p.fenAfter)]
  for (let k = 0; k < fens.length; k++) {
    if (opts.cancelled?.()) return null
    opts.onProgress?.(k / fens.length)
    const lines = await eng.analyse(fens[k], { movetime: opts.movetime ?? 140 })
    const turnWhite = fens[k].split(' ')[1] === 'w'
    const s = lines[0] ? toCp(lines[0].kind, lines[0].value) : 0
    whiteEvals.push(turnWhite ? s : -s)
    bests.push(lines[0]?.pv[0] ?? '')
  }
  const evals: MoveEval[] = plies.map((pl, k) => {
    const mover = pl.color === 'w' ? 1 : -1
    const before = whiteEvals[k] * mover
    const after = whiteEvals[k + 1] * mover
    return { before, after, loss: Math.max(0, before - after) }
  })
  const tags: NonNullable<Analysis['tags']> = {}
  plies.forEach((pl, k) => {
    if (evals[k].loss < 100) return
    const m = momentFor({ ply: k + 1, san: pl.san, played: pl.uci, loss: evals[k].loss, fenBefore: pl.fenBefore, fenAfter: pl.fenAfter, bestBefore: bests[k], bestReply: bests[k + 1] })
    tags[k] = { missed: m.missed?.concepts ?? [], allowed: m.allowed?.concepts ?? [] }
  })
  return { depth: ANALYSIS_LABEL, evals, whiteEvals, bests, tags, at: Date.now() }
}
