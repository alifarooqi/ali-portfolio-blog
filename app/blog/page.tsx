import { getMediumPosts } from "@/lib/medium";
import Link from "next/link";
import Breadcrumb from '@/app/components/Breadcrumb/Breadcrumb';
import './style.scss';

export const metadata = {
  title: 'Blog',
  description: 'Read my blog.',
}

export const revalidate = 12*3600; // revalidate once per 12-hours

export default async function Page() {
  const posts = await getMediumPosts();

  return (
    <section className="blog-section max-w-4xl mx-auto py-16 px-4">
      <Breadcrumb />
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter">My Blog</h1>
      <div className="grid md:grid-cols-2 gap-10">
        {posts.map((post) => (
          <Link 
            key={post.slug} 
            href={`/blog/${post.slug}`}
            className="
              group 
              block 
              rounded-xl 
              overflow-hidden 
              shadow-sm 
              transition-all 
              duration-300 
              hover:shadow-xl 
              hover:-translate-y-1 
              hover:scale-[1.02]
              !no-underline
              blog-card
            "
          >
            {post.image && (
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-48 object-cover opacity-80 transition-all duration-300 group-hover:opacity-100"
              />
            )}
            <div className="p-5">
              <h2 className="text-xl font-semibold">{post.title}</h2>
              { post.date &&
                <p className="text-sm mt-1 italic">
                  {new Date(post.date).toDateString()}
                </p>
              }
              <p className="mt-3 line-clamp-3">{post.summary}</p>

            </div>
          </Link>
        ))}
      </div>

    </section>
  )
}
