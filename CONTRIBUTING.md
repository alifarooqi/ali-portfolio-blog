# Contributing to Portfolio Blog Starter

Thanks for taking an interest! This document explains how to propose changes.

## Code of Conduct

This project follows the [Contributor Covenant](CODE_OF_CONDUCT.md). By participating, you agree to its terms.

## Reporting Issues

- **Bugs / docs typos:** open a [bug report](https://github.com/alifarooqi/portfolio-blog-starter/issues/new?template=bug.md).
- **Feature ideas:** open a [feature request](https://github.com/alifarooqi/portfolio-blog-starter/issues/new?template=feature.md).
- **Security:** see [SECURITY.md](SECURITY.md) — do not open a public issue.

## Project Layout

- `app/` — Next.js App Router pages, components, and per-section configs.
- `app/config/` — site-identity configs (read by every page). **Edit values here**, not in components.
- `lib/` — pure helpers (Medium RSS, sanitization, revalidate interval, etc.).
- `tests/e2e/` — Playwright smoke tests.
- `*.test.ts` — Vitest unit tests, co-located with the code they cover.
- `.agents/skills/` — Claude Code skills that scaffold common tasks (adding a project, adding a homepage section, etc.).

## Development

```bash
npm ci
npm run dev         # local dev server on :3000
npm run lint        # eslint .
npm run typecheck   # tsc --noEmit
npm run test        # Vitest unit tests
npm run test:e2e    # Playwright e2e (builds + starts prod server; needs `npx playwright install chromium` once)
```

## Pull Requests

PRs follow a change table + manual smoke-test format. The template is in [`.github/PULL_REQUEST_TEMPLATE.md`](.github/PULL_REQUEST_TEMPLATE.md) — keep it filled in.

CI runs **lint + typecheck + build + unit tests + e2e tests + a personal-data guard** on every PR. All five must pass.

### Personal-data guard

To stay open-source-friendly, the template ships without any personal data. A CI guard (`guard-personal-data` job in `.github/workflows/ci.yml`) greps every PR diff for the patterns stored in the `PERSONAL_DATA_PATTERNS` repo variable and fails the PR if any are introduced.

**Maintainer setup:** Settings → Secrets and variables → Actions → Variables → add `PERSONAL_DATA_PATTERNS` as a repo variable. The value is an extended regex (`foo|bar|baz`). The patterns are intentionally not inlined in the workflow file so the file itself stays safe to view in a public repo. Without the variable set, the job passes silently — no false negatives, just no enforcement.

If you forked the template for your own portfolio, the guard does not apply (it's only on the upstream PR diff).

### Keep `app/config/` schemas stable

`CommonConfigType`, `SectionConfigType`, `ExperienceEntry`, `Review`, `AboutConfigType` are the **schemas** that downstream forks read. Adding an optional field is fine; renaming or removing an existing one breaks every fork.

If you must remove a field, mark it `@deprecated` for one release cycle first and document the migration in `CHANGELOG.md`.

### Style

- Match the existing comment density. Every file in `app/` and `lib/` has explanations for non-obvious decisions — keep that going.
- Mobile-first SCSS — base rules target small screens, layer larger viewports on top with `min-width` media queries. Verify at ≥320px, ~430px, ~768px, and ~1024px.
- Run `npm run fix` before opening the PR so prettier + eslint do their thing.
- Use TypeScript path alias `@/` for cross-`app` references; relative imports are fine within a folder.
