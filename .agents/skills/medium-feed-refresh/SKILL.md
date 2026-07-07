---
name: medium-feed-refresh
description: Used when regenerating or updating the local Medium RSS feed fallback snapshot file (lib/medium-feed.json).
---

# Medium Feed Refresh

This skill is used to refresh the local fallback cache snapshot [medium-feed.json](file:///Users/ali/codes-ali/ali-portfolio-blog/lib/medium-feed.json) which is used if the live Medium RSS feed fetch fails.

## How to Refresh

You can run the helper script in this skill to automatically fetch the latest Medium feed and update the local JSON:

```bash
node .agents/skills/medium-feed-refresh/scripts/refresh-feed.mjs
```

Or you can manually fetch the feed data from `https://medium.com/feed/@ali_farooqi`, convert it, and overwrite `lib/medium-feed.json`.
