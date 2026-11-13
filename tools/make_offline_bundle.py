#!/usr/bin/env python3
"""Assemble the stand-alone offline bundle (CLAUDE.md rule 10): the built app plus a tiny local server and a plain-text start page.

    ./tools/.venv/Scripts/python.exe -I tools/make_offline_bundle.py [--out PATH] [--zip]

Run `npm run build` in app/ first. The build copies app/public into app/dist, so the engine, Maia weights, content, library text and (when
`tools/fetch_scans.py` has run) the page scans are already in dist. The bundle adds:
  START-HERE.txt     how to open it with no internet, in plain words
  Start.bat          Windows: runs the server with Python if present
  start.sh           Mac / Linux
  serve.py           a 40-line static server using only the Python standard library (a browser blocks fetch() and service workers on file://,
                     so the app must be served, even from the same machine)
Default output: dist-offline/Scholarmate-offline/ (gitignored). Nothing here touches the network.
"""
import sys as _s, pathlib as _p
import shutil, zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DIST = ROOT / "app" / "dist"

SERVE = '''#!/usr/bin/env python3
"""Serve the Scholarmate folder next to this file on this computer only, then open it in the browser. Standard library only; no network needed."""
import http.server, socketserver, webbrowser, threading, os, sys
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), "app"))
class H(http.server.SimpleHTTPRequestHandler):
    extensions_map = {**http.server.SimpleHTTPRequestHandler.extensions_map, ".webp": "image/webp", ".json": "application/json", ".js": "text/javascript", ".mjs": "text/javascript", ".wasm": "application/wasm", ".ogg": "audio/ogg", ".webmanifest": "application/manifest+json", ".svg": "image/svg+xml"}
    def log_message(self, *a): pass
port = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
socketserver.TCPServer.allow_reuse_address = True
with socketserver.ThreadingTCPServer(("127.0.0.1", port), H) as srv:
    url = f"http://localhost:{port}/"
    print("Scholarmate is running at", url, "- close this window to stop it.")
    threading.Timer(0.8, lambda: webbrowser.open(url)).start()
    try: srv.serve_forever()
    except KeyboardInterrupt: pass
'''

START_HERE = """SCHOLARMATE: START HERE (no internet needed)

This folder is a complete chess school: the rules, every lesson and exercise, a chess engine to play and to check your ideas, opening
and game data, and a library of old chess books with photographs of their original pages. Nothing in it needs a network, an account or a server
of ours. Created by Andrew Valentine.

TO OPEN IT
1. You need a computer with a web browser (Chrome, Edge, Firefox or Safari) and ONE of these, which only has to serve the folder to your own browser:
   a. Python 3 (most computers have it, or can install it from a USB stick)
        Windows: double-click Start.bat
        Mac / Linux: open a terminal in this folder and run:  sh start.sh
   b. Node.js:  open a terminal in the folder named "app" and run:  npx serve -l 8080     then open http://localhost:8080/
   c. Any other tool that serves a folder of files over http (a web server like nginx, Apache, `php -S localhost:8080`, `busybox httpd -f -p 8080`).
   Why a server is needed: a browser refuses to read the school's data files straight from a file:// address. The server stays on your own
   computer; it does not use the internet.
2. The page opens at http://localhost:8080/ . Press the one big button on the first screen.

WHAT IS IN THE FOLDERS
  app/                the school itself (lessons, exercises, engine, openings, game data, the library)
  app/library/files   the books as text; app/library/scans  the same books as page photographs (when this copy has them)
  serve.py            the tiny local server (read it: about 15 lines)

IF YOU ARE STARTING FROM NOTHING
Open the school and press the first button. The first minutes teach you to move the pieces and play a short real game; every lesson after that
gives the next small step. The books in the library are the old masters, free to read.
"""


def main():
    _s.stdout.reconfigure(encoding="utf-8")
    arg = lambda f, d=None: _s.argv[_s.argv.index(f) + 1] if f in _s.argv else d
    out = Path(arg("--out", ROOT / "dist-offline")) / "Scholarmate-offline"
    if not (DIST / "index.html").exists():
        _s.exit("app/dist not found: run `npm run build` in app/ first")
    if out.exists(): shutil.rmtree(out)
    out.mkdir(parents=True)
    shutil.copytree(DIST, out / "app")
    (out / "serve.py").write_text(SERVE, encoding="utf-8")
    (out / "START-HERE.txt").write_text(START_HERE, encoding="utf-8")
    (out / "Start.bat").write_text("@echo off\r\ncd /d %~dp0\r\n(py -3 serve.py || python serve.py) || (echo Python 3 was not found. Read START-HERE.txt for the other ways. & pause)\r\n", encoding="utf-8", newline="")
    (out / "start.sh").write_text("#!/bin/sh\ncd \"$(dirname \"$0\")\"\n(python3 serve.py || python serve.py) || echo 'Python 3 was not found. Read START-HERE.txt for the other ways.'\n", encoding="utf-8", newline="")
    n = sum(1 for f in out.rglob("*") if f.is_file()); mb = sum(f.stat().st_size for f in out.rglob("*") if f.is_file()) / 1e6
    scans = out / "app" / "library" / "scans"
    ns = len([d for d in scans.iterdir() if d.is_dir()]) if scans.exists() else 0
    print(f"bundle: {out}\n  {n} files, {mb:.0f} MB, {ns} books with page scans")
    if "--zip" in _s.argv:
        z = out.parent / "Scholarmate-offline.zip"
        with zipfile.ZipFile(z, "w", zipfile.ZIP_DEFLATED) as zf:
            for f in out.rglob("*"):
                if f.is_file(): zf.write(f, f.relative_to(out.parent))
        print("  zip:", z, f"{z.stat().st_size / 1e6:.0f} MB")


if __name__ == "__main__":
    main()
