import Parser from "rss-parser";
import mediumFeed from './medium-feed.json' // Updated from: https://rss2json.com/#rss_url=https%3A%2F%2Fmedium.com%2Ffeed%2F%40ali_farooqi

const MY_USERNAME = "ali_farooqi";

type MediumPost = Partial<{
    title: string;
    link: string;
    content: string; // full HTML content
    date: string;
    slug: string;
    summary: string;
    image: string;
}>;

let cachedPosts: MediumPost[]= [];
let cacheTime = 0;
const CACHE_DURATION = 12 * 1000 * 60 * 60; // 1 hour (same as revalidate = 12*3600)


export async function getMediumPosts(): Promise<MediumPost[]> {
    const now = Date.now();

    if (cachedPosts?.length && now - cacheTime < CACHE_DURATION) {
        console.log("Returning cached Medium posts");
        return cachedPosts;
    }
    
    const parser = new Parser();
    try {
        const feed = await parser.parseURL(`https://medium.com/feed/@${MY_USERNAME}`);

        const posts = parseMediumFeed(feed);
        cachedPosts = posts;
        cacheTime = now;

        return posts;
    } catch (error) {
        console.error("Error fetching Medium posts:", error);
        return parseMediumFeed(mediumFeed);
    }
}

function parseMediumFeed(feed: Record<string, any>): MediumPost[] {
    const posts = feed.items.map((item) => {
        const content = item['content:encoded'] || item.content || '';  // full HTML
        const summary = content.replace(/<[^>]+>/g, ' ').slice(0, 160) + '...'; // plain text summary
        const image = content.match(/<img[^>]+src="([^">]+)"/)?.[1] || null;
        const mediumPost: MediumPost = {
            title: item.title,
            link: item.link,
            content,
            summary,
            image,
            date: item.isoDate,
            slug: item.link?.split("?")[0]?.split("/").pop(), // Medium uses GUID slugs
        }
        return mediumPost;
    });
    return posts;
}

export async function getMediumPost(slug: string) {
  const posts = await getMediumPosts();
  return posts.find((p) => p.slug === slug);
}
