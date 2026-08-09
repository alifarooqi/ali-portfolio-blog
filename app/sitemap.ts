import { getMediumPosts } from "@/lib/medium";

// Falls back through:
//   1. NEXT_PUBLIC_SITE_URL  — set explicitly on Vercel Production
//   2. NEXT_PUBLIC_VERCEL_URL — set to https://$VERCEL_URL on Vercel Preview
//      so each preview deploy advertises its own dynamic URL in metadata
//      (useful for OG card / sitemap smoke on per-branch deploys)
//   3. The hardcoded prod URL — dev/CI "just works" with no .env file
export const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.NEXT_PUBLIC_VERCEL_URL ??
  "https://alifarooqi.vercel.app";

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
