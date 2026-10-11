---
name: medium-feed-refresh
description: Used when running the Medium blog refresh — merges the live RSS feed into lib/medium-list.json (index) and lib/posts-data/<slug>.json (per-post content). Use this when adding or changing how the script works.
---

# Medium Blog Refresh

This skill refreshes the content-addressed snapshot of the user's Medium blog:

- `lib/medium-list.json` — index/metadata (one entry per post: `slug`, `hash`, `title`, `subtitle`, `image`, `date`, `link`). Used by `/blog`.
- `lib/posts-data/<slug>.json` — full per-post content (`title`, `link`, `slug`, `date`, `content`, `subtitle`, `image`). Used by `/blog/[slug]`.

## How it merges

The script (`scripts/refresh-feed.mjs`) reads the live RSS feed and merges into the existing snapshot:

- For each live item, it computes `slug` (last path segment of the URL) and `hash` (SHA-256 of `content:encoded`).
- If a list entry with the same `slug` already has a matching `hash`, the script is a **no-op** for that post (no file write, no list mutation). This keeps PR diffs small: re-running with no Medium changes produces zero modifications.
- If the `hash` differs (new post, or Medium content changed), the per-post file is re-written and the list entry is updated in place (preserving its position).
- New `slug`s are appended to the end of `posts`.
- Items in the snapshot whose `slug` is **not** in the live feed are kept. **History is never pruned.** This is the fix for Medium's ~10-item RSS cap: older posts that age out of the live feed window remain in the snapshot forever.

## How to refresh

```bash
MEDIUM_USERNAME=ali_farooqi node .agents/skills/medium-feed-refresh/scripts/refresh-feed.mjs
```

## Backfilling posts older than the RSS window

Medium's RSS feed only returns the ~10 most recent items, so older posts can never appear in the feed. To add such a post permanently, use the one-shot helper `scripts/backfill-post.mjs`:

```bash
node .agents/skills/medium-feed-refresh/scripts/backfill-post.mjs \
  --slug  <last-path-segment-of-the-medium-url> \
  --title "<full title>" \
  --link  "https://medium.com/@ali_farooqi/<slug>?source=rss-..." \
  --date  "<ISO 8601 date, e.g. 2024-09-12T00:00:00.000Z>" \
  --html  ./body.html
```

1. Get the article HTML — open the post in a browser, View Source, copy the `<article>…</article>` body into `./body.html` (Cloudflare blocks automated fetches against `*.medium.com`).
2. Run the helper. It writes `lib/posts-data/<slug>.json` (full per-post file) and prints a ready-to-paste `posts`-array entry for `lib/medium-list.json`.
3. Append the printed entry to `posts` in `lib/medium-list.json`.
4. Re-run `scripts/refresh-feed.mjs` to confirm the merge is a no-op (existing entries untouched, new entry preserved).

## Workflow

`.github/workflows/refresh-medium-feed.yml` runs this script weekly and on manual dispatch. It is the same script — no separate logic.
