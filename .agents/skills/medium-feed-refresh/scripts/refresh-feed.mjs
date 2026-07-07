import Parser from 'rss-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function run() {
  const parser = new Parser();
  try {
    const feed = await parser.parseURL('https://medium.com/feed/@ali_farooqi');
    // Save feed structure in format that lib/medium.ts expects:
    // parseMediumFeed expects Parser.Output<any> which has items array.
    const targetPath = path.resolve(__dirname, '../../../../lib/medium-feed.json');
    fs.writeFileSync(targetPath, JSON.stringify(feed, null, 2));
    console.log(`Successfully updated Medium feed fallback at: ${targetPath}`);
  } catch (err) {
    console.error('Failed to refresh Medium feed:', err);
    process.exit(1);
  }
}

run();
