// The Scholarmate look gives every subject strand (S1 to S11) its own colour, carried through the whole app (styles/palette.css, --sN).
// Elements that belong to a strand or a stage carry data-hue="1".."11"; the colour rules live in styles/scholarmate.css and apply only to
// that look. The attribute is inert in the other looks, and the name of the strand always appears beside the colour, so it is never the only cue.
/** "S3" -> "3"; anything that is not S1..S11 -> undefined. */
export function hueOfStrand(strand: string | undefined): string | undefined {
  const m = /^S(\d{1,2})$/.exec(strand ?? '')
  return m && +m[1] >= 1 && +m[1] <= 11 ? String(+m[1]) : undefined
}
/** Stage index 1..8 (the recommended path) -> a hue, spread over the palette. */
export function hueOfStage(index: number): string { return String(((Math.max(1, Math.round(index)) - 1) % 11) + 1) }
