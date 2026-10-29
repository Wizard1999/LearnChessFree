# Human review and feedback

Purpose: let people check lessons and exercises (does it make sense, do the boards match the text, is the answer right) and send what they found back, so it can be read and acted on later. Added 29 October 2026 for the beta on Andrew's own website.

## What a reviewer sees
- Under every lesson: **Review this lesson**: a checklist (made sense, boards matched, answers right, nothing repeated), a difficulty vote, a step number and free text, plus an optional name and role (strong player, teacher, learner, other).
- After every exercise: **Report a problem with this exercise** (wrong answer, board does not match, explanation unclear, too easy or hard, typo, other) and details.
- Settings, **Reviews**: how many are saved, **Download my reviews** (a JSON file), and **Send my reviews** when the site has a feedback address.

Everything is saved on the reviewer's own device first. Nothing leaves it until they press Send or share the downloaded file. The review file records the app build, so a comment can be matched to the version of the lesson it was about.

## Collecting it on your website
1. Put `server/feedback.php` on your host (PHP 7 or later). It accepts the review file as a JSON POST, checks the shape and size, and stores each submission as a separate file in `feedback-inbox/` next to the script, with an `.htaccess` that denies web access. Check on your host that the folder really is not downloadable.
2. In the web build set `"endpoint"` in `feedback-config.json` (it sits next to the app's `index.html`) to the script's URL. If the app is served from a different domain than the script, set `ALLOW_ORIGIN` in the script to the app's origin.
3. Test with one submission of your own.
Without an endpoint the app still works: reviewers download the file and send it to you.

## Reading it
Copy the collected files into `feedback/inbox/` (gitignored, because it holds reviewer names) and run `./tools/.venv/Scripts/python.exe -I tools/ingest_reviews.py`. It writes `feedback/report.md`, ranked by how much feedback each lesson or exercise got. It never changes content or marks anything human-reviewed: that stays your decision (gate G3).

## Privacy and safety notes
- Reviewer names and free text are personal data. The app says nothing is sent until the reviewer presses Send. Keep the folder private and delete files you no longer need.
- The receiver has a size limit but no rate limit or login; for a public beta put it behind your host's usual protection.
- I have not tested the PHP file on a live host.
