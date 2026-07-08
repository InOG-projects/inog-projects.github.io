#!/usr/bin/env node
// Runs PurgeCSS against the already-built `_site/` output (recommendation #1).
//
// Must run AFTER `jekyll build` (it needs `_site/**/*.html` to exist) and
// BEFORE html-proofer (so html-proofer validates the purged, production CSS
// that actually ships, not the pre-purge Webflow export).
//
// This intentionally does not touch the source `assets/css/` files — see
// purgecss.config.js `output`, which points at `_site/assets/css/` only.
//
// Usage: node scripts/purge-css.js
'use strict';

const fs = require('fs');
const path = require('path');
const { PurgeCSS } = require('purgecss');

const ROOT = path.resolve(__dirname, '..');
const SITE_DIR = path.join(ROOT, '_site');
const CONFIG_PATH = path.join(ROOT, 'purgecss.config.js');

async function main() {
  if (!fs.existsSync(SITE_DIR)) {
    console.error(`[purge-css] ${SITE_DIR} does not exist — run "jekyll build" first.`);
    process.exitCode = 1;
    return;
  }

  const config = require(CONFIG_PATH);

  const missingCss = config.css.filter(p => !fs.existsSync(path.join(ROOT, p)));
  if (missingCss.length > 0) {
    console.error(`[purge-css] Missing expected CSS file(s) in _site: ${missingCss.join(', ')}`);
    process.exitCode = 1;
    return;
  }

  const beforeSizes = config.css.map(p => ({
    file: p,
    bytes: fs.statSync(path.join(ROOT, p)).size
  }));

  const results = await new PurgeCSS().purge(config);

  const outputDir = path.join(ROOT, config.output);
  fs.mkdirSync(outputDir, { recursive: true });

  for (const result of results) {
    const fileName = path.basename(result.file);
    const outPath = path.join(outputDir, fileName);
    fs.writeFileSync(outPath, result.css);
  }

  console.log('[purge-css] Purged CSS in _site/assets/css:');
  for (const { file, bytes: before } of beforeSizes) {
    const after = fs.statSync(path.join(ROOT, file)).size;
    const pct = before > 0 ? (((before - after) / before) * 100).toFixed(1) : '0.0';
    console.log(`  ${file}: ${before} -> ${after} bytes (-${pct}%)`);
  }
}

main().catch(err => {
  console.error('[purge-css] Failed:', err);
  process.exitCode = 1;
});
