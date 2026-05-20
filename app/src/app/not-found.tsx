import Link from 'next/link';
import { SiteNav } from '@/components/site-nav';
import { SiteFooter } from '@/components/site-footer';

export default function NotFound() {
  return (
    <>
      <SiteNav />
      <main className="min-h-[70vh] grid place-items-center text-center px-6 pt-28">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-accent-700">
            404
          </p>
          <h1 className="serif text-6xl sm:text-8xl mt-3 leading-none">
            Sealed elsewhere.
          </h1>
          <p className="mt-5 text-ink-600 max-w-md mx-auto">
            That memory may live in another part of the archive — or might not
            exist yet. Try one of these instead:
          </p>
          <div className="mt-10 flex gap-3 justify-center flex-wrap">
            <Link
              href="/"
              className="rounded-full bg-ink text-paper px-5 py-2.5 text-sm hover:bg-ink/90"
            >
              ← Back home
            </Link>
            <Link
              href="/universities"
              className="rounded-full border border-ink/15 px-5 py-2.5 text-sm hover:border-ink/40"
            >
              Browse universities
            </Link>
            <Link
              href="/search"
              className="rounded-full border border-ink/15 px-5 py-2.5 text-sm hover:border-ink/40"
            >
              Search graduates
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
