---
name: medium-feed-refresh
description: Used when regenerating or updating the local Medium RSS feed fallback snapshot file (lib/medium-feed.json).
---

# Medium Feed Refresh

This skill refreshes the local fallback cache snapshot `lib/medium-feed.json` — used by `lib/medium.ts` if the live Medium RSS feed fetch fails.

## How to Refresh

Run the helper script with `MEDIUM_USERNAME` set in your shell (no `@` prefix):

```bash
MEDIUM_USERNAME=your_handle node .agents/skills/medium-feed-refresh/scripts/refresh-feed.mjs
```

Or fetch the feed manually from `https://medium.com/feed/@<your_handle>` and overwrite `lib/medium-feed.json` with the JSON response.
