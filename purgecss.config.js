// PurgeCSS configuration (recommendation #1: strip unused Webflow CSS).
//
// This runs AFTER `jekyll build`, against the BUILT `_site/` output — never
// against the source `assets/css/`. It scans every rendered `_site/**/*.html`
// page as "content" and rewrites the CSS files under `_site/assets/css/` in
// place. Source files in `assets/css/` are never touched, so `jekyll build`
// always starts from the original, un-purged Webflow export.
//
// Usage (see scripts/purge-css.js for the actual CLI invocation used in CI):
//   npx purgecss --config purgecss.config.js
//
// The `content`/`css` globs below are relative to the repo root, matching
// how both the local `npm run` scripts and CI invoke this config.
module.exports = {
  content: ['_site/**/*.html'],
  css: ['_site/assets/css/webflow.css', '_site/assets/css/inog-website.webflow.css', '_site/assets/css/normalize.css', '_site/assets/css/custom.css'],
  output: '_site/assets/css/',

  // Webflow (and this Jekyll theme) reference a number of classes that never
  // appear verbatim in static HTML markup, but are added/toggled at runtime
  // or only rendered conditionally by Liquid. PurgeCSS only sees literal
  // strings in the scanned content, so anything applied via the
  // `#menu-toggle:checked ~ ...` sibling-checkbox pattern, or via a `{% if %}`
  // that may or may not emit a class on a given build, must be safelisted
  // explicitly. Being conservative here is intentional: an over-purge is a
  // silent breakage (missing style, not a build error), while a class that
  // survives unnecessarily only costs a few bytes.
  safelist: {
    standard: [
      // `header.html` toggles this class onto the current nav <a> via Liquid
      // (`{% if current[1] == 'projekte' %}current{% endif %}`, etc.). Only
      // one page renders it as HTML on any given build (whichever page is
      // "active"), so a purge run against a single page could see the class
      // used but a run against another page might not — keep it unconditional
      // rather than relying on scan order. (Note: as of this writing no
      // Webflow/custom CSS rule actually targets `.current`, so this entry is
      // a no-op today but is cheap insurance against a future style being
      // added for it.)
      'current',

      // `menu-button-container` / `menu-button` / `menu` / `top-nav` are the
      // literal classes on the mobile-nav markup in `_includes/header.html`.
      // They DO appear in the static HTML, so PurgeCSS's content scan should
      // already keep them — listed here anyway as a belt-and-braces guard
      // since the corresponding CSS rules are reached only via the
      // `#menu-toggle:checked + .menu-button-container ...` and
      // `#menu-toggle:checked ~ .menu li` sibling-combinator selectors in
      // inog-website.webflow.css (lines ~81-116), i.e. the visual effect only
      // exists when the checkbox is `:checked`, a state PurgeCSS's static
      // HTML/CSS analysis cannot itself reason about.
      'menu-button-container',
      'menu-button',
      'menu',
      'top-nav'
    ],

    // `greedy` matches classes anywhere in the selector (as substrings via
    // the given patterns), which is required for Webflow's own runtime
    // state/utility classes: these are added/removed by Webflow's exported
    // interaction JS (dropdown open/close, active nav link, tab state) and
    // never appear as static `class="..."` attributes in our Liquid
    // templates, so a plain content-scan safelist would miss them entirely.
    greedy: [
      // Webflow interaction/utility classes, e.g. `w-nav-open`, `w-inline-block`,
      // `w-layout-grid`, `w-col`, `w-col-6`, `w-row`, `w-dropdown`, etc. Also
      // covers the `.w--open`, `.w--current`, `.w--nav-dropdown-open`,
      // `.w--tab-active` state classes (all seen in webflow.css /
      // inog-website.webflow.css) that Webflow's runtime JS toggles on
      // interaction, since none of those are present as static HTML.
      /^w-/,
      /^w--/,

      // Compiled Webflow marker classes such as `wf-section`, `wf-active`,
      // used both statically (`wf-section` appears throughout _includes/
      // _pages) and toggled at runtime for loading states.
      /^wf-/,

      // Generic "currently active" state classes used by Webflow-style sites
      // (nav links, tabs, dropdown items). Matches bare `current` as well as
      // compounds like `current-item` if Webflow ever emits one via JS.
      /current/
    ]
  },

  // Keep declarations like `@font-face` and CSS custom properties even if
  // PurgeCSS can't trace a usage back to them from HTML content.
  fontFace: true,
  variables: true
};
