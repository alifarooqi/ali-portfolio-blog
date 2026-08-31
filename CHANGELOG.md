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
- `public/site.webmanifest` updated to placeholders; the values mirror `CommonConfig.webManifestName` / `webManifestShortName`.
- `package.json` gains `name`, `description`, `keywords`, `license`, `repository`, `bugs`, `homepage`, `author`.

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
