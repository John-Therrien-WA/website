# CLAUDE.md

Wild Animal band site — Jekyll on GitHub Pages, served at
[wildanimalmusic.com](https://wildanimalmusic.com). Two-person operation:
John (technical, runs Claude Code) and Marie (writes copy via the Claude Code
desktop app; not a coder). `README.md` is the human-facing setup doc; this file
is the LLM-facing operating contract.

## On entering this repo: sync `main` first

**Before anything else (before edits, a preview server, or branching), bring
local `main` up to date.** Marie's merges advance `origin/main` independently, so
working from a stale base risks silently reverting her changes.

```
git fetch origin && git merge --ff-only origin/main
```

If it can't fast-forward (local has diverged or carries unpushed commits) or the
working tree is dirty, stop and surface that rather than forcing anything. Then
identify the operator:

## First: who is this — John or Marie?

**Before anything else in a session, establish who you're working with.** If it
isn't obvious from what they say, ask. The workflow is different for each.

**John** — technical operator. Run as a normal Claude Code session. He directs
each step: whether to start a preview server, whether to commit, whether to
push, whether to open a PR. Don't assume — follow his lead.

**Marie** — writes the words; not a coder. Default to a guided, see-it-as-you-go
flow and shield her from git/terminal mechanics entirely:

1. **Start a local preview automatically.** Run `bundle exec jekyll serve` and
   give her the link: http://localhost:4000. Explain it plainly, e.g. *"This is
   a private preview running on your own computer — only you can see it. The
   real wildanimalmusic.com doesn't change until we publish."* Keep it running
   so she can refresh and watch her edits appear.
2. **Make the change, then tell her which page to look at** and to refresh the
   preview. Describe what changed in plain language, not as a code diff.
3. **When she's happy, publish as a Pull Request — never push to `main`.**
   Create a branch, commit, push the branch, and open a PR (or, if the `gh` CLI
   isn't available, push the branch and give John the compare link
   `https://github.com/John-Therrien-WA/website/compare/main...<branch>?expand=1`).
   Then tell Marie: *"I've sent it to John to review and publish."* John's review
   and merge is what makes it go live.

Translate everything for Marie into three words: **preview**, **review**,
**publish**. She should never need to think about branches, commits, or the
terminal.

## How requests arrive

This repo runs the **Project-as-control-plane / Claude-Code-as-executor**
pattern. Spec drafts originate in the Anthropic Project (project knowledge,
chat with John); Claude Code executes them here. If anything in this file
conflicts with a spec the operator pastes in, ask before editing.

Marie may eventually reach the repo via plain-English GitHub Issues (e.g.
the `@claude` Action) or a CMS at `/admin`. Either way the asks land
against the verb-to-file map below — that map is the contract.

## Repo map

```
_layouts/default.html      Page scaffolding (head, header, footer, script)
_includes/                 head, meta, header, footer, script — iterate _data/nav.yml
_data/nav.yml              Primary nav (label, href, key) — single source of truth
_data/musings.yml          Musings index records — category drives the label + CTA
_data/og_images.yml        Page ref -> 1200x630 social share card (see Social previews)
*.html                     EN page: front matter + <main> body, or a thin {% include %} wrapper
lyrics/, musings/          EN lyric/essay pages — bodies live in _includes/content/ (see Bilingual content)
_includes/content/         Shared lyric/essay bodies, included by the EN and de/ wrappers alike
de/                        German site: lyric/musing wrappers + standalone twins of every other page
styles/main.css            Design system; :root token block at top, then page styles
assets/images/             Generated responsive variants — do not hand-edit
_originals/                Source images, committed; never linked from HTML
scripts/build-images.js    Generates assets/images/ responsive variants from _originals/
scripts/build-og-cards.js  Generates assets/images/og-*.jpg share cards from _originals/
README.md                  Human-facing setup and conventions
Research/                  Background research; excluded from Jekyll build
```

## Build and preview

- `bundle exec jekyll serve` — local preview at http://localhost:4000
- `bundle exec jekyll build --safe` — full build; catches Liquid syntax errors
- `node scripts/build-images.js` — regenerate `assets/images/` responsive variants
- `node scripts/build-og-cards.js` — regenerate the 1200×630 Open Graph share cards
- Push to `main` → GitHub Pages auto-deploys, live within ~1 minute.
  No GitHub Actions, no CI, no plugins beyond the GH Pages allowlist.
- GitHub Pages builds with the `github-pages` gem (**Jekyll 3.10**); local is
  **Jekyll 4.x** (`Gemfile`). A clean local build does not guarantee the deploy —
  keep Liquid to the version-common subset. `.md` docs are excluded from the build
  on purpose: `jekyll-optional-front-matter` runs every Markdown file through
  Liquid, and these docs hold literal tag examples that Jekyll 3.10 would execute.

## Editor verb → file map

This is the prompt-surface contract. When a request comes in, it lands in
one of these files. If a request doesn't fit, ask which entry to extend.

| Request | File(s) |
|---|---|
| Add or rename a primary nav item | `_data/nav.yml` (header + footer iterate it) |
| Edit the homepage news block or hero | `index.html` (+ DE twin `de/index.html`) |
| Edit about-page bio | `about.html` (+ DE twin `de/about.html`) |
| Edit contact text or photo credit | `contact.html` (+ DE twin `de/contact.html`) |
| Add or edit lyrics | `_includes/content/lyrics-<album>.html` (shared body; EN + DE both render it) |
| Add a musing | new `_includes/content/musings-<slug>.html` (shared body) + EN wrapper `musings/<slug>.html` + DE wrapper `de/musings/<slug>.html`; add a record to `_data/musings.yml` (the listing iterates it) |
| Add a release page | new `<slug>.html` at root + DE twin `de/<slug>.html`; link from `music.html` and `de/music.html` |
| Change site title or description | `_config.yml` |
| Change a color, font size, spacing, layout token | `styles/main.css` `:root` block |
| Add or replace an image | drop file in `_originals/`, run `node scripts/build-images.js`, update `assets/images/MANIFEST.md`, reference variants from HTML |
| Change a page's social-share image | `_data/og_images.yml` (map the page's `ref`), or set `image:` in its front matter |
| Add or restyle a share card | `scripts/build-og-cards.js` (`CARDS` list), then run it; record it in `assets/images/MANIFEST.md` |

