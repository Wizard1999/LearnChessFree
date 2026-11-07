// Visual groupings for the curriculum map (a second review, 30 Oct 2026, decision D38). They organise the picture only: the sections (S1 to S11),
// the skill graph and the recommended path are unchanged. Sections keep their order round the circle, so each region is one continuous arc.
export const REGIONS: { id: string; name: string; strands: string[] }[] = [
  { id: 'R1', name: 'Foundations', strands: ['S1'] },
  { id: 'R2', name: 'Seeing and calculating', strands: ['S2', 'S3', 'S4'] },
  { id: 'R3', name: 'Understanding positions', strands: ['S5'] },
  { id: 'R4', name: 'Fighting and converting', strands: ['S6', 'S7'] },
  { id: 'R5', name: 'Playing and improving', strands: ['S8', 'S9', 'S10', 'S11'] },
]

// Distance from the centre = how far into the prerequisite chain, so a few soft bands say what ability lies in each. Bands are taken from the skill
// tiers (TIER_GLOSS in missions.ts) and promise no rating. A skill sits where learning it BEGINS; its deeper levels do not repeat it elsewhere.
export const BANDS: { name: string; milestone: string; tiers: number[] }[] = [
  { name: 'Foundation', milestone: 'play a legal game', tiers: [0] },
  { name: 'Early competence', milestone: 'keep pieces safe and finish simple wins', tiers: [1, 2] },
  { name: 'Developing play', milestone: 'recognise tactics and calculate short lines', tiers: [3] },
  { name: 'Positional understanding', milestone: 'form plans and compare positions', tiers: [4, 5] },
  { name: 'Advanced study', milestone: 'handle complex decisions and specialise', tiers: [6, 7, 8, 9] },
]
export const bandOf = (tier: number) => Math.max(0, BANDS.findIndex(b => b.tiers.includes(tier)))

/** The region a strand belongs to, as "1".."5" (the order of REGIONS), or undefined. The Scholarmate look colours the map by region (data-region). */
export function regionOfStrand(strand: string | undefined): string | undefined {
  const i = REGIONS.findIndex(r => r.strands.includes(strand ?? ''))
  return i < 0 ? undefined : String(i + 1)
}
/** Which of the two tints a slice takes inside its region: the strands of a region alternate "a", "b", so neighbours inside one region differ. */
export function tintOfStrand(strand: string | undefined): 'a' | 'b' {
  const r = REGIONS.find(x => x.strands.includes(strand ?? ''))
  return r && r.strands.indexOf(strand ?? '') % 2 === 1 ? 'b' : 'a'
}
