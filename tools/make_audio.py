"""Build the read-aloud audio once, at build time, with an open-source neural voice (Piper).

The learner's device only plays the static files in app/public/audio; nothing is synthesised or sent anywhere at run time.
Setup (separate venv so the main tools venv is untouched):
    python -m venv tools/.venv-tts && tools/.venv-tts/Scripts/python.exe -m pip install piper-tts av
    cd tools/_voices && ../.venv-tts/Scripts/python.exe -I -m piper.download_voices en_US-ljspeech-high
Run:
    node tools/export_speech.mjs                       # chunk list, exactly as app/src/lib/speech.ts computes it
    tools/.venv-tts/Scripts/python.exe -I tools/make_audio.py [--workers 3] [--budget-mb 70]
    tools/.venv-tts/Scripts/python.exe -I tools/make_audio.py --sample NAME_OF_VOICE   # 20 s listening sample in tools/_voices
Incremental: a chunk whose file exists is skipped. Chunks are made in recommended-path order until the budget is reached.
"""
import argparse, io, json, sys, time
from fractions import Fraction
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
VOICES = ROOT / "tools" / "_voices"
OUT = ROOT / "app" / "public" / "audio"
VOICE = "en_US-ljspeech-high"
LICENCE = ("LJ Speech dataset (public domain, from LibriVox recordings) via the rhasspy/piper-voices model "
           "en_US-ljspeech-high; synthesised once at build time with Piper (GPL-3.0-or-later, build tool only, not shipped)")
RATE = 24000      # Opus-native sample rate
BITRATE = 16000   # bits per second, speech


def load_voice(name):
    from piper import PiperVoice
    from piper.config import SynthesisConfig  # noqa: F401
    return PiperVoice.load(str(VOICES / f"{name}.onnx"), config_path=str(VOICES / f"{name}.onnx.json"))


def synth_pcm(voice, text):
    """float32 mono samples at the voice's rate, with a short pause between sentences."""
    import numpy as np
    parts, sr = [], voice.config.sample_rate
    for ch in voice.synthesize(text):
        parts.append(ch.audio_float_array)
        parts.append(np.zeros(int(sr * 0.12), dtype="float32"))
    pcm = np.concatenate(parts[:-1]) if parts else np.zeros(1, dtype="float32")
    return pcm, sr


def encode_ogg(pcm, sr):
    """Mono Opus in an Ogg container; returns (bytes, seconds)."""
    import av, numpy as np
    buf = io.BytesIO()
    out = av.open(buf, "w", format="ogg")
    st = out.add_stream("libopus", rate=RATE)
    st.bit_rate = BITRATE
    st.layout = "mono"
    st.options = {"application": "voip", "vbr": "on"}
    res = av.AudioResampler(format="s16", layout="mono", rate=RATE)
    pcm16 = (np.clip(pcm, -1, 1) * 32767).astype("int16").reshape(1, -1)
    frame = av.AudioFrame.from_ndarray(pcm16, format="s16", layout="mono")
    frame.sample_rate = sr
    frame.time_base = Fraction(1, sr)
    for f in res.resample(frame) + res.resample(None):
        for p in st.encode(f):
            out.mux(p)
    for p in st.encode(None):
        out.mux(p)
    out.close()
    return buf.getvalue(), len(pcm) / sr


_voice = None
def _init(name):
    global _voice
    import onnxruntime
    _so = onnxruntime.SessionOptions
    def _limited():  # one or two threads per worker: many workers each using every core only slow each other down
        o = _so(); o.intra_op_num_threads = 2; o.inter_op_num_threads = 1
        return o
    onnxruntime.SessionOptions = _limited
    _voice = load_voice(name)


def _work(job):
    h, text = job
    try:
        pcm, sr = synth_pcm(_voice, text)
        data, sec = encode_ogg(pcm, sr)
        (OUT / f"{h}.ogg").write_bytes(data)
        return h, len(data), round(sec, 2), None
    except Exception as e:  # keep the batch going; the chunk is retried on the next run
        return h, 0, 0, repr(e)


