// Turns lesson text into text a speech synthesiser reads sensibly. Pure functions only (the browser part is in readAloud.ts).
// Chess notation is expanded ("Nxe5+" -> "knight takes e 5 check"); square names are read letter by letter ("e 4").

const PIECE: Record<string, string> = { K: 'king', Q: 'queen', R: 'rook', B: 'bishop', N: 'knight' }

/** Remove the markup the lesson text uses: **bold**, *italic*, `code`. */
export function stripMarkers(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*\s][^*]*)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
}

const sq = (s: string) => `${s[0]} ${s.slice(1)}`
const suffix = (promo: string | undefined, mark: string | undefined) =>
  (promo ? ` promotes to ${PIECE[promo.slice(1)]}` : '') + (mark === '+' ? ' check' : mark === '#' ? ' checkmate' : '')

// castling | piece move (optional disambiguation) | pawn capture | plain square, then optional promotion and check/mate.
// Not inside a word, so "Be careful" or "bed4" are left alone.
const MOVE = /(?<![A-Za-z0-9])(?:(O-O-O|O-O|0-0-0|0-0)|([KQRBN])([a-h]?[1-8]?)(x?)([a-h][1-8])|([a-h])(x)([a-h][1-8])|([a-h][1-8]))(=[QRBN])?([+#])?(?![A-Za-z0-9])/g

/** Expand every chess move or square in running text into words. */
export function expandNotation(text: string): string {
  return text.replace(MOVE, (_m, castle, piece, dis, cap1, dest1, pfile, _x, dest2, square, promo, mark) => {
    let core: string
    if (castle) core = castle.length > 3 ? 'castles queenside' : 'castles kingside'
    else if (piece) core = [PIECE[piece], dis ? dis.split('').join(' ') : '', cap1 ? 'takes' : '', sq(dest1)].filter(Boolean).join(' ')
    else if (pfile) core = `${pfile} takes ${sq(dest2)}`
    else core = sq(square)
    return core + suffix(promo, mark)
  })
}

/** Lesson text as it should be spoken. */
export function speakable(text: string): string {
  return expandNotation(stripMarkers(text))
    .replace(/\s*\n+\s*/g, '. ')
    .replace(/\.\s*\./g, '.')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

/** Short pieces (about one or two sentences) so browsers that cut off long utterances keep going. */
export function chunkForSpeech(text: string, max = 220): string[] {
  const sentences = text.split(/(?<=[.!?])\s+/).filter(s => s.trim())
  const out: string[] = []
  let cur = ''
  for (const s of sentences) {
    if (cur && cur.length + s.length + 1 > max) { out.push(cur); cur = s } else cur = cur ? `${cur} ${s}` : s
  }
  if (cur) out.push(cur)
  return out
}
