#!/usr/bin/env node
// Refresh the committed fallback snapshot at lib/medium-feed.json from the
// live Medium RSS feed. Re-runnable: invoke any time a new post is published
// and you want the snapshot (and any env with empty MEDIUM_USERNAME) to show it
// before the 12h ISR window elapses.
//
// Usage:
//   node scripts/refresh-medium-feed.mjs                  # reads MEDIUM_USERNAME
//   node scripts/refresh-medium-feed.mjs ali_farooqi      # positional override
//
// Note: this script's behavior on an empty username intentionally differs from
// `lib/medium.ts`. There, an empty username is the *app's* safety net — fall
// through to the snapshot. Here, an empty username would mean "clobber the
// snapshot with an empty feed", so we abort instead.

import { writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import Parser from "rss-parser";

// Resolve the Medium handle from the first argv, MEDIUM_USERNAME env var, or
// fall back to empty. A leading `@` is tolerated and stripped so users can
// paste handles from profile URLs without thinking about it.
const rawUsername = (process.argv[2] ?? process.env.MEDIUM_USERNAME ?? "").trim();
const username = rawUsername?.replace(/^@/, "");

if (!username) {
  console.error(
    "Refresh aborted: no Medium username. Pass one as the first arg or set MEDIUM_USERNAME.",
  );
  process.exit(1);
}

const url = `https://medium.com/feed/@${username}`;
console.log(`Fetching ${url} …`);

const parser = new Parser();
let feed;
try {
  feed = await parser.parseURL(url);
} catch (error) {
  console.error(`Refresh aborted: fetch failed — ${error.message ?? error}`);
  process.exit(2);
}

// Sanity-check before we clobber the snapshot. An empty feed is treated as a
// failure rather than a successful (truncating) refresh — same posture as a
// network error above.
if (!feed?.items?.length) {
  console.error(
    `Refresh aborted: feed for @${username} returned no items. Leaving lib/medium-feed.json untouched.`,
  );
  process.exit(3);
}

// Resolve relative to this script so it works from any cwd.
const here = dirname(fileURLToPath(import.meta.url));
const outPath = resolve(here, "../lib/medium-feed.json");

await writeFile(outPath, JSON.stringify(feed, null, 2) + "\n", "utf8");
console.log(`Wrote ${feed.items.length} item(s) to ${outPath}`);
