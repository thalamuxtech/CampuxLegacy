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
import { SplitText } from '@/components/motion/split-text';
import { AccentReveal } from '@/components/motion/accent-reveal';

const EASE = [0.16, 1, 0.3, 1] as const;

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
    <section className="relative py-24 sm:py-32 overflow-hidden">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ink/10 to-transparent" />
      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: EASE }}
          className="max-w-2xl"
        >
          <p className="text-xs uppercase tracking-[0.22em] text-accent font-medium">
            · How it works
          </p>
          <h2 className="serif text-4xl sm:text-5xl lg:text-6xl mt-4 leading-[1.05]">
            <SplitText text="Six careful stages, from agreement to " />
            <AccentReveal>archive</AccentReveal>
            <SplitText text="." whileInView={false} />
          </h2>
        </motion.div>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.07, duration: 0.8, ease: EASE }}
              whileHover={{ y: -6 }}
              className="group relative overflow-hidden rounded-3xl glass-card p-7 transition-shadow duration-500 hover:shadow-glass"
            >
              {/* Step numeral as a watermark */}
              <div className="absolute right-6 top-4 text-[72px] serif text-ink/[0.06] leading-none select-none pointer-events-none">
                0{i + 1}
              </div>
              {/* Subtle terracotta wash on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent/0 to-accent/0 group-hover:from-accent/[0.04] group-hover:to-ochre/[0.04] transition-colors duration-700 pointer-events-none" />
              <div className="relative">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-ink/5 text-ink ring-1 ring-ink/5 transition-all duration-500 group-hover:bg-accent group-hover:text-paper group-hover:ring-accent/20 group-hover:scale-105">
                  <s.icon className="h-5 w-5" />
                </div>
                <p className="serif text-2xl mt-6 leading-tight">{s.title}</p>
                <p className="mt-3 text-ink/65 text-sm leading-relaxed">
                  {s.body}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
