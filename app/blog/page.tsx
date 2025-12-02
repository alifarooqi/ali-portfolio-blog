import { getMediumPosts } from "@/lib/medium";

export const metadata = {
  title: 'Blog',
  description: 'Read my blog.',
}

export const revalidate = 3600; // revalidate once per hour

export default async function Page() {
  const posts = await getMediumPosts();

  return (
    <section>
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter">My Blog</h1>
      {posts.map((post) => (
        <a key={post.slug} href={`/blog/${post.slug}`}>
          <h2>{post.title}</h2>
          <p>{post.summary}</p>
          { post.date &&
            <p>{new Date(post.date).toDateString()}</p>
          }
        </a>
      ))}

    </section>
  )
}
