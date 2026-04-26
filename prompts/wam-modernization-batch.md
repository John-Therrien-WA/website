---
max_turns: 150
effort: xhigh
---

# 00-visual-feedback-check
effort: max

## What and Why
Before any visual work in this batch runs, verify you can build the site,
render a page in a headless browser, and view the resulting screenshot.
Every later step in this batch ships visual changes; without working
visual feedback, those steps will fly blind and produce buggy results
(see "Visual work" in `CLAUDE.md`). This step is the gate that keeps
the rest of the batch viable.

Discover or install a working toolchain. The recommended path is
Playwright with bundled Chromium: `npx playwright install chromium`
(no global install, just downloads a project-local browser). Alternatives
if Playwright is blocked: Puppeteer (`npm install --save-dev puppeteer`,
which also downloads Chromium), or system Chrome in headless mode
(macOS: `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome
--headless --screenshot=...`).

This step must not give up. If `bundle` is missing, install bundler. If
Jekyll build fails, fix the configuration. If Playwright install fails,
read the error, debug it (likely cause: node version, network proxy,
missing system libraries), try an alternative. The success criterion is
producing and viewing two PNGs — not exiting cleanly with a report
saying it didn't work. Every later step in this batch ships visual
changes that depend on this gate functioning. Spend the turns needed.

## Constraints
- No source-file edits. This is a read-only verification of the rendering
  pipeline. The only writes are the screenshots, the report file, and any
  package-manager artifacts (`package.json`, `package-lock.json`,
  `node_modules/` if Playwright/Puppeteer is installed).
- The check must produce real PNGs and you must view them with whatever
  image-viewing capability you have. "I assume the screenshot worked" is
  not verification.

## Done When
- `bundle exec jekyll build --safe` runs to completion (note any warnings).
- A local Jekyll server (or built `_site/` served any other way) is reachable.
- Screenshots of `index.html` and `magisches-theater.html` are produced at
  desktop width (~1280px) and saved as `/tmp/wa-home.png` and `/tmp/wa-mt.png`.
- You view both PNGs and write 1–2 sentences each describing what's on screen.
- A short report is written to `prompts/visual-feedback-report.md` listing the
  exact tooling that worked (commands, versions) so future batch steps can
  reuse the same approach.
- Git commit: "Add visual-feedback verification report".

---

# 01-quick-bug-fixes
depends_on: 00-visual-feedback-check

## What and Why
Two visible bugs Marie reported.

(1) **Header logo invisible on every page.** `_originals/logo.png` is white
ink on transparent; the header background is white. Marie's intent is to
use the black wordmark from the homepage hero (`_originals/wordmark-home.png`)
as the header logo — that's what she meant by "the black version is large
on the homepage." Try the wordmark first: swap the source and the
`width`/`height` attributes in `_includes/header.html` to match the wordmark's
aspect ratio (~1312×669, so ~2:1), and adjust `.site-logo img` sizing in
`styles/main.css` so the wordmark reads cleanly at header height. If the
wordmark is illegible at header size, fall back to keeping the existing
`logo.png` source but adding `filter: invert(1) brightness(0)` on
`.site-logo img` (turns white ink into black). Note the call you made in
the commit message.

(2) **Magisches Theater background alternation breaks.** In
`magisches-theater.html`, "Thank you!" and "The Singles" are both
`section--alt` consecutively, so the green background runs through both.
Change "The Singles" to `section` so alternation continues.

[depth: refactor along the way — adjust header sizing if the new logo's
aspect ratio demands it. Don't restructure either page beyond what the
fix requires.]

