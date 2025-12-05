import { notFound } from 'next/navigation'
import { formatDate } from 'app/blog/utils'
import { baseUrl } from 'app/sitemap'
import { getMediumPost, getMediumPosts } from '@/lib/medium';
import Breadcrumb from '@/app/components/Breadcrumb/Breadcrumb';
import AboutWriter from '@/app/components/AboutWriter';
import './style.scss';

export const revalidate = 12*3600; // revalidate once per hour

export async function generateStaticParams() {
  let posts = await getMediumPosts()
  return posts.map((post) => ({ slug: post.slug }));
}

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props) {
  const post = await getMediumPost(params.slug);
  if (!post) {
    return
  }

  // Derive commonly used metadata values from the fetched post
  const title = post.title ?? 'Blogs | Ali Farooqi'
  const description = post.summary
  const publishedTime = post.date

  const ogImage = post.image ?? `${baseUrl}/preview-card.jpg?title=${encodeURIComponent(title)}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime,
      url: `${baseUrl}/blog/${post.slug}`,
      images: [
        {
          url: ogImage,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}

async function Blog({ params }: Props) {
  let post = await getMediumPost(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <section className="blog-post-section">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            datePublished: post.date,
            dateModified: post.date,
            description: post.summary,
            image: post.image ?? `${baseUrl}/preview-card.jpg?title=${encodeURIComponent(post.title ?? 'Blog | Ali Farooqi')}`,
            url: `${baseUrl}/blog/${post.slug}`,
            author: {
              '@type': 'Ali Farooqi',
              name: 'My Portfolio & Blog',
            },
          }),
        }}
      />
      <div className="max-w-3xl mx-auto py-12 px-4">
        <Breadcrumb />
        <h1 className="title font-bold text-4xl tracking-tighter">
          {post.title}
        </h1>
        <div className="flex justify-between items-center mt-2 mb-8 text-sm">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {formatDate(post.date, true)}
          </p>
        </div>
        <article className="medium-content prose max-w-none" dangerouslySetInnerHTML={{ __html: post.content ?? '' }} />
        <AboutWriter link={post.link} />
      </div>
    </section>
  )
}

export default Blog;