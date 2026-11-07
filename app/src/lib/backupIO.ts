// Browser side of backups: download a file, remember when, and import with a safety copy. (Pure parts are in backup.ts.)
import { db, exportAll, importAll, kvGet, kvSet } from '../db'
import { planMerge, type ExportFile, type MergePlan } from './backup'

export const BACKUP_LAST_KEY = 'backup:last'
export const BACKUP_NUDGE_KEY = 'backup:nudged'

export const exportFileName = (now = new Date()) => `chess-school-export-${now.toISOString().slice(0, 10)}.json`
export const toBlob = (data: unknown) => new Blob([JSON.stringify(data, null, 1)], { type: 'application/json' })

export function downloadBlob(blob: Blob, name: string): void {
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob); a.download = name; a.click()
  setTimeout(() => URL.revokeObjectURL(a.href), 1000)
}

/** Export everything as a file and remember the time. Returns the data so the caller can say what was saved. */
export async function downloadBackup() {
  const data = await exportAll()
  downloadBlob(toBlob(data), exportFileName())
  await kvSet(BACKUP_LAST_KEY, Date.now())
  return data
}

export const noteBackupNudge = () => kvSet(BACKUP_NUDGE_KEY, Date.now())
export async function backupTimes() {
  return { lastBackupTs: await kvGet<number | undefined>(BACKUP_LAST_KEY, undefined), lastNudgeTs: await kvGet<number | undefined>(BACKUP_NUDGE_KEY, undefined) }
}

/** Replace everything on this device with the file. The previous data is returned as a blob (taken before anything changes), so it can be offered for download. */
export async function replaceWithSafetyCopy(file: ExportFile): Promise<Blob> {
  const previous = toBlob(await exportAll())
  await importAll(file as unknown as Parameters<typeof importAll>[0])
  return previous
}

/** Add what the file has and this device lacks, in one transaction. Returns the plan applied and the previous data as a blob. */
export async function mergeWithSafetyCopy(file: ExportFile): Promise<{ plan: MergePlan; previous: Blob }> {
  const current = await exportAll()
  const previous = toBlob(current)
  const plan = planMerge(current as unknown as ExportFile, file)
  await db.transaction('rw', [db.attempts, db.reflections, db.lessonProgress, db.games, db.kv, db.feedback], async () => {
    await db.attempts.bulkAdd(plan.attempts.map(a => ({ ...a, id: undefined })))
    await db.reflections.bulkAdd(plan.reflections.map(a => ({ ...a, id: undefined })))
    await db.games.bulkAdd(plan.games.map(a => ({ ...a, id: undefined })))
    await db.feedback.bulkAdd(plan.feedback.map(a => ({ ...a, id: undefined })))
    await db.lessonProgress.bulkPut(plan.lessonProgress)
    await db.kv.bulkPut(plan.kv)
  })
  return { plan, previous }
}
