# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html) once it leaves `0.x`.

## [Unreleased]

### Added

- Personal-data guard in CI: a new `guard-personal-data` job greps every PR diff for the patterns stored in the `PERSONAL_DATA_PATTERNS` repo variable and fails the build if any leak. The patterns are intentionally not inlined in the workflow file so the file stays safe to view publicly.
- `reactStrictMode: true` in `next.config.mjs`.

### Changed

- `CommonConfig` is now the single source of truth for site identity — `app/layout.tsx`, `app/og/route.tsx`, `app/sitemap.ts`, `app/blog/[slug]/page.tsx`, `app/components/AboutWriter.tsx`, `app/components/sections/TopSection/TopSection.tsx`, and `app/components/sections/ContactSection/ContactSection.tsx` all read from it instead of carrying duplicate strings.
- `lib/medium.ts` no longer falls back to a hardcoded username; `MEDIUM_USERNAME` defaults to `undefined`, which the empty-string guard in `getMediumPosts` already handles. No fallback default in code — never silently serve someone else's snapshot.
- Medium feed snapshot is content-addressed — `lib/medium-list.json` (index) + `lib/posts-data/<slug>.json` (per-post content) — refreshed by the merge-on-hash script at `.agents/skills/medium-feed-refresh/scripts/refresh-feed.mjs` with an `npm run refresh:medium` shortcut; the raw-RSS `scripts/refresh-medium-feed.mjs` and `lib/medium-feed.json` are gone.
- Project data moved to `app/config/ProjectsConfig.tsx` to match the pattern of `ExperienceConfig` / `ReviewsConfig` / `AboutConfig`.
- Personal content scrubbed to placeholders: `ProjectsConfig.tsx`, `ReviewsConfig.ts`, `ExperienceConfig.ts`, `AboutConfig.ts`, `lib/medium-feed.json`.
- Personal image assets removed; `public/images/avatar-placeholder.webp` is a copy of `bg01.webp` — replace with your own portrait.
- `public/site.webmanifest` updated to placeholders; edit it directly to match `CommonConfig.name` / `shortName`.
- `package.json` gains `name`, `description`, `keywords`, `license`, `repository`, `bugs`, `homepage`, `author`.
- `refresh-medium-feed.yml` cadence: weekly (Mon 09:00 UTC) → daily (09:00 UTC). The merge-on-hash refresh is idempotent — a run with no Medium changes writes nothing and the bot's commit step skips — so the tighter cadence costs a ~30s Actions run and lands a freshly published Medium post within ~24h without manual dispatch.

### Fixed

- `refresh-medium-feed.yml` still ran the pre-migration raw-RSS script and diffed the since-deleted `lib/medium-feed.json`, so every scheduled or manual refresh was a silent no-op (the "commit if changed" step always skipped — the freshly written file was untracked, and `git diff` never sees untracked files). It now runs the merge-on-hash refresh and commits `lib/medium-list.json` + `lib/posts-data/` when either changes.
- `refresh-feed.mjs` wrote `date: postFile.isoDate` into `medium-list.json` entries for new/updated posts — `undefined` (silently dropped by `JSON.stringify`) since the per-post field was renamed to `date`, so new list entries lost their date. Now writes `postFile.date`.

### Removed

- `public/googlec0f592f80742d3e8.html` (personal Google Search Console token).
- `public/images/ali-avatar.webp`, `public/images/faceshot.webp`, and all `public/images/projects/*.webp` (personal photos).
- `app/components/sections/ProjectSection/Projects.tsx` — data moved to `app/config/ProjectsConfig.tsx`.
- Bare `// TODO` and `Parser.Output<any>` in `lib/medium.ts` — `parseMediumFeed` is now typed as `Parser.Output<MediumFeedItem>`.
- `// eslint-disable-next-line` for `no-explicit-any` in `lib/medium.ts`.

## 0.1.0 — Initial open-source release

- Republished as a MIT-licensed template.
- `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, `CHANGELOG.md` added.
- `.github/ISSUE_TEMPLATE/{bug,feature}.md` and `.github/PULL_REQUEST_TEMPLATE.md` added.