def sample(name):
    data = json.loads((VOICES / "chunks.json").read_text(encoding="utf8"))
    texts, n = [], 0
    for h in data["lessons"][3]["hashes"]:
        texts.append(data["chunks"][h]); n += len(data["chunks"][h])
        if n > 330: break
    v = load_voice(name)
    import numpy as np
    pcms = []
    for t in texts:
        p, sr = synth_pcm(v, t); pcms += [p, np.zeros(int(sr * 0.4), dtype="float32")]
    pcm = np.concatenate(pcms)
    b, s = encode_ogg(pcm, sr)
    (VOICES / f"sample-{name}.ogg").write_bytes(b)
    print(name, f"{s:.1f}s", len(b), "bytes", "|", " ".join(texts)[:200])


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--workers", type=int, default=3)
    ap.add_argument("--budget-mb", type=float, default=70)
    ap.add_argument("--sample")
    ap.add_argument("--limit", type=int, default=0, help="stop after this many new chunks (testing)")
    a = ap.parse_args()
    if a.sample:
        return sample(a.sample)
    import multiprocessing as mp
    data = json.loads((VOICES / "chunks.json").read_text(encoding="utf8"))
    OUT.mkdir(parents=True, exist_ok=True)
    idx_path = OUT / "index.json"
    old = json.loads(idx_path.read_text(encoding="utf8")) if idx_path.exists() else {}
    files = {h: v for h, v in old.get("files", {}).items() if (OUT / f"{h}.ogg").exists()} if old.get("voice") == VOICE else {}
    order = []
    for l in data["lessons"]:
        for h in l["hashes"]:
            if h not in order_set(order): order.append(h)
    budget = int(a.budget_mb * 1_000_000)
    total = sum(v["bytes"] for v in files.values())
    todo = [(h, data["chunks"][h]) for h in order if h not in files]
    print(f"{len(order)} chunks in path order, {len(files)} already made ({total/1e6:.1f} MB), {len(todo)} to go", flush=True)
    if a.limit: todo = todo[:a.limit]

    def save(done):
        covered = [l["id"] for l in data["lessons"] if l["hashes"] and all(h in files for h in l["hashes"])]
        idx = {"voice": VOICE, "licence": LICENCE, "sampleRate": RATE, "codec": "opus/ogg mono %d bps" % BITRATE,
               "files": files, "coveredLessons": covered, "built": time.strftime("%Y-%m-%d"),
               "chunkCount": len(order)}
        idx_path.write_text(json.dumps(idx, separators=(",", ":")), encoding="utf8")
        return len(covered)

    t0, fails = time.time(), 0
    batch = a.workers * 8
    with mp.get_context("spawn").Pool(a.workers, initializer=_init, initargs=(VOICE,)) as pool:
        for i in range(0, len(todo), batch):
            if total >= budget: print("budget reached"); break
            for h, b, s, err in pool.imap(_work, todo[i:i + batch]):
                if err: fails += 1; print("FAIL", h, err); continue
                if total + b > budget: continue
                files[h] = {"bytes": b, "seconds": s}; total += b
            c = save(0)
            print(f"{len(files)}/{len(order)} chunks, {total/1e6:.1f} MB, {sum(v['seconds'] for v in files.values())/3600:.2f} h, "
                  f"{c} lessons covered, {time.time()-t0:.0f}s elapsed", flush=True)
    # a file written but kept out of the index (over budget) would ship unused: delete it
    for p in OUT.glob("*.ogg"):
        if p.stem not in files: p.unlink()
    c = save(0)
    print(f"DONE chunks {len(files)}/{len(order)}, bytes {total}, seconds {sum(v['seconds'] for v in files.values()):.0f}, lessons covered {c}/{len(data['lessons'])}, failures {fails}")


_seen = {}
def order_set(order):
    s = _seen.get(id(order))
    if s is None or len(s) != len(order): s = _seen[id(order)] = set(order)
    return s


if __name__ == "__main__":
    main()
