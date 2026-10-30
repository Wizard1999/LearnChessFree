import { useEffect, useState } from 'react'

/** "Build 4f3a2c · 29 Oct 2026 · 208 lessons · 7,108 exercises": the one line that identifies exactly which build someone is looking at (it is also what feedback reports carry). */
export function BuildStamp() {
  const [text, setText] = useState('')
  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}content/manifest.json`, { cache: 'no-cache' })
      .then(r => (r.ok ? r.json() : null))
      .then(m => { if (m) setText(`Build ${String(m.hash).slice(0, 6)} · ${new Date(m.built).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })} · ${m.lessons} lessons · ${Number(m.items).toLocaleString()} exercises`) })
      .catch(() => undefined)
  }, [])
  return text ? <span className="buildstamp"> {text}</span> : null
}
