'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import type { Graduate } from '@/lib/types';
import { Input } from '@/components/ui/input';

export function GraduateGrid({ graduates }: { graduates: Graduate[] }) {
  const [q, setQ] = useState('');
  const [dept, setDept] = useState<string | null>(null);

  const departments = useMemo(
    () =>
      Array.from(new Set(graduates.map((g) => g.departmentName))).sort(),
    [graduates]
  );

  const filtered = useMemo(() => {
    const needle = q.toLowerCase();
    return graduates.filter((g) => {
      if (dept && g.departmentName !== dept) return false;
      if (!needle) return true;
      return (
        g.fullName.toLowerCase().includes(needle) ||
        g.departmentName.toLowerCase().includes(needle)
      );
    });
  }, [graduates, q, dept]);

  return (
    <div>
      <div className="grid lg:grid-cols-[260px_1fr] gap-8">
        {/* Filter rail */}
        <aside className="lg:sticky lg:top-28 self-start">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name…"
              className="pl-11"
            />
          </div>

          <p className="mt-6 text-xs uppercase tracking-widest text-ink-400">
            Departments
          </p>
          <ul className="mt-3 space-y-1 max-h-[60vh] overflow-auto pr-2">
            <li>
              <button
                onClick={() => setDept(null)}
                className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${
                  dept === null
                    ? 'bg-ink text-paper'
                    : 'hover:bg-ink/5 text-ink-700'
                }`}
              >
                All ({graduates.length})
              </button>
            </li>
            {departments.map((d) => {
              const count = graduates.filter(
                (g) => g.departmentName === d
              ).length;
              return (
                <li key={d}>
                  <button
                    onClick={() => setDept(d)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${
                      dept === d
                        ? 'bg-ink text-paper'
                        : 'hover:bg-ink/5 text-ink-700'
                    }`}
                  >
                    <span className="block truncate">{d}</span>
                    <span className="text-xs opacity-60">{count}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Mosaic grid */}
        <div>
          {filtered.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-ink/15 p-16 text-center text-ink-500">
              No graduates match your search.
            </div>
          ) : (
            <motion.div
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.03 } },
              }}
              className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4"
            >
              {filtered.map((g) => (
                <motion.div
                  key={g.id}
                  variants={{
                    hidden: { opacity: 0, y: 12 },
                    show: { opacity: 1, y: 0 },
                  }}
                >
                  <Link
                    href={`/g/${g.id}`}
                    className="group block relative aspect-[4/5] overflow-hidden rounded-2xl bg-ink/5 ring-1 ring-ink/5 transition-all hover:ring-ink/20 hover:-translate-y-1"
                  >
                    <Image
                      src={g.portraitUrl}
                      alt={g.fullName}
                      fill
                      sizes="(min-width:1280px) 18vw, (min-width:640px) 25vw, 50vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/0 opacity-90 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 text-paper">
                      <p className="serif text-sm leading-tight truncate">
                        {g.fullName}
                      </p>
                      <p className="text-[10px] opacity-75 truncate">
                        {g.departmentName}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