## Bilingual content (EN / DE)

The site is mirrored in German under `de/`. There are two patterns, and editing
the wrong file is how EN and DE silently diverge (and how content edited in
parallel collides at merge time):

- **Lyrics and musings share one body.** The real content lives in
  `_includes/content/<page>.html`; the EN page (`musings/<slug>.html`) and the DE
  page (`de/musings/<slug>.html`) are thin wrappers that `{% include %}` it.
  **Edit the include, never the wrapper** — one edit updates both languages.
  Chrome (category, dates, read-time, back-link) localizes through the `i18n-*`
  includes off `page.lang`; the body prose is shared (English today, translated
  in place when ready). A DE wrapper carries `lang: de`, a `ref:` matching its
  EN twin, and a `/de/...` permalink, then includes the shared body.
- **Every other page has a standalone German twin** at `de/<name>.html` (`index`,
  `about`, `contact`, `live`, `music`, release pages). No shared source — an EN
  edit does **not** propagate; change both files together.

Never put body content back into a lyrics/musings wrapper: a change to the wrapper
while the include is edited elsewhere is precisely the conflict that collides on
merge.

## Social previews (Open Graph)

Every page emits Open Graph, Twitter Card, and canonical tags via
`_includes/meta.html` (pulled into the head after `head.html`); no page needs
setup to get a valid card. The share image resolves in order: a page's own
`image:` front matter → `_data/og_images.yml` keyed by the page `ref` (German
pages take the entry's `de` card when present, else `en`) → `site.og_image_default`.
Cards are fixed 1200×630 JPEGs built by `scripts/build-og-cards.js` from
`_originals/`: **cinematic** (a darkened band photo/wallpaper under Marie's
hand-lettered title) or **album** (the cover on a blurred backdrop). The tags use
absolute URLs, which is why `_config.yml` sets `url:`. Optional per-page front
matter: `image`, `image_alt`, `og_type`.

## Front matter

Every page starts with this block. `nav_active` must equal a `key` in
`_data/nav.yml` for active-link styling to apply.

```yaml
---
layout: default
title: My Page          # optional; omit on home
description: ...        # optional; falls back to site description
nav_active: about       # optional; must match a _data/nav.yml key
---
```

## Conventions

- Every URL in shared HTML goes through `{{ '/path' | relative_url }}`. No hard-coded leading slashes.
- All colors, type sizes, spacing come from CSS custom properties in `styles/main.css` `:root`. No hex values outside that block.
- Every `<img>` has explicit integer `width` and `height` (prevents CLS).
- Every image is delivered via `<picture>` with a WebP `<source>` and a JPG or PNG fallback `<img>`, at multiple widths.
- Self-host fonts. Never link the Google Fonts CDN (GDPR; the 2022 Munich ruling makes this concrete for a Berlin-based site).

## JS posture

JS today is the mobile-menu toggle in `_includes/script.html`, the
animation web components in `_includes/animation.html`, and the
discography carousel in `_includes/discography-carousel.html` (pulled in
only by `music.html`, not the global layout). CSS-only is the default
for layout, transitions, and sticky-scroll effects (alternating columns,
hover states). JS lands when CSS can't carry the weight — page-load
animations, audio playback, scroll-driven sequencing. Interactive JS
ships as a page-scoped vanilla enhancement in `_includes/`, included only
by the page that needs it and upgrading working static markup (the
carousel is the first such component); folding these into reusable HTML
web components on `connectedCallback`, the way `animation.html` does, is
deferred until a second interactive instance justifies the abstraction.
The default animation primitive is Motion (motion.dev); GSAP +
ScrollTrigger is reserved for true scroll-sequenced work. Audio uses
Howler. CDN imports via `<script type="module">`; no build step. No
SPA frameworks (React, Vue, Svelte), no Tailwind, no Jekyll plugins.

## Visual work — don't fly blind

For any change that affects layout, styling, or imagery: build the site,
render the changed page, and look at the rendered result before declaring
the change done. Markup that parses is not the same as a layout that
works, and a CSS rule that compiles is not the same as a sticky element
that actually sticks. If you can't render the site (Jekyll fails, no
headless browser available, image viewer blocked), stop and report which
step is blocked rather than shipping markup-only changes.

