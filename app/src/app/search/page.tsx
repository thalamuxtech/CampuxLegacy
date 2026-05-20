'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search as SearchIcon } from 'lucide-react';
import { SiteNav } from '@/components/site-nav';
import { SiteFooter } from '@/components/site-footer';
import { Input } from '@/components/ui/input';
import { searchGraduates } from '@/lib/demo-data';

export default function SearchPage() {
  const [q, setQ] = useState('');
  const results = useMemo(() => searchGraduates(q), [q]);

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
              className="h-16 text-lg pl-14 rounded-2xl"
            />
          </div>
        </section>

        <section className="container mt-16">
          <p className="text-xs uppercase tracking-widest text-ink-400 mb-6">
            {results.length} result{results.length === 1 ? '' : 's'}
          </p>
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.03 } },
            }}
            className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4"
          >
            {results.map((g) => (
              <motion.div
                key={g.id}
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  show: { opacity: 1, y: 0 },
                }}
              >
                <Link
                  href={`/g/${g.id}`}
                  className="group block relative aspect-[4/5] overflow-hidden rounded-2xl bg-ink/5 ring-1 ring-ink/5 hover:ring-ink/20 hover:-translate-y-1 transition-all"
                >
                  <Image
                    src={g.portraitUrl}
                    alt={g.fullName}
                    fill
                    sizes="(min-width:1024px) 18vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/0" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 text-paper">
                    <p className="serif text-sm leading-tight truncate">
                      {g.fullName}
                    </p>
                    <p className="text-[10px] opacity-75 truncate">
                      {g.universityName} · {g.year}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
