import { useEffect, useMemo, useState } from 'react'

interface Book {
  id: string; title: string; author: string; year: number | null; language: string; source_url: string; file: string | null; size: number
  rights: { label: string; basis: string; checked: string }; subjects: string[]; level: string; blurb: string
}
type Sort = 'title' | 'author' | 'year' | 'level' | 'size'
const LEVELS = ['Beginner', 'Improver', 'Club', 'Advanced', 'Reference']
const PAGE = 5000

const base = () => `${import.meta.env.BASE_URL}library/`

/** The texts we may share, each with how we know. Subjects and levels are our labels about how a book reads, not claims about its author. */
export function Bookshelf() {
  const [books, setBooks] = useState<Book[] | null>(null)
  const [failed, setFailed] = useState(false)
  const [sort, setSort] = useState<Sort>('title')
  const [subject, setSubject] = useState('')
  const [level, setLevel] = useState('')
  const [q, setQ] = useState('')
  const [open, setOpen] = useState<Book | null>(null)

  useEffect(() => { fetch(`${base()}catalog.json`).then(r => (r.ok ? r.json() : Promise.reject(r.status))).then(d => setBooks(d.books as Book[])).catch(() => setFailed(true)) }, [])
  const subjects = useMemo(() => [...new Set((books ?? []).flatMap(b => b.subjects))].sort(), [books])
  const shown = useMemo(() => {
    const t = q.trim().toLowerCase()
    const rank = (l: string) => LEVELS.indexOf(l)
    return (books ?? [])
      .filter(b => (!subject || b.subjects.includes(subject)) && (!level || b.level === level) && (!t || `${b.title} ${b.author} ${b.subjects.join(' ')} ${b.blurb}`.toLowerCase().includes(t)))
      .sort((a, b) => sort === 'title' ? a.title.localeCompare(b.title) : sort === 'author' ? a.author.localeCompare(b.author) : sort === 'year' ? (a.year ?? 9999) - (b.year ?? 9999) : sort === 'level' ? rank(a.level) - rank(b.level) : a.size - b.size)
  }, [books, sort, subject, level, q])

  if (open) return <Reader book={open} onClose={() => setOpen(null)} />
  return (
    <section className="card" aria-label="Books and texts">
      <h2>Books and texts you can read here</h2>
      <p className="small muted">Texts we are allowed to share, because their own notices and dates show they are in the public domain. Each card says how we know. In-copyright books are never stored here.</p>
      {failed && <p className="muted" role="status">The book list could not be loaded.</p>}
      {books && (
        <>
          <div className="row filters">
            <input type="search" value={q} onChange={e => setQ(e.target.value)} placeholder="Search books" aria-label="Search books" />
            <label className="small">Sort <select value={sort} onChange={e => setSort(e.target.value as Sort)}><option value="title">Title A to Z</option><option value="author">Author A to Z</option><option value="year">Year</option><option value="level">Level</option><option value="size">Length</option></select></label>
            <label className="small">Subject <select value={subject} onChange={e => setSubject(e.target.value)}><option value="">All</option>{subjects.map(s => <option key={s} value={s}>{s}</option>)}</select></label>
            <label className="small">Level <select value={level} onChange={e => setLevel(e.target.value)}><option value="">All</option>{LEVELS.map(l => <option key={l} value={l}>{l}</option>)}</select></label>
          </div>
          {shown.length === 0 && <p className="muted">No books match.</p>}
          <ul className="plain bookshelf">
            {shown.map(b => (
              <li key={b.id} className="bookcard">
                <div className="sectionhead"><strong>{b.title}</strong><span className="muted small">{b.level}</span></div>
                <p className="small muted">{b.author}{b.year ? ` · ${b.year}` : ''} · {Math.round(b.size / 1024)} KB · {b.subjects.join(', ')}</p>
                <p className="small">{b.blurb}</p>
                <p className="small muted"><span className="badge">{b.rights.label}</span> {b.rights.basis} (checked {b.rights.checked})</p>
                <div className="row">
                  {b.file ? <><button type="button" className="primary" onClick={() => setOpen(b)}>Read</button>
                  <a className="button" href={`${base()}${b.file}`} download={`${b.id}.txt`}>Download</a></> : <span className="small muted">Large file ({Math.round(b.size / 1048576)} MB): read or download it at the source.</span>}
                  <a className="button" href={b.source_url} target="_blank" rel="noreferrer">Original source</a>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  )
}

function Reader({ book, onClose }: { book: Book; onClose: () => void }) {
  const [text, setText] = useState<string | null>(null)
  const [page, setPage] = useState(() => { try { return +(localStorage.getItem(`book:${book.id}`) ?? 0) || 0 } catch { return 0 } })
  const [find, setFind] = useState('')
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
      {text === null ? <p className="muted">Loading…</p> : (
        <>
          <div className="row filters">
            <button type="button" onClick={() => go(page - 1)} disabled={page === 0}>◀ Previous</button>
            <span className="small">Page {page + 1} of {pages.length}</span>
            <button type="button" onClick={() => go(page + 1)} disabled={page >= pages.length - 1}>Next ▶</button>
            <input type="search" value={find} onChange={e => setFind(e.target.value)} placeholder="Find in this book" aria-label="Find in this book" />
            {find.trim().length >= 3 && <span className="small muted">{hits.length} page{hits.length === 1 ? '' : 's'}: {hits.slice(0, 8).map(h => <button key={h} type="button" className="link" onClick={() => go(h)}>{h + 1}</button>)}{hits.length > 8 ? ' …' : ''}</span>}
          </div>
          <pre className="booktext">{pages[page]}</pre>
          <div className="row"><button type="button" onClick={() => go(page - 1)} disabled={page === 0}>◀ Previous</button><button type="button" onClick={() => go(page + 1)} disabled={page >= pages.length - 1}>Next ▶</button></div>
        </>
      )}
    </section>
  )
}
