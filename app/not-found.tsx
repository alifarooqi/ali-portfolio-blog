import Link from "next/link";

export default function NotFound() {
  return (
    // Fill the available space (viewport height minus footer) so the
    // footer stays visible without scrolling on mobile. Center the
    // heading + copy + link within. `px-4` keeps the text inside the
    // viewport on narrow phones; `text-center` centers horizontally too.
    <section className="flex flex-1 flex-col items-center justify-center px-4 text-center">
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">404 - Page Not Found</h1>
      <p className="mb-4">The page you are looking for does not exist.</p>
      <Link href="/" className="link-underline">
        ← Back home
      </Link>
    </section>
  );
}
