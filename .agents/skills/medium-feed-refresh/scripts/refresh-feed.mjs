import Parser from "rss-parser";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Resolve the Medium handle from MEDIUM_USERNAME env var (matches
// lib/medium.ts). Pass via CLI env: `MEDIUM_USERNAME=your_handle node ...`.
// A leading `@` is tolerated and stripped so users can paste handles from
// profile URLs without thinking about it.
const rawUsername = process.env.MEDIUM_USERNAME;
const username = rawUsername?.replace(/^@/, "");

if (!username) {
  console.error(
    "MEDIUM_USERNAME is not set. Run with `MEDIUM_USERNAME=your_handle node .agents/skills/medium-feed-refresh/scripts/refresh-feed.mjs` (no @, or with @ — it's stripped)."
  );
  process.exit(1);
}

async function run() {
  const parser = new Parser();
  try {
    const feed = await parser.parseURL(`https://medium.com/feed/@${username}`);
    // Save feed structure in format that lib/medium.ts expects:
    // parseMediumFeed expects Parser.Output<MediumFeedItem> which has items array.
    const targetPath = path.resolve(__dirname, "../../../../lib/medium-feed.json");
    fs.writeFileSync(targetPath, JSON.stringify(feed, null, 2));
    console.log(`Successfully updated Medium feed fallback at: ${targetPath}`);
  } catch (err) {
    console.error("Failed to refresh Medium feed:", err);
    process.exit(1);
  }
}

run();
