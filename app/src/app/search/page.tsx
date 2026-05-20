'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search as SearchIcon, X } from 'lucide-react';
import { SiteNav } from '@/components/site-nav';
import { SiteFooter } from '@/components/site-footer';
import { Input } from '@/components/ui/input';

type Result = {
  id: string;
  fullName: string;
  universityName?: string;
  departmentName?: string;
  year: number;
  portraitUrl?: string;
};

export default function SearchPage() {
  const [q, setQ] = useState('');
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Debounced fetch
  useEffect(() => {
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setLoading(true);
    setError(null);
    const id = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, {
          signal: ctrl.signal,
        });
        if (!res.ok) throw new Error('Search unavailable');
        const data = (await res.json()) as { results: Result[] };
        setResults(data.results ?? []);
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
        setError('Could not load results. Try again.');
      } finally {
        if (!ctrl.signal.aborted) setLoading(false);
      }
    }, 220);
    return () => {
      clearTimeout(id);
      ctrl.abort();
    };
  }, [q]);

  const showEmpty = !loading && !error && results.length === 0;
  const countLabel = useMemo(() => {
    if (loading) return 'Searching…';
    return `${results.length} result${results.length === 1 ? '' : 's'}`;
  }, [loading, results.length]);

  return (
    <>
      <SiteNav />
      <main className="pt-28 sm:pt-36">
        <section className="container">
          <p className="text-xs uppercase tracking-[0.2em] text-accent-700">
            Discover
          </p>
          <h1 className="serif text-5xl sm:text-7xl mt-3 max-w-2xl">
            Find anyone, anywhere.
          </h1>
          <p className="mt-4 text-ink-600 max-w-lg">
            Search across graduates, universities, departments and classes.
          </p>

          <div className="mt-10 relative max-w-2xl">
            <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-ink-400" />
            <Input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Try a name, department or year…"
              className="h-16 text-lg pl-14 pr-12 rounded-2xl"
            />
            {q && (
              <button
                onClick={() => setQ('')}
                aria-label="Clear"
                className="absolute right-4 top-1/2 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-full hover:bg-ink/5 text-ink-500"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </section>

        <section className="container mt-16">
          <p className="text-xs uppercase tracking-widest text-ink-400 mb-6">
            {countLabel}
          </p>

          {error && (
            <div className="rounded-3xl border border-rose/30 bg-rose/[0.04] p-8 text-center text-rose">
              {error}
            </div>
          )}

          {loading && results.length === 0 && (
            <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[4/5] rounded-2xl bg-ink/5 animate-pulse"
                />
              ))}
            </div>
          )}

          {showEmpty && (
            <div className="rounded-3xl border border-dashed border-ink/15 p-16 text-center text-ink-500">
              <p className="serif text-2xl">No matches.</p>
              <p className="mt-2 text-sm">
                {q
                  ? 'Try a shorter query, or check the spelling.'
                  : 'Type a name to begin.'}
              </p>
            </div>
          )}

          <motion.div
            layout
            className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4"
          >
            <AnimatePresence initial={false}>
              {results.map((g) => (
                <motion.div
                  key={g.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                >
                  <Link
                    href={`/g/${g.id}`}
                    className="group block relative aspect-[4/5] overflow-hidden rounded-2xl bg-ink/5 ring-1 ring-ink/5 hover:ring-ink/20 hover:-translate-y-1 transition-all"
                  >
                    {g.portraitUrl ? (
                      <Image
                        src={g.portraitUrl}
                        alt={g.fullName}
                        fill
                        sizes="(min-width:1024px) 18vw, 50vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-ink/40 to-ink/80" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/0" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 text-paper">
                      <p className="serif text-sm leading-tight truncate">
                        {g.fullName}
                      </p>
                      <p className="text-[10px] opacity-75 truncate">
                        {g.universityName}
                        {g.year ? ` · ${g.year}` : ''}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
