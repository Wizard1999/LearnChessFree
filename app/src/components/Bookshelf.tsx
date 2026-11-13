import { useEffect, useMemo, useRef, useState } from 'react'

interface Book {
  id: string; title: string; author: string; year: number | null; language: string; source_url: string; file: string | null; size: number
  cover?: string; coverBlank?: boolean; rights: { label: string; basis: string; checked: string }; subjects: string[]; level: string; blurb: string
}
type Sort = 'title' | 'author' | 'year' | 'level' | 'subject' | 'size'
const LEVELS = ['Beginner', 'Improver', 'Club', 'Advanced', 'Reference']
const PAGE = 5000

/** A stable cover colour from the subject, shifted a little per book so neighbours differ. */
const SUBJECT_HUE: Record<string, number> = { 'rules and basics': 205, tactics: 12, strategy: 150, endgames: 270, openings: 35, history: 330, 'game collections': 190, 'endgame studies': 280, 'tactics and defence': 20, 'problem composition': 100, mates: 350 }
const hueOf = (b: Book) => { const base = SUBJECT_HUE[b.subjects[0]] ?? 220; let h = 0; for (const ch of b.id) h = (h * 31 + ch.charCodeAt(0)) % 28; return (base + h - 14 + 360) % 360 }

const base = () => `${import.meta.env.BASE_URL}library/`

/** The texts we may share, each with how we know. Subjects and levels are our labels about how a book reads, not claims about its author. */
/** The cover shows a short title (the part before the first colon, semicolon or comma, at most seven words); the full title stays in the details card. */
function coverTitle(title: string): string {
  const head = title.split(/\s*[:;,]\s*|\s+and\s+(?=[A-Z])/)[0].trim() || title
  const w = head.split(/\s+/)
  return w.length > 7 ? `${w.slice(0, 6).join(' ')}…` : head
}

export function Bookshelf() {
  const [books, setBooks] = useState<Book[] | null>(null)
  const [failed, setFailed] = useState(false)
  const [sort, setSort] = useState<Sort>('title')
  const [subject, setSubject] = useState('')
  const [level, setLevel] = useState('')
  const [q, setQ] = useState('')
  const [open, setOpen] = useState<Book | null>(null)
  const [pinned, setPinned] = useState<string | null>(null)
  const [hover, setHover] = useState<{ id: string; flip: boolean } | null>(null)
  const timer = useRef<number | undefined>(undefined)
  const enter = (id: string, el: HTMLElement) => { window.clearTimeout(timer.current); setHover({ id, flip: el.getBoundingClientRect().right + 340 > window.innerWidth }) }
  const leave = () => { window.clearTimeout(timer.current); timer.current = window.setTimeout(() => setHover(null), 200) }

  useEffect(() => { fetch(`${base()}catalog.json`).then(r => (r.ok ? r.json() : Promise.reject(r.status))).then(d => setBooks(d.books as Book[])).catch(() => setFailed(true)) }, [])
  const subjects = useMemo(() => [...new Set((books ?? []).flatMap(b => b.subjects))].sort(), [books])
  const shown = useMemo(() => {
    const t = q.trim().toLowerCase()
    const rank = (l: string) => LEVELS.indexOf(l)
    return (books ?? [])
      .filter(b => (!subject || b.subjects.includes(subject)) && (!level || b.level === level) && (!t || `${b.title} ${b.author} ${b.subjects.join(' ')} ${b.blurb}`.toLowerCase().includes(t)))
      .sort((a, b) => sort === 'title' ? a.title.localeCompare(b.title) : sort === 'author' ? a.author.localeCompare(b.author) : sort === 'year' ? (a.year ?? 9999) - (b.year ?? 9999) : sort === 'level' ? rank(a.level) - rank(b.level) || a.title.localeCompare(b.title) : sort === 'subject' ? (a.subjects[0] ?? '').localeCompare(b.subjects[0] ?? '') || a.title.localeCompare(b.title) : a.size - b.size)
  }, [books, sort, subject, level, q])

  if (open) return <Reader book={open} onClose={() => setOpen(null)} />
  return (
    <section className="card" aria-label="Books and texts">
      <h2>Books and texts you can read here</h2>
      <p className="small muted">Texts we are allowed to share, because their own notices and dates show they are in the public domain. Each card says how we know. In-copyright books are never stored here.</p>
      {failed && <p className="muted" role="status">The book list could not be loaded.</p>}
      {books && (
        <>
          <div className="bookfilters">
            <input type="search" value={q} onChange={e => setQ(e.target.value)} placeholder="Search books" aria-label="Search books" />
            <label className="small">Sort <select value={sort} onChange={e => setSort(e.target.value as Sort)}><option value="title">Title A to Z</option><option value="author">Author A to Z</option><option value="year">Year</option><option value="level">Level (Beginner first)</option><option value="subject">Subject</option><option value="size">Length</option></select></label>
            <label className="small">Subject <select value={subject} onChange={e => setSubject(e.target.value)}><option value="">All</option>{subjects.map(s => <option key={s} value={s}>{s}</option>)}</select></label>
            <label className="small">Level <select value={level} onChange={e => setLevel(e.target.value)}><option value="">All</option>{LEVELS.map(l => <option key={l} value={l}>{l}</option>)}</select></label>
          </div>
          {shown.length === 0 && <p className="muted">No books match.</p>}
          <ul className="plain coverwall">
            {shown.map(b => {
              const open = pinned === b.id || hover?.id === b.id
              const flip = hover?.id === b.id ? hover.flip : false
              const hue = hueOf(b)
              return (
                <li key={b.id} className={`cover${open ? ' open' : ''}${flip ? ' flip' : ''}${pinned === b.id ? ' pinned' : ''}`} style={{ ['--h' as string]: hue }} onMouseEnter={e => enter(b.id, e.currentTarget)} onMouseLeave={leave} onFocus={e => enter(b.id, e.currentTarget)}>
                  <button type="button" className={`coverface${b.cover ? ' haspic' : ''}${b.cover && b.coverBlank ? ' blank' : ''}`} aria-expanded={open} aria-label={`${b.title}, ${b.author}. Show details`} onClick={() => setPinned(pinned === b.id ? null : b.id)}>
                    {b.cover && <img className="coverpic" src={`${base()}${b.cover}`} alt="" loading="lazy" decoding="async" />}
                    <span className="coverlevel">{b.level}</span>
                    <span className="covertitle">{coverTitle(b.title)}</span>
                    <span className="coverrule" aria-hidden="true" />
                    <span className="coverauthor">{b.author.replace(/,.*$/, '')}</span>
                    <span className="coveryear">{b.year ?? ''}</span>
                  </button>
                  <div className="coverinfo" role="group" aria-label={`About ${b.title}`}>
                    <strong>{b.title}</strong>
                    <p className="small muted">{b.author}{b.year ? ` · ${b.year}` : ''} · {Math.round(b.size / 1024)} KB</p>
                    <p className="small">{b.blurb}</p>
                    <p className="small"><strong>{b.level}</strong> · {b.subjects.join(', ')}</p>
                    <p className="small"><span className="badge" title={b.rights.basis}>{b.rights.label}</span></p>
                    {pinned === b.id ? (
                      <>
                    <div className="row">
                          {b.file ? <><button type="button" className="primary" onClick={() => setOpen(b)}>Read</button><a className="button" href={`${base()}${b.file}`} download={`${b.id}.txt`}>Download</a></> : <span className="small muted">Large file: read it at the source.</span>}
                          <a className="button" href={b.source_url} target="_blank" rel="noreferrer">Source</a>
                        </div>
                        <details className="small"><summary>How we know it is free to share</summary>{b.rights.basis} (checked {b.rights.checked})</details>
                      </>
                    ) : <p className="small muted">Click the cover for Read, Download and the rights details.</p>}
                  </div>
                </li>
              )
            })}
          </ul>
        </>
      )}
    </section>
  )
}

