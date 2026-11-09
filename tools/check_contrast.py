"""WCAG 2.2 contrast gate for the app's colour tokens, in BOTH modes.

    ./tools/.venv/Scripts/python.exe -I tools/check_contrast.py

Parses app/src/styles/palette.css (the Scholarmate look) and app/src/styles/atlas.css (Atlas, the default look); each file is its own look and
is checked on its own. It resolves var() chains for the light mode (:root[data-style='<look>']) and the dark mode (the prefers-color-scheme block and the
explicit data-theme='dark' block, which must be identical),
computes the contrast ratio of every meaningful pair, prints a table and exits 1 when
  - a text pair is under 4.5:1,
  - a graphic pair (borders, rings, strokes, icons) is under 3:1,
  - the two dark blocks differ, or a token the pairs need is missing.
The default Friendly look and Collegiate (theme.css) are unchanged and not gated here.
Large or decorative exceptions are not made here: persimmon and gold are fills with ink text (checked as such), never text on ivory.
"""
import re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
STYLES = ROOT / "app" / "src" / "styles"
LOOKS = (("scholarmate", STYLES / "palette.css"), ("atlas", STYLES / "atlas.css"))

TEXT_MIN, GRAPHIC_MIN = 4.5, 3.0

# (foreground token, background token, what it is). Text pairs first, then graphics.
TEXT = [
    ("text", "canvas", "body text on the page"), ("text", "surface", "body text on a card"), ("text", "chip", "text on a chip"),
    ("text-secondary", "canvas", "muted text on the page"), ("text-secondary", "surface", "muted text on a card"), ("text-secondary", "chip", "muted text on a chip"),
    ("on-primary", "primary", "button label on the primary action"), ("on-primary", "primary-hover", "button label, hover"),
    ("link", "canvas", "link on the page"), ("link", "surface", "link on a card"), ("link", "chip", "link on a chip"),
    ("on-accent", "accent", "ink on the persimmon highlight"), ("on-accent", "accent-hover", "ink on persimmon, hover"),
    ("accent-ink", "canvas", "persimmon text on the page"), ("accent-ink", "surface", "persimmon text on a card"), ("accent-ink", "chip", "persimmon text on a chip"),
    ("success", "canvas", "jade text on the page"), ("success", "surface", "jade text on a card"), ("success", "ok-bg", "jade text on a correct answer"),
    ("on-success", "success", "label on a jade fill"),
    ("canvas", "text", "tooltip label on the tooltip fill (controls.css)"), ("on-accent", "accent", "primary and pressed-segment button label"),
    ("text", "ok-bg", "text on a correct answer"), ("text", "no-bg", "text on a wrong answer"),
    ("on-gold", "gold", "ink on the gold highlight"),
    ("on-bar", "bar", "header text on the header band"), ("on-bar-soft", "bar", "header nav text on the header band"), ("bar-gold", "bar", "wordmark accent on the band"),
    *[(fg, f"field-{h}", f"{what} on the {h} field") for h in ("cobalt", "jade", "gold", "persimmon") for fg, what in
      (("on-field", "text"), ("on-field-soft", "muted text"), ("field-link", "link"))],
    ("on-accent", "accent", "ink on the Up next field"),
    *[(f"on-s{n}", f"s{n}", f"label on the strand {n} colour") for n in range(1, 12)],
    ("warning", "canvas", "gold-dark text on the page"), ("warning", "surface", "gold-dark text on a card"),
    # buttons and chips that sit ON a coloured field card inherit --text = on-field there, over their own surface fill (the "Back to Curriculum" bug class)
    ("on-field", "surface", "plain button or chip label inside a field card (fill: surface)"), ("on-field", "chip", "label on a chip inside a field card"),
    ("on-primary", "primary", "primary button label wherever it sits (fill: primary)"),
    ("error", "canvas", "error text on the page"), ("error", "surface", "error text on a card"), ("error", "no-bg", "error text on a wrong answer"),
]
GRAPHIC = [
    ("control-boundary", "canvas", "control border on the page"), ("control-boundary", "surface", "control border on a card"), ("control-boundary", "chip", "control border on a chip"),
    ("focus", "canvas", "focus ring on the page"), ("focus", "surface", "focus ring on a card"), ("focus", "chip", "focus ring on a chip"),
    ("primary", "canvas", "cobalt fill, ring or line on the page"), ("primary", "surface", "cobalt fill, ring or line on a card"),
    ("accent-line", "canvas", "persimmon ring or edge on the page"), ("accent-line", "surface", "persimmon ring or edge on a card"),
    ("success", "canvas", "jade tick, ring or fill on the page"), ("success", "surface", "jade tick, ring or fill on a card"),
    ("text-secondary", "surface", "grey line or icon on a card"), ("error", "surface", "danger button outline and label on a card"), ("text", "surface", "icon-only button symbol on a card"), ("text", "chip", "icon on a pressed toggle"),
    *[("control-boundary", f"field-{h}", f"control border on the {h} field") for h in ("cobalt", "jade", "gold", "persimmon")],
    ("gold", "bar", "gold underline or fill on the band"),
    ("on-bar", "bar", "icon on the header band (sound, settings)"), ("on-bar-soft", "bar", "outline of a header icon button on the band"),
    *[("primary", f"field-{h}", f"primary button fill against the {h} field it sits on") for h in ("cobalt", "jade", "gold", "persimmon")],
    ("primary", "chip", "primary fill against a chip"),
    *[(f"s{n}-line", bg, f"strand {n} ring or line on the {bg}") for n in range(1, 12) for bg in ("canvas", "surface", "chip")],
]


