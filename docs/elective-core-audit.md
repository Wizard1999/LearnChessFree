# Elective / core audit (D80, 9 Nov 2026)

**Decisions (D81, Andrew):** (b) the five stage checks became core lessons, each closing its stage; the nine opening deep dives stay bonus and now note "This position also appears in the core lesson X"; (c) the 14 beyond-depth lessons stay bonus. The tables below are the audit as run before these changes (electives 112, core 396; now 107 and 401).

Andrew: electives and the core should be different things, with no duplicate lessons. This audit classifies each of the 112 elective lessons against the 396 core lessons. Method [V]: `content/lessons/*.json` read by script; items and positions compared by id and by FEN (first four fields) with every core lesson; skill and depth compared with the core's. No lesson file was moved, edited or deleted.

## Counts

| Class | Meaning | Lessons |
|---|---|---|
| (a) bonus only | History, famous games, playstyles, opening deep dives: outside the core's scope, no shared position with it | 84 |
| (b) overlaps the core | Shares a board position with a core lesson, or is a recap of core skills | 14 |
| (c) beyond the core's depth | Its skill has core lessons only at a shallower depth; the elective teaches or applies the next depth | 14 |

No elective uses a skill that has no core lesson (all 206 skills have core lessons), so there is no skill-level core gap [V].

By course:

| Course | a | b | c |
|---|---|---|---|
| famous-games | 7 | 0 | 12 |
| history-and-meta | 7 | 0 | 0 |
| opening-deep-dives | 68 | 9 | 0 |
| playstyles | 2 | 0 | 2 |
| stage-checks | 0 | 5 | 0 |

## (b) Overlaps the core

Opening deep dives revisit main-line positions on purpose (D58; `tools/check_overlap.py` exempts them). Candidates for Andrew: keep as bonus, rework to avoid the shared position, or fold the idea into the core lesson.

| Lesson | Why |
|---|---|
| L-OD-NAJDORF-3 | shares a position with core: L-POS-STRUCTURE-MAROCZY-2 |
| L-OD-QGD-3 | shares a position with core: L-GAME-OWN-1 |
| L-OD-QGD-8 | shares a position with core: L-GAME-OWN-1, L-POS-STRUCTURE-CARLSBAD-2 |
| L-OD-RUYLOPEZ-2 | shares a position with core: L-OPN-NONDEV-3, L-TAC-NONE-1 |
| L-OD-RUYLOPEZ-3 | shares a position with core: L-OPN-NONDEV-2, L-OPN-NONDEV-3, L-OPN-PRINCIPLES-3 |
| L-OD-RUYLOPEZ-4 | shares a position with core: L-OPN-NONDEV-2, L-OPN-PRINCIPLES-3 |
| L-OD-RUYLOPEZ-5 | shares a position with core: L-FND-PIECE-PAWN-2, L-OPN-NONDEV-1 |
| L-OD-RUYLOPEZ-6 | shares a position with core: L-OPN-TRAPS-2 |
| L-OD-RUYLOPEZ-8 | shares a position with core: L-OPN-DEVIATION-2, L-OPN-NONDEV-3, L-OPN-PRINCIPLES-3 |
| L-SC-S2-1 | recap by design: re-tests core skills (13 of them), teaches nothing new |
| L-SC-S3-1 | recap by design: re-tests core skills (9 of them), teaches nothing new |
| L-SC-S4-1 | recap by design: re-tests core skills (14 of them), teaches nothing new |
| L-SC-S5-1 | recap by design: re-tests core skills (7 of them), teaches nothing new |
| L-SC-S6-1 | recap by design: re-tests core skills (12 of them), teaches nothing new |

## (c) Beyond the core's depth

Judgement [I]: all of these are famous-game or playstyle lessons whose game illustrates a skill the core teaches to D1 only; the game applies it, so they read as bonus. Andrew decides whether the core needs D2 lessons for these skills (then the elective could move) or the elective stays.

