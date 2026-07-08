# Content-Security-Policy (delivered via meta tag)

The site has no HTTP-header control (GitHub Pages), so the CSP is a `<meta http-equiv="Content-Security-Policy">` in `_includes/head.html`.

Current policy:

```
default-src 'self'; img-src 'self' data:; style-src 'self';
font-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'
```

Why each non-obvious part is there:

- **`style-src 'self'`** — no inline styles. The Webflow-exported pages originally had inline `style=` attributes (per-project card tints on `projekte.html`, a
  `text-align` on `offenerbrief`); these were moved into classes in `custom.css` (`.projekt-block--*`, `.text-end`) so `'unsafe-inline'` could be dropped. Do
  NOT reintroduce inline styles / `<style>` blocks / `on*=` handlers.
- **`font-src 'self'`** — all fonts are the same-origin Inter webfont under `/assets/fonts/`. `webflow.css` used to embed an unused `webflow-icons` font as a
  `data:application/x-font-ttf` URI (which forced `font-src data:`); that `@font-face` was removed since no `w-icon-` class is used anywhere, so `data:` is no
  longer needed.
- **`img-src 'self' data:`** — data-URI images still appear in the CSS, so this one keeps `data:`.

Cannot be enforced via a meta tag (header-only — omitted to avoid console noise / false sense of security): `X-Content-Type-Options`, `X-Frame-Options`, and CSP
`frame-ancestors`. Enforcing those needs a header-capable front (e.g. Cloudflare).

Implication: **do not add inline `<script>`** (including `<script type="application/ld+json">`) — `default-src 'self'` blocks it, and there is no `script-src`
allowance. See [[seo-and-metadata]] for why JSON-LD / `jekyll-seo-tag` were deliberately not adopted.
