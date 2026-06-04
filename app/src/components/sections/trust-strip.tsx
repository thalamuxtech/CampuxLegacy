'use client';

import { motion } from 'framer-motion';
import { demoUniversities } from '@/lib/demo-data';

const EASE = [0.16, 1, 0.3, 1] as const;

export function TrustStrip() {
  return (
    <section className="relative border-y border-ink/10 bg-paper-50/60 overflow-hidden">
      <div aria-hidden className="absolute inset-0 bg-grain opacity-30" />
      <div className="container py-12 sm:py-14 relative">
        <p className="text-center text-[11px] uppercase tracking-[0.28em] text-ink/50 font-medium">
          Trusted by universities across Africa
        </p>
        <motion.ul
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
          }}
          className="mt-7 flex flex-wrap items-center justify-center gap-x-12 gap-y-4"
        >
          {demoUniversities.map((u) => (
            <motion.li
              key={u.id}
              variants={{
                hidden: { opacity: 0, y: 10 },
                show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
              }}
              className="serif text-lg sm:text-xl text-ink/75"
            >
              {u.name}
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
