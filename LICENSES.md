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
