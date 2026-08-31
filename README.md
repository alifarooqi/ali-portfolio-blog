# Portfolio Blog Starter

A Next.js App Router portfolio + blog starter. Animated single-page home, dynamic Open Graph cards, Medium-sourced blog, Tailwind v4 + SCSS, MIT-licensed.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-v4-38bdf8)
![License](https://img.shields.io/badge/license-MIT-green)

![Portfolio preview](./public/images/avatar-placeholder.webp)

## Features

- **Animated sections** powered by [motion](https://motion.dev) — staggered entrance, scroll-spy, magnetic buttons.
- **Config-driven home page** — name, tagline, social, signature SVG, and metadata all live in `app/config/CommonConfig.ts`. Edit one file, the whole site updates.
- **Blog backed by a Medium RSS feed** — `lib/medium.ts` fetches and parses the feed, falls back to a committed snapshot if the network fails, sanitizes content with an allowlist via `isomorphic-dompurify`.
- **Dynamic Open Graph cards** — `app/og/route.tsx` renders a branded 1200×630 image per page and per blog post.
- **SEO built in** — sitemap, robots, JSON-LD `Person` and `BlogPosting` schemas, per-page metadata via `generateMetadata`.
- **Dark mode** — class-based, no flash on first paint (`ThemeInitializerScript` runs `beforeInteractive`).
- **PWA manifest** + favicons.
- **Vercel Analytics + Speed Insights** wired up.
- **Two test layers** — Vitest unit tests for pure logic, Playwright e2e smoke tests against a real production build.

## Quick start

```bash
npm ci
cp .env.example .env.local      # edit the three values — see "Configuration" below
npm run dev                      # http://localhost:3000
```

## Customization

Most users only need to edit two places:

1. **`app/config/CommonConfig.ts`** — your name, role, hero image, signature SVG path, social links, location, contact email, and every SEO field. The OG card, sitemap, layout metadata, and JSON-LD all read from this file.
2. **`app/config/AboutConfig.ts`**, **`ExperienceConfig.ts`**, **`ReviewsConfig.ts`**, **`ProjectsConfig.tsx`** — bio, experience timeline, testimonials, and project list. The corresponding sections render the contents of these arrays verbatim.
3. Drop your project cover art under `public/images/projects/` and reference it from each `coverImage` field in `ProjectsConfig.tsx`.

To remove the placeholder portrait, replace `public/images/avatar-placeholder.webp` with your own (any reasonable size; the component renders at 356×466 in the hero and 200×274 in the blog-post footer).

To use your own signature instead of the placeholder initials, set `CommonConfig.signature.signaturePathD` to the `d` attribute of an SVG `<path>` of your signature. Leave it as `""` to skip the signature.

## Configuration

Environment variables (see [`.env.example`](.env.example)):

| Var                    | Required?  | Purpose                                                                                                  |
| ---------------------- | ---------- | -------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | Production | Canonical URL used in sitemap, OG tags, JSON-LD. Vercel preview auto-resolves via `VERCEL_URL` if unset. |
| `NEXT_PUBLIC_GA_ID`    | Optional   | Google Analytics 4 measurement ID (e.g. `G-XXXXXXXXXX`). Empty disables analytics.                       |
| `MEDIUM_USERNAME`      | Optional   | Medium handle (no `@`) that powers `/blog`. Empty renders an empty list.                                 |

Everything else lives in code under `app/config/`. See [`CONTRIBUTING.md`](CONTRIBUTING.md) for the schema-stability policy that keeps your fork forward-compatible.

## Project structure

```
app/
├── config/                     # Site identity — edit values, not the components
│   ├── CommonConfig.ts         #   name, social, hero, OG metadata, signature
│   ├── AboutConfig.ts          #   bio, stats, marquee tech
│   ├── ExperienceConfig.ts     #   experience timeline
│   ├── ReviewsConfig.ts        #   testimonials
│   └── SectionConfig.ts        #   section registry (drives nav + headers)
├── components/
│   ├── sections/               # One folder per home-page section
│   ├── Menu/                   # Radial nav, theme toggle, sound toggle
│   ├── Section/                # forwardRef + scroll-spy wrapper
│   ├── Footer/, Breadcrumb/, …
│   └── icons/                  # Icons.tsx registry + custom SVGs
├── blog/                       # /blog route + per-post page + utils
├── og/route.tsx                # Dynamic OG image generator
├── sitemap.ts, robots.ts       # SEO routes
├── layout.tsx, page.tsx        # Root layout + home page
└── global.css                  # Tailwind v4 + theme tokens
lib/                            # Pure helpers (medium, sanitize, revalidate, scrollToSection, lenis, sound)
tests/e2e/                      # Playwright smoke tests
.agents/skills/                 # Claude Code skills for common tasks
```

## Scripts

```bash
npm run dev          # Next.js dev server
npm run build        # Production build
npm run start        # Serve the production build
npm run lint         # eslint .
npm run typecheck    # tsc --noEmit
npm run test         # Vitest unit tests (one-shot)
npm run test:watch   # Vitest in watch mode
npm run test:e2e     # Playwright e2e (builds + starts prod server on :3000)
npm run fix          # eslint --fix && prettier --write
npm run analyze      # Bundle analyzer output
```

## Deployment

### Vercel

The fastest path. After forking:

1. Push the repo to your GitHub.
2. Import on [vercel.com/new](https://vercel.com/new) — Vercel auto-detects Next.js.
3. Set the three env vars from the [Configuration table](#configuration) in **Settings → Environment Variables** for Production.
4. Deploy.

The `refresh-medium-feed.yml` workflow runs weekly and refreshes the local Medium snapshot. Set `MEDIUM_USERNAME` as a repo variable at **Settings → Secrets and variables → Actions → Variables** so the workflow can read it.

### Other hosts

Any Next.js-compatible host works — set the three env vars, run `npm ci && npm run build`, and serve with `npm start`. The `refresh-medium-feed.yml` workflow only runs on GitHub Actions; for other CI, call the script directly with `MEDIUM_USERNAME=... node .agents/skills/medium-feed-refresh/scripts/refresh-feed.mjs`.

## Testing

Unit tests run next to the code they cover (`*.test.ts`). E2E tests live in `tests/e2e/`.

```bash
npm run test                # Vitest, one-shot
npm run test:watch          # Vitest, watch mode
npm run test:e2e            # Playwright (builds + starts prod server on :3000)

# First time you run e2e locally, install the browser:
npx playwright install chromium
```

CI runs all of `lint`, `typecheck`, `build`, `test`, `test:e2e`, plus a personal-data guard on every PR.

## Contributing

See [`CONTRIBUTING.md`](CONTRIBUTING.md). Bug reports → [bug template](https://github.com/alifarooqi/portfolio-blog-starter/issues/new?template=bug.md). Feature ideas → [feature template](https://github.com/alifarooqi/portfolio-blog-starter/issues/new?template=feature.md). Security issues → [`SECURITY.md`](SECURITY.md).

This project follows a [Code of Conduct](CODE_OF_CONDUCT.md).

## License

[MIT](LICENSE).
