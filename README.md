# wildanimalmusic.com

The static website for Wild Animal — an indie pop-rock band based in Berlin.
Plain HTML and CSS, served by GitHub Pages. Shared markup is centralized via
Jekyll layouts and includes (Jekyll is the GitHub Pages default — no separate
site build step and no CI; the only local tooling is Node scripts that
pre-generate images). The site is bilingual: English at the root, German under
`/de/`.

## Project layout

```
index.html, about.html, ...     One file per page: front matter + <main> body
de/                             German mirror of the site, served under /de/
_layouts/default.html           Page scaffolding (doctype, head, header, footer, script)
_includes/head.html             <head> contents (title, description, font, CSS)
_includes/header.html           Site header with logo + primary nav
_includes/footer.html           Social row, footer nav, legal line
_includes/script.html           Mobile-menu toggle (one place, used everywhere)
_includes/meta.html             Open Graph / Twitter / canonical tags (link previews)
_includes/content/              Shared lyric & essay bodies, rendered by EN and de/ pages
_data/nav.yml                   Primary nav items (label, href, key) — looped in header/footer
_data/og_images.yml             Page ref -> social share card (link previews)
_config.yml                     Site title/description + Jekyll exclude list
styles/main.css                 Design system + page styles
assets/fonts/                   Self-hosted Oswald (variable woff2)
assets/images/                  Generated responsive variants + og-*.jpg share cards
assets/images/MANIFEST.md       Source -> variants mapping + share-card list
_originals/                     Source images (committed; never linked from HTML)
scripts/build-images.js         Generates assets/images/ from _originals/
scripts/build-og-cards.js       Generates assets/images/og-*.jpg share cards from _originals/
```

Source-of-truth for shared HTML lives in `_layouts/` and `_includes/`. Pages
own only their `<main>` body plus a small front-matter block.

## Add a new page

1. Create `<slug>.html` at the repo root with front matter:

   ```yaml
   ---
   layout: default
   title: My Page          # optional; omit on the home page
   description: ...        # optional; falls back to site default
   nav_active: about       # optional; must match a `key` in _data/nav.yml
   ---
   ```

2. Below the front matter, write only the page-specific markup — typically a
   `<main>` element. The layout supplies everything else.
3. To link the new page from the primary nav, add an entry to `_data/nav.yml`:

   ```yaml
   - label: About
     href: /about.html
     key: about
   ```

   The header and footer iterate over this list, so adding the entry links the
   page in both places. The page's `nav_active` front-matter value must equal
   the `key` of its `nav.yml` entry for the active-link styling to apply.

4. For a German version, add a `de/<slug>.html` twin — see **Bilingual** below.

## Bilingual (EN / DE)

The site is mirrored in German under `de/`. Lyric and musing **bodies** are
shared: the content lives in `_includes/content/<page>.html`, and both the
English page (`musings/<slug>.html`) and its German twin
(`de/musings/<slug>.html`) are thin wrappers that include it — so edit the
include, not the wrapper, and one change updates both languages. Every other
page (`about`, `music`, …) has a standalone German twin at `de/<name>.html` that
must be edited alongside the English one. UI strings localize via the `i18n-*`
includes off each page's `lang`; body prose is shared (English today).

## Develop locally

**Option A — push and view the live URL.** GitHub Pages rebuilds in under a
minute. For small content edits this is often the fastest loop.

**Option B — run Jekyll locally** so Liquid tags and includes resolve:

```sh
bundle install                 # first time only
bundle exec jekyll serve
# then visit http://localhost:4000
```

Local uses the Jekyll pinned in the `Gemfile` (4.x); GitHub Pages builds with an
older Jekyll (3.10) via the `github-pages` gem. They're close but not identical,
so a clean local build isn't a guarantee — keep Liquid to widely-supported
features, and note that Markdown docs (`README.md`, `CLAUDE.md`) are excluded
from the build because that older Jekyll would try to execute Liquid examples in
them.

You can also open a built page directly in a browser, but Liquid tags
(`{% include %}`, `{{ page.title }}`) won't render — you'll see raw template
syntax. Use Jekyll for any structural work.

## Add or update images

1. Drop the source file into `_originals/` (PNG keeps transparency, JPEG for photos).
2. Run the image build:

   ```sh
   node scripts/build-images.js
   ```

   This writes WebP at 400/800/1600 plus a same-format fallback at 1600 into
   `assets/images/`. Sources smaller than a target are never upscaled — the
   actual output width appears in each filename.

3. Update `assets/images/MANIFEST.md` so the source <-> variants mapping stays
   accurate.
4. Reference the variants from HTML using `<picture>` + `srcset` (see existing
   examples in `index.html`). Always set explicit integer `width` and `height`
   on the `<img>` to reserve layout and prevent CLS.
5. Commit both the original and the generated variants.

## Social preview cards (Open Graph)

When a link is shared on LinkedIn, Slack, iMessage, Facebook, etc., the site
shows a 1200×630 preview card with an image, title, and blurb. This is
automatic: every page emits the right tags via `_includes/meta.html` and falls
back to a default card, so a new page needs no setup. The tags rely on `url:`
in `_config.yml` to be absolute.

To change which card a page uses:

- **Pick an existing card** — map the page's `ref` in `_data/og_images.yml`
  (German pages use the entry's `de` card when present, else the English one),
  or set `image: /assets/images/<card>.jpg` in the page's front matter.
- **Add or restyle a card** — edit the `CARDS` list in
  `scripts/build-og-cards.js`, then run:

  ```sh
  node scripts/build-og-cards.js
  ```

  Two styles: **cinematic** (a darkened band photo or wallpaper under the band's
  hand-lettered title — the home card uses the "Wild Animal" wordmark, section
  pages their page heading plus a small signature) and **album** (the square
  cover floated on a blurred backdrop). German pages get the `-de` lettering
  variant. Record new cards in `assets/images/MANIFEST.md` and commit them.

## Deploy

Push to `main`. GitHub Pages builds the Jekyll site automatically — no CI to
configure. The new commit is live within a minute or two.

## Conventions

- **No frameworks**, no Tailwind, no React. Plain HTML + CSS.
- **Jekyll for shared HTML only.** Layouts and includes for header/footer/head.
  Small `_data/*.yml` files are welcome where they remove duplication — e.g.
  `_data/nav.yml` is the single source of truth for the primary nav, and the
  header and footer iterate over it with a Liquid `for` loop. Reach for a data
  file when the same list would otherwise be hand-maintained in two places.
  No plugins.
- **JS is light and progressive.** Page-scoped vanilla includes: the mobile-menu
  toggle (`_includes/script.html`), page-load animations (Motion), background
  audio (Howler), and the music page's discography carousel. No SPA frameworks.
- **Self-host fonts.** Never link the Google Fonts CDN (GDPR risk after the
  2022 Munich ruling — relevant for a Berlin-based site).
- **Design tokens** live as CSS variables at the top of `styles/main.css`.
- **Images** always go through `<picture>` + `srcset` for multi-format,
  multi-width delivery, with explicit integer `width` and `height`.
