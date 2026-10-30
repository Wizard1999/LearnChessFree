/** 'theme.back-rank' -> 'Back rank'. Raw ids are never shown to a learner. */
export function tidyLabel(raw: string): string {
  const s = raw.replace(/^(theme|kind)\./, '').replace(/[._-]+/g, ' ').trim().toLowerCase()
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : raw
}
/** Option text for a skill key such as 'END.KPK.D2': the skill title plus its depth, falling back to a tidied key. */
export function skillLabel(key: string, title?: string): string {
  const depth = /\.D(\d)$/.exec(key)
  return title ? `${title}${depth ? ` (level ${depth[1]})` : ''}` : tidyLabel(key)
}

/** One plain sentence about hint use; never prints a dash where a number should be. */
export function independenceSentence(counted: number, hintRate: number | null, accuracy: number | null): string {
  const pct = (x: number) => `${Math.round(x * 100)}%`
  if (hintRate === null) return `Not enough unlabeled exercises yet to say how much you rely on hints (${counted} first attempts so far).`
  const base = `In your last ${counted} first attempts you used hints on ${pct(hintRate)} of unlabeled exercises`
  return accuracy === null ? `${base}.` : `${base}, and were right ${pct(accuracy)} of the time when you used none.`
}
