# SEO and metadata decisions

## German-only

The site is German-only. The `og:locale:alternate en_US` signal was removed and the `<html lang>` fallback set to `de` — do not re-introduce English alternate
signals or `hreflang` unless real English content is added. (One known inconsistency still open: `_pages/404.md` `title`/`excerpt` are English.)

## No JSON-LD / no jekyll-seo-tag

Structured data (`Organization` JSON-LD) and the `jekyll-seo-tag` plugin were **deliberately not adopted** because both require an inline
`<script type="application/ld+json">`, which the strict CSP (`default-src 'self'`, no `script-src`) blocks. The SEO payoff for a small brochure site did not
justify weakening the CSP with `'unsafe-inline'` or a brittle script hash. See [[csp-policy]]. Reopen only if the CSP is relaxed.

## What is in `_includes/head.html`

Hand-written (not plugin-generated): title, OG/Twitter tags, `<meta name=description>`, canonical (`<link rel="canonical">`), and feed autodiscovery via
`{% feed_meta %}` (jekyll-feed). The default social-share image is driven by `site.og_image_default` (empty by default → no image tag emitted, no broken
reference); per-page override via the `og_image` front-matter key.
