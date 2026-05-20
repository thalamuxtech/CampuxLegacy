'use client';

import { motion } from 'framer-motion';
import {
  HandshakeIcon,
  Database,
  Wand2,
  ClipboardCheck,
  Rocket,
  Lock,
} from 'lucide-react';

const steps = [
  {
    icon: HandshakeIcon,
    title: 'Initial agreement',
    body: 'Align with the university on branding, access level, and rollout plan.',
  },
  {
    icon: Database,
    title: 'Data collection',
    body: 'Gather student records, portraits, media, and institutional content.',
  },
  {
    icon: Wand2,
    title: 'Implementation',
    body: 'Set up the digital yearbook portal and customise the experience.',
  },
  {
    icon: ClipboardCheck,
    title: 'Review & approve',
    body: 'Verify profiles. Students confirm what is shown publicly.',
  },
  {
    icon: Rocket,
    title: 'Launch',
    body: 'Officially publish the yearbook for the graduating set.',
  },
  {
    icon: Lock,
    title: 'Sealed archive',
    body: 'Preserve each class as a lasting digital legacy. Forever.',
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 sm:py-32">
      <div className="container">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.2em] text-accent-700">
            How it works
          </p>
          <h2 className="serif text-4xl sm:text-5xl mt-3">
            Six careful stages, from agreement to archive.
          </h2>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.06, duration: 0.6, ease: 'easeOut' }}
              className="group relative overflow-hidden rounded-3xl border border-ink/10 bg-white p-7 transition-all hover:border-ink/25 hover:-translate-y-1"
            >
              <div className="absolute right-6 top-6 text-[64px] serif text-ink/5 leading-none">
                0{i + 1}
              </div>
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-ink/5 text-ink group-hover:bg-accent group-hover:text-white transition-colors">
                <s.icon className="h-5 w-5" />
              </div>
              <p className="serif text-2xl mt-6">{s.title}</p>
              <p className="mt-2 text-ink-600 text-sm leading-relaxed">
                {s.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
