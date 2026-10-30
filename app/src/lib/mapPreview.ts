// Pure helpers for the small 'where you are' map preview on the Today page (components/MapPreview.tsx).

export interface PreviewNode { id: string; strand: string; level: number }

/** The strand that describes where the learner is: the next skill's strand, else the strand with the most started skills, else none. */
export function currentStrand(nodes: PreviewNode[], nextId: string | null): string | null {
  const next = nextId ? nodes.find(n => n.id === nextId) : undefined
  if (next) return next.strand
  const count = new Map<string, number>()
  for (const n of nodes) if (n.level > 0) count.set(n.strand, (count.get(n.strand) ?? 0) + 1)
  let best: string | null = null, top = 0
  for (const [s, c] of count) if (c > top) { best = s; top = c }
  return best
}

/** The text alternative: 'You are in Tactics, 12 of 205 skills started; your next skill is Forks.' */
export function previewText(opts: { strandName: string | null; started: number; total: number; nextTitle: string | null }): string {
  const { strandName, started, total, nextTitle } = opts
  const where = strandName ? `You are in ${strandName}, ` : 'You are at the start, '
  const count = `${started} of ${total} skills started`
  const tail = nextTitle ? `; your next skill is ${nextTitle}.` : '.'
  return `${where}${count}${tail}`
}