# The star chart on the Constellations page (D88): labels on the night sky (dark) or parchment (light), and its stars, lines, rings and gold marks.
TEXT += [("sky-ink", "sky", "constellation names and skill plates on the star chart"), ("sky-ink-soft", "sky", "ring names and numerals on the star chart"),
         ("sky-gold", "sky", "gold chart labels (Up next, You are here)")]
GRAPHIC += [("sky-line", "sky", "constellation lines, astrolabe rings and ticks"), ("sky-star", "sky", "the brightest star and the bright end of a line"),
            ("sky-dim", "sky", "a star not started yet"), ("sky-gold", "sky", "the mastered star, the crest and the pointer ring"),
            *[(f"sky-lv{n}", "sky", f"a star at level {n} (the lit part)") for n in range(1, 5)]]


# Disabled controls are drawn at DISABLED_OPACITY (index.css, controls.css): the label and the fill both blend into whatever is behind them.
# (label token, fill token, behind token, what). The blended label must still read against the blended fill at 3:1 (legible, though plainly not active).
DISABLED = [
    ("text", "surface", "canvas", "disabled plain button on the page"), ("text", "surface", "surface", "disabled plain button on a card"),
    ("on-primary", "primary", "canvas", "disabled primary button on the page"), ("on-primary", "primary", "surface", "disabled primary button on a card"),
    ("error", "surface", "surface", "disabled danger button on a card"),
    *[("on-field", "surface", f"field-{h}", f"disabled plain button on the {h} field") for h in ("cobalt", "jade", "gold", "persimmon")],
    *[("on-primary", "primary", f"field-{h}", f"disabled primary button on the {h} field") for h in ("cobalt", "jade", "gold", "persimmon")],
]
SLICE_TINT_MAX = 0.16  # the strongest slice tint in map.css (the highlighted slice); keep equal to the 16% there
DISABLED_MIN = 3.0
DISABLED_OPACITY = 0.7  # must equal the opacity of `button:disabled` and `.btn:disabled` in index.css and controls.css (a test keeps them equal)


def mix(a, b, t=0.5):
    """The colour t of the way from b to a (opacity t of a over b), as hex."""
    x, y = a.lstrip("#"), b.lstrip("#")
    x, y = (("".join(c * 2 for c in v) if len(v) == 3 else v) for v in (x, y))
    return "#" + "".join(f"{round(int(x[i:i+2], 16) * t + int(y[i:i+2], 16) * (1 - t)):02x}" for i in (0, 2, 4))


def strip_comments(s): return re.sub(r"/\*.*?\*/", "", s, flags=re.S)


def blocks(css):
    """[(selector, {token: value})] for every simple rule (the media wrapper has no declarations of its own)."""
    out = []
    for sel, body in re.findall(r"([^{}]+)\{([^{}]*)\}", strip_comments(css)):
        decl = dict((k.strip(), v.strip()) for k, v in re.findall(r"(--[\w-]+)\s*:\s*([^;]+);", body))
        out.append((" ".join(sel.split()), decl))
    return out


def resolve(name, tokens, depth=0):
    if depth > 12: raise ValueError(f"var() chain too deep at {name}")
    v = tokens.get(name)
    if v is None: raise KeyError(name)
    m = re.fullmatch(r"var\(\s*(--[\w-]+)\s*\)", v)
    return resolve(m.group(1), tokens, depth + 1) if m else v


def lum(hexv):
    h = hexv.lstrip("#")
    if len(h) == 3: h = "".join(c * 2 for c in h)
    c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    c = [x / 12.92 if x <= 0.03928 else ((x + 0.055) / 1.055) ** 2.4 for x in c]
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]


def ratio(a, b):
    x, y = sorted((lum(a), lum(b)), reverse=True)
    return (x + 0.05) / (y + 0.05)


