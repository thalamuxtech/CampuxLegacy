import Link from 'next/link';
import { SiteNav } from '@/components/site-nav';

export default function NotFound() {
  return (
    <>
      <SiteNav />
      <main className="min-h-dvh grid place-items-center text-center px-6">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-accent-700">
            404
          </p>
          <h1 className="serif text-6xl mt-3">Page not found.</h1>
          <p className="mt-3 text-ink-600">
            That memory may have been sealed elsewhere.
          </p>
          <Link
            href="/"
            className="inline-block mt-8 underline underline-offset-4"
          >
            ← Back home
          </Link>
        </div>
      </main>
    </>
  );
}
