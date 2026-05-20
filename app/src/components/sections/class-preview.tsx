'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { demoUniversities } from '@/lib/demo-data';

export function ClassPreview() {
  return (
    <section className="py-24 sm:py-32">
      <div className="container">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-accent-700">
              Enrolled universities
            </p>
            <h2 className="serif text-4xl sm:text-5xl mt-3 max-w-xl">
              Browse the institutions already preserving their legacy.
            </h2>
          </div>
          <Link
            href="/universities"
            className="text-sm font-medium underline-offset-4 hover:underline inline-flex items-center gap-1"
          >
            See all <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {demoUniversities.map((u, i) => (
            <motion.div
              key={u.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.07, duration: 0.7 }}
            >
              <Link
                href={`/universities/${u.slug}`}
                className="group block rounded-3xl overflow-hidden bg-white border border-ink/10 hover:border-ink/25 transition-all hover:-translate-y-1"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={u.coverImage!}
                    alt={u.name}
                    fill
                    sizes="(min-width:1024px) 25vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(180deg, transparent 40%, ${u.branding?.primary ?? '#0B0B0F'}E6 100%)`,
                    }}
                  />
                  <div className="absolute bottom-4 left-4 right-4 text-paper">
                    <p className="text-xs opacity-75">{u.city}, {u.country}</p>
                    <p className="serif text-xl mt-1 leading-tight">{u.name}</p>
                  </div>
                </div>
                <div className="p-5 flex items-center justify-between">
                  <div className="flex gap-4 text-xs text-ink-600">
                    <span><b className="text-ink">{u.graduatesCount.toLocaleString()}</b> graduates</span>
                    <span><b className="text-ink">{u.classesCount}</b> classes</span>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-ink-400 group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