def check(look, css_path):
    bl = blocks(css_path.read_text(encoding="utf-8"))
    raw, light, dark_media, dark_attr = {}, {}, {}, {}
    SC = f":root[data-style='{look}']"
    for sel, d in bl:
        if sel == ":root": raw.update(d)
        elif sel == SC: light.update(d)
        elif sel == SC + ":not([data-theme='light'])": dark_media.update(d)
        elif sel == SC + "[data-theme='dark']": dark_attr.update(d)
    light = {**raw, **light}
    problems = []
    if not dark_media or not dark_attr: problems.append("missing a dark block (prefers-color-scheme and/or data-theme='dark')")
    elif dark_media != dark_attr:
        diff = sorted(k for k in set(dark_media) | set(dark_attr) if dark_media.get(k) != dark_attr.get(k))
        problems.append("the two dark blocks differ: " + ", ".join(diff))
    modes = {"light": light, "dark": {**light, **dark_attr}}  # dark inherits raw tokens and anything it does not override
    rows = []
    for mode, toks in modes.items():
        for kind, pairs, need in (("text", TEXT, TEXT_MIN), ("graphic", GRAPHIC, GRAPHIC_MIN)):
            for fg, bg, what in pairs:
                try:
                    f, b = resolve("--" + fg, toks), resolve("--" + bg, toks)
                    r = ratio(f, b)
                except (KeyError, ValueError) as e:
                    problems.append(f"{look} {mode}: cannot resolve {e} for {fg} on {bg}"); continue
                ok = r >= need
                rows.append((mode, kind, fg, bg, f, b, r, need, ok, what))
                if not ok: problems.append(f"{look} {mode} {kind}: {fg} {f} on {bg} {b} is {r:.2f}:1, needs {need}:1 ({what})")
    for mode, toks in modes.items():
        for fg, fill, behind, what in DISABLED:
            try:
                f, fl, bh = (resolve("--" + t, toks) for t in (fg, fill, behind))
            except (KeyError, ValueError) as e:
                problems.append(f"{look} {mode}: cannot resolve {e} for disabled {what}"); continue
            ef, efl = mix(f, bh, DISABLED_OPACITY), mix(fl, bh, DISABLED_OPACITY)
            r = ratio(ef, efl)
            ok = r >= DISABLED_MIN
            rows.append((mode, "disabled", fg, fill, ef, efl, r, DISABLED_MIN, ok, what))
            if not ok: problems.append(f"{look} {mode} disabled: {fg} on {fill} over {behind} blends to {ef} on {efl}, {r:.2f}:1, needs {DISABLED_MIN}:1 ({what})")
    # Slice colours on (Constellations, D88): every subject hue at the strongest tint over the sky; the chart's marks and ring text must still read on it.
    for mode, toks in modes.items():
        for n in range(1, 12):
            try:
                sky, hue = resolve("--sky", toks), resolve(f"--s{n}", toks)
            except (KeyError, ValueError) as e:
                problems.append(f"{look} {mode}: cannot resolve {e} for the slice tint {n}"); continue
            bg = mix(hue, sky, SLICE_TINT_MAX)
            for fg_name, need, kind, what in (("sky-ink-soft", TEXT_MIN, "text", "ring names and numerals"), ("sky-ink", TEXT_MIN, "text", "labels"), ("sky-line", GRAPHIC_MIN, "graphic", "rings and lines"),
                                              ("sky-dim", GRAPHIC_MIN, "graphic", "a star not started"), ("sky-lv1", GRAPHIC_MIN, "graphic", "a Seen star"), ("sky-gold", GRAPHIC_MIN, "graphic", "gold marks"), ("sky-star", GRAPHIC_MIN, "graphic", "the bright line")):
                f = resolve("--" + fg_name, toks); r = ratio(f, bg); ok = r >= need
                rows.append((mode, kind, fg_name, f"slice s{n}", f, bg, r, need, ok, f"{what} on slice {n} tinted"))
                if not ok: problems.append(f"{look} {mode} {kind}: {fg_name} {f} on slice tint s{n} {bg} is {r:.2f}:1, needs {need}:1 ({what})")
    print(f"== {look} ({css_path.name})")
    print(f"{'mode':5} {'kind':7} {'foreground':17} {'background':14} {'fg':8} {'bg':8} {'ratio':>6}  need  result")
    for mode, kind, fg, bg, f, b, r, need, ok, what in rows:
        print(f"{mode:5} {kind:7} {fg:17} {bg:14} {f:8} {b:8} {r:6.2f}  {need:>4}  {'ok' if ok else 'FAIL'}  {what}")
    print()
    return problems, len(rows)


def main():
    problems, total = [], 0
    for look, path in LOOKS:
        pr, n = check(look, path); problems += pr; total += n
    if problems:
        print(f"CONTRAST FAILED ({len(problems)} problems)")
        for p in problems: print("  - " + p)
        return 1
    print(f"CONTRAST OK: {total} pairs across {len(LOOKS)} looks in light and dark; text at least {TEXT_MIN}:1, graphics at least {GRAPHIC_MIN}:1")
    return 0


if __name__ == "__main__":
    sys.exit(main())
