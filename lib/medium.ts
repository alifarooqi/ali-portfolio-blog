import { promises as fs } from "fs";
import path from "path";

import mediumList from "./medium-list.json";

// Public shape consumed by `app/blog/page.tsx`, `app/blog/[slug]/page.tsx`,
// and `app/sitemap.ts`. Renamed `summary` → `subtitle` so storage, type, and
// components all agree on the same name for the auto-extracted teaser.
export type MediumPost = Partial<{
  title: string;
  link: string;
  content: string; // sanitized HTML body
  date: string;
  slug: string;
  subtitle: string; // auto-extracted first ~160 chars (HTML-stripped) + ellipsis
  image: string;
}>;

// Internal: one row of `lib/medium-list.json`. `hash` is the SHA-256 of the
// post's `content:encoded` and is used by the refresh script (and tests) to
// decide whether a per-post file has changed; the runtime never reads it.
type ListEntry = {
  slug: string;
  hash: string;
  title?: string;
  subtitle?: string;
  image?: string;
  date?: string;
  link?: string;
};

// Resolved at module load so `generateStaticParams` and the renderer share the
// same path. `process.cwd()` is the repo root in Next.js + Vercel.
const POSTS_DIR = path.join(process.cwd(), "lib", "posts-data");

function readList(): ListEntry[] {
  const items = (mediumList as { posts?: unknown[] }).posts;
  return Array.isArray(items) ? (items as ListEntry[]) : [];
}

// Parses an entry's `date` (ISO 8601 from RSS) to epoch millis, or `null` when
// it is missing/unparseable so those entries can be sorted to the end.
function timestampOf(entry: { date?: string }): number | null {
  const parsed = Date.parse(entry.date ?? "");
  return Number.isNaN(parsed) ? null : parsed;
}

// Ordering is presentation, not storage. The refresh script appends new slugs
// to the end of `medium-list.json`, and the documented backfill flow tells you
// to paste entries there too — so the stored array is append-ordered. Reading
// it verbatim put every newly published post at the *bottom* of `/blog`.
// Sorting here makes newest-first a guarantee for every consumer (`/blog`,
// `sitemap`, `generateStaticParams`) regardless of how the snapshot was
// written; the refresh script also writes the snapshot in this order so diffs
// read the same way. `sort` is stable, so equal dates keep their stored order.
function newestFirst<T extends { date?: string }>(entries: readonly T[]): T[] {
  return [...entries].sort((a, b) => {
    const aTime = timestampOf(a);
    const bTime = timestampOf(b);
    if (aTime === null && bTime === null) return 0;
    if (aTime === null) return 1;
    if (bTime === null) return -1;
    return bTime - aTime;
  });
}

// Returns the index for `/blog`: one row per post in the curated list,
// newest-first. No network, no parsing — the refresh script is responsible
// for keeping `medium-list.json` and `lib/posts-data/` in sync with Medium.
export async function getMediumPosts(): Promise<MediumPost[]> {
  return newestFirst(readList()).map((entry) => ({
    title: entry.title,
    link: entry.link,
    date: entry.date,
    slug: entry.slug,
    image: entry.image,
    subtitle: entry.subtitle ?? "",
  }));
}

// Returns the per-post record read from `lib/posts-data/<slug>.json`. The
// detail page feeds `post.content` to `sanitizeMediumHtml` so each per-post
// file must contain the original Medium HTML (not a stripped version).
//
// If the slug isn't in the list, or the per-post file is missing (e.g. a
// partial state where someone added a list entry without writing the file),
// returns `undefined` so the caller can `notFound()` cleanly.
export async function getMediumPost(slug: string): Promise<MediumPost | undefined> {
  if (!readList().some((entry) => entry.slug === slug)) {
    return undefined;
  }

  const file = path.join(POSTS_DIR, `${slug}.json`);
  try {
    const raw = await fs.readFile(file, "utf8");
    return JSON.parse(raw) as MediumPost;
  } catch {
    return undefined;
  }
}
