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
- `.agents/skills/medium-feed-refresh/scripts/refresh-feed.mjs` now strips a leading `@` from `MEDIUM_USERNAME` so handles pasted from profile URLs work.
- Project data moved to `app/config/ProjectsConfig.tsx` to match the pattern of `ExperienceConfig` / `ReviewsConfig` / `AboutConfig`.
- Personal content scrubbed to placeholders: `ProjectsConfig.tsx`, `ReviewsConfig.ts`, `ExperienceConfig.ts`, `AboutConfig.ts`, `lib/medium-feed.json`.
- Personal image assets removed; `public/images/avatar-placeholder.webp` is a copy of `bg01.webp` — replace with your own portrait.
- `public/site.webmanifest` updated to placeholders; edit it directly to match `CommonConfig.name` / `shortName`.
- `package.json` gains `name`, `description`, `keywords`, `license`, `repository`, `bugs`, `homepage`, `author`.
- `refresh-medium-feed.yml` cadence: weekly (Mon 09:00 UTC) → daily (09:00 UTC). The merge-on-hash refresh is idempotent — a run with no Medium changes writes nothing and the bot's commit step skips — so the tighter cadence costs a ~30s Actions run and lands a freshly published Medium post within ~24h without manual dispatch.

### Fixed

- `refresh-medium-feed.yml` checked for and committed `lib/medium-feed.json` — deleted by the content-addressed snapshot migration — while the refresh script actually writes `lib/medium-list.json` + `lib/posts-data/`. The change check therefore always came back empty and every scheduled or manual refresh was a silent no-op. It now detects changes via `git status --porcelain` (which also sees brand-new per-post files) and commits the real snapshot paths.
- `refresh-feed.mjs` wrote `date: postFile.isoDate` into `medium-list.json` entries for new/updated posts — `undefined` (silently dropped by `JSON.stringify`) since the per-post field was renamed to `date` in 7d0c11d, so new list entries lost their date. Now writes `postFile.date`.
- Blog routes are now pure build-time SSG: removed the vestigial `revalidate = 43200` from `app/blog/page.tsx`, `app/blog/[slug]/page.tsx`, and `app/sitemap.ts` (plus the inert copy on the OG route — it reads searchParams, so route handlers are uncached regardless). The snapshot is baked into each deployment, so ISR re-renders could never produce new HTML — they only reopened the cold-re-render path whose jsdom bundling 500s intermittently broke GoogleBot indexing and LinkedIn unfurl previews (issue #2). Deployments are the cache boundary.

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
