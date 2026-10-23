// TTL for the OG image route's CDN cache (the s-maxage in its cache-control
// header — see app/og/route.tsx).
//
// There is no ISR anywhere in this app. The blog routes are pure build-time
// SSG: their former `export const revalidate = 43200` was vestigial — the
// snapshot is baked into each deployment, so an ISR re-render could never
// produce new HTML, and its cold-re-render path was the source of the
// GoogleBot/unfurl 500s of issue #2. Deployments are the cache boundary:
// git push → Vercel build → fresh static pages.
export const REVALIDATE_INTERVAL_SECONDS = 12 * 60 * 60; // 43200 — 12 hours

