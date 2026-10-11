#!/usr/bin/env node
// Refresh the content-addressed Medium blog snapshot.
//
// Source of truth: `lib/medium-list.json` (index) and `lib/posts-data/<slug>.json`
// (per-post content). This script merges the live Medium RSS feed into that
// snapshot:
//
//   1. Fetch https://medium.com/feed/@<MEDIUM_USERNAME> via rss-parser.
//   2. For each live item, derive `slug` from the link and `hash` from
//      SHA-256(content:encoded).
//   3. If a list entry with the same `slug` exists and its `hash` already
//      matches, do nothing (no file write, no list mutation).
//   4. If the hash differs (new post OR Medium content changed), write
//      `lib/posts-data/<slug>.json` with the new content and update the list
//      entry in place, preserving its position.
//   5. Append new slugs (not yet in the list) to the end of `posts`.
//
// Items in the list whose slug is NOT in the live feed are kept (history is
// never pruned by this script — solves Medium's ~10-item RSS cap from rotting
// out older posts on each refresh).
//
// Idempotent: re-running with no Medium changes is a no-op (no file writes).

import Parser from "rss-parser";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Script lives at <repo>/.agents/skills/medium-feed-refresh/scripts/ —
// walk up four `..` to reach the repo root.
const ROOT = path.resolve(__dirname, "../../../..");
const LIST_PATH = path.join(ROOT, "lib/medium-list.json");
const POSTS_DIR = path.join(ROOT, "lib/posts-data");

// Resolve the Medium handle from MEDIUM_USERNAME env var. A leading `@` is
// tolerated and stripped so users can paste handles from profile URLs without
// thinking about it.
const rawUsername = process.env.MEDIUM_USERNAME;
const username = rawUsername?.replace(/^@/, "");

if (!username) {
  console.error(
    "MEDIUM_USERNAME is not set. Run with `MEDIUM_USERNAME=your_handle node .agents/skills/medium-feed-refresh/scripts/refresh-feed.mjs` (no @, or with @ — it's stripped)."
  );
  process.exit(1);
}

function stripRssSource(link) {
  // Medium's RSS appends `?source=rss-...` to track referrers; drop it so the
  // same post always maps to the same canonical URL.
  return link?.split("?")[0] ?? "";
}

function slugOf(link) {
  // Last path segment of the canonical Medium URL, e.g.
  // "https://medium.com/@ali_farooqi/laya-vs-jev-...-78862ee535bd" → "78862ee535bd"-free slug.
  return stripRssSource(link).split("/").pop();
}

function hashOf(html) {
  return crypto.createHash("sha256").update(html ?? "").digest("hex");
}

function extractImage(html) {
  return html?.match(/<img[^>]+src="([^">]+)"/)?.[1] ?? "";
}

function extractSubtitle(html) {
  // First ~160 chars of the body with all HTML tags stripped + ellipsis.
  // Matches the historical `parseMediumFeed` behavior so card subtitles look
  // the same before and after this migration.
  return (html ?? "").replace(/<[^>]+>/g, " ").slice(0, 160) + "…";
}

function readList() {
  if (!fs.existsSync(LIST_PATH)) return [];
  try {
    const parsed = JSON.parse(fs.readFileSync(LIST_PATH, "utf8"));
    return Array.isArray(parsed.posts) ? parsed.posts : [];
  } catch (err) {
    console.error(`Failed to read ${LIST_PATH}:`, err.message);
    return [];
  }
}

function writeList(list) {
  fs.writeFileSync(LIST_PATH, JSON.stringify({ posts: list }, null, 2));
}

function writePostFile(slug, postFile) {
  fs.writeFileSync(
    path.join(POSTS_DIR, `${slug}.json`),
    JSON.stringify(postFile, null, 2),
  );
}

async function run() {
  const parser = new Parser();
  const live = await parser.parseURL(`https://medium.com/feed/@${username}`);

  const list = readList();
  const slugIndex = new Map(list.map((entry, i) => [entry.slug, i]));

  fs.mkdirSync(POSTS_DIR, { recursive: true });

  let unchanged = 0;
  let updated = 0;
  let added = 0;

  for (const item of live.items ?? []) {
    const link = stripRssSource(item.link);
    const slug = slugOf(item.link);
    if (!slug) continue;

    const body = item["content:encoded"] ?? item.content ?? "";
    const hash = hashOf(body);

    const postFile = {
      title: item.title,
      link,
      slug,
      date: item.isoDate,
      content: body,
      subtitle: extractSubtitle(body),
      image: extractImage(body),
    };

    if (slugIndex.has(slug)) {
      const idx = slugIndex.get(slug);
      if (list[idx].hash === hash) {
        unchanged++;
        continue;
      }
      // Preserve any user-curated fields (none today, but future-proof) by
      // spreading the existing entry first, then overwriting with fresh values.
      list[idx] = {
        ...list[idx],
        ...{
          hash,
          title: postFile.title,
          subtitle: postFile.subtitle,
          image: postFile.image,
          date: postFile.isoDate,
          link: postFile.link,
        },
      };
      writePostFile(slug, postFile);
      updated++;
    } else {
      writePostFile(slug, postFile);
      list.push({
        slug,
        hash,
        title: postFile.title,
        subtitle: postFile.subtitle,
        image: postFile.image,
        date: postFile.isoDate,
        link: postFile.link,
      });
      added++;
    }
  }

  writeList(list);

  console.log(
    `Refresh done: ${unchanged} unchanged, ${updated} updated, ${added} added → ${list.length} total in ${path.relative(ROOT, LIST_PATH)}`,
  );
}

run();
