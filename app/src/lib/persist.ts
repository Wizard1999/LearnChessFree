// Progress is saved to this browser (IndexedDB) as the learner works, with no account. Two things make that dependable:
// 1. ask the browser to keep the data (navigator.storage.persist), but only after the learner has invested a few answers, never on
//    arrival, because some browsers show a permission prompt for it;
// 2. tell the learner plainly where progress lives. A private window deletes it on close (modern browsers still allow the writes, so this
//    cannot be detected: the start screen and Settings say it in words); where storage will not open at all, say so.
import { useEffect, useState } from 'react'
import { db } from '../db'

const ASK_AFTER_ATTEMPTS = 8
let asked = false

export async function requestPersistence(): Promise<boolean> {
  try { return !!(await navigator.storage?.persist?.()) } catch { return false }
}

async function maybeRequest() {
  if (asked) return
  try {
    if (await navigator.storage?.persisted?.()) { asked = true; return }
    if ((await db.attempts.count()) < ASK_AFTER_ATTEMPTS) return
    asked = true
    await requestPersistence()
  } catch { /* storage unavailable: nothing to protect */ }
}

/** Call once at start-up. */
export function watchPersistence() {
  try { db.attempts.hook('creating', function () { this.onsuccess = () => { void maybeRequest() } }) } catch { /* no storage */ }
}

export interface StorageStatus { works: boolean; persisted: boolean | null }

export async function storageStatus(): Promise<StorageStatus> {
  let works = true
  try { await db.kv.get('probe') } catch { works = false }
  let persisted: boolean | null = null
  try { persisted = (await navigator.storage?.persisted?.()) ?? null } catch { /* unsupported */ }
  return { works, persisted }
}

export function useStorageStatus(): StorageStatus | undefined {
  const [s, setS] = useState<StorageStatus>()
  useEffect(() => { void storageStatus().then(setS) }, [])
  return s
}
