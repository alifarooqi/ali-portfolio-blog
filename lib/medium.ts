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

// Returns the index for `/blog`: one row per post in the curated list, in
// stored order. No network, no parsing — the refresh script is responsible
// for keeping `medium-list.json` and `lib/posts-data/` in sync with Medium.
export async function getMediumPosts(): Promise<MediumPost[]> {
  return readList().map((entry) => ({
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
