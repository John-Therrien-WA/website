# wildanimalmusic.com

The static website for Wild Animal — an indie pop-rock band based in Berlin.
Plain HTML and CSS, served by GitHub Pages. Shared markup is centralized via
Jekyll layouts and includes (Jekyll is the GitHub Pages default — no separate
build step, no GitHub Actions, no extra tooling).

## Project layout

```
index.html, about.html, ...     One file per page: front matter + <main> body
_layouts/default.html           Page scaffolding (doctype, head, header, footer, script)
_includes/head.html             <head> contents (title, description, font, CSS)
_includes/header.html           Site header with logo + primary nav
_includes/footer.html           Social row, footer nav, legal line
_includes/script.html           Mobile-menu toggle (one place, used everywhere)
_includes/meta.html             Open Graph / Twitter / canonical tags (link previews)
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

## Develop locally

**Option A — push and view the live URL.** GitHub Pages rebuilds in under a
minute. For small content edits this is often the fastest loop.

**Option B — run Jekyll locally** so Liquid tags and includes resolve exactly
like in production:

```sh
gem install bundler jekyll
bundle exec jekyll serve
# then visit http://localhost:4000
```

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
  (one entry covers the English page and its German twin), or set
  `image: /assets/images/<card>.jpg` in the page's front matter.
- **Add or restyle a card** — edit the `CARDS` list in
  `scripts/build-og-cards.js`, then run:

  ```sh
  node scripts/build-og-cards.js
  ```

  Cards are built from `_originals/`: band photos and wallpapers get a
  cropped fill, album covers get centered on a blurred backdrop. Record new
  cards in `assets/images/MANIFEST.md` and commit them.

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
- **No JS** beyond a tiny mobile-menu toggle in `_includes/script.html`.
- **Self-host fonts.** Never link the Google Fonts CDN (GDPR risk after the
  2022 Munich ruling — relevant for a Berlin-based site).
- **Design tokens** live as CSS variables at the top of `styles/main.css`.
- **Images** always go through `<picture>` + `srcset` for multi-format,
  multi-width delivery, with explicit integer `width` and `height`.
