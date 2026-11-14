#!/usr/bin/env python3
"""Draw the Scholarmate app icons (PNG) from the shapes in app/public/icon.svg, so the app can be installed on phones and desktops.

    ./tools/.venv/Scripts/python.exe -I tools/make_app_icons.py

Writes app/public/icons-app/{icon-192,icon-512,maskable-512,apple-touch-icon}.png. The shapes are copied from icon.svg by hand (three paths), drawn at 4x and shrunk
for smooth edges. Pillow only; no network."""
import sys as _s, pathlib as _p; _s.path.insert(0, str(_p.Path(__file__).resolve().parent))
from pathlib import Path
from PIL import Image, ImageDraw

OUT = Path(__file__).resolve().parent.parent / "app" / "public" / "icons-app"

def cubic(p0, p1, p2, p3, n=24):
    return [tuple((1-t)**3*a + 3*(1-t)**2*t*b + 3*(1-t)*t**2*c + t**3*d for a, b, c, d in zip(p0, p1, p2, p3)) for t in (i/n for i in range(1, n+1))]

# shield: M2 2 h28 v18 c0 8-7 13-14 16 C9 33 2 28 2 20 z
SHIELD = [(2, 2), (30, 2), (30, 20)] + cubic((30, 20), (30, 28), (23, 33), (16, 36)) + cubic((16, 36), (9, 33), (2, 28), (2, 20))
# crown/tower: M11 9h2v2h2V9h2v2h2V9h2v5l-2 1v6l3 3v2H10v-2l3-3v-6l-2-1z
TOWER = [(11, 9), (13, 9), (13, 11), (15, 11), (15, 9), (17, 9), (17, 11), (19, 11), (19, 9), (21, 9), (21, 14), (19, 15), (19, 21), (22, 24), (22, 26), (10, 26), (10, 24), (13, 21), (13, 15), (11, 14)]
# wave: M7 29 c3-2 6-2 9 0 c3-2 6-2 9 0 v2 c-3-2-6-2-9 0 c-3-2-6-2-9 0z
WAVE = [(7, 29)] + cubic((7, 29), (10, 27), (13, 27), (16, 29)) + cubic((16, 29), (19, 27), (22, 27), (25, 29)) + [(25, 31)] + cubic((25, 31), (22, 29), (19, 29), (16, 31)) + cubic((16, 31), (13, 29), (10, 29), (7, 31))

def render(size, pad, bg=None):
    S = 4; big = size * S
    im = Image.new("RGBA", (big, big), bg or (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    h = big * (1 - 2 * pad); k = h / 38; ox = (big - 32 * k) / 2; oy = (big - h) / 2
    tr = lambda pts: [(ox + x * k, oy + y * k) for x, y in pts]
    d.polygon(tr(SHIELD), fill="#1f3a5f")
    w = max(2, int(1.6 * k)); pts = tr(SHIELD + [SHIELD[0]])
    d.line(pts, fill="#d9b45a", width=w)
    for x, y in pts: d.ellipse((x - w / 2, y - w / 2, x + w / 2, y + w / 2), fill="#d9b45a")   # round joins, including the closing corner
    d.polygon(tr(TOWER), fill="#f6f1e4"); d.polygon(tr(WAVE), fill="#f09a7b")
    return im.resize((size, size), Image.LANCZOS)

def main():
    OUT.mkdir(parents=True, exist_ok=True)
    render(192, 0.06).save(OUT / "icon-192.png"); render(512, 0.06).save(OUT / "icon-512.png")
    render(512, 0.2, "#1f3a5f").save(OUT / "maskable-512.png")           # maskable: the shape sits inside the safe zone on a solid field
    render(180, 0.14, "#1f3a5f").convert("RGB").save(OUT / "apple-touch-icon.png")  # iOS wants an opaque square
    print("wrote", sorted(p.name for p in OUT.glob("*.png")))

if __name__ == "__main__":
    main()
