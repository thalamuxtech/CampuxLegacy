'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { demoUniversities } from '@/lib/demo-data';

const EASE = [0.16, 1, 0.3, 1] as const;

export function ClassPreview() {
  return (
    <section className="py-24 sm:py-32">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: EASE }}
          className="flex items-end justify-between gap-6 flex-wrap"
        >
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-accent font-medium">
              · Enrolled universities
            </p>
            <h2 className="serif text-4xl sm:text-5xl lg:text-6xl mt-4 max-w-xl leading-[1.05]">
              Browse the institutions already preserving their{' '}
              <span className="italic text-accent">legacy</span>.
            </h2>
          </div>
          <Link
            href="/universities"
            className="text-sm font-medium link-grow inline-flex items-center gap-1.5 text-ink"
          >
            See all <ArrowUpRight className="h-4 w-4" />
          </Link>
        </motion.div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {demoUniversities.map((u, i) => (
            <motion.div
              key={u.id}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.08, duration: 0.9, ease: EASE }}
            >
              <Link
                href={`/universities/${u.slug}`}
                className="group relative block rounded-3xl overflow-hidden glass-card transition-all duration-500 ease-editorial hover:-translate-y-1.5 hover:shadow-glass"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={u.coverImage!}
                    alt={u.name}
                    fill
                    sizes="(min-width:1024px) 25vw, 50vw"
                    className="object-cover transition-transform duration-[1200ms] ease-editorial group-hover:scale-110"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(180deg, transparent 38%, ${u.branding?.primary ?? '#1C1410'}E6 100%)`,
                    }}
                  />
                  <div className="absolute bottom-4 left-4 right-4 text-paper">
                    <p className="text-[10px] uppercase tracking-[0.18em] opacity-80">
                      {u.city}, {u.country}
                    </p>
                    <p className="serif text-xl mt-1.5 leading-tight">{u.name}</p>
                  </div>
                </div>
                <div className="p-5 flex items-center justify-between">
                  <div className="flex gap-4 text-xs text-ink/65">
                    <span>
                      <b className="text-ink font-semibold">
                        {u.graduatesCount.toLocaleString()}
                      </b>{' '}
                      graduates
                    </span>
                    <span>
                      <b className="text-ink font-semibold">{u.classesCount}</b>{' '}
                      classes
                    </span>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-ink/40 group-hover:text-accent transition-all duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