When verifying visual changes, screenshot for layout but extract the
actual DOM text (`page.evaluate(() => document.body.innerText)` or
similar) to verify content. Visually paraphrasing a screenshot can
fabricate text — Claude has previously transcribed "It's Chaos, Drop
me Off" as "It's Chaos Drop No One."

Same trap for position claims (sticky, anchored, frozen): a screenshot
can look right while the element is shifted behind a header or other
overlay. Extract `getBoundingClientRect()` at each scroll position you
assert and verify the number — three iterations of "photo glued to
top" shipped before this caught an 88px offset. Three checks: layout
from PNG, content from DOM, position from rects.

## Git and PRs

- One commit per logical content change. Subject line: what changed and why, not how.
- Commit at each stable point during multi-step work so any step can be reverted.
- Open a PR for non-trivial changes; John reviews and merges.
- When Marie is the operator, **always** publish via PR — never push to `main`
  directly (see "First: who is this"). John may push to `main` when he chooses.
- On contributor PRs, request John as reviewer: if `gh api user --jq .login` is
  not `John-Therrien-WA`, add `--reviewer John-Therrien-WA` to `gh pr create` so
  the PR lands in John's "Review requests" tab and notifies him. (John authors no
  PRs of his own; if he ever does, skip the flag, since GitHub rejects a
  self-review request.)
- If a fix attempt fails twice, stop and propose three approaches before trying again.

## Do not edit

- `_site/` — Jekyll build output.
- `.jekyll-cache/` — local cache.
- Files in `assets/images/` directly — they regenerate from `_originals/`.
- `Research/` — reference material, excluded from build.

## Pointers (load on demand)

- Image-pipeline rationale and edge cases: read header comments in `scripts/build-images.js`.
- Architectural background: `Research/prompt_driven_web_dev_research.md`.
