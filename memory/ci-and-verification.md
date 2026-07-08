# CI, build, and verification

## How the site is built and deployed

- Deployed via **GitHub Actions** (`.github/workflows/jekyll.yml`) running `bundle exec jekyll build`, **not** the `github-pages` gem (it is commented out in
  the `Gemfile`). Consequence: the site is **not** restricted to the GitHub Pages plugin allowlist — any Jekyll plugin listed in the `Gemfile` + `_config.yml`
  `plugins:` works. (The old `whitelist:` block was removed as dead config.)
- PRs are gated by `.github/workflows/ci.yml`: build → PurgeCSS → html-proofer → pa11y (non-blocking) → prettier. `_site/` is built during CI, so anything that
  scans the repo (like prettier) must ignore `_site/` via `.prettierignore` — do **not** pass `--ignore-path ''`, which disables it.

## `.ruby-version` must be fully qualified

rbenv does exact-string matching on `.ruby-version`. A bare minor like `3.4` fails with `rbenv: version '3.4' is not installed` and blocks every `ruby`/`bundle`
command. Use the installed patch version (e.g. `3.4.9`). `ruby/setup-ruby` in CI accepts the fully-qualified value fine.

## Verifying prettier: bypass the rtk proxy

An `rtk` shell hook in this environment intercepts `prettier` invocations and can print a **masked/canned result** (e.g. "All files formatted correctly") while
the real prettier is reporting failures. This caused false "prettier passes locally" claims that CI then failed on. When verifying formatting, run it through
the proxy bypass: `rtk proxy npx prettier --check .`. Treat CI green as the ground truth.

## Bundler / rubygems networking

`bundle update`/`install` fetches from `index.rubygems.org` (a CNAME to Fastly). Some local resolvers (e.g. a consumer router's DNS forwarder) fail to resolve
that specific hostname while resolving the `rubygems.org` apex fine — symptom is "Could not reach host index.rubygems.org" even though the network is up. Fix on
the machine: point DNS at a public resolver (1.1.1.1 / 8.8.8.8). Not a repo problem.
