// Public entry point of the concept-detector library (src/chess). UI code should import from here.
//
//   import { detectConcepts, explainFacts, findTacticalMoves } from '../chess'
//
// Everything is a pure function of a FEN (and optionally a move); nothing here calls a language model.
// See docs/detectors.md for every definition, its limits, and the benchmark against Lichess puzzle themes.

export * from './detectors/index.ts'
export { explainFacts } from './explain.ts'
export type { ExplainOptions, Explanation } from './explain.ts'
export { explainAttackInfo, explainBackRank, explainBishopPair, explainDiscovered, explainFile, explainFork, explainHanging } from './explain.ts'
export { explainMaterial, explainOutpost, explainPassedPawn, explainPin, explainSkewer, explainTrapped } from './explain.ts'
export { seeGain } from './exchange.ts'
export { PIECE_VALUE } from './board.ts'
export type { Color, PieceRef, PieceSymbol, Square } from './board.ts'
