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
_config.yml                     Site title/description + Jekyll exclude list
styles/main.css                 Design system + page styles
assets/fonts/                   Self-hosted Oswald (variable woff2)
assets/images/                  Generated responsive image variants
assets/images/MANIFEST.md       Source -> variants mapping
_originals/                     Source images (committed; never linked from HTML)
scripts/build-images.js         Generates assets/images/ from _originals/
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
   nav_active: about       # optional; one of home|about|music|live|lyrics|musings|contact
   ---
   ```

2. Below the front matter, write only the page-specific markup — typically a
   `<main>` element. The layout supplies everything else.
3. To link the new page from the primary nav, edit `_includes/header.html`.
   To link it from the footer, edit `_includes/footer.html`.

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

## Deploy

Push to `main`. GitHub Pages builds the Jekyll site automatically — no CI to
configure. The new commit is live within a minute or two.

## Conventions

- **No frameworks**, no Tailwind, no React. Plain HTML + CSS.
- **Jekyll for shared HTML only.** Layouts and includes for header/footer/head.
  No plugins, no data files, no Liquid loops over hardcoded lists.
- **No JS** beyond a tiny mobile-menu toggle in `_includes/script.html`.
- **Self-host fonts.** Never link the Google Fonts CDN (GDPR risk after the
  2022 Munich ruling — relevant for a Berlin-based site).
- **Design tokens** live as CSS variables at the top of `styles/main.css`.
- **Images** always go through `<picture>` + `srcset` for multi-format,
  multi-width delivery, with explicit integer `width` and `height`.
