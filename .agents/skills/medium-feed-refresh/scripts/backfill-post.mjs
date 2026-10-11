#!/usr/bin/env node
// One-shot backfill for a Medium post that's older than the live RSS window.
//
// `scripts/refresh-feed.mjs` only sees the ~10 most recent items in the live
// feed. Posts that age out of that window are kept in the snapshot forever,
// but to add a *new* old post, you have to write it by hand. This helper
// computes the per-post file and the list-entry to paste in.
//
// Usage (run from the repo root):
//
//   node .agents/skills/medium-feed-refresh/scripts/backfill-post.mjs \
//     --slug  make-your-app-china-ready-how-to-deploy-web-services-inside-the-great-chinese-firewall-5aab4e1b08bd \
//     --title "Make Your App China-Ready: How to Deploy Web Services Inside the Great Chinese Firewall" \
//     --link  "https://medium.com/@ali_farooqi/make-your-app-china-ready-...-5aab4e1b08bd" \
//     --date  "2024-09-12T00:00:00.000Z" \
//     --html  ./china-firewall.html
//
// `china-firewall.html` should contain the full `<article>...</article>` HTML
// body — easiest path is View Source on the public Medium post, then copy
// everything between (and including) the outer article wrapper.
//
// The script writes `lib/posts-data/<slug>.json` and prints a ready-to-paste
// JSON object for the `posts` array in `lib/medium-list.json`.

import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Same nesting as scripts/refresh-feed.mjs — four `..` to repo root.
const ROOT = path.resolve(__dirname, "../../../..");
const POSTS_DIR = path.join(ROOT, "lib", "posts-data");

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const key = a.slice(2);
      const value = argv[i + 1];
      out[key] = value;
      i++;
    }
  }
  return out;
}

const args = parseArgs(process.argv.slice(2));
const required = ["slug", "title", "link", "date", "html"];
for (const k of required) {
  if (!args[k]) {
    console.error(`Missing required flag: --${k}`);
    process.exit(1);
  }
}

const body = fs.readFileSync(args.html, "utf8");
const hash = crypto.createHash("sha256").update(body).digest("hex");
const subtitle = body.replace(/<[^>]+>/g, " ").slice(0, 160) + "…";
const image = body.match(/<img[^>]+src="([^">]+)"/)?.[1] ?? "";

const postFile = {
  title: args.title,
  link: args.link,
  slug: args.slug,
  isoDate: args.date,
  content: body,
  subtitle,
  image,
};

fs.mkdirSync(POSTS_DIR, { recursive: true });
const target = path.join(POSTS_DIR, `${args.slug}.json`);
fs.writeFileSync(target, JSON.stringify(postFile, null, 2));

const listEntry = {
  slug: args.slug,
  hash,
  title: args.title,
  subtitle,
  image,
  date: args.date,
  link: args.link.split("?")[0], // strip Medium's `?source=rss-...`
};

console.log(`Wrote ${path.relative(ROOT, target)}`);
console.log("\nPaste this entry at the end of the `posts` array in lib/medium-list.json:\n");
console.log(JSON.stringify(listEntry, null, 2));
console.log("\nAfter saving medium-list.json, re-run scripts/refresh-feed.mjs to confirm the merge is a no-op:");
console.log("  MEDIUM_USERNAME=ali_farooqi node .agents/skills/medium-feed-refresh/scripts/refresh-feed.mjs");