/** The scans keep the printed line breaks, which leaves a narrow column; prose blocks are rejoined so the words fill the width, and drawings (diagrams, tables) stay as printed. */
function blocks(page: string): { prose: boolean; text: string }[] {
  return page.split(/\n{2,}/).filter(b => b.trim()).map(b => {
    const lines = b.split('\n')
    const lens = lines.map(l => l.trim().length).sort((x, y) => x - y)
    const drawing = /[|_+=]{2,}|\s{4,}\S/.test(b) || (lines.length > 1 && lens[Math.floor(lens.length / 2)] < 30)
    if (drawing || lines.length < 2) return { prose: !drawing, text: drawing ? b : b.trim() }
    return { prose: true, text: lines.map(l => l.trim()).join('\n').replace(/([a-z])-\n([a-z])/g, '$1$2').replace(/\n/g, ' ') }
  })
}

function Reader({ book, onClose }: { book: Book; onClose: () => void }) {
  const [text, setText] = useState<string | null>(null)
  const [page, setPage] = useState(() => { try { return +(localStorage.getItem(`book:${book.id}`) ?? 0) || 0 } catch { return 0 } })
  const [find, setFind] = useState('')
  const [wantScan, setWantScan] = useState(true)
  const [scanPages, setScanPages] = useState<number | null>(null)   // null = still checking, 0 = this book has no page images on disk
  const [scanPage, setScanPage] = useState(() => { try { return +(localStorage.getItem(`scan:${book.id}`) ?? 0) || 0 } catch { return 0 } })
  useEffect(() => {
    let live = true
    fetch(`${base()}scans/${book.id}/index.json`).then(r => (r.ok ? r.json() : null)).then(j => { if (live) setScanPages(j?.pages > 0 ? j.pages : 0) }).catch(() => { if (live) setScanPages(0) })
    return () => { live = false }
  }, [book.id])
  const showScan = wantScan && scanPages !== null && scanPages > 0
  const goScan = (p: number) => { const n = Math.max(0, Math.min((scanPages ?? 1) - 1, p)); setScanPage(n); try { localStorage.setItem(`scan:${book.id}`, String(n)) } catch { /* optional */ } }
  useEffect(() => {
    fetch(`${base()}${book.file}`).then(r => r.text()).then(t0 => {
      const t = t0.replace(/\r\n?/g, '\n')
      const m1 = t.match(/\*\*\* ?START OF[^\n]*\n/), m2 = t.indexOf('*** END OF')
      setText(m1 ? t.slice((m1.index ?? 0) + m1[0].length, m2 > 0 ? m2 : undefined) : t)
    }).catch(() => setText(''))
  }, [book])
  const pages = useMemo(() => {
    if (!text) return []
    const out: string[] = []; let i = 0
    while (i < text.length) { let j = Math.min(text.length, i + PAGE); if (j < text.length) { const k = text.lastIndexOf('\n\n', j); if (k > i + PAGE / 2) j = k } out.push(text.slice(i, j)); i = j }
    return out
  }, [text])
  const go = (p: number) => { const n = Math.max(0, Math.min(pages.length - 1, p)); setPage(n); try { localStorage.setItem(`book:${book.id}`, String(n)) } catch { /* optional */ } window.scrollTo({ top: 0 }) }
  const hits = useMemo(() => { const t = find.trim().toLowerCase(); return t.length < 3 ? [] : pages.flatMap((p, i) => (p.toLowerCase().includes(t) ? [i] : [])) }, [find, pages])
  return (
    <section className="card reader" aria-label={`Reading ${book.title}`}>
      <div className="sectionhead"><h2>{book.title}</h2><button type="button" onClick={onClose}>Back to the shelf</button></div>
      <p className="small muted">{book.author}{book.year ? ` · ${book.year}` : ''} · {book.rights.label}. Diagrams in these texts are plain-text drawings.</p>
      {(scanPages ?? 0) > 0 && <div className="row filters" role="group" aria-label="What to show">
        <button type="button" className={showScan ? 'primary' : ''} aria-pressed={showScan} onClick={() => setWantScan(true)}>Original scan</button>
        <button type="button" className={!showScan ? 'primary' : ''} aria-pressed={!showScan} onClick={() => setWantScan(false)}>Text</button>
        <a href={book.source_url} target="_blank" rel="noreferrer" className="small">Where this came from</a>
      </div>}
      {showScan
        ? <div className="scanview" tabIndex={0} ref={el => { if (el && !el.dataset.seen) { el.dataset.seen = '1'; el.scrollIntoView({ block: 'start' }) } }} onKeyDown={e => { if (e.key === 'ArrowRight') goScan(scanPage + 1); if (e.key === 'ArrowLeft') goScan(scanPage - 1) }}>
            <div className="row filters">
              <button type="button" onClick={() => goScan(scanPage - 1)} disabled={scanPage === 0}>◀ Previous</button>
              <label className="small">Page <input type="number" min={1} max={scanPages ?? 1} value={scanPage + 1} onChange={e => goScan((+e.target.value || 1) - 1)} aria-label="Page number" style={{ width: '5rem' }} /> of {scanPages}</label>
              <button type="button" onClick={() => goScan(scanPage + 1)} disabled={scanPage >= (scanPages ?? 1) - 1}>Next ▶</button>
              <span className="small muted">Arrow keys turn the page, or click the right or left half of it. Photographs of the printed pages, stored with the app, so they work with no connection.</span>
            </div>
            <img className="scanpage" src={`${base()}scans/${book.id}/${scanPage}.webp`} alt={`Scanned page ${scanPage + 1} of ${book.title}`} style={{ cursor: 'pointer' }} title="Click the right half for the next page, the left half for the previous" onClick={e => { const r = e.currentTarget.getBoundingClientRect(); goScan(scanPage + (e.clientX - r.left > r.width / 2 ? 1 : -1)) }} />
          </div>
        : text === null ? <p className="muted">Loading…</p> : (
        <>
          <div className="row filters">
            <button type="button" onClick={() => go(page - 1)} disabled={page === 0}>◀ Previous</button>
            <span className="small">Page {page + 1} of {pages.length}</span>
            <button type="button" onClick={() => go(page + 1)} disabled={page >= pages.length - 1}>Next ▶</button>
            <input type="search" value={find} onChange={e => setFind(e.target.value)} placeholder="Find in this book" aria-label="Find in this book" />
            {find.trim().length >= 3 && <span className="small muted">{hits.length} page{hits.length === 1 ? '' : 's'}: {hits.slice(0, 8).map(h => <button key={h} type="button" className="link" onClick={() => go(h)}>{h + 1}</button>)}{hits.length > 8 ? ' …' : ''}</span>}
          </div>
          <div className="booktext">{blocks(pages[page] ?? '').map((b, i) => (b.prose ? <p key={i}>{b.text}</p> : <pre key={i} className="bookdiagram">{b.text}</pre>))}</div>
          <div className="row"><button type="button" onClick={() => go(page - 1)} disabled={page === 0}>◀ Previous</button><button type="button" onClick={() => go(page + 1)} disabled={page >= pages.length - 1}>Next ▶</button></div>
        </>
      )}
    </section>
  )
}
