# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A Next.js App Router portfolio + blog starter (single-page scroll of animated sections; `/blog` renders posts pulled from a Medium RSS feed). Fork-friendly template — site identity lives in `app/config/CommonConfig.ts`. Designed for Vercel deploy, but any Next.js-compatible host works.

## Commands

- `npm run dev` — start the Next.js dev server
- `npm run build` — production build
- `npm start` — serve the production build
- `npm run lint` — `eslint .` (flat config in `eslint.config.mjs`)
- `npm run typecheck` — `tsc --noEmit`
- `npm run test` — Vitest unit tests (run once)
- `npm run test:watch` — Vitest in watch mode
- `npm run test:e2e` — Playwright smoke suite (builds + starts prod server on :3000). First run needs `npx playwright install chromium`.
- `npm run fix` — `eslint . --fix` then `prettier --write .`

Package manager is **npm** (`package-lock.json`). The README mentions pnpm but the lockfile is npm.

CI (`.github/workflows/ci.yml`) runs `lint` → `typecheck` → `build` → `unit-tests` → `e2e-tests` → `guard-personal-data` on every PR and on pushes to `main`. Do not merge with red CI.

## Architecture

### Config-driven home page
Homepage content is centralized, not scattered across components:
- `app/config/CommonConfig.ts` — name, taglines, signature SVG path, email, social links, and every SEO/OG/JSON-LD field.
- `app/config/SectionConfig.ts` — registry of sections (`key`, `name`, `headerIconKey`). Drives both the `Section` header and the `Menu` items.
- Per-section data files (`app/config/AboutConfig.ts`, `ExperienceConfig.ts`, `ReviewsConfig.ts`, `ProjectsConfig.tsx`) hold the actual section content.

> [!NOTE]
> To add a new project to the portfolio, use the `add-project` skill.

> [!NOTE]
> To add a new homepage section, use the `homepage-sections` skill.

### Sections and navigation
`app/components/Section/Section.tsx` is a `forwardRef` client component that gives each section its `id` (from `sectionConfig.key`), tracks in-view state to toggle a `section-active` class (scroll-spy), and staggers child entrance animations via `motion`.

`app/components/Menu/Menu.tsx` is the circular/radial nav. It builds items from `SectionConfig` plus page links (`/`, `/blog`) and a dark-mode toggle. **Section-scroll links render only on the home route** (`pathname === "/"`); elsewhere only page links + theme toggle show.

### Icons
`app/components/icons/Icons.tsx` is a single registry mapping an `IconKey` string to a component, used everywhere via `getIcon(key)`. It mixes MUI icons and custom SVG components.

> [!NOTE]
> To convert custom SVGs and add new icons, use the `svg-icon` skill.

### Blog = content-addressed Medium snapshot, not local MDX
Blog posts are **not** local MDX. The runtime reads from two committed sources, both in `lib/`:

- `lib/medium-list.json` — index used by `/blog`. Each entry: `slug`, `hash`, `title`, `subtitle`, `image`, `date`, `link`. `hash` is SHA-256 of the post's `content:encoded` and is internal storage only.
- `lib/posts-data/<slug>.json` — full per-post content (`title`, `link`, `slug`, `isoDate`, `content`, `subtitle`, `image`) used by `/blog/[slug]`.

`lib/medium.ts` does no network I/O: it statically imports the list and reads per-post files from disk at runtime. ISR (`revalidate = 12 * 3600` on the blog routes) is the only cache layer.

