// Honest saving: a write that fails must never look like a success. Every learner-facing write goes through `safeWrite`, which reports
// the first failure of the session to a small store the page shows as one calm notice (see components/SaveNotice.tsx).
import { useSyncExternalStore } from 'react'

export const SAVE_FAILED_TEXT = 'Your latest work could not be saved on this device. You can keep going; export a backup in Settings.'

interface State { failed: boolean; dismissed: boolean }
let state: State = { failed: false, dismissed: false }
const listeners = new Set<() => void>()
const emit = () => listeners.forEach(l => l())

/** Record that a write failed. The notice appears once per session: after it was dismissed it does not come back. */
export function reportSaveFailure(): void {
  if (state.failed) return
  state = { ...state, failed: true }
  emit()
}
export function dismissSaveNotice(): void { state = { failed: false, dismissed: true }; emit() }
/** True while the notice should be showing. */
export const saveNoticeVisible = (s: State = state) => s.failed && !s.dismissed
export function resetSaveStatusForTests(): void { state = { failed: false, dismissed: false }; emit() }
export function saveStatus(): State { return state }

export function useSaveNotice(): boolean {
  return useSyncExternalStore(cb => { listeners.add(cb); return () => { listeners.delete(cb) } }, () => saveNoticeVisible(state), () => false)
}

/** Run a write. Resolves true when it succeeded and false (after reporting) when it failed; it never throws. */
export async function safeWrite(write: () => PromiseLike<unknown>): Promise<boolean> {
  try { await write(); return true } catch { reportSaveFailure(); return false }
}
