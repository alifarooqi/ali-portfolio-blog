import Parser from "rss-parser";
import mediumFeed from "./medium-feed.json"; // Updated from: https://rss2json.com/#rss_url=https%3A%2F%2Fmedium.com%2Ffeed%2F%40ali_farooqi

const MY_USERNAME = process.env.MEDIUM_USERNAME ?? "ali_farooqi";

export type MediumPost = Partial<{
  title: string;
  link: string;
  content: string; // full HTML content
  date: string;
  slug: string;
  summary: string;
  image: string;
}>;

// No module-level cache: on Vercel serverless, in-memory state does not persist
// across invocations anyway, and ISR (`revalidate = 12 * 3600` on the routes)
// is the actual caching layer. See lib/revalidate.ts.
export async function getMediumPosts(): Promise<MediumPost[]> {
  const parser = new Parser();
  try {
    const feed = await parser.parseURL(`https://medium.com/feed/@${MY_USERNAME}`);
    return parseMediumFeed(feed);
  } catch (error) {
    console.error("Error fetching Medium posts:", error);
    return parseMediumFeed(mediumFeed);
  }
}

// TODO
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseMediumFeed(feed: Parser.Output<any>): MediumPost[] {
  const posts = feed.items.map((item) => {
    const content = item["content:encoded"] || item.content || ""; // full HTML
    const summary = content.replace(/<[^>]+>/g, " ").slice(0, 160) + "..."; // plain text summary
    const image = content.match(/<img[^>]+src="([^">]+)"/)?.[1] || null;
    const mediumPost: MediumPost = {
      title: item.title,
      link: item.link,
      content,
      summary,
      image,
      date: item.isoDate,
      slug: item.link?.split("?")[0]?.split("/").pop(), // Medium uses GUID slugs
    };
    return mediumPost;
  });
  return posts;
}

export async function getMediumPost(slug: string) {
  const posts = await getMediumPosts();
  return posts.find((p) => p.slug === slug);
}
