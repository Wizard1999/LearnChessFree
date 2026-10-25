# Does it work? An evaluation plan for student zero

Labels: **[V]** verified here, **[I]** inference, **[H]** hypothesis. Nothing below has been measured yet. This is the plan for measuring, written before any data exists so the result cannot be bent to fit.

## What we are testing, and what we are not

The project makes three claims that could be wrong:

1. **[H1] Unlabelled practice with fresh items transfers better than labelled, repeated practice.** (Tested inside the app: mastery counts only first attempts at cue 3 or higher.)
2. **[H2] Teaching self-direction explicitly (own aim each day, own-plan experiments, predict-then-check in the lab, annotating before the engine) makes the learner need less help over time.** (Tested with the independence ledger.)
3. **[H3] Play improves, not just puzzle scores.** (Tested with games, outside the app.)

With one learner (Andrew) we cannot show that the school *caused* any change. We can show whether the numbers moved, whether the movement is larger than the noise in a single learner's results, and whether the habits the school teaches show up. **[I]** Treat the outcome as one case study, not as evidence about people in general.

## Measures

| Measure | How | When | Notes |
|---|---|---|---|
| **Baseline play** | At least 20 rapid games on Lichess (any time control at least 10+0) before starting; the app's game import reads them | Before lesson 1 (gate G1) | Rating is a noisy outcome. 20 games gives a rating uncertainty of roughly ±100 points [I], so only a large change means anything. |
| **Placement** | `Placement` page: 5 positions per tier, tiers 0-4, nothing labelled | Before lesson 1, and again every 6-8 weeks | The same tier structure each time, with fresh positions drawn from the pool. A score on a handful of items has a wide interval; the page shows it. |
| **Transfer check** | `My plan` baseline and check on a chosen skill, with positions from families not seen at baseline | Per plan | The check excludes families used in the baseline so memory of a diagram cannot raise the score. |
| **Independence** | Hint rate and first-try accuracy at cue 3 and above, from the attempts ledger | Continuous | The aim is falling hint use with accuracy holding. Harder material raises hint use; compare within a skill. |
| **Calibration** | Confidence chip against correctness on unlabelled items | Continuous | A gap near zero is the aim. |
| **Opportunity log** | Across analysed games, count named tactics the engine preferred that were missed, and tactics the opponent's best reply carried out | Every 10 games | Tags come from the structural detectors. Their precision is reported in `docs/detectors.md`; a tag with low precision is not counted. |
| **Self-direction habits** | Days with an aim set; plans made, baselined and checked; lab uses; games annotated before the engine | Continuous | Counts, not scores. |
| **Retention** | Delayed re-test of the same skill after 2, 4 and 8 weeks | Scheduled by the app's spacing | Compare with the same skill's first-try accuracy at the time it was learned. |

## Analysis rules fixed in advance

- **Primary outcome:** change in first-try accuracy on fresh unlabelled items across the skills the learner chose to train, from the first plan baseline to the last plan check. **Secondary:** playing rating change over at least 40 games; independence and calibration trends.
- **Intervals, not verdicts.** Report Wilson intervals for proportions; call a change real only if the intervals do not overlap and it repeats across at least two skills. A single plan that "worked" is an anecdote.
- **Failed plans stay in the record.** The experiment includes plans that did not work; deleting them is not allowed. The page keeps what the learner decided next.
- **No analysis that picks the best window after the fact.** The windows above are the windows.
- **What would count against the design:** hint use not falling after 6-8 weeks of regular use; first-try accuracy on fresh items flat while accuracy on repeated items rises; no improvement in missed-tactic counts across games despite improved puzzle accuracy (transfer failure); the learner stops setting an aim by week 3 (the self-direction scaffold is not working or is annoying).

## Threats we cannot remove

- **One learner, motivated, who built the thing.** Expectation effects are large; do not generalise.
- **Rating noise and time-control effects.** Rapid online ratings drift for reasons unrelated to study.
- **Other learning.** Andrew may read, watch, or play more in the same period. Keep a one-line weekly log of other chess activity (a field on the Today reflection).
- **Item quality.** Items are machine-checked, not yet human-reviewed (gate G3). A wrong or confusing item lowers first-try accuracy for the wrong reason. The review status is stored with every item.
- **Tool error.** The detectors and engine can mislead; every named pattern is a lead, with a measured precision.

## What we will report, and when

After the first four weeks: usage counts and the independence ledger, with no claim about improvement. After eight weeks: the primary outcome with intervals and the list of plans, including failures. After 20 further games: whether play moved. Whatever happens gets written to `review/` with the raw exports from Settings so someone else can check the arithmetic.