| Lesson | Skill and depth |
|---|---|
| L-FG-CAPABLANCA-MARSHALL-1 | DEF.RESOURCES D2; core covers only ['D1'] |
| L-FG-EVERGREEN-1 | TAC.COMBO D2; core covers only ['D1'] |
| L-FG-FISCHER-SPASSKY-6-1 | POS.CENTER.CONTROL D2; core covers only ['D1'] |
| L-FG-IMMORTAL-1 | SAC.TYPES D2; core covers only ['D1'] |
| L-FG-KARPOV-KASPAROV-24-1 | POS.PROPHYLAXIS D2; core covers only ['D1'] |
| L-FG-KASPAROV-TOPALOV-1 | ATK.CASTLED D2; core covers only ['D1'] |
| L-FG-LASKER-BAUER-1 | ATK.GREEKGIFT D2; core covers only ['D1'] |
| L-FG-MORPHY-PAULSEN-1 | SAC.TYPES D2; core covers only ['D1'] |
| L-FG-RUBINSTEIN-1 | TAC.OVERLOAD D2; core covers only ['D1'] |
| L-FG-SHORT-TIMMAN-1 | ATK.PACE D2; core covers only ['D1'] |
| L-FG-STEINITZ-BARDELEBEN-1 | ATK.CENTER D2; core covers only ['D1'] |
| L-FG-TAL-BOTVINNIK-6-1 | INI.COMPENSATION D2; core covers only ['D1'] |
| L-PS-ANAND-KRAMNIK-1 | GAME.PATTERNS D2; core covers only ['D1'] |
| L-PS-CARUANA-ARONIAN-1 | GAME.PATTERNS D2; core covers only ['D1'] |

## (a) Bonus only

L-FG-BOTVINNIK-CAPABLANCA-1, L-FG-GAME-CENTURY-1, L-FG-LASKER-CAPABLANCA-1, L-FG-NIMZOWITSCH-SAMISCH-1, L-FG-OPERA-1, L-FG-PETROSIAN-SPASSKY-10-1, L-FG-RETI-TARTAKOWER-1, L-HI-ENGINES-HUMANS-1, L-HI-ENGINES-HUMANS-2, L-HI-ENGINES-HUMANS-3, L-HI-ENGINES-HUMANS-4, L-HI-ENGINES-HUMANS-5, L-HI-RATINGS-CLOCKS-1, L-HI-RULES-HISTORY-1, L-OD-ALIEN-1, L-OD-ALIEN-2, L-OD-ALIEN-3, L-OD-ALIEN-4, L-OD-ALIEN-5, L-OD-ALIEN-6, L-OD-ALIEN-7, L-OD-ALIEN-8, L-OD-BENONI-1, L-OD-CARO-KANN-1, L-OD-CATALAN-1, L-OD-DRAGON-1, L-OD-DRAGON-2, L-OD-DRAGON-3, L-OD-DRAGON-4, L-OD-DRAGON-5, L-OD-DRAGON-6, L-OD-DRAGON-7, L-OD-DRAGON-8, L-OD-DRAGON-9, L-OD-DUTCH-1, L-OD-ELEPHANT-1, L-OD-ELEPHANT-2, L-OD-ELEPHANT-3, L-OD-ENGLISH-1, L-OD-FRENCH-1, L-OD-GRUNFELD-1, L-OD-ITALIAN-1, L-OD-ITALIAN-2, L-OD-ITALIAN-3, L-OD-ITALIAN-4, L-OD-ITALIAN-5, L-OD-ITALIAN-6, L-OD-ITALIAN-7, L-OD-ITALIAN-8, L-OD-KID-1, L-OD-KID-2, L-OD-KID-3, L-OD-KID-4, L-OD-KID-5, L-OD-KID-6, L-OD-KID-7, L-OD-KID-8, L-OD-LONDON-1, L-OD-MARTIAN-1, L-OD-MARTIAN-2, L-OD-MARTIAN-3, L-OD-MARTIAN-4, L-OD-MARTIAN-5, L-OD-NAJDORF-1, L-OD-NAJDORF-2, L-OD-NAJDORF-4, L-OD-NAJDORF-5, L-OD-NAJDORF-6, L-OD-NAJDORF-7, L-OD-NAJDORF-8, L-OD-NIMZO-1, L-OD-PIRC-1, L-OD-QGD-1, L-OD-QGD-2, L-OD-QGD-4, L-OD-QGD-5, L-OD-QGD-6, L-OD-QGD-7, L-OD-RUYLOPEZ-1, L-OD-RUYLOPEZ-7, L-OD-SCANDINAVIAN-1, L-OD-SLAV-1, L-PS-CARLSEN-NAKAMURA-1, L-PS-WHAT-NUMBERS-SAY-1


## Soft link built
Every elective lesson page and row now shows "Relevant skills to know first" (`lib/relevantSkills.ts`, `components/RelevantSkills.tsx`): the lesson's `uses` skills, its own skill and the skills its depth prerequisites name, each linked to the core lesson that teaches it, with the learner's level. It never gates or changes progress.
