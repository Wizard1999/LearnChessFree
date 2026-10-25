// "Also sound" check for find-the-move exercises. Items store a short accepted set (the engine's top moves at the time of
// validation), but a learner can play a different move that is just as good. Marking it wrong would teach the opposite of
// what the school is for, so a move outside the accepted set is compared with the engine's best line at the same depth.
// Engine numbers are evidence under a depth limit, not proof, and the wording says so.
import type { EngineLine } from '../engine'

/** How far below the best move (in centipawns, mover's point of view) a move may be and still count as sound. */
export const ALT_TOLERANCE_CP = 20
/** When both the best move and the played move are this far ahead, the position is simply winning and either wins. */
export const DECISIVE_CP = 500

export interface AltVerdict { fine: boolean; why: string }

export function isAlsoSound(best: EngineLine | undefined, alt: EngineLine | undefined): AltVerdict {
  if (!best || !alt) return { fine: false, why: 'no engine result' }
  if (best.kind === 'mate') {
    if (best.value > 0) return alt.kind === 'mate' && alt.value > 0 && alt.value <= best.value ? { fine: true, why: 'it also forces mate as quickly' } : { fine: false, why: 'it does not force mate as quickly' }
    return { fine: alt.kind === 'mate' && alt.value === best.value, why: 'both lose to mate' }
  }
  if (alt.kind === 'mate') return alt.value > 0 ? { fine: true, why: 'it forces mate' } : { fine: false, why: 'it allows mate' }
  if (best.value >= DECISIVE_CP && alt.value >= DECISIVE_CP) return { fine: true, why: 'both moves keep a decisive advantage' }
  if (alt.value >= best.value - ALT_TOLERANCE_CP) return { fine: true, why: `the engine rates it within ${ALT_TOLERANCE_CP} centipawns of its best move` }
  return { fine: false, why: `the engine rates it ${(best.value - alt.value)} centipawns lower` }
}
