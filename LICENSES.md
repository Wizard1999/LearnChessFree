# Licences (draft, 29 October 2026; proposed by Claude, approved by Andrew in chat; not legal advice [H], check with a lawyer before wide publication)

The project has parts with different legal constraints. This is how each is licensed and why.

| Part | Licence | Why |
|---|---|---|
| **Lessons, exercises and other original writing** (`content/`, `docs/`, the Roadmap text) | **CC BY-NC-SA 4.0** (Creative Commons Attribution-NonCommercial-ShareAlike) | Credit is required; anyone may share and adapt it free of charge; commercial use is not allowed; changes must carry the same terms. This is the part we can lawfully restrict to non-commercial use because it is our own work. |
| **The app's code** (`app/`, `tools/`, `desktop/`, `server/`) | **GPL-3.0-or-later**, with the credit request in `NOTICE` | The app bundles Stockfish (GPL-3.0) and Chessground (GPL-3.0-or-later). The GPL does not allow adding a ban on selling copies. So the code stays GPL: anyone may use and change it, and anyone who passes it on must pass on the same freedoms and the source. |
| **The name and emblem** "Scholarmate" and the shield | **Trademark rule** (below) | A trademark can stop someone selling a copy under the same name, which the GPL cannot. |
| **Third-party texts and data** (`library/`, `app/public/library/`) | Their own rights (public domain, CC0, owner-approved), recorded in `library/catalog.json` | Not ours to relicense. |

## Name and emblem
"Scholarmate" and the shield emblem identify this project and its author. You may use them to refer to the project truthfully. You may not use them for a product that is sold or that charges for access, or in a way that suggests the author endorses it. A modified copy must be clearly marked as modified and may not use the name and emblem as its own.

## Contributions
Anyone who contributes lessons, code or fixes to the main project agrees, by contributing, that Andrew Valentine may license the contribution under the terms above and may change those terms only in ways that keep `FREE-FOREVER.md` true (a contributor licence agreement, to be set up before outside contributions are accepted).

## What this does not do
It cannot stop someone legally selling a copy of the *code* under the GPL while keeping the credit and sharing the source. It can stop them selling the lessons and exercises, and from using the name. If the project must ban that as well, the app would have to drop the GPL parts, which is not planned.

## Read-aloud audio (voice licence)
Added 30 October 2026. The lesson audio in `app/public/audio` is synthetic speech generated once at build time and shipped as plain static files; the learner's device only plays them.
- Voice: `en_US-ljspeech-high` from the rhasspy/piper-voices collection (Piper). Training data: the LJ Speech dataset (Keith Ito), which its own page and the voice's model card state is public domain, "no restrictions on its use", attribution not required [V: both pages read 30 October 2026]. Credit given anyway: LJ Speech dataset by Keith Ito (https://keithito.com/LJ-Speech-Dataset/); voice model by the Piper project (https://github.com/rhasspy/piper, https://huggingface.co/rhasspy/piper-voices).
- Tool: the Piper text-to-speech package (GPL-3.0-or-later) was used only as a build tool on the author's machine; it is not shipped, and generated audio is output, not a copy of the program [H: not checked with a lawyer].
- Voices rejected on licence: `en_US-hfc_female-medium` (Hi-Fi Captain, CC BY-NC-SA 4.0, non-commercial); `en_GB-alba-medium` (CC BY 4.0, usable with credit) was the second candidate and was not chosen.
- Voice choice was made on licence simplicity and the "high" quality class; the two samples were not auditioned by a human [I]. Andrew can swap the voice by changing `VOICE` in `tools/make_audio.py` and rebuilding.

## Maia opponent (human-like play, optional)
Added 30 October 2026 (decision D39: AI is allowed if it stays free and equally available). The Play page can use Maia, a neural network trained on human games, as an opponent next to the Stockfish levels. It runs on the learner's own CPU in the browser; nothing is sent anywhere; no account.
- **Weights** (`app/public/maia/maia1100|1300|1500|1700|1900.onnx`, 3,483,872 bytes each, SHA-256 in `app/public/maia/manifest.json`): Maia Chess by CSSLab (University of Toronto), licence **GPL-3.0**. The ONNX files are a conversion by "cstr" (https://huggingface.co/cstr/maia-chess-onnx-opset15, files `maia-<elo>.onnx`, made with `lc0 leela2onnx` from the original `maia-<elo>.pb.gz`). Evidence: the model card read 30 October 2026 states `license: gpl-3.0`, that the upstream weights and CSSLab/maia-chess are GPL-3.0-or-later, and that conversion does not relicense them [V: card read; S: the claim about the upstream repository, whose `LICENSE` file (GNU GPL version 3, read in full at https://github.com/CSSLab/maia-chess/blob/master/LICENSE) is [V] but whose "or later" wording was not checked]. Redistribution inside this GPL-3.0-or-later app is allowed on those terms; the licence text is shipped as `app/public/maia/MAIA-LICENSE-GPL-3.0.txt`. Credit: McIlroy-Young, Sen, Kleinberg, Anderson, "Aligning Superhuman AI with Human Behavior: Chess as a Model System", KDD 2020; https://maiachess.com/ [R: citation from memory].
- **Runtime**: onnxruntime-web 1.31.1 (Microsoft, **MIT**; text of https://github.com/microsoft/onnxruntime/blob/main/LICENSE read 30 October 2026 [V], shipped as `app/public/maia/ONNXRUNTIME-LICENSE.txt`). Its WebAssembly file and small loader are copied by `app/scripts/copy-maia.mjs` into `app/public/maia/ort/` and served from the app's own files (no CDN).
- **Move vocabulary** (`app/src/lib/maiaMoves.ts`): the 1858 move names the network outputs, taken from LeelaChessZero/lczero-training `tf/policy_index.py`. It is a list of moves, a fact about the network, not creative text [H]; that repository showed no licence file on 30 October 2026, so its licence was not checked [not checked].
- Not a rating: "Maia about 1500" describes the human games the network imitates, not a measured strength of the program.
