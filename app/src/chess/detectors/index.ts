// Concept detectors: pure functions over a FEN (and optionally a move) that return structured FACTS.
// Nothing here is evaluative beyond counted material, and nothing here calls a language model.
// See docs/detectors.md for every definition, its limits, and the benchmark against Lichess puzzle themes.
//
// Two ways to call each detector:
//   detectX(fen)        POSITION mode: the pattern as it stands in the position.
//   detectX(fen, move)  MOVE mode: `fen` is the position BEFORE `move` (SAN "Nf3" or UCI "g1f3"); the result is what the
//                       move creates or carries out. Throws Error if the FEN is invalid or the move is not legal in it.

import type { Chess } from 'chess.js'
import type { Color } from '../board.ts'
import { loadFen } from '../board.ts'
import type { Ctx, MoveInfo } from '../context.ts'
import { ctxFromMove, makeCtx } from '../context.ts'
import { attackCountFromCtx } from './attackCount.ts'
import type { AttackCountResult } from './attackCount.ts'
import { backRankFromCtx } from './backrank.ts'
import type { BackRankResult } from './backrank.ts'
import { bishopPairFromCtx } from './bishopPair.ts'
import type { BishopPairResult } from './bishopPair.ts'
import { discoveredFromCtx, doubleCheckFromCtx } from './discovered.ts'
import type { DiscoveredResult, DoubleCheckResult } from './discovered.ts'
import { forkFromCtx } from './fork.ts'
import type { ForkResult } from './fork.ts'
import { hangingFromCtx } from './hanging.ts'
import type { HangingResult } from './hanging.ts'
import { isolatedDoubledFromCtx } from './isolatedDoubled.ts'
import type { IsolatedDoubledResult } from './isolatedDoubled.ts'
import { materialFromCtx } from './materialCount.ts'
import type { MaterialResult } from './materialCount.ts'
import { openFileFromCtx } from './openFile.ts'
import type { OpenFileResult } from './openFile.ts'
import { outpostFromCtx } from './outpost.ts'
import type { OutpostResult } from './outpost.ts'
import { passedPawnFromCtx } from './passedPawn.ts'
import type { PassedPawnResult } from './passedPawn.ts'
import { pinFromCtx } from './pin.ts'
import type { PinResult } from './pin.ts'
import { skewerFromCtx } from './skewer.ts'
import type { SkewerResult } from './skewer.ts'
import { trappedFromCtx } from './trapped.ts'
import type { TrappedResult } from './trapped.ts'

export { detectAttackCount } from './attackCount.ts'
export { detectBackRank } from './backrank.ts'
export { detectBishopPair } from './bishopPair.ts'
export { detectDiscovered, detectDoubleCheck } from './discovered.ts'
export { detectFork } from './fork.ts'
export { detectHanging, hangingInfo } from './hanging.ts'
export { detectIsolatedDoubled } from './isolatedDoubled.ts'
export { detectMaterialCount } from './materialCount.ts'
export { detectOpenFile } from './openFile.ts'
export { detectOutpost } from './outpost.ts'
export { detectPassedPawn } from './passedPawn.ts'
export { detectPin } from './pin.ts'
export { detectSkewer } from './skewer.ts'
export { detectTrapped, trappedInfo } from './trapped.ts'

export type { AttackCountResult, BackRankResult, BishopPairResult, DiscoveredResult, DoubleCheckResult, ForkResult, HangingResult }
export type { IsolatedDoubledResult, MaterialResult, OpenFileResult, OutpostResult, PassedPawnResult, PinResult, SkewerResult, TrappedResult }
export type { MoveInfo }

export type ConceptName =
  | 'fork' | 'pin' | 'skewer' | 'discoveredAttack' | 'doubleCheck' | 'hangingPiece' | 'trappedPiece' | 'backRank'
  | 'passedPawn' | 'openFile' | 'outpost' | 'bishopPair' | 'isolatedDoubled'

/** A concept that is present in the result, with whether the tactic was verified to WORK (null where "works" is not defined). */
export interface ConceptTag {
  concept: ConceptName
  works: boolean | null
}

export interface ConceptFacts {
  fen: string
  /** Side to move in `fen`. */
  sideToMove: Color
  /** The move that was analysed (null in position mode). */
  move: MoveInfo | null
  fork: ForkResult
  pin: PinResult
  skewer: SkewerResult
  discovered: DiscoveredResult
  doubleCheck: DoubleCheckResult
  hanging: HangingResult
  trapped: TrappedResult
  backRank: BackRankResult
  passedPawn: PassedPawnResult
  openFile: OpenFileResult
  outpost: OutpostResult
  bishopPair: BishopPairResult
  isolatedDoubled: IsolatedDoubledResult
  material: MaterialResult
  attackCount: AttackCountResult
  /** Convenience list of the concepts whose `found` is true (material and attackCount are not listed). */
  concepts: ConceptTag[]
}

