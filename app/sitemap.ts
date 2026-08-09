import { getMediumPosts } from "@/lib/medium";

// Falls back to the prod URL so dev/preview "just works" without an .env
// file. Vercel production sets NEXT_PUBLIC_SITE_URL explicitly so metadata,
// sitemap, and JSON-LD always carry the canonical URL.
export const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://alifarooqi.vercel.app";

// 12h. Duplicated across blog/page.tsx, blog/[slug]/page.tsx, og/route.tsx —
// Next.js requires literals here; see lib/revalidate.ts for the source of truth.
export const revalidate = 43200;

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
