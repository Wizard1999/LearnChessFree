// Turns an engine's preferred move (or an opponent's best reply) into named tactical concepts, using the structural
// detectors in src/chess. The detectors report facts about a position and a move. They do not explain why a move was
// good, and a pattern being present is not a claim that the move was best: the engine already decided that.
import { detectConcepts, type ConceptName, type ConceptFacts } from '../chess/detectors'

export const TACTICS: ConceptName[] = ['fork', 'pin', 'skewer', 'discoveredAttack', 'doubleCheck', 'hangingPiece', 'trappedPiece', 'backRank']

export const CONCEPT_LABEL: Record<ConceptName, string> = {
  fork: 'fork (double attack)', pin: 'pin', skewer: 'skewer', discoveredAttack: 'discovered attack', doubleCheck: 'double check',
  hangingPiece: 'unprotected piece', trappedPiece: 'trapped piece', backRank: 'back-rank mate',
  passedPawn: 'passed pawn', openFile: 'open file', outpost: 'outpost', bishopPair: 'bishop pair', isolatedDoubled: 'weak pawns',
}

/** The skill a concept is practiced under, when the course has it. */
export const CONCEPT_SKILL: Partial<Record<ConceptName, string>> = {
  fork: 'TAC.FORK', pin: 'TAC.PIN', skewer: 'TAC.SKEWER', discoveredAttack: 'TAC.DISCOVERED', doubleCheck: 'TAC.DOUBLECHECK',
  hangingPiece: 'SAF.LOOSE', trappedPiece: 'TAC.TRAPPED', backRank: 'TAC.BACKRANK',
}

/**
 * Concepts that a legal move carries out, limited to what docs/detectors.md section 6 measured as safe to show a learner
 * (a claim the engine confirmed 90% of the time or better, or exact by construction): forks, absolute pins, discovered attacks and
 * trapped pieces only where the detector verified that they WORK, double check, back-rank mate, and the capture of a loose
 * non-pawn piece. Skewers (88% on a small sample), relative pins and tags without `works` are deliberately not shown.
 */
export function tacticsOfMove(fenBefore: string, move: string): ConceptName[] {
  let f: ConceptFacts
  try { f = detectConcepts(fenBefore, move) } catch { return [] }
  const out: ConceptName[] = []
  if (f.fork.found && f.fork.works) out.push('fork')
  if (f.pin.details.some(d => d.works && d.kind === 'absolute')) out.push('pin')
  if (f.discovered.found && f.discovered.works) out.push('discoveredAttack')
  if (f.doubleCheck.found) out.push('doubleCheck')
  if (f.trapped.found && f.trapped.works) out.push('trappedPiece')
  if (f.hanging.capturedHanging !== null && f.hanging.capturedHanging.piece.type !== 'p') out.push('hangingPiece')
  if (f.backRank.details.some(d => d.mate)) out.push('backRank')
  return out
}

export interface Moment {
  ply: number            // 1-based index of the move that lost the ground
  san: string
  loss: number           // centipawns
  missed: { san: string; concepts: ConceptName[] } | null
  allowed: { san: string; concepts: ConceptName[] } | null
}

/** For one big drop: what pattern did the engine's preferred move carry out, and what did the opponent's best reply carry out? */
export function momentFor(opts: { ply: number; san: string; played: string; loss: number; fenBefore: string; fenAfter: string; bestBefore?: string; bestReply?: string }): Moment {
  const { fenBefore, fenAfter, bestBefore, bestReply, played } = opts
  const sanOf = (fen: string, uci: string) => { try { return detectConcepts(fen, uci).move?.san ?? uci } catch { return uci } }
  const missedConcepts = bestBefore && bestBefore !== played ? tacticsOfMove(fenBefore, bestBefore) : []
  const allowedConcepts = bestReply ? tacticsOfMove(fenAfter, bestReply) : []
  return {
    ply: opts.ply, san: opts.san, loss: opts.loss,
    missed: bestBefore && bestBefore !== played ? { san: sanOf(fenBefore, bestBefore), concepts: missedConcepts } : null,
    allowed: bestReply ? { san: sanOf(fenAfter, bestReply), concepts: allowedConcepts } : null,
  }
}
