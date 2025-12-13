import { getMediumPosts } from "@/lib/medium";

export const baseUrl = "https://alifarooqi.vercel.app";

export const revalidate = 12 * 3600; // regenerate every hour

export default async function sitemap() {
  const posts = await getMediumPosts();
  const blogs = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.date
      ? new Date(post.date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
  }));

  const routes = ["", "/blog"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split("T")[0],
  }));

  return [...routes, ...blogs];
}
