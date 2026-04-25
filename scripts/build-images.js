#!/usr/bin/env node
// Generate responsive image variants from _originals/ into assets/images/.
//
// Per source: WebP at target widths 400, 800, 1600 (preserve transparency for
// PNG sources) + a same-format fallback at 1600 (PNG -> PNG, JPEG -> JPEG).
// Sources smaller than a target are never upscaled — variants are clamped to
// the source's native width, and the *actual* output width appears in the
// filename. Targets that collapse to the same actual width produce one file.
// Outputs are skipped when already up-to-date with the source (idempotent).

import { readdir, stat, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, extname, basename, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const SRC_DIR = join(ROOT, '_originals');
const OUT_DIR = join(ROOT, 'assets', 'images');
const WEBP_TARGETS = [400, 800, 1600];
const FALLBACK_TARGET = 1600;

const FORMAT_BY_EXT = {
  '.jpg': 'jpeg',
  '.jpeg': 'jpeg',
  '.png': 'png',
};
const EXT_BY_FORMAT = { jpeg: 'jpg', png: 'png', webp: 'webp' };

async function isUpToDate(outPath, srcMtimeMs) {
  if (!existsSync(outPath)) return false;
  const s = await stat(outPath);
  return s.mtimeMs >= srcMtimeMs;
}

function applyFormat(pipeline, format) {
  if (format === 'webp') return pipeline.webp({ quality: 82 });
  if (format === 'jpeg') return pipeline.jpeg({ quality: 85, mozjpeg: true });
  if (format === 'png') return pipeline.png({ compressionLevel: 9 });
  throw new Error(`unknown format: ${format}`);
}

async function buildOne({ srcPath, srcMtimeMs, baseName, width, format, seen }) {
  const ext = EXT_BY_FORMAT[format];
  const outName = `${baseName}-${width}.${ext}`;
  if (seen.has(outName)) return { skipped: 'duplicate', outName };
  seen.add(outName);

  const outPath = join(OUT_DIR, outName);
  if (await isUpToDate(outPath, srcMtimeMs)) {
    return { skipped: 'fresh', outName };
  }

  const pipeline = applyFormat(
    sharp(srcPath).resize({ width, withoutEnlargement: true }),
    format,
  );
  await pipeline.toFile(outPath);
  return { wrote: true, outName };
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const entries = (await readdir(SRC_DIR))
    .filter(n => !n.startsWith('.'))
    .sort();

  let wrote = 0;
  let fresh = 0;
  let dup = 0;

  for (const name of entries) {
    const ext = extname(name).toLowerCase();
    const sourceFormat = FORMAT_BY_EXT[ext];
    if (!sourceFormat) {
      console.warn(`skip (unsupported): ${name}`);
      continue;
    }
    const srcPath = join(SRC_DIR, name);
    const baseName = basename(name, ext);
    const s = await stat(srcPath);
    const meta = await sharp(srcPath).metadata();
    const srcWidth = meta.width ?? 0;

    process.stdout.write(`${name} (${srcWidth}px ${sourceFormat}) ->`);
    const seen = new Set();

    for (const target of WEBP_TARGETS) {
      const w = Math.min(target, srcWidth);
      const r = await buildOne({
        srcPath, srcMtimeMs: s.mtimeMs, baseName,
        width: w, format: 'webp', seen,
      });
      if (r.wrote) { wrote++; process.stdout.write(` ${r.outName}`); }
      else if (r.skipped === 'fresh') { fresh++; process.stdout.write(` ${r.outName}=fresh`); }
      else if (r.skipped === 'duplicate') { dup++; process.stdout.write(` ${r.outName}=dup`); }
    }

    const fw = Math.min(FALLBACK_TARGET, srcWidth);
    const r = await buildOne({
      srcPath, srcMtimeMs: s.mtimeMs, baseName,
      width: fw, format: sourceFormat, seen,
    });
    if (r.wrote) { wrote++; process.stdout.write(` ${r.outName}`); }
    else if (r.skipped === 'fresh') { fresh++; process.stdout.write(` ${r.outName}=fresh`); }
    else if (r.skipped === 'duplicate') { dup++; process.stdout.write(` ${r.outName}=dup`); }

    process.stdout.write('\n');
  }

  console.log(`\nbuild-images: wrote=${wrote} fresh=${fresh} dup=${dup}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