function factsFromCtx(ctx: Ctx): ConceptFacts {
  const fork = forkFromCtx(ctx)
  const pin = pinFromCtx(ctx)
  const skewer = skewerFromCtx(ctx)
  const discovered = discoveredFromCtx(ctx)
  const doubleCheck = doubleCheckFromCtx(ctx)
  const hanging = hangingFromCtx(ctx)
  const trapped = trappedFromCtx(ctx)
  const backRank = backRankFromCtx(ctx)
  const passedPawn = passedPawnFromCtx(ctx)
  const openFile = openFileFromCtx(ctx)
  const outpost = outpostFromCtx(ctx)
  const bishopPair = bishopPairFromCtx(ctx)
  const isolatedDoubled = isolatedDoubledFromCtx(ctx)
  const material = materialFromCtx(ctx)
  const attackCount = attackCountFromCtx(ctx)
  const concepts: ConceptTag[] = []
  const add = (found: boolean, concept: ConceptName, works: boolean | null) => {
    if (found) concepts.push({ concept, works })
  }
  add(fork.found, 'fork', fork.works)
  add(pin.found, 'pin', pin.works)
  add(skewer.found, 'skewer', skewer.works)
  add(discovered.found, 'discoveredAttack', discovered.works)
  add(doubleCheck.found, 'doubleCheck', true)
  add(hanging.found, 'hangingPiece', null)
  add(trapped.found, 'trappedPiece', trapped.works)
  add(backRank.found, 'backRank', backRank.works)
  add(passedPawn.found, 'passedPawn', null)
  add(openFile.found, 'openFile', null)
  add(outpost.found, 'outpost', null)
  add(bishopPair.found, 'bishopPair', null)
  add(isolatedDoubled.found, 'isolatedDoubled', null)
  return {
    fen: ctx.fen,
    sideToMove: ctx.before.turn(),
    move: ctx.info,
    fork, pin, skewer, discovered, doubleCheck, hanging, trapped, backRank,
    passedPawn, openFile, outpost, bishopPair, isolatedDoubled, material, attackCount,
    concepts,
  }
}

/**
 * Run every detector. Position mode: `detectConcepts(fen)`. Move mode: `detectConcepts(fen, move)` where `fen` is the
 * position before the move. Throws Error on an invalid FEN or an illegal move.
 */
export function detectConcepts(fen: string, move?: string): ConceptFacts {
  return factsFromCtx(makeCtx(fen, move))
}

// ---------------------------------------------------------------------------------------------------------------------

/** A legal move of the side to move that creates a verified tactic (see findTacticalMoves). */
export interface TacticalMove {
  move: MoveInfo
  concepts: ConceptTag[]
  facts: ConceptFacts
}

/**
 * OPPORTUNITIES: every legal move of the side to move in `fen` that carries out one of the tactical concepts
 * (default: fork, pin, skewer, discoveredAttack, doubleCheck, hangingPiece, trappedPiece, backRank) in a verified way:
 *   fork / pin / skewer / discoveredAttack: found AND works (two-ply verified, see docs/detectors.md);
 *   doubleCheck, backRank (mate), trappedPiece: found;
 *   hangingPiece: the move captures a hanging piece (capturedHanging).
 * Moves are scanned one by one with the full detector set, so this costs on the order of 10-100 ms per position.
 */
export function findTacticalMoves(fen: string, only?: ConceptName[]): TacticalMove[] {
  const before: Chess = loadFen(fen)
  const wanted = new Set<ConceptName>(only ?? ['fork', 'pin', 'skewer', 'discoveredAttack', 'doubleCheck', 'hangingPiece', 'trappedPiece', 'backRank'])
  const out: TacticalMove[] = []
  for (const m of before.moves({ verbose: true })) {
    const ctx = ctxFromMove(fen, before, m)
    const facts = factsFromCtx(ctx)
    const concepts = facts.concepts.filter(t => {
      if (!wanted.has(t.concept)) return false
      switch (t.concept) {
        case 'fork': case 'pin': case 'skewer': case 'discoveredAttack': return t.works === true
        case 'trappedPiece': return t.works === true
        case 'hangingPiece': return facts.hanging.capturedHanging !== null
        case 'backRank': return facts.backRank.details.some(d => d.mate)
        default: return true
      }
    })
    if (concepts.length > 0 && ctx.info) out.push({ move: ctx.info, concepts, facts })
  }
  return out
}
