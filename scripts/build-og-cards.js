#!/usr/bin/env node
// Generate 1200x630 Open Graph share cards into assets/images/ (og-*.jpg).
//
// Cards are the image platforms show when a wildanimalmusic.com link is pasted
// into LinkedIn, Slack, iMessage, Facebook, Discord, etc. The wired-up tags
// live in _includes/meta.html; this script only produces the images.
//
// Two styles, chosen per card in CARDS below:
//   'cinematic' — a darkened band photo (or page wallpaper) under Marie's
//                 hand-lettered title. The home card uses the white "Wild Animal"
//                 logo as the whole title; section pages use their page heading
//                 (recoloured white) plus a small "Wild Animal" signature.
//   'album'     — a square cover floated on a blurred, darkened copy of itself,
//                 so the whole cover stays visible.
//
// Bilingual: cards whose `out` ends in `-de` use the German lettering variant.
// Output is JPEG (broadest scraper support; WebP is still spotty on LinkedIn/
// Facebook). Sources are the full-resolution _originals/. Idempotent: a card is
// rebuilt only when missing, older than its inputs, or older than this script
// (so restyling here regenerates everything); FORCE=1 always rebuilds.

import { stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const ROOT = resolve(dirname(__filename), '..');
const SRC = join(ROOT, '_originals');
const OUT = join(ROOT, 'assets', 'images');
const W = 1200, H = 630;
const FORCE = process.env.FORCE === '1';
const LOGO = 'logo.png'; // white "Wild Animal" wordmark, used as the signature

const CARDS = [
  { out: 'og-default', style: 'cinematic', photo: 'band-photo-home.jpg', title: LOGO },
  { out: 'og-about',     style: 'cinematic', photo: 'band-photo-01.jpg',      title: 'heading-about.png',    white: true, sig: true },
  { out: 'og-about-de',  style: 'cinematic', photo: 'band-photo-01.jpg',      title: 'heading-about-de.png', white: true, sig: true },
  { out: 'og-music',     style: 'cinematic', photo: 'band-photo-02.jpg',      title: 'heading-music.png',    white: true, sig: true },
  { out: 'og-music-de',  style: 'cinematic', photo: 'band-photo-02.jpg',      title: 'heading-music-de.png', white: true, sig: true },
  { out: 'og-live',      style: 'cinematic', photo: 'band-photo-07.jpg',      title: 'heading-live.png',     white: true, sig: true },
  { out: 'og-contact',    style: 'cinematic', photo: 'band-photo-contact.jpg', title: 'heading-contact.png',    white: true, sig: true },
  { out: 'og-contact-de', style: 'cinematic', photo: 'band-photo-contact.jpg', title: 'heading-contact-de.png', white: true, sig: true },
  { out: 'og-lyrics',    style: 'cinematic', photo: 'lyrics-wallpaper.jpg',  title: 'heading-lyrics.png',   white: true, sig: true },
  { out: 'og-musings',   style: 'cinematic', photo: 'musings-wallpaper.jpg', title: 'heading-musings.png',  white: true, sig: true },
  { out: 'og-album-2025', style: 'album', src: 'album-cover-2025.jpg' },
  { out: 'og-album-2024', style: 'album', src: 'album-cover-2024.png' },
  { out: 'og-album-2020', style: 'album', src: 'album-cover-2020.jpg' },
];

const scrim = () => Buffer.from(
  `<svg width="${W}" height="${H}"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">` +
  `<stop offset="0.35" stop-color="black" stop-opacity="0"/><stop offset="1" stop-color="black" stop-opacity="0.7"/>` +
  `</linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/></svg>`);

async function tight(asset, negate = false) {
  let p = sharp(join(SRC, asset)).trim();
  if (negate) p = p.negate({ alpha: false });
  const buf = await p.png().toBuffer();
  return buf;
}
// Fit lettering inside a box (fraction of W x H), preserving aspect, never
// enlarging beyond the frame — guards against tall trims overflowing the canvas.
async function fitBox(buf, wfrac, hfrac) {
  const out = await sharp(buf)
    .resize(Math.round(W * wfrac), Math.round(H * hfrac), { fit: 'inside' })
    .png().toBuffer();
  const m = await sharp(out).metadata();
  return { buf: out, w: m.width, h: m.height };
}

async function cinematic(c) {
  const bg = await sharp(join(SRC, c.photo))
    .resize(W, H, { fit: 'cover', position: sharp.strategy.attention })
    .modulate({ brightness: 0.5 }).toBuffer();
  const layers = [{ input: scrim() }];
  if (c.sig) {
    const title = await fitBox(await tight(c.title, c.white), 0.52, 0.3);
    const sig = await fitBox(await tight(LOGO), 0.28, 0.13);
    const gap = 32, total = title.h + gap + sig.h, y = Math.round((H - total) / 2);
    layers.push({ input: title.buf, left: Math.round((W - title.w) / 2), top: y });
    layers.push({ input: sig.buf, left: Math.round((W - sig.w) / 2), top: y + title.h + gap });
  } else {
    const title = await fitBox(await tight(c.title, c.white), 0.62, 0.4);
    layers.push({ input: title.buf, left: Math.round((W - title.w) / 2), top: Math.round((H - title.h) / 2) });
  }
  return sharp(bg).composite(layers).jpeg({ quality: 88, mozjpeg: true }).toBuffer();
}

async function album(c) {
  const src = join(SRC, c.src);
  const backdrop = sharp(src).resize(W, H, { fit: 'cover', position: 'centre' }).blur(38).modulate({ brightness: 0.55 });
  const cover = await sharp(src).resize(500, 500, { fit: 'inside' }).toBuffer();
  const m = await sharp(cover).metadata();
  return backdrop
    .composite([{ input: cover, left: Math.round((W - m.width) / 2), top: Math.round((H - m.height) / 2) }])
    .jpeg({ quality: 86, mozjpeg: true }).toBuffer();
}

function inputsOf(c) {
  return c.style === 'album' ? [c.src] : [c.photo, c.title, LOGO];
}
async function maxMtime(paths) {
  let mt = (await stat(__filename)).mtimeMs;
  for (const p of paths) mt = Math.max(mt, (await stat(join(SRC, p))).mtimeMs);
  return mt;
}

async function main() {
  let wrote = 0, fresh = 0;
  for (const c of CARDS) {
    const outPath = join(OUT, `${c.out}.jpg`);
    const inputs = inputsOf(c);
    for (const p of inputs) if (!existsSync(join(SRC, p))) throw new Error(`missing source: _originals/${p}`);
    const newest = await maxMtime(inputs);
    if (!FORCE && existsSync(outPath) && (await stat(outPath)).mtimeMs >= newest) {
      fresh++; console.log(`${c.out}.jpg = fresh`); continue;
    }
    const buf = c.style === 'album' ? await album(c) : await cinematic(c);
    await sharp(buf).toFile(outPath);
    wrote++; console.log(`${c.out}.jpg <- ${c.style} (${inputs[0]})`);
  }
  console.log(`\nbuild-og-cards: wrote=${wrote} fresh=${fresh}`);
}

main().catch(err => { console.error(err); process.exit(1); });
