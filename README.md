# Grammar on Trial — Bizarre Bites Inc.

A colorful, courtroom-style web game that teaches **sentence structure** for the first five weeks of the Executive Communication at Bizarre Bites Inc. business English course. Players join Bizarre Bites as the new hire and fix broken company communication before it causes a meltdown. The look is inspired by visual-novel courtroom games (think pop-up "OBJECTION!" energy) built entirely with HTML, CSS, and JavaScript. No frameworks, no build step, no images required.

## What it teaches (Weeks 1 to 5)

| Case | Week | Skill |
|------|------|-------|
| 1. The Missing Subject | Week 1 | Subjects, verbs, and complete sentences vs fragments |
| 2. The Runaway Train | Week 2 | Run-ons and comma splices |
| 3. Read the Room | Week 3 | Audience and tone, capitalization, end punctuation |
| 4. Who Said What? | Week 4 | Nouns, pronouns, and clear reference |
| 5. Smooth Operator | Week 5 | Combining sentences and cutting clutter |

Note: Week 5 is built as "sentence combining and conciseness" since it bridges into the Week 6 Subject-Verb Agreement unit. If your Week 5 covered a different topic, the case content in `data.js` is easy to swap.

## Features

- **Three difficulty levels** the player picks at the start: Intern (relaxed), Specialist (standard), and CEO (ruthless, unlocks bonus expert questions and shuffles answer order).
- **Three question types:** multiple choice, drag-and-drop sorting into bins, and drag-to-build sentence assembly.
- **Drag and drop that works on phones and desktops.** It uses pointer events with a tap-to-place fallback, so a student can drag a word or simply tap a word and then tap where it goes.
- **Feedback on every answer option**, matching the course's practice-lab convention.
- **Reputation meter, badges, and promotions** that mirror the course's Intern to CEO progression.
- **Accessibility floor:** keyboard support, visible focus, and reduced-motion support.

## Files

```
index.html    The page shell and all screens
styles.css    The full "Neon Commissary" design system
data.js       All case content (edit this to change questions)
game.js       The game engine
README.md     This file
```

## Run it locally

Just open `index.html` in any modern browser. That is it. (The web fonts load from Google Fonts, so you will want an internet connection for the intended look. The game still runs without it using fallback fonts.)

## Put it on GitHub Pages

1. Create a new repository on GitHub, for example `grammar-on-trial`.
2. Upload all five files to the root of the repository (not inside a folder).
3. In the repository, go to **Settings**, then **Pages**.
4. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
5. Choose the `main` branch and the `/ (root)` folder, then click **Save**.
6. Wait about a minute. Your game will be live at `https://YOUR-USERNAME.github.io/grammar-on-trial/`.

If you prefer the command line:

```bash
git init
git add .
git commit -m "Grammar on Trial: sentence structure game"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/grammar-on-trial.git
git push -u origin main
```

Then enable Pages from Settings as described above.

## Editing the questions

Open `data.js`. Each case is a plain object. To change a question, edit the text. To add a question, copy an existing challenge block and adjust it. The three types are:

- `mc` for multiple choice. Mark exactly one option `correct: true` and give every option a `fb` (feedback) line.
- `sort` for drag-into-bins. Each item lists which `bucket` it belongs in.
- `build` for drag-to-order. The `chips` array is the word bank and the `answer` array is the correct order. Keep the two word lists identical.

Add `hardOnly: true` to any challenge to make it appear only on CEO difficulty.

Built for the Bizarre Bites crew. No exploding eclairs were harmed.
