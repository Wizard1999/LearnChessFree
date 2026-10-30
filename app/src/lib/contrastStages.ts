/**
 * The contrast step as a short sequence with one primary button per stage:
 * predict -> working (result shown) -> failing (asked) -> irrelevant (asked, only when the lesson has one).
 * Pure helpers so the order and the graceful degradation are testable.
 */
export type ContrastStage = 'predict' | 'working' | 'failing' | 'irrelevant'
export type ContrastGuess = 'works' | 'fails' | 'unsure'

export const GUESS_LABEL: Record<ContrastGuess, string> = {
  works: 'It still works',
  fails: 'It breaks',
  unsure: 'Not sure yet',
}

export function contrastStages(hasIrrelevant: boolean): ContrastStage[] {
  return hasIrrelevant ? ['predict', 'working', 'failing', 'irrelevant'] : ['predict', 'working', 'failing']
}

/** The stage after `stage`, or null when the step is finished. */
export function nextContrastStage(stage: ContrastStage, hasIrrelevant: boolean): ContrastStage | null {
  const all = contrastStages(hasIrrelevant)
  const i = all.indexOf(stage)
  return i >= 0 && i + 1 < all.length ? all[i + 1] : null
}

export function contrastStageLabel(stage: ContrastStage): string {
  switch (stage) {
    case 'predict': return 'Predict'
    case 'working': return 'Where it works'
    case 'failing': return 'One change'
    case 'irrelevant': return 'A change that should not matter'
  }
}

/** Calm line after the prediction, shown with the working position. */
export function guessEcho(guess: ContrastGuess | null): string {
  if (guess === 'works') return 'You expected the idea to survive the change. Look at the working position first, then see.'
  if (guess === 'fails') return 'You expected the change to break it. Look at the working position first, then see.'
  return 'No guess is fine. Look at the working position first.'
}