The `medium-feed-refresh` skill (and its `.github/workflows/refresh-medium-feed.yml` runner) merges live RSS items into the snapshot: per-post files are only rewritten when the SHA-256 of `content:encoded` changes; new slugs are appended; items in the snapshot whose slug is **not** in the live feed are kept (history is never pruned — solves Medium's ~10-item RSS cap from dropping older posts). To add a post older than the live RSS window, backfill its per-post file and add a list entry by hand.

`app/blog/[slug]/page.tsx` renders each post's HTML via `dangerouslySetInnerHTML`, sanitized first through `lib/sanitize.ts` (`sanitizeMediumHtml`) — a 17-tag allowlist backed by `isomorphic-dompurify`. The sanitizer also runs in `lib/sanitize.test.ts`; extend those tests when changing the allowlist.

### Theming (dark mode)
Dark mode is class-based via a `.dark` class on `<html>`. `app/ThemeInitializerScript.tsx` runs `beforeInteractive` to set the class from `localStorage` / `prefers-color-scheme` (prevents flash of wrong theme). The Menu toggle flips it and persists to `localStorage`. Colors are CSS custom properties in `app/global.css` (`:root` and `.dark` blocks).

### Styling
Tailwind v4 (alpha) is configured via `@import "tailwindcss"` in `app/global.css` plus `@tailwindcss/postcss`; the dark variant is declared with `@custom-variant dark (&:where(.dark, .dark *))`. SCSS is also used — most components ship a co-located `.scss` file imported next to the component. Tailwind utilities and component-scoped SCSS coexist; follow whichever pattern the file you're editing already uses.

**Design is mobile-first.** New and modified SCSS must target small screens in the base rules and layer larger-viewport behavior on top via `min-width` media queries (never `max-width` overrides that walk backwards from desktop). Use `clamp()` for fluid type/spacing where it removes the need for per-breakpoint overrides. Verify at ≥320px, ~430px, ~768px, and ~1024px before considering a layout done.

### SEO / metadata
`app/layout.tsx` owns the root `Metadata` (incl. JSON-LD `Person` schema, OG/Twitter images). `app/blog/[slug]/page.tsx` uses `generateMetadata` and emits `BlogPosting` JSON-LD per post. `app/og/route.tsx` generates dynamic OG images. `app/sitemap.ts` exports `baseUrl`, which resolves `NEXT_PUBLIC_SITE_URL` → `NEXT_PUBLIC_VERCEL_URL` → `VERCEL_URL` → `CommonConfig.siteUrlFallback` (last-resort placeholder) — reuse it for any absolute URLs.

### Testing
Two layers, sized for a portfolio (no broad component / snapshot coverage):
- **Unit (Vitest)** — `*.test.ts` co-located with the code. Covers pure logic only: `formatDate` (`app/blog/utils.test.ts`), the Medium sanitizer (`lib/sanitize.test.ts`), and the Medium runtime (`lib/medium.test.ts`, which mocks the static `medium-list.json` import and the `fs/promises.readFile` calls — that's how the index/per-post file split is testable without touching disk). Uses `vi.useFakeTimers` + `process.env.TZ="UTC"` for stable date tests.
- **E2e (Playwright)** — `tests/e2e/smoke.spec.ts`. Runs against `next build && next start` on `:3000` (matches what Vercel ships). Four flows: home sections render, `/blog` → first post, theme toggle flips `dark` on `<html>`, `/no-such-page` → 404. The webServer config boots the prod server automatically; `reuseExistingServer: true` locally so a stray `next start` doesn't trip it.
- The runtime (`lib/medium.ts`) does no network I/O — it reads `lib/medium-list.json` (static import) and `lib/posts-data/<slug>.json` (fs.readFile). E2e's no-unexpected-console-errors check accepts only asset 404s and `_vercel` script refusals; anything else fails the test.
- E2E's blog-index test handles the empty-snapshot case (`lib/medium-list.json` has `posts: []`) by asserting the index page renders without errors and skipping the post-navigation half. With any posts committed, the full flow is exercised.

### Imports
TypeScript path alias `@/*` -> `./*`. Both `@/...` and relative imports appear in the codebase; prefer `@/` for cross-`app` references.

## Notes / gotchas
- The folder `app/components/animaiton/` is **intentionally misspelled** (not "animation") — imports throughout the code use this spelling; don't rename it piecemeal or they'll break.
- `next` is pinned to `14.2.33` as a **stopgap** for #31. The original `"canary"` tag silently drifted on every `npm install` (jumped to 16.x mid-#46). Prefer `npm ci` for reproducibility; #31 will formalize the full version matrix. React is pinned at 18.2.0.
- Fonts: Varela Round (single 400 weight) loaded via `next/font/google` and exposed as the CSS variable `--font-varela-round`.

## Workflow
- To validate local code and create a GitHub Pull Request, use the `create-pr` skill.
