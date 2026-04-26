# Visual feedback verification report

Date: 2026-04-26
Verified by: Claude Code (cc-batch-runner, batch 0)

This report records the toolchain that successfully built the site, served it,
captured desktop-width screenshots, and surfaced them for inspection. Future
batch steps that ship visual changes should reuse this exact path so they
are not flying blind.

## What worked

| Stage | Command | Notes |
|---|---|---|
| Jekyll build | `bundle exec jekyll build --safe` | 0.293 s, no warnings; bundler 4.0.10, Ruby per `.ruby-version` |
| Local serve | `bundle exec jekyll serve --safe --host 127.0.0.1 --port 4000 --skip-initial-build` | Started in background; `curl http://127.0.0.1:4000/` returned 200 |
| Headless browser | `npx playwright install chromium` then `npm install --save-dev playwright` | Playwright 1.59.1, Chrome Headless Shell 147.0.7727.15 (mac arm64) |
| Screenshotting | `node scripts/screenshot.mjs` | Custom script using `chromium.launch()`; viewport `{width:1280,height:900}`, `fullPage:true` |
| Image viewing | `Read` tool on the PNG path | Confirmed PNGs are 1280 px wide and visually correct |

## Reusable artifacts

- `scripts/screenshot.mjs` — Playwright snippet hard-coding the two target URLs.
  Future steps can copy it and edit the `targets` array, or parametrize it via
  argv if the batch needs more pages.
- `package.json` now has `playwright` as a devDependency. `node_modules/playwright`
  and the user-level Chromium cache at `~/Library/Caches/ms-playwright/` are
  ready to reuse.

## Screenshots produced

- `/tmp/wa-home.png` — 1280×2139, 757 KB.
  Homepage as expected: nav with HOME active, band photo + handwritten "Wild
  Animal" wordmark hero, "INDIE-POP-ROCK FOR PHILOSOPHICAL SOULS" tagline,
  welcome copy, Beethoven pull-quote, green-tinted "New Album Out Now" news
  block referencing the December 17 Berlin release concert, slate footer.
- `/tmp/wa-mt.png` — 1280×6110, 739 KB.
  `magisches-theater.html` as expected: title, embedded player widget, Tracks
  list, Credits, Thank You note, then the per-single entries (Green Fields,
  Jungle, Silence, It's Chaos Drop No One, Sturm) with descriptive blurbs.
  Full page is long; `fullPage:true` captured the whole column.

## Recipe for future batch steps

1. `bundle exec jekyll build --safe` — fail the step on any warning that wasn't
   already present here.
2. Start `bundle exec jekyll serve --safe --skip-initial-build` in the
   background (or serve `_site/` with any static server on port 4000).
3. Run a Playwright script modeled on `scripts/screenshot.mjs`. Use viewport
   1280×900 for desktop and 390×844 for mobile if mobile is in scope.
4. View each PNG with the `Read` tool and write a one-line description. If the
   description does not match the intent of the change, the step is not done.
5. Tear down the Jekyll server (`lsof -i :4000 -t | xargs kill`) before
   handing off, so the next step can start fresh.

## Gotchas observed

- `npx playwright install chromium` downloads ~93 MB to a user-level cache and
  takes ~30 s on first run; subsequent runs are instant.
- Running Jekyll's serve in the foreground inside a `Bash` background task
  exits the wrapper but leaves the Ruby process alive — verify with
  `lsof -i :4000 -t`. The PID can be killed directly when done.
- `fullPage:true` produces tall PNGs (6110 px on the album page). That's fine
  for human review but be mindful if future steps pipe screenshots into a
  vision step with size limits — capture the viewport instead.
