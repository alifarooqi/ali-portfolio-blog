import Link from "next/link";

export default function NotFound() {
  return (
    // Center-middle the 404: flex column at full viewport height so the
    // heading, copy, and home link stack vertically in the visual center.
    // px-4 keeps the text well inside the viewport on narrow phones.
    <section className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">404 - Page Not Found</h1>
      <p className="mb-4">The page you are looking for does not exist.</p>
      <Link href="/" className="link-underline">
        ← Back home
      </Link>
    </section>
  );
}
