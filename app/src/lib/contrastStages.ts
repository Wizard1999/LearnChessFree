/**
 * The contrast step as a short sequence with one primary button per stage:
 *   original (the working position and its move, shown first, no question)
 *   -> predict (the single change is named, the original stays on screen, then the question; "I need an example first" is always offered)
 *   -> failing (the changed position, asked) -> irrelevant (asked, only when the lesson has one).
 * Nothing is asked about a position before it has been shown. Pure helpers so the order and the wording are testable.
 */
export type ContrastStage = 'original' | 'predict' | 'failing' | 'irrelevant'
export type ContrastGuess = 'works' | 'fails' | 'unsure'

export const GUESS_LABEL: Record<ContrastGuess, string> = {
  works: 'It still works',
  fails: 'It breaks',
  unsure: 'Not sure yet',
}

export function contrastStages(hasIrrelevant: boolean): ContrastStage[] {
  return hasIrrelevant ? ['original', 'predict', 'failing', 'irrelevant'] : ['original', 'predict', 'failing']
}

/** The stage after `stage`, or null when the step is finished. */
export function nextContrastStage(stage: ContrastStage, hasIrrelevant: boolean): ContrastStage | null {
  const all = contrastStages(hasIrrelevant)
  const i = all.indexOf(stage)
  return i >= 0 && i + 1 < all.length ? all[i + 1] : null
}

export function contrastStageLabel(stage: ContrastStage): string {
  switch (stage) {
    case 'original': return 'Where it works'
    case 'predict': return 'One change'
    case 'failing': return 'The changed position'
    case 'irrelevant': return 'A change that should not matter'
  }
}

/** Calm line after the prediction, shown with the changed position. */
export function guessEcho(guess: ContrastGuess | null): string {
  if (guess === 'works') return 'You expected the idea to survive the change. See whether it does.'
  if (guess === 'fails') return 'You expected the change to break it. See whether it does.'
  return 'No guess is fine. See what the change does.'
}

const NAME: Record<string, string> = { p: 'pawn', n: 'knight', b: 'bishop', r: 'rook', q: 'queen', k: 'king' }
const FILES = 'abcdefgh'

function placement(fen: string): Map<string, string> {
  const m = new Map<string, string>()
  const rows = fen.split(' ')[0].split('/')
  rows.forEach((row, r) => {
    let f = 0
    for (const ch of row) {
      if (/[1-8]/.test(ch)) f += Number(ch)
      else { m.set(`${FILES[f]}${8 - r}`, ch); f++ }
    }
  })
  return m
}
const desc = (ch: string) => `${ch === ch.toUpperCase() ? 'white' : 'black'} ${NAME[ch.toLowerCase()] ?? 'piece'}`

/** The single change between two positions, in words, read from the two FENs (nothing typed by hand). Null when placement and turn are identical. */
export function describeChange(fromFen: string, toFen: string): string | null {
  const a = placement(fromFen), b = placement(toFen)
  const squares = [...new Set([...a.keys(), ...b.keys()])].filter(s => a.get(s) !== b.get(s)).sort()
  const gone = squares.filter(s => a.has(s) && !b.has(s))
  const came = squares.filter(s => b.has(s) && !a.has(s))
  const swapped = squares.filter(s => a.has(s) && b.has(s))
  if (squares.length === 0) {
    const ta = fromFen.split(' ')[1], tb = toFen.split(' ')[1]
    return ta !== tb ? 'The pieces stand where they did; the only change is whose turn it is.' : null
  }
  if (gone.length === 1 && came.length === 1 && swapped.length === 0 && a.get(gone[0]) === b.get(came[0])) return `The ${desc(a.get(gone[0])!)} moves from ${gone[0]} to ${came[0]}.`
  if (gone.length === 1 && came.length === 0 && swapped.length === 0) return `The ${desc(a.get(gone[0])!)} on ${gone[0]} is taken off the board.`
  if (came.length === 1 && gone.length === 0 && swapped.length === 0) return `A ${desc(b.get(came[0])!)} is added on ${came[0]}.`
  if (swapped.length === 1 && gone.length === 0 && came.length === 0) return `The ${desc(a.get(swapped[0])!)} on ${swapped[0]} is replaced by a ${desc(b.get(swapped[0])!)}.`
  if (squares.length <= 6) return `A few pieces differ, on ${squares.join(', ')}.`
  return `The position differs on ${squares.length} squares.`
}

/** Whether a prompt talks about a particular square or an altered piece ("the king now stands on d8"), which only makes sense once the original is on screen. */
export function promptRefersToChange(prompt: string | undefined): boolean {
  return !!prompt && (/\b[a-h][1-8]\b/.test(prompt) || /\b(now|instead|moved|moves|replaced|removed|added|changed)\b/i.test(prompt))
}
