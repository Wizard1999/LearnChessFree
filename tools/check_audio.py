"""Check the shipped read-aloud audio: every file in app/public/audio/index.json exists, and report stale files
(audio whose chunk no longer appears in the current lesson text) and lessons whose text changed since the audio was made.
Always exits 0 (stale audio is only unused weight; refresh as in docs/maintenance.md). Needs app/public/content/lessons.json
(tools/build_content.py) and runs node tools/export_speech.mjs to get the current chunks."""
import json, subprocess, sys, tempfile, os
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
AUDIO = ROOT / "app" / "public" / "audio"


def main():
    idx_path = AUDIO / "index.json"
    if not idx_path.exists():
        print("audio: no index.json (audio not built); nothing to check"); return 0
    idx = json.loads(idx_path.read_text(encoding="utf8"))
    files = idx.get("files", {})
    missing = [h for h in files if not (AUDIO / f"{h}.ogg").exists()]
    extra = [p.stem for p in AUDIO.glob("*.ogg") if p.stem not in files]
    with tempfile.TemporaryDirectory() as td:
        out = os.path.join(td, "chunks.json")
        subprocess.run(["node", str(ROOT / "tools" / "export_speech.mjs"), out], check=True, stdout=subprocess.DEVNULL)
        cur = json.loads(Path(out).read_text(encoding="utf8"))
    current = set(cur["chunks"])
    stale = [h for h in files if h not in current]
    uncovered = [l["id"] for l in cur["lessons"] if l["hashes"] and not all(h in files for h in l["hashes"])]
    nbytes = sum(v["bytes"] for v in files.values())
    print(f"audio: {len(files)} files, {nbytes/1e6:.1f} MB, {sum(v['seconds'] for v in files.values())/3600:.2f} h; voice {idx.get('voice')}")
    print(f"audio: {len(missing)} listed files missing, {len(extra)} unlisted files on disk, {len(stale)} stale (text changed or removed)")
    print(f"audio: lessons with every chunk voiced {len(cur['lessons']) - len(uncovered)}/{len(cur['lessons'])} now; index says {len(idx.get('coveredLessons', []))} when built")
    if missing: print("MISSING:", ", ".join(missing[:10]))
    return 0


if __name__ == "__main__":
    sys.exit(main())
