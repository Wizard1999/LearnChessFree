import { useState } from 'react'
import { dismissSaveNotice, SAVE_FAILED_TEXT, useSaveNotice } from '../lib/saveStatus'
import { downloadBackup } from '../lib/backupIO'

/** One calm notice, once per session, when a write to this device's storage has failed. It never claims anything was saved. */
export function SaveNotice() {
  const show = useSaveNotice()
  const [msg, setMsg] = useState<string | null>(null)
  if (!show) return null
  async function exportNow() {
    try { const d = await downloadBackup(); setMsg(`Backup downloaded (${d.attempts.length} answers, ${d.lessonProgress.length} lesson records).`) }
    catch { setMsg('The backup could not be made either. Please keep this tab open, or copy anything you want to keep.') }
  }
  return (
    <div className="savenotice" role="status">
      <p>{SAVE_FAILED_TEXT}</p>
      <div className="row">
        <button type="button" className="primary" onClick={() => void exportNow()}>Export a backup</button>
        <button type="button" onClick={dismissSaveNotice}>Dismiss</button>
      </div>
      {msg && <p className="small">{msg}</p>}
    </div>
  )
}
