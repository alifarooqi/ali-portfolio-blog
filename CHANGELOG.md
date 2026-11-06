# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html) once it leaves `0.x`.

## [Unreleased]

### Added

- Hero CTAs: "Blogs" (links to `/blog`) and "Projects" (smooth-scrolls to the projects section), each with a leading icon, using the new shared `Button` component.
- Personal-data guard in CI: a new `guard-personal-data` job greps every PR diff for the patterns stored in the `PERSONAL_DATA_PATTERNS` repo variable and fails the build if any leak. The patterns are intentionally not inlined in the workflow file so the file stays safe to view publicly.
- `reactStrictMode: true` in `next.config.mjs`.

### Changed

- All labeled CTAs now render through one shared `app/components/Button` component: the hero actions, project "See source" links, Contact "Email me", and the blog post's Medium link. It owns surface variants, type scale, icon spacing, hover lift, sound, focus ring, and internal/external link behavior; icon-only controls keep `CircleButton`, while pagination dots and carousel arrows remain specialized control primitives.
- `CommonConfig` is now the single source of truth for site identity — `app/layout.tsx`, `app/og/route.tsx`, `app/sitemap.ts`, `app/blog/[slug]/page.tsx`, `app/components/AboutWriter.tsx`, `app/components/sections/TopSection/TopSection.tsx`, and `app/components/sections/ContactSection/ContactSection.tsx` all read from it instead of carrying duplicate strings.
- `lib/medium.ts` no longer falls back to a hardcoded username; `MEDIUM_USERNAME` defaults to `undefined`, which the empty-string guard in `getMediumPosts` already handles. No fallback default in code — never silently serve someone else's snapshot.
- Medium feed snapshot is content-addressed — `lib/medium-list.json` (index) + `lib/posts-data/<slug>.json` (per-post content) — refreshed by the merge-on-hash script at `.agents/skills/medium-feed-refresh/scripts/refresh-feed.mjs` with an `npm run refresh:medium` shortcut; the raw-RSS `scripts/refresh-medium-feed.mjs` and `lib/medium-feed.json` are gone.
- Project data moved to `app/config/ProjectsConfig.tsx` to match the pattern of `ExperienceConfig` / `ReviewsConfig` / `AboutConfig`.
- Personal content scrubbed to placeholders: `ProjectsConfig.tsx`, `ReviewsConfig.ts`, `ExperienceConfig.ts`, `AboutConfig.ts`, `lib/medium-feed.json`.
- Personal image assets removed; `public/images/avatar-placeholder.webp` is a copy of `bg01.webp` — replace with your own portrait.
- `public/site.webmanifest` updated to placeholders; edit it directly to match `CommonConfig.name` / `shortName`.
- `package.json` gains `name`, `description`, `keywords`, `license`, `repository`, `bugs`, `homepage`, `author`.
- `refresh-medium-feed.yml` cadence: weekly (Mon 09:00 UTC) → daily (09:00 UTC). The merge-on-hash refresh is idempotent — a run with no Medium changes writes nothing and the bot's commit step skips — so the tighter cadence costs a ~30s Actions run and lands a freshly published Medium post within ~24h without manual dispatch.
- Design token system reworked into named roles: `--brand-color` (text-safe), `--brand-color-strong`, `--brand-color-ink` (accent text on light), `--brand-color-light` (decorative), plus `--bg-elevated`, `--hairline`, `--surface-card`, `--surface-section`, `--shadow-card`, `--shadow-lift`, `--on-brand`.
- Light-mode shader palette muted (softer blue, muted teal, star intensity 0.22 → 0.14, higher ambient floor) and covered by a readability veil; dark mode kept its palette and gained a corner vignette so the fixed nav rails sit on a stable backdrop.
- Section panels, blog cards, blog post surface, project cards and the project inspect panel now share one hairline + layered-shadow surface language. The duplicated card treatment was extracted into a shared `.glass-card` utility with a lit top edge and hover lift.
- Typography polish: `text-wrap: balance` on headings, tighter tracking, antialiased body text, tinted text selection, and a short gradient rule before the hero kicker.
- Added `@media (prefers-contrast: more)` overrides for secondary ink and hairlines.
- OG social card recoloured to the new dark-theme palette.

### Fixed

- `refresh-medium-feed.yml` still ran the pre-migration raw-RSS script and diffed the since-deleted `lib/medium-feed.json`, so every scheduled or manual refresh was a silent no-op (the "commit if changed" step always skipped — the freshly written file was untracked, and `git diff` never sees untracked files). It now runs the merge-on-hash refresh and commits `lib/medium-list.json` + `lib/posts-data/` when either changes.
- `refresh-feed.mjs` wrote `date: postFile.isoDate` into `medium-list.json` entries for new/updated posts — `undefined` (silently dropped by `JSON.stringify`) since the per-post field was renamed to `date`, so new list entries lost their date. Now writes `postFile.date`.
- Blog routes are now pure build-time SSG: removed the vestigial `revalidate = 43200` from `app/blog/page.tsx`, `app/blog/[slug]/page.tsx`, and `app/sitemap.ts` (plus the inert copy on the OG route — it reads searchParams, so route handlers are uncached regardless). The snapshot is baked into each deployment, so ISR re-renders could never produce new HTML — they only reopened the cold-re-render path whose jsdom bundling 500s intermittently broke GoogleBot indexing and LinkedIn unfurl previews (issue #2). Deployments are the cache boundary.
- Light-theme contrast failures site-wide: `--text-secondary` moved from `#adadad` (2.2:1) to `#5b6472` (5.7:1), the brand accent from `#3c83f6` (3.5:1) to `#2563eb` (4.95:1), and cyan-as-text (1.5:1) replaced by a text-safe `--brand-color-ink` (`#0e7490`, 5.1:1). `--brand-color-light` is now documented as decorative-only. Dark-theme accent raised from 5.1:1 to 8.6:1 (`#7fb2ff`).
- Carousel pagination dots (30% → 70% of `--text-secondary`) and section-nav indicators (0.35 → 0.5 opacity) now clear the 3:1 non-text threshold.
- Focus rings are visible on every interactive element (`:focus-visible`, 2px brand outline with offset) instead of relying on component-specific and inconsistent styles.

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
