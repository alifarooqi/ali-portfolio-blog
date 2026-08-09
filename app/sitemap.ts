import { getMediumPosts } from "@/lib/medium";

// Resolves the canonical site URL. Priority:
//   1. NEXT_PUBLIC_SITE_URL  — set explicitly on Vercel Production
//   2. NEXT_PUBLIC_VERCEL_URL — manual override (rarely needed)
//   3. VERCEL_URL             — auto-injected by Vercel on every deploy
//                              (bare hostname, no protocol — prefixed here)
//   4. The hardcoded prod URL — dev/CI "just works" with no .env file
//
// Reading VERCEL_URL directly (rather than relying on $VERCEL_URL expansion
// in an env-var value) is the reliable path — Vercel only expands `$VAR`
// references for vars you've explicitly defined, not system-provided ones.
function resolveBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.NEXT_PUBLIC_VERCEL_URL) return process.env.NEXT_PUBLIC_VERCEL_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "https://alifarooqi.vercel.app";
}

export const baseUrl = resolveBaseUrl();

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
