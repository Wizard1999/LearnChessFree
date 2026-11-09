import { Chess } from 'chess.js'
import type { SoundId } from './sound'

/**
 * Which sound a move makes, worked out from the position before it (pure; the board calls it and lib/sound.ts plays it).
 * Check outranks promotion, castling and capture; a plain move is the soft tap. Returns null when the move is not legal in that position,
 * which is how a jump to an unrelated position (browsing a game, loading a new exercise) stays silent.
 */
export function moveSoundFor(fenBefore: string, from: string, to: string, promotion: 'q' | 'r' | 'b' | 'n' = 'q'): SoundId | null {
  try {
    const m = new Chess(fenBefore).move({ from, to, promotion })
    if (/[+#]/.test(m.san)) return 'check'
    if (m.flags.includes('p')) return 'promote'
    if (m.flags.includes('k') || m.flags.includes('q')) return 'castle'
    if (m.flags.includes('c') || m.flags.includes('e')) return 'capture'
    return 'move'
  } catch { return null }
}