## Constraints
- Visual confirmation required (`CLAUDE.md` → "Visual work — don't fly
  blind"). Render and look at the page after each change. Verify the logo
  is visibly present on at least three pages: `index.html`,
  `magisches-theater.html`, and one lyrics or musings page.

## Done When
- Header logo visibly present and legible across all sampled pages.
- Magisches Theater background alternation reads cleanly all the way to
  the bottom.
- Git commits, one per fix: "Fix header logo visibility" and "Fix MT
  background alternation".

---

# 02-mt-singles-redesign
depends_on: 01-quick-bug-fixes

## What and Why
Restructure "The Singles" section of `magisches-theater.html` as a
magazine-style alternating-column layout. Marie's spec: photo right /
text left for the first single, photo left / text right for the second,
alternating across all five (Green Fields, Jungle, Silence, It's Chaos
Drop me Off, Shuree).

Single cover assets do not exist in `_originals/` yet. Render a
clearly-labeled placeholder block in the photo column for each single —
square aspect, sized to match what a real cover would occupy, captioned
"Single cover — Green Fields" and similar. When Marie supplies covers
later, the swap is `<div class="single-placeholder">` →
`<picture>` per single, with files dropped into `_originals/` as
`mt-single-green-fields.png` etc.

Mobile (<768px) collapses to a single column with the placeholder/photo
above the text on every single.

The existing prose on each single must not change.

[depth: refactor along the way — extract a clean `.single--magazine`
class block in `styles/main.css`. The page's bg-alternation fix from the
previous step stays in place.]

## Constraints
- Visual confirmation required (`CLAUDE.md` → "Visual work"). Screenshot
  the page at 1280px, 768px, and 375px widths and verify all three.
- Don't touch the design tokens in `styles/main.css` `:root`.
- The Singles section background remains `section` (white), per the prior
  fix.

## Done When
- Five singles render as alternating-side photo/text columns at >=1024px.
- Single column at <768px.
- Three screenshots (desktop / tablet / mobile) saved and viewed.
- Git commit: "MT singles: alternating-column magazine layout with
  placeholders".

---

# 03-homepage-hero-parallax
depends_on: 02-mt-singles-redesign

## What and Why
Marie wants the homepage hero photo bigger and a parallax/sticky-scroll
feel. Implement with pure CSS — no JS. The cleanest pattern: convert the
existing 2-column hero in `index.html` to a CSS Grid where one column has
`position: sticky; top: var(--header-height)` and the other scrolls
normally. Pick which column is sticky based on what reads better
visually. The photo column should be visibly taller than before (use the
1600-width variant of `band-photo-home`).

[depth: refactor along the way — the existing `.hero__layout` is flex; it
likely needs to become a grid for sticky to work cleanly. Restructure as
needed.]

## Constraints
- Visual confirmation required (`CLAUDE.md` → "Visual work"). Screenshot
  at 1280px, 768px, and 375px widths. Also capture a mid-scroll desktop
  screenshot to verify the sticky/parallax effect is actually visible
  (i.e. one column has moved while the other stayed put).
- Mobile collapses to a single column with photo on top, text below — no
  stickiness on mobile (sticky on small viewports feels broken).
- The wordmark, tagline, intro paragraphs, and Beethoven quote must all
  remain visible above the fold at desktop width.
- Don't break the news section ("New Album Out Now") below the hero, or
  the alternating-section background pattern.
- Don't touch the design tokens in `styles/main.css` `:root`.

## Done When
- Homepage hero photo visibly larger than before.
- Scrolling produces a clear sticky/parallax effect at desktop.
- Four screenshots verified (3 widths + 1 mid-scroll desktop).
- Git commit: "Homepage hero: sticky-scroll parallax".

---

# 04-about-page-parallax
depends_on: 03-homepage-hero-parallax

## What and Why
Rebuild the About page on the lemon-aid.de "ein Saftladen aus St. Pauli"
pattern (https://lemon-aid.de/uber-uns/) — a 2-column layout where the
text column is sticky and the image column scrolls past. Currently
`about.html` has a 9-photo grid (`.about-gallery`) that Marie wants
replaced with this pattern.

Layout at >=1024px: two-column CSS Grid. Right column holds the headings
("About", "Band Biography") and paragraphs, with `position: sticky;
top: var(--header-height)`. Left column is a vertical stack of all 9
existing band photos (band-photo-01 through band-photo-10, skipping 08),
each at near-full column width, in normal flow. As the user scrolls,
photos glide past while the text stays parked.

At <768px, collapse to single column — text and photos interleave in
normal flow, no stickiness (sticky on a small viewport feels broken).

The About prose must not change. The 9 photos stay; only their layout
changes.

[depth: root-and-branch on this page — the existing `.about-gallery`
grid is a different pattern entirely. Replace, don't retrofit.]

## Constraints
- Visual confirmation required (`CLAUDE.md` → "Visual work"). Screenshot
  the page at 1280px, 768px, and 375px. At desktop, also capture a
  mid-scroll screenshot to verify the sticky behavior is visible.
- Photos in the scrolling column should read as hero-sized, not
  thumbnails.
- No layout shift; no overlap with the sticky site header; smooth scroll.
- Don't touch the design tokens in `styles/main.css` `:root`.

## Done When
- About page renders sticky-text-right + scrolling-images-left at >=1024px.
- Single-column stacked layout at <768px.
- Four screenshots verified (3 widths + 1 mid-scroll desktop).
- Git commit: "About page: sticky-text + scrolling-images parallax".
