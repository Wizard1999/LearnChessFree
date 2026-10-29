// Human review and feedback (docs/feedback.md). Everything is stored on the reviewer's device first; nothing leaves it unless the
// reviewer downloads the file or presses Send (only possible when the site's feedback-config.json names an endpoint).
import { db, kvGet, kvSet, type Feedback } from '../db'

export interface Reviewer { name: string; role: 'strong-player' | 'teacher' | 'learner' | 'other' | '' }
export const loadReviewer = () => kvGet<Reviewer>('reviewer', { name: '', role: '' })
export const saveReviewer = (r: Reviewer) => kvSet('reviewer', r)

export async function addFeedback(f: Omit<Feedback, 'id' | 'ts' | 'build'>, build: string) {
  await db.feedback.add({ ...f, ts: Date.now(), build })
}

export interface ReviewFile { format: 'chess-school-review'; version: 1; exportedAt: string; build: string; reviewer: Reviewer; items: Feedback[] }

export async function reviewFile(build: string): Promise<ReviewFile> {
  return { format: 'chess-school-review', version: 1, exportedAt: new Date().toISOString(), build, reviewer: await loadReviewer(), items: await db.feedback.toArray() }
}

export async function feedbackEndpoint(): Promise<string> {
  try { const r = await fetch(`${import.meta.env.BASE_URL}feedback-config.json`, { cache: 'no-store' }); if (!r.ok) return ''; return String((await r.json()).endpoint ?? '') } catch { return '' }
}

/** Posts the review file to the configured endpoint. Returns an error message, or null on success. */
export async function sendReviews(build: string): Promise<string | null> {
  const url = await feedbackEndpoint()
  if (!url) return 'This copy has no feedback address set. Download the file and send it instead.'
  try {
    const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(await reviewFile(build)) })
    return r.ok ? null : `The server answered ${r.status}.`
  } catch (e) { return `Could not reach the feedback address (${(e as Error).message}). Download the file and send it instead.` }
}
