'use client';

import { motion } from 'framer-motion';
import { demoUniversities } from '@/lib/demo-data';

export function TrustStrip() {
  return (
    <section className="border-y border-ink/10 bg-paper/50">
      <div className="container py-10">
        <p className="text-center text-xs uppercase tracking-[0.2em] text-ink-400">
          Trusted by universities across Africa
        </p>
        <motion.ul
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.06 } },
          }}
          className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4"
        >
          {demoUniversities.map((u) => (
            <motion.li
              key={u.id}
              variants={{
                hidden: { opacity: 0, y: 8 },
                show: { opacity: 1, y: 0 },
              }}
              className="serif text-lg sm:text-xl text-ink-700"
            >
              {u.name}
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
