#!/usr/bin/env node
// Generate 1200x630 Open Graph share cards into assets/images/ (og-*.jpg).
//
// Cards are the image platforms show when a wildanimalmusic.com link is pasted
// into LinkedIn, Slack, iMessage, Facebook, Discord, etc. The wired-up tags
// live in _includes/meta.html; this script only produces the images.
//
// Two styles, chosen per source in CARDS below:
//   'photo' — landscape source cover-cropped to 1.91:1 using sharp's attention
//             gravity, so faces/subjects survive the crop. For band photos and
//             page wallpapers.
//   'album' — square cover composited onto a blurred, darkened copy of itself,
//             keeping the whole cover visible (letterbox-free). For album art.
//
// Output is JPEG (broadest scraper support; WebP is still spotty on LinkedIn/
// Facebook). Sources are the full-resolution _originals/. Idempotent: a card is
// rebuilt only when missing or older than its source (or when FORCE=1).

import { stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const SRC_DIR = join(ROOT, '_originals');
const OUT_DIR = join(ROOT, 'assets', 'images');
const W = 1200, H = 630;
const FORCE = process.env.FORCE === '1';

// out: card name (assets/images/<out>.jpg) · src: file in _originals/ · style
const CARDS = [
  { out: 'og-default',           src: 'band-photo-home.jpg',     style: 'photo' },
  { out: 'og-about',             src: 'band-photo-01.jpg',       style: 'photo' },
  { out: 'og-live',              src: 'band-photo-07.jpg',       style: 'photo' },
  { out: 'og-lyrics',            src: 'lyrics-wallpaper.jpg',     style: 'photo' },
  { out: 'og-musings',           src: 'musings-wallpaper.jpg',    style: 'photo' },
  { out: 'og-album-2025',        src: 'album-cover-2025.jpg',     style: 'album' },
  { out: 'og-album-2024',        src: 'album-cover-2024.png',     style: 'album' },
  { out: 'og-album-2020',        src: 'album-cover-2020.jpg',     style: 'album' },
];

async function isFresh(outPath, srcMtimeMs) {
  if (FORCE || !existsSync(outPath)) return false;
  const s = await stat(outPath);
  return s.mtimeMs >= srcMtimeMs;
}

function toJpeg(pipeline) {
  return pipeline.jpeg({ quality: 86, mozjpeg: true });
}

async function photoCard(srcPath) {
  return toJpeg(
    sharp(srcPath).resize(W, H, { fit: 'cover', position: sharp.strategy.attention }),
  ).toBuffer();
}

async function albumCard(srcPath) {
  // Backdrop: the cover, cropped to fill, heavily blurred and dimmed.
  const backdrop = sharp(srcPath)
    .resize(W, H, { fit: 'cover', position: 'centre' })
    .blur(38)
    .modulate({ brightness: 0.55 });
  // Foreground: the full cover, fit inside a centred square, kept sharp.
  const FG = 500;
  const cover = await sharp(srcPath)
    .resize(FG, FG, { fit: 'inside', withoutEnlargement: false })
    .toBuffer();
  const meta = await sharp(cover).metadata();
  const left = Math.round((W - (meta.width ?? FG)) / 2);
  const top = Math.round((H - (meta.height ?? FG)) / 2);
  return toJpeg(backdrop.composite([{ input: cover, left, top }])).toBuffer();
}

async function main() {
  let wrote = 0, fresh = 0;
  for (const { out, src, style } of CARDS) {
    const srcPath = join(SRC_DIR, src);
    if (!existsSync(srcPath)) throw new Error(`missing source: _originals/${src}`);
    const outPath = join(OUT_DIR, `${out}.jpg`);
    const s = await stat(srcPath);
    if (await isFresh(outPath, s.mtimeMs)) {
      fresh++; console.log(`${out}.jpg = fresh`); continue;
    }
    const buf = style === 'album' ? await albumCard(srcPath) : await photoCard(srcPath);
    await sharp(buf).toFile(outPath);
    wrote++; console.log(`${out}.jpg <- ${src} (${style})`);
  }
  console.log(`\nbuild-og-cards: wrote=${wrote} fresh=${fresh}`);
}

main().catch(err => { console.error(err); process.exit(1); });
