import type { SVGProps } from 'react'

/**
 * Icon set: our own drawings on a 24px grid, 2px round strokes, currentColor, no icon font. Every glyph is decorative
 * (aria-hidden); the control that holds it carries the accessible name.
 */
type Glyph = { d: string[] }
export const ICONS = {
  first: { d: ['M6 5v14', 'M18 6l-8 6 8 6z'] },
  prev: { d: ['M16 5l-8 7 8 7'] },
  next: { d: ['M8 5l8 7-8 7'] },
  last: { d: ['M18 5v14', 'M6 6l8 6-8 6z'] },
  flip: { d: ['M7 4v14', 'M3.5 7.5L7 4l3.5 3.5', 'M17 20V6', 'M13.5 16.5L17 20l3.5-3.5'] },
  edit: { d: ['M4 20l1-4L16 5l3 3L8 19z', 'M14 7l3 3'] },
  trash: { d: ['M4 7h16', 'M9 7V4h6v3', 'M6 7l1 13h10l1-13', 'M10 11v6', 'M14 11v6'] },
  engine: { d: ['M9 3v3', 'M15 3v3', 'M9 18v3', 'M15 18v3', 'M3 9h3', 'M3 15h3', 'M18 9h3', 'M18 15h3', 'M6 6h12v12H6z', 'M10 10h4v4h-4z'] },
  hint: { d: ['M9 18h6', 'M10 21h4', 'M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z'] },
  reset: { d: ['M4 4v6h6', 'M5.6 15a8 8 0 1 0 1.1-8.1L4 10'] },
  eye: { d: ['M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z', 'M12 9.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z'] },
  speaker: { d: ['M4 9.5h3.5L12 5.5v13l-4.5-4H4z', 'M15.5 9a4 4 0 0 1 0 6', 'M18 6.5a8 8 0 0 1 0 11'] },
  mute: { d: ['M4 9.5h3.5L12 5.5v13l-4.5-4H4z', 'M16 9.5l5 5', 'M21 9.5l-5 5'] },
  pause: { d: ['M8 5v14', 'M16 5v14'] },
  play: { d: ['M7 4.5l12 7.5-12 7.5z'] },
  stop: { d: ['M6 6h12v12H6z'] },
  close: { d: ['M6 6l12 12', 'M18 6L6 18'] },
  menu: { d: ['M4 7h16', 'M4 12h16', 'M4 17h16'] },
  dots: { d: ['M5 12h.01', 'M12 12h.01', 'M19 12h.01'] },
  settings: { d: ['M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z', 'M12 2.5v3', 'M12 18.5v3', 'M2.5 12h3', 'M18.5 12h3', 'M5.3 5.3l2.1 2.1', 'M16.6 16.6l2.1 2.1', 'M18.7 5.3l-2.1 2.1', 'M7.4 16.6l-2.1 2.1'] },
  grid: { d: ['M4 4h16v16H4z', 'M4 12h16', 'M12 4v16'] },
  back: { d: ['M10 6l-6 6 6 6', 'M4 12h16'] },
  check: { d: ['M4 12.5l5 5L20 6.5'] },
  copy: { d: ['M9 9h11v11H9z', 'M5 15V4h11'] },
  download: { d: ['M12 4v11', 'M7 10.5l5 5 5-5', 'M5 20h14'] },
  image: { d: ['M3 5h18v14H3z', 'M3 16l5-5 4 4 3-3 6 6', 'M15.5 9h.01'] },
  keyboard: { d: ['M2.5 6h19v12h-19z', 'M6 10h.01', 'M10 10h.01', 'M14 10h.01', 'M18 10h.01', 'M7 14h10'] },
  branch: { d: ['M6 20V8', 'M6 8a3 3 0 1 0 0-.01', 'M18 6v4a5 5 0 0 1-5 5H6', 'M18 4l-3 3', 'M18 4l3 3'] },
  info: { d: ['M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z', 'M12 11v6', 'M12 7.5h.01'] },
  fullscreen: { d: ['M4 9V4h5', 'M20 9V4h-5', 'M4 15v5h5', 'M20 15v5h-5'] },
  undo: { d: ['M9 6L4 11l5 5', 'M4 11h9a7 7 0 0 1 7 7'] },
  flag: { d: ['M5 21V4', 'M5 4h12l-2.5 4L17 12H5'] },
  chevron: { d: ['M6 9l6 6 6-6'] },
} satisfies Record<string, Glyph>
export type IconName = keyof typeof ICONS

export function Icon({ name, size = 20, ...rest }: { name: IconName; size?: number } & Omit<SVGProps<SVGSVGElement>, 'name'>) {
  const g: Glyph = ICONS[name]
  return (
    <svg className="icon" viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" {...rest}>
      {g.d.map((d, k) => <path key={k} d={d} />)}
    </svg>
  )
}
