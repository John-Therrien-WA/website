# wildanimalmusic.com

The static website for Wild Animal — an indie pop-rock band based in Berlin.
Plain HTML and CSS, served by GitHub Pages, no framework, no runtime build.

## Develop locally

Just open `index.html` in a browser. There is no dev server, no compile step
for HTML or CSS. Edit a file and reload.

If you prefer a local HTTP server (so paths and `<picture>` resolve exactly
like in production), use any one-liner you like — for example:

```sh
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Project layout

```
index.html                      Homepage
about.html, music.html, ...     One file per page
styles/main.css                 Design system + page styles
assets/fonts/                   Self-hosted Oswald (variable woff2)
assets/images/                  Generated responsive image variants
assets/images/MANIFEST.md       Source -> variants mapping
_originals/                     Source images (committed; never linked from HTML)
scripts/build-images.js         Generates assets/images/ from _originals/
```

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
   examples in `index.html`).
5. Commit both the original and the generated variants.

## Deploy

Push to `main`. GitHub Pages serves the repository root as-is — there is no
CI build to wait on; the new commit is live within a minute or two.

## Conventions

- **No frameworks**, no Tailwind, no React. Plain HTML + CSS.
- **No JS** beyond a tiny mobile-menu toggle inlined at the bottom of each page.
- **Self-host fonts.** Never link the Google Fonts CDN (GDPR risk after the
  2022 Munich ruling — relevant for a Berlin-based site).
- **Design tokens** live as CSS variables at the top of `styles/main.css`.
- **Images** always go through `<picture>` + `srcset` for multi-format,
  multi-width delivery.
