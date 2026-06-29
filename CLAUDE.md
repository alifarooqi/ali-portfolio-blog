# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Ali Farooqi's personal portfolio + blog (Next.js App Router, deployed on Vercel). The home page is a single-page scroll of animated sections; `/blog` renders posts pulled live from a Medium RSS feed.

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

CI (`.github/workflows/ci.yml`) runs `lint` -> `typecheck` -> `build` on every PR and on pushes to `main`. It does **not** run the test suites yet — that wiring is deferred. Do not merge with red CI.

## Architecture

### Config-driven home page
Homepage content is centralized, not scattered across components:
- `app/config/CommonConfig.ts` — name, taglines, signature SVG path, email, and social links.
- `app/config/SectionConfig.ts` — registry of sections (`key`, `name`, `headerIconKey`, optional `notInMenu`). Drives both the `Section` header and the `Menu` items.
- Per-section data files (e.g. `app/components/sections/ProjectSection/Projects.tsx`) hold the actual section content.

To add a homepage section: add an entry to `SectionConfig`, drop the section component in `app/components/sections/`, and render it from `app/page.tsx`. The `Section` wrapper (scroll-spy + staggered animation) and the Menu pick it up via the config `key` / `headerIconKey`.

### Sections and navigation
`app/components/Section/Section.tsx` is a `forwardRef` client component that gives each section its `id` (from `sectionConfig.key`), tracks in-view state to toggle a `section-active` class (scroll-spy), and staggers child entrance animations via `motion`.

`app/components/Menu/Menu.tsx` is the circular/radial nav. It builds items from `SectionConfig` plus page links (`/`, `/blog`) and a dark-mode toggle. **Section-scroll links render only on the home route** (`pathname === "/"`); elsewhere only page links + theme toggle show.

### Icons
`app/components/icons/Icons.tsx` is a single registry mapping an `IconKey` string to a component, used everywhere via `getIcon(key)`. It mixes MUI icons and custom SVG components. To add a new SVG icon, convert it with SVGR using the template/config in that folder:

```
npx @svgr/cli ./ --template svgr-motion-template.js --out-dir ./ --ext tsx --no-svgo
```

then register it in the `Icons` map. (`svgo.config.js` is also present for separate `svgo` runs.)

### Blog = Medium RSS, not local MDX
Blog posts are **not** local MDX. `lib/medium.ts` fetches the Medium RSS feed for `@ali_farooqi`, caches it in-memory for 12h (matching `revalidate = 12 * 3600` on the blog routes), and falls back to the committed snapshot at `lib/medium-feed.json` if the fetch fails. `app/blog/[slug]/page.tsx` renders the post's raw HTML via `dangerouslySetInnerHTML` — note this is **untrusted HTML** with no sanitizer yet (planned in #32). To refresh the fallback snapshot, regenerate it from https://rss2json.com (see the comment at the top of `medium.ts`).

### Theming (dark mode)
Dark mode is class-based via a `.dark` class on `<html>`. `app/ThemeInitializerScript.tsx` runs `beforeInteractive` to set the class from `localStorage` / `prefers-color-scheme` (prevents flash of wrong theme). The Menu toggle flips it and persists to `localStorage`. Colors are CSS custom properties in `app/global.css` (`:root` and `.dark` blocks).

### Styling
Tailwind v4 (alpha) is configured via `@import "tailwindcss"` in `app/global.css` plus `@tailwindcss/postcss`; the dark variant is declared with `@custom-variant dark (&:where(.dark, .dark *))`. SCSS is also used — most components ship a co-located `.scss` file imported next to the component. Tailwind utilities and component-scoped SCSS coexist; follow whichever pattern the file you're editing already uses.

### SEO / metadata
`app/layout.tsx` owns the root `Metadata` (incl. JSON-LD `Person` schema, OG/Twitter images). `app/blog/[slug]/page.tsx` uses `generateMetadata` and emits `BlogPosting` JSON-LD per post. `app/og/route.tsx` generates dynamic OG images. `app/sitemap.ts` exports `baseUrl` (hardcoded to `https://alifarooqi.vercel.app`) — reuse it for any absolute URLs.

### Testing
Two layers, sized for a portfolio (no broad component / snapshot coverage):
- **Unit (Vitest)** — `*.test.ts` co-located with the code. Covers pure logic only: `formatDate` (`app/blog/utils.test.ts`) and the Medium feed parser (`lib/medium.test.ts`, which is why `parseMediumFeed` is exported). Uses `vi.useFakeTimers` + `process.env.TZ="UTC"` for stable date tests.
- **E2e (Playwright)** — `tests/e2e/smoke.spec.ts`. Runs against `next build && next start` on `:3000` (matches what Vercel ships). Four flows: home sections render, `/blog` → first post, theme toggle flips `dark` on `<html>`, `/no-such-page` → 404. The webServer config boots the prod server automatically; `reuseExistingServer: true` locally so a stray `next start` doesn't trip it.
- `getMediumPosts` swallows network errors and falls back to `lib/medium-feed.json`, logging `Error fetching Medium posts: ...` first. E2e's no-unexpected-console-errors check filters that one message plus asset 404s; anything else fails the test.

### Imports
TypeScript path alias `@/*` -> `./*`. Both `@/...` and relative imports appear in the codebase; prefer `@/` for cross-`app` references.

## Notes / gotchas
- The folder `app/components/animaiton/` is **intentionally misspelled** (not "animation") — imports throughout the code use this spelling; don't rename it piecemeal or they'll break.
- `next` is pinned to `14.2.33` as a **stopgap** for #31. The original `"canary"` tag silently drifted on every `npm install` (jumped to 16.x mid-#46). Prefer `npm ci` for reproducibility; #31 will formalize the full version matrix. React is pinned at 18.2.0.
- Fonts: Varela Round (single 400 weight) loaded via `next/font/google` and exposed as the CSS variable `--font-varela-round`.

## Workflow
- After opening a PR, open it in the user's browser automatically: `gh pr view <number> --web`.
