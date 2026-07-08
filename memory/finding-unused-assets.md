# Finding unused assets (images, PDFs, CSS classes)

This is a Webflow export, so `assets/` carries a lot of dead scaffolding. When checking whether an asset is really unused, grep the **built `_site`** (the
ground truth of what ships), not just the source — and scan HTML **plus CSS plus `site.webmanifest`**, because references live in all three.

```bash
bundle exec jekyll build >/dev/null
grep -rhoE '[A-Za-z0-9._%ÖÄÜ+-]+\.(png|jpg|jpeg|svg|webp|gif)' _site \
  --include='*.html' --include='*.css' --include='*.webmanifest' | sort -u
```

Two false-positive traps that made me nearly flag _used_ files as orphans:

- **`srcset` responsive variants.** Webflow images come as `foo.png` plus `foo-p-500.png` / `-p-800` / `-p-1080`. Pages reference the variants via `srcset`,
  often NOT the full-size original. (Real case: the index hero uses only the `InOEG_IRIS-One-Pager_Hero-p-*` variants; the 2 MB full-size
  `InOEG_IRIS-One-Pager_Hero.png` is never referenced and never ships. So the earlier "optimise the 2 MB hero" idea was moot — PurgeCSS/the build already never
  emit it.)
- **URL-encoded filenames.** PDFs/images with spaces are linked with `%20` (e.g. `230829_inoeg_Halbzeit Ampel.pdf` →
  `/documents/230829_inoeg_Halbzeit%20Ampel.pdf`). A plain `grep -F "Halbzeit Ampel.pdf"` misses the link. Cross-check by counting: `<pdf links in page>` vs
  `<pdf files on disk>` — all 13 documents/ PDFs are in fact linked in `veroeffentlichungen.md`.

Also note: dead Webflow CSS (unused `w-icon-*`, `w-lightbox-*` rules and their embedded `data:` fonts/images) is stripped from production by PurgeCSS, so it
never reaches users even when left in the source `assets/css/`.

Decision on file (2026-07): the maintainer chose NOT to delete orphaned image files despite ~4 MB being unused. Don't propose asset deletion again unless asked.
