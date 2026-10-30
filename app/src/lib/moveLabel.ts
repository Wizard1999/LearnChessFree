/** Move labels beyond mistakes, each with a stated rule. There is deliberately no "Brilliant" or "Great": no rule for them is stated or checked here. */
export type MoveLabel = 'Book' | 'Only move' | 'Best'

/** Second-best line must be at least this many centipawns worse than the best for "Only move". */
export const ONLY_MOVE_GAP_CP = 150

export const LABEL_RULES = "Best: the move played is the engine's first line in the position before it, at the depth that position was analysed. Book: the position after the move is in the bundled opening data. Only move: it is also the best move and the engine's second line was at least 150 centipawns (1.5 pawns) worse. A move with no label was not checked, or is none of these; labels need engine data for that position, and no data means no label."

export interface LabelInput {
  /** The move played, in UCI (e.g. "e2e4"). */
  played: string
  /** The engine's first line in the position before the move, in UCI; undefined when that position was not analysed. */
  best?: string
  /** Best line minus second-best line, in centipawns from the mover's point of view, in that position; undefined when fewer than two lines were searched. */
  gapCp?: number
  /** The position after the move is in the opening graph. */
  inBook: boolean
}

export function moveLabel({ played, best, gapCp, inBook }: LabelInput): MoveLabel | null {
  if (inBook) return 'Book'
  if (best === undefined || played !== best) return null
  if (gapCp !== undefined && gapCp >= ONLY_MOVE_GAP_CP) return 'Only move'
  return 'Best'
}
