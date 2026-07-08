# Content-Security-Policy (delivered via meta tag)

The site has no HTTP-header control (GitHub Pages), so the CSP is a `<meta http-equiv="Content-Security-Policy">` in `_includes/head.html`.

Current policy:

```
default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline';
font-src 'self' data:; object-src 'none'; base-uri 'self'; form-action 'self'
```

Why each non-obvious part is there:

- **`style-src 'unsafe-inline'`** — several Webflow-exported pages (`_pages/projekte.html`, `_pages/offenerbrief-epa-2025.html`) use inline `style=` attributes.
  Removing it breaks their layout; a CSP that breaks styling is worse than none.
- **`font-src 'self' data:`** — `webflow.css` embeds an icon font as a `data:application/x-font-ttf` URI. Without `data:` the font is blocked (was a real
  console error after the CSP first shipped).
- **`img-src 'self' data:`** — same reason (data-URI images in the CSS).

Cannot be enforced via a meta tag (header-only — omitted to avoid console noise / false sense of security): `X-Content-Type-Options`, `X-Frame-Options`, and CSP
`frame-ancestors`. Enforcing those needs a header-capable front (e.g. Cloudflare).

Implication: **do not add inline `<script>`** (including `<script type="application/ld+json">`) — `default-src 'self'` blocks it, and there is no `script-src`
allowance. See [[seo-and-metadata]] for why JSON-LD / `jekyll-seo-tag` were deliberately not adopted.
