import { getMediumPosts } from "@/lib/medium";
import Breadcrumb from "@/app/components/Breadcrumb/Breadcrumb";
import BlogCard from "./BlogCard";
import "./style.scss";

export const metadata = {
  title: "Blog",
  description: "Read my blog.",
};

// Fully static at build: the committed snapshot is baked into each deployment,
// and new posts land via git push → rebuild (the Medium refresh workflow),
// never via ISR. The former revalidate = 43200 was vestigial — a re-render
// could only reproduce identical HTML and reopened the cold-render 500 path
// (issue #2).

export default async function Page() {
  const posts = await getMediumPosts();

  return (
    <section className="blog-section max-w-4xl mx-auto py-16 px-4">
      <Breadcrumb />
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter">My Blog</h1>
      <div className="grid md:grid-cols-2 gap-10">
        {posts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}
