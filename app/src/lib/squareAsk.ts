// "Ask the engine about this square": two short searches (the engine's best move, and the best capture on the chosen square),
// then a verdict in plain words. The searches are injected, so the logic is testable without an engine.
import { Chess, type Square } from 'chess.js'
import type { EngineLine } from '../engine'

export const SQUARE_ASK_DEPTH = 12

export const SQUARE_ASK_CAUTION = "The map's exchange count only plays out captures on one square. It ignores sacrifices and tactics, which the engine does see."

export type Analyse = (fen: string, opts: { depth: number; multipv: number; searchmoves?: string[] }) => Promise<EngineLine[]>

export interface SquareAnswer {
  mover: 'White' | 'Black'
  square: string
  depth: number
  best: { san: string; uci: string; line: EngineLine } | null
  /** The best capture on the square, when one exists. */
  capture: { san: string; uci: string; line: EngineLine } | null
}

/** Every legal capture that lands on `square` (en passant included), as UCI strings. Promotions count once per piece. */
export function captureMoves(fen: string, square: string): string[] {
  let chess: Chess
  try { chess = new Chess(fen) } catch { return [] }
  return chess.moves({ verbose: true })
    .filter(m => m.to === square && (m.flags.includes('c') || m.flags.includes('e')))
    .map(m => `${m.from}${m.to}${m.promotion ?? ''}`)
}

/** The first move of a line as standard notation in this position, or null when it does not apply. */
export function sanOf(fen: string, uci: string | undefined): string | null {
  if (!uci || uci.length < 4) return null
  try {
    const c = new Chess(fen)
    const m = c.move({ from: uci.slice(0, 2) as Square, to: uci.slice(2, 4) as Square, promotion: uci[4] })
    return m.san
  } catch { return null }
}

/** Runs the two searches. `isCancelled` is checked before the second search and before returning. Resolves null when cancelled. */
export async function askAboutSquare(fen: string, square: string, analyse: Analyse, isCancelled: () => boolean = () => false): Promise<SquareAnswer | null> {
  let mover: 'White' | 'Black' = 'White'
  try { mover = new Chess(fen).turn() === 'w' ? 'White' : 'Black' } catch { /* the caller shows a message below */ }
  const bestLines = await analyse(fen, { depth: SQUARE_ASK_DEPTH, multipv: 1 })
  if (isCancelled()) return null
  const b = bestLines[0]
  const bestUci = b?.pv[0]
  const best = b && bestUci ? { san: sanOf(fen, bestUci) ?? bestUci, uci: bestUci, line: b } : null
  let capture: SquareAnswer['capture'] = null
  const caps = captureMoves(fen, square)
  if (caps.length) {
    const cl = (await analyse(fen, { depth: SQUARE_ASK_DEPTH, multipv: 1, searchmoves: caps }))[0]
    if (isCancelled()) return null
    const cu = cl?.pv[0]
    if (cl && cu) capture = { san: sanOf(fen, cu) ?? cu, uci: cu, line: cl }
  }
  return { mover, square, depth: Math.min(best?.line.depth ?? SQUARE_ASK_DEPTH, capture?.line.depth ?? SQUARE_ASK_DEPTH), best, capture }
}

/** A score from the mover's side in plain words: "+0.35 pawns" or "mate in 3 for the mover". */
export function evalWords(line: EngineLine): string {
  if (line.kind === 'mate') return line.value > 0 ? `a forced mate in ${line.value}` : `a forced mate against, in ${Math.abs(line.value)}`
  const v = line.value / 100
  return `${v > 0 ? '+' : ''}${v.toFixed(2)} pawns`
}

/** The change in pawns from the mover's side (capture minus best), or null when a mate is involved. */
export function evalChange(best: EngineLine, capture: EngineLine): number | null {
  if (best.kind !== 'cp' || capture.kind !== 'cp') return null
  return (capture.value - best.value) / 100
}

/** The verdict as short plain sentences (the caution line is separate: SQUARE_ASK_CAUTION). */
export function formatVerdict(a: SquareAnswer): string[] {
  const out: string[] = []
  const at = `at depth ${a.depth}`
  if (!a.best) return ['The engine has no move here (the game is over).']
  out.push(`The engine's top move for ${a.mover} is ${a.best.san}, worth ${evalWords(a.best.line)} for ${a.mover} (${at}).`)
  if (!a.capture) { out.push(`${a.mover} has no capture on ${a.square}.`); return out }
  if (a.capture.uci === a.best.uci) { out.push(`The best capture on ${a.square}, ${a.capture.san}, is also the engine's top move.`); return out }
  const d = evalChange(a.best.line, a.capture.line)
  if (d === null) {
    out.push(`Playing the best capture on ${a.square}, ${a.capture.san}, instead leads to ${evalWords(a.capture.line)} for ${a.mover} (${at}).`)
  } else if (Math.abs(d) < 0.05) {
    out.push(`Playing the best capture on ${a.square}, ${a.capture.san}, instead changes almost nothing: about the same for ${a.mover} (${at}).`)
  } else {
    const p = Math.abs(d).toFixed(2)
    out.push(`Playing the best capture on ${a.square}, ${a.capture.san}, instead changes the evaluation by ${d > 0 ? '+' : '-'}${p} pawns for ${a.mover}: it is ${d > 0 ? 'better' : 'worse'} by ${p} (${at}).`)
  }
  return out
}
