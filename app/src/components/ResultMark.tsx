// The three outcomes of an answer (Attempt.result) each get one stable treatment: a shape, a tick or cross, a word and a colour. The shape and the
// word carry the meaning; colour is only a reinforcement (jade and persimmon are close in brightness for red-green colour blindness).
//   correct            jade circle with a tick        "Correct"
//   sound-alternative  jade diamond with a tick       "Sound alternative"
//   unsuccessful       ink square with a cross        "Unsuccessful"  (neutral, never alarming red)
import type { ResultKind } from '../lib/resultText'

export const RESULT_MARK_WORD: Record<ResultKind, string> = { correct: 'Correct', 'sound-alternative': 'Sound alternative', unsuccessful: 'Unsuccessful' }

/** The icon alone, decorative: the text beside it says what it means. */
export function ResultIcon({ kind }: { kind: ResultKind }) {
  return (
    <svg className="resulticon" viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" focusable="false">
      {kind === 'correct' && <circle cx="10" cy="10" r="9" className="shape" />}
      {kind === 'sound-alternative' && <path d="M10 1 19 10 10 19 1 10Z" className="shape" />}
      {kind === 'unsuccessful' && <rect x="1.5" y="1.5" width="17" height="17" rx="2" className="shape" />}
      {kind === 'unsuccessful' ? <path d="M6.5 6.5 13.5 13.5M13.5 6.5 6.5 13.5" className="glyph" /> : <path d="M5.5 10.5 8.8 13.8 14.5 6.8" className="glyph" />}
    </svg>
  )
}

export function ResultMark({ kind, count, className }: { kind: ResultKind; count?: number; className?: string }) {
  return (
    <span className={`resultmark resultmark-${kind}${className ? ` ${className}` : ''}`}>
      <ResultIcon kind={kind} />
      <span>{RESULT_MARK_WORD[kind]}{count !== undefined && <>: <strong>{count}</strong></>}</span>
    </span>
  )
}
