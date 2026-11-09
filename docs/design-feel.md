# Sound and celebration: the feel of Scholarmate (design brief, 9 Nov 2026)

Andrew's request: rewarding sounds "taking after Nintendo or Ghibli", optional and mutable, plus animations that make progress feel good (the way chess.com does confetti on a finished lesson, but "something of our own driven by good psychology"). He calls it necessary eventually: it is queued, not started.

## Evidence labels
Psychology claims below are [R] (recalled, not checked in this project) or [H] (hypothesis to test); nothing here is a validated effect. Do not quote studies in the app without opening them first (project rule 3).

## Principles
1. **Reward what the evidence shows, not clicks.** Celebrate real changes in the learner's evidence: a lesson finished, a skill reaching Guided, Independent or Mastered (spaced rule D77), a Mastery challenge passed, a first game, a streak of days practised [H]. No celebration for merely opening a page or for a wrong answer; no random or variable rewards (no slot-machine loops), no streak guilt, no timers, no loss framing.
2. **Match the size of the feeling to the size of the achievement.** A correct move: a tiny soft sound and a gentle piece settle. A finished lesson: a short warm phrase and a small, calm flourish. A skill level up: the water-fill motif (the glass fills, one clear tone). Mastered: the one big moment, still brief. First game and Core complete: rare, longer, earned.
3. **Our own language, not confetti copied.** The motif is the school's: ink, gold and moss, the glass that fills, a crest, a quill-and-chime feel. Motion is slow and smooth (ease-out, no bounce spam). Studio-Ghibli-like means gentle, natural, warm (wind chimes, soft strings, small wooden sounds); Nintendo-like means crisp, clear, instantly legible feedback (short motifs with a rising shape for success).
4. **Optional, mutable, kind.** Sound is off until the learner turns it on? Default to a first-run choice ("Sounds: on / off"), a master volume, separate toggles for move sounds, rewards and ambience, never autoplay of music, no sound while read-aloud is speaking, honour `prefers-reduced-motion` (no animation, a static badge instead), and a quiet-mode switch. Nothing is communicated by sound alone (captions or visible cues for every sound).
5. **Free, local, no hardware needs (AI policy).** Create the sounds ourselves: synthesised with the Web Audio API or hand-composed and rendered once to small static files in the repo. **No sampling or imitating specific Nintendo or Ghibli recordings or melodies** (rights: rule 4); "taking after" means the mood and design principles only. Check licences of any tool used to render.
6. **Test before tuning.** Reward and sound effects on motivation and learning are mixed in the literature as I recall it [R]; ship small, make everything easy to turn off, and watch what players do (feedback tasks stay after release).

## Event map (first draft)
| Event | Sound | Motion |
|---|---|---|
| Piece move, capture, check | Wooden tap, soft capture, light chime for check | Piece settles; board unchanged |
| Right answer | Short rising two-note | Square glows once |
| Wrong answer | Soft neutral low note, no buzzer | None |
| Lesson finished | Warm three-note phrase | Card lifts, glass fills one notch |
| Skill reaches Guided / Independent | One clear tone each, rising | Block fills to its new level on the map |
| Mastered | Fuller phrase | Block fills completely, a star glows on the map |
| Mastery challenge passed | Short fanfare | Calm stars rise |
| First game / Core complete | Longest, rarest phrase | Crest animation |

## Tasks (see ROADMAP Phase 9)
Sound engine with settings and mute, event hooks, first sound set, reduced-motion variants, the celebration set, caption/visual parity, a settings page section, documentation of licences, and a feedback check after release.

## What exists (9 Nov 2026, decision D85)
- **Sound is built and on by default** (this replaces the earlier idea of asking at first run). Engine `app/src/lib/sound.ts`; move classification `lib/moveSound.ts`; level watcher `components/SoundEvents.tsx`; header toggle `components/SoundToggle.tsx`; Settings section `components/SoundSettings.tsx`. Settings are per device in localStorage (`cs-sound`).
- **Implemented from the event map:** move, capture, check, castle, promotion; right and wrong answer; lesson finished; Guided, Independent and Mastered; Mastery challenge passed; first game finished. All synthesised (wooden noise-plus-thud taps, bell chimes from a sine and two quiet overtones, a single soft triangle note for a wrong answer). Ceilings: 1.2 s, and up to 2.5 s for the first game.
- **Rules built in:** nothing on page load; a hidden tab and the read-aloud voice both silence it; rate limits per kind; every sound has an on-screen equivalent (the app already shows right and wrong text, the lesson-complete card, the level names and the post-game card).
- **Still to do:** the celebration animations with reduced-motion versions, the Core complete sound, ambience (not planned), and tuning after Andrew has listened. The sounds are unheard by their builder: [H] until judged by ear.

### Retune after the first listen (9 Nov 2026)
Andrew's verdict on the first set: pretty good, a little flat and muddy. Changes: taps high-passed and lightened; bells moved up an octave and built from inharmonic partials (1, 2.0, 2.76, 5.4) that fade faster the higher they are; tighter envelopes and more space between phrase notes; a cleaner, slightly higher, low-passed wrong-answer note; a gentle master compressor; a tiny generated reverb (mostly on rewards); per-play humanisation (about 5 cents, 8 percent gain, taps up to 40 cents). Two presets, Warm (default) and Bright, are in Settings under "Sound character" (a third, Soft, was tried and removed after listening). Tunables, all in `lib/sound.ts`: `CHARACTERS` (oct, decay, space, shimmer, partials, upperLen, tapGain, click, wet, level, tapHp, wrongLp), `BELL_PARTIALS`, `MASTER`, `LIMITS`, the compressor settings in `unlockAudio`, and the reverb length in `reverbBus`. Still [H] until heard.

Second listen: Warm and Bright were too close, so they were pulled apart. Warm is mellow and round (lower register, three quiet partials, more reverb, softer taps). Bright is crisp and sparkly (an octave higher, four partials with faster-dying upper ones, nearly dry, sharper taps with a click). Both share the same loudness ceiling. [H] until heard.

## Encouragement and celebration layer (9 Nov 2026, decision D86)
Built: `lib/encourage.ts` (all wording), `lib/celebrate.ts` (event bus, once-only milestones, daily counts), `components/CelebrationLayer.tsx` and `Celebrate.tsx` (glass, star, crest), `styles/celebrate.css`, the progress ring's glide and 100 percent close (`MissionParts.tsx`, `lib/useAnimatedNumber.ts`), and the watchers in `components/SoundEvents.tsx` (which now always run; only the sounds follow the sound settings). Rules kept: evidence-driven, nothing on page load, calm wording, nothing by animation or sound alone, reduced motion gives the same final picture. Not yet: water-fill on the Map blocks; psychology claims remain [R]/[H].
